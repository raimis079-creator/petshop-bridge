# Retry queue architektūra — Petshop Event Layer

**Tikslas:** ESP gedimas (Sender API down, rate limit, auth klaida) NĖRA duomenų praradimas.
Neišsiųsti eventai lieka eilėje ir bandomi vėliau. Po max attempts — Dead Letter Queue + alert, ne tyliai numestas.

Šis dokumentas — geležinės taisyklės techninis įgyvendinimas.

---

## Pagrindiniai reikalavimai

1. **Emit ≠ Send.** Petshop-core kviečia `emit_event()` sinchroniškai (greitai grįžta), bet realus siuntimas į ESP vyksta asinchroniškai (per Action Scheduler cron).
2. Klientas nesuges jei ESP down — checkout puslapis neužstrigs.
3. Kiekvienas retry — atskiras attempt su timestamp'u ir klaidos priežastimi (auditavimui).
4. Backoff eksponentinis, bet su MAX cap.
5. Po `max_attempts` — DLQ, ne tyliai numestas.
6. Retry queue būklė matoma health dashboard'e (TŽ v1.47).

---

## Būsenų automatas

```
       [emit_event kviečiamas]
              │
              ▼
        ┌──────────┐
        │ pending  │◄─────────┐
        └────┬─────┘          │
             │                 │
   [worker paima, kviečia ESP] │
             │                 │
     ┌───────┴────────┐        │
     │                │        │
  [success]      [failed]      │
     │                │        │
     ▼         ┌──────┴──────┐ │
  ┌──────┐    │             │ │
  │ sent │    │ retriable?  │ │
  └──────┘    │             │ │
              ├── yes ──────┘
              │
              ▼
          ┌────────┐
          │ failed │─── (attempts < max) ──► pending (next_retry_at nustatytas)
          └────┬───┘
               │
          (attempts >= max)
               │
               ▼
           ┌──────┐
           │ dead │ → DLQ, admin alert
           └──────┘
```

`dedup` būsena grįžta tiesiai iš emit'inimo momento (UNIQUE key smūgis), į retry queue nepatenka.

---

## Backoff seka

Attempts: **7 iš viso**, tarpai eksponentiniai su jitter (±20% random):

| Attempt | Delay nuo prieš tai | Kumuliatyviai nuo pirmo bandymo |
|---|---|---|
| 1 | 0 (iškart worker paima) | 0 |
| 2 | 1 min | 1 min |
| 3 | 5 min | 6 min |
| 4 | 30 min | 36 min |
| 5 | 2 val | ~2:36 val |
| 6 | 6 val | ~8:36 val |
| 7 | 24 val | ~32:36 val |
| dead | — | po 7-o bandymo |

Jei per ~33 val Sender neatsigauna — didesnė bėda nei retry queue gali spręsti; admin alert'as reikalingas.

---

## Kokios klaidos retriable, kokios ne

**Retriable (grąžina back į pending su next_retry_at):**
- HTTP 5xx (server error)
- HTTP 429 (rate limit) — naudoja `Retry-After` antraštę jei yra, kitaip standartinį backoff
- Network timeout / connection refused / DNS fail
- HTTP 408, 502, 503, 504

**Ne retriable (iškart į dead):**
- HTTP 400 (bad request) — mūsų payload klaida, retry neišspręs
- HTTP 401 (auth) — API tokens sugedę, admin turi žinoti iškart
- HTTP 403 (forbidden) — permissions problema
- HTTP 404 (endpoint) — dokumentacijos/versijos klaida
- HTTP 422 (validation) — payload schema neatitinka
- Sender specific: „quota exceeded" jei suprantam kad plano limitas

Konkretų map'ą sudarysim POC metu, kai matysim kokias klaidas Sender iš tikrųjų grąžina.

---

## Techninis įgyvendinimas

### Action Scheduler (jau įdiegtas kartu su WooCommerce)

Naudojam vietoj custom cron — geriau logging'as, admin UI, konkurencijos apsauga.

```php
// Emit'inimo metu (sinchroniškai — greitai grįžta)
function ps_emit_event( $email, $event_id, $event_name, $payload ) {
    global $wpdb;

    // 1. Insert į event_log (UNIQUE key apsauga nuo dubliavimo)
    $inserted = $wpdb->query( $wpdb->prepare(
        "INSERT IGNORE INTO {$wpdb->prefix}ps_event_log
         (event_id, event_name, email, payload_json, emitted_at, status, adapter_name)
         VALUES (%s, %s, %s, %s, NOW(), 'pending', %s)",
        $event_id, $event_name, $email, wp_json_encode( $payload ), ps_get_active_adapter_name()
    ) );

    if ( ! $inserted ) {
        return [ 'status' => 'dedup', 'already_processed' => true ];
    }

    // 2. Suplanuoti asinchroninį siuntimą
    as_enqueue_async_action( 'ps_process_event', [ $wpdb->insert_id ], 'petshop-esp' );

    return [ 'status' => 'pending', 'queue_id' => $wpdb->insert_id ];
}

// Worker handler
add_action( 'ps_process_event', 'ps_process_event_handler', 10, 1 );
function ps_process_event_handler( $queue_id ) {
    $row = ps_get_queue_row( $queue_id );
    if ( ! $row || $row->status !== 'pending' ) { return; }

    $adapter = ps_get_active_adapter();

    if ( ! $adapter->is_operational() ) {
        // ESP down — iš karto reschedule, be attempt'o inkrementavimo
        as_schedule_single_action( time() + 60, 'ps_process_event', [ $queue_id ], 'petshop-esp' );
        return;
    }

    $result = $adapter->emit_event(
        $row->email, $row->event_id, $row->event_name,
        json_decode( $row->payload_json, true ), strtotime( $row->emitted_at )
    );

    if ( $result->success ) {
        ps_mark_sent( $queue_id, $result );
    } elseif ( $result->already_processed ) {
        ps_mark_dedup( $queue_id );
    } elseif ( $result->should_retry && $row->attempts < 6 ) {
        ps_schedule_retry( $queue_id, $row->attempts + 1 );
    } else {
        ps_mark_dead( $queue_id, $result );
        ps_alert_dlq( $queue_id, $result );
    }
}
```

### Backoff funkcija

```php
function ps_calc_next_retry_seconds( int $attempt ): int {
    $base = match( $attempt ) {
        1 => 60,       // 1 min
        2 => 300,      // 5 min
        3 => 1800,     // 30 min
        4 => 7200,     // 2 val
        5 => 21600,    // 6 val
        6 => 86400,    // 24 val
        default => 86400,
    };
    // ±20% jitter — kad daugybė failed'ų netriggerintų vienu momentu
    $jitter = mt_rand( -20, 20 ) / 100;
    return (int) round( $base * ( 1 + $jitter ) );
}
```

---

## Dead Letter Queue (DLQ)

Kai eventas pasiekia `dead` būseną:

1. **Statusas** — `dead`, `esp_response` išsaugotas paskutinis error message.
2. **Admin alert** — email į `terra@gyvunai.lt` (technical admin, ne customer-facing):
   - Event ID
   - Emit timestamp
   - Kelintas attempt sudegė
   - ESP klaidos tekstas
3. **Metrikas** — DLQ dydis rodomas health dashboard'e (>0 = raudonas šviesoforas).
4. **Rankinis intervention** — admin UI su galimybe:
   - **Retry** (grąžinti į pending, attempt counter atstatyti)
   - **Discard** (pripažinti nekritišką, palikti dead)
   - **Inspect** (žiūrėti pilną payload + klaidas)

Šio UI POC metu **NEBŪTINA** — pakanka SQL query. Bet acceptance kriterijų list'e turi būti kaip Etapo B užduotis.

---

## Health dashboard metrikos (TŽ v1.47)

Retry queue rodo šias metrikas per savaitinį health check:

| Metrika | Žalias | Geltonas | Raudonas |
|---|---|---|---|
| Pending eventų amžius (P95) | <5 min | 5–60 min | >60 min |
| Failed eventų kiekis (24h) | <0.5% viso | 0.5–2% | >2% |
| Dead letter queue dydis | 0 | 1–5 | >5 |
| ESP API average response | <500ms | 500–2000ms | >2000ms |
| Rate limit hits (24h) | 0 | 1–10 | >10 |

Raudonas bet kurioje → savaitinis dashboard'as praneša adminui.

---

## Testas Nr. 11 (geležinė taisyklė)

Kaip patikrinsim POC metu:

1. Sukurti 20 skirtingų eventų per 60 sek. (order_paid, cart_abandoned, refill_due mix'as).
2. **Deaktyvuoti Sender API tokeną** vidury proceso (imituoja auth failą / ESP down).
3. Patikrinti kad Woo pusėje jokie klientai nesuges, checkout veikia.
4. Patikrinti kad neišsiųsti eventai:
   - Yra `ps_event_log` su `status=pending` arba `failed`
   - Turi `next_retry_at` nustatytą pagal backoff seką
5. **Reaktyvuoti API tokeną**.
6. Palaukti kol worker paims — visi 20 eventų turi pasiekti `sent` būseną.
7. Rankiniu būdu emit'inti tuos pačius 20 event_id — visi grąžinti `already_processed=true`.

Jei šis testas praeina, geležinė taisyklė patvirtinta.
