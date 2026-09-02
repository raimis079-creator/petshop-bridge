# UŽSAKYMŲ LOGIKOS REGISTRAS v1 — 2026-09-02

> Šaltiniai: `petshop-desk.php` v3.48 (antraštės H221–H265 su Raimio pastabomis), `petshop-av-dropship.php` v1.19 (v1.2–v1.19), `petshop-av-tiekimas.php` v1.9.3 (v1.2–v1.9), `petshop-siuntu-laiskai.php` v1.2, `petshop-av-source.php` v1.1, `petshop-av-order.php`, `petshop-av-reduce.php` v1.1, TŽ MASTER §35 (35.2–35.11), auditas 2026-09-02.
> Tikslas: **nė viena išdirbta taisyklė nedingsta** pereinant į naują darbalaukį. Kiekviena eilutė: kas veikia dabar · kur kode · kur naujame darbalaukyje. „—" = neliečiama, lieka variklyje. ⚠ = naujame makete buvo pamesta arba prieštarauja — taisoma.

Stulpelis „Kur naujame" naudoja sutartą žodyną: **Rūšiuoti** (kelio pasirinkimas) · **Laukiam** · **Surinkti** · **Lipdukas** · **Laiškas [Tiekėjas]** · **Išsiųsta** · **[Tiekėjas] išsiuntė** · **Užsakyti iš [Tiekėjas]** · **Gauta**.

---

## A. Šaltiniai ir keliai (kas iš kur važiuoja)

| # | Taisyklė (kaip veikia dabar) | Kode | Kur naujame |
|---|---|---|---|
| A1 | Septyni sandėliai: AV, VF, ZB, Quattro, Prins, Ambrosia, Belacor. „Legacy" — ne sandėlis, laikinas maišas. | TŽ 35.11; desk `SALTINIAI` | Vardai visur pilni: *Avesa sandėlis · Vetfarmas · Žalioji Banga · Quattro · Prins · Ambrosia · Belacor*. Trumpiniai AV/VF/ZB tik ženkliukuose. |
| A2 | Šaltinis priskiriamas **eilutei** apmokėjimo momentu: `_ps_source`, `_ps_carrier`, `_ps_source_qty`, `_ps_source_at`, `_ps_source_reason`. | av-order `fiksuoti()` (payment_complete / processing, prior. 5) | — . Rūšiavimo skydelyje rodomas kaip **pasiūlymas** su `_ps_source_reason` tekstu („Avesoje 24 vnt."). |
| A3 | Raimio taisyklė §17.2: eilutei AV, jei AV turi VISĄ kiekį; kitaip dropship tiekėjas. Dvi AV rūšys: grynai AV (`_stock`) ir AV+tiekėjas (`_own_stock_qty`; tuščias ≠ 0). | av-source `resolve()` | — . Skydelyje trečias kelias „Avesa sandėlis" siūlomas, kai `av_qty ≥ q`; rankinis perjungimas leidžiamas ir kai sistema siūlė tiekėją (žr. E5). |
| A4 | Vežėjas: AV → Venipak arba LP (`any`); visi dropship → tik Venipak. LP Express su ne-AV eilute = Klausimas „LP negalimas". | av-source; desk `klausimas()` | — . Rūšiuojant, jei pristatymas LP ir eilutė ne Avesa — skydelis neleidžia patvirtinti, sako „LP tik iš Avesos: keisk kelią į Avesa arba pristatymą". |
| A5 | Mišrus = sandėlių > 1 (nesvarbu, ar tarp jų AV). Mišrus be AV (ZB+VF) — tik „Perduoti", ne „Surinkti". | desk H235 | „Mišrus" kaip **eilė dingsta**; lieka kaip savybė: užsakymas turi kelių kelių eilutes ir rodosi kiekvienoje reikiamoje eilėje (žr. C3). |
| A6 | Mišraus sprendimas **pagal sandėlį**: ZB dalis keliauja kartu, VF gali kitaip. Sprendimas rašomas `_ps_misrus_sprendimas` {sandėlis: tiesiai|av}. | desk H236, `misrus` veiksmas | Rūšiavimo skydelyje kelias renkamas **eilutei**, bet to paties tiekėjo eilutės keičiamos kartu (numatyta), su galimybe atskirti. Saugoma ta pati meta + eilutės `_ps_source`. |
| A7 | Sprendimas atskirtas nuo vykdymo (H239): „Patvirtinti planą" tik užrašo; vykdymą pradeda žmogus („Į tiekimo partiją" / „Perduoti"). Sistema neturi nė vieno savarankiško žingsnio. | desk H239, H242 | ⚠ Makete v3–v5 „Surūšiuota" iškart sudėdavo į partiją. **Taisoma:** „Surūšiuota" = planas įrašytas; „→ Avesa sandėlį" eilutės į partiją deda atskiras mygtukas **„Užsakyti iš [Tiekėjas]"** (= dabartinis `kons` + Tiekimo „Užsakyti"). Iki tol užsakymas eilėje „Laukiam" su užrašu „neužsakyta". |
| A8 | Planas keičiamas, kol niekas neperduota ir partijos kaupiamos („Keisti planą"). | desk H239 | Skydelyje keliai keičiami, kol eilutei nepadarytas nė vienas žingsnis; po lipduko/laiško — užrakinta su paaiškinimu „siunta jau registruota — perregistruoti?". |
| A9 | Konsolidacija: eilutė, paimta į AV (tiekimo lentelė / `_ps_konsolidacija`), į tiekėjo laišką **nebepatenka** (kitaip užsakytų du kartus). Nuo K2 — po priėmimo tampa `av`. | dropship H233, tiekimas K2 | — . |
| A10 | Laiškai gerbia planą: eilutė, kuriai planas „į AV", bet dar ne partijoje, į tiekėjo laišką NEPATENKA. | dropship H239 | — . ⚠ v5 „Laiškai" ėmė visas `tk` eilutes — taisoma, kad imtų tik tas, kurių kelias „→ klientui". |

## B. Likučiai

| # | Taisyklė | Kode | Kur naujame |
|---|---|---|---|
| B1 | AV nurašymas apmokant tik `av` eilutėms (grynai AV → `_stock`, AV+tiekėjas → `_own_stock_qty`); WC nurašymas AV eilutėms sustabdomas filtru. Žymė `_ps_av_reduced` (užsakymo lygiu) + `_ps_av_reduced_qty` (eilutės). | av-reduce `mazinti()` | — . |
| B2 | Grąžinimas tik `cancelled` / `refunded` — visam užsakymui, pagal `_ps_av_reduced_qty`. | av-reduce `grazinti()` | — . |
| B3 | ⚠ Keičiant kelią AV → tiekėjas (Klausimas „siunčia tiekėjas") AV likutis **negrąžinamas**; tiekėjas → AV (rankinis) — neegzistuoja. | desk `klaus` (auditas) | **Nauja taisyklė „likutis seka kelią"** (sutarta 2026-09-02): keičiant eilutės kelią sistema atšaukia seno kelio nurašymą ir pritaiko naują: Avesa→tiekėjas +q; tiekėjas→Avesa −q (jei Avesoje < q — neleidžia, „Avesoje tik N"); →Avesa sandėlį: +q dabar, priėmus +q ir −q (K2). Žymė perkeliama į eilutės lygį. Žurnale kiekvienas judesys. |
| B4 | Priėmimas: faktiniai kiekiai → AV likutis (+), nuo K2 iš karto rezervuojama užsakymui (−), eilutė → `av`. Trūkumas → nauja to paties tiekėjo partija. | tiekimas `priimti()` | — . |
| B5 | Dropship prekių WC `_stock` = tiekėjo likučio veidrodis, sync perrašo; WC „liko nedidelis kiekis" laiškai už tiekėjų likučius — triukšmas. | auditas S6 | Neliečiama; atskira užduotis (išjungti low-stock laiškus ne-AV prekėms). |

## C. Eilės ir rikiavimas

| # | Taisyklė | Kode | Kur naujame |
|---|---|---|---|
| C1 | Eilė = tik ten, kur reikia veiksmo. „Kelyje"/„Įvykdyti" — ne eilės, filtrai „Visuose". | TŽ 35.2 | Tas pats principas. Eilės: **Nauji (rūšiuoti) · Laukiam iš tiekėjų · Surinkti Avesoje · Laiškai tiekėjams · Paruošta siųsti · Klausimai · Neapmokėti · Visi**. „Išsiųsti" — filtras Visuose (kaip dabar „Kelyje"). |
| C2 | Neapmokėti (pending/on-hold/failed) — „tik stebėti", mygtukas „Pažymėti apmokėtu" (payment_complete + AV nurašymas + laiškas su varnele). | desk `apmoketa` | ⚠ v2–v5 nebuvo — **grąžinama** kaip eilė su tuo pačiu veiksmu. |
| C3 | Dropship nedingsta po Venipak registracijos: kol `neperduotos()` netuščia — užsakymas „Nauji" su „Perduoti", nesvarbu lipdukai. | desk H255 | Užsakymas rodosi **kiekvienoje eilėje, kur jam reikia veiksmo** (Laiškuose pagal tiekėją, Surinkti — Avesos siuntai). Sąrašo takelis rodo visas dalis. |
| C4 | Perdavimas skaičiuojamas pagal sandėlį (`_ps_dropship_sent_src`), kiekvienas neperduotas sandėlis — savo mygtukas („Perduoti VF", „Perduoti ZB"), kad siuntos klientą pasiektų kartu. | desk H234, H240 | Laiškų eilėje kortelė **per tiekėją**; užsakymas su dviem tiekėjais — dviejose kortelėse. Išsiuntimo laiką sprendžia žmogus. |
| C5 | „Kurioje eilėje?" ženklas sąraše ir paieškoje (Visi). | desk H249 | Takelis + eilės ženklas Visuose. |
| C6 | Pipeline juosta: Laukia sprendimo · Nepaleisti planai · Neperduota tiekėjams · Partijose · Laukia prekių · Paruošta · Išsiųsta šiandien; chip'ai eilutėse (VF ✓ 11:04 / PRI ⏳ / ZB→AV). | desk H243 | Skaitliukai eilių mygtukuose + takelis eilutėje = ta pati informacija be atskiros juostos. „Išsiųsta šiandien" — Visų filtras. |
| C7 | Filtrai — dvi ašys: Vykdymas (iš kur) ir Pristatymas (kas veža) + Data; niekada nemaišomos. Paieška: nr, klientas, el. paštas, telefonas, adresas, prekė. Klaviatūra j/k, Enter, x, /, Esc. | desk `juosta()`, `paieska_ids()` | — . Filtrai lieka „Visuose" ir kiekvienoje eilėje (sutraukti), paieška juostoje. |
| C8 | Klausimai neguli Naujuose ir nepatenka į rytinę eigą: trūksta sandėlyje · mokėjimas nepavyko · siuntos sukurti nepavyko · atsisako sutarties · tiekėjas vėluoja 24 h. Sprendimai: Siųsti iš tiekėjo · Parsivežti į AV · Laukti · Atšaukti. | desk `klausimas()`, `klaus`; TŽ 35.10 | ⚠ v2–v5 buvo tik „trūksta". **Grąžinama** eilė „Klausimai" su visomis penkiomis priežastimis; „Siųsti iš tiekėjo / Parsivežti" = tas pats rūšiavimo skydelis (kelio keitimas su B3 likučiais). |
| C9 | Kiekvienas veiksmas per vieną vietą: `admin_post_ps_desk_veiksmas` → nonce → teisės → vykdymas → pastaba užsakyme → grįžimas (AI paruošimas). | TŽ 35.3 | — . Naujas darbalaukis kviečia tuos pačius `v=` veiksmus. |

## D. Rytinė eiga

| # | Taisyklė | Kode | Kur naujame |
|---|---|---|---|
| D1 | Partija užrakinama 3 val.; nuo K1 perfiltruojama pagal statusą. Vėliau atėję nepatenka. | desk `ryto_partija()` | ⚠ Raimis 2026-09-02: „užsakymai krenta nuolat". **Užraktas naikinamas**: eiga = vedimas per eiles gyvai (skaičiai iš tų pačių `gauti()` užklausų). Žingsniai spaudžiami bet kokia tvarka (kaip dabar). |
| D2 | Žingsniai: Peržiūra → Lapai → Venipak → LP → Tiekėjams → Baigta; „jau perduoti į eigą nebeįtraukiami"; mygtukai atidaro naują kortelę, eiga lieka. | TŽ 35.4 | Žingsniai: **1 Rūšiuoti naujus · 2 Lipdukai ir laiškai tiekėjams · 3 Užsakyti iš tiekėjų · 4 Surinkti Avesoje (lapai) · 5 Lipdukai Avesai (Venipak / LP) · 6 Išsiųsta · 7 Gavimai · 8 Klausimai**. Tvarka pagal ribas (žr. F1): tiekėjai anksti (ZB/PRI 09:00), Avesa 11:00, VF/LP 13:00. |
| D3 | Venipak grupės rytinėje eigoje rodo svorį pagal sandėlį (kurjeriui reikia bendro svorio). | desk H237 `grupes_svoris()` | — (žingsnis 2 ir 5). |

## E. Venipak (registracija, lipdukai, manifestai)

| # | Taisyklė | Kode | Kur naujame |
|---|---|---|---|
| E1 | Manifestas pagal sandėlį: AV 001 · VF 002 · ZB 003 · Quattro 004 · Prins 005 · Ambrosia 006 · Belacor 007. Vienas manifestas = vienas paėmimas iš vieno adreso; sandėliai nemaišomi. Siuntėjas visada UAB Avesa. Grupė vienu XML. Kodas nustatomas per Reflection ir grąžinamas. | desk `venipak_registruoti()`, `MANIFESTAI`; TŽ 35.5 | — . „Lipdukas" mygtukas Laiškų kortelėje (tiekėjo grupė) ir Surinkti/Avesa žingsnyje (AV grupė) = `vp_reg` su `sandelis`. |
| E2 | Saugikliai: nereg. jei jau turi siuntą; paštomatas be `venipak_pickup_point`; mišrūs per masinį — praleisti; nuo K1 — ne-processing praleisti. | desk H221, H227, K1 | — . Pranešimai tais pačiais žodžiais. |
| E3 | Mišrus automatiškai NEREGISTRUOJAMAS (pluginas moka vieną siuntą užsakymui). Registruojama iš perdavimo/laiškų kortelės pagal sandėlį (`perreg=1`), rezultatai kaupiami `_ps_siuntos` pagal sandėlį; `venipak_shipping_order_data` perrašomas paskutine. | desk `vp_reg perreg`, siuntu-laiskai `prideti_is_plugino()` | — . ⚠ Auditas V2: kiekviena dalis registruojama VISO užsakymo svoriu — taisyti `packs[]` iš grupės svorio. ⚠ V4: rodyti visus numerius iš `_ps_siuntos`, ne iš plugino rakto. |
| E4 | Kurjeris, kelios dėžės: `packs[]` su padalintu svoriu, viena siunta. Paštomatas, kelios dėžės: n siuntų po 1 dėžę tam pačiam paštomatui, numeriai sudedami, n lipdukų viename PDF. Dėžių skaičius `_ps_pakuociu`, nustatomas PRIEŠ registraciją; perregistravimas su kitu skaičiumi (`perreg=1&n=`), senas nr. lieka pastaboje. | desk H258, H259; TŽ 35.7 | Skydelyje prie Avesos siuntos / tiekėjo grupės laukas „dėžių" su „Perregistruoti", kai jau registruota. |
| E5 | Statuso keitimas plugine išjungtas (`isstatuschangedisabled`) — registracija nedaro „Įvykdytas". | TŽ 35.5 | — . |
| E6 | Lipdukas 10×15 (283×425 pt), per plugino AJAX vienam užsakymui; keli pack'ai — `pack_no[]` masyvu (kableliais Venipak tyli). Manifestas — `ws/print_list` su manifesto kodu (ne `print_manifest`, kurio nėra). | dropship H262 | — . |
| E7 | Masinis „Venipak lipdukai" / „Sąskaitos" ėjo per WC bulk formą. | desk `wc_forma()` | ⚠ WC nenaudojamas — lipdukai ir sąskaitos per savus endpoint'us (`ps_dropship_lipdukas`, naujas `ps_desk_veiksmas v=lipdukai` grupei; sąskaitos — `_petshop_order_pdf`). |

## F. Ribos ir laikas

| # | Taisyklė | Kode | Kur naujame |
|---|---|---|---|
| F1 | Ribos: AV 11:00 · VF 13:00 · ZB 09:00 · Prins 09:00 · Belacor 09:00 · Quattro 09:00 · Ambrosia 10:00 · LP 13:00. Rodoma juostoje (artimiausia), prie užsakymo, Venipak grupių antraštėse; praėjus — „keliaus rytoj"; tiekėjai rikiuojami pagal skubumą. | desk `riba()`, `ribos_zyme()`; TŽ 35.8 | — . Laiškų kortelėje antraštėje „ZB 09:00 · liko 40 min"; rytinės eigos žingsnių tvarka pagal ribas. |
| F2 | Auto-atnaujinimas kas 60 s, tik kai langas matomas ir niekas nepažymėta. | desk H226 | — . |
| F3 | SLA sargas: perduota tiekėjui prieš 24+ val., neišsiųsta → Klausimas „Tiekėjas vėluoja". | desk `klausimas()` `_ps_sla_velavimas` | — (Klausimai C8). |

## G. Laiškai tiekėjams (dropship)

| # | Taisyklė | Kode | Kur naujame |
|---|---|---|---|
| G1 | Vienas tiekėjas = viena kortelė = vienas laiškas su visais jo užsakymais, lipdukais (kiekvienas „NR Vardas Pavardė.pdf") ir manifestu. Iš terra@petshop.lt. AV prekės į laiškus nepatenka. | dropship H257, v1.2 | Laiškų eilė = šios kortelės (v5 kryptis teisinga). |
| G2 | Siuntos vartai: jei yra užsakymų be registruotos siuntos — siuntimas išjungtas, šalia „Registruoti Venipak (n)"; „Siųsti be lipdukų" — sąmoninga išimtis. | dropship H255 | Kortelėje žingsnis 1 Lipdukai (n) → 2 Laiškas; be lipdukų — atskiras tylus mygtukas su patvirtinimu. |
| G3 | Adresatai: varnelės „siųsti tiekėjui" (numatyta OFF) / „kopija man" (ON), bendras nustatymas su Tiekimu; prierašas laiške; peržiūra — tiksliai tas tekstas; archyvas 200 laiškų. | dropship H248–H251, H258 | Kortelėje „Peržiūrėti laišką" (su prierašu ir varnelėmis) — kaip dabar `kortele()`. Archyvas — Laiškai → Išsiųsti. |
| G4 | Partija į AV keliauja tame pačiame tiekėjo laiške (blokas „Į AV sandėlį — partija #n", varnelė įjungta); po sėkmingo laiško partija uždaroma; laiško dalis: antraštė UAB Avesa + lentelė + kiek lipdukų. | dropship H260–H261, tiekimas v1.8–1.9 | Laiškų kortelėje tas pats blokas: „Į Avesą — partija #n (2 prekės)" su varnele. **Todėl „Užsakyti iš [Tiekėjas]" ir „Laiškas [Tiekėjas]" gali būti tas pats laiškas** — eilė „Laukiam" rodo tai kaip „užsakyta su laišku 10:12". |
| G5 | ZB — rankinis kanalas: kodas + kiekis „Kopijuoti" į ZB sistemą, lipdukas po vieną, „Pažymėti ZB perduotais" (laiško nėra). Kodai: VF/Quattro = mūsų SKU; Prins/Ambrosia — pavadinimas + EAN. | dropship v1.2 | ZB kortelė Laiškų eilėje lieka tokia, tik su vienu žodynu: 1 Lipdukai · 2 Suvesti į ZB (Kopijuoti) · 3 Perduota. |
| G6 | Po siuntimo — tiesa: išsiųsta / nepavyko + wp_mail klaidos tekstas; pasirinkimas išvalomas. | dropship H257 | — . |
| G7 | Sistema paruošia — žmogus tvirtina; automatinio siuntimo nėra (laiškas = užsakymas su Raimio pinigais). | dropship | — . |

## H. Tiekimas (prekės į Avesą)

| # | Taisyklė | Kode | Kur naujame |
|---|---|---|---|
| H1 | Partija (kaupiama → užsakyta → gauta) per tiekėją; eilutės iš užsakymų + rankiniai priedai; kiekiai keičiami iki užsakymo. Pristatymo būdas ir svoris — **partijos**, ne užsakymo savybė (trys būdai: paštomatas Nemenčinė ≤25 kg · kurjeris į AV · tiekėjas atveža). | tiekimas v1.2, v1.4; TŽ 35.9 | Tiekimo langas lieka. Skydelyje eilutė rodo „partija #n · užsakyta 10:12 kurjeriu · laukiam". |
| H2 | Registracija iš partijos savo Venipak sutartimi, gavėjas AV/paštomatas (K3), pack per plugino skaitiklį, lipdukas laiške; „tiekėjas atveža" ir ZB — be registracijos. | tiekimas v1.6, K3 | — . |
| H3 | Priėmimas: faktiniai kiekiai, galiojimas, trūkumas → nauja partija; užsakymai, kuriems užteko — laisvi (→ av nuo K2); kuriems ne — laukia toliau. Kelias B „tiekėjas atveža pats": sąskaita → „Atnaujinti likučius" → kas laukia ilgiau, gauna pirmas, su peržiūra. | tiekimas `priimti()`, likučių atnaujinimas | — . Rytinės eigos 7 žingsnis „Gavimai" veda čia. |
| H4 | Kaupimas pusiau automatinis: prie tiekėjo eilutės skydelyje „Į tiekimo lentelę"; nepaspaudei — lieka dropship. | TŽ 35.9 | = kelias „[Tiekėjas] → Avesa sandėlį" rūšiavimo skydelyje + „Užsakyti" (A7). |

## I. Išsiuntimas ir klientas

| # | Taisyklė | Kode | Kur naujame |
|---|---|---|---|
| I1 | „Išsiųsta" (Paruošta siųsti) → `completed`; WC laiškas klientui NESIUNČIAMAS pagal nutylėjimą; grynas dropship po perdavimo — pirmas mygtukas „Išsiųsta", lipduko nespausdinam. | desk H255 `issiusta` | Paruošta: Avesa kortelė („Kurjeris paėmė") ir tiekėjų kortelės („[Tiekėjas] išsiuntė"). ⚠ Auditas V3: sekimo laiškas — į „Išsiųsta" dialogą (varnelė ON, kai visi numeriai yra). |
| I2 | §18.3 sargas: užsakymas su keliomis siuntomis negali tapti completed, kol registruotos ne visos (`_ps_shipments` vs `_ps_siuntos`); apėjimas `_ps_uzbaigti_be_siuntu`. | siuntu-laiskai `uzbaigimo_sargas()` | — . Pranešimas „dar neregistruota: VF" (ne `issiusta_blokas`). |
| I3 | Sekimo laiškas: vienas laiškas su VISAIS numeriais iš `_ps_siuntos`, prierašas, peržiūra; mišriam pagrindinis mygtukas neaktyvus, kol ne visos siuntos, „Siųsti vis tiek" išimtims; MIXED apmokėjimo laiške pastaba apie kelias siuntas. | siuntu-laiskai v1.1–1.2 | — . |
| I4 | Atšaukti: cancelled + prekės grįžta, laiškas NESIUNČIAMAS pagal nutylėjimą (varnelė), apmokėtam — pinigai negrąžinami automatiškai (Paysera refund: ne). Trynimas tik uždarytiems, su negrįžtamumo patvirtinimu, HPOS `delete(true)`. Nuo K1 — išimamas iš rytinių partijų. | desk `atsaukti`, H233 | — . Skydelio apačioje „Atšaukti" (raudonas, tylus). |
| I5 | Sąskaitos AVPN/IAPV — `_petshop_order_pdf`; spausdinamos per WC bulk `wcdn_print_invoice`. | desk `bulk()` | ⚠ Be WC: „Sąskaita" skydelyje atidaro `_petshop_order_pdf`; grupei — savas endpoint. |
| I6 | Kliento pastaba rodoma pilna, nekarpoma. | TŽ 35.2 | — . |

## J. LP Express

| # | Taisyklė | Kode | Kur naujame |
|---|---|---|---|
| J1 | Tik iš AV. Paštomatui dydį parenka pluginas pagal svorį; kurjeriui `lp_part_count` → `partCount`; riba 13:00. Lipduko formavimas iškart kviečia kurjerį — netestuojama, kodas iš plugino skaitymo. Prekė be svorio → įspėjimas („rezultatas melagingas"). | desk `lp_svoris()`, TŽ 35.6 | Avesos lipdukų žingsnyje LP grupė atskirai su **confirm** prieš „Spausdinti LP lipduką" (auditas S2). Statusai `wc-lp-*` — rodomi Visuose. T-0: 1 realus testas. |

---

## K. Kaip tai daro geriausi (ir ką iš jų imam)

Trys sistemos, su kuriomis verta lyginti, nes jos sprendžia **tą patį** uždavinį — vienas užsakymas, kelios išsiuntimo vietos, dalis per tiekėjus:

**Shopify (Fulfillment Orders).** Užsakymas apmokėjus automatiškai skyla į *fulfillment orders* — po vieną kiekvienai vietai (sandėlis, tiekėjas, dropship app). Kiekvienas turi savo eilutes, savo būseną (open → in progress → fulfilled) ir savo sekimo numerį; klientas gauna pranešimą su kiekvienu. Perkelti eilutę į kitą vietą — vienas veiksmas („move"), ir likučiai persiskaičiuoja. Tai **tiksliai mūsų „kelias eilutei"** — mūsų `_ps_groups` jau yra fulfillment orders; naujame darbalaukyje jie tik gauna vardą ir savo takelį. Imam: būsena ir numeriai per vietą, „move" su likučiais (B3), vienas laiškas klientui su visais numeriais (I3 — jau turim, Shopify siunčia po kelis).

**ShipStation / Packlink / Sendcloud.** Darbo eilės pagal **veiksmą**, ne būseną: Awaiting Shipment → (label) → Shipped. Lipdukai spausdinami **partijomis pagal vežėją ir paėmimo vietą**, manifestas (end-of-day) uždaromas vienu mygtuku, kai kurjeris paima. Imam: mūsų Paruošta → „Kurjeris paėmė viską" = manifest close (E1 jau daro pagal sandėlį), lipdukai grupei, ne po vieną (E7).

**Baselinker (LT/PL e-shopų standartas).** Užsakymų statusai — savi ir keičiami, bet **kiekvienas statusas turi vieną veiksmą** ir automatinį perėjimą po jo; tiekėjams — „zamówienia u dostawcy" (purchase orders) su gavimu ir likučių sinchronizacija; „pakavimo asistentas" — surinkimo lapas su patvirtinimu skenuojant. Imam: eilė = veiksmas (C1), Tiekimas = purchase order (H1 jau taip), lapai su kiekių patvirtinimu (vėliau).

**Ko iš jų NEIMAM:** automatinių sprendimų už žmogų (Raimio principas A7/G7 — sistema paruošia, žmogus tvirtina) ir statusų gausos (Baselinker turi 20+, mums užtenka 8 eilių).

**Ką jie visi turi, o mes dar ne:** (1) užsakymo **skaidymas matomas pačiame užsakyme** — kiekviena dalis su savo būsena ir numeriu (mūsų takelis + skydelis tai duoda); (2) **„move" tarp vietų su likučiais** (B3 — kuriam); (3) **eilė = veiksmas, ne būsena** (C1 — keičiam pavadinimus).

---

## L. Maketo v6 sąrašas (kas keičiasi lyginant su v5)

1. Grąžinamos eilės **Neapmokėti** (C2) ir **Klausimai** su visomis priežastimis (C8); „Išsiųsti" → filtras Visuose.
2. „Surūšiuota" tik įrašo planą (A7); „→ Avesa sandėlį" eilutė laukia mygtuko **„Užsakyti iš [Tiekėjas]"**, kuris = partija + (pasirinktinai) tas pats laiškas su klientų užsakymais (G4).
3. Laiškų eilė ima tik „→ klientui" eilutes (A10), rodo užsakymą kiekvieno jo tiekėjo kortelėje (C4), su ribos laiku antraštėje (F1), siuntos vartais (G2), peržiūra ir varnelėmis (G3), ZB kanalu (G5), bloku „Į Avesą — partija" (G4).
4. Užsakymas matomas **visose eilėse, kur jam reikia veiksmo** (C3) — ne tik vienoje.
5. Skydelyje: kelias keičiamas tik iki pirmo žingsnio (A8); LP + ne-Avesa neleidžiama (A4); dėžių skaičius ir „Perregistruoti" (E4); „Sąskaita", „Atšaukti" (I4, I5); likučių judesiai žurnale (B3).
6. Rytinė eiga be užrakto, 8 žingsniai pagal ribas (D1–D2), Venipak/LP grupių svoriai (D3).
7. Paruošta: Avesa „Kurjeris paėmė" + tiekėjų „išsiuntė"; „Išsiųsta" su sekimo laiško varnele ir §18.3 sargo pranešimu žmogaus kalba (I1–I3).
8. Vardai visur pilni (A1); WC — niekur (E7, I5).
