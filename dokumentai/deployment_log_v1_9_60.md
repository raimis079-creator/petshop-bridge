# deployment_log v1_9_60 — S1672 (2026-09-11 vakaras) — MC pirmas fetch + svoriai (feeds v2.4.1), PMax asset nuotraukų mainai

## Pakeitimai GYVAI (visi su backup, visi patikrinti)

| # | Kas | Failas / vieta | md5 po | Backup |
|---|---|---|---|---|
| 1 | **feeds v2.4.1** — TIK Google XML: `g:shipping_weight` VISADA (MC atmetė 715 prekių `missing_shipping_weight`, nes MC tarifai pagal svorį; WC be `_weight` 927 publish). Nauja `ps_feeds_google_svoris()`: WC `_weight` > 0 → kitaip iš pavadinimo (`kg/g/l/ml`, paskutinis atitikmuo, „6 x 400 g" → 0,4) → kitaip 0,5 kg (Raimio „daryk"). Rezultatas: 2184/2184 su svoriu (818 numatytasis 0,5), in_stock 2115/69, Kaina24/Kainos nepaliesti. Deploy: md5 prieš `ecd8a18c…` ✓, token_parse 9107, heartbeat 200, regeneracija 17,5 s. MC fetch paleistas per API (`dataSources/10727325747:fetch` 200). | `plugins/petshop-feeds/petshop-feeds.php` v2.4.1 | a5d344e6425b1bb2a512b1fac057ffcd | `uploads/ps-backups/petshop-feeds.php.bak_s1672` (v2.4.0), `google.xml.bak_s1672`; repo `deploy/petshop-feeds-v2.4.1.php`, įrankis `irankiai/s1672_d.php` (D,G,V) |
| 2 | PMax nuotraukų talpykla: 84 jpg (28 prekės × kvadratas 1200×1200 / horiz. 1200×628 / vert. 960×1200, baltas fonas) + `manifest.json` (grupė dogs/cats, lauko tipas). NE media bibliotekoje. Perkelta per TEMP REST `ps-web/v1/pmax-img` (raktas `ps_ads_raktas`), 85/85, HTTP 200. | `uploads/pmax-s1672/` (11,1 MB) | — | repo `pmax_s1672/` (visi failai), `irankiai/s1672_p.php` |

## Google Ads pakeitimai (Raimis Run per „Petshop recon" skriptą)
- **swap v1.3** (22:08–22:14): 84 `ps_*` image asset'ai sukurti bibliotekoje (83 pavyko; `ps_03_konservai_sunims_ontario_mono_pt` nesusikūrė), 40 senų nuotraukų NUIMTA iš „Generic | Šunų maistas" (4 ls/10 sq/6 pt) ir „Generic | Kačių maistas" (6/7/7); 84 `addAsset` klaidos „bandykite vėliau" (dalis vis tiek prikabinta).
- **attach v2.0/v2.1**: +2, likusios klaidos. **Tikra priežastis: PMax limitas — 20 nuotraukų VIENAI asset grupei iš viso (ls+sq+pt kartu), ne 20 per formatą.**
- **Galutinė būklė**: abiejose grupėse TIK `ps_*` prekių nuotraukos, senų 0: šunų 3 ls / 10 sq / 6 pt, kačių 5 / 7 / 7 (≈20, pilna). AD_IMAGE, logo, tekstai, video, biudžetai, tROAS — neliesti. Likę ~45 `ps_*` asset'ai bibliotekoje — D etapui (~7 asset grupės po 20).
- **Archyvas prieš mainus** (90 d. asset_group_asset rodikliai, 06-13…09-11): WP `ps_ads_recon` 21:56:33 + repo `analize/_pmax_arch_s1672_note.md`. Senos nuotraukos ≤3 konv. per 90 d. Tekstai E etapui: šunų „Šunų maistas. Internetu." 22,9 konv./€1 124, „Mėsingi konservai šunims" 13,9/€622, „Premium Klasės Šunų Maistas" 10,4/€610; kačių description „Katėms dėl mitybos disbalanso…" 168,9 konv./€6 518 (dominuoja), „Kačių konservai. Užsakykite." 85 paspaud./0 konv.
- Skriptai repo `irankiai/`: `petshop_ads_asset_swap_v1_0…v1_3.js`, `petshop_ads_asset_attach_v2_0.js`, `v2_1.js`. Senų nuotraukų kopijos `analize/pmax_img_s1672.json` (46).

## MC 5321054797 (read-only per Merchant API v1 — v1beta nebeveikia nuo 2026-02-28)
- Pirmas fetch (Raimio UI source „PRODUCTS SOURCE 1", en, PETSHOP_LT, 03:00): 2184 prekės, atributai atpažinti; įspėjimas „Item uploaded through multiple feeds" — senas ištrintas source, išnyks savaime. **Kalba en — jokios problemos, tema uždaryta.**
- Būsena: visos 2184 „pending initial review" (iki 3 d. d.). Shopping Ads klaidos: `missing_shipping_weight` 715 (sutvarkyta #1), politikos: gyvi gyvūnai ×7 (žaislai/semtuvėlis/dubenėliai — klaidingi), alkoholis ×1 (kiaulės knyslė 708001), sveikatos teiginiai ×2 (DOGOTEKA 01DOG0102/0202), narkotikai ×1 (CBD VET1200), nuotraukos formatas ×1 (JOS0694), GTIN neteisingi ×4 (V004978/9, TX-92576, RC102040); 270 nuotraukų <500 px (būsimas reikalavimas). Jaučio peniai ×4 — tik Demand Gen/Video.
- MC pristatymo lentelė: svorio eilutės 25/50/70/100 kg (galimai turėjo būti 2,5/5/7/10 — visos prekės papuola į pirmą eilutę, nekritiška).
- Įrankiai: `irankiai/mjs_template_mc_readonly_s1672.mjs`, `irankiai/s1672_mc.php`, `s1672_w.php`; rezultatai `analize/s1672_mc2.json`, `s1672_mc3.json`, `s1672_w.json`.

## Pamokos
- PMax: 20 nuotraukų per asset grupę IŠ VISO — tikrinti prieš planuojant kiekius.
- Ads Scripts `assetGroup.addAsset()` klaidų nemeta — kūrimą ir prikabinimą daryti atskirais paleidimais, rezultatą tikrinti per Scenarijaus istoriją (Sėkminga/Klaidos), ne tik per GAQL toje pačioje sesijoje (vėluoja).
- Merchant API: naudoti `v1`, `products` list per `accounts/{id}/products?pageSize=250`.
- Raimio taisyklė pakartota: neduoti Raimiui rinktis iš 472 — atrinkti pačiam, duoti tvirtinti.
- Chrome failų dialogo kabimas (Raimis) — sprendimas rastas jo pusėje, ne mūsų.

## Atvira
- MC „Request review" 11 klaidingai atmestoms (Raimis, po pradinės peržiūros); CBD VET1200 tikėtina liks atmesta.
- 4 GTIN pataisyti kortelėse; JOS0694 nuotrauka; 270 nuotraukų <500 px.
- Ontario 12 kg nuotraukos 430×756 — per mažos PMax; reikia tiekėjo nuotraukų.
- `ps_03_konservai_sunims_ontario_mono_pt` bibliotekoje nesukurta.
- Šunų grupėje horizontalių tik 3 (kvadratinių 10) — Claude siūlo palikti.
