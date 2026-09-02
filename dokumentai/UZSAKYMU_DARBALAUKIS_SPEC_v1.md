# UŽSAKYMŲ DARBALAUKIS — SPECIFIKACIJA v1 (2026-09-03)

> Sujungia: auditą 2026-09-02 (17 testinių užsakymų, K1–K3 pataisyti), logikos registrą v1 (52 taisyklės iš desk/dropship/tiekimo/siuntų laiškų kodo ir TŽ §35), langų žemėlapį, maketus v1–v5 ir visus Raimio sprendimus 2026-09-02/03. Tiesos šaltiniai kodui: `dokumentai/UZSAKYMU_LOGIKOS_REGISTRAS_v1.md` (taisyklės), `AUDITAS_UZSAKYMAI_2026-09-02.md` (defektai), šis failas (sprendimai ir apimtis).
> Atsarginė kopija prieš pradedant: `ps-backups/SNAPSHOT-2026-09-02-pries-juosta.zip` (14,1 MB, md5 `a6a51695…`, 1 436 failai + 870 snippet'ų) ir git žymė `pries-juosta-2026-09-02`. Grįžimas — 5 min.

---

## 1. Sprendimai (Raimio, fiksuoti)

| # | Sprendimas | Data |
|---|---|---|
| R1 | Darbuotojas daro ir mato **viską** — nuo prekių gavimo iki užsakymų. Raimis operacijose nedalyvauja, jam nieko nesiunčiama; jam lieka analitika, finansai, klaidos. | 09-02 |
| R2 | **WooCommerce langų darbuotojui nėra niekur.** WC lieka varikliu (duomenys, PVM, mokėjimai) ir Raimio atsarginiu raktu retiems atvejams. | 09-02 |
| R3 | Viena viršutinė juosta visuose Petshop languose; kairėje namukas → svetainė kliento akimis (nauja kortelė). | 09-02 |
| R4 | Kiti langai (Prekės, Akcijos, Rinkiniai, Gavimas, Tiekimas) lieka kaip yra — tik juosta, vienas „Atgal", kryžminės nuorodos, žodynas. Prekėms +stulpelis „laukia N užsakymuose". | 09-02 |
| R5 | Mišrių taisyklės nėra — kelią renka patyręs darbuotojas; sistema siūlo ir rodo „paskutinį kartą šiam tiekėjui rinkaisi X". Dažniausiai ≤2 siuntos klientui. | 09-02 |
| R6 | **Trys keliai** kiekvienai prekei: *Avesa sandėlis · [Tiekėjas] → klientui · [Tiekėjas] → Avesa sandėlį*. Vardai visur pilni (Prins, Vetfarmas…), ne „tiekėjas". | 09-02 |
| R7 | Surinkimas nėra pirmas žingsnis: naujas užsakymas pirma **rūšiuojamas**; viskas, kas išeina iš Avesos — viena siunta, renkama tik kai visos jos prekės Avesoje. | 09-02 |
| R8 | Užsakymai krenta nuolat — **rytinės eigos užrakto nėra**; eiga = gyvas vedimas per eiles. | 09-02 |
| R9 | **Likutis seka kelią** (žr. §5). | 09-02 |
| R10 | Automatika pagal kriterijų „grįžtama / išorinis faktas / pinigai neišeina" (žr. §6). Laiško tiekėjui siuntimas, atšaukimas, LP lipdukas — tik žmogus. | 09-03 |
| R11 | Pristatymo pažado kasoje nėra (dropship be garantijų). ATP, rizikos balai — nedarom. | 09-03 |
| R12 | Prieš paleidimą papildomai: įvykių žurnalas · Venipak/LP sekimas · redagavimas skydelyje · sąskaitos · rūšiavimas · kasos patikra · vėlavimo laiškas · kliento takelis · dovanėlės kortelė · blogų statusų Klausimai. Po: grąžinimai, skenavimas, tylus spausdinimas, SLA ataskaita. | 09-03 |
| R13 | Naujas darbalaukis — **naujas failas** (`petshop-darbalaukis.php`), senas `petshop-desk.php` lieka snapshot'e; visa variklio logika (registras A–J) nekeičiama, kviečiama ta pati. | 09-02 |

---

## 2. Žodynas (vienas veiksmas = vienas žodis, visur ir pranešimuose)

| Žodis | Reiškia | Dabartinis atitikmuo kode |
|---|---|---|
| **Rūšiuoti / Surūšiuota** | kelias kiekvienai prekei įrašytas | `misrus` (planas), naujas požymis `_ps_rusiuota` |
| **Užsakyti iš [T]** | „→ Avesa sandėlį" eilutės į partiją ir/arba laiškas tiekėjui su partija | `kons` + Tiekimas `uzsakyti` |
| **Gauta** | partija priimta, prekės Avesoje | Tiekimas `priimti` (K2) |
| **Surinkti** | surinkimo lapas Avesos siuntai | `lapai` |
| **Lipdukas / Lipdukai** | Venipak registracija + PDF (Avesos siuntai / tiekėjo grupei) | `vp_reg` su `sandelis`, `pakuotes`, `perreg` |
| **Laiškas [T]** | vienas laiškas tiekėjui su visais jo užsakymais, lipdukais, manifestu (+ partija) | `perduoti` → dropship `siusti` |
| **Suvesti į ZB / Perduota** | ZB rankinis kanalas | dropship `zb_done` |
| **Išsiųsta** | Avesos siunta pas kurjerį → completed + sekimo laiškas klientui | `issiusta` + siuntų laiškas |
| **[T] išsiuntė** | tiekėjo siunta pas kurjerį (auto iš Venipak arba rankiniu) | `issiusta` |
| **Laukti / Atšaukti / Pažymėti apmokėtu** | kaip dabar | `klaus laukti`, `atsaukti`, `apmoketa` |
| **Redaguoti** | adresas/paštomatas, kiekis, išimti/pridėti, dalinis atšaukimas | nauja (WC metodai) |
| **Sąskaita** | PDF peržiūra/spausdinimas/siuntimas klientui, kreditinė | `_petshop_order_pdf` + nauja |

Dingsta: Perduoti, Patvirtinti planą, Paleisti, Registruoti/Perregistruoti, Konsoliduoti, Spręsti, Mišrus (kaip eilė), WooCommerce sąrašas.

---

## 3. Eilės ir sąrašas

**Eilės** (pavadinimas = veiksmas; užsakymas rodomas **visose** eilėse, kur jam reikia veiksmo — registras C3):
Nauji (rūšiuoti) · Laukiam iš tiekėjų · Surinkti Avesoje · Laiškai tiekėjams · Paruošta siųsti · Klausimai · Neapmokėti · Visi užsakymai (filtrai: kelyje, įvykdyti, atšaukti, išsiųsta šiandien).

**Rikiavimas** (Raimis 09-03): numatyta „kas pirma degs" — pagal artimiausią sandėlio ribą (AV 11:00 · VF/LP 13:00 · ZB/PRI/BEL/QUA 09:00 · AMB 10:00), toliau pagal apmokėjimo laiką; pasirenkama: laikas, suma, tiekėjas, klientas.

**Eilutė**: nr + laikas · klientas · prekės su kelio ženklu (spalva = kelias) · pristatymas · suma · **takelis** (`✓ surūšiuota › ✓ užsakyta Quattro › laukiam Quattro › surinkti › lipdukas › išsiųsta › [lipdukas Prins] › laiškas Prins › Prins išsiuntė`; žalia — padaryta, juoda — dabar, gintarinė — laukiam) · vienas pagrindinis mygtukas = kitas žingsnis. Kliento pastaba pilna. Auto-atnaujinimas 60 s. Klaviatūra j/k/Enter/x/`/`/Esc.

**Filtrai** (dvi ašys, nemaišomos): Vykdymas (Avesa / tiekėjas / pagal tiekėją) · Pristatymas (Venipak kurjeris / paštomatas / LP) · Data. Paieška juostoje: nr, klientas, el. paštas, telefonas, adresas, prekė, SKU.

---

## 4. Skydelis (atsidaro iš bet kurio lango)

1. Antraštė: nr, klientas, suma, apmokėjimas, pristatymas, kliento pastaba.
2. **Prekės su keliais** — kiekvienai trys mygtukai (negalimi pilki: be tiekėjo → tik Avesa; LP → tik Avesa), po jais „kodėl" (`_ps_source_reason`: „Avesoje 24 vnt." / „Avesoje 0, Prins turi" / „tiekėjo nėra"), žingsnių juostelė. Kelias keičiamas iki pirmo žingsnio; vėliau — „siunta registruota — perregistruoti?".
3. Avesos siunta: dėžių skaičius, „Perregistruoti", siuntų numeriai iš `_ps_siuntos` (visi, ne tik paskutinis).
4. Mygtukai apačioje: pagrindinis (kitas žingsnis) · Redaguoti · Sąskaita · Parašyti klientui · Atšaukti (raudonas, tylus).
5. **Redaguoti**: adresas, telefonas, paštomatas (Venipak sąrašas kaip kasoje) · kiekis · išimti prekę · pridėti prekę (paieška) · dalinis atšaukimas eilutės. Suma/PVM per WC metodus; skirtumas — pastaba „grąžinti X € rankomis" / nuoroda apmokėti. Leidžiama iki Avesos lipduko; po jo — tik su perregistravimu.
6. Žurnalas: visi veiksmai su vartotoju ir laiku, likučių judesiai, automatikos įrašai („auto: surūšiuota — Avesoje 24 vnt.").

---

## 5. Likučiai — „likutis seka kelią"

| Iš → į | AV likutis | Žymė |
|---|---|---|
| apmokėta, eilutė Avesa | −q (kaip dabar `mazinti`) | `_ps_av_reduced_qty` eilutėje |
| Avesa → [T] → klientui | +q | eilutės žymė nuimama |
| Avesa → [T] → Avesą | +q dabar; Gauta: +q (increase) ir −q (rezervas, K2) | |
| [T] → Avesa | −q; jei Avesoje < q — neleidžia: „Avesoje tik N" | |
| [T] → kitas [T] | nieko | |
| Atšaukimas / dalinis | +q pagal faktiškai nurašytą (kaip dabar `grazinti`, tik eilutės lygiu) | |

Dabartinė skylė (auditas): AV → tiekėjas per Klausimą likučio negrąžina — taisoma šia taisykle. Dropship prekių WC `_stock` — tiekėjo veidrodis, neliečiamas; low-stock laiškai ne-AV prekėms išjungiami.

---

## 6. Automatika (lygiai)

| # | Kas | Lygis | Pagrindas |
|---|---|---|---|
| 1 | Rūšiavimas, kai sistema tikra (gryna Avesa su likučiu, grynas vieno tiekėjo dropship) — ženklas „auto", keičiama iki lipduko | **auto** | grįžtama; H239 „dingdavo" priežastį sprendžia takelis + žurnalas |
| 2 | Venipak sekimas (`ws/tracking?code=`, patikrinta 09-02: „At sender"): statusas ≠ At sender/Shipment created → **Išsiųsta** / **[T] išsiuntė**, sekimo laiškas klientui; Delivered → „pristatyta" Visuose; blogi statusai → Klausimas „siunta grįžta — susisiek" | **auto** | išorinis faktas; cron kas 30 min po vieną numerį; nežinomas statusas — rodyti, neliesti |
| 3 | Partijos siunta Delivered → Tiekime siūlymas „atvyko — priimti" | auto siūlymas | |
| 4 | Sekimo laiškas klientui — kartu su 2 (varnelė ON „Išsiųsta" dialoge, kai visi numeriai) | auto | |
| 5 | Klausimų aptikimas (trūksta, mokėjimas, siunta, atsisakymas, SLA 24 h, blogi statusai) | auto (yra) | |
| 6 | Avesos lipdukas kartu su surinkimo lapu | su pranešimu + atšaukti | **Raimis klausia Venipak: ar neatsiimta registruota siunta kainuoja** |
| 7 | Laiško tiekėjui paruošimas iki „Siųsti" (lipdukai, tekstas, peržiūra) | auto paruošimas | |
| 8 | Vėlavimo laiškas klientui: apmokėta, per N d.d. (N = 3, tvirtina Raimis) nėra „išsiųsta" → laiškas (tekstą tvirtina Raimis vieną kartą) + Klausimas darbuotojui | **auto** | |
| 9 | Laiško tiekėjui **siuntimas** | tik žmogus | pinigai |
| 10 | Atšaukimas, grąžinimai, kelio keitimas neaiškiems, LP lipdukas | tik žmogus | negrįžtama / kviečia kurjerį |

Įvykių žurnalas (ps_ivykiai: užsakymas, eilutė, veiksmas, kas, kada, prieš/po, siūlyta/priimta/atmesta) — pagrindas 2, 8, SLA ataskaitai ir būsimam AI (siūlymai į esamą „Siūlymai" lizdą, žmogus tvirtina).

---

## 7. Langai

**Juosta** (R3): Užsakymai [n] · Rytinė eiga · Prekės [reikia užsakyti] · Gavimas · Tiekimas [kaupiama/laukiam] · Rinkiniai · Akcijos · Laiškai [laukia] · paieška · vartotojas. Kelias po juosta atsimena, iš kur atėjai.

**Laiškai tiekėjams**: kortelė per tiekėją (riba antraštėje: „ZB 09:00 · liko 40 min"): užsakymai su prekėmis (tik „→ klientui" kelio eilutės — registras A10), „✓ lipdukas / be lipduko"; blokas „Į Avesą — partija #n" su varnele (G4); žingsniai **1 Lipdukai (n) → 2 Laiškas [T] — n užs. viename**; „Peržiūrėti laišką" (prierašas, varnelės tiekėjui/kopija man); „Siųsti be lipdukų" — tyliai su patvirtinimu; ZB: 1 Lipdukai · 2 Suvesti (Kopijuoti) · 3 Perduota. Po siuntimo — tiesa (išsiųsta/nepavyko).

**Laukiam iš tiekėjų**: užsakymai, kurių Avesos siunta laukia „→ Avesą" eilučių; būsena „neužsakyta" (mygtukas Užsakyti iš [T]) / „užsakyta 10:12 kurjeriu, V…043" / „atvyko — priimti".

**Surinkti Avesoje**: tik užsakymai, kurių visos Avesos prekės vietoje; „Surinkti" → lapas (Venipak/LP atskirai, SKU, EAN barkodai, dovanėlės kortelė su augintinio vardu, „dalis siuntos (2)" mišriems) → „Lipdukas" (dėžių sk., paštomatas n siuntų) → Paruošta.

**Paruošta siųsti**: „Avesa — supakuota, laukia kurjerio" (vienas „Kurjeris paėmė viską", manifestas PDF; auto iš sekimo) · „[T] — laiškas išsiųstas, laukiam" (auto iš sekimo arba rankiniu). §18.3 sargas žmogaus kalba: „dar neregistruota: Vetfarmas".

**Klausimai**: kortelės su priežastimi ir aiškiais veiksmais: trūksta sandėlyje (Avesoje N, tiekėjas turi/neturi → keisti kelią / Laukti / Atšaukti / Parašyti klientui) · mokėjimas nepavyko · siuntos sukurti nepavyko (Venipak klaida lietuviškai, „Pakeisti paštomatą") · atsisako sutarties · tiekėjas vėluoja 24 h · siunta grįžta / nepristatyta · vėluoja klientui (auto laiškas išsiųstas).

**Neapmokėti**: pending/on-hold/failed, „Pažymėti apmokėtu" (dialogas: laiškas klientui varnelė), nieko daugiau.

**Rytinė eiga** (be užrakto, gyvi skaičiai, tvarka pagal ribas): 1 Surūšiuoti naujus · 2 Lipdukai ir laiškai tiekėjams (ZB/PRI/BEL/QUA 09:00, AMB 10:00) · 3 Užsakyti iš tiekėjų į Avesą · 4 Surinkti Avesoje (lapai) · 5 Lipdukai Avesai (Venipak 11:00 / LP 13:00 su confirm) · 6 Išsiųsta · 7 Gavimai · 8 Klausimai. Prie žingsnio — kiek ir kurie; tuščias ✓; grįžti bet kada.

**Visi**: viskas su eilės ženklu, takeliu, filtrais; kelyje/įvykdyti/atšaukti/pristatyta; sąskaita, sekimo laiškas, pakartotinis užsakymas (patikrinti T-0).

**Klientui**: užsakymo puslapis su takeliu kliento kalba (surinkta · išsiųsta · pas kurjerį · pristatyta, numeriai) paskyroje + nuoroda laiške; vėlavimo laiškas (6.8).

---

## 8. Kas išlieka nepaliesta (variklis)

Šaltinių priskyrimas · AV nurašymas/grąžinimas (plėčiamas eilutės lygiu) · Venipak registracija pagal sandėlį, manifestai 001–007, packs[]/paštomatas n siuntų, dublio/paštomato/statuso sargai (K1) · lipdukai `pack_no[]`, manifestas `print_list` · dropship laiškas, archyvas, varnelės, ZB kanalas, siuntos vartai · Tiekimo partijos, registracija, priėmimas (K2, K3) · `_ps_siuntos` registras, §18.3 sargas, sekimo laiškas · Klausimų logika · ribos · faktų lentelės, GA4 · LP Express (tik iš AV, partCount, netestuojama iki T-0).

---

## 9. Auditas — kas taisyta ir kas liko

Pataisyta 09-02: **K1** atšaukti užsakymai nebepatenka į registraciją/partiją; **K2** parsivežta eilutė tampa Avesa (lapas, siuntų sk., rezervas); **K3** Nemenčinės paštomatas (code 300906055, XML tvarka). Lieka į v6/kodą: **V1** mišrūs be plano ne į laiškus (A10); **V2** grupės svoris registruojant mišraus dalį; **V3** sekimo laiškas iš „Išsiųsta"; **V4** visi numeriai iš `_ps_siuntos`; S1–S6 (žodynas, LP confirm, perskaičiavimo mygtukas dingsta su R8, Klausimų tekstai, slaptažodis ne į analize, low-stock laiškai).

---

## 10. Vykdymo etapai (kiekvienas testuojamas darbuotojo paskyra `testuotojas`, kaip audite)

0. Maketas v6 → Raimio peržiūra.
1. `petshop-ivykiai.php` — įvykių žurnalas (visi esami veiksmai rašo). `petshop-juosta.php` — juosta + „Atgal" visuose languose.
2. `petshop-darbalaukis.php` — sąrašas, eilės, takelis, skydelis su keliais ir likučių taisykle, rūšiavimas, Neapmokėti, Klausimai, Visi. Senas desk išjungiamas, ne trinamas.
3. Laiškai (kortelės per tiekėją ant esamo dropship), Laukiam, Surinkti, Paruošta, rytinė eiga be užrakto.
4. Venipak/LP sekimas (`petshop-sekimas.php`): cron, auto Išsiųsta, klientui laiškas, blogi statusai → Klausimai, partija atvyko.
5. Skydelio Redaguoti, Sąskaitos, vėlavimo laiškas, kliento takelis, kasos patikra, dovanėlės kortelė, EAN lape.
6. Pilnas E2E auditas kaip 09-02 (17+ užsakymų, visi keliai, LP 1 realus su Raimiu) → T-0 sąrašas.
Po paleidimo: grąžinimai, skenavimas, tylus spausdinimas, SLA ataskaita, AI siūlymai į lizdą.

---

## 11. Atviri klausimai Raimiui

1. Venipak: ar neatsiimta registruota siunta kainuoja (lemia 6.6).
2. Vėlavimo laiško terminas N d.d. ir tekstas.
3. Skirtumo apmokėjimas redaguojant (didėja suma): nuoroda apmokėti ar „sumokės kurjeriui"?
4. Dovanėlės kortelės tekstas ir kada dedama (visiems / tik su augintinio vardu / tik virš X €).
5. LP Express — 1 realus testas prieš pirmą darbo dieną (kas atveža siuntą kurjeriui).
