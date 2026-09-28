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

## #1208 prekių keitimas (Raimis 19:43, klientas sutiko) — ATLIKTA
- „Stirnos ausis" ×5 (5,90 €) → 4 × „Ruda kiaulės ausis, 1 vnt." #16305 po 1,26 € (kaina 1,39 → 1,26, žymė `_ps_kaina_pakeista`) + 1 × „Bones Puppy Mix 100 g" #16273 (003339) 0,86 €. Užsakymo suma nepakito: 57,18 € (PVM 9,93 €).
- Eilutės kaip įprasto užsakymo: `_ps_source=av`, AV nurašyta (#16305 184 → 180, #16273 14 → 13, `_ps_av_reduced_qty`), partijos nurašytos (#3336 −4, #4048 −1), grupės perskaičiuotos (AV 6 eil. / 36 vnt.), faktai perrašyti (6 eil., PVM 9,93, marža 21,30). Pastaba užsakyme, įvykis `keitimas`. Klientui laiškas nesiųstas.
- Įrankiai `s1731/k.php` (1 dry / 2 / 3 / **9 atstato** — bak opcija `ps_s1731_1208_bak`), `l.php` (PVM naujoms eilutėms — WC `update_taxes()` naujų eilučių mokesčių neskaičiuoja, reikia `set_taxes`), `m.php` (pastabos).
- Kitą kartą patiems: mygtukas „Pakeisti" kortelės prekės eilutėje (šalia „Išimti") — laukia Raimio „daryk".

## Darbalaukis v3.45 — „Pakeisti“ užsakymo kortelėje (Raimis 20:08 „daryk“) — GYVAI 20:22
- Raimio sprendimai: suma po keitimo — tokia pati arba mažesnė (brangesnei prekei kaina mažinama ranka); keičia ir kainą — Inga (Inga dirba visą ūkį, Raimiui — strateginiai sprendimai); IAPV perdaroma.
- Kaip: kortelėje „q×“ → „Pakeisti“ (šalia Kiekis/Išimti; surinktai AV eilutei — tik „Pakeisti“) → paieška (pavadinimas/SKU, rodo AV likutį, tik AV turimos) → kiekis, kaina €/vnt. → suvestinė (sumokėta / naujos / grąžinti) → dialogas → vykdymas.
- Kada galima: apmokėtas, neuždarytas, eilutė be užrakto arba „jau surinkta“ (AV) — t. y. iki lipduko / perdavimo tiekėjui. Rinkinio (MnM) eilučių — ne.
- Ką daro (`pakeisti_vykdyti`, POST `ps_dl_pakeisti`, nonce `ps_dl_kiekis_{id}`): senos eilutės likutis grįžta (AV / WC veidrodis) + partijos į naujausią tos prekės partiją; naujos eilutės — šaltinis (`parinkti`, turi būti AV), AV nurašymas (DP pakui — bazinė), partijos FEFO, savikaina, PVM ranka; sumos, grupės; skirtumas → `_ps_grazinti_rankomis` (Klausimas „Grąžink klientui pinigus“); faktai perrašomi; IAPV PDF perdaroma tuo pačiu numeriu (tipas laikinai `proforma`, AVPN nedeginamas); pastaba; įvykis `keitimas`. Klientui laiško nėra.
- Failas `mu-plugins/petshop-darbalaukis.php` v3.45: md5 f1bdf094… → bfd418fd…, bak `ps-archyvas/petshop-darbalaukis.php.bak_s1731`, repo `deploy/petshop-darbalaukis-v3.45.php`; įrankis `s1731/q.php` (1 dry / 2 deploy / 3 patikra / 4–6 testas / **9 atstato**).
- Testas (testiniu užsakymu, po to ištrinta): A×3 (6,00 €) → B×2 po 1,99 + A×1 po 1,50 = 5,48 € → PVM 0,95 ✓, likučiai A 7→10→9, B 10→8 ✓, grąžinti 0,52 € ✓, IAPV PDF ✓, dokumento tipas atstatytas ✓, faktai ✓. Šalutinis: testinis užsakymas užėmė numerį **1215** (numeracijoje bus tarpas; sąskaitų numeriai nepaliesti).
- #1208 IAPV000285 perdaryta: kiaulės ausys + Bones, 57,18 €, PVM 9,93 € (patikrinta PDF tekstu); IAPV/AVPN skaitikliai nepakito.

## Atšauktame užsakyme — be siuntos sekimo numerio (Raimis 20:35) — GYVAI 20:50
- Atvejis #1190 (36319, Quattro dropship): Venipak siunta V07267E1000234 užregistruota 09-28 09:40, Inga atšaukė 14:08 → WC laiškuose „Atšauktas užsakymas“ (klientui ir adminui) buvo sekimo numeris — jį įdeda Venipak plugino `add_venipak_shipping_tracking_number` (`woocommerce_email_before_order_table` prio 10) visiems laiškams.
- Pataisa `mu-plugins/petshop-kliento-siuntos.php` **v1.3** (md5 fb5a0c08… → 4b1b01cb…, bak `ps-archyvas/petshop-kliento-siuntos.php.bak_s1731`, repo `deploy/petshop-kliento-siuntos-v1.3.php`, `s1731/v.php` 1/2/3/**9 atstato**): `atsauktas()` = cancelled / refunded / failed / lp-cancelled → paskyros bloke „Siuntos“ nerodoma; laiškuose Venipak numeris nuimamas prio 5 ir grąžinamas po lentelės (prio 999), kad kiti tos pačios užklausos laiškai nepasikeistų.
- Patikra (laiškų render be siuntimo): #1190 atšaukimo laiškas klientui ir adminui — numerio NĖRA ✓; kontrolinis įvykdytas #36546 — numeris V07267E1000233 lieka ✓.
- Liko (Raimio/Ingos): #1190 Venipak siunta V07267E1000234 tebėra užregistruota (Quattro manifestas 004, „At sender“) — ar Quattro žino, kad nesiųsti, ir ar siunta atšaukta Venipak'e.
