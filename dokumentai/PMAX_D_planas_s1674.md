# PMax D — struktūros planas (S1674, tvirtinimui)

Vykdymas: 09-13 po recon (Purchase ≥4/d). Biudžetai nekeliami: viso €40/d PMax + €8 Brand.

## 1. Kampanijos
- **21472017542** „P-max| All LT | Šunų maistas" → pervadinti **„P-max | LT | petshop.lt"**, biudžetas €40/d (20+20), tROAS paliekamas 3,84 iki lūžio patikros; URL expansion OFF; Brand_Exclusion (3 nariai) prisegtas; neigiami petshop/pet shop lieka.
- **21565450990** kačių → PAUSE (istorija lieka; jos Generic grupė nebe reikalinga — kačių grupės kuriamos šunų kampanijoje).

## 2. Asset grupės (naujos, po viena temai; nuotraukos = ps_* iš bibliotekos, ≤20/grupę)
| # | Grupė | Listing (feed) | Nuotraukos | Final URL |
|---|---|---|---|---|
| 1 | Exclusion LTV 7/12 kg | brand=Exclusion AND custom_label_1=reklamuoti_ltv (22) | 15 (5×3) | /kategorija/sunims/sausas-maistas-sunims/?brand=exclusion* |
| 2 | Exclusion konservai | brand=Exclusion AND custom_label_2=konservai-sunims | 9 (3×3) | Exclusion konservų kategorija |
| 3 | Josera šunims sausas | brand=Josera AND custom_label_2=sausas-maistas-sunims AND label_0 IN (A,B) | 12 (4×3) | Josera šunims |
| 4 | Ontario mono konservai šunims | brand=Ontario AND custom_label_2=konservai-sunims | 14 (5×3, 1 pt trūksta) | Ontario konservai |
| 5 | Josera katėms | brand=Josera AND custom_label_2=sausas-maistas-katems AND label_0 IN (A,B) | 12 | Josera katėms |
| 6 | Kačių konservai (Miamor+Ontario) | custom_label_2=konservai-katems AND brand IN (Miamor,Ontario) | 12+9=21 → **Ontario 8 (be 1 pt)** =20 | konservai-katems |
| 7 | Hikari (tvenkiniai/žuvys) | brand=Hikari (36) | **NĖRA — gaminti** (s1672_p.php) | zuvims |
| 8 | Ambrosia | brand=Ambrosia | **NĖRA — gaminti** | Ambrosia |
| G | Generic šunys (esama) | custom_label_0 IN (A,B) AND custom_label_2 IN (sausas-maistas-sunims, konservai-sunims, skanestai-sunims) MINUS brand IN (Exclusion, Josera, Ontario, Quattro) | esamos 19 ps_* | /kategorija/sunims/ |
| Gk | Generic katės (NAUJA šunų kampanijoje) | analogiškai katėms MINUS brand IN (Josera, Miamor, Ontario) | dublikatai iš 5–6 (≤20) arba gaminti | /kategorija/katems/ |

*Final URL tikslinsiu D vykdant — imsiu realius 200 kategorijų/brand'ų URL iš svetainės.

Į vėliau (E/F po nuotraukų): skanėstai (242), kraikai (72+37) — atskiros grupės, kai bus nuotraukos.

## 3. Bendra visoms grupėms
- Listing filtras kampanijos lygiu: **custom_label_1 ≠ ne_reklamai** (Quattro 62), custom_label_0 ∉ (D, X), akvariumo prekės išskyrus Hikari — NE.
- Audience signals: GA4 purchasers + site visitors 30 d. + in-market „Pet food / Pet supplies" (LT).
- Logo + video — perkelti iš esamos Generic grupės.
- Tekstai — E etapas: iš `_pmax_arch_s1672_note.md` geriausi antraštės/aprašai + brand USP; kol E nėra, naujoms grupėms laikini tekstai iš esamos Generic (min. 3 antr./2 apr.).
- Vykdymo tvarka (Ads Script, Raimio „Petshop recon"): (a) kampanijos nustatymai + pervadinimas; (b) sukurti grupes 1–6 su listing filtrais ir tekstais; (c) prikabinti ps_* (asset kūrimas ir prikabinimas atskirai, po kiekvienos grupės patikra ≤20); (d) kačių kampanija PAUSE; (e) verifikacija recon v1.1.
- Rollback: kačių kampanija UNPAUSE, naujos grupės PAUSE.

## 4. Raimio sprendimai reikalingi
1. Grupė 6: Ontario kačių konservų 8 ar 9 (viena pt nukris) — ar OK?
2. Hikari/Ambrosia nuotraukos: gaminti dabar (D2, po 1–6) ar atidėti?
3. Generic katės — kurti ar užtenka 5–6?
4. Ar OK vienas tROAS 3,84 visai kampanijai (grupės lygiu tROAS nėra)?
