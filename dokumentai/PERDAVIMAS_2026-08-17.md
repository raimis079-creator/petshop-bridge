# PERDAVIMAS Į NAUJĄ LANGĄ — 2026-08-17 (naktis)

## Pirmi žingsniai naujame lange

1. Prijungti GitHub PAT (bridge repo `raimis079-creator/petshop-bridge`,
   workflow `298960963`)
2. Perskaityti `REGISTRAS.md` §8j, §8k, §8l — ten visa šios dienos esmė
3. `deployment_log_v1_5_1.md` — detalės, jei prireiks

**Dokumentų būklė:** TŽ MASTER v1.79 · deployment_log v1.5.1 ·
REGISTRAS su §8j/§8k/§8l · DOD-18 ir DOD-19 parašyti. Visi repo `dokumentai/`.

---

## KITAS DARBAS: Google Merchant Center (Q-MERCH)

Savininko pageidavimas — pradėti nuo Google. REGISTRE pažymėta „skubu",
vertė ~10 000 €/metus.

**Ko dar nežinome ir ką reikės išsiaiškinti:**
```
ar Merchant Center paskyra apskritai egzistuoja
ar feed'as bus per pluginą, ar mūsų generuojamas
kaip elgtis su paslėptomis prekėmis (žr. „Rinkiniai" žemiau)
kaip elgtis su juodraščiais (1 140) ir 0 likučio prekėmis
ar dabar ar po launch — Q-MERCH tebėra ATVIRAS klausimas
```

**Susiję jau priimti sprendimai (nekartoti diskusijos):**
- suformuoti rinkiniai — `noindex`, tad į feed'ą irgi neturėtų patekti
- paslėptos prekės (`publish` + `hidden`) — neperkamos atskirai, į feed'ą ne
- feed URL resubmit yra OPS-06, po perjungimo

---

## KRITINIS KELIAS — F-PSR (Paysera)

**Blokuoja perjungimo datą.** DOD-18 §4.4/16 žingsnis būtų pirmas Paysera
ciklo bandymas — 03:00, be palaikymo. Taip daryti negalima.

```
Projektas 29276 · dev režimas testinis, konfigūracija NEBAIGTA
Q-PSR2 — patvirtinimas iš Paysera, laukia
Savininkas 2026-08-17: „nepajungta, nepraeisi"
```

Kol neuždaryta — perjungimo datos fiksuoti negalima.

---

## RYTOJ PATIKRINTI (sargas)

```
07:00  ps_sargas_kasdien — laiško NETURI būti (48 val. malonės laikas)
       jei laiškas atėjo — malonės logika neveikia
04:00  backup .ps-backup-state.json — ar OK
       ps_sargas_klaidos lentelė — kas prisikaupė per parą
```

Poryt (48 val. po įdiegimo) — pirmas realus cron'ų tikrinimas.

---

## ATVIRI KLAUSIMAI (savininko sprendimai)

```
Q-MERCH     Google feed dabar ar po launch (~10 k €/metus) — SKUBU
Q-PSR2      Paysera patvirtinimas — BLOKUOJA perjungimą
Q-VF-KAT    kategorijų mapinimas: 120 iš 241 nesumapinta, už jų 682 prekės
            savininkas 2026-08-17: NELENDAM
Q-R7        juodraščiai: 670 užstoja importą; įėjimo taisyklės per griežtos?
            prekybinis sprendimas, prie prekių nelįsti
Q-VARIANTAI senos platformos variantai iškrito į atskiras prekes
            (Sepija 15/20 cm), mastas neišmatuotas
Q-SEO       kurios 404 kategorijos bus — blokuoja 44 URL mapinimą
Q-ENGINE    serveriai.lt: ar keis default_storage_engine
```

---

## KO NELIESTI BE SAVININKO

```
prekės apskritai (jis nurodė 2026-08-17)
kategorijų mapinimas (Q-VF-KAT)
_vf_supplier_sku rašymas toms 27 prekėms
SEO 44 URL mapinimas
ZB kainos
```

---

## TILTO PAMOKA (šios sesijos)

```
runner.mjs RAŠYTI IŠ NAUJO kiekvienam paleidimui, NIEKADA per `sed`
grandinę — failų vardai tyliai sugenda (b970 → u970) ir rezultatas
dingsta, nors paleidimas rodo „success".

GitHub API šįvakar krito ~8 kartus (503). Kai rašymas neveikia —
kodą rašyti offline ir diegti vėliau, ne bandyti pro strigantį tiltą.
```

---

## ŠIOS DIENOS SANTRAUKA (kas padaryta)

```
✅ MyISAM → InnoDB: 177 lentelės, 16,4 s, 0 klaidų + petshop-innodb.php sargas
✅ Katalogo langas v8.7.1 (fiksuoto ekrano koncepcija išmesta, antraštė sticky)
✅ §29 fulfillment tyrimas — audito prielaida buvo klaidinga
✅ Paslėpta prekė rinkinyje VEIKIA (publish+hidden, empiriškai)
✅ VF suporavimo šaknis: no_category_mapping PRIEŠ sukūrimą
✅ DOD-13 sargas v1.2 įdiegtas, DOD-20 laikrodis paleistas
✅ DNS išmatuotas, DOD-18 ir DOD-19 parašyti
✅ Q-R7 atsakytas (670 juodraščių užstoja importą)
✅ Dokumentai: TŽ v1.79, log v1.5.1, REGISTRAS §8j/§8k/§8l
```
