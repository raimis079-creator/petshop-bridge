# S1724 · Rytinė ataskaita 09-27 + botų būklė po `.htaccess` užtvaros

Data: 2026-09-27 11:03. Šaltiniai: WC faktai (`ps_fakt_*`), access log `logs/Sep-2026.tar.gz` (00:10–06:01; vėlesnio plain failo `logs/` kataloge nėra), `php_error.log`, botų sargo žurnalas, Ryto sargas, `ps_cache_valymai`. Gyvai NIEKO nekeista. Įrankis: VM `ps-bridge/s1724/a.php` (read-only, fazės 1/2/3), rezultatas `analize/s1724_a.json`.

## 0. Botų būklė — užtvara veikia, banga slūgsta

| Val. (09-27) | Užkl. | 403 | 200 | 500 | filtrų URL | unik. IP |
|---|---|---|---|---|---|---|
| 00 | 10 437 | 9 117 | 1 212 | 3 | 8 799 | 9 154 |
| 01 | 6 327 | 5 101 | 1 144 | 0 | 4 769 | 5 258 |
| 02 | 5 245 | 3 479 | 1 492 | 1 | 3 122 | 3 693 |
| 03 | 2 284 | 998 | 1 204 | 0 | 740 | 1 261 |
| 04 | 2 357 | 835 | 1 334 | 0 | 574 | 1 106 |
| 05 | 3 208 | 886 | 2 116 | 1 | 595 | 1 238 |

- 403 krito nuo ~150/min (00 val.) iki ~15/min (05 val.) — botnetas, gaudamas 403 be turinio, traukiasi.
- **500 — 8 per 6 val.**, nė vienas iš filtrų (2 `admin-ajax` AS runner, 3 `wp-cron`, 1 WPAI #3, 1 kategorija). Prieš užtvarą buvo 120–320/min.
- Botai **nepersijungė**: `?s=` 1, `orderby` 0, `/page/N/` 74 (normalus lygis), prekių puslapiai iš boto UA — pavieniai. Boto UA („Macintosh 10_15_7 Chrome") per 6 val. — 18 376 unikalūs IP, praėję tik statiniai failai (`wp-content`, `wc-ajax=get_refreshed_fragments` 26).
- `.htaccess` blokas vietoje (3 086 B, mtime 00:03, bak `.htaccess.bak_s1723` yra).
- Poveikis DB: `woocommerce_sessions` 14 256 → **5 038**; `ps_carts` 09-24 7 755 → 09-25 4 778 → **09-26 19** (konv. 6) → 09-27 2. Botų sargo (PHP) žurnalas 09-26: filtrai 143 851, IP 125 080 — tai iki 00:03; nuo tada Apache 403 į sargo žurnalą nebepatenka (jo skaičiai nuo šiol rodys tik praėjusius pro užtvarą).
- Heartbeat nekešuotu URL 200. Užsakymai eina (#1195 00:08, #1196 10:30).
- Spraga: 06:02–11:00 access log nepasiekiamas per bridge (gyvas failas ne `logs/`) — matyti tik per DirectAdmin `CMD_SHOW_LOG`; nekritiška, nes 500 = 0 ir heartbeat 200.

## 1. Ads → WC (faktai)

| Diena | Užs. | € | Kontrib. | Siuntos | Nauji | Google užs. | Google € | Google kontrib. | Google nauji | kaina24 |
|---|---|---|---|---|---|---|---|---|---|---|
| 09-24 | 8 | 383 | 95 | 28 | 3 | 4 | 187 | 48 | 1 | 2 |
| 09-25 | 9 | 537 | 78 | 3* | 5 | 5 | 272 | 40 | 2 | 3 |
| 09-26 | 7 | 232 | 53 | 2* | 1 | 5 | 146 | 26 | 1 | 0 |
| 09-27 (iki 11:00) | 1 | 68 | 11 | — | 0 | 1 | 68 | 11 | 0 | 0 |

\* siuntos dar neregistruotos.
Ads 09-26: šunų PMax €5,55 (28 kl.), kačių PMax €17,39 (70 kl.), brand €4,60 (24 kl.) = **€27,54**, Ads konversijų 0 (WC — 5 Google užsakymai). **Shopping 24289581247 — eilutės vėl nėra (0 parodymų) ir 09-26.**
**7 d. (09-20…26): Ads €240,46 (873 kl.) vs Google užs. 35 / €1 649 / kontribucija €364,5 − siuntos €66 = +€58, 11 naujų, CPA €6,9.** Trečia savaitė iš eilės ~+€55–70.
09-26 kanalai: Google 5 (kačių ×2, brand ×2, šunų ×1), direct 1, kaina24 0; 09-27 00:08 referral #1195 (€34,53, 19 prekių).
Atviri: 19 processing/on-hold (#1173…#1196), 1 bacs on-hold #1180 (09-25). #1188 bacs atšauktas → tas pats klientas iš karto #1189 Paysera (normalu).

## 2. Sargai, cron, laiškai, klaidos

- **Ryto sargas 03:30: 1 RAUDONA — `dropship_sla`: tiekėjas vėluoja > 24 val., 3 užsakymai** (Raimiui: kurie — darbalaukyje); 14 žalios, 0 geltonų (16 lempučių, `dp_kainos` žalia).
- WP cron 93 įvykiai, 0 vėluoja; AS pending vėluojančių 0; `DISABLE_WP_CRON` dar ne.
- **DP kainos naktinė 05:10 ✓** — 25/25 pakų su %, pakeistų 0, klaidų 0. Feed'ų ID 2 166 (pakai išimti). Sargo lemputė žalia.
- WPAI: #3 (ZB stocks) kas valandą 61–272 s, viskas skipped (be pokyčių); #7 (VF) 260 s skipped 2 398; #5 (VF naktinis 03:30) 24 atnaujinti; **#2 (ZB products) triggered=1, last_activity 03:02 — vėl eilėje** (kaip 09-26).
- `ps_lenteliu_valymas` 06:50 — 4 791 sesijos; `ps_sugrazinimas` 08:30 — 0 kandidatų.
- **Refill: šiandien 08:00 sukurti pirmi 3 realūs `refill_due` laiškai (pending)** — pirmas gyvas testas „Ar ne laikas papildyti atsargas?"; `ps_refill_tracking` active 186 (artimiausi 10-06 ×3, 10-07 ×4, 10-09 ×2), notified 4. pp2d sent 15, pp7d sent 5 / pending 55, pp14d pending 123 + deferred 7 (soft opt-out vartai), cart/browse skipped consent 3.
- php_error.log nuo 09-26: 46 eil., **0 fatal**; `woo_lithuaniapost_sync_tracking_data could_not_set` ×15 (senas), REST `class-wp-rest-server` warnings ×12 02:27, `ps_web_ivykiai` Duplicate `vienas` ×12 03:10 (senas), keista: „Table `gyvunaiN_nbpeN.wp_options` doesn't exist" ×2 02:27 — kažkas 02:27 kreipiasi į kitą DB (backup? stebėti).
- mu-plugins md5 nepakitę nuo vakar (botu-sargas 110299ba, dp-kainos 8fe9b0c6, dydziai-katalogas dc4970e7, rytas bb897e97, cache a0a8b817). AVPN dublikatų 0.
- `ps_sargas_klaidos` — vien Super Cache `rmdir` warnings (kešo katalogai jau ištrinti) per WPAI/wp-cron — triukšmas, ne klaida.

## 3. RADINYS — Super Cache valomas VISAS kas valandą :01

`ps_cache_valymai` žurnalas (petshop-cache v1.2): kas valandą **:01** iš `wp-cron` — `viskas_25`, „1239 prekės: 17947, 17950, 17953, 17956…" (ID žingsniu 3 = masinis meta atnaujinimas visoms prekėms). Rezultatas: 11:00 keše **37 puslapiai**, seniausias 11:00 — kešas gyvena < 1 val. Importų valymai (`importas_be_pokyciu`) dabar nevalo ✓. Kaltininkas — koks nors valandinis cron, kuris perrašo meta 1 239 prekėms (kandidatai: likučių/šaltinių sync, kainodara, `ps_sources_sync`). **Tai reikia išspręsti PRIEŠ Super Cache „Expert" (2 p.)** — Expert be gyvo kešo nieko neduoda. Siūlymas: rasti kablį (backtrace žurnale per trumpas — `load.php:1308 do_action`; reikia cron hook'o vardo), o `petshop-cache` >25 slenkstį pakeisti į „valyti tik pakeistų prekių puslapius + jų kategorijas" (be pilno valymo).

## Laukia Raimio
1. Dropship SLA raudona — 3 užsakymai (darbalaukis).
2. Shopping: ar CPC €0,35 buvo pakeistas 09-26? Jei taip — trečia para 0 parodymų → ne kainos problema (Google diagnostika / support).
3. **Cloudflare Free — kai Raimis prie Chrome** (1 p. pagal STARTAS).
4. Valandinio kešo valymo kaltininkas — leidimas patyrinėti (read-only) prieš Super Cache Expert.

## Pamokos
- Access log per bridge pasiekiamas tik iš `logs/Sep-2026.tar.gz*` (gzopen + 512 B tar antraštė praleidžiama, `gzgets`); paskutinis archyvas ~06:02 → rytinė patikra mato tik naktį. Gyvą dieną žiūrėti per DirectAdmin `CMD_SHOW_LOG?domain=petshop.lt&type=log&lines=N`.
- `/proc/loadavg` — open_basedir, neprieinamas.
- VM `device_bash` heredoc'ai > ~8 KB → `E2BIG`; didelius failus rašyti debesyje ir `device_commit_files`.
