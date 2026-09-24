# S1715 — „Turime“, bet nenuperkama: likučių būsenos po T-0 importo (2026-09-24 naktį)

Pradžia: Raimis 22:47 — klientas skambino, dėjo Wonder kraiką į krepšelį, o krepšelyje „prekės nėra“. Bridge `ps-bridge/s1715/a–i.php` (a/b/c/f/g/i read-only; d/e/h — keitimai su bak).

## 1. Kliento simptomas — atkartotas ir uždarytas

- Wonder Sodium grey 10 kg (#17339) ir Levanda 10 kg (#17354): WC būsena `instock`, bet `_stock=0` su „valdyti likutį“, sava/tiekėjo atsarga 0, `ps_sources` eilučių nėra (belcor_tofu — tiekėjas be XML). Puslapis rodė „Turime“ + mygtuką, o `WC()->cart->add_to_cart()` atmetė: „Jūs negalite įdėti tokio produkto kiekio į krepšelį, nes jo tiek neturime (liko 0)“. Su AJAX mygtuku klaida pasimato tik krepšelyje — būtent kliento simptomas. Nekeista nuo T-0 importo (09-07 22:07:52).
- Raimis 22:56: Wonder išparduota → **#17339, #17354 → `outofstock`** (`s1715/d.php`, bak opcija `ps_s1715_wonder_bak`, atstatyti fazė 9). Naršyklėje: „Neturime“, mygtuko nėra, „pranešti, kai bus“ forma rodoma. #17345 (Natural 10 kg) jau buvo „Neturime“ ir turi 1 laukiantį `ps_stock_watch` (09-24 09:01).
- Skenas (`c.php` 1): `instock` + `manage_stock=yes` + `_stock<=0` + be backorders — 31 prekė, bet WC realiai atmeta tik 6 (kitoms 25 `Petshop_AV_Limit::stock_qty` prideda AV atsargą `_own_stock_qty` >0 — tvarkoje). Raimis 23:01 „sutvarkyk ir jas“ → **#12455, #12930 Eukanuba Daily Care 12 kg (ZB, feed'e nėra) ir variacijos #34319, #34324 → `outofstock`** (`s1715/e.php`, bak `ps_s1715_kitos_bak`).
- Variacijų tėvai #15886 (Georplast Villa) ir #17862 (mentelės stovas) turėjo `manage_stock=yes` tėvo lygyje su 0 → tėvas „Išparduota“, nors #15886 variacija kapucino turi 1 vnt. → **tėvams `manage_stock=no` + `WC_Product_Variable::sync_stock_status`** (`s1715/h.php`, bak `ps_s1715_tevai_bak`): #15886 → `instock`, #17862 → `outofstock` (abi variacijos 0). Modelis kaip #16178 (S1704).

## 2. ATVIRA — variacinės prekės su tėvo lygmens likučiu (Raimis 23:13: „dokumentuok, rytoj tvarkysim, prieš tai patikrinsiu“)

Iš 71 publikuotų variacinių prekių **67** turi `_manage_stock=yes` tėvo lygyje ir tėvo `_stock` (T-0 importo suma; visos variacijos likutį valdo pačios — tėvo skaičius negyvas, bet WC `validate_props` pagal jį nustato tėvo `stock_status`: ≤0 → „Išparduota“). Visos `_ps_sandelis=av`.

Siūlomas taisymas (neatliktas): visiems 67 tėvams `set_manage_stock(false)` + `save()` + `sync_stock_status` → tėvo būsena iš variacijų; bak opcija (manage/stock/status kiekvienam), atstatoma viena faze. Prieš tai Raimis patikrina sąrašą (ypač ar tėvo `_stock` kur nors naudojamas — partijos ant tėvo, S1704 c). Pastaba: `set_manage_stock(false)` + `save()` išvalo tėvo `_stock` meta (išsaugoma bak opcijoje).

## 10 tėvų „Išparduota“, nors variacijos turi likutį (prioritetas)

| ID | Prekė | Variacijų su likučiu / visų |
|---|---|---|
| 14987 | Žaislas šuniui - Štanga su juostele | 1 / 1 |
| 15158 | Žaislas šuniui - Kaulas The King, 27,5 cm | 2 / 2 |
| 15161 | Žaislas šuniui - Kaulas T-Rex, 36,5 cm | 4 / 4 |
| 15165 | Žaislas šuniui - Kaulas 19 cm | 2 / 4 |
| 15300 | Žaislas šuniui - Ebi guminis kvepiantis kamuo | 3 / 3 |
| 15303 | Žaislas šuniui - Ebi guminis kvepiantis kamuo | 3 / 3 |
| 15582 | Žaislas gyvūnui - Riedantis kamuolys su skylu | 3 / 3 |
| 15942 | Tualetas katėms BETA su rėmeliu mažas | 2 / 3 |
| 15990 | Transportavimo dėžė / boksas gyvūnams Rocket  | 2 / 2 |
| 15993 | Transportavimo dėžė / boksas gyvūnams Rocket  | 2 / 2 |

## 56 tėvai „Turime“ su tėvo lygmens likučiu (negyvas skaičius; bet koks išsaugojimas gali numušti)

| ID | Prekė | Tėvo `_stock` | Variacijų su likučiu / visų |
|---|---|---|---|
| 14967 | Žaislas šuniui Coockoo Looop 26*15*2 cm - suv | 2 | 2 / 2 |
| 14970 | Žaislas šuniui Coockoo Hangry Crackle - čežan | 3 | 3 / 3 |
| 14979 | Žaislas šuniui Coockoo Bottle Sqeaker, 27 cm, | 2 | 2 / 2 |
| 15042 | Žaislas šuniui - Skraidantis bumerangas | 5 | 3 / 3 |
| 15357 | Žaislas šuniui - Coockoo Shoot kamuolys, 7.8  | 6 | 3 / 3 |
| 15367 | Žaislas šuniui - Coockoo Lily Ruber Butterfly | 1 | 1 / 1 |
| 15412 | Žaislas katei, interaktyvus su dviem kamuoliu | 5 | 3 / 3 |
| 15425 | Žaislas katei negriūnantis su plunksnomis ir  | 11 | 3 / 3 |
| 15484 | Žaislas katei - Plastikinis kamuoliukas, 4 cm | 34 | 4 / 4 |
| 15870 | Uždaras tualetas katėms, Vicky, Georplast | 4 | 4 / 4 |
| 15874 | Uždaras tualetas katėms, Roto-Toilet, Georpla | 4 | 3 / 4 |
| 15878 | Uždaras tualetas katėms, Galaxy Jumbo, Georpl | 5 | 3 / 4 |
| 15882 | Uždaras tualetas katėms, Galaxy Deluxe, Georp | 8 | 4 / 4 |
| 15914 | Tualetas katėms su rėmeliu vidutinis, Lettier | 21 | 6 / 7 |
| 15917 | Tualetas katėms su rėmeliu didelis, Lettiera  | 32 | 4 / 4 |
| 15935 | Tualetas katėms Shuttle, 57 cm | 27 | 4 / 4 |
| 16036 | Skraidanti lėkštė šunims Frisbee Roger, 17 cm | 12 | 3 / 3 |
| 16039 | Skraidanti lėkštė medžiaginė, 24,5 cm skersme | 3 | 2 / 2 |
| 16168 | Semtuvėlis sausam ėdalui semti | 19 | 4 / 6 |
| 16172 | Semtuvėlis kačių kraikui, mažas, Georplast Si | 30 | 3 / 3 |
| 16175 | Semtuvėlis kačių kraikui, didelis, Georplast  | 36 | 7 / 7 |
| 16185 | Semtuvėlis kačių kraikui, Georplast Diapason | 54 | 5 / 5 |
| 16189 | Semtuvėlis ekskrementams Pick up su 5 maišeli | 16 | 4 / 4 |
| 17305 | Negriūnantis besišypsantis kiaušinis | 7 | 4 / 4 |
| 17570 | Lėto valgymo dubenėlis - Honey, 32 x 32 x 6 c | 6 | 4 / 4 |
| 17572 | Lėto valgymo dubenėlis - Cactus, 32 x 32 x 7  | 9 | 4 / 4 |
| 17805 | Kilimėlis prie kačių tualeto Aladdin | 11 | 3 / 3 |
| 17912 | Kamuoliukas | 13 | 3 / 3 |
| 17916 | Kampinis tualetas katėms Shuttle Big | 13 | 3 / 4 |
| 17920 | Kampinis tualetas katėms Shuttle, 49 cm | 19 | 4 / 4 |
| 18375 | Guolis / slėptuvė gyvūnams su pagalvėle, Duck | 6 | 4 / 4 |
| 18725 | Dubenėlis gyvūnui, sulankstomas, 16,5 x 14,5  | 8 | 3 / 3 |
| 18730 | Dubenėlis gyvūnui, sulankstomas, 15 x 12 x 4, | 9 | 3 / 3 |
| 18735 | Dubenėlis gyvūnui, kampinis, 24,5 x 19 x 9,5  | 9 | 3 / 3 |
| 18739 | Dubenėlis gyvūnui, kampinis, 20 x 15 x 8 cm,  | 9 | 3 / 3 |
| 18747 | Dubenėlis gyvūnui su minkštu kilimėliu, Volca | 10 | 4 / 4 |
| 18751 | Dubenėlis gyvūnui su minkštu kilimėliu, Volca | 10 | 4 / 4 |
| 18755 | Dubenėlis gyvūnui su minkštu kilimėliu, Volca | 9 | 4 / 4 |
| 18759 | Dubenėlis gyvūnui su minkštu kilimėliu, Volca | 10 | 4 / 4 |
| 18763 | Dubenėlis gyvūnui su minkštu kilimėliu, Soft  | 3 | 3 / 4 |
| 18768 | Dubenėlis gyvūnui su minkštu kilimėliu, Soft  | 8 | 4 / 4 |
| 18773 | Dubenėlis gyvūnui su minkštu kilimėliu, Soft  | 6 | 4 / 4 |
| 18778 | Dubenėlis gyvūnui su minkštu kilimėliu, Soft  | 7 | 4 / 4 |
| 18783 | Dubenėlis gyvūnui gerti, su dozatoriumi | 27 | 7 / 7 |
| 18787 | Dubenėlis gyvūnui dvigubas su minkštu kilimėl | 11 | 4 / 4 |
| 18792 | Dubenėlis gyvūnui dvigubas su minkštu kilimėl | 3 | 2 / 3 |
| 18795 | Dubenėlis gyvūnui dvigubas su minkštu kilimėl | 18 | 4 / 4 |
| 18800 | Dubenėlis gyvūnui dvigubas su minkštu kilimėl | 9 | 4 / 4 |
| 19125 | Automatinė šėrykla/girdykla gyvūnui (Mini Eat | 24 | 4 / 4 |
| 19134 | Automatinė šėrykla/girdykla gyvūnui (Eat and  | 4 | 3 / 4 |
| 19137 | Automatinė šėrykla/girdykla gyvūnui (Eat and  | 19 | 4 / 4 |
| 19249 | Antkaklis katei su varpeliu, 18-30cm / 10mm | 2 | 2 / 2 |
| 19253 | Antkaklis katei su varpeliu ir širdelėmis, 24 | 4 | 2 / 2 |
| 19262 | Antkaklis katei su varpeliu | 39 | 3 / 3 |
| 19265 | Antkaklis katei blizgantis su varpeliu, 22-30 | 6 | 2 / 2 |
| 19268 | Antkaklis katei atspindintis su varpeliu, 20- | 4 | 2 / 2 |

## 3. Pamokos / kas dar
- T-0 importas paliko `instock` su likučiu 0 (simple) ir tėvo lygmens `manage_stock=yes` (variable) — WC pats to nekeičia, kol prekė neišsaugoma. Siūlymas: Ryto sargui pridėti patikrą „instock, bet `has_enough_stock(1)=false`“ (be AV atsargos) — naujų neturėtų atsirasti, bet pagautų importų palikimą.
- `ps_sources` belcor_tofu prekėms eilučių nėra — Belcor be XML; likutis = WC `_stock`/`_own_stock_qty` rankomis.
- Įrankiai: `s1715/c.php` fazė 1 — pakartotinis skenas (read-only); `d/e/h.php` fazė 9 — atstatymai.
