# deployment_log v1.9.68 — S1680 (2026-09-14 rytas) — Darbalaukis v3.41.2, LP lipduko recon

## Darbalaukis v3.41.2 (GYVAI, ping 200, VERSIJA 3.41.2)
- `mu-plugins/petshop-darbalaukis.php` md5 0f714f6461cb4f349022d094723cbf6e (buvo v3.41.1 23a911c4…); bak `ps-backups/petshop-darbalaukis.php.bak_s1680`; repo `deploy/petshop-darbalaukis-v3.41.2.php`, DATA `deploy/dl_v3412.txt`, įrankis `irankiai/s1680_b.php`.
- Raimis 09-14: „noriu matyti į kokį paštomatą užsakė klientas" — kortelėje „Pristatymas" vietoj vien ID (`Venipak paštomatas · 3480`) rodomas pavadinimas ir adresas: nauja `vietos_pav($o,$f)` — Venipak per plugino `venipak_resolve_order_pickup` + `vietos_tekstas`, LP — plugino meta `_woo_lithuaniapost_lpexpress_terminal`. Viena vieta (`'vieta' =>` kortelės masyve, JS `prist()` neliestas).

## PVM sąskaita (Raimis: „dingo mygtukas")
Ne gedimas: AVPN išrašoma temos kabliu `woocommerce_order_status_completed` → „Kurjeris paėmė". `processing` užsakymui rodoma tik IAPV. Pilkas „Sąskaita" mygtukas nuimtas v3.26 (S1617). Pasiūlyta: mygtukas „Išrašyti PVM sąskaitą" apmokėtam neišsiųstam — Raimis dar nesprendė.

## LP Express lipdukas (Raimis: „negalima sukurti") — recon `irankiai/s1680_a.php`
- LP užsakymai #1009 (35889, Norfa Kupiškis 4801), #1010 (35890, Maxima Pilaitės 0114), abu 09-10, `processing`, būsena `lp-parcel-created`, `_woo_lithuaniapost_shipping_item_id` yra, `_woo_lithuaniapost_barcode` NĖRA → siunta LP sistemoje sukurta, bet siuntimas neinicijuotas (lipdukas be barcode negeneruojamas). `parcel_create_error` tuščias, plugino žurnalų nėra.
- Pluginas woo-lithuaniapost 4.0.32; terminalų lentelė 1390. Lipduką kuria LP pluginas (J1), ne darbalaukis.
- Atvira: kur Raimis spaudžia ir kokia klaida — laukiama ekrano.

## Darbalaukis v3.42 (GYVAI, ping 200, VERSIJA 3.42) — LP Express lipdukas iš darbalaukio
Raimis: „pats viskas gali pasižiūrėti… padaryk tokį principą kaip Venipak". Priežastis: LP lipdukas iki šiol buvo tik per WC užsakymų sąrašą (J1, `senas=1`), kortelėje LP užsakymui rodė „Lipdukas LP — per Rytinę eigą", kuri LP nedaro → darbuotojui kelio nebuvo.
- md5 fc993421845c82eda30dbd4574f8a8dc (buvo v3.41.2 0f714f64…); bak `ps-backups/petshop-darbalaukis.php.bak_s1680e`; repo `deploy/petshop-darbalaukis-v3.42.php`, DATA `deploy/dl_v342.txt`, įrankis `irankiai/s1680_e.php`.
- LP plugino (woo-lithuaniapost 4.0.32) kelias (recon `s1680_c/d.php`): filtras `woo_lithuaniapost_order_action_generate_stickers([order_id])` → `handle_generate_stickers` → jei būsena `lp-parcel-created` — `handle_initiate_shipping` (barcode → `_woo_lithuaniapost_barcode`) → `download_stickers_pdf` (header + echo PDF, grąžina true).
- Darbalaukyje: kortelės veiksmas „Lipdukas LP" (dialogas su paštomatu/svoriu) → GET `lp_lipdukas` → `lp_lipdukas()`: jei nėra `_woo_lithuaniapost_shipping_item_id` — pirma `do_action('woo_lithuaniapost_order_action_create_parcel')`; filtras su `ob_start()`, antraštės nuimamos, PDF → `uploads/ps-lipdukai/lp/LP-{nr}-{barcode}.pdf`, meta `_ps_lp_lipdukas_pdf`, pastaba; klaidos — per V14 `siuntos_klaida` / plugino errors raktus. Kortelėje „Lipdukas LP (PDF)" (GET `lp_pdf`, inline) + „Lipdukas iš naujo". Registras `_ps_siuntos` neliečiamas (LP numeris — plugino meta, `faktai()` jį ima kaip iki šiol → toliau „Kurjeris paėmė").
- Netestuota gyvai (realus LP API veiksmas) — pirmas testas: Raimis/Inga spaudžia „Lipdukas LP" ant #1009 arba #1010.
