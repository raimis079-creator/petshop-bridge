# DOD-18 — PERJUNGIMO PLANAS (naktinis)

**Versija:** 1.0 · 2026-08-17
**Pora:** DOD-19 atsitraukimo planas (`DOD-19_rollback.md`)
**Vykdymas:** naktį, savininko sprendimas 2026-08-17

---

## 0. IŠMATUOTI FAKTAI (ne prielaidos)

Patikrinta iš serverio pusės 2026-08-17:

```
šis serveris (avesa.lt, dev.avesa.lt)   79.98.29.24
petshop.lt A                            213.226.161.16  ← eShoprent
petshop.lt A (antras!)                  213.226.161.15  ← eShoprent
www.petshop.lt                          CNAME → petshop.lt
A įrašo TTL                             3 600 s (1 val.)
NS TTL                                  86 400 s
vardų serveriai                         ns1–ns4.serveriai.lt
MX                                      isopas.serveriai.lt
SPF                                     v=spf1 a mx include:spf.serveriai.lt
                                        include:sendersrv.com ~all
Google verification TXT                 yra
eShoprent svetainė                      HTTP 200, nginx/1.22.1, gyva
```

**DVI IŠVADOS, KEIČIANČIOS PLANĄ:**

1. **Zoną valdo serveriai.lt, ne iv.lt.** REGISTRE §8a užrašyta „DNS valdomas
   iv.lt" — netikslu; iv.lt greičiausiai registratorius, o zona serveriai.lt.
   Reiškia **A įrašą keiti savo DirectAdmin'e**, be trečios šalies ir be
   laukimo, kol kas nors atsakys. Tai didžiausias palengvėjimas visame plane.
2. **A įrašų yra DU** (`.16` ir `.15`). Pakeitus tik vieną, dalis srauto
   toliau eitų į seną serverį. Abu turi būti pakeisti / pašalinti.

**Paštas ir SPF jau serveriai.lt pusėje** — perjungiant jų liesti nereikia.
Viena rizika mažiau.

---

## 1. KODĖL NAKTĮ (ir ką tai keičia)

```
+ nėra pirkėjų → nėra užsakymų → DUOMENŲ ATSTATYMAS LIEKA ATVIRAS
  (DOD-19 §4 „taškas be grįžimo" nepasiektas)
+ TTL 1 val. naktį kainuoja beveik nieko
+ 04:00 pasileis backup ir naktiniai importai — pirmas realus jų testas
  NAUJOJE aplinkoje, stebimas gyvai, o ne randamas rytą
− serveriai.lt palaikymo naktį NEBUS
− dirbsi vienas ir pavargęs
```

**Iš dviejų minusų seka pagrindinė šio plano taisyklė:**

> Planas turi būti vykdomas MECHANIŠKAI, be sprendimų priėmimo.
> Kiekvienas „reikės pagalvoti" 03:00 yra klaidos vieta.
> Visi sprendimai priimti IŠ ANKSTO ir surašyti čia.

---

## 2. T-2 DIENOS — TTL SUMAŽINIMAS

**Vienintelis darbas, kurio negalima padaryti perjungimo naktį.**

```
DirectAdmin → DNS valdymas → petshop.lt
  A įrašų TTL: 3600 → 300
```

Kodėl: ne dėl perjungimo, o dėl **atsitraukimo**. Jei 03:00 paaiškės, kad
kažkas negerai, nori grįžti per 5 min, o ne laukti iki 04:00.

```
PATIKRA: po 1 val. — ar TTL tikrai 300
JEI NE:  perjungimas galimas, bet atsitraukimas truks iki valandos.
         Tai NĖRA stabdys, tik žinok iš anksto.
```

---

## 3. T-1 DIENA (vakare, prieš miegą)

Viskas, ko gali prireikti 02:30, turi būti patikrinta dabar.

```
[ ] DirectAdmin prisijungimas VEIKIA (ne „turėtų veikti")
[ ] DNS valdymo ekranas atsidaro, A įrašai matomi
[ ] WP admin prisijungimas veikia
[ ] Paysera projekto 29276 nustatymai atidaryti atskirame skirtuke
[ ] RANKINĖ pilna kopija — NELAUKTI 04:00 cron'o
    (automatinė 04:00; perjungus 02:00 prarastum ne 6 val., o visą dieną)
[ ] Užsirašyti esamą būklę, kad būtų su kuo lyginti:
       prekių publish ____  juodraščių ____  užsakymų ____
       vartotojų ____  DB dydis ____
[ ] Telefonas įkrautas, kavos yra
```

---

## 4. PERJUNGIMO NAKTIS — ŽINGSNIAI SU PATIKROMIS

Kiekvienas žingsnis: **veiksmas → kaip žinau, kad pavyko → jei ne**.

### 4.1 Paruošimas (prieš liečiant DNS)

```
1. WP: Site URL ir Home → https://petshop.lt
   ⚠ BŪTINAI https://, NE http:// — mixed content pamoka (§8, 2026-07-30)
   PATIKRA: options lentelėje siteurl ir home
   JEI NE:  taisyti prieš einant toliau

2. 6 cron URL: dev.avesa.lt → petshop.lt
   (import_key=v ir import_id nesikeičia, TIK domenas)
   PATIKRA: serveriai.lt cron sąrašas — nė vieno dev.avesa.lt
   JEI NE:  importai nustos veikti; taisyti dabar

3. Hardkoduoti URL:
   woocommerce_email_header_image · wcdn_settings ·
   cmplz_preloaded_privacy_info
   PATIKRA: paieška options lentelėje pagal „dev.avesa.lt" → 0 rezultatų

4. „Discourage search engines" IŠJUNGTI (DOD-22)
5. AVPN / IAPV serijos → 101
6. Pragma production režimas ĮJUNGTI

⚠ ŠIUO MOMENTU dev.avesa.lt NEBEVEIKS TVARKINGAI — tai normalu ir laukiama.
  Nuo čia iki 4.2 pabaigos parduotuvė nepasiekiama NĖ VIENU adresu.
  Šis tarpas turi būti kuo trumpesnis, todėl 4.2 daroma IŠ KARTO.
```

### 4.2 DNS perjungimas

```
7. DirectAdmin → petshop.lt zona:
   A  213.226.161.16 → 79.98.29.24
   A  213.226.161.15 → PAŠALINTI (arba → 79.98.29.24)
   www CNAME → petshop.lt : NELIESTI
   MX, SPF, TXT : NELIESTI

   PATIKRA: po 5–10 min (TTL 300) — petshop.lt turi rodyti 79.98.29.24
   JEI NE po 15 min: patikrinti, ar išsaugota; NELAUKTI valandos.
```

### 4.3 Pirmoji patikra — ar apskritai veikia

```
8.  https://petshop.lt atsidaro                    → jei NE: DOD-19 §2
9.  SSL galioja, spynelė yra                       → jei NE: DirectAdmin SSL
10. Titulinis rodo NAUJĄ parduotuvę, ne eShoprent
11. Paveikslėliai ir CSS kraunasi (nėra „plikos" HTML)
    JEI NE: beveik visada Site URL su http:// — grįžti į 4.1/1
12. Prisijungimas prie WP admin per petshop.lt/wp-admin
```

### 4.4 Pirkimo kelias — SVARBIAUSIA PATIKRA

Nė vienas iš aukščiau esančių punktų nereiškia, kad parduotuvė veikia.

```
13. Atidaryti prekę → matosi kaina ir likutis
14. Įdėti į krepšelį
15. Eiti į apmokėjimą, užpildyti duomenis
16. REALUS pirkimas per Paysera (mažiausia suma)
17. Užsakymas gavo statusą processing
18. Laiškas atėjo į terra@petshop.lt IR klientui
19. Likutis nurašytas teisingai
20. Užsakymą IŠTRINTI ($order->delete(true)) arba palikti kaip pirmą
    — savininko sprendimas vietoje

JEI 16 NEPAVYKSTA: tai vienintelis atvejis, kai traukiamasi nedelsiant.
  Parduotuvė, kurioje negalima nusipirkti, yra blogiau nei jokios.
```

### 4.5 Naktinių darbų stebėjimas

```
21. 04:00 — backup: ar .ps-backup-state.json rodo OK naujoje aplinkoje
22. Naktiniai importai (ZB, VF) — ar suveikė, ar nepakeitė kainų
23. petshop-sargas: ar nefiksavo naujų fatal klaidų
```

**Tai vienintelė proga pamatyti naktinius darbus gyvai.** Ryte jie jau bus
įvykę, ir liks tik pėdsakai.

---

## 5. T+RYTAS (po miego, prieš pirmą klientą)

```
[ ] petshop.lt atsidaro iš telefono (kitas tinklas, ne namų Wi-Fi)
[ ] Google Search Console: naujas URL, indeksavimas leistas
[ ] Kaina24 ir Kainos.lt feed URL resubmit (OPS-06)
[ ] Feed'ai atiduoda naują turinį
[ ] Sena eShoprent — IŠJUNGIMAS pagal susitarimą su jais
    ⚠ NEIŠJUNGTI, kol nepatvirtinta, kad pirkimo kelias veikia
[ ] TTL 300 → 3600 (praėjus parai be problemų)
```

---

## 6. KO NEDARYTI PERJUNGIMO NAKTĮ

```
✗ NEKELTI klientų el. paštų (F-KLIENTAI) — 2 000 laiškų srautas
  sutaptų su perjungimu ir sudegintų domeno reputaciją
✗ NELIESTI kategorijų mapinimo (Q-VF-KAT)
✗ NEDARYTI kainų perkėlimo (jis T-3, ne T-0)
✗ NETAISYTI nieko, kas nekliudo pirkti
✗ NEDIEGTI naujo kodo
```

Perjungimo naktis skirta **vienam dalykui** — kad parduotuvė pradėtų veikti
nauju adresu. Viskas kita laukia.

---

## 7. ATSITRAUKIMAS — SANTRAUKA

Pilnai: `DOD-19_rollback.md`. Naktiniam kontekstui svarbiausia:

```
A įrašą grąžinti į 213.226.161.16 + .15   → veikia, KOL eShoprent gyva
                                             (todėl jos neišjungti iš karto)
laukti TTL (300 s, jei sumažintas)
WP Site URL grąžinti į dev.avesa.lt
```

**Kol nėra nė vieno kliento užsakymo, atviri visi keliai.** Po pirmo —
duomenų atstatymas tampa duomenų praradimu.

---

## 8. KO ŠIAME PLANE DAR NĖRA

```
- priežiūros režimo jungiklis NEEGZISTUOJA (4.1 tarpas dabar nedengiamas)
- Paysera pilnas ciklas (F-PSR) NETESTUOTAS — 4.4/16 bus PIRMAS kartas
  ⚠ tai didžiausia neišmatuota rizika visame plane
- eShoprent išjungimo tvarka su jais nesuderinta
- REGISTRAS §8a taisytinas: DNS valdo serveriai.lt, ne iv.lt
```

**§8 antras punktas svarbiausias.** Paysera ciklas turi būti pravažiuotas
PRIEŠ perjungimo naktį, o ne jos metu. Kitaip 03:00 aiškinsiesi mokėjimų
integraciją be palaikymo.
