# DOD-19 — ATSITRAUKIMO PLANAS (rollback)

**Versija:** 1.0 · 2026-08-17
**Būsena:** juodraštis, laukia savininko sprendimų §7
**Priklausomybė:** DOD-18 (DNS/perjungimo planas) — dar neparašytas, nes
neišspręstas esminis klausimas, žr. §0.

---

## 0. KĄ BŪTINA ŽINOTI PRIEŠ SKAITANT

Šis planas parašytas **nežinant, kaip technikai vyks perjungimas**. Registre
(§8b) užfiksuotas faktas, kuris viską keičia:

```
domains/  avesa.lt 8 863 MB · gyvunai.lt 3 574 · sushimo.lt 675 · petshop.lt 17 MB
```

`petshop.lt` katalogas serveryje — 17 MB. **Tikroji parduotuvė gyvena po
`avesa.lt`.** Todėl perjungimas gali būti vienas iš dviejų visiškai skirtingų
dalykų:

| Scenarijus | Kas vyksta | Rollback greitis |
|---|---|---|
| **A. Domenas jau rodo į šį serverį** | DirectAdmin nustatymo pakeitimas + WP Site URL | **minutės**, DNS nedalyvauja |
| **B. Domenas rodo į seną hostingą** | tikras A įrašo keitimas per iv.lt | **TTL trukmė**, gali būti valandos |

**Neatsakytas klausimas:** kur šiandien rodo `petshop.lt` A įrašas.
Patikrinama iš serverio pusės (`dig`/`gethostbyname`) — įtraukta į §6 kaip
pirmas T-14 darbas. Nuo atsakymo priklauso §3 laikai.

Visa kita šiame dokumente galioja abiem scenarijams.

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

**Scenarijus A** (domenas jau šiame serveryje):
```
1. DirectAdmin: petshop.lt dokumentų šaknis → atgal į seną katalogą
2. WP nekeičiamas
Trukmė: ~5 min. TTL NEDALYVAUJA.
```

**Scenarijus B** (tikras DNS):
```
1. iv.lt: A įrašas → atgal į seną IP
2. Laukiama TTL
Trukmė: TTL. Todėl T-2 PRIVALOMA sumažinti TTL iki 300 s — žr. §6.
```

> **Jei TTL nebuvo sumažintas iš anksto, šis kelias trunka tiek, kiek buvo
> senasis TTL (dažnai 24 val.), ir jokio būdo pagreitinti NĖRA.**

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
1. Parduotuvę į priežiūros režimą (klientai nepirktų į atstatomą bazę)
2. Parsisiųsti kopiją iš B2, patikrinti SHA-1 ir HMAC
3. Dešifruoti, atstatyti
4. Palyginti su manifestu (lentelių ir eilučių skaičiai)
5. Patikrinti akimis: prekė, krepšelis, užsakymų sąrašas
6. Išjungti priežiūros režimą
```

**DU APRIBOJIMAI, KURIUOS BŪTINA ŽINOTI IŠ ANKSTO:**

1. **Atstatymas testuotas į TĄ PAČIĄ bazę su `rtst_` prefiksu, ne į švarią.**
   WP vartotojas neturi teisės kurti naujų DB. Realaus gedimo metu
   atstatoma bus į gyvą bazę — o tai reiškia, kad ESAMI duomenys
   perrašomi. Grįžti atgal po to nebeįmanoma.
2. **Nepatikrinta**, ar dump'as sukuria bazę nuo nulio teisinga koduote
   (bazės numatytoji `latin1`, nors lentelės utf8mb4).

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

## 7. KLAUSIMAI SAVININKUI

```
K1  Perjungimo langas — naktis, savaitgalis ar darbo valandos?
    Nuo to priklauso, kiek laiko yra reaguoti be klientų.

K2  Kas turi būti pasiekiamas tą dieną ir kokiais kanalais?
    (serveriai.lt palaikymas, iv.lt DNS, Paysera)

K3  Sena platforma po perjungimo — išjungiama, ar lieka read-only?
    DOD-18 formuluotė sako „read-only", bet sprendimas nefiksuotas.
    Jei lieka gyva, ji yra atsitraukimo kelias. Jei išjungiama —
    §3.1 nustoja veikti, ir lieka tik 3.2/3.3.

K4  Kiek laiko po perjungimo esi pasiruošęs stebėti aktyviai?
    Nuo to priklauso, ar §4 „taškas be grįžimo" bus valdomas.
```

---

## 8. KO ŠIAME PLANE DAR NĖRA

Sąžiningai — kad nebūtų laikoma baigtu:

```
- priežiūros režimo jungiklis NEEGZISTUOJA (§6 T-0) — reikia pasidaryti
- „cron visai nepasileido" perspėjimas neįdiegtas (petshop-sargas.php v1.0
  parašytas 2026-08-17, dar neįdiegtas)
- atstatymas į ŠVARIĄ bazę nepatikrintas (reikia, kad savininkas
  DirectAdmin'e sukurtų testinę DB)
- DOD-18 neparašytas — be jo §3.1 laikai yra prielaida
```
