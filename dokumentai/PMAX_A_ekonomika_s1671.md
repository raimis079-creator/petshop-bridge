# PMax pertvarka — A etapas: ekonomika (S1671, 2026-09-11)

Šaltiniai: katalogas (2639 publish, `_price`, `_cost_price`→`_vf_cost`→`_zb_cost`, `product_brand`, `product_cat`, `_ps_sandelis`) — `analize/s1671_e1.json`; istorija eShoprent 12 mėn. (2025-09-08…2026-09-08, `ps_ist_*`, 3615 įvykdyti užs.) — `analize/s1671_e2.json`; Ads 30 d. (`analize/s1671_pmax_turtas.json` stat_30d). Prekių lygio failai: `uploads/ps-backups/s1671_prekes_ekonomika.json`, `s1671_istorija_prekes.json`.

## 1. Paklausa (12 mėn.)
- 3615 užs., €149 960, AOV €41,48, 2236 klientai, 27 % grįžo (vid. 1,62 užs./klientui). ~300 užs./mėn., stabiliai.
- Krepšelis: <€30 — 33 % užs. / 14 % pajamų; €30–50 — 39 % / 36 %; €50–80 — 21 % / 33 %.
- Šunims 76 k (51 %), katėms 24 k, kita 6 k, nesusieta su WP prekėmis ~14 k (127 prekės + 286 eil.).
- Sausas maistas šunims 53,5 k (36 % pajamų) — Exclusion 25,7 k, Josera 21,2 k, Quattro 7,5 k, Ambrosia 3,3 k. Konservai šunims 10 k (Animonda), skanėstai 7,6 k, sausas katėms 9 k, konservai katėms 7,3 k.
- Sandėliai: AV 49 k (marža 34 %), VF dropship 43,5 k (marža 19 %), Quattro 7,5 k (20 %), Ambrosia 3,3 k (30 %).

## 2. Marža (nuo kainos be PVM, katalogo svertinė)
| Segmentas | Pajamos 12 mėn. | Marža % | Marža € |
|---|---|---|---|
| Sausas šunims (VF: Exclusion/Josera) | 53,5 k | 17–21 | 9,2 k |
| Sausas katėms (Josera, RC) | 9,0 k | 15–18 | 1,3 k |
| Konservai šunims (Animonda) | 10,1 k | 34 | 2,8 k |
| Konservai katėms (Miamor, Animonda) | 7,3 k | 37 | 2,2 k |
| Skanėstai šunims (Romar, Hau&Miau) | 7,6 k | 39 | 2,2 k |
| Kita (Hikari, kraikai, aksesuarai) | 6,3 k | 43 | 2,2 k |
| Ambrosia | 3,3 k | 30 | 0,8 k |
Katalogo pasiskirstymas: 10–20 % — 304 prekės; 20–30 % — 1292; 30–40 % — 731; 40 %+ — 209. Be savikainos 101.

## 3. Lūžio ROAS (pajamos su PVM / Ads išlaidos)
Modelis: kontribucija €1 pajamų = marža/1,21 − fulfillment/AOV. Fulfillment prielaida €3,00 gryno/užs. (siunta ~€3 + pakuotė €0,40 + mokėjimas 1 % − kliento apmokėta ~€1,50) — **tikslinti su Raimiu**. AOV €41,5 → 7,2 %.
| Marža | Kontribucija /€ | Lūžio ROAS 1-as užs. | Lūžio ROAS su pakartotinumu ×1,6 |
|---|---|---|---|
| 17 % | 6,8 % | **14,7** | 9,2 |
| 20 % | 9,3 % | **10,7** | 6,7 |
| 25 % | 13,4 % | 7,5 | 4,7 |
| 30 % | 17,6 % | 5,7 | 3,6 |
| 35 % | 21,7 % | 4,6 | 2,9 |
| 40 % | 25,8 % | 3,9 | 2,4 |

## 4. Dabartinė PMax realybė (30 d.)
- Šunų: €602 → 50 konv., €2141 → ROAS 3,55. Katėms: ~€600 → €1897 → ROAS ~3,2. tROAS nustatyti 3,84/3,64.
- Prekių mišinys reklamoje = paklausos mišinys (60 % sausas maistas, marža ~19 %) → kontribucija ~€1200×0,09 ≈ **€110 iš €1200 išlaidų → ~−€1100/mėn.** Tai „tragedijos“ skaičius. Struktūra teisinga tik jei ROAS ≥ 7–10, o toks su €20/d generic PMax nepasiekiamas.
- Pastaba: konversijų signalas neišsamus (sutikimai) — realus ROAS gali būti iki ~1,3–1,5× didesnis; vis tiek nesiekia lūžio.

## 5. Sprendimai (mano, A etapo)
1. **Maržos pakopos → `custom_label_0` feed'e**: A ≥35 %, B 28–35 %, C 20–28 %, D <20 %, X be savikainos. PMax listing groups gauna tik A+B (+ C su atskiru tROAS). D (Exclusion/Josera/RC sausas) — **ne PMax**; tik Brand/Search tikslios frazės (jau €8/d brand kampanija) ir esamų klientų kanalai (Sender, prenumerata) — ten CAC ≈ 0.
2. **Kampanijos (biudžetai nekeičiami)**: PMax „Šunims“ €20/d → asset grupės: „Konservai ir šlapias maistas šunims“ (Animonda, Exclusion konservai, 34 %), „Skanėstai“ (39 %), „Aksesuarai/priežiūra“ (31 %). PMax „Katėms“ €20/d → „Konservai/gėrimai katėms“ (Miamor, Animonda, Churu 37 %), „Kraikai, tualetai, draskyklės“ (30–33 %), „Akvariumas/Hikari“ (42 %, jei nėra kur kitur). Brand €8/d — be pokyčių, pridėti Exclusion/Josera/Quattro brand+produkto frazes (aukšta intencija, pigus paspaudimas).
3. **tROAS**: startas ties tuo, ką Google dabar pasiekia (3,6–3,8) su A+B mišiniu → lūžis ~4,5–5,5; kėlimas +15 % kas 7–10 d. iki 5,5–6. Prielaida: keičiant prekių mišinį, ne tROAS, ROAS auga savaime, nes vienetui pelno reikia mažiau pajamų.
4. **Naujų klientų pirkimas**: 27 % grįžta — LTV ×1,6 leidžia lūžį ~4,7 ties 25 % marža. PMax „New customer acquisition“ režimas su vertės priedu — įvertinti D etape.
5. Duomenų skylės uždaryti prieš D: 101 prekė be savikainos (kurios parduodamos — prioritetas), `ps_fakt_eilutes.gyvunas` tuščias po T-0 (fakt variklis nepildo), VF eilučių marža −€5 po T-0 (patikrinti savikainą/siuntimo kaštą dropship kelyje).

## 6. Iš Raimio (2 skaičiai + 1 patvirtinimas)
- Vidutinė siuntos savikaina mums: Venipak paštomatas / LP / kurjeris (€ be PVM).
- VF dropship: ar VF ima pristatymo/handlingo mokestį už mūsų kliento siuntą; kiek.
- Sutikimas su 5.1: sausas maistas D pakopos (Exclusion/Josera/RC) iš PMax išimamas.
