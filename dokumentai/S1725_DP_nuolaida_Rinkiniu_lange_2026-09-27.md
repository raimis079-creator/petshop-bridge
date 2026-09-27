# S1725 · S1722 patikra + DP pakų „Nuolaida %" perkelta į langą „Rinkiniai" (2026-09-27 15:05–17:30)

## 1. S1722 patikra gyvai (15:20, read-only `s1725/a.php`, `a2.php`)
- `petshop-dp-kainos` v1.2.1 (md5 8fe9b0c6…) veikia; 25/25 pakų kaina = formulė, katalogo (lookup) kaina sutampa, klaidų 0.
- Naktinis 09-27 05:10: 25 pakai, pakeista 0; kitas 09-28 05:10. Ryto sargo `dp_kainos` žalia.
- Feed'ai 04:30: Google 2 166 prekės, kaina24/kainos.lt — pakų nėra nė viename. `ps_feeds_ids()` 2 164.
- `ps_dp_nuolaidos` opcija tuščia → naudojami kodo numatytieji (sausas 3, Josera 2,5, konservai 3,5, skanėstai 10, kraikas 10).
- php_error.log: paskutinis fatal — incidentas 09-26 21:41 LT, po to naujų nėra. Užsakymų su DP pakais po pakeitimo 0.

## 2. Problema
S1722 „Esami pakai — nuolaida %" lentelę įdėjau į seną formą **Produktai → ➕ Daugiau=pigiau** (snippet 572). Raimio taisyklė: viskas — lange **Katalogas → Rinkiniai** (`admin.php?page=ps-rinkiniai`, `mu-plugins/petshop-rinkiniai.php`). Tas langas DP pakus jau valdė (kūrimas/redagavimas, kiekis ×N, šiukšlinė), bet apie % nežinojo → ranka pakeista kaina būtų grįžusi į formulę (įrašant arba naktį).

## 3. GYVAI 17:27 — `petshop-rinkiniai.php` v1.45
md5 b90c5206… → **c242f519…**, bak `ps-archyvas/petshop-rinkiniai.php.bak_s1725`, deploy `s1725/f.php` (1 dry / 2 deploy / 3 572 off / 4 testai / **9 atstato viską**), repo `deploy/petshop-rinkiniai-v1.45.php`.
- **Forma (DP pakas):** laukas „Nuolaida % (Daugiau=pigiau)". Įrašytas → „Pako kaina" skaičiuojama (kiekis × bazinės reguliari × (1 − %), „…9" ct), laukas tik skaitomas, seka bazinę per `Petshop_DP_Kainos`. Tuščias → kaina ranka, meta `_dp_nuolaida_proc` ištrinama, sinchronizacija neliečia. Naujam pakui % pasiūlomas pagal bazinės kategoriją (`numatytoji_proc`), kol laukas neliestas. Kiekį ×2 → ×3 keisti ten pat — kaina persiskaičiuoja. Serveris % režime kainą skaičiuoja pats (ne iš formos), akciją — iš bazinės akcijos. Validacija 0–60.
- **Sąrašas:** DP eilutėje po „Daugiau=pigiau" — „−3 % · seka bazinę" arba „kaina ranka".
- Formoje DP pakui rodoma reguliari kaina (`_regular_price`), ne `_price`.

## 4. Snippet 572 „➕ Daugiau=pigiau" IŠJUNGTAS (17:27)
`active` 1 → 0 (bak opcija `ps_s1725_snip572_active`); kodas DB lieka. Priklausomybių kitur nėra (funkcijos `petshop_dp_*` ir AJAX `petshop_dp_search/create/proc` naudojami tik jame). Meniu punktas dingo, senas URL → 403.

## 5. Testai (`f.php` 4, per admin-ajax su laikina admin sesija, po to sunaikinta)
- T1 naujas pakas 3 × #18590 (21,95), 3 % → 63,89 ✓, meta 3.
- T2 % tuščias, kaina 60 → 60, meta nėra, sync „be_proc" ✓.
- T3 kiekis 2, 2,5 % → 42,79 ✓ = formulė.
- T4 99 % → klaida ✓. Testinis juodraštis #36333 ištrintas (įvykių žurnale liko 3 įrašai „dp_pakas_…").
- Forma #36002: % 3, kaina 42,59 ✓; sąrašas: 2×3 %, 21×10 %, 2×3,5 % ✓; heartbeat 200 (front + admin-ajax); DP suvestinė žalia.

## Liko
- Raimis: patikra akimis lange Rinkiniai.
- Produktai meniu dar yra „➕ Sukurti rinkinį" (snippet 539) ir „➕ Susidėjimo rinkinys" (550) — galimai dubliuoja Rinkinius; tikrinti tik Raimiui pasakius.

## 6. DP generatorius — 55 pakai 2× (savas sandėlis AV) GYVAI 18:07
R sprendimai (17:41 „su viskuo sutinku"): tik AV (dropship ZB/VF — po savaitės, jei AV be bėdų), noindex, juodraščiai → peržiūra → publikuoti.
- Kandidatai AV: 65, iš jų 10 praleista (likutis 0–1). Sukurta **55** per Rinkinių langą (`ps_rink_issaugoti`, `s1725/h2.php` 1 dry / 2a-2c kurti / 3 patikra / 5 publikuoti / 6 patikra / **9 visus į šiukšlinę**; žymė `_ps_s1725_gen=1`): „2 vnt. {bazinė}", SKU `DP-{bazinės SKU}-2`, % pagal kategoriją (visi 3 %), `rank_math_robots=noindex`, kategorijos bazinės + DAUGIAU=PIGIAU (91), nuotrauka bazinės, svoris ≤ 20 kg.
- Publikuota 18:07 → šeimų automatas prijungė visus 55 prie bazinių šeimų. Kainos 55/55 = formulė; DP sinchronizacija dabar 80 pakų, žalia.
- Dydžių lentelė ✓: pvz. RC Urinary Care „2 kg · 2 × 2 kg DP pakas 49,99 € · 10 kg", Quattro SB „1,5 kg · 7 kg · 7 kg × 2 (geriausia kaina už kg)".
- Radinys Rinkinių lange: tuščias SKU → „SKU jau naudojamas (#34934)" (`wc_get_product_id_by_sku('')`); formoje SKU pildomas JS, todėl rankiniu darbu nepasitaiko.
- 40 pakų `pa_pakuotes_dydis` = bazinės („2 kg"), ne „2 × 2 kg" (terminų nėra, langas jų nekuria) — lentelė rodo teisingai.

## 7. `petshop-dydziai-katalogas` v1.2 GYVAI 18:20
Po publikavimo kai kur pakas tapo kortelės „veidu" (0 pardavimų lygiosios → didesnis kg): filtras 2 kg rodė „2 vnt. RC Indoor", kategorijoje „2 vnt. Prins Diet", Quattro gamintojo psl. „2 vnt. Quattro Junior". Pataisa: DP pakas veidu netampa, kol šeimoje yra tinkamas ne pako narys (DP kategorijoje — kaip anksčiau). md5 dc4970e7 → **878ff6c4**, bak `ps-archyvas/petshop-dydziai-katalogas.php.bak_s1725`, `s1725/l.php` 1/2/3/9, repo `deploy/petshop-dydziai-katalogas-v1.2.php`; Super Cache išvalytas. Patikra: filtras 2 kg, sausas katėms, Quattro, paieška „quattro" — pakų kortelių 0; DP kategorija — pakai ✓; heartbeat 200.

## Liko
- ~10-04: AV pakų pardavimai → sprendimas dėl dropship (ZB 112, VF 60).

## 8. Klaida: „AV" skirstymas (18:28) ir 2 partija — VISŲ sandėlių (R 18:31 „daryk DP visų sandėlių prekėms")
- `Petshop_Rinkiniai::sandelis()` = „be VF/ZB žymės → AV" — NETIKSLU: rankiniai tiekėjai (Ambrosia — dropship `ambrosia`, Prins — ne AV) jam atrodo AV. Tikras šaltinis — `ps_sources` (stulpeliai product_id, source, stock_qty…). Pirmos partijos „tik AV" skirstymas buvo klaidingas; R neinformuotas aiškiai.
- Maršrutas patikrintas (`s1725/n.php`): variklis DP pakus tvarko per bazinę — AV pakai nurašo bazinę ×N (#1160, #1163), VF pakai „tiesiai" tiekėjui (#1130, #1181, `_ps_source=vf`, „dropship pirma … DP pa…"); 6 užsakymai completed.
- 2 partija (`s1725/h3.php`, žymė `_ps_s1725_gen=2`, 9 fazė — tik šios partijos pakai į šiukšlinę): kandidatai 182, praleista 27 (likutis 0–1), sukurta ir 18:49 publikuota **155** (ps_sources: zb 103, av+vf 24, vf 28 — Josera, Exclusion, Farmina, Monge ir kt.). Kainos 155/155 = formulė, noindex 155, šeimose 155; DP sinchronizacija 235 pakai, žalia; heartbeat 200.
- Patikra: Josera/Farmina/Monge/Exclusion gamintojų psl. — pakų kortelėmis 0; lentelės pvz. Monge 2,5 kg · 2×2,5 · 7,5 · 2×7,5 kg (geriausia €/kg).
- Pastebėjimas: kai kur didesnis maišas brangesnis už kg (Farmina N&D 5 kg 15,86 €/kg > 2 kg 15,60; Family Dog 15 kg 2,15 > 10 kg 1,54) — ZB kainos, neliesta.
- Viso DP pakų: 25 seni + 55 + 155 = 235.
