# deployment_log.md — v1.4.6

> **Padalinta 2026-08-12.** Senesnes sesijas (iki 2026-07-31 imtinai) rasi
> faile `deployment_log_ARCHYVAS_iki_2026-07-31.md`. Cia — tik 2026-08 ir
> velesni irasai, kad faila butu galima atnaujinti nerizikuojant prarasti
> istorijos.

## IRASAI (naujausi virsuje)

---

## 2026-08-16 — ATASKAITU STANDARTAS v2: NUO SPEC IKI VEIKIANCIU LANGU [S813-S842]

Diena, per kuria „Surenkamu rinkiniu" ataskaita is prezentacijos virto darbo
irankiu, o vitrina pradejo matuoti save pati. Sukurti PENKI nauji moduliai,
spec pakeltas i v1.2.

**Dienos taisykle:**

> Skaitikliai meluoja mandagiai. Kiekviena is siandien rastu klaidu atrode
> kaip veikiantis kodas: deploy log'as sake OK, JS klaidu nebuvo, skaiciai
> rodesi. Melagyste matesi TIK tada, kai ekrana pamatei akimis arba
> perskaiciavai suma ranka.

---

### S813-S816 — RECON PRIES KODA

Trys realybes patikslinimai, kurie pakeite spec:

1. **Dydis gyvena produkto meta** `_ps_laukas_dydis` su reiksmemis „400 g",
   „800 g", „100 g" — ne krepselio pasirinkime. Normalizuojam i „400"/„800".
2. **Skirtukas NERA filtras dezes viduje.** Kiekvienas skirtukas — atskiras
   dezes produktas-brolis (34942 „800 Be vistienos", 34945 „400 Monoproteinas").
   Todel dydi ir skirtuka pildo SERVERIS is dezes produkto, ne narsykle.
3. **HPOS ijungtas**, WC 11.0.1, PHP 8.3.20. Paruostu MnM rinkiniu ir DP paku
   dev'e — 0 (norma).

---

### S817-S824 — E1, E3, E4, E5, E6 (schema, agregavimas, karkasas, du langai)

| Modulis | Versija | Ka daro |
|---|---|---|
| `petshop-statistika.php` | 2.0 | schema v2 (+dydis, skirtukas, kiek_dezeje, irenginys), `ps_ataskaitu_dienos`, du sluoksniai, nauji uzsakymo meta |
| `petshop-ataskaitu-agregavimas.php` | 1.0 | cron 03:15, idempotentinis dienos agregavimas, siandienos sluoksnis |
| `petshop-ataskaitos-ui.php` | 1.0 | bendras karkasas: laikotarpis+palyginimas, KPI su delta, SVG diagrama, lentele su rikiavimu/CSV |
| `petshop-rinkiniu-ataskaita.php` | 2.0 | 11 sekciju: KPI, tendencija, ka daryti, dydziai, prekes, drill-down, piltuvelis, kelias dezeje, dovana, irenginiai |
| `petshop-paruostu-ataskaita.php` | 1.0 | naujas langas „Rinkiniai": kanibalizacija, DP pakopos, nuolaidos efektyvumas |

**Kontrolinis skaiciavimas** (uzsakymas #34952): vaiku sumos 1961+288+297+277+
288+280+285+277+285+297+277 = **4812 ct** — tiksliai konteinerio suma. Pelnas
4515 → be PVM 3731 → minus savikaina 3216 → minus dovana 66 = **449 ct**.
Ekranas rode 4,49 €.

---

### S825-S829 — KA PARODE PIRMOJI EKRANO NUOTRAUKA

Penkios klaidos, kuriu skaiciai neparode:

1. **Raw HTML ekrane.** „Kelias dezeje" antrastese matesi
   `<i class="psru-tt" data-t=...>` — `esc_html()` naikino tooltip'a. → `wp_kses_post()`.
2. **Melagingas procentas.** „yra 9 % deziu" reiske „1 is 11 EILUCIU", ne is
   deziu. Vardiklis buvo ne tas. → atskiras `$vardiklis` parametras.
3. **Graza 72,9x.** Nebuvo nei vienos dezes BE dovanos, tad cekio prieaugis
   lygus visam cekiui. → be palyginimo grupes rodom „—".
4. **Pelnas nesutapo:** lenteleje 5,15 €, KPI 4,49 € — trukо dovanos savikainos.
5. „Silpna vieta" piltuvelyje zymeta net kai visi skaiciai nuliai.

---

### S830-S834 — E2: VITRINA PRADEJO MATUOTI

**Sprendimas: atskiras modulis, laukai NEKEICIAMI.** `petshop-laukai.php` yra
183 KB veikiancio kodo ir jokio JS ivykiu API neturi. Vietoj perrasymo —
`petshop-statistika-vitrina.php` v1.0 kabinasi ant vitrinos DOM per delegated
listener'ius. Jei vitrina kada persidarys, suges tik matavimas, ne pardavimas.

DOM sutartis surasyta modulio antrasteje (patikrinta narsykleje):
`.pslk-deti[data-cid]`, `.pslk-stp button[data-d]`, `.pslk-el[data-cid]`,
`.pslk-dovk[data-gid]`, `#pslk-dov.atrakinta`, `#pslk-cta[disabled]`,
`#pslk-kiek`, `.pslk-dbtn`, `.pslk-kort`.

**Dvi klaidos, kurias sugavo tik realus testas:**

- **`preke_id` buvo 907, 908...** — tai MnM `child_item_id`, ne produkto ID
  (`mnm_quantity[19570]` sedi elemente `pslk-in-907`). Elgsena ir pardavimai
  butu gyvene skirtingais raktais ir „idejimo dalis" NIEKADA nebutu
  susiskaiciavusi. → PHP paduoda cid→product_id zemelapi.
- **Piltuvelis rode „atidare 2 → prisidejo 8"** — neimanoma. Unikalios sesijos
  buvo sumuojamos per prekiu eilutes. → atskira sritis `piltuvelis`
  (GROUP BY be `preke_id`). Po pataisymo: atidare 2 → prisidejo 1 = 50 %.

Isvalyta 13 sugadintu testiniu irasu su blogais ID.

---

### S835-S838 — PILNAS KELIAS IR DAR DVI KLAIDOS

Playwright suvaidino visa kelia: 11 vnt. → 37,89 € → minimumas (6) → 14 vnt. →
48,06 € → dovanos riba 45 € → dovana pasirinkta → krepselis → dydzio
perjungimas 800→400.

- **`dovana_rinko` preke buvo 0** — dovanos ID nera MnM vaikine eilute, tad cid
  zemelapis ji pavertė nuliu. → atskira `ivykisPid()` funkcija be vertimo.
- **`dovana_atrakinta` verte tuscia** — riba buvo skaitoma is antrastes teksto,
  o atrakinus ten irasoma „rinkis viena" (jokio skaiciaus). → riba imama is PHP
  konfiguracijos (`_ps_laukas_dovanos_riba`).

Galutinis rezultatas — visi devyni tipai veikia: `atidare`, `rodyta`, `idejo`,
`iseme`, `min_pasiekta`, `dovana_atrakinta`, `dovana_rinko`, `dydis_perjunge`,
`krepselis`. `dydis_perjunge` verte „800>400", `dovana_atrakinta` — „45",
`dovana_rinko` — 17386.

---

### S839-S842 — EXCEL EKSPORTAS

Raimio pastaba: „kaip kitaip nagrineti". Teisinga — lenteles CSV eksportas ima
tai, ka mato ekranas („48,12 €", „13,2 %", tarpai tukstanciuose), o Excel'yje
tai TEKSTAS: nei susumuosi, nei pivot'o padarysi.

**`petshop-ataskaitu-eksportas.php` v1.0** — savas minimalus XLSX rasytojas per
`ZipArchive` (patikrinta: yra ir veikia). PhpSpreadsheet serveryje irgi yra, bet
atkeliaves su importo pluginu — jei tas bus atnaujintas ar isjungtas, eksportas
nutruktu be ispejimo. Todel jokiu isoriniu priklausomybiu.

Lapai „Surenkamiems": Suvestine · Prekes · Rinkiniai · Piltuvelis · **Zali
duomenys**. Paskutinis yra svarbiausias: visa dienos suvestine be apdorojimo,
is jos galima susisukti bet koki pjuvi pivot'u neprasant naujos ataskaitos.
„Rinkiniams": Rinkiniai · DP pakopos · Zali duomenys.

Skaiciai rasomi kaip SKAICIAI, formatavimas paliekamas Excel'iui (€ formatas
`#,##0.00 €`, procentai `0.0%` dalimis, kad veiktu vidurkiai).

**Klaida, kuria sugavo failo patikra openpyxl'iu:** „Idejimo dalis" rode
**225 %** (idejo 9, rodyta 4). `rodyta` fiksuojama viena karta per kortele, o
`idejo` — kas paspaudima, iskaitant kiekio didinima. Dalis perskaiciuota
SESIJOMIS: is tu, kas preke MATE, kiek jos isidejo. Niekada nevirsija 100 %.
Isemimo rodiklis paliktas veiksmais — ten domina, kiek kartu preke grazinta
atgal, o ne kiek zmoniu tai padare.

---

### TECHNINES PAMOKOS (SIOS DIENOS)

- **Unikalus skaiciai NESUDEDAMI.** `COUNT(DISTINCT sesija)` su preke_id
  dimensija ir tada `SUM()` duoda nesamone. Sesijoms reikia atskiros
  agregavimo srities be prekes dimensijos.
- **DOM `data-*` nera produkto ID.** MnM vitrinose `data-cid` = `child_item_id`.
  Pries siejant elgsena su pardavimais — PATIKRINTI, ar tai tas pats raktas.
- **Busenos tekstas nera duomenu saltinis.** „rinkis viena" pakeicia „nuo 45 €";
  skaicius imti is konfiguracijos, ne is UI teksto.
- **Palyginimo grupe gali buti tuscia.** Prieaugio ir grazos rodikliai be
  kontrolines grupes duoda absurdus (72,9x) — tikrinti vardikli.
- **`esc_html()` antrastese naikina tooltip'us.** Kur ideda HTML — `wp_kses_post()`.
- **Santykiai tarp skirtingu matavimo vienetu meluoja.** Ivykiai/ivykiai davė
  225 %; teisingas vardiklis buvo sesijos. Pries dalindamas — patikrink, ar
  skaitiklis ir vardiklis matuoja TA PATI dalyka.
- **XLSX be bibliotekos imanomas:** `ZipArchive` + 5 XML failai. Skaiciai
  rasomi be `t=`, tekstas su `t="inlineStr"` — jokio sharedStrings nereikia.
- Snippet'e PHP klases vardas su `\\` uz string ribu = ParseError; naudoti
  `class_exists($kintamasis)` + `call_user_func()`.

---

### NEUZDARYTA — ATASKAITOS

```
1. E6 DoD NEIVYKDYTAS: dev'e nera nei vieno paruosto rinkinio ar DP pako,
   todel kanibalizacijos verdiktai (PRIDEDA/PERKELIA/PER MAZAI) parasyti,
   bet NEPATIKRINTI su duomenimis. Reikia 2 testiniu uzsakymu — RAIMIS
   (netariau savo iniciatyva: uzsakymai paveiktu likucius ir AVPN serijas)
2. Produkcijai: `ps_stat_pradzia` nustatyti launch data
3. Produkcijai: patikrinti, ar Complianz statistikos kategorija realiai
   grazina `cmplz_has_consent('statistics')` gyvoje aplinkoje
4. Ribos (kandidatu, lyderiu, kanibalizacijos) — kol kas numatytosios;
   perziureti, kai susikaups realiu duomenu
```

---

---

## 2026-08-13 — RINKINIU LANGAS: NUO SARASO IKI VITRINOS [S781-S812]

Diena apie rinkinius nuo admin saraso iki to, ka mato klientas. Langas
`petshop-rinkiniai.php` nuo v1.0 iki **v1.24**.

**Dienos taisykle:**

> Kai kas nors neveikia — ziurim, KUR realiai gimsta tekstas ar paveikslas,
> o ne spejam. Tris kartus is eiles prielaida buvo klaidinga, ir kiekviena
> karta atsakyma dave tikras HTML/failo pavadinimas.

---

### S781-S784 — NAVIGACIJA IR SARASAS

**Rinkiniu langas dingo is juostos.** Prekes buvo sveikos (42 MnM + 8 DP), bet
`petshop-katalogas.php` navigacijos juostoje `ps-rinkiniai` nebuvo iraso.
Pridetas punktas tarp „Tiekimas" ir „Uzsakymai" (failas 405 kb, kopija daryta).

**Sarasas v1.4** — perdarytas galvojant apie 200+ rinkiniu:
- nuotraukos: rinkinio miniatiura 56 px + komponentu nuotraukeles po pavadinimu
- filtrai: tipas · **gyvunas** · busena · kategorija · marza · sandelis · paieska
- paieska ieskо IR tarp prekiu viduje („ausis" randa ir „Jaucio ausu rinkini")
- rikiavimas paspaudus stulpeli, korteliu vaizdas, masiniai veiksmai, CSV
- puslapis paduoda duomenis vienu kartu, filtruoja narsykle

**Gyvunu rusys imamos IS MENIU**, ne irasytos i koda: SUNIMS · KATEMS ·
GRAUZIKAMS · PAUKSCIAMS · ZUVIMS. Rinkinys priskiriamas pagal KOMPONENTU
kategorijas — „Churu" pavadinime gyvuno nera, bet komponentai guli po KATEMS.
Atsiradus naujai rusiai meniu, filtras ja paims pats.

**Terminologija (savininko pataisymas):** „sutvarkyta", NE „tvarkoje".
Eiles perrasytos i darbo krepselius: „Klientas negali nusipirkti" vietoj
„Nesurenkami", „Likutis baigiasi" vietoj „Liko mazai".

---

### S785-S788 — SVORIS IR SIUNTIMAS

**Rasta: visu rinkiniu svoris tuscias.** 24 kg maisai siuntimo skaiciavimui
svere nuli — i pastomata tokia siunta „tilpdavo".

| Rinkinys | Svoris prekeje | Komponentu suma |
|---|---|---|
| 12 kg × 2 | tuscias | 24 kg |
| 7 kg × 2 | tuscias | 14 kg |
| Koju rinkinys | tuscias | 0,72 kg |

**Sprendimas (v1.13):** svoris skaiciuojamas ir irasomas i PACIA preke (ne per
`_mnm_weight_cumulative`) — taip matomas ir uzsakyme, ir manifeste, ir
ataskaitose. DP pakui — bazines × N.

**Siuntimo klase** parenkama pagal gradacija: iki 50 kg · 50–70 · 70–100 · 100–200.

**Pastomato riba 25 kg** (savininko sprendimas):
- klientui — virs 25 kg pastomatu pasirinkimas issijungia, lieka kurjeris;
  skaiciuojamas VISO krepselio svoris (du 15 kg maisai atskirai telpa, kartu — ne)
- admin — raudonas ispejimas kainodaros bloke

**Papildomai rasta:** dalis komponentu (skanestai, zaislai) svorio neturi.
Lange rodomas ispejimas „N prekes be svorio — siuntimo kaina bus neteisinga".

---

### S789-S795 — APRASYMAI: TRYS KLAIDOS IS EILES

**1. Sekcijos suirdavo.** I rinkinio aprasyma patekus komponentu tekstams su
antrastemis („Sudėtis", „Analizė"), aprasymu akordeonas (**snippet 512**) jas
atpazindavo ir issikirpdavo i atskiras sekcijas — rinkinio sudetis suirdavo.

**Priezastis rasta diagnostika:** 512 kabinasi ant `woocommerce_product_tabs`
**prioritetu 98**, o mano filtras buvo 25 — jis mane perrasydavo atgal.
Sprendimas: prioritetas **200**.

**2. CSS issiliejo i puslapi.** Prekiu aprasymuose yra `<style>` blokai
(`.b2b-black { color:#000 !important; }`) — jie krito i puslapi kaip tekstas, o
svetimi `<div>` su savo klasemis suarde isdestyma i stulpelius.
Sprendimas: `<style>`/`<script>` iskerpami su turiniu, CSS likuciai nuvalomi,
paliekamos TIK teksto zymes (be klasiu ir `style=""`), `force_balance_tags`.

**3. Pilni aprasymai.** Savininkas: aprasymai turi buti pilni, gal isskleidziami.
Sprendimas: trumpas tekstas + `<details>` „Placiau apie sia preke" su pilnu
aprasymu (lentelemis, sudetimi). Veikia be JavaScript.

---

### S796-S800 — VITRINOS TEKSTAI: KUR JIE REALIAI GIMSTA

Klientas mate: „PRODUCT / QUANTITY", „You have selected 3 items. Add to cart to
continue…", „(3/3 items)", „IŠVALYTI PASIRINKIMUS".

**Trys bandymai, tik trecias pavyko:**

| Bandymas | Kas daryta | Rezultatas |
|---|---|---|
| 1 | `gettext` su MnM domenu | pro sali — antrastes kito domeno |
| 2 | `gettext_with_context` | pro sali |
| 3 | **CSS `::after`** | veikia |

**Isvada:** antrastes sablone irasytos tiesiai, be vertimo funkcijos — i
WordPress vertimu sluoksni is viso nepatenka. CSS keitimas veikia nepriklausomai
ir islieka po plugino atnaujinimo.

Atsakyma dave narsykles recon: `<th class="product-details">` ir
`<th class="product-quantity">`. Ten pat paaiskejo, kad reset mygtuko klase yra
`mnm_reset`, o slepiau `mnm_reset_link` — vienos raides skirtumas.

**Isversta ir sutvarkyta:** Preke / Kiekis · „Pasirinkote 3 vnt." ·
„Isidekite i krepseli" · „Isvalyti pasirinkimus" pasleptas fiksuotiems
rinkiniams (klientas ten nieko nesirenka) · kiekio laukelis neredaguojamas.

**Komponentu bukle — be skaiciu** (savininko sprendimas): tik „Turime"/„Neturime".
„Liko 2 vnt." salia komponento skaitosi kaip RINKINIO likutis, nors reiskia kita.

**„Sutaupote" blokas** po kaina — kaip DP pakuose (#570). Rodomas tik kai
rinkinys realiai pigesnis.

---

### S801-S806 — DP PAKAI: TA PATI PREKE × N

Palyginus teisinga #34484 su sukurtu #34899 paaiskejo, ko truko:

| | Teisingas | Buvo |
|---|---|---|
| Tipas | `simple` | `mix-and-match` |
| DP laukai | `_dp_base_product_id`, `_dp_pack_qty` | nera |
| Aprasymas | 2 551 simb. | 148 |
| **Atributai** | **6** | **0** |
| Kategorijos | DAUGIAU=PIGIAU + Sausas maistas sunims | tik DAUGIAU=PIGIAU |

**Atributai — rimciausia spraga:** be `pa_pakuotes_dydis` ir `pa_gyvuno_rusis`
pakas iskrenta is parduotuves filtru.

**v1.6:** visi baziniai atributai perkeliami (terminai priskiriami PO save(),
kitaip WC juos naktį pasalintu); pakuotes dydis keiciamas multipack terminu,
jei toks jau yra kataloge (naujo NEKURIAM — terminu sarasas yra katalogo
struktura); brendas perkeliamas; **SKU generuojamas** `DP-{bazes SKU}-{N}`.

---

### S807-S810 — KATEGORIJOS: TIK RINKINIAI

Pirma bandyta speti rusi ir porusi pagal komponentus. Rezultatas blogas:
misrus rinkinys atsidure po „Kita", veliau po SUNIMS.

**Savininko sprendimas:** automatiskai TIK **RINKINIAI (679)**, visa kita —
rankomis. Kur rinkinys parduodamas, yra rinkodaros sprendimas, ne balsavimo
algoritmas.

---

### S811-S812 — KOMPOZICIJA

**Savininko taisykle:** 2–3 prekes → **herojus + palydovai**; 4+ → **lygus
tinklelis**. Drobe visada **kvadratine** (ankstesne 3×1 juosta kataloge virsdavo
ruozeliu).

Herojus = **brangiausia** preke (ji beveik visada ir didziausia fiziskai).
Dalis padidinta iki **66 %** savininko praymu.

**Nuotraukos nesikeite tris kartus is eiles — trys skirtingos priezastys:**

1. **v1.20:** parasas skaiciavo tik komponentus, o pasikeite ISDESTYMAS →
   i parasa itraukta algoritmo versija
2. **v1.22:** kompozicija piese **snippet 539** funkcija
   `petshop_generate_composition()`, nes ji buvo tikrinama pirma. Atsakyma dave
   failo pavadinimas: `rink-composition-…` (539) vs `rink-kompozicija-…` (musu)
3. **v1.23:** v1.21 metu parasas jau buvo atnaujintas, bet paveiksla dar piese
   539 → v1.22 nusprende, kad kompozicija svieza, ir praleido. Versija → v3

**v1.24:** nukerpami tusti balti krastai (`imagecropauto`) — gamintoju
nuotraukose aplink preke daug tuscio ploto, del to preke laukelyje atrodydavo
perpus mazesne.

**Zenklas „N PREKES" — CSS, ne idegintas i paveiksla.** Pakeitus sudeti skaicius
atsinaujina pats, ir nelieka pavojaus, kad paveiksle liks senas.

---

### KAS LIKO

| Klausimas | Bukle |
|---|---|
| Rinkinio duomenys katalogo kortelėje | **Neuzbaigta.** Kortele iesko `_cost_price`, likucio ir `ps_sources` — rinkinys ju neturi. Sprendimas: issaugant irasyti apskaiciuota savikaina i `_cost_price`. Likucio NEIRASYTI — butu dviguba apskaita |
| Komponentai be svorio | skanestai, zaislai — reikia uzpildyti prekiu kortelese |
| Testinis #34899 | MnM su neteisinga vitrina — perkurti kaip DP arba istrinti |
| Tevinis #34196 | neatkurtas, 6 dydziai nepasiekiami |
| Susidejimo rinkiniu redagavimas | nepradeta |

### DIEGIMO PASTABA

Failas 130+ kb per didelis siusti POST'u — snippetas nespeja. Veikiantis budas:
PUT i repo `deploy/`, tada snippetas parsiuncia per `wp_remote_get` ir irašo.
Sintakses patikra pries rasyma: klase pervadinama (`Petshop_Rinkiniai_Sintakse`),
kitaip `include` luzta su „Cannot declare class".

---

## 2026-08-11/13 — RINKINIAI: NUO MAKETO IKI VEIKIANCIO LANGO + LIKUCIU SARGAS [S766-S780]

Trys dienos apie rinkinius. Pradzia — maketai, kuriuos savininkas atmete du
kartus is eiles, ir teisingai; pabaiga — veikiantis mu-plugin langas ir
uzdaryta reali skyle parduotuveje.

**Dienos taisykle, kuria savininkas ivardijo:**

> Pries siulant nauja sprendima — pasiziureti, kas JAU padaryta (ekrane, ne tik
> kode), ir tai panaudoti. Ne perdaryti prasciau.

### IDIEGTA

| Failas | Versija | Ka issprende |
|---|---|---|
| petshop-rinkiniu-likuciai.php | **1.0** (naujas) | rinkinys dingsta is prekybos, kai jo neimanoma surinkti |
| petshop-rinkiniai.php | **1.0 → 1.2** | rinkiniu sarasas, redagavimas, trynimas, kurimas is viso katalogo |

---

### S766-S770 — RECON: KAS REALIAI YRA

43 MnM prekes, 362 komponentu rysiai, 133 unikalus komponentai, 53 konteineriai
`wc_mnm_child_items` lenteleje (**10 siukslianiu eiluciu** — konteineriai be
prekiu).

**Du atskiri produktai, dvi mechanikos** (NIEKADA nesuplakti i viena sarasa):

| | Paruostas rinkinys | Susidejimo rinkinys |
|---|---|---|
| Sudeti lemia | mes | klientas |
| Kiekiai | `_petshop_component_quantities` | pool, laisvas pasirinkimas |
| Struktura | 1 MnM preke | 1 tevine + N pasleptu MnM |
| Marza | tiksli | intervalas (blogiausias/geriausias) |
| Kurimo forma | snippet **539** | snippet **550** |
| Vitrina | — | snippet **547** v19 |

**Rastos spragos:**
- Tevinis #34196 istrintas, 6 pasleptri dydziai liko publikuoti — parduotuveje
  nepasiekiami („Susirink konservu rinkini pats" 400g ir 800g)
- 3 is 7 paruostu rinkiniu BE fiksuotu kiekiu (#34156, #34153, #34158) —
  klientas gali pasiimti N vnt. to paties
- 56 is 133 komponentu be savikainos (legacy)

---

### S771 — MnM LIKUCIU NURASYMAS: VEIKIA (patikrinta realiu uzsakymu)

Sukurtas realus uzsakymas dev'e su #34172. Krepselis issiskleide i 6 eilutes
(konteineris + 5 vaikai su `mnm_child_id`), `wc_reduce_stock_levels` nurase
**tiksliai pagal fiksuotus kiekius**: −2, −2, −1, −1, −1. Likuciai atstatyti,
uzsakymai 34897/34898 istrinti.

**TESTAVIMO BUDAS — svarbu:** `$order->add_product($container, 1, ['configuration'=>...])`
**NESUKURIA vaiku** — uzsakymo eilute lieka be komponentu, ir tada atrodo, kad
nurasymas neveikia (pirmas testas dave klaidinga „NENURASO"). Teisingai:

```php
WC()->cart->add_to_cart($CID, 1, 0, [], ['mnm_config' => $conf]);
// $conf: [child_item_id => ['product_id'=>ID, 'quantity'=>N]]
// child_item_id is $ci->get_child_item_id(), NE product_id
```

---

### S772-S774 — RASTA SKYLE: RINKINYS PARDUODAMAS, KAI JO NERA

Nuleidus komponento likuti i 0: konteineris liko `instock` ir `purchasable`,
krepselis PRIEME rinkini be jokio ispejimo. Tas pats, kai likutis 1, o rinkiniui
reikia 2.

Iki tol nesimate tik todel, kad likuciai dideli (388, 1680, 104).

**Palyginimui:** „Daugiau=pigiau" pakai (snippet **567**) tai daro teisingai —
dinaminis `is_in_stock`, krepselio validacija, nurasymas is bazines prekes.

#### Sprendimas: petshop-rinkiniu-likuciai.php v1.0

Du skaiciavimai pagal tipa:

- **Paruostas** (yra fiksuoti kiekiai): `min( likutis[i] / kiekis[i] )` — vieno
  komponento truksta, rinkinio nera
- **Susidejimo** (pool): `suma(likuciu) / min_container_size` — vienos rusies
  pritrukus, klientas pasirinks kita

Filtrai: `woocommerce_product_is_in_stock`, `woocommerce_product_get_stock_status`,
`woocommerce_get_stock_html`, `woocommerce_add_to_cart_validation`,
`woocommerce_check_cart_items`.

**Patikrinta NARSYKLEJE, tikru kliento keliu:**

| Bazines prekes likutis | Ka mato klientas |
|---|---|
| 4 vnt. (reikia 2) | „Turime", bet kiekio laukelio **max = 2** |
| 0 vnt. | **„Neturime"**, mygtuko „I krepseli" nera |
| Per daug krepselyje | Apmokejimas stabdomas su tikslia zinute |

**PASTABA APIE TESTAVIMA:** programinis `WC()->cart->add_to_cart()` **apeina**
`woocommerce_add_to_cart_validation` — sarga tikrinti TIK per narsykle, kitaip
gaunami klaidingi rezultatai.

---

### S775-S778 — MAKETAI: DU ATMESTI VARIANTAI

- **v1** — vienas bendras sarasas abiem tipams. Savininkas: „viskas suplakta i
  1, o is principo tai 2 skirtingi dalykai". **Atmesta teisingai.**
- **v2/v3** — du skirtukai + kurimas. Savininkas: „ziurek i jau padaryta modeli,
  perskaityk visus snipetus". **Klaida: perdariau #539 filtracija i savo
  isgalvota „rusi", nors ten jau buvo kategorija + sandelis.**
- **v4/v5/v6** — po pilno #539/#550 perskaitymo. Kalba, laukai ir marzos zenklai
  (**€ su ✅/❌**, NE procentai) paimti 1:1 is esamu formu.

**Kategoriju medis — radinys:** filtruojant `count > 0` iskrenta TIKROSIOS
tevines (KATEMS, GRAUZIKAMS — ju prekes guli vaikuose), o i virsu iskyla senos
(„Animonda konservai sunims", „Miamor katems"). Reikia VISU kategoriju + meniu
tvarkos + rekursinio skaiciavimo. ŠUNIMS su vaikais = 1699, ne 12.

**SPRENDIMAI turi porusius** „Naujas suniukas", „Naujas kaciukas" — visi tusti.
Rinkiniai ten prasosi.

---

### S779 — petshop-rinkiniai.php v1.0-1.2

**Meniu:** Petshop prekes → Rinkiniai (`add_submenu_page('ps-katalogas', ...)`)

**Sarasas:** darbo eiles (Visi · Kiekiai nefiksuoti · Be savikainos ·
Komponentas neparduodamas · Juodrasciai · **Sutvarkyta**), savikaina, prekes
atskirai, kaina, marza €(%), „Galima parduoti".

> **Terminologija:** „sutvarkyta", NE „tvarkoje" (savininko pataisymas).

**Forma:** paieska per **VISA kataloga** (2 566 prekes) — filtrai kategorija
(medis su palikuonimis) · **svoris `pa_pakuotes_dydis`** (82 reiksmes, rikiuotos
pagal tikra dydi) · sandelis · savikaina · tekstas. Rezultatuose: nuotrauka,
svoris, savikaina, pard. kaina, marza, likutis.

**Kainodara:** savikaina · prekes atskirai · norima marza % → **rekomenduojama
kaina** → tavo kaina → **marza persiskaiciuoja gyvai**.

**Sargai formoje:** rinkinys brangesnis nei prekes atskirai · marza minusine ·
komponentas be likucio · keli dropship tiekejai · **norima marza nepasiekiama
nevirsijant iprastos kainos** (fasuotam maistui 35 % dazniausiai neimanoma —
2× Josera 12,5 kg: savikaina 81,98 €, atskirai 119,18 €, o 35 % reikalautu
126,12 €).

**Publikavimas:** naujas rinkinys — JUODRASTIS. Varnele „Publikuoti" paleidzia
i parduotuve. Perziura: kortele „Kaip matys klientas" + nuoroda i tikra puslapi
(juodrasciui per WP preview).

**Papildomai:** kopijavimas · trynimas su uzsakymu patikra · zurnalas per
`Petshop_Ivykiai` · sargas del neirasytu pakeitimu.

---

### S780 — TA PATI PREKE × N ≠ MIX&MATCH

Savininkas sukure 12 kg × 2 ir gavo „PRODUCT / QUANTITY / ISVALYTI PASIRINKIMUS"
vietoj graziosios pakuotes vitrinos.

**Savininko klausimas:** „kai rinkinys ta pati preke, tai taip pat Mix&Match, o
jei jo netaikysi kaip tada sugaudysi likucius?"

**Atsakymas is kodo:** likuciai gaudomi ir be MnM — snippet **567** nurašo
`pack_qty × kiekis` is bazines prekes, atstato atsaukus, slepia paka kai
neuztenka, stabdo krepselyje. Visi 8 esami DP pakai — `simple`, `manage_stock=no`.

**Taisykle:**

| Sudetis | Tipas | Kategorija | Nuotrauka |
|---|---|---|---|
| kelios skirtingos prekes | MnM rinkinys | RINKINIAI + porusis | kompozicija (GD) |
| **ta pati preke × N** | **DP pakas** (`simple` + `_dp_base_product_id` + `_dp_pack_qty`) | **DAUGIAU=PIGIAU (91)** | **bazines prekes** |

Priezastis ne likuciai, o **vitrina**: pakas turi zenkla „×N VNT.", juosta
„EKONOMISKA PAKUOTE", lentele su bendru kiekiu ir vieneto kaina (#568, #570, #573).

**RINKINIAI negali buti default kategorija** (savininko pastaba).

v1.1 pridejo tipo atpazinima formoje, DP pakus i sarasa (stulpelis „Tipas"),
atskira DP perziura ir `issaugoti_dp()`.

---

### S780b — KABLELIS KAINOSE

Savininkas: „negaliu irasyti skaiciaus su kableliu pvz 13,90".

`<input type="number">` su LT lokale kablelio nepriima. Pakeista i
`type="text" inputmode="decimal"` + normalizavimas: `13,90` ir `13.90` abu
veikia, tarpai nekliudo, isejus is lauko susitvarko i `13,90`. Serverio puseje
`str_replace(',', '.')`.

Patikrinta 9 atvejais: `1 234,50` → 1234,5 · `,5` → 0,5 · `abc` → 0.

---

### KAS LIKO NEBAIGTA

| Klausimas | Bukle |
|---|---|
| v1.1/v1.2 diegimas | **NEPATVIRTINTAS** — tiltas perrase skripta tarp PUT ir dispatch (3 bandymai). Failai atiduoti savininkui rankiniam ikelimui |
| Testinis 12 kg × 2 | Guli publikuotas kaip MnM su neteisinga vitrina — perkurti kaip DP arba istrinti |
| Rinkiniu porusiai | Misriems (tualetas + maistas + zaislas) porusio nera — laukia savininko sprendimo |
| Susidejimo rinkiniu redagavimas | Suplanuotas, nepradetas. Savininkas: „svarbu sukurti 1 karta, paskui kad butu patogu redaguoti, keisti prekes viduje" |
| 10 siukslianiu `wc_mnm_child_items` eiluciu | Nevalyta |
| Tevinis #34196 | Neatkurtas |

### TILTO PASTABA

Rezultatus skaityti **TIK per commit SHA** arba **contents API**, ne per
`raw.githubusercontent.com/.../main/` — CDN velina 30–60 s ir sioje sesijoje
**tris kartus** dave senus duomenis kaip naujus. Plius: tilta naudoja ir kitas
procesas, todel pries `dispatch` verta palyginti `screenshot.mjs` md5.

---

## 2026-08-12 — KLAIDU TAISYMO DIENA: KORTELE TAMPA VIENINTELE DARBO VIETA [S689-S707]

Diena pradeta kaip „deganciu klaidu taisymas", bet kas antra klaida atskleide
ta pati struktūrini trukuma: **funkcijos isbarstytos be principo**. Savininkas
ju ieskodavo kortelėje ir nerasdavo, nes jos gyveno sarase, Gavime arba
WooCommerce lange. Diena baigta uzrakinta taisykle:

> **Kortele = viskas apie VIENA preke. Sarasas = masiniai veiksmai.
> Gavimas = tik priemimas.** Jei ko nors reikia vienai prekei — tai privalo
> buti kortelėje, net jei jau yra kitur.

### IDIEGTA

| Failas | Versija | Ka issprende |
|---|---|---|
| petshop-katalogas.php | 6.1 → **8.0** | kopijavimas · trumpas aprasymas · miniatiuros · likutis · kategorijos · sudeliojimas · partijos · GPAIS · sinchronas · du likuciai |
| petshop-gavimas.php | 1.4 → **1.11** | prekes kopija · kurimas be gavimo · sekcijos pabaiga · LT datos |
| petshop-partijos.php | 1.1 → **1.2** | GPAIS medziagu/tipu sarasai + eilutes trynimas |
| petshop-rankos.php | **1.0** (naujas) | rankinis sprendimas nustelbia automatika (VF+ZB) |
| petshop-kalendorius.php | **1.0** (naujas) | vienas LT datu parinkiklis visiems langams |

---

### S689-S691 — PREKES KOPIJA

Savininkas: „matau yra panasi preke, kaip padaryti prekes kopija".

**Kodel NE WooCommerce „Dubliuoti":** jis kopijuoja ir `_zb_*`, `_vf_*`,
`_ean`, `_ps_sandelis` — nauja AV preke atrodytu kaip ZB/VF, o artimiausias
importas (#2/#3/#6) ja perrasytu arba sujauktu likucius.

Pirma versija perimdavo tik klasifikacija (kategorija, brendas, rusis, dydis),
o Sudeti samoningai palikdavo tuscia. **Savininkas ta riba panaikino:**
„turi buti identiska kopija, tik neirasytas prekes kodas ir EAN, kaina".

Galutinis elgesys: perimama VISKAS — pavadinimas, visos kategorijos, brendas,
visi `pa_*` atributai, visos aprasymo sekcijos, trumpas aprasymas, svoris,
matmenys, pagrindine nuotrauka ir galerija. Tusti lieka TIK **SKU, EAN,
kaina**. Tiekejo laukai neperkeliami niekada.

**Ieiti galima dviem keliais:** katalogo kortelėje „Kopijuoti i nauja ↗" arba
Gavimo formos virsuje „Kopijuoti is panasios prekes".

**Salutinis radinys:** kopijuojamame aprasyme buvo CSS kaip PAPRASTAS TEKSTAS
(`.b2b-black * { color:#000 !important; }`) — `<style>` zymes buvo nuimtos dar
importo metu, todel tagu salinimas jo nepagavo. Ismetamos eilutes, atrodancios
kaip CSS taisykle.

---

### S692-S693 — TRUMPAS APRASYMAS KORTELEJE

Iki siol `post_excerpt` (tekstas virs „I krepseli") buvo redaguojamas TIK
WooCommerce lange.

**Savininko taisykle (uzrakinta):** „is viso i WC geriau nelysti — ten
duomenys turi automatiskai koreguotis, kai mes taisome savo kortelėje".
Techniskai sinchronizacijos nera ir nereikia: kortele raso i TUOS PACIUS
laukus. WC langas lieka avariniam keliui, ne kasdieniam darbui.

**v6.5 patikslinimas:** laukas atsidaro TEKSTINIU rezimu — savininkas
pastebejo, kad ten guli `<span style="color:rgb(119,119,119); font-family:...">`
ir taisyti neimanoma. Dabar: kiekviena eilute virsta `<p>`, o „HTML kodas"
rezimas lieka nuorodoms ir sarasams; irasant kodas valomas.

---

### S694 — DVI PREKES SU TA PACIA NUOTRAUKA (tikra regresija)

Padarius kopija, **originalo miniatiura sarase dingo**, nors kortelėje ir
parduotuveje nuotrauka buvo.

**Priezastis `miniatiuros()`:** zemelapis statytas kaip `[attachment_id => pid]`
— attachment ID kaip RAKTAS. Kai dvi prekes rodo i ta pati faila (o kopija
butent tai ir daro), antroji perrasydavo pirmaja. Iki kopijavimo funkcijos
toks atvejis buvo retas, todel klaida gyveno nepastebeta.

Dabar `[attachment_id => [pid, pid, ...]]`.

---

### S695 — PREKIU SUVEDIMAS BE GAVIMO

Savininko eiga: „prekes galiu susivesti su 0 likuciu ir savikaina — tai
paprasciausia prekes kortele, kuri eina i juodrascius. Cia yra pagreitinimas".

Pridetas antras mygtukas **„Sukurti ir kurti kita"** (i gavimo lentele
nededama, forma lieka atvira) ir blokas „Si karta sukurta prekiu: N".
„Irasyti gavima" klaida dabar rodoma LIEKANCIAME bloke — trumpas uzrasas
dingdavo per 3 s ir atrode, kad mygtukas neveikia.

---

### S696 — RANKINIS SPRENDIMAS NUSTELBIA AUTOMATIKA (petshop-rankos.php v1.0)

**Incidentas:** 2026-08-11 22:43 savininkas isieme VF preke #25319 is prekybos.
2026-08-12 07:01 cron'as `petshop_vf_sync_publish_daily` (snippetas 565) ja vel
paskelbe. Istorija parode dvi eilutes: „ranka · Rai" ir po to „automatika".

**Priezastis struktūrine:** juodrastis reiskia DU dalykus — „dar nebaigta" ir
„nusprendziau neprekiauti". Automatika mato tik `post_status='draft'` ir
tikrina kokybes kriterijus; prekei, isimtai SAMONINGAI, visi kriterijai kaip
tik ir buna tenkinami.

**Sprendimas:** kai ZMOGUS perkelia i juodrasti (bet kur), uzdedama
`_ps_ranka_isimta`. Kol ji yra, jokia automatika nepublikuoja. Vartai
pastatyti ties `wp_insert_post_data` — pro ji eina VISI (VF cron, ZB importas
#2, WP All Import). Snippeto 565 taisyti nepakaktu — liktu ZB.

**Patikrinta testu:** imituotas zmogaus isemimas → zyme atsirado; imituotas
cron → preke liko juodrastyje.

**Atstatytos:** #26471, #26473 (buvo grazintos i prekyba 07:01), #25319.

---

### S697 — GPAIS PAKUOTE (partijos v1.2, katalogas v6.10)

Savininkas: „cia turi buti patikslinimas — GPAIS Pakuote, nes patys
susimaisysime. Ir nera jokio redagavimo, as net negaliu susivesti duomenu".

Abu teisinga. Skirtukas vadinosi „Pakuote" ir maisesi su `pa_pakuotes_dydis`
(12 kg, 400 g) — visai kitas dalykas. O `irasyti_pakuote()` egzistavo nuo
pirmos dienos, bet **jokia sasaja jo nekviete**.

Medziagos ir tipai — FIKSUOTAS sarasas vienoje vietoje: deklaracija sumuojama
pagal medziagos pavadinima, ir laisvas laukas duotu „Popierius", „popierius"
ir „Kartonas" kaip tris eilutes.

**Dvi pamokos, kainavusios du diegimus:**
1. Kortele ikraunama per `innerHTML` — joje esantys `<script>` blokai
   NEPASILEIDZIA. Duomenys keliauja `data-` atributais.
2. Katalogas turi DU atskirus `<script>` blokus. Funkcija, idėta i viena ir
   kvieciama is kito, krito `ReferenceError`, o `.catch()` parode
   „Nepavyko susisiekti su serveriu" — atrode kaip tinklo problema.

---

### S698 — VISKAS APIE PREKE GYVENA KORTELEJE (v7.0)

Savininkas: „viska sudeliok, nes dabar yra blogai".

**Auditas per 10 tos dienos versiju parode: nieko nedingo.** Bet:
- AV likucio redagavimo kortelėje NIEKADA nebuvo — tik sarašo „Greitame
  redagavime";
- „Sudelioti i lentyneles" — tik Gavimo naujos prekes formoje;
- kategoriju keitimo — isvis tik WooCommerce lange.

Pridėta visa tai. Papildomai paleistas **SARGAS**: fiksuotas 16 valdikliu
sarasas tikrinamas trims prekems (AV, VF, juodrastis) pries ir po kiekvieno
diegimo. Jei kuris nukrenta i 0 — diegimas neskelbiamas padarytu.

---

### S699 — SEKCIJA TURI PABAIGA, NE TIK PRADZIA (gavimas v1.10)

Savininkas: „yra sudetis: ......... ir paskui koks nors tekstas — jis ir ta
teksta sudeda i sudeties skyriu".

Skaidytojas mokejo atpazinti tik sekcijos PRADZIA. Dabar sekcija uzsidaro ir
tada, kai (a) pasitaiko NEZINOMA antraste (trumpa eilute su dvitaskiu:
„Maistine verte:", „Laikymas:"), arba (b) uzdaroje sekcijoje pasitaiko
SAKINYS (ilga eilute su tasku, be procentu ir kableliu saraso).

**Niekas nemetama:** nutrauktas tekstas keliauja i „Aprasyma", o statusas sako
„2 eil. liko aprasyme". Pirmoji eilute po antrastes priimama VISADA — kitaip
sudetis, parasyta vienu sakiniu, iskristu.

---

### S700-S701 — RANKINIS LIKUTIS IR PARTIJOS NE TIK AV

**Tyli klaida, rasta pries diegima:** `av_laukas()` i `_stock` rase tik kai
sandelis buvo lygiai „av". Ambrosia, Prins, Quattro, Belacor likutis butu
nugules i `_own_stock_qty`, kurio parduotuve neskaito — skaicius irasytas,
zurnale matomas, preke NEPARDUODAMA. Recon: Ambrosia preke likuti laiko
`_stock` (8 vnt.), o `_own_stock_qty` visoje bazeje — 1 irasas.

Ta pati riba buvo ir partijoms: blokas rodomas tik `av_preke()` prekems.

---

### S702 — LIETUVISKAS KALENDORIUS (petshop-kalendorius.php v1.0)

`<input type="date">` piesia NARSYKLES kalendoriu — „August 2026", savaite nuo
sekmadienio, mm/dd/yyyy. Svetaine to pakeisti negali.

Atskiras modulis, o ne treciasis toks pat sprendimas kataloge: klase `ps-data`
uzteka. Reiksme visada ISO (2027-09-30). Patikrinta ANGLISKOJE narsykleje
(`en-US`): „Rugpjutis 2026", savaite Pr–Sk.

*Skola: Akciju langas dar naudoja savo sena kalendoriu.*

---

### S703 — PAKEITIMAS MATOSI IS KARTO (v7.5)

Savininkas: „pakeiciau preke, langas neatsinaujino, isejau — kataloge
neatsinaujino, cia jau labai blogai".

Kortele ir sarasas rode SKIRTINGA tiesa apie ta pacia preke. Po kiekvieno
irasymo kvieciamas `ps_kat_eilute` ir eilute atnaujinama vietoje. Perkrauti
puslapio negalima — dingtu filtrai, slinktis ir atidaryta kortele.

*Papildyta v7.9: kesas valomas PRIES skaitant — kitaip eilute gaudavo dar
sena momentine kopija.*

---

### S704 — „SANDELIS" → „TIEKEJAS" (v7.6)

Zodis vertė galvoti apie VIETA. Stulpelis, filtras ir eksporto laukas dabar
vadinasi „Tiekejas", o paaiskinimas sako, is kur ateina likutis.

---

### S705-S707 — DU ATSKIRI LIKUCIAI: TIEKEJO IR AV (v8.0)

Savininkas klausė TRIS kartus, kol atsakiau i tai, ko klause:
„KODEL prekes kortelėje negaliu ivesti likucio su galiojimu I AV SANDELI?"

**Mano klaidos, viena po kitos:**
1. v7.7 — sujungiau likuti ir galiojima i viena forma (tai buvo reikalinga:
   iki tol veike DU keliai — likutis be galiojimo ir atskira „Nauja partija").
2. v7.10 — nuspredziau, kad viskas, kas ne VF/ZB, guli musu lentynoje, ir
   emiau rodyti „AV AMBROSIA". **NETIESA, atsaukta.**

**Savininko patikslinimas (uzrakinta):** „Ambrosia — ATSKIRAS SANDELIS,
dropshipingo, tik jis neduoda XML. O AV yra AVESOS sandelis."

**Teisingas modelis — dvi nepriklausomos eilutes:**

| Eilute | Laukas | Kas tai | Kaip pildoma |
|---|---|---|---|
| TIEKEJO | `_stock` | kiek turi Ambrosia / Prins / VF / ZB | VF, ZB — is XML (tik skaitymui); kiti — ranka |
| AV | `_own_stock_qty` | kiek parsiveze i Avesos sandeli | visada ranka; **cia partijos, galiojimai, savikaina** |

Gryna AV preke (be tiekejo) savo likuti laiko `_stock` — jai tiekejo eilutes
isvis nera.

**Partijos ir galiojimai priklauso TIK AV:** tiekejo lentynoje gulincios
prekes galiojimo mes nezinom ir nevaldom.

**Gavimas kuria partija:** pasirinkus priezasti „Gavimas" ir teigiama pokyti,
kiekis irasomas per `Petshop_Partijos::priimti()` su galiojimu ir savikaina.
Mazinimas nurasomas FEFO tvarka (`nurasyti()`) — kitaip partiju suma ir
likutis issiskirtu.

**Istorija (S705, antra savininko pastaba):** likucio keitimai buvo rasomi i
`ps_av_zurnalas`, o Istorijos skirtukas skaito `Petshop_Ivykiai` — zurnalas
buvo, tik ne ten, kur zmogus ji skaito. Dabar rasoma i abi.

---

### KAS SIANDIEN PAMOKA (procesas, ne kodas)

1. **Nepradejau nuo savininko lango.** Dvi is triju „regresiju" nebuvo
   regresijos — funkciju ten niekada nebuvo. Auditas per atsargines kopijas
   tai parode per 10 minuciu; reikejo daryti ji pirma, ne po trecio priekaisto.
2. **Tikrinau tik ta, ka ka tik pakeiciau.** Miniatiuru ir `innerHTML` klaidos
   isaiskejo tik tada, kai jas pamate savininkas. Del to paleistas SARGAS.
3. **Trys skirtingi taisymai vietoj vieno atsakymo.** Savininkas: „paprasiau
   normalu klausima sutvarkyti, o tu 3 variantus duodi". Teisinga: pries
   taisant reikia isitikinti, kad supratau klausima — ne po to.
4. **Dokumentai atidelioti i „sesijos pabaiga", kuri neateina.** Nuo dabar —
   po kiekvieno uzdaryto bloko, ne dienos gale.

---

### S711-S713 — MYGTUKAS, MASINIS SUDELIOJIMAS, 261 PREKE SUTVARKYTA (2026-08-13)

**S711 — MYGTUKAS „Sudelioti i lentyneles" (uzdaryta).**
Savininkas: „per sudejimo mygtukus niekas neveikia." Narsykles testas parode:
serveris grazina `success` ir „sudeta i 5 skiltis" — t. y. tekstas sudeliojamas
ir irasomas i baze TEISINGAI. Bet ekranas lieka senas: rengykleje matomas
ankstesnis tekstas, „Kaip mato pirkejas" nepersipiesia. Zmogui tai atrodo
lygiai taip pat, kaip neveikiantis mygtukas — ir jis teisus, nes rezultato
nemato.
Priezastis: rezultatas rasomas i TinyMCE, o sis ne visada inicializuotas.
**Katalogas v8.2:** po sekmingo sudeliojimo kortele perpiesiama is serverio.

**S712 — MASINIS SUDELIOJIMAS (snippetas ID 2868).**
DRY per visas 3 470 prekiu: 1 677 maistas, 761 jau tvarkinga, 406 butu
pagerinta, 510 neatpazinta.

Savininko klausimas pries APPLY: *„serimo instrukcijose kai kur yra tik tekstas,
ne lenteles — kaip susidelios?"* Patikrinta, ir atsakymas pasirode NEVIENODAS.
Todel ivestos DVI GRUPES:

| Grupe | Kiek | Kas tai | Elgesys |
|---|---|---|---|
| SAUGU | 293 | tekstas arba lentele su eiluciu luziais | sudeliojama |
| RIZIKINGA | 113 | lentele sulipusi i VIENA eilute | **neliieciama** |

Rizikos pozymis: serimo tekste ≥8 skaiciai, bet ≤3 eilutes — vadinasi lentele
prarado struktura. Irasius tokia, pirkejas matytu „Svoris 1,5 2 3 4 5–6 7–12
13–20 10 kg 35–70 g" — neskaitoma kose. Josera Young Star, Ontario sausas,
DOGOTEKA.

**S713 — APPLY.** Pirma 20 (juodrasciai), tada 12 prekyboje esanciu — savininkas
apziurejo parduotuveje: „atrodo viskas gerai". Tada likusios porcijomis po 70.

**Rezultatas: 261 preke sutvarkyta.** Serimo instrukcija turi **1 054** is 1 677
maisto prekiu (buvo 761). Grupe SAUGU isteko iki nulio.

**Dvi klaidos APPLY eigoje (abi istaisytos):**
1. Pasiekus riba ciklas tesdavosi per visas 3 470 prekiu — uzklausa nespedavo
   per laiko limita. Pakeista i `break`.
2. `Fatal error: Call to private method Petshop_Katalogas::aprasymo_kopija()`.
   Snippetas negali kviesti privataus kortelės metodo. Kopija rasoma tiesiogiai
   tuo paciu formatu (`_ps_aprasymo_bak`, iki 5 versiju) — „Grazinti ankstesne"
   kortelėje veikia visoms 261.

**LIEKA:** 113 rizikingu (reikia lentele ATKURTI, ne perkelti — tam tinka
serimo lenteliu baze, 525 patikrintos) ir 510 neatpazintu (norma paveiksleliuose
arba visai kitokia forma).

---

### S709-S710 — SERIMO LENTELES NESUBEGA I SAVO SKILTI

Savininkas rado dvi SKIRTINGAS teksto formas, kuriose serimo norma neatpazistama.

**Forma A (Quattro sausas, #16718): antraste SAKINIO VIDURYJE.**
„...greipfrutu ekstraktas). Serimo rekomendacijos: 2kg: 23-33g; 3kg: 30-43g..."
Skaidytojas antrasciu ieskojo tik eilutes pradzioje. **Gavimas v1.12:** pries
skaidant zinoma antraste su dvitaskiu perkeliama i naujos eilutes pradzia.
Dvitaskis butinas — be jo „serimo instrukcija nurodyta ant pakuotes" suskaldytu
sakini.

**Forma B (Quattro sterilizuotoms katems): ANTRASTES NERA ISVIS.**
Norma pateikta lentele: „Suaugusios kates svoris, kg / 2 3 4 5 6 7 8 /
Pasaro dienos norma, g / 24-35 32-46 ...". **Gavimas v1.13:** atpazistama pati
lentele — eilute su „dienos norma", „paros norma", „svoris, kg", „kuno svoris".
Skaiciu eilutes po jos sekcijos neuzdaro.

Kartu sugrieztintas saraso kriterijus: anksciau uzteko dvieju kableliu, todel
„Pasara laikykite vesioje, sausoje, nuo saules apsaugotoje vietoje" likdavo
Analitinese. Dabar sarasui reikia IR skaiciu.

**Mastas (dry-run per 400 prekiu su serimo tekstu):**
| Etapas | Serimas atpazintas |
|---|---|
| pries taisymus | ~230 |
| po v1.12 | 271 / 385 |
| po v1.13 | **307 / 385** |

Lieka **78 prekes** — treciai teksto formai (norma paveiksleliuose arba visai
kitais zodziais).

**NEUZDARYTA — savininkas: „niekas nepasikeite, per sudejimo mygtukus niekas
neveikia".** Skaidytojas SERVERYJE veikia (patikrinta jo paties tekstu), bet
mygtukas „Sudelioti i lentyneles" kortelėje rezultato neduoda. Priezastis
NENUSTATYTA — tai pirmas rytojaus darbas.

---

### RYTOJ (2026-08-13) — PIRMI TRYS DARBAI

**1. KODEL NEVEIKIA MYGTUKAS „Sudelioti i lentyneles" (blokuoja viska kita).**
Skaidytojas veikia, mygtukas — ne. Tikrinti tokia tvarka, nespeliojant:
- ar `ajax_aprasymas` gauna `veiksmas=sudelioti` (JS siuncia ar ne);
- ar tekstas paimamas is rengykles (`rengyklesTurinys()`) — gali grazinti
  tuscia, kai TinyMCE dar neinicializuotas;
- ar `_ps_aprasymas_uzrakintas` neblokuoja irasymo;
- ar HTML → tekstas konversija kortelėje palieka eilucių lauzymus: `<table>`
  eilutes be `<br>` sulimpa i viena eilute ir lentele tampa neatpazistama.
  **Tai tiketiniausia priezastis** — savininko tekstas atejo kaip lentele.

**2. MASINIS SUDELIOJIMAS PER SNIPPETA (savininko prasymas).**
Mygtukas taiso po viena; skolų — simtai. Reikia:
- DRY: visos maisto/papildu prekes, kuriu `Serimo instrukcija` sekcijos NERA,
  bet tekste yra normos pozymiu. Ataskaita: id · pavadinimas · kokia forma
  rasta · ka sudetu (pirmi 80 simboliu);
- savininko perziura;
- APPLY atskirai, su `aprasymo_kopija()` kiekvienai prekei (grazinimas per
  „Grazinti ankstesne" kortelėje);
- po to — pakartotinis matavimas (307/385 turi kilti).
**Nepradeti APPLY be DRY perziuros.**

**3. TZ MASTER v1.72** — uzrakinti tris siandienos taisykles:
- kortele = viskas apie viena preke;
- rankinis sprendimas nustelbia automatika (`_ps_ranka_isimta`);
- du atskiri likuciai: TIEKEJO (`_stock`) ir AV (`_own_stock_qty`), partijos ir
  galiojimai — tik AV.

---

### ATVIRA PO SIOS SESIJOS

- **FEFO nurasymo patikra SASAJOJE** — serveryje patikrinta (likutis 6→3,
  partija 4→0), naršykleje testas nutruko
- Akciju langas naudoja sena kalendoriu (S702 skola)
- `ajax_partija_nauja` endpoint'as liko be sasajos (v8.0 ji pakeite likucio blokas)
- Sargo etalonas: VF/ZB prekems AV likutis DABAR rodomas (v8.0) — etalona
  reikia atnaujinti
- Is ankstesniu: snippetu valymas · Dogoteka RRP (~14 prekiu) · PVM gyvame
  petshop.lt · 796 prekes be savikainos · aprasymu sablonas Gavime

---

## 2026-08-11 (rytas) — GERIAUSIA IKI · JUDEJIMAS · PUBLIKAVIMO VARTAI [S758-S765]

Sesija prasidejo nuo „geriausia iki", bet savininko patikslinimai atskleide
tris skirtingas problemas, is kuriu dvi buvo sistemines.

### IDIEGTA

| Failas | Versija | Ka issprende |
|---|---|---|
| petshop-katalogas.php | 5.0 → **5.8** | geriausia iki · judejimas · paleidimo data · partiju redagavimas · skolu isskaidymas · savikainos saltiniai |
| petshop-akcijos.php | 1.6 → **1.8** | ketvirtas taikinys „Geriausia iki" + kelias is katalogo |
| petshop-pilnumas.php | 1.1 → **1.2** | pilnas truksta raktu sarasas filtravimui |
| petshop-vartai.php | **1.0** (naujas) | publikavimo vartai VF/ZB prekems |

---

### S758 — GERIAUSIA IKI (katalogas v5.1, akcijos v1.7)

**Recon pries darba:** `Petshop_Partijos` v1.1 veike, datos buvo, FEFO veike,
`artimiausias_galiojimas()` egzistavo. **Truko VIETOS**, kur pamatytum, KURIOS
prekes baigiasi: funkcija atsako apie VIENA preke, o sarasui to neuztenka.

**Sprendimas:** `partiju_datos()` — vienas SELECT visoms prekems (per preke
butu 1 400 uzklausu). Imamos TIK partijos su likuciu: pasibaigusi data ant
tuscios partijos yra istorija, ne problema.

Akcijose — ketvirtas taikinys „Geriausia iki" su dienu lauku. Pasibaigusios
datos NEITRAUKIAMOS: tokia preke nurasoma, ne pardavinejama su nuolaida.

---

### S759 — JUDEJIMAS IR GALIOJIMAS ATSKIRTI (v5.2)

**Savininko pastaba:** „tu maisai du skirtingus dalykus: 1. Prekiu judejimas
2. Prekiu galiojimas".

Buvau sudejes juos i viena „Sandelio" kruva. Tai skirtingi klausimai:

| | Judejimas | Galiojimas |
|---|---|---|
| Saltinis | pardavimu istorija | `ps_partijos` datos |
| Kam taikoma | AV prekems | toms, kurioms data IVESTA |
| Sprendimas | nuolaida, rinkinys, isemimas | trumpo galiojimo akcija |

**„Negyvos atsargos" pervadinta** — terminas buvo pazodinis „dead stock"
vertimas, lietuviskai skambejo kaip kapines ir nesake, ka matuoja. Dabar
„Neparduodama ≥ N d." su pasirenkama riba (60/90/180/360 arba nuo–iki):
60 dienu be pardavimo skanestams jau signalas, aksesuarams — norma.

**PUBLIKAVIMO MOMENTAS.** `post_date` netiko: dev bazeje 1 605 prekes
„sukurtos" 2026-06-04 ir dar 927 — 06-06. Tai migracijos importas, ne
publikavimas, o preke gali menesi guleti juodrasciuose (savininko pastaba).
Idėtas `_ps_publikuota` per `transition_post_status`, fiksuojamas tik PIRMA
karta — kitaip uztektu vieno „isimti/grazinti" ir preke vel atrodytu nauja.

**Skaiciavimas:** dienos nuo PASKUTINIO pardavimo, o jei niekada neparduota —
nuo publikavimo. Vienas skaicius vietoj triju lauku (30/90/365), todel veikia
bet kokia riba.

---

### S760 — PALEIDIMO DATA KAIP ATSKAITOS TASKAS (v5.3)

**Savininko pastaba:** „mes gal uz menesio tik pasileisme, o statistika rodys,
kad neparduodama 100 d." — teisinga ir svarbi.

v5.2 skaiciavo nuo publikavimo, o migruotoms prekems tai IMPORTO diena.
Paleidus parduotuve spali, pirma diena visas katalogas atrodytu neparduodamas
keturis menesius, ir eile taptu beverte nuo starto.

Dabar atskaitos taskas — **velesnis is dvieju**: prekes publikavimo ir
parduotuves PALEIDIMO (`ps_paleidimo_data`). Kol paleidimo diena neatejo,
skaicius **neskaiciuojamas isvis**: klausimas „kodel neparduodama" prie
uzdarytos parduotuves prasmes neturi.

**Patikra abiem scenarijais:**

```
Paleidimas 2026-10-01 (ateityje), migruota 06-04, neparduota  → null
  ta pati, bet pardavimas 05-01                                → 102 d.
Paleidimas 2026-06-20 (praeityje), migruota 06-04              → 52 d.
  publikuota 08-01                                             → 10 d.
  pardavimas 08-05                                             → 6 d.
```

Ekrane: „Neparduodama ≥ 60 d." 745 → **0**.

**PRIES LAUNCH:** `ps_paleidimo_data` nustatyti tikslia data.

---

### S761 — GALIOJIMO FILTRAI IR KELIAS I AKCIJA (v5.4, akcijos v1.8)

Trys eiles vietoj dvieju: **„Pasibaige" atskirai** — tokia preke nera
nuolaidos klausimas, o nurasymo; maisyti ja su dar parduodamomis reikstu
siulyti pirkejui netinkama preke. Sioje eileje akcijos mygtuko NERA.

Ribos keiciamos is lango: ≤30 · ≤60 · ≤90 · ≤180 arba „skubu iki / stebeti
iki". Sausam maistui 90 d. normalu, sviežiai produkcijai per ilgai.

**Mygtukas „Sukurti trumpo galiojimo akcija →"** perduoda `?gi=N` i Akciju
langa, kur uzpildomas pavadinimas, taikinys, dienos ir laikotarpis. Be jo eile
butu tik sarasas: problema matai, bet kad ka nors padarytum, tektu is naujo
rinkti tas pacias prekes kitame lange.

---

### S762 — PARTIJOS LAUKAI REDAGUOJAMI (v5.5)

**Savininko pastaba:** „nera funkcijos taisyti galiojimo datos — mes
kalbejome, visi laukai turi buti redaguojami, isskyrus koda".

Partijos is tos taisykles buvo iskritusios: duomenys ivedami Gavimo lange ir
po to netaisomi niekur. Du realus pagrindai: priimant sunta lengva suklysti,
o tiekejas gali PRATESTI termina — teisetas sprendimas, kuriam sistema neturi
trukdyti.

**Redaguojami TRYS:** likutis, savikaina, geriausia iki.
**Neredaguojami:** gavimo data, tiekejas, gautas kiekis — tai siuntos faktai,
turintys sutapti su saskaita.

**Patikra:** data 2026-08-03 → 2027-02-11, DB irasyta, preke is „Pasibaige"
eiles iskrito (1 → 0).

**Atsakymas i savininko klausima:** pardavimo blokavimo NERA. Data yra
informacija administravime; preke lieka parduodama, likutis nekeiciamas.
Vienintelis apribojimas — pasibaigusios neitraukiamos i automatine akcija.

---

### S763 — DUOMENU SKOLOS ISSKAIDYTOS (v5.6/v5.7, pilnumas v1.2)

**Savininko pastaba:** „Duomenų skolos — čia labai abstraktu, išskirk
savikainas; taip patogiau: atsidarai prekes, sutaisai, jos dingsta iš tos
kategorijos".

Skaicius 1 960 nesake, KA daryti. Recon parode sudeti: EAN 1 427,
savikaina 744, serimo lentele 502, pakuotes dydis 213, analitines 211,
serimo instrukcija 205, aprasymas 195, sudetis 156, gyvuno rusis 45.

**Filtravimo klieutis:** `_ps_pilnumas_truksta` yra tekstas zmogui ir
SUTRUMPINTAS („EAN ir dar 1"), todel preke, kuriai truksta serimo lenteles IR
sudeties, pagal „sudetis" nebutu rasta. Pilnumas v1.2 raso `_ps_pilnumas_kodai`
su visais raktais tarp vertikaliu bruksniu; perskaiciuota 2 726 prekems.

**v5.7 — dublikatai pasalinti.** Pirmoji versija salia esamu „Be savikainos"
(795) ir „Be EAN" (1 459) idejo dar tuos pacius is pilnumo (744 / 1 427).
Tie patys pavadinimai skirtingais skaiciais klaidina labiau nei vienas.

---

### S764 — SAVIKAINOS SALTINIAI (v5.8)

**Savininko taisykle:** „tiekejo man pateikta kaina yra mano savikaina".

Katalogas eme savikaina TIK is `ps_sources` registro; pridėta atsargine tvarka
`_cost_price` → `_vf_cost` → `_zb_cost`, vienoda sarase ir korteleje.

**RADINYS:** skaicius nepasikeite (795), nes tos prekes neturi savikainos NE
VIENAME lauke — patikrinta, 0 is ju turi `_vf_cost`/`_zb_cost`/`_cost_price`.
Skirtumas nuo pilnumo 744 yra kitos priezasties: pilnumas praleidzia
„nevertinamas" prekes (DP skelbimus, testines) — 51 preke. Abu skaiciai
teisingi, tik atsako i skirtingus klausimus.

---

### S765 — PUBLIKAVIMO VARTAI (petshop-vartai v1.0)

**Savininko klausimas:** „kokie reikalavimai publikuotom prekem — kodel VF ar
ZB preke be nuotraukos, aprasymo patenka i public?"

**Atsakymas is kodo:**

| | Vartai | Rezultatas |
|---|---|---|
| VF | `class-vf-import.php` tikrina 5 blokerius: nuotrauka, aprasymas, kaina, EAN, likutis | prekyboje be aprasymo — 10 |
| ZB | **NETURI**; WP All Import #2 `status: publish`, jokios patikros | prekyboje be aprasymo — 76 |

Visi 5 WP All Import profiliai nustatyti `status: publish`.

**1. VIENKARTINIS VALYMAS:** 86 prekes (ZB 76, VF 10) perkeltos i juodrascius.
Priezastys: be aprasymo 83, be aprasymo IR nuotraukos 3, vien be nuotraukos 0.
Patikra: VF/ZB prekyboje 1 643 → 1 557; juodrasciai 1 040 → 1 126.
**AV NELIESTA** (savininko sprendimas).

**2. NUOLATINE TAISYKLE** (`petshop-vartai.php`): VF/ZB preke be aprasymo
(< 120 simboliu) arba be nuotraukos keliauja i juodrascius. Taikoma VISOMS,
ne tik naujoms — sistema dar nepaleista, todel visos de facto naujos.

Be sio modulio vienkartinis valymas beprasmis: ZB importas veikia kas valanda
ir tas pacias prekes vel publikuotu.

- `pmxi_saved_post` — patikra iskart po importo irašo
- cron kas valanda — turinys gali dingti ir NE per importa (istrynus nuotrauka
  is medijos, isvalius aprasyma ranka)
- **kryptis TIK viena: publish → draft.** Atgal niekada: juodrastyje preke gali
  guleti del visai kitu priezasciu, ir automatinis publikavimas jas anuliuotu
- isimtis `_ps_publikuoti_leista='taip'` — kad taisykle nebutu kalejimas

**Patikra realia preke (Eukanuba, ZB):** aprasymas istrintas → vartai grazino
i draft su zyme; atstatyta → publish, 4 406 simboliai. Isimties zyme veikia.

---

### Technines pamokos

1. **`get_post_field()` be trecio argumento taiko „display" konteksta** ir
   grazina uzkoduota HTML. Pirmoji diagnostika del to rode `&lt;p&gt;` ir
   klaidingai atrodė, kad turinys sugadintas. Raw duomenims — trecias
   argumentas `'raw'` arba tiesioginis SQL.

2. **Aprasymo ilgi matuoti TIK po `html_entity_decode`.** Dalis irasu DB
   laikomi dukart uzkoduoti; be dekodavimo tagai skaiciuojami kaip turinys ir
   tuscia preke atrodo aprasyta.

3. **Sutrumpintas tekstas netinka filtravimui.** `_ps_pilnumas_truksta`
   („EAN ir dar 1") skirtas zmogui; filtrui reikia atskiro pilno lauko.

4. **Migracijos data nera publikavimo data.** Bet kokia „kiek laiko" metrika
   po migracijos privalo tureti atskaitos taska, kitaip paleidimo diena rodo
   menesiu senuma.

5. **Vienkartinis valymas be taisykles — beprasmis**, jei duomenis atnesa
   automatinis importas.

### Aukščiausias sprendimo Nr.: S765.

### ATVIRA po šios sesijos
- **KITAS:** Rinkiniai
- **FILTRO KLAIDA:** „be sudeties" rodoma prekems, kurios turi sudeti aprasymo
  TEKSTE be atskiros antrastes (Farmina). Pilnumas ieško SEKCIJOS antrastes;
  reikia atsargines patikros pagal raktazodi tekste
- dukart uzkoduoti aprasymai (`&lt;p&gt;`) — kiek ju is viso, ar reikia masinio
  dekodavimo
- parduotuves puse: `/pasiulymai/geriausia-iki/` su noindex (TZ 38.6)
- katalogo kortele ima brenda is tuscios `pa_brendas`
- Tiekimas ir Desk dar nenaudoja `Petshop_Katalogas::navigacija()`
- 5 „svetimos" akcijos be datu (Genia, 3× Zylkene, Flexadin)
- testine akcija #1 „Ambrosia rugpjutis −15 %" juodrastyje

---

## 2026-08-10 (vakaras II) — AKCIJU LANGAS · DARBUOTOJO ROLE · VIENINGA NAVIGACIJA [S754-S757]

Sesijos tesinys po katalogo UX bloko. Trys nauji moduliai, is kuriu du —
`petshop-akcijos.php` ir `petshop-teises.php` — anksciau neegzistavo.

### IDIEGTA

| Failas | Versija | Ka issprende |
|---|---|---|
| petshop-akcijos.php | **1.6** (naujas) | akciju administravimo langas: brendas/kategorija/prekes, planavimas, gyva taisykle, LT kalendorius |
| petshop-teises.php | **1.1** (naujas) | darbuotojo role su isvalytu ekranu |
| petshop-katalogas.php | 4.9 → **5.0** | akcijos indikatorius korteleje · vieninga navigacija |
| petshop-gavimas.php | 1.1 → **1.2** | vieninga navigacija |

---

### S754 — AKCIJU ADMINISTRAVIMO LANGAS (petshop-akcijos v1.0–v1.6)

**Uzduotis (savininko formuluote):** „kada butu galima uzdeti akcijas Brendui,
kategorijai ... atskiroms prekems, planuoti akcijas" — t. y. ADMINISTRAVIMO
irankis, ne kliento pusė.

#### Pries tai — recon (empirinis)

`petshop-promotions` v1.1 (S83, 2026-06-09) yra ir aktyvus, bet panaudotas
vieną kartą ir paliktas:

```
18 prekiu su _sale_price
15 — vienas batch sale_20260609_195007_514 (Ambrosia)
14 — datos PASIBAIGUSIOS, o _sale_price meta liko kaboti
 4 — akcijos kaina BE DATU → akcija amzina, niekas jos neisjungs
 0 — kuponu
```

Priezastis strukturine: senasis modelis yra SNAPSHOT. Atrenki filtrais →
apply iraso `_sale_price` → **taisykle dingsta**, lieka tik prekes su vienoda
batch zyme. Nera ko isjungti, nes nera ko.

#### Rinkos peržiura (administravimo pusė)

Du nesuderinami modeliai:

| Modelis | Kas saugoma | Naujos prekes |
|---|---|---|
| Snapshot (Shopify, musu senasis) | kaina prekeje | NEpatenka |
| Taisykle (Magento Catalog Price Rule) | salygos + laikotarpis + prioritetas | patenka automatiskai |

Magento: jei preke atitinka kelias taisykles, taikoma auksciausio prioriteto;
yra „Stop Further Rules Processing". Zooplus: prenumerata 15 % pirmam ir 5 %
kitiems, savaitiniai Special Offers, kategoriju savaites. Chewy: Autoship su
~70 % adopcija. Bendras rastas — **kampanija, ne pavienė akcija**, ir nuolaida
prirista prie elgsenos, ne prie kainos etiketes.

#### SPRENDIMAS — HIBRIDAS

Taisykle SAUGOMA (kad veiktu planavimas ir naujos prekes), bet
MATERIALIZUOJAMA i `_sale_price`, nes Kaina24/kainos.lt feed'ai,
`wc_product_meta_lookup`, `is_on_sale()` ir filtrai skaito butent ji.
Dinamine kaina reikstu perrasyti visa ta grandine.

**Savininko sprendimai:** gyva taisykle (naujos prekes itraukiamos
automatiskai); promo guard tikrinamas PIRMA.

#### PROMO GUARD — PATIKRINTAS KODE (blokeris)

Buvo klausimas: ar ZB/VF importas, perskaiciuojantis kainas kas valanda,
netrina akciju. Atsakymas — NE:

- **ZB** (`petshop-xml.php` 1122–1174): reprice keicia TIK `_regular_price`;
  kai sale aktyvi, `_price` lieka = `_sale_price`. Jei nauja reguliari
  nukristu zemiau akcijos — blokuojama (`reprice_blocked_by_sale`).
- **VF** (`class-vf-import.php`): guard per `_petshop_sale_batch` →
  `vf_reprice_blocked_by_promo`.

**KRITINE SUDERINAMUMO SALYGA:** VF guard remiasi TIK `_petshop_sale_batch`
zyme. Naujasis modulis ja RASO — be jos VF importas nusluostytu akcijas per
pirma valanda.

#### Modelis

Dvi lenteles: `ps_akcijos` (taisykle) + `ps_akciju_prekes` (materializacija su
BUVUSIA busena kiekvienai prekei — be jos nuemimas butu spejimas, ne
atstatymas).

Busenos: Juodrastis → Suplanuota → Aktyvi → Pasibaigusi → Archyvas.
Cron `ps_akcijos_valanda` kas valanda ijungia suplanuotas, isjungia
pasibaigusias, o gyvoms — pertikrina atranka.

**Pabaigos data PRIVALOMA.** Butent jos nebuvimas paliko 4 amzinas akcijas.

Taikiniai: brendas · kategorija (+palikuonys) · prekiu sarasas; visiems —
atributu susiaurinimas ir ISIMTYS („visa Ambrosia, bet ne 12 kg").
Konfliktai: viena preke — viena akcija, laimi auksciausias prioritetas;
konfliktas rodomas ZMOGUI pries apply, ne sprendziamas tyliai.

#### RADINYS: brendai gyvena `product_brand`, ne `pa_brendas`

Pirmoji versija atranke naudojo `pa_brendas` ir grazino **0**. Recon:

```
product_brand  122 terminai · Ambrosia = 329 · count 15
pa_brendas      62 terminai · Ambrosia = 231 · count 0   ← TUSCIAS APVALKALAS
```

Katalogo sarasas ta jau moka apeiti (`terminai()` su atsargine saka), bet
atranka pagal tuscia taksonomija tyliai grazino nuli. Dabar taksonomija
parenkama PAGAL DUOMENIS (`brendo_taksonomija()`), sarasuose — tik netusti
terminai.

**Katalogo kortele (eil. 1469) vis dar ima `pa_brendas`** — todel korteleje
brendas nesimato. ATVIRA.

#### v1.3 — „Prekiu 0" prie juodrascio

Skaicius buvo imamas TIK is `ps_akciju_prekes`, o ten irasai atsiranda tik
ITAIKIUS. Juodrastis su 15 prekiu atrode tuscias. Dabar netaikomoms akcijoms
skaicius skaiciuojamas is atrankos realiu laiku (zyme ATITINKA vs TAIKOMA), o
perziura uzsikrauna automatiskai atidarius akcija.

Plius: „N prekiu uzdeta ne per si langa" → mygtukas Parodyti isskleidzia
sarasa su datomis, kilme ir mygtuku „Nuimti akcija".

#### v1.4 — filtras, kurio nesimato

Akcija rode „8", nors Ambrosia brendas turi 15. Skaicius buvo TEISINGAS —
taikinyje issaugotas ir `pa_pakuotes_dydis`, bet sarase jo nesimate. Dabar
taikinys isvardijamas pilnai: `Brendas: Ambrosia · 2 kg`, prireikus
`· be 3 prekiu`.

**Filtras, kurio nesimato, yra blogesnis uz filtro nebuvima.**

#### v1.5 — teise `ps_akcijas_taikyti`

Akcijos KURIMAS ir perziura — visiems; IJUNGIMAS (realus kainu keitimas
katalogui) — atskira teise.

#### v1.6 — LT kalendorius ir eilutes isbraukimas

`datetime-local` piesia narsykles kalendoriu narsykles kalba: Chrome rode
„August 2026", sekmadieni dejo pirma, formatas `08/17/2026`. Savas
kalendorius: LT menesiai, savaite nuo PIRMADIENIO, ISO formatas, laiko laukas,
greiti mygtukai (Siandien · +7 · +14 · +30 · Men. pabaiga).

Perziuroje prie kiekvienos eilutes — **×**, kuris preke perkelia i ISIMTIS
(ne tik paslepia): issaugojus ji nebegris ir gyva akcija jos nebeitrauks.

#### PATIKRA (narsykle, ne teorija)

```
Ambrosia brendas −15 %  → Atrinkta 15 · Taikoma 15 · Zemiau ribos 0
                          Vid. nuolaida 15 % · Maziausia marza 17,1 %
Kalendorius             → „Rugpjutis 2026" · Pr An Tr Kt Pn St Sk · 31 diena
                          20 d. → 2026-08-20 19:12 · „+30 d." → 2026-09-09 19:12
Eilutes ×               → 1 → 0 eiluciu · isimtyse +1 · suvestine perskaiciuota
```

#### AMBROSIA TESTINES AKCIJOS ISVALYTOS

14 prekiu (batch `sale_20260609_195007_514` + pavadinime „Ambrosia") nuimtos
per WC API (`set_sale_price('')` + `save()`), atsargine kopija i
`ps_akcijos_bak_*`. Patikra: `_price` = `_regular_price` visoms, 0 neatitikimu.
Liko 5 ne-Ambrosia (Genia itvaras, 3× Zylkene, Flexadin) — savininko sprendimu
nelieciamos, langas jas rodo kaip „uzdeta ne per si langa".

---

### S755 — VIENINGA NAVIGACIJA (katalogas v5.0, gavimas v1.2)

Savininko pastaba: „gal ir cia reikia ideti virsuje Gavimas ir Akcijos".

Kiekvienas langas turejo SAVO juosta: kataloge nebuvo nei Akciju, nei Gavimo;
Akciju lange — nebuvo Gavimo; Gavime — tik „Katalogas". Zmogus, atsidures
viename lange, nematydavo kelio i kitus.

Sprendimas — ne trys juostos, o VIENAS sarasas vienoje vietoje
(`Petshop_Katalogas::navigacija()`), kuri naudoja visi moduliai:

```
PETSHOP · Katalogas · Akcijos · Gavimas · Tiekimas · Uzsakymai
```

Patikra: visi trys langai grazina ta pati sarasa, aktyvus punktas paryskintas.
Tiekimas ir Desk savo juostu dar nenaudoja bendros funkcijos — ATVIRA.

---

### S756 — DARBUOTOJO ROLE (petshop-teises v1.0 → v1.1)

**Pirmine formuluote suprasta klaidingai.** v1.0 padaryta kaip SAUGUMO
sprendimas (apribojimai, draudimai). Savininko patikslinimas: „as specialiai
sakiau padaryti tokia prieiga, kad zmogus nesipainiotu pradziai, o ne del to,
kad kazko nematytu ar neistrintu".

**v1.1 — perdaryta i PAPRASTUMO sprendima:**

| | v1.0 | v1.1 |
|---|---|---|
| Meniu valymas | juodasis sarasas (salinti YITH, Mokejimus…) | **baltasis sarasas** |
| Meniu punktu | 11 | **4** |
| Po prisijungimo | Skydelis | **tiesiai i Kataloga** |
| Svetimi pranesimai | matomi | **0** |
| Siuksline | uzdrausta | **leidziama** |

Baltasis sarasas pasirinktas todel, kad juodasis pralaimi kiekvienam naujam
pluginui: idiegus dar viena, jo meniu punktas darbuotojui atsiranda savaime.

**Vienintelis tikras draudimas:** galutinis trynimas is siuksliines. I
siuksline mesti galima (atstatoma vienu paspaudimu), o galutinis trynimas
panaikina SEO nuoroda, uzsakymu istorija ir tiekejo susiejima — to neatsuka
nei zurnalas, nei atsargine kopija.

Patikra realia darbuotojo paskyra (Playwright, vartotojas `testuotojas` #75):

```
meniu:        Petshop uzsakymai · Petshop prekes · Failai · Profilis
submeniu:     Petshop prekes · Gavimas · Akcijos
pranesimu:    0
index.php  →  nukreipe i admin.php?page=ps-katalogas
wc-settings, plugins.php, users.php, options-general.php, tools.php → BLOKUOTA
gali:  manage_woocommerce · edit_products · publish_products · upload_files · ps_akcijas_taikyti
negali: manage_options · activate_plugins · edit_users · edit_themes · export
```

---

### S757 — „GERIAUSIA IKI" BUKLES RECON

Savininko klausimas: „mes dareme geriausia iki, bet tu jas kazkur isemei ir
paslepei". Recon parode: **niekas neisimta, bet nera vietos, kur pamatytum**.

**Veikia:**
- `Petshop_Partijos` v1.1 · lenteleje 3 partijos, VISOS su data
  (2027-06-30, 2027-09-30, 2028-01-31), viena su PLN ir kursu 4,31
- Gavimo lange — data prie kiekvienos eilutes + masinis irasymas
- Prekes korteleje — blokas „Partijos" su „Geriausia iki" ir liko menesiu
- Variklyje: `artimiausias_galiojimas()`, FEFO nurasymas

**Nera:**
1. Katalogo eiles „Arteja geriausia iki" (esama „Baigiasi greiciau nei
   tiekiama" yra pardavimu greitis, ne datos)
2. Bendro saraso — `artimiausias_galiojimas()` atsako apie VIENA preke, bet
   klausimo „kurios baigiasi per 90 d." niekas neuzduoda
3. Parduotuves puses: kategorijos `geriausia-iki` ir `trumpos-datos`
   NEEGZISTUOJA (TZ 38.6 numate `/pasiulymai/geriausia-iki/` su noindex)
4. Trumpu datu ispardavimo (TZ 38.5)

**SPRENDIMAS RYTDIENAI:** ketvirtas punktas beveik nemokamas — akciju modulis
jau turi perziura, eiluciu koregavima, marzos grindis, laikotarpi ir isimtis.
Truksta KETVIRTO taikinio tipo salia „Brendui · Kategorijai · Atskiroms
prekems" — **„Geriausia iki"** su lauku „datos artimesnes nei N dienu".
Tada trumpu datu ispardavimas tampa iprasta akcija.

---

### Technines pamokos

1. **Meta reiksmes tikrinti, ne speti.** `product_brand` vs tuscias
   `pa_brendas`; `belcor_tofu` vs `belacor`. Abu kartus kodas „veike" ir
   tyliai grazino nuli.

2. **PHP vienguba kabute JS eiluteje** — sioje sesijoje sudege dar du kartus
   (`feed'ai`, CSS selektorius `'.pr[data-id="'+id+'"]'`). Nuo dabar pries
   kiekviena siuntima: `php -l` PLIUS JS bloko istraukimas ir `new Function()`
   patikra.

3. **Code Snippets REST kartais grazina PHP warning pries JSON** →
   `r.json()` nulūžta ir runas krenta pries darba. Runner'yje privalomas
   `jsonSafe()` (randa pirma `[` arba `{` ir parsina nuo ten).

4. **Skaicius be konteksto meluoja.** „Prekiu 0" prie juodrascio ir „8" vietoj
   15 — abu buvo techniskai teisingi, bet be paaiskinimo atrode kaip klaida.

5. **Baltasis sarasas > juodasis** visur, kur valomas UI: juodasis pralaimi
   kiekvienam naujam pluginui.

### Aukščiausias sprendimo Nr.: S757.

### ATVIRA po šios sesijos
- **RYTOJ:** „Geriausia iki" (ketvirtas akciju taikinys + katalogo eile) ir
  Rinkiniai
- katalogo kortele ima `pa_brendas` (tuscia) — brendas korteleje nesimato
- Tiekimas ir Desk dar nenaudoja `Petshop_Katalogas::navigacija()`
- 5 „svetimos" akcijos be datu (Genia, 3× Zylkene, Flexadin) — laukia
  savininko sprendimo
- testine akcija #1 „Ambrosia rugpjutis −15 %" juodrastyje — po darbuotojo
  testavimo trinti
- savikainos kilmes zyma korteleje · atributu kilmes zyma (parseris vs ranka)
- akciju rezultatu suvestine po pabaigos (kiek parduota akcijos metu vs pries)

---

## 2026-08-10 (vakaras) — KATALOGO UX SESIJA: v4.2–v4.8 [S747-S753]

Sesija prasidejo pastabu prasymu, o virto astuoniomis versijomis. Pirmos
keturios ejo per lengvai — pataisiau tai, ka pats siuliau, ir pranesiau
„padaryta". Savininko atsakymas: „nesuprantu ka tu pataisei — mano manymu
nieko". Buvo teisus: siuliau tai, kas jau padaryta v4.1, o realiai reikalingi
darbai (atributai, nuotraukos) gulejo neliesti nuo ankstesniu sesiju.

**Sesijos pamoka Nr. 1:** pastabu sarasas, sudarytas SKAITANT koda, o ne
DIRBANT su langu, duoda patvirtinimus, ne radinius. Tris kartus is eiles
„padaryta" reiske „ideta i faila", ne „veikia ekrane".

**Sesijos pamoka Nr. 2:** v4.6 ivede regresija (`height:auto`), kuria pastebejo
savininkas, ne as. Vizuali patikra buvo atlikta — bet tikrinau TAI, KA
TAISIAU, o ne ar nesulauzyta kazkas salia.

### IDIEGTA

| Versija | Ka issprende |
|---|---|
| v4.2 (S747) | `$kat_tipas` naudotas pries apibrezima → maisto atributai kortelėje niekada nesirode; sandelio spalvos 3 → 7 saltiniams; gyva marza; savikainos ispejimas |
| v4.3 (S748) | TinyMCE `table` priedas, kurio WP komplekte NERA → raudona klaidos juosta per visa ekrana |
| v4.4 (S749) | paieskos laukas juodas ant juodo; neirasytu lauku geltona zyma; Enter uzuomina; SKU/EAN kopijavimas |
| v4.5 (S750) | atributai ir nuotraukos redaguojami VIETOJE (buvo: „keiciami WooCommerce puslapyje") |
| v4.6 (S751) | kortele `fixed` — atsidaro nuo virsaus; pavadinimas redaguojamas; SKU spyna |
| v4.7 (S752) | v4.6 regresijos taisymas (`height:auto` nukirto puse korteles); „Ikelti nauja" atskirai; nuotrauku atsaukimas |
| v4.8 (S753) | neirasytu pakeitimu juosta + uzdarymo klausimas su TRIMIS pasirinkimais |

Gavimas: v1.0 → **v1.1** (sandelio spalvu palete, ta pati kaip kataloge).

---

### S747 — UX AUDITAS: RASTA TYLI KLAIDA (v4.2)

Auditas turejo buti kosmetinis, bet atskleide klaida, kuri veike nuo v3.8:

```php
$tipas_a = $kat_tipas['tipas'];        // 1333 eil. — NAUDOJAMA
...
$kat_tipas = self::sekciju_lukesciai(...); // 1367 eil. — APIBREZIAMA
```

34 eilutes tarpo. `$tipas_a` visada buvo `null`, todel maisto atributai
(baltymu saltinis, amzius, grudai, monoprotein, spec. mityba, veisles dydis)
i kortele NEPATEKDAVO, o kiekvienas atidarymas kele PHP warning. Kortelėje
matesi tik du bendrieji atributai — ir atrodė, kad taip ir turi buti.

**Sandelio spalvos:** `.sand.s_*` klases turejo tik AV/VF/ZB. Quattro (65
prekes), belcor_tofu (62), Prins (43), Ambrosia (15) susiliedavo i pilka.
Pridetos visos; ta pati palete perkelta i Gavimo langa (v1.1).

**RADINYS:** pirmasis bandymas naudojo `belacor`, o tikroji `_ps_sandelis`
reiksme yra **`belcor_tofu`**. CSS niekada nebutu suveikes. Rasta tik todel,
kad recon grazino tikras meta reiksmes su skaiciais.

**Gyva marza:** kortelėje perskaiciuojama berasant (patikra: 19,9 % → 36,0 %
be Enter). **Savikaina nesuvesta** → raudona pastaba vietoj tuscio lauko.

---

### S748 — RENGYKLES KLAIDA (v4.3)

Savininkas: „matau tik klaidas." Kataloge kabojo raudona WP juosta per visa
ekrano auksti:

```
Failed to load plugin: table from .../tinymce/plugins/table/plugin.min.js
```

v4.1 rengykle prase priedo `table`. **WordPress komplekte tokio priedo nera**
(yra lists, link, paste, wordpress, wplink). Pasalintas is `plugins` ir is
`toolbar1`.

**Kritine pamoka:** ta pacia juosta MACIAU savo paties screenshot'e valanda
anksciau — vertikalus tekstas kaireje — ir palaikiau ja apkarpytu stulpeliu.
Screenshot'as nera patikra, jei ziurima tik i ta vieta, kuri taisyta.

---

### S749 — MATOMUMAS IR NEPRARANDAMI PAKEITIMAI (v4.4)

Savininkas: „virsuje paieskos laukas juodas, net nesimato kur ka irasyti."

Faktas: `background:#141a18` ant juostos `#1d2422`. Juoda ant juodos.
Dabar baltas laukas su lupa (patikra: `rgb(255,255,255)`).

Plius: pakeistas laukas nusidazo geltonai; „Enter irašo · Esc atstato"
uzuomina; SKU/EAN kopijavimas vienu paspaudimu; „Trūksta: …" — gintarinis
akcentas vietoj pilkos smulkmenos.

---

### S750 — ATRIBUTAI IR NUOTRAUKOS VIETOJE (v4.5)

Savininkas: „jokio atributu redagavimo, nuotrauku — kur jau n kartu kalbeta,
NIEKAS nepadaryta."

Iki siol kortele rode atributus su prierasu „keiciami WooCommerce redagavimo
puslapyje" — t. y. lauk is lango, i kuri ka tik atejai. Nuotrauku skirtukas
buvo failu vardu sarasas.

**Atributai:** „keisti" → pasirinkimas → Irasyti. Kelias reiksmes turintys
(baltymai, spec. mityba, amzius) — varneles; kiti — pasirinkimas.
Terminai priskiriami **TIK per term_id** (slug kolizija „1,5 kg"/„15 kg"),
registruojama `_product_attributes`, valomi WC transientai — be sio triju
zingsniu rinkinio atributas neissilaiko.

**Nuotraukos:** pagrindines keitimas/salinimas, galerijos papildymas, ★
(padaryti pagrindine), × (ismesti), ← → (tvarka), alt tekstas. Keiciant
pagrindine senoji nedingsta — keliauja i galerijos pradzia.

Patikra realiu veiksmu: „Šunims" → „Graužikams" (irasyta) → atgal „Šunims".

---

### S751 — KORTELE NUO VIRSAUS, PAVADINIMAS, SKU SPYNA (v4.6)

Savininkas: „prekes korteles langas atsidares matosi ne nuo virsaus."

Priezastis buvo ne ten, kur atrode: `scrollTo(0,0)` suveikdavo, bet **iskart
po jo** `scrollIntoView` ant saraso eilutes vel nustumdavo langa zemyn, o
`sticky` kortele sekdavo paskui. Sprendimas: kortele `fixed`.

**Pavadinimas** redaguojamas; slug (`post_name`) SAMONINGAI nekeiciamas —
jis indeksuotas, keitimas reikstu 301 grandine.

**SKU uzrakintas** (savininko klausimas: „prie ko viskas risasi, ar as
neteisus?" — teisus). Prie SKU kabo ps_sources registras, tiekeju XML
sutapdinimas, uzsakymu eilutes, kainu palyginimo feed sarasai. Ne visiskai:
~1 175 legacy ir naujoms prekems koda suvesti reikia, todel spyna nuimama
samoningu veiksmu su ispejimu, kas butent nutruks.

---

### S752 — v4.6 REGRESIJA + NUOTRAUKU SAUGIKLIAI (v4.7)

Savininkas: „Aprasymo langas dingo puse lango informacijos."

**Priezastis — mano paties v4.6 kodas:**

```css
position:fixed; top:32px; bottom:0; height:auto !important;
```

Pagal CSS: jei `height` yra `auto`, o `top` ir `bottom` abu nustatyti, tai
**`bottom` IGNORUOJAMAS**, o aukstis skaiciuojamas pagal turini. Kortele
isaugo iki 1161 px prie 1050 px ekrano, vidine slinktis mire
(`scrollHeight == clientHeight`) ir apatine dalis liko nukirsta ir
NEPASIEKIAMA. Taisymas: `height: calc(100vh - 32px)`.

**„Ikelti nauja" atskirai:** buvo vienas mygtukas „Pakeisti…", atidarydavęs
medijos biblioteka — atrode, kad ikelti naujos apskritai negalima. Dabar
„Ikelti nauja…" (atsidaro ties ikelimu) ir „Pasirinkti is medijos…".

**Nuotrauka nebekeiciama tyliai:** pries — klausiama, po — juosta su
„Atsaukti", grazinancia buvusia. Buvusios ID rasomas i ivykiu zurnala
(iki tol raso tik `tapo` — todel savininko pakeitimo nebuvo galima atsekti).

**ATSTATYTA:** preke #34500 (DP-83724-6) — pagrindine buvo tapusi svetima
`ryziu-suktinukai-apvynioti-antiena.jpeg`, galerijoje gulejo tikroji
`dp-clean-34500.jpg`. Grazinta; svetima nuimta nuo prekes, is medijos
NETRINTA.

---

### S753 — NEIRASYTI PAKEITIMAI (v4.8)

Savininkas: „kodel uzdarant nepaklausia ar issaugoti duomenis? Ne, dabar
neaisku."

Trys atskiros klaidos viename mechanizme:

1. **Sargas nepilnas.** Kabejo tik ant × ir ←/→. Uzdarant **Esc** klavisu
   arba paspaudus **kita preke sarase** kortele persikraudavo TYLIAI.
2. **Klausimas neteisingas.** `confirm()` teturi du mygtukus → buvo galima
   tik „prarasti" arba „likti". **Issaugoti nebuvo kaip.**
3. **Irasymas nematomas.** Vyko per Enter, kurio nesimato.

Dabar: juosta korteles apacioje „Neirašyta: N · Kaina su PVM" su
[Irašyti] [Atmesti]; uzdarymo langas su TRIMIS pasirinkimais (Grizti /
Uzdaryti neissaugojus / Issaugoti ir uzdaryti) ir ivardytais laukais.

**Patikra realiais veiksmais (uxs9):**

| Veiksmas | Rezultatas |
|---|---|
| 1.51 → 7.77 | juosta „Neirašyta: 1 · Kaina su PVM", laukas geltonas |
| Esc | klausimas pasirode (anksciau — tyliai uzdarydavo) |
| „Grizti i kortele" | kortele atvira, 7.77 vietoje |
| Kita preke sarase | klausimas pasirode (anksciau — tyliai persikraudavo) |
| „Uzdaryti neissaugojus" | 1.51 atstatyta, juosta dingo |
| „Irašyti" per juosta | 8.88 irasyta |
| Atstatymas | 1.51 · dev svarus |

---

### Technines pamokos

1. **`height:auto` naikina `bottom`.** Su `position:fixed` ir abiem
   `top`/`bottom` nustatytais — aukstis skaiciuojamas pagal turini, o
   `bottom` ignoruojamas. Aukstis nurodomas konkreciai: `calc(100vh - 32px)`.

2. **PHP vienguba kabute JS eiluteje.** Nutraukia PHP string'a. Sioje
   sesijoje sudege TRIS kartus: `feed'ai`, `Esc'u`, ir CSS selektorius
   `'.pskat-t tbody tr[data-id="'+id+'"]'`. Privaloma `php -l` pries kiekviena
   siuntima.

3. **Du atskiri IIFE nesimato vienas kito.** `skriptas()` ir `skriptas_v35()`
   — `atidaryk`/`dabartinis` neprieinami antrame. Tiltas per
   `window.psKatAtidaryk`.

4. **Playwright: plati `fixed` kortele dengia sarasa.** `elementHandle.click()`
   nutruksta po 30 s („subtree intercepts pointer events"). Sprendimas —
   `page.evaluate(()=>el.click())`.

5. **Meta reiksmes tikrinti, ne speti.** `belcor_tofu`, ne `belacor`.

6. **Ivykiu zurnale privalo buti `buvo`, ne tik `tapo`.** Be to negalima
   atsekti nei kas pasikeite, nei atstatyti.

### Aukščiausias sprendimo Nr.: S753.

### ATVIRA po šios sesijos
- savikainos kilmes zyma korteleje (is partiju / tiekejo / ranka + kada)
- atributu kilmes zyma (parseris vs ranka, is parserio zurnalo)
- WP branduolio `tinymce/skins/wordpress/images/style.svg` → HTTP2 klaida
  (ne musu kodas, vizualiai netrukdo)
- katalogas: masiniai veiksmai, issaugoti vaizdai, Excel, skirtukai „Kaina"
  ir „Likuciai", savikainu istorija
- atributu parseris: savininko sprendimas del kukuruzu krakmolo
- 1 222 prekes be savikainos

---

## 2026-08-10 (popietė) — KORTELE TAMPA DARBO VIETA [S742-S746]

Rytas baigesi atributu apply. Popiete — keturios katalogo versijos, visos
gimusios is savininko pastabu. Kiekviena pastaba parode ta pacia schema:
sistema turejo teisinga atsakyma, bet vienoje vietoje jo neklause.

### IDIEGTA

| Versija | Ka issprende |
|---|---|
| v3.7 (S742) | zaislui rodytas maisto antrasciu sarasas · tekstas per pilkas · EAN netilpo |
| v3.8 (S743) | serimo lentele tualetui · atributai ne pagal kategorija · nebuvo „tik kurjeriu" |
| v3.9 (S744) | kortele tik konstatavo problemas, mygtuko pataisyti nebuvo |
| v4.0 (S745) | tiekeju HTML sankla — iki 62 % teksto |
| v4.1 (S746) | WordPress rengykle vietoj HTML lauko |

Atsargines kopijos DB: `ps_katalogas_v36_bak` ... `ps_katalogas_v40_bak`.

---

### S742 — TRYS PASTABOS (v3.7)

**LOGINE KLAIDA.** Zaislui rodyta: „Antraštės, kurių ieško sistema: Sudėtis,
Analitinės sudedamosios, Priedai, Šėrimo instrukcija" — o blokas zemiau tuo
paciu metu teisingai sake „vertinama kaip aksesuarai". Du priestaraujantys
atsakymai viename lange.

Priezastis: `sekciju_lukesciai()` JAU mokejo atskirti kategorijas, bet
antrasciu sarasas buvo hardcoded, tas pats visiems. Dabar imamas is jos.
Patikra: Kamuoliukas → „Aprašymas"; JosiDog → penkios sekcijos.

**TEKSTAS.** `#6b7580` ant pilksvo fono susilieja. Pakelta iki `#3d4650`
(etiketes) ir `#2a3530` (antrastes). Savininkas apie tai prase du kartus —
pirma karta pataisiau tik maketuose, ne kode.

**EAN.** 13 skaitmenu i 172 px netilpo → 196 px + mono srifto klase.

Plius: partijos perkeltos i kaire kolona (buvo virs viso tinklelio ir
atstumdavo „Kaina ir marza" zemyn).

---

### S743 — APRASYMU LANGAI PAGAL KATEGORIJA (v3.8)

Savininkas: „tualetas??? Cia juk zaislas, jam nereikia tokiu aprasyku kaip
maistui ar skanestams."

Rasti DU serimo lenteles blokai, ir antrasis (Aprasymuose) rodesi VISIEMS —
be jokios kategorijos patikros. Todel tualetas gaudavo „Šėrimo lentelė — nėra".
Reikalavimas, kurio niekada nebus ivykdyta, nera informacija — tai triuksmas.

Padaryta: abu blokai tik maistui; filtru atributu sarasas pagal kategorija
(aksesuarui nerodomas „Baltymų šaltinis" ir „Amžius").

**„TIK KURJERIU" VARNELE.** Recon rado, kad `_ps_tik_kurjeriu` ir
`_petshop_courier_only` postmeta lenteleje NEEGZISTUOJA — kortelės kodas
tikrino tai, ko nera, todel visada rode „paštomatas galimas".

Realiai `courier_only` ateina is `Petshop_Fulfillment` bazes. Tualetui jis
grazina `false`, nors preke yra 56×39×38,5 cm — nes **jos svoris ir matmenys
sistemoje 0.0000**, ir automatika neturi is ko sprесti.

Varnele iraso `_ps_tik_kurjeriu`. Testas narsykleje: false → pazymeta →
„irasyta" → true.

**ATVIRAS PUNKTAS:** ar pristatymo metodai realiai uzsidarys checkout'e —
NEPATIKRINTA. Fulfillment sio lauko neskaito. Reikia arba ijungti i resolverio
grandine, arba prideti filtra, slepianti pastomato metodus. Tai liecia
checkout, todel nedaryta tuo paciu ypu.

---

### S744 — APRASYMAS REDAGUOJAMAS (v3.9)

Savininkas: „ir ka man dabar daryti, jei tik informacijai — tai bevertis
reikalas?"

Teisinga pastaba visai kortelei: rodziau diagnostika, o veiksmo nebuvo.
„Tekste nėra antraščių" be mygtuko yra priekaistas, ne irankis.

Padaryta: teksto laukas · „Įrašyti" · „Įterpti antraščių karkasą" (prideda
butent tos kategorijos sekcijas, esamas tekstas lieka po pirmaja) ·
„Grąžinti ankstesnę" (5 versijos).

Rasoma per `wp_update_post`, NE per `wc/v3` — pastarasis aprasymus korumpuoja.
Irasius uzdedamas `_ps_aprasymas_uzrakintas`.

Testas narsykleje: karkasas („pridėta: Aprašymas") · irasymas (63 simb.) ·
atsaukimas — visi trys.

---

### S745 — HTML VALYMAS (v4.0)

Savininkas atsiunte realu aprasymo HTML: „tu manai, kad cia imanoma kazka
koreguoti?" Ten `style="color:black !important"` prie kiekvieno elemento,
pasikartojantys `<style>` blokai, `b2b-black` apvalkalai, `<meta charset>`
viduryje turinio.

Matavimas: **62 %** to teksto buvo sankla. Farmina N&D: 4 961 → 3 565 simb.
(28 %), style atributu 23 → 0, `<style>` bloku 1 → 0.

**KRITINIS SKAICIUS:** grynas tekstas 3 114 → 3 114. Ne viena raide neprarasta.
Lenteles 1 → 1.

Dvi apsaugos: jei po valymo neliktu teksto — sustojama; jei sumazetu lenteliu
skaicius — sustojama.

**Preku su sankla: 1 545** (~40 % katalogo).

**MANO KLAIDA:** padariau mygtuka, kuri reiktu spausti 1 545 kartus.
Savininkas: „kam as turiu valyti sias siuksles? Tu gali viska sutvarkyti."
Teisus — tai fonine operacija, ne vartotojo darbas.

---

### S746 — WORDPRESS RENGYKLE (v4.1)

Savininkas po valymo: „as nepastebejau, kad kas pasikeistu."

Ir tai atskleide, kad valymas isspende ne ta problema. Narsykle tuos
perteklinius stilius ir taip ignoruodavo — pirkejas mate ta pati. O laukas ir
po valymo rode HTML, todel gramatines klaidos taisymas tarp `<td>` zymu buvo
toks pat neimanomas.

Reikejo ne trumpesnio HTML, o **normalaus teksto redaktoriaus**.

Idiegta TinyMCE: paryskinimai, sarasai, antrastes, LENTELES kaip lenteles;
„Tekstas / HTML kodas" perjungimas; iklijuojant is narsykles stiliai
numetami automatiskai (`paste_preprocess`).

Techninis niuansas: kortele ikraunama AJAX metodu, todel `wp_editor()` cia
neveiktu — rengykle paleidziama JS'u per `MutationObserver`, kai textarea
atsiranda DOM'e.

Patikra su Farmina N&D Tropical: textarea 5 030 simb. → rengykle paleista →
turinys tekstu 3 147 simb. → lentele 1 → iframe rodo skaitoma teksta,
0 JS klaidu.

---

### SAVININKO PASTABOS, DAR NEIVYKDYTOS

```
1  TUSCIOS ZYMES TEKSTE
   valymas palieka <div> be atributu, kurie rengykleje nematomi, bet HTML
   rezime kliuva. <h4> PALIKTI — jos yra sekciju antrastes, per kurias
   akordeonas skaido teksta prekes puslapyje.

2  NUOTRAUKOS IKELIMAS
   rengykleje `mediaButtons` isjungtas — ijungti.
   Plius nuotrauku skirtukas: ikelimas, tvarkos keitimas, pagrindines
   nustatymas. Dabar jis TIK rodo skaiciu — ta pati „bevertis reikalas"
   problema, kaip buvo su aprasymais.
```

### LIKO IS ANKSTESNIU DIENU

```
masinis HTML valymas    1 545 prekiu · su zurnalu ir atsaukimu
automatika naujoms      importas atveza → HTML isvalomas is karto
brendai                 137 ZB + 194 AV be zenklo, nors `_zb_brand` turi 1 059
143 prekes              atributas registruotas `_product_attributes`, be termino
68 nesutapimai          parserio siulymas skiriasi nuo esamos zymes
courier_only            varnele rasoma, bet Fulfillment jos neskaito
naujos prekes langas    maketas patvirtintas, kodo nera
Import #2               patikra, ar `_ps_sandelis` isgyveno
```

---

### PAMOKA

Keturios is penkiu siandienos popietes klaidu turejo ta pacia forma:
**sistema jau turejo teisinga atsakyma, bet vienoje vietoje jo neklause.**

```
sekciju_lukesciai()  mokejo skirti zaisla nuo maisto — antrasciu sarasas neklause
Petshop_Pilnumas     mokejo, kad aksesuarui serimo nereikia — blokas neklause
sekcijos             buvo skaidomos teisingai — bet rodomos kaip kodas
```

Todel prie kiekvieno naujo bloko verta klausti ne „ar veikia", o „ar jis
klausia to paties saltinio, kaip visi kiti".

Auksciausias decision Nr.: **S746**.

---

## 2026-08-10 — PARTIJOS, GAVIMAS, ATRIBUTAI [S733-S741]

Diena prasidejo nuo terminologijos pastabos, o baigesi partiju sistema ir
uzdarytu TZ punktu 1. Tarp ju — trys mano klaidos, kurias sugavo Raimis ir
dry-run'ai.

### IDIEGTA

| Failas | Versija | Ka daro |
|---|---|---|
| `petshop-partijos.php` | 1.1 | AV partijos su savikaina · FEFO · GPAIS pakuotes |
| `petshop-gavimas.php` | 1.0 | prekiu gavimo langas (Petshop prekės → Gavimas) |
| `petshop-parseris.php` | 1.3 | atributai is teksto · zurnalas · atsaukimas |
| `petshop-katalogas.php` | 3.6 | partijos kortelėje · pardavimu ir pakuotes skirtukai |

WPAI Import #1: `is_update_categories` ir `is_update_attributes` → 0,
`update_all_data` → no. Atsargine kopija `ps_wpai1_bak_20260810`.

---

### S733 — IMPORT #1 CIAUPAS (prevenciskai)

Raimis: „ir isztrinti prekiu zenklai ir visos problemos su ZB prekes,
skanuok ieskok problemos, manau cia tikrai degantis reikalas".

Skenas rado, kad **Import #1 (goods_clean.xml) turejo `update_all_data=yes`,
`is_update_categories=1/full_update` ir `is_update_attributes=1/full_update`**,
o jo sablone yra tik `product_brand`, `product_cat`, `product_tag`. Visi `pa_*`
i sablona neieina, todel butu trinami. Tai TA PATI schema, kaip vakarykstis
`_ps_sandelis` trynimas (S718), tik taksonomiju puseje.

Kiti profiliai (#2, #3, #5, #7) taksonomiju neliecia.

**HIPOTEZE NEPASITVIRTINO:** Import #1 istorijoje neatsiranda — jis kol kas
nieko netrina. Taciau tai buvo uztaisytas ginklas, todel ciaupas uzsuktas
prevenciskai. Kontrole: raktu 469 → 469, `is_update_custom_fields` liko
`only` (vakarykste pataisa vietoje).

**Kas paaiskejo apie brendus:** AV be zenklo 194, ZB 137, VF 7. Bet `_zb_brand`
meta turi VISOS 1 059 ZB prekes — duomenys yra, tik neperkelti i taksonomija.
Vieno priskyrimo darbas, NEPRADETA.

**Kas paaiskejo apie atributus:** 143 is 400 tikrintu prekiu turi
`pa_be_grudu` irasyta `_product_attributes` meta, bet TERMINO nepriskirto.
Kortelėje laukas matomas, o filtrui preke nematoma.

---

### S734 — PARTIJOS (`petshop-partijos.php`)

Priezastis (Raimio situacijos): (1) perku i AV, kiekviena partija gali tureti
kita savikaina, ypac is Lenkijos su kintanciu zloto kursu; (2) ZB/VF paleidzia
akcija, nusiperku pigiau, o kita menesi akcijos nebera — sistema to nemato.

`_cost_price` buvo VIENAS skaicius prekei: antrasis irasymas uztrindavo
pirmaji, ir marza rodoma nuo paskutines, nors lentynoje guli pigiosios.

**MODELIS:**

```
ps_partijos    product_id · gauta · kiekis_gautas · kiekis_liko
               savikaina_eur · savikaina_orig · valiuta · kursas
               geriausia_iki · tiekejas · importuota · atsaukta
ps_pakuotes    tipas · medziaga · svoris_g · vienetu_pakuoteje · tiekiama_su_preke
```

VALIUTA: kursas fiksuojamas pirkimo diena ir NIEKADA neperskaiciuojamas —
tai jau ivykusi operacija.

SAVIKAINA = svertinis vidurkis is partiju su likuciu. Rasomas i `_cost_price`
kaip greitoji kopija (katalogo sarasas skaito ja, ne agregacija).

NURASYMAS — FEFO: pirma ta partija, kurios galiojimas arciausiai.

Testai 10/10: EUR partija · PLN 142/4,31=32,9466 € · svertinis vidurkis
tiksliai · likutis 0→54 · FEFO paeme anksciausiai galiojancia · nurasymas ·
„trūksta 955 vnt." ispejimas · pakuotes 60 vnt.=5,14 kg · GPAIS tik is
importuotos partijos · ivykiu juosta.

**v1.1 (S737) — UZSAKYMU KELIAS.** Recon rado, kad AV likuti jau mazina
`Petshop_AV_Reduce::mazinti` (prioritetas 15). Todel partijos kabinamos prie
TU PACIU hook'u prioritetu 25 ir rasoma TIK i `kiekis_liko` — jokio `_stock`,
jokio `_own_stock_qty`. Antras rasytojas tame paciame lauke butu tiksliai ta
schema, kuri sukele S468/S478/S499/S503.

Testas su tikru uzsakymu: partijose 51→48, FEFO paeme #2 (2027-06-30),
AV likutis 61→58 (mazino av-reduce), idempotentiskumas veikia, uzsakyme dvi
pastabos greta — musu ir av-reduce.

**MANO KLAIDA:** `wp_delete_post()` HPOS uzsakymu netrina — jie gyvena
`wc_orders`, ne `wp_posts`. Reikia `$order->delete(true)`. Testinis uzsakymas
liko sistemoje; istrintas atskirai. Ta pati klaidos rusis, kaip `method_exists()`
ant WC data store: funkcija tyliai nieko nedaro, o atrodo, kad suveike.

---

### S736 — GAVIMO LANGAS (`petshop-gavimas.php`)

Raimio praktika: saskaita su 15-20 poziciju naturaliu skanestu, prekes
sistemoje jau yra, reikia tik kiekiu, savikainu ir galiojimo datu.

Excel atmestas kaip letesnis (eksportas → pildymas → importas → klaidu
taisymas, ir nematai, ar pataikei i ta preke). Lieka atsarginiu keliu.

EIGA: paieska → Enter → kiekis → Enter → savikaina → Enter → galiojimas →
Enter grazina i paieska. Skeneris veikia be atskiro rezimo, nes USB skeneris
kompiuteriui atrodo kaip klaviatura.

GREITINTUVAI: „Kartoti praeita gavima", „Galiojimas visoms", saskaitos sumos
kontrole PRIES irasant, savikaina uzsipildo is praeitos partijos.

Testas narsykleje: paieska rado · savikaina 32,95 € uzsipilde · klaviatura
7→25.00→2028-01-31 · suma 175,00 € · „sutampa"/„skirtumas 25,00 €" ·
partija #3 sukurta · likutis 61 · „Kartoti" uzkrove 3 pozicijas · 0 JS klaidu.

---

### S738-S741 — ATRIBUTU PARSERIS

**KODEL TAISYKLES, NE AI** (Raimio klausimas): domenas siauras — baltymu
saltiniu ~30, grudu kulturu ~8. Ten, kur sarasas baigtinis, taisykle
pranasesne: deterministiska, auditojama, nemokama, be isorines priklausomybes.
Raimio pasiulymas versti uzsienietiskus tekstus atskirai pasalino vienintele
vieta, kur taisykles butu pralaimejusios.

**NEIGIMO ATPAZINIMAS** — svarbiausia vieta. Tekste „Be grūdų — nenaudojame
kviečių, kukurūzų" paprasta paieska randa „kviečių" ir nusprendzia, kad preke
su grudais. Testai 7/8.

**DRY-RUN PAMOKA 1 (v1.1):** „Šlapimo takams" gavo 240 prekiu — zodis „inkst"
gaudo ir „gerina inkstu veikla", ir inkstus SUDETYJE (subproduktai
konservuose). Isimta.

**DRY-RUN PAMOKA 2 (v1.1):** dziovintos antienos kulseles gavo „Su grūdais" —
grudai buvo paminėti bendrame aprasymo tekste. SPRENDIMAS: grudai, baltymo
saltinis ir monoprotein ieskomi TIK sudeties sekcijoje (+ pavadinime). Nera
sudeties — laukas lieka tuscias, o ne spejamas.

**MANO KLAIDA, kuria istaise faktai:** paskelbiau, kad parseris klysta
antienos kulselems. Patikrinus sudeti paaiskejo, kad ten „vištiena 92 %,
KUKURŪZŲ KRAKMOLAS" — parseris teisus, o esama zyme „Be grūdų" klaidinga.
As skaiciau pavadinima, parseris — sudeti.

Raimio sprendimas: kukuruzu krakmolas = su grudais.

**APPLY:** 3 710 reiksmiu, 3 774 prekes, 3,7 min, viena operacija
`PARS26081011111122`, zurnalas su atsaukimu.

**MANO TRECIA KLAIDA — MONOPROTEIN.** Priskyriau 1 242 (buvo 496).
Raimis: „situ skaiciumi as netikiu". Patikrinus:

```
Monge BWild (šerniena)   sudetyje ir sherniena, ir SVIEZIA VISTIENA
                         „šerniena" nebuvo baltymu sarase → rado viena → „Taip"
Family Dog               „mėsa ir mėsos perdirbimo produktai (16 % jautienos)"
                         misrus baltymai, aprasyti bendrai → „Taip"
62 is 401 „Taip"         dar ir su glitimo grudais
```

Ir svarbiausia: 2026-06-15 (TZ v1.18) buvo uzfiksuota savininko taisykle —
**monoprotein = vienas baltymas IR be glitimo**; parseris v10 tada klydo
lygiai taip pat (476 preke, 233 su grudais). As tos taisykles nepaisiau.

**IŠVADA:** monoprotein is sudeties isvesti neimanoma patikimai. Nepilnas
baltymu sarasas visada duos klaidinga „Taip". Nuo v1.3 — TIK aiskus gamintojo
pareiskimas, ir net jis tikrinamas glitimu.

Atsaukta 1 163 · praleista 0 · po atsaukimo 496 (tiek, kiek buvo) ·
is naujo priskirta 15 · galutinis 499.

---

### REZULTATAS

```
                     buvo    dabar
pa_be_grudu           412    1 015
pa_baltymu_saltinis  1 023   1 233
pa_amzius             509    1 054
pa_speciali_mityba    165      649
pa_monoprotein        496      499   ← teisingai, beveik nepakito
pa_gyvuno_rusis      2 638    2 689
ZB su „be grūdų"        2      339
```

Pagal sandeli: AV 601 · VF 351 · ZB 339 su „be grūdų".

**ATSAUKIMAS, jei prireiktu:** `Petshop_Parseris::atsaukti('PARS26081011111122', false)`
— nuima tik parserio priskirtus terminus ir tik jei jie vis dar ten.

---

### MAKETAI (S735)

Trys interaktyvus maketai, patikslinti pagal Raimio pastabas:
`prekes_kortele_maketas_v1.html`, `prekiu_gavimas_maketas_v1.html`,
`nauja_preke_maketas_v1.html`.

Raimio pastabos, kurios buvo idetos: „Tiekimas" → „Gavimas"; sriftas juodas,
ne pilkas; du svorio laukai → vienas (prekes svoris bruto), pakuotes dydis
lieka atributuose; serimo lentele perkelta i Aprasymus; GPAIS — atskiras
skirtukas po Istorijos su issiskleidziancia dalimi.

---

### NEPRADETA / LIKO

```
brendai            137 ZB + 194 AV be zenklo, nors _zb_brand turi visas 1 059
143 prekes         atributas registruotas _product_attributes, bet be termino
68 nesutapimai     kur parserio siulymas skiriasi nuo esamos zymes
                   (pvz. „Minkšti vištienos žiedai" = „Be grūdų", o sudetyje
                   kukuruzu krakmolas) — esamu NEPERRASINEJU principingai
aprasymu redaktorius       9 sekcijos su uzraktais
naujos prekes langas       maketas yra, kodo nera
Import #2 patikra          ar `_ps_sandelis` isgyveno po WPAI pataisos
```

---

### PAMOKOS

1. **Dry-run skaiciai turi buti lyginami su tuo, ko protingai galima tiketis**,
   ne tik su tuo, ar kodas suveike. 1 242 monoprotein is 2 734 turejo iskart
   kelti klausima — tai siaura kategorija, ne puse katalogo. Raimis tai
   pastebejo per sekunde, as ne.
2. **Isvedimas is nepilno saraso visada meluos ta pacia kryptimi.** Jei
   sarasas nepilnas, „radau viena" reiskia „radau viena is tu, kuriuos zinau".
3. **HPOS uzsakymai netrinami per `wp_delete_post()`** — reikia `$order->delete(true)`.
4. **Zurnalas pries masini veiksma, ne po jo.** `Petshop_Ivykiai` stebi tik
   meta laukus; taksonomijoms reikejo atskiro zurnalo, ir be jo 3 710
   priskyrimu butu buve neatsaukiami.
5. **Senos taisykles galioja.** 2026-06-15 monoprotein taisykle buvo
   uzfiksuota TZ, ir jos nepaisymas kainavo viena atsaukima.

Auksciausias decision Nr.: **S741**.

---

## 2026-08-09 (diena) — VARIKLIAI, KATALOGAS v3.5, MAKETAI [S721-S732]

Tesinys po S718-S720 (`_ps_sandelis` uzdarymas). Sesija apeme keturis naujus
variklius, katalogo lango perdaryma nuo v2.8 iki v3.5 ir du interaktyvius
maketus. Visi diegimai su md5 patikra ir atsarginemis kopijomis.

### IDIEGTA

| Failas | Versija | Dydis | Ka daro |
|---|---|---|---|
| `petshop-ivykiai.php` | 1.2 | 20 773 B | vieninga preses laiko juosta |
| `petshop-pardavimai.php` | 1.0 | 14 549 B | pardavimu greitis, ABC, dienu atsargai |
| `petshop-pilnumas.php` | 1.1 | 18 003 B | duomenu pilnumo balas pagal tipa |
| `petshop-rysiai.php` | 1.2 | 16 535 B | dalyvavimas, broliai €/kg, matomumas |
| `petshop-katalogas.php` | 3.5 | 181 532 B | sarasas + kortele kaip darbo vieta |

Naujos lenteles: `ps_ivykiai`. Nauji cron'ai: 04:40 ivykiu valymas ·
04:50 pardavimai · 05:00 pilnumas.

Atsargines kopijos DB: `ps_katalogas_v28_bak`, `_v29_bak`, `_v32_bak`, `_v33_bak`,
`_v34_bak`.

---

### S721 — VIENINGA LAIKO JUOSTA (`petshop-ivykiai.php`)

Priezastis: istorija gyveno trijose vietose (AV zurnalas, kainu zurnalas,
"visi pakeitimai"), o importo pakeitimai nebuvo fiksuojami niekur. Butent del
tos aklos zonos `_ps_sandelis` dingimo istorija (S718) uztruko keturis
diagnostikos praejimus.

ARCHITEKTURINIS SPRENDIMAS: kabinama ant `updated_post_meta`, NE ant musu
mygtuku. Todel juosta mato VISUS kelius — kataloga, WC redagavimo puslapi,
importa, cron'a. Kabinant tik prie savo veiksmu gautume ta pacia akla zona,
del kurios modulis ir kuriamas.

Apsaugos: stebimi tik baltajame sarase esantys 18 raktu; rasoma tik kai
reiksme REALIAI pasikeite; riba 40 irasu prekei per uzklausa; tylus
praleidimas, jei lenteles nera (istorija neverta sulauzyto importo).

**KLAIDA, kuria sugavo testas T9.** v1.0 skaite sena reiksme is kesavimo
`updated_post_meta` metu — o ten kesas jau turi NAUJA. Rezultatas: visa juosta
butu rodziusi "→ 17,99" be "16,49 →", ir tai butu atrode kaip veikianti
sistema. Taisyta per `update_post_metadata` filtra (fires PRIES irasyma).
Filtre kritiska grazinti `$check` nepakeista — grazinus ne-null, WordPress
laikytu irasyma jau atliktu ir realus update neivyktu (tylus duomenu
praradimas, blogesnis uz pacia klaida).

Testai 11/11: meta hook · be pokycio nerasoma · nestebimas ignoruojamas ·
op_nr · op_nr isvalymas · statusas · WC CRUD · filtrai · sena reiksme ·
`_stock` per CRUD · svetimu preku 0.

Backfill: 13 irasu is `ps_av_zurnalas` (14 praleista — atsauktos operacijos).

**v1.2 pataisa (Raimio pastebejimas):** `_weight` etikete "Siuntos svoris" →
"Prekes svoris". Siunta yra keliu prekiu suma su pakuote — isvestinis dydis,
neegzistuojantis kaip prekes laukas. Klaidingas pavadinimas anksciau ar
veliau paskatintu i ji irasyti visos siuntos svori. **Makete v18 ta pati
klaida yra 10 vietu — taisyti pries E2 kodavima.**

---

### S722 — PARDAVIMU GREITIS (`petshop-pardavimai.php`)

Didziausia spraga pries Inventory Planner / Cin7 klase: katalogas nemate
pardavimu, todel sprendimai "kelti kaina", "uzsakyti daugiau", "isimti"
buvo priimami nezinant, ar preke apskritai perkama.

Skaiciuoja is `wc_order_product_lookup` + `wc_order_stats` (HPOS):
365/90/30 d. vienetai, pajamos, uzsakymai; ABC (80/15/5 pagal metines
pajamas); dienu atsargai; negyvos atsargos.

MARZOS ATSARGA irasyta i koda: marza = DABARTINE savikaina × parduotas
kiekis. Tai apytiksliai — jei tiekejas kele kaina, istorine marza buvo kitokia.
Tikslus skaiciavimas reikalautu savikainos fiksavimo uzsakymo eiluteje
pardavimo momentu. Laukas vadinasi `marza_apytiksle` ir niekur nerodomas
kaip buhalterinis skaicius.

Testai 9/9, tarp ju T1 — nepriklausomas kontrolinis SQL, sutapo vienas prie
vieno penkioms prekems.

RADINYS: `lookup` lenteleje yra NEIGIAMU `product_qty` eiluciu — daliniai
grazinimai. Reiskia skaiciavimas duoda GRYNAJI pardavima (parduota minus
grazinta), ir tai teisinga. Apsaugos: neigiamas greitis → `dienu atsargai`
= null; neigiamos pajamos → preke krenta i "be pardavimu", ne i ABC.

Perskaiciuota visam katalogui: 3 774 prekes, 74 s.

---

### S723 — DUOMENU PILNUMO BALAS (`petshop-pilnumas.php`)

PAGRINDINIS PRINCIPAS (Raimio sprendimas): balas matuoja TIK tai, ka realiai
imanoma uzpildyti. Laukas, kurio uzpildymas reikalauja fizinio matavimo ar
isoriniu duomenu, i bala NEIEINA — kitaip preke, turinti viska, ka gali
tureti, niekada nerodytu 100 %, ir balas mirtu kaip irankis.

Padengimo matavimas pries taisykliu nustatyma:

```
                  MAISTAS(1639)  AKSESUARAI(2028)
pakuotes dydis    95 %           11 %   ← nasta
matmenys          34 %           20 %   ← nasta abiem
EAN               34 %           42 %
galerija          45 %           57 %
gyvuno rusis      97 %           92 %
```

ISIMTA del nastos: matmenys, prekes svoris aksesuaruose, galerija kaip
reikalavimas.

EAN — SAMONINGA ISIMTIS (Raimio sprendimas): padengimas zemas, bet paliktas,
nes prekiu vedimas skeneriu yra planuojama darbo forma — rodiklis turi
SPAUSTI link jos, ne tik konstatuoti dabarti. Kad tai nebutu bausme uz
neimanoma, veikia zyme `_ps_ean_netaikomas`: sveriamos ir naturalios prekes
EAN neturi ir netures, todel jom taskai iskrenta IS VARDIKLIO.

BALAS = surinkta / GALIMA × 100 (ne is fiksuoto 100). Todel visada pasiekiamas.

Taisykles (kiekvieno tipo suma = 100): maistas 10 lauku · skanestai 8 ·
papildai 9 · rinkinys 3 · aksesuarai 5.

APRASYMU SEKCIJOS skaidomos per `psdp_split()` — TA PACIA funkcija, kuria
naudoja prekes puslapis (snippetas 512). Antra sava skaidymo logika reikstu,
kad katalogas rodo viena, o pirkejas mato kita.

**v1.1 pataisa po pirmo pilno paleidimo:** Mix&Match rinkiniai gavo 0 % ir
uzkiso eiles virsu. Rinkinys yra KONTEINERIS — savikaina isvestine is
komponentu, savos sudeties neturi, EAN netures niekada. Prideti tipas
`rinkinys` ir grupe `nevertinama` (DP skelbimai, testines prekes — 10 vnt.).

Rezultatas: 3 764 prekes, vidurkis 73,7 %, pilnu 822.
**620 prekiu yra 90–99 % grupeje, ir is 200 tikrintu VISOMS truksta TIK EAN** —
tiksliai tas spaudimas, del kurio EAN ir paliktas.

---

### S724 · S726 — KATALOGAS v2.9 ir v3.0

v2.9: prijungti trys varikliai. Nauji stulpeliai (Pardavimai · Uzteks ·
Pilnumas), naujos eiles (Baigiasi greiciau nei tiekiama · Negyvos atsargos AV ·
Duomenu skolos), kortelėje "Kaip sekasi" virsuje ir vieninga juosta vietoj
tik-katalogo istorijos.

Senasis `pilnumas()` metodas su savo 8 lauku logika perjungtas i Varikli 3 —
dvi pilnumo sistemos viename lange rodytu skirtingus skaicius tam paciam
dalykui, o tai blogiau nei ne vienos. Senoji logika lieka ATSARGINE saka.

NEGYVOS ATSARGOS — tik AV. Dropship prekes guli pas tiekeja, pinigu nesaisto,
todel i sia eile joms vietos nera. (Sprendimas priimtas is principo, ne is
dev duomenu.)

Verifikacija: eiles = filtrai vienas prie vieno (1=1, 746=746, 1971=1971) —
skaitiklis ir sarasas negali issiskirti.

v3.0: kortelėje trys blokai is `Petshop_Rysiai`.

---

### S725 — RYSIAI (`petshop-rysiai.php`)

Keisti kaina ar isimti is prekybos nematant "ji yra trijuose rinkiniuose" —
avarija, laukianti savo dienos.

**Du realus radiniai per testavima:**

1. Broliu heuristika per laisva (72 %): surisо "Eukanuba Golden Retriever
   Adult" su "Eukanuba German Shephed Adult" (78 %) — pasalinus dydi jie
   skiriasi tik veisles vardu. Riba pakelta iki 88 % + reikalavimas, kad
   pakuotes dydis SKIRTUSI.
2. Slapias ir sausas maistas buvo suristi kaip broliai. €/kg palyginimas tarp
   konservu ir sauso maisto klaidina (konservuose ~80 % vandens) ir gali
   privesti prie blogo kainodaros sprendimo. Atskirta.

MNM VAIKAI: `_mnm_*` meta raktu nera NE VIENO, o `wc_mnm_child_items`
lenteleje 362 irasai. Stulpeliai: `container_id` = TEVAS, `product_id` = VAIKAS.
v1.1 abiem naudojo `product_id`, todel tevas ir vaikas sutapo ir kelias
TYLIAI praleido visus rysius. Istaisyta v1.2.

Patvirtinimas: Animonda GranCarno 400 g dalyvauja 5 rinkiniuose.

---

### S727 · S728 — NEAISKIOS KILMES VERSIJOS (atviras klausimas)

Po v3.0 diegimo (17:15) failas serveryje buvo perrasytas 17:44 i v3.2, kurios
AS NEDIEGIAU. Raimis patvirtino, kad jis irgi nieko nedare. Aktyviu rasanciu
snippetu nera, likusiu `_b64` opciju nera — kanalas neaiskus.

Failo antraste aprasо v3.1 ir v3.2 kaip atsaka i SCREENSHOT'O isvadas
(Pilnumo stulpelis netilpo ir dubliavo bukles taska; kortelėje buvo DU
pilnumo blokai). Sprendimai teisingi ir nuoseklus su musu darbu, todel v3.2
priimta kaip pagrindine baze.

**MANO KLAIDA prie sio radinio:** paskelbiau "struktūrinę klaidą 14 `<th>`
pries 13 `<td>`". Tai buvo skaiciavimo artefaktas — `substr_count($html,'<th')`
gaudo ir `<thead>`. Realiai 13 pries 13.

RIZIKA: jei tikrai yra antras procesas, rasantis ta pati faila, kitas deploy
jo darba istrins. Nuo v3.3 kiekvienas katalogo diegimas tikrina md5 pries
rasyma ir sustoja, jei failas ne tas, is kurio dirbta.

---

### S729 — DIZAINAS PAGAL MAKETA v18 (v3.3)

Raimis: "katalogo ir prekes dizainas man nepatinka, skiriasi nuo maketo".

Palyginus maketo ir realaus lango screenshot'us paaiskejo esmine priezastis:
**maketas dirba per visa ekrana, o realus langas atiduoda ~230 px WordPress
meniui.** Butent del to lentele netilpo ir v3.1/v3.2 teko salinti stulpelius —
taisyta ne ten, kur problema.

Padaryta: pilno ekrano rezimas (WP meniu paslepiamas TIK siame puslapyje),
tipografija ir tarpai pagal maketa, kategorijos kodas po nuotrauka
(nuotraukos LIEKA — Raimio sprendimas: "jis labai reikalingas"),
suvestine nusileido PO lentele.

Rezultatas: lentele 1394 px vietoj ~1150.

---

### S730 · S731 — KORTELE KAIP DARBO VIETA (v3.4, v3.5)

Raimis: "kortele ziauriai nepatogi, pats pasiziurek".

Diagnoze: kiekvienas blokas rodomas visada, net kai tuscias. Atidarai preke ir
matai "Kaip sekasi 0 vnt / 0 vnt", tada "Kur dalyvauja: 0" su pastraipa
paaiskinimo, tada keturias eilutes "taip/taip/taip/taip". Trys ekranai nieko.
O "Kaina ir marza", su kuria dirbama kasdien — patame apacioje.

v3.4: isdestymas pagal pramones standarta (Shopify produkto puslapio logika):
KAIRE = tai, su kuo dirbama · DESINE = kontekstas. Kortele isplesta nuo 300 px
juostos iki 1181 px. TUSTI BLOKAI NERODOMI — blokas atsiranda tik kai turi ka
pasakyti.

v3.5: REDAGAVIMAS. Kaina, akcijine, savikaina, SKU, EAN, svoris — Enter
iraso, Esc atstato. Kiekvienas irasymas i zurnala su operacijos numeriu.
Marza persiskaiciuoja vietoje.

SAVIKAINA redaguojama TIK kai jos nevaldo tiekejas: VF/ZB prekems ji ateina is
`_vf_cost`/`_zb_cost`, ir irasymas i `_cost_price` nieko nepakeistu —
resolveris jo net nepamatytu. Tyliai priimti tokia ivesti reikstu meluoti,
kad issaugota.

SKU ir EAN tikrinami unikalumui — dublikatas sulauzytu susiejima su tiekejo XML.

Testas narsykleje su PS-TEST-001: savikaina 7.77 → Enter → "irasyta", 0 JS klaidu.

Prideti maketo v18 blokai: filtravimo atributai, rysys su tiekeju, serimo
lentele, siuntimas.

---

### S732 — INTERAKTYVUS MAKETAI

Raimis: "sunku pasakyti, kai matai tik nuotrauka... padaryk interaktyvia
kortele, as ja pratestuosiu, tai turbut visiskai paprasciau nei visa koda
rasyti". Teisinga: maketa paspaudineti pigiau nei koda perdarineti.

`prekes_kortele_maketas_v1.html` (43 KB) — 5 skirtukai, redagavimas su
gyva marzos perskaiciavimu, AV korekcijos dialogas, aprasymu sekcijos su
uzraktais, pardavimu grafikas, istorijos filtrai.

`prekiu_priemimas_maketas_v1.html` (19 KB) — greitas suvedimas klaviatura
be Excel'io: paieska (pavadinimas/SKU/EAN) → Enter → kiekis → Tab →
savikaina → Tab → galiojimas → Enter grazina i paieska.
"Kartoti praeita tiekima", "galiojimas visoms", PLN kursas, saskaitos
sumos tikrinimas pries irasant.

**KLAIDA, kuria sugavo testas:** paieska "plauciai" NERADO prekes
"jautienos plauciai" — nenormalizavo diakritiku. Realiame darbe rasoma be
lietuvisku raidziu, ir preke butu "dingusi", nors sarase YRA. Istaisyta.

---

### RAIMIO SPRENDIMAI (uzfiksuoti)

| Klausimas | Sprendimas |
|---|---|
| Nuotraukos kataloge | LIEKA — "jis labai reikalingas" |
| EAN pilnumo bale | LIEKA, nors padengimas zemas — spaus link skenerio |
| Savikaina | aktualu TIK AV prekems; dropship — saskaitos pagal fakta |
| Buhalterija | sumine apskaita; i Pragma tik pardavimai; savikainas veda buhaltere |
| Saskaitos Nr. partijoje | NEREIKIA — apskaitos cia nevedam |
| Konservu 6-pack | ispakuojama, parduodama po 1 vnt.; abi pakuotes i GPAIS apskaita |
| GPAIS apimtis | registruotas, iki 5 t "labai toli" → sumine apskaita |
| Excel priemimui | nereikia, jei veikia greitas suvedimas |
| Launch | rugsejo pabaiga realu; "geriau savaite veliau nei taisyti veikianti" |

---

### MANO KLAIDOS SIOJE SESIJOJE

1. Tris bridge run'us sudeginau bandydamas modifikuoti runner'i per `sed`/regex
   vietoj rasymo is naujo. Kodo nepaliete, laiko kainavo.
2. Paskelbiau nesama "struktūrinę klaidą" (`substr_count` artefaktas).
3. v3.4 pradzioje dirbau su pasenusia baze (v3.2 vietoj v3.3).
4. Padengimo lentele skanestams rode 3 vietoj ~38 — naudojau `iconv` translit
   vietoj tikslaus `be_diakritiku`.
5. Kortelėje rodziau "Pakuotes dydi" DUKART (Raimio pastebejimas).
6. Pirmame darbo plane komentavau dev duomenis ("300 negyvu atsargu") taip,
   lyg tai butu radinys — dev yra testine aplinka, taisykle zinoma.

---

Auksciausias decision Nr.: **S732**.

---

## 2026-08-09 — `_ps_sandelis` NASLAITIS LAUKAS: DIAGNOZE + UZDARYMAS [S718-S720]

Vakar (S716) rastos 262 ZB prekes be `_ps_sandelis` lauko, klausimas atidetas rytui.
Siandien: priezastis rasta, ciaupas uzsuktas, 362 prekes uzpildytos, ideta automatika.
Visi diagnostikos run'ai read-only, TEMP snippetai deaktyvuoti po kiekvieno.

### IDIEGTA

| Snippetas | Kas |
|---|---|
| 2515 | **Petshop Sources v2.2** — registras + palaikymas + sandelio pildymas |
| ~~2404~~ | Sources v2.1 — deaktyvuotas, kodas issaugotas (rollback) |

```
uzpildyta          362 prekes · visos zb · liko kandidatu 0
liko be lauko        0  (buvo 362)
zurnale            362  irasai undo'ui
WPAI #1, #2        full_update → only (_zb_* sarasas)
```

---

### S718 — DIAGNOZE: lauka niekas neraso, o ZB importas ji trina

Metodas: 4 read-only bridge run'ai (ZBDIAG v1–v4), snippetu ir mu-plugin'u kodo skanas,
WPAI profiliu `options` analize, `pmxi_posts` / `pmxi_history` koreliacija.

**1. Laukas neturejo NE VIENO rasytojo.** Visos panaudos kode — skaitymas:
snippet 2403 (1 vieta), snippet 2404 (7), `petshop-katalogas.php` (7).
Vienintelis rasytojas per visa istorija — vienkartinis TEMP S595 mass-write 08-06.
Nei ZB, nei VF importas lauko nekuria nei naujoms, nei atnaujinamoms prekems.

**2. ZB profiliai lauka AKTYVIAI TRYNE.** Buksena pries taisyma:

```
#1 goods_clean.xml   is_upd_cf=1  logic=full_update   ← trynejas
#2 products.php      is_upd_cf=1  logic=full_update   ← trynejas
#3 stocks.php        is_upd_cf=0                      saugus
#5 vf-fetcher        is_upd_cf=1  logic=only          teisingai
#7 vf-fetcher qty    is_upd_cf=1  logic=only          teisingai
```

`full_update` = update metu istrinami VISI custom fields, kuriu nera sablone.
ZB sablone tik `_zb_*` → `_ps_sandelis` istrinamas kas update.

**3. Laiko koreliacija patvirtina mechanizma.** TEMP S595 mass-write 08-06 ~13:00 →
Import #2 run'as 08-06 15:01, summary „0 created **362 updated** 2 218 skipped".
Preku be lauko siandien — **lygiai 362**. Likusioms laukas isliko, nes buvo „skipped".

**4. VF puse sveika del teisingos konfiguracijos** (`only`, ne `full_update`) —
visos 1 161 VF prekes lauka turi. Tai ir buvo B sprendimo etalonas.

**5. Pacios 362 prekes SVEIKOS** — duomenu praradimo NEBUVO:

```
308 publish + 54 draft
registro irasas (zb, is_active=1)   362/362
_zb_cost · _zb_qty · _zb_last_sync  362/362
kategorijos · _tax_status           362/362
atributai 329 · nuotraukos 326 · kainos 324
_manual_price_override                0   ← rankinis darbas nepaliestas
resolve()                           zb/venipak („ZB meta laukai" fallback)
```

Parduotuve, likuciai ir kainos veike korektiskai visa laika. Rizika buvo tik ten, kur
laukas tikrinamas TIESIOGIAI: katalogo sandelio filtras, Venipak manifestu sandelio kodai.

**NEUZDARYTAS GALAS.** Vakar 21:24 matavimas rode 262, siandien ryte — 362, nors uzklausa
identiska, registras nekito, #2 nakti nebego. Tikslus +100 kanalas nesugautas per 3
bandymus → pagal anti-rabbit-hole taisykle sustota. Saknies tai nekeicia: laukas
strukturiskai nepalaikomas, todel skaicius bet kuriuo atveju plauke.

---

### S719 — B + A: ciaupas ir automatinis palaikymas

**B — WPAI profiliu pataisa (priezastis).** Keisti tik trys raktai #1 ir #2; sarasas imtas
ne is galvos, o is paciu profiliu `custom_name`:

```
#1  full_update → only   10 _zb_* lauku
#2  full_update → only   12 _zb_* lauku
```

Saugikliai: `unserialize` patikra pries; po serializavimo pakartotinis `unserialize`
(neatsistato → keitimas praleidziamas); po irasymo perskaitymas is DB.
Rezultatas: abu `db_upd=1`, `po_unserialize=TAIP`, `is_upd_cf=1` isliko.

**A — Sources v2.2 (pasekmes + ateitis).** Sukurta is v2.1 penkiais taskiniais patch'ais,
sintakse patikrinta lokaliai `php -l` PRIES deploy.

`uzpildyti_sandeli($pid)` — griezos taisykles:

```
pildo TIK tuscia lauka · netuscio NIEKADA neperraso
raso TIK kai registre LYGIAI VIENAS aktyvus saltinis (dviprasmybe → praleidzia)
reiksme privalo buti leistinu 7 sarase
statinis rekursijos sargas
kiekvienas irasas → zurnalas ps_sandelio_uzpildymai (riba 5 000)
```

Ikabinta i `sinchronizuoti()` pradzia → gydo per esamus hook'us
(`woocommerce_update_product`, `woocommerce_new_product`, `_ps_sandelis` meta pakeitimas)
ir per naktini cron 04:20. **Nauja preke lauka gaus savaime** — tai ir buvo A esme.

Endpoint'ai (token `k=ps2026`, apply/undo dar ir `patvirtinu=taip`):

```
?ps_src=sandelisdry     kandidatai, nieko neraso
?ps_src=sandelisapply   pildymas
?ps_src=sandelisundo    atstatymas is zurnalo (tik kur reiksme nepakitusi)
```

DRY: kandidatu 362, visi `zb`, zurnale 0 — grupe vienareiksme.

**BACKUP pries visus keitimus:** `analize/s718_backup.json` bridge repo —
WPAI #1 options (25 693 B) + #2 options (26 208 B) + Sources v2.1 kodas (30 123 B).

---

### S720 — APPLY + verifikacija

```
irasyta        362   visos zb          liko kandidatu   0
liko be lauko    0   (buvo 362)        dublikatu meta   0
zurnale        362   undo paruostas
```

Sandelio pjuvis po apply (publish+draft):

```
av 1388 · vf 1161 · zb 1059 · quattro 65 · prins 43 · belcor_tofu 42 · ambrosia 15
```

ZB: 697 → 1 059, tiksliai atitinka registro `zb=1059`. Visi 7 sandeliai sutampa su
registru vienas prie vieno.

**KONTROLE — kas NEPAJUDEJO:**

```
registro is_active      identiski skaiciai pries/po visiems 7 saltiniams
preku busenos           2 734 publish · 1 039 draft · 32 trash — kaip ryte
pavyzdziai 14062/14064/14072   kainos, _stock, _zb_qty, _tax_status nepakite
resolve()               zb / venipak / courier_only=false
svetaine                HTTP 200 po snippetu perjungimo
aktyvus TEMP            0  · lieka tik #2403 Stock Service v1.3 ir #2515 Sources v2.2
```

**ROLLBACK (visi keliai patikrinti, kad egzistuoja):**

```
meta undo   ?ps_src=sandelisundo&patvirtinu=taip&k=ps2026
kodo undo   aktyvuoti #2404, deaktyvuoti #2515
WPAI undo   analize/s718_backup.json → options_b64 atgal i pmxi_imports
```

---

### ATVIRAS PUNKTAS — B dar NEIRODYTAS

B pritaikytas, bet nepatikrintas realiu importu. Kritine detale: trynejas buvo
**Import #2**, kuris bega RETAI (paskutiniai 08-04 03:01, 08-06 15:01), o ne kas valanda.
Import #3 (kas valanda) lauko niekada netryne (`is_upd_cf=0`) — jo praejimas NIEKO neirodo.

```
patikros salyga   po pirmo Import #2 run'o po 2026-08-09 12:15:
                  ar _ps_sandelis tebera 1 059
                  IR ar _zb_qty / _zb_last_sync atsinaujino
                  (t. y. `only` nesulauze paciu ZB lauku atnaujinimo)
statusas          „pritaikyta, neirodyta" iki tol
```

Raimis nurode, kad tas importas siandien nebus.

### BACKLOG RADINYS — 74 ZB draft'ai be `_zb_draft_reason`

Is ju 42 su likuciu >0. Daugiausia Real Dog KOMP rinkiniai ir Beaphar „pak6" pakuotes.
NEPRADETA, laukia Raimio. Atskiras klausimas nuo sio.

Auksciausias decision Nr.: **S720**.

---

## ZURNALO SPRAGA — S633-S717 NEUZFIKSUOTI

Sis irasas soka nuo S632 (2026-08-07 popiete) prie S718. Tarp ju liko neuzfiksuotos
2026-08-07/08 sesijos: E1 katalogo langas (`petshop-katalogas.php` v1 → v2.8),
Sources v2.0/v2.1 + Stock Service v1.3, PVM taisymas 5 WPAI profiliuose ir 988 prekese,
WC sync sargybinis (`petshop-wc-sync.php` per Reflection), 32 legacy bundle'u salinimas,
masiniai veiksmai su perziura, 123 klaidingu `_ps_be_saltinio` zymiu nuemimas [S716].
Sprendimai gyvi, bet aprasyti tik pokalbiu istorijoje. Uzpildymas — atskiras darbas.

---

## 2026-08-07 (popietė) — E0: ps_sources + Stock_Service [S619-S632]

### IDIEGTA

| Snippetas | Kas |
|---|---|
| 2384 | **Petshop Sources v1.1** — `ps_sources` lentele + migracija |
| 2387 | **Petshop Stock Service v1.2** — parduodamo kiekio skaiciavimas |

```
ps_sources    3 805 irasai · 3 804 prekes · 0 dublikatu · 0 prekiu be iraso
kryzmine      2 776 publish · naujas modelis = veikiantis resolve() · 0 nesutapimu
```

Parduotuveje NIEKAS nepasikeite — tas pats rezultatas, tik paimtas is struktūros.

### SPRENDIMAI

**Saugos rezervas — ATMESTAS.** Siuliau atimti 1 vnt. nuo tiekejo likucio.
Raimis: „Preke arba yra, arba jos nera. Retai perkamu prekiu tiekejai laiko po kelias."
Dirbtinis nurasymas paslėptu parduodama preke. `saugos_rezervas = 0`.

**Sviezumo taisykle tik sinchronizuojamiems.** Mano pirmoji versija „nera sync datos →
neiskaitoma" butu padariusi **142 prekes neparduodamas**: Quattro 63, Belacor 41,
Prins 23, Ambrosia 15 — ju likutis vedamas RANKA, datos nera ir nebus.

```
sinchronizuojami   vf · zb          tikrinamas 24 val. sviezumas
rankiniai          quattro · prins · belcor_tofu · ambrosia   data nereikalinga
```

### ★★★ DUOMENU RADINIAI ★★★

**4 neigiami likuciai.** Visos keturios: parduota 0 vnt., 0 uzsakymo eiluciu,
backorders isjungti → skaicius irasytas TIESIOGIAI, ne per pardavimus.

```
#16317  Ruda avies koja                 −411 → 0
#17443  Guminė pirštinė kairiarankiams   −10 → 0
#18623  Exclusion Hepatic                 −8 → 0
#17710  Purrfect kraikas 6 l              −1 → 0
```

**JOSERA #17978 — DAUGIASALTINIS ATVEJIS BUVO ARTEFAKTAS.**

Preke turejo `_own_stock_qty = 2` ir `_stock = 2`, nors `_vf_qty = 782`.
Visoms kitoms 1 161 VF prekei `_stock` sutampa su `_vf_qty` — si buvo VIENINTELE isimtis.

**Raimio izvalga:** senoje sistemoje VF likuciai vedami ranka, todel migruojant galejo
likti rankinis skaicius, o ne reali AV lentyna. Pasitvirtino.

Istaisyta: `_own_stock_qty` istrintas, `_stock` atstatytas is `_vf_qty`.
Patikrinta po valandos — sinchronizacija vel ja valdo (780 = 780).

**IZVADA MODELIUI:** realiu daugiasaltiniu prekiu kataloge NERA NE VIENOS.
`sources[]` lieka teisingas, bet dabar atspindi tikrove: viena preke — vienas saltinis.
Vykdymo taisykle AV → tiekejas dar neturi realiu duomenu patikrinimui.

**Dublikatu paieska** visoje 3 804 prekiu bazeje: 50 grupiu vienodais pavadinimais
(daugiausia pakuociu dydziai tame paciame sandelyje), **1** grupe su skirtingais
sandeliais (Farmina N&D Prime Cat: #14595 av draft · #27564 zb publish),
1 dublikatas pagal EAN, **0** AV prekiu su VF pozymiais.
Masines AV/VF dubliavimo problemos NERA.

Josera Sensiplus trejetas (#17978 · #19920 · #19921) — **NE dublikatai**,
trys skirtingos pakuotes (12,5 / 3 / 0,9 kg). Netrinta.

### ★ VF SAVIKAINA — MANO ANKSTESNIS TEIGINYS BUVO KLAIDINGAS ★

TZ 38.3 irasyta, kad savikaina imama is XML bazines kainos ir VF marza rodoma
neteisinga. **TAI NETIESA.** Klaida buvo mano recon'e — lyginau ne ta lauka.

```
_vf_cost_xml            16,89   tiekejo bazine kaina
_vf_supplier_discount    0,15   BRAND:Exclusion +DISC:15%
_vf_cost              14,3565   FAKTINE savikaina — ja naudoja Cost_Resolver
saskaitoje             14,36    sutampa iki cento
```

Tikroji VF maisto marza **17 %**. Nuolaidos: 271 preke 20 %, 80 prekiu 15 %, 810 be.
TZ v1.65 39.6 skyriuje irasytas pataisymas.

### ★★★ SNIPPETU SIUKSLYNAS ★★★

Inventorizacija parode masta:

```
TEMP S445–S632                   162
„(temp)" / „tmp"                ~450
„UI Localization Runtime Audit" ~100 (vienas pavadinimas, kartotas)

AKTYVUS laikini (RIZIKA):  736 · 738 · 797 · 798–805 · 1410 · 1647
```

**KRITINIS RADINYS:** Code Snippets REST DELETE grazina **204 „pavyko", bet NETRINA.**
Todel ankstesniu sesiju zurnaluose irasai apie istrintus snippetus yra NETIKSLUS —
jie tik isjungti. Trynimas imanomas tik per WP admin arba tiesiogiai DB lenteleje.

Valymo planas (kitam langui):
```
1  perskaityti 13 aktyviu laikinu — kurie realiai veikia sistema
2  nereikalingus isjungti su patvirtinimu
3  masinis trynimas per DB su atsargine kopija
   kriterijus: TEMP* arba (temp)/tmp IR neaktyvus
```

### LIKO ATVIRA

```
_own_stock_qty naslaitis   meta_id 1020059, post_id 48375, reiksme 0,
                           prekes NEBERA — i skaiciavimus nepatenka
925 prekes su _stock=0     Raimis: „prie prekiu nelysk, cia mano darbas" —
                           jos guli draft, viskas ok
```

### KAS TOLIAU

```
E0 liko   resolve() perjungti skaityti is ps_sources
          Stock_Service prijungti prie WooCommerce
          nauja preke be saltinio → Klausimai
E1        Katalogo langas
Atskirai  snippetu valymas (naujame lange — reikia vietos)
```

Auksciausias decision Nr.: **S632**.

---



### MAKETO VERSIJOS — KAS PASIKEITE

| v | Kas atsirado / kas buvo blogai |
|---|---|
| v1 | pirmas variantas, sviesus fonas |
| v2 | tamsus fonas, konsultanto 6 korekcijos, worklist, dry-run/revert, istorija, CSV, skeneris |
| v3 | akcijos TIK Akciju lange; rinkiniai != FBT; viena issaugojimo juosta |
| v4 | **emoji ismesti** (Raimis: „darbinis langas, ne vaiku darzelis"); pilnas filtravimas (kategorija, brendas); prekes isemimas su 301; zargonas is ekrano islindo i ⓘ |
| v5 | nauja preke (EAN-first), masinis ikelimas, marza % IR €, PVM etiketes, trys kainu keliai, rikiavimas, puslapiavimas, variantai |
| v6 | savikainos pokyciu eiles, marzos grindys, kairysis stulpelis pertvarkytas pagal darbo tvarka |
| v7 | konsultanto P0: finansine suvestine, parduodama ne suma, akcijos/savikainos atskyrimas, AV tik ± korekcija |
| v8 | EAN kontrolinis skaitmuo, aprasymu sablonai pagal kategorija, XML savikainos override, Excel round-trip |
| v9 | tikras save/discard, aprasymu busena, saziningas AV zurnalas, filtrai per Stock_Service |
| v10 | kopijos ciklas per prekes, tiekejo rysys issaugomas, serimo lentele → kanoninis kelias, saraso pertvarkymas |
| v11 | **prekes kopijavimas** su dviem paruostais variantais |

Galutinis: `prekiu_katalogas_maketas_v11.html`.

---

### ★★★ KLAIDOS, RASTOS SAVO PACIO AUDITU ★★★

Kiekviena versija tikrinta atskirai paleidziant skaiciavimus Node'u su realiais
duomenimis, ne skaitant koda.

**1. Finansine suvestine MELAVO (v6→v7).** „Sandelio verte = kaina × parduodama"
su testiniais duomenimis rode **42 162 €**, o tikroji AV atsargu savikaina —
**292 €**. I skaiciu pateko tiekeju likuciai, kuriu imone neturi, ir pardavimo
kaina vietoj savikainos. Skirtumas 144 kartai.

**2. Marzos apvalinimas iskreipdavo pigias prekes (v6).** Siuloma kaina visada
apvalinta i .X9. Animonda konservui 0,99 € tai reiske 1,19 € vietoj 1,12 € —
atstatydavo 38 % marza vietoj buvusiu 34 %. Pataisyta: .X9 tik nuo 5 €, zemiau —
centais. Perleista 7 prekiu testu, visos atstato 1 % tikslumu.

**3. Excel maketo eksportas ignoravo pasirinkta apimti (v8).** Visada
`P.filter(pass)`, nepaisant radio mygtuko.

**4. Naujos prekes EAN patikra veike tik su Enter (v7).** Skeneris Enter siuncia
pats, todel testuojant skeneriu klaida nesimate; ivedant ranka forma neatsirasdavo.

**5. Kopijuojant buvo perimamas siuntos svoris (v11).** 10 kg → 1 kg pakuote
sveria kitaip; perimtas svoris duotu ne ta pastomato dydi.

### KLAIDOS, KURIAS RADO KONSULTANTAS (per Raimi)

Visos patikrintos KODE pries taisant — visos buvo tikros.

| # | Klaida |
|---|---|
| P0-1 | `openCard()` valydavo `state.dirty` → „Atmesti" nieko neatmesdavo; kopija neatnaujinama po issaugojimo; uzdarant duomenys negrazinami |
| P0-2 | Aprasymo tekstas issaugomas, bet `p.desc[i]='hand'` nenustatomas → preke toliau rodoma kaip be aprasymo |
| P0-3 | Tiekejo radinys buvo TIK TEKSTAS EKRANE — sukurta preke nuo tiekejo atsijungdavo (be ssku, likucio, sync datos) |
| P0-5 | AV korekcija: turint 1 vnt. ir nurasant 10, zurnale rasydavo „−10" |
| P1-6 | senasis „Ikelti sarasa" kelias apeidavo sauguji Excel rezima |
| P1-7 | filtras „tik tiekejas" naudojo `p.tiek>0`, o „parduodama" rode 0 — du ekrano taskai sake priesingus dalykus |
| P1-8 | mazmenine verte skaiciuota tik prekems su savikaina → rode 392 € vietoj 1 464 € |

**PAMOKA (kartotine): v7 atsakyme isvardinau kaip padaryta tai, ko makete
nebuvo.** Tai tiksliai ta pati klaida, del kurios egzistuoja taisykle „netikrink
pagal ketinima, tikrink pagal rezultata". Nuo v8 kiekviena versija tikrinta
paleidziant koda: sintakse, visi 132 DOM ID, ir atskiri skaiciavimu testai.

---

### RAIMIO SPRENDIMAI (uzrakinti)

```
marzos grindys      sausas maistas 10 % · konservai 15 % · skanestai 20 % · kita 20 %
pokycio riba        3 %
uzsakymo riba       5 vnt. (bendra), atskirai prekei — kortelėje
darbuotoju teises   NEREIKIA kol kas
fonas               ne baltas, ne juodas — pilkas darbo plotas, balti pavirsiai
emoji               ismesti
sarasas             Prekyboje pirma, tada Juodrasciai, Kita — issiskleidzia
serimo lentele      paveldima kopijuojant, bet „paveldeta — patikrinti"
nuotraukos          pasirinkimas kiekviena karta, numatyti negalima
```

### DAUGIASALTINIS MODELIS — PRIIMTAS

`sources[]` DABAR (ne po launch). Priezastis: AV+VF Josera jau egzistuoja,
tas pats produktas skirtinguose tiekeju kataloguose, galimas VF+ZB.
Paliekant viena `sand` teks perrasyti importus, resolveri, likuciu skaiciavima.

V1 vykdymo taisykle SAMONINGAI paprasta: AV → vienas pagrindinis tiekejas.
Kiti saltiniai saugomi, bet automatiskai nenaudojami. `_ps_sandelis` lieka
suderinamumo lauku, NE vieninteliu tiesos saltiniu.

### KITAS ETAPAS

```
E0  resolveris skaito duomenis · sources[] · preke be saltinio → Klausimai
E1  Katalogas
E2  Prekes kortele
E3  Sandelis
E4  Akcijos + Rinkiniai
```

Kitu langu maketai — PO to, kai Katalogas veiks su tikrais duomenimis.

Auksciausias decision Nr.: **S610**.

---


## 2026-08-05/06 — UZSAKYMU DARBALAUKIS, VENIPAK MANIFESTAI, TIEKIMAS [S509-S595]

### KODEL
WooCommerce uzsakymu sarasas buvo numatytasis ekranas, i kuri penki pluginai
sudejo mygtukus be uzrasu. Raimis: „turi buti malonu i darbalauki uzeiti, o ne
i chaosa". Papildomas reikalavimas — architektura, tinkanti ateities AI, ne tik
siandienos rankiniam darbui.

---

### DIEGIMU SEKA

| S | Failas | B | SHA-256 (16) | Ka pakeite |
|---|---|---|---|---|
| S511 | petshop-desk.php | 49 192 | a7feaf77acac301f | v2.0 eiles, filtrai, skydelis |
| S514 | petshop-desk.php | 50 041 | 3064217ee337ca7d | v2.1 resolve() masyvo klaida |
| S516 | petshop-desk.php | 51 314 | cdc7a5f042063aab | v2.2 pilnas pavadinimas, kliento pastaba, sriftas +1 |
| S519 | — | — | — | **ATMESTA** sintakses sargo (lietuviska kabute eil. 116) |
| S520 | petshop-desk.php | 56 180 | 386ee6886d73ae82 | v2.3 veiksmu sluoksnis + „Pazymeti apmoketu" |
| S522 | petshop-desk.php | 62 258 | 51a07f065fa6b689 | v2.4 dialogas su varnelemis + atsaukimas |
| S525 | petshop-desk.php | 63 713 | bc195b2c07e429b2 | v2.5 lapai + perdavimas pajungti |
| S527 | petshop-desk.php | 65 013 | f5b3ccf72d2ee693 | v2.6 tikri lipduku veiksmu vardai |
| S528 | petshop-desk.php | 80 449 | 2529d2776e78c686 | v3.0 rytine eiga (6 zingsniai) |
| S532 | petshop-av-sheets.php | 10 347 | 7a18784eba559e20 | bendras SURINKTI blokas pasalintas |
| S535 | sheets + dropship | 10 335 / 18 048 | 37f514a5e10d221a / 5dfdbaddd0880866 | „Atgal i darbalauki" |
| S539 | petshop-desk.php | 83 222 | 07b8a631df2cfacc | v3.1 siuntu bukles patikra |
| S550 | petshop-desk.php | 92 605 | 1262a498006b0c4b | v3.2 Venipak manifestai + statuso keitimas OFF |
| S552 | petshop-desk.php | 95 127 | 6d94f51d9c2f56d4 | v3.3 sandeliu ribos |
| S556 | petshop-desk.php | 95 828 | 7675a8b4d0216878 | v3.4 AV riba 11:00 |
| S558 | petshop-desk.php | 96 323 | cd8f0694923a7f7f | v3.5 ribos plytele (iskaitomumas) |
| S562 | petshop-av-tiekimas.php | 26 203 | 313305f35f3d7930 | v1.0 tiekimo modulis + 2 DB lenteles |
| S565 | desk + tiekimas | 98 420 / 28 473 | 5097e128bb693d72 / 02d51758dfa8e59a | pusiau automatinis kaupimas |
| S567 | desk + tiekimas | 99 351 / 36 158 | f6c54daa19b0b3f8 / 036920a0cbbb6109 | likuciu atnaujinimas + eile „Laukia prekiu" |
| S572 | petshop-desk.php | 105 755 | c1b3275686a8ed7f | v3.8 pakuociu skaicius, LP dydis ir kurjeris |
| S574 | petshop-desk.php | 113 261 | e834e3993a57cf0b | v3.9 klausimu sprendimo korteles |
| S576 | petshop-desk.php | 113 451 | a5fcc9570cc5b6f5 | v3.10 klausimo salyga |
| S582 | petshop-desk.php | 113 414 | dcea6d4e78228d61 | v3.11 **klaidinga** pataisa (zr. incidenta) |
| S584 | desk + tiekimas | 113 908 / 36 165 | 5be7a0bda081b5a8 / 971d5988acb59ddb | „Petshop uzsakymai", WC slepimas |
| S586 | petshop-desk.php | 114 027 | 553a4ec38c3b23a5 | v3.13 WC slepimas CSS'u (403 regresija) |
| S590 | petshop-desk.php | 114 420 | b0136cb48a598646 | v3.14 teisingas AV likucio saltinis |
| S595 | — (duomenys) | — | — | `_ps_sandelis` irasytas 3 805 prekems |

Backup: `wp-content/uploads/ps-backup/{failas}.bak_sNNN`

---

### DARBALAUKIS (petshop-desk.php, `page=ps-desk`)

Meniu punktas „Petshop uzsakymai", pirmas. WooCommerce → Uzsakymai PASLEPTAS
CSS'u — puslapis PRIVALO likti veikiantis (per ji vykdomi vezeju lipdukai,
manifestai, saskaitos).

**Eiles (kaireje tik tai, kur reikia veiksmo):**
```
Nauji · Neapmoketi · Laukia prekiu · Paruosta siusti · Klausimai
Atsaukti · Visi uzsakymai        <- paieska, ne darbas
```
„Kelyje" ir „Ivykdyti" NERA eiles — filtrai skiltyje „Visi".

**Filtrai — DVI ASYS, niekada nemaisomos vienoje eiluteje:**
```
Vykdymas     Sava (AV) · Dropship · Misrus · pagal tiekeja
Pristatymas  Venipak kurjeris · Venipak pastomatas · LP Express
Data         Siandien · Vakar · Savaite · Menuo · Praejes · Intervalas
```

Viena eilute = vienas uzsakymas, VIENAS pagrindinis veiksmas, kurio uzrasas
keiciasi pagal eile. Kliento pastaba rodoma PILNA, nekarpoma.
Klaviatura: j/k, Enter, x, /, Esc.

---

### VEIKSMU SLUOKSNIS (AI paruosimas)

VISI veiksmai eina per viena vieta: `admin_post_ps_desk_veiksmas` → nonce →
teisiu patikra → vykdymas → irasas i uzsakymo istorija → grizimas.
Kai atsiras automatiniai siulymai, jie kvies TA PATI vykdyma — tik su zmogaus
patvirtinimu. Kaireje paruostas „Siulymai" lizdas.

```
apmoketa       payment_complete() + AV nurasymas + laiskas (varnele „nesiusti")
atsaukti       cancelled + prekes grizta; laiskas NESIUNCIAMAS pagal nutylejima
lapai          transient → ps-lapai
perduoti       transient → ps-dropship
vp_reg         Venipak registracija grupei su savo manifestu
vp_manifestas  manifesto PDF is Venipak
pakuotes       deziu skaicius siuntai
klaus          klausimo sprendimai
```

Dialogas su varnelemis vietoj `confirm()` — nes reikejo pasirinkimo
„nesiusti laisko" / „pranesti klientui".

---

### RYTINE EIGA (`page=ps-desk&view=rytas`)

```
1 Perziura          partija UZRAKINAMA 3 val.
2 Surinkimo lapai   AV prekes
3 Venipak           pagal sandelius, kiekvienam savas manifestas
4 LP Express        riba 13:00
5 Tiekejams         perdavimo ekranas
6 Baigta            suvestine
```
Zingsniai SPAUDZIAMI (Belacor kurjeris 10:00 — sokti tiesiai i 5).
Darbo mygtukai atidaro NAUJA kortele. Jau perduoti uzsakymai neitraukiami.

---

### VENIPAK

**Manifestai pagal sandeli.** Manifesto pavadinimas = kliento_ID + data + kodas.
Kodas imamas is plugino nustatymu ir SAVAIME NESIKEICIA — be isikisimo visos
dienos siuntos suguldavo i VIENA manifesta (AV, VF, Quattro kartu).

Sprendimas: pries kiekvienos grupes registracija per Reflection laikinai
nustatomas grupes kodas, po to grazinamas.
```
AV 001 · VF 002 · ZB 003 · Quattro 004 · Prins 005 · Ambrosia 006 · Belacor 007
```
Vienas manifestas = vienas kurjerio paemimas is vieno adreso.
SIUNTEJAS VISOSE SIUNTOSE — UAB Avesa, nesvarbu is kurio sandelio prekе isvaziuoja.
Grupe siunciama VIENU XML, ne po viena, kaip daro pats pluginas.

**Statuso keitimas isjungtas:** `isstatuschangedisabled = 'on'`. Anksciau
registracija iskart darydavo „Ivykdytas" ir siusdavo klientui laiska.

**Manifesto PDF:** `go.venipak.lt/ws/print_list`, laukas `code` = MANIFESTO
numeris (ne siuntos). Grazina application/pdf. Patikrinta gyvai.

**Misrus uzsakymai automatiskai NEREGISTRUOJAMI** — pluginas vienam uzsakymui
moka tik viena siunta, o misrus fiziskai iskeliauja is dvieju vietu.

Patikrinta gyvai: `<answer type="ok">` pack V07267E1000002, manifestas
07267260805001; PDF 66 510 B. Testines siuntos Raimio istrintos.

---

### LP EXPRESS

```
pastomatas   dydi parenka PATS pagal bendra svori (size-service)
kurjeris     deziu skaicius per lauka lp_part_count → API partCount
riba         13:00
```
`_woo_lithuaniapost_lpexpress_courier_called_date` → rodoma „kurjeris jau
iskviestas", kad nebutu kviečiama dukart.

**ISPEJIMAS: lipduko formavimas LP sistemoje IKART ISSIKVIECIA KURJERI** —
todel LP kelio testuoti negalima. Kodas parasytas is plugino kodo skaitymo.
NEPATIKRINTA su realia siunta: ar partCount realiai nueina.

---

### PAKUOCIU SKAICIUS
```
Venipak kurjeris     packs[] masyvas su padalintu svoriu
LP kurjeris          partCount
pastomatai           nereikia — visada viena
```
Saugoma `_ps_pakuociu`; laukelis rodomas tik kurjerio siuntoms.

---

### SANDELIU RIBOS
```
AV 11:00 · VF 13:00 · ZB 09:00 · Prins 09:00
Belacor 09:00 · Quattro 09:00 · Ambrosia 10:00 · LP 13:00
```
Rodoma: virsutineje juostoje (artimiausia), prie uzsakymo sarase, Venipak grupiu
antrastese. Skaiciuojama realiu laiku; praejus — „keliaus rytoj".
5 zingsnyje tiekejai rikiuojami pagal skubuma.

---

### TIEKIMAS (petshop-av-tiekimas.php, `page=ps-tiekimas`)

Naujos lenteles:
```sql
gaj6_ps_tiekimas      id, tiekejas, busena, sukurta, uzsakyta, gauta,
                      siuntos_kodas, pastaba      (kaupiama→uzsakyta→gauta)
gaj6_ps_tiekimas_eil  id, partija_id, product_id, order_id, qty,
                      qty_gauta, galiojimas, pastaba
```

**DU KELIAI:**
```
A. AS UZSAKAU LAISKU
   eilute → „I tiekimo lentele" → kaupiasi → „Uzsakyti" → laiskas
   → priemimas (FAKTINIAI kiekiai) → AV likutis + uzsakymai atsilaisvina

B. TIEKEJAS ATVEZA PATS
   suvedu saskaita → „Atnaujinti likucius" → susieja su lauk. uzsakymais
```

**PUSIAU AUTOMATINIS KAUPIMAS.** Sistema uz Raimi NESPRENDZIA: misrus uzsakymas
guli „Naujuose" kaip visi, o prie kiekvienos tiekejo eilutes skydelyje yra
mygtukas „I tiekimo lentele". Nepaspaudei — eilute lieka dropshipu.
Sprendimas EILUTES lygmens, todel „VF siuncia pats, ZB parsivezam" gaunasi
savaime. Uzdaro visus derinius: AV+VF, VF+ZB, VF+ZB+AV, Quattro+Prins.

**Priemimas:** numatyta tai, kas uzsakyta — keiti tik kur nesutampa. Galiojimas —
isskleidziamas laukelis; prekems, kurioms data jau kada iravesta, atsidaro pats
ir rodo esama. Trukumas automatiskai keliauja i nauja to paties tiekejo partija.

**Likuciu atnaujinimas — TAISYKLE: kas laukia ILGIAU, tas gauna pirmas.**
Kitaip vienas gautu dali, kitas dali, ir ne vienas neisvaziuotu.
Pries vykdant rodoma perziura.

**ZB isimtis:** ZB uzsakymai vedami i ju sistema, ne laisku. El. pasto sistemoje
nera — partija uzsidarys, bet laiskas neiseis su geltonu ispejimu.
NEUZDARYTA: ZB kopijuojama lentele vietoj laisko.

---

### KLAUSIMAI

Uzsakymai, kuriu sistema apdoroti negali. Neguli tarp „Nauju" ir nepatenka i
rytine eiga, kad neuzstrigtu partija.
```
Truksta sandelyje · Mokejimas nepavyko · Siuntos sukurti nepavyko
Klientas atsisako (_ps_withdrawal — ES mygtukas dar nepastatytas)
```
Rodomi kortelemis su mygtukais: Siusti is {tiekejas} · Parsivezti i AV ·
Laukti · Atsaukti uzsakyma.

**„Laukti" — JOKIOS AUTOMATIKOS.** Tik pazymi; priminimu nera (Raimio sprendimas).
**Pinigu grazinimas RANKINIS.** Paysera automatinio grazinimo NEPALAIKO
(`refund: ne`). Sistema fiksuoja ir ruosia dokumentus, bet pinigu negrazina.

---

### SANDELIU MODELIS (Raimio sprendimas 2026-08-06)

**SEPTYNI sandeliai:** AV · Ambrosia · Prins · Belacor · Quattro · VF · ZB
**Legacy NERA sandelis** — laikinas maisas, turintis istustеti.

**Kilme ir turejimas — DU SKIRTINGI KLAUSIMAI:**
```
kilme         is kur gaunu — vienas is 7 sandeliu
AV likutis    ar turiu pas save DABAR — VIENAS stulpelis VISOMS prekems
```
AV likutis NERA atskiras sandelis. Bet kurios kilmes preke gali guleti Raimio
lentynoje: parsivezei ZB skanestu — AV likutis 3, kilme lieka ZB.

**Uzsakymo sprendimas — VIENA taisykle visoms prekems:**
```
turiu AV likutyje?   TAIP → siunciu pats
                     NE   → perduodu kilmes sandeliui
```

**Rusiavimo taisykle (legacy prekems):** zenklas Quattro → Quattro,
Prins → Prins, Belacor tofu ir Wonder kraikai → Belacor, VISOS KITOS → AV.
Sausas bandymas: Quattro/Prins/Belacor legacy maise NERA — jau priskirtos.
Vadinasi visos 959 legacy publish prekes → AV.

**`_ps_sandelis` irasytas (S595):**
```
av 1401 · vf 1161 · zb 1059 · quattro 64 · belcor_tofu 62 · prins 43
ambrosia 15                                          viso 3 805
```
Sandelis dabar DUOMUO, ne kaskart perskaiciuojamas speijimas — todel ji galima
keisti ranka inventorizacijos metu.

---

### NAUJI META LAUKAI
```
_ps_sandelis          preke      av/vf/zb/quattro/prins/belcor_tofu/ambrosia
_ps_pakuociu          uzsakymas  deziu skaicius kurjerio siuntai
_ps_tiekimas_laukia   uzsakymas  1 = laukia prekiu atvezimo
_ps_klaus_laukti      uzsakymas  data, kada pazymeta „laukti"
```

---

### ★★★ INCIDENTAS S582 → S590 — DU LAUKAI, DU MODELIAI ★★★

**Kas nutiko.** S580 patikra parode `Stock::qty() = 0`, o tuo paciu metu
`resolve()['av_qty'] = 3`. Palaikiau tai `resolve()` kesо klaida ir S582
perjungiau trukumo tikrinima i `Stock::qty()`.

**Pasekme.** `Stock::qty()` skaito `_own_stock_qty`, kuri turi vos 3 prekes.
Visoms legacy prekems (959 publish) jis grazina `null` → 0 → KIEKVIENA LEGACY
PREKE ATRODE TRUKSTAMA. Klausimu eile prisipilde melagingu irasu.

**Tikroji priezastis** (parasyta paciame `AV_Source::resolve()` kode):
```
legacy preke = AV sandelis, likutis WooCommerce `_stock` lauke
`_own_stock_qty` reikalingas TIK prekems, kurios turi IR tiekeja (ju 3)
```

**Istaisyta S590:** trukumo tikrinimas grazintas i `resolve()['av_qty']` su
salyga `source === 'av'`.

**PAMOKA: pries keiciant logika del skaiciu nesutapimo — PERSKAITYTI KODA.
Nesutapimas dazniau reiskia du skirtingus laukus, ne keso klaida.**

---

### ★★★ INCIDENTAS S584 → S586 — remove_submenu_page UZDARO PUSLAPI ★★★

`remove_submenu_page('woocommerce','wc-orders')` punkta paslepe, bet PUSLAPI
UZDARE — `wc-orders` eme grazinti **403**. Per ta puslapi vykdomi VISI vezeju ir
saskaitu masiniai veiksmai, tad lipdukai butu nustoje veikti be jokio matomo
rysio su priezastimi.

Istaisyta CSS slepimu:
```css
#adminmenu a[href*="page=wc-orders"]{display:none!important}
```
Puslapis grazina 200, punktas nematomas.

---

### SVETIMU PLUGINU TRUKUMAI (rasti sioje sesijoje)

| Pluginas | Trukumas |
|---|---|
| Venipak | apie nesekme NEPRANESA; klaida iraso i meta, bet nerodo |
| Venipak | manifesto kodas fiksuotas — visa diena i viena manifesta |
| Venipak | registracija keitе statusa i completed (isjungta nustatymu) |
| LP Express | `Undefined array key "id"` ispejimas kiekvieno masinio veiksmo metu |
| LP Express | lipduko formavimas iskart issikviecia kurjeri — testuoti negalima |
| Paysera | automatinio grazinimo nepalaiko (`refund: ne`) |

---

### TECHNINES PAMOKOS (PRINCIPAI)

- **Sintakses sargas pries rasant failа:** `token_get_all($code, TOKEN_PARSE)`
  gaudo `ParseError` — failas NEIRASOMAS, jei blogas. Suveike S518.
- **`remove_submenu_page()` uzdaro puslapi** (403) — slepti tik CSS.
- **Nespek plugino veiksmu vardu.** Visi trys speti buvo klaidingi. Tikrieji
  nuskaityti is WC saraso: `shopup_venipak_shipping_labels`,
  `woo_lp_print_label`, `wcdn_print_invoice`, `wcdn_print_creditnote`.
- **Vezeju pluginai tyli** — darbalaukis privalo PATS pasitikrinti rezultata
  (ar atsirado siuntos kodas), o ne pasitiketi, kad veiksmas pavyko.
- **SKU nera prekes ID.** S578 nunulinau ne ta preke, nes 48375 buvo SKU.

---

### NEUZDARYTA (kritine tvarka)

```
1. Resolveris dar NESKAITO _ps_sandelis — laukas irasytas, elgsena sena
2. AV_Source nesupranta „av" vietoj „legacy"
3. Preke be sandelio → Klausimai (nepadaryta)
4. AV likutis dviejuose laukuose: _own_stock_qty (3 prekes) ir _stock (legacy)
5. Tiekimo priemimas raso i _own_stock_qty — legacy prekems NEVEIKS
6. Lipduko prisegimas prie tiekimo laisko (dukart klausti)
7. ZB kopijuojama lentele vietoj laisko
8. ES „Atsisakyti sutarties" mygtukas + KR-AVPN kreditine
9. LP partCount nepatikrintas su realia siunta — RAIMIS
10. Prekiu svoriu auditas (LP dydziui) — RAIMIS
11. Inventorizacija: kurios Belacor/Quattro prekes guli AV — RAIMIS
12. Zodis „legacy" pasalinamas, kai liks 0 prekiu
```

Auksciausias decision Nr.: **S595**.

---

