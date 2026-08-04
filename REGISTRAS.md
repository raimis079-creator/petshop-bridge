# REGISTRAS.md — petshop.lt · VIENINTELIS BŪKLĖS ŠALTINIS

> **SKAITYTI PIRMĄ. VISADA.** Šis failas atsako į vienintelį klausimą:
> *kas padaryta, kas ne, kieno eilė.*
>
> `STATE.md` nuo šiol yra **ISTORIJA** (kaip padaryta, kokios pamokos, kokie SHA).
> Būklės iš STATE.md NEIMTI — ten sesijų naratyvas, kuris prieštarauja pats sau.
> Jei registras ir STATE.md nesutampa — **galioja REGISTRAS**.

**Atnaujinta:** 2026-08-03 (vakaras, po backup audito) · **Launch:** vidinis 2026-10-01 · sutartinis buferis 2026-10-15

---

## 0. SANTRAUKA

| Blokas | ✅ | 🟡 | 🔴 | ⏸ laukia Raimio |
|---|---|---|---|---|
| Launch DoD (22) | 6 | 6 | 8 | 2 nematuota |
| P0 funkcijos F1–F16 | 16 | 1 | 0 | Identity neįvertintas |
| MVP funkcijos (§4.3) | 5 | 0 | 1 | — |
| El. laiškų šablonai | 8 | 1 | 9 | — |
| M8 anketa (9 punktai) | 9 | 0 | 0 | tekstai |
| Pre-launch operacijos | 0 | 2 | 9 | — |

**Vienu sakiniu:** kodas beveik padarytas, testavimo/operacijų sluoksnis dalinai, ir
**TŽ auditas 2026-08-04 rado 9 blokus, kurių registre nebuvo (§11)** — tarp jų vienas P0.

---

## 1. TAISYKLĖS (kaip šis failas gyvena)

1. **Būseną keičia TIK įrodymas su data.** „Mechanizmas egzistuoja" ≠ „sistema tai daro".
   Prieš žymint ✅ atsakyti: kas paleidžia · ar kelias pasiekiamas · kas jei neįvyksta · ar rezultatas patvirtintas.
2. **Kiekviena nauja rasta spraga rašoma ČIA** tą pačią sesiją, ne tik sesijos pasakojime.
3. **Sesijos pabaigoje Claude atnaujina TIK šį failą** (pilnu perrašymu) + prideda istorijos bloką į STATE.md.
4. **ID nekeičiami niekada.** Užbaigtas darbas lieka lentelėje su ✅ ir data — netrinamas.
6. **JOKIU MOKAMU PLUGINU, PASLAUGU AR PRENUMERATU BE RAIMIO ZINIOS.** Tai 100%
   jo sprendimas. Konsultanto rekomendacija, kad ir kaip detali — **pasiulymas, ne
   nurodymas**. Pries diegiant bet ka, kas kainuoja arba isveza duomenis pas isorini
   tiekeja, Claude klausia patvirtinimo tiesiogiai. (Kilme: 2026-08-03 idiegtas
   WP Umbrella pagal perduota konsultanto teksta — Raimis apie tai nezinojo.
   Pasalintas ta pacia diena, `s368.json`.)
7. **Vienas langas — vienas tiltas.** Prieš `dispatch` patikrinti, ar `screenshot.mjs` HEAD commit yra mano paskutinis PUT. Jei ne — STOP.

---

## 2. LAUNCH DoD (TŽ §19.1) — 22 punktai

| ID | Kriterijus | Būsena | Data | Įrodymas / kas trūksta |
|---|---|---|---|---|
| DOD-01 | P0 funkcijos F1–F16 100% | 🟡 | 2026-08-04 | F4 ✅ F14 ✅, BET **Identity/Google login (TŽ v1.45 P0) NEĮVERTINTAS** — §11 G1 |
| DOD-02 | Kritinių klaidų 0 | ⚪ | — | **nėra bug registro** — nematuojama |
| P1-MYISAM | MyISAM → InnoDB migracija | 🔴 | 2026-08-03 | 160/174 lentelių MyISAM = 98% duomenų. Architektūros skola, ne tik backup (§8c) |
| DOD-03 | Aukšto prioriteto klaidų ≤3 | ⚪ | — | tas pats |
| DOD-04 | 20 testinių užsakymų | 🔴 | 2026-08-03 | DB: 2. Automatinis mobilus kelias veikia (S374) — galima kartoti scenarijų su skirtingais metodais |
| DOD-05 | 2 stabilūs pristatymo būdai | ✅ | 2026-06-01 | Venipak + LP Express live |
| DOD-06 | Paysera + bankinis | ✅ | 2026-06-01 | — |
| DOD-07 | Top-100 SEO 301 | 🔴 | 2026-07-30 | 44 URL = 404, 20,5% srauto |
| DOD-08 | Backup restore testas | ✅ | 2026-08-04 | Pilna grandinė įrodyta: skriptas (§8f) · cron 0 4 * * * · gedimo pranešimai · **atstatymo testas 174/174 (§8g)**. Apribojimas: rtst_ prefiksas, ne švari DB |
| DOD-09 | XML sync 7 d. be klaidų | 🟡 | 2026-08-02 | importai suka; 7 d. serija nefiksuota |
| DOD-10 | Kainodara testuota 20 produktų | 🟡 | 2026-07-30 | recon darytas, formalaus testo nėra |
| DOD-11 | Manual override 5 produktais | 🟡 | 2026-08-03 | 2 iš 5 (14824, 33249 per R5) |
| DOD-12 | Savininkas apdoroja užsakymą be programuotojo | 🟡 | — | neformalizuota |
| DOD-13 | Post-launch monitoringas | 🔴 | 2026-08-03 | 0 monitoringo. Atskirti nuo backup: uptime (išorinis, be plugino) + PHP klaidų sekimas — DU dalykai |
| DOD-14 | Mail-Tester ≥8/10 | ✅ | 2026-07-30 | 8,5/10 |
| DOD-15 | GDPR atitiktis | ✅ | 2026-07-10 | Complianz v7.5.0 + 8 legal psl. |
| DOD-16 | VMI sąskaitos su realia transakcija | ✅ | 2026-06 | AVPN/IAPV testuota |
| DOD-17 | Beta testas 5–10 klientų | 🔴 | — | nepradėta |
| DOD-18 | DNS planas + sena platforma read-only | 🔴 | — | nepradėta |
| DOD-19 | Rollback planas | 🔴 | — | nepradėta |
| DOD-20 | Savaitinis stabilumas ≥99% | 🔴 | — | 7 d. staging monitoringas |
| DOD-21 | GSC auditas + top-100 301 lentelė | 🟡 ~70% | 2026-07-30 | eksportas yra, mapping juodraštis ne |
| DOD-22 | „Discourage search engines" išjungti | 🔴 | — | pre-launch, viena varnelė |

---

## 3. FUNKCIJOS

### P0 (F1–F16)
| ID | Funkcija | Būsena | Data | Pastaba |
|---|---|---|---|---|
| F4 | Paieška + SKU/EAN | ✅ | 2026-08-03 | Tikslus atitikmuo (NE euristika pagal ilgį): Woo SKU + global_unique_id lookup + legacy `_ean`/`_vf_barcode`/`_zb_ean`. Vienas produktas → 302; keli → sąrašas + dublikatų žurnalas; be atitikmens tekstinė paieška nepaliesta |
| F14 | Mobile checkout | ✅ | 2026-08-03 | Playwright 390×844 iPhone UA, pilnas svečio kelias iki užsakymo 34793 (bacs). 10/10 + hScroll 0/11, uždengtų CTA 0, 1 POST, sumos sutampa, paštomatas išlieka. `s374.json` |
| — | F1–F3, F5–F13, F15, F16 | ✅ | — | — |
| F-PSR | Paysera pilnas mokėjimo ciklas (redirect → callback → `processing`) | 🔴 | 2026-08-03 | **NETESTUOTA.** Konfigūracija nebaigta, nėra patvirtinimo iš Paysera (Q-PSR2). NE F14 dalis — F14 uždarytas per `bacs`. Projektas 29276 |

### MVP (TŽ §4.3)
| ID | Funkcija | Būsena | Data | Pastaba |
|---|---|---|---|---|
| F17 | XML 2-as tiekėjas | ✅ | — | VF 1077 prekės |
| F18 | Kaina24 / kainos.lt | ✅ | — | URL resubmit po migracijos |
| F19 | **Ribota prenumerata** | 🔴 | — | **NEPRADĖTA. Didžiausias likęs kodo blokas.** Blokuoja Q10 + Q6 + Paysera Recurring |
| F20 | Basic Pet Profile | ✅✅ | 2026-08-03 | M8 gerokai viršyta |
| F21 | Basic email automation | ✅ 3/3 | 2026-08-02 | cart_abandoned · post_purchase · refill |
| F30b | Atsiliepimai | ✅ | 2026-08-04 | Patikrinta gyvai: reviews=yes · verified buyers only=yes · rating=yes |

---

## 4. M8 ANKETA — UŽDARYTA 9/9

| # | Darbas | Būsena | Įrodymas |
|---|---|---|---|
| 1 | `create_pet_result()` atskyrimas | ✅ | 6/6 paritetas su baseline |
| 2 | UNIQUE(client_ref) + duplicate-key recovery | ✅ | 8/8 su lenktynių simuliacija |
| 3 | POST /pet-draft | ✅ | 31/31 |
| 4 | magic-login priima draft_id | ✅ | 10/10 |
| 5 | Claim grandinė + state cleanup | ✅ | 17/17 |
| 6 | pet-form.js serverinis draftas | ✅ | S1 realiu keliu ant SHA `4bf522cc` |
| 7 | Cron cleanup + stale claim recovery | ✅ | 10/10 |
| 8 | E2E dviem įrenginiais + neigiami keliai | ✅ | E0-A/E0-B/paritetas/N1/N2/N3/N4 — `s352.json`, `s353.json` |
| 9 | duplicate_candidate ekranas | ✅ | D1/D2 naršyklėje — `s360.json` |
| 9b | **Tekstai: landing peržiūra + „14 dienų"** | ⏸ | **RAIMIO** |

---

## 5. EL. LAIŠKŲ SLUOKSNIS

**Principas (TŽ v1.60, užrakinta):** šablonai gyvena `petshop-core/templates/emails/`, Sender = tik transportas. Sender workflow'ai nenaudojami.

Transportas ✅: adapteris `Petshop_Sender_Adapter` v0.4.0, `is_configured=true`, DKIM/SPF/Reply-To įrodyti, Mail-Tester 8,5/10.

| Šablonas | Būsena | Prioritetas |
|---|---|---|
| order-paid · refill · cart-abandoned-1 · cart-abandoned-2 · post-purchase-2d | ✅ 5 | — |
| **consent-changed · dunning-1 · founding** | ✅ 3 · 2026-08-04 | §8i |
| payment_failed → dunning-1 | 🟡 | Šablonas ✅, BET `payment_failed` ĮVYKIO DB NĖRA VISAI — niekas jo neiškviečia (§8i) |
| founding_activation → founding | ✅ | Šablonas veikia; laukia rugpjūčio waitlist arkos |
| consent_changed | ✅ | Šablonas veikia, grandinė įrodyta WOULD_SEND (§8i) |
| shipment_returned · pet_reminder_due · subscription_t5_notice | 🔴 | subscription_t5 priklauso nuo F19 |
| post_purchase_7d · post_purchase_14d | 🔴 | po launch |
| win_back_60/90/120 · legacy_reactivation_l1 | 🔴 | po launch |
| order_shipped | ⚪ sąmoningai | siunčia WooCommerce |

**Naujienlaiškis:** ✅ PADARYTA 2026-08-04 — poraštės forma + launch modalas (§8j). Vokelio ikona SĄMONINGAI negrąžinta.

**Sender skola:** tracking CNAME. Nuorodos eina per bendrą `campaign-statistics.com`. Hostname **kopijuoti iš Sender nustatymų**, ne iš užrašų (mūsų įrašas: `link.petshop.lt`).

---

## 6. AUDITO RADINIAI (2026-08-02)

| ID | Radinys | Būsena | Pastaba |
|---|---|---|---|
| R1 | F4 SKU/EAN paieška | ✅ 2026-08-03 | `mu-plugins/petshop-code-search.php` v1.0, sha e141c4ae. Matrica 13/13, `s366.json` |
| R2 | 1518 / 2764 publish prekių be EAN (55%) | ⏸ | **iš kur imti — Raimio sprendimas** |
| R3 | Backup pluginas neįdiegtas | ✅ 2026-08-04 | Pluginas NEREIKALINGAS. Savas skriptas + B2 + atstatymo testas (§8f, §8g) |
| R4 | Monitoringo nėra | 🔴 | = DOD-13 |
| R5 | 5 publish prekės be kainos | ✅ 2026-08-03 | 2 kainos pagal medianą (16,49 / 18,99, `_manual_price_override`), 3 į draft. publish be kainos 5→0. `s364.json` |
| R6 | F19 prenumerata nepradėta | 🔴 | = F19 |
| R7 | 1022 draft prekės | ⏸ | publish / trinti / palikti — Raimio |

---

## 7. SEO MIGRACIJA

Padaryta ~70–80%: GSC eksportas (2445 URL), top-100 auditas, redirect probe, 33/36 blog straipsnių, 2 veikiantys 301 snippetai.

**Rizika:** top-100 dengia 79,2% srauto. Prieš dev: 56 URL = 200, **44 URL = 404 → 20,5% viso srauto neuždengta.**

Trys tipai: (1) kategorijos, kurių dev'e nėra — **ar jos apskritai bus, Raimio sprendimas**; (2) seni kategorijų URL su ID uodegomis — grynas 301; (3) prekės — EAN/SKU match.

Trūksta 3 blog straipsnių. Galutinis 301 failas generuojamas T-14/T-3, kai katalogas užšaldytas. **Nepradėti be Raimio.**

---

## 8. PRE-LAUNCH OPERACIJOS

| ID | Operacija | Būsena |
|---|---|---|
| OPS-01 | Site URL/Home → `https://petshop.lt` (**būtinai https**) | 🔴 |
| OPS-02 | **12 cron užduočių** serveriai.lt — patikslinta 2026-08-04 (žr. §8e) | 🔴 |
| OPS-03 | `woocommerce_email_header_image` · `wcdn_settings` · `cmplz_preloaded_privacy_info` | 🔴 |
| OPS-04 | AVPN/IAPV serijos reset į 101 | 🔴 |
| OPS-05 | Testinių užsakymų trynimas | 🔴 |
| OPS-06 | Feed URL resubmit (Kaina24, Kainos.lt) | 🔴 |
| OPS-07 | „Discourage search engines" išjungti | 🔴 (= DOD-22) |
| OPS-08 | Sender tracking CNAME | 🟡 |
| OPS-09 | Complianz Website Scan + slapukų sąrašas · enhanced conversions | 🟡 |
| OPS-10 | Flatsome social nuorodos (dabar placeholder'iai `http://url`) | 🔴 laukia Raimio nuorodų |
| OPS-11 | TEMP snippetų trynimas WP admin (REST DELETE neveikia) | 🔴 higiena: 2136–2139, 2141–2160 |
| OPS-12 | `gaj6_umbrella_redirects` lentelė — liko po WP Umbrella šalinimo; **netrinta automatiškai**, patikrinti kilmę | 🔴 |

**DNS valdomas iv.lt**, ne serveriai.lt.

---

## 8b. BACKUP FAKTINĖ BŪKLĖ (išmatuota 2026-08-03, NE prielaidos)

> **KLAIDA, KURIĄ REIKĖJO IŠTAISYTI:** iki 2026-08-03 registre ir pokalbiuose buvo
> teigiama „0 backup pluginų / jokių kopijų nėra". **Netiesa.** Installatron kas
> kelias dienas daro pilnas kopijas — niekas apie tai nežinojo, nes jos nematomos
> DirectAdmin backup ekrane. Prieš teigiant „nėra" — PAMATUOTI.

### Kas realiai yra
```
/home/gyvunai2/application_backups/          34 216 MB · katalogas RAŠOMAS
  app_dev-avesa-lt_Petshop-NEW_2026-08-03_05-22-45.tar.gz   8 180 MB  (02:31)
  app_dev-avesa-lt_Petshop-NEW_2026-07-30_17-22-13.tar.gz   8 174 MB
  app_dev-avesa-lt_Petshop-NEW_2026-07-24_23-23-20.tar.gz   8 173 MB
  app_dev-avesa-lt_Petshop-NEW_2026-07-22_05-22-07.tar.gz   8 172 MB
  app_sushimo-lt_Sushi-Mo_ ×3                                 505 MB kiekviena
```
Archyvo turinys patikrintas neišpakuojant (`s378.json`, 233 631 įrašų):
```
APP-DATA.SQL     121,4 MB   ← DUOMENŲ BAZĖ VIDUJE
wp-content     8 795,0 MB   161 845 failų
wp-includes       49,6 MB · wp-admin 8,9 MB · wp-config.php · .htaccess
```
**Kopija pilna** — failai + DB + konfigūracija.

### Trys spragos (kodėl DOD-08 dar ne žalias)
```
1. LAIKYMO VIETA  tame pačiame serveryje -> serverio praradimas = kopijų praradimas
2. DAŽNUMAS       kas 2-6 dienos (07-22, 07-24, 07-30, 08-03). Parduotuvei per reta
3. NETESTUOTA     atstatymas niekada nebandytas -> vis dar prielaida, ne įrodymas
```

### Įrodyta rizika, ne teorinė
2026-08-03 archyve `mu-plugins` yra 4 failai, serveryje — 6. Trūksta
`petshop-pet-claim.php` (dublikato ekranas) ir `petshop-code-search.php` (F4),
nes abu sukurti PO 02:31 kopijos. Atstačius iš jos dingtų abu — 12 KB iš 8 GB,
niekas nepastebėtų. **mu-plugins turi būti atskiras punktas kiekviename
atstatymo teste.**

### DB eksportas — išmatuota
```
174 lentelės · 492 225 eilutės
neuspausta 146,5 MB -> suspausta 13,96 MB (10,5:1)
trukmė 18,4 s · atminties pikas 116 MB (riba 256 MB)
```
Grynu PHP, be `mysqldump`. 30 dienų kopijų ≈ 420 MB.

### Hostingo ribos
```
SSH                IŠJUNGTAS (patvirtinta serveriai.lt) -> restic/rclone atkrenta
DirectAdmin cron   tik URL arba PHP skriptas per /usr/local/bin/phpXX-cli
                   -> shell komandų NĖRA, BET PHP skriptas gali viską, ko reikia
open_basedir       /home/gyvunai2/:/tmp:/usr/share/pear
serveriai.lt       serverio lygmens kopijos NĖRA garantuotas atkūrimo šaltinis
                   (jų pačių formuluotė, klausta 2026-08-03)
```

### Vietos paskirstymas (65 GB mįslė išspręsta)
```
application_backups  34 216 MB  ← DĖL JŲ viršyta 10 GB riba pilnoms DA kopijoms
imap                 16 015 MB
domains              13 130 MB   avesa.lt 8 863 · gyvunai.lt 3 574 ·
                                 sushimo.lt 675 · petshop.lt 17
public_html           3 559 MB
disko laisva            312 GB
```
**petshop.lt katalogas tik 17 MB** — tikroji parduotuvė gyvena po `avesa.lt`.
Svarbu prieš domeno perjungimą.

### Neišspręsta techninė detalė
Išeinantis HTTPS iš serverio **NEPATIKRINTAS**. Bandymas (`s376`) pakabino
svetainę 134 s ir bridge negavo atsakymo. Gali reikšti, kad išeinantys
jungimai filtruojami ir „kabo" vietoj atmetimo. **Kartoti atsargiai:** po vieną
kryptį, 5 s riba, atskirai nuo visko kito. Jei kabo — bet kuris į debesį
siunčiantis sprendimas elgtųsi taip pat, ir tai paveiktų gyvą parduotuvę.

### Kiti žingsniai (nė vienas nereikalauja pirkinio)
```
1. Installatron grafikas — koks dažnumas, ar galima padidinti be mokesčio
2. Išeinantis HTTPS — atsargus pakartotinis testas
3. Atstatymo testas — DB + failo žymekliai, mu-plugins atskirai
4. DB eksportas už serverio ribų — lieka tik Q-BKP (kur laikyti)
```

---

## 8c. DB BACKUP — UŽRAKINTAS SPRENDIMAS (2026-08-03)

> **STATUSAS: PASIRINKTAS SPRENDIMAS, NE UŽBAIGTAS BACKUPAS.**
> Žalias tampa TIK po atstatymo testo (kriterijai apačioje).

### Saugykla
```
Backblaze B2 EU Central (Amsterdamas) · privatus bucketas · pirmi 10 GB nemokami
Kasdienis serverio raktas: TIK tas bucketas · TIK petshop-backups/ prefiksas
                           writeFiles · BE readFiles · BE deleteFiles
Atstatymo raktas: read-only, serveryje NELAIKOMAS, tik slaptažodžių tvarkyklėje
Master key serveryje NIEKADA
Retencija: B2 Lifecycle Rule ~30 d. pagal prefiksą (datuoti vardai, ne versijos)
           SKRIPTAS KOPIJŲ NETRINA — apsauga nuo ransomware
```
Vientisumas tikrinamas per B2 Native API: įkeliant pateikiamas SHA-1, atsakyme
grąžinamas `contentLength` + `contentSha1` — patvirtinama BE skaitymo teisės.

### Šifravimas
```
Šifruojama PRIEŠ įkeliant (ne tik gzip)
Raktų failas: /home/gyvunai2/... UŽ public_html, chmod 600
ANTRA rakto kopija PRIVALOMA kitoje vietoje (slaptažodžių tvarkyklė) —
  vienintelė kopija tame pačiame hostinge padarytų B2 kopijas NEATKURIAMAS
Raktai NIEKADA nerodomi pokalbyje
```

### Apimtis
```
ĮTRAUKTI: visa DB (174 lentelės) + mu-plugins (156 KB)
          + petshop-core (6 908 KB) + flatsome-child (737 KB)
NEĮTRAUKTI: uploads · Flatsome pagrindinė tema · trečiųjų šalių pluginai
            · raktų failas
```
Pirmoje versijoje NIEKO nepraleidžiama (nei `shortpixel_queue`, nei
`actionscheduler_logs`) — optimizacija tik PO veikiančio restore testo.

### DB nuoseklumas — GLOBALUS UŽRAKTAS ATMESTAS
```
IŠMATUOTA (s381): LOCK TABLES READ visoms 174 lentelėms SUSTABDĖ svetainę.
  Užklausa negrįžo per 45 s; lygiagreti patikra grąžino 000 (jokio atsakymo).
  Priežastis: READ užraktas MyISAM blokuoja rašymus, o WP rašo beveik
  kiekvienoje užklausoje (sesijos, transientai, options).
  Svetainė po testo sveika: / 200 · /parduotuve/ 200 · /cart/ 200 · REST 200.

KLAIDA, KURIĄ REIKIA ŽINOTI: teiginys „sustos ~18 s" BUVO NEPAGRĮSTAS —
  18 s buvo NEUŽRAKINTO eksporto trukmė. Kiek truktų laukimas užraktų —
  NEIŠMATUOTA. Neteigti to, kas nepamatuota.
```
**v1 metodas:**
```
InnoDB (14 lentelių, 3,2 MB)   → viena REPEATABLE READ consistent snapshot
MyISAM (160 lentelių, 131,9 MB) → lentelė po lentelės, srautiniu SELECT,
                                  BE globalaus explicit LOCK TABLES
Kopija žymima: consistency = mixed_engine_best_effort
               NE „transakcinis snapshot" — mišrioje DB tai netiesa
```
`READ LOCAL` netinka: leidžia lygiagrečius INSERT į MyISAM, bet neatlaisvina
UPDATE/DELETE, kurių WP naudoja daug.

### Koduotė
```
DB numatytoji latin1 / latin1_swedish_ci, BET lentelės utf8mb4 (172 iš 174
  utf8mb4_unicode_520_ci, 2 utf8mb4_general_ci)
Eksporto jungtis: mysqli_set_charset(...,'utf8mb4') + patikrinti
  @@character_set_client/connection/results
Dump antraštėje: SET NAMES utf8mb4
Atkuriant: jungtis taip pat utf8mb4; tikrinti lietuviškas raides, emoji
  ir PHP serialized reikšmes
```

### Manifestas prie KIEKVIENOS kopijos
```
consistency: mixed_engine_best_effort · export_started_at · export_finished_at
lentelių sąrašas su ENGINE · eilučių skaičiai · eksporto klaidos
kodo failų SHA-256
```
Jei bent viena lentelė neperskaitoma arba eksportas nutrūksta — archyvas
NEŽYMIMAS sėkmingu ir „backup OK" pranešimas NESIUNČIAMAS.

### Žalias TIK po
```
tikro įkėlimo į B2 · hash ir dydžio patvirtinimo
gedimo pranešimo testo IR „cron visai nepasileido" perspėjimo testo
atstatymo į VISIŠKAI ŠVARIĄ DB (ne ant esamos)
schemų + 174 lentelių eilučių skaičių palyginimo
kritinių lentelių kontrolinių sumų (ps_pets, ps_feeding_rows, wc_orders, postmeta)
custom kodo failų SHA-256 palyginimo
```

### Techninė aplinka (išmatuota, ne prielaidos)
```
cURL 8.5.0 · OpenSSL 1.0.2k-fips · allow_url_fopen=1
gzopen · gzencode · curl_init · mysqli_connect · fsockopen — VISI yra
disable_functions: link, symlink, exec, passthru, proc_*, shell_exec, system, popen
WP_HTTP_BLOCK_EXTERNAL neapibrėžta
Išeinantis HTTPS VEIKIA (s379): github · b2api · wasabi · google · sender · wporg
  visi DNS OK, TCP:443 OK, TLS OK. Ankstesnis 134 s kabėjimas — laikinas epizodas.
Rašomos vietos už public_html: /home/gyvunai2 · /backups · /tmp — visos rašomos
DB eksportas PHP: 146,5 MB → 13,96 MB (10,5:1), 18,4 s, atmintis 116/256 MB
NEPATIKRINTA: LOCK TABLES teisė (SHOW GRANTS neįvykdytas — testas nutrūko)
```

### ATVIRAS P1 PRIEŠ LAUNCH — MyISAM → InnoDB
```
160 iš 174 lentelių yra MyISAM = 98% duomenų (131,9 iš 135 MB).
Tai ne tik backup, o visos parduotuvės architektūros skola: MyISAM turi
lentelės lygio užraktus, InnoDB — eilutės lygio + transakcijas.
Darbo eiga: (1) inventorizuoti indeksus, FULLTEXT, pluginų priklausomybes;
(2) konvertuoti klone; (3) pilna funkcinė + našumo regresija;
(4) tik tada dev/produkcija per priežiūros langą.
Po konversijos visas DB backupas taps nuosekliu InnoDB snapshotu BE svetainės
stabdymo.
```

---

## 8d. B2 INFRASTRUKTŪRA — PASTATYTA IR ĮRODYTA (2026-08-03 vakaras)

### Kas veikia (visi punktai patikrinti realiais veiksmais, ne nustatymų skaitymu)
```
Bucket        petshop-backups · allPrivate · ID 0e02b37ebe34cc9a95f40918
              Object Lock ĮJUNGTAS, Default Retention 14 d. (NEGRĮŽTAMA)
Raktas        petshop-backup-write · tik šis bucketas · prefiksas petshop-backups/
Kredencialai  /home/gyvunai2/backups/.b2creds.php · 391 B · chmod 0600
              už public_html; reikšmės base64; laukai: keyId, appKey, bucketId,
              bucket, prefix, encKey (44 simb. = 32 baitai), created
Šifr. raktas  sugeneruotas serveryje; ANTRA KOPIJA pas Raimį (patvirtinta)
```

### Įrodymų matrica (s388 → s389)
```
                        PRIEŠ Object Lock      PO Object Lock
autorizacija            200                    200
įkėlimas                200, SHA-1 + dydis ok  200, SHA-1 + dydis ok
raktas SKAITO           401 unauthorized       401 unauthorized
raktas TRINA            200 — IŠTRYNĖ ❌       401 access_denied ✅
```
**Radinys:** Backblaze „Write Only" sąsajoje reiškia „rašyti IR trinti" —
rakto galiose `deleteFiles` yra ir Backblaze jo neatima. Apsauga veikia
BUCKET'O, ne rakto lygiu. Ekrano užrašas „Write Only" NĖRA įrodymas —
tik realus bandymas ištrinti.

### Techninė aplinka (s379, s375, s380)
```
Išeinantis HTTPS VEIKIA: github · b2api · wasabi · google · sender · wporg
  visi DNS OK, TCP:443 OK, TLS OK
cURL 8.5.0 · OpenSSL 1.0.2k-fips · allow_url_fopen=1
disable_functions: exec, shell_exec, proc_*, system, popen (mysqldump NEĮMANOMAS)
gzopen · gzencode · curl_init · mysqli_connect · fsockopen — VISI yra
DB eksportas PHP: 146,5 MB → 13,96 MB (10,5:1), 18,4 s, atmintis 116/256 MB
Rašomos vietos už public_html: /home/gyvunai2 · /backups · /tmp
```

### LIKĘ ŽINGSNIAI (rytojui)
```
1. ✅ Lifecycle Rule — hide 30 d., delete 1 d. (patvirtinta per API, s390)
2. ✅ Eksporto skriptas ps-backup.php v1.1 — veikia (žr. §8f)
3. ✅ Cron 0 4 * * * per URL (CLI šiame hostinge NEPRIEINAMAS, žr. §8f)
4. ✅ Gedimo testai — sugadinus appKey: HTTP 401, būsena FAIL, laikinų 0,
      laiškas ATĖJO į terra@gyvunai.lt (Gautuosius, ne šlamštą), grąžinus veikia
5. ✅ ATSTATYMO TESTAS — praėjo (§8g)
6. ✅ „cron nepasileido" sargas — ps-backup-watch.php v1.0 (§8h)
```

### Ko NEDARYTI
```
NEKEISTI Object Lock — įjungus išjungti NEBEĮMANOMA
NEDUOTI skriptui trynimo logikos — retenciją tvarko TIK Lifecycle
NERODYTI raktų pokalbyje — nei B2, nei šifravimo
```

---

## 8e. CRON UŽDUOTYS — PILNAS SĄRAŠAS (patikrinta ekrane 2026-08-04)

**PRIEŠ MIGRACIJĄ Į petshop.lt VISUOSE ŠIUOSE KEISTI DOMENĄ.**
Registre anksčiau buvo rašoma „6 cron užduotys" — **netiesa, jų 11.**

```
min    val   komanda (visos per cronurl 'http://dev.avesa.lt/...')
────────────────────────────────────────────────────────────────────
0      *     wp-load.php?import_key=v&import_id=3&action=trigger
2      *     wp-load.php?import_key=v&import_id=3&action=processing
0      6     wp-load.php?import_key=v&import_id=2&action=trigger
1      6     wp-load.php?import_key=v&import_id=2&action=processing
0      18    wp-load.php?import_key=v&import_id=2&action=trigger
1      18    wp-load.php?import_key=v&import_id=2&action=processing
15     *     wp-load.php?import_key=v&import_id=7&action=trigger
16-59/2 *    wp-load.php?import_key=v&import_id=7&action=processing
30     6     wp-load.php?import_key=v&import_id=5&action=trigger
31-59/2 6    wp-load.php?import_key=v&import_id=5&action=processing
0      4     backup-run.php?ps_backup_key=...        ← NAUJA 2026-08-04
0      10    watch-run.php?ps_watch_key=...          ← NAUJA 2026-08-04 (sargas)
```
**IŠ VISO 12 užduočių.** Keičiasi TIK domenas. `import_key=v`, `import_id`,
`ps_backup_key` ir `ps_watch_key` lieka tie patys.
Import #2 sukasi DUKART per parą (6:00 ir 18:00) — anksčiau registre neužfiksuota.
Import #7 ir #5 irgi aktyvūs.

---

## 8f. BACKUP SKRIPTAS — VEIKIA (2026-08-04)

```
Skriptas   /home/gyvunai2/backups/ps-backup.php  v1.1 · 19 239 B · chmod 0700
Paleidiklis .../public_html/dev/backup-run.php · 200 B (tik require)
Cron        0 4 * * *  http://dev.avesa.lt/backup-run.php?ps_backup_key=...
Būsena      /home/gyvunai2/backups/.ps-backup-state.json (last_result, last_run)
```

**SVARBU: CLI ŠIAME HOSTINGE NEPRIEINAMAS.** DirectAdmin periodinės užduotys
turi TIK URL lauką — jokio „PHP 8.4" pasirinkimo (patikrinta ekrane 2026-08-04;
serveriai.lt dokumentacijos pavyzdys su php84-cli mūsų paskyrai NEGALIOJA).
Todėl paleidimas per HTTP su slaptu raktu, kaip ir visi esami importai.

**Apsauga:** `hash_equals` rakto palyginimui · `ignore_user_abort(true)` kad
cron nutraukęs ryšį neužmuštų proceso · logika už public_html, viešame
kataloge tik `require`.
```
be rakto           403 ✅
su blogu raktu     403 ✅
su teisingu raktu  veikia ✅
```

**Realūs paleidimai (3 iš 3 sėkmingi):**
```
06:38 (bridge)  174 lentelės · 488 781 eil. · 17,63 MB · 6,6 s
06:51 (Raimis naršyklėje) 174 · 488 817 eil. · 17,64 MB · 7,7 s
      InnoDB 14 consistent snapshot · MyISAM 160 be globalaus LOCK
      tar 22,15 MB → gzip 17,64 MB → AES-256-CBC + HMAC-SHA256
      SHA-1 ir dydis patvirtinti B2 pusėje
Atmintis 135 / 256 MB · laikinų failų liko 0
```

**Įrodyta 2026-08-04:** gedimo pranešimas ✅ (laiškas atėjo su tikslia
priežastimi ir pilnu žurnalu) · atstatymas ✅ (§8g).
**Liko:** „cron visai nepasileido" perspėjimas.

---

## 8g. ATSTATYMO TESTAS — PRAĖJO (2026-08-04) → DOD-08 ✅

```
1. PARSISIUNTIMAS iš B2 (read-only raktas, 13 skaitymo teisių, deleteFiles NĖRA)
   18 498 806 B · dydis SUTAMPA · SHA-1 SUTAMPA
2. HMAC-SHA256 SUTAMPA → archyvas nepakeistas nė vienu baitu
3. Dešifruota 17,64 MB → tar 22,15 MB → database.sql.gz + manifest.json
4. ATSTATYMAS: 488 996 SQL sakinių, 92,3 s, 0 klaidų
5. PALYGINIMAS su manifestu:
   lentelių 174/174 · eilučių sutampa 174/174 · neatstatytų 0 · skirtumų 0
   ps_pets 69=69 · ps_feeding_rows 5 549=5 549 · wc_orders 2=2
   postmeta 178 403=178 403 · posts 12 638=12 638
   lietuviškos raidės IŠLIKO (ū, ė, ų) · serialized unserialize OK
   koduotė utf8mb4_unicode_520_ci · variklis MyISAM (kaip originale)
6. VALYMAS: 174 rtst_ lentelės ištrintos · rtst_ liko 0 · gaj6_ liko 174
   gaj6_hash 1ecdb5612701e0c6 PRIEŠ = PO → originalas NEPALIESTAS
   ištrinti: .restore-test.* · .restore-manifest.json · .b2restore.php
```

**APRIBOJIMAS, KURĮ BŪTINA ŽINOTI:** atstatyta į TĄ PAČIĄ DB su `rtst_` prefiksu,
NE į visiškai švarią DB. Priežastis: WP vartotojas `gyvunai2_nbpe1` turi
`GRANT ALL PRIVILEGES ON gyvunai2_nbpe1.*` — naujų DB kurti NEGALI
(`Access denied to database 'gyvunai2_rtest'`). DirectAdmin bazę turi kurti
Raimis rankomis. **Nepatikrinta dėl to:** ar dump'as sukuria bazę nuo nulio
teisinga koduote (bazės numatytoji yra `latin1`, nors visos lentelės utf8mb4).
Viskas kita patikrinta.

**`options` 1 035 vs 1 034 originale — NE klaida:** kopija daryta 07:00,
palyginimas 10:40; WP per tą laiką sukūrė naują įrašą. Su MANIFESTU sutampa
tiksliai, o tai ir yra kriterijus.

---

## 8h. BACKUP SARGAS — VEIKIA (2026-08-04)

```
Skriptas    /home/gyvunai2/backups/ps-backup-watch.php v1.0 · 4 426 B · 0700
            sha efb40d007472867a
Paleidiklis .../dev/watch-run.php · 143 B (tik require)
Cron        0 10 * * *  http://dev.avesa.lt/watch-run.php?ps_watch_key=...
Būsena      /home/gyvunai2/backups/.ps-watch-state.json
Ribos       MAX_VAL 26 h (paros ciklas + 2 h atsargos) · MIN_MB 5
```
**Praneša TIK kai negerai.** Normalioje būsenoje tyli — todėl laiškas iš sargo
visada reiškia tikrą problemą.

**Testų matrica 6/6 (s401.json):**
```
be rakto / blogas raktas   403 · 403
T1 normali būsena          OK, jokio laiško
T2 kopija prieš 40 val.    „CRON GREIČIAUSIAI NEBEPASILEIDŽIA"
T3 last_result = FAIL      „Paskutinis bandymas: FAIL — ..."
T4 kopija 1 KB             „Kopija įtartinai maža: 0 MB (riba 5 MB)"
T5 būsenos failo nėra      „nė karto nepasileido arba failas ištrintas"
T6 grąžinus                OK · būsena grąžinta byte-tiksliai
```
Keturi gedimo tipai — keturi skirtingi pranešimai, ne bendras „kažkas negerai".

**Kodėl 10:00:** 6 val. po backup'o. Jei naktinis 04:00 nepasileistų arba
žlugtų, apie tai žinoma tą pačią dieną, ne po savaitės.

---

## 8i. EL. LAIŠKŲ ŠABLONAI — TRYS LAUNCH SVORIO ĮDIEGTI (2026-08-04)

**SVARBU KITAM LANGUI: srautų registras JAU PILNAS.** `Petshop_Email_Dispatch::flows()`
turi visus 18 srautų su `class` / `template` / `delay`. Naujam laiškui KODO KEISTI
NEREIKIA — pakanka įdėti šabloną `petshop-core/templates/emails/{slug}.php`.

**Šablono kontraktas:** gauna `$payload`, nustato `$subject`, grąžina HTML.
Pradžioje `if (!defined('ABSPATH')) exit;`. Stilius — table-based, #F3EFE5 fonas,
600px kortelė, CTA #2d6a35. Pabaigoje UAB Avesa rekvizitai + priežastis, kodėl
laiškas gautas. Marketingo srautuose PRIVALO būti atsisakymo nuoroda.

```
consent-changed.php  3 630 B · sha c214ba2ed0f185f3
dunning-1.php        3 238 B · sha dfc5178ecd23d96b
founding.php         3 555 B · sha 9b77b8a5f30315c5
Šablonų viso: 8 iš 18 srautų
```

**Renderinimo testai 6/6 (s404.json)** — kiekvienas su pilnu IR tuščiu payload:
```
                     su duomenimis                    be duomenų
consent_changed      „...sutikote gauti naujienas"    „...naujienų nebesiųsime"
payment_failed       „Užsakymas AVPN-1042 laukia..."  „Jūsų užsakymas laukia..."
founding_activation  su kodo bloku                    be kodo bloko
Visi: DOCTYPE ✅ · UAB ✅ · PHP klaidų 0 ✅ · lietuviškos raidės ✅
```
Tuščio payload testai svarbiausi: realiame gyvenime payload dažnai nepilnas,
o laiškas su `Undefined` klaida blogiau nei jokio laiško.

**Grandinė įrodyta (s406.json):**
```
enqueue → job pending, be block/skip
process_pending(dry) → picked 1 → WOULD_SEND
   subject „Patvirtiname: sutikote gauti mūsų naujienas" · html 1 917 B
cron ps_email_dispatch_cron gyvas
```

### DU RADINIAI

**1. Klaidingas ankstesnis teiginys.** Buvo manyta: „24 consent_changed įvykiai
laukia, vos šablonas atsiras — nukeliaus". **NETIESA.** Visi 24 jau `sent`
(2026-07-31), o `consent_jobs = 0`. Įvykių žurnalas ir laiškų eilė — DU ATSKIRI
sluoksniai: įvykis nuėjo į Sender kaip kontakto atnaujinimas, laiško darbas
NEBUVO sukurtas. Šablonas veiks TIK naujiems pakeitimams. Senų perleisti
NEDERĖTŲ — žmonės gautų patvirtinimą apie savaitės senumo veiksmą.
(Pavyzdžiai `s2@example.com`, `source: s2` — testiniai, ne klientai.)

**2. `pet_profile_created`: 6 įrašai `dead` iš 109.** Po pakartotinių bandymų
palikti. Nekritiška, bet gali būti tas pats defektas, kuris pasikartos po
launch — verta pasižiūrėti, kodėl krito. NEIŠTIRTA.

### `payment_failed` — šablonas be įvykio
```
Šablonas ✅ · srautas registre ✅ · ĮVYKIO DB NĖRA NĖ VIENO
```
Reikia išsiaiškinti: ar Paysera praneša apie nepavykusius mokėjimus ir ar
`class-event-emitters.php` turi tam kabliuką. **Atskiras darbas, ne šablonas.**

---

## 8j. NAUJIENLAIŠKIS — POKRAŠTĖS FORMA + LAUNCH MODALAS (2026-08-04) ✅

### Kodėl tai buvo verta
Raimio korekcija: **petshop.lt nėra nauja svetainė.** 2 445 URL, 19 735 paspaudimai
per 16 mėn., ~2 000 senų klientų el. adresų, kuriuos Raimis perkels. Launch savaitė
— vienintelis momentas, kai yra ir smalsumas, ir dėmesys. Todėl modalas turi būti
paruoštas launch DIENAI, ne po jo.

### SPRENDIMAS: JOKIOS NUOLAIDOS
Maisto marža 15–20%, maistas = 76% pardavimų. Prie 40 € užsakymo tai 6–8 € pelno;
10% nuolaida atimtų ~4 € — daugiau nei pusę, ir pritrauktų tuos, kurie pirktų ir
taip. Vietoj to modalas siūlo DU kelius: augintinio anketa (gauni rūšį, svorį,
jautrumus, ne tik el. paštą) arba tik el. paštas.
Jei kada norėsis nuolaidos — NE ant maisto (skanėstai/priedai/aksesuarai) ir
adresuotai seniems klientams, ne visiems praeiviams.

### Komponentai
```
class-newsletter.php         v1.1 · 8 841 B · sha d1575ae272fe3dea
  [petshop_newsletter title= text= button= source=]
  POST /petshop/v1/newsletter-subscribe
  VIENAS žingsnis (be double opt-in) — apsauga per consent_changed laišką
  rate limit 5/val per IP · 3/parą per el. paštą
newsletter.js                2 324 B · sha de0ed45097a0abc9
class-newsletter-footer.php  2 247 B · sha 0a35be5c7dd5e3a1
  add_action('flatsome_before_footer', ..., 20)
class-welcome-modal.php      v1.1 · 6 345 B · sha 46545bb1f0fa6f2a
  jungiklis petshop_welcome_modal_enabled — IŠJUNGTAS iki launch
  12 s delsa · exit intent tik desktop · cookie 90 d.
Visi keturi per require_once petshop-core.php (backup .bak_S409/.bak_S411/.bak_S419)
```

### VIETA — kodėl NE widget'as ir NE Footer 1
Flatsome poraštė = widget zonos `sidebar-footer-1` (TUŠČIA) ir `sidebar-footer-2`
(4 custom_html). Kabliukas patikrintas KODE (`structure-footer.php:128`):
```
add_action('flatsome_before_footer', 'flatsome_html_before_footer');
```
Einam prioritetu 20 — PO temos savo HTML bloko. Nauda: pilno pločio blokas,
nekeičiama veikianti Footer 2 struktūra, neįjungiama nenaudota Footer 1 zona,
nepriklausom nuo widget nustatymų, forma lieka VIENOJE vietoje (shortcode).
`custom_html-6` bandymas iš Footer 1 pašalintas.

### PATVIRTINTA NARŠYKLĖJE (s419, s420, s421)
```
                          desktop              mobile
juosta matoma             ✅                   ✅
juosta                    2602–2934            3798–4234
Footer 2 kolonos          2934–3329            4234–5379
teisinis baras            3329–3403            5379–5477
JUOSTA VIRŠ KOLONŲ        TAIP                 TAIP
NE teisiniame bare        TAIP                 TAIP
hScroll                   0                    0
Footer 2 nepakitusi       ✅                   ✅
checkout be formos        ✅ · JS klaidų 0
```
**Honeypot (4 vartai):** „Nepildykite" innerText → −1 · viewporte → false ·
Tab kelyje → false · POST testas → tylus 200, consent_log +0, jobs +0.
Galutinė būsena: be etiketės teksto, wrapper `aria-hidden="true"`,
input `tabindex="-1"` + `autocomplete="off"`, laukas už viewporto.

**Modalas:** ESC uždaro (v1.1 — `capture` fazė + `stopPropagation`; v1.0 neveikė),
`hidden` + `display:none`, cookie `psw_seen`, checkout be modalo, JS 0.

### TRYS MANO MATAVIMO KLAIDOS (visos — tikrinau ne tai, ką reikia)
```
1. Playwright isVisible()=true honeypot'ui, kuris x=-9999 → MELAGINGA „matomas".
   isVisible() tikrina matmenis, NE ar elementas viewporte.
   Teisingai: getBoundingClientRect() + getComputedStyle() + realus Tab kelias.
2. „Juosta ne virš poraštės" — lyginau su #footer, kurio VIDUJE pati juosta ir yra.
   Teisingai: lyginti su .footer-widgets ir .absolute-footer.
3. Prasimaniau theme_mod `footer_1_content` — Flatsome tokio NETURI.
   Įrašiau, „radau" tuščią, tada ištryniau. Prieš rašant į temą — PATIKRINTI, ar
   nustatymas egzistuoja.
```

### KAS LIEKA (ne šio bloko)
```
Vokelio ikona mobiliame meniu — SĄMONINGAI negrąžinta (užimtų svarbią
  navigacijos vietą funkcijai, kurios žmogus specialiai neieško)
Atskiras naujienlaiškio puslapis — NEKURIAMAS (neturėtų savarankiško turinio)
Pagrindiniame puslapyje nedubliuoti, kol poraštė nerodo, kad renka per mažai
2 000 senų adresų importas — ATSKIRAS darbas, šaltinis `legacy_customer` ir
  TIKRA sutikimo data, NE šiandienos. Jie buvo KLIENTAI, ne prenumeratoriai —
  pėdsakas turi tai rodyti.
Modalo jungiklį įjungti launch dieną: petshop_welcome_modal_enabled = 1
```

---

## 11. TŽ v1.60 AUDITO SPRAGOS (2026-08-04) — DEVYNI BLOKAI, KURIŲ REGISTRE NEBUVO

> Pilna ataskaita: `TZ_AUDITAS_2026-08-04.md` (Raimio PC). Gyvas auditas `analize/s422.json`.
> Registras dengė ~60% TŽ launch apimties. Šie devyni blokai buvo NEFIKSUOTI.

| ID | Blokas | TŽ | Serveryje 2026-08-04 | Būklė |
|---|---|---|---|---|
| G1 | **Identity / Google login** (TŽ v1.45) | **P0** | social login plugino NĖRA | 🔴 **sprendimas Raimio** |
| G2 | F22 lojalumas | startas 2026-08-15 | lentelių nėra, Q9 atvira | 🔴 |
| G3 | Google Merchant Center feed | pre-launch, v1.56 | feed'o nėra; PMax degina ~10k €/m | 🔴 |
| G4 | Sender webhook statusai (delivered/bounced/opened) | „sekantis techninis blokas" | route yra, statusų grandinės ne | 🔴 |
| G5 | H1 tema-lygio fix | blocker nuo v1.53 | nepatikrinta | 🔴 |
| G6 | ShortPixel ON | pre-launch | INACTIVE 6.5.5 | ⚪ **suplanuota**, ne spraga |
| G7 | wpo-wcpdf trynimas | higiena | INACTIVE 5.15.2, yra | ⚪ **suplanuota**, ne spraga |
| G8 | Pragma production mode | pre-launch | `NENUSTATYTA` = OFF | ⚪ **RAIMIO NURODYMAS — TEISINGA BŪSENA** |
| G9 | SMS Sender ID registracija | „pradėti ANKSTI" | nepradėta | 🔴 |

### ⚠️ G6/G7/G8 NĖRA SPRAGOS — NEKELTI JŲ KAIP PROBLEMŲ
```
G8 PRAGMA: production mode IŠJUNGTAS PAGAL RAIMIO NURODYMĄ (TŽ v1.38).
   Priežastis: kad DABAR nesiųstų nesąmonių buhalterei. Įjungiama TIK
   paleidus naują petshop.lt. Kodas turi saugiklį + žurnalą + [TEST] prefiksą.
   TAI TEISINGA BŪSENA. Nevadinti „raudonu", nesiūlyti įjungti anksčiau.
G6 ShortPixel · G7 wpo-wcpdf: sąmoningai atidėti pre-launch veiksmai, ne gedimai.
```
Šie trys buvo klaidingai sudėti į vieną lentelę su tikromis spragomis (2026-08-04),
todėl sąrašas atrodė grėsmingesnis, nei yra. **REALIAI NEUŽDARYTI — KETURI:**
G1 Google login · G3 Merchant Center · G5 H1 fix · Redirection 301 infrastruktūra.
Plius du techniniai mano pusėje: `payment_failed` įvykis, G4 Sender webhook statusai.

### G1 detaliau — vienintelis tyliai iškritęs P0
TŽ v1.45: Google login + dedup saugiklis. Kritinė vieta: **Google email ≠ senas pirkimo email**
→ sistema sukurtų NAUJĄ tuščią profilį be istorijos. Tai tiesiogiai liečia Raimio 2 000 senų
adresų. TŽ sprendimas: savanoriškas susiejimas su nuosavybės patvirtinimu per magic link į
SENĄ el. paštą. Magic link mechanizmą jau turim (M8) — ne nuo nulio.
**KLAUSIMAS RAIMIUI: P0 launch'ui ar po launch?** Nuo to priklauso DOD-01 spalva.

### REGISTRO KLAIDOS, KURIAS AUDITAS IŠTAISĖ
```
F30b atsiliepimai      buvo ⚪ „nepatikrinta" → REALIAI VEIKIA:
                       enable_reviews=yes · verification_required=yes · rating=yes
EAN padengimas         buvo „1 518 be EAN (55%)" → REALIAI 1 936/2 776 = 69,8%
                       (ankstesnis skaičius rėmėsi VIEN _ean lauku, ne visais 4)
Snippetų higiena       TŽ v1.38 rašė 311 → REALIAI 1 568 (85 aktyvūs, 208 TEMP)
Sprendimų puslapiai    visi 6 PUBLISH (34254/58/59/60/61/62) — registre nefiksuota
Katalogas              2 776 publish · 1 026 draft · 31 vartotojas · 2 užsakymai
Redirection            įdiegtas 5.9.0 BET NEAKTYVUS ir DB lentelių NĖRA
                       → DOD-07 infrastruktūra net neinicializuota
```

### Q KLAUSIMAI SU PRAĖJUSIAIS TERMINAIS
```
Q14 Paysera Recurring (2026-06)   Q16 feed'ai (2026-07) ← blokuoja G3
Q19 istoriniai atsiliepimai (06)  Q23 aprašymų sekcijos (07)
Q25 fulfillment ABC (2026-07)     Q9 lojalumas — terminas 08-15, LIKO 11 D.
```

### TŽ ATSILIEKA
Paskutinis TŽ įrašas — v1.60 (2026-07-30). Nedokumentuota: backup grandinė (§8b–8h),
F4 paieška, M8 anketa 9/9, 3 šablonai, naujienlaiškis, MyISAM radinys.
**Siūloma v1.61** po einamųjų darbų.

---

## 9. LAUKIA RAIMIO SPRENDIMO

| ID | Klausimas | Blokuoja | Terminas |
|---|---|---|---|
| Q6 | Prenumeratos pluginas | F19 | — |
| Q10 | Kurie 20–30 SKU prenumeratai | F19 | — |
| Q-BKP | ✅ **UŽDARYTA 2026-08-03:** B2 bucketas, raktas, kredencialai, Object Lock 14 d. — viskas pastatyta ir įrodyta (§8d) | DOD-08 | — |
| **Q-GOOGLE** | **Google login (TŽ v1.45 P0) — launch'ui ar po launch?** | DOD-01, §11 G1 | skubu |
| **Q-MERCH** | **Google Merchant Center feed — dabar ar po launch?** (~10 k €/metus) | §11 G3 | skubu |
| Q-MON | **Monitoringo apimtis** — uptime pakanka, ar reikia ir PHP klaidų sekimo? | DOD-13 | — |
| Q-PSR2 | **Paysera testinio režimo patvirtinimas** — be jo pilnas mokėjimo ciklas (redirect → callback → `processing`) netestuojamas. Dev režimas testinis, bet konfigūracija nebaigta | F-PSR | — |
| Q9 | Lojalumas: pluginas ar savas BonusLedger | — | 2026-08-15 |
| Q21 | FB paskyros revival + reali nuoroda | OPS-10 | — |
| Q-R2 | 1518 prekių be EAN — iš kur imti | F4 vertė | — |
| Q-R7 | 1022 draft prekės — publish/trinti/palikti | — | — |
| Q-SEO | Kurios 404 kategorijos apskritai bus | DOD-07 | — |
| Q-M8 | Anketos tekstai + „14 dienų" frazė | M8 9b | — |
| Q-27 | S327 laiško lietuviško stiliaus peržiūra | — | — |
| Q-GDPR | Duomenų retencija: kada trinti `ps_carts`/`ps_shipments` | — | — |
| Q-PSR | Paysera Recurring atsakymas (nefiksuotas) | F19 | — |
| Q-EM | El. paštas „Apie mus" / „Privatumo politika" psl. | — | — |

---

## 10. SIŪLOMA EILĖ

```
A — greita (valandos)          R5 kainos ✅ · F4 paieška ✅ · F14 mobile ✅
                               backup: Installatron kopijos YRA (§8b) ⏸ Q-BKP
                               monitoringas ⏸ Q-MON
B — didelis kodas              F19 prenumerata (po Q6+Q10) · 3 launch šablonai
C — Raimio sprendimai          Q6 Q10 Q-R2 Q-SEO Q-M8
D — procesas (dienos)          DOD-04 20 užsakymų · DOD-17 beta · DOD-18/19 DNS+rollback
                               DOD-20 savaitinis monitoringas
E — pre-launch (T-14 … T-0)    visos OPS-* · DOD-07/21 301 lentelė
```

Grupėje A padaryta: R5 ✅, F4 ✅, F14 ✅ — DOD-01 UŽDARYTAS.
Backup pasirodė esąs 🟡, ne 🔴 (§8b). Liko Q-BKP (saugykla) ir Q-MON (apimtis).
