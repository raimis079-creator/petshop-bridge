# RELAUNCH laiškas — analizė ir sprendimai (2026-09-16, S1688)

Pagrindas: 4 lygiagretūs tyrimai (temos/atidarymai, win-back atvejai, elgsenos kabliukai, pristatomumas + LT teisė), ~200 šaltinių, 2022–2026. Pilni tyrėjų raportai — sesijos žurnale; čia tik tai, kas keičia sprendimus.

## 1. Pagrindinė išvada: laiško tikslas neteisingas

- Win-back laiškai 1–5 m. dormantams parduoda **0,1–0,5 %** (Klaviyo mediana užsakymų 0,07 %, Stripo 2026 – 0,54 %, Return Path 33 mažmenininkai – skaitymas 12 %). Tai blogiausia automatizacija pagal pajamas; jos vertė — sąrašo higiena.
- Papildymo (replenishment) laiškai maisto kategorijoje: open 46–55 %, CTR 5–6 %, **užsakymai 2–5 %** — 10–40× geriau.
- Vadinasi: relaunch laiško darbas — **ne parduoti, o perkelti klientą į priminimų variklį** (`ps_refill_tracking`, `petshop-pakartoti`, soft opt-in). Vienas paspaudimas „Priminti, kai baigsis" = klientas grįžta į sistemą, kuri jau pastatyta ir kuri parduoda. Tai sutampa su strateginiu prioritetu (prenumerata be įsipareigojimų).
- Return Path: 45 % win-back gavėjų vėliau įsitraukė, iš jų 76 % pirmo laiško net neatidarė, vidutiniškai po 57 d. → **serija, ne vienas laiškas**; pirmo laiško rezultatas nėra galutinis.

## 2. Kas atidaro laišką (įrodymai)

| Svertas | Efektas | Šaltinis |
|---|---|---|
| Siuntėjas „Vardas iš Petshop.lt" vs vien brendas | +57 % (A/B >10 k), +3,8 % (MailerLite 20 k kamp.) | Mindberry, MailerLite |
| Aiški tema vs kūrybiška/mįslė | +541 % atsako (AWeber/MarketingSherpa) | Sherpa |
| Tema ≤40 simb., raktažodis pirmuose 3 žodžiuose | top-performer tikimybė +45 % | MailerLite, NN/g |
| Custom preheader | +5,4 p.p. open (GetResponse 4,4 mlrd.), +22,6 % (MailerLite) | |
| Vardas temoje | RCT +20 % (Sahni), bet masiškai −6 p.p. (GetResponse) — veikia **prekės**, ne vardo personalizacija | Chicago Booth, Klaviyo |
| Emoji | −4,7 p.p.; suvokiama kaip pigiau | GetResponse, NN/g |
| Klausimas temoje | neutralu (39,5 vs 39,6 %) | GetResponse |
| Paprastas HTML / tekstas pirma vs hero paveikslėlis | CTR +5,3 % / +21 % | HubSpot 0,5 mlrd. |
| Laikas Europoje B2C | an.–kt. 9–11 val.; savaitgaliai <15 % | GetResponse, MailerLite, Brevo |
| „We miss you" vs „Come back" | 13 % vs 12,7 % — tonas skirtumo neduoda | Return Path |

Metrika: Apple MPP užskaito 55–60 % atidarymų → **open rate nėra KPI**. KPI: paspaudimai, priminimų registracijos, užsakymai per 7 d. (click) + 30 d. stebėjimas, 10 % holdout.

## 3. Kas priverčia paspausti (elgsena)

- **Personalizacijos paradoksas** (Aguirre, J. Retailing 2015): personalizacija kelia paspaudimus tik kai pasakyta, iš kur žinom („nes pirkote pas mus 2024 m."). Nepasakius — nejauku, klikai krenta.
- **Smalsumo spraga** (8 977 antraščių testai, Sci. Reports 2024): konkretumas laimi; miglotumas kenkia 51 % testų. Vienintelė leistina „spraga" — skaičius, kurį norisi patikrinti („užtenka ~55 d.").
- **Endowed progress** (Nunes & Drèze: 34 % vs 19 %): „Jūsų profilis jau užpildytas — gyvūnas, maistas, dozė. Liko vienas paspaudimas."
- **Pastangų mažinimas**: vienas mygtukas, vienas veiksmas, be slaptažodžio.
- **Sąžiningas praradimo rėmas** veikia, netikras deadline'as — kenkia reputacijai.
- Gyvūno vardas — po 5 m. gyvūno gali nebebūti; naudoti tik ≤2 m. segmentui su rėmu „jei X vis dar su jumis".
- Nutrūkimo priežastys: 37 % operacinės (pristatymas, aptarnavimas), kaina — 5 % (Retently, 240 k). Nuolaida nėra svertas — MeUndies: nuolaida +15 % vs be nuolaidos, ne lemiama.

## 4. Kodėl dabartinis v0.3 „neužkabina" — diagnozė

1. Tema „Maišas 65,99 €. O diena?" — mįslė nuo nepažįstamo siuntėjo (aiškumas > kūrybiškumas).
2. Nepasakyta, iš kur žinom prekę → personalizacijos paradoksas veikia prieš mus.
3. Herojus — skaičiuoklė (mūsų idėja), ne kliento šuo ir ne nauda jam.
4. CTA „Mano pirkimai" veda į login formą, o ne į vienintelį naudingą veiksmą.
5. Nuotrauka pirma, tekstas antras (mobiliajame — visas pirmas ekranas).

## 5. Rekomendacija — v0.4 struktūra (CALC segmentui)

- **Siuntėjas:** „Raimundas iš Petshop.lt", reply-to gyvas adresas.
- **Tema (≤40 simb.):** `{Prekė trumpai} – dar šeriate?` → „Eukanuba Dermatosis 12 kg – dar šeriate?" (reikia lauko PS_HERO_TRUMPAI: brendas + linija + svoris).
- **Preheader:** „Užtenka ~54–60 d. Galime priminti, kai baigsis. Be akcijų."
- **Pirma eilutė (šaltinis!):** „Paskutinį kartą pas mus pirkote Eukanuba Dermatosis FP 12 kg — todėl rašome tik apie ją."
- **Nauda (2–3 eilutės, tekstas):** „20 kg šuniui maišo užtenka ~54–60 d., ~1,10 € per dieną (gamintojo lentelė). Galime priminti likus savaitei — ir nieko daugiau."
- **Vienas CTA:** „Priminti, kai baigsis" → vienas paspaudimas = `ps_soft_optin_eligible`+refill tracking pagal paskutinį užsakymą, patvirtinimo puslapis su svorio patikslinimu (skaičiuoklė čia, ne laiške).
- **Antrinė nuoroda tekstu:** „Užsakyti tą patį dar kartą" → prekė.
- **Pabaiga:** „Jei nebeaktualu — atsisakykite, daugiau nerašysime. Gaunate, nes pirkote petshop.lt." + rekvizitai + unsubscribe.
- Be hero nuotraukos viršuje; miniatiūra prie prekės eilutės. ≤80 žodžių iki mygtuko.

**Serija:** L1 (aukščiau) → po 10–14 d. neaktyviems L2 „Persikėlėme į naują svetainę — jūsų užsakymai išsaugoti" + tas pats CTA → po 14 d. L3 permission pass „Ar dar rašyti? [Taip] [Ne]". Be atsako → suppression.
**Segmentai:** CALC/PRODUCT (≤24 mėn.) — pilna serija; 12–24 mėn. be maisto — L2+L3; **>24 mėn. — tik L3** (vienas re-permission, po jo tyla).
**Laukiami rezultatai (1 banga ~1 180):** CTR 2–4 %, priminimų registracijos 1–3 % (12–35 klientai), užsakymai per 30 d. 0,5–1,5 %. Tai mažai — todėl tikslas yra variklio pildymas ir bazės valymas, ne rugsėjo apyvarta.

## 6. Prieš siunčiant — privaloma

1. **DKIM/SPF/DMARC** petshop.lt Sender'yje (CNAME `sender._domainkey` → `dkim.sendersrv.com`, SPF `include:sendersrv.com` sujungti su esamu, `_dmarc p=none` su rua). Be to — Gmail/Outlook spam arba reject.
2. **Validacija** visų >6 mėn. adresų (~4 000 × ~0,005 € ≈ 20–30 €; ZeroBounce/Bouncer/EmailListVerify). Prognozė: 12–24 mėn. 8–15 % negaliojančių, >24 mėn. 25–45 %; perdirbtos spam-gaudyklės realios >24 mėn.
3. Google Postmaster Tools (petshop.lt TXT), Microsoft SNDS per Sender support.
4. **Bangos:** B1 561 sutikę 300/d.; B2 calc 500/d.; B3 product+G1+G4 500/d.; 48 h pauzės; B4 12–24 mėn. 400/d.; B5 >24 mėn. tik po B4, 250/d., vienas laiškas. **Stop:** bounce >2 %, skundai >0,1 %, Postmaster reputation Low/Bad → 7 d. pauzė.
5. Sender.net: List-Unsubscribe (RFC 8058) deda pats; slenksčiai bounce <0,5 % gerai / >2 % kritiška, skundai >0,3 % kritiška.

## 7. Teisė (ERĮ 81 str. 2 d.)

- Termino nėra nei ERĮ, nei VDAI gairėse (tik Airija turi 12 mėn.). Riba — „pagrįsti lūkesčiai".
- **Silpnoji vieta — 4 sąlyga:** galimybė nesutikti turėjo būti *renkant* el. paštą (senos platformos checkout'e). Jei eShoprent kasoje tokios pastabos nebuvo — soft opt-in formaliai netaikomas. **Raimiui patikrinti senos platformos checkout privatumo tekstą / sutarties tekstą.**
- Rizika: ≤12 mėn. žema; 12–24 mėn. vidutinė; >24 mėn. aukšta → vienas re-permission laiškas, po jo tyla. VDAI 2025 sprendimas 3R-553: už vieną laišką be pagrindo — nurodymas, ne bauda; sistemiškai — iki 3 % apyvartos.
- Kiekviename laiške: „Gaunate, nes pirkote petshop.lt", rekvizitai, nemokamas atsisakymas; žodžio „naujienlaiškis" B4–B5 vengti.

## 8. Sprendimai Raimiui

1. Laiško tikslas = priminimų registracijos (ne užsakymai)? — keičia CTA ir KPI.
2. Siuntėjo vardas — „Raimundas iš Petshop.lt" ar „Petshop.lt"?
3. Serija 3 laiškų (L1/L2/L3) ar vienas?
4. >24 mėn. (1 967): vienas re-permission laiškas ar nesiųsti visai?
5. Senos platformos checkout — buvo opt-out pastaba? (lemia teisinį pagrindą 12–24+ mėn.)
6. Validacija ~25 € — pirkti? Kurį servisą?
7. DKIM DNS įrašai serveriai.lt — daro Raimis ar Claude paruošia tikslius įrašus?
8. Gyvūno vardas laiške ≤2 m. segmentui — naudoti?
