# S1698 — Sprintas 1 / 1.3 „404 iš organikos" — 2026-09-20 (vėlai vakare)

Tas pats langas kaip S1697 (po 1.1 uždarymo). Įrankiai `irankiai/s1698_ma…mg.php` (repo), deploy `s1698_md5.php`.

## 1. Diagnozė (read-only, `ps_web_ivykiai` 09-10…20 + `ps_seo_404` 09-11…20)

- `error404` įvykių 81 per 10 d. (iš ~11 000); pagal kanalą: be kanalo 60 (botai), **mokamas 38 / 15 ses.** (Google Ads gclid/gad_source ir kaina24/kainos), **organika 30 / 13 ses.**, referral 20 (chatgpt.com 10, kainoteka 2).
- `ps_seo_404`: 1 776 unikalūs keliai, 6 965 hits, iš jų bot 3 789; likę „žmonių" hitai — daugiausia skeneriai (`.env.*`, `graphql`, `phpinfo`, `login/signup`), t. y. bot žymė nepilna.
- **Realūs vartotojų 404** — senos eShoprent platformos adresai, kurių nėra `petshop-legacy-301-map.json` (1 222 įrašai, įšaldyti iš GSC) ir kurių nesugavo `petshop-404-atitikmuo` v1.0 (tik tikslus slug):
  - Google Ads (PMax URL plėtra iš seno Google indekso): `/trixie-kilimelis-purvui-surinkti-120-80-cm`, `/josera-miniwell-10-kg…`, `/automatine-serykla-kateisuniui`, `/real-dog-…-48486-1`, `/exclusion-hypoallergenic-dietinis-…-1-5-kg`, `/kraikas-katems-tofu-belocat-…-2-5-kg…` — **mokami klikai į 404**;
  - kaina24/kainos/kainoteka su senuoju `utm_medium=referral` formatu (jų kataloguose likę seni mūsų URL): `/jaucio-ausis-ruda`, `/josera-marinesse-10kg…`, `/mini-ritineliai-…`;
  - organika: `/placek-pet-products-s-r-o`, `/greenpetfood` (seni brendų puslapiai), `/8-vnt-kraikas-…belocat…`, `/odos-lazdeles-…`, `/content/3-nuostatos-ir-salygos`, `/product/druska-ziurkenams…` (prekė draft), `/product/exclusion-intestinal-…` (draft po S1688, 10 hitų — chatgpt + Ads);
  - `/checkout` 21 (Shopify skeneriai iš US/PE/SE/GB, ne mūsų klientai), `/kita-446007278/daugiau-pigiau/pauksciams-132251148` 15 su referer petshop.lt — šaltinis nerastas (ne meniu, ne postai, ne opcijos); paliktas.
- `/login`, `/prekes-zenklas/<brendas>`, `/sunims/prieziuros-priemones` jau 301-ina (v1.0 / WP) — `ps_seo_404` juos vis tiek fiksuoja (žurnalas prieš redirect'ą), todėl jo skaičiai perdėti.

## 2. Padaryta — `mu-plugins/petshop-404-atitikmuo.php` **v1.1 GYVAI**

md5 dc2c363f (v1.0) → **7bf691b1**; repo `deploy/petshop-404-atitikmuo-v1.1.php` (+ `v1.0.php` atsarga — `ps-backups/petshop-404-atitikmuo.php.bak_s1698` per kelis deploy'us perrašytas tarpine v1.1 versija, tikroji v1.0 tik repo). Veikia po legacy-301, tik `is_404()`, X-Redirect-By `Petshop-404-Atitikmuo`. Naujos taisyklės eilės tvarka:
1. **alias**: checkout/order → `/kasa/`, cart/basket → `/krepselis/` (+ senieji paieska/visos-prekes/allproducts/login); `parduotuve/page/N` → `/parduotuve/`; `content/*salyg|taisykl|nuostat*` → `/taisykles/`, `*privatum*` → `/privatumo-politika/`, `*pristat*` → `/pristatymas/`.
2. tikslus publikuotos prekės slug (kaip v1.0); ID priešdėlis nuimamas tik kai ≥3 skaitmenys (`2809-…`), kad `8-vnt-…` išliktų.
3. kategorija / gamintojas pagal slug (kaip v1.0).
4. **prekė yra, bet ne publish** (draft/private/pending/trash) → jos giliausia kategorija (Exclusion Intestinal → sausas maistas šunims; druska žiurkėnams → skanėstai graužikams).
5. **gamintojas pagal `_legacy_manufacturer`** → brendo puslapis (placek-pet-products-s-r-o → /gamintojas/ontario/, greenpetfood → /gamintojas/green-petfood/).
6. **artimiausias slug** (tik šaknies / `product/` keliams): abu slug'ai normalizuojami (`5kg`→`5-kg`, `120x80`→`120-x-80`), stop-žodžiai išmetami; kandidatai — publikuotos prekės, kurių slug'e yra 2 ilgiausių žodžių 5 raidžių pradžios (LIMIT 300); **vartai**: visos seno slug'o skaičių grupės turi būti kandidate (`2-5-kg` ≈ `25-kg`, `120-80` ≈ `120-x-80`), žodžių atitikimas ≥ 0,75 (tikslus 1, 5 raidžių pradžia 0,85), bauda −0,1 už kandidato skaičių, kurio sename nėra (8-vnt pakuotė vs vienetas), geriausias turi būti vienintelis. Kitaip lieka 404 — jokio nukreipimo į paiešką.
7. **žurnalas** opcijoje `ps_404_atitikmuo_log` (paskutiniai 300: kelias → url, taisyklė, laikas) — audituoti po savaitės, ar „artimiausias" neklysta.

Testas (29 kelių, `s1698_md5.php` fazė 2): **19 → 301** (visi teisingi: tofu BeloCat levandų → tas pats kvapas, 8-vnt → 8-vnt, Quattro SB antiena 1,5 kg → 15kg, Ambrosia 2 kg → 2kg (ne 12 kg), Josera Marinesse 10kg → 10 kg, dygliuotas kamuoliukas 4,5 cm → 45-cm, mini ritinėliai → tas pats, Ontario 12 kg .html → tas pats), 10 lieka 404 pagrįstai (skeneriai `.env`, `api/graphql`; prekių nebėra: trixie kilimėlis purvui (žodžiai per skirtingi — 0,5), automatinė šėrykla, Josera Miniwell, Hau&Miau odos lazdelės, Super Beno konservai, triušio ausys 250 g).

## 3. Matavimas
`error404` su kanalu organika/mokamas per 7 d. (buvo 68/10 d.) → tikslas ≤ 15; `ps_404_atitikmuo_log` peržiūra S17xx: klaidingų „artimiausias" nukreipimų 0. Pamoka bridge: kelis kartus iš eilės deploy'inant tą patį failą, `.bak` perrašomas — bak kopijuoti tik jei dar nėra (`file_exists`), pataisyta `s1698_md4/5`.

## 4. Liko / kitas langas
- 1.3 ☑. Ads „URL plėtra" į senus adresus — dabar sugaudoma 301 su gclid; atskirai PMax nustatymuose galima išjungti URL expansion (Raimio/Ads langas, ne dabar).
- Toliau STARTAS: 1.5 (svetainės paieška 326 per 10 d.), 1.6 botai (`salis` RU/US), 1.7 `/skaiciuokle/`, 1.8 Product schema. Prefiksas `s1699_m*`.
