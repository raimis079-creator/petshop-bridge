# V12 mechanika — 1→2→3→4, intervalai, hazard, top klientai (S1683 b, 2026-09-14)

Šaltinis: `ps_ist_fakt_*`, recon `irankiai/s1683_b.php`, rezultatas `analize/s1683_b.json`. Imtis: pirmas maisto pirkimas 2024-01…2025-08 (2 650 klientų, visi stebėti pilnus 12 mėn.). Savikainos per WC SKU sujungti nepavyko (0 SKU) — CM12 lieka tik iš `ps_fakt` nuo 09-09.

## 1. Grandinė (per 12 mėn. nuo pirmo pirkimo)

| | visi | šuo | katė |
|---|---|---|---|
| klientų | 2 650 | 1 395 | 1 078 |
| 2-as pirkimas (p2) | 30 % | 35 % | 24 % |
| 3-ias, jei buvo 2-as (p3\|2) | 49 % | 53 % | 42 % |
| 4-as, jei buvo 3-ias (p4\|3) | 56 % | 63 % | 48 % |
| intervalas 1→2 (mediana / ≤60 d.) | 69 d. / 44 % | 66 / 46 % | 69 / 46 % |
| intervalas 2→3 | 60 d. / 51 % | 57 / 53 % | 63 / 49 % |
| intervalas 3→4 | 49 d. / 64 % | 55 / 58 % | 35 / 81 % |
| AOV 1 / 2 / 3+ | €43 / 47 / 47 | €47 / 50 / 50 | €42 / 45 / 39 |
| **V12** | **€78** | **€93** | **€64** |

Kiekviena grandis stiprėja: kas nusipirko tris kartus, ketvirtą perka 56 %, intervalas trumpėja iki 49 d. Silpniausia grandis — pirmoji: 70 % niekada nepadaro antro pirkimo. Katė silpnesnė kiekvienoje grandyje (24/42/48 vs 35/53/63) ir AOV 3+ krenta (€39) — konservų pirkėjas perka dažnai, bet mažai.

Formulė (patikrinta, duoda €78): V12 = AOV × [1 + p2·(1 + p3·(1 + p4·(1 + …)))].

## 2. Hazard: kada įvyksta antras pirkimas

Dienos iki 2-o pirkimo (visi, 786 grįžusių): pikas **20–50 d.** (30–40 d. daugiausia), po 60 d. kreivė žema ir plokščia iki metų pabaigos. **Antro piko nėra** — „grįžo po 100+ d." nėra atskiras segmentas, tai ilga uodega. Josera kreivė plokštesnė (30–90 d. tolygiai) — pirkėjas be ritmo; Animonda koncentruota 10–50 d.

Išvada lifecycle'ui: langas — **20–50 diena**. Kas negrįžo iki 60 d., didžiąja dalimi prarastas (hazard po 60 d. ~0,5 %/10 d.). Priminimas Josera „84 dieną" — per vėlu, ten jau niekas nevyksta. R60 (grįžo ≤60 d.) dabar **13 %** — tai tikslesnis KPI nei R90.

## 3. Top klientai vs populiacija (pirmas pirkimas 2024-01…2025-08)

| grupė | klientų | dalis | užs./12 mėn. | V12 |
|---|---|---|---|---|
| vienkartiniai | 1 864 | 70 % | 1 | €43 |
| vidutiniai (2–4) | 641 | 24 % | 2,5 | €118 |
| **top (5+)** | **145** | **5,5 %** | **7,7** | **€350** |

Pirmas užsakymas top klientų **nieko neišduoda**: AOV1 €44 vs €43 (vienkartinių), maisto dalis 77 vs 73 %, SKU 3,3 vs 2,2, krepšelis ≥€60 — 17 vs 18 %. Skiriasi:
- gyvūnas: šuo 74 % (vienkartinių — 48 %);
- pirmo pirkimo brendas: Animonda 28 %, Exclusion 24 %, Josera 22 % (vienkartinių: Josera 41 %, Exclusion 8, Animonda 8);
- **antro pirkimo laikas: mediana 46 d., 75 % per ≤60 d.** (vidutinių — 111 d., 37 %);
- tas pats brendas antrame pirkime 88 %.

Signalas, kuris atpažįsta būsimą €350 klientą, atsiranda ne pirmame užsakyme, o **antrame, jei jis įvyksta per 60 d.** Tai ir yra lifecycle tikslas: ne „antras pirkimas kada nors", o antras pirkimas iki 60 d. Ir 88 % perka tą patį brendą — antro pirkimo pasiūlymas turi būti „tas pats maišas", ne „pažiūrėkit, ką dar turim".

## 4. Ką tai daro su €160

V12 = grupių svertinis vidurkis: 0,70·43 + 0,24·118 + 0,055·350 = €77. Norint kito V12, reikia perkelti klientus tarp grupių:

| scenarijus | vien. | vid. | top | V12 | 250 naujų × 1,25 |
|---|---|---|---|---|---|
| dabar | 70 % | 24 % | 5,5 % | €77 | €24 k |
| R90 25 % („kažką padarėm") | 62 % | 30 % | 8 % | €90 | €28 k |
| R90 35 % („gerai") | 50 % | 35 % | 15 % | €115 | €36 k |
| R90 45 % („proveržis") | 40 % | 35 % | 25 % | €146 | €46 k |
| €160 | 35 % | 35 % | 30 % | €162 | €51 k |

**€160 reiškia, kad 30 % naujų klientų tampa 5+ užsakymų/metus klientais — 5,5× dabartinės dalies.** Su „geru" scenarijumi (R90 35 %, V12 ≈ €115) ir 250 naujų gaunasi ~€36 k/mėn. €50 k tada reikia N ≈ 350 arba V12 ≈ €146 (proveržis).

Sąžiningas rėmas planui: bazinis kelias iki 2028-01-01 — N 250 + V12 €115–120 → **€35–38 k/mėn.**; €50 k pasiekiamas, jei (a) N 330+ arba (b) top dalis ≥25 %. Abu — ne „gerai padirbėjus", o pakeitus verslo struktūrą (šunys + ciklinis brendas + antras pirkimas per 60 d.). Tai turi būti plane įvardinta kaip „stretch", ne kaip bazinė prognozė.

## 5. Kas iš to seka plano svertams

1. **Vienas KPI virš visų — R60** (antras maisto pirkimas per 60 d.): 13 % → 25 % 2027 Q2 → 35 % Q4. Tai vienintelis skaičius, kuris tiesiogiai perkelia klientus iš „vienkartinių" į „top".
2. **Lifecycle langas 20–50 d., tas pats brendas.** Pet Profile svorio skaičiavimas — antra iteracija; pirma — brendo hazard pikas (Animonda 15–40 d., Exclusion 40–70, Josera 30–60).
3. **Šuo + ciklinis brendas** (Animonda, Exclusion) yra top klientų medžiaga; pritraukimas (PMax, veisėjai) turi eiti ten. Josera — 41 % vienkartinių: neinvestuoti į pirmą pirkimą, investuoti tik į antrą.
4. **Katės — atskiras produktas** (V12 €64, krentantis AOV): mėnesio konservų dėžė / prenumerata su fiksuota kaina, ne 12 kg logika. Be to kačių 44 nauji/mėn. lieka €64 klientais.
5. AOV — ne svertas (€43→47→47 stabilus per visus etapus); svertas — dažnis.
