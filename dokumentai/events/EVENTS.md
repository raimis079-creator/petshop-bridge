# Petshop kanoniniai P0 event'ai — registry

**Statusas:** GYVAS kanoninis šaltinis (S185). Bet koks event'ų minėjimas kituose dokumentuose ar kode PRIVALO atitikti šį sąrašą.

**Svarbu:** `contact_created` NĖRA kanoninis P0 event'as. Jei reikia vidinio account_created signalizacijos — atskiras internal event, ne šio registro dalis.

---

## 13 kanoninių P0 event'ų

| # | Event pavadinimas | Trigger'is | Šaltinio modulis | Emit'ina | Statusas |
|---|---|---|---|---|---|
| 1 | `legacy_contact_imported` | Legacy kliento importas iš senos DB | M16 Master DB | 1 kartą per klientą | Laukia M16 |
| 2 | `pet_profile_created` | Anketa užpildyta pirmą kartą | M7 | 1 kartą per augintinį | Laukia M7 |
| 3 | `pet_profile_updated` | Anketa atnaujinta | M7 | Kiekvieną kartą | Laukia M7 |
| 4 | `cart_abandoned` | Krepšelis apleistas su identifikuotu email | Atskiras cart-tracking modulis | 1 kartą per krepšelį | Laukia modulio |
| 5 | `order_paid` | WC `woocommerce_payment_complete` | Core | Kiekvieną užsakymą | ✅ Šaltinis yra |
| 6 | `order_shipped` | Venipak/LP siuntos numerio sukūrimas | M12 | Kiekvieną siuntą | Laukia M12 recon |
| 7 | `refill_due` | Refill variklio prognozė | M11 | Kartą per prognozę | Laukia M11 |
| 8 | `subscription_t5_notice` | Prenumerata: T-5 dienų iki cikko | M10 | Kartą per ciklą | Laukia M10 |
| 9 | `subscription_t2_sms_needed` | Prenumerata: T-2 dienos, SMS reikalinga | M10 | Kartą per ciklą | Laukia M10 |
| 10 | `payment_failed` | Mokėjimo klaida (su payment_context) | Core + M10 | Kiekvieną klaidą | Dalinai (checkout dalis šaltinis yra) |
| 11 | `shipment_returned` | Venipak/LP grąžinta siunta | M12 | Kiekvieną grąžinimą | Laukia M12 |
| 12 | `pet_reminder_due` | Priminimas augintiniui | M13 | Kartą per priminimą | Laukia M13 |
| 13 | `consent_changed` | Consent pasikeitimas (M4 hook) | Core (M4) | Kiekvieną pakeitimą | ✅ Šaltinis yra |

### Šio momento (S185) realizacijos statusas

**Šaltinis egzistuoja, event GALIMA statyti dabar:**
- `order_paid` (5)
- `consent_changed` (13)

**Šaltinis egzistuoja iš dalies, reikia semantikos apibrėžimo:**
- `payment_failed` (10) — checkout dalis šaltinis yra, subscription dalis laukia M10. Sprendimas atskiruose `checkout_payment_failed` ir `subscription_payment_failed`, ar bendras su `payment_context` payload lauku — bus priimtas kai statysim M10.

**Reikia recon prieš implementaciją:**
- `order_shipped` (6) — Venipak plugin siuntos numerio sukūrimo hook (NE WC completed statusas)

**Laukia savo verslo modulio:**
- `legacy_contact_imported` (1) — M16
- `pet_profile_created` (2), `pet_profile_updated` (3) — M7
- `cart_abandoned` (4) — atskiras cart-tracking modulis
- `refill_due` (7) — M11
- `subscription_t5_notice` (8), `subscription_t2_sms_needed` (9) — M10
- `shipment_returned` (11) — M12
- `pet_reminder_due` (12) — M13

**Kodo ir schemų taisyklė:**
- Schemos rašomos DABAR visiems 13 event'ų (kontrakto užrakinimas).
- Kodas rašomas TIK kai atsiranda šaltinis (jokių placeholder klasių).

---

## Universalūs event laukai (kiekviename)

```json
{
  "schema_version": 1,
  "event_name": "order_paid",
  "event_id": "unique_string",
  "emitted_at": "2026-07-14T14:32:15Z",
  "email": "klientas@example.com",
  "customer_id": 123,
  "payload": { ... event-specific ... }
}
```

Universalūs laukai apdorojami `Petshop_Event_Registry::emit()`. Event-specific — payload viduje.

---

## Schemų vieta

Kiekvienam event'ui — atskiras JSON schema failas:
- `schemas/events/order_paid.schema.json`
- `schemas/events/consent_changed.schema.json`
- ir t.t.

Bendras validatorius — `Petshop_Event_Registry::validate($event_name, $payload)`.

## Schemos versijos

Kiekviena schema turi `schema_version` lauką. Bet koks payload'o pakeitimas (naujas laukas, tipo pakeitimas, semantikos pakeitimas) — **naujos versijos schema**. Sena versija saugoma `schemas/events/order_paid.v1.schema.json`, nauja — `.v2.schema.json`. Kodas gali palaikyti kelias versijas per pereinamą laikotarpį.
