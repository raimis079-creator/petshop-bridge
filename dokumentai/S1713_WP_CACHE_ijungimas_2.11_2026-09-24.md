# S1713 — WP_CACHE įjungimas (veiksmų plano 2.11), 2026-09-24 vakaras

Raimis „daryk" 21:17. Bridge iš VM `ps-bridge/s1713/a–j.php` (GET raktai `ps_s1713a…j`), rezultatai `analize/s1713_*.json`.

## Kas buvo
`wp-config.php` neturėjo `define('WP_CACHE', true)` → WP Super Cache (Simple režimas, `advanced-cache.php` yra, nustatymai `cache_enabled=1`, 1 h) nė vieno puslapio nekešavo. TTFB svečiui 1,0–2,1 s kiekvienam puslapiui (žinoma nuo S1689s, 09-17).

## Kas padaryta (gyvai)

| # | Pakeitimas | Bak / atstatymas |
|---|---|---|
| 1 | `wp-config.php` — po `<?php` pridėtos 2 eilutės: `define('WP_CACHE', true);` ir `define('WPCACHEHOME', '/home/gyvunai2/domains/petshop.lt/public_html/wp-content/plugins/wp-super-cache/');` (be antrosios Super Cache rašo „installed but broken"). md5 91e78800… → 43fb96c9… | `ps-archyvas/wp-config.php.bak_s1713`; `s1713/a.php` fazė 9 |
| 2 | `wp-cache-config.php` — `cache_rejected_uri` + `augintinio-profilis`, `refill-feedback` (buvęs šablonas `augintinis` /augintinio-profilis/ nedengė — anketa buvo užkešuota) | `ps-archyvas/wp-cache-config.php.bak_s1713` |
| 3 | `mu-plugins/petshop-cache.php` v1.0 → **v1.1** (md5 0816cc13… → eef93f9b…): po prekės likučio/kainos pokyčio, be Super Cache standartinio valymo (prekė + pradinis + /page/), rebuild žymimi ir prekės kategorijų (su tėvais), gamintojo ir /parduotuve/ katalogai — Super Cache kategorijų archyvų (kur rodoma kaina ir „Turime") pats nevalo | `uploads/ps-backups/petshop-cache.php.bak_s1713`; repo `deploy/petshop-cache-v1.1.php` (+ `v1.0.php`); `s1713/i2.php` fazė 9 |

## Patikra (svečio užklausos iš serverio, `s1713/a.php` fazė 2, `d.php`, `h.php`, `i2.php` 3, `j.php`)

| Puslapis | Prieš (ms) | Po, kešuota (ms) | Būklė |
|---|---|---|---|
| `/` | 1 073 | 51–66 | CACHED |
| `/kategorija/katems/` | 1 385 | 39–52 | CACHED |
| Prekė (Josera SensiPlus 12,5 kg) | 1 913 | 39–65 | CACHED |
| `/skaiciuokle/`, `/taksas/` | 1 037–1 086 | 40–64 | CACHED |
| `/krepselis/`, `/kasa/`, `/paskyra/` | 1 034–2 148 | — | NEkešuojami (WC `no-cache`) ✓ |
| `/augintinio-profilis/`, `/refill-feedback/` | ~1 000 | — | NEkešuojami po pataisos ✓ |
| `/parduotuve/?orderby=price` (query string) | 1 300–1 500 | — | nekešuojama (Super Cache GET taisyklė) |

- Kešuotame HTML yra: kaina (`woocommerce-Price-amount`), Complianz juosta, welcome modalo žymės, `wc-cart-fragments` (mini-krepšelio atnaujinimas JS), `ps-web` analitikos rinkiklis, Clarity, GTM. `_wpnonce` HTML'e nėra.
- Prisijungusiam (`wordpress_logged_in_*` slapukas) — dinaminis puslapis (1,2 s), nekešuojama ✓ (`wp_cache_not_logged_in=2`). Svečiui su prekėmis krepšelyje (`woocommerce_items_in_cart`) — irgi dinaminis (Super Cache WC integracija). Kešą gauna tik svečiai be krepšelio — didžioji srauto dalis (Google, AI botai, pirmas apsilankymas).
- Valymas po likučio pokyčio (`woocommerce_product_set_stock` → `petshop-cache.php` shutdown → `wp_cache_post_change`): prekė, titulinis, 3 kategorijų lygiai, `/gamintojas/josera/`, `/parduotuve/` → `index-https.html.needs-rebuild`; nesusijusi `/kategorija/katems/` neliesta ✓. Importai (`pmxi_after_xml_import`) ir kategorijų redagavimas → `wp_cache_clear_cache()` (viskas) kaip anksčiau.
- `php_error.log` naujų įrašų po pakeitimų nėra.

## Pamokos
- Bridge užklausos ateina su `HTTP_HOST=dev.avesa.lt` → Super Cache `get_current_url_supercache_dir($pid)` skaičiuoja `supercache/dev.avesa.lt/…`, todėl iš bridge tiesiogiai kviestas `wp_cache_post_change()` prekės katalogo `supercache/petshop.lt/` nevalo. Realūs pokyčiai (kasa, cron, importai) eina per `petshop.lt` — testuoti per įdėtinę `wp_remote_get(home_url('/?…'))` užklausą (h.php / i2.php fazė 3). `get_supercache_dir()` (be pid) — visada `petshop.lt`.
- `petshop-cache.php` valo per `shutdown` — vienoje užklausoje rezultato nematyti, tikrinti kita užklausa.
- Vienose kabutėse `\n` PHP eilutėje yra pažodinis — pirmame deploy komentaro gale liko `\n` tekstas (sintaksė galiojo, pataisyta `b.php`).
- Super Cache be `WPCACHEHOME` wp-config'e prideda HTML komentarą „installed but broken" ir nekešuoja.

## Kas liko / matuoti
- CrUX/PageSpeed po ~2 sav. (≈10-08): TTFB „AVERAGE" → „FAST"?; GSC crawl stats — Googlebot puslapių/d.
- `cache_max_time` 3600 — palikta; kainų importai valo viską, tad pasenusi kaina galima tik ≤1 h po rankinio keitimo per WC admin be `woocommerce_update_product` (nepastebėta).
- Nekešuojami svečiai su krepšeliu — jei norėsis ir jiems greičio, reikėtų Super Cache „late init" arba fragmentų — ne dabar.
