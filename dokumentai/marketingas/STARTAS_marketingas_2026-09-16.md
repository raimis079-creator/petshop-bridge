# STARTAS — Marketingo planas, naujas langas (2026-09-16, po S1685)

Pradėti nuo čia. Planas užrakintas (v1.2 baseline, `MARKETINGAS_planas_v1_s1683.md` §18 vartai A–E; `Q4_operacinis_planas_s1684.html` — atnaujinti ~09-28). Nuo čia tik vykdymas — faktai / statusai / sprendimų žurnalas. S1685 detalės — `STARTAS_marketingas_2026-09-14.md` (S1685 skyriai) ir `deployment_log_v1_9_69.md`.

## Būklė 09-15 pabaigoje — sprintas iki 09-21 UŽDARYTAS
- Ads: offline konversijos veikia (22 užs., 0 klaidų), gclid fiksuojasi; **09-16 po 02:01 patikrinti `ps_fakt_reklama` — ar konversijos už 09-10…14 nebe 0** (jei 0 — problema Ads pusėje). Nieko nekeisti iki ~09-29; kačių PMax sprendimas spalio pradžioje pagal CM12/CAC; feed-only „Šunų maistas" PMax po MC review (Raimis).
- Kasos soft opt-out gyvai (`petshop-sutikimai.php` v1.0.1). Lifecycle laiškai tik naujiems pirkėjams nuo 09-15 (`ps_lifecycle_vartai`=soft).
- Refill „Ar ne laikas papildyti atsargas?" — `petshop-pakartoti.php` v1.1.5 + šablonas v1.6 **PATVIRTINTA Raimio, užrakinta**. Intervalo logika `petshop-lifecycle-vartai.php` v1.2.0 (trumpas išmoktas intervalas = papildymas).
- Vartai E: `petshop-planas-langas.php` v1.0.1 (`admin.php?page=ps-planas`) — N 16 nuo T-0, CAC €24, 69 % iš Ads.

## Kitas darbas (eilės tvarka)
1. **Win-back laiškas** (retention etapas 2, Q4): klientams, kurie po refill termino +60 d. nepirko; tuo pačiu principu kaip refill (Raimio tekstas, be nuolaidų, be pažadų, žmogiškai; tas pats vartų/holdout modelis; šablonas `ps-sablonai/`, core neliesti). Pirma recon: `win-back-60/90/120.php` šablonai ir kas juos šaudo.
2. Informacinis laiškas ~5 100 istoriniams + 561 (Raimio sprendimas priimtas) — parengti tekstą peržiūrai, siuntimas per Sender dalimis.
3. „Keisti priminimą" nuorodos paskirties puslapio patikra (S323 feedback) — kad nebūtų negyva.
4. Sender sync pagal žymas (newsletter / similar_ok).
5. Q4 HTML atnaujinimas ~09-28; vartai D (apyvartinės lėšos) iki Q2.

## Raimio principai (galioja visiems lifecycle laiškams)
Be nuolaidų (Petshop prisimena, ne „palauk −10 %"); ramus, kaip paslauga; be robotiškų datų; be pažadų, kurių nevaldom; sakiniai teisingi konkrečiu atveju; CTA — vienintelis stiprus elementas; Outlook: jokių įdėtų 100 % lentelių. Raimio darbo principas: Claude tiria serveryje pats, nespėja — tikrina.

## Bridge
`irankiai/run.sh`, PAT `/tmp/.ghtok`; prieš run.sh — `cp irankiai/mjs_template.mjs mjs_template.mjs`, `apt-get install php-cli`, `chmod +x`; `timeout 250`; rezultatas iš stdout (`awk '/^\{/{f=1} f'`), fazės raktas `d[FAZĖ]`; runner gali užstrigti >300 s — deploy vis tiek įvyksta, tikrinti atskira užklausa. Marketingo lango įrankių prefiksas — `s1686_m*` (techninis langas naudoja be `m`).
