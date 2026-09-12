# Deployment log v1.9.65 — S1677 (2026-09-12, Ads pertvarka)
| # | Kas | Kur | md5 | bak |
|---|---|---|---|---|
| 1 | Feeds v2.5.0 — custom_label_1 'pigu' (<€12) | plugins/petshop-feeds/petshop-feeds.php | 97626f5e… | ps-backups/petshop-feeds.php.bak_s1677 |
| 2 | petshop-ads-offline v1.1 — gclid endpoint + serverinis gclid fiksavimas | mu-plugins/petshop-ads-offline.php | 04708b96… | naujas (v1.0 tarpinis) |
| 3 | Consent Bridge v1.4 — denied default, redaction on | snippet #619 | d4ff8567… | opcija ps_snippet619_bak_s1677 |
| 4 | Ads UI (Raimis): konv. veiksmas „Įkėlimas neprisijungus" pagrindinis, Purchase antrinis; kačių ON; PMax 2×€20; URL expansion OFF; Ads Script offline konv. paleistas (10 eil.) | Ads 754-153-0584 | — | — |
Rollback: 1 — bak kopija; 2 — ištrinti failą; 3 — `update snippets set code=(opcija)`. Detalės: `dokumentai/ADS_PMAX_bukle_s1677.md`.
