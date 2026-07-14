# "Mano augintinis" — pilna specifikacija vizualui (M8)

> Šis dokumentas aprašo VISKĄ ką reikia žinoti norint sudėlioti vizualą.
> Nėra jokių dizaino sprendimų — tik logika, tekstai, scenarijai, laukai, elgsena.
> Raimis delioja vizualą pagal šią specifikaciją.

---

## 1. VARTOTOJO KELIAI (5 scenarijai)

### Kelias A — Naujas lankytojas (niekada nebuvo)

Ateina iš Google/reklamos/draugo nuorodos → mato homepage arba produkto puslapį.

1. Mato kvietimą "Papasakokite apie savo augintinį" (homepage bloke, popup, arba sidebar)
2. Pradeda anketą **BE prisijungimo** — jokio email, jokio slaptažodžio
3. Užpildo 1 žingsnį (gyvūno rūšis + vardas + pagrindinis poreikis) — ~15 sek.
4. Užpildo 2 žingsnį (detalės pagal gyvūną) — ~20 sek. Galima praleisti.
5. Mato savo augintinio kortelę su realiomis rekomendacijomis/nauda
6. Kortelė rodo: "Norite išsaugoti? Įveskite el. paštą"
7. Įveda email → gauna magic link → prisijungęs, profilis išsaugotas
8. Jei neįveda email — kortelė rodoma tik šios sesijos metu (saugoma naršyklės atmintyje). Kitą kartą atėjus — pasiūlymas vėl.

**Esmė:** pirma investuoja laiką ir pamato vertę, tada duoda kontaktą.

### Kelias B — Klientas iš welcome laiško

Gavęs welcome laišką su nuoroda "Užpildykite augintinio profilį".

1. Paspaudžia nuorodą laiške → atsidaro anketa su magic link prisijungimu (vienu paspaudimu)
2. Kadangi jau prisijungęs — anketa iškart saugojasi į DB
3. Po anketos → mato savo profilio kortelę
4. Gali pridėti kitą augintinį

### Kelias C — Esamas prisijungęs klientas

Jau prisijungęs (per magic link arba slaptažodį).

1. MyAccount meniu → "Mano augintinis" tab
2. Jei dar neturi profilio → mato kvietimą užpildyti (ne tuščią puslapį)
3. Jei turi → mato savo augintinio kortelę(-es)
4. Gali redaguoti, pridėti kitą, peržiūrėti priminimus/refill

### Kelias D — Klientas su vienu augintiniu

1. MyAccount → "Mano augintinis" → mato VIENĄ kortelę
2. Kortelė rodo: augintinio info + naudą (refill, priminimai, rekomendacijos)
3. Apačioje: "Pridėti kitą augintinį" nuoroda
4. Gali redaguoti (pieštukas arba mygtukas)

### Kelias E — Klientas su keliais augintiniais

1. MyAccount → "Mano augintinis" → mato SĄRAŠĄ kortelių
2. Kiekviena kortelė — vienas augintinis (su savo duomenimis)
3. Gali perjungti, redaguoti kiekvieną atskirai
4. "Pridėti dar vieną" mygtukas

---

## 2. GYVŪNŲ RŪŠYS (ne tik šuo/katė)

### Pasirinkimo sąrašas (1 žingsnis — "Kas jūsų augintinis?")

| Rūšis | Vidinis kodas | Turi papildomus klausimus? |
|-------|---------------|---------------------------|
| Šuo | dog | Taip (dydis, amžius, maitinimas, maistas) |
| Katė | cat | Taip (amžius, sterilizuota, maitinimas, maistas) |
| Paukštis / Papūga | bird | Minimaliai (rūšis tekstu, amžius) |
| Graužikas | rodent | Minimaliai (rūšis tekstu — žiurkėnas, triušis, jūrų kiaulytė...) |
| Žuvis / Akvariumas | fish | Minimaliai (gėlavandeniai/jūriniai) |
| Roplys | reptile | Minimaliai (rūšis tekstu) |
| Kitas | other | Tik vardas + laisvas teksto laukas |

**Šuo ir katė — pilni profiliai.** Kiti gyvūnai — baziniai (vardas + rūšies patikslinimas). Bet VISI turi vienodą profilio kortelę ir galimybę pridėti priminimus/nuotrauką.

**Kodėl svarbu turėti visus:** žmogus su papūga irgi perka pas mus (turim paukščių maistą). Jei jo augintinis "netinka" į sistemą — jaučiasi atstumtas. O mums bet koks profilis = kontaktas + grįžtamasis ryšys.

---

## 3. ANKETOS ŽINGSNIAI (detaliai)

### Žingsnis 1 — Pagrindinis (PRIVALOMAS, ~15 sek.)

**Viršuje (kontekstas):**
- Antraštė: "Papasakokite apie savo augintinį"
- Paantraštė: "Tai užtruks mažiau nei minutę"

**Laukai:**

**3.1. Gyvūno rūšis** (privalomas)
- Tipas: dideli pasirinkimo mygtukai (po vieną, NE multi-select)
- Pasirinkimai: Šuo, Katė, Paukštis, Graužikas, Žuvis, Roplys, Kitas
- Pasirinkus → rodo tik tam gyvūnui aktualius tolimesnius laukus
- Vienas profilis = vienas augintinis (jei turi ir šunį ir katę — sukuria du profilius)

**3.2. Augintinio vardas** (neprivalomas)
- Tipas: teksto laukas
- Placeholder: "Kaip vadinasi jūsų augintinis?"
- Jei nepildo — rodome "Jūsų [šuo/katė/paukštis]" vietoj vardo

**3.3. Kas šiuo metu aktualiausia?** (neprivalomas, TIK šuniui ir katei)
- Tipas: pasirinkimo mygtukai (vienas)
- Tai NE produkto savybė, o KLIENTO situacija
- Pasirinkimai:

| Rodomas tekstas | Vidinis kodas | Ką reiškia mums |
|----------------|---------------|-----------------|
| Kasdienė mityba | daily | Universalus, nėra specifinio poreikio |
| Jautrus virškinimas | digestion | Rodo digestive/sensitive produktus |
| Odos jautrumas / kasymasis | skin_allergy | Rodo hipoalerginius, monoprotein |
| Sterilizuotas / svorio kontrolė | sterilised | Rodo sterilised/light linijas |
| Išrankus augintinis | picky_eater | Rodo skanesnio skonio, wet food |

- Jei nepasirenka — sistema traktuoja kaip "daily" (bet nerodo, tiesiog default)

**CTA mygtukas:** "Tęsti" (jei bus 2 žingsnis) arba "Išsaugoti" (jei 2 žingsnis praleidžiamas)

**Progreso indikatorius:** "1 iš 2" arba progresinė juosta

---

### Žingsnis 2 — Detalės (NEPRIVALOMAS, ~20 sek.)

**Dinamiškas pagal gyvūną — skirtingi laukai skirtingoms rūšims:**

#### Šuniui (dog):

**3.4a. Amžiaus etapas**
- Tipas: pasirinkimo mygtukai
- Pasirinkimai: Jauniklis (iki 1 m.) | Suaugęs (1–7 m.) | Senjoras (7+ m.)
- Vidinis kodas: junior | adult | senior

**3.5a. Dydis**
- Tipas: pasirinkimo mygtukai
- Pasirinkimai: Mažas (iki 10 kg) | Vidutinis (10–25 kg) | Didelis (25+ kg)
- Vidinis kodas: small | medium | large
- Galima pridėti "Nežinau" (vidinis: unknown)

**3.6a. Maitinimo tipas**
- Tipas: pasirinkimo mygtukai
- Pasirinkimai: Tik sausas maistas | Daugiausia sausas | Mišrus (sausas + šlapias)
- Vidinis kodas: dry_only | mostly_dry | mixed

**3.7a. Dabartinis maistas**
- Tipas: autocomplete teksto laukas (NE paprastas input)
- Veikimas: vartotojas pradeda rašyti → sistema siūlo brendus iš mūsų katalogo
  (Josera, Exclusion, Ontario, Prins, Animonda, Rasco, Acana, Orijen, Royal Canin, Hill's...)
- Papildomi pasirinkimai (mygtukai po lauku):
  - "Nežinau tikslaus pavadinimo"
  - "Kitas maistas (ne iš sąrašo)"
  - "Šiuo metu nešeriu sausu maistu"
- Vidinis: jei pasirenka iš sąrašo → saugome brand slug; jei laisvas tekstas → saugome tekstą
- KODĖL svarbu: autocomplete leidžia tiksliai susieti su produktu → geresnis refill

#### Katei (cat):

**3.4b. Amžiaus etapas**
- Tas pats kaip šuniui: Jauniklis | Suaugusi | Senjorė
- Vidinis: junior | adult | senior

**3.5b. Ar sterilizuota?**
- Tipas: pasirinkimo mygtukai
- Pasirinkimai: Taip | Ne | Nežinau
- Vidinis: yes | no | unknown
- VIETOJ dydžio (katėms dydis dažniausiai neaktualus mitybai)

**3.6b. Maitinimo tipas**
- Tas pats kaip šuniui

**3.7b. Dabartinis maistas**
- Tas pats kaip šuniui (autocomplete)

#### Paukščiui (bird):

**3.4c. Paukščio rūšis** (neprivalomas)
- Tipas: teksto laukas
- Placeholder: "Pvz. papūgėlė, kakariki, žako..."

**3.5c. Amžiaus etapas**
- Pasirinkimai: Jauniklis | Suaugęs | Nežinau

#### Graužikui (rodent):

**3.4d. Graužiko rūšis** (neprivalomas)
- Tipas: teksto laukas arba dropdown
- Placeholder / pasirinkimai: "Triušis, Jūrų kiaulytė, Žiurkėnas, Žiurkė, Šinšila, Degu, Kitas"

#### Žuviai (fish):

**3.4e. Akvariumas** (neprivalomas)
- Pasirinkimai: Gėlavandeniai | Jūriniai / druskinio vandens | Tvenkinys

#### Ropliui (reptile):

**3.4f. Rūšis** (neprivalomas)
- Teksto laukas: "Pvz. barzdotasis agama, leopardinis gekonas..."

#### Kitam (other):

- Tik vardas (jau 1 žingsnyje) + teksto laukas "Kokį augintinį turite?"

**CTA:** "Išsaugoti"
**Papildomas:** "Praleisti — užpildysiu vėliau" (saugo tik 1 žingsnio duomenis)

---

### Žingsnis 2.5 — Nuotrauka (NEPRIVALOMAS, po 2 žingsnio arba profilio kortelėje)

**3.8. Augintinio nuotrauka**
- Tipas: failo įkėlimas arba fotoaparato paleidimas (mobiliam)
- Tekstas: "Pridėkite nuotrauką" su fotoaparato/paveikslėlio ikona
- Priima: JPG, PNG, WEBP, max 5 MB
- Automatiškai sumažina iki 400x400 px (thumbnail profiliu kortelei)
- Saugoma kaip WP attachment, ID susietas su augintinio profiliu
- Jei nėra nuotraukos → rodoma placeholder ikona pagal gyvūno rūšį (šuns siluetas, katės siluetas, paukščio ir t.t.)
- Gali pridėti/pakeisti bet kada iš profilio kortelės

**KODĖL svarbu:** nuotrauka sukuria emocinį ryšį. "Mano Reksas" su nuotrauka → grįžta pasižiūrėti. Be nuotraukos → tik duomenų eilutė.

---

## 4. PROFILIO KORTELĖ (ką mato po anketos)

### 4.1. Augintinio antraštė
- Augintinio nuotrauka (arba placeholder ikona pagal rūšį)
- Vardas (arba "Jūsų [šuo]")
- Rūšis + amžiaus etapas + dydis (viena eilutė, pvz. "Šuo · Suaugęs · Didelis")
- Redagavimo mygtukas (pieštukas arba "Redaguoti")

### 4.2. Mityba blokas
- Antraštė: "Mityba"
- Dabartinis maistas: "Josera SensiPlus" (jei žinome) arba "Nenurodyta"
- Maitinimo tipas: "Daugiausia sausas maistas"
- Poreikis: "Odos jautrumas" (žmogiškai, ne kodas)
- Vėliau čia galima rodyti: "Rekomenduojami produktai pagal Rekso profilį" → nuoroda į filtruotą katalogą

### 4.3. Papildymas (refill) blokas
- Antraštė: "Maisto papildymas"
- Jei yra aktyvus refill: "Maisto turėtų užtekti dar maždaug **23 dienoms**"
- Jei nėra: "Dar neturime pirkimo istorijos" arba nerodyti bloko
- Mygtukas: "Užsisakyti dar kartą" (nuoroda į produktą)
- Vėliau: "Nustatyti automatinį priminimą"

### 4.4. Priminimai blokas
- Antraštė: "Priminimai"
- Ikona: varpelis arba kalendorius (NE švirkštas — per mediciniškas)
- Jei yra: sąrašas artėjančių priminimų (pvz. "Skiepas — po 12 dienų")
- Jei nėra: "Pridėti priminimą" mygtukas
- Priminimų tipai (žmogiškai):
  - Skiepai
  - Dehelmintizacija (kirminų profilaktika)
  - Blusų / erkių apsauga
  - Veterinaro vizitas
  - Kirpimas / priežiūra
  - Kitas

### 4.5. Keli augintiniai
- Jei turi > 1 augintinį: kortelės viena po kitos (arba galimybė perjungti tab'ais)
- Kiekviena kortelė savarankiška (savo nuotrauka, savo duomenys, savo refill/priminimai)
- Apačioje visada: "Pridėti kitą augintinį" mygtukas

---

## 5. TUŠČIOS BŪSENOS (empty states)

### 5.1. Naujas klientas, dar neturi profilio
- NE "Čia tuščia" ar "Nėra duomenų"
- O kvietimas: "Susipažinkime su jūsų augintiniu" + anketos pradžios mygtukas
- Paantraštė: "Sukurkite profilį ir gaukite asmeninius pasiūlymus"

### 5.2. Profilis be refill duomenų
- Nerodyti tuščio refill bloko SU pilku "nėra duomenų"
- Arba nerodyti visai (pasirodys kai bus pirkimų)
- Arba rodyti: "Pirmą kartą užsisakę maistą — pradėsime sekti papildymo laiką"

### 5.3. Profilis be priminimų
- Rodyti kvietimą: "Pridėkite pirmą priminimą" su mygtuku
- Ne tuščią sąrašą

### 5.4. Profilis be nuotraukos
- Rodyti placeholder ikoną pagal gyvūno rūšį
- Ant ikona — fotoaparato ženkliukas "Pridėti nuotrauką"

---

## 6. TEKSTAI IR MIKROKOMUNIKACIJA

### 6.1. Anketos tekstai

| Vieta | Tekstas |
|-------|---------|
| 1 žingsnio antraštė | "Papasakokite apie savo augintinį" |
| 1 žingsnio paantraštė | "Tai užtruks mažiau nei minutę" |
| 2 žingsnio antraštė (šuo) | "Susipažinkime su [Reksu / jūsų šunimi]" |
| 2 žingsnio antraštė (katė) | "Susipažinkime su [Murziu / jūsų kate]" |
| 2 žingsnio antraštė (kitas) | "Dar keli klausimai" |
| Praleisti mygtukas | "Praleisti — užpildysiu vėliau" |
| Nuotraukos kvietimas | "Pridėkite nuotrauką" |
| Po anketos | "Puiku! [Rekso] profilis sukurtas." |
| Kvietimas išsaugoti (neregistruotas) | "Norite išsaugoti? Įveskite el. paštą ir atsiųsime prisijungimo nuorodą." |

### 6.2. Profilio kortelės tekstai

| Vieta | Tekstas |
|-------|---------|
| Tuščias profilis | "Susipažinkime su jūsų augintiniu" |
| Refill su duomenimis | "Maisto turėtų užtekti dar maždaug N dienų" |
| Refill be duomenų | "Pirmą kartą užsisakę maistą — pradėsime sekti" |
| Priminimai tuščias | "Pridėkite pirmą priminimą" |
| Pridėti augintinį | "Pridėti kitą augintinį" |
| Redaguoti | "Redaguoti profilį" |

### 6.3. Poreikių vertimai (vidinis kodas → ką mato klientas)

| Kodas | Rodoma klientui |
|-------|----------------|
| daily | Kasdienė mityba |
| digestion | Jautrus virškinimas |
| skin_allergy | Odos jautrumas |
| sterilised | Sterilizuotas / svorio kontrolė |
| picky_eater | Išrankus augintinis |

### 6.4. Rūšių vertimai

| Kodas | Rodoma klientui | Profilio kortelėje |
|-------|----------------|-------------------|
| dog | Šuo | Šuo |
| cat | Katė | Katė |
| bird | Paukštis | Paukštis |
| rodent | Graužikas | Graužikas |
| fish | Žuvis | Žuvis |
| reptile | Roplys | Roplys |
| other | Kitas | (rodo laisvo teksto rūšį) |

---

## 7. ELGSENOS TAISYKLĖS

### 7.1. Vienas profilis = vienas augintinis
- JOKIO "abu" pasirinkimo
- Jei turi šunį ir katę → sukuria du atskirus profilius
- Kiekvienas turi savo vardą, nuotrauką, duomenis, refill, priminimus

### 7.2. Anketa be prisijungimo (naujas lankytojas)
- 1-2 žingsniai veikia be autentifikacijos
- Duomenys saugomi naršyklės localStorage (arba sessionStorage)
- Po anketos rodoma kortelė su CTA "Išsaugoti — įveskite el. paštą"
- Įvedus email → magic link → po prisijungimo duomenys persikelia į DB
- Jei neišsaugo → duomenys dingsta uždarius naršyklę (sessionStorage) arba lieka iki 30 d. (localStorage)
- NIEKADA nesaugome neregistruoto vartotojo duomenų serveryje

### 7.3. Autocomplete "Dabartinis maistas"
- Brendų sąrašas iš mūsų WC katalogo (product brands taksonomija)
- Rodo tik aktualius (jei pasirinko šunį — tik šunų maisto brendus)
- Jei nerandame — leidžiam įvesti laisvą tekstą
- Specialūs pasirinkimai po lauku: "Nežinau", "Kitas", "Nešeriu sausu maistu"

### 7.4. Nuotrauka
- Max 5 MB, JPG/PNG/WEBP
- Automatiškai crop'inama/resize'inama iki 400x400
- Saugoma kaip WP media attachment
- Gali pakeisti bet kada (profilio kortelėje)
- Privacy: nuotrauka matoma TIK pačiam vartotojui (ne vieša)

### 7.5. Profilio redagavimas
- Visus laukus galima redaguoti bet kada iš profilio kortelės
- Redagavimas naudoja tą pačią anketos formą (tik pre-fill'inta esamais duomenimis)
- Po redagavimo → atnaujina profilio kortelę realiu laiku

### 7.6. Augintinio šalinimas
- Galima ištrinti augintinio profilį
- Prieš šalinimą: patvirtinimo klausimas "Ar tikrai norite ištrinti [Rekso] profilį?"
- Ištrynus: susijusi refill ir priminimai deaktyvuojami (ne ištrinami — auditui)

---

## 8. KUR ANKETA PASIEKIAMA (entry points)

### 8.1. MyAccount tab (prisijungusiems)
- Naujas tab WooCommerce "Mano paskyra" meniu: "Mano augintinis"
- URL: /my-account/augintinis/
- Pagrindinis entry point prisijungusiems

### 8.2. Homepage blokas (visiems)
- Flatsome sekcija homepage: kvietimas užpildyti anketą
- Tekstas: "Sukurkite augintinio profilį — gaukite asmeninius mitybos pasiūlymus"
- Mygtukas veda į anketos formą (veikia be prisijungimo)

### 8.3. Welcome email nuoroda (naujiems klientams)
- Po pirmo pirkimo (arba registracijos) siunčiamas welcome laiškas
- Laiške nuoroda: "Papasakokite apie savo augintinį" → veda į anketą

### 8.4. Checkout sidebar (ateityje)
- Po apmokėjimo (thank you page) pasiūlymas: "Kol laukiate siuntos — sukurkite augintinio profilį"
- Mažiau prioritetinis, bet geras konversijos taškas (klientas jau investavęs)

### 8.5. Quiz popup (ateityje, soft launch)
- Landing page arba po tam tikro laiko svetainėje
- "Padėkime rasti tinkamą maistą" tipo quiz → veda į anketą
- Tai soft launch "waitlist + quiz" dalis

---

## 9. BACKEND SĄSAJA (kas jau padaryta ir ką frontend naudos)

### 9.1. REST API endpoint'ai (jau veikia)

| Metodas | URL | Ką daro | Reikia prisijungimo? |
|---------|-----|---------|---------------------|
| POST | /petshop/v1/pet-profile | Sukurti/atnaujinti augintinį | Taip |
| GET | /petshop/v1/pet-profile | Gauti sąrašą augintinių | Taip |

### 9.2. Duomenų laukai (DB — jau egzistuoja, reikės papildyti)

**Esami laukai (ps_pets):**
- user_id, pet_name, species, life_stage, dog_size, feeding_type, primary_need, current_food_brand, is_primary

**Reikės pridėti:**
- photo_attachment_id (INT) — nuotraukos WP attachment ID
- species_detail (VARCHAR 100) — paukščio/graužiko/roplio rūšis tekstu
- is_sterilised (VARCHAR 16) — katėms: yes/no/unknown
- created_at, updated_at — jau yra

**Reikės papildyti species enum:**
- Dabartinis: dog, cat, both, unknown
- Naujas: dog, cat, bird, rodent, fish, reptile, other
- "both" ir "unknown" pašalinami

**Reikės papildyti primary_need enum:**
- Dabartinis: hypo, digestion, sterilised, daily, unknown
- Naujas: daily, digestion, skin_allergy, sterilised, picky_eater
- "hypo" → "skin_allergy" (tas pats, bet žmogiškesnis)
- "unknown" pašalinamas (default = daily, bet nerodomos)

### 9.3. Refill ir priminimai (jau veikia)
- Refill tracking automatiškai sukuriamas kai klientas perka maistą
- Priminimai kuriami per REST /petshop/v1/reminders
- Abu susieti su pet_id

### 9.4. Event'ai (jau veikia)
- pet_profile_created — fire'ina kai sukuriamas naujas profilis
- pet_profile_updated — fire'ina kai atnaujinama (su changed_fields)
- Abu eina į Sender (PS_PET_* laukai) → segmentacija

---

## 10. KO NEREIKIA MVP (bet galima vėliau)

| Dalykas | Kodėl ne dabar |
|---------|----------------|
| Kelių poreikių pasirinkimas | Sudėtina UX, pakanka vieno MVP |
| Augintinio svorio tracking | Per detalu, nėra aiškios naudos klientui |
| Mitybos planas | Reikia produktų nutritional data (dar nepilna) |
| Socialinis aspektas (dalintis profiliu) | Privacy rizika, nėra poreikio |
| Augintinio gimimo data (tikslus amžius) | Amžiaus etapas pakankamas |
| Veislė | Galima pridėti vėliau, bet MVP per detalu |
| AI rekomendacijos | Gali būti vėliau, bet MVP rodo filtruotą katalogą |

---

## 11. PRIKLAUSOMYBĖS NUO KITŲ DALIŲ

| Dalis | Būsena | Reikia M8? |
|-------|--------|-----------|
| M7 Pet Profile backend | ✅ Veikia | Taip — reikės papildyti schema |
| M9 Magic Login | ✅ Veikia | Taip — prisijungimui |
| M11 Refill | ✅ Veikia | Taip — rodo kortelėje |
| M13 Reminders | ✅ Veikia | Taip — rodo kortelėje |
| M6 Action Tokens | ✅ Veikia | Ne tiesiogiai |
| Sender (PS_PET_*) | ✅ Veikia | Ne tiesiogiai |
| Flatsome tema | Yra | Taip — stilius turi atitikti temą |
| Brand autocomplete | Reikės sukurti | Taip — "Dabartinis maistas" laukas |

---

## 12. TECHNINIAI KLAUSIMAI KURIUOS REIKĖS SPRĘSTI

1. **localStorage anketa be prisijungimo** — kaip perkelti duomenis į DB po magic link? (atsakymas: JS po prisijungimo POST'ina į REST API, tada ištrina localStorage)

2. **Nuotraukos upload** — WP media REST API (/wp/v2/media) reikalauja autentifikacijos. Neregistruotas vartotojas negali uploadinti. Sprendimas: nuotraukos upload tik PO prisijungimo (anketos metu rodome "Galėsite pridėti nuotrauką po išsaugojimo").

3. **Brand autocomplete** — reikės REST endpoint'o kuris grąžina brendų sąrašą pagal gyvūno rūšį. Paprastas: GET /petshop/v1/brands?species=dog → ["Josera", "Exclusion", "Ontario", ...].

4. **Flatsome integracija** — MyAccount tab pridedamas per WC `woocommerce_account_menu_items` filter + `woocommerce_account_{endpoint}_endpoint` action. Anketos forma — shortcode arba Flatsome element.


---

## 13. KONSULTANTO PATAISOS (v2.1) — UŽRAKINTA

> Šie 7 sprendimai užrakinti prieš vizualą. Jie keičia/papildo ankstesnius skyrius.

### 13.1. Anoniminė anketa — localStorage 30 dienų (NE sessionStorage)

**Keičia:** 7.2 skyrių.

Anoniminiai duomenys saugomi localStorage su 30 dienų galiojimu. Žmogus gali pradėti telefone ir grįžti vėliau. Nereikia visko pildyti vienu prisėdimu.

**localStorage struktūra:**
```
{
  "draft_id": "uuid",
  "created_at": "2026-07-14T15:00:00Z",
  "expires_at": "2026-08-13T15:00:00Z",
  "pet_data": { species, pet_name, primary_need, ... },
  "current_step": 1
}
```

**Grįžus (jei yra nebaigtas juodraštis):**
- Antraštė: "Tęsti [Rekso] profilio kūrimą?"
- Du mygtukai: "Tęsti" | "Pradėti iš naujo"

**Po perkėlimo į DB arba "Pradėti iš naujo" — juodraštis ištrinamas.**

sessionStorage variantas PAŠALINTAS iš specifikacijos.

---

### 13.2. Anoniminis vartotojas kuria TIK VIENĄ augintinį

**Keičia:** 7.2 skyrių.

Prieš prisijungimą — tik VIENAS profilis. "Pridėti kitą augintinį" mygtukas rodomas TIK po profilio išsaugojimo (prisijungus).

**Anoniminiam po pirmos kortelės rodoma:**
- "Turite daugiau augintinių?"
- "Išsaugokite šį profilį ir galėsite pridėti kitą."

**Kodėl:** nereikia sudėtingo kelių profilių perkėlimo iš naršyklės; mažesnė duomenų praradimo rizika; aiškesnis konversijos momentas.

Prisijungęs — neribotai.

---

### 13.3. Nuotrauka TIK po profilio išsaugojimo (prisijungus)

**Keičia:** žingsnis 2.5 skyrių ir 7.4.

Anoniminėje anketoje nuotraukos upload mygtuko NĖRA.

**Anoniminiam rodoma:**
- Placeholder ikona pagal rūšį
- Tekstas: "Nuotrauką galėsite pridėti išsaugoję profilį"

**Po magic link + profilio perkėlimo:**
- Kortelėje atsiranda "Pridėti nuotrauką"

**Nuotrauka NĖRA atskiras žingsnis.** Progreso indikatorius lieka "1 iš 2" / "2 iš 2". Nuotrauka pridedama iš profilio kortelės.

---

### 13.4. Jei el. paštas priklauso esamam klientui — dublikatų logika

**Naujas skyrius (papildo 7.2).**

Nerodome "tokia paskyra jau egzistuoja" — tai tik sieną kuria.

**Procesas:**
1. Klientas įveda el. paštą → gauna magic link → prisijungia prie esamos WC paskyros
2. Sistema palygina anoniminį juodraštį su esamais augintiniais:

**Jei paskyroje NĖRA augintinių:**
- Anoniminis profilis sukuriamas automatiškai (be klausimų)

**Jei augintinių YRA, bet dubliavimo požymių NĖRA:**
- Rodoma: "Pridėti [Reksą] prie jūsų augintinių?"
- Mygtukas: "Pridėti"

**Jei randamas galimas dublikatas** (ta pati rūšis + normalizuotas vardas):
- Rodoma: "Jūsų paskyroje jau yra augintinis vardu [Reksas]."
- Pasirinkimai:
  1. "Atnaujinti esamą [Rekso] profilį" (perrašo naujais duomenimis)
  2. "Pridėti kaip naują augintinį" (sukuria atskirą)
  3. "Atšaukti"

**JOKIO automatinio sujungimo.** Visada kliento sprendimas.

---

### 13.5. Priminimai dinaminiai pagal gyvūno rūšį

**Keičia:** 4.4 skyrių.

NE vienas sąrašas visiems, o presetai pagal rūšį:

**Šuo / Katė:**
- Skiepai
- Kirminų profilaktika
- Blusų ir erkių apsauga
- Veterinaro vizitas
- Kirpimas / priežiūra
- Kitas (laisvas pavadinimas)

**Paukštis / Graužikas:**
- Veterinaro vizitas
- Narvo ar voljero priežiūra
- Maisto / kraiko papildymas
- Nagų ar snapo priežiūra
- Kitas

**Žuvys:**
- Vandens keitimas
- Filtro priežiūra
- Vandens parametrų patikra
- Maisto papildymas
- Kitas

**Roplys:**
- Terariumo priežiūra
- Lempos keitimas
- Maitinimo priminimas
- Veterinaro vizitas
- Kitas

Visada leidžiamas "Kitas" su laisvu pavadinimu ir pasirinkta data.

MVP: keli prasmingi presetai + "Kitas". Nebūtina 20 variantų kiekvienai rūšiai.

---

### 13.6. Senų duomenų migracija (prieš deploy)

**Naujas skyrius.**

Kadangi dev stadijoje — pirma auditas: kiek realių ps_pets, kiek testinių, kiek turi both/unknown/hypo.

**Jei visi testiniai (labai tikėtina):**
- Išvalome ir pradedame nuo švarios schemos
- Nereikia migracijos skripto

**Jei yra realių (mažai tikėtina dev'e):**
- Versijuotas migracijos skriptas:
  - `hypo` → `skin_allergy`
  - `unknown` → `other`
  - `both` → `needs_review` (negalima automatiškai paversti dviem augintiniais)
- `both` profiliui kitą kartą prisijungus rodoma:
  "Anksčiau buvote pasirinkę, kad turite šunį ir katę. Sukurkite jiems atskirus profilius."
- Migracija VIENĄ KARTĄ prieš deploy (dry-run + backup)

---

### 13.7. Anketa lieka 2 žingsnių (nuotrauka NE žingsnis)

**Patvirtina:** anketa = tiksliai 2 žingsniai.

Progresas: "1 iš 2" → "2 iš 2" → "Profilis sukurtas"

Po sukūrimo rodoma kortelė su pirmu papildomu veiksmu: "Pridėti nuotrauką" (ne kaip žingsnis, o kaip kortelės funkcija).

---

### GALUTINIS ANONIMINIO VARTOTOJO KELIAS (užrakintas)

```
1. Pradeda anketą (homepage / popup / quiz)
2. Duomenys saugomi localStorage (30 dienų)
3. Užpildo 1 iš 2 (rūšis, vardas, poreikis)
4. Užpildo arba praleidžia 2 iš 2 (detalės pagal gyvūną)
5. Pamato profilio kortelę su realiu rezultatu
6. Nuotraukos dar įkelti NEGALI
7. Tik vienas augintinis
8. Rodoma: "Norite išsaugoti? Įveskite el. paštą"
9. Įveda email → gauna magic link per WP Mail SMTP
10. Prisijungia prie NAUJOS arba ESAMOS paskyros
11. Sistema tikrina galimą dublikatą (13.4 logika)
12. Profilis išsaugomas DB
13. localStorage išvalomas
14. Galima pridėti nuotrauką
15. Galima pridėti kitus augintinius
```

