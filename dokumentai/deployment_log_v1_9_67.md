# deployment_log v1.9.67 — S1679 (2026-09-13, vakaras) — Lankomumo rinkiklio atstatymas

## Problema
Lankomumas (`ps-lankomumas`) rodė 0 nuo 09-12 08:17. Priežastis: S1676 analitinis langas įkeltas kaip `mu-plugins/petshop-analitika.php` v1.0.1 — tuo pačiu failo vardu ir klase `Petshop_Analitika`, kaip įvykių rinkiklis „Petshop Analitika v1.2" (ps_web_ivykiai, REST `ps-web/v1/i`). Rinkiklis perrašytas, REST 404, įvykiai nekaupti 09-12 08:17 → 09-13 19:14 LT (~35 val., neatstatoma). Claude klaida (S1676). Užsakymų faktai (ps_fakt_*) nepaveikti.

## Pakeitimai (GYVAI, ping 200)
| # | Failas | md5 | Pastaba |
|---|---|---|---|
| 1 | `mu-plugins/petshop-analitika.php` **v1.2** (rinkiklis, atstatytas) | fab5e5a8ac9c3ced15fe3a6a80eeb69c | iš repo `deploy/petshop-analitika.b64` → `deploy/petshop-analitika-v1.2.php`; serverio bak `uploads/ps-backups/petshop-analitika.php.bak_s1679` (= v1.0.1 langas) |
| 2 | `mu-plugins/petshop-analitika-langas.php` **v1.0.2** (naujas vardas) | f170d2c234ed607123899640e45d1435 | klasė `Petshop_Analitika_Langas`; turinys = v1.0.1; repo `deploy/petshop-analitika-langas-v1.0.2.php` |

Deploy per DATA mechanizmą (`deploy/an_rink_v12.txt`, `deploy/an_langas_v102.txt`), įrankis `irankiai/s1679_d.php` (D+T atskiromis užklausomis).

## Patikra
- Klasės: `Petshop_Analitika` v1.2 iš petshop-analitika.php; `Petshop_Analitika_Langas` iš petshop-analitika-langas.php.
- REST `/?rest_route=/ps-web/v1/i` POST → 200.
- Realūs įvykiai vėl rašomi: 19:16–19:17 LT 2 pageview (`/kategorija/rinkiniai/konservu-rinkiniai/`, mobile).
- Fatal žurnale 16:13 UTC — TEMP patikros snippetas per nepavykusį 1-ą bandymą (STOP md5), ne gyvo kodo.

## Ads būklė 09-13 (recon `s1679_a/b.php`)
- Išlaidos €/d: PMax šunų 17,5→16,8→13,9 (nepanaudoja €20), PMax kačių ~21, brand ~2,4.
- Ads matomos konversijos 09-09…12: ~0. WC užsakymai su gclid: 09-10 6 (€169), 09-11 3 (€92), 09-12 1 (€15), 09-13 3 (€121) → 4 d. ROAS ~2,6.
- Offline įkėlimo (09-12 19:19, 10 eil./€276) lentelėje `ps_fakt_reklama` 09-13 05:00 dar nematyti — laukia Raimio patikros Ads UI (Konversijos → „Įkėlimas neprisijungus", tvarkaraštis 06:00).

## Pamoka
Prieš kuriant naują mu-plugin — tikrinti, ar failo vardas ir klasė jau užimti (`ls mu-plugins`, `class_exists`). Bendra vardų erdvė `petshop-*`.
