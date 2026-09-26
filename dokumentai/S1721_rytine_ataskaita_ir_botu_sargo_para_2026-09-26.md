# S1721 · Rytinė ataskaita 09-26, botų sargo para, WPAI #3, pakuočių šeimų kandidatai

Data: 2026-09-26 13:19–14:10. Šaltiniai: WC faktai (`ps_fakt_uzsakymai`, `ps_fakt_eilutes`, `ps_fakt_siuntos`, `ps_fakt_reklama`), Ads UI (Claude naršyklė), botų sargo žurnalas, access logai (`logs/Sep-2026.tar.gz*`), `pmxi_history`. Gyvai NIEKO nekeista. Įrankiai: VM `ps-bridge/s1721/a–d.php` (read-only), repo `irankiai/s1721_a–d.php`.

## 1. Ads → WC (faktai)

| Diena | Užs. | € | Kontrib. € | Siuntos € | Nauji | Google užs. | Google € | Google kontrib. | Google nauji | kaina24/kainos |
|---|---|---|---|---|---|---|---|---|---|---|
| 09-19 | 10 | 301 | 81 | 17 | 5 | 6 | 173 | 46 | 3 | 3 |
| 09-20 | 9 | 355 | 82 | 20 | 3 | 6 | 265 | 62 | 2 | 1 |
| 09-21 | 9 | 405 | 77 | 16 | 3 | 3 | 170 | 31 | 0 | 0 |
| 09-22 | 7 | 342 | 94 | 13 | 3 | 5 | 264 | 76 | 1 | 1 |
| 09-23 | 11 | 522 | 112 | 25 | 7 | 7 | 344 | 81 | 4 | 2 |
| 09-24 | 8 | 383 | 95 | 28 | 3 | 4 | 187 | 48 | 1 | 2 |
| 09-25 | 9 | 537 | 78 | 3* | 5 | 5 | 272 | 40 | 2 | 3 |
| 09-26 (iki 13:00) | 3 | 90 | 25 | 0 | 1 | 2 | 39 | 9 | 1 | 0 |

\* siuntos dar neregistruotos (1 iš 5).

Ads išlaidos (`ps_fakt_reklama`, traukimas 02:01): 09-25 — šunų PMax €16,36 (46 kl.), kačių PMax €17,50 (72 kl.), brand €2,60 (14 kl.) = **€36,46**; Shopping eilutės nėra (0 parodymų). 09-24 — €26,76.
**7 d. (09-19…25): Ads €240,45 (858 kl.) vs Google užs. 36 / €1 675 / kontribucija €384 − siuntos €75 = +€69, 13 naujų klientų, CPA €6,7.** Panašu į S1717 (+€54).
Per kampaniją (WC): 09-25 — šunų 1 (€16), kačių 1 (€33), brand 2 (€110), gclid be utm 1 (€114); 09-26 — kačių 1, brand 1.

## 2. Shopping 24289581247

Ads UI (09-25 diena): **0 parodymų, €0**, „Tinkama", optimizavimo balas 97,5 %, biudžetas €20/d. Dvi pilnos paros be parodymų prie neautomatinio CPC €0,20 (S1718 patikra: konfigūracija teisinga, 968 tinkamos prekės). Siūlymas pagal eksperimento planą: CPC €0,20 → **€0,35**, patikra 09-27 ryte; jei ir tada 0 — ne kainos problema (Google diagnostika / support). Laukia Raimio „taip" — keitimas per Claude naršyklę (Kampanija → Produktų grupės → „Visa kita" a/b/c).

## 3. Botų sargo para (`petshop-botu-sargas` v1.0, gyvai nuo 09-25 19:00)

- Žurnalas: 09-25 (19:00–24:00 LT) — atc 2 070, filtrai 45 529, IP 44 013; 09-26 (00:00–13:20) — atc 1 900, filtrai 55 107, IP 51 313. Tempas stabilus ~5 400/val. UA: filtrai 100 % „Macintosh 10_15_7 Chrome", atc — „Windows NT 10.0 Chrome". Keliai: `/parduotuve/` 19 201, `maistas-sunims` 6 407, `/gamintojas/*` 6 263.
- Poveikis DB: `ps_carts` 09-24 7 755 → 09-25 4 778 → **09-26 8** (konv. 3); sesijų 14 256 (valymas 06:50 ištrynė 711); YITH AJAX (`admin-ajax`/`yith_wcan_shortcode`) 2 634/d → ~500/d.
- Užsakymai eina (09-25 9, 09-26 3+1 atšauktas), 500 klaidų: 09-24 66 → 09-25 13 → 09-26 (4 val.) 6.
- **RADINYS 1 — užklausų 3× daugiau.** Access log: 09-24 5–9 tūkst./val. (127 406/parą); 09-25 nuo 19:00 — 16–21 tūkst./val. (185 195/parą); 09-26 00–04 — 70 483 (17,6 tūkst./val.): 302 — 22 049, **301 — 12 046** (09-24 visą parą 10 755), 200 — 35 407. Priežastis: botas seka 302 → sargas peradresuoja į kelią **be pasvirojo brūkšnio** (`/kategorija/sunims/maistas-sunims`) → WP `redirect_canonical` 301 prideda „/" → 200. Top 301: `maistas-sunims` 2 294, `/gamintojas/*` 2 189, `/?p=N` 1 086 (shortlink iš prekių puslapių), `sausas-maistas-sunims` 1 033, `maistas-katems` 951, `maistas-sunims/page/N` 785. 301 žingsnis = pilnas WP užkrovimas su kategorijos užklausa (nekešuojamas). Pataisa **sargas v1.1**: 302 iš karto į kanoninį URL (`user_trailingslashit`, be `/page/1/`), papildomai — `wp_shortlink_wp_head` nuėmimas (1 086 `/?p=` 301/4 val.).
- **RADINYS 2 — Super Cache gyvena minutes, ne valandą.** Keše 13:26 — 40 psl., 13:37 — 152, 13:43 — 188, 13:57 — 270, **14:04 — 25** (išvalyta 14:02:34, sutampa su WPAI #3 pradžia; ankstesnis valymas 13:24:35). `petshop-cache.php` v1.1 (S1713) kviečia `wp_cache_clear_cache()` (viską) po `pmxi_after_xml_import` (kas valandą #3 ir #7), taip pat kai vienoje užklausoje pasikeičia > 25 prekės, redaguojant kategoriją/gamintoją, meniu. `wp_cache_clear_on_post_edit=0` ✓, `cache_max_time` 3600, GC shutdown kas 600 s. Siūlymas **petshop-cache v1.2**: po importo nevalyti visko (pakeistas prekes ir jų archyvus valo esami kabliai; kai import'as nieko neatnaujino — nieko), > 25 slenkstį pakelti/keisti į archyvų rebuild, ir valymų žurnalas (opcija, paskutiniai 20 su kvietėju/backtrace), kad rasti 13:24 kaltininką. Bridge (Code Snippets) kešo nevalo — patikrinta.
- Cloudflare klausimas (S1719) lieka Raimio sprendimui.

## 4. WPAI #3 (ZB `stocks.php`) po „Skip records that haven't changed" (įjungta 09-25 20:08)

`pmxi_history` laikas — **UTC** (S1721 pamoka). LT laiku: 10:00 — 7 246 s (2 val.; 11:00/12:00 trigger'iai praleisti), **13:00 — 343 s** (2 681 skipped), 14:00 — vyksta (641/2 681 po 4 min). Buvo 3 700–3 900 s. #7 (VF, kas valandą :15) — 364–378 s. Trigger'iai DirectAdmin cron kas valandą veikia (access log). **#2 (ZB `products.php`) įstrigęs**: `processing=1, triggered=1`, chunk 1 221/2 190, last_activity 06:01 LT — eilėje.

## 5. Sargai, cron, laiškai, klaidos

Ryto sargas 03:30 — 14 patikrų, 13 žalios, 0 raudonų/geltonų (`avpn` nauja); AVPN dublikatų 0, skaitiklis 11144. WP cron 92 įvykiai, 0 vėluoja; AS pending vėluojančių 0; `DISABLE_WP_CRON` dar ne (laukia DirectAdmin cron). Laiškai 48 h: pp2d sent 21, pp7d sent 15 / pending 48, pp14d pending 116 + deferred 14 (soft opt-out vartai), cart/browse skipped consent 6. `ps_lenteliu_valymas` 06:50 — 711 sesijų. `ps_sugrazinimas` 08:30 — 0 kandidatų. php_error nuo 09-25: 616 eil., 8 fatal — `Call to undefined method WP_Error::get_matched_route()` (`rest_send_allow_header`, REST batch, 09-26 08:58 UTC ×3) — stebėti; `woo_lithuaniapost_sync_tracking_data` cron „could_not_set" 431×; `petshop-login-sargas` `ivyko` stulpelio klaida tebėra (S1717); `ps_web_ivykiai` Duplicate entry `vienas` 03:10. ZB matmenys po importo 0. mu-pluginų md5 nepakitę (botu-sargas d338af8b, pristatymo-pazadas f915bc61, prekes-tvarka 02087caf, paieska 4a78dd00, rytas 95e3a6d1).

## 6. Pakuočių šeimų kandidatai (2.17 likutis)

`S1721_pakuociu_seimos_kandidatai_2026-09-26.xlsx` (claude-darbai): 1 682 maisto/kraiko/skanėstų/papildų prekės (publikuotos, be MnM) → **317 šeimų / 697 narių**: tikslių 236 (pavadinimas be svorio sutampa), panašių 16 (skiriasi tik pašaras/maistas/akcija), spėjamų 65 (pažymėtos *, Jaccard ≥ 0,6, linijos žodžiai mažų/veislių/junior/sterilised/… privalo sutapti). DP pakai („N vnt.", „N × …") įtraukti kaip nariai. Rikiavimas: 365 d. istorija (`ps_ist_fakt_eilutes` 2025-09-26…2026-08-30) + WC nuo T-0 ×10. Lapai: Instrukcija · Šeimos (geltoni stulpeliai „Šeimos kodas", „Priskirti?" taip/ne, „Pastaba"; oranžinis „Terminas" — trūksta `pa_pakuotes_dydis`; pilka — DP/neturime) · Suvestinė (formulės) · Be šeimos (60 top prekių be brolių, Raimis įrašo brolio ID/kodą). Kitas žingsnis: R pažymi → bridge skriptas rašo `_ps_dydzio_seima` (+ trūkstamą `pa_pakuotes_dydis` terminą iš „Dydis"), bak opcija, Super Cache paveiktoms prekėms.
Perjungiklio modelis (`petshop-dydziai.php` v1.0): META `_ps_dydzio_seima`, nariai — publish su tuo pačiu kodu, užrašas iš `pa_dydis`/`pa_pakuotes_dydis` termino (be jo narys praleidžiamas), rikiavimas pagal skaičių.

## Laukia Raimio
1. Shopping CPC €0,35 — taip/ne.
2. Sargas v1.1 (kanoninis 302) + petshop-cache v1.2 (be pilno valymo po importo, valymų žurnalas) — „daryk".
3. DirectAdmin cron `* * * * *` `https://petshop.lt/wp-cron.php?doing_wp_cron` → `DISABLE_WP_CRON`.
4. xlsx peržiūra (pakuočių šeimos).

## Pamokos
- `pmxi_history.date` ir `pmxi_imports.last_activity` — UTC.
- Bridge iš GitHub runner'io gali negauti atsakymo (`fx:list`/`fx:create`) — kartoti vieną kartą; VM tiesiogiai petshop.lt nepasiekia (tik GitHub API).
- Access log'ai tik `logs/Sep-2026.tar.gz*` (rotacija 00:11 ir ~04:xx), plain failo nėra; `.tar.gz.N`: 00:11 archyvas = praeitos dienos 04:xx–00:10.
- Ads UI Claude naršyklėje: po `selectaccount` reikia paspausti paskyrą; lentelės tekstas per JS `tr/[role=row]`.
