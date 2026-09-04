# STARTAS — 2026-09-04 — UŽSAKYMŲ LANGAS, 4 ETAPAS BAIGTAS (po S1613: #2, #4, #4a, #5, #6 padaryti) → RAIMIO ATSAKYMAI, TADA 5 ETAPAS

> Naujam pokalbio langui. Perskaityti PIRMA, prieš bet kokį veiksmą: šį failą → `deployment_log_v1_9_17.md` (S1613 viršuje — visi S1613 faktai, prielaidos, radiniai; S1612/S1611 — 4 etapo sprendimai) → `dokumentai/UZSAKYMU_DARBALAUKIS_SPEC_v1.md` **v1.3** (§12 + §12.3) → `dokumentai/ZODYNAS_DARBUOTOJUI_v1.md` v1.1 → `dokumentai/UZSAKYMU_LOGIKOS_REGISTRAS_v1.md` (variklio taisyklės A–J, neliesti).

## Raimio taisyklės (pažeidimas = kritinė klaida)
- Nieko iš atminties — pirma REGISTRAS / log / spec. Pilni failai. Vizuali patikra (Playwright / loopback HTML, ne dry-run). Dev duomenys = norma. Fiksuotų datų nėra. Terse. TEMP snippet'ai trinami kiekvieno run'o pradžioje.
- **Viena sistema** — darbuotojas iš naujo lango neišeina; WC darbuotojui niekur; senas desk tik variklis (`senas=1` — tik Raimiui, LP lipdukams).
- **Darbuotojo dienoraštis** prieš „padaryta“. **Mažiau, ne daugiau**: naujas ekrano elementas — klausti, ką jis nuima. Žodynas — tik iš ZODYNAS v1.1.
- **Lipdukai privalomi**: siunta klientui — tik su registruotu numeriu. Testams: `_ps_siuntos` registrą rašyti tiesiogiai payload'e (fiktyvus numeris), Venipak API nekviesti; LP — meta `_woo_lithuaniapost_barcode` + `_woo_lithuaniapost_shipping_status_value` tiesiogiai (S1613 e3d). **Dėmesio:** LP plugino `woocommerce_order_status_changed` apmokėtam užsakymui be `_woo_lithuaniapost_shipping_item_id` bando kurti siuntą realiu LP API — testuose su LP užsakymais statuso keitimas tai sužadina (dev'e nepavyksta, LT0001).
- **Laiškai testuose:** kiekvienas payload'as su užsakymais — su `pre_wp_mail` gaudykle prior. 4 (S1608). Dev'e blokuoja `petshop-dev-pastas.php` v1.0.
- Nepridėti fantazijos: sprendimai — Raimio (spec §1, §12, §12.3); jei nėra — klausti, ne spėti. Bridge PAT — prašyti pradžioje („prisijunk taupant tokenus“ + PAT → `/tmp/.ghtok`).
- Variklio neliesti: `Petshop_Desk`, `Petshop_Siuntos`, `petshop-av-reduce.php`, `petshop-dropship`, `petshop-dropship-sargas.php` (`_ps_sla_velavimas`), `petshop-av-tiekimas`. Darbalaukio žymės: `_ps_venipak_sekimas`, `_ps_siunta_grizta`, `_ps_siuntos_senos`, `_ps_dalys_issiusta`, `_ps_velavimo_laiskas`.

## Kas gyva dev'e (2026-09-04, po S1613)
- `mu-plugins/petshop-darbalaukis.php` **v3.14.2** (236 178 B, md5 `165871eb0c83297ebdfd637416ed6d53`) = repo `deploy/petshop-darbalaukis.php` (+ `.php.b64`). Kopijos `ps-backups/petshop-darbalaukis-v3111…v314-BACKUP-2026-09-04.php`.
- `petshop-kliento-siuntos.php` v1.2; `petshop-dev-pastas.php` v1.0; `petshop-juosta.php` v1.5. Variklis nekeistas: desk v3.48, dropship v1.19, tiekimas v1.9.3, siuntu-laiskai v1.2, ivykiai v1.1, av-reduce, dropship-sargas v1.0.
- **Cron:** `ps_venipak_sekimas` kas 30 min (Venipak API + LP meta; opcija `ps_venipak_sekimas_paskutinis` su `lp`); `ps_velavimo_laiskai` — vienkartinis, perplanuojamas į kitą 14:00 Vilnius (opcija `ps_velavimo_laiskai_paskutinis`); LP plugino `woo_lithuaniapost_update_tracking_status` kas val. (rašo tik meta; su „Never“ statuso nekeičia).
- Vieši metodai testams: `venipak_sekimas([ids])`, `velavimo_laiskai($dabar_ts,[ids])` (simuliuota diena, be perplanavimo), `darbo_diena()`, `pilnos_darbo_dienos()`, `kitas_1400()`, `velykos()`, `issiusta($o,$u,$sekimo,$dalis,$kanalas)`, `kliento_siuntos($o)`, `sekimas($o)`.
- Deploy: darbalaukis b64 **4 dalimis** (`ps-backups/dl-vXXXX.part1/2/3` po 80 000 + ketvirta payload'e). Šablonai `irankiai/s1613_e9a/b/c` (dalys), `s1613_e10d.php` (deploy su md5 sargais + testas naujame procese, skydelis ajax kaip testuotojas su nonce iš sesijos, Playwright su `eval`), `s1613_e7d.php` (vėlavimo laiško simuliacijos), `s1613_e3d.php` (LP simuliacija). Ilgi run'ai su Playwright — `nohup … &` tame pačiame tool-call'e su `sleep`, pollinti runs API; subshell `( … & )` nužudomas.
- Testinis klientas 5787 (`s1609.klientas@avesa.lt`). Testiniai užsakymai **#35414–#35444, #35450, #35771–#35772, #35774–#35780** — trinti 6 etape. Po S1613: #35436 su `_ps_velavimo_laiskas`, #35416 completed (fiktyvus LP CC000000001LT, `lp-delivered`), #35414 su `_ps_velavimo_laiskas`, #35418 completed (ZB, sistema), #35421 processing (Prins išsiuntė, laukia AV). Opcijos `ps_e3_oid`, `ps_e3_oid2`, `ps_audit_mail`, `ps_venipak_sekimas_paskutinis`, `ps_velavimo_laiskai_paskutinis` — trinti su testiniais.

## Ką darbalaukis daro pats (v3.14.2, trumpai)
Eilės kaip S1612. **Venipak sekimas** (kas 30 min): paėmė → „[T] išsiuntė“ / „Kurjeris paėmė“ + laiškas; 9 → „Pristatyta“; „return“ → Klausimas „Siunta grįžta“ (Siųsti iš naujo · Atšaukti — prekės grįžo į AV). **LP sekimas** (tas pats cron, tik plugino meta): `lp-on-the-way`/`lp-delivered` → „Kurjeris paėmė“ + laiškas (`kas=LP Express`), `lp-delivered` → „Pristatyta“; skydelyje „— LP Express: pristatyta, 09-04 13:24“. **Vėlavimo laiškas** darbo dienom 14:00: apmokėtas, ≥3 pilnos darbo dienos, dalis neišsiųsta, ne Klausimuose, vienas kartas; pill „klientui pranešta apie vėlavimą …“. **V13 „[T] vėluoja“** pagal dalis: tiekėjo tiesiai dalis >24 val. nuo užsakymo, neišsiųsta → Klausimas + Paruošta siųsti su „[T] išsiuntė“; dingsta pats.

## Raimio atsakymai 09-04 vakaras (S1613 pabaiga) — GALIOJA
- **Vėlavimo laiškas rankiniu mygtuku (Raimio idėja, sutarta):** mygtukas **„Pranešti klientui apie vėlavimą“** Klausimo kortelėje „[T] vėluoja“ IR skydelyje (apmokėtas, dar neišsiųstas, žymės nėra) — siunčia tą patį suderintą laišką (tema „Jūsų užsakymą Nr. N dar komplektuojame“), vieną kartą (žymė `_ps_velavimo_laiskas`, po to pill, mygtuko nebėra; kanalas web, kas — darbuotojas). Automatinis 14:00 nekeičiamas (Klausimuose praleidžia). **Kito lango #1.**
- LP „pristatyta“ data (plugino lentelė / pastebėjimo laikas) — **taip**. Sekimo ribos 60 d. / ≤200 (Venipak ir LP) — techninės, paliktos.
- **Adreso taisymas (Raimis: klientai prirašo nesąmoningų adresų — kurjeriui, ne tik paštomatui):** 5 etapo #1 „Redaguoti“ = pristatymo adresas / paštomatas skydelyje be WC; kartu **V14 darbalaukio lygiu** — Klausimas „Siuntos sukurti nepavyko“ iš Venipak/LP plugino meta (`_woo_lithuaniapost_parcel_create_error`, `lp-parcel-failed`; Venipak — recon) su „Taisyti adresą“ → po pataisymo lipdukas iš naujo. Variklio `klausimas()` neliečiamas. **Kito lango #2.**
- LP plugino kabliukas (realus API keičiant statusą, kai siuntos nėra) — paliekam, stebim su J1.
- „Siunta grįžta“ pagal tekstą (kodo nėra) — iki pirmos realios grąžinamos siuntos. Kelių dėžių „paėmė“ nuo pirmos — **taip**. Dalinis grįžimas (viena iš dviejų siuntų) — užrakinta iki 5 etapo „Redaguoti“ — **laukia Raimio „taip/ne“** (paaiškinta: „Siųsti iš naujo“ tik vienai daliai ir „Atšaukti“, kai kita siunta jau pas klientą, dar nemokama). `_ps_av_reduced_qty=q` — kodo klausimas, mano.

## 5 ETAPAS (eilė — Raimis 09-04) — spec §7/§12
**#1 mygtukas „Pranešti klientui apie vėlavimą“ → #2 Redaguoti: adresas/paštomatas + Klausimas „Siuntos sukurti nepavyko“ (V14)** → kiekiai, dalinis atšaukimas/grąžinimas/persiuntimas, Sąskaita (AVPN/IAPV), „Kaip mato klientas“ (svečiui), „Naujas užsakymas“ (telefoninis), „Atsiėmimas AV“ (`local_pickup`), paskyros UI lokalizacija. Kiekvienam — spec/registras pirma, recon, Raimio sprendimai, tik tada kodas.

## 6 ETAPAS
E2E, testinių valymas (S1267 pamoka: kaskados nėra; Venipak V07267E1000030–057 ir manifestai — Raimis savitarnoje), tikra darbuotojo paskyra vietoj `testuotojas`.

## Atviri / atidėti
J1 pirma reali LP siunta (patikrinti plugino lentelės `updated` datą sekime) · „Sekti siuntą“ Venipak URL su pirma realia siunta · Venipak kodai 4/5/7/8 · V12, V13 (variklis), V14 · seno desk `siuntos_kodas()` LP raktai · T10/V1 · dovanėlės, kasos sakinys (vėliau) · T-0: mail-tester per WC SMTP, DMARC → quarantine po mėnesio, LP plugino slaptažodžio rotacija.

## Bridge
Repo `raimis079-creator/petshop-bridge`. `irankiai/run.sh <file> <phases> analize/<out>.json <get_key> <browser 0|1>` (kopijuoti į `/home/claude/ps/` su `irankiai/mjs_template.mjs`). Rezultatai — iš repo per naujausią commit SHA. Playwright ~150–500 s, curl ~60 s. Prieš kiekvieną run'ą — `DELETE snippets WHERE name LIKE 'TEMP%' AND active=0`. Vietinis `php -l` — `apt-get install -y php-cli` prieš pirmą run'ą. Commit'ui — `ghput.sh <local> <repo_path> <msg>` (Contents API su SHA; S1613 `irankiai/ghput.sh`).
