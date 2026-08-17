# §29 FULFILLMENT — TYRIMAS 2026-08-17 [S920-S923]

> **NIEKO NEPAKEISTA.** Visi keturi paleidimai — tik skaitymas. Į duomenų bazę
> neįrašyta nė vieno baito, į `mu-plugins` neįdiegta nieko, esamų failų
> neliesta. Šis dokumentas — medžiaga tavo sprendimui, ne atliktas darbas.

---

## 1. IŠVADA PIRMA (nes ji keičia užduoties formą)

Auditas §29 aprašė taip: *„12 neuždarytų punktų, šaknis — resolveris neskaito
`_ps_sandelis`."* Tai suformuluota kaip **resolverio yda**, kurią reikia taisyti.

**Išmatavus paaiškėjo priešingai.**

```
Palygintos VISOS 3 749 prekės (publish + draft)
resolve() ir _ps_sandelis SUTAMPA         3 732   (99,5 %)
nesutampa                                     17   (0,5 %)
```

Ir svarbiausia — **išnagrinėjus tuos 17, resolveris teisus 12 kartų iš 17.**
Klaidingas dažniau yra `_ps_sandelis`, ne resolveris.

Vadinasi „perjungti resolverį skaityti `_ps_sandelis`" reikštų ne pataisymą,
o **regresiją**: sistema pradėtų klysti ten, kur dabar atsako teisingai.

---

## 2. KAIP RESOLVERIS VEIKIA IŠ TIKRŲJŲ

`Petshop_Fulfillment_Source::resolve( int $product_id ): array`
(`wp-content/plugins/petshop-xml/includes/class-fulfillment-source.php`, 6 711 B)

Parašai patikrinti per `ReflectionClass`, ne spėti:

```
static resolve($product_id)          <- vienintelis viešas įėjimas
static is_venipak_only($product_id)
private dropship_map()
private is_zb($pid) · is_vf($pid) · detect_dropship($pid)
```

Sprendimo eilė — pirmas atitikimas laimi:

```
1. ZB       _zb_enabled=yes  ARBA  _zb_cost≠''  ARBA  _zb_supplier_sku≠''
2. VF       _vf_enabled=yes  ARBA  _vf_cost≠''  ARBA  _vf_supplier_sku≠''
3. dropship _legacy_manufacturer substring  ARBA  product_brand slug
            (quattro · ambrosia · belcor_tofu[Belacor/belocat] · prins)
4. legacy   viskas kita — „nėra tiekėjo / dropship požymių"
```

Klasė yra **pure read, runtime** — nieko nerašo į meta. Todėl ji negali
„pasenti", bet todėl pat ji ir nemato nieko, ko nėra tiekėjo meta laukuose.

### Vardų neatitikimas

```
resolve() grąžina   legacy
_ps_sandelis turi   av
```

Tai tas pats dalykas dviem vardais. Skaičiuojant sunorminau (`legacy` = `av`),
antraip „nesutapimų" būtų buvę 1 348 vietoj 17. **Tai ir yra §29 punktas 12**
(„žodis legacy pašalinamas") — ne kosmetika, o realus painiavos šaltinis.

---

## 3. PILNA MATRICA (3 749 prekės)

```
_ps_sandelis -> resolve()          viso   publish  draft   pagrindas
av           -> legacy             1348      910    438    nėra požymių
vf           -> vf                 1161      978    183    VF meta
zb           -> zb                 1059      576    483    ZB meta
quattro      -> quattro              64       64      0    _legacy_manufacturer
prins        -> prins                43       23     20    _legacy_manufacturer
belcor_tofu  -> belcor_tofu          42       42      0    _legacy_manufacturer
ambrosia     -> ambrosia             15       15      0    _legacy_manufacturer
--- nesutampa ---
vf           -> legacy                6        6      0    <- A grupė
(tuščia)     -> legacy                6        0      6    <- C grupė
(tuščia)     -> zb                    3        0      3    <- B grupė
(tuščia)     -> vf                    2        1      1    <- B grupė
```

Nė vienas dropship šaltinis nesusipainiojo tarpusavyje. 1 348 „av" prekės visos
iki vienos gavo `legacy` su ta pačia priežastimi.

**Našumas:** visos 3 749 per **3,5 s**, atmintis 108 MB (kešas valomas kas
prekę pagal S646 pamoką).

---

## 4. VISI 17 NESUTAPIMŲ — PO VIENĄ

### A grupė — 6 prekės: klaidingas yra `_ps_sandelis`, ne resolveris

```
34932  Skanėstų dėžė šuniui — be vištienos      sandelis=vf  resolve=legacy
34933  Skanėstų dėžė šuniui — hipoalerginė      sandelis=vf  resolve=legacy
34934  Skanėstų dėžė šuniui — jautriam virškin. sandelis=vf  resolve=legacy
34935  Skanėstų dėžė šuniui — monoproteinas     sandelis=vf  resolve=legacy
34936  Skanėstų dėžutė katei                    sandelis=vf  resolve=legacy
34937  Kramtalų dėžė šuniui                     sandelis=vf  resolve=legacy
```

Visos šešios turi `_ps_laukas = yes` — tai **surenkamų rinkinių laukai**, ne
tiekiamos prekės. Jos neturi nei SKU, nei EAN, nei jokio VF meta lauko.
`_ps_sandelis=vf` joms yra klaida, o resolveris atsako teisingai.

**Ir šalia — antra klaida tose pačiose šešiose.** `ps_sources` registre jos
turi įrašą:

```
source = 'VF'   <- DIDŽIOSIOMIS; visur kitur registre 'vf' mažosiomis
is_active = 0
is_sellable = 1
```

Didžiosios raidės reiškia, kad bet koks palyginimas `source === 'vf'` šitų
eilučių nepagaus. Nežinau, ar tai kur nors realiai lemia elgseną — nepatikrinau,
nes tam reikėtų lįsti į registro naudotojus. **Užrašau kaip atskirą radinį.**

### B grupė — 5 prekės: `_ps_sandelis` tiesiog neužpildytas

```
34909  FLEXI pavadėlis Comfort Plus XS   PUBLISH  _vf_cost=9.58  _vf_qty=10
34929  Happet elnio ragas XL             draft    _vf_cost=11.93
34953  Beaphar Brewer Yeast 250pcs       draft    _zb_cost=9.027
34954  Beaphar STOP IT SPRAY 500ML       draft    _zb_cost=10.593
34955  TRIXIE Niro Hop-In kačių kraikas  draft    _zb_cost=25.155
```

Visos penkios turi pilną tiekėjo meta, ir resolveris jas atpažįsta teisingai.
Trūksta tik `_ps_sandelis` — **ir `ps_sources` registro įrašo (visų penkių
`ps_sources` tuščias).**

Tai reiškia, kad **naujos prekės į registrą nepatenka.** Registro sinchronizacija
(`Petshop_Sources::sinchronizuoti()`, naktinis cron 04:20) šitų nepagavo.
Kodėl — neišsiaiškinau, nes tam būtų reikėję leisti sinchronizaciją, o tai jau
rašymas.

**34909 yra PUBLISH.** Katalogo langas, `petshop-gavimas` ir visa kita, kas
skaito `_ps_sandelis`, šitą prekę mato kaip „be sandėlio", nors ji pardavinėjama
ir turi VF likutį 10.

### C grupė — 6 prekės: testinės ir juodraštinės, viskas gerai

```
34889  PS-TEST-001 (testinė prekė, neliesti)   draft
34917  Exclusion ... „HYPM11 x2"               draft   rinkinių bandymas
34918  Exclusion ... SKU 12254                 draft   kat: rinkiniai
34920  „konservai" SKU 123                     draft   bandymas
34927  „startas" SKU a12a                      draft   bandymas
34938  „Skanestai katems2" (_ps_laukas=yes)    draft   laukas
```

Šioms `legacy` yra teisingas atsakymas. Veiksmų nereikia.

---

## 5. DU PASAULIAI, KURIE NESUSITINKA

Peržiūrėjau visus failus, kuriuose minimas `Fulfillment_Source` arba
`_ps_sandelis`. Pasiskirstymas beveik idealiai atskiras:

```
FAILAS                                    Fulfillment_Source   _ps_sandelis
petshop-fbt.php                                   7                 0
flatsome-child/functions.php                      7                 0
petshop-m8-food.php                               6                 0
petshop-promotions.php                            4                 0
class-event-emitters.php                          3                 0
petshop-av-limit.php · av-stock.php · pet-dashboard  2 kiekv.       0
------------------------------------------------------------------
petshop-laukai.php                                0                18
petshop-katalogas.php                             0                16
petshop-gavimas.php                               0                 4
petshop-rinkiniai.php · vartai.php                0                 3 kiekv.
petshop-ivykiai.php                               0                 2
petshop-parseris.php · partijos.php               0                 1 kiekv.
```

**Nė vienas failas nenaudoja abiejų.** Pirkėjo pusė (FBT, akcijos, tema,
M8, pristatymo ribojimas) gyvena ant `resolve()`. Administravimo pusė
(katalogas, gavimas, rinkiniai, partijos) gyvena ant `_ps_sandelis`.

Tai paaiškina, kodėl niekas nelūžta: abu beveik visada sutaria. Ir tuo pačiu
paaiškina riziką — **kai jie nesutaria, niekas apie tai nepraneša.** 34909
yra gyvas to pavyzdys.

---

## 6. 12 §29 PUNKTŲ — KURIE REALIAI PRIKLAUSO NUO ŠITO

| # | Punktas | Ar priklauso |
|---|---|---|
| 1 | Resolveris neskaito `_ps_sandelis` | **Ne yda.** Perrašyti klausimą |
| 2 | AV_Source nesupranta „av" vietoj „legacy" | TAIP — vardų vienodinimas |
| 12 | Žodis „legacy" pašalinamas | TAIP — tas pats darbas |
| 3 | Prekė be sandėlio → Klausimai | TAIP — B grupė (5 prekės) yra būtent tai |
| 4 | AV likutis dviejuose laukuose | NE — atskira likučių tema |
| 5 | Tiekimo priėmimas rašo į `_own_stock_qty` | NE — atskira |
| 6 | Lipduko prisegimas prie laiško | NE |
| 7 | ZB kopijuojama lentelė vietoj laiško | NE |
| 8 | ES „Atsisakyti sutarties" + KR-AVPN | NE |
| 9 | LP partCount su realia siunta | NE — tavo darbas |
| 10 | Prekių svorių auditas | NE — tavo darbas |
| 11 | Inventorizacija Belacor/Quattro | NE — tavo darbas |

**Nuo resolverio realiai priklauso 3 punktai iš 12**, ne visi. Likę devyni buvo
sugrupuoti po ta pačia antrašte, bet turi savo atskiras priežastis.

---

## 7. KĄ SIŪLAU (tavo sprendimas, ne mano)

### Variantas A — vardų vienodinimas ir nieko daugiau (siūlau šitą)

`resolve()` grąžina `av` vietoj `legacy`. Viena eilutė klasėje plius
suderinimas visose vietose, kur lyginama su `'legacy'`.

```
+ uždaro §29 punktus 2 ir 12
+ po jo abi sistemos kalba ta pačia kalba, palyginimas tampa įmanomas
- reikia peržiūrėti VISAS vietas, kur tikrinama =='legacy'
  (radau bent: av-limit.php:47, av-stock.php:194, fbt, promotions)
rizika: VIDUTINĖ — tyliai lūžtantis palyginimas yra blogiausias atvejis
```

### Variantas B — `_ps_sandelis` kaip pirmas šaltinis, meta kaip atsarga

`resolve()` pirma žiūri `_ps_sandelis`, ir tik jo nesant eina senuoju keliu.

```
+ administravimo pusės sprendimas tampa viršesnis
- BŪTENT ŠITAS sugadintų 6 A grupės prekes (dabar teisingai legacy,
  taptų vf), nes klaidingas duomuo taptų viršesnis už teisingą logiką
rizika: DIDELĖ, ir tai kontrintuityvu — atrodo kaip „pataisymas"
```

Šito **nesiūlau**, nors būtent jį numanė auditas.

### Variantas C — nieko nekeisti resolveryje, sutvarkyti duomenis

```
6 A grupės prekėms   pašalinti _ps_sandelis (jos ne prekės, o laukai)
5 B grupės prekėms   užpildyti _ps_sandelis + registro įrašą
                     ir išsiaiškinti, kodėl sinchronizacija jų nepagavo
```

Tai mažiausiai rizikinga ir uždaro §29 punktą 3. Bet nepakeičia to, kad dvi
sistemos toliau gyvena atskirai.

**Mano siūlymas: C dabar, A po launch.** Priežastis — C yra 11 prekių, kurias
galima patikrinti akimis. A liečia palyginimus penkiuose failuose, o tokie
dalykai lūžta tyliai; iki scope freeze liko 14 dienų, ir tai ne tas darbas,
kurį verta daryti skubant.

---

## 8. KLAUSIMAI TAU (be jų nejudu)

```
K1  A grupės 6 laukai: ar sutinki, kad _ps_sandelis jiems apskritai
    neturi būti? (Jie ne prekės, o rinkinių laukai.)

K2  ps_sources įrašai su source='VF' DIDŽIOSIOMIS — ar tai kur nors
    naudojama, ar galima taisyti į 'vf'? Aš nepatikrinau visų naudotojų.

K3  34909 FLEXI yra PUBLISH be _ps_sandelis. Ar tokios prekės turi
    kristi į „Klausimus" (§29 punktas 3), ar tyliai užpildomos?

K4  Variantas A (legacy -> av) — dabar ar po launch?

K5  Kodėl naujos prekės nepatenka į ps_sources registrą — ar tiriu?
    Tam reikės leisti sinchronizaciją, t.y. rašymą.
```

---

## 9. KO NEPADARIAU IR KODĖL

```
Nepaleidau Petshop_Sources::sinchronizuoti()   — tai rašymas
Nepatikrinau, ar 'VF' didžiosiomis kur nors lemia elgseną — reikėtų
  lįsti į registro naudotojus, o jų dar neperžiūrėjau
Neparašiau kodo variantui A                     — kol nėra tavo sprendimo,
  tai būtų spėjimas, kurį vėliau reikėtų mesti
Nepatikrinau, ar A grupės 6 laukai realiai dalyvauja checkout'e
  (pristatymo ribojime) — tam reikia naršyklės testo su krepšeliu
```

Paskutinis punktas man atrodo vertingiausias iš neatliktų: jei rinkinio
laukas patenka į krepšelį ir `resolve()` jam grąžina `legacy` (carrier=any),
o realios prekės viduje yra VF (carrier=venipak), tai pristatymo ribojimas
gali praleisti negalimą variantą. **Tai patikrinama be jokio rašymo** — tik
reikia daugiau laiko. Jei nori, tai bus kitas mano žingsnis.
