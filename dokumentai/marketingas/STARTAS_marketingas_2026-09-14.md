# STARTAS — Marketingo/verslo planas (atnaujinta 2026-09-14 naktį, po S1683)

**Pradėti nuo:** `dokumentai/marketingas/MARKETINGAS_planas_v1_s1683.md` — strategijos karkasas UŽRAKINTAS (N × V12 × 1,25; bazė 250 × €115–120 → €36–38 k; stretch 300 × €133 → €50 k; R60 leading KPI pagal produkto ciklą; šunys spearhead, katės atskirai). §18 — penki vykdymo vartai A–E (N ekonomika, CAC ekonomika, lifecycle, pajėgumas, dashboard) ir oficialus N takas 120 / 150–170 / 190–210 / 220–240 / 250.

**Analizės (duomenys iš `ps_ist_*`):** `ANALIZE_kohortos_s1683.md`, `ANALIZE_V12_mechanika_s1683.md`, `ANALIZE_R60_verte_s1683.md` (recon `irankiai/s1683_a/b/c.php`, `analize/s1683_a/b/c.json`).

**Kitas žingsnis:** 2026 Q4 OPERACINIS planas — workstream'ai su skaičiais, savininku, KPI, stop/go: N engine, Retention engine, Measurement, Legal/data, Stock/capital. Pirmi recon'ai: (A) GA4 kanalų dalis × N + `ps_fakt` spalio kanalai + `ps_fakt_reklama` spend; (B) SKU→savikaina sujungimo taisymas → proxy CM12 pagal brendą; (C) Sender/WC sutikimų būklė (eShoprent el. pašto rinkimo forma — klausimas Raimiui).

**Formatas:** diskusija; Raimis tiesiai nesako — Claude galvoja pats; pirma „ką", tik paskui „kaip"; duomenys iš serverio, ne klausimai Raimiui; planas ne „iš fantastikos", tvarkingai.

---

## Papildymas S1684 (2026-09-14 naktį) — strategija UŽDARYTA, nuo čia VYKDYMAS

**Pirmas deliverable kitame lange:** `dokumentai/marketingas/Q4_operacinis_planas_s1684.html` — ne MD tekstas, o vienas valdymo ekranas naršyklei (management dashboard + execution plan): lentelės, statuso žymos, KPI kortelės, aiškios spalvos, be ilgų tekstų. Tinka skaityti ir po mėnesio tikrinti, ar judame.

**Struktūra (Raimio):**
1. Executive juosta — 2027 tikslas (€50 k, N × V12 × 1,25), Q4 targetai (N ~120, R60 >20 %), 5 vartai A–E.
2. Workstream'ai (N engine, Retention engine, Measurement, Legal/data, Stock/capital): tikslas → dabartinė būsena → darbai → KPI → stop/go → priklausomybės → statusas.
3. N trajektorija + kanalų ekonomika (lentelė: N dabar / tikslas / CAC / €/mėn. / lead time / statusas).
4. Retention / R60 blokas (13→20→25→30→35 %, lifecycle etapai 1+2, 90/10 holdout).
5. Recon'ai A/B/C — būsena ir radiniai.
6. Working-capital constraint (vartai D).
7. Decision log — kas užrakinta / kas atvira.

**Užrakintos faktinės pataisos (A/B/C):**
- A: istoriniam kanalų N — GA4 proxy (`analize/s1682_gsc_yoy.json`); tikra atribucija nuo 09-09 (`ps_fakt_uzsakymai.kanalas_pirmas`/gclid), praktiškai nuo spalio; spend — `ps_fakt_reklama`.
- B: prieš proxy CM12 pirma sutaisyti product/variation → `_ps_savikaina` mappingą (S1683 per SKU grąžino 0).
- C: soft opt-in auditas (ERĮ 81 str.) iš serverio (WC checkout, Sender); eShoprent senos formos klausimas — NE DB duomuo, Raimis nuotraukos/teksto neturi → žymėti kaip „neįrodoma“, istorinius kontaktus traktuoti konservatyviai.

**Eiga kitame lange:** recon B (bridge, `irankiai/s1684_b.php`) → recon A (`s1684_a.php`) → recon C (`s1684_c.php`) → HTML planas su realiais skaičiais → commit + present_files. Prie strategijos negrįžti.

---

## Būklė S1684 pabaigoje (2026-09-14 vakaras) — VYKDYMAS PRADĖTAS

Recon A/B/C ATLIKTI: `ANALIZE_A_kanalai_s1684.md`, `ANALIZE_B_savikaina_CM_s1684.md`, `ANALIZE_C_sutikimai_s1684.md` (recon `irankiai/s1684_ma/mb/mb2/mc/mc2.php`, `analize/s1684_m*.json`; prefiksas `m` — lygiagretus techninis langas naudoja `s1684_a/b`).
**Q4 operacinis planas = `Q4_operacinis_planas_s1684.html`** (valdymo ekranas; atnaujinti kas 2 sav., ne perrašyti). Pradėti nuo jo.

Svarbiausi faktai: antkainis Exclusion 20 % (AV 39 %) / Josera 21 % / maistas ~30 %; `kaina_ct` be PVM (S1683 maržos klaidingos); CM12 lead brendų klientui €10–14 → mastelio CAC €5–7, dabartinis ~€19; nauji 64 % iš Ads, spend €1,3 k/mėn. (50 % katės); klientas už pristatymą nemoka (5,4 %); sutikimai 561 importuoti, kasoje opt-in NĖRA (blokuoja lifecycle), 15 srautų draft.

Kitas žingsnis: Raimio sprendimai iš „Atvira" bloko (kačių PMax, opt-in pažymėjimas, 5 100 istorinių, legacy laiškas) → Claude: produkto ciklų lentelė, kasos opt-in spec, antkainio peržiūra analitika-langas, 09-15 Ads kontrolinis taškas.

**UŽRAKINTA v1.2 (09-14 pabaiga):** Q4 planas = vykdymo baseline, konceptualiai nebekeičiamas — tik faktai/statusai/sprendimų žurnalas. Operacinis retention KPI = R_due (cycle-adjusted), R60 ≥ 20 % lieka scorecard; R_due target nustatomas po istorinio R_due baseline recon (2024–2026). Kontaktų būsenos: newsletter `consent=true` / lifecycle `soft_optin_eligible && !opt_out` / suppression bendras. Pristatymas: klientas moka, subsidija ~€1,3/užs.
Pirmi Claude darbai kitame lange: (1) produkto ciklų lentelė + istorinis R_due baseline (`s1685_*`), (2) kasos soft opt-out spec, (3) antkainio formulės peržiūra analitika-langas, (4) 09-15 Ads kontrolinis taškas.

**S1684 vakaras — padaryta:** ciklų lentelė + R_due baseline 16,1 % (`CIKLAI_ir_R_due_baseline_s1684.md`, target 22 %); soft opt-out spec (`SPEC_kasos_soft_optout_s1684.md`, laukia Raimio žodžių); `mu-plugins/petshop-analitika-langas.php` **v1.1.0 GYVAI** (md5 2264f5fd…, bak `ps-backups/petshop-analitika-langas.php.bak_s1684`, deploy `irankiai/s1684_mi.php`, patikra `s1684_mj`): Reklama — CAC naujam klientui (`ads_cac_ok_ct` 1200 / `ads_cac_stop_ct` 3500), naujas = nėra ps_ist, antkainis = marža/savikaina; Klientai — nauji/grįžtantys per ps_ist, antkainis. Faktas: spend €199 nuo T-0, 14 naujų iš Ads → CAC €14,20 (ne €19 — ankstesnis buvo įvertis). Kačių PMax jau PAUSED nuo 09-12 (ps_ads_recon). Atvira: `petshop-faktai.php` `klientas_naujas` istorijos nemato — taisyti faktų pusėje (Raimio leidimas), o ne tik lange.
Liko sprinte: Raimis — Ads UI Uploads patikra (09-15), soft opt-out žodžiai; Claude — deploy soft opt-out, „Pakartoti tą patį" mechanika (09-22+).

**S1684 (09-14 vėlai):** `mu-plugins/petshop-faktai.php` GYVAI (md5 7d607ba0…, bak `ps-backups/petshop-faktai.php.bak_s1684`, deploy `irankiai/s1684_mm.php`, backfill `s1684_mn.php`; Raimio leidimas „taisyk ką reikia") — `kliento_eile()` skaito ir `ps_ist_fakt_uzsakymai` (klientas_naujas, klientas_uzsakymo_nr, dienos_nuo_ankstesnio). Backfill: 25/50 fakt užsakymų pažymėti grįžtančiais; dabar nauji 22 / grįžę 25, vid. dienų nuo ankstesnio 115 (buvo 46/1 ir „1 d."). Analitika-langas v1.1.0 NOT EXISTS patikra lieka kaip dviguba apsauga.

**S1684 (09-14 naktį) — „Pakartoti tą patį" pagrindas GYVAI:** refill variklis JAU VEIKĖ (`petshop-core/includes/class-refill-engine.php`, `ps_refill_tracking` 38 įrašų nuo T-0, cron `ps_refill_daily_check` 08:00, pirmas due 09-21, laiškas `refill_due` T-5 su `reorder_url` add-to-cart; `post_purchase_14d` 15 pending) — bet (a) intervalai grubūs 14/30/60 d., (b) klasė `service` → siųstų BE jokio sutikimo/opt-out (prieštarauja užrakintam teisiniam modeliui). Naujas mu-plugin **`petshop-lifecycle-vartai.php` v1.0.1 GYVAI** (md5 4f09e6d5…, repo `deploy/petshop-lifecycle-vartai-v1.0.1.php`, deploy `irankiai/s1684_ms/mt.php`): (1) `CIKLAI` brendas×pakuotė (p25/med/p75 iš istorijos) → pirmo pirkimo `predicted_empty_date` = pirkimas + mediana (prio 40 po variklio; kalibruotų 2+ neliečia; mažoms pakuotėms be tikslaus įrašo — variklio įvertis); backfill 33/38; (2) filtras `petshop_email_eligibility` prio 20 srautams `refill_due`, `post_purchase_14d`: opcija `ps_lifecycle_vartai` = `soft` (numatyta: reikia usermeta `ps_soft_optin_eligible`=1 && `ps_similar_optout`≠1, kol nėra — `deferred` `soft_optout_nezinomas`) | `atvira` | `uzdaryta`; (3) 90/10 holdout pagal el. pašto hash (`holdout_10`, terminal). PASEKMĖ: iki kasos soft opt-out deploy refill/pp14 laiškai NEIŠEINA (atidėti, ne praleisti) — klientai, pirkę iki lauko atsiradimo, žymos neturės (planas: soft opt-in tik su galimybe prieštarauti renkant). Jei Raimis nusprendžia leisti esamiems be žymos — `update_option('ps_lifecycle_vartai','atvira')`. `post_purchase_2d/7d` (aptarnavimo, be pasiūlymo) — neliesta.
