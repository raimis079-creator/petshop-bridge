# S1696 — VEIKSMŲ PLANAS (marketingo peržiūra + srauto planas sujungti) — 2026-09-20

**Raimio principas (09-20):** partneriais (veisėjai, kinologai, prieglaudos, vetai) netikim — jie nepriklauso nuo mūsų. Viskas, kas priklauso nuo mūsų (feed'ai, turinys, svetainė, užsakymo sudėtis, Ads ekonomika, el. paštas) — daroma MAKSIMALIAI. Dvi ašys: **SRAUTAS** (savi kanalai ×10) ir **PELNAS IŠ UŽSAKYMO** (klientų mišinys + skanėstų attach). Ads neliečiam iki 10-05. Kiekvienas darbas turi savininką, terminą, matavimą. Statusai keičiami čia.

Ženklai: **R** = Raimis, **C** = Claude. ☐ nepradėta · ◐ vyksta · ☑ padaryta · ✗ atmesta.

## SPRINTAS 1 — iki 09-27 (greiti, be pinigų)

| # | Darbas | Kas | Matavimas | Būsena |
|---|---|---|---|---|
| 1.1 | **Kainų palyginimo feed'as — UŽDARYTA S1697 (09-20)**: feed'ai sveiki (v2.6.0 manufacturer=brand, 2 klaidingi atitikmenys išimti). kaina24+kainos CPC €0,08, ~€1/d, ~1,2 užs./d → filtro nereikia. Maržos analizė (`S1697_kainu_palyginimas_1.1_2026-09-20.md`, CSV v3): zoo konkurentai (zookaralyste, Pethappy, Ramiosblusos, pet24) Josera 10 kg/Quattro/Monge/Farmina parduoda ties mūsų savikaina — kainų nekeisti (Raimio sprendimas 21:37); vėliau AV prekėms iš „galima" sąrašo — akcijos. Liko: Ontario Exigent 1 kg EAN (#16270) | C ✓ / R | — | ☑ |
| 1.2 | **Bing / Microsoft Merchant Center — PADARYTA S1702 (09-20 23:58)**: Microsoft Advertising paskyra UAB Avesa G107GZ9A (cid 255059622, aid 189355496, prisijungimas raimis079@gmail.com; mokėjimo metodo NĖRA — tik nemokami sąrašai). petshop.lt patvirtinta Bing Webmaster Tools (meta per Rank Math `bing_verify`), sitemap_index.xml pateiktas. MMC parduotuvė Petshop.lt storeId 50090051 — **laukia patvirtinimo iki 3 d.d.** Feed „Petshop.lt prekės (Google feed)" ID 1771977: URL `https://petshop.lt/feed/google`, kasdien 12 AM PT (10:00 LT), LT/Lithuanian/EUR, Online product ads. 23:58 feed file dar tuščias — laukti parduotuvės patvirtinimo. Detalės `S1702_bing_mmc_1.2_2026-09-20.md` | C ✓ | Bing ses/d 1 → 5 | ☑ (laukia MS patvirtinimo) |
| 1.3 | **404 iš organikos — UŽDARYTA S1698 (09-20)**: `petshop-404-atitikmuo` v1.1 GYVAI (alias checkout/cart/content, draft prekė → kategorija, gamintojas pagal `_legacy_manufacturer`, „artimiausias slug" su skaičių vartais, žurnalas `ps_404_atitikmuo_log`); testas 19/29 → 301. Šaltinis: seni eShoprent URL iš Ads URL plėtros, kaina24/kainos katalogų ir organikos. Dokumentas `S1698_404_organika_1.3_2026-09-20.md` | C | error404 organika+mokamas 68/10 d. → ≤15/7 d.; žurnalo auditas po savaitės | ☑ |
| 1.4 | **Mėginukas naujam maisto klientui** (jaučio ausis, AV siuntos) + lapelis su QR į skaičiuoklę | R (pakavimas/VMVT sprendimas), C (žymė `_ps_meginukas` + holdout 90/10 + lapelis) | R60 kohortos su/be mėginuko | ☐ laukia R |
| 1.5 | **Svetainės paieška — UŽDARYTA S1699 (09-20)**: 346 paieškos/14 d., 21 % be rezultatų (rašybos klaidos, galūnės, SKU, brendai kurių neturim). Naujas mu-plugin `petshop-paieska.php` v1.0 GYVAI (sinonimai, kamienai, SKU). Į asortimentą (R): vet dietos (Hill's, RC Renal/Gastro), dovanų kuponas, Josera Leger 10 kg #18054 publikuoti (16 paieškų!). Dokumentas `S1699_paieska_1.5_2026-09-20.md` | C ✓ / R asortimentas | 0 rez. 21 % → ≤8 % per 14 d. | ☑ |
| 1.6 | **Botų patikra — UŽDARYTA S1700 (09-20)**: botų nėra. `salis` = naršyklės kalba (Accept-Language), ne geo — „US/GB" sesijos yra lietuviai su angliška telefono kalba (71 checkout, 40 „ačiū" per 8 d., 400 iš LT Ads). Tikras srautas ~165 ses/d, KPI bazė patvirtinta. Kodo nekeisti. `S1700_botai_1.6_2026-09-20.md` | C | — | ☑ |
| 1.7 | **Skaičiuoklė kaip atskiras puslapis** `/skaiciuokle/` (svoris → 3 maistai su €/d., be prekės konteksto) — landing organikai, AI, kainų palyginimui, laiškams | C | ses, anketos, užs. iš puslapio | ☐ |
| 1.8 | **Product schema — UŽDARYTA S1701 (09-20)**: naujas mu-plugin `petshop-schema-prekes.php` v1.0 (brand, gtin13, shippingDetails €1,78/€0 nuo €30, hasMerchantReturnPolicy 14 d. ne maistui, švarus name/description, atributų pavadinimai, Organization logo/tel/adresas). AI botai robots.txt neblokuojami ✓. `S1701_product_schema_1.8_2026-09-20.md` | C | GSC Merchant listings įspėjimai → 0 per 2 sav. | ☑ |

## SPRINTAS 2 — 09-28…10-18 (turinys + užsakymo sudėtis)

| # | Darbas | Kas | Matavimas | Būsena |
|---|---|---|---|---|
| 2.1 | **Veislės puslapio šablonas v2**: svoris pagal veislę → 3 maistai su €/d. + „mėnuo kainuoja nuo €X" + skanėstai veislei; pirmos 10 veislių (esamos 6 + taksas/jorkšyras/labradoras/vokiečių aviganis) | C (šablonas + AI turinys), R tikrina faktus | organika ses/d 30 → 45; anketos/d | ☐ |
| 2.2 | **„Problemų" straipsniai** — 5 pirmi (kasosi, viduriuoja, gumuliukai, jautrus skrandis, sterilizuota katė storėja) → Exclusion/Animonda + skaičiuoklė | C, R tikrina | landing ses + Exclusion užs. | ☐ |
| 2.3 | **Skanėstų attach**: prekės puslapyje ir krepšelyje prie maisto — 3 skanėstai iš AV su €/vnt (ne dropship); matuoti attach rate | C, R parenka 10 skanėstų | attach % (tikslas ≥ 20 %), CM/užs. | ☐ |
| 2.4 | **Pick & mix skanėstų dėžė** 20 vnt. ~€19,90 su €/kg, „kartoti kas N sav." | R (sudėtis, kaina), C (prekė + krepšelio logika) | AOV, dėžių/mėn | ☐ |
| 2.5 | **Konversijos auditas svetainėje**: add_to_cart 663 → begin_checkout 226 → užs. ~100 per 10 d. — kur krenta (mobile 72 %), krepšelio/kasos trintis, pristatymo data krepšelyje, „97 % išsiųsta per 24 val." įrodymas | C | konversija 4 → 5 % = +25 % užs. be srauto | ☐ |
| 2.6 | **MC custom labels** pagal antkainį/grįžimą; Josera virš MC benchmark'o — `exclude`; šunų PMax €10 sujungti su retail po 10-05 | C (feeds v2.6) | biudžeto dalis Josera ↓ | ☐ po 10-05 |
| 2.7 | **Q4 HTML planas** atnaujinti statusais + naujais KPI (CM rate, attach, ses pagal kanalą) | C | — | ☐ ~10-05 |

## SPRINTAS 3 — 10-19…11-15 (Ads pelningumas + kanalų plėtra)

| # | Darbas | Kas | Matavimas | Būsena |
|---|---|---|---|---|
| 3.1 | **Ads konversijos vertė = bruto marža × brendo koef.** (ne pajamos) per offline įkėlimą; Customer Match (esami pirkėjai) + new-customer goal | C (skriptas), R (paleidžia, S1 sprendimas dėl 5 100) | Josera dalis naujų 39 → 30 %; CPA nauji ≤ €10 | ☐ laukia S1 |
| 3.2 | **Search „problemų" kampanija** €5/d (alergija, jautrus virškinimas, kasosi) → 2.2 straipsniai/Exclusion | C (UI per Chrome), R tvirtina | CPA ≤ €12, Exclusion dalis ≥ 70 % | ☐ |
| 3.3 | **Kainų palyginimo plėtra 2**: skanėstų per vnt. pozicijos, Hikari, Georplast — visos kategorijos, kur 1–2 vieta; kainoteka + kiti LT palyginimai | C, R (CPC) | ses/d 25 → 40 | ☐ |
| 3.4 | **Relaunch laiškas** 561 → 5 100 (atskiras langas, CALC v1.0 verdiktas) | R verdiktas, C | prisijungimai 7 d., užs. 30 d. | ☐ |
| 3.5 | **Dashboard**: planas-langas + ses/d pagal kanalą, attach %, CM rate, R_due — vienas ekranas | C | — | ☐ |

## SPRINTAS 4 — 11-16…12-31 (mastelis)

| # | Darbas | Kas | Būsena |
|---|---|---|---|
| 4.1 | Veislės 10 → 40, problemų straipsniai 5 → 15 | C, R tikrina | ☐ |
| 4.2 | Konservų šėrimo lentelės (katėms 0/138, Animonda 0/38) — skaičiuoklė ir katėms/konservams | C | ☐ |
| 4.3 | Animaciniai prekės video prekės puslapiuose (top 20 SKU), tas pats asset'as Shorts su nuoroda — ne kanalas, o puslapio elementas | C, R vertina | ☐ |
| 4.4 | Ads biudžetas +20 % žingsniais, jei CPA nauji ≤ €10 ir CM12/CAC ≥ 2 | C siūlo, R tvirtina | ☐ |
| 4.5 | Referral „skanėstas draugui" (tik po to, kai attach ir mėginukas veikia) | C | ☐ |

## GALBŪT VĖLIAU (nepriklauso nuo mūsų — be terminų, be pastangų dabar)
Veisėjai per skelbiu.lt; kinologai/dresūros mokyklos; prieglaudos; podcast'ai/YouTuberiai; FB grupės (organiškai). Grįžtam tik jei savi kanalai išsemti arba Raimis pats pamato progą.
- **FB Shop / Meta katalogas** (Raimio klausimas 09-21 00:06, Claude: ne dabar): ES FB Shop = tik katalogas su nuoroda į svetainę, vertė tik žymint prekes įrašuose arba catalog ads; sąlyga — jei atsiras FB turinio ritmas (Sprintas 2–4 straipsniai/veislės) arba norėsis bandyti krepšelio retargetingą. Feed tas pats `/feed/google`, ~2–3 val. + Meta verifikacija; rizika — Meta atmeta vet prekes.
- **Marketplace'ai (pigu/Varle/Senukai)**: maistui su 12–17 % marža nuostolinga (komisinis 10–15 %), aksesuarams 30–40 % — galima, bet atskira operacija. Raimio sprendimas, jei kada norės svarstyti.
- Kanalų vaizdas (Raimio klausimas „ar be Google nieko nėra"): 10 d. užs. — Google (Ads+organika) ≈ 55 %, sava bazė (direct/Gmail/el. paštas) ≈ 25 %, kainų palyginimas 17 %, kita ~5 %. Bing LT ~2–4 % paieškų, mums 1–2 ses/d, 2 užs./10 d.; vertė — €0 ir kelias į ChatGPT/Copilot (Bing indeksas). Išvada: nauji klientai per Google, pelnas — iš grįžtančių be Google → planas lieka retention/skaičiuoklė/el. paštas.

## KPI lentelė (kas 2 sav. į Q4 HTML)

| KPI | Dabar (09-20) | 10-18 | 11-15 | 12-31 |
|---|---|---|---|---|
| Sesijos/d (LT, be botų) | ~165 (S1700 ✓) | 215 | 280 | 350 |
| Užsakymai/d | 10 | 12 | 15 | 18 |
| Nauji maisto klientai/mėn | ~50 | 70 | 90 | 120 |
| Kainų palyginimas ses/d | 12 | 25 | 35 | 40 |
| Organika ses/d | 30 | 40 | 55 | 80 |
| Skanėstų attach % | ? (matuoti) | 15 | 20 | 25 |
| CM rate (kontribucija/pajamos) | ~15 % | 16 | 18 | 20 |
| Ads CPA nauji | €11–13 | ≤ 12 | ≤ 10 | ≤ 10 |
| R_due | 16 % | — | ≥ 22 % | ≥ 25 % |
| Josera dalis naujų | 39 % | 37 | 33 | 30 |

## Atmesta / neliečiam
Shorts/TikTok kaip kanalas; Google Customer Reviews (LT nėra); CSS partneris (LT nėra); vet kanalas; EE/LV; B2B per petshop.lt; Pigu; nuolaidos lifecycle; „kalbėjimas į kamerą"; FB reklama; partnerių kanalai — žr. „Galbūt vėliau".

## Raimio sprendimai, kurie blokuoja darbus
- **R1** kaina24/kainos CPC + mėnesio sąskaita → 1.1
- **S1** Customer Match su 5 100 istorinių be sutikimo → 3.1
- **S4** mėginuko pakavimas/VMVT → 1.4
- **S2** R60 tikslas 26–30 % + CM rate 20 % — patvirtinti KPI lentelę

## Kitas langas
Pradėti nuo šio failo: **1.7 `/skaiciuokle/` puslapis** (vienintelis likęs C darbas Sprinte 1; 1.1 — S1697, 1.3 — S1698, 1.5 — S1699, 1.6 — S1700, 1.8 — S1701). R: 1.2 Bing — patikrinti MMC parduotuvės patvirtinimą (≤09-24) ir feed statusą (`Merchant Center → Feeds`), 1.4 mėginukas, Josera Leger #18054 publikuoti, Ontario Exigent 1 kg EAN. Įrankių prefiksas `s1703_m*` (s1702 — Bing). 1.6 pastaba: kaina24 sesijoje `salis=RU` — geo lauko patikra.
