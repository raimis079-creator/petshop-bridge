# S1703 — 1.7 Skaičiuoklė kaip atskiras puslapis `/skaiciuokle/` — 2026-09-22

**Būsena:** GYVA nuo 2026-09-22 ~09:30. Veiksmų plano (S1696) Sprintas 1, punktas 1.7 — paskutinis C darbas Sprinte 1.

## 1. Kas padaryta

- **Puslapis** https://petshop.lt/skaiciuokle/ (page #36142, publish, `index,follow`). Title „Kiek kainuoja šerti šunį ar katę per dieną? Skaičiuoklė | Petshop.lt", Rank Math description ir focus keyword įrašyti.
- **mu-plugin** `mu-plugins/petshop-skaiciuokle.php` v1.0.0 (klasė `Petshop_Skaiciuokle`, md5 `0553170f013a30f8afc16f0b948c6cde`, repo `deploy/petshop-skaiciuokle-v1.0.0.php`; deploy `irankiai/s1703_me.php` fazės 1 deploy+puslapis / 3 cache sušildymas / 2 testas / 9 išjungti). Išjungimo opcija `ps_skaiciuokle_isjungta=1`.
- Veikimas: rūšis (šuo/katė) + svoris → REST `ps-skaiciuokle/v1/rezultatai?rusis=dog&kg=10` → visoms gyvoms prekėms su aktyvia šėrimo lentele kviečiamas tas pats variklis `Petshop_Feeding_Service::calc()` (kaip prekės puslapyje). Rodoma: antraštė „N kg šuniui: nuo X iki Y € per dieną", **TOP 3 „Perkamiausi"** kortelės, brendų filtras, lentelė (€/d., €/mėn., norma g, pakuotė/kaina/dienos), nuoroda „Žiūrėti kategorijoje su dienos kaina" (esamas `?ps_weight=&ps_species=` filtras), pastaba apie šuniukų/kačiukų maistus (normos pagal amžių) ir už ribų.
- Nuorodos į prekes su `?svoris=N` — prekės puslapyje skaičiuoklė užsipildo automatiškai (S1686 relaunch mechanizmas).
- URL `?rusis=dog&kg=10` — dalinamas/laiškams/veislių puslapiams; puslapis pats paleidžia skaičiavimą.
- **SEO:** FAQPage + WebApplication JSON-LD, statinis tekstas „Kaip skaičiuojame", orientacinė lentelė (šuo 5/10/20/30 kg, katė 4 kg — min/max €/d., €/mėn., maistų sk.) iš naktinio cache, 5 DUK su realiais skaičiais.
- **Matavimas:** įvykis `skaiciuokle` į `ps_web_ivykiai` (raktas=rūšis, raktas2=`puslapis`, reiksme=kg; tipas jau buvo `SAVI` sąraše); slapukas `ps_skaiciuokle=<rūšis>:<kg>` 7 d. → užsakymo meta `_ps_skaiciuokle_puslapis`.
- Cache: transient 6 val. per (rūšis, suapvalintas kg: 0,5 kg iki 10 kg, 1 kg virš); cron `ps_skaiciuokle_naktinis` 05:10 sušildo kanoninius svorius ir išvalo puslapio Super Cache. 307 šunų prekių skaičiavimas ~1,4 s.

## 2. Principai (paveldėti, užrakinti)

- Skaičiuoklė **nevertina tinkamumo** — rodo gamintojo normą ir iš jos išvestą dienos kainą (tekstas tai sako atvirai).
- **MASTER §6.7: nerūšiuojam pagal pigumą.** Sąrašas rikiuojamas pagal perkamumą (apmokėtų užsakymų sk. per 180 d., WC faktai + eShoprent istorija), po to €/d. Jei Raimis norės „nuo pigiausio" rikiavimo — jo sprendimas, kodas pasiruošęs (viena `usort` eilutė).
- Neįtraukiama: skanėstai, kramtalai, žuvys, konservai (dienos kaina nepalyginama; konservai su lentelėmis — 4 vnt.).

## 3. Skaičiai (2026-09-22, cache)

| Svoris | Maistų su norma | € / dieną | Pagal amžių | Už ribų | TOP 3 perkamiausi |
|---|---|---|---|---|---|
| 5 kg šuo | 144 | 0,06–1,77 | 45 | 69 | Exclusion Hypo 7 kg (0,73–0,81), Exclusion Hypo 2 kg, Josera Sensiplus 12,5 kg (0,18–0,27) |
| 10 kg šuo | 179 | 0,22–2,98 | 45 | 35 | Exclusion Hypo 7 kg (1,14–1,30), Exclusion Hypo 2 kg (1,54–1,76), Josera Sensiplus 12,5 kg (0,27–0,46) |
| 20 kg šuo | 133 | 0,35–4,91 | 45 | 81 | Josera Sensiplus 12,5 kg (0,45–0,78), Exclusion Hypo 12 kg (1,46–1,60), Josera Festival 12,5 kg |
| 30 kg šuo | 137 | 0,49–6,63 | 45 | 77 | Josera Sensiplus 12,5 kg (0,61–1,06), Exclusion Hypo 12 kg (2,20–2,40), Josera Festival |
| 4 kg katė | 67 | 0,16–1,27 | 10 | 0 | Josera Indoor 10 kg (0,23–0,31), Exclusion Mediterraneo (0,68), Josera SensiCat 10 kg |

Pastabos: „max" aukštas dėl mažų pakuočių dideliems šunims (2 kg Exclusion 30 kg šuniui = 6,63 €/d.) — matematiškai teisinga, rikiavimas pagal perkamumą jų neiškelia. „kita" 44 šunų / 42 kačių = prekės, kurių lentelė `NO_VERIFIED_TABLE` (lentelė priskirta, bet nepatvirtinta) — atskira lentelių kokybės tema.

## 4. Šalutinis radinys — 26 puslapiai NOINDEX (laukia Raimio)

`rank_math_robots LIKE '%noindex%'` — 26 iš 60 publikuotų puslapių: **visi veislių puslapiai** (taksas, rusų mėlynoji, cvergšnauceris, kaukazo aviganis, mastifas, tibeto mastifas, amerikiečių buldogas, kinų kuoduotasis, havanų bišonai, kolis, biglis, bokseris, čiau čiau, dalmatinas, Džeko Raselo, jorkšyro terjeras, samojedas, senbernaras, siamo katė, rotveileris, amerikiečių pitbulterjeras), „šuo nuolat kasosi", „geriausias sausas šunų maistas", `josera-sunu-maistas`, `josera-kaciu-maistas`, `pristatymas`. Šaltinis — eShoprent Yoast meta (`_yoast_wpseo_meta-robots-noindex=1`) perkelta į Rank Math. Šie puslapiai per 14 d. davė organikos landing'us (taksas 12 ses., rusų mėlynoji 9, kasosi 8, cvergšnauceris 7, kaukazo aviganis 7…) — Google dar rodo iš seno indekso; perindeksavęs išmes. **Siūlymas: nuimti noindex visiems 26** (viena užklausa, `rank_math_robots` → `index`). Sprintas 2 (2.1 veislių šablonas v2) be to neturi prasmės.

## 4b. NOINDEX NUIMTAS (Raimis „daryk" 09:48 ir 10:14)

- `irankiai/s1703_mf.php` fazė 1: 26 puslapiams `rank_math_robots` → `index`, Yoast `_yoast_wpseo_meta-robots-noindex/nofollow` ištrinti; bak opcija `ps_s1703_noindex_bak` (atstatymas — fazė 9). HTML patikra: /taksas/, /rusu-melynoji/, „kasosi", /josera-sunu-maistas/, /pristatymas/ → `follow, index`.
- `irankiai/s1703_mg.php`: Rank Math sitemap cache išvalytas (`RankMath\Sitemap\Cache::invalidate_storage()` + transient'ai) — page-sitemap.xml 29 → 56 įrašai (su /taksas/, /skaiciuokle/). Fazė 2: **visi 8 publikuoti tinklaraščio straipsniai** irgi buvo noindex (post-sitemap.xml buvo 404) → `index`, post-sitemap 200/8. Iš viso 34 turinio vienetai grąžinti į indeksą, noindex liko 0.
- Strateginis Raimio klausimas 09:42 („kosmetinė AI botams ar rimta su daug parametrų?"): Claude atsakymas — nei viena; parametrų nedidinti (anketos duomenys: pildo tik rūšį+svorį), skaičiuoklė = variklis, o ne vieta — skaičių nešti į veislių puslapius/straipsnius/laiškus; puslapis — pigi kabykla SEO/AI; matuoti 30 d., jei <1 % sesijų — daugiau neinvestuoti. Įspėjimas: €/d palyginimas bendrame sąraše perša Josera prieš Exclusion — Exclusion skaičius turi prasmę problemos kontekste, ne šalia Josera.

## 5. Kitas žingsnis

- R: peržiūrėti puslapį, sprendimas dėl rikiavimo (perkamumas vs €/d) ir dėl noindex (§4).
- C (po „daryk"): noindex nuėmimas; nuoroda į `/skaiciuokle/` iš veislių puslapių (2.1), meniu „Sprendimai", relaunch laiško (3.4) ir 404 puslapio; po savaitės — `ps_web_ivykiai` `skaiciuokle` įvykių ir `_ps_skaiciuokle_puslapis` užsakymų pjūvis.
- Sprintas 1 C darbai visi ☑ (1.1, 1.2, 1.3, 1.5, 1.6, 1.7, 1.8).

Įrankiai: recon `irankiai/s1703_ma–md.php` (read-only), deploy `s1703_me.php`. Prefiksas kitam langui `s1704_m*`.
