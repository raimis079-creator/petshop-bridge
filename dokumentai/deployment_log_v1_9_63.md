# deployment_log v1.9.63 — S1675 (2026-09-12, vakaras/naktis) — Auditas + pataisos 1–4, #35873 atšaukimas, istorijos patikra

## GYVAI (visi su backup, patikrinti)
| # | Kas | Detalės |
|---|-----|---------|
| 1 | 63 prekės → `outofstock` per WC API | publish, `_stock_status=instock`, `_stock+_own ≤ 0`, backorders no, be kito aktyvaus šaltinio su likučiu, tik simple: av 60 + belcor_tofu 3. Praleista: 12455/12930 (zb su likučiu registre), 15938/17862 (variable). Front „Neturime“ ✓ (14984, 15651, 17345). Backup opcija `ps_s1675_stock_bak`. Įrankis `irankiai/s1675_d.php` (DRY→APPLY), patikra `s1675_e.php`. Priežastis: likučiai rašyti tiesiai į meta be WC statuso sinchronizacijos (S1637/S1668 įrankiai) |
| 2 | **base.php v2.13** `themes/flatsome-child/woocommerce-delivery-notes/base.php` | md5 `3d35885d7734db92b76f0d57434ed35a` (buvo v2.12 `4b865eef…`), bak `uploads/ps-backups/base.php.bak_s1675`, repo `deploy/wcdn-base-v2.13.php`. **Klaida v2.12:** `petshop_get_avpn_number()` kviesta besąlygiškai PRIEŠ dokumento tipo nustatymą → kiekviena išankstinė (IAPV) degino AVPN numerį ir rašė `_petshop_avpn_number` neapmokėtam. v2.13: tipas per `petshop_get_invoice_document_type()` (+ saved proforma) pirma, AVPN tik `invoice`. E2E: #35902 (bacs on-hold) IAPV000116 regeneruota, AVPN neatsirado, counter 11021 nepakito (`s1675_f.php` FIND/APPLY, `s1675_g.php`). #35902: `_petshop_avpn_number=AVPN011016` nuimtas su pastaba — **skylė 011016 lieka** (011017–011020 jau išduoti). `_wcdn_invoice_number=AVPN1016` nelietas (S1662 atviras) |
| 3 | `uploads/ps_bak_arch_20260909.json.gz` perkeltas | buvo viešai 200 (1,1 MB, 44 ps_*_bak opcijų archyvas). Dabar `/home/gyvunai2/domains/petshop.lt/ps-archyvas/` (už webroot, md5 59e6d15c… sutampa), HTTP 404. Ten pat `wp-config.php.bak_s1675` (`s1675_h.php`) |
| 4 | wp-config PHP klaidų žurnalas | po `define('WP_DEBUG_DISPLAY', false);` pridėta `@ini_set('display_errors','0'); @ini_set('log_errors','1'); @ini_set('error_log', dirname(__DIR__).'/logs/php_error.log');` (wp-config md5 `91e788008fcaddba746871fc7ee51499`). Patikra nauja užklausa: display 0 / log 1 / testinis Warning įrašytas, ping 200 (`s1675_i.php`). Iki tol: `log_errors` išjungta, `error_log` tuščias, `display_errors=1` (WP_DEBUG false → WP_DEBUG_DISPLAY neveikia) — Warning'ai lankytojams, Fatal tik WC `fatal-errors` loge |
| 5 | #35873 (bacs on-hold nuo 09-09, €13,31) atšauktas tyliai | Raimio nurodymu — tas pats klientas apmokėjo #1003 (Paysera, ta pati suma). `pre_wp_mail` blokas: phpmailer 0 kartų, WC pastaba „Email sent“ = tik žurnalas. Likutis pid 14951 11→15 (`_reduced_stock=4` iš S1661 suveikė) (`s1675_k.php`) |

## Auditas (read-only, `irankiai/s1675_a/b/c.php`, `analize/s1675_a/b/c.json`)
- 🟢 ping 200, cron 0 pavėlavusių (79), Venipak sekimas 0 klaidų, AS 0 past-due, Paysera `paid_order_status=wc-processing`, welcome 1, feeds 2.4.1 (20:44), užsakymų nr. 1000–1020 be skylių, AVPN 011000–011020 ištisai, neigiamų likučių 0, retry queue tuščia, email_jobs švarūs (post_purchase 7d/14d pending — suplanuoti), diskas 383 GB, `/wp-json/` 200.
- 264 neaktyvūs TEMP snippetai ištrinti (buvo susikaupę; bridge trina tik run pradžioje).
- 🟡 ATVIRA: Fatal 09-10 10:00 UTC `array_slice(): false given` snippeto eval'd kode (eil. 12) + 09-08 `get_type() on false` ×2 — snippetas neidentifikuotas (greičiausiai TEMP); AV registras vs `_own` #18590 (4 vs 5, snippet 2515); `_ps_sla_velavimas` liko ant completed 35880/35881; 10 plugin atnaujinimų (WP 6.9.4, WC 11.0.1); wpforms AS veiksmai „failed“ kas savaitę (plugino nėra) — išvalyti; 354 `.php*` backup'ai `uploads/ps-backups` (serveris 403, bet geriau už webroot); ps_sargas_svara 09-08 „negyvu 43“ (našlaitės eilutės); 47 publish instock su `manage_stock=no` — netikrinta ar tik variable tėvai.
- `shell_exec` serveryje išjungtas (Fatal mano testo skripte — pamoka).

## Istorijos patikra (`s1675_o/p.php`) — „užsakymai nedingsta“
- Nuo 35868 iki 35906: 39 ID, 28 užsakymai (15 completed, 5 processing, 7 cancelled, 1 on-hold). Spragos 35869 (auto-draft), 35870/35896/35897/35899/35900 (attachment), 35895/35898 (product) — WC ID seka bendra su posts; 35877–35879 testiniai ištrinti S1661/S1663.
- Atšaukimo mechanizmai gyvai: Paysera pending → WC `hold_stock_minutes=90` → cancelled (35876, #1004, #1005; pastaba „baigėsi laukimo laikas“); `ps_dl_atsauktu_valymas` 03:20 → šiukšlinė/galutinai (paskutinis 09-11: 0/0); bacs on-hold — automato NĖRA; krepšelis — ne užsakymas.
- Krepšelis (`petshop-core/includes/class-cart-abandonment.php`): `ABANDON_AFTER=7200` (2 val. → abandoned + 1-as laiškas), `STAGE2_AFTER=86400` (+24 val. 2-as), `MAX_AGE_DAYS=7` (→ expired, be laiško). Laiškas tik su žinomu paštu + consent (7 d.: 77 abandoned, 3 sent, 3 skipped consent_missing). Raimis manė „1 val. perspėjimas, 2 val. atšaukimas“ — kode nėra.

## Raimio sprendimai / pozicijos
- #35902 (#1016, bacs on-hold, paštas `i.***@gnail.com` — klaida): priminimas +48 val., paskui ištrinimas — **trigerio nėra (S1640 blokas), laukia „daryk“**; paštą Raimis taisys (darbalaukis v3.40 „Redaguoti“) arba pasakys.
- Krepšelio 1 val. vietoj 2 val. — neapsispręsta („rytoj prie šitų klausimų grįšim“).
- Strategija (pokalbis, ne užduotys): tikslas €50 k/mėn. per metus — Claude: realistiškai €25–30 k/12 mėn., €50 k/20–24 mėn.; 4 svertai (pakartotiniai/refill, Ads su ROAS ≥ lūžio, čekis, SEO+portalai); dropship — ilgai uodegai, AV — top SKU; AV dropship kitiems — tik su išskirtiniu brendu, skanėstams — ne (pakavimas, marža); skanėstai — private label + fiksuoti SKU + čekio kėlimas; rinkinių mix — spręsti iš ps_fakt (attach rate, marža×pakartojimas, ko-pirkimas). Marketingo planas — po D–F Ads duomenų (2–3 sav.).
- Platformos vertė: atkūrimo kaina €100–250 k, pardavimo kaip kodo ~0, kaip produkto — tik konsultacijos 3–10 shopams.

## Pamokos
- Likučius rašant tiesiai į meta būtina sinchronizuoti `_stock_status` (arba per WC API) — kitaip prekė lieka perkama su 0.
- Sąskaitų šablone numerio getter'iai kviečiami TIK po tipo nustatymo (lazy getter'is su counter'iu = šalutinis efektas).
- Bridge po clone: `chmod +x irankiai/run.sh`; `shell_exec` nėra; workflow pats commit'ina `analize/` — vietinis commit'as konfliktuoja, daryti `reset --hard origin/main` + iš naujo.

## Kitas žingsnis (09-13)
STARTAS_2026-09-13_po_S1675.md: (1) Raimio sprendimai — bacs 48/72 h trigeris, krepšelio 1 val., #35902 paštas; (2) Ads recon v1.3 + PMax D pagal S1674 planą (Raimis: „Ads palikime rytojui“).
