# S1781 Užsakymas #1394: kodėl VF siunčia klientui, o ne į AV (2026-10-13 ~13:10)
Skriptai `ps-bridge/s1781/a–d.php` — tik skaito. **Gyvai nieko nekeista.** ✅ — du šaltiniai (kodas + užsakymo duomenys/įvykių žurnalas).

## Užsakymas
#1394 (WC 36828), 10-12 18:35, apmokėtas, 76,56 €, Venipak kurjeris. MIXED:
- Quattro SB 7 kg — Quattro
- Truly elnienos juostelės 85 g, SmartBones Beef 8 vnt. — VF (AV šių prekių neturi)
- Hau&Miau jautienos čipsai — AV

## Kas įvyko ✅
1. **18:35** — šaltiniai parinkti teisingai. Kelias (tiesiai klientui / į AV) 2+ sandėlių užsakymui automatiškai nerašomas — jį sprendžia žmogus (taisyklė 09-03). VF eilutėms `_ps_kelias` tuščias; ekrane rodytas tik *siūlymas* „veža į AV“ (tuo metu buvo atvira VF partija #43).
2. **18:39:49** — Inga pakeitė TIK Quattro eilutę: „siunčia klientui → veža į AV“. `keisti_kelia()` po pakeitimo kviečia `planas_is_eiluciu()` (darbalaukis 1884 eil.), kuri planą visam užsakymui surašo iš *įrašytų* eilučių kelių. VF eilutės įrašyto kelio neturėjo → 1779 eil. joms parašė **„tiesiai“**. Rezultatas: `_ps_misrus_sprendimas = {"quattro":"av","vf":"tiesiai"}`.
   Niekas VF kelio nesprendė — nei Inga, nei taisyklė. Užsakymas nebuvo „Surūšiuotas“ (`_ps_rusiuota` tuščia), bet atsiradus planui iškrito iš „Neišrūšiuoti“.
3. **10-13 11:30** — VF partija #43 gauta, atviros VF partijos nebėra → siūlymas „veža į AV“ dingo (700 eil. `$sug` priklauso nuo `atvira_partija()`), VF eilutės rodomos „siunčia klientui“, užsakymas — Dropshipping eilėje.
4. **12:30:31** — grupinė Venipak registracija VF (4 užs.) → #1394 lipdukas V07267E1000419. **12:33:52** — laiškas Vetfarmui su šiomis 2 prekėmis (siųsti klientui).

## Priežastis
Klaida darbalaukyje (`petshop-darbalaukis.php` md5 cf887dea…, `planas_is_eiluciu()` 1774–1783 eil.): pakeitus vienos eilutės kelią, kitų tiekėjų nepaliestos eilutės plane užrašomos „tiesiai“. Antra silpna vieta — siūlymas „veža į AV“ mišriam užsakymui rodomas tik kol yra atvira to tiekėjo partija.

## Mastas
Iš paskutinių 40 užsakymų su planu mišrių su „tiesiai“ — 3: #1394 (ši klaida), #1384 (Inga pati pakeitė VF → klientui), #1373 (Inga surūšiavo, ZB tiesiai). Klaida — tik #1394.

## Dabartinė #1394 būklė
- VF: 2 skanėstai perduoti Vetfarmui siųsti klientui, lipdukas V07267E1000419 („At sender“).
- Quattro 7 kg: užsakyta į AV (partija #44), laukiam.
- AV: čipsai nurašyti.
- Klientas gautų 2 siuntas: VF (2 skanėstai, ~6,60 €) ir AV (Quattro + čipsai).
- ⚠ Venipak registracijoje VF siuntai svoris 7,61 kg / 4 prekės — panašu į viso užsakymo svorį, ne VF dalies (netikrinta).

## Laukia Raimio
1. #1394: palikti (VF siunčia 2 skanėstus atskirai) ar stabdyti VF ir parsivežti į AV.
2. Pataisa darbalaukyje (variklis — reikia leidimo): `planas_is_eiluciu()` nepaliestoms eilutėms mišriame užsakyme rašyti „av“ (taisyklė 09-12/09-25: mišrus → konsoliduoti AV), ne „tiesiai“; siūlymas „veža į AV“ — be priklausomybės nuo atviros partijos.

## Papildymas 13:20 — kodėl dingo iš „Neišrūšiuoti“ ✅ (`s1781/e.php`, tik skaito)
- Darbalaukis 771 eil.: jei `_ps_rusiuota` tuščia, bet yra planas (`_ps_misrus_sprendimas`) → užsakymas laikomas surūšiuotu (`rus='planas'`); 834 eil. — į „Neišrūšiuoti“ patenka tik `! $rus`.
- Planą sukuria bet kuris vienos eilutės kelio pakeitimas (`keisti_kelia()` 1884 eil. — be sąlygos; kiekio keitimas 1579 ir „Pakeisti“ 1679 planą tik atnaujina, jei jis jau yra).
- Išvada: vienos eilutės kelio pakeitimas = visas užsakymas „surūšiuotas“, nors „Surūšiuota“ nespausta ir kitų eilučių keliai neįrašyti. Tai pagrindinė klaida.
- Dabar tokių atvirų užsakymų 2: #1394 ir #1384 (#1384 VF kelią Inga pasirinko pati, eilutėje įrašyta).
- ⚠ #1394 dabar darbalaukyje VF skanėstus vėl rodo „veža į AV“ (atsirado atvira VF partija #45), nors jie perduoti Vetfarmui siųsti klientui ir partijoje #45 jų nėra — ekranas neatitinka tikrovės, AV dalis lauktų prekių, kurios neatvažiuos.

Pataisos siūlymas (laukia „daryk“): (A) `keisti_kelia()` planą tik atnaujina, jei jis jau yra — nesurūšiuotas užsakymas lieka „Neišrūšiuoti“, kol nepaspausta „Surūšiuota“ (ji įrašo visų eilučių kelius); (B) #1394 VF eilutėms įrašyti tikrą kelią pagal Raimio sprendimą.

## Pataisa v3.49 — PARUOŠTA, GYVAI NEĮDIEGTA (13:50; Raimio „daryk visus 3“ 13:19)
Failas `ps-bridge/s1781/petshop-darbalaukis-v3.49.php` (md5 e9740342…, iš gyvo v3.48 md5 cf887dea…, `php -l` ✅). Gyvai tebėra v3.48.
1. `keisti_kelia()`: planą tik atnaujina, jei jis jau yra arba užsakymas surūšiuotas — plano nebekuria. `planas_is_eiluciu()`: eilutė be įrašyto kelio nebėra „tiesiai“ (lieka ankstesnė plano reikšmė arba nieko).
2. Siūlymas „veža į AV“ mišriam nesurūšiuotam užsakymui — visada (be atviros partijos sąlygos); įrašytas planas tam tiekėjui gerbiamas.
3. Sargas `s1781/h.php` (tik skaito) — ryto ataskaitai: A „planas yra, „Surūšiuota“ nespausta“, B „mišrus, tiekėjo prekė eina klientui be įrašyto sprendimo“. Šiandien: A — #1384, #1394; B — #1394 (2 VF eilutės). Po pataisos turi būti 0 naujų.

Simuliacija gyvoje DB (50 atvirų / 4 d. užsakymų): po pataisos rodymas keistųsi tik #1394 VF eilutėms („veža į AV“ → „siunčia klientui“ — kaip faktiškai perduota). Nesurūšiuotų mišrių šiuo metu 0.

Diegimas sustojo: Claude saugiklis neleido paleisti diegimo į gyvą svetainę be atskiro Raimio leidimo. Diegimo tvarka (kai bus leista): bak `ps-archyvas/petshop-darbalaukis.php.bak_s1781` → `token_get_all` → įrašymas → nekešuotų URL patikra su automatiniu atstatymu → atskira užklausa: versija, #1394/#1384/#1412 planai atmintyje (neišsaugant).

⚠ #1394 sistemoje nepakeistas: VF eilutės — perduotos Vetfarmui siųsti klientui, lipdukas V07267E1000419. Jei su VF sutarta kitaip (pvz. nesiųsti), darbalaukyje tai dar neatspindėta.

## ĮDIEGTA 14:00 — darbalaukis v3.49 (Raimio „tvarkyk“ 13:54)
- `mu-plugins/petshop-darbalaukis.php` v3.48 (md5 cf887dea…) → **v3.49** (md5 e9740342…); bak `ps-archyvas/petshop-darbalaukis.php.bak_s1781`; `s1781/g.php` fazės 1 dry / 2 diegimas / 3 patikra / **9 atstato**. Kopija `ps-bridge/s1781/petshop-darbalaukis-v3.49.php`.
- Po diegimo: `/` 200, kasa 302, REST 200, fatal nėra ✅.
- Patikra atskira užklausa (atmintyje, DB neliesta — patikrinta tiesiogiai SQL `s1781/i.php`) ✅:
  - mišrus užsakymas be plano ir be „Surūšiuota“ → eilė **„Neišrūšiuoti“**, į „Dropshipping“ (laiškai/lipdukai tiekėjui), „Laukiam“, „Surinkti“ nepatenka;
  - tiekėjo eilutės jame rodomos „veža į AV“ (be atviros partijos sąlygos);
  - planas iš eilučių, kai įrašytas tik Quattro kelias → `{"quattro":"av"}` — VF „tiesiai“ nebeprirašoma;
  - surūšiuoto #1412 planas perskaičiuotas tas pats `{"vf":"av"}`; #1384 (Ingos pasirinkta VF → klientui) nepakito.
- ⚠ Gyvu Ingos paspaudimu dar netikrinta — pirmas naujas mišrus užsakymas parodys (sargas ryte).

## #1394 sutvarkytas sistemoje 14:08 (Raimis: „VF siunčia prekes į AV, su VF suderinta, klientui nesiunčia“)
`s1781/j.php` 1 dry / 2 vykdo / 3 patikra / **9 atstato** (bak opcija `ps_s1781_1394_bak`):
- VF eilutės 3639 (Truly), 3641 (SmartBones): `_ps_kelias=i_av`, `_ps_konsolidacija=1`, įtrauktos į Vetfarmas partiją **#45** (užsakyta 12:33; `ps_tiekimas_eil` id 148, 149).
- Planas `{"quattro":"av","vf":"av"}`; žymės „perduota VF“ nuimtos; siunta V07267E1000419 išimta iš registro ir sekimo, įrašyta į `_ps_siuntos_senos`; Venipak plugino įrašas atlaisvintas (senas — `_ps_venipak_sena`), kad AV siunta registruotųsi normaliai.
- Dabar: eilė „Laukiam iš tiekėjų“, visos tiekėjų eilutės „veža į AV“ (Quattro #44, VF #45), klientui — viena siunta iš AV. Klientas laiško su VF sekimo numeriu negavo (`ps_email_jobs` — 0) ✅.
- Prielaida: skanėstai atvažiuos su VF partija #45 — priimant ją „Gavime“ Inga pažymės ir juos.
- Lipdukas V07267E1000419 Venipak sistemoje liko sukurtas (manifestas 07267261013002), nenaudojamas.

## Toliau
- Rytinėje ataskaitoje: sargas `s1781/h.php` (A — planas be „Surūšiuota“; B — mišrus, tiekėjo prekė klientui be įrašyto sprendimo). Šiandien po pataisų liks tik #1384 (A, Ingos sąmoningas pasirinkimas).
- Ingai: mišrūs užsakymai nebedingsta iš „Neišrūšiuoti“ pakeitus vieną eilutę — reikia „Surūšiuota“.
