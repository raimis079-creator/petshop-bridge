# S1696 — VEIKSMŲ PLANAS (marketingo peržiūra + srauto planas sujungti) — 2026-09-20
**Atnaujinta 2026-09-24 vakare (S1713): 2.11 WP_CACHE ☑ gyvai (TTFB 1–1,9 s → 40–65 ms, `petshop-cache` v1.1); 2.10 laiškas paruoštas, R užklausa serveriai.lt botui išsiųsta — atsakymo dar nėra.**
**Atnaujinta 2026-09-24 (S1712): pridėti 2.10–2.17 iš 4 sričių analizės (`S1712_ANALIZE_vartotojas_SEO_turinys_AI_2026-09-24.md`); 1.2 Bing — 1 158 prekių atmestos dėl nuotraukų, patikra ≈10-01; 1.8 — AI botai BLOKUOJAMI hostingo lygmenyje (žr. 2.10).**
**Atnaujinta 2026-09-23 (S1706): Sprinto 1 statusai; pridėti 2.8, 2.9 iš S1705; 2.8 perduota R; 2.9 analitika v1.3 gyvai; 2.1 veislių blokas gyvai; 2.2 esamų straipsnių sutvarkymas baigtas.**

**Raimio principas (09-20):** partneriais (veisėjai, kinologai, prieglaudos, vetai) netikim — jie nepriklauso nuo mūsų. Viskas, kas priklauso nuo mūsų (feed'ai, turinys, svetainė, užsakymo sudėtis, Ads ekonomika, el. paštas) — daroma MAKSIMALIAI. Dvi ašys: **SRAUTAS** (savi kanalai ×10) ir **PELNAS IŠ UŽSAKYMO** (klientų mišinys + skanėstų attach). Ads neliečiam iki 10-05. Kiekvienas darbas turi savininką, terminą, matavimą. Statusai keičiami čia.

**Raimio taisyklė (09-23):** šis planas — projekto kontūras. Nauji radiniai įtraukiami į jį kaip punktai su savininku ir būsena, ne kaip atskiri darbų sąrašai.

Ženklai: **R** = Raimis, **C** = Claude. ☐ nepradėta · ◐ vyksta · ☑ padaryta · ✗ atmesta.

## SPRINTAS 1 — iki 09-27 (greiti, be pinigų)

| # | Darbas | Kas | Matavimas | Būsena |
|---|---|---|---|---|
| 1.1 | Kainų palyginimo feed'as (kaina24/kainos gyvi, manufacturer = brendas, 2 klaidingi atitikmenys išjungti) | C, R | ses/d iš kaina24+kainos 12 → 25; CPA ≤ €8 | ☑ S1697 — feed'o nefiltruoti pagal kainą; kainų nekeisti (R sprendimas), vėliau akcijos AV prekėms |
| 1.2 | Bing / Microsoft Merchant Center nemokami sąrašai | C, R | Bing ses/d 1 → 5 | ☑ S1702 — parduotuvė 50090051 patvirtinta; S1709: 1 158 prekių atmestos (`ImageCrawlingRejectedErr`), patikra ≈10-01 |
| 1.3 | 404 iš organikos — redirect'ai | C | 404 organika → 0 | ☑ S1698 `petshop-404-atitikmuo` v1.1; S1711 +6 rankiniai; S1712 liko 5 (`/register`, super-beno ×2, exclusion-me-mono 1,5 kg, sterilizuotos katės straipsnis) → 2.14 |
| 1.4 | Mėginukas naujam maisto klientui (jaučio ausis, AV siuntos) + lapelis su QR | R (pakavimas/VMVT), C | R60 kohortos su/be mėginuko | ☐ laukia R (S4) |
| 1.5 | Svetainės paieškos pjūvis | C | sąrašas → 2.1/2.2 | ☑ S1699 `petshop-paieska` v1.0; S1712: 17 % be rezultatų → 2.15 |
| 1.6 | Botų patikra | C | tikras LT ses/d | ☑ S1700 (savas srautas atskirtas tik 2.9) |
| 1.7 | Skaičiuoklė kaip atskiras puslapis `/skaiciuokle/` | C | ses, anketos, užs. iš puslapio | ☑ S1703 + 34 puslapiai noindex → index; S1706 tekstai lietuviškiau (v1.0.1) |
| 1.8 | Product schema pilna + AI botai neblokuojami | C | Search Console AI ataskaita | ☑ S1701 `petshop-schema-prekes` v1.0 · **✗ AI botai** — S1712: GPTBot/ChatGPT-User/ClaudeBot 403 hostinge → 2.10 |

## SPRINTAS 2 — 09-28…10-18 (turinys + užsakymo sudėtis)

| # | Darbas | Kas | Matavimas | Būsena |
|---|---|---|---|---|
| 2.1 | Veislės puslapio šablonas v2: svoris pagal veislę → maistai su €/d. + €/mėn + skanėstai veislei | C, R tikrina faktus | organika ses/d 30 → 45; paspaudimai `skaiciuokle/veisle` | ◐ S1706: `petshop-veisles` GYVAI visuose 21 veislių puslapiuose, bloko vieta — puslapio vidurys (R), antraštė „Kiek per mėnesį kainuoja takso maistas?" (R). Laukia R: tipinių svorių patikra. Liko: skanėstai (po 2.3), labradoras/vokiečių aviganis → 4.1 |
| 2.2 | Straipsniai — R sprendimas: pirma sutvarkyti esamus, paskui naujus | C, R tikrina | landing ses + Exclusion užs.; `skaiciuokle/straipsnis` | ◐ S1706 I dalis BAIGTA: „Šuo kasosi" (+ Exclusion blokas), Josera šunų/kačių (be „pigiau" + blokai), Monoproteininis (Exclusion į viršų), Mitybos auditas, Geriausias sausas (be „2024"), tuščias šėrimo puslapis → 301, 14 meta aprašymų, testinis puslapis paslėptas, 5 seni brendų įrašai — palikti, pridėtos nuorodos į gamintojų prekes (R). Toliau — nauji: alergija šuniui, šuo viduriuoja, sterilizuota katė storėja, plaukų gumuliukai; S1712 papildymas → 2.17 |
| 2.3 | Skanėstų attach prie maisto — 3 skanėstai iš AV su €/vnt | C, R parenka 10 skanėstų | attach % (≥ 20 %), CM/užs. | ☐ |
| 2.4 | Pick & mix skanėstų dėžė 20 vnt. ~€19,90 | R (sudėtis, kaina), C | AOV, dėžių/mėn | ☐ |
| 2.5 | Konversijos auditas svetainėje (krepšelis → kasa → užs., mobile) | C | konversija 4 → 5 % | ◐ S1712 pirmi radiniai (kasa, modalas, paieška) → 2.12, 2.13, 2.15; pilnas piltuvėlis po 2.9 (~09-30) |
| 2.6 | MC custom labels pagal antkainį/grįžimą; Josera exclude; šunų PMax sujungti su retail | C (feeds v2.6) | biudžeto dalis Josera ↓ | ☐ po 10-05 |
| 2.7 | Q4 HTML planas atnaujinti statusais + naujais KPI | C | — | ☐ ~10-05 |
| 2.8 | Royal Canin / Ambrosia / Rasco: kodėl neperka po migracijos (rugp. ~€500/14 d. → dabar ~€20) | R (kainos) | grąžintos pajamos ~€450/14 d. | ◐ R tikrina pats (09-23). C radinys: RC Sterilised 37 10 kg mūsų €71,98 vs Zookaralyste €54,90 / Kainos.lt min €57,88 (~25–30 % brangiau) |
| 2.9 | Srauto matavimo pataisa — sesijos, savas srautas, landing, kanalai, piltuvėlis | C | patikimas ses/d ir piltuvėlis | ◐ S1706: `petshop-analitika` v1.3 GYVAI 09-23 (sesija, vidinis srautas → testinis, Paysera ≠ landing, kanalas ne NULL; testas OK). Švari bazė nuo 09-24. Liko: „salis" → „kalba" ataskaitose + piltuvėlis planas-langas (~09-30) |
| 2.10 | **AI botų atblokavimas hostinge** — serveriai.lt WAF 403/ryšio nutraukimas GPTBot, ChatGPT-User, ClaudeBot (7 d. logai: ChatGPT-User 1 076 užkl., 0×200; OAI-SearchBot/Perplexity praeina); po atblokavimo pakartoti `s1712/b.php` E fazę ir 7 AI užklausas | R (laiškas serveriai.lt / DirectAdmin), C (tekstas, patikra) | ChatGPT-User 200 ≥ 90 %; AI citavimas 2/7 → 5/7 | ◐ S1713: laiškas `S1713_laiskas_serveriai_lt_AI_botai_2026-09-25.md`; R 09-24 21:13 parašė serveriai.lt botui, atsakymo nėra — kartoja 09-25; po atsakymo C patikra E faze — **KRITINĖ** |
| 2.11 | **WP_CACHE įjungimas** — `wp-config.php` nėra `define('WP_CACHE', true)` → Super Cache 0 puslapių, TTFB 1,1–2,1 s (žinoma nuo S1689s); + krepšelio/kasos/importo/Complianz patikra | C (R „daryk") | TTFB ≤ 0,3 s svečiui; CrUX FAST | ☑ S1713 (09-24): `WP_CACHE`+`WPCACHEHOME` wp-config'e, `cache_rejected_uri` + augintinio-profilis/refill-feedback, `petshop-cache` v1.1 (kategorijų/gamintojo/parduotuvės rebuild); TTFB svečiui 40–65 ms, krepšelis/kasa/paskyra/prisijungę dinaminiai. CrUX patikra ≈10-08 |
| 2.12 | **Welcome modalas**: CTA „Pridėti augintinį" nenustato `psw_seen` → modalas antrą kartą ant anketos (+ slapukų juosta dengia mobiliajame); nerodyti profilio/skaičiuoklės/kasos puslapiuose; anketos 1 ž. vardas nebūtinas | C | anketa completed/started 22/332 → ≥ 30 % | ☐ S1712 |
| 2.13 | **Kasa**: paštomatas (0 €, 5 laukai) pirmas vietoj kurjerio 3,99 € (9 laukai); Paysera šalių sąrašas LT/LV/EE; „tik kurjeriu" prekių krepšelio pranešimas suderinti | C (R „daryk") | kasos konversija (2.5), kurjerio dalis ↓ | ☐ S1712 |
| 2.14 | **SEO šablonai**: kategorijų/gamintojų title+meta (viršutinės 4 kategorijos ir 123 gamintojai be teksto), prekių meta fallback (982 be meta), H1 subkategorijoms/gamintojams/parduotuvei, titulinio Organization/WebPage schema, shippingDetails su PVM (2,15/3,99), darbo laikas, 5 rankiniai 301, Googlebot-Image 404 sąrašas | C | GSC: prekių+kategorijų paspaudimai 73/12 d. → ×2 iki 11-15 | ☐ S1712 |
| 2.15 | **Paieška v1.1**: EN→LT sinonimai (pork/peas/duck/lamb/kitten…), nulinių rezultatų puslapis (kategorijos + „šio brendo neturime → alternatyvos"), kategorijos rezultatuose, paslėptų dropship prekių elgsena; Leger 10 kg #18054 publikuoti (R); dovanų kuponas (R sprendimas) | C, R | nulinių paieškų dalis 17 % → < 8 % | ☐ S1712 |
| 2.16 | **Atsiliepimai**: WC atsiliepimai + prašymas post_purchase_7d laiške + senų eShoprent atsiliepimų importas (TŽ Q19) + `aggregateRating` schemoje; „Atsiliepimai" puslapis (zoosalis/pethappy turi) | R sprendimas → C | ≥ 30 atsiliepimų iki 12-31 | ☐ S1712 (TŽ F30b/Q19 atviri) |
| 2.17 | **Prekės puslapis v2 + AI turinys**: maketas — pristatymo terminas/kaina po kaina, €/kg, skaičiuoklė virš „Dažnai perkama kartu", pakuočių perjungiklis top 30; gamintojų (20) + 6 viršutinių kategorijų tekstai; gidas „hipoalerginis: vet dieta vs monoproteininis" (ChatGPT rėmas); landing'ai begrūdis šunims/katėms, sterilizuotoms katėms | C maketas + .docx → R | AI/organika bendrose užklausose (11/21 nematomi) | ☐ S1712 → 2.2 eilė |

## SPRINTAS 3 — 10-19…11-15 (Ads pelningumas + kanalų plėtra)

| # | Darbas | Kas | Matavimas | Būsena |
|---|---|---|---|---|
| 3.1 | Ads konversijos vertė = bruto marža × brendo koef.; Customer Match + new-customer goal | C, R (S1) | Josera dalis naujų 39 → 30 %; CPA nauji ≤ €10 | ☐ laukia S1 |
| 3.2 | Search „problemų" kampanija €5/d | C, R tvirtina | CPA ≤ €12 | ☐ |
| 3.3 | Kainų palyginimo plėtra 2 | C, R | ses/d 25 → 40 | ☐ |
| 3.4 | Relaunch laiškas 561 → 5 100 | R verdiktas, C | prisijungimai 7 d., užs. 30 d. | ◐ CALC v1.0 laukia R verdikto |
| 3.5 | Dashboard — vienas ekranas | C | — | ☐ |
| 3.6 | S1712 pakartotinė patikra (~11-15): filtrų Disallow poveikis (Googlebot filtrų dalis 34 % → ?), sitemap indeksuota 1 360/2 284 → ?, anketos pildymas po 2.12, AI citavimas po 2.10, konversija pagal įrenginį iš švarios bazės | C | — | ☐ |

## SPRINTAS 4 — 11-16…12-31 (mastelis)

| # | Darbas | Kas | Būsena |
|---|---|---|---|
| 4.1 | Veislės 21 → 40 (+ labradoras, vokiečių aviganis), problemų straipsniai 5 → 15 | C, R | ☐ |
| 4.2 | Konservų šėrimo lentelės | C | ☐ |
| 4.3 | Animaciniai prekės video prekės puslapiuose (top 20 SKU) | C, R | ☐ |
| 4.4 | Ads biudžetas +20 % žingsniais, jei CPA nauji ≤ €10 ir CM12/CAC ≥ 2 | C siūlo, R tvirtina | ☐ |
| 4.5 | Referral „skanėstas draugui" | C | ☐ |

## GALBŪT VĖLIAU (nepriklauso nuo mūsų — be terminų)
Veisėjai per skelbiu.lt; kinologai/dresūros mokyklos; prieglaudos; podcast'ai/YouTuberiai; FB grupės (organiškai); FB Shop (tik jei atsiras FB turinio ritmas); live chat (alphazoo/zoosalis turi — tik jei bus kam atsakinėti).

## KPI lentelė (kas 2 sav. į Q4 HTML)

| KPI | Dabar | 10-18 | 11-15 | 12-31 |
|---|---|---|---|---|
| Sesijos/d (LT, be botų ir savų) | ~190 lankytojų/d su savais (09-09…22); švari bazė nuo 09-24 | 215 | 280 | 350 |
| Užsakymai/d | 8,9 (09-09…22); 9,4 (09-10…24, 132 užs./14 d., AOV €41,79, 65 nauji) | 12 | 15 | 18 |
| Nauji maisto klientai/mėn | ~50 | 70 | 90 | 120 |
| Kainų palyginimas ses/d | 12 | 25 | 35 | 40 |
| Organika ses/d | 30 | 40 | 55 | 80 |
| Skanėstų attach % | ? | 15 | 20 | 25 |
| CM rate | ~15 % | 16 | 18 | 20 |
| Ads CPA nauji | €20,5 (S1705) | ≤ 12 | ≤ 10 | ≤ 10 |
| R_due | 16 % | — | ≥ 22 % | ≥ 25 % |
| Josera dalis naujų | 39 % | 37 | 33 | 30 |
| Paieškos be rezultatų | 17 % (S1712) | 10 % | < 8 % | < 8 % |
| Anketa completed/started | 7 % (22/332, S1712) | 20 % | 30 % | 30 % |

## Atmesta / neliečiam
Shorts/TikTok kaip kanalas; Google Customer Reviews (LT nėra); CSS partneris (LT nėra); vet kanalas; EE/LV; B2B per petshop.lt; Pigu; nuolaidos lifecycle; „kalbėjimas į kamerą"; FB reklama; kainų karas Josera 10 kg/Quattro/Monge/Farmina; partnerių kanalai — žr. „Galbūt vėliau"; llms.txt (mažas efektas — tik po 2.10, 15 min.).

## Raimio sprendimai, kurie blokuoja darbus
- ~~R1 kaina24/kainos CPC~~ ☑ uždaryta S1697
- **S1** Customer Match su 5 100 istorinių be sutikimo → 3.1
- **S4** mėginuko pakavimas/VMVT → 1.4
- **S2** R60 tikslas 26–30 % + CM rate 20 % — patvirtinti KPI lentelę
- Relaunch CALC v1.0 verdiktas → 3.4
- 2.8 RC/Ambrosia/Rasco kainos — R tikrina pats
- 2.1 veislių tipiniai svoriai — R patikrina lentelę
- **2.10** serveriai.lt laiškas dėl AI botų — R siunčia (C tekstas)
- ~~2.11~~ ☑ S1713 · **2.13** „daryk" kasos metodų eilei
- **2.16** atsiliepimų sprendimas (WC atsiliepimai + senų importas?)
- **2.15** #18054 Leger publikavimas; dovanų kuponas — ar reikia
- Mobili paieškos ikona antraštėje (Flatsome header); DP „×2 vnt." pakų rikiavimas kategorijoje; Google Business Profile — ar yra; dvi Facebook paskyros (facebook.com/www.Petshop.lt ir /Petshop.lt) — kuri oficiali
