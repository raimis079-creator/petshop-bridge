# REGISTRAS.md — petshop.lt · VIENINTELIS BŪKLĖS ŠALTINIS

> **SKAITYTI PIRMĄ. VISADA.** Šis failas atsako į vienintelį klausimą:
> *kas padaryta, kas ne, kieno eilė.*
>
> `STATE.md` nuo šiol yra **ISTORIJA** (kaip padaryta, kokios pamokos, kokie SHA).
> Būklės iš STATE.md NEIMTI — ten sesijų naratyvas, kuris prieštarauja pats sau.
> Jei registras ir STATE.md nesutampa — **galioja REGISTRAS**.

**Atnaujinta:** 2026-08-19 naktis II (feed'ų esybės 117→0; BreadcrumbList ✅) · **⏰ RYTOJ:** patikrinti, kiek `&amp;` grįžo po nakties importo (§8ž) · **Launch:** vidinis 2026-10-01 · sutartinis buferis 2026-10-15

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
| DOD-02 | Kritinių klaidų 0 | 🟡 | 2026-08-19 | **DABAR MATUOJAMA** (`ps_sargas_klaidos`, §8u): 2 fatal per 2,5 d. — (1) atminties limitas `/feed/kaina24/` 08-17, **po feed v2.2.0 pataisos nepasikartojo**; (2) `exec()` — Claude paleidimas, ne sistemos. Realių kritinių klaidų **0** |
| P1-MYISAM | MyISAM → InnoDB migracija | ✅ | 2026-08-17 | **UŽDARYTA.** 177/177 konvertuota, 0 klaidų, 16,4 s. Visa bazė 191 InnoDB. Sargas `petshop-innodb.php` v1.0 neleidžia naujoms gimti MyISAM (§8j) |
| DOD-03 | Aukšto prioriteto klaidų ≤3 | 🟡 | 2026-08-19 | 5 warning parašai / 50 įvykių, visi `Array to string conversion` mūsų moduliuose. Deprecated 10 953 — 85 % iš `postit` plugino (PHP 8.3 nesuderinamumas) |
| DOD-04 | 20 testinių užsakymų | 🟡 | 2026-08-04 | **20/20 sukurta, 0 klaidų** (§13). Po patikros IŠTRINTI Raimio nurodymu. Programinis kelias — checkout/pristatymo atrinkimas NEPATIKRINTAS |
| DOD-05 | 2 stabilūs pristatymo būdai | ✅ | 2026-06-01 | Venipak + LP Express live |
| DOD-06 | Paysera + bankinis | ✅ | 2026-06-01 | — |
| DOD-07 | Top-100 SEO 301 | ✅ | 2026-08-04 | 937 keliai · 5 863 clicks · 6 sluoksniai (§12). GSC padengimas: 68,5% srauto veikia arba nukreipta; 4 037 clicks = turinio nebėra (teisingas 404) |
| DOD-08 | Backup restore testas | ✅ | 2026-08-04 | Pilna grandinė įrodyta: skriptas (§8f) · cron 0 4 * * * · gedimo pranešimai · **atstatymo testas 174/174 (§8g)**. Apribojimas: rtst_ prefiksas, ne švari DB |
| DOD-09 | XML sync 7 d. be klaidų | 🟡 | 2026-08-04 | **Serijos ĮRODYTI NEĮMANOMA** — pmxi_history laiko ~19 įrašų, `_vf_last_sync` perrašomas. Įdiegtas kaupiamasis žurnalas (§13); serija kaupsis. Sąveika su pardavimais — tik po launch |
| DOD-10 | Kainodara testuota 20 produktų | ✅ | 2026-07-30 | **UŽDARYTA AUDITU, stipresniu už 20 imtį:** 1 050 prekių su savikaina · 0 neigiamų maržų · 0 žemiau 20% · tipinė ~45%. Formulės atitikties NETIKRINTI (§14) |
| DOD-11 | Manual override 5 produktais | 🟡 | 2026-08-03 | 2 iš 5 (14824, 33249 per R5) |
| DOD-12 | Savininkas apdoroja užsakymą be programuotojo | 🟡 | 2026-08-04 | Techninė pusė patikrinta (§14). Rankinis kelias — TIK Raimis, kontrolinis lapas `DOD12_kontrolinis_lapas.md` |
| DOD-13 | Post-launch monitoringas | 🟡 | 2026-08-19 | **PHP klaidų sekimas ✅ VEIKIA** — `petshop-sargas.php` v1.2 (15 389 B), lentelė `ps_sargas_klaidos` rašo iki šiol, cron sargas 59/59 be vėlavimo (§8u). **Trūksta tik išorinio uptime** — UptimeRobot, savininko pusė |
| DOD-14 | Mail-Tester ≥8/10 | ✅ | 2026-07-30 | 8,5/10 |
| DOD-15 | GDPR atitiktis | ✅ | 2026-07-10 | Complianz v7.5.0 + 8 legal psl. |
| DOD-16 | VMI sąskaitos su realia transakcija | ✅ | 2026-06 | AVPN/IAPV testuota |
| DOD-17 | Beta testas 5–10 klientų | 🔴 | — | nepradėta |
| DOD-18 | DNS planas + sena platforma | 🟡 | 2026-08-17 | **PLANAS PARAŠYTAS** (`dokumentai/DOD-18_perjungimas.md`). Naktinis, su patikromis. Sena platforma IŠJUNGIAMA (ne read-only). Blokuoja F-PSR |
| DOD-19 | Rollback planas | ✅ | 2026-08-19 | **v2.2.** v2.1 buvo ✅ su dviem 🔴 §8 punktais; abu uždaryti tą pačią naktį: (1) **priežiūros režimo jungiklis ĮDIEGTAS** — `petshop-prieziura.php` v1.0.1, vėliava failu `uploads/ps-prieziura.flag`, 503+Retry-After, `wc-api` ir REST praleidžiami (§8y); (2) **atstatymo apribojimai IŠMATUOTI** — DB kūrimo teisės nėra (patvirtinta empiriškai), bazės koduotė **latin1** (buvo „nepatikrinta"). Liko vienas savininko veiksmas DirectAdmin'e |
| DOD-20 | Savaitinis stabilumas ≥99% | 🟡 | 2026-08-19 | **Laikrodis paleistas 2026-08-17 19:23.** Praėjo 2,5 d. iš 7 → serija užsidaro **2026-08-24**. Kol kas: 0 vėluojančių cron, frontas 200, 0 fatal po 08-18 |
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
| F-PSR | Paysera pilnas mokėjimo ciklas (redirect → callback → `processing`) | 🟡 | 2026-08-19 | **IŠMATUOTA (§8v).** Konfigūracija PILNA: projektas 29276, slaptažodis 32 simb., gateway įjungtas, EUR. Užsakymas sukuriamas prieš nukreipimą (35003, 2,21 €, `pending`, „Mokėjimas internetu") — grandinė iki Paysera VEIKIA. Testas iš `dev.avesa.lt` **neįmanomas**: Paysera projekte adresai įrašyti fiksuotai, grąžina `bad_referer` (0x13). Savininko sprendimas: netestuoti, **tikrinti perjungimo naktį** pagal §8v procedūrą |

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
| R4 | Monitoringo nėra | 🟡 | PHP klaidų sekimas veikia; lieka išorinis uptime (§8u) |
| R5 | 5 publish prekės be kainos | ✅ 2026-08-03 | 2 kainos pagal medianą (16,49 / 18,99, `_manual_price_override`), 3 į draft. publish be kainos 5→0. `s364.json` |
| R6 | F19 prenumerata nepradėta | 🔴 | = F19 |
| R7 | 1022 draft prekės | ⏸ | publish / trinti / palikti — Raimio |

---

## 7. SEO MIGRACIJA

Padaryta ~70–80%: GSC eksportas (2445 URL), top-100 auditas, redirect probe, 33/36 blog straipsnių, 2 veikiantys 301 snippetai.

**Rizika:** top-100 dengia 79,2% srauto. Prieš dev: 56 URL = 200, **44 URL = 404 → 20,5% viso srauto neuždengta.**

Trys tipai: (1) kategorijos, kurių dev'e nėra — **ar jos apskritai bus, Raimio sprendimas**; (2) seni kategorijų URL su ID uodegomis — grynas 301; (3) prekės — EAN/SKU match.

Trūksta 3 blog straipsnių. Galutinis 301 failas generuojamas T-14/T-3, kai katalogas užšaldytas. **Nepradėti be Raimio.**

**2026-08-18 papildyta — on-page SEO sluoksnis pastatytas (§8o):**

| Sluoksnis | Būklė |
|---|---|
| SEO pluginas | ✅ Rank Math v1.0.276, nemokama, 3 moduliai |
| Prekių title | ✅ 2 607/2 607 iš šablono |
| Prekių meta aprašymai | ✅ 2 607/2 607 (45 % optimalaus ilgio, 14 % per trumpi) |
| Sitemap | ✅ 5 failai, kategorijos + gamintojai įtraukti |
| Kategorijų aprašymai | ✅ 56 (5 hub'ai turi įvadą viršuje; 19 sąmoningai be teksto) |
| Kategorijų meta | ✅ 56, savi — seni iš petshop.lt NEKELTI (§8p) |
| Aprašymo vieta puslapyje | ✅ po prekių tinklelio, su išskleidimu (mu-plugin v1.1.0) |
| Pradinio psl. title | 🔴 „Pagrindinis (test)" |
| og:image | 🔴 nėra numatytojo |

**PATAISYTA 2026-08-18 (vakaras):** sesijos metu buvo kartojama, kad „GSC
eksportas blokuoja" — tai **klaidinga**. Eksportas padarytas 2026-07-30:
**2 445 URL / 19 735 paspaudimai** (§12). Teiginys atėjo iš TŽ MASTER teksto,
kuris buvo teisingas liepą ir nuo tada pasenęs.

**Vadinasi kategorijų P1 galima perskaičiuoti DABAR** — sujungiant §12 GSC
duomenis su 55 senomis kategorijomis. Raimio laukti nereikia.

✅ **PRIEŠTARAVIMAS IŠSPRĘSTAS 2026-08-18 (§8r):** išmatuota, ne perrašyta.
**Abu buvo netikslūs.** §7 skaičius per mažas; §12 išvada „950 likusių — 404
teisingas" neatlaikė: tarp jų buvo kategorijų ir brendų, kurie egzistuoja.
Po taisymų senų adresų srauto danga **78 % → 95 %**.

---

## 8. PRE-LAUNCH OPERACIJOS

| ID | Operacija | Būsena |
|---|---|---|
| OPS-01 | Site URL/Home → `https://petshop.lt` (**būtinai https**) | 🔴 |
| OPS-02 | **12 cron užduočių** serveriai.lt — patikslinta 2026-08-04 (žr. §8e) | 🔴 |
| OPS-03 | `woocommerce_email_header_image` · `wcdn_settings` · `cmplz_preloaded_privacy_info` | 🔴 |
| OPS-04 | AVPN/IAPV serijos reset į 101 | 🔴 |
| OPS-05 | Testinių užsakymų trynimas | 🔴 |
| OPS-06 | Feed URL resubmit (Kaina24, Kainos.lt, Google) | 🟡 **variklis veikia** (petshop-feeds v2.1.0, §8n). Lieka: paduoti `https://petshop.lt/feed/...` po perjungimo |
| OPS-07 | „Discourage search engines" išjungti | 🔴 (= DOD-22) |
| OPS-08 | Sender tracking CNAME | 🟡 |
| OPS-09 | Complianz Website Scan + slapukų sąrašas · enhanced conversions | 🟡 |
| OPS-10 | Flatsome social nuorodos (dabar placeholder'iai `http://url`) | 🔴 laukia Raimio nuorodų |
| OPS-11 | TEMP snippetų trynimas WP admin (REST DELETE neveikia) | 🔴 higiena: 2136–2139, 2141–2160 |
| OPS-13 | **Priežiūros režimas** — įdiegtas ir patikrintas (§8y). Naudojimas: sukurti/ištrinti `uploads/ps-prieziura.flag` | ✅ 2026-08-19 |
| OPS-14 | **Tilto adresas** — workflow'e `WP_URL` secret. Perjungus nustatyti `https://petshop.lt` | 🟡 paruošta |
| OPS-15 | **27 aktyvūs pluginai** vs TŽ §11.4 riba ≤25 — peržiūrėti | 🔴 |
| OPS-16 | **robots.txt po perjungimo** — virtualus, keisis savaime (§8z). Po T-0 patikrinti 1 min. | 🟡 patikra |
| OPS-17 | **NF1–NF4 greičio matavimas** — įmanomas TIK po perjungimo (dev sertifikatas negalioja, §8z) | ⏸ po T-0 |
| OPS-12 | `gaj6_umbrella_redirects` — kilmė patvirtinta, IŠTRINTA 2026-08-04 (§13). Lentelių 174→173 | ✅ |

**DNS — IŠTAISYTA 2026-08-17 (išmatuota, ne prielaida):** zoną valdo
`ns1–ns4.serveriai.lt`. Ankstesnis įrašas „DNS valdomas iv.lt" NETIKSLUS —
iv.lt greičiausiai registratorius. **A įrašą keičiam SAVO DirectAdmin'e**,
be trečios šalies. Žr. §8l.

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

### P1 MyISAM → InnoDB — UŽDARYTA 2026-08-17 (žr. §8j)
```
Buvo: 160/174 (matuota 08-03) → 177/191 (matuota 08-17).
Dabar: 191 lentelė InnoDB, MyISAM 0.
Planuota eiga „konvertuoti klone" NEĮVYKDYTA IR NEBUVO ĮMANOMA:
WP vartotojas turi GRANT ALL tik gyvunai2_nbpe1.* — naujos DB kurti negali.
Atsitraukimo kelias vietoj klono: automatinis backup į B2 (§8f), paskutinė
kopija prieš darbą 08-17 01:00, sargas patvirtino OK.
Rezultatas: DB backupas nuo šiol yra nuoseklus InnoDB snapshotas BE
svetainės stabdymo — pagrindinis §8c argumentas įvykdytas.
```

---

## 8j. MyISAM → InnoDB — ĮVYKDYTA (2026-08-17) [S902–S912]

```
PRIEŠ   177 MyISAM · 14 InnoDB · 156,4 MB MyISAM
PO      191 InnoDB · MyISAM 0 · 314,3 MB (~2×, laisva 35 GB)
Trukmė  16,4 s trimis paketais · klaidų 0 · neatsivertusių 0
```

**Kodėl nebuvo blokerių** (išmatuota S905, ne prielaida):
```
FULLTEXT indeksų MyISAM lentelėse   0
indeksų virš 3072 B                 0
koduotės                            visos utf8mb4
MariaDB 10.6.17 · innodb_file_per_table=1 · buffer_pool 4 GB
```

**Paketai:** bak+ps+woo 75 (2,8 s) · as+kita 90 (8,7 s) · wp_core 12 (4,9 s).
Kiekvienai lentelei `COUNT(*)` prieš → ALTER → variklio patikra → `COUNT(*)` po.

**Nepriklausoma patikra:** 177 lentelių eilutės prieš/po — 8 skirtumai, VISI
į didėjimo pusę. Septyni akivaizdūs (sesijos, ActionScheduler, snippetai).
Aštuntas — `options` +395 — nenurašytas į „cache", o pamatuotas: 711 iš 1 677
yra transient'ai, realių nustatymų 966.

**Kontroliniai skaičiai sutapo su nepriklausomais šaltiniais:** prekyboje
2 615 · juodraščiai 1 134 (savininko ekrano kopija) · feeding_rows 5 549 ·
ps_pets 69 (§8g atstatymo testo skaičiai) · lietuviškos raidės išliko ·
ROLLBACK veikia (MyISAM to nemokėjo).

**Vizuali regresija:** parduotuvė, katalogas, užsakymai, WP prekių sąrašas —
200, JS klaidų 0.

### ŠAKNIS — `default_storage_engine=MyISAM`

Serverio nustatymas, mums nepasiekiamas. **Be jo konversija būtų vienkartinis
valymas** — kiekviena nauja lentelė gimtų MyISAM ir po kelių mėnesių viskas
grįžtų.

`petshop-innodb.php` v1.0 (mu-plugin, 2 126 B): `query` filtras pagauna TIK
`CREATE TABLE` ir prideda `ENGINE=InnoDB`. Išimtys: `... LIKE ...`,
jau nurodytas `ENGINE=`, `CREATE INDEX`, `TEMPORARY`.

**Kaina išmatuota:** užklausų puslapiui 70 → 70 (nulis pridėtų) · titulinis
1 777 → 1 672 ms (skirtumas triukšme). Atmestas `SET SESSION` variantas —
jis būtų kainavęs po vieną DB užklausą kiekvienam puslapio atidarymui.

**Patikra:** `CREATE TABLE` be ENGINE → InnoDB ✅ · `dbDelta` → InnoDB ✅.

> **LAIKINA APEITIS.** Q-ENGINE: paklausti serveriai.lt, ar keis
> `default_storage_engine` paskyros lygmeniu. Pakeitus — `petshop-innodb.php`
> galima tiesiog ištrinti.

### RADINYS ŠALIA — mu-plugins svoris kliento pusėje

52 failai, 1 746 KB, kraunasi VISADA, ir kliento puslapyje. Tarp jų
`petshop-katalogas.php` 433 KB, `petshop-desk.php` 112 KB,
`petshop-gavimas.php` 95 KB, `petshop-akcijos.php` 94 KB — administravimo
įrankiai, kurių pirkėjas nemato. **Kaina NEIŠMATUOTA** (OPcache didžiąją
parsinimo dalį panaikina). Kandidatas atskiram darbui: pirma matavimas,
paskui išvada apie `is_admin()` sąlygą.

---

## 8k. SANDĖLIŲ MODELIS — 2026-08-17 RADINIAI [S920–S970]

### §29 fulfillment — audito prielaida buvo klaidinga
```
palygintos VISOS 3 749 prekės: resolve() vs _ps_sandelis
sutampa 3 732 (99,5 %) · nesutampa 17
iš 17 resolveris TEISUS 12 kartų — klaidingas dažniau _ps_sandelis
```
Auditas siūlė perjungti resolverį skaityti `_ps_sandelis`. **Tai būtų
regresija**: 6 iš nesutapimų yra rinkinių laukai (`_ps_laukas=yes`), kuriems
`_ps_sandelis=vf` yra klaida, o resolveris atsako teisingai.
Iš 12 §29 punktų nuo resolverio priklauso 3 (2, 3, 12).
Pilnai: `dokumentai/petshop_fulfillment_tyrimas_2026-08-17.md`.

**Neuždaryta:** 34909 FLEXI publish be `_ps_sandelis` ir be registro įrašo
(+4 tokios) — naujos prekės į `ps_sources` nepatenka. `ps_sources` 6 įrašai
su `source='VF'` DIDŽIOSIOMIS.

### Paslėpta prekė rinkinyje — VEIKIA (empiriškai, S930–S934)
```
publish + hidden  → MnM priima, į krepšelį PAVYKO, klaidų 0
draft             → NEVEIKTŲ (MnM tikrina tik statusą)
priedas: MnM paslėptai prekei NEGENERUOJA nuorodos į jos puslapį
```
`WC_MNM_Child_Item::is_visible()` tikrina TIK `post_status`, katalogo
matomumas jam nerūpi. Testinės prekės sukurtos ir ištrintos, liko 0.

### Dvigubų šaltinių NĖRA, bet 27 prekės ne ten, kur turėtų
```
ps_sources: 3 828 eilutės / 3 828 prekės — po vieną kiekvienai
prekių su 2+ šaltiniais: 0 · _own_stock_qty>0: 0
```
Bet pjūvis **pagal pavadinimą** (savininko nurodymu) parodė:
```
27 Josera/JosiDog/Exclusion/GreenPetFood prekės su _ps_sandelis=av
nė viena neturi _vf_cost · 11 turi VF formato SKU
realūs likučiai: Intestinal 18/39/41 vnt., konservai 17–32
4 PUBLISH su likučiu 0 (18563, 18569, 18608, 18623) — VF tuo metu turi
```

### Kodėl jos ten — NE BANAS, o nesuporavimas
`block_vf_create()` v1.5.16 (S100) modelis: Legacy duoda pavadinimą,
aprašymą ir **pardavimo kainą**; VF duoda savikainą + `_vf_qty`.
Match raktas: VF `sku_id` ↔ Legacy `_vf_supplier_sku`.
```
prekių su _vf_supplier_sku   1 163   (visos ir su _vf_qty)
tų 27 suporuota                  0
tų 27 _manual_price_override     0   ← apsaugos NĖRA
```
**Modelis veikia — 1 163 prekės tai įrodo.** Tos 27 stovi už suporavimo
slenksčio: SKU teisingas, bet `_sku` lauke, ne `_vf_supplier_sku`.

> **ĮSPĖJIMAS:** nuėmus `block_vf_create` grįžtų 78 dublikatai per importą
> tiems 1 163, o šios 27 vis tiek liktų nesuporuotos. Problema ne bane.

### Neuždaryta — rytdienai
```
Q-VF-XML   ar tie 27 SKU ŠIANDIEN yra VF XML sraute
Q-VF-KAINA ar VF update rašo į kainos laukus — KOMENTARAS sako „ne",
           kodas NEPERSKAITYTAS (tiltas lūžo 4-tą kartą)
Q-EXPORT   savininko eksportas iš gyvosios petshop.lt — įrodymas, ar
           18/39/41 vnt. realiai lentynoje. Apimtis TIK AV prekėms;
           tikrasis perkėlimas T-3, kai katalogas užšaldytas
```

### Savikainos spraga (negrįžtama)
`_ps_savikaina_vnt` minimas tik `petshop-statistika.php` ir tik kaip
konstanta. Fiksavimo pagal eilutės `_ps_source` NĖRA. Šiandien nekliudo
(dvigubų 0), bet atsiradus pirmai dvigubai prekei praėjusio mėnesio pelno
nebeperskaičiuosi.

---

## 8l. PERJUNGIMAS IR MONITORINGAS — 2026-08-17 (naktis) [S713–S720]

### DNS išmatuotas
```
šis serveris          79.98.29.24
petshop.lt A          213.226.161.16  IR  213.226.161.15   ← DU įrašai!
www.petshop.lt        CNAME → petshop.lt
A TTL 3600 · NS TTL 86400 · NS: ns1–ns4.serveriai.lt
MX isopas.serveriai.lt · SPF jau su spf.serveriai.lt + sendersrv.com
eShoprent: HTTP 200, nginx/1.22.1, gyva
```
**Du radiniai:** (1) zoną valdo serveriai.lt, ne iv.lt — A įrašą keiti pats;
(2) A įrašų DU, pakeitus vieną dalis srauto liktų sename serveryje.

### DOD-13 UŽDARYTAS — `petshop-sargas.php` v1.2
```
klaidų gaudymas + cron sargas · lentelė ps_sargas_klaidos (InnoDB)
cron'ai atrandami AUTOMATIŠKAI (50), vardai nehardkodinti
laiškai HTML su <pre> — Outlook plain-text laužo lygiavimą
48 val. malonės laikas · pavojus tik „įrodytiems" cron'ams
gavėjas terra@gyvunai.lt (ps_sargas_pastas)
```
**DOD-20 septynių dienų laikrodis paleistas 2026-08-17.**
Uptime lieka savininkui — UptimeRobot, išorinis, su SMS.
**Šalutinis produktas:** `ps_sargas_klaidos` gali uždaryti ir `klaidos.md`
poreikį (DOD-02/03) — patikrinti.

### Q-R7 juodraščiai — ATSAKYMAS KITOKS, NEI ATRODĖ
```
juodraščių 1 140 · su likučiu 547 · per 7 d. nauji 99
_vf_supplier_sku 184 · _zb_supplier_sku 486  →  670 UŽSTOJA IMPORTĄ
```
`block_vf_create` tikrina `post_status != 'trash'`, ne `= 'publish'` —
juodraštis su tiekėjo SKU importui atrodo kaip suporuota prekė.
Sąraše: `JOS0398`, `JOS0439`, `NGCSB03`, `NGCST03` — **naujosios Josera ir
Exclusion pakuotės**, tos pačios, kurių VF sraute yra.
Priežastys: `konservas_below_minimum` 313 · `qty_zero` 104 · trūksta
nuotraukos/aprašymo 39.
**Tai ne valymo, o įėjimo taisyklių klausimas — tas pats kaip Q-VF-KAT.
Sprendimas prekybinis; savininkas nurodė prie prekių nelįsti.**

### F-PSR TAPO KRITINIU KELIU
DOD-18 §4.4/16 žingsnis būtų PIRMAS Paysera ciklo bandymas — 03:00, be
palaikymo. **Perjungimo datos negalima fiksuoti, kol F-PSR neuždarytas.**

---

## 8m. Q-MERCH: GOOGLE ZVALGYBA IR GTIN SKOLA — 2026-08-17/18 (naktis) [S971–S986]

### Piltuvelis (savininko klausimas apie testinius rinkinius — NEKLIUDO)
```
publish                     2 609
– paslėptos (hidden)            5
– rinkiniai (mix-and-match)     8
= FEED'O KANDIDATAI         2 596
```
Rinkiniai atsijoja savaime, nes į feed'ą jie pagal seną sprendimą neina.

### 🔴 KAINA24 IR KAINOS.LT FEED'AI YRA NEGYVI
```
/feed/kaina24 · /feed/kainos → Fatal: memory 268435456 exhausted
priežastis: petshop-feeds v1.0.0 → posts_per_page=-1 + wc_get_product() visoms
memory_limit 256M · WP_MEMORY_LIMIT 40M
```
**OPS-06 prielaida buvo klaidinga** — resubmitinti nėra ko. Tas pats kodas jau
filtruoja `instock`, tad savininko sprendimas (be likučio nesiųsti) sutampa.

### GTIN skola ir jos šaknis
```
PRIEŠ: _global_unique_id užpildyta 1 252 · galioja tik 394 (31 %)
VF XML <barcode>: 2 326 reikšmės, VISOS lygiai 12 simbolių, galioja 0
```
**Šaknis — tiekėjo pusėje.** Vetfarmas siunčia nukirstą EAN-13 (be kontrolinio
skaitmens). ZB pusė švari (97 % galioja). Atkūrimas galimas: kontrolinis
skaitmuo skaičiuojamas iš pirmųjų dvylikos (GS1 mod-10).

### Taisymas atliktas (S977–S978)
```
pakeista            1 963 prekės, tik laukas _global_unique_id
praleista           46 konfliktinės (41 VF vs Legacy + 5 du geri 13)
patikra             perskaityta iš DB: 1 963 / 1 963 sutampa, 0 nesutapimų
vizualiai           17978 → 4032254785989 · 12452 → 8710255120072 (ekranai repo)
kopija              uploads/ps-backups/gtin_backup_20260817_204552.json (148 KB)
PO: užpildyta 2 021 · galioja 2 015 · VF prekės su 13 zn. 979/979
be jokio kodo lieka 594 (žaislai, aksesuarai)
```

### 🔒 REGRESIJOS ŠAKNIS UŽDARYTA — `class-vf-import.php` v1.5.7
`petshop_xml_vf_create_new()` rašė žalią 12 simbolių barkodą į `_ean` ir
`_global_unique_id` **be `$is_update` apsaugos** → kitas Import #5 būtų
grąžinęs 979 prekes atgal. Pridėtas `petshop_xml_gtin_normalize()`.
```
_vf_barcode paliktas ŽALIAS — suporavimo raktas find_by_ean() užklausoje
idempotencija: 965 iš 979 sutaps su tuo, kas jau lauke
Import #5 mapinimas švarus — rašo tik _vf_* laukus, GTIN jame nėra
```

### Savininko sprendimai (2026-08-18)
```
Q-MERCH-2   feed'as SAVAS (ne GLA pluginas) — vienas variklis, trys išvestys
Q-MERCH-3   prekės be likučio į feed'us NESIUNČIAMOS — paspaudimai mokami
14 konfliktų → variantas 1: VF yra tiesos šaltinis, importas užrašys pats
```

### Google API — prieiga yra, bet uždaryta
```
claude-gtm-manager@prefab-envoy-482617-b4.iam.gserviceaccount.com
token 200 · authinfo 403 — Content API for Shopping neįjungtas (projektas 683712074632)
```
**Reikia savininko:** (1) Google Cloud → įjungti Content API for Shopping;
(2) Merchant Center → Naudotojai → pridėti tą adresą (Skaitytojo teisių užtenka).
Iki tol Merchant Center paskyros būklė nežinoma.

### Neuždaryta
```
feed'o variklis su paketais (dabartinis miršta ties 256M)
Google kategorijų mapinimas — 80 kategorijų, nulis susiejimų
128 prekės be brendo · 46 be aprašymo · 3 be kainos · 1 352 be svorio
4 CATIT prekės su 11 ženklų kodais (19042, 19045, 19048, 19051) — sena skola
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

## 19. SANDĖLIŲ ĮGYVENDINIMAS — 1 SLUOKSNIS BAIGTAS (2026-08-05)

### ✅ AV LIKUČIO LAUKAS
```
mu-plugins/petshop-av-stock.php  v1.1 · 11 412 B · sha bca43eb1fbd92260
```
**Kodėl ATSKIRAS mu-plugin, o ne class-product-cost-metabox.php papildymas:**
tas failas 26 504 B su veikiančia savikainos/maržos/lock logika. Likutis priklauso
ATSARGŲ kortelei, ne kainodaros blokui.

**Kodėl `_own_stock_qty`, o ne WooCommerce `_stock`:** VF/ZB sync `_stock` PERRAŠO
kas valandą. Atskiras laukas nesikerta.

**Ką duoda:**
```
laukas          WooCommerce → Prekė → Atsargos → „AV sandėlio likutis"
stulpelis       prekių sąraše (62 px, centruotas), žalias >0 · raudonas 0 · pilkas —
greitas red.    Quick Edit + reikšmė atsinaujina BE perkrovimo (ajaxSuccess)
rikiavimas      pagal AV
filtras         AV turi (>0) · AV pasibaigė (0) · AV neturi (tuščia)
žurnalas        _own_stock_log: kada · buvo · tapo · kas · priežastis (50 paskutinių)
API             Petshop_AV_Stock::qty() / has() / decrease() / increase()
```

**🔴 TUŠČIAS ≠ NULIS.** Tuščias = „AV šios prekės neturi". Nulis = „AV turėjo, bet
nebeliko". Resolverio `legacy` reiškia „neatpažinta tiekėjui", NE „guli AV" —
**AV priklausymą lemia TIK `_own_stock_qty` reikšmė.**

### TESTAI (s468, s470)
```
increase 5 → 5 · has(3) taip · has(9) ne · decrease 2 → 3
decrease 99 → WP_Error „AV turi 3, prašoma 99"
decrease 0  → WP_Error „Kiekis turi būti teigiamas"
WooCommerce _stock 653 → 653  NEPALIESTAS ✅
žurnalas fiksuoja net vartotoją (bdz487, „rankinis")
```
**Raimio įvestas realus likutis (Josera Sensiplus 12,5 kg, id 17978, av=2) veikia.**

### NULINIŲ VALYMAS
8 prekės turėjo `_own_stock_qty = 0` — likučiai iš TŽ 0.12 recon, niekada nekeisti.
Ištrinta **tik tos, kurios NETURI žurnalo** (= rankomis niekas nelietė): 8 → 0.
Raimio Josera nepaliesta (turi žurnalo įrašą).
**Katalogе dabar VIENA prekė su AV likučiu.**

### MANO KLAIDOS ŠIAME BLOKE
```
1. stulpelio plotis nenurodytas → antraštė „AV" užlipo ant „Kaina"
2. po Quick Edit reikšmė neatsinaujino → atrodė, kad neišsisaugojo
   (realiai DB buvo teisingai)
```
Abi — tikrinau per API, ne akimis. Tas pats šablonas kaip visą savaitę.

### RESOLVERIS — ĮTARIMAS NEPASITVIRTINO
`Petshop_Fulfillment_Source::resolve()` **JAU grąžina visus atskirai:**
```
imtis 300: vf 109 · legacy 98 · zb 70 · belcor_tofu 10 · quattro 6 · ambrosia 4 · prins 3
```
Quattro/Prins/Ambrosia/Belacor NĖRA suplakti į `legacy`. **FBT jų nemaišo.**
Kode parašyta: `legacy -> tikras savas sandelis, carrier=any`.
→ **Išskaidymo NEREIKIA.** Reikia tik papildyti AV logika (2 sluoksnis).

### EILĖ
```
1 ✅ AV likučio laukas
2 ✅ AV kaip šaltinis (§19.2)
3 ✅ pardavimo riba (AV + tiekėjas) (§19.3)
4 ✅ šaltinio fiksavimas užsakymo eilutėje (§19.5)
5 ✅ likučio mažinimas ir grąžinimas (§19.7)
6 ✅ užsakymo grupavimas MAIN/DS/MIXED (§19.8)
7 ✅ pakuotojo ekranas (§19.8)
8 ✅ galiojimo terminai (§19.9)
```

---

### 19.2 ✅ 2 SLUOKSNIS — AV KAIP ŠALTINIS
```
mu-plugins/petshop-av-source.php  v1.1 · 5 762 B · sha a9e6968438ad521b
```
**`class-fulfillment-source.php` NEPALIESTAS.** Nauja klasė jo rezultatą PAPILDO —
tas failas yra vienintelė sandėlio tiesos vieta, ir juo remiasi S77 cross-sell,
S77 pristatymo ribojimas ir S74 FBT.

**API:** `Petshop_AV_Source::resolve($pid,$qty)` · `is_av()` · `group()` ·
`order_type()` · `group_order($order)`

### 🔴 DVI AV RŪŠYS (išmatuota s472 — KEIČIA ANKSTESNĘ PRIELAIDĄ)
```
GRYNAI AV        959 publish · _legacy_source=excel_v2_20260604
                 likutis WooCommerce `_stock` (5, 3, 12, 1 — REALŪS)
                 niekada nebuvo pas tiekėją → sync jų NELIEČIA
                 `_own_stock_qty` NEREIKIA
AV + TIEKĖJAS    Josera tipo · likutis `_own_stock_qty`
                 prekė yra IR pas VF/ZB, IR pas Raimį; `_stock` perrašo sync
```
Mano ankstesnė prielaida „AV priklausymą lemia TIK `_own_stock_qty`" buvo PER SIAURA.
Resolverio `legacy` = grynai AV → verčiam į `av`, `carrier: any`.

### SCENARIJŲ TESTAI (s471, s473)
```
Josera 1 vnt (AV 2)    → av       any      „AV turi 2, reikia 1"
Josera 3 vnt (AV 2)    → vf       venipak  „neužtenka"
grynai AV (legacy)     → av       any      „grynai AV prekė (be tiekėjo)" qty 10

A tik Josera 1     → [av]            MAIN
B Josera 1 + kita  → [av, legacy]    MIXED
C Josera 3 + kita  → [vf, legacy]    MIXED   ← AV iškrito, neužteko
D tik dropship     → [legacy]        DS
```

### VEŽĖJO SAUGIKLIS
`AV_Source::resolve()` grąžina `carrier: venipak` **BET KOKIAM dropship šaltiniui**,
nesvarbu ką sako bazinis resolveris. **LP Express TIK iš AV.**
Patikrinta 600 prekių — blogų 0.

### ✅ RAIMIO KLAUSIMAS: „ar Legacy reikia išskaidyti į Belacor/Prins/Ambrosia/Quattro?"
**JAU PADARYTA** (S75, 2026-06-08). Patikrinta VISOS 2 776 publish prekės:
```
VERDIKTAS: legacy viduje 4 tiekėjų NĖRA · liko: []
quattro 64 · belcor_tofu 62 · prins 23+20 draft · ambrosia 15 · legacy 959
```
Resolveris skiria pagal `_legacy_manufacturer`. **Nieko daryti nereikia.**

### PILNAS ŠALTINIŲ PJŪVIS (visos publish+draft)
```
vf       991 publish + 170 draft
zb       662 publish + 397 draft
legacy   959 publish + 441 draft   ← AV
quattro   64 · belcor_tofu 62 · prins 23+20 · ambrosia 15
legacy publish pjūvis: instock 816 · outofstock 143 · su kaina 959 · be kainos 0
top kategorijos: Žaislai šunims 178 · Skanėstai šunims 116 · Konservai katėms 82
```

---

### 19.3 ✅ 3 SLUOKSNIS — PARDAVIMO RIBA
```
mu-plugins/petshop-av-limit.php  v1.0 · 3 720 B · sha f3008f49a22e65e6
```
WooCommerce ribojo pagal `_stock` = VIENO šaltinio kiekį. Dabar riba = **AV + tiekėjas**.
```
Josera:  DB _stock 653 + DB _own 2  →  WC rodo 655
klientui: „Turime" — BE SKAIČIAUS (§17.4)
```
**Taikoma TIK toms, kurios turi `_own_stock_qty` IR tiekėjo šaltinį.**
Grynai AV ir VF-be-AV prekėms — nieko nekeičia (patikrinta).
`_stock` reikšmė NEKEIČIAMA. Savų rezervacijų NEKURIAMA (§18.6).

**Filtrai:** `woocommerce_product_get_stock_quantity` · `..._get_stock_status` ·
`woocommerce_get_availability_text` · `woocommerce_get_stock_html` (du pastarieji
nuima „(127)" iš kliento matomo teksto).

### 19.4 🔴 INCIDENTAS: `_stock` 653 → 2 (S468 testo pasekmė)
**Rasta:** Josera `_stock` buvo 2, o `_vf_qty` 653. Visos kitos VF prekės rodė
`_stock = _vf_qty` tiksliai — tik Josera iškrito.
```
Priežastis: S468 testo `increase(5)`/`decrease(2)` metu WooCommerce kabliukas
            perrašė `_stock` AV reikšme. Vėliau nulinių valymas ištrynė žurnalą,
            todėl pėdsako neliko.
NE filtro kaltė: save() testas → „prieš 2 → filtruota 4 → po 2" = SAUGU.
```
**ATSTATYTA:** `_stock` 2 → 653, lookup lentelė 2 → 653, `_own_stock_qty` nepaliesta.

**SAUGIKLIS (`apsaugotas_rasymas()`, v1.2):** prieš kiekvieną `_own_stock_qty`
rašymą įsimenamas `_stock`; po rašymo tikrinama ir, jei pasikeitė, GRĄŽINAMA +
`error_log`. Patikrinta: increase/decrease → `_stock` 653 nepakito.
```
petshop-av-stock.php v1.2 · 12 575 B · sha c6cf7e99783591bf
```
**KODĖL SVARBU:** be saugiklio kiekvienas AV likučio keitimas galėjo TYLIAI
sugadinti tiekėjo likutį — prekė rodytųsi turinti 2 vietoj 653, pardavimai
sustotų be jokio pranešimo.

**KAIP RADAU:** palyginau `_stock` su `_vf_qty` VISOSE prekėse. Vienos prekės
tikrinimas to nebūtų parodęs.

---

### 19.5 ✅ 4 SLUOKSNIS — ŠALTINIO FIKSAVIMAS EILUTĖJE
```
mu-plugins/petshop-av-order.php  v1.0 · 4 622 B · sha c271db49416d8995
```
Konsultanto punktas 3. Sprendimas priimamas VIENĄ kartą (payment_complete /
processing / on-hold) ir ĮRAŠOMAS. Vėliau tik SKAITOMAS.
```
EILUTĖJE:  _ps_source · _ps_carrier · _ps_source_qty · _ps_source_at · _ps_source_reason
UŽSAKYME:  _ps_order_type (MAIN|DS|MIXED|REVIEW) · _ps_groups · _ps_shipments · _ps_decided_at
+ automatinė pastaba: „Vykdymas: MIXED — AV 1 vnt · ZB 1 vnt (2 siuntos)"
```

**E2E 5/5 (s478):**
```
A tik AV              → MAIN  1 siunta · av/any
B AV + ZB             → MIXED 2 · av/any + zb/venipak
C Josera 1 + ZB       → MIXED 2 · av/any „AV turi 2, reikia 1"
D Josera 3 + ZB       → MIXED 2 · vf/venipak ×3 „neužtenka" + zb
E tik ZB              → DS    1 · zb/venipak
IDEMPOTENCIJA: antras statuso keitimas NEPERSKAIČIAVO
PO LIKUČIO POKYČIO: AV 2→0, bet eilutė LIKO „av" ✅ ← šio sluoksnio TIKSLAS
```

### 19.6 🔴 RADINYS PENKTAM SLUOKSNIUI: WooCommerce JAU mažina `_stock`
```
woocommerce_payment_complete        → wc_maybe_reduce_stock_levels
woocommerce_order_status_processing → wc_maybe_reduce_stock_levels
```
S478 testo metu Josera `_stock` 653 → 649 (Josera ×1 + ×3 = 4 vnt). **Ne klaida —
normalus WC veikimas.** Atstatyta (s479): `_stock` ir lookup → 653.

**PASEKMĖ 5 SLUOKSNIUI — negalima tiesiog „sumažinti AV":**
```
eilutėms _ps_source = av   → mažinti _own_stock_qty IR SUSTABDYTI WC mažinimą
eilutėms su tiekėju        → palikti WC elgtis kaip įprasta
```
Antraip AV prekei nusirašytų DU kartus (vienetas iš `_own_stock_qty` + vienetas
iš `_stock`), nors fiziškai išėjo vienas.
`woocommerce_can_reduce_order_stock` filtras tuščias, BET veikia VISAM užsakymui,
ne eilutei — reikės tikslesnio kelio.

### ⚠️ MANO TESTŲ ŠALUTINIAI POVEIKIAI (du per vieną dieną)
```
S468  _stock 653 → 2    AV rašymas perrašė _stock  → saugiklis apsaugotas_rasymas()
S478  _stock 653 → 649  WC pats sumažino per processing → atstatyta rankomis
```
**TAISYKLĖ:** po kiekvieno testo, kuris liečia užsakymus ar likučius, PALYGINTI
`_stock` su `_vf_qty`/`_zb_qty` — ne tik tikrinamos prekės, o pjūvį.
Vienos prekės tikrinimas šito neparodo.

---

### 19.7 ✅ 5 SLUOKSNIS — AV NURAŠYMAS BE DUBLIAVIMO
```
mu-plugins/petshop-av-reduce.php  v1.1 · 5 742 B · sha ee0cac53c62d66b5
mu-plugins/petshop-av-order.php   v1.1 · 4 923 B · sha b2adf4764d2fb18e (prioritetas 5)
```

**🔴 KABLIUKŲ EILIŠKUMAS — BŪTINA ŽINOTI:**
```
5   Petshop_AV_Order::fiksuoti        įrašo _ps_source į eilutes
10  wc_maybe_reduce_stock_levels      WooCommerce mažina _stock
15  Petshop_AV_Reduce::mazinti        mažina _own_stock_qty
```
**S480 KLAIDA:** fiksavimas buvo prioritetu 20 → `_ps_source` dar neegzistavo, kai
jo prireikė. NEI WC stabdymas, NEI AV nurašymas nesuveikė. Perkelta į 5.

**KAIP SUSTABDOM WC eilutei:** `woocommerce_order_item_quantity` grąžina 0 toms
eilutėms, kurių `_ps_source = av`. Švariau nei `can_reduce_order_stock`, kuris
veikia VISAM užsakymui.

**TRYS ELGSENOS:**
```
_ps_source=av + turi _own_stock_qty   → mažinam _own_stock_qty, _stock NELIEČIAM
_ps_source=av + grynai AV (null)      → mažinam _stock rankomis (ten likutis gyvena)
tiekėjo eilutės                       → WooCommerce elgiasi kaip įprasta
```

**E2E 6/6 (s482) — mišrus užsakymas Josera(AV) + grynai AV + ZB:**
```
PRIEŠ       Josera stock 653 · AV 2 | grynai AV 8 | ZB 33
PO process  Josera stock 653 · AV 1 | grynai AV 7 | ZB 32
PO cancel   Josera stock 653 · AV 2 | grynai AV 8 | ZB 33   ← viskas grįžo
V1 AV krito 1 ✅ · V2 _stock NEPAKITO ✅ · V3 grynai AV ✅ · V4 ZB ✅
V5 AV grąžinta ✅ · V6 grynai AV grąžinta ✅
```
Grąžinimas: `woocommerce_order_status_cancelled` + `..._refunded`, idempotentiška
per `_ps_av_restored`.

### ⚠️ PHP PAMOKA: rodyklė eilutės interpoliacijoje
```
BLOGAI:  "#$pid AV $av→$rez"     PHP bando → baitus įtraukti į kintamojo vardą
                                  → Warning: Undefined variable $av→
GERAI:   "#{$pid} AV {$av} -> {$rez}"
```

---

### 19.8 ✅ 6+7 SLUOKSNIAI — PAKUOTOJO EKRANAS
```
mu-plugins/petshop-av-admin.php  v1.2 · 7 510 B · sha d6397e214953bd84
```
Užsakymų sąraše (patikrinta EKRANO NUOTRAUKA s487):
```
#34866  MIXED  2 siuntos  AV 1 · VF 1    1 Josera Sensiplu… · 1 Josera SensiPl…
#34865  MIXED  3 siuntos  AV 1 · ZB 1 · VF 2
#34864  DS                ZB 1           1 Monge VetSolut…
#34863  MAIN              AV 2           2 Ontario Monopr…
```
Stulpeliai „Vykdymas" (tipas + siuntos + šaltiniai spalvomis) ir „Prekės" (kiekis +
pavadinimas + spalvotas taškas pagal šaltinį). Filtras pagal tipą. „Origin" nuimtas.

**🔴 KLAIDA v1.0: `remove_all_actions('admin_notices')` NUKIRTO VISĄ PUSLAPĮ.**
WooCommerce HPOS ekranas turinį piešia per TUOS PAČIUS pranešimų kabliukus.
Ekrano nuotrauka parodė baltą lapą — sidebar yra, turinio nėra.
**Pakeista tiksliniu CSS slėpimu.** TAISYKLĖ: `remove_all_actions` admin ekranuose
NENAUDOTI — šalina daugiau, nei matai.

### 19.9 ✅ GALIOJIMO TERMINAI — BE PARTIJŲ APSKAITOS
```
mu-plugins/petshop-av-expiry.php  v1.0 · 8 633 B · sha 4995fa9c8c3670cc
```
**RAIMIO FIZINĖ SISTEMA JAU VEIKIA:** naujesnis galiojimas dedamas į lentynos GALĄ,
imama iš PRIEKIO → teisinga partija išeina savaime. Įrašų tam NEREIKIA.
> „Stengiuosi dedamas naujausio galiojimo sudėti į lentynos galą, kad nesimaišytų.
>  Tik būna niuansų, kai užsakinėji retesnes prekes su galiojimais, tai dedi į vieną
>  dėžę, tada svarbu pakuojant paimti su senesniu galiojimu."

**TODĖL NE PARTIJŲ APSKAITA.** Ji reikalautų suvesti KIEKVIENĄ priėmimą; pamiršus
vieną įrašą visi tolesni skaičiai melagingi — blogiau nei be sistemos.

**VIETOJ TO:**
```
_ps_expiry        galiojimo data — pildoma TIK kai svarbu
_ps_expiry_note   pastaba pakuojant („imti su 09 mėn.") — retoms prekėms vienoje dėžėje
stulpelis         spalvos: >60 d. ramu · ≤60 geltona · ≤30 raudona · <0 raudonas fonas
filtras           Artėja arba pasibaigė · Pasibaigę · Turi datą · Turi pastabą
```
**NIEKO NESUVEDINĖJAM IŠ ANKSTO.** Iš ~960 AV prekių galiojimas svarbus ~300
(konservai 161, skanėstai 116, sausas maistas, papildai). Žaislai (178), dubenėliai
(37), antkakliai, kraikai jo NETURI. Realiai per mėnesį susives keliolika.
**Tuščias laukas = norma, ne spraga.**

Testai: 199 d. skubu=ne · 44 d. taip · 11 d. taip+pastaba · −9 d. taip.
Po testų valyta: prekių su data 0.

---

### 19.10 ✅ SURINKIMO IR PAKAVIMO LAPAI
```
mu-plugins/petshop-av-sheets.php  v1.0 · 10 445 B · sha 237346e8e7418b75
```
Masinis veiksmas „Petshop: surinkimo ir pakavimo lapai" (7-as; esami 6 nepaliesti)
+ vieno užsakymo veiksmas užsakymo lange.

**TRYS BLOKAI (Raimio patvirtinta, s495 ekrano nuotrauka):**
```
SURINKTI IŠ SANDĖLIO   bendri kiekiai · ☐ braukymui · vienas ėjimas
VENIPAK                užsakymai eilėmis
LP EXPRESS / UNISEND   užsakymai eilėmis
```
**KODĖL VENIPAK IR LP ATSKIRAI** (Raimis pakartojo 2×, aš buvau ėmęs siūlyti atgal —
NEBEKELTI): lipdukai formuojami ATSKIRAIS mygtukais → krūvelės atskiros; lapas eina
lygiagrečiai su savo krūvele. Plius LP siuntoms renkamas DYDIS, Venipak — ne.

Į lapus patenka **TIK AV eilutės**. Mišrus užsakymas pažymimas
„dalis siuntos (2 siuntos)" — pakuotojas mato, kad tai ne visas užsakymas.
`_ps_expiry_note` rodoma ABIEJOSE vietose (surinkime ir prie eilutės).
Spausdinant meniu/mygtukai dingsta, Venipak ir LP — atskiruose A4 lapuose.

### 19.11 DAUGIAPAKUOTĖS SIUNTOS — IŠTIRTA, NESTATOMA
Raimis: vienas užsakymas kurjeriu gali būti 4 dėžės = 4 lipdukai. **Tik kurjeriui** —
į paštomatą kiekviena dėžė yra atskira siunta.
```
VENIPAK   RANKINIS: $_POST['packs'] → dispatch_order($ids, $packs, $is_global)
                    grąžina KELIS pack_numbers (po vieną dėžei)
                    nustatymas shopup_venipak_shipping_field_maxpackproducts
                    (kiek prekių telpa į pakuotę — galėtų skaičiuoti automatiškai)
LP        AUTOMATINIS: NAWebCo\BoxPacker\Packer pagal svorį ir matmenis
                    resolve_shipping_size($planCode, $package)
                    ⚠ remiasi weight/width/height/length — be matmenų bus SPĖJIMAS
```
**SPRENDIMAS: NESTATYTI, kol per abu vežėjus nepraeis bent po vieną TIKRĄ siuntą.**
Dabar matomas tik kodas; kaip atrodo reali sąsaja ir ką ji priima — nežinoma.
Tas pats galioja LP DYDŽIO laukui (§19 anksčiau).

Kurjeriui bendro siuntų skaičiaus nurodyti NEREIKIA — Raimis: „kurjeriai siuntas
nusiskenuoja ir pasiima". Manifestas abiejuose pluginuose YRA kaip atsarginis.

---

### 19.12 ✅ DROPSHIP PERDAVIMAS TIEKĖJAMS
```
mu-plugins/petshop-av-dropship.php  v1.1 · 17 935 B · sha d03cbf2128079e65
```
**KAIP BUVO DAROMA RANKOMIS** (Raimio laiškas FW: užsakymas 2026-08-05):
vienas laiškas dienai iš terra@petshop.lt · lentelė Nr · vardas · prekė · kiekis ·
priedai: lipdukai, KIEKVIENAS pavadintas „772 Simas Šimkus.pdf" + manifestas.
> Raimis: „Kiekvieną lipduką išsaugau ranka, dabar pas mus labai daug rankinio darbo."

**TECHNINIS PAGRINDAS (s501) — lipduką GALIMA imti po vieną:**
```
AJAX woocommerce_shopup_venipak_shipping_get_label_pdf → VIENO užsakymo PDF
POST https://go.venipak.lt/ws/print_label  (user, pass, pack_no, format)
pack_numbers = MASYVAS → daugiapakuotės tuo pačiu keliu
lipdukas 283×425 pt = 10×15 cm (Raimio etikečių spausdintuvas), laukas „1 \ 1"
manifestas = „Sender's shipment bill" A4, kurjerio parašui, VIENAS partijai
```
Bendro PDF skaidyti NEREIKIA.

**VEIKIMAS:** masinis veiksmas „Petshop: perduoti tiekėjams" → puslapis su kortele
kiekvienam tiekėjui → lentelė (Nr · klientas · prekė+kodas · kiekis) → mygtukas
su varnelėmis „pridėti lipdukus" / „pridėti manifestą" → wp_mail iš terra@petshop.lt.
Užsakymai žymimi `_ps_dropship_sent` → kitą kartą į sąrašą NEPATENKA.

**🔴 NE AUTOMATINIS SIUNTIMAS.** Laiškas tiekėjui = užsakymas su Raimio pinigais;
klaidingas kiekis paaiškėtų tik atvažiavus siuntai. Sistema paruošia — Raimis tvirtina.

**KODAI:** VF ir Quattro kodai SUTAMPA su mūsų SKU. Prins/Ambrosia/Belacor atsirenka
pagal pavadinimą ir barkodą → jiems rodomas IR EAN.
**ZB:** laiškas NESIUNČIAMAS (reikia vesti į jų sistemą) — rodoma lentelė kopijavimui.

### 🔒 TIEKĖJŲ EL. PAŠTAI (Raimis 2026-08-05, opcija `ps_tiekeju_pastai`)
```
Vetfarmas       ieva.lastovskyte@vetfarmas.lt, karolina.kazlauskaite@vetfarmas.lt
Belacor         lina.sirvele@belacorinvest.lt
Ambrosia        info@alphazoo.lt
Kauno grūdai    e.panaviene@kaunogrudai.lt
Faunas/Prins    irute@faunas.lt
```
Keičiama: WooCommerce → Tiekėjų el. paštai.

### ⚠️ TESTŲ ŠALUTINIS POVEIKIS — KETURIS KARTUS PER SESIJĄ
```
S468  _stock 653 → 2     AV rašymas             → saugiklis apsaugotas_rasymas()
S478  _stock 653 → 649   WC processing          → atstatyta
S499  _stock 648 → 2     užsakymų atšaukimas    → atstatyta
S503  2 prekės nesutapo  testiniai užsakymai    → atstatyta
```
**Saugiklis saugo TIK nuo pirmos priežasties** — nuo WC nurašymo nepadeda, nes ten
WooCommerce elgiasi teisėtai.
**TAISYKLĖ KITAM LANGUI: testuoti su ATSKIRA testine preke, ne su realiomis.**
Po kiekvieno testo su užsakymais — palyginti `_stock` su `_vf_qty` VISOSE prekėse.

---

## 20. ATASKAITŲ STANDARTAS v2 — ĮDIEGTA DEV (2026-08-16)

> Spec: `dokumentai/petshop_ataskaitu_standartas_v2_spec_v1_2.md` · maketai
> `ataskaitu_standartas_v2_maketas.html`, `rinkiniu_ataskaita_maketas.html`
> Sesijos: S813–S838 (`deployment_log_v1_4_5.md`)

**Principas:** kiek uždirbau ir ar auga → kas tai lemia → ką daryti. Ekranai
skaito dienos suvestinę, NIEKADA ne žalius užsakymus.

### Moduliai (visi `mu-plugins`, dev.avesa.lt)

| Failas | Ver. | Būklė |
|---|---|---|
| `petshop-statistika.php` | 2.0 | ✅ schema v2, du sluoksniai, uždarymo meta |
| `petshop-statistika-vitrina.php` | 1.0 | ✅ 9 įvykių tipai, laukai NEKEISTI |
| `petshop-ataskaitu-agregavimas.php` | 1.0 | ✅ cron 03:15 + šiandienos sluoksnis |
| `petshop-ataskaitos-ui.php` | 1.0 | ✅ bendras karkasas visoms ataskaitoms |
| `petshop-rinkiniu-ataskaita.php` | 2.0 | ✅ „Surenkami rinkiniai", 11 sekcijų |
| `petshop-paruostu-ataskaita.php` | 1.0 | 🟡 „Rinkiniai" — veikia, bet be duomenų |
| `petshop-ataskaitu-eksportas.php` | 1.0 | ✅ XLSX atsisiuntimas, keli lapai + žali duomenys |

### DB

- `gaj6_ps_laukai_ivykiai` — schema v2 (+`dydis`, `skirtukas`, `kiek_dezeje`, `irenginys`)
- `gaj6_ps_ataskaitu_dienos` — NAUJA, dienos suvestinė, pinigai CENTAIS
- Naujas uždarymo meta: `_ps_stat_sesija`, `_ps_irenginys`, `_ps_dydis`, `_ps_kaina_atskirai_vnt`

### Excel eksportas

Mygtukas „⬇ Atsisiųsti į Excel" abiejuose languose. Savas XLSX rašytojas per
`ZipArchive` — be PhpSpreadsheet (jis serveryje yra, bet priklauso importo
pluginui). Skaičiai eksportuojami kaip skaičiai, ne tekstas.

Lapai: Suvestinė · Prekės · Rinkiniai · Piltuvėlis · **Žali duomenys**
(pastarasis — visa dienos suvestinė pivot'ams, be apdorojimo).

### Užrakinti sprendimai

- Savikaina fiksuojama PARDAVIMO momentu — praeities marža nesikeičia
- Grąžinimai mažina GRĄŽINIMO dienos skaičius, istorija atgaline data nekinta
- Du sluoksniai: be sutikimo — anoniminiai įvykiai (jokio ID įrenginyje);
  su Complianz statistikos sutikimu — sesija, ir tik tada piltuvėlis/kabliukai
- Sekos metrikos ekranuose žymimos „iš sutikusių su statistika"; pinigai — iš visų
- Ribos (kandidatų, lyderių, kanibalizacijos) — wp options, ne konstantos
- E2 daromas atskiru moduliu; `petshop-laukai.php` (183 KB) nekeičiamas

### 🔴 LIKO

```
1. E6 DoD: dev'e 0 paruoštų rinkinių ir 0 DP pakų → kanibalizacijos
   verdiktai NEPATIKRINTI. Reikia 2 testinių užsakymų — ⏸ RAIMIS
   (savo iniciatyva nekurta: paveiktų likučius ir AVPN serijas)
2. Produkcijai: `ps_stat_pradzia` = launch data
3. Produkcijai: patikrinti cmplz_has_consent('statistics') gyvai
4. Ribų peržiūra, kai susikaups realių duomenų
```

---

## 8n. FEED'Ų VARIKLIS, APRAŠYMAI, SVORIAI — 2026-08-18 [S987–S1002]

### `petshop-feeds` v2.1.0 — trys kanalai iš vieno variklio
```
v1.0.0 mirdavo ties 256M (posts_per_page=-1). v2 — paketai po 200, statiniai failai.
uploads/petshop-feeds/{kaina24,kainos,google}.xml · cron 04:30 · endpointai atiduoda failą
generavimas 15,6 s · atminties pikas 112 MB · 2 232 prekės · XML galioja visuose trijuose
```
**Ištaisyta iš v1.0.0:** kategorija buvo imama `end()` (abėcėlės paskutinė, ne giliausia);
EAN iš `_zb_ean`/`_ean` (dabar kanoninis `_global_unique_id`); rinkiniai nebuvo filtruojami.

**Formatas patikslintas pagal gyvus petshop.lt srautus:** `<ean_code>` = GTIN,
`<model>` = SKU (senasis šablonas EAN rašė į `<model>` ir `ean_code` neturėjo).
Kainos.lt: `<item_price>`, 200×200 miniatiūra, `<categories>`, be `<model>`.

**Prekių ribojimas:** `_ps_feed_off_kaina24|kainos|google` + `_do_not_export`.
Varnelės prekės kortelėje (Atsargos), stulpelis sąraše, 5 masiniai veiksmai.

### Aprašymai: 88 → 0
```
88  pradžia (katalogo eilė „Be aprašymo")
65  po 44 aprašymų įrašymo
32  po ribos 120 → 90 (petshop-pilnumas v1.3, konstanta APRASYMO_MIN)
 0  po likusių 32
```
**⚠️ Riba 120 gyvena dviejose vietose.** Pilnumas (rodiklis) — dabar 90.
**`petshop-vartai.php` — SĄMONINGAI palikta 120**, nes ji sprendžia, kas patenka
į prekybą (VF/ZB be aprašymo → juodraštis). Keisti tik atskiru sprendimu.

**Pamoka:** katalogo skaičius remiasi `_ps_pilnumas_kodai`, ne `post_content`.
Pakeitus duomenį — perskaičiuoti žymą, kitaip ekranas rodo seną tiesą.

### Svoriai: 740 pakeitimų
```
užpildyta 710 · ištaisyta 30 · patikra 740/740
be svorio lieka 998 (žaislai, petnešos, guoliai — pavadinime kiekio nėra)
```
**Rasta migracijos klaidų:** 26 kraikams į `_weight` įrašyti LITRAI
(BeloCat 18 l → 18 kg vietoj 7 kg; TOFU 6 l → 6 vietoj 2,65) — vežėjui
deklaruota dvigubai daugiau. Plius 4 sausi maistai su neteisingu skaičiumi.

**Taisyklė (savininko sprendimas — NETO su išimtimis):**
```
40/70/85 g +8 g · 100 g +20 g · 200–415 g +70 g · 800 g+ +100 g
TOFU kraikas +150 g · sausas maistas neto (12,5 kg lieka 12,5)
skliaustuose kg → imami jie; litrai be skliaustų → neliečiama
```
**NELIESTA sąmoningai:** 216 prekių, kur bazėje jau bruto (Eukanuba 12,220,
Family Dog 15,080) — tikslesnės už neto taisyklę; 8 Churu „4 × 14 g", kur
klydo skaitiklis, ne bazė.

### Prekių ženklai — UŽDARYTA 2026-08-18
```
114 be product_brand:  81 užpildė savininkas · 33 pagal mano pasiūlymus su įrodymu
patikra 114/114 · be ženklo publish liko 27 (visos UŽ feed'o ribų)
```
**Feed'o kandidatuose (2 227): be ženklo 0 · be nei ženklo, nei GTIN 0.**
Vadinasi, nė viena feed'o prekė nebekris Google dėl trūkstamo identifikatoriaus.

**Taksonomijos valymas (savininko pastebėjimai):**
```
Hau&amp;Miau  → Hau&Miau        25 prek.   (HTML esybė)
PET NOVA      → Pet Nova         8 prek.
BEEZTEES      → Beeztees         4 prek.
8IN1          → 8in1            21 prek.
HAPPET        → Happet          50 prek.
GreenPetFood  → Green Petfood   10 perkelta (dublikatas sujungtas)
K9 (0 prekių) → ištrintas
Vetfarmas     → SILICA GEL      (didmenininkas ≠ ženklas, savininko pastaba)
ženklų sistemoje: 122 → 135
```
**⚠️ `wp_update_term` ampersandą UŽKODUOJA atgal** — `Hau&amp;Miau` po pirmo
taisymo grįžo, `D&D Home` gimė sugadintas. Taisyti tik tiesiogine užklausa į
`terms` + `clean_term_cache`. Variklyje paliktas nuolatinis esybių sargas.

**Nuotraukų derlius:** 10 iš 90 (11 %). AV prekės fotografuotos be pakuotės, o
ženklas gyvena pakuotėje. Platus teksto skenavimas (43 ženklai, pilni aprašymai)
davė NULĮ — aprašymai kalba apie prekę, ne apie gamintoją.

**Lieka:** 15 prekių be ženklo grįš į feed'ą, kai atsiras likutis (palutės,
gumuoti pavadžiai, sepija, masažinė pirštinė).

### Google kategorijos — `petshop-feeds` v2.2.0 (2026-08-18)
```
55 mūsų kategorijos susietos su oficialiu Google sąrašu
ID iš taxonomy-with-ids.en-US.txt (parsisiųsta per tiltą), NE iš atminties
savininkas peržiūrėjo ir patvirtino
rezultatas: 2 227 / 2 227 prekių turi <g:google_product_category> (100 %)
```
Nesumapintos sąmoningai: DAUGIAU=PIGIAU, DOVANOS, RINKINIAI, SPRENDIMAI — tai
akcijų skiltys, ne prekių tipai. Variklis tokioms prekėms eina nuo giliausios
kategorijos aukštyn per tėvus, kol randa atitikmenį, todėl jos irgi gauna tikrą
kategoriją.

**Patikrinta atskirai:** senoji petshop.lt Google feed'o NETURI (visi įprasti
adresai 404, `google_product_category` nerasta nė karto). Google kanalas —
naujas, ne migruojamas; nėra ko perkelti, bet nėra ir paveldėtų klaidų.

**Variantinės prekės — problemos NĖRA:** 39 tėvai, kainų skirtumas tarp variantų
1,00× visose (variantai yra spalvos, ne dydžiai). Skaidyti su `item_group_id`
nereikia. Pastaba: nė vienas variantas neturi savo GTIN (SKU jau atskirti).

### 🔴 SEO META — RASTA 2026-08-18, NEUŽDARYTA

```
SEO pluginas         NĖRA nė vieno aktyvaus (Yoast/RankMath/AIOSEO/SEOPress — visi 0)
meta description     puslapiuose NERODOMA niekur
og:title             nėra — nuorodos socialiniuose tinkluose be kortelės
title                yra, bet iš temos: „Pavadinimas – Petshop.lt"
canonical            yra (WordPress savas)
```

**Bet duomenys BAZĖJE YRA** — migracijos metu perkelti, net dviem formatais:
```
_yoast_wpseo_title      1 111 prekių      rank_math_title        1 111
_yoast_wpseo_metadesc   1 075 prekių      rank_math_description  1 075
(iš 2 606 publish — apie 43 %)
```
Nė vienas pluginas neįdiegtas, todėl laukai guli negyvi. Įdiegus pluginą jie
atgytų vienu veiksmu.

**Planas (nepradėta):**
1. Pasirinkti pluginą — duomenys tinka abiem; rekomendacija **Rank Math**
   (lengvesnis, geresnis WooCommerce palaikymas)
2. Patikrinti, ar tie 1 111 tekstų geri — atkeliavo iš senos platformos, gali
   turėti seną domeną, senas kainas ar tuščią šabloną
3. Likusioms ~1 495 — šablonas plugine, ne rankinis rašymas

**Susiję:** `blog_public = 0` (dev uždarytas nuo paieškos) — DoD-22 / OPS-07,
prieš perjungimą būtina įjungti.

### Nauja skola — `Array to string conversion` (ištirta 2026-08-18, PALIKTA STEBĖTI)
```
petshop-xml.php:343,344 (petshop_xml_block_zb_create)
petshop-xml.php:513,515 (petshop_xml_block_vf_create)
per parą 7 įspėjimai (VF eilutė 513 — 4 kartai)
```
**Į bazę NEPATENKA:** 0 meta laukų, 0 terminų, 0 pavadinimų su reikšme „Array".
Kintamasis gyvena tik sargiklio funkcijoje, kuri sprendžia, ar leisti kurti prekę.

**Kur gali kliūti:** VF sargiklyje `if ($sku==='' && $brand==='' && $category==='')`
— jei `brand` tampa „Array" vietoj tuščios eilutės, sąlyga neįvyksta ir prekė eina
į taisyklių tikrinimą, užuot praėjusi pro šalį. Elgsena skiriasi nuo numatytos,
duomenys nesugadinami.

**Sprendimas atidėtas (savininkas 2026-08-18): „palauksime daugiau duomenų".**
Įspėjimas dabar veikia kaip tiekėjo duomenų kokybės indikatorius — sutvarkius kodą
prieš suprantant, KURIE įrašai jį sukelia, signalas dingtų. Kai sargas sukaups
daugiau, tirti, ar tai sistemingas šaltinio brokas.

**Taisymas, kai ateis laikas:** pakeisti tiesioginį `(string)` į pagalbinę funkciją,
kuri masyvą paverčia pirma reikšme; 8 eilutės dviejose funkcijose, logika nesikeičia.

---

## 8o. SEO SLUOKSNIS — RANK MATH IR KATEGORIJŲ DERLIUS — 2026-08-18 (vakaras) [S1003–S1020]

### Kas padaryta

| Darbas | Rezultatas |
|---|---|
| Rank Math diegimas | ✅ v1.0.276, nemokama versija (PRO nereikalinga — GTIN eina per savą feed'ą) |
| Konfigūracija | ✅ moduliai: `sitemap`, `rich-snippet`, `woocommerce`; visa kita išjungta |
| Konfliktas su Redirection | ✅ nėra — RM `redirections` ir `404-monitor` nebuvo įjungti |
| URL struktūra | ✅ užrakinta (`strip_category_base`, `wc_remove_*_base` = off) |
| Sitemap | ✅ 5 failai; kategorijos (58) ir gamintojai (122) įtraukti rankomis |
| Prekių title | ✅ 1 537 `rank_math_title` ištrinta → šablonas visoms 2 607 |
| Prekių aprašymai | ✅ 1 473 palikti + `%excerpt%` grandinė = 100 % danga |
| Esybių nutekėjimas | ✅ mu-plugin filtras, 421 prekė, ateities importai apsaugoti |
| Senų kategorijų derlius | ✅ 55/55, peržiūros xlsx pas savininką |
| Meta šablonai | ✅ `%term_description%` pašalintas iš 3 taksonomijų |

### Sprendimas: B variantas (savininkas)

Iš trijų (A palikti viską / B trinti title / C trinti abu) pasirinktas **B**.
Title yra techninis laukas — šablonas daro geriau; aprašymas yra pardavimo
tekstas — žmogus daro geriau. Atsarga: `_yoast_wpseo_title` 1 537 įrašai
bazėje nepaliesti; kopija `ps-backups/rankmath_title_kopija_20260818_165421.json`.

**Naujoms prekėms nereikia nieko** — VF/ZB importas kuria prekę be
`rank_math_*` laukų, tad šablonas suveikia automatiškai.

### 🔴 BLOKATORIUS: Flatsome išdėstymas

Testas su realiu ~296 žodžių tekstu (S1018):

```
              aprašymas            prekės prasideda   langas
desktop   249 px, 784 aukšt.          1 284 px         1 100
mobile    316 px, 1 500 aukšt.        2 128 px           844
```

Mobiliajame — **2,5 ekrano teksto iki pirmos prekės**. Sename petshop.lt tekstas
buvo apačioje. Masinis įkėlimas be temos pataisos pablogintų konversiją.

Papildomai: **hub'uose `term_description` išvis nerodomas** (landing šablonas
pakeičia archyvą), ir **`wp_update_term` anoniminėje užklausoje nukerpa `h3`/`ul`**
— importas privalo vykti administratoriaus kontekste.

### Turinio strategija (sutarta)

```
grindys visiems        55 senų tekstų migracinis valymas, ne perrašymas
lubos P1               perrašymas Petshop stiliumi, prioritetai IŠ GSC
formatas               B hub'uose (trumpas įvadas viršuje) + A lapinėse (tekstas apačioje)
taisyklė               iki migracijos saugom tai, kas turi paieškos istoriją;
                       po migracijos optimizuojam kontroliuojamais etapais
taisyklė               netinkantis senas tekstas → 2–3 neutralūs sakiniai,
                       ne 700 žodžių palikimas
```

Savininko planas su P1–P4 prioritetais, darbine apimtimi, dalykinėmis pastabomis
ir turinio standartu: `kategoriju_aprasymai_susisteminti_2026-08-18.xlsx`.

### Hub'ų mechanizmas

Snippetas **688 „Petshop Kategorijos Landing v1 (sunims)"** — aktyvus, 12 043 B,
valdo **penkis** hub'us (70 ŠUNIMS, 77 KATĖMS, 87 GRAUŽIKAMS, 89 PAUKŠČIAMS,
93 ŽUVIMS). Įvadai įkoduoti PHP masyve. Pavadinimas ir komentaras pasenę —
pervadinti pagal konvenciją.

### Eilė

```
1. 🔴 Flatsome tema: term_description po prekių tinklelio (+readmore)
2. 🔴 Landing šablonui (688) apatinis term_description blokas
3. 🟡 55 senų tekstų valymas + įkėlimas (admin kontekste)
4. 🟡 48 senų meta aprašymų įkėlimas
5. 🟡 P1 perrašymas — GSC duomenys TURIMI, reikia sujungti su 55 kategorijomis
```

---

## 8p. KATEGORIJŲ SLUOKSNIS UŽDARYTAS — 2026-08-18 (naktis) [S1021–S1038]

### Kas veikia

| Darbas | Rezultatas |
|---|---|
| Aprašymo vieta | ✅ `mu-plugins/petshop-kategorijos-aprasymas.php` v1.1.0 — tekstas po prekių, CSS išskleidimas be JS |
| Hub'ai | ✅ snippet **688 v2** kviečia `Petshop_Kategorijos_Aprasymas::blokas()`; markup vienoje vietoje |
| Puslapių tekstai | ✅ 56/56 įkelti, perskaitymo patikra simbolis į simbolį |
| Meta aprašymai | ✅ 56/56 `termmeta rank_math_description`, patikrinta gyvai `<head>` |
| Seni meta iš petshop.lt | 🔴 **NEKELIAMI** — turi teiginius apie dantų valymą, „geriausią" maistą, „Super Premium klasę" ir brendus |

### Išmatuota: kodėl reikėjo temos pataisos

```
                    prekės prasideda        aprašymas
desktop   buvo          1 284 px            249 px (virš prekių)
          tapo            480 px          2 928 px (po prekių)
mobile    buvo          2 128 px            316 px
          tapo            607 px          5 218 px
```

Mobiliajame buvo **2,5 ekrano teksto iki pirmos prekės**.

### Trys sprendimai, kurie pakeitė planą

**1. „Grindys iš senų tekstų" ATMESTOS.** Dalis senų tekstų dalykiškai klaidingi
(„sausas maistas valo dantis", „hipoalerginis = be grūdų", triušiai kaip
graužikai). Grindimis tapo nauji neutralūs tekstai.

**2. Seni meta NEKELIAMI** dėl to paties — jie kartoja būtent tuos teiginius,
kuriuos išvalėme iš puslapių, ir meta yra matomiausia vieta.

**3. 🔒 VMVT: PAŠARAS TURI BŪTI VISAVERTIS.** Savininko verdiktas. Formuluotė
suvienodinta 7 vietose:

```
buvo: patikrinkite, ar pašaras visavertis, ar papildomas
tapo: patikrinkite, ar pašaras visavertis – papildomas kasdienio maisto nepakeičia
```

Neutralus „kuris iš dviejų" paslepia svarbiausią dalyką po pasirinkimu, kurio nėra.

### Kopijos

```
kategoriju_aprasymai_pries_20260818_203802.json   80 įrašų
kategoriju_meta_pries_20260818_210631.json        80 įrašų
snippetas_688_pries_*.php                      12 243 B
petshop-kategorijos-aprasymas_*.bak
```

### Liko

```
🟡 „Rinkitės" 17/56 meta — priimtas nedidelis vienodumas
🟡 367 silpnų prekių aprašymų kategorinis pjūvis (matavimas nepavyko)
🔴 pradinio puslapio title „Pagrindinis (test)" — savininko formuluotė
🔴 numatytasis og:image — nėra
```

---

## 8r. 301 SLUOKSNIS IŠMATUOTAS — 2026-08-18 (vėlus vakaras) [S1039–S1052]

### Rezultatas

```
301 žemėlapis          937 → 1 099   (+162)
404 su srautu          219 → sutvarkyta 163 (2 838 paspaudimai)
                             palikta 404      45 (610) — prekių tikrai nebėra
                             liko neišspręsta 11 (139)
SENŲ ADRESŲ SRAUTO DANGA      78 %  →  95 %
```

### 🔒 Metodinė taisyklė (svarbiausia iš sesijos)

> **Imtis iš sprendimo aibės įrodo, kad sprendimas veikia, o ne kad problema
> išspręsta.** Pirmoji patikra ėmė 70 URL iš 301 žemėlapio ir davė 69/70 —
> bevertį rezultatą. Testuoti reikia iš PROBLEMOS pusės, t. y. iš GSC.

### Du sargai, be kurių automatika kenkia

| Sargas | Ką pagavo |
|---|---|
| **Rūšies** | `/sunims/transportavimo-dezes` → „Transportavimo dėžės KATĖMS" (panašumas 85,1) — 5 atvejai |
| **Dydžio** | Sepija 20 cm → 15 cm · GimCat 50 g → 40 g · Skudo 4 → Skudo 1 — 20 atvejų |

Panašumo skaičius vienas **neužtenka**. Skaičius prieš lyginant reikia
normalizuoti (`12-5 kg` == `125 kg`), kitaip 2/3 „neatitikimų" yra tik kitoks
užrašymas.

### Vardo paieška > raidžių panašumas

24 atvejai išspręsti paėmus pilną 135 brendų ir 80 kategorijų sąrašą ir ieškant
**vardo kelyje**: `/dovanos-sunims-bei-katems` → DOVANOS (raidžių panašumas
buvo 57,1 ir būtų atmestas).

### 6 slug konfliktai — 🔴 laukia savininko

`sprendimai · pasiulymai · naujas-suniukas · naujas-kaciukas ·
jautrus-virskinimas · daugiau-pigiau` — kiekvienas turi IR puslapį, IR
kategoriją, abu grąžina 200 su **identišku title**. Dev'e nematyti (noindex),
bet perjungus indeksavimą konkuruos. Sprendimas — skirtingi title (puslapiui
patarimas, kategorijai prekės).

### Kopijos

```
legacy_301_map_pries_*.json   (kelios, prieš kiekvieną bangą)
```

---

## 8s. STRAIPSNIAI SUTVARKYTI — 2026-08-19 (rytas) [S1053–S1068]

### Rezultatas

```
nuorodų sutvarkyta      215 / 216
nuotraukų perkelta       26 / 26
sugadintų rašmenų     2 928 → 0
```

### 🔒 Trys „trūkstami" blog straipsniai — NEREIKALINGI

TŽ juos vardijo kaip P0 nuo liepos. GSC per 16 mėn.:

```
sterilizuotu-kaciu-maistas          10 paspaudimų
maistas-sterilizuotai-katei          4
royal-canin-kaciu-maistas            0
```

**Iš viso 14.** Savininkas sustabdė prieš rašymą. `Q-BLOG3` uždarytas.

Veislių straipsnių vertinimas patvirtintas: 588 URL, 7 418 paspaudimų,
489 846 parodymų — pirkimų 0.

### Trys skirtingi gedimai, kurių nesimatė

| Gedimas | Mastas | Kodėl nesimatė |
|---|---|---|
| Nuorodos į seną domeną | 287 | atrodė kaip išorinės, slėpėsi nuo statistikos |
| Nuotraukos iš seno domeno | 26 | senas domenas gyvas, paveikslai kraunasi |
| Sugadinti lietuviški rašmenys | 2 928 sekos, 4 puslapiai | matomi tik atidžiai skaitant |

Visi trys būtų pasirodę **perjungimo dieną**, ne anksčiau.

### Kodėl turinys imtas iš senos svetainės

Baitų taisymas atkūrė 1 559 iš 2 153. Likusiems **atkurti neįmanoma**: `veislÄs`
antrasis baitas dingęs, o iš `Ä` vieno negalima pasakyti, ar ten buvo `ą`, `č`,
`ė` ar `į`. Todėl imtas švarus šaltinis (`div.articleDescription` senojoje
petshop.lt), o jam pritaikytos mūsų nuorodų taisyklės.

### Sprendimas: santykinės nuorodos

```
https://petshop.lt/kategorija/…   po launch veikia · dev'e veda į SENĄ svetainę
/kategorija/…                     po launch veikia · dev'e VEIKIA
```

Santykinė po domeno keitimo persitvarko pati — pigiausias būdas „po launch'o
nieko nekeisti", plius leidžia patikrinti prieš perjungimą.

### 🔴 Naujas atviras klausimas

`/sunu-maisto-skaiciuokle` — puslapio dev'e **nerandu**, o trys straipsniai į jį
rodo. Paieška pagal `skaiciuokl` tarp `page` nieko negrąžino. Netvirtinu, kad
jo nėra — bet patikrinti prieš launch'ą būtina.

### Kopijos

```
straipsniu_turinys_pries_*.json · nuotrauku_turinys_pries_*.json
rasmenys_pries_*.json · turinys_pries_perrasymo_*.json
prieziuros_pries_*.json · nuorodos_pries_*.json · miamor_pries_*.html
```

---

## 8t. ✅ SEO SLUOKSNIS UŽDARYTAS — 2026-08-19 (priešpiet) [S1069–S1078]

### Būklė

| Sluoksnis | Būklė |
|---|---|
| Rank Math | ✅ v1.0.276, 3 moduliai, sitemap 5 failų |
| Prekių title | ✅ 2 609 / 2 609 per šabloną |
| Prekių meta aprašymai | ✅ 2 609 / 2 609 |
| Kategorijų tekstai | ✅ 56 |
| Kategorijų meta | ✅ 56 |
| 301 danga | ✅ 95 % (žemėlapis 1 099) |
| Straipsnių nuorodos | ✅ 231 / 234 |
| Straipsnių nuotraukos | ✅ 26 mediatekoje |
| Sugadinti rašmenys | ✅ 0 |
| Pradinio psl. meta | ✅ |
| Slug konfliktai | ✅ 12 title |
| og:image | ✅ 1200×630, ID 35001 |

### 🔒 Metodinė taisyklė

> **Atvirų klausimų sąrašas privalo būti PATIKRINTAS, ne prisimintas.**
> Savininkui paprašius patikslinti, du „raudoni" punktai nukrito po vienos
> patikros — vienas iš jų buvo mano paties per griežtas teiginys.

### Du klaidingi „raudoni" punktai

**Šėrimo skaičiuoklė nedingo.** Ji yra straipsnyje `suns-mitybos-auditas-…`
(ID 14890). Senoje svetainėje buvo atskiras puslapis, naujoje — įdėta į
straipsnį. Ieškojau pagal slug, ne pagal turinį.

**6 slug konfliktai → realus vienas.** Penkios kategorijos turi 0 prekių, o
`noindex_empty_taxonomies` įjungtas, tad jos į indeksą nepatenka. Realiai
konkuruoti galėjo tik DAUGIAU=PIGIAU (4 prekės).

### Pradinio puslapio meta — iš savininko žodžių

Tekstas jau buvo parašytas pačiame puslapyje; meta sudėta iš jo, nieko
neišgalvojant.

### ⏸ Perjungimo dienos veiksmai (SEO dalis)

```
blog_public = 0 → 1        DoD #22 · be jo niekas Google nepasiekia
og:image adresas           dev.avesa.lt → petshop.lt (absoliutus, kitaip negalima)
sitemap pateikimas         Google Search Console
```

### 🔴 Liko rankai

Trys prekių aprašymų nuorodos su sugadinta HTML žyma adreso viduje
(`/triusio-ausys-baltos-250-g</em`). Automatika jų neima sąmoningai —
spėjimu taisyti sugadintą žymą būtų blogiau nei palikti.

---

## 8v. PAYSERA IŠMATUOTA — 2026-08-19 (popiet) [S1079–S1086]

### Ką parodė realus bandymas

Sukurta paslėpta virtuali prekė 1 €, `test_mode` išjungtas, atliktas realus
pirkimas savininko kortele. **Paysera atmetė užklausą:**

```
Klaida 0x13 — bad_referer
„Accepturl, cancelurl, callbacurl arba referer bazinis adresas
 skiriasi nuo projekte patvirtintų adresų"
```

Projekte 29276 įrašytas `petshop.lt`, užklausa atėjo iš `dev.avesa.lt`.
**Iki pinigų nepriėjo** — grandinė sustojo pirmame žingsnyje. Tai apsauga,
ne gedimas.

### 🔒 Ko tai išmokė (svarbiausia)

> **Paysera projekte adresai įrašyti FIKSUOTAI ir tikrinami.** Vadinasi
> perjungimo naktį adresų klausimas yra **privalomas žingsnis, ne „gal reikės"**.

Domenas po perjungimo sutaps savaime. Bet **kelias skiriasi**:

```
sena platforma:  petshop.lt/index.php?route=extension/payment/paysera/callback
nauja sistema:   petshop.lt/?wc-api=paysera_callback
```

Jei projekte įrašyti pilni keliai su `index.php?route=…`, po perjungimo:
nukreipimas veiks (domenas sutampa) → klientas sumokės → **callback nueis į
adresą, kurio nebėra** → užsakymas liks „laukiama apmokėjimo". Pinigai paimti,
užsakymo nėra, iš išorės atrodo gerai.

### Kas VEIKIA (įrodyta)

```
užsakymas sukuriamas PRIEŠ nukreipimą      35003 · 2,21 € · pending
payment_method_title užsipildo             „Mokėjimas internetu"
nepavykus mokėjimui lieka pending          netampa apmokėtu
konfigūracija pilna                        ID 29276 · slaptažodis 32 simb. · EUR
```

### 🔒 SPRENDIMAS (savininkas, 2026-08-19)

Paysera projekto nustatymų **NEKEISTI** — gyva parduotuvė nepaliečiama.
Testo iš `dev.avesa.lt` atsisakoma. Rizika priimama sąmoningai; blogiausias
atvejis — kelių dienų vėlavimas, ne katastrofa.

### ⏸ PERJUNGIMO NAKTIES PROCEDŪRA — PRIVALOMA

```
1. DNS pakeitimas (ABU A įrašai)
2. TIKRINIMAS PRIEŠ SKELBIANT — 2,21 € pirkimas jau ties petshop.lt:
      ✅ veikia            → uždaryta, tęsiam
      🔴 callback nulūžta  → Paysera projekte pataisyti callbackurl,
                             pakartoti pirkimą
3. Tik po sėkmingo pirkimo — skelbiam
```

**NELEIDŽIAMA:** perjungti ir palikti mokėjimą nepatikrintą iki ryto. Tai
vienintelė vieta, kur klaida reiškia paimtus pinigus be užsakymo.

**Pasiruošimas:** prieš perjungimą pažiūrėti, kas įrašyta projekto 29276
laukuose `accepturl`, `cancelurl`, `callbackurl`. Jei tik domenas — nieko
keisti nereikės. Jei pilni keliai — 5 min. pataisymas.

### Šalutiniai radiniai

**Kasoje „Mažo krepšelio mokestis" rodomas DU kartus** — viršuje 1,21 € (su
PVM), apačioje 1,00 € (be PVM). Skaičiuojama teisingai, bet klientui atrodo
kaip dvigubas mokestis. Kasoje matomas dvigubas mokestis yra tiksliai ta vieta,
kur metami krepšeliai. **Sutvarkyti prieš launch.**

**`test_mode` grįžo į `yes` savaime** po to, kai buvo nustatytas `no` ir
patikrintas. Kas jį grąžino — plugin'as ar savininkas WP admine — neaišku.
Perjungimo naktį **patikrinti du kartus**.

---

## 8x. INFRASTRUKTŪRA IŠMATUOTA — 2026-08-19 (vakaras) [S1087–S1098]

### 🔴 Vienintelis likęs perjungimo neaiškumas

**Kaip `petshop.lt` ras svetainę.**

```
petshop.lt              → savo tuščias katalogas (4 MB srauto)
parduotuvė gyvena       → avesa.lt/public_html/dev (9,75 GB)
```

Patikrinta ekranais, kad per DirectAdmin to nurodyti **neįmanoma**:
subdomenų valdymas leidžia tik kurti/trinti; parkuojamas domenas rodytų į
`public_html` (ne `/dev`) ir sukurtų du adresus tam pačiam turiniui, o tai
griautų visą SEO sluoksnį su vienu canonical.

**Lieka failų perkėlimas per SSH — palaikymo žmogus, ne AI agentas.**

### Tikrieji dydžiai

```
public_html   9,75 GB          uploads         9,24 GB (95 %)
be uploads      442 MB         ShortpixelBackups 4,02 GB  ← NEREIKALINGI
                               petshop-legacy     710 MB  ← senos platformos
                               wpallimport        258 MB  ← laikini
```

**Apie 5 GB perkelti nereikia.** Išvalius liktų ~4,5 GB vietoj 9,7.

### 🔒 INODE — 66 %

```
263 632 / 400 000       liko 136 368
```

**Perkėlimas inode nepadidins. KOPIJAVIMAS PADVIGUBINTŲ** ir riba būtų
pasiekta → serveris nustotų priimti failus, WordPress negalėtų įkelti
nuotraukų.

> **Operacija privalo būti „Perkelti", ne „Kopijuoti".**

Vieta „unlimited", **inode — ne**. Tai antra priežastis valyti prieš perkėlimą.

### Kelių auditas — WordPress pusė paruošta

```
wp-config   ABSPATH = __DIR__     WP_HOME/WP_SITEURL nenustatyti
mu-plugins  0 fiksuotų kelių      options 11 · postmeta 8 · snippetai 6
```

Perkėlus WordPress persitvarkys pats. Rizika yra tik serverio pusėje.

### SSL — nemokamas, bet tik po DNS

Naujajame serveryje `petshop.lt` sertifikatas yra, bet **pasibaigęs
2022-12-31**. Tiekėjas patvirtino: nemokamas (svetainė jų serveryje),
prieš DNS išduoti negalima, TTL 300 → įsigaliojimas 5–10 min.

### DNS patikslinimai

```
serveriai.lt = iv.lt (UAB „Interneto vizija") — VIENA įmonė, viena paskyra
www.petshop.lt yra CNAME → keisti tik DU A įrašus
petshop.lt JAU pridėtas prie plano (Aivės „tikėtina, kad ne" — klaidinga)
```

### 🔒 AI agento atsakymų vertinimas

Penki skirtingi sprendimai: trys prasidėjo „tikėtina", vienas klaidingas
(siūlė `gyvunai.lt` katalogą), vienas prieštaravo sau, paskutinis siūlė
įkelti 2–3 GB archyvą per sąsają su 256 MB limitu. **Nė viename neįvertinta
esminė detalė — poaplankis `dev`.**

> **Serverio konfigūracijos klausimų su AI agentu nespręsti.**

### Šalutiniai radiniai

- `backup-run.php` ir `watch-run.php` kviečiami cron'u **pilnu keliu** →
  po perkėlimo rodys į seną vietą (greta 6 WP All Import cron'ų)
- Po perkėlimo `dev.avesa.lt` nustos veikti → **tiltas nutrūks**
- `uploads` šaknyje šimtai `.webp` failų atsitiktiniais vardais, visi
  2026-06-12 03:51–06:46 — kilmė neaiški, **netvirtinama, ar naudojami**

---

## 8y. TŽ AUDITAS + PRIEŽIŪROS REŽIMAS — 2026-08-19 (naktis) [S1099–S1106]

### TŽ MASTER v1.86 — pirmas pilnas 46 skyrių auditas

Ataskaita: `TZ_MASTER_v1_86_AUDITAS_2026-08-19.md`. Palyginta ~310 punktų.

| Klasė | Kiek |
|---|---|
| ✅ padaryta | ~168 (54 %) |
| 🟡 dalinai | ~34 (11 %) |
| 🔴 nepadaryta | ~28 (9 %) |
| ⚪ sąmoningai atmesta / po launch | ~41 (13 %) |
| ❓ **neišmatuota** | **~39 (13 %)** |

### 🔴 Trys sluoksniai, kurių registre nebuvo VISAI

```
TŽ §5    NF1–NF22 nefunkciniai      22 punktai, 8 neišmatuoti (3 saugumo)
TŽ §20   T1–T13 testavimo planas    13 punktų, 4 nedaryti
TŽ §2.2  techniniai KPI             9 metrikos, 5 nematuotos
```

Patikrinta grep'u: `Lighthouse`, `Wordfence`, `2FA`, `WP Rocket`, `Cloudflare`,
`Omniva`, `ACF Pro` — **0 atitikmenų** registre ir žurnale.

Persidengia: greitis (NF1–NF4 = T4 = KPI 1–4), sauga (NF9–NF11 = T7).
Realiai tai **du matavimai**, ne septyniolika darbų (~1,5 val.).

### 🔴 Radinys, kurio nebuvo nė vienoje lentelėje — TŽ §14 D7/D8

```
D7  Klientų bazė        MVP prioritetas   NEPADARYTA
D8  Užsakymų istorija   MVP prioritetas   NEPADARYTA
```

**Sena platforma išjungiama 2026-10-15.** Po to duomenų nebėra iš kur imti.
Tas pats terminas galioja Q19 (istoriniai atsiliepimai). → **Q-D7D8**

### Devyni TŽ prieštaravimai realybei

Svarbiausi: §16/§17 rodo go-live 10-15 (sprendimas 09-01/02); §27 aprašo
`petshop_desc_*` sistemą, kurios nėra nė vienoje iš 2 744 prekių (§41 tai
išmatavo, §27 nepataisytas); §26.7 etapai 4/8/9 „Laukia", nors veikia nuo
birželio; §11.5 pluginų versijos pasenusios.

---

### ✅ Priežiūros režimas — DOD-19 §8 pirmas raudonas punktas UŽDARYTAS

`mu-plugins/petshop-prieziura.php` **v1.0.1** · 6 235 B · md5 `726867ac…`
Kopija: `deploy/petshop-prieziura.php`

```
įjungti    sukurti  wp-content/uploads/ps-prieziura.flag
išjungti   ištrinti tą patį failą
```

Vėliava **failu, ne nustatymu DB** — nes DOD-19 §3.3 numato režimą įjungti
PRIEŠ DB atstatymą, kai jungiklis DB būtų nepasiekiamas.

Failo turinys: 1-oji eilutė = tekstas lankytojui, 2-oji = `Retry-After` sek.

| Kelias su vėliava | Rezultatas |
|---|---|
| Vitrina, prekės puslapis | **503 + `Retry-After: 1800`** |
| `?wc-api=paysera_callback` | **400** (WooCommerce apdorojo) — ne 503 |
| `/wp-admin/` | 302 |
| `/wp-login.php` | 200 |
| **REST code-snippets (tiltas)** | **200, 1 747 snippetai** |

503 pasirinktas sąmoningai: Google 503 neindeksuoja, bet ir **iš indekso
neišmeta**. 200 arba 302 čia būtų SEO klaida.

### ★ INCIDENTAS S1103 — priežiūros režimas uždarė tiltą

v1.0.0 kabėjo ant `init`. `init` vyksta **ir REST užklausoms** → įjungus
režimą užsidarė Code Snippets REST API, ir valymo fazė pati save užblokavo.
Dev'as liko 503 būsenoje **~4 min.**

Išsikapstyta per `?wc-api=` praėjimą — tą patį saugiklį, kuris buvo įdėtas
mokėjimams saugoti.

> **🔒 NAUJA TAISYKLĖ:** kodas, kuris blokuoja užklausas, privalo būti
> patikrintas **ir iš savo paties išjungimo kelio pusės**. Neužtenka
> patikrinti, kad blokavimas veikia — reikia patikrinti, kad IŠJUNGIMAS
> veikia iš tos pačios būsenos.

**Taisymas struktūrinis:** `template_redirect` vietoj `init`. Jis iš viso
nevyksta REST, admin-ajax, wc-api ir wp-cron kelyje — praeina savaime, be
išimčių sąrašo.

---

### ✅ Atstatymas į švarią bazę — DOD-19 §8 antras punktas IŠMATUOTAS

```
DB              gyvunai2_nbpe1 · MariaDB 10.6.17 · 194 lentelės
teisės          GRANT USAGE ON *.*
                GRANT ALL PRIVILEGES ON `gyvunai2_nbpe1`.*
matomos DB      gyvunai2_nbpe1, information_schema (VISKAS)
lenteles kurti  TAIP
BAZĘ kurti      NE — „Access denied to database 'gyvunai2_rtst_h084'"
```

Registro teiginys „WP vartotojas neturi teisės kurti naujų DB" **patvirtintas
empiriškai**, ne iš atminties.

**Antras neaiškumas uždarytas:** bazės koduotė **`latin1` / `latin1_swedish_ci`**
(DOD-19 §3.3 rašė „nepatikrinta"). Lentelės utf8mb4. Vadinasi nauja bazė turi
būti kuriama **utf8mb4**, kitaip atstatant lietuviškos raidės gali nukentėti.

**Laukia savininko (DirectAdmin, ~2 min) → Q-SVARI-DB:**
```
1. sukurti bazę   gyvunai2_rtst   utf8mb4 / utf8mb4_unicode_ci
2. priskirti prie jos ESAMĄ vartotoją gyvunai2_nbpe1 su visomis teisėmis
```
Naujo vartotojo NEREIKIA — kitaip reikėtų ir naujo slaptažodžio wp-config'e.

---

### Tilto recon — trys faktai

```
1. adresas    screenshot.mjs 3 eilutė, const WP=... Daugiau NIEKUR.
2. PAT        workflow viduje GH_TOKEN = github.token (Actions savas).
              PAT reikalingas TIK Claude dispatch'ui → Q-PAT siauresnis.
3. AKLA ZONA  po perkėlimo dev.avesa.lt miršta, petshop.lt dar eShoprent
              → NĖ VIENAS adresas nepasiekia svetainės iš išorės
```

Akla zona DOD-18/19 **nebuvo aprašyta**. Siūlomas sprendimas → **Q-SUBDOM**:
prašyti SSH žmogaus subdomeno (pvz. `naujas.avesa.lt`) į NAUJĄ dokumentų šaknį.

**Padaryta:** workflow'e pridėtas `WP_URL: ${{ secrets.WP_URL }}` — perjungimo
metu adresas keičiamas vienu GitHub secret'u, ne kodu.

### Šalutinis radinys

```
aktyvūs pluginai   27      TŽ §11.4 riba: ≤25
mu-plugins failai  56
```
Kandidatai peržiūrai: `wordpress-importer`, `wpforms-lite`, `woo-update-manager`.
Nedaryta — savininko sprendimas. → **OPS-15**

---

## 8z. NF SLUOKSNIS: SAUGA, GREITIS, ROBOTS — 2026-08-19 (vėlyva naktis) [S1107–S1114]

TŽ audito (§8y) „E dalies" vykdymas. Pirmas kartas, kai TŽ §5 nefunkciniai
reikalavimai apskritai matuojami.

### ✅ Keturios saugos pataisos

| Pataisa | Patikra |
|---|---|
| `DISALLOW_FILE_EDIT = true` | wp-config 3 827 → 3 939 B, loopback 200 |
| `WP_DEBUG_DISPLAY = false` | ta pati |
| `readme.html` pašalintas | **404** (buvo 200) |
| `license.txt` pašalintas | **404** |
| `<meta generator>` pašalintas | vitrinoje nebėra |

Naujas modulis `mu-plugins/petshop-higiena.php` v1.0.0 · md5 `b1226cc0…` ·
kopija `deploy/`. Šalina generator, RSD, wlwmanifest, X-Pingback.

`readme.html` ir `license.txt` **ne ištrinti, o perkelti** į `ps-backups`.

### Saugos būklė iš išorės

```
/wp-json/wp/v2/users   403   ┐
/wp-content/uploads/   403   ├ visi identiško dydžio (401 B)
/wp-config.php.bak     403   ┘ = serverio lygio WAF, ne WordPress
debug.log · .env       404
wp-config.php teisės   0600
administratorių        1 (bdz487, ne „admin")
```

**Saugumo pluginų — NĖ VIENO.** NF9 (login limitai) ir NF10 (2FA)
**neįgyvendinti**. Prie vieno admin su neatspėjamu vardu tai nedega, bet TŽ
jų reikalauja → savininko sprendimas: diegiam ar formaliai išbraukiam.

**Nepatikrinta:** `xmlrpc.php` (užklausa nulūžo).

### 🔒 Pataisymas: registre buvo „WP 7.0"

`<meta generator>` rodė **WordPress 6.9.4**. Registro ir TŽ suvestinės
teiginys „WP 7.0" netikslus.

---

### ★ Kodėl PageSpeed neveikia — sertifikatas

```
dev.avesa.lt:  CN *.serveriai.lt · SAN *.serveriai.lt, serveriai.lt
               dev.avesa.lt SAN sąraše NĖRA
               UNABLE_TO_VERIFY_LEAF_SIGNATURE
```

Bendras hostingo sertifikatas, ne mūsų domenui. Google atsisako matuoti
svetainę su negaliojančiu sertifikatu — tas pats ir Lighthouse.

> **Tai buvo priešais akis nuo pirmos dienos.** Tilto skripte visą laiką
> stovi `NODE_TLS_REJECT_UNAUTHORIZED='0'` — klaidą ignoruojam nuo pradžių,
> tik niekas nebuvo jos pavadinęs vardu.

**NF3/NF4 išvada: Lighthouse dev'e IŠMATUOTI NEĮMANOMA.** Tai ne skola, o
aplinkos apribojimas. Po perjungimo `petshop.lt` gaus tikrą Let's Encrypt
sertifikatą (DOD-19 §7c) ir matavimas veiks.

Du bandymai prieš tai nulūžo: PSI API → HTTP 429 (bendras runner'ių IP,
Google kvota); `playwright install` kabėjo 17 min.

### Našumo profilis (be naršyklės)

```
pilnas HTML      mediana 1 940 ms      HTML dydis   230 KB (gzip ✅)
CSS 11 / 295 KB · JS 19 / 370 KB · IMG 20 / 342 KB   →  ~1,2 MB
JS be defer/async 13 (5 iš jų <head>, blokuojantys)

PHP 8.3.20 · OPcache ✅ · objektų kešas NĖRA
užklausų 78 · generavimas ~1 s · atminties pikas 112 MB
transientų 1 436 (1 009 KB) · prekių publish 2 609
```

**Objektų kešo nebuvimas — didžiausia likusi galimybė.** TŽ §10 Redis mini
kaip „optional", bet tai buvo prieš 2 609 prekes.

### ✅ Kešavimo antraštės sutvarkytos

| Failas | Prieš | Po |
|---|---|---|
| `wp-embed.min.js` | **jokios `Cache-Control`** | `public, max-age=31536000` |
| `dashicons.min.css` | `max-age=604800` | `public, max-age=31536000` |

`.htaccess` 1 309 → 2 068 B, kopija `ps-backups/htaccess.bak_h089`, blokas
apgaubtas `<IfModule>`.

### ✅ Autoload išvalytas

```
330,5 KB → 218,1 KB   (−34 %)      742 → 737 įrašai

wh_probe_result · wh2_probe_result · mnm_p7_result   ← MŪSŲ senų run'ų likučiai
jetpack_active_plan                                  ← Jetpack neįdiegtas
petshop_zb_image_index   autoload auto → off  (NEIŠTRINTA — reikalinga importui)
```
Kopija: `ps-backups/options_h090.json` (56 383 B).

**Transientai — nieko neištrinta, ir tai teisingas rezultatas.** Iš 1 436
pasibaigusių 0.

### 🔒 Dvi matavimo klaidos

1. `round(timer_stop(0), 3)` — `timer_stop()` grąžina **eilutę**; PHP 8.3 tai
   `TypeError`. Snippetas nulūžo.
2. `autoload_KB` parodė **0** — neteisinga. Nuo WP 6.6 `autoload` reikšmės
   yra `on`/`off`/`auto`, ne `yes`/`no`.

> **Nulinis rezultatas yra įtartinesnis už blogą rezultatą.** „0 KB autoload"
> turėjo iškart sukelti klausimą, o ne pasitenkinimą.

---

### ★ robots.txt po perjungimo — VEIKS SAVAIME

Savininko klausimas. **Anksčiau atsakiau „keisis savaime" nepatikrinęs.**

```
fizinis /robots.txt   NĖRA
generuoja             0  → RankMath\Sitemap\Sitemap_Index::add_sitemap_directive
                      10 → WooCommerce::robots_txt
```

Fizinio failo nėra → `Sitemap:` eilutė sudaroma iš `home_url()` kiekvienos
užklausos metu. Pakeitus Site URL ji tampa teisinga tą pačią sekundę.

> **⚠️ Įspėjimas ateičiai:** jei kas nors įkels FIZINĮ `robots.txt` į šaknį,
> jis TYLIAI perims viską — nei Rank Math, nei WooCommerce eilutės nebeveiks,
> o sitemap nuoroda liks užšalusi.

**Šalutinis radinys:** su `blog_public = 0` robots.txt vis tiek rodo
`Disallow: /wp-admin/`, t.y. **leidžia visą svetainę**, ir dar skelbia
sitemap'ą. Indeksavimą stabdo **tik `<meta name="robots" content="noindex,
nofollow">`**. Vadinasi DOD-22 varnelė yra **vienintelis** apsaugos
sluoksnis, ne vienas iš dviejų. Po perjungimo — 1 min. patikra.

---

### TŽ §5 NF lentelė — pirmas kartas išmatuota

| NF | Reikalavimas | Būklė |
|---|---|---|
| NF1–NF2 | LCP / TTI | 🟡 netiesioginiai skaičiai; tikri po perjungimo |
| NF3–NF4 | Lighthouse ≥85 / ≥90 | ⏸ **neįmanoma dev'e** (sertifikatas) |
| NF5 | Uptime | 🟡 vidinis sargas; išorinio nėra |
| NF6–NF7 | Kopijos + restore | ✅ |
| NF8 | SSL | 🔴 → sprendžiama po DNS |
| NF9 | Brute force | 🔴 **neįgyvendinta** |
| NF10 | 2FA admin | 🔴 **neįgyvendinta** |
| NF11 | WAF | 🟡 serverio lygio YRA |
| NF12–NF17 | GDPR, VMI, mobile | ✅ |
| NF18 | Naršyklės | 🔴 netestuota |
| NF19 | WCAG 2.1 AA | 🔴 neišmatuota |
| NF20 | WebP + kešavimas | ✅ **kešavimas sutvarkytas** |
| NF21 | XML sync logging | 🟡 |
| NF22 | Audit trail | 🟡 tik kainai |

---

## 8ž. SCHEMA, ESYBĖS, FEED'AI — 2026-08-19 (naktis II) [S1115–S1122]

### ⏰ RYTOJ (2026-08-20) — PIRMAS DARBAS

> **Naktį suksis `ps_feeds_naktinis` (01:30) ir ZB importai.**
> Klausimas: **kiek pavadinimų su `&amp;` GRĮŽO.**

```
1. prekių su esybėmis pavadinime      šiandien po taisymo: 0
2. feed'ų cdata_amp (3 failai)        šiandien: 0 / 0 / 0
```

**Skaičius rytoj = šaknies skubumo matas:**

| Grįžo | Ką reiškia |
|---|---|
| 0 | šaknis nekenkia — pakanka stebėti |
| 1–50 | ZB importas grąžina dalį — taisyti profilį neskubant |
| **50+** | **grąžina masiškai — taisyti PRIEŠ perjungimą** |

Antra rytojaus eilutė: **DOD-20 stabilumo serija užsidaro 2026-08-24.**

---

### ✅ BreadcrumbList prekėms — TŽ §S8 uždarytas

`mu-plugins/petshop-schema.php` v1.0.2 · md5 `78879f3c…` · kopija `deploy/`

```
1. Pradžia > 2. ŠUNIMS > 3. Maistas šunims > 4. Sausas maistas šunims > 5. [prekė]
```

Kabinasi ant `rank_math/json_ld`. Takelis iš pirminės Rank Math kategorijos,
jos nesant — iš giliausios priskirtos, su protėviais. Nedubliuoja, jei Rank
Math kada nors pradėtų išvesti pati.

### 🔒 Mano „raudonas" §8z buvo klaidingas

Buvau įrašęs „BreadcrumbList nėra". Tikrinau **tik pradinį puslapį**, o ten
jos ir neturi būti. Realiai kategorijose ji **buvo**, prekėse — nebuvo.

> **Puslapio tipas yra matavimo sąlyga, ne smulkmena.** Trečiasis kartas, kai
> per skubą paskelbiu raudoną, kurio nėra.

---

### ★ FEED'AI: 117 įrašų su sugadintais pavadinimais → 0

```
PRIEŠ   google/kaina24/kainos:  CDATA blokų su &amp;: 117 · 117 · 117
PO      visuose trijuose:       0 · 0 · 0
```

**CDATA viduje esybės nedekoduojamos.** Google Merchant, Kaina24 ir Kainos.lt
gaudavo pažodžiui `Lamb, Pork &amp; Buffalo`.

> **★ Tas pats duomuo, trys skirtingi verdiktai. ★**
> HTML kode `&amp;` — **norma** (naršyklė parodo `&`).
> XML CDATA viduje ir JSON-LD — **klaida**.
> Todėl prekės puslapis atrodė tvarkingas, o feed'ai tyliai gedo.

### Dry-run → APPLY

```
publish 148 · draft 160 · VISO 308 · nesikeičiančių 0
esybių rūšis: TIK viena — &amp;, 510 kartų
kilmė: zb 238 (77 %) · av 68 · prins 2

kopija     ps-backups/post_titles_h098.json  37 168 B
pataisyta  308 / 308 · klaidų 0 · liko 0
```

Naudotas `$wpdb->update` + `clean_post_cache()`, **ne** `wp_update_post()` —
kad nepasileistų `save_post` kabliukai ir nebūtų liestas `slug`.
**301 sluoksnis ir SEO nepaliesti.**

Feed'ai pergeneruoti per `do_action('ps_feeds_naktinis')`: 27,9 s, 130 MB.

### ⚠️ NELIESTA sąmoningai

```
post_excerpt   888 prekių
post_content   322 prekių
terminai         4
```

Aprašymuose `&amp;` gali būti **teisėtas** — ten HTML pasitaiko. Aklas
dekodavimas juos sugadintų. Reikia atskiro dry-run su kitokia logika.
Bet jie eina į tuos pačius feed'us.

### 🔒 Trys bandymai dėl schemos `&amp;` — visi nepavykę

v1.0.0 → v1.0.1 (`ENT_HTML5`) → v1.0.2 (kartotinis dekodavimas). Sustota pagal
taisyklę. **Priežastis neįrodyta** — labiausiai tikėtina Rank Math išvedimo
elgsena, bet to netvirtinu. Sustojimas pasirodė teisingas: ieškant priežasties
paaiškėjo, kad tikroji problema feed'uose.

### Šalutinis: feed variklio API

`get_declared_classes()` su filtru „feed" grąžino tik `Petshop_Feeding_*` —
generatoriaus klasės fronto užklausoje neužkraunamos. Tikrasis kelias rastas
**cron lentelėje**: `ps_feeds_naktinis`.

> **Kabliuko vardas iš cron lentelės patikimesnis už klasės paiešką.**

---

## 9. LAUKIA RAIMIO SPRENDIMO

| ID | Klausimas | Blokuoja | Terminas |
|---|---|---|---|
| Q6 | Prenumeratos pluginas | F19 | — |
| Q10 | Kurie 20–30 SKU prenumeratai | F19 | — |
| Q-BKP | ✅ **UŽDARYTA 2026-08-03:** B2 bucketas, raktas, kredencialai, Object Lock 14 d. — viskas pastatyta ir įrodyta (§8d) | DOD-08 | — |
| ~~Q-ZENKLAI~~ | ✅ **UŽDARYTA 2026-08-18:** visos 114 priskirtos (81 savininkas + 33 pagal įrodymus); taksonomija išvalyta (§8n) | — | — |
| ~~Q-KATEGORIJOS~~ | ✅ **UŽDARYTA 2026-08-18:** 55 kategorijos susietos su Google taksonomija, savininkas patvirtino, feed'e 100 % (§8n) | — | — |
| **Q-SVORIS** | **998 prekės be svorio** — pavadinime kiekio nėra, reikia sverti arba tiekėjo duomenų | pristatymo tikslumas | — |
| **Q-VARTAI** | Ar publikavimo vartų riba (120 simb.) keičiama į 90, kaip pilnumo? Įleistų liesesnius tiekėjų aprašymus | — | — |
| **Q-MERCH-1** | **Ar Merchant Center paskyra egzistuoja?** Tikrinti negalim: Content API neįjungtas + paslaugos aktas nepridėtas prie MC (§8m S985). Du savininko veiksmai | Google feed | skubu |
| ~~Q-MERCH-2~~ | ✅ **UŽDARYTA 2026-08-18:** feed'as SAVAS, ne GLA pluginas | — | — |
| ~~Q-MERCH-3~~ | ✅ **UŽDARYTA 2026-08-18:** prekės be likučio į feed'us nesiunčiamos | — | — |
| Q-MON | **Monitoringo apimtis** — uptime pakanka, ar reikia ir PHP klaidų sekimo? | DOD-13 | — |
| ~~Q-PSR2~~ | ✅ **UŽDARYTA 2026-08-19:** konfigūracija PILNA; testas iš dev neįmanomas (`bad_referer`); savininko sprendimas — tikrinti perjungimo naktį (§8v) | — | — |
| **Q-PSR3** | 🟡 Prieš perjungimą pažiūrėti, kas įrašyta projekto 29276 laukuose `accepturl`/`cancelurl`/`callbackurl` | perjungimas | prieš T-0 |
| **Q-KREPS** | 🟡 Kasoje „Mažo krepšelio mokestis" rodomas du kartus (1,21 € ir 1,00 €) — klientui atrodo kaip dvigubas | konversija | prieš launch |
| Q9 | Lojalumas: pluginas ar savas BonusLedger | — | 2026-08-15 |
| Q21 | FB paskyros revival + reali nuoroda | OPS-10 | — |
| Q-R2 | Prekės be EAN — patikslinta 2026-08-18: po GTIN taisymo liko **594** publish prekės be jokio kodo (§8m) | F4 vertė · Google | — |
| Q-R7 | 1022 draft prekės — publish/trinti/palikti | — | — |
| ~~Q-GSC~~ | ✅ **NEBLOKUOJA — buvo klaidingai laikoma atviru.** Eksportas padarytas 2026-07-30 (2 445 URL / 19 735 clicks, §12). Kategorijų P1 skaičiuojamas iš turimų duomenų | — | — |
| ~~Q-SEO-PRIEST~~ | ✅ **UŽDARYTA 2026-08-18:** išmatuota, abu netikslūs; danga 78 % → 95 % (§8r) | — | — |
| ~~Q-BLOG3~~ | ✅ **UŽDARYTA 2026-08-19: NEREIKALINGI.** Trys straipsniai per 16 mėn. surinko 14 paspaudimų (§8s) | — | — |
| ~~Q-SKAIC~~ | ✅ **UŽDARYTA:** skaičiuoklė yra straipsnyje ID 14890; nuorodos pataisytos (§8t) | — | — |
| ~~Q-SLUG6~~ | ✅ **UŽDARYTA:** 12 title; realus konfliktas buvo tik 1 iš 6 (§8t) | — | — |
| ~~Q-HOME~~ | ✅ **UŽDARYTA:** pradinio psl. title ir meta iš savininko teksto (§8t) | — | — |
| ~~Q-OGIMG~~ | ✅ **UŽDARYTA:** 1200×630 iš savininko logotipo, ID 35001 (§8t) | — | — |
| **Q-STRAIPS** | 🟡 Komerciniai straipsniai poz. 16–39 su 10+ tūkst. parodymų — pakelti pigiau nei rašyti naują | §8s | po launch |
| **Q-PERKEL** | 🔴 **Kaip `petshop.lt` ras svetainę** — failų perkėlimas per SSH. Kreiptis į palaikymo ŽMOGŲ, ne AI agentą | perjungimas | **prieš T-0** |
| **Q-SHORTPIX** | 🟡 Ar valyti `ShortpixelBackups` (4,02 GB) prieš perkėlimą — trynimas NEGRĮŽTAMAS | inode, perkėlimo apimtis | — |
| **Q-SAUGA** | 🔴 **NF9 (login limitai) ir NF10 (2FA admin) neįgyvendinti** — saugumo pluginų nėra nė vieno (§8z). Diegiam ar formaliai išbraukiam iš TŽ? | NF5 | — |
| **Q-REDIS** | 🟡 Objektų kešas (Redis) — didžiausia likusi našumo galimybė prie 2 609 prekių, 78 užklausų, 112 MB piko (§8z) | greitis | — |
| ~~Q-BREADCRUMB~~ | ✅ **UŽDARYTA 2026-08-19:** buvo klaidingai raudona (tikrinta tik pradiniame psl.). Kategorijose buvo, prekėms įdiegta `petshop-schema.php` v1.0.2 (§8ž) | — | — |
| **Q-ESYBES-2** | 🟡 **`post_excerpt` 888 + `post_content` 322 prekių su `&amp;`** — eina į tuos pačius feed'us, bet aklas dekodavimas sugadintų teisėtą HTML. Reikia atskiro dry-run (§8ž) | feed'ai | — |
| **Q-ZB-SAKNIS** | 🔴 **ZB Import #2/#3 įrašo `&amp;` į pavadinimus** — 238 iš 308. ⏰ Rytoj matuojam, kiek grįžo (§8ž) | feed'ai | **prieš perjungimą** |
| **Q-D7D8** | 🔴 **TŽ §14 D7 (klientų bazė) + D8 (užsakymų istorija) — MVP prioriteto, NEPADARYTA, registre nefiksuota.** Sena platforma dingsta 2026-10-15 | duomenys | **prieš 10-15** |
| **Q-SVARI-DB** | 🟡 DirectAdmin: sukurti `gyvunai2_rtst` (utf8mb4) + priskirti esamą vartotoją `gyvunai2_nbpe1`. Uždaro DOD-19 §8 (§8y) | DOD-19 | — |
| **Q-SUBDOM** | 🟡 Akla zona po perkėlimo — prašyti SSH žmogaus subdomeno į naują dokumentų šaknį (§8y) | perjungimas | prieš T-0 |
| **Q-PAT** | **GitHub PAT baigia galioti 2026-08-26** — be jo tiltas nustoja veikti | visi darbai | **skubu** |
 | — |
| ~~Q-KAT-FORMATAS~~ | ✅ **UŽDARYTA 2026-08-18:** B hub'uose + A lapinėse (§8o) | — | — |
| ~~Q-KAT-TEKSTAI~~ | ✅ **UŽDARYTA 2026-08-18:** 56 tekstai + 56 meta gyvi (§8p) | — | — |
| 🔒 **D-VISAVERTIS** | **UŽRAKINTA:** kasdienis pašaras turi būti visavertis; „papildomas kasdienio maisto nepakeičia". Galioja visiems būsimiems tekstams | turinys | — |
| Q-SEO | Kurios 404 kategorijos apskritai bus | DOD-07 | — |
| Q-M8 | Anketos tekstai + „14 dienų" frazė | M8 9b | — |
| Q-27 | S327 laiško lietuviško stiliaus peržiūra | — | — |
| Q-GDPR | Duomenų retencija: kada trinti `ps_carts`/`ps_shipments` | — | — |
| Q-PSR | Paysera Recurring atsakymas (nefiksuotas) | F19 | — |
| Q-EM | El. paštas „Apie mus" / „Privatumo politika" psl. | — | — |
| Q-ATA | 2 testiniai užsakymai kanibalizacijos verdiktams patikrinti | §20 | — |

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
