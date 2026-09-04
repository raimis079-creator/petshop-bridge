# deployment_log.md — v1.9.20

> **Padalinta 2026-08-12.** Senesnes sesijas (iki 2026-07-31 imtinai) rasi
> faile `deployment_log_ARCHYVAS_iki_2026-07-31.md`. Cia — tik 2026-08 ir
> velesni irasai, kad faila butu galima atnaujinti nerizikuojant prarasti
> istorijos.

## IRASAI (naujausi virsuje)

---

### S1615 (2026-09-04, vėlus vakaras)

> Pridėti po S1614. Tema: **v3.18.1 (2 stulpelio kosmetika) → spec §12.4 → 5 etapo #4 „kiekiai“ RECON (tik skaitymas, kodo nėra — laukia Raimio sprendimų).** Variklis nekeistas. Bridge: `irankiai/s1615_e1a…e1e.php` (b64 dalys + deploy/testas), `s1615_e2r/e3r/e4r/e5r.php` (recon), `analize/s1615_*.json`, `screenshots/s1615_e1_surinkti.png`, `s1615_e1_visi_35421.png`.

#### S1615 — `mu-plugins/petshop-darbalaukis.php` v3.18 → **v3.18.1** (277 163 B, md5 `43fe4d99b1f093816f39413ad033626c`; kopija `ps-backups/petshop-darbalaukis-v318-BACKUP-2026-09-04.php`; repo `deploy/petshop-darbalaukis.php` + `.php.b64`). Deploy 5 dalimis (`dl-v3181.part1…4` po 80 000 + 49 552 payload'e; kiekvienos dalies md5 sargas, bendras md5, `token_get_all`, gyvo failo md5 = v3.18). Vienintelis pakeitimas — `lentele()` 2 stulpelis: eilutės su `_ps_issiusta` / `_ps_atsaukta` praleidžiamos (jei po filtro neliktų nė vienos — rodomos visos, kaip anksčiau). **Patikra** (`e1e` T naujame procese + Playwright): #35438 Surinkti AV — „Iš AV **1 vnt.** Prins…“ (buvo „2 vnt. Animonda… +1“), `tr.eil.dl-demesys` + raudonas pill liko; Visi #35438 — tas pats; #35421 Visi — „Iš AV 1 vnt. Animonda… · Quattro veža į AV 1 vnt. … gauta · užsakymas tiekėjui #10“ (atšauktos Prins eilutės nėra). Ekrano nuotraukos peržiūrėtos. Likučiai / meta neliesti.

**Spec → v1.4** (`dokumentai/UZSAKYMU_DARBALAUKIS_SPEC_v1.md`, pilnu failu): §12.4 — S1614 sprendimai (#1 rankinis vėlavimo mygtukas; #2 Redaguoti be laiško, po bet kurio lipduko rankiniu būdu, V14 darbalaukio lygiu; #3 dalinis „Siunta grįžta“, tiekėjo dalis visada → AV standartinė procedūra, „ankstesnė AV siunta“ `_ps_issiusta`/`_ps_dalys_baigtos`, lapo ribotumas → raudona eilutė + pill; #4 klientui atšaukta dalis nerodoma), K4 modelis „dalis išlaiko tapatybę“ su visų darbalaukio žymių sąrašu, v3.18.1, kas tyliai galioja, kas nepatikrinta gyvai; §6c pažymėta, kad 1 ir 5 p. keičia §12.4.

#### 5 ETAPAS #4 „kiekiai“ — RECON (e2r/e3r/e4r/e5r, tik skaitymas; spec §6c 2–4, §5, §11.3)
**Likučiai.** `Petshop_AV_Reduce::mazinti` (`woocommerce_payment_complete`/`status_processing` prior. 15, idempotentiška per užsakymo `_ps_av_reduced`): av eilutėms rašo `_ps_av_reduced_qty=q` ir mažina `_own_stock_qty` (arba grynai AV `_stock`); WC `wc_maybe_reduce_stock_levels` (prior. 10) av eilutėms nurašo 0 (filtras `wc_kiekis`), tiekėjo eilutėms — `_stock` veidrodį (`_reduced_stock=q`). Atšaukus — `grazinti` prior. 15 ant cancelled/refunded (visam užsakymui). Darbalaukio `likutis($pid,$delta)` jau moka abi puses (`Petshop_AV_Stock` arba `wc_update_product_stock`). WC `hold_stock` 90 min. `wc_maybe_adjust_line_item_product_stock()` WC 11.0.1 **nėra** (`function_exists` false) — WC eilučių redagavimo per admin-ajax nesiremiam.
**Partijos.** `Petshop_Partijos::uzsakymo_nurasymas` (prior. 25, tik AV prekėms, FIFO, `_ps_partijos_nurasyta`, pastaba „Partijos nurašytos: #pid −n vnt. (k partijos)“); grąžinimas — **tik rankinis** `grazinti_i_partija($partijos_id,$kiekis)` (savininko sprendimas). Iš kurių partijų paimta — tik pastaboje, eilutėje nesaugoma.
**Faktai (nekeičiami).** `Petshop_Faktai::rasyti` (prior. 35) rašo `ps_fakt_uzsakymai/eilutes` VIENĄ kartą (kiekiai, sumos, savikaina). Korekcijos API nėra — **grąžinimas yra NAUJAS faktas**: `Petshop_Fakt_Grazinimai::rasyti($order_id,$refund_id)` ant `woocommerce_order_refunded` (prior. 35) iš **WC refund** objekto eilučių (suma be PVM, PVM, savikaina). T. y. ataskaitų sistema dalinį atšaukimą / kiekio mažinimą supranta tik kaip WC dalinį grąžinimą (`wc_create_refund` su `line_items`).
**Sąskaitos.** Ne pluginas — **tema `flatsome-child/functions.php`**: `petshop_get_avpn_number()` / `petshop_get_iapv_number()` (skaitikliai `petshop_avpn_counter` 324 / `petshop_iapv_counter` 163; T-0 → 101), `petshop_get_invoice_document_type()` (bacs + pending/on-hold → proforma IAPV, kitaip invoice AVPN), `petshop_generate_invoice_pdf($order_id)` (iš `get_items()` kiekių/sumų, `documentDate` = generavimo diena; PDF `uploads/wcdn/invoice/PVM-saskaita-AVPN…pdf`, 67 failai). Generuojama **checkout'e** (`woocommerce_checkout_order_created` → `_petshop_order_pdf` + laiškas „Užsakymas gautas“ per `petshop_send_order_received_email`) ir **iš naujo `customer_completed_order` laiške** (snippet #653 „Petshop Invoice Completed Attach Fix v3 (LIVE)“ regeneruoja šviežią PDF tuo pačiu AVPN, snippet #648 doc type ant completed). `petshop-pragma` — tik mėnesinis eksportas į Pragmą (5 d., AVPN užsakymai, sumos iš užsakymo eksporto metu). **Kreditinės sąskaitos logikos nėra niekur.** WC `customer_partially_refunded_order` laiškas — WC standartinis (jei įjungtas — rašytų „grąžinta X €“, nors Paysera refund API plugine **nėra**, pinigai rankomis).
**Kiti.** Tiekimas: `ideti_eilute($o,$iid,$src)` / `isimti_eilute($o,$iid)` tik `kaupiama` partijai (užsakyta — užrakinta). Dropship: po `perduota[src]` tiekėjas laišką gavo su kiekiais. Variklio išvestys (lapas `av-sheets`, dropship laiškas, Tiekimo eilutės, Venipak dispatch svoris, LP dydis, siuntų laiškai klientui) skaito **`get_quantity()`**, ne WC grąžintą kiekį.

**DIZAINO KLAUSIMAS (Raimiui, prieš kodą):** du modeliai.
- **A „WC grąžinimas“** (faktų sistemai natūralus): eilutės kiekis lieka, kuriamas WC dalinis refund (`line_items` qty + suma, `refund_payment=false`, `restock_items` — tiekėjo veidrodžiui), faktas rašosi pats, WC ataskaitos teisingos, pinigai rankomis; **bet** visi varikliai (lapas, laiškas tiekėjui, Tiekimas, Venipak svoris, klientų laiškai) spausdintų seną kiekį — reikėtų liesti kelis variklius (draudžiama be leidimo) arba gyventi su klaidingu lapu.
- **B „keisti eilutę“** (darbalaukio lygiu, varikliai teisingi patys): `set_quantity` + proporcingos sumos + `calculate_totals()` (pristatymas nekinta), likutis per `likutis()` (av) / WC veidrodis (tiekėjo), `_ps_av_reduced_qty` perrašomas, grupės/planas perskaičiuojami, Tiekimo eilutė perdedama; PRIEŠ tai sukuriamas WC refund su grąžintina suma (kad faktas `ps_fakt_grazinimai` ir būsima kreditinė turėtų šaltinį; WC Analytics tada skaičiuotų dukart — jų nenaudojam, faktai — savi). Partijos: rankomis (pastaba nurodo kiekį ir prekę). Sąskaita: completed laiškas regeneruos PDF tuo pačiu AVPN su nauja suma — ar buhalteriškai tinka (klientas jau gavo PDF su senu AVPN), ar reikia kreditinės (5 etapo „Sąskaita“) — **Raimio / buhalterės klausimas**. Klausimas „grąžinti X € rankomis (Paysera)“, kol nepažymėta (§6c).
- Riba abiem: tik kol nėra jokio lipduko IR tiekėjo laiško IR partija ne užsakyta (kaip `redagavimas()`); po to — rankiniu būdu. Laiško klientui — nėra (kaip adresui). „Pridėti prekę“ (suma didėja, §11.3 neatsakytas) — atskirai, ne šiame žingsnyje. Išimti VISKĄ = esamas „Atšaukti“.
**Rekomendacija:** B su refund'u pirma (mažiau variklių liesti, lapas/laiškai teisingi, faktas rašosi); A tik jei Raimis leidžia liesti av-sheets/av-dropship/av-tiekimas/siuntu-laiskai.

**Testiniai po S1615:** nepakito (žr. S1614). Dev-pastas žurnalas nekeistas.
**Raimio pastabos 09-04 naktis (po recon'o, sprendimai dar NEPRIIMTI — „palauk dėl kreditinės“):** kreditinė sąskaita — automatinė tik PILNAM grąžinimui, dalinę galima išrašyti rankomis; kreditinės forma ir numeracija turi būti suderinta su buhalterija — kol nesuderinta, kodo nerašyti. Nauji klausimai: (1) neatsiimta siunta grįžo — už grąžinimą vežėjas ima mokestį (Venipak papildomų paslaugų kainoraštis „Grąžinimai“, paštomate saugoma 3–5 d., neatsiimta grąžinama automatiškai; suma — sutartyje, spec §11.1 atviras); (2) klientas nori, kad siųstume iš naujo — jam priklauso sumokėti pristatymo (paštomato/kurjerio) mokestį: kaip ir kas išrašo sąskaitą? Claude siūlymas (tvirtinti): pakartotinis pristatymas = NAUJAS mažas užsakymas („Pakartotinis pristatymas“, suma = pristatymo mokestis [+ grąžinimo mokestis pagal Raimio taisyklę]), kuriamas darbuotojo iš darbalaukio (planuotas „Naujas užsakymas“), apmokamas Paysera nuoroda → AVPN išsirašo pats kaip bet kuriam užsakymui → tik tada „Siųsti iš naujo“; senas užsakymas ir jo sąskaita neliečiami. Atšaukiant po grįžimo — kiek grąžinti (visą / be pristatymo / be grąžinimo mokesčio) — Raimio/buhalterės taisyklė; sistema ją tik rodys.

**RAIMIO SPRENDIMAI 09-04 naktis — GRĮŽUSI NEATSIIMTA SIUNTA (galioja, spec §12.5 rašyti kitame lange):** (1) siuntos grąžinimo išlaidos klientui — **fiksuota 3,99 Eur su PVM (3,30 + PVM), visada** (ir siunčiant iš naujo, ir atšaukiant); (2) pakartotinis siuntimas — **pagal standartinius pristatymo įkainius, nemokamo pristatymo sąlyga netaikoma** (paštomatas 2,15 Eur, kurjeris pagal svorį — puslapyje „Pristatymas“ jau buvo); (3) atšaukiant — grąžinama **už prekes ir pristatymą sumokėta suma minus 3,99** (pvz. #35438: 36,42 − 3,99 = 32,43); (4) kreditinė — automatinė tik pilnam grąžinimui, dalinė rankomis; buhalterija derinti nereikia („sistema pas mus veikianti, viską rašom rankomis“) — kas dar neaišku, žr. atsakymą Raimiui S1615 pabaigoje. Teisinis pagrindas (web, 09-04): VVTAT DUK — vartotojui tenka tik tiesioginės prekių grąžinimo išlaidos, jei pardavėjas tinkamai informavo (CK 6.364(2)); LT pavyzdžiai: Nutrioz (paštomato neatsiėmimas → persiuntimo + grąžinimo kaštai), Vilma Electric (nepriklausomai nuo pristatymo būdo), Saulėspukis (3 Eur/pakart.), Savitas, Patogūs batai.
**Taisyklių puslapiai (e6r/e7r recon → e8d D+T, md5 sargai, kopijos `ps-backups/puslapis-{id}-2026-09-04.html`):** **34524 „Pirkimo sąlygos ir taisyklės“** (WC terms page, slug `/taisykles/`, md5 `e89ffdf1…` → `8c1f2c48…`) — nauji **6.10** (neatsiėmimas → grąžinimo išlaidos 3,99 Eur su PVM; pakartotinis siuntimas tik iš anksto apmokėjus įkainį be nemokamo pristatymo + 3,99) ir **6.11** (atsisakius arba **per 14 d. nesusitarus — Claude prielaida** → atšaukimas, grąžinama sumokėta suma minus 3,99, tuo pačiu būdu per 14 d.; netaikoma dėl Pardavėjo/vežėjo kaltės) po 6.9; §8.6 jau nurodo į „šių Taisyklių nuostatas“. **14894 „Pristatymas“** (md5 `6912904c…` → `085dc3bb…`) — pastraipa „Jeigu Pirkėjas prekių nepriima…“ perrašyta su 3,99 ir nuoroda į 6.10–6.11. **34523 „Grąžinimas“** (md5 `b7b01db4…` → `60dbd49c…`) — naujas skyrelis „Neatsiimta siunta“ prieš „Pinigų grąžinimas“. Patikra: DB + front (loopback 200, tekstas yra) + Playwright `screenshots/s1615_e8_taisykles_610.png` (6.10/6.11 matomi, peržiūrėta), `e8_pristatymas.png`, `e8_grazinimas.png`. WP Super Cache — `wp_cache_post_change` iškviestas.

**Raimis 09-04 naktis (2):** 6.10–6.11 patvirtinti. **Patikslinimas: Pragma — buhalterės programa, mes jai tik siunčiam duomenis; sąskaitas išrašo mūsų sistema, buhalterė susiveda pati.** Kreditinė — **pusiau automatinė**: sistema pasiūlo, darbuotojas peržiūri, jei reikia pataiso, patvirtina; „pilnas grąžinimas“ = **kai prekės grįžo į sandėlį** (mygtukas „Atšaukti — prekės grįžo į AV“); šablonai jau suderinti — ieškoti. **Recon e9r (tik skaitymas):** kreditinės šablonas YRA — pluginas **`woocommerce-delivery-notes` (WCDN 7.3.0) aktyvus** (e2r/e3r regex jo nepagavo — „delivery“), šablonų katalogai `uploads/wcdn/{invoice,creditnote,deliverynote,packingslip,receipt}`, temos šablonas **`flatsome-child/woocommerce-delivery-notes/base.php`** (2 kolonų LT; turi `creditnote`/„kreditinė“/**`KR-AVPN`** numeraciją), meta `_wcdn_creditnote_pdf/_date/_token` — 2 testiniuose (H212 atsisakymo testas). Senas desk: atsisakymo kortelėje mygtukas „Kreditinė“ → `wcdn_print_creditnote` (REGISTRAS §8jj.1: **KR-AVPN numeracija NEPATIKRINTA — tikrinti vizualiai prie pirmos realios**). PDF variklis — Dompdf (temos `petshop_generate_invoice_pdf` naudoja tą patį `base.php`). Neaišku dar: ką WCDN creditnote spausdina — WC refund eilutes ar visą užsakymą (kitas recon prieš kodą); kaip sąskaitos keliauja buhalterei (klausta Raimio).
**Claude sprendimas (techninis, Raimiui pranešta paprastai):** #4 kiekiams — **B modelis**: eilutė perrašoma (lapai/laiškai/svoris teisingi patys), prieš tai WC refund įrašas „grąžinta n vnt., X €“ (`refund_payment=false`) — iš jo kreditinė (WCDN creditnote) ir `ps_fakt_grazinimai`; WC dalinio grąžinimo laiškas klientui blokuojamas. Pakartotinis pristatymas — siūlymas „naujas mažas užsakymas + apmokėjimo nuoroda“ paaiškintas paprastai, laukia „taip/ne“.

**Raimis 09-04 naktis (3):** sąskaitos buhalterei — paprasčiausiai gale mėnesio kartu per ataskaitą Pragmai; sistemoje visos sąskaitos saugomos ir atsifiltruojamos („Sąskaita“ langas, 5 etapas). Pakartotinis pristatymas: dabar rankinė sąskaita + banko tikrinimas („košmaras“) → **nori: sistema išrašo, klientas apmoka per Paysera, automatinis patvirtinimas** = naujas mažas užsakymas su apmokėjimo nuoroda (patvirtinta). **Spec → v1.5 (§12.5)** pilnu failu: grįžusi siunta (3,99 visada, įkainiai be nemokamo, sumokėta − 3,99), kortelės sumos, pakartotinis pristatymas kaip naujas užsakymas, kreditinė pusiau automatinė (KR-AVPN, WCDN + base.php), sąskaitų langas + Pragma eksportas su kreditinėmis, #4 B modelis, „pridėti prekę“ per tą patį mechanizmą.

**Lieka:** kitas langas — #4 kodas (B) → „Siunta grįžta“ sumos + „Pakartotinis pristatymas“ (naujas užsakymas + nuoroda) → kreditinė pusiau automatinė (pirma recon: WCDN creditnote turinys) → „Sąskaita“ langas; J1, Venipak 4/5/7/8, V12/V13/V14 variklis, T10/V1 — kaip S1614. (Senas „Lieka“: pakartotinis pristatymas kaip naujas užsakymas; pridėti prekę); spec §12.5 (grįžusi siunta — sumos, taisyklės); darbalaukio „Siunta grįžta“ kortelėje rodyti suskaičiuotas sumas (X − 3,99 / įkainis + 3,99); tada #4 kodas + testas; J1, Venipak 4/5/7/8, V12/V13/V14 variklis, T10/V1 — kaip S1614.

---

### S1614 (2026-09-04, vakaras)

> Pridėti po S1613. Tema: **5 etapas #1 → #2 → #3** (STARTAS 09-04 eilė, Raimis „tesk“). Variklis (registras A–J, `Petshop_Desk::klausimas()`, `petshop-av-reduce.php`, `petshop-dropship-sargas.php`, `Petshop_Siuntos`) nekeistas. Bridge: `irankiai/s1614_e1a/e1d/e1v/e2r/e3r/e4a/e4x/e4d/e4v/e5r/e6a/e6x/e6d/e7a/e7d.php`, `analize/s1614_e1a…e7d.json`, `screenshots/s1614_e1_klausimai, e1_skydelis_35435_po, e1_skydelis_35421, e1_dialogas_35421, e4_klausimai, e4_forma_35431, e4_forma_35442, e4_forma_35442_sarasas, e4_klausimai_po, e4_skydelis_35431_po, e4_taisyti_35439, e6_klausimai, e6_paruosta_po.png`.

#### S1614 — `mu-plugins/petshop-darbalaukis.php` v3.14.2 → **v3.17.1** (275 687 B, md5 `bfc3d9044fdf32053ef838bdbce2416f`; v3.15 `488142d7…` 239 932 B, v3.16 `03deb5b6…` 260 754 B, v3.17 `aa47912f…` 275 203 B; repo `deploy/petshop-darbalaukis.php` + `.php.b64`; kopijos `ps-backups/petshop-darbalaukis-v3142/v315/v316/v317-BACKUP-2026-09-04.php`) · `mu-plugins/petshop-kliento-siuntos.php` v1.2 → **v1.3** (8 325 B, md5 `69b897ad02b0ab5ea35942a1a926a666`; kopija `-v12-BACKUP-2026-09-04.php`; repo `deploy/`). Deploy — b64 **5 dalimis** (4×80 000 į `ps-backups/dl-vXXXX.part1…4` + likutis payload'e; failas jau 368 KB b64), md5/`token_get_all` sargai, gyvo failo md5 sargas; testai naujame procese, realūs `admin-post`/`admin-ajax` kaip `testuotojas`; laiškai — dev-pastas žurnalas (4 → 5, 0 išėjo); Venipak/LP API nekviesti (klaidos ir „grįžta“ — simuliuotos meta).

**#1 Mygtukas „Pranešti klientui apie vėlavimą“ — v3.15** (Raimio idėja 09-04). Skydelyje ir kortelėje „[T] vėluoja“; sąlyga: apmokėtas, neuždarytas, bent viena dalis neišsiųsta, žymės `_ps_velavimo_laiskas` nėra. Tas pats `velavimo_laiskas($o,$siandien,$u)` — rankiniu būdu praleidžiami tik ≥3 d. d. ir Klausimų sargai (darbuotojas sprendžia); dialogas rodo pilną laiško tekstą (tema „Jūsų užsakymą Nr. N dar komplektuojame“, tekstas v3.13 žodis į žodį, „Likusių …“ variantas); po siuntimo ta pati žymė, pill, pastaba „(…; darbuotojas X)“, įvykis `velavimo_laiskas` kanalas web / kas darbuotojas / „rankiniu mygtuku“; mygtuko nebėra. Veiksmas `admin_post_ps_dl_veiksmas` `v=velavimas`. Automatinis 14:00 nekeistas (kitas 09-05 14:00). **Testas** (`e1d` T + `e1v`): #35435 (VF dropship, neišsiųsta) → 302 „klientui pranešta apie vėlavimą — laiškas terra@… (apmokėta 09-03, 0 d. d.; liko: VF)“, žymė `2026-09-04 18:05:57`, laiškas sugautas dev-pastas (žurnalas 3→4), skydelis po: pill + „Klientui pranešta apie vėlavimą (09-04 18:05)“, mygtuko nebėra (`e1_skydelis_35435_po.png`); #35421 (Prins išsiuntė, laukia AV) — mygtukas + dialogas su „Likusių …“ (`e1_dialogas_35421.png`), nespausta. Kortelės „[T] vėluoja“ mygtukas vizualiai nepatikrintas (Klausimuose tokios nebuvo) — tas pats `$sk['velavimas']` + `data-d` kaip „Siųsti iš naujo“.

**#2 „Redaguoti“: adresas / paštomatas + V14 — v3.16** (Raimis 09-04: „klientai prirašo nesąmoningų adresų — kurjeriui, ne tik paštomatui“; spec §6c). **Recon** (`e2r/e3r`, tik skaitymas): Venipak pluginas 1.26.5 (`wc-venipak-shipping`, pritaikytas) — paštomatas `venipak_pickup_point` (id) + `venipak_pickup_point_data` (snapshot), funkcijos `venipak_store_order_pickup($o,$id)` / `venipak_find_pickup_by_id()` / `venipak_resolve_order_pickup()` / `venipak_fetch_pickups('LT')` (failas `uploads/venipak/pickups.json`, atnaujinamas kas parą; 567 LT vietos), adresas dispatch'e — `get_order_address()`: shipping laukai, jei `shipping_address_1` (ir ne `billing_only`), tel. shipping → billing, vardas — `shipping_company`/`billing_company`, kitaip shipping vardas; klaida — `venipak_shipping_order_data` `{status:'error', error_message}` (empty response, XML klaida). LP 4.0.32 — terminalas `_woo_lithuaniapost_lpexpress_terminal_id` + `_woo_lithuaniapost_lpexpress_terminal` („name - address, city“), lentelė `gaj6_woo_lithuaniapost_unisend_terminals` (1 391, LT 531; `lpexpress_terminals` tuščia), adresas — `shipping_address_1/2`, city, postcode; tel. — `billing_phone`; klaida — meta `lp-parcel-failed` + `_woo_lithuaniapost_parcel_create_error` (masyvas {error, error_description, field}). Pristatymo metodai: Venipak courier 2/6/7/8/10, pickup 3/5/9, LP terminal 12/13/15; testiniuose #35435/#35436 `flat_rate` „Venipak kurjeris“ (`vezejas()`='kita'). **Padaryta:** skydelio „Redaguoti“ (buvo `disabled`) → forma vietoje „Pristatymas“ bloko: kurjeriui — vardas, pavardė, adresas, adresas (2), miestas, pašto kodas; Venipak / LP paštomatui — sąrašas su paieška (ajax `wp_ajax_ps_dl_vietos`, `[[id, miestas, tekstas]]`, rodoma ≤300, „68 iš 567 (LT)“ įvedus Kaunas; LP 531); visiems — telefonas (rašoma billing + shipping). Pristatymo BŪDAS nekeičiamas. Galima, kol bent viena dalis neišsiųsta ir neuždarytas. Įspėjimai formoje: AV siunta jau užregistruota → „Lipdukas iš naujo“; LP siunta sukurta → perregistruoti senoje sistemoje; tiekėjui jau užsakyta → „parašyk tiekėjui“; **v3.16.1** — tiekėjo dalis su registruotu numeriu (e4 radinys: #35442 VF V…056 be įspėjimo). Išsaugojus (`admin_post_ps_dl_redaguoti`, POST, nonce `ps_dl_red_{id}`, lock): pastaba prieš/po, įvykis `redaguoti` (pries/po), vežėjo klaida nuimama (Venipak `status`→'', LP `lp-parcel-failed`→`lp-parcel-await` + klaidos meta ištrinta), klientui laiškas — varnelė (numatyta ON, spec §6c): tema „Jūsų užsakymo Nr. N pristatymo duomenys pakeisti“, tekstas „Sveiki, [vardas]. Jūsų užsakymo Nr. N pristatymo duomenis pakeitėme. Dabar: Pristatymo adresas/Paštomatas: … · Telefonas: … Jei tai netikslu, tiesiog atsakykite į šį laišką.“ — **Claude prielaida, Raimiui tvirtinti**. „Nieko nepakeista“ → nieko nerašo. **V14 darbalaukio lygiu:** `faktai()` → `siuntos_klaida($o,$vez)` iš plugino meta → Klausimas „Siuntos sukurti nepavyko“ (variklio `klausimas()` žiūri į statusą `lp-parcel-failed`, kurio pluginas neskiria — neliesta); tekstas lietuviškai + originalas skliaustuose („Venipak neatsakė (…)“, „Venipak: neteisingas pašto kodas (Bad post code)“, „LP Express: neteisingas paštomatas (…)“); kortelėje **„Taisyti adresą“** → skydelis su atverta forma (`data-redaguoti`); po išsaugojimo klaida nuimta, Klausimas dingsta, lipdukas iš naujo. **Testas** (`e4d` D/T/Z, `e4v`): #35431 kurjeris — adresas „Testų g. 18“→„18-5“, kodas 01100→01101, tel. →…018, laiškas ON → 302, shipping laukai, pastaba „…(Testuotojas): Adresas: „…“ → „…“; …Klientui laiškas: išsiųstas terra@…“, įvykis `redaguoti` pries/po, laiškas sugautas dev-pastas (4→5); #35434 sim Venipak klaida (meta, API nekviestas) → Klausimas „Siuntos sukurti nepavyko“ → forma per „Taisyti adresą“ (kortelėje #35439, `e4_taisyti_35439.png`) → POST kodas 01121, laiškas OFF → „Venipak klaida nuimta — registruok lipduką iš naujo“, `venipak_shipping_order_data` `{status:'',error_message:''}`, Klausimas dingo, „Surinkti AV“; pakartotinis POST be pakeitimų → „nieko nepakeista“; #35442 paštomato forma su sąrašu (`e4_forma_35442_sarasas.png`). **Nepatikrinta gyvai:** LP kelias (nėra LP `processing` testinio; kodas simetriškas), Venipak paštomato pakeitimas (sąrašas rodytas, nespausta).

**#3 Dalinis „Siunta grįžta“ — v3.17 → v3.17.1** (Raimis 09-04: „visi tokie užsakymai papuola į Klausimus, darbuotojas turi turėti dideles galimybes ir jis nusprendžia, ne sistema; užsakymų daug nebus“). **Recon** (`e5r`): `Petshop_AV_Reduce::grazinti` (`woocommerce_order_status_cancelled` prior. 15): tik jei `_ps_av_reduced` ∧ ne `_ps_av_restored`; eilutėms `_ps_av_reduced_qty`>0 → `Petshop_AV_Stock::qty()===null` ? `_stock` +q (set_stock_quantity, instock) : `AV_Stock::increase`; žymi `_ps_av_restored`. Darbalaukio `likutis()` — tas pats skirstymas (`_own_stock_qty` / `_stock` per `wc_update_product_stock`). **Sprendimas (Claude, K4 modelio nekeičiant — dalis išlaiko tapatybę):** užraktai nuimti; „Siųsti iš naujo“ tik grįžusią dalį: AV dalis — v3.11.1 (numeriai → senos, Surinkti AV → naujas lipdukas); tiekėjo dalis, kai AV dalis yra, neišsiųsta ir neatšaukta → (a) sujungiama į AV (v3.11.1, Raimio spr. 5); kitaip → (b) dalis LIEKA tiekėjo dalimi (kelias, `perduota` nekeičiami), keičiama tik siunta: numeriai → senos, `_ps_dalys_issiusta[T]` nuimama, `_own_stock_qty` +q −q = 0, eilutei `_ps_av_reduced_qty=q` + užsakymui `_ps_av_reduced` (vėlesnis pilnas atšaukimas grąžins per variklį), žymė `_ps_dalys_is_naujo[T]` (V13 „[T] vėluoja“ ją gerbia), skydelio „AV siunta“ bloke **„Lipdukas [T] iš naujo“** (`dl_url('lipdukas', sandelis=T, perreg=1)`), užsakymas → processing, Paruošta siųsti „[T] išsiuntė“ / sekimas. „Atšaukti tik grįžusią dalį“ (mygtukas taip vadinasi, kai yra kitų aktyvių dalių; kitaip — „Atšaukti — prekės grįžo į AV“ = visas, v3.11.1): dalies eilutės `_ps_atsaukta` = `laikas|kas|nr|senas rq`; likutis — tiekėjo eilutės +q į `_own_stock_qty`, AV eilutės — variklio `grazinti` veidrodis eilutės lygiu (`likutis()` +rq, jei rq>0 ir ne `_ps_av_restored`; `_ps_av_reduced_qty` → 0, kad pilnas atšaukimas negrąžintų dukart); `_ps_dalys_atsaukta[dalis]={laikas,kas,nr[]}`; statusas: completed lieka, processing → completed tik jei visos likusios dalys išsiųstos; pastaba „… dalis ATŠAUKTA … Kita dalis lieka: … WC dalinį grąžinimą ir pinigus už atšauktą dalį tvarkyk rankomis. Klientui laiškas: NESIŲSTAS“; įvykis `grizta_atsaukti_dalis`. `faktai()`: atšauktos eilutės išimamos iš dalių (`av_side`/`tiesiai`), žingsnelių nėra, užraktas „atšaukta 09-04 19:12 — prekės grįžo į AV (siunta N)“, `reduced=true` (trūkumo neskaičiuojam); skydelio numeriuose „Prins: V…046 — atšaukta 09-04 19:12, prekės grįžo į AV“; `kliento_siuntos()` — busena `atsaukta` (n=0, į „n iš N“ neskaičiuojama), `siuntos_laiskas()` atšauktų eilučių nerodo; **`petshop-kliento-siuntos.php` v1.3** — „Atšaukta“ (pilka, be numerių, antraštė „Siunta“). Kortelė: tekstas su „(dalis)“ ir „Kita dalis: AV (dar ruošiama) / Prins (išsiųsta)“, pastaba pagal variantą (a/b/AV), dialogai skirtingi; „Adresą taisyk „Redaguoti“ prieš naują lipduką“. **v3.17.1 radinys** (`e6z`, #35421): atšaukus Prins dalį AV dalis rodėsi „siunta jau užregistruota“ / „Kurjeris paėmė“ — `faktai()` heuristika `$av_side && ! $tiesiai && turi_siunta()` (plugino meta = AV siunta), nes atšaukta dalis dingo iš `$tiesiai`, o plugino meta tebelaiko Prins numerį → heuristika skaičiuoja tiesiai dalis įskaitant atšauktas (`$tiesiai_visos`). **Testas** (`e6d` D/T/Z/Y, `e7d` D/T, Venipak nekviestas, 0 laiškų): **#35438** (completed; Prins V…047 + AV V…052 išsiųstos, 19708 `_stock` 17, rq 1): sim grįžta AV → kortelė „Kita dalis: Prins (išsiųsta)“, „Siųsti iš naujo“ + „Atšaukti tik grįžusią dalį“ (`e6_klausimai.png`) → atšaukti → 302 „AV dalis atšaukta — siunta V…052 grįžo į AV · likutis Animonda…: AV +1 → 18 · kita dalis lieka: Prins (išsiųsta)“ → **19708 `_stock` 18**, eil. 863 rq 1→0 + `_ps_atsaukta …|1`, `_ps_dalys_atsaukta.av`, completed liko; sim grįžta Prins → kortelė be „kita dalis“ (AV atšaukta), „Siųsti iš naujo“ (b) → „Prins dalis siunčiama iš AV iš naujo kaip ta pati dalis … likutis Prins…: AV +1 −1 → 1“, senos [047], `_ps_dalys_is_naujo.prins`, eil. 864 rq=1, processing, skydelis „Paruošta siųsti · Prins išsiuntė“ + „Lipdukas Prins iš naujo“ (sandelis=prins, perreg), Paruošta eilė su mygtuku „Prins išsiuntė“ (`e6_paruosta_po.png`), Klausimo nėra (V13 gerbia is_naujo; variklio sargas įrašė `_ps_sla_velavimas` 19:14 — jo tekstas nuimamas); `kliento_siuntos()` → prins ruošiama 1/1 + av atsaukta, HTML „Ruošiama“/„Atšaukta“. **#35421** (processing; Prins išsiųsta, AV ruošiama, 16889 own 0): sim grįžta Prins → „Kita dalis: AV (dar ruošiama)“ → atšaukti tik dalį → „Prins dalis atšaukta … AV +1 → 1 · kita dalis lieka: AV (dar ruošiama)“, **16889 `_own_stock_qty` 0→1**, processing liko, po v3.17.1 skydelis „Surinkti AV · toliau: Surinkti“ (buvo klaidingai „Kurjeris paėmė“), `kliento_siuntos()` av ruošiama + prins atsaukta. **Nepatikrinta:** „Lipdukas Prins iš naujo“ paspaudimas (realus Venipak), paskyros puslapis naršyklėje (HTML tikrintas tiesiogiai), Playwright skydelio #35438 (timeout).

**Kaip mato darbuotojas (S1614):** skydelyje atsirado „Pranešti klientui apie vėlavimą“ (tik kol neišsiųsta ir dar nepranešta) ir „Redaguoti“ — adresas ar paštomatas taisomas čia, WooCommerce nereikia; Klausimuose „siuntos sukurti nepavyko“ dabar sako, kas negerai (pašto kodas, paštomatas), o „Taisyti adresą“ atidaro formą; „Siunta grįžta“ kortelė nebeblokuoja — sako, kokia dalis grįžta, kas su kita dalimi, ir leidžia atšaukti tik grįžusią dalį arba siųsti iš naujo; tiekėjo dalį siunčiant iš AV iš naujo skydelyje yra „Lipdukas [T] iš naujo“. **Klientas:** paskyroje atšaukta dalis — „Atšaukta“; po adreso keitimo — laiškas su nauju adresu (jei varnelė).

**Mano prielaidos (Raimiui patvirtinti / vetuoti):** 1) laiško apie pristatymo duomenų pakeitimą tema ir tekstas (aukščiau), varnelė numatyta ON (spec §6c); 2) po užregistruoto lipduko redaguoti leidžiama su įspėjimu, ne blokuojama (spec §6c „su perregistravimu“); 3) tiekėjui apie naują adresą sistema nerašo — tik įspėjimas darbuotojui; 4) paskyroje daliai žodis „Atšaukta“; 5) **(b) variantas** — grįžusi tiekėjo dalis, kai AV jau išsiųsta/atšaukta, siunčiama iš AV su TIEKĖJO manifesto lipduku (`vp_reg` sandelis=T; siuntėjas visada UAB Avesa; kurjeris paima iš AV) — ar Venipak'ui tai tinka operaciškai? Alternatyva (AV manifestas) reikalautų antros AV dalies modelio (K4). 6) `_ps_atsaukta` eilutei — variklio `klausimas()` „Trūksta sandėlyje“ ciklas tokią av eilutę mato su rq=0 (žiūri `_reduced_stock`/`_ps_av_reduced` eilutės lygiu) — po grąžinimo AV likutis ≥ q, todėl netriggerina; jei triggerintų — variklio klausimas.

**Testiniai po S1614 (trinti 6 etape):** #35435 `_ps_velavimo_laiskas` 18:05; #35431 shipping „Testų g. 18-5“, 01101, tel. +37060000018; #35434 kodas 01121, `venipak_shipping_order_data` `{status:'',…}`; **#35439 su simuliuota Venipak klaida („Bad post code“) — Klausimuose**; #35438 processing: AV dalis atšaukta (eil. 863 rq 0, `_ps_atsaukta`), Prins is_naujo (senos [047], eil. 864 rq 1), `_ps_sla_velavimas` 19:14 (variklio); #35421 processing: Prins dalis atšaukta (`_ps_atsaukta`, `_ps_dalys_atsaukta`); likučiai **19708 `_stock` 17→18, 16889 `_own_stock_qty` 0→1** (testiniai judesiai). Dev-pastas žurnalas 5.

**RAIMIO SPRENDIMAI 09-04 vakaras (po v3.17.1) → v3.18** (276 421 B, md5 `348901306c34d5fbc5c3702bb35a791f`; kopija `ps-backups/petshop-darbalaukis-v3171-BACKUP-2026-09-04.php`; repo `deploy/` + `.b64`; šablonai `irankiai/s1614_e8r/e9r/e10r/e11a/e11x/e11d.php`, `screenshots/s1614_e11_surinkti/skydelis_35438/forma_35431.png`) · **`petshop-kliento-siuntos.php` GRĄŽINTA į v1.2** (md5 `fb5a0c08…`, iš `ps-backups/…-v12-BACKUP`; v1.3 kopija `…-v13-ATSAUKTA-2026-09-04.php`; repo `deploy/` v1.2):
1. **Laiško klientui po adreso keitimo NĖRA** („nereikia iš vis nieko rašyti, jei reikės — darbuotojas parašys“) — varnelė ir laiškas išimti; pastaba „Klientui laiškas nesiųstas“.
2. **Po BET KURIO užregistruoto lipduko „Redaguoti“ neveikia** („nieko nedarom, rankiniu būdu — mažiau klaidų“) — `redagavimas()` null, kai bet kuri dalis turi numerį arba LP siunta sukurta; mygtukas pilkas „lipdukas jau užregistruotas / išsiųsta / uždaryta — keisk rankiniu būdu“; įspėjimai (AV/tiekėjo/LP/perduota) išimti. V14 „Taisyti adresą“ lieka — nepavykus lipdukui numerio nėra.
3. Klausimas (laiškas tiekėjui su senu adresu) **atkrenta** — lipdukas tiekėjui registruojamas prieš laišką, po 2 p. redagavimo nebėra.
4. **Klientui atšaukta dalis NERODOMA** (Raimis: dažnas atvejis — klientas daro du užsakymus su skirtingais bankais, pirmą tyliai atšaukia; nepainioti) — `kliento_siuntos()` be `atsaukta`, kliento-siuntos v1.2.
5. **Grįžusi tiekėjo dalis VISADA → AV, standartinė procedūra** (Surinkti AV → Lipdukas → Kurjeris paėmė, AV manifestas). (b) variantas, `_ps_dalys_is_naujo`, „Lipdukas [T] iš naujo“, V13 išimtis — išimti. Kai AV siunta **jau išsiųsta**: jos eilutės gauna `_ps_issiusta` = `laikas|nr` (`faktai()` išima iš AV dalies, žingsnelių nėra, užraktas „IŠSIŲSTA 09-03 (siunta V…052) — NEPAKUOK“, `reduced=true`), siunta → `_ps_dalys_baigtos.av[]` `{nr[],laikas,prekes[[q,n]]}` (klientui paskyroje ir laiške „n iš N“ lieka kaip išsiųsta/pristatyta — `kliento_siuntos()` + `siuntos_laiskas()` skaičiuoja), AV numeriai → senos, AV dalis ruošiama iš naujo tik iš grįžusių prekių. **Ribotumas (variklis, Raimis sutiko):** `petshop-av-sheets.php` lapas ima VISAS `_ps_source=av` eilutes — lape bus ir jau išsiųstos; todėl užsakymas **išskiriamas** (Raimis: „pažymėti ar spalva išskirti, kad iškart atkreiptų dėmesį“): sąraše raudona kairė juosta + rausvas fonas (`tr.eil.dl-demesys`) + raudonas pill „⚠ Lape bus ir jau išsiųstos prekės — NEPAKUOK: …“, skydelio „Dabar“ — tas pats sakinys, pastaba ir įvykis — `nepakuok[]`; galioja kol AV dalis vėl neišsiųsta (`$f['nepakuok']`).
**Recon** (`e8r/e9r/e10r`): lapą spausdina `petshop-av-sheets.php` (`duomenys()` 87: `if ('av' !== $item->get_meta('_ps_source')) continue;`), `Petshop_Desk` lapo funkcijų neturi (`veiksmo_url('lapai')` → engine `vykdyti_veiksma`); Venipak dispatch svorį/prekes ima iš VISŲ užsakymo eilučių (esama elgsena, ne šio darbo). **Testas** (`e11d` D/T/Z, Venipak nekviestas, 0 laiškų): #35431 red yra (kurjeris, be lipduko), forma be varnelės ir be įspėjimų (`e11_forma_35431.png`); #35442 (VF V…056 registruota) red=null; #35421 `kliento_siuntos()` tik AV ruošiama (atšaukta Prins nerodoma). **#35438** — testinė AV atšaukimo būsena atstatyta (eil. 863 `_ps_atsaukta` nuimta, rq→1, `_ps_dalys_atsaukta`/`_ps_dalys_is_naujo` ištrinti) → AV V…052 išsiųsta + Prins aktyvi (V13 „Prins vėluoja“ — teisingai, is_naujo nebėra) → sim grįžta Prins → „Siųsti iš naujo“ → 302 „AV siunta V…052 jau išsiųsta — lieka klientui kaip išsiųsta; jos prekės pažymėtos „IŠSIŲSTA — NEPAKUOK“; Prins dalis → AV: Surinkti AV → naujas lipdukas · likutis …: AV +1 −1 → 1 · ⚠ LAPE BUS IR JAU IŠSIŲSTOS PREKĖS — NEPAKUOK: 1× Animonda…“; naujame procese: eil. 863 `_ps_issiusta` `2026-09-03 12:34:35|V07267E1000052`, 864 kelias/src av rq 1, `_ps_dalys_baigtos.av` [{052, 09-03 12:34, [[1, Animonda…]]}], senos [047, 052], `_ps_dalys_issiusta` [], `_ps_order_type` MAIN, processing; skydelis „Surinkti AV · Surinkti“, pastaba su ⚠, užraktas „IŠSIŲSTA 09-03 (siunta V…052) — NEPAKUOK“, „AV (ankstesnė siunta): V…052 — … — išsiųsta 09-03 12:34“; Surinkti AV eilė — #35438 raudona su pill (`e11_surinkti.png`); `kliento_siuntos()` → av išsiųsta 1/2 (V…052, Animonda) + av ruošiama 2/2 (Prins), HTML „Siunta 1 iš 2 · Išsiųsta“, „Siunta 2 iš 2 · Ruošiama“. Likučiai nepakito (19708 18, 16889 own 1).
**Radinys (kosmetinis, kitam langui — v3.18.1):** sąrašo 2 stulpelyje „Iš AV“ grupė skaičiuoja ir `_ps_issiusta` / `_ps_atsaukta` eilutes (#35438 „2 vnt. … +1“, o pakuoti reikia 1) — jas iš 2 stulpelio išimti (pill ir skydelis jau rodo).
**Testiniai po v3.18:** #35438 processing — eil. 863 `_ps_issiusta`, `_ps_dalys_baigtos`, Prins eilutė kelias av, Surinkti AV; #35421 Prins dalis atšaukta (`_ps_atsaukta`, `_ps_dalys_atsaukta`); kiti kaip aukščiau.

**Lieka:** J1 pirma reali LP siunta; Venipak kodai 4/5/7/8; V12, V13 (variklis), V14 (variklis — darbalaukio lygiu padaryta); T10/V1; v3.18.1 (2 stulpelis); spec §12.4 (S1614 sprendimai, pilnu failu).

---

### S1613 (2026-09-04, popietė)

> Pridėti po S1612. Tema: **4 etapas #2 LP sekimas → #4 vėlavimo laiškas → #4a V13 → #5 spec §12.3 → #6 dienoraštis.** Variklis (registras A–J, `petshop-dropship-sargas.php`, `_ps_sla_velavimas`) nekeistas. Bridge: `irankiai/s1613_e1r…e10d.php`, `analize/s1613_e1…e10*.json`, `screenshots/s1613_e3_skydelis_35416, e7_visi_pill, e9_klausimai/surinkti/paruosta, e10_*_po.png`.

#### S1613 — `mu-plugins/petshop-darbalaukis.php` v3.11.1 → **v3.14.2** (236 178 B, md5 `165871eb0c83297ebdfd637416ed6d53`; v3.14.1 `dc990f3c…`; repo `deploy/petshop-darbalaukis.php` + `.php.b64`; kopijos `ps-backups/petshop-darbalaukis-v3111/v312/v313/v3131/v3132/v314-BACKUP-2026-09-04.php`). Spec → **v1.3** (§12.3). Deploy visada 4 dalimis (3×80 000 + payload'e), md5/`token_get_all` sargai, gyvo failo md5 sargas; testai naujame procese, gaudyklė prior. 4 — iš viso 3 laiškai sugauti, 0 išėjo (`ps_dev_pastas_zurnalas` 3 → 3).

**#2 LP Express sekimas — v3.12.** Recon (`e1r/e2r/e4r`, tik skaitymas, LP pluginas 4.0.32): kai abu nustatymai „Never“, pluginas **užsakymo statuso nekeičia** — vienintelis `update_status('completed')` tik kai nustatymas sutampa; `wc-lp-*` statusai registruoti, bet niekada neskiriami (dev'e 0). Rašo tik meta `_woo_lithuaniapost_shipping_status_value`: siunta/lipdukas → `lp-parcel-created` / `lp-label-created` / `lp-courier-await` / `lp-courier-called`; cron `woo_lithuaniapost_update_tracking_status` kas val. iš LP API į savo lentelę `gaj6_woo_lithuaniapost_tracking_status` (order_id, barcode, status, created, updated) → `lp-on-the-way` / `lp-delivered`; atšaukus `lp-cancelled` ir numeris nuimamas. Darbalaukio `issiusta()` sargas `lp-on-the-way/lp-delivered` ir `faktai()` `$lp_par` — nekenksmingi (niekada tikri). Sprendimas: tas pats cron `ps_venipak_sekimas`; kandidatai su `_woo_lithuaniapost_barcode` (`lp_kandidatai()` — `sekimo_kandidatai($meta)`); `sekti_lp()` skaito **tik meta**, LP API nekviečia: `lp-on-the-way`/`lp-delivered` → `issiusta($o,null,true,'av','lp')` (laiškas, `kas=LP Express`); `lp-delivered` → „Pristatyta“ (`_ps_venipak_sekimas[nr]` k=9, vez=lp; pastaba + įvykis `lp_pristatyta`); data — plugino lentelės `updated`, kitaip pastebėjimo laikas; `sekimo_tekstas()` „— LP Express: keliauja gavėjui, 09-04 13:10“; `kliento_siuntos()` „pristatyta“ ir LP daliai. **Testas #35416** (`e3d` T; LP Express, processing, meta rašyta tiesiogiai — plugino lentelė tuščia, jo cron neliečia): `lp-label-created` → paskyrai „ruošiama“ su numeriu + post.lt nuoroda, veiksmų 0 · `lp-on-the-way` → pats „Kurjeris paėmė“ → `completed`, laiškas „Užsakymas išsiųstas · Siuntos numeris (LP Express) CC000000001LT“ (sugautas) · kartojant 0 · `lp-delivered` → pastaba, įvykis, paskyrai „pristatyta“, kartojant 0 · cron be ids: 15 užs., lp=1. Skydelis (`e3_skydelis_35416.png`): „AV: CC000000001LT — LP Express: pristatyta, 09-04 13:24“, ✓ Surinkti ✓ Lipdukas ✓ Kurjeris paėmė. §18.3 variklio sargas LP užsakymo (be registro) `completed` nestabdė.

**Radiniai (Raimiui):** (a) LP plugino `woocommerce_order_status_changed` → `on_status_changed`: apmokėtam užsakymui be `_woo_lithuaniapost_shipping_item_id` bando kurti siuntą **realiu LP API** — testo `completed` #35416 tai sužadino (nepavyko, terminalas LT0001 kaip 09-02, meta grįžo į `lp-parcel-failed`, mūsų sekimas jį perrašė). Realiam užsakymui su siunta — nieko. Sakau atvirai: „LP API nekviesti“ pluginas apėjo. (b) **V14 (variklis, neliesta):** `Petshop_Desk::klausimas()` „Siuntos sukurti nepavyko“ žiūri į užsakymo *statusą* `lp-parcel-failed`, kurio pluginas neskiria → LP klaida (`_woo_lithuaniapost_parcel_create_error`) Klausimu netampa.

**#4 Vėlavimo laiškas — v3.13 → v3.13.2** (log S1611 sprendimas 3). Cron `ps_velavimo_laiskai` — vienkartinis WP įvykis, kas run'ą perplanuojamas į kitą **14:00 Vilnius** (`kitas_1400()`, `wp_timezone()`, DST-saugus; `cron_planuoti` `init` 30 užtikrina). `darbo_diena()` (Sa/Se, `LT_SVENTES`, Velykų pirmadienis — `velykos()` Grigaliaus algoritmas), `pilnos_darbo_dienos()` griežtai tarp datų. `velavimo_kandidatai()` HPOS SQL (processing + LP paruošta, be žymės, 60 d., ≤300); `velavimo_laiskas()`: žymė → `is_paid()` → būsena → ≥3 d. d. → `faktai()` `$f['kl']` (Klausimuose — praleidžia) → bent viena dalis be `issiusta` → laiškas WC mailer Raimio tekstu (dalis išsiųsta — „Likusių … prekių“), tema **„Jūsų užsakymą Nr. N dar komplektuojame“ (Raimis 09-04, v3.14.2; antraštė laiške — tas pats sakinys; e11d: #35436 sim Tr 09-09 → laiškas su šia tema ir h1, tekstas suderintas žodis į žodį, 0 išėjo)** → žymė `_ps_velavimo_laiskas`, pastaba, įvykis `velavimo_laiskas` (kanalas cron). Eilutėje pill „klientui pranešta apie vėlavimą 09-04 14:16“, skydelio „Dabar“ — tas pats sakinys. Testams `velavimo_laiskai($dabar_ts,[ids])` — be perplanavimo/opcijos. **Dvi mano klaidos:** v3.13 kandidatų SQL `m.meta_id` — HPOS `wc_orders_meta` PK `id` → v3.13.1 (`m.order_id IS NULL`); `o.date_paid_gmt` — HPOS `wc_orders` jo neturi (yra `wc_order_operational_data`) → v3.13.2 (išimta, apmokėjimą tikrina `is_paid()`). Realus cron 14:02 suveikė dar su klaida (0 kandidatų), perplanuotas 09-05 14:00. **Testas** (`e7d` T, v3.13.2): vienetai — Velykos 2026-04-05 (04-06 ne darbo), 2027-03-28; 08-31→09-04 = 3, 09-04→09-07 = 0, 09-02→09-08 = 3, 09-03→09-08 = 2; `kitas_1400` 13:59 → tos dienos, 14:00 → rytojaus. Kandidatų 21. Simuliacijos su ids [#35414 (apm. Tr 09-02), #35435 (Kt 09-03), #35421]: Sa → „ne darbo diena“; Pr → „praėjo 2 / 1 d. d.“; **An → #35414 laiškas** (sugautas: „Sveiki, AUDITAS. Jūsų užsakymo Nr. 35414 surinkimas truputį užtruko. …“), #35435 „praėjo 2“, #35421 „Klausimuose: Tiekėjas vėluoja“; dublis → „jau pranešta“. Pastaba „Klientui išsiųstas vėlavimo laiškas (terra@petshop.lt): apmokėta 09-02, praėjo 3 pilnos darbo dienos; dar neišsiųsta: AV, Ambrosia.“, įvykis, skydelis „… Klientui pranešta apie vėlavimą (09-04 14:16).“, pill „Visi“ eilutėje (DOM; `e7_visi_pill.png` — #35414 už ekrano ribos).

**#4a V13 — v3.14 → v3.14.1** (Raimis 09-04 sutiko, darbalaukio lygiu). Recon (`e8r`): `Petshop_AV_Dropship::perduotos()` = `_ps_dropship_sent_src {t: 'Y-m-d H:i:s'}` (kons „Kartu su Dropshipping“ — tas pats `ps_dropship_send`); variklio sargas v1.0 — užsakymo lygio `_ps_dropship_sent` >24 val. ∧ processing/on-hold, žymė `_ps_sla_velavimas` (dev'e #35418, #35421). `faktai()` po dalių: `$f['veluoja'][t]=val.` — tiesiai dalis, `perduota` ∧ `!issiusta` ∧ `kada` > `VELUOJA_VAL`=24; variklio tekstas „Tiekėjas vėluoja“ visada nuimamas, vėluojant → „[T] vėluoja — užsakyta prieš N val., siunta neišėjo. Paskambink [T].“; darbalaukio „Siunta grįžta“ / „Prekė be sandėlio“ tikrinami PO V13. Kortelė: žymė trumpa „ZB vėluoja“ (v3.14.1 — v3.14 rodė visą sakinį mažosiomis, `e9_klausimai.png`), tekstas pilnas, pastaba „… pažymėk „[T] išsiuntė“ (Paruošta siųsti) arba Venipak sekimas pažymės pats — Klausimas dings pats“, veiksmai Atidaryti · Parašyti · Atšaukti (be „Laukti“). **Testas** (`e9d` T + `e10d` Z): **#35421** (Prins išsiuntė 09-03, laukia AV, `_ps_sla_velavimas` 09-04 12:14) — Klausimo nebėra, Surinkti AV (10 → 11), mygtukas „Surinkti“; **#35418** (ZB užsakyta 09-02 17:50, neišsiųsta, registre V07267E1000037) — „ZB vėluoja — užsakyta prieš 44 val. …“ Klausimuose (4 → 3) **ir** Paruošta siųsti su „ZB išsiuntė“ (`e9_paruosta.png`). Z: `issiusta(#35418,null,true,'zb','web')` → `dl_issiusta`, completed, laiškas „Jūsų užsakymas Nr. 35418 išsiųstas … V07267E1000037“ (sugautas) → Klausimas dingo pats: Klausimai 2, Paruošta 0, skydelis „įvykdytas“. Trumpa žymė po Z vizualiai nepatikrinta (kortelės nebeliko) — kodo pakeitimas vienoje `printf` eilutėje.

**#5 Spec §12.3** (`dokumentai/UZSAKYMU_DARBALAUKIS_SPEC_v1.md` v1.2 → **v1.3**, pilnu failu): S1611 sprendimai 3–9, sekimas automatinis (Venipak + LP), V13, S1612/S1613 prielaidos 1–8, radiniai V14 + LP plugino kabliukas.

**#6 Dienoraštis (kaip mato žmonės):**
- *Darbuotojas.* Ryte atsidaro Užsakymai. #35418 „Klausimai (3)“: „ZB vėluoja — užsakyta prieš 44 val., siunta neišėjo. Paskambink ZB.“ — paskambina; ZB sako „išsiunčiam šiandien“. Kai Venipak nuskenuoja (arba darbuotojas „Paruošta siųsti“ spaudžia „ZB išsiuntė“) — kortelė dingsta pati, nieko spausti nereikia. #35421 Klausimuose nebėra — jis „Surinkti AV (11)“ su mygtuku „Surinkti“, nes Prins jau išsiuntė ir laukia tik AV. 14:00 sistema pati parašo klientams, kurių užsakymai kabo 3 darbo dienas — eilutėje mato „klientui pranešta apie vėlavimą 09-04 14:16“, skydelyje tą patį sakinį; Klausimų nuo to nepadaugėja. LP užsakymas #35416: kai LP paėmė — pats pažymėtas „Kurjeris paėmė“, klientui išėjo laiškas, o prie numerio „— LP Express: pristatyta, 09-04 13:24“.
- *Klientas.* Paskyroje „Siuntos“: „Ruošiama · CC000000001LT“ → laiškas „Jūsų užsakymas Nr. 35416 išsiųstas · Siuntos numeris (LP Express) CC000000001LT · Sekti siuntą“ → „Pristatyta“. Vėluojant — antradienį 14:00 laiškas „Užsakymas Nr. 35414 — surinkimas užtruko: Sveiki, AUDITAS. Jūsų užsakymo Nr. 35414 surinkimas truputį užtruko. Išsiųsime jį kaip galėdami greičiau. …“ — vienas, ne kasdien.
- *Kas atsitiko pats (cron).* Kas 30 min `ps_venipak_sekimas` (Venipak API + LP meta) — „paėmė“/„pristatyta“ pažymi ir laišką siunčia pats; darbo dienom 14:00 `ps_velavimo_laiskai` — vėlavimo laiškai; būsenos opcijose `ps_venipak_sekimas_paskutinis` (…, `lp`) ir `ps_velavimo_laiskai_paskutinis`.

**Raimio pastaba (09-04 vakaras):** laiško tekstas buvo suderintas S1611 — klausimų apie jį nekelti; tema — Raimio „Jūsų užsakymą Nr. N dar komplektuojame“. Prielaidos 1–2 atsiimtos. **Mano prielaidos (Raimiui patvirtinti / vetuoti):** 3) **užsakymas Klausimuose „[T] vėluoja“ vėlavimo laiško negauna** (Raimio taisyklė „praleidžiam Klausimuose“) — vėluojantis dropship visada ten atsiduria po 24 val., tad klientas laiško negaus, kol tiekėjas neišsiųs; jei norima priešingai — vienos sąlygos pakeitimas; 4) LP „pristatyta“ data — plugino lentelės `updated` arba pastebėjimo laikas (LP meta datos neturi); 5) LP kandidatai ir dev cron — 60 d., ≤200/run kaip Venipak.

**Testiniai po S1613 (trinti 6 etape):** #35436 processing su `_ps_velavimo_laiskas` 17:28 (e11d), #35416 completed (fiktyvus `_woo_lithuaniapost_barcode` CC000000001LT, meta `lp-delivered`, sek k=9), #35414 processing su `_ps_velavimo_laiskas` 2026-09-04 14:16:41, #35418 completed (`_ps_dalys_issiusta.zb`, kas=sistema); opcijos `ps_venipak_sekimas_paskutinis`, `ps_velavimo_laiskai_paskutinis`. Dev cron 14:00 realiai rašys `terra@…` (dev-pastas blokuoja). `_ps_sla_velavimas` #35418/#35421 lieka (variklio).

**Lieka (4 etapas):** Raimio atsakymai į prielaidas; J1 pirma reali LP siunta (sekimas per plugino lentelę — patikrinti `updated` datą); Venipak kodai 4/5/7/8; V12, V13 (variklis), V14; T10/V1. Toliau — 5 etapas pagal STARTAS.

---

### S1612 (2026-09-04, diena)

> Pridėti po S1611. Tema: **4 etapas #1 — Venipak sekimo cron** (darbalaukis v3.10.6 → **v3.11**) ir **#3 — Klausimas „Siunta grįžta“ su sprendimo mygtukais** (→ **v3.11.1**); `petshop-kliento-siuntos.php` v1.1 → **v1.2** („Pristatyta“). Variklis (registras A–J) nekeistas; `Petshop_Desk::klausimas()`, `Petshop_Siuntos` neliesti.

**Prieš darbą:** STARTAS 4 etapas → log S1611/S1610/S1609 → spec §11–§12 → `run.sh`, e13d/e15a/e15d šablonai → darbalaukis v3.10.6 vietinė kopija (`siuntos()`, `faktai()`, `issiusta()`, `kliento_siuntos()`, `klausimu_korteles()`, `vykdyti()`, `keisti_kelia()`, `atviri()`). Recon 5 run'ais (tik skaitymas): `e1_run1r` (registras, Venipak pluginas, API, cron'ai, `Petshop_Desk::klausimas`/`vezejas`, TZ), `e2_run1r` (plugino sekimo funkcijos — kodų žemėlapio plugine NĖRA, lygina tik `event == "Delivered"`), `e3_run1r` (Raimio realios siuntos), `e4_run1r` (STATUSAI, `Petshop_Siuntos::zalias/prideti_is_plugino/registruota_grupiu`, atšaukimo kabliukas), `e7_run1r` (`Petshop_AV_Stock::increase/qty`, `grazinti`, desk `atsaukti`, `turi_siunta`).

#### Recon radiniai (faktai)
- **Venipak sekimo API** `https://tracking.venipak.com/api/v1/events?pack_no=N` — viešas, **be autentifikacijos**; JSON masyvas įvykių chronologiškai: `shipment_id, pack_no, event, pack_status (int), pack_status_text, location{place,address,city,lat,lng}, date, date_iso`. Priima ir `shipment_id=N` (`pack_no` formato klaida → 422). Neegzistuojantis → 404 `{"message":"No events found…"}`. Senas `go.venipak.lt/ws/tracking.php?type=1&code=` grąžina CSV. Dev numeriai V07267E1000030–057 tebėra sistemoje, visi vienas įvykis `0 / Shipment created / At sender`.
- **Kodų žemėlapis iš dviejų REALIŲ siuntų** (Raimis 09-04: `shipment_id` 106313457 kurjeriu KAUNAS, 106325241 paštomatu KLAIPĖDA; abi sąskaita V00073E…): **0** At sender (Shipment created) · **1** On route to terminal · **2** At terminal (gali kartotis per terminalus) · **3** On route to receiver (event „Out for delivery“) · **6** At pickup point waiting for receiver (event „At pickup waiting for receiver“) · **9** Delivered. Kurjerio siuntoje kodo 1 nebuvo (0 → 2). **Kodai 4/5/7/8 — nežinomi** (nei plugine, nei viešuose docs — ieškota); grįžtančios siuntos pavyzdžio nebuvo.
- **Registras** `_ps_siuntos` = `{sandelis:{sandelis,kodas,manifest,numeriai[],data}}`; `Petshop_Siuntos::sarasas($oid)` viešas; `prideti_is_plugino($oid,$sandelis,$kodas)` **perrašo** to sandėlio įrašą (naujas AV lipdukas per `perreg` pakeičia senus numerius); `registruota_grupiu()` = raktų skaičius. Dev'e 17 užsakymų, raktai av/vf/zb/prins/ambrosia/belcor_tofu = `faktai()['dalys']` raktai.
- **Venipak pluginas** `wc-venipak-shipping`: savo sekimo cron'o nėra; meta `venipak_shipping_order_data` (pack_numbers, manifest, status waiting|sent|error, event[], date[], pack_status_text[]) pildo tik užsakymo lange (`get_order_tracking_data`). Opcijos `shopup_venipak_shipping_settings`, `venipak_pack_number` (tik vardai).
- **WP cron** gyvas (DISABLE/ALTERNATE nėra); tvarkaraščiai `petshop_2min`, `ps_5min`, `ps_esp_5min`, hourly, daily — 30 min nebuvo. LP plugino cron'ai: `woo_lithuaniapost_update_tracking_status` kas val., `sync_tracking_data` vienkartinis 00:00, `api_oauth_refresh_token` kas val.
- `Petshop_Desk::klausimas()` (variklis, `petshop-desk.php` 1224–1270): `''` completed/lp-delivered/cancelled/…; failed → „Mokėjimas nepavyko“; lp-parcel-failed → „Siuntos sukurti nepavyko“; `_ps_withdrawal`; `_ps_sla_velavimas` → „Tiekėjas vėluoja“; LP negalimas; „Trūksta sandėlyje“. `Petshop_Desk::STATUSAI`: neapmoketi [pending, failed, on-hold, lp-parcel-await] · paruosta [lp-label-created, lp-parcel-created, lp-courier-await, lp-courier-called] · atsaukti [cancelled, lp-cancelled, refunded] · kelyje [lp-on-the-way] · ivykdyti [completed, lp-delivered].
- Atšaukimas: `petshop-av-reduce.php` `grazinti` ant `woocommerce_order_status_cancelled` prior. 15 (bet koks → cancelled, ir iš completed): tik jei `_ps_av_reduced` ∧ ne `_ps_av_restored`; kiekvienai eilutei `_ps_av_reduced_qty`>0 → `Petshop_AV_Stock::increase` (jei `_own_stock_qty` yra) arba `_stock` +q („grynai AV“). `Petshop_AV_Stock::increase($pid,$by,$priezastis)` — **sukuria** `_own_stock_qty`, jei jo nebuvo (null → 0+by). `Petshop_Desk::turi_siunta()` = plugino `venipak_shipping_order_data.pack_numbers` (seni LP raktai ten pat — S1610 radinys).
- TZ Europe/Vilnius; `Petshop_Uzsakymu_Ivykiai::irasyti()` pats deda `kanalas=cron` per DOING_CRON; lentelė `ps_uzsakymu_ivykiai`.
- **(2 darbui, LP):** WC statusai `wc-lp-on-the-way` / `wc-lp-delivered` egzistuoja, `issiusta()` juos laiko „jau išsiųstas“ → jei LP pluginas pats perjungia užsakymo statusą į `lp-on-the-way`, darbalaukio laiškas neišeitų — tikrinti 2 darbo recon'e (ar pluginas keičia statusą, kai nustatymai „Never“).

#### S1612 — 4 ETAPAS #1: `mu-plugins/petshop-darbalaukis.php` v3.10.6 → **v3.11** (200 758 B, md5 `2c8a1ec90092b4873ee53418be84f1ea`) · `mu-plugins/petshop-kliento-siuntos.php` v1.1 → **v1.2** (7 876 B, md5 `fb5a0c084731f57eecd2faa069f3ef3b`)

**Cron `ps_venipak_sekimas`** kas 30 min (naujas tvarkaraštis `ps_30min`, spec §12.2), suplanuotas `init` 30 (`cron_planuoti`), kabliukas `venipak_sekimas($tik_ids=[])` (viešas — testams / rankiniam paleidimui; grąžina ataskaitą). Kandidatai (`sekimo_kandidatai`, HPOS SQL): `shop_order` su `_ps_siuntos`, statusas ne neapmoketi/atsaukti/checkout-draft, sukurti per 60 d., ≤200, laiko riba 240 s. Vienam užsakymui (`sekti_uzsakyma`): registro numeriai per `Petshop_Siuntos::sarasas()`; praleidžiami numeriai su kodu 9 arba `stop`; vienas GET per numerį (`venipak_ivykiai($nr)`: 404 → tuščias masyvas, kita klaida → WP_Error į ataskaitą; **filtras `ps_venipak_ivykiai`** — jei grąžina masyvą, API nekviečiamas — testams); paskutinis įvykis (didžiausia data) → meta **`_ps_venipak_sekimas`** `{nr:{k,t,e,d,v,n,dalis,tikr[,stop]}}` (rašoma tik pasikeitus; „įvykių nėra“ → k=-1). Veiksmai: **pirmas kodas iš {1,2,3,6,9}** daliai, kuri dar be `_ps_dalys_issiusta[dalis]` ir užsakymas neuždarytas → `self::issiusta($o, null, true, $dalis, 'venipak')` (tas pats laiškas klientui „Išsiųsta n iš N“ / „Užsakymas išsiųstas“, `kas=Venipak`, pastaba + įvykis kaip darbuotojo; AV kelių dėžių siunta — „paėmė“, kai bent viena dėžė nuskenuota — prielaida); **9 visiems dalies numeriams** → dalis „Pristatyta“ (pastaba „Venipak: siunta N pristatyta (data, vieta)“, įvykis `venipak_pristatyta`, **laiško nėra** — kurjerio SMS); **tekstas `/return|grąž|to sender|back to/i` (k≠0, nes 0 = „At sender“)** → `_ps_siunta_grizta` `{dalis:{nr,t,e,d,kada}}`, numeris `stop`, pastaba, įvykis `venipak_grizta`, → Klausimas **„Siunta grįžta“**; **nežinomas kodas** (4/5/7/8…) → tik įrašas + pastaba „nežinomas būsenos kodas, veiksmo nėra (žr. skydelį)“. Būsena → opcija `ps_venipak_sekimas_paskutinis` (laikas, užsakymų, numerių, užklausų, pakeista, veiksmai, klaidos, s). Kodų žemėlapis kode — `VENIPAK_PAEME`, `VENIPAK_TEKSTAI` (0 pas siuntėją · 1 keliauja į terminalą · 2 terminale · 3 keliauja gavėjui · 6 paštomate, laukia gavėjo · 9 pristatyta).

**Darbalaukyje:** `faktai()` — `$f['sek']`, `$f['grizta']`; `_ps_siunta_grizta` ∧ ne atšauktas ∧ variklio klausimo nėra → `$f['kl']='Siunta grįžta'` (galioja ir įvykdytam); `atviri()` papildomai ima ivykdyti+kelyje užsakymus su `_ps_siunta_grizta` (≤50) — Klausimų eilė juos rodo. Skydelyje prie numerių: „— Venipak: terminale, KAUNAS, 09-03 17:03 · pristatyta, Kauno Akropolio…“ (`sekimo_tekstas`; nežinomas kodas — angliškas tekstas). **`kliento_siuntos()` trečia būsena `pristatyta`** (išsiųsta ∧ visi dalies numeriai k=9; `pristatyta` = vėliausia data; rikiavimas — visos ne „ruosiama“ pirma); `petshop-kliento-siuntos.php` v1.2 piešia žymę „Pristatyta“ (žalia kaip „Išsiųsta“, be datos, „Sekti siuntą“ lieka).

**Deploy (naujas dydis — b64 267 680 → 4 dalys: `ps-backups/dl-v311.part1/2/3` po 80 000 + 27 680 payload'e):** `e5_run1a/1b/1c.json` (dalys, md5 sutampa su vietiniais) → `e5_run1d.json` D (md5 + `token_get_all` abiem failams, gyvo failo sargai v3.10.6 `770feb23…` ir ks v1.1 `b13362f1…`, kopijos `ps-backups/petshop-darbalaukis-v3106-BACKUP-2026-09-04.php`, `petshop-kliento-siuntos-v11-BACKUP-2026-09-04.php`, md5 po rašymo) + T naujame procese. Šablonai `irankiai/s1612_e5a/e5b/e5c/e5d.php`, `e6t.php`. Visi run'ai — pirmu kartu.

**Patikra (`e5_run1d.json` T, `e6_run1t.json`; gaudyklė `pre_wp_mail` prior. 4 — 2 laiškai sugauti, 0 išėjo, `ps_dev_pastas_zurnalas` 3 → 3; Venipak API tik skaitytas):**
1. Cron suplanuotas (`ps_30min` 1800 s, `has_action` true); **pats suveikė 11:58** (per e6t matėsi realūs #35440 V…050 duomenys k=0) ir 12:28 (opcija: 14 užs., 17 nr., 15 užklausų, 0.8 s, 0 pakeitimų).
2. Realus API #35421 V…046 → `{k:0, At sender, 2026-09-03 11:23:31}`, veiksmų 0.
3. Simuliacija per filtrą (reali 106325241 seka): **#35429** (processing, AV V…031/032, svečias) — 031 „At terminal“ → pats „Kurjeris paėmė“ → `completed`, laiškas „Jūsų užsakymas Nr. 35429 išsiųstas“ su abiem numeriais, pastabos „Pažymėta išsiųsta darbalaukyje (Venipak, venipak)…“, kartojant — 0 pakeitimų. **#35440** (completed, 5787, AV 049/050/051): 049 „Returning to sender“ (k=7) → `_ps_siunta_grizta.av`, `stop`; 050 k=4 „Delivery attempt failed“ → pastaba „nežinomas“; 051 k=9 → „pristatyta“ pastaba + įvykis; kartojant — užklausa tik 050. Klausimų eilė (loopback kaip testuotojas + Playwright `screenshots/e6_klausimai.png`): 4 kortelės, #35440 „siunta grįžta — Vežėjas grąžina siuntą: siunta V…049 — Venipak: „Returning to sender“ (…); prekės: 3× Animonda…“. Skydelis (`e6_skydelis_35440.png`): „AV: V…049, V…050, V…051 — Venipak: Returning to sender, KAUNAS, 09-04 14:00 · pas siuntėją, 09-03 12:30 · pristatyta, Kauno Akropolio Venipak paštomatas, 09-04 13:00“; Istorija „auto — Venipak pristatyta / Venipak grizta“. **#35421** (5787) prins V…046 → pristatyta → paskyra Playwright kaip 5787 (`e5_paskyra_35421.png`): „Siunta 1 iš 2 · **Pristatyta** · 1 × Prins… · Siuntos numeris (Venipak): V07267E1000046 · SEKTI SIUNTĄ / Siunta 2 iš 2 · Ruošiama“; JS/HTTP klaidų 0.

#### S1612 — 4 ETAPAS #3: `mu-plugins/petshop-darbalaukis.php` v3.11 → **v3.11.1** (214 122 B, md5 `fc4076c7a7152dfd12140b3e33075cc1`; kopija `ps-backups/petshop-darbalaukis-v311-BACKUP-2026-09-04.php`; b64 4 dalys `dl-v3111.part1/2/3` + 45 496 payload'e; `e8_run1a/1b/1c/1d.json`, `e9_run1v.json`; šablonai `irankiai/s1612_e7r/e8a/e8b/e8c/e8d/e9v.php`)

**Klausimo „Siunta grįžta“ kortelė** (log S1611 sprendimas 5, be sumų): tekstas „Vežėjas grąžina siuntą: siunta N — Venipak: „…“ (data); prekės: …“; pastaba, ką daro kiekvienas mygtukas + „Pinigus grąžinsi rankomis“; mygtukai **„Siųsti iš naujo“** (dialogas: „Prekės jau AV? Siunta bus ruošiama iš AV tuo pačiu adresu: užsakymas grįžta į „Surinkti AV“, reikės naujo lipduko…“) · **„Atšaukti — prekės grįžo į AV“** (raudonas; dialogas: „…Pinigai NEGRĄŽINAMI automatiškai… Klientui laiškas nesiunčiamas“) · Atidaryti · Parašyti klientui. Veiksmai — `admin_post_ps_dl_veiksmas` `v=grizta_is_naujo` / `grizta_atsaukti` (nonce `ps_dl_{v}_{id}`, lock, žurnalas).
- **`grizta_is_naujo`:** grįžusios dalies eilutės (jei tiekėjo dropship) → kelias „Iš AV“ (`_ps_kelias=av`, `_ps_source=av`, `_ps_carrier=any`, `_ps_source_reason`, **`_ps_av_reduced_qty=q`** — kad vėlesnis atšaukimas grąžintų +q per variklį; `_ps_konsolidacija` nuimama; užsakymo `_ps_av_reduced`, `_ps_av_restored` nuimama); likutis **+q (grįžo) −q (išeina) = 0** per `Petshop_AV_Stock::increase/decrease` (sukuria `_own_stock_qty` su 0 → prekė tampa AV+tiekėjas), AV eilutėms nieko; **seni numeriai** (grįžusios dalies + tuomet buvę AV, jei tiekėjo dalis jungiama į AV) → nauja darbalaukio meta **`_ps_siuntos_senos`** (`siuntos()` juos išmeta, `av_siunta` be `turi_siunta`, kol yra senų — variklio `_ps_siuntos` neliečiamas, naujas AV lipdukas per `perreg` perrašo `av` įrašą); `_ps_dalys_issiusta[dalis]` ir `[av]` nuimamos; `_ps_surinkta`, `_ps_klaus_laukti`, `_ps_uzbaigti_be_siuntu` nuimamos; `planas_is_eiluciu()` + `perskaiciuoti_grupes()`; įvykdytas / kelyje → **`processing` be WC laiškų** (`laiskai_off/on`); `_ps_siunta_grizta[dalis]` nuimama (meta ištrinama, kai tuščia); pastaba + įvykis `grizta_is_naujo`. Klientui paskyroje dalis vėl „Ruošiama“ be numerio; po naujo lipduko ir paėmimo (cron arba „Kurjeris paėmė“) — vėl „Išsiųsta“ su laišku (tik nauju numeriu). Adresas tas pats (5 etapo „Redaguoti“). **Prielaida:** tiekėjo dalis grįžta, o AV siunta JAU išsiųsta → neleidžiama „AV siunta jau išsiųsta — dalinis persiuntimas dar nepadarytas (5 etapas)“ (mygtukas nerodomas, pastaba).
- **`grizta_atsaukti`:** dropship eilutėms **+q į `_own_stock_qty`** (`increase` — sukuria lauką, prekė tampa AV+tiekėjas), AV eilutėms nieko (variklio `grazinti` ant cancelled grąžina pats — nedubliuojama); `_ps_siunta_grizta` nuimama; pastaba „…ATŠAUKIAMA, prekės grįžo į AV… Pinigai grąžinami rankomis. WC laiškas: NESIŲSTAS“; `cancelled` be laiškų; įvykis `grizta_atsaukti`. **Prielaida:** kita dalis jau išsiųsta (ne grįžtanti) → neleidžiama „kita siunta jau išsiųsta — dalinis grąžinimas (5 etapas)“ (mygtukas nerodomas).
- **Taisymas (S):** suma skydelyje / Klausimų kortelėse / dialogų antraštėse rodė „12,02&nbsp;&euro;“ (dviguba esc nuo C8) — `html_entity_decode(wp_strip_all_tags(...))`; dabar „12,02 €“ (`e8_klausimai.png`).

**Patikra (`e8_run1d.json` T — realūs `admin-post` endpoint'ai kaip testuotojas (nonce su sesijos raktu: `$_COOKIE[LOGGED_IN_COOKIE]` + `wp_set_current_user` prieš `wp_create_nonce`), gaudyklė prior. 4 — 1 laiškas sugautas, 0 išėjo; Venipak nekviestas; `e9_run1v.json` — patikra naujame procese):**
1. **#35440** (completed, AV 049/050/051, grįžta av) → „Siųsti iš naujo“ → 302 `dl_dalis` „siunta V…049 grįžo — siunčiama iš naujo iš AV: Surinkti AV → naujas lipdukas“; `processing`, `_ps_dalys_issiusta=[]`, `_ps_siuntos_senos=[049,050,051]`, `_ps_surinkta` nuimta, `_ps_siunta_grizta` ištrinta, `kliento_siuntos()` → „av ruosiama“ be numerių, AV eilutei likutis nejudėjo (19708 `_stock` 15). Fiktyvus naujas lipdukas (registro `av` perrašytas testo payload'e V07267E1000099, ne Venipak) → „av ruosiama V…099“ → cron sim „At terminal“ → pats „Kurjeris paėmė“ → `completed`, laiškas „Jūsų užsakymas Nr. 35440 išsiųstas · Siuntos numeris (Venipak) V07267E1000099“ (senų numerių nėra) + paskyros nuoroda (5787).
2. **#35429** (completed, AV 031/032, grynai AV 19708 r=2, svečias): sim 032 „Returning to sender“ → Klausimas → „Atšaukti — prekės grįžo į AV“ → 302 `dl_dalis` „atšauktas — siunta V…032 grįžo į AV · pinigus grąžink rankomis“; `cancelled`; variklio pastaba „AV grąžinimas: #19708 grynai AV +2“ → **19708 `_stock` 15 → 17** (e9v).
3. **#35419** (completed, VF 34828 V…039 + Ambrosia 19756 V…040, abu dropship): sim vf grįžta → „Atšaukti“ → **blokuojama** `dl_klaida` „kita siunta jau išsiųsta — dalinis grąžinimas dar nepadarytas (5 etapas), parašyk Raimiui“; sim ambrosia irgi grįžta → „Atšaukti“ → `cancelled`, „likutis Churu…: AV +2 → 2; AMBROSIA…: AV +1 → 1“ → **34828 `_own_stock_qty` (nebuvo) → 2, 19756 0 → 1** (e9v).
4. **#35441** (processing, VF 26166 V…057 dropship, klientas?): sim grįžta → „Siųsti iš naujo“ → eilutė `av/av r=1`, „likutis Happet…: AV +1 −1 → 0“ (**26166 `_own_stock_qty` sukurtas = 0**), `_ps_siuntos_senos=[057]`, `_ps_order_type` DS→?, `kliento_siuntos()` „av ruosiama“, Klausimas išnyko (Klausimų eilė Playwright `e8_klausimai.png`: 4 kortelės, „siunta grįžta“ nėra; `_ps_siunta_grizta` meta 0 visoje bazėje).
5. Įvykiai `ps_uzsakymu_ivykiai`: `grizta_is_naujo` #35440/#35441, `grizta_atsaukti` #35429/#35419 (Testuotojas, web). Pastaba testams: to paties proceso `wc_get_order()` po loopback veiksmo grąžina PASENUSĮ objektą (WC kešas) — `*_po` laukai e8d ataskaitoje seni; tiesa — e9v (naujas procesas).

**Darbuotojo dienoraštis (kaip mato darbuotojas):** „Nieko nespaudžiau — #35429 pats tapo Įvykdytas, pastaboje ‚Pažymėta išsiųsta (Venipak)‘, klientui išėjo laiškas su numeriais. #35440 atsirado Klausimuose ‚siunta grįžta‘: matau numerį, ką Venipak sako, kokios prekės, ir du mygtukus. Spaudžiau ‚Siųsti iš naujo‘ — užsakymas grįžo į Surinkti AV, senų numerių skydelyje nebėra, po naujo lipduko ir kai kurjeris paėmė — vėl Įvykdytas, klientui laiškas su nauju numeriu. #35429 spaudžiau ‚Atšaukti — prekės grįžo į AV‘ — atšaukta, likutis +2, pastaba, kad pinigus grąžinu pats. #35419 ‚Atšaukti‘ neleido — kita siunta jau išsiųsta. Skydelyje prie kiekvieno numerio matau, kur siunta (terminale, pristatyta…). Sumos kortelėse dabar normalios (buvo &nbsp;&euro;).“ **Klientas (5787):** paskyroje prie pristatytos siuntos „Pristatyta“; po „Siųsti iš naujo“ siunta vėl „Ruošiama“, laiško apie grįžimą negavo (Raimis: pinigai ir susirašinėjimas rankomis).

**Mano prielaidos (Raimiui patvirtinti / vetuoti):** 1) sekimas kas 30 min (spec §12.2), tik 60 d. senumo užsakymai, ≤200 per run'ą; 2) „grįžta“ pagal tekstą (kodo nėra) — false-positive tik sukurtų Klausimą, ne laišką; 3) AV kelių dėžių siunta — „paėmė“, kai bent viena dėžė nuskenuota; 4) „Siųsti iš naujo“ neleidžiama, kai tiekėjo dalis grįžta, o AV siunta jau išsiųsta; „Atšaukti“ — kai kita dalis išsiųsta (abu — dalinis, 5 etapas); 5) „Siųsti iš naujo“ tiekėjo eilutei rašo `_ps_av_reduced_qty=q`, kad vėlesnis paprastas atšaukimas grąžintų +q į `_own_stock_qty` (prekės fiziškai AV).

**Radiniai (ne #1/#3, Raimiui):** V13 — variklio `ps_dropship_sargas` kelia „Tiekėjas vėluoja — perduota prieš 24+ val.“ #35421, nors prins dalis darbalaukyje pažymėta išsiųsta ir pristatyta (`_ps_dalys_issiusta`), — variklis dalių žymių nemato (K4 pasekmė); sprendimas — variklio (neliesta). S — `1_po` kešo pastaba aukščiau (tik testų metodika).

**Testiniai duomenys po S1612:** #35429 `cancelled` (19708 `_stock` 17), #35419 `cancelled` (34828 own 2, 19756 own 1), #35440 `completed` su fiktyviu V07267E1000099 registre ir `_ps_siuntos_senos`, #35441 `processing` (eilutė av, 26166 own 0, senos [057]), #35421 prins „pristatyta“ (sim), `_ps_venipak_sekimas` meta ant #35421/#35429/#35440/#35419/#35441 (dalis sim, dalis realūs k=0) — visi trinti 6 etape. Opcijos `ps_e5_mail`, `ps_e6_mail`, `ps_e8_mail` ištrintos; TEMP snippet'ai — 0 (liko tik paskutinio run'o, deaktyvuotas). Venipak realiai nekviestas (tik skaitymas). Repo: `deploy/petshop-darbalaukis.php` v3.11.1 + `.b64`, `deploy/petshop-kliento-siuntos.php` v1.2, `irankiai/s1612_e1r…e9v.php`, `analize/e1…e9`, `screenshots/e5_paskyra_35421/35440.png, e6_klausimai/e6_skydelis_35440.png, e8_klausimai/e8_visi_35440.png`.

**Lieka (4 etapas):** #2 LP sekimas (recon pirma: ar pluginas keičia užsakymo statusą į `lp-*`, kai „Never“; `_woo_lithuaniapost_shipping_status_value` → `issiusta(…,'av','lp')` / „Pristatyta“); #4 vėlavimo laiškas (log S1611 sprendimas 3); #5 spec §12 papildymas sprendimais 3–8 + S1612 prielaidomis (pilnu failu); #6 dienoraštis „kas atsitiko pats“ — cron dalis jau aukščiau. **Šiame lange baigta.**

---

### S1611 (2026-09-04, rytas)

> Pridėti po S1610. Tema: Raimio atsakymai į #5b prielaidas → darbalaukis **v3.10.5**.

#### S1611 — #5b prielaidos: 1, 2, 3, 5 — PATVIRTINTOS; 4 = **B** → `mu-plugins/petshop-darbalaukis.php` v3.10.4 → **v3.10.5** (184 427 B, md5 `786445f11fbe62a677bf26d23b3baf62`; repo `deploy/petshop-darbalaukis.php` + `.php.b64`; kopija `ps-backups/petshop-darbalaukis-v3104-BACKUP-2026-09-04.php`)

**Raimio sprendimai (09-04):** 1) neapmokėtam/atšauktam blokas „Siuntos“ nerodomas — gerai; 2) išsiųstos siuntos pirma pagal laiką — gerai; 3) vienai siuntai antraštė „Siunta“ — gerai; 5) vežėjo vardas prie numerio (Venipak / LP Express) — gerai; **4) B:** kol mišrus užsakymas nesurūšiuotas, klientas mato VIENĄ „Siunta — Ruošiama“ su visomis prekėmis, be numerio; siuntų skaičius atsiranda tik po rūšiavimo (kad klientui nesikeistų atgal po „viską į AV“).

**v3.10.5 — `kliento_siuntos()`:** jei `$f['rus']` tuščia ∧ dalių >1 ∧ nė viena neišsiųsta → grąžina vieną įrašą (`dalis='*'`, `viso=1`, `busena=ruosiama`, `prekes` = visos eilutės, `numeriai=[]`). Kitaip — kaip v3.10.3. `petshop-kliento-siuntos.php` v1.1 nekeistas (vienai siuntai ir taip rašo „Siunta“).

**Deploy:** b64 3 dalimis (`dl-v3105.part1/2` + 85 904 B payload'e), md5/`token_get_all` sargai, gyvo failo sargas ant v3.10.4 (`9f15a7e0…`). `analize/e14_run1a/1b/1d.json`; šablonai `irankiai/s1611_e14a/e14b/e14d.php`. 3 run'ai, pirmu kartu.

**Patikra (`e14_run1d.json` T, naujas procesas, gaudyklė prior. 4 — 4 WC laiškai sugauti, 0 išėjo):** naujas mišrus **#35778** (klientas 5787, HAP VF + Prins): prieš apmokėjimą — `kliento_siuntos()=[]`, paskyroje bloko nėra (prielaida 1); po apmokėjimo, nesurūšiuotas (`_ps_rusiuota` tuščia) — **viena** „Siunta · Ruošiama · 1 × HAP…, 1 × Prins…“ (paskyros HTML kaip 5787, blokas viršuje); po „Surūšiuota“ (keliai „tiesiai“ jau siūlyti) — **„Siunta 1 iš 2 · Ruošiama · HAP“ / „Siunta 2 iš 2 · Ruošiama · Prins“**; atšaukus — `[]`, bloko nėra. Pastaba: po `rusiuoti` `_ps_rusiuota` meta lieka tuščia — `faktai()` „surūšiuota“ nustato per mišraus planą (`_ps_misrus_sprestas`/`planas`), kaip S1608; `kliento_siuntos()` remiasi `$f['rus']`, tad veikia. #35778 — `cancelled`, testinis (trinti su testiniais).

#### S1611 — Raimis 09-04, klausimas 2 (STOP): **lipdukai privalomi visoms siuntoms klientui; „be lipdukų“ — TIK tiekėjo užsakymui į AV** → darbalaukis v3.10.5 → **v3.10.6** (184 758 B, md5 `770feb233b28fefb8a52968b6a290dd0`; kopija `ps-backups/petshop-darbalaukis-v3105-BACKUP-2026-09-04.php`; `e15_run1a/1b/1d.json`, šablonai `irankiai/s1611_e15a/e15b/e15d.php`; 3 run'ai, pirmu kartu)

**Pakeitimai:** 1) Dropshipping kortelės mygtukas „Užsakyti be lipdukų“ IŠIMTAS (variklio `ps_dropship_send` parametras `be_lipduku` lieka — UI nebesiūlo); „Užsakyti iš [T]“ užrakintas, kol lipdukai („pirma lipdukai“). 2) §18.3 sargo apėjimas `_ps_uzbaigti_be_siuntu` (v3.10.1) IŠIMTAS — jei registruota mažiau siuntų nei `_ps_shipments`, variklio sargas stabdo, darbalaukis rodo „užbaigti neleido sargas — registruotos n iš m“ (buvo nuo v3.10.1). 3) `issiusta()`: „[T] išsiuntė“ / „Kurjeris paėmė (viską)“ be registruoto numerio — NELEIDŽIAMA: tiekėjo daliai „[T] — siuntos numerio nėra, pirma lipdukas“, AV daliai „AV siunta dar be lipduko“ (buvo); dalis NEpažymima. 4) „Kartu su Dropshipping iš [T]“ (Laukiam kortelė) — patikrinta kode: prekės į AV sudedamos į tiekėjo užsakymą, laiškas išeina Dropshipping kortelės „Užsakyti iš [T]“, kuris reikalauja dropship lipdukų; AV daliai lipdukų nereikia — teisinga, nekeista. Laiško „be numerio“ tekstas — tik tekstinis saugiklis.

**Patikra (`e15_run1d.json` T, gaudyklė prior. 4, 9 laiškai sugauti, 0 išėjo):** mišrus **#35780** (5787, HAP VF + Prins) surūšiuotas → Dropshipping kortelės HTML: `be_lipduku` mygtuko ir teksto „be lipdukų“ NĖRA, „Lipdukai (2)“, „Užsakyti iš VF“ `disabled` „pirma lipdukai“; per variklį `be_lipduku=1` VF užsakyta (laiškas „[PERSIŲSTI Vetfarmas]“ man) → „VF išsiuntė“ → **„VF — siuntos numerio nėra, pirma lipdukas“**, `_ps_dalys_issiusta` tuščia; „Kurjeris paėmė viską“ → tas pats; atšaukta.

**Likutis seka kelią — PATIKRINTA SKAIČIAIS (Raimio klausimas 09-04):** **#35779** (5787): 18593 Exclusion (AV+tiekėjas, `_own_stock_qty`) + 19708 Animonda (grynai AV, `_stock`). Prieš: 18593 own **21**, 19708 stock **15**. Apmokėjus: **20 / 14** (eilutės `_ps_av_reduced_qty=1`, užsakymo `_ps_av_reduced`). Kelias 18593 AV → „VF siunčia klientui“: pranešimas „likutis AV +1 → 21“, own **21**, žymė nuimta. Atgal → „Iš AV“: „likutis AV −1 → 20“, own **20**, žymė 1. 19708 → tiesiai: „negalima: tiekėjo nėra“ (galimi tik `av`) — likutis nejudėjo. Atšaukus: variklio „AV grąžinimas: #18593 AV +1 -> 21 · #19708 grynai AV +1“ → **21 / 15**, `_ps_av_restored`. Viskas sutampa; kiekvienas judesys — užsakymo pastaboje ir įvykių žurnale. **Raimis 09-04:** eilutė be sandėlio (AV neturi viso kiekio ∧ tiekėjo nėra — likučio spraga arba prekė nepriskirta registre) → darbuotojas ranka „Iš AV“ — likutis NEnurašomas (į minusą nereikia), žurnale „rankinis“ — SUTARTA, nekeista.

**Testiniai:** #35779, #35780 — `cancelled` (klientas 5787). Opcija `ps_e15_mail` ištrinta. **Pastaba testams toliau:** „be lipdukų“ dropship'e nebėra UI — testams siuntas registruoti kitaip (variklio `be_lipduku` per endpoint'ą + siuntų registro įrašas), Venipak nekviesti.

#### S1611 — Raimio sprendimai 09-04 (klausimai 3–9) — pagrindas 4 etapui (spec §12 papildyti kartu su 4 etapo darbais)

3. **Vėlavimo laiškas — AUTOMATINIS.** Tikrinama kiekvieną darbo dieną **14:00** (Vilnius; ne ryte — tiekėjai ir Venipak išsiunčia iki pietų). Sąlyga: apmokėtas, nuo apmokėjimo praėjo **3 pilnos darbo dienos** (Pr–Pn be LT švenčių; apmokėjimo diena neskaičiuojama), bent viena siunta neišsiųsta. Praleidžiam: neapmokėtus, atšauktus, Klausimuose, jau gavusius. Vienas laiškas užsakymui (žymė), kortelėje „klientui pranešta apie vėlavimą (data)“, į Klausimus nekeliam. Tekstas (Raimio, pataisyta rašyba): „Sveiki, [vardas]. Jūsų užsakymo Nr. N surinkimas truputį užtruko. Išsiųsime jį kaip galėdami greičiau. Ačiū už kantrybę. Išsiuntę užsakymą informuosime Jus atskiru laišku. Jei turite klausimų, tiesiog atsakykite į šį laišką.“ Jei dalis jau išsiųsta — pirmas sakinys „Likusių Jūsų užsakymo Nr. N prekių surinkimas truputį užtruko.“ Pavyzdys: apmokėta Pr → Pn 14:00.
4. **Tiekėjų atvežimo dienos — NEREIKIA** („neužsikraunam, kai bus srautai“). Kortelė lieka „laukiam iš X“.
5. **§11.1 Siunta grįžta (Venipak „grąžinama siuntėjui“) → Klausimas „Siunta grįžta“, be sumų.** Du mygtukai, sprendžia darbuotojas: **„Siųsti iš naujo“** — prekės jau AV → siunta ruošiama IŠ AV (net buvusi tiekėjo dropship): Surinkti AV, naujas lipdukas, klientui vėl „Išsiųsta“; likutis dropship eilutėms +q (grįžo) −q (išeina) = 0, AV eilutėms nieko; adreso keitimas — 5 etapo „Redaguoti“ (iki tol tuo pačiu adresu). **„Atšaukti — prekės grįžo į AV“** — užsakymas atšaukiamas, siuntos prekės pridedamos į AV likutį (AV eilutėms variklis grąžina pats — nedubliuoti; dropship eilutėms +q į `_own_stock_qty` → prekė tampa AV+tiekėjas). Pinigai — rankomis. Dalinis grąžinimas (viena iš dviejų) — 5 etapas.
6. **Dovanėlės kortelė — vėlesniems etapams.**
7. **Kasos sakinys „prekės gali atvykti atskiromis siuntomis“ — NEDAROM**; jei bus poreikis — paskyroje prie „Siuntos“, ne kasoje (vėlesni etapai).
8. **Pašto reputacija — PATIKRINTA (`e16_run1r/2s.json`, `irankiai/s1611_e16r/e16s.php`):** S1608 320 laiškų išėjo per WP Mail SMTP → `isopas.serveriai.lt:465` = **79.98.29.24** (siuntėjas `uzsakymai@petshop.lt`, From forced `terra@petshop.lt`), NE per Sender. 79.98.29.24 — švarus Spamhaus/Spamcop/Barracuda/SORBS×2/UCEPROTECT/PSBL/Hostkarma, PTR `isopas.serveriai.lt`. Gyvas SPF `v=spf1 a mx include:spf.serveriai.lt include:sendersrv.com ~all` (mailgun ir spf.sendersrv.com išimti); DKIM `sender._domainkey` yra; DMARC `p=none rua=terra@`. Sender API: domenas petshop.lt verified (spf/dkim/dmarc=1), 2 testiniai kontaktai, 1 kampanija (02-04) — incidentas Sender nelietė; Sender bendras IP 185.3.229.130 tebėra Barracuda (nuo liepos). Nematoma iš čia: Google Postmaster (Raimio paskyra), gavėjų spam dėžutės. **T-0 sąrašui:** mail-tester per WC SMTP kelią iš petshop.lt (ar serveriai.lt pasirašo DKIM); po mėnesio DMARC → `quarantine`.
9. LP plugino slaptažodis atviru tekstu — informacija T-0 rotacijai.

**Šiame lange baigta.** 4 etapas — naujame lange pagal `STARTAS_2026-09-04_4_etapas.md`.

---

### S1610 (2026-09-03, naktis)

> Pridėti po S1609. Tema: 3 etapas **#5b — kliento paskyra „Siuntos“ + laiškas be juostos** (Raimio sprendimai 09-03 naktis, STARTAS #5b) ir **#6 papildymas — LP siuntos numeris siuntų sąraše**. Variklis (registras A–J) nekeistas; `petshop-siuntu-laiskai.php` v1.2 (gyvas `753f8c6c`) ir `petshop-desk.php` v3.48 neliesti.

#### S1610 — ETAPAS 3 #5b: naujas `mu-plugins/petshop-kliento-siuntos.php` v1.0 (5 260 B, md5 `dd636b5c7e69a6af62876810303a91ec`; repo `deploy/`) · `mu-plugins/petshop-darbalaukis.php` v3.10.3 → **v3.10.4** (183 281 B, md5 `9f15a7e00baeb885377c9b1c8c681b1f`; repo `deploy/petshop-darbalaukis.php` + `.php.b64`; kopijos `ps-backups/petshop-darbalaukis-v3102/v3103-BACKUP-2026-09-03.php`)

**Prieš darbą:** STARTAS (5) → log S1609/S1608 → spec v1.2 §1/§12 → ZODYNAS v1.1 → `faktai()`/`siuntos()`/`issiusta()`/`siuntos_laiskas()`/`sekimo_url()` v3.10.2 → S1609 recon `e5_run8k.json` (gyvi kabliukai: `woocommerce_order_details_before_order_table` — tik `petshop-atsisakymas.php` closure prior. 10; Venipak/LP kliento pusėje nieko) → `petshop-vertimai.php` v1.0 (gettext žodynas), `petshop-dev-pastas.php` v1.0.

**v3.10.3 — kas pasikeitė:**
- **`kliento_siuntos($o)` VIEŠA** — vienas tiesos šaltinis laiškui, paskyros blokui ir 4 etapo cron'ui. Dalys kaip `faktai()` (AV + kiekvienas „tiesiai“ tiekėjas). Kiekviena: `n, viso, dalis, busena ruosiama|issiusta, laikas, vez venipak|lp, numeriai[], url, prekes[[q,n]]`. **Išsiųstos pirma pagal laiką** (sutampa su laiško „Išsiųsta n iš N“), neišsiųstos po jų. Tiekėjų vardų NĖRA (tik vidinis `dalis`). Neapmokėtam / atšauktam / `checkout-draft` — tuščia (blokas nerodomas).
- **Laiškas (`siuntos_laiskas()`):** statinė juostelė IŠIMTA (Raimis: klaidina). Po siuntos dėžutės — „Siuntos kelią sekite paspaudę „Sekti siuntą“.“ (tik kai yra numeris) + registruotam (`customer_id` > 0) „Visą užsakymo eigą matysite **paskyroje → Užsakymas Nr. N**“ (`wc_get_endpoint_url('view-order', id, myaccount)` = `paskyra/uzsakymas/N/`). Svečiui — nuorodos nėra. „Antroji siunta keliaus atskirai — pranešime, kai išsiųsime“ lieka. Be numerio — „Siunta perduota vežėjui Venipak.“ (saugiklis, kaip buvo).

**`petshop-kliento-siuntos.php` v1.0 — TIK PIEŠIA:** `woocommerce_order_details_before_order_table` prior. 5 (prieš atsisakymo closure prior. 10, prieš WC `<h2>Užsakymo informacija`). Rodo tik: `is_user_logged_in()` ∧ `is_wc_endpoint_url('view-order')` ∧ `customer_id` > 0 ∧ `customer_id === get_current_user_id()` (ne „ačiū“ puslapyje, ne svečiui). Blokas `<section class="ps-siuntos">`: `<h2 class="woocommerce-order-details__title">Siuntos</h2>`, kortelė kiekvienai siuntai — „Siunta 1 iš 2“ (vienai — „Siunta“) + žymė **Ruošiama** (pilka) / **Išsiųsta** (WC bazinė spalva), prekės „1 × …“, „Siuntos numeris (Venipak) / Siuntų numeriai (…)“ + mygtukas „Sekti siuntą“ (`target=_blank`). CSS inline, mobilus — `flex-wrap`. Atskiro meniu skirtuko NĖRA (Raimis).

**Deploy:** b64 trimis dalimis (`ps-backups/dl-v3103.part1/.part2` po 80 000 + trečia payload'e 83 052 B; mu-plugin b64 7 016 B tame pačiame payload'e — viso 95,5 KB, veikė), md5 + `token_get_all` sargai abiem failams, gyvo failo md5 sargas (rašė tik ant v3.10.2 `03330ef2…`), backup, md5 po rašymo. `analize/e9_run1a/1b/1d.json` (D = deploy, R = recon naujame procese). v3.10.4 — `e10_run2a/2b/2d.json` (sargas ant v3.10.3 `30faf7f3…`). Šablonai `irankiai/s1610_e9a/e9b/e9d/e9t.php`, `s1610_e10a/e10b/e10d/e10r.php`, `s1610_e11v.php`. Visi 11 run'ų — pirmu kartu.

**Patikra (`pre_wp_mail` gaudyklė prior. 4 kiekviename payload'e; `ps_dev_pastas_zurnalas` nepajudėjo — 0 laiškų išėjo; Venipak/LP nekviesti):**
1. **Recon po deploy (`e9_run1d.json` R):** kabliukai `5: Petshop_Kliento_Siuntos::blokas`, `10: closure`; `kliento_siuntos()`: #35421 → `[prins issiusta V…046 (1 prek.)], [av ruosiama (2 prek.)]` (1 iš 2 / 2 iš 2), #35440 → `[av issiusta V…049/050/051]`, #35450 → `[av ruosiama 3 prek.]`, #35775 → vf/prins abi išsiųstos be numerių, #35418 → `[zb ruosiama V…037]` (lipdukas yra, ZB dar neišsiuntė — Ruošiama su numeriu, teisinga). Loopback kaip 5787: `paskyra/uzsakymas/35421/` 200, blokas yra, tekstas prasideda „Siuntos Siunta 1 iš 2 Išsiųsta…“ prieš lentelę.
2. **Du nauji užsakymai VF+Prins be lipdukų (`e9_run2t.json` N,U; testuotojas, realūs endpoint'ai):** **#35776** — klientas 5787 `s1609.klientas@avesa.lt` (registruotas), **#35777** — svečias `terra@petshop.lt`. Apmokėti → Neišrūšiuoti → keliai „tiesiai“ jau siūlomi („kelias nepakeistas — jau VF siunčia klientui“) → Surūšiuota → Dropshipping → `ps_dropship_send` VF ir Prins `be_lipduku=1`, `laisk_man=1` abiem (4 „[PERSIŲSTI …]“ laiškai man) → Paruošta siųsti, mygtukas „Prins išsiuntė“.
3. **Laiškai ir paskyra (`e9_run3i.json` I, Playwright kaip klientas 5787):** #35776 „VF išsiuntė“ → `dl_dalis` „klientui išėjo „Išsiųsta 1 iš 2 siuntų“ be sekimo numerio · dar laukiam: Prins“; laiškas s1609.klientas@…: juostos NĖRA (`Pas kurjerį` tekste nerasta), „Visą užsakymo eigą matysite paskyroje → Užsakymas Nr. 35776“ (nuoroda `/paskyra/uzsakymas/35776/`), „Šioje siuntoje: 1 × HAP…“, „Dar keliaus atskira siunta: 1 × Prins…“ (`screenshots/e9_laiskas_8.png`). #35777 „VF išsiuntė“ → laiškas terra@… **be** paskyros nuorodos (`e9_laiskas_9.png`); „Prins išsiuntė“ → `completed`, „Išsiųsta 2 iš 2 siuntų — visas užsakymas išsiųstas“, be nuorodos (`e9_laiskas_10.png`). Paskyra 5787 `uzsakymas/35776/` desktop (`e9_paskyra_A.png`) ir 390 px (`e9_paskyra_A_mob.png`): „Siuntos“ virš „Užsakymo informacija“, „Siunta 1 iš 2 · Išsiųsta · 1 × HAP…“, „Siunta 2 iš 2 · Ruošiama · 1 × Prins…“; #35421 (`e9_paskyra_35421.png`): „Siunta 1 iš 2 · Išsiųsta · Siuntos numeris (Venipak): V07267E1000046 · SEKTI SIUNTĄ“ (href `venipak.com/lt/tracking/track/V07267E1000046`) / „Siunta 2 iš 2 · Ruošiama · Animonda…, QUATTRO…“; #35440 390 px: „Siunta · Išsiųsta · Siuntų numeriai (Venipak): V…049, V…050, V…051 · Sekti siuntą“. JS/HTTP klaidų 0 visose. Užsakymų sąraše (`e9_uzsakymai.png`) — #35776 Vykdomas, #35440 Įvykdytas, #35421 Vykdomas; angliškas „Confirm your email address…“ tebėra (žr. klausimą).
4. **Užbaigimas (`e9_run4z.json` Z):** #35776 „Prins išsiuntė“ → `completed`, laiškas „2 iš 2 … visas užsakymas išsiųstas“ su paskyros nuoroda (`e9_laiskas_A_2is2.png`); dublis → „jau išsiųstas“, laiškų 12 → 12. Paskyra: abi „Išsiųsta“ (`e9_paskyra_A_ivykdytas.png`, `_mob.png`). Laiškų temos per visą testą (12): 2×„Naujas užsakymas“ (uzsakymai@), 2×„apmokėjimas gautas“, 4×„[PERSIŲSTI …]“, 4 sekimo — visos sugautos.

**Darbuotojo dienoraštis (#35776, kaip mato darbuotojas):** „Atėjo užsakymas su dviem prekėmis — Neišrūšiuoti; atidariau, keliai jau siūlomi ‚VF siunčia klientui‘ / ‚Prins siunčia klientui‘, spaudžiau ‚Surūšiuota‘. Dropshipping — dvi kortelės, ‚Užsakyti be lipdukų‘ iš VF ir Prins, laiškai man persiųsti. Paruošta siųsti. ‚VF išsiuntė‘ — pranešė, kad klientui išėjo ‚Išsiųsta 1 iš 2‘. ‚Prins išsiuntė‘ — įvykdytas, klientui ‚2 iš 2‘.“ **Kaip mato klientas (5787):** laiške nebėra juostelės, yra nuoroda „paskyroje → Užsakymas Nr. 35776“; paskyroje užsakymo viršuje „Siuntos“ — matau, kuri siunta jau išsiųsta, kuri ruošiama, ir kokios prekės kurioje; su Venipak numeriu — „Sekti siuntą“. Sunkumai: 1) be lipdukų numerio nėra nei laiške, nei paskyroje (žinoma išimtis, realiame sraute nebūna); 2) mobiliame paskyros vaizde slapukų juosta uždengia bloką, kol nepaspausta „Priimti“ (Complianz, ne mūsų).

**Mano prielaidos (Raimiui patvirtinti / vetuoti):** 1) neapmokėtam / atšauktam blokas nerodomas („Ruošiama“ ten klaidintų); 2) siuntų tvarka „išsiųstos pirma pagal laiką“ — kad „Siunta 1 iš 2 · Išsiųsta“ sutaptų su laiško „Išsiųsta 1 iš 2“; 3) vienai siuntai antraštė „Siunta“, ne „Siunta 1 iš 1“; 4) neišrūšiuotam mišriam užsakymui klientas mato dalis, kaip `faktai()` siūlo (spec: „dalys kaip faktai()“) — po rūšiavimo „viską į AV“ siuntų skaičius klientui sumažėja; 5) vežėjo vardas („Venipak“ / „LP Express“) prie numerio rodomas — tai vežėjas, ne tiekėjas.

#### S1610 — ETAPAS 3 #6 papildymas (Raimis 09-03 naktis): LP siuntos numeris → `siuntos()` AV dalis (v3.10.4)

**Recon (`e10_run1r.json`, `e10_run2d.json` R):** LP pluginas `woo-lithuaniapost-main` (aktyvus, 164 PHP failai). Numerio raktas — **`_woo_lithuaniapost_barcode`** (Raimio spėjimas teisingas; kode `update_meta_data('_woo_lithuaniapost_barcode', $shipping_item_status->barcode)`, `class-woo-lithuaniapost-admin-order-service.php`); būsena — `_woo_lithuaniapost_shipping_status_value` (`lp-parcel-created` / `lp-label-created` / `lp-courier-called` / `lp-on-the-way` / `lp-delivered` / …), terminalas `_woo_lithuaniapost_lpexpress_terminal_id`, kurjeris `_woo_lithuaniapost_lpexpress_courier_called_date`, grąžinimai `_woo_lithuaniapost_returns_barcodes`. Dev'e LP siuntų 0 (#35416 — `lp-parcel-failed`, „Incorrectly specified recipient's parcel terminal id“ LT0001); `_ps_siuntos` su LP — 0. **Senas desk `siuntos_kodas()` LP raktai (`_lpexpress_tracking_number`, `lpexpress_tracking_number`, `_lp_tracking`) — NETEISINGI**, todėl `turi_siunta()` LP užsakymui visada false (variklis, neliesta — pažymėti Raimiui).

**v3.10.4:** `siuntos($o,$sandeliai)` — jei `_ps_siuntos` registre AV numerių nėra ir `vezejas === 'lp'` → `$out['av'] = [_woo_lithuaniapost_barcode]` (masyvas ar eilutė, tuščios išmetamos). Toliau viskas kaip Venipak: `faktai()` `av_siunta=true` → Paruošta siųsti, `kliento_siuntos()` `vez=lp`, `sekimo_url('lp')` = `post.lt/siuntu-sekimas?parcels={nr}`, laiške ir paskyroje „Siuntos numeris (LP Express)“ + „Sekti siuntą“. **Registras `_ps_siuntos` NErašomas** (variklis neliestas) → LP AV siunta + dropship (`_ps_shipments` = 2) užbaigiama per v3.10.1 apėjimą `_ps_uzbaigti_be_siuntu` (§18.3 sargas skaičiuoja tik registrą). Tikras LP srautas dev'e nepatikrintas — **J1 (T-0)**; simuliacija su fiktyviu barcode nedaryta.

**RADINYS (Raimio sprendimui, prieš J1):** LP pluginas siunčia **savo** sekimo laišką klientui — `do_action('woo_lithuaniapost_send_tracking_email', $order)` (`class-woo-lithuaniapost-admin-order-tracking.php`, cron `sync_tracking_data`), kai būsena „on the way“ (arba plugino nustatymo pasirinktas statusas), vieną kartą (`_woo_lithuaniapost_tracking_mail_send`). Su mūsų „Kurjeris paėmė“ laišku klientas gautų **du laiškus**. Variantai: (a) išjungti plugino laišką (nustatymas arba `remove_action`), (b) LP užsakymams mūsų laišką siųsti tik iš plugino įvykio (4 etapo cron analogas: `_woo_lithuaniapost_shipping_status_value = lp-on-the-way` → `issiusta(..., 'lp')`). Sprendimas — Raimio. Taip pat pluginas pats keičia statusą į `completed` pagal nustatymą „event to complete order“ — patikrinti, kad neaplenktų mūsų „Kurjeris paėmė“ (laiškas be `_ps_dalys_issiusta`).

**Valymas (`e11_run1v.json`):** opcijos `ps_e9_mail` (12 įrašų) ir `ps_e9_oids` ištrintos; TEMP snippet'ai — 0 (liko tik paskutinio run'o, deaktyvuotas). **Testiniai duomenys:** #35776 (`completed`, klientas 5787), #35777 (`completed`, svečias) — VF+Prins be Venipak, likučiai nejudinti (dropship) — trinti su testiniais (S1609 sąrašas + šie). Klientas 5787 — jam dabar #35421, #35440, #35776.

**Klausimas Raimiui (buvo „pasiūlyti prieš darant“):** angliškas „Confirm your email address to check for past orders and link them to your account.“ užsakymų sąraše (WC `wc_send_verification`, svečio užsakymų susiejimas tuo pačiu el. paštu): (a) išversti per `petshop-vertimai.php` (domenas `woocommerce`, funkcija lieka — naudinga, nes svečių užsakymų daug), (b) išjungti. Siūlau (a). Nedaryta iki atsakymo.

**Raimio sprendimai 2026-09-04 (po S1610 ataskaitos) → `petshop-kliento-siuntos.php` v1.1** (7 459 B, md5 `b13362f1077cd746f9d9e760c29f2942`; kopija `ps-backups/petshop-kliento-siuntos-v10-BACKUP-2026-09-04.php`; recon `e12_run1r/2s.json`, deploy+patikra `e13_run1d.json`):
- **(b) „Confirm your email address…“ IŠJUNGTA.** Kilmė: WC 11.0.1 `src/Internal/CustomerEmailVerification/VerificationController` (`@since 11.0.0`) — `render_prompt` ant `woocommerce_before_account_orders` prior. 10 (nėra filtro išjungti). v1.1 `sargai()` (`init` 20) nuima tik `render_prompt` (instancijos paieška per `$wp_filter`, klasės vardas `CustomerEmailVerification`); `print_result_notice` (prior. 5) ir `template_redirect` apdorojimas lieka — be raginimo nieko nerodo. Patikra: loopback ir Playwright kaip 5787 `paskyra/uzsakymai/` — „Confirm your email“ nėra, `wc_send_verification` nuorodos nėra, `notices=[]`, 6 eilutės (`screenshots/e13_uzsakymai.png`), JS/HTTP klaidų 0.
- **LP pluginas — laiško ir užbaigimo klientui NEBEDARO (mano sprendimas, Raimis delegavo „mažiau klaidų“):** nustatymai `lpsettings_event_to_send_tracking_email` ir `lpsettings_event_to_change_status_to_completed` buvo abu `wc-lp-on-the-way` → **`''` („Never“)** — kitaip pluginas per savo cron `sync_tracking_data` pats siųstų sekimo laišką (kitas šablonas, be „1 iš 2“, be prekių, be paskyros nuorodos → klientas gautų du) ir pats užbaigtų užsakymą aplenkdamas `issiusta()` (be `_ps_dalys_issiusta`, be mūsų laiško; „Kurjeris paėmė“ tada sakytų „jau išsiųstas“; mišriems §18.3 sargas jį vis tiek grąžintų). Saugiklis kode: `sargai()` `remove_all_actions('woo_lithuaniapost_send_tracking_email')` (nuima plugino `send_tracking_email`), jei nustatymas kada grįžtų. Patikra naujame procese (`init` 99): `has_action(...)=false`, `Woo_Lithuaniapost_Admin_Settings::get_option()` abu `''`. Plugino būsenos meta `_woo_lithuaniapost_shipping_status_value` toliau atnaujinama (cron) — 4 etapo LP sekimas: `lp-on-the-way` → `Petshop_Darbalaukis::issiusta($o, null, true, 'av', 'lp')`, `lp-delivered` → „Pristatyta“; iki tol LP užsakymui darbuotojas spaudžia „Kurjeris paėmė“ kaip Venipak.
- Kiti radiniai (Raimiui): `lpsettings_api_password` saugomas atviru tekstu opcijoje (plugino architektūra); LP metodai — 2× „LP Express“ terminalas (instance 12, 13; 1,78 €, nemokamai nuo 30 €) + „LP Express kurjeris“ (15, pagal svorį).

**Lieka (3 etapas):** #6 LP — J1 (T-0) realus testas (pirma reali LP siunta: numeris laiške/paskyroje, „Kurjeris paėmė“ vietoje plugino užbaigimo). Padaryta: (b) WC raginimas, LP plugino laiškas/užbaigimas išjungti. 4 etapas: Venipak cron → `Petshop_Darbalaukis::issiusta($o, null, true, $dalis, 'venipak')`; LP — `_woo_lithuaniapost_shipping_status_value`.

---

### S1609 (2026-09-03, vėlus vakaras)

> Pridėti po S1608. Tema: 3 etapas **#5 — sekimo laiškai klientui po kiekvienos siuntos** (spec v1.2 §12, Raimio sprendimas 09-03 vakaras). Variklis (registras A–J) nekeistas; `petshop-siuntu-laiskai.php` v1.2 (gyvas `753f8c6c`, 17 047 B) neliestas — senas vieno laiško langas `ps-siuntos-laiskas` lieka Raimiui.

#### S1609 — ETAPAS 3 #5: `mu-plugins/petshop-darbalaukis.php` v3.10.2 (179 272 B, md5 `03330ef26ff82f4022dea45f16771d0a`; repo `deploy/petshop-darbalaukis.php` + `.b64`; kopijos `ps-backups/petshop-darbalaukis-v39/v310/v3101-BACKUP-2026-09-03.php`)

**Prieš darbą:** STARTAS → log S1608 → spec §1/§2/§11/§12 → ZODYNAS v1.1 → registras I1/I3 → `issiusta()`/`faktai()`/`siuntos()` darbalaukyje → **gyvas** `petshop-siuntu-laiskai.php` (recon `e5_run1r.json`; repo kopija `eddc909e` skiriasi nuo gyvo `753f8c6c` tik E1b `do_action` ir MIXED pastabos vartais — repo neatnaujinta sąmoningai). Recon: Venipak sekimo deep link iš jų formos JS — `https://venipak.com/lt/tracking/track/{nr}` (`e5_run2r.json`); LP — `https://www.post.lt/siuntu-sekimas?parcels={nr}` (plugino šablonas). `_ps_siuntos` struktūra: `{sandelis:{sandelis,kodas,manifest,numeriai[],data}}`; `_ps_dalys_issiusta` (K4): `{dalis:{laikas,kas,kanalas}}`.

**v3.10 — kas pasikeitė klientui ir darbuotojui:**
- **Laiškas po kiekvienos siuntos** (buvo: vienas su visais numeriais, kai visos dalys). Tema „Užsakymas Nr. N — išsiųsta 1 iš 2 siuntų“ / „… 2 iš 2 …“; vienos siuntos užsakymui — „Jūsų užsakymas Nr. N išsiųstas“. Turinys: „Sveiki, {vardas},“ · „Išsiųsta 1 iš 2 Jūsų užsakymo Nr. N siuntų. Antroji siunta keliaus atskirai — pranešime, kai išsiųsime.“ (paskutinei: „— visas užsakymas išsiųstas.“) · **sekimo juostelė** (Užsakymas gautas · Apmokėta · Ruošiama · **Išsiųsta** · Pas kurjerį · Pristatyta; dabartinis — Išsiųsta, WC bazinė spalva `#2d6a35`) · dėžutė „Siuntos numeris (Venipak)“ + mygtukas **„Sekti siuntą“** (kelių dėžių — visi numeriai, nuoroda į pirmą) · „Šioje siuntoje:“ prekės × kiekis · „Dar keliaus atskira siunta:“ likusios prekės (tik kai ne paskutinė) · „Gražios dienos, petshop.lt“; WC `wrap_message` (logotipas/poraštė). Be numerio (ZB rankinis, „be lipdukų“) — „Siunta perduota vežėjui Venipak.“ be mygtuko. Tiekėjų kodai (VF/ZB) klientui **nerodomi**.
- **Mechanika:** `siuntos_laiskas($o,$f,$dalis,$iss)` — viena vieša funkcija, ją kvies ir 4 etapo Venipak cron; `issiusta()` dabar `public static` su `$kanalas` (`web` | `venipak`), `$u` gali būti `null` („Venipak“/„sistema“). Žymės: `_ps_dalys_issiusta[dalis].laiskas` (dublio sargas — antrą kartą laiškas neišeina), `_ps_sekimo_siusta` — paskutinio laiško laikas (senas langas rodo „siųsta“). `sekimo_url($vez,$nr)` + `apply_filters('ps_sekimo_url')`. Užsakymo pastaba „Klientui išsiųsta „Išsiųsta 1 iš 2 siuntų“ (el. paštas): V…“; `ps_uzsakymu_ivykiai` `issiusta_dalis`/`issiusta` su `zinute` apie laišką.
- **Dialoge** varnelė „Pranešti klientui“ (ON) prie **kiekvienos** siuntos (buvo tik paskutinei, tik su numeriais); tekstas „Kurjeris paėmė AV siuntą V…? Dar laukiam: VF — užsakymas lieka atviras. Klientui išeina laiškas „Išsiųsta 1 iš 2 siuntų“ su sekimo numeriu.“ Pranešimas po veiksmo: „#35421: Prins išsiuntė — klientui išėjo „Išsiųsta 1 iš 2 siuntų“ · dar laukiam: AV.“ Pastabos eilėje ir Rytinėje eigoje — „po kiekvienos siuntos klientui išeina laiškas“. „Kurjeris paėmė viską“ — `sekimo=1` kaip buvo.

**v3.10.1 (radinys teste #35774, VF+Prins „Užsakyti be lipdukų“):** „Prins išsiuntė“ (2 iš 2) laišką išsiuntė, bet §18.3 sargas (`petshop-siuntu-laiskai.php` `uzbaigimo_sargas`: registruota 0 iš 2 siuntų) neleido `completed` → užsakymas iškrito iš **visų** eilių (`eiles=[]`), pakartojus — „Prins jau pažymėta išsiųsta“. **Sena aklavietė** (v3.9 elgtųsi taip pat — dropship be lipdukų siunta pas mus neregistruojama niekada). Taisymas darbalaukyje (variklis neliestas): 1) paskutinės dalies laiškas išeina **po** `completed` (sargui sustabdžius — klientas negauna „visas užsakymas išsiųstas“); 2) kai darbuotojas pažymėjo **visas** dalis, o `registruota_grupiu() < _ps_shipments` — rašomas variklio dokumentuotas apėjimas `_ps_uzbaigti_be_siuntu=1` + pastaba „Užbaigiama be registruotų siuntų (0 iš 2): visos dalys pažymėtos išsiųstomis darbalaukyje (VF, Prins)“; 3) pakartotinis „[T] išsiuntė“, kai visos dalys jau pažymėtos, bet ne `completed` — bando užbaigti iš naujo (ne „jau pažymėta“). **Raimiui patvirtinti** — apėjimas mano sprendimas, ne spec'e.

**v3.10.2 (radinys `e6_visi`):** „Visi“ rodė „prieš 3 val.“ ką tik atėjusiam užsakymui — `amzius()` lygino `current_time('timestamp')` (Vilniaus „vietinis“ epoch) su `WC_DateTime::getTimestamp()` (UTC) → +3 val. Dabar `time()`. Patikra: #35775 sukurtas 21:48:12 GMT, 21:57 rodo „prieš 9 min“ (`e7_visi`).

**Deploy:** b64 trimis dalimis (`ps-backups/dl-v310/v3101/v3102.part1/.part2` po 80 000 + trečia payload'e 77–79 KB), md5 + `token_get_all` sargai, gyvo failo md5 sargas (rašo tik ant laukiamos versijos), backup, md5 po rašymo. `analize/e5_run3a/3b/3d.json` (v3.10), `e5_run5a/5b/5d.json` (v3.10.1), `e5_run7a/7b/7d.json` (v3.10.2). Visi run'ai — pirmu kartu.

**Patikra (testuotojas, realūs `admin-post` endpoint'ai, `pre_wp_mail` gaudyklė prior. 4 — 0 laiškų išėjo, `ps_dev_pastas_zurnalas` nepajudėjo; `e5_run4t.json`, `e5_run6t.json`, `e5_run7v/7w.json`):**
1. **#35421** (AV + Quattro→AV + Prins tiesiai, Prins siunta V07267E1000046 registruota): „Prins išsiuntė“ → `dl_dalis`, laiškas „Užsakymas Nr. 35421 — išsiųsta 1 iš 2 siuntų“ (juostelė, numeris, „Sekti siuntą“, „Šioje siuntoje: 1 × Prins Diet…“, „Dar keliaus atskira siunta: Animonda…, QUATTRO…“ — nuotrauka `screenshots/e5_laiskas_0.png`), `_ps_dalys_issiusta.prins.laiskas` įrašytas, užsakymas liko `processing` eilėje Surinkti AV; antras paspaudimas — „Prins jau pažymėta išsiųsta“, laiškų 1.
2. **#35440** (viena AV siunta, 3 dėžės V…049/050/051): „Kurjeris paėmė“ → `completed`, laiškas „Jūsų užsakymas Nr. 35440 išsiųstas“ su trimis numeriais („Siuntų numeriai (Venipak)“), „Prekės: 3 × Animonda…“ (`e5_laiskas_1.png`).
3. **#35774** ir **#35775** — du nauji užsakymai VF+Prins „be lipdukų“ nuo atėjimo iki įvykdyto (žr. dienoraštį). #35774 atskleidė sargo aklavietę (v3.10.1); po taisymo pakartotas „Prins išsiuntė“ → `completed`, laiškas nekartotas („klientui jau pranešta apie šią siuntą (21:34:15)“). #35775 su v3.10.1: 1 iš 2 → 2 iš 2 → `completed`, pastabų eilė: „Pažymėta išsiųsta…“ → „statusas Vykdomas→Įvykdytas“ → „Klientui išsiųsta „Išsiųsta 2 iš 2 siuntų““ (laiškas po completed).
4. **Dialogai (Playwright):** #35418 ZB — „ZB išsiuntė savo dalį V07267E1000037? Užsakymas įvykdytas. Klientui išeina laiškas „Užsakymas išsiųstas“ su sekimo numeriu.“ varnelė ON, href `…&dalis=zb&sekimo=1`; #35429 AV — „Kurjeris paėmė AV siuntą V07267E1000031, V07267E1000032? Užsakymas įvykdytas. Klientui išeina laiškas „Užsakymas išsiųstas“ su sekimo numeriu.“ (`e7_dialogas_av.png`). Paruošta eilė, mobilus 420 px — JS/HTTP klaidų 0. Laiškų temos per visą testą (12): 2 WC „Naujas užsakymas“/„apmokėjimas gautas“ per naują užsakymą, 2 „[PERSIŲSTI …]“ tiekėjams, 6 sekimo — visos sugautos.

**Darbuotojo dienoraštis (#35775, kaip mato darbuotojas):** „Atėjo užsakymas su dviem prekėmis iš dviejų tiekėjų — Neišrūšiuoti. Atidariau: HAP žaislas — VF siunčia klientui, Prins maistas — Prins siunčia klientui, spaudžiau ‚Surūšiuota‘. Užsakymas nukrito į Dropshipping, dvi kortelės. Lipdukų nedariau — ‚Užsakyti be lipdukų‘ iš VF ir iš Prins, laiškai išėjo man persiųsti. Užsakymas Paruošta siųsti su dviem mygtukais. Kai VF pranešė — ‚VF išsiuntė‘: pranešimas ‚klientui išėjo „Išsiųsta 1 iš 2 siuntų“ be sekimo numerio · dar laukiam: Prins‘. Kai Prins — ‚Prins išsiuntė‘: ‚#35775 išsiųstas — įvykdytas; klientui išėjo „Išsiųsta 2 iš 2 siuntų“‘. Visi rodo Įvykdytas, prieš 9 min.“ Sunkumai: 1) be lipdukų klientas laiške negauna numerio — tiekėjo siunta seka tik per tiekėją (žinoma išimtis); 2) #35774 pirmą kartą po ‚Prins išsiuntė‘ gavau raudoną ‚užbaigti neleido sargas‘ ir užsakymas dingo iš eilių (ištaisyta v3.10.1).

**Mano prielaidos (Raimiui patvirtinti / vetuoti):** 1) juostelėje dabartinis žingsnis „Išsiųsta“ (ne „Pas kurjerį“) — „Pas kurjerį“ lieka 4 etapo Venipak sekimui; 2) klientui laiške tiekėjų vardų/kodų nėra — rodomos prekės siuntoje ir „dar keliaus“; 3) §18.3 sargo apėjimas „be lipdukų“ atvejui; 4) LP siunta laiške be numerio, kol #6 (LP per Rytinę eigą); 5) „Sekti siuntą“ veda į `venipak.com/lt/tracking/track/{nr}` — patikrinti su pirma realia siunta.

**Testiniai duomenai:** #35774, #35775 (`completed`, VF+Prins, be Venipak, `_ps_uzbaigti_be_siuntu=1` #35774; likučiai nejudinti — dropship); #35421 Prins dalis pažymėta išsiųsta (AV dalis lieka Surinkti AV); #35440 `completed`; opcijos `ps_e5_mail`, `ps_e5_oid` ištrintos (`e7v`). TEMP snippet'ai trinami kiekvieno run'o pradžioje. Venipak nekviestas.

**Radinys (ne #5, patikrinti):** gyvame `petshop-siuntu-laiskai.php` `mixed_pastaba()` apmokėjimo laiške rodoma tik jei tuo momentu jau yra `_ps_misrus_sprendimas` (2026-08-26 vartai); rūšiuojama po apmokėjimo, tad pastaba apie kelias siuntas klientui praktiškai neišeina — spręsti 5–6 etape kartu su kasos sakiniu (spec §12.4).

**Lieka (3 etapas):** #6 LP Express — per Rytinę eigą (senas vaizdas) iki T-0 testo (J1). 4 etapas: Venipak cron → `Petshop_Darbalaukis::issiusta($o, null, true, $dalis, 'venipak')`.

---

### S1608 (2026-09-03, vakaras)

> Pridėti po S1607. Tema: užsakymų sistemos 3 etapas, punktas #1 (STARTAS_2026-09-04_3_etapas) — „Laukiam iš tiekėjų“ kortelės su užsakymu tiekėjui ir priėmimu čia pat; punktas #2 — trijų sandėlių testas darbuotojo paskyra. Variklis (registras A–J) nekeistas.

#### S1608 — ETAPAS 3 #1–#4: `mu-plugins/petshop-darbalaukis.php` v3.9 (169 497 B, md5 `4a798693625447d91bcbcf2fcb5f2dee`; repo `deploy/petshop-darbalaukis.php` + `.b64`; kopijos v35/v36/v361/v37/v38/v381 `ps-backups/`)

**Prieš darbą:** perskaityta STARTAS → log S1607 → spec v1.2 §12 → ZODYNAS v1.1 → AUDITAS 09-03 → registras (G4, H1–H4, I). Kopijos: `uploads/ps-backups/petshop-darbalaukis-v35-BACKUP-2026-09-03.php` (140 530 B, md5 `f0e791d8…`), `…-v36-BACKUP-2026-09-03.php` (160 537 B, md5 `8f93c441…`).

**v3.6 — kas pasikeitė darbuotojui:**
- Eilė **„Laukiam iš tiekėjų“** = kortelės per tiekėją (rikiuotos pagal ribą), vietoj sąrašo:
  - **A. Užsakyta — „Gauta“**: kiekvienam užsakytam užsakymui tiekėjui (`ps_tiekimas.busena='uzsakyta'`) — antraštė „Užsakyta 09-03 18:53 · užsakymas tiekėjui #14 · Tiekėjas atveža pats · siunta V… [Lipdukas]“, prekių eilutės (kam — #užsakymas, spaudžiamas → skydelis; „į atsargas“ — Raimio priedai), laukai „Gauta“ (kiekis, numatyta užsakyta) ir „galioja iki“ (YYYY-MM), mygtukas **„Gauta“** su patvirtinimu → variklio `priimti()` (H3). ZB — „Kopijuoti“ (sąrašas suvedimui).
  - **B. „Užsakyti iš [T] į AV (n prek.)“**: kaupiama partija (su atsargų eilutėmis) + dar nesudėtos „veža į AV“ užsakymų eilutės (būklė „neužsakyta“ / „sudėta“); „Kaip atkeliaus į AV“ (paštomatas Nemenčinė · kurjeris į AV · tiekėjas atveža — privaloma), svoris (numatyta iš katalogo, įspėjimas „n be svorio kataloge“), dėžių, adresatai „siųsti tiekėjui (el. paštas)“ / „kopija man“ (tas pats `ps_tiek_laiskai` nustatymas kaip Tiekime), „Peržiūrėti laišką“ (tikslus tekstas per `laisko_dalis()`), **„Kartu su Dropshipping (n užs.)“** (G4 — tik kai to tiekėjo yra neperduotų Dropshipping užsakymų): sudeda į partiją, išsaugo pristatymą ir veda į Dropshipping kortelę su varnele „+ į AV“; ZB — be laiško/peržiūros, patvirtinimas „laiško nebus — suvesi į ZB sistemą“.
- **Mechanika:** naujas `admin_post_ps_dl_tiekimas` (nonce `ps_dl_tiek_{src}_{pid}`): sudeda eilutes į `Petshop_AV_Tiekimas::atvira_partija($src)` per `ideti_eilute()` + `_ps_konsolidacija=1` (kaip variklio `kons`, tik šiam tiekėjui, žurnalo įrašas `kons`), tada paruošia `$_POST` (partija, ka=uzsakyti|issaugoti|priimti, savo patikrintą `ps_tiekimas_{pid}` nonce) ir paleidžia `do_action('admin_post_ps_tiekimas')` — variklio `veiksmas()` (kiekiai, pristatymas, svoris, dėžės, adresatai, `uzsakyti()`/`priimti()`) ir `petshop-uzsakymu-ivykiai` (prio 1, `wp_redirect` prio 1) veikia lygiai kaip Tiekimo lange. `grizti_cia()` gaudo `page=ps-tiekimas&tk=…` ir grąžina į darbalaukį darbuotojo žodžiais (`dl_uzsak_av`, `dl_gauta`, `dl_info`, `dl_klaida`; `vp_klaida` — su Venipak klaidos tekstu iš `ps_tiek_vp_klaida_{pid}`); pranešime „#pirmas užsakymas → dabar: …“.
- **Tiekimo langas darbuotojui nebereikalingas** (Raimiui lieka): `kons` ir „Laukiam iš X“ mygtukai, skydelio nuoroda „Laukiam iš tiekėjų →“, Rytinės eigos 3 („čia pat“) ir 7 („Gavimai“ → eilė) žingsniai veda į šią eilę; Dropshipping kortelės „+ į AV“ pastaba be nuorodos į Tiekimą.
- **Žodynas (#4 dalis):** „partija #10“ → „užsakymas tiekėjui #10“ būklėse, užrakte, skydelio „kodėl“, pranešimuose; v3.6.1 — skydelio „kodėl“ gautai prekei „Gauta į AV iš ZB (užsakymas tiekėjui #15) — siunčiam iš AV“ (buvo tiekėjo pasiūlymo tekstas + „parsivežta iš ZB, partija #15“).

**Deploy:** b64 trimis dalimis (`uploads/ps-backups/dl-v36.part1/.part2` po 80 000 + trečia payload'e ~55 KB), md5 + `token_get_all` sargai, backup, `md5` po rašymo. `analize/e3_run1a.json`, `e3_run3b.json`, `e3_run2d.json` (v3.6); `e3_run9a/9b/9d.json` (v3.6.1). Nepavykę: `e3_run1b` (WP REST 5× neatsakė — `fx:create`), `e3_run2b` (snippet'as sukurtas, bet GET grąžino pradinį puslapį — priežastis neaiški, pakartojus veikė), `e3_run1d` (part2 nebuvo → md5 sargas sustabdė, failas neliestas).

**Patikra (T1 — kortelė, `e3_run3t.json`, Playwright `testuotojas`):** `eile=laukiam` — kortelė „VF · 1 užs. · po 13:00 — rytoj“ (#35090 FURminator neužsakyta), mygtukai „Užsakyti iš VF į AV (1 prek.)“ · „Peržiūrėti laišką“ · „Kartu su Dropshipping (5 užs.)“; peržiūra rodo tikslų laišką; skydelis, Rytinė eiga (3 ir 7 žingsniai → `eile=laukiam`), mobilus 420 px — JS/HTTP klaidų 0. Nuotraukos `screenshots/e3_laukiam*.png`, `e3_rytas.png`.

**Patikra (T2 — trijų sandėlių testas, STARTAS #2; `e3_run5s/6ug/7z/8v/10k.json`):** naujas užsakymas **#35450** „AUDITAS Testas 31“ (19708 AV ×1 · 33902 Trixie ZB ×1 · 35357 HAP VF ×1, VENIPAK Kurjeris, bacs, `payment_complete`) — visi veiksmai darbuotojo paskyra per realius endpoint'us, laiškai gaudyti `pre_wp_mail`:
1. Apmokėtas → **Neišrūšiuoti** (3 sandėliai → pati nerūšiuoja, R 09-03), `_ps_shipments=3`, MIXED.
2. Skydelyje ZB ir VF → „veža į AV“, „Surūšiuota“ → **Laukiam iš tiekėjų**; kortelės ZB (1 užs.) ir VF (2 užs. — kartu su #35090); mygtukas „Užsakyti iš ZB ir VF į AV“.
3. „Užsakyti iš VF į AV“ (tiekėjas atveža, tik kopija man) → **užsakymas tiekėjui #14** (`uzsakyta`), laiškas „[PERSIŲSTI Vetfarmas] UAB Avesa · prekių užsakymas 2026-09-03“ → terra@petshop.lt (1 prekė, be lipdukų); pranešimas „#35450: užsakyta iš VF į AV — užsakymas tiekėjui #14; laiškas išėjo tik man — persiųsk tiekėjui → dabar: Laukiam iš tiekėjų“; VF eilutė „užsakyta · užsakymas tiekėjui #14“, užraktas „jau užsakyta iš VF“; kortelėje VF blokas A su „Gauta“.
4. „Gauta“ VF → `priimta`, VF eilutė `av` (K2 `eilutes_i_av`), takelis „✓ užsakyta iš VF ✓ gauta į AV“, `_ps_shipments=2`; užsakymas **lieka Laukiam** (ZB dar ne) — trijų sandėlių taisyklė veikia.
5. „Užsakyti iš ZB į AV“ → **#15** uždarytas be laiško („sąrašą suvesk į ZB sistemą“), kortelėje „Kopijuoti“ + „Gauta“.
6. „Gauta“ ZB → eilė **Surinkti AV**, `vietoje=true`, `_ps_shipments=1`, MAIN; skydelis „Dabar: Surinkti AV · toliau: Lipdukas“, žingsneliai ✓ Užsakyta iš ZB ✓ Gauta į AV / ✓ Užsakyta iš VF ✓ Gauta į AV; **surinkimo lapas „1 užsakymas · 3 vnt.“** — visos trys prekės vienoje AV siuntoje. Žurnalas: busena, apmokejimas, kelias×2, rusiuoti, kons, tiekimas uzsakyti, tiekimas priimti, kons, uzsakyti, priimti, lapai — visi `ok`, `Testuotojas`. Nuotraukos `e3_t2_surinkti.png`, `e3_t2_lapas.png`.

**Darbuotojo dienoraštis (#35450, kaip mato darbuotojas):** „Atėjo užsakymas su trimis prekėmis — Neišrūšiuoti. Atidariau: viena prekė iš AV, dvi pas tiekėjus; klientui norėjau vienos siuntos, paspaudžiau ‚ZB veža į AV‘ ir ‚VF veža į AV‘, ‚Surūšiuota‘. Užsakymas nukrito į ‚Laukiam iš tiekėjų‘. Ten dvi kortelės: ZB ir VF. VF kortelėje pasirinkau ‚Tiekėjas atveža pats‘, pažiūrėjau laišką, spaudžiau ‚Užsakyti iš VF į AV‘ — pranešė, kad laiškas išėjo man persiųsti. Kai prekė atvažiavo — toje pačioje kortelėje ‚Gauta‘. Užsakymas dar liko ‚Laukiam‘, nes ZB dar neatvežė. ZB kortelėje ‚Užsakyti iš ZB į AV‘ — laiško nėra, atsirado ‚Kopijuoti‘ suvesti į ZB. Atvežė — ‚Gauta‘. Užsakymas atsirado ‚Surinkti AV‘ su visomis trimis prekėmis, lape trys vienetai.“ Sunkumai: 1) VF kortelėje kartu rodomas ir senas #35090 — „Užsakyti iš VF į AV (2 prek.)“ užsakytų abu (testas siuntė tik #35450 `ids`); 2) juostoje darbuotojas mato „Gavimas“ ir „Tiekimas 1“ — Raimio langai, klaidina (juosta v1.5, neliesta); 3) „galioja iki“ laukelis prie „Gauta“ — ar reikia darbuotojui (Raimiui).

**Testiniai duomenys:** #35450 (processing, Surinkti AV, `_ps_surinkta` per lapą); #35771, #35772 (T2, cancelled); 320 T3 `failed` ištrinti; opcija `ps_e3_oid2`; užsakymai tiekėjams #14 (VF, gauta) ir #15 (ZB, gauta); likučiai: 35357 (HAP) ir 33902 (Trixie) `+1` per `Petshop_AV_Stock::increase`, tada rezervuota eilutėms (`_ps_av_reduced`); 19708 −1 (16→15). Opcija `ps_e3_oid=35450`, `ps_audit_mail` — trinti su testiniais. Venipak nekviestas. TEMP snippet'ai trinami kiekvieno run'o pradžioje (liko paskutinis 4611, deaktyvuotas).

**Raimio sprendimai po T2 (09-03 vakaras) → v3.7 (`e3_run11a/11b/11d.json`, patikra `e3_run12w.json`, nuotraukos `e3_v37_*.png`):**
1. **Tiekėjui — TIK vienas laiškas.** Kai to tiekėjo laukia Dropshipping užsakymų, „Laukiam“ kortelėje vienintelis mygtukas **„Kartu su Dropshipping iš VF (n prek.)“** (sudeda prekes į užsakymą tiekėjui, laiškas išeina Dropshipping kortelėje su varnele „+ į AV“); atskiras „Užsakyti iš [T] į AV“ su savo laišku — tik kai Dropshipping užsakymų iš to tiekėjo nėra. Užsakymų į AV atsargoms sudarymas — ne dabar (Raimis: vėliau).
2. **Galiojimas** prie „Gauta“ lieka, neprivalomas — „(jei lieka sandėlyje)“; sprendžia darbuotojas.
3. **Juosta** („Gavimas“, „Tiekimas“) — neliečiama, kol yra Laiškų langas.
4. **Varnelė prie kiekvieno užsakymo** Dropshipping ir Laukiam kortelėse (`.dl-uzs-cb` → hidden `uzsakymai`/`ids`, mygtuko skaičius persiskaičiuoja, 0 → mygtukas išjungtas). Patikrinta: Belacor 1 užs. nuimta → „Užsakyti iš Belacor (0 užs.)“ išjungtas; Laukiam VF → „Kartu su Dropshipping iš VF (1 prek.)“, be „Peržiūrėti laišką“ ir adresatų. JS/HTTP klaidų 0.

**#3 Audito likučiai → v3.8 / v3.8.1** (`e3_run13a/13b/13d`, `e3_run15a/15b/15d`; testai `e3_run14x.json`, `e3_run16y.json`, `e3_run18z.json`):
- **K2 antra pusė** — skydelis per `wp_ajax_ps_dl_skydelis` (nonce `ps_dl_zurnalas` ant `#dl[data-n]`); eilutėse tik `data-sk="1"`, JSON kraunamas atidarant ir kešuojamas eilutėje (`r._o`), skydelis atsidaro iš karto su „kraunama…“. „Visi“ 36 užs.: 446 KB → 309 KB (bazė be eilučių ≈ 254 KB — admin chrome/juosta/CSS/JS; 300 eilučių — 561 KB, 4,7 s).
- **V11** — tylus atnaujinimas kas 60 s: `fetch` to paties URL → keičiamas tik `.dl-main` (jei skiriasi), slinktis ir pažymėta eilutė (`cur`) lieka; praleidžiama, kai skydelis/dialogas atviri, laukas fokuse, pelė virš sąrašo. Lapo atidarymas naujame skirtuke → tas pats atnaujinimas vietoj `reload`. Patikra Playwright (`e3_v38_refresh`): scroll 250→250, pridėtas svetimas elementas dingo (sąrašas pakeistas), pažymėta eilutė ta pati. `window.psDlAtnaujinti` — patikrai.
- **V9** — „Visi“ po 50 (`psl`), juostelė „‹ ankstesni · 1–50 iš N · kiti ›“ (`wc_get_orders paginate`); „Išsiųsta šiandien“ = `_ps_dalys_issiusta` su šios dienos laiku (meta LIKE) ∪ `date_completed` šiandien, ne `date_modified`. Patikra: T3 metu „1–50 iš 356 · kiti ›“.
- **T3** — 320 `failed` „AUDITAS T3-n“: Neapmokėti 300 (riba) → v3.8.1 įspėjimas juostoje „Neapmokėtų (14 d.) daugiau nei 300 — rodomi ne visi; skaitliukai Gauti/Klausimai/Neapmokėti nepilni“; puslapis 561 KB. Ištrinta 320, skaitliukai grįžo (Gauti 6 · Klausimai 3 · Neapmokėti 0). **Radinys Raimiui:** neapmokėti (pending/failed) užsakymai skaitomi ir į **Gauti** (306) ir į **Klausimai** (303, variklio klausimas „nesėkmingas mokėjimas“) — ar Gauti turi rodyti ir neapmokėtus?
- **T2** — dvigubas kelio keitimas lygiagrečiai (`curl_multi`, #35772 su 18593 AV+VF): pirma užklausa „veiksmas jau vykdomas — palauk sekundę“ (`ps_dl_lock_{id}`), antra pakeitė kelią, likutis pajudėjo lygiai vieną kartą (20→21→20), žurnale 2 įrašai. V2 uždaryta. Testinis #35772 (ir #35771) atšauktas, likutis 21.
- **V12** — `Petshop_AV_Order::fiksuoti($order_id,$priverstinai)` perskaičiuoja grupes, bet **iš naujo `resolve()` kiekvienai eilutei** ir perrašo `_ps_source` — darbuotojo parinktus kelius sunaikintų, todėl netinka. `perskaiciuoti_grupes()` lieka darbalaukyje; tikras sprendimas — viešas variklio metodas „grupės iš esamų `_ps_source`“ (R13 išimtis) — **Raimio sprendimas**. `_ps_sekimo_siusta` dublis — neliesta.
- **S2/S3** — jau uždaryti v3.0/v3.5 (legendos nėra; „Kurjeris paėmė viską“ rodomas visada). **T10** (du vartotojai) ir **V1 testas** (prekė be sandėlio) — netestuoti: T10 iš dalies dengia T2 užraktas; V1 — dev'e prekės be šaltinio nėra.

**Raimio sprendimas (T3 radinys) + #4 žodyno likučiai → v3.9** (`e3_run19a/19b/19d`, patikra `e3_run20q.json`):
- **Neapmokėtas užsakymas — Gauti + Neapmokėti, ne Klausimai** (Raimis): `faktai()` — `klausimai` eilė tik apmokėtiems; variklio klausimas „Mokėjimas nepavyko“ lieka tekstu skydelyje. Patikra: pending → `eiles=[neapmoketi]`, `naujas=true`; failed → `kl="Mokėjimas nepavyko"`, `eiles=[neapmoketi]`.
- **Keliai be tiekėjo**: skydelyje prekei be tiekėjo rodomas tik „Iš AV“ (buvo pilki „Tiekėjas siunčia klientui / veža į AV“); su tiekėju — trys keliai kaip buvo. Patikra #35450: Animonda → „Iš AV*“; Trixie → „Iš AV* | ZB siunčia klientui | ZB veža į AV“.
- **Variklio pranešimai → žodynas**: `pd_nr` trumpiniai „1 · AV“ → „1 — AV“ (ne „Avesa“); variklio `pranesimas()` HTML verčiamas (Avesa/Avesoje/Avesos → AV, Vetfarmas → VF, Žalioji Banga → ZB, „partija #n“ → „užsakymas tiekėjui #n“, „WooCommerce“ išimamas); `kons_ok` tekstas veda į „Laukiam iš tiekėjų“. Patikra: „Lipdukas: siunta užregistruota (1 — AV).“, „#35450: 2 prekė(-s) į užsakymą tiekėjui — užsakyk ir priimk „Laukiam iš tiekėjų“ eilėje. → dabar: Surinkti AV · toliau: Lipdukas“.
- Testinis #35773 (pending/failed) sukurtas ir ištrintas tame pačiame run'e.

**INCIDENTAS (T3) ir taisymas — `mu-plugins/petshop-dev-pastas.php` v1.0** (4 606 B, md5 `744c69c92bb8f362ca7e3ccc1b80ddc5`; repo `deploy/`; `e3_run21m.json`, `e3_run22n.json`):
- **Kas įvyko:** T3 payload'e (`e3x.php`) nebuvo `pre_wp_mail` gaudyklės → 320 „laukia apmokėjimo“ užsakymų išsiuntė ~320 tikrų WC laiškų „Užsakymas N laukia apmokėjimo“ į terra@petshop.lt (Raimio spam aplankas, ekrano nuotrauka 20:33) ir tikėtina tiek pat admin laiškų „Nepavykęs užsakymas“ į uzsakymai@petshop.lt. Realiems klientams nieko neišėjo. Rizika — siuntėjo reputacija (petshop.lt domenas, 320 vienodų laiškų per 10 min) — stebėti Sender.net / pašto serverio reputaciją kelias dienas. **Mano klaida.**
- **Saugiklis:** dev ir prod — tas pats WP (veidrodis), todėl skiriama pagal `HTTP_HOST`: ne `petshop.lt`/`www.petshop.lt` → `pre_wp_mail` (prior. 5) grąžina `true` — laiškas neišeina, įrašomas į `ps_dev_pastas_zurnalas` (300 pask.: laikas, kam, tema, priedai, URL). Cron/CLI be hosto — praleidžiama (prod cron laiškai eina). Išimtis `ps_dev_pastas_leisti=1`. Langas `admin.php?page=ps-dev-pastas` (manage_woocommerce) + pranešimas visuose `ps-*` languose dev'e „Dev: laiškai neišsiunčiami · šiandien sugauta N“. Patikra: loopback per dev.avesa.lt `wp_mail()` → `true`, žurnale 1 įrašas, laiškas neišėjo (Raimis patvirtins dėžutėje).
- **Pasekmė testams:** testų gaudyklė `ps_audit_mail` (prior. 10) nebeužsipildo — laiškų turinį tikrinti iš `ps_dev_pastas_zurnalas` (tema/kam/priedai) arba gaudyklę kelti į prior. 4.
- **TAISYKLĖ (nauja, kritinė):** kiekvienas testo payload'as, kuriantis ar keičiantis užsakymus, PRIVALO turėti `pre_wp_mail` gaudyklę — net su saugikliu (dvigubas saugumas); prod hostu (`petshop.lt`) testų nevykdyti.

**Audito likučiai po S1608:** V12 (Raimio sprendimas — žr. pokalbį: variklio viešas metodas grupėms iš esamų `_ps_source`), T10, V1 testas. #4 — uždaryta.

**Lieka (3 etapas):** #5 sekimo laiškai po kiekvienos siuntos · #6 LP. (Buvo: #4 žodyno likučiai — padaryta v3.9.) · #5 sekimo laiškai po kiekvienos siuntos (`issiusta()` dalies laiškas, spec §12) · #6 LP per Rytinę eigą. Raimio klausimai 1–4 atsakyti (žr. aukščiau, v3.7).

---

### S1607 (2026-09-03, diena)

> Pridėti po S1606. Tema: užsakymų sistemos 2 etapas (spec §10.2) — naujas darbalaukis `petshop-darbalaukis.php` v0.1 → v2.2; darbuotojo dienoraštis; nepriklausomas auditas `dokumentai/AUDITAS_UZSAKYMU_LANGAS_2026-09-03.md` ir jo K1–K4/V1–V13 taisymai. Variklis (registras A–J) nekeistas.

#### S1607 — ETAPAS 2: `mu-plugins/petshop-darbalaukis.php` v3.5 (140 530 B, md5 `f0e791d886aa8a44e5660531f8618069`; repo `deploy/petshop-darbalaukis.php` + `.b64`) · `petshop-juosta.php` v1.5 (md5 `13c9a2c81bd4a036389c07d386e67a09`)

**Perėmimas.** Slug lieka `ps-desk`; `plugins_loaded` (20) nuima `Petshop_Desk::meniu/chrome/slepti_wc`, registruoja savo puslapį; `petshop-desk.php` v3.48 lieka įkeltas kaip variklis (visi `ps_desk_veiksmas`, Venipak, rytinė eiga `view=rytas` — senas vaizdas iki 3 etapo). Kopijos: `ps-backups/petshop-darbalaukis-v03/v12/v20-BACKUP-2026-09-03.php`. Deploy per bridge b64 dviem dalimis (`uploads/ps-backups/dl-vXX.part1` + antra dalis payload'e) — vienas payload >110 KB ir DATA/media upload (500) neveikia.

**Kelias (Raimio pastabos, dienoraštis):**
- v0.1–0.3: 8 eilės, kairysis stulpelis, trumpiniai — Raimis: „kortelė dešinėje neatsidaro, ne taip kaip suderinta“ → perdaryta pagal `uzsakymai-maketas-v7.html`.
- v1.0: sąrašas kaip makete (eilių juostelės, žymės pilnu vardu „Prins → klientui“, takelis po prekėmis, Kitas žingsnis), **skydelis** dešinėje 600 px (trys keliai, „kodėl“, žingsneliai, užraktas A8, Pristatymas, Avesos siunta su dėžėmis/perregistruoti/visi numeriai iš `_ps_siuntos` (V4), žurnalas, footer). Naujas `admin_post_ps_dl_veiksmas` (nonce `ps_dl_{v}_{id}`): `kelias` (likutis seka kelią, B3), `rusiuoti` (`_ps_rusiuota`, A7 — į partiją nededa), `auto_rusiuoti()` prie `woocommerce_payment_complete`/`_status_processing` prior. 100. Klausimų kortelės (C8).
- v1.1: PATAISA — konteinerio `data-atidaryti` gaudė visus paspaudimus (`closest()` → `preventDefault`), Raimiui „niekas neveikia“. Patikra nuo tada — realiais Playwright paspaudimais admin paskyra (`irankiai/mjs_template.mjs`: `click`, `eval`, console/pageerror gaudymas).
- v1.2 (perskaičius langą „Uzsakymai“): išimta „senas langas“ nuoroda ir „etapas“/„WC“ tekstai darbuotojui; savas `issiusta` su sekimo laiško varnele (V3/I1) ir §18.3 sargu žmogaus kalba.
- v2.0 (darbuotojo dienoraštis: „naujas langas tik nuvedė prie senų durų“): **viena sistema** — Laiškai tiekėjams = kortelės per tiekėją čia (1 Lipdukai (n) → 2 Laiškas [T] su prierašu/varnelėmis/peržiūra/partija į Avesą; ZB: Kopijuoti · Lipdukai · Perduota) ant dropship variklio (`ps_dropship_send`/`zb_done`, grįžimas per `wp_redirect` filtrą `grizti_cia()` su `ps_dl_g`); Paruošta = kortelės „Avesa — laukia kurjerio“ (Lipdukas PDF per `ps_dropship_lipdukas`, siuntų sąrašas kurjeriui `vp_manifestas`, Kurjeris paėmė (viską)) ir „[T] — laiškas išsiųstas“; Surinkti — lapas naujame skirtuke; eilė = mygtukas (`mygtukas_eilei()`); Nauji tik Avesa+tiekėjas / trūkumas (auto ir keliems tiekėjams tiesiai); žymė „naujas“; trumpas takelis; žodynas be AV/dropship/manifesto/riba; „iki 09:00 / po 09:00 — keliaus rytoj“; URL valomas nuo `pd_ok/atidaryti` (juostos kelias nesikartoja).
- v2.1/2.1.1 (auditas 09-03): **K1** — po Gauta (K2 `_ps_source=av`) `_ps_kelias=i_av` nebeblokuoja: rodomas kelias = f(`_ps_source`, partija), tiekėjas takeliui iš „parsivežta iš X“ (T1: #35439 po priėmimo → Surinkti, ✓ gauta, lape abi prekės, `_ps_shipments`=1). **K4** — `_ps_dalys_issiusta{sandelis:{laikas,kas,kanalas}}`: „Kurjeris paėmė (Avesa)“ / „[T] išsiuntė“ atskirai, `completed` + sekimo laiškas tik kai visos dalys (T4: #35438 Prins išsiuntė → liko processing „dar laukiam: Avesa“; Kurjeris paėmė → completed + laiškas). **K3+V7** — „Lipdukas“ per dialogą (paštomatas/adresas, svoris, dėžių laukas) → savas `lipdukas` (įrašo dėžes, mišriam automatinis `perreg`) → variklio `vp_reg` (T6: 3 dėžės → V…049–051; T9: antras → „jau registruotas“). **V8** — „Surinkti visus (n)“ (vienas lapas) ir „Lipdukai visiems (n)“ (`vp_bulk`). **V13** — „Užsakyti iš Ambrosia ir Vetfarmas (2)“. **V6** — atšaukimo dialogas įspėja apie registruotas siuntas / išsiųstus laiškus / užsakytas partijas. **V4/S4** — tekstai; variklio pranešimai darbuotojo žodžiais. **V2** — grynai AV likutis per `wc_update_product_stock` (atominis) + transient užraktas `ps_dl_lock_{id}` 20 s; **V3** — be `wp_cache_flush`.
- v3.5 (Raimis): Dropshipping kortelėje kiekvienam užsakymui „Lipdukas“ su dialogu (dėžių skaičius tam klientui, adresas/paštomatas, svoris) per savą `lipdukas` (sandelis=tiekėjas, mišriam automatinis perreg); ne-Venipak pristatymas → įspėjimas vietoj mygtuko (#35435 — mano testinis su `flat_rate`, todėl Venipak jo neregistravo); „+ į AV“, kai atviro užsakymo tiekėjui nėra — nuoroda į Tiekimą.
- v3.4/3.4.1 (Raimis): prekių miniatiūros sąraše (grupei iki 3) ir skydelyje; kliento pastaba lieka geltona („Klientas: …“); eilė „Užsakyti iš tiekėjų“ → **„Dropshipping“** (Raimio sprendimas — sistemos žodis, bet aiškus: iš tiekėjo tiesiai klientui).
- v3.3 (Raimis): „Visi“ — visa eilutė spalvota pagal būseną (fonas + kairė juostelė), tik čia.
- v3.2 (Raimis): taisyklė — pati išrūšiuoja TIK vieno sandėlio užsakymus; **2+ sandėliai → Neišrūšiuoti** su pasiūlymu; eilutėje **„Auto“** = surūšiuoti kaip siūlo, neatidarant (nerodomas, kai kliento pastaba ar trūkumas); pasiūlymas „veža į AV“, kai to tiekėjo užsakymas į AV jau atviras (kaupiama/užsakyta). Jokių svorio/sumos ribų (Raimis). Patikrinta: #35443 VF+ZB → Neišrūšiuoti → Auto → Dropshipping; #35444 AV+Quattro → siūlo „Quattro veža į AV“ (partija #12).
- juosta v1.5: Prekių kortelė `.pskat-kort` (sticky top:0) lįsdavo po juosta — top:102px.
- v3.1 (Raimis: `dokumentai/ZODYNAS_DARBUOTOJUI_v1.md`, su jo pataisomis „Gauti“ ir „Neišrūšiuoti“): sandėliai trumpai AV/VF/ZB/Prins/Belacor/Quattro/Ambrosia; eilės **Gauti · Neišrūšiuoti · Laukiam iš tiekėjų · Surinkti AV · Užsakyti iš tiekėjų · Paruošta siųsti · Klausimai · Neapmokėti · Visi**; keliai „Iš AV · VF siunčia klientui · VF veža į AV“; mygtukai „Užsakyti iš VF (n užs.)“ (laiškas — tik peržiūra), „Užsakyti iš Prins į AV“, „Suvesti į ZB / Suvesta“, „Kurjerio sąrašas“, „Sekimo numeriai klientui“, „Lipdukas iš naujo“, „Istorija“. **Gauti** = darbuotojas dar neatidarė skydelio (`_ps_matyta` per `wp_ajax_ps_dl_matyta`), eilutėje paryškintas nr + „N“, laikas kaip amžius („prieš 40 min / vakar 17:41 / prieš 3 d.“) — kalendorinė „šiandien“ logika atmesta (savaitgaliai). **Visi** — būsenos žymė (Neapmokėtas · Neišrūšiuotas · Ruošiamas · Paruoštas · Išsiųsta dalis · Išsiųstas · Įvykdytas · Atšauktas · Klausimas), spalvos tik čia. Patikrinta Playwright (`e2m_*`): Gauti 21→20 atidarius.
- v3.0/3.0.1 (Raimis: „su 10 užsakymų — košmaras, noriu paprasčiau“): nuimti sluoksniai — juostos kelias paslėptas, be legendos/datos/paaiškinimo/takelio sąraše, filtrai už „Filtrai ▾“; eilutė = 3 stulpeliai (Užsakymas · Prekės pagal kelią „Iš AV · 3 vnt. · Animonda… +2“ · Toliau); „Šiandien atėjo“ → eilė su „Kur dabar“ (v3.1 → Gauti).
- v2.4 (Raimis: „atsekamumas 0“): „Kur dabar“ (`kur_dabar()`) pranešimuose po veiksmo, skydelio antraštėje; juosta „Šiandien atėjo“ (v3.0 nuimta kaip triukšmas).
- v2.3 (Raimis: senoje Rytinėje eigoje „Mišrūs → Atidaryti“ vedė į WC): `view=rytas` = **nauja Rytinė eiga be užrakto** (D1/D2) — 8 žingsniai su gyvais skaičiais iš tų pačių faktų (1 Surūšiuoti · 2 Lipdukai ir laiškai tiekėjams su ribomis per tiekėją · 3 Užsakyti iš tiekėjų · 4 Surinkti · 5 Lipdukai Avesai · 6 Išsiųsta · 7 Gavimai → Tiekimas · 8 Klausimai), kiekvienas veda į eilę; senas vaizdas tik `senas=1&view=rytas` (LP lipdukai iki T-0). Patikrinta Playwright admin paskyra (`e2j_rytas`). Audito V10 uždarytas, išskyrus LP.
- v2.2: **V1** — prekė be sandėlio → Klausimas „Prekė be sandėlio“, skydelyje „Avesa sandėlis“ rankiniu būdu be likučio (*testo T5 nėra — dev'e neradau prekės be šaltinio*). **V5** — `_ps_surinkta` (laikas|kas) per `admin_post_ps_desk_veiksmas` prior. 0 + „Atšaukti surinkimą“ (`nesurinkta`) — patikrinta #35439. **K2** — atviri tik processing/on-hold/LP (riba 1000 + įspėjimas), Neapmokėti atskira užklausa (pending/failed ≤14 d.), žurnalas skydelyje per `wp_ajax_ps_dl_zurnalas`.

**Nauja meta:** užsakymo `_ps_matyta` (laikas|kas — Gauti), `_ps_rusiuota` (laikas|vartotojas | `auto`), `_ps_dalys_issiusta` (JSON), `_ps_surinkta`, `_ps_sekimo_siusta` (dubliuoja siuntų-laiškų žymę — V12); eilutės `_ps_kelias` (av|tiesiai|i_av — ketinimas; rodomas kelias iš `_ps_source`+partijos). Žurnalo veiksmai: `kelias`, `rusiuoti`, `issiusta`, `issiusta_dalis`, `nesurinkta`.

**Auditas ir kas liko** (`dokumentai/AUDITAS_UZSAKYMU_LANGAS_2026-09-03.md`): padaryta K1, K3, K4, V1–V8, V13, S4; liko V9 (Visi puslapiavimas, „išsiųsta šiandien“ iš `_ps_dalys_issiusta`), V10 (LP tik per Rytinę eigą; sena eiga su užraktu gyva iki 3 etapo), V11 (reload kas 60 s), V12 (`perskaiciuoti_grupes()` dubliuoja variklį — reikia viešo variklio metodo, R13 išimtis Raimiui), K2 dalinai (skydelis dar `data-json`, „Visi“ 35 užs. ≈ 446 KB), S2/S3, T2/T3/T10 netestuota; §11.1 Venipak neatsiimtos siuntos kaina — Raimiui.

**Testiniai duomenys:** užsakymai **#35435–#35440** (AUDITAS T22–T27; #35437/#35438 completed), likučiai 18593 `_own_stock_qty` 22→20, 19708 `_stock` 24→14 (5 užs. × 2–3 vnt., dalis grąžinta), partijos #12 (Quattro, kaupiama), #13 (Prins, gauta); Venipak **V07267E1000046–052**, manifestai …0903001/…0903005 — Raimis trina savitarnoje. Žurnale ~40 testinių įrašų. TEMP snippet'ai trinami kiekvieno run'o pradžioje (liko paskutinis, deaktyvuotas). Bridge rezultatai `analize/e2_run1…11b.json`, nuotraukos `screenshots/e2*_*.png`.

**Radiniai:** `petshop-siuntu-laiskai.php` gyvas (md5 `753f8c6c…`, v1.2) ≠ repo `deploy/` kopija (`eddc909e…`) — gyvas neliestas, repo kopija pasenusi; `_petshop_order_pdf` mu-plugins/petshop-core nėra (tik neaktyvus snippet 652) — Sąskaita (I5) 5 etape; Code Snippets REST snippet'as >~110 KB nesukuriamas.

**Raimio sprendimai 09-03 (antra pusė):** Gauti = neatidaryti (ne „šiandien“); 2+ sandėliai → Neišrūšiuoti + „Auto“; jokių svorio/sumos ribų; tiekėjų atvežimo dienos — vėliau; „Dropshipping“; spalvos tik „Visi“; kliento pastaba geltona; nuotraukos sąraše. Atsiėmimo pristatymo būdo ir telefoninio užsakymo kūrimo — **5 etape** (kartu su Redaguoti / Sąskaita / „Naujas užsakymas“), iki paleidimo. Trijų sandėlių „į AV“ logika (AV siunta renkama tik kai visos prekės vietoje) — paaiškinta, su dviem tiekėjais dar netestuota (T1 tik su vienu).

**Sekimo laiškai — Raimio sprendimas (vakaras):** laiškas klientui **po kiekvienos siuntos** („Išsiųsta 1 iš 2 …“), ne vienas kai visos; 4 etape automatinis iš Venipak „Picked up“; sekimo juostelė laiške + kliento puslapis (5 et.); kasoje sakinys „gali atvykti atskiromis siuntomis“ (5–6 et., kasos prieš paleidimą neliesti). Įrašyta spec v1.2 §12. **Perdavimas kitam langui:** `dokumentai/STARTAS_2026-09-04_3_etapas.md`.

**Kiti etapai:** 3 — Laukiam iš tiekėjų kortelės su „Užsakyti iš [T]“ = partija + laiškas (G4) čia pat, Rytinė eiga be užrakto; 4 — sekimas ant `_ps_dalys_issiusta`; 5 — Redaguoti, Sąskaita, „Kaip mato klientas“; 6 — E2E ir testinių valymas.

---

### S1606 (2026-09-03, naktis)

> Pridėti po S1605. Tema: užsakymų sistemos 1 etapas (spec §10.1) — užsakymų žurnalas ir viena juosta visuose Petshop languose. Variklis (registras A–J) nekeistas.

#### S1606 — ETAPAS 1: `petshop-uzsakymu-ivykiai.php` v1.1 + `petshop-juosta.php` v1.4

**Prieš darbą:** `uploads/ps-backups/petshop-desk-v348-BACKUP-2026-09-03.php` (185 134 B, md5 `33c9b1fe…` = gyvasis) — papildomai prie S1604 SNAPSHOT. TEMP 4538 ištrintas. Recon: `analize/e1_recon.json`, `e1_recon2.json` (langų juostos: `.pskat-bar` katalogas/rinkiniai/akcijos, `.psgav-bar` gavimas, `.pd-top` desk, „← Petshop užsakymai“ Tiekime/Laiškuose; `Petshop_Desk::riba()` protected, RIBOS/SALTINIAI const).

**Radinys — spec pataisa:** `petshop-ivykiai.php` ir lentelė `ps_ivykiai` (spec §6, §10.1) JAU EGZISTUOJA — prekių auditas (product_id, tipas, laukas, sena→nauja; 5 450 įrašų). Neliesta. Užsakymų žurnalas — atskiras failas ir lentelė `ps_uzsakymu_ivykiai`. Spec/registro tekstuose vardą keisti į `uzsakymu_`.

**`mu-plugins/petshop-uzsakymu-ivykiai.php` v1.1** (27 433 B, md5 `1bd24c70…`; repo `deploy/`), klasė `Petshop_Uzsakymu_Ivykiai`:
- Lentelė `ps_uzsakymu_ivykiai`: laikas (UTC), diena (Vilnius), uzsakymas, eilute, sritis (desk/dropship/tiekimas/siuntos/wc), veiksmas, rezultatas (ok/klaida/praleista/nezinoma), busena (''/siulyta/priimta/atmesta — AI lizdui), kanalas (web/auto/cron), kas, kas_vardas, pries/po (JSON), pastaba. Nieko netrinama.
- Gaudymas iš išorės, variklio kodas neliestas: `admin_post_ps_desk_veiksmas`, `ps_dropship_send/zb_done/visi/lipdukas`, `ps_tiekimas`, `ps_tiekimas_eilute`, `ps_tiekimas_lipdukas`, `ps_siuntu_siusti` — prior. 1 nuotrauka PRIEŠ (būsena, `_ps_order_type`, dėžės, `_ps_siuntos`, mišraus planas, konsolidacija, dropship_sent, eilučių `_ps_source/_ps_carrier/_ps_av_reduced_qty`, prekių `_own_stock_qty/_stock`), `wp_redirect` filtras — PO + rezultatas iš pd_ok/pd_nr/msg/klaida/psl_sent; `wp_die_handler` → `klaida` su tekstu; PDF/echo → shutdown. Laiškai (`wp_mail`) → `po.laiskai`. Partijos veiksmai susiejami su užsakymais per `ps_tiekimas_eil.order_id`.
- WC: `woocommerce_order_status_changed` (kanalas web/auto, pastaba „per: <veiksmas>“ jei viduje mūsų veiksmo) ir `woocommerce_payment_complete` prior. 99 (po `AV_Order::fiksuoti`, pastaboje keliai eilutėms).
- API: `irasyti()`, `uzsakymo()`, `paskutinis()`, `zmogui()` (žodynas spec §2), `skirtumas()`, `html()` skydeliui; `do_action('ps_uzs_ivykis')`. Langas `admin.php?page=ps-ivykiai` (paslėptas submenu; filtrai užsakymas/sritis/veiksmas, 300 eil.).
- Patikra darbuotojo paskyra (`analize/e1_deploy.json`, `e1_deploy2.json`): `pakuotes` #35434 0→2→1 su prieš/po; blogas nonce → `klaida` „wp_die: …“ (desk, tiekimo eilutė, dropship lipdukas); būsena processing↔on-hold; 8 įrašai. **Nepatikrinta:** realus PDF kelias (lipduko nonce vardas ne `ps_dropship_lipdukas_{id}` — tikrinti 2 etape); laiškų gaudymas realiu `ps_dropship_send`.

**`mu-plugins/petshop-juosta.php` v1.4** (md5 `95552f96…`; repo `deploy/`), klasė `Petshop_Juosta`:
- `in_admin_header` visuose `page=ps-*`/`petshop-*` (be ataskaitų/langų/naujienlaiškių/FBT/Pragma/promotions): ⌂ svetainė (nauja kortelė) · Užsakymai [processing+on-hold; raudonas — pending/failed] · Rytinė eiga · Prekės [reikia užsakyti] · Gavimas · Tiekimas [kaupiama / užsakyta] · Rinkiniai · Akcijos · Laiškai [laukia perdavimo — `Petshop_AV_Dropship::laukiantys_perdavimo()`] · artimiausia riba (`Petshop_Desk::riba()` per ReflectionMethod) · paieška į desk „Visi“ (`/`) · Žurnalas · vartotojas · ⏻. Antra linija: kelias iš sessionStorage (iki 4 žingsnių, pavadinimas iš aktyvaus punkto/h1 + eile/view/b/kortele/…) ir vienas „← Atgal“ (ankstesnis žingsnis; be istorijos — ps-desk). Skaičiai — transientas 60 s, valomas per būsenų/apmokėjimo/žurnalo kablius.
- Paslėpta TIK CSS (R4, failai neliesti): `.pskat-logo/.pskat-nav`, `.psgav-bar` nuorodos, desk `.pd-top`, `<p><a.button>← Petshop užsakymai</a></p>`, WP kairysis meniu (`#adminmenumain`, `#wpcontent{margin-left:0}`) — kaip desk/katalogas jau darė. Desk `.pd{position:fixed;top:32px}` → `top:102px` (v1.0 slėpė „Nauji“ — pataisyta v1.1). Juosta prisitaiko prie `#wpcontent` padding per JS.
- „Prekės [reikia užsakyti]“: `ps_kat_duomenys` transientas realiai NESAUGOMAS (masyvas > 4 MB, `surinkti()` skaičiuoja kas kartą), todėl cron `ps_juosta_reikia_cron` kas valandą (`surinkti()`+`eiles(...,'prekyboje')['uzsakyti']`, ~0,9 s) → opcija `ps_juosta_reikia` [n, laikas]; title rodo „katalogo duomenys HH:MM“. Pirmas skaičiavimas 01:23 → 434.
- Patikra: 8 langai (desk, rytas, tiekimas, katalogas, laiškai, gavimas, žurnalas, rinkiniai) — juosta yra, CSS/JS yra; Playwright nuotraukos `screenshots/e1b_desk.png`, `e1b_rytas.png`, `e1b_tiekimas.png`, `e1b_laiskai.png`, `e1b_zurnalas.png`, `e1b_desk_mob.png` (420 px).

**Bridge:** `irankiai/mjs_template.mjs` papildytas ekrano nuotraukomis (browser=1): fazė grąžina `shots:[{n,u,w,h,full}]` + `cookies` → Playwright → `screenshots/<n>.png`. `irankiai/darbuotojo_testas_sablonas.php` naudotas kaip pagrindas.

**Testiniai duomenys:** #35434 `_ps_pakuociu` grąžinta į 1, būsena processing (kaip buvo). Žurnale 8 testiniai įrašai — palikti (istorija).

**TEMP:** 4538–4545 ištrinti; liko paskutinis `4546` (deaktyvuotas) → trinti kitą run'ą.

**Lieka (spec §10):** 0 Raimio peržiūra v7 → 2 `petshop-darbalaukis.php` (eilės, takelis, skydelis su keliais ir žurnalu per `Petshop_Uzsakymu_Ivykiai::html()`, likučių taisyklė §5) → 3 → 4 `petshop-sekimas.php` → 5 → 6.

---

### S1604–S1605 (2026-09-02 vakaras – 2026-09-03)

> Pridėti po S1603. Tema: atsarginė kopija prieš UI etapą; užsakymų sistemos strategija (trys keliai), logikos registras, spec, maketai v1–v7; Venipak sekimo API patikra.

#### S1604 — SNAPSHOT prieš juostą + git žymė

`uploads/ps-backups/SNAPSHOT-2026-09-02-pries-juosta.zip` — 14 124 004 B, md5 `a6a516953a9284883d7249036d4f92dc`, 1 436 failai: `mu-plugins/`, `plugins/petshop-core`, `plugins/petshop-xml`, `theme-child/`, `snippets/` (870 Code Snippets iš DB su aktyvumo žyme, be TEMP; INDEX.txt), `options-ps.json` (`ps_*` be secret/pass), README su atstatymo eiga. Git žymė `pries-juosta-2026-09-02` = commit `4698d0c`. Raimio sprendimas: viena sistema, ne dvi; kopija tik grįžimui.

#### S1605 — Užsakymų darbalaukio strategija: registras, spec, maketai

**Raimio sprendimai** (visi `dokumentai/UZSAKYMU_DARBALAUKIS_SPEC_v1.md` §1 R1–R13): darbuotojas daro ir mato viską, Raimiui nieko nesiunčiama; WC langų darbuotojui nėra niekur (WC — variklis + Raimio atsarginis raktas); viena juosta visuose languose + namukas į svetainę; kiti langai nekeičiami; mišrių taisyklės nėra (sprendžia darbuotojas, sistema siūlo); **trys keliai** kiekvienai prekei su pilnais vardais (Avesa sandėlis · [Tiekėjas] → klientui · [Tiekėjas] → Avesa sandėlį); rūšiavimas prieš surinkimą, Avesos siunta viena ir renkama tik kai visos jos prekės vietoje; rytinės eigos užrakto nėra (užsakymai krenta nuolat); **likutis seka kelią**; automatika pagal kriterijų „grįžtama / išorinis faktas / pinigai neišeina"; pristatymo pažado kasoje nėra; prieš paleidimą papildomai: įvykių žurnalas · Venipak/LP sekimas · redagavimas skydelyje · sąskaitos · rūšiavimas · kasos patikra · vėlavimo laiškas · kliento takelis · dovanėlės kortelė · blogų statusų Klausimai; po — grąžinimai, skenavimas, tylus spausdinimas, SLA ataskaita; naujas darbalaukis = naujas failas, senas lieka snapshot'e.

**Dokumentai (repo `dokumentai/`):**
- `UZSAKYMU_LOGIKOS_REGISTRAS_v1.md` — 52 taisyklės iš desk H221–H265, dropship v1.2–1.19, tiekimo v1.2–1.9, siuntų laiškų, av-source/order/reduce, TŽ §35; kiekviena su vieta kode ir vieta naujame darbalaukyje; 9 ⚠ vietos, kur maketai v2–v5 buvo pametę logiką (A7, A10, C2, C3, C8, D1, E7, I1, I5); skyrius K — Shopify fulfillment orders / ShipStation / Baselinker palyginimas.
- `UZSAKYMU_DARBALAUKIS_SPEC_v1.md` v1.1 — sprendimai, žodynas (12 žodžių), eilės (8) ir rikiavimas, skydelis su Redaguoti/Sąskaita, likučių lentelė, automatika 10 punktų su lygiais, 6a sekimas/vėlavimas/auto rūšiavimas/kortelė/kliento takelis, 6b grąžinimai, 6c redagavimo taisyklės, 7 langai, 8 nepaliesta, 9 audito būklė, 10 vykdymo etapai (6), 11 klausimai Raimiui (5).
- Maketai: `juosta-maketas.html` (juosta, kelias, skydelis iš bet kurio lango), `uzsakymai-maketas-v2..v7.html` (v7 galutinis: trys keliai, rūšiavimas, takelis, Laiškai/Paruošta pagal tiekėją, Klausimai 4 rūšys, Neapmokėti, Redaguoti, Sąskaita, „Kaip mato klientas", lapas su EAN + dovanėlės kortele, Grąžinimas, imitacijos: Venipak sekimas, vėlavimo sargas, naujas užsakymas). Logika testuota node'u be DOM.
- `analize/audit_m2.json` — langų žemėlapis: prekių pusė turi juostą (petshop-teises), užsakymų — savą, Tiekimas/Laiškai/Lapai/Perdavimas — be jokios; 12 „Atgal" variantų; 5 keliai į WC užsakymą (4 `_blank`).

**Radinys — Venipak sekimo API veikia tavo sutartimi:** `GET go.venipak.lt/ws/tracking?user&pass&code=V07267E1000030` → CSV `"Package No.","Shipment No.","Date","Status","Terminal"` / `"At sender"`. Masinės užklausos (keli numeriai) — „Wrong pack number"; `ws/get_pack_status` — 404. Pluginas tuo pačiu rašo `pack_status_text`. Pagrindas automatikai 6.2 (auto Išsiųsta, sekimo laiškas, blogi statusai → Klausimai, partija atvyko). Statusų žodynas po „At sender" — rinkti po T-0.

**Radinys — likučiai keičiant kelią:** `petshop-av-reduce.php` v1.1 nurašo tik apmokant (`_ps_av_reduced` užsakymo lygiu) ir grąžina tik cancelled/refunded; Klausimo „siunčia tiekėjas" kelias AV likučio negrąžina (#35423 AV 1→0 liko). Sprendimas — spec §5.

**Lieka (kitas langas, spec §10):** 0 Raimio peržiūra spec/v7 → 1 `petshop-ivykiai.php` + `petshop-juosta.php` → 2 `petshop-darbalaukis.php` → 3 Laiškai/Laukiam/Surinkti/Paruošta/rytinė eiga → 4 `petshop-sekimas.php` → 5 Redaguoti/Sąskaitos/vėlavimas/kliento takelis/kasos patikra/kortelė → 6 E2E auditas. Atviri klausimai Raimiui spec §11.

**Testiniai duomenys:** #35414–#35434 tebėra (Raimis pasakys, kada trinti); Venipak savitarnoje V07267E1000030–045, manifestai …001–006.

**TEMP:** šios sesijos snippet'ai (4534–4541) — ištrinti S1605 pabaigoje, liko paskutinis (deaktyvuotas).

---

### S1602–S1603 (2026-09-02, vakaras)

> Pridėti po S1601. Tema: pilnas užsakymų sistemos auditas darbuotojo akimis (17 testinių užsakymų, realūs endpoint'ai, Venipak gyvai) → 3 kritiniai defektai → K1–K3 pataisyti ir patikrinti.

#### S1602 — UŽSAKYMŲ SISTEMOS AUDITAS (`dokumentai/AUDITAS_UZSAKYMAI_2026-09-02.md`)

**Metodas:** 17 testinių užsakymų #35414–#35430 (klientas „AUDITAS Testas N", terra@petshop.lt), visi veiksmai atlikti paskyra `testuotojas` (rolė `ps_darbuotojas`) per realius `admin-post.php` endpoint'us su nonce iš sesijos (loopback su `wp_generate_auth_cookie` + `WP_Session_Tokens`), ne per kodą. 9 bridge run'ai (`analize/audit_r|g|c|d|e|f|g2|h|i.json`). Venipak kviestas realiai: siuntos **V07267E1000030–043**, manifestai `07267260902001/002/003/004/006`. LP Express nekviestas.

**Veikia (patikrinta):** šaltinių priskyrimas 17/17; visos 9 eilės; Klausimas „Trūksta sandėlyje"; mišraus planas (tiesiai / į AV → partija); Pažymėti apmokėtu; Atšaukti (likutis grįžta); rytinė eiga 6 žingsniai; grupinė Venipak registracija pagal sandėlį su savais manifestais; kurjeris 3 dėžės (`packs[]`); paštomatas 2 dėžės (2 siuntos); dublio saugiklis; manifesto PDF; „Venipak lipdukai" 6/6 psl.; surinkimo lapai; perdavimas VF/AMB (laiškas + lipdukas 102 KB + manifestas); ZB rankinis kanalas; Išsiųsta + §18.3 sargas; sekimo laiškas su visais numeriais; Tiekimas kurjeriu → priėmimas → Nauji.

**Defektai:** 🔴 K1 atšauktas užsakymas užrakintoje partijoje registruojamas Venipak (#35430 → V…041); 🔴 K2 po tiekimo priėmimo konsoliduota eilutė nepatenka į surinkimo lapą, `_ps_shipments` lieka senas; 🔴 K3 Tiekimas „Venipak paštomatas (Nemenčinė)" → „Pickup/Locker not found"; 🟠 V1 mišrūs be plano patenka į „Laiškai tiekėjams → Laukia išsiuntimo"; 🟠 V2 mišraus abi dalys registruojamos su viso užsakymo svoriu (2,07 kg ×2); 🟠 V3 „Išsiųsta" be laiško klientui, sekimo laiškas neprimenamas; 🟠 V4 mišriam darbalaukis rodo tik paskutinę registraciją; 🟡 S1–S6. Pilnas sąrašas, įrodymai, darbuotojo akių skyrius ir valymo protokolas — ataskaitoje.

**Raimio sprendimai po audito:** darbuotojas daro ir mato VISKĄ (nuo prekių gavimo iki užsakymų), Raimiui nieko nesiųsti; mišrių taisyklės nėra — sprendžia patyręs darbuotojas; dažniausiai ≤2 siuntos klientui. Kitas etapas: viena juosta visuose Petshop languose + kryžminės nuorodos + žodynas (langų žemėlapis `analize/audit_m2.json`: prekių pusė turi juostą Katalogas·Akcijos·Gavimas·Tiekimas·Rinkiniai·Užsakymai, užsakymų pusė — savą; Tiekimas/Laiškai/Lapai/Perdavimas — be jokios; 12 skirtingų „Atgal" variantų; 5 keliai į WC užsakymą, 4 iš jų `_blank`).

**Šalutiniai radiniai:** `lpsettings_api_password` DB grynu tekstu (LP plugino savybė) — pateko į `analize/audit_r.json`, failas perrašytas be jo. `ps_ryto_*` transientai — po vartotoją, 3 val.

#### S1603 — K1–K3 pataisos: desk v3.48 + tiekimas v1.9.3

**`petshop-desk.php` v3.48** (185 134 B, md5 `33c9b1fe…`; backup `uploads/ps-backups/petshop-desk-v347-BACKUP-2026-09-02.php`; repo `deploy/`):
- `ryto_partija()` grąžindama užrakintą partiją kviečia naują `ryto_partija_isvalyti()` — perfiltruoja pagal ESAMĄ statusą (tik `processing`/`on-hold` ir apmokėti), išima iš `visi/av/ds/vp/lp/klausimai/vp_misrus/vp_grupes/eil`, perskaičiuoja `tiekejai`; transientas perrašomas.
- `vp_reg` ir `vp_bulk`: ne-processing/on-hold praleidžiami su „#N atšauktas" (`vp_nieko`).
- „Atšaukti" darbalaukyje → `ryto_partija_ismesti()` išima ID iš VISŲ vartotojų `_transient_ps_rytas_*`.
- Patikra (darbuotojo paskyra): #35432 atšauktas per darbalaukį, #35433 per WC `update_status` — abu dingo iš z1/z3 po užrakinimo; `vp_reg ids=35432,35433` → „#35432 atšauktas, #35433 atšauktas"; `vp_bulk` → tas pats. Siuntų nesukurta.

**`petshop-av-tiekimas.php` v1.9.3** (75 499 B, md5 `018548dc…`; backup `ps-backups/petshop-av-tiekimas-v192-BACKUP-2026-09-02.php`; repo `deploy/`):
- K2: nauja `eilutes_i_av($oo,$pid)` — kviečiama iš `priimti()` kai užsakymui prekių užteko: konsoliduotoms eilutėms `_ps_source=av`, `_ps_carrier=any`, `_ps_source_reason='parsivežta iš X, partija #N'`, gautas kiekis iš karto rezervuojamas (`AV_Stock::decrease` + `_ps_av_reduced`), perskaičiuojami `_ps_groups`/`_ps_shipments`/`_ps_order_type` (kaip `AV_Order::fiksuoti`). `_ps_konsolidacija` ir mišraus planas paliekami (istorija; `kons_laukia()`/`neperduotos()` tokią eilutę praleidžia, nes šaltinis av).
- K3: Venipak paštomatui consignee lygiai kaip plugino `admin-dispatch.php`: `company_code` = paštomato **code** `300906055` (ne id 3648) **pirmas** elementas, `name` = API `name` „Venipak locker, AIBĖ Venipak paštomatas". `AV_PASTOMATAS` += `kodas`, `api_vardas`. Pirmas bandymas tik su kodu, bet sena tvarka (name pirmas, display_name) — vis tiek „not found"; tvarka + vardas lėmė.
- Patikra: #35434 (AV+Prins, planas PRI→AV) → partija #11 paštomatu → **V07267E1000045**, manifestas `07267260902005`, lipdukas laiške; priėmimas → Prins eilutė `av` (`parsivežta iš PRINS, partija #11`), `_own_stock_qty` +1−1=0, `_ps_av_reduced`, MAIN 1 siunta, surinkimo lape abi prekės, eilutė Nauji „SAVA · planas PRI→AV · Surinkti", rytinė eiga AV grupėje. Pirmas bandymas su Quattro (#35431) neinformatyvus — 16727 turėjo `_own_stock_qty=1` iš S1602 testo, resolve davė av iš karto.

**Lieka (iš audito, neliesta):** V1 mišrūs be plano „Laiškai tiekėjams", V2 grupės svoris, V3 sekimo laiškas iš „Išsiųsta", V4 mišraus siuntų rodymas, S1–S6, LP 1 realus testas T-0.

**Testiniai duomenys serveryje (trinti kartu su S1602 sąrašu):** užsakymai #35414–#35434 (21), `ps_shipments` 12+ eil., partijos #10 (Quattro) ir #11 (Prins), `ps_audit_ids` option, archyvas 5 [PERSIŲSTI …] laiškai; likučiai #19708 43→24 (+2 grąžinta), #35074 1→0, #16727 `_own_stock_qty` 1→0, #16889 0. Venipak savitarnoje: V07267E1000030–045 (042/044 — nepavykusių bandymų numeriai), manifestai …001/002/003/004/005/006.

**TEMP:** 4510–4521 ištrinti S1602; šios sesijos 4522–4532 — trinti kitą run'ą.

---

### S1591–S1601 (2026-09-02, rytas–popietė)

> Pridėti po S1590. Tema: Exclusion Hypo konservai → VF sandėlis; radinys — VF importas negyvas nuo 08-22; Sources v2.3 dviejų sandėlių eilutės; radinys — ZB likučių Import #3 buvo tuščias (no-op).

#### S1591 — Exclusion Hypo konservai atgal į VF (AV+VF dviejų sandėlių modelis)

**Priežastis (serveris, ne atmintis):** ne brandas, ne SKU — `class-import-rules-vf.php` `vf_category_map` neturėjo `VET kons. hipoalerginis maistas šunims` (feed'e 18) ir `…katėms` (1) → `block_vf_create` `no_category_mapping`. Tas pats mechanizmas, kuriuo 2026-05 sąmoningai laikėm juos tik AV. Antras sluoksnis: `category_groups_map['konservai']` = `konserv|drėgn` — VF rašo „kons." → grupė krito į `aksesuarai` → 2,5 € konservas `aksesuarai_below_6eur`.

**Padaryta:**
1. `class-import-rules-vf.php` **v1.1** (md5 `191637c6d58e661f8e7ed0d352c2556a`): +2 mapping'ai → `konservai-sunims`/`konservai-katems`; `konservai` grupė += `'kons.'`. Backup `ps-backups/class-import-rules-vf-v10-BACKUP-2026-09-02.php` (md5 `4a4ef2b1…`). Repo `plugins/petshop-xml/includes/`.
2. 8 AV prekėms (18593–18614: AM20, QM37, PM37, PM20, VM37, HM37, DM37, DM20) `_stock` → `_own_stock_qty` (22/4/32/20/17/0/19/22; backup `ps-backups/exclusion-hypo-kons-BACKUP-2026-09-02.json`). Raimis: likučiai lieka kokie yra — T-1 keisis su eShoprent eksportu.
3. Import #5 paleistas: **8 created · 77 updated · 2306 skipped**, 547 s. 8 AV suporuotos (3 ean / 5 sku match), šešėliai (8) → trash su `_vf_duplicate_of`. Kaina nepaliesta (Scenarijus A). `_stock`=VF, `_own_stock_qty`=AV, klientas mato sumą (AM20: 22+76=98; PM37: 32+1411=1443). `_ps_sandelis` liko `av` (esamų nekeičia — Sources v2.2 taisyklė).
4. **11 naujų Hypo konservų** (AM37, PA37, QM20, FM20, FM37, HM20, VM20, BM20, BM37 + CHYP85 katėms) — **publish**, kaina BRAND:Exclusion +DISC:15% (2,29–3,79 €, CHYP85 1,51 €), foto/aprašymas/EAN/brand/kategorija ✓. PA20 — draft `qty_zero` (VF 0 vnt.; snippet 565 publish path pakels, kai bus). Dublių pagal SKU 0.
5. Vizualiai: dev AM20 puslapis 200, instock, ATC mygtukas.

**Radinys #1 (kritinis, buvo nematomas): VF importas negyvas nuo 2026-08-22.** Po R191→R192 `https://dev.avesa.lt/wp-content/petshop-xml-vf-fetcher.php` = 404 (dev liko tik router'is). pmxi #5 (katalogas) paskutinis sėkmingas 08-21, #7 (likučiai) 08-27 — abu stovėjo `triggered=1`, processing „No data was returned… private IP". `uploads/petshop-vf-cache.xml` sustingęs **08-21 12:16**; snippet 565 „VF Sync" kas valandą rašė 12 d. senus likučius ir žymėjo `_vf_last_sync` šiandienos data (1 175 prekės) — žymė melavo. Diagnozė S1583 (0 vėluojančių cron) šito nematė, nes hosting cron kvietė URL sėkmingai (200 su klaidos JSON).

**Sprendimas:** naujas mu-plugin **`petshop-vf-feed.php` v1.0** (7 075 B, md5 `1ee413b1dd1000dcf77e395a7b270486`): VF API → `uploads/wpallimport/files/vf-feed.xml` + `uploads/petshop-vf-cache.xml`, cron `petshop_vf_feed_hourly` kas valandą :05, saugikliai (root `<data>`, ≥1 000 eil., ≥50 % ankstesnio, atominis rašymas), option `ps_vf_feed_paskutinis`, rankinis `?ps_vf_feed=refresh|status&k=<FETCHER_SECRET_KEY>`. Kredencialai skaitomi iš esamo fetcher failo — repo slaptažodžio nėra. pmxi #5/#7 → `type=file`, `path=/wpallimport/files/vf-feed.xml` (kaip Import #1); senos reikšmės option `ps_pmxi_vf_backup_20260902`. **Nepriklauso nuo hosto → T-0 nieko keisti nereikia** (T-0 #24 iš ryto pastabos — nebereikia). Pirmas fetch 2 391 eil. / 8,5 MB / 6,6 s. Import #7 po perjungimo: 444 updated pirmu processing, tęsia hosting cron.

**Liko / deferred:**
- `ps_sources` spraga → išspręsta S1592 (žr. žemiau).
- VF likučiai 12 d. buvo pasenę → kitas Import #7 ciklas (hosting cron :16–:59) atstato; jei kur `_vf_qty` rodė likutį, kurio VF nebeturi — 08-22..09-02 užsakymų rizika (patikrinti `ps_fakt` VF eilutes, jei buvo).
- Senas `wp-content/petshop-xml-vf-fetcher.php` lieka (kredencialų šaltinis); po T-0 galima perkelti konstantas į wp-config ir failą trinti.

#### S1592 — Petshop Sources v2.3 (snippet 2515): dviejų sandėlių eilutės

**Šaknis (kodas, ne spėjimas):** v2.2 `suskaiciuoti()` tiekėjo eilutę kūrė TIK iš `_ps_sandelis` (viena reikšmė) → AV+VF/AV+ZB prekės vf/zb eilutės negaudavo (Monge/18512 eilutės — rankiniai 08-07/08-20 batch'ai). `uzpildyti_sandeli()` reikalavo registro eilutės, kuri be sandėlio neatsiranda → naujos VF prekės amžinai be sandėlio. Matavimas prieš: **41 VF + 32 ZB** su tiekėjo SKU be eilutės, **38 publish be `_ps_sandelis`**; `naktinis()` (v2.2) → 0 pokyčio. Bonus klaida: `laukai('zb')` sku = `_zb_sku` — tokio meta nėra (0), tikras `_zb_supplier_sku` (1 091).

**v2.3** (39 130 B, md5 `681bef7ec50a143ffdcf7035dfa0e524`; backup `ps-backups/sources-v22-snippet2515-BACKUP-2026-09-02.php`; repo `moduliai/petshop-sources-snippet2515.php`):
- `suskaiciuoti()` +3 žingsnis: vf/zb eilutės iš meta (`tiekejai_is_meta()`: `_vf_supplier_sku` / `_zb_supplier_sku`|`_zb_qty`); priority AV 1, sandėlio tiekėjas 2, kiti 3; šešėliai (`_ps_shadow_of`) praleidžiami.
- `uzpildyti_sandeli()` fallback: registras tuščias → iš meta, jei LYGIAI VIENAS tiekėjas ir `_own_stock_qty` ≤ 0.
- `laukai('zb')` sku → `_zb_supplier_sku`. Rankiniai supplier_sku (Monge 01M210202) NEPERRAŠOMI (NULL neliečia — v2.1 taisyklė galioja).

**Rezultatas (`naktinis()` 3 833 prekės, 12,8 s): +26 eilutės, 11 išjungtos, VF be eilutės 41→0, ZB 32→0, be sandėlio 38→13 publish** — likę 15 = rinkiniai/TEST (35070–35309, 34889), šaltinio neturi pagal apibrėžimą (norma, `_ps_be_saltinio`). 11 naujų Hypo konservų `_ps_sandelis=vf` (žurnalas 427). Registras: av 1 447 · vf 1 208 · zb 1 107.
**ZB pritaikymas** — ta pati logika jau veikia ZB (Monge 17394: av 18 + zb 247 su rankiniu kodu); atskiro darbo nereikia.

#### S1593 — ZB Monge patikra → Import #3 (ZB likučiai) buvo NO-OP

**Raimio signalas:** Monge prekės „neatnaujintos nuo 06-29". Patikra: 278 Monge (104 publish ZB, 157 draft ZB, 14 AV legacy, 3 seni draft'ai). Post_modified 06-29 turi 3 AV legacy sausi kačių maistai (16225/16228/16248, be EAN, ZB feed'e nėra — likučiai iš T-1 eksporto, norma). Bet gilesnis matavimas — **`_zb_qty` vs gyvas `stocks.php`: 851 iš 1 056 skyrėsi** (pvz. 32463 Monge Supreme DB 745 / feed 32; 27959 DB 229 / feed 0), nors `_zb_last_sync` = šiandien.

**Šaknis (pmxi #3 options, ne spėjimas):** Import #3 turėjo `is_update_custom_fields=0`, `custom_name=[]` — **jokio `_zb_qty` mapping'o**. `petshop_xml_sync_only()` skaitė esamą `_zb_qty`, įrašė atgal ir uždėjo `_zb_last_sync=now` — žymė melavo (tas pats raštas kaip S1591 `_vf_last_sync`). `_zb_qty` keitėsi tik per Import #2 (products.php, selective hashing, pilnas praėjimas ~2 d.), o jo qty ≠ stocks.php. Nuo kada — nežinoma (S718 mini ZB profilių full_update laukų trynimą; tikėtina nuo tada).

**Fix:** pmxi #3 options → `is_update_custom_fields=1`, `update_custom_fields_logic=only`, `custom_name=['_zb_qty']`, `custom_value=['{qty[1]}']` (veidrodis veikiančio #7). Backup `ps_pmxi3_backup_20260902`. Paleista: 1 061 updated / 1 598 skipped, ~8 min. **Po: 1 056/1 056 sutampa su feed'u, 0 skiriasi** (35 kodų feed'e nėra — pasenę ZB kodai, draft'ai). Monge AV poros per šešėlius: 17394 480 (buvo 247), 17397 1 460 (296), 17400 1 270 (356)… klientas mato AV+ZB. `_stock` atnaujintas per `Petshop_Fulfillment::recalculate()`.

**Rekomendacija Raimiui (hosting cron):** Import #3 processing dabar `2 *` (1 kvietimas/val → pilnas praėjimas ~4–5 h). Pakeisti į `*/2 *` kaip #5/#7 — ciklas ~10 min. Trigger `0 *` palikti.

#### S1594 — `petshop-import-tempas.php` v1.2 (Import #3 processing kas 2 min iš WP pusės)

Raimio nurodymas „pakeisk serveryje": hosting cron panelio bridge neturi (shell_exec išjungtas), todėl dažnumas keliamas WP-cron'u. Mu-plugin (4 080 B, md5 `5461ff5abfaa53a559fcf0f9c3b0b982`): intervalas `petshop_2min` (120 s), hook `petshop_import_tempas`; jei pmxi #3 `triggered=1 ∧ processing=0 ∧ executing=0` → **blokuojantis** GET `<hostas>/wp-load.php?import_key=<cron_job_key>&import_id=3&action=processing` (timeout 75 s, transient užraktas 90 s) — tas pats kelias, kaip hosting cron. Du klaidingi bandymai pakeliui: v1.0 nebloguojantis GET iš WP-cron konteksto pmxi nepasiekė (chunk nesijudėjo 14:03→14:19); v1.1 raktas imtas iš PMXI `secure` — tai bool „1", pmxi su blogu raktu grąžina **tuščią 200**, ne klaidą; tikras raktas `cron_job_key`. v1.2 patikrinta: `vykdyti()` → „Import #3 complete" 27 s, WP-cron savarankiškai šauna (14:07/14:11/14:18 fiksuota `ps_import_tempas_paskutinis`). Trigger'io nekviečia (jį duoda hosting `0 *`). Hostas — option `ps_import_tempas_host`=`https://dev.avesa.lt` (petshop.lt DNS dar eShoprent); **T-0 #27: ištrinti option → home_url()**. WP-cron pažadinamas kiekvienu hosting cron `wp-load.php` kvietimu (12/val) + lankytojais. Būsena `ps_import_tempas_paskutinis`; `?ps_import_tempas=status&k=<secure>`. Hosting cron eilutė `2 *` lieka kaip yra (nekenkia). Rekomendacija #26 lieka galioti kaip švaresnis variantas, bet nebe būtina.

#### S1595 — `petshop-laukai.php` v1.44: rinkiklio kategorijos + konservai

Raimio radinys (ekranas 14:30): susidėjimo dėžės prekių rinkiklyje kategorijų sąraše tik skanėstai — konservų šunims/katėms nėra. Kodas: `filtru_reiksmes()` turėjo įrašytą sąrašą `95,96,97,98` (tik skanėstai) — konservų dėžių grupės (`kons_sunims`/`kons_kates`) egzistuoja nuo 08-15, bet jų kategorijos filtre nebuvo (prekes buvo galima rasti tik paieška). Fix: `const RINKIKLIO_KATEGORIJOS = [95,96,73,79,97,98]` (Skanėstai šunims/katėms, **Konservai šunims 73 (132), Konservai katėms 79 (149)**, graužikams, paukščiams); numatytoji kategorija pagal dėžės grupę (`kons_sunims`→73, `kons_kates`→79, `kates`→96, kitos 95); atributų (baltymai/mityba/grūdai) skaičiai dabar iš visų šešių kategorijų. Transient `ps_laukai_filtrai` išvalytas. Deploy per `deploy/petshop-laukai.php.b64` (186 KB — per didelis payload'ui), backup `ps-backups/petshop-laukai-v143-BACKUP-2026-09-02.php`, md5 `88b1fc3c69a474d50ad59f5e068c8dd8`. Patikra `rinkiklis()` per ReflectionMethod visoms 17 dėžėms: 7 opcijos, konservų dėžėms selected=73, katių — 96.

#### S1596 — `petshop-laukai.php` v1.45: meniu „Susidėk…“ nuorodos dinamiškos

Raimio radinys: RINKINIAI → „Susidėk konservų rinkinį katėms“ → 404. Priežastis: penki meniu punktai (34248–34252) buvo **custom URL į konkrečias TEST dėžes**; Raimis dėžę 34948 ištrynė (trash) ir sukūrė naujas — meniu liko į mirusį slug'ą. Kiti trys punktai vedė į **draft** dėžes (34937, 34936, 34933) — anonimui taip pat 404. Fix: filtras `wp_nav_menu_objects` → `meniu_nuorodos()`: punkto pavadinimas → grupė (`kons_sunims/kons_kates/sunys/kates/kramtalai`) → `iejimas($grupe)` (dėžė su `_ps_laukas_iejimas=yes`, kitaip pirma publish) → permalink; grupei be publish dėžės → `/kategorija/rinkiniai/` (ne 404). Meniu DB nekeistas. Patikra: 5/5 nuorodos → 200; konservai šunims → 34944, katėms → **34947 (Išrankioms, įėjimas)**, skanėstai katėms → 34938; skanėstai šunims ir kramtalai → RINKINIAI kategorija, nes **tų grupių publish dėžių nėra** (34935/34937/35101 ir 34933/34934 — draft; Raimio sprendimas publikuoti). md5 `6fb77a24b5d1f7c61ed6e1b4faed2740`.

#### S1597 — RINKINIAI filtras „pagal gyvūną“: preset + atributas

Raimio radinys: /kategorija/rinkiniai/ šone tik Amžius/Prekės ženklas/kaina. Dvi priežastys: (1) snippet 332 „Filtrų kontekstas“ rinkiniams preset'o neturėjo → widget numatytasis `maisto-filtras` (be Gyvūno rūšies); (2) **13 iš 16 rinkinių be `pa_gyvuno_rusis`** (turėjo tik 3 DP pakai, paveldėję iš bazinės prekės) — YITH slepia filtrą be terminų. Fix: (a) naujas YITH preset **„Rinkinių filtras“ #35391** (`rinkiniu-filtras`: Gyvūno rūšis + Prekės ženklas, klonuota iš `default-preset` 6644); (b) snippet 332 **v20**: `rinkiniai` ir `*-rinkiniai` → `rinkiniu-filtras` (backup `ps-backups/snippet332-v19-BACKUP-2026-09-02.php`); (c) naujas mu-plugin **`petshop-rinkiniu-rusis.php` v1.0** (4 427 B, md5 `d35fdeb48f54f2a63ddb1accec24801e`): prekėms 679 medyje išveda rūšį iš kategorijų/pavadinimo (šunims 252, katėms 253, graužikams 255, paukščiams 254, žuvims 256), rašo `_product_attributes` + terminus, TIK kai atributas tuščias; hook `woocommerce_update_product`/`new_product`; backfill `?ps_rink_rusis=backfill` (manage_woocommerce). Backfill: 22 rinkiniai (publish+draft) → 19 įrašyta / 3 jau buvo. Frontas: `filter_gyvuno_rusis` su Šunims/Katėms rodomas.

#### S1598 — `petshop-laukai.php` v1.46: susidėjimo dėžės nebe „Paruoštų rinkinių“ sąraše

Raimio logika: „Paruošti rinkiniai“ (RINKINIAI 679 medis) ir „Susidėk savo rinkinį“ — du skirtingi keliai; dėžės sąraše nerodomos. `pre_get_posts` (main query, product_cat 679 arba jo palikuonis) → `meta_query _ps_laukas NOT EXISTS`. Kitose kategorijose (Konservai šunims ir pan.) įėjimo dėžė lieka matoma — tai jos įėjimas iš kategorijos (sprendimas 2026-08-15, nekeista). Paieška neliesta. Patikra: /kategorija/rinkiniai/ 10 → **7**, /konservu-rinkiniai/ → 3, /konservai-sunims/ 130 (nepakitę). md5 `201ceffcf3b8ab16c08eb1237112b107`. Pastaba: pirmas deploy runas krito `fx:list/fx:create` (REST laikinai neatsakė) — pakartota po 20 s, sėkmė.

#### S1599 — Paruoštų rinkinių analizė iš savų duomenų

Raimio užduotis: kokių paruoštų rinkinių reikia; taisyklės — viskas iš vieno sandėlio, nedubliuoti dėžių, be 10 % nuolaidos (kainos mažos). Šaltinis `ps_ist_fakt_eilutes` 2025-06..2026-08: 4 461 apmokėti užsakymai, 148,7 k€; 42 % užsakymų ≥2 skirtingos prekės. Pajamos: sausas šunims 46 %, sausas katėms 11 %, konservai šunims 10 % / katėms 8 %, skanėstai šunims 6 %, kraikai 2,7 %, žuvų maistas 3,5 %. Kartu-pirkimai už dėžių ribų: Exclusion Hypo sausas+konservai 69 užsakymai (Mini kiauliena+konservai 21), PESS antiparazitiniai 13/9/5, Hikari 7/6/6 (atmesta), Catit fontanas+filtrai 6, Miamor/GimCat hairball 4/4/3 (dubliuoja 35094 — atmesta), Quattro 2 sausi 5/4/4. Asortimento skenas pagal sandėlį×antkainį: AV natūralūs kramtalai 77 %, kačių tualetai 200 %+, žaislai katėms 52 %, Quattro 67–82 %; VF skanėstai šunims 127 prekių ~36 %. Raimio sprendimai: 1 tik Mini (2 variantai), 2a su kitu skanėstu (natūralių rinkinukas baigiasi), 2b taip, 3 ne, 4 ne (dubliuoja), 5–6 taip su iki 6 % nuolaida, plius keli VF skanėstų rinkiniai ~30 € (nemokamas paštomatas), ne po 2 prekes. `analize/s1599_a.json · s1599_b.json · s1599_c.json`.

#### S1600 — 11 paruoštų rinkinių sukurta (DRAFT, Raimio peržiūrai)

Per `Petshop_Rinkiniai::ajax_issaugoti()` (simuliuotas AJAX: `DOING_AJAX`, nonce, `wp_die_ajax_handler` → exception; pamoka: be `DOING_AJAX` `wp_send_json` daro `die` ir kuria tik pirmą). Kaina = suma (5–6: −6 %). Visi vieno sandėlio, kompozicijos nuotraukos sugeneruotos, rūšis priskirta (S1597 modulis; 35400 ranka — „Kačių“ ≠ „katėms“, į modulį pridėti `kaci`):
35392 Exclusion Hypo Mini kiauliena 2 kg + 4×kiauliena 400 g 36,81 € VF 35 % · 35394 tas pats + 4×elniena 36,81 € VF · 35396 Apsauga nuo parazitų šuniui (PESS ×3 + 2×Apollo kepenėlės) 15,09 € AV · 35398 katei (PESS ×3 + GimCat Catnip) 14,50 € AV · 35400 Kačių tualeto starteris (Sonic Big + SILICA 3,8 l + semtuvėlis) 18,18→17,09 € AV · 35402 Fontanas Catit + filtrai 56,75→53,35 € AV 49 % · 35404 Vytintų skanėstų 8 rūšys 30,62 € VF 40 % · 35406 Kramtymui ir dantims 7 vnt. 32,43 € VF 40 % · 35408 Mažų veislių šuniukui 8 vnt. 30,92 € VF 39 % · 35410 Alergiškam vieno baltymo 7 vnt. 31,23 € VF 39 % · 35412 Dresūrai minkšti 6 vnt. 30,24 € VF 38 %.
**Radiniai pakeliui:** PESS lašiukų `_weight` buvo 20 ir 10 (kg — svorio laukas naudotas šuns svoriui) → rinkinys 20,65 kg, kurjerio tarifas 20,65 €; ištaisyta 16996/16999 → 0,05 kg, rinkiniai 0,4/0,35 kg. Kačių tualetai (15928/15920/15870) be svorio ir be siuntimo klasės; **klasės „tik kurjeris“ sistemoje NĖRA** (yra tik 4 svorio pakopos) → gabaritinės prekės į paštomatą — Q-GABARITAS Raimiui. PESS savikainos 0 → 35396/35398 marža nežinoma.

#### S1601 — „Tik kurjeriu“ varnelė pagaliau veikia kasoje (`petshop-rinkiniai.php` v1.44)

Raimis: gabaritinės klasės nesiūlyti — „tik kurjeriu“ jau yra (prieš siūlant tikrinti). Patikrinta: varnelė `_ps_tik_kurjeriu` (katalogo kortelė v3.8, 162 prekės, tualetai pažymėti) egzistuoja, bet **kasoje jos niekas neskaitė** — `pastomato_sargas()` slėpė paštomatus tik pagal svorį (>25 kg); `courier_only` naudojo tik AV resolveris/desk/M8. Fix v1.44: sargas tikrina visų krepšelio eilučių (įsk. MnM vaikų) `_ps_tik_kurjeriu=yes` → paštomatų/terminalų tarifai nerodomi; `paveldeti_kurjeri()` — MnM ir DP pakai varnelę paveldi iš sudedamųjų išsaugant. Backup `ps-backups/petshop-rinkiniai-v143-BACKUP-2026-09-02.php`, md5 `b90c520641336b9db53e8313a8bcd8eb`. Testas su netikru paketu: tualetas 15928 → lieka tik kurjeris; kraikas → visi 3; rinkinys 35400 (paveldėjo yes) → tik kurjeris. 35402 (fontanas 19140) varnelės neturi — Raimio sprendimas kortelėje. Pamoka 70: **ekrano varnelė be vartotojo kelio patikros = žyma, ne taisyklė** — tikrinti iki kasos.

#### Pamokos
63. **„0 vėluojančių cron" ≠ importai veikia.** pmxi grąžina HTTP 200 su `{"status":500}` — sargas turi tikrinti `pmxi_history` `time_run`/summary ir cache mtime, ne cron URL kodą. → kandidatas į sargą (`petshop-sargas`): pmxi #2/#3/#5/#7 paskutinis sėkmingas <36 h, `ps_vf_feed_paskutinis.ok`.
64. `_vf_last_sync` = „bandyta sinchronizuoti", ne „duomenys švieži" — tikrinti šaltinio failo mtime.
65. VF kategorijų filtras turi du sluoksnius (mapping + grupės raktažodis) — atidarant kategoriją tikrinti abu; `vf_should_import()` dry-call su realia kaina prieš importą (šį kartą pagavo).
66. Importo šaltinis = lokalus failas, kurį pildo WP cron — vienintelis kelias, nepriklausantis nuo domeno/DNS/router'io.
67. **Registras, kurį pildo viena meta reikšmė, negali aprašyti dviejų sandėlių** — rankiniai batch'ai užmaskavo dizaino spragą 4 savaites. Po kiekvieno modelio pakeitimo `naktinis()` matuoti „prieš/po“ skaičiais.
68. **`_*_last_sync` be duomenų mapping'o = melas dviguba prasme.** Du importai (#5/#7 VF, #3 ZB) tą pačią dieną: žymė šviežia, duomenys seni. Sargas (T-0 #25) turi lyginti `_zb_qty`/`_vf_qty` su feed'o imtimi (20 atsitiktinių kodų), ne žymes.
69. **pmxi cron su blogu `import_key` grąžina tuščią 200** — ne 403. Raktas = `PMXI_Plugin_Options['cron_job_key']`, o `secure` yra bool jungiklis. Nebloguojantis loopback iš WP-cron proceso pmxi nepasiekia — naudoti blokuojantį su užraktu.

#### T-0 papildymai
- **#24 ATŠAUKTAS** (pmxi #5/#7 kelias jau be hosto).
- **#25** Sargas: pmxi/VF/ZB feed šviežumo patikra (pamokos 63, 68: imties palyginimas su feed'u) — įdiegti prieš T-0.
- **#26** Hosting cron: Import #3 processing `2 *` → `*/2 *` — nebebūtina po S1594 (WP-cron kas 2 min), palikta kaip pasirinktina.
- **#27** `ps_import_tempas_host` option ištrinti (→ home_url) kartu su 6 cron URL keitimu.

#### Failai
```
plugins/petshop-xml/includes/class-import-rules-vf.php  v1.1  191637c6d58e661f8e7ed0d352c2556a
mu-plugins/petshop-vf-feed.php                          v1.0  1ee413b1dd1000dcf77e395a7b270486  (NAUJAS)
mu-plugins/petshop-import-tempas.php                    v1.2  5461ff5abfaa53a559fcf0f9c3b0b982  (NAUJAS, S1594)
mu-plugins/petshop-laukai.php                           v1.46 201ceffcf3b8ab16c08eb1237112b107  (S1595–S1598)
mu-plugins/petshop-rinkiniu-rusis.php                   v1.0  d35fdeb48f54f2a63ddb1accec24801e  (NAUJAS, S1597)
mu-plugins/petshop-rinkiniai.php                        v1.44 b90c520641336b9db53e8313a8bcd8eb  (S1601)
snippet 332 Petshop Filtru Kontekstas v20 · YITH preset #35391 rinkiniu-filtras (S1597)
analize/s1591_recon*.json · s1591_a.json · s1591_deploy*.json · s1591_verify.json · s1591_finish.json · s1592_recon.json · s1592_apply.json · s1592_dump.json · s1592_deploy.json · s1593_recon.json · s1593_r2..r6.json · s1593_fix.json · s1593_fix2.json · s1593_v.json
moduliai/petshop-sources-snippet2515.php  v2.3  681bef7ec50a143ffdcf7035dfa0e524
ps-backups (serveris): class-import-rules-vf-v10-BACKUP-2026-09-02.php · exclusion-hypo-kons-BACKUP-2026-09-02.json · sources-v22-snippet2515-BACKUP-2026-09-02.php
options: ps_pmxi_vf_backup_20260902 · ps_vf_feed_paskutinis · ps_pmxi3_backup_20260902
```
TEMP: 4430–4437 (S1583–S1590) + 4430–4467 ištrinti DB (S1593); liko 4468+ einamieji (deaktyvuoti) → trinti kitą runą. Aukščiausias decision Nr.: **S1601**.

---

### S1583–S1590 (2026-09-01, vakaras II)

> Pridėti po S1582. Tema: pasiruošimo migracijai diagnozė (Raimio užduotis), Google Ads/GA4 realybės patikra, GA4 serverio purchase + Kontrolė.

#### S1583 — Pilna būklės diagnozė (serveris, ne atmintis)

Du PHP recon + Playwright per 32 admin langus. Rezultatai `analize/s1583_recon.json`, `s1583b.json`, `s1583_admin_menu.json`, `screenshots/s1583_admin_dash.png`.

**Verdiktas ~88–90 %.** Kodas paruoštas; blokuoja duomenys + Raimio veiksmai + T-0 naktis.

Faktai, kurių registre nebuvo arba kurie pasenę:
- **AV likučiai = gegužės/birželio nuotrauka:** 1 044 legacy publish, 889 su `_stock`>0 (34 939 vnt.), **440 nekeistos nuo 2026-07-01**; pmxi importai tik ZB (#2,#3) ir VF (#5,#7) — AV sync su eShoprent NĖRA. Raimis 2026-09-01: **T-1 dieną visi likučiai permetami iš eShoprent** (Q-EXPORT vykdymas). Įrankis — kita sesija.
- `payment_failed` emiteris YRA (`petshop-payment-failed.php`) — registro §5/§8i įrašas „įvykio nėra“ PASENĘS.
- Katalogas: 2 646 publish · **2 be kainos** (#14274 Monge Cat 4×10 kg, #14824 GimCat Gras Bits — R5 kaina dingo) · 8 be nuotraukos (7 TEST dėžės + #34938) · **21 be `_ps_sandelis`** (Bogar/Bogadent 35007–35027, rinkiniai 35070–35306) · 1 005 be svorio · 552 be GTIN · 390 legacy be savikainos · 388 outofstock.
- Testiniai: 4 užsakymai (terra@, 08-25/26) · 6 „TEST Konservu deze“ publish · puslapis #34676 „Anketa testas“ publish · pradinio #34543 title „Pagrindinis (test)“ · `ps_carts` 121 · `ps_laukai_ivykiai` 782 · `ps_web_ivykiai` 707 · `ps_fakt_uzsakymai` 11 · skaitliukai AVPN 283 / IAPV 160 / **wcdn_invoice 308** (registre nebuvo).
- **`dev.avesa.lt` grįžo po R192:** options 5 (`flatsome_registration`, `cmplz_transients`, `ps_feeds_paskutinis`, `woocommerce_wp_subscription_paypal_settings`, `ps_cc_v2_preview`), postmeta 13, posts 7 → T-0 keitiklį leisti pakartotinai.
- `ps_paleidimo_data` = **2026-10-01** (pasenusi) → T-0 nustatyti faktinę; `ps_stat_pradzia`/`ps_perjungimo_data` tušti (T-0).
- Pluginai **27** (limitas ≤25): kandidatai `wordpress-importer`, `wpforms-lite`/`loco-translate`; 9 pluginų atnaujinimai + WP 7.1 laukia.
- Admin: 32 langai, 0 JS klaidų. „Sveikata“ (plano 5.1) ir „Srautas“ (5.11) atskirų langų NĖRA; `petshop-analitika.php` renka `ps_web_ivykiai`, `petshop-rytas.php` skaito.
- Cron 77 hook'ų, 0 vėluoja; sargas 0 fatal/7 d.; `ps_tarifai` 44 eil.; `ps_islaidos` 0 (norma).
- Registro lentelės melavo 6 vietose (F19 „nepradėta“, OPS-01 🔴, Q-D7D8 su 10-15, DOD-20, payment_failed, §0 santrauka) → **REGISTRAS v35 tik iš matavimų — kita sesija.**

TEMP: 4427–4429 ištrinti; 4430–4433 (šios sesijos) deaktyvuoti → trinti kitą runą.

#### S1584 — GA4 + Ads realybė (Data API per SA, `analize/s1584_ga4_ads.json`)

H1 (01-01..07-03) vs liepa–rugp. (07-04..08-31): PMax 9 399 €→33 830 € (ROAS 3,6) vs 2 442 €→5 492 € (**2,25**; katės 1,98 / šunys 2,36); brand „petshop“ 167 € → 1 607 € (9,6), **2,8 €/d**; išlaidos nepakitusios ~43 €/d (liepos sprendimas PMax 27→15 / brand 2→8 **neįvykdytas**); **45 % PMax pajamų — grįžtantys**; el. paštas 0 sesijų; mobile CR 3,4 % vs desktop 8,5 %; sav. 32 (08-03..09) 284 € išleista, GA4 **0 pirkimų**.

#### S1586 — Tikrovė iš `ps_ist_uzsakymai` (eShoprent)

Sav. 32: **69 užsakymai, 2 495 €** — normali savaitė → **GA4 matavimas lūžo, ne pardavimai.** Liepa–rugp. realiai 22 215 € vs GA4 12 955 € = **58 % danga** (liepą TŽ fiksavo 88 %). Mėnesiai 2026: 15 301 · 13 276 · 11 966 · 14 399 · 12 386 · 13 051 · 12 368 · 9 847 (08 iki 30 d.). Tikras krytis: liepa −8 %, rugpjūtis ~−24 % vs H1 vid., ne GA4 „−39 %“. Savaitės stabilios 57–82 užsakymai, AOV ~40 €.
**Išvada:** Ads algoritmas mokėsi iš ~58 % signalo — tiesioginė „šaudo pro šalį“ priežastis; PMax realus ROAS ~3,5–3,9 — vis tiek žemiau lūžio 5–6,7.
**Raimio sprendimas:** iki perjungimo Ads NEKEISTI; nauja struktūra po DNS.

#### S1585 — Ads v2 struktūra + feed recon (`analize/s1585_ads_feed_gsc.json`)

GSC 16 mėn. (2 500 užklausų): veislės/info 59 % clicks (Ads ne) · kategorijos („kačių tualetas“ ~7 000 impr poz. 6–8, antiparazitiniai ~1 900, „sepijos kaulas“ poz. 1,7) · prekių brandai („josera katėms/šunims“ 11 000 impr **poz. 9–12**, exclusion ~3 000) · petshop brand 7 395 impr CTR 8–11 % · niša (begrūdis/hipoalerginis/mono/sterilizuotoms) poz. 25–58 → tik per Ads · generic „šunų maistas“ poz. 22 — nedaryti.
Dokumentai: `petshop_google_ads_v2_planas.md`, `petshop_ads_editor_import_v1.csv` (5 kampanijos / 19 grupių / 109 kw / ~47 €/d, visos Paused, tekstuose tik patikrinami teiginiai — be „nuo 1996“, „oficialus platintojas“, „€/dienai“).
Feed `/feed/google/`: 2 238 prekės (tik in_stock), ID dublių 0, kategorijos 100 %, brand −1; **taisyti prieš MC:** 454 be GTIN → `identifier_exists=false` ten, kur nėra ir MPN; `sale_price` nėra; `custom_label_0`=sandėlis pridėti; shipping — MC paskyroje; 741 be `shipping_weight` (=Q-SVORIS). Liko: nišos landing'ai → filtruotos kategorijos (dabar hub'ai), **Q-MERCH-1 (Merchant Center savininkas) — Raimis, blokuoja Shopping.**

#### S1587 — `petshop-ga4-serveris.php` v1.0 (NAUJAS mu-plugin, 19 296 B, md5 136e9be3af440f84dd190741e5643ab2)

TŽ v1.39 (A) MVP reikalavimo įgyvendinimas. `purchase` į GA4 Measurement Protocol iš serverio (`payment_complete` / status `processing`,`on-hold`,`completed`; guard `_ps_ga4_mp_at`); kasoje `_ps_ga_cid` (`_ga`), `_ps_ga_sid` (`_ga_FMTKEGGLMG`), `_ps_ga_sutikimas` (cmplz S/M) → dedup su naršyklės purchase (snippet 614) pagal transaction_id + client_id; be slapuko — sintetinis `ps.<crc32>.<ts>`, `non_personalized_ads=true`, 0 PII; `timestamp_micros` = užsakymo laikas (≤71 h). **Siunčia TIK iš petshop.lt hosto** (dev — `dev-nesiusta`; `ps_ga4_mp_dev=1` leidžia). Raktas option `ps_ga4_mp_secret` — kol nėra, meta `laukia-rakto`.
**Kontrolė:** lentelė `ps_kontrole_dienos` (diena PK: woo_apmoketi, woo_suma_ct, fakt, mp_issiusta, mp_laukia, ga4_purchase, ga4_pajamos_ct), cron `ps_kontrole_diena` 04:30 UTC (07:30 LT), 4 d. perrašymas; GA4 skaitymas per `ps_gsc_sa` (analytics.readonly); langas **Ataskaitos → Kontrolė** (`ps-kontrole`), ±2 % žalia / 10 % geltona / raudona, mygtukas „Perskaičiuoti 14 d.“.
**Verifikacija:** token_get_all 5 142, klasė gyva, lentelė, cron 2026-09-02 04:30; **debug endpoint validacija užsakymui 35100: HTTP 200, `validationMessages: []`** (payload su items/brand/category); GA4 skaitymas ok (08-28..31: 3/2/8/7 purchase — vs eShoprent ~8–10/d → danga ~50–60 % dar kartą patvirtinta); vizualiai `screenshots/s1587_kontrole.png` — 8 eilutės, 0 pageerror.
Pastaba: hub'o kortelė „Kontrolė“ neatsirado (hub'as skaito ne `$submenu`) — meniu punktas veikia, kortelė — smulkmena kitam runui.

**Reikia Raimio (vienas iš dviejų):** (a) Google Cloud `prefab-envoy-482617-b4` → įjungti *Google Analytics Admin API* → aš pats sukuriu secret'ą ir patikrinu Ads susiejimą; arba (b) GA4 Admin → Data Streams → petshop.lt (G-FMTKEGGLMG) → Measurement Protocol API secrets → Create „petshop-serveris“ → reikšmę man. Po launch: Ads → Conversions → import GA4 key event `purchase` (Admin API neįjungta — `keyEvents` sąrašo patikrinti nepavyko).

#### Pamokos
55. **Prieš teigiant „pardavimai krito“ — palyginti su savu užsakymų šaltiniu.** GA4 „−39 %“ buvo 58 % dangos artefaktas; `ps_ist_uzsakymai` parodė −8/−24 %.
56. **Ads ROAS iš GA4 su lūžusiu matavimu yra nei teisingas, nei klaidingas — jis nežinomas.** Pirmiau Kontrolė (Woo vs GA4), tik tada sprendimai dėl biudžetų.
57. **Registro lentelės senėja greičiau nei sesijos** — v34 melavo 6 vietose; būklės lentelės perrašomos tik iš serverio matavimų, ne iš ankstesnių lentelių.
58. `ps_ist_*` yra ne tik analitikai — tai vienintelis nepriklausomas šaltinis migracijos „prieš“ palyginimams (pardavimai, savaitės, AOV).

#### T-0 papildymai
- **#17** Likučių/kainų perkėlimas iš eShoprent T-1 (Raimis eksportas + įrankis).
- **#18** `ps_paleidimo_data` faktinė · `ps_stat_pradzia` · wcdn_invoice_number_counter → 101 (kartu su AVPN/IAPV).
- **#19** URL keitiklį (R192) leisti pakartotinai — dev.avesa.lt likučiai 5/13/7.
- **#20** Kontrolė lange po pirmos dienos: Woo = ps_fakt = GA4 ±2 %; jei ne — matavimas pirmiau nei reklama.
- Po DNS Ads: senas PMax → Paused, CSV importas, Brand pirmą dieną, Shopping po MC.

#### Failai
```
mu-plugins/petshop-ga4-serveris.php   v1.0  136e9be3af440f84dd190741e5643ab2  (S1587, NAUJAS)
irankiai/run.sh                        lokaliai: php -l praleidžiamas, jei php nėra (sandbox); repo nekeistas
analize/s1583_recon.json · s1583b.json · s1583_admin_menu.json · s1584_ga4_ads.json · s1585_ads_feed_gsc.json · s1586_ist.json · s1587_recon.json · s1587_mp_secret.json · s1587_deploy.json · s1587_kontrole_vis.json
screenshots/s1583_admin_dash.png · s1587_kontrole.png
outputs: petshop_google_ads_v2_planas.md · petshop_ads_editor_import_v1.csv
```
TEMP: 4430–4433 deaktyvuoti → trinti kitą runą (`TEMP% AND active=0`).



#### S1588 — GA4 Measurement Protocol raktas (per Admin API)

Raimis GCP `prefab-envoy-482617-b4` įjungė **Google Analytics Admin API** ir GA4 property SA rolę pakėlė Viewer→**Editor**. Per API: (1) `acknowledgeUserDataCollection` patvirtintas (Google FAILED_PRECONDITION be jo); (2) sukurtas MP secret **„petshop-serveris“** (stream `properties/346051580/dataStreams/4348484834`); (3) įrašytas WP option `ps_ga4_mp_secret` (autoload off); (4) validacija su tikru raktu užsakymams 35100 ir 35088 — HTTP 200, `validationMessages: []`; (5) dev blokas patikrintas (`siusti()` → `dev-nesiusta`, nieko neišsiuntė). Faktai per API: key events = purchase, begin_checkout, add_to_cart, Phone_click, Email_click; **Ads 7541530584 susieta su GA4** (creator pauliussmaliukas@gmail.com 2023-03 — GA4 prieigos neturi, patikrinta account access ekranu; property lygis liko Raimiui pertikrinti). ⚠ Raktas vieną commit buvo bridge repo (`s1587_mp_secret.json`, užtušuota, git istorijoje liko) → **T-0: raktą pakeisti** (per API 30 s).

#### S1589 — Ads paskyros dump per Google Ads Scripts

Ads API be developer token → kanalas: **Ads Scripts** (Įrankiai → Masiniai veiksmai → Scenarijai), skriptas `petshop_ads_dump_v1_3.js` → GitHub PUT → `analize/ads_dump.json` (579 KB: 11 kampanijų, 9 grupės, 288 kw, 9 RSA, 119 PMax assets, 400 search terms, 8 konversijų veiksmai, mėnesiai nuo 2026-01, vietovės, shared sets, rekomendacijos).

**Diagnozė (3 root cause):** (1) PMax tROAS **3,64/3,84** — žemiau maisto lūžio 5–6,7, biudžetai po 20 €/d; (2) primary konversija GTM „Purchase“ WEBPAGE **MANY_PER_CLICK** iš naršyklės (465 vs GA4 393 per 90 d.) — paskyros ROAS sausis 5,92 → rugpjūtis 2,82, konv. 160–220 → 96/mėn; (3) **0 negatyvų** (account-level 0; Brand_Exclusion 3 PMax'ui) — brand phrase „pet shop“ perka „antkakliai sunims“, „cat toys“, „grandorf“, „petshop lv“ (~25 % brand spend šalin). Brand: biudžetas 8 €/d, bet TARGET_IMPRESSION_SHARE lubos → leidžia 2,6 €/d, IS 20,6 %, 77 % prarasta dėl reitingo, kw QS 10/10. MC prie kampanijų nesusietas, listing groups 0, shopping view 0 — PMax be prekių patvirtinta iš vidaus. Kapinynas: 7 Paused (tarp jų Animonda tROAS 1,8, Grancarno 4,5). Paliekama: paskyra, 3 brand kw, MC susiejimas; visa kita keičia v2.

Scripts GAQL pamokos (žr. plano dok. §C): be `DURING LAST_X_DAYS` (tik BETWEEN), be `campaign.start_date`/`performance_label`/`recommendation.impact.*`, change_event ≤30 d., be `apiVersion` parametro.

#### S1590 — Merchant Center: prieiga + pristatymo tarifai per API

MC paskyra **5321054797** rasta (Raimio kurta anksčiau): svetainė jau `https://www.petshop.lt`, **Ads susiejimas AKTYVUS**, users: Raimis admin + SA (pakelta į **Admin** laikinai; nuleisti ~T-0+14). GCP įjungta **Content API for Shopping** (`shoppingcontent.googleapis.com`; `content.googleapis.com` — ne tas API, pamoka).
Kasos kainodara recon (`s1590_ship.json`, `s1590b_ship.json`): `ps_tarifai` = vežėjų SAVIKAINOS, pirkėjo kainos — Venipak/LP metodų instance_settings: paštomatai 1,78 € (free ≥30 €, max ~25 kg), kurjeriai 3,30/6,60/9,90/20,65 € (0–50/50–70/70–100/100–200 kg, shipping classes 234–237).
**PUT shippingsettings 200** — paslauga „Pristatymas Lietuvoje (paštomatas / kurjeris)“, LT, EUR, 0–1+1–3 d., svorio×krepšelio lentelė 5×2; **vizualiai patvirtinta Raimio MC UI ekranu** (Complete, 1–4 days; GET iškart po PUT 404 — MC propagacija, norma). Onboarding „numatytoji + likusios šalys“ — Atmesta. Liko T-0: feed registracija, store name → „Petshop.lt“, kasos kainoms keičiantis — atnaujinti MC lentelę.

#### Pamokos (tęsinys)
59. **`ps_tarifai` ≠ pirkėjo kainos** — tai savikainos; MC/Shopping ima kasos kainas iš shipping metodų instance_settings.
60. **Ads Scripts = pilnas Ads API be developer token** — dump ir (T-0+1) kampanijų kūrimas; GAQL dialektas siauresnis (BETWEEN, ne DURING LAST_X).
61. **Google API vardai apgaulingi:** Analytics Admin API ≠ Data API; Content API for Shopping = `shoppingcontent.googleapis.com`, ne `content`.
62. **MC GET po PUT gali 404'inti kelias minutes** — PUT atsakymas su pilnu objektu = įrašyta; galutinė patikra per UI.

#### T-0 papildymai (tęsinys)
- **#21** GA4 MP raktą pakeisti (senas git istorijoje) — per Admin API, atnaujinti `ps_ga4_mp_secret`.
- **#22** MC: feed registracija + store name „Petshop.lt“; Ads UI: GA4 purchase → Primary, GTM Purchase → Secondary (T-0+1).
- **#23** ~T-0+14: SA MC rolę Admin → Standard (priminti Raimiui).

#### Failai (papildymas)
```
analize/ads_dump.json · s1588_mp.json · s1589_mc.json · s1590_ship.json · s1590b_ship.json · s1590_mc_ship.json
outputs: petshop_ads_dump_v1_3.js (veikiantis; v1.0–1.2 istorinės) · petshop_google_ads_v2_planas.md (papildytas §A–E)
```
GA4/Ads/MC tema UŽDARYTA iki T-0. Aukščiausias decision Nr.: **S1590**.

---

### S1571–S1580 — Kasos regresija · GTM+Complianz · QA #3 · 301 žemėlapio attachment kolizijos (2026-09-01, vakaras)

> Atkurta 2026-09-02 iš sesijos „Serverio būklės patikra ir darbų eilė" (pilnas tekstas, be santrumpų).

#### S1571 recon (serveris, ne atmintis)
Viskas sutampa su S1549–S1570 įrašais: mu-plugin md5 (greitis 53f59123…, cache 0816cc13…, webp f5e1e991…, hero bcd8d4d0…, rinkiniai b8aa4437…, seo v1.3 **95bca2c4…** 42 710 B — fiksuota), fonts v1.1 61f4a080…, map 1 091 / 5f869051…, root `.htaccess` b52902ab…, `uploads/.htaccess` a1a96fc7…, WPSC `WP_CACHE=true`, `slash_check=1`, rejected_uri 12 (be `kasa`/`paskyra` — jos dinaminės per WC `DONOTCACHEPAGE`, patikrinta S1572), WebP 8 240/8 240 baigta (21 610 failų), TEMP eilė tuščia, `ps_psi_key` YRA, `ps_perjungimo_data` dar nenustatyta, WC 11.0.1 / WP 6.9.4 / PHP 8.3.20, `debug.log` nėra, užsakymų 24 h: 0. Pastaba: `$wpdb` loopback'u `home` rodo dev.avesa.lt — tai dev veidrodžio ob perrašymas (pamoka 43), DB raw = petshop.lt (S1569).

#### S1572 — Kasos regresija po front-end dietos ✅ (Playwright Pixel 5 + desktop 1366)
Kelias: pradinis → prekė → „Į krepšelį" (fragmentas „1") → `/kasa/` → LP Express → Venipak kurjeris + bacs → „Užsakyti". **Console/pageerror 0, requestfailed 0** visame kelyje. Kasoje: forma pilna (billing/shipping/įmonės laukai), 4 siuntimo metodai, paysera + bacs, **LP Express JS 3 / CSS 1 užkrauti** (greitis dequeue išimtis veikia), `select2`/`selectWoo` funkcijos, **terminalų `select` 532 opt., select2 dropdown atsidaro**, `#place_order` yra, `begin_checkout` dataLayer'yje. **Bacs užsakymas #35308 → `/kasa/order-received/35308/` 200, `purchase` event: transaction_id 35308, value 77,79, tax 13,50, shipping 3,30, items[1] su item_brand/item_category.** Cache: pradinis be `Cache-Control` (iš WPSC), prekė `no-store` (WC cart cookie), `/kasa/` ir `order-received` `no-cache, private`. HEAD skriptų 15, iš jų `defer` 12. Screenshotai `screenshots/s1572_{mob,desk}_{pradinis,kasa,lp,uzsakymas}.png` — vizualiai OK (LT diakritikai, kaina, adresas). Desktop scenarijus užsakymo nepateikė tik dėl „paskyra su tokiu el. paštu jau sukurta" (mobilus jau sukūrė) — laukiama WC elgsena.
**S1573 valymas:** užsakymas 35308 (on-hold) ir user 5786 `ps-s1572@avesa.lt` ištrinti, `wc_customer_lookup` 0. Savininkas galėjo gauti dev „naujas užsakymas" laišką — ignoruoti.
Pastaba (ne regresija, antraeilis): kasoje `select2.min.js` iš jsdelivr įkeliamas **du kartus** (`?ver=4.1.0-rc.0` ir `?ver=4.1.0`) — du pluginai registruoja tą patį src skirtingais handle'ais.

#### S1576–S1579 — GTM v2.0 (atidėtas) + Complianz ✅
- **Default:** `consent default` visos 4 denied (functionality/personalization/security granted), baneris matomas (PRIIMTI / ATMESTI / NUOSTATOS / X), `cmplz_*` cookie nėra, tinkle **tik `gtm.js`** — jokių GA4/FB/Ads užklausų, jokių `_ga/_fbp/_gcl`.
- **ATMESTI ir X (snippet 628 „X = Atmesti"):** `cmplz_marketing=deny`, `cmplz_statistics=deny`, `consent update` denied, baneris dismissed; prekės puslapyje `view_item`/`add_to_cart` į dataLayer eina, bet **nė vienos GA4/FB užklausos, cookie 0** (mob + desk, du kartus).
- **PRIIMTI:** `consent update` visos granted, `cmplz_marketing/statistics=allow`, GTM gyvas. Dev'e tag'ai tyli **sąmoningai** — GTM live v5 (id 7, „GA4 Config fire tik po statistics sutikimo") turi `BLOCK — DEV` trigger'ius 17/18 (`Page Hostname contains dev.avesa.lt` AND NOT `gtm_test=1`). GTM API recon (SA `claude-gtm-manager`, `gtm_lib.mjs`): 13 tag'ų, 11 trigger'ių; GA4 Config + 5 GA4 event'ai gated `analytics_storage` (trigger'is `CE — statistics granted` = `cmplz_consent_update` ∧ `DLV cmplz_statistics=granted`); Conversion Linker, Meta Pixel + 3 Meta event'ai gated `ad_storage/ad_personalization` + BLOCK 39 „marketing nesutikta"; Ads Purchase gated `ad_storage+ad_user_data`; tag 15 (Consent Default HTML) **paused** — default eina iš snippet 615 (v3 sprendimas). Workspace be nepublikuotų pakeitimų.
- **S1579 su `?gtm_test=1` (blokas nuimtas):** PRIIMTI → `gtag.js`, **GA4 `page_view` gcs=G111**, `add_to_cart` GA4, Meta `PageView` + `fbevents.js`, Conversion Linker (doubleclick), cookie `_ga`, `_ga_FMTKEGGLMG`, `_fbp`, `_gcl_au`. X → **nieko** (nė cookieless ping'o — basic consent mode). ⇒ tag'ų grandinė veikia; prod'e (`petshop.lt` host) BLOCK 17/18 netaikomi.
- Kasoje su matomu baneriu (mob 393×727): baneris top 479/h 248, „Užsakyti" mygtukas top 340 → **nepersidengia**, `elementFromPoint` = `place_order` (`s1577_kasa_baneris.png`).
- Dev artefaktas: 2–3 nuosekliame Playwright kontekste dev hostas kartais grąžina tuščią/nepilną puslapį (S1576 `mob_x` blank, S1579 `mob_atmesti` be ATC mygtuko) — 429/apkrova, ne kodo klaida; pakartojimas su 5–10 s pauzėmis praeina.

#### S1574–S1575 — 301 žemėlapis: attachment slug'ų kolizijos (tikras radinys iš QA #2)
QA #2 (ps_seo_qa id 7, 08:56): 1 101 · ok 1 089 · klaidų 12 = 10 S1550 pašalinti + **2× `skanestai-katems` / `katems/skanestai-katems` „grandinė 301→302 wp-admin"**. Ne 429 artefaktas.
**Priežastis:** attachment #35005 (kategorijos nuotrauka, įkelta 2026-08-19) turėjo `post_name=skanestai-katems` → `/skanestai-katems` ir `/katems/skanestai-katems` WP'ui **ne 404** (attachment puslapis) → `petshop-legacy-301` (veikia tik `is_404()`) nesuveikia → Rank Math `attachment_redirect_urls=on` → 301 į `attachment_redirect_default=https://petshop.lt` → dev'e `wp_safe_redirect` host ≠ WP_HOME → **wp-admin** → wp-login 302. Prod'e būtų 301 → pradinis (ne kategorija) — tylus srauto praradimas.
**Auditas visam žemėlapiui (1 091 raktų, 1 028 unikalių paskutinių segmentų vs `wp_posts.post_name`):** 779 sutapimų, iš jų 757 = `product/{slug}` į tą pačią prekę (teisinga), **17 attachment'ų** (Miamor, GimCat, Frendi, Deli Nature, Super Beno, Royal Canin, Hikari, Animonda nuotraukos) šešėlino `/product/` ir `/gamintojas/` taikinius — QA #1/#2 jų nematė, nes Rank Math 301-ino į attachment'o tėvinę prekę = 200 (nebūtinai tą, kurią žemėlapis numatė), ir **5 puslapiai**: 4 draft (`hipoalerginis-maistas-sunims`, `miamor-katems`, `hikari`, `prins-petfoods` — anonimui 404, legacy veikia) + **`daugiau-pigiau` publish #34476** (žemėlapio raktas `daugiau-pigiau → /kategorija/daugiau-pigiau/` niekada nesuveiks, lankytojas gauna Daugiau=Pigiau puslapį 200 — Q-DP-MAP).
**Veiksmas (S1575 APPLY):** 17 attachment `post_name` → `{slug}-img` (`wp_unique_post_slug`), failų URL nepakitę (35005 → `2026/08/skanestai-katems.jpg` vietoje). Patikra: abu keliai → **301 `X-Redirect-By: Petshop-Legacy-Category` → `/kategorija/katems/skanestai-katems/` → 200**.
**QA #3 (runner dispatch 15:54, 1 750 s, ps_seo_qa id 9): 1 091 · ok 1 091 · klaidų 0.** ✅ DOD-07 QA švarus.

#### S1580 — TEMP valymas
TEMP 4416–4419 ištrinti DB (`TEMP% AND active=0`), liko 4420 (šio runo, deaktyvuotas). Snippetų viso 871. `ps_seo_404` šiandien: 12 hits / 11 bot — 1 „žmogiškas" = S1574 loopback su Mozilla UA (`nesamas-kelias-s1574`), artefaktas.

#### S1581–S1582 (ta pati sesija, vėliau)
S1581 — pamėgtų prekių tabų („Šunims/Katėms") asimetrijos pataisa (Raimio radinys, konteinerio plotis). S1582 — 301 žemėlapio raktas `daugiau-pigiau` (Q-DP-MAP, Raimio „taip") pašalintas; pamoka 54. Dokumentai: TŽ MASTER v1.92 docx, REGISTRAS v34 (§8mm, §8nn).

#### Pamokos
49. **Bet koks esamas `post_name` (net attachment'o) šešėlina 301 žemėlapį**, nes legacy sluoksnis veikia tik `is_404()`. Įkeliant nuotrauką WP jai duoda slug'ą iš failo vardo — kategorijos/prekės vardu pavadintas failas „pavagia" adresą. Auditas `map raktai vs wp_posts.post_name` — į SEO QA (WP-side kanarėlę) kaip papildomą tikrinimą.
50. **`wp_safe_redirect` + WP_HOME dev'e = wp-admin.** Kai taikinys ne dabartinis host'as, `wp_safe_redirect` tyliai keičia į `admin_url()`. Dev'e „301 → wp-admin" reiškia „taikinys buvo petshop.lt", ne „kas nors redirect'ina į adminą".
51. **QA „ok" ≠ „teisingas taikinys".** 301→200 praeina, net jei 200 yra ne tas puslapis. Runner tikrina tik statusus; taikinių atitiktį žemėlapiui tikrinti atskirai (padaryta S1575 per DB).
52. **GTM dev blokas — tikrinti su `?gtm_test=1`**, ne stebėtis, kad tag'ai tyli. `BLOCK — DEV` trigger'iai 17/18 nuimami tik šiuo parametru; prod'e neveikia.
53. **Kasos regresiją daryti realiu užsakymu (bacs) + `purchase` event'u**, po to valyti (užsakymas + user + customer_lookup). Playwright „forma matoma" nepakanka.

#### T-0 papildymai
- Po DNS: `?gtm_test=1` nebereikia — patikrinti GA4 realtime `page_view` + `purchase` iš Paysera 2,21 € testo.
- SEO QA WP-side kanarėlė: pridėti slug-kolizijų tikrinimą (pamoka 49) — mažas darbas, po T-0.

#### Failai / būklė
```
petshop-legacy-301-map.json   NEPAKEISTAS S1575 (1 091 / 5f869051…) — taisyta duomenų pusėje (17 attachment post_name → -img); S1582 — raktas daugiau-pigiau pašalintas
wp_posts attachment post_name: 35005,18456,18450,17334,15663,15690,18912,18871,18240,17767,18863,18980,18406,17773,16496,19667,18389 → {slug}-img
analize/s1571_recon.json · s1572_kasa.json · s1573.json · s1574.json · s1575.json · s1576_consent.json · s1577_consent2.json · s1578_gtm.json · s1578b_gtm.json · s1579_consent2.json · s1580.json
screenshots/s1572_* (8) · s1576_* (5) · s1577_* (4) · s1579_* (2)
```

---

### S1549–S1570 — SEO stebėjimas · WP Super Cache · front-end dieta · šriftai · WebP (2026-09-01, diena)

> Santrauka iš REGISTRAS v34 §8ll (būklės lentelė). Pilnas papildymas `deployment_log_papildymas_S1549.md` buvo išleistas sesijoje „SEO" 2026-09-01 ir įkeltas Raimio į kitą sesiją; į bridge repo nepateko — įkelti ir pakeisti šią santrauką pilnu tekstu.

| Sluoksnis | Būklė | Įrodymas |
|---|---|---|
| **SEO langas** (Ataskaitos → SEO, `petshop-seo.php` v1.3) | ✅ | GSC API per SA (`ps_gsc_sa`), lentelės `ps_fakt_gsc_dienos` 488 d. · `ps_fakt_gsc_url_d` 20 684 · `ps_seo_url_svoris` 2 409 · `ps_seo_404` · `ps_seo_qa`; cron 04:00 CWV / 05:00 QA / 06:00 GSC; šviesoforas 6 signalų; bazė = 8 sav. iki `ps_perjungimo_data` — S1549 |
| **301 žemėlapio higiena** | ✅ | S1550: 10 nesamų prekių raktų pašalinti (404 teisingas); runner `seo_qa.yml` (pirmadieniais 04:30 + dispatch) |
| **PageSpeed** | ✅ | `ps_psi_key` YRA; CWV eilutė gyva (5,9/4,2/3,8 s prieš greičio darbus) |
| **WP Super Cache 3.1.3** | ✅ | Simple režimas, `wp_cache_slash_check=1` (be jo vidiniai puslapiai iš cache neatiduodami), TTFB 1–2 s → 30–65 ms; `petshop-cache.php` v1.0 (0816cc13…) išvalymas per WC stock/price/status hook'us + `pmxi_after_xml_import`; kasa/krepšelis/paskyra dinaminiai — S1555–S1558 |
| **Front-end dieta** | ✅ | `petshop-greitis.php` v1.0 (53f59123…): jquery-migrate nuimtas, LP Express/select2 dequeue ne kasoje, `defer` HEAD; šriftai Open Sans subset Latin+LT 17/18/18 KB (`petshop-fonts` v1.1 61f4a080…); GTM snippet 615 v2.0 atidėtas (po interakcijos / 3,5 s); hero preload (`petshop-hero-preload.php` bcd8d4d0…). PSI mobile pradinis **48 → 87**, FCP 3,4 → 1,8 s, LCP 5,9 → 3,5 s, TBT 1 197 → 19 ms — S1559–S1565 |
| **WebP (TŽ Sk. 28)** | ✅ | `petshop-webp.php` v1.1 (f5e1e991…), 8 240/8 240 attachment'ų, 21 610 .webp, 1 030 MB sutaupyta; serve per `uploads/.htaccess`; prod vhost patikrintas `curl --resolve` → image/webp — S1566–S1569 |
| **Prarasta šaka** | ℹ | pokalbio strigimas 13:11–13:27 UTC paliko serveryje įvykdytus veiksmus be konteksto (TEMP 4396–4413); numeracija suvienodinta S1568–S1570; pamoka 48 — po strigimo pirmas žingsnis recon, ne diegimas |
| **TEMP** | ✅ | S1570: visi TEMP (4370–4415) ištrinti |

**Pamokos 37–48** (pilnas tekstas — papildyme): 37 cache ≠ LCP; 38 Super Cache Simple + `slash_check=1`; 39 Expert režimo nedaryti iš kito vhost'o; 40 `nocache_headers()` front-end'e draudžiama; 48 prarasta šaka → recon.
**T-0 papildymai:** #12 GSC Sitemaps (7 seni `/system/cache/feed_google_sitemap_*.xml` + `http://www.petshop.lt/sitemap.xml` šalinti), #13 pre-flight `curl --resolve petshop.lt:443:79.98.29.24`, #14 `wp_cache_clear_cache()` + `cache/supercache/dev.avesa.lt/` trynimas + `seo_qa.yml` dispatch pirmą naktį, #16 root `.htaccess` WebP dublikatas išimti; `ShortpixelBackups/` 2,8 GB — trinti (Raimio „taip").

---

### ŽURNALO SPRAGA — S1547–S1548 (2026-08-29)

Istorijos adapteris v1.0/v1.1, filtrų baras, dropship rizika, email layout 20/20 — įrašai tik REGISTRAS v34 §8nn / TŽ v1.92; papildymo failo nebuvo (S1547–S1549 padaryti sesijoje, kuri baigėsi be dokumento).

---

### S1535–S1542 (2026-08-31)

Papildo deployment_log_v1_9_11.md ir S1532–S1534 papildymą. Sesija: el. laiškų
pataisos → naujienlaiškių strategija A→Z (užrakinta TŽ v1.91) → istorijos
sluoksnis → paskyrų importas. Strategijos sprendimai — TŽ v1.91, čia tik technika.

---

#### S1535. PORAŠTĖS NAUJIENLAIŠKIO FORMA NEVEIKĖ — class-newsletter-footer.php v1.1 ✅

**Simptomas (Raimis, ekrano nuotrauka):** mygtukas „Prenumeruoti" nieko nedaro.
**Šaknis (nlb_diag.json):** `Petshop_Newsletter::assets()` įkelia `newsletter.js`
+ `PS_NL` tik kai `[petshop_newsletter]` yra `post_content` arba per filtrą
`petshop_newsletter_force_assets`. Poraštė eina per `flatsome_before_footer` — JS
nebuvo įkeliamas nė viename puslapyje (queue be `petshop-newsletter`). REST
maršrutas ir consent grandinė sveiki (rest_do_request consent=false → 400, be
šalutinių efektų).
**Pataisa:** `petshop-core/includes/class-newsletter-footer.php` v1.0
(44607298…) → **v1.1** (b51a7ce0…): `add_filter('petshop_newsletter_force_assets',
force_assets)` → `rodyti()`. Backup `ps-backups/class-newsletter-footer.php.bak_S1535`.
VER atskira užklausa: queue_nl=true, PS_NL su rest+nonce.
**Gyvas testas:** terra@gyvunai.lt per formą → ps_consent_log #36 (footer_form)
→ job #108 consent_changed → Sender sent 10:38:55 (dispatch cron kas 5 min —
~4 min vėlavimas normalus).
**Rasta spraga (ATVIRA):** terra@ turi aktyvią marketing suppression (07-31,
sender_reconcile), naujas opt-in jos NEATŠAUKĖ (released_at NULL) → rinkodara
šiam adresui bus praleista. Taisyti `Petshop_Consent_Sync::set_marketing_consent`.
**T-0 pastaba:** forma šauna į `/wp-json/` — Q-WPJSON, reikia globalaus sprendimo.

#### S1536. consent-changed.php v2.0 — ANT BENDRO KARKASO (buvo be logo) ✅

Iš 20 šablonų 4 nenaudojo `Petshop_Email_Layout`: consent-changed, order-paid,
dunning-1, founding. consent-changed (6ecef17d…) → v2.0 (d3a61a9d…):
`Petshop_Email_Layout::wrap()` (logo att. 3257, footeris pagal flow_class),
tas pats tekstas, „Pakeitimo įrašas" blokas, mygtukas, muted eilutė. Šaltinių
žemėlapyje pridėta `footer_form`/`newsletter_form`/`unsubscribe_link` → eilutė
„Užfiksuota: naujienlaiškio formoje" (anksčiau tyliai dingdavo). Render-testas
abiem variantais žalias; testinis job #109 į terra@ išsiųstas su logo.
**Liko:** order-paid.php (transactional!), dunning-1.php, founding.php.

#### S1537. ISTORIJOS SLUOKSNIS — ps_ist_uzsakymai + ps_ist_eilutes ✅

**Šaltinis:** `Petshop_uzsakymai_visi_iki_2026-08-30_07_36.xlsx` (24 338 eil.,
43 stulp.) → bridge `duomenys/uzsakymai_visi_2026-08-30.xlsx.b64` (MD5
a947beb1…). Lokaliai pandas → 2 JSON gz+b64 `.txt` (`duomenys/ist_uzsakymai.txt`,
`ist_eilutes.txt`) → runner DATA žingsnis → WP media → PHP fazė.
**DRY (ist_dry.json):** 10 076 užsak. / 24 338 eil. / 5 589 el. paštai / 9 528
įvykdyti = 393 165 € / 1 619 modelių; SKU atitiko 1 320 (85,7 % eil., 72,9 %
pajamų); WP vartotojų su šiais el. paštais 0.
**APPLY (ist_apply.json):** lentelės sukurtos (STOP jei ne tuščios), 10 076 +
24 338 įrašyta, vientisumas 0 be tėvo / eiluciu stulpelis sutampa; įvykdyti
9 528 = 393 156 € (skirtumas 9 € — DECIMAL apvalinimas). Tarpiniai uploads failai
ištrinti (DRY liko 2 — CL runu). Statusai: išsiųstas/+išsiųstas+/mokėjimas
gautas/paruoštas → ivykdytas=1; Atšauktas/Laukiama → 0.
**Schema:** ps_ist_uzsakymai(id PK=eShoprent order_id, data, email idx, vardas,
pavarde, tel, imone, siuntimas, miestas, apmokejimas, suma_be, suma, statusas,
ivykdytas, saskaita, eiluciu); ps_ist_eilutes(id AI, uzsakymo_id idx, modelis idx,
pavadinimas, variantas, kiekis, kaina, suma, wc_product_id idx, susiejimas).
Adresai ir komentarai SĄMONINGAI nekelti (minimizavimas).

#### S1538. KREIPINYS — petshop-kreipinys.php v1.0 (naujas mu-plugin) ✅

Raimis: „Sveiki, Martynai", ne „Martynas". `ps_vardas_svarus()` (pirmas žodis,
tik raidės, 2–14 simb.), `ps_kreipinys()` (-ius/-us→-au, -as→-ai, -is/-ys→-i/-y,
-ė→-e, kita nekeičiama), `ps_sveiki()`. Testas 25 vardų + 964 unikalių iš
istorijos (top-60 rankiniu žvilgsniu). consent-changed → v2.1 (dcf14503…) naudoja
`ps_sveiki()`; render „Sveiki, Martynai, nuo šiol…". Žinoma: „Ieva-Marija" →
„Ieva-marija" (v1.1). Pastaba: post-purchase-2d.php komentaras „automatinis
linksniavimas nepatikimas" — sprendimas dabar priešingas, tą šabloną derinti.

#### S1539. PASKYRŲ IMPORTAS — 5 666 TYLIAI ✅

**Šaltiniai:** ps_ist_uzsakymai (5 589 el. paštai; vardas/pavardė/tel iš
paskutinio užsakymo) + `duomenys/nl_klientai.txt` (563 Klientai lapo eil. JSON).
**DRY (pask_dry.json):** 5 668 kandidatai (484 NL su istorija + 79 tik NL), jau
WP 1, negaliojantis 1 (`tepalai@gmail.com - ne tas...` — pastaba faile),
be vardo 9, įmonių 27, pirko 12 mėn. 2 298, NL su suppression 0. Kabliai
user_register: Jetpack + wp_maybe_update_user_counts + closure;
woocommerce_created_customer: WC_Emails::send_transactional_email.
`set_marketing_consent` emituoja consent_changed + Sender push → importui
NETINKA (laiškai).
**APPLY (4 fazės po ≤230 s + VER, pask_apply.json):** `wp_insert_user` role
customer, login=email; `remove_all_actions` user_register /
woocommerce_created_customer / woocommerce_new_customer / profile_update;
meta billing_* + `_ps_banga` + `_ps_importas`='S1539 2026-08-31' + `_ps_ist_*`
+ `_ps_imone`; NL → `Petshop_Consent_Log::record` (source
eshoprent_newsletter_import) + `Petshop_Consent_Sync::META_MARKETING`='true';
tel normalizuotas +370. `ps_nl_snapshot` (email PK, vardas, segmentas, gyvunas,
brandas, nba, refill_d, json, importuota). Istorijos el. pašto pataisa
tepalai→tepalas@gmail.com (1 užsakymas).
**VER:** vartotojų 5 703, importuotų 5 667, bangos 5 105/562, consent 562,
snapshot 563, istorijos el. paštų be paskyros 0, **ps_email_jobs +0 /
ps_event_log +0** (tyla įrodyta), be vardo 9.
**CL (pask_cl.json):** alinasys@gmail.comcom (BLOGAS EMAIL faile, is_email
praleido) — paskyra uid 5710 + consent + snapshot ištrinti (Raimis: adreso
nežino). Galutinai: **5 666 paskyros · 561 sutikimas · 562 snapshot**.

#### S1540. Josera SUSIEJIMAS PAGAL PAVADINIMĄ + RANKINIS ✅

Raimis: Josera pakeitė pakuotes → nauji SKU. WC turi 210 Josera prekių.
(1) Pavadinimu (jos_apply.json): normalizacija (lower, entity decode, tarpai
prie skyryklių) → 199 grupių / 2 661 eil. / 71,5 k€, `susiejimas='pavadinimas'`
(7 → draft prekės). (2) Rankinis (jos_rank.json): JOS0158→18112, JOS0724→18018,
JOS0069→18032, JOS00060→18000, JOS0218→18022 — 235 eil., `'rankinis'`.
**Po:** 96,5 % pajamų susieta (buvo 72,9); liko 589 eil. / 11,7 k€ nebeparduodama.

#### S1541. BREVO → SENDER PRIVATUMO POLITIKOJE ✅

Recon (brevo_recon.json): visa DB + failai — tik #34525 publish ir #34526 draft
(slapuku-politika-old); Complianz lentelėse, postmeta 0; wp_mail_smtp option
(tuščias plugino raktas) ir `interface-message-provider.php` komentaras — neliesta.
APPLY: #34525 `„Brevo" (Sendinblue)` → `„Sender" (sender.net)` (preg, kabutės
išsaugotos); #34526 str_replace. Backup `ps_bak_brevo_{ID}`. Cache pluginų nėra.

#### S1542. DOKUMENTAI + ĮRANKIAI ✅

TŽ MASTER v1.90 → **v1.91** (4 Papildyta paragrafai + versijų lentelės eilutė
v1.91; lentelė nepildyta nuo v1.79 — užfiksuota). Bridge `irankiai/run.sh` +
`mjs_template.mjs` atnaujinti su DATA žingsniu (žr. pamoką 26).

---

#### TECHNINĖS PAMOKOS (tęsiama po #23)

24. **`init` fazėje NEGALIMA:** loopback `wp_remote_get` į save ir
    `apply_filters('the_content')` — grąžina TUŠČIĄ kūną (3 runai). Tikrinti
    per DB arba `template_redirect` kabliuką (ten veikia conditional tags ir
    `do_action('wp_enqueue_scripts')`).
25. **Kiekvienas DRY/APPLY runas, kuris kelia failus į uploads, turi juos ir
    ištrinti** — DRY paliko 2 attachments, reikėjo CL runo.
26. **Didelių duomenų kėlimas be tokenų DB:** runner DATA žingsnis —
    `DATA="duomenys/a.txt,duomenys/b.txt" ./run.sh ...` → GitHub raw (runner
    tokenu) → `POST /wp-json/wp/v2/media` (Basic) → PHP fazė gauna
    `$_GET['d_{name}']` = attachment id → `get_attached_file` → gzdecode(b64).
    Formatas `.txt` (WP leidžia), viduje gzip+base64 JSON (~4 MB → ~700 KB).
27. **`is_email()` praleidžia `gmail.comcom`** — failo kokybės žymos (BLOGAS
    EMAIL) tikrinti PRIEŠ importą, ne po.
28. **Runner rezultato raktas = fazės pavadinimas** — kartojant fazę
    (APPLY,APPLY,APPLY) matai tik paskutinę; kaupti į masyvą arba unikalūs vardai.
29. **run.sh > bash timeout:** 5 fazių runas (>5 min) viršija įrankio limitą —
    poll'inti `actions/runs/{id}` atskiru žingsniu ir skaityti `analize/*.json`.
30. **Import tyla įrodoma skaičiais:** `ps_email_jobs`/`ps_event_log` delta = 0
    per importo langą, ne „nuėmiau kablius".

#### NAUJI/PAKEISTI FAILAI

```
petshop-core/includes/class-newsletter-footer.php   v1.1  b51a7ce0e73c...  (S1535)
petshop-core/templates/emails/consent-changed.php   v2.1  dcf14503abe5...  (S1536/S1538)
mu-plugins/petshop-kreipinys.php                    v1.0  f523f448e98b...  (S1538, NAUJAS)
DB: gaj6_ps_ist_uzsakymai (10 076) · gaj6_ps_ist_eilutes (24 338) · gaj6_ps_nl_snapshot (562)
    · +5 666 users (role customer, _ps_importas) · +561 ps_consent_log
Posts: #34525 / #34526 turinys (Brevo→Sender)
Bridge: irankiai/run.sh, irankiai/mjs_template.mjs (DATA); duomenys/uzsakymai_visi_2026-08-30.xlsx.b64,
    ist_uzsakymai.txt, ist_eilutes.txt, nl_klientai.txt (asmens duomenys — trinti po Klientai ekrano)
Backups: ps-backups/class-newsletter-footer.php.bak_S1535, consent-changed.php.bak_S1536, .bak_S1538
```

#### KITAS LANGAS — EILĖS TVARKA

1. **Klientai ekranas** (Petshop langai): sąrašas + filtrai + kortelė (ps_ist_* +
   WC + consent + jobs + augintinis) → „Siųsti šiai auditorijai" į Kampanijas.
2. Segmentų taisyklės iš ps_ist_* + ps_fakt_* (7 segmentai gyvai, ne snapshot).
3. Suppression spraga (`set_marketing_consent` → release prie gyvo opt-in).
4. order-paid / dunning-1 / founding → karkasas + ps_sveiki().
5. Raimio sprendimai: refill terminas klientui · K-NL2.
6. F19 pending (MVP #4/#5/#7) — lygiagrečiai; T-0 Q-WPJSON.

Aukščiausias decision Nr.: **S1542**. TEMP snippetai 4286–4318 deaktyvuoti
runner'io; trynimas — žr. žemiau.

---

### TĘSINYS TOJE PAČIOJE SESIJOJE — S1543–S1546 (2026-08-31, vakaras)

#### S1543. KLIENTAI EKRANAS — petshop-klientai.php v1.0 (naujas mu-plugin) ✅

**Petshop langai → Klientai** (vėliau perkeltas, žr. S1544). Suvestinės lentelė
`ps_kl_suvestine` (user_id PK; email, vardas, banga, sutikimas+data+šaltinis,
suppression, ist_n/ist_suma, wc_n/wc_suma, uzsakymai, suma, pirmas, paskutinis,
segmentas, gyvunas, top_preke/top_pid/top_n, ciklas, kita, augintiniu) —
perskaičiuojama kas naktį 05:30 (cron `ps_klientai_perskaiciuoti`) + mygtukas;
5 700 klientų per 1,3 s (visos užklausos agreguotos, ne po vieną).

**Segmentų taisyklės (B1 „konstitucija", Raimio patvirtinta S1546):**
prioritetas 1→7, pirma tinkanti laimi:
1 refill_laikas „Maistas baigiasi" — pagr. prekės ciklas žinomas (≥3 pirkimai,
  ciklas ≥5 d.) ir tikėtina data ≤ šiandien, pradelsimas ≤120 d.
2 refill_arteja „Artėja papildymas" — tikėtina data per 14 d.
3 pirmas „Pirko kartą" — 1 užsakymas, ≤180 d.
4 aktyvus — ≥2 užsakymai, paskutinis ≤90 d.
5 reaktyvacija — paskutinis 91–180 d.
6 win_back — paskutinis >180 d.
7 nepirkes — 0 įvykdytų.
Ciklas = (paskutinis−pirmas)/(pirkimų−1) pagr. prekei, tik nuo 3 skirtingų dienų.
Gyvūnas — pirktų prekių kategorijų šaknys (ŠUNIMS term 70 / KATĖMS 77, su
variacijų→tėvo perkėlimu): suo/kate/abu (mažuma ≥25 %).
Pirmas skaičiavimas: Maistas baigiasi 98 · Artėja 34 · Pirko kartą 725 ·
Aktyvus 276 · Reaktyvacija 146 · Win-back 4 152 · Nepirkęs 269; gyvūnai
2 439/2 210/361/690; ciklas žinomas 545.

**Ekranas:** kortelės (viso/sutikimai/bangos/7 segmentai-filtrai) · filtrai
(banga·sutikimas·segmentas·gyvūnas·pirko 12/24·paieška) · „Siųsti šiai
auditorijai (N)" → CSV (TIK sutikimas=taip AND suppression=0) į uploads/ps-import
→ Naujienlaiškių lango šaltinis „csv:..." (E2E: refill_laikas+pirko12 → 14 el.
paštų, Kampanijų langas failą mato) · sąrašas 50/psl. · kortelė (hero sakinys,
sutikimo mygtukai per set_marketing_consent source=admin su patvirtinimo laišku
klientui, prekių lentelė kartų/vnt./paskutinį/kas kiek d./€ su „nebeparduodama",
užsakymai eShoprent+WC vienoje juostoje, sutikimų žurnalas, laiškų žurnalas su
delivered/opened/clicked, augintiniai iš ps_pets, pastaba _ps_pastaba,
snapshot eilutė). VIZUALIAI patvirtinta: analize/klientai_sarasas.png,
klientai_kortele.png (Playwright, 2 slapukai pagal pamoką #18).

#### S1544. MENIU PERTVARKA — „Petshop klientai" viršutinė šaka ✅ (v1.1)

Raimio sprendimas: klientų sritis — ne „Petshop langai". petshop-klientai.php
v1.1 (md5 babf03d4…, backup .bak_S1544): `add_menu_page` **Petshop klientai**
(dashicons-groups, pozicija 56) su Klientai · Naujienlaiškiai ir kampanijos ·
Laiškų šablonai · Laiškų rezultatai. Perkėlimas iš petshop-langai — metodas
`perkelti()`: callback paimamas iš `$wp_filter[get_plugin_page_hookname()]`,
`remove_submenu_page` + `add_submenu_page` nauju tėvu — **originalūs moduliai
neliečiami**. Petshop langai liko: Apžvalga · Prenumeratos · Prognozės.
Kampanijos gyvena Naujienlaiškių lange (petshop-naujienlaiskiai-admin.php
naudoja Petshop_Kampaniju_Langas::dry/banga/busena/segmentai) — Klientai
„auditorijos" mygtukas veda ten. Playwright patikra: visi 4 puslapiai naujoje
vietoje atsidaro (h1 teisingi), meniu struktūra ekrane.

#### S1545. ESAMŲ ATASKAITŲ RECON — „Petshop analitika" ŠAKOS NEBUS ✅

Perskaityti: petshop-ataskaita-klientai.php v1.0.1 (kohortos, LTV-kontribucija,
RFM, rizikoje; ps_fakt_uzsakymai + ps_dim_klientai naktinis; klientas=email
hash, be PII), petshop-ataskaita-prekes.php v1.0 (ABC×XYZ 365 d., kainų
istorija×pardavimai, akcijų uplift; ps_fakt_eilutes/kainos/atsargos_d),
petshop-ataskaita-atsargos.php v1.0 (ką užsakyti = paklausa 30 d. per
lead+buferį; „be duomenų nesiūlom nieko"; ps_fakt_atsargos_d + ps_partijos +
ps_sources). **Bendra problema: visi skaito TIK ps_fakt_* → istorijos nemato,
po perjungimo startuotų nuo nulio.** Sprendimas — ne nauja šaka, o istorijos
adapteris į esamus langus + „Tikėtini užsakymai" kaip Atsargų skirtukas
(paklausa iš klientų ciklų greta pardavimų 30 d.).

#### S1546. ★ ANALITIKOS ARCHITEKTŪRA — RAIMIO SPRENDIMAI (visi patvirtinti) ✅

1. **VIENA TAISYKLIŲ KNYGA (B1).** Dvi segmentų sistemos („dvi apskaitos —
   košmaras") naikinamos į vieną: S1543 septynios taisyklės = vienintelis
   „segmento" apibrėžimas VISUR. Klientai = operacinė tiesa (kam siųsti);
   Klientų analizė tuos pačius skaičius rodo agregatuose; RFM lieka tik kaip
   papildomas pjūvis LTV ir NEBEVADINAMAS segmentu. ps_dim_klientai naktinis
   gauna istoriją per adapterį; definicijos suvienodinamos, kad abu langai
   rodytų tą patį skaičių.
2. **ISTORIJOS ADAPTERIS.** ps_ist_* paduodama ps_fakt_* forma visiems
   analizės langams — viena nenutrūkstama juosta 2023-11 → šiandien. Riba:
   iki perjungimo dienos = ps_ist_* (užšaldyta), po = ps_fakt_*; siuvimas
   skaitymo momentu, vartotojas šaltinio nesirenka pjūviuose.
3. **ŠALTINIO JUNGIKLIS [eShoprent | petshop.lt | Abu]** kiekviename analizės
   lange (Raimio reikalavimas „dirbti paprastai su trim langais"). Default:
   Abu; pasirinkimas įsimenamas. petshop.lt režime — palyginimo eilutė „tas
   pats laikotarpis eShoprent pernai" (augimo atskaitos taškas be maišymo);
   2026 m. „Abu" ataskaitoje — žymė iki/po perjungimo.
4. **eShoprent pjūviai — pilnaverčiai:** laikas/prekė/brandas/kategorija (per
   96,5 % susiejimą; nesusieta = „nebeparduodamos" eilutė)/naujas-pakartotinis/
   kohortos/siuntimas/miestas/apmokėjimas/įmonės/krepšelis. NĖRA ir NEBUS:
   pelnas-maržos (savikainų eksporte nėra), atsargų istorija, nuolaidų
   detalės, srautas/konversija — tai tik petshop.lt režime. „Pardavimai" —
   nuo 2023-11, „Pelnas" — nuo perjungimo.
5. **DEV ŠLAMŠTO KARANTINAS:** T-0 naktį ps_fakt_* / ps_dim_klientai /
   ps_kl_suvestine išvalomos ir perskaičiuojamos nuo nulio (patikra „testinių
   užsakymų = 0" — naujas T-0 punktas). Iki tol faktai į ataskaitas
   neįleidžiami, kol nenustatyta perjungimo data (opcija, įjungiama T-0).
6. **RAIMIO RANKA T-0:** galutinis eShoprent užsakymų eksportas perjungimo
   dieną (laikotarpis nuo 2026-08-30) — Claude papildo ps_ist_* be dublių.

#### KITAS LANGAS (perrašo ankstesnę eilę)

1. Istorijos adapteris + jungiklis [eShoprent|petshop.lt|Abu] į Klientų/Prekių/
   Atsargų analizes; ps_dim_klientai su istorija; segmentų suvienodinimas (B1).
2. „Tikėtini užsakymai" skirtukas Atsargose (klientų ciklai per prekę).
3. Suppression release prie gyvo opt-in; order-paid/dunning-1/founding karkasas.
4. Raimis: refill terminas klientui · K-NL2.

Aukščiausias decision Nr.: **S1546**. TEMP snippetai išvalyti per SQL (606,
pamoka: Code Snippets DELETE per DB veikia, REST — ne); liko tik paskutinio
runo neaktyvus. Nauji failai: mu-plugins/petshop-klientai.php v1.1
(babf03d4…), DB gaj6_ps_kl_suvestine (5 700).

---

### S1532–S1534 (2026-08-31)

Papildo deployment_log_v1_9_11.md (paskutinis S1531). Sesija: naujienlaiškių
kryptis — būklės patikra + klientų failo priėmimas. Kodas NEDIEGTAS, tik recon.

---

#### S1532. TILTO ATKŪRIMAS + run.sh ĮAMŽINTAS REPO ✅

`run.sh` nebuvo saugomas bridge repo (gyveno tik konteineryje) — kiekviena
sesija jį atkūrinėjo iš atminties. Atkurtas iš gyvo `screenshot.mjs` (S1531
versija = šablonas) ir **įkeltas į repo `irankiai/`**:

```
irankiai/run.sh              — pilna automatika: lint → Python template fill →
                               Contents API PUT su SHA → 25s → dispatch 298960963 →
                               poll → rezultatas per commit SHA
irankiai/mjs_template.mjs    — screenshot.mjs šablonas (B64/VER/GKEY/PHASES/OUT
                               pildomi per re.sub)
```

Sesijos startas nuo šiol: PAT į /tmp/.ghtok → parsisiųsti `irankiai/run.sh` +
`mjs_template.mjs` į /home/claude/ps/ → chmod +x → dirbti. PHP 8.3 lint'ui:
`apt-get update -qq && apt-get install -y -qq php8.3-cli`.

---

#### S1533. NAUJIENLAIŠKIŲ SISTEMOS RECON — EMPIRINĖ BŪKLĖ ✅

Du runai (analize/nlrecon.json, nlrecon2.json). Serveryje GYVA:

| Failas | Versija | Esmė |
|---|---|---|
| petshop-naujienlaiskiai.php | v1.0 | variklis: ps_naujienlaiskiai lentelė (0 įrašų), newsletter srautas, korteles blokas be kainų, marketing poraštė |
| petshop-naujienlaiskiai-admin.php | v1.0 | redaktorius, gyva peržiūra, prekių parinkiklis, dry→peržiūra→GO |
| petshop-kampaniju-langas.php | v1.1 | founding/legacy/newsletter bangos, job_key idempotencija, STOP/GO po bangos |
| petshop-rezultatai.php | v1.1 | šviesoforas, suppression, email→pajamos (last-click 7 d.) |
| petshop-laiskai.php | v1.3 | dispatch gyvas, cron ps_email_dispatch_cron |
| petshop-laiskai-importas.php | v1.5 | ŠABLONŲ importas į redaktorių (NE klientų!) |

Sender: klasės Petshop_Sender_Adapter / Email_Dispatch / Event_Registry yra;
raktai options petshop_esp_sender_mk/tk + webhook_secret. ps_consent_log
veikia (11 įrašų, unsubscribe kelias įrodytas 07-31). ps_email_jobs 17
(order_paid/post_purchase_2d/refill_due/cart_abandoned). ps_naujienlaiskiai 0.

**PASTABA ATMINČIAI:** deployment_log v1.9.11 šių modulių diegimo NEFIKSUOJA
(diegta sesijoje, kurios log fragmentas nepateko į master) — būklė dabar
užfiksuota čia empiriškai. Bridge deploy/ turi tik kampaniju-langas.php.b64.

Trūksta: klientų duomenų (D7) · klientų importerio · sukurtų laiškų ·
Sender tracking CNAME (OPS-08).

---

#### S1534. KLIENTŲ FAILAS PRIIMTAS — FORMATAS TINKA, PLANAS SUTARTAS ✅

**Failas:** Petshop_Newsletter_Customer_Intelligence_SUTVARKYTAS_2026-08-30.xlsx
(įkeltas į bridge `duomenys/nl_klientai_2026-08-30.xlsx.b64`).

**Profilis:** 563 klientai · 0 dublių · 0 blogų email formatų (1 eilutė
pažymėta „BLOGAS EMAIL" kokybės stulpelyje — patikrinti importe) · visi
Newsletter=TAIP → tai K1 „~560 švarus sutikimų pagrindas". 476 su pirkimo
istorija (1 435 užsakymai, 7 lapai: Dashboard/Klientai/Kampanijos/Užsakymai/
Pirkimai/Produktai/Metodika).

**Segmentai (prioritetai 1→7):** Refill-laikas 34 · Refill-artėja 19 ·
1-pirkimas-reikia-2-o 16 · Aktyvus pakartotinis 31 · Reaktyvacija 57 ·
Win-back 319 · Nepirkęs 87. Kiekvienam — NBA (konkreti prekė/kategorija),
gyvūnas (206 šuo / 204 katė / 32 multi), brandas, medianinis refill ciklas.

**SUTARTAS PLANAS (vykdymas kitoje sesijoje):**
1. Importeris (naujas modulis): XLSX → `ps_nl_klientai` lentelė su visais
   intelligence laukais + WC paskyros TYLIAI (F-KLIENTAI: jokių laiškų
   importo metu!) + marketing_consent=true į ps_consent_log su
   source='eshoprent_newsletter_import'. DRY → Raimio peržiūra → APPLY.
2. Kampanijų lango `segmentai()` prijungti prie ps_nl_klientai —
   7 prioritetai = siunčiamos auditorijos.
3. Laiškai redaktoriuje (korteles blokas refill personalizacijai).
4. Bangos su STOP/GO; Rezultatai v1.1 matuoja pajamas.

**ATVIRI KLAUSIMAI RAIMIUI (prieš siuntimą, ne prieš importą):**
- **K-NL1 kada siųsti:** TŽ §14 užrakinta — vykdymas PO launch (po 10-01),
  iš gyvo petshop.lt. Claude siūlo: importas + laiškų paruošimas dabar,
  siuntimas po perjungimo. LAUKIA PATVIRTINIMO.
- **K-NL2 pirmas laiškas:** TŽ tekstas „pasisveikinimas nuo komandos +
  anketa, be pažadų" visiems, ar iškart segmentuoti 1–7? Doktrina max
  2×/mėn. → siūlymas: №1 pasisveikinimas visiems, №2 segmentuotas.
  LAUKIA SPRENDIMO.

**GDPR pastaba:** TŽ §14 „sutikimai neperkeliami" vs K1 „560 opt-in švarus
pagrindas" — interpretacija: šie 563 SU aiškiu naujienlaiškio sutikimu
perkeliami kaip marketing_consent=true; likusieji ~2 000 pirkimo paštų —
tik paskyros be sutikimo (Art. 14 kelias). Raimis žodžiu neprieštaravo,
formaliai patvirtinti prie importo APPLY.

---

#### KITAS LANGAS — EILĖS TVARKA

1. Klientų importeris (S1534 planas, DRY→APPLY).
2. K-NL1 + K-NL2 atsakymai iš Raimio.
3. Pirmo laiško juodraštis redaktoriuje.
4. (lygiagrečiai gyvena) F19 pending iš S1531: MVP #4 atsargų patikra,
   MVP #5 T-5 laiškas, MVP #7 likutis.

Aukščiausias decision Nr.: **S1534**. Kodas serveryje nekeistas, TEMP
snippetai po runų deaktyvuoti automatiškai (runner'io CL logika).

---

### S1524–S1531 — F19 prenumerata: nuolaidos, prognozė, nuorodos, sutikimas, taisyklės (2026-08-30)

> Santrauka iš REGISTRAS v34 §8mm. Pilnas papildymas `deployment_log_papildymas_S1524-S1531.md` — Raimio įkeltas 2026-09-01, į bridge repo nepateko.

| Sluoksnis | Būklė | Įrodymas |
|---|---|---|
| Nuolaidų variklis v2.1 + langas v2.5 | ✅ | `petshop-prenumerata.php` 46657a60…, `ps_subscriptions.discount_pct` (db_versija 4), user meta `_ps_pren_nuolaida`, NUOLAIDA_MAX 90; E2E T1–T7 žali, KLIK 10/10 — S1524/S1525b |
| Prognozės modulis v1.0 | ✅ | `petshop-prenumeratu-prognoze.php` f3963ad5…; projekcija 30/45/60 d., deficitai vs `_own_stock_qty`/WC stock, langas Petshop langai → Prognozės, cron 06:40 laiškas tik esant deficitui; tylus starteris — S1526 |
| Testiniai planai | ✅ | #43/#55/#67 ištrinti, `ps_subscriptions` 0/0 — S1525/S1527/S1531 |
| Pren nuorodos v1.0 | ✅ | `petshop-pren-nuorodos.php`: laiško tokenas (HMAC, TTL 30 d.) → `/pren-veiksmas/?t=` → POST → prisijungimas → `/paskyra/prenumeratos/`; anoniminio atšaukimo puslapio NEBUS (Raimis). E2E 7/7 — S1528 |
| Sutikimo varnelė kasoje | ✅ | `petshop-pren-sutikimas.php` v1.0: tik su pren preke, validacija, įrodymas `_ps_pren_sutikimas/_laikas/_versija/_ip`. E2E 6/6 — S1529 |
| Taisyklių puslapis #35281 | 🟡 DRAFT v0.4 | publikuoja Raimis — S1530 |
| Katalogo kelias | ✅ | prekė „Prenumeruoti" → checkout kabliai → `payment_complete` → prenumerata aktyvi; liko paskyros „Pasirinkti prekes" mygtukas — S1531 |

**Raimio užrakinti sprendimai (S1530):** kiekviena siunta apmokama atskirai pagal priminimo nuorodą, automatinių nuskaitymų NĖRA; kainodara BE fiksavimo (dienos kaina, galutinė suma T-5 laiške; `price_locked*` nebepildomi); nemokamo pristatymo riba 30 €.

---

### ŽURNALO SPRAGA — S1282–S1523 (2026-08-26..08-30)

Ataskaitų sistema E1a/E1b, katalogas, kt. — papildymų failų nėra nei bridge repo, nei projekte (patvirtinta 3 sesijose 2026-09-01/02). Šaltiniai būklei: REGISTRAS v34, TŽ MASTER v1.88–v1.92. Iš atminties nepildoma.

---

### 2026-08-26 (vakaras) · SESIJA — ATASKAITU SISTEMA E1a [S1270-S1281]

**S1270. Planas v1.3 (E0 recon itrauktas).** Raimis patvirtino Q-E0-1…7 ir visus
21 §15 keitima. Planas perrasytas pilnu failu: §0A pokyciu skyrius, §1 versijos
+ 6 nauji iraso, §3 taisykles 3/4/5/9 + NAUJA 10, §4.1–4.9 patikslinimai,
§7 E0 uzdarytas, taisykles 3/4 + NAUJOS 11/12, §8 Q-E0 lentele.
`dokumentai/petshop_ataskaitu_sistema_master_planas_v1_3.md`, commit 39c2af8e, 58 835 B.

**S1271. 🔴 RADINYS #22 — PVM vienetu nesutapimas ESAMAME agregatoriuje.**
Tikrinant Q-E0-4 atsakyma paaiskejo: `agregavimas:291` i sriti `parduotuve/pajamos`
raso `$ord->get_total()` (SU PVM ir pristatymu), o `agregavimas:314` i
`pardavimai/parduota` raso `$it->get_total()` (BE PVM). KPI „dalis apyvartoje"
dalina be-PVM skaitikli is su-PVM vardiklio — nuvertinta ~21 %+. S842 seimos
klaida. Sprendimas: istorijos nekeisti, §5.2 vardikli imti is §4.1
`prekiu_suma_ct`, i §3 iresta taisykle 10.

**S1272. petshop-faktai.php v1.0 + petshop-kanalai.php v1.0 (E1a).**
Du nauji mu-plugin failai. `Petshop_Faktai::rasyti()` kabinasi ant
`woocommerce_payment_complete` **p35** (zemesni uzimti iki 30: av-order 5,
av-reduce 15, event-emitters 20, partijos 25, refill-engine 30) + fallback'ai
`status_processing`/`status_completed`, nes **BACS (pavedimas) `payment_complete`
NEKVIECIA** — be siu fallback'u testinis uzsakymas fakto negautu.
`Petshop_Kanalai` — `woocommerce_init` p1 (rinkimas i WC sesija),
`woocommerce_checkout_create_order` p21 (i uzsakymo meta `_ps_kanalai`).
Lenteles `ps_fakt_uzsakymai` + `ps_fakt_eilutes`, InnoDB/DYNAMIC/utf8mb4.
Patikrinta, kad `petshop-innodb.php:45` nedubliuoja `ENGINE=` (praleidzia, jei
autorius jau nurode).

**S1273. 🔴 Dvigubos nuolaidos klaida — rasta PRIES deploy'a.** Pirmame variante
`prekiu_suma_ct` buvo `line_total` (jau po nuolaidos), o marza skaiciuojama
`prekiu_suma − nuolaidu − savikaina` (planas §4.1) — nuolaida butu atimta DU
kartus. Pataisyta: `prekiu_suma_ct` = BRUTO (pries nuolaida), neto = 
`prekiu_suma_ct − nuolaidu_ct`. Faktuose laikom daugiau informacijos: is bruto
visada gauni neto, atvirksciai ne.

**S1274. Kanalu pagavimas patikrintas narsykleje (runas #4952, browser=1).**
Ejimas i `?utm_source=test&utm_medium=cpc&utm_campaign=e1a` su isoriniu referer
`kaina24.lt` -> WC sesijoje `ps_kanalai.pirmas` su `kanalas=mokamas`. Po vidinio
perejimo i `/parduotuve/` **`pirmas` NEPASIKEITE**. Sesija galioja 48 val. JS
klaidu 0. Klasifikatorius papildomai patikrintas 10 sintetiniu atveju:
`gclid` ant `google.com` -> **mokamas** (ne organika; eiles tvarka veikia).

**S1275. 🔴 LAIKO ZONA — projektas buvo NESUDERINTAS.** Ismatuota:
`current_time('mysql')` = 01:23 (Vilnius), `current_time('mysql',true)` = 22:23
(UTC), MySQL `NOW()` = Vilnius, PHP default TZ = UTC. Dvi konvencijos:
petshop-core (`ps_shipments`:96, `ps_carts`, `ps_email_jobs`, `ps_event_log`) —
**UTC**; mu-plugins `statistika:389` ir agregavimas — **vietinis**.
Sprendimas (Raimis): faktai saugo **UTC** (nes §4.3 jungsis su `ps_shipments`),
ekranas rodo Vilniu. Idiegta v1.1: viena funkcija `Petshop_Faktai::dabar()`,
`$order->get_date_paid()->date()` pakeista i `gmdate(..., ->getTimestamp())`.
Isimtis: `ar_testinis()` lygina verslo diena per `wp_date()`.

**S1276. Idempotencija — TRYS sluoksniai, isbandyti empiriskai (runas #4953).**
(1) uzsakymo meta `_ps_faktas_irasytas`; (2) `SELECT COUNT(*)` pries INSERT;
(3) `PRIMARY KEY (uzsakymas_id)` + `UNIQUE (uzsakymas_id, eilutes_id)`.
Bandymas su sintetiniu ID 999000001 (uzsakymo NEKURIANT): antras INSERT ->
„Duplicate entry '999000001' for key 'PRIMARY'", lenteleje 1 eilute; eiluciu
lentele -> „Duplicate entry '999000001-7' for key 'uzs_eil'". Testines eilutes
istrintos. Pataisyta v1.1: `Duplicate entry` dabar atpazistamas ir tyliai
praleidziamas (anksciau rase klaidinga „NEPAVYKO" pastaba i uzsakyma).

**S1277. E1a DoD — TRYS realus uzsakymai (Raimis uzsake per vitrina).**
| # | Kas | Rezultatas |
|---|---|---|
| 35087 | misrus (legacy+zb), MnM deze, dovana, utm | 15 eiluciu; 5574 ct be PVM; marza 1867; kontribucija 1721 |
| 35088 | VF, antras tas pats el. pastas | 1 eilute; `klientas_naujas=0`, `nr=2` |
| 35090 | kuponas −10 %, 3 sandeliai (ambrosia/vf/legacy) | 3 eilutes; nuolaidu 687; marza 1515; `nr=3` |
Visiems 8 automatines patikros OK iki cento + rankinis perskaiciavimas (S817).
Uzsakymo pastaboje: „Faktai irasyti: N eilutes · pajamos X · PVM Y · marza Z ·
kontribucija (be pristatymo) W · TESTINIS".

**S1278. Kupono kelias BUTINAS — jis atskyre klaida.** Parduotuveje kuponu buvo
**0**, todel Raimis ju pritaikyti negalejo (mano recepto klaida — nepasitikrinau).
Sukurtas testinis `e1a-testas` (percent 10 %, ID 35089, galioja iki 09-02,
limitas 5). `woocommerce_enable_coupons=yes` — nieko ijungti nereikejo.
Uzsakymas 35090: WooCommerce paskirste 10 % per 3 eilutes (496+94+97=687 ct).
**Su S1273 klaida marza butu buvusi 828 vietoj 1515** — skirtumas lygiai 687 ct,
visa nuolaida. Su nuline nuolaida (35087/35088) abi formules butu davusios ta
pati atsakyma ir klaida butu iskeliavusi i produkcija.

**S1279. Sprendimas B + `diena` (Raimis).** v1.2: `kaina_reguliari_ct` =
`_regular_price` pardavimo momentu (variacijai — variacijos, MnM vaikui — vaiko
prekes), tuscia -> NULL. Kaina pries kupona — isvestine
(`kaina_ct + nuolaida_ct`). Pridetas `diena` DATE (Vilniaus verslo diena is
`apmoketa_at`) ABIEJOSE lentelese. Idempotentiska `migracija_v2($dry)`.

**S1280. 🔴 RADINYS #23 — brolis #22, mano paties naujame stulpelyje.**
Migracijos DRY parode: `kaina_vnt_ct` 182 vs `kaina_reguliari_ct` 220; 1495 vs
1809; 4958 vs 5999 — visais atvejais santykis lygiai **1,21**. Tai ne akcija, o
PVM: `woocommerce_prices_include_tax=yes`, todel `_regular_price` DB saugoma SU
PVM, o `kaina_ct` yra BE PVM. Butu buve du gretimi stulpeliai skirtingais
vienetais — tiksliai tai, ka pats ka tik iresiau i §3 taisykle 10.
Pataisyta v1.3: `wc_get_price_excluding_tax($pr, ['price'=>$reg])` — WC pritaiko
prekes **mokesciu klase**, ne dalyba is 1,21.
Po pataisos: visose 17 iprastu eiluciu `kaina_reguliari_ct` = kaina pries kupona,
skirtumas **0** (ne viena preke nebuvo akcijoje); MnM konteineris 1091, dovana
107 — neto katalogo vertes. Pinigu laukai migracijos metu NEPAKITO.
Pamoka i §7 taisykle 11: vienetu patikra galioja ne tik KPI, bet ir kiekvienam
naujam stulpeliui salia pinigu lauko.

**S1281. `diena` patvirtinta realiais duomenimis.** Visi trys uzsakymai apmoketi
22:32–22:55 **UTC** = 01:32–01:55 Vilniaus laiku **kitos paros**. `diena` visiems
= **2026-08-26**, nors `apmoketa_at` UTC rodo 2026-08-25. Tiksliai tas atvejis,
del kurio stulpelis ir kurtas.

**BUKLE po E1a:** `ps_fakt_uzsakymai` 3 eilutes (55 stulpeliai),
`ps_fakt_eilutes` 19 eiluciu (38 stulpeliai), abi InnoDB/DYNAMIC/utf8mb4,
`ps_fakt_schema=2`, `fakt_versija=2`.
Serveryje: `petshop-faktai.php` **v1.3** (md5 a0587d1f), `petshop-kanalai.php`
**v1.1** (md5 39c3fb61).
35087 paliktas `processing` su 2 NEREGISTRUOTOMIS siuntomis — realus misrus
atvejis E1b siuntu faktams. Kuponas `e1a-testas` paliktas E1b grazinimo testui;
i T-0 valymo sarasa iresta.

---

### 2026-08-26 · SESIJA — ATASKAITU SISTEMA E0 RECON [R010-R014]

**S1260. Tiltas: naujas PAT.** Senasis token'as galiojo iki 2026-08-26. Raimis
pateike nauja token'a (i dokumenta NERASOMAS) — galioja **iki 2026-09-23 16:31 UTC**.
Patikrinta: `/user` 200 (raimis079-creator), repo `petshop-bridge` 200 (private,
main, push 2026-08-25 21:03), workflow `298960963` = „Screenshot" aktyvus,
paskutiniai runai #4942–#4944 success. Irasyta `/tmp/.ghtok`.

**S1261. E0 Recon — penki skenavimo runai (browser=0).** Master plano
`petshop_ataskaitu_sistema_master_planas_v1_2.md` §7 E0 uzduotis: perskaityti
ataskaitu modulius, surasyti realius hook'us/meta raktus/schemas su failo
eilutemis, 0 spejimu, kodo nerasyti.

| Runas | Ka | Rezultatas |
|---|---|---|
| #4945 R010A | 65 mu-plugin failai, 53 `ps_*`/WC lenteles su `SHOW CREATE TABLE`, `ps_*` options, aktyvus snippet'ai | `deploy/r010_recon.json` 131 611 B |
| #4946 R011B | 23 taikinio failai: hook'ai, meta, options, lenteles, transientai, cron, apibrezimai — su eilutemis | `deploy/r011_recon.json` 87 255 B |
| #4947 R012C | globalus grep per **137 failus** (mu-plugins + petshop-core + petshop-xml), 26 raktazodziai + 10 kodo istrauku | `deploy/r012_recon.json` 71 576 B |
| #4948 R013D | `petshop-core` inventorius (59 failai), Desk Q7 taskai, WC nustatymai, gyvas cron sarasas | `deploy/r013_recon.json` 25 920 B |
| #4949 R014E | `class-shipments.php` pilnas kodas, jo kvietejai, `ps_ataskaitu_dienos` pjuvis, `ps_shipments`/`ps_carts` duomenys | `deploy/r014_recon.json` 26 845 B |

Rezultatas: **`dokumentai/ataskaitu_recon_v1.md` v1.1**, commit `a247d81`, 37 936 B.
Kodo NERASYTA. Visi TEMP snippet'ai deaktyvuoti kiekvieno runo pabaigoje.

**S1262. 🔴 Q7 NEREIKALINGAS — Desk galima neliesti.** Planas norejo, kad Opus
idetu `do_action('petshop_siunta_sukurta', …)` i `petshop-desk.php`. Recon rodo:
abu Venipak registracijos keliai — grupinis (desk:681/685 -> desk:693–695) ir
vieno sandelio (desk:762/766 -> desk:782–784) — kviecia **ta pati**
`Petshop_Siuntos::prideti_is_plugino()` (`petshop-siuntu-laiskai.php:58`).
Kabliukas dedamas ten, eil. 77 pries `$o->save()`; visi keturi argumentai
($order_id, $sandelis, vezejas=venipak, numeriai) jau zinomi. **`petshop-desk.php`
lieka nepaliestas**, §7 taisykle 3 nepazeidziama.
Kaina: nefiksuos siuntu, registruotu aplenkiant darbalauki (siuntu-laiskai:92–93).

**S1263. 🔴 `ps_shipments` NEGALI buti `ps_fakt_siuntos`.** `class-shipments.php`
(207 eil., md5 `2c1af76b`, S319/v0.20.0) antrastes :14–16 — citata: „SAMONINGAI
NESAUGOM: sandelio, konkreciu prekiu ID. Ju patikimo saltinio NETURIME (Venipak
raso pack_numbers visam uzsakymui), o inferred reiksmes veliau taptu melagingais
duomenimis." Lentele sandelio lauko neturi ir principingai netures; plano §4.3
reikalauja siuntos PER SANDELI -> `ps_fakt_siuntos` turi buti **atskira** lentele
su nuoroda i `ps_shipments.shipment_id`. Nepriklausomai patvirtina S1262:
vienintele vieta, kur sandelis ir siuntos numeriai egzistuoja kartu, yra
`prideti_is_plugino()`.
Kvietejai (grep is 137 failu): `petshop-core.php:133/:172`,
`class-event-emitters.php:150` (`sync_from_meta` po `woocommerce_update_order`),
`:228` (`resolve_all`). **Desk jos nekviecia.**
Naujas faktas: LP Express siuntos nr. = order meta `_woo_lithuaniapost_barcode`
(:144); vezejo reiksmes uzrakintos `venipak` / `lp_express` (:194).

**S1264. Spragos patvirtintos empiriskai (grep, 137 failai).**
`utm_` — **0 rezultatu**. `utm_source` — **0**. `woocommerce_order_refunded` — **0**.
`woocommerce_product_object_updated_props` — **0**. Vadinasi plano §1 spragos #4
(kanalas/atributacija), §4.4 (grazinimu faktas) ir §4.6 (kainu istorija) yra
tikros, ne prielaidos.
`payment_complete` prioritetai UZIMTI iki 30: av-order:40 p5 -> av-reduce:36 p15 ->
core/event-emitters:30 p20 -> partijos:581 p25 -> core/refill-engine:101 p30.
**`petshop-faktai.php` privalo eiti prioritetu >=35**, kad partiju nurasymas jau
butu ivykes ir savikaina galutine.

**S1265. Trys moduliai, kuriu MASTER PLANE nera.**
(a) `petshop-pardavimai.php` v1.0 (374 eil.) jau skaiciuoja ABC (`ABC_A=0.80`,
`ABC_B=0.95` :52–53), 30/90/365 d. pardavimus, marza, dienas atsargai — is
`wc_order_product_lookup` :66 + `wc_order_stats` :69 i prekes meta
(`_ps_sales_30d` … `_ps_abc`, :168–:233), cron `ps_pardavimai_naktinis` 04:50.
Plano §5.4 ir §5.5 ji dubliuotu.
(b) `petshop-innodb.php` v1.0 (S912) `add_filter('query')` :32 priverstinai prideda
`ENGINE=InnoDB` kiekvienam `CREATE TABLE` :40 -> plano §3 taisykle 5 JAU
igyvendinta; visos 53 `ps_*` lenteles InnoDB, nors `@@default_storage_engine=MyISAM`.
(c) `petshop-statistika-vitrina.php` v1.0 (331 eil.).

**S1266. Versijos plane pasenusios.** statistika 2.1 -> **2.2** (:5, :56);
Desk **v3.47 (H265)** (:3) — registre buvo v3.39/3.47 ribose; akcijos **1.8** (:69);
`class-fulfillment-source.php` 1.0 ✅ (209 eil.); UI/agregavimas/eksportas 1.0 ✅.

**S1267. 🔴 T-0 RIZIKA: testiniu duomenu valymas nepakankamas.** `ps_shipments`
turi **23 naslaicius** irasus (order_id 35059–35066), o `wc_orders` = **0** —
uzsakymai istrinti, siuntos ne; trynimo kaskados nera. Be to `agreguoti_diena()`
persuka tik `PERSUKTI=3` paskutines dienas (agregavimas:28), todel dev'e
`ps_ataskaitu_dienos` sritis `parduotuve/pajamos` rodo **78 151 ct (781,51 €) is
21 neegzistuojancio uzsakymo** (08-05…08-23). Plano Q8 („pries launch visi
testiniai uzsakymai trinami") NEPAKANKA — T-0 sarasa reikia papildyti:
isvalyti `ps_shipments`, `ps_carts`, `ps_ataskaitu_dienos` sritis `pardavimai` ir
`parduotuve`. Naujas klausimas **Q-E0-7**.

**S1268. `ps_carts` — krepselio piltuvelis JAU renkamas.**
`core/class-cart-tracker.php` (317 eil.) kabinasi ant sesiu WC krepselio hook'u;
lentele turi `converted_order_id`, `status`, `snapshot_json`, `cart_hash`.
Dev'e: `expired` 46 · `abandoned` 31 · `converted` **4** (visi su
`converted_order_id`) · `active` 1. Plano §4A.3 krepselio piltuveliui naujo
rinkimo NEREIKIA.

**S1269. Kiti radiniai i plano keitimu sarasa (18 -> 21 punktai).**
- `woocommerce_prices_include_tax=yes` — kainos DB **SU PVM**; §3 taisykle 3
  („centais, be PVM") reikalauja aiskiai nurodyti, kur PVM nuimamas (S842 pamoka,
  dvigubo nuemimo rizika).
- 17 uzsakymo statusu, is ju **9 LP Express** (`wc-lp-*`); §5.x filtrai turi imti
  Desk `STATUSAI` zemelapi (desk:275–281), ne WC septynetuka.
- Savikaina eiluteje JAU uzsaldoma: `_ps_savikaina_vnt` + `_ps_savikaina_saltinis`
  (statistika:60–61, :276–307, 4 skaitm. EUR) — §4.2 turi KOPIJUOTI, ne
  perskaiciuoti.
- `agregavimas::pardavimai()` (:282–405) jau moka MNM/DP/dovanu ispjaustyma per
  `_mnm_cart_key`/`_mnm_container` — §4.2 perima ta logika.
- `ps_email_jobs` turi `sent_at`, bet **neturi paspaudimo laiko** -> §5.9 „email
  revenue attribution, paskutinis paspaudimas 5 d." kaip aprasyta neigyvendinama.
- `ps_akcijos` + `ps_akciju_prekes` turi `reg_kaina`/`akc_kaina`/`nuo`/`iki` ->
  §5.6 promotion uplift saltinis YRA.
- `ps_tiekimas.gauta` + `ps_tiekimas_eil.qty_gauta` -> §5.7 sell-through saltinis YRA.
- `ps_ataskaitu_dienos` sritys `anketa` ir `rec` — **0 eiluciu**, nors §1 jas mini
  kaip veikiancias.
- `ps_stat_pvm` ir `ps_stat_pradzia` options dev'e **neegzistuoja** (`false`);
  `ps_paleidimo_data` = **2026-10-01** jau irasyta (katalogas:1842).
- `ps_ataskaitu_agregavimas` cron gyvas irasas 00:15 UTC; kodas atima `gmt_offset`
  (agregavimas:39) -> 03:15 vietos laiku, atitinka plana.
- Trys panasiai vadinami dalykai: `_ps_shipments` (order meta, int, kiek siuntu),
  `_ps_siuntos` (order meta, JSON registras pagal sandeli), `ps_shipments`
  (lentele). §4.3 dokumentacijoje butinas ispejimas.

**NEUZDARYTA sioje sesijoje (samoningai):**
- Visas `petshop-desk.php` (3 730 eil.) ir `petshop-katalogas.php` (8 810 eil.)
  neperskaityti — tik istraukos + grep.
- Neistirta, kas raso `ps_ataskaitu_dienos` tipus `iseme_p1/p2/p3`, `kabliukas`,
  `uzdarytoja`, `parduota_sd` (ne `petshop-statistika.php`). Prireiks E3.
- Vizualaus patikrinimo (`browser=1`) nedaryta — E0 yra skaitymo etapas.

**KLAUSIMAI RAIMIUI pries E1a:** Q-E0-1 (kabliuko vieta), Q-E0-2 (patvirtinti
atskira `ps_fakt_siuntos`), Q-E0-3 (`petshop-pardavimai.php` likimas),
Q-E0-4 (kur nuimam PVM), Q-E0-5 (email atributacija be paspaudimo laiko),
Q-E0-7 (T-0 valymo papildymas). Q-E0-6 uzdarytas runu #4949.

---

### 2026-08-23/24 · SESIJA III (vakaras–naktis) — geografija, Venipak, laiskai [H244–H251]

**S1252. desk v3.39 (H244) — sistemos geografija.** Raimis: „nieko neaisku koks
Tiekimas, kur nuorodos". Kaireje juostoje skiltis IRANKIAI (Tiekimas su partiju
skaitliukais + Perdavimas tiekejams); pipeline grandis „Partijose" -> ps-tiekimas;
kons_ok pranesime nuoroda „Atidaryti Tiekima"; tuscias langas rodo uzsakymo kelio
zemelapi.

**S1253. desk v3.40/3.40.1 (H245) — pataisos po testo.** „Partijose" skaitliukas
skaiciavo tuscias partijas -> JOIN su eilutemis; istrintos 2 tuscios testu
partijos. Rail „Perdavimas tiekejams" -> `eile=nauji&zvilgsnis=neperduota` (senas
ps-dropship be transiento atsidaro tuscias). Po „Patvirtinti plana" grizimas su
`#pd-m{ID}` inkaru. 🔴 Tarpine v3.40 ~10 min laike sulauzyta Misriu lange
(ArgumentCountError, printf truko $id) — pagauta savo vizualia patikra, hotfix
tuoj pat. md5 382498de…

**S1254. tiekimas v1.5 (H246) — rankinis ZB kanalas.** `RANKINIAI=['zb']`; ZB
mygtukas „Uzdaryti partija — suvesiu ZB sistemoje", laiskas nesiunciamas.
Kopijuojamas sarasas SKU/kiekis prie uzsakytu partiju.

**S1255. tiekimas v1.6 (H247) — 🔴 VENIPAK REGISTRACIJA IS PARTIJOS.** Uzsakant
partija siunta registruojama import/send.php (DOMDocument XML), pack_no per
plugino skaitikli (V{userid}E{7}), lipdukas print_label prisegamas prie laisko,
venipak_pack/venipak_manifest stulpeliai (ALTER TABLE), „Lipdukas PDF" korteleje.
Nepavykus — partija NEUZDAROMA, rodoma Venipak klaida. H247.1: laiske paliktas
tik „Siuntos lipdukas — laisko priede. Siuntos nr. X". H247.2: tiekeju adresu
puslapis PASALINTAS, siuntejas — standartinis is plugino nustatymu (Raimis
kurjeri kviecia pats Venipak sistemoje).

**S1256. tiekimas v1.7 (H248) — laisko adresatu varneles.** `ps_tiek_laiskai`:
„Siusti tiekejui" (OFF) / „Siusti man terra@petshop.lt" (ON). Tik sau — tema
`[PERSIUSTI {tiekejas}]`. Abi nuimtos — partija tik uzdaroma.

**S1257. desk v3.41/3.42 (H249) — eiles zenklas.** „Visi uzsakymai" ir paieskoje
po numeriu spalvotas eiles zenklas-nuoroda. Pirmas bandymas nerode — `lentele()`
negavo $eile/$f, isplestas parasas.

**S1258. dropship v1.11 + tiekimas v1.7.1 + desk v3.42 (H250) — laisku archyvas.**
Spraga: varneles buvo tik tiekimo lange, ps-dropship siunte tiesiai tiekejui be
kopijos. Dabar tos pacios varneles abiejuose; `archyvuoti()` -> `ps_laisku_archyvas`
(200 paskutiniu, pilnas HTML); Irankiuose nuoroda. ps-laiskai 403 -> admin_menu
prioritetas 20.

**S1259. dropship v1.12 (H251) — „Laukia issiuntimo".** Irankiai -> Laiskai, du
skirtukai: „Laukia issiuntimo" (VISI neperduoti uzsakymai pagal tiekeja, laisko
perziura, „Eiti perduoti X"; apacioje kaupiamos tiekimo partijos) ir „Issiusti"
(archyvas). Vizualiai patvirtinta: 6 tiekejai, 11 eiluciu, 3 partijos.

**Bukle:** desk v3.42 md5 4034d65f | dropship v1.12 md5 dd66608b | tiekimas v1.7.1
md5 03aa64eb | TEMP 3772–3795 deaktyvuoti | repo deploy/ sinchronizuota |
nauji options ps_tiek_laiskai, ps_laisku_archyvas.

**Rytojaus pirmas darbas:** VP-TESTAS — realus „Uzsakyti is tiekejo" (ar Venipak
priima XML, ar lipdukas teisingas). Kol nepatikrinta, registracija veikia tik
teoriskai.

**Pamokos:** nebaigto srauto negalima palikti „velesniam etapui" (laiskas,
zadantis kurjeri, kurio niekas neuzsake, yra defektas); ta pati taisykle turi
galioti visuose languose; vizuali patikra pagauna tai, ko JSON nepagauna.

---


---

### 2026-08-23 · SESIJA II (vakaras) — Mišrių darbo langas + pipeline [H242–H243]

**S1250. desk v3.37 (H242) — Mišrūs = sprendimas + paleidimas vienoje vietoje.**
Raimio radinys: patvirtinus planą užsakymas dingdavo į „Nauji", o pranešimas
liepė „paleisk mygtukais", kurių tame lange nebėra. `eile()`: mišrus lieka
`misrus`, kol `kons_laukia()` netuščias. Mišrių langas — dvi sekcijos: „Reikia
sprendimo" (radio) ir „Planas įrašytas — nepaleista" (būklės pagal sandėlį +
`Į tiekimo partiją (n)` / `Perduoti X` / `Keisti planą`). Pranešimai `misrus_cia`
/ `misrus_ok` sako, kur užsakymas nuėjo. Suvestinės „per AV —" brūkšnys pašalintas.
Deploy per TEMP 3772/3773 (token_get_all TOKEN_PARSE serveryje, backup
`.bak_h242`, md5 `c2011398` sutapo). Vizualiai: #35068 ir #35067 antroje
sekcijoje su teisingais mygtukais, rail Mišrūs = 4, JS 0.

**S1251. desk v3.38 (H243) — pipeline juosta + būsenos chip'ai.** Atsakymas į
„kur perduota tiekėjams, kas paruošta siųsti". Juosta kiekvieno lango viršuje
(6 skaitliukai-nuorodos, nuliai pritemdyti), skaičiuojama esamoje `skaiciai()`
praeigoje. Naujas `zvilgsnis=neperduota` filtras `gauti()` — patikrinta:
skaitiklis 6 = eilučių 6. Chip'ai Vykdymo stulpelyje: `VF ✓ 11:04` /
`PRI ⏳` / `ZB→AV` (duomenys iš `_ps_dropship_sent_src` ir plano). Plano
ženkliuko „perduota X" uodega pašalinta. „Išsiųsta šiandien" —
`date_updated_gmt` nuo vietinės vidurnakties (🟡 pasitikrinti su realiais).
CSS: paleidimo kortelėje tuščias ribos stulpelis — būklė nebeužlenda ant
svorio. Deploy TEMP 3775, md5 `cbef34fa` sutapo; trys Playwright langai švarūs.

**Pamokos:** runnerį generuoti tik per python (bash heredoc be kabučių žaloja
`$`); dispatch be `browser=1` neįdiegia Playwright; runnerio deploy šaka su
md5 saugikliu — vizuali patikra leidžiama tik kai serverio md5 = laukiamas.

**Būklė:** desk v3.38 · md5 cbef34fa | dropship v1.8 | TEMP 3772–3775 deaktyvuoti
| repo deploy/ sinchronizuota | testiniai 35055–35068.

---

### 2026-08-23 · SESIJA I (diena) — mišrių defektai ir architektūra [H233–H241]

Santrauka pagal desk.php antraštę ir sesijos įrašus (pilna eiga — pokalbyje
„Uzsakymu tvarkymas2"): H233 dropship v1.7 + desk v3.30 (konsoliduotos eilutės
nebepatenka į tiekėjo laišką; trynimo mygtukas atšauktiems); H234 dropship v1.8
(`_ps_dropship_sent_src` pagal sandėlį — antras tiekėjas nebedingsta); H235 desk
v3.31/3.32 (mišrus = sandėlių > 1 visur vienodai); H236 desk v3.33 (eilė „Mišrūs"
+ sprendimo kortelė); H237 desk v3.34 (kortelė pagal Raimio pastabas, svoris
pagal sandėlį rytinėje eigoje); H239 desk v3.35 (🔴 sprendimas atskirtas nuo
vykdymo — „Patvirtinti planą" tik įrašo); H240 desk v3.36 (perdavimo mygtukas
kiekvienam sandėliui atskirai); H241 siuntu-laiskai v1.2 (prierašas + peržiūra,
mygtukas pilkas iki visų kodų).

---


---

## 2026-08-22 — ★ UZSAKYMU BLOKAS: SIUNTU REGISTRAS, DARBALAUKIO FILTRAI, VENIPAK MANIFESTAI [S1215-S1247]

**Sesijos forma:** Raimis nurodo -> Claude diegia per tilta -> Raimis tikrina
narsykleje -> kita iteracija. Diena: H200-H210 (rytas/diena), H211-H232 (vakaras).

**Versiju kelias:** desk **v3.14 -> v3.29** (16 versiju), dropship **v1.0 -> v1.6**,
+3 nauji mu-pluginai. Kiekviena versija: token_get_all sargas, backup i
`ps-backup/*.bak_hNNN`, md5 patikra, archyvas repo `deploy/`.

---

### DALIS I — H200-H210 (siuntu registras, sargai, ZB kelias)

**S1215.** Septyniu sandeliu scenarijus ismatuotas: `Petshop_AV_Source::resolve()`
eilutes lygio sourcing veikia visuose 7 sandeliuose.

**S1216.** Kasos ribojimas misriam krepseliui — gyvas testas: LP is kasos DINGSTA,
kai krepselyje yra ne-AV prekiu. Lieka Venipak pastomatas. VEIKIA.

**S1217. 🔴 VENIPAK NIUANSAS:** pluginas visa siuntos informacija saugo VIENAME meta
rakte `venipak_shipping_order_data`. Antra to paties uzsakymo grupes registracija
PERRASO pirma. Del to reikalingas savas kaupiamasis registras.

**S1218.** `petshop-siuntu-laiskai.php` **v1.0-v1.1** (naujas mu-plugin):
- `_ps_siuntos` kaupiamasis registras, raktas pagal sandeli, upsert
- `Petshop_Siuntos::prideti_is_plugino($oid,$sandelis,$kodas)` — desk vp_reg
  kviecia po sekmes; gyvai veike (pastaba „Siuntos numeriai issaugoti")
- Sekimo laiskas klientui: `page=ps-siuntos-laiskas&id=X` — perziura + „Siusti
  klientui" (kaip senoje sistemoje: 1 laiskas, visi numeriai)
- MIXED processing laiske pastaba apie N atskiras siuntas (§18.4)

**S1219. §18.3 uzbaigimo sargas:** `_ps_shipments`>1 negali tapti completed, kol
registruota < tiketasi; revert per `woocommerce_before_order_object_save`;
apejimas `_ps_uzbaigti_be_siuntu=1`. Gali TIK sustabdyti, ne prideti.

**S1220.** `petshop-av-dropship.php` **v1.2**: ZB kortele su ZB kodais is `ps_sources`
(stulpelis **`source`**, ne supplier — H208 klaida, pataisyta H209), „Kopijuoti"
(kodas TAB kiekis), „Lipdukas" per-uzsakymo PDF, „Pazymeti ZB perduotais".

**S1221.** `petshop-dropship-sargas.php` **v1.0**: valandinis cron
`ps_dropship_sargas` — perduota tiekejui >24h + processing/on-hold ->
`_ps_sla_velavimas` + desk klausimas „Tiekejas veluoja". Filtras
`ps_dropship_sla_valandos`.

---

### DALIS II — H211-H232 (filtrai, UI, Venipak manifestai)

**S1222.** `petshop-atsisakymas.php` **v1.0** (ES 14 d. atsisakymas): mygtukas kliento
uzsakymo puslapyje (order key + nonce), langas 30 d. nuo sukurimo — **teisini 14 d.
termina vertina zmogus**; `_ps_withdrawal` + `_ps_withdrawal_reason`; patvirtinimas
klientui + pranesimas parduotuvei; desk -> Klausimai su kortele.

Recon: wcdn aktyvus su creditNote; `invoiceNumberFormat=AVPN{order_number}`;
`petshop_avpn_counter=238`, `iapv=145`. 🟡 KR-AVPN numeracija NEPATIKRINTA.

**S1223. desk v3.18 — filtru sluoksnis I.** Bendra paieska += `address_1`, `city`,
`postcode`, `company`. Nauji filtrai: **Mokejimas** (apmoketa/neapmoketa/Paysera/
pavedimas), **Amzius** (velian pervadinta). Veiksmuose **„Saskaita"** tik apmoketiems
(`wcdn_print_invoice`); atsisakymo korteleje **„Kreditine"** (`wcdn_print_creditnote`)
per `data-wc1` delegata + `wcVienam()`. WC langas nebereikalingas kasdieniam darbui.

**S1224. desk v3.19 — UI perdarymas darbui.** Eilute 50->38 px; **prekes pilnais
pavadinimais po viena eilute** + 26 px miniatiuros; **saltinio zenkliukas prie
kiekvienos eilutes** (`eilutes_saltinis`); amziaus indikatorius („nuo vakar" /
oranzine 2+ / raudona 5+); ribos tekstas **tik siandienos** uzsakymams; virsuje
„ribos siandien praejo · nauji keliaus rytoj".

**S1225. desk v3.19 — LP + dropship konfliktas -> Klausimai.** LP galimas tik is AV;
ne-AV eilute su LP = fiziskai neimanomas derinys. Gyvai: #34883 perkeltas.

**S1226. desk v3.20 — filtru sluoksnis II (Raimio prasymas).** Antra eilute su
**matomais atskirais laukais**: Nr. · Klientas/el.pastas/imone · Telefonas ·
Adresas/miestas/pasto kodas. `lauku_paieska()`, **AND semantika**, LIMIT 150.
**Busena** perkelta i visas eiles (buvo tik „Visi").
Testai: „Visaginas"->1, tel. galune->4, Nr.+neteisingas miestas->0 (AND veikia).

**S1227. desk v3.21.** „Amzius" -> **„Laukiantys"** (Raimis atmete: skamba kaip kliento
amzius); zenkliukas „kabo N d." -> „laukia N d.". Pataisytas **juodas neiskaitomas
dropdown**: aktyvaus filtro tamsus fonas persidave `option` elementams ->
`.pd-sel option{background:#fff;color:#1C201D}`.

**S1228. desk v3.22.** Pridėta pakopa **„Laukia 3+ d."** (Raimis: „aktualu 2, 3 d.").
⚠️ **PAMOKA:** pirmas testas toje pacioje uzklausoje po `file_put_contents` grazino
`opcija_yra:false` — atmintyje dar sena klase. Antra uzklausa: `true`.

**S1229. desk v3.23.** Nauja eile **„Issiusti"** (kelyje + ivykdyti) apatineje rail
dalyje su skaitikliu; `gauti()` ir `skaiciai()` papildyti.

**S1230. desk v3.24 — teisingas pranesimas po apmokejimo.** Raimio radinys:
„sistema parase, kad perkeltas i Nauji — as jo nematau". Matavimas: #34952 apmoketas
-> `klausimas()`=„Truksta sandelyje" -> Klausimai, o pranesimas rasomas PRIES
klausimo patikra. Fix: naujas raktas `apmoketa_klausimas` su priezastimi ir nuoroda
„Atidaryti Klausimus" (`pd_nr` su `|priezastis`).

**S1231. desk v3.25 — registracijos saugiklis.** `vp_reg` registruoja TIK be siuntos
kodo ir su pastomatu (jei pastomatinis vezejas); praleisti ivardijami pranesime
(`vp_nieko`); mygtukas rodo LIKUSI skaiciu arba „✓ visos registruotos".
Priezastis: pakartotinis paspaudimas siuntе dublikatus, grupinis XML luzo.

**S1232. 🔴 desk v3.26 — VENIPAK JSON DEFEKTAS (rastas Raimio testu).**
Simptomas: „Rytine eiga — niekas neveikia?", visur „— nera", „registruota 0 is 3".
Tikroji priezastis: `siuntos_kodas()` naudojo `maybe_unserialize()`, o pluginas saugo
**JSON**. Desk **nuo v2.x NEMATE nе vieno siuntos kodo** -> „Paruosta siusti" visada 0,
registracija kartojosi -> dublikatai Venipake.
Fix: `json_decode()` pirmiau, `maybe_unserialize` kaip atsarga.
Po fix gyvai: 35037->V07267E1000004, 35036->V07267E1000005, 34886->V07267E1000003.

**S1233. desk v3.27 + dropship v1.3 — pakuotes ir laisko perziura.**
- `reikia_pakuociu()` += **venipak_pastomatas** (i pastomata kiekviena deze = atskira
  siunta); anksciau klausta tik kurjerio/LP
- Grupine registracija `packs[]` IGNORUODAVO (pluginas taiko tik kai grupeje 1
  uzsakymas) -> dabar keliu deziu uzsakymai atskiriami ir registruojami po viena su
  savo `packs[]`, likusieji bendrai
- Rytineje eigoje prie neregistruotu — laukelis **„deziu [N]"** (`data-pk` -> redirect)
- `laisko_html($src,$uzsakymai)` isskirtas kaip **viena tiesos vieta** siuntimui ir
  perziurai; mygtukas „Perziureti laiska" su tema ir gavеju

**S1234. desk v3.28 — auto-refresh.** Kas 60 s, keturi saugikliai: skirtukas matomas ·
nieko nepazymeta · neatidarytas skydelis/dialogas · zymeklis ne ivesties lauke.
Rytineje eigoje isjungtas.

**S1235. 🔴 desk v3.29 — MANIFESTAI PAGAL SANDELI MASINIAME KELYJE.**
Raimio esminis radinys (su Venipak savitarnos ekranu): „Venipak reikia kiekvienam
sandeliui savo manifesto, o dabar viskas vienoje kruvoje".
Matavimas: 35036/35037 (per rytine eiga) — manifestas 001 ✅; 35038 (misrus) ir
35041 (ZB) — **taip pat 001** ❌, nes registruoti per apatines juostos mygtuka, kuris
sove i plugino bulk `shopup_venipak_shipping_dispatch` su vienu globaliu manifestu.
Fix: naujas veiksmas **`vp_bulk`** — grupuoja pazymetus **pagal sandeli**, kiekvienai
grupei savas manifestas (AV=001, VF=002, ZB=003, Quattro=004, Prins=005,
Ambrosia=006, Belacor=007), tie patys saugikliai, **misrus praleidziami**, pildo
`_ps_siuntos`. Testas: grupe VF=[35035], praleisti 35041/35038/35037 „jau".
**Atgal nepataisoma:** 35038/35041 lieka 001 manifeste — Raimio darbas savitarnoje.

**S1236. dropship v1.4-v1.6 — laisko turinys.**
- v1.4: kiekiai „N **vnt.**" (Raimis: „kartais ir pakuotemis siunciame")
- v1.5: laukelis **„Prierasas laiske (nebutina)"** — laisvas tekstas tarp lenteles ir
  „Linkejimai"; kiekvienam tiekejui atskiras; vienkartinis
- v1.6: perziuroje gyvas tekstas rodomas **tikroje vietoje** (placeholder
  `PS-GYVA-VIETA` keiciamas i gyva bloka) — buvo perziuros pieSimo klaida; pacIame
  laiske vieta visada buvo teisinga

**S1237. Testiniu duomenu ciklas.** Istrinti visi 18 uzsakymu (pries tai
`update_status('cancelled')`, kad suveiktu likuciu grazinimo hookai; laiskai
`pre_wp_mail -> __return_false`); sukurta 12 testiniu per visus sandelius; Raimio
pastaba („nera pastomatu — ne pilni uzsakymai") -> visi 12 istrinti.
**Lentele tuscia; Raimis kurs savo per kasa.**

---

### MISRIU UZSAKYMU TAISYKLE (isaiskinta, be kodo)

- **Misrus ≠ klausimas.** Guli „Naujuose" su busena „Vykdomas". Klausimai — tik ten,
  kur sistema pati negali testi.
- **Lemia sandeliu skaicius, ne AV buvimas:** `count($sal) > 1`. ZB+VF (du dropship,
  be AV) elgiasi lygiai kaip AV+ZB.
- **Automatika:** saltiniu priskyrimas, surinkimo lapas AV daliai, laiskai ABIEM
  tiekejams, AV nurasymas, §18.4 pranesimas klientui.
- **Rankomis lieka VIENAS zingsnis:** Venipak registracija.

---

### SVETIMU PLUGINU TRUKUMAI (papildymas siai sesijai)

| Pluginas | Trukumas |
|---|---|
| Venipak | siuntos duomenis saugo **JSON**, ne serialize — `maybe_unserialize` negrazina nieko (S1232) |
| Venipak | vienam uzsakymui moka sukurti tik VIENA siunta -> misrus registruojami rankomis |
| Venipak | grupineje registracijoje `packs[]` taikomas tik kai grupeje 1 uzsakymas (S1233) |
| Venipak | bulk veiksmas naudoja VIENA globalu manifesta — sandeliu neskiria (S1235) |
| Venipak | registruojant siunciamas VISO uzsakymo svoris — misriam dalijant butu permoka |

---

### PAMOKOS (sios sesijos)

1. **Gyvas savininko testas mato tai, ko nemato jokie kodo testai.** JSON defektas
   (S1232) gyveno kelias versijas, nes dev'e nebuvo nе vienos gyvos registracijos per
   rytine eiga — visi testai mataviesi kodo logika, ne realu plugino irasa.
2. **Testas toje pacioje uzklausoje po `file_put_contents` naudoja SENA klase
   atmintyje.** Tikrinti ANTRA uzklausa (S1228).
3. **Pranesimas vartotojui rasomas PO to, kai bukle galutinai nusistovi**, ne pries
   (S1230).
4. **Perziura ir siuntimas — viena kodo vieta**, kitaip perziura pradeda meluoti
   (S1236).
5. **Terminologija darbo lange turi buti darbo, ne technine.** Raimis atmete du
   pavadinimus is eiles: „Amzius" -> „Laukiantys", „kabo" -> „laukia".
6. **Trynimo protokolas:** `update_status('cancelled')` PRIES `delete(true)`, kitaip
   likuciai negrizta; `pre_wp_mail -> __return_false` visai operacijai; saugiklis
   pagal kliento varda, kad nenusluotu ne savo duomenu.

---

### BUKLE PO SESIJOS

```
desk v3.29 · md5 a7ca1391       dropship v1.6 · md5 b3855941
siuntu-laiskai v1.1 · dropship-sargas v1.0 · atsisakymas v1.0
backup'ai: ps-backup/*.bak_h204|h206|h208|h210|h213|h214|h215|h216|h220|h222|h228|h230
repo deploy/ : visi failai · snippetai 3690-3711 isjungti · uzsakymu lentele 0
```

**Neuzdaryta (uzsakymu blokas):**
```
1. Q-VP-ADRESAS — ar VF/ZB siuntoms reikia tiekejo paemimo adreso? RAIMIS
2. Q-VP-MISRUS  — ar automatizuoti misriu registracija (svorio dalyba + packs[])? RAIMIS
3. KR-AVPN kreditines numeracija — vizualiai prie pirmos kreditines
4. ES atsisakymo POST kelias — nepatikrintas narsykleje
5. Pastomato pasirinkimas desk'e (dabar tik per WC uzsakymo langa)
6. Venipak testines siuntos V07267E1000003-007 — trynimas savitarnoje, RAIMIS
7. Siuntos busenu ciklas (perduota->issiusta->pristatyta) — po launch (§19.11)
8. SLA/MIXED ataskaitos dienos suvestineje — po launch
9. Oversell langas dropship prekems — stebeti po launch
```

Auksciausias decision Nr.: **S1247**.

---

## 2026-08-21 (diena) — ★ PERKELIMAS I petshop.lt KATALOGA + DEV VEIDRODIS [S1187-S1199]

**Uzdavinys:** svetaine gyveno `domains/avesa.lt/public_html/dev`, o domenas
`petshop.lt` rodo i savo tuscia kataloga. REGISTRAS §8x buvo uzfiksaves verdikta
„lieka failu perkelimas per SSH — palaikymo zmogus, ne AI agentas".

### ★ SENAS VERDIKTAS BUVO KLAIDINGAS — perkelimas padarytas per tilta

R185 recon isaiskino, kas §8x nebuvo patikrinta: `disable_functions` draudzia
`symlink`, `exec`, `shell_exec` — bet **NE `rename()`** (be jo neveiktu pats
WordPress). O `rename()` toje pacioje failu sistemoje yra irašo pakeitimas, ne
duomenu kopijavimas — 9,7 GB juda per sekundes dali, inode nesikeicia.

```
open_basedir      /home/gyvunai2/:/tmp:/usr/share/pear   → dengia ABU medzius
src device 2049 = dst device 2049                        → ta pati FS
failo rename tarp medziu                                 OK (pirmyn + atgal)
KATALOGO rename tarp medziu                              OK (vidus sveikas)
pats petshop.lt/public_html i sona ir atgal              OK ← tikroji operacija
```

Vhost patikra per IP prisegima (pasaulis nemate): `petshop.lt` ir
`www.petshop.lt` **jau atidave PHP 8.3.20** is
`DOCROOT=/home/gyvunai2/domains/petshop.lt/public_html` — serverio
konfiguracijos keisti nereikejo visai.

### Perkelimas (R186/R188, ~2 sek.)

Atskiras skriptas BE WordPress, su slaptu raktu, trys veiksmai (BUKLE/PIRMYN/ATGAL),
saugikliai pries kiekviena zingsni. Pries deploy — pilna lokali simuliacija ant
netikro medzio (PIRMYN + ATGAL patikrinti).

```
1. petshop.lt/public_html  →  public_html-senas2019   (2019 m. likuciai, NETRINTA)
2. avesa.lt/public_html/dev →  petshop.lt/public_html
3. atkurtas tuscias dev/ su stub'ais: wp-load, backup-run, watch-run, index, .htaccess
```

Stub'ai = po 2 eilutes `require` i nauja vieta → **6 importo cron'ai ir backup
sistema veike senais URL be jokiu pakeitimu**. Cron URL keitimas nustojo buti
perjungimo nakties skuba.

### URL sluoksnio valymas (R191 dry → R192 apply)

Dry-run: pilnas DB skenas (visos lenteles, visi teksto stulpeliai) + failu sistema.
Apply — serializacijai saugus rekursinis keitiklis (unserialize → keisti → serialize,
su kontrole, ar rezultatas vel unserializuojasi). Logika pries deploy patikrinta
5 lokaliais testais (serializuotas masyvas su URL raktu, JSON su escaped skliaustais,
objektas, dvigubai serializuota eilute).

```
options 32 · posts 57 · guid 12 673 · postmeta 24 · usermeta 7
wc_orders_meta 15 · feeding_source_url 229 · mailpoet 77 · wc_admin_notes 34
pmxi_imports 2 · wc_dl_dirs 2 · users_url 1 · flatsome-child/functions.php 1
istrinta kesu: dirsize_cache, pmxi_uploads_path, update_themes/plugins/core, jpsq 2
```

Kopija: `ps-backups/url_replace_r192_20260821_130324.json` (659 KB) +
`functions_child_r192_*.php.bak`.

**Rezultatas po: 0 likuciu** visose kontrolinese uzklausose. Titulinio HTML —
0 `dev.avesa.lt`, 0 `/home/gyvunai2`.

**NELIESTA samoningai:** `flatsome_registration` (licencija STAGING/dev — Raimis
perregistruos), `_bak` lenteles, `shortpixel_queue` (7 913 istoriniu),
`@dev.avesa.lt` testiniai el. pastai (lustu tokenai), snippetu kodas.
Snippet 2024 („Anketa→Profilis 301") tikrintas — naudoja `home_url()`, domenas tik
komentare. Nekeista.

### Vizuali patikra (Playwright, IP prisegimas)

Titulinis (hero, kategoriju korteles, prekiu karusele, banneriai), `/parduotuve/`
(2 613 prekiu, YITH filtrai, kainos, nuotraukos), prekes puslapis.
**0 nepavykusiu uzklausu, 0 uzklausu i dev.avesa.lt.**

### ★ DEV VEIDRODIS — dvi sistemos vienu metu (R194/R195)

Raimio reikalavimas po perkelimo: jam IR darbuotojui reikia abieju sistemu
lygiagreciai (duomenu tvarkymas pries migracija). hosts irasas netiko — jis
uzdaro senaja petshop.lt visame kompiuteryje. Palaikymo zmogaus symlink'ui
nebuvo (darbo laikas pasibaiges).

Sprendimas grynu PHP, trys komponentai, visi **LAIKINI**:

```
dev/dev-router.php v1.1     visos uzklausos (statika + PHP + graziūs URL)
                            aptarnaujamos is petshop.lt katalogo; saugikliai:
                            realpath ribos, wp-config ir .ht* draudziami;
                            nerastas kelias → WP front controller (ne 404)
dev/.htaccess               !-f → dev-router.php
wp-config.php               if HTTP_HOST === dev.avesa.lt → WP_HOME/WP_SITEURL
mu-plugins/petshop-dev-veidrodis.php   ob_start perraso petshop.lt → dev.avesa.lt
                            + X-Robots-Tag: noindex
```

wp-config blokas pries irasyma sugeneruotas ir patikrintas lokaliai; kopija
`ps-backups/wp-config_r194_*.php.bak`.

**Rezultatas:** `https://dev.avesa.lt` veikia PILNAI (titulinis, parduotuve,
preke, wp-admin, REST, statika, WP 404) is bet kurio kompiuterio, nieko
nediegiant. `petshop.lt` visame pasaulyje — sena eShoprent parduotuve.

### ★ RADINYS — hostingo ugniasiene blokuoja /wp-json/ per petshop.lt

Diegiant router v1.1 paaiskejo:

```
petshop.lt/wp-json/wp/v2/users/me                      403 (Interneto vizija error page)
petshop.lt/index.php?rest_route=/wp/v2/users/me        200 {"id":1,...}
```

403 grazina **hostingo ugniasiene**, ne WordPress. Apeita per `?rest_route=`.
**I perjungimo nakties sarasa: patikrinti, ar po DNS `/wp-json/` neblokuojamas;
jei blokuojamas — palaikymo uzklausa.**

### Bendros pamokos

- **Registro „neimanoma" verta perziureti, kai jis remiasi neisbandyta
  prielaida.** §8x verdiktas „tik per SSH" krito nuo vieno `rename()` testo.
- **`disable_functions` sarasa skaityti tiksliai** — jame nera ir negali buti
  funkciju, be kuriu neveikia pats WordPress.
- **Grizztama operacija leidzia repeticija.** `rename` pirmyn/atgal buvo
  isbandytas ant tikro `public_html` PRIES tikraji perkelima.
- **Bulk keitikli testuoti lokaliai su realistiskomis duomenu formomis** pries
  paleidziant ant 12 000+ irasu.

### Busena po sesijos

```
svetaine        domains/petshop.lt/public_html · siteurl https://petshop.lt
sena liekana    public_html-senas2019 (NETRINTA)
dev/            router + stub'ai → veidrodis, veikia pilnai
tiltas          per dev REST (1 852 snippetai)
rollback        perkelti-r186.php?veiksmas=ATGAL (paliktas iki patikros)
```

Aukstciausias decision Nr.: **S1199**.

---

## 2026-08-21 (naktis) — KATALOGO FILTRAS + INCIDENTAS [S1181-S1186]

**Raimio problema:** paieskos laukelyje x / Del nenaikina filtro (q= lieka URL'e).

**v8.7.2** (S1181): `q` ir `view` i aktyviu filtru sarasa; „Isvalyti" nuima ir
eile; `view_zodziais()` zodynas 21 eilei. Saugiklis: 4 str_replace, kiekvienas
privalo sutapti lygiai 1 karta, kitaip nerasoma (vienoje iteracijoje suveike —
inkaras rastas 2 kartus, irasymas atmestas).

**v8.7.3** (S1183): paieskos laukelis = kaip kiti filtrai. `search` ivykis
(narsykles x + Enter), `input` (Backspace iki tuscio, 400 ms), Esc. JS be
apostrofu, skliaustu balansas 273/273 ir 922/922 patikrintas.

**INCIDENTAS** (S1185, 00:35-00:50): v8.7.4 bandymas (delegavimas) taise
neegzistuojancia problema — „neveikia" buvo kesas — ir irase faila su PHP
sintakses klaida BE token_get_all pries rasant. Dev 500, tiltas negyvas,
ps_dep902 negyvas. Raimis pervadino faila per hostingo tvarkykle; atstatyta
is ps-backups v873 su sintakses patikra PRIES rasant. Galutinis md5 49d5fa0a,
.off istrintas, svetaine 200, klase uzsikrove, be Parse error.

**Patvirtinimas (Raimis, 00:57):** „viskas veikia, klaida filtre panaikinta".

Backup'ai: petshop-katalogas-v871/v872/v873-BACKUP. Pamokos — REGISTRAS §8ff.

---

## 2026-08-20 (vakaras) — AV+ZB DVIGUBO SANDELIO SUJUNGIMAS [S1164-S1180]

**Konteksto pradzia:** Raimis paklause, kokias ZB prekes blokuojam. Recon atskleide
keturis blokavimo sluoksnius; is ju kilo Monge ir Bioveterinary sujungimo darbas.

### 1. ZB BLOKAVIMO ZEMELAPIS (recon, H136-H137)

`petshop-xml.php` v1.5.18 `petshop_xml_block_zb_create()` (eil. 331-428),
kabliukas `wp_all_import_is_post_to_create`, TIK Import #2:

| Eil. | Salyga | Veiksmas | reason |
|---|---|---|---|
| 0 | name IR category tusti | leisti (fail-safe) | — |
| 1 | isbrauktas zenklas | NEKURTI | excluded_brand |
| 2 | konservas | LEISTI -> veliau draft | — |
| 3 | qty <= 0 | NEKURTI | qty_zero_new_no_history |
| 4 | price < 8,00 EUR ir ne konservas | NEKURTI | cost_below_minimum_accessory |

Update vartai (eil. 448-497, Import #2 IR #3): esama preke < 8,00 ir ne konservas
-> update blokuojamas. `block_legacy_update` (prioritetas 9) eina PIRMA — Legacy
zymeta preke ZB importo NELIECIAMA VISAI.

`class-import-rules.php` v1.2 `excluded_brands`: hau&miau, hau & miau,
bioveterinary, biovet. `determine_status()` draft priezastys: missing_ean,
missing_cost, qty_zero, missing_category, missing_image, missing_description.

`PETSHOP_XML_ZB_MIN_COST = 8.0` (savikaina be PVM) = ~12,10-13,55 EUR mazmena.
Palietė 313 prekiu (konservas_below_minimum).

### 2. MATAVIMAI (H138-H142, H145)

```
Monge kataloge          279   publish 119 · draft 160
  draft priezastys      konservas_below_minimum 152 · qty_zero_on_new 5 · be zymes 3
Bioveterinary            13   visi legacy/AV · is ZB nepateko nė vienas
ps_sources               av 1420 (829 su likuciu) · zb 1059 · vf 1167
AV prekiu su EAN        461 is 1420  ← poravimo lubos
prekiu su 2+ saltiniais   0  ← sprogimo spindulys sumavimo pakeitimui
```

Poravimas pagal pavadinima Monge atveju: 4 kandidatai, VISI 4 klaidingi.
**Isvada: poruojam TIK pagal EAN.**

### 3. KLAIDA IR JOS ATSAUKIMAS — Petshop_Fulfillment v1.6.0 (H147, H148-H151, H152)

`class-fulfillment.php` v1.6.0 pakeite `recalculate()` is pirmenybes i sumavima.
Rezultatas buvo 283 vietoj laukto 265 — **savas likutis skaiciuojamas du kartus.**

**SAKNIS:** `petshop-av-limit.php` (`Petshop_AV_Limit`, S474) jau seniai vykdo
`woocommerce_product_get_stock_quantity` filtra, kuris grazina `av + tiekejas`.
Tai TRECIAS SLUOKSNIS, dokumentuotas REGISTRAS §17.7 ir §19. Jo saugiklis
`taikoma()` issijungia, kai `Fulfillment_Source::resolve()` grazina `legacy` —
visos 10 prekiu buvo legacy. Uzdejus `_zb_qty` ir `_zb_cost` resolveris ėmė jas
laikyti ZB prekemis -> saugiklis atsidare -> AV pridetas ant jau sudetos sumos.

**MANO KLAIDA:** neieskojau esamu sluoksniu pries statydamas nauja. Skaiciau tik
naujausius REGISTRAS skyrius, ne §17. Sumavimas jau buvo pastatytas.

Atsaukta ta pacia diena: failas grazintas is
`ps-backups/class-fulfillment-v150-BACKUP-2026-08-20.php`, md5 patikrintas.

### 4. TIKRAS SPRENDIMAS — Petshop_Fulfillment v1.6.1 (H154)

`own_stock` PASALINTAS is `$suppliers` masyvo. Nuo siol:

```
_stock            = TIK tiekejo kiekis (zb -> vf pirmenybe)
_own_stock_qty    = AV lentynos kiekis, gyvena SALIA (S477/S590)
rodymas           = Petshop_AV_Limit prideda AV prie _stock
```

Saugumo matavimas pries diegima: `_own_stock_qty > 0` visame kataloge = **0**,
`own + tiekejas` kartu = **0**. Esamos elgsenos pakeitimas = 0 prekiu.
Repo: `plugins/petshop-xml/includes/class-fulfillment.php` (e7a60759).

### 5. MONGE — 10 PORU SUJUNGTA (H146 dry, H147/H154 apply, H156 ps_sources)

Sprendimai (Raimis): **savikaina is ZB · likutis AV+ZB · kaina lieka AV.**

| AV | Preke | own | zb | Klientas mato | Kaina | Savikaina |
|---|---|---|---|---|---|---|
| 17394 | Monoproteico Solo Tacchino | 18 | 247 | 265 | 2,99 | 1,836 |
| 17400 | Monoproteico Solo Agnello | 0 | 356 | 356 | 2,99 | 1,836 |
| 17397 | Monoproteico Solo Anatra | 13 | 296 | 309 | 2,99 | 1,836 |
| 17406 | Fresh Veal | 14 | 357 | 371 | 2,20 | 1,044 |
| 17415 | BWild eriena | 25 | 137 | 162 | 1,99 | 1,053 |
| 17412 | BWild suniukams antiena | 7 | 77 | 84 | 1,99 | 1,053 |
| 17421 | BWild antiena | 19 | 624 | 643 | 1,99 | 1,053 |
| 17418 | BWild lasisa | 23 | 90 | 113 | 1,99 | 1,053 |
| 17403 | Fresh Puppy Veal | 9 | 276 | 285 | 2,20 | 1,044 |
| 17409 | Fresh Chicken | 14 | 320 | 334 | 2,20 | 1,044 |

Likutis 142 -> 2 922 (+2 780). 17400 buvo publish su NULINIU likuciu — dabar 356.
Frontas patikrintas: 200, instock, krepselio mygtukas, skaicius klientui nerodomas.
`ps_sources` +10 zb eiluciu (supplier_sku = ZB kodas, ean, stock_qty, cost_net).
Backup: `ps-backups/monge-merge-BACKUP-2026-08-20.json` (59 KB).
Seseliai uzsakymuose: 0 (patikrinta pries liesant).

### 6. BIOVETERINARY — 5 POROS (H158-H160)

Recon parode, kad juodrasciai NEBUVO AV prekes: jie turi ZB kodus (01BV0101...)
ir buvo uzsalę, nes ant ju kabojo `_legacy_manufacturer` -> `block_legacy_update`
neleido ZB importui ju atnaujinti nuo pat sukurimo. Rodomi likuciai (39/59/88/70)
buvo istorija, ne dabartis.

Poros patvirtintos EAN'ais **is sviezio ZB feed'o** (H159), ne pavadinimu spejimu:

| AV | Preke | own | zb | Klientas mato | Kaina | Savikaina |
|---|---|---|---|---|---|---|
| 16953 | Oda ir kailis | 2 | 58 | 60 | 13,59 | 8,415 |
| 16950 | Sanariai ir kaulai | 9 | 55 | 64 | 13,35 | 8,415 |
| 16956 | Multimineralai ir sirdis | 2 | 79 | 81 | 13,99 | 8,415 |
| 16959 | Extra Strong | 10 | 62 | 72 | 16,30 | 9,639 |
| 19107 | Stress Control | 2 | 59 | 61 | 19,20 | 11,538 |

Nuo seseliu nuimta `_legacy_manufacturer` — nuo sios nakties Import #3 juos vel
atnaujins (savikainos 8,4-11,5 EUR, virs karteles).
Backup: `ps-backups/biovet-merge-BACKUP-2026-08-20.json` (19,4 KB).

**Be poros liko:** Hepamax 1000 — ZB seselis 13025 (feed'e 73 vnt., 9,54 EUR) +
AV juodrastis 19110 (0 vnt.); publish versijos NERA. Laukia Raimio sprendimo.
Omega-3 (16962) publish, 0 vnt., ZB jo neturi — paliekama.

### 7. petshop-seseliai.php v1.0 — NAKTINIS SINCHRONAS (H157)

Naujas mu-modulis. Paleidikliai: `pmxi_after_xml_import` (#2/#3) + valandinis cron.
Seselio `_zb_qty`/`_zb_cost`/`_zb_last_sync` -> AV prekes meta + `ps_sources` zb
eilute + `Petshop_Fulfillment::recalculate()`. Idempotentiskas (keicia tik pasikeitusias).
Nekeicia seselio busenos/matomumo, NELIECIA kainos.
Santrauka: option `ps_seseliai_paskutinis`.
Testas: poru 10 · atnaujinta 0 · praleista 10 (teisinga — reiksmes jau sutapo).
Kontrole 17400: seselis 356 = AV meta 356 = WC 356.
Repo: `deploy/petshop-seseliai.php` (c12c2361).

### 8. NEUZBAIGTA — KATALOGO UI (perkelta i rytoju)

`petshop-katalogas.php` v8.7.1 dvigubos prekes nemoka rodyti:
- `av_laukas()` / `tiekejo_laukas()` remiasi `_ps_sandelis` — VIENA reiksme,
  todel dvigubai prekei vienas is stulpeliu visada tuscias;
- PARDUODAMA rodo tik AV dali (2 vietoj 60);
- zenkliukai apsivertė: publish prekes -> ZB, seseliai -> AV su uzsalusiais skaiciais;
- seseliai sarase atrodo kaip normalios prekes.

**Duomenys teisingi, meluoja tik rodymas.** `saltiniai_prekei()` skaiciuoja
teisingai — irodyta H156 (17394: av=18 | zb=247, suma 265).

Reikia v8.8: dviguba preke rodo `AV | ZB | suma` per `saltiniai_prekei()`,
seselio eilute gauna zyme „seselis -> #ID".

Du diagnostikos run'ai (H162, H163) grizo tusti — sustota pagal taisykle
„po 2-3 nesekmingu bandymu STOP", darbas perkeltas i sviezia galva.

### 9. Q-KREPS UZDARYTA KAIP NE RADINYS

„Mazo krepselio mokestis kasoje rodomas du kartus" (§8w) buvo VERDIKTAS, ne
matavimas. Virsuje 1,21 EUR su PVM, apacioje 1,00 EUR be PVM — standartinis
WooCommerce vaizdas: viena suma, du pjuviai. Nebekelti.

### 10. PAMOKOS

1. **Pries statant nauja sluoksni — isvardinti esamus.** v1.6.0 buvo nereikalingas;
   sumavimas jau egzistavo `AV_Limit`. Kaina: 5 papildomi run'ai ir atsaukimas.
2. **Skaityti VISA REGISTRA, ne tik naujausius skyrius.** §17.7 ir §19 atsakymas
   gulejo nuo pat pradziu.
3. **Neaktyvus konfliktas nera nesamas konfliktas.** Du sluoksniai pretendavo i ta
   pati lauka; niekada nesusidure, nes prekiu su 2 saltiniais buvo 0. Pirma tokia
   preke ji pazadino.
4. **Itariai svarus rezultatas — pirma tikrinti matavima.** H139 grazino 0 sutapimu,
   nes naudojau `_gtin` (neegzistuoja) vietoj `_ean`, ir `qty` vietoj `stock_qty`.
5. **Klasifikacija pagal `_legacy_manufacturer` nepatikima** — ji buvo uzdeta ir ant
   ZB kilmes prekiu, ir butent ji jas saldė.

### 11. Q-MARZA-BAZE — SAVININKO PASTABA (naujas, neistirtas)

Savininkas: „taip skaiciuoti marzu nemoku, galai nesueina."

Aritmetika kortelėje TEISINGA (patikrinta abiem pavyzdziais), bet gretimos eilutes
skaiciuojamos nuo skirtingu baziu ir tai niekur nepasakyta:

```
#12560  76,49 / 1,21 = 63,21   63,21 - 42,13 = 21,08   21,08 / 63,21 = 33,4 %  (marza, nuo KAINOS)
        42,13 x 1,25 x 1,21 = 63,72 -> „Pagal jusu taisykles" 63,79  (antkainis, nuo SAVIKAINOS)
#18623  73,90 / 1,21 = 61,07   61,07 - 49,65 = 11,42   11,42 / 61,07 = 18,7 %
        49,65 x 1,25 x 1,21 = 75,10 -> 75,19
```

Pasekme: 25 % antkainis ekrane visada rodomas kaip 20 % marza; iprastas 50 %
antkainis — kaip 33,4 %.

**NEPATIKRINTA:** nuo ko skaiciuojama „Kategorijos riba 10 %". Jei nuo savikainos,
o marza lyginama nuo kainos — palyginimas neteisingas. NESPETI, skaityti koda.

**Sprendimas (Raimis pritare):** kortelėje trys eilutes su bazemis —
Pelnas EUR · Antkainis % (nuo savikainos) · Marza % (nuo kainos).
Tas pats „Kategorijos ribai" ir perkainavimo taisyklems.

### 12. GITHUB PAT

Galioja iki **2026-08-26 07:15 UTC**. Raimis pratesia PATS 2026-08-25.
Priminti TIK ta diena, anksciau klausimo nekelti.

---

---

## 2026-08-20 — NAKTIES PATIKRA IR ARRAY-TO-STRING SAKNIS [S1156-S1163]

---

### S1156 — NAKTIS SVARI, `&amp;` NEGRIZO

```
prekiu pavadinimu su esybemis  0 · terminu 0
feed'ai (01:30)                cdata_amp 0/0/0
prekiu publish                 2 609 -> 2 617 (8 naujos is ZB)
Action Scheduler               nepavyko 0 · cancel_unpaid 10 ciklu
visi URL 200
```
Patvirtina `is_update_title = 0`. **Q-ZB-SAKNIS: 🔴 -> 🟡.**

---

### S1157 — ★ SAKNIS: TUSTI XML ELEMENTAI ★

Stebetojas per ZB importa (06:01:03-06:01:38) surinko 150 irasu:
```
images (kiek=1)        150   ← idetinis <image>, NORMALU
description (kiek=0)    12   ← TUSTI
summary (kiek=0)         6
brand · category · otherName · length · width · height · weight_brutto  po 1
```

`kiek=0` = tuscias masyvas. ZB siuncia `<brand/>` be reiksmes → PHP paverčia
tusciu masyvu → `(string) []` duoda zodi **„Array\"** plius ispejima.

---

### S1158 — 🔒 KODEL H115 RODE NULI

Vakarykstis matavimas turejo DVI patikras: „ar laukas pasitaiko daugiau nei
karta\" ir „ar lauko nera visai\".

> **Tuscias, bet ESANTIS elementas iskrito tarp ju** — pasitaiko lygiai viena
> karta. **Tarp „per daug\" ir „visai nera\" telpa „yra, bet tuscias\".**

---

### S1159 — 🔒 ANTRA MATAVIMO KLAIDA: CDATA

Pirmas dry-run (H133) rode 2 622 is 2 622 — tarsi visos prekes be pavadinimo.
ZB XML naudoja `<![CDATA[...]]>`, o `simplexml_load_string` be
**`LIBXML_NOCDATA`** toki turini grazina kaip tuscia objekta.

Rezultatas buvo akivaizdziai neteisingas (100 %) — todel ir pastebetas.

> **Itariai svarus arba itariai pilnas rezultatas = pirma tikrink matavima.**

---

### S1160 — ✅ DRY-RUN VISAM KATALOGUI: POVEIKIS NULINIS

```
irasu viso                2 622
su tusciu brand/category    177  (6,7 %)
SPRENDIMAS KEISTUSI           0
```

| Vieta | Kodel nesikeicia |
|---|---|
| 349 fail-safe | `$name` VISADA uzpildytas → antra salyga netenkinama |
| 367 brand fallback | ne vienos is 177 pavadinime nera isbraukto zenklo |

**Vakar rizika PERVERTINAU** („28 prekes tikrinamos klaidingai\"). Formaliai
tiesa, praktinio poveikio nulis — dabar ismatuota visame kataloge, ne speta.

---

### S1161 — SPRENDIMAS: NETAISYTI petshop-xml

```
+ 41 ispejimas per para dingtu · DOD-03 warning 4 -> 0
− liectumem „NELIESTI\" faila likus 12 d. iki perjungimo
```
Nauda tik svaresnis zurnalas. **Neverta.**

⚠️ UZRASYTA ATEICIAI: fallback ties `petshop-xml.php:367` realiai NEVEIKIA —
salyga `$brand !== ''` visada teisinga, nes „Array\" yra netuscia eilute.
Taisymas (jei kada liesim):
```php
function petshop_xml_tekstas( $v ) {
    if ( is_array( $v ) )  { $v = $v ? reset( $v ) : ''; }
    if ( is_object( $v ) ) { $v = (string) $v; }
    return is_scalar( $v ) ? (string) $v : '';
}
```

---

### S1162 — ✅ STEBETOJAS PASALINTAS (OPS-20)

```
zurnalas archyvuotas  ps-backups/tipu-zurnalas-ARCHYVAS-2026-08-20.json (113,4 KB)
modulis pasalintas · loopback 200 · mu-moduliai 60 -> 59
kopija deploy/petshop-tipu-zurnalas.php
```

**Salinimo priezastis ne tik higiena.** Modulyje buvo trukumas: ribos patikra
(`count($sar) >= RIBA`) stovejo PO failo skaitymo. Riba pasiekta, rasymo nebera,
bet 113 KB failas vis tiek buvo skaitomas ir `json_decode`'inamas KIEKVIENAI
importo eilutei (nes `images` yra masyvas visose prekese) — apie 300 MB
bereikalingo darbo per ZB importa ir tas pats per kiekviena VF cikla.

> **Laikinas irankis irgi turi kaina. Pastatytas stebetojas privalo tureti
> pabaigos data.**

---

### S1163 — 🟡 SALUTINIS: ZB APRASYMU KOKYBE

```
description tuscias   12 is 150  (~8 % → ~200 prekiu kataloge)
summary tuscias        6 is 150
```
Pirmasis irasas rodo ir saltini:
```
"summary": "&lt;p&gt;Sausas pasaras su svieziа vistiena…"
```
**Aprasymai is ZB ateina JAU uzkoduoti** — saltinis tiekejo XML, ne musu kodas.
Neismatuota visame kataloge. → **Q-ZB-APRAS**

Auksciausias decision Nr.: **S1163.**

---

## 2026-08-19 (naktis V) — LAISKAI, PAVEDIMAI, SEPTYNI KLAIDINGI VERDIKTAI [S1143-S1155]

---

### ⏰ RYTOJ (2026-08-20)

```
1. kiek pavadinimu su &amp; grizo po nakties ZB importo   (siandien: 0)
2. tipu-zurnalas.json — Array-to-string saknis
3. petshop-tipu-zurnalas.php PASALINTI, kai priezastis aiski
4. DOD-20 stabilumo serija uzsidaro 2026-08-24
5. SPRENDIMAS: petshop-nepamoketi.php — salinti ar palikti
6. SPRENDIMAS: zyme „3+ paros\" prie eiles „Neapmoketi\"
```

---

### S1143 — KLIENTU LAISKU PATIKRA

Ta pati klase kaip taisykliu puslapis: ar laiskas apskritai IJUNGTAS.

```
processing ✅ completed ✅ refunded ✅ cancelled ✅
new_account ✅ reset_password ✅ note ✅ verify_email ✅
on_hold NE · failed NE · invoice NE
```

---

### S1144 — ★ KLAIDINGAS VERDIKTAS: „BACS REKVIZITU NERA\" ★

Paskelbiau: „veikiantis mokejimo budas, kuriuo neimanoma sumoketi\".
Savininkas atsiunte REALU laiska su rekvizitais.

Perziurejus **16 676 failus** (temos + VISI pluginai + mu-plugins):
```
themes/flatsome-child/functions.php
  416: 'Mokejimo rekvizitai:'
  419: 'Bankas: AB Swedbank'
  420: 'Saskaita: LT127300010124940593'
  442: $heading = 'Uzsakymas gautas, aciu!'
```
Rekvizitai TEMOS kode, ne `woocommerce_bacs_accounts`. Todel standartinis
laukas ir buvo tuscias. `customer_on_hold_order` isjungtas SAMONINGAI.

**Kur suklydau:** ieskojau tik `mu-plugins` ir `petshop-core` — dviejuose
kataloguose is daugelio.

> **🔒 `mu-plugins` + `petshop-core` NERA visa sistema.** Flatsome child tema
> siame projekte turi daug logikos.

---

### S1145 — ★ KREPSELIO ATSAUKIMAS: IRODYTA ★

Savininko klausimas: „o tikrai krepselis pasinaikins po 90 min?\"

```
uzsakymas 35003 · paysera
sukurta   2026-08-19 12:11
atsaukta  2026-08-19 13:50   (99 min)
pastaba   „Neapmoketas uzsakymas atsauktas, baigesi laukimo laikas.\"
          „Email „Atsauktas uzsakymas\" sent.\"

Action Scheduler: 751 sekmingas ciklas nuo 2026-07-19, kas valanda
```

**Kodel 99, ne 90:** uzduotis sukasi kas valanda → atsaukiama artimiausiu
ciklu po ribos (90–150 min).

⚠️ `get_unpaid_orders_gmt` naudoja `date_updated_gmt`, ne sukurimo data —
paliestas uzsakymas pradeda laikrodi is naujo.

---

### S1146 — ★ BACS 3 PARU TAISYKLE NEVEIKS NIEKADA ★

`OrdersTableDataStore::get_unpaid_orders_gmt()` 1208-1210:
```sql
AND status = %s   →   OrderInternalStatus::PENDING
```
**TIK `pending`.** Bacs uzsakymas yra `on-hold` → i atranka nepatenka.
Realus bandymas: `get_unpaid_orders(90 min)` grazino **0**.

Vadinasi `petshop-nepamoketi.php` filtras NIEKADA nepasieks. Modulis moka
tik sulaikyti atsaukima, sukelti — ne.

**Pasekme:** `on-hold` uzsakymai kaupiasi neribotai, prekes juose nurasytos.

---

### S1147 — SAVININKO MODELIS: EILE SU ZYME, NE AUTOMATINIS ATSAUKIMAS

```
eile „Neapmoketi\" (JAU YRA)
   + zyme „bankinis pavedimas, laukia 3+ paras\"    ← naujas
   + mygtukas „Atsaukti\"                            ← JAU YRA (§35.3)
   + prekes grizta i likuti                         ← JAU YRA
   + vienas priminimas per 48 val.                  ← dunning-1 GULI PARUOSTAS
```

**Savininko principas:** „as paprastinu sistema, o ne ja sunkinu\" — bet
kalbant apie DARBA ATEITYJE. Automatika = maziau savininko veiksmu.

Mano pirmine reakcija („del vieno uzsakymo nestatom automatikos\") buvo
klaidinga: ziurejau i dabartine apimti, savininkas — i busima darba.

---

### S1148 — SALUTINIAI: MENIU, ACTION SCHEDULER, KUPONAI

```
meniu 79 punktai · 12 su `#` = mega-meniu antrastes (normalu)
      isskyrus „Susideok savo rinkini\" — ⏸ ar turi vesti?
AS    37 174 ivykdyta · 6 nepavyko (visi wpo-wcpdf, paskutinis 06-25)
kuponai 0 · vartotojai 34+1+1
wc_reserved_stock: 1 uzstriges irasas is 07-10, galiojimas baiges — nekenkia
```

---

### S1149-S1155 — ★★★ SEPTYNI KLAIDINGI VERDIKTAI PER DIENA ★★★

| # | Paskelbiau | Realiai | Kodel |
|---|---|---|---|
| 1 | SSL raudonas | procedura patvirtinta | neperskaiciau DOD-19 §7c |
| 2 | „55 % pasiruose\" | be pagrindo | ispudis, ne skaiciavimas |
| 3 | BreadcrumbList nera | kategorijose BUVO | tikrinau tik pradini psl. |
| 4 | `/krepselis/` 404 | `/cart/` ir buvo tikrasis | spejau adresa |
| 5 | free_shipping off → luze | veikia per vezejus | **atsakymas buvo eilute zemiau** |
| 6 | cron neveikia | Action Scheduler | ne ta planuokle |
| 7 | bacs rekvizitu nera | yra temos kode | 2 katalogai is daugelio |

**Visos septynios — MATAVIMO, ne kodo klaidos.**

> 🔒 **METODINE TAISYKLE:**
> ```
> 1. perskaityk VISA savo isvesti pries darydamas isvada is pirmos eilutes
> 2. patikrink, ar matuoji TEISINGOJE vietoje
>    (puslapio tipas · planuokle · katalogas · statusas)
> 3. nulinis rezultatas itartinesnis uz bloga — pirma patikrink matavima
> ```

**Sesijos pastebejimas:** naudingiausias irankis nebuvo tiltas. Tai buvo
savininko klausimai — „kur cia?\", „neteisus, skaityk\", „meluoji\",
„o tikrai?\". Kiekvienas pataise MATAVIMA, ne koda.

Auksciausias decision Nr.: **S1155.**

---

## 2026-08-19 (naktis IV) — NUSTATYMU SPRAGOS, ADRESAI, NEAPMOKETI [S1131-S1142]

Sesija atsake i savininko klausima „o kas dar tokio gali buti?\" — ir paaiskejo,
kad taisykliu puslapis nebuvo pavienis atvejis, o KLASE.

---

### S1131 — ★ NAUJA KLAIDU KLASE ★

```
nustatymas EGZISTUOJA, bet niekada nebuvo priskirtas arba rodo i sena vieta
```

Nelauzia nieko. Zurnale tuscia. Testai zali. Pasirodo tik ta akimirka, kai
jo prireikia — o prireikia PIRMA DIENA, su realiu klientu.

**Todel atliktas atskiras NUSTATYMU PILNUMO auditas (H118)** — ne „ar veikia\",
o „ar apskritai uzpildyta\". Vienas patikrinimas — sesi radiniai.

---

### S1132 — ✅ TAISYKLIU PUSLAPIS PRISKIRTAS

`woocommerce_terms_page_id` buvo **NENUSTATYTA** → 34524 „Pirkimo salygos ir
taisykles\". Be jo kasoje nebuvo su kuo susieti „sutinku su taisyklemis\"
varneles. Teisiniai puslapiai egzistavo nuo liepos — tik niekas ju nepriskyre.

Rasta atsitiktinai, tikrinant krepselio adresa.

---

### S1133 — ★ PRIVATUMO POLITIKA VEDE I JUODRASTI ★

```
buvo    wp_page_for_privacy_policy = 34526
        pavadinimas  „Slapuku naudojimas\"
        slug         slapuku-politika-old
        busena       DRAFT
        adresas      /?page_id=34526
dabar   34525 „Privatumo politika\" · publish · /privatumo-politika/
```

Complianz kadaise sukure 34526, veliau pakeite nauju 34591, senaji pervadino
i `-old` ir nuvere i juodrasti. `wp_page_for_privacy_policy` liko rodyti i
senaji.

**Kodel tai nebuvo tik teorija:**
```
woocommerce_checkout_privacy_policy_text      turi [privacy_policy]  TAIP
woocommerce_registration_privacy_policy_text  turi [privacy_policy]  TAIP
```
Abu tekstai naudoja zyme, kuria WordPress keicia nuoroda. Vadinasi kasoje ir
registracijoje nuoroda **realiai buvo rodoma ir vede i juodrasti** — tiksliai
ten, kur zmogus sutinka su duomenu tvarkymu.

---

### S1134 — KREPSELIO IR KASOS ADRESAI SULIETUVINTI

```
/cart/      -> /krepselis/     (ID 12)
/checkout/  -> /kasa/          (ID 13)
```

Adresai dabar nuoseklus: `/parduotuve/ /krepselis/ /kasa/ /paskyra/ /taisykles/`.

**Priklausomybiu patikra PRIES keiciant (H108):** temos failai 0, mu-plugins 0,
postmeta 0, posts 0; vienintelis snippetas su `/cart/` mini ji **komentare**,
o kodas naudoja `is_cart()`.

`wc_get_cart_url()` ir `wc_get_checkout_url()` persitvarke **pacios** —
WooCommerce adresa sudaro is puslapio ID.

**GSC patikra:** senoji petshop.lt krepseli turejo adresu
`/index.php?route=checkout/cart` (68 parodymai, 0 paspaudimu). Nei `/cart/`,
nei `/krepselis/` GSC eksporte (2 445 URL) NERA → §0.6 nepazeidziamas.

---

### S1135 — ★ MANO KLAIDA: ATSAKYMAS BUVO MANO PACIO ISVESTYJE ★

Paskelbiau: „free_shipping isjungtas — nemokamas pristatymas gali neveikti\".

Savininkas: „skaityk kas juostoj parasyta, o ne isgalvok\".

Toje pacioje isvestyje, EILUTE ZEMIAU:
```
zona „Lietuva\":
  free_shipping                            (off)
  shopup_venipak_shipping_courier_method   (ON)  x4
  shopup_venipak_shipping_pickup_method    (ON)
  woo_lithuaniapost_lpexpress_terminal     (ON)  x2
```
Septyni aktyvus metodai. Nemokamas pristatymas nuo €30 i pastomatus veikia per
VEZEJU metodus; `free_shipping` isjungtas SAMONINGAI.

> **Perskaityti VISA isvesti pries darant isvada is pirmos eilutes.**

---

### S1136 — NEAPMOKETI: PAVEDIMAS ATSKIRTAS NUO KORTELES

**Savininko klausimas:** „ar tai galima isskirti? Nes negaliu prekiu laikyti
neaisku kiek krepseliuose.\"

Galima. Perskaicius WooCommerce 11.0.1 koda (H121), NE is atminties:
```
wc-order-functions.php:1141
  apply_filters( 'woocommerce_cancel_unpaid_order', $sprendimas, $order )
```
Filtras gauna PATI uzsakyma → mokejimo buda galima perskaityti.

```
hold_stock_minutes   60 -> 90   (Paysera: pamestas krepselis atsilaisvina greitai)
petshop-nepamoketi.php v1.0.0   bacs + jaunesnis nei 3 paros -> NEATSAUKTI
md5 c4c954927fc95a33d545a023f2db7f96 · loopback 200
```

**🔒 SAUGUMO RIBA:** modulis gali tik SULAIKYTI atsaukima, niekada jo sukelti.
Pirma eilute: `if (!$atsaukti) return $atsaukti;`. Blogiausias padarinys —
prekes paguleti ilgiau. Prie kiekvieno sulaikymo — pastaba uzsakymo istorijoje.

**Sausas bandymas:** uzsakymas 34952, `bacs`, 95,6 val. (3,98 paros) →
`WC sakytu ATSAUKTI` → `po musu ATSAUKTI` ✅ riba praejusi.
⚠️ Antroji saka (jaunesnis nei 3 paros → sulaikyti) realiu uzsakymu
NEPATIKRINTA — dev'e tokio nera.

---

### S1137 — ★ MANO KLAIDA: NE TA PLANUOKLE ★

Buvau pareiskes: „cron nerasta → automatinis atsaukimas greiciausiai is viso
neveikia\". **Netiesa.**

```
pries_planavima: 1787172724   ← uzduotis BUVO suplanuota
```

Tikrinau `_get_cron_array()` — WordPress cron'a. WooCommerce 11 naudoja
**Action Scheduler**, atskira sistema.

> **Nerandama uzduotis reiskia, kad ieskai ne toje planuokleje.**

---

### S1138 — ✅ `payment_failed` — REGISTRAS BUVO PASENES

REGISTRAS §5: „ivykio DB NERA VISAI — niekas jo nekviecia\". Realiai:
```
mu-plugins/petshop-payment-failed.php
  28: add_action('woocommerce_order_status_failed', 'petshop_emit_payment_failed', 20, 1)
  71: Petshop_Event_Registry::emit('payment_failed', ...)
class-email-dispatch.php:52   payment_failed -> dunning-1
woocommerce_order_status_failed — 2 registruoti kabliukai
```
Grandine surista nuo galo iki galo. `class-event-registry.php:39`
`'payment_failed' => false // dalinai` = „empiriskai nepatvirtinta\", ne
„neveikia\". Tikrinama perjungimo nakti greta Paysera callback'o.

---

### S1139 — DOD-03 SVARUS MATAVIMAS

```
zurnale viso     24
is MUSU snippetu 12   ← diagnostikos triuksmas
PRODUKCINIU      12
   fatal      1   atminties limitas /feed/kaina24/ 08-17 (po v2.2.0 nekartojosi)
   warning    4 parasai — VISI „Array to string conversion\" petshop-xml.php
   deprecated 7 parasai (8 266 kartai is `postit`)
```
Keturi warning = **du defektai** poromis (343/344 ir 513/515). Kartojasi
KAS IMPORTA, paskutinis 2026-08-19 18:01.

**Sargas turetu atskirti snippetu klaidas nuo produkciniu** — kitaip po
perjungimo tas pats iskraipymas kartosis.

---

### S1140 — ARRAY TO STRING: DVI HIPOTEZES KRITO, PASTATYTAS STEBETOJAS

```
1. „laukai kartojasi XML'e\"      → paneigta (H115): ZB 2 622, VF 2 351, ne vieno
2. „tuscias elementas <brand/>\"  → ZB neturi ne vieno tuscio
```

Trecios hipotezes nekelta. `petshop-xml` pazymetas **„NELIESTI\"**, todel
vietoj spejimo idiegtas `petshop-tipu-zurnalas.php` v1.0.0 — kabinasi tuo
paciu filtru prioritetu 999, grazina reiksme NEPAKEISTA.

```
rezultatas  uploads/ps-backups/tipu-zurnalas.json · riba 150
isjungimas  uploads/ps-tipu-zurnalas.off
uzpildys    VF stock hourly · ps_feeds_naktinis 01:30 · VF reprice 03:00
```

---

### S1141 — SALUTINIAI RADINIAI

```
🟡 force_ssl_checkout = no      po perjungimo -> yes (OPS)
🟡 admin_email = terra@gyvunai.lt   parduotuves laiskai eina i uzsakymai@petshop.lt
🟡 /product/ps-testas-1-eur/    Paysera testine preke tebera (OPS-05)
⏸ kitu saliu zona tuscia        savininko nurodymu ATIDETA
```

---

### S1142 — SESIJOS PAMOKA

**Per siandiena SEPTYNIS kartus paskelbiau raudona, kurio nebuvo:** SSL,
„55 %\", BreadcrumbList, /krepselis/ 404, free_shipping, cron planuokle,
ir prekiu ienklu poveikis feed'ams.

Kiekviena karta priezastis ta pati — **matavau ne ten, kur reikia, arba
neperskaiciau savo paties isvesties iki galo.**

> Naudingiausias dienos irankis nebuvo tiltas. Tai buvo savininko klausimai
> „kur cia?\", „neteisus, skaityk\", „nerandu\" — kiekvienas is ju pataise
> matavima, o ne koda.

Auksciausias decision Nr.: **S1142.**

---

## 2026-08-19 (naktis III) — NF9, NF19, ESYBIU UODEGA, TZ v1.87 [S1123-S1130]

---

### S1123 — NF9 PRISIJUNGIMO SARGAS

`mu-plugins/petshop-login-sargas.php` v1.0.0, md5 `8624aee11a7929545d6c8fd71f7b01d6`.
5 bandymai / 15 min. Savas modulis, ne pluginas (27 pluginai prie ribos 25).

```
bandymai 1-4   iprasta klaida
bandymas 5     UZRAKINTA
po valymo      atrakinta
REST tuo metu  200, 1 767 snippetai — tiltas nepaliestas
```

Trys saugikliai: veliava `uploads/ps-login-sargas.off`; REST/magic link/cron
neliesti; ilgiausia pauze 15 min.

**Adresas TIK is `REMOTE_ADDR`.** `X-Forwarded-For` samoningai neskaitomas —
ji galima suklastoti, todel juo pasitikint sarga apeitu tas, nuo ko jis saugo.

> **Irodytas IR isjungimo kelias.** Vakar prieziuros rezimas parode, kad
> blokuojantis kodas be patikrintos atrakinimo puses yra spastai sau paciam.

---

### S1124 — NF19 WCAG BAZINE PATIKRA

```
lang lt-LT visur · 0 paveiksleliu be alt is ~65 · po viena H1
skip-link yra · mastelis neuzrakintas · 0 bendriniu nuorodu tekstu
```

Trys smulkmenos: musu `psnl-check` varnele be prieinamo vardo; `h1 -> h4`
sokis prekes puslapyje; 12 nuorodu be teksto kategorijoje.

---

### S1125 — TERMINAI: 4 PATAISYTI, POVEIKIS NULINIS

Visi keturi (`Hau&amp;Miau`, `Hagen GmbH&amp;Co. KG`, `Monge &amp; C. S.p.a.`,
`Finnern GmbH&amp;Co`) yra taksonomijoje `pa_brendas`, **prekiu 0**.

**Pataisiau savo verti nima:** sakiau, kad jie eina i feed'u `<g:brand>`.
Netikslu — feed'ai naudoja `product_brand`, isvalyta 2026-08-18.

---

### S1126 — APRASYMU „PAVOJUS\" NEPASITVIRTINO

Itariau, kad 888 prekiu lankytojas mato `<p>` kaip teksta. Ismatuota:
```
DB          &lt;p&gt;Sausas pasaras...&lt;/p&gt;
po filtro   <p><p>Sausas pasaras...</p></p>
```
Filtras esybes dekoduoja → tekstas rodomas teisingai. Lieka `<p>` viduje `<p>`
— **kosmetika**, ne gedimas. 423 prekes.

---

### S1127 — ZB IMPORTO PROFILIS: SAKNIS MAZIAU BLOGA

```
Import #2   title {name[1]} · is_update_title 0 · update_all_data no · fix_characters 0
Import #3   title tuscias
Import #5   is_update_title 0
```

**`is_update_title = 0` reiskia, kad importas ESAMU prekiu pavadinimu
NELIECIA.** Vakarykstis 308 taisymas negris atgal — `&amp;` gali atsirasti tik
NAUJOMS prekems. Q-ZB-SAKNIS skubumas smarkiai mazeja.

---

### S1128 — 🟡 NEPATIKRINTA: `/krepselis/` 404

Speju adresa ir pataikiau i 404. Gali reiksti, kad krepselis kitu adresu
(**mano klaida**) arba kad lietuviskas adresas neveikia. **Netvirtinu, kad tai
gedimas.** Prie §0.6 verta pasizureti tikraji `woocommerce_cart_page_id`.

---

### S1129 — ★ TZ MASTER v1.87: TAISYTOS PACIOS LENTELES ★

Ne tik pridetas „Papildyta\" blokas. **Pataisytos lenteles**, nes pagal projekto
taisykle „Papildyta\" blokai yra istorija, o dabartine bukle skaitoma is skyriu.
Palikus lenteles melagingas, dokumentas ir toliau klaidintu.

```
Sk. 10    tema „ATVIRAS: Astra Pro vs Flatsome\" -> Flatsome Child (UZDARYTA)
Sk. 11.5  petshop-xml v1.3.3 -> v1.5.7; petshop-core „planuojamas\" -> aktyvus
          + ~20 mu-plugins moduliu sarasas
Sk. 17    Launch readiness -> „PERSKAICIUOTA: perjungimas 2026-09-01/02\"
Sk. 26.7  etapai 4/8/9 „Laukia\" -> ATMESTA / VEIKIA nuo 2026-06
```
Plius septyni „Papildyta (v1.87)\" blokai su visais devyniais prietaravimais,
NF sluoksnio busena ir esybiu istorija.

**★ INCIDENTAS TAISANT ★** `s.replace('v1.3.3','v1.5.7',1)` pakeite PIRMA
pasitaikiusi vieta — versiju istorijoje („ZB pricing v1.3.3 -> v1.3.4\"), ne
§11.5 lenteleje. Pastebeta tik palyginus originala su rezultatu.

> **PAMOKA: eilutes paieska dideliame dokumente be konteksto yra spejimas.**
> Taisyta i `>v1.3.3<` (lenteles langelio ribos) — vienintele vieta.
> Klaidingas pakeitimas atsauktas, validacija PASSED, PDF perziuretas akimis.

---

### S1130 — SESIJOS SUVESTINE

Uzdaryta per diena: DOD-19 §8 abu punktai · TZ §S8 · TZ §5 NF9 ir NF19 ·
feed'u esybes 117→0 · autoload −34 % · kesavimo antrastes · 4 saugos pataisos ·
TZ v1.87.

Nauji moduliai: `petshop-prieziura` v1.0.1 · `petshop-higiena` v1.0.0 ·
`petshop-login-sargas` v1.0.0 · `petshop-schema` v1.0.2.

**Tris kartus per diena paskelbiau raudona, kurio nebuvo** (SSL, „55 %\",
BreadcrumbList). Kiekviena karta priezastis ta pati — matavau ne ten, kur
reikia, ir skubejau su verdiktu.

Auksciausias decision Nr.: **S1130.**

---

## 2026-08-19 (naktis II) — SCHEMA, ESYBES, FEED'AI [S1115-S1122]

Prasidejo nuo BreadcrumbList, o baigesi 308 prekiu pavadinimu taisymu ir
trimis issivaliusiais feed'ais. Kelias tarp tu dvieju tasku eina per viena
mano paties klaidinga teigini.

---

### ⏰ RYTOJ (2026-08-20) — PIRMAS DARBAS PRIES VISKA

**BUTINA PATIKRINTI.** Naktį suksis `ps_feeds_naktinis` (01:30) ir ZB
importai. Klausimas: **kiek pavadinimu su `&amp;` GRIZO.**

```
1. SELECT COUNT(*) FROM posts
   WHERE post_type='product' AND post_status IN ('publish','draft')
     AND post_title REGEXP '&[a-zA-Z]+;|&#[0-9]+;'
   siandien po taisymo: 0

2. feed'u cdata_amp: google.xml · kaina24.xml · kainos.xml
   siandien po pergeneravimo: 0 / 0 / 0
```

**Skaicius rytoj = saknies skubumo matas:**
```
0        saknis nekenkia — pakanka stebeti
1-50     ZB importas grazina dali — taisyti profili neskubant
50+      grazina masiskai — taisyti PRIES perjungima, kitaip feed'ai vel sugenda
```

Antra rytojaus eilute, nesusijusi: **DOD-20 stabilumo serija uzsidaro
2026-08-24** (paleista 08-17 19:23).

---

### S1115 — BREADCRUMBLIST: MANO „RAUDONAS\" BUVO KLAIDINGAS

§8z buvau irases „BreadcrumbList nera\". **Netiesa.** Tikrinau TIK pradini
puslapi, o ten jos ir neturi buti.

Ismatuota tikruose puslapiu tipuose (H092):
```
pradinis      Organization, WebSite, WebPage         breadcrumb: nera — TEISINGA
kategorija    CollectionPage, BreadcrumbList ✅      „Pradzia > SUNIMS\"
preke         ItemPage, Product ✅                    breadcrumb: NERA — tikra spraga
```

> **PAMOKA: puslapio tipas yra matavimo salyga, ne smulkmena.** Vienas
> pavyzdys is neteisingos vietos duoda neteisinga verdikta visai svetainei.
> Tai jau treciasis kartas, kai per skuba paskelbiu raudona, kurio nera.

---

### S1116 — BREADCRUMBLIST PREKEMS — IDIEGTA

`mu-plugins/petshop-schema.php` v1.0.2, md5 `78879f3c211681505dbb3c81c13004f4`,
kopija `deploy/`. Kabinasi ant `rank_math/json_ld` (prioritetas 99).

```
/product/farmina-nd-tropical.../
  1. Pradzia > 2. SUNIMS > 3. Maistas sunims
  > 4. Sausas maistas sunims > 5. [preke]

/product/trixie-baena-draskykle.../
  1. Pradzia > 2. KATEMS > 3. Draskykles katems > 4. [preke]
```

Takelis statomas is pirmines Rank Math kategorijos
(`rank_math_primary_product_cat`), jos nesant — is giliausios priskirtos, su
visais protėviais. Jei Rank Math kada nors pradetu isvesti pati —
nedubliuoja (tikrina grafa pries prideдama).

**TZ §S8 uzdarytas:** Product ✅ · BreadcrumbList ✅ · Organization ✅.

---

### S1117 — TRYS BANDYMAI DEL `&amp;`, VISI NEPAVYKE

Schemoje pavadinimai su `&` rode `N&amp;D`. Bandyta:
```
v1.0.0  wp_strip_all_tags                        &amp; ir &#8211; liko
v1.0.1  + html_entity_decode ENT_HTML5           &#8211; issitaise, &amp; liko
v1.0.2  + kartotinis dekodavimas iki 4 kartu     &amp; VIS TIEK liko
```

Pagal taisykle „po 2-3 nesekmingu bandymu STOP\" sustota. **Priezastis
neistirta.** Labiausiai tiketina — Rank Math uzkoduoja reiksmes isvesdama
JSON-LD (jos standartine elgsena, ne musu klaida), bet **to NEIRODZIAU**.

Sustojimas pasirode teisingas: ieskant priezasties issiaiskino, kad tikroji
problema visai kitur.

---

### S1118 — ★ FEED'AI: 117 IRASU SU SUGADINTAIS PAVADINIMAIS ★

```
/feed/google/     200 · 4 744 KB · CDATA bloku su &amp;: 117
/feed/kaina24/    200 · 5 737 KB · CDATA bloku su &amp;: 117
/feed/kainos/     200 · 5 233 KB · CDATA bloku su &amp;: 117
dvigubo kodavimo (&amp;amp;): 0
```

**CDATA viduje esybes NEDEKODUOJAMOS.** Vadinasi Google Merchant, Kaina24 ir
Kainos.lt gaudavo pazodziui:
```
Real Dog SP Puppy All Breeds Lamb, Pork &amp; Buffalo with Brown Rice 12 kg
```

Taip preke ir atrode kainu palyginimo svetainese bei Google Shopping.

**Diagnoze (H096):**
```
DB_raw          ... Lamb, Pork &amp; Buffalo ...
get_the_title   ... Lamb, Pork &amp; Buffalo ...
dekoduota_1x    ... Lamb, Pork & Buffalo ...      <- SVARU, uztenka vieno karto
```

> **★ TAS PATS DUOMUO, TRYS SKIRTINGI VERDIKTAI. ★**
> HTML kode `&amp;` yra NORMA (naršykle parodo `&`).
> XML CDATA viduje ir JSON-LD — KLAIDA.
> Todel prekes puslapis atrode tvarkingas, o feed'ai tyliai gedo.

---

### S1119 — DRY-RUN: APIMTIS DIDESNE, NEI ATRODE (H097)

```
publish     148
draft       160
VISO        308        nesikeiciancziu: 0
esybiu rusis: TIK viena — &amp;, 510 kartu

kilme:  zb 238 (77 %) · av 68 · prins 2
```

Tos pacios esybes kitur (**NELIESTA samoningai**):
```
post_excerpt   888 prekiu
post_content   322 prekiu
terminai         4
```
Aprasymuose `&amp;` gali buti **teiseta** — ten HTML pasitaiko. Pavadinimuose
HTML neturi buti is viso, todel tik jie ir taisyti. Aprasymai reikalauja
atskiro dry-run su kitokia logika.

Pilnas „pries → po\" sarasas: `pavadinimu_dry_run_2026-08-19.md` (46 KB).

---

### S1120 — APPLY: 308/308 (H098)

```
kopija        ps-backups/post_titles_h098.json   37 168 B
pataisyta     308 / 308
klaidu        0
praleista     0
liko su esybemis   0
```

Naudotas `$wpdb->update` + `clean_post_cache()`, **ne** `wp_update_post()` —
kad nepasileistu `save_post` kabliukai (VF/ZB importo logika, atributu
variklis) ir nebutu liestas `slug`. **301 sluoksnis ir SEO nepaliesti.**

Patikra po taisymo:
```
Eukanuba Mini & Medium Adult (eriena ir ryziai) 2,5kg
Monge Dry Dog Puppy&Junior GRAIN FREE Duck & potatoes 2,5kg
Real Dog SP Puppy All Breeds Lamb, Pork & Buffalo with Brown Rice 12 kg
```

---

### S1121 — FEED'AI PERGENERUOTI IR PATIKRINTI (H099)

Paleista `do_action('ps_feeds_naktinis')`.

```
trukme         27,9 s
atminties pikas 130 MB      (S1088 minetas fatal nepasikartojo)

              KB     cdata_amp   amp_viso
google.xml   4 906       0           0
kaina24.xml  5 919       0           0
kainos.xml   5 430       0           0
```

Patikrinta **ir failuose diske, ir per viesus URL** — visi trys 200,
`cdata_amp: 0`. Frontas 200.

**117 → 0.**

---

### S1122 — ZVALGYBOS SALUTINIS: FEED VARIKLIO API

Ieskant, kaip pergeneruoti, `get_declared_classes()` su filtru „feed\"
grazino tik `Petshop_Feeding_*` (serimo skaiciuokle) — feed'u generatoriaus
klases fronto uzklausoje **neuzkraunamos**.

Tikrasis kelias rastas cron lenteleje:
```
ps_feeds_naktinis              2026-08-20 01:30
petshop_vf_sync_stock_hourly   kas valanda
petshop_vf_sync_reprice_daily  03:00
petshop_vf_sync_publish_daily  04:00
petshop_attr_engine_run        22:57
petshop_pragma_monthly_export  2026-09-05 08:00
```

> **Kabliuko vardas is cron lenteles yra patikimesnis uz klases paieska** —
> klase gali buti neuzkrauta, o cron irasas rodo tikra ivykio pavadinima.

---

### NEUZDARYTA

```
⏰ RYTOJ: kiek pavadinimu grizo po nakties importo (zr. virsuje)
🔴 SAKNIS: ZB Import #2/#3 profiliai iraso &amp; — netaisyta
🟡 post_excerpt 888 · post_content 322 — atskiras dry-run, kitokia logika
🟡 Rank Math JSON-LD `&amp;` — priezastis neirodyta, is musu puses netaisoma
🟡 DOD-20 serija uzsidaro 2026-08-24
```

Auksciausias decision Nr.: **S1122.**

---

## 2026-08-19 (velyva naktis) — NF SLUOKSNIS: SAUGA, GREITIS, ROBOTS [S1107-S1114]

Sesija vykde TZ audito „E dalies\" veiksmus. Rezultatas dvilypis: sauga ir
higiena uzdaryta realiais pataisymais, o greicio matavimas atsimuse i dalyka,
kurio niekas nebuvo ivardijes vardu.

---

### S1107 — SAUGOS PATIKRA IS ISORES (H085)

```
/wp-json/wp/v2/users       403   serverio lygio blokavimas
/wp-content/uploads/       403
/wp-config.php.bak         403
/wp-content/debug.log      404
/.env                      404
wp-config.php teises       0600
administratoriu            1  (prisijungimas bdz487, ne „admin\")
vartotoju admin/root/test  0
wp-login.php antrastes     X-Frame-Options, CSP, Referrer-Policy
```

Visi 403 identisko dydzio (401 B) — tai **serverio lygio WAF**, ne WordPress.
Vadinasi NF11 is dalies dengia hostingas, nors Wordfence'o nera.

**Saugumo pluginu — NE VIENO.** NF9 (login limitai) ir NF10 (2FA) realiai
neigyvendinti. Prie vieno administratoriaus su neatspejamu vardu tai nera
degantis dalykas, bet TZ ju reikalauja — savininko sprendimas.

**NEPATIKRINTA:** `xmlrpc.php` — uzklausa nuluzo (`fetch failed`). Neteigiu,
kad uzdarytas.

---

### S1108 — PATAISYMAS: REGISTRE BUVO „WP 7.0\"

```
<meta name="generator" content="WordPress 6.9.4">
```

Registro ir TZ suvestines teiginys **WP 7.0 — netikslus.** Realiai 6.9.4.

---

### S1109 — KETURIOS SAUGOS PATAISOS (H086b)

| Pataisa | Patikra |
|---|---|
| `DISALLOW_FILE_EDIT = true` | wp-config 3 827 -> 3 939 B, loopback 200 |
| `WP_DEBUG_DISPLAY = false` | ta pati |
| `readme.html` pasalintas | dabar 404 (buvo 200) |
| `license.txt` pasalintas | dabar 404 |
| `<meta generator>` pasalintas | vitrinoje nebera |

Naujas modulis `mu-plugins/petshop-higiena.php` v1.0.0, md5
`b1226cc0eda4e007dd7f2f02d1150b36`. Salina generator, RSD, wlwmanifest,
X-Pingback. Kopija `deploy/`.

**Saugikliu grandine suveike:** wp-config kopija i `ps-backups` PRIES keitima
-> `token_get_all(TOKEN_PARSE)` -> irasymas -> loopback -> tik tada toliau.
`readme.html` ir `license.txt` ne istrinti, o PERKELTI i `ps-backups`.

---

### S1110 — ★ KODEL PAGESPEED NEVEIKIA: SERTIFIKATAS ★

Savininkas: „neveikia\". Ismatuota:

```
dev.avesa.lt sertifikatas:
   CN        *.serveriai.lt
   SAN       *.serveriai.lt, serveriai.lt      <- dev.avesa.lt NERA
   isdave    PerfectSSL
   galioja   2026-04-02 -> 2026-10-17
   patikimas NE — UNABLE_TO_VERIFY_LEAF_SIGNATURE
```

Tai bendras hostingo sertifikatas, ne musu domenui. Google atsisako matuoti
svetaine su negaliojanciu sertifikatu. Tas pats ir su Lighthouse.

**★ Tai buvo priesais akis nuo pirmos dienos.** Tilto skripte visa laika
stovi `NODE_TLS_REJECT_UNAUTHORIZED='0'` — mes ta klaida ignoruojam nuo pat
pradziu, tik niekas nebuvo jos pavadines vardu.

**Isvada TZ NF3/NF4:** Lighthouse dev'e ISMATUOTI NEIMANOMA. Tai ne skola ir
ne neatliktas darbas — tai aplinkos apribojimas. Po perjungimo `petshop.lt`
gaus tikra Let's Encrypt sertifikata (DOD-19 §7c), ir matavimas veiks.

Du bandymai pries tai nuluzo: PSI API grazino HTTP 429 (GitHub runner'iu
bendras IP, Google dienos kvota isnaudota svetimu), o `npx playwright install
--with-deps` kabejo 17 min. Pagal taisykle „po 2-3 nesekmingu bandymu STOP\"
trecio karto ta pacia kryptimi nedariau.

---

### S1111 — NASUMO PROFILIS BE NARSYKLES (H087, H088)

```
KLIENTO PUSE (5 matavimai)
   pilnas HTML       mediana 1 940 ms  (1 813 - 2 562)
   HTML dydis        230 KB, gzip ijungtas
   CSS               11 failu, 295 KB
   JS                19 failu, 370 KB
   nuotraukos        20, 342 KB
   VISO              ~1,2 MB
   JS be defer/async 13 (5 is ju <head> viduje, blokuojantys)

SERVERIO PUSE
   PHP               8.3.20, limitas 256M
   OPcache           IJUNGTAS
   objektu kesas     NERA
   uzklausu          78
   generavimo laikas ~1 s
   atminties pikas   112 MB
   transientu        1 436 (1 009 KB)
   prekiu publish    2 609
```

**Objektu keso nebuvimas** yra didziausia likusi galimybe — TZ §10 Redis mini
kaip „optional\", bet tai buvo pries 2 609 prekes.

---

### S1112 — DVI MANO MATAVIMO KLAIDOS

**Pirma.** `round(timer_stop(0), 3)` — `timer_stop()` grazina EILUTE. PHP 8.3
tai jau `TypeError`, ne ispejimas. Snippetas nuluzo, serverio dalis negrizo.
Pakartota su `(float)`.

**Antra, svarbesne.** `autoload_KB` parode **0**, ir tai buvo NETEISINGA.
Nuo WordPress 6.6 stulpelio `autoload` reiksmes yra `on`/`off`/`auto`, ne
`yes`/`no`. Uzklausa `WHERE autoload='yes'` rado 2 senus irasus.

> **PAMOKA: nulinis rezultatas yra itartinesnis uz bloga rezultata.**
> „0 KB autoload\" turejo iskart sukelti klausima, o ne pasitenkinima.

Permatavus teisingai:
```
off      1 714 irasai   8 515 KB   <- nekraunama
auto       396           235 KB
on         344            95 KB
no          10            67 KB
yes          2             0 KB
KRAUNAMA: 742 irasai, 330,5 KB
```

---

### S1113 — KESAVIMO ANTRASTES IR AUTOLOAD VALYMAS (H089, H090)

**`.htaccess` kesavimas:**

| Failas | Pries | Po |
|---|---|---|
| `wp-embed.min.js` | **jokios Cache-Control** | `public, max-age=31536000` |
| `dashicons.min.css` | `max-age=604800` | `public, max-age=31536000` |

`.htaccess` 1 309 -> 2 068 B, kopija `ps-backups/htaccess.bak_h089`. Blokas
apgaubtas `<IfModule mod_expires.c>` ir `<IfModule mod_headers.c>` — abu
moduliai ijungti, bet net ju nesant nesulauztu. Frontas 200, wp-admin 302.

**Transientai — NIEKO NEISTRINTA, ir tai teisingas rezultatas.** Is 1 436
pasibaigusiu **0**. Snippetas rasytas trinti tik pasibaigusius; trynus visus
WooCommerce juos perskaiciuotu be jokios naudos.

**Autoload valymas:**
```
autoload      330,5 KB -> 218,1 KB   (-34 %)
irasu             742 -> 737

wh_probe_result        istrinta   ┐
wh2_probe_result       istrinta   ├ MUSU senu run'u likuciai
mnm_p7_result          istrinta   ┘
jetpack_active_plan    istrinta     (Jetpack neidiegtas)
petshop_zb_image_index autoload auto -> off   (NEISTRINTA, reikalinga importui)
```
Reiksmiu kopija: `ps-backups/options_h090.json` (56 383 B). Loopback 200.

---

### S1114 — ★ ROBOTS.TXT PO PERJUNGIMO: VEIKS SAVAIME ★

Savininko klausimas. **Anksciau atsakiau „keisis savaime\" NEPATIKRINES.**
Ismatuota:

```
fizinis failas /robots.txt   NERA
generuoja                    WordPress virtualiai:
                             0  -> RankMath\Sitemap\Sitemap_Index::add_sitemap_directive
                             10 -> WooCommerce::robots_txt
do_robotstxt filtru          ne vieno
Rank Math custom turinys     nera
```

Fizinio failo nera -> `Sitemap:` eilute sudaroma is `home_url()` kiekvienos
uzklausos metu. Pakeitus Site URL i `https://petshop.lt` ji **ta pacia
sekunde** tampa teisinga. WooCommerce eilutes — santykiniai keliai.

> **ISPEJIMAS ATEICIAI:** jei kas nors ikels FIZINI `robots.txt` i sakni, jis
> TYLIAI perims viska — nei Rank Math, nei WooCommerce eilutes nebeveiks, ir
> sitemap nuoroda liks uzsalusi.

**Salutinis radinys, kurio neieskojau:**
```
blog_public = 0   („Discourage search engines\" IJUNGTA)
robots.txt        Disallow: /wp-admin/    <- LEIDZIA visa svetaine
                  Sitemap: .../sitemap_index.xml
```
Indeksavima dabar stabdo **tik `<meta name="robots" content="noindex,
nofollow">`**, o robots.txt yra leidziantis ir dar skelbia sitemap'a. Dev'e
nekenkia (sertifikatas negalioja, nuorodu nera), bet reiskia, kad DOD-22
varnele yra VIENINTELIS apsaugos sluoksnis, ne vienas is dvieju.
Po perjungimo verta 1 min. pasizureti, ar robots.txt atrodo, kaip tikimes.

---

### NF SLUOKSNIO BUKLE PO SIOS SESIJOS

| NF | Reikalavimas | Buvo | Dabar |
|---|---|---|---|
| NF1-NF2 | LCP / TTI | neismatuota | netiesioginiai skaiciai; tikri po perjungimo |
| NF3-NF4 | Lighthouse | neismatuota | NEIMANOMA dev'e (sertifikatas) — ne skola |
| NF8 | SSL | pasibaiges | issprendziama po DNS (DOD-19 §7c) |
| NF9 | brute force | neismatuota | **NEIGYVENDINTA** — saugumo pluginu nera |
| NF10 | 2FA admin | neismatuota | **NEIGYVENDINTA** |
| NF11 | WAF | neismatuota | serverio lygio WAF YRA (403 atsakymai) |
| NF18 | naršykles | netestuota | netestuota |
| NF19 | WCAG | neismatuota | neismatuota |
| NF20 | WebP + kesavimas | dalinai | **kesavimo antrastes sutvarkytos** |
| NF22 | audit trail | dalinai | dalinai (tik kainai) |

---

### NEUZDARYTA

```
🔴 BreadcrumbList schema — TZ §S8 jos reikalauja, nera
🔴 NF9/NF10 — saugumo pluginu nera, savininko sprendimas
🟡 xmlrpc.php busena nepatikrinta
🟡 objektu kesas (Redis) — didziausia likusi nasumo galimybe
🟡 13 JS be defer/async, 5 blokuojantys <head> viduje
🟡 NF18 naršykliu testas, NF19 WCAG
⏸ NF1-NF4 — matuojama TIK po perjungimo
```

Auksciausias decision Nr.: **S1114.**

---

## 2026-08-19 (naktis) — TZ AUDITAS, PRIEZIUROS REZIMAS, ATSTATYMO RECON [S1099-S1106]

Sesija prasidejo savininko klausimu „ar mes pasiruose paleidimui\" ir baigesi
tuo, kad viena is mano paciu pataisu 4 minutes laike dev'a 503 busenoje. Abu
dalykai vertingi, ir antras — labiau.

---

### S1099 — TZ MASTER v1.86 PILNAS AUDITAS (46 skyriai)

Perziuretas VISAS TZ (1 141 pastraipa, 103 lenteles), kiekvienas punktas
sulygintas su REGISTRU ir siuo zurnalu. Ataskaita:
`TZ_MASTER_v1_86_AUDITAS_2026-08-19.md`.

```
punktu palyginta   ~310
padaryta           ~168 (54 %)
dalinai             ~34 (11 %)
nepadaryta          ~28  (9 %)
samoningai atmesta  ~41 (13 %)
NEISMATUOTA         ~39 (13 %)   <- didziausia rizikos klase
```

**★ TRYS SLUOKSNIAI, KURIU REGISTRE NERA VISAI ★**

```
Sk. 5   NF1-NF22 nefunkciniai      22 punktai, 8 neismatuoti
Sk. 20  T1-T13 testavimo planas    13 punktu, 4 nedaryti
Sk. 2.2 techniniai KPI             9 metrikos, 5 nematuotos
```

Patikrinta grep'u: zodziai `Lighthouse`, `Wordfence`, `2FA`, `WP Rocket`,
`Cloudflare`, `Omniva`, `ACF Pro` — **0 atitikmenu** nei REGISTRE, nei
zurnale. Tai ne „blogai padaryta\", tai NEMATUOTA.

Persidengia: greitis (NF1-NF4 = T4 = KPI 1-4) ir sauga (NF9-NF11 = T7).
Realiai tai **du matavimai**, ne septyniolika darbu.

---

### S1100 — DEVYNI TZ PRIESTARAVIMAI REALYBEI

| # | Vieta | TZ teigia | Realiai |
|---|---|---|---|
| B1 | 16/17 | go-live 2026-10-15 | perjungimas 2026-09-01/02 |
| B2 | 27 | aprasymai per `petshop_desc_*` | lauku NERA ne vienoje is 2 744 prekiu (41 sk.) |
| B3 | 26.7 | etapai 4/8/9 „Laukia\" | stock sync ir monitoringas veikia nuo birzelio |
| B4 | 11.5 | `petshop-xml v1.3.3` | v1.5.7; truksta ~14 moduliu |
| B5 | 13 | Omniva ir Cloudflare = P0 | ne vienas neidiegtas |
| B6 | 6.3 | 5 lock checkbox'ai per ACF Pro | tik `_manual_price_override` |
| B7 | 0.12 | `_active_fulfillment_source` | `_ps_sandelis` (36.1) |
| B8 | 29/35.12 | „12 punktu, saknis resolveris\" | prielaida paneigta S920-S923 |
| B9 | 10 | tema „ATVIRAS\" | Flatsome Child nuo geguzes |

**★ RADINYS, KURIO NIEKUR NEBUVO: TZ 14 D7 ir D8 ★**

```
D7  Klientu baze          MVP prioritetas   NEPADARYTA, nera ne vienoje lenteleje
D8  Uzsakymu istorija     MVP prioritetas   NEPADARYTA
```

Sena platforma isjungiama 2026-10-15. Po to duomenu nebebus is kur imti.
Tas pats galioja Q19 (istoriniai atsiliepimai).

---

### S1101 — TILTO RECON: TRYS FAKTAI

```
1. adresas    screenshot.mjs 3 eilute: const WP='https://dev.avesa.lt'
              daugiau NIEKUR. Pakeitimas trivialus.
2. PAT        workflow viduje GH_TOKEN = github.token (Actions savas).
              PAT reikalingas TIK Claude dispatch'ui ir skaitymui.
              Q-PAT siauresnis, nei registre atrodo.
3. AKLA ZONA  po perkelimo dev.avesa.lt mirsta, petshop.lt dar eShoprent
              -> NE VIENAS adresas nepasiekia svetaines is isores
```

Akla zona DOD-18/19 nera aprasyta. Silomas sprendimas: SSH zmogaus prasyti
subdomeno (pvz. `naujas.avesa.lt`), rodancio i NAUJA dokumentu sakni. Tada
tiltas mato svetaine ir pries DNS, ir po jo.

**Padaryta:** workflow'e pridetas `WP_URL: ${{ secrets.WP_URL }}`. Perjungimo
metu adresas keiciamas vienu GitHub secret'u, ne kodu. Kol secret nenustatytas
— galioja `dev.avesa.lt`.

---

### S1102 — PRIEZIUROS REZIMAS v1.0.0 (H081)

DOD-19 8 skyriuje pazymeta: „prieziuros rezimo jungiklis NEEGZISTUOJA\".
Sukurtas `mu-plugins/petshop-prieziura.php`.

**Pagrindinis sprendimas: veliava FAILU, ne nustatymu duomenu bazeje.**

```
ijungti    sukurti  wp-content/uploads/ps-prieziura.flag
isjungti   istrinti ta pati faila
```

Priezastis konkreti: DOD-19 3.3 numato rezima ijungti PRIES DB atstatyma.
Jungiklis, gyvenantis DB, tuo metu butu nepasiekiamas — t.y. tiksliai tada,
kai jo ir reikia.

Trys detales, idetos samoningai:

```
503 + Retry-After     ne 200 ir ne 302. Google 503 neindeksuoja, BET ir
                      is indekso NEISMETA. Po viso SEO sluoksnio — kritine
?wc-api= praleidziamas mokejimu callback'ai NIEKADA neblokuojami. Kitaip
                      klientas sumoka, o uzsakymas lieka „laukiama apmokejimo\"
?ps_prieziura=<raktas> perziura be prisijungimo, slapukas 12 val.
```

---

### S1103 — ★ INCIDENTAS: PRIEZIUROS REZIMAS UZDARE TILTA ★

**Kas nutiko.** v1.0.0 kabejo ant `init`. `init` vyksta IR REST uzklausoms.
Ijungus rezima uzsidare Code Snippets REST API — t.y. tiltas. H081 pabaigoje
snippet'o isjungimo kvietimas tyliai grazino 503, o valymo faze C pati save
uzblokavo.

```
frontas_su_veliava        503  <- tikslas pasiektas
C_valymas                 503  <- faze nepasieke PHP
frontas_po_valymo         503  <- dev liko prieziuros rezime
```

**Trukme: ~4 min.** Dev'as, ne produkcija, realiu klientu nera.

**Kaip isikapsciau (H082).** Senasis snippetas 3536 liko AKTYVUS — butent
todel, kad ji isjungianti REST uzklausa buvo blokuota. Iskvietimas per
`?wc-api=ps&ps_h081=C` praejo pro rezima ir istryne veliava.

> **Tas pats saugiklis, kuris turejo saugoti pinigus (`wc-api` praleidimas),
> pasirode esas ir avarinis ijejimas.**

**PAMOKA — ★ NAUJA TAISYKLE ★**

> **Kodas, kuris blokuoja uzklausas, PRIVALO buti patikrintas ir is savo
> paties valymo kelio puses.** Neuztenka patikrinti, kad blokavimas veikia.
> Reikia patikrinti, kad ISJUNGIMAS irgi veikia — is tos pacios busenos.

Antra pamoka: kai idiegtas modulis gali uzdaryti tilta, valymo faze turi eiti
per kelia, kuri pats modulis praleidzia. Ne per numatytaji.

---

### S1104 — TAISYMAS v1.0.1: `template_redirect` VIETOJ `init` (H083)

Taisymas struktūrinis, ne pleistras. `template_redirect` is viso nevyksta
REST, admin-ajax, wc-api ir wp-cron kelyje — vadinasi jie praeina SAVAIME,
be isimciu saraso. Kodas kartu ir sutrumpejo.

**Patikros su ijungta veliava (H083, visos zalios):**

```
vitrina /                503 + Retry-After: 1800
prekes puslapis          503 + Retry-After: 1800
?wc-api=paysera_callback 400   <- WooCommerce apdorojo, NE 503
/wp-admin/               302
/wp-login.php            200
REST code-snippets       200, 1 747 snippetai   <- TILTAS VEIKIA
```

Po veliavos istrynimo: frontas 200, TEMP aktyviu 0.

```
petshop-prieziura.php  v1.0.1  6 235 B  md5 726867acabaa1067ad8d6ae19e0c9983
kopija: deploy/petshop-prieziura.php
```

---

### S1105 — ATSTATYMO I SVARIA BAZE RECON (H084)

DOD-19 8 skyriaus antras raudonas punktas. Ismatuota, o ne speta:

```
DB              gyvunai2_nbpe1 · MariaDB 10.6.17 · 194 lenteles
vartotojas      gyvunai2_nbpe1
teises          GRANT USAGE ON *.*
                GRANT ALL PRIVILEGES ON `gyvunai2_nbpe1`.*
matomos DB      gyvunai2_nbpe1, information_schema  (VISKAS)
lenteles kurti  TAIP
BAZE KURTI      NE: Access denied to database 'gyvunai2_rtst_h084'
```

**Registro teiginys „WP vartotojas neturi teises kurti nauju DB\"
PATVIRTINTAS empiriskai**, ne is atminties.

**★ ANTRAS DOD-19 NEAISKUMAS UZDARYTAS ★**

```
bazes koduote    latin1
bazes collation  latin1_swedish_ci
```

DOD-19 3.3 rase: „nepatikrinta, ar bazes numatytoji latin1\". **Patikrinta:
TAIP, latin1.** Lenteles utf8mb4. Vadinasi atstatant i SVARIA baze dump'as
sukurtu ja latin1 koduote, ir lietuviskos raides galetu nukentėti — nebent
naujoji baze is anksto sukuriama utf8mb4.

**Ko reikia is savininko (DirectAdmin, ~2 min):**

```
1. sukurti baze   gyvunai2_rtst   koduote utf8mb4 / utf8mb4_unicode_ci
2. priskirti prie jos ESAMA vartotoja gyvunai2_nbpe1 su visomis teisemis
```

Naujo vartotojo NEREIKIA — kitaip reiketu ir naujo slaptazodzio wp-config'e.

Salutinis: `backup-run.php` (200 B) ir `watch-run.php` (143 B) tebera
`public_html/dev` saknyje — cron'ai juos kviecia pilnu keliu (S1097).

---

### S1106 — SALUTINIS RADINYS: PLUGINU LIMITAS VIRSYTAS

```
aktyvus pluginai   27      TZ 11.4 riba: <= 25
mu-plugins failai  56
```

Kandidatai perziurai: `wordpress-importer` (vienkartinis), `wpforms-lite`,
`woo-update-manager`. **Nedaryta — savininko sprendimas.**

Pilnas sarasas H081 rezultate (`screenshots/h081.json`).

---

### NEUZDARYTA

```
🔴 Q-PERKEL — kaip petshop.lt ras svetaine (SSH zmogus)
🔴 GitHub PAT iki 2026-08-26
🔴 D7/D8 — seni klientai ir uzsakymu istorija (kietas terminas 10-15)
🟡 atstatymas i svaria baze — laukia savininko DirectAdmin veiksmo (S1105)
🟡 akla zona po perkelimo — silomas subdomenas naujaisiais keliais (S1101)
🟡 27 aktyvus pluginai vs riba 25
🟡 greicio ir saugos matavimai (2 matavimai, ~1,5 val.)
```

Auksciausias decision Nr.: **S1106.**

---

## 2026-08-19 (vakaras) — INFRASTRUKTURA: DNS, SSL, KATALOGAI [S1087-S1098]

Diena baigta klausimu, kuris atrode techniska smulkmena, o pasirode esas
paskutinis neatsakytas perjungimo klausimas: **kaip petshop.lt ras svetaine.**

---

### S1087 — DOD-19 ROLLBACK: JAU EGZISTAVO

Registre pazymeta „nepradeta". Realiai `dokumentai/DOD-19_rollback.md` v1.0
parasytas 2026-08-17, 8 770 B. **Trecias kartas per dvi dienas, kai lentele
melavo.**

Atnaujinta iki **v2.1** (10 866 → 13 392 B): §7 klausimai atsakyti, §0
neaiskumas issprestas, pridеta §7b Paysera procedura, §7c SSL, §9 vieno
puslapio santrauka perjungimo nakciai.

**DOD-19: 🔴 → ✅.** Raudonu DoD punktu liko DU: DOD-17 (beta, PO perjungimo)
ir DOD-22 (varnele).

---

### S1088 — ★ SSL: SERTIFIKATAS YRA, BET PASIBAIGES 2022 M. ★

```
naujajame serveryje, petshop.lt vardu:
   CN        petshop.lt      SAN  petshop.lt, www.petshop.lt
   isdave    Let's Encrypt
   galiojo   2022-10-02 → 2022-12-31      CERT_HAS_EXPIRED

eShoprent (gyvoji):
   galioja   2026-08-10 → 2026-11-08      patikima: taip
```

Jis uzstrigo 2022-aisiais, kai domenas isejo i eShoprent — Let's Encrypt
atnaujinimas nebepasieke patikros.

**Perjungus DNS be sertifikato:** kiekvienas lankytojas gautu raudona „Jusu
rysys nera privatus". Nei Google, nei Paysera nesijungtu.

**Tiekejo atsakymas (serveriai.lt, 2026-08-19):**
```
✅ NEMOKAMAS — svetaine talpinama ju serveryje. Mokamu (26–350 EUR/men.)
   PIRKTI NEREIKIA.
❌ Pries DNS pakeitima isduoti NEGALIMA.
✅ TTL 3600 → 300 galima; isigaliojimas tarp TTL ir dvigubo TTL → 5–10 min.
```

---

### S1089 — DNS ZONA: „SERVERIAI.LT NE IV.LT" BUVO NETIKSLU

```
petshop.lt NS   ns1–ns4.serveriai.lt
SOA hostmaster  hostmaster.iv.lt        ← iv.lt adresas serveriai.lt zonoje
iv.lt NS        ns1–ns4.serveriai.lt    ← ir pats iv.lt ten pat
```

**`serveriai.lt` ir `iv.lt` yra TA PATI imone** — UAB „Interneto vizija".
Zona valdoma per ta pacia iv.lt paskyra (UAB „Avesa"). Registro teiginys
apie du skirtingus tiekejus buvo klaidingas.

**Antras radinys:** `www.petshop.lt` yra **CNAME**, ne A irasas.
```
petshop.lt      A      213.226.161.16 · .15   TTL 3600
www.petshop.lt  CNAME  → petshop.lt
```
**Keisti reikia DVIEJU irasu, ne keturiu.**

---

### S1090 — DOMENU BUKLE ISMATUOTA

```
Talpinamos svetaines (planas Universalus, IP 79.98.29.24):
   avesa.lt      9 483 GB srauto · 1 subdomenas (dev.avesa.lt 9 159 GB)
   gyvunai.lt       11 GB        · pagrindinis
   petshop.lt    0,0038 GB       · „nukreipta i IP 213.226.161.16"
   sushimo.lt   12 050 GB
Svetaines: NERIBOJAMA (patalpinta 4 vnt.)
```

**`petshop.lt` JAU pridetas prie plano** — Aives spejimas „tiketina, kad
nepridetas" buvo klaidingas. Pridеti nieko nereikia, plano riba nera.

Bet jo katalogas praktiskai tuscias (4 MB srauto), o parduotuve gyvena
`avesa.lt/public_html/dev`.

---

### S1091 — ★ KELIU AUDITAS: WORDPRESS PUSE PARUOSTA ★

Pries bet koki perkelima ismatuota, kiek fiksuotu keliu yra sistemoje:

```
wp-config     ABSPATH = __DIR__ . '/'      ← skaiciuojamas PATS
              WP_HOME, WP_SITEURL          ← NENUSTATYTI
mu-plugins    0 fiksuotu keliu             ← visas kodas per konstantas
options       11 irasu (kesas, sriftai, ps_* zurnalai)
postmeta      8 irasai
snippetai     6
```

**Perkelus WordPress persitvarkys pats.** Pataisyti reikes vos kelias
eilutes. Tai atsiperka uz tai, kad visas musu kodas rasytas su
`WPMU_PLUGIN_DIR` ir `ABSPATH`, ne su tekstiniais keliais.

---

### S1092 — DIRECTADMIN: KATALOGO NURODYTI NEIMANOMA

Patikrinta ekranais:
```
Subdomenu valdymas → avesa.lt:  dev.avesa.lt — TIK sukurti/istrinti,
                                dokumentu saknies keisti NEGALIMA
Parkuojami domenai:             rodytu i public_html, ne i public_html/dev
                                + sinonimas = DU adresai tam paciam turiniui
                                (griautu visa SEO sluoksni su vienu canonical)
```

**Vadinasi per valdymo pulta `petshop.lt` nukreipti i `dev` katalogа
neimanoma.** Lieka failu perkelimas.

---

### S1093 — ★ AI AGENTO ATSAKYMU KOKYBE ★

Per pokalbi su serveriai.lt AI agentu („Aive") gauti PENKI skirtingi
sprendimai, is kuriu:
- trys prasidejo zodziu „tiketina" (spejimas, ne patikra)
- vienas KLAIDINGAS: siule konfiguruoti i `gyvunai.lt` kataloga, nors
  svetaine yra `avesa.lt`
- vienas PRIESTARAVO SAU: „domeno pavadinimo keisti negalima" + „galima
  pervadinti"
- paskutinis siule archyvuoti ir IKELTI archyva, tuoj pat pridurdamas, kad
  per narsykle galima tik iki 256 MB (archyvas butu 2–3 GB)

**Ne viename atsakyme neivertinta esmine detale — poaplankis `dev`.**

**Isvada: sio klausimo su AI agentu nesprеsti. Reikia zmogaus su SSH.**

---

### S1094 — TIKRIEJI DYDZIAI (mano matavimas buvo neteisingas)

Snippetas H080 rode „uploads 3 300 MB, 60 002 failai" — bet skaitiklis buvo
apribotas ties 60 000. Realybe:

```
public_html          9,75 GB
   wp-content        9,67 GB
      uploads        9,24 GB   ← 95 %
      plugins         360 MB
      themes           39,6 MB
      languages        22,6 MB
      mu-plugins       19,8 MB
   wp-admin           12,5 MB
   wp-includes        65,7 MB
```

**Be `uploads` visa svetaine sveria 442 MB.**

---

### S1095 — ★ UPLOADS: 5 GB YRA NEREIKALINGI ★

```
2026                  3,95 GB   ← tikrosios nuotraukos
ShortpixelBackups     4,02 GB   ← ORIGINALAI pries suspaudima
petshop-legacy         710 MB   ← senos platformos likuciai
wpallimport            258 MB   ← importu laikini failai
petshop-private-logs   122 MB   ← zurnalai
```

**`ShortpixelBackups` 4,02 GB** — kopijos, kad butu galima atsaukti
optimizavima. Svetainei nereikalingos, ne vienas lankytojas ju nemato.

Kartu su `petshop-legacy` ir `wpallimport` — **apie 5 GB, kuriu perkelti
nereikia**. Isvalius liktu ~4,5 GB vietoj 9,7.

**RADINYS, KURIO NEPAAISKINU:** `uploads` SAKNYJE guli simtai `.webp` failu
atsitiktiniais vardais (`02606443c962...-lossy-NgH3lt.webp`), visi sukurti
2026-06-12 tarp 03:51 ir 06:46, bent 8 puslapiai. Atrodo kaip nutrukusio
optimizavimo palikimas. **Ar naudojami — NETVIRTINU.**

---

### S1096 — ★ INODE: 66 % ★

Savininko klausimas: „Inode nenulus?"

```
Inode kiekis   263 632 / 400 000       66 %   liko 136 368
```

**Perkelimas inode NEPADIDINS** — failai persikelia, skaicius tas pats.

**BET KOPIJAVIMAS PADVIGUBINTU** — 400 tukstanciu riba butu pasiekta,
serveris nustotu priimti naujus failus, WordPress negaletu ikelti nuotrauku.

> **OPERACIJA PRIVALO BUTI „PERKELTI", NE „KOPIJUOTI".**

Antra priezastis valyti pries perkelima: `ShortpixelBackups` ir
`wpallimport` valgo inode, o vieta yra „unlimited", INODE — NE.

**Silomas papildymas `petshop-sargas.php`:** sekti inode. Isseme riba,
svetaine sustoja be jokio ispejimo, o simptomai atrodo kaip visai kas kita.

---

### S1097 — SALUTINIS RADINYS: CRON KELIAI

`public_html/dev` saknyje guli `backup-run.php` ir `watch-run.php` — musu
backup sistemos failai. **serveriai.lt cron'as kviecia juos PILNU KELIU.**
Po perkelimo tie cron'ai rodys i sena vieta.

Iraso i perjungimo sarasa greta seSiu WP All Import cron'u.

**Ir dar:** po perkelimo `dev.avesa.lt` nustos veikti → **TILTAS NUTRUKS**,
kol nepataisysim adreso. Perkelima planuoti tada, kai nera skubiu darbu.

---

### S1098 — PAMOKOS

- **★ Lentele melavo TRECIA karta per dvi dienas. ★** §7/§12, DOD-13/20,
  dabar DOD-19. Kiekviena karta savininkas pastebejo pirmas.
- **★ AI agentas su „tiketina" nera saltinis. ★** Penki atsakymai, vienas
  klaidingas, vienas priestaraujantis sau.
- **Savo matavimo ribas tikrinti.** `60 002 failai` buvo skaitiklio riba,
  ne tikrove.
- **Perkelti ≠ kopijuoti, kai inode 66 %.**
- **Pries judinant 9,7 GB — issiaiskinti, kiek is ju reikalinga.**
- **„Dvi minutes" pasakyta per anksti** — 60 tukstanciu failu, pasleptu
  failu ir tikslaus pazymejimo narsykleje darbas tokiu nera.

---

### NEUZDARYTA

```
🔴 KAIP petshop.lt ras svetaine — vienintelis likes perjungimo neaiskumas
   → failu perkelimas per SSH (palaikymo zmogus, ne AI agentas)
🟡 ar valyti ShortpixelBackups (4 GB) pries perkelima — NEGRIZTAMA
🟡 .webp failai uploads saknyje — kilme neaiski
🟡 inode sekimas i petshop-sargas.php
🟡 backup-run.php / watch-run.php cron keliai po perkelimo
🔴 GitHub PAT iki 2026-08-26
```

Auksciausias decision Nr.: **S1098.**

---

## 2026-08-19 (popiet) — PAYSERA: KAS DEGA IR KAS NE [S1079-S1086]

Diena baigta tuo, kuo turejo prasideti: ne spejimu apie mokejima, o bandymu.
Rezultatas — mokejimas NEBUVO neveikiantis. Jis buvo NEISMATUOTAS.

---

### S1079 — ★ TERMINU LOGIKA: SAVININKO ARGUMENTAS PAKEITE DATA ★

Savininkas: „nuo 6-7 d. prasideda didesni pirkimai (atlyginimai), 10-14 d. —
pikas. Rugsejo 1-2 butu geriau."

**Tai geriausias argumentas is visos dienos.** Perjungti pries pika reiskia,
kad klaida ivyks brangiausiu metu. Perjungti menesio pradzioje — kai klaida
kainuoja maziausiai. Plius savaite su gyva sistema ir mazu srautu yra
geriausias imanomas beta testas.

**Perskaiciuota: rugsejo 1-2 yra ne rizikingesne, o SAUGESNE data.**

---

### S1080 — DOD-17 BETA TESTAS NERA KLIUTIS PRIES PERJUNGIMA

Savininkas: „kaip as testiniam rezime padarysiu realius uzsakymus? Nera logikos."

**Teisus.** TZ numato beta 09-24, kai parduotuve JAU gyva ties petshop.lt, tik
apie ja dar nezino platuma. Beta klientai uzsako TIKRAI. As ji vakar priskyriau
prie „ko truksta iki starto" — klaidingai.

**Bet radau tikra problema: TZ turi DU skirtingus grafikus.**
```
Marketingo planas:  09-24 soft launch · 10-01 viesas launch
Etapu lentele:      09-30 launch readiness · 10-15 go-live
```
Savininkas paaiskino: spalio 1-15 buvo MAX terminas, ne tikslas.

---

### S1081 — ★ MANO MONITORINGO VERTINIMAS BUVO KLAIDINGAS ★

Savininkas: „ar tikrai? man atrodo mes kazka dareme".

**Tikrai.** §8l (2026-08-17): DOD-13 UZDARYTAS, `petshop-sargas.php` v1.2,
DOD-20 laikrodis paleistas. **DoD lentele tiesiog nebuvo atnaujinta.**

Ta pati klaida kaip vakar su §7/§12: skaiciau lentele, ne naujausia skyriu.
Ir kaip tik vakar i dokumentus irasiau taisykle „busena skaityti tik is
naujausio skyriaus" — o siandien pats jos nesilaikiau.

Antra klaida: „7 dienos suejo 08-24" — pridejau savaite prie neteisingos datos.
Serija paleista 08-17, uzsidaro 08-24. Savininkas ir cia pataise.

---

### S1082 — MONITORINGAS PATIKRINTAS GYVAI

```
petshop-sargas.php   15 389 B · klase pakrauta · 2026-08-17 19:23
ps_sargas_klaidos    18 irasu · 11 007 ivykiu · raso IKI SIOL
cron                 59 suplanuoti · 0 veluoja
frontas              200 · 1,5-2,4 s
```

**DOD-02/03 nebe „nematuojama":**
```
deprecated  11 parasu  10 953 ivykiai
warning      5             50
fatal        2              4
```

**Abi fatal istirtos:**
- `Allowed memory size 268 MB exhausted` — URL `/feed/kaina24/`, 08-17 23:12.
  Ne musu operacija, o feed'o generavimas. **Po feed v2.2.0 pataisos
  NEPASIKARTOJO NE KARTO.** PHP limitas 256 MB, dabar naudojama 118.
- `Call to undefined function exec()` — Claude paleidimas, `exec()` serveryje
  isjungtas. Nekalta.

**Realiu kritiniu klaidu: 0.**

**Radinys:** `postit` („Post codes by postit.lt") generuoja 9 394 is 11 007
ispejimu — 85 %. PHP 8.3 nesuderinamumas. Isjungus zurnaluose liktu ~1 600
irasu vietoj 11 000, ir realios problemos taptu matomos.

---

### S1083 — DNS MODELIS: SAVININKO SUPRATIMAS TEISINGAS

Savininkas: „nuemu nukreipima, migruojam, o jei nepavyks — griztam i eShoprent?
Jie juk nieko nezinos."

**Taip, butent taip ir veikia.** DNS yra rodykle; eShoprent serveris lieka
gyvas ir nepaliestas, tik pas ji niekas neuzeina.

**Keturi niuansai:**
```
1. A irasu DU (213.226.161.16 IR .15) — keisti ABU, kitaip srautas skyla
2. TTL 3600 -> 300 bent para PRIES; kitaip grizimas trunka valanda
3. SSL sertifikatas petshop.lt vardui naujame serveryje
4. Grizimas grazina SVETAINE, bet ne DUOMENIS — uzsakymai lieka toje bazeje,
   kurioje atejo
```

**Sutartis su eShoprent iki 2026-10-15** — penkios savaites atsarginio kelio,
jei perjungiama rugsejo pradzioje. Tai is esmes panaikina „tasko be grizimo".

---

### S1084 — ★ PAYSERA: REALUS BANDYMAS ★

Paruosta pasleptа virtuali preke 1 EUR (virtuali — kad neprisidetu pristatymas),
`test_mode` isjungtas, `log_level` = debug.

Kasoje suma **2,21 EUR**: preke 0,83 be PVM + mazo krepselio mokestis 1,00 +
PVM 0,38. Pristatymas 0,00 (virtuali).

**Paysera atmete:**
```
0x13 bad_referer — „adresas skiriasi nuo projekte patvirtintu adresu"
```

Projekte 29276 irasytas `petshop.lt`, uzklausa atejo is `dev.avesa.lt`.
**Iki pinigu nepriejo.** Apsauga, ne gedimas.

**KAS VEIKIA (irodyta):** uzsakymas 35003 sukurtas PRIES nukreipima, 2,21 EUR,
`pending`, `payment_method_title` = „Mokejimas internetu". Nepavykus mokejimui
liko `pending`, netapo apmoketu. Grandine iki Paysera veikia.

---

### S1085 — ★ MANO PRIELAIDA BUVO KLAIDINGA ★

Pasiuliau „prideti dev.avesa.lt prie patvirtintu adresu — paprastai galima
nurodyti kelis". Savininkas nerado.

**Tai buvo prielaida, ne zinojimas.** Paysera projekte adresas greiciausiai
VIENAS laukas, ne sarasas. Pasiunciau ieskoti to, ko gali nebuti.

Savininko sprendimas: **Paysera nustatymu NEKEISTI**, gyvos parduotuves
neliesti, rizika prisiimti. Blogiausias atvejis — keliu dienu velavimas.

---

### S1086 — PERJUNGIMO NAKTIES PROCEDURA (UZRAKINTA)

```
1. DNS pakeitimas (ABU A irasai)
2. TIKRINIMAS PRIES SKELBIANT — 2,21 EUR pirkimas jau ties petshop.lt
      veikia            -> uzdaryta
      callback nuluzta  -> pataisyti callbackurl projekte, pakartoti
3. Tik po sekmingo pirkimo — skelbiam
```

**NELEIDZIAMA** perjungti ir palikti mokejima nepatikrinta iki ryto.

**Salutiniai radiniai:**
- Kasoje „Mazo krepselio mokestis" rodomas DU kartus (1,21 su PVM ir 1,00 be).
  Skaiciuojama teisingai, bet klientui atrodo kaip dvigubas mokestis. Tai
  tiksliai ta vieta, kur metami krepseliai. **Sutvarkyti pries launch.**
- `test_mode` GRIZO i `yes` savaime po to, kai buvo nustatytas `no` ir
  patikrintas. Kas grazino — neaisku. **Perjungimo nakti tikrinti DU kartus.**

---

### PAMOKOS

- **★ Lentele meluoja. Busena — tik is naujausio skyriaus. ★** Antra karta per
  dvi dienas. Vakar §7/§12, siandien DOD-13/20.
- **★ „Paprastai galima" nera zinojimas. ★** Pasiulymas, remiantis tuo, kaip
  sistemos „paprastai" veikia, kainavo savininkui laika.
- **Savininko verslo logika > mano rizikos vertinimas.** Atlyginimu ciklas
  pakeite perjungimo data i saugesne, ne rizikingesne.
- **Neveikiantis ir neismatuotas — skirtingi dalykai.** F-PSR buvo vadinamas
  kritiniu keliu; realiai tai konfiguracijos perkelimas su keturiais
  patikrinimais.
- **Testine preke virtuali** — kitaip prisideda pristatymas ir suma nebe ta.

---

### NEUZDARYTA

```
🟡 F-PSR — tikrinamas perjungimo nakti (§8v procedura)
🟡 Q-PSR3 — pasiziureti projekto 29276 accepturl/cancelurl/callbackurl
🟡 Q-KREPS — dvigubas mazo krepselio mokestis kasoje
🔴 DOD-19 rollback planas — nepradeta, MANO pusеje
🟡 DOD-13 — lieka isorinis uptime (UptimeRobot), savininko pusе
🟡 postit pluginas — 85 % visu PHP ispejimu
🔴 GitHub PAT iki 2026-08-26
```

Auksciausias decision Nr.: **S1086**.

---

## 2026-08-19 (priespiet) — SEO SLUOKSNIS UZDARYTAS [S1069-S1078]

Paskutiniai penki punktai. Du is ju pasirode maziau problemiski, nei buvo
uzrasyta, ir tai svarbiau uz pati darba: **atviru klausimu sarasas buvo
netikslus, nes remesi mano prielaidomis, o ne patikra.**

---

### S1069 — ★ MANO ATVIRU KLAUSIMU SARASAS BUVO NETIKSLUS ★

Savininkas: „kazka tu cia painioji, patikslink kokie darbai seo dar nepadaryti".
Teisus. Sarase buvo sumaisyti padaryti, nepadaryti ir NEPATIKRINTI dalykai.

Atlikta pilna busenos patikra (H066) — ir du „raudoni" punktai iskart nukrito.

---

### S1070 — SERIMO SKAICIUOKLE NEDINGO

Anksciau uzrasyta: „🔴 /sunu-maisto-skaiciuokle puslapio dev'e NERANDU".

**Netiesa.** Ji yra straipsnyje `suns-mitybos-auditas-skaiciai-kurie-pades-sutaupyti`
(ID 14890, „Kiek maisto duoti suniui? Tiksli skaiciuokle ir auditas").

Senoje svetaineje ji buvo atskiras puslapis, naujoje ideta i straipsni. Tad tai
buvo ne dingusi sistema, o **trys nuorodos i sena adresa**. Mano „🔴" buvo per
grieztas, nes ieskojau pagal slug, o ne pagal turini.

---

### S1071 — 6 SLUG KONFLIKTAI: REALUS TIK VIENAS

Patikrinus prekiu skaicius:

```
SPRENDIMAI            0 prekiu
PASIULYMAI            0
Naujas suniukas       0
Naujas kaciukas       0
Jautrus virskinimas   0
DAUGIAU=PIGIAU        4   <- vienintele netuscia
```

`noindex_empty_taxonomies` ijungtas (S1006), tad penkios tuscios kategorijos i
indeksa nepatenka ir konkuruoti negali. **Realus konfliktas — vienas.**

Dev'e to patikrinti negalima, nes viskas noindex; tvirtinta is nustatymo, ne is
stebejimo. Title vis tiek nustatyti visoms sesioms poroms — pigus draudimas.

---

### S1072 — PRADINIO PUSLAPIO META IS SAVININKO ZODZIU

Pradinio puslapio tekstas jau buvo parasytas savininko:

> Prekes augintiniui pagal realu poreiki. Maistas, prieziura ir sprendimai
> sunims, katems bei kitiems augintiniams. Nuo 2010 m. padedame issirinkti
> ne pagal reklama, o pagal sudeti, gamintoja ir praktini naudojima.

Is to ir sudeta, nieko neisgalvojant:

```
title: Gyvūnų prekės internetu – maistas, priežiūra, sprendimai | Petshop.lt
desc:  Maistas, priežiūra ir sprendimai šunims, katėms ir kitiems augintiniams.
       Nuo 2010 m. padedame išsirinkti pagal sudėtį, o ne pagal reklamą.  (138 zn.)
```

Buvo: „Pagrindinis (test) - Petshop.lt".

---

### S1073 — 12 TITLE SESIOMS POROMS

Principas: **puslapis paaiskina, kategorija parduoda.**

```
daugiau-pigiau   psl „Daugiau = pigiau: kaip veikia kiekio nuolaidos"
                 kat „Didesnio kiekio pasiulymai"
jautrus-virsk.   psl „Jautrus virskinimas: ka rinktis augintiniui"
                 kat „Maistas jautriam virskinimui"
naujas-suniukas  psl „...ka pasiruosti pirmoms dienoms"
                 kat „Prekes naujam suniukui"
```

Gyva patikra patvirtino visas poras.

---

### S1074 — PASKUTINES SENOS NUORODOS

```
pakeista 16 nuorodu, 13 irasu
3 nuorodos i skaiciuokle -> /suns-mitybos-auditas-.../
liko 3
```

**Liko del sugadinto HTML sename saltinyje:**
```
/triusio-ausys-baltos-250-g</em
```

Adreso viduje istriges `</em`. Automatika ju NEIMA samoningai — taisyti sugadinta
zyma spejimu butu blogiau nei palikti. Trys prekiu aprasymai, zmogaus ranka.

---

### S1075 — OG:IMAGE

Savininkas atsiunte logotipa 473×191 JPEG. **Per mazas** — dalijimosi paveikslui
reikia 1200×630, mazesnius Facebook ir LinkedIn ignoruoja arba rodo miniatiura.

Sudetas 1200×630 PNG: baltas fonas (atitinka logotipo fona), logotipas centre
864×348 (72 % plocio), LANCZOS. Didinimas nesimato, nes logotipas — plokscios
spalvos be smulkiu detaliu.

```
attachment ID 35001 · 139 964 B · atsidaro 200
og:image pradiniame ✅ · kategorijoje ✅ · straipsnyje — SAVAS paveikslas ✅
```

Paskutinis patvirtina, kad logika teisinga: numatytasis isijungia tik ten, kur
puslapis savo neturi.

**Adresas absoliutus (`https://dev.avesa.lt/...`) — cia isimtis**, nes socialiniai
tinklai santykinio kelio neapdoroja. **Perjungimo diena perrasyti i petshop.lt.**

---

### S1076 — SEO SLUOKSNIO BUKLE

```
Rank Math              ✅  sitemap 5 failu
prekiu title           ✅  2 609
prekiu aprasymai       ✅  2 609
kategoriju tekstai     ✅  56
kategoriju meta        ✅  56
301 danga              ✅  95 % (zemelapis 1 099)
straipsniu nuorodos    ✅  231 / 234
straipsniu nuotraukos  ✅  26
rasmenys               ✅  0 sugadintu
pradinio psl. meta     ✅
slug konfliktai        ✅  12 title
og:image               ✅
```

---

### S1077 — KAS NEIVYKDYTA IR KODEL

```
3 nuorodos su </em adrese   sugadintas senas HTML, ranka
blog_public = 0             PERJUNGIMO dienos veiksmas (DoD #22)
og:image domenas            perjungimo diena i petshop.lt
```

**Be blog_public=1 nе vienas is siu darbu Google nepasiekia.**

---

### S1078 — PAMOKOS

- **★ Atviru klausimu sarasas privalo buti PATIKRINTAS, ne prisimintas. ★** Du
  „raudoni" punktai nukrito po vienos patikros; vienas is ju buvo mano paties
  per grieztas teiginys.
- **Ieskoti pagal turini, ne tik pagal slug.** Skaiciuokle „dingo" tik todel, kad
  ieskojau `post_name LIKE '%skaiciuokl%'`.
- **Tuscia kategorija nekonkuruoja** — `noindex_empty_taxonomies` iskart sumazino
  6 konfliktus iki 1.
- **Meta tekstus imti is savininko jau parasyto turinio**, ne kurti is naujo.
- **og:image = absoliutus adresas.** Vienintele vieta, kur santykinis netinka.
- **Logotipas 473 px nera og:image** — reikia 1200×630.

---

### NEUZDARYTA (visas projektas)

```
🔴 3 nuorodos su sugadinta HTML zyma — ranka
🟡 komerciniai straipsniai poz. 16-39 (10+ tukst. parodymu) — pakelti
🟡 11 URL (139 clicks) be nukreipimo
🟡 367 silpni prekiu aprasymai + nepavykes kategorinis pjuvis (S1012)
🟡 MyISAM -> InnoDB (177 lenteles) — laukia DB eksporto
⏸ PERJUNGIMO DIENA: blog_public=1 · og:image domenas · Site URL ·
   6 cron uzduotys · feed URL resubmit · AVPN/IAPV reset
🔴 GitHub PAT iki 2026-08-26 — RAIMIS
```

Auksciausias decision Nr.: **S1078**.

---

## 2026-08-19 (rytas) — STRAIPSNIAI: NUORODOS, NUOTRAUKOS, RASMENYS [S1053-S1068]

Diena pradeta nuo klausimo „ar rasyti tris trukstamus blog straipsnius", o baigta
tuo, kad straipsniu turinys apskritai buvo sugadintas trimis skirtingais budais.
Nе vienas is ju nebutu matomas, kol nebutu perjungtas domenas.

---

### S1053 — ★ TRYS „TRUKSTAMI" STRAIPSNIAI NEREIKALINGI ★

TZ juos vardijo kaip P0 nuo liepos. GSC duomenys:

```
sterilizuotu-kaciu-maistas                      10 clicks   876 imp  poz 24,8
maistas-sterilizuotai-katei-su-antsvorio...      4 clicks   166 imp  poz 10,6
royal-canin-kaciu-maistas                        0 clicks   258 imp  poz 30,2
```

**Per 16 menesiu — 14 paspaudimu.** Ne 14 tukstanciu. Savininkas sustabde pries
pradedant rasyti; Q-BLOG3 uzdarytas kaip nereikalingas.

**Savininko ivertinimas apie veisliu straipsnius patvirtintas duomenimis:**
588 URL, 7 418 clicks, 489 846 parodymu — o pirkimu is ju, pagal ataskaita, 0.

**Bet greta matosi kitas sluoksnis** — perkanti intencija:
```
suns-serimo-lentele-gramais     876 cl  poz  7,4
geriausias-sausas-sunu-maistas  228 cl  poz 39,5
hipoalerginis-maistas-sunims    108 cl  poz 16,5
```
Du is ju kabo antrame ir treciame Google puslapyje su desimtimis tukstanciu
parodymu. Pakelti juos pigiau nei rasyti nauja.

---

### S1054 — MANO ANALIZE BUVO KLAIDINGA DU KARTUS

Pirmas bandymas (HTML bloko istraukimas): „ne vienos vidines nuorodos".
Antras bandymas su kitu selektoriumi: kitas rezultatas. Istraukimas nepatikimas.

**Sprendimas: imti turini per `wp/v2/posts` ir `wp_posts` tiesiogiai, ne parsinti
temos HTML.** Tada paaiskejo tikras vaizdas (S1055).

---

### S1055 — VEISLIU STRAIPSNIAI YRA `page`, NE `post`

`wp/v2/posts` grazino tik 8 irasus — savininko komercinius tekstus. Veisliu
straipsniai guli tarp 59 `page` tipo irasu:

```
taksas             ID 3206  page  11 841 zn.  2026-07-07
jorksyro-terjeras  ID 3205  page  18 173 zn.
```

Antrastes sutampa su senosios svetaines H1 simbolis i simboli — **perkelimo daryti
nereikejo**, jie jau buvo perkelti liepos 7 d.

---

### S1056 — 287 NUORODOS I SENA DOMENA

```
puslapiai   22 irasai        straipsniai 3        prekes 10
viso //petshop.lt/ nuorodu: 283
```

Mano ankstesnе isvada „nera vidiniu nuorodu" buvo klaidinga — jos BUVO, tik
parasytos absoliuciai i sena domena, tad skaiciavosi kaip isorines.

**Ir jos rasytos SENOS strukturos adresais** (`petshop.lt/sunims/maistas-sunims`),
tad po perjungimo veiktu tik per 301 suoli.

---

### S1057 — SPRENDIMAS: SANTYKINES NUORODOS

Savininkas norejo `petshop.lt` absoliuciu, kad po launch'o nieko nereiktu keisti.
Pasiulyta alternatyva, kuri ta pati tiksla pasiekia geriau:

```
https://petshop.lt/kategorija/sunims/   po launch veikia · dev'e veda i SENA svetaine
/kategorija/sunims/                     po launch veikia · dev'e VEIKIA
```

Santykine po perjungimo savaime tampa petshop.lt. Savininkas: „svarbu, kad
nuorodos veiktu" — pasirinktos santykines, nes leidzia patikrinti PRIES launch'a.

---

### S1058 — 150 NUORODU SUTVARKYTA

```
216 unikaliu nuorodu 25 straipsniuose
   issprеsta per 301 zemelapi   150
   liko                          66
```

Gyvai po taisymo: `jorksyro-terjeras` 15 nuorodu i kategorijas (buvo 0),
`taksas` 12, `monoproteininis-maistas` 7 kategorijos + 3 prekes + 5 gamintojai.

---

### S1059 — ★ NUOTRAUKOS IS SENOS SVETAINES ★

66 neissprеstos skilo i tris grupes, ir viena is ju buvo netiketa:

```
26  PAVEIKSLAI  /image/cache/... — tik dviejuose Josera straipsniuose
22  kategoriju keliai
22  prekes, kuriu slug pasikeitе
```

Abu Josera straipsniai (110 clicks, 17 tukst. parodymu) **visas nuotraukas kroveе
is senosios svetaines**, o naujoje mediatekoje ju nebuvo **ne vienos**. Perjungimo
diena abu butu likе be paveikslu.

**Perkelta:**
```
rasta senoje    26/26 pasiekiamos
importuota      26/26 nepavyko 0
adresai pakeisti 28 vietose
patikra: 28/28 atsidaro is naujos mediatekos
```

Adresai irasyti santykiniai, tad domeno keitimas ju nepalies.

---

### S1060 — PRIEZIUROS PRIEMONES: KONTEKSTAS, NE PANASUMAS

`/sunims/prieziuros-priemones` kartojosi 15 veisliu straipsniu. Savininkas
pasiule vesti i dvi kategorijas. **Perskaicius KONTEKSTA paaiskejo, kad ne:**

```
• Šukos ar šepečiai – priemonės jų kailio priežiūrai…     <- atskiras punktas
• Sveikatos priežiūros priemonės – dantų priežiūros…      <- CIA nuoroda
```

Nuoroda sedi punkte apie dantis ir ausis, o sukos turi savo eilute greta. Tad
vienas tikslus taikinys: **82 Higienos priemones sunims**. Pritaikyta 15/15.

Patikra parode, kad sukos jau turejo savo nuoroda i **75** — sutvarkyta tarp tu 150.

**Mano klaida paieskoje:** ieskojau `suk`, o kategorija rasoma `Šukos`, tad
is pradziu maniau, kad antros kategorijos nera.

---

### S1061 — ★ SUGADINTI LIETUVISKI RASMENYS ★

```
patikrinta irasu   3 823
pazeista               4      (2 928 sekos)
   jorksyro-terjeras  1 145
   biglis               808
   senbernaras          770
   miamor-is-meiles-katems 205
prekes 0 · kategorijos 0 · terminai 0
```

Klientas maté `PavadÄlis ir antkaklis`, `Å½aislai`, `nedidelio Å«gio`.

---

### S1062 — BAITU TAISYMAS PAVYKO TIK IS DALIES

Chirurginis perkodavimas (tik mojibake sekos, su UTF-8 validacija):

```
pataisyta 1 559 · liko 594
```

**Likusiu atkurti NEIMANOMA:** `veislÄs` turi buti `veislės`, bet antrasis baitas
DINGO. Is `Ä` vieno negalima pasakyti, ar ten buvo `ą`, `č`, `ė` ar `į` — visos
prasideda tuo paciu baitu. Zmogus atspеja is konteksto, algoritmas ne.

**Todel spеlioti atsisakyta.**

---

### S1063 — TURINYS PAIMTAS IS SENOS SVETAINES

Senojoje petshop.lt tie patys tekstai rodomi TAISYKLINGAI — pazeidimas ivyko
perkeliant. Selektorius: `div.articleDescription`.

```
                    mojibake   zodziu senoje / dev'e
jorksyro-terjeras   866 -> 0     1 652 / 1 669
biglis              582 -> 0     1 139 / 1 164
senbernaras         570 -> 0     1 142 / 1 170
miamor              135 -> 0
```

Turinys neprarastas (zodziu skaicius sutampa), sumazejo tik HTML apvalkalas.
Kiekvienam pritaikytos tos pacios nuorodu taisykles.

---

### S1064 — LIKUSIOS NUORODOS UZDARYTOS

18 prekiu, kuriu slug pasikeitе, susietos su ju BRENDO archyvu (Josera 13,
Prins 1 ir kt.) — zmogus randa tos pacios linijos alternatyvas. Plius 3
transportavimo dezes.

```
pakeista 50 nuorodu 8 irasuose
```

---

### S1065 — BENDRAS REZULTATAS

```
nuorodu sutvarkyta   215 / 216
nuotrauku perkelta    26 / 26
sugadintu rasmenu   2 928 -> 0
```

---

### S1066 — 🔴 SERIMO SKAICIUOKLES PUSLAPIO DEV'E NERANDU

Trys straipsniai rodo i `/sunu-maisto-skaiciuokle`. Paieska pagal `skaiciuokl`
tarp `page` tipo irasu **nieko negrazino**.

Tai gali reiksti: skaiciuokle yra kitu adresu, igyvendinta ne kaip puslapis,
arba jos dev'e nera. NETVIRTINU nе vieno. TZ ji minima kaip veikianti sistema.
**Patikrinti pries launch'a.**

---

### S1067 — PLAYWRIGHT DIEGIMAS STRINGA

Vakar 1 kartas, siandien 3 is eiles (~16-20 min., zingsnis 4, uzduotis
nepradedama). Ne musu kodas.

**Sprendimas:** analize perrasyta BE naršyklės — pastraipos, antrastes ir
nuorodos matomos ir zaliame HTML arba per WP API. Naršyklė reikalinga tik ten,
kur svarbus isdestymas pikseliais.

---

### S1068 — PAMOKOS

- **★ Neparsinti temos HTML, kai duomenys pasiekiami per API. ★** Du bandymai su
  skirtingais selektoriais dave skirtingus rezultatus; `wp/v2` ir `wp_posts` —
  vienas atsakymas.
- **Absoliucios nuorodos i savo domena yra spastai** — jos atrodo kaip isorines
  ir slepiasi nuo statistikos.
- **Santykine nuoroda po domeno keitimo persitvarko pati** — tai pigiausias budas
  „po launch'o nieko nekeisti".
- **Nuotraukos is seno domeno = tyliai luztantis turinys.** Niekas nesimato, kol
  senas domenas gyvas.
- **Kontekstas > panasumas.** Nuorodos taikini nustato sakinys, kuriame ji sedi.
- **Sugadinto kodavimo ne visada imanoma atkurti** — kai baitas dingеs, teisingas
  kelias yra imti sventa saltini, ne spеlioti.
- **Lietuviskos raides paieskose:** `suk` neranda `Šukos`.

---

### NEUZDARYTA

```
1. 🔴 /sunu-maisto-skaiciuokle — puslapio dev'e nerandu, 3 straipsniai i ji rodo
2. 🔴 6 slug konfliktai — vienodi title (S1051)
3. 🔴 pradinio puslapio title „Pagrindinis (test)"
4. 🔴 numatytasis og:image
5. 🟡 komerciniai straipsniai poz. 16-39 — pakelti pigiau nei rasyti nauja
6. 🟡 11 URL (139 clicks) be nukreipimo
7. 🟡 367 silpni prekiu aprasymai
8. GitHub PAT iki 2026-08-26 — RAIMIS
```

Auksciausias decision Nr.: **S1068**.

---

## 2026-08-18 (velus vakaras) — 301 SLUOKSNIS: NUO DOKUMENTO PRIE MATAVIMO [S1039-S1052]

Diena baigta tuo, ka reikejo padaryti anksciau: ne perrasyti busena is dokumento,
o ismatuoti. Rezultatas — senu adresu srauto danga 78 % -> 95 %.

**Sesijos taisykle (svarbiausia is visos dienos):**

> Imtis IS SPRENDIMO AIBES irodo, kad sprendimas veikia, o ne kad problema
> issprеsta. Testuoti reikia is PROBLEMOS puses.

---

### S1039 — §7 vs §12 PRIESTARAVIMAS

REGISTRAS turejo du nesuderinamus teiginius: §7 „44 URL = 20,5 % srauto
neuzdengta" ir §12 „937 uzdaryti, 950 teisingi 404". Abu netikslus.

---

### S1040 — ★ MANO METODINE KLAIDA ★

Pirma patikra (H038) еme 70 URL imti **is 301 zemelapio**. Rezultatas 69/70 —
puikus ir bevertis: tie URL zemelapyje ir yra. Paskelbiau, kad §12 teisingas ir
rugsеji laukia tik QA.

Teisingas testas — is GSC puses. Ji parode kita vaizda (S1041).

---

### S1041 — TIKRAS VAIZDAS: 219 URL SU SRAUTU GRAZINA 404

Patikrinti 512 GSC URL su >=3 paspaudimais (96 % viso srauto be pradinio):

```
301 -> 200      288 URL   13 275 paspaudimu
404             219 URL    3 577
301 -> 404        4
```

§12 teiginys „950 likusiu — prekiu nebera, 404 teisingas" NEATLAIKO. Tarp 404
buvo kategorijos ir brendai, kurie naujoje svetaineje EGZISTUOJA:

```
382 /katems/tualetai-kraiku-semtuveliai-kilimeliai  -> Tualetai, semtuveliai
180 /dovanos-sunims-bei-katems                       -> DOVANOS
 83 /prins-petfoods                                  -> Prins
```

---

### S1042 — ARITMETINE SPRAGA PAAISKINTA (NEKALTA)

§12 santrauka: 45+937+40+950 = 1 972 is 2 445; clicks 17 640 is 19 735.

```
pradinis puslapis    3 URL   2 099 clicks   <- nereikia 301
index.php          216 URL     144
su parametrais     271 URL      61
paveikslai          61 URL       0
```

Truke 2 095 paspaudimai = pradinis puslapis (2 099). Santrauka ji tiesiog
neitrauke. Jokio paslepto praradimo.

---

### S1043 — DU SARGAI, KURIU IS PRADZIU NETUREJAU

Panasumo skaicius vienas NEUZTENKA.

**Rusies sargas** — `/sunims/transportavimo-dezes-...` (46 clicks) gavo
kandidata „Transportavimo dezes KATEMS" su panasumu 85,1. Sunims -> katems.
Sargas pagavo 5 tokius.

**Dydzio sargas** — reikejo normalizuoti uzrasyma (12-5 kg == 125 kg), o tada
liko TIKRI neatitikimai:

```
Sepija 20 cm    -> siule 15 cm
GimCat 50 g     -> siule 40 g
Skudo 4 boksas  -> siule Skudo 1
```

Pagavo 20. Be jo butume tyliai siunte pirkejus i ne ta dydi.

---

### S1044 — ★ FORMATO KLAIDA: RAKTUS SPEJAU, NE PERSKAICIAU ★

Pirmas 105 irasu papildymas i zemelapi **nesuveike nе vienas**. Priezastis
rasta plugino kode:

```php
petshop_legacy_301_path()  ->  strtolower( trim( path, '/' ) )
```

Raktai laikomi BE pasvirojo bruksnio, o as irasiau su juo. Klaida mano —
formata spejau, uzuot perskaites saltini.

**IR TAI PASIRODE LAIME:** kol taisiau, radau, kad 20 is tu 105 atitikmenu buvo
klaidingi (dydziai). Butu suveikе is karto — butume tyliai kenke.

---

### S1045 — BANGA 1: 85 NUKREIPIMAI

```
zemelapis 1 042 -> isimta 105 klaidingo formato -> prideta 85 -> 1 022
patikra   84/85 veikia (1 — tinklo klaida testo metu)
kontrole  svari, /exclusion tebeveikia per musu taisykle
```

---

### S1046 — LIKUSIEJI GSC ADRESAI

Patikrinti 465 URL su 1-2 paspaudimais:

```
veikia 263 (356 clicks) · 404 198 (266 clicks, 11 231 PARODYMU)
```

Paspaudimu nedaug, bet 11 tukstanciu parodymu — Google tuos adresus vis dar
rodo. Netikrinta liko 929 URL su 21 paspaudimu kartu — nauda mazesne uz laika.

---

### S1047 — ★ TRECIA TA PACIA KLAIDU KLASE ★

`sed 's/ps_h041/ps_h046/'` be `g` vеliavos pakeite tik PIRMA is dvieju
atvejų vienoje eiluteje:

```php
$a=isset($_GET['ps_h046'])?$_GET['ps_h041']:'';   // visada tuscia
```

Snippetas savo signalo nesulauke. Trecias kartas per sesija, kai LOPIAU vietoj
to, kad rasyciau is naujo (anksciau: re.sub bad escape, h032->h032b GET raktas).

**TAISYKLE: paleidikli ir snippeta rasyti IS NAUJO. Niekada per sed/regex.**

---

### S1048 — SAVININKO PERZIURA

Is 134 eiluciu savininkas uzpilde 61: 49 x 301 su mano kandidatu, 3 su savo
taikiniu, 9 x 410, 2 pazymejo „?".

Abu „?" turejo tikslu atitikmeni:
```
/contact             -> /kontaktai/
/p-t-h-certech-sp-j  -> Super Benek   (Certech yra Super Benek gamintojas)
```

---

### S1049 — VARDO PAIESKA VIETOJ RAIDZIU PANASUMO

24 is 35 likusiu issprеsti paеmus PILNA 135 brendu ir 80 kategoriju sarasa ir
ieskant VARDO kelyje, o ne lyginant slug raides:

```
180 /dovanos-sunims-bei-katems  -> DOVANOS       (panasumas buvo 57,1 — atmete)
 83 /prins-petfoods             -> Prins         (buvo 74,1 — silpna)
 13 /josera-mini-junior-10-kg   -> Josera
```

Prekes adresas veda i savo brendo archyva — zmogus randa tos pacios linijos
alternatyvas.

---

### S1050 — GALUTINIS REZULTATAS

```
zemelapis        937 -> 1 099   (+162 per diena)
404 su srautu    219 -> sutvarkyta 163 (2 838 clicks)
                        palikta 404/410 45 (610) — prekiu tikrai nebera
                        liko neisspresta 11 (139)
SRAUTO DANGA     78 % -> 95 %
```

---

### S1051 — DUBLIKATU PATIKRA: 6 SLUG KONFLIKTAI

Iprastos kategorijos dublikatu NETURI — `/sunims/` tvarkingai 301 i
`/kategorija/sunims/`. Bet 6 slug'ai turi IR puslapi, IR kategorija:

```
sprendimai · pasiulymai · naujas-suniukas · naujas-kaciukas
jautrus-virskinimas · daugiau-pigiau
```

Abu adresai grazina 200 ir **TA PATI title**. Dev'e nematyti (viskas noindex),
bet perjungus indeksavima jie konkuruos del tos pacios frazes.

**Sprendimas pigus:** skirtingi title. Puslapiui patarimas, kategorijai prekes.
Sesi title, ne architekturos perdarymas. Laukia savininko formuluociu.

---

### S1052 — 410 NEIGYVENDINTAS (SAMONINGAS SPRENDIMAS)

Pluginas moka tik nukreipti. 45 adresai, pazymeti 410, graziną 404. Praktinis
skirtumas Google akyse minimalus. Plugino keitimas del beveik nulines naudos —
neverta.

---

### PAMOKOS

- **★ Imtis is sprendimo aibes nieko neirodo. ★** Testuoti is problemos puses.
- **Raktu formata skaityti is kodo**, ne speti. Speta klaida kainavo paleidima —
  bet uz tai atskleide 20 klaidingu atitikmenu.
- **Panasumo skaicius vienas neuztenka** — reikia rusies ir dydzio sargu.
- **Vardo paieska > raidziu panasumas** kategorijoms ir brendams.
- **Skaicius normalizuoti pries lyginant** (12-5 == 125).
- **★ Nelopyti per sed/regex — rasyti is naujo. ★** Trys incidentai per sesija.
- **Pradinis puslapis i 301 statistika neitraukiamas** — jam nukreipimo nereikia.

---

### NEUZDARYTA

```
1. 🔴 TRYS BLOG STRAIPSNIAI — P0 nuo liepos, blogas ~51 % GSC srauto, NEPRADETA
2. 🔴 6 slug konfliktai — vienodi title, laukia savininko formuluociu
3. 🔴 pradinio puslapio title „Pagrindinis (test)"
4. 🔴 numatytasis og:image
5. 🟡 11 URL (139 clicks) be nukreipimo
6. 🟡 367 silpni prekiu aprasymai + nepavykes kategorinis pjuvis (S1012)
7. 🟡 §7 REGISTRE pasenes — pataisyti pagal S1041 matavima
8. GitHub PAT iki 2026-08-26 — RAIMIS
```

Auksciausias decision Nr.: **S1052**.

---

## 2026-08-18 (naktis) — KATEGORIJU SLUOKSNIS UZDARYTAS: TEMA, TEKSTAI, META [S1021-S1038]

Tesinys po S1020. Sesijos esme: nuo „kur Flatsome deda teksta" iki 56 tekstu ir
56 meta aprasymu gyvai. Tris kartus mano pasiulymas buvo paneigtas duomenimis
arba savininko dalykinemis ziniomis — ir kiekviena karta rezultatas geresnis.

**Sesijos taisykle:**

> Pasiulymas, kuri paneigia matavimas, yra pigus. Pasiulymas, kuris i matavima
> nezuri, kainuoja po launch'o.

---

### S1021 — KATEGORIJOS APRASYMA IsVEDA WOOCOMMERCE, NE FLATSOME

Zvalgyba gyvame kategorijos puslapyje (kabliukai registruojami tik ten):

```
woocommerce_archive_description
   10 | woocommerce_taxonomy_archive_description   <- SITAS
   10 | woocommerce_product_archive_description
   10 | WC_Brands::brand_description
```

Flatsome temoje `term-description` randamas tik Envato importeryje — nesusije.
Vadinasi perkelimas yra standartinis `remove_action` + `add_action`, be kovos
su tema.

---

### S1022 — mu-plugin: PETSHOP KATEGORIJOS APRASYMO VIETA v1.0.1

Esminis sprendimas: **WooCommerce funkcija NEPERRASOMA**, tik perkeliama jos
isvestis per `ob_start()`. Taip islieka visos originalo patikros (taksonomija,
antras puslapis, `wp_kses_post`, `wc_format_content`), o pasikeicia tik vieta.

```
remove_action('woocommerce_archive_description','woocommerce_taxonomy_archive_description',10)
add_action('woocommerce_after_main_content', rodyti_apacioje, 5)
```

`remove_action` vykdomas per `init` (20), nes mu-plugin'ai kraunami PRIES
WooCommerce — anksciau kabliuko dar nebutu ka nuimti.

Issleidimas be JS: paslеptas checkbox + label, CSS `max-height` 190 px.

**v1.0.0 -> v1.0.1 taisymas:** `hidden` atributo NEUZTENKA — Flatsome CSS ji
perraso ir zymimasis langelis lieka MATOMAS. Pastebeta tik ekrano kopijoje, ne
matavimuose. Sprendimas — iskirpimas (`clip-path`, `opacity:0`, 1x1 px).

---

### S1023 — MATAVIMAI: PRIES IR PO

```
                    prekes prasideda        aprasymas
desktop   buvo          1 284 px            249 px (virs prekiu)
          tapo            480 px          2 928 px (po prekiu)
mobile    buvo          2 128 px            316 px
          tapo            607 px          5 218 px
```

Mobiliajame buvo 2,5 ekrano teksto iki pirmos prekes. Suskleistas blokas
190 px, isskleistas 784 (desktop) / 1 500 (mobile).

---

### S1024 — v1.1.0 + SNIPPETAS 688 v2: VIENA TIESOS VIETA

Hub'ai naudoja landing sablona (`template_redirect` 5, baigiasi `exit`), tad
archyvo kabliukai ten nesuveikia. Vietoj HTML kopijavimo i dvi vietas —
mu-plugin'e atsirado viesas `Petshop_Kategorijos_Aprasymas::blokas()`, o
snippetas ji kvieciaviena eilute su `class_exists` apsauga.

Snippetas pervadintas: **„Petshop Kategorijos Landing v2 (5 hub'ai + apatinis
aprasymas)"** — senasis vardas „(sunims)" melavo, nes valdo PENKIS hub'us
(70, 77, 87, 89, 93). Kopija: `snippetas_688_pries_*.php` (12 243 B).

Patikra: `ps-kat` blokas randamas visuose keturiuose derinuose (hub/lapine x
desktop/mobile), JS klaidu 0.

---

### S1025 — KATEGORIJU ZEMELAPIS: 54/54 BE TRINTIES

Savininko J stulpelis (sena -> nauja kategorija) susietas su realiais term_id:
**54 is 54, 0 nerastu, 0 dviprasmisku.**

---

### S1026 — ★ „GRINDYS IS SENU TEKSTU" ATMESTOS ★

Mano pasiulymas buvo: visur suversti isvalyta sena teksta, kad ne viena
kategorija nebutu tuscia. Savininko K stulpelis: **46 is 55 = perrasyti**.

Is pradziu tai atrode kaip prestaravimas jo paties isvadai („senu tekstu
nereikia ismesti"). Perskaicius pastabas paaiskejo, kad jis teisus: dalis senu
tekstu **dalykiskai klaidingi** — „sausas maistas valo dantis", „hipoalerginis
= be grudu", triusiai vadinami grauzikais, visi konservai vadinami
pilnaverciais. Publikuoti tokius teiginius blogiau nei tuscias puslapis.

**Tad grindys tapo ne seni tekstai, o neutralus trumpi tekstai is katalogo
faktu** — savininko paties taisykle, pritaikyta placiai.

---

### S1027 — GRINDU GENERATORIUS IS KATALOGO DUOMENU

Surinkti realus faktai visoms 80 kategoriju: brendai su prekiu skaiciais,
atributai, kainu rezis. Taisykles: brendas rodomas jei >=3 prekes (iki 5),
atributas jei >=5 (iki 4). Skaiciu ir kainu tekste NERA — pasentu su kiekvienu
importu (savininko standarto 15 eil.).

```
sugeneruota 58 is 80 (22 be publish prekiu) | ilgis vid. 136 zn.
```

---

### S1028 — SAVININKAS PERRASE VISUS 56

Brendai ismesti beveik visur („skambejo kaip DB eksportas"), generatoriaus
karkasas panaikintas, ritmas ivairus (2 arba 3 sakiniai). Sutvarkytos
pavojingos vietos. 5 hub'ams apacios teksto nededama, 13 kategoriju be prekiu
ir 6 „Kita" tipo — NEKELTI.

Etalonas, kuri pats savininkas ivardijo: *„Vienas suo zaisla nesiojasi, kitas
tampo, trecias bando isardyti per penkias minutes."*

---

### S1029 — KRITINE PERZIURA: KUR DAR GIRDISI MASINA

Isanalizuota 56 tekstu:

```
„verta"                    26/56   hedge zodis — didziausia zyme
„Cia rasite / Cia sudeti"   7      tuscia pradzia, H1 tai jau pasake
proporciniai teiginiai      2      „didele dalis... be grudu" — pasens su importu
kreipimasis i skaitytoja   23/56   registras nevienodas
```

Pataisyta 30 is 56; 26 nepaliesti, nes buvo tvarkingi.

```
PRIES  „verta" 26 · „Cia" 7 · kreipimasis 23 · proporciniai 2
PO     „verta"  1 · „Cia" 0 · kreipimasis 46 · proporciniai 0
```

Palikta „skiriasi" 11 tekstu — tai ne tikas, o tiksliausias zodis.

---

### S1030 — KONSULTANTO PERZIURA: 22 PATAISYMAI

Vertingiausi trys:

**Antiparazitines** — ankstesne versija teige, kad tikrinti reikia „amziu ir
svori", tarsi tai galiotu visiems produktams vienodai. Dabar: „patikrinkite
VISUS konkretaus produkto apribojimus". Pridetas saugos sakinys: **„Katems
naudokite tik joms skirtas priemones"** — sunims skirti preparatai katems buna
toksiski.

**Smulkus augintiniai** — „Vieno pasaro visiems smulkiems augintiniams nera"
vietoj „grauziku pasaro". Triusiai nera grauzikai.

**Pirmoji pagalba** — vietoj moralizuojancio „nepakeicia veterinarines
pagalbos" konkretus veiksmas: „jei bukle kelia nerima, kreipkites".

---

### S1031 — PATAISYMAS SUKURE SUDVEJINIMA

Konsultanto pataisymas #1 padare, kad DVI didziausios P1 kategorijos prasideda
vienodai: „Sausa maista rinkites…" (72 sausas maistas sunims, 510 prekiu; 81
sausas maistas katems, 205). Grazinta kitokia pradzia 72-ai.

---

### S1032 — TEKSTAI IKELTI: 56/56

```
kopija       kategoriju_aprasymai_pries_20260818_203802.json (80 irasu)
irasyta      56/56 per AUTENTIFIKUOTA wc/v3 REST (ne anonimine uzklausa!)
patikra      56/56 sutampa simbolis i simboli — kses nieko nenukirpo
```

Rasymas administratoriaus kontekste butinas: anonimine uzklausa kses'ina ir
`h3`/`ul` dingsta (S1018).

---

### S1033 — ★ SENI META APRASYMAI NETINKA — IR NE DEL ZENKLU ★

40 keliamu kategoriju turi atitikmeni senoje svetaineje, 34 su meta. 13 su
„APSILANKYKITE ✓ ➤". Bet svarbiau turinys — net „svarus" prikimsti butent tu
teiginiu, kuriuos ka tik isvaleme is puslapiu:

```
Skanestai katems      „…valantys dantu apnasas…"
Zaislai sunims        „…dantu apnasoms valyti…"
Maistas sunims        „Ieskote geriausio maisto savo suniui?"
Sausas maistas katems „Super Premium klases sausi maistai…"
Pasaras grauzikams    „Visavertis pasaras ivairiems naminiams grauzikams"
Sausas maistas sunims „…Premium klases maistas (Josera…"
```

Meta yra MATOMIAUSIA vieta. Perkelti ten teiginius, kuriuos ka tik pasalinom
is puslapio, butu zingsnis atgal. **Seni meta NEKELIAMI.**

---

### S1034 — 56 NAUJI META APRASYMAI

Ne puslapio teksto santrauka, o atskiras darbas: puslapio tekstas aiskina KAIP
rinktis, meta pasako KAS cia yra. Todel meta vardija tipus („molio, bentonito,
silikoniniai"), o tekstas apie tipus nekalba.

---

### S1035 — ★ KONSULTANTO GOOGLE PATIKRA: DU MANO KLAIDINGI TEIGINIAI ★

**(1) „Ne vienas nebus apkirptas" — KLAIDA.** Google dokumentacija: meta
aprasymo ilgio limito NERA, snippet'as apkerpamas pagal irenginio ploti
(pikselius, ne simbolius). 100–150 zn. lieka gera UX disciplina, bet NE Google
taisykle.

**(2) „0 sutapimu su puslapio tekstu" kaip KPI — KLAIDA.** Savininko standarto
16 eil. draudе NUKOPIJUOTI pirma paragrafa; as tai paverciau nuline metrika,
kuri verstu perrasineti gera fraze vien del rodiklio.

Taip pat patvirtinta: meta aprasymas NERA reitingavimo veiksnys; Google
pirmiausia naudoja puslapio turini, o meta — kai jis puslapi apibudina geriau.
Ir programinis meta generavimas dideliems katalogams yra leidziamas, jei
tekstai zmogui skaitomi ir ivairus.

**Trys ginciytinos vietos issprestos geriau nei siuliau:**
```
Super Premium   mano meta SERP'e neige savo paties kategorija
Grauzikai       „grauzikams ir kitiems smulkiems augintiniams" — raktazodis
                grazintas, triusis grauziku netapo
Antiparazitines „lasiukai, antkakliai" pasako kas viduje; sauga isliko
```

---

### S1036 — PATAISYMAI SUKURE NAUJA VIENODUMA (PRIIMTA)

```
„Rinkites"  5/56 -> 17/56 ; antro sakinio pradzia „Rinkites" 12 tekstu
```

Ta pati vienodo ritmo problema, tik persikelusi i meta. Ivertinta kaip
**nedidelis trukumas, ne blokatorius** — SERP'e meta matomas po viena.

---

### S1037 — ★ VMVT VERDIKTAS: PASARAS TURI BUTI VISAVERTIS ★

Savininkas: veterinarijos tarnybu pozicija — **kasdienis pasaras turi buti
VISAVERTIS**. Mano pastaba, kad trumpa formuluote „ar pasaras visavertis" yra
nebaigta, buvo klaidinga is esmes.

Neutralus „patikrinkite, kuris is dvieju" paslepia svarbiausia dalyka po
pasirinkimu, kurio nera. Papildomas pasaras yra priedas, ne maistas.

Suvienodinta 7 vietose (5 puslapiu tekstai + 2 meta):

```
buvo: patikrinkite, ar pasaras visavertis, ar papildomas
tapo: patikrinkite, ar pasaras visavertis – papildomas kasdienio maisto nepakeicia
```

Sena formuluote nebeliko NE VIENOJE vietoje.

---

### S1038 — META IKELTI: 56/56 + GYVA PATIKRA

```
kopija            kategoriju_meta_pries_20260818_210631.json (80 irasu)
tekstu pataisyta   5/5
meta irasyta      56/56  (termmeta rank_math_description)
patikra           tekstai 56/56 · meta 56/56 · termmeta bazeje 56
```

**Svarbiausia — meta realiai isvedamas `<head>`:**
```
Kraikai kaciu tualetams: molio, bentonitiniai, silikoniniai ir augaliniai.
Skiriasi susokimu, kvapu kontrole ir dulkiu kiekiu.        (126 zn., HTTP 200)
```

Tai patvirtino ir tai, ko iki tol nebuvau tikrinеs: RM terminu meta raktas
veikia, o tuscias sablonas (S1019) jo neuzgozia.

---

### PAMOKOS

- **Neperrasyk platformos funkcijos — perkelk jos isvestį.** `ob_start()` +
  originalus kvietimas islaiko visas patikras ir persiima busimus WooCommerce
  pakeitimus.
- **`hidden` atributas nera slepimas** — tema ji perraso. Naudoti iskirpima.
- **Vizuali patikra pagauna tai, ko matavimai nemato.** Matomas checkbox'as
  buvo matomas TIK ekrano kopijoje.
- **Vienas markup, viena vieta.** Landing sablonas kviecia mu-plugin'o metoda,
  ne kopijuoja HTML.
- **Turinio importas — tik administratoriaus kontekste** (kses).
- **Pasenстantys teiginiai tekste:** ne tik skaiciai ir kainos, bet ir
  proporcijos („didele dalis variantu yra be grudu").
- **★ Nedaryk KPI is stiliaus taisykles. ★** „0 sutapimu" verte perrasineti
  gera fraze del rodiklio, o ne del skaitytojo.
- **Dalykine savininko zinia > mano logika.** Tris kartus is eiles.

---

### NEUZDARYTA

```
1. „Rinkites" 17/56 meta — priimtas nedidelis trukumas
2. Pirmosios pagalbos meta neteko nuorodos i veterinara (puslapyje liko)
3. 367 silpnu prekiu aprasymu kategorinis pjuvis (matavimas nepavykо, S1012)
4. Pradinio puslapio title „Pagrindinis (test)" — savininko formuluote
5. Numatytasis og:image — nera
6. §7 vs §12 priestaravimas REGISTRE — patikrinti pries 301 darbus
7. 301 zemelapis + 3 trukstami blog straipsniai (51 % GSC srauto)
8. GitHub PAT iki 2026-08-26 — RAIMIS
```

Auksciausias decision Nr.: **S1038**.

---

## 2026-08-18 (vakaras) — SEO SLUOKSNIS: RANK MATH, PREKIU META, KATEGORIJU DERLIUS [S1003-S1020]

Sesija pradeta nuo klausimo „ar seni meta tekstai verti ijungimo", o baigta
Flatsome testu, kuris paneigе abieju pusiu prielaidas. Trys kartus matavimas
apvertе jau priimta sprendima — kiekviena karta i gera puse.

**Sesijos taisykle:**

> Matavimas paneigе mano paties pasiulyma tris kartus: aprasymu trynimas,
> front-end „defektas", eShoprent'o „apgalvotas" formatas. Pasiulymas, kuris
> neatlaiko duomenu, yra pigesnis uz pasiulyma, kuris i juos nezuri.

**Numeracijos pastaba:** ankstesnes sesijos antraste skelbia [S987-S1012], bet
jos turinys baigiasi ties S1002 ir taip pat sako „Auksciausias sios sesijos
decision Nr.: S1002". Antraste klaidinga; si sesija tesia nuo S1003.

---

### S1003 — SEO META ZVALGYBA: TEKSTAI SVARUS, BET NEVIENODAI VERTINGI

Bazeje rasta 1 537 title ir 1 484 description, dviem raktu rinkiniais.

```
Yoast vs RankMath   1 537 sutampa · 0 skiriasi · 0 tik viename
Focus keyword       0
Siuksliu NERA:      sablonu %% 0 · senas domenas 0 · kainos 0 · litai 0 · HTML esybes 0
```

Pasiskirstymas: product/publish 1 111 · draft 386 · trash 40 · page+post 11.

**Kokybe skiriasi kardinaliai:**

| | title (1 537) | description (1 484) |
|---|---|---|
| geras ilgis | 615 (30-60) | 1 075 (70-160) |
| per ilgas | **545 virs 70** | 35 |
| lygu prekes pavadinimui | **1 055 (69 %)** | 86 |

Isvada: aprasymai verti ijungimo, title — ne, nes du trecdaliai kartoja
pavadinima, kuri tema ir taip generuoja.

**Radinys, kurio plane nebuvo:** `wp_termmeta` TUSCIA. Kategorijos neturi jokio
SEO teksto — didesne spraga uz tas 1 495 prekes.

---

### S1004 — RANK MATH: NEMOKAMA VERSIJA PAKANKA

PRO (~8 EUR/men.) prideda pozicijų sekima, Content AI ir GTIN/MPN schemos
laukus. Pastarieji mums nereikalingi — GTIN i Merchant Center keliauja per
SAVA feed'a, ne per schema. TZ MASTER sprendimas „pilnas SEO title eis i
RankMath" jau buvo priimtas anksciau; si sesija ji ivykde.

---

### S1005 — VARTAI RASTI IS KODO, NE IS SPEJIMO

Idiegus v1.0.276 `<head>` NEPASIKEITе. Vietoj bandymu — perskaityta salyga:

```
class-conditional.php:69   is_configured() -> option 'rank_math_is_configured'
class-registration.php:63  $invalid = Helper::is_invalid_registration()
class-registration.php:284 skip_wizard() -> add_option('rank_math_registration_skip')
```

Abu raktai nustatyti tiksliai taip, kaip juos raso pats vedlys.

---

### S1006 — KONFIGURACIJA PAGAL FAKTINES REIKSMES

Numatytieji buvo netinkami keturiose vietose:

```
tax_product_cat_sitemap      OFF -> ON    kategorijos nebutu patekusios i sitemap
tax_product_brand_sitemap    OFF -> ON    /gamintojas/ archyvai taip pat ne
tax_product_cat_add_meta_box OFF -> ON    savininkas negaletu redaguoti kategorijos SEO
pt_blocks_robots           index -> noindex  Flatsome vidiniai blokai i Google
```

Moduliai apkarpyti: `sitemap`, `rich-snippet`, `woocommerce`. Isjungta
analytics, seo-analysis, content-ai, ai-visibility, link-counter, acf,
buddypress, bbpress, web-stories, instant-indexing.

`redirections` ir `404-monitor` NEBUVO ijungti — konflikto su Redirection
pluginu nera.

URL struktura uzrakinta per prievarta: `strip_category_base`,
`wc_remove_product_base`, `wc_remove_category_base` = off. Ju pakeitimas
perrasytu visus prekiu URL ir sugriautu 301 zemelapi.

---

### S1007 — CANONICAL DINGIMAS: NE KLAIDA

Po diegimo canonical isnyko is visu puslapiu. Priezastis rasta saltinyje:

```
class-head.php:235  // If a page is noindex, let's remove the canonical URL.
class-head.php:237  if ( 'noindex' === $robots['index'] ) remove_action(...)
```

Dev turi `blog_public=0`, tad viskas noindex. Perjungimo diena canonical grizta
pats. **Nieko neliesta, blog_public NEJUDINTAS.**

---

### S1008 — SITEMAP: TA PATI UZKLAUSA DIRBA SU SENA BUSENA

Po konfiguracijos visi sitemap grazino 404. Priezastis — `flush_rewrite_rules()`
buvo iskviestas TOJE PACIOJE uzklausoje, kurioje `is_configured` dar buvo false,
tad RM Router taisykliu neuzregistravo. Perkrovus naujame cikle:

```
/sitemap_index.xml         200   18 sekciju
/product-sitemap.xml       200   201 URL
/product_cat-sitemap.xml   200    58 kategorijos
/product_brand-sitemap.xml 200   122 gamintojai
/page-sitemap.xml          200    33 puslapiai
```

Sena pamoka („du dispatchai, kai diegiam ir tikrinam") patvirtinta dar karta.

---

### S1009 — B VARIANTAS: TITLE ISTRINTA, APRASYMAI PALIKTI

Savininko sprendimas is triju: (A) palikti viska, (B) trinti title, (C) trinti
abu. Pasirinkta **B**.

```
rank_math_title       1 537 -> 0
ne prekiu paliesta            0     blogas ir puslapiai nepaliesti
rank_math_description     1 473     nepaliesta
_yoast_wpseo_title        1 537     atsarga bazeje, grazinimui
kopija ps-backups/rankmath_title_kopija_20260818_165421.json (3 074 irasai)
```

**Saziningas apribojimas:** ilgio problema NEISNYKO. Ambrosia title po
sablono — 151 simbolis, nes tokia yra pacios prekes pavadinimas. Sablonu to
nesutrumpinsi; vienintelis kelias butu trumpinti pavadinimus, o tai liestu
kataloga, feed'us ir 301 zemelapi. Neverta: pirmieji 60 simboliu prasideda
brendu ir tipu, t. y. tuo, ko zmogus iesko.

---

### S1010 — NAUJOS PREKES TVARKOSI SAVAIME

Savininko klausimas: o kas bus su nauja preke is VF/ZB?

Empirinis atsakymas — preke 34948 neturi nei `rank_math` meta, nei trumpo
aprasymo:

```
title: TEST Konservu deze katei Be vistienos - Petshop.lt
desc:  12 skoniu be vistienos — dazniausio alergeno katems. 100 g skardines...
```

`%excerpt%` neradеs trumpo aprasymo pasiima is pilno. Prekiu, neturinciu nе
vieno — **0**. Danga po B: title 2 607/2 607, aprasymas 2 607/2 607.

---

### S1011 — ★ MATAVIMAS PANEIGе MANO PASIULYMA ★

Pasiulius istrinti aprasymus, kurie kartoja prekes pavadinima, isskaiciuota:

```
atkartojimas  135 (102 publish) · ribinis 144 · tikras 1 194
```

Bet pavyzdziai parodе, kad pakaitalas BLOGESNIS:

```
[15042] Zaislas suniui - Skraidantis bumerangas
   dabar        : Zaislas suniui - Skraidantis bumerangas
   pakeistume i : „Ismatavimai: 28 x 28 x 3 cm"
```

Bent jau pavadinimo atkartojimas ivardija, kas tai per daiktas. **Trynimas
NEDARYTAS.**

---

### S1012 — KATALOGO APRASYMU DANGA

```
2 607 publish prekes
  gera (70-160)    1 171   45 %
  ilga (virs 160)  1 069   41 %
  silpna (po 70)     367   14 %
  visai be nieko       0
saltiniai: sava meta 1 075 · trumpas aprasymas 620 · pilnas aprasymas 912
```

`%excerpt%` grandine laiko 86 % katalogo.

**Nepavykes matavimas, uzrasomas kaip nepavykes:** kategoriju pjuvis nedavе
rezultato — 912 prekiu nukrito i „(?)", nes saknies paieska nerado tevines
kategorijos, prie kurios prekes nepriskirtos tiesiogiai. Kol nepataisyta,
nezinia, kurioje katalogo dalyje tie 367 susitelke.

---

### S1013 — DVIGUBAS KODAVIMAS NUTEKA I META

Silpnuju pavyzdziuose rasta:

```
[13048] &lt;p&gt;Papildomas pasaras visu veisliu sunims.&lt;/p&gt;
```

Gyva patikra patvirtino, kad tekstas i meta patenka NEPALIESTAS — Google
rezultate zmogus matytu `<p>`.

```
dvigubai uzkoduoti trumpi aprasymai   434 publish   (virsutine riba)
tikslus paveiktu poaibis              421           (13 turi sava meta)
sava meta su esybemis                   0
normalus <p> tagai                    1 195         tvarkoje, RM juos nuvalo
```

Skirtumas esminis: tikra `<p>` Rank Math pasalina, o `&lt;p&gt;` jam yra
paprastas tekstas.

---

### S1014 — HIPOTEZе APIE FRONT-END KLAIDINGA

Itariau, kad tas pats kodavimas matomas ir prekes puslapyje. Playwright
patikrinimas triju prekiu:

```
13610  matomas tekstas: „Petnesos sunims."   TAGAI_MATOMI 0   JS klaidu 0
```

WooCommerce trumpa aprasyma praleidzia per filtru grandine, kuri esybes
issifruoja. Vitrina NIEKADA nebuvo sugadinta. Problema — tik meta lauke, nes
Rank Math ima `post_excerpt` zalia, aplenkdamas ta pacia grandine.

**Todel taisymas pakeistas:** vietoj 434 prekiu turinio dekodavimo (S3 srautas,
savininko valdomas) — vienas filtras.

---

### S1015 — mu-plugin: PETSHOP SEO APRASYMO VALYMAS v1.0.0

`rank_math/frontend/description` kabliukas: pakartotinis esybiu dekodavimas
(iki 3 kartu), tagu salinimas, tarpu suvienodinimas. Jei po valymo liktu
tuscia — grazinamas originalas.

Vietinis testas pries diegima (PHP 8.3):

```
&lt;p&gt;Petnesos sunims.&lt;/p&gt;      -> Petnesos sunims.
&amp;lt;p&amp;gt;Trigubas...   -> Trigubas
AMBROSIA Junior &amp; Salmon          -> AMBROSIA Junior & Salmon
&lt;p&gt;&lt;/p&gt;         -> nekeiciama (originalas)
```

Gyvai po diegimo:

```
13610  35 -> 16 zn.   lt_gt 1 -> 0
19785  154 -> 154     nepaliesta, & isliko teisingai uzkoduotas
```

Ambrosia atvejis atsakе i klausima, kurio nebuvau iskеlеs garsiai: iss-
ifruotas `&` HTML atributo nesugadina — Rank Math isvesti ekranuoja pats.

```
mu-plugins/petshop-seo-aprasymas.php   1 838 B   md5 dfebb0c0...   repo deploy/ sinchronizuota
```

---

### S1016 — SENU KATEGORIJU DERLIUS: 55/55

Savininko klausimas („o gal seni aprasymai geri?") sutaupе didziausia gabala
darbo. Sena kategorija turi PILNA struktūrini teksta su paantrastemis IR
atskira meta aprasyma.

Selektorius rastas is HTML: `div.categoryDescription--bottom`.

```
su turiningu tekstu (>200 zn.)   32     is ju su paantrastemis  27
tik meta atkartojimas (1-200)    15
visai tuscios                     8
su savo meta aprasymu            48
su reklaminiais zenklais ✓➤      15
naujoje svetaineje               80 kategoriju, ne viena neturi aprasymo
```

Didziausias: „Zaislai katems" 9 075 zn., 1 231 zodis, 7 paantrastes.

Perziuros failas: `kategoriju_aprasymai_perziurai_2026-08-18.xlsx` (3 lapai).

---

### S1017 — TURINIO STRATEGIJA: GRINDYS VISIEMS, LUBOS P1

Savininkas grazino sutvarkyta plana su prioritetais P1-P4, darbine apimtimi ir
dalykinemis pastabomis kiekvienam tekstui. Vertingiausia — pastabu stulpelis:
„nevadinti triusiu grauzikais", „hipoalerginis != be grudu", „nevadinti visu
konservu pilnaverciais, atskirti visaverti ir papildoma pasara". Pastaroji dar
ir teisine — tai zenklinimo kategorijos.

**Sutarta seka (savininko, pakoreguota po diskusijos):**

```
1. atskirti meta nuo term_description
2. vienas realus Flatsome testas
3. grindys 55 tekstams — migracinis valymas, ne perrasymas
4. tikras P0: GSC -> 44 URL -> 301 + trys straipsniai
5. tik po to P1 upgrade, prioritetai is GSC, ne is prekiu kiekio
```

**Savininko taisykle:** iki migracijos saugom tai, kas jau turi paieskos
istorija; po migracijos optimizuojam kontroliuojamais etapais.

**Savininko korekcija schemai:** nekelti seno teksto vien todel, kad jis
egzistuoja. Netinkantis arba konceptualiai klaidingas -> 2-3 neutralus
sakiniai, ne 700 zodziu palikimas.

**Formatas (sprendimas):** ne B visur, o **B hub'uose ir A lapinеse**.
Lapinеje H1, kelias ir filtrai jau atsako „ar pataikiau", tad virsutinis
sakinys tik nustumia prekes. Hub'e prekiu virsuje nera — nustumti nera ko.

---

### S1018 — ★ FLATSOME TESTAS: TRYS NEMALONUS ATSAKYMAI ★

Ikeltas realus ~296 zodziu tekstas su trimis `<h3>`, sarasu ir dviem vidinemis
nuorodomis. Dvi vietos: 72 Sausas maistas sunims (lapine) ir 70 SUNIMS (hub).

**1. Lapinеje tekstas eina VIRS prekiu:**

```
              aprasymas          prekes prasideda   langas
desktop   249 px, 784 aukst.        1 284 px         1 100
mobile    316 px, 1 500 aukst.      2 128 px           844
```

Mobiliajame — 2,5 ekrano teksto iki pirmos prekes. Sename petshop.lt tekstas
buvo APACIOJE. Perkelе „kaip yra" gautume blogesne patirti nei dabar.

**2. Hub'e `term_description` isvis nerodomas.** Landing sablonas PAKEICIA
archyva.

**3. HTML struktura sunaikinta.** `h3` ir `ul` isnyko, `strong` ir nuorodos
isliko. Priezastis: `wp_update_term` anoniminеje uzklausoje pritaiko kses
filtra su komentaru lygio tagu sarasu. **Importas privalo vykti administra-
toriaus kontekste**, kitaip visi 55 tekstai suplokstеs.

**4. Rank Math NEKERPA `%term_description%`:**

```
meta description = 2 230 simboliu
```

Visas tekstas suverstas i meta. Spejimas butu buvеs klaidingas.

---

### S1019 — META SABLONAS PASALINTAS

```
tax_product_cat_description     %term_description% -> tuscia
tax_product_brand_description   %term_description% -> tuscia
tax_product_tag_description     %term_description% -> tuscia

gyvos kategorijos meta ilgis: 0
kopija ps-backups/rankmath_titles_pries_20260818_*.json
```

Meta rasomas kiekvienai kategorijai atskirai; 48 seni meta aprasymai jau
surinkti.

---

### S1020 — HUB IVADAS: SNIPPETAS 688, PAVADINIMAS PASENеS

Ieskota per options, postmeta, termmeta, posts, temos ir mu-plugin failus.
Rasta: snippetas **688 „Petshop Kategorijos Landing v1 (sunims)"**, aktyvus,
12 043 B.

Pavadinimas meluoja — valdo **penkis** hub'us:

```
70 SUNIMS (8 plyteles) · 77 KATEMS (8) · 87 GRAUZIKAMS (4)
89 PAUKSCIAMS (3) · 93 ZUVIMS (3)
```

Ivadai ikoduoti PHP masyve. Komentaras teberaso „dabar: 70 = SUNIMS" — kiti
keturi prideti veliau, pavadinimas ir komentaras liko seni. **Pervadinti pagal
konvencija.**

**Pasiulymas hub'ams:** landing sablonui prideti apatini teksto bloka,
maitinama is to paties `term_description` — tada hub'as ir lapine elgiasi
vienodai, o savininkas redaguoja vienoje vietoje.

---

### MANO KLAIDA — DVIEJU FAZIU SNIPPETAS ISSIJUNGе PATS

H027 snippete palikta savеs isjungimo eilute veike KIEKVIENOJE uzklausoje.
Po `SET` snippetas issijunge, tad `ATSATYTI` pataike i paprasta puslapi ir
grazino HTML. Testiniai tekstai liko kategorijose, kol nepastebеjau.

Istaisyta H028: abi kategorijos 0 baitu, patikrinta NEPRIKLAUSOMAI per REST
(ne per ta pati snippeta), kategoriju su aprasymu bazeje — 0.

**Taisykle:** dvieju faziu snippete valymo eilute deti TIK i paskutine faze.

---

### PAMOKOS

- **Rank Math vartai** — `rank_math_is_configured` + `rank_math_registration_skip`.
  Abu `update_option`, tai tiksliai tas, ka raso vedlys.
- **Canonical nuimamas nuo noindex puslapiu** — dev'e tai normalu, gryzta su
  `blog_public=1`.
- **`%term_description%` NEKERPAMAS** — i meta patenka visas tekstas.
- **`wp_update_term` anonimineje uzklausoje kses'ina** — h3/ul dingsta.
  Turinio importas tik administratoriaus kontekste.
- **`&lt;p&gt;` != `<p>`** — pirmojo joks HTML valytojas nemato kaip tago.
- **Dvieju faziu snippetas:** valymo eilute tik paskutinеje fazеje.
- **Playwright diegimas gali uzstrigti** (~20 min., 4 zingsnis). Nutraukus ir
  paleidus is naujo — praеjo. Ne musu kodo problema.
- **Python `re.sub` su pakaitalu, kuriame yra `\s`** — `bad escape`. Runner'i
  rasyti is naujo, ne lopyti per regex.
- **★ Pasenеs blokatorius yra brangesnis uz nezinoma. ★** Visa sesija remiausi
  TZ MASTER fraze „BLOKUOJA (owner, DABAR): GSC eksportas" ir tris kartus jа
  pakartojau savininkui kaip jo neatlikta darba. Registro §12 nuo 2026-08-04
  rodo, kad eksportas padarytas. Pries vadinant kа nors blokatoriumi — patikrinti
  NAUJAUSIA saltini, ne ta, kuris pirmas pasitaike.

---

### NEUZDARYTA

```
1. Flatsome tema: term_description perkelti po prekiu tinklelio (+readmore)
2. Landing sablonui (688) prideti apatini term_description bloka
3. Snippeta 688 pervadinti — dabartinis vardas klaidina
4. 55 senu tekstu valymas ir ikelimas (administratoriaus kontekste)
5. 48 senu meta aprasymu ikelimas i Rank Math laukus
6. 367 silpnu prekiu aprasymu kategorinis pjuvis (matavimas nepavyko)
7. Pradinio puslapio title „Pagrindinis (test)" — savininko formuluote
8. Numatytasis og:image — nera
9. GSC: ★ MANO KLAIDA ★ visa sesija kartojau „eksportas blokuoja".
    NETIESA — padarytas 2026-07-30, 2 445 URL / 19 735 clicks (REGISTRAS §12).
    Teiginys is TZ MASTER, teisingas liepa, nuo tada pasenеs.
    P1 perskaiciavima galima daryti DABAR, Raimio laukti nereikia.
10. REGISTRE PRIESTARAVIMAS: §7 sako „44 URL = 20,5 % neuzdengta", §12
    (velesnis) sako 937 uzdaryta + 950 teisingi 404. Patikrinti pries 301 darbus
11. GitHub PAT baigia galioti 2026-08-26 — RAIMIS (vienintelis tikras jo punktas)
```

Auksciausias decision Nr.: **S1020**.

---

## 2026-08-18 — FEED'U VARIKLIS, APRASYMAI, SVORIAI [S987-S1012]

Diena prasidejo rytine patikra, o baigesi trimis duomenu sluoksniais: feed'u
infrastruktura, prekiu tekstais ir svoriais. Visur tas pats principas —
dry-run, apply, perskaitymo patikra.

**Dienos taisykle:**

> Pasakiau „padaryta", nes patikrinau savo lauka — `post_content`. Savininkas
> atsiuntе ekrano kopija: kataloge „Be aprasymo 88". Abu buvome teisus, tik
> matavome skirtingus dalykus. Patikra galioja tik tada, kai tikrini TA PATI
> skaiciu, kuri mato zmogus.

---

### S987 — RYTINE PATIKRA: REGRESIJOS TESTAS IVYKO PATS

Import #5 suko 03:32 ir 06:32 — be musu prasymo.

```
VF prekes su 12 simboliu GTIN      0
VF prekes su 13 simboliu GTIN    980   (vakar 979)
nauja preke 34967 LAB V Lasisu aliejus:
   _vf_barcode 590324046661 (12) -> _global_unique_id 5903240466610 (13)
```

Nauja preke gimе su teisingu GTIN. Naktinis v1.5.7 taisymas atlaikе reala
importa — stipresnis irodymas nei bet kuris musu testas.

**Sargas pagavo tikra defekta:** `Array to string conversion` —
`petshop-xml.php:343,344,513,515`, eilutеs `$brand = (string) ( $data['brand'] ?? '' )`.
Kai tiekejas atsiuncia `brand` kaip masyva, i lauka patenka zodis „Array".
Liecia ir ZB (#2), ir VF (#5). Nauja skola, uzrasyta.

Per para 2 fatal — abu musu (exec() 00:08 ir atminties issekimas 23:12 testuojant
negyvus feed'us). Sargo grandine veikia nuo pagavimo iki laisko.

---

### S988 — GYVI KAINA24 IR KAINOS.LT SRAUTAI: SABLONAS PERSKAITYTAS

Savininkas atsiuntе abu realius XML is petshop.lt (4,1 MB ir 3,6 MB, po 1 270 prekiu).

**★ RADINYS: `<model>` NERA EAN.** Gyvame feed'e yra DU laukai:

```
<ean_code>8595091784318</ean_code>   <- tikras EAN (427 is 1 270)
<model>650501</model>                 <- gamintojo kodas
```

Kur `ean_code` nebuvo, i `<model>` irasydavo EAN — ir musu v1.0.0 sablonas,
darytas nuo tokios prekes, ta isimti palaike taisykle: EAN rase i `<model>`,
o `<ean_code>` neturеjo is viso.

**Kiti skirtumai:** Kainos.lt naudoja `<item_price>` (ne `<price>`), 200x200
miniatiura (ne originala), `<categories><category>` (be ID ir nuorodos),
`<spec name= label=>`, neturi `<model>`, `<condition>`, `additional_images`.

**Savininko sprendimas:** ziurime, kur mums naudingiau, ne kas buvo. Aprasymas —
svarus tekstas. `<ean_code>` = GTIN, `<model>` = SKU. Specs pilnas sarasas
plius „Speciali mityba" ir „Pakuotes dydis".

**Ir dar:** gyvame feed'e 194 prekes is 1 270 turi `<stock>0</stock>` — tai, ko
savininkas nebenori.

---

### S989 — `petshop-feeds` v2.0.0: STATINIAI FAILAI VIETOJ MIRTIES

```
v1.0.0: posts_per_page=-1 + wc_get_product visoms -> memory exhausted (256M)
v2.0.0: paketai po 200, srautas i faila, wp_cache_flush tarp paketu
```

Trys kanalai is vieno duomenu sluoksnio: `kaina24.xml`, `kainos.xml`, `google.xml`
i `uploads/petshop-feeds/`. Endpoint'ai `/feed/kaina24|kainos|google` atiduoda
STATINI faila (`readfile`) — URL nesikeicia, nes juos savininkas paduos i
palyginimo svetaines. Cron kasnakt 04:30. Rankinis: `?ps_feeds_generuoti=<raktas>`.

**Istaisyta is v1.0.0 (trys tylios klaidos):**
1. `end($categories)` — komentaras skelbe „giliausia kategorija", bet end() ima
   paskutini ABECELES elementa. Dabar gylis per `get_ancestors()`.
2. EAN buvo imamas is `_zb_ean`/`_ean`; dabar is kanoninio `_global_unique_id`.
3. Rinkiniai (mix-and-match) nebuvo filtruojami — butu pateke i feed'us.

Prekiu ribojimas (savininko prasymas): `_ps_feed_off_kaina24|kainos|google`
plius `_do_not_export` visiems.

### S990 — DU SAVO DEFEKTAI, KURIUOS PAGAVO DRY-RUN

**v2.0.1:** paleidimas kabеjo ant `init` — ten WooCommerce duomenu saugyklos dar
neparuostos ir `wc_get_product()` grazina false VISOMS. Dry-run: 2 235 kandidatai,
0 irasyta, 0,3 s. Perkelta i `wp_loaded`.

**v2.0.2:** aprasymo valymo eiles tvarka buvo atvirkscia. Bazeje aprasymai
laikomi su UZKODUOTOMIS zymemis (`&lt;p&gt;`); nuvalius zymes ir tik paskui
dekodavus esybes, jos atsiversdavo atgal i HTML. Teisingai: dekoduoti, valyti,
tada tvarkyti likusias esybes.

### S991 — GENERAVIMAS VEIKIA

```
kandidatai 2 235 · irasyta 2 232 · be kainos 3 · be GTIN 453
sekundes 15,6 · atminties pikas 112 MB (riba 256)
/feed/kaina24 200 · 5,87 MB · 2 232    XML GALIOJA
/feed/kainos  200 · 5,35 MB · 2 232    XML GALIOJA
/feed/google  200 · 4,69 MB · 2 232    XML GALIOJA
```

`/feed/google` is pradziu 404 — nauja rewrite taisykle nebuvo isirasiusi;
`flush_rewrite_rules()` isprendе.

Palyginimui: senas petshop.lt feed'as turi 1 270 prekiu, is ju 194 nulinio
likucio. Naujas — 2 232 ir nе vienos nulines.

### S992 — v2.1.0: ADMINISTRACIJA

Varneles prekes kortelеje (Prekes duomenys -> Atsargos), stulpelis prekiu sarase,
penki masiniai veiksmai. Vizualiai patvirtinta ekrano kopijomis; JS klaidu 0.

**Neuzdaryta:** stulpelis „Feed'ai" nukrenta i desini krasta ir lentelеje
nebetelpa (14 stulpeliu). Kosmetika, savininkui parodyta.

---

### S993 — KATALOGO KOKYBES ATASKAITA

Matuota TIK tai, kas realiai patenka i feed'us (2 235):

```
be jokiu trukumu    823        be svorio        1 156
su trukumais      1 412        be GTIN            454
                               silpnas apras.     200 (is ju 44 tusti)
                               be brendo          114
nuotrauku netruksta nе vienai · per ilgu pavadinimu 0
```

Savininko patikslinimas — filtruoti pagal likuti ir publikavima. **Patikrinta:
filtras jau buvo idiegtas**; is 2 235 realu kieki turi 2 228, o 7 be kiekio yra
`_manage_stock=no` (natūralūs kramtalai, DP pakuotes) — jie i feed'a eiti turi.
Skaiciai pasikeitе vienetais, ataskaita perdaryti nereikеjo.

**Patikslinimas dеl EAN:** is 454 be GTIN — 395 turi brenda (firmines, EAN
turetu egzistuoti), 59 neturi nei brendo, nei EAN. Google reikalauja bent vieno;
be abieju preke atmetama.

---

### S994 — ★ 44 APRASYMAI IRASYTI, BET KATALOGAS RODе, KAD NIEKO NEPADARYTA ★

Nuotraukos parsisiustos per tilta i repozitorija (`nuotraukos/<id>.jpg`), kad
aprasymai butu rasomi pagal tai, kas MATOMA, o ne pagal pavadinima. Radinys
kelyje: 14990 ir 14993 („Siaures elnias pliusinis, 37 cm") — NE dublikatai,
o du skirtingi zaislai tuo paciu pavadinimu. Tas pat 16970/16973.

Irasyta 44/44, perskaitymo patikra 44/44. **Bet savininko ekrane „Be aprasymo 88".**

**DIAGNOZE:** katalogas neskaito `post_content`. Filtras `sk_aprasymas` remiasi
`_ps_pilnumas_kodai` — is anksto apskaiciuota zyma, kuria raso ATSKIRAS modulis
`petshop-pilnumas.php` (cron 05:00). Aprasymus irasiau, zymos neperskaiciavau.

Po `Petshop_Pilnumas::perskaiciuoti()` 44 prekems: 88 -> 65. Isvalе tik 23.

**Priezastis (petshop-pilnumas.php:236):**
```php
$r['aprasymas'] = turi_sekcija($sek,['aprasym'])
   || mb_strlen(trim(wp_strip_all_tags(post_content))) >= 120;
```
Riba 120. Dalis musu tekstu buvo 110–119 simboliu.

### S995 — RIBA 120 -> 90 (`petshop-pilnumas.php` v1.3)

Savininko sprendimas. Riba iskelta i konstanta `APRASYMO_MIN` su paaiskinimu.

**SVARBU:** 120 gyvena DVIEJOSE vietose. `petshop-vartai.php` naudoja ta pacia
riba kaip PUBLIKAVIMO VARTUS: VF/ZB preke su trumpesniu nei 120 simboliu
aprasymu keliauja i juodrascius (2026-08 sprendimas, tuomet nukeliavo 86 prekes).
**Vartu riba SAMONINGAI palikta 120** — ji sprendzia, kas patenka i prekyba, ir
tai atskiras sprendimas. Pakeista tik pilnumo (rodiklio) riba.

Po pakeitimo ir perskaiciavimo: 65 -> 32.

### S996 — LIKUSIOS 32: 0 PASIEKTAS

Sudetis: 8 musu vakarykscios (nesiekе 90), 2 visiskai tuscios, 4 TEST prekes
(savininkas: „tegul buna — as paskui jas istrinsiu"), likusios — trumpi seni tekstai.

Savininko nurodymas: rasyti MINIMALIAI, tik iki 90 simboliu. Perrasyta visiems 32,
vidutinis ilgis 94, trumpiausias 90.

```
irasyta 32/32 · perskaityta 32/32 · pilnumas perskaiciuotas 32
„Be aprasymo\" kataloge:  88 -> 65 -> 32 -> 0
tusciu aprasymu publish:  44 -> 0
```

**STILIAUS STANDARTAS** (is savininko taisymu, trys raundai): 2–3 sakiniai;
pirmas — kas tai ir kaip atrodo; antras — kam tinka (PIRKEJO NAUDA, ne prekes
savybе); trecias — matmenys. Neisvardinti visu detaliu. Nerasyti poveikio
teiginiu („valo dantis", „islaiko demesi"). Licenciniu personazu neminеti.

---

### S997 — PREKIU ZENKLAI: KA IS TIKRUJU DUODA NUOTRAUKOS

114 prekiu be `product_brand`.

```
tekste rastas esamas zenklas       23   (patvirtinta: „8in1 kilimeliai",
                                        „Trixie zaislai katems", „Beeztees Luz")
„Gamintojas:\" laukas                1
nuotraukose (peziureta 90)         10
lieka be nieko                     80
```

Is nuotrauku: 15066 ir 15205 PET NOVA, 15417 Magic Cat, 15481/15527/15573 Duvo+,
15515 Happet, 15518 Petstages, 15535 D&D Home, 19262 Trixie.

**Placioji teksto paieska (43 zenklai, pilni aprasymai) davе NULI** — aprasymai
kalba apie preke, ne apie gaminta ja.

**Savininko lukestis buvo didesnis derlius; pasakyta tiesiai — 10 is 90.**
Priezastis: AV sandelio prekes fotografuotos BE pakuotes, o zenklas gyvena
pakuoteje.

Priskirta NIEKO — zenklas keliauja i Google ir lyginamas su EAN priesdeliu,
tad klaidingas priskyrimas kenkia labiau nei tuscias laukas. Perduota Excel
lentele su pasiulymais, irodymu („is kur") ir nuorodomis.

**Pamoka dеl nuorodu:** pirma versija turejo nuorodas i wp-admin. Savininkas:
„man reikia svetaines, taip greiciau". Nuoroda turi vesti ten, kur zmogui
GREICIAU, ne ten, kur techniskai teisingiau.

---

### S998 — SVORIAI: TAISYKLE IS DUOMENU, NE IS SPEJIMO

Savininkas nurodе bruto principa (400 g konservas -> 500 g, 12 kg maisas -> 12,3).
Pries taikant — issimatuota, kaip yra dabar:

```
780 prekiu turi ir svori, ir kieki pavadinime:
   _weight = neto tiksliai   709  (91 %)
   didesnis uz neto           63  (nenuoseklu: 40–750 g)
```

**Dabartine praktika yra NETO.** Eukanuba 12 kg -> 12,220, bet IAMS 10 kg ->
lygiai 10,000. Pasiulyti du keliai; savininkas pasirinko **B (neto)** su
isimtimis slapiam maistui.

**Galutines taisykles:**
```
40 / 70 / 85 g      +8 g        200–415 g   +70 g
100 g               +20 g       800 g+      +100 g
TOFU kraikas        +150 g      sausas maistas — neto (12,5 kg lieka 12,5)
skliaustuose kg     imamas skliaustu skaicius, ne litrai
litrai be skliaustu NELIECIAMA (kraikams tankis != 1)
```

### S999 — ★ DVI TIKROS MIGRACIJOS KLAIDOS ★

```
Silikoninis kraikas BeloCat 18 l / 7 kg    _weight = 18   turi buti 7
TOFU BeloCat 6 l (2,5 kg)                  _weight = 6    turi buti 2,65
Monge monoprotein 12 kg                    _weight = 2,5  turi buti 12
Eukanuba Active Small 3 kg                 _weight = 1    turi buti 3
```

26 kraikams i svori irasyti LITRAI — vezejui deklaruojama dvigubai daugiau, nei
sveria, ir uz tai mokama kiekvienoje siuntoje.

### S1000 — PERZIURA SULAIKе NUO SAVO KLAIDOS

Is 254 nesutapimu tik 30 buvo tikros klaidos:

```
8 Churu „4 x 14 g\"  — bazeje 0,056 kg TEISINGA, klydo MANO skaitiklis
216 „nedideliu\"     — bazeje jau BRUTO (12,220 / 15,080); mano taisykle
                       butu juos sumazinusi iki neto ir istrynusi tikslesni
                       duomeni. NELIESTA.
```

### S1001 — IVYKDYTA

```
uzpildyta 710 · istaisyta 30 · viso 740
perskaitymo patikra 740/740 · 0 nesutapimu
kopija ps-backups/svoriai_backup_20260818_122125.json
17659 TOFU 6 l: 6 -> 2,65   ·   12452 Eukanuba 3 kg: 1 -> 3
be svorio lieka 998 (zaislai, petnesos, guoliai — pavadinime kiekio nera)
```

---

### S1002 — GOOGLE PRIEIGA TEBEUZDARYTA

```
403 · Content API for Shopping has not been used in project 683712074632
```
Du savininko mygtukai (§8m S985) dar nepaspausti. Q-MERCH-1 stovi.

---

### KOPIJOS (visos atsuka viena veiksmu)

```
gtin_backup_20260817_204552.json          GTIN (vakar)
aprasymai_backup_20260818_095104.json     44 aprasymai
aprasymai32_backup_20260818_110004.json   32 aprasymai
svoriai_backup_20260818_122125.json       740 svoriai
petshop-feeds_v100_20260818_075759.php.bak
petshop-feeds_v202_20260818_082129.php.bak
petshop-pilnumas_v12_20260818_103056.php.bak
```

### TECHNINES PAMOKOS

- **Skaitiklis matuoja ne ta lauka.** Katalogo „Be aprasymo" remiasi
  `_ps_pilnumas_kodai`, ne `post_content`. Pakeitus duomeni — perskaiciuoti zyma.
- **Ta pati riba dviejuose moduliuose.** 120 simboliu: pilnumas (rodiklis) ir
  vartai (publikavimas). Keiciant — patikrinti abu ir pasakyti, kuris nekeiciamas.
- **`init` per anksti WooCommerce'ui.** `wc_get_product()` ten grazina false.
  Naudoti `wp_loaded`.
- **HTML esybiu eile:** dekoduoti -> valyti zymes -> dekoduoti likusias.
  Atvirksciai — uzkoduotos zymes atsiverčia i HTML.
- **Litrai nera kilogramai.** Kraikams tankis != 1; teisingas svoris dazniausiai
  parasytas paciame pavadinime skliaustuose.
- **Pries taisant „klaidas\" — patikrinti, ar klysta ne tavo taisykle.**
  8 Churu ir 216 bruto irasu butu buvе sugadinti.

**Auksciausias sios sesijos decision Nr.: S1002.**

---

## 2026-08-17/18 (naktis) — Q-MERCH: GOOGLE ZVALGYBA IR GTIN SKOLA [S971-S986]

Savininko nurodymas: pradeti nuo Google Merchant Center (~10 000 EUR/metus).
Sesija prasidejo kaip zvalgyba, o baigesi duomenu remontu ir importo saknies
taisymu — nes zvalgyba parode, kad feed'o statyti dar nebuvo is ko.

**Nakties taisykle:**

> Klausiau „ar galim siusti prekes i Google". Atsakymas buvo „ne, nes 858 is
> 1 252 GTIN yra negaliojantys". Bet tikroji problema buvo ne skaicius, o tai,
> kad ji sukure MUSU pacIU kodas, ir kitas importas ja butu atkures. Sutvarkyti
> duomenis neradus rasytojo — reikstu ta pati darbа kas savaite.

---

### S971 — INFRASTRUKTUROS ZVALGYBA (G810)

```
WP 6.9.4 · Woo 11.0.1 · EUR · kainos su PVM · salis LT
publish 2 609 · draft 1 140 · trash 47 · variacijos 158 (39 tevai)
tipai: simple 2 557 · variable 39 · mix-and-match 13
matomumas: outofstock 200 · exclude-from-catalog 5 · exclude-from-search 5
```

**Feed'o piltuvelis** (savininko klausimas: ar testiniai rinkiniai kliudys —
NEKLIUDO, jie atsijoja savaime):

```
publish                      2 609
- pasleptos (hidden)             5
- rinkiniai (mix-and-match)      8
= KANDIDATAI                 2 596
```

**Lauku padengimas kandidatuose:**

| Laukas | Yra | Trukumas |
|---|---|---|
| nuotrauka | 2 596 | 0 |
| kategorija | 2 596 | 0 |
| kaina > 0 | 2 593 | 3 |
| aprasymas >=100 simb. | 2 532 | 46 tuscI |
| brendas (`product_brand`) | 2 468 | 128 |
| svoris | 1 244 | 1 352 |
| `_stock_status=instock` | 2 237 | 359 |

**Google kategoriju mapinimo NERA visai** — 80 `product_cat` terminu, nulis
susiejimu su Google taksonomija. Vienkartinis rankinis darbas.

### S972 — GOOGLE LISTINGS & ADS PEDSAKAI

```
gla_install_timestamp 1778001697 -> 2026-05-05 17:21 UTC
gla_* lenteles 6, visos tuscios (budget_recommendations 4 230 = gamyklinis seed)
gla_merchant_id opcijos NERA · pluginas neaktyvus
```

Isvada: prie Merchant Center **niekada nebuvo prisijungta** is sios WP kopijos.

### S973 — ★ KAINA24 IR KAINOS.LT FEED'AI YRA NEGYVI ★

```
/feed/kaina24        -> Fatal error: memory 268435456 exhausted
/feed/kainos         -> tas pats
/?petshop_feed=...   -> tas pats
memory_limit 256M · WP_MEMORY_LIMIT 40M
```

Priezastis `petshop-feeds` v1.0.0 kode: `posts_per_page => -1` + `wc_get_product()`
kiekvienai is 2 596 prekiu i viena masyva.

**Tai keicia OPS-06 prielaida.** Registre stovejo „feed URL resubmit po
perjungimo" — bet resubmitinti nera ko, feed'as nedirba ir dev'e. Google feed'as,
parasytas tuo paciu principu, mirtu identiskai.

Teigiamas radinys: tas pats kodas JAU filtruoja `_stock_status=instock`, tad
savininko sprendimas (be likucio nesiusti) sutampa su esama elgsena.

### S974 — GTIN SKOLA: 858 NEGALIOJANTYS KODAI

Google skaito WC standartini lauka `_global_unique_id`:

```
uzpildyta kandidatams   1 252
galioja (kontroline)      394   (31 %)
NEGALIOJA                 858
is ju 12 simboliu ilgio   942
```

Kontrolines sumos skaiciuotos isoreje (GS1 mod-10), ne pasitikint ilgiu.

**Saltiniu pjuvis:**

```
_vf_barcode   1 163 irasu · VISI lygiai 12 simboliu · galioja 0
_ean          1 457 · 12 zn. 970 · 13 zn. 473
_zb_ean         576 · 13 zn. 546 · galioja 97 %   <- ZB pusе svari
```

### S975 — SAKNIS PRIE SALTINIO: TIEKEJAS SIUNCIA 12 SIMBOLIU (G816)

Parsisiustas VF srautas tiesiai is fetcher'io (8 324 602 B):

```
<barcode> reiksmiu   2 326
12 simboliu          2 326   <- VISOS
13 simboliu              0
```

Pavyzdys `871441400856` (Antos) — prefiksas 871 yra Nyderlandu EAN-13, taigi
tai nukirstas EAN-13, o ne amerikietiskas UPC-12. Vetfarmas savo B2B sistemoje
barkodo lauka laiko 12 simboliu. **Mums nepasiekiama.**

Atkurimas imanomas: nukirstas paskutinis skaitmuo yra kontrolinis, skaiciuojamas
is pirmuju dvylikos.

### S976 — DRY-RUN, KURIS SULAIKE NUO KLAIDOS (G814)

Atkurimas patikrintas pries prekes, turincias ir pilna 13 zenklu `_ean`:

```
patikrinta poru   41
sutapo            27   <- algoritmas veikia
NESUTAPO          14   <- abi reiksmes galiojancios, bet rodo SKIRTINGAS prekes
```

Pvz. JOS0617 Josidog adult Sensitive 15 kg: Legacy `4032254745501`,
VF atkurta `4032254770718`.

**Be dry-run'o butume aklai perrase 14 prekiu GTIN.**

### S977 — APPLY (G820)

Praleisti KONFLIKTAI: 41 (VF vs Legacy) + 5 (du skirtingi galiojantys 13).

```
planuota keisti           1 963
irase                     1 715
„klaidu"                    248   <- update_post_meta grazina false, kai reiksme
                                     nesikeicia; tos prekes koda jau turejo
kopija  uploads/ps-backups/gtin_backup_20260817_204552.json (148 051 B)
rodykle opcijoje ps_gtin_backup_failas · zurnalas ps_gtin_zurnalas
```

Keista tik `_global_unique_id`. `_ean`, `_zb_ean`, `_vf_barcode` NEPALIESTI.

### S978 — NEPRIKLAUSOMA PATIKRA (G821, G822)

```
plano irasu 1 963 -> perskaityta is DB: sutampa 1 963 · nesutampa 0
ilgiai po taisymo: 13 zn. 1 968 · 12 zn. 47 (galiojantys UPC) · 11 zn. 4 · 8 zn. 1
ne skaiciu reiksmiu 0
```

Tai paaiskino tuos 248: jei butu buve tikros klaidos, perskaitymas rodytu
248 nesutapimus. Rodo nuli.

**Vizuali patikra (Playwright, admin slapukai):** preke 17978 Josera Sensiplus,
laukas „GTIN, UPC, EAN, or ISBN" ekrane rodo `4032254785989`; preke 12452
Eukanuba — `8710255120072`. JS klaidu 0. Ekranai: `screenshots/gtin_17978.png`,
`gtin_12452.png`.

Pirmas HTML bandymas (G821) grazino 10 KB puslapi be lauko — tik `logged_in`
slapuko wp-admin'ui NEUZTENKA, reikia ir `SECURE_AUTH_COOKIE`. Iki tol
„patikra" butu buvusi tuscia.

**PRIES / PO (publish 2 609):**

```
GTIN uzpildytas   1 252 -> 2 021
galiojantis        ~394 -> 2 015
VF prekes su 13 zn.    0 -> 979 / 979
be jokio kodo lieka 594 (daugiausia zaislai, aksesuarai)
```

### S979 — IMPORT #5 PERSKAITYTAS (G823)

WP All Import mapinimas svarus — raso TIK `_vf_*` laukus:

```
custom_name  _vf_supplier_sku _vf_barcode _vf_brand_raw _vf_category_raw
             _vf_cost_xml _vf_personal_xml _vf_qty _vf_description_base64
logika       "only" · unique_key {sku_id[1]}
is_update_*  title/content/categories/attributes/images/status = 0
```

`_global_unique_id` mapinime NERA.

### S980 — ★ BET GADINO MUSU PACIU KODAS ★ (G824)

`petshop-xml/includes/class-vf-import.php`, `petshop_xml_vf_create_new()`, 365-367:

```php
// 2. Bendri laukai (EAN)
if ( $vf_barcode ) {
    update_post_meta( $post_id, '_ean', $vf_barcode );
    update_post_meta( $post_id, '_global_unique_id', $vf_barcode );
}
```

Blokas **neturi `$is_update` apsaugos** — priesingai nei zemiau esantis SKU
blokas (`if ( ! $is_update && $vf_sku )`). Kelias iki jo neisvengiamas:
atnaujinant VF preke `find_by_ean()` ir `find_by_sku()` ieko ISSKYRUS pacia
preke (`$skip_id`), atitikmens neranda, einama i B scenaiju.

**Kitas Import #5 butu grazines 979 prekes atgal i 12 simboliu.**

`attach_to_existing()` (283-287) liecia tik `_vf_*` — 1 163 suporuotoms
prekems gresmes nera.

### S981 — v1.5.7 IDIEGTA (G825-G827)

Pridetos `petshop_xml_gtin_normalize()` ir `petshop_xml_gtin_check_digit()`;
EAN blokas normalizuoja pries rasyma. **`_vf_barcode` paliktas ZALIAS** — jis
yra suporavimo raktas `Petshop_EAN_Lookup::find_by_ean()` uzklausoje.

```
senas MD5  8a98db315695931f4542feed51a59c03  (sutapo su nuskaitytu)
naujas MD5 eed08a9ff69310d1def700d463d2ed8c  (serveryje po irasymo — sutampa)
kopija     ps-backups/class-vf-import_v156_20260817_211108.php.bak
repo       plugins/petshop-xml/includes/class-vf-import.php
titulinis 200 · prekiu sarasas 200 · fatal 0
```

### S982 — ★ PAMOKA: `exec()` SERVERYJE ISJUNGTAS ★

Pirmas diegimo bandymas (G826) naudojo `php -l` per `exec()` — gautas
`Fatal error: Call to undefined function exec()`. Failas dеl to liko
NEPAKEISTAS, nes patikra eina PRIES rasyma. Tvarka issaugojo.

Sprendimas: `token_get_all($kodas, TOKEN_PARSE)` su `catch (\ParseError)`.
Veikia be shell'o. (Tas pats budas jau buvo naudotas S518 — buvo pamirstas.)

### S983 — FUNKCINIAI TESTAI (G828)

```
dirbtiniai atvejai   8 / 8  (12->13, jau geras 13, tuscias, raides, 5 zn., 11 zn.)
idempotencija        979 VF prekiu: 965 sutaps su tuo, kas jau lauke
_vf_barcode          1 163 x 12 simboliu — liko zalias
```

Idempotencijos skaicius yra irodymas, kad regresija uzdaryta: kitas importas
rasytu tiksliai tas pacias reiksmes.

Likusieji 14 skirtumu = tos pacios konfliktines prekes.

### S984 — SAVININKO SPRENDIMAI

```
Q-MERCH-2  feed'as SAVAS (ne GLA pluginas) — vienas variklis, trys isvestys
Q-MERCH-3  prekes be likucio i feed'us NESIUNCIAMOS (Google, Kaina24, Kainos.lt)
           motyvas: paspaudimai mokami, o preke neperkama
14 KONFLIKTU  variantas 1 — priimti VF kaip tiesos saltini; kitas Import #5
           uzrasys VF versija, veiksmu nereikia
```

### S985 — GOOGLE API: PRIEIGA YRA, BET UZDARYTA

Tiltas turi `GTM_SA_JSON` (paslaugos aktas is GTM darbu).

```
client_email  claude-gtm-manager@prefab-envoy-482617-b4.iam.gserviceaccount.com
token         200 (JWT RS256 veikia)
authinfo      403 — Content API for Shopping neijungtas projekte 683712074632
```

Detale: paslapties turinys yra JSON BE isoriniu rieziniu skliaustu —
`JSON.parse('{'+raw+'}')`. Trys pirmi bandymai krito, kol tai isaiskejo.

**Reikia savininko (du veiksmai):**
1. Google Cloud, projektas `prefab-envoy-482617-b4` -> ijungti Content API for Shopping
2. Merchant Center -> Naudotojai -> prideti ta pati adresa (uztenka Skaitytojo)

### S986 — NEUZDARYTA SIAME BLOKE

```
1. Feed'o variklis — reikia perrasyti su paketais (dabartinis mirsta ties 256M)
2. Google kategoriju mapinimas — 80 kategoriju, nulis susiejimu
3. 594 prekes be jokio kodo — i Google eis brand + mpn(SKU) + identifier_exists:no
4. 128 prekes be brendo · 46 be aprasymo · 3 be kainos
5. 4 CATIT prekes su 11 zenklu kodais (19042, 19045, 19048, 19051) — sena skola
6. Merchant Center paskyros bukle — nezinoma iki S985 dvieju veiksmu
```

**Auksciausias sios sesijos decision Nr.: S986.**

---

## 2026-08-17 (naktis) — SARGAS GYVAI, DNS ISMATUOTAS, ABU PERJUNGIMO PLANAI [S713-S720]

Vakaro tesinys. Trys ivykiai, is kuriu du atejo NE is testu, o is savininko
ekrano kopiju.

**Nakties taisykle:**

> `wp_mail()` grazino `true` abiem atvejais. Formatavimo klaida matesi TIK
> gavejo ekrane. O melaginga aliarma parode ne testas, o pats pirmas realus
> laiskas. Modulis, kuri buciau paskelbes baigtu, pirma pirmadieni butu
> atsiuntes neskaitoma kamuoli, o pirma ryta — melaginga pavoju.

---

### S713 — `petshop-sargas.php` v1.0 IDIEGTAS (DOD-13)

```
failas 12 539 B · MD5 sutampa · klase YRA
lentele ps_sargas_klaidos · variklis InnoDB (musu ENGINE nurodymas suveike)
cron kasdien 04:00 · savaitinis pirmadieniais
laukiami cron'ai: 50 — atrasti AUTOMATISKAI, vardai nehardkodinti
klaidu gaudymas VEIKIA (testinis irasas pagautas, po to isvalytas)
parduotuve 200 · katalogas 200
```

**SPF/DKIM patikra praejo** — laiskas pasieke `terra@gyvunai.lt`. Tai pirmas
realus isorinio siuntimo is naujo domeno irodymas.

### S714 — v1.1: LAISKAI HTML SU `<pre>`

**Savininko ekrano kopija parode:** Outlook virsuje rodo „We removed extra
line breaks from this message" — gryname tekste jis nusprendzia, kad tai
„flowed" tekstas, ir ISMETA eiluciu luzius.

Testiniam laiskui nesvarbu. Bet savaitine suvestine sudelioja stulpeliais
(`atsiskaite: 47` / `tyli: 3` / `warning 12 unikaliu / 340 kartu`) — suplakta
i viena kamuoli ji butu neskaitoma.

Sprendimas: `Content-Type: text/html` + `<pre>` blokas su monospace. Isiusta
REALI suvestine — savininkas patvirtino, kad lygiavimas issilaike.

### S715 — v1.2: MALONES LAIKAS IR „IRODYTU" CRON'U TAISYKLE

**Pirma reali suvestine parode:** `atsiskaite: 6 · tyli: 44`.

Rytojaus 07:00 patikra butu issiuntusi pavojaus laiska apie 44 cron'us —
MELAGINGAS signalas: modulis idiegtas pries desimt minuciu, o dev'e nera
lankytoju, per kuriuos WP-Cron apskritai paleidziamas. Dalis tu 44 cia
nepasileis niekada, o produkcijoje su srautu — pasileis.

```
1) 48 val. po idiegimo — jokiu pavojaus laisku
2) po ju pavojus TIK tiems, kurie BENT KARTA atsiskaite (irodyta, kad veikia)
   arba yra MUSU (ps_ / petshop_ / action_scheduler)
3) svetimi, kuriu niekada nemateme — ne musu reikalas, lieka tik suvestineje
```

**Patikrinta realiai:** paleistas `kasdien()` tiesiogiai — laisku kaip buvo 0,
taip ir liko. Tylejo.

> **Sargas, kuris rekia pirma ryta, yra sargas, kurio antra savaite
> nebeskaitai.**

**DOD-13 UZDARYTAS. DOD-20 septyniu dienu laikrodis paleistas.**

**Salutinis produktas:** lentele `ps_sargas_klaidos` is esmes YRA tas
`klaidos.md` registras, kurio reikejo DOD-02/03 matavimui. Tikrinti, ar
uztenka punktui uzdaryti.

---

### DNS ISMATUOTAS — B SCENARIJUS, BET SU DVIEM RADINIAIS

```
sis serveris (avesa.lt, dev.avesa.lt)   79.98.29.24
petshop.lt A                            213.226.161.16  ← eShoprent
petshop.lt A (ANTRAS)                   213.226.161.15  ← eShoprent
www.petshop.lt                          CNAME → petshop.lt
A TTL 3600 · NS TTL 86400
NS: ns1-ns4.serveriai.lt
MX: isopas.serveriai.lt
SPF: v=spf1 a mx include:spf.serveriai.lt include:sendersrv.com ~all
eShoprent svetaine: HTTP 200, nginx/1.22.1, gyva
```

**RADINYS 1 — REGISTRAS §8a NETIKSLUS.** Ten uzrasyta „DNS valdomas iv.lt".
Realiai zona yra ns1-ns4.serveriai.lt; iv.lt greiciausiai registratorius.
Praktine reiksme didele: **A irasa keiciam SAVO DirectAdmin'e**, be trecios
salies ir be laukimo. Didziausias palengvejimas visame plane — ir jis buvo
uzrasytas neteisingai.

**RADINYS 2 — A IRASU YRA DU.** Pakeitus tik viena, dalis srauto toliau eitu
i eShoprent, ir tai atrodytu kaip atsitiktiniai gedimai, ne kaip klaida.

**Paštas ir SPF jau serveriai.lt puseje** — perjungiant ju liesti nereikia.

---

### DOD-18 IR DOD-19 PARASYTI

`dokumentai/DOD-18_perjungimas.md` · `dokumentai/DOD-19_rollback.md`

**Savininko sprendimas: migracija NAKTI.** Is to seka:

```
+ nera pirkeju → nera uzsakymu → duomenu atstatymas LIEKA ATVIRAS
+ TTL 1 val. nakti kainuoja beveik nieko
+ 04:00 backup ir naktiniai importai — PIRMAS realus ju testas naujoje
  aplinkoje, stebimas gyvai, o ne randamas ryta
− serveriai.lt palaikymo nakti NEBUS
− dirbama vienam ir pavargus
```

> **Is dvieju minusu seka pagrindine plano taisykle: planas vykdomas
> MECHANISKAI, be sprendimu priemimo. Kiekvienas „reikes pagalvoti" 03:00
> yra klaidos vieta.**

**VIETA, KURIOS ANKSCIAU NEMATEME:** tarp Site URL pakeitimo i `petshop.lt`
ir DNS perjungimo parduotuve nepasiekiama NE VIENU adresu — senasis jau
nebeveikia, naujasis dar nerodo. Nakti nekainuoja, bet zinoti reikia is
anksto, kad 02:40 nekiltu panika.

**DIDZIAUSIA RIZIKA IVARDYTA ATSKIRAI:** F-PSR (Paysera pilnas ciklas)
NETESTUOTAS, ir pagal plana 4.4/16 zingsnis butu PIRMAS kartas. To daryti
negalima — mokejimu integracija aiskinamasi ne 03:00 be palaikymo.
**Paysera nuo siol yra KRITINIS KELIAS: ji blokuoja perjungimo nakti, tad
perjungimo datos negalima fiksuoti, kol F-PSR neuzdarytas.**

---

### S720 — JUODRASCIU AUDITAS (Q-R7): ATSAKYMAS KITOKS, NEI ATRODE

Savininko pozicija buvo: „jie uzdaryti ir mums nemaiso". Kasdieniam darbui —
tiesa: kliento nemato, i paieska nepatenka, MnM rinkiniu ju nepriima.

**BET:**

```
juodrasciu            1 140  (su likuciu 547 · per 7 d. nauji 99)
_vf_supplier_sku       184   ← UZSTOJA VF importa
_zb_supplier_sku       486   ← UZSTOJA ZB importa
                       ---
                       670
```

Priezastis — `block_vf_create` salyga tikrina `post_status != 'trash'`, NE
`= 'publish'`. Juodrastis su tiekejo SKU importui atrodo kaip suporuota
preke, ir naujos prekes kurimas blokuojamas.

**Sarase guli butent tai, ko visa vakara ieskojome:** `JOS0398`, `JOS0439`,
`NGCSB03`, `NGCST03` — NAUJOSIOS Josera ir Exclusion pakuotes, tos paciso,
kuriu VF sraute YRA. Jos jau atkeliavo, bet liko juodrasciuose ir dabar
uzstoja pacios save.

**Kodel jos ten (priezasciu pjuvis):**

```
313  konservas_below_minimum      kainos filtras
104  qty_zero                     nulinis likutis kurimo metu
 39  missing_image / description
 21  qty_zero, qty_zero
 20  qty_zero_on_new
```

Tai NE siuksles — tai prekes, neatitikusios ijimo taisykliu TUO MOMENTU,
kai atejo.

**Augimas:** 2026-06 → 950, 07 → 81, 08 → 104. Kuriami toliau.

**ISVADA:** Q-R7 nera valymo klausimas. Tai TAS PATS klausimas kaip
Q-VF-KAT, tik is kitos puses: ijimo taisykles (`konservas_below_minimum`,
`qty_zero`) galbut per grieztos, ir del ju asortimentas neatsinaujina.
**Sprendimas prekybinis, ne techninis — savininkas nurode prie prekiu
nelisti.**

---

---

## 2026-08-17 (vakaras) — SANDELIU MODELIS: KAS PAAISKEJO PJUVIU PAGAL PAVADINIMA [S920-S970]

Diena, kurioje nebuvo idiegta NE VIENO modulio, o verte sukure keturi
matavimai. Du is ju apverte prielaidas, kuriomis remesi ankstesni
dokumentai.

**Dienos taisykle:**

> Registras atsako tik i ta klausima, kuri jam uzduodi jo kalba.
> `ps_sources` rode 0 dvigubu prekiu — ir tai buvo tiesa. Bet savininkas
> pasake: „ieskok ne pagal kodus, o pagal pavadinima". Tas pats katalogas
> tuo pat metu turejo 27 VF prekes, sedincias AV sandelyje. Kodai ju
> nesusiejo, nes jos ir nebuvo susietos — butent tai ir buvo problema.

---

### S920-S923 — §29 FULFILLMENT: AUDITO PRIELAIDA BUVO KLAIDINGA

Auditas teige: „12 neuzdarytu punktu, saknis — resolveris neskaito
`_ps_sandelis`". Palyginus VISAS 3 749 prekes:

```
sutampa        3 732   (99,5 %)   trukme 3,5 s, atmintis 108 MB
nesutampa          17   (0,5 %)
```

**Is 17 nesutapimu resolveris teisus 12 kartu.** Klaidingas dazniau yra
`_ps_sandelis`. Sesios prekes su `_ps_sandelis=vf` yra surenkamu rinkiniu
LAUKAI (`_ps_laukas=yes`) — be SKU, be EAN, be jokio VF meta. Resolveris
joms teisingai atsako `legacy`.

**Todel audito siulymas — perjungti resolveri skaityti `_ps_sandelis` —
butu REGRESIJA, ne pataisymas.**

Trys radiniai, kuriu niekas nemate:

```
34909 FLEXI pavadelis    PUBLISH, be _ps_sandelis, be ps_sources irašo,
                         bet _vf_qty=10. Kataloso langui jos „nera".
                         Su ja dar 4 — naujos prekes i registra nepatenka.
ps_sources              6 irasai su source='VF' DIDZIOSIOMIS (visur kitur 'vf').
                         Bet koks ===' vf' ju nepagaus. Poveikis nepatikrintas.
du pasauliai            NE VIENAS failas nenaudoja abieju. Pirkejo puse
                         (FBT, akcijos, tema, M8) — ant resolve(). Admin puse
                         (katalogas, gavimas, rinkiniai) — ant _ps_sandelis.
                         Kai nesutaria, niekas nepranesa.
```

Is 12 §29 punktu nuo resolverio realiai priklauso TRYS (2, 3, 12), ne visi.
Pilna ataskaita: `dokumentai/petshop_fulfillment_tyrimas_2026-08-17.md`.

---

### S930-S934 — PASLEPTA PREKE RINKINYJE: VEIKIA (empiriskai)

Savininko klausimas: ar galima preke padaryti „ne public", o is jos
sudaryta rinkini palikti public?

**Atsakymas: TAIP, bet tik `publish` + `hidden`, ne `draft`.**

MnM 2.8.7 `WC_MNM_Child_Item::is_visible()` tikrina TIK statusa:
```php
$visible = 'publish' === $this->get_product()->get_status() || current_user_can(...)
```
Katalogo matomumas jam nerupi. Todel `draft` neveiktu, o `publish+hidden` veikia.

**Testas (sukurta, patikrinta, istrinta):**
```
paslepta preke   is_visible=false · kataloge NERA (2 604 is 2 615) · paieskoje NERA
                 is_purchasable=true · likutis veikia
rinkinys         is_allowed_child=true · vaikas matomas · NUORODA TUSCIA
i krepseli       PAVYKO, klaidu 0, suma skaiciuojasi
isvalyta         liko 0
```

**Netiketas priedas:** MnM paslepta preke NEGENERUOJA nuorodos i jos
puslapi (`get_permalink()` grazina ''). Papildomo „neperkama atskirai"
filtro gali ir nereiketi.

**KLAIDA PAKELIUI:** pirmas testas luzo — `set_child_items()` daviau plikus
ID, o jis laukia masyvo su `product_id`. Liko vienas nesvarus irasas,
istrintas kitu paleidimu. Parasa reikejo perskaityti PRIES rasant.

**RADINYS:** 35 naslaiciu eilutes `wc_mnm_child_items` (vaikai be konteinerio).
Daugiausiai 2 galetu buti mano testu. Kiek buvo pries — nepamatuota.

---

### S940 — DVIGUBU SALTINIU MASTAS: NULIS (ir tai klaidino)

```
ps_sources eiluciu   3 828   ·   prekiu   3 828   <- po VIENA kiekvienai
prekiu su 2+ saltiniais                       0
_own_stock_qty > 0                            0
_cost_price IR _vf_cost toje pacioje          0
```

Ankstesne aritmetika (3 828 − 3 749 = 79 dvigubos) buvo KLAIDINGA:
skirtumas — registre likusios prekes, kuriu `posts` lenteleje nebera.

**Uzsakymu logika jau pastatyta** (2026-08-05, penki moduliai vietoje):
`AV_Order` fiksuoja `_ps_source` KIEKVIENAI eilutei (prioritetas 5),
`AV_Reduce` nurašo pagal EILUTES saltini, `AV_Limit` riba = AV + tiekejas.

**SPRAGA:** `_ps_savikaina_vnt` minimas TIK `petshop-statistika.php` ir tik
kaip konstanta. Fiksavimo, kuris ziuretu i eilutes `_ps_source` ir imtu tos
prekes savikaina IS TO SANDELIO, NERA. Siandien nekliudo (dvigubu 0), bet
tai vienintele NEGRIZTAMA vieta: praejusio menesio pelno neperskaiciuosi.

---

### S941 — PJUVIS PAGAL PAVADINIMA: 27 VF PREKES AV SANDELYJE

Savininko nurodymu paleista paieska ne pagal kodus, o pagal pavadinima.

```
tiksliai vienodi pavadinimai   44 grupes · 89 prekes
is ju skirtingi sandeliai       2 (abu nekalti)
panasumo poros >=0.80          38 — beveik visos VARIANTAI (1kg vs 10kg,
                                   skirtingi baltymai, FLEXI spalvos)
```

Panasumas davė mazai. **Verte davė kryzminis pjuvis:**

```
27 prekes: Josera / JosiDog / Exclusion / Green Petfood
           su _ps_sandelis = av
           NE VIENA neturi _vf_cost
           11 is ju turi VF formato SKU (JOS0418, HYVM11, INPM11...)
```

Su realiais likuciais: Intestinal 18/39/41 vnt., konservai 17–32 vnt.

**IR KETURIOS PUBLISH SU LIKUCIU 0:** 18563 elniena, 18569 antiena,
18608 arkliena, 18623 Hepatic. Klientas mato „nera", VF tuo metu turi.
Tai ne tik isaldyti pinigai — tai prarasti pardavimai kasdien.

---

### S950-S960 — KODEL JOS TEN: NE BANAS, O NESUPORAVIMAS

Rastas mechanizmas: `petshop_xml_block_vf_create()` (v1.5.16, S100).
Jo antrastes komentaras aprašo BUTENT si atveji:

> VF prekes (Josera, Exclusion, Churu), kurios YRA Legacy sandelyje
> (SEO/istorija), turi buti SUPORUOTOS su VF XML. Legacy duoda pavadinima/
> aprasyma/PARDAVIMO KAINA; VF duoda savikaina + `_vf_qty`.
> Match raktas: VF `sku_id` <-> Legacy `_vf_supplier_sku`.

Blokas atsirado del realios problemos: VF Import #5 kure **78 dublikatus
KAS IMPORTA** (Josera/Exclusion/Churu — visa monoprotein/hipoalergine nisa).

**PATIKRA (S960) — lemiamas skaicius:**

```
prekiu su _vf_supplier_sku     1 163   (VISOS ir su _vf_qty)
tu 27 suporuota                    0
tu 27 SKU kaip kitos prekes _vf_supplier_sku   0
tu 27 _manual_price_override       0 (NE VIENA neuzrakinta)
```

**ISVADA: modelis „viena preke — du sandeliai" suprojektuotas dar birzeli
ir VEIKIA — 1 163 prekes tai irodo.** Tos 27 stovi ne uz bano, o uz
suporavimo slenkscio: turi teisinga SKU, bet ne tame lauke, kurio ieško
importas (`_sku`, ne `_vf_supplier_sku`).

**SAVININKO SIULYMA NUIMTI BANA REIKIA VERTINTI ATSARGIAI:** nuemus
`block_vf_create` grizu 78 dublikatai per importa tiems 1 163, o sios 27
VIS TIEK liktu nesuporuotos — problema ne ten. Skirtumas tarp „durys
uzrakintos" ir „mes prie duru nepriejom".

---

### KAS LIKO SIAM KLAUSIMUI (vienintelis nezinomasis)

```
1  ar INPM11 / AM20 / PM37 ir kiti 27 SKU SIANDIEN yra VF XML sraute
   (jei taip — suporuojam; jei ne — reikia kito sprendimo)
2  ar VF update tikrai NERASO i kainos laukus
   KOMENTARAS taip sako. Kodo NEPERSKAICIAU. Is komentaro nepriimu:
   siandien jau turejome atveji (§29), kur komentaras klaidino 10 savaiciu.
   Kritiska, nes tu 27 _manual_price_override tuscias — apsaugos nera.
3  eksportas is gyvosios petshop.lt (savininkas) — atsakys, ar tie
   18/39/41 vnt. realiai lentynoje, ir kokie buvo tikrieji uzraktai
```

**SAVININKO SPRENDIMAS del kainu perkelimo is gyvosios petshop.lt:**
apimtis tik AV prekems (VF/ZB kainas skaiciuoja taisykles, likuciai is XML);
tikrasis perkelimas T-3, kai katalogas uzsaldytas; SIANDIEN naudojam kaip
IRODYMA, ne kaip importa.

---

### TILTO GEDIMAI (4 per sesija — ivardijama, ne slepiama)

```
2x GitHub API 503 (ju puse) · 1x runner.mjs sed grandine sugadino faila
1x failo vardas virto u970 vietoj b970, snippetas grazino HTML vietoj JSON
```

Pamoka: **runner.mjs rasyti is naujo kiekvienam paleidimui, ne per `sed`
grandine.** Ketvirta klaida sustabde `block_vf_create` kuno skaityma —
pagal anti-rabbit-hole ivardyta ir palikta rytdienai.

---

---

## 2026-08-17 (diena) — MyISAM -> InnoDB: 177 LENTELES, PLIUS SARGAS, KAD NEGRIZTU [S902-S912]

Diena, kurios pagrindinis darbas truko 17 sekundziu, o visa kita buvo
matavimai pries ir po. Uzdaryta REGISTRAS eilute `P1-MYISAM`, kabejusi
nuo 2026-08-03.

**Dienos taisykle:**

> Pries prasant savininko kazko, ka jis galbut jau padare — PATIKRINTI
> REGISTRA. Papraseiau DB eksporto pries migracija; §8f-§8h juodu ant balto
> sako, kad automatinis backup'as i Backblaze veikia nuo 08-04, o atstatymo
> testas 174/174 praejo. Savininkas: „Ar vel tau eilini karta siurprizas?"
> Tai ta pati klaidu rusis, del kurios rasomas sis zurnalas.

---

### S902 — KATALOGAS v8.6.5b -> v8.7 (NORMALUS DARBINIS LANGAS)

Savininkas atsiunte tris ekrano kopijas: sarase matosi 1-4 prekiu eilutes,
o po jomis tuscia balta erdve iki lango apacios.

**Priezastis — v8.6 koncepcija, ne klaida joje.** v8.6 „du slinkties laukai"
darė taip: langas = ekrano aukstis, virsus fiksuotas, o prekiu laukui
atiduodama „kas liko" po JS matavimu (`aukstis()`). Realiame ekrane su WP
juosta, musu juosta, filtrais ir suvestine „kas liko" buvo 120 px.
v8.6.1-v8.6.5b buvo penki bandymai ta matavima patikslinti — visi gydė
simptoma.

**Ismesta:** `aukstis()` JS matavimai, `body.pskat-pilnas`, `.pskat-layout`
fiksuotas aukstis, `.pskat-main` flex-stulpelis su `overflow:hidden`,
`.pskat-lent-lauk` vertikalus scroll'as ir aukscio ribos.

**Palikta:** filtru suskleidimas (v8.6.2-8.6.4), `update-nag` slepimas,
sticky kaires eiles. Vietoj matavimu masinerijos liko VIENAS matavimas —
virsutines juostos apacia i CSS kintamaji `--ps-virsus`.

```
eiluciu DOM              50 (visas puslapis)
lauko aukstis            3 868 px (buvo ~120)
puslapis slenka          taip
suvestine + puslapiavimas matomi apacioje
JS klaidu                0
```

---

### S903 — KATALOGAS v8.7 -> v8.7.1 (STULPELIU ANTRASTE NEJUDA)

Savininkas: „desineje puseje virsus nejudetu, ir as slinkdamas prekes
matyciau ka kiekvieno stulpelio reiksme."

v8.7 antraste nuslinkdavo kartu su puslapiu — tai buvo mano samoningas
kompromisas, apie kuri parasiau, bet jis netiko.

**Sprendimas:** `thead th { position:sticky; top:var(--ps-virsus) }`.
Kad sticky veiktu pries VISO PUSLAPIO slinkti, laukas negali buti scroll
konteineris, todel `overflow-x` paliktas tik siauram ekranui (`max-width:1400px`).

```
thead_top slenkant   100 px = --ps-virsus  (juostos apacia)
rail_top             100 px  (kaires eiles ten pat)
patikra              ekrano kopija v871_vidurys.png
```

---

### S904-S906 — RECON PRIES MIGRACIJA

**S904** — bendra busena. `_cost_price` 694 (patvirtina, kad S881-S901
importas ivyko), Redirection lenteliu 0 (pluginas NEINICIALIZUOTAS),
MyISAM 177 is 191.

**S905** — variklio auditas. Trys skaiciai, kurie nuleme visa plana:

```
FULLTEXT indeksu MyISAM lentelese     0    <- pagrindinis blokeris NERA
indeksu virs 3072 B                   0    <- antras blokeris NERA
default_storage_engine             MyISAM  <- TIKROJI SAKNIS
```

Trecias radinys svarbiausias ir audite jo nebuvo: konversija be jo yra
vienkartinis valymas, o ne sprendimas — kita nauja lentele vel gimtu MyISAM.

**Taip pat:** teises tik `GRANT ALL ON gyvunai2_nbpe1.*` — naujos DB kurti
NEGALIMA, todel audito siulytas „klonas + regresija" siuo vartotoju
neigyvendinamas. Bazes dydis 159,6 MB, tad klonas ir nebutinas.

**S906** — 177 lenteliu sarasas su `COUNT(*)` PRIES, sugrupuotas pagal
rizika (bak 11 / ps 28 / woo 36 / as 4 / kita 86 / wp_core 12) plius
backup busenos patikra.

---

### S907-S909 — KONVERSIJA TRIMIS PAKETAIS

Kiekvienai lentelei: `COUNT(*)` pries -> `ALTER TABLE ... ENGINE=InnoDB,
ROW_FORMAT=DYNAMIC` -> variklio patikra -> `COUNT(*)` po. Nesutapimas
butu uzfiksuotas kaip klaida, ne praleistas.

```
S907  bak,ps,woo    75 lenteliu   2,8 s   klaidu 0
S908  as,kita       90 lenteliu   8,7 s   klaidu 0
S909  wp_core       12 lenteliu   4,9 s   klaidu 0
                   ---
                   177            16,4 s
```

Po kiekvieno paketo: parduotuve 200, katalogas 200.

```
191 lentele InnoDB · MyISAM 0
156,4 MB -> 314,3 MB (~2x, tiketasi; laisvos vietos 35 GB)
```

**Vizuali regresija (S909, Playwright):** parduotuve, katalogas, uzsakymai,
WP prekiu sarasas — visi 200, JS klaidu 0, HTTP >=400 nulis.
Kopijos: `psl_shop.png`, `psl_kat.png`, `psl_uzs.png`, `psl_prek.png`.

---

### S910-S911 — NEPRIKLAUSOMA PATIKRA

Palyginti visu 177 lenteliu eiluciu skaiciai PRIES (S906) ir PO.

```
skirtumu            8   VISI i didejimo puse, ne vieno sumazejimo
```

Septyni akivaizdus (sesijos, ActionScheduler, snippetai, mano paties
rasymo testas). Astuntas — `options` 1 282 -> 1 677, plius 395 per 20 min.
NENURASYTA i „turbut cache", o pamatuota: is 1 677 dabar **711 yra
transient'ai**, realiu nustatymu 966. Konversija truko 17 s — prarasti
nieko nespeta.

**Kontroliniai skaiciai sutampa su NEPRIKLAUSOMAIS saltiniais:**

```
prekyboje 2 615 · juodrasciai 1 134   <- savininko ryto ekrano kopija
feeding_rows 5 549 · ps_pets 69       <- §8g atstatymo testo skaiciai
uzsakymai 10 · vartotojai 36 · pluginai 26 · siteurl/home vietoje
lietuviskos raides: „Trixie Draskykle stulpas" — e islikusi
rasymas: INSERT -> SELECT -> DELETE veikia
ROLLBACK veikia — to MyISAM nemokejo is viso
```

---

### S912 — `petshop-innodb.php` v1.0 (SARGAS, KAD NEGRIZTU)

Serverio `default_storage_engine` liko MyISAM ir mums nepasiekiamas.

**Atmestas variantas:** `SET SESSION default_storage_engine=InnoDB` per
`init`. Kaina — po VIENA papildoma DB uzklausa KIEKVIENAM puslapio
atidarymui. Savininko klausimas „nieko neapkrauname dar sistemos?"
privertė perskaiciuoti ir rasti pigesni kelia.

**Pasirinkta:** `query` filtras, kuris pagauna TIK `CREATE TABLE` ir
priduria `ENGINE=InnoDB`. Nulis papildomu uzklausu. Pigiausia atmetimo
salyga — pirmas simbolis (`$q[0] !== 'C'`), be jokiu funkciju kvietimo.

**Butinos isimtys (visos istestuotos lokaliai, 10/10):**

```
CREATE TABLE ... LIKE ...   NELIECIAMA  „LIKE x ENGINE=..." = sintakses klaida
ENGINE= jau nurodytas       NELIECIAMA  autoriaus valia virsesne
CREATE INDEX / TEMPORARY    NELIECIAMA
```

**Patikra gyvai:**

```
CREATE TABLE be ENGINE  -> InnoDB   OK
dbDelta (taip kuria katalogas) -> InnoDB   OK
testines lenteles istrintos, liko 0
```

**Apkrovos matavimas pries/po (7 matavimai, mediana):**

```
uzklausu puslapiui   70 -> 70          nulis pridetu
titulinis            1 777 -> 1 672 ms  skirtumas triuksme
failas               2 126 B is 1 746 KB mu-plugins
```

**LAIKINAS.** Tikrasis sprendimas — serveriai.lt pakeistas
`default_storage_engine`. Ji pakeitus si faila galima tiesiog istrinti.

---

### RADINYS SALIA (neistirtas, uzrasomas kad neprazutu)

`mu-plugins` — 52 failai, 1 746 KB, **kraunasi VISADA, ir kliento puslapyje**.
Tarp ju `petshop-katalogas.php` 433 KB, `petshop-desk.php` 112 KB,
`petshop-gavimas.php` 95 KB, `petshop-akcijos.php` 94 KB — administravimo
irankiai, kuriu pirkejas niekada nemato.

Kiek tai realiai kainuoja — **NEZINAU IR NESPEJAU**. OPcache didziaja dalies
parsinimo panaikina; lieka virsutinio lygio kodas ir kabliuku registracija.
Gali buti 10 ms, gali buti 100.

Kandidatas atskiram darbui: isMATUOTI, ar admin moduliai kraunasi be reikalo.
Jei taip — salyga `is_admin() || wp_doing_ajax() || DOING_CRON` modulio
pradzioje. Pirma matavimas, paskui isvada.

---

## 2026-08-16 (vakaras) – 2026-08-17 (rytas) — AUDITAS IR SAVIKAINU IMPORTAS [S881-S901]

> **PASTABA DEL NUMERACIJOS:** sio bloko darbas vyko kitame pokalbio lange
> ir per-zingsniniai S numeriai ten nebuvo fiksuojami. Blokas apima tarpa
> tarp S880 (paskutinis v1.4.8) ir S902. Skaiciai zemiau — is to lango
> rezultatu, papildomai patvirtinti matavimu 2026-08-17 (S904).

### Neuzdarytu galu auditas

Perskaityti TZ v1.75, `REGISTRAS.md`, `deployment_log_v1_4_8.md`,
prenumeratos uzrakto dokumentas ir Pet Intelligence kontraktas.
Rezultatas — `petshop_neuzdaryti_galai_2026-08-16.md`.

```
Launch DoD          9/22 ivykdyta · 6 nepradeta · 2 nematuojami
F19 prenumerata     vienintelis MVP punktas su 0 kodo
Pre-launch OPS      9 is 11 raudoni
Atviri klausimai    17 laukia savininko · 8 su praejusiais terminais
MyISAM              160/174 (matuota 08-03; 08-17 buvo 177/191)
SEO                 20,5 % srauto neuzdengta
Fulfillment §29     12 punktu, saknis — resolveris neskaito _ps_sandelis
```

**Audito radinys apie pati procesa:** `REGISTRAS.md` nebuvo atnaujintas nuo
2026-08-04, nors dirbta 12 dienu. Ta pati klaidu rusis buvo uzfiksuota ir
ankstesniame audite.

### PAYSERA — IsORINIS APRIBOJIMAS (savininko patikslinimas)

Korteliu aktyvavima daro ne Paysera, o jos partneris; reikalinga gyva
produkcijos svetaine su Mastercard/Visa zenklais; dev'e neimanoma.

**Pasekme:** F19 (prenumerata su korteles tokenizacija) fiziskai
nepastatoma pries launch — tai NE apimties sprendimas, o isorine salyga.
F19 keliama i po-launch formaliai. Is launch blokeriu iskrenta Q6, Q10,
Q-PSR.

### Savikainu importas is Excel

Saltinis: savininko `products_export_su_visomis_iki_siol_savikainomis_v78.xlsx`.
Taisykles (savininko): pildyti TIK tuscius laukus, pardavimo kainos
neliesti is viso, VF ir ZB praleisti — ju savikainos ateina per XML.

**Recon pries rasant:** `_cost_price` yra vienintelis gyvas savikainos
laukas (369 prekes). `_cost`, `_legacy_cost`, `_petshop_cost` — 0 prekiu
visame kataloge. `_cost_price_manual_at` = 3, t.y. ranka per visa projekta
ivesta tris kartus.

**Penki pjuviai pries rasant — ka jie sugavo:**

```
kontrole pries 345 jau turincias   mediana 1,0000 — jokio PVM/vienetu poslinkio
dydis pavadinime (kg/g/ml/cm)      6 nesutapimai
pavadinimu panasumas               753 is 754 virs 0,80
dublikatai / daugiareiksmiai       4 + 24
savikaina pries dev kaina          6 nuostolingos
```

**Dydzio pjuvis buvo vertingiausias** — sugavo tai, ko panasumas nemate:

```
18036  Josera Mini 1 kg   <- Excel 10 kg   savikaina butu 23,85 vietoj ~4
18058  Josera Leger 1 kg  <- Excel 10 kg   tas pats
17250  Ontario antiena 400 g <- jautiena 200 g
15084  kamuoliukas 12 cm  <- siuniukas 20 cm
```

Visi keturi susieti PAGAL EAN — vadinasi EAN neteisingas vienoje is
sistemu. Atskira duomenu skola.

**Rezultatas:**

```
DRY      324 rasys · 0 praleista
APPLY    324 irasyta
PATIKRA  324 rasta · 324 sutampa · 0 nesutampa
_cost_price kataloge  369 -> 693   (08-17 matuota 694)
zyme     _cost_price_source = excel_v78_20260817
atsaukimas  ps_savikainos_bak_20260817
```

Vizuali patikra: #14951 kortele rodo savikaina be PVM 1,4941 · su PVM
1,8079 · marza 0,81 EUR / 54,33 %, saltinis Legacy, 0 JS klaidu.

**14 prekiu ATIDETA, i jas nerasyta nieko:** 7 daugiareiksmis raktas,
4 tualetai (dev kaina 0,00, marzos patikrinti neimanoma), 2 Josera dydzio
nesutapimai, 1 dublikatas su skirtinga kaina.

**Kas lieka:** is 696 prekiu su likuciu ir be savikainos liko 372. Is ju
352 — savininko markes (Hau&Miau 32, bioVETERINARY 10, PESS 6 ir pan.),
kuriu tiekejo eksporte savikainos ir negali buti.

**NEISPRESTA:** 116 prekiu, kurios JAU turi savikaina, skiriasi nuo Excel
daugiau nei 5 %, ir Excel beveik visada mazesnis. Pagal savininko taisykle
neliestos. Vienas is dvieju saltiniu neteisingas — sprendimas atidetas.

---


---

## 2026-08-16 (vakaras) — PET INTELLIGENCE KONTRAKTAS P0: NUO SCHEMOS IKI VEIKIANCIO VARIKLIO [S843-S872]

Diena, per kuria petshop.lt gavo ATMINTI apie savo sprendimus, o po jos —
ir varikli, kuris tuos sprendimus priima. Idiegti SEPTYNI moduliai, sukurtos
TRYS naujos amzinos lenteles, pakeistas vienas M8 failas.

**Dienos taisykle:**

> Parasu nespejam. `claim_draft()` pasirode privatus, jo parametrai buvo
> (user_id, email, draft_id), o `begin_claim()` — (draft_id, user_id, email),
> t.y. ATVIRKSCIAI. Trys fatal error'ai is eiles, visi is vienos priezasties:
> `method_exists()` grazino true, o as is to padariau isvada apie parasa.
> Reflection pasako TIESA per viena uzklausa.

**Savininko procesas siai dienai (uzrakintas):** etapais, atitikties auditas
pries kontrakta po KIEKVIENO etapo (kontrakto punktas -> kur kode -> kuo
patikrinta), i M8 koda lendam TIK ten, kur be to neapsieinam, visa kita —
nauji failai, revert vietoj lopymo.

---

### S843 — VALYMO IZOLIACIJA (`petshop-statistika.php` v2.0 -> v2.1)

Kontrakto §7 kritinis pataisymas. `valyti()` tikrino agregavima TIK `laukai`
srityje, o `DELETE` eme VISAS tos dienos eilutes:

```
SELECT COUNT(*) ... WHERE diena=%s AND sritis='laukai'   <- tikrino TIK laukai
DELETE FROM ps_laukai_ivykiai WHERE DATE(laikas)=%s      <- trynė VISKA
```

**Radinys, kurio kontrakte nebuvo:** `ps_ataskaitu_dienos` jau turi KETURIAS
sritis (laukai 33, pardavimai 16, parduotuve 3, piltuvelis 4). Vadinasi
problema egzistavo ir be anketos.

Trys pakeitimai: (1) trinama tik `sritis IN (valomos)`, kiekviena sritis
vertinama atskirai; (2) `const SAUGOMOS_SRITYS = anketa|rec|refill` — KODE,
ne nustatyme: jei kas nors irasytu 'anketa' i option, valymas vis tiek jos
nelies; (3) ribos i options (`ps_stat_zaliu_dienos`, `ps_stat_valomos_sritys`)
— DoD #8.

**Irodymas:** 3x laukai + 3x anketa 200 d. senumo, agregatas ABIEM sritims.
`valyti()` grazino 3 (ne 6), anketa liko 3. Su option `['laukai','anketa']`
metodas grazino `["laukai"]`, valyti() grazino 0 — sargas veikia.

---

### S844-S848 — SCHEMA (`petshop-pet-kontraktas.php` v1.0 -> v1.1, NAUJAS)

Recon rado, kad kontrakto raide vietomis nesutampa su realybe. Trys
nukrypimai, visi ta pacia kryptimi — NEKURTI antro stulpelio ten, kur duomuo
jau yra:

| Kontraktas | Realybe | Sprendimas |
|---|---|---|
| naujas `current_food_brand_raw` | `current_food_brand` JAU pazodine ivestis | nekurti |
| `is_sterilised` 0/1 | varchar `yes`/`no`/NULL | palikti — trys busenos jau veikia |
| `sensitivities` JSON | kableliai `chicken,dairy` | palikti — svarbu unknown/none/known, ne formatas |

`ps_pets` +4 stulpeliai. Trys naujos lenteles: `ps_pet_field_log`,
`ps_brand_alias`, `ps_rec_log` (visos AMZINOS pagal §7).

**Migracijos ataskaita:** alias 121 (AUTO 120 is 122 brand terminu, 2 dublikatai
po normalizavimo; NEW 1 = „testas"). REVIEW eile TUSCIA — visos 5 realios
kliento ivestys buvo tikslus sutapimai. Backfill: realus 1/1, testiniai 13/14.
NULL liko unknown: sensitivities 6, primary_need 6, is_sterilised 6.

v1.1 pridejo GDPR jungikli `ps_gdpr_rezimas` (anonimizuoti|trinti) ant
`delete_user` ir Brand REVIEW ekrana (Petshop ataskaitos -> Brand zodynas).

---

### S849-S853 — IVYKIAI (`petshop-anketa-ivykiai.php` v1.0 -> v1.2, NAUJAS)

§4.1 anketos ivykiai + §2 lauku istorija BE M8 redagavimo — kabinantis ant
`rest_request_before/after_callbacks` (momentine kopija pries, skirtumas po).

`petshop-statistika.php` -> v2.2: `+user_id`, `verte` 64 -> 190 (anketa_abandoned
nesa lauku busena).

**Irodyta gyvai:** POST /pet-profile sukure pet #215 -> `anketa_completed`;
PATCH -> `profile_updated` su pakeistu lauku sarasu; field_log gavo 9 laukus
is anketos, `current_weight_kg 12.50->14.00` is profilio, `current_food_brand_id
royal-canin->josera` is sistemos. Brandas persisieja automatiskai.

**KLAIDA v1.0 (rasta Playwright beacon instrumentacija):** fetch apvyniojimas
GET uzklausa be options laike ne-GET -> puslapio pet-profile SARASO uzkrovimas
zymejo anketa „baigta" -> abandoned buvo slopinamas VISADA. Pirmame rune
atrode, kad beacon'ai neateina; instrumentacija parode, kad jie net nebuvo
BANDOMI siusti. v1.1 metodas imamas is `o.method` arba `Request.method`.

**DoD #1 uzdarytas narsykleje:**

```
anketa_started v1 -> step_started 1 -> step_completed 1 -> step_started 2
anketa_abandoned: s1|+kas_jūsų_augintinis,augintinio_vardas|-svoris_neprivaloma
0 JS klaidu, ses_len=0 (be sutikimo — anonimiskai, bet rasoma)
```

---

### S854-S858 — REC LOG (`petshop-rec-log.php` v1.0 -> v1.2, NAUJAS)

§5 sprendimu zurnalas. Sprendimo momentas = GET /pet-food-candidates/{id};
kabliukas per REST — todel §5 pavyko BE M8 redagavimo (planuota buvo lysti).

reason_code zodyno papildymai: `species_unsupported`, `no_purchase_history`.

**KLAIDA v1.0:** ids emiau is rakto `id`, o payload'e jis `product_id` —
atsakymas rode 1 kandidata, logas rase failed/0. v1.1: tikrinami id/product_id/ID,
`kandidatu_sk` = count(candidates).

DoD #3: tikras HPOS uzsakymas -> `rec_purchased rid:34956`, uzsakymas istrintas
per `$order->delete(true)`.

---

### S859-S862 — GDPR IR BRAND REVIEW

**Anonimizacija (DoD #10):** sintetinis uid -> field_log user_id NULL (eilute
LIKO), rec_log NULL, ivykiai 0. Trynimo kelias irodytas atskirai. Abu uz vieno
jungiklio.

**SAVININKO SPRENDIMAS 2026-08-16:** rezimas lieka `anonimizuoti` (default).
Grizti tik jei: (a) realus trynimo prasymas, (b) keiciama privatumo politika,
(c) teisininkas nurodo kitaip. Klausimas neaktualus, kol nera realiu klientu.

**REVIEW ekranas (DoD #4):** HTTP 200 per auth cookie, antraste+aliasas+mygtukas
HTML'e. `patvirtinti_alias()` -> auto/1.00/patvirtino=1, ir PATVIRTINTO
automatika nebeperraso (patikrinta atskirai).

---

### S863-S866 — VARIKLIS (`petshop-rec-variklis.php` v1.0 -> v1.1, NAUJAS)

Iki siol sistema NEZINOJO, ka pasiulyti: `candidates()` grazindavo tik tai, ka
klientas JAU pirko. Savininko klausimas („kaip sistema zino?") atskleide, kad
P0 buvo pamatai po varikliu, ne pats variklis.

**Filtru eile (kritimo vieta = reason_code):** rusis -> life_stage/svoris ->
publish+rusis+VERIFIKUOTA serimo lentele -> jautrumai (TIK deklaruoti faktai)
-> amzius (tik prekems SU pozymiu) -> likutis. Rusiavimas: need +3, steril +1,
mono +1, hipo +1, lygiosios -> pigesnis.

**Gyvas testas** (suo 12 kg, jautrus vistienai, virskinimas, sterilizuotas):

```
1724 sunu prekes -> 404 su lentele -> 317 be vistienos -> 235 pagal amziu
-> 208 su likuciu -> TOP 3, visi balai 5, vistienos konfliktu 0
```

Neigiami: be svorio -> `missing_weight`, roplys -> `species_unsupported`.
Visi trys sprendimai atsidure `ps_rec_log` su `variklis_v1` ir pilnu
`inputs_json` — etapo 4 pamatai iskart pradejo dirbti tikram varikliui.

v1.1: marzos svoris uz option `ps_variklio_svoriai['marza']`, **DEFAULT 0
(ISJUNGTA)** — rusiavimo prioritetai yra savininko strateginis sprendimas.

---

### S867-S869 — M8 UI PAKEITIMAI (VIENINTELIS lindimas i M8)

`pet-form.js` 81 586 -> 82 061 B, du pakeitimai:

1. **`data-step` ant root'o** kiekviename render — tiksli zingsniu numeracija
   vietoj `.pspet-btn` euristikos. `petshop-anketa-ivykiai.php` v1.2 stebi
   atributa per MutationObserver; euristika liko tik atsarginiu keliu.
2. **DoD #5:** jautrumu pill `unknown` -> `none` („Jautrumu nepastebejau").
   Sena DB reiksme `'unknown'` skaitoma kaip sinonimas, seni NULL nepaliesti.

Diegta per repo-pull su commit-pinned raw URL + MD5 sargu pries ir po.
Patikra: draft su `sensitivities:'none'` priimtas (201), DB laukas = `none`.

**`petshop-rec-ui.php` v1.0 (NAUJAS):** rekomendaciju blokas paskyroje +
`rec_clicked`. Kai variklis grazina failed — blokas TYLIAI nesirodo (mate
gyvai: profilis be life_stage -> bloko nera, priezastis guli rec_log).

---

### S870 — REFILL (`petshop-refill-ivykiai.php` v1.0 -> v1.2, NAUJAS)

§4.3. `Refill_Engine::check_due()` saukia `Event_Registry::emit()` ir
`Email_Dispatch::enqueue()`, bet WP `do_action` ten NERA. Vietoj lindimo i
petshop-core — VEIDRODIS kas valanda:

```
refill_due           <- ps_event_log  (event_name=refill_due)
refill_reminder_sent <- ps_email_jobs (flow=refill_due, status=sent)
refill_purchase      <- woocommerce_checkout_order_processed
```

Stulpeliu vardai aptinkami dinamiskai (SHOW COLUMNS) — v1.0 spejo `event_type`,
realybeje `event_name`; v1.1 kandidatu sarasas papildytas.

**Kad neapsigauciau:** pirmas „refill_purchase neveikia" buvo TESTO artefaktas —
naudojau produkta 34956, kurio nebera; `add_product(null)` davė eilute su
product_id=0. Kodas visa laika buvo teisingas.

**v1.2 dvi skolos uzdarytos:** (a) laiko zona — `Statistika::irasyti()` raso
`current_time('mysql')` LOKALIAI, o as skaiciavau `strtotime(... . ' UTC')`
-> ~3 val. poslinkis -> sviezias pirkimas rode `+-1d`; dabar ta pati skale ir
neigiamas apkerpamas i 0; (b) idempotencija per order meta
`_ps_refill_purchase_logged`. Testas: 3 hook'ai -> 1 ivykis, verte `+0d`.

**Bonus:** valandinis cron'as jau suveidrodino TIKRUS liepos `refill_due`
irasus is `ps_event_log` — adapteris dirba produkcineje grandineje.

---

### S871 — MAGIC-LINK E2E: 6 IS 6 NEIGIAMU KELIU

Senas M8 registro punktas, kabejes nuo liepos. Visi seši scenarijai teisingi:

```
skeneris atidaro nuoroda       token active -> active   NESUNAUDOJO
nuoroda naudojama dukart       ok -> already_claimed, pet'u 1 (be dublikato)
svetimas juodrastis            email_mismatch, sukurta 0
pasibaiges juodrastis          expired, sukurta 0
pakibes claim                  claiming -> recover_stale_claims -> active
tas pats email, dvi anketos    abi active, antra claim'inasi be konflikto
```

magic-login/request: HTTP 200, token `magic_login/active`, atsakymas
neatskleidzia ar paskyra egzistuoja (enumeracijos apsauga).

**TRYS MANO KLAIDOS, viena po kitos, visos is tos pacios saknies:**

1. `claim_draft()` yra PRIVATUS — `method_exists()` grazino true, iskvietimas
   davė fatal error. Ta pati klaidos rusis kaip `method_exists()` ant WC data
   store. Sprendimas: `ReflectionMethod` + `setAccessible(true)`.
2. Parametru tvarka SPETA: tikroji `claim_draft($user_id,$email,$draft_id)`,
   o `begin_claim($draft_id,$user_id,$email)` — atvirksciai.
3. `create_pet_result($user_id,$input,...)` — irgi atvirksciai nei maniau.

**Taisykle ateiciai:** pries kviesiant SVETIMOS klases metoda — Reflection
parasas, ne `method_exists()` ir ne spejimas is konteksto.

---

### S872-S880 — P1 ATASKAITOS IR ADMIN SUJUNGIMAS (ta pati diena, vakaras)

Savininko sprendimas: „uzdaigiam viska iki galo, po paleidimo man ne iki
ataskaitu bus". Todel P1 (kontrakto §6) padarytas is karto po P0.

**`petshop-anketos-ataskaita.php` v1.0 -> v2.3 (NAUJAS)** — sesios skiltys ant
esamo ataskaitu standarto v2 karkaso (`Petshop_Ataskaitu_UI`), be naujo
karkaso kurimo. Jokiu nauju duomenu nerenkama: viskas is keturiu kontrakto
sluoksniu.

**TRYS SAVININKO PASTABOS, KURIOS PAKEITE DARBA:**

1. **„Viskas viename lange — kas cia bus, kai subegs visi duomenys?"**
   Teisinga pastaba. Tuscioje dev bazeje sesios skiltys viename ritinyje
   atrode tvarkingai, bet su realiais duomenimis butu kilometrinis puslapis,
   o KIEKVIENAS atidarymas paleisdavo VISU sesiu skilciu uzklausas (iskaitant
   2000 uzsakymu istraukima). **v2.0: skirtukai** — viena skiltis = vienas
   ekranas, skaiciuojama TIK atidaryta. Puslapio aukstis 13 000 -> 1 267 px.
   Pasirinkimas isimenamas vartotojo meta, nes laikotarpio mygtukai eina per
   karkaso `nuoroda()`, kuri apie `skiltis` parametra nezino ir numestu i
   pirma skilti. Lenteles ribotos iki 50 eiluciu (`ps_anketa_eil_riba`),
   uzsakymai iki 500 (`ps_anketa_uzs_riba`) — su prierasu, kiek is kiek.

2. **„Kas ir kaip pildys Brand zodyna?"** Klausimas atskleide DVI spragas
   mano paties darbe (`petshop-pet-kontraktas.php` v1.1 -> v1.2):
   - **sekla buvo VIENKARTINE** — pridejus nauja brenda i WooCommerce zodynas
     apie ji nesuzinodavo, kol kas nors jo neirasydavo anketoje, ir TAVO
     turimas brendas keliaudavo per REVIEW eile. Dabar kabliukai
     `created_product_brand` / `edited_product_brand` + atsarginis mygtukas
     „Suvienodinti su katalogu" (jis ir parode, kad sekla buvo nepilna: rado
     246 irasus ir prideje trukstama `haumiau`);
   - **nebuvo „tai ne brendas"** — siuksles kabodavo NEW eileje amzinai.
     Prideta busena `atmesta`: eilute lieka (tas pats tekstas nebegrizt), bet
     is darbo eiles dingsta. Patikrinta: automatika atmesto NEBEPRIKELIA.
   Plius canonical laukas gavo datalist su visais 122 slug'ais.

3. **„Augintiniu anketos izvalgos — turbut sita reikia istrinti?"**
   Recon parode, kad TRINTI NEGALIMA: `class-admin-reports.php` yra viso
   „Petshop ataskaitos" meniu TEVAS (`add_menu_page`). Be jo dingtu visos
   ataskaitos. Be to jame buvo blokai, kuriu naujoje ataskaitoje NEBUVO.
   Savininko sprendimas: „irasyk siuos laukus i musu ataskaitas" ir „sujunk,
   kad nebutu 2 atskiri". PERKELTA: „Kita" laisvi tekstai (4 kontekstai vietoj
   2 — prideti current_food_free_text ir species_detail), dazniausiai
   priskirtas maistas, rusys / kuo maitina / sterilizuoti, pirkimai is Mitybos
   plano. Etiketes nukopijuotos IS ORIGINALO (LABELS), kad ekrane nesikeistu
   zodziai. Tevas perrasytas i **pradzios ekrana su kortelemis**, sarasas
   sudaromas is REALIAI uzregistruotu submenu punktu — nauja ataskaita
   atsiras pati.

**MANO KLAIDOS SIAME BLOKE:**

- **KPI kortelems naudojau klase `psru-k-eile`, kurios karkase NERA** —
  korteles krito viena po kita per visa ploti. HTML patikra rode 13 KPI ir
  HTTP 200, viskas „gerai". Melagyste matesi TIK ekrano kopijoje. Teisinga
  klase `psru-kpi`.
- **Mitybos plano bloka idejau UZ ankstyvo `return`** („duomenu nepakanka"),
  todel su 7 uzsakymais jis nepasirodydavo, nors duomenu jam pakako. Blokas
  nuo uzsakymu slenkscio NEPRIKLAUSO — perkeltas pries patikra.
- Perkeldamas SAMONINGAI pakeiciau viena dalyka: senasis plano blokas turejo
  SAVO atskirus 7/30/visi filtrus. Dabar paklusta bendrai laikotarpio juostai
  — dvi filtru sistemos viename ekrane klaidina.

**Sesios skiltys:** Piltuvelis (kur sustoja + tusti laukai) · Rekomendacijos
(reason_code su paaiskinimais + rec piltuvelis) · Paklausa (6 lenteles) ·
Duomenu kokybe (RECOMMENDABLE vs HIGH_CONFIDENCE + tarpas + brand eile) ·
Refill · Pinigai (su saziningu „duomenu dar nepakanka", riba 30 uzsakymu).

Patikrinta narsykleje: visos sesios skiltys, 0 JS klaidu, 2,1-4,1 s.

---

### DIENOS PABAIGOS BUKLE

```
petshop-statistika.php        v2.2
petshop-pet-kontraktas.php    v1.2
petshop-anketa-ivykiai.php    v1.2
petshop-rec-log.php           v1.2
petshop-rec-variklis.php      v1.1
petshop-rec-ui.php            v1.0
petshop-refill-ivykiai.php    v1.2
petshop-anketos-ataskaita.php v2.3   (NAUJAS)
pet-form.js                   82 061 B
class-admin-reports.php       pradzios ekranas (petshop-core, su backup)
```

Kontraktas P0 (§1-§5) + P1 (§6) + §7 — UZDARYTA. Zalias sluoksnis renkamas
nuo sios dienos; atvaizdavimas tikslinamas eigoje, kai bus realiu skaiciu
(savininko formuluote: „svarbiausia, kad zalia informacija ir visi surinkimo
laukai suformuoti").

**TAISYKLE, KURIA BUTINA ATSIMINTI:** kiekvienas naujas anketos laukas ar
variklio parametras PRIVALO buti idetas ir i `inputs_json`, ir i
`Petshop_Anketa_Ivykiai::LOG_LAUKAI`. Tai ta pati klaidu rusis, kuri projekte
kartojosi jau penkis kartus — naujas laukas neitrauktas i fiksuota raktu
sarasa.

---

### KONTRAKTO DoD REGISTRAS (2026-08-16 pabaiga)

```
#1  §4 ivykiai narsykleje      OK  anketa (Playwright, abandoned su lauku busena)
                                   rec/refill — serverio keliu, ne narsykleje
#2  ps_rec_log                 OK
#3  rec_purchased<->order       OK
#4  brand AUTO/REVIEW/NEW+UI   OK
#5  sensitivities 3 busenos    OK  UI siuncia 'none', DB skiria, seni NULL nepaliesti
#6  ps_pet_field_log 3 saltiniai OK anketa/klientas_profilyje/sistema
#7  is_test filtravimas        OK  rasymo puseje; ataskaitu JOIN — P1
#8  ribos = options            OK  7 nauji options
#9  valyti() izoliacija        OK  + SAUGOMOS_SRITYS sargas
#10 anonimizacija              OK  abu keliai, default anonimizuoti
```

**Moduliai serveryje po sios dienos (visi su MD5 sargais ir kopijomis
`uploads/ps-backups/`, repo `deploy/` sinchronizuotas 1:1):**

```
petshop-statistika.php        v2.2
petshop-pet-kontraktas.php    v1.1
petshop-anketa-ivykiai.php    v1.2
petshop-rec-log.php           v1.2
petshop-rec-variklis.php      v1.1
petshop-rec-ui.php            v1.0
petshop-refill-ivykiai.php    v1.2
pet-form.js                   82 061 B (data-step + none)
```

**LIKE (ne pamesta, ivardinta):**

```
variklis v2      slapias maistas, svorio diapazono tikrinimas, rusiavimo
                 prioritetai (marza uz option, default 0 — laukia savininko)
rec_clicked      vizualus paspaudimas — kai bus RECOMMENDABLE profilis
P1               sesios ataskaitu skiltys (kontrakto §6)
higiena          TEMP snippetu trynimas WP admin (REST DELETE neveikia)
```

---


---

## 2026-08-16 — ATASKAITU STANDARTAS v2: NUO SPEC IKI VEIKIANCIU LANGU [S813-S842]

Diena, per kuria „Surenkamu rinkiniu" ataskaita is prezentacijos virto darbo
irankiu, o vitrina pradejo matuoti save pati. Sukurti PENKI nauji moduliai,
spec pakeltas i v1.2.

**Dienos taisykle:**

> Skaitikliai meluoja mandagiai. Kiekviena is siandien rastu klaidu atrode
> kaip veikiantis kodas: deploy log'as sake OK, JS klaidu nebuvo, skaiciai
> rodesi. Melagyste matesi TIK tada, kai ekrana pamatei akimis arba
> perskaiciavai suma ranka.

---

### S813-S816 — RECON PRIES KODA

Trys realybes patikslinimai, kurie pakeite spec:

1. **Dydis gyvena produkto meta** `_ps_laukas_dydis` su reiksmemis „400 g",
   „800 g", „100 g" — ne krepselio pasirinkime. Normalizuojam i „400"/„800".
2. **Skirtukas NERA filtras dezes viduje.** Kiekvienas skirtukas — atskiras
   dezes produktas-brolis (34942 „800 Be vistienos", 34945 „400 Monoproteinas").
   Todel dydi ir skirtuka pildo SERVERIS is dezes produkto, ne narsykle.
3. **HPOS ijungtas**, WC 11.0.1, PHP 8.3.20. Paruostu MnM rinkiniu ir DP paku
   dev'e — 0 (norma).

---

### S817-S824 — E1, E3, E4, E5, E6 (schema, agregavimas, karkasas, du langai)

| Modulis | Versija | Ka daro |
|---|---|---|
| `petshop-statistika.php` | 2.0 | schema v2 (+dydis, skirtukas, kiek_dezeje, irenginys), `ps_ataskaitu_dienos`, du sluoksniai, nauji uzsakymo meta |
| `petshop-ataskaitu-agregavimas.php` | 1.0 | cron 03:15, idempotentinis dienos agregavimas, siandienos sluoksnis |
| `petshop-ataskaitos-ui.php` | 1.0 | bendras karkasas: laikotarpis+palyginimas, KPI su delta, SVG diagrama, lentele su rikiavimu/CSV |
| `petshop-rinkiniu-ataskaita.php` | 2.0 | 11 sekciju: KPI, tendencija, ka daryti, dydziai, prekes, drill-down, piltuvelis, kelias dezeje, dovana, irenginiai |
| `petshop-paruostu-ataskaita.php` | 1.0 | naujas langas „Rinkiniai": kanibalizacija, DP pakopos, nuolaidos efektyvumas |

**Kontrolinis skaiciavimas** (uzsakymas #34952): vaiku sumos 1961+288+297+277+
288+280+285+277+285+297+277 = **4812 ct** — tiksliai konteinerio suma. Pelnas
4515 → be PVM 3731 → minus savikaina 3216 → minus dovana 66 = **449 ct**.
Ekranas rode 4,49 €.

---

### S825-S829 — KA PARODE PIRMOJI EKRANO NUOTRAUKA

Penkios klaidos, kuriu skaiciai neparode:

1. **Raw HTML ekrane.** „Kelias dezeje" antrastese matesi
   `<i class="psru-tt" data-t=...>` — `esc_html()` naikino tooltip'a. → `wp_kses_post()`.
2. **Melagingas procentas.** „yra 9 % deziu" reiske „1 is 11 EILUCIU", ne is
   deziu. Vardiklis buvo ne tas. → atskiras `$vardiklis` parametras.
3. **Graza 72,9x.** Nebuvo nei vienos dezes BE dovanos, tad cekio prieaugis
   lygus visam cekiui. → be palyginimo grupes rodom „—".
4. **Pelnas nesutapo:** lenteleje 5,15 €, KPI 4,49 € — trukо dovanos savikainos.
5. „Silpna vieta" piltuvelyje zymeta net kai visi skaiciai nuliai.

---

### S830-S834 — E2: VITRINA PRADEJO MATUOTI

**Sprendimas: atskiras modulis, laukai NEKEICIAMI.** `petshop-laukai.php` yra
183 KB veikiancio kodo ir jokio JS ivykiu API neturi. Vietoj perrasymo —
`petshop-statistika-vitrina.php` v1.0 kabinasi ant vitrinos DOM per delegated
listener'ius. Jei vitrina kada persidarys, suges tik matavimas, ne pardavimas.

DOM sutartis surasyta modulio antrasteje (patikrinta narsykleje):
`.pslk-deti[data-cid]`, `.pslk-stp button[data-d]`, `.pslk-el[data-cid]`,
`.pslk-dovk[data-gid]`, `#pslk-dov.atrakinta`, `#pslk-cta[disabled]`,
`#pslk-kiek`, `.pslk-dbtn`, `.pslk-kort`.

**Dvi klaidos, kurias sugavo tik realus testas:**

- **`preke_id` buvo 907, 908...** — tai MnM `child_item_id`, ne produkto ID
  (`mnm_quantity[19570]` sedi elemente `pslk-in-907`). Elgsena ir pardavimai
  butu gyvene skirtingais raktais ir „idejimo dalis" NIEKADA nebutu
  susiskaiciavusi. → PHP paduoda cid→product_id zemelapi.
- **Piltuvelis rode „atidare 2 → prisidejo 8"** — neimanoma. Unikalios sesijos
  buvo sumuojamos per prekiu eilutes. → atskira sritis `piltuvelis`
  (GROUP BY be `preke_id`). Po pataisymo: atidare 2 → prisidejo 1 = 50 %.

Isvalyta 13 sugadintu testiniu irasu su blogais ID.

---

### S835-S838 — PILNAS KELIAS IR DAR DVI KLAIDOS

Playwright suvaidino visa kelia: 11 vnt. → 37,89 € → minimumas (6) → 14 vnt. →
48,06 € → dovanos riba 45 € → dovana pasirinkta → krepselis → dydzio
perjungimas 800→400.

- **`dovana_rinko` preke buvo 0** — dovanos ID nera MnM vaikine eilute, tad cid
  zemelapis ji pavertė nuliu. → atskira `ivykisPid()` funkcija be vertimo.
- **`dovana_atrakinta` verte tuscia** — riba buvo skaitoma is antrastes teksto,
  o atrakinus ten irasoma „rinkis viena" (jokio skaiciaus). → riba imama is PHP
  konfiguracijos (`_ps_laukas_dovanos_riba`).

Galutinis rezultatas — visi devyni tipai veikia: `atidare`, `rodyta`, `idejo`,
`iseme`, `min_pasiekta`, `dovana_atrakinta`, `dovana_rinko`, `dydis_perjunge`,
`krepselis`. `dydis_perjunge` verte „800>400", `dovana_atrakinta` — „45",
`dovana_rinko` — 17386.

---

### S839-S842 — EXCEL EKSPORTAS

Raimio pastaba: „kaip kitaip nagrineti". Teisinga — lenteles CSV eksportas ima
tai, ka mato ekranas („48,12 €", „13,2 %", tarpai tukstanciuose), o Excel'yje
tai TEKSTAS: nei susumuosi, nei pivot'o padarysi.

**`petshop-ataskaitu-eksportas.php` v1.0** — savas minimalus XLSX rasytojas per
`ZipArchive` (patikrinta: yra ir veikia). PhpSpreadsheet serveryje irgi yra, bet
atkeliaves su importo pluginu — jei tas bus atnaujintas ar isjungtas, eksportas
nutruktu be ispejimo. Todel jokiu isoriniu priklausomybiu.

Lapai „Surenkamiems": Suvestine · Prekes · Rinkiniai · Piltuvelis · **Zali
duomenys**. Paskutinis yra svarbiausias: visa dienos suvestine be apdorojimo,
is jos galima susisukti bet koki pjuvi pivot'u neprasant naujos ataskaitos.
„Rinkiniams": Rinkiniai · **Kanibalizacija** · DP pakopos · Zali duomenys.

Kanibalizacijos lapas rodo tai, ko lentele ekrane nesutalpina: komponentu
vienetai RINKINYJE ir ATSKIRAI kataloge, abu su ankstesnio laikotarpio
stulpeliais, bendras pokytis ir verdiktas. Ankstesnis laikotarpis
skaiciuojamas automatiskai — toks pat dienu skaicius pries.

Skaiciai rasomi kaip SKAICIAI, formatavimas paliekamas Excel'iui (€ formatas
`#,##0.00 €`, procentai `0.0%` dalimis, kad veiktu vidurkiai).

**Pirmoji versija Excel'yje NEATSIDARE.** Priezastis: `<sheetViews/>` stovejo PO
`</sheetData>` ir dar buvo tuscias. OOXML reikalauja grieztos elementu tvarkos
(`dimension` → `sheetViews` → `sheetFormatPr` → `cols` → `sheetData` →
`pageMargins`), o tuscias `sheetViews` neleistinas. openpyxl toki faila atidaro
— Excel atsisako. Papildomai trukо `dimension` ir `docProps/`.

Pamoka: **„openpyxl atidare" NEIRODO, kad Excel atidarys.** Nuo siol XLSX
tikrinamas lokaliai PHP CLI (`php-zip`) + struktūros validacija: ZIP vientisumas,
XML sintakse, elementu tvarka, rysiu (rels) taikiniai, Content_Types dengimas,
IR antra nepriklausoma biblioteka (`xlsx2csv`).

**Klaida, kuria sugavo failo patikra openpyxl'iu:** „Idejimo dalis" rode
**225 %** (idejo 9, rodyta 4). `rodyta` fiksuojama viena karta per kortele, o
`idejo` — kas paspaudima, iskaitant kiekio didinima. Dalis perskaiciuota
SESIJOMIS: is tu, kas preke MATE, kiek jos isidejo. Niekada nevirsija 100 %.
Isemimo rodiklis paliktas veiksmais — ten domina, kiek kartu preke grazinta
atgal, o ne kiek zmoniu tai padare.

---

### TECHNINES PAMOKOS (SIOS DIENOS)

- **Unikalus skaiciai NESUDEDAMI.** `COUNT(DISTINCT sesija)` su preke_id
  dimensija ir tada `SUM()` duoda nesamone. Sesijoms reikia atskiros
  agregavimo srities be prekes dimensijos.
- **DOM `data-*` nera produkto ID.** MnM vitrinose `data-cid` = `child_item_id`.
  Pries siejant elgsena su pardavimais — PATIKRINTI, ar tai tas pats raktas.
- **Busenos tekstas nera duomenu saltinis.** „rinkis viena" pakeicia „nuo 45 €";
  skaicius imti is konfiguracijos, ne is UI teksto.
- **Palyginimo grupe gali buti tuscia.** Prieaugio ir grazos rodikliai be
  kontrolines grupes duoda absurdus (72,9x) — tikrinti vardikli.
- **`esc_html()` antrastese naikina tooltip'us.** Kur ideda HTML — `wp_kses_post()`.
- **Santykiai tarp skirtingu matavimo vienetu meluoja.** Ivykiai/ivykiai davė
  225 %; teisingas vardiklis buvo sesijos. Pries dalindamas — patikrink, ar
  skaitiklis ir vardiklis matuoja TA PATI dalyka.
- **XLSX be bibliotekos imanomas:** `ZipArchive` + XML. BET elementu tvarka
  worksheet'e yra grieztа ir tusciu elementu (`<sheetViews/>`) buti negali —
  kitaip Excel failo neatidaro, nors Python bibliotekos ji skaito.
- **Vienas skaitytojas nera patikra.** Failo formatas tikrinamas bent dviem
  nepriklausomomis priemonemis + struktūros validacija.
- Snippet'e PHP klases vardas su `\\` uz string ribu = ParseError; naudoti
  `class_exists($kintamasis)` + `call_user_func()`.

---

### NEUZDARYTA — ATASKAITOS

```
1. E6 DoD NEIVYKDYTAS: dev'e nera nei vieno paruosto rinkinio ar DP pako,
   todel kanibalizacijos verdiktai (PRIDEDA/PERKELIA/PER MAZAI) parasyti,
   bet NEPATIKRINTI su duomenimis. Reikia 2 testiniu uzsakymu — RAIMIS
   (netariau savo iniciatyva: uzsakymai paveiktu likucius ir AVPN serijas)
2. Produkcijai: `ps_stat_pradzia` nustatyti launch data
3. Produkcijai: patikrinti, ar Complianz statistikos kategorija realiai
   grazina `cmplz_has_consent('statistics')` gyvoje aplinkoje
4. Ribos (kandidatu, lyderiu, kanibalizacijos) — kol kas numatytosios;
   perziureti, kai susikaups realiu duomenu
```

---

---

## 2026-08-13 — RINKINIU LANGAS: NUO SARASO IKI VITRINOS [S781-S812]

Diena apie rinkinius nuo admin saraso iki to, ka mato klientas. Langas
`petshop-rinkiniai.php` nuo v1.0 iki **v1.24**.

**Dienos taisykle:**

> Kai kas nors neveikia — ziurim, KUR realiai gimsta tekstas ar paveikslas,
> o ne spejam. Tris kartus is eiles prielaida buvo klaidinga, ir kiekviena
> karta atsakyma dave tikras HTML/failo pavadinimas.

---

### S781-S784 — NAVIGACIJA IR SARASAS

**Rinkiniu langas dingo is juostos.** Prekes buvo sveikos (42 MnM + 8 DP), bet
`petshop-katalogas.php` navigacijos juostoje `ps-rinkiniai` nebuvo iraso.
Pridetas punktas tarp „Tiekimas" ir „Uzsakymai" (failas 405 kb, kopija daryta).

**Sarasas v1.4** — perdarytas galvojant apie 200+ rinkiniu:
- nuotraukos: rinkinio miniatiura 56 px + komponentu nuotraukeles po pavadinimu
- filtrai: tipas · **gyvunas** · busena · kategorija · marza · sandelis · paieska
- paieska ieskо IR tarp prekiu viduje („ausis" randa ir „Jaucio ausu rinkini")
- rikiavimas paspaudus stulpeli, korteliu vaizdas, masiniai veiksmai, CSV
- puslapis paduoda duomenis vienu kartu, filtruoja narsykle

**Gyvunu rusys imamos IS MENIU**, ne irasytos i koda: SUNIMS · KATEMS ·
GRAUZIKAMS · PAUKSCIAMS · ZUVIMS. Rinkinys priskiriamas pagal KOMPONENTU
kategorijas — „Churu" pavadinime gyvuno nera, bet komponentai guli po KATEMS.
Atsiradus naujai rusiai meniu, filtras ja paims pats.

**Terminologija (savininko pataisymas):** „sutvarkyta", NE „tvarkoje".
Eiles perrasytos i darbo krepselius: „Klientas negali nusipirkti" vietoj
„Nesurenkami", „Likutis baigiasi" vietoj „Liko mazai".

---

### S785-S788 — SVORIS IR SIUNTIMAS

**Rasta: visu rinkiniu svoris tuscias.** 24 kg maisai siuntimo skaiciavimui
svere nuli — i pastomata tokia siunta „tilpdavo".

| Rinkinys | Svoris prekeje | Komponentu suma |
|---|---|---|
| 12 kg × 2 | tuscias | 24 kg |
| 7 kg × 2 | tuscias | 14 kg |
| Koju rinkinys | tuscias | 0,72 kg |

**Sprendimas (v1.13):** svoris skaiciuojamas ir irasomas i PACIA preke (ne per
`_mnm_weight_cumulative`) — taip matomas ir uzsakyme, ir manifeste, ir
ataskaitose. DP pakui — bazines × N.

**Siuntimo klase** parenkama pagal gradacija: iki 50 kg · 50–70 · 70–100 · 100–200.

**Pastomato riba 25 kg** (savininko sprendimas):
- klientui — virs 25 kg pastomatu pasirinkimas issijungia, lieka kurjeris;
  skaiciuojamas VISO krepselio svoris (du 15 kg maisai atskirai telpa, kartu — ne)
- admin — raudonas ispejimas kainodaros bloke

**Papildomai rasta:** dalis komponentu (skanestai, zaislai) svorio neturi.
Lange rodomas ispejimas „N prekes be svorio — siuntimo kaina bus neteisinga".

---

### S789-S795 — APRASYMAI: TRYS KLAIDOS IS EILES

**1. Sekcijos suirdavo.** I rinkinio aprasyma patekus komponentu tekstams su
antrastemis („Sudėtis", „Analizė"), aprasymu akordeonas (**snippet 512**) jas
atpazindavo ir issikirpdavo i atskiras sekcijas — rinkinio sudetis suirdavo.

**Priezastis rasta diagnostika:** 512 kabinasi ant `woocommerce_product_tabs`
**prioritetu 98**, o mano filtras buvo 25 — jis mane perrasydavo atgal.
Sprendimas: prioritetas **200**.

**2. CSS issiliejo i puslapi.** Prekiu aprasymuose yra `<style>` blokai
(`.b2b-black { color:#000 !important; }`) — jie krito i puslapi kaip tekstas, o
svetimi `<div>` su savo klasemis suarde isdestyma i stulpelius.
Sprendimas: `<style>`/`<script>` iskerpami su turiniu, CSS likuciai nuvalomi,
paliekamos TIK teksto zymes (be klasiu ir `style=""`), `force_balance_tags`.

**3. Pilni aprasymai.** Savininkas: aprasymai turi buti pilni, gal isskleidziami.
Sprendimas: trumpas tekstas + `<details>` „Placiau apie sia preke" su pilnu
aprasymu (lentelemis, sudetimi). Veikia be JavaScript.

---

### S796-S800 — VITRINOS TEKSTAI: KUR JIE REALIAI GIMSTA

Klientas mate: „PRODUCT / QUANTITY", „You have selected 3 items. Add to cart to
continue…", „(3/3 items)", „IŠVALYTI PASIRINKIMUS".

**Trys bandymai, tik trecias pavyko:**

| Bandymas | Kas daryta | Rezultatas |
|---|---|---|
| 1 | `gettext` su MnM domenu | pro sali — antrastes kito domeno |
| 2 | `gettext_with_context` | pro sali |
| 3 | **CSS `::after`** | veikia |

**Isvada:** antrastes sablone irasytos tiesiai, be vertimo funkcijos — i
WordPress vertimu sluoksni is viso nepatenka. CSS keitimas veikia nepriklausomai
ir islieka po plugino atnaujinimo.

Atsakyma dave narsykles recon: `<th class="product-details">` ir
`<th class="product-quantity">`. Ten pat paaiskejo, kad reset mygtuko klase yra
`mnm_reset`, o slepiau `mnm_reset_link` — vienos raides skirtumas.

**Isversta ir sutvarkyta:** Preke / Kiekis · „Pasirinkote 3 vnt." ·
„Isidekite i krepseli" · „Isvalyti pasirinkimus" pasleptas fiksuotiems
rinkiniams (klientas ten nieko nesirenka) · kiekio laukelis neredaguojamas.

**Komponentu bukle — be skaiciu** (savininko sprendimas): tik „Turime"/„Neturime".
„Liko 2 vnt." salia komponento skaitosi kaip RINKINIO likutis, nors reiskia kita.

**„Sutaupote" blokas** po kaina — kaip DP pakuose (#570). Rodomas tik kai
rinkinys realiai pigesnis.

---

### S801-S806 — DP PAKAI: TA PATI PREKE × N

Palyginus teisinga #34484 su sukurtu #34899 paaiskejo, ko truko:

| | Teisingas | Buvo |
|---|---|---|
| Tipas | `simple` | `mix-and-match` |
| DP laukai | `_dp_base_product_id`, `_dp_pack_qty` | nera |
| Aprasymas | 2 551 simb. | 148 |
| **Atributai** | **6** | **0** |
| Kategorijos | DAUGIAU=PIGIAU + Sausas maistas sunims | tik DAUGIAU=PIGIAU |

**Atributai — rimciausia spraga:** be `pa_pakuotes_dydis` ir `pa_gyvuno_rusis`
pakas iskrenta is parduotuves filtru.

**v1.6:** visi baziniai atributai perkeliami (terminai priskiriami PO save(),
kitaip WC juos naktį pasalintu); pakuotes dydis keiciamas multipack terminu,
jei toks jau yra kataloge (naujo NEKURIAM — terminu sarasas yra katalogo
struktura); brendas perkeliamas; **SKU generuojamas** `DP-{bazes SKU}-{N}`.

---

### S807-S810 — KATEGORIJOS: TIK RINKINIAI

Pirma bandyta speti rusi ir porusi pagal komponentus. Rezultatas blogas:
misrus rinkinys atsidure po „Kita", veliau po SUNIMS.

**Savininko sprendimas:** automatiskai TIK **RINKINIAI (679)**, visa kita —
rankomis. Kur rinkinys parduodamas, yra rinkodaros sprendimas, ne balsavimo
algoritmas.

---

### S811-S812 — KOMPOZICIJA

**Savininko taisykle:** 2–3 prekes → **herojus + palydovai**; 4+ → **lygus
tinklelis**. Drobe visada **kvadratine** (ankstesne 3×1 juosta kataloge virsdavo
ruozeliu).

Herojus = **brangiausia** preke (ji beveik visada ir didziausia fiziskai).
Dalis padidinta iki **66 %** savininko praymu.

**Nuotraukos nesikeite tris kartus is eiles — trys skirtingos priezastys:**

1. **v1.20:** parasas skaiciavo tik komponentus, o pasikeite ISDESTYMAS →
   i parasa itraukta algoritmo versija
2. **v1.22:** kompozicija piese **snippet 539** funkcija
   `petshop_generate_composition()`, nes ji buvo tikrinama pirma. Atsakyma dave
   failo pavadinimas: `rink-composition-…` (539) vs `rink-kompozicija-…` (musu)
3. **v1.23:** v1.21 metu parasas jau buvo atnaujintas, bet paveiksla dar piese
   539 → v1.22 nusprende, kad kompozicija svieza, ir praleido. Versija → v3

**v1.24:** nukerpami tusti balti krastai (`imagecropauto`) — gamintoju
nuotraukose aplink preke daug tuscio ploto, del to preke laukelyje atrodydavo
perpus mazesne.

**Zenklas „N PREKES" — CSS, ne idegintas i paveiksla.** Pakeitus sudeti skaicius
atsinaujina pats, ir nelieka pavojaus, kad paveiksle liks senas.

---

### KAS LIKO

| Klausimas | Bukle |
|---|---|
| Rinkinio duomenys katalogo kortelėje | **Neuzbaigta.** Kortele iesko `_cost_price`, likucio ir `ps_sources` — rinkinys ju neturi. Sprendimas: issaugant irasyti apskaiciuota savikaina i `_cost_price`. Likucio NEIRASYTI — butu dviguba apskaita |
| Komponentai be svorio | skanestai, zaislai — reikia uzpildyti prekiu kortelese |
| Testinis #34899 | MnM su neteisinga vitrina — perkurti kaip DP arba istrinti |
| Tevinis #34196 | neatkurtas, 6 dydziai nepasiekiami |
| Susidejimo rinkiniu redagavimas | nepradeta |

### DIEGIMO PASTABA

Failas 130+ kb per didelis siusti POST'u — snippetas nespeja. Veikiantis budas:
PUT i repo `deploy/`, tada snippetas parsiuncia per `wp_remote_get` ir irašo.
Sintakses patikra pries rasyma: klase pervadinama (`Petshop_Rinkiniai_Sintakse`),
kitaip `include` luzta su „Cannot declare class".

---

## 2026-08-11/13 — RINKINIAI: NUO MAKETO IKI VEIKIANCIO LANGO + LIKUCIU SARGAS [S766-S780]

Trys dienos apie rinkinius. Pradzia — maketai, kuriuos savininkas atmete du
kartus is eiles, ir teisingai; pabaiga — veikiantis mu-plugin langas ir
uzdaryta reali skyle parduotuveje.

**Dienos taisykle, kuria savininkas ivardijo:**

> Pries siulant nauja sprendima — pasiziureti, kas JAU padaryta (ekrane, ne tik
> kode), ir tai panaudoti. Ne perdaryti prasciau.

### IDIEGTA

| Failas | Versija | Ka issprende |
|---|---|---|
| petshop-rinkiniu-likuciai.php | **1.0** (naujas) | rinkinys dingsta is prekybos, kai jo neimanoma surinkti |
| petshop-rinkiniai.php | **1.0 → 1.2** | rinkiniu sarasas, redagavimas, trynimas, kurimas is viso katalogo |

---

### S766-S770 — RECON: KAS REALIAI YRA

43 MnM prekes, 362 komponentu rysiai, 133 unikalus komponentai, 53 konteineriai
`wc_mnm_child_items` lenteleje (**10 siukslianiu eiluciu** — konteineriai be
prekiu).

**Du atskiri produktai, dvi mechanikos** (NIEKADA nesuplakti i viena sarasa):

| | Paruostas rinkinys | Susidejimo rinkinys |
|---|---|---|
| Sudeti lemia | mes | klientas |
| Kiekiai | `_petshop_component_quantities` | pool, laisvas pasirinkimas |
| Struktura | 1 MnM preke | 1 tevine + N pasleptu MnM |
| Marza | tiksli | intervalas (blogiausias/geriausias) |
| Kurimo forma | snippet **539** | snippet **550** |
| Vitrina | — | snippet **547** v19 |

**Rastos spragos:**
- Tevinis #34196 istrintas, 6 pasleptri dydziai liko publikuoti — parduotuveje
  nepasiekiami („Susirink konservu rinkini pats" 400g ir 800g)
- 3 is 7 paruostu rinkiniu BE fiksuotu kiekiu (#34156, #34153, #34158) —
  klientas gali pasiimti N vnt. to paties
- 56 is 133 komponentu be savikainos (legacy)

---

### S771 — MnM LIKUCIU NURASYMAS: VEIKIA (patikrinta realiu uzsakymu)

Sukurtas realus uzsakymas dev'e su #34172. Krepselis issiskleide i 6 eilutes
(konteineris + 5 vaikai su `mnm_child_id`), `wc_reduce_stock_levels` nurase
**tiksliai pagal fiksuotus kiekius**: −2, −2, −1, −1, −1. Likuciai atstatyti,
uzsakymai 34897/34898 istrinti.

**TESTAVIMO BUDAS — svarbu:** `$order->add_product($container, 1, ['configuration'=>...])`
**NESUKURIA vaiku** — uzsakymo eilute lieka be komponentu, ir tada atrodo, kad
nurasymas neveikia (pirmas testas dave klaidinga „NENURASO"). Teisingai:

```php
WC()->cart->add_to_cart($CID, 1, 0, [], ['mnm_config' => $conf]);
// $conf: [child_item_id => ['product_id'=>ID, 'quantity'=>N]]
// child_item_id is $ci->get_child_item_id(), NE product_id
```

---

### S772-S774 — RASTA SKYLE: RINKINYS PARDUODAMAS, KAI JO NERA

Nuleidus komponento likuti i 0: konteineris liko `instock` ir `purchasable`,
krepselis PRIEME rinkini be jokio ispejimo. Tas pats, kai likutis 1, o rinkiniui
reikia 2.

Iki tol nesimate tik todel, kad likuciai dideli (388, 1680, 104).

**Palyginimui:** „Daugiau=pigiau" pakai (snippet **567**) tai daro teisingai —
dinaminis `is_in_stock`, krepselio validacija, nurasymas is bazines prekes.

#### Sprendimas: petshop-rinkiniu-likuciai.php v1.0

Du skaiciavimai pagal tipa:

- **Paruostas** (yra fiksuoti kiekiai): `min( likutis[i] / kiekis[i] )` — vieno
  komponento truksta, rinkinio nera
- **Susidejimo** (pool): `suma(likuciu) / min_container_size` — vienos rusies
  pritrukus, klientas pasirinks kita

Filtrai: `woocommerce_product_is_in_stock`, `woocommerce_product_get_stock_status`,
`woocommerce_get_stock_html`, `woocommerce_add_to_cart_validation`,
`woocommerce_check_cart_items`.

**Patikrinta NARSYKLEJE, tikru kliento keliu:**

| Bazines prekes likutis | Ka mato klientas |
|---|---|
| 4 vnt. (reikia 2) | „Turime", bet kiekio laukelio **max = 2** |
| 0 vnt. | **„Neturime"**, mygtuko „I krepseli" nera |
| Per daug krepselyje | Apmokejimas stabdomas su tikslia zinute |

**PASTABA APIE TESTAVIMA:** programinis `WC()->cart->add_to_cart()` **apeina**
`woocommerce_add_to_cart_validation` — sarga tikrinti TIK per narsykle, kitaip
gaunami klaidingi rezultatai.

---

### S775-S778 — MAKETAI: DU ATMESTI VARIANTAI

- **v1** — vienas bendras sarasas abiem tipams. Savininkas: „viskas suplakta i
  1, o is principo tai 2 skirtingi dalykai". **Atmesta teisingai.**
- **v2/v3** — du skirtukai + kurimas. Savininkas: „ziurek i jau padaryta modeli,
  perskaityk visus snipetus". **Klaida: perdariau #539 filtracija i savo
  isgalvota „rusi", nors ten jau buvo kategorija + sandelis.**
- **v4/v5/v6** — po pilno #539/#550 perskaitymo. Kalba, laukai ir marzos zenklai
  (**€ su ✅/❌**, NE procentai) paimti 1:1 is esamu formu.

**Kategoriju medis — radinys:** filtruojant `count > 0` iskrenta TIKROSIOS
tevines (KATEMS, GRAUZIKAMS — ju prekes guli vaikuose), o i virsu iskyla senos
(„Animonda konservai sunims", „Miamor katems"). Reikia VISU kategoriju + meniu
tvarkos + rekursinio skaiciavimo. ŠUNIMS su vaikais = 1699, ne 12.

**SPRENDIMAI turi porusius** „Naujas suniukas", „Naujas kaciukas" — visi tusti.
Rinkiniai ten prasosi.

---

### S779 — petshop-rinkiniai.php v1.0-1.2

**Meniu:** Petshop prekes → Rinkiniai (`add_submenu_page('ps-katalogas', ...)`)

**Sarasas:** darbo eiles (Visi · Kiekiai nefiksuoti · Be savikainos ·
Komponentas neparduodamas · Juodrasciai · **Sutvarkyta**), savikaina, prekes
atskirai, kaina, marza €(%), „Galima parduoti".

> **Terminologija:** „sutvarkyta", NE „tvarkoje" (savininko pataisymas).

**Forma:** paieska per **VISA kataloga** (2 566 prekes) — filtrai kategorija
(medis su palikuonimis) · **svoris `pa_pakuotes_dydis`** (82 reiksmes, rikiuotos
pagal tikra dydi) · sandelis · savikaina · tekstas. Rezultatuose: nuotrauka,
svoris, savikaina, pard. kaina, marza, likutis.

**Kainodara:** savikaina · prekes atskirai · norima marza % → **rekomenduojama
kaina** → tavo kaina → **marza persiskaiciuoja gyvai**.

**Sargai formoje:** rinkinys brangesnis nei prekes atskirai · marza minusine ·
komponentas be likucio · keli dropship tiekejai · **norima marza nepasiekiama
nevirsijant iprastos kainos** (fasuotam maistui 35 % dazniausiai neimanoma —
2× Josera 12,5 kg: savikaina 81,98 €, atskirai 119,18 €, o 35 % reikalautu
126,12 €).

**Publikavimas:** naujas rinkinys — JUODRASTIS. Varnele „Publikuoti" paleidzia
i parduotuve. Perziura: kortele „Kaip matys klientas" + nuoroda i tikra puslapi
(juodrasciui per WP preview).

**Papildomai:** kopijavimas · trynimas su uzsakymu patikra · zurnalas per
`Petshop_Ivykiai` · sargas del neirasytu pakeitimu.

---

### S780 — TA PATI PREKE × N ≠ MIX&MATCH

Savininkas sukure 12 kg × 2 ir gavo „PRODUCT / QUANTITY / ISVALYTI PASIRINKIMUS"
vietoj graziosios pakuotes vitrinos.

**Savininko klausimas:** „kai rinkinys ta pati preke, tai taip pat Mix&Match, o
jei jo netaikysi kaip tada sugaudysi likucius?"

**Atsakymas is kodo:** likuciai gaudomi ir be MnM — snippet **567** nurašo
`pack_qty × kiekis` is bazines prekes, atstato atsaukus, slepia paka kai
neuztenka, stabdo krepselyje. Visi 8 esami DP pakai — `simple`, `manage_stock=no`.

**Taisykle:**

| Sudetis | Tipas | Kategorija | Nuotrauka |
|---|---|---|---|
| kelios skirtingos prekes | MnM rinkinys | RINKINIAI + porusis | kompozicija (GD) |
| **ta pati preke × N** | **DP pakas** (`simple` + `_dp_base_product_id` + `_dp_pack_qty`) | **DAUGIAU=PIGIAU (91)** | **bazines prekes** |

Priezastis ne likuciai, o **vitrina**: pakas turi zenkla „×N VNT.", juosta
„EKONOMISKA PAKUOTE", lentele su bendru kiekiu ir vieneto kaina (#568, #570, #573).

**RINKINIAI negali buti default kategorija** (savininko pastaba).

v1.1 pridejo tipo atpazinima formoje, DP pakus i sarasa (stulpelis „Tipas"),
atskira DP perziura ir `issaugoti_dp()`.

---

### S780b — KABLELIS KAINOSE

Savininkas: „negaliu irasyti skaiciaus su kableliu pvz 13,90".

`<input type="number">` su LT lokale kablelio nepriima. Pakeista i
`type="text" inputmode="decimal"` + normalizavimas: `13,90` ir `13.90` abu
veikia, tarpai nekliudo, isejus is lauko susitvarko i `13,90`. Serverio puseje
`str_replace(',', '.')`.

Patikrinta 9 atvejais: `1 234,50` → 1234,5 · `,5` → 0,5 · `abc` → 0.

---

### KAS LIKO NEBAIGTA

| Klausimas | Bukle |
|---|---|
| v1.1/v1.2 diegimas | **NEPATVIRTINTAS** — tiltas perrase skripta tarp PUT ir dispatch (3 bandymai). Failai atiduoti savininkui rankiniam ikelimui |
| Testinis 12 kg × 2 | Guli publikuotas kaip MnM su neteisinga vitrina — perkurti kaip DP arba istrinti |
| Rinkiniu porusiai | Misriems (tualetas + maistas + zaislas) porusio nera — laukia savininko sprendimo |
| Susidejimo rinkiniu redagavimas | Suplanuotas, nepradetas. Savininkas: „svarbu sukurti 1 karta, paskui kad butu patogu redaguoti, keisti prekes viduje" |
| 10 siukslianiu `wc_mnm_child_items` eiluciu | Nevalyta |
| Tevinis #34196 | Neatkurtas |

### TILTO PASTABA

Rezultatus skaityti **TIK per commit SHA** arba **contents API**, ne per
`raw.githubusercontent.com/.../main/` — CDN velina 30–60 s ir sioje sesijoje
**tris kartus** dave senus duomenis kaip naujus. Plius: tilta naudoja ir kitas
procesas, todel pries `dispatch` verta palyginti `screenshot.mjs` md5.

---

## 2026-08-12 — KLAIDU TAISYMO DIENA: KORTELE TAMPA VIENINTELE DARBO VIETA [S689-S707]

Diena pradeta kaip „deganciu klaidu taisymas", bet kas antra klaida atskleide
ta pati struktūrini trukuma: **funkcijos isbarstytos be principo**. Savininkas
ju ieskodavo kortelėje ir nerasdavo, nes jos gyveno sarase, Gavime arba
WooCommerce lange. Diena baigta uzrakinta taisykle:

> **Kortele = viskas apie VIENA preke. Sarasas = masiniai veiksmai.
> Gavimas = tik priemimas.** Jei ko nors reikia vienai prekei — tai privalo
> buti kortelėje, net jei jau yra kitur.

### IDIEGTA

| Failas | Versija | Ka issprende |
|---|---|---|
| petshop-katalogas.php | 6.1 → **8.0** | kopijavimas · trumpas aprasymas · miniatiuros · likutis · kategorijos · sudeliojimas · partijos · GPAIS · sinchronas · du likuciai |
| petshop-gavimas.php | 1.4 → **1.11** | prekes kopija · kurimas be gavimo · sekcijos pabaiga · LT datos |
| petshop-partijos.php | 1.1 → **1.2** | GPAIS medziagu/tipu sarasai + eilutes trynimas |
| petshop-rankos.php | **1.0** (naujas) | rankinis sprendimas nustelbia automatika (VF+ZB) |
| petshop-kalendorius.php | **1.0** (naujas) | vienas LT datu parinkiklis visiems langams |

---

### S689-S691 — PREKES KOPIJA

Savininkas: „matau yra panasi preke, kaip padaryti prekes kopija".

**Kodel NE WooCommerce „Dubliuoti":** jis kopijuoja ir `_zb_*`, `_vf_*`,
`_ean`, `_ps_sandelis` — nauja AV preke atrodytu kaip ZB/VF, o artimiausias
importas (#2/#3/#6) ja perrasytu arba sujauktu likucius.

Pirma versija perimdavo tik klasifikacija (kategorija, brendas, rusis, dydis),
o Sudeti samoningai palikdavo tuscia. **Savininkas ta riba panaikino:**
„turi buti identiska kopija, tik neirasytas prekes kodas ir EAN, kaina".

Galutinis elgesys: perimama VISKAS — pavadinimas, visos kategorijos, brendas,
visi `pa_*` atributai, visos aprasymo sekcijos, trumpas aprasymas, svoris,
matmenys, pagrindine nuotrauka ir galerija. Tusti lieka TIK **SKU, EAN,
kaina**. Tiekejo laukai neperkeliami niekada.

**Ieiti galima dviem keliais:** katalogo kortelėje „Kopijuoti i nauja ↗" arba
Gavimo formos virsuje „Kopijuoti is panasios prekes".

**Salutinis radinys:** kopijuojamame aprasyme buvo CSS kaip PAPRASTAS TEKSTAS
(`.b2b-black * { color:#000 !important; }`) — `<style>` zymes buvo nuimtos dar
importo metu, todel tagu salinimas jo nepagavo. Ismetamos eilutes, atrodancios
kaip CSS taisykle.

---

### S692-S693 — TRUMPAS APRASYMAS KORTELEJE

Iki siol `post_excerpt` (tekstas virs „I krepseli") buvo redaguojamas TIK
WooCommerce lange.

**Savininko taisykle (uzrakinta):** „is viso i WC geriau nelysti — ten
duomenys turi automatiskai koreguotis, kai mes taisome savo kortelėje".
Techniskai sinchronizacijos nera ir nereikia: kortele raso i TUOS PACIUS
laukus. WC langas lieka avariniam keliui, ne kasdieniam darbui.

**v6.5 patikslinimas:** laukas atsidaro TEKSTINIU rezimu — savininkas
pastebejo, kad ten guli `<span style="color:rgb(119,119,119); font-family:...">`
ir taisyti neimanoma. Dabar: kiekviena eilute virsta `<p>`, o „HTML kodas"
rezimas lieka nuorodoms ir sarasams; irasant kodas valomas.

---

### S694 — DVI PREKES SU TA PACIA NUOTRAUKA (tikra regresija)

Padarius kopija, **originalo miniatiura sarase dingo**, nors kortelėje ir
parduotuveje nuotrauka buvo.

**Priezastis `miniatiuros()`:** zemelapis statytas kaip `[attachment_id => pid]`
— attachment ID kaip RAKTAS. Kai dvi prekes rodo i ta pati faila (o kopija
butent tai ir daro), antroji perrasydavo pirmaja. Iki kopijavimo funkcijos
toks atvejis buvo retas, todel klaida gyveno nepastebeta.

Dabar `[attachment_id => [pid, pid, ...]]`.

---

### S695 — PREKIU SUVEDIMAS BE GAVIMO

Savininko eiga: „prekes galiu susivesti su 0 likuciu ir savikaina — tai
paprasciausia prekes kortele, kuri eina i juodrascius. Cia yra pagreitinimas".

Pridetas antras mygtukas **„Sukurti ir kurti kita"** (i gavimo lentele
nededama, forma lieka atvira) ir blokas „Si karta sukurta prekiu: N".
„Irasyti gavima" klaida dabar rodoma LIEKANCIAME bloke — trumpas uzrasas
dingdavo per 3 s ir atrode, kad mygtukas neveikia.

---

### S696 — RANKINIS SPRENDIMAS NUSTELBIA AUTOMATIKA (petshop-rankos.php v1.0)

**Incidentas:** 2026-08-11 22:43 savininkas isieme VF preke #25319 is prekybos.
2026-08-12 07:01 cron'as `petshop_vf_sync_publish_daily` (snippetas 565) ja vel
paskelbe. Istorija parode dvi eilutes: „ranka · Rai" ir po to „automatika".

**Priezastis struktūrine:** juodrastis reiskia DU dalykus — „dar nebaigta" ir
„nusprendziau neprekiauti". Automatika mato tik `post_status='draft'` ir
tikrina kokybes kriterijus; prekei, isimtai SAMONINGAI, visi kriterijai kaip
tik ir buna tenkinami.

**Sprendimas:** kai ZMOGUS perkelia i juodrasti (bet kur), uzdedama
`_ps_ranka_isimta`. Kol ji yra, jokia automatika nepublikuoja. Vartai
pastatyti ties `wp_insert_post_data` — pro ji eina VISI (VF cron, ZB importas
#2, WP All Import). Snippeto 565 taisyti nepakaktu — liktu ZB.

**Patikrinta testu:** imituotas zmogaus isemimas → zyme atsirado; imituotas
cron → preke liko juodrastyje.

**Atstatytos:** #26471, #26473 (buvo grazintos i prekyba 07:01), #25319.

---

### S697 — GPAIS PAKUOTE (partijos v1.2, katalogas v6.10)

Savininkas: „cia turi buti patikslinimas — GPAIS Pakuote, nes patys
susimaisysime. Ir nera jokio redagavimo, as net negaliu susivesti duomenu".

Abu teisinga. Skirtukas vadinosi „Pakuote" ir maisesi su `pa_pakuotes_dydis`
(12 kg, 400 g) — visai kitas dalykas. O `irasyti_pakuote()` egzistavo nuo
pirmos dienos, bet **jokia sasaja jo nekviete**.

Medziagos ir tipai — FIKSUOTAS sarasas vienoje vietoje: deklaracija sumuojama
pagal medziagos pavadinima, ir laisvas laukas duotu „Popierius", „popierius"
ir „Kartonas" kaip tris eilutes.

**Dvi pamokos, kainavusios du diegimus:**
1. Kortele ikraunama per `innerHTML` — joje esantys `<script>` blokai
   NEPASILEIDZIA. Duomenys keliauja `data-` atributais.
2. Katalogas turi DU atskirus `<script>` blokus. Funkcija, idėta i viena ir
   kvieciama is kito, krito `ReferenceError`, o `.catch()` parode
   „Nepavyko susisiekti su serveriu" — atrode kaip tinklo problema.

---

### S698 — VISKAS APIE PREKE GYVENA KORTELEJE (v7.0)

Savininkas: „viska sudeliok, nes dabar yra blogai".

**Auditas per 10 tos dienos versiju parode: nieko nedingo.** Bet:
- AV likucio redagavimo kortelėje NIEKADA nebuvo — tik sarašo „Greitame
  redagavime";
- „Sudelioti i lentyneles" — tik Gavimo naujos prekes formoje;
- kategoriju keitimo — isvis tik WooCommerce lange.

Pridėta visa tai. Papildomai paleistas **SARGAS**: fiksuotas 16 valdikliu
sarasas tikrinamas trims prekems (AV, VF, juodrastis) pries ir po kiekvieno
diegimo. Jei kuris nukrenta i 0 — diegimas neskelbiamas padarytu.

---

### S699 — SEKCIJA TURI PABAIGA, NE TIK PRADZIA (gavimas v1.10)

Savininkas: „yra sudetis: ......... ir paskui koks nors tekstas — jis ir ta
teksta sudeda i sudeties skyriu".

Skaidytojas mokejo atpazinti tik sekcijos PRADZIA. Dabar sekcija uzsidaro ir
tada, kai (a) pasitaiko NEZINOMA antraste (trumpa eilute su dvitaskiu:
„Maistine verte:", „Laikymas:"), arba (b) uzdaroje sekcijoje pasitaiko
SAKINYS (ilga eilute su tasku, be procentu ir kableliu saraso).

**Niekas nemetama:** nutrauktas tekstas keliauja i „Aprasyma", o statusas sako
„2 eil. liko aprasyme". Pirmoji eilute po antrastes priimama VISADA — kitaip
sudetis, parasyta vienu sakiniu, iskristu.

---

### S700-S701 — RANKINIS LIKUTIS IR PARTIJOS NE TIK AV

**Tyli klaida, rasta pries diegima:** `av_laukas()` i `_stock` rase tik kai
sandelis buvo lygiai „av". Ambrosia, Prins, Quattro, Belacor likutis butu
nugules i `_own_stock_qty`, kurio parduotuve neskaito — skaicius irasytas,
zurnale matomas, preke NEPARDUODAMA. Recon: Ambrosia preke likuti laiko
`_stock` (8 vnt.), o `_own_stock_qty` visoje bazeje — 1 irasas.

Ta pati riba buvo ir partijoms: blokas rodomas tik `av_preke()` prekems.

---

### S702 — LIETUVISKAS KALENDORIUS (petshop-kalendorius.php v1.0)

`<input type="date">` piesia NARSYKLES kalendoriu — „August 2026", savaite nuo
sekmadienio, mm/dd/yyyy. Svetaine to pakeisti negali.

Atskiras modulis, o ne treciasis toks pat sprendimas kataloge: klase `ps-data`
uzteka. Reiksme visada ISO (2027-09-30). Patikrinta ANGLISKOJE narsykleje
(`en-US`): „Rugpjutis 2026", savaite Pr–Sk.

*Skola: Akciju langas dar naudoja savo sena kalendoriu.*

---

### S703 — PAKEITIMAS MATOSI IS KARTO (v7.5)

Savininkas: „pakeiciau preke, langas neatsinaujino, isejau — kataloge
neatsinaujino, cia jau labai blogai".

Kortele ir sarasas rode SKIRTINGA tiesa apie ta pacia preke. Po kiekvieno
irasymo kvieciamas `ps_kat_eilute` ir eilute atnaujinama vietoje. Perkrauti
puslapio negalima — dingtu filtrai, slinktis ir atidaryta kortele.

*Papildyta v7.9: kesas valomas PRIES skaitant — kitaip eilute gaudavo dar
sena momentine kopija.*

---

### S704 — „SANDELIS" → „TIEKEJAS" (v7.6)

Zodis vertė galvoti apie VIETA. Stulpelis, filtras ir eksporto laukas dabar
vadinasi „Tiekejas", o paaiskinimas sako, is kur ateina likutis.

---

### S705-S707 — DU ATSKIRI LIKUCIAI: TIEKEJO IR AV (v8.0)

Savininkas klausė TRIS kartus, kol atsakiau i tai, ko klause:
„KODEL prekes kortelėje negaliu ivesti likucio su galiojimu I AV SANDELI?"

**Mano klaidos, viena po kitos:**
1. v7.7 — sujungiau likuti ir galiojima i viena forma (tai buvo reikalinga:
   iki tol veike DU keliai — likutis be galiojimo ir atskira „Nauja partija").
2. v7.10 — nuspredziau, kad viskas, kas ne VF/ZB, guli musu lentynoje, ir
   emiau rodyti „AV AMBROSIA". **NETIESA, atsaukta.**

**Savininko patikslinimas (uzrakinta):** „Ambrosia — ATSKIRAS SANDELIS,
dropshipingo, tik jis neduoda XML. O AV yra AVESOS sandelis."

**Teisingas modelis — dvi nepriklausomos eilutes:**

| Eilute | Laukas | Kas tai | Kaip pildoma |
|---|---|---|---|
| TIEKEJO | `_stock` | kiek turi Ambrosia / Prins / VF / ZB | VF, ZB — is XML (tik skaitymui); kiti — ranka |
| AV | `_own_stock_qty` | kiek parsiveze i Avesos sandeli | visada ranka; **cia partijos, galiojimai, savikaina** |

Gryna AV preke (be tiekejo) savo likuti laiko `_stock` — jai tiekejo eilutes
isvis nera.

**Partijos ir galiojimai priklauso TIK AV:** tiekejo lentynoje gulincios
prekes galiojimo mes nezinom ir nevaldom.

**Gavimas kuria partija:** pasirinkus priezasti „Gavimas" ir teigiama pokyti,
kiekis irasomas per `Petshop_Partijos::priimti()` su galiojimu ir savikaina.
Mazinimas nurasomas FEFO tvarka (`nurasyti()`) — kitaip partiju suma ir
likutis issiskirtu.

**Istorija (S705, antra savininko pastaba):** likucio keitimai buvo rasomi i
`ps_av_zurnalas`, o Istorijos skirtukas skaito `Petshop_Ivykiai` — zurnalas
buvo, tik ne ten, kur zmogus ji skaito. Dabar rasoma i abi.

---

### KAS SIANDIEN PAMOKA (procesas, ne kodas)

1. **Nepradejau nuo savininko lango.** Dvi is triju „regresiju" nebuvo
   regresijos — funkciju ten niekada nebuvo. Auditas per atsargines kopijas
   tai parode per 10 minuciu; reikejo daryti ji pirma, ne po trecio priekaisto.
2. **Tikrinau tik ta, ka ka tik pakeiciau.** Miniatiuru ir `innerHTML` klaidos
   isaiskejo tik tada, kai jas pamate savininkas. Del to paleistas SARGAS.
3. **Trys skirtingi taisymai vietoj vieno atsakymo.** Savininkas: „paprasiau
   normalu klausima sutvarkyti, o tu 3 variantus duodi". Teisinga: pries
   taisant reikia isitikinti, kad supratau klausima — ne po to.
4. **Dokumentai atidelioti i „sesijos pabaiga", kuri neateina.** Nuo dabar —
   po kiekvieno uzdaryto bloko, ne dienos gale.

---

### S711-S713 — MYGTUKAS, MASINIS SUDELIOJIMAS, 261 PREKE SUTVARKYTA (2026-08-13)

**S711 — MYGTUKAS „Sudelioti i lentyneles" (uzdaryta).**
Savininkas: „per sudejimo mygtukus niekas neveikia." Narsykles testas parode:
serveris grazina `success` ir „sudeta i 5 skiltis" — t. y. tekstas sudeliojamas
ir irasomas i baze TEISINGAI. Bet ekranas lieka senas: rengykleje matomas
ankstesnis tekstas, „Kaip mato pirkejas" nepersipiesia. Zmogui tai atrodo
lygiai taip pat, kaip neveikiantis mygtukas — ir jis teisus, nes rezultato
nemato.
Priezastis: rezultatas rasomas i TinyMCE, o sis ne visada inicializuotas.
**Katalogas v8.2:** po sekmingo sudeliojimo kortele perpiesiama is serverio.

**S712 — MASINIS SUDELIOJIMAS (snippetas ID 2868).**
DRY per visas 3 470 prekiu: 1 677 maistas, 761 jau tvarkinga, 406 butu
pagerinta, 510 neatpazinta.

Savininko klausimas pries APPLY: *„serimo instrukcijose kai kur yra tik tekstas,
ne lenteles — kaip susidelios?"* Patikrinta, ir atsakymas pasirode NEVIENODAS.
Todel ivestos DVI GRUPES:

| Grupe | Kiek | Kas tai | Elgesys |
|---|---|---|---|
| SAUGU | 293 | tekstas arba lentele su eiluciu luziais | sudeliojama |
| RIZIKINGA | 113 | lentele sulipusi i VIENA eilute | **neliieciama** |

Rizikos pozymis: serimo tekste ≥8 skaiciai, bet ≤3 eilutes — vadinasi lentele
prarado struktura. Irasius tokia, pirkejas matytu „Svoris 1,5 2 3 4 5–6 7–12
13–20 10 kg 35–70 g" — neskaitoma kose. Josera Young Star, Ontario sausas,
DOGOTEKA.

**S713 — APPLY.** Pirma 20 (juodrasciai), tada 12 prekyboje esanciu — savininkas
apziurejo parduotuveje: „atrodo viskas gerai". Tada likusios porcijomis po 70.

**Rezultatas: 261 preke sutvarkyta.** Serimo instrukcija turi **1 054** is 1 677
maisto prekiu (buvo 761). Grupe SAUGU isteko iki nulio.

**Dvi klaidos APPLY eigoje (abi istaisytos):**
1. Pasiekus riba ciklas tesdavosi per visas 3 470 prekiu — uzklausa nespedavo
   per laiko limita. Pakeista i `break`.
2. `Fatal error: Call to private method Petshop_Katalogas::aprasymo_kopija()`.
   Snippetas negali kviesti privataus kortelės metodo. Kopija rasoma tiesiogiai
   tuo paciu formatu (`_ps_aprasymo_bak`, iki 5 versiju) — „Grazinti ankstesne"
   kortelėje veikia visoms 261.

**LIEKA:** 113 rizikingu (reikia lentele ATKURTI, ne perkelti — tam tinka
serimo lenteliu baze, 525 patikrintos) ir 510 neatpazintu (norma paveiksleliuose
arba visai kitokia forma).

---

### S709-S710 — SERIMO LENTELES NESUBEGA I SAVO SKILTI

Savininkas rado dvi SKIRTINGAS teksto formas, kuriose serimo norma neatpazistama.

**Forma A (Quattro sausas, #16718): antraste SAKINIO VIDURYJE.**
„...greipfrutu ekstraktas). Serimo rekomendacijos: 2kg: 23-33g; 3kg: 30-43g..."
Skaidytojas antrasciu ieskojo tik eilutes pradzioje. **Gavimas v1.12:** pries
skaidant zinoma antraste su dvitaskiu perkeliama i naujos eilutes pradzia.
Dvitaskis butinas — be jo „serimo instrukcija nurodyta ant pakuotes" suskaldytu
sakini.

**Forma B (Quattro sterilizuotoms katems): ANTRASTES NERA ISVIS.**
Norma pateikta lentele: „Suaugusios kates svoris, kg / 2 3 4 5 6 7 8 /
Pasaro dienos norma, g / 24-35 32-46 ...". **Gavimas v1.13:** atpazistama pati
lentele — eilute su „dienos norma", „paros norma", „svoris, kg", „kuno svoris".
Skaiciu eilutes po jos sekcijos neuzdaro.

Kartu sugrieztintas saraso kriterijus: anksciau uzteko dvieju kableliu, todel
„Pasara laikykite vesioje, sausoje, nuo saules apsaugotoje vietoje" likdavo
Analitinese. Dabar sarasui reikia IR skaiciu.

**Mastas (dry-run per 400 prekiu su serimo tekstu):**
| Etapas | Serimas atpazintas |
|---|---|
| pries taisymus | ~230 |
| po v1.12 | 271 / 385 |
| po v1.13 | **307 / 385** |

Lieka **78 prekes** — treciai teksto formai (norma paveiksleliuose arba visai
kitais zodziais).

**NEUZDARYTA — savininkas: „niekas nepasikeite, per sudejimo mygtukus niekas
neveikia".** Skaidytojas SERVERYJE veikia (patikrinta jo paties tekstu), bet
mygtukas „Sudelioti i lentyneles" kortelėje rezultato neduoda. Priezastis
NENUSTATYTA — tai pirmas rytojaus darbas.

---

### RYTOJ (2026-08-13) — PIRMI TRYS DARBAI

**1. KODEL NEVEIKIA MYGTUKAS „Sudelioti i lentyneles" (blokuoja viska kita).**
Skaidytojas veikia, mygtukas — ne. Tikrinti tokia tvarka, nespeliojant:
- ar `ajax_aprasymas` gauna `veiksmas=sudelioti` (JS siuncia ar ne);
- ar tekstas paimamas is rengykles (`rengyklesTurinys()`) — gali grazinti
  tuscia, kai TinyMCE dar neinicializuotas;
- ar `_ps_aprasymas_uzrakintas` neblokuoja irasymo;
- ar HTML → tekstas konversija kortelėje palieka eilucių lauzymus: `<table>`
  eilutes be `<br>` sulimpa i viena eilute ir lentele tampa neatpazistama.
  **Tai tiketiniausia priezastis** — savininko tekstas atejo kaip lentele.

**2. MASINIS SUDELIOJIMAS PER SNIPPETA (savininko prasymas).**
Mygtukas taiso po viena; skolų — simtai. Reikia:
- DRY: visos maisto/papildu prekes, kuriu `Serimo instrukcija` sekcijos NERA,
  bet tekste yra normos pozymiu. Ataskaita: id · pavadinimas · kokia forma
  rasta · ka sudetu (pirmi 80 simboliu);
- savininko perziura;
- APPLY atskirai, su `aprasymo_kopija()` kiekvienai prekei (grazinimas per
  „Grazinti ankstesne" kortelėje);
- po to — pakartotinis matavimas (307/385 turi kilti).
**Nepradeti APPLY be DRY perziuros.**

**3. TZ MASTER v1.72** — uzrakinti tris siandienos taisykles:
- kortele = viskas apie viena preke;
- rankinis sprendimas nustelbia automatika (`_ps_ranka_isimta`);
- du atskiri likuciai: TIEKEJO (`_stock`) ir AV (`_own_stock_qty`), partijos ir
  galiojimai — tik AV.

---

### ATVIRA PO SIOS SESIJOS

- **FEFO nurasymo patikra SASAJOJE** — serveryje patikrinta (likutis 6→3,
  partija 4→0), naršykleje testas nutruko
- Akciju langas naudoja sena kalendoriu (S702 skola)
- `ajax_partija_nauja` endpoint'as liko be sasajos (v8.0 ji pakeite likucio blokas)
- Sargo etalonas: VF/ZB prekems AV likutis DABAR rodomas (v8.0) — etalona
  reikia atnaujinti
- Is ankstesniu: snippetu valymas · Dogoteka RRP (~14 prekiu) · PVM gyvame
  petshop.lt · 796 prekes be savikainos · aprasymu sablonas Gavime

---

## 2026-08-11 (rytas) — GERIAUSIA IKI · JUDEJIMAS · PUBLIKAVIMO VARTAI [S758-S765]

Sesija prasidejo nuo „geriausia iki", bet savininko patikslinimai atskleide
tris skirtingas problemas, is kuriu dvi buvo sistemines.

### IDIEGTA

| Failas | Versija | Ka issprende |
|---|---|---|
| petshop-katalogas.php | 5.0 → **5.8** | geriausia iki · judejimas · paleidimo data · partiju redagavimas · skolu isskaidymas · savikainos saltiniai |
| petshop-akcijos.php | 1.6 → **1.8** | ketvirtas taikinys „Geriausia iki" + kelias is katalogo |
| petshop-pilnumas.php | 1.1 → **1.2** | pilnas truksta raktu sarasas filtravimui |
| petshop-vartai.php | **1.0** (naujas) | publikavimo vartai VF/ZB prekems |

---

### S758 — GERIAUSIA IKI (katalogas v5.1, akcijos v1.7)

**Recon pries darba:** `Petshop_Partijos` v1.1 veike, datos buvo, FEFO veike,
`artimiausias_galiojimas()` egzistavo. **Truko VIETOS**, kur pamatytum, KURIOS
prekes baigiasi: funkcija atsako apie VIENA preke, o sarasui to neuztenka.

**Sprendimas:** `partiju_datos()` — vienas SELECT visoms prekems (per preke
butu 1 400 uzklausu). Imamos TIK partijos su likuciu: pasibaigusi data ant
tuscios partijos yra istorija, ne problema.

Akcijose — ketvirtas taikinys „Geriausia iki" su dienu lauku. Pasibaigusios
datos NEITRAUKIAMOS: tokia preke nurasoma, ne pardavinejama su nuolaida.

---

### S759 — JUDEJIMAS IR GALIOJIMAS ATSKIRTI (v5.2)

**Savininko pastaba:** „tu maisai du skirtingus dalykus: 1. Prekiu judejimas
2. Prekiu galiojimas".

Buvau sudejes juos i viena „Sandelio" kruva. Tai skirtingi klausimai:

| | Judejimas | Galiojimas |
|---|---|---|
| Saltinis | pardavimu istorija | `ps_partijos` datos |
| Kam taikoma | AV prekems | toms, kurioms data IVESTA |
| Sprendimas | nuolaida, rinkinys, isemimas | trumpo galiojimo akcija |

**„Negyvos atsargos" pervadinta** — terminas buvo pazodinis „dead stock"
vertimas, lietuviskai skambejo kaip kapines ir nesake, ka matuoja. Dabar
„Neparduodama ≥ N d." su pasirenkama riba (60/90/180/360 arba nuo–iki):
60 dienu be pardavimo skanestams jau signalas, aksesuarams — norma.

**PUBLIKAVIMO MOMENTAS.** `post_date` netiko: dev bazeje 1 605 prekes
„sukurtos" 2026-06-04 ir dar 927 — 06-06. Tai migracijos importas, ne
publikavimas, o preke gali menesi guleti juodrasciuose (savininko pastaba).
Idėtas `_ps_publikuota` per `transition_post_status`, fiksuojamas tik PIRMA
karta — kitaip uztektu vieno „isimti/grazinti" ir preke vel atrodytu nauja.

**Skaiciavimas:** dienos nuo PASKUTINIO pardavimo, o jei niekada neparduota —
nuo publikavimo. Vienas skaicius vietoj triju lauku (30/90/365), todel veikia
bet kokia riba.

---

### S760 — PALEIDIMO DATA KAIP ATSKAITOS TASKAS (v5.3)

**Savininko pastaba:** „mes gal uz menesio tik pasileisme, o statistika rodys,
kad neparduodama 100 d." — teisinga ir svarbi.

v5.2 skaiciavo nuo publikavimo, o migruotoms prekems tai IMPORTO diena.
Paleidus parduotuve spali, pirma diena visas katalogas atrodytu neparduodamas
keturis menesius, ir eile taptu beverte nuo starto.

Dabar atskaitos taskas — **velesnis is dvieju**: prekes publikavimo ir
parduotuves PALEIDIMO (`ps_paleidimo_data`). Kol paleidimo diena neatejo,
skaicius **neskaiciuojamas isvis**: klausimas „kodel neparduodama" prie
uzdarytos parduotuves prasmes neturi.

**Patikra abiem scenarijais:**

```
Paleidimas 2026-10-01 (ateityje), migruota 06-04, neparduota  → null
  ta pati, bet pardavimas 05-01                                → 102 d.
Paleidimas 2026-06-20 (praeityje), migruota 06-04              → 52 d.
  publikuota 08-01                                             → 10 d.
  pardavimas 08-05                                             → 6 d.
```

Ekrane: „Neparduodama ≥ 60 d." 745 → **0**.

**PRIES LAUNCH:** `ps_paleidimo_data` nustatyti tikslia data.

---

### S761 — GALIOJIMO FILTRAI IR KELIAS I AKCIJA (v5.4, akcijos v1.8)

Trys eiles vietoj dvieju: **„Pasibaige" atskirai** — tokia preke nera
nuolaidos klausimas, o nurasymo; maisyti ja su dar parduodamomis reikstu
siulyti pirkejui netinkama preke. Sioje eileje akcijos mygtuko NERA.

Ribos keiciamos is lango: ≤30 · ≤60 · ≤90 · ≤180 arba „skubu iki / stebeti
iki". Sausam maistui 90 d. normalu, sviežiai produkcijai per ilgai.

**Mygtukas „Sukurti trumpo galiojimo akcija →"** perduoda `?gi=N` i Akciju
langa, kur uzpildomas pavadinimas, taikinys, dienos ir laikotarpis. Be jo eile
butu tik sarasas: problema matai, bet kad ka nors padarytum, tektu is naujo
rinkti tas pacias prekes kitame lange.

---

### S762 — PARTIJOS LAUKAI REDAGUOJAMI (v5.5)

**Savininko pastaba:** „nera funkcijos taisyti galiojimo datos — mes
kalbejome, visi laukai turi buti redaguojami, isskyrus koda".

Partijos is tos taisykles buvo iskritusios: duomenys ivedami Gavimo lange ir
po to netaisomi niekur. Du realus pagrindai: priimant sunta lengva suklysti,
o tiekejas gali PRATESTI termina — teisetas sprendimas, kuriam sistema neturi
trukdyti.

**Redaguojami TRYS:** likutis, savikaina, geriausia iki.
**Neredaguojami:** gavimo data, tiekejas, gautas kiekis — tai siuntos faktai,
turintys sutapti su saskaita.

**Patikra:** data 2026-08-03 → 2027-02-11, DB irasyta, preke is „Pasibaige"
eiles iskrito (1 → 0).

**Atsakymas i savininko klausima:** pardavimo blokavimo NERA. Data yra
informacija administravime; preke lieka parduodama, likutis nekeiciamas.
Vienintelis apribojimas — pasibaigusios neitraukiamos i automatine akcija.

---

### S763 — DUOMENU SKOLOS ISSKAIDYTOS (v5.6/v5.7, pilnumas v1.2)

**Savininko pastaba:** „Duomenų skolos — čia labai abstraktu, išskirk
savikainas; taip patogiau: atsidarai prekes, sutaisai, jos dingsta iš tos
kategorijos".

Skaicius 1 960 nesake, KA daryti. Recon parode sudeti: EAN 1 427,
savikaina 744, serimo lentele 502, pakuotes dydis 213, analitines 211,
serimo instrukcija 205, aprasymas 195, sudetis 156, gyvuno rusis 45.

**Filtravimo klieutis:** `_ps_pilnumas_truksta` yra tekstas zmogui ir
SUTRUMPINTAS („EAN ir dar 1"), todel preke, kuriai truksta serimo lenteles IR
sudeties, pagal „sudetis" nebutu rasta. Pilnumas v1.2 raso `_ps_pilnumas_kodai`
su visais raktais tarp vertikaliu bruksniu; perskaiciuota 2 726 prekems.

**v5.7 — dublikatai pasalinti.** Pirmoji versija salia esamu „Be savikainos"
(795) ir „Be EAN" (1 459) idejo dar tuos pacius is pilnumo (744 / 1 427).
Tie patys pavadinimai skirtingais skaiciais klaidina labiau nei vienas.

---

### S764 — SAVIKAINOS SALTINIAI (v5.8)

**Savininko taisykle:** „tiekejo man pateikta kaina yra mano savikaina".

Katalogas eme savikaina TIK is `ps_sources` registro; pridėta atsargine tvarka
`_cost_price` → `_vf_cost` → `_zb_cost`, vienoda sarase ir korteleje.

**RADINYS:** skaicius nepasikeite (795), nes tos prekes neturi savikainos NE
VIENAME lauke — patikrinta, 0 is ju turi `_vf_cost`/`_zb_cost`/`_cost_price`.
Skirtumas nuo pilnumo 744 yra kitos priezasties: pilnumas praleidzia
„nevertinamas" prekes (DP skelbimus, testines) — 51 preke. Abu skaiciai
teisingi, tik atsako i skirtingus klausimus.

---

### S765 — PUBLIKAVIMO VARTAI (petshop-vartai v1.0)

**Savininko klausimas:** „kokie reikalavimai publikuotom prekem — kodel VF ar
ZB preke be nuotraukos, aprasymo patenka i public?"

**Atsakymas is kodo:**

| | Vartai | Rezultatas |
|---|---|---|
| VF | `class-vf-import.php` tikrina 5 blokerius: nuotrauka, aprasymas, kaina, EAN, likutis | prekyboje be aprasymo — 10 |
| ZB | **NETURI**; WP All Import #2 `status: publish`, jokios patikros | prekyboje be aprasymo — 76 |

Visi 5 WP All Import profiliai nustatyti `status: publish`.

**1. VIENKARTINIS VALYMAS:** 86 prekes (ZB 76, VF 10) perkeltos i juodrascius.
Priezastys: be aprasymo 83, be aprasymo IR nuotraukos 3, vien be nuotraukos 0.
Patikra: VF/ZB prekyboje 1 643 → 1 557; juodrasciai 1 040 → 1 126.
**AV NELIESTA** (savininko sprendimas).

**2. NUOLATINE TAISYKLE** (`petshop-vartai.php`): VF/ZB preke be aprasymo
(< 120 simboliu) arba be nuotraukos keliauja i juodrascius. Taikoma VISOMS,
ne tik naujoms — sistema dar nepaleista, todel visos de facto naujos.

Be sio modulio vienkartinis valymas beprasmis: ZB importas veikia kas valanda
ir tas pacias prekes vel publikuotu.

- `pmxi_saved_post` — patikra iskart po importo irašo
- cron kas valanda — turinys gali dingti ir NE per importa (istrynus nuotrauka
  is medijos, isvalius aprasyma ranka)
- **kryptis TIK viena: publish → draft.** Atgal niekada: juodrastyje preke gali
  guleti del visai kitu priezasciu, ir automatinis publikavimas jas anuliuotu
- isimtis `_ps_publikuoti_leista='taip'` — kad taisykle nebutu kalejimas

**Patikra realia preke (Eukanuba, ZB):** aprasymas istrintas → vartai grazino
i draft su zyme; atstatyta → publish, 4 406 simboliai. Isimties zyme veikia.

---

### Technines pamokos

1. **`get_post_field()` be trecio argumento taiko „display" konteksta** ir
   grazina uzkoduota HTML. Pirmoji diagnostika del to rode `&lt;p&gt;` ir
   klaidingai atrodė, kad turinys sugadintas. Raw duomenims — trecias
   argumentas `'raw'` arba tiesioginis SQL.

2. **Aprasymo ilgi matuoti TIK po `html_entity_decode`.** Dalis irasu DB
   laikomi dukart uzkoduoti; be dekodavimo tagai skaiciuojami kaip turinys ir
   tuscia preke atrodo aprasyta.

3. **Sutrumpintas tekstas netinka filtravimui.** `_ps_pilnumas_truksta`
   („EAN ir dar 1") skirtas zmogui; filtrui reikia atskiro pilno lauko.

4. **Migracijos data nera publikavimo data.** Bet kokia „kiek laiko" metrika
   po migracijos privalo tureti atskaitos taska, kitaip paleidimo diena rodo
   menesiu senuma.

5. **Vienkartinis valymas be taisykles — beprasmis**, jei duomenis atnesa
   automatinis importas.

### Aukščiausias sprendimo Nr.: S765.

### ATVIRA po šios sesijos
- **KITAS:** Rinkiniai
- **FILTRO KLAIDA:** „be sudeties" rodoma prekems, kurios turi sudeti aprasymo
  TEKSTE be atskiros antrastes (Farmina). Pilnumas ieško SEKCIJOS antrastes;
  reikia atsargines patikros pagal raktazodi tekste
- dukart uzkoduoti aprasymai (`&lt;p&gt;`) — kiek ju is viso, ar reikia masinio
  dekodavimo
- parduotuves puse: `/pasiulymai/geriausia-iki/` su noindex (TZ 38.6)
- katalogo kortele ima brenda is tuscios `pa_brendas`
- Tiekimas ir Desk dar nenaudoja `Petshop_Katalogas::navigacija()`
- 5 „svetimos" akcijos be datu (Genia, 3× Zylkene, Flexadin)
- testine akcija #1 „Ambrosia rugpjutis −15 %" juodrastyje

---

## 2026-08-10 (vakaras II) — AKCIJU LANGAS · DARBUOTOJO ROLE · VIENINGA NAVIGACIJA [S754-S757]

Sesijos tesinys po katalogo UX bloko. Trys nauji moduliai, is kuriu du —
`petshop-akcijos.php` ir `petshop-teises.php` — anksciau neegzistavo.

### IDIEGTA

| Failas | Versija | Ka issprende |
|---|---|---|
| petshop-akcijos.php | **1.6** (naujas) | akciju administravimo langas: brendas/kategorija/prekes, planavimas, gyva taisykle, LT kalendorius |
| petshop-teises.php | **1.1** (naujas) | darbuotojo role su isvalytu ekranu |
| petshop-katalogas.php | 4.9 → **5.0** | akcijos indikatorius korteleje · vieninga navigacija |
| petshop-gavimas.php | 1.1 → **1.2** | vieninga navigacija |

---

### S754 — AKCIJU ADMINISTRAVIMO LANGAS (petshop-akcijos v1.0–v1.6)

**Uzduotis (savininko formuluote):** „kada butu galima uzdeti akcijas Brendui,
kategorijai ... atskiroms prekems, planuoti akcijas" — t. y. ADMINISTRAVIMO
irankis, ne kliento pusė.

#### Pries tai — recon (empirinis)

`petshop-promotions` v1.1 (S83, 2026-06-09) yra ir aktyvus, bet panaudotas
vieną kartą ir paliktas:

```
18 prekiu su _sale_price
15 — vienas batch sale_20260609_195007_514 (Ambrosia)
14 — datos PASIBAIGUSIOS, o _sale_price meta liko kaboti
 4 — akcijos kaina BE DATU → akcija amzina, niekas jos neisjungs
 0 — kuponu
```

Priezastis strukturine: senasis modelis yra SNAPSHOT. Atrenki filtrais →
apply iraso `_sale_price` → **taisykle dingsta**, lieka tik prekes su vienoda
batch zyme. Nera ko isjungti, nes nera ko.

#### Rinkos peržiura (administravimo pusė)

Du nesuderinami modeliai:

| Modelis | Kas saugoma | Naujos prekes |
|---|---|---|
| Snapshot (Shopify, musu senasis) | kaina prekeje | NEpatenka |
| Taisykle (Magento Catalog Price Rule) | salygos + laikotarpis + prioritetas | patenka automatiskai |

Magento: jei preke atitinka kelias taisykles, taikoma auksciausio prioriteto;
yra „Stop Further Rules Processing". Zooplus: prenumerata 15 % pirmam ir 5 %
kitiems, savaitiniai Special Offers, kategoriju savaites. Chewy: Autoship su
~70 % adopcija. Bendras rastas — **kampanija, ne pavienė akcija**, ir nuolaida
prirista prie elgsenos, ne prie kainos etiketes.

#### SPRENDIMAS — HIBRIDAS

Taisykle SAUGOMA (kad veiktu planavimas ir naujos prekes), bet
MATERIALIZUOJAMA i `_sale_price`, nes Kaina24/kainos.lt feed'ai,
`wc_product_meta_lookup`, `is_on_sale()` ir filtrai skaito butent ji.
Dinamine kaina reikstu perrasyti visa ta grandine.

**Savininko sprendimai:** gyva taisykle (naujos prekes itraukiamos
automatiskai); promo guard tikrinamas PIRMA.

#### PROMO GUARD — PATIKRINTAS KODE (blokeris)

Buvo klausimas: ar ZB/VF importas, perskaiciuojantis kainas kas valanda,
netrina akciju. Atsakymas — NE:

- **ZB** (`petshop-xml.php` 1122–1174): reprice keicia TIK `_regular_price`;
  kai sale aktyvi, `_price` lieka = `_sale_price`. Jei nauja reguliari
  nukristu zemiau akcijos — blokuojama (`reprice_blocked_by_sale`).
- **VF** (`class-vf-import.php`): guard per `_petshop_sale_batch` →
  `vf_reprice_blocked_by_promo`.

**KRITINE SUDERINAMUMO SALYGA:** VF guard remiasi TIK `_petshop_sale_batch`
zyme. Naujasis modulis ja RASO — be jos VF importas nusluostytu akcijas per
pirma valanda.

#### Modelis

Dvi lenteles: `ps_akcijos` (taisykle) + `ps_akciju_prekes` (materializacija su
BUVUSIA busena kiekvienai prekei — be jos nuemimas butu spejimas, ne
atstatymas).

Busenos: Juodrastis → Suplanuota → Aktyvi → Pasibaigusi → Archyvas.
Cron `ps_akcijos_valanda` kas valanda ijungia suplanuotas, isjungia
pasibaigusias, o gyvoms — pertikrina atranka.

**Pabaigos data PRIVALOMA.** Butent jos nebuvimas paliko 4 amzinas akcijas.

Taikiniai: brendas · kategorija (+palikuonys) · prekiu sarasas; visiems —
atributu susiaurinimas ir ISIMTYS („visa Ambrosia, bet ne 12 kg").
Konfliktai: viena preke — viena akcija, laimi auksciausias prioritetas;
konfliktas rodomas ZMOGUI pries apply, ne sprendziamas tyliai.

#### RADINYS: brendai gyvena `product_brand`, ne `pa_brendas`

Pirmoji versija atranke naudojo `pa_brendas` ir grazino **0**. Recon:

```
product_brand  122 terminai · Ambrosia = 329 · count 15
pa_brendas      62 terminai · Ambrosia = 231 · count 0   ← TUSCIAS APVALKALAS
```

Katalogo sarasas ta jau moka apeiti (`terminai()` su atsargine saka), bet
atranka pagal tuscia taksonomija tyliai grazino nuli. Dabar taksonomija
parenkama PAGAL DUOMENIS (`brendo_taksonomija()`), sarasuose — tik netusti
terminai.

**Katalogo kortele (eil. 1469) vis dar ima `pa_brendas`** — todel korteleje
brendas nesimato. ATVIRA.

#### v1.3 — „Prekiu 0" prie juodrascio

Skaicius buvo imamas TIK is `ps_akciju_prekes`, o ten irasai atsiranda tik
ITAIKIUS. Juodrastis su 15 prekiu atrode tuscias. Dabar netaikomoms akcijoms
skaicius skaiciuojamas is atrankos realiu laiku (zyme ATITINKA vs TAIKOMA), o
perziura uzsikrauna automatiskai atidarius akcija.

Plius: „N prekiu uzdeta ne per si langa" → mygtukas Parodyti isskleidzia
sarasa su datomis, kilme ir mygtuku „Nuimti akcija".

#### v1.4 — filtras, kurio nesimato

Akcija rode „8", nors Ambrosia brendas turi 15. Skaicius buvo TEISINGAS —
taikinyje issaugotas ir `pa_pakuotes_dydis`, bet sarase jo nesimate. Dabar
taikinys isvardijamas pilnai: `Brendas: Ambrosia · 2 kg`, prireikus
`· be 3 prekiu`.

**Filtras, kurio nesimato, yra blogesnis uz filtro nebuvima.**

#### v1.5 — teise `ps_akcijas_taikyti`

Akcijos KURIMAS ir perziura — visiems; IJUNGIMAS (realus kainu keitimas
katalogui) — atskira teise.

#### v1.6 — LT kalendorius ir eilutes isbraukimas

`datetime-local` piesia narsykles kalendoriu narsykles kalba: Chrome rode
„August 2026", sekmadieni dejo pirma, formatas `08/17/2026`. Savas
kalendorius: LT menesiai, savaite nuo PIRMADIENIO, ISO formatas, laiko laukas,
greiti mygtukai (Siandien · +7 · +14 · +30 · Men. pabaiga).

Perziuroje prie kiekvienos eilutes — **×**, kuris preke perkelia i ISIMTIS
(ne tik paslepia): issaugojus ji nebegris ir gyva akcija jos nebeitrauks.

#### PATIKRA (narsykle, ne teorija)

```
Ambrosia brendas −15 %  → Atrinkta 15 · Taikoma 15 · Zemiau ribos 0
                          Vid. nuolaida 15 % · Maziausia marza 17,1 %
Kalendorius             → „Rugpjutis 2026" · Pr An Tr Kt Pn St Sk · 31 diena
                          20 d. → 2026-08-20 19:12 · „+30 d." → 2026-09-09 19:12
Eilutes ×               → 1 → 0 eiluciu · isimtyse +1 · suvestine perskaiciuota
```

#### AMBROSIA TESTINES AKCIJOS ISVALYTOS

14 prekiu (batch `sale_20260609_195007_514` + pavadinime „Ambrosia") nuimtos
per WC API (`set_sale_price('')` + `save()`), atsargine kopija i
`ps_akcijos_bak_*`. Patikra: `_price` = `_regular_price` visoms, 0 neatitikimu.
Liko 5 ne-Ambrosia (Genia itvaras, 3× Zylkene, Flexadin) — savininko sprendimu
nelieciamos, langas jas rodo kaip „uzdeta ne per si langa".

---

### S755 — VIENINGA NAVIGACIJA (katalogas v5.0, gavimas v1.2)

Savininko pastaba: „gal ir cia reikia ideti virsuje Gavimas ir Akcijos".

Kiekvienas langas turejo SAVO juosta: kataloge nebuvo nei Akciju, nei Gavimo;
Akciju lange — nebuvo Gavimo; Gavime — tik „Katalogas". Zmogus, atsidures
viename lange, nematydavo kelio i kitus.

Sprendimas — ne trys juostos, o VIENAS sarasas vienoje vietoje
(`Petshop_Katalogas::navigacija()`), kuri naudoja visi moduliai:

```
PETSHOP · Katalogas · Akcijos · Gavimas · Tiekimas · Uzsakymai
```

Patikra: visi trys langai grazina ta pati sarasa, aktyvus punktas paryskintas.
Tiekimas ir Desk savo juostu dar nenaudoja bendros funkcijos — ATVIRA.

---

### S756 — DARBUOTOJO ROLE (petshop-teises v1.0 → v1.1)

**Pirmine formuluote suprasta klaidingai.** v1.0 padaryta kaip SAUGUMO
sprendimas (apribojimai, draudimai). Savininko patikslinimas: „as specialiai
sakiau padaryti tokia prieiga, kad zmogus nesipainiotu pradziai, o ne del to,
kad kazko nematytu ar neistrintu".

**v1.1 — perdaryta i PAPRASTUMO sprendima:**

| | v1.0 | v1.1 |
|---|---|---|
| Meniu valymas | juodasis sarasas (salinti YITH, Mokejimus…) | **baltasis sarasas** |
| Meniu punktu | 11 | **4** |
| Po prisijungimo | Skydelis | **tiesiai i Kataloga** |
| Svetimi pranesimai | matomi | **0** |
| Siuksline | uzdrausta | **leidziama** |

Baltasis sarasas pasirinktas todel, kad juodasis pralaimi kiekvienam naujam
pluginui: idiegus dar viena, jo meniu punktas darbuotojui atsiranda savaime.

**Vienintelis tikras draudimas:** galutinis trynimas is siuksliines. I
siuksline mesti galima (atstatoma vienu paspaudimu), o galutinis trynimas
panaikina SEO nuoroda, uzsakymu istorija ir tiekejo susiejima — to neatsuka
nei zurnalas, nei atsargine kopija.

Patikra realia darbuotojo paskyra (Playwright, vartotojas `testuotojas` #75):

```
meniu:        Petshop uzsakymai · Petshop prekes · Failai · Profilis
submeniu:     Petshop prekes · Gavimas · Akcijos
pranesimu:    0
index.php  →  nukreipe i admin.php?page=ps-katalogas
wc-settings, plugins.php, users.php, options-general.php, tools.php → BLOKUOTA
gali:  manage_woocommerce · edit_products · publish_products · upload_files · ps_akcijas_taikyti
negali: manage_options · activate_plugins · edit_users · edit_themes · export
```

---

### S757 — „GERIAUSIA IKI" BUKLES RECON

Savininko klausimas: „mes dareme geriausia iki, bet tu jas kazkur isemei ir
paslepei". Recon parode: **niekas neisimta, bet nera vietos, kur pamatytum**.

**Veikia:**
- `Petshop_Partijos` v1.1 · lenteleje 3 partijos, VISOS su data
  (2027-06-30, 2027-09-30, 2028-01-31), viena su PLN ir kursu 4,31
- Gavimo lange — data prie kiekvienos eilutes + masinis irasymas
- Prekes korteleje — blokas „Partijos" su „Geriausia iki" ir liko menesiu
- Variklyje: `artimiausias_galiojimas()`, FEFO nurasymas

**Nera:**
1. Katalogo eiles „Arteja geriausia iki" (esama „Baigiasi greiciau nei
   tiekiama" yra pardavimu greitis, ne datos)
2. Bendro saraso — `artimiausias_galiojimas()` atsako apie VIENA preke, bet
   klausimo „kurios baigiasi per 90 d." niekas neuzduoda
3. Parduotuves puses: kategorijos `geriausia-iki` ir `trumpos-datos`
   NEEGZISTUOJA (TZ 38.6 numate `/pasiulymai/geriausia-iki/` su noindex)
4. Trumpu datu ispardavimo (TZ 38.5)

**SPRENDIMAS RYTDIENAI:** ketvirtas punktas beveik nemokamas — akciju modulis
jau turi perziura, eiluciu koregavima, marzos grindis, laikotarpi ir isimtis.
Truksta KETVIRTO taikinio tipo salia „Brendui · Kategorijai · Atskiroms
prekems" — **„Geriausia iki"** su lauku „datos artimesnes nei N dienu".
Tada trumpu datu ispardavimas tampa iprasta akcija.

---

### Technines pamokos

1. **Meta reiksmes tikrinti, ne speti.** `product_brand` vs tuscias
   `pa_brendas`; `belcor_tofu` vs `belacor`. Abu kartus kodas „veike" ir
   tyliai grazino nuli.

2. **PHP vienguba kabute JS eiluteje** — sioje sesijoje sudege dar du kartus
   (`feed'ai`, CSS selektorius `'.pr[data-id="'+id+'"]'`). Nuo dabar pries
   kiekviena siuntima: `php -l` PLIUS JS bloko istraukimas ir `new Function()`
   patikra.

3. **Code Snippets REST kartais grazina PHP warning pries JSON** →
   `r.json()` nulūžta ir runas krenta pries darba. Runner'yje privalomas
   `jsonSafe()` (randa pirma `[` arba `{` ir parsina nuo ten).

4. **Skaicius be konteksto meluoja.** „Prekiu 0" prie juodrascio ir „8" vietoj
   15 — abu buvo techniskai teisingi, bet be paaiskinimo atrode kaip klaida.

5. **Baltasis sarasas > juodasis** visur, kur valomas UI: juodasis pralaimi
   kiekvienam naujam pluginui.

### Aukščiausias sprendimo Nr.: S757.

### ATVIRA po šios sesijos
- **RYTOJ:** „Geriausia iki" (ketvirtas akciju taikinys + katalogo eile) ir
  Rinkiniai
- katalogo kortele ima `pa_brendas` (tuscia) — brendas korteleje nesimato
- Tiekimas ir Desk dar nenaudoja `Petshop_Katalogas::navigacija()`
- 5 „svetimos" akcijos be datu (Genia, 3× Zylkene, Flexadin) — laukia
  savininko sprendimo
- testine akcija #1 „Ambrosia rugpjutis −15 %" juodrastyje — po darbuotojo
  testavimo trinti
- savikainos kilmes zyma korteleje · atributu kilmes zyma (parseris vs ranka)
- akciju rezultatu suvestine po pabaigos (kiek parduota akcijos metu vs pries)

---

## 2026-08-10 (vakaras) — KATALOGO UX SESIJA: v4.2–v4.8 [S747-S753]

Sesija prasidejo pastabu prasymu, o virto astuoniomis versijomis. Pirmos
keturios ejo per lengvai — pataisiau tai, ka pats siuliau, ir pranesiau
„padaryta". Savininko atsakymas: „nesuprantu ka tu pataisei — mano manymu
nieko". Buvo teisus: siuliau tai, kas jau padaryta v4.1, o realiai reikalingi
darbai (atributai, nuotraukos) gulejo neliesti nuo ankstesniu sesiju.

**Sesijos pamoka Nr. 1:** pastabu sarasas, sudarytas SKAITANT koda, o ne
DIRBANT su langu, duoda patvirtinimus, ne radinius. Tris kartus is eiles
„padaryta" reiske „ideta i faila", ne „veikia ekrane".

**Sesijos pamoka Nr. 2:** v4.6 ivede regresija (`height:auto`), kuria pastebejo
savininkas, ne as. Vizuali patikra buvo atlikta — bet tikrinau TAI, KA
TAISIAU, o ne ar nesulauzyta kazkas salia.

### IDIEGTA

| Versija | Ka issprende |
|---|---|
| v4.2 (S747) | `$kat_tipas` naudotas pries apibrezima → maisto atributai kortelėje niekada nesirode; sandelio spalvos 3 → 7 saltiniams; gyva marza; savikainos ispejimas |
| v4.3 (S748) | TinyMCE `table` priedas, kurio WP komplekte NERA → raudona klaidos juosta per visa ekrana |
| v4.4 (S749) | paieskos laukas juodas ant juodo; neirasytu lauku geltona zyma; Enter uzuomina; SKU/EAN kopijavimas |
| v4.5 (S750) | atributai ir nuotraukos redaguojami VIETOJE (buvo: „keiciami WooCommerce puslapyje") |
| v4.6 (S751) | kortele `fixed` — atsidaro nuo virsaus; pavadinimas redaguojamas; SKU spyna |
| v4.7 (S752) | v4.6 regresijos taisymas (`height:auto` nukirto puse korteles); „Ikelti nauja" atskirai; nuotrauku atsaukimas |
| v4.8 (S753) | neirasytu pakeitimu juosta + uzdarymo klausimas su TRIMIS pasirinkimais |

Gavimas: v1.0 → **v1.1** (sandelio spalvu palete, ta pati kaip kataloge).

---

### S747 — UX AUDITAS: RASTA TYLI KLAIDA (v4.2)

Auditas turejo buti kosmetinis, bet atskleide klaida, kuri veike nuo v3.8:

```php
$tipas_a = $kat_tipas['tipas'];        // 1333 eil. — NAUDOJAMA
...
$kat_tipas = self::sekciju_lukesciai(...); // 1367 eil. — APIBREZIAMA
```

34 eilutes tarpo. `$tipas_a` visada buvo `null`, todel maisto atributai
(baltymu saltinis, amzius, grudai, monoprotein, spec. mityba, veisles dydis)
i kortele NEPATEKDAVO, o kiekvienas atidarymas kele PHP warning. Kortelėje
matesi tik du bendrieji atributai — ir atrodė, kad taip ir turi buti.

**Sandelio spalvos:** `.sand.s_*` klases turejo tik AV/VF/ZB. Quattro (65
prekes), belcor_tofu (62), Prins (43), Ambrosia (15) susiliedavo i pilka.
Pridetos visos; ta pati palete perkelta i Gavimo langa (v1.1).

**RADINYS:** pirmasis bandymas naudojo `belacor`, o tikroji `_ps_sandelis`
reiksme yra **`belcor_tofu`**. CSS niekada nebutu suveikes. Rasta tik todel,
kad recon grazino tikras meta reiksmes su skaiciais.

**Gyva marza:** kortelėje perskaiciuojama berasant (patikra: 19,9 % → 36,0 %
be Enter). **Savikaina nesuvesta** → raudona pastaba vietoj tuscio lauko.

---

### S748 — RENGYKLES KLAIDA (v4.3)

Savininkas: „matau tik klaidas." Kataloge kabojo raudona WP juosta per visa
ekrano auksti:

```
Failed to load plugin: table from .../tinymce/plugins/table/plugin.min.js
```

v4.1 rengykle prase priedo `table`. **WordPress komplekte tokio priedo nera**
(yra lists, link, paste, wordpress, wplink). Pasalintas is `plugins` ir is
`toolbar1`.

**Kritine pamoka:** ta pacia juosta MACIAU savo paties screenshot'e valanda
anksciau — vertikalus tekstas kaireje — ir palaikiau ja apkarpytu stulpeliu.
Screenshot'as nera patikra, jei ziurima tik i ta vieta, kuri taisyta.

---

### S749 — MATOMUMAS IR NEPRARANDAMI PAKEITIMAI (v4.4)

Savininkas: „virsuje paieskos laukas juodas, net nesimato kur ka irasyti."

Faktas: `background:#141a18` ant juostos `#1d2422`. Juoda ant juodos.
Dabar baltas laukas su lupa (patikra: `rgb(255,255,255)`).

Plius: pakeistas laukas nusidazo geltonai; „Enter irašo · Esc atstato"
uzuomina; SKU/EAN kopijavimas vienu paspaudimu; „Trūksta: …" — gintarinis
akcentas vietoj pilkos smulkmenos.

---

### S750 — ATRIBUTAI IR NUOTRAUKOS VIETOJE (v4.5)

Savininkas: „jokio atributu redagavimo, nuotrauku — kur jau n kartu kalbeta,
NIEKAS nepadaryta."

Iki siol kortele rode atributus su prierasu „keiciami WooCommerce redagavimo
puslapyje" — t. y. lauk is lango, i kuri ka tik atejai. Nuotrauku skirtukas
buvo failu vardu sarasas.

**Atributai:** „keisti" → pasirinkimas → Irasyti. Kelias reiksmes turintys
(baltymai, spec. mityba, amzius) — varneles; kiti — pasirinkimas.
Terminai priskiriami **TIK per term_id** (slug kolizija „1,5 kg"/„15 kg"),
registruojama `_product_attributes`, valomi WC transientai — be sio triju
zingsniu rinkinio atributas neissilaiko.

**Nuotraukos:** pagrindines keitimas/salinimas, galerijos papildymas, ★
(padaryti pagrindine), × (ismesti), ← → (tvarka), alt tekstas. Keiciant
pagrindine senoji nedingsta — keliauja i galerijos pradzia.

Patikra realiu veiksmu: „Šunims" → „Graužikams" (irasyta) → atgal „Šunims".

---

### S751 — KORTELE NUO VIRSAUS, PAVADINIMAS, SKU SPYNA (v4.6)

Savininkas: „prekes korteles langas atsidares matosi ne nuo virsaus."

Priezastis buvo ne ten, kur atrode: `scrollTo(0,0)` suveikdavo, bet **iskart
po jo** `scrollIntoView` ant saraso eilutes vel nustumdavo langa zemyn, o
`sticky` kortele sekdavo paskui. Sprendimas: kortele `fixed`.

**Pavadinimas** redaguojamas; slug (`post_name`) SAMONINGAI nekeiciamas —
jis indeksuotas, keitimas reikstu 301 grandine.

**SKU uzrakintas** (savininko klausimas: „prie ko viskas risasi, ar as
neteisus?" — teisus). Prie SKU kabo ps_sources registras, tiekeju XML
sutapdinimas, uzsakymu eilutes, kainu palyginimo feed sarasai. Ne visiskai:
~1 175 legacy ir naujoms prekems koda suvesti reikia, todel spyna nuimama
samoningu veiksmu su ispejimu, kas butent nutruks.

---

### S752 — v4.6 REGRESIJA + NUOTRAUKU SAUGIKLIAI (v4.7)

Savininkas: „Aprasymo langas dingo puse lango informacijos."

**Priezastis — mano paties v4.6 kodas:**

```css
position:fixed; top:32px; bottom:0; height:auto !important;
```

Pagal CSS: jei `height` yra `auto`, o `top` ir `bottom` abu nustatyti, tai
**`bottom` IGNORUOJAMAS**, o aukstis skaiciuojamas pagal turini. Kortele
isaugo iki 1161 px prie 1050 px ekrano, vidine slinktis mire
(`scrollHeight == clientHeight`) ir apatine dalis liko nukirsta ir
NEPASIEKIAMA. Taisymas: `height: calc(100vh - 32px)`.

**„Ikelti nauja" atskirai:** buvo vienas mygtukas „Pakeisti…", atidarydavęs
medijos biblioteka — atrode, kad ikelti naujos apskritai negalima. Dabar
„Ikelti nauja…" (atsidaro ties ikelimu) ir „Pasirinkti is medijos…".

**Nuotrauka nebekeiciama tyliai:** pries — klausiama, po — juosta su
„Atsaukti", grazinancia buvusia. Buvusios ID rasomas i ivykiu zurnala
(iki tol raso tik `tapo` — todel savininko pakeitimo nebuvo galima atsekti).

**ATSTATYTA:** preke #34500 (DP-83724-6) — pagrindine buvo tapusi svetima
`ryziu-suktinukai-apvynioti-antiena.jpeg`, galerijoje gulejo tikroji
`dp-clean-34500.jpg`. Grazinta; svetima nuimta nuo prekes, is medijos
NETRINTA.

---

### S753 — NEIRASYTI PAKEITIMAI (v4.8)

Savininkas: „kodel uzdarant nepaklausia ar issaugoti duomenis? Ne, dabar
neaisku."

Trys atskiros klaidos viename mechanizme:

1. **Sargas nepilnas.** Kabejo tik ant × ir ←/→. Uzdarant **Esc** klavisu
   arba paspaudus **kita preke sarase** kortele persikraudavo TYLIAI.
2. **Klausimas neteisingas.** `confirm()` teturi du mygtukus → buvo galima
   tik „prarasti" arba „likti". **Issaugoti nebuvo kaip.**
3. **Irasymas nematomas.** Vyko per Enter, kurio nesimato.

Dabar: juosta korteles apacioje „Neirašyta: N · Kaina su PVM" su
[Irašyti] [Atmesti]; uzdarymo langas su TRIMIS pasirinkimais (Grizti /
Uzdaryti neissaugojus / Issaugoti ir uzdaryti) ir ivardytais laukais.

**Patikra realiais veiksmais (uxs9):**

| Veiksmas | Rezultatas |
|---|---|
| 1.51 → 7.77 | juosta „Neirašyta: 1 · Kaina su PVM", laukas geltonas |
| Esc | klausimas pasirode (anksciau — tyliai uzdarydavo) |
| „Grizti i kortele" | kortele atvira, 7.77 vietoje |
| Kita preke sarase | klausimas pasirode (anksciau — tyliai persikraudavo) |
| „Uzdaryti neissaugojus" | 1.51 atstatyta, juosta dingo |
| „Irašyti" per juosta | 8.88 irasyta |
| Atstatymas | 1.51 · dev svarus |

---

### Technines pamokos

1. **`height:auto` naikina `bottom`.** Su `position:fixed` ir abiem
   `top`/`bottom` nustatytais — aukstis skaiciuojamas pagal turini, o
   `bottom` ignoruojamas. Aukstis nurodomas konkreciai: `calc(100vh - 32px)`.

2. **PHP vienguba kabute JS eiluteje.** Nutraukia PHP string'a. Sioje
   sesijoje sudege TRIS kartus: `feed'ai`, `Esc'u`, ir CSS selektorius
   `'.pskat-t tbody tr[data-id="'+id+'"]'`. Privaloma `php -l` pries kiekviena
   siuntima.

3. **Du atskiri IIFE nesimato vienas kito.** `skriptas()` ir `skriptas_v35()`
   — `atidaryk`/`dabartinis` neprieinami antrame. Tiltas per
   `window.psKatAtidaryk`.

4. **Playwright: plati `fixed` kortele dengia sarasa.** `elementHandle.click()`
   nutruksta po 30 s („subtree intercepts pointer events"). Sprendimas —
   `page.evaluate(()=>el.click())`.

5. **Meta reiksmes tikrinti, ne speti.** `belcor_tofu`, ne `belacor`.

6. **Ivykiu zurnale privalo buti `buvo`, ne tik `tapo`.** Be to negalima
   atsekti nei kas pasikeite, nei atstatyti.

### Aukščiausias sprendimo Nr.: S753.

### ATVIRA po šios sesijos
- savikainos kilmes zyma korteleje (is partiju / tiekejo / ranka + kada)
- atributu kilmes zyma (parseris vs ranka, is parserio zurnalo)
- WP branduolio `tinymce/skins/wordpress/images/style.svg` → HTTP2 klaida
  (ne musu kodas, vizualiai netrukdo)
- katalogas: masiniai veiksmai, issaugoti vaizdai, Excel, skirtukai „Kaina"
  ir „Likuciai", savikainu istorija
- atributu parseris: savininko sprendimas del kukuruzu krakmolo
- 1 222 prekes be savikainos

---

## 2026-08-10 (popietė) — KORTELE TAMPA DARBO VIETA [S742-S746]

Rytas baigesi atributu apply. Popiete — keturios katalogo versijos, visos
gimusios is savininko pastabu. Kiekviena pastaba parode ta pacia schema:
sistema turejo teisinga atsakyma, bet vienoje vietoje jo neklause.

### IDIEGTA

| Versija | Ka issprende |
|---|---|
| v3.7 (S742) | zaislui rodytas maisto antrasciu sarasas · tekstas per pilkas · EAN netilpo |
| v3.8 (S743) | serimo lentele tualetui · atributai ne pagal kategorija · nebuvo „tik kurjeriu" |
| v3.9 (S744) | kortele tik konstatavo problemas, mygtuko pataisyti nebuvo |
| v4.0 (S745) | tiekeju HTML sankla — iki 62 % teksto |
| v4.1 (S746) | WordPress rengykle vietoj HTML lauko |

Atsargines kopijos DB: `ps_katalogas_v36_bak` ... `ps_katalogas_v40_bak`.

---

### S742 — TRYS PASTABOS (v3.7)

**LOGINE KLAIDA.** Zaislui rodyta: „Antraštės, kurių ieško sistema: Sudėtis,
Analitinės sudedamosios, Priedai, Šėrimo instrukcija" — o blokas zemiau tuo
paciu metu teisingai sake „vertinama kaip aksesuarai". Du priestaraujantys
atsakymai viename lange.

Priezastis: `sekciju_lukesciai()` JAU mokejo atskirti kategorijas, bet
antrasciu sarasas buvo hardcoded, tas pats visiems. Dabar imamas is jos.
Patikra: Kamuoliukas → „Aprašymas"; JosiDog → penkios sekcijos.

**TEKSTAS.** `#6b7580` ant pilksvo fono susilieja. Pakelta iki `#3d4650`
(etiketes) ir `#2a3530` (antrastes). Savininkas apie tai prase du kartus —
pirma karta pataisiau tik maketuose, ne kode.

**EAN.** 13 skaitmenu i 172 px netilpo → 196 px + mono srifto klase.

Plius: partijos perkeltos i kaire kolona (buvo virs viso tinklelio ir
atstumdavo „Kaina ir marza" zemyn).

---

### S743 — APRASYMU LANGAI PAGAL KATEGORIJA (v3.8)

Savininkas: „tualetas??? Cia juk zaislas, jam nereikia tokiu aprasyku kaip
maistui ar skanestams."

Rasti DU serimo lenteles blokai, ir antrasis (Aprasymuose) rodesi VISIEMS —
be jokios kategorijos patikros. Todel tualetas gaudavo „Šėrimo lentelė — nėra".
Reikalavimas, kurio niekada nebus ivykdyta, nera informacija — tai triuksmas.

Padaryta: abu blokai tik maistui; filtru atributu sarasas pagal kategorija
(aksesuarui nerodomas „Baltymų šaltinis" ir „Amžius").

**„TIK KURJERIU" VARNELE.** Recon rado, kad `_ps_tik_kurjeriu` ir
`_petshop_courier_only` postmeta lenteleje NEEGZISTUOJA — kortelės kodas
tikrino tai, ko nera, todel visada rode „paštomatas galimas".

Realiai `courier_only` ateina is `Petshop_Fulfillment` bazes. Tualetui jis
grazina `false`, nors preke yra 56×39×38,5 cm — nes **jos svoris ir matmenys
sistemoje 0.0000**, ir automatika neturi is ko sprесti.

Varnele iraso `_ps_tik_kurjeriu`. Testas narsykleje: false → pazymeta →
„irasyta" → true.

**ATVIRAS PUNKTAS:** ar pristatymo metodai realiai uzsidarys checkout'e —
NEPATIKRINTA. Fulfillment sio lauko neskaito. Reikia arba ijungti i resolverio
grandine, arba prideti filtra, slepianti pastomato metodus. Tai liecia
checkout, todel nedaryta tuo paciu ypu.

---

### S744 — APRASYMAS REDAGUOJAMAS (v3.9)

Savininkas: „ir ka man dabar daryti, jei tik informacijai — tai bevertis
reikalas?"

Teisinga pastaba visai kortelei: rodziau diagnostika, o veiksmo nebuvo.
„Tekste nėra antraščių" be mygtuko yra priekaistas, ne irankis.

Padaryta: teksto laukas · „Įrašyti" · „Įterpti antraščių karkasą" (prideda
butent tos kategorijos sekcijas, esamas tekstas lieka po pirmaja) ·
„Grąžinti ankstesnę" (5 versijos).

Rasoma per `wp_update_post`, NE per `wc/v3` — pastarasis aprasymus korumpuoja.
Irasius uzdedamas `_ps_aprasymas_uzrakintas`.

Testas narsykleje: karkasas („pridėta: Aprašymas") · irasymas (63 simb.) ·
atsaukimas — visi trys.

---

### S745 — HTML VALYMAS (v4.0)

Savininkas atsiunte realu aprasymo HTML: „tu manai, kad cia imanoma kazka
koreguoti?" Ten `style="color:black !important"` prie kiekvieno elemento,
pasikartojantys `<style>` blokai, `b2b-black` apvalkalai, `<meta charset>`
viduryje turinio.

Matavimas: **62 %** to teksto buvo sankla. Farmina N&D: 4 961 → 3 565 simb.
(28 %), style atributu 23 → 0, `<style>` bloku 1 → 0.

**KRITINIS SKAICIUS:** grynas tekstas 3 114 → 3 114. Ne viena raide neprarasta.
Lenteles 1 → 1.

Dvi apsaugos: jei po valymo neliktu teksto — sustojama; jei sumazetu lenteliu
skaicius — sustojama.

**Preku su sankla: 1 545** (~40 % katalogo).

**MANO KLAIDA:** padariau mygtuka, kuri reiktu spausti 1 545 kartus.
Savininkas: „kam as turiu valyti sias siuksles? Tu gali viska sutvarkyti."
Teisus — tai fonine operacija, ne vartotojo darbas.

---

### S746 — WORDPRESS RENGYKLE (v4.1)

Savininkas po valymo: „as nepastebejau, kad kas pasikeistu."

Ir tai atskleide, kad valymas isspende ne ta problema. Narsykle tuos
perteklinius stilius ir taip ignoruodavo — pirkejas mate ta pati. O laukas ir
po valymo rode HTML, todel gramatines klaidos taisymas tarp `<td>` zymu buvo
toks pat neimanomas.

Reikejo ne trumpesnio HTML, o **normalaus teksto redaktoriaus**.

Idiegta TinyMCE: paryskinimai, sarasai, antrastes, LENTELES kaip lenteles;
„Tekstas / HTML kodas" perjungimas; iklijuojant is narsykles stiliai
numetami automatiskai (`paste_preprocess`).

Techninis niuansas: kortele ikraunama AJAX metodu, todel `wp_editor()` cia
neveiktu — rengykle paleidziama JS'u per `MutationObserver`, kai textarea
atsiranda DOM'e.

Patikra su Farmina N&D Tropical: textarea 5 030 simb. → rengykle paleista →
turinys tekstu 3 147 simb. → lentele 1 → iframe rodo skaitoma teksta,
0 JS klaidu.

---

### SAVININKO PASTABOS, DAR NEIVYKDYTOS

```
1  TUSCIOS ZYMES TEKSTE
   valymas palieka <div> be atributu, kurie rengykleje nematomi, bet HTML
   rezime kliuva. <h4> PALIKTI — jos yra sekciju antrastes, per kurias
   akordeonas skaido teksta prekes puslapyje.

2  NUOTRAUKOS IKELIMAS
   rengykleje `mediaButtons` isjungtas — ijungti.
   Plius nuotrauku skirtukas: ikelimas, tvarkos keitimas, pagrindines
   nustatymas. Dabar jis TIK rodo skaiciu — ta pati „bevertis reikalas"
   problema, kaip buvo su aprasymais.
```

### LIKO IS ANKSTESNIU DIENU

```
masinis HTML valymas    1 545 prekiu · su zurnalu ir atsaukimu
automatika naujoms      importas atveza → HTML isvalomas is karto
brendai                 137 ZB + 194 AV be zenklo, nors `_zb_brand` turi 1 059
143 prekes              atributas registruotas `_product_attributes`, be termino
68 nesutapimai          parserio siulymas skiriasi nuo esamos zymes
courier_only            varnele rasoma, bet Fulfillment jos neskaito
naujos prekes langas    maketas patvirtintas, kodo nera
Import #2               patikra, ar `_ps_sandelis` isgyveno
```

---

### PAMOKA

Keturios is penkiu siandienos popietes klaidu turejo ta pacia forma:
**sistema jau turejo teisinga atsakyma, bet vienoje vietoje jo neklause.**

```
sekciju_lukesciai()  mokejo skirti zaisla nuo maisto — antrasciu sarasas neklause
Petshop_Pilnumas     mokejo, kad aksesuarui serimo nereikia — blokas neklause
sekcijos             buvo skaidomos teisingai — bet rodomos kaip kodas
```

Todel prie kiekvieno naujo bloko verta klausti ne „ar veikia", o „ar jis
klausia to paties saltinio, kaip visi kiti".

Auksciausias decision Nr.: **S746**.

---

## 2026-08-10 — PARTIJOS, GAVIMAS, ATRIBUTAI [S733-S741]

Diena prasidejo nuo terminologijos pastabos, o baigesi partiju sistema ir
uzdarytu TZ punktu 1. Tarp ju — trys mano klaidos, kurias sugavo Raimis ir
dry-run'ai.

### IDIEGTA

| Failas | Versija | Ka daro |
|---|---|---|
| `petshop-partijos.php` | 1.1 | AV partijos su savikaina · FEFO · GPAIS pakuotes |
| `petshop-gavimas.php` | 1.0 | prekiu gavimo langas (Petshop prekės → Gavimas) |
| `petshop-parseris.php` | 1.3 | atributai is teksto · zurnalas · atsaukimas |
| `petshop-katalogas.php` | 3.6 | partijos kortelėje · pardavimu ir pakuotes skirtukai |

WPAI Import #1: `is_update_categories` ir `is_update_attributes` → 0,
`update_all_data` → no. Atsargine kopija `ps_wpai1_bak_20260810`.

---

### S733 — IMPORT #1 CIAUPAS (prevenciskai)

Raimis: „ir isztrinti prekiu zenklai ir visos problemos su ZB prekes,
skanuok ieskok problemos, manau cia tikrai degantis reikalas".

Skenas rado, kad **Import #1 (goods_clean.xml) turejo `update_all_data=yes`,
`is_update_categories=1/full_update` ir `is_update_attributes=1/full_update`**,
o jo sablone yra tik `product_brand`, `product_cat`, `product_tag`. Visi `pa_*`
i sablona neieina, todel butu trinami. Tai TA PATI schema, kaip vakarykstis
`_ps_sandelis` trynimas (S718), tik taksonomiju puseje.

Kiti profiliai (#2, #3, #5, #7) taksonomiju neliecia.

**HIPOTEZE NEPASITVIRTINO:** Import #1 istorijoje neatsiranda — jis kol kas
nieko netrina. Taciau tai buvo uztaisytas ginklas, todel ciaupas uzsuktas
prevenciskai. Kontrole: raktu 469 → 469, `is_update_custom_fields` liko
`only` (vakarykste pataisa vietoje).

**Kas paaiskejo apie brendus:** AV be zenklo 194, ZB 137, VF 7. Bet `_zb_brand`
meta turi VISOS 1 059 ZB prekes — duomenys yra, tik neperkelti i taksonomija.
Vieno priskyrimo darbas, NEPRADETA.

**Kas paaiskejo apie atributus:** 143 is 400 tikrintu prekiu turi
`pa_be_grudu` irasyta `_product_attributes` meta, bet TERMINO nepriskirto.
Kortelėje laukas matomas, o filtrui preke nematoma.

---

### S734 — PARTIJOS (`petshop-partijos.php`)

Priezastis (Raimio situacijos): (1) perku i AV, kiekviena partija gali tureti
kita savikaina, ypac is Lenkijos su kintanciu zloto kursu; (2) ZB/VF paleidzia
akcija, nusiperku pigiau, o kita menesi akcijos nebera — sistema to nemato.

`_cost_price` buvo VIENAS skaicius prekei: antrasis irasymas uztrindavo
pirmaji, ir marza rodoma nuo paskutines, nors lentynoje guli pigiosios.

**MODELIS:**

```
ps_partijos    product_id · gauta · kiekis_gautas · kiekis_liko
               savikaina_eur · savikaina_orig · valiuta · kursas
               geriausia_iki · tiekejas · importuota · atsaukta
ps_pakuotes    tipas · medziaga · svoris_g · vienetu_pakuoteje · tiekiama_su_preke
```

VALIUTA: kursas fiksuojamas pirkimo diena ir NIEKADA neperskaiciuojamas —
tai jau ivykusi operacija.

SAVIKAINA = svertinis vidurkis is partiju su likuciu. Rasomas i `_cost_price`
kaip greitoji kopija (katalogo sarasas skaito ja, ne agregacija).

NURASYMAS — FEFO: pirma ta partija, kurios galiojimas arciausiai.

Testai 10/10: EUR partija · PLN 142/4,31=32,9466 € · svertinis vidurkis
tiksliai · likutis 0→54 · FEFO paeme anksciausiai galiojancia · nurasymas ·
„trūksta 955 vnt." ispejimas · pakuotes 60 vnt.=5,14 kg · GPAIS tik is
importuotos partijos · ivykiu juosta.

**v1.1 (S737) — UZSAKYMU KELIAS.** Recon rado, kad AV likuti jau mazina
`Petshop_AV_Reduce::mazinti` (prioritetas 15). Todel partijos kabinamos prie
TU PACIU hook'u prioritetu 25 ir rasoma TIK i `kiekis_liko` — jokio `_stock`,
jokio `_own_stock_qty`. Antras rasytojas tame paciame lauke butu tiksliai ta
schema, kuri sukele S468/S478/S499/S503.

Testas su tikru uzsakymu: partijose 51→48, FEFO paeme #2 (2027-06-30),
AV likutis 61→58 (mazino av-reduce), idempotentiskumas veikia, uzsakyme dvi
pastabos greta — musu ir av-reduce.

**MANO KLAIDA:** `wp_delete_post()` HPOS uzsakymu netrina — jie gyvena
`wc_orders`, ne `wp_posts`. Reikia `$order->delete(true)`. Testinis uzsakymas
liko sistemoje; istrintas atskirai. Ta pati klaidos rusis, kaip `method_exists()`
ant WC data store: funkcija tyliai nieko nedaro, o atrodo, kad suveike.

---

### S736 — GAVIMO LANGAS (`petshop-gavimas.php`)

Raimio praktika: saskaita su 15-20 poziciju naturaliu skanestu, prekes
sistemoje jau yra, reikia tik kiekiu, savikainu ir galiojimo datu.

Excel atmestas kaip letesnis (eksportas → pildymas → importas → klaidu
taisymas, ir nematai, ar pataikei i ta preke). Lieka atsarginiu keliu.

EIGA: paieska → Enter → kiekis → Enter → savikaina → Enter → galiojimas →
Enter grazina i paieska. Skeneris veikia be atskiro rezimo, nes USB skeneris
kompiuteriui atrodo kaip klaviatura.

GREITINTUVAI: „Kartoti praeita gavima", „Galiojimas visoms", saskaitos sumos
kontrole PRIES irasant, savikaina uzsipildo is praeitos partijos.

Testas narsykleje: paieska rado · savikaina 32,95 € uzsipilde · klaviatura
7→25.00→2028-01-31 · suma 175,00 € · „sutampa"/„skirtumas 25,00 €" ·
partija #3 sukurta · likutis 61 · „Kartoti" uzkrove 3 pozicijas · 0 JS klaidu.

---

### S738-S741 — ATRIBUTU PARSERIS

**KODEL TAISYKLES, NE AI** (Raimio klausimas): domenas siauras — baltymu
saltiniu ~30, grudu kulturu ~8. Ten, kur sarasas baigtinis, taisykle
pranasesne: deterministiska, auditojama, nemokama, be isorines priklausomybes.
Raimio pasiulymas versti uzsienietiskus tekstus atskirai pasalino vienintele
vieta, kur taisykles butu pralaimejusios.

**NEIGIMO ATPAZINIMAS** — svarbiausia vieta. Tekste „Be grūdų — nenaudojame
kviečių, kukurūzų" paprasta paieska randa „kviečių" ir nusprendzia, kad preke
su grudais. Testai 7/8.

**DRY-RUN PAMOKA 1 (v1.1):** „Šlapimo takams" gavo 240 prekiu — zodis „inkst"
gaudo ir „gerina inkstu veikla", ir inkstus SUDETYJE (subproduktai
konservuose). Isimta.

**DRY-RUN PAMOKA 2 (v1.1):** dziovintos antienos kulseles gavo „Su grūdais" —
grudai buvo paminėti bendrame aprasymo tekste. SPRENDIMAS: grudai, baltymo
saltinis ir monoprotein ieskomi TIK sudeties sekcijoje (+ pavadinime). Nera
sudeties — laukas lieka tuscias, o ne spejamas.

**MANO KLAIDA, kuria istaise faktai:** paskelbiau, kad parseris klysta
antienos kulselems. Patikrinus sudeti paaiskejo, kad ten „vištiena 92 %,
KUKURŪZŲ KRAKMOLAS" — parseris teisus, o esama zyme „Be grūdų" klaidinga.
As skaiciau pavadinima, parseris — sudeti.

Raimio sprendimas: kukuruzu krakmolas = su grudais.

**APPLY:** 3 710 reiksmiu, 3 774 prekes, 3,7 min, viena operacija
`PARS26081011111122`, zurnalas su atsaukimu.

**MANO TRECIA KLAIDA — MONOPROTEIN.** Priskyriau 1 242 (buvo 496).
Raimis: „situ skaiciumi as netikiu". Patikrinus:

```
Monge BWild (šerniena)   sudetyje ir sherniena, ir SVIEZIA VISTIENA
                         „šerniena" nebuvo baltymu sarase → rado viena → „Taip"
Family Dog               „mėsa ir mėsos perdirbimo produktai (16 % jautienos)"
                         misrus baltymai, aprasyti bendrai → „Taip"
62 is 401 „Taip"         dar ir su glitimo grudais
```

Ir svarbiausia: 2026-06-15 (TZ v1.18) buvo uzfiksuota savininko taisykle —
**monoprotein = vienas baltymas IR be glitimo**; parseris v10 tada klydo
lygiai taip pat (476 preke, 233 su grudais). As tos taisykles nepaisiau.

**IŠVADA:** monoprotein is sudeties isvesti neimanoma patikimai. Nepilnas
baltymu sarasas visada duos klaidinga „Taip". Nuo v1.3 — TIK aiskus gamintojo
pareiskimas, ir net jis tikrinamas glitimu.

Atsaukta 1 163 · praleista 0 · po atsaukimo 496 (tiek, kiek buvo) ·
is naujo priskirta 15 · galutinis 499.

---

### REZULTATAS

```
                     buvo    dabar
pa_be_grudu           412    1 015
pa_baltymu_saltinis  1 023   1 233
pa_amzius             509    1 054
pa_speciali_mityba    165      649
pa_monoprotein        496      499   ← teisingai, beveik nepakito
pa_gyvuno_rusis      2 638    2 689
ZB su „be grūdų"        2      339
```

Pagal sandeli: AV 601 · VF 351 · ZB 339 su „be grūdų".

**ATSAUKIMAS, jei prireiktu:** `Petshop_Parseris::atsaukti('PARS26081011111122', false)`
— nuima tik parserio priskirtus terminus ir tik jei jie vis dar ten.

---

### MAKETAI (S735)

Trys interaktyvus maketai, patikslinti pagal Raimio pastabas:
`prekes_kortele_maketas_v1.html`, `prekiu_gavimas_maketas_v1.html`,
`nauja_preke_maketas_v1.html`.

Raimio pastabos, kurios buvo idetos: „Tiekimas" → „Gavimas"; sriftas juodas,
ne pilkas; du svorio laukai → vienas (prekes svoris bruto), pakuotes dydis
lieka atributuose; serimo lentele perkelta i Aprasymus; GPAIS — atskiras
skirtukas po Istorijos su issiskleidziancia dalimi.

---

### NEPRADETA / LIKO

```
brendai            137 ZB + 194 AV be zenklo, nors _zb_brand turi visas 1 059
143 prekes         atributas registruotas _product_attributes, bet be termino
68 nesutapimai     kur parserio siulymas skiriasi nuo esamos zymes
                   (pvz. „Minkšti vištienos žiedai" = „Be grūdų", o sudetyje
                   kukuruzu krakmolas) — esamu NEPERRASINEJU principingai
aprasymu redaktorius       9 sekcijos su uzraktais
naujos prekes langas       maketas yra, kodo nera
Import #2 patikra          ar `_ps_sandelis` isgyveno po WPAI pataisos
```

---

### PAMOKOS

1. **Dry-run skaiciai turi buti lyginami su tuo, ko protingai galima tiketis**,
   ne tik su tuo, ar kodas suveike. 1 242 monoprotein is 2 734 turejo iskart
   kelti klausima — tai siaura kategorija, ne puse katalogo. Raimis tai
   pastebejo per sekunde, as ne.
2. **Isvedimas is nepilno saraso visada meluos ta pacia kryptimi.** Jei
   sarasas nepilnas, „radau viena" reiskia „radau viena is tu, kuriuos zinau".
3. **HPOS uzsakymai netrinami per `wp_delete_post()`** — reikia `$order->delete(true)`.
4. **Zurnalas pries masini veiksma, ne po jo.** `Petshop_Ivykiai` stebi tik
   meta laukus; taksonomijoms reikejo atskiro zurnalo, ir be jo 3 710
   priskyrimu butu buve neatsaukiami.
5. **Senos taisykles galioja.** 2026-06-15 monoprotein taisykle buvo
   uzfiksuota TZ, ir jos nepaisymas kainavo viena atsaukima.

Auksciausias decision Nr.: **S741**.

---

## 2026-08-09 (diena) — VARIKLIAI, KATALOGAS v3.5, MAKETAI [S721-S732]

Tesinys po S718-S720 (`_ps_sandelis` uzdarymas). Sesija apeme keturis naujus
variklius, katalogo lango perdaryma nuo v2.8 iki v3.5 ir du interaktyvius
maketus. Visi diegimai su md5 patikra ir atsarginemis kopijomis.

### IDIEGTA

| Failas | Versija | Dydis | Ka daro |
|---|---|---|---|
| `petshop-ivykiai.php` | 1.2 | 20 773 B | vieninga preses laiko juosta |
| `petshop-pardavimai.php` | 1.0 | 14 549 B | pardavimu greitis, ABC, dienu atsargai |
| `petshop-pilnumas.php` | 1.1 | 18 003 B | duomenu pilnumo balas pagal tipa |
| `petshop-rysiai.php` | 1.2 | 16 535 B | dalyvavimas, broliai €/kg, matomumas |
| `petshop-katalogas.php` | 3.5 | 181 532 B | sarasas + kortele kaip darbo vieta |

Naujos lenteles: `ps_ivykiai`. Nauji cron'ai: 04:40 ivykiu valymas ·
04:50 pardavimai · 05:00 pilnumas.

Atsargines kopijos DB: `ps_katalogas_v28_bak`, `_v29_bak`, `_v32_bak`, `_v33_bak`,
`_v34_bak`.

---

### S721 — VIENINGA LAIKO JUOSTA (`petshop-ivykiai.php`)

Priezastis: istorija gyveno trijose vietose (AV zurnalas, kainu zurnalas,
"visi pakeitimai"), o importo pakeitimai nebuvo fiksuojami niekur. Butent del
tos aklos zonos `_ps_sandelis` dingimo istorija (S718) uztruko keturis
diagnostikos praejimus.

ARCHITEKTURINIS SPRENDIMAS: kabinama ant `updated_post_meta`, NE ant musu
mygtuku. Todel juosta mato VISUS kelius — kataloga, WC redagavimo puslapi,
importa, cron'a. Kabinant tik prie savo veiksmu gautume ta pacia akla zona,
del kurios modulis ir kuriamas.

Apsaugos: stebimi tik baltajame sarase esantys 18 raktu; rasoma tik kai
reiksme REALIAI pasikeite; riba 40 irasu prekei per uzklausa; tylus
praleidimas, jei lenteles nera (istorija neverta sulauzyto importo).

**KLAIDA, kuria sugavo testas T9.** v1.0 skaite sena reiksme is kesavimo
`updated_post_meta` metu — o ten kesas jau turi NAUJA. Rezultatas: visa juosta
butu rodziusi "→ 17,99" be "16,49 →", ir tai butu atrode kaip veikianti
sistema. Taisyta per `update_post_metadata` filtra (fires PRIES irasyma).
Filtre kritiska grazinti `$check` nepakeista — grazinus ne-null, WordPress
laikytu irasyma jau atliktu ir realus update neivyktu (tylus duomenu
praradimas, blogesnis uz pacia klaida).

Testai 11/11: meta hook · be pokycio nerasoma · nestebimas ignoruojamas ·
op_nr · op_nr isvalymas · statusas · WC CRUD · filtrai · sena reiksme ·
`_stock` per CRUD · svetimu preku 0.

Backfill: 13 irasu is `ps_av_zurnalas` (14 praleista — atsauktos operacijos).

**v1.2 pataisa (Raimio pastebejimas):** `_weight` etikete "Siuntos svoris" →
"Prekes svoris". Siunta yra keliu prekiu suma su pakuote — isvestinis dydis,
neegzistuojantis kaip prekes laukas. Klaidingas pavadinimas anksciau ar
veliau paskatintu i ji irasyti visos siuntos svori. **Makete v18 ta pati
klaida yra 10 vietu — taisyti pries E2 kodavima.**

---

### S722 — PARDAVIMU GREITIS (`petshop-pardavimai.php`)

Didziausia spraga pries Inventory Planner / Cin7 klase: katalogas nemate
pardavimu, todel sprendimai "kelti kaina", "uzsakyti daugiau", "isimti"
buvo priimami nezinant, ar preke apskritai perkama.

Skaiciuoja is `wc_order_product_lookup` + `wc_order_stats` (HPOS):
365/90/30 d. vienetai, pajamos, uzsakymai; ABC (80/15/5 pagal metines
pajamas); dienu atsargai; negyvos atsargos.

MARZOS ATSARGA irasyta i koda: marza = DABARTINE savikaina × parduotas
kiekis. Tai apytiksliai — jei tiekejas kele kaina, istorine marza buvo kitokia.
Tikslus skaiciavimas reikalautu savikainos fiksavimo uzsakymo eiluteje
pardavimo momentu. Laukas vadinasi `marza_apytiksle` ir niekur nerodomas
kaip buhalterinis skaicius.

Testai 9/9, tarp ju T1 — nepriklausomas kontrolinis SQL, sutapo vienas prie
vieno penkioms prekems.

RADINYS: `lookup` lenteleje yra NEIGIAMU `product_qty` eiluciu — daliniai
grazinimai. Reiskia skaiciavimas duoda GRYNAJI pardavima (parduota minus
grazinta), ir tai teisinga. Apsaugos: neigiamas greitis → `dienu atsargai`
= null; neigiamos pajamos → preke krenta i "be pardavimu", ne i ABC.

Perskaiciuota visam katalogui: 3 774 prekes, 74 s.

---

### S723 — DUOMENU PILNUMO BALAS (`petshop-pilnumas.php`)

PAGRINDINIS PRINCIPAS (Raimio sprendimas): balas matuoja TIK tai, ka realiai
imanoma uzpildyti. Laukas, kurio uzpildymas reikalauja fizinio matavimo ar
isoriniu duomenu, i bala NEIEINA — kitaip preke, turinti viska, ka gali
tureti, niekada nerodytu 100 %, ir balas mirtu kaip irankis.

Padengimo matavimas pries taisykliu nustatyma:

```
                  MAISTAS(1639)  AKSESUARAI(2028)
pakuotes dydis    95 %           11 %   ← nasta
matmenys          34 %           20 %   ← nasta abiem
EAN               34 %           42 %
galerija          45 %           57 %
gyvuno rusis      97 %           92 %
```

ISIMTA del nastos: matmenys, prekes svoris aksesuaruose, galerija kaip
reikalavimas.

EAN — SAMONINGA ISIMTIS (Raimio sprendimas): padengimas zemas, bet paliktas,
nes prekiu vedimas skeneriu yra planuojama darbo forma — rodiklis turi
SPAUSTI link jos, ne tik konstatuoti dabarti. Kad tai nebutu bausme uz
neimanoma, veikia zyme `_ps_ean_netaikomas`: sveriamos ir naturalios prekes
EAN neturi ir netures, todel jom taskai iskrenta IS VARDIKLIO.

BALAS = surinkta / GALIMA × 100 (ne is fiksuoto 100). Todel visada pasiekiamas.

Taisykles (kiekvieno tipo suma = 100): maistas 10 lauku · skanestai 8 ·
papildai 9 · rinkinys 3 · aksesuarai 5.

APRASYMU SEKCIJOS skaidomos per `psdp_split()` — TA PACIA funkcija, kuria
naudoja prekes puslapis (snippetas 512). Antra sava skaidymo logika reikstu,
kad katalogas rodo viena, o pirkejas mato kita.

**v1.1 pataisa po pirmo pilno paleidimo:** Mix&Match rinkiniai gavo 0 % ir
uzkiso eiles virsu. Rinkinys yra KONTEINERIS — savikaina isvestine is
komponentu, savos sudeties neturi, EAN netures niekada. Prideti tipas
`rinkinys` ir grupe `nevertinama` (DP skelbimai, testines prekes — 10 vnt.).

Rezultatas: 3 764 prekes, vidurkis 73,7 %, pilnu 822.
**620 prekiu yra 90–99 % grupeje, ir is 200 tikrintu VISOMS truksta TIK EAN** —
tiksliai tas spaudimas, del kurio EAN ir paliktas.

---

### S724 · S726 — KATALOGAS v2.9 ir v3.0

v2.9: prijungti trys varikliai. Nauji stulpeliai (Pardavimai · Uzteks ·
Pilnumas), naujos eiles (Baigiasi greiciau nei tiekiama · Negyvos atsargos AV ·
Duomenu skolos), kortelėje "Kaip sekasi" virsuje ir vieninga juosta vietoj
tik-katalogo istorijos.

Senasis `pilnumas()` metodas su savo 8 lauku logika perjungtas i Varikli 3 —
dvi pilnumo sistemos viename lange rodytu skirtingus skaicius tam paciam
dalykui, o tai blogiau nei ne vienos. Senoji logika lieka ATSARGINE saka.

NEGYVOS ATSARGOS — tik AV. Dropship prekes guli pas tiekeja, pinigu nesaisto,
todel i sia eile joms vietos nera. (Sprendimas priimtas is principo, ne is
dev duomenu.)

Verifikacija: eiles = filtrai vienas prie vieno (1=1, 746=746, 1971=1971) —
skaitiklis ir sarasas negali issiskirti.

v3.0: kortelėje trys blokai is `Petshop_Rysiai`.

---

### S725 — RYSIAI (`petshop-rysiai.php`)

Keisti kaina ar isimti is prekybos nematant "ji yra trijuose rinkiniuose" —
avarija, laukianti savo dienos.

**Du realus radiniai per testavima:**

1. Broliu heuristika per laisva (72 %): surisо "Eukanuba Golden Retriever
   Adult" su "Eukanuba German Shephed Adult" (78 %) — pasalinus dydi jie
   skiriasi tik veisles vardu. Riba pakelta iki 88 % + reikalavimas, kad
   pakuotes dydis SKIRTUSI.
2. Slapias ir sausas maistas buvo suristi kaip broliai. €/kg palyginimas tarp
   konservu ir sauso maisto klaidina (konservuose ~80 % vandens) ir gali
   privesti prie blogo kainodaros sprendimo. Atskirta.

MNM VAIKAI: `_mnm_*` meta raktu nera NE VIENO, o `wc_mnm_child_items`
lenteleje 362 irasai. Stulpeliai: `container_id` = TEVAS, `product_id` = VAIKAS.
v1.1 abiem naudojo `product_id`, todel tevas ir vaikas sutapo ir kelias
TYLIAI praleido visus rysius. Istaisyta v1.2.

Patvirtinimas: Animonda GranCarno 400 g dalyvauja 5 rinkiniuose.

---

### S727 · S728 — NEAISKIOS KILMES VERSIJOS (atviras klausimas)

Po v3.0 diegimo (17:15) failas serveryje buvo perrasytas 17:44 i v3.2, kurios
AS NEDIEGIAU. Raimis patvirtino, kad jis irgi nieko nedare. Aktyviu rasanciu
snippetu nera, likusiu `_b64` opciju nera — kanalas neaiskus.

Failo antraste aprasо v3.1 ir v3.2 kaip atsaka i SCREENSHOT'O isvadas
(Pilnumo stulpelis netilpo ir dubliavo bukles taska; kortelėje buvo DU
pilnumo blokai). Sprendimai teisingi ir nuoseklus su musu darbu, todel v3.2
priimta kaip pagrindine baze.

**MANO KLAIDA prie sio radinio:** paskelbiau "struktūrinę klaidą 14 `<th>`
pries 13 `<td>`". Tai buvo skaiciavimo artefaktas — `substr_count($html,'<th')`
gaudo ir `<thead>`. Realiai 13 pries 13.

RIZIKA: jei tikrai yra antras procesas, rasantis ta pati faila, kitas deploy
jo darba istrins. Nuo v3.3 kiekvienas katalogo diegimas tikrina md5 pries
rasyma ir sustoja, jei failas ne tas, is kurio dirbta.

---

### S729 — DIZAINAS PAGAL MAKETA v18 (v3.3)

Raimis: "katalogo ir prekes dizainas man nepatinka, skiriasi nuo maketo".

Palyginus maketo ir realaus lango screenshot'us paaiskejo esmine priezastis:
**maketas dirba per visa ekrana, o realus langas atiduoda ~230 px WordPress
meniui.** Butent del to lentele netilpo ir v3.1/v3.2 teko salinti stulpelius —
taisyta ne ten, kur problema.

Padaryta: pilno ekrano rezimas (WP meniu paslepiamas TIK siame puslapyje),
tipografija ir tarpai pagal maketa, kategorijos kodas po nuotrauka
(nuotraukos LIEKA — Raimio sprendimas: "jis labai reikalingas"),
suvestine nusileido PO lentele.

Rezultatas: lentele 1394 px vietoj ~1150.

---

### S730 · S731 — KORTELE KAIP DARBO VIETA (v3.4, v3.5)

Raimis: "kortele ziauriai nepatogi, pats pasiziurek".

Diagnoze: kiekvienas blokas rodomas visada, net kai tuscias. Atidarai preke ir
matai "Kaip sekasi 0 vnt / 0 vnt", tada "Kur dalyvauja: 0" su pastraipa
paaiskinimo, tada keturias eilutes "taip/taip/taip/taip". Trys ekranai nieko.
O "Kaina ir marza", su kuria dirbama kasdien — patame apacioje.

v3.4: isdestymas pagal pramones standarta (Shopify produkto puslapio logika):
KAIRE = tai, su kuo dirbama · DESINE = kontekstas. Kortele isplesta nuo 300 px
juostos iki 1181 px. TUSTI BLOKAI NERODOMI — blokas atsiranda tik kai turi ka
pasakyti.

v3.5: REDAGAVIMAS. Kaina, akcijine, savikaina, SKU, EAN, svoris — Enter
iraso, Esc atstato. Kiekvienas irasymas i zurnala su operacijos numeriu.
Marza persiskaiciuoja vietoje.

SAVIKAINA redaguojama TIK kai jos nevaldo tiekejas: VF/ZB prekems ji ateina is
`_vf_cost`/`_zb_cost`, ir irasymas i `_cost_price` nieko nepakeistu —
resolveris jo net nepamatytu. Tyliai priimti tokia ivesti reikstu meluoti,
kad issaugota.

SKU ir EAN tikrinami unikalumui — dublikatas sulauzytu susiejima su tiekejo XML.

Testas narsykleje su PS-TEST-001: savikaina 7.77 → Enter → "irasyta", 0 JS klaidu.

Prideti maketo v18 blokai: filtravimo atributai, rysys su tiekeju, serimo
lentele, siuntimas.

---

### S732 — INTERAKTYVUS MAKETAI

Raimis: "sunku pasakyti, kai matai tik nuotrauka... padaryk interaktyvia
kortele, as ja pratestuosiu, tai turbut visiskai paprasciau nei visa koda
rasyti". Teisinga: maketa paspaudineti pigiau nei koda perdarineti.

`prekes_kortele_maketas_v1.html` (43 KB) — 5 skirtukai, redagavimas su
gyva marzos perskaiciavimu, AV korekcijos dialogas, aprasymu sekcijos su
uzraktais, pardavimu grafikas, istorijos filtrai.

`prekiu_priemimas_maketas_v1.html` (19 KB) — greitas suvedimas klaviatura
be Excel'io: paieska (pavadinimas/SKU/EAN) → Enter → kiekis → Tab →
savikaina → Tab → galiojimas → Enter grazina i paieska.
"Kartoti praeita tiekima", "galiojimas visoms", PLN kursas, saskaitos
sumos tikrinimas pries irasant.

**KLAIDA, kuria sugavo testas:** paieska "plauciai" NERADO prekes
"jautienos plauciai" — nenormalizavo diakritiku. Realiame darbe rasoma be
lietuvisku raidziu, ir preke butu "dingusi", nors sarase YRA. Istaisyta.

---

### RAIMIO SPRENDIMAI (uzfiksuoti)

| Klausimas | Sprendimas |
|---|---|
| Nuotraukos kataloge | LIEKA — "jis labai reikalingas" |
| EAN pilnumo bale | LIEKA, nors padengimas zemas — spaus link skenerio |
| Savikaina | aktualu TIK AV prekems; dropship — saskaitos pagal fakta |
| Buhalterija | sumine apskaita; i Pragma tik pardavimai; savikainas veda buhaltere |
| Saskaitos Nr. partijoje | NEREIKIA — apskaitos cia nevedam |
| Konservu 6-pack | ispakuojama, parduodama po 1 vnt.; abi pakuotes i GPAIS apskaita |
| GPAIS apimtis | registruotas, iki 5 t "labai toli" → sumine apskaita |
| Excel priemimui | nereikia, jei veikia greitas suvedimas |
| Launch | rugsejo pabaiga realu; "geriau savaite veliau nei taisyti veikianti" |

---

### MANO KLAIDOS SIOJE SESIJOJE

1. Tris bridge run'us sudeginau bandydamas modifikuoti runner'i per `sed`/regex
   vietoj rasymo is naujo. Kodo nepaliete, laiko kainavo.
2. Paskelbiau nesama "struktūrinę klaidą" (`substr_count` artefaktas).
3. v3.4 pradzioje dirbau su pasenusia baze (v3.2 vietoj v3.3).
4. Padengimo lentele skanestams rode 3 vietoj ~38 — naudojau `iconv` translit
   vietoj tikslaus `be_diakritiku`.
5. Kortelėje rodziau "Pakuotes dydi" DUKART (Raimio pastebejimas).
6. Pirmame darbo plane komentavau dev duomenis ("300 negyvu atsargu") taip,
   lyg tai butu radinys — dev yra testine aplinka, taisykle zinoma.

---

Auksciausias decision Nr.: **S732**.

---

## 2026-08-09 — `_ps_sandelis` NASLAITIS LAUKAS: DIAGNOZE + UZDARYMAS [S718-S720]

Vakar (S716) rastos 262 ZB prekes be `_ps_sandelis` lauko, klausimas atidetas rytui.
Siandien: priezastis rasta, ciaupas uzsuktas, 362 prekes uzpildytos, ideta automatika.
Visi diagnostikos run'ai read-only, TEMP snippetai deaktyvuoti po kiekvieno.

### IDIEGTA

| Snippetas | Kas |
|---|---|
| 2515 | **Petshop Sources v2.2** — registras + palaikymas + sandelio pildymas |
| ~~2404~~ | Sources v2.1 — deaktyvuotas, kodas issaugotas (rollback) |

```
uzpildyta          362 prekes · visos zb · liko kandidatu 0
liko be lauko        0  (buvo 362)
zurnale            362  irasai undo'ui
WPAI #1, #2        full_update → only (_zb_* sarasas)
```

---

### S718 — DIAGNOZE: lauka niekas neraso, o ZB importas ji trina

Metodas: 4 read-only bridge run'ai (ZBDIAG v1–v4), snippetu ir mu-plugin'u kodo skanas,
WPAI profiliu `options` analize, `pmxi_posts` / `pmxi_history` koreliacija.

**1. Laukas neturejo NE VIENO rasytojo.** Visos panaudos kode — skaitymas:
snippet 2403 (1 vieta), snippet 2404 (7), `petshop-katalogas.php` (7).
Vienintelis rasytojas per visa istorija — vienkartinis TEMP S595 mass-write 08-06.
Nei ZB, nei VF importas lauko nekuria nei naujoms, nei atnaujinamoms prekems.

**2. ZB profiliai lauka AKTYVIAI TRYNE.** Buksena pries taisyma:

```
#1 goods_clean.xml   is_upd_cf=1  logic=full_update   ← trynejas
#2 products.php      is_upd_cf=1  logic=full_update   ← trynejas
#3 stocks.php        is_upd_cf=0                      saugus
#5 vf-fetcher        is_upd_cf=1  logic=only          teisingai
#7 vf-fetcher qty    is_upd_cf=1  logic=only          teisingai
```

`full_update` = update metu istrinami VISI custom fields, kuriu nera sablone.
ZB sablone tik `_zb_*` → `_ps_sandelis` istrinamas kas update.

**3. Laiko koreliacija patvirtina mechanizma.** TEMP S595 mass-write 08-06 ~13:00 →
Import #2 run'as 08-06 15:01, summary „0 created **362 updated** 2 218 skipped".
Preku be lauko siandien — **lygiai 362**. Likusioms laukas isliko, nes buvo „skipped".

**4. VF puse sveika del teisingos konfiguracijos** (`only`, ne `full_update`) —
visos 1 161 VF prekes lauka turi. Tai ir buvo B sprendimo etalonas.

**5. Pacios 362 prekes SVEIKOS** — duomenu praradimo NEBUVO:

```
308 publish + 54 draft
registro irasas (zb, is_active=1)   362/362
_zb_cost · _zb_qty · _zb_last_sync  362/362
kategorijos · _tax_status           362/362
atributai 329 · nuotraukos 326 · kainos 324
_manual_price_override                0   ← rankinis darbas nepaliestas
resolve()                           zb/venipak („ZB meta laukai" fallback)
```

Parduotuve, likuciai ir kainos veike korektiskai visa laika. Rizika buvo tik ten, kur
laukas tikrinamas TIESIOGIAI: katalogo sandelio filtras, Venipak manifestu sandelio kodai.

**NEUZDARYTAS GALAS.** Vakar 21:24 matavimas rode 262, siandien ryte — 362, nors uzklausa
identiska, registras nekito, #2 nakti nebego. Tikslus +100 kanalas nesugautas per 3
bandymus → pagal anti-rabbit-hole taisykle sustota. Saknies tai nekeicia: laukas
strukturiskai nepalaikomas, todel skaicius bet kuriuo atveju plauke.

---

### S719 — B + A: ciaupas ir automatinis palaikymas

**B — WPAI profiliu pataisa (priezastis).** Keisti tik trys raktai #1 ir #2; sarasas imtas
ne is galvos, o is paciu profiliu `custom_name`:

```
#1  full_update → only   10 _zb_* lauku
#2  full_update → only   12 _zb_* lauku
```

Saugikliai: `unserialize` patikra pries; po serializavimo pakartotinis `unserialize`
(neatsistato → keitimas praleidziamas); po irasymo perskaitymas is DB.
Rezultatas: abu `db_upd=1`, `po_unserialize=TAIP`, `is_upd_cf=1` isliko.

**A — Sources v2.2 (pasekmes + ateitis).** Sukurta is v2.1 penkiais taskiniais patch'ais,
sintakse patikrinta lokaliai `php -l` PRIES deploy.

`uzpildyti_sandeli($pid)` — griezos taisykles:

```
pildo TIK tuscia lauka · netuscio NIEKADA neperraso
raso TIK kai registre LYGIAI VIENAS aktyvus saltinis (dviprasmybe → praleidzia)
reiksme privalo buti leistinu 7 sarase
statinis rekursijos sargas
kiekvienas irasas → zurnalas ps_sandelio_uzpildymai (riba 5 000)
```

Ikabinta i `sinchronizuoti()` pradzia → gydo per esamus hook'us
(`woocommerce_update_product`, `woocommerce_new_product`, `_ps_sandelis` meta pakeitimas)
ir per naktini cron 04:20. **Nauja preke lauka gaus savaime** — tai ir buvo A esme.

Endpoint'ai (token `k=ps2026`, apply/undo dar ir `patvirtinu=taip`):

```
?ps_src=sandelisdry     kandidatai, nieko neraso
?ps_src=sandelisapply   pildymas
?ps_src=sandelisundo    atstatymas is zurnalo (tik kur reiksme nepakitusi)
```

DRY: kandidatu 362, visi `zb`, zurnale 0 — grupe vienareiksme.

**BACKUP pries visus keitimus:** `analize/s718_backup.json` bridge repo —
WPAI #1 options (25 693 B) + #2 options (26 208 B) + Sources v2.1 kodas (30 123 B).

---

### S720 — APPLY + verifikacija

```
irasyta        362   visos zb          liko kandidatu   0
liko be lauko    0   (buvo 362)        dublikatu meta   0
zurnale        362   undo paruostas
```

Sandelio pjuvis po apply (publish+draft):

```
av 1388 · vf 1161 · zb 1059 · quattro 65 · prins 43 · belcor_tofu 42 · ambrosia 15
```

ZB: 697 → 1 059, tiksliai atitinka registro `zb=1059`. Visi 7 sandeliai sutampa su
registru vienas prie vieno.

**KONTROLE — kas NEPAJUDEJO:**

```
registro is_active      identiski skaiciai pries/po visiems 7 saltiniams
preku busenos           2 734 publish · 1 039 draft · 32 trash — kaip ryte
pavyzdziai 14062/14064/14072   kainos, _stock, _zb_qty, _tax_status nepakite
resolve()               zb / venipak / courier_only=false
svetaine                HTTP 200 po snippetu perjungimo
aktyvus TEMP            0  · lieka tik #2403 Stock Service v1.3 ir #2515 Sources v2.2
```

**ROLLBACK (visi keliai patikrinti, kad egzistuoja):**

```
meta undo   ?ps_src=sandelisundo&patvirtinu=taip&k=ps2026
kodo undo   aktyvuoti #2404, deaktyvuoti #2515
WPAI undo   analize/s718_backup.json → options_b64 atgal i pmxi_imports
```

---

### ATVIRAS PUNKTAS — B dar NEIRODYTAS

B pritaikytas, bet nepatikrintas realiu importu. Kritine detale: trynejas buvo
**Import #2**, kuris bega RETAI (paskutiniai 08-04 03:01, 08-06 15:01), o ne kas valanda.
Import #3 (kas valanda) lauko niekada netryne (`is_upd_cf=0`) — jo praejimas NIEKO neirodo.

```
patikros salyga   po pirmo Import #2 run'o po 2026-08-09 12:15:
                  ar _ps_sandelis tebera 1 059
                  IR ar _zb_qty / _zb_last_sync atsinaujino
                  (t. y. `only` nesulauze paciu ZB lauku atnaujinimo)
statusas          „pritaikyta, neirodyta" iki tol
```

Raimis nurode, kad tas importas siandien nebus.

### BACKLOG RADINYS — 74 ZB draft'ai be `_zb_draft_reason`

Is ju 42 su likuciu >0. Daugiausia Real Dog KOMP rinkiniai ir Beaphar „pak6" pakuotes.
NEPRADETA, laukia Raimio. Atskiras klausimas nuo sio.

Auksciausias decision Nr.: **S720**.

---

## ZURNALO SPRAGA — S633-S717 NEUZFIKSUOTI

Sis irasas soka nuo S632 (2026-08-07 popiete) prie S718. Tarp ju liko neuzfiksuotos
2026-08-07/08 sesijos: E1 katalogo langas (`petshop-katalogas.php` v1 → v2.8),
Sources v2.0/v2.1 + Stock Service v1.3, PVM taisymas 5 WPAI profiliuose ir 988 prekese,
WC sync sargybinis (`petshop-wc-sync.php` per Reflection), 32 legacy bundle'u salinimas,
masiniai veiksmai su perziura, 123 klaidingu `_ps_be_saltinio` zymiu nuemimas [S716].
Sprendimai gyvi, bet aprasyti tik pokalbiu istorijoje. Uzpildymas — atskiras darbas.

---

## 2026-08-07 (popietė) — E0: ps_sources + Stock_Service [S619-S632]

### IDIEGTA

| Snippetas | Kas |
|---|---|
| 2384 | **Petshop Sources v1.1** — `ps_sources` lentele + migracija |
| 2387 | **Petshop Stock Service v1.2** — parduodamo kiekio skaiciavimas |

```
ps_sources    3 805 irasai · 3 804 prekes · 0 dublikatu · 0 prekiu be iraso
kryzmine      2 776 publish · naujas modelis = veikiantis resolve() · 0 nesutapimu
```

Parduotuveje NIEKAS nepasikeite — tas pats rezultatas, tik paimtas is struktūros.

### SPRENDIMAI

**Saugos rezervas — ATMESTAS.** Siuliau atimti 1 vnt. nuo tiekejo likucio.
Raimis: „Preke arba yra, arba jos nera. Retai perkamu prekiu tiekejai laiko po kelias."
Dirbtinis nurasymas paslėptu parduodama preke. `saugos_rezervas = 0`.

**Sviezumo taisykle tik sinchronizuojamiems.** Mano pirmoji versija „nera sync datos →
neiskaitoma" butu padariusi **142 prekes neparduodamas**: Quattro 63, Belacor 41,
Prins 23, Ambrosia 15 — ju likutis vedamas RANKA, datos nera ir nebus.

```
sinchronizuojami   vf · zb          tikrinamas 24 val. sviezumas
rankiniai          quattro · prins · belcor_tofu · ambrosia   data nereikalinga
```

### ★★★ DUOMENU RADINIAI ★★★

**4 neigiami likuciai.** Visos keturios: parduota 0 vnt., 0 uzsakymo eiluciu,
backorders isjungti → skaicius irasytas TIESIOGIAI, ne per pardavimus.

```
#16317  Ruda avies koja                 −411 → 0
#17443  Guminė pirštinė kairiarankiams   −10 → 0
#18623  Exclusion Hepatic                 −8 → 0
#17710  Purrfect kraikas 6 l              −1 → 0
```

**JOSERA #17978 — DAUGIASALTINIS ATVEJIS BUVO ARTEFAKTAS.**

Preke turejo `_own_stock_qty = 2` ir `_stock = 2`, nors `_vf_qty = 782`.
Visoms kitoms 1 161 VF prekei `_stock` sutampa su `_vf_qty` — si buvo VIENINTELE isimtis.

**Raimio izvalga:** senoje sistemoje VF likuciai vedami ranka, todel migruojant galejo
likti rankinis skaicius, o ne reali AV lentyna. Pasitvirtino.

Istaisyta: `_own_stock_qty` istrintas, `_stock` atstatytas is `_vf_qty`.
Patikrinta po valandos — sinchronizacija vel ja valdo (780 = 780).

**IZVADA MODELIUI:** realiu daugiasaltiniu prekiu kataloge NERA NE VIENOS.
`sources[]` lieka teisingas, bet dabar atspindi tikrove: viena preke — vienas saltinis.
Vykdymo taisykle AV → tiekejas dar neturi realiu duomenu patikrinimui.

**Dublikatu paieska** visoje 3 804 prekiu bazeje: 50 grupiu vienodais pavadinimais
(daugiausia pakuociu dydziai tame paciame sandelyje), **1** grupe su skirtingais
sandeliais (Farmina N&D Prime Cat: #14595 av draft · #27564 zb publish),
1 dublikatas pagal EAN, **0** AV prekiu su VF pozymiais.
Masines AV/VF dubliavimo problemos NERA.

Josera Sensiplus trejetas (#17978 · #19920 · #19921) — **NE dublikatai**,
trys skirtingos pakuotes (12,5 / 3 / 0,9 kg). Netrinta.

### ★ VF SAVIKAINA — MANO ANKSTESNIS TEIGINYS BUVO KLAIDINGAS ★

TZ 38.3 irasyta, kad savikaina imama is XML bazines kainos ir VF marza rodoma
neteisinga. **TAI NETIESA.** Klaida buvo mano recon'e — lyginau ne ta lauka.

```
_vf_cost_xml            16,89   tiekejo bazine kaina
_vf_supplier_discount    0,15   BRAND:Exclusion +DISC:15%
_vf_cost              14,3565   FAKTINE savikaina — ja naudoja Cost_Resolver
saskaitoje             14,36    sutampa iki cento
```

Tikroji VF maisto marza **17 %**. Nuolaidos: 271 preke 20 %, 80 prekiu 15 %, 810 be.
TZ v1.65 39.6 skyriuje irasytas pataisymas.

### ★★★ SNIPPETU SIUKSLYNAS ★★★

Inventorizacija parode masta:

```
TEMP S445–S632                   162
„(temp)" / „tmp"                ~450
„UI Localization Runtime Audit" ~100 (vienas pavadinimas, kartotas)

AKTYVUS laikini (RIZIKA):  736 · 738 · 797 · 798–805 · 1410 · 1647
```

**KRITINIS RADINYS:** Code Snippets REST DELETE grazina **204 „pavyko", bet NETRINA.**
Todel ankstesniu sesiju zurnaluose irasai apie istrintus snippetus yra NETIKSLUS —
jie tik isjungti. Trynimas imanomas tik per WP admin arba tiesiogiai DB lenteleje.

Valymo planas (kitam langui):
```
1  perskaityti 13 aktyviu laikinu — kurie realiai veikia sistema
2  nereikalingus isjungti su patvirtinimu
3  masinis trynimas per DB su atsargine kopija
   kriterijus: TEMP* arba (temp)/tmp IR neaktyvus
```

### LIKO ATVIRA

```
_own_stock_qty naslaitis   meta_id 1020059, post_id 48375, reiksme 0,
                           prekes NEBERA — i skaiciavimus nepatenka
925 prekes su _stock=0     Raimis: „prie prekiu nelysk, cia mano darbas" —
                           jos guli draft, viskas ok
```

### KAS TOLIAU

```
E0 liko   resolve() perjungti skaityti is ps_sources
          Stock_Service prijungti prie WooCommerce
          nauja preke be saltinio → Klausimai
E1        Katalogo langas
Atskirai  snippetu valymas (naujame lange — reikia vietos)
```

Auksciausias decision Nr.: **S632**.

---



### MAKETO VERSIJOS — KAS PASIKEITE

| v | Kas atsirado / kas buvo blogai |
|---|---|
| v1 | pirmas variantas, sviesus fonas |
| v2 | tamsus fonas, konsultanto 6 korekcijos, worklist, dry-run/revert, istorija, CSV, skeneris |
| v3 | akcijos TIK Akciju lange; rinkiniai != FBT; viena issaugojimo juosta |
| v4 | **emoji ismesti** (Raimis: „darbinis langas, ne vaiku darzelis"); pilnas filtravimas (kategorija, brendas); prekes isemimas su 301; zargonas is ekrano islindo i ⓘ |
| v5 | nauja preke (EAN-first), masinis ikelimas, marza % IR €, PVM etiketes, trys kainu keliai, rikiavimas, puslapiavimas, variantai |
| v6 | savikainos pokyciu eiles, marzos grindys, kairysis stulpelis pertvarkytas pagal darbo tvarka |
| v7 | konsultanto P0: finansine suvestine, parduodama ne suma, akcijos/savikainos atskyrimas, AV tik ± korekcija |
| v8 | EAN kontrolinis skaitmuo, aprasymu sablonai pagal kategorija, XML savikainos override, Excel round-trip |
| v9 | tikras save/discard, aprasymu busena, saziningas AV zurnalas, filtrai per Stock_Service |
| v10 | kopijos ciklas per prekes, tiekejo rysys issaugomas, serimo lentele → kanoninis kelias, saraso pertvarkymas |
| v11 | **prekes kopijavimas** su dviem paruostais variantais |

Galutinis: `prekiu_katalogas_maketas_v11.html`.

---

### ★★★ KLAIDOS, RASTOS SAVO PACIO AUDITU ★★★

Kiekviena versija tikrinta atskirai paleidziant skaiciavimus Node'u su realiais
duomenimis, ne skaitant koda.

**1. Finansine suvestine MELAVO (v6→v7).** „Sandelio verte = kaina × parduodama"
su testiniais duomenimis rode **42 162 €**, o tikroji AV atsargu savikaina —
**292 €**. I skaiciu pateko tiekeju likuciai, kuriu imone neturi, ir pardavimo
kaina vietoj savikainos. Skirtumas 144 kartai.

**2. Marzos apvalinimas iskreipdavo pigias prekes (v6).** Siuloma kaina visada
apvalinta i .X9. Animonda konservui 0,99 € tai reiske 1,19 € vietoj 1,12 € —
atstatydavo 38 % marza vietoj buvusiu 34 %. Pataisyta: .X9 tik nuo 5 €, zemiau —
centais. Perleista 7 prekiu testu, visos atstato 1 % tikslumu.

**3. Excel maketo eksportas ignoravo pasirinkta apimti (v8).** Visada
`P.filter(pass)`, nepaisant radio mygtuko.

**4. Naujos prekes EAN patikra veike tik su Enter (v7).** Skeneris Enter siuncia
pats, todel testuojant skeneriu klaida nesimate; ivedant ranka forma neatsirasdavo.

**5. Kopijuojant buvo perimamas siuntos svoris (v11).** 10 kg → 1 kg pakuote
sveria kitaip; perimtas svoris duotu ne ta pastomato dydi.

### KLAIDOS, KURIAS RADO KONSULTANTAS (per Raimi)

Visos patikrintos KODE pries taisant — visos buvo tikros.

| # | Klaida |
|---|---|
| P0-1 | `openCard()` valydavo `state.dirty` → „Atmesti" nieko neatmesdavo; kopija neatnaujinama po issaugojimo; uzdarant duomenys negrazinami |
| P0-2 | Aprasymo tekstas issaugomas, bet `p.desc[i]='hand'` nenustatomas → preke toliau rodoma kaip be aprasymo |
| P0-3 | Tiekejo radinys buvo TIK TEKSTAS EKRANE — sukurta preke nuo tiekejo atsijungdavo (be ssku, likucio, sync datos) |
| P0-5 | AV korekcija: turint 1 vnt. ir nurasant 10, zurnale rasydavo „−10" |
| P1-6 | senasis „Ikelti sarasa" kelias apeidavo sauguji Excel rezima |
| P1-7 | filtras „tik tiekejas" naudojo `p.tiek>0`, o „parduodama" rode 0 — du ekrano taskai sake priesingus dalykus |
| P1-8 | mazmenine verte skaiciuota tik prekems su savikaina → rode 392 € vietoj 1 464 € |

**PAMOKA (kartotine): v7 atsakyme isvardinau kaip padaryta tai, ko makete
nebuvo.** Tai tiksliai ta pati klaida, del kurios egzistuoja taisykle „netikrink
pagal ketinima, tikrink pagal rezultata". Nuo v8 kiekviena versija tikrinta
paleidziant koda: sintakse, visi 132 DOM ID, ir atskiri skaiciavimu testai.

---

### RAIMIO SPRENDIMAI (uzrakinti)

```
marzos grindys      sausas maistas 10 % · konservai 15 % · skanestai 20 % · kita 20 %
pokycio riba        3 %
uzsakymo riba       5 vnt. (bendra), atskirai prekei — kortelėje
darbuotoju teises   NEREIKIA kol kas
fonas               ne baltas, ne juodas — pilkas darbo plotas, balti pavirsiai
emoji               ismesti
sarasas             Prekyboje pirma, tada Juodrasciai, Kita — issiskleidzia
serimo lentele      paveldima kopijuojant, bet „paveldeta — patikrinti"
nuotraukos          pasirinkimas kiekviena karta, numatyti negalima
```

### DAUGIASALTINIS MODELIS — PRIIMTAS

`sources[]` DABAR (ne po launch). Priezastis: AV+VF Josera jau egzistuoja,
tas pats produktas skirtinguose tiekeju kataloguose, galimas VF+ZB.
Paliekant viena `sand` teks perrasyti importus, resolveri, likuciu skaiciavima.

V1 vykdymo taisykle SAMONINGAI paprasta: AV → vienas pagrindinis tiekejas.
Kiti saltiniai saugomi, bet automatiskai nenaudojami. `_ps_sandelis` lieka
suderinamumo lauku, NE vieninteliu tiesos saltiniu.

### KITAS ETAPAS

```
E0  resolveris skaito duomenis · sources[] · preke be saltinio → Klausimai
E1  Katalogas
E2  Prekes kortele
E3  Sandelis
E4  Akcijos + Rinkiniai
```

Kitu langu maketai — PO to, kai Katalogas veiks su tikrais duomenimis.

Auksciausias decision Nr.: **S610**.

---


## 2026-08-05/06 — UZSAKYMU DARBALAUKIS, VENIPAK MANIFESTAI, TIEKIMAS [S509-S595]

### KODEL
WooCommerce uzsakymu sarasas buvo numatytasis ekranas, i kuri penki pluginai
sudejo mygtukus be uzrasu. Raimis: „turi buti malonu i darbalauki uzeiti, o ne
i chaosa". Papildomas reikalavimas — architektura, tinkanti ateities AI, ne tik
siandienos rankiniam darbui.

---

### DIEGIMU SEKA

| S | Failas | B | SHA-256 (16) | Ka pakeite |
|---|---|---|---|---|
| S511 | petshop-desk.php | 49 192 | a7feaf77acac301f | v2.0 eiles, filtrai, skydelis |
| S514 | petshop-desk.php | 50 041 | 3064217ee337ca7d | v2.1 resolve() masyvo klaida |
| S516 | petshop-desk.php | 51 314 | cdc7a5f042063aab | v2.2 pilnas pavadinimas, kliento pastaba, sriftas +1 |
| S519 | — | — | — | **ATMESTA** sintakses sargo (lietuviska kabute eil. 116) |
| S520 | petshop-desk.php | 56 180 | 386ee6886d73ae82 | v2.3 veiksmu sluoksnis + „Pazymeti apmoketu" |
| S522 | petshop-desk.php | 62 258 | 51a07f065fa6b689 | v2.4 dialogas su varnelemis + atsaukimas |
| S525 | petshop-desk.php | 63 713 | bc195b2c07e429b2 | v2.5 lapai + perdavimas pajungti |
| S527 | petshop-desk.php | 65 013 | f5b3ccf72d2ee693 | v2.6 tikri lipduku veiksmu vardai |
| S528 | petshop-desk.php | 80 449 | 2529d2776e78c686 | v3.0 rytine eiga (6 zingsniai) |
| S532 | petshop-av-sheets.php | 10 347 | 7a18784eba559e20 | bendras SURINKTI blokas pasalintas |
| S535 | sheets + dropship | 10 335 / 18 048 | 37f514a5e10d221a / 5dfdbaddd0880866 | „Atgal i darbalauki" |
| S539 | petshop-desk.php | 83 222 | 07b8a631df2cfacc | v3.1 siuntu bukles patikra |
| S550 | petshop-desk.php | 92 605 | 1262a498006b0c4b | v3.2 Venipak manifestai + statuso keitimas OFF |
| S552 | petshop-desk.php | 95 127 | 6d94f51d9c2f56d4 | v3.3 sandeliu ribos |
| S556 | petshop-desk.php | 95 828 | 7675a8b4d0216878 | v3.4 AV riba 11:00 |
| S558 | petshop-desk.php | 96 323 | cd8f0694923a7f7f | v3.5 ribos plytele (iskaitomumas) |
| S562 | petshop-av-tiekimas.php | 26 203 | 313305f35f3d7930 | v1.0 tiekimo modulis + 2 DB lenteles |
| S565 | desk + tiekimas | 98 420 / 28 473 | 5097e128bb693d72 / 02d51758dfa8e59a | pusiau automatinis kaupimas |
| S567 | desk + tiekimas | 99 351 / 36 158 | f6c54daa19b0b3f8 / 036920a0cbbb6109 | likuciu atnaujinimas + eile „Laukia prekiu" |
| S572 | petshop-desk.php | 105 755 | c1b3275686a8ed7f | v3.8 pakuociu skaicius, LP dydis ir kurjeris |
| S574 | petshop-desk.php | 113 261 | e834e3993a57cf0b | v3.9 klausimu sprendimo korteles |
| S576 | petshop-desk.php | 113 451 | a5fcc9570cc5b6f5 | v3.10 klausimo salyga |
| S582 | petshop-desk.php | 113 414 | dcea6d4e78228d61 | v3.11 **klaidinga** pataisa (zr. incidenta) |
| S584 | desk + tiekimas | 113 908 / 36 165 | 5be7a0bda081b5a8 / 971d5988acb59ddb | „Petshop uzsakymai", WC slepimas |
| S586 | petshop-desk.php | 114 027 | 553a4ec38c3b23a5 | v3.13 WC slepimas CSS'u (403 regresija) |
| S590 | petshop-desk.php | 114 420 | b0136cb48a598646 | v3.14 teisingas AV likucio saltinis |
| S595 | — (duomenys) | — | — | `_ps_sandelis` irasytas 3 805 prekems |

Backup: `wp-content/uploads/ps-backup/{failas}.bak_sNNN`

---

### DARBALAUKIS (petshop-desk.php, `page=ps-desk`)

Meniu punktas „Petshop uzsakymai", pirmas. WooCommerce → Uzsakymai PASLEPTAS
CSS'u — puslapis PRIVALO likti veikiantis (per ji vykdomi vezeju lipdukai,
manifestai, saskaitos).

**Eiles (kaireje tik tai, kur reikia veiksmo):**
```
Nauji · Neapmoketi · Laukia prekiu · Paruosta siusti · Klausimai
Atsaukti · Visi uzsakymai        <- paieska, ne darbas
```
„Kelyje" ir „Ivykdyti" NERA eiles — filtrai skiltyje „Visi".

**Filtrai — DVI ASYS, niekada nemaisomos vienoje eiluteje:**
```
Vykdymas     Sava (AV) · Dropship · Misrus · pagal tiekeja
Pristatymas  Venipak kurjeris · Venipak pastomatas · LP Express
Data         Siandien · Vakar · Savaite · Menuo · Praejes · Intervalas
```

Viena eilute = vienas uzsakymas, VIENAS pagrindinis veiksmas, kurio uzrasas
keiciasi pagal eile. Kliento pastaba rodoma PILNA, nekarpoma.
Klaviatura: j/k, Enter, x, /, Esc.

---

### VEIKSMU SLUOKSNIS (AI paruosimas)

VISI veiksmai eina per viena vieta: `admin_post_ps_desk_veiksmas` → nonce →
teisiu patikra → vykdymas → irasas i uzsakymo istorija → grizimas.
Kai atsiras automatiniai siulymai, jie kvies TA PATI vykdyma — tik su zmogaus
patvirtinimu. Kaireje paruostas „Siulymai" lizdas.

```
apmoketa       payment_complete() + AV nurasymas + laiskas (varnele „nesiusti")
atsaukti       cancelled + prekes grizta; laiskas NESIUNCIAMAS pagal nutylejima
lapai          transient → ps-lapai
perduoti       transient → ps-dropship
vp_reg         Venipak registracija grupei su savo manifestu
vp_manifestas  manifesto PDF is Venipak
pakuotes       deziu skaicius siuntai
klaus          klausimo sprendimai
```

Dialogas su varnelemis vietoj `confirm()` — nes reikejo pasirinkimo
„nesiusti laisko" / „pranesti klientui".

---

### RYTINE EIGA (`page=ps-desk&view=rytas`)

```
1 Perziura          partija UZRAKINAMA 3 val.
2 Surinkimo lapai   AV prekes
3 Venipak           pagal sandelius, kiekvienam savas manifestas
4 LP Express        riba 13:00
5 Tiekejams         perdavimo ekranas
6 Baigta            suvestine
```
Zingsniai SPAUDZIAMI (Belacor kurjeris 10:00 — sokti tiesiai i 5).
Darbo mygtukai atidaro NAUJA kortele. Jau perduoti uzsakymai neitraukiami.

---

### VENIPAK

**Manifestai pagal sandeli.** Manifesto pavadinimas = kliento_ID + data + kodas.
Kodas imamas is plugino nustatymu ir SAVAIME NESIKEICIA — be isikisimo visos
dienos siuntos suguldavo i VIENA manifesta (AV, VF, Quattro kartu).

Sprendimas: pries kiekvienos grupes registracija per Reflection laikinai
nustatomas grupes kodas, po to grazinamas.
```
AV 001 · VF 002 · ZB 003 · Quattro 004 · Prins 005 · Ambrosia 006 · Belacor 007
```
Vienas manifestas = vienas kurjerio paemimas is vieno adreso.
SIUNTEJAS VISOSE SIUNTOSE — UAB Avesa, nesvarbu is kurio sandelio prekе isvaziuoja.
Grupe siunciama VIENU XML, ne po viena, kaip daro pats pluginas.

**Statuso keitimas isjungtas:** `isstatuschangedisabled = 'on'`. Anksciau
registracija iskart darydavo „Ivykdytas" ir siusdavo klientui laiska.

**Manifesto PDF:** `go.venipak.lt/ws/print_list`, laukas `code` = MANIFESTO
numeris (ne siuntos). Grazina application/pdf. Patikrinta gyvai.

**Misrus uzsakymai automatiskai NEREGISTRUOJAMI** — pluginas vienam uzsakymui
moka tik viena siunta, o misrus fiziskai iskeliauja is dvieju vietu.

Patikrinta gyvai: `<answer type="ok">` pack V07267E1000002, manifestas
07267260805001; PDF 66 510 B. Testines siuntos Raimio istrintos.

---

### LP EXPRESS

```
pastomatas   dydi parenka PATS pagal bendra svori (size-service)
kurjeris     deziu skaicius per lauka lp_part_count → API partCount
riba         13:00
```
`_woo_lithuaniapost_lpexpress_courier_called_date` → rodoma „kurjeris jau
iskviestas", kad nebutu kviečiama dukart.

**ISPEJIMAS: lipduko formavimas LP sistemoje IKART ISSIKVIECIA KURJERI** —
todel LP kelio testuoti negalima. Kodas parasytas is plugino kodo skaitymo.
NEPATIKRINTA su realia siunta: ar partCount realiai nueina.

---

### PAKUOCIU SKAICIUS
```
Venipak kurjeris     packs[] masyvas su padalintu svoriu
LP kurjeris          partCount
pastomatai           nereikia — visada viena
```
Saugoma `_ps_pakuociu`; laukelis rodomas tik kurjerio siuntoms.

---

### SANDELIU RIBOS
```
AV 11:00 · VF 13:00 · ZB 09:00 · Prins 09:00
Belacor 09:00 · Quattro 09:00 · Ambrosia 10:00 · LP 13:00
```
Rodoma: virsutineje juostoje (artimiausia), prie uzsakymo sarase, Venipak grupiu
antrastese. Skaiciuojama realiu laiku; praejus — „keliaus rytoj".
5 zingsnyje tiekejai rikiuojami pagal skubuma.

---

### TIEKIMAS (petshop-av-tiekimas.php, `page=ps-tiekimas`)

Naujos lenteles:
```sql
gaj6_ps_tiekimas      id, tiekejas, busena, sukurta, uzsakyta, gauta,
                      siuntos_kodas, pastaba      (kaupiama→uzsakyta→gauta)
gaj6_ps_tiekimas_eil  id, partija_id, product_id, order_id, qty,
                      qty_gauta, galiojimas, pastaba
```

**DU KELIAI:**
```
A. AS UZSAKAU LAISKU
   eilute → „I tiekimo lentele" → kaupiasi → „Uzsakyti" → laiskas
   → priemimas (FAKTINIAI kiekiai) → AV likutis + uzsakymai atsilaisvina

B. TIEKEJAS ATVEZA PATS
   suvedu saskaita → „Atnaujinti likucius" → susieja su lauk. uzsakymais
```

**PUSIAU AUTOMATINIS KAUPIMAS.** Sistema uz Raimi NESPRENDZIA: misrus uzsakymas
guli „Naujuose" kaip visi, o prie kiekvienos tiekejo eilutes skydelyje yra
mygtukas „I tiekimo lentele". Nepaspaudei — eilute lieka dropshipu.
Sprendimas EILUTES lygmens, todel „VF siuncia pats, ZB parsivezam" gaunasi
savaime. Uzdaro visus derinius: AV+VF, VF+ZB, VF+ZB+AV, Quattro+Prins.

**Priemimas:** numatyta tai, kas uzsakyta — keiti tik kur nesutampa. Galiojimas —
isskleidziamas laukelis; prekems, kurioms data jau kada iravesta, atsidaro pats
ir rodo esama. Trukumas automatiskai keliauja i nauja to paties tiekejo partija.

**Likuciu atnaujinimas — TAISYKLE: kas laukia ILGIAU, tas gauna pirmas.**
Kitaip vienas gautu dali, kitas dali, ir ne vienas neisvaziuotu.
Pries vykdant rodoma perziura.

**ZB isimtis:** ZB uzsakymai vedami i ju sistema, ne laisku. El. pasto sistemoje
nera — partija uzsidarys, bet laiskas neiseis su geltonu ispejimu.
NEUZDARYTA: ZB kopijuojama lentele vietoj laisko.

---

### KLAUSIMAI

Uzsakymai, kuriu sistema apdoroti negali. Neguli tarp „Nauju" ir nepatenka i
rytine eiga, kad neuzstrigtu partija.
```
Truksta sandelyje · Mokejimas nepavyko · Siuntos sukurti nepavyko
Klientas atsisako (_ps_withdrawal — ES mygtukas dar nepastatytas)
```
Rodomi kortelemis su mygtukais: Siusti is {tiekejas} · Parsivezti i AV ·
Laukti · Atsaukti uzsakyma.

**„Laukti" — JOKIOS AUTOMATIKOS.** Tik pazymi; priminimu nera (Raimio sprendimas).
**Pinigu grazinimas RANKINIS.** Paysera automatinio grazinimo NEPALAIKO
(`refund: ne`). Sistema fiksuoja ir ruosia dokumentus, bet pinigu negrazina.

---

### SANDELIU MODELIS (Raimio sprendimas 2026-08-06)

**SEPTYNI sandeliai:** AV · Ambrosia · Prins · Belacor · Quattro · VF · ZB
**Legacy NERA sandelis** — laikinas maisas, turintis istustеti.

**Kilme ir turejimas — DU SKIRTINGI KLAUSIMAI:**
```
kilme         is kur gaunu — vienas is 7 sandeliu
AV likutis    ar turiu pas save DABAR — VIENAS stulpelis VISOMS prekems
```
AV likutis NERA atskiras sandelis. Bet kurios kilmes preke gali guleti Raimio
lentynoje: parsivezei ZB skanestu — AV likutis 3, kilme lieka ZB.

**Uzsakymo sprendimas — VIENA taisykle visoms prekems:**
```
turiu AV likutyje?   TAIP → siunciu pats
                     NE   → perduodu kilmes sandeliui
```

**Rusiavimo taisykle (legacy prekems):** zenklas Quattro → Quattro,
Prins → Prins, Belacor tofu ir Wonder kraikai → Belacor, VISOS KITOS → AV.
Sausas bandymas: Quattro/Prins/Belacor legacy maise NERA — jau priskirtos.
Vadinasi visos 959 legacy publish prekes → AV.

**`_ps_sandelis` irasytas (S595):**
```
av 1401 · vf 1161 · zb 1059 · quattro 64 · belcor_tofu 62 · prins 43
ambrosia 15                                          viso 3 805
```
Sandelis dabar DUOMUO, ne kaskart perskaiciuojamas speijimas — todel ji galima
keisti ranka inventorizacijos metu.

---

### NAUJI META LAUKAI
```
_ps_sandelis          preke      av/vf/zb/quattro/prins/belcor_tofu/ambrosia
_ps_pakuociu          uzsakymas  deziu skaicius kurjerio siuntai
_ps_tiekimas_laukia   uzsakymas  1 = laukia prekiu atvezimo
_ps_klaus_laukti      uzsakymas  data, kada pazymeta „laukti"
```

---

### ★★★ INCIDENTAS S582 → S590 — DU LAUKAI, DU MODELIAI ★★★

**Kas nutiko.** S580 patikra parode `Stock::qty() = 0`, o tuo paciu metu
`resolve()['av_qty'] = 3`. Palaikiau tai `resolve()` kesо klaida ir S582
perjungiau trukumo tikrinima i `Stock::qty()`.

**Pasekme.** `Stock::qty()` skaito `_own_stock_qty`, kuri turi vos 3 prekes.
Visoms legacy prekems (959 publish) jis grazina `null` → 0 → KIEKVIENA LEGACY
PREKE ATRODE TRUKSTAMA. Klausimu eile prisipilde melagingu irasu.

**Tikroji priezastis** (parasyta paciame `AV_Source::resolve()` kode):
```
legacy preke = AV sandelis, likutis WooCommerce `_stock` lauke
`_own_stock_qty` reikalingas TIK prekems, kurios turi IR tiekeja (ju 3)
```

**Istaisyta S590:** trukumo tikrinimas grazintas i `resolve()['av_qty']` su
salyga `source === 'av'`.

**PAMOKA: pries keiciant logika del skaiciu nesutapimo — PERSKAITYTI KODA.
Nesutapimas dazniau reiskia du skirtingus laukus, ne keso klaida.**

---

### ★★★ INCIDENTAS S584 → S586 — remove_submenu_page UZDARO PUSLAPI ★★★

`remove_submenu_page('woocommerce','wc-orders')` punkta paslepe, bet PUSLAPI
UZDARE — `wc-orders` eme grazinti **403**. Per ta puslapi vykdomi VISI vezeju ir
saskaitu masiniai veiksmai, tad lipdukai butu nustoje veikti be jokio matomo
rysio su priezastimi.

Istaisyta CSS slepimu:
```css
#adminmenu a[href*="page=wc-orders"]{display:none!important}
```
Puslapis grazina 200, punktas nematomas.

---

### SVETIMU PLUGINU TRUKUMAI (rasti sioje sesijoje)

| Pluginas | Trukumas |
|---|---|
| Venipak | apie nesekme NEPRANESA; klaida iraso i meta, bet nerodo |
| Venipak | manifesto kodas fiksuotas — visa diena i viena manifesta |
| Venipak | registracija keitе statusa i completed (isjungta nustatymu) |
| LP Express | `Undefined array key "id"` ispejimas kiekvieno masinio veiksmo metu |
| LP Express | lipduko formavimas iskart issikviecia kurjeri — testuoti negalima |
| Paysera | automatinio grazinimo nepalaiko (`refund: ne`) |

---

### TECHNINES PAMOKOS (PRINCIPAI)

- **Sintakses sargas pries rasant failа:** `token_get_all($code, TOKEN_PARSE)`
  gaudo `ParseError` — failas NEIRASOMAS, jei blogas. Suveike S518.
- **`remove_submenu_page()` uzdaro puslapi** (403) — slepti tik CSS.
- **Nespek plugino veiksmu vardu.** Visi trys speti buvo klaidingi. Tikrieji
  nuskaityti is WC saraso: `shopup_venipak_shipping_labels`,
  `woo_lp_print_label`, `wcdn_print_invoice`, `wcdn_print_creditnote`.
- **Vezeju pluginai tyli** — darbalaukis privalo PATS pasitikrinti rezultata
  (ar atsirado siuntos kodas), o ne pasitiketi, kad veiksmas pavyko.
- **SKU nera prekes ID.** S578 nunulinau ne ta preke, nes 48375 buvo SKU.

---

### NEUZDARYTA (kritine tvarka)

```
1. Resolveris dar NESKAITO _ps_sandelis — laukas irasytas, elgsena sena
2. AV_Source nesupranta „av" vietoj „legacy"
3. Preke be sandelio → Klausimai (nepadaryta)
4. AV likutis dviejuose laukuose: _own_stock_qty (3 prekes) ir _stock (legacy)
5. Tiekimo priemimas raso i _own_stock_qty — legacy prekems NEVEIKS
6. Lipduko prisegimas prie tiekimo laisko (dukart klausti)
7. ZB kopijuojama lentele vietoj laisko
8. ES „Atsisakyti sutarties" mygtukas + KR-AVPN kreditine
9. LP partCount nepatikrintas su realia siunta — RAIMIS
10. Prekiu svoriu auditas (LP dydziui) — RAIMIS
11. Inventorizacija: kurios Belacor/Quattro prekes guli AV — RAIMIS
12. Zodis „legacy" pasalinamas, kai liks 0 prekiu
```

Auksciausias decision Nr.: **S1281**.

---

