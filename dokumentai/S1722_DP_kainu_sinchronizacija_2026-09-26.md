# S1722 — DP pakų kainų sinchronizacija + feed'ai (2026-09-26, 20:00–21:00)

Langas po STARTAS_2026-09-26_po_S1721; prefiksas `s1722_*`. VM bridge (`ps-bridge/s1722/`), lint debesyje.

## Kas buvo (recon `a.php`, `b.php`, `c.php` read-only)
- 25 DP pakai (`_dp_base_product_id` + `_dp_pack_qty`, manage_stock=no): kaina įrašoma **kūrimo metu** (572 forma, siūlė ×0,95, R taisė ranka) ir **niekas jos neperskaičiuoja**. Bazinių kainas keičia 6 mechanizmai (VF importas, ZB `petshop-xml`, WPAI #2 `{rrp}`, katalogo įrankis, `petshop-akcijos`, `petshop-promotions`) — visi per `update_post_meta`/`save()`. Bazinės keitėsi 09-22…24, pakai liko rugpjūčio kainomis.
- Nuolaidos faktiškai: skanėstai 10,1–13,4 %, TOFU kraikas 10 %, Exclusion 2,6/3,2 %, Ontario 3,6 %. Bazinių su akcijos kaina 0/25; `_manual_price_override` pakuose 0, bazinėse 5.
- **Feed'ai**: `ps_feeds_ids()` (petshop-feeds v2.6.0) pakų neišskyrė — visi 25 ėjo į kaina24, kainos.lt ir Google (google.xml 2195 items), GTIN neturi.
- Ryto sargas v1.5 — 15 lempučių, DP kainų patikros nebuvo.

## Raimio sprendimai (20:30–20:41)
1. Apvalinimas — iki artimiausio „…9" centų (42,583 → 42,59; 110,56 → 110,59; 14,996 → 14,99).
2. Nuolaidų lentelė pagal kategoriją: **sausas 3 % (Josera 2,5 %), konservai 3,5 %, natūralūs skanėstai 10 %, kraikas 10 %** — taikoma ir esamiems 25.
3. Feed'ai — pakų nė viename (3a).
4. Taisyklė: **yra `_dp_nuolaida_proc` → kainą valdo formulė; nėra → kaina rankinė** (sinchronizacija neliečia). Rankinei kainai pirma ištrinti %.

## GYVAI (20:50–20:58)
| Kas | Versija / md5 | Bak / atstatymas |
|---|---|---|
| NAUJAS `mu-plugins/petshop-dp-kainos.php` | **v1.1** md5 `f2ca4c6d…` (v1.0.1 31b4b238…) | `s1722/d2.php 9` pašalina; išjungti `ps_dp_kainos_isjungta=1` |
| `_dp_nuolaida_proc` 25 pakams + sinchronizacija | skanėstai/TOFU 10, Exclusion 3, Ontario 3,5 | opcija `ps_s1722_dp_bak` (senos kainos+proc), `9` atstato |
| `plugins/petshop-feeds/petshop-feeds.php` | **v2.7.0** md5 `957da141…` (buvo 26a2f74d…) | `ps-archyvas/petshop-feeds.php.bak_s1722` |
| `mu-plugins/petshop-rytas.php` | **v1.6** md5 `bb897e97…` (buvo b5d2005d… v1.5) | `ps-archyvas/petshop-rytas.php.bak_s1722` |
| Snippet 572 „Daugiau=Pigiau Šablono Kūrimo Forma" | **v10** md5 `31029006…` (buvo v9 246125cc…) | opcija `ps_s1722_snip572_bak` (gz+b64) |

### `petshop-dp-kainos` v1.0.1 (klasė `Petshop_DP_Kainos`)
- Kaina = kiekis × bazinės **reguliari** × (1 − %/100), `apvalinti()` = `round(x×10)/10 − 0,01`. Bazinė akcijoje (`is_on_sale('edit')`) → pako `_sale_price` ta pačia formule nuo akcijos kainos; be akcijos — sale išvalomas.
- Trigeriai: `added/updated/deleted_post_meta` `_regular_price`/`_sale_price`/`_price`/`_sale_price_dates_*` bazinei, turinčiai pakų (žemėlapis bazinė→pakai transient `ps_dp_zemelapis` 6 val., valomas keičiant `_dp_base_product_id`/`_dp_pack_qty`); `_dp_nuolaida_proc`/`_dp_pack_qty` pokytis pakui. Vykdoma `shutdown` prio 5 (vienas sync per užklausą, kad importas su keliais meta įrašais nesaugotų kelis kartus). Įrašo per WC objektą (`set_regular_price/set_sale_price/save` → `_price`, lookup lentelė), `wc_delete_product_transients`, `wp_cache_post_change` (Super Cache pako puslapis).
- Cron `ps_dp_kainos_naktinis` 05:10 — visi pakai, suvestinė `ps_dp_kainos_pask`. Žurnalas `ps_dp_kainos_zurnalas` (60: laikas, pid, buvo, tapo, proc, bazė, kas = pokytis/naktinis/forma).
- Praleidžia (klaida į suvestinę): bazinė nerasta / ne publish / be kainos. Be % → `be_proc`, neliečia.
- Lentelė `nuolaidos()` — opcija `ps_dp_nuolaidos` (JSON ar masyvas) perrašo numatytą `{kraikas:10, skanestai:10, konservai:3.5, sausas:3, brendai:{josera:2.5}}`; `grupe($base_id)` pagal kategorijų slug'us su protėviais (kraik → skanest → konserv → sausas|hipoalerginis|super-premium); `numatytoji_proc($base_id)`; `kaina($bazine,$qty,$proc)` — naudoja 572 forma ir naudos generatorius.
- `suvestine()` Ryto sargui: gyva dry patikra visų pakų — `[lygis, tekstas]`: raudona klaidos, geltona neatitinka formulės, žalia; + naktinio data ir pakeistų sk.

### Snippet 572 v10
- Naujas laukas „Nuolaida (%)" po kaina: numatytas iš `numatytoji_proc()` (paieškos rezultatuose `proc`), su % kaina skaičiuojama JS (ta pati formulė), laukas tik skaitomas; serveris kainą perskaičiuoja pats (`Petshop_DP_Kainos::kaina` nuo bazinės reguliarios), įrašo `_dp_nuolaida_proc`, po sukūrimo `sinchronizuoti($pid,false,'forma')`. Tuščias % — v9 elgesys (×0,95 pasiūlymas, kaina ranka, nesinchronizuojama).

### petshop-feeds v2.7.0
- `ps_feeds_ids()` + `NOT EXISTS _dp_base_product_id` — visi 3 kanalai. Kandidatų 2192 → 2167 (pakų 0). Feed failai persigeneruos naktį 04:30 (`ps_feeds_naktinis`) — patikra rytoj: `ps_feeds_paskutinis.statistika.kandidatu` = 2167, google.xml be `<g:id>3585x</g:id>`.

### Rezultatas 25 pakams (buvo → tapo)
Skanėstai: knyslės 12,99 → **13,49** (×2), rudos ausys 23 → **23,19**, baltos ausys 25 → **24,99**. TOFU: 32,04 → **31,99** (14 pakų), 33,84 → **33,79**, 35,28 → **35,29** (3). Exclusion: 42,50 → **42,59**, 111 → **110,59**. Ontario: 14,98 → **14,99** (2).

### Testai
- Bazinė 18590 21,95 → 22,45 (`update_post_meta`) → pakas 36002 tą pačią užklausą (shutdown) 42,59 → **43,59**, lookup min/max 43,59; atgal 21,95 → 42,59. Žurnale abu įrašai `kas=pokytis`.
- Ryto sargas `patikros()` 16 lempučių, `dp_kainos` žalia „su % 25, rankinių 0, neatitinka 0, klaidų 0; naktinis 09-26 20:52 pakeitė 25".
- Admin 572 formos puslapis 200; heartbeat 200 po kiekvieno rašymo; php_error.log netikrintas atskirai (fatal nebuvo — heartbeat).
- Super Cache 25 pakų puslapiai išvalyti (`2b`); kategorijų puslapiai su senomis pakų kainomis — iki kešo galiojimo / kito importo valymo.

### v1.1 (21:20) — admin langas „DP pakų kainos“
R 21:13: „kainas matau, bet nematau per Admin → Rinkiniai, kaip reguliuoti“ (Rinkiniai = MnM). Pridėta **Produktai → DP pakų kainos** (`edit.php?post_type=product&page=ps-dp-kainos`, `manage_woocommerce`): kategorijų nuolaidų lentelė (sausas / Josera / konservai / skanėstai / kraikas → opcija `ps_dp_nuolaidos`, AJAX `ps_dp_lentele`; keičia tik numatytą % naujiems pakams) ir pakų lentelės pagal grupę: pakas, bazinė, kiekis, bazinė kaina (+akc.), kiekis × bazinė, **% įrašomas vietoje** (AJAX `ps_dp_proc` → meta + `sinchronizuoti` iš karto → nauja kaina, sutaupymas, būsena formulė/rankinė), naktinė patikra, 15 paskutinių žurnalo įrašų. Render testas (`d3.php 2c`): 25 eilutės, 4 grupės, 5 lentelės laukai. Repo `deploy/petshop-dp-kainos-v1.1.php`.

## Liko / kitam langui
- **Generatorius** 2× 2–10 kg sausam maistui (3 %, Josera 2,5 %): dabar gali naudoti `Petshop_DP_Kainos::numatytoji_proc`/`kaina`, rašyti `_dp_nuolaida_proc` — kaina seks pati. Prieš tai — faktai apie 2+ vnt. užsakymus (per pavadinimą, `svoris_g` tuščias).
- Rytoj: feed'ų statistika (2167), `ps_dp_kainos_pask` po 05:10, Ryto sargo `dp_kainos`.
- R patikra gyvai: 572 forma su % lauku (Produktai → Daugiau=Pigiau), pakų kainos kataloge.
- Kategorijų kešas su senomis pakų kainomis (nekritiška).

## Įrankiai
`ps-bridge/s1722/`: a (recon: kas rašo kainas, sale, feed failai, 572/567/573), b (feed atranka, GTIN, rytas struktūra, nuolaidų % lentelė), c (572 kodas b64 → `snippet-572-v9.php`), d/d2 (deploy: 1 lint+dry / 2 pluginas / 2b kešas / 3 % + sync / 4 feeds+rytas / 4b patikra / 5 snippet / 6 testas 22,45 / 7 patikra / 8 atgal / **9 atstatyti viską**), `petshop-dp-kainos-v1.0.1.php`, `snippet-572-v10.php`. Cloud `/home/claude/s1722/`.
