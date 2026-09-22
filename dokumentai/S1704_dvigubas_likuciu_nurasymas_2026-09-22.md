# S1704 — Dvigubas AV likučių nurašymas (Paysera) — 2026-09-22

**Pradžia:** Raimis — „klaidos likučių, kas čia per nesąmonės": Animonda Vom Feinsten Junior 150 g (#19366, EAN 4017721829731) istorijoje 09-19 21:23 „Likutis 67 → 62" be paaiškinimo.

## Diagnozė (patvirtinta iki kodo eilutės)

Užsakymas #1117 (36091, Paysera, 5 vnt.):
- 21:22:12 **kasoje** — WooCommerce nurašė `_stock` 72 → 67 (`_reduced_stock=5`)
- 21:23:43 **apmokėjus** — `Petshop_AV_Order::fiksuoti` (prio 5) uždėjo `_ps_source=av`, `Petshop_AV_Reduce::mazinti` (prio 15) nurašė **dar kartą** 67 → 62 (`_ps_av_reduced_qty=5`)
- 21:23:43 partijos nurašytos teisingai −5 → partijų suma 67

**Kaltininkas:** `plugins/woo-payment-gateway-paysera/src/Entity/class-paysera-payment-gateway.php:102` — `process_payment()` kviečia `wc_maybe_reduce_stock_levels($order_id)` **kasoje, prieš apmokėjimą**. AV architektūra (S479/S480) rėmėsi prielaida, kad WC nurašo tik `payment_complete`/`processing` (prio 10), todėl kelias fiksuojamas ten pat prio 5, o filtras `woocommerce_order_item_quantity` → 0 AV eilutėms suveikia tik kai `_ps_source` jau yra. Paysera nurašė minute anksčiau — filtras tuščias.

Bacs veikė teisingai (on-hold → `fiksuoti` prio 5 → WC prio 10 sustabdytas). Nuo T-0: 135 Paysera vs 13 bacs užsakymų — dvigubai nurašomi praktiškai visi.

Paliestos tik **grynai AV** prekės (be `_own_stock_qty`, likutis `_stock`) — daugiausia Animonda konservai (AV, be tiekėjo). Prekėms su tiekėju WC mažino `_stock` (tiekėjo lauką), kurį naktinis XML sync perrašo — savaime išsitaiso.

**Mastas:** 124 prekės, 613 vnt. nurašyta dvigubai. Invariantas „partijos = likutis": 767 prekės su partijomis, 158 nesutampa (−541 trūkumas, +479 perteklius — perteklius yra kita tema: rankiniai likučiai be partijų).

Pasekmė: bent 2 prekės rodė „nėra" turint sandėlyje (#19396 Animonda Turkey & Ham — 33 vnt., #16178) — prarasti pardavimai.

## Padaryta

### 1. Priežastis — naujas mu-plugin `petshop-kelio-fiksavimas.php` v1.0 GYVAI
- md5 `069e379ce342987b16de3bd4e69f0299`, repo `deploy/petshop-kelio-fiksavimas-v1.0.php`
- `woocommerce_checkout_order_processed` (prio 5) + `woocommerce_store_api_checkout_order_processed` → `Petshop_AV_Order::fiksuoti()`; užsakymo meta `_ps_kelias_kasoje`
- Variklių failai (`petshop-av-order.php`, `petshop-av-reduce.php`) **neliesti**; `fiksuoti()` idempotentiškas
- Išjungti: opcija `ps_kelio_fiksavimas_isjungta=1` arba `s1704_k.php` fazė 9 (pervadina `.off_s1704`)
- Pasekmė: kelias fiksuojamas užsakymo momentu (kaip bacs jau buvo) — atitinka 09-12 principą
- **E2E ✓** (#34889, imituotas Paysera `wc_maybe_reduce_stock_levels` kasoje): kasoje `_ps_source=av` → WC nurašė 0 (`10→10`) → apmokėjus AV `10→8` vieną kartą → atšaukus `10`. Testinis užsakymas 36147 ištrintas, faktai išvalyti, prekė atstatyta (draft/0)

### 2. Likučių pataisa — `s1704_l.php`
Taisyklė (konservatyvi): tik kai `_stock` < partijų suma; pridėti `min(dvigubai nurašyta, partijos − _stock)`. Niekur ne virš partijų.
- Planas 86 prekės / +446 vnt.; įvykdyta **85 / +443** (per `set_stock_quantity` + `instock` + `ps_sources_sync_saugiai` + transients; Super Cache išvalytas)
- #16178 Georplast semtuvėlis — **variable** tėvinė prekė, `_manage_stock=no`, likutis variacijose (6), partija 29 vnt. guli ant tėvo → neliesta
- Bak opcija `ps_s1704_likuciai_bak` (pid, buvo); atstatyti: `s1704_l.php` fazė 9

### 3. Neliesta — Raimio peržiūrai (38 prekės su dvigubu nurašymu, bet likutis ≥ partijų)
Likutis > partijų (rankiniai likučiai be partijos?): #18655 kiaulės uodega 191 vs 80 · #17493 Miamor tunas/krevetės 51 vs 28 · #17159 Ontario ėriena 22 vs 13 · #15444 draskyklė Žuvis 10 vs 2 · #18131 jaučio peniai 10 vnt. 10 vs 3 · #19534 GranCarno Sensitive 9 vs 3 · #16936 Ontario Lamb pasta 16 vs 10 · #16942 Ontario Salmon pasta 5 vs 2 · #17223 Ontario monoprot. ėriena 2 vs 0 · #18266, #18458, #19086, #19281 (±1).
Likutis = partijų (25 prekės, pvz. Miamor #17507/17517/17535/17538, Hikari) — kažkas jau suvienodino; veiksmų nereikia.
#16165 Sepija — partijų nėra.

## ATVIRA
- **Senų užsakymų atšaukimas/grąžinimas** (~102 completed Paysera iki 09-22 11:30): eilutės turi ir `_reduced_stock`, ir `_ps_av_reduced_qty` → atšaukus WC grąžintų `_stock` **ir** AV variklis grąžintų → dvigubas grąžinimas. Siūlymas: toms 190 eilučių (grynai AV) nustatyti `_reduced_stock=0` — tada grąžina tik AV. Reikia Raimio „daryk".
- Variacinės prekės (#16178 ir kt.): partija ant tėvo, likutis variacijose — invariantas nesuvedamas; `Petshop_AV_Reduce` grynai AV šakoje `managing_stock()` tėvui false → AV nenurašo, nurašo tik WC variacijai. Ar dvigubo nurašymo ten nėra — patikrinti atskirai.
- Perteklius +479 (37 prekės, likutis > partijų) — Raimio sprendimas: ar suvesti partijas, ar palikti.
- Paysera pluginas atnaujinus liks toks pat — pataisa mūsų pusėje, nepriklauso nuo jo.

## Įrankiai (repo `irankiai/`)
`s1704_a–j.php` read-only recon (prekė, istorija, dvigubos eilutės, kabliai, av-reduce/av-order kodas, Paysera šaltinis, invariantas, suskaičiavimas); `s1704_k.php` deploy 1 / E2E 2 / išjungti 9; `s1704_l.php` sausas 1 / vykdyti 2 / atstatyti 9; `s1704_m.php` #16178. Rezultatai `analize/s1704_*.json`.

## Pamokos
- Mokėjimo vartai gali nurašyti likutį `process_payment()` viduje — visi „prio 5 prieš WC prio 10" susitarimai galioja tik WC core kabliams; tikrinti vartų kodą.
- Invarianto skenas (`s1704_e.php`) — paleisti po kiekvieno likučių darbo; 0 nesutapimų nebus dėl rankinių likučių, bet minusai turi būti 0.
