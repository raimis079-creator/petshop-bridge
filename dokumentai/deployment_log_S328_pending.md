## 2026-07-31 (vakaras) — DELIVERABILITY INCIDENTAS + S327 post-purchase sablonas + M8 login kelio patvirtinimas + S328 serverinio drafto pamatas

> **Kaip naudoti:** sis irasas skirtas ideti i **dabartinio** `deployment_log.md`
> virsu, po eilutes `## IRASAI (naujausi virsuje)`. Projekto kopija (v1.3.27)
> buvo pasenusi — jos naujausias irasas 2026-06-29 [S130-S134], todel pilnas
> failas negeneruotas samoningai, kad nebutu prarasti S135-S326.

Sesija truko visa diena. Uzdaryti trys atviri klausimai, pastatytas vienas
naujas pamatas. Bridge run'u ~20, is ju 3 nesekmingi (visos trys priezastys —
mano testavimo aplinkos klaidos, ne produkto gedimai; zr. „Pamokos").

---

### DELIVERABILITY INCIDENTAS — UZDARYTA

**Simptomas:** laiskai kritо i slamsta.

**Diagnoze is REALIU antrasciu (ne spejimu):** gaunantis serveris
`isopas.serveriai.lt` (Exim + Barracuda) dejo:
```
X-Spam-Status: Yes, http://www.barracudanetworks.com/reputation/?pr=1&ip=185.3.229.130
```
Saknis — Sender bendro IP pool'o **reputacija**, ne musu autentifikacija.
`mail6.sendersrv.com` (185.3.229.130) buvo Barracuda RBL sarase.

**Sprendimas:** ticket Sender palaikymui (delisting gali prasyti tik IP
savininkas). Sender persikele saskaita i kita IP pool'a. Patikrinta realiu
siuntimu: **6/6 laisku i Gautuosius**, slamste 0.

**Sutvarkyta pakeliui (verifikuota is antrasciu, ne prielaidos):**
- `DKIM-Signature: d=petshop.lt; s=sender` — VEIKIA. Senas atviras klausimas
  uzdarytas be atskiro testo.
- `Reply-To: uzsakymai@petshop.lt` — Sender **PRITAIKO**. Tai atblokavo S327
  (planuoti REPLY TEST 1/2/3 nebereikalingi).
- **SPF isvalytas.** Buvo 10/10 lookup'u be atsargos. Recon per gyvo
  petshop.lt uzsakymo laiska irode, kad eShoprent siuncia per
  `isopas.serveriai.lt` SMTP (`X-Mailer: PHP/7.4.33`), **ne per Mailgun**, ir
  naujienlaiskiu nesiuntineja. `include:mailgun.org` pasalintas.
  Dabar: `v=spf1 a mx include:spf.serveriai.lt include:sendersrv.com ~all` (5 lookup'ai).
- **DNS valdomas iv.lt**, NE serveriai.lt — svarbu launch domeno perjungimui.

**Liko:** Sender tracking CNAME `link.petshop.lt` (siuo metu nuorodos eina per
bendra `campaign-statistics.com` su svetima reputacija).

---

### S327 — POST-PURCHASE +2D SABLONAS

**Failas:** `plugins/petshop-core/templates/emails/post-purchase-2d.php` (3 940 B).
Srautas `post_purchase_2d` FLOWS jau buvo registruotas (S326), truko tik sablono.

**E2E per TIKRA dispatch grandine** (uzsakymas 34720, ne tiesioginis adapterio
kvietimas — tik taip patikrinama `process_pending` ir `provider_message_id`):
```
detect_2d        1 kandidatas -> 1 queued
job #28          pending, flow_class=service
process_pending  picked 1 -> SENT
job #28 po       status=sent, provider_message_id=azv2GY-...N0rrLjP6qO8K-2DIiMQ
laiskas          Gautuosiuose, maketas tvarkingas
```

**Sprendimai sablone:**
- Vardas NENAUDOJAMAS — lietuviu k. reikalauja sauksmininko, automatinis
  linksniavimas nepatikimas (ta pati taisykle kaip augintinio vardui).
- Didelio mygtuko NERA samoningai — pagrindinis veiksmas yra ATSAKYTI, mygtukas
  su juo konkuruotu. „Perziureti uzsakyma" — antrine tekstine nuoroda.
- „issiuntem", ne „gavote": +2 d. skaiciuojama nuo ISSIUNTIMO (`_ps_completed_at`).
- `service` klase -> atsisakymo nuorodos NERA (patikrinta).

**Klaida ir pataisa:** pirmoje versijoje antraste kartojosi teksto pradzioje.
Raimio patvirtintas tekstas yra DVI eilutes: 1-a = antraste, 2-a = tekstas.
Ivertinimo kriterijus taip pat buvo neteisingas („turi buti 1 kartas"; teisingai
2 — `<title>` + matoma antraste).

**Statusas:** kodas/render/deploy/E2E uzdaryti. Lietuvisko stiliaus perziura —
laukia Raimio.

---

### M8 PRISIJUNGUSIO VARTOTOJO KELIAS — PATVIRTINTAS NARSYKLEJE

Atmintyje kabejes blokatorius („Sukurti profili" mygtukas nieko nedaro) buvo
**PASENES** — pataisyta dar S204/S211. Patvirtinta Playwright'u, prisijungusiu
vartotoju be augintiniu:
```
tuscia busena rodoma              OK
„Sukurti profili" -> anketa       OK
?action=create -> anketa          OK
JS klaidu / HTTP klaidu           0 / 0
```
Endpoint slug = **`augintinis`** (`/my-account/augintinis/`).

**Svarbu:** du keliai montuoja i SKIRTINGUS konteinerius — todel selektorius
`#pspet-form-host input` mygtuko kelyje grazina 0, NORS FORMA VEIKIA.
Skaitikliai melavo, ekrano nuotrauka parode tiesa.

---

### S328 — SERVERINIO DRAFTO INFRASTRUKTURA (**DALINAI UZBAIGTA: 3 is 10**)

**Problema:** anoniminis anketos draftas gyveno TIK `localStorage`. Zmogus
uzpildo anketa telefono narsykleje, atsidaro magic link Gmail programeles
imontuotoje narsykleje (kitas `localStorage`) — ir randa TUSCIA profili.
Duomenys dingsta PO to, kai jis jau atliko visa darba. Nuorodos atidarymas
kitoje narsykleje yra NORMALUS elgesys, ne edge case; perspejimas „uzbaikite
tame paciame irenginyje" problemos neissprendzia.

**Bukle:**
```
OK  Bootstrap produkciniame runtime (patikrinta BE require_once)
OK  Draftu lentele gaj6_ps_pet_profile_drafts
OK  Stabilus HMAC raktas (atskiras, nerotuojamas su token'u raktais)
OK  claim_attempt_id
OK  stale claiming po 15 min.
OK  ps_pets.source_draft_id UNIQUE
OK  crash recovery ir duplicate-key idempotencija
--  REST, magic link integracija, JS, viesas puslapis, cron, E2E
```

**Failai:**
- NAUJAS `includes/class-pet-drafts.php` v1.1.0
- `petshop-core.php`: +159 B (require_once + maybe_install + activation).
  Keista SERVERIO pusEje su inkaru patikra (kiekvienas 1/1), sintakses
  validacija `token_get_all()` PRIES rasant ir backup `.bak_S328`.
  **Priezastis:** failas turi CRLF eiluciu; teksto rezimo round-trip butu tyliai
  pakeites visa faila (recon rode 14905 B serveryje vs 14846 B lokaliai).

**Sprendimai (Raimis):** galiojimas 14 d.; naujo magic link prasymas galiojimo
NEPRATESIA; el. pastas lenteleje NELAIKOMAS — tik HMAC su atskiru stabiliu
raktu; claim per `active -> claiming -> claimed`; po sekmes payload isvalomas,
lieka tik `claimed_*` ir `email_hash`.

**Kodel `claim_attempt_id`:** be savininko zymes senas pakibes procesas,
„atsibudes" jau po perėmimo, galetu uzbaigti arba atsaukti SVETIMA claim
bandyma — `WHERE status='claiming'` to neatskiria.

**Kodel UNIQUE ant `source_draft_id`:** be jo indeksas leidzia tik RASTI
dublikata po fakto, o ne UZKIRSTI keliui. MySQL leidzia kelias NULL reiksmes,
tad 65 esami irasai nepaliesti.

**Testai — visi praejo:**
```
sukurimas / svetimas pastas / race / complete / kartotinis / abort /
pakibes perimtas / pasibaiges / valymas / HMAC normalizacija    11/11

svetimas attempt -> complete   0 eiluciu, statusas nepakito
svetimas attempt -> abort      0 eiluciu
teisingas attempt -> complete  1, claimed
```

**Crash recovery (priemimo branduolys):**
```
claiming -> augintinis 158 sukurtas su source_draft_id
procesas „nulužo" pries complete_claim
stale langas -> naujas bandymas perima, attempt_id KITAS
antras INSERT -> UZBLOKUOTA duplicate-key
find_pet_by_draft -> 158, sutampa
complete_claim su nauju attempt -> claimed, pet_id 158
augintiniu tam draftui: 1
```

**Anoniminio kelio recon (faktai, ne prielaidos):**
- Shortcode yra **`petshop_pet_form`**, NE `pspet_form`.
- Vienintelis puslapis su juo: ID **34676 `/anketa-testas/`**. Produkcinio viesio
  ijimo NERA. Canonical bus `/augintinio-profilis/`, `/anketa-testas/` -> 301.
- Magic link jau SCANNER-SAFE: GET -> `render_confirmation()` per `ps_peek_token()`
  (be salutinio poveikio); sunaudojimas TIK POST su nonce; antras panaudojimas ->
  tvarkinga zinute; session fixation apsauga yra.
- `ps_action_tokens` JAU turi `resource_id` — draft_id telpa BE schemos keitimo.

---

### PAMOKOS

**Trys mano klaidos M8 harness'e (visos — testavimo aplinka, ne produktas):**
1. Endpoint slug'a **ATSPEJAU** (`mano-augintinis`) -> 404 -> vos nepalaikiau
   produkto gedimu. Imti is klases konstantos arba DB, NIEKADA nespeti.
2. Pakartojau ta pati GET rakta -> atsake **SENAS aktyvus TEMP snippet'as**,
   naujas kodas apskritai nebuvo ivykdytas. Butina: unikalus raktas + VERSIJA
   zyme atsakyme + senu TEMP deaktyvavimas pries darba.
3. `wc_get_account_menu_items()` ant `wp_loaded` grazina tuscia — per anksti.

**Du kartus melavo mano paties patikra:**
- „DELETE veikia" — Code Snippets REST DELETE grazina **204, bet eilutes LIEKA**
  (`active` tampa `-1` = siuksline). O „keturi dingo" buvo apgaulinga, nes REST
  sarasas ribojasi 500 irasu. Patikimas saltinis — DB uzklausa.
- Skaitikliai („formos lauku 0") sake „neveikia", ekrano nuotrauka parode
  „veikia". VISADA ziureti screenshot pries verdikta apie produkta.

**Nepagristas teiginys:** vieno `curl (28)` timeout'o pagrindu parasiau
„greiciausiai Cloudflare / serveriai.lt uzblokavo IP". Irodymu tam nebuvo.
Is vieno timeout'o priezasties nustatyti neimanoma.

**Playwright:** jei skripte nera narsykles bloko — ISIMTI `import { chromium }`,
kitaip `browser=0` run'as krinta ties importu.

---

### ISVALYTA / PALIKTA

- Testinis vartotojas `ps_m8_e2e` — istrintas.
- Uzsakymo 34720 `_ps_completed_at` — grazinta i pradine busena (tuscia);
  statusas `completed` nepaliestas.
- Aktyviu `TEMP*` snippet'u neliko (buvo 3, tarp ju vaiduoklis 1999).
- **LIEKA RAIMIUI:** ~129 `TEMP*` snippet'u (ID 616-2004) istrinti WP admin —
  REST ju nepasalina. Siuksline taip pat isvalyti.

---

### KITOS SESIJOS SEKA (S328 tesinys)

```
1. Tiesioginis HMAC stabilumo testas tarp ATSKIRU uzklausu
2. Bendras pet creation domeno metodas
3. POST /petshop/v1/pet-draft
4. magic-login/request + draft_id validacija
5. process_login claim grandine
6. Crash-recovery testas per TIKRA login srauta
7. pet-form.js siuncia serverini drafta (localStorage tik cache)
8. /augintinio-profilis/ + 301 is /anketa-testas/
9. cleanup cron (kasdien)
10. Keliu irenginiu ir neigiami E2E
```
**4-6 yra VIENA NEDALOMA grandine — netestuoti dalimis.**

**Trys apsaugos, butinos pries 4-6 (uzrakinta):**
1. `POST /pet-draft` NEGALI saugoti aklo JS payload — tas pats kanoninis
   validavimas kaip kuriant tikra augintini (whitelist, rusies ir priklausomu
   lauku validacija, ilgio ribos, `payload_version`, max dydis).
2. `magic-login/request` prijungia drafta TIK po trigubos patikros: `active` IR
   `expires_at > dabar` IR `HMAC(email) = draft.email_hash`. Nesutapus —
   BENDRINIS atsakymas (neatskleidzia, ar draft_id / el. pastas / paskyra yra).
3. NEKURTI antros augintinio irasymo logikos — `process_login` kviecia BENDRA
   domeno metoda; jei tokio nera, ISKELTI is REST/dashboard callback'o.

**Claim klaidos semantika (uzrakinta):** jei tokenas jau sunaudotas, o
perkelimas laikinai nepavyko — vartotojas LIEKA prisijunges, draftas grazinamas
i `active`, rodoma „Bandyti dar karta". Naujo magic link NEREIKALAUJAM.


---

## 2026-07-31 (vakaras II) — S328 tesinys: auditas, baseline ir DU INCIDENTAI

### UZDARYTA
```
S328 Runtime Audit    TEMP viso 137 · aktyviu 0 · siuksleneje 13 -> SVARU
HMAC stabilumas       trys ATSKIROS uzklausos, identiskas hash
                      raktas 64 simb. · normalizacija sutampa · ne plain sha256
Baseline              6 scenarijai + client_ref auditas
                      artefaktas screenshots/baseline.json
                      commit 6763d6700ddc4344d78982070a5f119decc883ca
```
Audito snippet'as SAMONINGAI pavadintas `S328 Runtime Audit`, be `TEMP` prefikso —
kitaip testas patektu i savo paties tikrinama aibe ir visada rodytu 1 aktyvu.

### BASELINE — PENKI RADINIAI, KEICIANTYS PLANA
1. **`create_pet()` JAU EGZISTUOJA** — bendro metodo iskelti NEREIKIA.
   `Petshop_Pet_Profile::create_pet($user_id,$input,$client_ref=null,$force_new=false)`.
2. **`client_ref` JAU YRA drafto idempotencijos raktas** — mano `source_draft_id`
   buvo ANTRAS mechanizmas tam paciam tikslui.
3. **Semantika PER-USER, ne globali** (svarbiausias): tas pats `client_ref`, kitas
   vartotojas -> HTTP 200, NAUJAS augintinis. Draftas gali buti perkeltas svetimam.
4. **`force_new` NEPERRASO `client_ref` dedupo** — patikra eina PRIES ji.
5. **KANONINES VALIDACIJOS NERA** — be `pet_name` -> HTTP 200, augintinis sukurtas
   tusciu vardu. Apsaugos Nr. 1 nera ko pernaudoti, ja reikia SUKURTI.

`client_ref` auditas svarus: 1 eilute, 0 dublikatu, `UNIQUE` galimas,
`varchar(64)` -> 36 simboliu UUID telpa.
WP hook'ai isimti is pariteto kriteriju — `class-pet-profile.php` neturi ne vieno
`do_action`; recorder'is patikrintas atskirai, nulis yra TIKRAS rezultatas.

### INCIDENTAS 1 — TUSCIAS `screenshot.mjs`
Python assert nutruko, `bash` tese, ir i `screenshot.mjs` buvo ikeltas TUSCIAS
turinys (0 B) + dispatch'inta. Bridge sugadintas vidury darbo, atkurta.
SPRENDIMAS: `set -e` + turinio dydzio patikra (`assert len(c) > 5000`) pries PUT.

### INCIDENTAS 2 — PER PLATUS `DELETE` ps_pets lenteleje
Valymo salyga: `pet_name LIKE 'BLTEST-%' OR pet_name IS NULL OR pet_name=''`.
Antroji dalis neturejo rysio su testo zymekliu -> istrintos 10 anksciau
egzistavusiu eiluciu (ps_pets 69 -> 55). `SELECT COUNT` pries `DELETE` NEBUVO —
butu is karto parodes 14 vietoj 4.

ATKURTA transakcijoje is `gaj6_ps_pets_bak_20260727_wet`:
```
VERDIKTAS         COMMIT — atkurta 10
ps_pets           55 -> 65
id 31, 32         active · likusios 8 deleted
source_draft_id   visos NULL
BLTEST liko       0
indeksai          nepakite
snapshot          gaj6_ps_pets_bak_20260731_pries_restore (55 eil.)
```
31/32: `ps_event_log` po 2026-07-27 apie juos NIEKO; backup'e `updated_at` =
`created_at` = 2026-07-15. Pakeitimu pedsako nera.

### NUOLATINE TAISYKLE (irasyta i STATE.md)
```
Pries UPDATE arba DELETE:
1. SELECT rodo konkrecius ID
2. COUNT sutampa su TIKETINU skaiciumi
3. Salygoje PRIVALOMAS unikalus zymeklis arba tikslus ID sarasas
4. Jei count nesutampa — uzklausa NEVYKDOMA
5. Vykdoma TRANSAKCIJOJE
```
Salyga pagal bendra PRODUKTO pozymi (`pet_name IS NULL`) testiniu duomenu
valymui NEBEGALI buti naudojama.

### KRYPTIS A UZRAKINTA
```
baseline                                  ATLIKTA
client_ref duomenu ir call-site auditas   ATLIKTA (svaru)
UNIQUE(client_ref)                        <- KITAS RASANTIS VEIKSMAS
draft_id rasomas i client_ref             -
crash-recovery E2E                        -
tik TADA pasalinti source_draft_id        -
```
`create_pet()` refaktoringas mazesnis nei planuota:
`create_pet_result()` (domenas, jokio HTTP) + `create_pet()` suderinamumo
wrapperis. `handle_save()` pirmame commit'e NELIECIAMAS.
Validacija — ATSKIRAS commitas, tai ELGSENOS pakeitimas.

**PERSPEJIMAS kitai sesijai:** uzdejus `UNIQUE(client_ref)`, dabartinis
`SELECT -> INSERT` lenktyniu atveju grazins `create_failed` 500 vietoj tylaus
dublikato. `UNIQUE` ir duplicate-key apdorojimas turi eiti kartu arba labai arti.
