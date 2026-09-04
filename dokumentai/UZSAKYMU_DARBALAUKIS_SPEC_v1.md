# UŽSAKYMŲ DARBALAUKIS — SPECIFIKACIJA v1.5 (2026-09-04 naktis, po 5 etapo #1–#3 ir #4 recon — Raimio sprendimai iš S1607 + S1611 + S1614 + S1615; §12.4 keičia §6c/§12.3, §12.5 — grįžusi siunta, pinigai, kreditinė, sąskaitos)

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

## 6a. Automatika — kaip veiks kasdien (išrašyta)

**Venipak sekimas** (`petshop-sekimas.php`). Cron kas 30 min ima visus atvirus užsakymus su `_ps_siuntos` numeriais ir partijų `venipak_pack`, kiekvienam numeriui kviečia `ws/tracking?code=` (patikrinta 09-02: atsakymas CSV su Status). Rezultatą rašo į `ps_siuntu_busenos` (numeris, statusas, laikas) ir į įvykių žurnalą.
- **At sender / Shipment created** — nieko.
- **Paimta** (bet koks kitas ne-galutinis statusas): Avesos siunta → užsakymo dalis „Išsiųsta"; tiekėjo siunta → „[T] išsiuntė". Kai visos dalys paimtos → `completed` + **vienas sekimo laiškas klientui** su visais numeriais (esamas `Petshop_Siuntos`). Žurnale „auto: Venipak Picked up".
- **Delivered**: Visuose „pristatyta"; partijai — Tiekime siūlymas „atvyko — priimti"; po 3 d. → Sender.net „kaip patiko" (esamas šablonas).
- **Blogi** (nepristatyta, grįžta siuntėjui, nepaimta iš paštomato): → Klausimas „siunta grįžta — susisiek" su kliento telefonu; veiksmai: skambinti · persiųsti iš naujo (naujas lipdukas) · atšaukti ir grąžinti pinigus.
- **Nežinomas statusas**: rodomas tekstu, užsakymas neliečiamas, įrašas žurnale — žodyną pildom po T-0.
- LP Express: statusai iš plugino `wc-lp-*` tuo pačiu mechanizmu.
- Rankinis „Kurjeris paėmė" / „[T] išsiuntė" lieka — jei sekimas vėluoja.

**Vėlavimo sargas.** Apmokėtas, surūšiuotas, per N darbo dienų (N ir tekstas — Raimio, siūlau 3) nė viena dalis neišsiųsta → klientui automatinis laiškas „atsiprašome, siunta vėluoja" (Sender.net šablonas), užsakymas į Klausimus „vėluoja klientui" su veiksmais „Atidaryti" / „Išspręsta". Vieną kartą per užsakymą.

**Auto rūšiavimas.** Apmokėjus, jei visos eilutės turi pasiūlymą ir visos vienu keliu (gryna Avesa su likučiu arba vienas tiekėjas) → `_ps_rusiuota=auto`, žurnale priežastys, eilutėje „surūšiuota auto"; keičiama iki pirmo lipduko. Kitaip — „Nauji — rūšiuoti".

**Dovanėlės kortelė.** Surinkimo lape prie užsakymo — kortelė spausdinimui: „{Augintinio vardas} nuo petshop.lt — skanaus!" iš M8 profilio (`ps_pets` pagal klientą), be vardo — „Jūsų augintiniui". Taisyklė, kam dedama (visiems / virš X € / tik su vardu) — Raimio (§11.4). Lape — EAN barkodai kiekvienai prekei (skenavimui po paleidimo) ir langelis ✓.

**Kliento takelis.** Paskyroje ir laiške (nuoroda be prisijungimo, kaip sekimo laiške): Užsakymas gautas · Apmokėta · Ruošiama · Išsiųsta · Pas kurjerį · Pristatyta; kiekviena siunta su numeriu ir „sekti"; mišriam — „gali būti pristatytos skirtingu metu"; apačioje „Užsakyti dar kartą" (patikrinti esamą) ir „Grąžinti prekę" (6b).

## 6b. Grąžinimai (po paleidimo, bet numatyta struktūroje)

1. Klientas paskyroje (arba per nuorodą laiške) pažymi prekes ir priežastį: **apsigalvojo** (14 d., CK 6.228¹⁰) arba **brokas / ne ta prekė**.
2. Sistema registruoja Venipak siuntą **mūsų sutartimi** (kaip Tiekime, gavėjas — Avesa arba Nemenčinės paštomatas) ir duoda klientui lipduką.
3. Kaina: apsigalvojo — lipduko kaina **atskaitoma iš grąžinamos sumos** (taisyklėse parašyta; grąžinam prekės kainą + pradinį standartinį pristatymą); brokas — mūsų sąskaita, grąžinam viską.
4. Darbalaukyje eilė/kortelė „Grąžinimai": laukiam siuntos (sekimas) → gauta → prekė į Avesą (+q) arba nurašyti (brokas) → kreditinė (esamas AVPN/IAPV variklis) → „pinigai grąžinti rankomis (Paysera)" pažymi darbuotojas.
5. Dropship prekės grįžta į Avesą, ne tiekėjui — likutis Avesoje, parduodama iš naujo.

## 6c. Redagavimas be WooCommerce — taisyklės

> **Įgyvendinta S1614 (v3.16–v3.18); 1 ir 5 punktus keičia §12.4 (Raimis 09-04 vakaras): po bet kurio užregistruoto lipduko redaguoti negalima (rankiniu būdu), laiško klientui po adreso keitimo nėra.** Kiekis / išimti prekę / pridėti / dalinis atšaukimas kitais atvejais — 5 etapas #4 (dar nedaryta).

- Adresas, telefonas, paštomatas — bet kada iki Avesos lipduko / tiekėjo laiško; po jų — su perregistravimu (senas nr. lieka pastaboje, kaip H258).
- Kiekis, išimti prekę, dalinis atšaukimas — iki lipduko; likutis pagal kelią (§5); suma/PVM per WC (`wc_update_order`, `calculate_totals`), sąskaita perrašoma (kreditinė senai, nauja).
- Pridėti prekę — paieška pagal pavadinimą/SKU, šaltinis priskiriamas kaip apmokant (A2); suma didėja → nuoroda apmokėti skirtumą arba pastaba „sumokės kurjeriui" (§11.3).
- Suma mažėja → pastaba „grąžinti X € rankomis (Paysera)" ir Klausimas, kol nepažymėta.
- Viskas rašoma į žurnalą su prieš/po; klientui laiškas apie pakeitimą — varnelė (numatyta ON adresui/paštomatui).

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

---

## 12. Raimio sprendimai S1607 (2026-09-03, 2 etapas — GALIOJA, keičia ankstesnius punktus)

**Žodynas** (pilnai — `ZODYNAS_DARBUOTOJUI_v1.md` v1.1): sandėliai trumpai AV · VF · ZB · Prins · Belacor · Quattro · Ambrosia. Eilės: **Gauti · Neišrūšiuoti · Laukiam iš tiekėjų · Surinkti AV · Dropshipping · Paruošta siųsti · Klausimai · Neapmokėti · Visi**. Keliai prie prekės: „Iš AV · VF siunčia klientui · VF veža į AV“. Mygtukai: Rūšiuoti / Surūšiuota / **Auto** · Lipdukai (n) · **Užsakyti iš VF (n užs.)** (laiškas — tik „Peržiūrėti laišką“) · Užsakyti be lipdukų · **Užsakyti iš Prins į AV** · Suvesti į ZB / Suvesta · Surinkti / Surinkti visus · Lipdukas · Kurjeris paėmė (viską) · [T] išsiuntė · Kurjerio sąrašas · Sekimo numeriai klientui · Lipdukas iš naujo · Istorija (skydelyje). Sistemos žodžių (registruoti, perduoti, manifestas, AV source, WooCommerce) darbuotojas nemato. „Dropshipping“ — Raimio pasirinkimas (sistemos žodis, bet aiškus: iš tiekėjo tiesiai klientui).

**Gauti** = užsakymai, kurių darbuotojas dar neatidarė (skydelio), nesvarbu, kelių dienų — kalendorinė „šiandien“ logika atmesta (savaitgaliai, šventės). Eilutėje paryškintas nr + „N“; atidarius — dingsta (`_ps_matyta`). Vien „Auto“ iš sąrašo žymės neįrašo. Laikas sąraše — amžius („prieš 40 min / vakar 17:41 / prieš 3 d.“). Gauti nieko daryti nereikia — užsakymas darbo eilėje yra nuo pirmos sekundės.

**Rūšiavimo taisyklė** (keičia 6a „auto rūšiavimas“): sistema išrūšiuoja pati **tik vieno sandėlio** užsakymus (viskas iš AV arba viskas iš vieno tiekėjo). **2 ir daugiau sandėlių** (su AV ar be) → Neišrūšiuoti su pasiūlymu; eilutėje **„Auto“** = surūšiuoti kaip siūlo, neatidarant; „Auto“ nerodomas, kai yra kliento pastaba arba trūkumas („atidaryk“). Pasiūlymas „veža į AV“, kai to tiekėjo užsakymas į AV jau atviras (kaupiama/užsakyta) — prekė atvažiuos ir taip. **Jokių svorio/sumos ribų** (Raimis). Tiekėjų atvežimo dienos — vėliau, jei Raimis pateiks.

**Trijų ir daugiau sandėlių „viską į AV“**: AV siunta renkama tik kai visos jos prekės vietoje — užsakymas sėdi „Laukiam iš tiekėjų“, kol priimtas **paskutinis** tiekėjas; tik tada sistema pati perkelia į „Surinkti AV“ (patikrinta su vienu tiekėju — T1; su dviem — testuoti 3 etape).

**Ekranas**: kuo mažiau sluoksnių — juostos kelias paslėptas, be legendos/datos/filtrų (už „Filtrai ▾“)/paaiškinimų/takelio sąraše; eilutė = 3 stulpeliai (Užsakymas · Prekės pagal kelią su miniatiūromis · Toliau). Kliento pastaba — geltona dėžė „Klientas: …“ (kad nepamirštų). **Spalvos tik „Visi“** — visa eilutė pagal būseną (Neapmokėtas · Neišrūšiuotas · Ruošiamas · Paruoštas · Išsiųsta dalis · Išsiųstas · Įvykdytas · Atšauktas · Klausimas); darbo eilėse — jokių spalvų, tik žalias mygtukas / raudona (klausimas, vėluoja) / gintarinė (laukiam).

**Dropshipping kortelė**: kiekvienam užsakymui savas „Lipdukas“ su dėžių skaičiumi (dialogas); „+ į AV“ — tik kai atviras tiekėjo užsakymas į AV Tiekime, kitaip nuoroda „sudėk prekes Tiekime“.

**Sekimo laiškai klientui (keičia 6a „vienas laiškas kai visos“)** — Raimio sprendimas 2026-09-03 vakaras:
1. **Laiškas po kiekvienos siuntos**, ne vienas kai visos: „Išsiųsta 1 iš 2 siuntų: V… (VF). Antroji keliaus atskirai.“ → „Išsiųsta 2 iš 2: V… (ZB).“ Kaip Amazon / Chewy. Vienos siuntos užsakymui — vienas laiškas.
2. **Automatinis** (4 etapas): Venipak sekimas kas 30 min; „Picked up“ → dalis pažymima išsiųsta ir laiškas išeina pats, be darbuotojo; „[T] išsiuntė“ mygtukas lieka atsarginis. „Delivered“ → pristatyta; po 3 d. „kaip patiko“ (Sender). Blogos būsenos → Klausimas.
3. **Sekimo juostelė laiške** (Užsakymas gautas · Apmokėta · Ruošiama · Išsiųsta · Pas kurjerį · Pristatyta) su dabartiniu žingsniu ir nuoroda „Sekti siuntą“; pilna eilutė su kiekviena siunta — kliento užsakymo puslapyje be prisijungimo („Kaip mato klientas“, 5 etapas).
4. **Kasoje ir patvirtinimo laiške** (5–6 etapas, ne prieš paleidimą liesti kasą): vienas pilkas sakinys „Prekės iš skirtingų sandėlių gali atvykti atskiromis siuntomis — apie kiekvieną pranešime atskirai“, rodomas tik kai krepšelyje ne vien AV prekės. Be siuntų skaičiaus, be datų (pristatymo pažado nedarom).

**5 etapas (iki paleidimo)** papildomas: „Naujas užsakymas“ darbalaukyje (telefoninis: klientas, prekės, pristatymas / atsiėmimas, apmokėjimas atsiimant ar pavedimu) ir pristatymo būdas „Atsiėmimas AV“ (`local_pickup`) su taisykle: atsiėmimas → visos prekės į AV, lipduko žingsnio nėra, vietoj „Kurjeris paėmė“ — „Klientas atsiėmė“. Iki tol telefoninį užsakymą kuria Raimis WooCommerce.

**Paskyros**: `testuotojas` — tik testinė; paleidimui — tikra darbuotojo paskyra su tikru vardu (rolė `ps_darbuotojas`).

## 12.3. Raimio sprendimai S1611 (2026-09-04) — 4 etapas (GALIOJA; įgyvendinta S1612/S1613, darbalaukis v3.11–v3.14.1)

**3. Vėlavimo laiškas — AUTOMATINIS** (v3.13, S1613). Cron `ps_velavimo_laiskai` — kiekvieną darbo dieną **14:00** Vilnius (ne ryte — tiekėjai ir Venipak išsiunčia iki pietų; vienkartinis WP cron įvykis, kas run'ą perplanuojamas į kitą 14:00, DST-saugus). Ne darbo dieną (Sa/Se, LT šventės: 01-01, 02-16, 03-11, 05-01, 06-24, 07-06, 08-15, 11-01, 11-02, 12-24/25/26 + Velykų pirmadienis) — nieko. Sąlyga: apmokėtas, tarp apmokėjimo dienos ir šiandienos **≥3 pilnos darbo dienos** (abi kraštinės neskaičiuojamos: apmokėta Pr → laiškas Pn 14:00), bent viena dalis neišsiųsta. Praleidžiam: neapmokėtus, atšauktus, uždarytus, **Klausimuose** (ir „[T] vėluoja“ — žr. V13), jau gavusius (žymė `_ps_velavimo_laiskas`). Vienas laiškas užsakymui; kortelėje/skydelyje „klientui pranešta apie vėlavimą (data)“; į Klausimus nekeliam. Tekstas (Raimio): „Sveiki, [vardas]. Jūsų užsakymo Nr. N surinkimas truputį užtruko. Išsiųsime jį kaip galėdami greičiau. Ačiū už kantrybę. Išsiuntę užsakymą informuosime Jus atskiru laišku. Jei turite klausimų, tiesiog atsakykite į šį laišką.“; dalis išsiųsta — „Likusių Jūsų užsakymo Nr. N prekių surinkimas truputį užtruko.“ Tema (Raimis 09-04): **„Jūsų užsakymą Nr. N dar komplektuojame“**; antraštė laiške — tas pats sakinys.

**4. Tiekėjų atvežimo dienos — NEREIKIA** („neužsikraunam, kai bus srautai“). Kortelė lieka „laukiam iš X“.

**5. Siunta grįžta** (Venipak „grąžinama siuntėjui“) → Klausimas **„Siunta grįžta“**, be sumų (v3.11.1). Du mygtukai, sprendžia darbuotojas: **„Siųsti iš naujo“** — prekės jau AV → siunta ruošiama IŠ AV (ir buvusi tiekėjo dropship): Surinkti AV, naujas lipdukas, klientui vėl „Išsiųsta“; seni numeriai į `_ps_siuntos_senos`; likutis dropship eilutėms +q −q = 0, AV eilutėms nieko; adresas — tas pats (keitimas — 5 etapo „Redaguoti“). **„Atšaukti — prekės grįžo į AV“** — atšaukiama, siuntos prekės į AV likutį (AV eilutėms — variklis, dropship +q į `_own_stock_qty`). Pinigai — rankomis. Dalinis (viena iš dviejų) — 5 etapas.

**6. Dovanėlės kortelė** — vėlesni etapai. **7. Kasos sakinys** „prekės gali atvykti atskiromis siuntomis“ — **nedarom**; jei reikės — paskyroje prie „Siuntos“ (keičia §12 „Sekimo laiškai“ 4 p.). **8. Pašto reputacija** — patikrinta (log S1611): WC laiškai per WP Mail SMTP → `isopas.serveriai.lt` 79.98.29.24 (švarus), From `terra@petshop.lt`; T-0: mail-tester per WC SMTP, po mėnesio DMARC → `quarantine`. **9.** LP plugino slaptažodis — T-0 rotacija.

**Sekimas automatinis** (§12 „Sekimo laiškai“ 2 p. — įgyvendinta): **Venipak** (v3.11, S1612) — cron `ps_venipak_sekimas` kas 30 min, tik 60 d. senumo užsakymai, ≤200/run; kodai 1/2/3/6/9 = „paėmė“ → dalis išsiųsta + laiškas klientui pats (`kas=Venipak`); 9 → „Pristatyta“ paskyroje (laiško nėra); tekstas „return / to sender“ → Klausimas „Siunta grįžta“; nežinomas kodas → tik įrašas. **LP Express** (v3.12, S1613) — tas pats cron, tik plugino meta (`_woo_lithuaniapost_shipping_status_value`; pluginas su „Never“ užsakymo statuso nekeičia): `lp-on-the-way` / `lp-delivered` → „Kurjeris paėmė“ + laiškas (`kas=LP Express`); `lp-delivered` → „Pristatyta“. „Grįžta“ LP būsenos nėra. Skydelyje prie numerio „— Venipak: terminale, Kaunas, 09-03 17:03“ / „— LP Express: keliauja gavėjui, 09-04 13:10“. Paskyros blokas „Siuntos“ (`petshop-kliento-siuntos.php` v1.2): Ruošiama / Išsiųsta / Pristatyta.

**V13 — „[T] vėluoja“ pagal dalis** (Raimis 09-04 sutiko; v3.14, darbalaukio lygiu, variklio `petshop-dropship-sargas.php` ir `_ps_sla_velavimas` neliesti): vėluoja = tiekėjo „tiesiai“ dalis, užsakyta prieš >24 val. (`_ps_dropship_sent_src[t]`) ir dar neišsiųsta → Klausimas „[T] vėluoja — užsakyta prieš N val., siunta neišėjo. Paskambink [T].“, užsakymas **kartu** lieka Paruošta siųsti su „[T] išsiuntė“; kortelėje be „Laukti“ — dingsta pats, kai dalis pažymima išsiųsta (darbuotojas ar sekimas). Tiekėjas išsiuntė, laukia AV → Klausimo nėra (Surinkti AV); tiekėjas dar neužsakytas → Klausimo nėra.

**S1612/S1613 prielaidos (Raimiui patvirtinti / vetuoti):** 1) sekimas kas 30 min, 60 d., ≤200/run; 2) „grįžta“ pagal tekstą, kol Venipak kodo nėra; 3) AV kelių dėžių siunta — „paėmė“, kai bent viena dėžė nuskenuota; 4) dalinis (tiekėjo dalis grįžta, kai AV išsiųsta; „Atšaukti“, kai kita dalis išsiųsta) — 5 etapas, kol kas neleidžiama; 5) „Siųsti iš naujo“ tiekėjo eilutei rašo `_ps_av_reduced_qty=q`; 6–7) atsiimta — tekstas ir tema Raimio; 8) užsakymas su „[T] vėluoja“ (Klausimuose) vėlavimo laiško **negauna** — Raimio taisyklė „praleidžiam Klausimuose“; jei klientui pranešti reikia ir tada — pasakyti.

**Radiniai (variklis / pluginai, neliesta):** V14 — variklio `Petshop_Desk::klausimas()` „Siuntos sukurti nepavyko“ žiūri į užsakymo statusą `lp-parcel-failed`, kurio LP pluginas neskiria (rašo tik meta) → LP klaida Klausimu netampa. LP plugino `woocommerce_order_status_changed`: apmokėtam užsakymui be `_woo_lithuaniapost_shipping_item_id` bando kurti siuntą realiu LP API kiekvieną kartą keičiantis statusui.

## 12.4. Raimio sprendimai S1614 (2026-09-04 vakaras) — 5 etapas #1–#3 (GALIOJA; įgyvendinta S1614, darbalaukis v3.15–v3.18, kosmetika v3.18.1 S1615)

**#1 „Pranešti klientui apie vėlavimą“ — rankinis mygtukas** (Raimio idėja 09-04, v3.15). Skydelyje ir Klausimo kortelėje „[T] vėluoja“; rodomas tik kol užsakymas apmokėtas, neuždarytas, bent viena dalis neišsiųsta ir žymės `_ps_velavimo_laiskas` nėra. Tas pats laiškas kaip automatinis 14:00 (§12.3 3 p.; tekstas ir tema Raimio, „Likusių …“ variantas, kai dalis išsiųsta); rankiniu būdu praleidžiamos tik sąlygos „≥3 d. d.“ ir „Klausimuose“ — darbuotojas sprendžia. Dialogas rodo pilną laiško tekstą. Po siuntimo — ta pati žymė, pill „klientui pranešta apie vėlavimą (data)“, pastaba su darbuotojo vardu, įvykis `velavimo_laiskas` (kanalas web / „rankiniu mygtuku“); mygtuko nebelieka. Automatinis 14:00 nekeistas.

**#2 „Redaguoti“ skydelyje be WooCommerce** (Raimis 09-04: „klientai prirašo nesąmoningų adresų — kurjeriui, ne tik paštomatui“; v3.16 → v3.18). Forma vietoje „Pristatymas“ bloko: kurjeriui — vardas, pavardė, adresas, adresas (2), miestas, pašto kodas; Venipak / LP paštomatui — sąrašas su paieška (Venipak 567 LT vietų iš plugino `pickups.json`, LP 531 iš plugino lentelės); visiems — telefonas (billing + shipping). **Pristatymo BŪDAS nekeičiamas.** Išsaugojus — pastaba „prieš → po“, įvykis `redaguoti`, vežėjo klaida nuimama (Venipak `status` → '', LP `lp-parcel-failed` → `lp-parcel-await` + klaidos meta ištrinta); „nieko nepakeista“ → nieko nerašo.
1. **Laiško klientui po adreso keitimo NĖRA** (Raimis: „nereikia iš vis nieko rašyti, jei reikės — darbuotojas parašys“) — varnelė ir laiškas išimti; pastaboje „Klientui laiškas nesiųstas“. **Keičia §6c 5 p.** (varnelė ON).
2. **Po BET KURIO užregistruoto lipduko (AV, tiekėjo, LP siunta sukurta) „Redaguoti“ neveikia** (Raimis: „nieko nedarom, rankiniu būdu — mažiau klaidų“) — mygtukas pilkas „lipdukas jau užregistruotas / išsiųsta / uždaryta — keisk rankiniu būdu“; įspėjimai „Lipdukas iš naujo“ / „parašyk tiekėjui“ / LP perregistravimas išimti. **Keičia §6c 1 p.** („po jų — su perregistravimu“ — nedarom). Galima, kol bent viena dalis neišsiųsta, neuždarytas ir nė viena dalis neturi numerio.
3. Klausimas „laiškas tiekėjui su senu adresu“ **atkrenta** — lipdukas tiekėjui registruojamas prieš laišką, po 2 p. redaguoti nebėra ką.
4. **V14 darbalaukio lygiu** (variklio `klausimas()` neliesta): nepavykus sukurti siuntos (Venipak `venipak_shipping_order_data.status=error`, LP `_woo_lithuaniapost_parcel_create_error`) → Klausimas „Siuntos sukurti nepavyko“ lietuviškai + originalas skliaustuose („Venipak: neteisingas pašto kodas (Bad post code)“, „LP Express: neteisingas paštomatas (…)“), kortelėje **„Taisyti adresą“** → skydelis su atverta forma. Nepavykus lipdukui numerio nėra, todėl 2 p. čia netrukdo; po išsaugojimo klaida nuimta, Klausimas dingsta, lipdukas registruojamas iš naujo.

**#3 „Siunta grįžta“ — dalinis** (Raimis 09-04: „visi tokie užsakymai papuola į Klausimus, darbuotojas turi turėti dideles galimybes ir jis nusprendžia, ne sistema; užsakymų daug nebus“; v3.17 → v3.18). **Keičia §12.3 5 p. „dalinis — 5 etapas, neleidžiama“.** Užraktai nuimti. Kortelė sako, kokia dalis grįžta, kas su kita dalimi („Kita dalis: AV (dar ruošiama) / Prins (išsiųsta)“), ir duoda du mygtukus:
- **„Siųsti iš naujo“ — tik grįžusią dalį.** AV dalis grįžta → numeriai į senas, Surinkti AV → naujas lipdukas (kaip §12.3). **5. Grįžusi tiekėjo dalis VISADA → AV, standartinė procedūra** (Surinkti AV → Lipdukas → Kurjeris paėmė, AV manifestas; eilutės → kelias „Iš AV“, likutis +q −q = 0, `_ps_av_reduced_qty=q`). Variantas „tiekėjo manifesto lipdukas iš AV“ (`_ps_dalys_is_naujo`, „Lipdukas [T] iš naujo“) — **atmestas, išimtas.** Kai AV siunta **jau išsiųsta**: jos eilutės pažymimos `_ps_issiusta` (laikas|nr) — skydelyje užraktas „IŠSIŲSTA MM-DD (siunta N) — NEPAKUOK“, siunta įrašoma į `_ps_dalys_baigtos.av` (klientui paskyroje ir laiškuose lieka kaip „Siunta 1 iš 2 · Išsiųsta“; nauja AV dalis — „Siunta 2 iš 2 · Ruošiama“), AV numeriai → senos, AV dalis ruošiama iš naujo tik iš grįžusių prekių. **Ribotumas (variklis, Raimis sutiko):** `petshop-av-sheets.php` lapas ima VISAS `_ps_source=av` eilutes — lape bus ir jau išsiųstos; todėl užsakymas **išskiriamas** (Raimis: „pažymėti ar spalva išskirti, kad iškart atkreiptų dėmesį“): sąraše raudona kairė juosta + rausvas fonas + raudonas pill „⚠ Lape bus ir jau išsiųstos prekės — NEPAKUOK: 1× …“, skydelio „Dabar“ — tas pats sakinys, pastaba ir įvykis; galioja, kol AV dalis vėl neišsiųsta.
- **„Atšaukti tik grįžusią dalį“** (kai yra kitų aktyvių dalių; kitaip — „Atšaukti — prekės grįžo į AV“ = visas užsakymas, §12.3). Dalies eilutės gauna `_ps_atsaukta`; likutis — tiekėjo eilutės +q į `_own_stock_qty`, AV eilutės +q eilutės lygiu (variklio `grazinti` veidrodis; `_ps_av_reduced_qty` → 0, kad pilnas atšaukimas negrąžintų dukart); `_ps_dalys_atsaukta[dalis]`; **statusas lieka** (completed lieka; processing → completed tik kai visos likusios dalys išsiųstos); pastaba „… dalis ATŠAUKTA … WC dalinį grąžinimą ir pinigus už atšauktą dalį tvarkyk rankomis. Klientui laiškas: NESIŲSTAS“; įvykis `grizta_atsaukti_dalis`. Kortelėje „Adresą taisyk „Redaguoti“ prieš naują lipduką“.
- **4. Klientui atšaukta dalis NERODOMA** (Raimis: dažnas atvejis — klientas daro du užsakymus su skirtingais bankais, pirmą tyliai atšaukia; nepainioti) — `kliento_siuntos()` be `atsaukta`, `petshop-kliento-siuntos.php` lieka v1.2 (v1.3 „Atšaukta“ atšaukta). Atšauktos eilutės į „n iš N“ neskaičiuojamos, laiškuose nerodomos.

**K4 modelis (darbalaukio lygiu, variklio `_ps_siuntos` neliečiant): dalis išlaiko tapatybę.** Dalis = sandėlio raktas (`av`, `vf`, `zb`, `prins`, `ambrosia`, `belcor_tofu`, `quattro`); būsenos žymės tik darbalaukio meta: `_ps_dalys_issiusta[dalis]` (išsiųsta), `_ps_dalys_baigtos.av[]` (ankstesnė AV siunta, `{nr[],laikas,prekes[[q,n]]}`), `_ps_dalys_atsaukta[dalis]`, eilučių `_ps_issiusta` (laikas|nr) ir `_ps_atsaukta` (laikas|kas|nr|senas rq), `_ps_siuntos_senos`, `_ps_siunta_grizta`, `_ps_venipak_sekimas`, `_ps_velavimo_laiskas`. `faktai()` išima atšauktas / jau išsiųstas eilutes iš aktyvių dalių (žingsnelių nėra, užraktas, `reduced=true`); heuristika „plugino meta = AV siunta“ skaičiuoja tiesiai dalis įskaitant atšauktas. `_ps_dalys_is_naujo` — panaikinta (v3.18).

**Kosmetika v3.18.1 (S1615):** sąrašo 2 stulpelis „Prekės pagal kelią“ nerodo eilučių su `_ps_issiusta` / `_ps_atsaukta` (#35438 rodė „2 vnt. … +1“, pakuoti reikia 1); pill, skydelis ir kliento vaizdas jas rodo teisingai.

**Tyliai galioja (S1613 prielaidos, Raimis neprieštaravo):** LP „pristatyta“ data iš plugino lentelės / pastebėjimo laiko; sekimo ribos 60 d. / ≤200 per run'ą; „[T] vėluoja“ Klausimuose automatinio vėlavimo laiško negauna — yra rankinis mygtukas (#1). Techninė pastaba (neprašo sprendimo): variklio `klausimas()` „Trūksta sandėlyje“ ciklas `_ps_atsaukta` av eilutę mato su rq=0 — po grąžinimo likutis ≥ q, netriggerina; jei triggerintų — variklio klausimas.

**Nepatikrinta gyvai (J1 / T-0):** LP „Redaguoti“ kelias (nėra LP processing testinio; kodas simetriškas Venipak), Venipak paštomato pakeitimas (sąrašas rodytas, nespausta), „Lipdukas“ po „Siųsti iš naujo“ realiu Venipak.

**5 etapas toliau (eilė — Raimis 09-04; kiekvienam: spec/registras → recon → Raimio sprendimai → kodas):** #4 kiekiai (keisti kiekį, išimti prekę, pridėti prekę — §6c 2–4 p.), dalinis atšaukimas / grąžinimas kitais atvejais (ne „grįžta“), Sąskaita (AVPN/IAPV), „Kaip mato klientas“ (svečiui), „Naujas užsakymas“ (telefoninis), „Atsiėmimas AV“ (`local_pickup`), paskyros UI lokalizacija.

## 12.5. Raimio sprendimai S1615 (2026-09-04 naktis) — grįžusi neatsiimta siunta, pinigai, kreditinė, sąskaitos, #4 modelis (GALIOJA; kodas dar nerašytas)

**Grįžusi neatsiimta siunta — mokesčiai (taisyklių 6.10–6.11, jau įrašyta 34524/14894/34523, S1615 e8d):**
- Siuntos grąžinimo išlaidos klientui — **fiksuota 3,99 Eur su PVM (3,30 + PVM), visada** (ir siunčiant iš naujo, ir atšaukiant). Netaikoma, jei nepristatyta dėl Pardavėjo/vežėjo kaltės — darbuotojas nuima rankomis.
- **Pakartotinis siuntimas** — pagal standartinius pristatymo įkainius (paštomatas 2,15 Eur, kurjeris pagal svorį), **nemokamo pristatymo sąlyga netaikoma**, + 3,99. Siunčiama tik gavus apmokėjimą.
- **Atšaukiant** (klientas nebenori arba per 14 d. nesusitarė — Claude prielaida 6.11) — grąžinama **už prekes ir pristatymą sumokėta suma − 3,99** (pvz. 36,42 − 3,99 = 32,43), tuo pačiu būdu per 14 d.
- Teisinis pagrindas: VVTAT DUK / CK 6.364(2) — tiesioginės grąžinimo išlaidos tenka vartotojui, jei informuotas (taisyklės, kurias tvirtina kasoje); LT pavyzdžiai Nutrioz, Vilma Electric, Saulėspukis, Savitas.

**Darbalaukyje („Siunta grįžta“ kortelė, po S1614 #3):** rodyti suskaičiuotas sumas, darbuotojas neskaičiuoja: „Klientui grąžink: [sumokėta] − 3,99 = X €“ ir „Pakartotinis pristatymas: [įkainis] + 3,99 = Y €“ (abu skaičiai — konstantos su galimybe pataisyti).

**Pakartotinis pristatymas — kaip apmoka klientas (Raimis: „noriu, kad sistema išrašytų sąskaitą, klientas apmoka per Paysera, įkrenta automatinis patvirtinimas“; dabar — rankinė sąskaita ir banko tikrinimas, „košmaras“):** darbuotojas kortelėje spaudžia „Pakartotinis pristatymas“ → sistema sukuria **naują mažą užsakymą** (tik pristatymo mokestis + 3,99, tas pats klientas ir adresas, nuoroda į pradinį užsakymą) → klientui laiškas su apmokėjimo nuoroda (WC „apmokėti užsakymą“ — Paysera arba pavedimas) → apmokėjus Paysera callback pats pažymi apmokėta, **AVPN išsirašo pati** kaip bet kuriam užsakymui → tik tada pradiniame užsakyme galima „Siųsti iš naujo“. Pradinis užsakymas ir jo sąskaita neliečiami. Tai ir yra §12 „Naujas užsakymas“ punkto pirmas panaudojimas.

**Kreditinė sąskaita — pusiau automatinė** (Raimis: „sistema pasiūlo, darbuotojas peržiūri, jei reikia pataiso ir patvirtina“; „pilnas grąžinimas“ = kai prekės grįžo į sandėlį). Paspaudus „Atšaukti — prekės grįžo į AV“ → sistema paruošia juodraštį (prekės + pristatymas − 3,99; kai grąžinimas ne dėl kliento — visa suma) → darbuotojas peržiūri/pataiso → „Patvirtinti“ → kreditinė **KR-AVPN** per esamą šabloną (WCDN 7.3.0 *creditnote* + temos `woocommerce-delivery-notes/base.php`, PDF į `uploads/wcdn/creditnote/`, meta `_wcdn_creditnote_pdf`; REGISTRAS §8jj.1: KR-AVPN numeracija dar netikrinta gyvai — tikrinti prie pirmo testo) + pastaba „grąžink klientui X € rankomis (Paysera)“ + Klausimas, kol nepažymėta. Dalinė kreditinė (kiekio mažinimas) — tas pats juodraštis, darbuotojas gali ir rankomis. **Neišaiškinta prieš kodą:** ar WCDN *creditnote* spausdina tik WC grąžinimo eilutes, ar visą užsakymą.

**Sąskaitų saugojimas ir buhalterija (Raimis: Pragma — buhalterės programa, mes tik siunčiam duomenis; „paprasčiausiai — gale mėnesio su visomis sąskaitomis kartu per ataskaitą Pragmai“; sistemoje turi būti galimybė atsifiltruoti / išsitraukti bet kurią sąskaitą, visos saugomos):** AVPN/IAPV PDF jau saugomi (`uploads/wcdn/invoice/`, meta `_petshop_completed_pdf` / `_petshop_order_pdf`), kreditinės — `uploads/wcdn/creditnote/`. 5 etapo **„Sąskaita“** punktas = darbalaukio langas: visų dokumentų sąrašas (AVPN / IAPV / KR-AVPN) su filtrais (nr., data, klientas, suma, tipas), atsisiuntimas, mygtukas skydelyje (dabar pilkas „dar nepadaryta“). **Pragma eksportas** (`petshop-pragma`, 5 d., dabar tik AVPN užsakymai) — papildyti kreditinėmis (neigiami įrašai) — atskiras darbas, variklio pluginas, klausti prieš liečiant.

**#4 „kiekiai“ — techninis modelis (Claude sprendimas, Raimiui pranešta paprastai): B.** Kiekio mažinimas / prekės išėmimas iš apmokėto užsakymo: (1) WC refund įrašas „grąžinta n vnt., X €“ (`refund_payment=false`, WC laiškas klientui blokuojamas) — iš jo kreditinė ir `ps_fakt_grazinimai`; (2) eilutė perrašoma (`set_quantity`, proporcingos sumos, `calculate_totals`, pristatymas nekinta), likutis per `likutis()` (av) / WC veidrodis (tiekėjo), `_ps_av_reduced_qty`, grupės/planas, Tiekimo eilutė perdedama; partijos — rankomis (pastaba). Riba: jokio lipduko, jokio tiekėjo laiško, partija ne užsakyta (kaip `redagavimas()`); po to rankiniu būdu. Išimti viską = „Atšaukti“. Laiško klientui nėra. „Pridėti prekę“ (suma didėja) — atskirai, per tą patį „naujas mažas užsakymas + apmokėjimo nuoroda“ mechanizmą (§11.3 uždaromas taip).

