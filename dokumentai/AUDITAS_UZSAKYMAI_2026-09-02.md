# UŽSAKYMŲ SISTEMOS AUDITAS — 2026-09-02

> Aprėptis: darbalaukis (desk v3.47), rytinė eiga, Venipak registracija/lipdukai/manifestai, perdavimas tiekėjams (dropship v1.19), Tiekimas (v1.9.2), siuntų registras (siuntu-laiskai v1.2), Klausimai, atšaukimai, sekimo laiškai. Aplinka dev.avesa.lt.
> Metodas: **17 testinių užsakymų** (AUDITAS Testas 1–17, #35414–#35430), visi veiksmai atlikti **darbuotojo paskyra `testuotojas` (rolė `ps_darbuotojas`) per realius admin-post endpoint'us su nonce** — ne per kodą tiesiogiai. 9 bridge run'ai. Venipak API kviestas realiai: **13 siuntų V07267E1000030–043**, manifestai `07267260902001/002/003/004/006` (trinti Venipak savitarnoje). LP Express nekviestas (kviečia kurjerį).

---

## 1. VERDIKTAS

Sistema **veikia** visais pagrindiniais keliais (grynas AV, dropship, mišrus su planu, kelių dėžių, paštomatas kelioms dėžėms, neapmokėtas → apmokėtas, atšaukimas, Klausimai, Tiekimas kurjeriu). Iki „idealu" trūksta **3 kritinių defektų** ir **4 vidutinių**, visi pataisomi be architektūros keitimo. Nė vienas neblokuoja paleidimo, bet K1 ir K2 gali sukelti realų pinigų/prekių nuostolį pirmą savaitę.

---

## 2. KAS VEIKIA (patikrinta realiai)

| Kelias | Testas | Rezultatas |
|---|---|---|
| Šaltinių priskyrimas apmokėjus | 17 užs., 7 sandėliai | `_ps_source` eilutėms, `_ps_order_type` MAIN/DS/MIXED, `_ps_shipments` — visi teisingi |
| Eilės | visos | Nauji / Mišrūs / Neapmokėti / Laukia prekių / Paruošta / Klausimai / Išsiųsti / Atšaukti — rūšiuoja teisingai, skaitliukai sutampa su eilutėmis |
| Klausimas „Trūksta sandėlyje" | #35423 (likutis 1, perka 3) | AV nurašyta 1→0, kortelė su „reikia 3 · AV likutis 0 · tiekėjo nėra", Laukti/Atšaukti |
| Mišraus planas | #35419 (AMB+VF tiesiai) | „Patvirtinti planą" → Nauji su „Perduoti" abiem |
| Mišraus planas „į AV" | #35421 (QUA→AV) | → Laukia prekių, Tiekimo partija #10 sukurta automatiškai |
| Pažymėti apmokėtu | #35422 bacs | → Nauji, laiškas klientui „apmokėjimas gautas", AV nurašymas |
| Atšaukti | #35424, #35430 | cancelled, likutis grįžo (+1), laiškas klientui nesiųstas |
| Rytinė eiga 6 žingsniai | pilna | partija užrakinama, AV/dropship/mišrūs/klausimai atskirti teisingai |
| Venipak grupinė registracija pagal sandėlį | AV 3 užs., VF, ZB, AMB | kiekvienam sandėliui **savas manifestas** (001/002/003/006), pack nr. iš plugino skaitiklio (1000040 DB = paskutinis) |
| Kurjeris 3 dėžės | #35428 | 3 pack'ai `packs[]` V…033–035, vienas manifestas |
| Paštomatas 2 dėžės | #35429 | 2 atskiros siuntos V…031–032 (H259) |
| Dublio saugiklis | pakartotinis vp_reg | „#35427 jau registruotas…" — nieko nekartoja |
| Manifesto PDF | 4 manifestai | `print_list` → tikras PDF, 66 KB |
| Lipdukai per „Venipak lipdukai" | 3 AV užs. | vienas PDF, **6 puslapiai** (1+3+2) — sutampa su dėžėmis |
| Surinkimo lapai | 4 AV užs. | Venipak ir LP atskiri blokai, SKU, kiekiai, „dalis siuntos (N)" mišriems |
| Perdavimas tiekėjui (VF, AMB) | #35417, #35419 | laiškas su lipduko PDF (102 KB) + manifesto PDF; archyvas; užsakymas → Paruošta; siunčiama tik man (nustatymas) |
| ZB rankinis kanalas | #35418 | Kopijuoti / Lipdukas / „Pažymėti ZB perduotais" → Paruošta |
| Išsiųsta | #35417, #35419, #35427 | completed; §18.3 sargas praleido mišrų su 2/2 registruotomis |
| Sekimo laiškas | #35427, #35419 | vienas laiškas, visi numeriai („Siunta 1 / Siunta 2 … gali būti pristatytos skirtingu metu") |
| Tiekimas kurjeriu | partija #10 | Venipak V…043 manifestas 004, lipdukas laiške, priėmimas → `_own_stock_qty`=1, užsakymas grįžo į Nauji |
| Darbuotojo rolė | `ps_darbuotojas` | mato visus darbalaukio langus, WC užsakymą per ⋯; laiškų nustatymų nekeičia |
| Laiškai | 17 užs. | „Naujas užsakymas" → uzsakymai@, „apmokėjimas gautas" → klientui; be dublikatų |

---

## 3. DEFEKTAI

### 🔴 K1 — Atšauktas užsakymas užrakintoje rytinėje partijoje užregistruojamas Venipak
**Įrodymas:** #35430 sukurtas → partija perskaičiuota (užrakinta) → atšauktas per darbalaukį → 3 žingsnis vis dar rodo „Savas sandėlis · registruota 0 iš 1" → „Registruoti" → **V07267E1000041 sukurtas atšauktam užsakymui**, `_ps_siuntos` įrašytas.
**Priežastis:** `vp_reg` filtras tikrina tik `turi_siunta()` ir paštomatą; statuso netikrina. `ryto_partija()` užrakinta 3 val. ir nepersitikrina.
**Pasekmė:** lipdukas dėžei, kurios nėra; Venipak sąskaita už neišsiųstą siuntą; manifeste svetimas įrašas.
**Taisymas:** (a) `vp_reg`/`vp_bulk` praleisti ne-`processing` (`'#N atšauktas'` pranešime); (b) rytinės eigos žingsniai 2–5 renderinami iš partijos ID sąrašo, bet **kiekvieną kartą perfiltruojant pagal esamą statusą**; (c) atšaukimas darbalaukyje išima ID iš aktyvios partijos.

### 🔴 K2 — Po Tiekimo priėmimo konsoliduota eilutė nepatenka į surinkimo lapą, o siuntų skaičius lieka senas
**Įrodymas:** #35421 (AV+QUA+PRI, planas QUA→AV). Partija #10 priimta → užsakymas Nauji, pastaba „paruoštas surinkimui iš AV". Surinkimo lapas: **tik Animonda 1 vnt**, Quattro eilutės nėra („Į lapus įtrauktos tik AV sandėlio prekės"). Eilutė tebeturi `_ps_source=quattro` (+`_ps_konsolidacija=1`), `vykdymas()` = „MIŠRUS 3 siuntos", `_ps_shipments`=3.
**Pasekmė:** pakuotojas Quattro maišo į dėžę **neįdeda** (jo lape nėra), nors klientas jį gaus tik iš AV. §18.3 sargas reikalaus 3 registruotų siuntų, kai fiziškai išeina 2 → „Išsiųsta" bus užblokuota (`issiusta_blokas`) — tikėtina, netestuota.
**Taisymas:** `Tiekimas::priimti()` sėkmingai gavus VISĄ kiekį → eilutės `_ps_source`='av', `_ps_source_reason`='parsivežta partija #N', `_ps_konsolidacija` palikti kaip istoriją; perskaičiuoti `_ps_shipments` ir `_ps_groups`. Alternatyva: lapai ir `saltiniai()` konsoliduotą eilutę traktuoja kaip AV.

### 🔴 K3 — Tiekimas „Venipak paštomatas (Nemenčinė)" neveikia
**Įrodymas:** partija #10 → „Užsakyti iš tiekėjo" su pristatymu `pastomatas` → Venipak atsakė **„Pickup/Locker not found"** (paštomato ID 3648 „Nemenčinės AIBĖ"). Partija liko „kaupiama", laiškas neišėjo (teisingas fail-safe). Su `kurjeris` — veikia.
**Pasekmė:** pirmasis (numatytasis?) pasirinkimas lange neveikia; darbuotojas mato raudoną klaidą ir nežino, ką daryti.
**Taisymas:** patikrinti Venipak pickup ID (galbūt reikia `code` „3…", ne vidinio ID; palyginti su `venipak_pickup_point_data` iš užsakymų — ten `id:2884, code:300906055`). Iki tol lange rodyti „kurjeris" pirmą.

### 🟠 V1 — Mišrūs užsakymai BE plano patenka į „Laiškai tiekėjams → Laukia išsiuntimo" ir „Sudėti visus į vieną laišką"
**Įrodymas:** puslapis rodo „Ambrosia 7 užsak." — tarp jų #35426, #35425, #35415, #35414, kurie Mišrūs eilėje **be sprendimo**. `laukiantys_perdavimo()` ima visus `processing` su `neperduotos()` ≠ ∅, plano netikrina.
**Pasekmė:** darbuotojas gali išsiųsti tiekėjui prekes, kurias savininkas norėjo parsivežti į AV; rail „Laiškai tiekėjams 2" (tiekėjai) ir lango „Laukia išsiuntimo (5)" (?) rodo skirtingus skaičius — neaišku, ką skaičiuoja.
**Taisymas:** `laukiantys_perdavimo()` praleisti `count(saltiniai)>1 && !_ps_misrus_sprendimas`, o su planu — tik „tiesiai" sandėlius; vienodas skaitliukas rail ir lange.

### 🟠 V2 — Mišraus užsakymo kiekviena dalis registruojama su VISO užsakymo svoriu
**Įrodymas:** #35419: VF dalis (2×35 g) registruota **2,07 kg**, AMB dalis (2 kg) — **2,07 kg**. Abi per perdavimo kortelės „Registruoti Venipak (perreg)".
**Pasekmė:** permoka Venipak už kiekvieną mišrų (žinoma plugino savybė, S1235 lentelė, bet dabar išmatuota).
**Taisymas:** `venipak_registruoti()` su `sandelis` → `packs[]` iš tos grupės eilučių svorio (grupių svoris jau skaičiuojamas rytinėje eigoje `grupes_svoris()`).

### 🟠 V3 — „Išsiųsta" neišsiunčia klientui nieko, sekimo laiškas — atskiras ir neprimenamas
**Įrodymas:** 3 užsakymai pažymėti „Išsiųsta" (WC laiškas: NESIŲSTAS pagal nutylėjimą), sekimo laiškas išsiųstas tik vienam, kai pats atsidariau „Sekimo laiškas". Pipeline juostoje tokio skaitliuko nėra.
**Pasekmė:** klientas apie išsiuntimą nesužino, jei darbuotojas pamiršo antrą mygtuką.
**Taisymas:** „Išsiųsta" dialoge varnelė „Išsiųsti sekimo laišką" (ON pagal nutylėjimą, tik kai visi numeriai yra), arba pipeline skaitliukas „Išsiųsta be sekimo laiško" su raudona spalva.

### 🟠 V4 — Mišrus po dviejų registracijų: darbalaukis ir WC lipdukai mato tik paskutinę
**Įrodymas:** #35419 `_ps_siuntos` turi VF V…039 ir AMB V…040 (teisinga), bet `venipak_shipping_order_data` = tik 040; sąraše „siunta 1 iš 2"; masinis „Venipak lipdukai" duotų tik AMB lipduką. VF lipdukas pasiekiamas tik laiške tiekėjui.
**Taisymas:** `siuntos_kodas()` skaityti iš `_ps_siuntos` pirmiau (visi numeriai), o WC lipdukų mygtuką mišriems rodyti kaip „per sandėlį".

### 🟡 S — smulkūs
- S1 Pastaba „siunta perregistruojama … (sena siunta — — nebenaudojama)" kai senos siuntos nebuvo (#35419 VF).
- S2 Rytinės eigos 4 žingsnio „Spausdinti LP lipdukus" atrodo kaip paprastas spausdinimas, o kviečia kurjerį — reikia `confirm()` su aiškiu tekstu (Venipak žingsnyje confirm'ų nėra ir nereikia, LP — būtinas).
- S3 „Perskaičiuoti iš naujo" — darbuotojas nežino, kada tai spausti (žr. K1). Siūlymas: automatiškai perskaičiuoti, jei partija sudaryta prieš >1 val. arba atsirado atšaukimų.
- S4 Klausimai → „tiekėjo, turinčio šią prekę, nėra" → tik Laukti/Atšaukti; „Laukti" nieko neprimena (sąmoninga), bet kortelė nepasako, KĄ žmogus turi padaryti (pvz. „užsakyk rankiniu būdu / parašyk klientui").
- S5 `lpsettings_api_password` DB grynu tekstu (LP plugino savybė) — mano recon JSON repo nuvalytas; analize/ failų su nustatymais nebedėti.
- S6 Dropship prekėms WC `_stock` ir „Liko nedidelis kiekis / Produkto neturime" laiškai eina Raimiui už tiekėjų likučius (#33904 ZB 1→0→−1) — triukšmas; ZB #33904 antrą kartą parduotas su likučiu 0 (programinis testas, kasa blokuotų — nepatikrinta).

---

## 4. NEPATIKRINTA (sąmoningai arba neįmanoma)

- **LP Express** visas kelias (lipdukas, `partCount`, statusai `wc-lp-*`) — draudimas kviesti kurjerį. T-0: **1 realus LP užsakymas su Raimio priežiūra** prieš pirmą darbo dieną.
- Paysera realus mokėjimas (T-0 sąraše jau yra).
- Klausimų sprendimai „Siųsti iš tiekėjo / Parsivežti į AV" (testinė prekė be tiekėjo).
- SLA sargas „Tiekėjas vėluoja 24 h" (cron, laiko klausimas).
- Belacor / Prins / Quattro perdavimas laišku — identiškas VF/AMB kodas, tik adresas.
- Grąžinimai / refund kelias (nėra darbalaukyje pagal §35.10 — rankinis).
- Naršyklės JS sluoksnis (dialogai, klaviatūra, auto-refresh) — testai ėjo HTTP lygiu; Playwright vizualinė patikra buvo H2xx sesijose.

---

## 5. DARBUOTOJO AKIMIS (be kodo)

Ką žmogus supras iš pirmo karto: kairė juosta, viena eilutė = vienas mygtukas, pipeline juosta, rytinė eiga su ✓, ribos „praėjo, keliaus rytoj", perdavimo kortelė su 1-2-3-4 žingsniais, Tiekimo „Kopijuoti sąrašą". Tekstai — darbo kalba, ne techninė.

Kur suklups:
1. **Atšaukė užsakymą po 8:00, o rytinė eiga jį vis tiek rodo** (K1) — nesupras, kodėl.
2. **Mišrus su „į AV"**: reikia 4 langų (Mišrūs → Tiekimas → priėmimas → Nauji), o lape prekės nėra (K2). Tai vienintelis kelias, kur žmogus turi „žinoti sistemą".
3. **Tiekimas paštomatu** — raudona klaida angliškai „Pickup/Locker not found" (K3).
4. **„Laukia išsiuntimo (5)" vs rail „2"** — skirtingi skaičiai tam pačiam dalykui (V1).
5. **Po „Išsiųsta" nieko nevyksta klientui** — žmogus tikėsis, kad sistema pranešė (V3).
6. **„Registruoti" / „Perregistruoti" / „Registruoti Venipak (1) → manifestas 002"** — trys pavadinimai tam pačiam mygtukui skirtinguose languose.
7. **LP mygtukas kviečia kurjerį be klausimo** (S2).

Ko trūksta, kad būtų „idealu" darbuotojui: vienas ekranas „Šiandien" su 3 skaičiais (surinkti / registruoti / perduoti) ir raudona zona „reikia tavęs" (klausimai + mišrūs be plano + išsiųsta be sekimo laiško). Pipeline juosta beveik tai daro — trūksta tik paskutinio skaitliuko ir spalvų.

---

## 6. REKOMENDUOJAMA EILĖ

1. K1 (statuso saugiklis vp_reg + partijos perfiltravimas) — 1 versija desk.
2. K2 (priėmimas → eilutė į AV, siuntų sk. perskaičiuoti) — tiekimas + desk.
3. V1 (mišrūs be plano ne į laiškus) — dropship.
4. K3 (Nemenčinės paštomato ID) — Raimio patikra Venipak savitarnoje + tiekimas konstanta.
5. V3 (sekimo laiškas iš „Išsiųsta" dialogo) — desk.
6. V2 (grupės svoris) — desk `venipak_registruoti`.
7. V4, S1–S4 — vienoje desk versijoje.
8. T-0: 1 realus LP užsakymas; #4 „20 realių užsakymų testas" (TŽ §29.5) — šis auditas = 17, sprendimai sutapo 17/17 su lauktais.

---

## 7. TESTINIAI DUOMENYS — VALYMAS

- Užsakymai **#35414–#35430** (17), klientas „AUDITAS Testas N", el. paštas terra@petshop.lt. Trynimo protokolas: `update_status('cancelled')` → `delete(true)`, `pre_wp_mail=false`, saugiklis pagal vardą „AUDITAS".
- `ps_shipments` 12 eilučių (35417–35430), `ps_tiekimas` partija #10 + eilutė 17 → trinti kartu (S1267 pamoka — kaskados nėra).
- Likučiai: #19708 Animonda AV 43→27 (+1 grąžinta), #35074 1→0, #16727 Quattro `_own_stock_qty`=1 — atstatyti trinant.
- `ps_laisku_archyvas` 4 nauji įrašai [PERSIŲSTI …] — palikti arba trinti.
- Options `ps_audit_ids` — trinti; `ps_audit_mail` ištrinta; TEMP snippet'ai 4510–4521 ištrinti, liko 4522 (deaktyvuotas) → trinti kitą run'ą.
- **Venipak savitarnoje (Raimis):** siuntos V07267E1000030–043, manifestai 07267260902001, 002, 003, 004, 006.
- Repo `analize/audit_*.json` (r, g, c, d, e, f, g2, h, i, z) — įrodymai; galima trinti po peržiūros.
