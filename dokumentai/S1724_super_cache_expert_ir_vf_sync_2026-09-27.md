# S1724 · Super Cache „Expert" (mod_rewrite) + VF sync „be pokyčio nerašo" (2026-09-27 13:30–13:55)

Kontekstas: S1723 incidentas — botų banga išsėmė php-cgi. Cloudflare (S1724_cloudflare) stabdo prieš serverį; šis darbas — kad kešuoti puslapiai išvis nebekrautų PHP ir kad kešas gyventų ilgiau nei minutes.

## 1. Kodėl Super Cache gyveno < 1 val. — kaltininkas ir pataisa

- Recon (`s1724/f.php` 2, `i/j/k/m.php`, read-only): `ps_cache_valymai` rodė `viskas_25` kas valandą :00–:01 („1239 prekės"). Šaltinis — **snippet 565 „Petshop VF Sync v1.1"** (DB, ne failas; hook `petshop_vf_sync_stock_hourly` closure eval'd kode, :59), `petshop_vf_sync_stock('apply')` eil. 334–339: **visoms** VF prekėms kas valandą kviečia `Petshop_Fulfillment::update_vf_qty()` → `recalculate()` → `wc_update_product_stock($id,$qty,'set')` **besąlygiškai** (`plugins/petshop-xml/includes/class-fulfillment.php` v1.6.1) → WC `set_stock` kabliai → `petshop-cache` eilė > 25 → `wp_cache_clear_cache()`. Faktas: `petshop_vf_stock_last_run.applied` = 1 239 kas valandą, `post_modified` bangos po 500–700 prekių.
- **Pataisa GYVAI 13:42 — snippet 565 → „Petshop VF Sync v1.2 (…; S1724 stock be pokyčio nerašo)"** (md5 `f2d76a11…`, bak opcija `ps_s1724_snip565_bak` gz+b64 su md5, repo `deploy/snippet-565-vf-sync-v1.2.php`; deploy `s1724/n.php` 2 + `o.php` 1, atstatymas `o.php` 9): `apply` šakoje `_vf_last_sync` rašomas visada, o `_vf_qty` + `update_vf_qty()` — tik jei `new_qty !== old_qty` ARBA WC būsena skiriasi nuo tos, kurią `recalculate()` įrašytų (`_stock` ≠ laukiama (zb_qty>0 ? zb : vf), `_active_fulfillment_source` ≠ laukiamas, `_manage_stock` ≠ yes). Galutinė būsena identiška v1.1, tik be tuščių rašymų. Statistikoje naujas `skipped_same`.
- Testas pilnu ciklu (1 239 prekės): applied 0, skipped_same 1 239, kešo valymų 0. Vienkartinis `n.php` 3 testas 13:40 dar perrašė 18 „DROPPED_FROM_FEED su 0" — po `o.php` (sąlyga `new_qty===old_qty`) ir jos praleidžiamos.
- Pastaba: ZB `stocks.php` (#3) po „skip unchanged" ir importų `importas_be_pokyciu` — nevalo. Lieka `petshop-cache` v1.2 slenkstis > 25 → pilnas valymas (dabar turėtų nebesuveikti kas valandą; stebėti `ps_cache_valymai`).

## 2. Super Cache Expert (mod_rewrite) — GYVAI 13:44

- Dry (`s1724/q2.php`): Super Cache generatorius (`wpsc_get_htaccess_info`) davė **klaidingą kelią** (`%{DOCUMENT_ROOT}/home/gyvunai2/…` — dubliuota) ir **be WooCommerce slapukų** išimčių; `wpsc_plugins` neįjungti. Todėl blokas rašytas ranka.
- `.htaccess` (bak `ps-archyvas/.htaccess.bak_s1724`, md5 buvo `57fc0def…`, dabar `e258061a…`, 4 821 B): blokas `# BEGIN WPSuperCache … # END WPSuperCache` įterptas **po „PS Botu uztvara" ir prieš „# BEGIN WordPress"**. Taisyklė: tik GET/HEAD, kelias su `/` pabaigoje, be query string, be slapukų `comment_author_|wordpress_logged_in|wp-postpass_|woocommerce_items_in_cart|wp_woocommerce_session_`, `HTTPS on` → `%{DOCUMENT_ROOT}/wp-content/cache/supercache/%{SERVER_NAME}/$1/index-https.html` jei failas yra (`-f`); http variantas `index.html`. `<FilesMatch "index(-https)?\.html$">`: `Vary: Accept-Encoding, Cookie`, `Cache-Control: max-age=3, must-revalidate`, **`X-PS-Cache: apache`** (diagnostikai). gzip (.html.gz) nenaudojamas (`cache_compression=0`).
- `wp-cache-config.php`: `$wp_cache_mod_rewrite = 1` (per `wp_cache_setting`). Kita konfigūracija nekeista: `cache_max_time` 3600, `wp_cache_not_logged_in` 2, `wp_cache_no_cache_for_get` 1, mobile off.
- Bridge (dev.avesa.lt hostas): `DOCUMENT_ROOT` kitas, `supercache/dev.avesa.lt/` nėra → visada PHP → bridge nepaveiktas.
- Patikra atskira užklausa (`r.php` 3, iš serverio per petshop.lt): pradžia/kategorija/prekė — 1-a užklausa PHP (`X-PS-Cache` nėra), 2-a **Apache** (`X-PS-Cache: apache`, ETag, Last-Modified, Accept-Ranges); su `woocommerce_items_in_cart` ar `wordpress_logged_in_` slapuku → PHP; kasa 302 (tuščias krepšelis), krepšelis/paskyra/paieška `?s=`/REST/sitemap/`wc-ajax` → PHP; filtras be slapuko → **403** (užtvara prieš kešą). Kešo failų 7 top-level katalogai.
- Atstatymas: `s1724/r.php` 9 (bak .htaccess + `wp_cache_mod_rewrite=0`).

## 3. Kas stebėti rytoj
- `ps_cache_valymai`: ar `viskas_25` nebeatsiranda kas valandą; Super Cache `psl` skaičius ryte (turėtų būti šimtai, ne dešimtys).
- `petshop_vf_stock_last_run.applied` — turėtų būti ~0–20, ne 1 239.
- Access log: kiek 200 atsakymų be PHP (Apache greitis ~ms) — netiesiogiai per serverio load.
- Kainų/likučių pokytis → prekės puslapis atsinaujina (petshop-cache `wp_cache_post_change` trina failą; Expert atiduoda tik esamą failą).
- Complianz banneris, `ps_js` slapukas (botų sargas JS) — abu kliento pusėje, kešuotame HTML yra.

Įrankiai repo `irankiai/s1724_i/j/k/m/n/o/q/r.php`; pamoka: `device_commit_files` tuo pačiu `stagedPath` antrą kartą atneša seną turinį — naujas failo vardas.
