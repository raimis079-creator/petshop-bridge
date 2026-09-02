# PERDAVIMAS 2026-09-03 — sesija S1602–S1605 (užsakymų sistema: auditas → strategija)

> Kitam langui. Tiesos šaltiniai: `dokumentai/deployment_log_v1_9_6.md`, `UZSAKYMU_DARBALAUKIS_SPEC_v1.md` (v1.1, UŽDUOTIS kodui), `UZSAKYMU_LOGIKOS_REGISTRAS_v1.md` (taisyklės, neliesti variklio), `AUDITAS_UZSAKYMAI_2026-09-02.md`. Aukščiausias decision Nr.: **S1605**. Maketas galutinis: `dokumentai/uzsakymai-maketas-v7.html` + `juosta-maketas.html`.

## Kas padaryta
- **S1602** pilnas užsakymų auditas darbuotojo paskyra `testuotojas` (17 užs., realūs endpoint'ai, Venipak gyvai). 3 kritiniai + 4 vidutiniai + 6 smulkūs.
- **S1603** K1–K3 pataisyti ir patikrinti: desk v3.48 (atšaukti nepatenka į partiją/registraciją), tiekimas v1.9.3 (priėmimas → eilutė Avesa, rezervas, siuntų sk.; Nemenčinės paštomatas code 300906055 + XML tvarka). Repo `deploy/`, backup `ps-backups/`.
- **S1604** SNAPSHOT `ps-backups/SNAPSHOT-2026-09-02-pries-juosta.zip` (md5 a6a51695…) + git žymė `pries-juosta-2026-09-02`.
- **S1605** strategija: trys keliai, žodynas, eilės, automatika, registras (52 taisyklės, 9 ⚠), spec v1.1, maketai v1–v7, Venipak tracking API patikrinta (veikia, `ws/tracking?code=`).

## Kaip dirbti kitame lange
1. Perskaityti spec §1–§7 ir registro ⚠ eilutes. **Variklio (registras A–J) nekeisti** — naujas darbalaukis kviečia esamus `ps_desk_veiksmas` veiksmus.
2. Etapai spec §10; kiekvienas — deploy+lint+verify viename run'e, patikra darbuotojo paskyra (audito metodas: `wp_generate_auth_cookie` + `WP_Session_Tokens`, nonce iš sesijos; žr. `analize/audit_*.json` ir `ps/au_e.php` šabloną repo? — šablonai neišsaugoti repo, atkurti iš audito aprašymo).
3. Pirma — `petshop-ivykiai.php` (žurnalas) ir `petshop-juosta.php`, tada `petshop-darbalaukis.php` naujas failas; senas desk išjungti, ne trinti.

## Atvira / laukia Raimio (spec §11)
Venipak: ar neatsiimta registruota siunta kainuoja · vėlavimo laiško N ir tekstas · skirtumo apmokėjimas redaguojant · dovanėlės kortelės taisyklė · LP 1 realus testas · kada trinti #35414–#35434 · Venipak savitarnoje V…030–045 ištrinti.

## Audito liekanos į kodą
V1 mišrūs be plano ne į laiškus (A10) · V2 grupės svoris · V3 sekimo laiškas iš „Išsiųsta" · V4 visi numeriai iš `_ps_siuntos` · S1–S6.

## TEMP
Ištrinti 4522–4540; liko paskutinis (deaktyvuotas) → trinti kitą run'ą.
