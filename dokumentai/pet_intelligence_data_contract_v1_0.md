# PET INTELLIGENCE DATA CONTRACT v1.0

Versija: 1.1 · Data: 2026-08-16 · Statusas: PATVIRTINTA SAVININKO (2026-08-16)
Dalyviai: Raimis (savininkas), ekspertas-konsultantas, vykdytojas.

## KAS TAI IR KODĖL

Tai ne ataskaitų specifikacija. Tai **sutartis, kokią istoriją petshop.lt privalo
išsaugoti nuo pirmo tikro kliento**. Ataskaitas galima perdaryti bet kada —
2027 m. sugalvota ataskaita pasidaroma iš istorinių duomenų per dieną. Bet
įvykio, kurio niekas neužfiksavo, nebus niekada. Todėl:

> **P1 (ataskaitų skiltys) gali slysti. P0 (šis kontraktas) — ne.**

Keturi sluoksniai, kuriuos privalome turėti:

| Sluoksnis | Klausimas, į kurį atsako | Kur gyvena |
|---|---|---|
| 1. Profilis | ką žinome apie augintinį DABAR | `ps_pets` (+pakeitimai) |
| 2. Laukų istorija | ką klientas pakeitė ir kada | `ps_pet_field_log` (NAUJA) |
| 3. Elgsenos įvykiai | ką klientas padarė | `ps_laukai_ivykiai` (sritis `anketa`, `rec`, `refill`) |
| 4. Sprendimų įvykiai | ką sistema nusprendė ir KODĖL | `ps_rec_log` (NAUJA) |

Turint šiuos keturis, klausimas „velnias, kodėl šito nerinkome nuo pirmos
dienos?" nebeegzistuoja.

---

## 1. PROFILIO SCHEMOS PAKEITIMAI (`ps_pets`)

### 1.1. Trijų būsenų laukai — unknown / none / known

**Problema (patvirtinta DB recon 2026-08-16):** `sensitivities: NULL` šiandien
nesiskiria „neklausėm" nuo „neturi". Analitika ir rekomendacijos nežinojimą
traktuotų kaip faktą.

Taisyklė: kiekvienam semantiškai svarbiam laukui — atskira būsena:

| Laukas | unknown (neatsakė) | none (atsakė „neturi/ne") | known |
|---|---|---|---|
| `sensitivities` | NULL | `'none'` | JSON su ID sąrašu |
| `primary_need` | NULL | `'none'` | reikšmė |
| `is_sterilised` | NULL | 0 | 1 |
| `current_food_brand_id` | NULL | `'nefeeds'` (nešeria sausu ir pan.) | canonical ID |

Migracija: esami NULL LIEKA NULL (jie ir yra unknown). Anketos UI privalo
siųsti `'none'` kai klientas aktyviai pasirenka „neturi".

### 1.2. Nauji stulpeliai

```
questionnaire_version  VARCHAR(16)   -- kurios anketos versijos atsakymai
current_food_brand_raw VARCHAR(190)  -- ka klientas ivede pazodziui
current_food_brand_id  VARCHAR(64)   -- canonical (zr. §3)
current_food_line_raw  VARCHAR(190)  -- "Mini Adult", jei nurodyta
current_food_product_id BIGINT       -- MUSU katalogo preke, jei atpazinta
```

Esamas `current_food_brand` paliekamas skaitymui, nauji įrašai pildo raw+id.
Keturios `current_food` būsenos: (1) tik brandas, (2) brandas+linija,
(3) mūsų product_id, (4) nežinoma. Perėmimo analitika: „46 šeria RC Mini
Adult" → konkreti mūsų alternatyva, ne abstraktus brandas.

### 1.3. „Paruoštas rekomendacijai" — DU lygiai (ne vienas)

| Lygis | Sąlygos |
|---|---|
| **RECOMMENDABLE** | `species` + `life_stage` + `current_weight_kg` |
| **HIGH_CONFIDENCE** | + `sensitivities` atsakytas (none ARBA konkretūs) + `primary_need` jei pasirinktas |

`primary_need` ir `current_food_*` NEBLOKUOJA. Vardas/gimtadienis — niekada.
Ataskaita rodo abu skaičius ir tarpą tarp jų („210 trūksta tik jautrumų
atsakymo" → vienas konkretus priminimo veiksmas).

---

## 2. LAUKŲ ISTORIJA — `ps_pet_field_log` (NAUJA)

Ne stulpeliai kiekvienam laukui, o žurnalas (pagal veikiantį `ps_ivykiai`
pavyzdį):

```
id BIGINT PK
pet_id BIGINT           KEY
laukas VARCHAR(64)
buvo TEXT NULL
tapo TEXT NULL
saltinis VARCHAR(24)    -- anketa | klientas_profilyje | sistema | importas
questionnaire_version VARCHAR(16) NULL
user_id BIGINT
laikas DATETIME
```

Rašo: anketos submit, profilio redagavimas, sisteminiai atnaujinimai
(pvz. svoris iš užsakymo). Be šito po anketos pakeitimo nebesuprasime, kodėl
senų ir naujų vartotojų rodikliai skiriasi.

---

## 3. BRAND ŽODYNAS — `ps_brand_alias` (NAUJA)

```
id BIGINT PK
alias VARCHAR(190) UNIQUE     -- normalizuotas raw (lowercase, be tarpu)
canonical_id VARCHAR(64)      -- royal_canin
busena ENUM(auto|review|new)  
confidence DECIMAL(3,2)
patvirtino BIGINT NULL        -- user_id
sukurta / atnaujinta DATETIME
```

Veikimas:
- **AUTO** — labai aukštas panašumas → susieja pats;
- **REVIEW** — „manau, kad tai Royal Canin" → Raimio eilė, patvirtinimas
  vienu paspaudimu; patvirtintas alias įsimenamas VISAM LAIKUI;
- **NEW** — nieko panašaus → naujas canonical arba „nežinomas".

Dviprasmybės („RC") automatiškai NETVIRTINAMOS. Pradinis canonical katalogas —
iš Woo brand taksonomijos + jau įvestų raw reikšmių. Tai vienkartinis žmogaus
mokymas, ne amžinas rankinis darbas.

---

## 4. ELGSENOS ĮVYKIAI (esama `ps_laukai_ivykiai` infrastruktūra)

Tas pats dviejų sluoksnių principas kaip dėžėse: be sutikimo — anonimiškai,
su Complianz statistikos sutikimu — su sesija. Prisijungusiam klientui
anketos/rec įvykiai turi `user_id` (`verte` arba atskiras laukas — vykdytojo
sprendimas diegiant, bet turi būti užklausiamas).

### 4.1. Sritis `anketa`

| Tipas | Kada | verte |
|---|---|---|
| `anketa_started` | atidaryta anketa | questionnaire_version |
| `step_started` | žingsnis parodytas | step nr |
| `step_completed` | žingsnis užbaigtas | step nr |
| `anketa_completed` | visa anketa baigta | draft_id/pet_id |
| `anketa_abandoned` | paliko (pagehide be complete) | step nr + **užpildytų/tuščių to žingsnio laukų sąrašas** |
| `profile_claimed` | draft → paskyra | pet_id |
| `profile_updated` | profilis redaguotas | laukas |

**`anketa_abandoned` su laukų būsena — privalomas.** Be jo žinome „iškrito
3 žingsnyje", bet ne „143 sustojo ties sensitivities, 31 ties current_food".
Eksperto pavyzdys tikslus — tai skirtumas tarp anketos taisymo ir spėliojimo.

### 4.2. Sritis `rec` (rodymo pusė)

| Tipas | verte |
|---|---|
| `rec_shown` | recommendation_id + vieta (product_page / account / email) |
| `rec_clicked` | recommendation_id + product_id |
| `rec_add_to_cart` | recommendation_id + product_id |
| `rec_purchased` | recommendation_id + order_id (rašo serveris checkout metu) |

### 4.3. Sritis `refill`

| Tipas | verte |
|---|---|
| `refill_due` | pet_id + product_id (cron, kai predicted_empty pasiekta) |
| `refill_reminder_sent` | reminder_id |
| `refill_purchase` | order_id + dienų nuokrypis nuo prognozės |

---

## 5. SPRENDIMŲ ĮVYKIAI — `ps_rec_log` (NAUJA, svarbiausia lentelė)

Rašoma **sprendimo momentu**, ne cron'u. Naktinis cron perrašo „šiandienos
sveikatą"; istorinę tiesą saugo tik sprendimo log'as. (Pavyzdys: 08-20
rekomendacija nepavyko — nebuvo produkto; 08-25 produktą įkėlėm; cron sako
„viskas gerai", o KODĖL praradome 08-20 klientą žino tik log'as.)

```
id BIGINT PK
recommendation_id CHAR(20) UNIQUE   -- generuojamas kiekvienam sprendimui
pet_id BIGINT KEY
user_id BIGINT
laikas DATETIME KEY
engine_version VARCHAR(16)          -- taisykliu versija
rezultatas ENUM(ok|fallback|failed)
reason_code VARCHAR(32) NULL        -- zr. 5.2
kandidatu_sk SMALLINT
parodyti_ids TEXT                   -- product_id sarasas JSON
inputs_json TEXT                    -- TIK panaudoti laukai, zr. 5.1
input_hash CHAR(32)                 -- md5(inputs_json) — grupavimui
```

### 5.1. `inputs_json` — decision inputs, NE visas profilis

Tik tai, ką variklis faktiškai panaudojo: `species`, `life_stage`,
`weight_kg`, `sensitivities` (būsena+ID), `primary_need`,
`current_food_brand_id` jei naudotas, kiti realiai sprendimą veikę parametrai.
Jokio pilno `ps_pets` JSON — nekuriama dubliuota DB, o `input_hash` leidžia
grupuoti identiškus atvejus.

### 5.2. `reason_code` žodynas (užrakintas, plečiamas tik pridedant)

```
no_product_for_need      nera produkto pagal poreiki
sensitivity_conflict     visi kandidatai konfliktuoja su jautrumu
no_feeding_table         kandidatas be verifikuotos serimo lenteles
out_of_stock             kandidatai isparduoti
missing_weight           profilyje nera svorio
missing_life_stage       nera gyvenimo etapo
no_size_variant          nera tinkamo dydzio/pakuotes
product_data_gap         prekes duomenu spraga (pvz. be gyvuno rusies)
```

### 5.3. Cron — antras sluoksnis, ne pakaitalas

Naktinis `ps_rec_diagnostika` LIEKA: kiekvienam RECOMMENDABLE profiliui
paleidžia kandidatų paiešką → „kas neveikia ŠIANDIEN" ekranas. Istoriniam
vertinimui naudojamas TIK `ps_rec_log`.

---

## 6. P0 / P1 RIBA

**P0 — šis kontraktas (§1–§5). Privalo veikti launch dieną. Neslysta.**

**P1 — šešios „Augintinio anketa" skiltys** (v2 karkasas + XLSX + darbo
sąrašas viršuje): 1. Variklio sveikata/piltuvėlis · 2. Rekomendacijų coverage
ir gedimų priežastys · 3. Paklausos/asortimento žemėlapis · 4. Duomenų
kokybė · 5. Refill/gyvybingumas · 6. Pinigai/cohort (su sąžiningu „duomenų
dar nepakanka" iki realios istorijos; slenkstis — nustatymas, ne konstanta).

Septintos ataskaitos NEKURIAME. Nauji klausimai ateityje = SQL iš šių
keturių sluoksnių, ne naujas duomenų rinkimas.

## 7. SAUGOJIMO POLITIKA — „auksas" (savininko sprendimas 2026-08-16)

| Duomenys | Saugojimas |
|---|---|
| `ps_rec_log` | AMŽINAI |
| `ps_pet_field_log` | AMŽINAI |
| `ps_brand_alias` | AMŽINAI |
| Įvykiai `anketa` / `rec` / `refill` | AMŽINAI ŽALI — 90 d. valymo taisyklė jiems NEGALIOJA |
| Įvykiai `laukai` (dėžės) | 90 d. žali → dienos agregatas amžinai (kaip iki šiol) |

**KRITINIS PATAISYMAS (rasta 2026-08-16):** dabartinis
`Petshop_Statistika::valyti()` trina žalius įvykius pagal DIENĄ visoms
sritims, o agregavimą tikrina tik `laukai` srityje — anketos auksas būtų
ištrintas kartu su dėžių klikais. Taisoma P0 pradžioje: trynimas TIK
`sritis='laukai'` eilutėms. Tai pirmas P0 darbas, nes saugo neatkuriamą.

**GDPR:** klientui ištrynus paskyrą — ANONIMIZACIJA, ne trynimas
(`user_id -> NULL`, elgsenos/sprendimų istorija lieka be asmens). Techniškai
paruošiami abu keliai (anonimizuoti / trinti pilnai) vienu jungikliu;
galutinį žodį taria savininko teisininkas.

## 8. DoD (P0)

1. Visi §4 įvykiai realiai įrašomi suvaidinus kelią naršyklėje (Playwright),
   įskaitant `anketa_abandoned` su laukų būsena.
2. `ps_rec_log` gauna įrašą kiekvienam rekomendacijos sprendimui su
   `recommendation_id`, `reason_code` (kai failed), `inputs_json`, `input_hash`.
3. `rec_purchased` susieja order_id su recommendation_id.
4. Brand alias: AUTO/REVIEW/NEW veikia; REVIEW eilė matoma adminui.
5. `sensitivities` trys būsenos: UI siunčia 'none', DB skiria NULL nuo 'none',
   seni NULL nepaliesti.
6. `ps_pet_field_log` pildosi iš anketos, profilio redagavimo ir sistemos.
7. `is_test=1` profiliai visur išfiltruoti.
8. Visos ribos — wp options, ne konstantos.
9. `valyti()` trina TIK `sritis='laukai'`; anketa/rec/refill įvykiai išlieka
   žali (patikrinta: po valymo jų COUNT nepakinta).
10. Anonimizacijos kelias veikia: user_id -> NULL, istorija lieka.
