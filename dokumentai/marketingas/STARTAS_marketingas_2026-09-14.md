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
