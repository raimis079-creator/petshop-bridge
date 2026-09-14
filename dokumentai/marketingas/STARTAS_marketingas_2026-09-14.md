# STARTAS — Marketingo/verslo planas, tęsinys (2026-09-14)

**Pradėti nuo:** `dokumentai/marketingas/MARKETINGAS_pagrindas_s1678.md` (ašis, Raimio korekcijos, kiti žingsniai), tyrimai `TYRIMAS_1_zoo_lyderiai_s1678.md`, `TYRIMAS_2_LT_rinka_s1678.md`. Formatas — diskusija: Raimis daug žino, Claude klausia tikslingai; „žemiška" analizė, ne plati; „analizė be plano — popierius".

**Sutarta plano ašis (S1678):** 1) greitis + patikimumas kaip įrodomas pažadas (pristatymas 2, max 3 d., nuspėjamai), 2) nišos gylis (skanėstai: tipų puslapiai, svorinės pakuotės/„skanėstų dėžė", Hikari, Exclusion Hypoallergenic), 3) prenumerata/CRM. Tikslas €50 k/mėn. (petshop.lt, ne Avesos didmena) iki 2027 pabaigos. VMVT ženklinimo/savo prekės ženklo nedarys.

**Nauji faktai iš S1681 (09-14), gauti iš serverio — visi duomenys yra serveryje, ne klausti Raimio:**
- eShoprent pardavimų istorija `ps_ist_fakt_uzsakymai` (2023-11…2026-08-30, 9 528 užs.), GA4 istorija per `petshop-ga4-serveris.php` (property 346051580), GSC `ps_fakt_gsc_*`, Ads `ps_fakt_reklama`. Recon įrankiai `irankiai/s1681_g–q.php`, rezultatai `analize/s1681_*.json`.
- Užsakymai krito: 09-09…13 6,8/d (€280/d) vs 2025-09 tos pačios dienos 12,8/d (€495/d) → −47 %. Rugsėjo 10–15 d. algų banga (+25 % 2024/2025) šiemet nėra.
- Kritimas prasidėjo prieš migraciją: 2026-08 7,9/d (blogiausias mėn. nuo 2024-01; 2025-08 9,8/d). GA4 rugpjūtis m/m: sesijos −28 %, organinė paieška −34 % (1 086 sausį → 617 birželį), PMax −37 %, **naujų klientų −33 % (159→106), grįžtantys stabilūs (146→140)**. Migracija pridėjo ~15–20 % (8,3 → 6,8/d). AOV €40,9 → €38,6.
- Naujoje svetainėje: Ads klikas → užsakymas 2,9 %; krepšelis → užsakymas 21 %; 88 % apleidžia dar prieš kasos formą; Ads nuostolinga (ROAS 3,0, lūžis 4,5); GA4 sesijos −61 % po T-0 = sutikimo efektas (~35 % sutinka), ne srautas.
- Nuo 09-14 siunčiama į EE/LV (Venipak paštomatai, 3,59 € su PVM, PVM 21 %) — naujas kanalas planui.
- Raimio kryptis: nenori priklausyti nuo Google; sava analitika (`petshop-analitika.php`) — atskiras techninis darbas po Ads/LP.

**Atviri Raimio klausimai:** kodėl vienkartiniai klientai negrįžta; kur dingo nauji klientai 2026 (organika+PMax); Keyword Planner eksportas dar negautas.
**Siūlomas kitas žingsnis:** GSC 2025-08 vs 2026-08 užklausų/puslapių pjūvis (kas iškrito iš organikos) + `ps_ist_*` kohortos (vienkartiniai vs grįžtantys pagal pirmą prekę) — abu iš serverio.
