# STARTAS — 2026-09-04 — UŽSAKYMŲ LANGAS, 3 ETAPAS (tęsinys po S1608; #1–#4 padaryti)

> Naujam pokalbio langui. Perskaityti PIRMA, prieš bet kokį veiksmą: šį failą → `deployment_log_v1_9_9.md` (S1608 viršuje) → `dokumentai/UZSAKYMU_DARBALAUKIS_SPEC_v1.md` v1.2 (§12 — Raimio sprendimai) → `dokumentai/ZODYNAS_DARBUOTOJUI_v1.md` v1.1 → `dokumentai/AUDITAS_UZSAKYMU_LANGAS_2026-09-03.md` (kas liko) → `dokumentai/UZSAKYMU_LOGIKOS_REGISTRAS_v1.md` (variklio taisyklės A–J, neliesti).

## Raimio taisyklės (pažeidimas = kritinė klaida)
- Nieko iš atminties — pirma REGISTRAS / log / spec. Pilni failai. Vizuali patikra (Playwright paspaudimai, ne dry-run). Dev duomenys = norma. Fiksuotų datų nėra. Terse. TEMP snippet'ai trinami kiekvieno run'o pradžioje.
- **Viena sistema** — darbuotojas iš naujo lango neišeina; WC darbuotojui niekur; senas desk tik variklis (`senas=1` — tik Raimiui, LP lipdukams).
- **Darbuotojo dienoraštis** prieš „padaryta“: 2 nauji užsakymai nuo atėjimo iki „Kurjeris paėmė“, tekstas kaip mato darbuotojas, ne kodas. Raimis: „pratestuok kaip paprastas darbuotojas, kuris nežino sistemos“.
- **Mažiau, ne daugiau**: kiekvienas naujas ekrano elementas — klausti, ką jis nuima. Spalvos tik „Visi“. Žodynas — tik iš ZODYNAS v1.1.
- **Laiškai testuose:** kiekvienas payload'as su užsakymais — su `pre_wp_mail` gaudykle (S1608 incidentas: 320 WC laiškų į spam). Dev'e laiškus blokuoja `petshop-dev-pastas.php` v1.0 (pagal hostą; žurnalas `ps_dev_pastas_zurnalas`, langas `page=ps-dev-pastas`); testų turinį tikrinti ten arba gaudyklę kelti į prior. 4.
- Nepridėti fantazijos: sprendimai — Raimio, tik sąraše spec §1 ir §12; jei nėra — klausti, ne spėti.

## Kas gyva dev'e (2026-09-03 vakaras)
- `mu-plugins/petshop-darbalaukis.php` **v3.9** (169 497 B, md5 `4a798693625447d91bcbcf2fcb5f2dee`) = repo `deploy/petshop-darbalaukis.php` (+ `.b64`). Kopijos `uploads/ps-backups/petshop-darbalaukis-v03/v12/v20/v24/v301/v35/v36/v361/v37/v38/v381-BACKUP-2026-09-03.php`.
- `mu-plugins/petshop-dev-pastas.php` **v1.0** (md5 `744c69c92bb8f362ca7e3ccc1b80ddc5`) — dev laiškų saugiklis.
- `mu-plugins/petshop-juosta.php` **v1.5** (md5 `13c9a2c81bd4a036389c07d386e67a09`) = repo `deploy/petshop-juosta.php`.
- Variklis nekeistas: desk v3.48 (`33c9b1fe`), dropship v1.19 (`609d2b1e`), tiekimas v1.9.3 (`018548dc`), siuntu-laiskai v1.2 gyvas `753f8c6c` (repo kopija pasenusi — neliesti), ivykiai v1.1 (`1bd24c70`).
- Deploy: b64 trimis dalimis (`uploads/ps-backups/dl-vXX.part1` + `.part2` po 80 000 ženklų atskirais run'ais, trečia dalis deploy payload'e; vienas payload >110 KB neveikia, media upload 500). Šablonas — S1608 `e3a/e3b/e3d.php` (log). Jei run'as grąžina pradinį puslapį vietoj JSON — pakartoti su nauju GET raktu (S1608 `e3_run2b`).
- Testiniai užsakymai **#35414–#35444, #35450, #35771–#35772 (cancelled)** (AUDITAS Testas 1–31, Rai B #35441/#35442) — palikti; užsakymai tiekėjams #14 (VF) ir #15 (ZB) gauti (S1608 testas); opcijos `ps_e3_oid`, `ps_audit_mail` — trinti su testiniais; Venipak V07267E1000030–057 ir manifestai …0902001–006, …0903001/002/005 — Raimis trina savitarnoje. Partijos #10 (gauta), #12 Quattro (kaupiama), #13 Prins (gauta). Likučiai: 19708 `_stock` ~14, 18593 `_own_stock_qty` ~21, 16727 `_own_stock_qty` 1.

## Ką darbalaukis daro (v3.9, trumpai)
Eilės: Gauti (neatidaryti, `_ps_matyta`) · Neišrūšiuoti (2+ sandėliai / trūkumas; „Rūšiuoti“ + „Auto“) · Laukiam iš tiekėjų (kortelės per tiekėją: A „Gauta“ užsakytiems užsakymams tiekėjui su kiekiais/galiojimu, ZB „Kopijuoti“; B „Užsakyti iš [T] į AV (n prek.)“ su pristatymu/svoriu/dėžėmis/adresatais/peržiūra, „Kartu su Dropshipping iš [T] (n prek.)“ vienintelis mygtukas, kai laukia Dropshipping — G4, vienas laiškas; varnelė prie kiekvieno užsakymo; viskas per variklio `ps_tiekimas`, Tiekimo langas darbuotojui nereikalingas) · Surinkti AV (Surinkti → Lipdukas dialogas su dėžėmis; Surinkti visus / Lipdukai visiems) · Dropshipping (kortelės per tiekėją: Lipdukai (n) / Lipdukas eilutei → Užsakyti iš [T] (n užs.) su peržiūra, varnelėmis, „+ į AV“; ZB: Kopijuoti · Suvesti · Suvesta) · Paruošta siųsti (AV: Lipdukas · Kurjerio sąrašas · Kurjeris paėmė (viską); tiekėjai: [T] išsiuntė; K4 dalies būsena `_ps_dalys_issiusta`, completed + sekimo laiškas kai visos) · Klausimai (kortelės) · Neapmokėti · Visi (būsenos žymė, spalvota eilutė). Rytinė eiga = 8 žingsniai be užrakto. Skydelis: keliai su „kodėl“, žingsneliai, dėžės, „Lipdukas iš naujo“, Istorija (AJAX), „Dabar: … · toliau: …“. Pranešimai po veiksmo su „→ dabar: …“.

## 3 ETAPAS — darbai (Raimio patvirtinta eilė)
1. ~~**Laukiam iš tiekėjų kortelės**~~ — **PADARYTA S1608** (v3.6→v3.7). Raimio sprendimai: tiekėjui TIK vienas laiškas (kai laukia Dropshipping — tik „Kartu su Dropshipping iš [T]“); galiojimas neprivalomas; juosta neliečiama; varnelės prie užsakymų Dropshipping/Laukiam kortelėse. Užsakymų į AV atsargoms sudarymas — vėliau (Raimis).
2. ~~**Trijų sandėlių testas**~~ — **PADARYTA S1608** (#35450: Neišrūšiuoti → Laukiam → VF užsakyta/gauta (dar Laukiam) → ZB užsakyta/gauta → Surinkti AV, lape 3 vnt., `_ps_shipments`=1). Dienoraštis — log S1608.
3. ~~Audito likučiai~~ — **PADARYTA S1608** (v3.8/3.8.1): K2 skydelis per AJAX, V11 tylus atnaujinimas, V9 „Visi“ po 50 + „išsiųsta šiandien“ iš `_ps_dalys_issiusta`, T2 ✓ (užraktas), T3 ✓ (riba 300 + įspėjimas). **Liko Raimiui:** V12 — `perskaiciuoti_grupes()` dubliuoja variklį; `Petshop_AV_Order::fiksuoti()` netinka (perrašo kelius) → reikia viešo variklio metodo (R13 išimtis). Raimis: neapmokėti — Gauti + Neapmokėti, ne Klausimai (padaryta v3.9). T10/V1 testai — nepadaryti.
4. ~~Žodyno likučiai~~ — **PADARYTA S1608** (v3.9): be tiekėjo — tik „Iš AV“; variklio pranešimai verčiami į žodyną (AV/VF/ZB, „užsakymas tiekėjui #n“).
5. **Sekimo laiškai (4 etapo pamatas, spec §12)**: laiškas **po kiekvienos siuntos** („Išsiųsta 1 iš 2 …“) — perdaryti `issiusta()` dalies laišką dabar, kad 4 etapo cron rašytų į tą patį; sekimo juostelė laiške.
6. LP Express — tik per Rytinę eigą (senas vaizdas) iki T-0 testo (J1).

## 4–6 ETAPAI (nekeisti eilės be Raimio)
4 — Venipak sekimas cron (Picked up → dalis išsiųsta + laiškas automatiškai; Delivered; blogos būsenos → Klausimas), vėlavimo sargas su laišku klientui. 5 — Redaguoti (adresas/paštomatas, kiekiai, dalinis atšaukimas), Sąskaita (AVPN/IAPV — `_petshop_order_pdf` nėra, snippet 652 neaktyvus), „Kaip mato klientas“ puslapis, **„Naujas užsakymas“** (telefoninis) ir pristatymo būdas **„Atsiėmimas AV“** (`local_pickup`; taisyklė: viskas į AV, „Klientas atsiėmė“), kasos sakinys „prekės gali atvykti atskiromis siuntomis“ (tik kai ne vien AV). 6 — E2E, testinių valymas (S1267 pamoka: ps_shipments / ps_tiekimas kaskados nėra), tikra darbuotojo paskyra vietoj `testuotojas`.

## Atviri klausimai Raimiui
§11.1 Venipak neatsiimtos siuntos kaina · vėlavimo laiško terminas ir tekstas · tiekėjų atvežimo dienos (kortelei „išeina, kai atveš Prins (antradienį)“) · V12 (viešas variklio metodas — R13 išimtis?) · dovanėlės kortelė · LP realus testas T-0.

## Bridge
Repo `raimis079-creator/petshop-bridge`, PAT prašyti Raimio pokalbio pradžioje (į `/tmp/.ghtok`). `irankiai/run.sh <file> <phases> analize/<out>.json <get_key> <browser 0|1>`; `irankiai/mjs_template.mjs` (shots su `click`, `eval`, `h`, `full`; klaidos konsolėje). Rezultatai — iš repo per naujausią commit SHA. Playwright ~150 s, curl ~25 s. Prieš kiekvieną run'ą — `DELETE snippets WHERE name LIKE 'TEMP%' AND active=0`.
