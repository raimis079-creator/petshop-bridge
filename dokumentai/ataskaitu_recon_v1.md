# ATASKAITŲ SISTEMA — E0 RECON v1.1

2026-08-26 · Vykdytojas: Opus · Metodas: tiltas (GitHub Actions runs #4945–**#4949**, `browser=0`) · Aplinka: `dev.avesa.lt`
v1.1 — uždarytos v1.0 §16 spragos: `class-shipments.php` turinys, `ps_ataskaitu_dienos` pjūvis, `ps_shipments` duomenys.
Šaltinis: `petshop_ataskaitu_sistema_master_planas_v1_2.md` §7 E0
**Taisyklė: 0 spėjimų. Kiekvienas teiginys su failu ir eilute arba su lentelės DDL.**

Žymėjimas: `failas:eilutė`. mu-plugins = `wp-content/mu-plugins/`, core = `wp-content/plugins/petshop-core/includes/`, xml = `wp-content/plugins/petshop-xml/includes/`.

---

## 0. KĄ IR KAIP SKENAVAU

| Runas | Ką | Rezultatas repo |
|---|---|---|
| #4945 R010A | 65 mu-plugin failai, 53 `ps_*`/WC lentelės su pilnu `SHOW CREATE TABLE`, `ps_*` options, aktyvūs snippet'ai | `deploy/r010_recon.json` (131 611 B) |
| #4946 R011B | 23 taikinio failai: hook'ai, meta raktai, options, lentelės, transientai, cron, apibrėžimai — visi su eilutėmis | `deploy/r011_recon.json` (87 255 B) |
| #4947 R012C | globalus grep per **137 failus** (visi mu-plugins + petshop-core + petshop-xml), 26 raktažodžiai + 10 kodo ištraukų | `deploy/r012_recon.json` (71 576 B) |
| #4948 R013D | `petshop-core` pilnas inventorius (59 failai), Desk Q7 taškai, WC nustatymai, gyvas cron sąrašas | `deploy/r013_recon.json` (25 920 B) |
| **#4949 R014E** | `class-shipments.php` **pilnas kodas** (207 eil.), jo kvietėjai, `ps_ataskaitu_dienos` turinio pjūvis, `ps_shipments` + `ps_carts` duomenys | `deploy/r014_recon.json` (26 845 B) |

Serverio faktai: `default_storage_engine=MyISAM`, HPOS `yes`, 2 616 publikuotų prekių, `wc_orders` **0 eilučių** (dev), viso 194 lentelės.

---

## 1. MODULIŲ REALIOS VERSIJOS (plano §1 inventorius pasenęs)

| Modulis | Planas §1 | **Realybė** | Kur |
|---|---|---|---|
| `petshop-statistika.php` | 2.1 | **2.2** | statistika:5, `const VERSIJA='2.2'` :56 |
| `petshop-ataskaitu-agregavimas.php` | 1.0 | 1.0 ✓ | agregavimas:5, :26 |
| `petshop-ataskaitos-ui.php` | 1.0 | 1.0 ✓ | ui:5, :20 |
| `petshop-ataskaitu-eksportas.php` | 1.0 | 1.0 ✓ | eksportas:5, :26 |
| `petshop-rinkiniu-ataskaita.php` | 2.0 | 2.0 ✓ | 797 eil. |
| `petshop-paruostu-ataskaita.php` | 1.0 | 1.0 ✓ | 581 eil. |
| `petshop-anketos-ataskaita.php` | 2.3 | 2.3 ✓ | 754 eil. |
| `petshop-desk.php` | (neminima) | **v3.47 (H265)** | desk:3 |
| `petshop-akcijos.php` | (neminima) | **1.8** | akcijos:69 |
| `class-admin-reports.php` | — | 110 eil., `PARENT='petshop-reports'` | core/class-admin-reports.php:31 |
| `class-fulfillment-source.php` | 1.0 | 1.0 ✓ (209 eil.) | xml:5 |

**Plane visiškai nėra trijų egzistuojančių modulių**, kurie tiesiogiai liečia ataskaitas — žr. §6.

---

## 2. `petshop-statistika.php` v2.2 (526 eil., md5 `5b20a104`)

### 2.1 Kabliukai (įeinantys)
| Hook | Prioritetas | Eilutė |
|---|---|---|
| `init` | — | :87 |
| `woocommerce_checkout_create_order_line_item` | 20 | :90 |
| `woocommerce_new_order_item` | 20 | :92 |
| `woocommerce_checkout_create_order` | 20 | :95 |
| `wp_footer` | 20 | :96 |
| `wp_ajax_ps_stat_ivykis` / `wp_ajax_nopriv_ps_stat_ivykis` | — | :99, :100 |
| `ps_stat_valymas` (savas cron) | — | :103; `wp_schedule_event(..., 'daily', ...)` :105 |

**`do_action` / `apply_filters` — nėra nė vieno.**

### 2.2 Meta raktai (konstantos, :60–:66)
| Konstanta | Reikšmė | Lygis | Rašoma |
|---|---|---|---|
| `META_SAVIKAINA` | `_ps_savikaina_vnt` | eilutė | :280 (checkout), :292 (admin/API) |
| `META_SAV_SALTINIS` | `_ps_savikaina_saltinis` | eilutė | :281, :293 |
| `META_KAINA_ATSK` | `_ps_kaina_atskirai_vnt` | eilutė | :304, :321 |
| `META_UZS_SESIJA` | `_ps_stat_sesija` | užsakymas | :356 |
| `META_UZS_IRENG` | `_ps_irenginys` | užsakymas | :353 |
| `META_EIL_DYDIS` | `_ps_dydis` | eilutė | :299, :317 |

Savikaina užšaldoma **pardavimo momentu** (`wc_format_decimal($sav, 4)`, :280) — 4 skaitmenys po kablelio, EUR, ne centai. Konteinerį atpažįsta per `_mnm_cart_key` (:272).

### 2.3 Options
| Option | Konstanta | Eilutė | **Reikšmė dev'e** |
|---|---|---|---|
| `ps_stat_pradzia` | `OPT_PRADZIA` | :66 | **`false` (neegzistuoja)** |
| `ps_stat_zaliu_dienos` | `OPT_ZALIU_DIENOS` | :69 | numatytoji 90 (:73) |
| `ps_stat_valomos_sritys` | `OPT_VALOMOS_SRITYS` | :70 | numatytoji `['laukai']` (:76) |
| `ps_stat_schema` | `SCHEMOS_RAKTAS` | :57 | versija 3 (:58) |

`SAUGOMOS_SRITYS = ['anketa','rec','refill']` (:84) — plano §3 taisyklė 9 nori jį praplėsti į `ps_fakt_*`; **realiai tai sričių, ne lentelių sąrašas** (valymas dirba `ps_laukai_ivykiai` viduje, ne per lenteles).

### 2.4 Lentelės
`ps_laukai_ivykiai` (:113), `ps_ataskaitu_dienos` (:118). Abi kuriamos `dbDelta` :129, :151; `ALTER TABLE` :172–173.

### 2.5 Aplinkos detekcija (SVARBU §3 taisyklei 4)
```
:364  return ( $h === 'petshop.lt' || $h === 'www.petshop.lt' ) ? 'prod' : 'dev';
```
Po DNS cutover **visi seni dev įrašai lieka `aplinka='dev'`, nauji tampa `prod`** automatiškai. `ps_fakt_*` `saltinis_aplinka` turi naudoti tą pačią `Petshop_Statistika::aplinka()`, ne savo kopiją.

---

## 3. `petshop-ataskaitu-agregavimas.php` v1.0 (530 eil., md5 `3f12c408`)

### 3.1 Cron
- Konstanta `CRON='ps_ataskaitu_agregavimas'` (:27), `PERSUKTI=3` (:28), `TRANSIENT='ps_ata_siandien_'` (:29), `KESO_SEK=300` (:30).
- `wp_schedule_event( $kada - ( get_option('gmt_offset') * HOUR_IN_SECONDS ), 'daily', self::CRON )` (:39).
- **Gyvas cron įrašas (`_get_cron_array()`): `2026-08-26 00:15` UTC.** Su `gmt_offset=+3` tai 03:15 vietos laiku → **atitinka planą §3**.

### 3.2 Viešas API (ekranai jį naudos)
| Metodas | Eilutė | Ką grąžina |
|---|---|---|
| `ct( $eurai )` | :56 | EUR → centai |
| `agreguoti_diena( $diena )` | :75 | idempotentinis dienos perskaičiavimas |
| `uzsakymai_diena( $diena )` | :268 | `wc_get_orders(limit=-1, status=[processing,completed,on-hold], date_created=$diena...$diena)` :269–274 |
| `pardavimai( $diena, &$eil )` | :282 | pagrindinis pardavimų agregatorius |
| `grazinimai( $diena, &$eil )` | :405 | naudoja `wc_get_orders` :406 |
| `siandien()` | :426 | transiento sluoksnis |
| `sviezumas()` / `agregavimo_laikas()` | :445 / :453 | options `ps_ata_siandien_laikas` :440,:446; `ps_ata_paskutinis_agregavimas` :68,:454 |
| `eilutes( $nuo, $iki, $sritys )` | :463 | ekranų skaitymo taškas |
| `sumuoti()` / `viso()` | :499 / :515 | |

### 3.3 Ką agregatorius jau moka (pardavimų srityje)
- Konteinerio↔vaiko ryšys per `_mnm_cart_key` / `_mnm_container` (:296, :319) — **ne per eilutės ID** (komentaras :278–280).
- Sritis `parduotuve` / tipas `pajamos` — visos parduotuvės apyvarta vardikliui (:291).
- Tipai: `parduota`, `be_savikainos`, `be_sav_suma` (:328–331), `dp_pakopa` (:349), dovanos (:337–340), DP pakai per `_dp_base_product_id` + `_dp_pack_qty` (:343–344).
- Komponentų sąrašas iš `wc_mnm_child_items` + `_dp_base_product_id` (:252, :257), keše 300 s (:260).
- Eilutės meta skaitomos per `Petshop_Statistika::META_*` (:286, :288, :301, :315).

**Išvada:** §4.2 `ps_fakt_eilutes` gali **perimti tą pačią išpjaustymo logiką** iš `pardavimai()` (:282–405), ne rašyti iš nulio.

---

## 4. `petshop-ataskaitos-ui.php` v1.0 (493 eil., md5 `30a192b7`) — karkasas

Klasė `Petshop_Ataskaitu_UI` (:18). **Nė vieno `add_action`** — grynas statinis pagalbininkas.

| Metodas | Eilutė | Paskirtis |
|---|---|---|
| `pvm()` | :24 | skaito `get_option('ps_stat_pvm')` :25 — **dev'e option = `false`** |
| `be_pvm($suma)` / `eur($ct,$zenklas)` / `proc()` / `dal()` | :29 / :33 / :38 / :43 | |
| `nustatymas($raktas,$numatytoji)` | :47 | bendras nustatymų skaitytuvas |
| `laikotarpis()` | :58 | laikotarpio + palyginimo parsinimas |
| `nuoroda($slug,$args)` / `juosta($slug,$lt,$filtrai)` | :94 / :107 | |
| `kpi($antraste,$reiksme,$delta,$pastaba,$tooltip,$spark)` | :147 | KPI kortelė |
| `spark()` / `diagrama()` / `lentele($id,$stulpeliai,$eilutes,$opts)` | :169 / :204 / :243 | SVG + rikiuojama lentelė |
| `veiksmai()` / `piltuvelis()` / `juostele()` | :277 / :289 / :321 | |
| `spejimas()` / `maza_imtis($tekstas,$imtis,$riba)` | :187 / :192 | |
| `antraste()` / `pabaiga()` / `stilius()` / `js()` | :328 / :336 / :342 / :439 | |

Plano §3 taisyklė 6 (vienoda juosta, KPI su žyma) — **visi reikalingi metodai jau yra**, naujų karkaso funkcijų nereikia.

---

## 5. `petshop-ataskaitu-eksportas.php` v1.0 (742 eil., md5 `8a269aac`) — XLSX

Klasė `Petshop_Ataskaitu_Eksportas` (:24). `CAP='manage_woocommerce'` (:27), `VEIKSMAS='ps_ata_xlsx'` (:28). `add_action('plugins_loaded')` :740.

| Metodas | Eilutė |
|---|---|
| `mygtukas( $ekranas, $lt, $papildomi )` | :36 |
| `xlsx( $lapai, $failas )` | :175 |
| `atsisiusti()` | :262 |
| `lapas_zodynas( $ekranas )` | :298 |
| `lapai_surenkami( $nuo, $iki )` | :345 |
| `lapai_paruosti( $nuo, $iki )` | :564 |
| `ct($c)` (centai → EUR, 2 skaitm.) | :260 |

**Kontraktas naujai ataskaitai:** pridėti `lapai_{sritis}( $nuo, $iki )` metodą + įrašą `atsisiusti()` šakoje (:262) + `mygtukas()` iškvietimą ekrane. Žodyno lapas jau universalus (:298).

---

## 6. TRYS MODULIAI, KURIŲ PLANE NĖRA (bet jie dirba tą patį darbą)

### 6.1 `petshop-pardavimai.php` v1.0 (374 eil., md5 `51596425`) — **dubliuoja §5.4 ir §5.5**
- Šaltinis: `wc_order_product_lookup` (:66) + `wc_order_stats` (:69) — WC Analytics lookup lentelės, **HPOS**.
- `BUSENOS = "'wc-completed','wc-processing'"` (:49); `ABC_A=0.80`, `ABC_B=0.95` (:52–53); `NEGYVOS_DIENOS=90` (:56); `DIENU_RIBA=14` (:59).
- Rašo į **prekės meta**: `_ps_sales_30d` :168, `_ps_sales_90d` :169, `_ps_sales_365d` :170, `_ps_revenue_365d` :171, `_ps_orders_365d` :172, `_ps_last_sale` :173, `_ps_margin_365d` :176/:178, `_ps_dienu_atsargai` :183/:185, `_ps_sales_updated` :188, `_ps_abc` :232/:233.
- Savikaina imama iš `_vf_cost` / `_petshop_cost` (:129).
- Cron `ps_pardavimai_naktinis` :361; `wp_schedule_event( strtotime('tomorrow 04:50'), 'daily', ... )` :357. Gyvas įrašas: `2026-08-26 04:50` UTC. Rezultatas į `ps_pardavimai_naktinis_rez` :371.
- Metodai: `greitis($pid,$dienos)` :89, `savikaina($pid)` :123, `dienu_atsargai()` :137, `perskaiciuoti_abc($dry)` :200, `eile_baigiasi($riba)` :278, `eile_negyvos()` :292, `statistika()` :339.

### 6.2 `petshop-innodb.php` v1.0 (61 eil., md5 `3498f9c7`) — **§3 taisyklė 5 jau įgyvendinta**
- `add_filter('query')` :32; jei užklausa prasideda `CREATE TABLE` (:40) — priduriamas `ENGINE=InnoDB`; `CREATE TABLE ... LIKE` praleidžiamas (:49).
- **Empirinis patvirtinimas:** visos 53 `ps_*` lentelės serveryje yra `ENGINE=InnoDB ... ROW_FORMAT=DYNAMIC DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci`, nors `@@default_storage_engine=MyISAM`.

### 6.3 `petshop-statistika-vitrina.php` v1.0 (331 eil.) — nefigūruoja plane; vitrinos pusės statistika.

---

## 7. SIUNTOS — TRYS PANAŠIAI VADINAMI, SKIRTINGI DALYKAI

| Objektas | Kas tai | Kur apibrėžta | Turinys |
|---|---|---|---|
| `_ps_shipments` | **order meta, sveikas skaičius** = kiek siuntų išeis | rašo `petshop-av-order.php:88` (`count($grupes)`); skaito av-admin:75, av-order:121, av-sheets:112, siuntu-laiskai:141/:240/:346 | int |
| `_ps_siuntos` | **order meta, JSON registras** pagal sandėlį | `Petshop_Siuntos::META` = siuntu-laiskai:39 | `{sandelis:{sandelis,kodas,manifest,numeriai[],data}}` :67–73 |
| `gaj6_ps_shipments` | **DB lentelė** | `core/class-shipments.php:37` | žr. §7.2 |

### 7.1 `Petshop_Siuntos` (`petshop-siuntu-laiskai.php` v1.2 H240, 355 eil., md5 `eddc909e`)
Kabliukai: `admin_menu` :44, `admin_post_ps_siuntu_siusti` :45, `woocommerce_email_order_details` p5 :46, `woocommerce_before_order_object_save` p10 :47. **`do_action` — nėra.**

Konstantos: `META='_ps_siuntos'` :39, `SIUSTA='_ps_sekimo_siusta'` :40, `PUSLAPIS='ps-siuntos-laiskas'` :41.

Metodai: `prideti_is_plugino($order_id,$sandelis,$manifesto_kodas)` :58, `zalias($o)` :82, `sarasas($order_id)` :95, `turi($order_id)` :116, `registruota_grupiu($o)` :121, `uzbaigimo_sargas($order)` :135, `laisko_turinys($o,$prierasas)` :164, `siusti()` :196, `mixed_pastaba()` :342.

Šaltinis siuntos numeriams: order meta `venipak_shipping_order_data` → `pack_numbers[]`, `manifest` (:62–71).

### 7.2 `gaj6_ps_shipments` — DDL (23 eil. dev, AUTO_INCREMENT=28)
```
id bigint UN AI PK
shipment_id     varchar(64)  NOT NULL
order_id        bigint UN    NOT NULL
carrier         varchar(32)  NOT NULL
tracking_number varchar(64)  NOT NULL
tracking_url    varchar(255) NULL
source          varchar(32)  NOT NULL DEFAULT 'venipak_plugin'
created_at      datetime     NOT NULL
notified_at     datetime     NULL
UNIQUE order_carrier_nr (order_id,carrier,tracking_number)
KEY shipment_id, order_idx, notified
ENGINE=InnoDB utf8mb4_unicode_520_ci ROW_FORMAT=DYNAMIC
```
### 7.2a `Petshop_Shipments` — PILNAS turinys (207 eil., md5 `2c1af76b`, S319 / v0.20.0)

`const DB_VERSION='1.0.0'` :29, `OPT_DB_VER='petshop_shipments_db'` :30.

| Metodas | Eil. | Ką daro |
|---|---|---|
| `table()` | :36 | `gaj6_ps_shipments` |
| `install()` / `maybe_install()` | :40 / :64 | `dbDelta` :45–60 |
| `record($order_id,$carrier,$number,$url,$source)` | :76 | idempotentiška per UNIQUE; grąžina `added` / `exists` / `invalid` / `failed`. `shipment_id = 'shp_' . substr(md5(order\|carrier\|number),0,16)` :90. `created_at = current_time('mysql', TRUE)` → **UTC** :96 |
| `get_for_order($order_id)` | :101 | |
| `mark_notified($order_id)` | :107 | `notified_at` UTC :111 |
| `sync_from_meta($order)` | :124 | žr. žemiau |
| `resolve_all($order)` | :169 | 1) `sync_from_meta` :173, 2) skaito lentelę :176 |
| `label($carrier)` | :193 | `venipak`→Venipak, `lp_express`→LP Express :194 |
| `stats()` | :198 | `total`, `by_carrier`, `multi_orders` (order_id su >1 siunta) :201–204 |

**`sync_from_meta()` šaltiniai:**
- **Venipak:** order meta `venipak_shipping_order_data` → `pack_numbers[]` :129–133; `carrier='venipak'`, `source='venipak_plugin'`, url `https://venipak.lt/tracking/track/{nr}` :137.
- **LP Express:** order meta **`_woo_lithuaniapost_barcode`** :144 (naujas faktas — v1.0 dokumente jo nebuvo); `carrier='lp_express'`, `source='lp_express_plugin'`, url `https://www.post.lt/siuntu-sekimas?parcels={nr}` :149.

**Kvietėjai (visi, iš 137 failų grep):** `petshop-core.php:133` (`install`), `:172` (`maybe_install`), `class-event-emitters.php:150` (`sync_from_meta`, po `woocommerce_update_order`), `:228` (`resolve_all`). **Desk jos nekviečia.**

**⛔ LEMIAMA §4.3 sprendimui — failo antraštė :14–16:**
> „SĄMONINGAI NESAUGOM: sandėlio, konkrečių prekių ID. Jų patikimo šaltinio NETURIME (Venipak rašo `pack_numbers` visam užsakymui), o „inferred" reikšmės vėliau taptų melagingais duomenimis."

**`ps_shipments` neturi ir principingai neturės `sandelis` lauko.** §4.3 reikalauja siuntos **per sandėlį** → **`ps_shipments` negali būti `ps_fakt_siuntos`.**
Vienintelė vieta kode, kur sandėlis ir siuntos numeriai egzistuoja kartu, yra `Petshop_Siuntos::prideti_is_plugino()` (siuntu-laiskai:58–79) — ta pati vieta, kurią §7.3 siūlo kabliukui. Tai nepriklausomai patvirtina §15.1.

**Duomenys dev'e (23 eil.):** visi `source='venipak_plugin'`, `carrier='venipak'`; `notified_at` — **visi NULL**; `order_id` 35059–35066, bet `wc_orders` = **0 eilučių** → siuntų įrašai **našlaičiai** (užsakymai ištrinti, `ps_shipments` neišvalyta; trynimo kaskados nėra).

### 7.3 **Q7 — Desk keisti NEREIKIA**
Desk registruoja Venipak siuntas dviejuose keliuose:
- **grupinis** (`$grupes` ciklas): `self::venipak_registruoti($paprasti,$kodas)` desk:681, daugiadėžiams desk:685 → po sėkmės **desk:693–695** `Petshop_Siuntos::prideti_is_plugino($oid, $s, $kodas)`;
- **vieno sandėlio**: desk:762 / desk:766 → **desk:782–784** `Petshop_Siuntos::prideti_is_plugino($oid, $sandelis, $kodas)`.

**Abu keliai eina per tą patį `Petshop_Siuntos::prideti_is_plugino()`.** Vadinasi `do_action('petshop_siunta_sukurta', $order_id, $sandelis, $vezejas, $nr)` galima įdėti **`petshop-siuntu-laiskai.php:77`** (prieš `$o->save()`), kur jau žinomi visi keturi argumentai: `$order_id` (:58), `$sandelis` (:58), vežėjas = `venipak` (metodas skaito tik `venipak_shipping_order_data` :62), numeriai `$d['pack_numbers']` (:64,:71).

→ **`petshop-desk.php` lieka nepaliestas.** §7 taisyklė 3 nepažeidžiama, Q7 leidimo galima nenaudoti. Kaina: kabliukas nefiksuos siuntų, registruotų aplenkiant darbalaukį (tas atvejis aprašytas siuntu-laiskai:92–93) — jos matomos tik per `sarasas()` fallback'ą.

### 7.4 Desk statusai (`petshop-desk.php:275–281`)
```
neapmoketi : pending, failed, on-hold, lp-parcel-await
paruosta   : lp-label-created, lp-parcel-created, lp-courier-await, lp-courier-called
atsaukti   : cancelled, lp-cancelled, refunded
kelyje     : lp-on-the-way
ivykdyti   : completed, lp-delivered
```
`wc_get_order_statuses()` grąžina **17 statusų**: 7 WC + `wc-checkout-draft` + **9 LP Express** (`wc-lp-courier-await`, `wc-lp-parcel-created`, `wc-lp-parcel-failed`, `wc-lp-label-created`, `wc-lp-courier-called`, `wc-lp-on-the-way`, `wc-lp-delivered`, `wc-lp-cancelled`, `wc-lp-parcel-await`).

### 7.5 Desk užsakymo meta (visos rastos)
`_ps_source` :808,:1073 · `_ps_source_reason` :809 · `_ps_source_at` :810 · `_ps_source_qty` :1237,:1267 · `_ps_misrus_sprendimas` :940,:984,:1195,:2528 · `_ps_misrus_sprestas` :941,:985 · `_ps_konsolidacija` :962,:978,:979 · `_ps_klaus_laukti` :802,:813,:2673 · `_ps_pakuociu` :1104 · `_ps_tiekimas_laukia` :1198 · `_ps_withdrawal` :1216,:2687 · `_ps_withdrawal_reason` :2688 · `_ps_sla_velavimas` :1218 · `_ps_av_reduced` :1234,:1264 · `_ps_venipak_sena` :730,:774–776 · `_reduced_stock` :1234,:1264 · `_petshop_avpn_number` :3019 · `_wcdn_invoice_number` :3019 · `venipak_pickup_point` :548,:654,:740,:1857,:2053,:3028 · `venipak_shipping_order_data` :552,:555,:566,:571,:574,:728,:732,:775,:1144,:2040,:2051 · `_woo_lithuaniapost_lpexpress_terminal_id` :1121,:2089 · `_woo_lithuaniapost_lpexpress_courier_called_date` :2090.
Transientai: `ps_sheets_` :640, `ps_dropship_` :852. Options: `shopup_venipak_shipping_settings` :595,:2030, `woocommerce_weight_unit` :1137.

### 7.6 `petshop-av-dropship.php` (1175 eil.)
`_ps_dropship_sent` :162 · `_ps_dropship_to` :163 · **`_ps_dropship_sent_src` :164** · `_ps_source` :223,:272,:289,:328 · `_ps_konsolidacija` :323 · `_ps_misrus_sprendimas` :326 · `_ps_pakuociu` :702 · `_ean` :244 · `venipak_shipping_order_data` :492,:1112,:1146 · `venipak_pickup_point` :706. ZB kodas iš `ps_sources.supplier_sku` :497–501. `wc_get_orders` :364.

---

## 8. `Petshop_Fulfillment_Source` v1.0 (xml, 209 eil., md5 `b4597938`)

Dropship žemėlapis `dropship_map()` :46–69 — **keturi** įrašai:
| source | manuf substring | brand slug | label |
|---|---|---|---|
| `quattro` | `Quattro` | `quattro` | Quattro (Kauno grūdai) :48–52 |
| `ambrosia` | `Ambrosia` | `ambrosia` | Ambrosia :53–57 |
| `belcor_tofu` | `Belacor` | `belocat` | Belacor (Tofu kraikas) :58–62 |
| `prins` | `Prins` | `prins` | Prins :63–67 |

`resolve( int $product_id ): array` :82 → eilės tvarka ZB (:87) → VF (:98) → legacy dropship (:109) → `legacy` (:121). Grąžina `{source, carrier, courier_only, label, reason}` (:74–80). Visi dropship `carrier='venipak'`; `legacy` → `carrier='any'` :123.

Meta, kuriuos skaito: `_fulfillment_courier_only` :84 · `_zb_enabled` :143 · `_zb_cost` :144 · `_zb_supplier_sku` :145 · `_vf_enabled` :149 · `_vf_cost` :150 · `_vf_supplier_sku` :151 · `_legacy_manufacturer` :172.
`is_venipak_only()` :133, `is_zb()` :142, `is_vf()` :148, `detect_dropship()` :170.
**Runtime only — jokio cache, jokio `add_action`.**

`Petshop_Fulfillment` (xml/class-fulfillment.php, 100 eil.): `recalculate()` :43, `get_all_quantities()` :58, `set_wc_stock()` :70, `update_zb_qty()` :76, `update_vf_qty()` :81, `update_own_stock()` :90, `get_active_source()` :95. Meta: `_manage_stock` :71, `_active_fulfillment_source` :72,:96, `_zb_qty` :77, `_vf_qty` :82, `_own_stock_qty` :91.

---

## 9. `ps_tiekimas` / `ps_tiekimas_eil` SCHEMOS

```sql
gaj6_ps_tiekimas                          -- 0 eil. dev, AUTO_INCREMENT=10
  id bigint UN AI PK
  tiekejas         varchar(32)  NOT NULL
  busena           varchar(16)  NOT NULL DEFAULT 'kaupiama'
  sukurta          datetime     NOT NULL
  uzsakyta         datetime     NULL
  gauta            datetime     NULL
  siuntos_kodas    varchar(64)  NULL
  pastaba          text         NULL
  pristatymas      varchar(16)  NULL
  svoris           decimal(8,2) NULL
  venipak_pack     varchar(255) NULL
  venipak_manifest varchar(64)  NULL
  dezes            int          NOT NULL DEFAULT 1
  KEY tiekejas_busena (tiekejas,busena)

gaj6_ps_tiekimas_eil                      -- 0 eil. dev, AUTO_INCREMENT=17
  id bigint UN AI PK
  partija_id  bigint UN   NOT NULL     -- FK -> ps_tiekimas.id
  product_id  bigint UN   NOT NULL
  order_id    bigint UN   NULL
  qty         int         NOT NULL DEFAULT 0
  qty_gauta   int         NULL
  galiojimas  varchar(10) NULL
  pastaba     varchar(190) NULL
  KEY partija, preke, uzsakymas
```
Valdo `petshop-av-tiekimas.php`: `t_partijos()` :166, `t_eilutes()` :167, `OPT_DB='ps_tiekimas_db'` :121, `META_LAUK='_ps_tiekimas_laukia'` :122, `META_PART='_ps_tiekimas_partijos'` :153. Kabliukai: `admin_post_ps_tiekimas` :158, `admin_post_ps_tiekimas_eilute` :160, `admin_post_ps_tiekimas_lipdukas` :161. `wc_get_orders` :1312.

**Sell-through per tiekėją (§5.7, plano P1) turi šaltinį: `ps_tiekimas.gauta` + `ps_tiekimas_eil.qty_gauta`.** Dev tuščia, bet AUTO_INCREMENT rodo, kad įrašų buvo (§7 taisyklė 9 — norma).

---

## 10. `ps_email_jobs` SCHEMA (16 eil. dev, AUTO_INCREMENT=47)

```sql
id bigint UN AI PK
job_key             varchar(191) NOT NULL   UNIQUE
flow                varchar(64)  NOT NULL   KEY flow_idx
flow_class          varchar(20)  NOT NULL DEFAULT 'service'
recipient_email     varchar(191) NOT NULL   KEY recipient
recipient_user_id   bigint UN    NULL
subject             varchar(255) NULL
payload             longtext     NULL
status              varchar(20)  NOT NULL DEFAULT 'pending'
block_reason        varchar(64)  NULL
provider            varchar(32)  NULL
provider_message_id varchar(191) NULL       KEY provider_msg
attempts            smallint UN  NOT NULL DEFAULT 0
last_error          text         NULL
scheduled_at        datetime     NULL       KEY status_sched(status,scheduled_at)
sent_at             datetime     NULL
created_at          datetime     NOT NULL
updated_at          datetime     NOT NULL
skip_reason         varchar(64)  NULL       KEY skip_idx
error_message       text         NULL
decision_at         datetime     NULL
next_attempt_at     datetime     NULL       KEY status_next(status,next_attempt_at)
context_json        longtext     NULL
```
Valdo `core/class-email-dispatch.php:92`. Naudoja `core/class-cart-abandonment.php:249`, `core/class-post-purchase.php:138,:176`, `petshop-refill-ivykiai.php:99`.
`petshop-refill-ivykiai.php:13`: `refill_reminder_sent ← ps_email_jobs (flow=refill_due, status=sent)`.

**Retencijos ataskaitai (§5.9) `flow` + `status` + `sent_at` + `skip_reason` pakanka. Email revenue attribution (§5.9, „paskutinis paspaudimas 5 d.") — paspaudimo laiko lentelėje NĖRA;** yra tik `sent_at`. Atributacija turėtų remtis `sent_at` + užsakymo laiku, arba reikia naujo lauko.

`ps_event_log` (439 eil.): `event_id`, `event_name`, `email`, `payload_json`, `emitted_at`, `status`, `adapter_name`, `attempts`, `next_retry_at`, `last_error`, `esp_response`; UNIQUE `(event_id,adapter_name)`. Valdo `core/class-event-log.php:64`.

---

## 11. `petshop-akcijos.php` v1.8 (2030 eil.)

`PVM=0.21` :70, `CRON='ps_akcijos_valanda'` :71 (hourly, :105). Būsenos :74–82: `juodrastis, suplanuota, aktyvi, pasibaigusi, archyvas`. Metodai :84–90: `proc, eur, fiksuota`. Lentelė `ps_akcijos` :124. Skaito `ps_partijos` :272 (trumpų datų išpardavimas, :265). Kabliukai: `admin_menu` p11 :93, 8× `wp_ajax_ps_akc_*` :94–101, `admin_body_class` :107.

**`ps_akcijos` DDL** (2 eil.): `pavadinimas, busena, taikinys_tipas, taikinys(longtext), isimtys(longtext), metodas, reiksme decimal(10,2), apvalinti, nuo datetime, iki datetime, prioritetas, gyva, pastaba, sukurta, atnaujinta, taikyta_at, autorius`.
**`ps_akciju_prekes` DDL** (0 eil.): `akcija_id, product_id, reg_kaina decimal(12,2), akc_kaina decimal(12,2), rankinis, busena, priezastis, buvo_sale, buvo_nuo bigint, buvo_iki bigint, buvo_batch` + UNIQUE `(akcija_id,product_id)`.

→ **Promotion uplift (§5.6 P1) turi visus reikiamus faktus:** `nuo`/`iki` datos + `reg_kaina` vs `akc_kaina` prekės lygiu. Baseline skaičiuojamas iš `ps_ataskaitu_dienos` prieš `nuo`.

---

## 12. `petshop-core` — 59 failai (v0.15.0, `petshop-core.php`)

Lentelių savininkai:
| Failas | Eil. | Lentelė(s) |
|---|---|---|
| `class-shipments.php` | 208 | `ps_shipments` |
| `class-cart-tracker.php` | 317 | `ps_carts` |
| `class-cart-abandonment.php` | 434 | `ps_email_jobs` |
| `class-post-purchase.php` | 183 | `ps_email_jobs`, `wc_orders_meta` |
| `class-email-dispatch.php` | 544 | `ps_email_jobs` |
| `class-email-suppression.php` | 351 | `ps_email_suppression`, `ps_webhook_log` |
| `class-event-log.php` | 291 (v0.2.0) | `ps_event_log` |
| `class-consent-log.php` | 154 (v1.58) | `ps_consent_log` |
| `class-action-tokens.php` | 372 | `ps_action_tokens` |
| `class-plan-attribution.php` | 173 | `ps_plan_events` |
| `class-refill-engine.php` / `class-refill-feedback.php` | 494 / 333 | `ps_refill_tracking` |
| `class-reminders.php` | 291 | `ps_reminders` |
| `class-pet-*` | — | `ps_pets`, `ps_pet_products`, `ps_pet_notes`, `ps_pet_profile_drafts` |

### 12.1 `class-cart-tracker.php` — krepšelio piltuvėlis JAU renkamas
Kabliukai: `woocommerce_add_to_cart`, `woocommerce_cart_item_removed`, `woocommerce_cart_item_restored`, `woocommerce_after_cart_item_quantity_update`, `woocommerce_cart_emptied`, `woocommerce_checkout_update_order_review`.
`gaj6_ps_carts` (82 eil., AUTO_INCREMENT=135): `cart_id UNIQUE, session_key, user_id, email, email_source, last_cart_activity_at, cart_hash, snapshot_json longtext, snapshot_version, status DEFAULT 'active', status_changed_at, converted_order_id, created_at, updated_at`.
→ **`converted_order_id` + `status` duoda krepšelis→užsakymas konversiją be naujo kodo (§4A.3).**

### 12.2 `class-event-emitters.php` (318 eil.)
`woocommerce_payment_complete` p20 :30 → `on_payment_complete($order_id)` :46; fallback `woocommerce_order_status_processing` p20 :35; taip pat `woocommerce_order_status_completed`, `woocommerce_update_order`. Komentaras :132: eventas į `ps_event_log` lieka — reikalingas analitikai.

### 12.3 `class-plan-attribution.php` (173 eil.)
`init`, `woocommerce_add_cart_item_data`, `woocommerce_checkout_create_order_line_item`, `woocommerce_checkout_order_processed`, `woocommerce_store_api_checkout_order_processed` → `ps_plan_events` (7 eil.).
→ **Eilutės atributacijos kabliukų grandinė jau egzistuoja; §4.2 turi ją naudoti kaip pavyzdį, ne konkuruoti.**

### 12.4 `do_action` visame petshop-core (vieninteliai savi)
`petshop_contact_update`, `petshop_consent_changed` (class-consent-sync.php, class-unsubscribe.php) · `petshop_email_flows`, `petshop_email_eligibility`, `petshop_email_is_suppressed`, `petshop_email_transactional_only`, `petshop_email_prepare_context`, `petshop_email_provider`, `petshop_contact_used`, `petshop_email_template_path` (class-email-dispatch.php) · `petshop_get_message_provider` · `petshop_newsletter_*`, `petshop_welcome_modal_show`.
**`petshop_siunta_*` — neegzistuoja. Vardas laisvas.**

---

## 13. GLOBALUS GREP — SPRAGŲ EMPIRINIS PATVIRTINIMAS (137 failai)

| Raktažodis | Rastų | Išvada |
|---|---|---|
| `utm_source` | **0** | §1 spraga #4 patvirtinta — UTM niekur nefiksuojamas |
| `utm_` | **0** | tas pats |
| `woocommerce_order_refunded` | **0** | §4.4 grąžinimų faktas — visiškai naujas kabliukas |
| `woocommerce_product_object_updated_props` | **0** | §4.6 kainų istorijos kabliukas — naujas |
| `_ps_savikaina_vnt` | 2 (abu statistika.php) | vienintelis savikainos snapshot'as |
| `payment_complete` | 16 (5 realūs `add_action`) | av-order:40 p5, av-reduce:36 p15, partijos:581 p25, core/emitters:30 p20, core/refill-engine:101 p30 |
| `wc_get_orders` | 13 | agregavimas:269,:406; desk:1414,:1489,:1647; av-dropship:364; av-tiekimas:1312; m8-food:526; rinkiniai:3635; anketos-ataskaita:656; refill-engine:444 |
| `ps_paleidimo_data` | 4 (visi katalogas.php) | :1838 delete, :1842 update, :4576 read |

**`payment_complete` prioritetų eilė (§7 taisyklė 4 — kur įsiterps `petshop-faktai.php`):**
`5` av-order (fiksuoja šaltinį) → `15` av-reduce (mažina AV) → `20` core/event-emitters → `25` partijos (nurašo partijas) → `30` core/refill-engine → **laisva nuo 35**.
Faktų rašytojas turi eiti **po 25**, kad partijų nurašymas jau būtų įvykęs ir savikaina galutinė.

---

## 14. OPTIONS IR CRON — T-0 REIKŠMĖS

| Option | Dev reikšmė | Statusas |
|---|---|---|
| `ps_paleidimo_data` | **`2026-10-01`** | ✅ jau įrašyta |
| `ps_stat_pradzia` | **`false`** | ⛔ T-0 sąraše, neužpildyta |
| `ps_stat_pvm` | **`false`** | ⛔ `Petshop_Ataskaitu_UI::pvm()` :24–25 krenta į numatytąją |
| `woocommerce_currency` | `EUR` | ✅ |
| `woocommerce_prices_include_tax` | **`yes`** | ⚠️ žr. §15.6 |
| `woocommerce_calc_taxes` | `yes` | ✅ |

Su ataskaitomis susiję gyvi cron (UTC): `ps_ataskaitu_agregavimas` 00:15 · `ps_stat_valymas` 21:41 · `ps_pardavimai_naktinis` 04:50 · `ps_sources_naktinis` 04:20 · `ps_ivykiai_valymas` 04:40 · `ps_pilnumas_naktinis` 05:00 · `ps_akcijos_valanda` hourly · `petshop_pragma_monthly_export` 2026-09-05 08:00.

---

## 15. KĄ PLANAS TURĖTŲ KEISTI (pasiūlymai — sprendžia Raimis)

| # | Radinys | Siūlomas plano pakeitimas | Poveikis |
|---|---|---|---|
| **1** | Abu Desk Venipak keliai (desk:693–695, desk:782–784) eina per `Petshop_Siuntos::prideti_is_plugino()` (siuntu-laiskai:58) | **Q7 nereikalingas.** `do_action('petshop_siunta_sukurta', …)` dėti į `petshop-siuntu-laiskai.php:77`, ne į Desk | Desk lieka neliestas; §7 taisyklė 3 nepažeidžiama |
| **2** | `ps_shipments` **sąmoningai nesaugo sandėlio** (class-shipments.php:14–16) | §4.3 `ps_fakt_siuntos` **turi būti atskira lentelė**, su nuoroda į `ps_shipments.shipment_id`. Sandėlis ateina iš §15.1 kabliuko | Sprendimą praktika priima už mus |
| **3** | `ps_carts` (82 eil.) su `converted_order_id`, `status`, `snapshot_json` | §4A.3 krepšelio piltuvėlis — imti iš `ps_carts`, ne rinkti iš naujo | Sutaupo E2 apimtį |
| **4** | `petshop-pardavimai.php` v1.0 jau skaičiuoja ABC, 30/90/365 d., maržą, dienas atsargai | §1 inventorių papildyti; §5.4/§5.5 — perrašyti kaip „ekranas ant esamų `_ps_*` meta", ne naujas variklis | Sutaupo E5 |
| **5** | `petshop-innodb.php` priverstinai daro `ENGINE=InnoDB` (:32, :40); visos 53 `ps_*` lentelės jau InnoDB | §3 taisyklė 5 — informacinė, ne veiksmas | — |
| **6** | `woocommerce_prices_include_tax=yes` — **kainos saugomos SU PVM** | §3 taisyklė 3 („centais, be PVM") reikalauja konversijos **rašymo** momentu; `Petshop_Ataskaitu_UI::be_pvm()` (:29) taikomas ekrane. Nurodyti aiškiai, kur PVM nuimamas | Dvigubo nuėmimo rizika (S842 pamoka) |
| **7** | 17 užsakymo statusų, iš jų 9 LP Express | §4.1 `busena` = varchar; §5.x filtrai turi naudoti Desk `STATUSAI` žemėlapį (desk:275–281), ne WC 7-etą | Praleisti užsakymai KPI |
| **8** | Savikaina jau užšaldoma (`_ps_savikaina_vnt`, 4 skaitm. EUR) | §4.2 — **kopijuoti** iš eilutės meta į faktą, ne perskaičiuoti | §0 „faktas užšaldomas" jau galioja eilutėms |
| **9** | `agregavimas::pardavimai()` (:282–405) jau moka MNM/DP/dovanų išpjaustymą | §4.2 — perimti tą logiką | Sutaupo E1a |
| **10** | `payment_complete` prioritetai užimti iki 30 | §7 taisyklė 4 papildyti: faktų rašytojas prioritetu **≥35** | Savikaina/partijos dar nebūtų nurašytos |
| **11** | `ps_email_jobs` turi `sent_at`, bet **neturi paspaudimo laiko** | §5.9 email atributacija — arba remtis `sent_at`, arba §4.x pridėti lauką (kontrakto keitimas = versija) | „Paskutinis paspaudimas 5 d." neįgyvendinamas kaip aprašyta |
| **12** | `ps_akcijos` + `ps_akciju_prekes` turi `reg_kaina`/`akc_kaina`/`nuo`/`iki` | §5.6 promotion uplift — šaltinis yra, naujų faktų nereikia | — |
| **13** | `ps_tiekimas.gauta` + `ps_tiekimas_eil.qty_gauta` | §5.7 sell-through per tiekėją — šaltinis yra | — |
| **14** | Trys panašūs vardai: `_ps_shipments` (int), `_ps_siuntos` (JSON), `ps_shipments` (lentelė) | §4.3 įrašyti įspėjimą; **nevadinti** naujo lauko `_ps_siuntos*` | Painiavos rizika |
| **19** | `ps_shipments` turi 23 našlaičius įrašus (order_id 35059–35066, o `wc_orders`=0); trynimo kaskados nėra | **T-0 papildymas:** ištrynus testinius užsakymus (§4.9 / Q8) papildomai išvalyti `ps_shipments`, `ps_carts`, `ps_ataskaitu_dienos` sritis `pardavimai` ir `parduotuve` | Kitaip §5.1 #9 ir §5.2 rodys testinius pinigus |
| **20** | `agreguoti_diena()` persuka tik `PERSUKTI=3` paskutines dienas (agregavimas:28) | Testinių užsakymų trynimas **neišvalys** senesnių nei 3 d. agregatų. Dev'e `parduotuve/pajamos` = 781,51 € iš 21 neegzistuojančio užsakymo | T-0 rizika |
| **21** | LP Express siuntos numeris = `_woo_lithuaniapost_barcode` (class-shipments.php:144) | §4.3 `vezejas` reikšmes užrakinti: `venipak` / `lp_express` (class-shipments.php:194) | — |
| **15** | Versijos §1 lentelėje pasenusios (statistika 2.1→2.2) | Atnaujinti §1 pagal §1 šio dokumento | — |
| **16** | `Petshop_Statistika::aplinka()` (:362–365) jau sprendžia dev/prod pagal hostą | §3 taisyklė 4 — `ps_fakt_*.saltinis_aplinka` naudoti **tą patį** metodą | Po DNS cutover veiks automatiškai |
| **17** | `SAUGOMOS_SRITYS` (:84) — **sričių**, ne lentelių sąrašas | §3 taisyklė 9 formuluotė netiksli: valymas (`valyti()` :495) dirba `ps_laukai_ivykiai` viduje ir `ps_fakt_*` fiziškai neliestų. Patvirtinti kode vis tiek verta | — |
| **18** | `ps_stat_pvm` ir `ps_stat_pradzia` dev'e neegzistuoja | Patvirtinta: abu T-0 sąraše teisingai | — |

---

## 16. `ps_ataskaitu_dienos` — REALUS TURINYS (269 eil., visos `aplinka='dev'`)

| sritis | tipai (eilučių) | laikotarpis | pinigai |
|---|---|---|---|
| `laukai` | `rodyta` (135), `idejo` (18), `atidare` (17), `iseme` (12), `iseme_p1` (10), `dovana_rinko` (5), `iseme_p2` (5), `iseme_p3` (5), `dydis_perjunge` (4), `dovana_atrakinta` (2), `kabliukas` (2), `min_pasiekta` (2), `riba_pasieke` (2), `krepselis` (1), `riba_pasieke_krepselis` (1), `uzdarytoja` (1) | 08-16…08-23 | 0 |
| `pardavimai` | `parduota` (12), `atskirai` (2), `be_sav_suma` (1), `be_savikainos` (1), `dovana` (1), `parduota_sd` (1) | 08-15…08-23 | `parduota`: 9 624 ct pajamų / 3 216 ct savikainos |
| `parduotuve` | `pajamos` (4) | 08-05…08-23 | **78 151 ct (781,51 €), 21 užsakymas** |
| `piltuvelis` | `atidare` (17), `idejo` (2), `krepselis` (1), `min_pasiekta` (2) | 08-16…08-23 | 0 |
| `refill` | `refill_due` (2), `refill_reminder_sent` (1) | 08-20…08-24 | 0 |

**Sritys `anketa` ir `rec` — 0 eilučių**, nors plano §1 jas mini kaip veikiančias.
**Tipai, kurių nėra `petshop-statistika.php` komentare :406–413:** `iseme_p1/p2/p3`, `kabliukas`, `riba_pasieke`, `riba_pasieke_krepselis`, `uzdarytoja`, `atskirai`, `parduota_sd`. Rašytojai yra už `petshop-statistika.php` ribų (`petshop-laukai.php`, `agregavimas::pardavimai()` :359+) — neištirta.

**`ps_carts` būsenos (82 eil.):** `expired` 46 · `abandoned` 31 · `converted` **4** (visi su `converted_order_id`) · `active` 1. → krepšelis→užsakymas konversija dev'e matoma ir veikia (§15.3 patvirtinta duomenimis).

---

## 16A. KO NEPADARIAU (sąžiningai)

- **Neskaičiau viso `petshop-desk.php` (3 730 eil.) ir `petshop-katalogas.php` (8 810 eil.)** — tik ištraukas ir grep. Jei E1b reikės daugiau Desk vidaus, reikės atskiro skenavimo.
- Neišnagrinėjau, **kas rašo** `ps_ataskaitu_dienos` tipus `iseme_p1/p2/p3`, `kabliukas`, `uzdarytoja`, `parduota_sd`. Prireiks E3 metu (§5.0/§5.2).
- Vizualaus patikrinimo (`browser=1`) nedariau — E0 yra skaitymo etapas, ekranų nekeičiau.

**v1.0 §16 spragos — uždarytos:** `class-shipments.php` turinys (§7.2a), `ps_ataskaitu_dienos` pjūvis (§16), `ps_shipments` duomenys (§7.2a).

---

## 17. ATVIRI KLAUSIMAI RAIMIUI PRIEŠ E1a

| # | Klausimas |
|---|---|
| **Q-E0-1** | §15.1 — ar sutinki, kad `do_action('petshop_siunta_sukurta')` eitų į `petshop-siuntu-laiskai.php:77`, o `petshop-desk.php` liktų visiškai nepaliestas? |
| **Q-E0-2** | §15.2 — **atsakyta recon'u:** `ps_shipments` sandėlio nesaugo principingai (class-shipments.php:14–16) → `ps_fakt_siuntos` turi būti atskira lentelė. Reikia tik tavo patvirtinimo. |
| **Q-E0-3** | §15.4 — `petshop-pardavimai.php` palikti kaip yra ir §5.4/§5.5 statyti ant jo meta, ar perkelti į faktus? |
| **Q-E0-4** | §15.6 — kur nuimam PVM: rašymo momentu ar ekrane? (kainos DB saugomos SU PVM) |
| **Q-E0-5** | §15.11 — email atributacija be paspaudimo laiko: `sent_at` bazė ar naujas laukas kontrakte? |
| **Q-E0-6** | ~~papildomas recon runas~~ — **uždaryta** (#4949). |
| **Q-E0-7** | §15.19/§15.20 — ar T-0 sąrašą papildom: išvalyti `ps_shipments` + `ps_carts` + `ps_ataskaitu_dienos` testinius įrašus? |

---

**Statusas: E0 baigtas, spragų nėra. Kodo nerašyta. Laukiu „toliau“ arba „taisyti“ prieš E1a.**
