# STARTAS — 2026-09-05 — UŽSAKYMŲ LANGAS, 5 ETAPAS: #1–#3 PADARYTI (S1614) → RAIMIO ATSAKYMAI, TADA #4+

> Naujam pokalbio langui. Perskaityti PIRMA, prieš bet kokį veiksmą: šį failą → `deployment_log_v1_9_18.md` (S1614 viršuje — visi faktai, prielaidos, radiniai; S1613/S1612/S1611 — 4 etapo sprendimai) → `dokumentai/UZSAKYMU_DARBALAUKIS_SPEC_v1.md` **v1.3** (§6c, §12, §12.3; **§12.4 dar nerašytas** — S1614 sprendimai tik log'e) → `dokumentai/ZODYNAS_DARBUOTOJUI_v1.md` v1.1 → `dokumentai/UZSAKYMU_LOGIKOS_REGISTRAS_v1.md` (variklio taisyklės A–J, neliesti).

## Raimio taisyklės (pažeidimas = kritinė klaida)
- Nieko iš atminties — pirma REGISTRAS / log / spec. Pilni failai. Vizuali patikra (Playwright / loopback HTML, ne dry-run). Dev duomenys = norma. Fiksuotų datų nėra. Terse. TEMP snippet'ai trinami kiekvieno run'o pradžioje.
- **Viena sistema** — darbuotojas iš naujo lango neišeina; WC darbuotojui niekur; senas desk tik variklis (`senas=1` — tik Raimiui, LP lipdukams).
- **Darbuotojo dienoraštis** prieš „padaryta“. **Mažiau, ne daugiau**: naujas ekrano elementas — klausti, ką jis nuima. Žodynas — tik iš ZODYNAS v1.1.
- **Lipdukai privalomi**: siunta klientui — tik su registruotu numeriu. Testams: `_ps_siuntos` registrą rašyti tiesiogiai payload'e (fiktyvus numeris), Venipak API nekviesti; LP — meta tiesiogiai. Vežėjo klaidos ir „grįžta“ — simuliuoti meta (`venipak_shipping_order_data`, `_ps_siunta_grizta`), kaip S1614.
- **Laiškai testuose:** `pre_wp_mail` gaudyklė prior. 4 tame pačiame procese; per admin-post išeinančius laiškus gaudo `petshop-dev-pastas.php` v1.0 (žurnalas `ps_dev_pastas_zurnalas`, skaityti NAUJAME procese — opcijų kešas).
- Nepridėti fantazijos: sprendimai — Raimio (spec §1, §6c, §12, §12.3); jei nėra — klausti, ne spėti. Bridge PAT — prašyti pradžioje („prisijunk taupant tokenus“ + PAT → `/tmp/.ghtok`).
- Variklio neliesti: `Petshop_Desk`, `Petshop_Siuntos`, `petshop-av-reduce.php` (`grazinti`), `petshop-dropship`, `petshop-dropship-sargas.php` (`_ps_sla_velavimas`), `petshop-av-tiekimas`. Darbalaukio žymės: `_ps_venipak_sekimas`, `_ps_siunta_grizta`, `_ps_siuntos_senos`, `_ps_dalys_issiusta`, `_ps_velavimo_laiskas`, **`_ps_dalys_atsaukta`, `_ps_dalys_is_naujo`, eilutės `_ps_atsaukta`** (S1614).

## Kas gyva dev'e (2026-09-04 vakaras, po S1614)
- `mu-plugins/petshop-darbalaukis.php` **v3.17.1** (275 687 B, md5 `bfc3d9044fdf32053ef838bdbce2416f`) = repo `deploy/petshop-darbalaukis.php` (+ `.php.b64`). Kopijos `ps-backups/petshop-darbalaukis-v3142/v315/v316/v317-BACKUP-2026-09-04.php`.
- `petshop-kliento-siuntos.php` **v1.3** (8 325 B, md5 `69b897ad02b0ab5ea35942a1a926a666`; „Atšaukta“ daliai) = repo `deploy/`. `petshop-dev-pastas.php` v1.0; `petshop-juosta.php` v1.5. Variklis nekeistas: desk v3.48, dropship v1.19, tiekimas v1.9.3, siuntu-laiskai v1.2, ivykiai v1.1, av-reduce, dropship-sargas v1.0.
- Cron: `ps_venipak_sekimas` kas 30 min; `ps_velavimo_laiskai` darbo dienom 14:00 (kitas 09-05 14:00); LP plugino `woo_lithuaniapost_update_tracking_status` kas val.
- **Deploy: darbalaukis b64 5 dalimis** (4×80 000 → `ps-backups/dl-vXXXX.part1…4` per `irankiai/s1614_e7a.php` šabloną + likutis payload'e; deploy šablonas `s1614_e7d.php` su md5/token/gyvo failo sargais). Testų šablonai: `s1614_e6d.php` (grįžimo simuliacijos + `admin-post` veiksmai su nonce iš sesijos + Playwright), `s1614_e4d.php` (Redaguoti POST, V14 sim), `s1614_e1d.php` (mygtukas), `e1v/e4v` (patikra naujame procese). Ilgi run'ai su Playwright — `nohup … &` + `sleep`, arba `timeout 175 ./run.sh …` curl'ui.
- Testinis klientas 5787. Testiniai užsakymai **#35414–#35444, #35450, #35771–#35772, #35774–#35780** — trinti 6 etape. Po S1614 (žr. log): #35439 su simuliuota Venipak klaida **Klausimuose**; #35438 (AV dalis atšaukta, Prins is_naujo, processing); #35421 (Prins dalis atšaukta, processing); #35431/#35434 adresai pakeisti; #35435 vėlavimo žymė; likučiai 19708 `_stock` 18, 16889 `_own_stock_qty` 1 (testiniai judesiai).

## Ką darbalaukis daro (v3.17.1, trumpai — naujoves žr. log S1614)
Eilės kaip S1612. Venipak/LP sekimas, vėlavimo laiškas 14:00, V13 — kaip S1613. **S1614:** „Pranešti klientui apie vėlavimą“ (skydelis + kortelė „[T] vėluoja“; vienas kartas); „Redaguoti“ skydelyje — adresas / Venipak ar LP paštomatas / telefonas be WC (iki išsiuntimo; įspėjimai; klaidos meta nuimama; laiškas klientui — varnelė); V14 Klausimas „Siuntos sukurti nepavyko“ iš plugino meta su „Taisyti adresą“; „Siunta grįžta“ dalinis — „Siųsti iš naujo“ tik grįžusią dalį (AV / (a) sujungti į AV / (b) tiekėjo dalis iš AV su „Lipdukas [T] iš naujo“) ir „Atšaukti tik grįžusią dalį“ (likutis grįžta, kita dalis lieka, statusas lieka, paskyroje „Atšaukta“).

## Raimio atsakymai reikalingi (S1614 prielaidos — pirma jų, tada kodas)
1. Laiškas klientui apie pakeistą adresą/paštomatą — tema „Jūsų užsakymo Nr. N pristatymo duomenys pakeisti“, tekstas „Sveiki, [vardas]. Jūsų užsakymo Nr. N pristatymo duomenis pakeitėme. Dabar: Pristatymo adresas / Paštomatas: … · Telefonas: … Jei tai netikslu, tiesiog atsakykite į šį laišką.“; varnelė numatyta ON (spec §6c) — tvirtinti / taisyti.
2. Po užregistruoto lipduko redaguoti leidžiama su įspėjimu („Lipdukas iš naujo“), ne blokuojama — taip?
3. Tiekėjui apie naują adresą sistema nerašo (tik įspėjimas „parašyk tiekėjui“) — taip?
4. Paskyroje atšauktai daliai žodis „Atšaukta“ — taip?
5. **(b) variantas:** grįžusi tiekėjo dalis, kai AV jau išsiųsta/atšaukta, siunčiama iš AV su TIEKĖJO manifesto lipduku (`vp_reg` sandelis=T, siuntėjas UAB Avesa, kurjeris paima iš AV) — ar Venipak'ui operaciškai tinka? Alternatyva (AV manifestas) = antra AV dalis (K4 modelio keitimas).
6. #5 iš S1613 (LP pristatyta data, sekimo ribos) ir S1613 prielaida 3 (užsakymas Klausimuose „[T] vėluoja“ automatinio vėlavimo laiško negauna — dabar yra rankinis mygtukas) — patvirtinta tyliai?

## 5 ETAPAS toliau (eilė — Raimis 09-04) — spec §7/§12
Po atsakymų: **spec §12.4 (S1614 sprendimai, pilnu failu)** → kiekiai, dalinis atšaukimas/grąžinimas kitais atvejais (ne „grįžta“), Sąskaita (AVPN/IAPV), „Kaip mato klientas“ (svečiui), „Naujas užsakymas“ (telefoninis), „Atsiėmimas AV“ (`local_pickup`), paskyros UI lokalizacija. Kiekvienam — spec/registras pirma, recon, Raimio sprendimai, tik tada kodas.

## 6 ETAPAS
E2E, testinių valymas (S1267 pamoka: kaskados nėra; Venipak V07267E1000030–057 ir manifestai — Raimis savitarnoje; likučiai 19708/16889 testiniai), tikra darbuotojo paskyra vietoj `testuotojas`.

## Atviri / atidėti
J1 pirma reali LP siunta · „Lipdukas [T] iš naujo“ su realiu Venipak (nespausta) · LP „Redaguoti“ kelias gyvai · Venipak kodai 4/5/7/8 · V12, V13 (variklis), V14 (variklis; darbalaukio lygiu padaryta) · seno desk `siuntos_kodas()` LP raktai · T10/V1 · dovanėlės, kasos sakinys (vėliau) · T-0: mail-tester per WC SMTP, DMARC → quarantine po mėnesio, LP plugino slaptažodžio rotacija.

## Bridge
Repo `raimis079-creator/petshop-bridge`. `irankiai/run.sh <file> <phases> analize/<out>.json <get_key> <browser 0|1>` (kopijuoti į `/home/claude/ps/` su `irankiai/mjs_template.mjs`, `irankiai/ghput.sh`). Rezultatai — iš repo per naujausią commit SHA (`?ref=SHA`). Playwright ~150–300 s, curl ~60–120 s. Prieš kiekvieną run'ą — `DELETE snippets WHERE name LIKE 'TEMP%' AND active=0`. Vietinis `php -l` — `apt-get update && apt-get install -y php-cli` prieš pirmą run'ą; JS bloką tikrinti `node -e "new Function(...)"`. Commit'ui — `ghput.sh <local> <repo_path> <msg>`. Log — `dokumentai/deployment_log_v1_9_18.md`; STARTAS — `dokumentai/STARTAS_2026-09-05_5_etapas_po_S1614.md`.
