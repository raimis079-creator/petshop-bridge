# Deployment log v1.9.69 — S1684 (marketingo langas), 2026-09-14

Lygiagretus techninis S1684 langas naudoja `irankiai/s1684_a/b`; šis langas — prefiksas `m` (`s1684_ma…mz`), GET raktai `ps_s1684m*`. Visi recon read-only, deploy'ai su md5 guard + `token_get_all` + heartbeat + rollback, bak `uploads/ps-backups/*.bak_s1684`.

## Kas pakeista gyvai

| # | Failas | Versija / md5 | Kas | Deploy | Bak |
|---|---|---|---|---|---|
| 1 | `mu-plugins/petshop-analitika-langas.php` | v1.1.0 · 2264f5fd… | Reklamos verdiktas pagal CAC naujam klientui (`SLENKSCIAI` `ads_cac_ok_ct`=1200, `ads_cac_stop_ct`=3500), ne ROAS; „naujas" = `klientas_naujas=1 AND NOT EXISTS ps_ist`; antkainis = marža/savikaina (kaina_ct be PVM) | `s1684_mi.php`, patikra `s1684_mj.php` | `.bak_s1684` |
| 2 | `mu-plugins/petshop-faktai.php` | 7d607ba0… | `kliento_eile()` skaito ir `ps_ist_fakt_uzsakymai` → `klientas_naujas`, `klientas_uzsakymo_nr`, `dienos_nuo_ankstesnio` su eShoprent istorija. Backfill 25/50 fakt užsakymų (`s1684_mn.php`): nauji 22 / grįžę 25 (buvo 46/1) | `s1684_mm.php` | `.bak_s1684` |
| 3 | `mu-plugins/petshop-lifecycle-vartai.php` (NAUJAS) | v1.1.1 · cb01cc8a… · repo `deploy/petshop-lifecycle-vartai-v1.1.1.php` | (a) pirmo pirkimo refill prognozė: anketa (`Feeding_Service::evaluate` duration_days {min,max} vidurkis, pet_id) → ciklų lentelė brendas×pakuotė (mediana iš `ps_ist` 2024–2026) → variklio įvertis; hook prio 40 po `Petshop_Refill_Engine` (30); 2+ pirkimų neliečia. Backfill `ps_refill_tracking` 33/38 (anketa 2, ciklai 28, mažos pakuotės — variklio 14/30). (b) filtras `petshop_email_eligibility` prio 20 srautams `refill_due`, `post_purchase_14d`: opcija `ps_lifecycle_vartai` = `soft` (numatyta; reikia usermeta `ps_soft_optin_eligible`=1 && `ps_similar_optout`≠1; kol nėra — `deferred` `soft_optout_nezinomas`) / `atvira` / `uzdaryta`. (c) 90/10 holdout pagal el. pašto sha256 (`holdout_10`, terminal) | `s1684_ms/mt/mw/mz.php`, backfill `s1684_mx.php` | — (naujas; rollback = ištrinti failą) |

Dokumentai: `dokumentai/marketingas/Q4_operacinis_planas_s1684.html` (v1.2 baseline), `ANALIZE_A/B/C_*_s1684.md`, `CIKLAI_ir_R_due_baseline_s1684.md`, `SPEC_kasos_soft_optout_s1684.md`, STARTAS.

## RADINIAI — ką reikės taisyti (pagal svarbą)

### Blokuojantys (sprintas iki 09-21)
1. **Kasoje nėra ERĮ 81(2) soft opt-out lauko** → visi `refill_due` / `post_purchase_14d` naujiems klientams atidėti (`soft_optout_nezinomas`). Spec parašyta, laukia Raimio žodžių → deploy `petshop-sutikimai.php` (rašo usermeta `ps_soft_optin_eligible`, `ps_similar_optout` + `ps_consent_log` source `checkout`). Kol nėra — 09-21 refill laiškai NEIŠEIS (sąmoningai).
2. **Ads offline konversijos nepatvirtintos** — `_ps_gclid` tik 9 užsakymuose, Ads mato 1,92 konv. vs 26 WC Ads užsakymai; skriptas 06:00, `petshop-ads-offline.php` (md5 04708b96…). Raimis: Ads UI → Conversions → Uploads. Iki tol PMax biudžeto nekelti.

### Sisteminės klaidos, rastos šioje sesijoje
3. **`petshop-core` dispatch klasifikacija**: `refill_due`, `post_purchase_2d/7d/14d` = klasė `service` → consent NETIKRINAMAS (tik suppression + PS_TRANSACTIONAL_ONLY). Pagal užrakintą modelį refill/„pakartoti" = tiesioginė rinkodara. Dabar užlopyta filtru (lifecycle-vartai); tvarus sprendimas — `class-email-dispatch.php` `FLOWS` perkelti `refill_due`/`post_purchase_14d` į naują klasę `similar` su savo eligibility (petshop-core = Raimio leidimas). `post_purchase_2d/7d` (be pasiūlymo) gali likti service.
4. **`Petshop_Contact_Policy` / Sender sync** žino tik `marketing_consent` → `PS_TRANSACTIONAL_ONLY`. Reikia antros būsenos `PS_SIMILAR_OK` (soft_optin_eligible && !similar_optout) į Sender ir į `is_marketable()` logiką; kitaip Sender kampanijos negalės atskirti newsletter vs lifecycle bazės. `class-contact-policy.php`, `class-consent-sync.php`.
5. **Refill variklis anketos nenaudojo** (`class-refill-engine.php` pet_id=NULL visada, intervalai 14/30/60 pagal svorį) — dabar perrašo lifecycle-vartai prio 40. Tvarus: `estimate_interval()` variklyje pakeisti į tą pačią hierarchiją (petshop-core). Variklio `check_due()` siunčia T-5 d. prieš predicted — vienas laiškas; planas numato 3 langus (p25 / med / p75) — antras/trečias laiškas dar nerealizuoti (Q4 spalis).
6. **`klientas_naujas` faktuose nematė istorijos** (WC pusė) — pataisyta (#2). Visos ankstesnės faktų ataskaitos (`petshop-ataskaita-klientai.php`, `-menuo.php`, `petshop-rezultatai.php`) iki 09-14 rodė 100 % naujų — jei kur išsaugoti agregatai (`petshop-ataskaitu-agregavimas.php`) — perskaičiuoti.
7. **Antkainio/maržos matematika**: `kaina_ct` (fakt ir ist) JAU be PVM, `pvm_ct` atskirai; S1683 recon ir dokumentai skaičiavo „kaina − pvm" → dvigubas PVM nuėmimas (Exclusion −0,8 % vietoj antkainio 20 %). Dokumentai pataisyti; **patikrinti mu-plugins ataskaitas** (`petshop-ataskaita-pardavimai/prekes/menuo.php`, `petshop-rezultatai.php`), ar ten nėra tos pačios formulės.
8. **Savikainos šaltiniai** išsibarstę: `_cost_price` (AV 1 017, importai 06-10/08-17 + Quattro 09-10), `ps_sources.cost_net` (dropship), `_vf_cost/_zb_cost` (dubliai), `ps_partijos.savikaina_eur` (faktinė gavimo — pigesnė už VF, Exclusion 34,00 vs 37,49). `_ps_savikaina` meta neegzistuoja (S1683 join'as buvo į tuščią raktą). Trūksta `_cost_price` 6 iš top-20 senų SKU (Ontario 2800/651153/2809/650803/650808/2804, Romar AL68/651117, Prins 03075/01046, Haumiau HM-8179/8174/8104) — Raimiui pildyti. Ilgalaikis: vienas kanoninis savikainos resolveris (partija → sources → cost_price).
9. **`ps_fakt_uzsakymai.pristatymas_savikaina_ct` NULL** (faktai rašo null), savikaina yra `ps_fakt_siuntos.kaina_vezejo_ct` → `kontribucija_ct` pristatymo neatima (Raimis: perskaičiuoti kai paaugs imtis). Istorijos `pristatymas_paimta_ct` vid. €8,12 — vienetai/prasmė tikrintini (WC dabar €0,96–3,30).
10. **Recon A klaida**: rėmiausi neegzistuojančiu stulpeliu `pristatymas_ct` (tikras — `pristatymas_paimta_ct`) → klaidinga išvada „klientas nemoka". Pataisyta `s1684_md`. Pamoka: `SHOW COLUMNS` prieš agregatus — visada.
11. **Analitika-langas „Vid. dienų tarp grįžtančio pirkimų" rodė 1** — pasekmė #6, dabar 115.
12. **Kačių PMax PAUSED nuo 09-12** (`ps_ads_recon`), liko `P-max | LT | petshop.lt` €40/d BE MC feed'o ir Search brand. Nauja feed-only „Šunų maistas" — po MC review.
13. **`ps_email_content` 15 srautų — visi draft** (tekstai „Pagal ankstesnį pirkimą apskaičiavome…"); Raimio tekstai `refill_due`, `post_purchase_14d` reikalingi iki 09-21.
14. **GA4 `purchase` dvigubinasi** (naršyklė + serverio MP) — žinoma nuo S1681, netaisyta.
15. **Bridge lygiagrečiai iš dviejų langų**: `analize/*.json` conflict'ai kas pull'ą; rebase → detached HEAD. Taisyklė: `git fetch && git rebase origin/main`, conflict → `--theirs analize/`, po to `git checkout -B main <sha>` jei detached. Geriau — vienas langas bridge'ui vienu metu.

### Atviri Raimio sprendimai
- Soft opt-out teksto žodžiai (spec) · legacy laiškas 561 prenumeratoriams · 5 100 istorinių informacinis laiškas (nuspręsta „taip, vieną, tyliai" — tekstas ir siuntimas per Sender dalimis, po sprinto) · `ps_lifecycle_vartai`=`atvira` esamiems 38 tracking klientams be žymos (dabar `soft` → jiems laiškų nebus).
