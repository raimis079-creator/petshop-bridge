# PETSHOP ATASKAITŲ STANDARTAS v2 — SPECIFIKACIJA VYKDYTOJUI
Versija: 1.0 · Data: 2026-08-16 · Statusas: PATVIRTINTA SAVININKO
Maketai (vienintelis vizualus etalonas): `ataskaitu_standartas_v2_maketas.html` (Surenkami) ir `rinkiniu_ataskaita_maketas.html` (Rinkiniai).

> **KAM ŠIS DOKUMENTAS.** Tu esi vykdytojas — AI, kuris rašys kodą. Visi sprendimai jau priimti savininko (Raimio). Tavo darbas — įgyvendinti TIKSLIAI kaip aprašyta. Jei kas nors dokumente dviprasmiška arba realybė serveryje neatitinka aprašymo — STOP ir klausk, nespėliok. Maketų HTML yra etalonas išvaizdai ir tekstams; šis dokumentas — etalonas duomenims ir logikai. Jei jie prieštarauja — galioja šis dokumentas.

---

## 0. DARBO TAISYKLĖS (PRIVALOMOS, IŠ PROJEKTO PRAKTIKOS)

1. **Pilno failo taisyklė.** Failai keičiami TIK pilnu perrašymu, net jei keičiasi 1 eilutė. Jokių fragmentų.
2. **Dry-run → savininko peržiūra → apply → nepriklausoma verifikacija.** Rašantys DB veiksmai (ALTER, backfill) pirmiausiai dry-run režimu su ataskaita, apply tik po savininko „daryk".
3. **Vizuali patikra prieš „padaryta".** Kiekvienas ekrano pakeitimas patvirtinamas ekrano nuotrauka per tiltą (browser=1) arba realaus HTML curl'u. Deploy log'as NĖRA įrodymas.
4. **Kai pataisa pablogina — atšaukti, ne lipdyti ant viršaus.** Prieš perrašant svetimą veikiantį kodą — išsisaugoti pilną originalą.
5. **Tiltas:** GitHub Actions `raimis079-creator/petshop-bridge`, workflow 298960963. Runner — `screenshot.mjs` per PUT, dispatch su `browser=0` (PHP, ~25 s) arba `browser=1` (Playwright, ~90–140 s). Rezultatas — `putResult()` į `screenshots/`, skaityti per konkretų commit SHA (`?ref=SHA`). 25 s pauzė tarp PUT ir dispatch. Kiekvienam run'ui unikalus GET raktas + VERSIJA žymė atsakyme.
6. **TEMP snippet'ai** (kuriami per `code-snippets/v1/snippets`) po naudojimo deaktyvuojami (`active:false`; DELETE per REST neveikia — grąžina 500 ir netrina). Sesijos pradžioje deaktyvuoti visus likusius `TEMP*`.
7. **Aplinka:** dev.avesa.lt, WP prefiksas `gaj6_`, PHP 8.3, MariaDB 10.6. dev'e realių užsakymų NĖRA — tušti skaičiai yra NORMA, jų nekomentuoti.
8. **Moduliai gyvena** `wp-content/mu-plugins/`. Diegiama per tiltą: failas → base64 → laikinas snippet įrašo į mu-plugins → `token_get_all(TOKEN_PARSE)` sintaksės patikra PRIEŠ įrašant → md5 sutapimo patikra PO įrašymo.
9. **Kodo kalba:** PHP komentarai ir identifikatoriai be lietuviškų diakritikų (kaip esamuose moduliuose); ekrano tekstai — taisyklinga lietuvių kalba su diakritikais, imami iš maketų.

---

## 1. KONTEKSTAS IR TIKSLAS

Yra du ataskaitų ekranai lange „Petshop ataskaitos" (`PARENT = 'petshop-reports'`, registruojamas `wp-content/plugins/petshop-core/includes/class-admin-reports.php`):

- **„Surenkami rinkiniai"** — build-a-box dėžės (MnM, klientas pats renka prekes). Esamas modulis `petshop-rinkiniu-ataskaita.php` v1.1 — PERDAROMAS pagal šį standartą.
- **„Rinkiniai"** — paruošti MnM rinkiniai (fiksuota sudėtis) ir DP pakai (ta pati prekė ×N, `_dp_base_product_id` + `_dp_pack_qty`). NAUJAS ekranas.

Standarto esmė — kiekviena ataskaita atsako į tris klausimus ta tvarka: **kiek uždirbau ir ar auga** (pinigai + palyginimas + tendencija) → **kas tai lemia** (lentelė su rikiavimu) → **ką daryti** (veiksmo blokai su taisyklėmis).

Duomenų principas: **ekranai skaito TIK dienos suvestinę** `ps_ataskaitu_dienos` (+ šiandienos realaus laiko sluoksnį), NIEKADA neskenuoja visų užsakymų užklausos metu. Žali elgsenos įvykiai — tarpinė žaliava, po 90 d. agreguojami ir trinami.

---

## 2. DUOMENŲ BAZĖS SCHEMA

### 2.1. `{prefiksas}ps_laukai_ivykiai` — v2 (ALTER esamai)

Esama lentelė (žr. `petshop-statistika.php` v1.0, `SCHEMOS_VERSIJA = 1`). Pridedami 4 stulpeliai. Nauja schemos versija: **2** (opcija `ps_stat_schema`). Naudoti `dbDelta` su pilnu CREATE TABLE aprašu — jis pats prideda trūkstamus stulpelius.

```sql
CREATE TABLE {p}ps_laukai_ivykiai (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  laikas DATETIME NOT NULL,
  sesija CHAR(32) NOT NULL DEFAULT '',        -- '' = be sutikimo (1 sluoksnis)
  sritis VARCHAR(24) NOT NULL DEFAULT 'laukai', -- 'laukai' = surenkamos dezes; rezervuota 'rinkiniai'
  deze_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
  preke_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
  tipas VARCHAR(24) NOT NULL DEFAULT '',
  verte VARCHAR(64) NOT NULL DEFAULT '',
  dydis VARCHAR(8) NOT NULL DEFAULT '',        -- NAUJAS: '400' / '800' / '' (vieno dydzio deze)
  skirtukas VARCHAR(24) NOT NULL DEFAULT '',   -- NAUJAS: aktyvus filtras ivykio metu (zr. 3.3)
  kiek_dezeje SMALLINT UNSIGNED NOT NULL DEFAULT 0, -- NAUJAS: vnt. skaicius dezeje (zr. 3.4)
  irenginys VARCHAR(8) NOT NULL DEFAULT '',    -- NAUJAS: 'mobile' / 'desktop'
  aplinka VARCHAR(8) NOT NULL DEFAULT 'dev',
  PRIMARY KEY (id),
  KEY laikas (laikas),
  KEY deze (deze_id, tipas),
  KEY preke (preke_id, tipas),
  KEY sesija (sesija)
) {charset_collate};
```

Draudimai: į lentelę NIEKADA nerašomas IP adresas, pilnas user-agent, vartotojo ID ar bet koks kitas asmens identifikatorius. `irenginys` nustatomas kliento pusėje JS (`matchMedia('(max-width:768px)')` → mobile, kitaip desktop) — serveris user-agent NESKAITO.

### 2.2. `{prefiksas}ps_ataskaitu_dienos` — NAUJA dienos suvestinė

Viena lentelė visoms ataskaitoms. Pinigai — CENTAIS (INT), kad nebūtų float paklaidų.

```sql
CREATE TABLE {p}ps_ataskaitu_dienos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  diena DATE NOT NULL,
  aplinka VARCHAR(8) NOT NULL DEFAULT 'dev',
  sritis VARCHAR(24) NOT NULL,                 -- 'laukai' | 'pardavimai' | 'parduotuve'
  deze_id BIGINT UNSIGNED NOT NULL DEFAULT 0,  -- dezes/rinkinio/pako produkto ID (0 = netaikoma)
  preke_id BIGINT UNSIGNED NOT NULL DEFAULT 0, -- komponento ID (0 = lygmuo be prekes)
  dydis VARCHAR(8) NOT NULL DEFAULT '',
  skirtukas VARCHAR(24) NOT NULL DEFAULT '',
  irenginys VARCHAR(8) NOT NULL DEFAULT '',
  tipas VARCHAR(24) NOT NULL,                  -- metrikos raktas (zr. 2.3)
  kiekis INT NOT NULL DEFAULT 0,               -- ivykiu / vnt. skaicius
  sesiju INT NOT NULL DEFAULT 0,               -- unikaliu sesiju sk. (tik elgsenai; 0 pardavimams)
  suma_ct BIGINT NOT NULL DEFAULT 0,           -- pajamos centais SU PVM (tik pardavimams)
  sav_ct BIGINT NOT NULL DEFAULT 0,            -- savikaina centais be PVM (tik pardavimams)
  PRIMARY KEY (id),
  UNIQUE KEY dim (diena, aplinka, sritis, deze_id, preke_id, dydis, skirtukas, irenginys, tipas),
  KEY diena (diena, sritis, tipas)
) {charset_collate};
```

Rašymas visada per `INSERT ... ON DUPLICATE KEY UPDATE kiekis=kiekis+VALUES(kiekis), ...` — idempotencija tos pačios dienos perskaičiavimui.

### 2.3. Suvestinės `tipas` žodynas

**sritis='laukai' (elgsena, iš įvykių):** `atidare`, `idejo`, `iseme`, `min_pasiekta`, `dovana_atrakinta`, `dovana_rinko`, `dydis_perjunge`, `po1`, `krepselis`, `nupirko` (žr. 5.4), `kabliukas`, `uzdarytoja` (išvestiniai, žr. 5.3). Elgsenos eilutėse `sesiju` = unikalių NE tuščių sesijų sk. toje dimensijoje; `kiekis` = visų įvykių sk. (įskaitant be sesijos).

**sritis='pardavimai' (iš užsakymų):** `parduota` (deze_id = konteinerio/pako ID, preke_id = komponento ID arba 0 konteinerio lygmens eilutei; kiekis, suma_ct, sav_ct), `dovana` (dovanų eilutės atskirai: kiekis + sav_ct), `be_savikainos` (eilučių sk., kur savikaina nežinoma), `grazinta` (NEIGIAMI kiekis/suma_ct/sav_ct, rašoma GRĄŽINIMO dienos data — savininko sprendimas: istorija atgaline data nesikeičia), `atskirai` (to paties komponento pardavimai NE rinkinyje — kanibalizacijai; preke_id užpildytas, deze_id=0), `dp_pakopa` (DP pirkimai pagal pakopą: deze_id = pako ID, verte pakopa rašoma į `dydis` lauką kaip 'x1'/'x2'/'x3').

**sritis='parduotuve':** `pajamos` (visos parduotuvės dienos pajamos su PVM centais — KPI „dalis apyvartoje" vardikliui; visi kiti laukai 0/'').

### 2.4. Užsakymo eilučių meta (rašoma pardavimo momentu)

| Raktas | Kur | Kas | Būsena |
|---|---|---|---|
| `_ps_savikaina_vnt` | visos eilutės | savikaina be PVM, wc_format_decimal 4 | YRA (v1.0) |
| `_ps_savikaina_saltinis` | visos eilutės | iš kur savikaina | YRA (v1.0) |
| `_ps_dovana` | dovanų eilutės | bool | YRA (laukai modulis) |
| `_ps_stat_sesija` | konteinerio eilutė | `ps_stat_s` slapuko reikšmė checkout metu, jei yra; kitaip nerašoma | **NAUJAS** |
| `_ps_dydis` | konteinerio eilutė | pasirinktas dėžės dydis ('400'/'800'/'') | **NAUJAS** |
| `_ps_kaina_atskirai_vnt` | rinkinio/pako VAIKŲ eilutės ir DP pako eilutė | komponento kaina perkant atskirai (su PVM) pardavimo momentu — „Sutaupote" ir nuolaidos gylio skaičiavimui | **NAUJAS** |

`_ps_dydis` šaltinis: dydis gyvena surenkamos dėžės krepšelio duomenyse (`petshop-laukai.php` v1.15+ pakopų variklis / MnM 2.8.7 krepšelio forma). PIRMAS ŽINGSNIS prieš kodą — recon per tiltą: išspausdinti realaus krepšelio item'o masyvą su dėže ir rasti tikslų raktą, kuriame laikomas dydis. NESPĖLIOTI rakto pavadinimo.

`_ps_kaina_atskirai_vnt` šaltinis: vaiko produkto aktuali pardavimo kaina (`$product->get_price()` su PVM per `wc_get_price_including_tax`) įrašymo momentu; DP pakui — bazinės prekės (`_dp_base_product_id`) kaina.

---

## 3. ĮVYKIŲ ŽODYNAS (VITRINOS SLUOKSNIS)

### 3.1. Tipai ir kada siunčiami

| tipas | Kada | preke_id | verte |
|---|---|---|---|
| `atidare` | dėžės puslapis užkrautas ARBA greita peržiūra atidaryta | 0 | '' |
| `idejo` | prekė pridėta į dėžę | komponento ID | pridėtas kiekis (int) |
| `iseme` | prekė pašalinta / kiekis sumažintas | komponento ID | pašalintas kiekis (int) |
| `min_pasiekta` | dėžė PIRMĄ kartą sesijoje pasiekė minimalų vnt. skaičių | 0 | min riba (int) |
| `dovana_atrakinta` | pasiekta dovanos išlaidų riba (pirmą kartą sesijoje) | 0 | riba eurais, pvz. '30' |
| `dovana_rinko` | pakeista pasirinkta dovana | dovanos prekės ID | '' |
| `dydis_perjunge` | perjungtas 400↔800 | 0 | 'is>i', pvz. '400>800' |
| `po1` | paspaustas „po 1 vnt." dėžės lizde | komponento ID | '' |
| `krepselis` | dėžė sėkmingai įdėta į krepšelį | 0 | dėžės suma eurais, pvz. '48.12' |

„Pirmą kartą sesijoje" dedupikuoja kliento JS (sessionStorage vėliavėlė), ne serveris.

### 3.2. `dydis`
'400' / '800' šunų konservų dėžei; '' visoms vieno dydžio dėžėms. Reikšmė — aktyviai pasirinktas dydis įvykio momentu.

### 3.3. `skirtukas` — LEISTINOS REIKŠMĖS (uždaras sąrašas)
`be_vistienos`, `monoproteinas`, `visi`, `isrankioms`, '' (dėžė be skirtukų). Reikšmė — AKTYVUS filtro skirtukas įvykio momentu. `atidare` įvykiui — skirtukas, kuris aktyvus užkrovus (numatytasis). Jei ateityje atsiras naujų skirtukų — reikšmė = skirtuko slug'as, ekranai rodo dinamiškai.

### 3.4. `kiek_dezeje` — TIKSLI SEMANTIKA
Bendras vienetų skaičius dėžėje, KAI VEIKIAMA PREKĖ DAR/JAU YRA VIDUJE:
- `idejo` → skaičius PO pridėjimo (pirmoji prekė sesijoje = 1 — tai kabliuko požymis);
- `iseme` → skaičius PRIEŠ pašalinimą;
- kitiems tipams → einamasis dėžės dydis įvykio momentu (gali būti 0).

### 3.5. Siuntimas
Esamas AJAX `ps_stat_ivykis` (POST, paketais iki 50). JS papildomai prideda `dydis`, `skirtukas`, `kiek_dezeje`, `irenginys` kiekvienam įvykiui. Prieš puslapio uždarymą nesiųsti per sendBeacon Complianz kontekste — palikti esamą paketinį modelį; įvykiai kaupiami ir siunčiami kas 5 s arba pasiekus 20 įvykių.

---

## 4. DU SLUOKSNIAI IR SUTIKIMAS (KRITINĖ LOGIKA)

**1 sluoksnis — be sutikimo, VISIEMS lankytojams.** Įvykiai rašomi su `sesija = ''`. Jokio slapuko, jokio identifikatoriaus įrenginyje, jokio IP/UA. Iš šio sluoksnio veikia: rodyta/įdėta/išimta, įdėjimo dalis, išėmimai pagal pilnumą, skirtukų ir dydžių pasiskirstymai, dydžio perjungimai.

**2 sluoksnis — TIK su Complianz statistikos sutikimu** (`cmplz_has_consent('statistics')` tikrina KLIENTO JS prieš dedant slapuką ir serveris prieš priimant ne tuščią sesiją). Slapukas `ps_stat_s`: 32 hex simboliai, first-party, galiojimas 30 dienų, generuoja JS. Su sesija veikia: piltuvėlis, konversija, kabliukai, uždarytojos, ryšys su užsakymu.

**Serverio taisyklė `ajax_ivykis()`:** jei sutikimo nėra — įvykiai VIS TIEK rašomi, bet `sesija` priverstinai išvaloma į ''. (Tai keičia esamą v1.0 elgesį, kur be sutikimo nerašoma NIEKO.)

**Ekranuose** prie visų sekos metrikų (piltuvėlis, konversija, kabliukai, uždarytojos, „išliko iki pirkimo") — pastaba „iš sutikusių su statistika". Pinigų metrikos — iš VISŲ užsakymų, žymos nereikia.

**Pastaba vykdytojui:** ši dviejų sluoksnių schema — savininko patvirtintas modelis pagal rinkos praktiką (anoniminiai skaitliukai be identifikatoriaus). Galutinį teisinį žodį dėl Complianz konfigūracijos tars savininko teisininkas — tai NE tavo sprendimas ir ne tavo darbas.

---

## 5. AGREGAVIMAS (NAKTINIS CRON + REALUS LAIKAS)

### 5.1. Cron
`ps_ataskaitu_agregavimas`, kasdien ~03:15 serverio laiku (wp_schedule_event 'daily'). Agreguoja VAKARYKŠČIĄ dieną (ir, saugos sumetimais, permeta paskutines 3 dienas — idempotencija per ON DUPLICATE KEY).

### 5.2. Elgsenos agregavimas
Iš `ps_laukai_ivykiai` už dieną: GROUP BY (sritis, deze_id, preke_id, dydis, skirtukas, irenginys, tipas) → `kiekis` = COUNT(*), `sesiju` = COUNT(DISTINCT NULLIF(sesija,'')).

### 5.3. Išvestiniai sekos rodikliai (skaičiuojami iš žalių įvykių TĄ PAČIĄ naktį)
Kiekvienai dienos sesijai (sesija != ''):
- **kabliukas**: pirmojo `idejo` įvykio preke_id → +1 į tipas='kabliukas' (dimensijos: deze_id, preke_id, dydis).
- **uzdarytoja**: jei sesijoje yra `krepselis` — paskutinio `idejo` PRIEŠ pirmą `krepselis` preke_id → +1 į tipas='uzdarytoja'.
- Piltuvėlio žingsniams papildomo skaičiavimo nereikia — `sesiju` stulpelis pagal tipą jau duoda unikalius perėjimus.

### 5.4. Užsakymų agregavimas (sritis='pardavimai')
Iš užsakymų, SUKURTŲ tą dieną (statusai processing/completed/on-hold):
- Konteinerių žemėlapis per `_mnm_cart_key` ↔ vaikų `_mnm_container` (PATIKRINTA #34952 — būtent maišos raktas, NE eilutės ID).
- Kiekviena vaiko eilutė → `parduota` (deze_id=konteinerio produkto ID, preke_id, kiekis, suma_ct = get_total su PVM centais, sav_ct = _ps_savikaina_vnt × kiekis centais). `dydis` — iš konteinerio `_ps_dydis`.
- Konteinerio lygmens eilutė → `parduota` su preke_id=0 (užsakymų/čekio skaičiavimui `kiekis` = 1 konteineris).
- Dovanos (`_ps_dovana`) → papildomai tipas='dovana'.
- Eilutės be savikainos → sav_ct=0 IR tipas='be_savikainos' +1. Jos NEĮEINA į maržą (ekranas maržą skaičiuoja tik iš eilučių su savikaina — atskirai sumuojamas `suma_ct_su_savikaina`; techniškai: `parduota` skaidoma dviem eilutėm rašyti nereikia — pakanka `be_savikainos` skaitliuko ir atskiros sumos: rašyti `parduota` KAip yra, o be savikainos eilutėms papildomai tipas='be_sav_suma' su suma_ct — kad ekranas galėtų atimti).
- DP pakai: eilutė su `_dp_pack_qty` → `parduota` (deze_id = pako produkto ID, preke_id = `_dp_base_product_id`, kiekis = eilutės qty × pack_qty) IR `dp_pakopa` (dydis='x'+pack_qty).
- **`atskirai`**: visų prekių, kurios YRA bent vieno aktyvaus rinkinio/pako komponentai (sąrašas iš MnM vaikų lentelės + `_dp_base_product_id`), pardavimai NE rinkinio kontekste (eilutės be `_mnm_container` ir be `_dp_pack_qty`) → tipas='atskirai' (preke_id, kiekis, suma_ct, sav_ct).
- **`nupirko`** (elgsenos piltuvėlio paskutinis žingsnis): jei užsakymas turi `_ps_stat_sesija` IR konteinerio eilutę → +1 į sritis='laukai', tipas='nupirko' (deze_id, dydis; `skirtukas` = tos sesijos PASKUTINIO `idejo` įvykio skirtukas, jei žali įvykiai dar yra; jei nebėra — skirtukas='').
- Grąžinimai: refund objektai, SUKURTI tą dieną → tipas='grazinta' su NEIGIAMOMIS reikšmėmis (grąžinimo dienos data).
- Parduotuvės viso: tos dienos VISŲ užsakymų suma → sritis='parduotuve', tipas='pajamos'.

### 5.5. Valymas — PAKEISTA TVARKA (kritinis fix)
Esamas `valyti()` TRINA >90 d. įvykius be agregavimo — tai duomenų praradimo klaida. Nauja tvarka: valymas vyksta TIK po sėkmingo agregavimo; trinami tik įvykiai, kurių diena JAU YRA suvestinėje (patikra prieš DELETE). Suvestinė — neribotai.

### 5.6. Realaus laiko sluoksnis
Ekranas = suvestinė (iki vakar) + ŠIANDIENOS žali duomenys, apskaičiuoti tomis pačiomis 5.2–5.4 taisyklėmis lekiant (šiandienos užsakymų nedaug — pilnas skenavimas leistinas TIK šiandienos dienai su `date_created >= today`). Viršuje dešinėje — „Duomenys atnaujinti prieš X min. · dienos suvestinė 03:15" (X — iš transient'o, šiandienos sluoksnį kešuoti transient'u 5 min.).

---

## 6. UI KARKASAS — `petshop-ataskaitos-ui.php` (NAUJAS mu-plugin)

Klasė `Petshop_Ataskaitu_UI`, TIK statiniai render/pagalbos metodai, jokios verslo logikos. Ekranai jai paduoda duomenis. CSS — vienas blokas, klasės su prefiksu `psru-`, stilius — TIKSLIAI kaip maketuose (spalvos: akcentas #2271b1, ok #00794b, bad #b32d2e, mut #787c82, linija #dcdcde; kortelės border-radius 6, WP admin šriftai).

Privalomi komponentai (API orientacinis, vykdytojas gali tikslinti parašus, bet ne elgesį):

1. `laikotarpis($slug)` — juosta: presetai (7 d. / 30 d. / Šis mėnuo / Praėjęs mėn. / Nuo pradžios) + `nuo`/`iki` date input + papildomi filtrai (perduodami masyvu: name, label, options). Būsena — GET parametruose (`nuo`, `iki`, `preset`, filtrų raktai) — nuorodą galima išsisaugoti. Grąžina `['nuo','iki','pries_nuo','pries_iki']` — ankstesnis laikotarpis = toks pat ilgis iškart prieš `nuo`. „Nuo pradžios" = nuo `ps_stat_pradzia` opcijos (esama), palyginimo nerodo.
2. `kpi($pavadinimas, $reiksme, $delta, $pries, $tooltip, $spark)` — kortelė su delta ženkleliu (▲ žalias / ▼ raudonas / — pilkas; procentiniams punktams rašyti „p.p."), „buvo X" ir neprivalomu SVG sparkline (polyline iš 9–15 taškų, jokių JS bibliotekų).
3. `diagrama($eilutes)` — SVG laiko eilučių diagrama kaip maketuose: pajamos (mėlyna), pelnas (žalia), ankstesnis laikotarpis (pilka punktyrinė), 3 horizontalios tinklelio linijos su € žymomis. Be bibliotekų.
4. `lentele($stulpeliai, $eilutes, $opts)` — rikiavimas paspaudus antraštę (klientinis JS, kaip maketuose, lietuviškas locale palyginimas), paieškos laukas, CSV eksportas (klientinis, BOM + `;` skyriklis), tooltip'ai antraštėse.
5. `veiksmu_blokas($tipas, $antraste, $irasai)` — raudona/žalia kairė juosta, sąrašas su nuoroda + „kodėl" tekstu dešinėje.
6. `tooltip($tekstas)` — ⓘ ženkliukas su CSS hover dymu.
7. `maza_imtis($reiksme, $imtis, $riba)` — jei imtis < riba, reikšmė pilka + ženkliukas „maža imtis".
8. `spejimas($html)` — geltona juosta (be savikainos ir pan.).
9. `piltuvelis($zingsniai)` — horizontalus su perėjimo % tarp žingsnių; silpniausias perėjimas automatiškai raudonas su žyme „silpna vieta".
10. `centai_i_eur($ct)` / `pvm` — pinigų formatavimas iš centų; PVM tarifas — opcija `ps_stat_pvm` (numatytoji 21, naudoti kaip 1 + tarifas/100, NE hardcode 1.21).

---

## 7. EKRANAS „SURENKAMI RINKINIAI" (perdaryti `petshop-rinkiniu-ataskaita.php` → v2.0)

Slug ir meniu vieta — kaip dabar (`petshop-reports-rinkiniai`, po PARENT). Sekcijos ir jų tvarka — TIKSLIAI kaip makete `ataskaitu_standartas_v2_maketas.html`:

1. **Laikotarpis** + filtras „Rinkinys" (dėžių sąrašas iš `_ps_laukas=yes`, kaip v1.1).
2. **KPI (5):** Pajamos su PVM · Pelnas · Marža · Užsakymai su dėže · Vid. čekis/dydis. Formulės: pajamos = Σ suma_ct (parduota, preke_id>0) + grazinta; pelnas = pajamos_su_sav_be_pvm − Σ sav_ct, kur pajamos_su_sav_be_pvm = (Σ suma_ct − Σ be_sav_suma) ÷ (1+PVM); marža = pelnas ÷ pajamos_su_sav_be_pvm; čekis = pajamos ÷ konteinerių sk.; deltas — prieš ankstesnį laikotarpį.
3. **Geltona juosta** jei be_savikainos > 0 (tekstas iš maketo).
4. **Tendencija** — diagrama pagal dieną.
5. **Ką daryti:** „Kandidatai išimti" — įdėjimo dalis < `ps_rib_isimti_dalis` (numatytoji 3 %) IR marža < `ps_rib_isimti_marza` (20 %), ARBA savikaina nežinoma. „Lyderiai" — dalis > `ps_rib_lyderis_dalis` (10 %) IR marža > `ps_rib_lyderis_marza` (25 %). „Kodėl" tekstas — kaip makete (rodyta · įdėta (dalis) · marža).
6. **Rinkiniai ir dydžiai** — lentelė rinkinys×dydis: atidarė (sesiju), konversija (nupirko_sesiju ÷ atidare_sesiju, žyma „iš sutikusių"), parduota, vid. dydis vnt., pajamos, pelnas, marža, skirtukų juostelės (įdėjimų pasiskirstymas pagal skirtuką, spalvos kaip makete).
7. **Prekės dėžėse** — lentelė: Prekė (nuoroda + #ID + „užsakymai (N) →" į `edit.php?post_type=shop_order&s=` paiešką arba ekvivalentą — vykdytojas randa veikiantį WC užsakymų filtravimo URL), Rodyta, Įdėta, Įdėjimo dalis, Parduota, Pajamos, Savikaina, Pelnas, Marža, Dalis apyvartoje (su mini juostele). Rikiavimo numatytasis — Parduota ↓. Elgsenos stulpeliai be duomenų — brūkšnys.
8. **Prekės analizė (drill-down)** — atsidaro paspaudus eilutę (JS accordion po eilute arba atskiras blokas su ?preke= parametru — vykdytojo pasirinkimas, maketas rodo turinį): mini KPI (įdėjimo dalis, išėmimo rodiklis = iseme_kiekis ÷ idejo_kiekis, išliko iki pirkimo = sesijos su šios prekės idejo IR nupirko ÷ sesijos su idejo — iš suvestinės aproksimuoti negalima tiksliai, todėl skaičiuoti kaip nupirktų dėžių su preke sk. ÷ idejo sesiju; pažymėti tooltip'e kaip aproksimaciją), marža; įdėjimai pagal skirtuką (juostelės); išėmimai pagal pilnumą (grupės 1–4 / 5–8 / 9–12+ iš kiek_dezeje — suvestinėje kiek_dezeje nėra dimensija, todėl išėmimų grupavimą pagal pilnumą agreguoti atskiru tipu: `iseme_p1`(1–4), `iseme_p2`(5–8), `iseme_p3`(9+) — cron'as skirsto pagal žalią kiek_dezeje).
9. **Piltuvėlis** — žingsniai: Atidarė → Prisidėjo bent vieną (idejo sesiju) → Pasiekė minimumą → Įsidėjo į krepšelį → Nupirko; perėjimų %; „Piltuvėlis pjūviais" lentelė pagal skirtuką (perjungiama į dydį/rinkinį GET parametru); žyma „iš sutikusių su statistika".
10. **Kelias dėžėje** — trys blokai: Kabliukai (tipas='kabliukas' top 3), Uždarytojos (tipas='uzdarytoja' top 3), Nupirktose dėžėse (dalis nupirktų konteinerių, kuriuose prekė yra — iš pardavimų suvestinės: dėžių su preke sk. ÷ visų konteinerių sk.).

Visi paaiškinamieji tekstai („Skaitosi taip…", tooltip formulės) — perkeliami iš maketo pažodžiui.

## 8. EKRANAS „RINKINIAI" (NAUJAS modulis `petshop-paruostu-ataskaita.php`)

Meniu: `add_submenu_page(PARENT, 'Rinkiniai', 'Rinkiniai', 'manage_woocommerce', 'petshop-reports-paruosti', ...)` — VIRŠ „Surenkami" punkto natūralia registracijos tvarka nesirūpinti, tvarką lemia priority. Sekcijos — TIKSLIAI kaip makete `rinkiniu_ataskaita_maketas.html`:

1. **Laikotarpis** + filtrai: Tipas (visi / MnM rinkiniai / DP pakai), Gyvūnas (iš rinkinių grupių — tas pats šaltinis kaip `petshop-rinkiniai.php` grupių juostoje).
2. **KPI (5):** Pajamos · Pelnas · Marža · Parduota rinkinių (su MnM/DP skaidymu „buvo" vietoje) · **Dalis parduotuvės apyvartoje** (rinkinių pajamos ÷ sritis='parduotuve' pajamos; delta p.p.).
3. Geltona be-savikainos juosta.
4. **Tendencija.**
5. **Ką daryti:** „Įtariama kanibalizacija — peržiūrėti" ir „Veikia — prideda pardavimų" pagal verdiktų taisykles (žr. 8.1).
6. **Rinkinių lentelė:** Rinkinys (MnM/DP žymė, komponentų sk. / bazinė prekė, užsakymų nuoroda), Parduota, Pajamos, Savikaina, Pelnas, Marža, **Nuolaida klientui** (Σ(_ps_kaina_atskirai − faktinė kaina) × vnt.; per vnt. skliaustuose), **Nuolaidos grąža** (žr. 8.1 — bendrų vienetų pokytis %), **Verdiktas** (PRIDEDA / PERKELIA / PER MAŽAI).
7. **Kanibalizacijos drill-down** (paspaudus eilutę): lentelė „komponentas rinkinyje / atskirai / iš viso" × „vnt. šis laikotarpis / ankstesnis / pokytis / pajamos / marža" + „Skaitosi taip" tekstas su siūlomu veiksmu (tekstų šablonai iš maketo; kelių komponentų rinkiniui — po lentelę kiekvienam komponentui arba suminė, vykdytojas daro SUMINĘ per visus komponentus + išskleidžiamas sąrašas po komponentą).
8. **DP pakopos:** kiekvienam DP produktui (filtruojasi per lentelę arba rodomi visi turintys pardavimų) — juostelės ×1/×2/×3 su vnt., % ir marža; ×1 duomenys = bazinės prekės pardavimai atskirai (tipas='atskirai' tai bazinei prekei). Mažos imties žymė.
9. **Nuolaidos efektyvumas:** rinkiniai grupuojami pagal nuolaidos gylį % (juostos: iki 5 / 5–10 / 10–15 / 15+; gylis = nuolaida ÷ kaina atskirai) → rinkinių sk., parduota, vid. parduota/rinkiniui, vid. marža, vid. nuolaidos grąža.

### 8.1. Kanibalizacijos algoritmas ir verdiktai
Kiekvienam rinkiniui/pakui: komponentų aibė K (MnM vaikai iš `wc_mnm_child_items`; DP — bazinė prekė).
- `vnt_rink` = Σ parduota kiekis (deze_id=šis, preke_id∈K) per laikotarpį; `vnt_atsk` = Σ atskirai kiekis (preke_id∈K).
- Tas pats ankstesniam laikotarpiui → `bendras_pokytis` = (vnt_rink+vnt_atsk) ÷ (pries_rink+pries_atsk) − 1.
- `marza_rink`, `marza_atsk` — svertinės iš atitinkamų suvestinės eilučių.
- **Verdiktai** (ribos — opcijos): PRIDEDA — bendras_pokytis > `ps_rib_prideda` (+10 %). PERKELIA — bendras_pokytis ≤ `ps_rib_perkelia` (+2 %) IR (marza_atsk − marza_rink) > `ps_rib_marzu_skirtumas` (5 p.p.). PER MAŽAI — parduota < `ps_rib_min_imtis_rink` (5) ARBA ankstesnio laikotarpio bendra imtis < 10. Kita — verdiktas tuščias (be ženkliuko).
- Nuolaidos grąža lentelėje = bendras_pokytis %.
- PRIVALOMA pastaba po taisyklėmis (iš maketo): verdiktas — heuristika, ne A/B įrodymas.

---

## 9. NUSTATYMAI (visos ribos — wp options, ne konstantos)

| Opcija | Numatytoji | Kur naudojama |
|---|---|---|
| `ps_stat_pradzia` | '' | YRA — statistikos pradžia |
| `ps_stat_pvm` | 21 | PVM tarifas % |
| `ps_rib_maza_imtis` | 30 | rodymų/atidarymų riba „maža imtis" žymei |
| `ps_rib_isimti_dalis` | 3 | % |
| `ps_rib_isimti_marza` | 20 | % |
| `ps_rib_lyderis_dalis` | 10 | % |
| `ps_rib_lyderis_marza` | 25 | % |
| `ps_rib_prideda` | 10 | % |
| `ps_rib_perkelia` | 2 | % |
| `ps_rib_marzu_skirtumas` | 5 | p.p. |
| `ps_rib_min_imtis_rink` | 5 | vnt. |

Nustatymų redagavimo UI šiame etape NEDAROMAS (keičiama per opcijas) — tik `ps_stat_pradzia` laukelis lieka kaip v1.1.

---

## 10. KAS SĄMONINGAI NEDAROMA (nekurti savo iniciatyva)

- Sankey / pilnas kelių žemėlapis, pakeitimų porų ekranas — įvykiai jiems jau tinkami, ekranai vėliau.
- Elgsenos įvykiai paruoštiems rinkiniams (sritis='rinkiniai' rezervuota, nerašoma).
- Asmeninis marketingas / segmentai — atskiras post-launch darbas, statistikos lentelės asmeniui aklos ir tokios lieka.
- Grafikos bibliotekos (Chart.js ir kt.) — TIK grynas SVG.
- Realaus laiko įvykių srautas ekrane, eksportas į Excel (CSV pakanka).

---

## 11. DIEGIMO ETAPAI, TVARKA IR DoD

**E1 — Schema ir meta (be UI).**
`petshop-statistika.php` → v2.0: dbDelta abi lentelės (schema 2), dviejų sluoksnių `ajax_ivykis()`, `_ps_stat_sesija` + `_ps_dydis` + `_ps_kaina_atskirai_vnt` rašymas checkout hook'uose. PRIEŠ kodą — recon: dydžio raktas krepšelio item'e (žr. 2.4). DoD: dry-run parodo ALTER planą; po apply — `DESCRIBE` abiejų lentelių per tiltą sutampa su 2.1/2.2; testinis užsakymas dev'e turi visus tris naujus meta (patikrinta per tiltą, ne teoriškai).

**E2 — Vitrinos įvykių rašymas.**
`petshop-laukai.php` JS papildymas: žodyno 3.1 tipai su 3.2–3.4 laukais, dviejų sluoksnių slapuko logika, paketinis siuntimas. DoD: Playwright run'as dev'e suvaidina kelią (atidarė → įdėjo 2 → išėmė 1 → dydis perjungtas → krepšelis) ir lentelėje matomi TEISINGI įrašai su teisingais kiek_dezeje/skirtukas/dydis (SELECT per tiltą, įrašai parodomi savininkui).

**E3 — Suvestinė, cron, valymo fix.**
Agregavimas 5.1–5.5 + šiandienos sluoksnio funkcija. DoD: rankinis cron paleidimas per tiltą; suvestinės eilutės sutampa su kontroliniu rankiniu skaičiavimu iš žalių įvykių ir užsakymo #34952 (arba naujo testinio); valymas atsisako trinti neagreguotos dienos.

**E4 — UI karkasas.** `petshop-ataskaitos-ui.php` pagal §6. DoD: bandomasis puslapis su visais komponentais, ekrano nuotrauka atitinka maketų stilių.

**E5 — Ekranas „Surenkami" v2.0.** §7. DoD: ekrano nuotrauka; kiekviena KPI sutampa su rankiniu kontroliniu skaičiavimu; tušti blokai rodo maketo tuščias būsenas.

**E6 — Ekranas „Rinkiniai".** §8. DoD: kaip E5 + kanibalizacijos drill-down patikrintas su dirbtiniu scenarijumi (dev'e sukurti 2 testiniai užsakymai: vienas su rinkiniu, vienas su komponentu atskirai — verdiktų logika suveikia teisingai).

Kiekvienas etapas — atskiras savininko patvirtinimas prieš kitą. Po kiekvieno etapo — deployment_log ir REGISTRAS atnaujinimas pilnais failais.

---

## 12. ŽINOMOS TECHNINĖS PAMOKOS (kad nekartotum mūsų klaidų)

- MnM vaikų ↔ konteinerio ryšys — per `_mnm_cart_key`/`_mnm_container` MAIŠĄ, ne per item ID.
- Code Snippets REST DELETE grąžina 500 ir NETRINA — tik `active:false`.
- PHP heredoc'e su JS template literals dingsta backslash'ai — JS į PHP kelti per base64.
- `method_exists()` WC Data Store wrapper'iams visada false — naudoti Reflection.
- Snippet POST grąžinęs „null" — kartoti.
- wp-admin ekranų klaidos (pvz. `esc is not defined`) matomos TIK prisijungus per Playwright su laikinu `wp_set_auth_cookie` snippet'u — deploy log'as jų nerodo.
- Taisymo skriptai failą rašo po KIEKVIENO pakeitimo, ne pabaigoje.
