# petshop.lt — „nematomos pusės" (admin / serverio / duomenų) auditas · 2026-09-25 (S1719)

**Metodas:** 5 read-only bridge paleidimai (`ps-bridge/s1719/a–e.php`, rezultatai `analize/s1719_*.json`): DB (WC HPOS, postmeta, `ps_*` lentelės), failų sistema, PHP/opcache/MariaDB būklė, `php_error.log` (7 d.), WC žurnalai, **Apache access log 09-24 (127 406 užklausų)**, 60 viešų URL patikra iš serverio, WC system status. **Gyvai nieko nekeista.** Ankstesnis auditas (S1689s, 09-17) dengė greitį/SEO iš išorės — čia to nekartoju.

## Santrauka

| Sritis | | Vienu sakiniu |
|---|---|---|
| PVM sąskaitų numeracija | 🔴 | AVPN011105 išrašytas **5 užsakymams**, AVPN011134 — 2; dvi spragos |
| Viešai pasiekiami duomenys | 🔴 | Tiekėjų feed'ai su savikaina ir siuntų lipdukai su klientų adresais atsidaro be prisijungimo |
| Atsarginės kopijos | 🟢 | Kasdien 04:00 į Backblaze B2 (šifruota, DB + mu-plugins/core/child), 09-25 OK; nekopijuojama `uploads/` ir `plugins/` |
| Botų apkrova | 🔴 | 9 725 `?add-to-cart=` ir 56 081 filtrų užklausos per parą — ≥ 2/3 serverio darbo tenka botams |
| PHP našumas | 🔴 | opcache 32 MB, pilnas: hit rate 16 %, 1,1 mln. perkompiliavimų per valandą |
| Klaidos | 🟠 | 500 kasdien (~10/d) kelių kategorijų filtro deriniuose; 44 per 09-24 |
| Saugumas | 🟠 | Pagrindai tvarkingi; GitHub tokenas aktyviame snippete, nėra 2FA, sena testuotojo paskyra, WP 6.9.4 vs 7.1.2, 6 pluginų atnaujinimai |
| Likučių knygos | 🟡 | Partijos ≠ AV 119 prekių; 76 AV prekės be `manage_stock`; sargas 5323 kelia klaidingus įspėjimus |
| Cron / eilės / laiškai | 🟢 | 89 cron įvykių — 0 vėluoja; Action Scheduler 0 vėluoja; laiškų eilė be klaidų |
| WC konfigūracija | 🟢 | PVM, vartai, zonos, puslapiai, HPOS — tvarkinga; smulkmenos 6 sk. |

## 1. 🔴 PVM sąskaitų numeracija (buhalterija)

Faktas iš `_petshop_avpn_number`: 142 įrašai, numeriai 11000–11138, skaitiklis 11139.

| Numeris | Užsakymai (vidinis ID · Nr. · data) |
|---|---|
| **AVPN011105 ×5** | 36020 · #1102 · 09-18 (13,66 €) · **turi ir AVPN011107** ; 36112 · #1136 · 09-21 (60,35 €); 36118 · #1141 · 09-21 (44,15 €); 36141 · #1143 · 09-22 (137,90 €); 36144 · #1145 · 09-22 (18,37 €) |
| **AVPN011134 ×2** | 36279 · #1166 · 09-23 (50,26 €); 36281 · #1168 · 09-24 (33,94 €) |
| Spragos | 011016 (tarp #1015 ir #1017, 09-11), 011108 (tarp #1102 ir #1139) |

Priežastis (tikėtina, kodo neskaičiau): `petshop_get_avpn_number` (functions.php ~238, S1662 „lazy" priskyrimas) neatominis — skaitiklis nuskaitomas ir įrašomas dviem žingsniais, o `completed` / PDF generavimas gali vykti lygiagrečiai (cron + darbalaukis + laiškas). #1102 su dviem numeriais rodo, kad tas pats užsakymas numerį gavo du kartus.

**Ką daryti:** (1) Raimis → buhalterė: kaip taisyti 6 jau išsiųstas sąskaitas (kreditinė + nauja, ar anuliavimas). (2) Claude: numerį imti per vieną atominį SQL (`UPDATE … SET option_value = LAST_INSERT_ID(option_value+1)`) + užraktas, `_petshop_avpn_number` rašyti tik jei tuščias; kasdienis sargas „dublikatai/spragos" į Ryto sargą. (3) `wcdn` pluginas lygiagrečiai rašo savo `_wcdn_invoice_number` = „AVPN1184" (užsakymo Nr.) — 156 įrašai; S1662 atviras klausimas; patikrinti, kad joks laiškas/PDF šio lauko nerodo.

## 2. 🔴 Viešai pasiekiami failai (patikrinta HTTP iš serverio)

| URL | Būsena | Kas viduje |
|---|---|---|
| `/wp-content/uploads/petshop-vf-cache.xml` (8 MB) | **200** | VF B2B feed: SKU, EAN, likučiai, `base_price` (jūsų pirkimo kainos) |
| `/wp-content/uploads/wpallimport/files/vf-feed.xml`, `goods_clean.xml` | **200** | tas pats VF + ZB prekių feed |
| `/wp-content/uploads/vetfarmas_response_20260602_142756.xml` (8,5 MB) | **200** | senas VF API atsakymas |
| `/wp-content/uploads/ps-lipdukai/lipdukas-V07267E1000043.pdf`, `ps-lipdukai/lp/LP-1160-HC039608415LT.pdf` | **200** | Venipak/LP lipdukai su kliento vardu, adresu, telefonu; vardai **nuspėjami** (V07267E10000NN eilės tvarka) → BDAR incidento rizika |
| `/wp-content/uploads/ps-backups/*.json.bak_*`, `google.xml.bak_*` | 200 | nejautru (301 žemėlapis, viešas feed) — bet rodo, kad apsaugotas tik `.php` šablonas, ne aplankas |
| `/wp-content/uploads/cmp_result.json`, `*_result.json` (16 vnt., liepa) | 200 | seni diagnostikos likučiai |
| `/wp-content/petshop-private-logs/attr-engine.log` | 200 | žurnalas (nejautrus) |
| `/wp-content/phptest.php` („PHP veikia!"), `/index.html.backup.5a6d…` | 200 | šiukšlės nuo diegimo |
| `dev.avesa.lt/kategorija/sunims/`, `dev.avesa.lt/wp-login.php` | **200** | visa parduotuvė atsidaro dev vardu (pradinis 301 → petshop.lt, gilesni — ne); bridge eina per dev.avesa.lt |

Tvarkinga: `wp-config.php` 0600 + `.htaccess` deny; `ps-backups/*.php*` 403; `mu-plugins/`, `wc-logs/`, `woocommerce_uploads/`, `ps_private/` 403; `xmlrpc` 403; `/wp/v2/users` 401; `?author=1` 404; registracija išjungta; `readme.html`/`license.txt` 404; `debug.log` nėra; TLS grandinė pilna (3 sert.), galioja iki 2026-12-07; SPF/DKIM 10/10.

**Ką daryti:** `uploads/.htaccess` — `ps-lipdukai/`, `wpallimport/`, `*.xml` prie šaknies → `Require all denied` (lipdukus atiduoti tik per darbalaukio veiksmą su teisių patikra — `lp_pdf` jau taip veikia); `petshop-vf-cache.xml` perkelti į `ps-archyvas/` ar `uploads/ps_private_feed/` su deny (fetcher'is ir WPAI skaito iš disko, ne per HTTP — patikrinti `petshop-xml-vf-fetcher.php` kelią); uploads'e uždrausti `.php` vykdymą (`FilesMatch \.php$ → deny`; `wpallimport/functions.php` įkeliamas iš disko, HTTP jam nereikia); ištrinti `phptest.php`, `index.html.backup…`, `uploads/*_result.json`, `vetfarmas_response_*.xml`; `dev.avesa.lt` — GitHub Actions `WP_URL` → `https://petshop.lt`, po to dev vhost'e 301 viskam arba `X-Robots-Tag: noindex` + auth.

## 3. 🟢 Atsarginės kopijos — YRA, išoriniame serveryje (patikslinta 17:45)

Pirminė išvada „nerasta" buvo klaidinga — kopijos serveryje nelaikomos, jos keliauja į **Backblaze B2** (EU Central, Amsterdamas, bucket `petshop-backups`, Object Lock 14 d., Lifecycle 30 d.; REGISTRAS §8c–8h, 2026-08-03/04).

| | Faktas (iš `~/backups/.ps-backup-state.json` / `.ps-watch-state.json`) |
|---|---|
| Skriptas | `~/backups/ps-backup.php` v1.1 (0700), paleidžia DirectAdmin cron `0 4 * * *` per `backup-run.php?ps_backup_key=…` (URL per dev.avesa.lt — todėl dev vhost'o negalima naikinti neperkėlus cron'o) |
| Paskutinis paleidimas | **2026-09-25 01:00 UTC (04:00 LT) — OK**, 20,6 s |
| Turinys | DB 232 lentelės / 1 145 634 eil. + 592 kodo failai (mu-plugins, petshop-core, flatsome-child) + manifest → tar.gz → AES-256 + HMAC → B2, SHA-1 patvirtintas; 51,6 MB (`petshop-backups/2026/09/petshop-2026-09-25_010001.tar.gz.enc`) |
| Sargas | `ps-backup-watch.php` kas dieną 10:00 — 09-25 07:00 UTC verdiktas OK, amžius 6 val.; praneša laišku tik kai negerai (>26 val. arba <5 MB) |
| Atstatymo testas | 2026-08-04 praėjo (174/174 lentelės, 0 skirtumų) — **dar prieš T-0**, su tuometine DB |

**Spragos (ne kritinės, bet žinotinos):**
- **Nekopijuojama:** `uploads/` (nuotraukos ~171 tūkst. failų, feed'ai), `wp-content/plugins/` (WPAI Pro, Venipak/LP, Paysera, petshop-feeds/xml/core dalis?), `wp-config.php`, `.htaccess`, Flatsome tėvinė tema. Kodas atsistatytų iš repo/atsiuntus pluginus, bet **nuotraukos — tik iš serveriai.lt serverio kopijų** (jų garantijos nėra — jų pačių formuluotė 08-03). Siūlau: mėnesinį `uploads/` archyvą į B2 (~2–4 GB) arba bent `uploads/2026/` + `wp-config.php`/`.htaccess` į kasdienį.
- Atstatymo testą pakartoti po T-0 (DB 3× didesnė, 232 lentelės, HPOS) — Raimis kuria tuščią DB DirectAdmin'e, Claude atstato ir sutikrina su manifestu.
- Šifravimo rakto antra kopija — pas Raimį (patvirtinta 08-04); patikrinti, kad ji tebėra pasiekiama ne serveryje.
- Installatron `application_backups` kopijuoja tik sushimo.lt (34 GB vietos) — petshop'ui nereikalinga, bet sushimo kopijas galima retinti.

## 4. 🔴 Botų apkrova (access log 2026-09-24 04:55–00:10, 127 406 užkl.)

| Rodiklis | Reikšmė |
|---|---|
| `?add-to-cart=` GET užklausos | **9 725/d** — 9 709 iš vieno UA („Windows NT 10.0 … Chrome"), šimtai IP po 10–27 (Tencent 43.x/101.47/150.109/163.7, Alibaba 47.x/8.216) |
| Užklausos su `yith_wcan=`/`filter_` | **56 081/d (44 %)**, `/parduotuve/` 22 157/d — „Mac Chrome" UA, 62 854 užkl. |
| Pasekmės DB | `woocommerce_sessions` 7 551 naujų/d (67 MB), `ps_carts` 12 300 per 2 d. (16 su el. paštu), 9 046 svečių sesijos per 24 val., iš jų 8 002 su „krepšeliu" |
| `wp-cron.php` | 6 186/d (kas 14 s — spawn'inasi iš kiekvieno puslapio, `DISABLE_WP_CRON` nenustatytas) |
| 500 | 66/d (žr. 5 sk.) |
| Tikrų lankytojų (JS, `ps_web_ivykiai`) | ~1 000 pageview/d |

Svetainės `robots.txt` šiuos kelius draudžia — botai nepaiso. Kiekvienas botų `add-to-cart` sukuria WC sesiją, `ps_carts` eilutę, `petshop_gtm_atc_queue` (snippet 614), uždeda `woocommerce_items_in_cart` slapuką → tolesni jo puslapiai eina **pro kešą** → PHP + DB. Tai ir yra „serveris lėtas" priežastis nr. 1 kartu su opcache (5 sk.). Papildomai iškraipo Analitikos/GA4 „krepšelių" skaičius (server-side GA4 mato add_to_cart).

**Ką daryti:** (1) mu-plugin **JS slapuko sargas**: GET `?add-to-cart=` vykdomas tik jei yra slapukas, kurį uždeda svetainės JS (tikri naršytojai jį turi; `/kasa/?add-to-cart=` iš laiškų — baltasis sąrašas); be slapuko — 302 į prekę, be sesijos. (2) `yith_wcan=`/`filter_` be slapuko — atiduoti tik `Cache-Control: no-store` 200 su minimaliu HTML? Geriau (3) **Cloudflare Free** priešais svetainę: Bot Fight Mode + 2 WAF taisyklės (query turi `add-to-cart|yith_wcan|filter_` ir nėra JS slapuko → Managed Challenge), statika iš CDN — sprendžia ir 5 sk. TTFB dalį. Rizika: DNS NS perkėlimas (DKIM/SPF/MX įrašus perkelti 1:1). (4) `DISABLE_WP_CRON=true` + DirectAdmin cron kas minutę `wp-cron.php?doing_wp_cron`. (5) Snippet 614 — `petshop_gtm_atc_queue` rašyti į sesiją tik kai eilė netuščia.

## 5. 🔴 PHP / opcache / MariaDB

- **opcache**: `memory_consumption=32M`, `max_accelerated_files=4096`, `cache_full=true`, hit rate **16,1 %**, nuo 13:19 iki 14:08 — 219 517 hits / **1 135 203 misses**; 498 skriptų telpa iš ~3 000 (WC + Flatsome + 150 mu-plugin'ų 3,9 MB + 77 snippetų). Kiekviena užklausa perkompiliuoja PHP. Nustatymas sisteminis (`/usr/local/lib/php83.ini`, `conf/php83/*.ini`) — mes keisti negalime; PHP `cgi-fcgi` (kiekvienas procesas — savas opcache). JIT išjungtas (buffer 0).
- **Ką daryti:** raštas serveriai.lt: `opcache.memory_consumption=256`, `opcache.max_accelerated_files=30000`, `opcache.interned_strings_buffer=32`, `opcache.jit_buffer_size=64M`, ir ar galima PHP-FPM su bendru opcache. Jei negalima — tai argumentas VPS'ui (S1678 atviras Cloudflare/VPS klausimas). Tikėtinas efektas: TTFB 0,9–1,4 s → 0,3–0,5 s be jokių kodo pakeitimų.
- Kiti: PHP 8.3.33, `memory_limit` 512M, `max_execution_time` 280, `disable_functions` tvarkingas, `display_errors` 0, `expose_php` off, klaidų žurnalas už webroot. `memcached` plėtinys yra, bet lokalaus serverio nėra → objektų kešo galimybės nėra. MariaDB 10.6, buffer pool 4 GB, 256 jungtys, max naudota 61 — serverio pusė gera. Diskas: 394 GB laisva (bendras), paskyros kvota nematoma.
- **DB 715 MB**, top: `yith_wcan_cache` **152 MB** (53 264 eil. `products_in_term_count`, visos sukurtos šiandien, TTL 1 d. → kasdien perrašoma ~150 MB — tai ir yra 5 s filtrų AJAX priežastis; svarstyti YITH kešo išjungimą/„lazy load" alternatyvą), `postmeta` 80 MB, `woocommerce_sessions` 67 MB, `actionscheduler_actions` 50 MB (52 k complete), `shortpixel_*` **54 MB (pluginas neaktyvus)**, `snippets` 19 MB + `snippets_bak_s636` 17 MB (**1 531 neaktyvūs snippetai, 12 MB kodo, iš jų 732 TEMP**), `actionscheduler_logs` 21 MB (156 k eil.). Autoload 229 KB/767 opc. — gerai. Transientai 1 927 (170 pasibaigę, 3,3 MB). `ps_carts` 30 637 eil. nuo 09-07 (≈6 000/d, 4 sk.); valymo cron'ai (`ps_web_valymas`, `ps_stat_valymas`) yra, bet `DELETE` šioms lentelėms (`ps_carts`, `ps_web_ivykiai`, `ps_ivykiai`) mu-plugin'uose nerasta — patikrinti saugojimo terminus, kitaip augs be ribų.
- **Super Cache**: WP_CACHE on, „simple" režimas, 254 failų, galiojimas 3 600 s, preload off, `clear_on_post_edit` 0 (S1718). Su botų slapukais kešas mažai padeda; po 4 sk. pataisų — kelti galiojimą iki 24 val.
- WP All Import **#3 (ZB likučiai)**: kas valandą **3 699–3 885 s (62–65 min)**, „1 060 updated / 1 621 skipped", `is_selective_hashing=0` („Skip records that haven't changed" išjungtas) → kas valandą 1 060 pilnų prekės `save()` su visais kabliais (Sources registras, kešas, faktai). Įjungti „skip unchanged" (kaip #7 VF, kuris trunka 5–6 min) arba perkelti ZB likučius į lengvą sync kaip VF (`petshop_vf_sync_stock_hourly`: 1 239 prekės per sekundes). WPAI #1 (`goods_clean.xml`, gegužė) ir #5 (dublikatas #7) — ištrinti. `ps_import_tempas` (WP-cron pagalbinis) kaskart krenta „cURL 56 SSL … unable to get local issuer" — importus vis tiek varo DirectAdmin cron; stebėti (TLS iš serverio šiandien 200).

## 6. 🟠 Klaidos (php_error.log 7 d.: 73 fatal, 38 warning; WC fatal 09-24: 44)

| Klaida | Kiek | Kur | Ką daryti |
|---|---|---|---|
| `strstr(): Argument #1 must be string, WP_Error given` `functions.php:1154` ← `WC_Widget::get_current_page_url()` ← Flatsome `filter-button.php` | 70/7 d., ~10/d, **500 lankytojui** | `/kategorija/katems/?…&product_cat=tualetai-…,kraikai-…&query_type_product_cat=or&filter_tipas=…` — kai YITH filtre pažymėtos **dvi kategorijos** (`term` = „a,b" → `get_term_link` WP_Error) | mu-plugin: `template_redirect` — jei `is_tax()` ir `term` su kableliu → query var `term` = pirmas slug (WP_Query jau įvykdyta, filtrams neįtakoja); arba Flatsome filtro mygtuke neberodyti `WC_Widget_Layered_Nav_Filters` |
| `headers already sent … woo-lithuaniapost-main/public/partials/html-block-lpexpress-terminal.php:31` | 10/7 d. | kasa (LP terminalo blokas išveda HTML prieš redirect) | LP plugino klaida; jei klientas po „Užsakyti" lieka vietoje — čia priežastis; pranešti LP/perrašyti partial per child temą |
| `open_basedir` `file_exists()` `page-templates/../../..` | 24/7 d. | WP core šablonų skenas | nekenksminga |
| `petshop-xml.php` „Array to string conversion" | 2 | mūsų importo pluginas | smulki pataisa |
| LP `box-packer` deprecated (`jsonSerialize`) — `kiek` 44 122; `str_replace(null)` ps-desk 16 904 | sargo lentelė 2 508 eil./7 d. | | triukšmas: sargui filtruoti `deprecated`, ps-desk `null` sutvarkyti |

## 7. 🟠 Saugumas (vidus)

| Radinys | Rizika | Ką daryti |
|---|---|---|
| Snippet **#465 „GitHub Rele v1.0"** aktyvus, kode įrašytas GitHub tokenas (`PETSHOP_GH…`) | DB dump/backup = repo prieiga; snippetas nenaudojamas nuo atributų variklio | deaktyvuoti + ištrinti, tokeną atšaukti GitHub'e |
| 2FA nėra nė vienam admin/darbuotojui; prisijungimų limitas — `petshop-login-sargas` užraktas veikia, bet žurnalas rašo į neegzistuojančius stulpelius (S1717) → bandymų nematome | vidutinė | 2FA (WP 2FA/Two-Factor) adminui ir Ingai; sargo žurnalą sutaisyti; access log rodo 85 `wp-login.php` POST/d — tikrinti, kiek svetimų |
| Paskyra `testuotojas` (dev.avesa.lt el. paštas, `ps_darbuotojas`, pask. login 09-09) | maža | ištrinti |
| `ps_darbuotojas` turi `manage_woocommerce` (WC nustatymai, vartai, API raktai) | vidutinė | jei darbalaukiui nereikia — nuimti (testuoti su Inga) |
| Admin (id 1) paskutinis prisijungimas 09-24 06:10 iš **216.128.1.91** (ne LT; Inga — 84.15.175.109) | — | jei tai jūsų VPN — gerai; jei ne — keisti slaptažodį |
| Application password `petshop-bridge` (06-19), pask. 09-25 iš GitHub Actions; kartu su PAT — pilna admin/RCE prieiga per Code Snippets REST | vidutinė | rotuoti kas ketvirtį kartu su PAT (S1678 atviras) |
| WP **6.9.4** (galima 7.1.2; `auto_update_core_major=enabled`, bet neatsinaujina — valdo Installatron); pluginų atnaujinimai: Code Snippets 3.9.6→3.10.2, Complianz, Rank Math, WPForms, YITH WCAN 5.22→5.23, WP Importer; Flatsome 3.20.7 (3.20.9); **pasenę WC šablonai**: Flatsome `cart/cart.php` 10.8 ir `mini-cart.php` 10.0 vs WC 11.0, child `myaccount/form-login.php` | vidutinė (saugumas + kasos suderinamumas) | atnaujinimų langas po kopijos: pluginai → Flatsome → WP 7.1 (testuoti kasą/darbalaukį) |
| Neaktyvūs pluginai: PDF Invoices 5.16, Postit, Redirection, ShortPixel (54 MB lentelių) | maža | ištrinti (+ lentelės) |
| `uploads` leidžia vykdyti `.php` (`ps-backups/*-BACKUP-*.php` 403 tik dėl vardo šablono) | vidutinė | 2 sk. |
| Snippetai: 77 aktyvūs, tarp jų „Dry-Run", „Auditas read-only", „Attr Modulis (dry/apply)", „Dev App Passwords", „Katalogo Auditas" — diagnostika, veikianti kiekvienoje užklausoje | maža–vid. | peržiūrėti sąrašą, nereikalingus išjungti (mažiau kodo = mažiau opcache) |
| `wp-config.php`: VF API slaptažodis atviru tekstu (normalu), `WP_MEMORY_LIMIT` 40M (PHP 512M — realiai netrukdo) | — | pastaba: audito išvestyje (`analize/s1719_a.json`, privatus bridge repo) pateko `wpconfig_extra` eilutės su šiuo slaptažodžiu — jei norit, rotuoti VF |

## 8. 🟡 Likučių ir katalogo vientisumas

- **Užsakymai**: 0 įstrigusių (processing be siuntos >3 d. — 0; pending/on-hold seni — 0; failed 7 d. — 0); nuo 09-09 **0** apmokėtų eilučių be kelio/nurašymo žymių (S1717 #1177 tipo klaidų daugiau nėra); `_reduced_stock=0` 24 užs./61 eil. — tai normalu po `kelio-fiksavimas` (WC nurašo 0, AV — variklis).
- **Sargas 5323 klaidingi įspėjimai**: 4 atšaukti **neapmokėti bacs** užsakymai (#1128 36102, #1144 36143, 36145, 36250) gavo „⚠ SARGAS: likutis buvo sumažintas, bet NEGRĮŽO" — WC pastaba „Likutis sumažintas 10→10" rašoma net kai nurašyta 0, AV neapmokėtų nenurašo → grąžinti nėra ko. Rizika: Inga po įspėjimo „grąžina rankiniu" → likutis išpučiamas. Patikrinti šias 4 prekes; sargą perrašyti pagal `_reduced_stock>0`/`_ps_av_reduced_qty>0`, ne pagal pastabos tekstą.
- **Partijos ≠ AV**: 769 prekės su partijomis, **119 nesutampa** (Σ partijų 9 570 vs AV 9 785): #18655 kiaulės uodega 80 vs 191, Miamor konservai (17520/17510/17493/17499) partijos −20…−24 nuo AV, #17418 Monge BWild 0 vs 20, #19095 knyslė 0 vs 20, #16178 semtuvėlis 29 vs 0 (variable), Ambrosia 5 prekės — partijos 16–20 vnt., AV 0 (S1688 tipo fiktyvios T-0 partijos dropship prekėms). 27 AV prekės (155 vnt.) be partijų. Partijos veda savikainą/galiojimą — reikia vienkartinio sutikrinimo su fiziniu likučiu (Raimio duomenys) + sargo „minusai = 0".
- **76 AV prekės** (registre 692 vnt.) su `_manage_stock=no` ir be `_stock` (semtuvėliai, tualetai, dubenėliai, antkakliai) — WC laiko „visada yra", registras rodo kiekį → galima parduoti neturint. Įjungti likučių valdymą su realiu kiekiu.
- S1704 atviras: ~102 iki 09-22 apmokėti Paysera užsakymai turi ir `_reduced_stock`, ir `_ps_av_reduced_qty` → atšaukus/grąžinus — dvigubas grąžinimas (laukia „daryk").
- **Katalogas**: 2 676 publish / 1 227 draft / 17 trash; 246 variacijos, našlaičių 0; be kategorijos 1, be gamintojo 36, be nuotraukos 12, be SKU 29, SKU dublikatų 0, kaina 0 — 0, akcija ≥ kainos — 0, **neigiama marža 1** (#17472 Miamor skanėstai 2,29 € vs sav. 2,03), antkainis <10 % — 4, <20 % — 19; be jokios savikainos **111**.
- **EAN**: `_ean` ≠ `_global_unique_id` **946 prekėms** (Google feed'as ima `_global_unique_id`, ZB importas — `_zb_ean`/`_global_unique_id`, VF — `_ean`; pvz. #15474/#15524 abu GTIN 5904760213357 — skirtingi žaislai, #17241/#17245 Ontario — vienas GTIN dviem prekėms); `_ean` dublikatai 12 grupių (Josera Leger 10 kg = 1 kg — S1683 istorija, Josera Mini 10/1 kg, RC Sensible 2/10 kg, RC Hairball = Urinary, Ambrosia ×3, Brit ×3…). Tai kelia MC „neteisingas GTIN" ir klaidingus VF susiejimus. Vienkartinis sutvarkymas pagal tiekėjų kainynus (EAN → vienas laukas), kaina24/MC feed'ams naudoti tą patį.
- Sesijos: 15 013 eil. (909 pasibaigę — valymas veikia), bet 85 % — botų (4 sk.). `wc_admin_notes` 71 pending — triukšmas. `ps_seo_404` 7 d.: 2 537 keliai, 3 798 hitai (1 646 botų) — `.env.bak`, `v1/models`, `chat/completions` skeneriai; `parduotuve/page/108–110` — puslapiavimas už ribų (bot'ai + 3 Googlebot).

## 9. 🟢 Kas tvarkinga (patikrinta)

Cron 89 įvykių, 0 vėluoja, `ps_*` naktiniai visi suplanuoti; Action Scheduler 24 pending, 0 vėluoja, failed 7 d. — tik 2 WPForms kešai; `ps_email_jobs` 7 d.: 97 sent / 112 pending (suplanuoti ateičiai) / 29 skipped (consent), klaidų 0, pavėlavusių 0; sargų lemputės 09-25 03:30 — 0 raudonų; VF sync 17:01 (1 239), ZB 01:11, Google/kaina24/kainos feed'ai 01:30; Ads faktai 02:01 (45 eil.); WP Mail SMTP debug tuščias; HPOS on (sync on — palikta dėl senų pluginų, 184 posts); WC puslapiai 5/5; PVM 21 % LT/LV/EE (EE nuo 2025-07 — 24 %: aktualu tik viršijus 10 k€ ES B2C ribą — klausimas buhalterei); vartai Paysera + bacs (cheque/cod off); zonos LT / Neringa / EE-LV; laiškai: admin `new_order`/`cancelled`/`failed` → uzsakymai@; `customer_on_hold`/`failed`/`invoice` off (sąmoningai, savi srautai); `woocommerce_hold_stock_minutes` 90; svečių kasa on; `allow_tracking` yes (galima išjungti); asmens duomenų saugojimo terminai nenustatyti (BDAR: pending/failed/cancelled trynimas, neaktyvių paskyrų — Raimio sprendimas).

## 10. Siūloma eilė (sprendžia Raimis)

| # | Darbas | Kas | Laikas |
|---|---|---|---|
| 1 | AVPN dublikatai: buhalterės sprendimas + atominis numeravimas + sargas | R + C | 1 val. |
| 2 | Viešų failų uždarymas (lipdukai, feed'ai, uploads `.php`, šiukšlės) | C | 30 min |
| 3 | Kopijos: `uploads/` + `wp-config`/`.htaccess` į B2, atstatymo testas po T-0 | R + C | 1–2 val. |
| 4 | Botų sargas `add-to-cart` (JS slapukas) + `DISABLE_WP_CRON` + snippet 614 | C | 1 val. |
| 5 | Raštas serveriai.lt dėl opcache (arba VPS/Cloudflare sprendimas) | R | 15 min |
| 6 | WPAI #3 „skip unchanged" (arba ZB lengvas sync) | R (varnelė) / C | 10 min / 2 val. |
| 7 | 500 pataisa (dviejų kategorijų filtras) | C | 30 min |
| 8 | Snippet 465 + tokenas, `testuotojas`, 2FA, login-sargo žurnalas | R + C | 1 val. |
| 9 | Atnaujinimai (pluginai → Flatsome → WP 7.1) po kopijos | R + C | 2 val. + testai |
| 10 | DB higiena: ShortPixel/snippets_bak/inactive snippets/AS logai; `ps_carts`/`ps_web_ivykiai` valymo cron | C | 1 val. |
| 11 | Likučiai: partijos vs AV sutikrinimas, 76 AV be manage_stock, sargas 5323, S1704 atviras | R + C | 2–3 val. |
| 12 | EAN/GTIN sutvarkymas | R + C | 2 val. |

Įrankiai: `ps-bridge/s1719/a.php` (a saugumas, b WC, c cron/žurnalai, d našumas), `b.php` (e failai/HTTP, f vientisumas, g sesijos/DB/klaidos), `c.php` (h patikslinimai), `d.php` (i botai), `e.php` (j access log). Visi read-only; rezultatai `analize/s1719_a–e.json`.
