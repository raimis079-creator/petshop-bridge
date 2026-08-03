# REGISTRAS.md — petshop.lt · VIENINTELIS BŪKLĖS ŠALTINIS

> **SKAITYTI PIRMĄ. VISADA.** Šis failas atsako į vienintelį klausimą:
> *kas padaryta, kas ne, kieno eilė.*
>
> `STATE.md` nuo šiol yra **ISTORIJA** (kaip padaryta, kokios pamokos, kokie SHA).
> Būklės iš STATE.md NEIMTI — ten sesijų naratyvas, kuris prieštarauja pats sau.
> Jei registras ir STATE.md nesutampa — **galioja REGISTRAS**.

**Atnaujinta:** 2026-08-03 · **Launch:** vidinis 2026-10-01 · sutartinis buferis 2026-10-15

---

## 0. SANTRAUKA

| Blokas | ✅ | 🟡 | 🔴 | ⏸ laukia Raimio |
|---|---|---|---|---|
| Launch DoD (22) | 5 | 5 | 10 | 2 nematuota |
| P0 funkcijos F1–F16 | 15 | 1 | 0 | — |
| MVP funkcijos (§4.3) | 4 | 0 | 1 | 1 nepatikrinta |
| El. laiškų šablonai | 5 | 0 | 12 | — |
| M8 anketa (9 punktai) | 9 | 0 | 0 | tekstai |
| Pre-launch operacijos | 0 | 2 | 9 | — |

**Vienu sakiniu:** kodas beveik padarytas, **testavimo / monitoringo / operacijų sluoksnis nepradėtas**, ir jame yra 10 iš 22 DoD raudonų.

---

## 1. TAISYKLĖS (kaip šis failas gyvena)

1. **Būseną keičia TIK įrodymas su data.** „Mechanizmas egzistuoja" ≠ „sistema tai daro".
   Prieš žymint ✅ atsakyti: kas paleidžia · ar kelias pasiekiamas · kas jei neįvyksta · ar rezultatas patvirtintas.
2. **Kiekviena nauja rasta spraga rašoma ČIA** tą pačią sesiją, ne tik sesijos pasakojime.
3. **Sesijos pabaigoje Claude atnaujina TIK šį failą** (pilnu perrašymu) + prideda istorijos bloką į STATE.md.
4. **ID nekeičiami niekada.** Užbaigtas darbas lieka lentelėje su ✅ ir data — netrinamas.
6. **JOKIU MOKAMU PLUGINU, PASLAUGU AR PRENUMERATU BE RAIMIO ZINIOS.** Tai 100%
   jo sprendimas. Konsultanto rekomendacija, kad ir kaip detali — **pasiulymas, ne
   nurodymas**. Pries diegiant bet ka, kas kainuoja arba isveza duomenis pas isorini
   tiekeja, Claude klausia patvirtinimo tiesiogiai. (Kilme: 2026-08-03 idiegtas
   WP Umbrella pagal perduota konsultanto teksta — Raimis apie tai nezinojo.
   Pasalintas ta pacia diena, `s368.json`.)
7. **Vienas langas — vienas tiltas.** Prieš `dispatch` patikrinti, ar `screenshot.mjs` HEAD commit yra mano paskutinis PUT. Jei ne — STOP.

---

## 2. LAUNCH DoD (TŽ §19.1) — 22 punktai

| ID | Kriterijus | Būsena | Data | Įrodymas / kas trūksta |
|---|---|---|---|---|
| DOD-01 | P0 funkcijos F1–F16 100% | 🟡 | 2026-08-03 | F4 ✅ uždarytas; liko tik F14 mobile checkout testas |
| DOD-02 | Kritinių klaidų 0 | ⚪ | — | **nėra bug registro** — nematuojama |
| DOD-03 | Aukšto prioriteto klaidų ≤3 | ⚪ | — | tas pats |
| DOD-04 | 20 testinių užsakymų | 🔴 | 2026-08-02 | DB: 2 užsakymai |
| DOD-05 | 2 stabilūs pristatymo būdai | ✅ | 2026-06-01 | Venipak + LP Express live |
| DOD-06 | Paysera + bankinis | ✅ | 2026-06-01 | — |
| DOD-07 | Top-100 SEO 301 | 🔴 | 2026-07-30 | 44 URL = 404, 20,5% srauto |
| DOD-08 | Backup restore testas | 🔴 | 2026-08-03 | 0 backup pluginų. **Įrankio sprendimas — RAIMIO (Q-BKP), nepradėta** |
| DOD-09 | XML sync 7 d. be klaidų | 🟡 | 2026-08-02 | importai suka; 7 d. serija nefiksuota |
| DOD-10 | Kainodara testuota 20 produktų | 🟡 | 2026-07-30 | recon darytas, formalaus testo nėra |
| DOD-11 | Manual override 5 produktais | 🟡 | 2026-08-03 | 2 iš 5 (14824, 33249 per R5) |
| DOD-12 | Savininkas apdoroja užsakymą be programuotojo | 🟡 | — | neformalizuota |
| DOD-13 | Post-launch monitoringas | 🔴 | 2026-08-03 | 0 monitoringo pluginų. **Sprendimas — RAIMIO (Q-BKP), nepradėta** |
| DOD-14 | Mail-Tester ≥8/10 | ✅ | 2026-07-30 | 8,5/10 |
| DOD-15 | GDPR atitiktis | ✅ | 2026-07-10 | Complianz v7.5.0 + 8 legal psl. |
| DOD-16 | VMI sąskaitos su realia transakcija | ✅ | 2026-06 | AVPN/IAPV testuota |
| DOD-17 | Beta testas 5–10 klientų | 🔴 | — | nepradėta |
| DOD-18 | DNS planas + sena platforma read-only | 🔴 | — | nepradėta |
| DOD-19 | Rollback planas | 🔴 | — | nepradėta |
| DOD-20 | Savaitinis stabilumas ≥99% | 🔴 | — | 7 d. staging monitoringas |
| DOD-21 | GSC auditas + top-100 301 lentelė | 🟡 ~70% | 2026-07-30 | eksportas yra, mapping juodraštis ne |
| DOD-22 | „Discourage search engines" išjungti | 🔴 | — | pre-launch, viena varnelė |

---

## 3. FUNKCIJOS

### P0 (F1–F16)
| ID | Funkcija | Būsena | Data | Pastaba |
|---|---|---|---|---|
| F4 | Paieška + SKU/EAN | ✅ | 2026-08-03 | Tikslus atitikmuo (NE euristika pagal ilgį): Woo SKU + global_unique_id lookup + legacy `_ean`/`_vf_barcode`/`_zb_ean`. Vienas produktas → 302; keli → sąrašas + dublikatų žurnalas; be atitikmens tekstinė paieška nepaliesta |
| F14 | Mobile checkout | 🟡 | — | iPhone/Android testas nefiksuotas |
| — | F1–F3, F5–F13, F15, F16 | ✅ | — | — |

### MVP (TŽ §4.3)
| ID | Funkcija | Būsena | Data | Pastaba |
|---|---|---|---|---|
| F17 | XML 2-as tiekėjas | ✅ | — | VF 1077 prekės |
| F18 | Kaina24 / kainos.lt | ✅ | — | URL resubmit po migracijos |
| F19 | **Ribota prenumerata** | 🔴 | — | **NEPRADĖTA. Didžiausias likęs kodo blokas.** Blokuoja Q10 + Q6 + Paysera Recurring |
| F20 | Basic Pet Profile | ✅✅ | 2026-08-03 | M8 gerokai viršyta |
| F21 | Basic email automation | ✅ 3/3 | 2026-08-02 | cart_abandoned · post_purchase · refill |
| F30b | Atsiliepimai | ⚪ | — | **būsena nepatikrinta** |

---

## 4. M8 ANKETA — UŽDARYTA 9/9

| # | Darbas | Būsena | Įrodymas |
|---|---|---|---|
| 1 | `create_pet_result()` atskyrimas | ✅ | 6/6 paritetas su baseline |
| 2 | UNIQUE(client_ref) + duplicate-key recovery | ✅ | 8/8 su lenktynių simuliacija |
| 3 | POST /pet-draft | ✅ | 31/31 |
| 4 | magic-login priima draft_id | ✅ | 10/10 |
| 5 | Claim grandinė + state cleanup | ✅ | 17/17 |
| 6 | pet-form.js serverinis draftas | ✅ | S1 realiu keliu ant SHA `4bf522cc` |
| 7 | Cron cleanup + stale claim recovery | ✅ | 10/10 |
| 8 | E2E dviem įrenginiais + neigiami keliai | ✅ | E0-A/E0-B/paritetas/N1/N2/N3/N4 — `s352.json`, `s353.json` |
| 9 | duplicate_candidate ekranas | ✅ | D1/D2 naršyklėje — `s360.json` |
| 9b | **Tekstai: landing peržiūra + „14 dienų"** | ⏸ | **RAIMIO** |

---

## 5. EL. LAIŠKŲ SLUOKSNIS

**Principas (TŽ v1.60, užrakinta):** šablonai gyvena `petshop-core/templates/emails/`, Sender = tik transportas. Sender workflow'ai nenaudojami.

Transportas ✅: adapteris `Petshop_Sender_Adapter` v0.4.0, `is_configured=true`, DKIM/SPF/Reply-To įrodyti, Mail-Tester 8,5/10.

| Šablonas | Būsena | Prioritetas |
|---|---|---|
| order-paid · refill · cart-abandoned-1 · cart-abandoned-2 · post-purchase-2d | ✅ 5 | — |
| payment_failed (dunning-1) | 🔴 | **launch** — nesumokėti užsakymai tyliai dingsta |
| founding_activation | 🔴 | **launch** — rugpjūčio arka |
| consent_changed | 🔴 | **launch** — teisinis pėdsakas |
| shipment_returned · pet_reminder_due · subscription_t5_notice | 🔴 | subscription_t5 priklauso nuo F19 |
| post_purchase_7d · post_purchase_14d | 🔴 | po launch |
| win_back_60/90/120 · legacy_reactivation_l1 | 🔴 | po launch |
| order_shipped | ⚪ sąmoningai | siunčia WooCommerce |

**Naujienlaiškis:** formos NĖRA (`newsletter_shortcode` 0). Vokelio ikona išjungta 2026-08-01, nes neįrodyta grandinė forma → sutikimas → Sender → dedup → consent pėdsakas.

**Sender skola:** tracking CNAME. Nuorodos eina per bendrą `campaign-statistics.com`. Hostname **kopijuoti iš Sender nustatymų**, ne iš užrašų (mūsų įrašas: `link.petshop.lt`).

---

## 6. AUDITO RADINIAI (2026-08-02)

| ID | Radinys | Būsena | Pastaba |
|---|---|---|---|
| R1 | F4 SKU/EAN paieška | ✅ 2026-08-03 | `mu-plugins/petshop-code-search.php` v1.0, sha e141c4ae. Matrica 13/13, `s366.json` |
| R2 | 1518 / 2764 publish prekių be EAN (55%) | ⏸ | **iš kur imti — Raimio sprendimas** |
| R3 | Backup pluginas neįdiegtas | 🔴 | = DOD-08; kurį — Raimio sprendimas |
| R4 | Monitoringo nėra | 🔴 | = DOD-13 |
| R5 | 5 publish prekės be kainos | ✅ 2026-08-03 | 2 kainos pagal medianą (16,49 / 18,99, `_manual_price_override`), 3 į draft. publish be kainos 5→0. `s364.json` |
| R6 | F19 prenumerata nepradėta | 🔴 | = F19 |
| R7 | 1022 draft prekės | ⏸ | publish / trinti / palikti — Raimio |

---

## 7. SEO MIGRACIJA

Padaryta ~70–80%: GSC eksportas (2445 URL), top-100 auditas, redirect probe, 33/36 blog straipsnių, 2 veikiantys 301 snippetai.

**Rizika:** top-100 dengia 79,2% srauto. Prieš dev: 56 URL = 200, **44 URL = 404 → 20,5% viso srauto neuždengta.**

Trys tipai: (1) kategorijos, kurių dev'e nėra — **ar jos apskritai bus, Raimio sprendimas**; (2) seni kategorijų URL su ID uodegomis — grynas 301; (3) prekės — EAN/SKU match.

Trūksta 3 blog straipsnių. Galutinis 301 failas generuojamas T-14/T-3, kai katalogas užšaldytas. **Nepradėti be Raimio.**

---

## 8. PRE-LAUNCH OPERACIJOS

| ID | Operacija | Būsena |
|---|---|---|
| OPS-01 | Site URL/Home → `https://petshop.lt` (**būtinai https**) | 🔴 |
| OPS-02 | 6 cron užduotys serveriai.lt (Import #2, #3) | 🔴 |
| OPS-03 | `woocommerce_email_header_image` · `wcdn_settings` · `cmplz_preloaded_privacy_info` | 🔴 |
| OPS-04 | AVPN/IAPV serijos reset į 101 | 🔴 |
| OPS-05 | Testinių užsakymų trynimas | 🔴 |
| OPS-06 | Feed URL resubmit (Kaina24, Kainos.lt) | 🔴 |
| OPS-07 | „Discourage search engines" išjungti | 🔴 (= DOD-22) |
| OPS-08 | Sender tracking CNAME | 🟡 |
| OPS-09 | Complianz Website Scan + slapukų sąrašas · enhanced conversions | 🟡 |
| OPS-10 | Flatsome social nuorodos (dabar placeholder'iai `http://url`) | 🔴 laukia Raimio nuorodų |
| OPS-11 | TEMP snippetų trynimas WP admin (REST DELETE neveikia) | 🔴 higiena: 2136–2139, 2141–2160 |
| OPS-12 | `gaj6_umbrella_redirects` lentelė — liko po WP Umbrella šalinimo; **netrinta automatiškai**, patikrinti kilmę | 🔴 |

**DNS valdomas iv.lt**, ne serveriai.lt.

---

## 9. LAUKIA RAIMIO SPRENDIMO

| ID | Klausimas | Blokuoja | Terminas |
|---|---|---|---|
| Q6 | Prenumeratos pluginas | F19 | — |
| Q10 | Kurie 20–30 SKU prenumeratai | F19 | — |
| Q-BKP | **Backup ir monitoringo įrankis** — koks? (serveriai.lt savi backup'ai? UpdraftPlus į savo saugyklą? kitas?) | DOD-08, DOD-13 | — |
| Q9 | Lojalumas: pluginas ar savas BonusLedger | — | 2026-08-15 |
| Q21 | FB paskyros revival + reali nuoroda | OPS-10 | — |
| Q-R2 | 1518 prekių be EAN — iš kur imti | F4 vertė | — |
| Q-R7 | 1022 draft prekės — publish/trinti/palikti | — | — |
| Q-SEO | Kurios 404 kategorijos apskritai bus | DOD-07 | — |
| Q-M8 | Anketos tekstai + „14 dienų" frazė | M8 9b | — |
| Q-27 | S327 laiško lietuviško stiliaus peržiūra | — | — |
| Q-GDPR | Duomenų retencija: kada trinti `ps_carts`/`ps_shipments` | — | — |
| Q-PSR | Paysera Recurring atsakymas (nefiksuotas) | F19 | — |
| Q-EM | El. paštas „Apie mus" / „Privatumo politika" psl. | — | — |

---

## 10. SIŪLOMA EILĖ

```
A — greita (valandos)          R5 kainos ✅ · F4 paieška ✅ · backup+monitoringas ⏸ laukia Q-BKP
B — didelis kodas              F19 prenumerata (po Q6+Q10) · 3 launch šablonai
C — Raimio sprendimai          Q6 Q10 Q-R2 Q-SEO Q-M8
D — procesas (dienos)          DOD-04 20 užsakymų · DOD-17 beta · DOD-18/19 DNS+rollback
                               DOD-20 savaitinis monitoringas
E — pre-launch (T-14 … T-0)    visos OPS-* · DOD-07/21 301 lentelė
```

Grupėje A padaryta: R5 ✅ ir F4 ✅. Backup ir monitoringas laukia Q-BKP sprendimo.
