# STARTAS — 2026-09-04 — UŽSAKYMŲ LANGAS, 3 ETAPAS (tęsinys po S1607)

> Naujam pokalbio langui. Perskaityti PIRMA, prieš bet kokį veiksmą: šį failą → `deployment_log_v1_9_8.md` (S1607 viršuje) → `dokumentai/UZSAKYMU_DARBALAUKIS_SPEC_v1.md` v1.2 (§12 — Raimio sprendimai) → `dokumentai/ZODYNAS_DARBUOTOJUI_v1.md` v1.1 → `dokumentai/AUDITAS_UZSAKYMU_LANGAS_2026-09-03.md` (kas liko) → `dokumentai/UZSAKYMU_LOGIKOS_REGISTRAS_v1.md` (variklio taisyklės A–J, neliesti).

## Raimio taisyklės (pažeidimas = kritinė klaida)
- Nieko iš atminties — pirma REGISTRAS / log / spec. Pilni failai. Vizuali patikra (Playwright paspaudimai, ne dry-run). Dev duomenys = norma. Fiksuotų datų nėra. Terse. TEMP snippet'ai trinami kiekvieno run'o pradžioje.
- **Viena sistema** — darbuotojas iš naujo lango neišeina; WC darbuotojui niekur; senas desk tik variklis (`senas=1` — tik Raimiui, LP lipdukams).
- **Darbuotojo dienoraštis** prieš „padaryta“: 2 nauji užsakymai nuo atėjimo iki „Kurjeris paėmė“, tekstas kaip mato darbuotojas, ne kodas. Raimis: „pratestuok kaip paprastas darbuotojas, kuris nežino sistemos“.
- **Mažiau, ne daugiau**: kiekvienas naujas ekrano elementas — klausti, ką jis nuima. Spalvos tik „Visi“. Žodynas — tik iš ZODYNAS v1.1.
- Nepridėti fantazijos: sprendimai — Raimio, tik sąraše spec §1 ir §12; jei nėra — klausti, ne spėti.

## Kas gyva dev'e (2026-09-03 vakaras)
- `mu-plugins/petshop-darbalaukis.php` **v3.5** (140 530 B, md5 `f0e791d886aa8a44e5660531f8618069`) = repo `deploy/petshop-darbalaukis.php` (+ `.b64`). Kopijos `uploads/ps-backups/petshop-darbalaukis-v03/v12/v20/v24/v301-BACKUP-2026-09-03.php`.
- `mu-plugins/petshop-juosta.php` **v1.5** (md5 `13c9a2c81bd4a036389c07d386e67a09`) = repo `deploy/petshop-juosta.php`.
- Variklis nekeistas: desk v3.48 (`33c9b1fe`), dropship v1.19 (`609d2b1e`), tiekimas v1.9.3 (`018548dc`), siuntu-laiskai v1.2 gyvas `753f8c6c` (repo kopija pasenusi — neliesti), ivykiai v1.1 (`1bd24c70`).
- Deploy: b64 dviem dalimis (`uploads/ps-backups/dl-vXX.part1` + antra dalis payload'e; vienas payload >110 KB neveikia, media upload 500). Šablonas — `run17a.php`/`run17b.php` pokalbio S1607 (žr. log).
- Testiniai užsakymai **#35414–#35444** (AUDITAS Testas 1–30, Rai B #35441/#35442) — palikti; Venipak V07267E1000030–057 ir manifestai …0902001–006, …0903001/002/005 — Raimis trina savitarnoje. Partijos #10 (gauta), #12 Quattro (kaupiama), #13 Prins (gauta). Likučiai: 19708 `_stock` ~14, 18593 `_own_stock_qty` ~21, 16727 `_own_stock_qty` 1.

## Ką darbalaukis daro (v3.5, trumpai)
Eilės: Gauti (neatidaryti, `_ps_matyta`) · Neišrūšiuoti (2+ sandėliai / trūkumas; „Rūšiuoti“ + „Auto“) · Laukiam iš tiekėjų (kons → Tiekimas) · Surinkti AV (Surinkti → Lipdukas dialogas su dėžėmis; Surinkti visus / Lipdukai visiems) · Dropshipping (kortelės per tiekėją: Lipdukai (n) / Lipdukas eilutei → Užsakyti iš [T] (n užs.) su peržiūra, varnelėmis, „+ į AV“; ZB: Kopijuoti · Suvesti · Suvesta) · Paruošta siųsti (AV: Lipdukas · Kurjerio sąrašas · Kurjeris paėmė (viską); tiekėjai: [T] išsiuntė; K4 dalies būsena `_ps_dalys_issiusta`, completed + sekimo laiškas kai visos) · Klausimai (kortelės) · Neapmokėti · Visi (būsenos žymė, spalvota eilutė). Rytinė eiga = 8 žingsniai be užrakto. Skydelis: keliai su „kodėl“, žingsneliai, dėžės, „Lipdukas iš naujo“, Istorija (AJAX), „Dabar: … · toliau: …“. Pranešimai po veiksmo su „→ dabar: …“.

## 3 ETAPAS — darbai (Raimio patvirtinta eilė)
1. **Laukiam iš tiekėjų kortelės**: „Užsakyti iš [T] į AV“ = užsakymas tiekėjui čia pat (G4: partija + tas pats laiškas su dropship užsakymais, arba atskiras), priėmimas „Gauta“ čia pat (dabar — Tiekimo lange). Tiekimo langas lieka Raimiui.
2. **Trijų sandėlių testas** (AV + ZB + VF „viską į AV“): Neišrūšiuoti → Laukiam → VF priimta (dar Laukiam) → ZB priimta → Surinkti AV su visomis prekėmis, viena siunta. Dienoraštis + nuotraukos.
3. Audito likučiai: V9 (Visi puslapiavimas, „išsiųsta šiandien“ iš `_ps_dalys_issiusta`), V11 (60 s reload → tylus atnaujinimas), V12 (`perskaiciuoti_grupes()` dubliuoja variklį — reikia viešo variklio metodo; R13 išimtis — Raimio sprendimas), K2 antra pusė („Visi“ ≈ 450 KB; skydelis per AJAX), S2/S3, T2/T3/T10 testai, V1 testas (prekė be sandėlio — dev'e neradau).
4. Žodyno likučiai: skydelyje pilki „Tiekėjas siunčia klientui / veža į AV“ kai tiekėjo nėra (Raimis: „galėsi pataisyti“); `bukle` „gauta · partija #10“ → „užsakymas tiekėjui #10“; variklio pranešimų trumpiniai.
5. **Sekimo laiškai (4 etapo pamatas, spec §12)**: laiškas **po kiekvienos siuntos** („Išsiųsta 1 iš 2 …“) — perdaryti `issiusta()` dalies laišką dabar, kad 4 etapo cron rašytų į tą patį; sekimo juostelė laiške.
6. LP Express — tik per Rytinę eigą (senas vaizdas) iki T-0 testo (J1).

## 4–6 ETAPAI (nekeisti eilės be Raimio)
4 — Venipak sekimas cron (Picked up → dalis išsiųsta + laiškas automatiškai; Delivered; blogos būsenos → Klausimas), vėlavimo sargas su laišku klientui. 5 — Redaguoti (adresas/paštomatas, kiekiai, dalinis atšaukimas), Sąskaita (AVPN/IAPV — `_petshop_order_pdf` nėra, snippet 652 neaktyvus), „Kaip mato klientas“ puslapis, **„Naujas užsakymas“** (telefoninis) ir pristatymo būdas **„Atsiėmimas AV“** (`local_pickup`; taisyklė: viskas į AV, „Klientas atsiėmė“), kasos sakinys „prekės gali atvykti atskiromis siuntomis“ (tik kai ne vien AV). 6 — E2E, testinių valymas (S1267 pamoka: ps_shipments / ps_tiekimas kaskados nėra), tikra darbuotojo paskyra vietoj `testuotojas`.

## Atviri klausimai Raimiui
§11.1 Venipak neatsiimtos siuntos kaina · vėlavimo laiško terminas ir tekstas · tiekėjų atvežimo dienos (kortelei „išeina, kai atveš Prins (antradienį)“) · V12 (viešas variklio metodas — R13 išimtis?) · dovanėlės kortelė · LP realus testas T-0.

## Bridge
Repo `raimis079-creator/petshop-bridge`, PAT prašyti Raimio pokalbio pradžioje (į `/tmp/.ghtok`). `irankiai/run.sh <file> <phases> analize/<out>.json <get_key> <browser 0|1>`; `irankiai/mjs_template.mjs` (shots su `click`, `eval`, `h`, `full`; klaidos konsolėje). Rezultatai — iš repo per naujausią commit SHA. Playwright ~150 s, curl ~25 s. Prieš kiekvieną run'ą — `DELETE snippets WHERE name LIKE 'TEMP%' AND active=0`.
