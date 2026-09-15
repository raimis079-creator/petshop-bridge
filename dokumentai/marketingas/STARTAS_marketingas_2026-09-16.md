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

## S1686 (09-15 vakaras) — win-back UŽDARYTA (1 punktas)
Raimio sprendimai: (1) pagrindas ERĮ 81(2) soft opt-out, sistemoje nauja flow klasė `similar_soft_optin` (ne service/marketing; `refill_due` perkeltas į ją), opt_out viršesnis, tik anksčiau pirktos / aiškiai panašios prekės, nuolaidų Q4 nededam dėl verslo (ne teisės), eShoprent istoriniai neįtraukiami; (2) vienas laiškas, `win_back_at = predicted_empty_date + 30 d.`, po jo stop iki naujo pirkimo, serijų 60/90/120 nėra, holdout 90/10 tas pats; (3) tekstas: tema „Gal norite pakartoti ankstesnį užsakymą?", antraštė „Pakartoti ankstesnį užsakymą?", įžanga „Praėjo šiek tiek laiko nuo ankstesnio pirkimo…" — be „turėjo/galėjo baigtis".
GYVAI: `mu-plugins/petshop-sugrazinimas.php` v1.0.0 (klasė `Petshop_Sugrazinimas`, md5 ef12c9c5…, cron `ps_sugrazinimas_diena` 08:30, žurnalas opcija `ps_sugrazinimas_pask`, job_key `win_back:<uid>:<oid>`, vartai prio 30: `pirko_veliau` terminal / `preke_nera_sandelyje` deferred); šablonas `ps-sablonai/win-back-pakartoti.php` v1.0 (md5 8f6a89a1…); `petshop-lifecycle-vartai.php` v1.2.1 (md5 6516bec9…, bak `ps-backups/petshop-lifecycle-vartai.php.bak_s1686`) — `win_back` pridėtas į soft/holdout vartų sąrašą. Repo `deploy/sugrazinimas/`, `deploy/petshop-lifecycle-vartai-v1.2.1.php`; recon `irankiai/s1686_ma–me`, deploy `s1686_mf`, patikra `s1686_mg` (render 35948 ✓, mygtukas ✓, opt-out ✓). Kandidatų dabar 0 — pirmi ~10-23.
Radiniai: core `win_back_60/90/120` flows/šablonai egzistavo, bet niekas jų nešaudė (emitterio/cron nėra) — paliekami nenaudojami. „Keisti priminimą" win_back laiške nerodoma (feedback_url į payload deda S323 mechanizmas, čia nekviestas) — spręsti kartu su 3 punktu. Atribucija: win_back ir refill_due naudoja tą patį endpoint'ą → `_ps_pakartoti_is` neskiria, iš kurio laiško grįžo (tobulinti, kai bus pirmi laiškai). Dispatch nežinomai klasei: transakcinis suppression kanalas, be newsletter consent — teisingai; Layout footeriui šablonas paduoda `service` (tekstas kaip refill).
