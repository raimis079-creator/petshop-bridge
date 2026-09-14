# ANALIZĖ B — savikainos mapping ir proxy CM (S1684, 2026-09-14)

Recon: `irankiai/s1684_mb.php`, `s1684_mb2.php` → `analize/s1684_mb.json`, `s1684_mb2.json`. Read-only.

## 1. Kodėl S1683 sujungimas grąžino 0
`_ps_savikaina` meta NEEGZISTUOJA. Savikaina WC gyvena keturiose vietose:
| Šaltinis | Įrašų | Kas |
|---|---|---|
| `postmeta._cost_price` | 1 017 | AV prekės: excel importai (06-10, 08-17), Quattro kainoraštis 09-10, ranka 221 |
| `ps_sources.cost_net` | 3 304 | dropship (vf/zb) tiekėjo kaina be PVM |
| `postmeta._vf_cost/_zb_cost` | 2 324 | tas pats kaip sources, dubliuota |
| `ps_partijos.savikaina_eur` | 831 | faktinė gavimo kaina (AV), dažnai mažesnė už VF (HYPS06: 34,00 vs 37,49) |

Gyvai `ps_fakt_eilutes.savikaina_ct` pildoma (92/93, šaltinis `pardavimai`) — `petshop-faktai.php` ima iš `_ps_savikaina_saltinis` meta prekės eilutėje.

## 2. Sujungimas su istorija
`ps_ist_fakt_eilutes.preke_id` = WC product ID (1 327/1 416 sutampa), `variacija_id`=0, `gtin` tuščias. Prioritetas `_cost_price` → `sources.cost_net` → sku→pid fallback.
**Padengimas maisto eilučių 2025-09…2026-08: 97,5 % pajamų (€101 324 / €103 951).** Neapdengta: senos Ontario/Romar/Haumiau/Prins pozicijos (po €50–130 kiekviena).

**Svarbu:** `kaina_ct` ir istorijoje, ir `ps_fakt` yra BE PVM (`pvm_ct` atskirai; istorijoje pvm_ct=0). Marža skaičiuojama `1 − sav/kaina_ct`. S1683 ir ankstesni „kaina_ct − pvm_ct" skaičiavimai buvo klaidingi (dvigubas PVM nuėmimas).

## 3. Bendroji marža pagal brendą (dabartinė savikaina × 12 mėn. istorija, be PVM)
| Brendas | Pajamos 12 mėn. | Dalis | Marža |
|---|---|---|---|
| Exclusion | €27 378 | 26 % | **16,7 %** (AV partija → ~28 %) |
| Josera | €22 848 | 22 % | **17,6 %** |
| Animonda | €13 065 | 13 % | 33,3 % |
| Quattro | €7 546 | 7 % | 10,2 % |
| Royal Canin | €4 430 | 4 % | 13,4 % |
| Ontario / Hikari / Miamor / Romar | €3,3–3,8 k kiekv. | 14 % | 36–40 % |
| Ambrosia | €3 161 | 3 % | 29,5 % |
| Gnatek / Katrinex / Duvo / 4dogs (skanėstai) | €0,5–1,7 k | — | 47–55 % |
| **Šuo iš viso** | €75 277 | 72 % | **21,9 %** |
| **Katė iš viso** | €24 054 | 23 % | 24,3 % |
| **Maistas+skanėstai iš viso** | €103 951 | 100 % | **~23 %** |

## 4. Proxy CM12 (per naują maisto klientą, bazinis V12 €115 su PVM)
- Pajamos be PVM: €95.
- Bendroji marža: naujų klientų mišinys svertas į Exclusion/Josera (49 %/26 % kohortų) → **~19–20 %** (ne 23 %) → **€18–19**.
- Pristatymo subsidija: Venipak paštomatas €1,58 savikaina / užsakymui; ar klientas moka — `ps_fakt_uzsakymai.pristatymas_*` (recon A). ~2,7 užs./12 mėn. → €4–8 jei nemokamas.
- Paysera ~1–1,5 % → ~€1.
- **Proxy CM12 ≈ €10–14** (Exclusion/Josera pirkėjas) · **€20–25** (Animonda/Ontario/Hikari pirkėjas) · **€30+** (skanėstų/AV pirkėjas).

## 5. Pasekmės vartams B (CAC lubos)
- Avarinė CAC ≤ 30 % V12 = **€35** — laikosi.
- Mastelio CAC ≤ 50 % proxy CM12 = **€5–7** Exclusion/Josera naujam klientui, **€10–12** Animonda/AV — **tai realus rėmas**, ne €35. PMax CAC istoriškai (Ads €/naujas klientas) tikrinti recon A.
- Išvada plane: N mastelis mokamais kanalais ekonomiškai laikosi tik jei (a) naujas klientas kreipiamas į 30 %+ maržos brendus / AV partijas, arba (b) V12 auga per R60 (grįžęs ≤60 d. klientas €185–209 → CM12 €25–35), arba (c) skanėstų priedas užsakyme kelia mišinio maržą. Vieno sverto (PMax + Exclusion) ekonomika neatsiveda.
- Nuo 2027 Q2 faktinis CM12 iš `ps_fakt_eilutes.savikaina_ct` (jau pildoma) — formulė `1 − sav/kaina_ct`, NE minus pvm.

## 6. Kas taisytina (ne šioje sesijoje)
- `_cost_price` neturi 6 iš top-20 senų SKU (Ontario/Romar/Prins/Haumiau) — Raimiui pildyti arba imti iš partijų.
- `petshop-analitika-langas.php` / ankstesni recon'ai su `kaina_ct − pvm_ct` — peržiūrėti (S1683 brendų maržos neteisingos).
