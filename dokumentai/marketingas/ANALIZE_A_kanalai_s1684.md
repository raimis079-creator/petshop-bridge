# ANALIZĖ A — kanalai, Ads spend, CAC, pristatymo subsidija (S1684, 2026-09-14)

Recon: `irankiai/s1684_ma.php` → `analize/s1684_ma.json`. Read-only. Laikotarpis `ps_fakt_uzsakymai`: 2026-09-08…09-14 (46 apmokėti, 6 pilnos dienos) — statistiškai maža imtis, tik pirmas atskaitos taškas; pirmas patikimas mėnuo — spalis.

## 1. Atribucija veikia
`ps_fakt_uzsakymai` turi `kanalas_pirmas`, `kanalas_paskutinis`, `utm_*`, `gclid`, `referer_domenas`. 45/46 užsakymų turi kanalą. „Naujas" = el. pašto hash nėra `ps_ist_fakt_uzsakymai` (5 431 istorinių klientų) ir nesikartoja nuo T-0.

| Kanalas (pirmas) | Užs. | € | Nauji | Nauji € | Grįžę |
|---|---|---|---|---|---|
| mokamas (Google) | 25 | 878 | **14** | 528 | 11 |
| direct | 9 | 488 | 2 | 51 | 7 |
| organika | 6 | 164 | 3 | 28 | 3 |
| referral | 4 | 122 | 1 | 19 | 3 |
| soc. organika | 1 | 46 | 1 | 46 | 0 |
| **Viso** | **46** | **1 699** | **22 (48 %)** | 672 | 24 |

- Nauji klientai ateina beveik vien iš Ads (14/22 = 64 %); direct/organika = grįžtantys. GA4 proxy (PMax 50–60 % užsakymų) patvirtintas — mokamas 54 % užsakymų.
- Tempas: 7,7 užs./d, 3,7 nauji/d → **~110 naujų klientų/mėn.** (visų kategorijų; maisto — mažiau). Q4 N tikslas ~120 maisto — dabartinis tempas jo nesiekia savaime.

## 2. Ads spend (`ps_fakt_reklama`, ads_script nuo 08-20, naktinis 02:01)
| Mėn. | Spend | Ads konversijos (Ads pusė) |
|---|---|---|
| 2026-08 (nuo 08-20) | €370 | 35,8 |
| 2026-09 (01–13) | €564 | 43,8 |

Run-rate **~€43/d ≈ €1 300/mėn.** Kampanijos nuo 08-20: PMax Kačių maistas €425 (didžiausia!), PMax Šunų maistas €287, PMax petshop.lt €126, Search „petshop" (brand) €72, TEST Search €24.
Ads pusės konversijos NEatitinka WC (S1681: ~2 vs 13) — offline įkėlimas dar nepatvirtintas; **iki jo Ads algoritmas mokosi iš neteisingo signalo**.

## 3. CAC (pirmas įvertis, 6 d.)
- Spend 09-09…14 ≈ €260 (43/d × 6) → 25 mokamų užsakymų → **€10/užsakymui**, 14 naujų → **CAC ≈ €19 / naujam klientui** (visų kategorijų; maisto naujam — didesnis, ~€25).
- Vartų B riba: avarinė €35 ✓; mastelio 50 % CM12 = €5–7 (Exclusion/Josera) / €10–12 (Animonda/AV) ✗. **Dabartinis PMax CAC 2–3× viršija mastelio ribą.** Mastelis biudžetu (€1,3 k → €4 k/mėn.) tokiu CAC = pinigų deginimas.
- Kačių PMax ima 50 % spend, o katės — ne 2027 spearhead ir R60 mažesnis → pirmas biudžeto perskirstymo kandidatas.

## 4. Pristatymo subsidija — PATAISYTA (recon `s1684_md`)
**Klientas MOKA.** WC nuo T-0: paštomatas vid. €0,96 (44 užs.), kurjeris €3,30 (6), LP €1,19 (3) → €65 už 53 užs.; vežėjo savikaina vid. €2,24 → grynoji subsidija ~€1,3/užs. (~3,5 % pajamų), ne 5,4 %. `ps_fakt_uzsakymai.pristatymas_ct`=0 — mapping'o ypatybė (taisytina WS3). Istorija `pristatymas_paimta_ct` vid. €8,12 (3 591 užs. nuo 2025-09) — vienetai tikrintini. Toliau — sena (klaidinga) versija:

### 4a. (sena)
- `ps_fakt_uzsakymai.pristatymas_ct` = 0 visuose 46 (klientas nemoka arba laukas nepildomas — patikrinti WC `_shipping_total` vs fakt; free_shipping metodo su min suma nerasta — Venipak/LP tarifai, o ne free_shipping).
- Vežėjo savikaina `ps_fakt_siuntos.kaina_vezejo_ct`: 41 siuntos, **vid. €2,24**, viso €92 → **~5,4 % pajamų** (AOV €36,9). Per 12 mėn. naujam klientui (~2,7 užs.) ≈ €6 iš CM12.

## 5. Istorinis baseline (visi užsakymai, `ps_ist_fakt_uzsakymai`)
2025-09…2026-07: 270–350 užs./mėn., €11,4–14,8 k/mėn. (plokščia); 2026-08: 246 / €9,5 k; 2026-09 tempas: ~230 / €8,5 k. **Atstatymo tikslas Q4 = grįžti į 300 užs. / €12–13 k**, ne augti.

## 6. Ką tai reiškia vartams A (kanalų lentelė Q4)
| Kanalas | N dabar/mėn. | CAC | Statusas Q4 |
|---|---|---|---|
| PMax šunys (feed-only, nauja) | ~40 | ~€19 | **build → test**: iki offline konversijų patvirtinimo biudžetas ne didinti |
| PMax katės | ~30 | ~€19+ | **hold/cut**: ne spearhead, 50 % spend |
| Search brand „petshop" | grįžtantys | — | keep (pigus) |
| Search exact top prekės (Exclusion/Josera/Animonda pavadinimai) | 0 | ? | **test** (S1679 siūlymas, nepriimtas) |
| Organika/SEO | ~15 | 0 | build (skanėstų/veislių puslapiai — lėtas) |
| Referral/soc. | ~5 | 0 | later |
| Prieglaudos/veisėjai | 0 | prekėmis | build Q4 → test Q1 |

Kol CAC > mastelio ribos, N augimas per biudžetą neleistinas — Q4 uždavinys: nuleisti CAC (feed-only PMax + teisingas konversijų signalas + šunų/AV prioritetas) ir pakelti CM12 (R60), tada mastelis Q1.
