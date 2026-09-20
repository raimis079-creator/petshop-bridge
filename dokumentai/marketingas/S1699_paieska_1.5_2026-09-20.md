# S1699 — Sprintas 1 / 1.5 svetainės paieškos pjūvis — 2026-09-20 (naktį)

Tas pats langas (po 1.1, 1.3). Įrankiai `irankiai/s1699_ma.php` (recon), `s1699_mb.php` (DRY testas), `s1699_mc.php` (deploy/testas/išjungimas fazė 9).

## 1. Faktai (`ps_web_ivykiai` tipas `search`, 09-07…20, 14 d.)
- **346 paieškos, 103 sesijos** (5,5 % iš 1 856 sesijų), 163 unikalios frazės. Rezultatų sk. lauke `reiksme`.
- **73 paieškos (21 %) grąžino 0** — 63 unikalios frazės. Priežastys:
  1. **Rašybos klaidos / variantai** (~15): jesera festivalis, jassera sensi, jorsera, eucanuba puppy, expulsion, exclusive, royal canine, anikonds vom feinstein, gastrointensial/gastrointestinial, sum palst, hills, kiauliena su zirneis/zirneleis (galūnės), katės pieno pakaitalas (yra „kačiukams"), ausu valiklis.
  2. **Brendai, kurių neturim** (~25): Hill's ×3 (Prescription Diet z/d, Science Plan Kitten), Royal Canin vet (Renal cat, Gastrointestinal low fat, Sterilised in jelly), Carnilove ×2, Virbac ×2, Marp ×2, Prolivet/Rolivet ×4, Brit Care, Orijen, Applaws, Trainer, Whimzees, Nature's Protection ×2, Trovet, Zesty Paws, Boxby ×2, Sam's Field, The Good Stuff, Josera Help Weight & Diabetic, Ideapet, Aladin.
  3. **SKU / ID** (6): inps11, inps, hyos02 (Exclusion Intestinal/Hepatic — draft nuo S1688), 19997, 17250, 35291 — frontend paieška SKU neieškojo.
  4. Kita: **dovanų kuponas**, šprotai, batai (šunų), samtelis su svarstyklėmis, miracle nipple.
- **„leger" — 16 paieškų iš 2 sesijų, 2 rezultatai, be view/cart** → klientas ieškojo Josera Leger 10 kg, kuri nuo S1683t yra **draft (#18054, laukia Raimio publikavimo)**. Prarastas pirkėjas.
- Top frazės su rezultatais: exclusion 28 (6 ses., view→cart→checkout ✓), miamor 13, josera 12, shuttle 10 (1 ses., tualetas Shuttle, be cart), animonda 7, kitten 7, plaučiai 5, kraikas 5, churu katėms 5.

## 2. Padaryta — naujas mu-plugin `petshop-paieska.php` v1.0 GYVAI
md5 **b4f486f3**, klasė `Petshop_Paieska`, repo `deploy/petshop-paieska-v1.0.php`. Frontend produktų paieškai (WC `/?s=&post_type=product` ir Flatsome live search) per `posts_search` prio 20; admin neliečiamas; išjungimas — opcija `ps_paieska_isjungta=1` arba `s1699_mc.php` fazė 9 (pervadina failą `.off_s1699`).
1. **Sinonimai/klaidos** (`SINONIMAI`, ~30): jesera/jassera/jorsera → josera, eucanuba → eukanuba, expulsion/exclusive → exclusion, royal canine → royal canin, anikonds → animonda, vom feinstein → vom feinsten, sum palst → sum-plast, gastrointensial → gastrointestinal, hipoalerginis → hypoallergenic, katės pieno pakaitalas → pieno pakaitalas ir kt. Papildyti — konstantoje.
2. **Kamienai**: žodžiai ≥ 8 raidžių lyginami pagal 6 pirmas, 6–7 raidžių — pagal 5 (kiauliena ≈ kiaulienos, zirneis ≈ žirneliais, kačiukams ≈ kačiukas); DB collation `utf8mb4_unicode_ci` jau ignoruoja diakritikus (ž = z), problema buvo tik galūnės. Stop-žodžiai (ir, su, sausas, maistas…) išmetami. Žodžiai su skaičiais — tiksliai.
3. **SKU/ID**: visa užklausa be tarpų su skaičiumi → `_sku LIKE` arba prekės ID.

DRY testas prieš deploy (35 frazių, `s1699_mb`): 0→19 animonda vom feinstein, 0→3 jesera festivalis, 0→5 eucanuba puppy, 0→86 expulsion, 1→86 exclusive, 0→10 kiauliena su zirneis, 0→7 sum palst, 0→2 katės pieno pakaitalas, 0→13 gastrointestinial, 0→2 ambrosia (ilga frazė), 90→127 kraikas; esamos (exclusion, miamor, žuvis, farmina, malt-soft, shuttle) nepasikeitė. Gyvai: Flatsome ajax „expulsion" → Exclusion ✓, `/?s=kiauliena+su+zirneis` → 20 kortelių ✓.

## 3. Į kitus darbus (2.1/2.2 / asortimentas — Raimio)
- **Vet dietos** — aiški paklausa: Hill's Prescription Diet, RC Renal / Gastrointestinal, Trovet, Virbac. Monge VetSolution turim (gastrointestinial → 13 rez.). Sprendimas asortimento — R.
- **Josera Leger 10 kg #18054 publikuoti** (R) — 16 paieškų.
- **Dovanų kuponas** — WC Gift Cards (papildinys arba kuponas rankiniu būdu) — R sprendimas.
- Carnilove, Brit Care, Orijen, Applaws, Nature's Protection, Whimzees, Zesty Paws — po 1–2 paieškas, tik žinoti.
- Exclusion Intestinal/Hepatic (inps11, hyos02) — žmonės ieško pagal SKU; kol VF neturi, lieka draft.

## 4. Matavimas
0 rezultatų dalis 21 % → tikslas ≤ 8 % per 14 d. (`reiksme='0'` / visos `search`). Po savaitės peržiūrėti naujas 0-rezultatų frazes ir papildyti `SINONIMAI`.

## 5. Kitas langas
1.5 ☑. Toliau STARTAS: 1.6 botai, 1.7 `/skaiciuokle/`, 1.8 Product schema. Prefiksas `s1700_m*`.
