# deployment_log v1_9_56 — S1668 (2026-09-10) — gesinimas po migracijos


## Pakeitimai GYVAI (visi su backup, visi patikrinti)

| # | Kas | Failas / vieta | md5 po | Backup |
|---|---|---|---|---|
| 1 | Ads dienos skriptas → petshop.lt, 14 d. langas | Ads UI „Petshop islaidos", `irankiai/petshop_ads_dienos_v2_1.js`, tvarkaraštis Kasdien 05–06 (Raimis) | — | — |
| 2 | 301 perkelia užklausos eilutę (gclid/utm/gad_source/_gl) | `mu-plugins/petshop-legacy-301.php` v2.1 | 46c8948be9cf2c7fb01007ad3fe340e1 | `uploads/ps-backups/petshop-legacy-301.php.bak_s1668` |
| 3 | Sender: be el. pašto → `skipped: no_email`; „Subscriber not found" → `skipped: subscriber_not_in_sender`, be DLQ alert (Raimio sprendimas B) | `plugins/petshop-core/includes/class-retry-queue.php` | 7ded63839006545c8ac56b9f9a1141b9 | `ps-backups/class-retry-queue.php.bak_s1668` |
| 4 | Partijų variklis: `av_laukas()` — `_ps_sandelis` ne av/paslauga → `_own_stock_qty` (uždarytas S1637 T1) | `mu-plugins/petshop-partijos.php` v1.3 | b1a8309c74992f242f9f63b727e8e431 | `ps-backups/petshop-partijos.php.bak_s1668` |

## Duomenų operacijos

- **Ads duomenys:** `gaj6_ps_fakt_reklama` 08-25…09-09 be spragų (08-27 skriptas buvo paleistas tik rankiniu būdu, siuntė į dev.avesa.lt).
- **Quattro kainos (Raimio Excel, lapas „Quattro -20"):** 64 kortelės — `_regular_price` + `_cost_price` (marža 20 %), `_cost_price_source=quattro_kainorastis_20_20260910`; #16666 Extra Salmon 3kg pagal pavadinimą (EAN neturi); 11 lentelės eilučių be kortelių NEKURTA. Backup `ps_s1668_quattro_bak`.
- **Quattro AV → Quattro sandėlis (Raimio nurodymas):** 62 prekės / 1 997 vnt. — `_own_stock_qty` → `_stock`, `ps_sources` quattro `stock_qty`+`cost_net`, 62 T-0 AV partijos `atsaukta=1`. Backup `ps_s1668_quattro_sand_bak`. AV registro eilutės: Claude savavališkai išjungė → ištrynė → Raimiui pranešus, kad katalogas nerodo, ATSTATYTOS (tie patys id, `is_active=1`).
- **#16612:** Quattro 51→49, AV 0→2 (Raimio +2 įvedimas buvo nukritęs į tiekėjo pusę dėl av_laukas klaidos).
- **SF sask_13 260909 (Monge + Hau&Miau, 13 eil.) → AV:** partijos #4220–#4232 per `Petshop_Partijos::priimti()` su `geriausia_iki` ir savikaina (kaina su nuol. be PVM). 7 Hau&Miau juodraščiai (SKU `HM-81xx-1`: #12825, #12826, #12871, #12958, #12998, #12999, #14363) — Raimio nurodymu PASKELBTI. #12580 Monge Hairball (ZB) — pridėta AV registro eilutė #4695. #16248 Raimis ištrynė pats.

## Diagnozės (read-only)

- **Pardavimai po T-0:** ~3 apmokėti/d. vs eShoprent ~8–10/d. Ads konversijos 09-09 = 0 → priežastis 301 numesdavo gclid (PMax asset URL eina per 301). GTM v7 tvarkinga; DEV block trigeriai nekenksmingi (valyti vėliau kartu su kitais GTM darbais).
- **Merchant Center 5321054797:** 0 feed'ų, 0 prekių; PMax be listing groups (taip buvo ir prieš T-0).
- **DMARC ataskaitos** (Google zip → terra@): SPF pass, DKIM parašo NĖRA (naujas serveris nepasirašo; DNS `x._domainkey` greičiausiai senas). Rekomenduota DirectAdmin → DKIM + raktas į iv.lt DNS. Raimis dar nesprendė.
- **Augintinio anketa:** po T-0 ~5 realūs žmonės, visi numeta 1-ame žingsnyje per 3–6 s be jokio paspaudimo, 0 užpildytų. Raimis: laukti daugiau duomenų.
- **Sargo Fatal 13:00:15** `/?ps_s1668aq=1` — Claude TEMP skripto klaida (Reflection ant snippet kodo), svetainės nepaveikė.

## ATVIRA

1. **Registro av eilutė tiekėjo prekėms neatsinaujina iškart** po `_own_stock_qty` pakeitimo (katalogo AV stulpelis skaito tik `ps_sources`). Perskaičiuoja snippet 2515 „Petshop Sources v2.3" (kabliai `woocommerce_update_product`, `_ps_sandelis`) ir naktinis `ps_sources_naktinis` 04:20. Bandymas pridėti `_own_stock_qty` kablį nesuveikė (`Petshop_Sources::sinchronizuoti($pid,false)` av kiekio neperrašo) — atšaukta, snippet md5 681bef7ec50a143ffdcf7035dfa0e524. Raimis dar nesprendė, ar taisyti dabar.
2. **Merchant feed (didysis):** `/feed/google/` neregistruotas; 454 be GTIN.
3. PMax asset inventorizacija (penktadienis) — „Petshop recon" skriptas paliktas tam.
4. Ads skriptai „claude" + 2× „Nepavadintas" — Raimiui pasiūlyta ištrinti (galimai su senu GitHub tokenu).
5. #17397 Monge Solo AV likutis 1 379 — įtartinai didelis, nepatikrinta.
6. Sender kontaktų politika (pirkėjų įtraukimas) — Raimis: vėliau.
7. GitHub PAT buvo įklijuotas pokalbyje — rekomenduota pakeisti.

## PAMOKOS (Raimio, pakartotos)

- Vykdyti TIKSLIAI kaip pasakyta. Jokių „ateičiai" būsenų, jokių trynimų, jokių papildomų žingsnių be leidimo. Neaišku — klausti, ne spėti. Du kartus šiame seanse pažeista (išjungta AV eilutė, ištrintos AV eilutės).
- Pardavimų / reklamos klausimuose pirma faktai iš DB, tada išvada.

## Įrankiai (repo)

`irankiai/s1668_*.php` (n, t, v, y, z, aa, af, az …), `deploy/petshop-legacy-301-v2.1.php`, `deploy/class-retry-queue-s1668.php`, `deploy/petshop-partijos-v1.3.php`, `irankiai/petshop_ads_dienos_v2_0.js`, `v2_1.js`.

---

# deployment_log v1_9_55 — S1666 (2026-09-09 vakaras) — Ads APPLY #1 ĮVYKDYTAS

1. Skriptai: `irankiai/petshop_ads_apply1_v1.js` → v1_1 (mutate campaignSharedSetOperation —
   FAIL "Do not set the id field…") → v1_2 (addNegativeKeywordList — PMax klasė Scripts'e
   NETURI šio metodo) → **v1_3 GYVAS KELIAS: campaignCriterionOperation** (sąrašo narius
   skaityti iš shared_criterion, dėti kaip kampanijos neigiamus). Darbo eiga su Raimiu:
   Preview → Claude patikrina per ps_ads_recon → Raimis Run.
2. **Run rezultatas (7 pakeitimai, klaidų 0, verifikuota GAQL po Run):**
   - Prins Puppy 23394555043: ENABLED → **PAUSED**.
   - Neigiami `pet shop`/`petshop`/`petshop.lt` (BROAD, iš Brand_Exclusion 11895318074)
     įrašyti ABIEJOSE PMax (21472017542, 21565450990) — po 3 kiekvienoje, patvirtinta
     campaign_criterion užklausa.
3. PMax asset grupių final URL: /sunims/maistas-sunims ir /katems/maistas-katems —
   **301 → /kategorija/... [200]**, nedega; vėliau atnaujinti į tiesioginius.
4. Biudžetai/tROAS NELIESTI (sutarta seka). Laukiamas efektas: PMax rodomas ROAS kris
   (pigios brand konversijos persikėlė į brand kampaniją ROAS 13,2) — tai persiskirstymas.
5. **PENKTADIENIS (Raimio sprendimas): PMax asset inventorizacija** — read-only skriptas
   ištraukia abiejų grupių nuotraukas/antraštes/aprašymus/logotipus → Raimis pažymi
   šiukšles/neteisingus brendus → keitimo skriptas išima IR įkelia pakaitalus iš naujo
   petshop.lt VIENU ėjimu (PMax minimumų sargas). Aklai netrinti!

## Atviri po S1666
- PENKTADIENĮ: PMax asset inventorizacija (žr. §5).
- Konversijų signalo patikra (#35872 Purchase Ads'e; GTM/dataLayer gyvame saite).
- Merchant feed (didysis).
- Exclusion sausų antkainių lentelė (Raimio kainų klausimas iš S1665).
- Sender: laukia Raimio 3 veiksmų (tokenas, 3 webhooks, secret).
- PMax ratchet per tROAS — tik po feed'o +7–14 d.
