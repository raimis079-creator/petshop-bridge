# S1720 — 2.17 pristatymo pažadas GYVAI — 2026-09-25 (22:25–22:50)

Maketas v3 (`S1720_maketas_2.17_pristatymo_pazadas_2026-09-25.md`, vizualas `S1720_maketas_2.17_vizualas.html`) → R „man viskas tinka“ 22:23 → kodas.

## GYVAI
1. **NAUJAS `mu-plugins/petshop-pristatymo-pazadas.php` v1.0.1** — md5 `f915bc61d6c2e502f9b564906c473cbe`, klasė `Petshop_Pristatymo_Pazadas`, repo `deploy/petshop-pristatymo-pazadas-v1.0.1.php` (+ DATA `deploy/petshop-pristatymo-pazadas-v1_0_1.php.txt`). Išjungti visą: opcija `ps_pristatymo_pazadas_isjungtas=1`; tik €/kg: `ps_kg_isjungta=1`. Pašalinti: `s1720/j2.php 9` (perkelia į `ps-archyvas/*.off_s1720`, atstato schemą ir /pristatymas/).
   - **Prekės puslapis** (`woocommerce_get_stock_html` prio 30, tik `instock` + perkama, ne variable/MnM/grouped, ne laukų puslapiai): po „Turime“ — „Išsiunčiame per 1–2 d. d.“ (sunkvežimio ikona) + antra eilutė: telpa į paštomatą (svoris ≤ `Petshop_Rinkiniai::PASTOMATO_RIBA`, be `_ps_tik_kurjeriu=yes`) → kaina ≥ 30 € „Į paštomatą nemokamai · kurjeriu 3,99 €“, kitaip „Į paštomatą 2,15 € · nemokamai nuo 30 € · kurjeriu 3,99 €“; netelpa → „Pristatymas kurjeriu 3,99 €“. Kainos iš `Petshop_Schema_Prekes` konstantų (vienas šaltinis su schema).
   - **€/kg** (`woocommerce_single_product_summary` prio 10, po kainos): tik kategorijų slug su `sausas` arba `kraik`, svoris iš pavadinimo (`12 kg`, `1,5 kg`, `800 g`, `10+1kg`→11, `15+3kg`→18, `10 + 2 kg`→12, DP pakas „2 vnt. … 2 kg“→4 per `Petshop_AV_Source::dp`), tik ≥ 1 kg; kraikas litrais („6 l“) — nerodoma. Kaina per `wc_get_price_to_display`.
   - **Krepšelis / apmokėjimas / mini** — šaltinių prognozė kaip `Petshop_AV_Order::fiksuoti`: `resolve()` kiekvienai eilutei → mišrus pagal tiekėją (kaip `ar_misrus`) → `parinkti($pid,$qty,$misrus)` → šaltinių aibė; ≥ 2 → „Išsiųsime per 3 d. d.“, kitaip „Išsiųsime per 1–2 d. d.“ (be paaiškinimų — R). Tik skaitymas, cache per užklausą. MnM konteineris praleidžiamas (vaikai — atskiros eilutės), DP pakas — per bazinę. Vietos: krepšelyje `woocommerce_cart_totals_before_order_total` prio 6 (po nemokamo pristatymo langelio, prieš „TĘSTI ATSISKAITYMĄ“), apmokėjime `woocommerce_review_order_before_shipping` (po prekių, prieš „Pristatymas“), mini `woocommerce_widget_shopping_cart_before_buttons` prio 6. Pilkas langelis `#f5f6f5` su laikrodžio ikona, spalva vienoda abiem atvejais.
2. **`petshop-schema-prekes` v1.1 → v1.2** — `handlingTime` 0–2 → **1–2** d. (md5 `f28e9f0d…` → `5a7e763f…`, bak `ps-archyvas/petshop-schema-prekes.php.bak_s1720`).
3. **`/pristatymas/` (id 14894)** — 2 sakiniai per tiesioginį `posts` UPDATE (ne `wp_update_post` — kses), bak opcija `ps_s1720_pristatymas_bak` (md5 `0ce1f0a0…` → `d34e24a4…`): „Prekes išsiunčiame per 1–2 darbo dienas. Jei užsakyme yra prekių iš skirtingų tiekėjų – per 3 darbo dienas.“; „Prekės išsiunčiamos per 1–2 darbo dienas (užsakymai su prekėmis iš skirtingų tiekėjų – per 3 darbo dienas), o pristatomos – per 1 darbo dieną“.
4. Super Cache išvalytas (`j2.php 5`), kad prekių puslapiai gautų naujas eilutes.

## Patikra
- HTML (`j2.php 3`): 18560 AV 12 kg — „Išsiunčiame per 1–2 d. d. / Į paštomatą nemokamai · kurjeriu 3,99 €“, 6,66 €/kg; 26340 VF Flexi 20,69 € — „Į paštomatą 2,15 € · nemokamai nuo 30 € · kurjeriu 3,99 €“, be €/kg; 14805 ZB Monge 12 kg — 1–2 d. d., 7,80 €/kg; 35316 konservai 400 g — be €/kg; 18054 Leger 10 kg — 4,09 €/kg; 15938 variable outofstock — nieko. Schema visuose `handlingTime 1–2`. `php_error.log` be naujų klaidų.
- Naršyklė (`s1720/k.php`, Playwright, `screenshots/s1720k_*.png`): krepšelis tik su Exclusion (AV) → „Išsiųsime per 1–2 d. d.“ krepšelyje ir apmokėjime; pridėjus Monge Struvite 2 kg (ZB) → „Išsiųsime per 3 d. d.“ abiejose vietose, po prekių / prieš „Pristatymas“ — kaip makete. Mini-krepšelio iškrentančio lango Playwright neatidarė (hover) — kodas tas pats hook'as, R patikrina akimis.
- Svorio parseris: 8/8 pavadinimų teisingai.

## Liko / pastabos
- Pažado laikymosi matavimas (`ps_fakt_siuntos.isvezta_at − date_paid` ≤ 2 d. d.) — Ryto sargo lemputė „pažadas“, jei R norės (+30 min).
- Mini-krepšelis — R patikra akimis.
- 2.17 kiti punktai (skaičiuoklė virš FBT, pakuočių perjungiklis, nuotraukos aukštis mobiliajame) — atskiras maketas.

## Įrankiai
VM `ps-bridge/s1720/`: f (2.17 recon), g („kasa“ recon), h (krepšelio/apmokėjimo ekranai prieš), i (recon prieš kodą), j/j2 (deploy 1 / pristatymas 2 sausas · 4 rašyti / 3 testai / 5 Super Cache / 9 atstatyti), k (ekranai po). Repo `irankiai/s1720_f–k.php`, `deploy/petshop-pristatymo-pazadas-v1.0.1.php`. Pamokos: Playwright bridge — pirmas kadras prekės puslapis (botų sargo slapukas `ps_js`), tik tada `?add-to-cart=`; `wp_remote_get` iškart po Super Cache valymo gali neatsakyti per 25 s — kartoti.
