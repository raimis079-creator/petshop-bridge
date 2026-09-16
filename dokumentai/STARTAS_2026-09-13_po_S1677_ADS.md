# STARTAS 2026-09-13 po S1677 (Ads)

**Ads tema — vienas dokumentas: `dokumentai/ADS_PMAX_bukle_s1677.md`.** Pradėti nuo jo. Kryptis pakeista: UI, ne skriptai; offline konversijos iš WC; feed-only retail PMax; tCPA €8.

## Seka
1. Rytoj (09-13): Ads → Konversijos → „Įkėlimas neprisijungus" turi rodyti ~10 / €276 (po ~3 val. nuo 19:19). Tvarkaraštis 06:00 uždėtas? (Raimis).
2. Kasdien: Ads offline konv. vs `/?ps_ads_offline=<raktas>&dienos=3` (raktas `ps_ads_offline_raktas`) — turi sutapti ±1.
3. MC 5321054797 review (~09-15) → retail kampanijos UI checklist (§4 dokumente). Prieš tai MC klaidos: nuotraukos <500 px, GTIN, politikos, kalba.
4. 14 d. kampanijų neliesti. Po to sprendimas: kuri PMax lieka.
5. Vėliau: `pristatymas_savikaina_ct` į faktus; pakartotinio pirkimo rodiklis (eShoprent eksportas?); AOV svertai (nemokamo siuntimo slenkstis, rinkiniai).

## Būklė gyvai
Feeds v2.5.0 (pigu <€12) ✓ · ads-offline v1.1 + Ads Script (10 eil. įkelta) ✓ · „Įkėlimas neprisijungus" pagrindinis, „Purchase" antrinis ✓ · kačių įjungta, PMax po €20, URL expansion OFF ✓ · Consent Bridge v1.4 legalus ✓ · v2.0/D1–D6 atšaukta.

Kiti (ne Ads) atviri — `STARTAS_2026-09-13_po_S1676.md`. PAT — pakeisti.

## S1687 (09-16 rytas) — offline konversijos PAGALIAU VEIKIA
Radinys: visi 4 įkėlimai 09-12…09-16 05:21 atmesti 100 % eilučių — „Conversion Time requires a timezone" (+03:00 iš JSON įkėlime dingsta). „Įkėlimas neprisijungus" buvo „Laukiama konversijų", web Purchase/GA4 antriniai → PMax tCPA €8 dirbo su 0 konversijų 09-10…15. Skripto žurnalas „0 klaidų" — melagingas; rezultatą tikrinti TIK Tikslai → Konversijos → Įkėlimai.
Pataisa: `irankiai/petshop_ads_offline_konv_v1_1_RUN.js` (`newCsvUpload(..., {timeZone:'Europe/Vilnius'})`, poslinkis nuimamas). Rezultatas 09-16: 10:43 „14 pavyko" (09-13…16), 10:45 vienkartinis `v1_1_7d_RUN.js` (dienos=7) „25 pavyko" → 09-10…16 užsakymai Ads'e. Ads konversijas rodo po ~3 val. Tvarkaraštis 06:00 lieka; skripte turi būti v1.1 turinys (dienos=3). Kontrolė 09-17 rytą: `ps_fakt_reklama` 09-10…16 konversijos ≈ 23–25 (ne 0).
Ekonomika 09-10…15: išlaidos €258, užsakymų su gclid 23 (mokamas 30), CPA €11,2 → 09-15 €8,0; užsakymai iš viso 7→18/d.
