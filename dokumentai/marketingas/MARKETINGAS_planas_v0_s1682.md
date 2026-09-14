# petshop.lt marketingo / verslo planas — v0 (S1682, 2026-09-14)

Ankstesni: `MARKETINGAS_pagrindas_s1678.md` (istorijos faktai, skanėstai, tiekimas), `TYRIMAS_1/2_*_s1678.md`. Šis dokumentas — diskusijos 09-14 rezultatas; toliau dirbti nuo jo.

## 1. Diagnozė (faktai iš serverio, `analize/s1682_gsc_yoy.json`)
- 2 metai plokšti: ~€12 k/mėn., ~250 užs./mėn., AOV €41,5.
- Variklis buvo PMax: 50–60 % užsakymų 13 mėn. iš eilės (139–165/mėn. 2025-08…09, 107–151 2026-01…07) — ir tai BE MC feed'o (prekių skelbimų nerodė). Organika ~27–34 užs./mėn. (~10 %). Direct 46–63. Paid Search išjungta 2025-08.
- Užsakymai 2026-01…07 plokšti (GA4 231–292/mėn.). Kritimas: rugpjūtis −19 %, rugsėjis −47 % = migracija + PMax pertvarka + Ads be konversijų. Ne rinka, ne konkurentai, ne pavasaris (pavasarį krito sesijos, ne užsakymai).
- Organika 2025-08→2026-08: 1 178→719 paspaudimų (−39 %), nuo vasario; iškrito veislių straipsniai (skaitytojai) + keli komerciniai (šėrimo lentelė 73→0, kačių tualetai 39→2, josera katėms, Exclusion 12 kg). Brand „petshop" 22→5 paspaudimų — apie mus nebežino.
- Svetainė konvertuoja gerai: 4–5 % iš sesijų (rinka 2–3 %). Srautas mažas: ~5,5 k sesijų/mėn. €50 k prie 4,5 % = ~27 k sesijų/mėn. (5×). Per Ads (CPA €11–14) — €15–20 k/mėn., neįmanoma.
- Grįžimas (kohorta 12–24 mėn.): maisto pirkėjai ~30 % (Exclusion 48, Hikari 38, Animonda 35, Josera 27), aksesuarai 8–17 %. Be jokio email marketingo — norma, ne bėda. Grįžtantys perka kas 81 d. (12 kg maišas baigiasi per ~40 d.) → ~pusę maisto perka kitur.

## 2. Sutarta
- **Klientas = maisto ir skanėstų pirkėjas.** Visa kita — krepšelio priedas, ne durys. Pritraukimas, SEO, pirmo pirkimo pasiūlymai — tik maistas/skanėstai. KPI: nauji maisto klientai/mėn., ne užsakymai.
- **Tikslas €50 k/mėn. ≈ 1 000 aktyvių maisto klientų × €50/mėn.** Dabar ~560. Tai 2× klientų + gilesnė piniginė (81→60 d.), ne 4× užsakymų.
- **Bėda — per mažai naujų.** Išlaikymas — higiena, susitvarkys. Reikia sklaidos, kur mokama savikaina/laiku, ne Google kaina.
- **Žinutė vartotojui: „Mes žinom, kas maiše."** Tiekėjo žvilgsnis — KIKA/Pet24 to pasakyti negali. Fone (rodoma, nesakoma): pristatymas 2–3 d.

## 3. Planas — trys blokai

### 3.1 Variklis (spalis)
Feed-only PMax su MC 5321054797 po review (~09-15): tik maistas/skanėstai (`custom_label_1 ∉ {pigu, ne_reklamai}`, `label_0 ∉ {D, X}`), brand exclusion, tCPA €8. Be variklio nėra ką dauginti. Detalės: `ADS_PMAX_bukle_s1677.md`.

### 3.2 Išlaikymas (higiena, laiko klausimas)
- Refill/prenumerata ant ciklinių: Exclusion (3–4 mėn.), Animonda GranCarno/Vom Feinsten (2–4 sav.). Tikslas: intervalas 81 → 60 d.
- Skanėstas kiekvienoje AV siuntoje (dropship nepasiekia). A/B pagal užsakymo nr. → grįžimo %.
- Neaptarinėjam — darom.

### 3.3 Sklaida (plano širdis) — keturi svertai, visi kainuoja prekėmis/laiku
a) **Momentas, kai gyvūnas atsiranda namuose** — maisto įprotis formuojasi vieną kartą, niekas LT dėl jo nekovoja.
   - Prieglaudos: dėžė kiekvienam įsivaikinimui (skanėstai ~€2 savikaina + mėginukas + „pirmas maišas −20 %"), prieglaudai — maistas savikaina. CAC €3–5 + reputacija/žiniasklaida.
   - Veisėjai (ne vetai, ne B2B — partnerystė): šuniuko dėžė kiekvienam pirkėjui, veisėjui prekės savo šunims.
b) **Skanėstas kaip sklaidos valiuta** (savikaina €0,65 vs konkurentų kuponas): referral „atsivesk draugą — abu gaunat", mėginukai naujiems, dėžutė pas kirpėją / dresūros aikštelėje / parodoje, kortelė su kodu siuntinyje.
c) **Įrankiai, kurie skleidžia save**: šėrimo skaičiuoklė (veislė/svoris/amžius → gramai → €/mėn. pagal brendą → „užsisakyk mėnesiui"; M8 lentelės yra; buvo #1 organikos puslapis, dabar 0); veislių puslapiai perrašyti į „kuo šerti X ir kiek kainuoja per mėnesį" (tas pats srautas, su išėjimu į krepšelį); „Naujas šuo/katė namuose — pirmos savaitės rinkinys" (užklausos be įpročio, pirmas krepšelis >€35).
d) **Video kanalas** — Raimio vizija: animacinis herojus, juokinga edukacija su TIKROMIS prekėmis (ima Exclusion maišą, rodo sudėtį, sveria šunį), be Raimio veido, LT/AI balsas (kalbos keičiamos), gali eiti ir ne LT (bonusas, ne pardavimai). Principas (siūlomas, nepatvirtintas): mokyti šeimininką rinktis maistą pagal kriterijus, kurie rodo į mūsų asortimentą — kas išmoko vertinti, tas valdo sprendimą (KIKA mokyti negali — nuvertintų pusę lentynos). Vienas video = viena taisyklė + tikra prekė + konfliktas su mitu, 20–30 s; serija 2/sav. 6 mėn.; tęsinys svetainėje (skaičiuoklė, prekės puslapis su tuo pačiu video). Personažų/avatarų DAR NEGENERUOTI — pirma principas. Atviras: herojus iš tiekėjo pusės (autoritetas) ar iš kliento (artimesnis, juokingesnis; Claude siūlo antrą su pirmu kaip antriniu balsu). Matuoti: brand paieška GSC, srautas iš social į maisto puslapius, nauji maisto klientai — ne peržiūros.

## 4. Atmesta — negrįžtam
Vet klinikų/vaistinių kanalas (veterinarai-pardavėjai); EE/LV kaip plano kanalas; B2B per petshop.lt; smulkių zoo e-shopų perėmimas (atvirkštinė atranka); „šiandien Vilniuje" (kurjeris iki 11:00); Pigu.lt marketplace (irgi mokama reklama); plataus katalogo augimas; savo prekės ženklas/VMVT; refill laiškai ir siuntimo slenkstis kaip „svertai" (tai higiena); „kalbėjimas į kamerą" video.

## 5. Neaptarta / kitas žingsnis
- Eiliškumas sklaidos a–d (Claude: a ir c prieš d — d ilgiausiai užauga).
- Skaičiai: kiek naujų maisto klientų/mėn. iš kiekvieno sverto, kad €50 k susivestų (aritmetika ketvirčiais, pirmi 90 d.).
- Skanėstų kainos/pakuotės/dėžė (žr. pagrindą s1678) — įpinti į b) ir 3.2.
- Matavimo lentelė: nauji maisto klientai/mėn., intervalas, brand paieška, social srautas.
- Iš serverio dar neišimta: `ps_ist_*` kohortos — maisto pirkėjai, kurie negrįžo (kodėl).
- Laukia iš Raimio: Keyword Planner eksportas; Exclusion/Josera mėginukų sąlygos; Sender kontaktų būklė.

## Darbo principai (Raimis)
Diskusijos formatas; Raimis idėjų tiesiai nesako — Claude galvoja pats, ne atkartoja; pirma „ką norim pasakyti", tik po to „kaip"; ambicijas ginčyti, ne sakyti „nerealu"; „žemiška" analizė; aukščiausio lygio eksperto planas, ne vadybininko čeklistas; visi duomenys serveryje — tikrinti, ne klausti.
