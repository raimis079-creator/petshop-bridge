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
| Launch DoD (22) | 10 | 5 | 5 | 2 nematuota |
| P0 funkcijos F1–F16 | 16 | 0 | 0 | — |
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
| DOD-01 | P0 funkcijos F1–F16 100% | ✅ | 2026-08-04 | F4 ✅ F14 ✅ · Identity P0 įvykdytas magic link (§11 G1) |
| DOD-02 | Kritinių klaidų 0 | ⚪ | — | **nėra bug registro** — nematuojama |
| P1-MYISAM | MyISAM → InnoDB migracija | 🔴 | 2026-08-03 | 160/174 lentelių MyISAM = 98% duomenų. Architektūros skola, ne tik backup (§8c) |
| DOD-03 | Aukšto prioriteto klaidų ≤3 | ⚪ | — | tas pats |
| DOD-04 | 20 testinių užsakymų | 🟡 | 2026-08-04 | **20/20 sukurta, 0 klaidų** (§13). Po patikros IŠTRINTI Raimio nurodymu. Programinis kelias — checkout/pristatymo atrinkimas NEPATIKRINTAS |
| DOD-05 | 2 stabilūs pristatymo būdai | ✅ | 2026-06-01 | Venipak + LP Express live |
| DOD-06 | Paysera + bankinis | ✅ | 2026-06-01 | — |
| DOD-07 | Top-100 SEO 301 | ✅ | 2026-08-04 | 937 keliai · 5 863 clicks · 6 sluoksniai (§12). GSC padengimas: 68,5% srauto veikia arba nukreipta; 4 037 clicks = turinio nebėra (teisingas 404) |
| DOD-08 | Backup restore testas | ✅ | 2026-08-04 | Pilna grandinė įrodyta: skriptas (§8f) · cron 0 4 * * * · gedimo pranešimai · **atstatymo testas 174/174 (§8g)**. Apribojimas: rtst_ prefiksas, ne švari DB |
| DOD-09 | XML sync 7 d. be klaidų | 🟡 | 2026-08-04 | **Serijos ĮRODYTI NEĮMANOMA** — pmxi_history laiko ~19 įrašų, `_vf_last_sync` perrašomas. Įdiegtas kaupiamasis žurnalas (§13); serija kaupsis. Sąveika su pardavimais — tik po launch |
| DOD-10 | Kainodara testuota 20 produktų | ✅ | 2026-07-30 | **UŽDARYTA AUDITU, stipresniu už 20 imtį:** 1 050 prekių su savikaina · 0 neigiamų maržų · 0 žemiau 20% · tipinė ~45%. Formulės atitikties NETIKRINTI (§14) |
| DOD-11 | Manual override 5 produktais | 🟡 | 2026-08-03 | 2 iš 5 (14824, 33249 per R5) |
| DOD-12 | Savininkas apdoroja užsakymą be programuotojo | 🟡 | 2026-08-04 | Techninė pusė patikrinta (§14). Rankinis kelias — TIK Raimis, kontrolinis lapas `DOD12_kontrolinis_lapas.md` |
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
| OPS-12 | `gaj6_umbrella_redirects` — kilmė patvirtinta, IŠTRINTA 2026-08-04 (§13). Lentelių 174→173 | ✅ |

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
| G1 | Identity / Google login (TŽ v1.45) | P0 | plugino nėra — NEREIKIA | ✅ **UŽDARYTA 2026-08-04: NEBEAKTUALU** |
| G2 | F22 lojalumas | startas 2026-08-15 | lentelių nėra, Q9 atvira | 🔴 |
| G3 | Google Merchant Center feed | pre-launch, v1.56 | feed'o nėra; PMax degina ~10k €/m | 🔴 |
| G4 | Sender webhook statusai | „sekantis techninis blokas" | **svarbioji dalis JAU VEIKĖ** (§13) | 🟡 trūksta tik analitikos |
| G5 | H1 tema-lygio fix | blocker nuo v1.53 | **10/10 puslapių po 1 prasmingą H1** | ✅ **UŽDARYTA 2026-08-04 — nebeaktualu** |
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
~~G1~~ ~~G5~~ (uždarytos) · **G3 Merchant Center** · Redirection 301 ID uodegoms (§12).
Plius du techniniai mano pusėje: `payment_failed` įvykis, G4 Sender webhook statusai.

### G1 — UŽDARYTA KAIP NEBEAKTUALU (Raimio sprendimas 2026-08-04)

**TŽ v1.45 Identity sluoksnio P0 reikalavimą ĮVYKDO MAGIC LINK, ne Google login.**
Magic link veikia ir patikrintas E2E (M8): žmogus įveda el. paštą → gauna nuorodą →
prisijungia. Slaptažodžio nereikia niekam.

**Google login SĄMONINGAI ATMESTAS. Trys priežastys — NEKELTI IŠ NAUJO:**
```
1. Trinties mažinimo tikslą (pagrindinis TŽ v1.45 argumentas) magic link jau
   išsprendė, ir geriau: be Google paskyros, be trečiosios šalies sutikimo,
   be papildomo plugino, be duomenų dalijimosi.
2. Google login ĮNEŠTŲ problemą, kurios dabar NĖRA. Pati TŽ v1.45 įspėja:
   Google email ≠ senas pirkimo email → tuščias profilis be istorijos.
   Su magic link tokio atvejo NEBŪNA — žmogus įveda TĄ PATĮ paštą, į kurį
   gauna laišką. Google login šią riziką KURIA, o ne sprendžia.
3. Dar vienas pluginas = dar viena priklausomybė, kuri gali sulūžti.
```
**LIEKA ATSKIRAS, NESUSIJĘS KLAUSIMAS:** ar senas klientas, pirkęs KITU el. paštu,
turi kelią prie savo istorijos. Tai duomenų migracijos, ne login klausimas —
spręsti importuojant 2 000 adresų (`legacy_customer`), ne dabar.

**Į TŽ v1.61:** §4.3 Identity sluoksnis — Google login išbraukiamas, P0 įvykdytas
magic link mechanizmu.

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

## 12. SEO 301 — KATEGORIJŲ SLUOKSNIS UŽDARYTAS (2026-08-04)

### ŠAKNIS: pasikeitė kategorijų adresų struktūra
```
Sena platforma:  /sunims/antiparazitines-priemones-sunims
Nauja:           /kategorija/sunims/antiparazitines-priemones-sunims/
                  ^^^^^^^^^^^ woocommerce_permalinks category_base = 'kategorija'
```
Todėl liepos 30-os auditas rodė „kategorijos, kurių dev'e NĖRA, reikia Raimio
sprendimo, ar tokia kategorija apskritai bus". **KATEGORIJOS YRA** — tiesiog kitu
adresu. Tas sprendimas NEBEREIKALINGAS.

### SPRENDIMAS: `/kategorija/` PALIEKAMA (Raimis + konsultantas)
Tuščio `category_base` NEDAROM:
```
- WooCommerce to nerekomenduoja (URL atpažinimas, našumas, dublikatai)
- pas mus JAU YRA 6 realūs slug konfliktai:
  daugiau-pigiau · jautrus-virskinimas · naujas-kaciukas · naujas-suniukas
  · pasiulymai · sprendimai
- tuščia bazė = kategorijos/puslapiai/įrašai amžinai kovoja dėl tos pačios
  adresų erdvės; septintas konfliktas ateity nutiltų TYLIAI
- 301 taisyklės GRĮŽTAMOS, adresų struktūros keitimas — praktiškai NE
```

### ĮDIEGTA: `mu-plugins/petshop-legacy-cat-301.php` v1.1
```
4 523 B · sha b4177b3b92d8f548 · 34 keliai · 1 596 GSC paspaudimų
Žemėlapis: analize/legacy_cat_301_map.json
```
**ĮŠALDYTAS ISTORINIS RINKINYS, NE DINAMINIS.** Sugeneruotas VIENĄ kartą iš GSC
(2 445 URL / 19 735 clicks / 16 mėn.) sankirtos su kategorijų medžiu. Naujoms
kategorijoms taisyklės NEKURIAMOS — antraip vėl tyliai užimtume šakninę URL
erdvę, kurios dėl to ir atsisakėme. Naujas įrašas — TIK rankiniu būdu su GSC
pagrindimu.

### VARTAI — VISI ŽALI (s426 → s427)
```
seni adresai        404 → 301, po VIENĄ šuolį, galutinis 200   ✅ 5/5
X-Redirect-By       Petshop-Legacy-Category                     ✅
34 taikiniai        blogų 0                                     ✅
kontrolė            sprendimai · jautrus-virskinimas · naujas-suniukas
                    · duk · privatumo-politika — NEPAKITO       ✅
/kategorija/sunims/ 200 nepaliesta                              ✅
neatpažintas        404, JOKIO spėjimo                          ✅
```
**PAMOKA:** pirmas bandymas davė `X-Redirect-By: WordPress` = FAIL pagal TŽ v1.56
QA sąlygą. Priežastis: `wp_redirect()` savo antraštę nustato PO rankinio
`header()` ir ją PERRAŠO. Reikšmė privalo eiti TREČIU argumentu (WP 5.1+):
`wp_redirect($url, 301, 'Petshop-Legacy-Category')`.

### 2 SLUOKSNIS: ID UODEGOS — UŽDARYTA (v1.2, 2026-08-04)
```
94 keliai su ID uodegomis (802 clicks) → taikinių RASTA 42 (666 clicks)
   kategorijos 3 · prekės 37 · puslapiai 2
Žemėlapis: analize/legacy_tail_301_map.json
```
**REDIRECTION NENAUDOJAMAS. Priežastis — ne gedimas, o nulinė nauda:**
taikiniai SKIRTINGI (vieni `/kategorija/...`, kiti `/product/...`), tad tai NE
viena „nukirpk uodegą" taisyklė, o 42 individualūs atitikmenys — lygiai toks pat
statinis rinkinys kaip kategorijų. Vienas mechanizmas vietoj DVIEJŲ tiesos vietų,
be papildomo plugino ir be DB lentelių (Redirection 5.9.0 neaktyvus, lentelių nėra).

**PATIKRINTA (s429):** 42 taikiniai visi grąžina 200 · 7 testiniai adresai → 301,
po VIENĄ šuolį, galutinis 200 · `X-Redirect-By: Petshop-Legacy-Category` ·
kontrolė nepakitusi · neatpažinta kategorija IR neatpažinta uodega → 404.

### ⚠️ RAIMIO RADINYS: automatika NEGALI rasti PERVADINTŲ kategorijų
```
senas:  zuvims/akvariuminiu-zuvu-maistas   (99 clicks)
naujas: zuvims/akvariumo-zuvyciu-maistas   ← EGZISTUOJA, tik kitu vardu
```
Mano paieška ieškojo tikslaus slug atitikmens nukirpus uodegą. Čia pasikeitė
PATS PAVADINIMAS — automatika to nerado ir NEGALĖJO. Įrašyta RANKINIU būdu.
**IŠVADA: skaičius „53 neturi kur nukreipti" YRA PER DIDELIS.** Dalis jų turi
kategorijas/prekes kitais pavadinimais. Reikia PERŽIŪROS SĄRAŠO su kandidatais,
sprendimą priima Raimis. Automatikai spėti NELEIDŽIAMA.

### 3 SLUOKSNIS: PERVADINTI SLUG (v1.3, 2026-08-04)
```
10 kelių · 30 clicks · analize/legacy_renamed_301_map.json
```
**TRYS SĄLYGOS VIENU METU, kitaip — į peržiūrą:**
```
panašumas >= 0,85  IR  skaičiai sutampa  IR  kandidatas VIENINTELIS
```
**Skaitinis saugiklis (TŽ v1.52 pakuočių asimetrija) — BŪTINAS.** Be jo Royal
Canin `1-5-kg` vienodai (1.00) atitiko IR `15-kg`, IR `75-kg`. Saugiklis sujungia
gretimus skaitmenis (`2-5-kg` → `25`) ir lygina aibes. IŠMESTA papildomai:
bendriniai taikiniai (`kita`) ir kito tėvo kategorijos.

### BENDRA APIMTIS (v1.3)
```
1 sluoksnis  34 kategorijų keliai   1 596 clicks
2 sluoksnis  42 ID uodegų keliai      666 clicks
3 sluoksnis  10 pervadintų slug        30 clicks
──────────────────────────────────────────────────
             86 keliai              2 292 clicks = 11,6% viso GSC srauto
mu-plugins/petshop-legacy-cat-301.php v1.3 · 14 608 B · sha 997bf7c581f6e335
```
**PATIKRA (s432):** visi trys sluoksniai — taikiniai 200 · 6 testiniai adresai
→ 301, po VIENĄ šuolį, galutinis 200 · `X-Redirect-By: Petshop-Legacy-Category` ·
kontrolė nepakitusi · neatpažinti → 404.

### ⏸ LAUKIA RAIMIO: 40 URL peržiūra (106 clicks)
```
CSV Raimio PC: SEO_perziura_40_URL.csv (kandidatai + tuščias „sprendimas" stulpelis)
JSON repo:     analize/seo_perziura_40.json
```
Automatika kandidatus RADO, bet nė vienas nepraėjo trijų sąlygų — arba panašumas
per mažas, arba keli vienodai stiprūs, arba skaičiai nesutampa. **Spėti
NELEIDŽIAMA.** Didžiausi: `sunims/transportavimo-dezes` (46 clicks — du kandidatai:
šunims ir katėms), `vistienos-file-juosteles` (14 — kandidatas ANTIENOS, kita mėsa).

### v2.0 — 6 SLUOKSNIAI, 937 KELIAI (2026-08-04)
```
mu-plugins/petshop-legacy-301.php          2 881 B · sha 02e958db35dc9a32
mu-plugins/petshop-legacy-301-map.json   124 697 B · 937 įrašų
(senas petshop-legacy-cat-301.php IŠTRINTAS — pakeistas)
```
**Žemėlapis ATSKIRAME JSON**, kraunamas TIK kai adresas 404 — kad kiekviena
užklausa neparsintų 137 KB PHP masyvo.

```
sluoksnis                                    kelių   clicks
1  kategorijos be /kategorija/ priešdėlio       34    1 596
2  seni URL su ID uodegomis                     42      666
3  pervadinti slug                              10       30
4  produktai iš šaknies → /product/            805    2 968
5  likusios kategorijos                         24      102
6  brendai → /gamintojas/                       22      501
─────────────────────────────────────────────────────────────
                                              937    5 863 = 29,7% GSC srauto
```

### 🔴 KRITINIS RADINYS: /exclusion vedė į ATSITIKTINĮ SKU
```
PRIEŠ:  /exclusion (218 clicks) → 301 → /product/exclusion-hepat...
        X-Redirect-By: WordPress   ← redirect_canonical SPĖJIMAS
PO:     /exclusion → 301 → /gamintojas/exclusion/
        X-Redirect-By: Petshop-Legacy-Category
```
TŽ v1.56 tai įspėjo („/exclusion 4194 EUR/6mėn, WP spėjimu 301-ina į vieną SKU,
praeina QA"). **2026-08-04 tai VIS DAR VYKO.** Dabar uždaryta visiems 22 brendams.

### PATIKRA (s436, s437)
```
937 įrašai · imtis 100 atsitiktinių → VISI taikiniai 200
8 testiniai adresai (produktai, kategorijos, brendai) → 301, 1 šuolis, 200
X-Redirect-By: Petshop-Legacy-Category   visiems
kontrolė (jorksyro-terjeras, suns-serimo-lentele, duk, sprendimai,
          kategorija/sunims, privatumo-politika) — NEPAKITO
neatpažintas adresas → 404, jokio spėjimo
```

### GSC SUVESTINĖ (2 445 URL / 19 735 clicks)
```
jau veikė be nieko (page/post)          45 kelių ·  7 634 clicks
uždaryta 301 taisyklėmis               937 kelių ·  5 863 clicks
peržiūrai (CSV)                         40 kelių ·    106 clicks
lieka 404 (turinio nebėra)             950 kelių ·  4 037 clicks
```
**950 likusių — daugiausia prekės, kurių katalogo NEBĖRA** (Beaphar, Frendi,
GimCat pozicijos ir pan.). 404 jiems yra TEISINGAS atsakymas. Nukreipti „į
panašiausią" DRAUDŽIAMA.

### LIKO
```
40 URL peržiūra (CSV Raimio PC) — nebūtina iki launch, 106 clicks / 16 mėn.
T-14/T-3 galutinė QA: visi seni → 301 → 200, be grandinių, be noindex
```

---

## 13. 2026-08-04 VAKARO BLOKAS — PENKI DARBAI

### payment_failed — GRANDINĖ UŽDARYTA
```
mu-plugins/petshop-payment-failed.php v1.1 · sha e366969582c29fbb
E2E: event 1 · job 1 · WOULD_SEND „Užsakymas 34832 laukia apmokėjimo" 2 094 B
antras failed → 0 naujų (idempotencija) · testinis užsakymas ištrintas
```
**DVI priežastys, kodėl neveikė (abi svarbios kitam langui):**
```
1. Petshop_Event_Emitters kabinasi TIK prie payment_complete / processing /
   completed / update_order. Prie `woocommerce_order_status_failed` NEBUVO NIEKO.
2. DU ATSKIRI SLUOKSNIAI: Event_Registry::emit() → ps_event_log (Sender),
   Email_Dispatch::enqueue() → ps_email_jobs (PATS LAIŠKAS).
   Vien emit() laiško NESUKURIA. Pirmame bandyme kviečiau tik emit() ir gavau
   įvykį BE laiško.
```
Dublikato nėra: WC prie `failed` siunčia laišką TIK adminui. Patikrinta kabliuku
PRIEŠ jungiant (TŽ v1.60 „vienas srautas — vienas savininkas").
Įdėtas ir Paysera atvejis: `pending` po nepavykusio mokėjimo — emituojam tik jei
yra `transaction_id`.

### Sender webhook — TŽ v1.60 vertinimas PASENĘS
Svarbioji dalis JAU VEIKĖ: `handle_sender_unsubscribe()`, `handle_sender_bounce()`,
suppression lentelė KANALINĖ su istorija (suppressed_at + released_at),
`ps_webhook_log`, realus įrašas iš `sender_reconcile`.
**Trūksta tik `delivered/opened/clicked` — tai ANALITIKA, ne funkcija.**
Reputaciją saugantys atsisakymai ir bounce'ai apdorojami. NESTATOM (Raimio
principas dėl perteklinių saugiklių).

### DOD-04 — 20 užsakymų, 0 klaidų
```
ID 34833–34852 · svečias 10 / registruotas 10 · 4,49–659,50 €
žemiau 30 € — 12, virš — 8 · šaltiniai zb/vf/legacy/belcor atskirai IR mišriai
PROBLEMOS: nė vienos (suma, prekės, paštas, miestas — visi užpildyti)
Po patikros IŠTRINTI (Raimio nurodymu): 20/20, saugiklis id>34720,
realūs 34645 ir 34720 NEPALIESTI. Liko 10 našlaičių order_items eilučių.
```
**APRIBOJIMAS:** užsakymai kurti PROGRAMIŠKAI. Patikrinta kūrimo ir kainų logika,
BET NE checkout/pristatymo metodų atrinkimas — `Fulfillment_Source` ir nemokamo
pristatymo riba veikia krepšelio etape, kurio šis kelias neliečia.

### 🔴 MANO KLAIDA: nemokamas pristatymas
Paskelbiau „nemokamo pristatymo NĖRA" pažiūrėjęs į `woocommerce_free_shipping_1_settings`
(min_amount 0, is_enabled 0). **NETIESA.** Riba sukonfigūruota VENIPAK PLUGINE:
```
woocommerce_shopup_venipak_shipping_pickup_method_3_settings
  min_amount_for_free_shipping: "30"    ← veikia, kaip Raimis ir sakė
```
Ta pati klaidos rūšis kaip `footer_1_content` ir honeypot: pažiūrėjau į VIENĄ
vietą ir paskelbiau verdiktą apie visą dalyką.

### Snippetų valymas
```
viso 1 588 → 1 360 · TEMP 228 → 0 · aktyvūs 85 → 82
```
Trinta per DB — Code Snippets REST DELETE grąžina `rest_cannot_delete`.

### gaj6_umbrella_redirects — IŠTRINTA
```
create_time 2026-08-03 20:37:41  ← tą pačią dieną kaip WP Umbrella diegimas
įrašų 0 · kodas nenaudoja · umbrella opcijų 0 · pluginų 0
Backup: opcija petshop_umbrella_redirects_bak_S450 (CREATE + eilutės)
Lentelių 174 → 173
```

### 6 „dead" pet_profile_created — NE DEFEKTAS
```
last_error: non_retriable: Subscriber not found  (visi 6)
m8e2e_31524@ · e2e_empty_1784063882@ · e2e_1784063882@ (MŪSŲ testai)
gutulis@gmail.com (Raimio testinis)
```
Sender'yje tokių prenumeratorių nėra → sistema teisingai NEKARTOJO. Nieko taisyti.

### DOD-09 — kodėl serijos įrodyti NEĮMANOMA
```
pmxi_history        laiko tik ~19 įrašų, senesnius TRINA
_vf_last_sync       perrašomas kiekvieną sync (visos 1 161 prekės = šiandien)
```
Matoma tik 08-03…08-04. Importai gyvi: #7 kas valandą, #3 12:00 ir 17:00,
#5 03:30 kasdien, #2 03:00.
**ĮDIEGTA:** `mu-plugins/petshop-import-log.php` v1.0 · sha 2f64cc9e95a2bff0
```
kaupiamasis, NETRINA · perkelti 9 esami įrašai
kaupia: data · import_id · created/updated/skipped · UŽSAKYMŲ PER VALANDĄ
petshop_import_log_serija() → ilgiausia parų serija be pertraukos
```
Stulpelis „užsakymų per valandą" dabar visada 0, bet PO LAUNCH parodys tai, ko
dev'e patikrinti neįmanoma: ar importas nesuveikė PIRKIMO metu.
**DOD-09 nedeklaruoti žaliu net serijai atsiradus** — sąveika su pardavimais
tikrinama tik po launch (Raimis sutiko).

---

## 14. DOD-10 IR DOD-12 (2026-08-04)

### DOD-10 — UŽDARYTA, BET NE TAIP, KAIP APRAŠYTA TŽ
TŽ prašo „testuota 20 produktų". **2026-07-30 auditas apėmė 1 050 prekių** —
stipresnis įrodymas: 0 neigiamų maržų, 0 žemiau 20%, dauguma 30–50%, tipinė ~45%.

**🔴 FORMULĖS ATITIKTIES NETIKRINTI. NIEKADA.**
```
Petshop_Pricing formulė duotų ŽEMESNES kainas nei esamos.
Reprice numuštų katalogą 24 489 € → 21 473 € = −12,3%.
Esamos kainos SĄMONINGAI aukštesnės (Raimio sprendimas 2026-07-30 „nelendam").
```
Kas darys „kainų patikrą pagal formulę", ras 20 neatitikimų ir vadins juos
klaidomis. **Tai NE klaidos.** Prieš bet kokį kainų darbą — skaityti ZB įrašą.

### DOD-12 — techninė pusė (s455)
```
HPOS                    įjungtas
WCDN 7.2.1              aktyvus · sąskaitų skaitiklis 228 (prieš launch → 101)
Venipak pluginas        vietoje
LP Express              prideda 7 savo statusus (lp-parcel-created, lp-label-created,
                        lp-on-the-way ir kt.) — užsakymų sąraše jų bus daugiau
```
**RASTA:** `WC_Email_Customer_Invoice` IŠJUNGTAS → iš admino rankiniu būdu
sąskaitos klientui NEIŠSIŲSI. Spręsti su kontroliniu lapu.

**Rankinis kelias — TIK Raimis.** Iš serverio pusės neišmatuojama, ar žmogus
žino, kur spausti. Kontrolinis lapas: `DOD12_kontrolinis_lapas.md`.

### 🔴 MANO KLAIDA: payment_failed dublikatas
Rašydamas `payment-failed.php` patikrinau kabliuką `woocommerce_order_status_failed`,
pamačiau `WC_Emails::send_transactional_email` ir nusprendžiau „siunčia TIK adminui".
**NETIESA** — tai BENDRAS dispečeris, siunčiantis VISUS tam statusui priskirtus
laiškus, tarp jų ir klientui. `WC_Email_Customer_Failed_Order` buvo ĮJUNGTAS →
klientas būtų gavęs DU laiškus.

**IŠTAISYTA (Raimio sprendimas: siunčia MŪSŲ):**
```
WC_Email_Customer_Failed_Order  TAIP → ne    (backup petshop_wc_failed_email_bak_S456)
WC_Email_Failed_Order           TAIP         adminui lieka
```

**TAISYKLĖ KITAM LANGUI:** prieš jungiant srautą prie dispatch tikrinti
`WC()->mailer()->get_emails()` ir kiekvieno `is_enabled()` + `get_recipient()`,
**NE kabliuko callback'ų sąrašą.** Kabliukas rodo dispečerį, ne gavėjus.

---

## 15. SESIJOS SUVESTINĖ 2026-08-04

### UŽDARYTA ŠIANDIEN
```
DOD-07  SEO 301        🔴 → ✅   937 keliai · 5 863 clicks · 6 sluoksniai
DOD-08  Backup         🟡 → ✅   B2 + Object Lock + atstatymo testas + sargas
DOD-10  Kainodara      🟡 → ✅   uždaryta 1 050 prekių auditu (§14)
DOD-01  P0 F1–F16      🟡 → ✅   Identity P0 įvykdytas magic link
OPS-12  umbrella       🔴 → ✅   lentelė ištrinta, 174 → 173
G1  Google login       🔴 → ✅   nebeaktualu
G5  H1 tema-fix        🔴 → ✅   10/10 puslapių po 1 prasmingą H1
F30b  Atsiliepimai     ⚪ → ✅   veikia (verified buyers only)
payment_failed                    grandinė pilna: event + job + laiškas
naujienlaiškis                    poraštės forma + launch modalas
3 el. laiškų šablonai             consent-changed · dunning-1 · founding
snippetai                         1 588 → 1 360 (228 TEMP)
```

### DoD BŪKLĖ
```
✅ 10 · 🟡 5 · 🔴 5 · ⚪ 2      (ryte: ✅6 · 🟡5 · 🔴9 · ⚪2)
```
Raudoni likę: DOD-13 monitoringas · DOD-17 beta 5–10 klientų ·
DOD-18 DNS planas · DOD-19 rollback · DOD-20 savaitinis stabilumas · DOD-22 indeksavimas.
**Visi penki — pre-launch operacijos, ne kodo darbai.**

### NAUJI mu-plugins (visi 2026-08-04)
```
petshop-legacy-301.php          2 881 B · 02e958db35dc9a32  + map.json 937 įrašų
petshop-payment-failed.php      3 704 B · e366969582c29fbb
petshop-import-log.php          2 826 B · 2f64cc9e95a2bff0
petshop-code-search.php         (F4, 2026-08-03)
petshop-pet-claim.php           (M8, 2026-08-03)
```

### ŠEŠIOS MANO KLAIDOS — VISOS TOS PAČIOS RŪŠIES
**Pažiūrėjau į VIENĄ vietą ir paskelbiau verdiktą apie visą dalyką:**
```
1. footer_1_content         prasimaniau theme_mod, kurio Flatsome NETURI
2. honeypot „matomas"       Playwright isVisible()=true elementui su x=-9999
3. „juosta ne virš poraštės" lyginau su #footer, kurio VIDUJE pati juosta
4. „18 s sustojimas"        tai buvo NEUŽRAKINTO eksporto laikas
5. nemokamas pristatymas    žiūrėjau WC free_shipping, o riba VENIPAK plugine
6. payment_failed dublikatas kabliuke mačiau dispečerį, ne gavėjus
```
**BENDRA TAISYKLĖ:** prieš verdiktą apie funkciją — patikrinti VISUS jos
sluoksnius, ne pirmą rastą. Ir: matavimo įrankis gali meluoti (isVisible,
dry-run skaičiai, kabliukų sąrašai) — verdiktas tik pagal galutinį elgesį.

### RAIMIO RADINIAI, KURIŲ AUTOMATIKA NERADO
```
akvariumo-zuvyciu-maistas   kategorija PERVADINTA, ne uodega → 99 clicks
nemokamas pristatymas       veikia Venipak plugine, kaip Raimis ir sakė
Pragma išjungta             sąmoningai, kad nesiųstų nesąmonių buhalterei
petshop.lt nėra nauja       2 445 URL, 19 735 clicks, 2 000 klientų
```

---

## 16. 🔴 RYTOJAUS PIRMA TEMA: MULTISANDĖLIS + ADMIN DARBO VIETA

> **PRADĖTI NUO ŠITO.** Raimio nurodymas 2026-08-04 vėlai vakare.
> NEDARYTI užsakymų sąrašo pertvarkymo, kol neišspręsta multisandėlio logika —
> antraip pridėsim stulpelius ir po mėnesio perdarysim.

### KONTEKSTAS
```
Su užsakymais ir prekėmis dirbs ATSKIRAS ŽMOGUS (patyręs, jau dirba su petshop,
ne vienerius metus). Reikės atskiro prisijungimo. Darbas KOMPIUTERIU.
Jis darys VISKĄ: priima · pakuoja · formuoja siuntas · spausdina sąskaitas.
Raimis padės tik retkarčiais.
Informacija apie MARŽAS jam REIKALINGA.
```

### RAIMIO PRINCIPAS
> „Mes darome super gerą ir patogią svetainę klientui, o sau bele kaip."
> „Neišradinėjam dviračio — pažiūrim gerąją praktiką kitur."

### KAS JAU IŠMATUOTA (s457, s460 — ekranai per Playwright su auth cookie)
```
prekių sąrašas       124 850 px aukščio (~125 ekranai) · 12 stulpelių
                     nereikalingi: Žymos · Siūloma · Data · ZB
prekės langas        3 216 px · 18 metaboxų
                     nereikalingi: Cookie reklamjuosta · Atsisiunčiamo produkto
                     leidimai · Portfolio liekanos · Vartotojo laukai
užsakymo langas      2 534 px · 10 blokų (Atsisiunčiamo produkto leidimai,
                     Custom Fields — fizinėms prekėms NIEKADA nereikia)
meniu                26 punktų (shop_manager role sutrumpintų ~perpus)
shop_manager rolė    JAU YRA, 93 teisės, ribos teisingos:
                     gali prekes/užsakymus/klientus/ataskaitas
                     negali nustatymų/pluginų/temos/kodo/vartotojų
                     vartotojų su šia role: 0
```

### UŽSAKYMŲ SĄRAŠO PROBLEMOS (Raimio ekranas 2026-08-05 00:39)
```
8 piktogramų mygtukai BE UŽRAŠŲ (prie 34645 — šeši, sulaužyti į dvi eiles)
NEMATYTI: ką pirko · pristatymo būdo · ar apmokėta
„Origin" angliškai, reikšmės „Tiesioginis/Nežinomas" — analitika, ne darbas
„Venipak būsena" stulpelis TUŠČIAS
reklaminis pranešimas viršuje užima ~ketvirtadalį ekrano
```

**SIŪLYTA STRUKTŪRA (aptarti):**
```
Nr. · Data · Klientas · KĄ PIRKO · Suma · Apmokėta · Pristatymas · ŠALTINIS · Veiksmas
+ numatytasis filtras „laukia išsiuntimo"
```

### 🔴 MULTISANDĖLIS — ESMINIS KLAUSIMAS
```
Prekės iš 5+ šaltinių: ZB · VF · Quattro · Belacor · Legacy (+ savas sandėlis)
Fulfillment_Source::resolve() tai JAU tvarko KREPŠELYJE.
UŽSAKYMŲ SĄRAŠE to NĖRA.
```
Pakuotojui tai svarbiausia informacija: ar pakuoja PATS, ar eina dropshipu.
**MIŠRUS UŽSAKYMAS** (viena prekė sava, kita ZB) skyla į DVI siuntas —
stulpelis turi rodyti VISUS užsakyme esančius šaltinius, ne vieną.

**RAIMIS: „tuoj iškils multisandėlio klausimas" — TAI RYTOJAUS TEMA.**

### GALIMA DARYTI IŠKART (nepriklauso nuo multisandėlio, 5 min.)
```
nuimti reklaminį pranešimą užsakymų sąrašo viršuje
nuimti „Origin" stulpelį
```

### RINKOS PRAKTIKA (patikrinta 2026-08-04)
```
Smart Manager (nemokamas)  skaičiuoklės stiliaus redagavimas wp-admin viduje
Adminimize (nemokamas)     varnelių lentelė: kiekvienas metaboxas × kiekviena rolė
                           IŠSPRĘSTŲ 18 blokų problemą BE KODO
                           MINUSAS: nuo ~2015 beveik nekeistas
mokami bulk edit           aprašymų paieška+pakeitimas, kainos ±%, atšaukimas,
(50–100 €/m)               filtravimas prieš redagavimą
```
**ALTERNATYVA BE PLUGINŲ:** metaboxų slėpimas prekės/užsakymo lange —
5 eilutės snippet'e, jokios naujos priklausomybės. Aplinkoje jau 29 pluginai.

### SPRENDIMAI, KURIŲ REIKIA IŠ RAIMIO
```
1. Multisandėlio apimtis — ką jis realiai apima, kur dabar kliūva
2. Ar pluginai (Smart Manager / Adminimize), ar savas kodas
3. Ar pakuotojui reikia maržos UŽSAKYMŲ sąraše, ar tik prekių lange
```

---

## 17. 🔒 SANDĖLIŲ MODELIS — UŽRAKINTA (Raimis 2026-08-05)

> Aptarta ir užrakinta pokalbyje 2026-08-05 rytą. **NEBEDISKUTUOJAMA, tik įgyvendinama.**
> Konteksto ištrauka iš TŽ: `SANDELIAI_kas_jau_aptarta.md` (Raimio PC).

### 17.1 SEPTYNI ŠALTINIAI — DVI RŪŠYS
```
AV        Avesa, TIKRAS FIZINIS sandėlis     likutis RANKINIS · PIRMENYBĖ
─────────────────────────────────────────────────────────────────────────
VF        Vetfarmas                          dropship · automatinis XML likutis
ZB        Žalioji Banga                      dropship · automatinis XML likutis
QUATTRO   Kauno grūdai                       dropship · likutis RANKINIS
PRINS     Prins Petfoods                     dropship · likutis RANKINIS
AMBROSIA                                     dropship · likutis RANKINIS
BELACOR   Belacor / Tofu                     dropship · likutis RANKINIS
```

**🔴 „LEGACY" NĖRA SANDĖLIS.** Tai istorinė etiketė, apjungusi PENKIS nesusijusius
dalykus: 4 dropship tiekėjus + AV. Reiškė „ne per XML importuotas" — tai apie KILMĘ,
ne apie sandėlį. **Iš naujos logikos žodis „Legacy" DINGSTA.**
Quattro / Prins / Ambrosia / Belacor elgiasi kaip VF ir ZB — dropship, BE pirmenybės.

**Keturių rankinių tiekėjų tikslumas ~70–80%** (Raimis: „situaciją dėkam ir
kontroliuojam, nėra kad bet ką parašėme ir pamiršome"). **NEDARYTI iš to problemos** —
jokių papildomų „nepatikimumo" žymėjimų, jokio REVIEW statuso vien dėl šaltinio.

### 17.2 TAISYKLĖ (Raimio žodžiais)
> „VF, ZB prekės važiuoja dropshipingu. Bet jei pasitaiko mix užsakymas ir prekė yra
> iš AV sandėlio, tada pirmenybė AV; jei tik VF ar ZB, tada tik iš ten."

```
EILUTEI:   AV turi VISĄ kiekį  →  AV
           kitaip              →  tas dropship tiekėjas, kuriam prekė priklauso

UŽSAKYMAS: grupuojamas pagal šaltinį → TIEK SIUNTŲ, KIEK GRUPIŲ
```
Sprendimas priimamas **EILUTEI, ne užsakymui.** Užsakymas tik parodo, kiek siuntų išeina.

**Pavyzdys (Raimio):**
```
tik Josera Lamb 10 kg              → VF
Josera Lamb 10 kg + žaislas (AV)   → Josera iš AV (nes AV turi)
```

### 17.3 SPRENDIMAI, KURIE UŽDARO KLAUSIMUS
```
DVI SIUNTOS         PRIIMTINA. „Stengiuosi, kad tokių būtų minimaliai, bet pasitaiko."
                    NE gedimas, kurio reikia vengti bet kokia kaina.
KAINOS              VIENODOS nepriklausomai nuo šaltinio → kainodaros klausimo NĖRA
PREKĖS DYDIS        taisyklės NEKEIČIA. 1,5 kg pakuotė ir 10 kg maišas — tas pats
                    principas (Raimis pats prie to priėjo)
AV DALINIS KIEKIS   AV turi 1, klientas perka 3 → visi 3 iš tiekėjo
                    (AV likutis lieka gulėti; Raimis retkarčiais RANKOMIS išsiunčia —
                    „daugiau išimtys nei taisyklė")
AV LIKUČIO MAŽINIMAS  AUTOMATIŠKAI, kai užsakymas pažymimas išsiųstu (variantas A)
```

### 17.4 🔴 KLIENTUI LIKUTIS NERODOMAS
> „Klientui likučio išvis nereikia rodyti, principas arba prekė yra arba nėra,
> o kai jis renkasi, jis negali paimti minusinio likučio."

```
RODOMA:      „yra" jei BENT VIENAS šaltinis turi · „nėra" jei visi nuliai
NERODOMA:    joks skaičius
RIBOJAMA:    negali įsidėti daugiau nei BENDRAS kiekis (AV + tiekėjas)
```
**Pasekmė:** likučių SUMAVIMO RODYMUI NEREIKIA. Sumavimas lieka TIK pardavimo ribai
ir šaltinio parinkimui. Tai gerokai supaprastina TŽ 0.12 numatytą „daugiašaltinio
likučio sumavimo logiką".

### 17.5 ~~SITUACIJA A~~ — MANO KLAIDA, IŠTAISYTA 2026-08-05
**Buvau parašęs:** „A = dėžė vs vienetas, du skirtingi produktai, problemos nėra."
**NETIESA.** Prielaidą apie dėžes išsigalvojau — Raimis apie jas nekalbėjo.

**Raimio faktas:** *„dažniausiai ir perku po 1 ir parduodu po 1. Kad pirkti dėžę ir
paskui pardavinėti, tai beveik nebūna."*

→ **A ir B yra TAS PATS ATVEJIS.** Tas pats vienetas, du kodai. Jokio prieštaravimo
TŽ 0.12 nėra. Konsultantas teisus: **viena WooCommerce prekė, keli tiekimo šaltiniai.**

### 17.6 LAUKŲ SPRENDIMAS
```
_own_stock_qty     AV likutis, ATSKIRAS laukas (variantas A)
```
**Kodėl ne WooCommerce `_stock`:** VF/ZB sinchronizacija `_stock` PERRAŠO kas valandą.
Atskiras laukas nesikerta su sync. Struktūra TŽ jau numatyta (0.12), bet realiai
nenaudojama — užpildyta tik 6 prekėms, visos = 0.

### 17.7 ĮGYVENDINIMO EILĖ
```
1. MATAVIMAS         kiek prekių kiekvienam iš 7 · _own_stock_qty būklė
                     · manage_stock · ar resolve() grąžina 4 tiekėjus ATSKIRAI
2. LIKUČIO LAUKAS    _own_stock_qty įvedimas + admin laukas prekės lange
3. PARDAVIMO RIBA    negali pirkti daugiau nei AV + tiekėjas
4. ŠALTINIO PARINKIMAS eilutei, po checkout
5. LIKUČIO MAŽINIMAS automatiškai išsiuntus
6. UŽSAKYMO GRUPAVIMAS MAIN / DS / MIXED
7. PAKUOTOJO EKRANAS stulpeliai · filtrai · „ką daryti"
```

### 17.8 ⚠️ RIZIKA ESAMAM KODUI
`Petshop_Fulfillment_Source::resolve()` (S75) dabar grąžina `legacy` kaip VIENĄ šaltinį.
Jį reikės išskaidyti į 5 (AV + 4 tiekėjai). **Bet juo remiasi TRYS veikiantys dalykai:**
```
S77  krepšelio cross-sell        „tik to paties sandėlio"
S77  pristatymo metodų ribojimas carrier / courier_only
S74  FBT kompanionai             „tik to paties sandėlio"
```
**ĮTARIMAS (NEPATIKRINTA):** jei Quattro ir Prins iki šiol buvo vienas `legacy`, jie
galėjo siūlytis vienas kitam per FBT — nors tai DU skirtingi tiekėjai ir DVI siuntos.
Patikrinti matavimo etape.

---

## 18. SANDĖLIŲ MODELIS — KONSULTANTO PATAISOS + FAKTINĖ BŪKLĖ (2026-08-05)

### 18.1 GRUPAVIMAS: SANDĖLIS → VEŽĖJAS → SIUNTA
Konsultantas pasiūlė hierarchiją; **Raimis ištaisė esminę klaidą:**
```
AV    → Venipak ARBA LP Express     ← LP TIK iš AV
VF    → tik Venipak
ZB    → tik Venipak
Quattro / Prins / Ambrosia / Belacor → tik Venipak
```
**LP Express galimas TIK iš AV sandėlio.** Vežėjo pasirinkimas egzistuoja tik AV
siuntoms; visų dropship siuntų vežėjas — Venipak automatiškai.
Bendras surinkimo lapas apima TIK fiziškai AV renkamas prekes.

### 18.2 ŠALTINIS FIKSUOJAMAS UŽSAKYMO EILUTĖJE (konsultanto punktas 3 — PRIIMTA)
`resolve()` NEGALI būti perskaičiuojamas vėliau pagal dabartinius likučius —
šiandien AV, rytoj po likučio pasikeitimo sistema nuspręs VF. **Kiekvienoje
užsakymo eilutėje IŠSAUGOTI:**
```
fulfillment_source · rezervuotas kiekis · tiekėjo SKU · siuntos grupė
```
**Mano santraukos spraga:** aprašiau `resolve()` kaip veiksmą po checkout, bet
NEPASAKIAU, kad rezultatas turi būti ĮRAŠYTAS.

### 18.3 SIUNTOS OBJEKTAS SU SAVO BŪSENA (konsultanto punktas 5 — PRIIMTA)
Vienas užsakymas = kelios siuntos (AV + VF + ZB). Reikia NE tik užsakymo statuso:
```
laukiama · perduota tiekėjui · komplektuojama · išsiųsta
sekimo numeris · pristatyta / klaida
```
**Užsakymas NEGALI būti „įvykdytas", kol neuždarytos VISOS jo siuntos.**

### 18.4 KLIENTO KOMUNIKACIJA (konsultanto punktas 6 — PRIIMTA)
```
vienas PRADINIS pranešimas: „Užsakymas bus pristatytas keliomis siuntomis"
atskiras IŠSIUNTIMO pranešimas KIEKVIENAI realiai siuntai
visi sekimo numeriai matomi užsakymo puslapyje
```
NE du identiški „užsakymas išsiųstas" — klientas manytų gavęs dvigubą užsakymą.

### 18.5 SPAUSDINIMO ŽYMA (konsultanto punktas 7 — PRIIMTA)
Užsakymui reikia žymos: **kada pateko į spausdinimą · kokioje partijoje ·
ar jau atspausdintas pakavimo lapas / lipdukas.**
Kitaip tą patį užsakymą kitą rytą galima surinkti ANTRĄ KARTĄ.

### 18.6 ⚠️ REZERVACIJOS — APIMTIS MAŽINAMA (konsultanto punktas 4 — DALINAI)
Konsultantas siūlo `available = physical − reservations` su atskiru rezervacijų
sluoksniu. **WooCommerce TAI JAU TURI** — neapmokėtiems užsakymams likutis
laikomas nurodytą laiką. Antras sluoksnis = DVI TIESOS VIETOS.
**Sprendimas: naudoti esamą WC mechanizmą, savo rezervacijų NEKURTI.**
Prie dešimčių užsakymų per dieną to pakanka.

### 18.7 🔴 FAKTINĖ BŪKLĖ (s465) — DVIŠALTINIŲ PREKIŲ NĖRA
```
prekių su IR vf, IR zb            0
_active_fulfillment_source        zb 948 · vf 920 · out_of_stock 424
                                  „av" arba „legacy" — NĖ VIENOS
_own_stock_qty                    9 prekės, VISOS = 0
```
**Situacijos A ir B egzistuoja TŽ dokumente, bet NE duomenyse.**
→ Sujungimo įrankio NEREIKIA. Migracijos NEREIKIA.
→ Reikia tik, kad modelis LEISTŲ tokią situaciją, kai ji atsiras.

**EAN dublikatai (26 grupės) — NE dvišaltinės prekės, o DUOMENŲ KLAIDOS:**
```
4011905925713  Šiaurės elnias · Tinginys su virve · Besmegenis
5904760213357  Prisukama pelytė · Vabzdys · Kalėdinė pelytė
3182550702355  Royal Canin 2 kg · Royal Canin 10 kg
000000000000   placeholder
```
Raimis: *„čia prekės migravusios iš senos Petshop, ten viskas rankiniu būdu buvo
vedama, tai gali būti."*
**MANO MATAVIMO KLAIDA:** lentelėje ID kartojosi 2–3×, nes prekė turi tą patį EAN
KELIUOSE laukuose (`_ean` + `_zb_ean`). Realių dublikatų dar mažiau.

### 18.8 🔒 KODŲ MODELIS (Raimis + Claude sutarė)
```
Gamintojo EAN    ant maišo, VIENAS ir tas pats abiejuose sandėliuose
Tiekėjo kodas    VF/ZB vidinis numeris — jų vidaus reikalas
TAVO SKU         vienas, kuriuo prekė vadinama parduotuvėje
```
**PREKĖ VIENA, su VIENU tavo SKU.** Šaltiniai — tos prekės SAVYBĖ, ne atskiros prekės.
```
Josera Mini Lamb 10 kg
   SKU JOS-MINI-10 · EAN 4032254749356
   AV likutis 3        (rankinis)
   VF kodas 12345      likutis 796 (XML)
```
**Kodėl NE dvi prekės:** du puslapiai tam pačiam maišui → Google dublikatas,
klientas mato prekę dukart, statistika skyla, aprašymai taisomi dviese.

### 18.9 MINIMALUS ŽINGSNIS
Šiandien prekė turi VIENĄ tiekėjo kodą (`_vf_sku` ARBA `_zb_ean`).
**Nereikia nieko pertvarkyti — reikia PRIDĖTI `_own_stock_qty`.**
Prekė lieka VF preke su VF kodu, tik papildomai turi AV likutį.
Antro tiekėjo kodo prireiks TIK jei ta pati prekė ateis ir iš ZB — dabar tokių NĖRA.
**Tai vienas naujas laukas, NE architektūros perdarymas.**

---

## 9. LAUKIA RAIMIO SPRENDIMO

| ID | Klausimas | Blokuoja | Terminas |
|---|---|---|---|
| Q6 | Prenumeratos pluginas | F19 | — |
| Q10 | Kurie 20–30 SKU prenumeratai | F19 | — |
| Q-BKP | ✅ **UŽDARYTA 2026-08-03:** B2 bucketas, raktas, kredencialai, Object Lock 14 d. — viskas pastatyta ir įrodyta (§8d) | DOD-08 | — |
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
