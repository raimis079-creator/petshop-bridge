# PS_ Contact Attributes — Sender pusės laukai (M3)

**Statusas:** ✅ VISI 26 sukurti Sender pusėje (2026-07-14, S183)
**Sender account:** azv2GY (UAB Avesa)
**Sukūrimo metodas:** `POST /fields` su `{title, type}`
**Skaitymas:** per subscriber `columns[]` (NE `/account/fields` — tas 404)
**Rašymas:** `PATCH /subscribers/{email}` su `{fields:{TITLE:value}}` (TITLE, ne ID)

## Sender tipų pastaba

Sender turi tik `text`, `number`, `date` tipus. Nėra `category` (enum) ar `boolean`:
- **category** laukai → `text` (reikšmės validuojamos MŪSŲ pusėje prieš siunčiant)
- **boolean** laukai → `text` su reikšmėmis `"true"` / `"false"` (SenderAdapter konvertuoja automatiškai)

## Pilnas 26 laukų sąrašas

| PS_ laukas | Sender ID | Sender tipas | Loginis tipas | Rašo (modulis) | Skaito srautuose |
|---|---|---|---|---|---|
| PS_CUSTOMER_ID | e1rY0Z | text | text/number | user registracija (M5) | visur (ryšys su Woo) |
| PS_LAST_ORDER_DATE | b2vgyM | date | date | order_paid hook (M12) | win-back, refill |
| PS_ORDER_COUNT | egLxlj | number | number | order_paid hook (M12) | 1×/2×/3×+ segmentai, founding, welcome |
| PS_LIFETIME_VALUE | e32jzA | number | number | order_paid hook (M12) | VIP/founding prioritetas |
| PS_CUSTOMER_WAVE | b4RkA7 | text | category | Master DB import + naujos reg → 'organic' (M16) | legacy reaktyvacija, founding |
| PS_FOUNDING_SCORE | e59lBY | number | number | Master DB import — **laikinas** (M16) | founding kampanija (rugpjūtis) |
| PS_PET_SPECIES | ejqvo4 | text | category | anketa (M7) | rūšies segmentas, workflows |
| PS_PET_NAME | b6RmDO | text | text | anketa (M7) | personalizacija visur ({{PS_PET_NAME}}) |
| PS_PET_LIFE_STAGE | e7LnEQ | text | category | anketa (M7) | rekomendacijos, transition |
| PS_DOG_SIZE | b86oGj | text | category | anketa (M7, jei dog) | rekomendacijos |
| PS_FEEDING_TYPE | e9QpJJ | text | category | anketa (M7) | refill skaičiuoklė |
| PS_PRIMARY_NEED | e0V2w5 | text | category | anketa (M7) | niša segmentas |
| PS_CURRENT_FOOD_BRAND | egLxRr | text | text | anketa (M7) | transition, konkurentas |
| PS_REFILL_CANDIDATE | ejqvXy | text | boolean | refill variklis (M11) | refill segmentas |
| PS_NEXT_REFILL_DATE | bkZwYJ | date | date | refill variklis (M11) | refill trigger |
| PS_SUBSCRIPTION_STATUS | el5vZj | text | category | prenumerata (M10) | prenumeratos segmentas |
| PS_PREFERRED_SHIPPING | bmQ2KR | text | category | užsakymai (savarankiškas fit) | shipping personalizacija |
| PS_MARKETING_CONSENT | bkZwpv | text | boolean | consent sync (M4) | consent gate VISOSE workflows |
| PS_TRANSACTIONAL_ONLY | enrYL5 | text | boolean | bounce/spam webhook (M4) | consent gate |
| PS_UNSUBSCRIBED_AT | boQvMY | date | date | webhook (M4) | consent istorija |
| PS_LAST_EVENT_AT | epQRNQ | date | date | ps_emit_event (M2) | health check |
| PS_LOGIN_METHOD | bqYVO7 | text | category | Google Identity (M5) | analytics |
| PS_LEGACY_EMAIL_LINKED | erREP2 | text | boolean | dedup (M5) | analytics |
| PS_LEGACY_LINK_PROMPT_SHOWN | avoYW8 | text | boolean | dedup (M5) | UI logika |
| PS_EMAIL_VERIFIED | dwmEXr | text | boolean | magic link (M5) | login fallback |
| PS_IDENTITY_MERGED_AT | egLxAk | date | date | dedup (M5) | analytics |

## Reikšmių žodynas (category laukams)

**PS_PET_SPECIES:** `dog` | `cat` | `both` | `unknown`
**PS_PET_LIFE_STAGE:** `junior` | `adult` | `senior`
**PS_DOG_SIZE:** `small` | `medium` | `large` | `unknown`
**PS_FEEDING_TYPE:** `dry_only` | `mostly_dry` | `mixed`
**PS_PRIMARY_NEED:** `hypo` | `digestion` | `sterilised` | `daily` | `unknown`
**PS_CUSTOMER_WAVE:** `banga1` | `banga2` | `organic`
**PS_SUBSCRIPTION_STATUS:** `none` | `active` | `paused` | `cancelled`
**PS_PREFERRED_SHIPPING:** `locker` | `courier` | `unknown`
**PS_LOGIN_METHOD:** `google` | `password` | `both`

## Boolean reikšmės

Visi boolean laukai (`text` tipo Sender pusėje) naudoja: `"true"` | `"false"` (string).
SenderAdapter->upsert_contact() konvertuoja PHP bool automatiškai.

## Svarbios pastabos

- **PS_CUSTOMER_WAVE trečia reikšmė 'organic'** (spec §8.1): banga1/banga2 tik vienkartinei legacy reaktyvacijai (3156 kontaktų); naujiems organiniams po launch → 'organic'.
- **PS_FOUNDING_SCORE laikinas** (spec §8.2): formulė VIENAM sprendimui (founding vietos iš 3156 legacy), ne amžinas naujiems klientams.
- **Google login NESUTEIKIA PS_MARKETING_CONSENT=true** (spec §20): tapatybė ir sutikimas visada atskiri.
- **Consent tiesa MŪSŲ DB** — PS_MARKETING_CONSENT Sender pusėje = kopija; tikra tiesa Woo/ps_consent_log (M4).
