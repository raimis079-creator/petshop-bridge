# STARTAS — 2026-09-05 — UŽSAKYMŲ LANGAS, 5 ETAPAS: #1–#3 PADARYTI IR RAIMIO SPRENDIMAI ĮGYVENDINTI (S1614, v3.18) → v3.18.1 + spec §12.4, TADA #4+

> Naujam pokalbio langui. Perskaityti PIRMA, prieš bet kokį veiksmą: šį failą → `deployment_log_v1_9_19.md` (S1614 viršuje — visi faktai, Raimio sprendimai 09-04 vakaras, v3.18 testas, radiniai; S1613/S1612/S1611 — 4 etapo sprendimai) → `dokumentai/UZSAKYMU_DARBALAUKIS_SPEC_v1.md` **v1.3** (§6c, §12, §12.3; **§12.4 dar nerašytas** — S1614 sprendimai tik log'e) → `dokumentai/ZODYNAS_DARBUOTOJUI_v1.md` v1.1 → `dokumentai/UZSAKYMU_LOGIKOS_REGISTRAS_v1.md` (variklio taisyklės A–J, neliesti).

## Raimio taisyklės (pažeidimas = kritinė klaida)
- Nieko iš atminties — pirma REGISTRAS / log / spec. Pilni failai. Vizuali patikra (Playwright / loopback HTML, ne dry-run). Dev duomenys = norma. Fiksuotų datų nėra. Terse. TEMP snippet'ai trinami kiekvieno run'o pradžioje.
- **Viena sistema** — darbuotojas iš naujo lango neišeina; WC darbuotojui niekur; senas desk tik variklis (`senas=1` — tik Raimiui, LP lipdukams).
- **Darbuotojo dienoraštis** prieš „padaryta“. **Mažiau, ne daugiau**: naujas ekrano elementas — klausti, ką jis nuima. Žodynas — tik iš ZODYNAS v1.1.
- **Lipdukai privalomi**: siunta klientui — tik su registruotu numeriu. Testams: `_ps_siuntos` registrą rašyti tiesiogiai payload'e (fiktyvus numeris), Venipak API nekviesti; LP — meta tiesiogiai. Vežėjo klaidos ir „grįžta“ — simuliuoti meta (`venipak_shipping_order_data`, `_ps_siunta_grizta`), kaip S1614.
- **Laiškai testuose:** `pre_wp_mail` gaudyklė prior. 4 tame pačiame procese; per admin-post išeinančius laiškus gaudo `petshop-dev-pastas.php` v1.0 (žurnalas `ps_dev_pastas_zurnalas`, skaityti NAUJAME procese — opcijų kešas).
- Nepridėti fantazijos: sprendimai — Raimio (spec §1, §6c, §12, §12.3); jei nėra — klausti, ne spėti. Bridge PAT — prašyti pradžioje („prisijunk taupant tokenus“ + PAT → `/tmp/.ghtok`).
- Variklio neliesti: `Petshop_Desk`, `Petshop_Siuntos`, `petshop-av-reduce.php` (`grazinti`), `petshop-av-sheets.php` (lapas — visos `_ps_source=av` eilutės, Raimis sutiko), `petshop-dropship`, `petshop-dropship-sargas.php` (`_ps_sla_velavimas`), `petshop-av-tiekimas`. Darbalaukio žymės: `_ps_venipak_sekimas`, `_ps_siunta_grizta`, `_ps_siuntos_senos`, `_ps_dalys_issiusta`, `_ps_velavimo_laiskas`, **`_ps_dalys_atsaukta`, `_ps_dalys_baigtos`, eilučių `_ps_atsaukta`, `_ps_issiusta`** (S1614). `_ps_dalys_is_naujo` — panaikinta (v3.18).

## Kas gyva dev'e (2026-09-04 vakaras, po S1614)
- `mu-plugins/petshop-darbalaukis.php` **v3.18** (276 421 B, md5 `348901306c34d5fbc5c3702bb35a791f`) = repo `deploy/petshop-darbalaukis.php` (+ `.php.b64`). Kopijos `ps-backups/petshop-darbalaukis-v3142/v315/v316/v317/v3171-BACKUP-2026-09-04.php`.
- `petshop-kliento-siuntos.php` **v1.2** (md5 `fb5a0c084731f57eecd2faa069f3ef3b`; v1.3 „Atšaukta“ atšaukta — Raimis: klientui nerodom; kopija `…-v13-ATSAUKTA-2026-09-04.php`) = repo `deploy/`. `petshop-dev-pastas.php` v1.0; `petshop-juosta.php` v1.5. Variklis nekeistas: desk v3.48, dropship v1.19, tiekimas v1.9.3, siuntu-laiskai v1.2, ivykiai v1.1, av-reduce, dropship-sargas v1.0.
- Cron: `ps_venipak_sekimas` kas 30 min; `ps_velavimo_laiskai` darbo dienom 14:00 (kitas 09-05 14:00); LP plugino `woo_lithuaniapost_update_tracking_status` kas val.
- **Deploy: darbalaukis b64 5 dalimis** (4×80 000 → `ps-backups/dl-vXXXX.part1…4` per `irankiai/s1614_e7a.php` šabloną + likutis payload'e; deploy šablonas `s1614_e7d.php` su md5/token/gyvo failo sargais). Deploy šablonas naujausias — `s1614_e11d.php` (darbalaukis 5 dalimis + kito failo grąžinimas iš ps-backups su md5 sargu), dalys — `s1614_e11a.php`. Testų šablonai: `s1614_e6d.php` (grįžimo simuliacijos + `admin-post` veiksmai su nonce iš sesijos + Playwright), `s1614_e4d.php` (Redaguoti POST, V14 sim), `s1614_e1d.php` (mygtukas), `e1v/e4v` (patikra naujame procese). Ilgi run'ai su Playwright — `nohup … &` + `sleep`, arba `timeout 175 ./run.sh …` curl'ui.
- Testinis klientas 5787. Testiniai užsakymai **#35414–#35444, #35450, #35771–#35772, #35774–#35780** — trinti 6 etape. Po S1614 (žr. log): #35439 su simuliuota Venipak klaida **Klausimuose**; #35438 (processing, Surinkti AV — eil. 863 `_ps_issiusta` V…052, `_ps_dalys_baigtos.av`, Prins eilutė kelias av, raudona eilutė „nepakuok“); #35421 (Prins dalis atšaukta, processing); #35431/#35434 adresai pakeisti; #35435 vėlavimo žymė; likučiai 19708 `_stock` 18, 16889 `_own_stock_qty` 1 (testiniai judesiai).

## Ką darbalaukis daro (v3.17.1, trumpai — naujoves žr. log S1614)
Eilės kaip S1612. Venipak/LP sekimas, vėlavimo laiškas 14:00, V13 — kaip S1613. **S1614 (v3.18, Raimio sprendimai):** „Pranešti klientui apie vėlavimą“ (skydelis + kortelė „[T] vėluoja“; vienas kartas); „Redaguoti“ skydelyje — adresas / Venipak ar LP paštomatas / telefonas be WC, TIK kol nėra jokio užregistruoto lipduko (po lipduko — rankiniu būdu), be laiško klientui, klaidos meta nuimama; V14 Klausimas „Siuntos sukurti nepavyko“ iš plugino meta su „Taisyti adresą“; „Siunta grįžta“ dalinis — „Siųsti iš naujo“ tik grįžusią dalį (AV — Surinkti AV; tiekėjo dalis VISADA → AV standartinė procedūra; kai AV siunta jau išsiųsta — jos eilutės „IŠSIŲSTA — NEPAKUOK“, `_ps_dalys_baigtos`, užsakymas sąraše raudonas su pill „lape bus ir jau išsiųstos prekės“) ir „Atšaukti tik grįžusią dalį“ (likutis grįžta, kita dalis lieka, statusas lieka, klientui nerodoma).

## Raimio sprendimai 09-04 vakaras — ĮGYVENDINTI (v3.18), spec §12.4 dar nerašytas
1) laiško klientui po adreso keitimo nėra; 2) po užregistruoto lipduko redaguoti negalima (rankiniu būdu); 3) atkrenta; 4) klientui atšaukta dalis nerodoma; 5) grįžusi tiekėjo dalis → AV standartinė procedūra; lape bus ir jau išsiųstos prekės (variklis) — užsakymas išskirtas raudonai (Raimis: „pažymėti, kad iškart atkreiptų dėmesį“). Tyliai galioja S1613 prielaidos (LP data, sekimo ribos, „[T] vėluoja“ Klausimuose be automatinio laiško — yra rankinis mygtukas).

## Kito lango #1 — v3.18.1 (kosmetika, prieš #4)
Sąrašo 2 stulpelyje „Iš AV“ grupė skaičiuoja ir `_ps_issiusta` / `_ps_atsaukta` eilutes (#35438 rodo „2 vnt. … +1“, o pakuoti reikia 1) — jas iš 2 stulpelio išimti; pill ir skydelis jau rodo teisingai. Kartu — **spec §12.4** pilnu failu (S1614 sprendimai 1–5 + K4 „ankstesnė AV siunta“ modelis).

## 5 ETAPAS toliau (eilė — Raimis 09-04) — spec §7/§12
Toliau: kiekiai, dalinis atšaukimas/grąžinimas kitais atvejais (ne „grįžta“), Sąskaita (AVPN/IAPV), „Kaip mato klientas“ (svečiui), „Naujas užsakymas“ (telefoninis), „Atsiėmimas AV“ (`local_pickup`), paskyros UI lokalizacija. Kiekvienam — spec/registras pirma, recon, Raimio sprendimai, tik tada kodas.

## 6 ETAPAS
E2E, testinių valymas (S1267 pamoka: kaskados nėra; Venipak V07267E1000030–057 ir manifestai — Raimis savitarnoje; likučiai 19708/16889 testiniai), tikra darbuotojo paskyra vietoj `testuotojas`.

## Atviri / atidėti
J1 pirma reali LP siunta · LP „Redaguoti“ kelias gyvai · Venipak paštomato pakeitimas gyvai · Venipak kodai 4/5/7/8 · V12, V13 (variklis), V14 (variklis; darbalaukio lygiu padaryta) · seno desk `siuntos_kodas()` LP raktai · T10/V1 · dovanėlės, kasos sakinys (vėliau) · T-0: mail-tester per WC SMTP, DMARC → quarantine po mėnesio, LP plugino slaptažodžio rotacija.

## Bridge
Repo `raimis079-creator/petshop-bridge`. `irankiai/run.sh <file> <phases> analize/<out>.json <get_key> <browser 0|1>` (kopijuoti į `/home/claude/ps/` su `irankiai/mjs_template.mjs`, `irankiai/ghput.sh`). Rezultatai — iš repo per naujausią commit SHA (`?ref=SHA`). Playwright ~150–300 s, curl ~60–120 s. Prieš kiekvieną run'ą — `DELETE snippets WHERE name LIKE 'TEMP%' AND active=0`. Vietinis `php -l` — `apt-get update && apt-get install -y php-cli` prieš pirmą run'ą; JS bloką tikrinti `node -e "new Function(...)"`. Commit'ui — `ghput.sh <local> <repo_path> <msg>`. Log — `dokumentai/deployment_log_v1_9_19.md`; STARTAS — `dokumentai/STARTAS_2026-09-05_5_etapas_po_S1614.md` (šis, atnaujintas po v3.18).
