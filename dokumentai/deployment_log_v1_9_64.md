# deployment_log v1.9.64 — S1676 (2026-09-12, diena) — Smulkmenos po paleidimo: krepšelio laiškai, bacs trigeris, DP pakai, gavimo principas, siuntų faktai, analitika

## GYVAI (visi su backup, patikrinti)
| # | Kas | Detalės |
|---|-----|---------|
| 1 | Krepšelio laiškai `petshop-core/templates/emails/cart-abandoned-1.php` (md5 `f8bd8dc8…`), `-2.php` (`fe362694…`) | Raimio tekstai: 1) „Krepšelyje liko jūsų prekės“ / „Sveiki, jūsų krepšelis išsaugotas. Jei norėsite tęsti, prekių ieškoti iš naujo nereikės.“ (1 prekei tema lieka „Dar svarstote dėl X?“); 2) „Jūsų krepšelis dar laukia“ / „…atsakykite į šį laišką — padėsime.“ (atsakymai į uzsakymai@, Raimis skaito). Bak `ps-backups/cart-abandoned-*.php.bak_s1676`, DB juodraščiai 54/55 sinchronizuoti. Terminai 2 val./+24 val./7 d. — nekeičiam (Raimis). |
| 2 | **`mu-plugins/petshop-bacs-priminimas.php` v1.0.2** (md5 `f3629926…`, repo `deploy/…-v1.0.2.php`) | Bacs on-hold: +48 val. priminimas (Raimio tekstas, rekvizitai iš `Petshop_Darbalaukis::PAKART_BANKAS`, data „rugsėjo 14 d. 11:19“), +72 val. `cancelled` su WC laišku. Po BET KOKIO neapmokėto atšaukimo — krepšelio priminimai +2/+24 val. per dispatch (`?ps_atkurti=ID&k=` atkuria krepšelį). Sargas: naujesnis to paties el. pašto užsakymas → priminimų nėra; naujesnis apmokėtas → atšaukia tyliai. Stabdis: pastaba su „LAUKTI“. Cron `ps_bacs_priminimas` kas val. #1016 paštas gnail→gmail. |
| 3 | **Darbalaukis v3.41 → v3.41.1** (md5 `23a911c4…`, bak `.bak_s1676`, `.bak_s1676b`) | „Neapmokėtas · pavedimu / Paysera / grynais“ sąrašo eilutėje, žymėje „Visuose“, takelyje (`mok_trumpai()`). Venipak kodas 5 (paštomate, laukia kurjerio) = išsiųsta (`VENIPAK_PAEME` +5, Raimio sprendimas). |
| 4 | **`mu-plugins/petshop-analitika.php` v1.0.1** (md5 `b181d2b4…`) | `admin.php?page=ps-analitika` — blokai Reklama / Krepšeliai / Klientai ir marža / Pristatymas / Laiškų srautai, 30/90 d.; kiekvienas: skaičius + norma + verdiktas + ką daryti. Slenksčiai `SLENKSCIAI` (Claude pradiniai). Reklama nuo pirmo fakt užsakymo (09-09). Šiandien: Ads ROAS 2,98 (lūžis 4,5) → raudona; krepšeliai 3,8 → žalia; pristatymas subsidijuojamas −13 € → geltona. |
| 5 | **DP pakai AV variklyje** — `petshop-av-source.php` v1.2 (`cd5fe3b1…`), `petshop-av-reduce.php` v1.2 (`03182a2a…`), snippet 567 v1.3 | Bendras principas (Raimis): pakas → bazinė × kiekis; `resolve()` grąžina AV pakais; `mazinti/grazinti` per bazinę (`_ps_av_reduced_pid`); 567 praleidžia `_ps_source=av`. Bak `ps-backups/petshop-av-*.php.bak_s1676`, `snippet-567.bak_s1676.php`. E2E testinis užsakymas: bazinė 10→2→10 ✓. |
| 6 | **Gavimo principas** — `petshop-partijos.php` v1.4 (`7372f8ee…`) + **`petshop-gavimo-perrusiavimas.php` v1.1** (`cb01ed0e…`) | Po gavimo `do_action('ps_partija_priimta')` → apmokėtų processing užsakymų eilutės (prekė + DP pakai), laukiančios tiekėjo ir neperduotos, perkeliamos į AV per darbalaukio `keisti_kelia()` (Reflection, „Gavimas (automatas)“). Be šaltinio — praleidžia. Žurnalas `ps_gavimo_perrus_pask`, DRY `perrusiuoti($pid,true)`. v1.1: po gavimo ir po kiekvieno `_own_stock_qty` pakeitimo `ps_sources_sync_saugiai()` → registro AV eilutė iš karto (katalogas kiekį ima gyvai; S1668 snippet 2515 punktas uždarytas). Testas 17689 ✓. |
| 7 | **`petshop-fakt-siuntos.php` v1.7** (`0fa55b91…`, bak `.bak_s1676`) | `gyvavimas()`: isvezta_at iš `_ps_dalys_issiusta`, pristatyta/atsiimta iš `_ps_venipak_sekimas` (k 6/9), statusas issiusta/pristatyta/atsiimta/grizta, dienos_iki_pristatymo; kabliai po sekimo cron, completed, naktinis. Backfill 19/19 → issiusta. #1006 fantominės 73–76 → `atsaukta` (Raimis Venipak pusę sutvarkė). |
| 8 | Likučiai | #17397 Monge Solo antiena: partija 4014 (T-0 papildymas = ZB kopija 1 355) atšaukta, AV 1 379 → **24** (Raimis). Taisyklė ±10 % feed'ui iš 203 „papildymas S1682“ partijų: 12 atšaukta, AV keistas tik 18599 (1 106→19) ir 17394 (414→25) — **Raimis patikrins**; 10 kitų AV jau buvo taisyti ranka, neliesti; 191 palikta (Raimio realūs skaičiai, 193 grynai AV → `_stock`). Bak `ps_s1676_17397_bak`, `ps_s1676_papild_bak`. |

## Patikrinta / uždaryta be kodo
- VF siuntos užsidarė automatiškai 09-11 vakare (Venipak API vėlavo ~5 val.); PHP Fatal žurnale nebėra; TEMP #5424/#5584/#5589 jau ištrinti; `ps_sargas_pastas`=terra@gyvunai.lt — Raimis skaitys, palikti.
- Laiškus siunčia WP Mail SMTP (uzsakymai@), ne Sender. Kiekiai ~30–50/d. — serveris neblokuos; rizika DKIM.

## Pamokos
- Užsakymo eilutės kelias fiksuojamas užsakymo momentu — bet koks likučio pokytis (gavimas) turi jį peržiūrėti pats.
- T-0 „papildymo“ partijos, kurių kiekis = tiekėjo feed — fantominis AV; darbalaukis tada siunčia „iš AV“, kurio nėra.
- Didelių failų deploy per DATA mechanizmą (gz+base64 .txt → WP media → snippet) — GET parametro vardas `d_<failas su _>`.
- Bridge REST trumpam nepasiekiamas (`fx:create`) — kartoti po 20 s.

## ATVIRA
Žr. STARTAS_2026-09-13_po_S1676.md.

## Įrankiai (repo)
`irankiai/s1676_a…af.php`, `deploy/` — visos aukščiau minėtos versijos.
