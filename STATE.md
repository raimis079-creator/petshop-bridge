# STATE.md — petshop.lt migracija · MASTER INDEKSAS

> **Šitą failą Claude skaito PIRMĄ kiekvieną sesiją.** Tai indeksas + darbo taisyklės, ne turinio saugykla. Turinys — kituose failuose, čia tik nuorodos.
> Paskutinį kartą atnaujinta: **2026-07-15 vakaras** (po S204–S211 + strateginės sesijos: M8 anketa/login/redagavimas/produktų paieška gyvi; strateginis pivotas į €/dienos skaičiuoklę; TŽ MASTER v1.59; M8 „Mano augintinis" MASTER v3.2 — Raimio PC).

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
