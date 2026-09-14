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
