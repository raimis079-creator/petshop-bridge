# deployment_log v1_9_61 — S1673 (2026-09-11 naktis) — MC patikra, C etapas: konversijų signalas, GTM v8

## GYVAI
| # | Kas | Kur | Backup / įrodymas |
|---|---|---|---|
| 1 | **GTM v8 paskelbta** (23:35, Raimis): „01 — Conversion Linker" ir „03 — Google Ads Conversion (Purchase)" — papildomas consent reikalavimas (`ad_storage`, `ad_user_data`) nuimtas → `consentStatus: notNeeded`; tag'ai šauna ir be sutikimo cookieless režimu (advanced Consent Mode; default/update tvarko snippet #619). Pridėtas kintamasis `DLV — user_data` (dar nenaudojamas). | GTM-MF3GZGT, konteineris 101921278, workspace 9 „S1673 consent + EC" → versija 8 | Ankstesnė versija v7 (rollback: GTM → Versijos → v7 → Publish). API rezultatai `analize/s1673_gtm_w.json`, `s1673_gtm_w2.json` |

Svetainės kodas neliestas. TEMP snippet'ai išjungti (likę neaktyvūs #5424/#5584/#5589 — trinti rankomis).

## MC 5321054797 (API, ~21:30)
- `missing_shipping_weight` = **0** (buvo 715) — feeds v2.4.1 suveikė. 2184/2184 su svoriu, feed amžius 139 min.
- Visos 2184 „pending initial review". Shopping dis 65: nuotraukos apdorojamos 113 (savaime), politikos 11, JOS0694.
- Nauja NOT_IMPACTED: 948 be `unit_pricing_measure` — nekritiška, galima pridėti feede vėliau.
- Rezultatas `analize/s1673_mc.json`; įrankiai `irankiai/s1673_mc.php`, `mjs_template_mc_readonly_s1672.mjs`.

## C etapas — konversijų signalas (read-only faktai)
- **Serveris** `ps_fakt_uzsakymai` nuo T-0 (09-08): 23 apmokėti, €715 (≈5,8/d); gclid 9/23; kanalas „mokamas" 11. `analize/s1673_c1.json`, `s1673_c2.json`.
- **Ads „Purchase" (awct, primary, 6480284123, `AW-11117260149/7JbYCNuThZIYEPXaj7Up`)**: 09-01…07 ≈5,7 konv./d, €231/d; 09-08…11 → 2 / 0 / 0,9 / 1 (€212 iš viso). **Ads matė ~20 % pirkimų.** GA4-based „petshop.lt (web) purchase" (serverio MP) matė 12/23. `analize/s1673_konv.json`.
- **Priežastis**: GTM awct + Linker turėjo papildomą consent „needed" → be Complianz „marketing" sutikimo tag'as neiššaudavo (sena parduotuvė vartų neturėjo). GTM Consent Mode default tag pauzuotas — nereikalingas, default/update daro snippet #619 „Consent Bridge v1.2".
- **EC (Enhanced Conversions)**: neįjungta; svetainė `user_data.sha256_email_address` į dataLayer nesiunčia (#614 „Petshop DataLayer v1.1" — tik ecommerce). Ads customer data terms priimtos.
- Kampanijos 09-08…11: šunų €78 / 208 cl / 1 konv; kačių €82 / 251 cl / 1 konv; search €10 / 58 cl / 1,9 konv. Abi PMax „Riboto biudžeto" — mokosi iš ~1 konv./d.
- GTM struktūra: 13 tag'ų, DEV blokai (dev.avesa.lt / gtm_test=1), Complianz cmplz_consent_update trigeriai. GTM paskyra 6071827163, SA turi `tagmanager.edit.containers`.
- Ads conversion actions: 8 (Purchase primary; GA4 import purchase/add_to_cart/begin_checkout/Email/Phone secondary; awct Add to cart, begin_checkout secondary).

## Įrankiai repo
`irankiai/petshop_ads_konv_recon_v1_0.js`, `v1_1.js` (GAQL reikia `BETWEEN` datų), `irankiai/mjs_template_gtm_readonly_s1673.mjs` (dabar su rašymo bloku — workspace/tag PUT), `irankiai/s1673_c1.php`, `s1673_c2.php`, `s1673_mc.php`.

## Pamokos
- GAQL su `segments.date` reikia uždaro intervalo (`BETWEEN`), `>=` neužtenka.
- GTM API: `consentSettings.consentStatus: notNeeded` nuima papildomą consent; EC per API reikalauja „User-Provided Data" tipo kintamojo (`cssProvidedEnhancedConversionValue`), ne DLV.
- Sutikimo vartai ant awct = signalo praradimas; advanced CM (built-in consent) — standartas ES.

## Atvira
- Rytoj: ar Ads „Purchase" grįžo į ~5/d (recon v1.1 su IKI = rytojaus data).
- EC: #614 v1.2 — pridėti `user_data.sha256_email_address` prie purchase push (WC billing email, sha256, lowercase/trim) + GTM „User-Provided Data" kintamasis + Purchase tag'e EC → v9.
- Offline click conversions iš `ps_fakt_uzsakymai` (gclid 9/23) — prie D.
- MC unit_pricing_measure 948 — vėliau.
