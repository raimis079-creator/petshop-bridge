# DEPLOYMENT LOG PAPILDYMAS — S1535–S1542 (2026-08-31)

Papildo deployment_log_v1_9_11.md ir S1532–S1534 papildymą. Sesija: el. laiškų
pataisos → naujienlaiškių strategija A→Z (užrakinta TŽ v1.91) → istorijos
sluoksnis → paskyrų importas. Strategijos sprendimai — TŽ v1.91, čia tik technika.

---

## S1535. PORAŠTĖS NAUJIENLAIŠKIO FORMA NEVEIKĖ — class-newsletter-footer.php v1.1 ✅

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

## S1536. consent-changed.php v2.0 — ANT BENDRO KARKASO (buvo be logo) ✅

Iš 20 šablonų 4 nenaudojo `Petshop_Email_Layout`: consent-changed, order-paid,
dunning-1, founding. consent-changed (6ecef17d…) → v2.0 (d3a61a9d…):
`Petshop_Email_Layout::wrap()` (logo att. 3257, footeris pagal flow_class),
tas pats tekstas, „Pakeitimo įrašas" blokas, mygtukas, muted eilutė. Šaltinių
žemėlapyje pridėta `footer_form`/`newsletter_form`/`unsubscribe_link` → eilutė
„Užfiksuota: naujienlaiškio formoje" (anksčiau tyliai dingdavo). Render-testas
abiem variantais žalias; testinis job #109 į terra@ išsiųstas su logo.
**Liko:** order-paid.php (transactional!), dunning-1.php, founding.php.

## S1537. ISTORIJOS SLUOKSNIS — ps_ist_uzsakymai + ps_ist_eilutes ✅

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

## S1538. KREIPINYS — petshop-kreipinys.php v1.0 (naujas mu-plugin) ✅

Raimis: „Sveiki, Martynai", ne „Martynas". `ps_vardas_svarus()` (pirmas žodis,
tik raidės, 2–14 simb.), `ps_kreipinys()` (-ius/-us→-au, -as→-ai, -is/-ys→-i/-y,
-ė→-e, kita nekeičiama), `ps_sveiki()`. Testas 25 vardų + 964 unikalių iš
istorijos (top-60 rankiniu žvilgsniu). consent-changed → v2.1 (dcf14503…) naudoja
`ps_sveiki()`; render „Sveiki, Martynai, nuo šiol…". Žinoma: „Ieva-Marija" →
„Ieva-marija" (v1.1). Pastaba: post-purchase-2d.php komentaras „automatinis
linksniavimas nepatikimas" — sprendimas dabar priešingas, tą šabloną derinti.

## S1539. PASKYRŲ IMPORTAS — 5 666 TYLIAI ✅

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

## S1540. Josera SUSIEJIMAS PAGAL PAVADINIMĄ + RANKINIS ✅

Raimis: Josera pakeitė pakuotes → nauji SKU. WC turi 210 Josera prekių.
(1) Pavadinimu (jos_apply.json): normalizacija (lower, entity decode, tarpai
prie skyryklių) → 199 grupių / 2 661 eil. / 71,5 k€, `susiejimas='pavadinimas'`
(7 → draft prekės). (2) Rankinis (jos_rank.json): JOS0158→18112, JOS0724→18018,
JOS0069→18032, JOS00060→18000, JOS0218→18022 — 235 eil., `'rankinis'`.
**Po:** 96,5 % pajamų susieta (buvo 72,9); liko 589 eil. / 11,7 k€ nebeparduodama.

## S1541. BREVO → SENDER PRIVATUMO POLITIKOJE ✅

Recon (brevo_recon.json): visa DB + failai — tik #34525 publish ir #34526 draft
(slapuku-politika-old); Complianz lentelėse, postmeta 0; wp_mail_smtp option
(tuščias plugino raktas) ir `interface-message-provider.php` komentaras — neliesta.
APPLY: #34525 `„Brevo" (Sendinblue)` → `„Sender" (sender.net)` (preg, kabutės
išsaugotos); #34526 str_replace. Backup `ps_bak_brevo_{ID}`. Cache pluginų nėra.

## S1542. DOKUMENTAI + ĮRANKIAI ✅

TŽ MASTER v1.90 → **v1.91** (4 Papildyta paragrafai + versijų lentelės eilutė
v1.91; lentelė nepildyta nuo v1.79 — užfiksuota). Bridge `irankiai/run.sh` +
`mjs_template.mjs` atnaujinti su DATA žingsniu (žr. pamoką 26).

---

## TECHNINĖS PAMOKOS (tęsiama po #23)

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

## NAUJI/PAKEISTI FAILAI

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

## KITAS LANGAS — EILĖS TVARKA

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

# TĘSINYS TOJE PAČIOJE SESIJOJE — S1543–S1546 (2026-08-31, vakaras)

## S1543. KLIENTAI EKRANAS — petshop-klientai.php v1.0 (naujas mu-plugin) ✅

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

## S1544. MENIU PERTVARKA — „Petshop klientai" viršutinė šaka ✅ (v1.1)

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

## S1545. ESAMŲ ATASKAITŲ RECON — „Petshop analitika" ŠAKOS NEBUS ✅

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

## S1546. ★ ANALITIKOS ARCHITEKTŪRA — RAIMIO SPRENDIMAI (visi patvirtinti) ✅

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

## KITAS LANGAS (perrašo ankstesnę eilę)

1. Istorijos adapteris + jungiklis [eShoprent|petshop.lt|Abu] į Klientų/Prekių/
   Atsargų analizes; ps_dim_klientai su istorija; segmentų suvienodinimas (B1).
2. „Tikėtini užsakymai" skirtukas Atsargose (klientų ciklai per prekę).
3. Suppression release prie gyvo opt-in; order-paid/dunning-1/founding karkasas.
4. Raimis: refill terminas klientui · K-NL2.

Aukščiausias decision Nr.: **S1546**. TEMP snippetai išvalyti per SQL (606,
pamoka: Code Snippets DELETE per DB veikia, REST — ne); liko tik paskutinio
runo neaktyvus. Nauji failai: mu-plugins/petshop-klientai.php v1.1
(babf03d4…), DB gaj6_ps_kl_suvestine (5 700).
