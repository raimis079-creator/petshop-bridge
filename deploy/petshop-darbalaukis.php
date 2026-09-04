<?php
/**
 * Petshop Darbalaukis v3.24 (S1617, 5 etapas: „Pakartotinis užsakymas“ — naujas mažas užsakymas + apmokėjimo nuoroda; v3.22: WC laiškai pakartotiniam užsakymui išjungti per `woocommerce_email_enabled_*`; v3.23 (Raimis 09-05 „pavedimas reikia“): apmokėjimo puslapyje Paysera + bankinis pavedimas, laiške ir „ačiū“ puslapyje rekvizitai, kortelėje „Apmokėta pavedimu“ — darbuotojas patvirtina gavęs pinigus; v3.24: pasirinkus pavedimą (`on-hold`) nuoroda toliau veikia — Paysera vis dar galima; po v3.20) — SĄRAŠAS KAIP MAKETE v7 + SKYDELIS SU TRIMIS KELIAIS.
 *
 * KODĖL (Raimis 2026-09-03): „paspaudus ant užsakymo, kaip makete prekės kortelė dešinėje neatsidaro“.
 * Langas daromas pagal `uzsakymai-maketas-v7.html` (suderintas maketas) + spec §3–§5 + registras:
 *  - sąrašas: eilės kaip juostelės viršuje, stulpeliai Užsakymas · Klientas · Prekės ir keliai (kelio
 *    žymė pilnu vardu „Prins → klientui“, po prekėmis takelis) · Pristatymas · Suma · Kitas žingsnis;
 *  - paspaudus eilutę — SKYDELIS dešinėje (600 px): kiekvienai prekei trys keliai (Avesa sandėlis ·
 *    [Tiekėjas] → klientui · [Tiekėjas] → Avesa sandėlį), negalimi pilki, po jais „kodėl“ ir žingsneliai;
 *    pristatymas, Avesos siunta (dėžės, visi numeriai iš `_ps_siuntos` — V4, perregistruoti), žurnalas
 *    (`Petshop_Uzsakymu_Ivykiai::html()`); apačioje „Surūšiuota — į darbą“ / kitas žingsnis · Redaguoti
 *    (5 etapas) · Sąskaita (5 etapas) · Parašyti klientui · Atšaukti;
 *  - Klausimai — kortelės su priežastimi ir veiksmais (C8: 5 priežastys).
 *
 * NAUJI VEIKSMAI (`admin_post_ps_dl_veiksmas`, nonce `ps_dl_{v}_{id}`), variklis (registras A–J) neliestas:
 *  - `kelias` (iid, k=av|tiesiai|i_av) — kelio keitimas su „LIKUTIS SEKA KELIĄ“ (spec §5, B3): Avesa→tiekėjas
 *    +q (grynai AV `_stock`, kitaip `Petshop_AV_Stock::increase`), tiekėjas→Avesa −q (jei Avesoje < q —
 *    neleidžia „Avesoje tik N“), →Avesa sandėlį +q dabar (Gauta daro +q ir −q — K2). Žymė `_ps_av_reduced_qty`
 *    eilutės lygiu; `_ps_source` = av | tiekėjas, `_ps_kelias`, `_ps_misrus_sprendimas[src]` (kad `kons`/
 *    `neperduotos()` gerbtų planą — A7, A10); `_ps_groups/_ps_shipments/_ps_order_type` perskaičiuojami kaip
 *    K2. Keičiama iki pirmo žingsnio (A8); po lipduko/laiško — užrakinta.
 *  - `rusiuoti` — „Surūšiuota“: `_ps_rusiuota` = laikas|vartotojas, keliai įrašomi kiekvienai eilutei;
 *    į partiją NEDEDA (A7) — tai atskiras „Užsakyti iš [T]“ (= esamas `kons`).
 *  - AUTO RŪŠIAVIMAS (spec 6a): `woocommerce_payment_complete` / `..._status_processing` prior. 100 — jei visos
 *    eilutės turi šaltinį ir vienu keliu (gryna Avesa su likučiu arba vienas tiekėjas) → `_ps_rusiuota=auto`.
 *  Kiekvienas veiksmas rašo `Petshop_Uzsakymu_Ivykiai::irasyti()` su prieš/po.
 *
 * v3.21 (S1617, spec §12.5 „Pakartotinis užsakymas“ — Raimio sprendimai 09-05 (a)(b)(c)): Klausimų kortelėje „Siunta grįžta“ vietoj „Siųsti iš naujo“ —
 *   mygtukas „Pakartotinis užsakymas“ → forma kortelėje `Suma [Y] € · Sukurti ir siųsti nuorodą · Be mokesčio · atgal` (Y iš `grizta_sumos()`, taisoma;
 *   POST `admin_post_ps_dl_pakartotinis`, nonce `ps_dl_pakart_{id}`, lock). `pakartotinis_sukurti()`: naujas mažas užsakymas `wc_create_order` — SVEČIO
 *   (customer_id 0 — Claude prielaida: WC „apmokėti užsakymą“ registruoto kliento užsakymui reikalauja prisijungti, svečio — tik nuorodos su raktu;
 *   `_ps_pakartotinis_klientas` = pradinio kliento ID), tas pats adresas / el. paštas, `created_via=darbalaukis`, viena virtuali paslaugos prekė
 *   „Pakartotinis siuntimas“ (`pakartotinis_preke()`: privati, kataloge nematoma, be likučio, `_ps_sandelis=paslauga`; opcija `ps_pakartotinio_preke`),
 *   eilutės pavadinimas „… už užsakymą #N“, suma su PVM = Y (`wc_get_price_excluding_tax` + `calculate_totals`), meta `_ps_pakartotinis` = pradinio ID,
 *   `_ps_uzbaigti_be_siuntu`; laiškas klientui su WC apmokėjimo nuoroda (`get_checkout_payment_url`; tekstas — `pakartotinis_laiskas()`, siūlo Claude);
 *   pradiniame `_ps_pakartotinis_id` + pastaba + įvykis `pakartotinis`. Apmokėjimo puslapyje tik Paysera (`pakartotinis_vartai`; svečio „ačiū“ be el. pašto
 *   patvirtinimo). Paysera callback → `update_status(processing)` (ne `payment_complete`!) → `pakartotinis_apmoketas()` (prior. 110, po variklių):
 *   naujas užsakymas → `completed` be WC laiškų (tema jį rašytų „išsiųstas“), temos kablys išrašo AVPN, darbalaukio laiškas „apmokėjimas gautas“ su PVM
 *   (v3.22: VISI WC laiškai pakartotiniam užsakymui — klientui „vykdomas“ / „įvykdytas“ / „laukiama“ ir administratoriui „naujas užsakymas“ — išjungti per
 *   `woocommerce_email_enabled_{id}` (`pakartotinis_wc_laiskai`), nes WC „vykdomas“ šaudo prior. 10, prieš `pakartotinis_apmoketas` (110); e1d testas rado 2 perteklinius)
 *   v3.23 (Raimis 09-05: pavedimas reikia): `pakartotinis_vartai` palieka Paysera + bacs; laiške su nuoroda — antras būdas „pavedimu“ su rekvizitais (`PAKART_BANKAS`,
 *   kaip temos `functions.php` „gautas“ laiške / IAPV; paskirtis „Pakartotinis siuntimas, užsakymas Nr. N“); klientui pasirinkus pavedimą WC bacs → `on-hold` (WC bacs sąskaitų
 *   nustatymuose nėra — „ačiū“ puslapyje rekvizitus rašo `pakartotinis_aciu_bankas`, `woocommerce_thankyou_bacs`); kortelėje, kol laukia, mygtukas „Apmokėta pavedimu“
 *   (GET `pakart_apmoketa` → `pakartotinis_pavedimas`: `payment_method=bacs`, `update_status(processing)` kaip Paysera callback → tas pats `pakartotinis_apmoketas` kelias).
 *   v3.24: WC apmokėjimo puslapis `on-hold` užsakymui sako „apmokėjimas negalimas“ (e3 W1B) — pakartotiniam `woocommerce_valid_order_statuses_for_payment` += on-hold
 *   (`pakartotinis_moketini_statusai`): klientas, pasirinkęs pavedimą, vis dar gali apmokėti Paysera per tą pačią nuorodą, kol darbuotojas nepažymėjo „Apmokėta pavedimu“.
 *   sąskaita; pradiniame pastaba + įvykis `pakart_apmoketa` → kortelėje atsiranda „Siųsti iš naujo“ (`grizta_is_naujo` leidžia tik kai pakartotinis
 *   apmokėtas arba pažymėta „Be mokesčio“ — mūsų / vežėjo kaltė, `_ps_pakartotinis_nemokamai`). Kortelė ir skydelis rodo būseną („laukia apmokėjimo —
 *   nuoroda išsiųsta …“ + „siųsti nuorodą dar kartą“ / „apmokėtas … — galima Siųsti iš naujo“). Naujas užsakymas darbalaukyje NERODOMAS
 *   (`faktu_sarasas` praleidžia `_ps_pakartotinis`; `auto_rusiuoti` grąžina false — į Surinkti / lapus / Venipak neina; `petshop-juosta` v1.6 skaičiuoja be jų).
 *   „Atšaukti — prekės grįžo į AV“ / „Be mokesčio“ atšaukia neapmokėtą pakartotinį užsakymą (be laiškų). Variklis neliestas (AV_Order / AV_Reduce / Partijos /
 *   Faktai ant paslaugos prekės: be likučio, be partijų — praleidžia; faktuose įprasta prekė).
 * v3.20 (S1616, spec §12.5 „Siunta grįžta“ sumos; Raimis 09-05: kortelėje, 3,99 nuo grįžusios dalies ar visos — „skirtumo nėra“, tik suma, pavadinimas
 *   „Pakartotinis užsakymas“): Klausimų kortelėje „Siunta grįžta“ rodomos suskaičiuotos sumos — „Klientui grąžink: [sumokėta] − 3,99 = X €“
 *   (visa siunta grįžta → užsakymo suma su pristatymu; dalis → tik grįžusios dalies prekės su PVM, pristatymas lieka su likusia dalimi — Claude prielaida)
 *   ir „Pakartotinis užsakymas: [įkainis] + 3,99 = Y €“ (`pristatymo_ikainis()`: pasirinkto pristatymo metodo instance `fee`/`fixed_cost` + PVM pagal
 *   užsakymo pristatymo PVM santykį (0,21 jei nemokamas); kitaip — kaip sumokėta užsakyme; kitaip 2,15 paštomatas / 3,99 kurjeris). `GRAZINIMO_MOKESTIS`
 *   = 3,99 su PVM (3,30 + PVM). „Atšaukti — prekės grįžo į AV“ / „Atšaukti tik grįžusią dalį“ dabar įrašo žymę `_ps_grazinti_rankomis` (suma X,
 *   `refund` 0) → po atšaukimo Klausimas „Grąžink klientui pinigus“ (kaip #4; galioja atšauktam), dialogai ir pastabos sako tikslią sumą. Naujų mygtukų nėra;
 *   „Pakartotinis užsakymas“ (naujas mažas užsakymas + apmokėjimo nuoroda) — kitas žingsnis.
 * v3.19.1 (S1616): po eilutės perrašymo `update_taxes()` prieš `calculate_totals(false)` — kitaip PVM lieka senas (e3d testas: #35414 19,49 € vietoj 19,04 €).
 * v3.19 (S1616, 5 etapas #4 „kiekiai“ — B modelis, spec §12.5; Raimis 09-05 „darom“): skydelio eilutės „q×“ tampa spaudžiamas, kai
 *   eilutė be užrakto (tas pats `lock` kaip keliui: nėra lipduko, tiekėjui nepranešta, partija ne užsakyta, nesurinkta) ir užsakymas
 *   apmokėtas → `Kiekis [n] × · Išsaugoti · Išimti` (POST `admin_post_ps_dl_kiekis`, nonce `ps_dl_kiekis_{id}`, lock, dialogas prieš).
 *   Eiga (`kiekis_vykdyti`): (1) likutis grįžta — AV per `likutis()` pagal `_ps_av_reduced_qty` (perrašomas), WC veidrodis per
 *   `wc_update_product_stock` pagal `_reduced_stock` (perrašomas), `_restock_refunded_items` += n (faktui „atsargos grįžo“);
 *   (2) WC dalinis refund su `line_items` (`refund_payment=false`, `restock_items=false`, refund meta `_ps_kiekis`) →
 *   `Petshop_Fakt_Grazinimai::rasyti` (prior. 35) rašo faktą pats; WC laiškai klientui — `laiskai_off`; nepavykus — likutis ir žymės
 *   atstatomi, niekas nekeista; (3) eilutė perrašoma (`set_quantity`, proporcingos sumos ir mokesčiai, `_ps_kiekis_keistas`,
 *   `calculate_totals(false)`, pristatymas nekinta) arba išimama (`remove_item`; išimti vienintelę = „Atšaukti“ — neleidžiama);
 *   kaupiamos Tiekimo partijos eilutė perdedama (`isimti_eilute` + `ideti_eilute`); grupės/planas perskaičiuojami; `_ps_surinkta`
 *   nuimama; (4) pastaba, įvykis `kiekis` (eilutė, prieš/po), žymė `_ps_grazinti_rankomis` → Klausimas „Grąžink klientui pinigus“
 *   (kortelė su suma ir „Grąžinta“ = `v=grazinta`; galioja ir įvykdytam / atšauktam užsakymui — `atviri()` juos įtraukia). Klientui
 *   laiško nėra. Partijos — rankomis (pastaba). „Pridėti prekę“ — vėliau per „naujas mažas užsakymas + apmokėjimo nuoroda“ (§12.5).
 *   WC savo refund'ą rodytų dukart (eilutė jau perrašyta) — darbalaukio filtrai paskyroje / laiškuose / sumoje nuima `_ps_kiekis`
 *   refund'us (`woocommerce_order_item_quantity_html`, `woocommerce_email_order_item_quantity`, `woocommerce_get_order_item_totals`,
 *   `woocommerce_get_formatted_order_total`). Dokumentuota pasekmė: WC `get_remaining_refund_amount()` po keitimo mažesnis už realų —
 *   WC admin refund'ų nenaudojam; kreditinė (5 etapas „Sąskaita“) skaičiuos iš savų sumų (`_ps_grazinti_rankomis`, faktai).
 * v3.18.1 (S1615, kosmetika — S1614 radinys): sąrašo 2 stulpelis „Prekės pagal kelią“ nebeskaičiuoja eilučių su `_ps_issiusta` (jau išsiųsta
 *   ankstesne AV siunta) ir `_ps_atsaukta` (dalis atšaukta) — #35438 rodė „2 vnt. … +1“, pakuoti reikia 1; pill ir skydelis jau rodė teisingai.
 *   Jei po filtro eilučių neliktų (teoriškai) — rodomos visos, kaip anksčiau.
 *
 * v3.18 (S1614, RAIMIO SPRENDIMAI 09-04 vakaras — keičia v3.16/v3.17 prielaidas): 1) „Redaguoti“ — laiško klientui NĖRA (varnelė išimta; jei reikia —
 *   darbuotojas rašo pats); 2) po BET KURIO užregistruoto lipduko (AV, tiekėjo, LP) „Redaguoti“ neveikia (pilkas, „rankiniu būdu“) — įspėjimai
 *   išimti; 3) atkrenta (laiškas tiekėjui eina po lipduko); 4) klientui atšaukta dalis NERODOMA (`kliento_siuntos()` be `atsaukta`,
 *   `petshop-kliento-siuntos.php` grąžinta į v1.2); 5) grįžusi tiekėjo dalis VISADA → AV, standartinė procedūra (Surinkti AV → Lipdukas → Kurjeris
 *   paėmė, AV manifestas) — (b) variantas, `_ps_dalys_is_naujo`, „Lipdukas [T] iš naujo“ išimti. Kai AV siunta JAU IŠSIŲSTA: jos eilutės gauna
 *   `_ps_issiusta` (laikas|nr) — `faktai()` jas išima iš AV dalies (žingsnelių nėra, užraktas „išsiųsta MM-DD (siunta N) — NEPAKUOK“), senoji siunta
 *   → `_ps_dalys_baigtos.av[]` {nr[], laikas, prekes[]} (klientui paskyroje ir „n iš N“ lieka kaip išsiųsta/pristatyta), AV numeriai → senos, AV dalis
 *   iš naujo iš grįžusių prekių. RIBOTUMAS (variklis, Raimis sutiko): `petshop-av-sheets.php` lapas spausdina VISAS `_ps_source=av` eilutes — jame bus
 *   ir jau išsiųstos; todėl toks užsakymas IŠSKIRIAMAS: sąraše raudona kairė juosta + pill „⚠ lape ir jau išsiųstos prekės — nepakuok: …“,
 *   skydelio „Dabar“ — tas pats sakinys (kol AV dalis vėl neišsiųsta). Laiškas klientui po naujos siuntos — tik grįžusios prekės.
 * v3.17 (S1614, 5 etapas #3 — Raimis 09-04: „visi tokie užsakymai papuola į Klausimus, darbuotojas turi turėti dideles galimybes ir jis nusprendžia, ne sistema“):
 *   DALINIS „SIUNTA GRĮŽTA“. Užraktai („AV siunta jau išsiųsta“ / „kita siunta jau išsiųsta“) nuimti. Dalių modelis nekeistas (K4) — dalis išlaiko tapatybę:
 *   „Siųsti iš naujo“ tik grįžusią dalį: AV dalis — kaip v3.11.1 (numeriai → senos, Surinkti AV, naujas lipdukas); tiekėjo dalis, kai AV dalis dar
 *   NEišsiųsta ir neatšaukta — sujungiama į AV (v3.11.1, Raimio spr. 5); tiekėjo dalis, kai AV jau išsiųsta / atšaukta / jos nėra — dalis LIEKA tiekėjo
 *   dalimi (kelias, `perduota` nekeičiami), tik siunta pakeičiama: numeriai → senos, žymė `_ps_dalys_issiusta[T]` nuimama, likutis +q −q = 0, žymė
 *   `_ps_dalys_is_naujo[T]` (V13 „[T] vėluoja“ ją gerbia), skydelyje „Lipdukas [T] iš naujo“ (`vp_reg` sandelis=T, perreg) → Paruošta siųsti „[T] išsiuntė“
 *   / Venipak sekimas; kita dalis lieka kaip yra. „Atšaukti tik grįžusią dalį“ (kai yra kitų aktyvių dalių): dalies eilutės gauna `_ps_atsaukta`
 *   (laikas|kas|nr) — `faktai()` jas išima iš dalių (av_side/tiesiai), žingsnelių nėra, užraktas „atšaukta“; likutis: tiekėjo eilutės +q į `_own_stock_qty`
 *   (kaip v3.11.1), AV eilutės — variklio `Petshop_AV_Reduce::grazinti` veidrodis eilutės lygiu (`likutis()` +q, `_ps_av_reduced_qty` → 0, senas kiekis
 *   `_ps_atsaukta.rq`, kad vėlesnis pilnas atšaukimas negrąžintų dukart); `_ps_dalys_atsaukta[dalis]`; užsakymo statusas: completed lieka, processing →
 *   completed tik jei visos likusios dalys išsiųstos; WC dalinis grąžinimas ir pinigai — rankomis (pastaba). Kai kitų aktyvių dalių nėra — pilnas
 *   atšaukimas kaip v3.11.1 (cancelled, variklis grąžina AV). Klientui: paskyroje „Siuntos“ atšaukta dalis — „Atšaukta“ (`kliento_siuntos()` busena
 *   `atsaukta`, `petshop-kliento-siuntos.php` v1.3), laiškas nesiunčiamas; „Išsiųsta n iš N“ — atšauktos dalys neskaičiuojamos. Variklis neliestas.
 *   v3.16.1 (kartu): „Redaguoti“ įspėjimas ir tiekėjo daliai su registruotu numeriu (S1614 e4 radinys — #35442 VF V…056 be įspėjimo).
 *   v3.17.1: AV siuntos heuristika (`$av_side && ! $tiesiai && turi_siunta()` — plugino meta = AV siunta) skaičiuoja tiesiai dalis ĮSKAITANT atšauktas —
 *   atšaukus tiekėjo dalį plugino meta tebelaiko tiekėjo numerį ir AV dalis rodėsi „siunta jau užregistruota“ / „Kurjeris paėmė“ (S1614 e6z, #35421).
 * v3.16 (S1614, 5 etapas #2 — Raimis 09-04: „klientai prirašo nesąmoningų adresų — kurjeriui, ne tik paštomatui“; spec §6c): „REDAGUOTI“ SKYDELYJE BE WC —
 *   pristatymo adresas (gavėjas, gatvė, miestas, pašto kodas) / Venipak paštomatas (`venipak_store_order_pickup()`, sąrašas `venipak_fetch_pickups('LT')`) /
 *   LP paštomatas (`_woo_lithuaniapost_lpexpress_terminal_id` + `_woo_lithuaniapost_lpexpress_terminal` plugino formatu, sąrašas plugino lentelė
 *   `woo_lithuaniapost_unisend_terminals` LT) + telefonas (billing ir shipping — abu pluginai skaito billing). Pristatymo BŪDAS nekeičiamas (kaina/PVM — vėliau).
 *   Galima, kol bent viena dalis neišsiųsta ir užsakymas neuždarytas; įspėjimai, kai AV siunta jau užregistruota („Lipdukas iš naujo“), LP siunta sukurta,
 *   tiekėjui jau užsakyta („parašyk tiekėjui“) — sprendžia žmogus. Išsaugojus: pastaba prieš/po, įvykis `redaguoti`, Venipak/LP klaidos meta nuimama
 *   (statusas „error“ → tuščias; `lp-parcel-failed` → `lp-parcel-await`), klientui laiškas „Jūsų užsakymo Nr. N pristatymo duomenys pakeisti“ — varnelė
 *   (numatyta ON, spec §6c; tekstas — Claude prielaida, Raimiui tvirtinti). Veiksmas `admin_post_ps_dl_redaguoti` (POST, nonce `ps_dl_red_{id}`),
 *   sąrašai `wp_ajax_ps_dl_vietos`. V14 (darbalaukio lygiu, variklio `klausimas()` neliestas): `faktai()` → Klausimas „Siuntos sukurti nepavyko“, kai
 *   `venipak_shipping_order_data.status=error` (tekstas lietuviškai) arba LP meta `lp-parcel-failed` (`_woo_lithuaniapost_parcel_create_error`);
 *   kortelėje „Taisyti adresą“ → skydelis su atverta forma; po išsaugojimo Klausimas dingsta, lipdukas registruojamas iš naujo.
 * v3.15 (S1614, 5 etapas #1 — Raimio idėja 09-04, sutarta): MYGTUKAS „PRANEŠTI KLIENTUI APIE VĖLAVIMĄ“ — Klausimo kortelėje „[T] vėluoja“ IR skydelyje
 *   (sąlyga: apmokėtas, neuždarytas, bent viena dalis dar neišsiųsta, žymės `_ps_velavimo_laiskas` nėra). Siunčia TĄ PATĮ suderintą laišką (tema „Jūsų
 *   užsakymą Nr. N dar komplektuojame“, tekstas v3.13 žodis į žodį) per `velavimo_laiskas($o, $siandien, $u)` — rankiniu būdu praleidžiami tik ≥3 d. d.
 *   ir Klausimų sargai (darbuotojas sprendžia), kiti (žymė, apmokėta, būsena, dalis neišsiųsta, el. paštas) lieka. Vieną kartą: po to ta pati žymė,
 *   pill „klientui pranešta apie vėlavimą …“, mygtuko nebėra. Įvykis `velavimo_laiskas` kanalas web, kas — darbuotojas; pastaboje „(darbuotojas X)“.
 *   Veiksmas `admin_post_ps_dl_veiksmas` `v=velavimas` (nonce `ps_dl_velavimas_{id}`, lock). Dialogas su laiško tekstu prieš siuntimą. Automatinis 14:00 nekeistas.
 * v3.14 (S1613, 4 etapas #4a V13 — Raimis 09-04 sutiko, darbalaukio lygiu): „TIEKĖJAS VĖLUOJA“ TIKSLIAU, PAGAL DALIS. Variklio sargas
 *   `petshop-dropship-sargas.php` v1.0 ir jo žymė `_ps_sla_velavimas` NELIEČIAMI (Rytinė eiga ją skaičiuoja) — sargas žiūri į užsakymo lygio
 *   `_ps_dropship_sent` (>24 val.) ∧ processing, dalių nemato: kaltina tiekėją, net kai tiekėjas jau išsiuntė ir laukiama AV (#35421), o užsakymas
 *   Klausimuose dingsta iš Surinkti AV. Taisyklė `faktai()` (`$f['veluoja']`): vėluoja = tiekėjo „tiesiai“ dalis, kuriai užsakymas išėjo prieš
 *   >24 val. (`_ps_dropship_sent_src[t]` = `dalys[t]['kada']`, `Petshop_AV_Dropship::perduotos()`) ir `issiusta` nėra. Bent viena → Klausimas
 *   „[T] vėluoja — užsakyta prieš N val., siunta neišėjo. Paskambink [T].“ (vardai iš ZODYNAS), užsakymas KARTU lieka Paruošta siųsti su
 *   „[T] išsiuntė“ (mygtukas nenuimamas — „wait“ žingsnis). Variklio tekstas „Tiekėjas vėluoja“ visada pakeičiamas darbalaukio: kai vėluojančių dalių
 *   nėra (tiekėjas išsiuntė, laukia AV; arba dar neužsakytas) — Klausimo nėra. Dingsta pats, kai dalis pažymima išsiųsta (darbuotojas ar cron),
 *   „Laukti“ kortelėje nebesiūlomas. „Kartu su Dropshipping iš [T]“ (kons) — tas pats `ps_dropship_send`, `_ps_dropship_sent_src` rašo; „veža į AV“
 *   (Tiekimo partija) — kitas mechanizmas, ne šis. Darbalaukio klausimai „Siunta grįžta“ / „Prekė be sandėlio“ tikrinami PO V13 (kad variklio
 *   nuimtas tekstas jų neužstotų). Vėlavimo laiškas (#4) praleidžia užsakymus Klausimuose — su V13 „[T] vėluoja“ irgi (Raimio taisyklė; klausimas jam).
 *   v3.14.1: Klausimo kortelės žymė trumpa „ZB vėluoja“ (buvo visas sakinys mažosiomis — e9 ekrano nuotrauka), tekstas — pilnas sakinys.
 *   v3.14.2: vėlavimo laiško tema „Jūsų užsakymą Nr. N dar komplektuojame“ (Raimis 09-04), antraštė viduje — tas pats sakinys; tekstas nekeistas.
 * v3.13 (S1613, 4 etapas #4, log S1611 sprendimas 3 — Raimis 09-04): VĖLAVIMO LAIŠKAS — AUTOMATINIS. Cron `ps_velavimo_laiskai` — vienkartinis
 *   įvykis, kas run'ą perplanuojamas į kitą 14:00 Vilnius (`wp_timezone()`, DST-saugus; `cron_planuoti` `init` 30 užtikrina, kad suplanuotas).
 *   Ne darbo dieną (Sa/Se, LT šventės `LT_SVENTES` + Velykų pirmadienis pagal Grigaliaus algoritmą `velykos()`) — nieko nedaro. Sąlyga užsakymui:
 *   apmokėtas, tarp apmokėjimo dienos ir šiandienos ≥3 PILNOS darbo dienos (`pilnos_darbo_dienos()`, abi kraštinės neskaičiuojamos: Pr → Pn 14:00),
 *   bent viena dalis be `_ps_dalys_issiusta`; praleidžiam neapmokėtus, atšauktus, uždarytus, Klausimuose (`$f['kl']` — ir variklio „Tiekėjas vėluoja“),
 *   jau gavusius (žymė `_ps_velavimo_laiskas`). Vienas laiškas užsakymui — Raimio tekstas žodis į žodį (dalis išsiųsta → „Likusių … prekių“);
 *   tema „Jūsų užsakymą Nr. N dar komplektuojame“ (Raimis 09-04, v3.14.2; antraštė viduje — tas pats). Žymė + pastaba + įvykis `velavimo_laiskas` (kanalas cron); eilutėje pill
 *   „klientui pranešta apie vėlavimą 09-04 14:00“, skydelio „Dabar“ — tas pats sakinys; į Klausimus NEkeliam. Variklio `_ps_sla_velavimas` neliesta.
 *   Būsena — opcija `ps_velavimo_laiskai_paskutinis`. Testams — `velavimo_laiskai($dabar_ts, [ids])` (simuliuota diena, be perplanavimo/opcijos).
 *   v3.13.1: kandidatų SQL — HPOS `wc_orders_meta` PK yra `id`, ne `meta_id` (LEFT JOIN „be žymės“ per `m.order_id IS NULL`; e5d radinys — kandidatų 0).
 *   v3.13.2: HPOS `wc_orders` NETURI `date_paid_gmt` (jis `wc_order_operational_data`) — sąlyga išimta iš SQL, apmokėjimą tikrina `is_paid()` (e6d radinys).
 * v3.12 (S1613, 4 etapas #2, STARTAS 09-04): LP EXPRESS SEKIMAS — tame pačiame cron'e `ps_venipak_sekimas` (kas 30 min). Recon (S1613 e1r/e2r): LP
 *   pluginas 4.0.32, kai abu nustatymai „Never“, užsakymo STATUSO NEKEIČIA (vienintelis `update_status('completed')` — tik kai nustatymas sutampa;
 *   `wc-lp-*` statusai registruoti, bet niekada neskiriami) — rašo TIK meta `_woo_lithuaniapost_shipping_status_value` (lipdukas → `lp-label-created` /
 *   `lp-courier-await` / `lp-courier-called`; plugino cron kas val. iš LP API į savo lentelę `woo_lithuaniapost_tracking_status` → `lp-on-the-way`,
 *   `lp-delivered`; atšaukus — `lp-cancelled` ir numeris nuimamas). Darbalaukis skaito TIK meta (LP API nekviečia): kandidatai — užsakymai su
 *   `_woo_lithuaniapost_barcode` (`lp_kandidatai()`); `lp-on-the-way` / `lp-delivered` → „Kurjeris paėmė“ per `issiusta($o, null, true, 'av', 'lp')`
 *   (tas pats laiškas klientui, `kas=LP Express`); `lp-delivered` → „Pristatyta“ paskyroje (įrašas `_ps_venipak_sekimas[nr]` su `k=9`, `vez=lp`, be laiško);
 *   data — plugino lentelės `updated`, jei yra, kitaip pastebėjimo laikas. Skydelyje prie numerio „— LP Express: keliauja gavėjui, 09-04 13:10“.
 *   `kliento_siuntos()` „pristatyta“ — ir LP daliai. „Grįžta“ LP būsenos nėra — Klausimo nekeliam. Dev testas — meta rašoma tiesiogiai (plugino lentelė tuščia,
 *   jo cron mūsų testo neliečia). Radinys V14 (variklis): `Petshop_Desk::klausimas()` „Siuntos sukurti nepavyko“ žiūri į užsakymo STATUSĄ `lp-parcel-failed`,
 *   kurio pluginas neskiria — LP klaida (#35416 `_woo_lithuaniapost_parcel_create_error`) Klausimu netampa; neliesta, Raimiui.
 * v3.11.1 (S1612, 4 etapas #3, log S1611 sprendimas 5 — Raimis 09-04): KLAUSIMAS „SIUNTA GRĮŽTA“ — DU MYGTUKAI, sprendžia darbuotojas, be sumų.
 *   „Siųsti iš naujo“ (`grizta_is_naujo`): prekės jau AV → siunta ruošiama IŠ AV (net buvusi tiekėjo dropship): grįžusios dalies eilutės → kelias „Iš AV“
 *   (`_ps_source=av`, `_ps_av_reduced_qty=q`, planas + grupės perskaičiuojami); likutis dropship eilutėms +q (grįžo) −q (išeina) = 0 per
 *   `Petshop_AV_Stock` (prekė tampa AV+tiekėjas su 0; vėlesnis atšaukimas grąžina +q — variklio `grazinti`), AV eilutėms nieko; seni numeriai
 *   (grįžusios dalies + esami AV) → `_ps_siuntos_senos` (darbalaukio žymė — `siuntos()` jų nerodo, `av_siunta` be jų; variklio registras
 *   `_ps_siuntos` neliečiamas — naujas AV lipdukas jį perrašo per `perreg`); `_ps_dalys_issiusta[dalis]` ir `[av]` nuimamos, `_ps_surinkta` nuimama;
 *   įvykdytas → `processing` be WC laiškų; klientui paskyroje dalis vėl „Ruošiama“, po naujo lipduko ir paėmimo — vėl „Išsiųsta“ (laiškas).
 *   Adresas tas pats (keitimas — 5 etapo „Redaguoti“). PRIELAIDA: grįžusi tiekėjo dalis, kai AV siunta JAU išsiųsta — dalinis persiuntimas, 5 etapas → neleidžiama.
 *   „Atšaukti — prekės grįžo į AV“ (`grizta_atsaukti`): dropship eilutėms +q į `_own_stock_qty` (`Petshop_AV_Stock::increase` — sukuria lauką, prekė tampa
 *   AV+tiekėjas), AV eilutėms nieko (variklis `grazinti` ant `woocommerce_order_status_cancelled` grąžina pats — nedubliuojam); `cancelled` be WC laiškų.
 *   Pinigai — rankomis. PRIELAIDA: kai kita dalis jau išsiųsta / pristatyta — dalinis grąžinimas (5 etapas) → „Atšaukti“ nerodomas, tik „Siųsti iš naujo“.
 *   Abu: `_ps_siunta_grizta[dalis]` nuimama (Klausimas išnyksta), pastaba + įvykis `grizta_is_naujo` / `grizta_atsaukti`.
 *   Taip pat: suma skydelyje / Klausimų kortelėse buvo „12,02&nbsp;&euro;“ (dviguba esc nuo C8) — `html_entity_decode`.
 * v3.11 (S1612, 4 etapas #1, spec §12.2 „Automatinis“ + log S1611 sprendimas 5): VENIPAK SEKIMO CRON `ps_venipak_sekimas` kas 30 min (`ps_30min`).
 *   Šaltinis — `_ps_siuntos` registras (`Petshop_Siuntos::sarasas()`), API `tracking.venipak.com/api/v1/events?pack_no=` (viešas, be autentifikacijos;
 *   recon e1/e2/e3: įvykiai chronologiškai, `pack_status` int + `pack_status_text`). Kodai PATVIRTINTI iš dviejų realių siuntų (Raimis 09-04):
 *   0 At sender · 1 On route to terminal · 2 At terminal · 3 On route to receiver · 6 At pickup point waiting for receiver · 9 Delivered;
 *   kodai 4/5/7/8 — nežinomi: tik įrašomi ir rodomi skydelyje, veiksmo nėra (sistema prisimena, žmogus sprendžia). Paskutinis kiekvieno numerio
 *   įvykis — vienoje meta `_ps_venipak_sekimas` {nr:{k,t,e,d,v,n,dalis,tikr}}. Veiksmai: pirmas kodas iš {1,2,3,6,9} daliai, kuri dar nepažymėta
 *   išsiųsta → `issiusta($o,null,true,$dalis,'venipak')` (tas pats laiškas klientui, be darbuotojo); 9 visiems dalies numeriams → dalis „Pristatyta“
 *   (`kliento_siuntos()` trečia būsena — paskyroje; laiško nesiunčiam — kurjerio SMS); įvykio tekstas su „return“/„sender“ (k≠0) → `_ps_siunta_grizta`
 *   [dalis]{nr,t,e,d,kada} → Klausimas „Siunta grįžta“ (darbalaukio lygiu — `Petshop_Desk::klausimas()` neliestas; įvykdytas užsakymas su tokia žyme
 *   įtraukiamas į Klausimų eilę). Sprendimo mygtukai „Siųsti iš naujo“ / „Atšaukti — prekės grįžo į AV“ — kitas žingsnis (4 etapo #3).
 *   Testams: `apply_filters('ps_venipak_ivykiai', null, $nr)` — jei grąžina masyvą, API nekviečiamas. Būsena `ps_venipak_sekimas_paskutinis` (opcija).
 * v3.10.6 (S1611, Raimis 09-04): LIPDUKAI PRIVALOMI visoms siuntoms klientui (AV ir tiekėjų dropship); „be lipdukų“ galimas TIK tiekėjo
 *   užsakymui į AV (prekės atkeliauja įvairiai). Todėl: Dropshipping kortelės mygtukas „Užsakyti be lipdukų“ IŠIMTAS (variklio
 *   `ps_dropship_send` parametras `be_lipduku` lieka — UI jo nebesiūlo); §18.3 sargo apėjimas `_ps_uzbaigti_be_siuntu` (v3.10.1) IŠIMTAS;
 *   „[T] išsiuntė“ / „Kurjeris paėmė (viską)“ be registruoto siuntos numerio — NELEIDŽIAMA („siuntos numerio nėra — pirma lipdukas“).
 *   Laiško „be numerio“ tekstas lieka tik tekstiniu saugikliu.
 * v3.10.5 (S1611, Raimis 09-04, #5b prielaida 4 = B): kol mišrus užsakymas NEsurūšiuotas (`_ps_rusiuota` tuščia, dalių >1, nė viena
 *   neišsiųsta), `kliento_siuntos()` klientui grąžina VIENĄ „Siunta — Ruošiama“ su visomis prekėmis, be numerio — kad siuntų skaičius
 *   klientui nesikeistų atgal po rūšiavimo „viską į AV“. Prielaidos 1, 2, 3, 5 — Raimio patvirtintos 09-04.
 * v3.10.4 (S1610, #6 papildymas — Raimis 09-03 naktis): LP Express siuntos numeris (LP plugino meta `_woo_lithuaniapost_barcode` — patikrinta
 *   plugino kode, recon e10_run1r) patenka į `siuntos()` AV dalį, kai `_ps_siuntos` registre AV numerių nėra → laiškas ir paskyra rodo
 *   „Siuntos numeris (LP Express)“ + „Sekti siuntą“ (post.lt) kaip Venipak. Registras `_ps_siuntos` NErašomas (variklis neliestas).
 * v3.10.3 (S1610, #5b — Raimio sprendimai 09-03 naktis): `kliento_siuntos($o)` VIEŠA — siuntų sąrašas klientui (dalys kaip `faktai()`: AV + kiekvienas
 *   „tiesiai“ tiekėjas; būsena tik Ruošiama/Išsiųsta, be datos; tiekėjų vardų NĖRA; išsiųstos pirma pagal laiką — kaip laiško „Išsiųsta n iš N“) —
 *   vienas tiesos šaltinis laiškui, paskyros blokui (`petshop-kliento-siuntos.php` tik piešia) ir 4 etapo cron'ui. Laiške: statinė juostelė
 *   IŠIMTA (klaidina); po „Sekti siuntą“ — „Siuntos kelią sekite paspaudę „Sekti siuntą““, registruotam klientui — nuoroda į paskyros
 *   užsakymą (`paskyra/uzsakymas/N/`). Neapmokėtam/atšauktam užsakymui `kliento_siuntos()` — tuščia (mano prielaida: „Ruošiama“ ten klaidintų).
 * v3.10.2: `amzius()` — „prieš 3 val.“ ką tik atėjusiam užsakymui (radinys e6_visi): `current_time('timestamp')` yra Vilniaus „vietinis“ epoch,
 *   o `WC_DateTime::getTimestamp()` — tikras UTC → skirtumas +3 val. Dabar lyginama su `time()`.
 * v3.10.1 (testas #35774, VF+Prins „be lipdukų“): paskutinės dalies laiškas išeina PO `completed` (ne prieš — jei sargas sustabdo, klientas
 *   negauna „visas užsakymas išsiųstas“); §18.3 sargo apėjimas `_ps_uzbaigti_be_siuntu=1` rašomas tik kai darbuotojas pažymėjo VISAS dalis
 *   išsiųstomis, o registruotų siuntų mažiau nei `_ps_shipments` (dropship „be lipdukų“ — siunta pas mus neregistruojama niekada); pakartotinis
 *   „[T] išsiuntė“, kai visos dalys jau pažymėtos, bet užsakymas ne completed — bando užbaigti iš naujo (buvo aklavietė „jau pažymėta“, eilių 0).
 * v3.10 (3 etapas #5, spec §12 „Sekimo laiškai klientui“, Raimis 09-03 vakaras): laiškas klientui PO KIEKVIENOS siuntos, ne vienas kai
 *   visos — „Išsiųsta 1 iš 2 siuntų“ (kita keliaus atskirai) → „Išsiųsta 2 iš 2“; vienos siuntos užsakymui — „Užsakymas išsiųstas“.
 *   Laiške: sekimo juostelė (Užsakymas gautas · Apmokėta · Ruošiama · Išsiųsta · Pas kurjerį · Pristatyta, dabartinis — Išsiųsta),
 *   siuntos numeris + „Sekti siuntą“ (Venipak `venipak.com/lt/tracking/track/{nr}`, LP `post.lt/siuntu-sekimas?parcels={nr}`), šios siuntos
 *   prekės, „dar keliaus“ prekės. Viena funkcija `siuntos_laiskas()` — ją kvies ir 4 etapo Venipak cron („Picked up“); `issiusta()` vieša su
 *   `$kanalas`. Žymė `_ps_dalys_issiusta[dalis].laiskas` (dublio sargas), `_ps_sekimo_siusta` — paskutinio laiško laikas. Dialoge varnelė
 *   „Pranešti klientui“ prie kiekvienos siuntos (buvo tik paskutinei). Senas vieno laiško langas `ps-siuntos-laiskas` lieka Raimiui.
 * v3.9 (Raimis 09-03 / 3 etapas #4): neapmokėtas užsakymas — Gauti + Neapmokėti, ne Klausimai; skydelyje prekei be tiekėjo tiekėjo keliai
 *   nerodomi (buvo pilki „Tiekėjas siunčia klientui / veža į AV“); variklio pranešimai verčiami į žodyną (AV/VF/ZB, „užsakymas tiekėjui #n“).
 * v3.8.1: T3 — Neapmokėtų riba 300 su įspėjimu juostoje; `window.psDlAtnaujinti` (V11 patikrai).
 * v3.8 (3 etapas #3 — audito likučiai): K2 antra pusė — skydelis per `wp_ajax_ps_dl_skydelis` (eilutėse tik `data-sk`, ne JSON), kešuojama
 *   eilutėje; V11 — tylus atnaujinimas kas 60 s (fetch → keičiamas tik `.dl-main`, slinktis ir pažymėta eilutė lieka; praleidžiama, kai pelė
 *   virš sąrašo, laukas fokuse, skydelis/dialogas atviri), lapo atidarymas → tas pats; V9 — „Visi“ po 50 su „‹ ankstesni · 1–50 iš N · kiti ›“,
 *   „Išsiųsta šiandien“ iš `_ps_dalys_issiusta` laiko arba `date_completed` (ne `date_modified`).
 * v3.7 (Raimis 09-03 vakaras): 1) tiekėjui TIK vienas laiškas — kai laukia Dropshipping užsakymų, „Laukiam“ kortelėje vienintelis mygtukas
 *   „Kartu su Dropshipping iš [T] (n prek.)“ (sudeda į užsakymą tiekėjui, laiškas išeina Dropshipping kortelėje); atskiras „Užsakyti iš [T]
 *   į AV“ tik kai Dropshipping užsakymų iš to tiekėjo nėra. 2) galiojimas prie „Gauta“ — neprivalomas, „(jei lieka sandėlyje)“.
 *   4) varnelė prie kiekvieno užsakymo Dropshipping ir Laukiam kortelėse — nuėmus, užsakymas į laišką nepatenka (skaičius mygtuke persiskaičiuoja).
 * v3.6.1: skydelio „kodėl“ gautai prekei — „Gauta į AV iš ZB (užsakymas tiekėjui #15) — siunčiam iš AV“ (buvo tiekėjo pasiūlymo tekstas).
 * v3.6 (3 etapas #1, STARTAS 2026-09-04): eilė „Laukiam iš tiekėjų“ = kortelės per tiekėją. A) užsakyti užsakymai tiekėjui (H1–H3) —
 *   prekių sąrašas su „Gauta“ kiekiais/galiojimu ir mygtukas „Gauta“ (variklio `priimti()`); ZB — „Kopijuoti“. B) „Užsakyti iš [T] į AV“ —
 *   kaupiama partija + dar nesudėtos „veža į AV“ eilutės, pristatymas/svoris/dėžės, adresatai, „Peržiūrėti laišką“; „Kartu su
 *   Dropshipping (n užs.)“ (G4) — sudeda į partiją ir veda į Dropshipping kortelę su varnele „+ į AV“. Savas `admin_post_ps_dl_tiekimas`
 *   sudeda eilutes (kaip variklio `kons`) ir paleidžia `admin_post_ps_tiekimas` — variklis ir žurnalas nekeisti; grįžimas per `grizti_cia()`.
 *   Tiekimo langas darbuotojui nebereikalingas (Raimiui lieka): `kons`/`tiekimas` mygtukai, skydelio nuoroda ir Rytinės eigos „Gavimai“
 *   veda į šią eilę. Žodynas: „partija“ → „užsakymas tiekėjui #n“ visur darbuotojui.
 * v3.5 (Raimis): Dropshipping kortelėje kiekvienoje eilutėje „Lipdukas“ su dialogu (dėžių skaičius tam klientui, adresas,
 *   svoris) — savas `lipdukas` veiksmas su sandelis=tiekėjas; jei pristatymas ne Venipak (pvz. flat_rate) — įspėjimas vietoj
 *   mygtuko; „+ į AV“: kai atviro užsakymo tiekėjui nėra — nuoroda į Tiekimą sukurti. Eilė pervadinta „Dropshipping“.
 * v3.4 (Raimis): prekės miniatiūra prie pavadinimo sąraše (grupei — iki 3) ir skydelyje; kliento pastaba vėl geltona dėžė (kad nepamirštų).
 * v3.3 (Raimis): „Visi“ — visa eilutė nuspalvinta pagal būseną (šviesus fonas + spalvota kairė juostelė), kad greičiau rūšiuoti akimis.
 * v3.2 (Raimis): taisyklė — pati išrūšiuoja TIK vieno sandėlio užsakymus; 2+ sandėliai (su AV ar be) → Neišrūšiuoti su
 *   sistemos pasiūlymu; eilutėje „Auto“ = surūšiuoti kaip siūlo, neatidarant (nerodomas, kai yra kliento pastaba ar trūkumas);
 *   pasiūlymas „veža į AV“, kai to tiekėjo užsakymas į AV jau atviras (kaupiama/užsakyta) — prekė atvažiuos ir taip.
 * v3.1 (Raimis, `dokumentai/ZODYNAS_DARBUOTOJUI_v1.md`): sandėliai trumpai (AV/VF/ZB/Prins/Belacor/Quattro/Ambrosia); eilės Gauti ·
 *   Neišrūšiuoti · Laukiam iš tiekėjų · Surinkti AV · Užsakyti iš tiekėjų · Paruošta siųsti · Klausimai · Neapmokėti · Visi;
 *   keliai „Iš AV · VF siunčia klientui · VF veža į AV“; mygtukai „Užsakyti iš VF (n užs.)“ (laiškas — tik peržiūra),
 *   „Užsakyti iš Prins į AV“, „Suvesti į ZB / Suvesta“, „Kurjerio sąrašas“, „Sekimo numeriai klientui“, „Istorija“; „Gauti“ =
 *   darbuotojas dar neatidarė (`_ps_matyta` per AJAX atidarius skydelį), eilutėje N + amžius „prieš 40 min / vakar / prieš 3 d.“;
 *   Visuose — būsenos žymė (Neapmokėtas · Neišrūšiuotas · Ruošiamas · Paruoštas · Išsiųstas · Įvykdytas · Atšauktas · Klausimas).
 * v3.0 (Raimis: „su 10 užsakymų — košmaras, noriu lengviau ir paprasčiau“): nuimti sluoksniai — juostos kelias paslėptas,
 *   nėra legendos, datos, filtrų (už „Filtrai ▾“), paaiškinimo apačioje, takelio sąraše (jis skydelyje); „Šiandien atėjo“ — ne
 *   siena, o pirma eilė „Šiandien (n)“ su stulpeliu „Kur dabar“; eilutė = 3 stulpeliai: Užsakymas (nr, laikas, klientas,
 *   pastaba) · Prekės pagal kelią („Avesa sandėlis · 3 prek. — Animonda…, +2“) · Kitas žingsnis. Viskas kita — skydelyje.
 * v2.4 (Raimis: „nekas neaišku, kad užsakymas įkrito, kur jis dingo — atsekamumas 0“): juosta „Šiandien atėjo (n)“ virš eilių
 *   ir rytinėje eigoje — kiekvienas šiandienos užsakymas su laiku, klientu, KUR DABAR (eilė) ir kitu žingsniu, atidaro skydelį;
 *   po kiekvieno veiksmo pranešimas sako, kur užsakymas nukeliavo („→ dabar: Laiškai tiekėjams · Laiškas Vetfarmas“);
 *   skydelio antraštėje „Dabar: …“.
 * v2.3 (Raimis: senoje Rytinėje eigoje „Mišrūs → Atidaryti“ vedė į WC): `view=rytas` dabar NAUJAS vedimas per eiles be
 *   užrakto (D1/D2): 1 Surūšiuoti · 2 Lipdukai ir laiškai tiekėjams · 3 Užsakyti iš tiekėjų · 4 Surinkti Avesoje · 5 Lipdukai
 *   Avesai · 6 Išsiųsta · 7 Gavimai · 8 Klausimai — gyvi skaičiai iš tų pačių faktų, žingsnis veda į eilę. Senas vaizdas tik su
 *   `senas=1` (LP Express lipdukams iki T-0 — J1). Iš darbuotojo lango į WC kelių nebėra.
 * v2.2: V1 — prekė be sandėlio → Klausimas „Prekė be sandėlio“, skydelyje leidžiama „Avesa sandėlis“ rankiniu būdu (be likučio,
 *   žurnale „rankinis“). V5 — `_ps_surinkta` (laikas|kas) rašoma per `admin_post_ps_desk_veiksmas` (lapai) + „Atšaukti surinkimą“
 *   skydelyje. K2 — atviri tik processing/on-hold/LP (riba 1000 + įspėjimas „rodomi ne visi“), Neapmokėti atskira užklausa
 *   (pending/failed ≤ 14 d.), žurnalas į skydelį per `wp_ajax_ps_dl_zurnalas` (data-json lengvesnis).
 * v2.1 (AUDITAS_UZSAKYMU_LANGAS_2026-09-03): K1 — po Gauta (K2 `_ps_source=av`) `_ps_kelias=i_av` nebeblokuoja: rodomas kelias
 *   = f(_ps_source, partija), i_av galioja tik kol source≠av; tiekėjas iš „parsivežta iš X“. K4 — dalies būsena
 *   `_ps_dalys_issiusta{sandelis:{laikas,kas,kanalas}}`: „Kurjeris paėmė (Avesa)“ / „[T] išsiuntė“ atskirai, `completed`
 *   + sekimo laiškas — kai visos dalys. K3+V7 — „Lipdukas“ per dialogą (dėžės, paštomatas/adresas, svoris) → savas
 *   `lipdukas` veiksmas (įrašo dėžes) → variklio `vp_reg`. V8 — „Surinkti visus (n)“ / „Lipdukai visiems (n)“. V13 — „Užsakyti iš
 *   Ambrosia ir Vetfarmas (2)“. V6 — atšaukimo dialogas įspėja apie registruotas siuntas / išsiųstus laiškus. V4/S4 — tekstai.
 *   V2 — grynai AV likutis per `wc_update_product_stock` (atominis) + užraktas veiksmui; V3 — be `wp_cache_flush`.
 * v2.0 (Raimis 2026-09-03 po darbuotojo testo: „nepalik to chaoso“): VIENA SISTEMA — darbuotojas iš šio lango neišeina:
 *   Laiškai tiekėjams = kortelės per tiekėją čia (1 Lipdukai → 2 Laiškas [T], prierašas, varnelės, peržiūra, partija į Avesą,
 *   ZB: Kopijuoti · Lipdukas · Perduota) ant esamo dropship variklio (`ps_dropship_send` / `zb_done` / `vp_reg`; grįžimas į
 *   šį langą per `wp_redirect` filtrą); Paruošta = kortelės „Avesa — laukia kurjerio“ (Lipdukas PDF, Manifestas, Išsiųsta /
 *   Kurjeris paėmė viską) ir „[T] — laiškas išsiųstas“ ([T] išsiuntė); Surinkti — lapas atsidaro naujame skirtuke, langas lieka.
 *   EILĖ = MYGTUKAS (eilėje „Surinkti“ visada Surinkti/Lipdukas, ne skubiausias globalus). NAUJI — TIK NEAIŠKŪS: auto
 *   rūšiuojama ir kai visos eilutės iš tiekėjų (keli tiekėjai tiesiai) — į Nauji tik Avesa+tiekėjas ir trūkumas. Naujas
 *   užsakymas pažymėtas „naujas“ kiekvienoje eilėje. Takelis trumpas (✓ padaryta · dabar · kitas), pilnas — skydelyje.
 *   Žodynas be AV/dropship/manifesto/perreg/„riba“; laikas „iki 09:00“. Kelias juostoje be pasikartojimų (URL valomas).
 * v1.2 (Raimis: „Uzsakymai“ pokalbio sprendimai — ne dvi sistemos, WC niekur): nuoroda „senas langas“ išimta; darbuotojo
 *   tekstuose nebėra „etapas“/„WC“; „Išsiųsta“ — savas `ps_dl_veiksmas v=issiusta` su sekimo laiško varnele (V3, I1: ON, kai
 *   visi numeriai yra; siunčia `Petshop_Siuntos::laisko_turinys()`, `edit_shop_orders` teisė), §18.3 sargas žmogaus kalba
 *   („dar neregistruota: Prins“); LP lipdukas — per Rytinę eigą (J1, iki savo endpoint'o).
 * v1.1: PATAISA — konteinerio `data-atidaryti` atributas gaudė VISUS paspaudimus (closest() rado #dl → preventDefault):
 *   eilutė neatsidarė, mygtukai nevedė. Konteineris → `data-atid`. `auto_rusiuoti()` — tuščias planas `[]` nebeblokuoja.
 * v0.1–0.3 (Run 1): perėmimas `page=ps-desk` (senas — `&senas=1` / `view=rytas`), 8 eilės, rikiavimas
 * „kas pirma degs“, filtrai, Visi su filtrais, klaviatūra, 60 s atnaujinimas, mobilus vaizdas.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Darbalaukis {

	const VERSIJA = '3.24';
	const SLUG    = 'ps-desk';

	/** Eilės: slug => [pavadinimas, paaiškinimas, spalva]. */
	const EILES = array(
		'siandien'   => array( 'Gauti',              'Užsakymai, kurių dar neatidarei — nesvarbu, kelių dienų. Atidarei — lieka tik savo darbo eilėje.', 'z' ),
		'nauji'      => array( 'Neišrūšiuoti',       'Reikia tavo sprendimo: dalis prekių AV, dalis pas tiekėją — siųsti atskirai ar vežti į AV? Aiškius sistema išrūšiuoja pati.', 'r' ),
		'laukiam'    => array( 'Laukiam iš tiekėjų', 'Prekės į AV: užsakyk iš tiekėjo čia pat („Užsakyti iš … į AV“), atvažiavus — „Gauta“. AV siunta nerenkama, kol visos jos prekės neatvyko.', 'g' ),
		'surinkti'   => array( 'Surinkti AV',        'Visos AV siuntos prekės vietoje — Surinkti → Lipdukas → Kurjeris paėmė.', 'z' ),
		'laiskai'    => array( 'Dropshipping',       'Tiekėjas siunčia tiesiai klientui: pirma lipdukai visiems jo užsakymams, tada užsakymas tiekėjui (laišką gali peržiūrėti).', 'm' ),
		'paruosta'   => array( 'Paruošta siųsti',    'AV siuntos laukia kurjerio — kai paėmė, spausk „Kurjeris paėmė“. Tiekėjų siuntos — kai tiekėjas praneša, kad išsiuntė.', 'z' ),
		'klausimai'  => array( 'Klausimai',          'Reikia sprendimo — kortelė sako, ką gali daryti.', 'r' ),
		'neapmoketi' => array( 'Neapmokėti',         'Laukia kliento pinigų. Gavus pavedimą — „Pažymėti apmokėtu“.', 'g' ),
		'visi'       => array( 'Visi',               'Visi užsakymai su būsena — įvykdyti, atšaukti, kelyje — filtrais.', '' ),
	);

	const KELIAI = array( 'av' => 'Iš AV', 'tiesiai' => 'siunčia klientui', 'i_av' => 'veža į AV' );

	protected static $riba_kesas = array();

	public static function init() {
		add_action( 'plugins_loaded', array( __CLASS__, 'perimti' ), 20 );
		add_action( 'admin_post_ps_dl_veiksmas', array( __CLASS__, 'vykdyti' ) );
		add_action( 'woocommerce_payment_complete', array( __CLASS__, 'auto_rusiuoti' ), 100, 1 );
		add_action( 'woocommerce_order_status_processing', array( __CLASS__, 'auto_rusiuoti' ), 100, 1 );
		add_filter( 'wp_redirect', array( __CLASS__, 'grizti_cia' ), 5, 2 );
		add_action( 'admin_post_ps_desk_veiksmas', array( __CLASS__, 'surinkta_zyme' ), 0 );
		add_action( 'wp_ajax_ps_dl_zurnalas', array( __CLASS__, 'ajax_zurnalas' ) );
		add_action( 'wp_ajax_ps_dl_skydelis', array( __CLASS__, 'ajax_skydelis' ) );
		add_action( 'wp_ajax_ps_dl_matyta', array( __CLASS__, 'ajax_matyta' ) );
		add_action( 'admin_post_ps_dl_tiekimas', array( __CLASS__, 'tiekimas_vykdyti' ) );
		add_action( 'admin_post_ps_dl_redaguoti', array( __CLASS__, 'redaguoti_vykdyti' ) ); // v3.16
		add_action( 'admin_post_ps_dl_kiekis', array( __CLASS__, 'kiekis_vykdyti' ) ); // v3.19 (5 etapas #4)
		// v3.21 (5 etapas: „Pakartotinis užsakymas“, spec §12.5): forma kortelėje; apmokėjus (Paysera callback → processing) — įvykdytas + laiškas su AVPN; apmokėjimo puslapyje tik Paysera.
		add_action( 'admin_post_ps_dl_pakartotinis', array( __CLASS__, 'pakartotinis_vykdyti' ) );
		add_action( 'woocommerce_order_status_processing', array( __CLASS__, 'pakartotinis_apmoketas' ), 110, 1 );
		add_action( 'woocommerce_payment_complete', array( __CLASS__, 'pakartotinis_apmoketas' ), 110, 1 );
		add_filter( 'woocommerce_available_payment_gateways', array( __CLASS__, 'pakartotinis_vartai' ), 50, 1 );
		add_filter( 'woocommerce_order_email_verification_required', array( __CLASS__, 'pakartotinis_be_patvirtinimo' ), 20, 3 );
		foreach ( array( 'new_order', 'customer_processing_order', 'customer_completed_order', 'customer_on_hold_order', 'customer_invoice', 'customer_pending_order' ) as $wc_l ) { add_filter( 'woocommerce_email_enabled_' . $wc_l, array( __CLASS__, 'pakartotinis_wc_laiskai' ), 20, 2 ); } // v3.22
		add_action( 'woocommerce_thankyou_bacs', array( __CLASS__, 'pakartotinis_aciu_bankas' ), 20, 1 ); // v3.23
		add_filter( 'woocommerce_valid_order_statuses_for_payment', array( __CLASS__, 'pakartotinis_moketini_statusai' ), 20, 2 ); // v3.24
		// v3.19: kiekio keitimo refund'ai (`_ps_kiekis`) — eilutė jau perrašyta, WC juos rodytų dukart (paskyra, laiškai, „Suma“).
		add_filter( 'woocommerce_order_item_quantity_html', array( __CLASS__, 'kiekio_html' ), 20, 2 );
		add_filter( 'woocommerce_email_order_item_quantity', array( __CLASS__, 'kiekio_laiske' ), 20, 2 );
		add_filter( 'woocommerce_get_order_item_totals', array( __CLASS__, 'sumu_eilutes' ), 20, 2 );
		add_filter( 'woocommerce_get_formatted_order_total', array( __CLASS__, 'suma_be_savu' ), 20, 4 );
		add_action( 'wp_ajax_ps_dl_vietos', array( __CLASS__, 'ajax_vietos' ) ); // v3.16
		// v3.11 (4 etapas #1): Venipak sekimo cron kas 30 min.
		add_filter( 'cron_schedules', array( __CLASS__, 'cron_tvarkarastis' ) );
		add_action( 'init', array( __CLASS__, 'cron_planuoti' ), 30 );
		add_action( 'ps_venipak_sekimas', array( __CLASS__, 'venipak_sekimas' ) );
		add_action( 'ps_velavimo_laiskai', array( __CLASS__, 'velavimo_laiskai' ) ); // v3.13
	}

	/** V5: „Surinkti“ (lapai) — aiški užsakymo žymė `_ps_surinkta` (laikas|kas), ne tik žurnalo įrašas. */
	public static function surinkta_zyme() {
		if ( 'lapai' !== sanitize_key( $_GET['v'] ?? '' ) || ! current_user_can( 'edit_shop_orders' ) ) { return; }
		$ids = array(); if ( ! empty( $_GET['id'] ) ) { $ids[] = absint( $_GET['id'] ); } if ( ! empty( $_GET['ids'] ) ) { $ids = array_merge( $ids, array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_GET['ids'] ) ) ) ) ); }
		if ( ! wp_verify_nonce( $_GET['_wpnonce'] ?? '', 'ps_desk_lapai_' . absint( $_GET['id'] ?? 0 ) ) ) { return; }
		foreach ( array_unique( array_filter( $ids ) ) as $oid ) { $o = wc_get_order( $oid ); if ( $o && ! $o->get_meta( '_ps_surinkta' ) ) { $o->update_meta_data( '_ps_surinkta', current_time( 'mysql' ) . ' | ' . wp_get_current_user()->display_name ); $o->save(); } }
	}

	/** Gauti: darbuotojas atidarė skydelį — užsakymas matytas. */
	public static function ajax_matyta() {
		if ( ! current_user_can( 'edit_shop_orders' ) || ! check_ajax_referer( 'ps_dl_zurnalas', 'n', false ) ) { wp_send_json_error( 'teisės', 403 ); }
		$o = wc_get_order( absint( $_GET['id'] ?? 0 ) );
		if ( $o && ! $o->get_meta( '_ps_matyta' ) ) { $o->update_meta_data( '_ps_matyta', current_time( 'mysql' ) . ' | ' . wp_get_current_user()->display_name ); $o->save(); }
		wp_send_json_success( 1 );
	}

	/** K2 (antra pusė): skydelio duomenys pagal poreikį — eilutėse tik `data-sk`, ne visas JSON („Visi“ 35 užs. buvo ≈ 446 KB). */
	public static function ajax_skydelis() {
		if ( ! current_user_can( 'edit_shop_orders' ) || ! check_ajax_referer( 'ps_dl_zurnalas', 'n', false ) ) { wp_send_json_error( 'teisės', 403 ); }
		$o = wc_get_order( absint( $_GET['id'] ?? 0 ) ); if ( ! $o ) { wp_send_json_error( 'nėra', 404 ); }
		wp_send_json_success( self::skydelis( self::faktai( $o, self::zurnalas( array( $o->get_id() ) ) ) ) );
	}

	/** K2: žurnalas į skydelį pagal poreikį (ne kiekvienoje eilutėje). */
	public static function ajax_zurnalas() {
		if ( ! current_user_can( 'edit_shop_orders' ) || ! check_ajax_referer( 'ps_dl_zurnalas', 'n', false ) ) { wp_send_json_error( 'teisės', 403 ); }
		$id = absint( $_GET['id'] ?? 0 );
		wp_send_json_success( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ? Petshop_Uzsakymu_Ivykiai::html( $id, 40 ) : '' );
	}

	/** Dropship variklis po laiško / ZB žymės grąžina į senus langus — jei veiksmas paleistas iš čia (`ps_dl_g`), grįžtam čia su žinute. */
	public static function grizti_cia( $location, $status ) {
		if ( empty( $_POST['ps_dl_g'] ) ) { return $location; }
		$g = wp_validate_redirect( wp_unslash( $_POST['ps_dl_g'] ), '' );
		if ( ! $g ) { return $location; }
		parse_str( (string) parse_url( $location, PHP_URL_QUERY ), $q );
		if ( isset( $q['psl_sent'] ) ) {
			$kam = rawurldecode( (string) ( $q['psl_kam'] ?? '' ) ); $n = (int) ( $q['psl_n'] ?? 0 ); $src = (string) ( $q['psl_src'] ?? '' );
			if ( '1' === (string) $q['psl_sent'] ) { return add_query_arg( array( 'pd_ok' => 'dl_laiskas', 'pd_nr' => rawurlencode( self::vardas( $src ) . '|' . $n . ' užs. → ' . $kam ) ), $g ); }
			return add_query_arg( array( 'pd_ok' => 'dl_klaida', 'pd_nr' => rawurlencode( self::vardas( $src ) . '|laiškas neišsiųstas: ' . rawurldecode( (string) ( $q['psl_err'] ?? '' ) ) ) ), $g );
		}
		if ( isset( $q['ps_zb'] ) ) { return add_query_arg( array( 'pd_ok' => 'dl_zb', 'pd_nr' => rawurlencode( 'Žalioji Banga|' . (int) $q['ps_zb'] ) ), $g ); }
		// 3 etapas: Tiekimo variklis (`ps_tiekimas`) paleistas iš „Laukiam iš tiekėjų“ kortelės — grįžtam čia darbuotojo žodžiais.
		if ( isset( $q['tk'] ) && isset( $q['page'] ) && 'ps-tiekimas' === $q['page'] ) {
			$tk = sanitize_key( $q['tk'] ); $pid = (int) ( $q['p'] ?? 0 ); $v = self::vardas( sanitize_key( $_POST['tiekejas'] ?? '' ) );
			$nr = ! empty( $_POST['ps_dl_pirmas'] ) ? '#' . absint( $_POST['ps_dl_pirmas'] ) : $v;
			$ln = class_exists( 'Petshop_AV_Tiekimas' ) ? Petshop_AV_Tiekimas::laisko_nust() : array( 'tiekejui' => false, 'man' => true );
			$pastai = (array) get_option( 'ps_tiekeju_pastai', array() ); $kam = trim( ( ! empty( $ln['tiekejui'] ) && ! empty( $pastai[ sanitize_key( $_POST['tiekejas'] ?? '' ) ] ) ? $pastai[ sanitize_key( $_POST['tiekejas'] ?? '' ) ] . ', ' : '' ) . ( ! empty( $ln['man'] ) ? 'terra@petshop.lt' : '' ), ', ' );
			$m = array(
				'uzsakyta'          => array( 'dl_uzsak_av', 'užsakyta iš ' . $v . ' į AV — užsakymas tiekėjui #' . $pid . ' (laiškas: ' . $kam . ')' ),
				'uzsakyta_vp'       => array( 'dl_uzsak_av', 'užsakyta iš ' . $v . ' į AV — užsakymas tiekėjui #' . $pid . ', siunta užregistruota, lipdukas laiške (' . $kam . ')' ),
				'uzsakyta_man'      => array( 'dl_uzsak_av', 'užsakyta iš ' . $v . ' į AV — užsakymas tiekėjui #' . $pid . '; laiškas išėjo tik man (terra@petshop.lt) — persiųsk tiekėjui' ),
				'uzsakyta_rankinis' => array( 'dl_uzsak_av', 'užsakymas tiekėjui #' . $pid . ' uždarytas — laiško nėra, sąrašą suvesk į ' . $v . ' sistemą („Kopijuoti“ kortelėje)' ),
				'uzsakyta_be_laisko'=> array( 'dl_info', 'užsakymas tiekėjui #' . $pid . ' uždarytas, bet laiškas niekam neišėjo (abi varnelės nuimtos) — parašyk tiekėjui pats' ),
				'laiskas_nepavyko'  => array( 'dl_klaida', 'laiškas ' . $v . ' NEIŠSIŲSTAS (pašto klaida) — užsakymas tiekėjui #' . $pid . ' vis tiek uždarytas; parašyk tiekėjui pats' ),
				'vp_klaida'         => array( 'dl_klaida', 'Venipak nepriėmė: ' . (string) get_transient( 'ps_tiek_vp_klaida_' . $pid ) . ' — užsakymas tiekėjui neišsiųstas, pataisyk pristatymą/svorį ir spausk dar kartą' ),
				'priimta'           => array( 'dl_gauta', 'gauta į AV iš ' . $v . ' (užsakymas tiekėjui #' . $pid . ') — likučiai papildyti' ),
				'issaugota'         => array( 'dl_info', 'prekės į AV sudėtos į užsakymą tiekėjui #' . $pid . ' — jis išeis kartu su Dropshipping užsakymais iš ' . $v . ' (varnelė „+ į AV“ kortelėje)' ),
				'tuscia'            => array( 'dl_info', 'nėra ko užsakyti iš ' . $v . ' į AV' ),
				'klaida'            => array( 'dl_klaida', 'užsakymo tiekėjui #' . $pid . ' būsena netinka šiam veiksmui — atnaujink langą' ),
			);
			$r = $m[ $tk ] ?? array( 'dl_info', $tk );
			if ( ! empty( $_POST['ps_dl_kartu'] ) && 'issaugota' === $tk ) { $g = add_query_arg( array( 'eile' => 'laiskai' ), remove_query_arg( array( 'atidaryti', 'view', 'q', 'b' ), $g ) ); }
			return add_query_arg( array( 'pd_ok' => $r[0], 'pd_nr' => rawurlencode( $nr . '|' . $r[1] ) ), $g );
		}
		return $location;
	}

	/** Perėmimas per plugins_loaded — `Petshop_Desk` įkeliamas po mūsų (abėcėlė). Variklis lieka. */
	public static function perimti() {
		if ( ! class_exists( 'Petshop_Desk' ) ) { return; }
		remove_action( 'admin_menu', array( 'Petshop_Desk', 'meniu' ) );
		remove_action( 'admin_head', array( 'Petshop_Desk', 'chrome' ) );
		remove_action( 'admin_head', array( 'Petshop_Desk', 'slepti_wc' ) );
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ) );
		add_action( 'admin_head', array( __CLASS__, 'chrome' ) );
	}

	public static function meniu() {
		add_menu_page( 'Petshop užsakymai', 'Petshop užsakymai', 'edit_shop_orders', self::SLUG, array( __CLASS__, 'puslapis' ), 'dashicons-clipboard', 2 );
	}

	protected static function musu() { return is_admin() && isset( $_GET['page'] ) && self::SLUG === $_GET['page']; }
	protected static function senas() { return ! empty( $_GET['senas'] ); }
	protected static function rytas_langas() { return isset( $_GET['view'] ) && 'rytas' === $_GET['view'] && ! self::senas(); }

	public static function chrome() {
		if ( ! self::musu() ) { return; }
		if ( class_exists( 'Petshop_Desk' ) ) { Petshop_Desk::slepti_wc(); }
		if ( self::senas() ) { if ( class_exists( 'Petshop_Desk' ) ) { Petshop_Desk::chrome(); } return; }
		echo '<style>#wpfooter,#screen-meta,#screen-meta-links,.update-nag,.notice,#wpbody-content>.wrap>h1{display:none!important}
#wpcontent{padding-left:0!important}#wpbody-content{padding-bottom:0!important}html.wp-toolbar{padding-top:32px!important}body{background:#EEF1EF}.psj-2{display:none!important}</style>';
	}

	/* ============================ VARIKLIS ============================ */

	/** Protected `Petshop_Desk` metodas per ReflectionMethod. */
	protected static function d( $m ) {
		static $r = array();
		$args = func_get_args(); array_shift( $args );
		if ( ! isset( $r[ $m ] ) ) { $r[ $m ] = new ReflectionMethod( 'Petshop_Desk', $m ); $r[ $m ]->setAccessible( true ); }
		return $r[ $m ]->invokeArgs( null, $args );
	}

	/** Sandėlio riba: [k, tekstas, liko_s] (praėjo → +1 para rikiavimui). */
	protected static function riba( $s ) {
		if ( array_key_exists( $s, self::$riba_kesas ) ) { return self::$riba_kesas[ $s ]; }
		$out = null;
		if ( ! empty( Petshop_Desk::RIBOS[ $s ] ) ) {
			$dabar = (int) current_time( 'timestamp' );
			$liko  = strtotime( wp_date( 'Y-m-d', $dabar ) . ' ' . Petshop_Desk::RIBOS[ $s ] . ':00' ) - $dabar;
			$x     = self::d( 'riba', $s );
			$out   = array( $x[0], $x[1], $liko <= 0 ? $liko + DAY_IN_SECONDS : $liko );
		}
		self::$riba_kesas[ $s ] = $out;
		return $out;
	}

	/** Laikas darbuotojo kalba: „iki 09:00“ (liko / skuba) arba „po 09:00 — keliaus rytoj“. */
	protected static function riba_tekstas( $s ) {
		$r = self::riba( $s ); if ( ! $r ) { return array( '', '' ); }
		$l = Petshop_Desk::RIBOS[ $s ];
		if ( 'praejo' === $r[0] ) { return array( 'praejo', 'po ' . $l . ' — rytoj' ); }
		return array( $r[0], 'iki ' . $l . ( 'skuba' === $r[0] ? ' — liko ' . preg_replace( '/^.*liko /', '', $r[1] ) : '' ) );
	}

	/** „Kur dabar“ — eilės ir kitas žingsnis žmogaus kalba (atsekamumui). */
	protected static function kur_dabar( $f ) {
		if ( $f['uzdarytas'] ) { return in_array( $f['st'], Petshop_Desk::STATUSAI['atsaukti'], true ) ? 'atšauktas' : 'įvykdytas'; }
		if ( ! $f['eiles'] ) { return 'laukia (be veiksmo)'; }
		$e = array(); foreach ( $f['eiles'] as $k ) { $x = self::EILES[ $k ][0]; if ( 'laiskai' === $k && $f['tiesiai'] ) { $t = array(); foreach ( $f['tiesiai'] as $s ) { if ( empty( $f['dalys'][ $s ]['perduota'] ) ) { $t[] = self::vardas( $s ); } } if ( $t ) { $x .= ' (' . implode( ', ', $t ) . ')'; } } $e[] = $x; }
		return implode( ' + ', $e ) . ( $f['btn'] && ! empty( $f['btn'][0] ) ? ' · toliau: ' . $f['btn'][0] : '' );
	}

	/** Juosta „Šiandien atėjo“ — kiekvienas šiandienos užsakymas: kada, kas, kur dabar, kitas žingsnis. */
	protected static function siandien_juosta( $atviri ) {
		$n = array(); foreach ( $atviri as $r ) { if ( ! empty( $r['naujas'] ) ) { $n[] = $r; } }
		if ( ! $n ) { return; }
		usort( $n, function ( $a, $b ) { $da = $a['o']->get_date_created(); $db = $b['o']->get_date_created(); return ( $db ? $db->getTimestamp() : 0 ) <=> ( $da ? $da->getTimestamp() : 0 ); } );
		echo '<div class="dl-siand"><b>Šiandien atėjo ' . count( $n ) . '</b>';
		foreach ( $n as $r ) { $o = $r['o']; $eile = $r['eiles'] ? $r['eiles'][0] : 'visi';
			printf( '<a class="dl-siand-u" href="%s"><span class="nr">#%s</span> <span class="pilkas">%s · %s · %d prek.</span> <span class="kel %s"><i></i>%s</span></a>',
				esc_url( self::url( array( 'eile' => $eile, 'view' => null, 'q' => null, 'b' => null, 'atidaryti' => $r['id'] ) ) ), esc_html( $o->get_order_number() ), esc_html( wp_date( 'H:i', $o->get_date_created()->getTimestamp() ) ), esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ), count( $r['eil'] ),
				$r['kl'] ? 'klaus' : ( 'nauji' === $eile ? 'ts' : 'sandelis' ), esc_html( self::kur_dabar( $r ) ) ); }
		echo '</div>';
	}

	/** Amžius darbuotojo kalba: „prieš 40 min“, „prieš 3 val.“, „vakar 17:41“, „prieš 3 d.“. */
	protected static function amzius( $d ) {
		if ( ! $d ) { return '—'; }
		$s = time() - $d->getTimestamp();
		if ( $s < 3600 ) { return 'prieš ' . max( 1, (int) floor( $s / 60 ) ) . ' min'; }
		$td = wp_date( 'Y-m-d' ); $dd = wp_date( 'Y-m-d', $d->getTimestamp() );
		if ( $dd === $td ) { return 'prieš ' . (int) floor( $s / 3600 ) . ' val.'; }
		if ( $dd === wp_date( 'Y-m-d', time() - DAY_IN_SECONDS ) ) { return 'vakar ' . wp_date( 'H:i', $d->getTimestamp() ); }
		$dienu = (int) floor( $s / DAY_IN_SECONDS );
		return $dienu < 14 ? 'prieš ' . $dienu . ' d.' : wp_date( 'm-d', $d->getTimestamp() );
	}

	/** Būsena „Visuose“ (spalvota žymė): [tekstas, klasė]. */
	protected static function busena( $f ) {
		if ( in_array( $f['st'], Petshop_Desk::STATUSAI['atsaukti'], true ) ) { return array( 'Atšauktas', 'b-red' ); }
		if ( in_array( $f['st'], Petshop_Desk::STATUSAI['ivykdyti'], true ) ) { return array( 'Įvykdytas', 'b-grey' ); }
		if ( in_array( $f['st'], Petshop_Desk::STATUSAI['kelyje'], true ) ) { return array( 'Išsiųstas', 'b-blue' ); }
		if ( $f['kl'] ) { return array( 'Klausimas', 'b-red' ); }
		if ( in_array( 'neapmoketi', $f['eiles'], true ) ) { return array( 'Neapmokėtas', 'b-amber' ); }
		if ( in_array( 'nauji', $f['eiles'], true ) ) { return array( 'Neišrūšiuotas', 'b-amber' ); }
		$dal = false; foreach ( $f['dalys'] as $p ) { if ( $p && ! empty( $p['issiusta'] ) ) { $dal = true; } }
		if ( $dal ) { return array( 'Išsiųsta dalis', 'b-blue' ); }
		if ( in_array( 'paruosta', $f['eiles'], true ) && ! in_array( 'surinkti', $f['eiles'], true ) && ! in_array( 'laiskai', $f['eiles'], true ) && ! in_array( 'laukiam', $f['eiles'], true ) ) { return array( 'Paruoštas', 'b-green' ); }
		return array( 'Ruošiamas', 'b-blue' );
	}

	/** Mygtukas KONKREČIAI EILEI (eilė = veiksmas): Surinkti → surinkti/lipdukas, Laukiam → užsakyti/laukiam, Paruošta → išsiųsta… */
	protected static function mygtukas_eilei( $f, $eile ) {
		$leid = array( 'nauji' => array( 'rusiuoti' ), 'surinkti' => array( 'lapai', 'lipdukas' ), 'laukiam' => array( 'kons', 'tiekimas' ), 'paruosta' => array( 'issiusta' ), 'neapmoketi' => array( 'apmoketa' ), 'klausimai' => array( 'spresti' ) );
		if ( ! isset( $leid[ $eile ] ) ) { return $f['btn']; }
		foreach ( $f['takelis'] as $t ) {
			if ( $t[4] && in_array( $t[4], $leid[ $eile ], true ) && in_array( $t[2], array( 'now', 'wait', 'bad' ), true ) ) {
				return self::mygtukas( $t, $f );
			}
		}
		return $f['btn'];
	}

	protected static function vardas( $s ) {
		$v = array( 'av' => 'AV', 'vf' => 'VF', 'zb' => 'ZB', 'quattro' => 'Quattro', 'prins' => 'Prins', 'ambrosia' => 'Ambrosia', 'belcor_tofu' => 'Belacor', 'lp' => 'LP', 'tiekejo' => 'tiekėjo' );
		return $v[ $s ] ?? mb_strtoupper( (string) $s );
	}

	/** Ar tiekėjo užsakymas į AV jau atviras (kaupiama/užsakyta) — tada siūlom „veža į AV“ (prekė atvažiuos ir taip). */
	protected static $partijos_cache = array();
	protected static function atvira_partija( $src ) {
		if ( ! isset( self::$partijos_cache[ $src ] ) ) {
			global $wpdb; $t = $wpdb->prefix . 'ps_tiekimas';
			self::$partijos_cache[ $src ] = (int) $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$t} WHERE tiekejas=%s AND busena IN ('kaupiama','uzsakyta') ORDER BY id DESC LIMIT 1", $src ) );
		}
		return self::$partijos_cache[ $src ];
	}

	/** Kelio pavadinimas pilnu vardu: „Avesa sandėlis“ / „Prins → klientui“ / „Prins → Avesa sandėlį“. */
	protected static function kelio_vardas( $k, $tiek ) {
		if ( 'av' === $k ) { return 'Iš AV'; }
		if ( '' === $k ) { return 'Nežinia iš kur'; }
		return ( $tiek ? self::vardas( $tiek ) : 'Tiekėjas' ) . ' ' . self::KELIAI[ $k ];
	}

	/** Paskutiniai žurnalo įvykiai visiems ID vienu SQL. */
	protected static function zurnalas( $ids ) {
		if ( ! class_exists( 'Petshop_Uzsakymu_Ivykiai' ) || ! $ids ) { return array(); }
		global $wpdb;
		$rows = $wpdb->get_results( 'SELECT uzsakymas, veiksmas, MAX(laikas) laikas FROM ' . Petshop_Uzsakymu_Ivykiai::t()
			. ' WHERE uzsakymas IN (' . implode( ',', array_map( 'intval', $ids ) ) . ") AND rezultatas='ok'
			   AND veiksmas IN ('lapai','nesurinkta','vp_reg','vp_bulk','issiusta','laiskas','perduota_zb','rusiuoti','kons','kelias') GROUP BY uzsakymas, veiksmas", ARRAY_A );
		$z = array();
		foreach ( (array) $rows as $r ) { $z[ (int) $r['uzsakymas'] ][ $r['veiksmas'] ] = $r['laikas']; }
		return $z;
	}

	/** `_ps_siuntos` + plugino raktas → sandelis => [numeriai]. */
	protected static function siuntos( $o, $sandeliai ) {
		$out = array();
		if ( ! class_exists( 'Petshop_Siuntos' ) ) { return $out; }
		foreach ( Petshop_Siuntos::sarasas( $o->get_id() ) as $s ) {
			$k = (string) ( $s['sandelis'] ?? '' );
			if ( '' === $k ) { $k = ( 1 === count( $sandeliai ) ) ? reset( $sandeliai ) : ( in_array( 'av', $sandeliai, true ) ? 'av' : '' ); }
			if ( '' === $k ) { continue; }
			$out[ $k ] = array_merge( $out[ $k ] ?? array(), (array) ( $s['numeriai'] ?? array() ) );
		}
		// v3.10.4 (#6): LP Express — lipduką kuria LP pluginas (Rytinė eiga, J1), registre `_ps_siuntos` jo nėra; numeris — plugino meta
		// `_woo_lithuaniapost_barcode` (patikrinta plugino kode: `update_meta_data('_woo_lithuaniapost_barcode', $shipping_item_status->barcode)`).
		// v3.11.1: „Siųsti iš naujo“ — seni (grįžusios siuntos ir tuomet buvę AV) numeriai nerodomi; naujas lipdukas juos perrašys registre.
		$senos = self::senos( $o );
		if ( $senos ) { foreach ( $out as $k => $nrs ) { $out[ $k ] = array_values( array_diff( (array) $nrs, $senos ) ); if ( ! $out[ $k ] ) { unset( $out[ $k ] ); } } }
		if ( empty( $out['av'] ) && 'lp' === self::d( 'vezejas', $o ) ) {
			$bc = $o->get_meta( '_woo_lithuaniapost_barcode' );
			$bc = array_values( array_filter( array_map( 'trim', is_array( $bc ) ? $bc : array( (string) $bc ) ) ) );
			if ( $bc ) { $out['av'] = $bc; }
		}
		return $out;
	}

	/** Eilutės kelias ir tiekėjas: [kelias, src, tiek, bukle(objektas|null)]. */
	protected static function eilutes_kelias( $o, $iid, $it, $spr ) {
		$src = self::d( 'eilutes_saltinis', $it );
		$k   = (string) $it->get_meta( '_ps_kelias' );
		$b   = null; $tiek = '';
		if ( class_exists( 'Petshop_AV_Tiekimas' ) && $src && 'av' !== $src ) { $b = Petshop_AV_Tiekimas::eilutes_bukle( $o->get_id(), (int) $iid ); }
		if ( ! isset( self::KELIAI[ $k ] ) ) {
			if ( 'av' === $src ) { $k = 'av'; }
			elseif ( $src ) { $k = ( $it->get_meta( '_ps_konsolidacija' ) || 'av' === ( $spr[ $src ] ?? '' ) || $b || ( ! $o->get_meta( '_ps_rusiuota' ) && self::atvira_partija( $src ) ) ) ? 'i_av' : 'tiesiai'; }
			else { $k = ''; }
		}
		// K1 (auditas 09-03): rodomas kelias = f(_ps_source, partija). „→ Avesa sandėlį“ galioja tik kol prekė dar ne Avesoje;
		// po Gauta (K2 rašo `_ps_source=av`) eilutė yra Avesos — `_ps_kelias=i_av` tėra istorija (takeliui „✓ gauta“).
		$gauta = '';
		if ( 'av' === $src && ( 'i_av' === $k || $it->get_meta( '_ps_konsolidacija' ) ) ) { $k = 'av'; $gauta = preg_match( '/parsivežta iš (\w+)/iu', (string) $it->get_meta( '_ps_source_reason' ), $m ) ? strtolower( $m[1] ) : 'tiekejo'; }
		if ( 'av' === $src && 'tiesiai' === $k ) { $k = 'av'; }
		if ( $src && 'av' !== $src ) { $tiek = $src; }
		elseif ( $it->get_product_id() ) {
			$v = self::d( 'sprendimas', $it->get_product_id(), $it->get_quantity() );
			if ( ! empty( $v['tiekejas'] ) && 'av' !== $v['tiekejas'] && 'legacy' !== $v['tiekejas'] ) { $tiek = $v['tiekejas']; }
		}
		return array( $k, $src, $tiek, $b, $gauta );
	}

	/* ============================ FAKTAI ============================ */

	/** Vieno užsakymo faktai: eilutės su keliais ir žingsneliais, dalys, takelis, eilės, mygtukas, skuba. */
	protected static function faktai( $o, $z = array() ) {
		$id = $o->get_id(); $st = $o->get_status();
		$f  = array( 'o' => $o, 'id' => $id, 'st' => $st, 'paid' => $o->is_paid(), 'kl' => self::d( 'klausimas', $o ), 'vez' => self::d( 'vezejas', $o ),
			'eil' => array(), 'dalys' => array(), 'rus' => '', 'eiles' => array(), 'takelis' => array(), 'btn' => null, 'skuba' => PHP_INT_MAX, 'uzdarytas' => false, 'riba_s' => '', 'btn_s' => '', 'tiesiai' => array(), 'av_side' => false, 'siuntos_klaida' => null );
		$neapm  = in_array( $st, Petshop_Desk::STATUSAI['neapmoketi'], true );
		$atsauk = in_array( $st, Petshop_Desk::STATUSAI['atsaukti'], true );
		$baigta = in_array( $st, array_merge( Petshop_Desk::STATUSAI['ivykdyti'], Petshop_Desk::STATUSAI['kelyje'] ), true );
		$lp_par = in_array( $st, Petshop_Desk::STATUSAI['paruosta'], true );
		$f['uzdarytas'] = $atsauk || $baigta;
		$dp = $o->get_date_paid() ? $o->get_date_paid() : $o->get_date_created();
		$f['naujas'] = ! $f['uzdarytas'] && ! $o->get_meta( '_ps_matyta' ); // Gauti = darbuotojas dar neatidarė
		$perd = class_exists( 'Petshop_AV_Dropship' ) ? Petshop_AV_Dropship::perduotos( $o ) : array();
		$spr  = self::d( 'misrus_sprendimas', $o );
		$iss  = json_decode( (string) $o->get_meta( '_ps_dalys_issiusta' ), true ); if ( ! is_array( $iss ) ) { $iss = array(); }
		$f['dalys_issiusta'] = $iss;

		$sandeliai = array(); $av_truksta = false; $i_av_laukia = array(); $i_av_neuzs = array(); $i_av_src = array();
		foreach ( $o->get_items() as $iid => $it ) {
			list( $k, $src, $tiek, $b, $gauta ) = self::eilutes_kelias( $o, $iid, $it, $spr );
			$q = (int) $it->get_quantity(); $pid = (int) $it->get_product_id();
			$v = $pid ? self::d( 'sprendimas', $pid, $q ) : array();
			$av_qty = isset( $v['av_qty'] ) ? (int) $v['av_qty'] : null;
			$reduced = (int) $it->get_meta( '_ps_av_reduced_qty' ) > 0 || $it->get_meta( '_reduced_stock' ) || $it->get_meta( '_ps_av_reduced' );
			$ats = (string) $it->get_meta( '_ps_atsaukta' ); if ( $ats ) { $reduced = true; } // v3.17: dalis atšaukta (grįžo) — likutis grąžintas, trūkumo neskaičiuojam
			$iss_l = (string) $it->get_meta( '_ps_issiusta' ); if ( $iss_l ) { $reduced = true; } // v3.18: eilutė jau išsiųsta ankstesne AV siunta
			$av_ok = null;
			if ( 'av' === $k ) { $av_ok = $reduced ? true : ( null !== $av_qty && $av_qty >= $q ); if ( ! $av_ok ) { $av_truksta = true; } }
			$bukle = '';
			if ( 'i_av' === $k ) {
				if ( $src ) { $i_av_src[ $src ] = 1; }
				if ( ! $b ) { $bukle = 'neužsakyta'; $i_av_neuzs[ $src ] = 1; $i_av_laukia[ $src ] = 1; }
				elseif ( 'gauta' === $b->busena ) { $bukle = 'gauta · užsakymas tiekėjui #' . (int) $b->partija_id; }
				elseif ( 'uzsakyta' === $b->busena ) { $bukle = 'užsakyta · užsakymas tiekėjui #' . (int) $b->partija_id; $i_av_laukia[ $src ] = 1; }
				else { $bukle = 'užsakymas tiekėjui #' . (int) $b->partija_id . ' — dar neišsiųstas'; $i_av_neuzs[ $src ] = 1; $i_av_laukia[ $src ] = 1; }
			}
			if ( $src ) { $sandeliai[ $src ] = 1; }
			$p = $it->get_product();
			$img = $p && $p->get_image_id() ? wp_get_attachment_image_url( $p->get_image_id(), 'woocommerce_gallery_thumbnail' ) : '';
			$f['eil'][ (int) $iid ] = array( 'iid' => (int) $iid, 'q' => $q, 'n' => $it->get_name(), 'sku' => $p ? $p->get_sku() : '', 'pid' => $pid, 'src' => $src, 'k' => $k, 'tiek' => $tiek, 'img' => $img ?: '',
				'av_ok' => $av_ok, 'av_qty' => $av_qty, 'reduced' => $reduced, 'bukle' => $bukle, 'b' => $b ? array( 'busena' => $b->busena, 'partija' => (int) $b->partija_id ) : null,
				'gauta' => $gauta, 'atsaukta' => $ats, 'issiusta_l' => $iss_l, 'kodel' => (string) $it->get_meta( '_ps_source_reason' ), 'galimi' => array( 'av' => 'av' === $k || '' === $k || ( null !== $av_qty && $av_qty >= $q ), 'tiesiai' => (bool) $tiek && 'lp' !== $f['vez'], 'i_av' => (bool) $tiek ), 'zing' => array(), 'lock' => '' );
		}
		$sandeliai = array_keys( $sandeliai );
		// v3.11 (4 etapas #1): Venipak grąžina siuntą → Klausimas „Siunta grįžta“ (darbalaukio lygiu; galioja ir įvykdytam užsakymui).
		$f['sek'] = self::sekimas( $o ); $f['grizta'] = self::grizta( $o );
		$siuntos   = self::siuntos( $o, $sandeliai );
		$zz        = $z[ $id ] ?? array();

		// Surūšiuota: `_ps_rusiuota` arba mišraus planas (senas `misrus` veiksmas = rūšiavimas, spec §2).
		$rus = (string) $o->get_meta( '_ps_rusiuota' );
		if ( ! $rus && $spr ) { $rus = (string) $o->get_meta( '_ps_misrus_sprestas' ); if ( ! $rus ) { $rus = 'planas'; } }
		$f['rus'] = $rus;

		$av_side = false; $tiesiai = array(); $tiesiai_visos = array();
		foreach ( $f['eil'] as $e ) { if ( 'tiesiai' === $e['k'] && $e['src'] ) { $tiesiai_visos[ $e['src'] ] = 1; } if ( ! empty( $e['atsaukta'] ) || ! empty( $e['issiusta_l'] ) ) { continue; } if ( 'av' === $e['k'] || 'i_av' === $e['k'] ) { $av_side = true; } if ( 'tiesiai' === $e['k'] && $e['src'] ) { $tiesiai[ $e['src'] ] = 1; } }
		$f['dalys_atsaukta'] = self::dalys_atsaukta( $o ); $f['dalys_baigtos'] = self::dalys_baigtos( $o ); // v3.17 / v3.18
		$tiesiai = array_keys( $tiesiai ); $f['tiesiai'] = $tiesiai; $f['av_side'] = $av_side;
		$f['senos'] = self::senos( $o );
		$av_siunta = ! empty( $siuntos['av'] ) || $lp_par || ( $av_side && ! $tiesiai_visos && ! $f['senos'] && self::d( 'turi_siunta', $o ) ); // v3.17.1: ir atšauktos tiesiai dalys
		$lapas     = (bool) $o->get_meta( '_ps_surinkta' ) || ( ! empty( $zz['lapai'] ) && ! isset( $zz['nesurinkta'] ) );
		$vietoje   = ! $av_truksta && ! $i_av_laukia;
		$f['dalys']['av'] = $av_side ? array( 'siunta' => $av_siunta, 'nr' => $siuntos['av'] ?? array(), 'lapas' => $lapas, 'vietoje' => $vietoje, 'issiusta' => $baigta || ! empty( $iss['av'] ) ) : null;
		foreach ( $tiesiai as $s ) { $f['dalys'][ $s ] = array( 'perduota' => ! empty( $perd[ $s ] ), 'kada' => $perd[ $s ] ?? '', 'nr' => $siuntos[ $s ] ?? array(), 'issiusta' => $baigta || ! empty( $iss[ $s ] ) ); }
		// v3.18: jau išsiųstos AV prekės + AV dalis vėl ruošiama → lape bus ir jos (variklio av-sheets) — užsakymas išskiriamas.
		$f['nepakuok'] = array(); if ( ! empty( $f['dalys']['av'] ) && empty( $f['dalys']['av']['issiusta'] ) ) { foreach ( $f['eil'] as $e ) { if ( ! empty( $e['issiusta_l'] ) ) { $f['nepakuok'][] = $e['q'] . '× ' . $e['n']; } } }
		// V13 (v3.14, Raimis 09-04): „[T] vėluoja“ pagal DALIS — tiekėjo „tiesiai“ dalis, užsakyta prieš >24 val. ir dar neišsiųsta. Variklio sargo tekstas pakeičiamas.
		$f['veluoja'] = array();
		if ( ! $f['uzdarytas'] ) {
			$dabar_l = current_time( 'timestamp' );
			foreach ( $tiesiai as $s ) { $p = $f['dalys'][ $s ]; if ( $p['perduota'] && ! $p['issiusta'] && $p['kada'] ) { $h = ( $dabar_l - (int) strtotime( (string) $p['kada'] ) ) / HOUR_IN_SECONDS; if ( $h > self::VELUOJA_VAL ) { $f['veluoja'][ $s ] = (int) floor( $h ); } } }
		}
		if ( 0 === strpos( (string) $f['kl'], 'Tiekėjas vėluoja' ) ) { $f['kl'] = ''; }
		if ( $f['veluoja'] && ! $f['kl'] ) { $t = array(); foreach ( $f['veluoja'] as $s => $h ) { $t[] = self::vardas( $s ) . ' vėluoja — užsakyta prieš ' . $h . ' val., siunta neišėjo. Paskambink ' . self::vardas( $s ) . '.'; } $f['kl'] = implode( ' ', $t ); }
		if ( $f['grizta'] && ! $f['kl'] && ! $atsauk ) { $f['kl'] = 'Siunta grįžta'; }
		if ( ! $f['kl'] && $f['paid'] && ! $f['uzdarytas'] ) { foreach ( $f['eil'] as $e ) { if ( '' === $e['k'] ) { $f['kl'] = 'Prekė be sandėlio'; break; } } }
		// V14 (v3.16, 5 etapas #2): „Siuntos sukurti nepavyko“ darbalaukio lygiu — Venipak/LP plugino klaidos meta (variklio `klausimas()` žiūri į statusą `lp-parcel-failed`, kurio pluginas neskiria).
		$f['siuntos_klaida'] = ( $f['paid'] && ! $f['uzdarytas'] ) ? self::siuntos_klaida( $o, $f['vez'] ) : null;
		if ( $f['siuntos_klaida'] && ! $f['kl'] ) { $f['kl'] = 'Siuntos sukurti nepavyko'; }
		// v3.19 (5 etapas #4): kiekis sumažintas / prekė išimta → pinigai klientui grąžinami rankomis — Klausimas, kol darbuotojas nepažymi „Grąžinta“ (galioja ir įvykdytam / atšauktam).
		$f['grazinti'] = self::grazinti( $o ); if ( $f['grazinti'] && ! $f['kl'] ) { $f['kl'] = 'Grąžink klientui pinigus'; }

		// Žingsneliai kiekvienai eilutei (maketo zingsniai()) + užraktas (A8).
		foreach ( $f['eil'] as $iid => $e ) {
			$zg = array(); $lock = '';
			if ( ! empty( $e['atsaukta'] ) ) { $a = explode( '|', $e['atsaukta'] ); $f['eil'][ $iid ]['zing'] = array(); $f['eil'][ $iid ]['lock'] = 'atšaukta ' . substr( $a[0], 5, 11 ) . ' — prekės grįžo į AV' . ( ! empty( $a[2] ) ? ' (siunta ' . $a[2] . ')' : '' ); continue; } // v3.17
			if ( ! empty( $e['issiusta_l'] ) ) { $a = explode( '|', $e['issiusta_l'] ); $f['eil'][ $iid ]['zing'] = array(); $f['eil'][ $iid ]['lock'] = 'IŠSIŲSTA ' . substr( $a[0], 5, 5 ) . ( ! empty( $a[1] ) ? ' (siunta ' . $a[1] . ')' : '' ) . ' — NEPAKUOK'; continue; } // v3.18
			if ( 'av' === $e['k'] ) {
				$zg = array( array( 'Surinkti', $lapas || $av_siunta ), array( 'Lipdukas', $av_siunta ), array( 'Kurjeris paėmė', $baigta ) );
				if ( $e['gauta'] ) { array_unshift( $zg, array( 'Užsakyta iš ' . self::vardas( $e['gauta'] ), true ), array( 'Gauta į AV', true ) ); }
				if ( $av_siunta ) { $lock = 'siunta jau užregistruota'; } elseif ( $lapas ) { $lock = 'jau surinkta'; }
			} elseif ( 'tiesiai' === $e['k'] ) {
				$t = self::vardas( $e['src'] ); $p = $f['dalys'][ $e['src'] ];
				$zg = array( array( 'Lipdukas ' . $t, (bool) $p['nr'] || $p['perduota'] ), array( 'zb' === $e['src'] ? 'Suvesti į ZB' : 'Užsakyti iš ' . $t, $p['perduota'] ), array( $t . ' išsiuntė', $baigta ) );
				if ( $p['perduota'] ) { $lock = 'jau užsakyta iš ' . $t; } elseif ( $p['nr'] ) { $lock = 'siunta jau užregistruota'; }
			} elseif ( 'i_av' === $e['k'] ) {
				$t = self::vardas( $e['src'] ); $uz = $e['b'] && 'kaupiama' !== $e['b']['busena']; $ga = $e['b'] && 'gauta' === $e['b']['busena'];
				$zg = array( array( 'Užsakyti iš ' . $t . ' į AV', $uz ), array( 'Gauta į AV', $ga ), array( 'Surinkti', $lapas || $av_siunta ), array( 'Lipdukas', $av_siunta ), array( 'Kurjeris paėmė', $baigta ) );
				if ( $uz ) { $lock = 'jau užsakyta iš ' . $t . ' (užsakymas tiekėjui #' . $e['b']['partija'] . ')'; }
			}
			$dabar = false; $zing = array();
			foreach ( $zg as $x ) { $st_ = $x[1] ? 'ok' : ( ! $dabar && $rus ? 'dabar' : '' ); if ( 'dabar' === $st_ ) { $dabar = true; } $zing[] = array( $x[0], $st_ ); }
			$f['eil'][ $iid ]['zing'] = $zing;
			$f['eil'][ $iid ]['lock'] = $f['uzdarytas'] ? 'užsakymas uždarytas' : $lock;
		}

		/* ---------- TAKELIS (maketo takelis()) + EILĖS + MYGTUKAS ---------- */
		$T = array(); $eiles = array();
		if ( $atsauk ) { $T[] = array( 'atsaukta', 'atšauktas', 'bad', '', null ); }
		elseif ( $neapm ) { $T[] = array( 'apmoketa', 'neapmokėtas', 'now', '', 'apmoketa' ); $eiles['neapmoketi'] = 1; }
		if ( $f['kl'] && ! $neapm ) { $eiles['klausimai'] = 1; } // Raimis 09-03: neapmokėtas — tik Gauti + Neapmokėti, ne Klausimai
		if ( ! $atsauk && ! $neapm ) {
			$T[] = array( 'rus', 'auto' === $rus ? 'surūšiuota pati' : 'surūšiuota', $rus ? 'done' : 'now', '', $rus ? null : 'rusiuoti' );
			if ( ! $rus && ! $f['kl'] && ! $baigta ) { $eiles['nauji'] = 1; }
			if ( $av_side ) {
				$gauta_is = array(); foreach ( $f['eil'] as $e ) { if ( $e['gauta'] && 'av' === $e['k'] ) { $gauta_is[ $e['gauta'] ] = 1; } }
				foreach ( array_keys( $gauta_is ) as $s ) { if ( isset( $i_av_src[ $s ] ) ) { continue; } $T[] = array( 'uzs_' . $s, 'užsakyta iš ' . self::vardas( $s ), 'done', $s, null ); $T[] = array( 'gauta_' . $s, 'gauta į AV', 'done', $s, null ); }
				foreach ( array_keys( $i_av_src ) as $s ) {
					$nz = isset( $i_av_neuzs[ $s ] );
					$T[] = array( 'uzs_' . $s, ( $nz ? 'užsakyti iš ' : 'užsakyta iš ' ) . self::vardas( $s ) . ' į AV', $nz ? ( $rus ? 'now' : 'todo' ) : 'done', $s, $nz ? 'kons' : null );
					if ( isset( $i_av_laukia[ $s ] ) ) { $T[] = array( 'lauk_' . $s, 'laukiam iš ' . self::vardas( $s ), $nz ? 'todo' : 'wait', $s, $nz ? null : 'tiekimas' ); if ( $rus && ! $baigta ) { $eiles['laukiam'] = 1; } }
					else { $T[] = array( 'gauta_' . $s, 'gauta į AV', 'done', $s, null ); }
				}
				$T[] = array( 'surinkti', $lapas || $av_siunta ? 'surinkta' : 'surinkti', $lapas || $av_siunta ? 'done' : ( $vietoje && $rus ? 'now' : 'todo' ), 'av', $lapas || $av_siunta ? null : 'lapai' );
				$T[] = array( 'lipdukas', 'lp' === $f['vez'] ? 'lipdukas LP' : 'lipdukas', $av_siunta ? 'done' : ( $lapas && $rus ? 'now' : 'todo' ), 'lp' === $f['vez'] ? 'lp' : 'av', $av_siunta ? null : 'lipdukas' );
				if ( $rus && $vietoje && ! $av_siunta && ! $f['kl'] && ! $baigta ) { $eiles['surinkti'] = 1; }
				$av_iss = $f['dalys']['av']['issiusta'];
				$T[] = array( 'issiusta', 'kurjeris paėmė', $av_iss ? 'done' : ( $av_siunta ? 'now' : 'todo' ), 'av', $av_iss ? null : 'issiusta' );
				if ( $av_siunta && ! $av_iss ) { $eiles['paruosta'] = 1; }
			}
			foreach ( $tiesiai as $s ) {
				$p = $f['dalys'][ $s ];
				$T[] = array( 'vp_' . $s, 'lipdukas ' . self::vardas( $s ), $p['nr'] || $p['perduota'] ? 'done' : 'todo', $s, null );
				$T[] = array( 'laisk_' . $s, 'zb' === $s ? 'suvesta į ZB' : 'užsakyta iš ' . self::vardas( $s ), $p['perduota'] ? 'done' : ( $rus ? 'now' : 'todo' ), $s, $p['perduota'] ? null : 'laiskas' );
				if ( $rus && ! $p['perduota'] && ! $f['kl'] && ! $baigta ) { $eiles['laiskai'] = 1; }
				$T[] = array( 'iss_' . $s, self::vardas( $s ) . ' išsiuntė', $p['issiusta'] ? 'done' : ( $p['perduota'] ? 'wait' : 'todo' ), $s, $p['issiusta'] ? null : ( $p['perduota'] ? 'issiusta' : null ) );
				if ( $p['perduota'] && ! $p['issiusta'] ) { $eiles['paruosta'] = 1; }
			}
			if ( $baigta ) { $T[] = array( 'baigta', in_array( $st, Petshop_Desk::STATUSAI['kelyje'], true ) ? 'kelyje' : 'įvykdytas', 'done', '', null ); }
		}
		if ( $f['kl'] ) {
			foreach ( $T as $i => $t ) { if ( 'now' === $t[2] ) { $T[ $i ][2] = 'todo'; $T[ $i ][4] = null; } }
			$T[] = array( 'kl', $f['kl'], 'bad', '', 'spresti' );
		}
		$f['takelis'] = $T; $f['eiles'] = array_keys( $eiles );

		// Mygtukas = „dabar“ veiksmas su artimiausia riba; riba be sandėlio — artimiausia iš užsakymo sandėlių.
		$min = null; $min_s = '';
		foreach ( array_merge( $sandeliai, 'lp' === $f['vez'] ? array( 'lp' ) : array() ) as $s ) { $r = self::riba( $s ); if ( $r && ( null === $min || $r[2] < $min ) ) { $min = $r[2]; $min_s = $s; } }
		$f['riba_s'] = $min_s;
		$geriausias = null; $g_liko = PHP_INT_MAX; $g_s = '';
		foreach ( $T as $t ) {
			if ( ! $t[4] || ! in_array( $t[2], array( 'now', 'wait', 'bad' ), true ) ) { continue; }
			$rs = $t[3] ? $t[3] : $min_s; $r = $rs ? self::riba( $rs ) : null; $liko = $r ? $r[2] : 0;
			if ( 'tiekimas' === $t[4] ) { $liko = PHP_INT_MAX - 1; }
			if ( $liko < $g_liko ) { $g_liko = $liko; $geriausias = $t; $g_s = $rs; }
		}
		$f['skuba'] = $g_liko; $f['btn_s'] = $g_s;
		$f['btn'] = $geriausias ? self::mygtukas( $geriausias, $f ) : self::mygtukas( array( 'atidaryti', '', '', '', 'atidaryti' ), $f );
		return $f;
	}

	/** Mygtuko duomenys: [tekstas, url, dialogas|null, klasė, pasyvus]. Veiksmai — esami `ps_desk_veiksmas` arba skydelis. */
	protected static function mygtukas( $t, $f ) {
		$o = $f['o']; $id = $f['id']; $s = $t[3];
		$antraste = sprintf( 'Užsakymas #%s · %s', $o->get_order_number(), html_entity_decode( wp_strip_all_tags( $o->get_formatted_order_total() ), ENT_QUOTES | ENT_HTML5, 'UTF-8' ) );
		switch ( $t[4] ) {
			case 'apmoketa':
				return array( 'Pažymėti apmokėtu', self::veiksmo_url( 'apmoketa', $id ), array( 'antraste' => $antraste, 'tekstas' => 'Pažymėti apmokėtu? Prekės rezervuojamos; užsakymas eina į darbą.', 'ok' => 'Pažymėti apmokėtu', 'opt' => array( 'vardas' => 'be_laisko', 'tekstas' => 'Nesiųsti laiško klientui', 'def' => 0 ) ), 'p', 0 );
			case 'rusiuoti': return array( 'Rūšiuoti', '#skydelis', null, 'p', 0 );
			case 'spresti':  return array( 'Spręsti', '#skydelis', null, 'bad', 0 );
			case 'kons':
				$vis = array(); foreach ( $f['takelis'] as $t2 ) { if ( 'kons' === $t2[4] && $t2[3] ) { $vis[ $t2[3] ] = 1; } } if ( ! $vis ) { $vis[ $s ] = 1; }
				$v = array_map( array( __CLASS__, 'vardas' ), array_keys( $vis ) );
				return array( 'Užsakyti iš ' . ( count( $v ) > 1 ? implode( ' ir ', $v ) : $v[0] ) . ' į AV', self::url( array( 'eile' => 'laukiam', 'view' => null, 'q' => null, 'b' => null ) ), null, 'p', 0 );
			case 'tiekimas': return array( 'Laukiam iš ' . self::vardas( $s ), self::url( array( 'eile' => 'laukiam', 'view' => null, 'q' => null, 'b' => null ) ), null, 'ts', 1 );
			case 'lapai':    return array( 'Surinkti', self::veiksmo_url( 'lapai', $id ), null, 'p', 0 );
			case 'lipdukas':
				if ( 'lp' === $f['vez'] ) { return array( 'Lipdukas LP — per Rytinę eigą', admin_url( 'admin.php?page=' . self::SLUG . '&view=rytas' ), null, 'ts', 1 ); }
				$sv = self::d( 'uzsakymo_svoris', $o ); $vp = (string) $o->get_meta( 'venipak_pickup_point' );
				return array( 'Lipdukas', self::dl_url( 'lipdukas', $id, array( 'sandelis' => 'av' ) ), array( 'antraste' => $antraste, 'tekstas' => 'Registruoti AV siuntą Venipak? ' . ( 'venipak_pastomatas' === $f['vez'] ? 'Paštomatas ' . $vp . ' (kiekviena dėžė — atskira siunta).' : 'Kurjeris: ' . wp_strip_all_tags( str_replace( '<br/>', ', ', $o->get_formatted_shipping_address() ) ) . '.' ) . ' Svoris ' . ( $sv > 0 ? number_format( $sv, 1, ',', '' ) . ' kg' : 'nežinomas' ) . '. Siunta registruojama iš karto ir kainuoja — atšaukti galima tik Venipak savitarnoje.', 'ok' => 'Registruoti siuntą', 'opt' => array( 'vardas' => 'n', 'tekstas' => 'Dėžių', 'def' => Petshop_Desk::pakuociu( $o ), 'tipas' => 'n' ) ), 'p', 0 );
			case 'laiskas':  return array( 'zb' === $s ? 'Suvesti į ZB' : 'Užsakyti iš ' . self::vardas( $s ), self::url( array( 'eile' => 'laiskai', 'view' => null, 'q' => null, 'b' => null ) ), null, 'p', 0 );
			case 'issiusta':
				$dalis = $s ? $s : 'av'; $tekstas = 'av' === $dalis ? 'Kurjeris paėmė' : self::vardas( $dalis ) . ' išsiuntė';
				$kitos = array(); $viso = 0; $jau = 0; foreach ( $f['dalys'] as $k => $p ) { if ( ! $p ) { continue; } $viso++; if ( $k !== $dalis && empty( $p['issiusta'] ) ) { $kitos[] = self::vardas( $k ); } if ( $k !== $dalis && ! empty( $p['issiusta'] ) ) { $jau++; } }
				$paskutine = ! $kitos; $nr = ! empty( $f['dalys'][ $dalis ]['nr'] ) ? implode( ', ', $f['dalys'][ $dalis ]['nr'] ) : '';
				$laisko_vardas = $viso > 1 ? 'Išsiųsta ' . ( $jau + 1 ) . ' iš ' . $viso . ' siuntų' : 'Užsakymas išsiųstas';
				return array( $tekstas, self::dl_url( 'issiusta', $id, array( 'dalis' => $dalis ) ), array( 'antraste' => $antraste, 'tekstas' => ( 'av' === $dalis ? 'Kurjeris paėmė AV siuntą' . ( $nr ? ' ' . $nr : '' ) : self::vardas( $dalis ) . ' išsiuntė savo dalį' . ( $nr ? ' ' . $nr : '' ) ) . '?' . ( $paskutine ? ( $viso > 1 ? ' Tai paskutinė siunta — užsakymas įvykdytas.' : ' Užsakymas įvykdytas.' ) : ' Dar laukiam: ' . implode( ', ', $kitos ) . ' — užsakymas lieka atviras.' ) . ' Klientui išeina laiškas „' . $laisko_vardas . '“' . ( $nr ? ' su sekimo numeriu' : ' (sekimo numerio nėra)' ) . '.', 'ok' => $tekstas, 'opt' => array( 'vardas' => 'sekimo', 'tekstas' => 'Pranešti klientui', 'def' => 1 ) ), 'p', 0 );
		}
		return array( 'Atidaryti', '#skydelis', null, 's', 0 );
	}

	protected static function veiksmo_url( $v, $id, $g = '' ) {
		return wp_nonce_url( admin_url( 'admin-post.php?action=ps_desk_veiksmas&v=' . rawurlencode( $v ) . '&id=' . (int) $id . '&g=' . rawurlencode( $g ?: self::url() ) ), 'ps_desk_' . $v . '_' . (int) $id );
	}

	protected static function dl_url( $v, $id, $extra = array() ) {
		return wp_nonce_url( admin_url( 'admin-post.php?' . http_build_query( array_merge( array( 'action' => 'ps_dl_veiksmas', 'v' => $v, 'id' => (int) $id, 'g' => self::url( array( 'atidaryti' => (int) $id ) ) ), $extra ) ) ), 'ps_dl_' . $v . '_' . (int) $id );
	}

	/* ============================ SKYDELIO DUOMENYS ============================ */

	protected static function skydelis( $f ) {
		$o = $f['o']; $id = $f['id'];
		$g = self::url( array( 'atidaryti' => $id ) );
		$eil = array();
		foreach ( $f['eil'] as $e ) {
			$keliai = array();
			foreach ( array( 'av', 'tiesiai', 'i_av' ) as $k ) {
				if ( 'av' !== $k && ! $e['tiek'] && $k !== $e['k'] ) { continue; } // #4: tiekėjo nėra — jo kelių nerodom
				$gal = ! empty( $e['galimi'][ $k ] ) && ! $e['lock'] && $f['paid'];
				$keliai[] = array( 'k' => $k, 't' => self::kelio_vardas( $k, $e['tiek'] ), 'on' => $k === $e['k'], 'gal' => $gal,
					'u' => $gal && $k !== $e['k'] ? self::dl_url( 'kelias', $id, array( 'iid' => $e['iid'], 'k' => $k ) ) : '',
					'kodel_ne' => empty( $e['galimi'][ $k ] ) ? ( 'av' === $k ? 'AV tik ' . (int) $e['av_qty'] . ', reikia ' . $e['q'] : ( 'tiesiai' === $k && 'lp' === $f['vez'] ? 'LP Express — tik iš AV' : 'tiekėjo nėra' ) ) : $e['lock'] );
			}
			$tiek_url = ( 'i_av' === $e['k'] && $e['b'] && 'gauta' !== $e['b']['busena'] ) ? self::url( array( 'eile' => 'laukiam', 'view' => null, 'q' => null, 'b' => null, 'atidaryti' => null ) ) : '';
			$eil[] = array( 'iid' => $e['iid'], 'q' => $e['q'], 'n' => $e['n'], 'sku' => $e['sku'], 'img' => $e['img'], 'k' => $e['k'], 'keliai' => $keliai, 'kodel' => self::kodel( $e ), 'zing' => $e['zing'], 'lock' => $e['lock'], 'tiek_url' => $tiek_url, 'bukle' => $e['bukle'], 'kk' => self::kiekio_gal( $f, $e ) ); // v3.19: kk — kiekį keisti galima
		}
		$kk = null; foreach ( $eil as $x ) { if ( ! empty( $x['kk'] ) ) { $kk = array( 'u' => admin_url( 'admin-post.php' ), 'n' => wp_create_nonce( 'ps_dl_kiekis_' . $id ), 'g' => $g ); break; } } // v3.19
		$adr = $o->get_formatted_shipping_address(); if ( ! $adr ) { $adr = $o->get_formatted_billing_address(); }
		$nr = array(); foreach ( $f['dalys'] as $k => $p ) { if ( $p && ! empty( $p['nr'] ) ) { $nr[] = self::vardas( $k ) . ': ' . implode( ', ', $p['nr'] ) . self::sekimo_tekstas( $f['sek'], $p['nr'] ); } }
		foreach ( $f['dalys_atsaukta'] as $k => $a ) { $nr[] = self::vardas( $k ) . ': ' . implode( ', ', (array) ( $a['nr'] ?? array() ) ) . ' — atšaukta ' . substr( (string) ( $a['laikas'] ?? '' ), 5, 11 ) . ', prekės grįžo į AV'; } // v3.17
		foreach ( $f['dalys_baigtos'] as $k => $sar ) { foreach ( (array) $sar as $b_ ) { $nr[] = self::vardas( $k ) . ' (ankstesnė siunta): ' . implode( ', ', (array) ( $b_['nr'] ?? array() ) ) . self::sekimo_tekstas( $f['sek'], (array) ( $b_['nr'] ?? array() ) ) . ' — išsiųsta ' . substr( (string) ( $b_['laikas'] ?? '' ), 5, 11 ); } } // v3.18
		$pak = self::d( 'reikia_pakuociu', $o ) ? array( 'kiek' => Petshop_Desk::pakuociu( $o ), 'u' => self::veiksmo_url( 'pakuotes', $id, $g ) ) : null;
		$perreg = ( ! empty( $f['dalys']['av']['siunta'] ) && 'lp' !== $f['vez'] && ! $f['uzdarytas'] ) ? self::dl_url( 'lipdukas', $id, array( 'sandelis' => 'av', 'perreg' => 1 ) ) : '';
		$b = $f['btn'];
		$pastaba = ! $f['paid'] ? 'Neapmokėtas — laukiam kliento pinigų. Gavus pavedimą — „Pažymėti apmokėtu“.'
			: ( ! $f['rus'] ? 'Sistema pasiūlė, iš kur važiuos kiekviena prekė. Pataisyk, jei reikia, ir spausk „Surūšiuota“.'
			: ( 'auto' === $f['rus'] ? 'Surūšiuota pati — viskas iš vienos vietos. Keisk, jei reikia, iki lipduko.'
			: 'Surūšiuota. Kelią dar gali keisti, kol prekei nepadarytas pirmas žingsnis.' ) );
		if ( $o->get_meta( self::VEL_META ) ) { $pastaba .= ' Klientui pranešta apie vėlavimą (' . substr( (string) $o->get_meta( self::VEL_META ), 5, 11 ) . ').'; } // v3.13
		if ( $f['grizta'] || $o->get_meta( self::PAKART_ID_META ) ) { $pk_sk = self::pakartotinis_bukle( $o ); if ( $pk_sk ) { $pastaba .= ' ' . $pk_sk['t']; } } // v3.21: pakartotinio užsakymo būsena skydelyje
		if ( $f['nepakuok'] ) { $pastaba .= ' ⚠ SURINKIMO LAPE BUS IR JAU IŠSIŲSTOS PREKĖS — NEPAKUOK: ' . implode( '; ', $f['nepakuok'] ) . '. Pakuok tik prekes be užrakto „IŠSIŲSTA“.'; } // v3.18
		$antraste = sprintf( 'Užsakymas #%s · %s', $o->get_order_number(), html_entity_decode( wp_strip_all_tags( $o->get_formatted_order_total() ), ENT_QUOTES | ENT_HTML5, 'UTF-8' ) );
		$isp = array(); foreach ( $f['dalys'] as $k => $p ) { if ( ! $p ) { continue; } if ( ! empty( $p['nr'] ) ) { $isp[] = '⚠ siunta ' . implode( ', ', $p['nr'] ) . ' jau užregistruota Venipak — ištrink savitarnoje'; } if ( 'av' !== $k && ! empty( $p['perduota'] ) ) { $isp[] = '⚠ jau užsakyta iš ' . self::vardas( $k ) . ' ' . wp_date( 'm-d H:i', strtotime( $p['kada'] ) ) . ' — parašyk tiekėjui, kad nesiųstų'; } }
		foreach ( $f['eil'] as $e ) { if ( 'i_av' === $e['k'] && $e['b'] && 'kaupiama' !== $e['b']['busena'] ) { $isp[] = '⚠ „' . mb_substr( $e['n'], 0, 30 ) . '“ jau užsakyta iš ' . self::vardas( $e['src'] ) . ' į AV'; } }
		$atsaukti = ! $f['uzdarytas'] ? array( 'u' => self::veiksmo_url( 'atsaukti', $id, $g ), 'd' => array( 'antraste' => $antraste, 'tekstas' => ( $f['paid'] ? 'Atšaukti šį APMOKĖTĄ užsakymą? Prekės grįš į likutį. Pinigai NEGRĄŽINAMI automatiškai — grąžinimą ir kreditinę tvarkysi atskirai.' : 'Atšaukti šį užsakymą? Prekės grįš į likutį. Klientui laiškas nesiunčiamas.' ) . ( $isp ? ' ' . implode( ' ', $isp ) . '.' : '' ), 'ok' => 'Atšaukti užsakymą', 'opt' => array( 'vardas' => 'su_laisku', 'tekstas' => 'Pranešti klientui laišku', 'def' => 0 ) ) ) : null;
		$rus_gal = $f['paid'] && ! $f['rus'] && ! $f['uzdarytas'];
		if ( $b && ! empty( $b[2] ) && empty( $b[2]['opt'] ) ) { unset( $b[2]['opt'] ); }
		foreach ( $f['eil'] as $e ) { if ( ! $e['k'] ) { $rus_gal = false; } }
		return array(
			'id' => $id, 'nr' => $o->get_order_number(), 'st' => wc_get_order_statuses()[ 'wc-' . $f['st'] ] ?? $f['st'], 'uzdarytas' => $f['uzdarytas'], 'kur' => self::kur_dabar( $f ),
			'kl' => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ), 'suma' => html_entity_decode( wp_strip_all_tags( $o->get_formatted_order_total() ), ENT_QUOTES | ENT_HTML5, 'UTF-8' ), 'apmok' => ( $f['paid'] ? 'apmokėta · ' : 'neapmokėta · ' ) . $o->get_payment_method_title(),
			'tel' => $o->get_billing_phone(), 'mail' => $o->get_billing_email(), 'adresas' => wp_strip_all_tags( str_replace( '<br/>', ', ', $adr ) ),
			'vezejas' => self::d( 'vezejo_vardas', $o ), 'vieta' => (string) $o->get_meta( 'venipak_pickup_point' ), 'pastaba_kl' => $o->get_customer_note(),
			'eil' => $eil, 'pastaba' => $pastaba, 'nr_siuntos' => $nr, 'pak' => $pak, 'perreg' => $perreg,
			'klausimas' => $f['kl'],
			'rusiuoti' => $rus_gal ? self::dl_url( 'rusiuoti', $id ) : '', 'matyti' => ! empty( $f['naujas'] ) ? 1 : 0,
			'btn' => ( $b && '#skydelis' !== $b[1] ) ? array( 't' => $b[0], 'u' => $b[1], 'd' => $b[2], 'pasyvus' => $b[4] ) : null,
			'atsaukti' => $atsaukti, 'sekimo' => ( class_exists( 'Petshop_Siuntos' ) && Petshop_Siuntos::turi( $id ) ) ? admin_url( 'admin.php?page=ps-siuntos-laiskas&id=' . $id ) : '',
			'laukti' => ( $f['kl'] && ! $f['uzdarytas'] ) ? self::veiksmo_url( 'klaus', $id, $g ) . '&t=laukti' : '',
			'nesurinkta' => ( ! empty( $f['dalys']['av']['lapas'] ) && empty( $f['dalys']['av']['siunta'] ) && ! $f['uzdarytas'] ) ? self::dl_url( 'nesurinkta', $id ) : '',
			'velavimas' => self::velavimo_mygtukas( $f ), // v3.15
			'red' => self::redagavimas( $f ), 'siuntos_klaida' => $f['siuntos_klaida'] ? $f['siuntos_klaida']['t'] : '', // v3.16
			'kk' => $kk, // v3.19
			'zn' => wp_create_nonce( 'ps_dl_zurnalas' ),
		);
	}

	/** „Kodėl“ po keliais (maketo kodel()). */
	protected static function kodel( $e ) {
		$t = $e['tiek'] ? self::vardas( $e['tiek'] ) : '';
		if ( $e['gauta'] && 'av' === $e['k'] ) { $s = 'Gauta į AV iš ' . self::vardas( $e['gauta'] ) . ( preg_match( '/partija #(\d+)/', (string) $e['kodel'], $m ) ? ' (užsakymas tiekėjui #' . $m[1] . ')' : '' ) . ' — siunčiam iš AV.'; return $e['reduced'] ? $s . ' Rezervuota.' : $s; }
		if ( '' === $e['k'] ) { return 'AV nėra, tiekėjo nėra. Jei prekė yra AV — pažymėk „Iš AV“ (likutis nenurašomas); jei ne — parašyk klientui arba atšauk.'; }
		if ( null !== $e['av_qty'] && $e['av_qty'] >= $e['q'] ) { $s = 'AV yra ' . (int) $e['av_qty'] . ' — siunčiam iš AV.'; }
		elseif ( $t && 'i_av' === $e['k'] && ! $e['b'] && ( $pid = self::atvira_partija( $e['tiek'] ) ) ) { $s = 'AV ' . ( $e['av_qty'] ? 'tik ' . (int) $e['av_qty'] : 'nėra' ) . ', ' . $t . ' turi. Užsakymas tiekėjui #' . $pid . ' (' . $t . ' į AV) jau atviras — siūlom vežti į AV ir siųsti viena siunta. Jei skubu — „' . $t . ' siunčia klientui“.'; }
		elseif ( $t ) { $s = 'AV ' . ( $e['av_qty'] ? 'tik ' . (int) $e['av_qty'] : 'nėra' ) . ', ' . $t . ' turi — ' . $t . ' siunčia klientui. Jei nori vienos siuntos — „' . $t . ' veža į AV“.'; }
		else { $s = 'AV ' . ( $e['av_qty'] ? 'tik ' . (int) $e['av_qty'] : 'nėra' ) . ', reikia ' . $e['q'] . ', tiekėjo nėra. Užsakyk pats ir pažymėk „Iš AV“, kai turėsi; arba parašyk klientui / atšauk.'; }
		if ( $e['reduced'] && 'av' === $e['k'] ) { $s .= ' Rezervuota.'; }
		if ( $e['kodel'] && ( 0 === strpos( $e['kodel'], 'darbalaukis:' ) || 0 === strpos( $e['kodel'], 'parsivežta' ) ) ) { $s .= ' · ' . $e['kodel']; }
		return $s;
	}

	/** v3.15 (5 etapas #1): mygtukas „Pranešti klientui apie vėlavimą“ — kada rodyti ir ką sako dialogas. Sąlyga: apmokėtas, neuždarytas, žymės nėra, bent viena dalis neišsiųsta. */
	protected static function velavimo_mygtukas( $f ) {
		$o = $f['o']; if ( ! $f['paid'] || $f['uzdarytas'] || $o->get_meta( self::VEL_META ) || ! $o->get_billing_email() ) { return null; }
		$liko = 0; $iss = 0; foreach ( $f['dalys'] as $p ) { if ( ! $p ) { continue; } if ( ! empty( $p['issiusta'] ) ) { $iss++; } else { $liko++; } }
		if ( ! $liko ) { return null; }
		$nr = $o->get_order_number(); $vardas = trim( (string) $o->get_billing_first_name() );
		$p1 = $iss ? sprintf( 'Likusių Jūsų užsakymo Nr. %s prekių surinkimas truputį užtruko.', $nr ) : sprintf( 'Jūsų užsakymo Nr. %s surinkimas truputį užtruko.', $nr );
		return array( 'u' => self::dl_url( 'velavimas', $f['id'] ), 'd' => array( 'antraste' => sprintf( 'Užsakymas #%s · %s', $nr, html_entity_decode( wp_strip_all_tags( $o->get_formatted_order_total() ), ENT_QUOTES | ENT_HTML5, 'UTF-8' ) ),
			'tekstas' => 'Klientui (' . $o->get_billing_email() . ') išeis laiškas „Jūsų užsakymą Nr. ' . $nr . ' dar komplektuojame“: „' . ( $vardas ? 'Sveiki, ' . $vardas . '.' : 'Sveiki.' ) . ' ' . $p1 . ' Išsiųsime jį kaip galėdami greičiau. Ačiū už kantrybę. Išsiuntę užsakymą informuosime Jus atskiru laišku. Jei turite klausimų, tiesiog atsakykite į šį laišką.“ Vieną kartą — po to mygtuko nebebus.',
			'ok' => 'Pranešti klientui' ) );
	}

	/* ============================ v3.16 — REDAGUOTI (adresas / paštomatas) + V14 ============================ */

	/** V14: vežėjo klaida iš plugino meta → ['vez'=>venipak|lp,'t'=>lietuviškai,'raw'=>…] arba null. */
	protected static function siuntos_klaida( $o, $vez ) {
		if ( 'lp' === $vez ) {
			if ( 'lp-parcel-failed' !== (string) $o->get_meta( '_woo_lithuaniapost_shipping_status_value' ) ) { return null; }
			$e = $o->get_meta( '_woo_lithuaniapost_parcel_create_error' ); $raw = ''; $t = '';
			$list = is_array( $e ) ? $e : ( is_object( $e ) ? array( $e ) : array() );
			foreach ( $list as $x ) { $x = (array) $x; $raw .= trim( ( $x['error'] ?? '' ) . ' ' . ( $x['error_description'] ?? '' ) . ' ' . ( $x['field'] ?? '' ) ) . '; '; if ( ! $t && false !== stripos( (string) ( $x['field'] ?? '' ), 'terminal' ) ) { $t = 'LP Express: neteisingas paštomatas'; } }
			$raw = trim( $raw, '; ' ); if ( ! $raw && is_string( $e ) ) { $raw = $e; }
			if ( ! $t ) { $t = false !== stripos( $raw, 'address' ) ? 'LP Express: neteisingas adresas' : 'LP Express nepriėmė siuntos'; }
			return array( 'vez' => 'lp', 't' => $t . ( $raw ? ' (' . mb_substr( $raw, 0, 120 ) . ')' : '' ), 'raw' => $raw );
		}
		if ( 0 !== strpos( (string) $vez, 'venipak' ) ) { return null; }
		$d = json_decode( (string) $o->get_meta( 'venipak_shipping_order_data' ), true );
		if ( ! is_array( $d ) || 'error' !== ( $d['status'] ?? '' ) || empty( $d['error_message'] ) || ! empty( $d['pack_numbers'] ) ) { return null; }
		$raw = wp_strip_all_tags( (string) $d['error_message'] ); $t = 'Venipak nepriėmė siuntos';
		if ( false !== stripos( $raw, 'empty response' ) ) { $t = 'Venipak neatsakė'; }
		elseif ( preg_match( '/post.?code|pašto/i', $raw ) ) { $t = 'Venipak: neteisingas pašto kodas'; }
		elseif ( preg_match( '/pickup|locker|terminal|paštomat/i', $raw ) ) { $t = 'Venipak: neteisingas paštomatas'; }
		elseif ( preg_match( '/address|city|adres|miest/i', $raw ) ) { $t = 'Venipak: neteisingas adresas'; }
		elseif ( preg_match( '/phone|tel/i', $raw ) ) { $t = 'Venipak: neteisingas telefonas'; }
		return array( 'vez' => 'venipak', 't' => $t . ' (' . mb_substr( $raw, 0, 120 ) . ')', 'raw' => $raw );
	}

	/** Redagavimo duomenys skydeliui: kada galima, kokie laukai, dabartinės reikšmės, įspėjimai. null — negalima (priežastis atskirai `red_ne`). */
	protected static function redagavimas( $f ) {
		$o = $f['o']; $id = $f['id'];
		if ( $f['uzdarytas'] ) { return null; }
		$liko = 0; foreach ( $f['dalys'] as $p ) { if ( $p && empty( $p['issiusta'] ) ) { $liko++; } }
		if ( ! $liko && $f['dalys'] ) { return null; }
		// v3.18 (Raimis 09-04): po BET KURIO užregistruoto lipduko — nieko nedarom (rankiniu būdu).
		foreach ( $f['dalys'] as $p ) { if ( $p && ! empty( $p['nr'] ) ) { return null; } }
		if ( 'lp' === $f['vez'] && ( $o->get_meta( '_woo_lithuaniapost_shipping_item_id' ) || $o->get_meta( '_woo_lithuaniapost_barcode' ) ) ) { return null; }
		$vez = $f['vez']; $tipas = 'lp' === $vez ? 'lp' : ( 'venipak_pastomatas' === $vez ? 'pastomatas' : 'kurjeris' );
		$vieta = array( 'id' => '', 't' => '' );
		if ( 'pastomatas' === $tipas ) { $vieta['id'] = (string) $o->get_meta( 'venipak_pickup_point' ); $pt = function_exists( 'venipak_resolve_order_pickup' ) ? venipak_resolve_order_pickup( $o ) : false; $vieta['t'] = $pt ? self::vietos_tekstas( $pt ) : $vieta['id']; }
		if ( 'lp' === $tipas ) { $vieta['id'] = (string) $o->get_meta( '_woo_lithuaniapost_lpexpress_terminal_id' ); $vieta['t'] = (string) $o->get_meta( '_woo_lithuaniapost_lpexpress_terminal' ) ?: $vieta['id']; }
		return array( 'u' => admin_url( 'admin-post.php' ), 'n' => wp_create_nonce( 'ps_dl_red_' . $id ), 'g' => self::url( array( 'atidaryti' => $id ) ), 'tipas' => $tipas,
			'laukai' => array( 'vardas' => $o->get_shipping_first_name() ?: $o->get_billing_first_name(), 'pavarde' => $o->get_shipping_last_name() ?: $o->get_billing_last_name(), 'adresas' => $o->get_shipping_address_1(), 'adresas2' => $o->get_shipping_address_2(), 'miestas' => $o->get_shipping_city(), 'kodas' => $o->get_shipping_postcode(), 'tel' => $o->get_billing_phone() ?: $o->get_shipping_phone() ), 'vieta' => $vieta );
	}
	protected static function vietos_tekstas( $pt ) { $pt = (array) $pt; return trim( ( $pt['display_name'] ?? $pt['name'] ?? '' ) . ' — ' . ( $pt['address'] ?? '' ) . ', ' . ( $pt['city'] ?? '' ), ' —,' ); }

	/** Paštomatų sąrašas formai (LT): Venipak — plugino `venipak_fetch_pickups('LT')`; LP — plugino lentelė `woo_lithuaniapost_unisend_terminals`. [[id, tekstas], …] pagal miestą. */
	public static function ajax_vietos() {
		if ( ! current_user_can( 'edit_shop_orders' ) || ! check_ajax_referer( 'ps_dl_zurnalas', 'n', false ) ) { wp_send_json_error( 'teisės', 403 ); }
		$vez = sanitize_key( $_GET['vez'] ?? '' ); $out = array();
		if ( 'pastomatas' === $vez ) {
			if ( ! function_exists( 'venipak_fetch_pickups' ) ) { wp_send_json_error( 'Venipak plugino nėra', 500 ); }
			foreach ( (array) venipak_fetch_pickups( 'LT' ) as $pt ) { $pt = (array) $pt; if ( empty( $pt['id'] ) ) { continue; } $out[] = array( (string) $pt['id'], (string) ( $pt['city'] ?? '' ), self::vietos_tekstas( $pt ) ); }
		} elseif ( 'lp' === $vez ) {
			global $wpdb; $t = $wpdb->prefix . 'woo_lithuaniapost_unisend_terminals';
			foreach ( (array) $wpdb->get_results( "SELECT terminal_id, name, address, city FROM {$t} WHERE country_code = 'LT'", ARRAY_A ) as $r ) { $out[] = array( (string) $r['terminal_id'], (string) $r['city'], trim( $r['name'] . ' — ' . $r['address'] . ', ' . $r['city'] ) ); }
		} else { wp_send_json_error( 'nežinomas vežėjas', 400 ); }
		usort( $out, function ( $a, $b ) { return strcasecmp( $a[1] . ' ' . $a[2], $b[1] . ' ' . $b[2] ); } );
		wp_send_json_success( $out );
	}

	/** „Redaguoti“ → „Išsaugoti“ (POST admin-post `ps_dl_redaguoti`): adresas / paštomatas / telefonas be WC; pastaba prieš/po, įvykis `redaguoti`, klaidos meta nuimama, laiškas klientui (varnelė). */
	public static function redaguoti_vykdyti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$id = absint( $_POST['id'] ?? 0 ); check_admin_referer( 'ps_dl_red_' . $id );
		$o = wc_get_order( $id ); if ( ! $o ) { wp_die( 'Užsakymas nerastas' ); }
		$atgal = wp_validate_redirect( wp_unslash( $_POST['g'] ?? '' ), admin_url( 'admin.php?page=' . self::SLUG . '&atidaryti=' . $id ) );
		$u = wp_get_current_user(); $lock = 'ps_dl_lock_' . $id;
		$baigti = function ( $k, $t ) use ( $o, $atgal, $lock ) { delete_transient( $lock ); wp_safe_redirect( add_query_arg( array( 'pd_ok' => $k, 'pd_nr' => rawurlencode( $o->get_order_number() . '|' . $t ) ), $atgal ) ); exit; };
		if ( get_transient( $lock ) ) { $baigti( 'dl_info', 'veiksmas jau vykdomas — palauk sekundę' ); } set_transient( $lock, 1, 20 );
		try {
			$f = self::faktai( $o, self::zurnalas( array( $id ) ) ); $red = self::redagavimas( $f );
			if ( ! $red ) { $baigti( 'dl_klaida', 'redaguoti nebegalima — lipdukas jau užregistruotas, užsakymas uždarytas arba viskas išsiųsta (keisk rankiniu būdu)' ); }
			$g = function ( $k ) { return trim( sanitize_text_field( wp_unslash( $_POST[ $k ] ?? '' ) ) ); };
			$tel = $g('tel'); $pries = array(); $po = array(); $zin = array();
			if ( 'kurjeris' === $red['tipas'] ) {
				$nauji = array( 'vardas' => $g('vardas'), 'pavarde' => $g('pavarde'), 'adresas' => $g('adresas'), 'adresas2' => $g('adresas2'), 'miestas' => $g('miestas'), 'kodas' => $g('kodas') );
				if ( '' === $nauji['adresas'] || '' === $nauji['miestas'] || '' === $nauji['kodas'] ) { $baigti( 'dl_klaida', 'adresas, miestas ir pašto kodas privalomi' ); }
				$set = array( 'vardas' => 'set_shipping_first_name', 'pavarde' => 'set_shipping_last_name', 'adresas' => 'set_shipping_address_1', 'adresas2' => 'set_shipping_address_2', 'miestas' => 'set_shipping_city', 'kodas' => 'set_shipping_postcode' );
				$pav = array( 'vardas' => 'Vardas', 'pavarde' => 'Pavardė', 'adresas' => 'Adresas', 'adresas2' => 'Adresas (2)', 'miestas' => 'Miestas', 'kodas' => 'Pašto kodas' );
				foreach ( $nauji as $k => $v ) { $buvo = (string) $red['laukai'][ $k ]; if ( $v !== $buvo ) { $pries[ $k ] = $buvo; $po[ $k ] = $v; $zin[] = $pav[ $k ] . ': „' . $buvo . '“ → „' . $v . '“'; $o->{$set[ $k ]}( $v ); } }
			} elseif ( 'pastomatas' === $red['tipas'] ) {
				$vid = $g('vieta'); if ( '' === $vid ) { $baigti( 'dl_klaida', 'paštomatas nepasirinktas' ); }
				if ( $vid !== $red['vieta']['id'] ) {
					if ( ! function_exists( 'venipak_store_order_pickup' ) || ! function_exists( 'venipak_find_pickup_by_id' ) ) { $baigti( 'dl_klaida', 'Venipak plugino paštomatų funkcijų nėra' ); }
					$pt = venipak_find_pickup_by_id( $vid ); if ( ! $pt ) { $baigti( 'dl_klaida', 'tokio Venipak paštomato sąraše nėra (' . $vid . ')' ); }
					venipak_store_order_pickup( $o, $vid ); $nt = self::vietos_tekstas( $pt );
					$pries['vieta'] = $red['vieta']['t']; $po['vieta'] = $nt; $zin[] = 'Paštomatas: „' . $red['vieta']['t'] . '“ → „' . $nt . '“';
				}
			} elseif ( 'lp' === $red['tipas'] ) {
				$vid = $g('vieta'); if ( '' === $vid ) { $baigti( 'dl_klaida', 'paštomatas nepasirinktas' ); }
				if ( $vid !== $red['vieta']['id'] ) {
					global $wpdb; $tt = $wpdb->prefix . 'woo_lithuaniapost_unisend_terminals';
					$r = $wpdb->get_row( $wpdb->prepare( "SELECT terminal_id, name, address, city FROM {$tt} WHERE terminal_id = %s AND country_code = 'LT' LIMIT 1", $vid ), ARRAY_A );
					if ( ! $r ) { $baigti( 'dl_klaida', 'tokio LP paštomato sąraše nėra (' . $vid . ')' ); }
					$nt = sprintf( '%s - %s, %s', $r['name'], $r['address'], $r['city'] ); // plugino formatas (order-service 840)
					$o->update_meta_data( '_woo_lithuaniapost_lpexpress_terminal_id', $r['terminal_id'] ); $o->update_meta_data( '_woo_lithuaniapost_lpexpress_terminal', $nt );
					$pries['vieta'] = $red['vieta']['t']; $po['vieta'] = $nt; $zin[] = 'Paštomatas: „' . $red['vieta']['t'] . '“ → „' . $nt . '“';
				}
			}
			if ( $tel !== (string) $red['laukai']['tel'] ) { if ( '' === $tel ) { $baigti( 'dl_klaida', 'telefonas privalomas' ); } $pries['tel'] = $red['laukai']['tel']; $po['tel'] = $tel; $zin[] = 'Tel.: „' . $red['laukai']['tel'] . '“ → „' . $tel . '“'; $o->set_billing_phone( $tel ); $o->set_shipping_phone( $tel ); }
			if ( ! $zin ) { $baigti( 'dl_info', 'nieko nepakeista' ); }
			// Vežėjo klaida — nuimama, kad lipduką būtų galima registruoti iš naujo ir Klausimas dingtų.
			$nuimta = '';
			if ( $f['siuntos_klaida'] ) {
				if ( 'lp' === $f['siuntos_klaida']['vez'] ) { $o->update_meta_data( '_woo_lithuaniapost_shipping_status_value', 'lp-parcel-await' ); $o->delete_meta_data( '_woo_lithuaniapost_parcel_create_error' ); $nuimta = 'LP klaida nuimta — kurk siuntą iš naujo. '; }
				else { $d = json_decode( (string) $o->get_meta( 'venipak_shipping_order_data' ), true ); if ( is_array( $d ) ) { $d['status'] = ''; $d['error_message'] = ''; $o->update_meta_data( 'venipak_shipping_order_data', wp_json_encode( $d ) ); } $nuimta = 'Venipak klaida nuimta — registruok lipduką iš naujo. '; }
			}
			$o->add_order_note( sprintf( 'Darbalaukis: pristatymo duomenys pakeisti (%s): %s. %sKlientui laiškas nesiųstas (Raimis 09-04: jei reikia — darbuotojas rašo pats).', $u->display_name, implode( '; ', $zin ), $nuimta ), false, true ); $o->save();
			if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $id, 'sritis' => 'desk', 'veiksmas' => 'redaguoti', 'rezultatas' => 'ok', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'pries' => $pries, 'po' => $po, 'pastaba' => trim( $red['tipas'] . ': ' . implode( '; ', $zin ) . ' · ' . $nuimta ) ) ); }
			do_action( 'ps_juosta_isvalyti' );
			$baigti( 'dl_info', 'pristatymo duomenys pakeisti: ' . implode( '; ', $zin ) . ( $nuimta ? ' · ' . trim( $nuimta ) : '' ) );
		} catch ( Throwable $e ) { $baigti( 'dl_klaida', 'klaida: ' . $e->getMessage() ); }
	}

	/* ============================ VEIKSMAI ============================ */

	public static function vykdyti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$v  = isset( $_GET['v'] ) ? sanitize_key( wp_unslash( $_GET['v'] ) ) : '';
		$id = isset( $_GET['id'] ) ? absint( $_GET['id'] ) : 0;
		check_admin_referer( 'ps_dl_' . $v . '_' . $id );
		$o = wc_get_order( $id );
		if ( ! $o && ! ( 'issiusta' === $v && ! empty( $_GET['ids'] ) ) ) { wp_die( 'Užsakymas nerastas' ); }
		$atgal = wp_validate_redirect( isset( $_GET['g'] ) ? wp_unslash( $_GET['g'] ) : '', admin_url( 'admin.php?page=' . self::SLUG ) );
		$u = wp_get_current_user();
		$rez = array( 'dl_klaida', 'nežinomas veiksmas' );
		$lock = 'ps_dl_lock_' . $id;
		if ( $id && get_transient( $lock ) ) { wp_safe_redirect( add_query_arg( array( 'pd_ok' => 'dl_info', 'pd_nr' => rawurlencode( $o->get_order_number() . '|veiksmas jau vykdomas — palauk sekundę' ) ), $atgal ) ); exit; }
		if ( $id ) { set_transient( $lock, 1, 20 ); }
		try {
			if ( 'kelias' === $v ) { $rez = self::keisti_kelia( $o, absint( $_GET['iid'] ?? 0 ), sanitize_key( $_GET['k'] ?? '' ), $u ); }
			elseif ( 'rusiuoti' === $v ) { $rez = self::rusiuoti( $o, $u ); }
			elseif ( 'grizta_is_naujo' === $v ) { $rez = self::grizta_is_naujo( $o, $u ); }
			elseif ( 'grizta_atsaukti' === $v ) { $rez = self::grizta_atsaukti( $o, $u ); }
			elseif ( 'grazinta' === $v ) { $rez = self::grazinta( $o, $u ); } // v3.19
			elseif ( 'pakart_nuoroda' === $v ) { $rez = self::pakartotinis_nuoroda( $o, $u ); } // v3.21
			elseif ( 'pakart_apmoketa' === $v ) { $rez = self::pakartotinis_pavedimas( $o, $u ); } // v3.23
			elseif ( 'velavimas' === $v ) { $tz = wp_timezone(); $dn = new DateTime( 'now', $tz ); $r = self::velavimo_laiskas( $o, $dn->format( 'Y-m-d' ), $u ); $rez = array( $r[0] ? 'dl_info' : 'dl_klaida', $r[0] ? 'klientui pranešta apie vėlavimą — ' . $r[1] : 'nepranešta: ' . $r[1] ); } // v3.15
			elseif ( 'nesurinkta' === $v ) {
				$o->delete_meta_data( '_ps_surinkta' ); $o->add_order_note( 'Darbalaukis: surinkimas atšauktas (' . $u->display_name . ') — užsakymas grįžo į „Surinkti“.', false, true ); $o->save();
				if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $id, 'sritis' => 'desk', 'veiksmas' => 'nesurinkta', 'rezultatas' => 'ok', 'kanalas' => 'web', 'pastaba' => 'surinkimas atšauktas' ) ); }
				$rez = array( 'dl_info', 'surinkimas atšauktas — grįžo į „Surinkti“' );
			}
			elseif ( 'issiusta' === $v ) {
				$dalis = isset( $_GET['dalis'] ) ? sanitize_key( $_GET['dalis'] ) : '';
				$ids = isset( $_GET['ids'] ) ? array_filter( array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_GET['ids'] ) ) ) ) ) : array();
				if ( $ids ) { $ok = array(); $ne = array(); foreach ( $ids as $oid ) { $oo = wc_get_order( $oid ); if ( ! $oo ) { continue; } $r = self::issiusta( $oo, $u, ! empty( $_GET['sekimo'] ), $dalis ); if ( in_array( $r[0], array( 'dl_issiusta', 'dl_dalis' ), true ) ) { $ok[] = '#' . $oo->get_order_number(); } else { $ne[] = '#' . $oo->get_order_number() . ' — ' . $r[1]; } }
					$rez = array( $ne ? 'dl_info' : 'dl_issiusta_visi', ( $ok ? 'paimta: ' . implode( ', ', $ok ) : 'nieko nepaimta' ) . ( $ne ? ' · liko: ' . implode( '; ', $ne ) : '' ) ); }
				else { $rez = self::issiusta( $o, $u, ! empty( $_GET['sekimo'] ), $dalis ); }
			}
			elseif ( 'lipdukas' === $v ) {
				$n = isset( $_GET['n'] ) ? max( 1, min( 20, absint( $_GET['n'] ) ) ) : 0;
				if ( $n && $n !== (int) $o->get_meta( Petshop_Desk::META_PAK ) ) { $o->update_meta_data( Petshop_Desk::META_PAK, $n ); $o->add_order_note( 'Darbalaukis: dėžių skaičius — ' . $n . '.', false, true ); $o->save(); }
				// Mišrus: kita dalis jau registruota (plugino raktas užimtas) — šiai daliai variklis reikalauja `perreg` (E3/H258).
				$sand = sanitize_key( $_GET['sandelis'] ?? 'av' ); $perreg = ! empty( $_GET['perreg'] );
				if ( ! $perreg && self::d( 'turi_siunta', $o ) ) { $fs = self::faktai( $o, array() ); if ( empty( $fs['dalys'][ $sand ]['nr'] ) ) { $perreg = true; } }
				$reg = $perreg ? '&perreg=1' . ( $n ? '&n=' . $n : '' ) : '';
				if ( $id ) { delete_transient( $lock ); }
				wp_safe_redirect( self::veiksmo_url( 'vp_reg', $id, $atgal ) . '&ids=' . $id . '&sandelis=' . rawurlencode( $sand ) . $reg );
				exit;
			}
		} catch ( Throwable $e ) { $rez = array( 'dl_klaida', 'klaida: ' . $e->getMessage() ); }
		if ( $id ) { delete_transient( $lock ); }
		wp_safe_redirect( add_query_arg( array( 'pd_ok' => $rez[0], 'pd_nr' => rawurlencode( ( $o ? $o->get_order_number() : '' ) . '|' . $rez[1] ) ), $atgal ) );
		exit;
	}

	/**
	 * 3 etapas: „Laukiam iš tiekėjų“ kortelė — užsakymas tiekėjui į AV ir priėmimas čia pat.
	 * Variklis (`Petshop_AV_Tiekimas::veiksmas()`, registras H1–H3) neliestas: sudedam neužsakytas „veža į AV“ eilutes
	 * į kaupiamą partiją (kaip variklio `kons`, tik šiam tiekėjui) ir paleidžiam `admin_post_ps_tiekimas` su savo pačių
	 * patvirtintu nonce — žurnalas (`petshop-uzsakymu-ivykiai`) ir grįžimas (`grizti_cia`) veikia kaip Tiekimo lange.
	 */
	public static function tiekimas_vykdyti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$src = sanitize_key( wp_unslash( $_POST['tiekejas'] ?? '' ) ); $pid = absint( $_POST['partija'] ?? 0 ); $ka = sanitize_key( wp_unslash( $_POST['ka'] ?? '' ) );
		check_admin_referer( 'ps_dl_tiek_' . $src . '_' . $pid );
		$atgal = wp_validate_redirect( wp_unslash( $_POST['ps_dl_g'] ?? '' ), admin_url( 'admin.php?page=' . self::SLUG . '&eile=laukiam' ) );
		$klaida = function ( $t ) use ( $atgal, $src ) { wp_safe_redirect( add_query_arg( array( 'pd_ok' => 'dl_klaida', 'pd_nr' => rawurlencode( self::vardas( $src ) . '|' . $t ) ), $atgal ) ); exit; };
		if ( ! $src || ! class_exists( 'Petshop_AV_Tiekimas' ) || ! in_array( $ka, array( 'uzsakyti', 'kartu', 'priimti' ), true ) ) { $klaida( 'nežinomas veiksmas' ); }
		$u = wp_get_current_user(); $pirmas = 0;
		if ( 'priimti' !== $ka ) {
			$pid = Petshop_AV_Tiekimas::atvira_partija( $src ); // kaupiama arba nauja
			$ids = isset( $_POST['ids'] ) ? array_filter( array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_POST['ids'] ) ) ) ) ) : array();
			$n = 0;
			foreach ( $ids as $oid ) {
				$o = wc_get_order( $oid ); if ( ! $o || ! $o->is_paid() ) { continue; }
				$spr = self::d( 'misrus_sprendimas', $o );
				foreach ( $o->get_items() as $iid => $it ) {
					list( $k, $s ) = self::eilutes_kelias( $o, $iid, $it, $spr );
					if ( 'i_av' !== $k || $s !== $src || Petshop_AV_Tiekimas::eilutes_bukle( $oid, (int) $iid ) ) { continue; }
					if ( Petshop_AV_Tiekimas::ideti_eilute( $o, (int) $iid, $src ) ) {
						$it->update_meta_data( '_ps_konsolidacija', 1 ); $it->save(); $n++; if ( ! $pirmas ) { $pirmas = $oid; }
						if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $oid, 'eilute' => (int) $iid, 'sritis' => 'desk', 'veiksmas' => 'kons', 'rezultatas' => 'ok', 'kanalas' => 'web', 'po' => array( 'partija' => $pid, 'tiekejas' => $src ), 'pastaba' => mb_substr( $it->get_name(), 0, 60 ) . ' → užsakymas tiekėjui #' . $pid ) ); }
					}
				}
			}
			if ( ! $pirmas ) { foreach ( Petshop_AV_Tiekimas::partijos_eilutes( $pid ) as $e ) { if ( $e->order_id ) { $pirmas = (int) $e->order_id; break; } } }
			if ( ! Petshop_AV_Tiekimas::partijos_eilutes( $pid ) ) { $klaida( 'nėra ko užsakyti į AV — prekių sąrašas tuščias' ); }
			$_POST['ka'] = 'kartu' === $ka ? 'issaugoti' : 'uzsakyti';
			if ( 'kartu' === $ka ) { $_POST['ps_dl_kartu'] = $pid; }
		} else {
			if ( ! $pid ) { $klaida( 'užsakymo tiekėjui nėra' ); }
			foreach ( Petshop_AV_Tiekimas::partijos_eilutes( $pid ) as $e ) { if ( $e->order_id ) { $pirmas = (int) $e->order_id; break; } }
		}
		$_POST['partija'] = $pid; $_POST['ps_dl_pirmas'] = $pirmas;
		$_POST['_wpnonce'] = wp_create_nonce( 'ps_tiekimas_' . $pid ); $_REQUEST['_wpnonce'] = $_POST['_wpnonce'];
		unset( $_POST['ids'] );
		do_action( 'ps_juosta_isvalyti' );
		do_action( 'admin_post_ps_tiekimas' ); // variklis + žurnalas; grįžimas per `grizti_cia()`
		exit;
	}

	/** Eilutės AV likučio judesys: +q / −q pagal prekės rūšį (grynai AV → `_stock`, AV+tiekėjas → `_own_stock_qty`). */
	/* ============================ v3.19: KIEKIS (5 etapas #4, B modelis — spec §12.5) ============================ */

	protected static function eur( $v ) { return number_format( (float) $v, 2, ',', '' ); }

	/** v3.20 (spec §12.5): pristatymo įkainis pakartotiniam užsakymui, su PVM — [suma|null, paaiškinimas]. */
	protected static function pristatymo_ikainis( $o, $vez ) {
		$inst = 0; $cost = 0.0; $tax = 0.0;
		foreach ( $o->get_items( 'shipping' ) as $s ) { $inst = (int) $s->get_instance_id(); $cost = (float) $s->get_total(); $tax = (float) $s->get_total_tax(); break; }
		$santykis = ( $cost > 0 && $tax > 0 ) ? $tax / $cost : 0.21;
		if ( $inst && class_exists( 'WC_Shipping_Zones' ) ) {
			$m = WC_Shipping_Zones::get_shipping_method( $inst );
			if ( $m ) {
				$raw = (string) $m->get_option( 'fee' ); if ( '' === $raw ) { $raw = (string) $m->get_option( 'fixed_cost' ); }
				$raw = str_replace( ',', '.', $raw );
				if ( is_numeric( $raw ) && (float) $raw > 0 ) { return array( round( (float) $raw * ( 1 + $santykis ), 2 ), $m->get_title() . ' įkainis' ); }
			}
		}
		if ( $cost > 0 ) { return array( round( $cost + $tax, 2 ), 'kaip sumokėta užsakyme' ); }
		if ( 'venipak_pastomatas' === $vez || 'lp' === $vez ) { return array( 2.15, 'paštomato įkainis' ); }
		if ( 'venipak_kurjeris' === $vez ) { return array( 3.99, 'kurjerio įkainis iki 50 kg' ); }
		return array( null, 'įkainį nustatyk pats' );
	}

	/** v3.20 (spec §12.5): „Siunta grįžta“ sumos — [sumoketa, grazinti (− 3,99), baze, ikainis, ikainis_t, pakart (+ 3,99), visa] arba null. */
	protected static function grizta_sumos( $f ) {
		$o = $f['o']; $g = (array) ( $f['grizta'] ?? array() ); if ( ! $g ) { return null; }
		$kitos = array(); foreach ( (array) $f['dalys'] as $dk => $dp ) { if ( $dp && ! isset( $g[ $dk ] ) ) { $kitos[] = self::vardas( $dk ); } }
		$visa = ! $kitos;
		if ( $visa ) { $s = (float) $o->get_total(); $baze = 'visa siunta grįžta — sumokėta su pristatymu'; }
		else {
			$s = 0.0;
			foreach ( $o->get_items() as $iid => $it ) { $e = $f['eil'][ (int) $iid ] ?? null; if ( ! $e || ! empty( $e['atsaukta'] ) || ! empty( $e['issiusta_l'] ) ) { continue; } $ed = ( 'tiesiai' === $e['k'] && $e['src'] ) ? $e['src'] : 'av'; if ( isset( $g[ $ed ] ) ) { $s += (float) $it->get_total() + (float) $it->get_total_tax(); } }
			$baze = 'tik grįžusios dalies prekės; kita dalis lieka: ' . implode( ', ', $kitos );
		}
		list( $ik, $ik_t ) = self::pristatymo_ikainis( $o, (string) ( $f['vez'] ?? '' ) );
		return array( 'sumoketa' => round( $s, 2 ), 'grazinti' => max( 0, round( $s - self::GRAZINIMO_MOKESTIS, 2 ) ), 'baze' => $baze, 'ikainis' => $ik, 'ikainis_t' => $ik_t, 'pakart' => null === $ik ? null : round( $ik + self::GRAZINIMO_MOKESTIS, 2 ), 'visa' => $visa );
	}
	/** Žymė „grąžink klientui X € rankomis“ po grįžusios siuntos atšaukimo (refund 0 — WC įrašo nėra, kreditinė vėliau). */
	protected static function grazinti_zyme( $o, $u, $suma, $ka ) {
		if ( $suma <= 0 ) { return; }
		$gr = self::grazinti( $o ); $gr[] = array( 'laikas' => current_time( 'mysql' ), 'kas' => $u->display_name, 'suma' => round( (float) $suma, 2 ), 'refund' => 0, 'ka' => $ka );
		$o->update_meta_data( self::GRAZINTI_META, wp_json_encode( $gr ) );
	}

	/** Kiekį keisti galima: apmokėtas, neuždarytas, eilutė be užrakto (tas pats `lock` kaip keliui), neatšaukta, neišsiųsta. */
	protected static function kiekio_gal( $f, $e ) {
		return ! empty( $f['paid'] ) && empty( $f['uzdarytas'] ) && '' === (string) ( $e['lock'] ?? '' ) && empty( $e['atsaukta'] ) && empty( $e['issiusta_l'] ) && (int) $e['q'] >= 1;
	}
	/** Žymė „grąžink klientui rankomis“: [{laikas,kas,suma,refund,ka}]. */
	public static function grazinti( $o ) { $j = json_decode( (string) $o->get_meta( self::GRAZINTI_META ), true ); return is_array( $j ) ? $j : array(); }

	/**
	 * „q×“ → kiekio mažinimas / prekės išėmimas (POST admin-post `ps_dl_kiekis`). Variklis neliestas.
	 * 1) likutis grįžta (pasitikim žymėmis, kaip pilnas atšaukimas: AV pagal `_ps_av_reduced_qty`, WC veidrodis pagal `_reduced_stock`);
	 * 2) WC dalinio grąžinimo įrašas su eilute (pinigai NEGRĄŽINAMI, laiškai išjungti) — faktas `ps_fakt_grazinimai` rašosi pats; nepavykus — viskas atgal;
	 * 3) eilutė perrašoma arba išimama, Tiekimo kaupiama partija perdedama, grupės/planas, `_ps_surinkta` nuimama;
	 * 4) žymė `_ps_grazinti_rankomis` (Klausimas), pastaba, įvykis `kiekis`. Klientui laiško nėra.
	 */
	public static function kiekis_vykdyti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$id = absint( $_POST['id'] ?? 0 ); check_admin_referer( 'ps_dl_kiekis_' . $id );
		$o = wc_get_order( $id ); if ( ! $o ) { wp_die( 'Užsakymas nerastas' ); }
		$atgal = wp_validate_redirect( wp_unslash( $_POST['g'] ?? '' ), admin_url( 'admin.php?page=' . self::SLUG . '&atidaryti=' . $id ) );
		$u = wp_get_current_user(); $lock = 'ps_dl_lock_' . $id;
		$baigti = function ( $k, $t ) use ( $o, $atgal, $lock ) { delete_transient( $lock ); wp_safe_redirect( add_query_arg( array( 'pd_ok' => $k, 'pd_nr' => rawurlencode( $o->get_order_number() . '|' . $t ) ), $atgal ) ); exit; };
		if ( get_transient( $lock ) ) { $baigti( 'dl_info', 'veiksmas jau vykdomas — palauk sekundę' ); } set_transient( $lock, 1, 20 );
		try {
			$iid = absint( $_POST['iid'] ?? 0 ); $ka = sanitize_key( wp_unslash( $_POST['ka'] ?? '' ) ); $n = absint( $_POST['n'] ?? 0 );
			$it = $o->get_item( $iid ); if ( ! $it || ! ( $it instanceof WC_Order_Item_Product ) ) { $baigti( 'dl_klaida', 'eilutės nėra' ); }
			$f = self::faktai( $o, self::zurnalas( array( $id ) ) ); $e = $f['eil'][ $iid ] ?? null;
			if ( ! $e || ! self::kiekio_gal( $f, $e ) ) { $baigti( 'dl_klaida', 'kiekio keisti negalima — ' . ( $e && $e['lock'] ? $e['lock'] : ( ! $f['paid'] ? 'neapmokėtas' : 'užsakymas uždarytas arba eilutė išsiųsta / atšaukta' ) ) . ' (keisk rankiniu būdu)' ); }
			$q = (int) $it->get_quantity();
			if ( 'isimti' === $ka ) { $n = 0; } elseif ( 'kiekis' !== $ka || $n < 1 || $n >= $q ) { $baigti( 'dl_klaida', 'blogas kiekis — dabar ' . $q . ', galima 1…' . ( $q - 1 ) . ' arba „Išimti“' ); }
			$isimti = ( 0 === $n ); $d = $q - $n;
			if ( $isimti ) { $kitos = 0; foreach ( $o->get_items() as $x ) { if ( (int) $x->get_id() !== $iid && (int) $x->get_quantity() > 0 && ! $x->get_meta( '_ps_atsaukta' ) ) { $kitos++; } } if ( ! $kitos ) { $baigti( 'dl_klaida', 'tai vienintelė prekė — naudok „Atšaukti“' ); } }
			$pid = (int) $it->get_product_id(); $vardas = $it->get_name(); $nr = $o->get_order_number();
			// Sumos proporcingai (WC saugo be PVM pilnu tikslumu); grąžintina — su PVM.
			$sub = (float) $it->get_subtotal(); $tot = (float) $it->get_total(); $taxes = (array) $it->get_taxes(); $dalis = $d / $q;
			$ref_tot = $tot * $dalis; $ref_tax = array(); $ref_tax_sum = 0.0;
			foreach ( (array) ( $taxes['total'] ?? array() ) as $rid => $amt ) { $ref_tax[ $rid ] = (float) $amt * $dalis; $ref_tax_sum += (float) $amt * $dalis; }
			$suma = round( $ref_tot + $ref_tax_sum, 2 );
			if ( $suma > (float) $o->get_remaining_refund_amount() + 0.005 ) { $baigti( 'dl_klaida', 'WC neleidžia grąžinimo įrašo ' . number_format( $suma, 2, ',', '' ) . ' € (liko ' . number_format( (float) $o->get_remaining_refund_amount(), 2, ',', '' ) . ' €)' ); }
			$judesiai = array(); $atstatyti = array();
			// 1) Likutis grįžta.
			$rq = (int) $it->get_meta( '_ps_av_reduced_qty' ); if ( ! $rq && $it->get_meta( '_ps_av_reduced' ) ) { $rq = $q; }
			if ( $rq > 0 ) {
				$m = min( $d, $rq ); $x = self::likutis( $pid, $m, 'kiekis ' . $q . ' → ' . $n . ', užsakymas #' . $nr );
				if ( is_wp_error( $x ) ) { $baigti( 'dl_klaida', 'likučio grąžinti nepavyko: ' . $x->get_error_message() ); }
				$judesiai[] = 'AV +' . $m . ' → ' . $x; $atstatyti[] = array( 'av', $pid, $m );
				$liko = $rq - $m; if ( $liko > 0 ) { $it->update_meta_data( '_ps_av_reduced_qty', $liko ); } else { $it->delete_meta_data( '_ps_av_reduced_qty' ); $it->delete_meta_data( '_ps_av_reduced' ); }
			}
			$wr = (int) $it->get_meta( '_reduced_stock' );
			if ( $wr > 0 ) {
				$p = wc_get_product( $pid ); $m = min( $d, $wr );
				if ( $p && $p->managing_stock() ) { $x = wc_update_product_stock( $p, $m, 'increase' ); $judesiai[] = 'WC veidrodis +' . $m . ' → ' . ( null === $x ? '?' : (int) $x ); $atstatyti[] = array( 'wc', $pid, $m ); }
				$liko = $wr - $m; if ( $liko > 0 ) { $it->update_meta_data( '_reduced_stock', $liko ); } else { $it->delete_meta_data( '_reduced_stock' ); }
			}
			$it->update_meta_data( '_restock_refunded_items', (int) $it->get_meta( '_restock_refunded_items' ) + $d ); // faktui „atsargos grįžo“
			$it->save();
			// 2) WC dalinio grąžinimo įrašas (pinigai NEGRĄŽINAMI, laiškai išjungti) — faktas rašosi pats.
			self::d( 'laiskai_off' );
			$refund = wc_create_refund( array( 'order_id' => $id, 'amount' => $suma, 'reason' => sprintf( 'Darbalaukis: %s „%s“ (%s)', $isimti ? 'prekė išimta' : 'kiekis ' . $q . ' → ' . $n, mb_substr( $vardas, 0, 60 ), $u->display_name ), 'line_items' => array( $iid => array( 'qty' => $d, 'refund_total' => $ref_tot, 'refund_tax' => $ref_tax ) ), 'refund_payment' => false, 'restock_items' => false ) );
			self::d( 'laiskai_on' );
			if ( is_wp_error( $refund ) ) {
				foreach ( $atstatyti as $a ) { if ( 'av' === $a[0] ) { self::likutis( $a[1], -$a[2], 'kiekio keitimas nepavyko — atstatyta, užsakymas #' . $nr ); } else { $p = wc_get_product( $a[1] ); if ( $p ) { wc_update_product_stock( $p, $a[2], 'decrease' ); } } }
				$it = $o->get_item( $iid ); if ( $it ) { if ( $rq > 0 ) { $it->update_meta_data( '_ps_av_reduced_qty', $rq ); } if ( $wr > 0 ) { $it->update_meta_data( '_reduced_stock', $wr ); } $it->update_meta_data( '_restock_refunded_items', max( 0, (int) $it->get_meta( '_restock_refunded_items' ) - $d ) ); $it->save(); }
				$baigti( 'dl_klaida', 'WC grąžinimo įrašo sukurti nepavyko: ' . $refund->get_error_message() . ' — niekas nepakeista' );
			}
			$refund->update_meta_data( '_ps_kiekis', 1 ); $refund->save();
			// 3) Eilutė perrašoma arba išimama; kaupiama Tiekimo partija — eilutė perdedama su nauju kiekiu.
			$o = wc_get_order( $id ); $it = $o->get_item( $iid );
			$part = ( class_exists( 'Petshop_AV_Tiekimas' ) && ! empty( $e['b'] ) && 'kaupiama' === $e['b']['busena'] ) ? (int) $e['b']['partija'] : 0;
			if ( $part ) { Petshop_AV_Tiekimas::isimti_eilute( $o, $iid ); $o = wc_get_order( $id ); $it = $o->get_item( $iid ); }
			if ( $isimti ) {
				$o->remove_item( $iid );
			} else {
				$k = $n / $q;
				$it->set_quantity( $n ); $it->set_subtotal( $sub * $k ); $it->set_total( $tot * $k );
				$nt = array( 'total' => array(), 'subtotal' => array() );
				foreach ( (array) ( $taxes['total'] ?? array() ) as $rid => $amt ) { $nt['total'][ $rid ] = (float) $amt * $k; }
				foreach ( (array) ( $taxes['subtotal'] ?? array() ) as $rid => $amt ) { $nt['subtotal'][ $rid ] = (float) $amt * $k; }
				$it->set_taxes( $nt );
				$it->update_meta_data( '_ps_kiekis_keistas', current_time( 'mysql' ) . '|' . $u->display_name . '|' . $q . '→' . $n );
				if ( $it->get_meta( '_ps_source_qty' ) ) { $it->update_meta_data( '_ps_source_qty', $n ); }
				$it->save();
				if ( $part ) { Petshop_AV_Tiekimas::ideti_eilute( $o, $iid, $e['src'] ); $o = wc_get_order( $id ); }
			}
			$o->update_taxes(); $o->calculate_totals( false ); // v3.19.1: `update_taxes()` būtinas — `calculate_totals(false)` PVM iš eilučių nesumuoja (v3.19 radinys: #35414 19,49 vietoj 19,04); pristatymas nekinta
			if ( $o->get_meta( '_ps_misrus_sprendimas' ) ) { self::planas_is_eiluciu( $o ); }
			self::perskaiciuoti_grupes( $o );
			if ( $o->get_meta( '_ps_surinkta' ) ) { $o->delete_meta_data( '_ps_surinkta' ); $judesiai[] = 'surinkimas nuimtas — lapą spausdink iš naujo'; }
			$o->delete_meta_data( '_ps_klaus_laukti' );
			// 4) Žymė, pastaba, įvykis.
			$g = self::grazinti( $o ); $g[] = array( 'laikas' => current_time( 'mysql' ), 'kas' => $u->display_name, 'suma' => $suma, 'refund' => $refund->get_id(), 'ka' => ( $isimti ? 'išimta ' : 'kiekis ' . $q . ' → ' . $n . ' ' ) . mb_substr( $vardas, 0, 50 ) );
			$o->update_meta_data( self::GRAZINTI_META, wp_json_encode( $g ) );
			$o->add_order_note( sprintf( 'Darbalaukis: „%s“ %s (%s). WC grąžinimo įrašas #%d: %s € — pinigai NEGRĄŽINTI, grąžink rankomis (Klausimas primins). Likutis: %s. Partijos — rankomis (jei nurašytos). Klientui laiškas: NESIŲSTAS.', $vardas, $isimti ? 'išimta iš užsakymo (' . $q . ' vnt.)' : 'kiekis ' . $q . ' → ' . $n, $u->display_name, $refund->get_id(), number_format( $suma, 2, ',', '' ), $judesiai ? implode( ', ', $judesiai ) : 'nejudėjo' ), false, true );
			$o->save();
			if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $id, 'eilute' => $iid, 'sritis' => 'desk', 'veiksmas' => 'kiekis', 'rezultatas' => 'ok', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'pries' => array( 'q' => $q, 'total' => $tot, 'rq' => $rq, 'wc' => $wr ), 'po' => array( 'q' => $n, 'refund' => $refund->get_id(), 'suma' => $suma, 'zinute' => $judesiai ? implode( '; ', $judesiai ) : '' ), 'pastaba' => mb_substr( $vardas, 0, 60 ) . ( $isimti ? ' išimta' : ' ' . $q . ' → ' . $n ) . ' · grąžink ' . number_format( $suma, 2, ',', '' ) . ' €' ) ); }
			do_action( 'ps_juosta_isvalyti' );
			$baigti( 'dl_info', ( $isimti ? '„' . mb_substr( $vardas, 0, 40 ) . '“ išimta' : 'kiekis ' . $q . ' → ' . $n ) . ' · grąžink klientui ' . number_format( $suma, 2, ',', '' ) . ' € rankomis (Klausimai)' . ( $judesiai ? ' · likutis: ' . implode( ', ', $judesiai ) : '' ) );
		} catch ( Throwable $ex ) { $baigti( 'dl_klaida', 'klaida: ' . $ex->getMessage() ); }
	}

	/** „Grąžinta“ (Klausimų kortelė): žymė nuimama, pastaba, įvykis `grazinta`. */
	protected static function grazinta( $o, $u ) {
		$g = self::grazinti( $o ); if ( ! $g ) { return array( 'dl_info', 'grąžintinų pinigų nėra — Klausimo nebėra' ); }
		$viso = 0.0; foreach ( $g as $x ) { $viso += (float) ( $x['suma'] ?? 0 ); }
		$o->delete_meta_data( self::GRAZINTI_META );
		$o->add_order_note( sprintf( 'Darbalaukis: pinigai klientui grąžinti rankomis — %s € (%s). Sąskaita / kreditinė — rankomis.', number_format( $viso, 2, ',', '' ), $u->display_name ), false, true ); $o->save();
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'grazinta', 'rezultatas' => 'ok', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'pries' => array( 'irasai' => $g ), 'po' => array( 'suma' => $viso ), 'pastaba' => 'grąžinta rankomis ' . number_format( $viso, 2, ',', '' ) . ' €' ) ); }
		return array( 'dl_info', 'pažymėta: grąžinta ' . number_format( $viso, 2, ',', '' ) . ' € — Klausimas nuimtas' );
	}

	/** WC refund'ai, sukurti kiekio keitimo (`_ps_kiekis`): [refund_id => suma]. Eilutė jau perrašyta — WC juos rodytų dukart. */
	protected static function savi_refundai( $o ) {
		$r = array(); if ( ! ( $o instanceof WC_Order ) || (float) $o->get_total_refunded() <= 0 ) { return $r; }
		foreach ( $o->get_refunds() as $x ) { if ( $x->get_meta( '_ps_kiekis' ) ) { $r[ $x->get_id() ] = (float) $x->get_amount(); } }
		return $r;
	}
	public static function kiekio_html( $html, $item ) { return ( $item instanceof WC_Order_Item_Product && $item->get_meta( '_ps_kiekis_keistas' ) ) ? ' <strong class="product-quantity">' . sprintf( '&times;&nbsp;%s', esc_html( $item->get_quantity() ) ) . '</strong>' : $html; }
	public static function kiekio_laiske( $qty, $item ) { return ( $item instanceof WC_Order_Item_Product && $item->get_meta( '_ps_kiekis_keistas' ) ) ? esc_html( $item->get_quantity() ) : $qty; }
	public static function sumu_eilutes( $rows, $o ) { foreach ( array_keys( self::savi_refundai( $o ) ) as $rid ) { unset( $rows[ 'refund_' . $rid ] ); } return $rows; }
	public static function suma_be_savu( $html, $o, $tax = '', $rodyti = true ) {
		if ( ! $rodyti ) { return $html; }
		$savi = array_sum( self::savi_refundai( $o ) ); if ( $savi <= 0 ) { return $html; }
		$kiti = (float) $o->get_total_refunded() - $savi; $a = array( 'currency' => $o->get_currency() ); $t = wc_price( $o->get_total(), $a );
		return $kiti > 0.005 ? '<del aria-hidden="true">' . wp_strip_all_tags( $t ) . '</del> <ins>' . wc_price( $o->get_total() - $kiti, $a ) . '</ins>' : $t;
	}

	protected static function likutis( $pid, $delta, $pastaba ) {
		$pid = (int) $pid;
		if ( class_exists( 'Petshop_AV_Stock' ) && null !== Petshop_AV_Stock::qty( $pid ) ) {
			return $delta > 0 ? Petshop_AV_Stock::increase( $pid, $delta, $pastaba ) : Petshop_AV_Stock::decrease( $pid, -$delta, $pastaba );
		}
		$p = wc_get_product( $pid );
		if ( ! $p ) { return new WP_Error( 'nera', 'prekės nėra' ); }
		$dabar = (int) get_post_meta( $pid, '_stock', true );
		if ( $dabar + $delta < 0 ) { return new WP_Error( 'nepakanka', 'AV tik ' . $dabar ); }
		if ( ! $p->managing_stock() ) { return $dabar + $delta; }
		$naujas = wc_update_product_stock( $p, abs( $delta ), $delta > 0 ? 'increase' : 'decrease' ); // atominis SQL (auditas V2)
		return null === $naujas ? new WP_Error( 'klaida', 'likučio įrašyti nepavyko' ) : (int) $naujas;
	}

	/** Grupių perskaičiavimas kaip `Petshop_AV_Order::fiksuoti()` / K2. */
	protected static function perskaiciuoti_grupes( $o ) {
		$grupes = array();
		foreach ( $o->get_items() as $it ) {
			$s = (string) $it->get_meta( '_ps_source' ); if ( ! $s ) { continue; }
			$c = (string) $it->get_meta( '_ps_carrier' ); if ( ! $c ) { $c = 'av' === $s ? 'any' : 'venipak'; }
			if ( ! isset( $grupes[ $s ] ) ) { $grupes[ $s ] = array( 'carrier' => $c, 'eilutes' => 0, 'vienetai' => 0 ); }
			$grupes[ $s ]['eilutes']++; $grupes[ $s ]['vienetai'] += max( 1, (int) $it->get_quantity() );
		}
		$tipas = class_exists( 'Petshop_AV_Source' ) ? Petshop_AV_Source::order_type( $grupes ) : ( count( $grupes ) > 1 ? 'MIXED' : ( isset( $grupes['av'] ) ? 'MAIN' : 'DS' ) );
		$o->update_meta_data( '_ps_order_type', $tipas ); $o->update_meta_data( '_ps_groups', wp_json_encode( $grupes ) ); $o->update_meta_data( '_ps_shipments', count( $grupes ) );
	}

	/** Mišraus planas iš eilučių kelių (kad `kons`, `kons_laukia()`, `neperduotos()` gerbtų planą — A7/A10). */
	protected static function planas_is_eiluciu( $o ) {
		$spr = array();
		foreach ( $o->get_items() as $it ) {
			$s = (string) $it->get_meta( '_ps_source' ); $k = (string) $it->get_meta( '_ps_kelias' );
			if ( ! $s || 'av' === $s ) { continue; }
			if ( 'i_av' === $k ) { $spr[ $s ] = 'av'; } elseif ( ! isset( $spr[ $s ] ) ) { $spr[ $s ] = 'tiesiai'; }
		}
		if ( $spr ) { $o->update_meta_data( '_ps_misrus_sprendimas', wp_json_encode( $spr ) ); } else { $o->delete_meta_data( '_ps_misrus_sprendimas' ); }
		return $spr;
	}

	/** Kelio keitimas su „likutis seka kelią“ (spec §5). Grąžina [pd_ok, tekstas]. */
	protected static function keisti_kelia( $o, $iid, $k, $u ) {
		if ( ! isset( self::KELIAI[ $k ] ) ) { return array( 'dl_klaida', 'blogas kelias' ); }
		$it = $o->get_item( $iid );
		if ( ! $it ) { return array( 'dl_klaida', 'eilutės nėra' ); }
		if ( ! $o->is_paid() ) { return array( 'dl_klaida', 'užsakymas neapmokėtas' ); }
		$f = self::faktai( $o, self::zurnalas( array( $o->get_id() ) ) );
		$e = $f['eil'][ (int) $iid ] ?? null;
		if ( ! $e ) { return array( 'dl_klaida', 'eilutės nėra' ); }
		if ( $e['lock'] ) { return array( 'dl_klaida', 'kelio keisti negalima — ' . $e['lock'] ); }
		if ( $k === $e['k'] ) { return array( 'dl_info', 'kelias nepakeistas — jau ' . self::kelio_vardas( $k, $e['tiek'] ) ); }
		if ( empty( $e['galimi'][ $k ] ) ) { return array( 'dl_klaida', 'negalima: ' . ( 'av' === $k ? 'AV tik ' . (int) $e['av_qty'] . ', reikia ' . $q : ( 'lp' === $f['vez'] && 'tiesiai' === $k ? 'LP Express — tik iš AV' : 'tiekėjo nėra' ) ) ); }
		$pid = $e['pid']; $q = $e['q']; $buvo = $e['k']; $tiek = $e['tiek'];
		$pries = array( 'kelias' => $buvo, 'src' => $e['src'], 'av_q' => $e['av_qty'], 'reduced' => (int) $it->get_meta( '_ps_av_reduced_qty' ) );
		$judesiai = array();

		// Likutis seka kelią.
		if ( 'av' === $buvo && 'av' !== $k ) {
			$r = (int) $it->get_meta( '_ps_av_reduced_qty' );
			if ( ! $r && $it->get_meta( '_ps_av_reduced' ) ) { $r = $q; } // K2 (`eilutes_i_av`) žymi eilutę `_ps_av_reduced` be kiekio
			if ( $r > 0 ) {
				$x = self::likutis( $pid, $r, 'kelias → ' . self::kelio_vardas( $k, $tiek ) . ', užsakymas #' . $o->get_order_number() );
				if ( is_wp_error( $x ) ) { return array( 'dl_klaida', 'likučio grąžinti nepavyko: ' . $x->get_error_message() ); }
				$judesiai[] = 'AV +' . $r . ' → ' . $x;
				$it->delete_meta_data( '_ps_av_reduced_qty' ); $it->delete_meta_data( '_ps_av_reduced' );
			}
		} elseif ( '' === $buvo && 'av' === $k ) {
			$judesiai[] = 'rankinis — likutis nenurašytas';
		} elseif ( 'av' !== $buvo && 'av' === $k ) {
			if ( null === $e['av_qty'] || $e['av_qty'] < $q ) { return array( 'dl_klaida', 'AV tik ' . (int) $e['av_qty'] . ', reikia ' . $q ); }
			$x = self::likutis( $pid, -$q, 'kelias → Avesa sandėlis, užsakymas #' . $o->get_order_number() );
			if ( is_wp_error( $x ) ) { return array( 'dl_klaida', $x->get_error_message() ); }
			$judesiai[] = 'AV −' . $q . ' → ' . $x;
			$it->update_meta_data( '_ps_av_reduced_qty', $q );
			if ( ! $o->get_meta( '_ps_av_reduced' ) ) { $o->update_meta_data( '_ps_av_reduced', current_time( 'mysql' ) ); }
			$o->delete_meta_data( '_ps_av_restored' );
		}
		// Partija: „→ Avesa sandėlį“ kaupiamoje partijoje išimama, kai kelias keičiasi (užsakyta — užrakinta aukščiau).
		if ( 'i_av' === $buvo && class_exists( 'Petshop_AV_Tiekimas' ) ) { Petshop_AV_Tiekimas::isimti_eilute( $o, (int) $iid ); $it->delete_meta_data( '_ps_konsolidacija' ); }
		// Eilutės meta.
		$it->update_meta_data( '_ps_kelias', $k );
		$it->update_meta_data( '_ps_source', 'av' === $k ? 'av' : $tiek );
		if ( '' === $buvo ) { $it->update_meta_data( '_ps_source_qty', $q ); }
		$it->update_meta_data( '_ps_carrier', 'av' === $k ? 'any' : 'venipak' );
		$it->update_meta_data( '_ps_source_at', current_time( 'mysql' ) );
		$it->update_meta_data( '_ps_source_reason', 'darbalaukis: ' . $u->display_name . ' pakeitė ' . self::kelio_vardas( $buvo, $tiek ) . ' → ' . self::kelio_vardas( $k, $tiek ) );
		$it->save();
		$o = wc_get_order( $o->get_id() );
		$o->delete_meta_data( '_ps_klaus_laukti' );
		self::planas_is_eiluciu( $o );
		self::perskaiciuoti_grupes( $o );
		$o->add_order_note( sprintf( 'Darbalaukis: „%s“ kelias %s → %s (%s).%s', $it->get_name(), self::kelio_vardas( $buvo, $tiek ), self::kelio_vardas( $k, $tiek ), $u->display_name, $judesiai ? ' Likutis: ' . implode( ', ', $judesiai ) . '.' : '' ), false, true );
		$o->save();
		wc_delete_shop_order_transients( $o ); clean_post_cache( $pid ); wc_delete_product_transients( $pid );
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) {
			Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'eilute' => (int) $iid, 'sritis' => 'desk', 'veiksmas' => 'kelias', 'rezultatas' => 'ok', 'kanalas' => 'web',
				'pries' => $pries, 'po' => array( 'kelias' => $k, 'src' => 'av' === $k ? 'av' : $tiek, 'reduced' => (int) $it->get_meta( '_ps_av_reduced_qty' ), 'zinute' => $judesiai ? 'likutis: ' . implode( ', ', $judesiai ) : 'likutis nejudėjo' ),
				'pastaba' => mb_substr( $it->get_name(), 0, 60 ) . ': ' . self::kelio_vardas( $buvo, $tiek ) . ' → ' . self::kelio_vardas( $k, $tiek ) ) );
		}
		do_action( 'ps_juosta_isvalyti' );
		return array( 'dl_kelias', $it->get_name() . ' → ' . self::kelio_vardas( $k, $tiek ) . ( $judesiai ? ' · likutis ' . implode( ', ', $judesiai ) : '' ) );
	}

	/** „Išsiųsta“ (I1, V3, K4): dalies žymė `_ps_dalys_issiusta`; completed be WC laiško, kai visos dalys; §18.3 sargas žmogaus kalba.
	 *  #5 (spec §12): laiškas klientui PO KIEKVIENOS siuntos per `siuntos_laiskas()`, kai `$sekimo`. Vieša — 4 etapo Venipak cron kvies su
	 *  `$u = null`, `$kanalas = 'venipak'`. Grąžina [raktas, tekstas] `pranesimas()` žodynui. */
	public static function issiusta( $o, $u, $sekimo, $dalis = '', $kanalas = 'web' ) {
		if ( in_array( $o->get_status(), array( 'completed', 'lp-delivered', 'lp-on-the-way' ), true ) ) { return array( 'dl_info', 'jau išsiųstas' ); }
		$kas = $u && ! empty( $u->display_name ) ? $u->display_name : ( 'venipak' === $kanalas ? 'Venipak' : ( 'lp' === $kanalas ? 'LP Express' : 'sistema' ) );
		$f = self::faktai( $o, self::zurnalas( array( $o->get_id() ) ) );
		if ( $dalis && empty( $f['dalys'][ $dalis ] ) ) { return array( 'dl_klaida', 'tokios dalies nėra' ); }
		$iss = $f['dalys_issiusta']; $dabar = current_time( 'mysql' );
		$jau = $dalis && ! empty( $f['dalys'][ $dalis ]['issiusta'] );
		$visos = true; foreach ( $f['dalys'] as $k => $p ) { if ( $p && empty( $iss[ $k ] ) ) { $visos = false; } }
		if ( $jau && ! $visos ) { return array( 'dl_info', ( 'av' === $dalis ? 'AV dalis' : self::vardas( $dalis ) ) . ' jau pažymėta išsiųsta' ); }
		if ( ! $jau && $dalis && ( 'av' === $dalis ? ! $f['dalys']['av']['siunta'] : empty( $f['dalys'][ $dalis ]['perduota'] ) ) ) { return array( 'dl_klaida', ( 'av' === $dalis ? 'AV siunta dar be lipduko' : 'dar neužsakyta iš ' . self::vardas( $dalis ) ) ); }
		// v3.10.6 (Raimis 09-04): siunta klientui — tik su registruotu numeriu (lipduku); „be lipdukų“ tik į AV.
		foreach ( $f['dalys'] as $k => $p ) {
			if ( ! $p || ! empty( $iss[ $k ] ) || ( $dalis && $k !== $dalis ) ) { continue; }
			if ( 'av' === $k ? empty( $p['siunta'] ) : empty( $p['nr'] ) ) { return array( 'dl_klaida', 'av' === $k ? 'AV siunta dar be lipduko' : self::vardas( $k ) . ' — siuntos numerio nėra, pirma lipdukas' ); }
		}
		// K4: dalies būsena — pažymim šią dalį; kitos dalys — kaip yra. Jei visos jau pažymėtos, o užsakymas ne completed — kartojam užbaigimą (v3.10.1).
		if ( ! $jau ) {
			$zym = array( $dalis ? $dalis : null ); if ( ! $dalis ) { $zym = array(); foreach ( $f['dalys'] as $k => $p ) { if ( $p ) { $zym[] = $k; } } }
			foreach ( $zym as $k ) { if ( $k ) { $iss[ $k ] = array( 'laikas' => $dabar, 'kas' => $kas, 'kanalas' => $kanalas ); } }
			$o->update_meta_data( '_ps_dalys_issiusta', wp_json_encode( $iss ) ); $o->save();
		}
		$truksta = array(); foreach ( $f['dalys'] as $k => $p ) { if ( $p && empty( $iss[ $k ] ) ) { $truksta[] = self::vardas( $k ); } }
		$kam = 'av' === $dalis ? 'AV siunta' : ( $dalis ? self::vardas( $dalis ) : 'visos dalys' );
		$laiskas = $sekimo ? '' : 'klientui nepranešta (varnelė nuimta)';
		if ( $truksta ) {
			// #5: laiškas klientui apie ŠIĄ (dalinę) siuntą.
			if ( $sekimo ) { list( , $laiskas ) = self::siuntos_laiskas( $o, $f, $dalis, $iss ); }
			$o->add_order_note( sprintf( 'Darbalaukis: %s išsiųsta (%s, %s). Dar laukiam: %s. %s', $kam, $kas, $kanalas, implode( ', ', $truksta ), $laiskas ), false, true ); $o->save();
			if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'issiusta_dalis', 'rezultatas' => 'ok', 'kanalas' => $kanalas, 'po' => array( 'dalis' => $dalis, 'zinute' => 'laukiam: ' . implode( ', ', $truksta ) . ' · ' . $laiskas ) ) ); }
			do_action( 'ps_juosta_isvalyti' );
			return array( 'dl_dalis', ( 'av' === $dalis ? 'kurjeris paėmė AV siuntą' : self::vardas( $dalis ) . ' išsiuntė' ) . ' — ' . $laiskas . ' · dar laukiam: ' . implode( ', ', $truksta ) );
		}
		// Paskutinė dalis → completed. §18.3 sargas (variklis) — apėjimo nebėra (v3.10.6): visos siuntos klientui registruotos su numeriu.
		$ship = (int) $o->get_meta( '_ps_shipments' ); $reg = class_exists( 'Petshop_Siuntos' ) ? Petshop_Siuntos::registruota_grupiu( $o ) : $ship;
		self::d( 'laiskai_off' );
		$o->add_order_note( sprintf( 'Pažymėta išsiųsta darbalaukyje (%s, %s). WC laiškas klientui: NESIŲSTAS.', $kas, $kanalas ), false, true );
		$o->update_status( 'completed', '' );
		self::d( 'laiskai_on' );
		$o = wc_get_order( $o->get_id() );
		if ( 'completed' !== $o->get_status() ) {
			return array( 'dl_klaida', 'užbaigti neleido sargas — registruotos ' . (int) $reg . ' iš ' . $ship . ' siuntų; klientui laiškas nesiųstas — pakartok, kai sutvarkyta' );
		}
		// #5: paskutinės siuntos laiškas — PO completed (v3.10.1).
		if ( $sekimo ) { list( , $laiskas ) = self::siuntos_laiskas( $o, $f, $dalis, $iss ); }
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) {
			Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'issiusta', 'rezultatas' => 'ok', 'kanalas' => $kanalas, 'po' => array( 'status' => 'completed', 'dalis' => $dalis, 'zinute' => $laiskas ) ) );
		}
		do_action( 'ps_juosta_isvalyti' );
		return array( 'dl_issiusta', $laiskas );
	}

	/** Vežėjo sekimo nuoroda klientui. Venipak — `venipak.com/lt/tracking/track/{nr}` (formos JS, 2026-09-03), LP — `post.lt/siuntu-sekimas?parcels={nr}`. */
	public static function sekimo_url( $vez, $nr ) {
		$nr = trim( (string) $nr ); if ( '' === $nr ) { return ''; }
		$u = 'lp' === $vez ? 'https://www.post.lt/siuntu-sekimas?parcels=' . rawurlencode( $nr ) : 'https://venipak.com/lt/tracking/track/' . rawurlencode( $nr );
		return (string) apply_filters( 'ps_sekimo_url', $u, $vez, $nr );
	}

	/* ============================ v3.11 — VENIPAK SEKIMAS (4 etapas #1) ============================ */

	const SEK_META    = '_ps_venipak_sekimas';
	const GRIZTA_META = '_ps_siunta_grizta';
	const ATSAUKTA_META = '_ps_dalys_atsaukta'; // v3.17: [dalis => {laikas,kas,nr[]}]
	const GRAZINIMO_MOKESTIS = 3.99; // v3.20 (spec §12.5): siuntos grąžinimo išlaidos klientui, su PVM (3,30 + PVM), visada
	const GRAZINTI_META = '_ps_grazinti_rankomis'; // v3.19: [{laikas,kas,suma,refund,ka}] — Klausimas „Grąžink klientui pinigus“, kol nepažymėta „Grąžinta“
	const PAKART_META = '_ps_pakartotinis';              // v3.21: naujame (pakartotiniame) užsakyme — pradinio ID; darbalaukis ir auto jį praleidžia
	const PAKART_ID_META = '_ps_pakartotinis_id';        // v3.21: pradiniame — pakartotinio užsakymo ID
	const PAKART_NEMOK_META = '_ps_pakartotinis_nemokamai'; // v3.21: pradiniame — „be mokesčio“ (mūsų / vežėjo kaltė): laikas|kas
	const PAKART_PREKE_OPT = 'ps_pakartotinio_preke';    // v3.21: paslaugos prekės „Pakartotinis siuntimas“ ID
	const PAKART_BANKAS = 'UAB Avesa · AB Swedbank · LT127300010124940593'; // v3.23: pavedimo rekvizitai (kaip temos functions.php / IAPV — Claude prielaida: tie patys)
	const BAIGTOS_META = '_ps_dalys_baigtos'; // v3.18: [dalis => [{nr[],laikas,prekes[[q,n]]}, …]] — ankstesnės išsiųstos AV siuntos, kai AV dalis ruošiama iš naujo
	public static function dalys_atsaukta( $o ) { $j = json_decode( (string) $o->get_meta( self::ATSAUKTA_META ), true ); return is_array( $j ) ? $j : array(); }
	public static function dalys_baigtos( $o ) { $j = json_decode( (string) $o->get_meta( self::BAIGTOS_META ), true ); return is_array( $j ) ? $j : array(); }
	/** Patvirtinti kodai (S1612 recon e3, dvi realios siuntos): 1 On route to terminal · 2 At terminal · 3 On route to receiver · 6 At pickup point · 9 Delivered. */
	const VENIPAK_PAEME = array( 1, 2, 3, 6, 9 );
	const VENIPAK_PRISTATYTA = 9;
	const VENIPAK_TEKSTAI = array( 0 => 'pas siuntėją', 1 => 'keliauja į terminalą', 2 => 'terminale', 3 => 'keliauja gavėjui', 6 => 'paštomate, laukia gavėjo', 9 => 'pristatyta' );
	/** v3.12 (#2): LP plugino meta `_woo_lithuaniapost_shipping_status_value` reikšmės (LpOrderStatus, S1613 recon) → darbalaukio kodai (kaip Venipak: 3 keliauja gavėjui, 9 pristatyta; kiti 0). */
	const LP_PAEME = array( 'lp-on-the-way', 'lp-delivered' );
	const LP_PRISTATYTA = 'lp-delivered';
	const LP_KODAI = array( 'lp-on-the-way' => 3, 'lp-delivered' => 9 );
	const LP_TEKSTAI = array( 'lp-parcel-await' => 'siunta dar nesukurta', 'lp-parcel-created' => 'siunta sukurta', 'lp-parcel-failed' => 'siuntos sukurti nepavyko', 'lp-label-created' => 'lipdukas sukurtas', 'lp-courier-await' => 'laukia kurjerio', 'lp-courier-called' => 'kurjeris iškviestas', 'lp-on-the-way' => 'keliauja gavėjui', 'lp-delivered' => 'pristatyta', 'lp-cancelled' => 'siunta atšaukta' );

	public static function cron_tvarkarastis( $s ) { if ( ! isset( $s['ps_30min'] ) ) { $s['ps_30min'] = array( 'interval' => 1800, 'display' => 'Kas 30 min (petshop)' ); } return $s; }
	public static function cron_planuoti() {
		if ( ! wp_next_scheduled( 'ps_venipak_sekimas' ) ) { wp_schedule_event( time() + 300, 'ps_30min', 'ps_venipak_sekimas' ); }
		if ( ! wp_next_scheduled( 'ps_velavimo_laiskai' ) ) { wp_schedule_single_event( self::kitas_1400(), 'ps_velavimo_laiskai' ); } // v3.13: vienkartinis, perplanuojamas kas run'ą
	}

	/** `_ps_venipak_sekimas` → [nr => {k,t,e,d,v,n,dalis,tikr}]. */
	public static function sekimas( $o ) { $m = $o->get_meta( self::SEK_META ); if ( is_array( $m ) ) { return $m; } $j = json_decode( (string) $m, true ); return is_array( $j ) ? $j : array(); }
	/** `_ps_siunta_grizta` → [dalis => {nr,t,e,d,kada}]. */
	public static function grizta( $o ) { $m = $o->get_meta( self::GRIZTA_META ); if ( is_array( $m ) ) { return $m; } $j = json_decode( (string) $m, true ); return is_array( $j ) ? $j : array(); }

	/** Darbuotojui prie numerių: „ — Venipak: terminale (Kaunas, 09-03 17:03)“ / „ — LP Express: keliauja gavėjui, 09-04 13:10“ (paskutinis įvykis; nežinomas kodas — angliškas tekstas). */
	protected static function sekimo_tekstas( $sek, $nrs ) {
		$t = array( 'venipak' => array(), 'lp' => array() );
		foreach ( (array) $nrs as $nr ) {
			$x = $sek[ $nr ] ?? null; if ( ! $x ) { continue; }
			$lp = ! empty( $x['vez'] ) && 'lp' === $x['vez'];
			$k = (int) $x['k']; $v = $lp ? ( self::LP_TEKSTAI[ (string) $x['t'] ] ?? (string) $x['t'] ) : ( self::VENIPAK_TEKSTAI[ $k ] ?? (string) $x['t'] );
			$t[ $lp ? 'lp' : 'venipak' ][] = $v . ( ! empty( $x['v'] ) ? ', ' . $x['v'] : '' ) . ( ! empty( $x['d'] ) ? ', ' . substr( (string) $x['d'], 5, 11 ) : '' );
		}
		$out = array();
		if ( $t['venipak'] ) { $out[] = 'Venipak: ' . implode( ' · ', array_unique( $t['venipak'] ) ); }
		if ( $t['lp'] ) { $out[] = 'LP Express: ' . implode( ' · ', array_unique( $t['lp'] ) ); }
		return $out ? ' — ' . implode( ' · ', $out ) : '';
	}

	/** Pristatymo laikas, jei VISI numeriai pristatyti (kodas 9); kitaip ''. */
	protected static function pristatyta_kada( $sek, $nrs ) {
		$max = '';
		foreach ( (array) $nrs as $nr ) { $x = $sek[ $nr ] ?? null; if ( ! $x || self::VENIPAK_PRISTATYTA !== (int) $x['k'] ) { return ''; } if ( (string) $x['d'] > $max ) { $max = (string) $x['d']; } }
		return $max;
	}

	/** Venipak įvykiai numeriui: masyvas (chronologiškai), tuščias — įvykių nėra (404), WP_Error — ryšio / HTTP klaida. Testams — filtras `ps_venipak_ivykiai`. */
	public static function venipak_ivykiai( $nr ) {
		$ev = apply_filters( 'ps_venipak_ivykiai', null, $nr );
		if ( is_array( $ev ) ) { return $ev; }
		$r = wp_remote_get( 'https://tracking.venipak.com/api/v1/events?pack_no=' . rawurlencode( $nr ), array( 'timeout' => 15, 'headers' => array( 'Accept' => 'application/json' ) ) );
		if ( is_wp_error( $r ) ) { return $r; }
		$code = (int) wp_remote_retrieve_response_code( $r );
		if ( 404 === $code ) { return array(); }
		$b = json_decode( (string) wp_remote_retrieve_body( $r ), true );
		if ( 200 !== $code || ! is_array( $b ) ) { return new WP_Error( 'venipak', 'HTTP ' . $code ); }
		return $b;
	}

	/** Kandidatai sekti: apmokėti, neatšaukti užsakymai su `_ps_siuntos` registru (Venipak) arba su LP numeriu `_woo_lithuaniapost_barcode` (v3.12, `$meta`), sukurti per 60 d. (HPOS). */
	protected static function sekimo_kandidatai( $meta = '_ps_siuntos' ) {
		global $wpdb; $p = $wpdb->prefix;
		$ne = array_merge( Petshop_Desk::STATUSAI['neapmoketi'], Petshop_Desk::STATUSAI['atsaukti'], array( 'checkout-draft', 'draft', 'trash' ) );
		$st = array(); foreach ( array_keys( wc_get_order_statuses() ) as $k ) { $k2 = str_replace( 'wc-', '', $k ); if ( ! in_array( $k2, $ne, true ) ) { $st[] = $k; } }
		if ( ! $st ) { return array(); }
		$in = implode( ',', array_map( function ( $x ) use ( $wpdb ) { return $wpdb->prepare( '%s', $x ); }, $st ) );
		$nuo = gmdate( 'Y-m-d H:i:s', time() - 60 * DAY_IN_SECONDS );
		return array_map( 'intval', (array) $wpdb->get_col( $wpdb->prepare( "SELECT o.id FROM {$p}wc_orders o INNER JOIN {$p}wc_orders_meta m ON m.order_id = o.id AND m.meta_key = %s AND m.meta_value <> '' WHERE o.type = 'shop_order' AND o.status IN ($in) AND o.date_created_gmt > %s ORDER BY o.id DESC LIMIT 200", $meta, $nuo ) ) );
	}
	/** v3.12: LP Express kandidatai — su plugino numeriu. */
	protected static function lp_kandidatai() { return self::sekimo_kandidatai( '_woo_lithuaniapost_barcode' ); }

	/** CRON `ps_venipak_sekimas` (kas 30 min) — Venipak: vienas užklausimas vienam dar nepristatytam numeriui; LP Express (v3.12): tik plugino meta, API nekviečiama. Grąžina ataskaitą (testams / žurnalui). */
	public static function venipak_sekimas( $tik_ids = array() ) {
		$rep = array( 'pradzia' => current_time( 'mysql' ), 'uzsakymu' => 0, 'numeriu' => 0, 'uzklausu' => 0, 'pakeista' => 0, 'lp' => 0, 'issiusta' => array(), 'pristatyta' => array(), 'grizta' => array(), 'nezinomi' => array(), 'klaidos' => array() );
		if ( ! class_exists( 'Petshop_Siuntos' ) || ! class_exists( 'Petshop_Desk' ) ) { $rep['klaidos'][] = 'variklio nėra'; return $rep; }
		$ids = $tik_ids ? array_map( 'intval', (array) $tik_ids ) : array_values( array_unique( array_merge( self::sekimo_kandidatai(), self::lp_kandidatai() ) ) );
		$pradzia = microtime( true );
		foreach ( $ids as $oid ) {
			if ( microtime( true ) - $pradzia > 240 ) { $rep['klaidos'][] = 'laikas baigėsi ties #' . $oid; break; }
			$o = wc_get_order( $oid ); if ( ! $o ) { continue; }
			$rep['uzsakymu']++;
			try { self::sekti_uzsakyma( $o, $rep ); } catch ( Throwable $e ) { $rep['klaidos'][] = '#' . $oid . ': ' . $e->getMessage(); }
			try { $o2 = wc_get_order( $oid ); if ( $o2 ) { self::sekti_lp( $o2, $rep ); } } catch ( Throwable $e ) { $rep['klaidos'][] = '#' . $oid . ' LP: ' . $e->getMessage(); }
		}
		$rep['pabaiga'] = current_time( 'mysql' ); $rep['s'] = round( microtime( true ) - $pradzia, 1 );
		update_option( 'ps_venipak_sekimas_paskutinis', array( 'laikas' => $rep['pabaiga'], 'uzsakymu' => $rep['uzsakymu'], 'numeriu' => $rep['numeriu'], 'uzklausu' => $rep['uzklausu'], 'pakeista' => $rep['pakeista'], 'lp' => $rep['lp'], 'issiusta' => count( $rep['issiusta'] ), 'pristatyta' => count( $rep['pristatyta'] ), 'grizta' => count( $rep['grizta'] ), 'klaidos' => count( $rep['klaidos'] ), 's' => $rep['s'] ), false );
		return $rep;
	}

	/** Vienas užsakymas: registro numeriai → API → `_ps_venipak_sekimas`; veiksmai: paėmė → `issiusta()`, pristatyta → žymė + pastaba, grąžina → Klausimas. */
	protected static function sekti_uzsakyma( $o, &$rep ) {
		$id = $o->get_id(); $reg = Petshop_Siuntos::sarasas( $id ); if ( ! $reg ) { return; }
		$sek = self::sekimas( $o ); $grizta = self::grizta( $o );
		$iss = json_decode( (string) $o->get_meta( '_ps_dalys_issiusta' ), true ); if ( ! is_array( $iss ) ) { $iss = array(); }
		$dabar = current_time( 'mysql' ); $pakeista = false; $paeme = array(); $naujai_prist = array(); $naujai_griz = array(); $nezinomi = array();
		$uzdarytas = in_array( $o->get_status(), array_merge( Petshop_Desk::STATUSAI['ivykdyti'], Petshop_Desk::STATUSAI['kelyje'] ), true );
		foreach ( $reg as $s ) {
			$dalis = (string) ( $s['sandelis'] ?? '' ); if ( '' === $dalis ) { $dalis = 'av'; }
			foreach ( (array) ( $s['numeriai'] ?? array() ) as $nr ) {
				$nr = trim( (string) $nr ); if ( '' === $nr ) { continue; }
				$rep['numeriu']++;
				$buvo = $sek[ $nr ] ?? null;
				if ( $buvo && ( self::VENIPAK_PRISTATYTA === (int) $buvo['k'] || ! empty( $buvo['stop'] ) ) ) { continue; } // pristatyta / grąžinama — nebeklausiam
				$ev = self::venipak_ivykiai( $nr ); $rep['uzklausu']++;
				if ( is_wp_error( $ev ) ) { $rep['klaidos'][] = '#' . $id . ' ' . $nr . ': ' . $ev->get_error_message(); continue; }
				if ( ! $ev ) { if ( ! $buvo ) { $sek[ $nr ] = array( 'k' => -1, 't' => 'įvykių nėra', 'e' => '', 'd' => '', 'v' => '', 'n' => 0, 'dalis' => $dalis, 'tikr' => $dabar ); $pakeista = true; } continue; }
				$pask = null; foreach ( $ev as $x ) { if ( ! is_array( $x ) || ! isset( $x['pack_status'] ) ) { continue; } if ( null === $pask || (string) ( $x['date'] ?? '' ) >= (string) ( $pask['date'] ?? '' ) ) { $pask = $x; } }
				if ( null === $pask ) { continue; }
				$loc = (array) ( $pask['location'] ?? array() ); $v = trim( (string) ( $loc['place'] ?? '' ) ); if ( '' === $v ) { $v = trim( (string) ( $loc['city'] ?? '' ) ); }
				$nauja = array( 'k' => (int) $pask['pack_status'], 't' => (string) ( $pask['pack_status_text'] ?? '' ), 'e' => (string) ( $pask['event'] ?? '' ), 'd' => (string) ( $pask['date'] ?? '' ), 'v' => mb_substr( $v, 0, 60 ), 'n' => count( $ev ), 'dalis' => $dalis, 'tikr' => $dabar );
				$kitas = ! $buvo || (int) $buvo['k'] !== $nauja['k'] || (int) ( $buvo['n'] ?? 0 ) !== $nauja['n'] || (string) ( $buvo['d'] ?? '' ) !== $nauja['d'];
				if ( $kitas ) { $sek[ $nr ] = $nauja; $pakeista = true; $rep['pakeista']++; }
				$k = $nauja['k'];
				// Grąžinama siuntėjui: kodas nežinomas (recon tokios siuntos neturėjo) — pagal tekstą „return“ / „to sender“ (k≠0, nes 0 = „At sender“).
				if ( 0 !== $k && preg_match( '/return|grąž|to sender|back to/iu', $nauja['e'] . ' ' . $nauja['t'] ) ) {
					if ( empty( $grizta[ $dalis ] ) ) { $grizta[ $dalis ] = array( 'nr' => $nr, 't' => $nauja['t'], 'e' => $nauja['e'], 'd' => $nauja['d'], 'kada' => $dabar ); $naujai_griz[ $dalis ] = $nr; }
					$sek[ $nr ]['stop'] = 1; $pakeista = true; continue;
				}
				if ( $kitas && $k > 0 && ! in_array( $k, self::VENIPAK_PAEME, true ) ) { $nezinomi[] = $nr . ' ' . $k . ' „' . $nauja['t'] . '“'; }
				if ( ! $uzdarytas && in_array( $k, self::VENIPAK_PAEME, true ) && empty( $iss[ $dalis ] ) && ! isset( $paeme[ $dalis ] ) ) { $paeme[ $dalis ] = $nr; }
				if ( self::VENIPAK_PRISTATYTA === $k && $kitas ) { $naujai_prist[ $nr ] = $dalis; }
			}
		}
		if ( $pakeista ) { $o->update_meta_data( self::SEK_META, wp_json_encode( $sek ) ); }
		if ( $naujai_griz ) { $o->update_meta_data( self::GRIZTA_META, wp_json_encode( $grizta ) ); }
		if ( $pakeista || $naujai_griz ) { $o->save(); }
		foreach ( $nezinomi as $t ) { $o->add_order_note( 'Venipak: ' . $t . ' — nežinomas būsenos kodas, veiksmo nėra (žr. skydelį).', false, true ); $rep['nezinomi'][] = '#' . $id . ' ' . $t; }
		foreach ( $naujai_griz as $dalis => $nr ) {
			$o->add_order_note( sprintf( 'Venipak: siunta %s grąžinama siuntėjui („%s“, %s) — Klausimas „Siunta grįžta“.', $nr, $grizta[ $dalis ]['t'], $grizta[ $dalis ]['d'] ), false, true );
			if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $id, 'sritis' => 'desk', 'veiksmas' => 'venipak_grizta', 'rezultatas' => 'ok', 'kanalas' => 'venipak', 'po' => array( 'dalis' => $dalis, 'nr' => $nr, 'tekstas' => $grizta[ $dalis ]['t'] ), 'pastaba' => 'Klausimas „Siunta grįžta“' ) ); }
			do_action( 'ps_juosta_isvalyti' ); $rep['grizta'][] = '#' . $id . ' ' . $dalis . ' ' . $nr;
		}
		if ( $nezinomi || $naujai_griz ) { $o->save(); }
		// Paėmė → tas pats „[T] išsiuntė“ / „Kurjeris paėmė“ kaip darbuotojo, kanalas venipak (laiškas klientui išeina pats).
		foreach ( $paeme as $dalis => $nr ) {
			$oo = wc_get_order( $id ); if ( ! $oo ) { break; }
			$r = self::issiusta( $oo, null, true, $dalis, 'venipak' );
			$rep['issiusta'][] = '#' . $id . ' ' . $dalis . ' ' . $nr . ' → ' . $r[0] . ': ' . $r[1];
			if ( ! in_array( $r[0], array( 'dl_issiusta', 'dl_dalis', 'dl_info' ), true ) ) { $rep['klaidos'][] = '#' . $id . ' ' . $dalis . ': ' . $r[1]; }
		}
		// Pristatyta — pastaba + įvykis (laiško nesiunčiam: kurjerio SMS; paskyroje — „Pristatyta“ per `kliento_siuntos()`).
		if ( $naujai_prist ) {
			$oo = wc_get_order( $id ); if ( ! $oo ) { return; }
			foreach ( $naujai_prist as $nr => $dalis ) {
				$x = $sek[ $nr ]; $oo->add_order_note( sprintf( 'Venipak: siunta %s pristatyta (%s%s).', $nr, $x['d'], $x['v'] ? ', ' . $x['v'] : '' ), false, true );
				if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $id, 'sritis' => 'desk', 'veiksmas' => 'venipak_pristatyta', 'rezultatas' => 'ok', 'kanalas' => 'venipak', 'po' => array( 'dalis' => $dalis, 'nr' => $nr, 'kada' => $x['d'], 'kur' => $x['v'] ) ) ); }
				$rep['pristatyta'][] = '#' . $id . ' ' . $dalis . ' ' . $nr . ' ' . $x['d'];
			}
			$oo->save();
		}
	}

	/** v3.12 (#2): LP Express — TIK plugino meta (`_woo_lithuaniapost_barcode` + `_woo_lithuaniapost_shipping_status_value`; pluginas, esant „Never“, užsakymo statuso
	 *  nekeičia — S1613 recon). `lp-on-the-way` / `lp-delivered` → „Kurjeris paėmė“ per `issiusta(…,'av','lp')` (laiškas klientui); `lp-delivered` →
	 *  „Pristatyta“ (įrašas `_ps_venipak_sekimas[nr]` k=9, vez=lp; pastaba + įvykis, laiško nėra). Data — plugino lentelės `updated`, kitaip pastebėjimo laikas. */
	protected static function sekti_lp( $o, &$rep ) {
		$bc = $o->get_meta( '_woo_lithuaniapost_barcode' ); $bc = trim( is_array( $bc ) ? (string) reset( $bc ) : (string) $bc );
		if ( '' === $bc ) { return; }
		$st = trim( (string) $o->get_meta( '_woo_lithuaniapost_shipping_status_value' ) ); if ( '' === $st ) { return; }
		$id = $o->get_id(); $rep['lp']++;
		$sek = self::sekimas( $o ); $buvo = $sek[ $bc ] ?? null; $dabar = current_time( 'mysql' );
		if ( $buvo && self::VENIPAK_PRISTATYTA === (int) $buvo['k'] ) { return; } // pristatyta — nebežiūrim
		$iss = json_decode( (string) $o->get_meta( '_ps_dalys_issiusta' ), true ); if ( ! is_array( $iss ) ) { $iss = array(); }
		$uzdarytas = in_array( $o->get_status(), array_merge( Petshop_Desk::STATUSAI['ivykdyti'], Petshop_Desk::STATUSAI['kelyje'] ), true );
		$k = self::LP_KODAI[ $st ] ?? 0; $kitas = ! $buvo || (string) ( $buvo['t'] ?? '' ) !== $st;
		if ( $kitas ) {
			global $wpdb; $d = '';
			if ( ! empty( $wpdb->woo_lithuaniapost_tracking_status ) ) { $d = (string) $wpdb->get_var( $wpdb->prepare( "SELECT updated FROM {$wpdb->woo_lithuaniapost_tracking_status} WHERE barcode = %s ORDER BY updated DESC LIMIT 1", $bc ) ); }
			if ( '' === $d ) { $d = $dabar; }
			$sek[ $bc ] = array( 'k' => $k, 't' => $st, 'e' => self::LP_TEKSTAI[ $st ] ?? $st, 'd' => $d, 'v' => '', 'n' => 0, 'dalis' => 'av', 'tikr' => $dabar, 'vez' => 'lp' );
			$o->update_meta_data( self::SEK_META, wp_json_encode( $sek ) ); $o->save(); $rep['pakeista']++;
		}
		// Paėmė → tas pats „Kurjeris paėmė“ kaip darbuotojo, kanalas lp (laiškas klientui išeina pats).
		if ( ! $uzdarytas && in_array( $st, self::LP_PAEME, true ) && empty( $iss['av'] ) ) {
			$oo = wc_get_order( $id ); if ( ! $oo ) { return; }
			$r = self::issiusta( $oo, null, true, 'av', 'lp' );
			$rep['issiusta'][] = '#' . $id . ' av ' . $bc . ' (LP) → ' . $r[0] . ': ' . $r[1];
			if ( ! in_array( $r[0], array( 'dl_issiusta', 'dl_dalis', 'dl_info' ), true ) ) { $rep['klaidos'][] = '#' . $id . ' av (LP): ' . $r[1]; }
		}
		// Pristatyta — pastaba + įvykis (laiško nesiunčiam; paskyroje — „Pristatyta“ per `kliento_siuntos()`).
		if ( $kitas && self::LP_PRISTATYTA === $st ) {
			$oo = wc_get_order( $id ); if ( ! $oo ) { return; }
			$oo->add_order_note( sprintf( 'LP Express: siunta %s pristatyta (%s).', $bc, $sek[ $bc ]['d'] ), false, true ); $oo->save();
			if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $id, 'sritis' => 'desk', 'veiksmas' => 'lp_pristatyta', 'rezultatas' => 'ok', 'kanalas' => 'lp', 'po' => array( 'dalis' => 'av', 'nr' => $bc, 'kada' => $sek[ $bc ]['d'] ) ) ); }
			$rep['pristatyta'][] = '#' . $id . ' av ' . $bc . ' (LP) ' . $sek[ $bc ]['d'];
		}
	}

	/* ============================ v3.13 — VĖLAVIMO LAIŠKAS (4 etapas #4, log S1611 sprendimas 3) ============================ */

	const VELUOJA_VAL = 24; // v3.14 V13: tiekėjo dalis „vėluoja“ po tiek val. nuo užsakymo tiekėjui (kaip variklio sargo RIBA_H)
	const VEL_META   = '_ps_velavimo_laiskas';
	const VEL_VAL    = 14; // darbo dienom 14:00 Vilnius (Raimis: tiekėjai ir Venipak išsiunčia iki pietų)
	const VEL_DIENOS = 3;  // pilnos darbo dienos nuo apmokėjimo (apmokėjimo diena neskaičiuojama)
	/** LT šventės (fiksuotos, mm-dd) + Velykų pirmadienis (`velykos()`). Motinos / Tėvo diena — sekmadieniai. */
	const LT_SVENTES = array( '01-01', '02-16', '03-11', '05-01', '06-24', '07-06', '08-15', '11-01', '11-02', '12-24', '12-25', '12-26' );

	/** Velykų sekmadienis (Grigaliaus, anoniminis algoritmas) → 'Y-m-d'. */
	public static function velykos( $metai ) {
		$metai = (int) $metai; $a = $metai % 19; $b = intdiv( $metai, 100 ); $c = $metai % 100; $d = intdiv( $b, 4 ); $e = $b % 4; $f = intdiv( $b + 8, 25 ); $g = intdiv( $b - $f + 1, 3 );
		$h = ( 19 * $a + $b - $d - $g + 15 ) % 30; $i = intdiv( $c, 4 ); $k = $c % 4; $l = ( 32 + 2 * $e + 2 * $i - $h - $k ) % 7; $m = intdiv( $a + 11 * $h + 22 * $l, 451 );
		$men = intdiv( $h + $l - 7 * $m + 114, 31 ); $diena = ( ( $h + $l - 7 * $m + 114 ) % 31 ) + 1;
		return sprintf( '%04d-%02d-%02d', $metai, $men, $diena );
	}
	/** Ar darbo diena (Pr–Pn be LT švenčių ir Velykų pirmadienio); $ymd — 'Y-m-d' Vilniaus laiku. */
	public static function darbo_diena( $ymd ) {
		$tz = wp_timezone(); $dt = new DateTime( $ymd . ' 12:00:00', $tz );
		if ( (int) $dt->format( 'N' ) >= 6 ) { return false; }
		if ( in_array( $dt->format( 'm-d' ), self::LT_SVENTES, true ) ) { return false; }
		$v = new DateTime( self::velykos( (int) $dt->format( 'Y' ) ) . ' 12:00:00', $tz ); $v->modify( '+1 day' );
		return $dt->format( 'Y-m-d' ) !== $v->format( 'Y-m-d' );
	}
	/** Pilnos darbo dienos GRIEŽTAI tarp dviejų datų (apmokėjimo diena ir šiandiena neskaičiuojamos): Pr → Pn = 3 (An, Tr, Kt). */
	public static function pilnos_darbo_dienos( $nuo_ymd, $iki_ymd ) {
		$tz = wp_timezone(); $d = new DateTime( $nuo_ymd . ' 12:00:00', $tz ); $iki = new DateTime( $iki_ymd . ' 12:00:00', $tz ); $n = 0;
		for ( $i = 0; $i < 120; $i++ ) { $d->modify( '+1 day' ); if ( $d >= $iki ) { break; } if ( self::darbo_diena( $d->format( 'Y-m-d' ) ) ) { $n++; } }
		return $n;
	}
	/** Kitas 14:00 Vilnius (UTC timestamp) griežtai po $nuo (numatyta — dabar). */
	public static function kitas_1400( $nuo = null ) {
		$tz = wp_timezone(); $d = new DateTime( 'now', $tz ); if ( null !== $nuo ) { $d->setTimestamp( (int) $nuo ); }
		$t = clone $d; $t->setTime( self::VEL_VAL, 0, 0 ); if ( $t <= $d ) { $t->modify( '+1 day' ); }
		return $t->getTimestamp();
	}
	/** Kandidatai: apmokėti, atviri (processing / LP paruošta), be žymės, sukurti per 60 d. (HPOS). */
	protected static function velavimo_kandidatai() {
		global $wpdb; $p = $wpdb->prefix;
		$st = array_merge( array( 'processing' ), Petshop_Desk::STATUSAI['paruosta'] );
		$in = implode( ',', array_map( function ( $x ) use ( $wpdb ) { return $wpdb->prepare( '%s', 'wc-' . $x ); }, $st ) );
		$nuo = gmdate( 'Y-m-d H:i:s', time() - 60 * DAY_IN_SECONDS );
		return array_map( 'intval', (array) $wpdb->get_col( $wpdb->prepare( "SELECT o.id FROM {$p}wc_orders o LEFT JOIN {$p}wc_orders_meta m ON m.order_id = o.id AND m.meta_key = %s WHERE o.type = 'shop_order' AND o.status IN ($in) AND o.date_created_gmt > %s AND m.order_id IS NULL ORDER BY o.id ASC LIMIT 300", self::VEL_META, $nuo ) ) );
	}
	/** CRON `ps_velavimo_laiskai` — darbo dienom 14:00 Vilnius. $dabar — UTC timestamp (testams: simuliuota diena), $tik_ids — testams. Grąžina ataskaitą. */
	public static function velavimo_laiskai( $dabar = null, $tik_ids = array() ) {
		$testas = ( null !== $dabar ) || ! empty( $tik_ids );
		if ( ! $testas ) { wp_clear_scheduled_hook( 'ps_velavimo_laiskai' ); wp_schedule_single_event( self::kitas_1400(), 'ps_velavimo_laiskai' ); }
		$tz = wp_timezone(); $d = new DateTime( 'now', $tz ); if ( null !== $dabar ) { $d->setTimestamp( (int) $dabar ); }
		$siandien = $d->format( 'Y-m-d' );
		$rep = array( 'dabar' => $d->format( 'Y-m-d H:i' ), 'darbo_diena' => self::darbo_diena( $siandien ), 'uzsakymu' => 0, 'issiusta' => array(), 'praleista' => array(), 'klaidos' => array(), 's' => 0 );
		$pradzia = microtime( true );
		if ( ! $rep['darbo_diena'] ) { $rep['praleista'][] = 'ne darbo diena'; }
		elseif ( ! class_exists( 'Petshop_Desk' ) ) { $rep['klaidos'][] = 'variklio nėra'; }
		else {
			$ids = $tik_ids ? array_map( 'intval', (array) $tik_ids ) : self::velavimo_kandidatai();
			foreach ( $ids as $oid ) {
				if ( microtime( true ) - $pradzia > 200 ) { $rep['klaidos'][] = 'laikas baigėsi ties #' . $oid; break; }
				$o = wc_get_order( $oid ); if ( ! $o ) { continue; }
				$rep['uzsakymu']++;
				try { $r = self::velavimo_laiskas( $o, $siandien ); } catch ( Throwable $e ) { $rep['klaidos'][] = '#' . $oid . ': ' . $e->getMessage(); continue; }
				if ( $r[0] ) { $rep['issiusta'][] = '#' . $oid . ' ' . $r[1]; } else { $rep['praleista'][] = '#' . $oid . ' ' . $r[1]; }
			}
		}
		$rep['s'] = round( microtime( true ) - $pradzia, 1 );
		if ( ! $testas ) { update_option( 'ps_velavimo_laiskai_paskutinis', array( 'laikas' => current_time( 'mysql' ), 'darbo_diena' => $rep['darbo_diena'], 'uzsakymu' => $rep['uzsakymu'], 'issiusta' => count( $rep['issiusta'] ), 'praleista' => count( $rep['praleista'] ), 'klaidos' => count( $rep['klaidos'] ), 's' => $rep['s'] ), false ); }
		return $rep;
	}
	/** Vienas užsakymas: sąlygos (log S1611 spr. 3) → laiškas Raimio tekstu → žymė, pastaba, įvykis. Grąžina [ok, tekstas].
	 *  v3.15: $u (WP_User) — rankinis mygtukas: ≥3 d. d. ir Klausimų sargai praleidžiami (darbuotojas sprendžia), kanalas web, kas — darbuotojas. */
	protected static function velavimo_laiskas( $o, $siandien, $u = null ) {
		if ( $o->get_meta( self::VEL_META ) ) { return array( false, 'jau pranešta ' . $o->get_meta( self::VEL_META ) ); }
		if ( ! $o->is_paid() ) { return array( false, 'neapmokėtas' ); }
		$st = $o->get_status();
		if ( in_array( $st, array_merge( Petshop_Desk::STATUSAI['neapmoketi'], Petshop_Desk::STATUSAI['atsaukti'], Petshop_Desk::STATUSAI['ivykdyti'], Petshop_Desk::STATUSAI['kelyje'] ), true ) ) { return array( false, 'būsena ' . $st ); }
		$dp = $o->get_date_paid() ? $o->get_date_paid() : $o->get_date_created(); if ( ! $dp ) { return array( false, 'apmokėjimo datos nėra' ); }
		$dpv = clone $dp; $dpv->setTimezone( wp_timezone() ); $dd = self::pilnos_darbo_dienos( $dpv->format( 'Y-m-d' ), $siandien );
		if ( ! $u && $dd < self::VEL_DIENOS ) { return array( false, 'apmokėta ' . $dpv->format( 'm-d' ) . ' — praėjo ' . $dd . ' d. d.' ); }
		$f = self::faktai( $o, self::zurnalas( array( $o->get_id() ) ) );
		if ( ! $u && $f['kl'] ) { return array( false, 'Klausimuose: ' . $f['kl'] ); }
		$liko = array(); $issiusta = 0;
		foreach ( $f['dalys'] as $k => $p ) { if ( ! $p ) { continue; } if ( ! empty( $p['issiusta'] ) ) { $issiusta++; } else { $liko[] = $k; } }
		if ( ! $liko ) { return array( false, 'visos siuntos išsiųstos' ); }
		$el = $o->get_billing_email(); if ( ! $el ) { return array( false, 'el. pašto nėra' ); }
		$nr = $o->get_order_number(); $vardas = trim( (string) $o->get_billing_first_name() );
		// Raimio tekstas (log S1611 sprendimas 3), pataisyta rašyba; dalis išsiųsta — „Likusių …“.
		$p1 = $issiusta ? sprintf( 'Likusių Jūsų užsakymo Nr. %s prekių surinkimas truputį užtruko.', $nr ) : sprintf( 'Jūsų užsakymo Nr. %s surinkimas truputį užtruko.', $nr );
		$h  = '<p>' . esc_html( $vardas ? "Sveiki, {$vardas}." : 'Sveiki.' ) . '</p>';
		$h .= '<p>' . esc_html( $p1 . ' Išsiųsime jį kaip galėdami greičiau. Ačiū už kantrybę.' ) . '</p>';
		$h .= '<p>' . esc_html( 'Išsiuntę užsakymą informuosime Jus atskiru laišku.' ) . '</p>';
		$h .= '<p>' . esc_html( 'Jei turite klausimų, tiesiog atsakykite į šį laišką.' ) . '</p>';
		$h .= '<p>' . esc_html( 'Gražios dienos,' ) . '<br>' . esc_html( 'petshop.lt' ) . '</p>';
		$tema = sprintf( 'Jūsų užsakymą Nr. %s dar komplektuojame', $nr ); // Raimis 09-04 (S1613); antraštė viduje — tas pats sakinys
		$mailer = WC()->mailer(); $ok = $mailer->send( $el, $tema, $mailer->wrap_message( $tema, $h ) );
		if ( ! $ok ) { return array( false, 'laiško išsiųsti nepavyko' ); }
		$dabar = current_time( 'mysql' ); $liko_v = array(); foreach ( $liko as $k ) { $liko_v[] = self::vardas( $k ); }
		$o->update_meta_data( self::VEL_META, $dabar );
		$o->add_order_note( sprintf( 'Klientui išsiųstas vėlavimo laiškas (%s%s): apmokėta %s, praėjo %d pilnos darbo dienos; dar neišsiųsta: %s.', $el, $u ? '; darbuotojas ' . $u->display_name : '', $dpv->format( 'm-d' ), $dd, implode( ', ', $liko_v ) ), false, true ); $o->save();
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'velavimo_laiskas', 'rezultatas' => 'ok', 'kanalas' => $u ? 'web' : 'cron', 'kas' => $u ? $u->ID : 0, 'kas_vardas' => $u ? $u->display_name : 'sistema', 'po' => array( 'el' => $el, 'apmoketa' => $dpv->format( 'Y-m-d' ), 'darbo_dienos' => $dd, 'liko' => $liko, 'issiusta_daliu' => $issiusta ), 'pastaba' => $u ? 'rankiniu mygtuku' : null ) ); }
		do_action( 'ps_juosta_isvalyti' );
		return array( true, 'laiškas ' . $el . ' (apmokėta ' . $dpv->format( 'm-d' ) . ', ' . $dd . ' d. d.; liko: ' . implode( ', ', $liko_v ) . ')' );
	}

	/* ============================ v3.11.1 — KLAUSIMAS „SIUNTA GRĮŽTA“: SPRENDIMAI (4 etapas #3) ============================ */

	const SENOS_META = '_ps_siuntos_senos';
	/** `_ps_siuntos_senos` → [nr, …] — numeriai, kurių nebeskaitom (grįžusi siunta, perregistruota). */
	public static function senos( $o ) { $m = $o->get_meta( self::SENOS_META ); if ( is_array( $m ) ) { return array_values( array_filter( array_map( 'strval', $m ) ) ); } $j = json_decode( (string) $m, true ); return is_array( $j ) ? array_values( array_filter( array_map( 'strval', $j ) ) ) : array(); }

	/* ============================ v3.21: PAKARTOTINIS UŽSAKYMAS (spec §12.5; Raimis 09-05 a/b/c) ============================ */

	/** Paslaugos prekė „Pakartotinis siuntimas“ — virtuali, be likučio, privati (kataloge nematoma, klientui nepirktina); kuriama vieną kartą, ID opcijoje. */
	protected static function pakartotinis_preke() {
		$id = (int) get_option( self::PAKART_PREKE_OPT ); $p = $id ? wc_get_product( $id ) : null;
		if ( $p && 'trash' !== $p->get_status() ) { return $p; }
		$p = new WC_Product_Simple();
		$p->set_name( 'Pakartotinis siuntimas' ); $p->set_status( 'private' ); $p->set_catalog_visibility( 'hidden' ); $p->set_virtual( true );
		$p->set_regular_price( '3.99' ); $p->set_tax_status( 'taxable' ); $p->set_tax_class( '' ); $p->set_manage_stock( false ); $p->set_stock_status( 'instock' ); $p->set_sold_individually( true ); $p->set_reviews_allowed( false );
		$p->set_description( 'Paslauga: grįžusios neatsiimtos / nepristatytos siuntos pakartotinis siuntimas (pristatymo įkainis + siuntos grąžinimo išlaidos 3,99 €). Naudoja darbalaukis („Pakartotinis užsakymas“).' );
		$p->update_meta_data( '_ps_paslauga', 'pakartotinis' ); $p->update_meta_data( '_ps_sandelis', 'paslauga' );
		$pid = $p->save(); if ( ! $pid ) { return null; }
		update_option( self::PAKART_PREKE_OPT, $pid, false );
		return wc_get_product( $pid );
	}

	/** Pakartotinio užsakymo būsena pradiniam užsakymui: null | [b: laukia|apmoketa|nemokamai, id, nr, suma, laikas, t (tekstas darbuotojui)]. */
	public static function pakartotinis_bukle( $o ) {
		$nid = (int) $o->get_meta( self::PAKART_ID_META ); $n = $nid ? wc_get_order( $nid ) : null;
		if ( $n && 'shop_order' === $n->get_type() ) {
			$suma = self::eur( $n->get_total() ); $nr = $n->get_order_number();
			if ( $n->is_paid() ) { $dp = $n->get_date_paid() ? $n->get_date_paid() : $n->get_date_modified(); $k = $dp ? wp_date( 'm-d H:i', $dp->getTimestamp() ) : ''; return array( 'b' => 'apmoketa', 'id' => $nid, 'nr' => $nr, 'suma' => $suma, 'laikas' => $k, 't' => 'Pakartotinis užsakymas #' . $nr . ' (' . $suma . ' €) apmokėtas ' . $k . ' — galima „Siųsti iš naujo“.' ); }
			if ( in_array( $n->get_status(), array( 'pending', 'on-hold', 'failed' ), true ) ) { $s = (string) $n->get_meta( '_ps_pakart_nuoroda' ); $bacs = 'bacs' === $n->get_payment_method(); return array( 'b' => 'laukia', 'id' => $nid, 'nr' => $nr, 'suma' => $suma, 'laikas' => $s, 'bacs' => $bacs, 't' => 'Pakartotinis užsakymas #' . $nr . ' (' . $suma . ' €): laukia kliento apmokėjimo' . ( $s ? ' — nuoroda išsiųsta ' . substr( $s, 5, 11 ) : ' — nuoroda NEIŠSIŲSTA' ) . '.' . ( $bacs ? ' Klientas pasirinko pavedimą — kai pinigai banke, spausk „Apmokėta pavedimu“.' : '' ) ); }
		}
		$nm = (string) $o->get_meta( self::PAKART_NEMOK_META );
		if ( $nm ) { return array( 'b' => 'nemokamai', 'id' => 0, 'nr' => '', 'suma' => '0,00', 'laikas' => $nm, 't' => 'Pakartotinis siuntimas be mokesčio — mūsų / vežėjo kaltė (' . str_replace( '|', ', ', substr( $nm, 5, 11 ) . substr( $nm, 19 ) ) . ') — galima „Siųsti iš naujo“.' ); }
		return null;
	}

	/** Po „Siųsti iš naujo“: žymės nuimamos, istorija — `_ps_pakartotiniai` (kitam grįžimui reikės naujo pakartotinio užsakymo). */
	protected static function pakartotinis_panaudotas( $o, $pk ) {
		if ( ! $pk ) { return; }
		$h = json_decode( (string) $o->get_meta( '_ps_pakartotiniai' ), true ); $h = is_array( $h ) ? $h : array();
		$h[] = array( 'id' => (int) $pk['id'], 'b' => $pk['b'], 'suma' => $pk['suma'], 'laikas' => current_time( 'mysql' ) );
		$o->update_meta_data( '_ps_pakartotiniai', wp_json_encode( $h ) ); $o->delete_meta_data( self::PAKART_ID_META ); $o->delete_meta_data( self::PAKART_NEMOK_META );
	}

	/** Neapmokėtas pakartotinis užsakymas → cancelled be laiškų. Grąžina true, jei atšauktas. */
	protected static function pakartotinis_atsaukti_nauja( $o, $kodel ) {
		$nid = (int) $o->get_meta( self::PAKART_ID_META ); $n = $nid ? wc_get_order( $nid ) : null;
		if ( ! $n || $n->is_paid() || in_array( $n->get_status(), array( 'cancelled', 'refunded', 'completed' ), true ) ) { return false; }
		self::d( 'laiskai_off' ); $n->update_status( 'cancelled', 'Darbalaukis: ' . $kodel . ' (pradinis užsakymas #' . $o->get_order_number() . '). Laiškas klientui nesiunčiamas.' ); self::d( 'laiskai_on' );
		return true;
	}

	/** POST `ps_dl_pakartotinis` (Klausimų kortelės forma): ka=sukurti — naujas mažas užsakymas + laiškas su apmokėjimo nuoroda; ka=nemokamai — žymė „be mokesčio“. */
	public static function pakartotinis_vykdyti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		$id = absint( $_POST['id'] ?? 0 ); check_admin_referer( 'ps_dl_pakart_' . $id );
		$o = wc_get_order( $id ); if ( ! $o ) { wp_die( 'Užsakymas nerastas' ); }
		$atgal = wp_validate_redirect( wp_unslash( $_POST['g'] ?? '' ), admin_url( 'admin.php?page=' . self::SLUG . '&eile=klausimai' ) );
		$u = wp_get_current_user(); $lock = 'ps_dl_lock_' . $id;
		$baigti = function ( $k, $t ) use ( $o, $atgal, $lock ) { delete_transient( $lock ); wp_safe_redirect( add_query_arg( array( 'pd_ok' => $k, 'pd_nr' => rawurlencode( $o->get_order_number() . '|' . $t ) ), $atgal ) ); exit; };
		if ( get_transient( $lock ) ) { $baigti( 'dl_info', 'veiksmas jau vykdomas — palauk sekundę' ); } set_transient( $lock, 1, 20 );
		$r = array( 'dl_klaida', 'nežinomas veiksmas' );
		try {
			$ka = sanitize_key( wp_unslash( $_POST['ka'] ?? '' ) );
			if ( 'nemokamai' === $ka ) { $r = self::pakartotinis_nemokamai( $o, $u ); }
			elseif ( 'sukurti' === $ka ) { $r = self::pakartotinis_sukurti( $o, $u, (float) str_replace( ',', '.', sanitize_text_field( wp_unslash( $_POST['suma'] ?? '' ) ) ) ); }
		} catch ( Throwable $e ) { $r = array( 'dl_klaida', 'klaida: ' . $e->getMessage() ); }
		$baigti( $r[0], $r[1] );
	}

	/** „Be mokesčio“ — nepristatyta dėl mūsų / vežėjo kaltės (spec §12.5: 3,99 netaikoma, darbuotojas nuima rankomis): žymė, neapmokėtas pakartotinis atšaukiamas. */
	protected static function pakartotinis_nemokamai( $o, $u ) {
		if ( ! self::grizta( $o ) ) { return array( 'dl_info', 'grįžtančios siuntos nėra' ); }
		$pk = self::pakartotinis_bukle( $o ); if ( $pk && 'apmoketa' === $pk['b'] ) { return array( 'dl_info', 'pakartotinis užsakymas #' . $pk['nr'] . ' jau apmokėtas — spausk „Siųsti iš naujo“' ); }
		$ats = self::pakartotinis_atsaukti_nauja( $o, 'pakartotinis siuntimas be mokesčio (mūsų / vežėjo kaltė)' ); if ( $ats ) { $o->delete_meta_data( self::PAKART_ID_META ); }
		$o->update_meta_data( self::PAKART_NEMOK_META, current_time( 'mysql' ) . '|' . $u->display_name );
		$o->add_order_note( 'Darbalaukis: pakartotinis siuntimas BE MOKESČIO — nepristatyta dėl mūsų / vežėjo kaltės (' . $u->display_name . ').' . ( $ats && $pk ? ' Neapmokėtas pakartotinis užsakymas #' . $pk['nr'] . ' atšauktas.' : '' ) . ' Galima „Siųsti iš naujo“.', false, true ); $o->save();
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'pakart_nemokamai', 'rezultatas' => 'ok', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'atsauktas' => $ats && $pk ? (int) $pk['id'] : 0 ), 'pastaba' => 'pakartotinis siuntimas be mokesčio' ) ); }
		return array( 'dl_info', 'pažymėta: siunčiama be mokesčio' . ( $ats && $pk ? ' — pakartotinis užsakymas #' . $pk['nr'] . ' atšauktas' : '' ) . ' — dabar „Siųsti iš naujo“' );
	}

	/** Naujas mažas užsakymas (Raimis 09-05 a): svečio, tas pats adresas / el. paštas, viena virtuali paslaugos prekė „Pakartotinis siuntimas už užsakymą #N“, suma su PVM = $suma;
	 *  meta `_ps_pakartotinis` = pradinio ID (darbalaukis jį praleidžia); klientui laiškas su WC apmokėjimo nuoroda. Pradinis užsakymas ir sąskaita neliečiami. */
	protected static function pakartotinis_sukurti( $o, $u, $suma ) {
		if ( ! self::grizta( $o ) ) { return array( 'dl_info', 'grįžtančios siuntos nėra' ); }
		if ( ! $o->is_paid() ) { return array( 'dl_klaida', 'pradinis užsakymas neapmokėtas' ); }
		$pk = self::pakartotinis_bukle( $o );
		if ( $pk && 'laukia' === $pk['b'] ) { return array( 'dl_klaida', 'pakartotinis užsakymas #' . $pk['nr'] . ' jau sukurtas ir laukia apmokėjimo („siųsti nuorodą dar kartą“ kortelėje)' ); }
		if ( $pk && 'apmoketa' === $pk['b'] ) { return array( 'dl_klaida', 'pakartotinis užsakymas #' . $pk['nr'] . ' jau apmokėtas — spausk „Siųsti iš naujo“' ); }
		$suma = round( (float) $suma, 2 ); if ( $suma < 0.5 || $suma > 200 ) { return array( 'dl_klaida', 'bloga suma ' . self::eur( $suma ) . ' € — įrašyk 0,50…200,00' ); }
		$el = $o->get_billing_email(); if ( ! is_email( $el ) ) { return array( 'dl_klaida', 'kliento el. pašto nėra — parašyk klientui rankomis' ); }
		$p = self::pakartotinis_preke(); if ( ! $p ) { return array( 'dl_klaida', 'paslaugos prekės sukurti nepavyko' ); }
		$f = self::faktai( $o, self::zurnalas( array( $o->get_id() ) ) ); $sm = self::grizta_sumos( $f ); $ik = ( $sm && null !== $sm['ikainis'] ) ? (float) $sm['ikainis'] : null;
		$n = wc_create_order( array( 'customer_id' => 0, 'created_via' => 'darbalaukis', 'status' => 'pending' ) );
		if ( is_wp_error( $n ) || ! $n ) { return array( 'dl_klaida', 'užsakymo sukurti nepavyko' . ( is_wp_error( $n ) ? ': ' . $n->get_error_message() : '' ) ); }
		$n->set_address( $o->get_address( 'billing' ), 'billing' ); $n->set_address( $o->get_address( 'shipping' ), 'shipping' );
		$n->set_currency( $o->get_currency() ); $n->set_prices_include_tax( true );
		$it = new WC_Order_Item_Product(); $it->set_product( $p ); $it->set_quantity( 1 ); $it->set_name( 'Pakartotinis siuntimas už užsakymą #' . $o->get_order_number() );
		$neto = (float) wc_get_price_excluding_tax( $p, array( 'qty' => 1, 'price' => $suma ) ); $it->set_subtotal( $neto ); $it->set_total( $neto );
		$it->add_meta_data( '_ps_pakartotinis', (string) $o->get_id(), true ); $n->add_item( $it );
		$n->update_meta_data( self::PAKART_META, (string) $o->get_id() ); $n->update_meta_data( '_ps_uzbaigti_be_siuntu', '1' ); $n->update_meta_data( '_ps_pakart_ikainis', null === $ik ? '' : (string) $ik );
		if ( $o->get_customer_id() ) { $n->update_meta_data( '_ps_pakartotinis_klientas', (string) $o->get_customer_id() ); }
		$n->calculate_totals( true ); $n->save();
		$n = wc_get_order( $n->get_id() ); $viso = (float) $n->get_total();
		if ( abs( $viso - $suma ) > 0.011 ) { $n->update_status( 'cancelled', 'Darbalaukis: sumos klaida (' . self::eur( $viso ) . ' ≠ ' . self::eur( $suma ) . ') — užsakymas atšauktas.' ); return array( 'dl_klaida', 'sumos klaida: gauta ' . self::eur( $viso ) . ' €, turėjo būti ' . self::eur( $suma ) . ' € — užsakymas #' . $n->get_order_number() . ' atšauktas' ); }
		list( $tema, $h ) = self::pakartotinis_laiskas( $n, $o, $ik );
		$mailer = WC()->mailer(); $ok = (bool) $mailer->send( $el, $tema, $mailer->wrap_message( $tema, $h ) );
		$dabar = current_time( 'mysql' );
		if ( $ok ) { $n->update_meta_data( '_ps_pakart_nuoroda', $dabar ); }
		$n->add_order_note( sprintf( 'Darbalaukis: pakartotinis siuntimas už užsakymą #%s — %s € (%s). Apmokėjimo nuoroda klientui (%s) %s. Apmokėjus — įvykdomas pats (į Surinkti / Venipak neina).', $o->get_order_number(), self::eur( $viso ), $u->display_name, $el, $ok ? 'išsiųsta' : 'NEIŠSIŲSTA' ), false, true ); $n->save();
		$o->update_meta_data( self::PAKART_ID_META, (string) $n->get_id() ); $o->delete_meta_data( self::PAKART_NEMOK_META );
		$o->add_order_note( sprintf( 'Darbalaukis: sukurtas pakartotinis užsakymas #%s — %s € (%s). Klientui apmokėjimo nuoroda %s. „Siųsti iš naujo“ — tik apmokėjus.', $n->get_order_number(), self::eur( $viso ), $u->display_name, $ok ? 'išsiųsta' : 'NEIŠSIŲSTA — siųsk dar kartą' ), false, true ); $o->save();
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'pakartotinis', 'rezultatas' => $ok ? 'ok' : 'klaida', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'naujas' => $n->get_id(), 'suma' => $viso, 'ikainis' => $ik, 'laiskas' => $ok ? 1 : 0, 'kam' => $el ), 'pastaba' => 'pakartotinis užsakymas #' . $n->get_order_number() . ' ' . self::eur( $viso ) . ' €' ) ); }
		do_action( 'ps_juosta_isvalyti' );
		return array( $ok ? 'dl_info' : 'dl_klaida', 'pakartotinis užsakymas #' . $n->get_order_number() . ' (' . self::eur( $viso ) . ' €) sukurtas — ' . ( $ok ? 'apmokėjimo nuoroda klientui išsiųsta (' . $el . ')' : 'laiško išsiųsti NEPAVYKO — „siųsti nuorodą dar kartą“' ) );
	}

	/** „siųsti nuorodą dar kartą“ (GET `pakart_nuoroda`). */
	protected static function pakartotinis_nuoroda( $o, $u ) {
		$pk = self::pakartotinis_bukle( $o ); if ( ! $pk || 'laukia' !== $pk['b'] ) { return array( 'dl_info', 'neapmokėto pakartotinio užsakymo nėra' ); }
		$n = wc_get_order( $pk['id'] ); $el = $o->get_billing_email(); if ( ! $n || ! is_email( $el ) ) { return array( 'dl_klaida', 'užsakymo arba el. pašto nėra' ); }
		$ik = (string) $n->get_meta( '_ps_pakart_ikainis' ); list( $tema, $h ) = self::pakartotinis_laiskas( $n, $o, '' === $ik ? null : (float) $ik );
		$mailer = WC()->mailer(); $ok = (bool) $mailer->send( $el, $tema, $mailer->wrap_message( $tema, $h ) );
		if ( $ok ) { $n->update_meta_data( '_ps_pakart_nuoroda', current_time( 'mysql' ) ); $n->add_order_note( 'Darbalaukis: apmokėjimo nuoroda klientui išsiųsta dar kartą (' . $u->display_name . ').', false, true ); $n->save(); }
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'pakart_nuoroda', 'rezultatas' => $ok ? 'ok' : 'klaida', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'naujas' => $n->get_id(), 'kam' => $el ), 'pastaba' => 'apmokėjimo nuoroda dar kartą' ) ); }
		return array( $ok ? 'dl_info' : 'dl_klaida', $ok ? 'apmokėjimo nuoroda išsiųsta dar kartą (' . $el . ')' : 'laiško išsiųsti nepavyko' );
	}

	/** Laiškas su apmokėjimo nuoroda — [tema, html]. Tekstas: Claude siūlo, Raimis tvirtina (spec §12.5). */
	protected static function pakartotinis_laiskas( $n, $o, $ik ) {
		$nr = $o->get_order_number(); $vardas = trim( (string) $o->get_billing_first_name() ); $suma = self::eur( $n->get_total() ); $url = $n->get_checkout_payment_url();
		$kaina = null === $ik ? $suma . ' € (pristatymas + 3,99 € siuntos grąžinimo išlaidos)' : $suma . ' € (' . self::eur( $ik ) . ' € pristatymas + 3,99 € siuntos grąžinimo išlaidos)';
		$h  = '<p>' . esc_html( $vardas ? "Sveiki, {$vardas}." : 'Sveiki.' ) . '</p>';
		$h .= '<p>' . esc_html( sprintf( 'Jūsų užsakymo Nr. %s siunta grįžo mums neatsiimta / nepristatyta.', $nr ) ) . '</p>';
		$h .= '<p>' . esc_html( 'Galime išsiųsti ją iš naujo tuo pačiu adresu. Pakartotinio siuntimo kaina — ' . $kaina . ', pagal pirkimo taisyklių 6.10–6.11 p. Apmokėti galite internetu (mygtukas) arba pavedimu.' ) . '</p>';
		$h .= '<p style="margin:18px 0"><a href="' . esc_url( $url ) . '" style="display:inline-block;background:#2d6a35;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:bold">' . esc_html( 'Apmokėti ' . $suma . ' €' ) . '</a><br><span style="font-size:12px;color:#777">' . esc_html( 'Jei mygtukas neveikia, atidarykite nuorodą: ' ) . '<a href="' . esc_url( $url ) . '">' . esc_html( $url ) . '</a></span></p>';
		$h .= '<p>' . esc_html( 'Arba pavedimu: ' . self::PAKART_BANKAS . ', suma ' . $suma . ' €, paskirtis „Pakartotinis siuntimas, užsakymas Nr. ' . $nr . '“.' ) . '</p>';
		$h .= '<p>' . esc_html( 'Gavę apmokėjimą, siuntą išsiųsime iš naujo ir atsiųsime sekimo numerį. Jei norite kito adreso ar paštomato — parašykite atsakydami į šį laišką prieš apmokėdami.' ) . '</p>';
		$h .= '<p>' . esc_html( 'Jei siųsti iš naujo nenorite — parašykite: užsakymą atšauksime ir grąžinsime už prekes ir pristatymą sumokėtą sumą, atskaičius 3,99 € siuntos grąžinimo išlaidas.' ) . '</p>';
		$h .= '<p>' . esc_html( 'Gražios dienos,' ) . '<br>' . esc_html( 'Petshop.lt komanda' ) . '<br>+370 681 87787<br>terra@petshop.lt</p>';
		return array( sprintf( 'Jūsų užsakymo Nr. %s siunta grįžo — pakartotinis siuntimas %s €', $nr, $suma ), $h );
	}

	/** Laiškas po apmokėjimo (su PVM sąskaita) — [tema, html]. */
	protected static function pakartotinis_laiskas_apmoketa( $n, $o ) {
		$nr = $o ? $o->get_order_number() : (string) $n->get_meta( self::PAKART_META ); $vardas = trim( (string) $n->get_billing_first_name() ); $suma = self::eur( $n->get_total() );
		$h  = '<p>' . esc_html( $vardas ? "Sveiki, {$vardas}." : 'Sveiki.' ) . '</p>';
		$h .= '<p>' . esc_html( sprintf( 'Ačiū — apmokėjimą už pakartotinį siuntimą (%s €) gavome. Užsakymo Nr. %s siuntą išsiųsime iš naujo tuo pačiu adresu ir atsiųsime sekimo numerį atskiru laišku.', $suma, $nr ) ) . '</p>';
		$h .= '<p>' . esc_html( 'PVM sąskaita faktūra už pakartotinį siuntimą prisegta prie šio laiško.' ) . '</p>';
		$h .= '<p>' . esc_html( 'Gražios dienos,' ) . '<br>' . esc_html( 'Petshop.lt komanda' ) . '<br>+370 681 87787<br>terra@petshop.lt</p>';
		return array( sprintf( 'Apmokėjimas gautas — užsakymo Nr. %s siuntą išsiųsime iš naujo', $nr ), $h );
	}

	/** Paysera callback → `update_status(processing)` (ne `payment_complete`) → čia (prior. 110, po variklių): pakartotinis užsakymas → `completed` be WC laiškų
	 *  (tema rašytų „išsiųstas“), temos kablys (prior. 5) išrašo AVPN, darbalaukio laiškas su PVM sąskaita; pradiniame pastaba + įvykis → „Siųsti iš naujo“. */
	public static function pakartotinis_apmoketas( $order_id ) {
		$n = is_numeric( $order_id ) ? wc_get_order( $order_id ) : $order_id; if ( ! $n || ! ( $n instanceof WC_Order ) ) { return; }
		$oid = (int) $n->get_meta( self::PAKART_META ); if ( ! $oid || ! $n->is_paid() || $n->has_status( 'completed' ) || $n->get_meta( '_ps_pakart_ivykdyta' ) ) { return; }
		$id = $n->get_id(); $o = wc_get_order( $oid );
		$n->update_meta_data( '_ps_pakart_ivykdyta', current_time( 'mysql' ) ); $n->save();
		self::d( 'laiskai_off' ); $n->update_status( 'completed', 'Darbalaukis: pakartotinis siuntimas apmokėtas — užsakymas įvykdytas automatiškai (tik pinigams; į Surinkti / lapus / Venipak neina). WC laiškas klientui: NESIŲSTAS — darbalaukio laiškas su PVM sąskaita.' ); self::d( 'laiskai_on' );
		$n = wc_get_order( $id ); $pdf = (string) $n->get_meta( '_petshop_completed_pdf' );
		if ( ( ! $pdf || ! file_exists( $pdf ) ) && function_exists( 'petshop_generate_invoice_pdf' ) ) { try { $pdf = (string) petshop_generate_invoice_pdf( $id ); if ( $pdf && file_exists( $pdf ) ) { $n->update_meta_data( '_petshop_completed_pdf', $pdf ); $n->save(); } } catch ( Throwable $e ) { $pdf = ''; } }
		$el = $n->get_billing_email(); list( $tema, $h ) = self::pakartotinis_laiskas_apmoketa( $n, $o );
		$mailer = WC()->mailer(); $ok = is_email( $el ) ? (bool) $mailer->send( $el, $tema, $mailer->wrap_message( $tema, $h ), '', ( $pdf && file_exists( $pdf ) ) ? array( $pdf ) : array() ) : false;
		$avpn = (string) $n->get_meta( '_petshop_avpn_number' );
		$n->add_order_note( 'Darbalaukis: laiškas klientui „apmokėjimas gautas“ ' . ( $ok ? 'išsiųstas' : 'NEIŠSIŲSTAS' ) . ( $pdf && file_exists( $pdf ) ? ' su PVM sąskaita ' . $avpn : ' BE sąskaitos (PDF nesugeneruotas)' ) . '.', false, true ); $n->save();
		if ( $o ) {
			$o->add_order_note( sprintf( 'Pakartotinis užsakymas #%s apmokėtas %s(%s €, %s) — galima „Siųsti iš naujo“.', $n->get_order_number(), 'bacs' === $n->get_payment_method() ? 'pavedimu ' : '', self::eur( $n->get_total() ), $avpn ? $avpn : 'sąskaita ' . ( $pdf ? 'yra' : 'nėra' ) ), false, true ); $o->save();
			if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $oid, 'sritis' => 'desk', 'veiksmas' => 'pakart_apmoketa', 'rezultatas' => 'ok', 'kanalas' => 'bacs' === $n->get_payment_method() ? 'web' : 'paysera', 'po' => array( 'naujas' => $id, 'suma' => (float) $n->get_total(), 'avpn' => $avpn, 'laiskas' => $ok ? 1 : 0 ), 'pastaba' => 'pakartotinis užsakymas #' . $n->get_order_number() . ' apmokėtas' ) ); }
		}
		do_action( 'ps_juosta_isvalyti' );
	}

	/** Apmokėjimo puslapyje (`order-pay`) pakartotiniam užsakymui — Paysera + bankinis pavedimas (v3.23, Raimis 09-05: pavedimas reikia; patvirtina darbuotojas „Apmokėta pavedimu“). */
	public static function pakartotinis_vartai( $gws ) {
		if ( is_admin() || ! function_exists( 'is_wc_endpoint_url' ) || ! is_wc_endpoint_url( 'order-pay' ) ) { return $gws; }
		global $wp; $oid = absint( $wp->query_vars['order-pay'] ?? 0 ); $o = $oid ? wc_get_order( $oid ) : null;
		if ( ! $o || ! $o->get_meta( self::PAKART_META ) ) { return $gws; }
		$r = array(); foreach ( array( 'paysera', 'bacs' ) as $k ) { if ( isset( $gws[ $k ] ) ) { $r[ $k ] = $gws[ $k ]; } }
		return $r ? $r : $gws;
	}

	/** v3.24: pakartotinis užsakymas `on-hold` (klientas pasirinko pavedimą) lieka apmokamas per nuorodą — Paysera vis dar galima. */
	public static function pakartotinis_moketini_statusai( $statusai, $order = null ) {
		if ( $order instanceof WC_Order && $order->get_meta( self::PAKART_META ) && ! in_array( 'on-hold', (array) $statusai, true ) ) { $statusai[] = 'on-hold'; }
		return $statusai;
	}

	/** v3.23: klientui pasirinkus pavedimą („ačiū“ puslapis, WC bacs `thankyou_page` — WC bacs sąskaitų nustatymuose nėra) — rekvizitai ir paskirtis. */
	public static function pakartotinis_aciu_bankas( $order_id ) {
		$n = wc_get_order( $order_id ); if ( ! $n || ! $n->get_meta( self::PAKART_META ) || $n->is_paid() ) { return; }
		$o = wc_get_order( (int) $n->get_meta( self::PAKART_META ) ); $nr = $o ? $o->get_order_number() : (string) $n->get_meta( self::PAKART_META );
		echo '<section class="woocommerce-bacs-bank-details"><h2 class="wc-bacs-bank-details-heading">Pavedimo rekvizitai</h2><p>' . esc_html( 'Gavėjas: ' . self::PAKART_BANKAS . ' · Suma: ' . self::eur( $n->get_total() ) . ' € · Paskirtis: „Pakartotinis siuntimas, užsakymas Nr. ' . $nr . '“.' ) . '</p><p>' . esc_html( 'Gavę pavedimą, siuntą išsiųsime iš naujo ir atsiųsime sekimo numerį.' ) . '</p></section>';
	}

	/** v3.23: „Apmokėta pavedimu“ (GET `pakart_apmoketa`) — darbuotojas patvirtina, kad pinigai banke: `payment_method=bacs` + `update_status(processing)` (kaip Paysera callback) → `pakartotinis_apmoketas`. */
	protected static function pakartotinis_pavedimas( $o, $u ) {
		$pk = self::pakartotinis_bukle( $o ); if ( ! $pk || 'laukia' !== $pk['b'] ) { return array( 'dl_info', $pk && 'apmoketa' === $pk['b'] ? 'pakartotinis užsakymas #' . $pk['nr'] . ' jau apmokėtas — spausk „Siųsti iš naujo“' : 'neapmokėto pakartotinio užsakymo nėra' ); }
		$n = wc_get_order( $pk['id'] ); if ( ! $n ) { return array( 'dl_klaida', 'užsakymo nėra' ); }
		if ( 'bacs' !== $n->get_payment_method() ) { $n->set_payment_method( 'bacs' ); $n->set_payment_method_title( 'Bankinis pavedimas' ); }
		$n->add_order_note( 'Darbalaukis: pavedimas gautas — patvirtino ' . $u->display_name . ' („Apmokėta pavedimu“).', false, true ); $n->save();
		$n->update_status( 'processing', 'Darbalaukis: pavedimas gautas (' . $u->display_name . ').', true );
		$n = wc_get_order( $n->get_id() ); $ok = (bool) $n->get_meta( '_ps_pakart_ivykdyta' );
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'pakart_pavedimas', 'rezultatas' => $ok ? 'ok' : 'klaida', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'naujas' => $n->get_id(), 'suma' => (float) $n->get_total(), 'avpn' => (string) $n->get_meta( '_petshop_avpn_number' ) ), 'pastaba' => 'pavedimas už pakartotinį užsakymą #' . $n->get_order_number() ) ); }
		return array( $ok ? 'dl_info' : 'dl_klaida', $ok ? 'pakartotinis užsakymas #' . $n->get_order_number() . ' (' . self::eur( $n->get_total() ) . ' €) pažymėtas apmokėtu pavedimu' . ( $n->get_meta( '_petshop_avpn_number' ) ? ', PVM sąskaita ' . $n->get_meta( '_petshop_avpn_number' ) : '' ) . ' — dabar „Siųsti iš naujo“' : 'užsakymas #' . $n->get_order_number() . ' nepersijungė (būsena ' . $n->get_status() . ') — žiūrėk pastabas' );
	}

	/** Svečio užsakymo „ačiū“ puslapis (grįžus iš Paysera) — be WC el. pašto patvirtinimo formos (užsakymas sukurtas anksčiau nei WC „malonės“ langas). */
	public static function pakartotinis_be_patvirtinimo( $reikia, $order = null, $context = '' ) {
		if ( $reikia && $order instanceof WC_Order && $order->get_meta( self::PAKART_META ) ) { return false; }
		return $reikia;
	}

	/** v3.22: pakartotiniam užsakymui — jokių WC laiškų (klientui „vykdomas“/„įvykdytas“/„laukiama“, administratoriui „naujas užsakymas“): vienintelis laiškas —
	 *  darbalaukio „apmokėjimas gautas“ su PVM sąskaita (`pakartotinis_apmoketas`); administratoriui — pradinio užsakymo kortelė / pastaba (Claude prielaida). */
	public static function pakartotinis_wc_laiskai( $enabled, $object = null ) {
		if ( $enabled && $object instanceof WC_Order && $object->get_meta( self::PAKART_META ) ) { return false; }
		return $enabled;
	}

	/** „Siųsti iš naujo“ — TIK grįžusią dalį (log S1611 spr. 5 + Raimis 09-04 vakaras: grįžusi tiekėjo dalis VISADA → AV, standartinė procedūra).
	 *  AV dalis grįžta: numeriai → senos, žymė nuimama, Surinkti AV → naujas lipdukas. Tiekėjo dalis grįžta: eilutės → kelias „Iš AV“ (likutis +q −q = 0,
	 *  `_ps_av_reduced_qty=q`), AV numeriai → senos; jei AV siunta JAU IŠSIŲSTA — jos eilutės gauna `_ps_issiusta` (laikas|nr) ir siunta įrašoma į
	 *  `_ps_dalys_baigtos.av` (klientui lieka išsiųsta/pristatyta), AV dalis ruošiama iš naujo tik iš grįžusių prekių; užsakymas išskiriamas („nepakuok“).
	 *  Kitos dalys lieka kaip yra. Įvykdytas → processing be laiškų. */
	protected static function grizta_is_naujo( $o, $u ) {
		$g = self::grizta( $o ); if ( ! $g ) { return array( 'dl_info', 'grįžtančios siuntos nėra' ); }
		if ( ! $o->is_paid() ) { return array( 'dl_klaida', 'užsakymas neapmokėtas' ); }
		if ( in_array( $o->get_status(), Petshop_Desk::STATUSAI['atsaukti'], true ) ) { return array( 'dl_klaida', 'užsakymas atšauktas' ); }
		// v3.21 (Raimis 09-05 c): siųsti iš naujo tik apmokėjus pakartotinį užsakymą arba pažymėjus „Be mokesčio“ (mūsų / vežėjo kaltė).
		$pk = self::pakartotinis_bukle( $o );
		if ( ! $pk || ! in_array( $pk['b'], array( 'apmoketa', 'nemokamai' ), true ) ) { return array( 'dl_klaida', $pk && 'laukia' === $pk['b'] ? 'pakartotinis užsakymas #' . $pk['nr'] . ' dar neapmokėtas — siųsti tik apmokėjus' : 'pirma „Pakartotinis užsakymas“ (apmokėjimo nuoroda klientui) arba „Be mokesčio“' ); }
		$f = self::faktai( $o, self::zurnalas( array( $o->get_id() ) ) );
		$iss = $f['dalys_issiusta']; $senos = $f['senos']; $baigtos = $f['dalys_baigtos']; $judesiai = array(); $perkelta = array(); $nrai = array(); $kaip = array(); $dabar = current_time( 'mysql' ); $nepakuok = array();
		$av = $f['dalys']['av'] ?? null; $av_issiusta = $av && ! empty( $av['issiusta'] ) && ! isset( $g['av'] );
		foreach ( $g as $dalis => $x ) {
			if ( empty( $f['dalys'][ $dalis ] ) ) { unset( $g[ $dalis ] ); continue; } // dalis atšaukta / nebėra — Klausimas nuimamas
			$nrai[] = $x['nr'];
			$senos = array_merge( $senos, (array) ( $f['dalys'][ $dalis ]['nr'] ?? array() ) );
			if ( 'av' === $dalis ) { $kaip[] = 'AV dalis: Surinkti AV → naujas lipdukas'; unset( $iss['av'] ); $o->delete_meta_data( '_ps_surinkta' ); unset( $g[ $dalis ] ); continue; }
			// Tiekėjo dalis → AV (v3.11.1 logika; v3.18 — visada).
			if ( $av_issiusta ) {
				// AV siunta jau išsiųsta: jos eilutės pažymimos, siunta į „baigtas“ — AV dalis ruošiama iš naujo tik iš grįžusių prekių.
				$sena_nr = (array) ( $av['nr'] ?? array() ); $sena_laikas = (string) ( $iss['av']['laikas'] ?? $dabar ); $prekes_b = array();
				foreach ( $o->get_items() as $iid => $it ) { $e = $f['eil'][ (int) $iid ] ?? null; if ( ! $e || ! empty( $e['atsaukta'] ) || ! empty( $e['issiusta_l'] ) || ( 'av' !== $e['k'] && 'i_av' !== $e['k'] ) ) { continue; }
					$it->update_meta_data( '_ps_issiusta', $sena_laikas . '|' . implode( ',', $sena_nr ) ); $it->save(); $prekes_b[] = array( (int) $it->get_quantity(), $it->get_name() ); $nepakuok[] = $it->get_quantity() . '× ' . $it->get_name(); }
				$baigtos['av'][] = array( 'nr' => $sena_nr, 'laikas' => $sena_laikas, 'prekes' => $prekes_b ); $av_issiusta = false;
				$kaip[] = 'AV siunta ' . implode( ', ', $sena_nr ) . ' jau išsiųsta — lieka klientui kaip išsiųsta; jos prekės pažymėtos „IŠSIŲSTA — NEPAKUOK“';
			}
			$senos = array_merge( $senos, (array) ( $av['nr'] ?? array() ) );
			foreach ( $o->get_items() as $iid => $it ) {
				$e = $f['eil'][ (int) $iid ] ?? null; if ( ! $e || ! empty( $e['atsaukta'] ) || 'tiesiai' !== $e['k'] || $e['src'] !== $dalis ) { continue; }
				$pid = (int) $it->get_product_id(); $q = max( 1, (int) $it->get_quantity() ); $liko = '';
				if ( $pid && class_exists( 'Petshop_AV_Stock' ) ) {
					$a = Petshop_AV_Stock::increase( $pid, $q, 'siunta ' . $x['nr'] . ' grįžo į AV, užsakymas #' . $o->get_order_number() );
					$b = is_wp_error( $a ) ? $a : Petshop_AV_Stock::decrease( $pid, $q, 'siunčiama iš AV iš naujo, užsakymas #' . $o->get_order_number() );
					$liko = is_wp_error( $b ) ? 'likučio klaida: ' . $b->get_error_message() : '+' . $q . ' −' . $q . ' → ' . (int) $b;
				}
				$it->update_meta_data( '_ps_kelias', 'av' ); $it->update_meta_data( '_ps_source', 'av' ); $it->update_meta_data( '_ps_carrier', 'any' );
				$it->update_meta_data( '_ps_source_at', $dabar ); $it->update_meta_data( '_ps_source_reason', 'darbalaukis: ' . $u->display_name . ' — siunta ' . $x['nr'] . ' grįžo, siunčiama iš AV iš naujo' );
				$it->update_meta_data( '_ps_av_reduced_qty', $q ); $it->delete_meta_data( '_ps_konsolidacija' ); $it->save();
				$perkelta[] = $it->get_name(); $judesiai[] = mb_substr( $it->get_name(), 0, 40 ) . ': AV ' . $liko;
			}
			if ( ! $o->get_meta( '_ps_av_reduced' ) ) { $o->update_meta_data( '_ps_av_reduced', $dabar ); }
			$o->delete_meta_data( '_ps_av_restored' ); $o->delete_meta_data( '_ps_surinkta' );
			unset( $iss[ $dalis ], $iss['av'] ); $kaip[] = self::vardas( $dalis ) . ' dalis → AV: Surinkti AV → naujas lipdukas';
			unset( $g[ $dalis ] );
		}
		if ( ! $nrai ) { $o->delete_meta_data( self::GRIZTA_META ); $o->save(); return array( 'dl_info', 'grįžusi dalis jau atšaukta — Klausimas nuimtas' ); }
		$o->update_meta_data( '_ps_dalys_issiusta', wp_json_encode( $iss ) );
		$o->update_meta_data( self::SENOS_META, wp_json_encode( array_values( array_unique( array_filter( array_map( 'strval', $senos ) ) ) ) ) );
		if ( $baigtos ) { $o->update_meta_data( self::BAIGTOS_META, wp_json_encode( $baigtos ) ); }
		if ( $g ) { $o->update_meta_data( self::GRIZTA_META, wp_json_encode( $g ) ); } else { $o->delete_meta_data( self::GRIZTA_META ); }
		$o->delete_meta_data( '_ps_klaus_laukti' ); $o->delete_meta_data( '_ps_uzbaigti_be_siuntu' );
		self::pakartotinis_panaudotas( $o, $pk ); // v3.21: žymė sunaudota — kitam grįžimui reikės naujo pakartotinio užsakymo
		if ( $perkelta ) { self::planas_is_eiluciu( $o ); self::perskaiciuoti_grupes( $o ); }
		$o->save();
		$buvo = $o->get_status();
		if ( in_array( $buvo, array_merge( Petshop_Desk::STATUSAI['ivykdyti'], Petshop_Desk::STATUSAI['kelyje'] ), true ) ) {
			self::d( 'laiskai_off' ); $o->update_status( 'processing', 'Darbalaukis: siunta grįžo — siunčiama iš naujo iš AV. WC laiškas klientui: NESIŲSTAS.' ); self::d( 'laiskai_on' );
		}
		$o = wc_get_order( $o->get_id() );
		$o->add_order_note( sprintf( 'Darbalaukis: siunta %s grįžo — SIUNČIAMA IŠ NAUJO iš AV (%s). %s. %s%s%sSeni numeriai nebeskaitomi: %s.', implode( ', ', $nrai ), $u->display_name, implode( '; ', $kaip ), $perkelta ? 'Į AV perkelta: ' . implode( ', ', $perkelta ) . '. ' : '', $judesiai ? 'Likutis: ' . implode( '; ', $judesiai ) . '. ' : '', $nepakuok ? '⚠ SURINKIMO LAPE BUS IR JAU IŠSIŲSTOS PREKĖS — NEPAKUOK: ' . implode( '; ', $nepakuok ) . '. ' : '', implode( ', ', array_unique( array_filter( array_map( 'strval', $senos ) ) ) ) ), false, true ); $o->save();
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'grizta_is_naujo', 'rezultatas' => 'ok', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'pries' => array( 'status' => $buvo, 'nr' => $nrai ), 'po' => array( 'status' => $o->get_status(), 'kaip' => $kaip, 'perkelta' => $perkelta, 'senos' => $senos, 'nepakuok' => $nepakuok, 'zinute' => $judesiai ? implode( '; ', $judesiai ) : 'likutis nejudėjo' ), 'pastaba' => 'siunta grįžo → iš naujo iš AV' ) ); }
		do_action( 'ps_juosta_isvalyti' );
		return array( 'dl_dalis', 'siunta ' . implode( ', ', $nrai ) . ' grįžo — ' . implode( '; ', $kaip ) . ( $judesiai ? ' · likutis ' . implode( '; ', $judesiai ) : '' ) . ( $nepakuok ? ' · ⚠ LAPE BUS IR JAU IŠSIŲSTOS PREKĖS — NEPAKUOK: ' . implode( '; ', $nepakuok ) : '' ) );
	}

	/** „Atšaukti — prekės grįžo į AV“ (log S1611 spr. 5) / „Atšaukti tik grįžusią dalį“ (Raimis 09-04 dalinis). Kai kitų aktyvių dalių nėra — visas užsakymas
	 *  → cancelled (AV grąžina variklis, dropship +q). Kai yra — tik grįžusi dalis: eilutės `_ps_atsaukta`, likutis (dropship +q `_own_stock_qty`; AV — variklio
	 *  `grazinti` veidrodis eilutės lygiu, `_ps_av_reduced_qty` → 0), `_ps_dalys_atsaukta[dalis]`, statusas lieka (processing → completed, jei kitos dalys išsiųstos).
	 *  Be laiškų, be sumų — WC dalinis grąžinimas ir pinigai rankomis. */
	protected static function grizta_atsaukti( $o, $u ) {
		$g = self::grizta( $o ); if ( ! $g ) { return array( 'dl_info', 'grįžtančios siuntos nėra' ); }
		if ( in_array( $o->get_status(), Petshop_Desk::STATUSAI['atsaukti'], true ) ) { return array( 'dl_info', 'jau atšauktas' ); }
		$f = self::faktai( $o, self::zurnalas( array( $o->get_id() ) ) );
		$kitos = array(); foreach ( $f['dalys'] as $dk => $dp ) { if ( $dp && ! isset( $g[ $dk ] ) ) { $kitos[ $dk ] = $dp; } }
		$judesiai = array(); $nrai = array(); $dabar = current_time( 'mysql' ); $buvo = $o->get_status();
		$pk_ats = self::pakartotinis_atsaukti_nauja( $o, 'grįžusi siunta atšaukta — pakartotinis siuntimas nebereikalingas' ); // v3.21: neapmokėtas pakartotinis užsakymas atšaukiamas (be laiškų)
		if ( $pk_ats ) { $o->delete_meta_data( self::PAKART_ID_META ); }
		$sm = self::grizta_sumos( $f ); $graz_t = $sm ? 'Grąžink klientui ' . self::eur( $sm['grazinti'] ) . ' € rankomis (' . self::eur( $sm['sumoketa'] ) . ' − 3,99; Klausimas primins).' : 'Pinigai grąžinami rankomis.'; // v3.20
		if ( ! $kitos ) {
			// Visas užsakymas (v3.11.1): dropship +q, AV — variklis ant cancelled.
			foreach ( $g as $dalis => $x ) {
				$nrai[] = $x['nr']; if ( 'av' === $dalis ) { continue; }
				foreach ( $o->get_items() as $iid => $it ) {
					$e = $f['eil'][ (int) $iid ] ?? null; if ( ! $e || ! empty( $e['atsaukta'] ) || ! empty( $e['issiusta_l'] ) || 'tiesiai' !== $e['k'] || $e['src'] !== $dalis ) { continue; }
					$pid = (int) $it->get_product_id(); $q = max( 1, (int) $it->get_quantity() ); if ( ! $pid || ! class_exists( 'Petshop_AV_Stock' ) ) { continue; }
					$a = Petshop_AV_Stock::increase( $pid, $q, 'siunta ' . $x['nr'] . ' grįžo į AV, užsakymas #' . $o->get_order_number() . ' atšauktas' );
					$judesiai[] = mb_substr( $it->get_name(), 0, 40 ) . ': AV +' . $q . ( is_wp_error( $a ) ? ' KLAIDA ' . $a->get_error_message() : ' → ' . (int) $a );
				}
			}
			$o->delete_meta_data( self::GRIZTA_META ); $o->delete_meta_data( '_ps_klaus_laukti' );
			if ( $sm ) { self::grazinti_zyme( $o, $u, $sm['grazinti'], 'siunta ' . implode( ', ', $nrai ) . ' grįžo → atšaukta: ' . self::eur( $sm['sumoketa'] ) . ' − 3,99' ); } // v3.20
			$o->add_order_note( sprintf( 'Darbalaukis: siunta %s grįžo — ATŠAUKIAMA, prekės grįžo į AV (%s). %s%s WC laiškas klientui: NESIŲSTAS.', implode( ', ', $nrai ), $u->display_name, $judesiai ? 'Likutis: ' . implode( '; ', $judesiai ) . '. ' : '', $graz_t ), false, true ); $o->save();
			self::d( 'laiskai_off' ); $o->update_status( 'cancelled', '' ); self::d( 'laiskai_on' );
			$o = wc_get_order( $o->get_id() );
			if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'grizta_atsaukti', 'rezultatas' => 'cancelled' === $o->get_status() ? 'ok' : 'klaida', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'pries' => array( 'status' => $buvo, 'nr' => $nrai ), 'po' => array( 'status' => $o->get_status(), 'zinute' => $judesiai ? implode( '; ', $judesiai ) : 'dropship eilučių nėra — AV grąžina variklis' ), 'pastaba' => 'siunta grįžo → atšaukta' ) ); }
			do_action( 'ps_juosta_isvalyti' );
			if ( 'cancelled' !== $o->get_status() ) { return array( 'dl_klaida', 'atšaukti nepavyko — statusas ' . $o->get_status() ); }
			return array( 'dl_dalis', 'atšauktas — siunta ' . implode( ', ', $nrai ) . ' grįžo į AV' . ( $judesiai ? ' · likutis ' . implode( '; ', $judesiai ) : '' ) . ' · ' . ( $sm ? 'grąžink klientui ' . self::eur( $sm['grazinti'] ) . ' € rankomis (Klausimai)' : 'pinigus grąžink rankomis' ) );
		}
		// Dalinis (v3.17): tik grįžusios dalys; kitos lieka kaip yra.
		$ats = $f['dalys_atsaukta']; $iss = $f['dalys_issiusta']; $atsauktos = array(); $prekes = array();
		foreach ( $g as $dalis => $x ) {
			if ( empty( $f['dalys'][ $dalis ] ) ) { unset( $g[ $dalis ] ); continue; }
			$nrai[] = $x['nr']; $nr_d = (array) ( $f['dalys'][ $dalis ]['nr'] ?? array() );
			foreach ( $o->get_items() as $iid => $it ) {
				$e = $f['eil'][ (int) $iid ] ?? null; if ( ! $e || ! empty( $e['atsaukta'] ) || ! empty( $e['issiusta_l'] ) ) { continue; }
				$ed = ( 'tiesiai' === $e['k'] && $e['src'] ) ? $e['src'] : 'av'; if ( $ed !== $dalis ) { continue; }
				$pid = (int) $it->get_product_id(); $q = max( 1, (int) $it->get_quantity() ); $rq = (int) $it->get_meta( '_ps_av_reduced_qty' ); $l = '';
				if ( 'av' === $dalis ) {
					// Variklio `grazinti` veidrodis eilutės lygiu: tik jei buvo nurašyta (`_ps_av_reduced_qty` > 0) ir užsakymas dar negrąžintas.
					if ( $rq > 0 && ! $o->get_meta( '_ps_av_restored' ) ) { $r = self::likutis( $pid, $rq, 'siunta ' . $x['nr'] . ' grįžo į AV, dalis atšaukta, užsakymas #' . $o->get_order_number() ); $l = is_wp_error( $r ) ? 'KLAIDA ' . $r->get_error_message() : '+' . $rq . ' → ' . (int) $r; $it->update_meta_data( '_ps_av_reduced_qty', 0 ); }
					else { $l = 'nejudėjo (nebuvo nurašyta)'; }
				} elseif ( $pid && class_exists( 'Petshop_AV_Stock' ) ) {
					$a = Petshop_AV_Stock::increase( $pid, $q, 'siunta ' . $x['nr'] . ' grįžo į AV, ' . self::vardas( $dalis ) . ' dalis atšaukta, užsakymas #' . $o->get_order_number() );
					$l = is_wp_error( $a ) ? 'KLAIDA ' . $a->get_error_message() : '+' . $q . ' → ' . (int) $a;
					if ( $rq > 0 ) { $it->update_meta_data( '_ps_av_reduced_qty', 0 ); } // kad pilnas atšaukimas negrąžintų dukart
				}
				$it->update_meta_data( '_ps_atsaukta', $dabar . '|' . $u->display_name . '|' . implode( ',', $nr_d ) . '|' . $rq ); $it->save();
				$judesiai[] = mb_substr( $it->get_name(), 0, 40 ) . ': AV ' . $l; $prekes[] = $q . '× ' . $it->get_name();
			}
			$ats[ $dalis ] = array( 'laikas' => $dabar, 'kas' => $u->display_name, 'nr' => $nr_d ); $atsauktos[] = self::vardas( $dalis ); unset( $g[ $dalis ] );
		}
		if ( ! $atsauktos ) { $o->delete_meta_data( self::GRIZTA_META ); $o->save(); return array( 'dl_info', 'grįžusi dalis jau atšaukta — Klausimas nuimtas' ); }
		$o->update_meta_data( self::ATSAUKTA_META, wp_json_encode( $ats ) );
		if ( $g ) { $o->update_meta_data( self::GRIZTA_META, wp_json_encode( $g ) ); } else { $o->delete_meta_data( self::GRIZTA_META ); }
		$o->delete_meta_data( '_ps_klaus_laukti' );
		if ( $sm ) { self::grazinti_zyme( $o, $u, $sm['grazinti'], implode( ', ', $atsauktos ) . ' dalis grįžo → atšaukta: ' . self::eur( $sm['sumoketa'] ) . ' − 3,99' ); } // v3.20
		$kitos_v = array(); $visos_iss = true; foreach ( $kitos as $dk => $dp ) { $kitos_v[] = self::vardas( $dk ) . ( ! empty( $dp['issiusta'] ) ? ' (išsiųsta)' : ' (dar ruošiama)' ); if ( empty( $dp['issiusta'] ) ) { $visos_iss = false; } }
		$o->add_order_note( sprintf( 'Darbalaukis: %s dalis ATŠAUKTA — siunta %s grįžo į AV (%s). Prekės: %s. %sKita dalis lieka: %s. %s Klientui laiškas: NESIŲSTAS.', implode( ', ', $atsauktos ), implode( ', ', $nrai ), $u->display_name, implode( ', ', $prekes ), $judesiai ? 'Likutis: ' . implode( '; ', $judesiai ) . '. ' : '', implode( ', ', $kitos_v ), $graz_t ), false, true ); $o->save();
		if ( 'processing' === $buvo && $visos_iss ) { self::d( 'laiskai_off' ); $o->update_status( 'completed', 'Darbalaukis: likusios dalys išsiųstos, grįžusi dalis atšaukta — įvykdytas. WC laiškas klientui: NESIŲSTAS.' ); self::d( 'laiskai_on' ); }
		$o = wc_get_order( $o->get_id() );
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'grizta_atsaukti_dalis', 'rezultatas' => 'ok', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'pries' => array( 'status' => $buvo, 'nr' => $nrai ), 'po' => array( 'status' => $o->get_status(), 'atsaukta' => $atsauktos, 'kitos' => $kitos_v, 'zinute' => $judesiai ? implode( '; ', $judesiai ) : 'likutis nejudėjo' ), 'pastaba' => 'siunta grįžo → dalis atšaukta, kita lieka' ) ); }
		do_action( 'ps_juosta_isvalyti' );
		return array( 'dl_dalis', implode( ', ', $atsauktos ) . ' dalis atšaukta — siunta ' . implode( ', ', $nrai ) . ' grįžo į AV' . ( $judesiai ? ' · likutis ' . implode( '; ', $judesiai ) : '' ) . ' · kita dalis lieka: ' . implode( ', ', $kitos_v ) . ' · ' . ( $sm ? 'grąžink klientui ' . self::eur( $sm['grazinti'] ) . ' € rankomis (Klausimai)' : 'pinigus už atšauktą dalį grąžink rankomis' ) );
	}

	/** #5b (Raimis 09-03 naktis): SIUNTOS KLIENTUI — vienas tiesos šaltinis laiškui, paskyros blokui („Siuntos“, `petshop-kliento-siuntos.php`)
	 *  ir 4 etapo Venipak cron'ui. Dalys kaip `faktai()` (AV + kiekvienas „tiesiai“ tiekėjas); išsiųstos pirma pagal laiką (kaip laiško „Išsiųsta
	 *  n iš N“), neišsiųstos po jų. Kiekviena: [n, viso, dalis, busena ruosiama|issiusta, laikas, vez venipak|lp, numeriai[], url, prekes[[q,n]]].
	 *  Tiekėjų vardų klientui NĖRA (tik `dalis` raktas vidiniam naudojimui). Neapmokėtam / atšauktam — tuščia (blokas nerodomas). */
	public static function kliento_siuntos( $o ) {
		if ( ! $o instanceof WC_Order || ! class_exists( 'Petshop_Desk' ) ) { return array(); }
		if ( in_array( $o->get_status(), array_merge( Petshop_Desk::STATUSAI['neapmoketi'], Petshop_Desk::STATUSAI['atsaukti'], array( 'checkout-draft', 'draft' ) ), true ) ) { return array(); }
		$f = self::faktai( $o ); $iss = $f['dalys_issiusta']; $out = array();
		$dalys = array_filter( $f['dalys'] ); $kazkas_issiusta = false; foreach ( $dalys as $p ) { if ( ! empty( $p['issiusta'] ) ) { $kazkas_issiusta = true; } }
		// v3.10.5 (Raimis 09-04, B): nesurūšiuotas mišrus — klientui viena „Siunta — Ruošiama“ su visomis prekėmis; skaičius atsiranda po rūšiavimo.
		if ( ! $f['rus'] && count( $dalys ) > 1 && ! $kazkas_issiusta ) {
			$prekes = array(); foreach ( $f['eil'] as $e ) { $prekes[] = array( 'q' => (int) $e['q'], 'n' => (string) $e['n'] ); }
			return array( array( 'n' => 1, 'viso' => 1, 'dalis' => '*', 'busena' => 'ruosiama', 'laikas' => '', 'pristatyta' => '', 'vez' => 'lp' === $f['vez'] ? 'lp' : 'venipak', 'numeriai' => array(), 'url' => '', 'prekes' => $prekes ) );
		}
		foreach ( $f['dalys'] as $k => $p ) {
			if ( ! $p ) { continue; }
			$prekes = array();
			foreach ( $f['eil'] as $e ) { if ( ! empty( $e['atsaukta'] ) || ! empty( $e['issiusta_l'] ) ) { continue; } $ed = ( 'tiesiai' === $e['k'] && $e['src'] ) ? $e['src'] : 'av'; if ( $ed === $k ) { $prekes[] = array( 'q' => (int) $e['q'], 'n' => (string) $e['n'] ); } }
			$vez = ( 'av' === $k && 'lp' === $f['vez'] ) ? 'lp' : 'venipak';
			$nrs = array_values( array_unique( array_filter( array_map( 'trim', (array) ( $p['nr'] ?? array() ) ) ) ) );
			$issiusta = ! empty( $p['issiusta'] );
			// v3.11: „Pristatyta“ — kai išsiųsta ir VISI dalies numeriai pristatyti (kodas 9; v3.12 — ir LP Express); laikas — vėliausias pristatymo įvykis.
			$prist = ''; if ( $issiusta && $nrs ) { $prist = self::pristatyta_kada( $f['sek'], $nrs ); }
			$out[] = array( 'dalis' => $k, 'busena' => $prist ? 'pristatyta' : ( $issiusta ? 'issiusta' : 'ruosiama' ), 'laikas' => $issiusta ? (string) ( $iss[ $k ]['laikas'] ?? '' ) : '', 'pristatyta' => $prist, 'vez' => $vez, 'numeriai' => $nrs, 'url' => $nrs ? self::sekimo_url( $vez, $nrs[0] ) : '', 'prekes' => $prekes );
		}
		// v3.18: ankstesnės išsiųstos AV siuntos (AV dalis ruošiama iš naujo po grįžimo) — lieka klientui kaip išsiųstos/pristatytos.
		foreach ( $f['dalys_baigtos'] as $k => $sar ) { foreach ( (array) $sar as $b_ ) { $nrs = array_values( array_filter( array_map( 'strval', (array) ( $b_['nr'] ?? array() ) ) ) ); $vez = ( 'av' === $k && 'lp' === $f['vez'] ) ? 'lp' : 'venipak'; $prist = $nrs ? self::pristatyta_kada( $f['sek'], $nrs ) : ''; $pr = array(); foreach ( (array) ( $b_['prekes'] ?? array() ) as $x ) { $pr[] = array( 'q' => (int) ( $x[0] ?? 1 ), 'n' => (string) ( $x[1] ?? '' ) ); }
			$out[] = array( 'dalis' => $k, 'busena' => $prist ? 'pristatyta' : 'issiusta', 'laikas' => (string) ( $b_['laikas'] ?? '' ), 'pristatyta' => $prist, 'vez' => $vez, 'numeriai' => $nrs, 'url' => $nrs ? self::sekimo_url( $vez, $nrs[0] ) : '', 'prekes' => $pr ); } }
		usort( $out, function ( $a, $b ) { $ia = 'ruosiama' !== $a['busena']; $ib = 'ruosiama' !== $b['busena']; if ( $ia !== $ib ) { return $ia ? -1 : 1; } return strcmp( $a['laikas'], $b['laikas'] ); } );
		$viso = count( $out );
		foreach ( $out as $i => $s ) { $out[ $i ]['n'] = $i + 1; $out[ $i ]['viso'] = $viso; }
		// v3.18: atšauktos dalys klientui NERODOMOS (Raimis 09-04).
		return $out;
	}

	/** #5 (spec §12, Raimis 09-03 vakaras): laiškas klientui PO KIEKVIENOS siuntos — „Išsiųsta 1 iš 2 siuntų“ / „2 iš 2“, vienai — „Užsakymas
	 *  išsiųstas“. Ta pati funkcija 4 etapo cron'ui (Venipak „Picked up“). $f — `faktai()`, $iss — jau atnaujintas `_ps_dalys_issiusta`
	 *  (ši dalis įskaityta). Rašo `_ps_dalys_issiusta[dalis].laiskas` (dublio sargas) ir `_ps_sekimo_siusta`. Grąžina [ok, tekstas darbuotojui].
	 *  v3.10.3 (#5b): juostelės NĖRA (statinė klaidina — Raimis); po „Sekti siuntą“ — sakinys apie sekimą, registruotam klientui — nuoroda į paskyros užsakymą. */
	public static function siuntos_laiskas( $o, $f, $dalis, $iss ) {
		$el = $o->get_billing_email();
		if ( ! $el ) { return array( false, 'klientui nepranešta — el. pašto nėra' ); }
		if ( $dalis && ! empty( $iss[ $dalis ]['laiskas'] ) ) { return array( false, 'klientui jau pranešta apie šią siuntą (' . $iss[ $dalis ]['laiskas'] . ')' ); }
		$dalys = array(); foreach ( $f['dalys'] as $k => $p ) { if ( $p ) { $dalys[ $k ] = $p; } }
		$viso = count( $dalys ); $n = 0; foreach ( $dalys as $k => $p ) { if ( ! empty( $iss[ $k ] ) ) { $n++; } }
		if ( ! $dalis ) { $n = $viso; }
		$baig = 0; foreach ( $f['dalys_baigtos'] as $sar ) { $baig += count( (array) $sar ); } $viso += $baig; $n += $baig; // v3.18: ankstesnės AV siuntos
		$vardas_l = $viso > 1 ? sprintf( 'Išsiųsta %d iš %d siuntų', $n, $viso ) : 'Užsakymas išsiųstas';
		$nr_uzs = $o->get_order_number(); $bazine = get_option( 'woocommerce_email_base_color', '#2d6a35' );
		// Šios siuntos prekės / dar keliaus.
		$sios = array(); $kitos = array(); $nrs = array(); $vez = 'venipak';
		foreach ( $f['eil'] as $e ) {
			if ( ! empty( $e['atsaukta'] ) || ! empty( $e['issiusta_l'] ) ) { continue; } // v3.17 / v3.18
			$e_dalis = ( 'tiesiai' === $e['k'] && $e['src'] ) ? $e['src'] : 'av';
			if ( ! $dalis || $e_dalis === $dalis ) { $sios[] = $e; } elseif ( empty( $iss[ $e_dalis ] ) ) { $kitos[] = $e; }
		}
		if ( $dalis ) { $nrs = (array) ( $dalys[ $dalis ]['nr'] ?? array() ); if ( 'av' === $dalis && 'lp' === $f['vez'] ) { $vez = 'lp'; } }
		else { foreach ( $dalys as $p ) { $nrs = array_merge( $nrs, (array) ( $p['nr'] ?? array() ) ); } if ( 'lp' === $f['vez'] ) { $vez = 'lp'; } }
		$nrs = array_values( array_unique( array_filter( array_map( 'trim', $nrs ) ) ) );
		$vardas = trim( (string) $o->get_billing_first_name() );
		$h  = '<p>' . esc_html( $vardas ? "Sveiki, {$vardas}," : 'Sveiki,' ) . '</p>';
		if ( $viso <= 1 || ! $dalis ) { $h .= '<p>' . sprintf( esc_html( 'Jūsų užsakymas Nr. %s išsiųstas.' ), esc_html( $nr_uzs ) ) . '</p>'; }
		elseif ( $n < $viso ) { $h .= '<p>' . sprintf( esc_html( 'Išsiųsta %d iš %d Jūsų užsakymo Nr. %s siuntų. %s keliaus atskirai — pranešime, kai išsiųsime.' ), $n, $viso, esc_html( $nr_uzs ), 2 === $viso ? 'Antroji siunta' : 'Kitos siuntos' ) . '</p>'; }
		else { $h .= '<p>' . sprintf( esc_html( 'Išsiųsta %d iš %d Jūsų užsakymo Nr. %s siuntų — visas užsakymas išsiųstas.' ), $n, $viso, esc_html( $nr_uzs ) ) . '</p>'; }
		// v3.10.3: sekimo juostelės laiške NĖRA (Raimis 09-03 naktis: statinė — klaidina); eiga — paskyroje (blokas „Siuntos“).
		// Siunta: numeris + „Sekti siuntą“.
		$vez_v = 'lp' === $vez ? 'LP Express' : 'Venipak';
		$h .= '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;border:1px solid #e2e2e2;border-radius:6px"><tr><td style="padding:14px 16px">';
		if ( $nrs ) {
			$h .= '<p style="margin:0 0 4px;font-size:13px;color:#666">' . esc_html( count( $nrs ) > 1 ? 'Siuntų numeriai (' . $vez_v . ')' : 'Siuntos numeris (' . $vez_v . ')' ) . '</p>';
			$h .= '<p style="margin:0 0 12px;font-size:17px;font-weight:700;letter-spacing:.5px">' . esc_html( implode( ', ', $nrs ) ) . '</p>';
			$u = self::sekimo_url( $vez, $nrs[0] );
			if ( $u ) { $h .= '<a href="' . esc_url( $u ) . '" style="display:inline-block;background:' . esc_attr( $bazine ) . ';color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:10px 18px;border-radius:5px">' . esc_html( 'Sekti siuntą' ) . '</a>'; }
		} else { $h .= '<p style="margin:0;font-size:14px">' . esc_html( 'Siunta perduota vežėjui ' . $vez_v . '.' ) . '</p>'; }
		$h .= '</td></tr></table>';
		// #5b: kaip sekti + registruotam klientui — paskyros užsakymas (`paskyra/uzsakymas/N/`); svečiui — tik „Sekti siuntą“.
		$pask = (int) $o->get_customer_id() > 0 ? wc_get_endpoint_url( 'view-order', $o->get_id(), wc_get_page_permalink( 'myaccount' ) ) : '';
		$sek  = array();
		if ( $nrs ) { $sek[] = esc_html( 'Siuntos kelią sekite paspaudę „Sekti siuntą“.' ); }
		if ( $pask ) { $sek[] = esc_html( 'Visą užsakymo eigą matysite ' ) . '<a href="' . esc_url( $pask ) . '" style="color:' . esc_attr( $bazine ) . ';font-weight:700">' . esc_html( 'paskyroje → Užsakymas Nr. ' . $nr_uzs ) . '</a>.'; }
		if ( $sek ) { $h .= '<p style="margin:-6px 0 18px;font-size:13px;color:#555">' . implode( ' ', $sek ) . '</p>'; }
		$sar = function( $eil ) { $l = '<ul style="margin:6px 0 14px;padding-left:20px">'; foreach ( $eil as $e ) { $l .= '<li style="margin:0 0 4px">' . esc_html( $e['q'] . ' × ' . $e['n'] ) . '</li>'; } return $l . '</ul>'; };
		if ( $sios ) { $h .= '<p style="margin:0"><b>' . esc_html( $viso > 1 && $dalis ? 'Šioje siuntoje:' : 'Prekės:' ) . '</b></p>' . $sar( $sios ); }
		if ( $kitos ) { $h .= '<p style="margin:0"><b>' . esc_html( 'Dar keliaus atskira siunta:' ) . '</b></p>' . $sar( $kitos ); }
		$h .= '<p>' . esc_html( 'Gražios dienos,' ) . '<br>' . esc_html( 'petshop.lt' ) . '</p>';
		$tema = $viso > 1 && $dalis ? sprintf( 'Užsakymas Nr. %s — išsiųsta %d iš %d siuntų', $nr_uzs, $n, $viso ) : sprintf( 'Jūsų užsakymas Nr. %s išsiųstas', $nr_uzs );
		$mailer = WC()->mailer();
		$ok = $mailer->send( $el, $tema, $mailer->wrap_message( $vardas_l, $h ) );
		if ( ! $ok ) { return array( false, 'laiško klientui išsiųsti nepavyko' ); }
		$dabar = current_time( 'mysql' );
		if ( $dalis ) { $iss[ $dalis ]['laiskas'] = $dabar; } else { foreach ( $iss as $k => $x ) { $iss[ $k ]['laiskas'] = $dabar; } }
		$o->update_meta_data( '_ps_dalys_issiusta', wp_json_encode( $iss ) ); $o->update_meta_data( '_ps_sekimo_siusta', $dabar );
		$o->add_order_note( 'Klientui išsiųsta „' . $vardas_l . '“ (' . $el . ')' . ( $nrs ? ': ' . implode( ', ', $nrs ) : ' — be sekimo numerio' ), false, true ); $o->save();
		return array( true, 'klientui išėjo „' . $vardas_l . '“' . ( $nrs ? '' : ' be sekimo numerio' ) );
	}

	/** „Surūšiuota — į darbą“: keliai įrašomi, `_ps_rusiuota`; į partiją NEDEDA (A7). */
	protected static function rusiuoti( $o, $u, $auto = false ) {
		if ( ! $o->is_paid() ) { return array( 'dl_klaida', 'užsakymas neapmokėtas' ); }
		if ( $o->get_meta( '_ps_rusiuota' ) ) { return array( 'dl_info', 'jau surūšiuota' ); }
		$f = self::faktai( $o, array() );
		$keliai = array();
		foreach ( $o->get_items() as $iid => $it ) {
			$e = $f['eil'][ (int) $iid ] ?? null;
			if ( ! $e || ! $e['k'] ) { return array( 'dl_klaida', 'ne visoms prekėms parinktas kelias — „' . ( $e ? $e['n'] : $iid ) . '“' ); }
			if ( ! $it->get_meta( '_ps_kelias' ) ) { $it->update_meta_data( '_ps_kelias', $e['k'] ); $it->save(); }
			$keliai[] = mb_substr( $e['n'], 0, 40 ) . ' — ' . self::kelio_vardas( $e['k'], $e['tiek'] );
		}
		$o->update_meta_data( '_ps_rusiuota', $auto ? 'auto' : current_time( 'mysql' ) . ' | ' . $u->display_name );
		if ( ! $o->get_meta( '_ps_misrus_sprendimas' ) ) { self::planas_is_eiluciu( $o ); $o->update_meta_data( '_ps_misrus_sprestas', current_time( 'mysql' ) . ' | ' . ( $auto ? 'auto' : $u->display_name ) ); }
		$o->add_order_note( ( $auto ? 'Surūšiuota pati: ' : 'Surūšiuota (' . $u->display_name . '): ' ) . implode( '; ', $keliai ), false, true );
		$o->save();
		if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) {
			Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $o->get_id(), 'sritis' => 'desk', 'veiksmas' => 'rusiuoti', 'rezultatas' => 'ok', 'kanalas' => $auto ? 'auto' : 'web', 'kas' => $auto ? 0 : $u->ID, 'kas_vardas' => $auto ? 'sistema' : $u->display_name,
				'po' => array( 'zinute' => implode( '; ', $keliai ) ), 'pastaba' => $auto ? 'auto: visos prekės vienu keliu' : null ) );
		}
		do_action( 'ps_juosta_isvalyti' );
		return array( 'dl_rusiuota', implode( '; ', $keliai ) );
	}

	/** Auto rūšiavimas apmokėjus (spec 6a): visos eilutės su šaltiniu ir vienu keliu. Grąžina true, jei surūšiavo. */
	public static function auto_rusiuoti( $order_id ) {
		$o = is_numeric( $order_id ) ? wc_get_order( $order_id ) : $order_id;
		if ( ! $o || ! $o->is_paid() || $o->get_meta( '_ps_rusiuota' ) || ! class_exists( 'Petshop_Desk' ) || self::d( 'misrus_sprendimas', $o ) ) { return false; }
		if ( $o->get_meta( self::PAKART_META ) ) { return false; } // v3.21: pakartotinis užsakymas — tik pinigams, į Surinkti neina
		if ( self::d( 'klausimas', $o ) ) { return false; }
		$src = array();
		foreach ( $o->get_items() as $it ) { $s = (string) $it->get_meta( '_ps_source' ); if ( ! $s ) { return false; } $src[ $s ] = 1; }
		// Raimis 09-03: pati išrūšiuoja TIK vieno sandėlio užsakymus. 2+ sandėliai → Neišrūšiuoti (siųsti atskirai ar sudėti į AV — žmogaus sprendimas, „Auto“ eilutėje).
		if ( count( $src ) > 1 ) { return false; }
		$r = self::rusiuoti( $o, wp_get_current_user(), true );
		return 'dl_rusiuota' === $r[0];
	}

	/* ============================ UŽKLAUSA ============================ */

	protected static function filtrai() {
		$g = function ( $k, $t = 'key' ) { if ( ! isset( $_GET[ $k ] ) ) { return ''; } return 'key' === $t ? sanitize_key( $_GET[ $k ] ) : sanitize_text_field( wp_unslash( $_GET[ $k ] ) ); };
		return array( 'q' => $g( 'q', 't' ), 'data' => $g( 'data' ), 'nuo' => $g( 'nuo', 't' ), 'iki' => $g( 'iki', 't' ), 'vykdymas' => $g( 'vykdymas' ), 'vezejas' => $g( 'vezejas' ),
			'busena' => '', 'mokejimas' => '', 'amzius' => '', 'nr' => '', 'klientas' => '', 'tel' => '', 'adresas' => '', 'zvilgsnis' => '', 'b' => $g( 'b' ), 'r' => $g( 'r' ), 'psl' => max( 1, (int) ( $_GET['psl'] ?? 1 ) ) );
	}

	protected static function faktu_sarasas( $orders ) {
		$orders = array_filter( (array) $orders, function ( $o ) { return is_a( $o, 'WC_Order' ) && ! $o->get_meta( self::PAKART_META ); } ); // v3.21: pakartotiniai užsakymai darbalaukyje nerodomi (būseną rodo pradinio kortelė / skydelis)
		$z = self::zurnalas( array_map( function ( $o ) { return $o->get_id(); }, $orders ) );
		$out = array(); foreach ( $orders as $o ) { $out[] = self::faktai( $o, $z ); } return $out;
	}

	const RIBA = 1000;
	protected static $ne_visi = false;

	/** Atviri = tik tie, kur reikia darbo (processing / on-hold / LP). Neapmokėti — atskirai (K2). Riba 1000 + įspėjimas. */
	protected static function atviri() {
		$orders = wc_get_orders( array( 'limit' => self::RIBA, 'type' => 'shop_order', 'orderby' => 'date', 'order' => 'DESC', 'return' => 'objects',
			'status' => array_merge( array( 'processing', 'on-hold', 'lp-parcel-await', 'lp-parcel-failed' ), Petshop_Desk::STATUSAI['paruosta'] ) ) );
		if ( count( (array) $orders ) >= self::RIBA ) { self::$ne_visi = true; }
		// v3.11: įvykdytas / kelyje užsakymas, kurio siuntą Venipak grąžina — Klausimas „Siunta grįžta“ (žymė nuimama sprendimu, 4 etapo #3).
		$grizta = wc_get_orders( array( 'limit' => 50, 'type' => 'shop_order', 'orderby' => 'date', 'order' => 'DESC', 'return' => 'objects', 'status' => array_merge( Petshop_Desk::STATUSAI['ivykdyti'], Petshop_Desk::STATUSAI['kelyje'] ), 'meta_query' => array( array( 'key' => self::GRIZTA_META, 'compare' => 'EXISTS' ) ) ) );
		foreach ( (array) $grizta as $go ) { if ( self::grizta( $go ) ) { $orders[] = $go; } }
		// v3.19: įvykdytas / atšauktas užsakymas, kuriam po kiekio keitimo dar negrąžinti pinigai — Klausimas „Grąžink klientui pinigus“ (žymė nuimama „Grąžinta“).
		$turim = array(); foreach ( (array) $orders as $x ) { $turim[ $x->get_id() ] = 1; }
		$graz = wc_get_orders( array( 'limit' => 50, 'type' => 'shop_order', 'orderby' => 'date', 'order' => 'DESC', 'return' => 'objects', 'status' => array_merge( Petshop_Desk::STATUSAI['ivykdyti'], Petshop_Desk::STATUSAI['kelyje'], array( 'cancelled', 'refunded' ) ), 'meta_query' => array( array( 'key' => self::GRAZINTI_META, 'compare' => 'EXISTS' ) ) ) );
		foreach ( (array) $graz as $go ) { if ( empty( $turim[ $go->get_id() ] ) && self::grazinti( $go ) ) { $orders[] = $go; } }
		return self::faktu_sarasas( $orders );
	}

	protected static function neapmoketi() {
		$orders = wc_get_orders( array( 'limit' => 300, 'type' => 'shop_order', 'orderby' => 'date', 'order' => 'DESC', 'return' => 'objects', 'status' => array( 'pending', 'failed' ), 'date_created' => '>' . ( time() - 14 * DAY_IN_SECONDS ) ) );
		if ( count( (array) $orders ) >= 300 ) { self::$ne_visi = 'neapmoketi'; } // T3: riba pasiekta — įspėjimas juostoje
		return self::faktu_sarasas( $orders );
	}

	const PSL = 50;
	protected static $visi_iš_viso = 0;

	/** V9: „Visi“ puslapiais po 50 (`psl`), „Išsiųsta šiandien“ — iš `_ps_dalys_issiusta` (K4) arba `date_completed` šiandien, ne pagal `date_modified`. */
	protected static function visi( $f ) {
		if ( '' !== $f['q'] || $f['data'] ) { return self::faktu_sarasas( array_map( function ( $r ) { return $r['o']; }, (array) self::d( 'gauti', 'visi', $f ) ) ); }
		$args = array( 'limit' => self::PSL, 'offset' => ( $f['psl'] - 1 ) * self::PSL, 'paginate' => true, 'type' => 'shop_order', 'orderby' => 'date', 'order' => 'DESC', 'return' => 'objects' ); $b = $f['b'];
		if ( 'siandien' === $b ) {
			$diena = wp_date( 'Y-m-d' );
			$a = wc_get_orders( array( 'limit' => 300, 'type' => 'shop_order', 'return' => 'ids', 'status' => array_merge( array( 'processing', 'on-hold' ), Petshop_Desk::STATUSAI['kelyje'], Petshop_Desk::STATUSAI['ivykdyti'] ), 'meta_query' => array( array( 'key' => '_ps_dalys_issiusta', 'value' => '"laikas":"' . $diena, 'compare' => 'LIKE' ) ) ) );
			$c = wc_get_orders( array( 'limit' => 300, 'type' => 'shop_order', 'return' => 'ids', 'status' => array_merge( Petshop_Desk::STATUSAI['kelyje'], Petshop_Desk::STATUSAI['ivykdyti'] ), 'date_completed' => '>=' . strtotime( $diena . ' 00:00:00' ) ) );
			$ids = array_values( array_unique( array_merge( (array) $a, (array) $c ) ) ); self::$visi_iš_viso = count( $ids );
			return self::faktu_sarasas( array_map( 'wc_get_order', array_slice( $ids, ( $f['psl'] - 1 ) * self::PSL, self::PSL ) ) );
		}
		if ( 'kelyje' === $b ) { $args['status'] = Petshop_Desk::STATUSAI['kelyje']; }
		elseif ( 'ivykdyti' === $b ) { $args['status'] = Petshop_Desk::STATUSAI['ivykdyti']; }
		elseif ( 'atsaukti' === $b ) { $args['status'] = Petshop_Desk::STATUSAI['atsaukti']; }
		else { $args['status'] = array_diff( array_map( function ( $s ) { return str_replace( 'wc-', '', $s ); }, array_keys( wc_get_order_statuses() ) ), array( 'checkout-draft' ) ); }
		$res = wc_get_orders( $args ); self::$visi_iš_viso = (int) ( $res->total ?? 0 );
		return self::faktu_sarasas( $res->orders ?? array() );
	}

	/** Puslapių juostelė „Visi“ apačioje. */
	protected static function puslapiai( $f ) {
		$n = (int) self::$visi_iš_viso; $p = (int) $f['psl']; $iki = (int) ceil( $n / self::PSL ); if ( $iki <= 1 ) { return; }
		echo '<div class="dl-psl">' . ( $p > 1 ? '<a class="v t" href="' . esc_url( self::url( array( 'psl' => $p - 1 > 1 ? $p - 1 : null ) ) ) . '">‹ ankstesni</a>' : '' ) . '<span class="pilkas maz">' . ( ( $p - 1 ) * self::PSL + 1 ) . '–' . min( $n, $p * self::PSL ) . ' iš ' . $n . '</span>' . ( $p < $iki ? '<a class="v t" href="' . esc_url( self::url( array( 'psl' => $p + 1 ) ) ) . '">kiti ›</a>' : '' ) . '</div>';
	}

	protected static function filtruoti( $rows, $f ) {
		$riba = $f['data'] ? self::d( 'datos_riba', $f['data'], $f['nuo'], $f['iki'] ) : null;
		return array_values( array_filter( $rows, function ( $r ) use ( $f, $riba ) {
			if ( $f['vykdymas'] ) {
				$s = array_values( array_unique( array_filter( array_column( $r['eil'], 'src' ) ) ) ); $av = in_array( 'av', $s, true ); $n = count( $s ); $v = $f['vykdymas'];
				if ( 'sava' === $v && ( $n > 1 || ! $av ) ) { return false; }
				if ( 'dropship' === $v && ( $n > 1 || $av || ! $n ) ) { return false; }
				if ( 'misrus' === $v && $n < 2 ) { return false; }
				if ( isset( Petshop_Desk::SALTINIAI[ $v ] ) && ! in_array( $v, $s, true ) ) { return false; }
			}
			if ( $f['vezejas'] && $r['vez'] !== $f['vezejas'] ) { return false; }
			if ( $riba ) { $d = $r['o']->get_date_created(); if ( ! $d ) { return false; } $t = $d->getTimestamp(); $tz = wp_timezone();
				if ( $t < ( new DateTime( $riba[0], $tz ) )->getTimestamp() || $t > ( new DateTime( $riba[1], $tz ) )->getTimestamp() ) { return false; } }
			return true;
		} ) );
	}

	protected static function rikiuoti( $rows, $r ) {
		$laikas = function ( $x ) { $d = $x['o']->get_date_paid(); if ( ! $d ) { $d = $x['o']->get_date_created(); } return $d ? $d->getTimestamp() : 0; };
		usort( $rows, function ( $a, $b ) use ( $r, $laikas ) {
			switch ( $r ) {
				case 'laikas':   return $laikas( $b ) <=> $laikas( $a );
				case 'suma':     return (float) $b['o']->get_total() <=> (float) $a['o']->get_total();
				case 'klientas': return strcasecmp( $a['o']->get_billing_last_name() . $a['o']->get_billing_first_name(), $b['o']->get_billing_last_name() . $b['o']->get_billing_first_name() );
				case 'tiekejas': $ta = implode( ',', array_diff( array_unique( array_column( $a['eil'], 'src' ) ), array( 'av' ) ) ); $tb = implode( ',', array_diff( array_unique( array_column( $b['eil'], 'src' ) ), array( 'av' ) ) ); return strcmp( $ta, $tb ) ?: ( $laikas( $a ) <=> $laikas( $b ) );
			}
			return ( $a['skuba'] <=> $b['skuba'] ) ?: ( $laikas( $a ) <=> $laikas( $b ) );
		} );
		return $rows;
	}

	/* ============================ VAIZDAS ============================ */

	protected static function url( $args = array() ) {
		$b = array( 'page' => self::SLUG );
		foreach ( array( 'eile', 'q', 'data', 'nuo', 'iki', 'vykdymas', 'vezejas', 'b', 'r', 'psl' ) as $k ) { if ( isset( $_GET[ $k ] ) && '' !== $_GET[ $k ] ) { $b[ $k ] = sanitize_text_field( wp_unslash( $_GET[ $k ] ) ); } }
		foreach ( $args as $k => $v ) { if ( null === $v || '' === $v ) { unset( $b[ $k ] ); } else { $b[ $k ] = $v; } }
		return admin_url( 'admin.php?' . http_build_query( $b ) );
	}

	public static function puslapis() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		if ( self::senas() ) { Petshop_Desk::puslapis(); return; }
		$eile = isset( $_GET['eile'] ) ? sanitize_key( $_GET['eile'] ) : 'nauji';
		if ( ! isset( self::EILES[ $eile ] ) ) { $eile = 'misrus' === $eile ? 'nauji' : ( 'laukia' === $eile ? 'laukiam' : ( in_array( $eile, array( 'issiusti', 'atsaukti' ), true ) ? 'visi' : 'nauji' ) ); }
		$f = self::filtrai();
		if ( '' !== $f['q'] ) { $eile = 'visi'; }
		$atviri = self::atviri(); $neapm = self::neapmoketi();
		$c = array_fill_keys( array_keys( self::EILES ), 0 );
		foreach ( array_merge( $atviri, $neapm ) as $r ) { foreach ( $r['eiles'] as $e ) { $c[ $e ]++; } if ( ! empty( $r['naujas'] ) ) { $c['siandien']++; } }
		$atviri = array_merge( $atviri, $neapm );
		global $wpdb; $c['visi'] = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}wc_orders WHERE type='shop_order' AND status<>'wc-checkout-draft'" );
		if ( self::rytas_langas() ) { self::stilius(); echo '<div class="dl" id="dl" data-eile="rytas" data-atid="0" data-n="' . esc_attr( wp_create_nonce( 'ps_dl_zurnalas' ) ) . '">'; self::pranesimas(); self::rytas( $atviri, $c ); self::skydelio_html(); self::dialogas(); self::skriptas(); echo '</div>'; return; }
		$rows = 'visi' === $eile ? self::visi( $f ) : array_values( array_filter( $atviri, function ( $r ) use ( $eile ) { return 'siandien' === $eile ? ! empty( $r['naujas'] ) : in_array( $eile, $r['eiles'], true ); } ) );
		$rows = self::rikiuoti( self::filtruoti( $rows, $f ), in_array( $eile, array( 'visi', 'siandien' ), true ) && ! $f['r'] ? 'laikas' : $f['r'] );
		$atid = isset( $_GET['atidaryti'] ) ? absint( $_GET['atidaryti'] ) : 0;
		if ( $atid && ! array_filter( $rows, function ( $r ) use ( $atid ) { return $r['id'] === $atid; } ) ) {
			$oa = wc_get_order( $atid ); if ( $oa ) { $x = self::faktai( $oa, self::zurnalas( array( $atid ) ) ); $x['svetimas'] = 1; $rows[] = $x; }
		}

		self::stilius();
		echo '<div class="dl" id="dl" data-eile="' . esc_attr( $eile ) . '" data-atid="' . (int) $atid . '" data-n="' . esc_attr( wp_create_nonce( 'ps_dl_zurnalas' ) ) . '">';
		self::pranesimas();
		if ( self::$ne_visi ) { echo '<div class="pd-msg pd-msg-klaida">' . ( 'neapmoketi' === self::$ne_visi ? 'Neapmokėtų (14 d.) daugiau nei 300 — rodomi ne visi; skaitliukai Gauti/Klausimai/Neapmokėti nepilni.' : 'Atvirų užsakymų daugiau nei ' . self::RIBA . ' — rodomi ne visi.' ) . ' Naudok paiešką arba filtrus.</div>'; }
		echo '<main class="dl-main">';
		if ( '' !== $f['q'] ) { echo '<h1 class="dl-h1">Paieška: „' . esc_html( $f['q'] ) . '“ <small><a href="' . esc_url( self::url( array( 'q' => null ) ) ) . '">✕ išvalyti</a></small></h1>'; }
		self::eiles( $eile, $c );
		self::filtru_juosta( $eile, $f );
		if ( 'klausimai' === $eile && $rows ) { self::klausimu_korteles( $rows ); }
		elseif ( 'laiskai' === $eile && $rows ) { self::laisku_korteles( $rows ); }
		elseif ( 'paruosta' === $eile && $rows ) { self::paruostos_korteles( $rows ); }
		elseif ( 'laukiam' === $eile && '' === $f['q'] ) { $ds = array(); foreach ( $atviri as $r ) { if ( in_array( 'laiskai', $r['eiles'], true ) ) { foreach ( $r['tiesiai'] as $s ) { if ( empty( $r['dalys'][ $s ]['perduota'] ) ) { $ds[ $s ] = ( $ds[ $s ] ?? 0 ) + 1; } } } } self::laukiam_korteles( $rows, $ds ); }
		else { self::lentele( $rows, $eile ); if ( 'visi' === $eile && '' === $f['q'] && ! $f['data'] ) { self::puslapiai( $f ); } }
		echo '</main>';
		self::skydelio_html();
		self::dialogas();
		self::skriptas();
		echo '</div>';
	}

	protected static function pranesimas() {
		if ( empty( $_GET['pd_ok'] ) ) { return; }
		$k = sanitize_key( wp_unslash( $_GET['pd_ok'] ) );
		$nr = isset( $_GET['pd_nr'] ) ? sanitize_text_field( wp_unslash( $_GET['pd_nr'] ) ) : ''; $d = explode( '|', $nr, 2 );
		// Atsekamumas: po veiksmo — kur užsakymas dabar.
		$kur = ''; $oid = isset( $_GET['atidaryti'] ) ? absint( $_GET['atidaryti'] ) : ( preg_match( '/^#?(\d{4,})/', $d[0] ?? '', $mm ) ? (int) $mm[1] : 0 );
		if ( $oid && ( $oo = wc_get_order( $oid ) ) ) { $fx = self::faktai( $oo, self::zurnalas( array( $oid ) ) ); $kur = ' → dabar: ' . self::kur_dabar( $fx ); }
		$GLOBALS['ps_dl_kur'] = $kur;
		$var = array( 'vp_ok' => array( 'ok', 'Lipdukas: siunta užregistruota (%s).' ), 'vp_klaida' => array( 'klaida', 'Venipak nepriėmė: %s' ), 'vp_nieko' => array( 'info', '%s.' ), 'kons_ok' => array( 'ok', '#%s: %s prekė(-s) į užsakymą tiekėjui — užsakyk ir priimk „Laukiam iš tiekėjų“ eilėje.' ), 'kons_nieko' => array( 'info', '#%s: nėra ko užsakyti į AV.' ), 'apmoketa' => array( 'ok', '#%s apmokėtas. Prekės rezervuotos, klientui išsiųstas patvirtinimas.' ), 'apmoketa_tyliai' => array( 'ok', '#%s apmokėtas. Laiškas klientui nesiųstas.' ), 'atsaukta' => array( 'ok', '#%s atšauktas. Prekės grąžintos į likutį. Klientui nepranešta.' ), 'atsaukta_laiskas' => array( 'ok', '#%s atšauktas. Klientui išsiųstas pranešimas.' ), 'pakuotes' => array( 'ok', 'Dėžių: %s.' ), 'kl_laukti' => array( 'info', '#%s — laukiam; priminimo nebus.' ) );
		if ( isset( $var[ $k ] ) ) { $t0 = str_replace( array( ' · AV', ' · PRINS', ' · VF', ' · ZB', ' · QUATTRO', ' · AMBROSIA', ' · BELCOR_TOFU' ), array( ' — AV', ' — Prins', ' — VF', ' — ZB', ' — Quattro', ' — Ambrosia', ' — Belacor' ), $nr ); $d0 = explode( '|', $t0, 2 ); printf( '<div class="pd-msg pd-msg-%s">%s%s<button class="pd-msg-x" onclick="this.parentNode.remove()">✕</button></div>', esc_attr( $var[ $k ][0] ), esc_html( sprintf( $var[ $k ][1], $d0[0], $d0[1] ?? '' ) ), esc_html( $kur ) ); return; }
		if ( 0 !== strpos( $k, 'dl_' ) ) { ob_start(); self::d( 'pranesimas' ); $h = ob_get_clean(); $h = str_replace( array( 'Avesos sandėlį', 'Avesos sandėlyje', 'Avesoje', 'Avesos', 'Avesa', 'Vetfarmas', 'Žalioji Banga', 'Žaliosios Bangos', 'Belacor (belcor_tofu)', 'partiją #', 'partija #', 'partijoje #', 'partijos #', ' WooCommerce' ), array( 'AV', 'AV', 'AV', 'AV', 'AV', 'VF', 'ZB', 'ZB', 'Belacor', 'užsakymą tiekėjui #', 'užsakymas tiekėjui #', 'užsakyme tiekėjui #', 'užsakymo tiekėjui #', '' ), $h ); /* #4: variklio žodžiai → darbuotojo žodynas */ echo $kur ? str_replace( '<button class="pd-msg-x"', esc_html( $kur ) . '<button class="pd-msg-x"', $h ) : $h; return; }
		$t = array( 'dl_kelias' => array( 'ok', '#%s — pakeista: %s' ), 'dl_issiusta' => array( 'ok', '#%s išsiųstas — įvykdytas; %s.' ), 'dl_dalis' => array( 'ok', '#%s: %s.' ), 'dl_issiusta_visi' => array( 'ok', 'Kurjeris paėmė — %2$s.' ), 'dl_laiskas' => array( 'ok', 'Užsakyta iš %s — %s → Paruošta siųsti.' ), 'dl_zb' => array( 'ok', '%s — suvesta %s užs. → Paruošta siųsti.' ), 'dl_rusiuota' => array( 'ok', '#%s surūšiuotas. %s' ), 'dl_uzsak_av' => array( 'ok', '%s: %s.' ), 'dl_gauta' => array( 'ok', '%s: %s.' ), 'dl_info' => array( 'info', '#%s: %s' ), 'dl_klaida' => array( 'klaida', '#%s: %s' ) );
		if ( ! isset( $t[ $k ] ) ) { return; }
		printf( '<div class="pd-msg pd-msg-%s">%s%s<button class="pd-msg-x" onclick="this.parentNode.remove()">✕</button></div>', esc_attr( $t[ $k ][0] ), esc_html( sprintf( $t[ $k ][1], $d[0], $d[1] ?? '' ) ), esc_html( $kur ) );
	}

	protected static function eiles( $eile, $c ) {
		echo '<div class="dl-eiles">';
		foreach ( self::EILES as $k => $e ) {
			$n = (int) ( $c[ $k ] ?? 0 );
			printf( '<a class="dl-e%s" href="%s"%s>%s <span class="sk%s">%s</span></a>', $k === $eile ? ' on' : '', esc_url( self::url( array( 'eile' => $k, 'q' => null, 'b' => null ) ) ), $e[1] ? ' title="' . esc_attr( $e[1] ) . '"' : '', esc_html( $e[0] ), $n && $e[2] ? ' ' . $e[2] : '', 'visi' === $k ? number_format( $n, 0, ',', ' ' ) : $n );
		}
		echo '</div>';
	}

	protected static function select( $vardas, $opcijos, $reiksme ) {
		$h = '<select name="' . esc_attr( $vardas ) . '" onchange="this.form.submit()">';
		foreach ( $opcijos as $k => $t ) { $h .= '<option value="' . esc_attr( $k ) . '"' . selected( $reiksme, $k, false ) . '>' . esc_html( $t ) . '</option>'; }
		return $h . '</select>';
	}

	protected static function filtru_juosta( $eile, $f ) {
		$akt = $f['vykdymas'] || $f['vezejas'] || $f['data'] || $f['r'];
		echo '<div class="dl-f-row"><a href="#" class="dl-f-tog' . ( $akt ? ' on' : '' ) . '">Filtrai ▾' . ( $akt ? ' (įjungti)' : '' ) . '</a><div class="dl-f-wrap"' . ( $akt ? '' : ' style="display:none"' ) . '>';
		if ( 'visi' === $eile ) {
			echo '<div class="dl-chips">';
			foreach ( array( '' => 'Visi', 'kelyje' => 'Kelyje', 'ivykdyti' => 'Įvykdyti', 'atsaukti' => 'Atšaukti', 'siandien' => 'Išsiųsta šiandien' ) as $k => $t ) { printf( '<a class="dl-chip%s" href="%s">%s</a>', $f['b'] === $k ? ' on' : '', esc_url( self::url( array( 'b' => $k ?: null, 'psl' => null ) ) ), esc_html( $t ) ); }
			echo '</div>';
		}
		echo '<form method="get" class="dl-f" action="' . esc_url( admin_url( 'admin.php' ) ) . '"><input type="hidden" name="page" value="' . esc_attr( self::SLUG ) . '"><input type="hidden" name="eile" value="' . esc_attr( $eile ) . '">';
		if ( '' !== $f['q'] ) { echo '<input type="hidden" name="q" value="' . esc_attr( $f['q'] ) . '">'; } if ( $f['b'] ) { echo '<input type="hidden" name="b" value="' . esc_attr( $f['b'] ) . '">'; }
		$vyk = array( '' => 'Iš kur: visi', 'sava' => 'Tik iš AV', 'dropship' => 'Tik iš tiekėjų', 'misrus' => 'AV + tiekėjas' );
		foreach ( Petshop_Desk::SALTINIAI as $k => $s ) { if ( 'av' !== $k ) { $vyk[ $k ] = 'Pagal tiekėją: ' . self::vardas( $k ); } }
		echo self::select( 'vykdymas', $vyk, $f['vykdymas'] );
		echo self::select( 'vezejas', array( '' => 'Pristatymas: visi', 'venipak_kurjeris' => 'Venipak kurjeris', 'venipak_pastomatas' => 'Venipak paštomatas', 'lp' => 'LP Express' ), $f['vezejas'] );
		echo self::select( 'data', array( '' => 'Data: visos', 'siandien' => 'Šiandien', 'vakar' => 'Vakar', 'savaite' => 'Ši savaitė', 'menuo' => 'Šis mėnuo', 'praeitas' => 'Praeitas mėnuo' ), $f['data'] );
		echo '<span class="pilkas maz">Rikiuoti:</span>' . self::select( 'r', array( '' => 'skubiausi pirmi', 'laikas' => 'naujausi pirmi', 'suma' => 'suma', 'tiekejas' => 'tiekėjas', 'klientas' => 'klientas' ), $f['r'] );
		if ( $akt ) { echo '<a class="dl-x" href="' . esc_url( self::url( array( 'vykdymas' => null, 'vezejas' => null, 'data' => null, 'r' => null ) ) ) . '">išvalyti</a>'; }
		echo '</form></div></div>';
	}

	/** Kelio žymė sąraše (maketo kelZyme): pilnas vardas. */
	protected static function zyme( $e ) {
		if ( ! $e['k'] ) { return '<span class="kel klaus"><i></i>kur?</span>'; }
		$cls = array( 'av' => 'sandelis', 'tiesiai' => 'tk', 'i_av' => 'ts' );
		return '<span class="kel ' . $cls[ $e['k'] ] . '"><i></i>' . esc_html( self::kelio_vardas( $e['k'], $e['tiek'] ) ) . '</span>';
	}

	/** Trumpas takelis: ✓ paskutinis padarytas · DABAR (visi „now“/„bad“) · kitas · (+n). Pilna grandinė — skydelyje. */
	protected static function takelis_html( $r ) {
		$done = array(); $now = array(); $wait = array(); $todo = array();
		foreach ( $r['takelis'] as $t ) { if ( 'done' === $t[2] ) { $done[] = $t[1]; } elseif ( 'now' === $t[2] || 'bad' === $t[2] ) { $now[] = $t; } elseif ( 'wait' === $t[2] ) { $wait[] = $t[1]; } else { $todo[] = $t[1]; } }
		$h = '';
		if ( $done ) { $h .= '<span class="done" title="' . esc_attr( implode( ' › ', $done ) ) . '">✓ ' . esc_html( end( $done ) ) . ( count( $done ) > 1 ? ' <small>+' . ( count( $done ) - 1 ) . '</small>' : '' ) . '</span>'; }
		foreach ( $now as $t ) { $h .= ( $h ? '<i>›</i>' : '' ) . '<span class="' . esc_attr( $t[2] ) . '">' . esc_html( $t[1] ) . '</span>'; }
		foreach ( $wait as $w ) { $h .= ( $h ? '<i>›</i>' : '' ) . '<span class="wait">' . esc_html( $w ) . '</span>'; }
		if ( $todo ) { $h .= ( $h ? '<i>›</i>' : '' ) . '<span class="todo">' . esc_html( $todo[0] ) . ( count( $todo ) > 1 ? ' <small>+' . ( count( $todo ) - 1 ) . '</small>' : '' ) . '</span>'; }
		return '<div class="takelis">' . $h . '</div>';
	}

	protected static function btn_html( $b, $cls = 'v p' ) {
		if ( ! $b ) { return ''; }
		if ( ! empty( $b[4] ) ) { return '<a class="kel ts dl-pasyvus" href="' . esc_url( $b[1] ) . '"><i></i>' . esc_html( $b[0] ) . '</a>'; }
		$c = 'bad' === $b[3] ? 'v bad' : ( 's' === $b[3] ? 'v' : $cls );
		if ( '#skydelis' === $b[1] ) { return '<button class="' . $c . '" data-atidaryti="1">' . esc_html( $b[0] ) . '</button>'; }
		$blank = ( false !== strpos( $b[1], 'v=lapai' ) ) ? ' target="_blank" data-blank="1"' : '';
		return '<a class="' . $c . '" href="' . esc_url( $b[1] ) . '"' . $blank . ( $b[2] ? ' data-d="' . esc_attr( wp_json_encode( $b[2] ) ) . '"' : '' ) . '>' . esc_html( $b[0] ) . '</a>';
	}

	protected static function lentele( $rows, $eile ) {
		if ( ! $rows ) { echo '<div class="dl-tuscia">Čia tuščia — nieko daryti nereikia.</div>'; return; }
		echo '<table class="dl-tbl dl-paprasta"><thead><tr><th>Užsakymas</th><th>Prekės</th>' . ( 'visi' === $eile ? '<th>Būsena</th>' : '' ) . ( 'siandien' === $eile || 'visi' === $eile ? '<th>Kur dabar</th>' : '' ) . '<th class="d">Toliau</th></tr></thead><tbody>';
		foreach ( $rows as $r ) {
			$o = $r['o']; $id = $r['id'];
			$sp = Petshop_Desk::SPALVOS[ $r['st'] ] ?? array( '#F1F1EE', '#6B7269' );
			$laikas = $o->get_date_paid() ? $o->get_date_paid() : $o->get_date_created();
			$vardas = trim( $o->get_shipping_first_name() . ' ' . $o->get_shipping_last_name() ); if ( ! $vardas ) { $vardas = trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ); }
			$miestas = $o->get_shipping_city() ? $o->get_shipping_city() : $o->get_billing_city();
			$rb = 'visi' === $eile ? ' dl-row-' . self::busena( $r )[1] : '';
			printf( '<tr class="eil%s%s%s%s" data-id="%d" tabindex="0" data-sk="1">', empty( $r['svetimas'] ) ? '' : ' dl-svetimas', empty( $r['naujas'] ) ? '' : ' dl-n', empty( $r['nepakuok'] ) ? '' : ' dl-demesys', $rb, $id ); // v3.18: dl-demesys
			// 1 stulpelis: nr · laikas · klientas · pristatymas · pastaba
			echo '<td><span class="nr">#' . esc_html( $o->get_order_number() ) . '</span>' . ( ! empty( $r['naujas'] ) ? ' <b class="dl-nz" title="dar neatidarytas">N</b>' : '' ) . ' <span class="pilkas maz">' . esc_html( self::amzius( $laikas ) ) . '</span>';
			if ( 'processing' !== $r['st'] ) { echo ' <span class="dl-pill" style="background:' . esc_attr( $sp[0] ) . ';color:' . esc_attr( $sp[1] ) . '">' . esc_html( wc_get_order_statuses()[ 'wc-' . $r['st'] ] ?? $r['st'] ) . '</span>'; }
			echo '<br>' . esc_html( $vardas ?: '—' ) . ' <span class="pilkas maz">· ' . esc_html( self::d( 'vezejo_vardas', $o ) ) . ( $miestas ? ', ' . esc_html( $miestas ) : '' ) . ' · ' . esc_html( wp_strip_all_tags( $o->get_formatted_order_total() ) ) . ( $r['paid'] ? '' : ' · <b class="raud">neapmokėta</b>' ) . '</span>';
			if ( $o->get_meta( '_ps_klaus_laukti' ) ) { echo ' <span class="dl-pill dl-pill-e">laukia nuo ' . esc_html( wp_date( 'm-d H:i', strtotime( $o->get_meta( '_ps_klaus_laukti' ) ) ) ) . '</span>'; }
			if ( $o->get_meta( self::VEL_META ) ) { echo ' <span class="dl-pill dl-pill-e">klientui pranešta apie vėlavimą ' . esc_html( substr( (string) $o->get_meta( self::VEL_META ), 5, 11 ) ) . '</span>'; } // v3.13
			if ( ! empty( $r['nepakuok'] ) ) { echo '<div class="dl-note dl-note-r">⚠ Lape bus ir jau išsiųstos prekės — NEPAKUOK: ' . esc_html( implode( '; ', $r['nepakuok'] ) ) . '</div>'; } // v3.18
			if ( $o->get_customer_note() ) { echo '<div class="dl-note">Klientas: ' . esc_html( $o->get_customer_note() ) . '</div>'; }
			echo '</td>';
			// 2 stulpelis: prekės pagal kelią — viena eilutė kiekvienam keliui
			$gr = array(); foreach ( $r['eil'] as $e ) { if ( ! empty( $e['atsaukta'] ) || ! empty( $e['issiusta_l'] ) ) { continue; } $k = 'av' === $e['k'] ? 'av' : ( ( $e['k'] ?: 'kur' ) . '|' . $e['tiek'] ); $gr[ $k ][] = $e; } // v3.18.1: jau išsiųstos / atšauktos eilutės nerodomos (pill ir skydelis jas rodo)
			if ( ! $gr ) { foreach ( $r['eil'] as $e ) { $k = 'av' === $e['k'] ? 'av' : ( ( $e['k'] ?: 'kur' ) . '|' . $e['tiek'] ); $gr[ $k ][] = $e; } }
			echo '<td>';
			foreach ( $gr as $k => $es ) { $e0 = $es[0]; $n = 0; foreach ( $es as $e ) { $n += $e['q']; } $bad = array(); foreach ( $es as $e ) { if ( false === $e['av_ok'] ) { $bad[] = 'Avesoje ' . (int) $e['av_qty'] . ', reikia ' . $e['q']; } }
				$pav = mb_substr( $e0['n'], 0, 42 ) . ( mb_strlen( $e0['n'] ) > 42 ? '…' : '' );
				$imgs = ''; $ii = 0; foreach ( $es as $e ) { if ( $e['img'] && $ii < 3 ) { $imgs .= '<img class="dl-img-s" src="' . esc_url( $e['img'] ) . '" alt="" title="' . esc_attr( $e['n'] ) . '">'; $ii++; } }
				echo '<div class="dl-it">' . self::zyme( $e0 ) . ' ' . $imgs . ' <b>' . $n . ' vnt.</b> <span class="pilkas">' . esc_html( $pav ) . ( count( $es ) > 1 ? ' +' . ( count( $es ) - 1 ) : '' ) . '</span>' . ( $e0['bukle'] ? ' <span class="pilkas maz">' . esc_html( $e0['bukle'] ) . '</span>' : '' ) . ( $bad ? ' <span class="raud maz">' . esc_html( implode( '; ', $bad ) ) . '</span>' : '' ) . '</div>'; }
			echo '</td>';
			if ( 'visi' === $eile ) { list( $bt, $bc ) = self::busena( $r ); echo '<td><span class="dl-b ' . esc_attr( $bc ) . '">' . esc_html( $bt ) . '</span></td>'; }
			if ( 'siandien' === $eile || 'visi' === $eile ) { echo '<td><span class="maz">' . esc_html( self::kur_dabar( $r ) ) . '</span></td>'; }
			$b = self::mygtukas_eilei( $r, $eile );
			echo '<td class="d">' . self::btn_html( $b );
			if ( 'nauji' === $eile && $r['paid'] && ! $r['rus'] && ! $r['kl'] ) {
				$siulo = array(); $gal = ! $o->get_customer_note(); foreach ( $r['eil'] as $e ) { if ( '' === $e['k'] || false === $e['av_ok'] ) { $gal = false; } $siulo[ self::kelio_vardas( $e['k'], $e['tiek'] ) ] = 1; }
				$siunt = 0; $tk = array(); foreach ( $r['eil'] as $e ) { if ( 'av' === $e['k'] || 'i_av' === $e['k'] ) { $tk['av'] = 1; } elseif ( 'tiesiai' === $e['k'] ) { $tk[ $e['tiek'] ] = 1; } } $siunt = count( $tk );
				if ( $gal ) { echo ' <a class="v" href="' . esc_url( self::dl_url( 'rusiuoti', $id ) ) . '" title="Surūšiuoti taip, kaip siūlo sistema, neatidarant">Auto</a>'; }
				echo '<br><span class="pilkas maz">siūlo: ' . esc_html( implode( ' · ', array_keys( $siulo ) ) ) . ' — ' . $siunt . ( 1 === $siunt ? ' siunta' : ' siuntos' ) . ( $gal ? '' : ' · ' . ( $o->get_customer_note() ? 'yra kliento pastaba — atidaryk' : 'trūksta — atidaryk' ) ) . '</span>';
			}
			$bs = ''; foreach ( $r['takelis'] as $t ) { if ( $b && $t[4] && self::mygtukas( $t, $r )[0] === $b[0] ) { $bs = $t[3] ? $t[3] : $r['riba_s']; break; } }
			if ( $bs && ! $r['uzdarytas'] && empty( $b[4] ) ) { list( $rk, $rt ) = self::riba_tekstas( $bs ); if ( $rt ) { echo '<br><span class="dl-riba dl-riba-' . esc_attr( $rk ) . ' maz">' . esc_html( $rt ) . '</span>'; } }
			echo '</td></tr>';
		}
		echo '</tbody></table>';
		if ( 'surinkti' === $eile ) {
			$lap = array(); $lip = array(); foreach ( $rows as $r ) { if ( empty( $r['dalys']['av']['lapas'] ) && empty( $r['dalys']['av']['siunta'] ) ) { $lap[] = $r['id']; } elseif ( ! empty( $r['dalys']['av']['lapas'] ) && empty( $r['dalys']['av']['siunta'] ) && 'lp' !== $r['vez'] && ! $r['tiesiai'] ) { $lip[] = $r['id']; } }
			echo '<div class="dl-zingsniai-k" style="margin-top:10px">';
			if ( count( $lap ) > 1 ) { echo '<a class="v p" target="_blank" data-blank="1" href="' . esc_url( self::veiksmo_url( 'lapai', 0 ) . '&ids=' . implode( ',', $lap ) ) . '">Surinkti visus (' . count( $lap ) . ')</a>'; }
			if ( count( $lip ) > 1 ) { echo '<a class="v" href="' . esc_url( self::veiksmo_url( 'vp_bulk', 0 ) . '&ids=' . implode( ',', $lip ) ) . '" data-d="' . esc_attr( wp_json_encode( array( 'antraste' => 'Lipdukai visiems', 'tekstas' => 'Registruoti Venipak ' . count( $lip ) . ' AV siuntas (surinktas)? Siuntos registruojamos iš karto ir kainuoja.', 'ok' => 'Registruoti siuntas' ) ) ) . '">Lipdukai visiems (' . count( $lip ) . ')</a>'; }
			echo '</div>';
		}
	}

	protected static function dropship_grupes( $ids ) {
		if ( ! class_exists( 'Petshop_AV_Dropship' ) || ! $ids ) { return array(); }
		$r = new ReflectionMethod( 'Petshop_AV_Dropship', 'grupuoti' ); $r->setAccessible( true );
		return $r->invoke( null, array_values( array_unique( array_map( 'intval', $ids ) ) ) );
	}

	/** Lipduko PDF nuoroda (dropship variklio endpoint'as — veikia bet kuriam užsakymui su Venipak siunta). */
	protected static function lipduko_url( $id ) {
		return wp_nonce_url( admin_url( 'admin-post.php?action=ps_dropship_lipdukas&id=' . (int) $id ), 'ps_dropship_lipdukas' );
	}

	/** LAIŠKAI TIEKĖJAMS — kortelė per tiekėją (G1–G5, C4): 1 Lipdukai (n) → 2 Laiškas [T]; ZB: Kopijuoti · Lipdukas · Perduota. */
	protected static function laisku_korteles( $rows ) {
		$g = self::dropship_grupes( array_map( function ( $r ) { return $r['id']; }, $rows ) );
		if ( ! $g ) { echo '<div class="dl-tuscia">Laiškų tiekėjams nėra — viskas išsiųsta.</div>'; return; }
		$faktai = array(); foreach ( $rows as $r ) { $faktai[ $r['id'] ] = $r; }
		$ln = class_exists( 'Petshop_AV_Dropship' ) ? Petshop_AV_Dropship::laisko_nust() : array( 'tiekejui' => false, 'man' => true );
		$pastai = (array) get_option( 'ps_tiekeju_pastai', array() );
		$cia = self::url();
		uksort( $g, function ( $a, $b ) { $ra = self::riba( $a ); $rb = self::riba( $b ); return ( $ra ? $ra[2] : PHP_INT_MAX ) <=> ( $rb ? $rb[2] : PHP_INT_MAX ); } );
		foreach ( $g as $src => $uzs ) {
			$vardas = self::vardas( $src ); list( $rk, $rt ) = self::riba_tekstas( $src );
			$be = array(); $su = array(); $perreg = array();
			foreach ( $uzs as $oid => $u ) { $fx = $faktai[ $oid ] ?? null; $nr = $fx && ! empty( $fx['dalys'][ $src ]['nr'] ) ? $fx['dalys'][ $src ]['nr'] : array(); if ( $nr ) { $su[] = $oid; } else { $be[] = $oid; if ( $fx && self::d( 'turi_siunta', $fx['o'] ) ) { $perreg[] = $oid; } } }
			$ne_vp = array(); foreach ( $be as $oid_b ) { $fb = $faktai[ $oid_b ] ?? null; if ( $fb && ! in_array( $fb['vez'], array( 'venipak_kurjeris', 'venipak_pastomatas' ), true ) ) { $ne_vp[] = $oid_b; } }
			$be_paprasti = array_diff( $be, $perreg, $ne_vp );
			echo '<div class="dl-kortele dl-tk"><h2>Užsakyti iš ' . esc_html( $vardas ) . ' <span class="pilkas">· ' . count( $uzs ) . ' užs.' . ( $rt ? ' · <span class="dl-riba-' . esc_attr( $rk ) . '">' . esc_html( $rt ) . '</span>' : '' ) . '</span></h2>';
			echo '<table class="dl-tbl dl-tbl-k"><tbody>';
			foreach ( $uzs as $oid => $u ) {
				$fx = $faktai[ $oid ] ?? null; $nr = $fx && ! empty( $fx['dalys'][ $src ]['nr'] ) ? $fx['dalys'][ $src ]['nr'] : array();
				echo '<tr class="eil" data-id="' . (int) $oid . '"' . ( $fx ? ' data-sk="1"' : '' ) . '><td><label class="dl-cb"><input type="checkbox" class="dl-uzs-cb" data-form="dlf_' . esc_attr( $src ) . '" data-n="1" value="' . (int) $oid . '" checked title="Nuimk — šis užsakymas į laišką nepateks"></label><span class="nr">#' . esc_html( $u['nr'] ) . '</span>' . ( $fx && ! empty( $fx['naujas'] ) ? ' <b class="dl-nz" title="dar neatidarytas">N</b>' : '' ) . '<br><span class="pilkas maz">' . esc_html( $u['klientas'] ) . ' · ' . esc_html( $u['metodas'] ) . '</span></td><td>';
				$tsv = '';
				foreach ( $u['eilutes'] as $e ) { echo '<div>' . (int) $e['qty'] . '× ' . esc_html( $e['pav'] ) . ( 'zb' === $src && $e['zb'] ? ' <span class="pilkas maz">ZB ' . esc_html( $e['zb'] ) . '</span>' : ( $e['sku'] ? ' <span class="pilkas maz">' . esc_html( $e['sku'] ) . '</span>' : '' ) ) . '</div>'; $tsv .= ( $e['zb'] ?: $e['sku'] ) . "\t" . $e['qty'] . "\n"; }
				echo '</td><td class="d">';
				if ( $nr ) { echo '<span class="pilkas maz">✓ lipdukas ' . esc_html( implode( ', ', $nr ) ) . '</span> <a class="v t" href="' . esc_url( self::lipduko_url( $oid ) ) . '">Lipdukas</a>'; }
				else {
					$oo_r = $fx ? $fx['o'] : wc_get_order( $oid ); $vz = $fx ? $fx['vez'] : '';
					if ( $fx && ! in_array( $vz, array( 'venipak_kurjeris', 'venipak_pastomatas' ), true ) ) { echo '<span class="kel klaus"><i></i>ne Venipak pristatymas (' . esc_html( $u['metodas'] ) . ') — lipduko nebus</span>'; }
					else { echo '<span class="kel ts"><i></i>be lipduko</span>';
						$sv = self::d( 'uzsakymo_svoris', $oo_r ); $vp = (string) $oo_r->get_meta( 'venipak_pickup_point' );
						$dlg = array( 'antraste' => 'Užsakymas #' . $u['nr'] . ' · ' . $u['klientas'], 'tekstas' => 'Registruoti ' . $vardas . ' siuntą klientui? ' . ( $vp ? 'Paštomatas ' . $vp . ' (kiekviena dėžė — atskira siunta).' : 'Kurjeris: ' . wp_strip_all_tags( str_replace( '<br/>', ', ', $oo_r->get_formatted_shipping_address() ) ) . '.' ) . ' Svoris ' . ( $sv > 0 ? number_format( $sv, 1, ',', '' ) . ' kg' : 'nežinomas' ) . '. Siunta registruojama iš karto ir kainuoja.', 'ok' => 'Registruoti siuntą', 'opt' => array( 'vardas' => 'n', 'tekstas' => 'Dėžių', 'def' => Petshop_Desk::pakuociu( $oo_r ), 'tipas' => 'n' ) );
						echo ' <a class="v t" href="' . esc_url( self::dl_url( 'lipdukas', $oid, array( 'sandelis' => $src ) ) ) . '" data-d="' . esc_attr( wp_json_encode( $dlg ) ) . '">Lipdukas</a>'; }
				}
				if ( 'zb' === $src ) { echo ' <button type="button" class="v t dl-kopijuoti" data-tsv="' . esc_attr( $tsv ) . '">Kopijuoti</button>'; }
				echo '</td></tr>';
			}
			echo '</tbody></table>';
			$ids_csv = implode( ',', array_keys( $uzs ) );
			echo '<div class="dl-zingsniai-k">';
			if ( $be_paprasti ) { echo '<span class="zn">1</span><a class="v p" href="' . esc_url( self::veiksmo_url( 'vp_reg', 0, $cia ) . '&ids=' . implode( ',', $be_paprasti ) . '&sandelis=' . rawurlencode( $src ) ) . '">Lipdukai (' . count( $be_paprasti ) . ')</a>'; }
			else { echo '<span class="zn">1</span><span class="v" style="opacity:.6">Lipdukai ✓</span>'; }
			if ( 'zb' === $src ) {
				echo '<span class="zn">2</span><span class="pilkas maz">Suvesti į ZB — „Kopijuoti“ prie kiekvieno užsakymo</span>';
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="dl-inl" onsubmit="return confirm(\'Pažymėti ' . count( $uzs ) . ' ZB užsakymus suvestais? Tik kai suvesta į ZB ir lipdukai prikabinti.\')">' . wp_nonce_field( 'ps_dropship_zb_done', '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dropship_zb_done"><input type="hidden" name="uzsakymai" value="' . esc_attr( $ids_csv ) . '"><input type="hidden" name="ps_dl_g" value="' . esc_url( $cia ) . '"><span class="zn">3</span><button class="v' . ( $be ? '' : ' p' ) . '">Suvesta (' . count( $uzs ) . ')</button></form>';
			} else {
				$pp = class_exists( 'Petshop_AV_Tiekimas' ) ? Petshop_AV_Tiekimas::atvira_su_eilutemis( $src ) : null;
				$perz = class_exists( 'Petshop_AV_Dropship' ) ? Petshop_AV_Dropship::laisko_html( $src, $uzs, '', '' ) : '';
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="dl-inl dl-laiskas-f" id="dlf_' . esc_attr( $src ) . '">' . wp_nonce_field( 'ps_dropship_send', '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dropship_send"><input type="hidden" name="tiekejas" value="' . esc_attr( $src ) . '"><input type="hidden" name="uzsakymai" value="' . esc_attr( $ids_csv ) . '" class="dl-uzs-ids"><input type="hidden" name="ps_dl_g" value="' . esc_url( $cia ) . '"><input type="hidden" name="laisk_zyme" value="1">';
				echo '<span class="zn">2</span><button class="v' . ( $be ? '' : ' p' ) . '" type="submit"' . ( $be ? ' disabled title="pirma lipdukai"' : '' ) . ' data-tpl="Užsakyti iš ' . esc_attr( $vardas ) . ' (%n užs.)">Užsakyti iš ' . esc_html( $vardas ) . ' (' . count( $uzs ) . ' užs.)</button>';
				echo ' <button type="button" class="v t dl-perz">Peržiūrėti laišką</button>';
				echo '<div class="dl-laisko-nust"><label>Prierašas laiške <input type="text" name="pastaba" placeholder="pvz.: prašome pristatyti iki penktadienio"></label>';
				echo '<label><input type="checkbox" name="su_lipdukais" value="1" checked> lipdukai</label><label><input type="checkbox" name="su_manifestu" value="1" checked> kurjerio sąrašas</label>';
				echo '<label><input type="checkbox" name="laisk_tiekejui" value="1"' . checked( ! empty( $ln['tiekejui'] ), true, false ) . '> siųsti tiekėjui' . ( ! empty( $pastai[ $src ] ) ? ' (' . esc_html( $pastai[ $src ] ) . ')' : ' <span class="raud">— el. pašto nėra</span>' ) . '</label><label><input type="checkbox" name="laisk_man" value="1"' . checked( ! empty( $ln['man'] ), true, false ) . '> kopija man</label>';
				if ( $pp ) { echo '<label><input type="checkbox" name="su_partija" value="' . (int) $pp['part']->id . '" checked> + į AV (užsakymas tiekėjui #' . (int) $pp['part']->id . ', ' . count( $pp['eilutes'] ) . ' prek.) tame pačiame užsakyme</label>'; }
				else { echo '<span class="pilkas">+ į AV: iš ' . esc_html( $vardas ) . ' į AV šiuo metu nieko neužsakom (jei „Laukiam iš tiekėjų“ yra ' . esc_html( $vardas ) . ' prekių — ten „Kartu su Dropshipping“)</span>'; }
				echo '</div><div class="dl-perz-t" style="display:none">' . $perz . '</div></form>';
			}
			echo '</div>';
			if ( $be ) { echo '<p class="pastaba">Pirma lipdukai visiems šio tiekėjo užsakymams, tada vienas užsakymas tiekėjui su lipdukais.</p>'; }
			echo '</div>';
		}
	}

	/** LAUKIAM IŠ TIEKĖJŲ — kortelė per tiekėją: „Gauta“ užsakytiems užsakymams tiekėjui (H3) ir „Užsakyti iš [T] į AV“ (H1/H2, G4) čia pat. */
	protected static function laukiam_korteles( $rows, $ds = array() ) {
		global $wpdb; $tk = class_exists( 'Petshop_AV_Tiekimas' );
		$g = array(); $faktai = array();
		foreach ( $rows as $r ) { $faktai[ $r['id'] ] = $r; foreach ( $r['eil'] as $e ) { if ( 'i_av' === $e['k'] && $e['src'] ) { $g[ $e['src'] ]['uzs'][ $r['id'] ][] = $e; } } }
		$uzsak = $tk ? $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_tiekimas WHERE busena='uzsakyta' ORDER BY id" ) : array();
		foreach ( (array) $uzsak as $p ) { $g[ $p->tiekejas ]['part'][] = $p; }
		if ( ! $g ) { echo '<div class="dl-tuscia">Nieko nelaukiam iš tiekėjų — viskas AV.</div>'; return; }
		uksort( $g, function ( $a, $b ) { $ra = self::riba( $a ); $rb = self::riba( $b ); return ( $ra ? $ra[2] : PHP_INT_MAX ) <=> ( $rb ? $rb[2] : PHP_INT_MAX ); } );
		$cia = self::url(); $prist = $tk ? Petshop_AV_Tiekimas::PRISTATYMAI : array();
		$ln = $tk ? Petshop_AV_Tiekimas::laisko_nust() : array( 'tiekejui' => false, 'man' => true ); $pastai = (array) get_option( 'ps_tiekeju_pastai', array() );
		$eil_td = function ( $oid, $fx ) { $o = $fx ? $fx['o'] : wc_get_order( $oid ); return '<td><span class="nr">#' . esc_html( $o ? $o->get_order_number() : $oid ) . '</span>' . ( $fx && ! empty( $fx['naujas'] ) ? ' <b class="dl-nz" title="dar neatidarytas">N</b>' : '' ) . '<br><span class="pilkas maz">' . esc_html( $o ? trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) : '' ) . '</span></td>'; };
		$tr_open = function ( $oid, $fx ) { return '<tr class="eil" data-id="' . (int) $oid . '"' . ( $fx ? ' data-sk="1"' : '' ) . '>'; };
		foreach ( $g as $src => $x ) {
			$vardas = self::vardas( $src ); $rank = $tk && Petshop_AV_Tiekimas::rankinis( $src ); list( $rk, $rt ) = self::riba_tekstas( $src );
			$n_uzs = count( $x['uzs'] ?? array() );
			echo '<div class="dl-kortele dl-tk"><h2>' . esc_html( $vardas ) . ' <span class="pilkas">· ' . $n_uzs . ' užs.' . ( $rt ? ' · <span class="dl-riba-' . esc_attr( $rk ) . '">' . esc_html( $rt ) . '</span>' : '' ) . '</span></h2>';

			/* ---- A. Užsakyta — laukiam → „Gauta“ ---- */
			foreach ( $x['part'] ?? array() as $p ) {
				$eil = Petshop_AV_Tiekimas::partijos_eilutes( (int) $p->id ); if ( ! $eil ) { continue; }
				$tsv = ''; $lip = ! empty( $p->venipak_pack ) ? admin_url( 'admin-post.php?action=ps_tiekimas_lipdukas&partija=' . (int) $p->id . '&_wpnonce=' . wp_create_nonce( 'ps_tiek_lip_' . $p->id ) ) : '';
				echo '<div class="dl-tk-blk"><h3>Užsakyta ' . esc_html( mysql2date( 'm-d H:i', $p->uzsakyta ) ) . ' <span class="pilkas">· užsakymas tiekėjui #' . (int) $p->id . ( isset( $prist[ $p->pristatymas ] ) ? ' · ' . esc_html( $prist[ $p->pristatymas ] ) : '' ) . ( $p->venipak_pack ? ' · siunta ' . esc_html( str_replace( ',', ', ', $p->venipak_pack ) ) . ' <a class="v t" href="' . esc_url( $lip ) . '" target="_blank">Lipdukas</a>' : '' ) . '</span></h3>';
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="dl-tk-f" onsubmit="return confirm(\'Gauta iš ' . esc_js( $vardas ) . '? Įvesti kiekiai pridedami į AV likutį. Užsakymai, kuriems viskas atvyko, eina į „Surinkti AV“; jei kiekis mažesnis — trūkumas lieka laukti naujame užsakyme tiekėjui.\')">' . wp_nonce_field( 'ps_dl_tiek_' . $src . '_' . (int) $p->id, '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dl_tiekimas"><input type="hidden" name="ka" value="priimti"><input type="hidden" name="tiekejas" value="' . esc_attr( $src ) . '"><input type="hidden" name="partija" value="' . (int) $p->id . '"><input type="hidden" name="ps_dl_g" value="' . esc_url( $cia ) . '">';
				echo '<table class="dl-tbl dl-tbl-k"><tbody>';
				foreach ( $eil as $e ) {
					$pr = wc_get_product( $e->product_id ); $pav = $pr ? $pr->get_name() : '#' . $e->product_id; $sku = $pr ? $pr->get_sku() : ''; $tsv .= $sku . "\t" . (int) $e->qty . "\t" . $pav . "\n";
					$oid = (int) $e->order_id; $fx = $oid ? ( $faktai[ $oid ] ?? null ) : null;
					echo $oid ? $tr_open( $oid, $fx ) . $eil_td( $oid, $fx ) : '<tr><td><span class="pilkas">į atsargas</span></td>';
					echo '<td><div>' . (int) $e->qty . '× ' . esc_html( $pav ) . ( $sku ? ' <span class="pilkas maz">' . esc_html( $sku ) . '</span>' : '' ) . '</div></td>';
					echo '<td class="d dl-tk-gauta"><label>Gauta <input type="number" min="0" name="gauta[' . (int) $e->id . ']" value="' . (int) $e->qty . '"></label> <label class="pilkas maz">galioja iki <input type="text" name="galioja[' . (int) $e->id . ']" placeholder="YYYY-MM" pattern="\d{4}-\d{2}" title="Neprivaloma — pildyk, kai prekė lieka sandėlyje"> <span class="pilkas maz">(jei lieka sandėlyje)</span></label></td></tr>';
				}
				echo '</tbody></table><div class="dl-zingsniai-k">';
				if ( $rank ) { echo '<button type="button" class="v t dl-kopijuoti" data-tsv="' . esc_attr( $tsv ) . '">Kopijuoti</button><span class="pilkas maz">sąrašas suvedimui į ' . esc_html( $vardas ) . ' sistemą</span>'; }
				echo '<button class="v p" type="submit">Gauta</button></div></form></div>';
			}

			/* ---- B. Užsakyti iš [T] į AV: kaupiama partija + dar nesudėtos „veža į AV“ eilutės ---- */
			$kaup = $tk ? Petshop_AV_Tiekimas::atvira_su_eilutemis( $src ) : null; $part = $kaup ? $kaup['part'] : null;
			$neuzs = array(); $sudeta = array();
			foreach ( $x['uzs'] ?? array() as $oid => $es ) { foreach ( $es as $e ) { if ( ! $e['b'] ) { $neuzs[ $oid ][] = $e; } elseif ( 'kaupiama' === $e['b']['busena'] ) { $sudeta[ $oid ][] = $e; } } }
			if ( $kaup || $neuzs ) {
				$ids = array_unique( array_merge( array_keys( $neuzs ), array_keys( $sudeta ) ) ); $n_prek = 0; $prev_eil = array(); $kg = 0.0; $be_svorio = 0;
				echo '<div class="dl-tk-blk"><h3>Užsakyti iš ' . esc_html( $vardas ) . ' į AV' . ( $part ? ' <span class="pilkas">· užsakymas tiekėjui #' . (int) $part->id . '</span>' : '' ) . '</h3>';
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="dl-inl dl-laiskas-f dl-tk-f" id="dlt_' . esc_attr( $src ) . '">' . wp_nonce_field( 'ps_dl_tiek_' . $src . '_' . ( $part ? (int) $part->id : 0 ), '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dl_tiekimas"><input type="hidden" name="tiekejas" value="' . esc_attr( $src ) . '"><input type="hidden" name="partija" value="' . ( $part ? (int) $part->id : 0 ) . '"><input type="hidden" name="ids" value="' . esc_attr( implode( ',', $ids ) ) . '" class="dl-uzs-ids"><input type="hidden" name="ps_dl_g" value="' . esc_url( $cia ) . '"><input type="hidden" name="laisk_zyme" value="1">';
				echo '<table class="dl-tbl dl-tbl-k"><tbody>';
				foreach ( $ids as $oid ) {
					$fx = $faktai[ $oid ] ?? null; $es = array_merge( $neuzs[ $oid ] ?? array(), $sudeta[ $oid ] ?? array() );
					echo $tr_open( $oid, $fx ) . str_replace( '<td><span class="nr">', '<td><label class="dl-cb"><input type="checkbox" class="dl-uzs-cb" data-form="dlt_' . esc_attr( $src ) . '" data-n="' . count( $es ) . '" value="' . (int) $oid . '" checked title="Nuimk — šio užsakymo prekės į užsakymą tiekėjui nepateks"></label><span class="nr">', $eil_td( $oid, $fx ) ) . '<td>';
					foreach ( $es as $e ) { $n_prek++; $pr = wc_get_product( $e['pid'] ); $w = $pr ? (float) $pr->get_weight() : 0; if ( $w > 0 ) { $kg += $w * $e['q']; } else { $be_svorio++; } $prev_eil[] = (object) array( 'product_id' => $e['pid'], 'qty' => $e['q'] );
						echo '<div>' . (int) $e['q'] . '× ' . esc_html( $e['n'] ) . ( $e['sku'] ? ' <span class="pilkas maz">' . esc_html( $e['sku'] ) . '</span>' : '' ) . ' <span class="pilkas maz">· ' . esc_html( $e['b'] ? 'sudėta' : 'neužsakyta' ) . '</span></div>'; }
					echo '</td><td class="d"></td></tr>';
				}
				if ( $kaup ) { foreach ( $kaup['eilutes'] as $e ) { if ( $e->order_id ) { continue; } $n_prek++; $pr = wc_get_product( $e->product_id ); $w = $pr ? (float) $pr->get_weight() : 0; if ( $w > 0 ) { $kg += $w * $e->qty; } else { $be_svorio++; } $prev_eil[] = $e;
					echo '<tr><td><span class="pilkas">į atsargas</span></td><td><div>' . (int) $e->qty . '× ' . esc_html( $pr ? $pr->get_name() : '#' . $e->product_id ) . ( $pr && $pr->get_sku() ? ' <span class="pilkas maz">' . esc_html( $pr->get_sku() ) . '</span>' : '' ) . '</div></td><td class="d"></td></tr>'; } }
				echo '</tbody></table><div class="dl-zingsniai-k">';
				$bud = $part ? (string) $part->pristatymas : '';
				echo '<div class="dl-tk-prist"><span class="pilkas maz">Kaip atkeliaus į AV:</span>';
				foreach ( $prist as $k => $v ) { echo '<label><input type="radio" name="pristatymas" value="' . esc_attr( $k ) . '"' . checked( $bud, $k, false ) . ' required> ' . esc_html( $v ) . '</label>'; }
				echo '<label class="pilkas maz">svoris <input type="number" step="0.1" min="0" name="svoris" value="' . esc_attr( $part && $part->svoris > 0 ? $part->svoris : '' ) . '" placeholder="' . esc_attr( $kg > 0 ? round( $kg, 1 ) : '' ) . '"> kg' . ( $be_svorio ? ' <span class="raud">(' . (int) $be_svorio . ' be svorio kataloge)</span>' : '' ) . '</label>';
				echo '<label class="pilkas maz">dėžių <input type="number" min="1" max="20" name="dezes" value="' . (int) max( 1, (int) ( $part->dezes ?? 1 ) ) . '"></label></div>';
				$patv = $rank ? 'Užsakyti iš ' . $vardas . ' į AV (' . $n_prek . ' prek.)? Laiško nebus — sąrašą suvesi į ' . $vardas . ' sistemą („Kopijuoti“ atsiras čia, kol prekės atvažiuos).' : 'Užsakyti iš ' . $vardas . ' į AV (' . $n_prek . ' prek.)? Laiškas išeina iš karto' . ( in_array( $bud, array( 'kurjeris', 'pastomatas' ), true ) ? ', siunta registruojama Venipak ir kainuoja' : '' ) . '. Prekės liks „Laukiam“, kol spausi „Gauta“.';
				$kartu = ! $rank && ! empty( $ds[ $src ] ); // Raimis 09-03: tiekėjui išeina TIK vienas laiškas — jei laukia Dropshipping užsakymų, prekės į AV keliauja jame (G4)
				if ( $kartu ) {
					echo '<button class="v p" type="submit" name="ka" value="kartu" data-tpl="Kartu su Dropshipping iš ' . esc_attr( $vardas ) . ' (%n prek.)">Kartu su Dropshipping iš ' . esc_html( $vardas ) . ' (' . $n_prek . ' prek.)</button>';
					echo '<span class="pilkas maz">Tiekėjui — vienas laiškas: prekės į AV išeina kartu su ' . (int) $ds[ $src ] . ' Dropshipping užs. Spausk čia, tada Dropshipping kortelėje „Užsakyti iš ' . esc_html( $vardas ) . '“.</span>';
				} else {
					echo '<button class="v p" type="submit" name="ka" value="uzsakyti" data-tpl="Užsakyti iš ' . esc_attr( $vardas ) . ' į AV (%n prek.)" onclick="return confirm(' . esc_attr( wp_json_encode( $patv ) ) . ')">Užsakyti iš ' . esc_html( $vardas ) . ' į AV (' . $n_prek . ' prek.)</button>';
				}
				if ( ! $rank && ! $kartu ) {
					echo ' <button type="button" class="v t dl-perz">Peržiūrėti laišką</button>';
					echo '<div class="dl-laisko-nust"><label><input type="checkbox" name="laisk_tiekejui" value="1"' . checked( ! empty( $ln['tiekejui'] ), true, false ) . '> siųsti tiekėjui' . ( ! empty( $pastai[ $src ] ) ? ' (' . esc_html( $pastai[ $src ] ) . ')' : ' <span class="raud">— el. pašto nėra</span>' ) . '</label><label><input type="checkbox" name="laisk_man" value="1"' . checked( ! empty( $ln['man'] ), true, false ) . '> kopija man</label></div>';
					$prev_part = (object) array( 'pristatymas' => $bud, 'dezes' => (int) max( 1, (int) ( $part->dezes ?? 1 ) ) );
					echo '<div class="dl-perz-t" style="display:none"><p>Laba diena,</p><p>prašome paruošti šias prekes.</p>' . Petshop_AV_Tiekimas::laisko_dalis( $prev_part, $prev_eil, '' ) . '<p>Ačiū,<br>UAB Avesa · petshop.lt<br>terra@petshop.lt</p></div>';
				}
				echo '</div></form></div>';
			}
			echo '</div>';
		}
	}

	/** PARUOŠTA — Avesa laukia kurjerio (Lipdukas PDF · siuntų sąrašas · Išsiųsta / Kurjeris paėmė viską) ir tiekėjai („[T] išsiuntė“). */
	protected static function paruostos_korteles( $rows ) {
		$av = array(); $tk = array();
		foreach ( $rows as $r ) { if ( ! empty( $r['dalys']['av']['siunta'] ) && empty( $r['dalys']['av']['issiusta'] ) ) { $av[] = $r; } foreach ( $r['tiesiai'] as $s ) { if ( ! empty( $r['dalys'][ $s ]['perduota'] ) && empty( $r['dalys'][ $s ]['issiusta'] ) ) { $tk[ $s ][] = $r; } } }
		$cia = self::url();
		if ( $av ) {
			$man = array(); foreach ( $av as $r ) { foreach ( ( class_exists( 'Petshop_Siuntos' ) ? Petshop_Siuntos::sarasas( $r['id'] ) : array() ) as $s ) { if ( ( 'av' === $s['sandelis'] || '' === $s['sandelis'] ) && ! empty( $s['manifest'] ) ) { $man[ $s['manifest'] ] = 1; } } }
			echo '<div class="dl-kortele"><h2>AV — supakuota, laukia kurjerio <span class="pilkas">· ' . count( $av ) . ' siunt.</span></h2><table class="dl-tbl dl-tbl-k"><tbody>';
			$visi = array();
			foreach ( $av as $r ) { $o = $r['o']; $visi[] = $r['id']; $kitos = array(); foreach ( $r['tiesiai'] as $s ) { if ( empty( $r['dalys'][ $s ]['issiusta'] ) ) { $kitos[] = self::vardas( $s ); } }
				echo '<tr class="eil" data-id="' . (int) $r['id'] . '" data-sk="1"><td><span class="nr">#' . esc_html( $o->get_order_number() ) . '</span>' . ( ! empty( $r['naujas'] ) ? ' <b class="dl-nz" title="dar neatidarytas">N</b>' : '' ) . '<br><span class="pilkas maz">' . esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ) . '</span></td><td>' . esc_html( self::d( 'vezejo_vardas', $o ) ) . '<br><span class="pilkas maz">' . esc_html( implode( ', ', $r['dalys']['av']['nr'] ) ) . ( Petshop_Desk::pakuociu( $o ) > 1 ? ' · ' . Petshop_Desk::pakuociu( $o ) . ' dėž.' : '' ) . ( $kitos ? ' · kita dalis: ' . esc_html( implode( ', ', $kitos ) ) : '' ) . '</span></td><td class="d">' . ( 'lp' !== $r['vez'] ? '<a class="v t" href="' . esc_url( self::lipduko_url( $r['id'] ) ) . '">Lipdukas</a> ' : '' ) . self::btn_html( self::mygtukas( array( 'issiusta', '', 'now', 'av', 'issiusta' ), $r ) ) . '</td></tr>'; }
			echo '</tbody></table><div class="dl-zingsniai-k">';
			echo '<a class="v p" href="' . esc_url( self::dl_url( 'issiusta', 0, array( 'ids' => implode( ',', $visi ), 'dalis' => 'av', 'sekimo' => 1 ) ) ) . '" data-d="' . esc_attr( wp_json_encode( array( 'antraste' => 'Kurjeris paėmė viską', 'tekstas' => 'Kurjeris paėmė visas ' . count( $visi ) . ' AV siuntas? Klientams išeina laiškai su sekimo numeriais; užsakymai, kurių visos siuntos išsiųstos, taps įvykdyti, kiti lauks tiekėjų.', 'ok' => 'Kurjeris paėmė viską' ) ) ) . '">Kurjeris paėmė viską</a>';
			foreach ( array_keys( $man ) as $m ) { echo '<a class="v t" href="' . esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=ps_desk_veiksmas&v=vp_manifestas&id=0&kodas=' . rawurlencode( $m ) ), 'ps_desk_vp_manifestas_0' ) ) . '" target="_blank">Kurjerio sąrašas</a>'; }
			echo '</div><p class="pastaba">Po kiekvienos siuntos klientui išeina laiškas su sekimo numeriu; kai išsiųstos visos — užsakymas įvykdytas.</p></div>';
		}
		foreach ( $tk as $s => $rs ) {
			echo '<div class="dl-kortele"><h2>' . esc_html( self::vardas( $s ) ) . ' — užsakyta, laukiam, kol išsiųs <span class="pilkas">· ' . count( $rs ) . ' užs.</span></h2><table class="dl-tbl dl-tbl-k"><tbody>';
			foreach ( $rs as $r ) { $o = $r['o']; $kitos = array(); foreach ( $r['dalys'] as $k2 => $p2 ) { if ( $p2 && $k2 !== $s && empty( $p2['issiusta'] ) ) { $kitos[] = self::vardas( $k2 ); } }
				echo '<tr class="eil" data-id="' . (int) $r['id'] . '" data-sk="1"><td><span class="nr">#' . esc_html( $o->get_order_number() ) . '</span><br><span class="pilkas maz">' . esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ) . '</span></td><td><span class="pilkas maz">užsakyta ' . esc_html( wp_date( 'm-d H:i', strtotime( $r['dalys'][ $s ]['kada'] ) ) ) . ( ! empty( $r['dalys'][ $s ]['nr'] ) ? ' · ' . esc_html( implode( ', ', $r['dalys'][ $s ]['nr'] ) ) : '' ) . ( $kitos ? ' · kita dalis: ' . esc_html( implode( ', ', $kitos ) ) : '' ) . '</span></td><td class="d">' . self::btn_html( self::mygtukas( array( 'issiusta', '', 'now', $s, 'issiusta' ), $r ) ) . '</td></tr>'; }
			echo '</tbody></table><p class="pastaba">Kai tiekėjas praneša, kad išsiuntė — pažymi; klientui išeina laiškas su sekimo numeriu.</p></div>';
		}
		if ( ! $av && ! $tk ) { echo '<div class="dl-tuscia">Čia tuščia.</div>'; }
	}

	/** Klausimai — kortelės su priežastimi ir aiškiais veiksmais (spec §7, C8). */
	protected static function klausimu_korteles( $rows ) {
		foreach ( $rows as $r ) {
			$o = $r['o']; $id = $r['id']; $sk = self::skydelis( $r ); $kl = $r['kl'];
			$tekstas = $kl; $pastaba = ''; $veiksmai = ''; $zyme = mb_strtolower( $kl ); $sumos_html = ''; $papild = ''; // v3.20: sumos „Siunta grįžta“ kortelėje; v3.21: $papild — forma po veiksmų
			$atsaukti = $sk['atsaukti'] ? '<a class="v t raud" href="' . esc_url( $sk['atsaukti']['u'] ) . '" data-d="' . esc_attr( wp_json_encode( $sk['atsaukti']['d'] ) ) . '">Atšaukti</a>' : '';
			$rasyti = $sk['mail'] ? '<a class="v t" href="mailto:' . esc_attr( $sk['mail'] ) . '?subject=' . rawurlencode( 'Užsakymas #' . $o->get_order_number() . ' — petshop.lt' ) . '">Parašyti klientui</a>' : '';
			$laukti = $sk['laukti'] ? '<a class="v" href="' . esc_url( $sk['laukti'] ) . '">Laukti</a>' : '';
			if ( 0 === strpos( $kl, 'Trūksta' ) ) {
				$kle = self::d( 'klausimo_eilutes', $o ); $d = array();
				foreach ( $kle as $x ) { $d[] = $x['pav'] . ' — reikia ' . $x['reikia'] . ', AV ' . ( $x['turi'] ? 'tik ' . $x['turi'] : 'nėra' ) . ( $x['tiek'] ? ', ' . self::vardas( $x['tiek'] ) . ' turi' : ', tiekėjo nėra' ); }
				$tekstas = 'Trūksta AV: ' . implode( '; ', $d ) . '.';
				$pastaba = 'Ką gali daryti: keisk kelią (tiekėjas siunčia klientui / veža į AV); užsakyk pats ir palik „Iš AV“, kai turėsi; parašyk klientui pakaitalą; arba atšauk. „Laukti“ tik pažymi — priminimo nebus.';
				$veiksmai = '<button class="v p" data-atidaryti="1">Rūšiuoti</button> ' . $laukti . ' ' . $rasyti . ' ' . $atsaukti;
			} elseif ( 0 === strpos( $kl, 'Prekė be sandėlio' ) ) {
				$be = array(); foreach ( $r['eil'] as $e ) { if ( '' === $e['k'] ) { $be[] = $e['q'] . '× ' . $e['n']; } }
				$tekstas = 'Nežinia iš kur siųsti: ' . implode( '; ', $be ) . ' — AV nėra, tiekėjo nėra.';
				$pastaba = 'Jei prekė yra AV — atidaryk ir pažymėk „Iš AV“ (likutis nenurašomas). Jei nėra — parašyk klientui pakaitalą arba atšauk.';
				$veiksmai = '<button class="v p" data-atidaryti="1">Rūšiuoti</button> ' . $rasyti . ' ' . $atsaukti;
			} elseif ( 0 === strpos( $kl, 'Mokėjimas' ) ) {
				$pastaba = 'Mokėjimas nepavyko (Paysera/bankas grąžino klaidą). Jei pinigai vis dėlto atėjo — „Pažymėti apmokėtu“; jei ne — parašyk klientui arba atšauk.';
				$veiksmai = self::btn_html( self::mygtukas( array( 'apmoketa', '', 'now', '', 'apmoketa' ), $r ) ) . ' ' . $rasyti . ' ' . $atsaukti;
			} elseif ( 0 === strpos( $kl, 'Siuntos' ) ) {
				// v3.16 (V14): klaida iš plugino meta lietuviškai; „Taisyti adresą“ atveria skydelį su forma; po išsaugojimo klaida nuimama, Klausimas dingsta, lipdukas iš naujo.
				if ( $sk['siuntos_klaida'] ) { $tekstas = 'Vežėjas siuntos nesukūrė: ' . $sk['siuntos_klaida'] . '.'; }
				$pastaba = 'Dažniausiai paštomatas nebegalioja arba adresas / pašto kodas neteisingas. „Taisyti adresą“ — pataisyk skydelyje ir išsaugok; klaida nusiims, tada registruok lipduką iš naujo.' . ( $sk['red'] ? '' : ' Redaguoti nebegalima (išsiųsta / uždaryta).' );
				$veiksmai = ( $sk['red'] ? '<button class="v p" data-atidaryti="1" data-redaguoti="1">Taisyti adresą</button> ' : '<button class="v p" data-atidaryti="1">Atidaryti</button> ' ) . $rasyti . ' ' . $atsaukti;
			} elseif ( 0 === strpos( $kl, 'Grąžink klientui' ) ) {
				// v3.19 (5 etapas #4): kiekis sumažintas / prekė išimta — pinigus grąžina darbuotojas rankomis; „Grąžinta“ nuima žymę. Galioja ir įvykdytam / atšauktam.
				$g = (array) ( $r['grazinti'] ?? array() ); $viso = 0.0; $d = array();
				foreach ( $g as $x ) { $viso += (float) ( $x['suma'] ?? 0 ); $d[] = substr( (string) ( $x['laikas'] ?? '' ), 5, 11 ) . ' ' . ( $x['kas'] ?? '' ) . ': ' . ( $x['ka'] ?? '' ) . ' (' . number_format( (float) ( $x['suma'] ?? 0 ), 2, ',', '' ) . ' €)'; }
				$tekstas = 'Grąžink klientui ' . number_format( $viso, 2, ',', '' ) . ' € rankomis (Paysera / pavedimu). ' . implode( '; ', $d ) . '.';
				$pastaba = 'Pinigų sistema negrąžina. Grąžink per Paysera arba pavedimu ir spausk „Grąžinta“ — Klausimas nusiims. Sąskaitą / kreditinę — rankomis, kol „Sąskaita“ nepadaryta.';
				$veiksmai = '<a class="v p" href="' . esc_url( self::dl_url( 'grazinta', $id ) ) . '" data-d="' . esc_attr( wp_json_encode( array( 'antraste' => sprintf( 'Užsakymas #%s · %s', $o->get_order_number(), $sk['suma'] ), 'tekstas' => 'Pinigai (' . number_format( $viso, 2, ',', '' ) . ' €) klientui jau grąžinti? Klausimas nusiims; sistema pinigų nejudina.', 'ok' => 'Grąžinta' ) ) ) . '">Grąžinta</a> <button class="v t" data-atidaryti="1">Atidaryti</button> ' . $rasyti . ' ' . $atsaukti;
			} elseif ( 0 === strpos( $kl, 'Klientas atsisako' ) ) {
				$pastaba = 'Klientas pateikė sutarties atsisakymą (14 d.). Atšauk užsakymą; pinigų grąžinimą ir kreditinę tvarkysi atskirai.';
				$veiksmai = $atsaukti . ' ' . $rasyti;
			} elseif ( ! empty( $r['veluoja'] ) || 0 === strpos( $kl, 'Tiekėjas vėluoja' ) ) {
				// v3.14 (V13): pagal dalis; užsakymas kartu Paruošta siųsti su „[T] išsiuntė“; dingsta pats, kai dalis pažymima išsiųsta — „Laukti“ nebesiūlomas.
				$tv = array(); foreach ( array_keys( (array) $r['veluoja'] ) as $s ) { $tv[] = self::vardas( $s ); }
				if ( $tv ) { $zyme = implode( ', ', $tv ) . ' vėluoja'; }
				$pastaba = 'Užsakyta iš ' . ( $tv ? implode( ', ', $tv ) : 'tiekėjo' ) . ' prieš 24+ val., siunta neišėjo. Paskambink; kai išsiųs — pažymėk „' . ( $tv ? $tv[0] : 'tiekėjas' ) . ' išsiuntė“ (Paruošta siųsti) arba Venipak sekimas pažymės pats — Klausimas dings pats.' . ( $sk['velavimas'] ? ' Jei užtruks — „Pranešti klientui apie vėlavimą“ (vienas laiškas).' : '' );
				$vel = $sk['velavimas'] ? '<a class="v t" href="' . esc_url( $sk['velavimas']['u'] ) . '" data-d="' . esc_attr( wp_json_encode( $sk['velavimas']['d'] ) ) . '">Pranešti klientui apie vėlavimą</a> ' : ''; // v3.15
				$veiksmai = '<button class="v p" data-atidaryti="1">Atidaryti</button> ' . $vel . $rasyti . ' ' . $atsaukti;
			} elseif ( 0 === strpos( $kl, 'Siunta grįžta' ) ) {
				// v3.17 (Raimis 09-04): dalinis — užraktų nebėra; sprendžia darbuotojas. Tik grįžusi dalis: „Siųsti iš naujo“ / „Atšaukti tik grįžusią dalį“ (kai yra kitų aktyvių dalių).
				$g = self::grizta( $o ); $d = array(); $kitos = array(); $av_aktyvi = ! empty( $r['dalys']['av'] ) && empty( $r['dalys']['av']['issiusta'] ) && empty( $r['dalys_atsaukta']['av'] );
				foreach ( $r['dalys'] as $dk => $dp ) { if ( $dp && ! isset( $g[ $dk ] ) ) { $kitos[] = self::vardas( $dk ) . ( ! empty( $dp['issiusta'] ) ? ' (išsiųsta)' : ' (dar ruošiama)' ); } }
				foreach ( $g as $dalis => $x ) { $pr = array(); foreach ( $r['eil'] as $e ) { if ( ! empty( $e['atsaukta'] ) ) { continue; } $ed = ( 'tiesiai' === $e['k'] && $e['src'] ) ? $e['src'] : 'av'; if ( $ed === $dalis ) { $pr[] = $e['q'] . '× ' . $e['n']; } } $d[] = 'siunta ' . $x['nr'] . ' (' . self::vardas( $dalis ) . ') — Venipak: „' . $x['t'] . '“ (' . $x['d'] . ')' . ( $pr ? '; prekės: ' . implode( ', ', $pr ) : '' ); }
				$tekstas = 'Vežėjas grąžina siuntą: ' . implode( '; ', $d ) . '.' . ( $kitos ? ' Kita dalis: ' . implode( ', ', $kitos ) . '.' : '' );
				// v3.20 (spec §12.5): suskaičiuotos sumos — darbuotojas neskaičiuoja.
				$sm = self::grizta_sumos( $r ); $graz_t = 'grąžinimą tvarkysi atskirai';
				if ( $sm ) {
					$graz_t = 'grąžink klientui ' . self::eur( $sm['grazinti'] ) . ' € rankomis (' . self::eur( $sm['sumoketa'] ) . ' − 3,99; Klausimas „Grąžink klientui pinigus“ primins)';
					$sumos_html = '<p class="dl-sumos">Klientui grąžink: <b>' . esc_html( self::eur( $sm['sumoketa'] ) . ' − 3,99 = ' . self::eur( $sm['grazinti'] ) ) . ' €</b> <span class="pilkas maz">(' . esc_html( $sm['baze'] ) . ')</span><br>Pakartotinis užsakymas: <b>' . esc_html( null === $sm['pakart'] ? 'įkainis + 3,99' : self::eur( $sm['ikainis'] ) . ' + 3,99 = ' . self::eur( $sm['pakart'] ) ) . ' €</b> <span class="pilkas maz">(' . esc_html( $sm['ikainis_t'] ) . '; siunčiama tik apmokėjus)</span></p>';
				}
				$tiek_griz = false; foreach ( $g as $dalis => $x ) { if ( 'av' !== $dalis ) { $tiek_griz = true; } }
				$av_issiusta_k = ! empty( $r['dalys']['av'] ) && ! empty( $r['dalys']['av']['issiusta'] ) && empty( $g['av'] );
				$kaip_is_naujo = ! $tiek_griz ? 'siunta ruošiama iš AV tuo pačiu adresu (Surinkti AV → naujas lipdukas)' : ( $av_aktyvi ? 'grįžusios prekės sujungiamos į AV siuntą (Surinkti AV → naujas lipdukas)' : ( $av_issiusta_k ? 'grįžusios prekės tampa nauja AV siunta (Surinkti AV → naujas lipdukas); jau išsiųstos AV prekės lieka klientui kaip išsiųstos — lape jos irgi bus, skydelyje pažymėtos „NEPAKUOK“' : 'grįžusios prekės tampa AV siunta (Surinkti AV → naujas lipdukas)' ) );
				$pastaba = 'Kai prekės grįš į AV, spręsk: „Siųsti iš naujo“ — ' . $kaip_is_naujo . ', klientui vėl išeis „Išsiųsta“; „' . ( $kitos ? 'Atšaukti tik grįžusią dalį' : 'Atšaukti — prekės grįžo į AV' ) . '“ — ' . ( $kitos ? 'atšaukiama tik ši dalis, prekės į AV likutį, kita dalis lieka kaip yra' : 'užsakymas atšaukiamas, prekės į AV likutį' ) . '. Pinigus grąžinsi rankomis' . ( $kitos ? ' (WC dalinis grąžinimas — rankomis)' : '' ) . '. Adresą taisyk „Redaguoti“ prieš naują lipduką.';
				$antr = sprintf( 'Užsakymas #%s · %s', $o->get_order_number(), $sk['suma'] );
				$b1 = '<a class="v p" href="' . esc_url( self::dl_url( 'grizta_is_naujo', $id ) ) . '" data-d="' . esc_attr( wp_json_encode( array( 'antraste' => $antr, 'tekstas' => 'Prekės jau AV? ' . ucfirst( $kaip_is_naujo ) . ', reikės naujo lipduko. Klientui laiškas išeis, kai kurjeris paims.' . ( $kitos ? ' Kita dalis lieka kaip yra.' : '' ), 'ok' => 'Siųsti iš naujo' ) ) ) . '">Siųsti iš naujo</a> ';
				$b2 = '<a class="v t raud" href="' . esc_url( self::dl_url( 'grizta_atsaukti', $id ) ) . '" data-d="' . esc_attr( wp_json_encode( array( 'antraste' => $antr, 'tekstas' => $kitos ? 'Prekės jau AV? Atšaukiama TIK grįžusi dalis: jos prekės pridedamos į AV likutį, kita dalis (' . implode( ', ', $kitos ) . ') lieka kaip yra. Pinigai NEGRĄŽINAMI automatiškai — ' . $graz_t . '. Klientui laiškas nesiunčiamas.' : 'Prekės jau AV? Užsakymas bus atšauktas, prekės pridėtos į AV likutį. Pinigai NEGRĄŽINAMI automatiškai — ' . $graz_t . '. Klientui laiškas nesiunčiamas.', 'ok' => $kitos ? 'Atšaukti tik grįžusią dalį' : 'Atšaukti — prekės grįžo į AV' ) ) ) . '">' . ( $kitos ? 'Atšaukti tik grįžusią dalį' : 'Atšaukti — prekės grįžo į AV' ) . '</a> ';
				// v3.21 (Raimis 09-05): „Siųsti iš naujo“ — tik apmokėjus pakartotinį užsakymą (arba „Be mokesčio“); kitaip — „Pakartotinis užsakymas“ (forma kortelėje) / būsena „laukia apmokėjimo“.
				$pk = self::pakartotinis_bukle( $o ); $pk_html = ''; $pk_forma = ''; $bp = '';
				if ( $pk ) { $pk_html = '<p class="dl-sumos dl-pk">' . esc_html( $pk['t'] ) . ( 'laukia' === $pk['b'] ? ' <a class="pilkas maz" href="' . esc_url( self::dl_url( 'pakart_nuoroda', $id ) ) . '" data-d="' . esc_attr( wp_json_encode( array( 'antraste' => $antr, 'tekstas' => 'Išsiųsti klientui (' . $o->get_billing_email() . ') apmokėjimo nuorodą dar kartą? Užsakymas #' . $pk['nr'] . ', ' . $pk['suma'] . ' €.', 'ok' => 'Siųsti' ) ) ) . '">siųsti nuorodą dar kartą</a>' : '' ) . '</p>'; }
				$gal_is_naujo = $pk && in_array( $pk['b'], array( 'apmoketa', 'nemokamai' ), true );
				$bpv = ( $pk && 'laukia' === $pk['b'] ) ? '<a class="v t" href="' . esc_url( self::dl_url( 'pakart_apmoketa', $id ) ) . '" data-d="' . esc_attr( wp_json_encode( array( 'antraste' => $antr, 'tekstas' => 'Pavedimas ' . $pk['suma'] . ' € už pakartotinį užsakymą #' . $pk['nr'] . ' jau banke? Užsakymas pažymimas apmokėtu, išrašoma PVM sąskaita, klientui išeina laiškas „apmokėjimas gautas“ — atsiras „Siųsti iš naujo“.', 'ok' => 'Apmokėta pavedimu' ) ) ) . '">Apmokėta pavedimu</a> ' : ''; // v3.23
				if ( ! $pk && ! $sk['uzdarytas'] ) {
					$bp = '<button type="button" class="v p dl-pk-b">Pakartotinis užsakymas</button> ';
					$pk_forma = '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="dl-pk-f" style="display:none">' . wp_nonce_field( 'ps_dl_pakart_' . $id, '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dl_pakartotinis"><input type="hidden" name="id" value="' . (int) $id . '"><input type="hidden" name="g" value="' . esc_attr( self::url( array( 'eile' => 'klausimai', 'view' => null, 'q' => null, 'b' => null, 'atidaryti' => null ) ) ) . '"><input type="hidden" name="ka" value="">'
						. '<label>Suma <input type="number" name="suma" step="0.01" min="0.5" max="200" value="' . esc_attr( $sm && null !== $sm['pakart'] ? number_format( (float) $sm['pakart'], 2, '.', '' ) : '' ) . '"> €</label> <label class="pilkas maz">' . esc_html( $sm && null !== $sm['pakart'] ? self::eur( $sm['ikainis'] ) . ' + 3,99 — taisyk, jei reikia' : 'įkainis + 3,99 — įrašyk' ) . '</label> <button type="button" class="v p dl-pk-s">Sukurti ir siųsti nuorodą</button> <button type="button" class="v t dl-pk-n" title="Tik kai nepristatyta dėl mūsų ar vežėjo kaltės">Be mokesčio</button> <a href="#" class="pilkas maz dl-pk-x">atgal</a></form>';
				}
				$sumos_html .= $pk_html;
				$veiksmai = ( $gal_is_naujo ? $b1 : $bp . $bpv ) . $b2 . '<button class="v t" data-atidaryti="1">Atidaryti</button> ' . $rasyti; $papild = $pk_forma;
			} elseif ( 0 === strpos( $kl, 'LP negalimas' ) ) {
				$pastaba = 'LP Express galimas tik iš AV. Keisk ne-AV prekių kelią į „Iš AV“ / „veža į AV“ (pristatymo keitimas į Venipak čia dar nepadarytas — parašyk Raimiui).';
				$veiksmai = '<button class="v p" data-atidaryti="1">Rūšiuoti</button> ' . $rasyti . ' ' . $atsaukti;
			} else {
				$veiksmai = '<button class="v p" data-atidaryti="1">Atidaryti</button> ' . $laukti . ' ' . $rasyti . ' ' . $atsaukti;
			}
			printf( '<div class="dl-kortele eil" data-id="%d" data-sk="1"><h2>#%s · %s · %s <span class="kel klaus"><i></i>%s</span></h2><p>%s</p>%s%s<p class="dl-veiksmai">%s</p>%s%s</div>',
				$id, esc_html( $o->get_order_number() ), esc_html( $sk['kl'] ), esc_html( $sk['suma'] ), esc_html( $zyme ), esc_html( $tekstas ), $sumos_html,
				$pastaba ? '<p class="pastaba">' . esc_html( $pastaba ) . '</p>' : '', $veiksmai, $o->get_meta( '_ps_klaus_laukti' ) ? '<p class="pilkas maz">Pažymėta laukti ' . esc_html( $o->get_meta( '_ps_klaus_laukti' ) ) . '</p>' : '', $papild );
		}
	}

	protected static function skydelio_html() {
		?>
		<div class="uzdanga" id="dlUzd"></div>
		<aside class="skydas" id="dlSk" aria-hidden="true">
			<header><div><h2 id="skNr"></h2><div class="pilkas maz" id="skKl"></div></div><button class="uzdaryti" id="skUzd" title="Uždaryti (Esc)">×</button></header>
			<div class="kunas">
				<div class="pastaba" id="skPastaba"></div>
				<div class="dl-klaus" id="skKlaus" style="display:none"></div>
				<div id="skEil"></div>
				<div class="blokas"><b>Pristatymas</b><div id="skPr"></div></div>
				<div class="blokas" id="skSiunta" style="display:none"><b>AV siunta</b><div id="skSiuntaT"></div></div>
				<div class="blokas" id="skPast" style="display:none"><b>Kliento pastaba</b><div id="skPastT"></div></div>
				<div class="blokas"><b>Istorija</b><div class="zurnalas" id="skZur"></div></div>
			</div>
			<footer id="skV"></footer>
		</aside>
		<?php
	}

	/** RYTINĖ EIGA be užrakto (D1/D2, spec §7): žingsniai pagal ribas, gyvi skaičiai, kiekvienas veda į eilę. */
	protected static function rytas( $atviri, $c ) {
		global $wpdb;
		$lip_av = 0; foreach ( $atviri as $r ) { if ( in_array( 'surinkti', $r['eiles'], true ) && ! empty( $r['dalys']['av']['lapas'] ) ) { $lip_av++; } }
		$gav = class_exists( 'Petshop_AV_Tiekimas' ) ? (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}ps_tiekimas WHERE busena='uzsakyta'" ) : 0;
		$tiek = array(); foreach ( $atviri as $r ) { if ( in_array( 'laiskai', $r['eiles'], true ) ) { foreach ( $r['tiesiai'] as $s ) { if ( empty( $r['dalys'][ $s ]['perduota'] ) ) { $tiek[ $s ] = ( $tiek[ $s ] ?? 0 ) + 1; } } } }
		uksort( $tiek, function ( $a, $b ) { $ra = self::riba( $a ); $rb = self::riba( $b ); return ( $ra ? $ra[2] : PHP_INT_MAX ) <=> ( $rb ? $rb[2] : PHP_INT_MAX ); } );
		$tiek_t = array(); foreach ( $tiek as $s => $n ) { list( , $rt ) = self::riba_tekstas( $s ); $tiek_t[] = self::vardas( $s ) . ' ' . $n . ( $rt ? ' (' . $rt . ')' : '' ); }
		list( , $r_av ) = self::riba_tekstas( 'av' ); list( , $r_lp ) = self::riba_tekstas( 'lp' );
		$Z = array(
			array( 'Išrūšiuoti naujus', $c['nauji'], 'AV + tiekėjas arba trūkumas — iš kur važiuos kiekviena prekė; aiškius sistema išrūšiavo pati.', 'nauji', 'Rūšiuoti' ),
			array( 'Dropshipping — lipdukai ir užsakymai tiekėjams', $c['laiskai'], $tiek_t ? implode( ' · ', $tiek_t ) : 'kortelė per tiekėją: 1 Lipdukai → 2 Užsakyti', 'laiskai', 'Atidaryti' ),
			array( 'Užsakyti iš tiekėjų į AV', $c['laukiam'], 'kas neužsakyta — „Užsakyti iš … į AV“ čia pat; kas užsakyta — laukiam', 'laukiam', 'Atidaryti' ),
			array( 'Surinkti AV', $c['surinkti'], 'visos AV siuntos prekės vietoje — lapai (galima visus vienu lapu)', 'surinkti', 'Surinkti' ),
			array( 'Lipdukai AV siuntoms', $lip_av, 'surinkta, be lipduko · Venipak ' . $r_av . ' · LP Express ' . $r_lp . ' (LP lipdukas — dar per seną eigą, formavimas iškviečia kurjerį)', 'surinkti', 'Lipdukai' ),
			array( 'Kurjeris paėmė / tiekėjai išsiuntė', $c['paruosta'], 'po kiekvienos siuntos klientui išeina laiškas', 'paruosta', 'Atidaryti' ),
			array( 'Gavimai', $gav, 'užsakymai tiekėjams, kurie atvažiavo — „Gauta“ eilėje „Laukiam iš tiekėjų“', 'laukiam', 'Atidaryti' ),
			array( 'Klausimai', $c['klausimai'], 'reikia tavo sprendimo', 'klausimai', 'Atidaryti' ),
		);
		echo '<main class="dl-main"><h1 class="dl-h1">Rytinė eiga <small>' . esc_html( wp_date( 'l · H:i' ) ) . ' · eik per žingsnius iš viršaus žemyn — sąrašas gyvas, nauji užsakymai atsiranda patys, užrakto nėra</small></h1><div class="dl-zs">';
		foreach ( $Z as $i => $z ) {
			$url = self::url( array( 'eile' => $z[3], 'view' => null, 'q' => null, 'b' => null ) );
			$n = (int) $z[1];
			printf( '<div class="dl-z%s"><div class="zn">%d</div><div class="zt"><b>%s</b><span class="pilkas">%s</span></div>%s</div>', $n ? '' : ' tuscias', $i + 1, esc_html( $z[0] ), esc_html( $n ? $n . ' užs. — ' . $z[2] : '✓ tuščia' ), $n ? '<a class="v p" href="' . esc_url( $url ) . '">' . esc_html( $z[4] ) . '</a>' : '' );
		}
		echo '</div><p class="dl-paaisk">Tvarka pagal laikus: ZB, Prins, Belacor, Quattro iki 09:00; Ambrosia 10:00; AV iki 11:00; VF ir LP iki 13:00. Ryte pradedi nuo viršaus; dieną grįžti į tą žingsnį, kur atsirado skaičius.</p>';
		if ( current_user_can( 'manage_woocommerce' ) ) { echo '<p class="dl-paaisk"><a href="' . esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&senas=1&view=rytas' ) ) . '">Senoji eiga (LP Express lipdukai)</a> — tik iki T-0 LP testo.</p>'; }
		echo '</main>';
	}

	protected static function dialogas() {
		?>
		<div class="dl-shade" id="dlShade"></div>
		<div class="dl-dlg" id="dlDlg" role="dialog" aria-modal="true"><h3 id="dlDlgH"></h3><p id="dlDlgT"></p>
			<label id="dlDlgOptL" class="dl-opt"><input type="checkbox" id="dlDlgOpt"><input type="number" id="dlDlgN" min="1" max="20" style="display:none;width:60px;font:inherit;border:1px solid var(--linija);border-radius:5px;padding:3px 6px"> <span id="dlDlgOptT"></span></label>
			<div class="dl-dlg-b"><button class="v" id="dlDlgNo" type="button">Atšaukti</button><a class="v p" id="dlDlgOk" href="#">Gerai</a></div></div>
		<?php
	}

	protected static function stilius() {
		?>
<style id="dl-css">
.dl{--fonas:#EEF1EF;--popierius:#fff;--rasalas:#1B2620;--pilka:#66716B;--linija:#D7DDD9;--zalia:#2E7D4F;--zalia-s:#E3F1E8;--melyna:#2B5F8A;--melyna-s:#E2ECF5;--gintaras:#B9731A;--gintaras-s:#FBEFD9;--raudona:#B23A3A;--raudona-s:#F8E3E3;
 color:var(--rasalas);font:14px/1.45 "IBM Plex Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.dl *{box-sizing:border-box}.dl button{font:inherit;cursor:pointer}.dl a{color:var(--melyna);text-decoration:none}.dl a:hover{text-decoration:underline}.dl :focus-visible{outline:2px solid var(--melyna);outline-offset:2px}
.dl-main{padding:14px 24px 80px;max-width:1280px}
.dl-h1{font-size:20px;font-weight:600;margin:6px 0 12px;display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}.dl-h1 small{font-weight:400;color:var(--pilka);font-size:14px}
.dl .pilkas{color:var(--pilka)}.dl .maz{font-size:12px}.dl .raud{color:var(--raudona)}.dl .nr{font-weight:600}
.dl-legenda{display:flex;gap:14px;align-items:center;margin:0 0 14px;font-size:13px;color:var(--pilka);flex-wrap:wrap}
.dl .kel{display:inline-flex;align-items:center;gap:5px;border-radius:4px;padding:2px 7px;font-size:12px;font-weight:600;white-space:nowrap}
.dl .kel.sandelis{background:var(--zalia-s);color:var(--zalia)}.dl .kel.tk{background:var(--melyna-s);color:var(--melyna)}.dl .kel.ts{background:var(--gintaras-s);color:var(--gintaras)}.dl .kel.klaus{background:var(--raudona-s);color:var(--raudona)}
.dl .kel i{width:7px;height:7px;border-radius:50%;background:currentColor;display:inline-block}
.dl-eiles{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;align-items:center}.dl-e{border:1px solid var(--linija);background:var(--popierius);border-radius:20px;padding:5px 12px;display:inline-flex;gap:7px;align-items:center;color:var(--pilka)}.dl-e:hover{text-decoration:none;border-color:var(--pilka)}.dl-e.on{border-color:var(--rasalas);color:var(--rasalas);font-weight:600}
.dl .sk{min-width:20px;height:18px;padding:0 6px;border-radius:10px;background:var(--fonas);color:var(--pilka);font-size:11px;font-weight:600;display:inline-flex;align-items:center;justify-content:center}
.dl .sk.z{background:var(--zalia-s);color:var(--zalia)}.dl .sk.m{background:var(--melyna-s);color:var(--melyna)}.dl .sk.g{background:var(--gintaras-s);color:var(--gintaras)}.dl .sk.r{background:var(--raudona-s);color:var(--raudona)}
.dl-senas{margin-left:auto;font-size:12px;color:var(--pilka)}
.dl-f-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:0 0 10px}.dl-chips{display:flex;gap:4px;flex-wrap:wrap}.dl-chip{padding:3px 10px;border:1px solid var(--linija);border-radius:14px;font-size:12px;color:var(--pilka);background:#fff}.dl-chip.on{background:var(--rasalas);color:#fff;border-color:var(--rasalas)}.dl-chip:hover{text-decoration:none}
.dl-f{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:12px}.dl-f select{font:inherit;font-size:12px;border:1px solid var(--linija);border-radius:5px;padding:2px 6px;background:#fff;color:var(--pilka);max-width:200px;height:26px}.dl-x{font-size:12px}
.dl-tbl{width:100%;border-collapse:collapse;background:var(--popierius);border:1px solid var(--linija);border-radius:8px;overflow:hidden}
.dl-tbl th{font-weight:500;color:var(--pilka);text-align:left;padding:9px 12px;border-bottom:1px solid var(--linija);font-size:12px}.dl-tbl td{padding:10px 12px;border-bottom:1px solid var(--linija);vertical-align:top}.dl-tbl tr:last-child td{border-bottom:0}.dl-tbl tr.eil:hover td{background:#FAFBFA;cursor:pointer}.dl-tbl tr.eil.on td{background:#F3F7F4}
.dl-tbl td.d{text-align:right;white-space:nowrap}.dl-it{margin:1px 0}
.dl-pill{display:inline-block;margin-top:3px;padding:1px 7px;border-radius:10px;font-size:11px;font-weight:500}.dl-pill-e{background:var(--fonas);color:var(--pilka)}
.dl-note{margin-top:5px;font-size:12.5px;background:var(--gintaras-s);color:#7a4b00;padding:4px 8px;border-radius:5px}.dl-note-r{background:var(--raudona-s);color:var(--raudona);font-weight:600}tr.eil.dl-demesys td:first-child{box-shadow:inset 4px 0 0 var(--raudona)}tr.eil.dl-demesys{background:#fff5f5}
.dl .v{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--linija);background:var(--popierius);border-radius:6px;padding:6px 12px;font-weight:500;white-space:nowrap;color:var(--rasalas);line-height:1.2}.dl .v.p{background:var(--zalia);border-color:var(--zalia);color:#fff}.dl .v.p:hover{background:#25683F;text-decoration:none}.dl .v:hover{border-color:var(--rasalas);text-decoration:none}.dl .v.t{border:0;color:var(--melyna);padding:6px 4px}.dl .v.bad{background:var(--raudona);border-color:var(--raudona);color:#fff}.dl .v.raud{color:var(--raudona)}.dl .v[disabled]{opacity:.45;cursor:default}
.dl td.d .v{white-space:normal;text-align:center;max-width:170px}
.dl-riba{display:inline-block;margin-top:4px;color:var(--pilka)}.dl-riba-skuba{color:var(--raudona);font-weight:600}.dl-riba-praejo{opacity:.6}
.dl .takelis{margin-top:6px;font-size:12px;display:flex;flex-wrap:wrap;align-items:center;gap:4px}.dl .takelis span{padding:1px 7px;border-radius:9px;background:var(--fonas);color:var(--pilka)}.dl .takelis span.done{background:var(--zalia-s);color:var(--zalia)}.dl .takelis span.now{background:var(--rasalas);color:#fff;font-weight:600}.dl .takelis span.wait{background:var(--gintaras-s);color:var(--gintaras)}.dl .takelis span.bad{background:var(--raudona-s);color:var(--raudona);font-weight:600}.dl .takelis i{color:var(--linija);font-style:normal}
.dl-naujas{font-size:10.5px;padding:1px 6px;vertical-align:middle}.dl-siandien{color:var(--zalia);font-weight:600}
.dl-tbl-k{border:0;border-radius:0;margin:6px 0 10px}.dl-tbl-k td{padding:8px 6px}.dl-zingsniai-k{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.dl-zingsniai-k .zn{width:22px;height:22px;border-radius:50%;background:var(--zalia-s);color:var(--zalia);display:inline-flex;align-items:center;justify-content:center;font-weight:600;font-size:12px;flex:none}
.dl-inl{display:contents}.dl-laisko-nust{flex-basis:100%;display:flex;gap:14px;flex-wrap:wrap;align-items:center;font-size:12.5px;color:var(--pilka);margin-top:4px}.dl-psl{display:flex;gap:14px;align-items:center;justify-content:center;padding:12px 0}
.dl-cb{display:inline-block;margin-right:6px;vertical-align:middle}.dl-cb input{margin:0}
.dl-tk-blk{border-top:1px solid var(--linija);padding-top:10px;margin-top:10px}.dl-tk-blk h3{margin:0 0 6px;font-size:14px;font-weight:600;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.dl-tk-blk .dl-tbl-k{margin-bottom:8px}
.dl-tk-prist{flex-basis:100%;display:flex;gap:12px;flex-wrap:wrap;align-items:center;font-size:12.5px;margin-bottom:4px}.dl-tk-prist input[type=number]{width:64px;font:inherit;border:1px solid var(--linija);border-radius:5px;padding:2px 6px}
.dl-tk-gauta input[type=number]{width:60px;font:inherit;border:1px solid var(--linija);border-radius:5px;padding:2px 6px}.dl-tk-gauta input[type=text]{width:86px;font:inherit;border:1px solid var(--linija);border-radius:5px;padding:2px 6px}
.dl-laisko-nust input[type=text]{font:inherit;border:1px solid var(--linija);border-radius:5px;padding:3px 8px;min-width:280px}
.dl-perz-t{flex-basis:100%;background:var(--fonas);border-radius:8px;padding:10px 14px;margin-top:8px;font-size:13px;overflow:auto;max-height:420px}.dl .takelis small{font-size:10px;opacity:.7}
.dl-zs{display:flex;flex-direction:column;gap:8px;max-width:860px}.dl-z{display:flex;gap:14px;align-items:center;background:var(--popierius);border:1px solid var(--linija);border-radius:8px;padding:12px 14px}.dl-z.tuscias{opacity:.55}.dl-z .zn{width:26px;height:26px;border-radius:50%;background:var(--zalia-s);color:var(--zalia);display:flex;align-items:center;justify-content:center;font-weight:600;flex:none}.dl-z.tuscias .zn{background:var(--fonas);color:var(--pilka)}.dl-z .zt{flex:1}.dl-z .zt b{display:block}
.dl-siand{margin:0 24px;padding:8px 12px;background:var(--zalia-s);border:1px solid #c9e2d3;border-radius:8px;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;font-size:13px}.dl-siand>b{color:var(--zalia)}.dl-siand-u{display:inline-flex;gap:6px;align-items:center;color:var(--rasalas);padding:3px 8px;border-radius:6px;background:#fff;border:1px solid var(--linija)}.dl-siand-u:hover{text-decoration:none;border-color:var(--zalia)}.dl-kur{color:var(--zalia)}
.dl-paprasta th:first-child{width:34%}.dl-paprasta td{padding:11px 12px}.dl-f-tog{font-size:12px;color:var(--pilka)}.dl-f-tog.on{color:var(--zalia);font-weight:600}.dl-f-wrap{margin-top:6px}
.dl-n .nr{font-weight:700}.dl-nz{display:inline-block;background:var(--rasalas);color:#fff;font-size:10px;padding:0 5px;border-radius:3px;vertical-align:middle;margin-left:2px}
.dl-b{display:inline-block;padding:2px 8px;border-radius:10px;font-size:12px;font-weight:600}.b-red{background:var(--raudona-s);color:var(--raudona)}.b-amber{background:var(--gintaras-s);color:var(--gintaras)}.b-blue{background:var(--melyna-s);color:var(--melyna)}.b-green{background:var(--zalia-s);color:var(--zalia)}.b-grey{background:var(--fonas);color:var(--pilka)}
.dl-row-b-red td{background:#fbeeee}.dl-row-b-amber td{background:#fdf5e6}.dl-row-b-blue td{background:#eef3fb}.dl-row-b-green td{background:#eaf5ee}.dl-row-b-grey td{background:#f3f4f3;color:var(--pilka)}
.dl-row-b-red td:first-child{box-shadow:inset 4px 0 0 var(--raudona)}.dl-row-b-amber td:first-child{box-shadow:inset 4px 0 0 var(--gintaras)}.dl-row-b-blue td:first-child{box-shadow:inset 4px 0 0 var(--melyna)}.dl-row-b-green td:first-child{box-shadow:inset 4px 0 0 var(--zalia)}.dl-row-b-grey td:first-child{box-shadow:inset 4px 0 0 #b9bdb9}
.dl-img-s{width:28px;height:28px;object-fit:contain;border:1px solid var(--linija);border-radius:4px;background:#fff;vertical-align:middle;margin-right:1px}.dl-img{width:44px;height:44px;object-fit:contain;border:1px solid var(--linija);border-radius:5px;background:#fff;flex:none;margin-right:8px}.dl-img-n{display:inline-block;background:var(--fonas)}
.dl-tuscia{background:var(--popierius);border:1px dashed var(--linija);border-radius:8px;padding:28px;text-align:center;color:var(--pilka)}.dl-paaisk{color:var(--pilka);font-size:13px;margin-top:10px}
.dl-kortele{background:var(--popierius);border:1px solid var(--linija);border-radius:8px;padding:16px 18px;margin-bottom:14px}.dl-kortele h2{margin:0 0 6px;font-size:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.dl-kortele p{margin:6px 0}.dl-kortele .pastaba{color:var(--pilka);font-size:13px}.dl-kortele .dl-sumos{font-size:13.5px;line-height:1.6}.dl-veiksmai{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.pd-msg{display:flex;align-items:center;gap:10px;padding:10px 24px;font-size:13.5px;border-bottom:1px solid var(--linija);background:#fff}.pd-msg-ok{background:var(--zalia-s);color:var(--zalia)}.pd-msg-info{background:#F1F1EE;color:var(--pilka)}.pd-msg-klaida{background:var(--raudona-s);color:var(--raudona)}.pd-msg-x{margin-left:auto;border:0;background:none;cursor:pointer;color:inherit;opacity:.6}
/* skydas */
.uzdanga{position:fixed;inset:0;background:rgba(27,38,32,.25);z-index:99990;display:none}.uzdanga.on{display:block}
.skydas{position:fixed;top:32px;right:0;bottom:0;width:600px;max-width:100vw;background:var(--popierius);z-index:99991;transform:translateX(100%);transition:transform .18s ease-out;box-shadow:-8px 0 30px rgba(27,38,32,.12);display:flex;flex-direction:column;color:var(--rasalas);font:14px/1.45 "IBM Plex Sans",system-ui,sans-serif}.skydas.on{transform:none}
@media (prefers-reduced-motion:reduce){.skydas{transition:none}}
.skydas header{padding:16px 20px 12px;border-bottom:1px solid var(--linija);display:flex;gap:12px;align-items:flex-start}.skydas header h2{margin:0;font-size:18px}.uzdaryti{margin-left:auto;background:none;border:0;font-size:22px;color:var(--pilka);line-height:1;cursor:pointer}
.skydas .kunas{padding:14px 20px;overflow:auto;flex:1}.skydas .pastaba{color:var(--pilka);font-size:13px;margin-bottom:6px}
.skydas .eilute{padding:10px 0;border-bottom:1px solid var(--linija)}.skydas .eilute:last-child{border-bottom:0}.skydas .virsus{display:flex;gap:10px;align-items:baseline}.skydas .k{width:30px;text-align:right;color:var(--pilka)}.skydas .p{flex:1;font-weight:500}
.skydas .keliai{display:flex;gap:6px;margin:8px 0 6px 40px;flex-wrap:wrap}.skydas .keliai a,.skydas .keliai span.kb{border:1px solid var(--linija);background:var(--popierius);border-radius:6px;padding:5px 10px;color:var(--pilka);display:inline-flex;gap:6px;align-items:center;font-size:13px}
.skydas .keliai a:hover{text-decoration:none;border-color:var(--rasalas)}.skydas .keliai .on.sandelis{border-color:var(--zalia);background:var(--zalia-s);color:var(--zalia);font-weight:600}.skydas .keliai .on.tk{border-color:var(--melyna);background:var(--melyna-s);color:var(--melyna);font-weight:600}.skydas .keliai .on.ts{border-color:var(--gintaras);background:var(--gintaras-s);color:var(--gintaras);font-weight:600}
.skydas .keliai .ne{opacity:.4;cursor:not-allowed}.skydas .keliai i{width:7px;height:7px;border-radius:50%;background:currentColor;display:inline-block}
.skydas .zingsneliai{margin:6px 0 0 40px;display:flex;gap:6px;flex-wrap:wrap;font-size:12px}.skydas .zingsneliai span{padding:2px 8px;border-radius:10px;background:var(--fonas);color:var(--pilka)}.skydas .zingsneliai span.ok{background:var(--zalia-s);color:var(--zalia)}.skydas .zingsneliai span.dabar{background:var(--rasalas);color:#fff}
.skydas .kodel{margin-left:40px;font-size:12px;color:var(--pilka)}.skydas .lock{margin-left:40px;font-size:12px;color:var(--gintaras)}
.skydas .blokas{background:var(--fonas);border-radius:8px;padding:10px 12px;margin:10px 0}.skydas .blokas b{display:block;font-size:12px;color:var(--pilka);font-weight:500;margin-bottom:3px}
.skydas .dl-klaus{background:var(--raudona-s);color:var(--raudona);border-radius:8px;padding:8px 12px;margin:0 0 10px;font-size:13px}
.skydas footer{padding:12px 20px;border-top:1px solid var(--linija);display:flex;gap:8px;flex-wrap:wrap;align-items:center}.skydas .zurnalas{font-size:12px;color:var(--pilka)}.skydas .zurnalas ol{margin:0;padding-left:16px}.skydas .zurnalas li{padding:2px 0}.skydas .psuz-klaida{color:var(--raudona)}.skydas .pak input{width:54px;font:inherit;border:1px solid var(--linija);border-radius:5px;padding:2px 6px}
.dl-red label{display:block;font-size:12px;color:var(--pilka);margin:6px 0 0}.dl-red label.cb{display:flex;align-items:center;gap:6px;color:var(--rasalas);font-size:13px;margin-top:10px}.dl-red input:not([type=checkbox]),.dl-red select{display:block;width:100%;box-sizing:border-box;font:inherit;font-size:13px;color:var(--rasalas);border:1px solid var(--linija);border-radius:5px;padding:5px 8px;background:var(--popierius);margin-top:2px}.dl-red .e2{display:grid;grid-template-columns:1fr 1fr;gap:8px}.dl-red .dl-red-v{display:flex;gap:8px;margin-top:10px;align-items:center}.dl-red .dl-note{margin-top:6px}
.dl-pk-f{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0 2px;font-size:13px}.dl-pk-f label{display:inline-flex;gap:6px;align-items:center;color:var(--pilka)}.dl-pk-f input[type=number]{width:74px;font:inherit;font-size:13px;color:var(--rasalas);border:1px solid var(--linija);border-radius:6px;padding:3px 6px}.dl-kortele .dl-pk{color:var(--rasalas)}a.dl-kk{color:var(--melyna);text-decoration:underline dotted;cursor:pointer}a.dl-kk:hover{color:var(--rasalas)}.dl-kk-f{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:6px 0 2px 38px;font-size:13px}.dl-kk-f label{display:inline-flex;gap:6px;align-items:center;color:var(--pilka)}.dl-kk-f input[type=number]{width:58px;font:inherit;font-size:13px;color:var(--rasalas);border:1px solid var(--linija);border-radius:5px;padding:4px 6px;background:var(--popierius)}
.dl-shade{display:none;position:fixed;inset:0;background:rgba(27,38,32,.45);z-index:100000}.dl-shade.on{display:block}
.dl-dlg{display:none;position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);width:440px;max-width:94vw;background:#fff;border-radius:10px;padding:18px 20px;z-index:100001;box-shadow:0 20px 50px rgba(0,0,0,.25)}
.dl-dlg.on{display:block}.dl-dlg h3{margin:0 0 8px;font-size:15px}.dl-dlg p{margin:0 0 12px;color:var(--pilka);font-size:13.5px}.dl-opt{display:flex;gap:8px;align-items:center;font-size:13px;margin-bottom:14px}.dl-dlg-b{display:flex;justify-content:flex-end;gap:8px}
@media (max-width:820px){.dl-main{padding:10px 10px 60px}.dl-tbl thead{display:none}.dl-tbl,.dl-tbl tbody,.dl-tbl tr{display:block}.dl-tbl td{display:block;border:0;padding:3px 12px}.dl-tbl tr.eil{border-bottom:1px solid var(--linija);padding:8px 0 10px}.dl-tbl td.d{text-align:left;white-space:normal}.skydas{width:100vw;top:46px}.dl-legenda{display:none}}
</style>
		<?php
	}

	protected static function skriptas() {
		?>
<script id="dl-js">
(function(){
	var DLN=document.getElementById('dl').getAttribute('data-n'); function surink(){ return Array.prototype.slice.call(document.querySelectorAll('.eil[data-sk]')); } var rows=surink(), cur=-1, seq=0;
	var SK=document.getElementById('dlSk'),UZ=document.getElementById('dlUzd'),SH=document.getElementById('dlShade'),DL=document.getElementById('dlDlg'),dlgOn=false,skOn=false;
	var $=function(id){return document.getElementById(id);};
	function esc(s){ return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];}); }
	function mark(i){ rows.forEach(function(r,j){ r.classList.toggle('on',j===i); }); cur=i; if(rows[i]) rows[i].scrollIntoView({block:'nearest'}); }
	/* --- dialogas --- */
	function dlg(a){ var d; try{ d=JSON.parse(a.getAttribute('data-d')); }catch(e){ return false; } if(!d) return false;
		$('dlDlgH').textContent=d.antraste||''; $('dlDlgT').textContent=d.tekstas||''; var ok=$('dlDlgOk'); ok.textContent=d.ok||'Gerai'; var url=a.getAttribute('href');
		var L=$('dlDlgOptL'),C=$('dlDlgOpt'),N=$('dlDlgN'); N.style.display='none'; C.style.display='';
		if(d.opt&&d.opt.tipas==='n'){ L.style.display='flex'; C.style.display='none'; N.style.display=''; N.value=d.opt.def||1; $('dlDlgOptT').textContent=d.opt.tekstas; N.oninput=function(){ ok.href=url+'&'+encodeURIComponent(d.opt.vardas)+'='+encodeURIComponent(N.value||1); }; N.oninput(); }
		else if(d.opt){ L.style.display='flex'; $('dlDlgOptT').textContent=d.opt.tekstas; C.checked=!!d.opt.def; C.onchange=function(){ ok.href=url+(C.checked?'&'+encodeURIComponent(d.opt.vardas)+'=1':''); }; C.onchange(); } else { L.style.display='none'; ok.href=url; }
		ok.onclick=function(){ ok.style.pointerEvents='none'; ok.style.opacity='.6'; };
		SH.classList.add('on'); DL.classList.add('on'); dlgOn=true; ok.focus(); return true; }
	function dlgOff(){ SH.classList.remove('on'); DL.classList.remove('on'); dlgOn=false; }
	$('dlDlgNo').onclick=dlgOff; SH.onclick=dlgOff;
	/* --- v3.19: kiekis skydelyje („q×“ → forma eilutėje, dialogas prieš POST) --- */
	function dlgForm(d,f){ $('dlDlgH').textContent=d.antraste||''; $('dlDlgT').textContent=d.tekstas||''; var ok=$('dlDlgOk'); ok.textContent=d.ok||'Gerai'; $('dlDlgOptL').style.display='none'; $('dlDlgN').style.display='none'; ok.href='#'; ok.onclick=function(ev){ ev.preventDefault(); ok.style.pointerEvents='none'; ok.style.opacity='.6'; f.submit(); }; SH.classList.add('on'); DL.classList.add('on'); dlgOn=true; ok.focus(); }
	document.addEventListener('click',function(e){
		var x=e.target.closest('.dl-kk-x'); if(x){ e.preventDefault(); e.stopPropagation(); var fx=x.closest('.dl-kk-f'); if(fx){ if(fx._a) fx._a.style.display=''; fx.remove(); } return; }
		var a=e.target.closest('a.dl-kk'); if(!a) return; e.preventDefault(); e.stopPropagation(); if(!skO||!skO.kk) return;
		var q=+a.getAttribute('data-q'), iid=a.getAttribute('data-iid'), K=skO.kk, eil=a.closest('.eilute'); if(!eil||eil.querySelector('.dl-kk-f')) return;
		var f=document.createElement('form'); f.method='post'; f.action=K.u; f.className='dl-kk-f'; f._a=a;
		f.innerHTML='<input type="hidden" name="action" value="ps_dl_kiekis"><input type="hidden" name="id" value="'+skO.id+'"><input type="hidden" name="iid" value="'+esc(iid)+'"><input type="hidden" name="_wpnonce" value="'+esc(K.n)+'"><input type="hidden" name="g" value="'+esc(K.g)+'"><input type="hidden" name="ka" value="">'
			+'<label>Kiekis <input type="number" name="n" min="1" max="'+(q-1)+'" value="'+Math.max(1,q-1)+'"'+(q<2?' disabled':'')+'> × <span class="pilkas maz">iš '+q+'</span></label> <button type="button" class="v p dl-kk-s"'+(q<2?' disabled title="liko 1 vnt. — tik Išimti"':'')+'>Išsaugoti</button> <button type="button" class="v t raud dl-kk-i">Išimti</button> <a href="#" class="pilkas maz dl-kk-x">atgal</a>';
		var v=eil.querySelector('.virsus'); v.parentNode.insertBefore(f,v.nextSibling); a.style.display='none'; var ni=f.querySelector('[name=n]'); if(ni&&!ni.disabled){ ni.focus(); ni.select(); }
		f.onsubmit=function(ev){ ev.preventDefault(); var s=f.querySelector('.dl-kk-s'); if(s&&!s.disabled) s.click(); };
		f.querySelector('.dl-kk-s').onclick=function(){ var nn=+f.querySelector('[name=n]').value; if(!(nn>=1&&nn<q)){ f.querySelector('[name=n]').focus(); return; } f.querySelector('[name=ka]').value='kiekis'; dlgForm({antraste:'Kiekis '+q+' → '+nn,tekstas:'Eilutė perrašoma: likutis grįžta, lapas ir laiškai rodys '+nn+' vnt. Skirtumą už '+(q-nn)+' vnt. sistema įrašo kaip grąžintiną, pinigų NEGRĄŽINA — grąžinsi rankomis (Klausimas primins). Klientui laiškas nesiunčiamas.',ok:'Išsaugoti'},f); };
		f.querySelector('.dl-kk-i').onclick=function(){ f.querySelector('[name=ka]').value='isimti'; dlgForm({antraste:'Išimti prekę iš užsakymo',tekstas:'Prekė ('+q+' vnt.) išimama: likutis grįžta, lapas ir laiškai jos neberodys. Sumą sistema įrašo kaip grąžintiną, pinigų NEGRĄŽINA — grąžinsi rankomis (Klausimas primins). Jei tai paskutinė prekė — naudok „Atšaukti“. Klientui laiškas nesiunčiamas.',ok:'Išimti'},f); };
	});
	/* --- v3.21: pakartotinis užsakymas (Klausimų kortelės forma, dialogas prieš POST) --- */
	document.addEventListener('click',function(e){
		var b=e.target.closest('.dl-pk-b'); if(b){ e.preventDefault(); e.stopPropagation(); var k=b.closest('.dl-kortele'), f=k&&k.querySelector('.dl-pk-f'); if(!f) return; f.style.display='flex'; b.style.display='none'; var s=f.querySelector('[name=suma]'); if(s){ s.focus(); s.select(); } return; }
		var x=e.target.closest('.dl-pk-x'); if(x){ e.preventDefault(); e.stopPropagation(); var fx=x.closest('.dl-pk-f'), kx=fx&&fx.closest('.dl-kortele'); if(fx){ fx.style.display='none'; var bb=kx&&kx.querySelector('.dl-pk-b'); if(bb) bb.style.display=''; } return; }
		var s2=e.target.closest('.dl-pk-s'); if(s2){ e.preventDefault(); e.stopPropagation(); var f2=s2.closest('.dl-pk-f'), si=f2.querySelector('[name=suma]'), v=parseFloat(String(si.value).replace(',','.')); if(!(v>=0.5&&v<=200)){ si.focus(); return; } si.value=v.toFixed(2); f2.querySelector('[name=ka]').value='sukurti'; dlgForm({antraste:'Pakartotinis užsakymas · '+v.toFixed(2).replace('.',',')+' €',tekstas:'Sukuriamas naujas mažas užsakymas (tik pakartotinio siuntimo mokestis) tam pačiam klientui ir adresui; klientui išeina laiškas su apmokėjimo nuoroda (Paysera). Apmokėjus — PVM sąskaita išsirašo pati, čia atsiras „Siųsti iš naujo“. Pradinis užsakymas ir jo sąskaita neliečiami.',ok:'Sukurti ir siųsti'},f2); return; }
		var n=e.target.closest('.dl-pk-n'); if(n){ e.preventDefault(); e.stopPropagation(); var f3=n.closest('.dl-pk-f'); f3.querySelector('[name=ka]').value='nemokamai'; dlgForm({antraste:'Siųsti iš naujo be mokesčio',tekstas:'Tik kai nepristatyta dėl mūsų ar vežėjo kaltės: klientui nieko nemokėti, laiškas nesiunčiamas, čia atsiras „Siųsti iš naujo“.',ok:'Be mokesčio'},f3); return; }
	});
	/* --- skydas --- */
	var KC={av:'sandelis',tiesiai:'tk',i_av:'ts'};
	function atidaryti(i){ var r=rows[i]; if(!r) return; mark(i); var id=r.getAttribute('data-id'), my=++seq; if(r._o){ rodyti(r._o,r); return; }
		$('skNr').textContent='#'+(r.querySelector('.nr')||{textContent:''}).textContent.replace('#','')+' · kraunama…'; SK.classList.add('on'); UZ.classList.add('on'); SK.setAttribute('aria-hidden','false'); skOn=true;
		fetch(ajaxurl+'?action=ps_dl_skydelis&id='+id+'&n='+encodeURIComponent(DLN),{credentials:'same-origin'}).then(function(x){return x.json();}).then(function(j){ if(!j||!j.success||my!==seq) return; r._o=j.data; rodyti(j.data,r); }).catch(function(){ $('skNr').textContent='#'+id+' · nepavyko įkelti'; }); }
	function rodyti(o,r){ skO=o;
		$('skNr').textContent='#'+o.nr+(o.uzdarytas?' · '+o.st:''); $('skKl').textContent=o.kl+' · '+o.suma+' · '+o.apmok;
		$('skPastaba').innerHTML='<b class="dl-kur">Dabar: '+esc(o.kur)+'</b><br>'+esc(o.pastaba);
		if(o.matyti){ fetch(ajaxurl+'?action=ps_dl_matyta&id='+o.id+'&n='+encodeURIComponent(o.zn),{credentials:'same-origin'}).catch(function(){}); r.classList.remove('dl-n'); var nb=r.querySelector('.dl-nz'); if(nb) nb.remove(); } var K=$('skKlaus'); if(o.klausimas){ K.style.display='block'; K.textContent='Klausimas: '+o.klausimas; } else K.style.display='none';
		$('skEil').innerHTML=o.eil.map(function(l){ return '<div class="eilute"><div class="virsus">'+(l.img?'<img class="dl-img" src="'+esc(l.img)+'" alt="">':'<span class="dl-img dl-img-n"></span>')+(l.kk?'<a class="k dl-kk" href="#" data-iid="'+l.iid+'" data-q="'+l.q+'" title="Keisti kiekį">'+l.q+'×</a>':'<div class="k">'+l.q+'×</div>')+'<div class="p">'+esc(l.n)+(l.sku?' <span class="pilkas maz">'+esc(l.sku)+'</span>':'')+'</div></div>'
			+'<div class="keliai">'+l.keliai.map(function(k){ var c=KC[k.k]+(k.on?' on':'')+(k.gal||k.on?'':' ne'); var t='<i></i>'+esc(k.t); if(k.u) return '<a class="'+c+'" href="'+esc(k.u)+'" title="Keisti kelią">'+t+'</a>'; return '<span class="kb '+c+'"'+(k.kodel_ne&&!k.on?' title="'+esc(k.kodel_ne)+'"':'')+'>'+t+'</span>'; }).join('')+'</div>'
			+'<div class="kodel">'+esc(l.kodel)+(l.tiek_url?' <a href="'+esc(l.tiek_url)+'">Laukiam iš tiekėjų →</a>':'')+'</div>'+(l.lock?'<div class="lock">Nebekeičiama: '+esc(l.lock)+'</div>':'')
			+(l.zing.length?'<div class="zingsneliai">'+l.zing.map(function(z){ return '<span class="'+z[1]+'">'+(z[1]==='ok'?'✓ ':'')+esc(z[0])+'</span>'; }).join('')+'</div>':'')+'</div>'; }).join('');
		$('skPr').innerHTML=prist(o);
		var S=$('skSiunta'); if(o.pak||o.nr_siuntos.length||o.perreg){ S.style.display='block'; $('skSiuntaT').innerHTML=(o.nr_siuntos.length?'<div>'+o.nr_siuntos.map(esc).join('<br>')+'</div>':'<div class="pilkas maz">siunta dar neregistruota</div>')
			+(o.pak?'<div class="pak" style="margin-top:6px">Dėžių: <input type="number" min="1" max="20" value="'+o.pak.kiek+'" id="skPakN"> <a class="v" id="skPakSave" href="'+esc(o.pak.u)+'">Išsaugoti</a>'+(o.perreg?' <a class="v" href="'+esc(o.perreg)+'" id="skPerreg">Lipdukas iš naujo</a>':'')+'</div>':'');
			var pn=$('skPakN'),ps=$('skPakSave'); if(pn&&ps){ var base=ps.getAttribute('href'); var upd=function(){ ps.href=base+'&n='+encodeURIComponent(pn.value); var pr=$('skPerreg'); if(pr) pr.href=o.perreg+'&n='+encodeURIComponent(pn.value); }; pn.oninput=upd; pn.onkeydown=function(ev){ if(ev.key==='Enter'){ ev.preventDefault(); ps.click(); } }; upd(); } } else S.style.display='none';
		var P=$('skPast'); if(o.pastaba_kl){ P.style.display='block'; $('skPastT').textContent=o.pastaba_kl; } else P.style.display='none';
		$('skZur').innerHTML='<span class="pilkas maz">kraunama…</span>'; fetch(ajaxurl+'?action=ps_dl_zurnalas&id='+o.id+'&n='+encodeURIComponent(o.zn),{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(j){ if(j&&j.success&&$('skNr').textContent.indexOf('#'+o.nr)===0) $('skZur').innerHTML=j.data; }).catch(function(){ $('skZur').textContent='žurnalo įkelti nepavyko'; });
		var f=''; if(o.rusiuoti) f+='<a class="v p" href="'+esc(o.rusiuoti)+'">Surūšiuota</a><span class="pilkas maz">peržiūrėk, iš kur važiuoja prekės, ir patvirtink</span>';
		if(o.btn&&!o.rusiuoti){ if(o.btn.pasyvus) f+='<a class="kel ts" href="'+esc(o.btn.u)+'"><i></i>'+esc(o.btn.t)+'</a>'; else f+='<a class="v p" href="'+esc(o.btn.u)+'"'+(o.btn.d?' data-d="'+esc(JSON.stringify(o.btn.d))+'"':'')+'>'+esc(o.btn.t)+'</a>'; }
		f+='<span style="margin-left:auto"></span>'+(o.red?'<button class="v t" id="skRed">Redaguoti</button>':'<button class="v t" disabled title="lipdukas jau užregistruotas / išsiųsta / uždaryta — keisk rankiniu būdu">Redaguoti</button>')+'<button class="v t" disabled title="dar nepadaryta">Sąskaita</button>'+(o.nesurinkta?'<a class="v t" href="'+esc(o.nesurinkta)+'" title="Grąžinti į „Surinkti“">Atšaukti surinkimą</a>':'')+(o.sekimo?'<a class="v t" href="'+esc(o.sekimo)+'">Sekimo numeriai klientui</a>':'')+(o.velavimas?'<a class="v t" href="'+esc(o.velavimas.u)+'" data-d="'+esc(JSON.stringify(o.velavimas.d))+'">Pranešti klientui apie vėlavimą</a>':'')+(o.mail?'<a class="v t" href="mailto:'+esc(o.mail)+'?subject='+encodeURIComponent('Užsakymas #'+o.nr+' — petshop.lt')+'">Parašyti klientui</a>':'')+(o.atsaukti?'<a class="v t raud" href="'+esc(o.atsaukti.u)+'" data-d="'+esc(JSON.stringify(o.atsaukti.d))+'">Atšaukti</a>':'');
		$('skV').innerHTML=f; SK.classList.add('on'); UZ.classList.add('on'); SK.setAttribute('aria-hidden','false'); skOn=true;
		var rb=$('skRed'); if(rb){ rb.onclick=function(){ redaguoti(o); }; } if(redOn&&o.red){ redOn=false; redaguoti(o); } else redOn=false; }
	/* --- v3.16: Redaguoti (adresas / paštomatas) --- */
	var redOn=false, skO=null;
	function redaguoti(o){ var r=o.red; if(!r) return; var P=$('skPr'); var L=r.laukai; var h='<form method="post" action="'+esc(r.u)+'" class="dl-red" id="skRedF"><input type="hidden" name="action" value="ps_dl_redaguoti"><input type="hidden" name="id" value="'+o.id+'"><input type="hidden" name="_wpnonce" value="'+esc(r.n)+'"><input type="hidden" name="g" value="'+esc(r.g)+'">';
		h+='<div class="pilkas maz">'+esc(o.vezejas)+' — pristatymo būdas nekeičiamas</div>';
		if(r.tipas==='kurjeris'){ h+='<div class="e2"><label>Vardas<input name="vardas" value="'+esc(L.vardas)+'"></label><label>Pavardė<input name="pavarde" value="'+esc(L.pavarde)+'"></label></div><label>Adresas (gatvė, namas, butas)<input name="adresas" value="'+esc(L.adresas)+'" required></label><label>Adresas (2) — papildomai<input name="adresas2" value="'+esc(L.adresas2)+'"></label><div class="e2"><label>Miestas<input name="miestas" value="'+esc(L.miestas)+'" required></label><label>Pašto kodas<input name="kodas" value="'+esc(L.kodas)+'" required></label></div>'; }
		else { h+='<label>Paštomatas dabar<div class="pilkas maz">'+esc(r.vieta.t||'—')+'</div></label><label>Ieškoti (miestas, vieta)<input id="skRedQ" placeholder="pvz. Kaunas"></label><label>Naujas paštomatas<select name="vieta" id="skRedS" required><option value="'+esc(r.vieta.id)+'">'+esc(r.vieta.t||'— nepasirinkta —')+'</option></select></label><div class="pilkas maz" id="skRedN">kraunama…</div>'; }
		h+='<label>Telefonas<input name="tel" value="'+esc(L.tel)+'" required></label>';
		h+='<div class="dl-red-v"><button type="submit" class="v p">Išsaugoti</button><button type="button" class="v t" id="skRedNe">Atšaukti</button></div></form>';
		P.innerHTML=h; $('skRedNe').onclick=function(){ P.innerHTML=prist(o); }; var fi=P.querySelector('input:not([type=hidden])'); if(fi) fi.focus();
		if(r.tipas!=='kurjeris'){ fetch(ajaxurl+'?action=ps_dl_vietos&vez='+encodeURIComponent(r.tipas)+'&n='+encodeURIComponent(o.zn),{credentials:'same-origin'}).then(function(x){return x.json();}).then(function(j){ if(!j||!j.success){ $('skRedN').textContent='sąrašo įkelti nepavyko'; return; } var V=j.data, S=$('skRedS'), Q=$('skRedQ');
			function pild(q){ q=(q||'').toLowerCase(); var n=0; var opts=''; V.forEach(function(v){ if(q&&(v[1]+' '+v[2]).toLowerCase().indexOf(q)<0) return; n++; if(n>300) return; opts+='<option value="'+esc(v[0])+'"'+(v[0]===r.vieta.id?' selected':'')+'>'+esc(v[2])+'</option>'; }); S.innerHTML=opts||'<option value="">— nerasta —</option>'; $('skRedN').textContent=(n>300?'rodoma 300 iš ':'')+n+' iš '+V.length+' (LT)'; }
			pild(''); Q.oninput=function(){ pild(Q.value); }; }).catch(function(){ $('skRedN').textContent='sąrašo įkelti nepavyko'; }); } }
	function prist(o){ return esc(o.vezejas)+(o.vieta?' · '+esc(o.vieta):'')+'<br><span class="pilkas maz">'+esc(o.adresas)+(o.tel?' · '+esc(o.tel):'')+(o.mail?' · '+esc(o.mail):'')+'</span>'; }
	function uzdaryti(){ SK.classList.remove('on'); UZ.classList.remove('on'); SK.setAttribute('aria-hidden','true'); skOn=false; }
	$('skUzd').onclick=uzdaryti; UZ.onclick=uzdaryti;
	document.addEventListener('click',function(e){
		var a=e.target.closest('a[data-d]'); if(a){ e.preventDefault(); e.stopPropagation(); dlg(a); return; }
		var b=e.target.closest('button[data-atidaryti]'); if(b){ e.preventDefault(); e.stopPropagation(); var r=b.closest('.eil'); if(r){ redOn=!!b.getAttribute('data-redaguoti'); if(redOn&&r._o) r._o=null; atidaryti(rows.indexOf(r)); } return; }
		if(e.target.closest('a,button,input,select,label,.dl-pk-f')) return;
		var r2=e.target.closest('.eil[data-sk]'); if(r2) atidaryti(rows.indexOf(r2));
	});
	document.addEventListener('keydown',function(e){
		var tag=(e.target.tagName||'').toLowerCase(); if(tag==='input'||tag==='select'||tag==='textarea'){ if(e.key==='Escape') e.target.blur(); return; }
		if(dlgOn){ if(e.key==='Escape') dlgOff(); return; }
		if(e.key==='Escape'){ if(skOn) uzdaryti(); else { var q=$('psjQ'); if(q&&q.value) q.value=''; } return; }
		if(e.key==='j'||e.key==='ArrowDown'){ e.preventDefault(); var n=Math.min(rows.length-1,cur+1); if(skOn) atidaryti(n); else mark(n); }
		else if(e.key==='k'||e.key==='ArrowUp'){ e.preventDefault(); var p=Math.max(0,cur-1); if(skOn) atidaryti(p); else mark(p); }
		else if(e.key==='Enter'){ if(cur>=0){ e.preventDefault(); atidaryti(cur); } }
		else if(e.key==='x'){ if(skOn) uzdaryti(); mark(Math.min(rows.length-1,cur+1)); }
		else if(e.key==='/'){ var q2=$('psjQ'); if(q2){ e.preventDefault(); q2.focus(); q2.select(); } }
	});
	document.addEventListener('change',function(e){ var cb=e.target.closest('.dl-uzs-cb'); if(!cb) return; var f=document.getElementById(cb.getAttribute('data-form')); if(!f) return; var ids=[],n=0; document.querySelectorAll('.dl-uzs-cb[data-form="'+cb.getAttribute('data-form')+'"]').forEach(function(c){ if(c.checked){ ids.push(c.value); n+=parseInt(c.getAttribute('data-n'),10)||1; } }); var h=f.querySelector('.dl-uzs-ids'); if(h) h.value=ids.join(','); f.querySelectorAll('button[data-tpl]').forEach(function(b){ b.textContent=b.getAttribute('data-tpl').replace('%n',n); b.disabled=!ids.length; }); });
	document.addEventListener('click',function(e){ var k=e.target.closest('.dl-kopijuoti'); if(k){ e.stopPropagation(); var t=k.getAttribute('data-tsv'); (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){ k.textContent='Nukopijuota'; setTimeout(function(){k.textContent='Kopijuoti';},1500); }).catch(function(){ window.prompt('Nukopijuok:',t); }); return; }
		var p=e.target.closest('.dl-perz'); if(p){ e.stopPropagation(); var f=p.closest('form'); var d=f&&f.querySelector('.dl-perz-t'); if(d){ d.style.display=d.style.display==='none'?'block':'none'; } return; }
		var b=e.target.closest('a[data-blank]'); if(b){ setTimeout(atnaujinti,1500); }
		var ft=e.target.closest('.dl-f-tog'); if(ft){ e.preventDefault(); var w=document.querySelector('.dl-f-wrap'); if(w){ w.style.display=w.style.display==='none'?'block':'none'; } } },true);
	/* V11: tylus atnaujinimas — keičiamas tik sąrašas, slinktis ir pažymėta eilutė lieka; skydelis/dialogas atviri, pelė virš sąrašo ar laukas fokuse — praleidžiam. */
	var atnaujinama=false;
	function atnaujinti(){ if(atnaujinama||document.visibilityState!=='visible'||dlgOn||skOn) return; if(document.activeElement&&document.activeElement!==document.body) return; if(document.querySelector('.dl-main:hover')) return; atnaujinama=true;
		var u=new URL(location.href); ['pd_ok','pd_nr','atidaryti'].forEach(function(k){u.searchParams.delete(k);});
		fetch(u.toString(),{credentials:'same-origin',headers:{'X-PS-DL':'1'}}).then(function(x){return x.text();}).then(function(h){ var d=new DOMParser().parseFromString(h,'text/html'); var nm=d.querySelector('.dl-main'), om=document.querySelector('.dl-main'); if(!nm||!om||nm.innerHTML===om.innerHTML) return;
			var kid=rows[cur]?rows[cur].getAttribute('data-id'):null, y=window.scrollY; om.innerHTML=nm.innerHTML; rows=surink(); cur=-1; window.scrollTo(0,y);
			if(kid){ var i=rows.findIndex(function(r){ return r.getAttribute('data-id')===kid; }); if(i>=0){ rows[i].classList.add('on'); cur=i; } } }).catch(function(){}).then(function(){ atnaujinama=false; }); }
	try{ var u=new URL(location.href); if(u.searchParams.has('pd_ok')||u.searchParams.has('atidaryti')){ ['pd_ok','pd_nr','atidaryti'].forEach(function(k){u.searchParams.delete(k);}); history.replaceState(null,'',u.toString()); } }catch(e){}
	var at=parseInt(document.getElementById('dl').getAttribute('data-atid'),10)||0;
	if(at){ var i=rows.findIndex(function(r){ return parseInt(r.getAttribute('data-id'),10)===at; }); if(i>=0) atidaryti(i); }
	else if(rows.length) mark(0);
	/* Auto-atnaujinimas 60 s — tik kai langas matomas, skydelis ir dialogas uždaryti (F2). */
	setInterval(atnaujinti,60000); window.psDlAtnaujinti=atnaujinti;
})();
</script>
		<?php
	}
}
Petshop_Darbalaukis::init();
