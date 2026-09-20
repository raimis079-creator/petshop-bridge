# S1701 — Sprintas 1 / 1.8 Product schema + AI botai — 2026-09-20 (naktį)

Tas pats langas. Įrankiai `irankiai/s1701_ma.php` (JSON-LD/robots/Rank Math recon), `s1701_mb.php` (pristatymo zonos, puslapiai, logo), `s1701_md.php` (esamo `petshop-schema.php` patikra), deploy `s1701_mc3.php` (fazės 1 deploy su bak / 2 patikra 4 prekės / 9 išjungti), `s1701_me.php` (Super Cache išvalymas).

## 1. Kas buvo
- Rank Math (moduliai sitemap, rich-snippet, woocommerce) prekės puslapyje išveda vieną JSON-LD grafą: Organization (tik name), WebSite, ImageObject, ItemPage, **Product** (`#richSnippet`) + `petshop-schema.php` v1.0.2 (S8) BreadcrumbList. WC struktūrinių duomenų dubliavimo nėra.
- Product trūko: **brand**, `gtin13` (buvo tik `gtin`), **offers.shippingDetails**, **offers.hasMerchantReturnPolicy**, `name` su „ - Petshop.lt", description su HTML esybėmis (`&lt;p&gt;`), `additionalProperty` vardai `pa_gyvuno_rusis`, `seller.logo` tuščias. Google Merchant listings dėl to rodo įspėjimus; AI botams brendas/pristatymas neaiškūs.
- robots.txt: AI botai (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot) **neblokuojami** ✓; `llms.txt` 404 (Rank Math llms išjungtas; mažos vertės, neliesta); sitemap 200.
- Pristatymo faktai (WC zonos + `/pristatymas/`): Venipak paštomatas €1,78 (LT), kurjeris €3,30, **nemokamas į paštomatą nuo €30**, išsiuntimas 1–3 d. d.; grąžinimas 14 d. **ne maisto** prekėms (`/grazinimas/`).

## 2. Padaryta — naujas mu-plugin `petshop-schema-prekes.php` v1.0 GYVAI
Klasė `Petshop_Schema_Prekes`, md5 **226ed97f**, repo `deploy/petshop-schema-prekes-v1.0.php`; filtras `rank_math/json_ld` prio 99 (greta takelio plugino `petshop-schema.php` — vardas užimtas, todėl atskiras failas); išjungimas — opcija `ps_schema_prekes_isjungta=1` arba `s1701_mc3.php` fazė 9.
- Organization: url, **logo** (Flatsome `site_logo` → `uploads/2026/05/logo.jpg`), telephone +370 681 87787, PostalAddress (Liucionių g. 46, LT-15166), legalName UAB Avesa.
- Product: `name` = prekės pavadinimas; `description` iš trumpo aprašymo be HTML/esybių (iki 500 ž.); **`brand`** iš `product_brand`; **`gtin13`** (13 skaitmenų) / gtin8 / gtin14; `sku` + `mpn`; `additionalProperty` su atributų pavadinimais („Baltymų šaltinis", „Pakuotės dydis"), tušti išmesti.
- Offer: `url`; **`shippingDetails`** — LT, paštomatas €1,78 arba **€0,00 kai kaina ≥ €30**, kurjeris €3,30 kai svoris > 25 kg; handlingTime 0–2 d., transitTime 1–2 d.; **`hasMerchantReturnPolicy`** — maistui/skanėstams/konservams `MerchantReturnNotPermitted` (CK), kitiems 14 d. `ReturnByMail`, `ReturnShippingFees`.
- Patikra gyvai (4 prekės: Trixie laipteliai, BeloCat kraikas, Exclusion 7 kg, Animonda 800 g): JSON validus, brand/gtin13/shipping/return/logo yra; Super Cache išvalytas, kad seni puslapiai atsinaujintų.

## 3. Matavimas
GSC → Merchant listings / Product snippets: įspėjimų „Missing field brand / shippingDetails / hasMerchantReturnPolicy" skaičius per 2 sav. → 0. MC „free listings" — patikrinti po 1–2 sav.

## 4. Pastabos
- Kraiko prekėse atributas „Baltymų šaltinis=Ėriena" (BeloCat #17689) — duomenų klaida kataloge, ne schemos.
- AI citavimui toliau: `/skaiciuokle/` (1.7) ir veislių puslapiai su aiškiais faktais — turinys, ne schema.
- Sprintas 1 (C dalis) uždarytas: 1.1, 1.3, 1.5, 1.6, 1.8 ☑; liko 1.7 (rytoj), 1.2 (R registracija Bing), 1.4 (R). Prefiksas kitam langui `s1702_m*`.
