# S1720 — 2.17 MAKETAS: pristatymo pažadas prekėje / krepšelyje / apmokėjime — 2026-09-25

Statusas: **maketas v3 (22:25), laukia R „daryk"**. v3: krepšelio/apmokėjimo vaizdas pagal tikrus ekranus (`s1720/h.php`, Playwright, `screenshots/s1720_krepselis|apmokejimas.png`), tekstai be paaiškinimų. R pataisos: „kasa" → „Apmokėjimas" (URL `/kasa/` lieka; klientas žodžio nemato), „viena siunta" — NE (iki pakavimo nežinome), mišriam LP Express nerodomas, €/kg — tik sausam maistui ir kraikui ≥ 1 kg. Kodas — po „daryk" tame pačiame lange (`petshop-pristatymo-pazadas.php` v1.0 + `petshop-schema-prekes` v1.2 + `/pristatymas/` teksto pataisa).

## 0. Kas yra dabar (faktai iš serverio, `s1720/f.php`)
- Prekės puslapyje po kaina ir trumpu aprašymu — `<p class="stock in-stock">Turime</p>` (tekstas iš `petshop-av-limit` per `woocommerce_get_availability_text`; „Neturime" → po juo `petshop-atsargu-laukimas` forma, prio 31). Pristatymo termino ir kainos prie prekės **nėra**. €/kg **nėra**.
- Krepšelyje: nemokamo pristatymo progreso juosta (`flatsome-child/functions.php`, `woocommerce_cart_totals_before_order_total` prio 5), mažo krepšelio (< 9 €) pranešimas po sumos; mini-krepšelyje — mažo krepšelio pranešimas (`woocommerce_widget_shopping_cart_before_buttons`). Apmokėjimo puslapyje (`review-order`) pristatymo termino nėra. Termino eilutės **niekur nėra**.
- `/pristatymas/` (id 14894): du kartus „Prekės išsiunčiamos per **1–3** darbo dienas", „pristatomos per 1 darbo dieną". Paštomatas 2,15 € (nemokamas nuo 30 €), kurjeris 3,99 € (iki 50 kg), Venipak paštomatas iki 25 kg, LP iki 30 kg.
- Schema (`petshop-schema-prekes` v1.1): `shippingDetails` 2,15/3,99 su PVM ✓, `handlingTime` **0–2** d., `transitTime` 1–2 d.
- Kelias fiksuojamas apmokėjus (`Petshop_AV_Order::fiksuoti` → `Petshop_AV_Source::parinkti($pid,$qty,$misrus)`), eilutės `_ps_source` av|vf|zb|quattro|ambrosia|belcor_tofu|prins. Krepšelyje kelias dar nefiksuotas — pažadui reikia **prognozės** ta pačia funkcija (`parinkti`/`resolve`, be rašymo).
- Siuntų faktai 14 d.: 7–24 siuntos/d.

## 1. Prekės puslapis
Vieta: **iškart po „Turime"** (filtras `woocommerce_get_stock_html`, prio 30 — po av-limit). Rodoma tik `instock`.

```
Turime
Išsiunčiame per 1–2 d. d.
Į paštomatą 2,15 € · nemokamai nuo 30 € · kurjeriu 3,99 €
```
- 2 eilutė (kaina) — iš tų pačių konstantų kaip schema (`Petshop_Schema_Prekes::PASTOMATAS_CT/KURJERIS_CT/NEMOKAMAS_NUO_CT`), kad nesiskirtų. Prekei > 25 kg arba su varnele „Tik kurjeriu" — „Pristatymas kurjeriu 3,99 €" (be paštomato). Kaina ≥ 30 € ir telpa į paštomatą — „Į paštomatą nemokamai · kurjeriu 3,99 €".
- Stilius: 13–14 px, pilka (`#555`), pirmoje eilutėje sunkvežimio ikona (inline SVG, kaip `petshop-laukai` juostoje). Mobiliajame — tos pačios 2 eilutės.
- Nerodoma: rinkinių (MnM) ir laukų puslapiuose (`petshop-laukai` turi savą juostą), „Neturime" (ten atsargų laukimo forma), variacijų tėvui be pasirinktos variacijos (rodoma per `woocommerce_available_variation` → `availability_html`).
- Terminas prekėje visoms vienodas „1–2 d. d." (R žodžiai; mišrumą sprendžia krepšelis).

## 2. €/kg po kaina (R 22:10: sausam maistui ir kraikui — tinka)
Kaina `79,90 €` → po ja smulkiai `6,66 €/kg`. **Ne visur**: tik sausam maistui ir kraikui (kategorijų kelias `sausas|kraik|lesal`), kai svoris ≥ 1 kg; konservams, skanėstams, aksesuarams — ne. Tik prekės puslapyje, kataloge — ne. Svoris iš pavadinimo (`12 kg`, `1,5 kg`, `800 g`, `10+1kg` → 11) — **ne** iš `_weight` (tai siuntos svoris, ZB matmenys nepatikimi). DP pakams „2 vnt. × 2 kg" → 4 kg. Nerandant svorio — nerodoma. Kataloge (kortelėse) — kol kas ne, tik prekės puslapyje.

## 3. Krepšelis / apmokėjimas / mini-krepšelis — siuntimo eilutė
Prognozė: kiekvienai krepšelio eilutei `Petshop_AV_Source::parinkti($pid,$qty,$misrus)` (DRY, be meta rašymo; MnM — pagal komponentus; DP pakas — bazinė prekė), rezultatas — šaltinių aibė. Skaičiuojama vieną kartą per užklausą (static), atnaujinama su WC fragmentais (mini-krepšelis AJAX).

| Šaltinių aibė | Tekstas |
|---|---|
| vienas šaltinis (tik AV, arba tik vienas tiekėjas) | **Išsiųsime per 1–2 d. d.** |
| ≥ 2 šaltiniai (AV + tiekėjas, arba 2 tiekėjai) | **Išsiųsime per 3 d. d.** (R 22:10: be paaiškinimų klientui) |
| yra prekė be likučio niekur (`av_truksta`) | eilutė nerodoma (tokios prekės apmokėjime ir taip stabdomos) |

Vietos:
- **Krepšelis** (tikras vaizdas: „KREPŠELIO SKAIČIAVIMAS" → kursyvu „Pristatymo būdą pasirinksite kitame žingsnyje." → Suma → žalias langelis „🎉 Jums priklauso nemokamas pristatymas į paštomatą!" su juosta → „TĘSTI ATSISKAITYMĄ" → Nuolaida) — eilutė **po žaliu langeliu, prieš mygtuką** (`woocommerce_cart_totals_before_order_total` prio 6, po `petshop_free_shipping_progress` prio 5): pilkas fonas kaip langelio, laikrodžio ikona, tas pats tekstas abiem atvejais (spalva nesikeičia).
- **Apmokėjimas** (tikras vaizdas: „JŪSŲ UŽSAKYMAS" → prekės → „Pristatymas" su Venipak paštomatai / LP / kurjeris → Suma be PVM / Pristatymo mokestis / PVM / Viso) — eilutė **po prekių sąrašu, prieš „Pristatymas"** (`woocommerce_review_order_before_shipping`), tas pats stilius. Jokių pažadų apie siuntų skaičių (R: iki pakavimo nežinome). Mišriam LP Express jau dabar nerodomas — nekeičiam.
- **Mini-krepšelis** — po „Suma", virš mygtukų (`woocommerce_widget_shopping_cart_before_buttons` prio 6), tas pats tekstas.
- Užsakymo patvirtinimo puslapis / laiškas „Užsakymas gautas" — **ne dabar** (laiškai — atskira tema, S1676 šablonai).

## 4. Schema
`petshop-schema-prekes` v1.2: `handlingTime` 0–2 → **1–2** d. (`minValue 1, maxValue 2`), `transitTime` 1–2 lieka. Vienas skaičius pakeistas, bak `.bak_s1720`.

## 5. `/pristatymas/` tekstas (2 vietos)
- „Trumpai": „Prekes išsiunčiame per 1–3 darbo dienas." → **„Prekes išsiunčiame per 1–2 darbo dienas. Jei užsakyme yra prekių iš skirtingų tiekėjų — per 3 darbo dienas."**
- „Pristatymo terminai": „**Prekės išsiunčiamos per 1–3 darbo dienas, o pristatomos – per 1 darbo dieną**" → **„Prekės išsiunčiamos per 1–2 darbo dienas (užsakymai su prekėmis iš skirtingų tiekėjų – per 3 darbo dienas), o pristatomos – per 1 darbo dieną"**.
- Sakinys „Užsakius daugiau nei vieną prekę, jos gali būti pristatytos ne vienu metu…" — paliekamas.
- Rašoma per `wp_update_post` su bak opcija `ps_s1720_pristatymas_bak`; Super Cache puslapis išvalomas.

## 6. Ko šis maketas NEapima (lieka 2.17 eilėje)
Skaičiuoklės perkėlimas virš „Dažnai perkama kartu", pakuočių perjungiklis top 30 SKU (SensiPlus 900 g / 4 kg / 12,5 kg), nuotraukos aukštis mobiliajame — atskiras maketas po šio.

## 7. Matavimas
Kasos konversija (2.5 piltuvėlis, švari bazė nuo 09-24) prieš/po; Clarity — ar klientai stabteli ties eilute; Merchant Center — `handlingTime` be įspėjimų. Pažado laikymasis: `ps_fakt_siuntos.isvezta_at − date_paid` ≤ 2 d. d. dalis (Ryto sargo lemputė „pažadas" — jei R nori, +30 min).

## 8. Darbai po „daryk" (~1,5 val.)
1. `mu-plugins/petshop-pristatymo-pazadas.php` v1.0 (klasė `Petshop_Pristatymo_Pazadas`; konstantos `TERMINAS_VIENAS='1–2 d. d.'`, `TERMINAS_MISRUS='3 d. d.'`; išjungti `ps_pristatymo_pazadas_isjungtas=1`; €/kg atskirai `ps_kg_isjungta=1`).
2. `petshop-schema-prekes` v1.2 (handlingTime 1–2).
3. `/pristatymas/` 2 sakiniai.
4. Testai: prekė AV (Exclusion 18560), VF (Flexi 26340), ZB (Monge 14805), > 25 kg, „tik kurjeriu", MnM rinkinys, „Neturime"; krepšelis AV-only / VF-only / AV+ZB; apmokėjimas; mini; schema validatorius; Super Cache išvalymas.
