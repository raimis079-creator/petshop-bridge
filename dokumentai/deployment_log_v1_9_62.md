# deployment_log v1.9.62 — S1674 (2026-09-12, naktis/rytas)

Ankstesnis: v1_9_61 (S1673). Gyvai NIEKO nekeista — sesija tik skaitymas + paruošimas.

| # | Kas | Rezultatas |
|---|---|---|
| 1 | Konv recon v1.2 (IKI=09-12), Raimis paleido 00:17 LT | 09-12 duomenų 0, v8 gyva nuo 23:35 → atsakymas „ar signalas grįžo" negalimas. Purchase (Ads primary): 09-07 7,1 · 09-08 2 · 09-09 0 · 09-10 0,9 · 09-11 1; GA4 purchase 09-10 7 / 09-11 3 → prieš v8 Ads matė ~15–30 % (C diagnozė patvirtinta). `analize/s1674_r2.json`, `irankiai/petshop_ads_konv_recon_v1_2.js`, `v1_3.js` (IKI=09-13, rytui) |
| 2 | PMax D planas | `dokumentai/PMAX_D_planas_s1674.md`. Raimis: „tavo planas, pasitikiu, reikia rezultato" → Claude sprendimai: Ontario katėms 8 nuotr.; Hikari/Ambrosia nuotraukos gaminamos po D1–D6; Generic katės nekuriama; vienas tROAS 3,84 |
| 3 | D vykdymo skriptas | `irankiai/petshop_pmax_d_v1_0.js` (DRY=true Preview → planas į ps_ads_recon; DRY=false Run). Daro: kampaniją 21472017542 pervadina „P-max \| LT \| petshop.lt", biudžetas €40/d, urlExpansionOptOut; sukuria D1–D6 asset grupes PAUSED (listing medis brand → custom_label_0/1/2, „kita" UNIT_EXCLUDED; tekstai/logo/video/business name kopijuojami iš Generic šunų grupės; ps_* nuotraukos pagal manifest temą, ≤20); kačių 21565450990 PAUSE. Nebandytas Preview — pirmas Preview ryt |

Atviri iš skripto (patikrinti Preview'e): final URL (`/prekes-zenklas/exclusion/`, `/josera/`, kategorijų URL) — tikrinti 200 prieš Run; campaignBudget update per mutate; listing „kita" caseValue forma; Brand exclusion / audience signals — neįtraukta (v1.1 po sėkmingo D).
