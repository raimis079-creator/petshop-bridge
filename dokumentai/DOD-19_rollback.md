# DOD-19 — ATSITRAUKIMO PLANAS (rollback)

**Versija:** 2.2 · 2026-08-19 (naktis)
**Būsena:** ✅ PATVIRTINTAS. §8 abu raudoni punktai UŽDARYTI.
**Priklausomybė:** DOD-18 parašytas (`dokumentai/DOD-18_perjungimas.md`).
**Perjungimo data:** 2026-09-01/02, naktį, vidury savaitės.

---

## 0. IŠMATUOTA BŪKLĖ (v1.0 neaiškumas IŠSPRĘSTAS)

v1.0 buvo parašyta nežinant, kaip technikai vyks perjungimas. **Dabar žinoma
(§8l, 2026-08-17 DNS matavimas):**

```
šis serveris          79.98.29.24
petshop.lt A          213.226.161.16  IR  213.226.161.15    ← DU įrašai
www.petshop.lt        CNAME → petshop.lt
A TTL 3600 · NS TTL 86400 · NS: ns1–ns4.serveriai.lt
eShoprent: HTTP 200, nginx/1.22.1 — gyva
```

**Galioja SCENARIJUS B — tikras DNS keitimas.** Domenas rodo į eShoprent
serverius, ne į šį. Vadinasi §3.1 trukmė priklauso nuo TTL, ir T-2 TTL
mažinimas yra **privalomas**, ne rekomendacija.

**Trys radiniai (patikslinta 2026-08-19):**

1. **`serveriai.lt` ir `iv.lt` yra TA PATI įmonė** — UAB „Interneto vizija".
   v1.0 teiginys „zoną valdo serveriai.lt, ne iv.lt" buvo netikslus.
   ```
   petshop.lt NS   ns1–ns4.serveriai.lt
   SOA hostmaster  hostmaster.iv.lt        ← iv.lt adresas serveriai.lt zonoje
   iv.lt NS        ns1–ns4.serveriai.lt    ← ir pats iv.lt ten pat
   ```
   Zoną valdai per **tą pačią iv.lt paskyrą** (UAB „Avesa").

2. **A įrašų DU.** Pakeitus vieną, dalis srauto liktų sename serveryje, ir
   užsakymai pasiskirstytų per dvi sistemas. **Keisti BŪTINA abu**, ir tai
   galioja tiek perjungimui, tiek grįžimui.

3. **`www` yra CNAME, ne A įrašas** → seka automatiškai.
   ```
   petshop.lt      A      213.226.161.16 · .15   TTL 3600
   www.petshop.lt  CNAME  → petshop.lt           TTL 3600
   avesa.lt        A      79.98.29.24            ← jau naujajame serveryje
   ```
   **Keisti reikia DVIEJŲ įrašų, ne keturių.**

---

## 1. KĄ REIŠKIA „ROLLBACK" ŠIAME PROJEKTE

Ne vieną dalyką, o **keturis nepriklausomus sluoksnius**. Juos galima
atsukti atskirai, ir dažniausiai reikia tik vieno.

```
1. SRAUTAS      kur eina lankytojas          atsukama greičiausiai
2. KODAS        mu-plugins, tema, snippetai  atsukama per failus
3. DUOMENYS     DB (užsakymai, klientai)     atsukama per backup — BRANGIAUSIA
4. IŠORINIAI    Paysera, Venipak, LP, feed'ai atsukama rankomis
```

**Kritinė taisyklė:** 3-ias sluoksnis atsukamas TIK tuo atveju, jei po
perjungimo dar nebuvo realaus užsakymo. Atstačius DB po pirmo kliento
užsakymo — tas užsakymas dingsta. Todėl §4 „taškas be grįžimo".

---

## 2. SPRENDIMO MEDIS — KADA APSKRITAI TRAUKTIS

Traukimasis yra brangus. Dauguma gedimų taisomi vietoje.

```
Ar svetainė atsidaro?
├─ NE  → §3.1 SRAUTO grąžinimas (greitas, saugus)
└─ TAIP
   ├─ Ar galima nusipirkti? (krepšelis → apmokėjimas → processing)
   │  ├─ NE  → §3.2 KODO atsukimas; jei nepadeda per 30 min → §3.1
   │  └─ TAIP
   │     ├─ Ar kainos/likučiai teisingi?
   │     │  ├─ NE  → taisyti vietoje, NEtraukti (§5 dažniausi atvejai)
   │     │  └─ TAIP → veikia, stebim
   │     └─ Ar užsakymai pasiekia terra@petshop.lt?
   │        └─ NE → taisyti vietoje, užsakymai NEDINGSTA (guli DB)
```

**Vienintelis atvejis, kai traukiamasi nedelsiant:** parduotuvė neatsidaro
arba nusipirkti neįmanoma. Viskas kita — taisoma gyvai.

---

## 3. TRYS ATSITRAUKIMO KELIAI

### 3.1 SRAUTO grąžinimas — greičiausias

**Galioja tik scenarijus B (žr. §0).**

```
1. serveriai.lt zonoje: ABU A įrašai → atgal į 213.226.161.16 ir .15
2. Laukiama TTL
Trukmė: 5 min., JEI TTL sumažintas iš anksto. Kitaip — iki 1 val.
```

> **TTL mažinimas T-2 yra privalomas.** Jei jis nebus sumažintas, grįžimas
> truks tiek, kiek buvo senasis TTL (3600 s), ir pagreitinti NEĮMANOMA.

**Antras žingsnis, kurio v1.0 neturėjo — PAYSERA.**

Jei perjungimo metu buvo pakeisti Paysera projekto 29276 adresai, grįžtant
juos reikia **grąžinti taip pat**. Kitaip senoji platforma priims užsakymus,
bet mokėjimai lūš.

```
grįžimas = DNS (abu A įrašai)  +  Paysera adresai, JEI buvo keisti
```

### 3.2 KODO atsukimas — kai svetainė gyva, bet lūžta funkcija

Kodas gyvena `mu-plugins`, ir kiekvienas modulis turi kopiją
`wp-content/uploads/ps-backups/`. Modulio išjungimas = failo pervadinimas.

```
Įtariamas modulis → pervadinti į .php.off → patikrinti → jei padėjo, palikti
```

**Snippetai:** išjungiami per Code Snippets (`active=0`). Trynimas
neveikia (REST DELETE grąžina `rest_cannot_delete`) — tik deaktyvavimas.

**Visų mu-plugins atjungimas iš karto NEREKOMENDUOJAMAS:** dalis jų laiko
parduotuvės logiką (kainodara, likučiai, fulfillment). Atjungus viską
svetainė veiks, bet pardavinės neteisingai — blogiau nei neveikianti.

### 3.3 DUOMENŲ atstatymas — paskutinė priemonė

Infrastruktūra veikia ir **įrodyta** (§8f–8h):

```
kopija        kas parą 04:00 → Backblaze B2, AES-256-CBC + HMAC-SHA256
sargas        10:00 tikrina amžių, praneša laišku
atstatymas    testuotas 2026-08-04: 174/174 lentelės, 0 skirtumų, 92,3 s
              lietuviškos raidės išliko, serialized OK
```

**Eiga:**
```
1. Parduotuvę į priežiūros režimą (žr. §7d) — klientai nepirktų į atstatomą bazę
2. Parsisiųsti kopiją iš B2, patikrinti SHA-1 ir HMAC
3. Dešifruoti, atstatyti
4. Palyginti su manifestu (lentelių ir eilučių skaičiai)
5. Patikrinti akimis: prekė, krepšelis, užsakymų sąrašas
6. Išjungti priežiūros režimą
```

**DU APRIBOJIMAI, KURIUOS BŪTINA ŽINOTI IŠ ANKSTO:**

1. **Atstatymas testuotas į TĄ PAČIĄ bazę su `rtst_` prefiksu, ne į švarią.**
   ✅ **IŠMATUOTA 2026-08-19 (§7e):** WP vartotojas tikrai negali kurti DB —
   `Access denied to database`. Teisės: `GRANT ALL ON gyvunai2_nbpe1.*`,
   daugiau nieko. Be iš anksto paruoštos švarios bazės realaus gedimo metu
   atstatoma būtų į gyvą — ESAMI duomenys perrašomi, grįžti nebeįmanoma.
2. ✅ **PATIKRINTA 2026-08-19:** bazės numatytoji koduotė yra
   **`latin1` / `latin1_swedish_ci`**, lentelės utf8mb4. Vadinasi švari bazė
   PRIVALO būti sukurta `utf8mb4 / utf8mb4_unicode_ci` — kitaip dump'as ją
   atkurtų latin1 koduote ir lietuviškos raidės nukentėtų.

> **Todėl prieš bet kokį atstatymą — PIRMA padaryti esamos būklės kopiją**,
> net jei ji atrodo sugadinta. Be jos nebus kur grįžti, jei atstatymas
> pasirodys blogesnis už problemą.

---

## 4. TAŠKAS BE GRĮŽIMO

Nuo pirmo realaus kliento užsakymo DB atstatymas **nustoja būti
atsitraukimu ir tampa duomenų praradimu**.

```
PRIEŠ pirmą užsakymą   visi trys keliai atviri
PO pirmo užsakymo      3.1 ir 3.2 atviri · 3.3 UŽDARYTAS
                       (arba atstatoma tik dalis lentelių, rankomis)
```

**Praktinė išvada:** pirmas valandas po perjungimo reikia stebėti
aktyviai. Kol užsakymų nėra — klaida pigi. Po pirmo — brangi.

---

## 5. KĄ TAISOME VIETOJE, O NE TRAUKIAMĖS

Žinomos rizikos, kurių nė viena nereikalauja atsitraukimo:

| Simptomas | Priežastis | Sprendimas vietoje |
|---|---|---|
| Paveikslėliai/CSS nekraunami | Site URL `http://` vietoj `https://` | pataisyti į `https://petshop.lt` |
| Nuorodos veda į dev.avesa.lt | likę hardkoduoti URL | `woocommerce_email_header_image`, `wcdn_settings`, `cmplz_preloaded_privacy_info` |
| Laiškai neišeina | Sender/DNS | tikrinti SPF/DKIM, ne traukti |
| Importai nesuveikė | cron URL rodo į dev | 6 cron'ai: pakeisti domeną |
| Google nemato | „Discourage search engines" | išjungti (DOD-22) |
| Sąskaitų numeracija | AVPN/IAPV serijos | reset į 101 |

**Visi šie punktai yra OPS sąraše ir turi būti padaryti PRIEŠ perjungimą.**
Šioje lentelėje jie kartojami kaip diagnostikos pagalba, jei kuris nors
prasprūstų.

---

## 6. PASIRUOŠIMAS — KĄ PADARYTI IŠ ANKSTO

Rollback plano vertė matuojama tuo, kas padaryta PRIEŠ, o ne po.

```
T-14  IŠSIAIŠKINTI, kur rodo petshop.lt A įrašas (scenarijus A ar B)
      → nuo to priklauso visas §3.1
T-14  patikrinti, ar Installatron kopijos apima ir failus, ne tik DB
T-7   patikrinti, ar B2 kopija šviežia (sargas rodo OK)
T-2   JEI SCENARIJUS B: TTL → 300 s. Be to §3.1 trunka valandas.
T-1   rankinė pilna kopija PRIEŠ perjungimą (nelaukti 04:00 cron'o)
T-1   užsirašyti esamą būklę: prekių, užsakymų, vartotojų skaičiai —
      kad po perjungimo būtų su kuo lyginti
T-0   priežiūros režimo jungiklis paruoštas ir IŠBANDYTAS
```

**T-1 kopija yra svarbiausia eilutė šiame dokumente.** Automatinė kopija
daroma 04:00; jei perjungiama 10:00, prarandama 6 valandų darbo.

---

## 7. SAVININKO ATSAKYMAI (2026-08-19) — UŽRAKINTA

```
K1  Perjungimo langas
    ✅ NAKTIS, vidury savaitės. Data 2026-09-01/02.
    Pagrindimas (savininko): nuo mėnesio 6–7 d. prasideda didesni pirkimai
    (atlyginimai), 10–14 d. — pikas. Perjungti prieš piką = klaida
    brangiausiu metu. Mėnesio pradžia = klaida pigiausiu metu, plius
    savaitė su mažu srautu prieš piką.

K2  Kas pasiekiamas
    Naktį — niekas. Todėl langas renkamas taip, kad RYTOJAUS dieną būtų
    pasiekiami serveriai.lt, Paysera ir tiekėjai. Antradienis/trečiadienis.

K3  Sena platforma po perjungimo
    ✅ LIEKA GYVA. Sutartis su eShoprent galioja iki 2026-10-15.
    Perjungus rugsėjo pradžioje lieka PENKIOS SAVAITĖS atsarginio kelio.
    Tai iš esmės panaikina „taško be grįžimo" §3.1 lygmenyje.
    ⚠️ Sutarties NEnutraukti anksčiau — su ja dingsta §3.1.

K4  Aktyvaus stebėjimo trukmė
    Pirmos 2–3 valandos po perjungimo. Sprendimas grįžti priimamas jose,
    kol užsakymų nėra arba jų vienetai.
```

---

## 7b. PAYSERA — PRIVALOMAS ŽINGSNIS PERJUNGIMO NAKTĮ

Išmatuota 2026-08-19 (§8v): Paysera projekte 29276 adresai įrašyti
**fiksuotai ir tikrinami**. Bandymas iš `dev.avesa.lt` grąžino `bad_referer`
(0x13). Domenas po perjungimo sutaps savaime, bet **kelias skiriasi**:

```
sena platforma:  petshop.lt/index.php?route=extension/payment/paysera/callback
nauja sistema:   petshop.lt/?wc-api=paysera_callback
```

**Rizika:** nukreipimas veiks, klientas sumokės, pinigai bus nurašyti, o
callback nueis į adresą, kurio nebėra → užsakymas liks „laukiama apmokėjimo".
Iš išorės atrodo gerai.

**PRIVALOMA PROCEDŪRA:**

```
1. DNS pakeitimas (ABU A įrašai)
2. PRIEŠ SKELBIANT — 2,21 € pirkimas jau ties petshop.lt
      ✅ veikia            → uždaryta, tęsiam
      🔴 callback nulūžta  → pataisyti callbackurl projekte, pakartoti
3. Skelbiama TIK po sėkmingo pirkimo
```

> **NELEIDŽIAMA perjungti ir palikti mokėjimą nepatikrintą iki ryto.**
> Tai vienintelė vieta, kur klaida reiškia paimtus pinigus be užsakymo.

**Plius:** patikrinti, kad `test_mode = no`. Išmatuota, kad jis kartą grįžo
į `yes` savaime — **tikrinti du kartus**.

---

## 7c. SSL SERTIFIKATAS — PATVIRTINTA TIEKĖJO (2026-08-19)

**Išmatuota:** naujajame serveryje `petshop.lt` sertifikatas YRA, bet
**pasibaigęs prieš ketverius metus**:

```
CN        petshop.lt          SAN  petshop.lt, www.petshop.lt
išdavė    Let's Encrypt
galiojo   2022-10-02 → 2022-12-31      būklė: CERT_HAS_EXPIRED

palyginimui, dabartinė gyvoji (eShoprent):
galioja   2026-08-10 → 2026-11-08      patikima: taip
```

Jis užstrigo 2022-aisiais, kai domenas išėjo į eShoprent — Let's Encrypt
atnaujinimas nebepasiekė patikros.

**Perjungus DNS be sertifikato:** kiekvienas lankytojas gautų raudoną
„Jūsų ryšys nėra privatus". Nei Google, nei Paysera nesijungtų.

### Tiekėjo atsakymas (serveriai.lt / iv.lt, 2026-08-19)

```
✅ SSL NEMOKAMAS — svetainė talpinama jų serveryje (79.98.29.24)
   Mokamų sertifikatų (26–350 €/mėn.) PIRKTI NEREIKIA.

❌ Prieš DNS pakeitimą išduoti NEGALIMA — reikia, kad domenas ir www
   jau rodytų į jų serverio IP.

✅ TTL 3600 → 300 galima ir rekomenduojama.
   Įsigaliojimas: tarp TTL ir dvigubo TTL → prie 300 s tai 5–10 min.

Eiga: DNS → palaukti 5–10 min. → užklausti Let's Encrypt per klientų sistemą.
```

### ⚠️ Neuždarytas klausimas

**Ar `petshop.lt` yra hostingo paskyroje kaip domenas?** Jei nėra —
sertifikato nebus kam išduoti, ir perjungimo naktį pirma reikės pridėti
domeną DirectAdmin'e bei nurodyti dokumentų šaknį. Registre (§8b) matyti
`domains/petshop.lt 17 MB` — katalogas yra, bet beveik tuščias.

---

## 7d. PRIEŽIŪROS REŽIMAS — ĮDIEGTA IR PATIKRINTA (2026-08-19)

v1.0 ir v2.1 čia turėjo raudoną punktą: *„priežiūros režimo jungiklis
NEEGZISTUOJA"*. **Uždaryta.**

```
mu-plugins/petshop-prieziura.php   v1.0.1   6 235 B
md5  726867acabaa1067ad8d6ae19e0c9983
kopija: deploy/petshop-prieziura.php
```

### Naudojimas

```
ĮJUNGTI    sukurti  wp-content/uploads/ps-prieziura.flag
IŠJUNGTI   ištrinti tą patį failą
```

Abu veiksmai — **per DirectAdmin failų tvarkyklę**. Be WP admin, be SSH, be
tilto. Failo turinys neprivalomas: 1-oji eilutė = tekstas lankytojui,
2-oji eilutė = `Retry-After` sekundėmis (numatyta 1 800).

### Kodėl vėliava FAILU, o ne nustatymu duomenų bazėje

Šio dokumento §3.3 numato režimą įjungti **prieš DB atstatymą**. Jungiklis,
gyvenantis duomenų bazėje, tuo metu būtų nepasiekiamas — tiksliai tada, kai
jo vienintelio ir reikia.

### Ką praleidžia (patikrinta gyvai)

| Kelias | Su vėliava | Kodėl |
|---|---|---|
| Vitrina, prekė, kategorija | **503 + `Retry-After: 1800`** | tikslas |
| `?wc-api=paysera_callback` | **400** (WooCommerce apdorojo) | mokėjimų callback'ai NIEKADA neblokuojami |
| `/wp-admin/` | 302 | savininkas dirba |
| `/wp-login.php` | 200 | prisijungimas |
| **REST code-snippets** | **200, 1 747 įrašai** | **tiltas veikia priežiūros metu** |

> **503, ne 200 ir ne 302.** Google 503 neindeksuoja, bet ir **iš indekso
> neišmeta**. Po viso SEO sluoksnio tai ne smulkmena.

### Peržiūra be prisijungimo

`https://petshop.lt/?ps_prieziura=<raktas>` — nustato slapuką 12 val.
Raktas rodomas WP admin pranešime, kai režimas įjungtas.

### 🔒 Pamoka, kurios kaina buvo 4 minutės

Pirmoji versija kabėjo ant `init`. `init` vyksta **ir REST užklausoms** →
įjungus režimą užsidarė Code Snippets API, ir valymo kelias pats save
užblokavo. Išsikapstyta per `?wc-api=` praėjimą — tą patį saugiklį, kuris
buvo įdėtas mokėjimams saugoti.

> **Kodas, kuris blokuoja užklausas, privalo būti patikrintas ir iš savo
> paties IŠJUNGIMO kelio pusės.** Neužtenka įrodyti, kad blokavimas veikia.

Taisymas struktūrinis: `template_redirect` vietoj `init` — jis iš viso
nevyksta REST, admin-ajax, wc-api ir wp-cron kelyje.

---

## 7e. ŠVARI TESTINĖ BAZĖ — VIENAS SAVININKO VEIKSMAS

Išmatuota 2026-08-19:

```
DB              gyvunai2_nbpe1 · MariaDB 10.6.17 · 194 lentelės
teisės          GRANT USAGE ON *.*
                GRANT ALL PRIVILEGES ON `gyvunai2_nbpe1`.*
matomos DB      gyvunai2_nbpe1, information_schema  (VISKAS)
lentelę kurti   TAIP
BAZĘ kurti      NE — „Access denied to database 'gyvunai2_rtst_h084'"
koduotė         latin1 / latin1_swedish_ci   (lentelės utf8mb4)
```

**DirectAdmin, ~2 min:**

```
1. sukurti bazę   gyvunai2_rtst
   koduotė        utf8mb4 / utf8mb4_unicode_ci     ← BŪTINAI, ne latin1
2. priskirti prie jos ESAMĄ vartotoją gyvunai2_nbpe1 su visomis teisėmis
```

Naujo vartotojo **nereikia** — kitaip reikėtų ir naujo slaptažodžio
`wp-config.php`. Po to atstatymo testas į švarią bazę vykdomas per tiltą, ir
§8 antras punktas užsidaro galutinai.

---

## 7f. AKLA ZONA PO FAILŲ PERKĖLIMO — NAUJA RIZIKA

v1.0–v2.1 šito nebuvo. Išmatuota 2026-08-19:

```
dabar            dev.avesa.lt  →  parduotuvė        tiltas mato
po perkėlimo     dev.avesa.lt  →  tuščia            TILTAS AKLAS
                 petshop.lt    →  dar eShoprent
po DNS + SSL     petshop.lt    →  parduotuvė        tiltas vėl mato
```

Tarp failų perkėlimo ir DNS įsigaliojimo **nė vienas adresas nepasiekia
svetainės iš išorės.** Tuo metu neįmanoma nei patikrinti, ar perkėlimas
pavyko, nei nieko pataisyti — o būtent tada to labiausiai reikia.

**Siūlomas sprendimas — vienas prašymas SSH žmogui:**

```
sukurti subdomeną (pvz. naujas.avesa.lt), rodantį į NAUJĄ dokumentų šaknį
```

Tada tiltas mato svetainę ir prieš DNS, ir po jo, ir akla zona dingsta.
Jiems tai kelių minučių darbas.

**Paruošta iš mūsų pusės:** workflow'e pridėtas `WP_URL: ${{ secrets.WP_URL }}`.
Adresas keičiamas **vienu GitHub secret'u**, ne kodu — perjungimo naktį
nereikės nieko deploy'inti.

---

## 8. KO ŠIAME PLANE DAR NĖRA

Sąžiningai — kad nebūtų laikoma baigtu.

```
🟡 švari testinė bazė — laukia VIENO savininko veiksmo DirectAdmin'e (§7e)
🟡 AKLA ZONA po failų perkėlimo — nei dev.avesa.lt, nei petshop.lt
   nepasiekia svetainės iš išorės; siūlomas subdomenas (§7f)
🟡 Q-PSR3: kas realiai įrašyta projekto 29276 accepturl/cancelurl/callbackurl
```

**Uždaryta nuo v1.0:**

```
✅ DOD-18 parašytas
✅ DNS scenarijus išmatuotas (B, du A įrašai, serveriai.lt)
✅ petshop-sargas.php v1.2 įdiegtas ir veikia (§8u)
✅ §7 klausimai atsakyti
✅ Paysera rizika išmatuota ir procedūra užrakinta (§7b)
✅ SSL išmatuotas ir tiekėjo eiga patvirtinta (§7c) — nemokamas, po DNS
✅ DNS zonos savininkas patikslintas: serveriai.lt = iv.lt, viena paskyra
✅ www yra CNAME → keisti tik DU A įrašus
✅ petshop.lt YRA hostingo paskyroje (S1090)
✅ **PRIEŽIŪROS REŽIMO JUNGIKLIS ĮDIEGTAS ir patikrintas** (§7d)
✅ **atstatymo apribojimai IŠMATUOTI** — DB teisės ir koduotė (§3.3, §7e)
```

---

## 9. VIENO PUSLAPIO SANTRAUKA PERJUNGIMO NAKČIAI

```
PRIEŠ (T-2)     TTL 3600 → 300 · abiem A įrašams
PRIEŠ (T-1)     rankinė pilna kopija · užsirašyti prekių/užsakymų skaičius
PRIEŠ (T-1)     patikrinti test_mode = no (grįžo į yes kartą — tikrinti 2×)
PRIEŠ (T-1)     įsitikinti, kad petshop.lt yra hostingo paskyroje (§7c)

T-0  1.  DNS: ABU A įrašai → 79.98.29.24   (www CNAME seka pats)
     2.  palaukti 5–10 min. (TTL 300 → dvigubas TTL)
     3.  užklausti Let's Encrypt per iv.lt klientų sistemą
     4.  patikrinti: https://petshop.lt atsidaro BE įspėjimo
     5.  ⚠️ 2,21 € PIRKIMAS — mokėjimo grandinės patikra
     6.  jei OK → blog_public = 1 (DOD-22), og:image → petshop.lt
     7.  skelbti

PRIEŽIŪRA       įjungti:  sukurti  wp-content/uploads/ps-prieziura.flag
                išjungti: ištrinti tą patį failą (DirectAdmin)

GRĮŽIMAS        ABU A įrašai → 213.226.161.16 ir .15
                + Paysera adresai, jei buvo keisti
                sena platforma gyva iki 2026-10-15

SPRENDIMAS      priimamas per pirmas 2–3 val.
                po pirmo realaus užsakymo §3.3 UŽDARYTAS
```
