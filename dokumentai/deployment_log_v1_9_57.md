# deployment_log v1_9_57 — S1669 (2026-09-10) — feed'ų kanalai, lankomumo ekranas, 404 po migracijos

## Pakeitimai GYVAI (visi su backup, visi patikrinti)

| # | Kas | Failas / vieta | md5 po | Backup |
|---|---|---|---|---|
| 1 | Kaina24/Kainos.lt prekių nuorodos su `?utm_source=kaina24` / `kainos` (product_url + purchase_url); regeneruota 19:05, 2193/2193 su utm; google.xml nekeistas | `plugins/petshop-feeds/petshop-feeds.php` v2.3.0 | 5eaad2aeda54a42710b81e2b220f7b58 | `uploads/ps-backups/petshop-feeds.php.bak_s1669` |
| 2 | Google Ads `gad_campaignid` → `utm_campaign` (tik skaitmenys, jei UTM kampanijos nėra); testai 5/5 | `mu-plugins/petshop-kanalai.php` v1.2 | 7830f9c8abeab74700cf56f4eeeca760 | `uploads/ps-backups/petshop-kanalai.php.bak_s1669` |
| 3 | NAUJAS ekranas „Lankomumas" (`admin.php?page=ps-lankomumas`): KPI, dienos/valandos/savaitės d., piltuvėlis, šaltiniai, įrenginiai, įėjimai, paieškos, 404. Šaltinis `ps_web_ivykiai` (lankytojas_d) + `ps_fakt_uzsakymai` | `mu-plugins/petshop-ataskaita-lankomumas.php` v1.0 | 2fe886fb38859e4358c4e5889ef8f749 | naujas failas (rollback = ištrinti) |
| 4 | Legacy-301 +93 tų pačių prekių (normalizuotas slug = lygiai 1 publish prekė) | `mu-plugins/petshop-legacy-301-map.json` 1091→1184 | 930c64d9d41a9bf7e31e823ea7956a18 | `…map.json.bak_s1669` |
| 5 | Legacy-301 +9 struktūriniai (visos-prekes, paieska→/parduotuve/; contact, parduotuves-kontaktai→/kontaktai/; akcijiniai-pasiulymai→/akcijos/; prisijungimas→/paskyra/; privatumo-politika-2; jautrus-virskinimas, sterilizuotas-augintinis→/sprendimai/…) | map 1184→1193 | d5fd50d616b8c7b495e69f81c283b995 | `…map.json.bak_s1669b` |
| 6 | Pagrindinis puslapis (ID 34543): 3 nuorodos `/jautrus-virskinimas/`, `/sterilizuotas-augintinis/` → `/sprendimai/…` (buvo 404) | post_content | — | option `ps_s1669_home_backup` |
| 7 | Legacy-301 +29 DVIGUBA patikra (pavadinimo tapatybė + `_legacy_seo_title`/`_legacy_product_id`/`_wp_old_slug`); 3 atmesti (dydis pasikeitė / 2 kandidatai) | map 1193→1222 | 1097cdc2ec4e7581c0b9b32adb6c682c | `…map.json.bak_s1669c` |

Visi 131 nauji peradresavimai patikrinti: 301 → 200, užklausos eilutė (utm/gclid) išlieka.

## Raimio veiksmai
- Flatsome perregistruota kaip PUBLIC petshop.lt (20:43). Atnaujinimas 3.20.7→3.20.9 — „vėliau".
- Kainos.lt ir Kaina24 siunčiami nauji feed URL (`/feed/kainos/`, `/feed/kaina24/`) — senų eShoprent URL neperadresuojam (Raimio sprendimas).

## Diagnozės (read-only)
- Venipak #35872/#1002: pats įdėjo į paštomatą → kodas 5 „laukia kurjerio", ne VENIPAK_PAEME sąraše; cron veikia. Raimis: nieko nekeisti, laukti automatinio kelio.
- GA4 realiu laiku nerodo ~83 % lankytojų (be sutikimo); serverio MP purchase eina visiems; Ads nemato pirkimų be sutikimo.
- VF dropship #1000/#1001 laiškas išėjo 12:47:57 (pastaba = sėkmingas wp_mail). 12:55 kitas laiškas be gavėjo (WP Mail SMTP debug) — neišaiškinta.
- Sargai: Rytas 12 žalių; cron nevėluoja; fatal po T-0: 3 vienkartiniai (TEMP snippet, welcome modal rollback, WP All Import 256 MB 09-09 06:32).
- Feed'ai: `ps_feeds_generuoti` tik instock; 420 outofstock nerodoma; 70 prekių feed'e su stock 0 (instock statusas).
- 404 auditas (547 keliai nuo T-0): Google Ads kampanijos 21472043669 ir 21565466377 veda į senus URL → Merchant Center tebenaudoja seną feed'ą.
- AI srautas: 8 lankytojai iš chatgpt.com, 6 įėjo į prekės puslapį.

## Įrankiai (repo)
`deploy/petshop-feeds-v2.3.0.php`, `deploy/petshop-kanalai-v1.2.php`, `deploy/petshop-ataskaita-lankomumas-v1.0.php`, `deploy/legacy-301-map-papildymas-s1669.json`, `deploy/legacy-301-map-papildymas-s1669-dviguba.json`.
