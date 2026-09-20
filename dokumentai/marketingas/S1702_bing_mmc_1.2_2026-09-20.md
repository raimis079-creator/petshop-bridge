# S1702 — Bing / Microsoft Merchant Center (1.2) — 2026-09-20

Sprintas 1, punktas 1.2 iš `S1696_VEIKSMU_PLANAS`. Tikslas: nemokami Bing Shopping sąrašai iš esamo Google feed'o. Darė Claude per Raimio Chrome; paskyras kūrė / slaptažodžius vedė Raimis, įmonės duomenis su Raimio leidimu vedė Claude.

## 1. Kas padaryta

| Žingsnis | Rezultatas |
|---|---|
| Microsoft Advertising paskyra | UAB Avesa, account **G107GZ9A**, cid 255059622, aid 189355496, uid 169171170. Prisijungimas **raimis079@gmail.com** (MSA). Mokėjimo metodas **nepridėtas** — sąmoningai: tik nemokami sąrašai, mokamos Bing reklamos kol kas nedarom. |
| Bing Webmaster Tools | petshop.lt patvirtinta meta žyme `msvalidate.01` (Rank Math General → `bing_verify` = EBC75F5984935444989D545126038995, įrankis `s1702_ma`). `sitemap_index.xml` pateiktas. Likę 7 seni eShoprent sitemap'ai (negyvi) — neištrinti, Raimio sprendimas. |
| MMC parduotuvė | **Petshop.lt**, storeId **50090051**. Būsena: *pending approval*, iki 3 darbo dienų (≈ iki 09-24). |
| MMC feed | „Petshop.lt prekės (Google feed)", feedId **1771977**. Primary Feed, Destinations: Online product ads. Kalba Lithuanian, feed label LT, regionas Lithuania, valiuta EURO. Įvestis: **Automatically download from URL** `https://petshop.lt/feed/google`, Daily 12 AM Pacific (= 10:00 LT), „Download when save" ✓. |

## 2. Būklė 23:58

Feed sukurtas, bet „Your feed file is empty" — MMC dar neparsisiuntė failo. Labiausiai tikėtina: parsiuntimas/apdorojimas prasideda tik po parduotuvės patvirtinimo arba pagal grafiką (rytoj 10:00 LT). Feed'as pats sveikas (Google MC jį naudoja, S1697 patikra).

## 3. Kas laukia (R)

1. ~09-22…24 pažiūrėti `Merchant Center → Store Petshop.lt → Overview` — ar parduotuvė patvirtinta.
2. `Feeds → Petshop.lt prekės` — „Feed uploaded on" data ir prekių skaičius / klaidos (Diagnostics).
3. Jei po patvirtinimo ir 2 dienų feed vis tuščias — Claude tikrina: ar MMC priima Google RSS 2.0 XML formatą su `g:` prefiksais (turėtų — MMC deklaruoja Google feed suderinamumą), ar reikia `Import from Google Ads` kelio.
4. KPI: Bing ses/d 1 → 5 (matuoti `ps_web_ivykiai` saltinis=bing po 2–3 sav.).

## 4. Klaidos ir pamokos

- Microsoft Ads signup su MSA vartotojo vardu `raimis_terra` griuvo („Oops") — konsolėje `CCMTErrorNumber_UserUsernameInvalid`: reikia el. pašto formato paskyros. Sprendimas: prisijungimas raimis079@gmail.com.
- MMC parduotuvės aprašymas nepriima ne-ASCII simbolių (lietuviškų raidžių) — įrašytas ASCII tekstas.
- MMC parduotuvei būtinas domenas, patvirtintas Bing Webmaster Tools — tai daryta pirmiau.
- Feed dialoge Destinations — privalomas laukas (be jo „Create feed" tyliai nieko nedaro).
- Chrome `type` gali nukristi į ne tą lauką (feed label gavo „LTLITHUANIA") — po kiekvieno type tikrinti screenshot'u.

## 5. Failai

- STARTAS `STARTAS_2026-09-21_po_S1696_MARKETINGAS.md` — 1.2 eilutė atnaujinta.
- Įrankis `irankiai/s1702_ma.php` (Bing meta per Rank Math + cache valymas).
