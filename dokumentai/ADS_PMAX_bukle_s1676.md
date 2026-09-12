# ADS / PMax — pertvarkos logika ir būklė (S1676, 2026-09-12 ~17:00)

Vienas dokumentas Ads temai. Planas: `PMAX_D_planas_s1674.md`. Log'ai: `deployment_log_v1_9_61..62`. Kitas langas — nuo šio dokumento.

## 1. Kas išsiaiškinta (faktai su įrodymais)

### 1.1 Konversijų signalas (C etapas) — priežastis rasta ir pataisyta
- Svetainės Consent Mode v2 default buvo **visi denied** (snippet #619 „Consent Bridge"), granted tik po Complianz „allow". Ads tag'as sutikimą gerbia visada → be sutikimo siunčia tik cookieless ping'ą, konversija neužskaitoma. GA4 tag'ui GTM v8 uždėjo „consent not needed", todėl GA4 matė, Ads ne.
- Įrodymas užsakymų lygiu (`irankiai/s1676_w.php`, WC atribucija su gclid):

| Diena | WC viso | WC iš Ads (gclid) | Ads „Purchase" | GA4 purchase |
|---|---|---|---|---|
| 09-10 | 10 | 6 (€169) | 0,9 | 7 |
| 09-11 | 7 | 4 (€104) | 1 | 3 |
| 09-12 (iki 15:44) | 2 | 1 (€15) | 0 | 1 |

- **Pataisyta gyvai 09-12 ~16:00**: snippet #619 → v1.3 — `ad_storage`/`ad_user_data` granted (default ir po update), `ads_data_redaction` off; `ad_personalization`, `analytics_storage` pagal sutikimą. Bak `ps_snippet619_bak_s1676` (opcija), repo `deploy/snippet-619-consent-bridge-v1.3.js`. Patikrinta: svetainė siunčia granted.
- Raimio principas: renkamės tikslumą, ne paprastumą → Ads tag'as (EC + transaction_id) lieka primary; GA4 — antrinis (vėluoja iki paros, savas atribucijos modelis). Senos svetainės neatitikimai = tag'o konfigūracijos (be transaction_id), ne principo.
- **Matas nuo dabar**: kasdien Ads „Purchase" vs WC iš Ads ±1 (s1676_w.php vs konv recon). Ads konversijos skaičiuojamos pagal paspaudimo datą, WC — pagal užsakymo.
- Laukia: Tag Assistant ant `https://petshop.lt/kasa/order-received/35907/?key=wc_order_V5yjUvZrUAp3k` — ar „Purchase" siunčia transaction_id/value/currency, consent granted.

### 1.2 PMax kampanijos — BE Merchant Center
- `petshop_pmax_d_bukle_v1_2.js` (16:46): abi PMax kampanijos `shopping_setting.merchant_id = null`, Generic grupė be listing filtrų. T. y. **prekių (Shopping) skelbimų PMax niekada nerodė** — tik Generic tekstus/nuotraukas. Feed'o prie esamos kampanijos prisegti negalima → reikia naujos retail kampanijos.
- MC 5321054797: 2184 prekės „pending initial review" (iki ~09-15), weight 0 klaidų, politikos 11, GTIN 4, nuotraukos <500 px 270.

### 1.3 Ads Scripts API pamokos (v25) — kad nekartoti
- `campaign.url_expansion_opt_out` lauko nebėra (nei mutate, nei GAQL) → URL expansion išjungti UI.
- Generic turi 7 DESCRIPTION / 6 LONG_HEADLINE (senų limitų) → kopijuojant riboti 5 antr. / 3 ilgos / 4 apr.
- Asset grupė kuriama turi tame pačiame mutate turėti MARKETING + SQUARE nuotraukas.
- Listing filtrų temp ID sudėtinis: `assetGroupListingGroupFilters/-1~-10`; `listingSource:'SHOPPING'` privalomas, bet leidžiamas tik kampanijoje su MC.
- `mutateAll(..., {partialFailure:false})` — grupė atsisuka atgal visa, jei bent vienas op klaidingas; rezultatai skaitomi per `ps_ads_recon` (`s1673_r.php`).
- Raimis skriptų neredaguoja — visada atskiras paruoštas failas (`_RUN` variantas).

## 2. Kas gyvai pakeista Ads (09-12)
- Kampanija 21472017542 → **„P-max | LT | petshop.lt"**, biudžetas **€40/d** (buvo €20), be feed'o, Generic grupė veikia toliau.
- Kačių kampanija 21565450990 → **PAUSED**.
- D grupių NĖRA (visi bandymai atsisuko atgal). Būklė švari.

## 3. Kitas žingsnis — v2.0 (paruoštas, dar NEPALEISTAS)
`irankiai/petshop_pmax_d_v2_0_RUN.js`:
- Sukuria **„P-max | LT | Prekės (MC)"** — PMax su MC 5321054797, LT (geo 2440), maximize conversion value be tROAS (mokymuisi), **PAUSED**, biudžetas €25; senai kampanijai biudžetas → €15 (viso €40, nekeliam).
- Joje D1–D6 grupės PAUSED: tekstai/video iš Generic (5/3/4/1), ps_* nuotraukos pagal manifest temą (D1 15, D2 9, D3 12, D4 14, D5 12, D6 20), listing medis brand → custom_label_0/1/2 su „kita" UNIT_EXCLUDED, final URL `/gamintojas/<brand>/` arba kategorija (visi 200).
- Rizika: jei MC neprisegtas prie Ads paskyros — kampanija nesusikurs, log parodys → prisegti UI (Tools → Linked accounts).
- Po sėkmės: būklė `petshop_pmax_d_bukle_v1_2.js`; įjungti kampaniją + grupes, kai MC prekės approved; URL expansion OFF (UI); Hikari/Ambrosia nuotraukos (D7/D8); E tekstai; F kontrolė; tROAS po ~2–3 sav.
- Rollback: naują kampaniją PAUSE/REMOVE, senai biudžetas €40, kačių UNPAUSE.

## 4. Sprendimai (Raimis: „tavo planas, pasitikiu, reikia rezultato")
Ontario katėms 8 nuotr.; Hikari/Ambrosia po D1–D6; Generic katės nekuriama; tROAS vėliau; struktūra kuriama nelaukiant signalo (sutikimas pataisytas); tikslumas > paprastumas.

## 5. Įrankiai
`petshop_ads_konv_recon_v1_3.js` (IKI keisti failu), `petshop_pmax_d_bukle_v1_2.js` (read-only), `s1673_r.php` (ps_ads_recon skaitymas per bridge), `s1676_w.php` (WC Ads atribucija pagal dieną), `petshop_pmax_d_v2_0_RUN.js`. Bridge: `apt-get install -y php-cli`, `mjs_template.mjs` → `/home/claude/ps/`, `run.sh` (chmod +x), rezultatas per commit SHA `raw.githubusercontent.com`.
