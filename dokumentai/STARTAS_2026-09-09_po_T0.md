# STARTAS — 2026-09-09 (po S1660, T-0 ĮVYKDYTAS) — **petshop.lt GYVAS ant naujo serverio (79.98.29.24, LE SSL). Realus €1,00 Paysera pirkimas praėjo: processing kelias sutaisytas, AVPN011000, likutis nurašytas. Liko: rytinės patikros + istorijos kėlimas.**

> Naujam langui. Skaityti: šį → `deployment_log_v1_9_51.md` (S1644–S1660) → spec → ZODYNAS → REGISTRAS. Bridge PAT — prašyti Raimio. Konteineryje PHP nėra: `apt-get update && apt-get install -y php8.3-cli`. **Bridge šablone WP='https://petshop.lt'** (jei šviežiai atsisiųstas — pakeisti sed'u; dev.avesa.lt nebenaudoti). Konteinerio proxy petshop.lt blokuoja — visos patikros per bridge. run.sh fazė GET parametrų neneša — hardkodinti payload'e.

## BŪKLĖ PO T-0
- siteurl/home `https://petshop.lt`, options dev.avesa.lt = 0, blog_public 1, force_ssl yes, LE sertifikatas (DirectAdmin isopas.serveriai.lt:8443, gyvunai2).
- Skaitikliai (counter = KITAS): **AVPN 11001** (PVM nuo 11000, Raimio sprendimas) · KRAVPN 101 · IAPV 101 · PPK 101 · wcdn 388 (nelietas, fallback).
- Paysera LIVE (test_mode no ×2, projektas 29276); `paysera_payment_status_settings['paid_order_status']=['wc-processing']` — ĮRAŠYTA S1657 (be jos plugino default wc-completed aplenkia darbalaukį!).
- dev-pastas IŠTRINTAS (BAK ps-backups + repo deploy/) — laiškai eina realiai. Veidrodis (R194, perkelti-r186, dev-veidrodis) ištrintas su BAK.
- Užsakymas #35868 (€1,00, completed, AVPN011000) — **trinti/palikti Raimis nesprendė**. Σ `_stock` 293 355. Užsakymų 1.
- local_pickup #16 OFF, welcome modal OFF (Raimis nesprendė — palikta).
- 38 `ps_*_bak` opcijų palikta valymui po T-0.

## RYTINIAI DARBAI
**Claude (T0 plano §PO):** (1) Paysera callback pirmam TIKRAM kliento užsakymui → processing automatiškai; (2) laiškai realiai išeina (SMTP debug + mail-tester, from uzsakymai@); (3) `s1634_g.php` stiliaus patikra: Warning 0, eilės, cron, 404/301; titulinio 9 img; `ps_sender_webhook_log` pildosi. Toliau: istorijos `irankiai/s1643_h2.php` kėlimas (žr. log v1_9_50 S1643 — adapterio rebuild kablys NETIRTAS, DRY→OK→A), `ps_*_bak` valymas.
**Raimis:** 6 cron URL (jei dar ne) · Sender.net webhook → petshop.lt · GSC + Ads Brand ON · **Kaina24/Kainos.lt resubmit** `https://petshop.lt/feed/kaina24` ir `/feed/kainos` (OPS-06) · Flatsome licencija + soc. nuorodos · pirma REALI Venipak/LP siunta (J1!) kartu · eShoprent NEIŠJUNGTI iki patvirtinto kelio · po paros TTL 300→3600 · #35868 sprendimas.

## Kas gyva (nekeista naktį)
Katalogas v8.7.9, darbalaukis v3.39.3, juosta v1.10, tiekimas v1.10.1, klientui v1.0.1, kliento-siuntos v1.3, vertimai v1.2, welcome-modal v1.3 (0), wcdn base v2.12. Aktyvūs 71 LIVE snippetai — norma. T1 atviri variklio punktai — kaip log v1_9_50. Raimio taisyklės — kaip STARTAS_2026-09-09_T0.md (galioja visos).

## ATSITRAUKIMAS: DOD-19 (A → 213.226.161.16 + .15 zonoje klientams.iv.lt id=447163, TTL 15 min; siteurl/home atgal; ESANT #35868 — jau yra 1 realus mokėjimas, vertinti prieš traukiantis).
