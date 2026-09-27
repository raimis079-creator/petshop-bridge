# S1725 · S1722 patikra + DP pakų „Nuolaida %" perkelta į langą „Rinkiniai" (2026-09-27 15:05–17:30)

## 1. S1722 patikra gyvai (15:20, read-only `s1725/a.php`, `a2.php`)
- `petshop-dp-kainos` v1.2.1 (md5 8fe9b0c6…) veikia; 25/25 pakų kaina = formulė, katalogo (lookup) kaina sutampa, klaidų 0.
- Naktinis 09-27 05:10: 25 pakai, pakeista 0; kitas 09-28 05:10. Ryto sargo `dp_kainos` žalia.
- Feed'ai 04:30: Google 2 166 prekės, kaina24/kainos.lt — pakų nėra nė viename. `ps_feeds_ids()` 2 164.
- `ps_dp_nuolaidos` opcija tuščia → naudojami kodo numatytieji (sausas 3, Josera 2,5, konservai 3,5, skanėstai 10, kraikas 10).
- php_error.log: paskutinis fatal — incidentas 09-26 21:41 LT, po to naujų nėra. Užsakymų su DP pakais po pakeitimo 0.

## 2. Problema
S1722 „Esami pakai — nuolaida %" lentelę įdėjau į seną formą **Produktai → ➕ Daugiau=pigiau** (snippet 572). Raimio taisyklė: viskas — lange **Katalogas → Rinkiniai** (`admin.php?page=ps-rinkiniai`, `mu-plugins/petshop-rinkiniai.php`). Tas langas DP pakus jau valdė (kūrimas/redagavimas, kiekis ×N, šiukšlinė), bet apie % nežinojo → ranka pakeista kaina būtų grįžusi į formulę (įrašant arba naktį).

## 3. GYVAI 17:27 — `petshop-rinkiniai.php` v1.45
md5 b90c5206… → **c242f519…**, bak `ps-archyvas/petshop-rinkiniai.php.bak_s1725`, deploy `s1725/f.php` (1 dry / 2 deploy / 3 572 off / 4 testai / **9 atstato viską**), repo `deploy/petshop-rinkiniai-v1.45.php`.
- **Forma (DP pakas):** laukas „Nuolaida % (Daugiau=pigiau)". Įrašytas → „Pako kaina" skaičiuojama (kiekis × bazinės reguliari × (1 − %), „…9" ct), laukas tik skaitomas, seka bazinę per `Petshop_DP_Kainos`. Tuščias → kaina ranka, meta `_dp_nuolaida_proc` ištrinama, sinchronizacija neliečia. Naujam pakui % pasiūlomas pagal bazinės kategoriją (`numatytoji_proc`), kol laukas neliestas. Kiekį ×2 → ×3 keisti ten pat — kaina persiskaičiuoja. Serveris % režime kainą skaičiuoja pats (ne iš formos), akciją — iš bazinės akcijos. Validacija 0–60.
- **Sąrašas:** DP eilutėje po „Daugiau=pigiau" — „−3 % · seka bazinę" arba „kaina ranka".
- Formoje DP pakui rodoma reguliari kaina (`_regular_price`), ne `_price`.

## 4. Snippet 572 „➕ Daugiau=pigiau" IŠJUNGTAS (17:27)
`active` 1 → 0 (bak opcija `ps_s1725_snip572_active`); kodas DB lieka. Priklausomybių kitur nėra (funkcijos `petshop_dp_*` ir AJAX `petshop_dp_search/create/proc` naudojami tik jame). Meniu punktas dingo, senas URL → 403.

## 5. Testai (`f.php` 4, per admin-ajax su laikina admin sesija, po to sunaikinta)
- T1 naujas pakas 3 × #18590 (21,95), 3 % → 63,89 ✓, meta 3.
- T2 % tuščias, kaina 60 → 60, meta nėra, sync „be_proc" ✓.
- T3 kiekis 2, 2,5 % → 42,79 ✓ = formulė.
- T4 99 % → klaida ✓. Testinis juodraštis #36333 ištrintas (įvykių žurnale liko 3 įrašai „dp_pakas_…").
- Forma #36002: % 3, kaina 42,59 ✓; sąrašas: 2×3 %, 21×10 %, 2×3,5 % ✓; heartbeat 200 (front + admin-ajax); DP suvestinė žalia.

## Liko
- Raimis: patikra akimis lange Rinkiniai.
- Produktai meniu dar yra „➕ Sukurti rinkinį" (snippet 539) ir „➕ Susidėjimo rinkinys" (550) — galimai dubliuoja Rinkinius; tikrinti tik Raimiui pasakius.
