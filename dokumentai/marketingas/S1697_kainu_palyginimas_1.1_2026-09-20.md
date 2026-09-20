# S1697 — Sprintas 1 / 1.1 kainų palyginimo feed'as — 2026-09-20 (vakaras)

Langas pradėtas nuo `STARTAS_2026-09-21_po_S1696_MARKETINGAS.md`, punktas 1.1. Įrankiai `irankiai/s1697_ma…mg.php` (repo), bridge iš VM `br_c.sh`.

## 1. Kas padaryta (GYVAI)

| Kas | Detalės |
|---|---|
| `petshop-feeds` **v2.6.0** | `<manufacturer>` kaina24/kainos feed'uose = WC prekės ženklas (`product_brand`), `_legacy_manufacturer` tik kai ženklo nėra. Buvo atvirkščiai → „Josera petfood GmbH" 45 + „Josera" 116, „EXCLUSION"/„EXCL MEDITER"/„Exclusion", „Animonda Gran Carno/Vom Feinsten/Carny", „Plaček Pet Products s.r.o." 49. Dabar Josera 161, Exclusion 74, Animonda 53. Google feed'as neliestas. md5 97626f5e → **26a2f74d**, bak `ps-backups/petshop-feeds.php.bak_s1697`, repo `deploy/petshop-feeds-v2.6.0.php`, deploy `irankiai/s1697_md.php` (fazės 1 deploy / 2 generavimas / 3 patikra), heartbeat 200. |
| Klaidingi atitikmenys išimti | **#16270** Ontario Exigent 1 kg €7,59 turėjo 6,5 kg GTIN 8595091792863 (kaina24 rodė mūsų 6,5 kg už 7,59; 12 pardavėjų) → GTIN išvalytas + `_ps_feed_off_kaina24/kainos=yes`. **#18036** Josera Mini Chicken&Rice 1 kg €4,09 (senas SKU JOS0069443, GTIN 4032254775546) kaina24 rodė kaip „Miniwell 10 kg 4,09 (+1544 %)" → `_ps_feed_off_kaina24/kainos=yes`. Atsarga opcijoje `ps_s1697_atitikmenys_bak`, įrankis `s1697_mf.php`. Feed'ai pergeneruoti: 2 087 prekės. **Laukia Raimio:** tikras Ontario Exigent 1 kg EAN → įrašyti ir varneles nuimti. |

Feed'ų būklė: v2.6.0, cron `ps_feeds_naktinis` 04:30, `/feed/kaina24|kainos|google` → 200 (statiniai `uploads/petshop-feeds/*.xml`), per-prekės išjungimų dabar 2, `_do_not_export` 0, be GTIN 397. Kaina24 pats traukia feed'ą (paskutinis 20:06, 2 089 prekės).

## 2. Kanalo faktai (pirmą kartą iš pardavėjų paskyrų — Claude per Raimio Chrome, tik skaitė)

**kaina24.lt** (`kaina24.lt/partners/`, eshop 156721, 08-01…09-20):
- CPC **€0,08** fiksuotas. Parodymų 980 / nukreipimų 326 / mokamų 285 = **€22,80 per 51 d.** (≈ €0,45/d). Sąskaitos kas ~3 mėn. po €54–77 be PVM (išrašo susikaupus €50).
- Rodyta tik **179 prekės iš 2 089** per 51 d.; pigiausi esam **137–140** prekėse (beveik vien Josera 400 g–2,7 kg, JosiCat/JosiDog konservai po €1, Exclusion 7/12 kg, Hikari, Vetoquinol, Candioli). Vidutinė pozicija svyruoja 1–50.
- Užsakymai 09-08…20 su referrer kaina24: 8 → **CPA ≈ €0,8**.
- „Brangesni >20 %" TOP: Flexi +64–76 %, Cat's Best +34–54 %, Eukanuba 12–15 kg +42–48 %, Animonda Vom Feinsten 100 g +24–42 %, Churu +21–57 %, Josera SensiCat 10 kg +21 %, JosiDog Economy 15 kg +22 %, Savic Nestor tualetas +104 %.

**kainos.lt** (`kainos.lt/shop/`, id 11612134, rugsėjis iki 09-20): CPC **€0,08**; 74 mokami + 17 nemokami nukreipimai = **€5,92**. Užsakymai 09-08…20: 7. Kainų palyginimo lentelė: **Petshop.lt — 82 prekės pigiausios, daugiausiai iš visų** (Ramiosblusos 75, Baitera 54, Bikuva 49, Petz 49, zookaralyste 42, 1petshop 42, senukai 37, Mumbo 24, Zoosalis 3, alphazoo 2).

**Mūsų serveris** (`ps_web_ivykiai`, 09-13…20): kaina24 51 ses + kainos 45 ses = **12 ses/d** iš ~162 ses/d viso; kainoteka.lt 1 ses (09-14, Raimis ten registruotas). Sesijos pagal brendą: Josera 19, Exclusion 8, Animonda 6, RC 4, Vetoquinol 4, Hikari 3. Užsakymai pagal brendą (15): Exclusion 4, Josera 3, Hikari 3, Vetoquinol 2, Animonda 1.

**Išvada:** abu kanalai kartu kainuoja ~€1/d ir duoda ~1,2 užs./d. Feed'o karpyti (plano „tik 1–2 vieta") **nereikia** — klikas be užsakymo kainuoja 8 ct. Raimio pastaba: pigių prekių irgi neišimti — klientas per €1,99 konservą ateina ir susideda krepšelį (Josera Kitten €1,99 → €31,84; Animonda 800 g €3,39 → €22,49). Svertas — **parodymai**, o jie priklauso nuo kainos pozicijos.

## 3. Maržos lentelė — kainos.lt TOP 250 mūsų populiariausių prekių vs pigiausias konkurentas

Šaltinis: kainos.lt „Kainų palyginimas" (10 psl.), sutapdinta su WC pagal kainą + pavadinimą (`s1697_mg.php`), savikaina `_cost_price → _vf_cost → _zb_cost`, marža = (kaina be PVM − savikaina) / kaina be PVM. Pilna lentelė: `S1697_kainos_lt_top250_marza.csv` (claude-darbai). 18 eilučių „TIKRINTI" (atitikimas nepatikimas), 12 — kainos.lt klaidingi atitikmenys (skirtumas >90 %, pvz. Quattro Salmon 12 kg vs €23,80, Churu box vs €8,64, Eukanuba 15 kg vs €20,73).

Iš 250: brangesni >15 % — 178; iš jų patikimai sutapdintų 158. **Prie konkurento kainos marža ≥20 % liktų tik 5 prekėms, 12–20 % — 11, <12 % — 142.**

| Brendas | n (>15 % brangesni) | galima (≥20 %) | riba (12–20 %) | negalima (<12 %) | marža dabar | marža prie min |
|---|---|---|---|---|---|---|
| Quattro | 34 | 0 | 0 | 34 | 20 % | **−5 %** |
| Trixie | 23 | 1 | 0 | 22 | 31 % | 4 % |
| Monge | 14 | 0 | 0 | 14 | 25 % | 7 % |
| Flexi | 14 | 1 | 1 | 12 | 31 % | **−8 %** |
| Josera | 13 | 0 | 0 | 13 | 17 % | 2 % |
| Farmina | 9 | 0 | 0 | 9 | 23 % | 5 % |
| Real Dog | 7 | 0 | 0 | 7 | 23 % | 6 % |
| Cat's Best | 5 | 0 | 0 | 5 | 23 % | −2 % |
| Animonda | 5 | 1 | 3 | 1 | 39 % | 16 % |
| Inaba/Churu | 4 | 0 | 1 | 3 | 24 % | 6 % |
| Furminator | 4 | 0 | 1 | 3 | 27 % | −3 % |
| Eukanuba | 4 | 0 | 0 | 4 | 23 % | −6 % |
| Miamor | 4 | 0 | 1 | 3 | 35 % | 8 % |
| Exclusion (Mediterraneo) | 4 | 0 | 1 | 3 | 28 % | −1 % |
| Nature's Miracle | 3 | 0 | 0 | 3 | 26 % | −13 % |
| Expertus | 2 | 0 | 0 | 2 | 24 % | −19 % |
| BeloCat | 2 | 0 | 2 | 0 | 42 % | 14 % |
| Catit | 2 | 2 | 0 | 0 | 46 % | 32 % |

**Ką tai reiškia:** Baitera, Bikuva, Pethappy, Ramiosblusos, senukai, pigu parduoda Josera 10 kg, Quattro, Trixie, Flexi, Monge, Farmina, Eukanuba **žemiau arba ties mūsų VF/ZB pirkimo kaina** (pvz. Josera SensiCat 10 kg: Baitera €37,15, mūsų savikaina €30,82 → 37,15/1,21 = 30,70). Kainų karo šiuose brenduose per dropship'ą laimėti neįmanoma — tai patvirtina S1696 išvadą: pelnas iš klientų mišinio (Exclusion, Hikari, Vetoquinol, Ontario, Truly, Josera mažos pakuotės, AV konservai), ne iš Josera/Quattro tonų.

**Kur galima nuleisti ir likti ≥12 %** (16 prekių, sprendimas Raimio): Animonda GranCarno 800 g širdelės €3,35→2,59 (marža 36→17 %), Vom Feinsten Kitten 100 g €1,12→0,76/0,80 (44→17/21 %), BeloCat TOFU 6 l €4,70→3,30 (41→16 %) ir €4,90→3,20, Miamor kremas €2,85→2,18, Catit Pixi fontanas €43,95→35,92 (38→24 %), Catit filtrai €12,80→9,80 (54→41 %), Candioli Forbid €21,09→17,99, Flexi Giant M €27,99→22,34, Flexi Xtreme L €30,79→26,68, Churu Fun Bites €4,59→3,99, Trixie laipteliai €33,49→28,88, Furminator M/L katėms €20,09→17,30, Exclusion Mediterraneo 12 kg €59,90→49,99 (28→14 %). Visos AV/ZB, ne VF dropship, išskyrus Flexi/Candioli/Churu.

Pastaba: `_vf_cost`/`_zb_cost` laikomi be PVM (kaip v2.4.0 marža); jei VF cost su PVM — marža prie min dar prastesnė. Nepatikrinta.

## 3b. Perskaičiuota TIK prieš zoo parduotuves (Raimio prašymas 21:19: senukai, pigu, 1a, Varle, rde, Market365, itwork, ermitazas, Vieni, baitukas, Smartech, Electrobase, topocentras ir kt. ne-zoo išmesti)

Pilna lentelė: `S1697_kainos_lt_top250_marza_v2_zoo.csv` (mūsų vieta tarp zoo, zoo TOP3 kainos, marža prie zoo min). Iš 250: **pigiausi tarp zoo — 28**, 2–3 vieta — 46, ≤10 % brangesni — 36, >10 % brangesni — 174 (patikimai sutapdintų). Prie zoo minimumo marža ≥20 % liktų **8**, 12–20 % — **21**, <12 % — **145**.

| Brendas | n (>10 % brangesni už zoo min) | vid. skirtumas | marža dabar | marža prie zoo min | galima ≥12 % |
|---|---|---|---|---|---|
| Quattro | 35 | +28 % | 20 % | **−3 %** | 0 |
| Trixie | 24 | +37 % | 31 % | 5 % | 1 |
| Josera | 20 | +15 % | 18 % | 5 % | 1 |
| Flexi | 15 | +52 % | 31 % | −5 % | 4 |
| Monge | 14 | +25 % | 25 % | 7 % | 0 |
| Farmina / Real Dog | 9 / 7 | +24 / +22 % | 23 % | 5–6 % | 0 |
| Inaba/Churu | 7 | +16 % | 24 % | 11 % | 5 |
| Cat's Best / Eukanuba / Nature's Miracle / Expertus | 5/4/3/2 | +33…57 % | 23–26 % | −2…−19 % | 0 |
| Animonda | 5 | +33 % | 39 % | 19 % | 5 |
| Exclusion Mediterraneo | 3 | +16 % | 28 % | 16 % | 3 |
| Furminator / Miamor / BeloCat / Candioli / GimCat / Vetoquinol | 4/4/2/2/2/1 | +13…41 % | 26–42 % | 5–18 % | 2/1/2/2/1/1 |

**Išvada nesikeičia:** kainų lyderiai yra būtent zoo parduotuvės — Baitera, zookaralyste, Pethappy, Ramiosblusos, Bikuva, pet24/Zoobaze, Petplius — ne senukai/pigu. Josera 10–12,5 kg: mūsų marža dabar 16,7–16,9 % („+20 %" taisyklė), zookaralyste/Baitera parduoda ten, kur mums liktų −0,4…+9 % (SensiCat 10 kg 37,15, Sensiplus 33,48, Catelux 39,69, Festival 39,13). Quattro visa linija: Pethappy/Ramiosblusos/Petreon žemiau mūsų ZB savikainos.

**Galima nuleisti iki zoo min ir likti ≥12 % (29 pozicijos, sprendimas Raimio):** GimCat Malt-Soft 100 g 9,09→7,49 (42→30 %); Josera Mini Chicken&Rice 10 kg 33,29→29,58 (34→25 %); Flexi ONE 5 m 19,19→17,43, Xtreme L 30,79→26,69, Giant M 27,99→23,00, New Comfort L 5 m 30,69→24,63; Trixie laipteliai 33,49→28,88; Animonda Carny Kitten 400 g 1,59→1,33, Vom Feinsten Kitten 100 g 1,12→0,76/0,80, GranCarno širdelės 800 g 3,35→2,58; BeloCat TOFU 6 l 4,90→3,49 ir 4,70→3,30; Exclusion Mediterraneo 12 kg 59,90→49,99–52,99; Furminator M/L katėms 20,09→17,30, L šunims 26,99→23,78; Candioli Renal Combi 13,39→11,90, Forbid 21,09→18,68; Vetoquinol Ipakitine 12,19→10,75; Miamor kremas 2,85→2,18; Churu 56 g 2,49→2,25, Skin&Coat 11,39→10,28, 60 vnt. 34,09→29,99–30,60; RC Sterilised 37 4 kg 36,79→33,20 (21→12 %).

## 4. Atviri Raimio sprendimai
- **R-EAN** Ontario Exigent 1 kg tikras EAN → #16270 (tada feed'ą įjungti).
- **R-kainos** 29 pozicijos iš §3b „galima" — nuleisti iki zoo min (−1 ct)? Marža lieka 12–30 %.
- **R-Quattro** Quattro visa linija 20–65 % brangesnė, savikaina neleidžia — palikti, kaip yra (kaina24 „ne_reklamai" jau nuo v2.4.0), ar spręsti su tiekėju?
- 397 prekės be GTIN — kaina24 jų nerodo; daugiausia Georplast 44, BeloCat 37, Duvo+ 32, Sum-Plast 27, Animonda 26 (sąrašas pagal brendą `s1697_md` fazė 3 — užklausa netiksli, perdaryti).

## 5. Kitas langas
1.1 uždarytas kaip „feed'as sveikas, filtro nereikia, svertas — kainos". Toliau pagal STARTAS: **1.3** (404 iš organikos), 1.5, 1.6 (botai — pastebėta `salis=RU` kaina24 sesijoje), 1.7, 1.8. Įrankių prefiksas `s1698_m*`.
