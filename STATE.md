# STATE.md — petshop.lt migracija · MASTER INDEKSAS

> **Šitą failą Claude skaito PIRMĄ kiekvieną sesiją.** Tai indeksas + darbo taisyklės, ne turinio saugykla. Turinys — kituose failuose, čia tik nuorodos.
> Paskutinį kartą atnaujinta: **2026-07-16 vakaras** (S217 Quattro 12 lentelių/23 SKU; S218 Josera 5 lentelės/7 SKU + eilės skaičių revizija). Ankstesnis: **2026-07-15 vakaras** (po S204–S211 + strateginės sesijos: M8 anketa/login/redagavimas/produktų paieška gyvi; strateginis pivotas į €/dienos skaičiuoklę; TŽ MASTER v1.59; M8 „Mano augintinis" MASTER v3.2 — Raimio PC).

---

## 0. DARBO TAISYKLĖS (galioja VISADA — skaityk prieš dirbdamas)

- **„Darom lėtai, bet tvarkingai"** — tikslumas svarbiau už greitį.
- **Recon prieš veiksmą.** Niekada nespėti (ypač mappingo — 2× painiojosi). Tikrinti turinį/HTML/DB, ne prielaidas.
- **Vizuali/empirinė verifikacija prieš raportuojant „padaryta".** Dry-run skaičiai negarantuoja. Screenshot / HTML / DB patikra.
- **Kodas: full-file rewrites.** Jokių partial patch'ų, net 1 eilutės. Vienas pilnas failas per deploy.
- **Dokumentai: tik pilni failai, tik po darbo** (ne fragmentai, ne mid-conversation). Versijuoti (v1.3.45, ne perrašyti seno).
- **Deploy: dry-run → Raimis review → apply.** Destruktyviems — „taip" patvirtinimas + backup.
- **Anti-rabbit-hole:** po 2–3 fail'ų STOP + įvardink + siūlyk alternatyvą. Nemėtyti 10+ runs ant vienos detalės.
- **Komunikacija: lietuvių, terse.** Iš minimalaus prompto Claude išplečia pats.
- **Patvirtinta → IŠKART į repo/STATE** (ne sesijos gale — langas gali baigtis anksčiau).
- **Klaidas pripažinti tiesiai**, ne teisintis. Jei recon rodo neatitikimą — sakyk Raimiui prieš „padaryta".

**Sesijos pradžios protokolas:** (1) perskaityk STATE.md; (2) patikrink versijas §3 (ar TŽ/deployment_log repo = naujausi, jei abejoji — paklausk Raimio); (3) prisijunk prie tilto (§4 mechanika); (4) tęsk nuo §1.

---

## 1. KUR SUSTOTA

**Migracija ~87%. Internal launch 2026-10-01, kontraktinis 2026-10-15.**

**VISOS 5 RŪŠYS BAIGTOS ir gyvos** (dev): `/sunims/` (#70, 8 kort.), `/katems/` (#77, 8 kort.), `/grauzikams/` (#87, 4 kort.), `/pauksciams/` (#89, 3 kort.), `/zuvims/` (#93, 3 kort.). Landing epika UŽBAIGTA.

Karkasas pilnai config-driven, patikrintas 5 rūšims:
- Kortelių tinklelis: `pcl-cats-c{N}` klasė, N=min(kortelių,4) — 3/4/8 kortelių automatiškai.
- Maisto mygtukai (#692): tik jei yra maisto grupė (šunys 71/72/73, katės 78/81/79).
- „Rinkitės pagal poreikį": tik jei config turi `food_id` (šunys/katės).
- „Atrinktos": tik jei rūšis turi pool (visos turi; guard'as jei tuščia).

**ESP/EMAIL PLATFORMA IŠSPRĘSTA (S180):** TŽ §4 vykdymo platforma = **Sender.net** (buvo Brevo, TŽ v1.44). Sprendimas pagrįstas: kainų korekcija (~5× pigiau nei Brevo), šildyta paskyra su verifikuotu petshop.lt domenu, LT įmonė+SMS. Sender POC: **8 testų → 5 žali, 3 geltoni, 0 raudonų** (geltoni sutampa su architektūra — Sender=kvailas vykdytojas). Sender techniškai TINKA mūsų ESP-nepriklausomai architektūrai.

**ETAPO A EIGA (S182):** Petshop ESP **v0.2.0 GYVAS dev'e** — `wp-content/plugins/petshop-esp/` (5 failai, 1213 eilučių PHP). Blokai 1+2 (M1+M2) BAIGTI: `Petshop_Sender_Adapter` (realūs HTTP kvietimai — upsert_contact, emit_event, transactional email, health, is_operational) + `Petshop_ESP_Retry_Queue` (Action Scheduler backoff 1min/5min/30min/2h/6h/24h+jitter, 7 bandymai→DLQ). Empiriškai patvirtinta su REALIU Sender API: 11/11 PASS — kontaktas sukurtas Sender pusėje (PS_ORDER_COUNT=7, PS_PET_SPECIES=dog read-back OK), event realiai iškeliavo ("Event created"), pilnas async srautas ps_emit_event→log→AS→worker→sent veikia. Tokenai WP options (base64). Failai repo: `plugins/petshop-esp/`.

**ARCHITEKTŪROS SPRENDIMAI UŽRAKINTI (2026-07-14 sesija):**
- **Email atskyrimas (C hibridas):** transakciniai teisiniai (new_order, invoice, processing) → WC/SMTP; lifecycle/marketing → Sender. Vienas išsiuntimo pranešimas (`customer_completed_order`) perkeltas į Sender kaip post-purchase serijos pradžią.
- **Prenumeratos modulis:** dvi ašys (siuntos kontrolė × mokėjimo mechanika), NE viena dilema. Launch default: `confirm_required + token charge`. Dunning retry mūsų pusėje. Detalės: `dokumentai/prenumerata_uzrakinta_2026-07-14.md`.
- **Architektūros žemėlapis:** 16 modulių, 9 naujos DB lentelės — `plugins/petshop-esp/` (M1+M2) šiuo metu tik viena baigta.

**Blokas 0 (dev valymas):** ✅ #713 deaktyvuotas, ✅ 2 Sender webhook.site webhookai ištrinti, ⚠️ 4 testiniai Sender kontaktai soft-deleted (Sender API elgesys — lieka DB kaip unsubscribed, kvotos nepaimta).

**Blokas 3/M3 BAIGTA (S183):** 26 PS_ contact attributes **VISI Sender pusėje** (23 sukurti + 3 iš POC, 0 dublikatų). Kūrimo endpoint `POST /fields {title,type}`. Sender tipai tik text/number/date (category→text, boolean→text "true"/"false"). Pilnas mapping su Sender ID + kas rašo + kur skaitoma: `plugins/petshop-esp/docs/attributes.md`.

**Blokas 4/M4 BAIGTA (S184):** ESP **v0.3.0 gyvas** — consent sync + webhook receiver (8 failai, 1802 eil.). `ps_consent_log` lentelė (teisinis irodymas, niekada netrinam). Woo→Sender consent push + Sender→Woo webhook. Public API `ps_set_marketing_consent()`, `ps_get_marketing_consent()`. Webhook `/petshop/v1/sender-webhook` su HMAC verify. Empiriškai 11/11 + end-to-end (realus HTTP POST→consent atsinaujino source=webhook; blogas parašas→401). **Sender webhook 1aKjne ACTIVE** (topic subscribers/unsubscribed → dev URL). **Webhook secret dev:** `uD5RdRkIjPorxrlouQDahacEyHxxoEO0TcemLKnX`. **POC #4 UŽBAIGTA:** patvirtinta kad Sender fire'ina webhook TIK ant realiu user veiksmu (ne API) — receiver paruoštas, produkcijoje veiks natūraliai.

**2026-07-15 SESIJA — S204–S211 + STRATEGINIS PIVOTAS:**

**M8 deploy'ai (visi verifikuoti realioje naršyklėje, 0 JS klaidų):** S208 redagavimas/trynimas/„pridėti kitą" + dashboard feeding laukų fix (pet objektas negrąžindavo feeding_type/current_food_* → redaguojant ekranas meluodavo). S209 **vieningas email-first login** — naujas `flatsome-child/woocommerce/myaccount/form-login.php` (rollback=ištrinti), `class-magic-login.php` v3 su `context` param (pet|account) + `render_retry()` pasibaigusiam tokenui (UŽDARO TŽ v1.45 doktrinos nukrypimą — buvo aklas klaidos puslapis). S210/S211 produkto tapatybė (`primary_product_sku/name/package` DB stulpeliai, migracija verifikuota) + `/food-search` endpoint (KONKRETŪS produktai su SKU+pakuote, ne tik brendai) + vizualas + sidebar globaliai (`assets/account.css`) + onboarding sidebar slėpimas (`is_onboarding()`) + optimizuotos iliustracijos (677KB→9KB, webp/png 96/192 GD sugeneruotos). pet-ui v1.6.0.

**STRATEGINIS PIVOTAS (jokio kodo — konceptas):** anketa dėl anketos neturi vertės. **Profilis NE produktas — produktas yra naudinga funkcija; profilis = atminties sluoksnis.** Tikrasis „wau" = **€/dienos maisto skaičiuoklė** (svoris+produktas+pakuotė+gyva kaina → dienos norma, pakuotės trukmė, €/diena, papildymo data). Kryptis „šiltas tikslumas". Detalės: M8 MASTER v3.2 (Raimio PC).

**S212 — FeedingTable GYVA DB (2026-07-15, parseris v4, APPLY baigtas):**

Trys lentelės dev'e: `gaj6_ps_feeding_tables` / `_rows` / `_map`. 0 klaidų, 0 orphan. Esamų DB lentelių NELIESTA.
- **110 unikalių lentelių** (dedup pagal `checksum`) iš 225 SKU → **92 verified / 18 ambiguous**, 2 224 eilutės, **193 SKU su verified**.
- `verified_by='auto_parser_v4'` — pažymėta MAŠINOS, ne žmogaus (filtruojama, jei prireiks žmogaus parašo).
- `scope='line'` kai lentelė dengia >1 SKU — dėl to peržiūros vienetų 110, ne 1000.

**KRITINIS RADINYS — `weight_basis` (naujas laukas, v3.2 sk. 6.2.2 jo NETURI):**
Ta pati `transposed` forma turi DVI skirtingas svorio prasmes:
- Monge mini puppy: antraštė pažodžiui **„Suaugusio šuns svoris (kg)"**, eilutės = amžius → `weight_basis='adult_expected'`
- Monge Adult: „Šuns svoris (kg)", eilutės = Liesa/Normali/Antsvoris → `weight_basis='current'`

Be šio lauko skaičiuoklė 15 kg šuniui tyliai duotų šuniuko normą. **Gyvas testas: vartai užblokavo 49 šuniukų eilutes** su svoris=15kg. `weight_basis` = PRIVALOMAS vartas kiekvienoje užklausoje; `verified AND weight_basis IS NULL` = 0 (tikrinama).

**Antraštės krypties taisyklė (užrakinta):** `header[0]` semantika skiriasi PAGAL BRENDĄ — Farmina žymi EILUTES („Amžius"), Monge žymi STULPELIUS („Šuns svoris (kg)"). Parseris atpažįsta iš eilučių etikečių, ne iš antraštės.

**`row_dimension` (naujas laukas):** `age` | `body_condition` | `activity_level` | `weight`. `cond` raktai semantiniai, patikrinti: `{age:32, activity_level:14, body_condition:3, age_m_from/to:10}`.

**Pasiskirstymas:** simple 43v/2a (current) · transposed 41v/12a (18 body_condition + 13 activity_level = current; 10 age = adult_expected) · matrix 7v/2a (current) · by_age 1v/1a (basis=NULL, svorio neturi — teisinga) · unknown 0v/1a.
**Aprėptis:** current/dog 114 SKU · current/cat 59 · adult_expected/dog 14 · by_age/cat 6.
**Brendai:** Monge 35v (52 SKU) · Farmina 31v (89) · Josera 13v (35) · Eukanuba 10v (13) · Exclusion 2v (3) · RC 1v (1).
**Likę 18 ambiguous:** 5 too_many_bad_cells, 4 row_dimension_unknown, 3 row_not_monotonic, 2 matrix_parse_fail, 2 amount_not_monotonic, 1 unknown, 1 parse_fail. Dalis — TIKROS klaidos šaltinyje.

**CLAUDE KLAIDOS, UŽFIKSUOTOS (S212):**
1. Dry-run skaitiklis melavo (žadėjo 1 917, įrašė 2 279) — skaičiavo eilutes tik iš verified lentelių. Dry-run privalo prognozuoti tiksliai.
2. „139 blogi cond raktai" = **klaidingas aliarmas**: `LIKE '%svoris%'` pagavo REIKŠMĘ „Ant**svoris**", ne raktą. Patikra tikrino ne tai, ką skelbė.
3. Pirma `ps_rowdim` versija tikrino tik lietuviškai („mėn") — Monge naudoja **„Months 1-2"** angliškai; ir nepažinojo „Bute/Kieme/Aktyvus" (gyvenimo būdas).
4. Ankstesnis „80,2%" buvo išmatuotas su OR sąlyga → realiai 449 su fraze, 225 su lentele.

**KITAS ATVIRAS KLAUSIMAS (Etapas 2, ne duomenys):** intervalinės eilutės („15–30 kg → 435–570 g") — 15 kg šuniui rodyti visą diapazoną ar interpoliuoti? Eukanuba testas parodė 435–570 g/parą 15 kg šuniui, kas per daug, jei imama viršutinė riba. Skaičiuoklės logikos sprendimas.

**S214 — FeedingTable PERSTATYTA (2026-07-16, parseris v6) — BAIGTA:**

> ⚠️ **Žemiau esantys skaičiai galioja tik iki S215.** Aktualūs: 166 lentelės / 154 verified / 3 007 eil. / 349 SKU. Aprėpties skaičius (310 SKU, 373/662) **nepermatuotas** po S215.

`mb_stripos` pataisymas atgavo tai, ką S212 offset klaida slėpė. Visos `ps_feeding_*` išvalytos ir perparsintos nuo nulio.

**REZULTATAS:**
| | S212 (bloga) | **S214 (v6)** |
|---|---|---|
| lentelių rasta skenuojant | 225 | **331** |
| unikalių lentelių | 167 | **164** |
| verified | 92 | **152** |
| ambiguous | 18 | **12** |
| eilučių | 2 444 | **2 991** |
| **SKU su verified** | 230 | **310** |

**Patikros (visos praeina):** `orphan rows/map = 0/0` · `verified be weight_basis = 0` · `cond` raktai semantiniai: `age(38) · activity_level(25) · age_m_from/to(12) · body_condition(3) · age_label(1)`.
**Gyvas testas:** suaugęs 15 kg šuo → Farmina 125–255 g/parą (realistiška); `weight_basis` vartai užblokavo **59** šuniukų eilutes.

**PARSERIS v6 — 5 taisymai (visi buvo MANO spragos, ne šaltinio klaidos):**
1. `-` / `–` / tuščias langelis = `GAP` (sąmoninga spraga, pvz. liesai 1–3 kg katei nėra „Antsvoris"), NE klaida. Anksčiau griovė matrix+transposed.
2. `row_dimension` pirmiausia iš **antraštės[0]**: Josera vienetą rašo antraštėje („Amžius (mėn.)"), eilutėse tik „3", „4". Anksčiau ieškojau „mėn" eilutėse → 11 lentelių krito.
3. `by_age`: kiekio monotoniškumas **NETAIKOMAS** (Josera Kitten 2 mėn.→50 g, 4 mėn.→40 g — kiekis teisėtai mažėja).
4. `by_age` + `age_weight`: tekstinė amžiaus etiketė („Nujunkymo metu") → `cond={age_label:...}`, ne klaida.
5. Nauja forma **`age_weight`** (`Amžius | Svoris | Kiekis`, Exclusion) — 3 ašys viename.

**Formos:** simple 61v/2a · transposed 49v/10a · matrix 39v/0a · by_age 2v/0a · age_weight 1v/0a.
**Likę 12 ambiguous:** 5x row_dimension_unknown · 3x row_not_monotonic · 2x amount_not_monotonic · 2x too_many_bad_cells. **3x row_not_monotonic = TIKRAS šaltinio keistumas** (Farmina Ocean Kitten: 0,5 kg kačiukui 25–40 g, o 1 kg → 20–40 g — didesnis ėda mažiau). Verta Raimio akių, ne Claude spėjimo.

**⚠️ VAKARYKŠTĖ KLAIDA IŠTAISYTA — Josera multipack idėja NEGALIOJA:**
S213 buvau įrašęs, kad ~33 Josera SKU turi lentelę singular versijoje → kopijavimo darbas. **NETIESA.** Dry-run rado **1 porą, ne 33**. Įrodymas: `JosiDog Economy 15+3kg AKCIJA` IR `JosiDog Economy 2,7 kg` — **abu be lentelės**. Vakar mačiau abu „trūkstamų" sąraše ir klaidingai nusprendžiau, kad vienas turi.
**Priežastis, kodėl idėja beprasmė iš principo:** `checksum` dedup jau atlieka šį darbą — jei multipack ir singular turi tą pačią lentelę, jie dalinasi checksum ir abu jau `map`'e (todėl 331 SKU iš 164 lentelių). Likusiems lentelės tiesiog NĖRA.

**FAKTINĖ APRĖPTIS (662 instock sauso maisto):**
- **310 SKU su verified norma**
- **63 vet. dietos** — sąmoningai be normos, pakopa D („pasitarti su veterinaru")
- **21 SKU tik su ambiguous** (yra lentelė, bet neaiški)
- **268 SKU be jokio šaltinio** ← TIKRAS turinio darbas (ne 235, kaip vakar rašiau)
- **Padengta: 373 / 662 (56%)**

**TURINIO DARBAS — 268 SKU, pagal brendą:** Quattro 63 · **Exclusion — S215: 18 uždaryta, liko 31** · Josera 33 · Prins 22 · Real Dog 19 · Ontario 18 · Gemon 15 · Royal Canin 12 · Family Dog 7 · GreenPetFood 5 · Rasco 5 · IAMS 5 · Family Cat 4 · Green Petfood 3 · kiti. Šaltiniai: gamintojų PDF/svetainės (Exclusion.it, Prins.nl tirti anksčiau). **Owner sprendimas dėl eiliškumo.**

**PENDING (M8 Etapas 2):** intervalinių eilučių logika — „15–30 kg → 435–570 g": 15 kg šuniui rodyti diapazoną ar interpoliuoti? Skaičiuoklės sprendimas, ne duomenų.
**PENDING:** M8 v3.2 sk. 17 — 17 atvirų sprendimų laukia Raimio prieš Etapo 2 kodą.

**TAISYKLĖ (užrakinta):** LT tekste TIK `mb_stripos`/`mb_substr` pora. Niekada `stripos`+`mb_substr` — offsetas slenka ~110 simbolių ir tyliai pjauna turinį.

**S215 — EXCLUSION šėrimo normos: 34 iš 49 SKU UŽDARYTA (2026-07-16):**

**DB PO VISŲ APPLY (verifikuota atskiru read-only snippetu, ne to paties kodo pranešimu):**
| | prieš S215 | **po S215** |
|---|---|---|
| lentelių | 164 | **169** |
| verified | 152 | **157** |
| eilučių | 2 991 | **3 030** |
| map / produktų | 331 | **365** |

Patikros: `orphan rows/map = 0/0` · `produktų su 2+ lentelėm = 0` · `apverstų rėžių = 0` · `row_count` = faktas visose 5.

**PENKIOS EXCLUSION LENTELĖS (visos `dog simple verified`, `source_version='exclusion_vetfarmas_2026-07-16'`):**
| id | line | eil. | SKU | norma | verified_by |
|---|---|---|---|---|---|
| 165 | Hypoallergenic | 7 | **10** | `2→50-60 · 3→70-80 · 4→80-90 · 5→90-100 · 6→100-120 · 8→120-140 · 10→140-160` | `ocr_vetfarmas_x_exclusion_pl` |
| 166 | Hypoallergenic | 9 | **8** | `11→150-170 · 15→190-210 · 20→220-240 · 25→280-310 · 30→330-360 · 40→440-480 · 50→480-520 · 60→500-540 · 70→550-600` | `ocr_vetfarmas_x_exclusion_pl` |
| 167 | Mediterraneo Noble Grain | 7 | **7** | `2→30-40 · 3→40-60 · 4→50-70 · 5→60-80 · 6→70-100 · 8→80-110 · 10→100-120` | `ocr_vetfarmas_x_exclusion_it` |
| 168 | Mediterraneo Noble Grain | 7 | **6** | `11→130-150 · 13→150-180 · 15→160-190 · 17→180-210 · 20→220-250 · 25→270-300 · 30→320-350` | `ocr_vetfarmas_x_exclusion_it` |
| 169 | Mediterraneo Noble Grain | 9 | **3** | `31→320-350 · 35→350-390 · 40→400-420 · 45→420-450 · 50→480-500 · 55→500-540 · 60→550-600 · 70→620-650 · 80→650-700` | `ocr_vetfarmas_x_exclusion_it` |

- id165: HYFS02 HYRS02 HYHS02 HYPS08 HYPS06 HYPS02 HYPS06-2 HYPS02-2 HYDS02 HYVS02
- id166: HYIM11 HYRM11 HYPM11 HYVM11 HYHM11 HYDM11 HYHM02 HYPM02
- id167: NGALS02/05/07 NGABS05 NGATS02/05/07 · id168: NGALM03/12 NGABM03/12 NGATM03/12 · id169: NGALL12 NGABL12 NGATL12
- **Instock aprėptis NEPERMATUOTA.** Senas „310 SKU / 373 iš 662" **nebegalioja**; iš 18 HY bent 3 ne instock. Permatuoti prieš remiantis.
- Snippetai `Exclusion HY Feeding v1` ir `Exclusion NG Feeding v1` — serveryje, **išjungti**, apply logika viduje (kartojimui).

**ŠALTINIŲ ŽEMĖLAPIS:**
1. **`exclusion.lt` = UAB VETFARMAS** (oficialus LT atstovas) — 111 produktų, **109 `_SERIMAS.png`**. **Vertikalūs 631×320-358, 24-42 KB → OCR skaito ŠVARIAI.** Repo: `serimas/`. **Vienintelis Mediterraneo šaltinis.**
2. **`exclusion.pl`** — normos **HTML TEKSTU**. `https://exclusion.pl/x/3-123-N`, slug'as nesvarbus. **Blokuoja Claude web_fetch (ROBOTS_DISALLOWED) → per tiltą su Mozilla UA.** **KATEGORIJA URL'e IGNORUOJAMA** — `3-235-N` grąžina tą patį kaip `3-123-N`, sprendžia tik ID.
   **⚠️ MEDITERRANEO ČIA NĖRA.** Skenuota ID 241–760: 435 tuščių (404), 85 Hypoallergenic, **0 Noble Grain**. Tai vet. dietų platintojas (HY/IN/UR/RE/DI/HE/MO/MM/HH). Ieškoti ten Mediterraneo — beprasmiška.
3. **`exclusion.it`** — `https://www.exclusion.it/images/razioni/{kodas}_razione_en.png`. **SKU→failas tiesiogiai:** `NGALM03 → ngalm`, pataikė 31/32. Repo: `razioni/`. Juostos 631×128 → OCR silpnas, **BET tinka kaip kryžminis tikrinimas** — `ngall`/`ngabs` patvirtino LT lenteles iki skaitmens.

**KODŲ SISTEMA (3 šaltiniai; `exclusion-food.nl` rodo „Manufacturer code: HYPS"):**
- Šunų vet.: `{HY|HH|IN|UR|RE|DI|HE|MM|MO}{baltymas}{S|M}` — P(kiauliena) I(vabzdžiai) H(arkliena) V(elniena) R(triušiena) D(antiena) F(žuvis)
- **Mediterraneo: `NG{amžius}{baltymas}{dydis}`** — `NGALS07` = NG+**A**dult+**L**amb+**S**mall · `NGPBS05` = NG+**P**uppy+**B**eef+**S**mall. Baltymai: B(jautiena) L(ėriena) T(tunas) C(vištiena)
- Kačių: **kita schema** — `NGCST` = NG+**C**at+**S**terilized+**T**una
- **LENTELĖ NEPRIKLAUSO NUO BALTYMO** — įrodyta abiejose linijose. HY: arkliena/elniena/triušiena/antiena/žuvis → identiška. NG: vištiena/jautiena/ėriena/tunas → identiška. **Todėl 34 SKU uždarė 5 lentelės.** Tai ir kryžminis tikrinimas: 3-4 skirtingi paveiksliukai, tas pats skaičius = OCR nemelavo.
- **Lenkai spausdina apatinę ribą, lietuviai visą rėžį:** PL `2→50` = LT `2→50-60`. Sutampa 7/7. Ne prieštara.

**MEDITERRANEO FORMOS (atrasta S215):**
- **Suaugusiems (`SUAUGUSIEMS`) → `simple` rėžiai.** Įrašyta.
- **Šuniukams (`JAUNIEMS ŠUNIUKAMS`) → MATRICA:** eilutės = **suaugusiojo** svoris (`weight_basis='adult_expected'`, antraštė pažodžiui „Suaugusiųjų svoris kg"), stulpeliai = **amžius mėnesiais**. Kiekiai kyla ir krenta (10 kg šuniui: 135→160→165→150) — normalu.
- Yra ir `SUBRENDUSIEMS` (mature) bei `PAAUGUSIEMS` (junior) — atskiros lentelės, nuskaitytos švariai, bet **mūsų SKU tokių nerasta** (tik A ir P).

**⚠️ FAILŲ VARDAI MELUOJA — RAKTAS IŠ PAVADINIMO:**
HY linijoje `_SERIMAS.png` vardas visada turėjo dydį → mapinosi savaime. **Mediterraneo — NE.** Tas pats `P46` prefiksas dengia TRIS skirtingus produktus:
```
P46_..._mazos-veisles-subrende-sunys_vistiena  →  MAŽŲ VEISLIŲ SUBRENDUSIEMS
P46_..._sunys_tunas                            →  MAŽŲ VEISLIŲ SUAUGUSIEMS SU TUNU
P46_..._sunys_vistiena_SERIMAS-1               →  MAŽŲ VEISLIŲ PAAUGUSIEMS
```
Trys skirtingos lentelės — teisingai skirtingos. **Raktas imamas iš produkto puslapio PAVADINIMO** (`/tmp/lttext.json`: title+ser), ne iš failo vardo. Žodynas: `MAŽŲ VEISL`=S · `VIDUTINIO DYŽIO`=M (pastaba: jų svetainėje **„DYŽIO", su klaida**) · `VIDUTINIŲ IR DIDELIŲ`=ML · `DIDELIŲ VEISL`=L · `ŠUNIUK`=P · `SUAUGUSI`=A · `SUBRENDUSIEMS`=MATURE · `PAAUGUSIEMS`=JUNIOR · `STERILIZUOTOMS`=STER.

**KAS NEUŽDARYTA — 15 SKU (buvo 49):**
| kas | SKU | kliūtis |
|---|---|---|
| `NGP*` šuniukai (NGPTL12 NGPBS02/05/07 NGPTS05 NGPTM03 NGPBM12) | 7 | **MATRICOS ANTRAŠTĖS.** Skaičiai skaitosi, antraštė ne: `L/P` → `[2,4,6,10,14,18]` nuosekliai visuose 3 ✓; `M/P` → `[2,4,8,10,12]` = 5 reikšmės, o stulpelių 6 (trūksta „6"); `S/P` → `[9,4,4,10]` šiukšlės. Stulpeliai = amžius mėn. **Spėti = pusmečio šuniukui duoti 2 mėn. porciją.** |
| kačių NG (`ngcsb` `ngcst`) | 3 | netirta |
| `inps` / `inpm` | 2 | **PRIEŠTARA:** PL `2→45-55`, Vetfarmas `2→50-60` (=HY lentelė). PL „Intestinal" = Vetfarmo „Mobility/Renal". Etikečių painiava |
| `hhfs` / `hhfm` | 2 | **PRIEŠTARA:** IT OCR 9 eil. (iki 70 kg), PL HTML 7 eil. (iki 50 kg) |
| `hypa` šuniukams | 2 | matrica, ta pati antraščių problema |

**Papildomai rasta (linijos, kurių neturim):** REPM URPM URPS DIPS DIPM HEPS HEPM MM/M — pilnos PL HTML lentelės.

**KELIAS ŠUNIUKŲ MATRICOMS (kitai sesijai):** iškirpti TIK antraštės juostą → OCR atskirai su `--psm 7` (viena eilutė) + skaičių whitelist. Skaičių dalis jau skaitosi patikimai.

**⚠️ IŠTAISYTA S215 EIGOJE — „ŠUNIUKŲ LENTELĖ RASTA" BUVO KLAIDA:**
Buvau pranešęs, kad radau `1→80 · 2→130 · 3→160 · 5→240 · 7→300 · 10→400 · 15→530 · 20→650`. **Tai NE lentelė — tai MATRICOS PIRMAS STULPELIS (2 mėn.).** Originalas: `Waga szczeniaka | 2 mies | 4 mies | 6 mies | 8 mies | 10 mies | 12 mies` → `1 kg | 80 | 75 | 60 | 55 | 55 | 50`. Mano `SINGLE` regex nučiupo pirmą stulpelį ir palaikė visa lentele. **Būtų reiškę: metų šuniui 80 g vietoj 50 g.** Neįrašyta.

**OCR — KAS VEIKIA IR KAS NE:**
- ✅ **Balsavimas PO EILUTĘ, ne visos lentelės identiškumas.** „Visi 3 praėjimai sutampa" → 0/12 švarių; balsavimas po eilutę → 10/10. `ocr3.py` (simple), **`ocr4.py` (matrica)**: 5 praėjimai (scale×thr×autocontrast), ≥2 balsai.
- ✅ **Sujungti baltymus prieš vertinant.** „Baltymai identiški? NE" beveik visada = praėjimas pametė eilutę, o ne kita lentelė. Kur persidengia — sutampa. Sąjunga užpildo.
- ❌ **OCR be kryžminio tikrinimo** — itališkos juostos: 1 švari iš 31. Gamina DAUGIAU diapazonų nei langelių (7 svoriai → 10 kiekių).
- ❌ **Claude paveiksliukų pats neperskaito.**
- ⚠️ **Nuolatiniai OCR dubliai:** `25→29`, `8→3`, `5→9`, `35→30`, `17→7`. **Požymis: dvi eilutės su IDENTIŠKAIS kiekiais → tai viena eilutė, vienas svoris perskaitytas blogai.** Daugumos balsas per baltymus išsprendžia. Automatinio taisymo NĖRA — daryta rankomis.
- ⚠️ **SPALVOS:** HY paveiksliukai rožiniai (`230,0,148`→pilka 86), Mediterraneo **oranžiniai** (`245,136,58`→pilka **160**). Slenkstis 150 oranžinę verčia balta → baltas tekstas ant baltos. **Naudoti kelis slenksčius (110/140/150/160/185) + autocontrast.**

**APRAŠYMŲ KLAUSIMAS — ATIDARYTAS, sprendžia Raimis PAKUOTE:**
- **Poravimas nepavyko 3 kartus:** (1) pagal sudėtį → **avieną su jautiena** (sudėtys 90% vienodos); (2) pagal SKU → 26/63, kačių schema kita; (3) pagal pavadinimą → **suaugusius su šuniukais** (mūsų pavadinimai nenuoseklūs: „Mono Protein Mediterraneo" / „ME MONO NOBLE GRAIN" / „Mediterraneo Mono Noble" tam pačiam dalykui). **Skaičius „59 skiriasi" — ATSIIMTAS.**
- **Vetfarmo tekstai su korektūros klaidomis:** `dehidraduota`, `dehydratuotas`, `gacilis` (=*gracilis*), `nėra gūdų`, `VIDUTINIO DYŽIO`. **Mūsų tekstuose teisingai.** Prielaida „jų geresni" — neįrodyta.
- **Kur poravimas neabejotinas — skiriasi ESMĖ:** INPS06 mūsų `ryžiai 49%, kiauliena 26%, mielės 3%, KALCIO chloridas` vs LT `ryžiai 36%, kiauliena 30%, mielės 3,5%, KALIO chloridas`. **Kalcio ≠ kalio chloridas.** Receptūros VERSIJOS klausimas.
- **VEIKSMAS RAIMIUI:** paimti vieną Intestinal mažoms veislėms maišą → ryžių 49% ar 36%? kalcio ar kalio chloridas? **Vienas maišas pasako, kuris šaltinis gyvas.**

**TILTO PAMOKOS (naujos S215):**
- **PHP per JS template literal SUGADINA backslash'us:** `(\d+)` → `(d+)`, regex tyliai neranda nieko (`hy_count=0`). **VISADA: PHP → base64 → embed → `Buffer.from(B64,'base64')` runneryje.**
- `ps_feeding_rows` stulpelis = **`feeding_table_id`**, NE `table_id`. Klaidinga užklausa grąžina tuščią BE klaidos.
- Contents API GET **nukerta >1 MB** → per `raw.githubusercontent.com`; **BET tas pats failo vardas + CDN lag = skaitai SENĄ**. Sprendimas: `?ref={commit_sha}`.
- Sandbox `python3 -c` su įdėtais f-string'ais lūžta — naudoti `<< 'PY'` heredoc arba `%`-formatavimą.
- **Repo priaugo 140 svetimo turinio failų** (`razioni/` 31 + `serimas/` 109). **NETRINTI** — reikalingi šuniukų matricoms. Jei repo taps viešas — išimti.

**PENDING — Exclusion:**
1. **Šuniukų matricų antraštės** (7 NGP* + 2 hypa) — antraštės juostos iškirpimas + `--psm 7`
2. `inps`/`inpm` etikečių painiava (palyginti pačius paveiksliukus)
3. `hhfs`/`hhfm` galo prieštara (7 vs 9 eil.)
4. Kačių NG (3 SKU) — netirta
5. **`feeding_mode` laukas:** 5 Exclusion katėms turi „Tik sausas pašaras" / „Sausas + konservas 85 g"; parseris žymi `activity_level`. **Skaičiai teisingi, etiketė melaginga.**
6. Aprašymai — laukia Raimio pakuotės patikros
7. **Instock aprėpties permatavimas** (senas 373/662 negalioja)

**S216 — NAUJAS DARBO MODELIS (Raimio nurodymas, galioja VISADA) + QUATTRO pradėta (2026-07-16):**

**⚡ RAIMIO NURODYMAS — KONVEJERIS, NE KLAUSINĖJIMAS:** „30 prekių šėrimo normų 3 valandas — neracionalu. Reikia SISTEMOS: identifikuok ko trūksta, DARYK iki kol viskas užsipildo, neklausinėk." **Modelis:** šaltinis → tiltas → auto-patikra → **verified rašoma IŠ KART be klausimų** → kas nepraeina → ambiguous sąrašas (nestabdo eilės) → ataskaita po brendo. **Auto-patikros taisyklė:** rašoma tik jei ≥2 nepriklausomi šaltiniai sutampa ARBA ≥3 to paties brendo paveiksliukai identiški ARBA HTML tekstas. Matricos su neaiškia amžiaus ašimi → tik ambiguous, NIEKADA nespėti. **Eilė:** Quattro 63 → Exclusion likutis 15 → Josera 33 → Prins 22 → Real Dog 19 → Ontario 18 → Gemon 15 → RC 12 → smulkūs. Po brendo — STATE.md pilnu failu.

**QUATTRO (63 SKU, IN PROGRESS — šaltiniai IŠSPRĘSTA, liko mechanika):**
- **Quattro = AB „Kauno Grūdai"** (lietuviškas!). Oficiali svetainė `quattropet.com` (EN/LT/CZ/BG).
- **63 instock SKU be lentelės** (`/tmp/quattro.json` šioje sesijoje; SKU formos `2.011761`). Linijos: begrūdis all/large breed (antiena/lašiša-krilis/ėriena; jauni/suaugę/senjorai), Extra (Lamb/Poultry/Salmon — SU GRŪDAIS), Junior, Mini, Maxi, kačių Collagen (Kitten/Steril/Indoor/Senior/Digestive).
- **Gamintojo feeding guide PNG:** 35 unikalūs repo `quattro/` (žemėlapis title↔img buvo `/tmp/qg.json`). URL šablonas: `/storage/app/media/Feeding guide/sunys/en/DESKTOP_{name}_en.png`.
- **⚠️ Gamintojo PNG = dizainerių INFOGRAFIKOS** (2012×562, piktogramos, spalvos). Visas-vaizdas OCR → šiukšlės; crop+vote pipeline (`/home/claude/qg/qocr.py`) → 1/32 ir tas blogai suporuotas. **2 nepavykę bandymai — OCR keliu toliau NEITI.** Bet lentelės juostos crop skaitosi: `DESKTOP_Salmon_en.png` apačia → `svoris 2..10 / nuo 40 54 68 80 92 103 114 125 135 / iki 47 72 79 93 106 119 132 144 156`.
- **★ SPRENDIMAS — retailer'ių HTML lentelės:**
  - **petirvet.lt** — PILNOS HTML lentelės. Pvz. Extra Salmon: `Šuns svoris (kg): 2-5|5-10|10-15|15-20|20-25|25-30|30-40|40-50|50-60 → Dienos norma (g): 47-94|94-179|179-213|213-265|265-313|313-359|359-445|445-526|526-603`. URL: `https://petirvet.lt/produktai/quattro-adult-extra-salmon-sunu-maistas/`
  - **dogsnanny.lt** — PILNOS HTML lentelės. Pvz. small breed antiena: `2→40-47 · 3→54-72 · 4→68-78 · 5→80-93 · 6→92-106 · 7→103-119 · 8→114-132 · 9→124-144 · 10→134-156`. URL: `https://dogsnanny.lt/prekes/begrudis-sunu-maistas-qattro-small-breed-adult-su-antiena/`
  - **KRYŽMINIS PATVIRTINIMAS JAU YRA:** dogsnanny HTML ↔ gamintojo PNG crop-OCR sutampa 9/9 eilučių struktūra; ±1 g nesutapimai trijuose langeliuose (78/79, 124/125, 134/135) — arbitražui trečias taškas.
  - kgshop.eu (gamintojo parduotuvė) — lentelių HTML'e NĖRA (0). pet24.lt — po 1 lentelę, netirta.
- **KITAS ŽINGSNIS (mechanika, be klausimų):** pilnas petirvet.lt + dogsnanny.lt Quattro katalogų crawl per tiltą → HTML lentelės → kryžminis su gamintojo PNG kur įmanoma → mapinti į 63 SKU pagal PAVADINIMĄ (linija+baltymas+dydis+amžius; SKU kodai neinformatyvūs) → apply verified partijomis → verifikacija → STATE.md.

**S217 — QUATTRO: 12 LENTELIŲ ĮRAŠYTA, 23 iš 59 SKU UŽDARYTA (2026-07-16):**

**DB PO APPLY (verifikuota atskiru read-only snippetu #1014, ne to paties kodo pranešimu):**
| | prieš S217 | **po S217** |
|---|---|---|
| lentelių | 169 | **181** |
| verified | 157 | **169** |
| eilučių | 3 030 | **3 200** |
| map / produktų | 365 | **388** |

Sargai: `orphan rows/map = 0/0` · `produktų su 2+ lentelėm = 0` · `apverstų rėžių = 0/0` · `row_count` = faktas visose 12.

**DVYLIKA QUATTRO LENTELIŲ** (`source_version='quattro_kgshop_petirvet_2026-07-16'`, visos `verified`):
| id | line | forma | ašis | basis | eil. | SKU | verified_by |
|---|---|---|---|---|---|---|---|
| 170 | Small Breed Adult (antiena) | simple | weight | current | 9 | 2 | `html_petirvet_x_dogsnanny` |
| 171 | Extra Lamb | simple | weight | current | 9 | 2 | `html_kgshop_x_petirvet` |
| 172 | Extra Poultry | simple | weight | current | 9 | 2 | `html_kgshop` |
| 173 | Extra Salmon | simple | weight | current | 9 | 2 | `html_petirvet` |
| 174 | Small Breed Adult (lašiša-krilis) | simple | weight | current | 9 | 2 | `html_dogsnanny` |
| 175 | All Breed Adult Lamb Monoprotein | simple | weight | current | 9 | 2 | `html_petirvet` |
| 176 | Mini Adult Poultry | simple | weight | current | 9 | 2 | `html_kgshop` |
| 177 | Mini Adult Lamb | simple | weight | current | 9 | 2 | `html_kgshop` |
| 178 | Mini Adult Salmon | simple | weight | current | 9 | 2 | `html_kgshop` |
| 179 | Maxi Adult Lamb | simple | weight | current | 7 | 1 | `html_kgshop` |
| 180 | All Breed Senior White Fish & Krill | transposed | **body_condition** | current | 18 | 2 | `html_petirvet` |
| 181 | Large Breed Junior Duck | matrix | **age** | **adult_expected** | 64 | 2 | `html_petirvet` |

- **⚠️ id170 ir id174 turi VIENODĄ `line` tekstą** („Small Breed Adult"), skiriasi tik `checksum`/SKU/baltymu. Akimi DB'e nesiskiria. Pervadinti, jei kliudys.
- **⚠️ id181 `weight_basis='adult_expected'` — MŪSŲ IŠVADA, ne šaltinio žodis.** Antraštė sako tik „Šuns svoris, kg". Pagrindas: 2 mėn. šuniukas 25–60 kg nesveria. Jei klaida — 60 kg eilutė duotų normą pagal esamą svorį.
- Snippetai: `#1013 Quattro Feeding v1` (apply logika viduje, kartojimui), `#1014 Quattro Feeding Verify v1`, `#1015 Quattro Verify v2` — **visi serveryje, išjungti**.

**⚠️ S216 KLAIDOS, IŠTAISYTOS:**
1. „63 instock SKU be lentelės" → realiai **59** (4 jau turėjo: Extra Poultry katėms 1,5/7 kg, Sterilised katėms 1,5/7 kg).
2. „**kgshop.eu — lentelių HTML'e NĖRA (0)**" → realiai **16 lentelių iš 83 Quattro URL**. Ankstesnė sesija tikrino 2 konkrečius URL ir apibendrino į nulį. **Būtent ši klaida kainavo dvi OCR ekspedicijas** — atsakymas visą laiką gulėjo gamintojo parduotuvės HTML'e.
3. „dogsnanny.lt — PILNOS HTML lentelės" → **2 iš 38 puslapių**. Collagen linija (kačių) šėrimo duomenų neturi apskritai. Realus stuburas = **petirvet + kgshop**.

**ŠALTINIŲ ŽEMĖLAPIS (Quattro = AB „Kauno Grūdai"):**
1. **kgshop.eu = GAMINTOJO parduotuvė** — 83 Quattro URL per `sitemap.xml`, **16 šėrimo lentelių HTML tekstu**, etiketės **16/16 nuoseklios**. Autoritetingiausias šaltinis. Pavadinimai švarūs (`QUATTRO Visavertis sausas ... , 7 kg`).
2. **petirvet.lt** — 16 URL, 12 lentelių, **etiketės 10/12**. Pavadinimai — SEO košė („Quattro šunų maistas"), raktas TIK iš slug'o.
3. **dogsnanny.lt** — 38 URL, **2 lentelės**.
4. **pet24.lt / zoopro.lt / quattropet.com** — sitemap'uose Quattro **nėra** (0/0/0). Netirti toliau.

**⚠️ PETIRVET ETIKETĖS SUKEISTOS (begrūdžio antienos linija) — įrodyta duomenimis:**
```
psl. "...small-breed-adult-duck"  → 2..10 kg     = Small Breed  ✔ (dogsnanny patvirtina 9/9)
psl. "...smal-breed-adult-duck"   → 2-5..50-60   = NE small breed. Pilna All Breed
psl. "...all-breed-adult-duck"    → 25-30..55-60 = NE all breed. Large Breed
```
Atskyrimas: All Breed Lamb duoda `25-30→272-311`, o „all-breed-adult-duck" — `272-312`. **Skirtingi skaičiai = skirtingi produktai**, ne ta pati lentelė. Logika sandari, bet vienintelis šaltinis yra tas pats petirvet → **abi paliktos ambiguous, NEĮRAŠYTOS.**

**⚠️ QUATTRO ≠ EXCLUSION: LENTELĖ PRIKLAUSO NUO BALTYMO.**
S215 užrakinta „lentelė nepriklauso nuo baltymo → 34 SKU uždarė 5 lentelės". **Quattro tai NEGALIOJA.** Įrodymas: SB antiena `3→54-72` vs SB lašiša-krilis `3→55-72`; Mini ėriena `2→41-47` vs Mini lašiša `2→40-46`. `scope='line'` galioja **tik per pakuotes** (1,5/3/7/12 kg), NE per skonius. Exclusion taisyklės mechaniškai netaikyti — sulipdytų skirtingas normas.

**NEĮRAŠYTA — 6 receptai (36 SKU):**
| kas | kliūtis |
|---|---|
| Maxi Adult Poultry | **šaltinio klaida:** `312-406 \| 406-402 \| 402-444` — mažėjantis rėžis. kgshop ×2 |
| Sterilised katėms | **`amount_not_monotonic`:** 7 kg `56-81` → 8 kg `61-78`. **kgshop IR petirvet identiškai** = tai gamintojo paskelbtas skaičius, ne parduotuvės klaida. Sutapimas patvirtina perrašymą, ne teisingumą |
| SB Adult Lamb | **šaltinio klaida:** 10 kg → `138-139` (rėžis susitraukia į 1 g, viršutinė krenta 147→139) |
| Kačiukų (All Breed Kitten) | `by_age`, svoriai **persidengia** (1,5-4,0 ir 3,0-5,0) → pagal svorį nevienareikšmiška |
| All Breed Adult Duck | petirvet etikečių problema (žr. aukščiau) |
| Large Breed Adult Duck | ta pati |
| **Be šaltinio išvis** | visa kačių **Collagen** linija (6 receptai), **Sport**, **Weight Loss**, SB puppy/junior/senior, All Breed salmon-krill, All Breed junior duck, Junior Poultry matrica |

**KITI RADINIAI:**
- **Extra Poultry — šaltiniai nesutaria pirmame rėžyje:** petirvet `2-4`, kgshop `2-5`. petirvet variante 4–5 kg šuo lieka BE normos (spraga); kgshop vientisas. **Imta kgshop** (gamintojas + nuoseklu). Užfiksuota `note` lauke.
- **Junior Poultry (kgshop)** = matrica **amžius(mėn) × suaugusio šuns svoris (2/6/12/25/40/60)**. Ne B1/B2 modelis. Skaičiai HTML tekstu švarūs — uždaroma bet kada, reikia tik `condition_dimensions` sprendimo.
- **59 SKU = 30 receptų.** Lentelė priklauso nuo recepto, ne pakuotės. Mastelis ne 59 vienetai darbo, o 30.

**TILTO / METODO PAMOKOS (naujos S217):**
- **`dev.avesa.lt` HTTPS grandinė SUGEDUSI:** serveriai.lt atiduoda `CN=*.serveriai.lt` wildcard **be tarpinio sertifikato** → `curl` grąžina `code=000`, atrodo kaip firewall blokada. TCP 443/80 atviri, `curl -k` → 200. **VISUR naudoti `curl -sk`.** Į `http://` neiti — App Password keliautų atviru tekstu. (Vakarykščiai „2 paleidimai success be rezultato" — greičiausiai tas pats.)
- **Code Snippets REST veikia:** `GET/POST /wp-json/code-snippets/v1/snippets` (Basic Auth). Sukūrimas: `{name,code,scope:'front-end',active:true,priority}` → grąžina `id` + `code_error`. Deaktyvavimas: `POST /snippets/{id} {active:false}`. **489 snippetai serveryje, 74 aktyvūs.** `per_page=100` — būtina paginacija.
- **❌ „Claude paveiksliukų pats neperskaito" (S215) — PATVIRTINTA DAR KARTĄ.** Bandžiau apeiti: parsisiunčiau PNG per Contents API, kirpau juostą, didinau ×2, skėliau pusiau — **skaitmenų patikimai nenuskaitau**. PNG kelias Quattro'ui **UŽDARYTAS**; jo ir nereikėjo — kgshop dengia tas pačias linijas tekstu. **Sesijos pradžioje skaityti VISĄ STATE.md, ne §0–§1** — ši klaida kainavo 4 runus.
- **⚠️ PATIKROS SĄLYGA PER PLATI — 3 kartus per sesiją.** `verified AND weight_basis IS NULL` = **2**, bet abi (`id24 Josera`, `id110 Farmina`) yra `shape='by_age'`, kur NULL yra **teisinga** (S212 tai sako). Teisingas invariantas: `verified AND weight_basis IS NULL AND shape<>'by_age' = 0`. Taip pat: šaltinių auditas pažymėjo kačių lenteles (0-5 kg, 2-8 kg) kaip „neatitinka", nes taikė šunišką „all breed 2-60" taisyklę. **Tai S212 pamoka #2 — „patikra tikrino ne tai, ką skelbė" — pakartota tris kartus.**
- Retailer'ių šaltiniai randami per `robots.txt` → `Sitemap:` → filtras `/quattro|qattro/i`. Paieškos URL **nespėlioti** (pet24/zoopro/kgshop paieškos spėjimai davė 0 nuorodų; sitemap tam pačiam kgshop davė 83).

**PENDING — Quattro:**
1. **Junior Poultry matrica** (2 SKU) — duomenys švarūs, reikia `condition_dimensions` sprendimo
2. **All Breed / Large Breed Duck** (4 SKU) — reikia antro šaltinio petirvet etiketėms patvirtinti
3. **Kačių Collagen linija** (11 SKU) — viešo šaltinio nėra
4. Sport, Weight Loss, SB puppy/junior/senior — šaltinio nėra
5. **id170/id174 vienodas `line`** — pervadinti jei kliudys
6. **id181 `adult_expected`** — mūsų išvada, ne šaltinio; peržiūrėti

**S218 — JOSERA sausas UŽDARYTAS + S216 EILĖS SKAIČIŲ REVIZIJA (2026-07-16):**

**DB PO APPLY (verifikuota atskiru read-only snippetu, ne to paties kodo pranešimu):**
| | prieš S218 | **po S218** |
|---|---|---|
| lentelių | 181 | **186** |
| verified | 169 | **174** |
| eilučių | 3 200 | **3 268** |
| map | 388 | **395** |

Sargai visi 0, įskaitant pataisytą `verified_null_basis_excl_byage = 0`.

**PENKIOS JOSERA LENTELĖS** (`source_version='josera_de_2026-07-16'`, visos `verified`):
| id | line | forma | ašis | basis | eil. | SKU |
|---|---|---|---|---|---|---|
| 182 | JosiDog Active | simple | weight | current | 7 | JOS0836 |
| 183 | JosiDog Economy | simple | weight | current | 7 | JOS0799 |
| 184 | JosiDog Regular | simple | weight | current | 7 | JOS0622 |
| 185 | JosiCat sausas (Crispy/Crunchy/Sterilised Classic) | transposed | **activity_level** | current | 8 | JOS0812, JOS0723, JOS0813 |
| 186 | JosiDog Junior Sensitive | matrix | age | **adult_expected** | 39 | JOS0849 |

**★ ŠALTINIS: `josera.de` = GAMINTOJAS, HTML tekstu.** Sitemap → 73 `josidog|josicat` URL → 18 lentelių. Vokiškai (`Gewicht` / `Futtermenge/24h`). Snippetas `#1018 Josera Feeding v1`, verify `#1019` — serveryje, išjungti.

**⚠️ FILTRO KLAIDA, KURIĄ PADARIAU:** pirmas sitemap filtras buvo `/josera/i` → **josidog/josicat puslapiai NEPATEKO** (jų URL neturi žodžio „josera"). Pataisyta į `/josidog|josicat/i` → 0 virto 73. **Sub-brendų URL nebūtinai turi motininio brendo vardą.**

**★ SEMANTINIS RADINYS — „35 - 60 g" NĖRA RĖŽIS:**
JosiCat Crispy Duck / Sterilised Classic / Tasty Beef puslapiuose stulpelis rodo `2-3kg → 35 - 60g`. Atrodo kaip rėžis vienai katei. **JosiCat Crunchy Poultry puslapis tą patį rodo kaip DVI skiltis: `wenig aktiv 35 | aktiv 60`.** Tai `activity_level`, ne `amount_from/to`. Įrašyta kaip `transposed` + `row_dimension='activity_level'` (S212 taksonomija tokį matmenį jau turi). **Be Crunchy puslapio būtų įrašytas melas visiems 3 SKU.** Pamoka: tos pačios linijos KITAS puslapis gali atskleisti stulpelio semantiką.

**⚠️ ĮTARIMAS ŠALTINYJE (įrašyta, bet pažymėta):** JosiDog Active / Economy / Regular ties **20 kg visos trys duoda IDENTIŠKĄ `230-300 g`**, nors visuose kituose svoriuose skiriasi (10 kg: 135-180 / 160-210 / 145-190). Economy atveju 230-300 iškrenta iš interpoliacijos (tarp 160-210 ir 365-480 tikėtųsi ~260-345). Panašu į josera.de copy-paste. **Monotoniškumo sargas praeina, todėl įrašyta `verified`** — bet jei kada tikrinsim, čia pirma vieta.

**NEĮRAŠYTA:** `JosiDog Family` (JOS0003) — daugiamatė (žindantis šuniukas pagal savaites × kalė tranšia/laktuojanti), HTML langeliai išsislinkę, 5 kg eilutėje vietoj skaičiaus tekstas „JosiDog Junior". Ambiguous.

**⚠️⚠️ S216 EILĖS SKAIČIAI MATUOJA NE TĄ — patikrinta per DB (`ps_feeding_map`), ne iš atminties:**
| Brendas | S216 žada | DB be lentelės (instock) | iš jų **sausas** | iš jų **konservai/skanėstai** |
|---|---|---|---|---|
| Quattro | 63 | 59 | 59 | 0 |
| Exclusion | **15** | **40** | 21 | 19 |
| Josera | **33** | **46** | **8** | **38** |

Eilės skaičiai sudėti iš viso katalogo, neatskiriant drėgno maisto. Josera atveju 38 iš 46 yra 85 g konservai.

**★ BET: KONSERVAI TELPA Į TĄ PAČIĄ SCHEMĄ.** Anksčiau šioje sesijoje buvau pasakęs, kad drėgnam reikia kitos mechanikos — **klaidingai**. `josera.de` konservų puslapiai duoda būtent `svoris → g/24h`:
```
JosiDog Beef in Sauce : 5kg→415-480 · 10kg→700-810 · 20kg→1175-1360 · 35kg→1790-2070
JosiCat Chicken Jelly : 2-3kg→145-250 · 3-4kg→190-305 · 4-5kg→230-355 · 5-7kg→265-440
JosiCat Paté (4 skoniai, vienoda): 3kg→230 · 4kg→280 · 5kg→330 · 6kg→370
```
Ta pati `simple`/`transposed` forma, tas pats `weight_basis='current'`. **Kliūtis ne schema, o poravimas** — 38 LT konservų SKU (`JOS08xx`) reikia suporuoti su vokiškais puslapiais. Tai atskiras darbas, ne blokatorius.

**PENDING — Josera:**
1. **38 konservų SKU** — lentelės josera.de yra, reikia SKU↔puslapis poravimo
2. `JosiDog Family` (1 SKU) — daugiamatė, sulaužytas HTML
3. **20 kg `230-300` sutapimas** trijose Josidog linijose — patikrinti prie progos

**PENDING — Exclusion (papildyta S218):**
- **Tikras likutis 40, ne 15.** Sausas 21: NGP* šuniukai 7 · kačių NG 3 · HYPA 2 · INPS/INPM/INPA 3 · HHFS/HHFM 2 · CHYP03 1 · DP- dubliai 2 · 1 su sugadintu SKU. Konservai 19.
- **`petmarket.lt` — 13 Exclusion psl.: šuniukų šėrimo normų NĖRA** (tik analitinė sudėtis). Retailer-HTML kelias Exclusion šuniukams NESUVEIKĖ; S215 matricų blokatorius lieka.
- **`NGCST01`/`NGCST12` (kačių sterilizuotoms su tunu) — kandidatė lentelė RASTA** petmarket'e, bet HTML struktūra sulaužyta (langeliai išsislinkę per eilutes). Išlyginus srautą: `2kg→30/20 · 3→50/40 · 4→60/50 · 5→70/60 · 6→75/65` (palaikymui/mažinant, abi monotoniškos). **Vienintelis šaltinis + atstatymas → NEĮRAŠYTA.** Reikia antro šaltinio.
- **Duomenų higiena (ne šėrimas):** produktas su SKU `d0ef54405833` (hash'as vietoj kodo, instock+publish); `DP-EXCL-HYPO-KIAUL-2KG-x2` = 2 vnt. rinkinys — būtent M8 v3.2 įspėtas pakuotės atvejis.

**ATVIRAS KLAUSIMAS (ne duomenys, produktas):** ar €/dienos skaičiuoklė apima drėgną maistą? Schema priima. M8 MASTER v3.2 to nefiksuoja. Nuo atsakymo priklauso, ar likusioje eilėje (Prins/Real Dog/Ontario/Gemon/RC) konservai skaičiuojami kaip darbas.

**M8 MASTER v3.2 — UŽRAKINTOS TEZĖS (pilnas dokumentas: `dokumentai/M8_Mano_augintinis_MASTER_v3_2.docx`):**

- **Ciniškas testas (pamatinis principas):** „Jeigu negalime vienu sakiniu pasakyti, kokią naudą klientas gauna iš karto, neturime teisės prašyti jo pildyti anketą."
- **UŽRAKINTA:** Profilis pats savaime NĖRA produktas. Produktas = naudinga funkcija; profilis = **atminties/personalizavimo sluoksnis**, kuris susiformuoja klientui naudojantis funkcijomis.
- **UŽRAKINTA:** Skaičiavimo variklis NĖRA įrašytas „Mano augintinis" puslapyje — **pakartotinai naudojamas komponentas** (produkto puslapis, profilis, palyginimas, refill, prenumerata).
- **UŽRAKINTA:** Jokio pseudo-tikslumo. Patikimumo pakopos: **A** (faktinė porcija — tiksliausia) · **B1** (tikslus svoris + patikrinta gamintojo lentelė) · **B2** (svorio intervalas → rodomas tik DIAPAZONAS, ne viena data; jei intervalas kerta nesuderinamas eilutes — neродomа) · **C** (savikalibracija iš pirkimų) · **D** (nepakanka → nerodyti skaičiaus, paaiškinti ko trūksta). Netikslus „wau" blogesnis už sąžiningą „trūksta duomenų".
- **UŽRAKINTA:** Lentelė iš `post_content`/accordion HTML **runtime NEPARSINAMA** → atskiras **FeedingTable** objektas (sk. 6.2.2): product/variation scope, weight_from/to, amount_from/to_g, condition_dimensions, source_url, source_version, parsed_at/verified_at, verified_by, **status draft/verified/ambiguous/retired — tik `verified` patenka į skaičiavimą**, checksum šaltinio pokyčiui. Etapo 2 techninė prielaida, ne detalė.
- **Pakuotės svoris:** `pa_pakuotes_dydis` = PIRMINIS šaltinis + normalizavimo žemėlapis; pavadinimo parsinimas tik guard'intas fallback. Realūs pavojai: „7 kg × 2 vnt." = 14 000 g, „15+3 kg AKCIJA".
- **Gyvas perskaičiavimas:** €/diena ir papildymo data NĖRA saugomos kaip faktas — perskaičiuojama pagal gyvą kainą arba aiškus invalidavimas. Prenumeratoriui — jo **užrakinta** kaina, ne lentynos.
- **Kalba:** vardų NELINKSNIUOJAME — vardininkas kaip žyma („Profilis — Reksas", ne „Rekso profilis"). Fallback be vardo: „Jūsų šuo".
- **Tonas:** „šiltas tikslumas" — ne šaltas analizatorius, ne tuščias albumėlis. „Paso" estetika = tik subtili metafora, NE produkto pažadas. „Praleisti" — aiškus, bet antrinis.
- **Minimalus profilis:** rūšis (privaloma) + vardas (neprivalomas) per 10–15 s. Visa kita — progresyviai, tik kai duoda tiesioginę naudą.
- **Apimtis:** šuo/katė pilnas mitybos kelias; kitoms rūšims — bazinis profilis, priminimai, užrašai, BE svorio pagrindu veikiančio skaičiavimo.
- **Mikroįžvalgos:** rašo/tvirtina Raimis+konsultantas kaip atskiras turinio failas — **NE programuotojo improvizacija**, jokių diagnozių.
- **ETAPAI:** 0 strategijos freeze · 1 stabilus bazinis M8 · **2 produkto puslapio skaičiuoklės MVP (anonimui, kuruoti SKU)** · 3 profilio kontekstas+išsaugojimas · 4 pirkimų istorija+refill · 5 užrašų knygelė · 6 lojalumo MVP · 7 plėtra. Sprendimas #7 („istorija prieš gyvą onboarding") NEREIŠKIA „prieš variklį".
- **Lojalumas = Etapas 6** + **STOP TAISYKLĖ:** jei 1% bazė + N-to užsakymo dvigubinimas su siuntimo subsidija netelpa į indėlio maržą — **NEKOREGUOTI slaptais kategorijų koeficientais**; keisti kvalifikacinę sumą, N dažnį, panaudojimo ribą arba visą modelį.
- **17 sk. = 17 ATVIRŲ SPRENDIMŲ**, laukiančių Raimio patvirtinimo. Prieš kodą: (1) pažymėti nesutikimus, (2) patvirtinti 17 sk., (3) iškirpti atskirą etapo TŽ, (4) tik tada koduoti.

**RECON RADINIAI (2026-07-15):**
- **Šėrimo lentelės:** 722 sauso maisto publish (516 šunims + 206 katėms), instock 661; su struktūrizuota `<table>` lentele („Šėrimo instrukcija" → „Šuns/Katės svoris"/„Kiekis per parą") **530/661 = 80,2%**. Meta laukuose šėrimo duomenų NĖRA — tik `post_content`. 100%: Farmina 155/155, Eukanuba 37/37, Gemon, IAMS, Family. SPRAGOS: **Exclusion 8,6% (TOP revenue brendas — 22,7% pardavimų!)**, Royal Canin 8%, Quattro 7,8%, Prins/Ontario/GreenPetFood/Rasco 0%. → ~130 SKU turinio darbas yra €/dienos skaičiuoklės PRIELAIDA, ne lygiagretus darbas.
- **Esama skaičiuoklė:** `petshop.lt/sunu-maisto-skaiciuokle` = PIRMAS meniu punktas; turinys = Netlify **deploy-preview** nuoroda (`69471d72...--meek-kashata-41a643.netlify.app`); neprijungta prie produktų/kainų → gramai, ne €/diena; deploy-preview = tyliojo mirimo rizika. → TŽ v1.59.
- **Klientų migracija:** petshop.lt = **eShoprent** (OpenCart šeimos, nuomojama), naudojama nuo 2024-11. ~1050 klientų, ištraukiama TIK paštas+vardas, **pardavimų istorija nemigruoja**. Slaptažodžiai nemigruoja (hash'ai nesuderinami) — **magic link (S207/S209) = migracijos įgalintojas**. Neištirta: Audac sąskaitos su SKU eilutėmis. Dovanų kuponai (`route=account/voucher`) = finansinis įsipareigojimas. → TŽ v1.59.
- **Lojalumo plugin'o dev'e NĖRA** (29 plugin'ai, 0 loyalty/points/rewards). Modelis svarstytas: 1€=1 taškas, 100 taškų=1€, kas 5-as kvalifikuotas užsakymas dvigubas (≈1,2%), bonusų lentynėlė, galiojimas 24 mėn. nuo paskutinio užsakymo, PVM = techniškai nuolaida (−€). **NEUŽRAKINTA** — reikia realios maisto maržos + buhalterio atsakymo.

**SKOLOS PO ŠIOS SESIJOS:** ~~S204–S211 neįrašyti į deployment_log~~ → **UŽDARYTA: `deployment_log_v1_3_69.md`** (S208–S211 + strateginė sesija; darytas nuo repo v1.3.68, NE nuo Raimio PC v1.3.48 — ta versija buvo 20 sprendimų atsilikusi, rašymas ant jos būtų ištrynęs S182–S201). **DĖMESIO — dviguba apskaita:** Raimio PC deployment_log buvo **v1.3.48 (iki S181)**, repo — v1.3.68/69. Prieš kitą kartą sinchronizuoti. GitHub PAT **nerotuotas** (buvo pokalbyje). TEMP M8 snippetai valyti po kiekvieno naudojimo (patikrinta).

**PENDING DARBAI (dar NEPADARYTI):**

**M11 Refill Engine** — DIZAINAS PARUOŠTAS (dokumentai/m11_refill_dizainas.md), KODAS NEPADARYTAS. Self-calibrating iš pirkimo istorijos (NE teorinės normos — produktų weight tuščias, pakuotės formatas nevienodas). Launch MVP: grubus intervalas pagal pakuotės dydį (maža→14d/vidutinė→30d/didelė→60d, confidence 0.4); po 2+ pirkimų kalibruojasi iš realaus intervalo (confidence→0.9). DB ps_refill_tracking. Srautas: order_paid→įrašom; cron→refill_due. ATVIRAS: per klientą+produktą ar per augintinį? refill_due schema: pet_id, product_id, predicted_empty_date, confidence.

**M8 "Mano augintinis"** — BACKEND ✅ (S195) + ANKETA ✅ (S196, core v0.10.0): 2-zingsniu anketa gyva (shortcode [petshop_pet_form] + MyAccount tab 'augintinis'), visos 7 rusys, dinamiski laukai, localStorage juodrastis 30d, magic link issaugojimas, brand autocomplete. Vizualiai patvirtinta (0 JS klaidu). + DASHBOARD ✅ (S197) + PHOTO ✅ (S198) + PROFILIO EKRANAS ✅ (S199, core v0.13.0). **M8 IS ESMES BAIGTAS.** Anketa (2 zingsniai, 7 rusys, localStorage, magic link) + profilio ekranas (antraste, refill zied. 3 spalvos, priminimu laiko juosta, lentynele, mitybos ritmas+feedback, pilnumas, nuotraukos upload) + visas backend gyvi. Vizualiai patvirtinta. ILIUSTRACIJOS ✅ (S200) + AKTUALU SIANDIEN ✅ (S201, core v0.14.0): 12 kortelu v1.1 (konsultanto pataisos: sterilised fix, sezonas per metu riba, CTA be URL paslepta, 5 tekstai suvelninti), Pet_Content atrankos variklis (OR/AND semantika, cooldown per user+pet+content, seniausiai-matytas tie-break, null->blokas nerodomas). Visi testai zali. LIKO M8 (smulku): content iliustracijos (dizaineris, optional), daugiau ne-suo/kate turinio (po MVP), analytics (impression+cta_clicked), produkto priskyrimo ekranas (P1), neprisijungusiu E2E testas.

**M10 Subscription** — NEPADARYTA (sudėtingiausias). Paysera custom gateway, recurring, dviejų ašių modelis, dunning.

**M13 Reminders** — ✅ PADARYTA (S194, core v0.8.0). REST CRUD, cron daily, M6 confirm/reschedule tokenai, repeat.

**M16 Master DB import** — NEPADARYTA. legacy_contact_imported, ~1175 legacy produktai.

**M5 Google Identity** — NEBE KRITINIS (S185 sprendimas: magic link pakeičia iki launch). Post-launch jei magic link nepakanka. Login plugin dev'e NĖRA — jei darysim, stabilus social-login plugin, dedup/legacy-link mūsų kode.

**order_shipped realios meta verifikacija** — ATSKIRA UŽDUOTIS (dokumentai/order_shipped_verifikacija_launch.md). Launch dieną su pirmu realiu siuntiniu.

**RECON PATVIRTINTA (v0.2.0 pradžioje):** Sender `/account/fields` NEVEIKIA (404) — PS_ reikšmes skaitom per subscriber `columns[]`. `POST /subscribers` ant egzistuojančio → HTTP 200 (upsert saugus be tikrinimo). Rate limit 300/min. Status modelis: `{email:marketing, temail:transactional}`.

**Paraleliai (Raimio pusėje):** Paysera kortelių priėmimo aktyvavimas projektui 191898 (bazinis sluoksnis prieš recurring).

**Atviri MVP likučiai** (nekritiška): poreikio filtrai, CTA telefonas — žr. deployment_log S175. Probe snippetų valymas — neišvalyta.

---

## 2. AKTYVU DABAR → nuorodos (repo `raimis079-creator/petshop-bridge`)

| Kas | Kur repo |
|---|---|
| Atrinktos modulis (snippet #685) | `moduliai/atrinktos-modulis-v1.php` |
| /sunims/ landing (snippet #688) | `moduliai/kategorijos-landing-v1.php` |
| Atrinktos pool (5 rūšys) | `moduliai/{sunims-pool20,katems-pool20,grauzikams-pool12}.json` (paukščių/žuvų pool inline #685) |
| Kategorijų webp (5 rūšys) | `assets/{sunims(8),katems(8),grauzikams(4),pauksciams(3),zuvims(3)}-kategorijos/` |
| Maisto mygtukai v2 (#692) | `moduliai/maisto-mygtukai-v2.php` |
| Šios sesijos sprendimai (S175 A–G) | `dokumentai/deployment_log_v1_3_45.md` |
| Maisto mygtukai (#692), Mobile fix (#693) | kodas snippet'uose serveryje; santrauka S175-E/G |

---

## 3. IŠORINIAI DOKUMENTAI → nuorodos + VERSIJOS

| Dokumentas | Versija | Kur | Ką laiko |
|---|---|---|---|
| **TŽ MASTER** | **v1.59** | `dokumentai/TZ_MASTER_v1_59.docx` | Spec — *ką statom* (v1.59 = pre-launch radiniai: esama skaičiuoklė, klientų migracijos prielaida, šėrimo lentelių apimtis) |
| **M8 „Mano augintinis" MASTER** | **v3.2** | `dokumentai/M8_Mano_augintinis_MASTER_v3_2.docx` (v3.1 istorijai) | Strateginis: profilis=atminties sluoksnis, €/dieną, FeedingTable, refill, užrašai, lojalumas. 18 sk. + priedai; 17 sk. = 17 atvirų sprendimų. Tezės ↓ §1 |
| **architektūra v2** | **v2** | `dokumentai/architektura_v2.md` | Provider-neutralus pamatas + 16 modulių priklausomybės (S185, pakeičia v1) |
| **event registry** | **v1** | `dokumentai/events/EVENTS.md` + 13 `.schema.json` | Kanoninis 13 P0 event sąrašas + JSON schemos (S185) |
| **deployment_log** | **v1.3.69** | `dokumentai/deployment_log_v1_3_69.md` | S-numeruota deploy istorija — *kas pastatyta + kodėl* (**iki S211** + 2026-07-15 strateginė sesija). *Pastaba: v1.3.66/„iki S192" eilutė buvo klaidinga — repo realiai turėjo v1.3.68 iki S201; ištaisyta 2026-07-15.* |
| Rašymo tiltas (runbook) | — | projekto failas | Tilto mechanika |
| Dropship pajamų architektūra | — | projekto failas | Strategija |
| Rinkiniai / Build-a-box strategija | — | projekto failas | Strategija |
| **Architektūros žemėlapis** | v1 | `/mnt/user-data/outputs/architektura_v1.md` (Raimio PC) | 16 modulių + 9 DB lentelės + priklausomybės |
| **Prenumeratos sprendimas UŽRAKINTA** | 2026-07-14 | `dokumentai/prenumerata_uzrakinta_2026-07-14.md` | Dvi ašys, launch default, dunning mūsų pusėje |
| **Etapo A planas v2** | v2 | `/mnt/user-data/outputs/etapas_A_planas_v2.md` (Raimio PC) | 12 žingsnių pagal priklausomybes |

**Dviguba apskaita:** Raimis laiko TŽ + deployment_log PC; Claude — repo. Claude rašo tik ką pats generuoja; Raimio rankinius keitimus įkelia gavęs. Niekada abu aklai vienu metu.

---

## 4. TILTO MECHANIKA (kaip viskas vykdoma)

- Repo `raimis079-creator/petshop-bridge`, workflow ID `298960963`, branch `main`.
- Pattern: rašyk `.mjs` → base64 PUT į `screenshot.mjs` (fetch SHA pirma) → dispatch (inputs: url, browser [0=curl ~25s, 1=Playwright ~110s]) → poll run → runner rašo į `analize/` (putText) ar `screenshots/` (putBinary) → skaityk atgal (CDN lag, dideli >1MB failai per `/git/blobs/{SHA}`).
- `api()` curl BŪTINA `--max-time` (kitaip didelis POST užstringa → workflow in_progress amžinai).
- WP auth: `WP_USER`, `WP_APP_PASS` (`.replace(/\s+/g,'')`) env. dev.avesa.lt tik su `-k` (TLS). Token probe snippetams: `cmplz_6680aa2a42151d54fa8d64ec`.
- Operaciniai snippetai: `scope='global'` + `wp_loaded` + early-exit + token check. Probe: deaktyvuoti/ištrinti po naudojimo.
- Code Snippets REST DELETE NEVEIKIA → trink iš DB `gaj6_snippets`. UPDATE per REST POST /snippets/{id} VEIKIA.
- Sandbox pasiekia TIK github/pypi/npm. PHP lint: `apt install php-cli` po `apt update`.

---

## 5. NELIESTI — live snippetai (produkcija)

**Landing sistema (S175–S178, VISOS 5 rūšys):** #685 (Atrinktos modulis — 5 rūšių pool) · #688 (Landing — parent 70/77/87/89/93; grid+poreikis+atrinktos config-driven) · #692 (Maisto mygtukai v2 — šunims+katėms) · #693 (Mobile filtrų fix)

**Post-launch klaidų taisymai (S179):** #705 v2 (Nuotraukų vienodinimas — WC loop + build-a-box) · #707 v2 (UI lokalizacija EN→LT — gettext + widget_title) · #709 v2 (Build-a-box apatinio bloko slėpimas: MNM žinutė + container kiekis; scope `body.petshop-choice-page`)
Katės media ID: maistas 34623, kraikai 34624, tualetai 34625, skanėstai 34626, žaislai 34627, draskyklės 34628, dubenėliai 34629, vitaminai 34630.
Graužikų media ID: pašaras 34631, skanėstai 34632, narvai 34633, kraikas/šienas 34634.
Paukščių media ID: lesalas 34635, skanėstai 34636, aksesuarai 34637.
Žuvų media ID: akvariumo maistas 34638, tvenkinių 34639, įranga 34640.

**Buvę:** #329 (Filtrai PILNAS v14) · #332 (Filtrų Kontekstas v19) · #492/#493 (Filtrų Atidarymas) · #512 (Aprašymų Accordion) · #461 (Rikiavimas) · #565 (VF Sync) · #239 (Disable Image Sizes) · #648/#653 (sąskaitos)

**Backup optionai (jei reikia atkurti):** `ps_sidebars_widgets_backup` (Footer 1 widgetai) · `ps_vetdiet_revert_log` (pa_speciali_mityba).

**ESP/Sender (S181):** `petshop-esp` v0.1.0 plugin **AKTYVUS** dev'e (`wp-content/plugins/petshop-esp/`) — interface + event log + public API `ps_emit_event()`. Failai repo `plugins/petshop-esp/`. Lentelė `gaj6_ps_event_log` migruota (12 stulpelių + 5 indeksai, UNIQUE event_id+adapter). #713 „Sender Webhook Receiver v1" DEAKTYVUOTAS (bus perkeltas į plugin v0.3.0). Sender pusėje: PS_TEST grupė (bDxp2q), 3 PS_ custom fields, testiniai kontaktai soft-deleted, webhook.site webhookai IŠTRINTI. Sender account azv2GY, domenas petshop.lt (id eE9p2l) verifikuotas. Tokens GitHub secrets: SENDER_MARKETING_TOKEN, SENDER_TRANSACTIONAL_TOKEN.

---

## 6. DIZAINO SISTEMA

#2D5F3F primary žalia · #A8C9A0 accent · Inter · #E67E22 sale badge · 8px radius · sage žalias + eukalipto kategorijų iliustracijos (B variantas).
