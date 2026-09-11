# deployment_log v1_9_58 — S1670–S1671 (2026-09-11) — Tofu DP pakas iš AV, Venipak doc_no, VF dropship laiškas, kliento el. pašto redagavimas, žuvų skaičiuoklė, VF sekimo diagnozė

## Pakeitimai GYVAI (visi su backup, visi patikrinti)

| # | Kas | Failas / vieta | md5 po | Backup |
|---|---|---|---|---|
| 1 | Venipak lipduke `doc_no` = užsakymo Nr. (buvo vidinis WC ID, pvz. 35886). `http_request_args` tik `go.venipak.lt/import/send.php`, keičia TIK `<doc_no>ID</doc_no>` → `get_order_number()`; `shipment_code` nekeičiamas; tiekimo siuntos (doc_no `TIEK-…`) neliečiamos. **Patvirtinta realiu lipduku S1671: Siuntos dok.Nr. = 1007 (Kl.Siuntos Nr. 35887).** | NAUJAS `mu-plugins/petshop-venipak-docno.php` v1.0 | aae977bd624bba0913effa058dff9c4a | — (naujas failas); repo `deploy/petshop-venipak-docno-v1.0.php` |
| 2 | VF dropship laiškas: `ps_tiekeju_pastai['vf']` = 2 adresai per kablelį vienoje eilutėje → `wp_mail()` gavo 1 masyvo elementą → PHPMailer tyliai atmetė, laiškas nuėjo tik terra@ (#1000/#1001, 09-10 12:47). Dabar skaido `,` `;` + `is_email`; blogas/tuščias → `wp_die`; tikri gavėjai per `phpmailer_init`. Testas be siuntimo: senas → [terra], naujas → [ieva, karolina, terra]. #1000/#1001 Raimis persiuntė pats. | `mu-plugins/petshop-av-dropship.php` v1.20 | a16f5a09742d7a92c96fb49550721fe3 | `uploads/ps-backups/petshop-av-dropship.php.bak_s1670`; repo `deploy/petshop-av-dropship-v1.20.php` |
| 3 | Darbalaukis: kliento el. pašto redagavimas (klientų klaidos, pvz. gnail.com). Esamame „Redaguoti" laukas *El. paštas* (`is_email`, prieš/po pastaba + įvykis, laiškas klientui nesiunčiamas); kai adreso keisti nebegalima (lipdukas/išsiųsta/uždaryta) — `tipas=tik_el`, keičiamas tik el. paštas. Testai: blogas/tuščias/su tarpu → klaida; tas pats → „nieko nepakeista". | `mu-plugins/petshop-darbalaukis.php` v3.40 | 2ee69c4eb0102243f8a1b8c8df25a70f | `uploads/ps-backups/petshop-darbalaukis.php.bak_s1670`; repo `deploy/petshop-darbalaukis-v3.40.php` |
| 4 | Šėrimo rekomendacijos blokas nerodomas žuvų prekėms (Hikari rodė „Kiek šio maisto užteks jūsų šuniui?"): `context()` — kategorija `zuvims` ar jos vaikas → `null`. 51 žuvų prekė → 0 (buvo 44 su pakuote); Josera/Royal Canin lieka; žuvų puslapių kešas išvalytas. Graužikams/paukščiams ir anksčiau 0. | `plugins/petshop-core/includes/class-product-calc.php` | a5fa928e8e82f8cb095e73c4807f556d | `uploads/ps-backups/class-product-calc.php.bak_s1670`; repo `deploy/class-product-calc-s1670.php` |

## Vienkartiniai duomenų veiksmai (S1670)
- **#1006 Tofu „8 VNT." DP pakas** (#35856, `_dp_base_product_id` 17659, `_dp_pack_qty` 8): `Petshop_AV_Source/AV_Stock/AV_Reduce` DP pakų nepalaiko (tikrina tik pako AV). Raimis „padaryk, kad Tofu iš AV galėčiau siųsti" → eilutė `_ps_source=av`, užsakymas MAIN (1 siunta), #17659 AV 16→8, partija 4233 −8, backup option `ps_s1670_1006_backup`, pastaba užsakyme (atšaukus — #17659 +8 rankiniu būdu). Raimis patvirtino, kad 16 vnt. AV teisinga.
- #1006 nerodė jokioje eilėje: darbalaukio `faktai()` AV eilutę laiko „vietoje" tik jei yra `_ps_av_reduced_qty`/`_reduced_stock`/`_ps_av_reduced` arba `resolve()` AV likutis ≥ kiekis (DP pakui null → `av_truksta`). Pridėta eilutės 1803 žymė `_ps_av_reduced` (ne `_ps_av_reduced_qty`, kad `AV_Reduce::grazinti` negrąžintų į paką) → eilė „surinkti".

## Diagnozės (read-only, S1671)
- **VF siuntos „Paruošta siųsti" neužsidaro (#1000, #1001, #1007, #1013, #1014, #1017)** — mūsų kelias veikia: cron `ps_venipak_sekimas` kas 30 min (17:06: 14 užs., 15 užklausų, 0 klaidų), tą pačią dieną pats uždarė AV siuntas 35883/35888/35891/35892 (08:07) ir 35901 (13:06); visi 6 VF užsakymai kandidatų sąraše, `_ps_siuntos` registras teisingas. Priežastis: **Venipak viešasis sekimo API `tracking.venipak.com/api/v1/events` vėluoja už kliento savitarnos** — savitarna `V07267E1000079` „Picked up KAUNAS 2026-09-11 15:06:37", API 17:31 vis dar tik „Shipment created / At sender" (kodas 0). Raimio sprendimas: nieko nekeisti, laukti vakaro. Jei atsilikimas sisteminis — variantas sekti per `go.venipak.lt` kliento API (pluginas prisijungimą turi) — kodo keitimas, tik su leidimu.
- #1000/#1001 (VF, registruotos 09-09 19:58) API po 2 parų be pickup — Raimio skambutis VF / patikra savitarnoje (Kl.Siuntos Nr. 35880/35881).
- Įrankiai: `irankiai/s1671_r.php` (recon: cron, kandidatai, meta, pastabos, API testas), `irankiai/s1671_a.php` (6 numerių API užklausa). Rezultatai `analize/s1671_r.json`, `analize/s1671_a.json`.

## Pamokos
- Po rankinio kelio keitimo tikrinti darbalaukio `faktai()` eiles, ne tik meta.
- `wp_mail()` gavėjų sąrašą su kableliu vienoje eilutėje PHPMailer atmeta tyliai — skaidyti prieš perduodant, tikrinti `is_email`.
- „Neužsidaro" ≠ mūsų klaida: pirmiausia lyginti duomenų šaltinį (API atsakymą) su tuo, ką rodo tiekėjo savitarna.

## Atvira
- Nuolatinis DP pakų palaikymas AV variklyje — nepatvirtintas (Raimio sprendimas).
- Venipak kodas 5 (pats įdėjo į paštomatą) — laikyti „išsiųsta"? Atidėta.
- Venipak viešojo API atsilikimas — stebėti; sprendimas dėl kliento API vėliau.
