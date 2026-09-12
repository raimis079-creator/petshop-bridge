# Marketingo / verslo plano pagrindas — S1678 (2026-09-12 vakaras)

## Tikslas (Raimis)
- petshop.lt apyvarta **€50 k/mėn. iki 2027 pabaigos** — tai MINIMUMAS, ne siekiamybė. Bazė dabar ~€300–400/d. (~€10–12 k/mėn.) → 4–5×.
- Ta pati komanda (Raimis + Inga), dienos Ads biudžetai nedidinami „aklai". Avesos didmena — atskiras kanalas, plane neliečiamas (viešo registro Avesos skaičiai ≠ petshop.lt).
- Raimio pozicija: mažos 3–4 žmonių firmos daro €3–4 mln./m.; mažas žaidėjas — greitas ir imlus pokyčiams; LT rinka didelė, „reikia kelis procentus atimti".
- Ne „Ads + prenumerata + refill" — tai jau žinoma. „Analizė be plano — popierius."

## Kas atlikta
1. **Tyrimas 1 — globalūs zoo lyderiai** (`TYRIMAS_1_zoo_lyderiai_s1678.md`): Chewy Autoship 79 % pardavimų; zooplus >90 % recurring, private label 17 %; Musti savi/išskirtiniai brendai 51 % su +10–15 p.p. marža; Krakvet (PL) 137 mln. zł iš mažo starto; Pets.com žlugimo pamoka (subsidijuotas siuntimas, CAC > AOV). Benchmarkai: repeat 30–45 %, prenumeratos churn 4–8 %/mėn., LTV:CAC 3–4,5:1, gross margin 25–45 %. Private label sausam maistui — MOQ 9–18 t (ne mums); skanėstai/konservai — realu; pirma — exclusive distribution.
2. **Tyrimas 2 — LT/Baltijos rinka** (`TYRIMAS_2_LT_rinka_s1678.md`): LT pet food ~US$147 mln. (Statista 2025) / ~€232 mln. (platesnė apimtis), auga tik ~3 %/m. → „nemokamai" iš augimo ~€1 k/mėn. Konkurentai: KIKA €65 mln. (nuostolinga), Pet24 €5,7 mln. (pelninga, benchmark), Zoobaze €5,2 mln. (augimas sustojo), PetCity (nuostolinga), zooplus (į LT €4,99, nemok. nuo €69,90, nėra LT serviso, NĖRA pigesnis pagrindiniuose SKU). Baltos dėmės LT: tikra prenumerata, gilus nišinis turinys, online konsultacija, BARF/šaldytas.

## Raimio korekcijos po tyrimų (svarbiausia)
- Tyrimai per platūs. Su dideliais kaina nekariaujam — sutinka. Bet **realiausias šaltinis — dešimtys mažų LT zoo e-shopų** (kainų portaluose per brendą 5–15 pardavėjų: Zookaralyste, Petplius, Alphazoo, Vet1…): senos platformos, netikslūs likučiai, „1–3 d. d.", neprisirišę klientai.
- **Senos svetainės lojalūs klientai mėgo petshop.lt už pristatymo greitį ir patikimumą** (klientų žodžiai). „Greitis" = **pristatymas per 2, max 3 d., nuspėjamai** (nuolatinis konservų pirkėjas skambino, kai terminas buvo 4–5 d.). Dropship tam netrukdo — kelias atidirbtas.
- Pardavimų istorija rodo tik tai, ką Raimis pardavinėjo (ribotas asortimentas), ne ko klientai ieškojo → asortimentui reikia IŠORINĖS paklausos, ne istorijos.

## Sutarta plano ašis
1. **Greitis + patikimumas kaip įrodomas pažadas** (terminas prie prekės/krepšelyje = tai, ką sistema realiai daro; matavimas; kanalas, per kurį tai išgirsta mažų shopų klientai).
2. **Nišos gylis** (hipoalerginis/mono/begrūdis, natūralūs skanėstai, Hikari/tvenkiniai, egzotika) — ten, kur Pet24/Zoobaze platūs, bet negilūs.
3. **Prenumerata / CRM** ant 5,7 k bazės.

## Kiti žingsniai (3 etapas — faktai)
- **Paklausos žemėlapis:** (1) Google Keyword Planner LT — Claude duoda ~150 užklausų sėklą, Raimis eksportuoja CSV; (2) Search Console — Raimis prideda SA `claude-gtm-manager@prefab-envoy-482617-b4.iam.gserviceaccount.com` kaip GSC vartotoją, Claude traukia užklausas (kur rodomės be prekės = spraga); (3) Ads paieškos terminai (recon); (4) svetainės paieška + 404 (547 keliai); (5) konkurentų tankis per brendą/kategoriją iš kaina24/kainos.lt. Rezultatas: apimtis × turim/neturim × konkurentų skaičius → asortimento sprendimai.
- **Istorija (10 169 užs.)** — tik pakartotinumui, ciklams (konservai kas N d.), maržai, „balastui" (0 pardavimų/12 mėn.).
- Tada **4 etapas — planas**: nuo €50 k atgal per unit-ekonomiką (užs./d. × AOV × repeat − CAC − fulfillment), ketvirčiais, pirmi 90 d., dokumentas repo.

## Faktai iš GSC + GA4 (90 d. iki 09-10; 86/90 d. — SENA svetainė, t. y. atskaitos taškas, ne verdiktas naujai) — `analize/s1678_gsc.json`
- SA `claude-gtm-manager` GSC (sc-domain:petshop.lt) ir GA4 (346051580) prieigą TURI — traukti per `irankiai/mjs_template_gsc_ga4_readonly_s1678.mjs` (nukopijuoti į `/home/claude/ps/mjs_template.mjs`, dummy PHP payload).
- **Organika = veislių straipsniai be pirkimo ketinimo**: „kaukazo aviganis" 6 352 rodymai (poz. 3,4, CTR 0,3 %), cvergšnauceris 3 032, mastifas, senbernaras, čiau čiau, taksas… Komercinės užklausos nematomos: „kačių maistas" poz. 43, „antkakliai šunims" 57, „josera katems" 14, „josera sunims" 15, „exclusion hypoallergenic" 9. Organika 90 d.: 1 936 sesijos, 62 užs., €2 165. → komercinis SEO nuo nulio = didžiausias pigus rezervas.
- **Kanalai 90 d. (GA4)**: Cross-network/PMax 7 663 ses. → 272 užs. (€10 551); Direct 962 → 120 (€5 333, lojali bazė, geriausia konversija); Paid Search 60; Referral (kainų portalai) 39; Organic 62; Social 4; **Email 0** — lojalūs klientai be jokio CRM.
- **Prekių paklausa pas mus**: Exclusion mažų veislių dominuoja ir konvertuoja; Katrinex koi 228 peržiūrų (daugiausiai); jaučio penis 178→127 krepš.→43 pirk.; Animonda Carny Kitten stiprus; kačių fontanas 193. **Tikrinti 0-pirkimų prekes** (nėra?/kaina?): Exclusion Hydrolyzed 108/0, arkliena 86/0, vabzdžiai 76/0, triušiena 60/0, Intestinal puppy 54/0.
- Svetainės paieška 90 d. — 16 užklausų (nenaudojama arba sekimas neveikia — tikrinti naujoje).
- Įėjimai: /exclusion 517 ses.→31 užs.; /quattro 470→10; straipsnis „šuo nuolat kasosi" 178→0.

## Skanėstai — Raimio pastebėjimas (B2B parduoda daug ausų/kojų/plaučių/skrandžių, petshop.lt mažai, kainos „nepadoriai mažos")
- GSC: rodomės tik „jaučio peniai šunims" (poz. 2,6 → 43 pirkimai — paklausa yra), „vištos koja" (1,9), „elnio ragas" (7,9), „kramtukai šunims" (5,8). **„Džiovintos ausys šunims", „kiaulių ausys", „plaučiai/skrandžiai šunims", „natūralūs skanėstai šunims" — 0 rodymų** → puslapių nėra/neindeksuoti.
- Vienetas = 1 vnt. už €1–3 (B2B kaina už kg persikėlė kaip kaina už vnt.) → priedas prie krepšelio, ne prekė. Mažmenos norma — svorinės pakuotės (100/250/500 g, 1 kg) 3–4× didmeninės už kg; klientas moka (4Dogs sūris €4,3, elnio ragas €7–10).
- **Svertas** (tiekimas + marža, kurių mažos LT parduotuvės neturi): skanėstų tipų puslapiai + hub'as (SEO), svorinės pakuotės + „skanėstų dėžė" (AOV), PMax kandidatai su aukšta marža.

## Diskusija su Raimiu 09-13 — tiekimo pusė ir svertai (žemiška dalis)
- **Skanėstai (Avesos didmena):** B2B perka zooparduotuvės/vet vaistinės, kurios pačios prekiauja internete. Formatai: plaučiai/skrandžiai/stemplės 500 g (perkami supakuoti, tiekėjo etiketė), ausys/kojos/snipai — maišai 100/200 vnt., parduodama po 1 vnt. „nefasuota" (taip ir aprašyta kortelėse — VMVT ženklinimo vengiama sąmoningai; savos etiketės B2B NEBUS). Yra popieriniai maišeliai su langeliu + lipdukas „Bon Appétit" (be pavadinimo/kiekio). Kainos: skrandžiai 500 g mažmena (B2B klientų) €8,99 / B2B €6,00; plaučiai €7,99 / €4,90; jaučio ausis savikaina €0,65+PVM, petshop.lt €1,29 su PVM (marža €0,42, 39 %) — rinkoje nuo €1,29 (dugnas), Sanadog 5 vnt. €5,99, pakuota kiaulės ausis €3,29. **Sprendimai planui:** 1 vnt. → ~€1,59; kiekio pakopos toje pačioje kortelėje (1/5/10 vnt.) per DP; „Skanėstų dėžė" ~€24,99 per MnM; 500 g pakuotės €7,99/8,99. Skanėstai istorijoje tik €7,7 k/12 mėn. — su tokiu tiekimu turi būti €20 k+. Agentūros Ads skanėstams nepasiteisino (vienetai po €1,29 negali apmokėti kliko — skanėstai = AOV ir SEO, ne atskira kampanija).
- **Hikari/Katrinex (veža pats iš PL, ciklas ~6 sav., galima užsakyti; atstovas kartais neturi):** realios maržos iš DB — akvariumams (Cichlid/Tropical/Algae) 38–49 %, Katrinex koi 50–63 %, koi 5/10 kg 33–41 %, Aquaris 10 kg 17 % (balastas). Likučiai 0–10 vnt., koi 5/10 kg 0–1, 14 juodraščių be savikainos. Istoriniai pardavimai per visą laiką maži (Cichlid Gold Medium 55, Micro Pellets 67) — niša niekada nemaitinta prekėmis; agentūros Ads Hikari tikėtinai žlugo dėl likučių/sezono. **Sprendimai:** akvariumų linija visus metus (kategorijų puslapiai „akvariumo žuvų maistas" poz. 17,6, „maistas ciklidams", „dugno žuvų tabletės"; likučiai 5–10 vnt., užsakymas kas mėn., 8–10 sav. atsarga); tvenkiniai — sezonas bal.–spalis, 2027 kovą įeiti su 5/10 kg + PMax nuo bal. 1. Įrankis `irankiai/s1678_h.php`, `analize/s1678_h.json`.
- **Exclusion:** Hypoallergenic — ~5 pardavėjai LT, Raimis 1–2 pagal kainą (kaina24), rinka laiko „vet klinikų maistu"; Mediterraneo — kainų karas kaip Josera. AV laikomos bėgamos pozicijos po kelis maišus, užsakyti galima bet kada. Mėginukai iš Exclusion/Josera — galimi, sąlygos neaiškios (Raimio veiksmas). **Idėja:** „Alergijos mėginių rinkinys" (4–5 monoproteinai po ~100 g, €5–7, kuponas perkant 12 kg) = eliminacinė dieta + lead magnet užklausoms „šuo alergija maistui"; paaiškina 0-pirkimų korteles (arkliena 86/0, vabzdžiai 76/0, triušiena 60/0, Hydrolyzed 108/0 — žmonės nedrįsta pirkti didelio maišo nežinomo skonio).
- **Kiti tiekėjai:** Josera/Exclusion kaina maksimali, tik kiekio bonusas (augimas gerina maržą); Ambrosia dropship su kainų kontrole (marža apsaugota); Georplast savas importas (+B2B); Dino Zoo (LV lyderis) — ne B2B/ne dropship, prekės tik per santykius (Ontario iš ten), riba — apyvartinės → naudoti taškiniais pirkimais pagal paklausą (5 prekės × 20 vnt., ne 50 × 5).
- **CRM istorija:** naujienlaiškius per Sender siuntė seniai, atidarymai maži, atsisakymų mažai; sutikimų būklė netikrinta (Raimio veiksmas / pasitikrinti prieš siunčiant).

## Istorijos faktai (ps_ist_fakt_*, 2023-11 → 2026-08) — `analize/s1678_k.json`, `s1678_k2.json`, `s1678_k3.json`
- Viso: 9 528 užs., 5 431 klientai, €393 k, **AOV €41,5** (GA4 €28 buvo iškreiptas). 12 mėn.: 3 461 užs., 2 163 klientai, €143,6 k (~€12 k/mėn.). **Mėnesiai 2024-08…2026-07 plokšti: 270–350 užs., €11–14 k — 2 metai be krypties.** Istorijoje savikainų nėra (0) — maržos tik nuo T-0 faktų.
- Pakartotinumas 12 mėn.: 1 600 pirko 1× (74 % klientų, 41 % pajamų, €58 k); 563 ≥2× (26 %, **59 % pajamų**, €85 k); 66 ≥6× (3 %, 18 %, €26 k, ~€400/kl./m.). Intervalas tarp pirkimų (≥3 užs.) — **81 d.** Grįžtantys AOV €47,2 vs nauji €35,7.
- **Kohorta** (1 905 kl., pirmas pirkinys prieš 12–24 mėn.): grįžo 27 %. Pagal pirmo pirkinio brendą: **Exclusion 48 %**, Hikari 38 %, Gnatek 38 %, Animonda/Miamor 35 %, Romar 33 %, Josera 27 %, Quattro 28 %, Ontario 27 %, Belocat 26 %, Trixie 17 %, Pess 16 %, Georplast 8 %. Pagal pirmą krepšelį: <€20 → 16 %, €20–35 → 28 %, €35–60 → 30 %, €60+ → 35 %. → Ads perka Exclusion/Hikari/Animonda klientus; pirmas užsakymas stumiamas virš €35.
- **Ciklinės prekės 24 mėn.:** Exclusion HYPS06 149 kl./334 pirk./2,2×/€14,3 k; HYPM11 63/178/**2,8×**/€10,7 k — du SKU = 17 % pajamų, ciklas ~3–4 mėn. → refill priminimas jiems = didžiausias CRM svertas. Animonda GranCarno/Vom Feinsten — dešimtys SKU po 2–3,3×/kl. (tie „2–3 d." klientai) → 12/24 vnt. dėžės kaina + prenumerata kas 2–4 sav.; Miamor Trinkfein 2,1×; kiaulės uodega 2,1×.
- **Krepšeliai 12 mėn.:** <€20 — 760 užs. (22 %) tik €10 k; €30–45 — 1 049; €45–70 — 815 (€45 k); **€70+ — 439 (13 %) = €40,7 k (28 %)**. Pristatymui klientai sumokėjo €28 k = 19,5 % apyvartos (~€8/užs. — TIKRINTI faktą) vs Pet24/Zoobaze nemokamas nuo €29–32 → slenkstis €35–40 + priedai.
- **Struktūra 12 mėn.:** šunys €76 k (1 247 kl.), katės €28 k (741); sausas šunų maistas €65 k (45 %), kačių maistas €20,7 k, skanėstai šunims €7,7 k, akvariumas €2,6 k, tvenkiniai €1,8 k. Brendai: Exclusion €26,6 k (340 kl.), Josera €21,4 k (357), Animonda €12,5 k (242), Quattro €7,3 k, RC €4,2 k, Romar €3,8 k, Miamor €3,7 k, Ontario €3,6 k, Hikari €3,5 k, Ambrosia €3,2 k, Belocat €2,8 k.
- **Geografija:** Vilnius 750 (22 %), Kaunas 393, Klaipėda 212, Šiauliai 97, Mažeikiai 81 — **~60 % regionai** → pažadas „2–3 d. visoje LT per paštomatą". Mokėjimai ~100 % Paysera banklinkai (Swedbank 57 %, SEB 24 %, Luminor 12 %).

## Tikslo aritmetika
€50 k/mėn. prie AOV €41,5 = ~1 200 užs./mėn. ≈ 40/d. (dabar ~290/mėn.). Kelias ne per 4× naujų (CAC €11–14, pirmas užs. nuostolingas), o: (1) iš 1 600 vienkartinių pusė pirktų antrą kartą (+€30 k/m. be reklamos), (2) 563 pirktų kas 60 d., ne 81, (3) AOV €41,5 → €50 (slenkstis, priedai, dėžės), (4) nauji tik iš nišų su 35–48 % grįžimu.

## Laukia iš Raimio (prieš planą v1)
1. Google Keyword Planner LT eksportas (Claude duoda sėklos sąrašą).
2. Exclusion/Josera mėginukų sąlygos (dydis, kaina, kiekiai, ar galima siųsti klientams).
3. Sender sutikimų/kontaktų būklė.
4. (vėliau) top B2B skanėstai pagal kg.

## Svertų sąrašas planui v1 (be tvarkos)
Pristatymo pažadas 2–3 d. (terminas kortelėje/krepšelyje = sistema) · skanėstų kainos/pakopos/dėžė · akvariumų linija + tvenkinių sezonas · Exclusion Hypoallergenic #1 LT + mėginių rinkinys · refill laiškai (Exclusion 12 kg ciklas, Animonda dėžės, „vėl yra", 2-o pirkimo pasiūlymas) · nemokamo siuntimo slenkstis €35–40 · komercinis SEO (brendų/kategorijų/skanėstų/akvariumų puslapiai) · Ads tik į nišas su aukštu grįžimu · Dino Zoo taškiniai pirkimai pagal paklausą.
