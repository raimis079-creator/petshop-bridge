# R60 vertė eurais ir kelias 13 → 35 % (S1683 c, 2026-09-14)

Šaltinis: `irankiai/s1683_c.php`, `analize/s1683_c.json`. Imtis: pirmas maisto pirkimas 2024-01…2025-08 (2 650), stebėta 12 ir 24 mėn.

## 1. Kiek vertas klientas pagal antro pirkimo laiką

| 2-as pirkimas po | klientų | dalis | užs./12 mėn. | V12 | tapo 5+ | V24 |
|---|---|---|---|---|---|---|
| ≤30 d. | 162 | 6 % | 5,1 | €209 | 35 % | €252 |
| 31–60 d. | 187 | 7 % | 3,8 | €185 | 28 % | €230 |
| 61–90 d. | 131 | 5 % | 3,1 | €149 | 15 % | €176 |
| 91–180 d. | 170 | 6 % | 2,7 | €139 | 9 % | €168 |
| >180 d. | 214 | 8 % | 1,8 | €85 | 1 % | €128 |
| niekada | 1 786 | 67 % | 1 | €42 | 0 % | €42 |

Kuo anksčiau antras pirkimas, tuo didesnė visa tolesnė vertė — monotoniškai, ir 24 mėn. skirtumas išlieka (€252 vs €42). Šuo ≤60 d.: V12 €201–231; katė ≤60 d.: €155–179 (katė, kuri grįžta per 30 d., taip pat tampa 5+ klientu 38 %).

**Vieno R60 procentinio punkto vertė.** Klientas, perkeltas iš „niekada" į „≤60 d.", istoriškai skiriasi €150 V12. Dalis to — atranka (grįžę ir šiaip būtų grįžę), todėl planui imu pusę–du trečdalius: **€75–100 V12 už perkeltą klientą.** Prie 250 naujų/mėn.: 1 pp R60 = 2,5 kl. × €75–100 × 1,25 = **€230–310/mėn. brandžios apyvartos.**

| R60 | Δ pp | + apyvarta/mėn. (250 naujų) | V12 (apytiksl.) |
|---|---|---|---|
| 13 % (dabar) | — | — | €78 |
| 20 % | +7 | +€1,6–2,2 k | €85–90 |
| 25 % | +12 | +€2,8–3,7 k | €90–95 |
| 30 % | +17 | +€3,9–5,3 k | €95–100 |
| 35 % | +22 | +€5,1–6,8 k | €100–105 |

Patikra su recenzento lentele: R60 35 % pats vienas duoda V12 ~€100, ne €115 — sutampa su jo pastaba, kad V12 iš R60 tiesiogiai neišvedamas. Iki €115–120 trūkstamą dalį turi duoti tolesnės grandys (3+/4+) — o jos pačios stiprėja, kai antras pirkimas ankstyvas (≤60 d. grupėje 5+ tampa 28–35 %). Todėl bazinis V12 €115–120 = R60 35 % + natūralus grandinės efektas, be atskiro „3-io pirkimo" projekto. Tai ne prielaida iš oro — tai stebimas ryšys lentelėje aukščiau.

## 2. R60 pagal pirmo pirkimo brendą — kur slypi rezervas

| brendas | klientų | R30 | R60 | V12 jei ≤60 d. | V12 jei niekada |
|---|---|---|---|---|---|
| Animonda | 282 | 17 % | 33 % | €187 | €33 |
| Miamor | 128 | 7 % | 16 % | €176 | €31 |
| Romar | 92 | 13 % | 16 % | €123 | €24 |
| Exclusion | 279 | 5 % | 15 % | €323 | €56 |
| Quattro | 105 | 8 % | 13 % | €191 | €46 |
| Ontario | 91 | 7 % | 13 % | €155 | €29 |
| **Josera** | **1 039** | **3 %** | **9 %** | **€192** | **€49** |
| Royal Canin | 109 | 3 % | 5 % | €269 | €66 |
| Hikari | 96 | 1 % | 3 % | €157 | €31 |

Du dalykai:
1. **Josera — didžiausias rezervas.** 39 % visų naujų, R60 9 %. Josera pirkėjas, kuris grįžo per 60 d., vertas €192 — tiek pat, kiek kiti. Problema ne klientas, o kad po Josera pirkimo niekas nevyksta, o Josera maišą galima nusipirkti bet kur. Perkelti Josera R60 9 → 20 % = +110 klientų/metus × €150 = **+€17 k/metus** vien iš šio brendo, be jokio naujo srauto.
2. **R60 nėra universalus langas.** Exclusion / Royal Canin 12–15 kg maišas trunka 3–4 mėn. — ten antras pirkimas ≤60 d. struktūriškai retas (15 %/5 %), o jų grįžę klientai — brangiausi (€323/€269). Sausam maistui langą reikia rišti prie pakuotės: **R(1,3 × maišo trukmė)**, ne fiksuotų 60 d. Animondai (konservai, 2–4 sav.) 60 d. yra net per daug — ten R30 (17 %) yra tikras KPI.

## 3. R60 mėnesinė dinamika 2024-01…2026-06

10–19 %, vidurkis 13–14 %, be jokio trendo per 30 mėn. Tai reiškia: (a) niekada nebuvo bandyta ką nors daryti; (b) prieš/po palyginimas bus patikimas be didelio holdout'o — bet kuris pokytis virš 20 % išeis už istorinės svyravimo ribos.

## 4. Kelias 13 → 35 % — kas kiekvieną žingsnį duoda (hipotezės, tikrinamos kohortomis)

| žingsnis | R60 | mechanika | kodėl tiek |
|---|---|---|---|
| 0 → 1 | 13 → 20 % | „Tas pats maišas — vienu paspaudimu" 20–50 d. langas, magic login, brendo hazard pikas; Josera/Ontario/Quattro pirmiausia | Animonda be jokių priminimų turi 33 % — vien ritmas + lengvumas duoda ~+7 pp commodity brendams |
| 1 → 2 | 20 → 25 % | pakuotės langas vietoj 60 d. (Exclusion/RC/Josera 15 kg — 60–90 d.); skanėstas antrame siuntinyje; kaina „ta pati, kaip pirmą kartą" garantija | Exclusion grįžtantys — €323; jų laiko langas dabar praleidžiamas |
| 2 → 3 | 25 → 30 % | Pet Profile: svoris → gramai/d. → tiksli diena; refill/prenumerata pasiūlymas antrame užsakyme, ne pirmame | 88 % perka tą patį — prenumeratos pasiūlymas turi ateiti, kai klientas jau pats pakartojo |
| 3 → 4 | 30 → 35 % | pirmo pirkimo mišinys: Josera dalį naujų nukreipti į ciklinius (Animonda/Exclusion) per Ads/skaičiuoklę; katėms — atskiras konservų ritmas | tai jau ne lifecycle, o srauto struktūros pokytis |

Kiekvienas žingsnis — 2 mėn. kohortų (~250 kl.) + 60 d. laukimo; sprendimas eiti toliau tik su kohortos skaičiumi. Po 60 d. be pirkimo — win-back režimas, kita logika, kita kaina.
