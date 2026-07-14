# Etapas A — būsena ir likę darbai (2026-07-14, verifikuota serveryje)

> Ši būsena patikrinta REALIAI serveryje (gyvos klasės + lentelės), ne iš atminties.
> core v0.6.0, esp v0.4.0.

---

## ✅ PADARYTA ir patikrinta (gyva kode)

### Infrastruktūros pamatas (petshop-core)
| Komponentas | Klasė | Būsena |
|-------------|-------|--------|
| Event log | Petshop_Event_Log | ✅ (lentelė ps_event_log) |
| Consent log | Petshop_Consent_Log | ✅ (lentelė ps_consent_log) |
| Consent sync | Petshop_Consent_Sync | ✅ |
| Retry queue | Petshop_Retry_Queue | ✅ (Action Scheduler) |
| Message Provider interface | Petshop_Message_Provider | ✅ |

### Funkciniai blokai
| Modulis | Klasė | Būsena | Testai |
|---------|-------|--------|--------|
| M1 ESP adapter | Petshop_Sender_Adapter | ✅ | real HTTP |
| M2 Event log + retry | ✅ | ✅ | |
| M3 26 PS_ attributes (Sender) | ✅ | ✅ | |
| M4 Consent + webhook | ✅ | ✅ | POC #4 |
| M6 Action Tokens | Petshop_Action_Tokens | ✅ (ps_action_tokens) | 9/9 |
| M7 Pet Profile | Petshop_Pet_Profile | ✅ (ps_pets) | 8/8 |
| M9 Magic Login | Petshop_Magic_Login | ✅ | 12/12 |
| Event Registry | Petshop_Event_Registry | ✅ | 9/9 |
| Event Emitters | Petshop_Event_Emitters | ✅ | E2E |

### Realūs event'ai (su gyvu šaltiniu)
- **order_paid** — WC payment_complete → per Event Registry → Sender ✅ (E2E patvirtinta)
- **consent_changed** — set_marketing_consent + webhook unsubscribe ✅
- **order_shipped** — HPOS woocommerce_update_order, Venipak/LP tracking ✅ (M12)

### Order lifecycle PILNAS: order_paid → order_shipped

### Papildomai patvirtinta
- Dev hard allowlist (PETSHOP_ENVIRONMENT) veikia — dev'e siunčia tik allowlist email
- Email routing C-hibridas: kritiniai laiškai per SMTP → INBOX (patvirtinta)
- Sender domeno auth (SPF/DKIM/DMARC) — GREEN

---

## 📋 LIKĘ DARBAI (kodo NĖRA, tik dalis turi dizainą)

### 1. M11 Refill Engine
- **Būsena:** DIZAINAS paruoštas, KODAS nepadarytas
- **Dizainas:** m11_refill_dizainas.md
- **Esmė:** self-calibrating iš pirkimo istorijos (NE teorinės normos)
  - Launch MVP: intervalas pagal pakuotės dydį (maža→14d/vid→30d/didelė→60d, confidence 0.4)
  - Po 2+ pirkimų: kalibruojasi iš realaus intervalo (confidence→0.9)
- **DB:** ps_refill_tracking (dar nesukurta)
- **Srautas:** order_paid → įrašom refill_tracking; cron kasdien → refill_due event
- **⚠️ ATVIRAS KLAUSIMAS:** per klientą+produktą (paprasčiau) ar per augintinį (tiksliau)? — Raimis nepatvirtino
- **refill_due schema:** pet_id, product_id, predicted_empty_date, confidence (required)

### 2. M8 "Mano augintinis" UI
- **Būsena:** kodo NĖRA, dizaino NĖRA
- **Esmė:** frontend anketai (MyAccount tab arba shortcode)
- Naudoja M7 REST endpoint (jau veikia)
- Mobile-first, brand dizainas (#2D5F3F)
- Progresyvus pildymas (P0 minimum → P1 pilna → P2 keli augintiniai)
- **Rizika:** frontend (Flatsome tema, CSS, JS) — daugiau klaidų tikimybė nei backend

### 3. M10 Subscription (sudėtingiausias)
- **Būsena:** kodo NĖRA, strateginiai sprendimai užrakinti
- **Esmė:** prenumerata su Paysera recurring
- **Dviejų ašių modelis (LOCKED):** siuntos kontrolė (klausti/pranešti) × mokėjimas (auto/rankinis)
- Paysera custom gateway (~3-5 d.), project 191898, recurring reikia special approval + MAC
- Dunning retry mūsų pusėje (T-0/+2d/+5d → pause, ne cancel)
- WPSubscription Free POC pirma
- **Priklauso nuo:** Paysera recurring approval (išorinis)

### 4. M13 Reminders
- **Būsena:** kodo NĖRA
- **Esmė:** pet_reminder_due event, priminimai pagal pet profile
- Naudoja M7 pet profile duomenis
- Cron pagristas

### 5. M16 Master DB import
- **Būsena:** kodo NĖRA
- **Esmė:** legacy_contact_imported event, ~1175 legacy produktai su cost data
- Bulk CSV workflow kai Raimis turės duomenis

---

## 🔧 ATSKIROS UŽDUOTYS (ne blokai)

### order_shipped realios meta verifikacija
- **Dok:** order_shipped_verifikacija_launch.md
- Patikrinti ar sena petshop.lt naudoja tuos pačius Venipak/LP meta raktus
- Launch dieną su pirmu realiu siuntiniu
- Rizika ŽEMA (ne kritinis srautas)

### Domeno migracija (launch diena)
- **Dok:** launch_domain_migracija.md
- Pilnas DB search-replace dev.avesa.lt → petshop.lt (28 options + 9 postmeta + 49 posts)
- Sprendžia laiškų sulaužytus paveikslėlius
- wp-config.php: define('PETSHOP_ENVIRONMENT','production')

### Deliverability (launch)
- **Dok:** deliverability_launch_kritinis.md
- Sender tracking CNAME (link.petshop.lt)
- Warm-up per launch bangas
- Google Postmaster Tools

---

## PRIKLAUSOMYBĖS TARP LIKUSIŲ BLOKŲ

- M11 refill ← naudoja order_paid (yra) + pet profile (yra) → GALIMA daryti dabar
- M8 UI ← naudoja M7 REST (yra) → GALIMA daryti dabar
- M10 subscription ← naudoja M6 tokens (yra) + Paysera (išorinis) → dalinai priklausomas
- M13 reminders ← naudoja pet profile (yra) → GALIMA daryti dabar
- M16 import ← Raimio CSV duomenys → priklauso nuo Raimio

**Išvada:** M11, M8, M13 galima daryti bet kuria tvarka (visi pamatai yra).
M10 priklauso nuo Paysera approval. M16 priklauso nuo Raimio duomenų.

---

## SIŪLOMA PRIORITETO TVARKA (pagal "paprasčiau + mažiau klaidų")

1. **M13 Reminders** — paprasčiausias (cron + pet profile, grynas backend)
2. **M11 Refill** — vidutinis (dizainas paruoštas, reikia atsakymo į atvirą klausimą)
3. **M8 UI** — frontend (rizikingesnis, bet užbaigia vartotojo srautą)
4. **M10 Subscription** — sudėtingiausias (Paysera)
5. **M16 Import** — kai Raimis turės duomenis

*(Tvarka — siūlymas, ne įpareigojimas. Raimis sprendžia.)*
