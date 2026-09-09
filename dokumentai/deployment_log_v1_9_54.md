# deployment_log v1_9_54 — S1665 (2026-09-09 vakaras) — Sender webhook + Ads recon

## SENDER (Claude pusė BAIGTA)
1. Endpoint: POST `/petshop/v1/sender-webhook` (pluginas **petshop-esp**, `class-webhook-receiver.php`).
   Parašas: HMAC-SHA256 raw body, header `x-sender-signature`, secret opcija
   `petshop_esp_sender_webhook_secret` (40 zn., greičiausiai senas — laukia tikro iš Sender UI).
2. **Receiver v2 GYVAI** md5 `c7aff479f99a69191ec0df25cc43cec7` (buvo `24fde3ad…`, backup
   `.bak-s1665`, repo bus deploy/): + žalias žurnalas `ps_sender_webhook_log` (rolling 20,
   header'iai+body — Sender payload formos diagnostikai), + `bounces/new` case → bounce kelias,
   + topic fallback iš `&ps_topic=` URL parametro (Sender payload gali neturėti type),
   + `groups/unsubscribed` → sąmoningas no-op (grupės palikimas ≠ globalus unsubscribe).
3. E2E ✓: POST su teisingu HMAC + ps_topic=bounces/new → 200, suppression įrašai
   (marketing+transactional) sukurti ir išvalyti, žurnalas fiksavo. Be rakto — 401/403 ✓.
4. **🔴 ABU Sender API tokenai (petshop_esp_sender_mk/tk) NEBEGALIOJA** — 401 net /groups.
   Dispatch sluoksnis negali siųsti per Sender. WooCommerce transakciniai per SMTP nepaliesti.
5. Sender webhooks faktai (help doc 2026-04): konfigūracija TIK UI (Account settings→Webhooks),
   1 topikas/webhook, account-level Signing secret; 8 topikai; **delivered/opened topikų NĖRA**
   (analitika delivered_at/opened_at liks per API reconcile vėliau).
   `/v2/hooks` POST egzistuoja bet 401 su mūsų tokenais; `/v2/webhooks` 404.
6. **RAIMIO VEIKSMAI (perduota):** (a) naujas API tokenas → Claude įrašys į DB;
   (b) 3 webhooks: URL `https://petshop.lt/?rest_route=/petshop/v1/sender-webhook&ps_topic={topikas}`
   topikams subscribers/unsubscribed, subscribers/updated, bounces/new;
   (c) Signing secret copy → Claude įrašys.

## ADS (recon BAIGTAS, APPLY #1 paruoštas siųsti)
1. Priėmiklis: snippetas **5353** „Petshop Ads Recon Priemiklis v1.0" — REST `ps-web/v1/ads-recon`,
   raktas `ps_ads_raktas` (jau buvo DB), saugo į `ps_ads_recon`. E2E ✓ (200/403).
2. Recon skriptai `irankiai/petshop_ads_recon_v1.js` (+v1.1 be campaign.start_date — Ads Scripts
   GAQL jo nepalaiko). Raimis paleido: 186 KB, klaidų 0. Duomenys `ps_ads_recon` (konteineryje
   /tmp/ads_recon2.json).
3. **Paskyros būklė (754-153-0584, EUR, Vilnius):** 11 kampanijų.
   ENABLED: P-max Šunų €20/d tROAS 3,84 (30d €615 ROAS 3,5) · P-max Kačių €20/d tROAS 3,64
   (€593 ROAS 3,3) · petshop brand €8/d Target IS (€105 ROAS 13,2 — Fazės 0 biudžeto kėlimas
   JAU padarytas) · Prins Puppy €3/d (€0,13).
   PAUSED 7 senos Search: DSA €10, Šunims €4, Katems €3, Animonda €13 tROAS1,8, Žuvų €2,
   Konkurentai €4, Grancarno €15 tROAS4,5.
4. Konversijos: primary „Purchase" (WEBPAGE/GTM), GA4 purchase secondary — dubliavimo nėra ✓.
5. **Radiniai:** (a) `Brand_Exclusion` shared set (3 nariai) YRA, bet NEPRISKIRTAS niekam —
   PMax brand nutekėjimas atviras; (b) senų Search skelbimų URL: `/pagrindinis-meniu/*` → **404**,
   `index.php?route=…` → 301 į titulinį; visi 404 tik PAUSED kampanijose, aktyvios neveda į 404
   (petshop → / 200); (c) sarasu_priskyrimai tušti.
6. **Raimio patvirtinta seka (po argumentuotos diskusijos):** (1) APPLY #1: Prins OFF +
   Brand_Exclusion → 2 PMax, biudžetai/tROAS NELIEČIAMI; (2) konversijų signalo patikra
   (#35872 Ads'e, GTM naujame saite); (3) Merchant feed; (4) +7–14 d. po feed'o — ratchet per
   tROAS pakopas (3,8→4,5→5,5), ne biudžeto pjūviu; sprendimai iš savo POAS.
   PMax mutate per `AdsApp.mutate` campaignSharedSetOperation (resource names iš recon:
   sharedSets/11895318074, campaigns/21472017542 ir 21565450990, customer 7541530584).
7. **Kainodaros klausimas (Raimio, ATVIRAS):** ar kelti Exclusion sausų antkainį. Claude
   išaiškino: 20 % marža = 25 % antkainis (kelti = nuo 26 %+); lūžio ROAS su ~7 % fulfillment:
   25 %→~7,7 · 30 %→~6,2 · 35 %→~5,3; PMax pelningumui vien kaina reikėtų 56 % antkainio —
   nerealu; exclusion priskyrimas nukres PMax rodomą ROAS (apskaitos efektas, ne pablogėjimas).
   Rekomendacija: ne masinis kėlimas, o selektyvus iki parity −2–3 % kur pigesni >5 %.
   **KITAS DARBAS: Exclusion sausų kainų+savikainų lentelė iš katalogo (antkainis per SKU).**

## Atviri po S1665
- Ads APPLY #1 skriptas — parašyti ir atiduoti Raimiui (patvirtinta).
- Exclusion sausų antkainių lentelė (bridge, read-only) → Raimio kainų sprendimai.
- Konversijų signalo patikra naujame saite.
- Merchant feed (didysis darbas; SA claude-gtm-manager, Content API būklė — žr. REGISTRAS §8).
- Sender: laukia Raimio 3 veiksmų; gavus — tokeno/secret įrašymas + realus E2E + payload
  formos peržiūra iš ps_sender_webhook_log.
- Laikini snippetai gyvi: 5323 (sargas), 5339 (rs spąstai), 5353 (ads-recon priėmiklis).
