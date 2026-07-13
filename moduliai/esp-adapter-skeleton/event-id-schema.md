# Event ID schema — Petshop Event Layer

**Tikslas:** kiekvienas emit'inamas eventas turi unikalų `event_id`, kad
- (a) tas pats `order_paid` ar `subscription_t5_notice` nebūtų išsiųstas du kartus, net jei retry queue jį pabandys iš naujo;
- (b) ESP failo atveju perkraudami eilę nesugriūname double-send'u;
- (c) migruojant iš vieno ESP į kitą galim atsekti ką jau siuntėm, ką ne.

Šis dokumentas — dalis geležinės taisyklės įgyvendinimo.

---

## Bendra taisyklė

`event_id` yra **deterministinis** kur tik įmanoma (t.y. tas pats verslo įvykis → tas pats `event_id`, kad ir kiek kartų perskaičiuotum). Kur determinizmas neįmanomas — UUIDv4.

Formatas:

```
{event_name}:{primary_ref}[:{sub_ref}][:{cycle_n}]
```

- `event_name` — snake_case, atitinka TŽ v1.45 sąrašą (13 P0 eventų).
- `primary_ref` — pagrindinis Woo identifikatorius (order_id, cart_hash, customer_id, subscription_id).
- `sub_ref` — kai reikia atskirti tos pačios esybės skirtingus įvykius (pvz. shipment vs order).
- `cycle_n` — periodiniams eventams, kurie legaliai kartojasi (`refill_due`, `subscription_t5_notice`), tai serijos numeris — kad pirmasis, antrasis, trečiasis refill primenimai NEBŪTŲ dedupinami tarpusavyje.

---

## Konkretūs event_id pavyzdžiai

### 1. Vienkartiniai — determinsitiniai iš Woo ID

| Event | Formatas | Pavyzdys |
|---|---|---|
| `order_paid` | `order_paid:{order_id}` | `order_paid:12847` |
| `order_shipped` | `order_shipped:{order_id}:{shipment_n}` | `order_shipped:12847:1` |
| `payment_failed` | `payment_failed:{order_id}:{attempt_n}` | `payment_failed:12847:2` |
| `shipment_returned` | `shipment_returned:{order_id}:{return_n}` | `shipment_returned:12847:1` |
| `legacy_contact_imported` | `legacy_contact_imported:{customer_id}` | `legacy_contact_imported:483` |
| `pet_profile_created` | `pet_profile_created:{pet_id}` | `pet_profile_created:71` |
| `pet_profile_updated` | `pet_profile_updated:{pet_id}:{updated_at_unix}` | `pet_profile_updated:71:1728412800` |
| `consent_changed` | `consent_changed:{customer_id}:{changed_at_unix}` | `consent_changed:483:1728412800` |

`updated_at_unix` naudojam ten, kur ta pati esybė gali gaminti daug eventų per gyvavimo laiką — atskiria versijas.

### 2. Periodiniai — cycle_n privalomas

Šie kartojasi legaliai, ir mums kiekvienas iš jų yra atskiras eventas ESP pusėje:

| Event | Formatas | Pavyzdys |
|---|---|---|
| `refill_due` | `refill_due:{customer_id}:{product_sku}:{cycle_n}` | `refill_due:483:EXCL-2KG:3` |
| `subscription_t5_notice` | `subscription_t5_notice:{subscription_id}:{cycle_n}` | `subscription_t5_notice:9142:5` |
| `subscription_t2_sms_needed` | `subscription_t2_sms_needed:{subscription_id}:{cycle_n}` | `subscription_t2_sms_needed:9142:5` |
| `pet_reminder_due` | `pet_reminder_due:{reminder_id}:{cycle_n}` | `pet_reminder_due:2201:1` |

`cycle_n` semantika:
- `refill_due` — kelintas kartas išsiunčiam refill priminimą tam pačiam SKU tam pačiam klientui. Skaičiuojam Woo pusėje (`_refill_cycle_counter` postmeta).
- `subscription_t5/t2` — kelintas prenumeratos ciklas (1, 2, 3...). Jei prenumerata paužuota ir vėl aktyvi, ciklas nenulinamas.

### 3. Trumpalaikiai / greitai atsinaujinantys

| Event | Formatas | Pavyzdys |
|---|---|---|
| `cart_abandoned` | `cart_abandoned:{cart_hash}:{abandoned_at_unix}` | `cart_abandoned:a3f2...:1728412800` |
| `subscription_paused` | `subscription_paused:{subscription_id}:{paused_at_unix}` | `subscription_paused:9142:1728412800` |
| `subscription_canceled` | `subscription_canceled:{subscription_id}:{canceled_at_unix}` | `subscription_canceled:9142:1728412800` |

`cart_hash` = SHA256(customer_id + items sorted + timestamp_bucket_15min) — kad tas pats klientas su tuo pačiu krepšeliu per 15 min. nebūtų dedupinamas be reikalo.

---

## Saugojimas Petshop-core pusėje

Nauja lentelė `gaj6_ps_event_log`:

```sql
CREATE TABLE gaj6_ps_event_log (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id     VARCHAR(191) NOT NULL,
  event_name   VARCHAR(64)  NOT NULL,
  email        VARCHAR(191) NOT NULL,
  payload_json LONGTEXT,
  emitted_at   DATETIME NOT NULL,
  status       ENUM('pending','sent','dedup','failed','dead') NOT NULL DEFAULT 'pending',
  esp_response TEXT,
  attempts     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  next_retry_at DATETIME NULL,
  adapter_name VARCHAR(32) NOT NULL,
  UNIQUE KEY uq_event_id_adapter (event_id, adapter_name),
  KEY idx_status_next_retry (status, next_retry_at),
  KEY idx_email_emitted (email, emitted_at),
  KEY idx_event_name_emitted (event_name, emitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Reikšmingi laukai:
- `UNIQUE (event_id, adapter_name)` — kertinis idempotencijos saugiklis. Antras insert su tuo pačiu event_id + adapter grąžins duplicate key error → dedup.
- `adapter_name` — kad platformos keitimo metu senos Sender/Brevo istorijos nesikištų (ta pati verslo istorija, bet skirtingas siuntimo įrašas).
- `status` reikšmės:
  - `pending` — priimtas, dar nesiųstas
  - `sent` — ESP grąžino success
  - `dedup` — ESP grąžino „jau matėm" (arba mūsų UNIQUE key sudegė)
  - `failed` — retriable klaida, laukia next_retry_at
  - `dead` — max attempts pasiektas, į DLQ (Dead Letter Queue)

## Retencija

- `sent` / `dedup` — laikom **90 dienų** (health dashboard'ui + auditavimui)
- `dead` — laikom **365 dienas** (post-mortem)
- `pending` / `failed` su next_retry_at senesniu nei 24h — alert'as (kažkas įstrigo)

## Testas Nr. 3 (idempotencija)

Kaip patikrinsim Sender POC metu:
1. Emit'inam `order_paid:99999` — grąžina success, statusas → sent.
2. Emit'inam TĄ PATĮ `order_paid:99999` po 5 sek. — turi grąžinti already_processed=true, ESP-į nesiunčia (arba siunčia, o ESP dedup'ina — abu variantai OK).
3. Emit'inam `order_paid:99999` po 24h — vis dar dedup (ne pakartojam!).
4. Emit'inam `refill_due:483:EXCL-2KG:1` — success.
5. Emit'inam `refill_due:483:EXCL-2KG:2` — success (cycle_n skirtingas, LEGALIAI siunčiama).

Šis testas patikrina ir mūsų code'ą, ir Sender elgesį.
