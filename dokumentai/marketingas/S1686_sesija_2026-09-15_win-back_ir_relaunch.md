# S1686 — 2026-09-15/16 — Win-back laiškas (GYVAI) + Relaunch kampanija (1–2 etapai GYVAI)

## 1. Win-back laiškas — UŽDARYTA
**Sprendimai (Raimis):**
- Pagrindas ERĮ 81(2) soft opt-out (kaip refill). Sistemoje nauja flow klasė `similar_soft_optin` (ne `service`, ne `marketing`); `opt_out` viršesnis; tik anksčiau pirktos / aiškiai panašios prekės. Nuolaidų Q4 nededam dėl verslo, ne teisės. eShoprent istoriniai į refill/win-back neįtraukiami.
- Vienas laiškas: `win_back_at = refill terminas + 30 d.`, po jo stop iki naujo pirkimo. Serijų 60/90/120 nėra. Holdout 90/10 tas pats.
- Tekstas: tema „Gal norite pakartoti ankstesnį užsakymą?", antraštė „Pakartoti ankstesnį užsakymą?", įžanga „Praėjo šiek tiek laiko nuo ankstesnio pirkimo. Jei augintiniui vis dar tinka tos pačios prekės, jas galite užsisakyti dar kartą vienu paspaudimu. Kiekius prieš apmokėdami galėsite pakeisti." Be „turėjo/galėjo baigtis".

**GYVAI:**
- `mu-plugins/petshop-sugrazinimas.php` v1.0.0 (klasė `Petshop_Sugrazinimas`, md5 ef12c9c5…): `petshop_email_flows` — naujas flow `win_back` klasė `similar_soft_optin`, `refill_due` perkeltas į tą pačią; cron `ps_sugrazinimas_diena` 08:30; job_key `win_back:<uid>:<oid>`; vartai `pirko_veliau` (terminal) / `preke_nera_sandelyje` (deferred); prekės per `Petshop_Pakartoti::grupe`.
- Šablonas `ps-sablonai/win-back-pakartoti.php` v1.0 (md5 8f6a89a1…).
- `petshop-lifecycle-vartai.php` v1.2.1 (md5 6516bec9…, bak `.bak_s1686`) — `win_back` soft opt-out/holdout sąraše.
- Repo: `deploy/sugrazinimas/`, `deploy/petshop-lifecycle-vartai-v1.2.1.php`; įrankiai `s1686_ma–mg`.
- Testas: render 35948 ✓, mygtukas ✓, opt-out ✓. Kandidatų dabar 0, pirmi ~10-23.

**Atvira:** „Keisti priminimą" win_back laiške nerodoma (S323 feedback_url) — kartu su plano 3 punktu; refill/win_back atribucija per tą patį `_ps_pakartoti_is` — patobulinti prieš pirmus laiškus.

## 2. Relaunch kampanija istoriniams klientams — koncepcija (užrakinta)
- Rizika/atsakomybė Raimio; siunčiam ~5 100 be sutikimo + 561. DKIM prieš siuntimą; dalimis su stabdžiu.
- Ne newsletteris. Branduolys: Petshop padeda suprasti, ką perki ir kiek to reikia. HERO = skaičiavimas („Maišas 55 €. O diena?"), UTILITY = pakartoti, BRAND = „mes žinom, kas maiše".
- Tyli personalizacija: jokio „jūs pirkote". Laiškas = skaičiuoklė: 3 svorio eilutės iš JO prekės lentelės (šuo 10/20/30, katė 3/5/7; mažų veislių — iš lentelės ribų), kiekviena → prekės puslapis `?svoris=N` **be prisijungimo**; apatinis CTA „Mano pirkimai / Pakartoti" → magic login.
- Skaičiai: **„nuo X €/dieną"** + „g/d · maišo užtenka X–Y d." (gamintojų lentelės duoda intervalą net tiksliam svoriui; aktyvumo sluoksnis = v2).
- Segmentavimas: exact = paskutinis pirkimas ≤12 mėn. ARBA tas pats SKU ≥3× ir ≤18 mėn.
- Identifikacija — opaque `cid`. Svorio paspaudimas = signalas (`ps_weight_signal`, confidence medium), Pet Profile neperrašomas.
- Sender conditional blokų nėra → versijos kaip atskiros kampanijos: CALC · PRODUCT · NONFOOD (G1 prekė / G4 kategorija) · RELAUNCH (G2/G3). utm: source=sender, medium=email, campaign=relaunch, content=<versija>, term=NNkg.
- GIF vienas neutralus (pirmas kadras = visa kompozicija), prekės nuotrauka statinė; jei `{{PS_HERO_IMG}}` neveiks — pirmas testas be nuotraukos.
- Matavimas: clicks → magic login → product view → order 7/30 d. Vienas kintamasis pirmoje bangoje (subject), laikas ~18:30.

## 3. Relaunch — 1 etapas GYVAI (svetainės mechanika)
- `mu-plugins/petshop-relaunch.php` v1.0.1 (klasė `Petshop_Relaunch`, md5 9e956278…, bak `ps-backups/petshop-relaunch.php.bak_s1686`, repo `deploy/relaunch/`).
- Lentelė `ps_relaunch_kontaktai`: cid, email, user_id, segmentas, product_id, rusis, svoriai, duomenys (JSON), hero_reason, last_food_product_id, last_food_date, same_sku_orders, ist_n, ist_paskutinis, consent, klik_n, pask_klik_at, pask_svoris, last_kat, last_any_product_id, last_any_date, same_any_orders, top_kat, grupe.
- `?svoris=N` prekės puslapyje → JS įrašo į `#ps-calc-w`, spaudžia „Apskaičiuoti", priartina. Naršyklės + Raimio telefono testas ✓ (Eukanuba 12 kg, 20 kg: 54–60 d., 1,10–1,21 €/d., 200–220 g).
- `cid`+`svoris` → klik_n/pask_svoris, usermeta `ps_weight_signal` (paskutiniai 5), `ps_web_ivykiai` tipas `email_calc_click` (raktas=pid, raktas2=segmentas, reiksme=kg, kampanija=relaunch).

## 4. Relaunch — 2 etapas GYVAI (auditorija, 5 666)
Skaičiuota per `Feeding_Service::calc()` — tas pats kelias kaip svetainės skaičiuoklė (`evaluate` be aktyvumo duoda needs_input). Prekių cache opcija `ps_relaunch_prekes`. Įrankis `irankiai/s1686_mr.php` (&alter / &prekes / &klientai&n0&k1500), 2A `s1686_mv.php`.

| Segmentas / grupė | n | consent |
|---|---|---|
| calc (recent 652 + repeat 37; šunys 573, katės 116) | 689 | 70 |
| product (gyva prekė be lentelės; katės 267, šunys 251) | 523 | 71 |
| G1 recent non-food ≤12 mėn. (+G1r 6) | 481 | 33 |
| G4 dead product (≤12 mėn., išparduota) | 213 | 13 |
| G2 old food 12–24 mėn. | 1 226 | 111 |
| G2 old non-food 12–24 mėn. | 566 | 33 |
| G3 very old >24 mėn. | 1 967 | 230 |

Radiniai: iš 2 042 „galimų" tikslių calc liko 689; katėms calc retas (konservai be lentelių — business case vėliau); kraikas: 472 pirkėjų, bet gyvų ≤12 mėn. tik 18 — išnyko 2024–2025 (asortimento/kainos klausimas, ne email); „repeatable non-food" ~60 žmonių.

## 5. Bangos (Raimis)
1. 561 consent + calc 689 (~1 180) — technika, clicks, signalai, užsakymai.
2. product 523 + G1 481 + G4 213.
3. G2 1 792.
4. G3 1 967 — **HOLD**; atrakinti tik po 1–3, skaidyti 24–36 / 36–48 / >48 mėn., pradėti 200–300.
Stop: bounce >~3 %, complaint >0,1 %, beveik nulinis click/order.

## 6. Kitas žingsnis (rytas) — 3 etapas
Sender laukai `PS_HERO_*` (POST /fields per SenderAdapter; esami 26 laukai `plugins/petshop-esp/docs/attributes.md`), testinis 1 kontakto įkėlimas, realus CALC laiško prototipas Raimiui su `{{PS_HERO_IMG}}` patikra. Prieš siuntimą: DKIM; testinį terra@gyvunai.lt kontaktą (hero_reason NULL) išmesti.

## Bridge pastabos
`git pull --rebase -X theirs` prieš push (lygiagretus langas); php: `apt-get install php8.3-cli`; run.sh get_key su papildomais raktais — tik „isset" formos (`ps_x=1&alter&n1500`), ne `k=v`.
