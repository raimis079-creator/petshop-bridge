# PERDAVIMAS 2026-09-02 — sesija S1591–S1601 (prekių katalogas)

> Kitam langui. Tiesos šaltiniai: `dokumentai/deployment_log_v1_9_4.md` (pilnas, repo), REGISTRAS v34, TŽ MASTER v1.92. Aukščiausias decision Nr.: **S1601**.

## Kas padaryta šiandien (viskas patikrinta serveryje)
- **S1591** Exclusion Hypo konservai grąžinti į VF (rules VF v1.1: `VET kons.` kategorijos + `kons.` raktažodis). 8 AV konservai → AV+VF, 11 naujų publish. **Radinys:** VF importas (#5/#7) buvo negyvas nuo 08-22 (fetcher 404 po R192), cache 08-21 → naujas `petshop-vf-feed.php` v1.0 (VF API → lokalus failas, pmxi #5/#7 `type=file`). Hostui nebeliko priklausomybės.
- **S1592** Sources v2.3: dviejų sandėlių eilutės iš meta, `_zb_sku` → `_zb_supplier_sku`; spragos 41 VF / 32 ZB / 38 be sandėlio → 0/0/13 (likę rinkiniai).
- **S1593** ZB Import #3 buvo NO-OP (be `_zb_qty` mapping'o) — 851/1 056 likučių neteisingi; pataisyta, 1 056/1 056 sutampa su stocks.php.
- **S1594** `petshop-import-tempas.php` v1.2 — Import #3 processing kas 2 min iš WP-cron (raktas = PMXI `cron_job_key`, ne `secure`).
- **S1595–S1598** `petshop-laukai.php` v1.44–1.46: rinkiklio kategorijos + konservai; meniu „Susidėk…“ dinamiškai per `iejimas()`; dėžės nerodomos RINKINIAI sąraše.
- **S1597** `petshop-rinkiniu-rusis.php` v1.0 + YITH preset `rinkiniu-filtras` + snippet 332 v20 — filtras „Gyvūno rūšis“ rinkiniams.
- **S1599–S1600** Analizė iš `ps_ist_fakt_eilutes` → **11 paruoštų rinkinių DRAFT** (35392–35412), kaina = suma (5–6: −6 %), visi vieno sandėlio. Raimis peržiūri ir publikuoja.
- **S1601** `petshop-rinkiniai.php` v1.44: varnelė „Tik kurjeriu“ pagaliau veikia kasoje (anksčiau tik žyma); rinkiniai ją paveldi.
- deployment_log **v1.9.4** (atkurta S1571–S1580, santraukos S1549–S1570/S1524–S1531; spraga S1282–S1523 lieka).

## Atvira / laukia Raimio
- 11 rinkinių draft — publikuoti; PESS ir Georplast savikainos (0) — maržos nerodo; fontanas 19140 „tik kurjeriu“? (35402 paveldės).
- Skanėstų šunims ir kramtalų dėžės — visos draft → meniu veda į RINKINIAI kategoriją, kol nepublikuota.
- T-0 papildymai: #25 sargas (pmxi/feed šviežumas — imties palyginimas su feed'u, ne `_last_sync`), #27 `ps_import_tempas_host` option trinti.
- Hosting cron `2 *` #3 processing — nebebūtina keisti.
- ZB Import #2 — pilnas praėjimas ~2 d. (1 processing kvietimas/val. tik 06 ir 18 val.) — tempas modulis apima tik #3; jei reikia, `IMPORTAI = [3,2]`.

## TEMP
Ištrinta 42 (4468–4509); liko 4510 (šio runo, deaktyvuotas) → trinti kitą runą.

## Failai repo (šios sesijos)
```
mu-plugins/petshop-vf-feed.php v1.0 · petshop-import-tempas.php v1.2 · petshop-rinkiniu-rusis.php v1.0
mu-plugins/petshop-laukai.php v1.46 · petshop-rinkiniai.php v1.44
plugins/petshop-xml/includes/class-import-rules-vf.php v1.1 · moduliai/petshop-sources-snippet2515.php v2.3
dokumentai/deployment_log_v1_9_4.md · PERDAVIMAS_2026-09-02.md
ps-backups (serveris): class-import-rules-vf-v10, sources-v22, snippet332-v19, petshop-laukai-v143, petshop-rinkiniai-v143, exclusion-hypo-kons.json
```
