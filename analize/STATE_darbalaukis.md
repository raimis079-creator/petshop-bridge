# STATE — Petshop užsakymų darbalaukis
Atnaujinta: 2026-08-06 · sesijos S509–S595

## FAILAI SERVERYJE (mu-plugins)
petshop-desk.php          114 420 B  b0136cb48a598646  v3.14
petshop-av-tiekimas.php    36 165 B  971d5988acb59ddb  v1.2
petshop-av-sheets.php      10 335 B  37f514a5e10d221a
petshop-av-dropship.php    18 048 B  5dfdbaddd0880866
Backup: wp-content/uploads/ps-backup/*.bak_sNNN

## KAS VEIKIA
- Darbalaukis „Petshop užsakymai" (ps-desk): 6 eilės, 2 filtrų ašys + data,
  paieška, šoninis skydelis, klaviatūra, masiniai veiksmai
- Veiksmų sluoksnis (admin_post_ps_desk_veiksmas) — visi veiksmai per vieną vietą
- apmoketa / atsaukti su laiškų varnelėmis (atšaukimas TYLUS pagal nutylėjimą)
- Rytinė eiga 6 žingsniai, partija užrakinama 3 val., žingsniai spaudžiami
- Venipak: manifestai pagal sandėlį (Reflection), grupė vienu XML,
  manifesto PDF (ws/print_list, laukas `code`), klaidos tekstas, būklės lentelė
- LP: dydis skaičiuojamas plugino, partCount, kurjerio kvietimo žyma
- Pakuočių skaičius kurjerio siuntoms (_ps_pakuociu)
- Sandėlių ribos: AV 11:00 VF 13:00 ZB/Prins/Belacor/Quattro 09:00
  Ambrosia 10:00 LP 13:00
- Tiekimas: pusiau automatinis kaupimas (mygtukas prie eilutės), laiškas,
  priėmimas su galiojimu, likučių atnaujinimas, eilė „Laukia prekių"
- Klausimai: kortelės su sprendimo mygtukais
- WC užsakymų sąrašas paslėptas CSS'u (puslapis VEIKIA — būtinas lipdukams)

## NEUŽDARYTA
1. Resolveris neskaito _ps_sandelis (laukas įrašytas, elgsena sena)
2. AV_Source nesupranta „av" vietoj „legacy"
3. Prekė be sandėlio → Klausimai (nepadaryta)
4. AV likutis dviejuose laukuose: _own_stock_qty (3 prekės) ir _stock (legacy)
5. Tiekimo priėmimas rašo į _own_stock_qty — legacy prekėms neveiks
6. Lipduko prisegimas prie tiekimo laiško (dukart klausti)
7. ZB kopijuojama lentelė vietoj laiško (ZB el. pašto nėra)
8. ES „Atsisakyti sutarties" + KR-AVPN kreditinė
9. LP partCount nepatikrintas su realia siunta
10. Žodis „legacy" pašalinamas, kai bus 0 prekių

## RAIMIO DARBAI
- Inventorizacija: kurios Belacor/Quattro/kt. prekės guli AV
- LP pirmas realus lipdukas — patikrinti partCount
- Prekių svorių auditas

## SPRENDIMAI (nekeisti be Raimio)
- 7 sandėliai; legacy NĖRA sandėlis
- kilmė ≠ turėjimas; AV likutis = vienas stulpelis visoms prekėms
- viena taisyklė: turiu AV → siunčiu pats; neturiu → kilmės sandėliui
- legacy rūšiavimas: Quattro/Prins/Belacor pagal ženklą, visos kitos → AV
- manifestai: AV 001 VF 002 ZB 003 Quattro 004 Prins 005 Ambrosia 006 Belacor 007
- siuntėjas VISADA UAB Avesa
- kaupimas PUSIAU automatinis — sistema nesprendžia
- „Laukti" be automatikos; pinigų grąžinimas rankinis (Paysera nepalaiko)
- prekės ir kainos — ATSKIRAS langas („Prekių dirbtuvė"), po darbalaukio

## PAMOKOS
- token_get_all(TOKEN_PARSE) prieš rašant failą — gaudo ParseError
- remove_submenu_page uždaro puslapį (403) — slėpti tik CSS
- nespėk plugino veiksmų vardų — skaityk iš WC sąrašo
- Stock::qty()=_own_stock_qty, resolve() legacy=_stock — DU MODELIAI
- vežėjų pluginai tyli — darbalaukis pats tikrina rezultatą
- LP lipdukas = kurjerio iškvietimas, testuoti negalima

## _ps_sandelis (S595)
av 1401 · vf 1161 · zb 1059 · quattro 64 · belcor_tofu 62 · prins 43 · ambrosia 15

## ===== PERDAVIMAS KITAM POKALBIO LANGUI (2026-08-06) =====

### TEMA: PREKIŲ SRITIS

Dokumentai: TŽ MASTER v1.62 (sk. 35 ir 36), deployment_log v1.3.62.
Sk. 36 PATIKSLINA 0.12 — skaityti abu.

### KANONINIAI LAUKAI
_ps_sandelis      kilmė, 7 reikšmės, įrašyta 3805 prekėms (S595)
_own_stock_qty    AV likutis — turi būti VISOMS, dabar tik 3 prekės
_stock            parduodamas kiekis; importas jį PERRAŠO

### UŽRAKTO NEREIKIA (patikrinta S596)
Importai #5/#7 = only režimas, rašo tik _vf_*; #2 sąrašas tuščias, #3 nerašo.
Mūsų laukų XML neturi → perrašyti negali.

### KITAS ETAPAS (eilės tvarka)
1 resolveris skaito _ps_sandelis
2 AV_Source supranta „av" vietoj „legacy"
3 prekė be sandėlio → Klausimai
4 AV likutis visoms prekėms į _own_stock_qty (MIGRACIJA iš _stock + Raimio inventorizacija)
5 Prekių langas: katalogas (kilmė, AV likutis, savikaina, marža)
6 Tiekimas perkeliamas po Prekėmis + USB skeneris priėmime
7 Akcijos (TŽ 8.4: kategorijų antkainiai, apvalinimas, preview 10, audit log), rinkiniai

### KO NEPRALEISTI (iš TŽ, jau aprašyta — NEIŠRADINĖTI IŠ NAUJO)
- 8.1–8.5 kainodara: A kategorinė / B manual / C global; apvalinimas .X9;
  lock laimi; kaina < savikainos neleidžiama
- 8.4 kainodaros admin UI jau suprojektuotas
- 27 aprašymai: 9 petshop_desc_* laukai, accordion, fallback į post_content
- 6.5 dublikatai: EAN → SKU+tiekėjas → pavadinimas+brandas
- 6.4 NIEKADA neištrinti produkto automatiškai
- 0.10 _manual_price_override = kainos užraktas; _cost_price BE PVM
- rinkiniai nemaišo sandėlių, IŠSKYRUS AV

### PRIĖMIMAS
PDF nuskaitymas ATMESTAS. USB skeneris (veikia kaip klaviatūra) — lenkų
smulkmenoms. Sąlyga: EAN. Skeneris tik priėmime, ne surinkime.

### MENIU
Užsakymai lieka kaip yra + eilė „Laukia prekių".
Prekės: Katalogas · Tiekimas · Sandėlis · Akcijos · Rinkiniai.

### DARBALAUKIS BAIGTAS — netaisyti be priežasties
Visa jo būklė aukščiau šiame faile. Raimis testuoja.
