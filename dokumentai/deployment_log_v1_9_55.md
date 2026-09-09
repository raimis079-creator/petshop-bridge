# deployment_log v1_9_55 — S1666 (2026-09-09 vakaras) — Ads APPLY #1 ĮVYKDYTAS

1. Skriptai: `irankiai/petshop_ads_apply1_v1.js` → v1_1 (mutate campaignSharedSetOperation —
   FAIL "Do not set the id field…") → v1_2 (addNegativeKeywordList — PMax klasė Scripts'e
   NETURI šio metodo) → **v1_3 GYVAS KELIAS: campaignCriterionOperation** (sąrašo narius
   skaityti iš shared_criterion, dėti kaip kampanijos neigiamus). Darbo eiga su Raimiu:
   Preview → Claude patikrina per ps_ads_recon → Raimis Run.
2. **Run rezultatas (7 pakeitimai, klaidų 0, verifikuota GAQL po Run):**
   - Prins Puppy 23394555043: ENABLED → **PAUSED**.
   - Neigiami `pet shop`/`petshop`/`petshop.lt` (BROAD, iš Brand_Exclusion 11895318074)
     įrašyti ABIEJOSE PMax (21472017542, 21565450990) — po 3 kiekvienoje, patvirtinta
     campaign_criterion užklausa.
3. PMax asset grupių final URL: /sunims/maistas-sunims ir /katems/maistas-katems —
   **301 → /kategorija/... [200]**, nedega; vėliau atnaujinti į tiesioginius.
4. Biudžetai/tROAS NELIESTI (sutarta seka). Laukiamas efektas: PMax rodomas ROAS kris
   (pigios brand konversijos persikėlė į brand kampaniją ROAS 13,2) — tai persiskirstymas.
5. **PENKTADIENIS (Raimio sprendimas): PMax asset inventorizacija** — read-only skriptas
   ištraukia abiejų grupių nuotraukas/antraštes/aprašymus/logotipus → Raimis pažymi
   šiukšles/neteisingus brendus → keitimo skriptas išima IR įkelia pakaitalus iš naujo
   petshop.lt VIENU ėjimu (PMax minimumų sargas). Aklai netrinti!

## Atviri po S1666
- PENKTADIENĮ: PMax asset inventorizacija (žr. §5).
- Konversijų signalo patikra (#35872 Purchase Ads'e; GTM/dataLayer gyvame saite).
- Merchant feed (didysis).
- Exclusion sausų antkainių lentelė (Raimio kainų klausimas iš S1665).
- Sender: laukia Raimio 3 veiksmų (tokenas, 3 webhooks, secret).
- PMax ratchet per tROAS — tik po feed'o +7–14 d.
