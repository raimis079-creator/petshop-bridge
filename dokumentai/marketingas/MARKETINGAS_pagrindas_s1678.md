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
