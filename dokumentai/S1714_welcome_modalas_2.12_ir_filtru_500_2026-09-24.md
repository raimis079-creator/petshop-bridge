# S1714 — Welcome modalas (2.12) + YITH filtrų 500 (2026-09-24 vėlai vakare)

Bridge iš VM `ps-bridge/s1714/a–g.php`; naršyklės testai per Claude built-in browser (JS, be screenshot'ų).

## 1. Ar „332 pradėtų / 306 numestų anketų" buvo tikra problema? — NE (mastas perdėtas)

`petshop-anketa-ivykiai.php` v1.2 JS stebėtojas (`ps_laukai_ivykiai`, sritis `laukai`):
- `anketa_started` siunčiamas **vos puslapiui įsikėlus**, kai DOM'e yra `.pspet-wrap` — be jokio lankytojo veiksmo (verte `v1`, 338 įrašų = 338 puslapio atidarymų).
- `anketa_abandoned` siunčiamas per `pagehide` / `visibilitychange` (perjungus skirtuką, sumažinus naršyklę) su laukų būsena. **282 iš 311** turi `s1|+|-kas_jūsų_augintinis,augintinio_vardas` = 1 žingsnis, **nė vienas laukas nepaliestas**. Dažnai 1–9 s po `started`.
- `sesija` visada tuščia (`ps_stat_s` slapuko nėra) → įvykių sujungti į sesijas negalima (analitikos kokybės pastaba, ne dabar).

Realus signalas: `ps_pets` po T-0 — 11; `step_completed` 38; `anketa_completed` 22 (dalis — draft'ai). Išvada: skaičius matuoja puslapio atidarymus, ne anketos pildymą. Modalo dubliavimas (žr. 2) buvo tikra klaida, bet jos poveikis iš šių skaičių nematuojamas.

## 2. Welcome modalas v1.3 → v1.4.2 GYVAI

Failas `plugins/petshop-core/includes/class-welcome-modal.php` (md5 b7bcf6af… → fe9d19eb…), bak `uploads/ps-backups/class-welcome-modal.php.bak_s1714` (v1.3), repo `deploy/class-welcome-modal-v1.4.2.php` + `v1.3.php`, deploy `s1714/c4.php` (1 deploy / 2 patikra / 9 atstatyti), po deploy `wp_cache_clear_cache()`.

| # | Pakeitimas |
|---|---|
| 1 | CTA `.psw-b1` („Pridėti augintinį") paspaudimas nustato `psw_seen` (90 d.) — anksčiau slapukas dėdavosi tik uždarant X/ESC, todėl anketos puslapyje modalas atsidarydavo antrą kartą |
| 2 | Serveris nerodo `/augintinio-profilis/`, `/skaiciuokle/` (`is_page`); JS papildomai — `/kasa/`, `/krepselis/` (kešuotam HTML) |
| 3 | Svečiui rodoma tik kai Complianz juosta uždaryta: kai puslapyje yra `cmplz-cookiebanner-js`, laukiama `cmplz_banner-status` slapuko (kas 1 s, iki 5 min), tada 12 s delsa + exit intent. DOM būsena netikrinama — juosta įterpiama JS vėliau ir iš pradžių paslėpta (dvi lenktynės rastos testuojant v1.4/v1.4.1) |
| 4 | `psw_seen` tikrinamas ir JS pusėje (`ov.remove()`) — nuo S1713 svečio puslapiai kešuojami, serverio `$_COOKIE` patikra svečiui nebegalioja |

Naršyklės testas (švarūs slapukai, titulinis): po 15 s su atvira juosta — modalas paslėptas ✓; paspaudus „Sutinku" — po 12 s rodomas ✓; CTA → `psw_seen=1`, `/augintinio-profilis/` be modalo ✓; kitame puslapyje modalo nėra ✓. HTML: `/` ir kategorijos su modalu, anketa/skaičiuoklė — be.

Neliesta: anketos 1 žingsnio „vardas" nebūtinas — laukia Raimio patvirtinimo (core `class-pet-profile.php`/`pet-form.js`).

## 3. Šalutinis radinys — 500 kategorijų puslapiuose (UŽDARYTA)

`php_error.log`: `TypeError: strstr(): WP_Error given` `functions.php:1154` ← `WC_Widget::get_current_page_url()` ← `WC_Widget_Layered_Nav_Filters` ← Flatsome filtro mygtukas. 09-20 ×7, 09-21 ×7, 09-23 ×26, 09-24 ×43 (nuo 01:38 — ne dėl šios dienos darbų). Access logai (09-23/24): 62 × 500, iš jų `/kategorija/katems/` 22, `/parduotuve/` 4, `/kategorija/sunims/maistas-sunims…` 7; 09-24 00:10–00:52 vienas Mac lankytojas 40 min bandė kačių kraikų filtrus ir gaudavo vien 500.

Priežastis: YITH filtre pažymėjus **kelias kategorijas** URL gauna `product_cat=a,b` (`query_type_product_cat=or`); WP užklausa tai supranta, bet WC widget'as kviečia `get_term_link('a,b')` → WP_Error, o pridėjus dar atributo filtrą (`filter_tipas=…`) `add_query_arg()` meta TypeError. Atkartota: multi-cat be atributo → 200, su `filter_tipas=atviras` → 500.

Pataisa: naujas mu-plugin `petshop-filtru-sargas.php` v1.0 (md5 458892bf…, repo `deploy/petshop-filtru-sargas-v1.0.php`, deploy `s1714/g2.php` 0 prieš-testas / 1 deploy / 2 po-testas / 9 išjungti → `.off_s1714`; opcija `ps_filtru_sargas_isjungta`): `wp` prio 1 (rezultatai jau surinkti) — jei `product_cat` turi `,`/`+`, query var pakeičiamas į užklaustos kategorijos slug'ą; prekių sąrašas nekinta, tik nuorodų generavimas. Po: 500 → 200 (10 prekių su filtru). WC/YITH/Flatsome kodas neliestas.

## Pamokos
- Skaičius iš įvykių lentelės vertinti tik perskaičius, kas tą įvykį siunčia (S1712 to nepadariau).
- Complianz juostos būsenos iš DOM netikrinti — tik slapukas.
- Built-in browser pane paslėptas → `requestAnimationFrame` nevykdomas (`.on` klasė neatsiranda) — spręsti pagal `hidden` atributą.
- YITH/WC: kelių kategorijų filtras + atributas = 500; pasitikrinti po WC atnaujinimų (jei WC pataisys `get_current_page_url`, sargą galima išjungti).
