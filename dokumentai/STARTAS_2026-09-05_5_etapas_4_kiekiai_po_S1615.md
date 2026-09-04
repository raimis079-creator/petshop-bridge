# STARTAS — 2026-09-05 — UŽSAKYMŲ LANGAS, 5 ETAPAS: #1–#3 ĮGYVENDINTI (v3.18.1, spec §12.4), #4 „KIEKIAI“ — RECON PADARYTAS, LAUKIA RAIMIO SPRENDIMŲ (S1615)

> Naujam pokalbio langui. Perskaityti PIRMA, prieš bet kokį veiksmą: šį failą → `dokumentai/deployment_log_v1_9_20.md` (S1615 viršuje — v3.18.1 faktai ir **#4 recon + dizaino klausimas A/B**; S1614 — Raimio sprendimai 09-04 vakaras) → `dokumentai/UZSAKYMU_DARBALAUKIS_SPEC_v1.md` **v1.5** (§6c, §12, §12.3, §12.4, **§12.5** — grįžusi siunta, pinigai, kreditinė, sąskaitos, #4 B modelis) → `dokumentai/ZODYNAS_DARBUOTOJUI_v1.md` v1.1 → `dokumentai/UZSAKYMU_LOGIKOS_REGISTRAS_v1.md` (variklio taisyklės A–J, neliesti).

## Raimio taisyklės (pažeidimas = kritinė klaida)
- Nieko iš atminties — pirma REGISTRAS / log / spec. Pilni failai. Vizuali patikra (Playwright / loopback HTML, ne dry-run). Dev duomenys = norma. Fiksuotų datų nėra. Terse. TEMP snippet'ai trinami kiekvieno run'o pradžioje.
- **Viena sistema** — darbuotojas iš naujo lango neišeina; WC darbuotojui niekur; senas desk tik variklis (`senas=1` — tik Raimiui, LP lipdukams).
- **Darbuotojo dienoraštis** prieš „padaryta“. **Mažiau, ne daugiau**: naujas ekrano elementas — klausti, ką jis nuima. Žodynas — tik iš ZODYNAS v1.1.
- **Lipdukai privalomi**: siunta klientui — tik su registruotu numeriu. Testams: `_ps_siuntos` registrą rašyti tiesiogiai payload'e (fiktyvus numeris), Venipak API nekviesti; LP — meta tiesiogiai. Vežėjo klaidos ir „grįžta“ — simuliuoti meta.
- **Laiškai testuose:** `pre_wp_mail` gaudyklė prior. 4 tame pačiame procese; per admin-post išeinančius laiškus gaudo `petshop-dev-pastas.php` v1.0 (žurnalas `ps_dev_pastas_zurnalas`, skaityti NAUJAME procese).
- Nepridėti fantazijos: sprendimai — Raimio (spec §1, §6c, §12, §12.3, §12.4); jei nėra — klausti, ne spėti. Bridge PAT — prašyti pradžioje („prisijunk taupant tokenus“ + PAT → `/tmp/.ghtok`).
- Variklio neliesti: `Petshop_Desk`, `Petshop_Siuntos`, `petshop-av-reduce.php`, `petshop-av-sheets.php`, `petshop-av-dropship.php`, `petshop-dropship-sargas.php`, `petshop-av-tiekimas.php`, `petshop-partijos.php`, `petshop-faktai.php` / `petshop-fakt-*.php` (faktai nekeičiami), tema `flatsome-child/functions.php` (sąskaitos AVPN/IAPV, laiškai). Darbalaukio žymės — spec §12.4 „K4 modelis“.

## Kas gyva dev'e (2026-09-04 vėlus vakaras, po S1615)
- `mu-plugins/petshop-darbalaukis.php` **v3.18.1** (277 163 B, md5 `43fe4d99b1f093816f39413ad033626c`) = repo `deploy/petshop-darbalaukis.php` (+ `.php.b64`). Kopijos `ps-backups/petshop-darbalaukis-v3142/v315/v316/v317/v3171/v318-BACKUP-2026-09-04.php`.
- `petshop-kliento-siuntos.php` **v1.2** (md5 `fb5a0c0847…`) = repo `deploy/`. `petshop-dev-pastas.php` v1.0; `petshop-juosta.php` v1.5. Variklis nekeistas: desk v3.48, dropship v1.19, tiekimas v1.9.3, siuntu-laiskai v1.2, ivykiai v1.1, av-reduce v1.1, partijos v1.2, faktai v1.3, dropship-sargas v1.0.
- Cron: `ps_venipak_sekimas` kas 30 min; `ps_velavimo_laiskai` darbo dienom 14:00; LP `woo_lithuaniapost_update_tracking_status` kas val.
- **Deploy: darbalaukis b64 5 dalimis** (`s1615_e1a…e1d.php` šablonai — po 80 000 į `ps-backups/dl-vXXXX.partN`, kiekvienos dalies md5; `s1615_e1e.php` — deploy su dalių md5 + bendru md5 + `token_get_all` + gyvo failo md5 sargu, likutis payload'e, T naujame procese su loopback HTML kaip `testuotojas` + Playwright shots). Recon šablonai: `s1615_e2r…e5r.php`. Ilgi run'ai — `nohup … &` + `sleep`.
- Testinis klientas 5787. Testiniai užsakymai **#35414–#35444, #35450, #35771–#35772, #35774–#35780** — trinti 6 etape. Būsenos kaip po S1614 (žr. log): #35438 processing (eil. 863 `_ps_issiusta` V…052, `_ps_dalys_baigtos.av`, Prins eilutė kelias av, raudona eilutė „nepakuok“); #35421 (Prins dalis atšaukta); #35439 sim Venipak klaida Klausimuose; likučiai 19708 `_stock` 18, 16889 `_own_stock_qty` 1.

## Kito lango eilė (visi Raimio sprendimai jau spec §12.5 — klausimų nebėra, tik kodas)
1) #4 kiekiai (B modelis, spec §12.5 paskutinis blokas; recon log S1615) → 2) „Siunta grįžta“ kortelės sumos (X − 3,99 / įkainis + 3,99) + „Pakartotinis pristatymas“ = naujas mažas užsakymas su apmokėjimo nuoroda, „Siųsti iš naujo“ tik apmokėjus → 3) kreditinė pusiau automatinė (PIRMA recon: ką spausdina WCDN *creditnote* + `base.php`; KR-AVPN numeracija vizualiai) → 4) „Sąskaita“ langas (sąrašas/filtrai/atsisiuntimas) → Pragma eksportas su kreditinėmis (variklio pluginas — klausti). Kiekvienam žingsniui: darbuotojo dienoraštis, testai su fiktyviu refund'u / fiktyviu apmokėjimu (Paysera nekviesti), 0/0/0.

## (istorija) spec §12.5 „Grįžusi neatsiimta siunta“ (Raimio sprendimai 09-04 naktis, log S1615 pabaiga) + kortelės sumos
Sprendimai: grąžinimo išlaidos **3,99 Eur su PVM visada**; pakartotinis siuntimas — standartiniai įkainiai be nemokamo pristatymo (+3,99); atšaukiant grąžinama sumokėta suma − 3,99; taisyklių puslapiai 34524 (6.10–6.11) / 14894 / 34523 **jau papildyti** (kopijos `ps-backups/puslapis-*-2026-09-04.html`; 6.11 „per 14 d. nesusitarus“ — Claude prielaida, Raimiui vetuoti). Darbalaukyje: „Siunta grįžta“ kortelėje rodyti „Klientui grąžink: X − 3,99 = Y €“ ir „Pakartotinis pristatymas: įkainis + 3,99 €“ (konstantos); pakartotinis pristatymas = naujas užsakymas („Naujas užsakymas“ punktas) — Raimio dar nepatvirtinta. Kreditinė — rankomis, sistema tik rodo sumą.

## Kito lango #1 — 5 ETAPO #4 „KIEKIAI“: Raimio sprendimai → kodas
Recon baigtas (log S1615, nieko iš atminties — perskaityti). Reikia trijų sprendimų:
1. **Modelis A ar B** (log S1615 „DIZAINO KLAUSIMAS“). Rekomendacija — **B „keisti eilutę“ + WC refund pirma** (varikliai spausdina teisingus kiekius patys; faktas `ps_fakt_grazinimai` rašosi iš refund'o; pinigai rankomis, Paysera refund API nėra). A reikalautų liesti av-sheets / av-dropship / av-tiekimas / siuntu-laiskai.
2. **Sąskaita:** completed laiškas regeneruoja PVM sąskaitą tuo pačiu AVPN su nauja suma (tema, snippet #653), o klientas PDF su senu AVPN jau gavo checkout'e — ar tinka, ar reikia kreditinės („Sąskaita“ 5 etapo punktas)? Iki tol siūlau Klausimą „sąskaita AVPNxxx perrašytina / grąžinti X € rankomis (Paysera)“, kol darbuotojas nepažymi.
3. **Apimtis:** tik mažinti kiekį / išimti prekę (išimti viską = esamas „Atšaukti“); „pridėti prekę“ (suma didėja, §11.3) — atskirai, vėliau. Riba: kaip `redagavimas()` — jokio lipduko, jokio tiekėjo laiško, Tiekimo partija ne užsakyta; po to rankiniu būdu. Laiško klientui nėra.
Po sprendimų: skydelio eilutėje kiekio laukas / „Išimti“ (klausti, ką nuima — „mažiau, ne daugiau“), `admin_post_ps_dl_kiekis`, pastaba prieš/po, įvykis `kiekis`, testai su fiktyviu refund'u (`refund_payment=false`), WC dalinio grąžinimo laiškas klientui išjungtas (`laiskai_off`), 0/0/0 patikra.

## 5 ETAPAS toliau (eilė — Raimis 09-04) — spec §7/§12/§12.4
Po #4: dalinis atšaukimas/grąžinimas kitais atvejais (ne „grįžta“) — tas pats modelis; Sąskaita (AVPN/IAPV, kreditinė — tema `functions.php`, skaitikliai T-0 → 101); „Kaip mato klientas“ (svečiui); „Naujas užsakymas“ (telefoninis); „Atsiėmimas AV“ (`local_pickup`); paskyros UI lokalizacija. Kiekvienam — spec/registras pirma, recon, Raimio sprendimai, tik tada kodas.

## 6 ETAPAS
E2E, testinių valymas (S1267 pamoka: kaskados nėra; Venipak V07267E1000030–057 ir manifestai — Raimis savitarnoje; likučiai 19708/16889 testiniai), tikra darbuotojo paskyra vietoj `testuotojas`.

## Atviri / atidėti
J1 pirma reali LP siunta · LP „Redaguoti“ kelias gyvai · Venipak paštomato pakeitimas gyvai · Venipak kodai 4/5/7/8 · V12, V13 (variklis), V14 (variklis; darbalaukio lygiu padaryta) · seno desk `siuntos_kodas()` LP raktai · T10/V1 · dovanėlės, kasos sakinys (vėliau) · §11.3 skirtumo apmokėjimas · T-0: mail-tester per WC SMTP, DMARC → quarantine po mėnesio, LP plugino slaptažodžio rotacija, AVPN/IAPV skaitikliai → 101.

## Bridge
Repo `raimis079-creator/petshop-bridge`. `irankiai/run.sh <file> <phases> analize/<out>.json <get_key> <browser 0|1>` (kopijuoti į `/home/claude/ps/` su `irankiai/mjs_template.mjs`, `irankiai/ghput.sh`). Rezultatai — iš repo per naujausią commit SHA (`?ref=SHA`). Playwright ~150–300 s, curl ~60–120 s. Prieš kiekvieną run'ą — `DELETE snippets WHERE name LIKE 'TEMP%' AND active=0`. Vietinis `php -l` — `apt-get update && apt-get install -y php-cli` prieš pirmą run'ą (fone, ~40 s); JS bloką tikrinti `node -e "new Function(...)"`. Commit'ui — `ghput.sh <local> <repo_path> <msg>`. Log — `dokumentai/deployment_log_v1_9_20.md`; STARTAS — `dokumentai/STARTAS_2026-09-05_5_etapas_4_kiekiai_po_S1615.md` (šis).
