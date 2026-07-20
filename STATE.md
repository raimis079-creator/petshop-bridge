# STATE.md — petshop.lt migracija · MASTER INDEKSAS

> **Šitą failą Claude skaito PIRMĄ kiekvieną sesiją.** Tai indeksas + darbo taisyklės, ne turinio saugykla. Turinys — kituose failuose, čia tik nuorodos.
> Paskutinį kartą atnaujinta: **2026-07-18** (**Checksum normalizacija promotion metu (path A) + schema migracija dokumentuota**; sesijos snippetai išvalyti 74/0). Ankstesnis: **2026-07-18** (**Provenance promotion importeris pastatytas + 6/6 būsenų matrica ZZTEST**; canonicalizeris nuolatinis 9/9). Ankstesnis: **2026-07-18** (**chash_v1 canonicalizeris perkeltas į nuolatinį kodą (9/9 testai)** + oficialaus importerio kontraktas užrakintas; 241/242/243 needs_review). Ankstesnis: **2026-07-18** (**241/242/243 KARANTINUOTOS needs_review** — norma su gamintojo oficialiu šaltiniu nesutikrinta, production DAR NELEIDŽIAMAS). Ankstesnis: **2026-07-18** (**chash_v1 canonicalizeris ATKURTAS (222/222), 3 Exclusion lentelės PERKURTOS transakciškai** su teisingu hash + provenance + regression testas). Ankstesnis: **2026-07-18** (**3 Exclusion šėrimo lentelės sukurtos** iš gamintojo aprašymo, Calculator skaičiuoja; Package sluoksnis UŽDARYTAS). Ankstesnis: **2026-07-18** (**Package sluoksnis UŽDARYTAS** — Resolver grynas 29/29, Provider trust kontraktas su fix_to įrodymu; kitas = Condition_Mapper). Ankstesnis: **2026-07-18** (**Package Resolver v2 — ortogonalios dimensijos** 35/35; assignment_trust modelis + backfill audito poreikis). Ankstesnis: **2026-07-18** (**Package Resolver PROTOTIPAS validuotas** — 31/31; kitas = Condition_Mapper). Ankstesnis: **2026-07-18** (**Package sluoksnio sutartis UŽRAKINTA** — Provider/Resolver padalinti, trust gate, 2 fixture; kitas = kodas). Ankstesnis: **2026-07-18** (**condition_map_v1 UŽRAKINTAS** — 3 IDENTITY taisyklės iš 3-sluoksnio audito; Mapper sutartis baigta). Ankstesnis: **2026-07-18** (**Monge/Farmina schemos defektai diagnozuoti** — modelio, ne gamintojo; atskiros pending būsenos + normalizavimo kelias). Ankstesnis: **2026-07-18** (**Condition schema auditas įrašytas** — 212 lentelių; Farmina #110 + 14 Monge = PENDING REVIEW). Ankstesnis: **2026-07-18** (**S212-C Step 4 — Feeding_Service KONTRAKTAS užrakintas** (dokumentas, ne kodas); condition mapping ir universalios eilutės = PENDING DATA AUDIT). Ankstesnis: **2026-07-18 popietė** (**S212-C: svorio laukų migracija APPLY įvykdyta** — `current_weight_kg`+`weight_updated_at`, backup+hash patikra, 0 warnings). Ankstesnis: **2026-07-18 diena** (**S212-C: kategorinių ašių kontraktas UŽDARYTAS (29/29), tikslus MVP baseline sukurtas**; svorio migracija — kitas žingsnis). Ankstesnis: **2026-07-18 diena** (**S212-C Calculator+Repository PROTOTIPAI validuoti** — 25/25 + 7/7; DAR NEINTEGRUOTA į petshop-core). Ankstesnis: **2026-07-18 rytas** (**S212-C ARCHITEKTŪRA užrakinta** — 3 sluoksnių servisas, A/B1/B2/C/D pakopos, atskiri porcijos ir refill autoritetai; petshop-core RECON baigtas — autoriteto matrica užrakinta; B formulių niekur nėra, C refill veikia). Ankstesnis: **2026-07-17/18 naktis** (**S212-B UŽDARYTAS** — šėrimo duomenų modelis, InnoDB migracija, canonical hash, CSV importeris; testai 23/23 + 17/17 + 5/5). Ankstesnis: **2026-07-16 vakaras** (S217 Quattro 12 lent./23 SKU; S218 Josera 5 lent./7 SKU; S219 Prins 0/23 (normos tik ant pakuotės/archyvo pav.); S220 Real Dog 0/21; **S221 Ontario 12 lent./20 SKU; S222 Exclusion +2 lent./4 SKU; S223 Gemon 9 lent./11 SKU (gamintojo PDF); **S224 RC UŽDARYTAS: 8 lent./12 SKU, 13/13 instock (LT+UK+PL, Playwright)**). Ankstesnis: **2026-07-15 vakaras** (po S204–S211 + strateginės sesijos: M8 anketa/login/redagavimas/produktų paieška gyvi; strateginis pivotas į €/dienos skaičiuoklę; TŽ MASTER v1.59; M8 „Mano augintinis" MASTER v3.2 — Raimio PC).





---

# ============================================================
# ★★★ F1 UŽDARYTA (CLOSED) — GALUTINĖ DEPLOYINTA VERSIJA ★★★
# ============================================================

## F1 = COMPLETE. Acceptance atliktas su TIKSLIU kodu, kuris lieka po uždarymo (ne tarpine versija).

**KODĖL PERDARYTA:** pirmasis browser proof buvo su tarpine versija (user-25 guard). Konsultanto reikalavimas: acceptance turi būti su galutine deployinta būsena + jokio hardcode.

**GALUTINIS KODAS (class-feeding-ui.php, deployintas + hash-verified):**
- Product TIK iš serverio validuoto ?product_id= (absint + wc_get_product publish + feeding scope 72/81). JOKIO hardcode (18581 pašalintas, patikrinta strpos===false).
- Render gate: feeding_demo_enabled() — eksplicitinė konstanta PETSHOP_FEEDING_F1_DEMO viršesnė; kitaip host-based (tik dev.avesa.lt). Production (petshop.lt) OFF automatiškai, MIGRATION-SAFE (gate pagal HTTP host, ne DB/config — išlieka net po dev→prod DB migracijos).
- user-25 guard PAŠALINTAS (strpos '!== 25' === false).
- Repo etalonas: dokumentai/class-feeding-ui-final.php (8785 b).

**BROWSER PROOF su GALUTINIU kodu (2026-07-20), #1186 jau OFF:**
- Test URL: https://dev.avesa.lt/my-account/augintinis/?product_id=18581
- Tekstinis (cookie-jar auth fetch): auth_cookie=True, has_login_form=False (realiai user 25), feeding_block=True, shows_testukas=True.
  Perskaityta: "Testukas (5 kg) • Exclusion HYHS02 2kg • Dienos porcija: 90–100 g • Pakuotės užteks: ~20–23 d. • Kaina: 0,94–1,04 €/d • 28,20–31,34 €/30 d."
- Vizualus (Playwright chromium, final_url su ?product_id=18581): DOM tekstas identiškas; screenshots/f1_final_block.png (460×234) + f1_final_page.png.
- VALIDACIJA: be ?product_id= blokas NEatsiranda (įrodo, kad product iš URL, ne hardcode).
- Identifikatoriai: user 25, pet 26, product 18581, svoris iš profilio (ne rankinis).

**UŽDARYMO PATIKRINIMAI (galutiniai):**
- #1186 active=0; PS_FCalc_Service NEBEegzistuoja; naujos feeding klasės OK.
- Fixture pet 26 → NULL (weight_updated_at NULL).
- Test-login (login3) negatyvus: status 200, jokio redirect į paskyrą, jokio auth cookie → NEG_PASS.
- Feeding baseline IDENTIŠKA F0 (tables 226/a6b6f742, rows 3860/94823010, map 455/053db476).
- 0 sesijos temp snippetų aktyvių (be #1186 kuris OFF).

**BŪSENA PO F1:**
- 6 feeding klasės petshop-core (require_once). REST POST petshop/v1/feeding/calculate (ownership 403 be nutekėjimo).
- Pet-page render: host-gated demo (dev ON / prod OFF), product iš ?product_id=. F3 pavers į nuolatinę product-page integraciją (CTA + kontekstas).
- Feeding DB = F0. #1186 OFF.

## KITAS: F2 — M8 profilio create + ps_pets InnoDB
- ps_pets MyISAM → InnoDB.
- primary_product_id PREFLIGHT: ps_pets JAU turi primary_product_id/sku/name/package. F2 suderinti su F0 current_food_product_id — NE aklai pridėti stulpelio. (F1 nelietė.)
- M8 "Sukurti profilį" mygtukas empty state nieko nedaro — realus vartotojas negali pradėti klausimyno. Draft transfer (localStorage→DB po magic-link) nebaigtas.
- Tikras svorio įrašymas per profilio formą (F2 tikrina).

# ============================================================
# ★★★ F1 CLOSED BLOKO PABAIGA ★★★
# ============================================================

---

# ★★★ F0 UŽRAKINTAS — ŠĖRIMO SKAIČIUOKLĖS SISTEMA (2026-07-19) ★★★

> Darbo užsakymas v3 GALUTINIS. Fazių seka F0→F7, kryptis užrakinta. Šis blokas — F0 rezultatas.

## F0 UŽRAKINTAS ĮVESTIES KONTRAKTAS

**Skaičiavimo tapatybė:** kiekvienas skaičiavimas = `pet_id` (arba laikinas `pet_input`) + `product_id`. Be produkto norma NESKAIČIUOJAMA.

**„Dabar naudojamas maistas":** vienam augintiniui vienas pagrindinis produktas. Saugojimas (F2 migracija):
```
ps_pets.current_food_product_id  BIGINT UNSIGNED NULL
ps_pets.current_food_updated_at  DATETIME NULL
```
Įrašomas TIK po aiškaus vartotojo veiksmo („Naudoti kaip dabartinį maistą"). `?product_id=` NEkeičia. Prieš įrašant — pet_id nuosavybės patikra + rūšies validacija. **Prerequisite: ps_pets→InnoDB (F2 pradžioje, per patvirtinimo seką).**

**Rūšies validacija (serveryje):** dog→cat 72+desc; cat→81+desc; abiejose→AMBIGUOUS_SPECIES_SCOPE; nė vienoje→UNSUPPORTED_SPECIES_SCOPE; kitos rūšys→unavailable.

**Keli augintiniai:** vienas—auto; keli—klientas renkasi; negalima priskirti visiems. **Keli maistai:** vienas pagrindinis, kiti laikini palyginimai. **Paskutinis pirkimas:** niekada auto; tik pasiūlymas. **Svečias:** product_id+laikinas svoris; nesaugo; nesukuria profilio.

**Maršrutai (užrakinta):**
```
Prisijungęs:  /mano-paskyra/augintiniai/{pet_id}/maitinimas/?product_id=X
Svečias:      /serimo-skaiciuokle/?product_id=X   (pet_id NEpriimamas)
```
Vienas augintinis→pet_id auto; keli→pasirinkimo ekranas.

**Saugumo kontraktas (acceptance testai):** pet_id nuosavybė serveryje kiekvienam kvietimui; svetimas pet_id→403 be nutekėjimo; svečias su pet_id→atmesta; rašymai nonce+login; UI nėra autorizacija.

## F0 KATALOGO SNAPSHOT — `catalog_snapshot_2026-07-19.csv`

**generated_at:** 2026-07-19 23:56:23 · **repo:** `dokumentai/catalog_snapshot_2026-07-19.csv` · **realizacija:** `dokumentai/f0_snapshot_selection_realization.php`

**Apimtis:** kategorijos 72 (dog) + 81 (cat). Descendants NĖRA (vieno lygio; dog_tree=[72], cat_tree=[81]). Variacijų NĖRA (0). Vardiklis skaičiuojamas parent product lygiu, tik `post_type=product`, `post_status=publish`, kelioms kategorijoms priskirtas produktas — vieną kartą.

**VARDIKLIS (užfiksuotas, nekintantis): 724 parent produktai.**
- species: dog 518 · cat 206 · ambiguous 0 · unsupported 0
- runtime integrity: OK 422 · NO_ACTIVE_VERIFIED 302 · **DATA_INTEGRITY_ERROR 0** (joks produktas nemapinasi į 2+ aktyvias verified lenteles)
- stock (ATSKIRA runtime metrika, NE vardiklio dalis): instock 670 · outofstock 54
- sku_missing: 1 (lieka snapshot su sku_missing=1) · variacijos: 0

**Snapshot SHA-256:** `5d9b545d79910a6f7f51c5610c78257d618710c6ddbb12ef8da94a1de9b0aaad`
**Variations SHA-256:** `2bd8ca220696ca7ef3426991b8fe2e37a7b627dc76b84ad8bb4f3dcada10c2c9`

**Stulpeliai:** product_id, sku, sku_missing, product_type, species_scope, matched_category_ids, stock_status, package_term, feeding_table_ids, active_verified_table_ids, active_verified_table_count, feeding_mapping_count, runtime_integrity_status. feeding_table_ids ir active_verified_table_ids surūšiuoti deterministiškai; count>1→DATA_INTEGRITY_ERROR; „paimti pirmą" DRAUDŽIAMA.

## F0 PILNI BASELINE HASH (64 simboliai — kanoninis etalonas, keičia sutrumpintus)

```
tables (226):  a6b6f742526c24e45635b77c164fa163ec289d817f170c60618f90dc833a2d25
rows   (3860): 948230100c5aaefbea75e081678ead12173c07e9537b3f78af75c3f13ddaddbf
map    (455):  053db47686759f41fc317dfbeb88ad28577a9a6f004cf044226587011ae59adf
```
**Definicijos (atkuriamumui):**
- tables_hash = sha256( join('|', "{id}:{canonical_table_hash|NULL}:{status}:{is_active}" ORDER BY id) )
- map_hash    = sha256( join('|', "{feeding_table_id}:{product_id}:{is_active}" ORDER BY feeding_table_id,product_id) )
- rows_hash   = sha256( join('|', "{id}:{feeding_table_id}:{cell_type}:{weight_from_kg}:{weight_to_kg}:{amount_from_g}:{amount_to_g}" ORDER BY id) )

## F0 STATUSAS
```
Kontraktas STATE.md          DONE
Pilni baseline hash          DONE (64 simb., definicijos užrakintos)
Snapshot + SHA-256           DONE (724 vardiklis, atkuriamas)
Atrankos realizacija saugoma DONE (f0_snapshot_selection_realization.php)
```
**Kitas: F1** — Repository/Calculator/Service/Resolver į petshop-core, vienas Resolver kontraktas, HYHS02 laikinas product_id=18581, #1186 parity testas (2/5/7/9,5/10 kg, 6 laukai 100%) prieš išjungimą, rezultatas augintinio puslapyje be rankinio svorio.

---

# ★★★ F1 EIGA (2026-07-19) ★★★

**PADARYTA IR ĮRODYTA:**
1. **6 core klasės fiziškai petshop-core/includes/** (kraunasi per require_once, NE eval — reali integracija, class_exists visoms True): class-feeding-calculator.php (validated 29/29), class-feeding-repository.php (7/7), class-feeding-package-resolver.php, class-feeding-package-provider.php, class-feeding-service.php, class-feeding-ui.php. petshop-core.php papildytas 6 require_once (backup `_backup_f1/petshop-core.php.bak_20260719_213756` SHA 04bd2b61; po pakeitimo 63bae89f). Plugin health OK, jokių fatal.
2. **Vienas Resolver kontraktas pasirinktas:** paprastasis (`status resolved|unresolved|ambiguous · sellable_unit_food_g · source_value · method canonical_term|bonus_pack|multipack`). Griežtas v2 trust modelis ATIDĖTAS.
3. **PARITY 100%** (core Service vs #1186, 2/5/7/9,5/10 kg, 6 laukai): visi ✓. **Rasta+ištaisyta reali integravimo klaida:** axis_resolution_policy saugo nested `{"current_weight_kg":{"kind":"numeric","policy":"interpolation_allowed"}}`, Calculator laukia plokščio string → interpoliacija (7/9,5kg) lūžo. Pataisyta **Service sluoksnyje** (axis_policy normalizacija nested→flat); abu validuoti komponentai (Calculator 29/29, Repository 7/7) NEPAKEISTI.
4. **REST endpoint `POST petshop/v1/feeding/calculate`** su F0 saugumo kontraktu — 4/4 testai PASS: savininkas(pet26,user25)→200 ok B1 90-100g svoris auto; svetimas→403 FORBIDDEN be nutekėjimo; svečias(weight_kg)→200 used_pet=null; svečias+pet_id→401. Rūšies validacija (dog→72/cat→81) serveryje.
5. **Test fixture (reversible):** pet_id=26 (owner user 25) current_weight_kg NULL→5.00. Dev test data, atstatoma NULL.

**★ F1 TIKSLI BŪSENA (2026-07-19, Raimio patvirtinta): F1 NEUŽBAIGTA.**

```
F1 CORE + API   = PASS
F1 UI + BROWSER = PENDING
F1 OVERALL      = IN PROGRESS
```

**PASS:**
- Feeding klasės realiai integruotos į petshop-core (require_once, class_exists True, ne eval).
- Repository + Calculator axis_policy formato neatitikimas (nested {kind,policy} vs flat) ištaisytas Service sluoksnyje; abu validuoti komponentai nepakeisti.
- Pirminis 5 svorių parity testas 100% (core Service vs #1186, 6 laukai).
- Baziniai REST savininko / svetimo / svečio keliai veikia.
- Feeding DB sąmoningai nekeista.

**PENDING PRIEŠ F1 CLOSE (8 darbai) — BŪSENA 2026-07-19 vakaras:**
1. ⏳ Matomas feeding blokas augintinio puslapyje. (render metodas build_pet_feeding_html parašytas+deployintas core-class-feeding-ui.php; hook woocommerce_account_augintinis_endpoint pri 99 + [petshop_feeding_demo] shortcode)
2. ⏳ Reali prisijungusio vartotojo browser patikra. **BLOKUOTA:** Playwright screenshot per bridge nedavė švaraus rezultato (2 bandymai: 1-as tuščias, 2-as pw.json perrašytas nesusijusiu turiniu). Reikia švaraus Playwright kelio: httpCredentials(WP_USER/WP_APP_PASS) + test-login (wp_set_auth_cookie user 25) → augintinis endpoint → screenshot. Kitos sesijos darbas; NEBEKALTI daugiau šioje.
3. ✅ DONE — 5×6 parity per GYVĄ petshop-core REST (rest_do_request, ne eval). Visi 5 svoriai sutampa su #1186.
4. ✅ DONE — axis_policy nested+flat regression: flat→OK, nested raw→D (įrodo normalizaciją būtiną), nested normalized→OK identiškas flat.
5. ✅ DONE — svetimas egzist (pet26) vs neegzist (999999) pet_id: IDENTIŠKAS 403 atsakymas. „403 be nutekėjimo" PATVIRTINTAS.
6. ✅ DONE — feeding baseline po F1 IDENTIŠKA F0 etalonams (tables 226/a6b6f742, rows 3860/94823010, map 455/053db476 — visi sutampa). Feeding DB NEPALIESTA.
7. ⏳ pet 26 fixture svoris 5.0→NULL. Palikta 5.0, nes reikalinga browser proof (punktas 2). Valyti KARTU su browser proof uždarymu.
8. ⏳ #1186 deaktyvavimas. Palikta AKTYVUS, nes browser proof (2) neatliktas; parity 100% jau įrodyta, bet vizualaus core kelio dar nėra.

**LIKO F1 CLOSE: tik punktai 1,2,7,8 — visi priklauso nuo vieno švaraus browser proof. 3,4,5,6 uždaryti.**

**SAUGOS LIEKANOS UŽDARYTOS (2026-07-19 vėlai):**
- pet 26 svoris grąžintas 5.0→NULL (weight_updated_at→NULL). Fixture kurti IŠ NAUJO kitam browser bandymui.
- Test-login (snippet 1209) deaktyvuotas IR negatyvus HTTP testas PASS: URL status 200, jokio redirect į paskyrą, jokio auth cookie (set-cookie=0).
- Pet-page render (build_pet_feeding_html) apribotas DEV GUARD: `if (get_current_user_id() !== 25) return ''` — tik testinis user 25 (+ HYHS02 hardcoded). Pašalinti guard po browser proof.

**KITAS BROWSER PROOF turi pateikti: faktinį URL + prisijungusio user ID + pet ID + product ID + puslapyje perskaitytą porcijos/trukmės/kainos tekstą (ne vien screenshotą). Tik tada: #1186 off → verify nebevykdo → fixture cleanup → F1 CLOSE.**

**#1186 flag:** lieka aktyvus TIK kaip parity etalonas iki pet-page rendering; jokiam naujam produktui neįjungiamas; išjungiamas iškart po browser proof (punktas 8).

**primary_product_id:** F1 NELIEČIA. Paliekama F2 preflight analizei (esamas primary_product_id vs F0 užrakintas current_food_product_id — suderinti F2).
---

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

**S219 — PRINS: normos EGZISTUOJA, bet tik PAVEIKSLĖLIU 2016 m. archyve. 0 iš 23 SKU (2026-07-16):**

**DB NEPAKITO:** 186 lentelės / 3 268 eil. / 395 map.

**⚠️ PIRMINĖ IŠVADA „NORMŲ NĖRA" BUVO KLAIDINGA — Raimis pataisė, patikra patvirtino.** Klaidos šaknis: ištirtas `prinspetfoods.com` (EN) ir iš jo apibendrinta visam brendui. `.com` puslapio tekstas (19 738 simb., pilnai išgręžtas) turi `Composition/Analysis/Minerals/Energy`, bet šėrimo skilties tikrai neturi. Normos gyvena **`.nl`** svetainėje ATSKIRUOSE puslapiuose.

**RASTAS MECHANIZMAS:** kiekvienas produktas turi `prinspetfoods.nl/aanvulling/{artikel_id}-voedingswijzer` puslapį („šėrimo vadovas"). Archyve (web.archive.org) jų 8, tarp jų MŪSŲ SKU: Standard-Fit, Puppy & Junior Perfect Start, Super Active, Protection Super Active, dieet Huid & Darm (=Diet Skin & Intestinal), VitalCare Resist, TotalCare.

**GALUTINIS BLOKATORIUS — turinys yra PAVEIKSLĖLIS:** voedingswijzer puslapio kūnas = `crowfile_gallery` slideshow su `fotos.crowfile.com/_fotos_/...jpg`. Jokio HTML teksto, jokios lentelės. 2016 m. archyvinės kopijos. NatureCare (drėgnas) — vienintelis su tekstu („20 gram voeding per kg lichaamsgewicht per dag"), nes ten formulė, ne lentelė. **Claude paveiksliukų neskaito (S215/S217 ×3) → kelias uždarytas ties paskutiniu metru.**

**KELIŲ SUVESTINĖ (7 bandyti):**
| # | kelias | rezultatas |
|---|---|---|
| 1 | `prins.nl` | ne tas domenas (krautuvai) |
| 2 | `prinspetfoods.com` | gamintojas EN; tekstas pilnai išgręžtas — šėrimo skilties NĖRA (patikrinta ir Playwright naršykle) |
| 3 | `prinspetfoods.nl` gyvai | Cloudflare; curl ir Playwright abu blokuoti |
| 4 | NL retailer'iai (6) | 134 URL → 3 lentelės, nė viena ProCare |
| 5 | `faunas.lt` (Raimio pasiūlytas) | 38 Prins produktai, Playwright patvirtino: `<table>`=0, „Svoris 3kg/7,5kg" = pakuotės pasirinkimas |
| 6 | Wayback `voedingswijzer` | **RASTA**, bet turinys = crowfile paveikslėlis |
| 7 | wp-json `.com` | Pods CPT be content lauko; media tuščia |

**KAS ATRAKINTŲ (Raimio pusė):** (a) maišo etiketės perrašytas tekstas; (b) tiekėjo datasheet (Prins = dropship šaltinis); (c) žmogus, perskaitantis crowfile paveikslėlius iš archyvo — nuorodos `an2.json`.

**Techninės pastabos:** archive.org CDX **throttlina** — veikia tik forma `url=domain*&filter=original:.*regex.*`, po kelių užklausų grąžina tuščią; tarp puslapių būtinos 4–5 s pauzės, po 10–12 psl. per runą. Klaidos požymis: title „Wayback Machine". `id_` sufiksas timestamp'e duoda originalų HTML be archyvo įpakavimo.

**S220 — REAL DOG: gamintojas normas skelbia TIK ANT PAKUOTĖS. 0 iš 21 (2026-07-16):**

**DB NEPAKITO.** Real Dog: 21 instock, 0 su lentele; 18 sausas + 3 skanėstai (kiaulės ausys/kojos — normos netaikomos).

**ŠALTINIS RASTAS IR IŠTIRTAS:** `realdog.lt` — paties brendo svetainė (nopCommerce, 297 URL, 23 produktai; ZB/Zoobaze prekės, SKU `01O*`/`RD702*`). Produkto puslapyje pilnas EN aprašymas, sudėtis, priedai — ir šėrimo skiltis, kuri sako PAŽODŽIUI:
> *„Feeding instructions: recommended daily amount: **see the table on the packaging**."*

Tai galutinis atsakymas iš pirminio šaltinio: **Real Dog normos viešai neskelbiamos — tik ant maišo.** Ne paieškos spraga. Kiti keliai: realdog.pl = nesusijusi parduotuvė (Sklep Reksio), realdog.de = šunų mokykla, LT retaileriai (petmarket/dogsnanny/petirvet/pet24/kika) — 0 Real Dog URL sitemap'uose.

**KAS ATRAKINTŲ:** Real Dog = ZB prekės → maišai Zoobaze sandėlyje. Etiketės tekstas arba ZB datasheet. Ta pati situacija kaip Prins (S219), tik dar paprastesnė — tiekėjas savas.

**Techninė pastaba:** realdog.lt nopCommerce produktų nuorodos kategorijose yra `<a href="/slug">` be `/product/` prefikso — rinkiklis turi filtruoti assets (`.woff` pagavimas buvo klaida, pataisyta).

**S221 — ONTARIO UŽDARYTAS: 12 lentelių / 20 SKU. Šaltinis — MŪSŲ PAČIŲ post_content (2026-07-16):**

**DB (verifikuota atskiru read-only snippetu):**
| | prieš S221 | **po S221** |
|---|---|---|
| lentelių | 186 | **198** |
| verified | 174 | **186** |
| eilučių | 3 268 | **3 343** |
| map | 395 | **415** |

Sargai visi 0 (orphan_rows, orphan_map, zero_tid ×2, products_2plus, inverted ×2, verified_null_basis, rowcount_mismatch).

**★ SVARBIAUSIAS RADINYS: išorinio šaltinio NEREIKĖJO.** Ontario 52 instock → **20 jau turėjo šėrimo lentelę savo `post_content`** (`Šuns svoris | Paros dozė`), bet **0 buvo mapinta** į FeedingTable. Priežastis: **S214 parseris v6 Ontario nepalietė** — jo brendų sąraše (Monge/Farmina/Josera/Eukanuba/Exclusion/RC) Ontario nėra, o aprašymų darbas (Ontario Group B) buvo padarytas VĖLIAU. Duomenys gulėjo po nosim.

**PAMOKA VISAI EILEI:** prieš ieškant išorinio šaltinio — **patikrinti savo `post_content`**. Gemon/RC (likusieji eilėje) gali turėti tą patį. Patikra pigi: `<table>` + `svor` + `(norma|paros|dienos)`.

**12 lentelių** (`source_version='ontario_post_content_2026-07-16'`, visos `simple`/`weight`/`current`/`verified`):
ids 187–193 po 1 SKU (Adult Large Beef/Chicken/Lamb/White Fish, Adult Medium Lamb, konservai žuvys 200 g, Cat Hair&Skin) · **194** Adult Mini Lamb ×3 SKU · **195** Puppy Mini Lamb ×2 SKU · **196/197/198** konservai ×3/×3/×2 SKU.

**⚠️ SULIEJIMO SPĄSTAI (pagauta DRY metu, prieš rašant):** grupavimas vyksta pagal lentelės turinį → **vienoda lentelė sulieja SKIRTINGUS SKONIUS**. Grupė `[43960, 2799, 2800]` = antiena+spanguolės / jautiena+žolelės / ėriena+šaltalankis. Duomenys teisingi (konservų dozė priklauso nuo skardinės, ne skonio), BET linijos vardas iš pirmo produkto **meluotų** apie kitus du. Sprendimas: `line` = **bendras visų grupės pavadinimų prefiksas** (ne pirmo!), + `reason='Bendra lentele N SKU, vienodos normos'`.

**⚠️⚠️ MANO KLAIDA — ORPHAN'AI (padaryti ir ištaisyti tą pačią sesiją):**
Pirmas APPLY pranešė `tables: 12`, bet DB pakito tik **186→193 (+7)**. Priežastis: **`reason` stulpelis = `varchar(60)`**, o rašiau ~200 simbolių → `$wpdb->insert()` grąžino `false` → `insert_id=0` → **eilutės ir map vis tiek įsirašė su `feeding_table_id=0`: 27 orphan eilutės + 13 orphan map.**
Dvi spragos: (a) nepatikrinau stulpelio pločio prieš rašant; (b) **po `insert()` nebuvo `if($tid<=0) continue;` sargo**.
Ištaisyta v4: trumpas reason (≤60), tid sargas, orphan valymas (`rows_deleted: 27, map_deleted: 13`). Galutinė patikra: visi sargai 0.
**→ NAUJA TAISYKLĖ: prieš bet kokį `insert` į ps_feeding_* — patikrinti `SHOW COLUMNS` pločius; po `insert` — visada tikrinti `insert_id>0` prieš rašant vaikinius įrašus. „totals" iš to paties kodo NĖRA įrodymas — tik DB delta.**

**⚠️ WAF (patvirtinta antrą kartą):** snippetas su literaliu `DELETE FROM` POST body → ModSecurity blokuoja, `code-snippets` REST create grąžina ERR. Sprendimas: `$wpdb->delete($table, array(...))`. Papildo žinomą `GROUP_CONCAT` taisyklę: **WAF filtruoja SQL raktažodžius snippet'o kode, ne tik užklausose.**

**Snippetai serveryje (visi išjungti):** #1025 v1, #1026 v2, #1028 v4 (veikiantis), #1029 Verify.

**NEĮRAŠYTA (32 iš 52):** Monoproteino konservai 48368–48375 (8 SKU, aprašymai 3 500–3 700 simb., bet `<table>` nėra), kačių skanėstai/konservai, konservų rinkinys 8×200 g. Šiems lentelių `post_content` neturi.

**S222 — EXCLUSION: tikra būklė + 2 lentelės / 4 SKU iš post_content (2026-07-16):**

**DB:** 198 → **200** lentelės · 3 343 → **3 359** eil. · 415 → **419** map · verified **188**. Sargai visi 0 (nepriklausoma patikra).

**★ EXCLUSION TIKRA BŪKLĖ (buvo neaišku — dabar pamatuota):**
| | |
|---|---|
| Lentelių DB | **9 → 11** |
| Produktų viso | 81 (74 instock) |
| **Instock SU norma** | 34 → **38** |
| **Instock BE normos** | 40 → **36** |

Iš 9 senų: **83–86** = 4 kačių lentelės (`post_content_v6`, S214) · **165–169** = Hypoallergenic ×2 + Mediterraneo Noble Grain ×3, dengia 34 šunų SKU (`exclusion_vetfarmas`, S215). **Taigi S215 padarė šunų sausąjį — bet „Exclusion sutvarkytas" nebuvo tiesa.** Likę 36 = mono protein konservai, šuniukų matricos (HYPA11/INPA11/NGP*), hidrolizuoti.

**ĮRAŠYTA 2:**
| id | line | forma | ašis | eil. | SKU |
|---|---|---|---|---|---|
| 199 | Hydrolyzed Hypoallergenic mažų veislių šunims | simple | weight | 6 | HHFS02 |
| 200 | Mediterraneo Monoprotein sausas sterilizuotoms katėms | **transposed** | **svorio_valdymas** | 10 | NGCSB01, NGCST01, NGCST12 |

**★ S215 BLOKATORIUS NUIMTAS:** `NGCST01/NGCST12` S215 liko neįrašyti, nes petmarket buvo VIENINTELIS šaltinis su sulaužytu HTML (reikėjo atstatymo). Dabar mūsų `post_content` duoda **tuos pačius skaičius** (`2kg→30/20 · 3→50/40 · 4→60/50 · 5→70/60 · 6→75/65`) — **antras nepriklausomas šaltinis, sutampantis su S215 atstatymu.** Įrašyta.

**⚠️⚠️ SVARBIAUSIA PAMOKA — KONSERVŲ LENTELĖS YRA SKARDINĖMIS, NE GRAMAIS:**
Automatinis parseris norėjo rašyti šiuos, ir tai būtų buvęs šiurkštus melas:
```
AM20      antraštė: "Kiekis (400 g) / 24 val."  reikšmės: ½–1 · 1–1¾ · 2¼–2¾   -> SKARDINĖS po 400 g
NGCSCW85  "Kiekis palaikant svorį"              reikšmės: 1½ · 2¼ · 3 · 3¼      -> SKARDINĖS po 85 g
NGCKCW85  "Konservo kiekis / 24 val"            reikšmės: 1¼–2 · 2–3            -> SKARDINĖS po 85 g
```
Parseris „1 ½" perskaitė kaip **1** → būtų įrašęs **„1 g per parą 2 kg katei"**. Sugauta žiūrint į žaliavą prieš APPLY, ne per sargus (monotoniškumo sargas TOKIO dalyko nepagauna — 1<2<3 yra monotoniška).
**→ NAUJA TAISYKLĖ: prieš rašant patikrinti STULPELIO ANTRAŠTĘ ir VIENETUS, ne tik skaičių tvarką. Vulgarios trupmenos (½ ¼ ¾) lentelėje = beveik visada skardinės/porcijos, ne gramai.**

**⚠️ Parserio spraga (ištaisyta):** Ontario versija ėmė **tik pirmą `<table>`**. Exclusion aprašymuose pirma lentelė = analitinė sudėtis, šėrimo lentelė 2-a/3-ia → 26 SKU krito su „0 eilučių". v2 skenuoja visas lenteles ir renkasi tą, kuri turi `svor` + `(norma|kiekis|paros|dozė)` ir ≥3 parsinamas eilutes.

**EXCLUSION PENDING (36):**
1. **Konservai su skardinėmis** (AM20, NGCSCW85, NGCSBW85, NGCKCW85, NGA*A40, DM/PM/VM/QM...) — reikia trupmenų parserio (½¼¾) + skardinės dydžio (85/400 g iš SKU arba antraštės) → konversija į gramus. Duomenys YRA, mechanika aiški. **Atskiras modulis.**
2. Šuniukų matricos (HYPA11, INPA11, NGP*) — S215 blokatorius lieka.
3. `NGCGC01` — 1 lentelė aprašyme, bet šėrimo nerasta.
4. Duomenų higiena: `d0ef54405833` (hash vietoj SKU), `DP-EXCL-HYPO-KIAUL-2KG-x2` (2 vnt. rinkinys).

**Snippetai (išjungti):** #1031 pc v1, #1032 pc v2, #1034 Gramai v1, #1035 Verify.

**S223 — GEMON: 9 lentelės / 11 SKU iš gamintojo PDF. Naujas šaltinio tipas (2026-07-16):**

**DB:** 200 → **209** lentelės · 3 359 → **3 585** eil. · 419 → **430** map · verified **197**. Sargai visi 0.
**DB delta sutapo su „totals" visais trim matmenimis** (+9/+226/+11) — S221 orphan pamoka pritaikyta.

**★★ NAUJAS ŠALTINIO TIPAS — GAMINTOJO PDF DATASHEET:**
`gemon.it` = **503** (miręs). Gemon = **Monge** grupės brendas → `monge.it` gyvas: **138 Gemon produktų puslapių, 55 PDF**. HTML lentelių puslapiuose NĖRA (`<table>`=0), bet kiekvienas produktas turi datasheet PDF:
`monge.it/wp-content/uploads/2023/09/Gemon-maxi-adult-with-chicken-and-rice-ENG.pdf`
**Kelias: sitemap → produkto psl. → `href=*.pdf` → `pdftotext -layout` → blokas nuo `Recommended daily feeding intakes (grams/day)`.** 45 sausų PDF → **20 lentelių ištraukta**.

**⚠️ TECHNIKA:** `poppler-utils` GitHub runneryje **NEIŠLIEKA tarp paleidimų** — `sudo apt-get install -y poppler-utils` būtinas KIEKVIENAME rune. Be jo `pdftotext: not found`. `-layout` vėliavėlė privaloma (išsaugo stulpelių lygiavimą).

**FORMA: `Silhouette thin / ideal / heavy` = `body_condition`** (S212 taksonomija) → `transposed`. Pridėtas naujas sargas: **thin ≥ ideal ≥ heavy** kiekviename svoryje — Gemon logikos patikra, kurios monotoniškumo sargas nepagautų.

**ĮRAŠYTA 9 lentelės / 11 SKU** (`source_version='gemon_monge_pdf_2026-07-16'`):
| id | line | forma | eil. | SKU |
|---|---|---|---|---|
| 201 | Maxi Adult vištiena | transposed/body_condition | 24 | 01MB431101 |
| 202 | All Breeds Adult ėriena | " | 42 | 01MB421301 |
| 203 | All Breeds Adult tunas | " | 42 | 01MB421201 |
| 204 | Regular All Breeds Adult vištiena | " | 42 | 01MB421101 |
| 205 | Mini Adult vištiena | " | 21 | 01MB411101 |
| 206 | Mini Adult lašiša | " | 21 | **01MB412101 + 01M412102** |
| 207 | Adult katėms vištiena+kalakutiena | " | 15 | 01MB511101 |
| 208 | Sterilised katėms kalakutiena | " | 15 | 01M511303 |
| 209 | Kitten vištiena | age_weight/age | 4 | **01M510103 + 01MB510101** |

**⚠️ PUPPY MATRICA ATIDĖTA SĄMONINGAI (01MB400101):** PDF eilutės turi TARPUS —
```
Puppy body weight (kg)   1    3    5   10   15   20   25   30   40   50   60   70
Months 1 - 2            67  159  233  341  514
Months 8 - 12                     103  184  306  380  417  442  609  735  825
```
`Months 8-12` prasideda ne nuo 1 kg. Skaidant per tarpus (`split(/\s+/)`) normos priskirtų NE TIEMS svoriams. Reikia **pozicinio parserio: antraštės stulpelių simbolių offsetai `-layout` tekste → reikšmės imamos pagal offsetą.** Tas pats liestų `all-breeds-puppy-tuna` ir `mini-puppy-chicken` (turim jų duomenis).

**GEMON LIKUTIS (5 iš 16):**
| SKU | kliūtis |
|---|---|
| 01MB400101 Puppy & Junior | matrica — pozicinis parseris |
| 01M511503 Dry Cat Urinary | PDF **YRA** (`Gemon-adult-cat-urinary-with-chicken-and-rice-ENG`), tik nepateko į 30 apdorotų — vienas runas |
| 01M511703 Dry Cat Beef & rice | adult kačių jautienos PDF monge.it nėra |
| 01MB511301 Sterilised light | PDF nerastas |
| 01MB511201 Adult katėms lašiša+tunas | yra tik `sterilised` versija, ne `adult` |

**Snippetai (išjungti):** #1039 Gemon Feeding v1, #1040 Verify.

**S224 — RC (ROYAL CANIN) UŽDARYTAS: 13/13 instock, 0 be normos (2026-07-16):**

**DB:** 209 → **217** lentelės · 3 585 → **3 679** eil. · 430 → **442** map · verified **205**. Sargai visi 0. Delta = totals abiem etapais.

| | prieš | po |
|---|---|---|
| RC instock | 13 | 13 |
| **su norma** | **1** | **13** |
| **be normos** | **12** | **0** |

**ŠALTINIAI:** `royalcanin.lt` = 403. `royalcanin.com/{cc}` = gyvas, JS → **Playwright būtinas** (curl kategorijose mato 0 produktų).
**⚠️ Kelias: `/{cc}/{cats|dogs}/products/retail-products?technology=dry` + `&page=2`.** Be `page=2` dingsta pusė (LT: 21 vs realiai 56).
**⚠️ RC LT asortimentas ≠ mūsų asortimentas.** GIANT ADULT, MEDIUM ADULT, HAIRBALL CARE, INDOOR lietuviškame puslapyje NĖRA → paimta iš **UK** ir **PL**. Normos identiškos, skiriasi tik kalba. **Tai bendra taisyklė: jei LT nėra, tikrinti /uk, /pl, /de.**

**ĮRAŠYTA 8 lentelės / 12 SKU** (id 210–217):
| id | line | ašis | eil. | SKU | šaltinis |
|---|---|---|---|---|---|
| 210 | Sensible 33 | body_condition | 8 | 127380, 127380228 | LT |
| 211 | Sterilised 37 | body_condition | 8 | 122370183, 122340 | LT |
| 212 | Hair & Skin Care | body_condition | 8 | 217570, 122110 | LT |
| 213 | Giant Adult | **activity_level** | 18 | 131350 | **UK** |
| 214 | Medium Adult | **activity_level** | 15 | 141150 | **UK** |
| 215 | Hairball Care | **activity_level** | 8 | 216110, 121550 | **UK** |
| 216 | Indoor 27 | **activity_level** | 21 | 123950 | **PL** (turtingesnė nei UK: 7 svoriai × 3) |
| 217 | Oral Care | body_condition | 8 | 216210 | LT |
(+ id=99 sena, 1 SKU, iš S214.)

**★ „LIESA" KLAUSIMAS IŠSPRĘSTAS EMPIRIŠKAI (ne spėjimu):**
LT `oral-care` stulpelis pavadintas **„Liesa"**, kituose LT psl. — **„Idealus svoris"**. Patikrinta dviem nepriklausomais būdais:
1. **Skaitinis sutapimas:** oral-care „Liesa" = 47/57/67/77; sterilised-37 „Idealus svoris" = 47/57/67/76 → tas pats stulpelis.
2. **Kryžminė kalba:** UK `hairball-care` = `INACTIVE (low energy) | IDEAL WEIGHT (normal activity)` → 3kg: 36 g | **45 g**. Didesnysis stulpelis = IDEAL. LT oral-care „Liesa"=47 yra didesnysis.
→ **„Liesa" = idealus svoris.** Įrašyta `body_condition='ideal'`, `reason='LT etikete "Liesa" = idealus svoris (patikrinta UK)'`.

**⚠️ LT VERTIMAI NEPATIKIMI — užfiksuota:** LT `hair-and-skin-care` = „Idealus svoris 45 / Viršsvoris 36"; UK `hairball-care` = „IDEAL 45 / INACTIVE 36" — **identiški skaičiai, skirtingos etiketės** (viršsvoris vs neaktyvus). Skaičiai teisingi abiem atvejais, bet ašies semantika LT puslapiuose plaukioja. Rašant RC iš LT — visada kryžmiškai tikrinti su /uk.

**⚠️⚠️ RC LENTELIŲ SPĄSTAI (visi pagauti prieš rašant):**
1. **Mišrus šėrimas:** `47 g (30 g + 1 šlapio pakelio)` → **pirmas skaičius = grynas sausas**, skliaustuose sausas+šlapias. Atskiros `Normalus (Mišrus šėrimas)` eilutės — atmestos. UK atitikmuo: `(4 cup + 2/8)` → matas puodeliais, irgi atmestas.
2. **`medium-adult-1095` (LT) rodo `Šuns svoris | Tik šlapias maistas` → `5+1/2 pak.`** = ŠLAPIO maisto pakuotės. Būtų įrašęs „5 g/parą 12 kg šuniui". Todėl MEDIUM ADULT paimtas iš UK, kur yra sausa lentelė. UK psl. 2-a lentelė (`CAN` stulpelis) — irgi mišri, atmesta.
3. **Išdėstymas nevienodas:** `sterilised-ageing` — svoris stulpeliuose; `sensible-33`, `oral-care`, `hair-and-skin` — svoris eilutėse; UK šunų — `DOG IDEAL WEIGHT` eilutėse × activity stulpeliuose. **Universalus parseris negalimas** → visos 8 lentelės rašytos rankiniu būdu po vizualaus patikrinimo.
4. Nauji sargai: **kačių sausas <10 g/parą** ir **šunų <20 g/parą** → gaudo pakelių/puodelių maišymą su gramais. Plius `low≤moderate≤high` ir `ideal≥overweight`.

**Snippetai (išjungti):** #1042 RC Feeding v1, #1043 Verify, #1044 RC Feeding v2, #1045 Final Verify.


**★★★ SESIJA 2026-07-16 — ŠĖRIMO LENTELIŲ KONVEJERIS (S217–S224). KONSOLIDUOTA SANTRAUKA ★★★**

**REZULTATAS: 169 → 217 lentelės · 3 030 → 3 679 eilutės · 365 → 442 SKU su norma.**
Grynas priedas: **+48 lentelės, +649 eilutės, +77 SKU.** Verified: **205**.
Kiekvienas apply verifikuotas ATSKIRU read-only snippetu; visi 9 sargai 0 po kiekvieno rašymo.

| brendas | rezultatas | šaltinis | būklė |
|---|---|---|---|
| Quattro | 12 lent. / 23 SKU | kgshop.eu (gamintojas) | ✅ |
| Josera sausas | 5 / 7 | josera.de (gamintojas) | ✅ (Family — sulaužytas HTML) |
| Ontario | 12 / 20 | **mūsų post_content** | ✅ sausas |
| Exclusion | 2 / 4 (viso 11 lent., 38/74) | **mūsų post_content** | 🟡 36 be normos |
| Gemon | 9 / 11 | **monge.it PDF datasheet** | 🟡 5 be normos |
| **RC** | **8 / 12 → 13/13 instock** | **royalcanin.com LT+UK+PL** | ✅ **UŽDARYTAS** |
| Prins | **0 / 23** | — | ⛔ BLOKUOTA |
| Real Dog | **0 / 21** | — | ⛔ BLOKUOTA |

**[SPRENDIMAS] KONSERVAI IŠ EILĖS IŠEINA — dirbam TIK SAUSĄ.** (Raimis, 2026-07-16: „gal kol kas su sausu susitvarkom, su konservais labai daug niuansų".) Tai uždaro ir seną neaiškumą, ar €/dienos skaičiuoklė apima šlapią maistą (M8 v3.2 tylėjo) — kol kas NE.

**⛔ BLOKUOTA — REIKIA RAIMIO (69 SKU):**
| brendas | SKU | ko reikia |
|---|---|---|
| **Prins** | 23 | maišo etiketės TEKSTAS (perrašytas, ne nuotrauka) arba tiekėjo datasheet. Normos egzistuoja tik `prinspetfoods.nl/aanvulling/{id}-voedingswijzer` puslapiuose, kurių turinys = **paveikslėlis** 2016 Wayback archyve. 7 skaitmeniniai keliai išbandyti ir uždaryti. |
| **Real Dog** | 21 | maišo etiketė arba **ZB (Zoobaze) datasheet — tiekėjas SAVAS**. realdog.lt sako pažodžiui: „recommended daily amount: see the table on the packaging". Gamintojas normų viešai neskelbia. |
| **Ontario šlapias** | 25 | pakuotės etiketė — **SAVAS SANDĖLIS Liucionių lentynoje** (14 konservų + 2 skanėstai + 9 troškiniai/pastos). Gamintojas šlapiam normų neskelbia (S225 įrodymas). Etiketės kelias patikrintas: S221 konservų lentelės buvo iš post_content = perrašytos nuo pakuočių. |

**🟡 ATIDĖTA (turim duomenis, reikia darbo):**
- **Gemon puppy matrica** (01MB400101 + tuna/mini variantai): PDF eilutės su TARPAIS (`Months 8-12` prasideda ne nuo 1 kg) → reikia **pozicinio parserio pagal stulpelių char-offsetus** `-layout` tekste. Skaidant per tarpus normos atsidurtų ties ne tais svoriais.
- **Gemon 01M511503 Urinary**: PDF YRA (`Gemon-adult-cat-urinary-with-chicken-and-rice-ENG`), tik nepateko į 30 apdorotų — **vienas runas**.
- **Gemon 3 SKU** (Beef cat, Sterilised light, Adult lašiša+tunas): monge.it PDF nėra.
- **Exclusion 36**: šuniukų matricos (S215 blokatorius), `NGCGC01`, duomenų higiena (`d0ef54405833` hash vietoj SKU, `DP-EXCL-HYPO-KIAUL-2KG-x2` 2 vnt. rinkinys).
- **Josera 38 konservų SKU** + Exclusion/Ontario konservai — pagal sprendimą IŠ EILĖS IŠEINA.

**★★ NAUJI ŠALTINIŲ TIPAI (sesijos pagrindinis atradimas):**
1. **MŪSŲ PAČIŲ `post_content`** — Ontario (20 SKU) ir Exclusion (4) lentelės gulėjo pas mus. S214 parseris v6 jų nepalietė: jo brendų sąraše jų nebuvo, o aprašymų darbas padarytas VĖLIAU. **TAISYKLĖ: prieš ieškant išorinio šaltinio — patikrinti savo `post_content`** (`<table>` + `svor` + `(norma|paros|dozė)`).
2. **GAMINTOJO PDF DATASHEET** — `gemon.it` 503 (miręs), bet Gemon = Monge brendas → `monge.it` kiekvienam produktui turi PDF su lentele, HTML puslapyje `<table>`=0. Kelias: sitemap → produkto psl. → `href=*.pdf` → `pdftotext -layout`.
3. **KITOS ŠALIES PUSLAPIS** — jei LT asortimente linijos nėra, imti iš `/uk`, `/pl`, `/de`. Normos identiškos, skiriasi tik kalba. RC GIANT/MEDIUM/HAIRBALL/INDOOR taip ir uždaryti.

**★★ NAUJOS TAISYKLĖS (visos brangiai užsidirbtos):**
1. **DB DELTA, NE „TOTALS".** Snippet'o pranešimas „12 lentelių" nėra įrodymas. S221: totals=12, DB delta=+7 → 5 insert'ai tyliai nepavyko.
2. **Prieš `insert` — `SHOW COLUMNS` pločiai; po `insert` — `if($tid<=0) continue;`.** `reason` = `varchar(60)`; 200 simb. → `insert()` false → `insert_id=0` → **27 orphan eilutės + 13 orphan map** su `feeding_table_id=0`. Išvalyta `$wpdb->delete(...,array('feeding_table_id'=>0))`.
3. **WAF blokuoja SQL raktažodžius snippet'o KODE** (ne tik užklausose). Literalus `DELETE FROM` POST body → create grąžina ERR. Sprendimas: `$wpdb->delete()`. Papildo žinomą `GROUP_CONCAT` taisyklę.
4. **⚠️ VIENETAI: tikrinti STULPELIO ANTRAŠTĘ, ne skaičių tvarką.** Monotoniškumo sargas NEPAGAUNA vienetų klaidos (1<2<3 tvarkinga). Sugauti atvejai:
   - Exclusion `AM20`: antraštė „Kiekis (400 g)", reikšmės `½–1` → **skardinės**. Parseris būtų rašęs „1 g/parą".
   - RC `medium-adult` LT: `Tik šlapias maistas → 5+1/2 pak.` → **pakuotės**.
   - RC UK: `412 g (4 cup + 2/8)` → puodeliai skliaustuose.
   - **Vulgarios trupmenos (½ ¼ ¾) lentelėje ≈ visada skardinės/porcijos.**
   - Nauji sargai: kačių sausas **<10 g/parą**, šunų **<20 g/parą** = neįmanoma.
5. **Mišraus šėrimo reikšmės:** `47 g (30 g + 1 šlapio pakelio)` → **pirmas skaičius = grynas sausas**. Atskiros `(Mišrus šėrimas)` eilutės — atmesti.
6. **`poppler-utils` GitHub runneryje NEIŠLIEKA tarp paleidimų** — `sudo apt-get install -y poppler-utils` KIEKVIENAME rune; `-layout` privaloma.
7. **Puslapiavimas gaudo:** RC kategorijos → be `&page=2` dingsta pusė (21 vs 56). `code-snippets/v1/snippets?per_page=100` grąžina TIK 100 (realiai 522) → **būtina `&page=N` kilpa**, kitaip „nieko nerasta" yra melas.
8. **Suliejimo spąstai:** grupuojant pagal lentelės turinį vienoda lentelė sulieja SKIRTINGUS skonius → `line` vardas turi būti **bendras visų grupės pavadinimų prefiksas**, ne pirmo produkto. + `reason='Bendra lentele N SKU, vienodos normos'`.
9. **LT vertimai nepatikimi.** LT `hair-and-skin` „Idealus 45 / **Viršsvoris** 36" = UK „IDEAL 45 / **INACTIVE** 36" — identiški skaičiai, skirtinga ašies semantika. LT `oral-care` „Liesa" = idealus svoris (patvirtinta skaitiniu sutapimu su Sterilised 37 IR UK kryžmine patikra). **RC iš LT — visada kryžmiškai su /uk.**
10. **Sub-brendų URL neturi tėvinio brendo vardo** (josidog/josicat ≠ „josera"). Filtras juos nukirto → klaidinga išvada „šaltinio nėra".
11. **Neskelbti „šaltinio nėra" ištyrus vieną domeną.** Prins: `.com` neturėjo normų, `.nl` turėjo. Raimis pataisė; išvada atšaukta.

**SNIPPETŲ HIGIENA:** visi **28 sesijos snippetai (#1018–#1045) IŠJUNGTI** (patikrinta su puslapiavimu).
**⚠️ LIKO IŠ ANKSČIAU — 11 TEMP snippetų VIS DAR AKTYVŪS** (ne šios sesijos, nelieta): `#736 Core Act2 tmp`, `#738 ESP v4 Final tmp`, `#797 JS Fix tmp`, `#798 Dash Recon tmp`, `#799 Dash Dep`, `#800 Dash Act`, `#801 Dash Test`, `#802 Photo Recon`, `#803 Photo Dep`, `#804 Photo Act`, `#805 Photo Test`. Sutampa su seniau žinomu „11 TEMP snippets — need cleanup". **Taip pat: #492 ir #493 „Filtrų Atidarymas" v2 IR v1 abu aktyvūs — galimas dublis.**

**S225 — ONTARIO SAUSAS UŽDARYTAS 18/18. Šlapio aklavietė įrodyta (2026-07-16):**

**DB:** 217 → **222** lentelės · 3 679 → **3 759** eil. · 442 → **449** map. Sargai visi 0. Delta = totals (+5/+80/+7).

**Ontario būklė po S225:** instock 52 → **sausas 18/18 SU NORMA (0 be)** · konservai 9/23 · skanėstai 0/2 · kita (troškiniai/pastos) 0/9.

**ĮRAŠYTA 5 lentelės / 7 SKU** (`source_version='ontario_pet_wayback_2026-07-16'`, visos `transposed`, **NAUJA ašis `lifestyle`** outdoor|indoor, svoriai 1–6 kg):
| id | line | SKU |
|---|---|---|
| 218 | Adult Short Hair | 640214268-1 |
| 219 | Adult Exigent (išrankioms) | 640000, 40626 |
| 220 | Adult Hairball | 640220-1, 640220103 |
| 221 | Adult Sensitive | 640213774 |
| 222 | Adult Sterilized Lamb | 640416-1 (reason: bloke 2 lent., imta pirma po antraštės) |

**★ ŠALTINIO KELIAS (Raimio nurodymu ieškota dinozoo.lv/placek.cz):**
1. `dinozoo.lv` — 795 Ontario URL, `superzoo.cz` — 979. **ABU Plaček e-shopai normų NESKELBIA** — tik specifikacijos (EAN, kokybė, gramaž). Patikrinta pilnu tekstu (24–27k simb.), ne vien lentelėmis.
2. `placek.cz/en/brand` → oficialus brendo saitas **`ontario.pet`**.
3. `ontario.pet` — **Cloudflare kietas blokas** (curl 403 „Just a moment", Playwright „Sorry, you have been blocked" — griežtesnis nei Prins).
4. **→ Wayback:** `web.archive.org/web/20240522103018/ontario.pet/en/for-cats-en/food-adult/` — **13 pilnų lentelių HTML** (ne paveikslėliai, skirtingai nei Prins!).

**★ NAUJA AŠIS `lifestyle`:** gamintojo forma `Cat weight (kg) | Daily feedings - outdoor | Daily feedings - indoor`. Sargas: outdoor ≥ indoor kiekviename svoryje.

**Poravimo raktas:** gamintojo „Exigent" = mūsų „išrankioms katėms". Short Hair/Hairball/Sensitive/Sterilized Lamb — tiesioginiai.

**⚠️ Lentelė↔produktas susiejimas Wayback puslapyje:** visos lentelės po „Feeding instructions" tabo antrašte → artimiausios antraštės metodas NEVEIKIA. Veikia **skaidymas pagal `ONTARIO ...` h2/h3 blokus**. Adult psl.: 12 blokų / 13 lentelių — perteklinė Sterilized Lamb bloke (produktas be atskiros antraštės, tikėtina Sterilized Salmon). Imta pirmoji po antraštės, prielaida užfiksuota `reason`.

**⛔ ŠLAPIO AKLAVIETĖ — ĮRODYTA, NE SPĖTA:**
Wayback kategorijos `for-dogs-en/cans` (18 produktų, tarp jų visi mūsų monoproteinas + troškiniai), `for-cats-en/cans` (11), `pouches` (10), `treats` (18, tarp jų Malt Bits + Dental Bits):
- EN šunų konservai: **„Feeding" = 0 kartų visame puslapyje**; „Composition" tabas = 18. Šėrimo tabo šlapiems NĖRA.
- CS kačių konservai: lentelių 0, „dávkování" tik navigacijoje.
**→ Gamintojas šlapiam maistui normų neskelbia iš principo** (sausas turi, šlapias ne — svetainės struktūra, ne paieškos spraga).
**→ Vienintelis kelias likusiems 25 (14 konservų + 2 skanėstai + 9 troškiniai/pastos): pakuotės etiketė. Ontario = legacy = SAVAS SANDĖLIS — skardinės guli Liucionių lentynoje, etiketės fiziškai pasiekiamos Raimiui.** (Skirtingai nei Prins/Real Dog dropship.)

Pastaba: S221 įrašytos 9 konservų lentelės (id 192, 196–198) buvo iš mūsų post_content — t. y. kažkada jau perrašytos nuo pakuočių. Tai patvirtina, kad etiketės kelias veikia.

**Techninės pastabos:**
- `ontario-pet.com` = japonų vet. klinika (netikras taikinys).
- GitHub Contents API `PUT` grąžina **409** kai GET SHA užkešuotas → visada PUT kilpa su šviežiu SHA (`?nocache=$RANDOM`) ir retry.
- Snippetai #1047 (Ontario Cat Feeding v1) ir #1048 (Final Verify) — išjungti.

**★★★ S212-A — ETAPO 2 AUDITAS IR PIRMOS KOREKCIJOS (2026-07-17) ★★★**

**Kontekstas:** M8 MASTER **v3.3** patvirtintas kaip strategijos freeze. Sprendimų triažas: **A lygis = tik #3**; B = #5, #15, #16 + reprice/QA/analytics; C = visa kita (lojalumas nestabdo S212). **#17 uždarytas — FeedingTable jau egzistuoja.** S212 skaidomas į A (auditas), B (duomenų procesas), C (engine).

**GALUTINIAI ETAPO 2 VARDIKLIAI (po korekcijos):**

| rodiklis | prieš | **po** |
|---|---|---|
| MVP tinkami (`product_cat` 72/81, instock, publish) | 667 | **666** |
| **A kelias** (pakuotė + kaina) | 593 · 88,9 % | **629 · 94,4 %** |
| **B kelias** (+ verified FeedingTable) | 393 · 58,9 % | **406 · 61,0 %** |
| blokuoja pakuotė | 74 | **37** |
| blokuoja lentelė | 200 | 223 |
| **pajamų svertas** | — | **NEIŠMATUOJAMAS** |

**★ SCOPE — KANONINIS, NE EURISTIKA:** `product_cat` ∈ {**72** Sausas maistas šunims, **81** Sausas maistas katėms}. Kraikai (107), skanėstai (95/96), papildai, konservai (73/79) — atskiros šakos, iškrenta savaime.
**Pamoka:** pirmas vardiklis buvo pagal pavadinimo raktažodžius + `pa_gyvuno_rusis` → įsileido šinšilų/triušių pašarą IR kraikus (per `granul` žodį „kraikas… granulės"), o kartu **išmetė realų sausą maistą**, kurio pavadinime nėra „sausas/pašaras/maistas". Dvi klaidos priešingomis kryptimis (571 vs 666).
**Nuotekis tikrintas ABIEM kryptimis** (pirma tikrinau tik vieną — spraga): iš 72/81 → 47 kandidatai, visi skanėstai/konservai; į 72/81 → 6 vėliavos, **1 tikra klaida**.

**★★ PAKUOČIŲ AUDITAS — DOKUMENTO PRIELAIDA APVERSTA:**
- `pa_pakuotes_dydis`: **80 terminų** (v3.2 spėjo 72), **visi paprastos masės**, visi `normalized`. Nė vieno multipack/bonus **atribute**.
- **Problema ne sintaksė, o PRISKYRIMAS.** Todėl **dvi atskiros būsenos**: `term_parse_status` (normalized|unsupported|ambiguous) ir `assignment_status` (detected → candidate_value → source_verified → fixed → regression_checked). **`auto_verified` uždraustas** — skambėtų kaip „patikrinta“, nors terminas gali būti suprantamas ir kartu klaidingas.
- **Akcijinės pakuotės:** atributas laiko TIK bonuso dalį (`JosiCat 15+3kg` → atributas „3 kg“, realiai 18 000 g). €/dieną klystų 6×, ir jokia „ambiguous“ to nepagautų.
- **Visi 666 — `simple`, variacijų 0** → `variation_id` migracija **ATIDĖTA (YAGNI)**, daroma tik atsiradus tikram varianto atvejui su lentele.

**★★ PARSERIS — GOLDEN TESTS 14/14:**
`1,5 kg`→1500 · `10+1 kg`→11000 · `12,5+2,5 kg`→15000 · `15+3kg`→18000 · `7 kg × 2`→14000 · `12 × 400 g`→4800 · `6-12 kg`→ambiguous · `M`/`1 vnt.`→unsupported.
**⚠️ KABLELIO SPĄSTAS:** pirmas parseris `10+1 kg` pavertė į **1 100 g** — klasė `[\d.,]+` nurijo kablelį iš „…katėms,10+1 kg“ → `,10`→`.10`→0,1 + 1 = 1,1. **LT kablelis yra ir dešimtainis skirtukas, ir skyryba.** Taisymas: `preg_replace('/(?<=\d),(?=\d)/u','.')` tada likusius kablelius pašalinti.
**Pavadinimas = anomalijos DETEKTORIUS, ne tiesos šaltinis.**

**★★ SVORIO LAUKŲ SEMANTIKA (naujas radinys):**
| laukas | užpildyta | verdiktas |
|---|---|---|
| `wc_weight` | 80,2 % | **kryžminis signalas, NE šaltinis**: 313/352 sutampa (88,9 %), bet uodega — šiukšlės (`01M0400103` atributas 7,5 kg, `wc` 3 kg; 18 Monge: 2,5 kg vs 3 kg) |
| `_zb_weight` | 48,3 % | tas pats — ateina iš ZB `weight_brutto` |
| `_legacy_weight_raw` | 31,9 % | reta |

**ZB XML `weight_brutto` = BRUTO siuntimo svoris ir jis šlamštas** (0,2 kg septynkilograminiam maišui; matmenys 20×20×20 visiems). Jis suvestas ir į `wc_weight`, ir į `_zb_weight`.

**★★★ IMPORTO PERRAŠYMO RIZIKA — MANO IŠVADA BUVO KLAIDINGA DU KARTUS:**
1. Pirma pasakiau „ZB importas perrašys taisymus" remdamasis `is_update_attributes=1` + `full_update`. **Skaičiau MIRUSIO importo konfigūraciją:** #1 `goods_clean.xml` — `last_activity` **2026-05-27**, `imported=0`, `updated=0`, `skipped=2045`.
2. **Gyvi importai kategorijų ir atributų NELIEČIA:** #2 `products.php` (ZB), #3 `stocks.php`, #5/#7 VF — visi `is_update_categories=0`, `is_update_attributes=0`.
3. **`pa_pakuotes_dydis` nerašo JOKS kodas** — visame `petshop-xml` ir temoje jis tik skaitomas (`home-popular-products.php`). `product_cat` rašo tik VF (`class-vf-import.php:419`).
4. **Empirinis įrodymas:** `01M182102` (ZB) modifikuotas 11:02, `CHYP01` (VF) 14:00 — abu su `15 kg`, išlikusiu per **360 ZB ir 889 VF iteracijų**.
→ **Taisymai Woo lygyje išlieka. Kanoninio importo transformacijos, kurią reikėtų taisyti, tiesiog nėra.**

**⚠️ `pmxi_imports.last_activity` NĖRA patikimas veiklos rodiklis:** `_zb_last_sync` rodė **14:02**, o `pmxi_imports` #3 — **11:02**. ZB sinchronizaciją varo **du mechanizmai**; tikrinti per produkto meta, ne per importo lentelę.

**ATLIKTOS KOREKCIJOS (dry-run → Raimio APPLY → nepriklausoma patikra):**
| veiksmas | rezultatas | patikra |
|---|---|---|
| Scope: `01O7A020072` „Real Dog Snacks Kiaulės kojos 10vnt“ | `[72]` → `[95]` | **DB: `[95]`** ✅ |
| Dešimtainės: 36 × `15 kg` → `1,5 kg` | pakeista 36, klaidų 0 | **36/36 turi `1,5 kg`** ✅ |
| Nepatvirtinti 13 | → `needs_manual_review` | ✅ |

**★ KODĖL TIK 36 IŠ 49 — `candidate ≠ verified` PASITEISINO:**
Visi 49 turėjo terminą `15 kg` ir pavadinime „1,5 kg“. Bet:
- **36** — `wc_weight` arba `_zb_weight` nepriklausomai patvirtina **1,5** → `fixed`
- **7 Monge** (`01M181102`, `01M182102`, `01M171102`, `01M110102`, `01M131102`, `01M191111`, `01M201502`) — struktūra sako **2,0 kg** → **trys skirtingos reikšmės**; tikėtina, kad **pavadinimas melagingas**, ne atributas
- **6** (`01MVC002`, `01MVC402`, `01MVC602`, `01MVC702`, `01M201602`, `01M201202`) — struktūrinis laukas **0** → patvirtinimo nėra

Taisius aklai pagal pavadinimą, 13 produktų būtų gavę neteisingą svorį tyliai.

**Rollback:** `_petshop_pkg_fix_from='15 kg'` + `_petshop_scope_fix='moved 72->95'` kiekvienam pakeistam.

**🟡 REGRESIJA DAR NEPATVIRTINTA:** 36/36 vietoje, bet **importas nuo taisymo (14:34) prie jų dar nepriėjo (0 paliestų)**. Tai NĖRA `regression_checked` — tik „dar niekas nepalietė“. Tikrinti po kito ZB ciklo (~15:02) per `_zb_last_sync` > `_petshop_pkg_fix_at`.

**LIKĘS PAKUOČIŲ BACKLOGAS — 37:** `missing_package` 17 (Farmina 15) · `decimal` 13 (rankinei peržiūrai) · `promotional_bonus_pack` 6 (Josera) · `multipack` 1 (Monge 4×10kg).

**BRENDŲ BŪKLĖ (po korekcijos):**
| brendas | MVP | A | B |
|---|---|---|---|
| Josera | 143 | 96 % | 79 % |
| Farmina | 145 | 90 % | 65 % |
| **Exclusion** (top revenue) | 52 | **100 %** | **73 %** |
| Quattro | 63 | 100 % | 37 % |
| Eukanuba / Ontario / RC | 32 / 18 / 13 | 100 % | **100 %** |
| Monge | 98 | 86 % | 52 % |
| Prins / Real Dog | 22 / 18 | **100 %** | 0 % |
Prins ir Real Dog **nėra prarasti** — jiems veiks A kelias (vartotojo porcija), tik ne gamintojo norma.

**★ ps_feeding_* SCHEMOS AUDITAS:**
- Schema stipri: `uq_checksum`, `idx_status/brand/shape`, `idx_ft`, `idx_weight`. `ps_feeding_map` PK = (feeding_table_id, product_id).
- **RUNTIME KODO NĖRA — nulis.** `ps_feeding_*` lentelių neliečia joks plugin/temos failas (patvirtinta S212-B dukart: pagal pilną vardą IR pagal galūnes, nes vardas konstruojamas dinamiškai `$wpdb->prefix.'ps_feeding_tables'`). Visos 223 lentelės sukeltos vienkartiniais snippetais.
- **⚠️⚠️ „S212-C = greenfield" — ATŠAUKTA (S212-B).** Aktyvūs **9** petshop plugin'ai, ne 4: `petshop-attributes · petshop-core · petshop-esp · petshop-fbt · petshop-feeds · petshop-fonts · petshop-pragma · petshop-promotions · petshop-xml`. **`petshop-core` JAU TURI** `class-refill-engine.php`, `class-pet-products.php`, `class-pet-profile.php`, `class-reminders.php`, `class-event-registry.php`, `class-pet-dashboard.php`, `class-pet-content.php` ir kt. (18 failų). **Prieš S212-C variklį — PRIVALOMAS esamo kodo recon, ne rašymas nuo nulio.**
- **Variklis privalo mokėti 5 formas** (simple 94, transposed 83, matrix 41, age_weight 2, by_age 2) **ir 6 ašis** (weight 133, body_condition 30, age 30, activity_level 18, lifestyle 5, svorio_valdymas 1).
- **⚠️ 12 `ambiguous` lentelių privalo būti išmestos iš B kelio**; 5 su `NULL row_dimension` ir 7 su `NULL weight_basis` — atskirai peržiūrėti (dabar tyliai praeitų kaip verified).

**PAJAMŲ SVERTAS — ATVIRA su konkrečia priklausomybe:** `gaj6_wc_order_product_lookup` dev bazėje = **7 SKU / −136,85 €** (vien grąžinimai). Užsakymų istorija liko gyvame petshop.lt. Reikia produkcijos Woo arba Pragma eksporto (SKU, kiekiai, sumos). Ataskaita rašo „NĖRA DUOMENŲ“, ne nulį.

**Ataskaitos:** `feeding_coverage_report.csv`, `package_product_usage.csv` (666 eil.), `package_term_map.csv` (80 terminų).

**Snippetai #1049–#1063 — išjungti.**

**★★★ S212-B — ŠĖRIMO DUOMENŲ MODELIS IR IMPORTERIS. UŽDARYTA 2026-07-18 ★★★**

> **STATUSAS: S212-B = CLOSED · Production rollout = BLOCKED.** Tai NE „šėrimo funkcija baigta". Duomenų modelis ir importeris baigti; variklio (S212-C) nėra.

**UŽRAKINTOS VERSIJOS (importeris tikrina visas tris, neatitikimas → APPLY blokuojamas):**
| | |
|---|---|
| `schema_version` | **`s212b_v3`** |
| `classifier_version` | **`clf_v1_2026-07-17`** |
| `canonical_hash_version` | **`chash_v1`** |

**DB BŪKLĖ:** 223 lentelės · 3 825 eilutės · 451 map. Parašas `a665ff152abb7dbf4fc02dc3028f030ad0760078b4b44ca397752d7aeb5e4a8e`.
**canonical_table_hash:** **219 su turiniu · 4 sąmoningai NULL** (#86 Exclusion, #93 Josera, #128/#138 Monge — visos `ambiguous`, `is_active=0`).

**APRĖPTIS (MVP 666 = `product_cat` 72/81, instock, publish):**
| | SKU | % |
|---|---|---|
| **A kelias** | **629** | **94,4 %** |
| **B full** | **371** | **55,7 %** |
| B partial | 43 | 6,5 % |
| B none | 20 | 3,0 % |
| be lentelės | 232 | 34,8 % |

Lentelių lygiu: full **188** · partial **24** · none **11**.
**⚠️ Šie skaičiai — SNAPSHOT, ne amžina tiesa.** Kanoninė tiesa = gyva ataskaita + jos metodika. Ataskaitoms **trūksta** `generated_at` / `classifier_version` / `scope_version` (pending).

**★ ESMINIS PRODUKTINIS SPRENDIMAS — 1D INTERPOLIACIJA (Raimis, užrakinta):**
Radinys: **183/223 lentelių saugo DISKREČIUS svorio TAŠKUS, ne intervalus.** „Produktas turi lentelę" ≠ „lentelė atsakys 12,3 kg šuniui". Tikras B full buvo **66 (9,9 %)**, ne 392.
**Sprendimas:** vienos skaitinės SVORIO ašies lentelėms leidžiama **tiesinė interpoliacija** tarp 2 gretimų gamintojo taškų; **apatinė ir viršutinė normos ribos interpoliuojamos ATSKIRAI**; rezultatas = Petshop apskaičiuotas **intervalas** (`derived_linear_interpolation`), UI aiškiai sako, kad tai mūsų skaičiavimas, ne gamintojo pažadas. Iš gramų intervalo skaičiuojama pakuotės trukmė, €/dieną ir refill langas — **irgi intervalais**.
**Draudimai:** extrapoliacija už šaltinio ribų · kategorinių ašių interpoliacija · redirect (Adult/Puppy Large) peržengimas · skirtingų formulių jungimas · nemonotoniškos lentelės.
**Prenumeratos ritmas iš intervalo NEAKTYVUOJAMAS automatiškai** — reikia vartotojo patvirtintos faktinės porcijos.
`age_weight_grid` / `multi_axis_grid` MVP lieka **exact-only / partial** (bilinearinė interpoliacija atidėta).
**Poveikis: B full 66 → 371 (+305 SKU).** 159 lentelės gavo `interpolation_allowed` (monotoniškumas tikrintas KIEKVIENAM kategoriniam pjūviui atskirai, abi ribos; 0 atmesta).

`calculation_method` taksonomija: `manufacturer_exact` · `manufacturer_range_match` · `derived_linear_interpolation` · `user_measured_portion` · `user_estimated_portion`.

**★ KANONINĖ KLASIFIKACIJA (kiekviena iš 223 lygiai vienoje kategorijoje):**
| kategorija | lent. | b_path |
|---|---|---|
| `1_unsupported` | 11 | none 11 |
| `2_weight_range` | 26 | full 26 |
| `3_weight_points_interp` | 159 | full 159 |
| `4_age_only_points` | 2 | full 2 (amžius = intervalai) |
| `5_multi_axis_grid` | 25 | partial 24 + full 1 |

`source_structure` po pataisos: `discrete_points` 161 · `range` 26 · `multi_axis_grid` 25 · `unsupported` 11.

**★★ DVI KARTUS PASIKARTOJUSI KLAIDA (užrakinta taisyklė):**
`lookup_method` buvo priskirtas iš `shape`, o `source_structure` — iš `lookup_method`. Rezultatas: **`source_structure` melavo 154 lentelėse iš 223** (iš 170 „range" realiai range buvo 24). Ašių politika buvo teisinga, nes išvesta IŠ EILUČIŲ.
**→ TAISYKLĖ: `source_structure`, `axis_resolution_policy`, `resolution_policy`, `b_path_status`, eilučių skaitikliai — VISADA skaičiuojami iš `ps_feeding_rows`, NIEKADA iš gretimo stulpelio ir NIEKADA nepriimami iš CSV.**

**★★★ MyISAM → InnoDB MIGRACIJA (batch `s212b_engine_20260717_c4861c6f`):**
**Radinys: visos 4 `ps_feeding_*` lentelės buvo MyISAM → transakcijų NĖRA → `START TRANSACTION`/`ROLLBACK`/`FOR UPDATE` nedarė NIEKO.** Visa „viso batch'o transakcija" buvo dekoracija.
Migracija: vartai (paieška pagal pilną vardą IR galūnes → 0 priklausomybių) → `GET_LOCK` + `register_shutdown_function` RELEASE → backup × 4 checksum-verified → `ALTER ENGINE=InnoDB` × 4 (0 warnings) → hash laukai `CHAR(64) CHARACTER SET ascii COLLATE ascii_bin` → `checksum_algo`/`source_hash_algo` = **`md5` × 223** (tik po `^[0-9a-fA-F]{32}$` validacijos), po to `NOT NULL` **be tylaus DEFAULT**.
**Patikra:** ENGINE 4/4 InnoDB · AI **224 / 13828 / 17** išliko · indeksai išliko · CHECK `chk_value_has_amount` **realiai atmeta** blogą eilutę · nukirstų hash 0 · `map` sudėtinių PK **451** (ne 223 — pirmo PK stulpelio DISTINCT šiai lentelei netinka) · `tables` seni 39 laukai `f971db66…` = backup `f971db66…` (skyrėsi tik 2 nauji stulpeliai).
**Down-migration paruošta iš anksto** (MariaDB DDL = implicit COMMIT).

**HASH LAUKŲ PASKIRTYS (užrakinta — keturi skirtingi dalykai):**
| laukas | paskirtis |
|---|---|
| `file_hash` | tikslūs įkelto CSV baitai; DRY↔APPLY sutapimui |
| `canonical_table_hash` | normalizuotas semantinis vienos lentelės turinys; **no-op ir versijavimo tiesa** |
| `source_hash` | gamintojo puslapio/PDF šaltinio turinys |
| `checksum` | **legacy** ankstesnio parserio suma; NE naujo importerio tiesa |

**`chash_v1` SUTARTIS:**
- SHA-256. Tapatybė: `brand + line + species + weight_basis`.
- Eilutės: `cell_type · weight_from/to · amount_from/to · redirect_reason · source_label · condition_dimensions`.
- Skaičiai `number_format(x,2)` → `45` = `45.0` = `45.00`. **NULL → `""`, 0 → `"0.00"` — NIEKADA nesutampa.**
- JSON raktai `ksort`; eilutės rikiuojamos → **CSV tvarka ir BOM hash NEKEIČIA**.
- **NEĮEINA:** `id`, mappingas, timestamps, `status`, `is_active`, `version_no`, `import_batch_id`, `checksum`, `source_hash`, `source_url`, išvestiniai, eilučių tvarka.
- **Tuščia lentelė (`value + redirect = 0`) hash NEGAUNA** → `canonical_table_hash` ir `canonical_hash_version` = NULL; negali būti aktyvi verified. **Lentelė TIK su redirect eilutėmis hash GAUNA** („Adult"/„Puppy Large" = tikras gamintojo atsakymas).
- **Tuščias importuojamas turinys NĖRA nauja versija ir NĖRA no-op** → `EMPTY_TABLE_CONTENT`, APPLY blokuojamas.
- **No-op sąlyga (aiški, NE SQL `NULL!=NULL`):** `existing IS NOT NULL AND incoming IS NOT NULL AND existing = incoming AND canonical_hash_version sutampa`.
- **Pasikartojantys canonical hash NĖRA klaida** — 2 teisėtos grupės (`[105,106]`, `[126,156]`) turi identišką gamintojo turinį. **`UNIQUE` indekso ant `canonical_table_hash` NĖRA ir nebus.**

**`source_changed_only` (užrakinta):** kai canonical nepakito, o `source_hash` pakito — **nauja semantinė versija NEkuriama, `version_no` nesikeičia**. `source_hash` + `source_version` + `source_url` + `source_checked_at` + `verification_note` atnaujinami **KARTU, vienoje transakcijoje**. **Mišri būsena (naujas hash + sena versija) DRAUDŽIAMA.** Batch žurnale: `old/new_source_hash`, `old/new_source_version`, `result=source_changed_only`. (`pending_*` modelis rezervuotas automatiniam šaltinių skenavimui — dar nėra.)

**RUNTIME INVARIANTAS (privalomas S212-C varikliui):**
```
table.status='verified' AND table.is_active=1
AND table.canonical_table_hash IS NOT NULL AND map.is_active=1
```
Aktyvių tinkamų mappingų SKU turi būti **tiksliai 1**: `0` → `NO_ACTIVE_FEEDING_TABLE` · `1` → normalus kelias · `>1` → **`DATA_INTEGRITY_ERROR`, JOKIO „imame pirmą" / `LIMIT 1`**.

**IMPORTERIO TESTAI — VISI REALŪS:**
| matrica | rezultatas |
|---|---|
| Parseris/validatorius/klasifikatorius | **23/23 PASS** |
| DB sluoksnis (D1–D16) | **17/17 PASS** |
| Uždarymo vartai (D4-fix + matomumas) | **5/5 PASS** |

Įrodyta: no-op · kita eilučių tvarka+BOM → no-op (`file_hash` kitas, canonical tas pats) · `source_changed_only` · pakeistas taškas → **draft v2, mappingas NELIESTAS, runtime grąžina v1** · **atominis v1→v2** · **klaida aktyvavimo VIDURYJE → rollback, aktyvių tiksliai 1 (nei 2, nei 0)** · viso batch rollback (klaida ties 3-ia → 1 ir 2 taip pat neįrašytos) · žurnalas išlieka `rolled_back` · `EMPTY_TABLE_CONTENT` · `file_hash` neatitikimas · visų 3 versijų neatitikimas · idempotentinis batch_id · realus 2 ryšių `GET_LOCK` · `DUPLICATE_ACTIVE_MAPPING` · runtime 0/1/>1.
**Matomumas 2 realiais ryšiais:** prieš A COMMIT B mato v1 · B konkuruojantis `FOR UPDATE` blokuojamas (`Lock wait timeout`, 2 s) · po A COMMIT B daro ROLLBACK → **nauja `READ COMMITTED` transakcija** → mato v2 · po A ROLLBACK B mato v1.
**Po testų:** ZZTEST liekanų 0 · pakibusių `applying` 0 · lock laisvas · tikros 223/3825 nepakitusios.

**⚠️ ARCHITEKTŪRA (užrakinta):** batch žurnalo įrašas **COMMITINAMAS PRIEŠ** duomenų transakciją — kitaip rollback ištrintų patį nesėkmės įrodymą. Aktyvavimas = **vienas `FOR UPDATE` blokas** — „išjungti v1, tada įjungti v2" paliktų produktą be lentelės.

**★★★ TRYS MELAGINGI PASS ŠIOJE SESIJOJE (svarbiausia pamoka):**
1. **D7 rollback „PASS" ant MyISAM** — atrodė, kad rollback suveikė; realiai pirmas `insert` krito (`checksum char(32)`, o dėjau sha256/64), tad rollback'ui nebuvo ko atsukti. **Testas patvirtino ne rollback, o tai, kad `insert` neveikia.** Oficialiai **INVALID** (ne PASS, ne FAIL).
2. **`source_structure`** — laukas iš gretimo lauko, antrą kartą po `lookup_method`.
3. **Testų fixture su 2 mappingais** — trys matomumo testai krito `DATA_INTEGRITY_ERROR`; priežastis: dvi ZZTEST lentelės susietos su tuo pačiu SKU. **Runtime invariantas pagavo mano paties testo klaidą.**
**→ TAISYKLĖ: prieš tikrinant „po" būseną — patikrinti, kad „prieš" būsena REALIAI egzistuoja. Testas gali praeiti todėl, kad sistema neveikia iš viso.**
**→ TAISYKLĖ: `$wpdb->insert()` / `$n++` rezultato netikrinimas = tyli klaida. Backup tikrinti turinio hash'u, NE eilučių skaičiumi.**

**ANKSTESNI S212-B DARBAI (ta pati sesija):**
- **Žodynas v1: 2 575 eilutės normalizuotos.** `activity_level` maišė 5 ašis (Monge „Bute/Kieme"=`lifestyle`, Farmina „Liesa/Normali/Antsvoris"=`body_condition`, Eukanuba=`svorio_valdymas`, Exclusion „Tik sausas/Sausas+konservas"=`feeding_type`, Ambrosia = lentelės ANTRAŠTĖS/parser garbage). Kodai: `thin|ideal|heavy` · `low|moderate|high` · `indoor|outdoor` · `reduce|maintain` · `dry_only|mixed` · amžius → `age_m_from/to`. Rollback: `condition_raw`.
- **Ambrosia 15/15 (B 0 → 100 %).** Lentelės #78–82 nebuvo sugadintos — parseris `nuo/iki` eilutes perskėlė į dvi; **39 poros sulietos**, visos monotoniškos, patvirtinta gamintojo lentele **iki gramo** (`ambrosiapetfoodcyprus.com`). 3 SKU be lentelės: AMPCF02 → #77, AMPCS12/AMPCS02 → nauja #223. **Tapatybė nustatyta pagal SUDĖTĮ, ne pavadinimą.** Rollback: `rows_backup_json`.
- **Redirect langeliai: 28** (`adult_formula` 24, `puppy_large_formula` 4) — „Adult"/„Puppy Large" nuorodos vietoj gramų. `cell_type` + CHECK `chk_value_has_amount`.
- **Sutartis v3:** `axis_resolution_policy` JSON **per ašį** (viena lentelė gali būti tuo pačiu metu atvira ir uždara — skaitinė ašis interpoliuojasi, kategorinė ne); versijavimas `version_no/supersedes_table_id/is_active/activated_at/retired_at/import_batch_id`; `value_row_count + redirect_row_count = row_count`. Batch `s212b_20260717_fb3eeae1` (backup × 3).

**ROLLBACK TAŠKAI:** `_bak_s212b_engine_20260717_c4861c6f` × 4 (InnoDB migracija) · `_bak_s212b_20260717_fb3eeae1` × 3 (sutartis v3) · `condition_raw` (2 575) · `rows_backup_json` (5 lentelės) · `_petshop_pkg_fix_from` (36).

**⛔ PRODUCTION ROLLOUT BLOKATORIAI (S212-B jų NEUŽDARO):**
| sritis | būsena |
|---|---|
| Šėrimo duomenų modelis + importeris | ✅ baigta |
| DB integralumas ir versijavimas | ✅ baigta |
| **S212-C skaičiavimo variklis** | ❌ nepradėtas |
| **`petshop-core` suderinamumas** | ❌ neaudituotas |
| **ZB reprice** | ❌ ~736 / ~984 užšaldytos legacy logika (S80 dry→apply) |
| **ZB/VF importo regression** | ❌ nepatvirtinta (tik `stock_sync_checked`; reikia #2 03:02 + #5 03:32 ciklo) |
| 13 `needs_manual_review` pakuočių | ❌ |
| Browser E2E + analytics | ❌ |
| Ataskaitų metaduomenys | ❌ `generated_at`/`classifier_version`/`scope_version` |
| 11 TEMP snippetų (75 aktyvūs) | ❌ |
| Domeno migracija (6 cron URL, Site URL, indexing, AVPN/IAPV→101) | ❌ |

**TOLIAU — S212-C paruošimas. PIRMAS DARBAS = RECON, NE KODAS.**
`petshop-core` inventorius: `class-refill-engine.php` · `class-pet-products.php` · `class-pet-profile.php` · `class-reminders.php` · `class-event-registry.php` + jų `require`/`include`, hookai, REST/AJAX endpointai, cron, DB lentelės, meta laukai, esamos porcijos/trukmės/refill formulės, eventai — **ir susiję aktyvūs Code Snippets** (75 aktyvūs gali dubliuoti ar perrašyti plugin'ų elgesį; recon tik pagal plugin'ų failus duotų vėl klaidingą vaizdą).
**Rezultatas — ne failų santrauka, o AUTORITETO MATRICA:** kiekvienai funkcijai (profilio duomenys · porcija · pakuotės trukmė · €/dieną · refill data · feeding lookup · eventai · UI adapteriai) vienas sprendimas: **KEEP / EXTEND / REPLACE / DEPRECATE**.
**Architektūros principas:** viena kanoninė formulė, ne keturios.
```
Feeding data repository → Canonical calculation engine
   → Product page adapter · Pet profile adapter · Refill adapter · Subscription adapter
```
Adapteriai formulių NESKAIČIUOJA — perduoda įvestis ir formatuoja rezultatą.
**Recon metu kodo NEKEISTI:** inventorius → srauto schema → dubliavimų identifikavimas → autoriteto matrica → minimalus S212-C integracijos planas. Tik po to rašyti ar perkelti.

**★★★ petshop-core RECON — COMPLETED 2026-07-18 ★★★**

> **S212-B = CLOSED · petshop-core recon = COMPLETED · S212-C engine = kitas darbas.**
> Recon buvo READ-ONLY. Jokio kodo nekeista. TEMP snippetai dar NETRINTI.

**★ ESMINIS RADINYS — porcijos / €-dienos / B-trukmės formulės NĖRA NIEKUR.** Nei 9 plugin'uose, nei 75 aktyviuose snippetuose. **Dubliavimo klausimas atkrenta — nėra ko dubliuoti, yra tik spraga.** (Tai atšaukia ankstesnę baimę „konkuruojanti sistema".)

**petshop-core = 18 failų, 5 175 eilutės.** Kritiniai 3:
| failas | eil. | ką daro | prijungta |
|---|---|---|---|
| `class-refill-engine.php` | 365 | **C: pirkimų intervalas** → trukmė | `payment_complete`, `order_processing/completed`, cron `ps_refill_daily_check` |
| `class-pet-dashboard.php` | 337 | refill prognozė, `days_left`, žiedas, feedback | REST `pet-dashboard`, `refill-feedback` |
| `class-pet-profile.php` | 705 | profilis, food-search | REST `pet-profile`, `food-search`, `brands` |

**★★ B ir C SLUOKSNIŲ ATSKYRIMAS (pamatinis S212-C principas):**
- **C (VEIKIA, KEEP):** `class-refill-engine.php` mokosi iš kliento **realių pirkimo intervalų**, NE iš gamintojo normų. 1-as pirkimas → grubus intervalas pagal pakuotę (14/30/60 d., conf 0,4); 2+ → svertinis vidurkis `senas×0,3 + naujas×0,7` (conf →0,9); cron `check_due()` T-5 d. → `refill_due` event. `ps_refill_tracking` (0 eil. dev). **NESKAITO `ps_feeding`, NESKAIČIUOJA porcijos.**
- **B (NĖRA, CREATE):** gamintojo norma iš `ps_feeding` (S212-B) → porcija → pakuotės trukmė → €/dieną. Šito variklio **niekur nėra**. Tai S212-C.
- **Jie NEKONKURUOJA — papildo vienas kitą.** C = M8 „C pakopa" (savikalibracija); B = M8 „B pakopa" (gamintojo lentelė).

**★ UŽRAKINTA AUTORITETO MATRICA:**
| funkcija | vieta | sprendimas |
|---|---|---|
| Profilis, `ps_pets` (22 gyvi įrašai) | `class-pet-profile.php` | **KEEP** |
| Produkto priskyrimas, `ps_pet_products` | `class-pet-products.php` | **KEEP** |
| Pirkimų kalibracija (C) | `class-refill-engine.php` | **KEEP** |
| Refill prognozė, `days_left`, žiedas, feedback | `class-pet-dashboard.php` | **KEEP** |
| Eventai | `class-event-registry/emitters` | **KEEP** |
| **Porcija iš svorio (B)** | niekur | **CREATE** |
| **€/dieną, €/mėn.** | niekur | **CREATE** |
| **1D interpoliacija + `ps_feeding` lookup** | niekur | **CREATE** |
| **Pakuotės trukmė iš normos (B)** | tik C intervalas | **EXTEND** (dashboard priima B kaip 2-ą šaltinį) |
| **`current_weight_kg` + `weight_updated_at`** | niekur | **CREATE** (po recon, dar nepadaryta) |
| 11 TEMP snippetų | token-gated likučiai | **DEPRECATE** (netrinti) |
| #565 VF Sync, #648 Invoice Fix | nesusiję | **UNRELATED / KEEP** |

**★ SVORIO SPRAGA (patvirtinta trigubai):** `ps_pets` NETURI `weight` stulpelio · user_meta 0 · post_meta 0 · snippetuose 0. B interpoliacijai reikia `current_weight_kg` + `weight_updated_at`. **Laukai DAR NEKURTI** (recon nekeičia kodo). `ps_pets` jau turi ašis: `dog_size`, `life_stage`, `is_sterilised`, `feeding_type`, `species` — dengia dalį `condition_dimensions`.

**★ 11 TEMP SNIPPETŲ — visi DEPRECATE, dar NETRINTI:** #736, #738, #797, #798, #799, #800, #801, #802, #803, #804, #805. **Visi token-gated** (`if(($_GET['ps_xx']??'')!=='1')return;`) — be URL parametro neregistruoja NIEKO: 0 gyvų hookų/shortcode/REST/cron. `#801 Dash Test` „RAŠO" į `ps_refill_tracking`/`ps_reminders`, bet tik jei rankiniu URL iškviestum `?ps_dash_test=1` — front-end sraute negyvas. Deploy/test likučiai iš M8 sesijų, ne konkuruojanti logika. Saugu trinti bet kada.

**★ AUDITO ATSAKYMAI (visi 6 klausimai):** porcija niekur neskaičiuojama · antros trukmės formulės nėra · refill cron nedubliuotas (`ps_refill_daily_check` + `ps_reminders_daily_check` = skirtingi) · snippetai neliečia core lentelių front-end sraute · funkcijų/hookų konfliktų nėra · nė vienas iš 11 TEMP nebenaudojamas.

**S212-C ARCHITEKTŪRA (variklis = NAUJAS B sluoksnis šalia veikiančio C):**
```
ps_feeding (S212-B) → NAUJAS Canonical B engine (svoris→porcija→trukmė→€/d, 1D interpoliacija)
ps_refill_tracking  → refill-engine (C: pirkimų kalibracija)  [KEEP]
        abu → dashboard / profile / product / subscription adapteriai
```
Adapteriai formulių NESKAIČIUOJA — perduoda įvestis, formatuoja rezultatą.

**⛔ PRODUCTION BLOKATORIAI (nepakitę):** ZB reprice (~736/~984 užšaldytos) · ZB/VF importų regression nepatvirtinta · 13 `needs_manual_review` pakuočių · E2E + analytics · ataskaitų metaduomenys · 11 TEMP + domeno migracija.

**★★★ S212-C ARCHITEKTŪRA — UŽRAKINTA 2026-07-18 (planas, kodo dar NĖRA) ★★★**

> Raimio patvirtinta su 7 korekcijomis. Kodas dar nerašytas. Prieš kodą — šis planas autoritetas.

**★ TRIJŲ SLUOKSNIŲ SERVISAS (NE vienas „grynas" servisas — tai buvo prieštaravimas):**
```
ps_feeding (S212-B)
   ↓
Petshop_Feeding_Repository   → randa aktyvią lentelę + eilutes (runtime invariantas)
   ↓
Petshop_Feeding_Calculator   → GRYNA matematika, be DB ir WordPress (testuojama izoliuotai)
   ↓
Petshop_Feeding_Service      → surenka produktą, kainą, pakuotę, augintinį; kviečia repo+calc
   ↓
product / profile / dashboard / refill / subscription adapteriai
```
Matematika atskirta nuo DB → testuojama be WordPress, formulė NEpatenka į dashboard ar produkto puslapį.

**★ PENKIOS PAKOPOS (A pakopa buvo pamesta plane — atkurta):**
- **A** — klientas nurodo REALIĄ dienos porciją (tiksliausia)
- **B1** — tiesioginė gamintojo norma (tikslus taškas ARBA gamintojo intervalas)
- **B2** — Petshop apskaičiuota linijinė interpoliacija tarp 2 gamintojo taškų (`derived_linear_interpolation`)
- **C** — realus pirkimų ritmas (savikalibracija iš `ps_refill_tracking`)
- **D** — duomenų nepakanka
**⚠️ B2 ≠ vartotojo svorio intervalas.** B2 = interpoliacija tarp gamintojo taškų. Vartotojo svorio intervalas — atskiras įvesties neapibrėžtumas, **MVP ATIDĖTAS** (daug UI/kraštinių atvejų, mažai naudos). MVP vartotojas įveda VIENĄ svorį.

**★★ DU ATSKIRI AUTORITETAI (esminė korekcija — C negali nustatyti porcijos):**

**Dienos porcijos autoritetas:** `A → B → D`. **C ČIA NEDALYVAUJA.** Pirkimų intervalas nežino gramų/dieną (klientas gali maitinti 2 gyvūnus, maišyti su konservais, pirkti atsargai, dalį pirkti kitur).

**Papildymo datos autoritetas:** `A (neseniai patvirtinta porcija) → subrendęs C → B → D`. C koreguoja KADA baigsis maistas, bet neapsimeta mitybos norma.

**★ C BRANDOS RIBA (ne po 2 pirkimų):**
- 1 pirkimas → tik grubus spėjimas (conf 0,4), B pagrindinis
- 2 pirkimai / 1 intervalas → C signalas, bet **B lieka pagrindinis**
- **≥3 tinkami pirkimai / 2 intervalai → C gali tapti autoritetu** (papildymo datai)
- **Intervalai normalizuojami pagal nupirktus gramus/pakuotės dydį.** Jei kartą 3 kg, kitą 15 kg — vien dienų tarp užsakymų lyginti NEGALIMA; normalizuoti arba intervalo nenaudoti mokymuisi.
- Kai subrendęs C stipriai skiriasi nuo B → **NE aklas vidurkis**, o abu rodomi: „Pagal gamintojo normą ~52 d., pagal jūsų pirkimo ritmą ~31 d." (signalas apie kelis gyvūnus/mišrų maitinimą).

**★ SVORIO LAUKAI (CREATE — patvirtinta, dar nepadaryta):**
```
ps_pets: current_weight_kg DECIMAL(5,2) NULL,  weight_updated_at DATETIME NULL
```
Neprivalomas. Be jo B → **`NEEDS_CURRENT_WEIGHT`** (ne bendrinis spėjimas).
**Išimtis:** kai lentelė naudoja `weight_basis='adult_expected'`, dabartinio svorio NEPAKANKA ir jo NEGALIMA išgalvoti iš `dog_size` → **`NEEDS_ADULT_EXPECTED_WEIGHT`**. `adult_expected_weight_kg` kol kas = adapterio perduodama reikšmė, **į `ps_pets` NEDEDAM**, kol nepamatysim realaus poreikio.

**★ KIEKIS IR KAINA (teisingas perdavimas):**
- `total_food_g = package_g × quantity` (NE visada viena pakuotė)
- `eur_per_day = actual_total_price / duration_days`
- Produkto puslapyje: vienos pakuotės GYVA kaina. Užsakymo/refill: faktiškai sumokėta suma + realus kiekis. Kitaip 2 maišų užsakymas gautų klaidingą papildymo datą.
- Kaina NIEKADA nesaugoma (prenumeratoriui — užrakinta kaina).

**★ ATSAKYMŲ KODAI (integralumo klaida ≠ D):**
| situacija | kodas | elgesys |
|---|---|---|
| nėra svorio | `NEEDS_CURRENT_WEIGHT` | prašom svorio |
| adult_expected lentelė, nėra suaug. svorio | `NEEDS_ADULT_EXPECTED_WEIGHT` | prašom suaug. svorio |
| nėra lentelės | `D` / `NO_ACTIVE_FEEDING_TABLE` | skaičiavimo nėra |
| svoris už gamintojo ribų | `D` (extrapoliacija DRAUDŽIAMA) | nerodom |
| **2 aktyvūs mappingai** | **`DATA_INTEGRITY_ERROR`** | **registruojam + slepiam skaičiavimą, NE tylus D** |

**★ CALCULATOR srautas (gryna matematika):** RESOLVE (invariantas) → AXIS (kategorinės exact) → WEIGHT (taškas=B1 · intervalas=B1 · tarp taškų+interpolation_allowed=B2 · už ribų=D · redirect=nuoroda) → porcija [lo,hi] → trukmė (`pkg/hi`..`pkg/lo`) → €/d (`price/days_max`..`price/days_min`). Extrapoliacija niekada.

**KITI ŽINGSNIAI (S212-C kodas):** (1) svorio laukai + migracija · (2) `Feeding_Repository` (runtime invariantas) · (3) `Feeding_Calculator` grynas + izoliuoti testai · (4) `Feeding_Service` · (5) produkto puslapio adapteris (anonimui, MVP) · (6) dashboard EXTEND (B+C sujungimas) · (7) profilio svorio įvestis. Dry-run → Raimio review → apply kiekvienam.

**★★★ S212-C — Calculator + Repository PROTOTIPAI (2026-07-18, dar NEINTEGRUOTA) ★★★**

> **STATUSAS — svarbu kitai sesijai, kad neklaidintų:**
> ```
> Calculator: isolated prototype validated, 25/25 PASS
> Repository: read-only prototype validated against real DB, 7/7 PASS
> petshop-core integration: NOT STARTED
> production runtime: NOT ENABLED
> ```
> Failai `/home/claude/` (NE plugine): `class-feeding-calculator.php`, `class-feeding-repository.php`, `test-calculator.php`, `repotest2.php`. Repository testuotas per LAIKINĄ snippetą (#1113 serija), ne įdiegtas.

**★ Step 1 — Petshop_Feeding_Calculator (grynas prototipas):**
- Pure PHP, jokio WP/DB/WC. Įvestis = masyvas, ne DB objektas.
- **25/25 izoliuoti testai PASS** (PHP 8.3 CLI sandbox).
- Padengta: B1 exact/range · B2 interpoliacija (abi ribos atskirai) · redirect (prieš value) · ekstrapoliacija DRAUDŽIAMA · trukmė · quantity · faktinė suma (`price_is_total`) · €/d ir €/mėn intervalai · kategorinės ašys exact · kraštutiniai.
- **⚠️ ATVIRA KONTRAKTO SPRAGA (uždaryti PRIEŠ svorio migraciją):** kai kelios eilutės turi tą patį svorį + skirtingas kategorines sąlygas (pvz. Josera id=1: 5kg→50/65/70 g pagal ašį), Calculator be paduotos ašies galėtų „imti pirmą sutapusį svorį". Repository `calculator_partial` žyma PATI SAVAIME neapsaugo, jei kas iškvies Calculator tiesiogiai. **Sprendimas:** Repository grąžina `required_condition_dimensions`; Calculator/Service gavęs be jų → **`MISSING_CONDITION_DIMENSION`**, jokio spėjimo. Privalo būti automatiškai testuojama.

**★ Step 2 — Petshop_Feeding_Repository (read-only prototipas):**
- Read-only. Runtime invariantas (verified + is_active + canonical_table_hash + map.is_active; 0→NO_ACTIVE, 1→OK, >1→DATA_INTEGRITY_ERROR). Jokio LIMIT 1.
- Normalizuoja DB tipus į Calculator sutartį: `condition_dimensions` JSON→`conditions`, decimal→float, **NULL lieka NULL (nevirsta 0)**, redirect gramai NULL.
- **7/7 runtime testai PASS:** vienas mappingas→OK · be mappingo→NO_ACTIVE · 0 realių dublių · draft(tid=7) ignoruojama→NO_ACTIVE · redirect NULL gramai išlieka · dešimtainiai `double` · deterministinis (2× skaitymas identiškas).
- **DB NEPAKITO: 223 lentelės / 3 825 eil. / 451 map / parašas `a665ff15…` identiškas prieš ir po.** Read-only įrodyta.

**★ LENTELIŲ SUPPORT KLASIFIKACIJA (sąžininga — NE „viskas supported"):**
```
calculator_supported   131   (tik weight ašis: discrete 106 + range 25)
calculator_partial      68   (reikia kategorinės ašies iš profilio)
unsupported_structure   13   (multi_axis_grid full + age)
empty_by_design          4   (#86,93,128,138 — canonical_table_hash NULL)
inactive                 7
```
**„Amžiaus ašis" NETAPO tyliu weight lookup:** 13 multi_axis+age → `unsupported_structure`; 12 partial multi_axis+age → `calculator_partial`; `age_full=3`, `multi_axis_full=1` — reikalauja papildymo. 24 partial neliko full. 11 unsupported nepriverstos.

**★ DU APRĖPTIES MATAI (skirtingi dalykai — abu laikom):**
```
Data coverage (produktas TURI lentelę, nepaisant ar naudojama):
  full 371 · partial 43 · none 20 · no table 232   (S212-A snapshot)

Runtime eligible coverage (lentelė REALIAI gali skaičiuoti):
  supported 283 · needs conditions 111 · unsupported 18 · no active table 254
```
MVP 666 instock per Repository (runtime): **b_full 369 · b_partial 43 · b_none 0 · be_lenteles 254 · integrity 0.**

**★ SNAPSHOT SKIRTUMO ANALIZĖ (dalinai — 2 SKU dar NEuždaryti):**
- **`b_none` 20→0 PAAIŠKINTA:** visos 11 b_none lentelių yra `status=ambiguous, is_active=0` → **negali būti runtime šaltinis** (S212-B invariantas). Snapshot skaičiavo per „bet koks aktyvus mappingas" (data coverage), Repository per runtime invariantą. Runtime prasme šie 20 produktų = `NO_ACTIVE_FEEDING_TABLE`. **NE klaida — du skirtingi matai.** Analitiškai jie ≠ produktai, kuriems duomenų niekada nebuvo.
- **`b_full` 371→369 (−2): DAR NEUŽDARYTA.** `ANY active map` metodika irgi rodo 369, ne 371. Hipotezė (mappingo/stock pokytis) NĖRA faktas. **Prieš keičiant kanoninį snapshotą — reikia išvardyti konkrečius 2 SKU, jų būseną seno ir naujo metodo, tikslią priežastį (kategorija/stock/mappingas/status/scope).** Kol neuždaryta — kanoninis snapshot lieka 371/43/20/232.

**TOLIMESNĖ EIGA (užrakinta):** (1) ✅ šis įrašas · (2) kategorinių ašių kontraktas `required_condition_dimensions` + `MISSING_CONDITION_DIMENSION` + testas · (3) tikslūs 2 SKU dėl 371→369 · (4) TIK TADA `current_weight_kg`+`weight_updated_at` migracija. **Svorio migracija NEPRADEDAMA, kol (2) ir (3) neuždaryti.**

**★★★ S212-C — (A) kontraktas + (B) baseline UŽDARYTI (2026-07-18) ★★★**

**★ (A) KATEGORINIŲ AŠIŲ KONTRAKTAS — UŽDARYTAS:**
- `Petshop_Feeding_Calculator::required_condition_dimensions($rows)` — privalomos ašys išvedamos iš PAČIŲ eilučių (ne išorinės žymos). Amžiaus ašys (`age_m_*`) neįeina.
- Trūkstant bent vienos → **`MISSING_CONDITION_DIMENSION`** (+ `missing_dimensions`, `required_dimensions`). Calculator nebegali tyliai pasirinkti pirmos eilutės.
- Josera atvejis (5kg → 50/65/70 pagal `activity_level`): be ašies → MISSING; su ašimi → teisinga eilutė.
- **Calculator testai: 29/29 PASS** (buvo 25; +T12 atnaujintas, +T23-26). Grynas PHP CLI, izoliuotai.

**★ (B) 371→369 RETROSPEKTYVA — UŽDARYTA su duomenų ribotumo išlyga:**
Tikslių 2 SKU **neįmanoma retrospektyviai nustatyti** — S212-A išsaugojo tik suvestinį skaičių, ne SKU momentinį sąrašą. Dabartiniai duomenys ATMETA: mappingo praradimą (visi 388 turi aktyvų mappingą), lentelės statusą (369 runtime = 369 data), publish būseną (0 ne-publish), dabartinę kategoriją (9 kat-73 niekada nebuvo 371). Vienintelis likęs sistemiškai kintantis paaiškinimas — **atsargų būsenos pokytis per kasdienį stock sync**, TAČIAU tikslūs 2 SKU nėra įrodomi. Mechanizmas nustatytas, konkretūs istoriniai objektai neatkuriami.

**★★ TIKSLUS MVP BASELINE — `dokumentai/mvp_baseline_2026-07-18.csv` (666 SKU, SHA-256 `6562ef23ad4484889c0bc3c745899659fe66c89fc78709d0f4e97977e29e9549`):**
```
generated_at: 2026-07-18 12:02   scope_version: mvp_72_81_instock_publish_v1
classifier_version: clf_v1_2026-07-17   runtime_invariant_version: s212b_v3
canonical_hash_version: chash_v1   repository_capability_version: repo_v1_2026-07-18
```

**★ TRYS ATSKIRI MATAI (kiekvienas suma = 666 — NEBEMAIŠYTI):**
| matas | full/supported | partial | none/unsupported | be lentelės | Σ |
|---|---|---|---|---|---|
| **Data coverage** (lentelės B būklė) | 369 | 43 | 0 | 254 | **666** |
| **Calculator capability** | 283 | 111 | 18 | 254 | **666** |
| **Runtime coverage** | 283 | 111 | 18 | 254 | **666** |

- **Skirtumas 369 (data full) vs 283 (capability supported) = 86 produktai:** turi b_full lentelę, bet ji reikalauja kategorinės ašies (body_condition/activity/lifestyle) → data „full", capability „partial". Nė vienas ne klaidingas — skirtingi matai.
- **`254` „be lentelės" = teisinga visuose trijuose matuose** (ankstesnis „236"/„232" maišė matus arba senesnį stock).
- **`b_none=0` runtime:** 20 ambiguous(is_active=0) lentelių runtime prasme = `no_active_table`, todėl niekada ne „none".

**★ BASELINE PARAŠAI (kitam palyginimui):**
- SKU CSV (666 eil., 9 laukai): `6562ef23…`
- 283 runtime-full SKU: `bf8fe040b796a382…`
- **10 outofstock b_full kandidatai** (371→369 mechanizmo įrodymas): `01A1H02080` (Eukanuba 18kg) · `01M041801`, `01M042001` (Monge) · `F011AG0141`, `F011PU0731` (Farmina) · `HYDM11`, `HYPM11`, `HYVM11`, `NGABL12`, `NGABM12` (Exclusion).
- Kitas skirtumas nustatomas tiksliai: `added/removed_since_baseline`, `stock_changed`, `category_changed`, `mapping_changed`, `table_status_changed`.

**★ TRIJŲ MATŲ TAISYKLĖ (užrakinta — nebemaišyti):**
1. **Lentelės B būklė** (`full/partial/none`) — DUOMENŲ savybė (`b_path_status`).
2. **Calculator capability** (`supported/partial/unsupported`) — ar variklis MOKA be papildomos ašies.
3. **Runtime produkto aprėptis** — ar produktas gaus skaičiavimą runtime.
Kiekvienas matas turi savo sumą iki 666. Nemaišyti.

**GALUTINIS STATUSAS PRIEŠ SVORIO MIGRACIJĄ:**
- Calculator prototipas: **29/29 PASS** · Repository prototipas: **7/7 PASS**
- Kategorinių ašių kontraktas: **UŽDARYTAS**
- 371→369 retrospektyva: **UŽDARYTA** (duomenų ribotumo išlyga)
- Tikslus SKU baseline: **SUKURTAS** (`6562ef23…`)
- petshop-core integracija: **NEPRADĖTA** · production runtime: **NEĮJUNGTA**
- **KITAS: `current_weight_kg` + `weight_updated_at` migracijos DRY-RUN → Raimio review → APPLY.**

**★★★ S212-C — SVORIO LAUKŲ MIGRACIJA APPLY ĮVYKDYTA (2026-07-18) ★★★**

**Migracija į `gaj6_ps_pets`** (batch `s212c_pets_weight_20260718_01b43648`, Raimio patvirtinta siaura APPLY):
```sql
ALTER TABLE gaj6_ps_pets
    ADD COLUMN current_weight_kg DECIMAL(5,2) NULL,
    ADD COLUMN weight_updated_at DATETIME NULL;
```
- **Jokio DEFAULT, CURRENT_TIMESTAMP, ON UPDATE.** Abu `DEFAULT NULL`, patvirtinta SHOW CREATE.
- **Backup `CREATE TABLE LIKE + INSERT SELECT`** (ne `AS SELECT` — išsaugo schemą, 6 indeksus, PK, AUTO_INCREMENT): `gaj6__bak_s212c_pets_weight_20260718_01b43648`, 22 eil., hash patvirtintas PRIEŠ ALTER.
- **PATIKRA (visi žali):** eilučių 22=22 · PK 22=22 · **senų 23 laukų turinio hash `c94933fab7812d3a…` prieš = po** · AUTO_INCREMENT 46=46 · indeksai 6=6 · `current_weight_kg` NULL 22/22 · `weight_updated_at` NULL 22/22 · ALTER warnings 0 · jokio DEFAULT/CURRENT_TS/ON UPDATE.
- **Migracijos lock** `petshop_s212c_pets_weight_migration` — GET_LOCK + finally RELEASE.

**⚠️ `ps_pets` engine = MyISAM (kaip buvo `ps_feeding_*` prieš S212-B).** Šiai migracijai saugumo nekeičia (ADD COLUMN NULL saugus, backup+hash apsaugo). **BET UŽRAKINTA RIBA: prieš production svorio rašymą per profilio REST — `ps_pets` PRIVALO būti konvertuota į InnoDB** (atskira migracija su savo dry-run/backup/testais). Calculator+Repository integracija gali tęstis anksčiau; production svorio atnaujinimų ant MyISAM nepalikti.

**ROLLBACK:** `ALTER TABLE gaj6_ps_pets DROP COLUMN weight_updated_at, DROP COLUMN current_weight_kg;` arba pilnas atkūrimas iš backup.

**S212-C KODO PROGRESAS:**
| žingsnis | būklė |
|---|---|
| 1. Calculator (grynas) | ✅ 29/29 |
| 2. Repository (read-only) | ✅ 7/7 |
| 2b. Kategorinių ašių kontraktas | ✅ MISSING_CONDITION_DIMENSION |
| 2c. Tikslus MVP baseline | ✅ `6562ef23…` |
| **3. Svorio laukų migracija** | ✅ **APPLY** |
| 4. Feeding_Service | ⬜ kitas |
| 4b. Profilio REST + svorio įvestis | ⬜ (reikia InnoDB pirma) |
| 5. Dashboard/refill adapteris + A-B-C autoritetas | ⬜ |
| petshop-core integracija | ⬜ NEPRADĖTA |
| production runtime | ⬜ NEĮJUNGTA |

**★★★ S212-C Step 4 — Petshop_Feeding_Service KONTRAKTAS (2026-07-18, dokumentas — kodo dar NĖRA) ★★★**

> Raimio patvirtinta su 5 atsakomybės ribų korekcijomis. **Service apima A/B1/B2/D. C NEPRIKLAUSO Service** (lieka refill sluoksnyje; vėliau atskiras `Refill_Forecast_Resolver` sujungs A→subrendęs C→B→D). Service rezultatas NIEKADA neturi `tier=C`.

**★ ATSAKOMYBĖS SCHEMA (nauji komponentai, ne vien Service):**
```
Product/Pet/Price context providers → Condition Mapper → Feeding Repository
   → Pure Calculator → Petshop_Feeding_Service → product/profile adapteriai
   → Refill Forecast Resolver + esamas C engine → dashboard/refill/subscription
```

**★ A PAKOPA PRIKLAUSO SERVICE (ne adapteriui):** A = kliento nurodyta reali dienos porcija (pvz. 240 g/d), NE pirkimų istorija. Iš jos kanoniškai skaičiuojama trukmė/€d/€mėn. Jei A paliktume adapteriui — dashboard pakartotų Calculator formulę → du skaičiavimo taškai. **Todėl A Service viduje.**

**★ ĮVESTIS (užrakinta):**
```php
[
  'product_id' => 123,          // privaloma
  'pet_id' => null,             // optional
  'customer_id' => null,        // ownership patikra jei pet_id
  'quantity' => 1,
  'usage_context' => 'catalog'|'order_line'|'subscription_line',
  'pet_input' => [              // tiesioginis override (anonimui, be profilio, laikinas svoris, A porcija)
    'current_weight_kg' => null,
    'adult_expected_weight_kg' => null,   // ps_pets kol kas nesaugo
    'actual_daily_portion_g' => null,     // A pakopa
    'conditions' => [],
  ],
  'price_context' => [          // arba null (=gyva WC kaina)
    'source' => 'live_product'|'order_line_paid'|'subscription_locked',
    'amount_inc_vat' => null,
    'scope' => 'unit'|'line_total',
    'currency' => 'EUR',
  ],
]
```
**Prioritetas:** tiesioginis `pet_input` override → saugomi `ps_pets` duomenys → `NEEDS_*`/`MISSING_CONDITION_DIMENSION`. Override naudojamas TIK šiam skaičiavimui, **automatiškai NErašomas į profilį**. Jei `pet_id` — PRIVALOMA ownership patikra (`customer_id`), vien `WHERE id=pet_id` = prieigos spraga.

**★ KAINOS SEMANTIKA (`price_context`, NE boolean `price_is_total`):**
- `usage_context` (adapteriui/auditui) ≠ `price_context` (kaina). Atskiri.
- catalog + `price_context=null` → gyva vieno parduodamo vieneto kaina.
- order/refill → konkrečios eilutės faktiškai sumokėta suma su PVM, po prekės nuolaidų, be siuntimo.
- subscription → užrakinta prenumeratos eilutės kaina.
- **`0 ≠ NULL`** — visiškai nuolaidota eilutė teisėtai kainuoja 0. Boolean per silpnas.

**★ PACKAGE RESOLVER (atskiras, multipack PRIEŠ ×qty):**
`pa_pakuotes_dydis` → `sellable_unit_food_g` (kiek maisto viename WC parduodamame SKU vienete): `15+3kg`→18000 · `2×7kg`→14000 · `7kg`→7000. Tada Service: `total_food_g = sellable_unit_food_g × order_quantity`. **Multipack neišdauginamas 2×.** Nepatikima normalizacija → `PACKAGE_SIZE_UNRESOLVED`. Pavadinimas — TIK QA perspėjimui, NIEKADA runtime svorio šaltinis.

**★ DALINIŲ REZULTATŲ GRANDINĖ (NE „viskas arba nieko"):**
```
porcija:   A arba B duomenys
trukmė:    porcija + package_g + quantity
€/dieną:   trukmė + price
```
- nėra pakuotės → **porciją vis tiek grąžinam** (`partial`)
- nėra kainos → **porciją + trukmę grąžinam**
- nėra svorio IR nėra A porcijos → porcijos nustatyti negalime
- `PRODUCT_NOT_FOUND` stabdo VISKĄ; `NO_PRICE`/`PACKAGE_SIZE_UNRESOLVED` — tik priklausomas dalis.
- **Stock status NEstabdo matematikos** — grąžinamas kaip metadata/warning; ar leisti pirkimą — adapterio atsakomybė.

**★ OUTCOME TIPAI (užrakinta — NE viskas „errors"):**
| kodas | status |
|---|---|
| (sėkmė) | `ok` |
| PACKAGE_SIZE_UNRESOLVED (jei porcija yra) | `partial` |
| NEEDS_CURRENT_WEIGHT · NEEDS_ADULT_EXPECTED_WEIGHT · MISSING_CONDITION_DIMENSION | `needs_input` |
| REDIRECT | `redirect` |
| OUT_OF_RANGE | `unavailable` |
| NO_ACTIVE_FEEDING_TABLE | `unavailable`, tier D |
| DATA_INTEGRITY_ERROR | `system_error`, tier nėra, registruojamas su correlation ID, NIEKADA ne D |
| PRODUCT_NOT_FOUND | `system_error`\|`unavailable` pagal priežastį |

**REDIRECT ir NEEDS_* NĖRA klaidos.** `issues[]` turi `severity: info|warning|error` + `layer: product|pet|condition_mapper|repository|calculator|package|price|service`.

**★ IŠVESTIS (užrakinta):**
```php
[
  'status' => 'ok'|'partial'|'needs_input'|'redirect'|'unavailable'|'system_error',
  'tier' => 'A'|'B1'|'B2'|'D'|null,
  'method' => 'user_confirmed_portion'|'manufacturer_exact'|'manufacturer_range_match'
             |'derived_linear_interpolation'|'manufacturer_redirect'|null,
  'portion_g' => ['min'=>220.0,'max'=>240.0],
  'duration_days' => ['min'=>50.0,'max'=>54.5],
  'eur_per_day' => ['min'=>0.82,'max'=>0.90],
  'eur_per_month' => ['min'=>24.60,'max'=>27.00],
  'redirect' => null,
  'issues' => [['severity'=>..,'layer'=>..,'code'=>..,'details'=>[]]],
  'meta' => [ product_id, pet_id, table_id, source_version, canonical_hash_version,
    weight_basis, weight_used_kg, weight_updated_at, weight_age_days,
    conditions_used, sellable_unit_food_g, quantity, total_food_g,
    price_source, price_amount_inc_vat, price_scope, stock_status ],
]
```
**`weight_age_days` = FAKTAS.** Jokio išgalvoto `confidence=0.73`, kol nėra patvirtintos versijuotos pasitikėjimo politikos. UI vėliau pagal versijuotą taisyklę parodys, kad svoris senas.

**★ CONDITION MAPPER (atskiras komponentas — deterministinis, versijuojamas, JOKIO fuzzy):**
`ps_pets` reikšmės → kanoninės `ps_feeding` `condition_dimensions`. Prioritetas:
```
1. pet_input.conditions — vartotojo pasirinkta, validuota pagal lentelę
2. ps_pets laukas — TIK per patvirtintą TOS PAČIOS semantikos mapping taisyklę
3. aiškiai pažymėta universali/default eilutė
4. MISSING_CONDITION_DIMENSION (+ missing_dimensions + allowed_values)
```
- `dog_size=small` **NEGALI** tapti `activity_level=low`. `life_stage`→tik `life_stage`. `is_sterilised`→tik sterilizacijos dimensija. `feeding_type` nenaudojamas vien todėl kad profilis jį turi.
- Repository turi grąžinti ne tik trūkstamos ašies pavadinimą, bet ir **`allowed_values`** (tos lentelės galimas reikšmes), kad UI parodytų normalų pasirinkimą.

**★★ UŽRAKINTA PRIEŠ AUDITĄ: besąlyginė eilutė NĖRA automatiškai „universali".** Tuščia `condition_dimensions` = **nepatikrinta duomenų būsena**, ne default. Universali pripažįstama TIK jei: atskiras `is_default` požymis · kanoninė reikšmė `all`/`any`/`default` · gamintojo šaltinis aiškiai sako „visiems". Jei tame pačiame svoryje `50g–be sąlygos · 65g–moderate · 70g–high` be aiškaus default žymens → **`AMBIGUOUS_CONDITION_SCHEMA`**, NE „50g visiems".

**⚠️ PENDING DATA AUDIT (prieš Condition_Mapper kodą):**
```
Condition mapping rules: PENDING DATA AUDIT
Universal/default row semantics: PENDING DATA AUDIT
```
Read-only auditas turi klasifikuoti lenteles: `unconditional_table · fully_conditioned · explicit_default_supported · mixed_ambiguous · inconsistent_dimension_schema · invalid_condition_data`. Tikrinti: (1) visos be sąlygų · (2) visos su · (3) mišrios · (4) ta pati svorio koordinatė su sąlygine IR besąlygine eilute · (5) explicit `all/any/default/universal` · (6) skirtingi required dimension rinkiniai vienoje lentelėje · (7) malformed JSON · (8) ar redirect eilutės turi kitą sąlygų schemą nei value.

**★★★ Petshop_Feeding_Condition_Mapper — SUTARTIS + condition_map_v1 UŽRAKINTA (2026-07-18) ★★★**

> Deterministinis, versijuojamas, JOKIO fuzzy. `ps_pets` reikšmės → kanoninės `ps_feeding` condition_dimensions.

**★ PRIORITETŲ GRANDINĖ:**
```
1. pet_input.conditions[ašis]  → validuoti pagal lentelės allowed_values, naudoti
2. ps_pets laukas              → TIK per condition_map_v1 patvirtintą taisyklę
3. explicit default eilutė     → jei egzistuoja (auditas: 0 tokių)
4. MISSING_CONDITION_DIMENSION → + missing_dimensions + allowed_values (UI mygtukai, ne laisvas tekstas)
```

**★ 3-SLUOKSNIO AUDITAS (ne DISTINCT iš 22 — faktinės + kodo enum + ps_feeding reikalaujamos):**
| dim | ps_pets faktinės | kodo enum (class-pet-profile) | ps_feeding reikalauja |
|---|---|---|---|
| `feeding_type` | mixed·dry_only·mostly_dry·NULL | **`dry_only·mostly_dry·mixed`** | dry_only·mixed (2 lent.) |
| `life_stage` | adult·senior·junior·NULL | **`junior·adult·senior`** | senior·weaning (2 lent.) |

**★★ condition_map_v1 — 3 IDENTITY taisyklės (VISOS identity, JOKIO alias):**
```
feeding_type: dry_only → dry_only   (IDENTITY)
feeding_type: mixed    → mixed      (IDENTITY)
life_stage:   senior   → senior     (IDENTITY)
```

**★ NO_RULE (aiškiai, su priežastimi):**
- **`feeding_type=mostly_dry` → NO_RULE.** Profilyje yra, ps_feeding NĖRA. **NEmapinti į `dry_only`** — „daugiausia sausas" ≠ „tik sausas" (klientas su konservais gautų klaidingą normą). → needs_input.
- **`life_stage=weaning` → NO_RULE.** ps_feeding reikalauja, bet **profilio kodas negali sukurti** (enum = junior/adult/senior, jokio weaning). Tik per `pet_input.conditions`.
- **`life_stage=junior/adult` → nemapinama** — jokia ps_feeding lentelė jų nereikalauja (tik senior/weaning).
- **`activity_level·body_condition·lifestyle·svorio_valdymas` → NO_RULE.** `ps_pets` šių laukų FIZIŠKAI neturi → visada `needs_input`.
- **`dog_size` → jokios ašies** (small breed ≠ activity/body_condition). **`is_sterilised` → nėra sterilizacijos dimensijos lentelėse.**

**★ MASTAS:** feeding_type reikalauja 2 lentelės, life_stage 2. Mapper startuoja su **3 IDENTITY taisyklėmis** (ne tuščias, ne spėjimai). Dauguma `fully_conditioned` (74) reikalauja activity/body_condition/lifestyle → per `needs_input` (teisinga — profilis jų neturi).

**★ allowed_values (kanoninės, baigtinės):**
```
activity_level: low·moderate·high    body_condition: thin·ideal·heavy
lifestyle: indoor·outdoor            feeding_type: dry_only·mixed
life_stage: weaning·senior           svorio_valdymas: reduce·maintain
weight_predisposition: prone_to_obesity
```
Repository grąžina trūkstamos ašies `allowed_values` (unikalios tos lentelės reikšmės), kad UI rodytų mygtukus.

**★ PERSISTAVIMAS — DAR NEUŽRAKINTA (korekcija):** activity_level/body_condition/lifestyle **KINTA**; skirtingi gamintojai klausia skirtingai. Todėl kol kas: pasirinkimas → `pet_input.conditions` → naudojamas KONKREČIAM skaičiavimui → **automatiškai NErašomas į ps_pets**. Persistavimo politika projektuojama ATSKIRAI (ne „vienkartinis pasirinkimas").

**TOLIMESNĖ EIGA:** (1) ✅ Service kontraktas · (2) ✅ condition auditas · (3) ✅ Monge/Farmina diagnozė · (4) ✅ condition_map_v1 · (5) ✅ Package sutartis · (6) TIK TADA kodas: Package Resolver → Condition_Mapper → Feeding_Service. Prieš production svorio REST — ps_pets InnoDB.

**★★★ PACKAGE SLUOKSNIS — SUTARTIS UŽRAKINTA (2026-07-18) ★★★**

> Grynas Resolver NEGALI kviesti WooCommerce (kitaip kartotume „gryno serviso" klaidą). Padalinta: Provider (WP faktai) / Resolver (grynas PHP).

**★ REALŪS DUOMENYS (read-only auditas):**
- **80 `pa_pakuotes_dydis` terminų**, VISI paprasti „skaičius+vienetas" (kg/g, LT kablelis `0,75`/`12,5`/`2,56`). **Jokio `15+3` ar `2×7` termine.**
- **S212-A meta `_petshop_pkg_assignment_status`:** `fixed` 23 · `stock_sync_checked` 13 · **`needs_manual_review` 13**.
- **13 review priežastis = termino↔produkto NEATITIKIMAS, NE sintaksė** („struktūrinis rodo 0/2 kg", nors terminas 1,5kg). Resolver to NEGALI ištaisyti.
- `fix` pattern: `15 kg → 1,5 kg` (dingęs kablelis). Bonus/multipack tarp MVP dabar **0 gyvų atvejų**.
- S212-A normalizuotos `sellable_food_g` meta NĖRA — Resolver skaičiuoja iš termino.

**★ Petshop_Package_Size_Provider (WP-priklausomas, skaito TIK faktus):**
```php
['term_value' => '1,5 kg', 'assignment_status' => 'needs_manual_review']
```
Jokių skaičiavimų, jokio produkto pavadinimo, jokio fallback.

**★ Petshop_Package_Size_Resolver (GRYNAS PHP, jokio $wpdb/wc_get_product):** du atskiri žingsniai — (1) **parse** (ar tekstas sintaksiškai suprantamas) → (2) **trust gate** (ar priskyrimu galima pasitikėti).
```php
['status'=>'ambiguous', 'sellable_unit_food_g'=>null,
 'parsed_candidate_g'=>1500, 'reason_code'=>'assignment_needs_manual_review', 'raw_value'=>'1,5 kg']
```
**⚠️ `sellable_unit_food_g=null` kai NEpasitikima** (net jei parse pavyko). `parsed_candidate_g` — TIK diagnostikai. **Jei paliktume 1500+warning → skaičius nugalėtų tekstą.**

**★ STATUSŲ PRIORITETAS (užrakinta seka):**
```
1. Terminas tuščias/neparsinamas/<=0        → unresolved
2. Parsinamas, BET status=needs_manual_review → ambiguous (parse NUGALIMAS)
3. Parsinamas + statusas patikimas           → resolved
4. Nežinomas naujas assignment_status        → ambiguous (konservatyvu)
```
**Patikimų whitelist:** `null · '' · fixed · stock_sync_checked`. **Nepatikimas:** `needs_manual_review`. Visa kita → `ambiguous`.

**★ GRAMATIKOS (tik žinomos, JOKIO universalaus „surask visus skaičius" regex):**
```
NUMBER UNIT              7 kg → 7000 · 85 g → 85 · 1,5 kg → 1500
NUMBER + NUMBER UNIT     15+3 kg → 18000   (bonus pack)
COUNT × NUMBER UNIT      2×7 kg / 2x7 kg → 14000   (multipack)
```
Visa kita → `unresolved`. Bonus/multipack TIK iš `term_value`, niekada iš pavadinimo. **0 gyvų atvejų — capability be duomenų.**

**★ DU ATSKIRI FIXTURE (NEsuplakti):**
- **Terminų fixture (80):** tikrina TIK sintaksę (`1,5 kg`→1500, `12,5 kg`→12500, `85 g`→85, `0,75 kg`→750).
- **Produktų būsenų fixture (13 review):** tikrina trust gate (`term=1,5kg` + `needs_manual_review` → ambiguous). **Ta pati `1,5 kg` viename produkte = resolved, kitame = ambiguous.** Problema priskyrime, ne tekste.

**★ SERVICE SUTARTIS:** `quantity` Resolveryje NEdalyvauja. `total_food_g = sellable_unit_food_g × quantity` daro TIK Service, ir TIK jei `status==='resolved'`. `2×7kg` = viena 14kg prekė; krepšelio qty=2 → 28kg.

**KITAS:** kodas — Package Resolver (grynas + 2 fixture) → Condition_Mapper (condition_map_v1) → Feeding_Service (integruoja viską).

**★★★ Package Resolver v2 — ORTOGONALIOS DIMENSIJOS (2026-07-18, dar NEINTEGRUOTA) ★★★**
Failas `/home/claude/class-package-size-resolver.php` (grynas — WP mapping PAŠALINTAS į Provider). **29/29 testai PASS.**

**★ DVI ORTOGONALIOS DIMENSIJOS (v2 pataisa — nebemaišyti į vieną statusą):**
```
parse_status     — ar term_value išparsintas (resolved | unresolved)
assignment_trust — ar priskyrimu galima pasitikėti (verified | unverified | review_required | unknown)
```

**★ KRITINIS RADINYS (statuso nebuvimas):** iš 1220 produktų su pakuotės terminu tik **49 turi `_petshop_pkg_assignment_status`** (fixed 23 + stock_sync_checked 13 + needs_manual_review 13); **1171 BE statuso**. MVP 666: **49 su statusu, 597 be statuso, 20 be termino.** Duomenų pasiskirstymas rodo, kad S212-A **greičiausiai** rašė statusus tik paliestiems/išimtiniams produktams; **originalaus rašymo kodo nerasta**, todėl statuso nebuvimas laikomas `unverified` (loginė išvada, NE įrodytas faktas). `null`/`''` → `unverified` (ne trusted).

**★ TRUST — statusas yra TEIGINYS, fix_to yra ĮRODYMAS (griežta taisyklė, Provider):**
```
verified = status ∈ {fixed, stock_sync_checked}
           AND fix_to egzistuoja ir ne tuščias
           AND normalize(fix_to) == normalize(current_pa_pakuotes_dydis_term)
review_required = status = needs_manual_review
unverified      = status null/'' (neaudituota)
                | status ∈ {fixed,stock_sync_checked} BET fix_to nesutampa (evidence_mismatch)
unknown         = nežinomas naujas statusas (konservatyvu)
```
Statusas VIENAS PATS niekada nesuteikia verified. `fix_to=1,5kg` bet `current=15kg` (importas perrašė) → **unverified**, reason `assignment_evidence_mismatch`, NE verified.
**Provider skaito 4 laukus:** `term_value, assignment_status, fix_from, fix_to` → grąžina domenui `{term_value, assignment_trust, trust_evidence}`. Resolver NEMATO `_petshop_pkg_*` nei migracijos istorijos.

**★ SPRENDIMŲ MATRICA (parse × trust):**
| parse | trust | sellable_unit_food_g | reason_code |
|---|---|---|---|
| unresolved | bet koks | **null** | unparseable_or_nonpositive |
| resolved | **verified** | **leidžiamas** | — |
| resolved | review_required | **null** | assignment_review_required |
| resolved | unverified | **null** | assignment_not_audited |
| resolved | unknown | **null** | assignment_trust_unknown |

**`sellable_unit_food_g` != null TIK kai `parse=resolved` IR `trust=verified`.** `parsed_candidate_g` — TIK diagnostikai/auditui.

**★ SERVICE SUTARTIS (užrakinta):** production Service skaičiuoja TIK kai `parse_status=resolved` IR `assignment_trust=verified`. **Service NETURI fallback į `parsed_candidate_g`** — tas laukas admin diagnostikai, NE verslo logikai. Jokio `allow_unverified` jungiklio (saugos logika nepersikelia į konfigą).

**⚠️ BACKFILL AUDITO POREIKIS (597 MVP produktai be statuso):** vienkartinis assignment auditas (NE `allow_unverified=true`). Naudoja pa_pakuotes_dydis + pavadinimą kaip KONTROLINĮ įrodymą + Woo struktūrinį svorį + S212-A pataisų istoriją + `15kg→1,5kg` patternus → atitinka patikimus šaltinius=`verified` · nesutampa=`needs_manual_review` · nepakanka=`unverified`. Runtime pavadinimo NESKAITO; audito skriptas gali. `unverified` = LAIKINA migracijos būsena, ne nuolatinė skylė.

**★ SLUOKSNIAVIMO TERMINOLOGIJA (pataisa — read-only ≠ pure):**
```
Grynas domenas:        Feeding_Calculator · Package_Size_Resolver · Condition_Mapper
WP infrastruktūra:     Feeding_Repository · Package_Size_Provider  (skaito DB/WP — NE grynas)
Orkestracija:          Feeding_Service
```
Repository read-only, bet kviečia DB → infrastruktūrinis, ne pure.

- **Tilto pamoka:** CLI sandbox be mbstring (`mb_strtolower` krito) → `strtolower` (paketai ASCII); Unicode `×`→`x` PRIEŠ strtolower.
**★ ĮRODYMO PATIKRA (36 fix produktų, read-only):** VISI 36 turi `fix_to` == dabartinis terminas (MATCH 36 · MISMATCH 0 · NO_CURRENT 0). Pataisos realiai įgyvendintos. `stock_sync_checked` 13/13 su `15kg→1,5kg` fix, patvirtinta.

**★ MVP 666 su GRIEŽTA trust taisykle (Σ=666):**
```
verified         36    (5,4% — fixed 23 + stock_sync_checked 13, visi su fix_to==terminas)
review_required  13    (needs_manual_review — 15kg terminas, pataisa nepritaikyta)
unverified      597    (nėra statuso — neaudituoti)
no_term          20
```
**Be backfill audito Package skaičiuoja TIK 36 produktams.** Todėl backfill būtinas, ne pasirinktinis — verčiau 36 patikimi nei 633 su 10× klaidos rizika.

**★ Petshop_Package_Size_Provider KONTRAKTAS (WP infrastruktūra — kodo dar NĖRA):**
Skaito `term_value + assignment_status + fix_from + fix_to`. Taiko griežtą trust taisyklę (žr. aukščiau). Papildomos patikros: `fix_to` ne tuščias · `normalize(fix_to)==normalize(current_term)` · `fix_to` pats sintaksiškai tinkamas. Grąžina `{term_value, assignment_trust, trust_evidence}`. **NEINTEGRUOTA.**

- **NEINTEGRUOTA.** Package Provider — kodo dar NĖRA, tik kontraktas (trust taisyklė + 4 laukų skaitymas).

**★★★ EXCLUSION ŠĖRIMO LENTELĖS — 3 SUKURTOS + APRĖPTIES DIAGNOZĖ (2026-07-18, APPLY) ★★★**

> Kilo iš Raimio radinio: pagrindiniai Exclusion produktai be šėrimo skaičiuoklės. Diagnozė + autonominis uždarymas.

**★ HYHS02 (produktas kurį Raimis parodė): DATA JAU BUVO** — susietas su lentele id165 (Hypoallergenic, 2kg/50-60g...), norma teisinga. **Skaičiuoklės puslapyje nėra, nes Feeding_Service + front-end integracija dar NEPARAŠYTA** — tai integracijos spraga, NE duomenų.

**★ EXCLUSION APRĖPTIS: 78 produktai, buvo 43 mapped → dabar 46. Likę 32 unmapped:**
- **19 konservai (WET)** — NE sauso maisto MVP (cat 72/81 = "Sausas maistas"). Kitokia norma (g/kg konservų). Atskiras sprendimas, ne dabar.
- **13 sauso maisto BE ištraukiamos normos** — dauguma šuniukų (age-based) arba Mono Protein begrūdis su kita aprašymo struktūra. Į sąrašą: HYPA11, HYPA02, CHYP03, NGPTS05, INPA11, HEPM11, NGPBS02, NGPTM03, NGPBS07, NGPBM12, NGPBS05, NGPTL12, d0ef54405833. **Normos NEspėtos (gyvūnų sauga).**

**★ 3 SUKURTOS LENTELĖS (norma iš gamintojo post_content, verifikuota byte-į-byte, Calculator PATIKRINTAS):**
```
tid 237  INPM11  Intestinal Monoprotein didelių veislių  9 eil. (11-70kg)  20kg→200-220g ✓
tid 238  INPS06  Intestinal Monoprotein mažų veislių     7 eil. (2-10kg)   4kg→70-85g ✓
tid 239  HHFM11  Hydrolyzed Hypoallergenic didelių       9 eil. (11-70kg)  20kg→210-235g ✓
```
Visos: status=verified, is_active=1, b_path_status=full, mapping aktyvus, **runtime invariantas PASS, Calculator realiai skaičiuoja teisingas porcijas** (ne tik egzistuoja). 0 orphans.

**★★★ chash_v1 CANONICALIZERIS ATKURTAS + 3 LENTELĖS PERKURTOS (2026-07-18, KOREKCIJA po Raimio audito) ★★★**

Pirmas APPLY buvo NESAUGUS (2 pažeidimai): (1) apeitas transakcinis importeris → 25 orphan rows + 3 orphan map; (2) išgalvotas `chash_s212c_v1` — sulaužytas versijavimas. Ištaisyta:

**1. Karantinas:** tid 237/238/239 → draft, is_active=0, mappingai off, runtime_eligible=0.

**2. chash_v1 canonicalizeris ATKURTAS TIKSLIAI** — rastas snippete **#1106** „S212-B Canonical Hash APPLY v2" (deaktyvuotų snippetų kodas lieka DB). Formulė:
```
$CHV='chash_v1';
$n = number_format((float)$v, 2, '.', '')  arba '' jei null/''
$id = {brand, line, species, weight_basis}          // wp_json_encode
eilutė = implode("\x1f", [cell_type, n(w_from), n(w_to), n(a_from), n(a_to),
         redirect_reason, source_label, condition_dimensions(json_decode→ksort→wp_json_encode UNESCAPED_UNICODE)])
sort($rr, SORT_STRING)                                // eilučių tvarka NESVARBI
hash = sha256($CHV . "\x1e" . wp_json_encode($id) . "\x1e" . implode("\x1e", $rr))
```
**Įrodyta: 219/219 esamų lentelių hash sutampa (0 diff).** (Brute-force 4320 variantų anksčiau nepataikė, nes naudoja 8 stulpelius + meta $id, ne 4.)

**3. Transakcinis PERimportas** (InnoDB — patikrinta): naujos lentelės **241 (INPM11), 242 (INPS06), 243 (HHFM11)**. Kiekviena: START TRANSACTION → main insert → **child TIK jei insert_id>0** → mapping → COMMIT (arba ROLLBACK). Senos 237/238/239 ištrintos toje pat transakcijoje. Teisingas `canonical_hash_version='chash_v1'`, **hash stored == recomputed (MATCH)**.

**4. Provenance (sąžininga):** source_url=produkto permalink, source_version=`exclusion_post_content_2026-07-18`, verified_by=s212c_reimport. **verification_note aiškiai sako: norma iš post_content (gamintojo/importo tekstas), verifikuota byte-į-byte su aprašymu, BET nepriklausomai su gamintojo oficialia lentele NESUTIKRINTA.**

**5. Regression testas PASS:** sąmoningas main-insert fail (duplicate PK) → child NEbandyta, eilutės nepakito, 0 orphans. Įrodo: main fail → 0 child.

**6. Galutinė patikra:** senos 0, orphans 0, zzregtest 0. Calculator: INPM11 20kg→200-220g, INPS06 4kg→70-85g, HHFM11 20kg→210-235g. **Canonicalizeris prieš VISAS 222 chash_v1 lenteles: 222/222 MATCH.**

**★ KARANTINAS 2 (2026-07-18, po Raimio 2-o audito): 241/242/243 → needs_review.** `verified+active` buvo PER STIPRUS — byte-match su MŪSŲ post_content įrodo tik tikslų kopijavimą, NE normos teisingumą; permalinkas nėra pirminis šaltinis. Prieštaravo gyvūnų saugos taisyklei. Dabar: **status=needs_review, is_active=0, map.is_active=0, runtime_eligible=0.** (source_type/source_verified stulpelių schemoje NĖRA → provenance verification_note: „Norma tiksliai sutampa su Petshop produkto aprašymu; su oficialiu gamintojo šaltiniu dar nepatikrinta.")

**★ 237/238/239 = INVALID PROVISIONAL DATA** (nekonformiški laikini įrašai su neteisinga canonical versija chash_s212c_v1, NE teisėtos istorinės verified versijos). Jų ištrynimas priimtinas ir **NĖRA precedentas trinti normalias versijas.**

**★ GALUTINIS STATUSAS:**
```
chash_v1 atkūrimas             PASS (219/219, po reimportu 222/222)
Orphanų išvalymas              PASS (0)
Transakcinis rankinis rebuild  PASS (241/242/243, hash MATCH)
Calculator normų read-back     PASS (200-220 / 70-85 / 210-235)
Regression (main fail→0 child) PASS (bet tik vienkartiniame skripte, NE oficialiame importeryje)
Oficialus gamintojo patvirtinimas   NEATLIKTA
Oficialus S212-B CSV importerio kelias NEATLIKTA
Production aktyvavimas         DAR NELEIDŽIAMAS
```

**★ KITI ŽINGSNIAI (užrakinta seka prieš aktyvavimą):** (1) rasti oficialius gamintojo šėrimo šaltinius INPM11/INPS06/HHFM11 (ne mūsų post_content); (2) tas pačias 3 lenteles perleisti per OFICIALŲ S212-B CSV importerį (DRY-RUN, failo+versijų validacija, source validacija, batch žurnalas, idempotentinis pakartojimas, atominis aktyvavimas); (3) regression testą su main-insert fail įrašyti PAČIAME oficialiame importeryje, ne vienkartiniame skripte; (4) TIK po to status=verified + aktyvuoti. Po aktyvavimo — Exclusion runtime MVP coverage perskaičiuoti.

**★★★ CANONICALIZER PERKELTAS + OFICIALAUS IMPORTERIO KONTRAKTAS (2026-07-18, po Raimio 3-o audito) ★★★**

**1. chash_v1 canonicalizeris PERKELTAS iš snippeto #1106 į nuolatinį kodą** — `dokumentai/s212c_class-feeding-canonical-hash.php` (`Petshop_Feeding_Canonical_Hash::compute($meta,$rows)`). **9/9 testai PASS** (`s212c_test-canonical.php`): žinomas hash (t199/t165/t83) · eilučių tvarka nekeičia · normos pakeitimas keičia · redirect keičia · condition keičia · meta(brand) keičia. Serveryje 222/222 įrodyta. **Techninė skola padengta** — canonicalizeris nebe tik deaktyvuotame snippete. (Integruoti į petshop-core importerį kai bus statomas.)

**2. SCHEMA RADINIAI:** `ps_feeding_import_log` batch žurnalas EGZISTUOJA; yra `import_batch_id`, `version_no`, `supersedes_table_id`, `activated_at`, `retired_at`. **NĖRA `source_authority`/`source_verified` stulpelių** — dabartinė provenance konvencija koduota per `source_url`+`source_version` string (pvz. `ontario_pet_wayback`=oficialus vs `exclusion_post_content`=lokalus), bet NE mašiniškai atpažįstamai.

**★ OFICIALAUS S212-B IMPORTERIO KONTRAKTAS (užrakinta, kodo dar NĖRA):**

**A. PROVENANCE PROMOTION scenarijus `SAME_CANONICAL_CONTENT_SOURCE_VERIFIED`** (KRITINIS): kai oficialus gamintojo šaltinis duoda TĄ PATĮ canonical turinį (hash sutampa), importeris NETURI grąžinti `no_op`. Veiksmas: NEkuria naujos semantinės versijos · atnaujina esamos needs_review lentelės provenance į oficialų šaltinį · status→verified · lentelė+mapping aktyvuojami ATOMINIU veiksmu · batch žurnale sena IR nauja provenance būsena. Tai importerio acceptance testas.

**B. STRUKTŪRUOTA PROVENANCE (ne verification_note laisvas tekstas):** reikia mašiniškai atpažįstamo `source_authority` enum: `local_product_description | manufacturer_page | manufacturer_pdf | supplier_feed | manual_unverified` + `source_verified=0|1`. Pridėti kaip stulpelius arba batch metaduomenis. Kodas turi patikimai atskirti Petshop aprašymą nuo oficialaus gamintojo šaltinio (NE per teksto analizę).

**C. 5 IMPORTERIO ACCEPTANCE TESTAI (užrakinta):**
1. main insert fail → child insertai net nepradedami (dabar įrodyta tik vienkartiniame skripte — perkelti į importerį)
2. canonical tas pats + šaltinis oficialiai patvirtintas → NE no_op, o provenance promotion
3. needs_review → verified+active ATOMINIU veiksmu
4. aktyvavimo klaida → lentelė lieka needs_review, runtime nemato
5. pakartotinis to paties oficialaus failo importas PO aktyvavimo → tikras no_op

**★ SEKA PRIEŠ 241/242/243 AKTYVAVIMĄ:** (1) oficialūs gamintojo šaltiniai; (2) per oficialų importerį su A+B+C; (3) tik tada verified+active.

**★★★ PROVENANCE PROMOTION IMPORTERIS PASTATYTAS + 6/6 MATRICA (2026-07-18, po Raimio 4-o audito) ★★★**

Failai repo: `dokumentai/s212c_class-feeding-importer.php` (`Petshop_Feeding_Importer::ingest`), `s212c_promotest_zztest.php`. **Importeris kviečia `Petshop_Feeding_Canonical_Hash::compute` — vieną funkciją, JOKIOS kopijos.**

**★ STRUKTŪRUOTA PROVENANCE (Raimio pataisa — rūšis ≠ būsena):** pridėti nullable stulpeliai į ps_feeding_tables (222 lentelių nepaliesta):
```
source_kind: manufacturer_page | manufacturer_pdf | supplier_feed | local_product_description | other
source_verification_status: unverified | verified | rejected
source_verified_at, source_verified_by
```
authority_rank: verified manufacturer=3, supplier_feed=2, local/other=1, bet koks unverified=0.

**★ BŪSENŲ MATRICA — 6/6 PASS ant ZZTEST (išvalyta po testo):**
```
CASE1 tas pats verified šaltinis            → no_op                          ✓
CASE2 local/unverified→manufacturer/verified→ promotion (naujos versijos NĖRA) ✓
CASE3 kitas verified šaltinis, ta pati sem. → source_changed_only (auditas)  ✓
CASE4 canonical pasikeitė                   → canonical_changed_new_version   ✓
CASE5 silpnesnis nei aktyvus verified       → no_auto_demote (error)          ✓
CASE6 2 needs_review su tuo pačiu canonical → DATA_INTEGRITY_ERROR (ne „imk pirmą") ✓
```
Promotion transakcijoje: START TRANSACTION → FOR UPDATE kandidatas → pakartotinis vieno tikrinimas (lenktynių apsauga) → source_kind/status/verified_at/by + status=verified + is_active=1 + map.is_active=1 → COMMIT; klaida→ROLLBACK (lieka needs_review+inactive). Batch žurnale (ps_feeding_import_log) sena+nauja provenance.

**★ DU RADINIAI KELYJE:**
1. **`uq_checksum` UNIQUE** ant ps_feeding_tables; S212-B konvencija: **`checksum = hash('sha256', table_key.'|'.version_no.'|'.canonical_table_hash)`** — NE canonical tiesiogiai. **Mano 241/242/243 naudoja checksum=canonical tiesiogiai — nesutampa su konvencija** (veikė tik dėl unikalių hash). TAISYTINA perimportuojant per oficialų kelią.
2. **ps_feeding_map PK=(feeding_table_id, product_id)** — produktas gali mapintis į kelias lenteles; DATA_INTEGRITY scenarijus realus (skirtingi table_key→skirtingi checksum→abi egzistuoja).

**★ 241/242/243 struktūruota provenance nustatyta:** source_kind=local_product_description, source_verification_status=unverified (needs_review, is_active=0 nepakito).

**★ STATUSO PATIKSLINIMAI (Raimio formuluotė):**
```
Canonicalizer persistent + tests        PASS
Importer promotion logika + 6/6 matrica PASS (ZZTEST)
Importer integration su petshop-core    PENDING (klasės reference kode, ne plugin'e; production kelyje dar nekviečiama)
S212-B data model / integrity / harness CLOSED
S212-B production importeris            OPEN
241/242/243 production aktyvavimas       DAR NELEIDŽIAMAS
```

**★★★ CHECKSUM NORMALIZACIJA + SCHEMA MIGRACIJA (2026-07-18, po Raimio 5-o audito) ★★★**

**1. CHECKSUM RADINYS (svarbus):** 219 esamų lentelių checksum **nesutampa su NĖ VIENA formule** (nei canonical, nei hash(key|vno|canonical), nei source_hash). Priežastis: checksum sukurtas ORIGINALAUS CSV importerio (batch `s212b_20260717`) su `$ch=originalaus turinio hash` (import metu), o `canonical_table_hash` retrofit'intas VĖLIAU (#1106). **checksum ir canonical NEPRIKLAUSOMI.** Esamų 219 table_key=NULL, originalus content hash neišsaugotas → **esamų checksum NEATKURIAMAS ir retroaktyviai NEnormalizuojamas** (būtų mass migracija, ne scope).

**2. KONVENCIJA NAUJOMS (iš snippet #1096):** `checksum = hash('sha256', table_key.'|'.version_no.'|'.canonical_table_hash)`. Mano 241/242/243 naudojo `checksum=canonical` tiesiogiai — nekonformiška.

**3. CHECKSUM NORMALIZACIJA PROMOTION METU (path A, įgyvendinta + testuota):** importerio promotion dabar perskaičiuoja checksum į kanoninę konvenciją ATOMIŠKAI transakcijoje, su uq_checksum kolizijos apsauga (`CHECKSUM_COLLISION` klaida jei kolizija), sena+nauja checksum batch žurnale. **Acceptance testas PASS** (ZZTEST): needs_review + bloga checksum(=canonical) + oficialus verified → promotion → verified+active → checksum==hash(table_key|version_no|canonical) → repeat=no_op.

**★ SCHEMA MIGRACIJA (4 provenance stulpeliai, dokumentuota):**
```
PRIEŠ: ps_feeding_tables be source_kind/source_verification_status/source_verified_at/source_verified_by
PO:    + source_kind VARCHAR(30) NULL
       + source_verification_status VARCHAR(20) NULL
       + source_verified_at DATETIME NULL
       + source_verified_by VARCHAR(60) NULL
BACKFILL: senoms 222 lentelėms visi 4 = NULL (jokių auto-defaultų)
ROLLBACK: ALTER TABLE gaj6_ps_feeding_tables DROP COLUMN source_kind, DROP COLUMN source_verification_status,
          DROP COLUMN source_verified_at, DROP COLUMN source_verified_by;
import_log: + action, old_provenance, new_provenance, batch_id, product_id, feeding_table_id, created_at (nullable)
```
222 senų lentelių turinys (canonical_table_hash) NEPAKITO — migracija tik additive nullable stulpeliai.

**★ GALUTINĖ TIKSLI BŪSENA:**
```
S212-B data model / integrity / test harness   = CLOSED
S212-B production importer reference impl.      = VALIDATED (canonicalizer 9/9, matrica 6/6, checksum norm PASS)
petshop-core production integration             = PENDING
241/242/243 official-source promotion           = BLOCKED (laukia oficialių šaltinių)
checksum normalization during promotion         = DONE (path A, testuota)
temporary cleanup snippet deactivation          = DONE (74 aktyvūs, 0 sesijos tokenų)
```

**★ KITI ŽINGSNIAI:** (1) integruoti canonicalizer+importer į petshop-core plugin (ne reference kodą); (2) oficialūs gamintojo šaltiniai INPM11/INPS06/HHFM11; (3) promotion per official importer (checksum normalizuosis automatiškai); (4) tik tada verified+active.

⚠️ **NEUŽDARYTA GALUTINAI:** oficialaus S212-B CSV importerio pilnas kelias (schema+source validacija, batch žurnalas) NEatkartotas — perimportas per tikslų canonicalizerį + transakciją + regression, bet ne per patį S212-B CSV importerį. Exclusion runtime MVP coverage po šio perskaičiuoti atskirai (sausas MVP / runtime eligible / instock). „13 sauso be normos post_content" ≠ gamintojas neturi — oficialūs šaltiniai netikrinti.

**★ TILTO PAMOKA:** ps_feeding_tables turi 4 NOT NULL be default (`checksum, checksum_algo, source_hash, source_hash_algo`) — pirmas INSERT tyliai failino, paliko 25 orphan rows + 3 orphan map (tid=0), išvalyta. `canonical_hash_version` = varchar(20). **Dry-run privalo validuoti INSERT reikalavimus, ne tik parse.**

**S212-C KODO PROGRESAS:** Calculator ✅29/29 · Repository ✅7/7 · kontraktai ✅ · svorio migracija ✅ · **Package Resolver ✅35/35** · Condition_Mapper ⬜ · Package Provider ⬜ · statuso backfill auditas ⬜ · Feeding_Service ⬜ · integracija ⬜.

**★★★ CONDITION SCHEMA AUDITAS — FAKTINIS (2026-07-18, read-only, DB nekeista) ★★★**

> Faktai, NE interpretacija. Farmina #110 ir 14 Monge — struktūros skirtumas nustatytas, jo SEMANTIKA dar ne. Neužrakinta „Farmina=klaida" ar „Monge=multi-axis".

```
Condition schema audit:
- active verified tables: 212
- unconditional_table: 123
- fully_conditioned: 74
- explicit_default_supported: 0
- mixed condition schema pending review: 1 (Farmina #110)
- inconsistent dimension schema pending review: 14 (Monge)
- invalid JSON: 0
- same coordinate conditional + unconditional conflicts: 0
- redirect/value schema conflicts: 0

No unconditional row is treated as default without explicit source semantics.
Farmina #110 and 14 Monge tables remain runtime unsupported/partial pending source review.
```

**★ DIMENSIJŲ REIKŠMĖS (kanoninės, baigtinės — `allowed_values` bazė Mapper'iui):**
```
activity_level:        low · moderate · high
body_condition:        thin · ideal · heavy
lifestyle:             indoor · outdoor
feeding_type:          dry_only · mixed
life_stage:            weaning · senior
svorio_valdymas:       reduce · maintain
weight_predisposition: prone_to_obesity
```

**★ KRITINIS MAPPING FAKTAS:** `ps_pets` turi `life_stage`, `is_sterilised`, `dog_size`, `feeding_type`. `ps_feeding` reikalauja `activity_level`, `body_condition`, `lifestyle`, `svorio_valdymas`. **Persidengia tik `feeding_type` (dry_only/mixed) ir iš dalies `life_stage`.** → daugumai fully_conditioned (74) + inconsistent (14) lentelių profilis NEpateiks ašies → teisingas kelias `MISSING_CONDITION_DIMENSION` → `needs_input` (klientas renkasi UI iš `allowed_values`). NE klaida — numatyta kontrakte.

**⚠️ PENDING SOURCE REVIEW (prieš Mapper baigimą):**
- **Farmina #110** (`age`, 1 su sąlyga, 4 be, koordinatės NEsikerta): galimai skirtinga struktūra amžiaus ruožams (pvz. senior → papildoma life_stage). Būsena `MIXED_CONDITION_SCHEMA_PENDING_REVIEW` — runtime nenaudoja, NEtaisom rankiniu, kol nematėme visų 5 eilučių + šaltinio.
- **14 Monge** (`lifestyle` + `activity_level` skirtinguose eilutėse): TRYS galimi variantai neišspręsti — (1) tikras 2 ašių tinklelis (reikia abiejų), (2) alternatyvios dalys (katėms indoor/outdoor, kt. activity), (3) šaltinio antraštės flattening klaida (viena ašis, du pavadinimai). **Neskelbti multi-axis, kol neįrodyta** — kitaip reikalautume 2 vartotojo atsakymų, kurių gamintojas niekada kartu neprašė.

**KITAS ŽINGSNIS:** ~~ištraukti 14 Monge~~ ✅ IŠTRAUKTA — žr. diagnozę žemiau.

**★★★ MONGE + FARMINA SCHEMOS DIAGNOZĖ (2026-07-18, read-only) ★★★**

> **SVARBU: tai NE gamintojo duomenų klaidos, o MŪSŲ normalizuoto modelio defektai.** Todėl taisyti reikia PAČIUS duomenis (per S212-B versijavimą), NE Mapper fallback taisyklėmis. Skirtingos problemos → atskiros būsenos.

**★ MONGE — 14 lentelių (id 72,73,74,75,127,146,147,148,149,150,151,153,154 + 1): `SINGLE_AXIS_SPLIT_LABEL_PENDING_NORMALIZATION`**
Struktūra visose 14 vienoda: `lifestyle=indoor` · `lifestyle=outdoor` · `activity_level=high` — **tie patys svoriai, didėjančios normos** (pvz. id153 2kg: indoor=50 < outdoor=55 < high=65). **Tai NE dviašė lentelė** — viena semantinė ašis su 3 alternatyviais profiliais, kurią parseris suskaldė į DU raktus (`lifestyle` + `activity_level`). Vartotojui reikia VIENO atsakymo, ne dviejų.
- **NEskelbti multi-axis** (reikalautų 2 atsakymų, kurių gamintojas kartu neprašė).
- **NEmapinti `indoor→low`** — tai mūsų interpretacija, gamintojas jos nepateikė.
- **Normalizavimo tikslas (VĖLIAU, ne dabar):** viena kanoninė ašis **`activity_profile`** su šaltiniui artimomis reikšmėmis **`indoor` · `outdoor` · `high_activity`**. Vartotojo klausimas: „Koks gyvenimo būdas ir aktyvumas?" → namisėda / lauko / labai aktyvus.
- Runtime kol kas NENAUDOJA. Mapper jų neliečia.

**★ FARMINA #110: `HYBRID_AGE_AXIS_PENDING_MODEL`** (KITA problema, NE tas pats žymuo)
5 eilutės: `weaning` (life_stage) · 2-4mėn · 5-7mėn · 8-10mėn · 11-12mėn (age_m). **Viena amžiaus/vystymosi ašis, bet pirma reikšmė kategorinė, kitos skaitiniai intervalai** — hibridinis ašies tipas, ne du pavadinimai. Kačiukų augimo lentelė.
- **NE `Condition_Mapper` problema.** Sprendimas: arba šaltinyje nustatyti `weaning` amžiaus intervalą → normalizuoti į age_m, arba vėliau išmokyti Calculator dirbti su kategoriniu `weaning` etapu šalia `age_months`.
- Runtime kol kas NENAUDOJA.

**★ NORMALIZAVIMO KELIAS (VĖLIAU — per S212-B versijavimą, JOKIO tiesioginio UPDATE):**
Šaltinio patikra → normalizuoto turinio DRY-RUN → naujas `canonical_table_hash` → draft v2 kiekvienai → Calculator+Mapper elgsenos patikra → atominis v1→v2 → senos versijos auditui. **Monge 14 gali būti VIENA taisyklė, bet prieš APPLY įrodyti, kad visose 14 šaltinio struktūra tikrai vienoda.**

**★ SPRENDIMAS DABAR:** Condition_Mapper sutartis tęsiama BE šių 15 lentelių. Mapper startuoja beveik be automatinių taisyklių. Trūkstamos `activity_level`/`body_condition`/`lifestyle` → `needs_input`. Jokio `indoor→low` neužrakinta.






**TOLIAU (senesnis):** regresijos patikra po ZB ciklo → **S212-C** (engine).

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
