# Maisto/skanėstų pirkėjų kohortos — analizė (S1683, 2026-09-14)

Šaltinis: `ps_ist_fakt_uzsakymai` + `ps_ist_fakt_eilutes` (2023-11…2026-08, 9 528 apmokėtų užs.), recon `irankiai/s1683_a.php`, rezultatas `analize/s1683_a.json`. Maisto užsakymas = bent viena eilutė iš kategorijų „Maistas“ / „Skanėstai“ / konservai. Klientas = el. pašto hash.

## 1. Faktai

**Maisto užsakymai = 83 % visų** (7 885 iš 9 528). Klientas be maisto — reta išimtis; v0 apibrėžimas pasitvirtina.

**Naujų maisto klientų yra daug: 100–150/mėn. nuolat** (2025 vid. 115, 2026-01…07 vid. 122; rugpjūtis 81). Tai ~45 % visų mėnesio užsakymų. Prielaida v0 „per mažai naujų“ — tik iš dalies: srautas naujų yra, PMax jį davė 2,5 metų.

**Aktyvi bazė (maisto pirkimas per 90 d.) 2,5 metų stovi 550–680** — ir tai ne dėl mažo įtekėjimo, o dėl ištekėjimo: iš mėnesio pabaigos aktyvių po 3 mėn. lieka **25–29 %**. Bazė = 120 naujų/mėn. × ~5 mėn. vidutinė gyvenimo trukmė.

**Kohortos (pirmas maisto pirkimas), stabilios 10 ketvirčių:**

| | grįžo ≤90 d. | ≤180 d. | ≤365 d. | užs./12 mėn. | €/12 mėn. |
|---|---|---|---|---|---|
| 2024Q1–2025Q4 vid. | 18 % | 24 % | 29 % | 1,7 | €78 |
| 2026Q1 (8 mėn. stebėta) | 17 % | 25 % | — | — | — |
| 2026Q2 (5 mėn.) | 18 % | — | — | — | — |

Naujas maisto klientas vidutiniškai vertas **€78 per 12 mėn.** (1,7 užsakymo). Aštuoni iš dešimties per 3 mėn. neperka antrą kartą.

**Vertės piramidė (klientai nuo 2024-09):**

| užsakymų | klientų | % klientų | pajamos | % pajamų | €/kl. |
|---|---|---|---|---|---|
| 1 | 2 114 | 73 % | €84 k | 40 % | €40 |
| 2–3 | 560 | 19 % | €60 k | 28 % | €107 |
| 4–6 | 143 | 5 % | €31 k | 15 % | €218 |
| 7–12 | 48 | 1,7 % | €18 k | 9 % | €380 |
| 13+ | 21 | 0,7 % | €19 k | 9 % | €894 |

212 klientų (7 %) duoda trečdalį pajamų. 21 klientas — €894 kiekvienas. Tokių reikia ne 21, o 300.

**Kas negrįžta — tokie patys, kaip tie, kurie grįžta.** Pirmas užsakymas: negrįžę AOV €40,7 / grįžę €45,5; maisto dalis 73 % / 76 %; SKU 2,3 / 2,5. Skiriasi tik brendas ir gyvūnas:

| pirmo pirkimo brendas | klientų | grįžo | intervalas (grįžtančių) |
|---|---|---|---|
| Exclusion | 177 | **49 %** | 94 d. |
| Animonda | 126 | 40 % | 60 d. |
| Miamor | 66 | 35 % | 93 d. |
| Hikari | 63 | 35 % | 214 d. |
| Romar | 99 | 32 % | 76 d. |
| Quattro | 108 | 28 % | 72 d. |
| Josera | 467 | **26 %** | 112 d. |
| Royal Canin | 61 | 21 % | 159 d. |
| Ontario | 83 | 20 % | 73 d. |
| Katrinex | 31 | 16 % | — |

Šunys grįžta 35 %, katės 22 %. Josera — didžiausias pirmo pirkimo brendas (31 % naujų) ir vienas blogiausių grįžimu: kainų karo prekė, klientas ateina dėl kainos ir išeina dėl kainos. Exclusion — 5 pardavėjai LT, grįžta pusė.

**Intervalai tarp maisto užsakymų** (3 141 grįžimas): vid. 91 d.; ≤30 d. 27 %, 31–60 d. 29 %, 61–90 d. 15 %, 91–180 d. 16 %, >180 d. 13 %. Pusė grįžimų — per 60 d.; kita pusė — kai maišas seniai baigėsi, t. y. tarpe perka kitur.

## 2. Ką tai reiškia planui

1. **Išlaikymas nėra higiena — tai didžiausias svertas.** Svetainė 2,5 metų dirbo kaip sietas: 120 įeina, 95 išeina. Negrįžę niekuo nesiskiria nuo grįžusių → grįžimą lemia ne kas jie, o kas vyksta po pirkimo (nieko nevyksta). Perkelti g90 iš 18 % į 36 % = dvigubai didesnė bazė su tuo pačiu srautu, be Google.
2. **Vienas naujas maisto klientas vertas €78/12 mėn.** Tai lubos, ką galima mokėti už jį (CPA €11–14 per Ads = 15–18 % — leidžiama; skanėstas €0,65 — juokinga). Kai V pakils iki €130, galima mokėti dvigubai — arba tas pačias išlaidas paversti 2× klientų.
3. **Pirmo pirkimo brendas nulemia likimą.** Į ką nukreipiam naują klientą (Ads, mėginukai, pirmo pirkimo pasiūlymas) — Exclusion/Animonda, ne Josera/Ontario. Ne todėl, kad Josera bloga, o todėl, kad ten neturim jokio pranašumo, ir klientas tai žino.
4. **Katės — atskira bėda:** 528 naujų / 22 % grįžta. Kačių šeimininkai perka konservus dažnai ir mažais kiekiais (Animonda 60 d. intervalas rodo, kad kai grįžta — grįžta dažnai); pirmas krepšelis mažas, siuntimas skaudus. Kačių prenumerata / mėnesio dėžė yra atskiras produktas, ne ta pati logika kaip 12 kg maišui.

## 3. €50 k aritmetika (nuo tikslo atgal)

Metinės pajamos ≈ N (naujų/mėn.) × 12 × V (€/12 mėn.) × 1,25 (senų klientų uodega). Dabar: 120 × 12 × 78 × 1,25 ≈ €140 k/metus — sutampa su faktu. €600 k/metus (€50 k/mėn.) → **N × V ≈ 40 000** (dabar 9 400, reikia 4,3×).

| variantas | N naujų/mėn. | V €/12 mėn. | reikia |
|---|---|---|---|
| tik pritraukimas | 510 | 78 | 4,3× naujų — Ads negalima, sklaida tiek neduos |
| tik išlaikymas | 120 | 333 | 4,3× vertės — 7 užs./metus, nerealu vidurkiui |
| **abu** | **250** | **160** | 2,1× naujų + 2× vertės |
| abu, konservatyvus | 300 | 135 | 2,5× naujų + 1,7× vertės |

V €160 = ~3,3 užs./metus vidutiniam naujam klientui (dabar 1,7): g90 18 → 45 %, intervalas 91 → 60 d. Orientyras egzistuoja savoje bazėje — Exclusion pirkėjai jau dabar ≈ €130–140. Tikslas — kad visa bazė elgtųsi kaip Exclusion pirkėjai, ir kad Exclusion elgtųsi kaip Animonda (60 d.).

N 250 = +130 naujų maisto klientų/mėn. iš sklaidos (ne iš Ads): prieglaudos/veisėjai, referral, įrankiai, video — po 30–40 kiekvienas. Sklaida turi ne pakeisti PMax, o pridėti tiek pat, kiek PMax.

**Trys skaičiai, kuriuos plane matuojam kas mėnesį:** N (nauji maisto klientai), g90 (grįžo per 90 d.), V (kohortos vertė). Viskas kita — išvestinė.

## 4. Kas dar netikrinta

- Kokia dalis naujų klientų ateina iš PMax vs organika/direct — `ps_ist_*` kanalų stulpeliai tušti; įmanoma tik nuo 09-09 (`ps_fakt_uzsakymai.kanalas_pirmas`). Pirmas atsakymas — po mėnesio naujos svetainės faktų.
- Kačių vs šunų V atskirai — reikia, prieš darant kačių produktą.
- Skanėstų pirkėjų (be sauso maisto) grįžimas atskirai.
