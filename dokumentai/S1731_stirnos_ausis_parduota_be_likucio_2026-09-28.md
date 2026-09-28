# S1731 — Stirnos ausis parduota be likučio → sutvarkyta (2026-09-28)

Užsakymas #1208 (36555), 15:33, Paysera, apmokėtas: 5 × „Stirnos ausis, 1 vnt." #34908, kurių nebuvo. Kitos to užsakymo eilutės (kojos, Bosch) nurašytos tvarkingai. Pastaboje „#34908 −0 vnt. (0 partijos) · Partijose trūksta 5 vnt." — sistema neatitikimą pamatė tik po pardavimo. Klientui rašo Raimis pats.

## Priežastis (patikrinta, `ps-bridge/s1731/a–e.php`, read-only)
- #34908 sukurta 2026-08-12 16:52 per **Gavimo** formą (`petshop-gavimas.php`) ir iš karto publikuota (buvo kaina, kategorija, nuotrauka, aprašymas).
- Gavimas naujai prekei nustatydavo `set_manage_stock(false)` („likutį valdo partijos (FEFO)") + `instock`. Likučio valdymą įjungia tik partijos priėmimas (`Petshop_Partijos::rasyti_av_likuti`).
- #34908 partija niekada nepriimta → WooCommerce 1,5 mėn. laikė prekę neribotai turima; šiandien pirmas pardavimas. 16:29 Inga perkėlė į juodraštį.
- Ta pati yda juodraščiuose: #34896, #34902 (Gavimas, be nuotraukos), #20971, #23804. Publikuotų su yda — 0.

## Sutvarkyta GYVAI (Raimis 19:05 „būtinai taisyti, kad niekada nepasikartotų"; `s1731/f.php` 1 dry / 2 deploy / 3 patikra / 4 juodraščiai / **9 atstato viską**)
1. **Priežastis** — `mu-plugins/petshop-gavimas.php` (md5 e9c48175… → 89396be2…, bak `ps-archyvas/petshop-gavimas.php.bak_s1731`): nauja prekė kuriama su `manage_stock=yes`, `_stock=0`, `outofstock` → svetainėje „Neturime" + „Pranešti, kai bus", kol priimama pirma partija; priėmus kiekis ir „Turime" atsiranda savaime.
2. **Saugiklis pardavimo lygyje** — `mu-plugins/petshop-av-limit.php` **v1.1** (md5 e2860d11… → 80a5bc1c…, bak `ps-archyvas/petshop-av-limit.php.bak_s1731`, repo `deploy/petshop-av-limit-v1.1.php`): `be_valdymo()` ant `woocommerce_product_get_stock_status` / `…variation_get_stock_status` prio 25 — paprasta prekė ar variacija be likučio valdymo (nei savo, nei tėvo) = „nėra", neįdedama į krepšelį, krepšelyje/apmokėjime atmetama. Išimtys: DP pakai (`_dp_base_product_id`), paslaugos (`_ps_sandelis=paslauga`); rinkiniai ir variaciniai tėvai nepatenka (kitas tipas). Veikia nepriklausomai nuo to, kaip prekė atsirado (Gavimas, importas, ranka, katalogo atšaukimas). Išjungti: opcija `ps_be_valdymo_isjungta=1`.
3. **Duomenys** — 5 juodraščiams (#34908, #34896, #34902, #20971, #23804) `manage_stock=yes`, `_stock=0`, `outofstock`; bak opcija `ps_s1731_juodr_bak`.

## Patikra (faze 3, atskira užklausa)
- Heartbeat 200 (po deploy ir atskirai).
- Poveikis publikuotoms prekėms: 0 (nė viena gyva prekė nepakeitė būsenos).
- Laikina prekė: sukurta kaip Gavime → „nėra" (0); partija 3 vnt. → „yra" (3); išjungus valdymą → saugiklis „nėra"; ištrinta.
- DP pakas #35096 ir paslauga #35790 — saugiklis nelietė.

## Liko / Raimio sprendimas
- #34908 lieka juodraštyje (Rankos vartai). Grąžinti į prekybą su „Neturime" (SEO, „Pranešti kai bus") ar laukti prekės — Raimio sprendimas.
- Ryto sargo lemputė „prekė be likučio valdymo" — nedaryta (saugiklis pardavimą blokuoja ir be jos).
