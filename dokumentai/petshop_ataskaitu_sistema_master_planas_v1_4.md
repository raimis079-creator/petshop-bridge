# PETSHOP ATASKAITŲ SISTEMA — MASTER PLANAS v1.4
2026-08-26 (v1.4 — E1a ✅ uždarytas 3 realiais užsakymais; sprendimas B `kaina_reguliari_ct`; `diena` DATE; §3 taisyklė 11 laiko zona; radinys #23 PVM vienetuose) · ankstesnės: v1.3 2026-08-26, v1.2 2026-08-25 · Autorius: Claude (planas) · Vykdytojas: Opus (kodas) · Kontrolė: Claude · Sprendimai: Raimis
Horizontas: 5 metai. Statusas: PLANAS v1.4 — **PATVIRTINTAS**. E0 ✅ · E1a ✅. Opus pradeda **E1b**.

---

## 0A. KAS PASIKEITĖ v1.2 → v1.3 (2026-08-26)

Pagrindas: **E0 Recon v1.1** (`dokumentai/ataskaitu_recon_v1.md`, commit `a247d81`) — 5 tilto runai, 137 failai, 0 spėjimų. Raimio sprendimai Q-E0-1…7 (2026-08-26).

### Raimio sprendimai — UŽRAKINTA

| # | Sprendimas | Kur įrašyta |
|---|---|---|
| **Q-E0-1** | `do_action('petshop_siunta_sukurta', …)` → `petshop-siuntu-laiskai.php:77`. **`petshop-desk.php` neliečiamas.** Papildomai: naktinis cron sutikrina `ps_shipments` su faktais — darbalaukį aplenkusios siuntos gauna faktą su `sandelis=NULL`, ne prarandamos | §4.3, §7 E1b |
| **Q-E0-2** | `ps_fakt_siuntos` — **atskira** lentelė su `shipment_id` nuoroda į `ps_shipments` | §4.3 |
| **Q-E0-3** | `petshop-pardavimai.php` **paliekamas kaip yra** (Katalogo eilėms). 5.4/5.5 ekranai (E5) statomi iš faktų; jo meta — **tik kontrolinis palyginimas**. Dabar neliesti | §1, §5.4, §5.5 |
| **Q-E0-4** | **Nei rašymo momentu, nei ekrane — WC jau saugo atskirai.** Užsakymo eilutė turi `line_total` (be PVM) ir `line_tax`. Faktas kopijuoja **abu**: `kaina_ct` (be PVM) + `pvm_ct`. **Neto iš bruto per tarifą niekada neskaičiuojama** | §3 taisyklė 3, §4.1, §4.2 |
| **Q-E0-5** | Email atributacija — per **UTM laiškų nuorodose** (`utm_medium=email&utm_campaign={flow}`) → §4.7 pagauna kaip paskutinį prisilietimą. `sent_at` tik atsarginis. **Kontrakto keisti nereikia** | §4.7, §5.9 |
| **Q-E0-7** | T-0 sąrašas papildomas testinių duomenų valymu. Plius E1b pridedamas `perskaiciuoti($nuo, $iki)` — agregatų persukimas **bet kuriam intervalui**, ne tik 3 d. | §4.9, §7 E1b |

Q-E0-6 (papildomas recon runas) — uždarytas runu #4949.

### §15 recon keitimai 1–21 — PRIIMTI VISI

| # | Keitimas | Sekcija |
|---|---|---|
| 1 | Q7 nereikalingas; kabliukas į siuntu-laiskai:77 | §4.3, §7 |
| 2 | `ps_fakt_siuntos` — atskira lentelė | §4.3 |
| 3 | §4A.3 krepšelio piltuvėlis — iš `ps_carts`, ne rinkti iš naujo | §4A.3 |
| 4 | `petshop-pardavimai.php` į §1 inventorių; 5.4/5.5 — ekranai ant faktų | §1, §5.4, §5.5 |
| 5 | §3 taisyklė 5 — informacinė (`petshop-innodb.php` jau daro) | §3 |
| 6 | PVM — `line_total` + `line_tax` kopijavimas (Q-E0-4) | §3, §4.1, §4.2 |
| 7 | 17 statusų, iš jų 9 LP Express — imti Desk `STATUSAI` žemėlapį | §4.1, §5.x |
| 8 | Savikaina kopijuojama iš `_ps_savikaina_vnt`, neperskaičiuojama | §4.2 |
| 9 | §4.2 perima `agregavimas::pardavimai()` MNM/DP išpjaustymą | §4.2 |
| 10 | `payment_complete` prioritetas **≥35** | §7 taisyklė 4 |
| 11 | Email atributacija per UTM (Q-E0-5 pakeitė pradinį siūlymą) | §4.7, §5.9 |
| 12 | §5.6 promotion uplift — šaltinis `ps_akcijos`+`ps_akciju_prekes`, naujų faktų nereikia | §5.6 |
| 13 | §5.7 sell-through — šaltinis `ps_tiekimas`+`ps_tiekimas_eil` | §5.7 |
| 14 | Įspėjimas dėl trijų panašių vardų | §4.3 |
| 15 | §1 versijos atnaujintos | §1 |
| 16 | `saltinis_aplinka` per `Petshop_Statistika::aplinka()` | §3 taisyklė 4 |
| 17 | §3 taisyklė 9 formuluotė patikslinta | §3 |
| 18 | `ps_stat_pvm` / `ps_stat_pradzia` T-0 patvirtinti | §4.9 |
| 19 | T-0: išvalyti `ps_shipments`, `ps_carts`, `ps_ataskaitu_dienos` | §4.9 |
| 20 | `perskaiciuoti($nuo,$iki)` vietoj tik `PERSUKTI=3` | §7 E1b |
| 21 | `vezejas` reikšmės užrakintos: `venipak` / `lp_express` | §4.3 |

### 🔴 NAUJA v1.3 — radinys #22, atsiradęs iš Q-E0-4

**`ps_ataskaitu_dienos` KPI „dalis apyvartoje" turi vienetų nesutapimą (S842 tipo klaida).**

```
agregavimas:291   parduotuve/pajamos   = $ord->get_total()   → SU PVM + pristatymu
agregavimas:314   pardavimai/parduota  = $it->get_total()    → BE PVM, be pristatymo
```

Skaitiklis be PVM dalinamas iš vardiklio su PVM ir pristatymu → **„dalis apyvartoje" nuvertinta ~21 % + pristatymo dalimi**. Dev'e: `parduotuve/pajamos` 78 151 ct (21 užsakymas), `pardavimai/parduota` 9 624 ct.

**Sprendimas (pagal Q-E0-4 principą):** §4.1 laikoma **abu** — `prekiu_suma_ct` (be PVM, Σ `line_total`) ir `pvm_ct` (Σ `line_tax`), atskirai `pristatymas_paimta_ct`. Visi §5.x santykiai skaičiuojami **tarp be-PVM dydžių**. Esamas `ps_ataskaitu_dienos` nekeičiamas (istorija), bet §5.2 ekranas vardiklį ima iš §4.1 `prekiu_suma_ct`, ne iš `parduotuve/pajamos`.

### Kas NEPASIKEITĖ

- §0 dviejų sluoksnių prioritetas, §2 metrikų pasirinkimas, §5 ataskaitų katalogas, §6 žodynas, §9 „ko nedarom" — be pakeitimų.
- §4.5, §4.8 — be pakeitimų.
- Etapų eilė E1a → E1b → E2 → E2b → E3 → E4 → T-0 → E5 → E6 → E7 — be pakeitimų.

---

## 0B. KAS PASIKEITĖ v1.3 → v1.4 (2026-08-26)

Pagrindas: **E1a įvykdytas ir uždarytas** (3 realūs dev užsakymai). Raimio sprendimai 2026-08-26 vakaras.

### Raimio sprendimai

| # | Sprendimas | Kur |
|---|---|---|
| **Sprendimas B** | `kaina_reguliari_ct` = prekės **`_regular_price` pardavimo momentu** (variacijai — variacijos, MnM vaikui — vaiko prekės). Kaina prieš kuponą — **išvestinė** (`kaina_ct + nuolaida_ct`). Tuščia reguliari → **NULL, ne 0** | §4.2 |
| **`diena` DATE** | Vilniaus **verslo diena**, išvesta iš `apmoketa_at` (UTC). Abiejose faktų lentelėse | §3 taisyklė 11, §4.1, §4.2 |
| **Laiko zona** | Visi `*_at` — **UTC**. Ekrane rodoma Vilniaus laiku | §3 taisyklė 11 |
| **Fee** | Kontrakto **nekeičiam**. Kai bus F22 lojalumas — patikrinti, ar nuolaidos eilutė nėra neigiamas fee, ir tada spręsti `kitos_rinkliavos_ct`. Ne dabar | §4.9 |
| **E1b DoD** | Papildomas grąžinimu ant 35090 (nuolaidinė eilutė) | §7 |

### 🔴 NAUJA v1.4 — radinys #23, brolis radiniui #22

Įgyvendinus sprendimą B pirmuoju bandymu, `kaina_reguliari_ct` buvo užpildytas **neapdorotu `_regular_price`**. Migracijos DRY parodė:

```
Animonda GranCarno   kaina_vnt_ct  182 (BE PVM)   kaina_reguliari_ct  220
Monge BWild Kitten   kaina_vnt_ct 1495 (BE PVM)   kaina_reguliari_ct 1809
AMBROSIA             prieš kuponą 4958 (BE PVM)   kaina_reguliari_ct 5999
```
Visais atvejais santykis lygiai **1,21** — tai ne akcija, o **PVM**. `woocommerce_prices_include_tax=yes`, todėl `_regular_price` DB saugoma **su PVM**, o `kaina_ct` yra **be PVM**. Du gretimi stulpeliai būtų buvę skirtingais vienetais — tiksliai ta klaidų šeima, kurią draudžia §3 taisyklė 10 ir radinys #22.

**Sprendimas:** `wc_get_price_excluding_tax( $product, ['price' => $regular] )` — WC pritaiko prekės **mokesčių klasę**, o ne dalybą iš 1,21 (klasės gali skirtis).

**Rezultatas po pataisos:** visose 17 įprastų eilučių `kaina_reguliari_ct` = kaina prieš kuponą, skirtumas **0** (nė viena prekė nebuvo akcijoje). MnM konteineris 1091, dovana 107 — abu neto katalogo vertės.

**Pamoka į §7 taisyklę 11:** vienetų patikra taikoma **ne tik KPI, bet ir kiekvienam naujam stulpeliui**, kuris stovi šalia pinigų lauko.

---

## 0. VIENA MINTIS

> Ataskaitą galima perdaryti bet kada. Fakto, kurio niekas neužfiksavo, nebus niekada.

Todėl planas turi DU sluoksnius, kurių prioritetas skirtingas:

| Sluoksnis | Kas | Kada | Ar gali slysti |
|---|---|---|---|
| **A. Faktų surinkimas** | nekintančios pardavimo/siuntos/atsargų/kliento/kanalo faktų lentelės, pildomos nuo pirmo realaus užsakymo | **iki launch (10-01)** | NE |
| **B. Ataskaitų ekranai** | kas rodoma, kaip pjaustoma | po launch, iteracijomis | TAIP |

Visa ekranų logika perdaroma iš faktų per dieną. Faktai, užfiksuoti pardavimo momentu (savikaina, kategorija, tiekėjas, kanalas, ar klientas naujas), po metų nebeatkuriami — WooCommerce jų nesaugo, meta keičiasi, prekės trinamos.

---

## 1. KAS JAU YRA — INVENTORIUS IR VERDIKTAS

| Modulis | Ver. | Ką daro | Verdiktas |
|---|---|---|---|
| `petshop-ataskaitos-ui.php` | 1.0 | bendras karkasas: laikotarpis + palyginimas, KPI su delta, SVG diagrama, lentelė su rikiavimu/CSV, skirtukai | **PAGRINDAS — plečiam, ne keičiam** |
| `petshop-statistika.php` | **2.2** | `ps_ataskaitu_dienos` (sritys: laukai, pardavimai, parduotuve, piltuvelis, anketa, rec, refill), du sutikimo sluoksniai, valymo izoliacija | **PAGRINDAS — pridedam sritis** |
| `petshop-ataskaitu-agregavimas.php` | 1.0 | cron 03:15, idempotentinis dienos agregavimas + šiandienos sluoksnis | **PAGRINDAS — pridedam agregatorius** |
| `petshop-ataskaitu-eksportas.php` | 1.0 | savas XLSX (ZipArchive), „Žali duomenys“ lapas | **PAGRINDAS — kiekviena nauja ataskaita gauna eksportą** |
| `petshop-rinkiniu-ataskaita.php` | 2.0 | surenkami rinkiniai, 11 sekcijų | palikti; įtraukti į bendrą KPI |
| `petshop-paruostu-ataskaita.php` | 1.0 | kanibalizacija, DP pakopos | palikti; E6 DoD dar neįvykdytas |
| `petshop-anketos-ataskaita.php` | 2.3 | 6 skiltys (piltuvėlis, rec, paklausa, kokybė, refill, pinigai) | palikti |
| `class-admin-reports.php` | — | meniu TĖVAS „Petshop ataskaitos“ (`PARENT='petshop-reports'`, 110 eil.), pradžios ekranas su kortelėmis | **tampa HUB'u** (§5.0) |
| `petshop-pardavimai.php` | 1.0 | **v1.3 NAUJAS ĮRAŠAS.** ABC (80/95), 30/90/365 d. pardavimai, marža, dienos atsargai — iš `wc_order_product_lookup`+`wc_order_stats` į prekės meta `_ps_sales_*`/`_ps_abc`; cron 04:50 | **Q-E0-3: PALIKTI KAIP YRA.** Aptarnauja Katalogo eiles. 5.4/5.5 statomi iš faktų; jo meta — tik kontrolinis palyginimas. **Neliesti** |
| `petshop-innodb.php` | 1.0 | **v1.3 NAUJAS ĮRAŠAS.** `add_filter('query')` prideda `ENGINE=InnoDB` kiekvienam `CREATE TABLE` | §3 taisyklė 5 jau įgyvendinta |
| `petshop-statistika-vitrina.php` | 1.0 | **v1.3 NAUJAS ĮRAŠAS.** Vitrinos statistika (331 eil.) | palikti |
| `petshop-desk.php` | **3.47 (H265)** | užsakymų darbalaukis | **NELIEČIAMAS** (Q-E0-1) |
| `petshop-akcijos.php` | **1.8** | akcijos, `ps_akcijos`+`ps_akciju_prekes` su `reg_kaina`/`akc_kaina`/`nuo`/`iki` | §5.6 uplift šaltinis — naujų faktų nereikia |
| `core/class-shipments.php` | 0.20.0 | `ps_shipments`: `order_id, carrier, tracking_number, notified_at`. **Sandėlio SĄMONINGAI nesaugo** (:14–16) | ≠ `ps_fakt_siuntos` (Q-E0-2) |
| `core/class-cart-tracker.php` | — | `ps_carts`: `converted_order_id`, `status`, `snapshot_json` | §4A.3 piltuvėlio šaltinis |
| Katalogo kokybė (S993), pilnumas, judėjimas, geriausia iki | — | gyvena Kataloge, ne Ataskaitose | rodyti kaip kortelę HUB'e (nuoroda), neperkelti |
| `ps_email_jobs`, `ps_event_log` | — | email dispatch, 13 eventų | šaltinis Retencijos ataskaitai |
| `ps_partijos`, `_own_stock_qty`, `_stock` | — | AV partijos, likučiai | šaltinis Atsargų faktams |
| TŽ v1.47 šviesoforo dashboard (6 blokai) | spec | North Star, eventų sveikata, srautai, reputacija, stop rules, pajamos | **SPEC YRA, KODO NĖRA** — įgyvendinam §5.1 |
| TŽ v1.50 po-launch SEO šviesoforas | spec | 404/d, top redirect, indeksacija, GSC clicks, blog | kodo nėra — §5.1 |
| TŽ v1.39 serverio pusės purchase | reikalavimas | Woo užsakymai = GA4 purchase ±2 % | matuojama §5.6 |

**Ko NĖRA (esminės spragos):**
1. Pardavimų faktų lentelės eilutės lygiu su užšaldyta savikaina/šaltiniu/kanalu — yra tik dienos agregatas srityje `pardavimai`.
2. Klientų analitikos — kohortos, pakartotinis pirkimas, LTV, RFM. Nieko.
3. Atsargų istorijos — likutis šiandien žinomas, vakar — ne. Apyvartumo, stock-out'ų, „kiek dienų atsargų“ suskaičiuoti neįmanoma.
4. Kanalo/atributacijos užsakyme — UTM/referer neužfiksuojamas serverio pusėje; North Star („ne-mokamų pajamų dalis“) nematuojamas. **E0 patvirtino grep'u: `utm_` — 0 rezultatų iš 137 failų.**
5. Logistikos faktų — order→shipped→delivered laikai per sandėlį/vežėją, pristatymo savikaina vs paimta iš kliento.
6. Kontribucijos maržos — marža po pristatymo, Paysera, pakuotės, taškų, dovanų savikainos. Dabar tik bruto marža rinkiniuose.
7. Mėnesio uždarymo buhalterijai — PVM pjūvis, mokėjimo būdai, grąžinimai, tiekėjų savikainos suma.
8. Kainų istorijos — kainos keičiasi (ZB/VF importai), pasekmių pardavimams sekti negalima. **E0: `woocommerce_product_object_updated_props` — 0 kabliukų; `woocommerce_order_refunded` — 0 kabliukų.**
9. **🔴 v1.3 NAUJA (radinys #22).** `ps_ataskaitu_dienos` KPI „dalis apyvartoje“ dalina be-PVM skaitiklį (agregavimas:314 `$it->get_total()`) iš su-PVM+pristatymu vardiklio (agregavimas:291 `$ord->get_total()`) — rezultatas nuvertintas ~21 %+. Žr. §0A.

---

## 2. KĄ MATUOJA GERIAUSI — IR KAS MUMS TINKA

Šaltiniai: Shopify Analytics, Amazon Seller Central, Metorik/Glew (Woo), zooplus/Chewy investuotojų ataskaitos (retencijos metrikos), Byron Sharp (mental availability), TŽ §4 doktrina.

| Praktika | Kas | Mums | Kodėl |
|---|---|---|---|
| **Contribution margin per order**, ne ROAS | marža po VISŲ kintamųjų sąnaudų | **TAIP, P0** | dropship + 9 € small-cart fee + Venipak — užsakymas gali būti nuostolingas nors marža 45 % |
| **Cohort retention** (mėnuo pirmo pirkimo → % grįžusių per 30/60/90/180/365 d.) | Chewy/zooplus pagrindinė metrika | **TAIP, P0** | maistas = periodinis pirkimas; refill variklis be to aklas |
| **New vs returning revenue split** | kiekviena pardavimo ataskaita padalinta | **TAIP, P0** | TŽ Ads „new customer goal“, Direct LTV 5× |
| **POAS per channel** (Profit on Ad Spend) | pelnas / spend, ne pajamos / spend | TAIP, P1 | PMax ROAS 4,3 buvo žemiau lūžio 5–6,7 |
| **ABC/XYZ** prekių klasifikacija | A=80 % pajamų; X=stabili paklausa | TAIP, P1 | 2 232 prekės, AV pirkimo sprendimai |
| **Inventory days / turnover / stock-out lost sales** | Amazon „days of supply“ | TAIP, P1 (AV) | partijos, geriausia iki jau yra — trūksta istorijos |
| **Sell-through rate** per tiekėją | parduota / gauta per periodą | TAIP, P1 | tiekimo modulis jau turi gavimus |
| **Refund/return rate** per prekę/tiekėją | | TAIP, P1 | dropship kokybės signalas |
| **Promotion uplift vs baseline** | akcijos efektas, ne tik pardavimai akcijos metu | TAIP, P1 | akcijų modulis yra, efektas nematuojamas |
| **Email revenue attribution** (paskutinis paspaudimas 5 d.) | Klaviyo standartas | TAIP, P1 | Sender rodo tik email pusę |
| **Subscription MRR / churn / dunning** | | P2 (kai bus prenumerata) | |
| **Search terms with zero results** | Shopify/Algolia | P2 | pigus, vertingas |
| **Price elasticity / testai** | | P2 | reikia ≥6 mėn. istorijos |
| **Forecast (prekė×savaitė)** | | P2 | reikia ≥12 mėn. |
| Real-time dashboard | Shopify Live View | **NE** | 5–20 užsakymų/d — beprasmis, brangus |
| BI įrankis (Metabase/Looker) | | **NE dabar** | XLSX „Žali duomenys“ + pivot dengia; faktų lentelės suprojektuotos taip, kad Metabase prijungtų per 1 d., kai prireiks |

---

## 3. ARCHITEKTŪRA — TRYS SLUOKSNIAI

```
 WooCommerce / Desk / Tiekimas / Vitrina / Anketa / Email
           │  hook'ai (rašo TIK kartą, faktą UŽŠALDO)
           ▼
 ┌───────────────────────────── FAKTAI (append-only, amžini) ──────────┐
 │ ps_fakt_uzsakymai · ps_fakt_eilutes · ps_fakt_siuntos                │
 │ ps_fakt_grazinimai · ps_fakt_atsargos_d · ps_fakt_kainos             │
 │ ps_fakt_kanalai (sesija→užsakymas)                                   │
 └──────────────────────────────────────────────────────────────────────┘
           │  cron 03:15 (esamas agregatorius) + šiandienos sluoksnis
           ▼
 ┌────────────────── AGREGATAI (ps_ataskaitu_dienos, sritys) ──────────┐
 │ + ps_dim_klientai (kliento būsena: pirmas pirkimas, N, LTV, RFM)     │
 └──────────────────────────────────────────────────────────────────────┘
           │  Petshop_Ataskaitu_UI (esamas karkasas)
           ▼
 ┌───────────────── EKRANAI (HUB → 9 ataskaitos) + XLSX ───────────────┐
```

**Taisyklės (užrakintos, iš esamų + naujos):**
1. Ekranai skaito agregatus arba faktus. **Niekada** `wc_get_orders()` ataskaitoje.
2. Faktas rašomas **vieną kartą** įvykio momentu ir nebekeičiamas. Grąžinimas — naujas faktas grąžinimo dieną (esama taisyklė).
3. Pinigai — **centais, be PVM**, PVM atskiras stulpelis. **v1.3 / Q-E0-4:** neto iš bruto per tarifą **NIEKADA neskaičiuojamas**. WC užsakymo eilutė jau saugo abu atskirai: `line_total` (be PVM) ir `line_tax`. Faktas juos **kopijuoja** — `kaina_ct` ← `$item->get_total()`, `pvm_ct` ← `$item->get_total_tax()`. Tas pats užsakymo lygyje: `$order->get_total()` yra SU PVM ir pristatymu — jį naudoti kaip vardiklį DRAUDŽIAMA (žr. §0A radinį #22). Vardiklis — `prekiu_suma_ct` iš §4.1.
4. Kiekviena faktų eilutė turi `testinis` (0/1) ir `saltinis_aplinka` (dev/prod). Ekranai testinius slepia by default; nuo `ps_stat_pradzia`. **v1.3:** `saltinis_aplinka` imama iš **`Petshop_Statistika::aplinka()`** (statistika:362–365, host → prod/dev) — savos kopijos nedaryti; po DNS cutover persijungia automatiškai.
5. Faktų lentelės — **InnoDB**, `ROW_FORMAT=DYNAMIC`, utf8mb4. **v1.3: informacinė.** `petshop-innodb.php` v1.0 (S912) per `add_filter('query')` jau priverstinai prideda `ENGINE=InnoDB` kiekvienam `CREATE TABLE`; visos 53 esamos `ps_*` lentelės InnoDB, nors `@@default_storage_engine=MyISAM`. `ENGINE=InnoDB` `dbDelta` eilutėje vis tiek rašomas — aiškumui, ne dėl būtinybės.
6. Kiekviena nauja ataskaita: (a) skirtukas HUB'e, (b) XLSX su „Žali duomenys“, (c) tas pats laikotarpio/palyginimo juostos komponentas, (d) KPI su „iš sutikusių su statistika“ žyma kur reikia.
7. Agregatoriai idempotentiški (esama taisyklė) — perskaičiavimas bet kuriai dienai iš faktų.
8. Bet kokia „kiek laiko“ metrika turi atskaitos tašką (`ps_paleidimo_data` pamoka).
9. `ps_stat_zaliu_dienos` valymas **neliečia** `ps_fakt_*`. **v1.3 patikslinimas:** `Petshop_Statistika::SAUGOMOS_SRITYS` (statistika:84) yra **sričių**, ne lentelių sąrašas; `valyti()` (:495) dirba `ps_laukai_ivykiai` viduje ir `ps_fakt_*` fiziškai nepasiektų. Vis dėlto kode įrašoma aiški apsauga — kad ateities valytojas negalėtų.
10. **v1.3 / Q-E0-4:** santykiai ir dalys skaičiuojamos **tik tarp to paties vieneto dydžių** (be PVM su be PVM). Taisyklė galioja **ne tik KPI, bet ir kiekvienam stulpeliui**, stovinčiam šalia pinigų lauko (§0B radinys #23). S842 pamoka (225 %) + §0A radinys #22.
11. **v1.4 — LAIKO ZONA.** Visi `*_at` laukai faktų lentelėse saugomi **UTC** (`current_time('mysql', TRUE)`). Priežastis: `ps_shipments`, `ps_carts`, `ps_email_jobs`, `ps_event_log` (petshop-core) jau rašo UTC, o §4.3 jungiasi su `ps_shipments` — vietinis laikas reikštų 3 val. poslinkį kiekviename JOIN'e. Ekrane rodoma Vilniaus laiku (`wp_date()`, niekada `date()`).
    Šalia — **`diena` DATE**: Vilniaus **verslo diena**, išvesta iš `apmoketa_at` rašymo metu, abiejose faktų lentelėse. Be jos užsakymas, apmokėtas 01:30 Vilniaus laiku, UTC yra praėjusios paros ir kristų į „vakar". Su ja dienos pjūviai niekada nereikalauja `CONVERT_TZ` ir sutampa su `ps_ataskaitu_dienos.diena`.
    **Išimtis:** verslo dienos palyginimas su `ps_stat_pradzia` — vietiniu laiku (`wp_date`), nes tai diena, kurią savininkas mato kalendoriuje.

---

## 4. DUOMENŲ KONTRAKTAS — FAKTŲ LENTELĖS (P0)

Prefiksas `gaj6_`. Visi laukai apibrėžti iš anksto — **Opus nieko neprideda savo nuožiūra**; trūksta lauko → klausimas Raimiui.

### 4.1 `ps_fakt_uzsakymai` — 1 eilutė = 1 užsakymas (rašoma `payment_complete`; atnaujinama TIK statuso/siuntos laukai)
**v1.3:** kabliukas `woocommerce_payment_complete` **prioritetu ≥35** (žemesni užimti: av-order 5 · av-reduce 15 · core/event-emitters 20 · partijos 25 · refill-engine 30). `statusas_galutinis` — varchar; galimų reikšmių **17**, iš jų 9 LP Express (`wc-lp-*`); grupavimui naudojamas Desk `STATUSAI` žemėlapis (desk:275–281), ne WC septynetukas. **v1.4:** `prekiu_suma_ct` = Σ eilučių **subtotal** (BRUTO, prieš nuolaidą) — taip veikia formulė `marza = prekiu_suma − nuolaidu − savikaina`; jei čia dėtume `line_total` (jau po nuolaidos), nuolaida būtų atimta **du kartus**. Neto pajamos = `prekiu_suma_ct − nuolaidu_ct`. `pvm_ct` = `$order->get_total_tax()` (apima pristatymo ir rinkliavų PVM).
Pridedamas laukas **`diena`** (DATE, Vilniaus verslo diena iš `apmoketa_at`) — §3 taisyklė 11.
```
uzsakymas_id (PK) · sukurta_at · apmoketa_at · statusas_galutinis · statusas_at
klientas_id · klientas_email_hash (sha256) · klientas_naujas (0/1 — pirmas APMOKĖTAS)
klientas_uzsakymo_nr (1,2,3…) · dienos_nuo_ankstesnio
prekiu_suma_ct · nuolaidu_ct · kuponu_kodai (json) · tasku_panaudota_ct · tasku_sukaupta_ct
pristatymas_paimta_ct · pristatymas_savikaina_ct (NULL kol negauta) · small_cart_fee_ct
pvm_ct · viso_ct · mokejimo_budas · mokejimo_mokestis_ct (Paysera % — nustatymas)
pakuotes_savikaina_ct (nustatymas per vežėją/dydį)
savikaina_ct (Σ eilučių) · dovanu_savikaina_ct
marza_ct = prekiu_suma_ct − nuolaidu_ct − savikaina_ct
kontribucija_ct = marza_ct + pristatymas_paimta_ct − pristatymas_savikaina_ct − mokejimo_mokestis_ct − pakuotes_savikaina_ct − tasku_sukaupta_ct − dovanu_savikaina_ct
sandeliu_kiekis · misrus (0/1) · sandeliai (json: [AV,ZB…]) · vezejai (json)
kanalas_pirmas · kanalas_paskutinis · utm_source/medium/campaign (pask.) · referer_domenas · irenginys · sutikimas_statistika (0/1)
salis · miestas · pasto_kodas (3 pirmi simboliai — regionui)
anketa_id (NULL) · rec_log_id (NULL) · is_refill (0/1) · prenumerata_id (NULL)
testinis · saltinis_aplinka · fakt_versija
```

### 4.2 `ps_fakt_eilutes` — 1 eilutė = 1 užsakymo eilutė (rašoma kartu su 4.1)
```
id · uzsakymas_id (FK) · apmoketa_at (denorm. — pjūviams be JOIN)
preke_id · variacija_id · sku · gtin · pavadinimas_tuo_metu
kategorija_id_giliausia · kategoriju_kelias (json) · brendas_slug · gyvunas · pa_* užšaldymas (json: baltymas, mono, be_grudu, amzius, speciali)
sandelis (AV|ZB|VF|Prins|Ambrosia|Quattro|Belacor) · tiekejas (fulfillment source) · partija_kodas (AV)
kiekis · kaina_vnt_ct (po nuolaidos, be PVM) · kaina_reguliari_ct · savikaina_vnt_ct (užšaldyta: _cost_price→_vf_cost→_zb_cost) · savikainos_saltinis
nuolaida_ct · akcija_id (petshop-akcijos) · kuponas
rinkinys_id (konteineris) · rinkinio_tipas (mnm|dp|null) · dovana (0/1)
svoris_g · pakuotes_dydis
klientas_naujas (denorm.)
testinis · saltinis_aplinka
```
**v1.3 papildymai:**
- `savikaina_vnt_ct` **kopijuojama** iš eilutės meta `_ps_savikaina_vnt`, `savikainos_saltinis` — iš `_ps_savikaina_saltinis` (`Petshop_Statistika::META_SAVIKAINA`/`META_SAV_SALTINIS`, statistika:60–61, rašoma :280/:292 pardavimo momentu, 4 skaitm. EUR). **Neperskaičiuoti** — kitaip praeities marža taptų netikra (savininko sprendimas 2026-08-15).
- `kaina_vnt_ct` ← `$item->get_total() / kiekis` (**be PVM**); `pvm_ct` eilutėje = `$item->get_total_tax()` (po nuolaidos).
- **`kaina_reguliari_ct` (sprendimas B, v1.4)** = prekės `_regular_price` **pardavimo momentu, BE PVM**, per `wc_get_price_excluding_tax()`. Variacijai — variacijos, MnM vaikui — vaiko prekės. Tuščia → **NULL, ne 0**. Kaina prieš kuponą yra išvestinė: `kaina_ct + nuolaida_ct`. Reguliari kaina po metų nebeatkuriama (§0), prieš-kuponinė — visada.
- `nuolaida_ct` eilutėje = `subtotal − total`; Σ eilučių `nuolaida_ct` privalo sutapti su užsakymo `nuolaidu_ct`.
- Pridedamas laukas **`diena`** (DATE) — §3 taisyklė 11.
- Konteinerio↔vaiko išpjaustymas perimamas iš `Petshop_Ataskaitu_Agregavimas::pardavimai()` (agregavimas:282–405): ryšys per `_mnm_cart_key` / `_mnm_container` (:296, :319), **ne per eilutės ID**; DP pakai per `_dp_base_product_id` + `_dp_pack_qty` (:343–344); dovanos per `_ps_dovana` (:318). Logikos iš nulio nerašyti.
- `sandelis` / `tiekejas` — iš `Petshop_Fulfillment_Source::resolve($pid)` (xml:82), grąžina `{source, carrier, courier_only, label, reason}`; galimos `source` reikšmės: `zb|vf|quattro|ambrosia|belcor_tofu|prins|legacy`.

Backfill: visi esami apmokėti užsakymai dev (testiniai=1) — kodo patikrai. Prod — nuo pirmo realaus.

### 4.3 `ps_fakt_siuntos` — 1 eilutė = 1 fizinė siunta
**⚠️ TRYS PANAŠIAI VADINAMI, SKIRTINGI DALYKAI — nepainioti ir naujo lauko `_ps_siuntos*` NEVADINTI:**
| Objektas | Kas | Kur |
|---|---|---|
| `_ps_shipments` | order meta, **int** = kiek siuntų išeis | rašo `petshop-av-order.php:88` |
| `_ps_siuntos` | order meta, **JSON** registras pagal sandėlį | `Petshop_Siuntos::META`, siuntu-laiskai:39 |
| `gaj6_ps_shipments` | **DB lentelė** (Venipak/LP numeriai, be sandėlio) | `core/class-shipments.php:37` |

**Q-E0-1 / Q-E0-2 (užrakinta 2026-08-26):**
- **`petshop-desk.php` NELIEČIAMAS.** Abu Desk Venipak keliai (desk:693–695 grupinis, desk:782–784 vieno sandėlio) kviečia tą pačią `Petshop_Siuntos::prideti_is_plugino()` (siuntu-laiskai:58). Kabliukas `do_action('petshop_siunta_sukurta', $order_id, $sandelis, $vezejas, $nr)` dedamas į **`petshop-siuntu-laiskai.php:77`**, prieš `$o->save()` — visi keturi argumentai ten jau žinomi.
- `ps_fakt_siuntos` — **atskira** lentelė. `ps_shipments` sandėlio **sąmoningai nesaugo** (class-shipments.php:14–16: „Jų patikimo šaltinio NETURIME… inferred reikšmės vėliau taptų melagingais duomenimis“), todėl ja pakeisti negalima. Ryšys — per `shipment_id`.
- **Naktinis cron sutikrina `ps_shipments` su faktais:** siunta, registruota aplenkiant darbalaukį (atvejis aprašytas siuntu-laiskai:92–93), gauna faktą su **`sandelis=NULL`** — ne prarandama. Sutikrinimas idempotentiškas; užsakymai, kurių `wc_orders` nebėra, praleidžiami (dev'e `ps_shipments` turi 23 našlaičius).
- `vezejas` reikšmės **užrakintos: `venipak` | `lp_express`** (`Petshop_Shipments::label()`, class-shipments.php:194). LP Express numerio šaltinis — order meta `_woo_lithuaniapost_barcode` (:144); Venipak — `venipak_shipping_order_data['pack_numbers']` (:129–133).
```
id · uzsakymas_id · shipment_id (FK → ps_shipments.shipment_id, NULL jei dar nesinchronizuota) · sandelis (NULL = aplenkta darbalaukio) · vezejas (venipak|lp_express) · siuntos_nr
sukurta_at (Desk sprendimas arba cron sutikrinimas) · tiekejui_issiusta_at (dropship email) · registruota_at (vežėjas) · isvezta_at · pristatyta_at (webhook/rankinis) · atsiimta_at
svoris_deklaruotas_g · kaina_vezejo_ct (iš sąskaitos — P1 importas) · paketu_sk · pristatymo_tipas (kurjeris|pastomatas|terminalas)
statusas · problema_kodas (neatvyko|sugadinta|grazinta) · dienos_iki_pristatymo (skaičiuojama)
testinis · saltinis_aplinka
```

### 4.4 `ps_fakt_grazinimai` — grąžinimo dieną (esama taisyklė)
**v1.3:** kabliukas `woocommerce_order_refunded` — E0 grep'as rado **0 kabliukų visuose 137 failuose**, vadinasi vieta laisva ir konfliktų nėra. Papildomai stebimi `woocommerce_order_status_refunded` ir `woocommerce_order_status_cancelled` (jie jau užimti `av-reduce:39–40` p15 — faktų rašytojas eina **p≥35**).
```
id · uzsakymas_id · eilute_id (NULL=visas) · grazinta_at · kiekis · suma_ct · savikaina_ct · priezastis_kodas · priezastis_tekstas · atsargos_grizo (0/1) · sandelis
```

### 4.5 `ps_fakt_atsargos_d` — dienos snapshot, cron 23:55 (TIK AV `_own_stock_qty` + dropship `_stock` — abu laukai atskirai, nemaišant)
```
data · preke_id · sandelis · likutis · rezervuota · savikaina_vnt_ct · verte_ct · pardavimai_vnt_7d · pardavimai_vnt_30d · dienu_atsargu (likutis / vidutinis dienos pardavimas 30d, NULL jei 0) · stockout (0/1) · partiju_sk · artimiausia_galiojimas
```
Apimtis: ~2 300 prekių × 365 = 840 k eilučių/metus. InnoDB, indeksas (preke_id, data). OK 5 metams (~4,2 M).

### 4.6 `ps_fakt_kainos` — tik kai kaina PASIKEIČIA (hook `woocommerce_product_object_updated_props` + importų pabaiga)
**v1.3:** E0 grep'as — `woocommerce_product_object_updated_props` **0 kabliukų iš 137 failų**; vieta laisva. `saltinis='akcija'` atveju susiejama su `ps_akciju_prekes.akcija_id` (ten jau saugoma `reg_kaina`/`akc_kaina`/`buvo_sale`).
```
id · preke_id · nuo_at · kaina_ct · reguliari_ct · savikaina_ct · saltinis (import_zb|import_vf|rankinis|akcija) · vartotojas_id
```

### 4.7 `ps_fakt_kanalai` — sesija → užsakymas (dalis `petshop-analitika.php`, žr. §4A)
**Q1 sprendimas (be teisininko, saugiu keliu):** naujo slapuko NEKURIAM. Pirmas/paskutinis prisilietimas (`utm_*`, `gclid/fbclid` tik faktas 0/1, `referer_domenas`, `landing_url`, laikas) saugomas **WooCommerce sesijoje** (`WC()->session`) — tai jau egzistuojantis BŪTINAS slapukas (krepšeliui), sutikimo nereikalauja. Checkout → order meta `_ps_kanalai` → 4.1 laukai. Trūkumas: WC sesija gyvena 48 val. → klientas, atėjęs iš reklamos ir pirkęs po 3 dienų, taps „direct“. **Su statistikos sutikimu** (Complianz kategorija jau yra): papildomai 30 d. first-party slapukas `ps_k` → pilnas langas. Ekrane North Star rodomas dviem skaičiais: „visi (48 val. langas)“ ir „iš sutikusių (30 d.)“. Tas pats dviejų sluoksnių principas, kuris jau užrakintas statistikoje.
Klasifikacija (nustatymas `ps_fakt_kanalu_taisykles`, ne kodas): `mokamas` (google cpc, fb paid, gclid=1, **kaina24, kainos.lt** — Q2: CPC 0,08 € + PVM = mokamas), `organika`, `email`, `direct`, `referral`, `soc_organika`.
**North Star** = pajamos iš ne-mokamų / visos. Bazė ~32 %, tikslas 50 % / 70 %. **v1.3:** skaitiklis ir vardiklis — abu `prekiu_suma_ct` (be PVM), §3 taisyklė 10.

**v1.3 / Q-E0-5 — EMAIL ATRIBUTACIJA.** Visos nuorodos mūsų laiškuose gauna `utm_source=petshop&utm_medium=email&utm_campaign={flow}`, kur `{flow}` = `ps_email_jobs.flow` reikšmė (`refill_due`, `cart_abandoned_1`, `post_purchase_2d`, `dunning_1`, …). Kanalas `email` tada pagaunamas §4.7 mechanizmu kaip **paskutinis prisilietimas** — jokio naujo lauko, **kontrakto keisti nereikia**. `ps_email_jobs.sent_at` lieka **tik atsarginis** patikrinimas (ar laiškas apskritai išsiųstas), ne atributacijos bazė.
Apimtis: 8 šablonai `petshop-core/templates/emails/` + WC transakciniai. Sender ESP siunčiami laiškai — už mūsų šablonų ribų; jiems UTM deda Raimis Sender pusėje (T-0 punktas).

### 4.8 `ps_dim_klientai` — kliento būsena (perskaičiuojama kas naktį iš faktų, ne rankiniu)
```
klientas_id (PK, arba email_hash svečiams) · pirmas_pirkimas_at · paskutinis_pirkimas_at · uzsakymu_sk · pajamos_ct · marza_ct · kontribucija_ct
ltv_90/180/365_ct (nuo pirmo pirkimo) · vid_intervalas_d · kohorta (YYYY-MM pirmo pirkimo)
rfm_r (1–5) · rfm_f · rfm_m · segmentas (naujas|aktyvus|rizikoje|užmigęs|prarastas|VIP — ribos nustatymuose)
gyvunu_sk · rusys (json) · pagrindinis_brendas · refill_laukiama_at (iš refill variklio) · kanalas_pirmas · legacy (0/1 Master DB)
```
GDPR: `ps_gdpr_rezimas=anonimizuoti` → `klientas_id` → NULL, email_hash lieka. Nieko naujo nesprendžiam.

### 4.9 Nustatymai ir įvedimo lentelės (ekranas „Ataskaitų nustatymai“ — Raimis pildo pats)
```
ps_stat_pradzia · ps_paleidimo_data (esami)
ps_fakt_paysera_fiks_ct = 5 (Q3: 0,05 € už surinktą mokėjimą; % = 0) · pavedimas = 0
ps_fakt_kanalu_taisykles (json) · ps_dim_rfm_ribos · ps_dim_segmentu_ribos · ps_abc_ribos (80/95)
ps_fakt_testiniai_emailai (Q8: prieš launch VISI testiniai užsakymai trinami; sąrašas lieka po-launch testams)
```
**v1.4 — RINKLIAVOS (fee) IR F22.** Šiandien parduotuvėje vienintelis fee yra „Mažo krepšelio mokestis", todėl faktų rašytojas visas **teigiamas** fee eilutes deda į `small_cart_fee_ct`, o **neigiamas** — į `nuolaidu_ct`. Kontraktas dėl to **nekeičiamas** (Raimis, 2026-08-26).
**Sąlyga peržiūrai:** kai bus įgyvendintas **F22 lojalumas**, pirmiausia patikrinti, ar taškų/lojalumo nuolaida nepatenka į užsakymą kaip **neigiamas fee**. Jei taip — tada spręsti dėl atskiro `kitos_rinkliavos_ct` lauko (kontrakto keitimas = nauja versija).

**🔴 v1.3 / Q-E0-7 — TESTINIŲ DUOMENŲ VALYMAS PLATESNIS NEI Q8.**
E0 rado: `ps_shipments` turi **23 našlaičius** įrašus (order_id 35059–35066), o `wc_orders` = **0** — užsakymai ištrinti, siuntos ne; **trynimo kaskados nėra**. Be to `agreguoti_diena()` persuka tik `PERSUKTI=3` paskutines dienas (agregavimas:28), todėl senesni agregatai lieka: dev'e `ps_ataskaitu_dienos` sritis `parduotuve/pajamos` rodo **78 151 ct (781,51 €) iš 21 neegzistuojančio užsakymo** (08-05…08-23).
**T-0 valymo sąrašas (papildo Q8):**
```
1. wc_orders + wc_orders_meta   — testiniai užsakymai (Q8, buvo)
2. ps_shipments                  — eilutės, kurių order_id nebėra
3. ps_carts                      — status IN (expired, abandoned, active) iki ps_stat_pradzia
4. ps_ataskaitu_dienos           — sritys `pardavimai` ir `parduotuve`, diena < ps_stat_pradzia
5. ps_fakt_*                     — WHERE testinis=1
6. shop_coupon `e1a-testas`      — E1a/E1b testinis kuponas (ID 35089)
```
Valymas atliekamas **po** `ps_stat_pradzia` įrašymo, prieš „Discourage search engines“ išjungimą.
**`ps_tarifai` — pristatymo tarifų lentelė su galiojimo datomis (Q5):**
```
id · vezejas (venipak|lpexpress) · tipas (kurjeris|pastomatas|terminalas|kurjeris_did) · svoris_nuo_g · svoris_iki_g
kaina_ct · kintamas_pct (Venipak kuro/kintamas % — atskiras stulpelis) · galioja_nuo · galioja_iki (NULL=galioja)
```
Siuntos savikaina skaičiuojama siuntos sukūrimo momentu iš tarifo, galiojusio TĄ dieną, ir užšaldoma 4.3 `kaina_vezejo_ct`. Tarifui pasikeitus — nauja eilutė su `galioja_nuo`; senos siuntos nesikeičia. Vėliau (P1) — sutikrinimas su vežėjo sąskaita: `kaina_saskaitos_ct` stulpelis, skirtumų ataskaita 5.7.
**`ps_islaidos` — mėnesio išlaidos (Q4 sprendimas pakuotėms ir visam kitam):**
```
id · menuo (YYYY-MM) · kategorija (pakuotes|reklama_google|reklama_meta|kaina24|kainos|sender|hostingas|pluginai|kita) · suma_ct · pastaba · kanalas (NULL arba kanalo kodas — reklamos išlaidoms)
```
Pakuotės **nevertinamos per užsakymą** (dėžės skirtingos, tikslumas apgaulingas — pramonės standartas smulkiam e-shopui: periodinė sąnauda). Kontribucijai naudojamas **vidurkis**: `Σ pakuotės išlaidų per praėjusius 3 mėn. / Σ siuntų` → `ps_fakt_pakuote_vid_ct`, perskaičiuojamas kas mėnesį automatiškai; kol istorijos nėra — rankinis pradinis skaičius (Q11). Užsakymo lygyje rodoma „apytikslė“, mėnesio lygyje — tikra suma iš `ps_islaidos`.
Reklamos išlaidos čia pat (`kanalas` užpildytas) → POAS 5.6. **Kaina24 ir Kainos.lt spend skaičiuojamas automatiškai**: unikalūs paspaudimai/d (utm_source=kaina24|kainos, unikalumas per dienos lankytojo hash §4A) × 0,0968 € — rodoma kaip „apskaičiuota“, mėnesio pabaigoje Raimis įrašo tikrą sąskaitą ir skirtumas rodo, ar mūsų skaitiklis sutampa su Kaina24 (kontrolė).

---

## 4A. SAVAS „GA4“ — PIRMOSIOS ŠALIES ANALITIKA (P0, iki launch)

**Kodėl:** projektas prasidėjo nuo priklausomybės nuo Google. GA4 rodo tai, ką Google mato ir kaip Google skaičiuoja (30 d. langas, last-click, consent nuostoliai, ad-blockeriai — TŽ v1.39: Ads „prisirašo“ 72,5 % pajamų). Sprendimams reikia **savų** duomenų, kur užsakymas = Woo faktas, o ne pikselio įvykis. GA4/GTM **lieka** — Google Ads algoritmui reikia konversijų signalo (tai jo maistas), bet **sprendimai priimami iš mūsų ekranų**. Su GA4 lyginamas TIK purchase skaičius (±2 %, DoD), ne sesijos — apibrėžimai skiriasi, paritetas nesiekiamas.

**Etalonas:** Plausible / Matomo cookieless režimas (CNIL pripažintas be sutikimo: be kryžminio sekimo, be nuolatinio ID, tik agreguota) + mūsų jau užrakintas dviejų sluoksnių principas.

### 4A.1 Rinkimas — `petshop-analitika.php` v1.0
- **JS beacon** (`navigator.sendBeacon`) į `?rest_route=/petshop/v1/i` (firewall pamoka). Botai be JS atkrenta patys; papildomas UA sąrašas.
- **Šaltinis įvykiams — esamas dataLayer (snippet 614):** `view_item`, `add_to_cart`, `view_cart`, `begin_checkout` jau push'inami — klausomės `dataLayer.push` ir siunčiam sau. Nieko nedubliuojam. Vitrinos/anketos moduliai jau rašo savus — neliečiami.
- Papildomi įvykiai (naujai): `pageview` (url, tipas: home|kategorija|preke|blog|info|krepselis|checkout|paieska|sprendimai|rinkiniai), `view_category` (term_id), `search` (frazė, rezultatų sk. — **0 rezultatų atskirai**), `filter` (pa_* raktas+reikšmė), `skaiciuokle` (šėrimo), `quiz_start` (M8), `remove_from_cart`, `404`.
- `purchase` **niekada iš naršyklės** — tik iš 4.1 (serverio faktas), susiejamas per sesiją.
- **Sluoksnis 0 (be sutikimo):** `lankytojas_d` = sha256(IP + UA + dienos druska) — kitą dieną kitas, todėl nuolatinio ID nėra; leidžia unikalius lankytojus/d, atmetimo rodiklį, šaltinius, puslapius, paieškas. Sesija = WC sesijos ID (jau yra). IP nesaugomas.
- **Sluoksnis 1 (statistikos sutikimas):** `ps_k` 30 d. → grįžtantys lankytojai, kelių apsilankymų piltuvėlis, pilnas atributacijos langas. Ekranuose žyma „iš sutikusių“.
- Laukai kiekvienam įvykiui: `laikas · tipas · url_kelias · raktas (preke_id/term/frazė) · reiksme · sesija · lankytojas_d · lankytojas_30 (NULL) · saltinis · medium · kampanija · referer_domenas · landing (0/1) · irenginys (mobile/desktop/tablet) · os_seima · nars_seima · salis (iš Accept-Language/Cloudflare, ne geo-IP) · prisijunges (0/1)`.

### 4A.2 Saugojimas
- `ps_web_ivykiai` — žali, **90 d.** (esamas valymo mechanizmas `ps_stat_zaliu_dienos`; sritis `web` į valomas).
- `ps_web_dienos` — agregatas amžinai, vienas variklis su `pjuvis` stulpeliu (esamas principas „sritis, ne penki moduliai“):
```
data · pjuvis (saltinis|kampanija|landing|puslapis|preke|kategorija|paieska|filtras|irenginys|salis|tipas) · raktas · raktas2 (NULL)
apsilankymai · lankytojai · perziuros · atmetimai · trukme_s_suma · view_item · add_to_cart · begin_checkout · uzsakymai · pajamos_ct · kontribucija_ct · sutikusiu_dalis
```
- Piltuvėlis atskira sritis be prekės dimensijos (S834 pamoka — unikalūs nesudedami).
- Apimtis: ~500 sesijų/d × ~12 įvykių ≈ 6 k eilučių/d → 90 d. ≈ 540 k (InnoDB, indeksai `(laikas)`, `(sesija)`). Agregatas ~2–3 k eilučių/d.

### 4A.3 Ataskaita „SRAUTAS“ (5.11, P0) — tai, ką Raimis šiandien žiūri GA4/Ads
Skirtukai:
1. **Apžvalga**: apsilankymai, lankytojai, užsakymai, CR %, pajamos, kontribucija — tendencija + palyginimas.
2. **Šaltiniai / kanalai** (svarbiausias): kanalas → šaltinis/medium → kampanija; stulpeliai: apsilankymai · nauji klientai · užsakymai · CR · AOV · pajamos · kontribucija · **spend** (iš `ps_islaidos`/auto) · **POAS** · pajamų dalis. Čia matosi „nėra Google Ads — nėra pardavimų“ ar jau ne.
3. **Landing puslapiai**: įėjimo puslapis → atmetimas → užsakymai (SEO + reklamos landing kokybė).
4. **Prekės**: peržiūros → į krepšelį → pirkta (CR per prekę); prekės su daug peržiūrų ir 0 pirkimų = kainos/aprašymo signalas.
5. **Kategorijos ir filtrai**: kurie pa_* filtrai naudojami (nišos pranašumo patikra), kategorijų CR.
6. **Paieška**: frazės, 0 rezultatų sąrašas (katalogo spragos, sinonimai); **frazė → ką pirko** toje pačioje sesijoje (reali paklausa: „maistas alergiškam šuniui“ → Brit Care) — po 6 mėn. tai asortimento sprendimų šaltinis.
7. **Piltuvėlis**: apsilankymas → prekė → krepšelis → checkout → apmokėta, per kanalą/įrenginį; kur krenta.
8. **Įrenginiai / šalys**.
9. **Kontrolė**: Woo užsakymai vs mūsų `purchase` vs GA4 purchase (rankinis įvedimas) — trys skaičiai, nuokrypiai.
Visi skirtukai — XLSX su „Žali duomenys“ (agregatas už periodą).

### 4A.4 Ko šis „GA4“ NEDARO (kad nebūtų iliuzijos)
- Neteikia Google Ads konversijų — tam lieka GTM/Ads tag (jau veikia, S168).
- Nerodo Google Ads spend per kampaniją automatiškai — rankinis mėnesio įrašas `ps_islaidos` (5 min.); Ads API — E7.
- Nemato kelių įrenginių to paties žmogaus (GA4 su Google login mato) — sąmoningas kompromisas dėl privatumo.
- Nerodo real-time.

---

## 5. ATASKAITŲ KATALOGAS

Vieta: „Petshop ataskaitos“ HUB (esamas `class-admin-reports.php` pradžios ekranas). Kiekviena ataskaita = kortelė + submenu. Bendras laikotarpių komponentas: šiandien / 7 / 30 / 90 / šis mėn. / praėjęs mėn. / metai / nuo–iki / palyginimas su ankstesniu tokiu pat.

### 5.0 „RYTAS“ — SAVININKO EKRANAS (pradžios ekranas) — P0
Vienas puslapis, 2 minutės, sprendimams. Ne „dar viena ataskaita“, o įėjimas į visas kitas. Trys blokai iš viršaus:
1. **Šviesoforas (8 lemputės)**: pajamos · kontribucija · nauji klientai · pakartotinių dalis · stockout (A-prekės) · email/eventai · Ads priklausomybė (1 − North Star) · integracijos. Spalva = 5.1 ribos. Paspaudus — 5.1 detalė.
2. **„Kas vakar / šią savaitę pablogėjo“** — automatinės anomalijos, ne rankinis žvilgsnis. Taisyklė: metrika lyginama su 4 sav. bazine linija (ta pati savaitės diena), nuokrypis > riba (nustatymas, default ±20 %) → eilutė su skaičiumi ir nuoroda į pjūvį. Kandidatai: pajamos/d, CR, AOV, kanalo dalis, pakartotinių dalis, prekės su stockout ir pardavimais, srautas su nepavykusiais laiškais, importas be sėkmės >26 val., 404 šuolis. Max 7 eilutės, rikiuota pagal € poveikį.
3. **„Ką daryti“** — taisyklėmis (ne spėjimais) iš faktų, max 5: `A-prekė dienų_atsargų < lead time` → „užsakyti X vnt.“ · `galiojimas ≤30 d. su likučiu` → „trumpo galiojimo akcija“ (nuoroda į esamą) · `prekė peržiūros ≥ N, pirkimai 0` → „patikrinti kainą/aprašymą“ (5.4 potencialas) · `refill praėjo, nepirko` → „segmentas Sender“ · `kontribucija < 0 užsakymai ≥ N/sav.` → „peržiūrėti pristatymo ribą“. Kiekviena taisyklė — nustatymuose įjungiama/išjungiama su riba.
Po to — 8 KPI kortelės už 30 d. su delta ir kortelės į 10 ataskaitų + 4 Katalogo įrankius.
**Principas:** „Rytas“ nieko neskaičiuoja pats — skaito tuos pačius agregatus. Todėl jis pigus ir jį galima perdaryti po launch kiek reikia (B sluoksnis).

### 5.1 SVEIKATA (šviesoforas) — P0 · TŽ v1.47 + v1.50 įgyvendinimas
Savaitinė 5 min. patikra. Žalia/geltona/raudona/pilka, ribos nustatymuose. Blokai:
1. **Pinigai**: pajamos vs praėjusi savaitė, kontribucija, užsakymai/d, AOV.
2. **North Star**: ne-mokamų pajamų dalis (30 d. slenkanti).
3. **Eventų sveikata**: 13 eventų — kiekvienam „nulis, kurio neturi būti“ (`ps_event_log`).
4. **Srautai/email**: 18 srautų — sent/skipped/failed (`ps_email_jobs`), bounce/spam/unsub (Sender webhook — kai bus).
5. **Logistika**: užsakymai >2 d. be siuntos, siuntos >5 d. be pristatymo, dropship email nepavyko.
6. **Katalogas**: stockout A-prekės, be savikainos parduotos, galiojimas ≤30 d. su likučiu, vartai → draft per savaitę.
7. **SEO/svetainė (po launch)**: 404/d, top-100 redirect klaidos, GSC clicks (rankinis įvedimas arba GSC API — P2), indeksacija.
8. **Integracijos**: importų cron paskutinis sėkmingas (6 profiliai), feed'ų generavimas, Pragma eksportas, Paysera callback klaidos.
9. **Duomenų vientisumas**: Woo apmokėti užsakymai vs `ps_fakt_uzsakymai` (turi būti 100 %), Woo vs GA4 purchase ±2 % (rankinis GA4 skaičius arba API — P2).

### 5.2 PARDAVIMAI IR PELNAS — P0
Klausimas: kiek uždirbau ir ar auga; kas tai lemia.
- KPI: pajamos, marža, **kontribucija**, užsakymai, AOV, vnt./užsakymą, grąžinimai, nuolaidų dalis.
- Tendencija: diena/savaitė/mėnuo, palyginimas su ankstesniu periodu ir tuo pačiu periodu pernai (nuo 2027).
- Pjūviai (kiekvienas su naujas/grįžtantis stulpeliais): sandėlis · tiekėjas · kategorija (medis) · brendas · gyvūnas · vežėjas · mokėjimo būdas · regionas · įrenginys · rinkinys vs pavienė.
- **Nuostolingi užsakymai**: kontribucija < 0 — sąrašas su priežastimi (pristatymas > marža, small-cart, nuolaida).
- Drill-down iki eilutės, XLSX „Žali duomenys“ = `ps_fakt_eilutes` už periodą.

### 5.3 KLIENTAI — P0
- **Kohortos**: mėnuo pirmo pirkimo × mėnesiai po jo → % grįžusių, pajamos/klientą (klasikinė trikampė lentelė + heatmap SVG).
- Pakartotinio pirkimo %, laikas iki 2-o pirkimo (mediana), 2→3.
- LTV 90/180/365 pagal kohortą ir pagal kanalą_pirmas.
- RFM segmentų pasiskirstymas + judėjimas tarp segmentų per periodą (kiek tapo „rizikoje“).
- Rizikoje sąrašas: refill_laukiama praėjo + nepirko (eksportas Sender segmentui — rankinis CSV, P1 automatika).
- Top klientai **pagal kontribuciją**, ne pajamas (kliento pelningumas: 8 pirkimai/900 €/180 € kontribucija < 3 pirkimai/600 €/250 €); VIP dalis kontribucijoje. LTV visur = kontribucija (§6).
- Legacy (Master DB 3 156 — Q6: tik vardas/pavardė/el. paštas, pirkimų istorijos NĖRA → `legacy=1` iš el. pašto atitikimo, kohorta = pirmas Woo pirkimas): banga × pirko %, legacy vs nauji klientai atskirai.

### 5.4 PREKĖS — P1
**v1.3 / Q-E0-3:** ekranas statomas **iš `ps_fakt_eilutes`**, ne iš `petshop-pardavimai.php` meta. Tas modulis paliekamas kaip yra (aptarnauja Katalogo eiles) ir **neliečiamas**; jo `_ps_sales_30d/90d/365d`, `_ps_abc`, `_ps_margin_365d` naudojami **tik kaip kontrolinis palyginimas** (§7 taisyklė 7 — rankinis sutikrinimas). Neatitikimas > 2 % = signalas, kad viena iš pusių klysta, ir tiriamas prieš „padaryta“.
- ABC (pajamos) × XYZ (paklausos stabilumas — CV per 12 sav.) matrica; kiekviena prekė gauna klasę, saugoma `_ps_abc` (kas naktį).
- Per prekę: vnt., pajamos, marža %, kontribucija, grąžinimai %, refill dalis, rinkinių dalis, kainos istorija (4.6) su pardavimų kreive.
- Neparduodama ≥ N d. (nuoroda į Katalogą — nedubliuoti).
- Naujų prekių startas: pardavimai per 30 d. nuo `_ps_publikuota`.
- **Prekės potencialas (gelbėjimo eilė)**: peržiūros (4A) → į krepšelį → pirkta. Balas = peržiūros × (1 − CR / kategorijos vid. CR); prekės su daug dėmesio ir mažai pirkimų — ne šalinti, o taisyti (kaina, aprašymas, nuotrauka, konkurentas). Eilė su spėjama priežastimi pagal faktus: aprašymas < 300 simb., be šėrimo lentelės, likutis 0 peržiūrų metu, kaina > Kaina24 vid. (P2, kai bus feed'o palyginimas).
- Kanibalizacija rinkiniai vs pavienės (esama — įtraukti).

### 5.5 ATSARGOS IR PIRKIMAS (AV) — P1
**v1.3 / Q-E0-3:** „dienų atsargai“ skaičiuojama iš `ps_fakt_atsargos_d` + `ps_fakt_eilutes`; `petshop-pardavimai.php::_ps_dienu_atsargai` — kontrolinis palyginimas. Modulis neliečiamas.
- Atsargų vertė istorija (4.5), apyvartumas (COGS 365 / vid. vertė), dienų atsargų per prekę.
- **Stockout'ai**: dienos be likučio × vid. dienos pardavimas = prarasta pajamų (konservatyvus vertinimas).
- **Pirkimo pasiūlymas**: prekės, kur dienų_atsargų < tiekėjo lead time + buferis (nustatymas per tiekėją) — sąrašas su siūlomu kiekiu (30 d. paklausa − likutis). Ne automatinis užsakymas.
- Sell-through per gavimą (`ps_tiekimas`): gauta → parduota per 30/60/90 d.
- Galiojimas: nurašymų suma (grąžinimai/nurašymai su priežastimi „galiojimas“).
- Dropship (`_stock`): tiekėjo „nėra“ dažnis per prekę, užsakymai atšaukti dėl tiekėjo.

### 5.6 KANALAI IR MARKETINGAS — P1
**v1.3:** promotion uplift šaltinis JAU yra — `ps_akcijos` (`nuo`/`iki`/`metodas`/`reiksme`) + `ps_akciju_prekes` (`reg_kaina`/`akc_kaina`/`buvo_sale`). Naujų faktų nereikia; baseline imamas iš `ps_fakt_eilutes` prieš `nuo`.
- Pajamos/kontribucija per kanalą (4.7), naujų klientų dalis per kanalą, LTV per kanalą.
- **POAS**: spend įvedamas rankiniu būdu per mėnesį/kanalą (nustatymų lentelė `ps_fakt_spend`: mėnuo, kanalas, suma) — Ads API P2. POAS = kontribucija / spend.
- Kuponai: naudojimai, nuolaidos suma, inkrementinės pajamos, naujų klientų kuponai vs esamų.
- Akcijos (petshop-akcijos): pardavimai akcijos metu vs bazinė linija (4 sav. prieš, ta pati prekė) → uplift %, nuolaidos kaina, verdiktas.
- Email: pajamos su `kanalas_paskutinis=email` per srautą (`flow` iš `ps_email_jobs` per job_key → užsakymas per 5 d. langą).
- Kainų palyginimo (Kaina24/Kainos.lt): pajamos per `utm_source`.
- Vientisumas: Woo vs GA4 purchase (5.1 #9).

### 5.7 LOGISTIKA IR TIEKĖJAI — P1
**v1.3:** sell-through per tiekėją šaltinis JAU yra — `ps_tiekimas.gauta` + `ps_tiekimas_eil.qty_gauta` (`petshop-av-tiekimas.php:166–167`). Naujų faktų nereikia.
- Per sandėlį/tiekėją: užsakymas→siunta (val.), siunta→pristatyta (d.), % laiku, problemų %.
- Per vežėją: pristatyta mediana, problemos, kaina vežėjo vs paimta iš kliento (kai sąskaitų importas; iki tol default nustatymas).
- Mišrūs užsakymai: dalis, papildoma pristatymo savikaina, vidutinis vėlavimas.
- Dropship email: išsiųsta/nepavyko/laikas iki tiekėjo patvirtinimo (jei fiksuojama).
- Pristatymo tipų mix (kurjeris/paštomatas/terminalas) ir savikaina per tipą.

### 5.8 FINANSAI / MĖNESIO UŽDARYMAS — P1 (Q9: buhalterei užtenka Pragma eksporto + sąskaitų sąrašo, kurie JAU yra; šis XLSX — TIK Raimio analizei)
- Pajamos be PVM per PVM tarifą, PVM, pristatymas, nuolaidos, grąžinimai.
- Mokėjimo būdai ir Paysera mokesčiai (n × 0,05 €).
- Savikaina per tiekėją (sutikrinimui su tiekėjų sąskaitomis).
- **P&L per mėnesį**: pajamos − savikaina − pristatymo savikaina (tarifai) − Paysera − `ps_islaidos` (pakuotės, reklama, įrankiai) = veiklos rezultatas. Tai vienintelis ekranas, kur pakuotės ir reklama rodomos TIKROMIS sumomis.
- Lojalumo taškų įsipareigojimas (sukaupta − panaudota).
- AVPN/IAPV serijų tarpai (kontrolė).

### 5.9 RETENCIJA IR AUTOMATIKA — P1
**v1.3 / Q-E0-5:** email pajamų atributacija — per `utm_medium=email&utm_campaign={flow}` (§4.7), ne per `ps_email_jobs`. E0 patvirtino: `ps_email_jobs` turi `sent_at`, bet **paspaudimo laiko neturi** (23 stulpeliai, nė vieno `clicked_at`), todėl „paskutinis paspaudimas 5 d.“ iš jos neįgyvendinamas. `flow` + `status` + `skip_reason` naudojami pristatymo sveikatai (kiek išsiųsta / užblokuota / praleista), ne pajamoms.
- 18 srautų: sent/delivered/skipped per priežastį/failed; konversija į užsakymą per 5 d.
- Refill: laukiama vs įvyko, tikslumas (dienos nuokrypis) — šaltinis anketos ataskaita (nedubliuoti, nuoroda).
- Priminimai (M8): nustatyta / išsiųsta / pirko po priminimo.
- Prenumerata (kai bus): aktyvios, MRR, churn, dunning sėkmė — P2.
- Reputacija: bounce/spam/unsub per bangą (Sender webhook — kai prijungtas).

### 5.11 SRAUTAS — P0 · žr. §4A.3

### 5.10 P2 (po 6–12 mėn. duomenų) — tik pavadinimais, nespecifikuojama dabar
Paieškos terminai be rezultatų · kainų elastingumas (kainų istorija × pardavimai) · prognozė prekė×savaitė · GA4/Ads/GSC API vietoj rankinio įvedimo · Metabase prijungimas prie `ps_fakt_*` · anonimizuotų sesijų piltuvėlis visai parduotuvei (dabar tik vitrina/anketa).

---

## 6. APIBRĖŽIMŲ ŽODYNAS (užrakinama vieną kartą, rodoma kiekvienoje ataskaitoje per „i“)

| Terminas | Apibrėžimas |
|---|---|
| Pajamos | Σ eilučių (kaina po nuolaidos × kiekis), **be PVM, be pristatymo**, minus grąžinimai grąžinimo dieną |
| Marža | Pajamos − savikaina (užšaldyta pardavimo momentu) − dovanų savikaina |
| Kontribucija | Marža + pristatymas paimtas − pristatymo savikaina − mokėjimo mokestis − pakuotė − sukaupti taškai |
| Užsakymas | apmokėtas (`payment_complete`); periodo data = apmokėjimo data; atšauktas prieš apmokėjimą — nesiskaičiuoja |
| Naujas klientas | pirmas apmokėtas užsakymas šioje parduotuvėje; legacy iš Master DB, pirkęs eShoprent — **naujas** (žymima `legacy=1` atskirai) |
| AOV | Pajamos / užsakymai (be PVM) |
| Kohorta | mėnuo pirmo apmokėto užsakymo |
| Grįžo per N d. | turi ≥1 apmokėtą užsakymą per N d. po pirmo |
| LTV N | Σ kontribucijos per N d. nuo pirmo pirkimo (ne pajamų — pinigai, kuriuos galima išleisti akvizicijai) |
| Ne-mokamas kanalas | organika, direct, email, referral, soc. organika, kainų palyginimo (Kaina24 — **Q2**: mokamas ar ne) |
| Stockout diena | AV prekė su `_own_stock_qty` = 0 ir pardavimų 30 d. > 0 |
| Testinis | užsakymas iš `ps_fakt_testiniai_emailai` arba dev aplinkos |

---

## 7. VYKDYMO PLANAS (Opus)

Etapai vykdomi **eilės tvarka**, kiekvienas — atskira sesija su DoD. Etapo nepradėti, kol ankstesnio DoD neuždarytas Raimio + vizualiai.

| Etapas | Kas | DoD (empiriškai) | Kada |
|---|---|---|---|
| ~~**E0 Recon**~~ | ✅ **UŽDARYTA 2026-08-26.** 5 tilto runai (#4945–#4949), 137 failai, 53 lentelės | `dokumentai/ataskaitu_recon_v1.md` v1.1, commit `a247d81`, 0 spėjimų. Radiniai → §0A | sesija 1 ✅ |
| ~~**E1a Faktų minimumas**~~ | ✅ **UŽDARYTA 2026-08-26.** `petshop-faktai.php` v1.3 + `petshop-kanalai.php` v1.1; `ps_fakt_uzsakymai` (55 st.) + `ps_fakt_eilutes` (38 st.); kanalas iš WC sesijos; nustatymai `ps_fakt_paysera_fiks_ct=5`, `ps_fakt_pakuote_vid_ct=40` | **3 realūs dev užsakymai: 35087** (mišrus 2 sandėliai + dovana + MnM dėžė), **35088** (VF, antras tas pats el. paštas), **35090** (kuponas −10 % per 3 eilutes, 3 sandėliai). 8 patikros kiekvienam — visos OK iki cento; kontribucija perskaičiuota ranka; `klientas_naujas` 1→0→0, `nr` 1→2→3; idempotencija įrodyta (`processing→completed`, eilutės nesikeitė); PK dublio testas empiriškai (#4953) | sesija 2 ✅ |
| **E1b Siuntos + grąžinimai** | 4.3 (`do_action` į **`petshop-siuntu-laiskai.php:77`**, Desk NELIEČIAMAS — Q-E0-1), naktinis `ps_shipments` sutikrinimo cron (`sandelis=NULL` aplenkusioms), 4.4, `ps_tarifai`, backfill dev (testiniai=1). **v1.3 / Q-E0-7:** pridėti `Petshop_Ataskaitu_Agregavimas::perskaiciuoti($nuo, $iki)` — agregatų persukimas bet kuriam intervalui, ne tik `PERSUKTI=3` | **v1.4 konkretūs atvejai:** (a) **35087** turi 2 neregistruotas siuntas ir yra `processing` — jį registruoti per Desk → 2 fakto eilutės su tos dienos tarifu; (b) siunta **aplenkiant** Desk → naktinis cron sukuria faktą su `sandelis=NULL`; (c) **grąžinimas ant 35090** (eilutė su kupono nuolaida) → `ps_fakt_grazinimai.suma_ct` = **realiai grąžinta suma iš Woo refund** (ne bruto), `savikaina_ct` proporcingai grąžintam kiekiui; §5.2 tos dienos minusas; (d) `perskaiciuoti('2026-08-01','2026-08-05')` perrašo 5 dienas idempotentiškai | sesija 3 |
| **E2 Analitika (savas GA4) + kanalai** | §4A.1–4A.2, 4.7 pilnas (30 d. su sutikimu), `ps_islaidos`, nustatymų ekranas | Playwright: reklamos landing su utm → prekė → krepšelis → checkout → apmokėta; visi įvykiai lentelėje su ta pačia sesija; utm 4.1 laukuose; be sutikimo — `lankytojas_30`=NULL, su sutikimu — užpildytas; kitą dieną `lankytojas_d` kitoks; purchase tik iš serverio (1, ne 2) | sesija 4 |
| **E2b Atsargos + kainos + klientai** | 4.5, 4.6, 4.8 | snapshot 2 dienos; kaina pakeista importu → eilutė; `ps_dim_klientai` 3 sintetiniai klientai | sesija 5 |
| **E3 Rytas + Sveikata + Pardavimai + Srautas** | 5.0, 5.1, 5.2, 5.11 ant esamo karkaso, XLSX | ekrano kopija (browser=1) kiekvienam skirtukui; KPI ranka sutikrinti su 4.1 SUM; XLSX atidaromas Excel (dvi patikros, S839 pamoka) | sesija 6–7 |
| **E4 Klientai** | 5.3 | kohortų lentelė su 3 sintetiniais klientais (dev) sutampa su rankiniu skaičiavimu | sesija 8 |
| **T-0** | `ps_stat_pradzia`, `ps_paleidimo_data` ✅ (jau `2026-10-01`), `ps_stat_pvm`, `ps_tarifai` užpildyti (Raimis), `ps_fakt_pakuote_vid_ct` pradinis, **5 punktų valymo sąrašas §4.9 (Q-E0-7)**, kanalų taisyklės, UTM Sender laiškuose (Q-E0-5) | įrašai options; 5.1 #9 rodo 100 %; `ps_shipments`/`ps_carts`/`ps_ataskaitu_dienos` be testinių eilučių | launch |
| **E5 Prekės + Atsargos + Kanalai** | 5.4, 5.5, 5.6 | su 30 d. realių duomenų | 10-15..11-01 |
| **E6 Logistika + Retencija + Finansai** | 5.7, 5.9, 5.8 | su 60 d. | 11..12 |
| **E7 P2** | 5.10 | 2027 Q2+ | |

**Opus darbo taisyklės šiam projektui (be išimčių):**
1. Vienas modulis = vienas failas mu-plugins; pavadinimai `petshop-faktai.php`, `petshop-kanalai.php`, `petshop-ataskaita-{sritis}.php`; PHP header versija = deployment_log.
2. `token_get_all(TOKEN_PARSE)` + md5 + `.bak_hNNN` prieš kiekvieną rašymą; full-file rewrite.
3. **Neliečiama:** `petshop-laukai.php`, Fulfillment, AV_Limit, Stock_Service, `petshop-xml.php`, importų profiliai, **`petshop-desk.php` (VISAS — Q-E0-1, Q7 atšauktas kaip nereikalingas)**, `petshop-pardavimai.php` (Q-E0-3), `core/class-shipments.php`. Vienintelis leistas svetimo failo pakeitimas: **`petshop-siuntu-laiskai.php:77`** — viena `do_action` eilutė (E1b; privaloma `.bak`, md5 prieš/po, `token_get_all`).
4. Faktų rašymas per **savo** hook'us `payment_complete`, `woocommerce_order_refunded`, `petshop_siunta_*`; niekada `save_post`. **v1.3: prioritetas ≥35.** Žemesni užimti: `av-order:40` p5 (fiksuoja šaltinį) → `av-reduce:36` p15 (mažina AV) → `core/event-emitters:30` p20 → `partijos:581` p25 (nurašo partijas) → `core/refill-engine:101` p30. Faktas rašomas **po** partijų nurašymo, kad savikaina būtų galutinė.
5. Kiekvienas naujas laukas — į 4.x kontraktą (dokumentas) IR į kodą tuo pačiu commit'u (M8 pamoka, 5+ kartų).
6. Deploy ir test — atskiri HTTP request'ai (opcache). Vizualus patikrinimas `browser=1` prieš „padaryta“.
7. Skaičiai tikrinami **ranka** bent vienam užsakymui kiekvienoje ataskaitoje (S817 kontrolinis skaičiavimas). Vardiklis ir skaitiklis — tas pats vienetas (S842 pamoka 225 %).
8. Po 2–3 nesėkmių — stop, įvardinti problemą, klausti.
9. Tuščia dev bazė — norma. Logika tikrinama sintetiniais/ReflectionMethod, ne duomenų kiekiu.
10. Terse LT ataskaitos Raimiui; deployment_log + REGISTRAS atnaujinami pilnu failu sesijos pabaigoje.
11. **v1.3:** santykiai ir dalys — tik tarp to paties vieneto dydžių (§3 taisyklė 10). Prieš kiekvieną naują KPI įvardinti, kas skaitiklyje ir kas vardiklyje, ir ar abu be PVM.
12. **v1.3:** kiekvienas naujas kabliukas prieš rašant patikrinamas grep'u per visus 137 failus — ar vieta laisva ir koks prioritetas užimtas (E0 metodas).

---

## 8. KLAUSIMAI — ATSAKYTA (2026-08-25) IR LIKĘ

| # | Atsakymas | Kur įrašyta |
|---|---|---|
| Q1 | nežino → sprendimas be teisininko: WC sesija (būtinas slapukas) + 30 d. tik su sutikimu | 4.7, 4A.1 |
| Q2/Q10 | Kaina24 **ir** Kainos.lt = CPC 0,08 € + PVM už unikalų paspaudimą/d → **mokami**; spend abiem skaičiuojamas automatiškai | 4.7, 4.9 |
| Q3 | Paysera 0,05 € fiksuota už mokėjimą | 4.9 |
| Q4 | pakuotės perka, vertinti nemoka → mėnesio išlaida `ps_islaidos` + 3 mėn. vidurkis per siuntą | 4.9 |
| Q5 | tarifai LP/Venipak yra, kinta, Venipak + kintamas % → `ps_tarifai` su galiojimo datomis, Raimis pildo pats | 4.9 |
| Q6 | eShoprent istorijos nėra, tik vardas/pavardė/el. paštas → `legacy=1` flag'as, kohortos nuo Woo | 4.8, 5.3 |
| ~~Q7~~ | **ATŠAUKTAS KAIP NEREIKALINGAS (v1.3, 08-26).** E0 rado, kad abu Desk keliai kviečia tą pačią `Petshop_Siuntos::prideti_is_plugino()` → kabliukas dedamas ten, Desk neliečiamas. Senas tekstas: **LEISTA (08-25).** Paaiškinimas: `petshop-desk.php` yra „neliečiamas variklis“. Kad 4.3 siuntų faktai būtų tikslūs, Opus turi į Desk įdėti **vieną eilutę** `do_action('petshop_siunta_sukurta', $order_id, $sandelis, $vezejas, $nr)` toje vietoje, kur Desk sukuria siuntą — logika nesikeičia, tik pranešimas. Alternatyva be Desk keitimo: skaityti WCDN/Venipak meta per cron (mažiau tikslus laikas). | 4.3 |
| Q8 | prieš launch visi testiniai užsakymai trinami | 4.9 |
| Q9 | buhalterei — esamas Pragma + sąskaitų sąrašas; XLSX tik Raimiui | 5.8 |

| Q11 | pradinis pakuotės vidurkis 0,40 €/siuntą (Raimis: ok) — keičiamas nustatyme | 4.9 |
| Q12 | apimtis matysis eigoje — 4A.3 skirtukai laikomi baze; papildymai per versiją | 4A |

**Konsultanto peržiūra (08-25) — įtraukta:** „Rytas“ savininko ekranas (5.0), E1 skaidymas į E1a/E1b (faktų minimumas pirma), prekės potencialas (5.4), paieška→pirkimas (4A.3), pelningumas vietoj pajamų klientams (5.3 — buvo 4.8, dabar ekrane). **Neįtraukta:** pavadinimas „Intelligence Layer“ — dokumentuose lieka „Petshop ataskaitos“ / „savas GA4“, kad terminai nesikeistų.
**Q-E0 ATSAKYMAI (Raimis, 2026-08-26) — UŽRAKINTA:**

| # | Sprendimas |
|---|---|
| Q-E0-1 | `do_action` → `petshop-siuntu-laiskai.php:77`; Desk neliečiamas. Naktinis cron sutikrina `ps_shipments` → aplenkusios siuntos gauna faktą su `sandelis=NULL` |
| Q-E0-2 | `ps_fakt_siuntos` — atskira lentelė su `shipment_id` nuoroda |
| Q-E0-3 | `petshop-pardavimai.php` paliekamas (Katalogo eilėms); 5.4/5.5 — iš faktų, jo meta tik kontrolinis palyginimas; **dabar neliesti** |
| Q-E0-4 | WC jau saugo atskirai: `line_total` (be PVM) + `line_tax`. Faktas kopijuoja abu. **Neto iš bruto per tarifą niekada neskaičiuojama** |
| Q-E0-5 | Email atributacija per UTM laiškų nuorodose (`utm_medium=email&utm_campaign={flow}`) → §4.7 kaip paskutinis prisilietimas. `sent_at` atsarginis. Kontrakto keisti nereikia |
| Q-E0-6 | Uždarytas runu #4949 |
| Q-E0-7 | T-0 papildomas 5 punktų valymo sąrašu; E1b gauna `perskaiciuoti($nuo,$iki)` |

**LIKĘ ATVIRI (v1.3):** naujų nėra. Radinys #22 (PVM vienetų nesutapimas) sprendžiamas §3 taisykle 10 + §4.1 be Raimio sprendimo.

**Dėl „per daug prieš turint duomenų“:** pastaba teisinga ir jau atitinka planą — P0 = TIK faktų surinkimas + Rytas + Pardavimai + Srautas; 5.4–5.9 statomi tik su realiais duomenimis (E5–E6). E1+E2 apimtis lieka, nes tai A sluoksnis (faktai), kurio atidėti negalima.

## 9. KO NEDAROM (sąmoningai)

- Real-time, WebSocket, gyvi skaitikliai.
- Išorinės bibliotekos (PhpSpreadsheet, Chart.js) — esamas SVG + savas XLSX.
- GA4/Ads/GSC API integracijos iki E7 — rankinis mėnesio įvedimas `ps_islaidos` (5 min./mėn.).
- GA4/GTM išjungimo — Google Ads reikia konversijų signalo; keičiam SPRENDIMŲ šaltinį, ne Google maistą.
- Naujo UI karkaso — tik `Petshop_Ataskaitu_UI`.
- Ataskaitų apie dev duomenis — dev tik logikos patikrai.
- ZB kainodaros analizės (2026-07-30 sprendimas) — kainų istorija renkama, bet ataskaita neteikia „reprice“ pasiūlymų.
- Laukų pridėjimo „nes gal prireiks“ — kontraktas §4 uždaras; keitimas = versija + įrašas.

---
**Kitas žingsnis: Opus pradeda E1b** (§7) — `do_action` į `petshop-siuntu-laiskai.php:77`, `ps_fakt_siuntos`, `ps_tarifai` + įvedimo ekranas (tarifus pildo Raimis), `ps_fakt_grazinimai`, naktinis `ps_shipments` sutikrinimas, `perskaiciuoti($nuo,$iki)`.
E0 ✅ (`dokumentai/ataskaitu_recon_v1.md` v1.1) · E1a ✅ (užsakymai 35087, 35088, 35090). Claude tikrina DoD kiekvieno etapo pabaigoje; Raimis sako „toliau“ arba „taisyti“.
