# 6 ETAPAS — TESTINIŲ DUOMENŲ VALYMO PLANAS v1 (recon S1620, 2026-09-06; NIEKAS DAR NETRINTA)

> Šaltinis: `irankiai/s1620_e6r.php` (U/L/K) + `s1620_e7r.php` (R), `analize/s1620_e6r.json`, `s1620_e7r.json`. Dev ir prod — tas pats WP/DB (dev veidrodis), todėl **viskas, kas čia, atsidurs petshop.lt** — valymas privalomas iki T-0. S1267 pamoka: trynimo kaskadų NĖRA — kiekvienai lentelei atskiras žingsnis su sargu ir skaičiais prieš/po.

## 1. Užsakymai — VISI TESTINIAI (HPOS įjungta)
- `wc_orders`: **64 užsakymai + 8 grąžinimai (refund)** = 72. Statusai: processing 27 · completed 20 · cancelled 14 · on-hold 3. Visi: 08-26 (#35087, #35088, #35090, #35100 — terra@gyvunai.lt, AVPN272–275 + IAPV), 09-02…09-06 (#35414–#35813 — terra@petshop.lt / 5787 / 1 / telefonu / atsiėmimas). Refund'ai: #35091, #35092 (←35090), #35093 (←35088), #35788 (←35414), #35789 (←35425), #35795 (←35434), #35798 (←35436), #35800 (←35777).
- Susijusios WC lentelės (trina `$order->delete(true)`): `wc_orders_meta` 1 755, `wc_order_addresses` 128, `wc_order_operational_data` 72, `woocommerce_order_items` 263 (+ `itemmeta` 3 093). **Našlaičiai jau dabar** (seni #3300–#3304): `wc_order_stats` 4, `woocommerce_order_items` 10 eil., `wc_order_product_lookup` 6, `wc_order_tax_lookup` 4 — valyti atskirai (`DELETE … WHERE order_id NOT IN wc_orders`). `wc_customer_lookup` 33 (testiniai) — po trynimo perskaičiuoti / išvalyti.
- Paslaugų PREKĖS #35790 „Pakartotinis siuntimas“, #35796 „Siuntos grąžinimo išlaidos“ (private) — **NETRINTI** (gamybai).

## 2. Mūsų lentelės, rišamos prie užsakymų (visos — testiniai)
| Lentelė | Eil. | Sąsaja | Veiksmas |
|---|---|---|---|
| `ps_shipments` | 25 (18 užs.) | order_id | trinti visas |
| `ps_fakt_siuntos` | 25 | uzsakymas_id, testinis=1 | trinti testinis=1 |
| `ps_fakt_uzsakymai` | 67 (7 našl.) | testinis=1 visi | trinti testinis=1 |
| `ps_fakt_eilutes` | 109 (2 našl.; sandelis legacy 51 · vf 22 · prins 10 · ambrosia 9 · zb 5 · quattro 4 · belcor 1) | testinis=1 visi | trinti testinis=1 |
| `ps_fakt_grazinimai` | 11 | testinis=1 | trinti testinis=1 |
| `ps_fakt_atsargos_d` | 31 765 (08-25…09-05) | testinis=1 visi | trinti testinis=1 (T-0; iki tol lieka ataskaitoms) |
| `ps_uzsakymu_ivykiai` | 630 (324 našlaičiai, uzsakymas 0…35773) | uzsakymas | trinti visas |
| `ps_tiekimas` 6 + `ps_tiekimas_eil` 5 | 09-02/03 (quattro/prins/vf/zb, gauta/kaupiama) | order_id 35421–35450 | trinti visas |
| `ps_plan_events` | 7 | order_id 0 | trinti |
| `ps_carts` | 131 (abandoned 56 · expired 64 · converted 9 · active 2; 6 našl.) | converted_order_id | trinti visas (Q-GDPR) |
| `ps_refill_tracking` | 30 (user 1, 76, 5787) | last_order_id | trinti visas |
| `ps_email_jobs` | 375 (payment_failed 321, **post_purchase_7d/14d pending 9+9**, refill_due 12 …) | testiniai | **trinti visas — pending laiškai po paleidimo išeitų testiniams adresams** (cron be hosto — dev-pastas negaudo) |
| `ps_event_log` | 866 | testiniai ESP įvykiai | trinti visas |
| `ps_action_tokens` | 415 | magic-link žetonai | trinti visas |
| `ps_ataskaitu_dienos` | 838 — **visos `aplinka=dev`** (laukai 719, piltuvelis 81, pardavimai 27, parduotuve 7, refill 4) | — | trinti aplinka=dev (S1267 Q-E0-7) |
| `ps_kontrole_dienos` | 9 (08-28…09-05) | — | trinti |
| `ps_web_ivykiai` 1 104 / `ps_web_dienos` 423 | testinis stulpelis | — | trinti testinis=1 / dev |
| `ps_sargas_klaidos` | 3 193 (08-17…09-06) | klaidų žurnalas | išvalyti |
| `ps_dev_pastas_zurnalas` (opcija) 42, `ps_audit_mail` | — | — | išvalyti |
| Opcija `ps_s1617_test` | — | — | trinti |
| `wcdn/invoice/` **91 PDF** (4,5 MB, nuo senų „Invoice -35262-…“ iki AVPN000341), `wcdn/creditnote/` 4, `wcdn/receipt/` 2 | — | — | trinti visus |

**PALIKTI (ne testiniai):** `ps_ist_*` / `ps_v_analize_*` (senos parduotuvės istorija, uzsakymas_id 9000xxxxx — „našlaičiai“ pagal dizainą), `ps_dim_klientai` 5 431 (testinis=0) ir `ps_kl_suvestine` 5 701, `ps_nl_snapshot` 562, `ps_sources` 3 962, `ps_feeding_*`, `ps_fakt_kainos` 1 351 (kainų istorija — patikrinti testinis prieš), `ps_fakt_reklama`, `ps_fakt_gsc_*`, `ps_seo_*`, `ps_tarifai`, `ps_pakuotes`, `ps_brand_alias`, `ps_email_content` 15 (laiškų turinys), `ps_av_zurnalas` 557 (prekių keitimų auditas — palikti), `ps-backups/` 368 failai 59,5 MB (kodo kopijos — palikti; peržiūra T-0 po).

## 3. Sprendimų reikia iš Raimio (prieš bet kokį trynimą)
- **A.** Trinti VISUS 64 užsakymus + 8 refund'us (tarp jų 08-26 tavo terra@gyvunai.lt ir #35441/#35442 iš paskyros #1)?
- **B. Testiniai vartotojai** (`wp_users` 5 703, dauguma — legacy importas, PALIEKAM). Trinti: #60–63 `e2e.*@dev.avesa.lt`, #74 `pastas-test.lt`, #76 `testas.stat@example.com`, #21–44 `m8ui_*/m8e2e_*/dup*/s208_*/dash_*/v2_*/ph_*@gyvunai.lt` (M8 testai; `wc_customer_lookup`), #5787 `s1609klientas`. **Klausimas:** #4949 `test@test.lt`, #4950 `testijusaite@gmail.com`, #24 `gutulis@gmail.com` — testiniai ar tikri (legacy)? `testuotojas` #75 — palikti iki T-0 (E2E), tada išjungti.
- **C. `ps_partijos`** 10 partijų (08-10/12: #34889 24/30/7 vnt., #34905, #19740, #19765, #19770 — savikainos, „Sukurta prekės kortelėje“) — testinės ar tikros gavimo partijos?
- **D. Augintiniai** `ps_pets` 69 (38 — tavo #1; kiti — testiniai vartotojai), `ps_pet_products` 36, `ps_pet_notes` 7, `ps_reminders` 10, `ps_stock_watch` 3, `ps_consent_log` 575, `ps_pet_profile_drafts` 4 — trinti viską ar palikti tavo #1?
- **E.** Ataskaitų / faktų dev duomenys (`aplinka=dev`, `testinis=1`) — trinti viską (prod pradeda nuo nulio)?
- **F.** Likučiai: 19708 `_stock` 16 → **20** (log). VF prekių `_stock` (35357 6, 16889 14) — VF sync (kas val.) atstato pats. AV likučiai 16727 / 16889 / 19756 = 1 (`Petshop_AV_Stock::qty`, `_own_stock` tuščias — saugoma ne postmeta; pradines reikšmes atkurti iš `ps_ivykiai` 6 187 eil. `sena/nauja` prieš apply) — atkurti?
- **G. Kada:** siūlau (Claude) — vienas įrankis su **dry-run** (skaičiai per lentelę) ir **apply** (kiekvienas žingsnis su sargu: tik ID iš sąrašo / tik `testinis=1` / tik `aplinka=dev`; kopija — SQL dump per `wpdb` į `ps-backups/` prieš), paleisti DABAR (po A–F), po E2E (naujų testinių) pakartoti **T-0 naktį** kartu su skaitikliais → 101 (AVPN dabar 342, IAPV 168, KR-AVPN 105, PPK 103 — „kitas“).
- **H.** Faktų `sandelis` **`legacy` → `av`** — variklio keitimas (`Fulfillment_Source::resolve`, log S1617 r4/r5); po valymo eilučių nebeliks, bet naujos toliau rašys `legacy` — leidimas keisti variklį?
- **I.** ~~Tikra darbuotojo paskyra~~ — PADARYTA S1620: #5788 `inga`, terra@petshop.lt, `ps_darbuotojas`.

## 4. Eiga (po sprendimų)
1) Įrankis `irankiai/s16xx_valymas.php`: fazė **D** (dry-run: kiekvienai lentelei `COUNT` pagal sargą, failų sąrašas, likučių planas) → Raimis peržiūri → fazė **A** (apply: kopija → užsakymai per `wc_get_order()->delete(true)` po vieną su `try`, refund'ai pirma → lentelės → failai → opcijos → likučiai → WC lookup našlaičiai → `wc_customer_lookup`) → fazė **Q** (skaičiai po: viskas 0, darbalaukio eilės Visi 0, skydelis tuščias — Playwright). 2) E2E auditas (spec §10.6) su `testuotojas` → naujų testinių sąrašas → T-0 pakartoti A su skaitikliais → 101. 3) Tikra paskyra, `testuotojas` išjungti.

## 5. Papildymas v1.1 (antras patikrinimas — `s1620_e6r3.php`)
- **NELIESTI papildomai:** prekės **#35781–#35784** (09-04 „Konservų dėžė 400/800 g Įvairovė“, 2 TRIXIE draskyklės — kito projekto), #35785–#35787 revizijos; vartotojai #5757–#5785 (08-31 importas, tikri); `ps_test_product_id`=34889; `wcdn_invoice_number_counter` 364 (WCDN savas).
- **Trinti papildomai / tiksliau:** opcijos `ps_audit_ids`, `ps_e3_oid`, `ps_e3_oid2`; `wc_customer_lookup` #85–#96; `wc_order_stats` našlaičiai 35087–35100 + 35091–35093 po užsakymų trynimo; `ps_refill_tracking` #42–#48 (konkrečiai testiniai; kitų 23 — pagal B); `ps_fakt_uzsakymai` našlaičiai 35240/35262–35266/35288 ir `ps_fakt_grazinimai` 35088/35090.
- **F tikslinimas:** 19708 — AV žurnale paskutinė teisėta `_stock` **48 (08-07 gavimas)**, „20“ = prieš S1619; galutinę reikšmę nustatyti iš `ps_ivykiai` grandinės + pastabų, Raimis tvirtina.

