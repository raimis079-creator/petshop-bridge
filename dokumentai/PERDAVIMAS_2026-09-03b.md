# PERDAVIMAS 2026-09-03b — S1606 (užsakymų sistema: 1 etapas baigtas → 2 etapas)

> Kitam langui. Tiesos šaltiniai: `dokumentai/deployment_log_v1_9_7.md` (S1606 viršuje), `UZSAKYMU_DARBALAUKIS_SPEC_v1.md` v1.1 (UŽDUOTIS), `UZSAKYMU_LOGIKOS_REGISTRAS_v1.md` (taisyklės, variklio neliesti), `AUDITAS_UZSAKYMAI_2026-09-02.md`. Aukščiausias decision Nr.: **S1606**. Maketai (v7, juosta) — **neaktualūs**: Raimis: „maketas nieko neatspindi, koduok pagal tai, ką apkalbėjome“ = spec §1–§7 + registras. Reikia ne proceso, o **idealaus užsakymų lango**.

## Kas padaryta S1606 (1 etapas, spec §10.1) — patikrinta darbuotojo paskyra + Playwright
- **`mu-plugins/petshop-uzsakymu-ivykiai.php` v1.1** (md5 `1bd24c70…`, repo `deploy/`), lentelė **`ps_uzsakymu_ivykiai`**. ⚠ Spec vardai `petshop-ivykiai.php`/`ps_ivykiai` **jau užimti** (prekių auditas, 5 450 įr.) — neliesti; spec §6/§10 tekste keisti į `uzsakymu_`.
  - Gaudo esamus veiksmus iš išorės (desk/dropship/tiekimas/siuntų laiškai admin_post + `wp_redirect`/`wp_die`/shutdown), WC būsenas ir apmokėjimą (prior. 99). Prieš/po nuotrauka: būsena, dėžės, `_ps_siuntos`, mišraus planas, eilučių `_ps_source/_ps_carrier/_ps_av_reduced_qty`, prekių AV likučiai; laiškai → `po.laiskai`.
  - **API darbalaukiui:** `Petshop_Uzsakymu_Ivykiai::irasyti(array)` (uzsakymas, eilute, sritis, veiksmas, rezultatas, busena siulyta/priimta/atmesta, kanalas, pries, po, pastaba) · `uzsakymo($id,$limit)` · `paskutinis($id,$veiksmas)` · `zmogui($row)` · `skirtumas($row)` · `html($id)` skydelio blokui · `do_action('ps_uzs_ivykis')`. Langas `page=ps-ivykiai`.
  - Nepatikrinta: realus PDF kelias (dropship lipduko nonce vardas kitas nei spėjau), laiškų gaudymas per realų `ps_dropship_send`.
- **`mu-plugins/petshop-juosta.php` v1.4** (md5 `95552f96…`): viena juosta visuose `ps-*`/`petshop-*` languose (be ataskaitų): ⌂ · Užsakymai [n] · Rytinė eiga · Prekės [reikia užsakyti — cron kas val. → `ps_juosta_reikia`] · Gavimas · Tiekimas [kaupiama/užsakyta] · Rinkiniai · Akcijos · Laiškai [laukia] · riba · paieška `/` · Žurnalas · vartotojas; antra linija — kelias (sessionStorage) + vienas „← Atgal“. Senos navigacijos ir WP kairysis meniu paslėpti tik CSS; desk `.pd{top:102px}`. Skaičiai — transientas `ps_juosta_sk` 60 s.
- Desk kopija `ps-backups/petshop-desk-v348-BACKUP-2026-09-03.php` (+ S1604 SNAPSHOT, git `pries-juosta-2026-09-02`).

## 2 etapas — `petshop-darbalaukis.php` (NAUJAS failas; `petshop-desk.php` išjungti, ne trinti — R13)
1. Perskaityti spec §1–§7 ir registro ⚠ eilutes — **pilnas sąrašas: A7, A10, B3, C2, C3, C8, D1, E3, E7, I1, I5**. Variklio (registras A–J) NEKEISTI — kviesti esamus `admin-post.php?action=ps_desk_veiksmas&v=…` (`misrus`, `kons`, `lapai`, `vp_reg`, `vp_bulk`, `perduoti`, `issiusta`, `klaus`, `atsaukti`, `apmoketa`, `pakuotes`, `kg`, `av/sava/dropship`) su nonce `ps_desk_{v}_{id}` ir `g=` grįžimo URL; `Petshop_Desk::eile()/klausimas()` protected — per ReflectionMethod (parašai: `eile($order)`, `klausimas($order)`, `gauti($eile,$f)`, `skaiciai()`). Const: `SALTINIAI`, `RIBOS`, `EILES`, `META_PAK='_ps_pakuociu'`.
2. Apimtis (spec §10.2): sąrašas + 8 eilės (užsakymas visose eilėse, kur reikia veiksmo — C3), rikiavimas „kas pirma degs“, takelis, skydelis su **trimis keliais** kiekvienai prekei ir „kodėl“ (`_ps_source_reason`), **likutis seka kelią** (§5, B3 — eilutės lygiu `_ps_av_reduced_qty`), rūšiavimas (`_ps_rusiuota`, auto — 6a), Neapmokėti (C2), Klausimai 5 priežastys (C8), Visi su filtrais; žurnalas skydelyje per `html()`; kiekvienas darbalaukio veiksmas rašo `irasyti()`. Juosta jau yra — darbalaukio viršuje savos juostos nekurti.
3. Deploy+lint+verify viename run'e; patikra `testuotojas` (`irankiai/darbuotojo_testas_sablonas.php`: `$act/$REQ/$snap`, `pre_wp_mail`); vizuali patikra — `irankiai/mjs_template.mjs` su browser=1: fazė grąžina `shots:[{n,u,w,h,full}]` + `cookies` → `screenshots/<n>.png`. `run.sh` laukia `/home/claude/ps/mjs_template.mjs`; lint reikia `php8.3-cli` (apt).
4. Testiniai užsakymai #35414–#35434 (21) **PALIKTI** iki 6 etapo (Raimis 09-03) — jie dengia visus kelius; valymo protokolas auditas §7. Venipak savitarnoje V…030–045 — Raimis.

## Atvira / laukia Raimio (spec §11)
Venipak neatsiimtos siuntos kaina · vėlavimo laiško N ir tekstas · skirtumo apmokėjimas redaguojant · dovanėlės kortelė · LP 1 realus testas. 2 etapui neblokuoja.

## Audito liekanos į kodą
V1 mišrūs be plano ne į laiškus (A10) · V2 grupės svoris · V3 sekimo laiškas iš „Išsiųsta“ · V4 visi numeriai iš `_ps_siuntos` · S1–S6.

## TEMP
Liko `4546` (deaktyvuotas) → trinti pirmo run'o metu.
