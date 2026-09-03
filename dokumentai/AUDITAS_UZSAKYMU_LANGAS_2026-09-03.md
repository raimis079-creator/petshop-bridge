# AUDITAS — UŽSAKYMŲ LANGAS („Petshop užsakymai“) — 2026-09-03

> **Objektas:** `mu-plugins/petshop-darbalaukis.php` **v2.0** (S1607, deploy'inta run7a/7b, md5 `fa7966a3` — sutampa su serverio md5 iš `analize/e2_run7b.json`), ant variklio `petshop-desk.php` v3.48 (K1), `petshop-av-dropship.php` v1.19, `petshop-av-tiekimas.php` v1.9.3, `petshop-siuntu-laiskai.php` v1.2, `petshop-uzsakymu-ivykiai.php` v1.1.
> **Metodas:** statinis kodo auditas (eilučių nuorodos — į v2.0 failą ir desk v3.48) + šios dienos testų įrodymai (`analize/e2_run6.json`, `e2_run7b.json`, `e2_run8.json`, nuotraukos `e2i_*`) + spec v1.1, logikos registras v1, auditas 09-02. **Dev'e nieko nevykdžiau ir nekeičiau.** Teiginiai, kurių neįrodo testų failai, pažymėti „*patikrinti testu*“.
> **Tikslas:** pretestas prieš 3–6 etapus, kad 4 etapo automatika (sekimas) nebūtų statoma ant klaidingo pamato.

---

## 0. VERDIKTAS

Architektūros kryptis **teisinga** ir geresnė nei senasis desk: variklis nepaliestas (R13), eilės išvedamos iš faktų, „likutis seka kelią“ eilutės lygiu, žurnalas su prieš/po, testavimas darbuotojo paskyra. Šiandienos run6–8 įrodo du pilnus kelius: grynas AV (rūšiuota auto → surinkti → lipdukas V…048 → išsiųsta → sekimo laiškas) ir Prins → klientui (lipdukai V…046/047 → laiškas → Paruošta).

Bet **iki „idealu“ trūksta 4 kritinių dalykų**, iš kurių du (K1, K4) yra **duomenų modelio** klaidos — jas pigiau taisyti dabar nei po 4 etapo:

| # | Kas | Rizika |
|---|---|---|
| 🔴 K1 | Po Tiekimo priėmimo (K2) eilutė lieka `_ps_kelias=i_av` → užsakymas amžinai „Laukiam iš tiekėjų“, į „Surinkti“ nepatenka | užsakymas užstringa; darbuotojas neturi išeities |
| 🔴 K2 | Atvirų užsakymų riba 300 + pending/failed tarp jų + viskas perskaičiuojama kas 60 s | tylus dingimas iš eilių augant apimčiai; lėtėjimas |
| 🔴 K3 | „Lipdukas“ = reali (mokama) Venipak siunta vienu paspaudimu be patvirtinimo, be atšaukimo kelio | pinigai už neišsiųstas siuntas; manifestai su šlamštu |
| 🔴 K4 | Mišraus užsakymo „Išsiųsta“ = visas užsakymas `completed` — nėra dalies (sandėlio) išsiuntimo būsenos | melagingas „įvykdytas“ arba klientas be sekimo laiško; 4 etapo sekimas neturės ant ko rašyti |

Nė vienas neblokuoja darbo dev'e šiandien; **K1 ir K4 blokuoja 4 etapą**, K3 — pirmą realią savaitę.

---

## 1 DALIS — SISTEMA (algoritmai, patikimumas, logika)

### 1.1 Pliusai

| + | Kas | Kur / įrodymas |
|---|---|---|
| A1 | **Variklis nepaliestas**, naujas langas kviečia tuos pačius `ps_desk_veiksmas` (nonce `ps_desk_{v}_{id}`, `g=` grįžimas) per `ReflectionMethod` — regresijos rizika maža, grįžimas `&senas=1` vienu paspaudimu | v2.0 eil. 121–127, 379–387 |
| A2 | Vienas veiksmų taškas su teisėmis, nonce, `wp_validate_redirect`, pastaba užsakyme, žurnalo įrašas (C9) | desk `vykdyti_veiksma()` 624–1032; v2.0 `vykdyti()` 445–468 |
| A3 | K1 (09-02) sargai veikia abiejuose keliuose: `vp_reg`/`vp_bulk` praleidžia ne-processing, dublio sargas `turi_siunta()`, paštomato sargas, mišrūs per masinį praleidžiami | desk 664–672, 733–751 |
| A4 | **„Likutis seka kelią“** įgyvendinta eilutės lygiu (`_ps_av_reduced_qty`), su užraktu po pirmo žingsnio (A8), grąžina ir K2 atvejį be kiekio; klaidos grąžinamos žmogaus kalba („Avesoje tik N“) | v2.0 `keisti_kelia()` 509–567 |
| A5 | Auto rūšiavimas **konservatyvus**: tik kai visos eilutės turi šaltinį ir vienas kelias; AV+tiekėjas → žmogus; klausimas → ne; atšaukiamas iki lipduko; žurnale priežastis | v2.0 623–635; run6: #35437 `rus=auto`, #35438 (AV+Prins) liko žmogui |
| A6 | Eilės **išvedamos iš faktų kiekvieną kartą** (ne saugomos) — užsakymas negali „pasimesti“ tarp eilių; skaitliukai ir sąrašai iš tos pačios `faktai()` → nesiskiria (senojo audito V1 uždaryta) | v2.0 705–716; run6 `3_kur_A/B` |
| A7 | C3 veikia: užsakymas visose eilėse, kur reikia veiksmo (#35438 po rūšiavimo — ir „Surinkti“, ir „Laiškai“) | run6 `5_kur_B` |
| A8 | Žurnalas `ps_uzsakymu_ivykiai` su prieš/po, kanalas web/auto, gaudo ir variklio veiksmus iš išorės | ivykiai v1.1; run8 `zurnalas` 6 įrašai teisinga tvarka |
| A9 | V3/I1 uždaryta: „Išsiųsta“ siunčia sekimo laišką su visais numeriais iš `_ps_siuntos` (V4), §18.3 sargas žmogaus kalba | v2.0 569–597; run8 `mail` |
| A10 | Laiškų kortelė ant esamo dropship variklio (`ps_dropship_send` + `wp_redirect` filtras grįžimui) — nė viena G1–G7 taisyklė neperrašyta | v2.0 79–92, 864–916; run7b `6_siusti` |
| A11 | Saugumas: nonce visur, `esc_attr/esc_html/esc_url`, `data-json` per `esc_attr(wp_json_encode)`, trynimas tik `delete_shop_orders`, HPOS `delete(true)` | visas failas |
| A12 | Testavimo metodika: darbuotojo rolė per realius endpoint'us + `pre_wp_mail` gaudymas + Playwright nuotraukos — geriau nei dauguma komercinių komandų | `irankiai/darbuotojo_testas_sablonas.php` |

### 1.2 Minusai — 🔴 kritiniai

#### K1 — Po priėmimo į Avesą eilutė lieka „→ Avesa sandėlį“ → užsakymas užstringa „Laukiam“
**Kodas.** `eilutes_kelias()` (v2.0 203–222): jei `_ps_kelias` nustatytas, jis **viršesnis** už `_ps_source`; partijos būklė `$b` užklausiama **tik kai `_ps_source !== 'av'`**. Tiekimo K2 `priimti()` (tiekimas v1.9.3 eil. 1325) rašo `_ps_source='av'`, bet **`_ps_kelias` nežino** (`grep _ps_kelias` tiekime/dropship'e/desk'e = 0).
**Pasekmė** (`faktai()` 247–252): `k='i_av'`, `src='av'`, `$b=null` → „neužsakyta“, `$i_av_laukia['av']=1` → `vietoje=false` → eilė „Laukiam iš tiekėjų“ visam laikui; takelis „užsakyti Avesa“; mygtukas „Užsakyti iš Avesa“ → variklio `kons` praleidžia `av` eilutes → `kons_nieko`. Į „Surinkti“ nepatenka niekada.
**Kodėl nepagauta šiandien:** #35434/#35421 surūšiuoti PRIEŠ atsirandant `_ps_kelias` (run7b `backfill/ne`) — jiems veikia senas kelias (`_ps_kelias` tuščias → išvedama iš `_ps_source`). Klaida pasirodys pirmam užsakymui, surūšiuotam naujame lange su „→ Avesa sandėlį“ ir priimtam per Tiekimą. ***Patikrinti testu T1.***
**Taisymas.** (a) Greitas: `eilutes_kelias()` — jei `'i_av'===$k && 'av'===$src` → `$k='av'` (prekė jau Avesoje). (b) Teisingas: K2 `priimti()` po `_ps_source='av'` rašo `_ps_kelias='av'` ir `_ps_kelias_buvo='i_av'` (istorija takeliui „gauta“). (c) Principas: **keliui — vienas tiesos šaltinis.** Dabar jį aprašo 4 laukai (`_ps_source`, `_ps_kelias`, `_ps_konsolidacija`, `_ps_misrus_sprendimas`) ir 2 lentelės (partija, siuntos); kiekvienas variklio rašymas į `_ps_source` (K2, senas `klaus siusti/parsivezti`, seno desk `av|sava|dropship`) gali išderinti. Siūlau: `_ps_kelias` = **ketinimas** (rašo tik žmogus/auto), o rodomas kelias = `f(_ps_source, partijos būklė)`; `i_av` galioja tik kol `_ps_source !== 'av'`.

#### K2 — Riba 300 atvirų + pending/failed tarp „atvirų“ + pilnas perskaičiavimas kas 60 s
**Kodas.** `atviri()` (v2.0 649–652): `wc_get_orders(limit 300, status processing/on-hold/**pending/failed**/lp-parcel-await/lp-parcel-failed + LP paruošta, DESC)` → `faktai()` kiekvienam (per eilutę `resolve()`, `eilutes_bukle` SQL, `perduotos()`, `Siuntos::sarasas`, `klausimas()`, žurnalo SQL). Skaitliukai `$c` — iš to paties sąrašo (709–711). Auto-refresh kas 60 s (1127).
**Pasekmė.** `failed` niekada neišnyksta (pending naikina `hold_stock_minutes=90`); po kelių mėnesių atvirų >300 → **seniausi atviri (t. y. ilgiausiai laukiantys — svarbiausi) tyliai dingsta iš visų eilių ir skaitliukų**, be jokio įspėjimo. Antra: puslapis neša `data-json` (skydelis + žurnalas 30 įr.) kiekvienai eilutei — run8 „Visi“ 29 užs. = 256 834 B (~9 KB/užs.) → 300 užs. ≈ 2,7 MB kas 60 s, mobiliame — ypač. Šiandien (29 užs.) nesimato; **problema auga tyliai**.
**Taisymas.** (1) Neapmokėti — atskira užklausa (pending/failed ≤ 14 d., riba sava); „atviri“ = tik processing/on-hold/LP paruošta, riba ≥ 1000 **ir** įspėjimas juostoje „rodomi ne visi (N)“, kai grąžinta == riba. (2) `data-json` be žurnalo (žurnalą ir skydelį krauti pagal poreikį per AJAX/REST `?rest_route=`). (3) Vidutiniu laikotarpiu — eilių kešas: `_ps_eiles` (JSON) perskaičiuojamas hook'ais po kiekvieno veiksmo/statuso, sąrašas skaito meta, o `faktai()` — tik atidarytam skydeliui. Tada 60 s atnaujinimas kainuoja vieną SQL.

#### K3 — „Lipdukas“/„Lipdukai (n)“ sukuria realią Venipak siuntą be patvirtinimo ir be atšaukimo
**Kodas.** `mygtukas('lipdukas')` (v2.0 366–368) → tiesioginis `vp_reg` GET, jokio dialogo; laiškų kortelėje „Lipdukai (n)“ (~893) — tas pats. Perregistravimas (H258) palieka **seną siuntą Venipak'e** (pastaboje „nebenaudojama“ — bet Venipak apie tai nežino). Atšaukimas per API neįgyvendintas (Raimis trina savitarnoje — audito §7).
**Pasekmė.** Vienas netyčinis paspaudimas (sąraše mygtukai vienas šalia kito, `j/k/Enter`) = registruota siunta; §11.1 (ar neatsiimta siunta kainuoja) **neatsakytas** — reikia laikyti, kad kainuoja. Su „klaidų tolerancija ≈ 0“ tai pirmas taisytinas UI dalykas.
**Taisymas.** Dialogas prieš registraciją su faktais, kurių dabar nėra ekrane: *sandėlis · dėžių N · paštomatas/adresas · svoris · manifestas* (dėžių lauką dėti į dialogą — uždaro ir V7). Venipak `cancel`/`delete` API — patikrinti dokumentacijoje (`ws/`), jei yra → „Atšaukti siuntą“ skydelyje su žurnalu; jei nėra — atšaukimo dialoge aiškiai: „siunta V… lieka Venipak'e — ištrink savitarnoje“ (žr. V6).

#### K4 — Mišraus užsakymo „Išsiųsta“ neturi dalies būsenos
**Kodas.** `issiusta()` (v2.0 569–597): patikrina, kad visos dalys turi lipduką/laišką, ir daro `completed` **visam užsakymui**; jokios eilutės/sandėlio lygio žymės „išėjo“. `paruostos_korteles()` (918–941) rodo Avesos ir tiekėjų korteles atskirai, bet abiejose mygtukas veda į tą patį veiksmą, kuris leidžiamas tik kai **visos** dalys perduotos (`mygtukas_eilei` 152–160).
**Pasekmė.** Realus scenarijus: kurjeris paėmė AV dalį 11:00, VF išsiųs rytoj. Darbuotojas arba (a) laukia — klientas negauna sekimo laiško apie jau išvažiavusią siuntą, arba (b) spaudžia „Išsiųsta“ — `completed` melagingas, „VF išsiuntė“ užfiksuota anksčiau, nei įvyko; SLA sargas (`_ps_sla_velavimas`) ir 4 etapo sekimas neturės ant ko remtis (spec 6a: „kai visos dalys paimtos → completed“ — reikalauja dalies būsenos).
**Taisymas (dabar, prieš 4 etapą).** Užsakymo meta `_ps_dalys_issiusta {sandelis: {laikas, kas, kanalas}}`. „Kurjeris paėmė (Avesa)“ žymi tik `av`; „[T] išsiuntė“ — tik `T`; `completed` + vienas sekimo laiškas — kai visos; 4 etapo cron rašys į tą patį lauką (`kanalas=auto`). Politika sekimo laiškui su pirmąja dalimi (siųsti iš karto ar laukti visų) — Raimio sprendimas (§11), bet laukas turi būti dabar.

### 1.3 Minusai — 🟠 vidutiniai

| # | Kas | Kur | Pasekmė | Taisymas |
|---|---|---|---|---|
| V1 | **Prekė be šaltinio** (`resolve()` nieko): žymė „kur?“, visi trys keliai pilki (`galimi` false 259), „Surūšiuota“ negalima (606), `klausimas()` tokio atvejo nežino | v2.0 259, 606; desk 1224–1268 | Užsakymas kabo „Nauji“ be išeities (STATE „NEUŽDARYTA 3“ vis dar atvira) | `klausimas()` → „Prekė be sandėlio“ + kortelė; skydelyje leisti „Avesa sandėlis“ rankiniu būdu su įspėjimu (be likučio patikros, žurnale „rankinis“) arba tiekėją iš sąrašo |
| V2 | **Likučio judesys neatominis**: `likutis()` skaito `_stock` ir rašo `set_stock_quantity` (476–479); veiksmas GET, dvigubas paspaudimas per <300 ms → dvi užklausos → +2q | v2.0 470–481 | Likučio drift'as, kurio niekas nepamatys | `wc_update_product_stock($p,$q,'increase'/'decrease')` (atominis SQL, kelia WC hook'us); transient užraktas `ps_dl_lock_{id}` veiksmo metu; JS — mygtuką išjungti po paspaudimo |
| V3 | `wp_cache_flush()` po kiekvieno kelio keitimo | v2.0 558 | Išvalo VISĄ objektų kešą (juostos `ps_juosta_sk`, produktų kešai) | `wc_delete_shop_order_transients($id)` + `clean_post_cache` prekei |
| V4 | Klausimų tekstai siunčia į **išjungtą** „Redaguoti“ („Siuntos sukurti nepavyko“, „LP negalimas“) | v2.0 960, 969; 1100 (`disabled`) | Aklavietė: kortelė liepia daryti tai, ko nėra | Iki 5 etapo — realus kelias tekste (WC užsakymo langas per ⋯ / „paprašyk Raimio“) arba tekstą slėpti |
| V5 | **„Surinkta“ = žurnalo įrašas `lapai`** (puslapio atidarymas, ne spausdinimas); užrakto (R8) nebėra → tai vienintelė apsauga nuo dvigubo surinkimo | v2.0 178–188, 274 | Neatsidarė/neišsispausdino/žurnalas nesuveikė (gaudymas per `wp_redirect` filtrą) → užsakymas grįžta į „Surinkti“ arba, atvirkščiai, laikomas surinktu | `_ps_surinkta` užsakymo meta (laikas\|kas), rašoma lapų puslapyje; skydelyje „Atšaukti surinkimą“; vėliau — patvirtinimas skenuojant EAN |
| V6 | **Atšaukimo dialogas tylus apie pasekmes**: neįspėja, kad siunta jau registruota Venipak'e / laiškas tiekėjui jau išsiųstas / partija užsakyta | v2.0 414; desk 895–908 | Tiekėjas išsiunčia atšauktą užsakymą (prekės + pinigai); Venipak sąskaita | Dialogo tekstas iš `faktai()['dalys']`: „⚠ VF laiškas išsiųstas 11:04 — parašyk tiekėjui“, „⚠ siunta V… registruota — ištrink savitarnoje“; žurnalo įrašas „reikia pranešti tiekėjui“ → Klausimas |
| V7 | **Dėžių laukas** skydelyje: `input` + nuoroda „Išsaugoti“; Enter nieko nedaro (klaviatūros handleris input'e apdoroja tik Esc, 1110); „Lipdukas“ footer'yje **neima** įvestos reikšmės (368 — be `n`) | v2.0 1093–1095, 368 | Įvedė 3, spaudė „Lipdukas“ → 1 dėžė → perregistravimas (H258 scenarijus vėl) | „Lipdukas“ URL ima `n` iš lauko (kaip `perreg`), Enter = išsaugoti; geriausia — dėžių laukas dialoge (K3) |
| V8 | **Masiniai veiksmai dingo**: „Surinkti Avesoje“ be „Surinkti visus (n)“ (vienas lapas) ir be „Lipdukai visiems (n)“ (variklio `vp_bulk` pagal sandėlį jau yra) | v2.0 `lentele()` 817–850 | 20 AV užsakymų ryte = 20 paspaudimų + 20 skirtukų; iki 3 etapo — kasdienis skausmas | Du mygtukai eilės apačioje dabar: `lapai&ids=…` ir `vp_bulk&ids=…` (rytinė eiga be užrakto — 3 etapas) |
| V9 | „Visi“: be puslapiavimo (200 naujausių); `siandien` filtras pagal `date_modified` (bet kokia pastaba = „išsiųsta šiandien“); paieška `wc_orders_meta.meta_value LIKE` be `meta_key` (pilnas skenavimas) | v2.0 654–663; desk 1310–1335 | Po paleidimo su tūkstančiais užsakymų — seni tik per paieška; „išsiųsta šiandien“ meluoja | Puslapiavimas `offset`; „išsiųsta šiandien“ iš `_ps_dalys_issiusta` (K4) arba `date_completed`; paieškai `meta_key IN (...)` |
| V10 | **Dvi sistemos LP**: „Lipdukas LP“ veda į seną langą (`senas=1&eile=nauji&q=`); senoji rytinė eiga su 3 val. užraktu vis dar pasiekiama (`view=rytas`) — prieštarauja R8 | v2.0 366, 108 | Darbuotojas dirba dviem logikom; LP lipdukas = kurjerio iškvietimas be įspėjimo (audito S2 vis dar atvira naujame lange) | Iki savo endpoint'o — dialogas: „LP lipdukas formuojamas senoje eigoje; formavimas IŠKVIEČIA kurjerį“; rytinės eigos nuorodą iš juostos slėpti iki 3 etapo |
| V11 | **Auto-refresh = `location.reload()`** kas 60 s (kai `activeElement===body`) + reload po 1,5 s atidarius lapą naujame skirtuke | v2.0 1121, 1127 | Dingsta slinktis, pažymėta eilutė (`mark(0)`), pranešimas; skaitant ilgą sąrašą — šokinėja | Tylus atnaujinimas (fetch → keisti tik skaitliukus/lentelę) arba bent: nereload'inti, jei pelė/žymeklis lentelėje, ir atkurti scroll/`cur` per `sessionStorage` |
| V12 | `perskaiciuoti_grupes()` (484–495) **dubliuoja** `Petshop_AV_Order::fiksuoti()` logiką (`_ps_order_type/_ps_groups/_ps_shipments`); `_ps_sekimo_siusta` (588) dubliuoja siuntų-laiškų modulio žymę | v2.0 | Dvi tiesos apie tą patį — išsiskirs po pirmo pakeitimo viename | Iškelti į variklį vieną viešą `Petshop_AV_Order::perskaiciuoti($o)` ir kviesti iš abiejų; sekimo laiško žymę laikyti vienoje vietoje (`Petshop_Siuntos`) |

### 1.4 Minusai — 🟡 smulkūs

- S1 `auto_rusiuoti` kviečiamas Paysera callback kontekste (`wp_get_current_user()` = 0) — žurnale „sistema“ ok, bet `rusiuoti()` pastaboje užsakyme `display_name` tuščias, kai `$auto` false ir uid 0 (tik teoriškai — `$auto` visada true iš hook'o).
- S2 „Kurjeris paėmė viską“ rodomas tik kai `count($visi) > 1` (929) — su vienu užsakymu kelias kitoks (eilutės mygtukas) → nenuoseklu.
- S3 Legenda rodo tik pirmo tiekėjo vardą kaip pavyzdį („Prins → klientui“) — su keliais tiekėjais klaidina.
- S4 Pranešimai iš variklio su trumpiniais: run8 `pd_nr "1 · AV"`, run7b `"2 · PRINS"` — prieštarauja A1 (vardai pilni); dialoge „Siųsti **WooCommerce** laišką“ — prieštarauja R2.
- S5 `visi()` su `q` naudoja variklio `gauti()` — filtrai `vykdymas/vezejas` taikomi, `busena` ne; smulkmena.
- S6 `data-json` sunkumas (žr. K2) — skydelis atsidaro iš 60 s senumo duomenų; po veiksmo kitoje kortelėje (lapas) — 1,5 s reload'as tai dengia, bet ne visada.
- S7 `riba()` skaičiuoja `strtotime()` PHP numatytoje zonoje ir `current_time('timestamp')` — abu „vietinis laikas kaip UTC“, todėl sutampa; jei kada kas nors pakeis į `time()`, ribos pasislinks 3 val. Verta komentaro kode.

---

## 2 DALIS — DARBUOTOJO PUSĖ (patogumas, aiškumas, paprastumas, klaidų tolerancija)

### 2.1 Pliusai

| + | Kas | Įrodymas |
|---|---|---|
| D1 | **Eilė = veiksmas**, pavadinimai darbo kalba; „Nauji“ tik neaiškiems (auto rūšiavimas nuima ~70 % rutinos); „naujas“ žyma šiandienos užsakymams visose eilėse | run7b `1_nauji` „Nauji 0 · Surinkti 12 · Laiškai 10“ |
| D2 | **Skydelis paaiškina, ne tik rodo**: trys keliai su pilkais negalimais ir „kodėl negalima“ (tooltip), „kodėl“ po prekėmis („Avesoje 24 vnt. — siūloma siųsti iš Avesos“), žingsneliai, užrakto priežastis („siunta jau registruota — perregistruoti?“) | run6 `4_skydelis_B_pries` |
| D3 | Laiškų kortelė = darbo eiga: **1 Lipdukai (n) → 2 Laiškas**, vartai „pirma lipdukai“, „Siųsti be lipdukų“ su patvirtinimu, peržiūra, prierašas, varnelės, ZB „Kopijuoti“; riba „iki 09:00 / po 09:00 — keliaus rytoj“ | run7b `6_kortele_txt` |
| D4 | Klausimų kortelės: priežastis su skaičiais („reikia 3, Avesoje 0, tiekėjo nėra“) + „Ką gali daryti“ + mygtukai; „Laukti“ aiškiai pasako, kad priminimo nebus | v2.0 943–978 |
| D5 | Po veiksmo grįžtama **į tą pačią vietą** su atidarytu skydeliu (`atidaryti=ID`), URL nuvalomas nuo `pd_ok` (reload nekartoja pranešimo) | v2.0 1122 |
| D6 | Klaviatūra `j/k/Enter/x///Esc`, skydelis ir dialogas su Esc; mobilus vaizdas yra | nuotrauka `e2h_mob` |
| D7 | Kliento pastaba pilna, nekarpoma (I6); paštomatas ir telefonas eilutėje | `lentele()` |
| D8 | Tuščia eilė sako „nieko daryti nereikia“ (ne „arba filtrai“) | 818 |

### 2.2 Minusai

| # | Sunkumas | Kas darbuotojui nutiks | Susiję su |
|---|---|---|---|
| E1 | 🔴 | **Pavojingi veiksmai be patvirtinimo, nepavojingi — su.** „Lipdukas“ (reali siunta, pinigai) ir kelio keitimas su likučio judesiu — vienas paspaudimas; „Išsiųsta“ (atšaukiama pakeitus statusą) — dialogas. Patvirtinimų logika atvirkščia rizikai | K3, V2 |
| E2 | 🔴 | **Nėra „atgal“**: surinkimo, lipduko, laiško atšaukti negalima; kelias — tik iki užrakto. Su „klaidų tolerancija ≈ 0“ undo yra svarbiausia savybė, ne dialogai | V5, K3, V6 |
| E3 | 🔴 | **Aklavietės**, kur žmogus neturi ką spausti: prekė be šaltinio (V1); po Gauta „Užsakyti iš Avesa“ → nieko (K1); Klausimų tekstas → išjungtas „Redaguoti“ (V4) | K1, V1, V4 |
| E4 | 🟠 | **Mišrus „Išsiųsta“** — neaišku, kada spausti: kai kurjeris paėmė mano dalį ar kai tiekėjas išsiuntė? Kortelės atskiros, veiksmas vienas | K4 |
| E5 | 🟠 | **Per daug paspaudimų rytą**: kiekvienas AV užsakymas — atskiras „Surinkti“ (naujas skirtukas) ir atskiras „Lipdukas“ | V8 |
| E6 | 🟠 | Dėžių laukas apgaulingas (Enter neveikia, „Lipdukas“ neima reikšmės) | V7 |
| E7 | 🟠 | Atšaukimas neįspėja apie tiekėją/Venipak — klaida, kurią darbuotojas sužinos iš sąskaitos | V6 |
| E8 | 🟠 | **Dvi sistemos** LP užsakymams ir vis dar gyva senoji rytinė eiga su užraktu — kolega gali dirbti kita logika | V10 |
| E9 | 🟠 | Ekranas „pats persikrauna“ skaitant — dingsta vieta ir pažymėjimas | V11 |
| E10 | 🟡 | Žodyno likučiai: „AV/PRINS“ pranešimuose, „WooCommerce laiškas“ dialoge, „Surūšiuota — į darbą“ vs „Rūšiuoti“ vs „Surūšiuota“ (spec §2: vienas žodis) | S4 |
| E11 | 🟡 | Trūksta vieno žvilgsnio „ką daryti DABAR“: raudona zona (Klausimai + vėluoja + išsiųsta be sekimo laiško) ir „iki 11:00 liko 40 min — 6 surinkti“. Eilių juostelės su skaičiais tai daro iš dalies; „dega“ akcento nėra | senojo audito §5 |
| E12 | 🟡 | „Kurjeris paėmė viską“ tik kai >1; legenda su vieno tiekėjo vardu; „Redaguoti/Sąskaita“ pilki be paaiškinimo kada bus | S2, S3 |

---

## 3. REKOMENDUOJAMA EILĖ (prieš 3 etapą, viena desk versija = vienas punktas)

1. **K1** — `eilutes_kelias()` + K2 `priimti()` rašo `_ps_kelias='av'`; testas T1.
2. **K4** — `_ps_dalys_issiusta` dalies lygiu; „Kurjeris paėmė“ / „[T] išsiuntė“ atskirai; `completed` kai visos. (Pamatas 4 etapui — daryti PRIEŠ sekimą.)
3. **K3 + V7** — registracijos dialogas su dėžėmis/paštomatu/svoriu; Venipak cancel API recon.
4. **V1** — prekė be šaltinio → Klausimas + rankinis kelias.
5. **V8** — „Surinkti visus (n)“ + „Lipdukai visiems (n)“ (`vp_bulk`) eilės apačioje.
6. **V6 + V4 + S4** — dialogų ir kortelių tekstai (viena versija).
7. **K2** — Neapmokėti atskirai, riba + įspėjimas, `data-json` be žurnalo (skydelis per AJAX).
8. **V2 + V3** — atominis likutis, užraktas, be `wp_cache_flush`.
9. **V5** — `_ps_surinkta` meta + „Atšaukti surinkimą“.
10. **V11, V10, V9, V12** — 3 etape kartu su rytine eiga be užrakto.

---

## 4. TESTAI PRIEŠ „PADARYTA“ (darbuotojo paskyra `testuotojas`, esami testiniai #35414–#35438)

| T | Scenarijus | Ko tikėtis po taisymo |
|---|---|---|
| T1 | Naujas AV+Prins → skydelyje Prins → „Prins → Avesa sandėlį“ → Surūšiuota → „Užsakyti iš Prins“ → Tiekime partiją priimti (visas kiekis) | Eilė **„Surinkti Avesoje“**, takelis „✓ gauta“, surinkimo lape **abi** prekės, `_ps_shipments`=1 |
| T2 | Kelias `av → tiesiai → av` tam pačiam užsakymui du kartus greitai (dvi užklausos lygiagrečiai) | AV likutis grįžo į pradinį (±0), žurnale 2 įrašai su „nepakeistas“ antram |
| T3 | Programiškai sukurti 320 `failed` užsakymų (klientas „AUDITAS“) | Eilių skaitliukai = realūs; įspėjimas „rodomi ne visi“ arba visi rodomi; puslapio dydis < 500 KB |
| T4 | Mišrus AV+VF: Lipdukas AV → „Kurjeris paėmė“ → (VF laiškas dar nesiųstas) | Užsakymas ne `completed`; klientui laiškas apie AV siuntą (arba ne — pagal §11 sprendimą), VF dalis „Laiškai“; po „VF išsiuntė“ → `completed` |
| T5 | Prekė be `_ps_sandelis` ir be tiekėjo, apmokėta | Eilė „Klausimai“ su kortele „Prekė be sandėlio“, skydelyje galima „Avesa sandėlis“ rankiniu būdu |
| T6 | Dėžių laukelyje 3, Enter, tada „Lipdukas“ | Venipak `packs[]`=3 (kurjeris) / 3 siuntos (paštomatas); dialogas parodė „3 dėžės“ prieš registruojant |
| T7 | Atšaukti užsakymą po laiško tiekėjui ir po Venipak registracijos | Dialoge įspėjimai su siuntos nr. ir tiekėjo vardu; žurnale „pranešti tiekėjui“; Klausimas iki pažymėjimo |
| T8 | „Paruošta“ su vienu AV užsakymu | Tas pats kelias kaip su keliais („Kurjeris paėmė“) |
| T9 | Dvigubas „Lipdukas“ paspaudimas (dvi užklausos) | Viena siunta Venipak'e, antra užklausa „jau registruotas“ |
| T10 | Dvi naršyklės (du vartotojai) tą patį užsakymą: A rūšiuoja, B atšaukia | Abu mato teisingą galutinę būklę; jokio likučio drift'o (V2 užraktas) |

---

## 5. KAS NEPATIKRINTA / PRIELAIDOS

- Kodas skaitytas iš deploy'intos v2.0 (atkurta iš run7a+run7b payload'ų, md5 sutampa); **deploy/ kataloge repo yra tik v1.0** — po sesijos v2.0 įkelti į `deploy/` (Raimio taisyklė: rezultatai iš repo).
- LP Express kelias (J1) — netestuojamas iki T-0, čia neliestas.
- Venipak `cancel` API buvimas — nepatikrintas (K3 taisymo prielaida).
- Variklio `Petshop_AV_Dropship::grupuoti()` ir `neperduotos()` pagarba `_ps_misrus_sprendimas` (A10) — laikoma teisinga pagal registrą v1 ir run7b (`#35438` į Prins kortelę pateko tik po rūšiavimo); su `_ps_kelias='i_av'` be plano (auto rūšiavimas kelių tiekėjų) — *patikrinti testu*.
- K2 sunkumas priklauso nuo realios apimties: šiandien 29 užsakymai — nesimato; ties ~250 atvirų (įskaitant failed) pasirodys.
