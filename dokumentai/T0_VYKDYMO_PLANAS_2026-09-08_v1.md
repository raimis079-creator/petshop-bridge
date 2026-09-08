# T-0 VYKDYMO PLANAS — naktis 09-08 → 09-09 (v1, po S1642)

> Kas kieno, punktais. Bazė: DOD-18 §3–5 + T0_PLANAS v1.3 + S1642 deltos (STARTAS_2026-09-08_po_S1642.md, log v1_9_49). Naujam langui: šis + STARTAS + log.

## PRIEŠ (T-1, vakaras iki ~23:00)

**RAIMIS:**
1. Švieži eShoprent eksportai (Products + Options) — atsiųsti.
2. Tiekėjų Excel (`tiekeju_prekiu_fiziniai_likuciai_S1632.xlsx`) — jei pildytas, atsiųsti; jei ne — praleidžiam.
3. DirectAdmin prisijungimas VEIKIA, DNS ekranas atsidaro, abu A įrašai matomi, TTL=300.
4. WP admin veikia; Paysera 29276 langas atidarytas.
5. RANKINĖ pilna kopija (nelaukti 04:00).
6. 6 sprendimai iš anksto: eShoprent stabdymo būdas · local_pickup #16 · welcome modal · Pragma prod · pirmas realus užsakymas (trinti/palikti) · tiekėjų Excel (yra/praleidžiam).
7. Telefonas, kava.

**CLAUDE (gavus eksportus):**
1. Būklės skaičiai (publish/draft, užsakymai, vartotojai, `_stock` Σ, partijos).
2. Parduotų DELTA (`s1637_n2.php` K logika) — dry-run → OK → apply.
3. Likučių dry-run (`s1631_d.php`) → parodyti → laukti OK.

## PER (naktis ~0:30–1:00)

**RAIMIS-1:** eShoprent užsakymų priėmimo stabdymas.

**CLAUDE-1 (bridge, žingsnis→patikra):**
1. VALYMAS TIK naujų testinių: #35834 kuponas, #35840–56 rinkiniai, #35790/96 paslaugos + TEMP/bak. **#3966–4010 partijos GYVOS — neliesti.** Pilno valymo nekartoti.
2. LIKUČIŲ KĖLIMAS: `s1632_a.php` C,P0–P6 (jei delta) → tiekėjų Excel (jei yra) → `s1632_v.php` (Σ, kadrai).
3. Serijos → visos 101 (dabartiniai: AVPN 365 · KR 107 · IAPV 172; prieš rašant — counter semantika: kitas ar paskutinis).
4. DB `siteurl`+`home` → `https://petshop.lt` (BŪTINAI https). Options „dev.avesa.lt" paieška → 0.
5. Paysera `test_mode` → `no`.
6. „Discourage search engines" OFF; `force_ssl_checkout` → yes.
7. Dev veidrodžio trynimas: dev-router.php · dev/.htaccess · wp-config blokas · petshop-dev-veidrodis.php · stub'ai · perkelti-r186.php · **dev-pastas v1.2 IŠJUNGTI** (kitaip klientų laiškai neišeis).
8. Welcome modal / Pragma / local_pickup — pagal T-1 sprendimus.
9. wp-super-cache flush + konfige dev.avesa.lt patikra.

**RAIMIS-2 (iškart, tarpas trumpiausias):**
1. DirectAdmin DNS: A `.16` → `79.98.29.24`; A `.15` → PAŠALINTI. www CNAME/MX/SPF/TXT NELIESTI.
2. Po 5–10 min petshop.lt rodo `79.98.29.24`; jei ne po 15 min — ar išsaugota.
3. Let's Encrypt (5–10 min).
4. 6 cron URL serveriai.lt panelėje → `https://petshop.lt/wp-load.php` (import_key/id nekeisti) + backup-run.php, watch-run.php.

**ABU-3 pirmoji patikra:**
- CLAUDE Playwright: atsidaro, SSL, titulinis NAUJAS, CSS/img, /wp-json/ (403 → ?rest_route=), robots.txt, kadrai.
- RAIMIS: WP admin per petshop.lt/wp-admin.

**RAIMIS-4 SVARBIAUSIA (DOD-18 4.4):**
1. Prekė → krepšelis → apmokėjimas.
2. REALUS €2,21 Paysera. `processing` AUTOMATIŠKAI, laiškai (Tau+klientui), likutis nurašytas.
3. Nepavykus pirkimui — atsitraukimas nedelsiant (DOD-19: A atgal, 5 min). Jei tik Paysera, o bacs/COD veikia — Raimio sprendimas: liekam, Paysera ryte.
4. Užsakymas trinti/palikti — pagal T-1 sprendimą.

**CLAUDE-4:** Kaina24 + Kainos.lt feed URL; galutinė sargų/log patikra.

**RAIMIS-5:** Flatsome licencija → petshop.lt + soc. nuorodos.

**ABU-6 (nebūtina):** 04:00 backup state OK, ZB/VF importai, sargas be fatal.

## PO (TR rytas)

**RAIMIS:**
1. petshop.lt iš telefono (kitas tinklas).
2. Sender.net webhook → petshop.lt (403 → ?rest_route=).
3. GSC + Google Ads Brand ON.
4. Pirma REALI Venipak/LP siunta (J1!) — kartu.
5. eShoprent NEIŠJUNGTI iki patvirtinto pirkimo kelio.
6. Po paros: TTL 300→3600.

**CLAUDE (naujame lange):**
1. Paysera callback — pirmas tikras `processing` automatiškai.
2. Laiškai realiai išeina (SMTP debug + mail-tester, from uzsakymai@).
3. `s1634_g.php`: Warning 0, eilės, cron'ai, 404/301.
4. Titulinio 9 img akių patikra; `ps_sender_webhook_log` pildosi.

## NAKTĮ NEDARYTI
Klientų el. paštų kėlimo · kategorijų mapinimo · kainų kėlimo · naujo kodo · taisymų, nekliudančių pirkti.

## ATSITRAUKIMAS
DOD-19: A → 213.226.161.16 + .15 (veikia kol eShoprent gyva), laukti TTL 300, siteurl/home atgal į dev.avesa.lt.
