# S1712 — petshop.lt analizė: vartotojas · Google SEO · turinys/paklausa · AI/botai (2026-09-24)

Tik skaitymas — gyvai nieko nekeista. Įrankiai: VM bridge `ps-bridge/s1712/a–d.php` (fazės A–G, rezultatai `s1712/*_last.json`), Claude naršyklė (mobile 375×812 ir 1366 px), Raimio Chrome (ChatGPT), serverio access logai 09-18…09-24 (433 372 eil.), GSC lentelės serveryje, Perplexity, WebSearch (21 užklausa), 7 konkurentų puslapiai.

## 0. Prieigų patikra

| Prieiga | Būklė |
|---|---|
| Bridge per VM (`br_c.sh`, PAT `.ghtok`) | veikia (6 run'ai) |
| Serverio DB (`ps_web_ivykiai`, `ps_seo_404`, `ps_fakt_*`, `ps_fakt_gsc_url_d`) | veikia; GSC pagal URL yra nuo 2026-06-01, dienos — nuo 2025-04 |
| Serverio access logai | veikia (`domains/petshop.lt/logs/Sep-2026.tar.gz*`, 7 paros) |
| Merchant Center | netikrinta iš naujo — 09-19 būklė (2 070 approved) galioja; feed generuojamas kasdien 01:31, 2 158 prekės |
| GA4 / GSC API per SA | nenaudota — užteko serverio lentelių |
| Perplexity (be prisijungimo), ChatGPT (Raimio Chrome, 2 užklausos — istorijoje liks 2 pokalbiai) | veikia |
| WebFetch į alphazoo/zoosalis/pethappy/e-zoo | blokuoja (403/timeout) → patikrinta per Claude naršyklę |
| Google Business Profile | nepatikrinta — reikia Raimio: google.com/maps „Petshop.lt“ / Google paskyra |

## 1. Santrauka — 10 svarbiausių radinių pagal poveikį pajamoms

| # | Radinys | Svarba | Kas |
|---|---|---|---|
| 1 | **Hostingas blokuoja GPTBot, ChatGPT-User ir ClaudeBot (403 / ryšio nutraukimas)**. Per 7 d. ChatGPT-User 1 076 užklausos — nė vienos 200 (508×403, 538 be atsakymo). Tai ne WP ir ne .htaccess — serveriai.lt lygmuo. Kai vartotojas ChatGPT'e klausia apie petshop.lt ar prekę, ChatGPT puslapio atidaryti negali → cituoja konkurentus. OAI-SearchBot, PerplexityBot, Claude-User praeina. | kritinė | R (serveriai.lt užklausa), C (tekstas) |
| 2 | **Puslapių talpykla neveikia**: `wp-config.php` nėra `define('WP_CACHE', true)` → Super Cache sukonfigūruotas, bet 0 kešuotų puslapių; TTFB 1,1–2,1 s kiekvienam puslapiui (Google CrUX „AVERAGE“). Žinoma nuo S1689s (09-17), nepadaryta. | kritinė | C (R „daryk“) |
| 3 | **Welcome modalo klaida**: mygtukas „Pridėti augintinį“ nenustato `psw_seen` → /augintinio-profilis/ puslapyje tas pats modalas atsidaro antrą kartą ant anketos; mobiliajame dar ir slapukų juosta dengia modalo apačią. Rezultatas: 332 anketos pradžios / 306 numetimai 1-ame žingsnyje (09-09…24). | aukšta | C |
| 4 | **Kasoje pagal nutylėjimą — mokamas kurjeris 3,99 € ir 9 privalomi laukai**, nors krepšelis žada „nemokamas pristatymas į paštomatą“. Pasirinkus paštomatą lieka 5 laukai ir 0 €, bet klientas turi pats perjungti. | aukšta | C (R „daryk“) |
| 5 | **Nulis socialinio įrodymo**: 0 atsiliepimų, atsiliepimų skirtukas nerodomas, nėra „Atsiliepimai“ puslapio (zoosalis, pethappy turi), schemoje nėra `aggregateRating`. TŽ F30b žymėta „ATLIKTA“, Q19 (senų atsiliepimų perkėlimas) neuždaryta. | aukšta | R (sprendimas), C |
| 6 | **Organika = turinys, prekės nematomos**: po T-0 (12 d.) veislių/straipsnių puslapiai 203 paspaudimai, prekės (542 URL) 60, kategorijos 13. Priežastys: 5 iš 6 viršutinių kategorijų be aprašymo ir be meta (title „KATĖMS - Petshop.lt“), 123/123 gamintojų puslapiai be teksto, 982 prekės be meta aprašymo ir be trumpo aprašymo, subkategorijų/gamintojų puslapiai be H1, 466 prekės su dubliuotais (tiekėjo) aprašymais. | aukšta | C (šablonai), R (tekstų patvirtinimas) |
| 7 | **AI matomumas selektyvus**: cituojami esame tik prekės ženklo užklausose (Exclusion — ChatGPT rodo Petshop.lt pirmą; monoproteininis katėms — Perplexity). Bendrose („hipoalerginis šunims“, „greičiausiai pristato“, „Josera SensiPlus kaina“) mūsų nėra; ChatGPT „hipoalerginį“ supranta kaip vet dietas (RC/Hill's/Purina). Google organikoje 11/21 užklausų be petshop.lt. | vidutinė–aukšta | C (turinys), R |
| 8 | **Svetainės paieška**: 17 % užklausų be rezultatų (81/481 per 14 d.); „Produktų nerasta.“ — aklavietė; angliški pavadinimai (pork/peas/duck) nerandami; „antiparazitines“ nukreipia į vieną šampūną, nes 291 paslėpta dropship prekė neįtraukta; „leger“ 16 paieškų — Leger 10 kg #18054 vis dar juodraštis. | vidutinė | C, R (#18054) |
| 9 | **Prekės puslapis**: nėra pristatymo termino/kainos prie prekės (abu pasiekiami konkurentai rodo), nėra €/kg, pakuotės dydžiai neaprišti (SensiPlus 900 g/4 kg/12,5 kg — atskiros prekės be perjungiklio), „Dažnai perkama kartu“ aukščiau už skaičiuoklę, nuotrauka mobiliajame ~700 px iki kainos. Schemoje pristatymo kainos be PVM (1,78/3,30) — klientas mato 2,15/3,99. | vidutinė | C (maketas → R) |
| 10 | **Googlebot 34 % užklausų (1 813/5 294 per 7 d.) išleido filtrų URL** — robots.txt taisyklė gyva tik nuo 09-24 16:40, poveikį matuoti 10-08; 895 sitemap URL dar neindeksuoti. Mobiliajame antraštėje nėra paieškos ikonos (paieška tik meniu). | vidutinė | C (stebėti), R (mobili paieška — sprendimas) |

## 2. Radiniai pagal sritis

Formatas: kas · kur · įrodymas · svarba · poveikis · taisymas · apimtis.

### 2.1 Vartotojas (mobile pirmiausia)

**V1. Welcome modalas + anketa** · `/` ir `/augintinio-profilis/` · naršyklės testas: išvalius slapukus modalas atsidaro po ~3 s kartu su Complianz juosta; `.psw-b1` paspaudimas → `psw_seen` nenustatytas → profilio puslapyje modalas vėl matomas (`modalVisibleOnProfile: true`); `ps_laukai_ivykiai` 09-09…24: anketa_started 332, anketa_abandoned 306 (`s1|-kas_jūsų_augintinis,augintinio_vardas`), step_completed 38, completed 22; `ps_pets` po T-0 11 · **aukšta** · anketa = refill/skaičiuoklės kelio įėjimas, TŽ 4.1 · Taisymas: (a) CTA paspaudimas nustato `psw_seen`; (b) modalo nerodyti `/augintinio-profilis/`, `/skaiciuokle/`, kasoje; (c) modalą rodyti tik po slapukų juostos uždarymo arba juostą perkelti; (d) anketos 1 žingsnyje „vardas“ nebūtinas · C, ~2 val. + patikra telefone.

**V2. Kasa** · `/kasa/` · su Josera 12,5 kg: metodai „VENIPAK Kurjeris 3,99 €“ (pažymėtas) ir „VENIPAK paštomatai“ (0 €); pažymėtas kurjeris → suma 43,98 €, privalomi 9 laukai (gatvė, miestas, savivaldybė, pašto kodas…); perjungus į paštomatą — 5 laukai, 39,99 € · **aukšta** · krepšelio pažadas „🎉 nemokamas pristatymas į paštomatą“ neatitinka pirmo kasos vaizdo; kiekvienas neapsižiūrėjęs moka 3,99 € arba meta · Taisymas: zonos metodų eilė — paštomatas pirmas (WC renka pirmą) arba pigiausio auto-pasirinkimas; Paysera šalių sąrašas (35 šalys) — palikti tik LT/LV/EE · C, 1 val. Papildomai: VF prekė Eukanuba 12466 rodė TIK kurjerį, o krepšelis žadėjo nemokamą paštomatą — tikrinti „tik kurjeriu“ žymos ir krepšelio pranešimo suderinimą.

**V3. Prekės puslapis (mobile)** · Josera SensiPlus 12,5 kg, Exclusion 12 kg · kaina y=858 px, „Į krepšelį“ prilipęs apačioje (gerai), skaičiuoklė y=1 841 (po FBT bloko), skirtukai tik „Aprašymas / Papildoma informacija“, `related` y=4 195; HTML: `kaina_uz_kg=n`, pristatymo tekstas tik viršutinė juosta; schema Product pilna (offers, gtin, brand, shippingDetails, return) · **vidutinė** · Taisymas: 2 eilučių blokas po kaina „Paštomatas nemokamai nuo 30 € · išsiunčiame per 1–3 d. d.“, €/kg iš svorio, skaičiuoklė virš FBT, pakuočių perjungiklis per `_ps_*` grupę arba rankinis susiejimas 30 top prekių · C, maketas Raimiui (UI taisyklė), ~1 d.

**V4. Paieška** · `/?s=` · 14 d.: 481 paieškos, 125 sesijos, 81 be rezultatų; top nulinės: hills 4, prolivet 3, RC sterilised in jelly 2, exclusion pork and peas 2, hill's kitten 2, virbac 2, carnilove 2, brit care, orijen, applaws, trovet, whimzees, bravecto, „dovanu kuponas“; „antiparazitines“ → 301 į vieną šampūną; „leger“ 16/2 rez. · **vidutinė** · Taisymas: `Petshop_Paieska` sinonimai EN→LT (pork, peas, duck, lamb, rice, potato, salmon, kitten, sterilised…); nulinių rezultatų puslapis: kategorijų nuorodos + „šio brendo neturime — panašios prekės“ (Hill's/RC vet → Exclusion Diet, Carnilove/Orijen → Ambrosia/Exclusion); paieškos rezultatuose rodyti ir kategorijas; paslėptų dropship prekių problema — atskiras sprendimas (rodyti su „Pranešti kai bus“?) · C, 0,5 d. R: #18054 publikavimas, dovanų kupono sprendimas.

**V5. Titulinis (mobile)** · per 5 s aišku: „Prekės augintiniui pagal realų poreikį“, nuo 2010, žymos Hipoalerginis/Monoprotein/Be grūdų — gerai. Trūksta: paieškos ikonos antraštėje (mobiliai 60 % sesijų/užsakymų), pristatymo pažado skaičiais (yra tik „nemokamas nuo 30 €“, konkurentai rašo „1–2 d. d.“). Slapukų juosta + modalas kartu · **vidutinė** · R sprendimas (Flatsome header elementas), C 0,5 val.

**V6. Kategorija (mobile)** · `/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/` · filtrai 7 grupės (gerai), „FILTRUOTI“ mygtukas, rūšiavimas, maisto tipo perjungiklis, skaičiuoklės kortelė; pirmos kortelės — „×2 VNT. Ekonomiška pakuotė 2 × 2 kg“ (DP pakai) aukščiau už bazines prekes; puslapio aukštis 7 162 px, aprašymas 5 215 px (apačioje — gerai) · **žema** · R sprendimas dėl DP pakų rikiavimo.

**V7. Pasitikėjimas** · footer: įmonės rekvizitai yra, telefonas yra; `/duk/` 17 kl., `/grazinimas/`, `/taisykles/`, `/pristatymas/` 200; atsiliepimų 0 (žr. #5); dvi Facebook paskyros Google rezultatuose (facebook.com/www.Petshop.lt ir /Petshop.lt) — R patikrinti, kuri oficiali · **vidutinė**.

**V8. Greitis** · naršyklė mobile: TTFB 1 200 ms, DOMContentLoaded 2,2 s, load 2,6 s (titulinis); bridge: `/` 1,3–1,7 s, kategorija 2,1 s, prekė 1,4 s, be jokio `cache-control`; Super Cache būsena: `cache_enabled=1, super_cache_enabled=1, WP_CACHE=false, cache_dir 0 failų` · **kritinė** · Taisymas: `wp-config.php` + `define('WP_CACHE', true);`, tada patikra: krepšelis/kasa/paskyra neišsaugomi (`cache_rejected_uri` jau turi), Complianz, kainos po importo (`petshop-cache.php` valo), `wp_cache_not_logged_in=2` · C, 1 val. + 30 min testų (R „daryk“).

**V9. Kalba** · patikrintuose 14 puslapių angliškų WooCommerce eilučių nerasta (svečio vaizdas); prisijungusio paskyros puslapiai netikrinti (reikia prisijungimo) — S1689s pastaba lieka.

### 2.2 Google SEO (techninis)

**S1. Kešas/TTFB** — žr. V8. CrUX: LCP/INP/CLS geri, TTFB 0,94–1,37 s mobile (TŽ NF1 tikslas ≤ 2,5 s LCP tenkinamas, bet „AVERAGE“ dėl TTFB).

**S2. Robots/sitemap/canonical** · robots.txt su filtrų Disallow (nuo 09-24 16:40), sitemap 18 failų / 2 893 URL; 25 atsitiktinių prekių imtis: 200, index, canonical sutampa; www/http → 301; `/product/`, `/kategorija/`, `/gamintojas/`, `/tag/`, `/author/` → 404 (gerai); `/page/2/` 200 (nekenksminga); 301 grandinės: 24/25 vienas šuolis, 1 dvigubas (exclusion-intestinal… → 301 → 301 → 200) · žema.

**S3. Googlebot elgsena (7 d. logai)** · Googlebot 5 294: kat_filtras 1 813 (34 %), preke 747, kategorija 214, 404 — 518 (10 %); GoogleOther 4 777 (749 filtrų); AdsBot 6 653; Googlebot-Image 2 438 (245×404 — nuotraukų 404!). Googlebot 404 pavyzdžiai: `/ads.txt` 12, `/system/cache/feed_google_sitemap_product1.xml` 7, seni prekių URL po 6 (kiaules-snipas-baltas — jau 301 S1711; monge-puppy…48091-1, super-beno konservai, deli-nature lesalas, frexin šampūnas, „maistas-sterilizuotai-katei…“ straipsnis) · **vidutinė** · Taisymas: Googlebot-Image 404 sąrašas (kitas run), 6 seni URL → 301 arba palikti; filtrų dalis stebėti 10-08 · C.

**S4. Title/meta/H1** · Rank Math šablonai: prekė `%title% - %sitename%`, meta `%excerpt%` (982 prekės neturi nei rank_math_description, nei excerpt → be meta); kategorijos/gamintojai meta šablonas tuščias; viršutinės kategorijos KATĖMS (778 prekės), ŠUNIMS (1 563), GRAUŽIKAMS, ŽUVIMS — aprašymas 0 simb., title „KATĖMS - Petshop.lt“; 123/123 gamintojų be aprašymo; H1 nėra subkategorijų (`sausas-maistas-sunims`), gamintojų ir `/parduotuve/` puslapiuose (`/kategorija/katems/` turi H1 „Prekės katėms“ — turinio blokas); 21 pavadinimų dublikatų grupės (Konservų rinkinys katėms ×3, Trixie striukės…); 726 pavadinimai > 70 simb. · **aukšta** (kartu su #6) · Taisymas: (1) Rank Math kategorijų title šablonas `%term% – prekės, maistas ir priežiūra | Petshop.lt` + meta iš aprašymo; (2) prekių meta fallback šablonas `%title% – %customfield(brand)%. Pristatymas per 1–3 d. d., nemokamas į paštomatą nuo 30 €.` (Rank Math kintamieji); (3) H1 per child theme `woocommerce_show_page_title`; (4) gamintojų puslapiai: 20 top brendų po 600–1 000 ž. (Exclusion, Josera, Animonda, Ontario, Miamor, Hikari, Ambrosia, Monge, Prins, RC…) — tai ir AI citavimo puslapiai; (5) 6 viršutinių kategorijų tekstai · C 1 d. + R tekstai.

**S5. Struktūriniai duomenys** · prekė: Organization(logo, tel, adresas) + Product(offers 39.99/InStock, brand, gtin, ship, return, img, be rating) + Breadcrumb — tvarkinga; titulinis: Organization tik `name` (be logo/tel/sameAs), Rank Math titulinį žymi `Article + Person` (S1689s #9 neatlikta); `/skaiciuokle/` — Article + WebApplication + FAQPage; Rank Math Local SEO: darbo laikas Mon–Sun 09–17 (sekmadienis?) — neatitinka AV 15:00 taisyklės; `shippingDetails` kainos be PVM (1,78 / 3,30) vs puslapyje 2,15 / 3,99 · **vidutinė** · Taisymas: titulinio schema → WebPage/Organization su logo/telephone/sameAs (FB/IG), shippingDetails su PVM, opening hours pagal faktą · C 1 val.

**S6. GSC prieš/po** (`ps_fakt_gsc_url_d`, 08-10…09-08 vs 09-10…21) · paspaudimai/d 23,9 → 26,0 (+9 %), parodymai/d 1 691 → 1 626 (−4 %), URL su parodymais 1 115 → 1 430; didžiausi parodymų kritimai — senų formatų URL (`/cvergsnauceris` 105→58/d, `/` 160→114, `/kaukazo-aviganis` 93→64, „šuo kasosi“ 26→10/d ir 30→8 paspaudimų) — dalis persikėlė į naujus URL su `/`, todėl per URL lyginti nepatikima; po T-0 tipais: kita/turinys 749 URL — 203 paspaudimai, prekės 542 — 60, home 26, kategorijos 71 — 13, seni 26 — 6, gamintojai 41 — 4 · išvada: migracija nepakenkė, bet komercinių puslapių organikos beveik nėra (buvo ir prieš).

**S7. 404 (14 d.)** · `ps_seo_404` 6 148 įrašai; ~500–900 hitų/d, iš jų 50–70 % botai/skeneriai (`.env.*`, `phpinfo`, `read-document`); realūs iš Google: `/sunims/prieziuros-priemones` 47 (dabar 301 ✓), `/prekes-zenklas/exclusion` 26 (301 ✓), `/register` 27 (404 — nukreipti į /paskyra/), `/daugiau-pigiau/katems-…` 29 (404), `/exclusion-me-mono-noble-grain-…-1-5-kg` 33 (404 — prekė nebėra?), `/konservai-sunims-super-beno-…` ×2 po 28 (404), `/maistas-sterilizuotai-katei-su-antsvorio-problema…` (senas straipsnis, 404 — Google jį vis dar rodo) · **žema–vidutinė** · C: 5 rankiniai 301, straipsnį atkurti arba 301 į kačių sterilizuotų kategoriją.

**S8. Merchant Center / Bing** · Google feed 2 158 prekės, generuojamas 01:31; MC 2 070 approved (09-19). Bing MMC: 1 158 prekių atmestos dėl nuotraukų (S1709) — laukia ~10-01. Feed↔puslapio kainų sutikrinimas neatliktas (g:id = SKU, ne ID — kitas run'as).

**S9. Google Business Profile** — TŽ jo nemini; ar egzistuoja — nepatikrinta (R). Su „Atsiėmimas AV“ išjungtu GBP prasmė — tik brand paieška ir atsiliepimai.

### 2.3 Turinys ir paklausa

**T1. Kategorijų tekstai** · 80 kategorijų: 56 su aprašymu (≥100 simb.) ir Rank Math meta, 24 be (tarp jų 4 viršutinės su >50 prekių), 19 tuščių kategorijų (0 prekių — kandidatės į noindex/ištrinti). Subkategorijų tekstai (pvz. sausas maistas šunims, 306 simb.) — geri, bet apačioje ir trumpi.

**T2. Prekių aprašymai** · vid. 2 402 simb., 314 < 300 simb., 987 be trumpo aprašymo, 466 prekės dalijasi identiškais tekstais (Ebi žaislai ×13, petnešos ×12, Trixie…), 1 tuščias; VF/ZB aprašymai = tiekėjo kopijos (žymės šaltinio nėra) · organikoje prekės vis tiek nekonkuruoja — unikalūs tekstai tik top 50–100 pagal pardavimus (S1689s #6) · R+C etapais.

**T3. Raktažodžių spragos (WebSearch 21 užklausa + Perplexity 5 + ChatGPT 2)** · petshop.lt matomas 10/21: monoproteininis katėms (2), Exclusion (2), monoproteininis ėriena (2), šuo kasosi (3), hipoalerginis šunims (4), gyvūnų prekės internetu (4), atsiliepimai (4), skanėstai ausys (7), Josera SensiPlus kaina (8), Hikari (10). Nematomas: begrūdis šunims, sausas alergiškiems, sterilizuotoms katėms, Animonda GranCarno, zoo prekės internetu, kačių maistas be grūdų, „kiek maisto duoti šuniui“, „geriausias sausas maistas 2026“, zoo parduotuvė internetu. Dažniausi konkurentai: evet.lt 8, kaina24 6, alphazoo 5, po 4 — akvazoo, fera, mumbo, pet24, petplius, pigu, zoosalis · Spragos su puslapiu, kurio neturime: „begrūdis maistas šunims/katėms“ kaip landing (dabar filtras), „maistas sterilizuotoms katėms“ landing, „šunų maistas alergiškiems“ (sprendimų puslapis /sprendimai/ yra — bet neindeksuojasi užklausai), „hipoalerginis: vet dieta vs monoproteininis“ gidas (ChatGPT rėmas) · C rašo (Raimio taisyklė: žmonių kalba, .docx peržiūrai).

**T4. Konkurentai** (petshop.lt vs zoobaze, petplius per WebFetch; alphazoo, zoosalis, pethappy, e-zoo per naršyklę):

| | petshop.lt | zoobaze | petplius | alphazoo | zoosalis | pethappy | e-zoo |
|---|---|---|---|---|---|---|---|
| Platforma | Woo | — | — | Woo | Woo | Woo | PrestaShop |
| Nemok. paštomatas nuo | 30 € | 31,99 € | 29 € (Omniva) | ? | „Nemokamas pristatymas“ | 29 € | 25 € |
| Nemok. kurjeris | niekada | nuo 34,99 € | niekada | ? | ? | ? | ? |
| Pristatymo laikas prie prekės | ne | taip (data) | taip (1–3 d. d.) | — | — | — | — |
| Filtrai (sausas šunims) | 7 grupės | plačiausi (23 baltymai, veislės dydis) | tik brendas | — | „Hypoalerginis maistas šunims“ atskira kategorija meniu | — | — |
| Šėrimo lentelė / skaičiuoklė | taip / taip | taip / ne | ne | — | — | — | — |
| Atsiliepimai | 0 | ne | ne | ne | „Atsiliepimai apie mus 2024“ psl. | „Atsiliepimai“ psl. | ne |
| Live chat | ne | ne | ne | taip | taip | ne | ne |
| Tinklaraštis/veislės | ~230 str. + 21 veislė | ne | ~5 | ne | ne | ne | ne |
| Josera 12,5 kg | SensiPlus 39,99 | Festival 39,14 | Festival 42,35 | — | — | — | — |
| llms.txt / AI botų blokas robots | ne / ne | ne / ne | ne / ne | — | — | — | — |

Ko ≥2 konkurentai turi, o mes ne: pristatymo laikas prie prekės; atsiliepimų puslapis; live chat. Kur stipresni: turinys + skaičiuoklė + specialios mitybos filtrai. Perplexity „Josera SensiPlus 12,5“ kainos: petbaze 36,62, petplius 37,49, vet1 37,79 — mūsų 39,99 nepatenka; „Exclusion 12 kg“ — Petshop.lt cituojama, bet kaip „brangiau“ (97–107 € vs kainos.lt nuo 58,99 — kitos linijos).

### 2.4 AI sistemos ir botai

**A1. Blokavimas (kritinė)** · logai 09-18…24: GPTBot 144 (403: 71, be atsakymo 72; 200: 0), ChatGPT-User 1 076 (403: 508, 500: 30, be atsakymo 538; 200: 0), ClaudeBot 184 (403: 87, 200: 1 — vien robots.txt), python-requests 403; bridge testas iš paties serverio: GPTBot/ChatGPT-User/ClaudeBot → ryšys nutraukiamas per 26 ms (cURL 56), OAI-SearchBot/Claude-User/PerplexityBot/Applebot/Amazonbot/Bytespider/curl → 200. `.htaccess` UA taisyklių neturi, `petshop-sargas-saugumas.php` botų nefiltruoja → blokas serveriai.lt WAF/„bot protection“ lygmenyje. ChatGPT-User prašė `/` 303×, senų prekių URL (deli-nature, josera-indoor, /tibeto-mastifas) — realūs vartotojų klausimai · **kritinė** · Taisymas: R — serveriai.lt/DirectAdmin užklausa „atblokuoti UA GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-User, PerplexityBot, Google-Extended“ (arba nurodyti, kur išjungti); patikra — pakartoti `s1712/b.php` E fazę · C tekstas. Kol neatblokuota, llms.txt ir turinys AI nepadės.

**A2. Kas lanko** · OAI-SearchBot 2 267 (2 099×200; 1 515 nuotraukų, 301 wp-json oembed), PerplexityBot 2 579 (1 580 prekių, 285 kategorijų — pilnai skenuoja), Applebot 3 792, Amazonbot 3 755 (2 513 nuotraukų), Bytespider 2 283, Claude-User 12 (8×200 — vartotojų klausimai: „royal canin“, special-dog monoprotein, mitybos auditas), meta-externalagent 12, DuckAssistBot 6, mistral 4, CCBot 4, Google-Extended 5; AhrefsBot 3 020, SemrushBot 1 151, PetalBot 2 080, YandexBot 474 — nekenkia, bet gali būti apriboti.

**A3. Turinys be JS** · kaina, likutis („Turime“), aprašymas, schema — HTML'e (curl 291 KB su kaina); wp-json svečiams 401/404, `?rest_route=` 200 — AI botams nereikalinga.

**A4. Matomumas AI atsakymuose** · Perplexity 5 užkl.: cituota 2 (monoproteininis katėms — 3 vieta po pet24, petbaze; Exclusion 12 kg — kaip brangiausia); necituota: hipoalerginis šunims (pet24, evet, petcity), Josera kaina, greičiausias pristatymas (pet24, zooexpress, zooveta, evet, alphazoo). ChatGPT 2 užkl.: „hipoalerginis šunims“ — Pet24, zoobaze, superaugintinis, pigu, kaina24; rekomenduoja RC Hypoallergenic/Anallergenic, Purina HA, Hill's z/d, Specific — Exclusion neminimas; „Exclusion Hypoallergenic“ — Petshop.lt PIRMA (Horse & Potato 12 kg 78,19 €, Hydrolyzed 80,79 €, 2 kg 26,09 €), pigu, animu, kainos.lt · Kas didintų citavimą: (1) atblokavimas; (2) gamintojų + sprendimų puslapiai su faktais (kaina, pristatymas, sudėtis) — AI cituoja tekstus, ne filtrus; (3) „hipoalerginis: vet dieta vs monoproteininis“ gidas; (4) `/pristatymas/` su aiškiais skaičiais jau geras — trūksta „išsiunčiame per 1–3 d. d.“ prekės puslapyje; (5) llms.txt — mažas efektas, 15 min., daryti tik po (1).

## 3. Greiti laimėjimai (< 1 d. darbo, C, po Raimio „daryk“)

1. `WP_CACHE` įjungimas + testai (1,5 val.) — TTFB ×5.
2. Welcome modalas: cookie ant CTA + nerodyti profilio/skaičiuoklės/kasos puslapiuose (1 val.).
3. Kasos metodų eilė: paštomatas pirmas; Paysera šalių sąrašas LT/LV/EE (1 val.).
4. Rank Math: kategorijų/gamintojų title + meta šablonai, prekių meta fallback, H1 subkategorijoms/gamintojams (2 val.).
5. Schema: titulinio Organization (logo/tel/sameAs), Article→WebPage, shippingDetails su PVM, darbo laikas (1 val.).
6. Paieškos EN→LT sinonimai + nulinių rezultatų puslapis su kategorijomis ir alternatyvomis (3 val.).
7. 5 rankiniai 301 (`/register`, super-beno ×2, exclusion-me-mono 1,5 kg, sterilizuotos katės straipsnis) (30 min.).
8. Serveriai.lt laiško tekstas dėl AI botų (15 min.) — siunčia R.

## 4. Ko dar negalima vertinti (15 d.) — pakartoti ~11-15

- Filtrų Disallow poveikis: Googlebot filtrų dalis (34 % → ?), sitemap indeksuota (1 360/2 284 → ?), „Atrasta – neindeksuota“ 895.
- Organikos pozicijos prekėms/kategorijoms po meta/H1 šablonų (GSC 28 d. langas).
- Konversija pagal įrenginį: desktop add_to_cart 1 294 / 1 128 ses. vs mobile 680 / 1 690 — iki 09-24 į duomenis pateko savas darbas (analitika v1.3 švari bazė nuo 09-24); Shopping eksperimentas iki 10-08 iškreipia srautą.
- Anketos pildymas po modalo pataisos (bazė: 22 completed / 332 started).
- AI citavimas po atblokavimo (pakartoti tas pačias 7 užklausas).
- Bing MMC nuotraukų atmetimai (≈10-01), CWV CLS desktop (spalio vidurys).

## 5. Veiksmų planas (eilė) — įtraukta į S1696_VEIKSMU_PLANAS kaip 2.10–2.17

| Eilė | Darbas | Kas | Kada |
|---|---|---|---|
| 1 | Serveriai.lt: atblokuoti GPTBot/ChatGPT-User/ClaudeBot (+ patikra E faze) | R siunčia, C tekstas+patikra | dabar |
| 2 | WP_CACHE + testai | C („daryk“) | dabar |
| 3 | Modalas + anketa 1 žingsnis | C | dabar |
| 4 | Kasa: paštomatas pirmas, Paysera šalys | C („daryk“) | dabar |
| 5 | Rank Math šablonai + H1 + schema pataisos + 5 rankiniai 301 | C | šią savaitę |
| 6 | Paieška: sinonimai, nulinių rezultatų puslapis; #18054 Leger publikuoti | C; R | šią savaitę |
| 7 | Atsiliepimai: sprendimas (WC atsiliepimai + laiškas po 7 d. + senų importas iš eShoprent, jei yra) | R sprendimas → C | Sprintas 2 |
| 8 | Prekės puslapio blokas „pristatymas/€/kg/skaičiuoklė aukščiau“ — maketas | C maketas → R | Sprintas 2 |
| 9 | Gamintojų (20) ir 6 viršutinių kategorijų tekstai; gidas „hipoalerginis: vet dieta vs monoproteininis“; landing'ai begrūdis/sterilizuotoms | C .docx → R | Sprintas 2–3 |
| 10 | Mobili paieškos ikona antraštėje; DP pakų rikiavimas kategorijoje; GBP; FB paskyrų dublis | R sprendimai | — |

## 6. TŽ MASTER v1.88 — ko nepadaryta (klientui matomi punktai)

Iš 124 klientui matomų reikalavimų (išrašas `tz_reikalavimai.md`) gyvai neatitinka arba neuždaryta:

| TŽ | Reikalavimas | Būklė gyvai 09-24 |
|---|---|---|
| F19/§9, v1.42 | Prenumerata (20–30 SKU, 4/6 sav., pranešimas prieš siuntą, vieno paspaudimo atsisakymas, dunning) | Kodas yra (6 mu-pluginai `petshop-prenumerata*`, lentelės `ps_subscriptions` 0 įrašų), jungiklis `ps_prenumerata_ijungta=ne`, SKU sąraše 3 rinkiniai; prekės puslapyje nerodoma. §9.6 (auto vs rankinis mokėjimas) neuždarytas — **Raimis žino, nepamiršta** |
| F22/§4.4 | Lojalumo taškai 1 € = 1 taškas, startas 08-15 CONDITIONAL | Nėra (opcijų/usermeta nėra; `ps_fakt_uzsakymai.tasku_*` laukai tušti) |
| F30b / Q19 | Atsiliepimai „production'as jau turi“; senų atsiliepimų perkėlimas | 0 atsiliepimų, skirtukas nerodomas, Q19 neuždarytas |
| §? (S170) | /apmokejimas/ žada Visa/Mastercard | Kasoje tik Paysera (bankai + „kitos mokėjimo sistemos“) ir pavedimas — kortelių pasirinkimas aiškiai nerodomas; R patikrinti Paysera projekte |
| F9 | 4 paštomatų vežėjai (tikslas) | 2 (Venipak, LP Express); Omniva/DPD nėra |
| v1.40 | Homepage: hero = 5 situacinės kortelės, srautas į Sprendimų puslapius | Hero — viena kortelė + 4 žymos; „Rinkitės pagal poreikį“ blokas yra; Ads/organika veda į prekes/kategorijas (landing: prekė 52 %, kategorija 22 %, home 12 %, sprendimai/info 6 %) |
| v1.43 P0 | „Mano augintinis“: profilis su pirkimų istorija, „Pakartoti / Priminti / Pridėti prie prenumeratos“ | Anketa + profilis yra; pirkimų kortelės su „Pridėti prie prenumeratos“ — ne (prenumerata išjungta); istoriniai klientai paskyroje istorijos nemato (S1688) |
| NF19 | WCAG 2.1 AA | Netikrinta iš naujo; S1689s 93–94 (kontrastas) |
| §2.2/NF1 | LCP ≤ 2,5 s ✓, TTFB — nėra tikslo, bet CrUX AVERAGE | Kešas išjungtas (žr. #2) |
| DoD #17 | Beta testas su 5–10 klientų | Neužfiksuotas |
| Q-ESYBES-2 | Dvigubos HTML esybės 316 aprašymuose / 431 trumpuose | Puslapyje renderinasi teisingai (patikrinta #33990) — klientui nematoma; meta aprašymai iš excerpt trumpi („Draskyklė katėms.“) |
| Q-TEST-PAV | 7 „TEST…“ prekės | 0 publikuotų — sutvarkyta |
| — | Google Business Profile | TŽ nemini; būklė nežinoma |

Skaitiniai pažadai gyvai: nemokamas paštomatas nuo 30 € ✓; mažo krepšelio mokestis 1,21 € ✓ (/pristatymas/); išsiuntimas 1–3 d. d. (tekstas S1709) — TŽ sakė 2–5 d. d. pristatymas; grąžinimas 14 d. ✓ (/grazinimas/); 404 nulinė tolerancija — realūs Google 404 sutvarkyti 09-24, liko 5 (žr. S7).

## 7. Šaltiniai

- Bridge: `ps-bridge/s1712/a.php` (A inventorius, B/C HTML, D redirect/feed), `b.php` (B paieška/anketa/GSC, E UA testai/TTFB/kešas, L logai), `c.php` (F blokavimo priežastis, GSC prieš/po, 404 dabar), `d.php` (G esybės, puslapiai); rezultatai `s1712/*_last.json`.
- Agentų failai (debesyje, sesijos aplanke): `konkurentai_full.md`, `serp_matomumas.md`, `tz_reikalavimai.md` (124 eil.).
- Naršyklė: petshop.lt mobile (home, kategorija, prekė, paieška ×18, krepšelis, kasa ×2, modalas/anketa), Perplexity ×5, ChatGPT ×2 (Raimio paskyra), alphazoo/zoosalis/pethappy/e-zoo.
