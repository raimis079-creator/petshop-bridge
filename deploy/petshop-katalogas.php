<?php
/**
 * Petshop Katalogas v8.7 (S902) - NORMALUS DARBINIS LANGAS.
 *
 * SAVININKAS (2026-08-17, su ekrano nuotraukomis): v8.6-v8.6.5b fiksuoto
 * ekrano koncepcija realiame ekrane palikdavo prekems 120 px ruozeli -
 * matesi 1-4 eilutes su vidiniu scroll-u. Nurodymas: "reikia paprasciausiai
 * normalaus darbinio lango".
 *
 * ISMESTA: aukstis() JS matavimai, body.pskat-pilnas, .pskat-layout
 * fiksuotas aukstis, .pskat-main flex-stulpelis su overflow:hidden,
 * .pskat-lent-lauk vertikalus scroll-as ir aukscio ribos.
 * LIEKA: filtru suskleidimas (v8.6.2-8.6.4), sticky virsutine juosta,
 * sticky kaires eiles (top pagal ismatuota juostos apacia --ps-virsus),
 * update-nag slepimas. Puslapis slenka normaliai, prekiu telpa tiek,
 * kiek ju yra puslapyje.
 *
 * ---- ankstesne istorija ----
 * Petshop Katalogas v8.3 (S716) — BUSENA MATOSI IS KARTO, IR JA GALIMA KEISTI.
 *
 * TESTUOTOJO PASTABA: „ziurint preke kortelėje neaisku, ar ji aktyvi
 * (prekyboje), ar deaktyvuota (juodrasciuose)."
 *
 * Buvo tiesa: busena kortelėje gyveno tik po „Veiksmai" meniu — t. y. reikejo
 * ATIDARYTI meniu, kad suzinotum tai, kas svarbiausia. Sarase juodrastis
 * pazymetas, bet kortelėje — ne.
 *
 * KODEL NE VARNELE (testuotojo pasiulymas): varnele sarase JAU reiskia
 * „pazymeta masiniam veiksmui". Ta pati zenkla dviem skirtingoms prasmems
 * naudoti negalima — anksciau ar veliau kas nors nuzymes preke manydamas, kad
 * isjungia ja is prekybos.
 *
 * SPRENDIMAS — juosta po pavadinimu, kurios negalima nepastebeti:
 *   · PREKYBOJE — zalias taskas, zalias tekstas „Prekyboje · pirkejas mato";
 *   · JUODRASTYJE — gelsvas fonas, „Juodrastyje · pirkejas nemato".
 * Salia — mygtukas busenai perjungti VIENU paspaudimu, nes zmogus, kuris ka
 * tik pamate busena, dazniausiai nori ja ir pakeisti.
 *
 * ISIMTA RANKA (`_ps_ranka_isimta`) rodoma ta pacia juosta, tik su spyna —
 * kad nesusimaisytu „dar nebaigta" su „nusprendziau neprekiauti".
 *
 * Petshop Katalogas v8.2 (S711) — SUDELIOJIMO REZULTATAS MATOSI IS KARTO.
 *
 * SAVININKAS: „niekas nepasikeite, per sudejimo mygtukus niekas neveikia."
 *
 * DIAGNOZE (narsykles testas, ne speliojimas): serveris grazina `success` ir
 * „sudeta i 5 skiltis: Aprasymas, Sudetis, Analitines, Priedai, Serimo
 * instrukcija" — t. y. tekstas SUDELIOJAMAS ir irasomas i baze teisingai.
 * Bet ekranas lieka senas: rengykleje matomas senas tekstas, o blokas
 * „Kaip mato pirkejas" nepersipiesia. Zmogui tai atrodo lygiai taip pat, kaip
 * neveikiantis mygtukas — ir jis teisus, nes rezultato nemato.
 *
 * PRIEZASTIS: `rengykleiIrasyti()` raso i TinyMCE, bet aprasymo laukas siame
 * skirtuke ne visada butas inicializuotas kaip TinyMCE (priklauso nuo to, ar
 * jau buvai paspaudes „Vaizdinis"). Tada irasymas nueina i niekur.
 *
 * SPRENDIMAS: po sekmingo sudeliojimo kortele perpiesiama is serverio — taip
 * pat, kaip po naujos partijos. Vienas kelias, o ne bandymas atspeti, kuris
 * rengykles rezimas siuo metu aktyvus.
 *
 * Petshop Katalogas v8.1 (S708) — SARASAS ATSINAUJINA PO BET KURIO IRASYMO.
 *
 * SAVININKAS (kelis kartus): „kai kazka irasai prekes kortelėje ir iseini i
 * katalogа — INFORMACIJA KATALOGE NEISSISAUGO, JA REIKIA ATNAUJINTI."
 *
 * MANO KLAIDA: v7.5 atnaujinima prikabinau prie ATSKIRU irasymo vietu
 * (likutis, kaina, kategorijos, partijos). Pavadinimas, aprasymas, trumpas
 * aprasymas, nuotraukos, atributai, busena ir tiekejo likutis liko
 * neprikabinti — todel vieni dalykai atsinaujindavo, kiti ne. Tai atrode
 * dar blogiau uz visiska neveikima: sistema kartais meluoja, o kartais ne.
 *
 * DABAR DVI TAISYKLES, o ne dvylika vietu:
 *   1. Eilute perpiesiama VISA — is TO PACIO generatoriaus (`lentele()`),
 *      kuris piesia sarasa. Nera galimybes „pamirsti stulpeli": ju nebeliko
 *      atskirai. Pavadinimas, pilnumo taskas, nuotrauka, likuciai, kaina,
 *      marza, pardavimai — viskas ateina paruosta.
 *   2. Atnaujinimas paleidziamas po BET KURIOS sekmingos `ps_kat_*` uzklausos.
 *      Nesvarbu, kuris kortelės blokas irase — ir nesvarbu, koks blokas bus
 *      pridetas rytoj.
 *
 * Petshop Katalogas v8.0 (S707) — DU ATSKIRI LIKUCIAI: TIEKEJO IR AV.
 *
 * SAVININKO PATIKSLINIMAS (2026-08-12, uzrakinta): „Ambrosia — ATSKIRAS
 * SANDELIS, dropshipingo, tik jis neduoda XML. O AV yra AVESOS sandelis."
 *
 * MANO KLAIDA v7.2 IR v7.10: laikiau, kad viskas, kas ne VF/ZB, guli musu
 * lentynoje. Netiesa. Ambrosia, Prins, Quattro, Belacor yra tokie pat
 * dropship tiekejai kaip VF ir ZB — skiriasi TIK tuo, kad likucio neatsiuncia
 * XML, todel ji tenka ivesti ranka. Ju prekes guli PAS JUOS.
 *
 * TEISINGAS MODELIS — DVI NEPRIKLAUSOMOS EILUTES:
 *   TIEKEJO likutis  (`_stock`)          kiek turi Ambrosia / Prins / VF / ZB
 *                                        VF, ZB — is XML, tik skaitymui;
 *                                        kiti    — ivedamas ranka.
 *   AV likutis       (`_own_stock_qty`)  kiek TU parsiveze i Avesos sandeli.
 *                                        Visada ranka; cia gyvena partijos,
 *                                        galiojimai ir savikaina.
 *   Gryna AV preke (be tiekejo) savo likuti laiko `_stock` — jai tiekejo
 *   eilutes isvis nera.
 *
 * PARTIJOS IR GALIOJIMAI PRIKLAUSO AV. Tiekejo lentynoje gulincios prekes
 * galiojimo mes nezinom ir nevaldom; savo — zinom, nes patys prieme.
 *
 * Petshop Katalogas v7.10 (S707) — ATSAUKTA (rode AV vietoj tiekejo).
 *
 * SAVININKAS (klausia antra karta): „kodel prekes kortelėje negaliu ivesti
 * likucio su galiojimu I AV SANDELI?"
 *
 * Ivesti buvo galima jau nuo v7.7 — bet kortele to NEPARODYDAVO. Saltiniu
 * lentele rodydavo eilute „AMBROSIA · 18 · rankiniai", todel atrode, kad
 * likutis nugule i kazkoki Ambrosia sandeli, o AV eilutes isvis nera.
 * Skaicius buvo teisingas, uzrasas — ne.
 *
 * Musu prekes (visos, isskyrus VF/ZB dropshipa) fiziskai guli AV lentynoje,
 * nesvarbu, is ko pirktos. Todel saltiniu lenteleje toks likutis dabar
 * zymimas AV, o tiekejas rodomas salia kaip is ko pirkta.
 *
 * Petshop Katalogas v7.9 (S706) — SARASO EILUTE SKAITOMA IS SVIEZIU DUOMENU.
 *   Testas parode: po likucio SUMAZINIMO kortele rode 2, o sarasas — 6.
 *   `ajax_eilute()` skaito `surinkti()`, o si grazina `ps_kat_duomenys` kesa;
 *   irasymo metu kesas isvalomas, bet uzklausos susekdavo viena kita ir
 *   eilute gaudavo dar sena momentine kopija.
 *   Dabar kesas valomas PRIES skaitant — vienai prekei tai pigu, o dvi
 *   skirtingos tiesos viename lange kainuoja pasitikejima.
 *   Kartu po nurasymo kortele persipiesia, kad partiju lentele rodytu naujus
 *   likucius.
 *
 * Petshop Katalogas v7.8 (S706) — MAZINANT LIKUTI NURASOMOS PARTIJOS.
 *   Rasta testuojant v7.7: „Gavimas +4" sukurdavo partija (4 vnt.), o veliau
 *   sumazinus likuti iki 2 partija ir toliau rode 4. Partiju suma issiskirdavo
 *   su likuciu, o kartu ir svertine savikaina bei FEFO galiojimai.
 *   Dabar mazinimas eina per `Petshop_Partijos::nurasyti()` — FEFO tvarka,
 *   pirma ta partija, kurios galiojimas artimiausias. Jei partiju nera,
 *   likutis mazinamas tiesiogiai, kaip ir anksciau.
 *
 * Petshop Katalogas v7.7 (S705) — VIENAS LIKUCIO IVEDIMAS SU GALIOJIMU.
 *
 * SAVININKAS: „KODEL prekes kortelėje negaliu ivesti likucio su galiojimu?
 * Ir dar — visi veiksmai turi atsispindeti istorijoje, ar prekiu ivedimas cia
 * jau nepriklauso?"
 *
 * ABI PASTABOS TEISINGOS, ir abi — mano klaida.
 *
 * (1) DU KELIAI TAM PACIAM VEIKSMUI. Likucio laukas (`+3`) pridedavo kieki
 *     TIESIAI i `_stock` — be galiojimo ir be savikainos. Galiojima buvo
 *     galima ivesti tik ATSKIROJE formoje „Nauja partija", zemiau, kitame
 *     bloke. Zmogus, norintis priimti preke su galiojimu, turejo atspeti,
 *     kuri is dvieju formu tam skirta. Blogiau: pasirinkus neteisinga,
 *     likutis atsirasdavo BE partijos — t. y. be galiojimo ir be savikainos,
 *     o FEFO nurasymas tokio likucio nemato.
 *
 *     Dabar VIENAS blokas: kiekis + priezastis, o pasirinkus „Gavimas" (arba
 *     ivedus `+N`) salia atsiveria „Geriausia iki" ir „Savikaina". Gavimas
 *     kuria PARTIJA per `Petshop_Partijos::priimti()`; inventorizacija ir
 *     korekcija — tik tikslina skaiciu. Atskiros „Naujos partijos" formos
 *     nebeliko: du keliai i ta pati lauka visada issiskiria.
 *
 * (2) ISTORIJA NERODE LIKUCIO. Istorijos skirtukas skaito `Petshop_Ivykiai`,
 *     o `ajax_av_irasyti` rase i `ps_av_zurnalas` — visai kita lentele.
 *     Zurnalas buvo, bet ne ten, kur zmogus ji skaito. Dabar rasoma i ABI:
 *     `ps_av_zurnalas` lieka del atsaukimo (jis saugo operacijos numeri),
 *     o `Petshop_Ivykiai` — kad matytusi kortelėje.
 *
 * Petshop Katalogas v7.6 (S704) — „SANDELIS" PERVADINTAS I „TIEKEJA".
 *
 * SAVININKO PATIKSLINIMAS (uzrakinta 2026-08-12): „del Ambrosia as isvis
 * nematau problemu. Cia taip pat kaip ir is bet kurio kito tiekejo — as galiu
 * atsivezti prekiu pas save i AV sandeli. Vienintelis isskirtinumas
 * Ambrosia, Prins... nuo VF ir ZB: ju prekiu likucius turiu ivesti rankiniu
 * budu. Visa kita standartas."
 *
 * MODELIS PAPRASTAS IR DABAR UZRASYTAS:
 *   `_ps_sandelis` = TIEKEJAS (is ko preke pirkta), o ne vieta.
 *   Preke guli MUSU lentynoje visais atvejais, isskyrus VF ir ZB dropshipa.
 *   Vienintelis skirtumas tarp tiekeju — is kur ateina likutis:
 *     VF, ZB          → XML, automatiskai, ranka nekeiciamas;
 *     visi kiti       → ivedamas ranka (kortelėje arba greitame redagavime).
 *
 * KAS PAKEISTA: stulpelis, filtras ir paaiskinimai vadinasi „Tiekejas", ne
 * „Sandelis". Zodis „sandelis" verte galvoti apie VIETA, todel Ambrosia preke
 * atrode gulinti kazkokiame „Ambrosia sandelyje", nors ji guli lentynoje
 * salia AV prekiu. Pavadinimas, kuris meluoja, kainuoja klausima kas karta.
 *
 * Petshop Katalogas v7.5 (S703) — PAKEITIMAS MATOSI IS KARTO.
 *
 * SAVININKAS: „pakeiciau preke, langas neatsinaujino, isejau is prekes lango,
 * kataloge prekes neatsinaujino — cia jau labai blogai".
 *
 * Teisinga ir svarbu. Kortele ir sarasas rode SKIRTINGA tiesa apie ta pacia
 * preke: kortelėje likutis jau 18, sarase — dar 15. Zmogus, matantis du
 * skaicius, nustoja tiketi abiem.
 *
 * PRIEZASTIS: kortele duomenis atsinaujindavo tik ta bloka, kuri pats
 * pakeitei; sarasas — isvis nieko, nes jis atspausdintas puslapio ikrovimo
 * metu, o `ps_kat_duomenys` kesas isvalomas tik SERVERYJE.
 *
 * SPRENDIMAS: po kiekvieno irasymo kortelėje kvieciamas `ps_kat_eilute` —
 * jis grazina TOS prekes dabartinius skaicius, o JS atnaujina saraso eilute
 * vietoje (likutis, tiekejo likutis, parduodama, kaina, marza, savikaina,
 * pilnumo taskas, busena). Puslapis neperkraunamas, filtrai islieka.
 *
 * KODEL NE `location.reload()`: perkrovimas numestu filtrus, slinkti ir
 * atidaryta kortele — t. y. kiekvienas pakeitimas kainuotu darbo vieta.
 *
 * Petshop Katalogas v7.4 (S702) — DATOS LIETUVISKAI.
 *   Savininkas: kalendorius „angliskas". `<input type="date">` piesia
 *   NARSYKLES kalendoriu — jo kalba imama is narsykles profilio, ir svetaine
 *   jos pakeisti negali. Todel visi datos laukai pereina i `ps-data`, kuri
 *   aptarnauja `petshop-kalendorius.php`: LT menesiai, savaite nuo
 *   pirmadienio, ISO reiksme, mygtukai „Siandien / +6 men. / +1 metai".
 *
 * Petshop Katalogas v7.3 (S701) — PARTIJOS SU GALIOJIMAIS VISIEMS SAVO SANDELIAMS.
 *
 * SAVININKAS: „reikia parasyti, kiek prekiu yra su tam tikru galiojimu, tokio
 * lauko nera, o juk preke gali buti su skirtingais galiojimais. Mes jau
 * buvome tai kalbeje, ir kazkuriuo metu taisant tai dingo."
 *
 * KAS BUVO IS TIKRUJU: partiju blokas su REDAGUOJAMAIS laukais (kiekis,
 * savikaina, geriausia iki) yra nuo v5.5 ir niekur nedingo. Bet jis rodomas
 * tik tada, kai `Petshop_Partijos::av_preke()` grazina true, o si funkcija
 * true sako TIK sandeliui „av". Ambrosia, Prins, Quattro ir Belacor prekems
 * blokas nebuvo piesiamas isvis — todel savininkas ju ir nemate. Tas pats
 * pjuvis, kaip su likuciu (v7.2): sistema „savo preke" laike tik AV.
 *
 * PRIDETA:
 *   · partiju blokas rodomas VISOMS rankinio likucio prekems (v7.2 taisykle);
 *   · „Nauja partija" TIESIAI KORTELEJE: kiekis + galiojimas + savikaina.
 *     Iki siol partija galejo atsirasti tik per Gavima, t. y. tik tuo metu,
 *     kai preke fiziskai priimama. Bet galiojimas dazniausiai paaiskeja
 *     veliau — perziurint lentyna arba tikslinant su tiekeju.
 *
 * KODEL PARTIJA, O NE „GALIOJIMO LAUKAS PREKEJE": ta pati preke lentynoje
 * guli su keliais galiojimais. Vienas laukas prekeje priverstu rinktis, kuri
 * data melagingai laikyti vienintele, ir FEFO nurasymas nustotu veikes.
 *
 * Petshop Katalogas v7.2 (S700) — RANKINIS LIKUTIS VISIEMS NE-XML SANDELIAMS.
 *
 * SAVININKO PAAISKINIMAS: „as negaliu tvarkyti likuciu VF ir ZB, nes jie
 * paduodami per XML. Bet visu kitu prekiu likucius — AV, Ambrosia, Prins,
 * Quattro — as suzinau is tiekejo ir ivedu ranka, nes kol kas kito varianto
 * nera."
 *
 * KAS BUVO BLOGAI: `av_laukas()` rase i `_stock` TIK tada, kai sandelis buvo
 * lygiai „av". Visiems kitiems — Ambrosia, Prins, Quattro, Belacor — likutis
 * butu nugules i `_own_stock_qty`, kurio parduotuve neskaito. Skaicius butu
 * irasytas, zurnale matytusi, o preke pirkejui liktu neparduodama. Tyli
 * klaida, kuria pastebetum tik po pirmo prarasto uzsakymo.
 * Recon patvirtino: Ambrosia preke likuti laiko `_stock` (8 vnt.), o
 * `_own_stock_qty` visoje bazeje yra vos 1 irasas.
 *
 * TAISYKLE (uzrakinta): likuti valdo XML TIK `vf` ir `zb`. Visi kiti
 * sandeliai — rankiniai, ju likutis rasomas i `_stock` per WooCommerce CRUD.
 * VF/ZB prekems laukas neredaguojamas nei kortelėje, nei greitame
 * redagavime, ir serveris toki bandyma atmeta — sasajos draudimo vieno
 * neuztenka.
 *
 * ISIMTIS: `_own_stock_qty` lieka tiems atvejams, kai TA PACIA preke turim ir
 * savo lentynoje, ir pas tiekeja (S590) — tada savas likutis nesumaisomas su
 * tiekejo. Jei laukas jau uzpildytas, rasoma i ji.
 *
 * Petshop Katalogas v7.1 (S699) — SUDELIOJIMAS RODO, KIEK PERKELTA.
 *   Skaidytojas (Gavimas v1.10) dabar moka uzdaryti sekcija, o ne tik ja
 *   atidaryti. Kortele parodo, kiek eiluciu teko grazinti i aprasyma — kad
 *   perkelimas nebutu tylus.
 *
 * Petshop Katalogas v7.0 (S698) — VISKAS APIE PREKE GYVENA KORTELEJE.
 *
 * SAVININKO TAISYKLE (2026-08-12, uzrakinta): kortele = viskas apie VIENA
 * preke; sarasas = masiniai veiksmai; Gavimas = tik priemimas. Jei ko nors
 * reikia vienai prekei — tai privalo buti kortelėje, net jei jau yra kitur.
 *
 * KODEL: iki siol likutis gyveno TIK sarašo „Greitame redagavime", teksto
 * sudeliojimas — TIK Gavimo naujos prekes formoje, o kategorijos — isvis tik
 * WooCommerce lange. Savininkas ju ieskojo kortelėje ir nerado; atrode, kad
 * funkcijos „dingo", nors ju ten niekada nebuvo. Isbarstymas be principo yra
 * pati brangiausia klaida — ji kainuoja kiekviena diena po truputi.
 *
 * PRIDETA:
 *   · LIKUTIS — AV likutis keiciamas kortelėje (`12`, `+3`, `-2`) su privaloma
 *     priezastimi; salia matomos partijos su likuciais ir galiojimais.
 *     Naudojamas TAS PATS `ps_kat_av` endpoint'as, kaip sarase — antro kelio
 *     i ta pati lauka nedarome.
 *   · KATEGORIJOS — priskyrimas kortelėje su paieska; kategorija lemia ir
 *     sekciju lukescius, ir atributu zemelapi, todel jos keitimas is kitur
 *     buvo ypac skaudus.
 *   · SUDELIOTI I LENTYNELES — tas pats parseris, kaip Gavime, bet ESAMOMS
 *     prekems: iklijuoji gamintojo teksta, sistema pati sudeda antrastes.
 *
 * Petshop Katalogas v6.10 (S697) — GPAIS PAKUOTE: PAVADINIMAS IR REDAGAVIMAS.
 *   PATAISA po pirmos versijos: modulis buvo idetas i ANTRA `<script>` bloka,
 *   o kvieciamas is PIRMO. Skirtingi IIFE — funkcija nematoma, uzklausa krito
 *   i `ReferenceError`, o `.catch()` grandine parode „Nepavyko susisiekti su
 *   serveriu". Klaida atrode kaip tinklo problema, nors buvo apimties.
 *   Dabar funkcija skelbiama per `window.`, o kvietimas apsaugotas patikra.
 *   Savininkas: „cia turi buti patikslinimas — GPAIS Pakuote, nes patys
 *   susimaisysime. Ir nera jokio redagavimo, as net negaliu susivesti duomenu".
 *   Abu teisinga. Skirtukas vadinosi tiesiog „Pakuote" ir maisesi su
 *   `pa_pakuotes_dydis` (prekes dydis: 12 kg, 400 g) — tai visai kitas dalykas.
 *   O redagavimo nebuvo: `Petshop_Partijos::irasyti_pakuote()` egzistavo, bet
 *   jokia sasaja jo nekviete.
 *   Dabar: skirtukas „GPAIS pakuote", eiluciu pridejimas, keitimas ir trynimas
 *   cia pat, medziagos ir tipai — is `Petshop_Partijos` saraso.
 *
 * Petshop Katalogas v6.7 (S696) — MATOSI, KAD PREKE ISIMTA RANKA.
 *   Kortelėje po busena rodoma zyme „isimta ranka" su data ir vardu, kai
 *   `Petshop_Rankos` yra uzdejes `_ps_ranka_isimta`. Be sios zymes zmogus
 *   nemato skirtumo tarp „juodrastis, nes nebaigta" ir „juodrastis, nes taip
 *   nusprendziau" — o sistemai tai du skirtingi dalykai.
 *
 * Petshop Katalogas v6.6 (S694) — DVI PREKES SU TA PACIA NUOTRAUKA.
 *   Savininko radinys: padarius kopija, ORIGINALO miniatiura sarase dingo,
 *   nors kortelėje ir parduotuveje nuotrauka buvo.
 *   Priezastis `miniatiuros()`: zemelapis buvo statomas `[$att_id => $pid]`,
 *   t. y. attachment ID kaip RAKTAS. Kai dvi prekes rodo i ta pati faila
 *   (o kopija butent tai ir daro), antroji perrasydavo pirmaja — nuotrauka
 *   likdavo tik vienai. Iki kopijavimo funkcijos toks atvejis buvo retas,
 *   todel klaida gyveno nepastebeta.
 *   Dabar zemelapis `[$att_id => [pid, pid, ...]]` — URL gauna VISOS prekes.
 *
 * Petshop Katalogas v6.5 (S693) — TRUMPAS APRASYMAS RASOMAS TEKSTU.
 *   Savininko pastaba: „trumpa aprasyma idejai HTML kodu, nepatogu taisyti".
 *   Buvo tiesa: laukas rode zaliava su `<span style="color:rgb(119,119,119);
 *   font-family:open sans...">`, o tokiame tekste rasti sakini sunku.
 *   Trumpam aprasymui HTML nereikalingas — tai 2-4 sakiniai. Dabar:
 *     · numatytasis rezimas TEKSTAS: zymes nuimtos, matai tik sakinius;
 *       irasant kiekviena eilute virsta `<p>`;
 *     · „HTML kodas" lieka tiems atvejams, kai reikia nuorodos ar saraso;
 *     · irasant per HTML rezima kodas praleidziamas per `valyti_html()` —
 *       inline stiliai ir tusti `<span>` apvalkalai iskrenta;
 *     · `&nbsp;` virsta paprastu tarpu.
 *   Perjungimas tarp rezimu turinio NEPRARANDA — konvertuojama vietoje.
 *
 * Petshop Katalogas v6.4 (S692) — TRUMPAS APRASYMAS KORTELEJE.
 *   Savininko taisykle: „is viso i WC geriau nelysti — ten duomenys turi
 *   automatiskai koreguotis, kai mes taisome savo korteleje".
 *   Taisykle uzrakinta. Techniskai sinchronizacijos nera ir nereikia: kortele
 *   raso i TUOS PACIUS laukus (`post_excerpt`, `post_content`, terminus), tai
 *   vienas ir tas pats irasas. Truko tik laukų kortelėje.
 *   Trumpas aprasymas (`post_excerpt`) — tas tekstas, kuri pirkejas mato virs
 *   „I krepseli" — iki siol buvo redaguojamas TIK WooCommerce lange. Dabar jis
 *   yra skirtuke „Aprasymai", su ta pacia mechanika: 5 ankstesnes versijos,
 *   uzraktas nuo importo (`_ps_trumpas_uzrakintas`), zurnalas.
 *   WC langas lieka kaip avarinis kelias, ne kaip kasdienis.
 *
 * Petshop Katalogas v6.3 (S691) — KOPIJA YRA IDENTISKA.
 *   Savininko sprendimas: kopija perima VISKA, iskaitant nuotrauka ir sudeti;
 *   tusti lieka tik SKU, EAN ir kaina. Pakeista tik nuorodos paaiskinimas —
 *   darbas vyksta `petshop-gavimas.php` v1.8.
 *
 * Petshop Katalogas v6.2 (S690) — KOPIJUOTI I NAUJA PREKE.
 *   Savininko klausimas: „matau yra panasi preke, kaip padaryti prekes kopija".
 *   Kortelejė atsirado nuoroda „Kopijuoti į naują ↗" — ji atidaro Gavimo langa
 *   su uzpildyta klasifikacija (kategorija, brendas, rusis, pakuotes dydis,
 *   svoris, aprasymo karkasas). SKU, EAN, kaina, nuotrauka ir tiekejo laukai
 *   NEperimami samoningai — zr. `petshop-gavimas.php` v1.7 komentara.
 *   WooCommerce „Dubliuoti" cia netinka: jis kopijuoja ir `_zb_*`/`_vf_*`, o
 *   tokia preke artimiausias importas perrasytu.
 *
 * Petshop Katalogas v6.1 (E1, S768) — SARGAS NAVIGACIJOJE IR GRIZIMAS I VIETA.
 *   v6.1 TAISYMAS: v6.0 navigacijos sargas apemė ir saraso eilutes, kurias jau
 *   perima senesnis sargas. Du perėmimai su `stopImmediatePropagation`
 *   nutraukdavo Enter grandinę, ir kaina apskritai NEISSISAUGODAVO — klaida
 *   rimtesnė uz ta, kuria taisiau. Dabar naujasis sargas liecia tik isorines
 *   nuorodas ir niekada — korteles vidu.
 *   Savininko pastabos po testavimo:
 *   1. „Jei einu is lango i langa, turi VISADA klausti ar issaugoti — man
 *      nusimuse ir viskas dingo." Sargas perimdavo tik korteles uzdaryma;
 *      paspaudus „Akcijos" ar „Gavimas" puslapis keisdavosi ir neirasyti
 *      laukai dingdavo tyliai. Dabar perimamos ir navigacijos, ir eiliu, ir
 *      saraso nuorodos.
 *   2. „Po kiekvieno issaugojimo turi buti refresh, nes neaisku ar
 *      issisaugojo." Pilnas perkrovimas atimtu vieta sarase, todel irašytas
 *      laukas trumpam nusidazo ZALIAI — irodymas, kad serveris ATSAKE.
 *   3. „Isejus is korteles kataloge ismeta visai i kita vieta." Uzdarius
 *      eilute parodoma ir pazymima geltonai 2,6 s.
 *
 * Petshop Katalogas v5.9 (E1, S767) — AKSESUARU SEKCIJOS.
 *   Aksesuarams buvo tik „Aprasymas". Zaislui to gana, bet guoliui, dezei ar
 *   antkakliui matmenys ir medziaga yra pirkimo sprendima lemianti
 *   informacija. Pridetos DVI sekcijos, ne daugiau.
 *
 * Petshop Katalogas v5.8 (E1, S764) — SAVIKAINOS SALTINIAI SUVIENODINTI.
 *   Savininko taisykle: „tiekejo man pateikta kaina yra mano savikaina".
 *   Katalogas eme savikaina TIK is `ps_sources` registro, todel preke, kurios
 *   registre dar nera, atrode „be savikainos", nors `_vf_cost` ar `_zb_cost`
 *   buvo uzpildyta. Del to katalogas rode 795, o pilnumo variklis 744 — du
 *   skirtingi atsakymai i ta pati klausima, ir zmogus negalejo zinoti, kuris
 *   teisingas. Dabar atsargine tvarka (`_cost_price` → `_vf_cost` →
 *   `_zb_cost`) vienoda ir sarase, ir korteleje.
 *
 * Petshop Katalogas v5.7 (E1, S763) — DUOMENU SKOLOS ISSKAIDYTOS.
 *   v5.7: pasalinti dublikatai. Pirmoji versija salia esamu „Be savikainos"
 *   (795) ir „Be EAN" (1 459) idejo dar „Be savikainos (turinys)" (744) ir
 *   butu idejusi „Be EAN" (1 427). Tie patys pavadinimai su skirtingais
 *   skaiciais klaidina labiau nei vienas punktas: skirtumas atsiranda todel,
 *   kad katalogas ziuri `cost` is saltiniu registro, o pilnumas —
 *   `Petshop_Pardavimai::savikaina()`, kuri ima ir tiekeju kainas.
 *   Taip pat „Truksta turinio" (99) pakeista tikslesne „Be aprasymo" (195).
 *   Savininko pastaba: „Duomenų skolos — čia labai abstraktu, išskirk
 *   savikainas, kas ten dar; taip patogiau: atsidarai prekes, sutaisai, jos
 *   dingsta iš tos kategorijos".
 *   Skaicius 1 960 nesake, KA daryti. Recon parode sudeti: EAN 1 371,
 *   savikaina 744, serimo lentele 502, analitines 197, aprasymas 193,
 *   serimo instrukcija 189, pakuotes dydis 173, sudetis 156, gyvuno rusis 45.
 *   Dabar kiekvienas is ju — atskira eile.
 *   Filtruojama pagal `_ps_pilnumas_kodai` (pilnumas v1.2), NE pagal
 *   `_ps_pilnumas_truksta`: pastarasis yra tekstas zmogui ir sutrumpintas
 *   („EAN ir dar 1"), todel preke, kuriai truksta serimo lenteles IR
 *   sudeties, pagal „sudetis" nebutu rasta.
 *
 * Petshop Katalogas v5.5 (E1, S762) — PARTIJOS LAUKAI REDAGUOJAMI.
 *   Savininko pastaba: „nera funkcijos taisyti galiojimo datos, reikia
 *   padaryti — mes kalbejome, visi laukai turi buti redaguojami, isskyrus
 *   koda". Partijos is tos taisykles buvo iskritusios: duomenys ivedami
 *   Gavimo lange ir po to netaisomi niekur.
 *   Du realus pagrindai: (1) priimant sunta lengva suklysti su data ar
 *   kiekiu, (2) tiekejas gali PRATESTI „geriausia iki" termina — teisetas
 *   sprendimas, kuriam sistema neturi trukdyti.
 *   Redaguojami TRYS laukai: likutis, savikaina, geriausia iki. Gavimo data,
 *   tiekejas ir gautas kiekis — ne: tai siuntos faktai, turintys sutapti su
 *   saskaita, o ju taisymas reikstu, kad apskaita ir dokumentas isvaziuoja.
 *   Kiekvienas pakeitimas patenka i ivykiu zurnala su „buvo → tapo".
 *
 * Petshop Katalogas v5.4 (E1, S761) — GALIOJIMO FILTRAI IR KELIAS I AKCIJA.
 *   1. TRYS eiles vietoj dvieju: „Pasibaige" atskirai — tokia preke nera
 *      nuolaidos klausimas, o nurasymo, ir maisyti ja su dar parduodamomis
 *      reikstu siulyti pirkejui netinkama preke.
 *   2. Ribos keiciamos is lango: ≤30 · ≤60 · ≤90 · ≤180 arba „skubu iki /
 *      stebeti iki". Sausam maistui 90 d. normalu, sviežiai produkcijai per
 *      ilgai — todel ribos ne kode, o po ranka.
 *   3. Mygtukas „Sukurti trumpo galiojimo akcija →" perduoda dienu riba i
 *      Akciju langa. Be jo eile butu tik sarasas: problema matai, bet kad ka
 *      nors padarytum, tektu is naujo rinkti tas pacias prekes kitame lange.
 *
 * Petshop Katalogas v5.3 (E1, S760) — PALEIDIMO DATA KAIP ATSKAITOS TASKAS.
 *   Savininko pastaba: „mes gal uz menesio tik pasileisme, o statistika rodys,
 *   kad neparduodama 100 d." — teisinga ir svarbi.
 *   v5.2 skaiciavo nuo publikavimo, o migruotoms prekems tai yra IMPORTO
 *   diena (dev'e — birzelio 4-oji). Paleidus parduotuve spali, pirma diena
 *   visas katalogas atrodytu neparduodamas keturis menesius, ir eile taptu
 *   beverte nuo starto.
 *   Dabar atskaitos taskas — VELESNIS is dvieju: prekes publikavimo ir
 *   parduotuves PALEIDIMO datos (`ps_paleidimo_data`). Kol paleidimo diena
 *   dar neatejo, skaicius isvis neskaiciuojamas: klausimas „kodel
 *   neparduodama" prie uzdarytos parduotuves prasmes neturi.
 *
 * Petshop Katalogas v5.2 (E1, S759) — JUDEJIMAS IR GALIOJIMAS ATSKIRTI.
 *   Savininko pastaba: sumaisiau du skirtingus dalykus. PREKIU JUDEJIMAS
 *   (kiek laiko neparduodama) ir PREKIU GALIOJIMAS (geriausia iki) turi
 *   skirtingus saltinius, skirtingus filtrus ir skirtingus sprendimus.
 *   1. Kaireje — atskira grupe „Galiojimas".
 *   2. „Negyvos atsargos" → „Neparduodama ≥ N d.". Terminas buvo pazodinis
 *      „dead stock" vertimas ir nesake, ka matuoja.
 *   3. Riba nebe fiksuota (buvo 365): 60 · 90 · 180 · 360 arba nuo–iki.
 *      60 dienu be pardavimo skanestams jau signalas, aksesuarams — norma.
 *   4. Skaiciuojama nuo PASKUTINIO pardavimo, o jei preke niekada neparduota
 *      — nuo PUBLIKAVIMO. `post_date` netinka: dev bazeje 1 605 prekes
 *      „sukurtos" viena diena — tai migracijos importas, ne publikavimas, o
 *      preke gali menesi guleti juodrasciuose. Todel `_ps_publikuota`
 *      fiksuojamas per `transition_post_status` ir tik pirma karta.
 *
 * Petshop Katalogas v5.1 (E1, S758) — GERIAUSIA IKI.
 *   Duomenys buvo: partijos su datomis, `artimiausias_galiojimas()`, FEFO.
 *   Nebuvo VIETOS, kur pamatytum, KURIOS prekės baigiasi — funkcija atsako
 *   apie vieną prekę, o sąrašui to neužtenka.
 *   1. `partiju_datos()` — vienas SELECT visoms prekėms (per prekę būtų
 *      1 400 užklausų). Imamos tik partijos su likučiu: pasibaigusi data ant
 *      tuščios partijos yra istorija, ne problema.
 *   2. DVI eilės, ne viena: „Geriausia iki ≤ 30 d." (jau reikia nuolaidos) ir
 *      „Artėja geriausia iki" (dar spėsi įprasta kaina). Sumaišius, skubūs
 *      atvejai paskęsta tarp neskubių. Ribos keičiamos per `ps_gi_ribos`.
 *   3. Būklės taškas eilutėje pagelsta/parausta ir be įėjimo į tą eilę.
 *   4. Stulpelis „Geriausia iki" rodomas TIK savo eilėse — kitur jis būtų
 *      tuščias 1 399 eilutėse iš 1 400.
 *
 * Petshop Katalogas v5.0 (E1, S755) — VIENINGA NAVIGACIJA.
 *   Savininko pastaba: „gal ir cia reikia ideti virsuje Gavimas ir Akcijos".
 *   Kiekvienas langas turėjo savo juostą: kataloge nebuvo nei Akcijų, nei
 *   Gavimo; Akcijų lange — nebuvo Gavimo; Gavime — tik „Katalogas".
 *   Dabar visi penki langai turi tą patį sąrašą iš vienos vietos
 *   (`Petshop_Katalogas::navigacija()`), o Akcijos ir Gavimas jį naudoja.
 *
 * Petshop Katalogas v4.9 (E1, S754) — RYSYS SU AKCIJU LANGU.
 *   Kortelėje rodoma, ar prekė dalyvauja akcijoje, kokioje ir iki kada, su
 *   nuoroda į ją. Akcijinė kaina čia NEREDAGUOJAMA (TŽ 37.6) — kitaip po
 *   pusmečio neaišku, kur akcija sukurta ir kas ją turi išjungti.
 *   Jei akcijos kaina uždėta ne per Akcijų langą (senasis petshop-promotions),
 *   rodomas geltonas įspėjimas: tokia akcija nesivaldo automatiškai.
 *
 * Petshop Katalogas v4.8 (E1, S753) — NEIRASYTI PAKEITIMAI MATOMI IR SAUGOMI.
 *   Savininko pastaba: „kodel uzdarant nepaklausia ar issaugoti duomenis?
 *   Ne, dabar neaisku".
 *   1. SARGAS BUVO NEPILNAS: kabejo tik ant × ir ←/→. Uzdarant Esc klavisu
 *      arba paspaudus kita preke sarase pakeitimai dingdavo TYLIAI. Dabar
 *      perimami visi keturi isejimo keliai.
 *   2. KLAUSIMAS BUVO NETEISINGAS: `confirm()` teturi du mygtukus, todel
 *      buvo galima tik „prarasti" arba „likti" — issaugoti nebuvo kaip.
 *      Dabar langas su trimis: Issaugoti ir uzdaryti / Uzdaryti neissaugojus /
 *      Grizti i kortele. Ivardijama, kurie butent laukai neirasyti.
 *   3. IRASYMAS BUVO NEMATOMAS: vyko per Enter, kurio nesimato. Dabar
 *      korteles apacioje — juosta „Neirasyta: N · Kaina, EAN" su mygtukais
 *      [Irasyti] [Atmesti], kaip ir sarase.
 *
 * Petshop Katalogas v4.7 (E1, S752) — v4.6 REGRESIJOS TAISYMAS + NUOTRAUKU SAUGIKLIAI.
 *   1. KORTELES APACIA GRIZO. v4.6 `height:auto !important` su nustatytais
 *      top+bottom pagal CSS reiskia „aukstis pagal turini", o `bottom` tada
 *      IGNORUOJAMAS. Kortele isaugdavo iki 1161 px prie 1050 px ekrano,
 *      vidine slinktis nustodavo veikti (scrollHeight == clientHeight) ir
 *      apatine turinio dalis — puse aprasymu lango — likdavo nukirsta ir
 *      nepasiekiama. Aukstis nurodomas konkreciai: calc(100vh - 32px).
 *   2. „IKELTI NAUJA" ATSKIRAI. Buvo vienas mygtukas „Pakeisti", atidarydaves
 *      medijos biblioteką — atrodė, kad įkelti naujos nuotraukos negalima.
 *      Dabar du: „Įkelti naują…" (atsidaro ties įkėlimu) ir „Pasirinkti
 *      iš medijos…". Tas pats galerijai.
 *   3. NUOTRAUKA NEBEKEICIAMA TYLIAI. Prieš keitičiant — klausiama; po
 *      įrašymo pasirodo juosta su „Atšaukti", grąžinančia buvusią.
 *      Buvusios ID rašomas ir į įvykių žurnalą.
 *
 * Petshop Katalogas v4.6 (E1, S751) — KORTELE NUO VIRSAUS, PAVADINIMAS, SKU SPYNA.
 *   1. KORTELE FIXED. v4.5 `scrollTo(0,0)` suveikdavo, bet iškart po jo
 *      `scrollIntoView` ant sąrašo eilutės vėl nustumdavo langą žemyn, o
 *      sticky kortelė sekdavo paskui — viršus (nuotrauka, pavadinimas,
 *      kaina) likdavo virš ekrano krašto. Dabar kortelė `fixed`: visada
 *      pilna nuo viršaus, o sąrašo pozicija nebekeičiama.
 *   2. PAVADINIMAS REDAGUOJAMAS. Slug (`post_name`) NEKEIČIAMAS — jis jau
 *      indeksuotas, keitimas reikštų 301 grandinės ir prarasto srauto.
 *      Įrašius atsinaujina ir sąrašo eilutė.
 *   3. SKU UŽRAKINTAS (savininko pastaba: „prie ko viskas rišasi"). Prie jo
 *      kabo ps_sources registras, tiekėjų XML sutapdinimas, užsakymų eilutės
 *      ir kainų palyginimo feed sąrašai. Ne visiškai: naujoms ir legacy prekėms
 *      kodą suvesti reikia, todėl spyna nuimama sąmoningu veiksmu su
 *      įspėjimu, kas būtent nutrūks.
 *
 * Petshop Katalogas v4.5 (E1, S750) — ATRIBUTAI IR NUOTRAUKOS VIETOJE.
 *   Savininko pastaba: „jokio atributu redagavimo, nuotrauku — niekas
 *   nepadaryta", „kortele turi matytis nuo virsaus".
 *   1. KORTELE ATSIDARO NUO VIRSAUS. Iki siol ji islaikydavo ankstesnes
 *      prekes slinkties pozicija, todel atsidarydavo per vidurio bloka.
 *   2. ATRIBUTAI REDAGUOJAMI KORTELEJE. Buvo tik rodomi su prierasu
 *      „keiciami WooCommerce puslapyje" — t. y. lauk is lango, i kuri ka
 *      tik atejai. Dabar: „keisti" → pasirinkimas → įrašyti. Terminai
 *      priskiriami TIK per term_id (slug kolizija „1,5 kg"/„15 kg"),
 *      registruojama `_product_attributes`, valomi WC transientai.
 *      Kelias reikšmes turintys (baltymai, spec. mityba, amžius) — varnelės.
 *   3. NUOTRAUKOS VALDOMOS KORTELEJE. Buvo tik failų vardų sąrašas. Dabar:
 *      įkelti/pakeisti pagrindinę, pridėti į galeriją, ★ padaryti pagrindine,
 *      × išmesti, ← → keisti tvarką, alt tekstas redaguojamas. Keičiant
 *      pagrindinę senoji nedingsta — keliauja į galerijos pradžią.
 *
 * Petshop Katalogas v4.4 (E1, S749) — MATOMUMAS IR NEPRARANDAMI PAKEITIMAI.
 *   Savininko pastaba: „paieskos laukas juodas net nesimato kur ka irasyti".
 *   1. PAIESKA: buvo juoda ant juodos (#141a18 ant #1d2422) — laukas
 *      nesimatė. Dabar baltas laukas su lupa ir aiškiu placeholder.
 *   2. SARGAS: pakeitęs kainą ir pamiršęs Enter žmogus uždarydavo kortelę
 *      ir pakeitimas dingdavo TYLIAI. Dabar: pakeistas laukas geltonas,
 *      uždarant/naviguojant su geltonais laukais — klausiama, puslapio
 *      uždarymas irgi sulaikomas.
 *   3. UZUOMINA: niekur nebuvo pasakyta, kad įrašo Enter. Dabar parašyta
 *      po „Kaina ir marža" bloku.
 *   4. SKU/EAN kopijuojami vienu paspaudimu (📋) — kopijuojama dešimtis
 *      kartų per dieną, o iki šiol tekdavo žymėti pele.
 *   5. „Trūksta: …" pilnumo bloke — gintarinis akcentas vietoj pilkos
 *      smulkmenos: tai vienintelis veiksmų sąrašas kortelėje.
 *
 * Petshop Katalogas v4.3 (E1, S748) — RENGYKLES KLAIDA.
 *   Savininko pastaba: „matau tik klaidas". Kataloge kabojo raudona juosta
 *   „Failed to load plugin: table" — v4.1 rengykle prase TinyMCE priedo,
 *   kurio WordPress komplekte nera. Priedas pasalintas.
 *   Taip pat: `belacor` → `belcor_tofu` (tikroji `_ps_sandelis` reiksme),
 *   kitaip zenkliuko spalva niekada nebutu suveikusi.
 *
 * Petshop Katalogas v4.2 (E1, S747) — UX AUDITAS (patyrusio operatoriaus akimis).
 *   1. KLAIDA: kortelėje `$kat_tipas` buvo naudojamas 34 eilutėmis PRIEŠ jo
 *      apibrėžimą, todėl maisto filtravimo atributai (baltymų šaltinis,
 *      amžius, grūdai, monoprotein, spec. mityba, veislės dydis) kortelėje
 *      NIEKADA nesirodė, o kiekvienas kortelės atidarymas kėlė PHP warning.
 *      Skaičiavimas perkeltas prieš atributų bloką.
 *   2. Sandėlio ženkliukai: spalvas turėjo tik AV/VF/ZB — Quattro, Prins,
 *      Ambrosia, Belacor ir legacy susiliedavo į pilką. Dabar visi 7 turi
 *      pastovias spalvas (ta pati paletė ir Gavimo lange).
 *   3. Marža kortelėje perskaičiuojama GYVAI berašant kainą ar savikainą —
 *      anksčiau naujas skaičius pasirodydavo tik po Enter. Eilutė rodoma ir
 *      kai savikainos dar nėra („—"), kad įvedus ji užsipildytų vietoje.
 *   4. Kai rankinė savikaina nesuvesta — raudona pastaba, ne tylus tuščias
 *      laukas (~1 175 legacy prekių be savikainos).
 *
 * Petshop Katalogas v4.1 (E1, S746) — WORDPRESS RENGYKLE.
 *   Savininko pastaba: „man reikia teksta tvarkyti, sakykim kokia gramatine
 *   ar logine klaida istaisyti". Iki siol laukas rode HTML, todel klaidos
 *   taisymas tarp <td> zymu buvo neimanomas — o kodo valymas to nepakeite,
 *   nes tekstas ir toliau buvo rodomas kaip kodas.
 *   Dabar: TinyMCE su mygtukais (paryskinimai, sarasai, lenteles), „Tekstas /
 *   HTML kodas" perjungimas, o iklijuojant is narsykles stiliai numetami —
 *   butent jie ir yra ta sankla, kuri aprasymus pavertė neredaguojamais.
 *
 * Petshop Katalogas v4.0 (E1, S745) — HTML VALYMAS.
 *   Savininko pastaba: „tu manai, kad cia imanoma kazka koreguoti?" — ir
 *   tiesa: tiekeju aprasymuose iki 40 % teksto yra `style="color:black
 *   !important"`, `<style>` blokai, `b2b-black` apvalkalai ir `<meta>`
 *   viduryje turinio. Redaguoti toki teksta reiskia redaguoti koda.
 *   „Išvalyti kodą" pasalina sankla, o tekstą, sarasus ir LENTELES palieka.
 *   Lenteles saugomos atskirai: jei valymas ju sumazintu — sustojama.
 *   Pries valant rodoma perziura su skaiciais.
 *
 * Petshop Katalogas v3.9 (E1, S744) — APRASYMAS REDAGUOJAMAS.
 *   Savininko pastaba: „ir ka man dabar daryti, jei tik informacijai — tai
 *   bevertis reikalas?" Kortele konstatuodavo „tekste nėra antraščių", bet
 *   mygtuko pataisyti nebuvo. Priekaistas be irankio.
 *   Dabar: teksto laukas · „Įrašyti" · „Įterpti antraščių karkasą" (prideda
 *   butent tos kategorijos sekcijas) · „Grąžinti ankstesnę" (5 versijos).
 *   Rasoma per `wp_update_post`, NE per `wc/v3` — pastarasis aprasymus
 *   korumpuoja. Irasius uzdedamas `_ps_aprasymas_uzrakintas`.
 *
 * Petshop Katalogas v3.8 (E1, S743) — APRASYMU LANGAI PAGAL KATEGORIJA.
 *   Savininko pastaba: tualetas gaudavo „Šėrimo lentelė — nėra". Reikalavimas,
 *   kurio niekada nebus ivykdyta, nera informacija — tai triuksmas.
 *   1) serimo lentele (abu blokai) rodoma TIK maistui;
 *   2) filtru atributu sarasas — pagal kategorija (aksesuarui nerodomas
 *      „Baltymų šaltinis" ir „Amžius");
 *   3) „TIK KURJERIU" varnele: automatika sprendzia is svorio ir matmenu, bet
 *      daliai preku ju nera (tualetas 56×39×38,5 cm turi 0.0000), todel
 *      resolveris grazina false ir preke pasiūloma i pastomata.
 *
 * Petshop Katalogas v3.7 (E1, S742) — TRYS SAVININKO PASTABOS.
 *   1) LOGINE KLAIDA: zaislui buvo rodomas maisto antrasciu sarasas
 *      („Sudėtis, Analitinės, Šėrimo instrukcija"), nors blokas zemiau
 *      teisingai sake „vertinama kaip aksesuarai". Du priestaraujantys
 *      atsakymai viename lange. Dabar sarasas imamas is `sekciju_lukesciai()`.
 *   2) TEKSTAS TAMSESNIS — pilka ant pilksvo fono susilieja.
 *   3) EAN laukas praplestas: 13 skaitmenu i 172 px netilpo.
 *   Plius: partijos perkeltos i kaire kolona (buvo virs viso tinklelio).
 *
 * Petshop Katalogas v3.6 (E1, S735) — PARTIJOS, PARDAVIMAI, PAKUOTE.
 *
 * v3.6 (S735): kortelėje prijungtas `Petshop_Partijos` (S734):
 *   PARTIJOS blokas  kas guli lentynoje · savikaina · geriausia iki · FEFO
 *   SAVIKAINA        AV prekems — svertinis vidurkis is partiju, ne rankinis
 *                    laukas (du skaiciai issiskirtu, ir nebutu aisku, kuris tikras)
 *   PARDAVIMAI       atskiras skirtukas — soninej kolonoj telpa tik santrauka
 *   PAKUOTE (GPAIS)  sudetis + inasas i deklaracija pagal metus
 *
 * Petshop Katalogas v3.5 (E1, S731) — REDAGAVIMAS KORTELEJE.
 *
 * v3.5 (S731): kaina, akcijine, savikaina, SKU, EAN ir svoris redaguojami
 *   tiesiog kortelėje (Enter iraso, Esc atstato). Kiekvienas irasymas — i
 *   zurnala su operacijos numeriu, todel atsaukiamas.
 *   SAVIKAINA redaguojama TIK kai jos nevaldo tiekejas: VF/ZB prekems ji
 *   ateina is `_vf_cost`/`_zb_cost`, ir irasymas i `_cost_price` nieko
 *   nepakeistu — tyliai priimti tokia ivesti reikstu meluoti.
 *   SKU ir EAN tikrinami unikalumui — dublikatas sulauzytu susiejima su XML.
 *   Prideti maketo v18 blokai: filtravimo atributai, rysys su tiekeju,
 *   serimo lentele, siuntimas.
 *
 * Petshop Katalogas v3.4 (E1, S730) — KORTELE KAIP DARBO VIETA.
 *
 * v3.4 (S730): isdestymas pagal pramones standarta (Shopify produkto puslapio
 *   logika): kaire = tai, su kuo dirbama; desine = kontekstas.
 *   Kortele isplesta iki ~1180 px — siauroje 300 px juostoje iki "Kaina ir
 *   marza" reikedavo slinkti per tris ekranus.
 *   TUSCI BLOKAI NERODOMI: blokas atsiranda tik kai turi ka pasakyti.
 *
 * Petshop Katalogas v3.3 (E1, S729) — DIZAINAS PAGAL MAKETA v18.
 *
 * v3.3 (S729): pilno ekrano rezimas (WP meniu paslepiamas TIK siame puslapyje),
 *   tipografija ir tarpai pagal maketa, kategorijos kodas po nuotrauka,
 *   suvestine nusileido PO lentele.
 *   PRIEZASTIS: v3.1/v3.2 salino stulpelius, nes lentele netilpo — bet
 *   netilpo del WP meniu, atimancio ~230 px. Taisyta ne ten, kur problema.
 *
 * Petshop Katalogas v3.2 (E1, S728) — prekių sąrašas, filtrai, darbo eilės.
 *
 * v2.9 PRIJUNGTI TRYS VARIKLIAI:
 *   Petshop_Ivykiai (S721)    vieninga laiko juosta vietoj triju zurnalu
 *   Petshop_Pardavimai (S722) greitis, ABC, dienu atsargai
 *   Petshop_Pilnumas (S723)   duomenu pilnumo balas pagal prekes tipa
 * Nauji stulpeliai: Pardavimai · Uzteks · Pilnumas.
 * Naujos eiles: Baigiasi greiciau nei tiekiama · Negyvos atsargos (AV) ·
 * Duomenu skolos.
 * Kortelėje — "Kaip sekasi" blokas VIRSUJE, ne paskutiniame skirtuke.
 *
 * v3.0 (S726): kortelėje pridėti trys blokai is `Petshop_Rysiai`:
 *   "Kur ši prekė dalyvauja"  rinkiniai · FBT · DP skelbimai · akcijos
 *   "Ta pati prekė kitais dydžiais"  su €/kg ir kainodaros ispejimu
 *   "Kur prekė matoma"  parduotuve · likutis · paieška · feed sąrašai
 *
 * v3.1 (S727) — VIZUALINES PATIKROS ISVADOS. Screenshot'as parode du dalykus,
 * kuriu HTML testai nematė:
 *   1) sarase "Pilnumas" stulpelis netilpo (desinysis krastas uz ekrano) IR
 *      dubliavo bukles taska kaireje → stulpelis pasalintas, bukles taskas
 *      padarytas rikiuojamas;
 *   2) kortelėje buvo DU pilnumo blokai su tuo paciu 60 % → senasis pasalintas.
 * Abiem atvejais sprendimas — pasalinti dublikata, o ne prideti dar viena.
 *
 * v3.2 (S728): "Pardavimai" ir "Užteks" sujungti i viena stulpeli — po
 * "Pilnumo" pasalinimo lentele vis dar netilpo (1251 px pries 1210 px).
 * Abu rodikliai yra vienas blokas: kiek parduodama ir kiek dar uzteks.
 *
 * VISI VARIKLIAI turi atsargines sakas: jei modulio nera, langas veikia kaip
 * v2.8, o ne luzta. Todel diegimo eiliskumas nesvarbus.
 *
 * TŽ 37 skyrius. Vaizdinis priedas: prekiu_katalogas_maketas_v18.html.
 *
 * PASTABA: antraste "SI VERSIJA TIK SKAITO" galiojo v1.0 ir liko nepataisyta
 * per kelias versijas. Nuo v1.2 langas RASO: AV korekcijos, kainos, masiniai
 * veiksmai, isemimas is prekybos — visi su zurnalu ir atsaukimu.
 * Rašymo sluoksnis (AV korekcija, kainos, aprašymai) — v1.2, atskirai.
 *
 * SKAIČIŲ TAISYKLĖ (TŽ 37.3): parduodamas kiekis imamas TIK iš
 * Petshop_Stock_Service. Filtrai, eilės ir suvestinė naudoja TĄ PATĮ skaičių —
 * kitaip du ekrano taškai sakytų priešingus dalykus (maketo v8 klaida).
 *
 * v1.2: KRŪVA ir EILĖ atskirti į du nepriklausomus matmenis (savininko pastaba).
 * Anksčiau „Juodraščiai" buvo eilė greta „Be EAN" — todėl tvarkant EAN kodus
 * iššokdavo prekė, kuri seniai guli juodraščiuose. Dabar krūva (Prekyboje /
 * Juodraščiai / Visos) pasirenkama viršuje ir galioja VISOMS eilėms bei
 * filtrų sąrašams. Ta pati priemonė, atskiros krūvos, jokio persimaišymo.
 *
 * v1.3: nuotrauka, siūloma kaina, marža plokštele, prekės pilnumas, debesėliai.
 * Spalva rodo TIK tai, dėl ko prekė guli darbo eilėje — jei nuspalvinsi viską,
 * po savaitės akis nustos ją matyti. Ir niekada vien spalva: visada spalva PLIUS
 * žodis (plokštelė „10 %" + „žemiau ribos"), kad veiktų ir spausdinant, ir
 * esant spalvų neskyrimui.
 *
 * Nuotraukoms naudojamas ESAMAS `thumbnail` dydis, sumažintas CSS'u.
 * Naujas dydis NEKURIAMAS: WP sugeneruotų dar vieną variantą ~5 000 prekių,
 * o ShortPixel paskui prašytų kreditų (84 % jų ir taip eina miniatiūroms).
 *
 * v1.5: prekės kortelė šoniniame skydelyje. Paspaudus eilutę duomenys
 * pakraunami atskira užklausa — 50 kortelių iš karto į puslapį netilptų.
 * Kortelė kol kas TIK SKAITO; rašymo veiksmai sės ant jos v1.6.
 *
 * v1.6: PIRMAS RAŠYMO VEIKSMAS — AV likučio įvedimas tiesiai sąraše.
 * Priežastis pasirenkama vieną kartą visam praėjimui (kitaip greitis dingsta),
 * bet žurnale ji lieka prie kiekvieno įrašo.
 * Įvedimas: „12" nustato dvyliką; „+5" arba „-2" prideda arba atima.
 * Niekas nerašoma po vieną — sukaupti pakeitimai išsaugomi viena partija su
 * operacijos numeriu, todėl visą praėjimą galima atšaukti vienu veiksmu.
 *
 * KUR RAŠOMA (S590 pamoka): prekė be tiekėjo → `_stock`; prekė su tiekėju →
 * `_own_stock_qty`. Ta pati taisyklė, kurią skaitant naudoja gyvi_is_meta().
 *
 * v1.7: kainos keitimas tuo pačiu principu kaip likučiai.
 * KAINĄ PAKEITUS RANKA, prekė automatiškai gauna `_manual_price_override=yes`
 * (savininko sprendimas): pakeista ranka — vadinasi nebe automatinė. Kitaip
 * ZB (S85) ir VF (S86) importai kitą praėjimą kainą grąžintų, o žmogus
 * galvotų, kad išsaugojo.
 * Įvedimas: „12,99" arba „12.99" nustato; „+1,50" ir „-0,80" keičia.
 * Langelyje iškart matyti, kokia tampa marža ir ar ji nekrenta žemiau ribos.
 * Kaina žemiau savikainos reikalauja atskiro patvirtinimo.
 *
 * v1.9: kortelė papildyta aprašymais, nuotraukomis ir istorija; suskirstyta
 * į skirtukus. Visi duomenys atsiunčiami viena užklausa — skirtukai tik
 * perjungia matomumą, todėl perėjimas tarp jų momentinis.
 *
 * v2.0: aprašymų skirtukas perdarytas. Ankstesnė versija ieškojo
 * `petshop_desc_*` laukų — jų sistemoje NĖRA nė vienoje iš 2 744 prekių.
 * Akordeonas (snippetas 512) skaido `post_content` pagal TEKSTE esančias
 * antraštes ir naudoja tas pačias funkcijas `psdp_split()` / `psdp_title()`.
 * Kortelė dabar rodo tą patį, ką matys pirkėjas, ir kokių sekcijų trūksta.
 *
 * v2.3: kortelės užklausa gavo laiko limitą ir pakartojimą. Dev serveris
 * retkarčiais nutraukia ryšį (ERR_HTTP2_PROTOCOL_ERROR) — tada kortelė likdavo
 * amžinai ties „Kraunama…", nes nebuvo nei ribos, nei būdo bandyti iš naujo.
 *
 * v2.4: ištaisytas vardų susidūrimas — `rodyk()` buvo apibrėžta DUKART
 * (debesėliui ir AV įvedimo langeliui). JS antrąją laikė galiojančia, todėl
 * užvedus pelę debesėliai nustojo veikę. Įvedimo funkcija pervadinta į
 * `atverkLangeli()`. Pamoka: viename `<script>` bloke visi vardai bendri.
 *
 * v2.5: rašymas per WooCommerce CRUD, ne per update_post_meta.
 * S691 testas parodė: tiesioginis meta rašymas NEATNAUJINA
 * `wc_product_meta_lookup` (min_price, stock_quantity). Prekės puslapyje kaina
 * pasikeisdavo, o katalogo puslapiuose, filtruose ir rikiavime likdavo sena.
 * `$product->save()` atnaujina lookup, transientus ir paleidžia hook'us.
 * Išimtis: `_own_stock_qty` — tai MŪSŲ laukas, CRUD jo nepažįsta.
 *
 * v2.8: eilė „Be sandėlio" pervadinta į „Be šaltinio registre" — senasis vardas
 * melavo: prekės turėjo ZB sandėlį, tik neturėjo `_ps_sandelis` lauko.
 * Masinio veiksmo „Grąžinti į prekybą" vardas patikslintas į „Publikuoti".
 *
 * v2.7: MASINIAI VEIKSMAI. Pažymi varnelėmis, pasirenki veiksmą, matai
 * PERŽIŪRĄ (ką tiksliai darysi ir su kuo), tik tada vykdai. Visa partija gauna
 * vieną operacijos numerį, todėl atšaukiama vienu veiksmu.
 * Peržiūra privaloma — S665 pamoka: du kartus atranka atrodė teisinga ir
 * du kartus būtų palietusi ne tas prekes.
 * Masinio TRYNIMO nėra sąmoningai: negrįžtamas veiksmas daromas po vieną.
 *
 * v2.6: kortelėje VEIKSMŲ meniu — Į juodraščius · Į prekybą · Į šiukšlinę ·
 * Ištrinti visiškai. Trynimas reikalauja įrašyti prekės ID ranka: tai vienintelis
 * negrįžtamas veiksmas visame lange.
 *
 * WooCommerce prekių sąrašas paslepiamas CSS'u. PUSLAPIS PRIVALO likti
 * veikiantis — remove_submenu_page() jį uždaro (403) ir sulaužo masinius
 * veiksmus (S586 pamoka).
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Katalogas {

	const VERSIJA   = '8.4';
	const PVM       = 0.21;
	const PUSLAPIS  = 50;

	/** Maržos grindys pagal kategoriją (savininko sprendimas 2026-08-06). */
	public static function grindys() {
		$n = get_option( 'ps_marzos_grindys' );
		if ( is_array( $n ) && $n ) { return $n; }
		return array(
			'sausas-maistas' => 10,
			'konservai'      => 15,
			'skanestai'      => 20,
			'numatyta'       => 20,
		);
	}

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 8 );
		/* v8.4: išsaugoti vaizdai — įrašymas, trynimas, atstatymas. */
		add_action( 'admin_post_ps_kat_vaizdas', array( __CLASS__, 'vaizdo_veiksmas' ) );
		add_filter( 'admin_body_class', array( __CLASS__, 'body_klase' ) );
		add_action( 'admin_head', array( __CLASS__, 'slepti_wc_prekes' ) );
		add_action( 'wp_ajax_ps_kat_kortele', array( __CLASS__, 'ajax_kortele' ) );
		add_action( 'wp_ajax_ps_kat_av', array( __CLASS__, 'ajax_av_irasyti' ) );
		add_action( 'wp_ajax_ps_kat_atsaukti', array( __CLASS__, 'ajax_atsaukti' ) );
		add_action( 'wp_ajax_ps_kat_kaina', array( __CLASS__, 'ajax_kaina_irasyti' ) );
		/* v8.5: savikaina redaguojama ir sąraše, ne tik kortelėje. */
		add_action( 'wp_ajax_ps_kat_sav', array( __CLASS__, 'ajax_sav_irasyti' ) );
		add_action( 'wp_ajax_ps_kat_laukas', array( __CLASS__, 'ajax_laukas_irasyti' ) );
		add_action( 'wp_ajax_ps_kat_aprasymas', array( __CLASS__, 'ajax_aprasymas' ) );
		add_action( 'wp_ajax_ps_kat_isimti', array( __CLASS__, 'ajax_isimti' ) );
		add_action( 'wp_ajax_ps_kat_masinis', array( __CLASS__, 'ajax_masinis' ) );
		/* v4.5: atributai ir nuotraukos redaguojami VIETOJE — iki šiol kortelė
		   išmesdavo į WooCommerce redagavimo puslapį. */
		add_action( 'wp_ajax_ps_kat_atributas', array( __CLASS__, 'ajax_atributas' ) );
		add_action( 'wp_ajax_ps_kat_nuotraukos', array( __CLASS__, 'ajax_nuotraukos' ) );
		add_action( 'wp_ajax_ps_kat_pavadinimas', array( __CLASS__, 'ajax_pavadinimas' ) );
		/* v5.2: publikavimo momentas fiksuojamas TADA, kai jis ivyksta. */
		add_action( 'transition_post_status', array( __CLASS__, 'sekti_publikavima' ), 10, 3 );
		add_action( 'wp_ajax_ps_kat_paleidimas', array( __CLASS__, 'ajax_paleidimas' ) );
		add_action( 'wp_ajax_ps_kat_partija', array( __CLASS__, 'ajax_partija' ) );
		/* v6.8: GPAIS pakuociu eilutes — pridejimas, keitimas, trynimas. */
		add_action( 'wp_ajax_ps_kat_pakuote', array( __CLASS__, 'ajax_pakuote' ) );
		/* v7.0: kategorijos — kortelėje, ne WooCommerce lange. */
		add_action( 'wp_ajax_ps_kat_kategorijos', array( __CLASS__, 'ajax_kategorijos' ) );
		/* v7.3: nauja partija su galiojimu — tiesiai kortelėje. */
		add_action( 'wp_ajax_ps_kat_partija_nauja', array( __CLASS__, 'ajax_partija_nauja' ) );
		/* v7.5: vienos eilutes atnaujinimas sarase po pakeitimo kortelėje. */
		add_action( 'wp_ajax_ps_kat_eilute', array( __CLASS__, 'ajax_eilute' ) );
		/* v8.0: tiekejo (ne XML) likutis — atskiras nuo AV. */
		add_action( 'wp_ajax_ps_kat_tiekejo_likutis', array( __CLASS__, 'ajax_tiekejo_likutis' ) );
		/* v8.3: busenos perjungimas kortelėje. */
		add_action( 'wp_ajax_ps_kat_busena', array( __CLASS__, 'ajax_busena' ) );

		/* Pakeitus prekę bet kur — WooCommerce, importe, kitur — katalogo kešas
		   turi pasenti iškart, kitaip langas iki 5 min. rodytų senus skaičius. */
		add_action( 'woocommerce_update_product', array( __CLASS__, 'kesas_lauk' ), 99 );
		add_action( 'woocommerce_new_product', array( __CLASS__, 'kesas_lauk' ), 99 );
		add_action( 'trashed_post', array( __CLASS__, 'kesas_lauk' ), 99 );
		add_action( 'untrashed_post', array( __CLASS__, 'kesas_lauk' ), 99 );
	}

	public static function kesas_lauk( $pid = 0 ) {
		if ( $pid && get_post_type( $pid ) !== 'product' ) { return; }
		delete_transient( 'ps_kat_duomenys' );
	}

	/* ==================== AV LIKUČIO RAŠYMAS ==================== */

	public static function zurnalo_lentele() {
		global $wpdb; return $wpdb->prefix . 'ps_av_zurnalas';
	}

	/** Lentelė kuriama tik prireikus — pirmą kartą įrašant. */
	private static function uztikrinti_zurnala() {
		global $wpdb;
		$t = self::zurnalo_lentele();
		if ( $wpdb->get_var( "SHOW TABLES LIKE '{$t}'" ) === $t ) { return true; }
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( "CREATE TABLE {$t} (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			operacija VARCHAR(24) NOT NULL,
			product_id BIGINT UNSIGNED NOT NULL,
			laukas VARCHAR(32) NOT NULL,
			buvo VARCHAR(32) NULL,
			tapo VARCHAR(32) NULL,
			pokytis INT NULL,
			priezastis VARCHAR(32) NOT NULL,
			user_id BIGINT UNSIGNED NOT NULL,
			sukurta DATETIME NOT NULL,
			atsaukta TINYINT(1) NOT NULL DEFAULT 0,
			PRIMARY KEY (id),
			KEY operacija (operacija),
			KEY product_id (product_id)
		) " . $wpdb->get_charset_collate() );
		return $wpdb->get_var( "SHOW TABLES LIKE '{$t}'" ) === $t;
	}

	public static function priezastys() {
		return array(
			'gavimas'          => 'Gavimas',
			'inventorizacija'  => 'Inventorizacija',
			'nurasymas'        => 'Nurašymas',
			'korekcija'        => 'Korekcija',
			'kaina'            => 'Kainos keitimas',
			'isimta'           => 'Išimta iš prekybos',
		);
	}

	/**
	 * Į kurį lauką rašomas AV likutis.
	 * Prekė be tiekėjo laiko likutį `_stock`; prekė su tiekėju — `_own_stock_qty`,
	 * kad savas likutis nesusimaišytų su tiekėjo (S590).
	 */
	/**
	 * v7.2: kuriuos sandelius valdo XML. TIK sie du — visi kiti tiekejai
	 * (Ambrosia, Prins, Quattro, Belacor) likucio automatiskai neatsiuncia,
	 * savininkas ji suzino telefonu ar laiske ir iveda ranka.
	 */
	public static function xml_sandelis( $pid ) {
		$s = strtolower( (string) get_post_meta( $pid, '_ps_sandelis', true ) );
		return in_array( $s, array( 'vf', 'zb' ), true );
	}

	/**
	 * AV likutis ivedamas ranka VISADA — tai musu lentyna, jos niekas
	 * neatsiuncia. Net VF/ZB prekes atveju: jei parsivezei ju prekiu i
	 * Avesos sandeli, tas kiekis yra tavo ir tu ji zinai.
	 */
	public static function likutis_rankinis( $pid ) {
		return true;
	}

	/**
	 * Kur guli AVESOS (AV) likutis.
	 *
	 * v8.0 (savininko patikslinimas): Ambrosia, Prins, Quattro, Belacor yra
	 * ATSKIRI SANDELIAI — dropshipas, tik be XML. Ju likutis NERA musu
	 * likutis. Todel `_stock` tokioms prekems reiskia TIEKEJO likuti, o
	 * Avesos lentynos kiekis gyvena `_own_stock_qty` (S590).
	 * Gryna AV preke (be tiekejo) savo likuti laiko `_stock`.
	 */
	public static function av_laukas( $pid ) {
		$sand = strtolower( (string) get_post_meta( $pid, '_ps_sandelis', true ) );
		if ( $sand === '' || $sand === 'av' ) { return '_stock'; }
		return '_own_stock_qty';
	}

	/** Kur guli TIEKEJO likutis. Tik ten, kur tiekejas apskritai yra. */
	public static function tiekejo_laukas( $pid ) {
		$sand = strtolower( (string) get_post_meta( $pid, '_ps_sandelis', true ) );
		return ( $sand === '' || $sand === 'av' ) ? '' : '_stock';
	}

	/** Ar TIEKEJO likutis ivedamas ranka (t. y. tiekejas neduoda XML). */
	public static function tiekejo_likutis_rankinis( $pid ) {
		$t = self::tiekejo_laukas( $pid );
		return $t !== '' && ! self::xml_sandelis( $pid );
	}

	public static function av_dabar( $pid ) {
		$l = self::av_laukas( $pid );
		$v = get_post_meta( $pid, $l, true );
		return ( $v === '' || $v === null ) ? null : (int) $v;
	}

	/**
	 * Partija: [{id, ivestis}] kur ivestis „12", „+5" arba „-2".
	 * Viskas arba nieko: pirma apskaičiuojam ir patikrinam, tik tada rašom.
	 */
	public static function ajax_av_irasyti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );

		$priez = isset( $_POST['priezastis'] ) ? sanitize_key( $_POST['priezastis'] ) : '';
		if ( ! isset( self::priezastys()[ $priez ] ) ) { wp_send_json_error( 'nenurodyta priežastis' ); }

		$raw = isset( $_POST['pakeitimai'] ) ? wp_unslash( $_POST['pakeitimai'] ) : '';
		$sar = json_decode( $raw, true );
		if ( ! is_array( $sar ) || ! $sar ) { wp_send_json_error( 'nėra ką išsaugoti' ); }
		if ( count( $sar ) > 500 ) { wp_send_json_error( 'per daug eilučių vienu kartu (riba 500)' ); }
		if ( ! self::uztikrinti_zurnala() ) { wp_send_json_error( 'nepavyko paruošti žurnalo' ); }

		/* 1) SKAIČIUOJAM — dar nieko nerašom */
		$planas = array(); $klaidos = array();
		foreach ( $sar as $e ) {
			$pid = isset( $e['id'] ) ? (int) $e['id'] : 0;
			$iv  = isset( $e['ivestis'] ) ? trim( (string) $e['ivestis'] ) : '';
			if ( ! $pid || get_post_type( $pid ) !== 'product' ) { $klaidos[] = array( 'id' => $pid, 'kl' => 'nėra prekės' ); continue; }
			if ( ! preg_match( '/^([+-]?)(\d{1,6})$/', $iv, $m ) ) {
				$klaidos[] = array( 'id' => $pid, 'kl' => 'netinkama reikšmė: ' . $iv ); continue;
			}
			$buvo = self::av_dabar( $pid );
			$sk   = (int) $m[2];
			if ( $m[1] === '+' )      { $tapo = (int) $buvo + $sk; }
			elseif ( $m[1] === '-' )  { $tapo = (int) $buvo - $sk; }
			else                      { $tapo = $sk; }

			$prasyta = $tapo;
			if ( $tapo < 0 ) { $tapo = 0; }   /* neigiamo likučio nebūna */
			$planas[] = array(
				'pid' => $pid, 'laukas' => self::av_laukas( $pid ),
				'buvo' => $buvo, 'tapo' => $tapo, 'prasyta' => $prasyta,
				'pokytis' => $tapo - (int) $buvo,
			);
		}
		if ( ! $planas ) { wp_send_json_error( array( 'zinute' => 'nėra galiojančių eilučių', 'klaidos' => $klaidos ) ); }

		/* 2) RAŠOM */
		global $wpdb;
		$t   = self::zurnalo_lentele();
		$op  = 'AV' . gmdate( 'ymdHis' ) . wp_rand( 10, 99 );
		$now = current_time( 'mysql' );
		$uid = get_current_user_id();
		$ok  = array();

		/* v7.7: GAVIMAS KURIA PARTIJA. Likutis, atsiradęs be partijos, neturi
		   nei galiojimo, nei savikainos — o FEFO nurasymas tokio nemato. */
		$gal_iki = isset( $_POST['geriausia_iki'] ) ? trim( (string) wp_unslash( $_POST['geriausia_iki'] ) ) : '';
		$sav_nauja = isset( $_POST['savikaina'] ) ? trim( (string) wp_unslash( $_POST['savikaina'] ) ) : '';

		foreach ( $planas as &$p ) {
			$pokytis = (int) $p['pokytis'];
			if ( $priez === 'gavimas' && $pokytis > 0 && class_exists( 'Petshop_Partijos' )
				&& self::likutis_rankinis( $p['pid'] ) ) {

				$sav = $sav_nauja;
				if ( $sav === '' || (float) str_replace( ',', '.', $sav ) <= 0 ) {
					$sv = Petshop_Partijos::svertine_savikaina( $p['pid'] );
					if ( $sv === null || (float) $sv <= 0 ) { $sv = (float) get_post_meta( $p['pid'], '_cost_price', true ); }
					$sav = ( (float) $sv > 0 ) ? (string) $sv : '';
				}
				if ( $sav !== '' ) {
					$r = Petshop_Partijos::priimti( $p['pid'], array(
						'kiekis'        => $pokytis,
						'savikaina'     => $sav,
						'valiuta'       => 'EUR',
						'kursas'        => 1,
						'geriausia_iki' => $gal_iki,
						'tiekejas'      => (string) get_post_meta( $p['pid'], '_ps_sandelis', true ),
						'gauta'         => current_time( 'Y-m-d' ),
						'pastaba'       => 'Likučio įvedimas kortelėje',
					) );
					if ( ! is_wp_error( $r ) ) {
						/* `priimti()` jau pakele likuti — tiesiogiai nebesirasom. */
						$p['partija'] = isset( $r['partijos_id'] ) ? (int) $r['partijos_id'] : 0;
						$p['tapo']    = isset( $r['likutis'] ) ? (int) $r['likutis'] : $p['tapo'];
						$p['per_partija'] = true;
					}
				}
			}

			/* v7.8: MAZINIMAS — nurasom is partiju (FEFO), o ne tik is likucio.
			   Kitaip partiju suma ir likutis issiskiria, ir savikaina bei
			   galiojimai pradeda meluoti. */
			if ( $pokytis < 0 && class_exists( 'Petshop_Partijos' ) && self::likutis_rankinis( $p['pid'] ) ) {
				$turi = Petshop_Partijos::partijos( $p['pid'], true );
				if ( $turi ) {
					$r = Petshop_Partijos::nurasyti( $p['pid'], abs( $pokytis ) );
					if ( ! is_wp_error( $r ) ) {
						$p['per_partija'] = true;
						if ( isset( $r['likutis'] ) ) { $p['tapo'] = (int) $r['likutis']; }
					}
				}
			}
		}
		unset( $p );

		foreach ( $planas as $p ) {
			if ( ! empty( $p['per_partija'] ) ) {
				/* Likuti jau pakele partija — nerasom antra karta. */
			} elseif ( $p['laukas'] === '_stock' ) {
				/* Per CRUD — kitaip wc_product_meta_lookup liktų su senu kiekiu
				   ir parduotuvės filtrai rodytų neteisybę (S691). */
				$prod = wc_get_product( $p['pid'] );
				if ( $prod ) {
					$prod->set_manage_stock( true );
					$prod->set_stock_quantity( $p['tapo'] );
					$prod->set_stock_status( $p['tapo'] > 0 ? 'instock' : 'outofstock' );
					$prod->save();
				} else {
					update_post_meta( $p['pid'], '_stock', $p['tapo'] );
					update_post_meta( $p['pid'], '_stock_status', $p['tapo'] > 0 ? 'instock' : 'outofstock' );
				}
			} else {
				/* _own_stock_qty — mūsų laukas, WooCommerce jo nepažįsta */
				update_post_meta( $p['pid'], $p['laukas'], $p['tapo'] );
			}
			$wpdb->insert( $t, array(
				'operacija' => $op, 'product_id' => $p['pid'], 'laukas' => $p['laukas'],
				'buvo' => $p['buvo'] === null ? null : (string) $p['buvo'], 'tapo' => (string) $p['tapo'],
				'pokytis' => $p['pokytis'], 'priezastis' => $priez, 'user_id' => $uid, 'sukurta' => $now,
			) );
			/* v7.7: TAS PATS irasas i `Petshop_Ivykiai` — istorijos skirtukas
			   skaito TIK ji, o `ps_av_zurnalas` lieka atsaukimui. */
			if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
				try { Petshop_Ivykiai::irasyti( $p['pid'], 'likutis', array(
					'laukas'  => 'likutis',
					'buvo'    => $p['buvo'] === null ? '' : (string) $p['buvo'],
					'tapo'    => (string) $p['tapo'],
					'pastaba' => self::priezastys()[ $priez ] . ' · kortelėje'
						. ( ! empty( $p['partija'] ) ? ' · partija #' . (int) $p['partija'] : '' ),
				) ); }
				catch ( Throwable $e ) { /* zurnalas neprivalo blokuoti */ }
			}
			$ok[] = array(
				'id' => $p['pid'], 'buvo' => $p['buvo'], 'tapo' => $p['tapo'],
				'partija' => isset( $p['partija'] ) ? (int) $p['partija'] : 0,
				/* sąžiningumas: jei prašyta −10, o buvo 1, pritaikyta tik −1 */
				'pastaba' => ( $p['prasyta'] !== $p['tapo'] )
					? sprintf( 'prašyta %d, pritaikyta %d (neigiamo likučio nebūna)', $p['prasyta'], $p['tapo'] ) : '',
			);
		}
		delete_transient( 'ps_kat_duomenys' );

		wp_send_json_success( array(
			'operacija' => $op, 'irasyta' => count( $ok ), 'eilutes' => $ok,
			'klaidos' => $klaidos, 'priezastis' => self::priezastys()[ $priez ],
		) );
	}

	/**
	 * Kainų partija. Kaina rašoma į `_regular_price` IR `_price`, kad parduotuvė
	 * pasikeistų iškart. Kartu uždedamas `_manual_price_override=yes`.
	 */

	/**
	 * v8.5: SAVIKAINA greitame redagavime.
	 *
	 * Iki v8.5 sąraše buvo redaguojami tik AV likutis ir kaina, o savikaina —
	 * tik kortelėje, po vieną prekę. Vedant savikainas masiškai tai reiškia
	 * atidaryti ir uždaryti kortelę kiekvienai prekei.
	 *
	 * Taisyklė ta pati kaip kortelėje (`ajax_laukas_irasyti`): jei savikainą
	 * valdo tiekėjas, įrašymas ATMETAMAS. Rašymas į `_cost_price` VF/ZB prekei
	 * nieko nepakeistų — resolveris jo net nepamatytų, o pranešti „išsaugota"
	 * reikštų meluoti.
	 */
	public static function ajax_sav_irasyti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );

		$raw = isset( $_POST['pakeitimai'] ) ? wp_unslash( $_POST['pakeitimai'] ) : '';
		$sar = json_decode( $raw, true );
		if ( ! is_array( $sar ) || ! $sar ) { wp_send_json_error( 'nėra ką išsaugoti' ); }
		if ( count( $sar ) > 300 ) { wp_send_json_error( 'per daug eilučių vienu kartu (riba 300)' ); }
		if ( ! self::uztikrinti_zurnala() ) { wp_send_json_error( 'nepavyko paruošti žurnalo' ); }

		$planas = array(); $klaidos = array();
		foreach ( $sar as $e ) {
			$pid = isset( $e['id'] ) ? (int) $e['id'] : 0;
			$iv  = isset( $e['ivestis'] ) ? str_replace( array( ',', ' ' ), array( '.', '' ), trim( (string) $e['ivestis'] ) ) : '';
			if ( ! $pid || get_post_type( $pid ) !== 'product' ) { $klaidos[] = array( 'id' => $pid, 'kl' => 'nėra prekės' ); continue; }
			/* v8.5: TIK AV sandėlis (savininko sprendimas 2026-08-17).
			   Dropship prekių savikaina ateina iš tiekėjo — Quattro ir Prins
			   per kainoraštį, VF/ZB per XML. Rankinis įrašas ten arba būtų
			   perrašytas per naktį, arba resolverio net nepamatytas. */
			$sand = strtolower( trim( (string) get_post_meta( $pid, '_ps_sandelis', true ) ) );
			if ( $sand !== 'av' ) {
				$klaidos[] = array( 'id' => $pid, 'kl' => 'ne AV sandėlis (' . ( $sand ?: 'nenurodytas' ) . ') — savikaina redaguojama tik AV prekėms' ); continue;
			}
			if ( self::tiekejo_savikaina( $pid ) ) {
				$klaidos[] = array( 'id' => $pid, 'kl' => 'savikainą valdo tiekėjas — įrašyti negalima' ); continue;
			}
			/* Tuščia įvestis = savikainos ištrynimas. Vedant masiškai to reikia:
			   klaidingai įvestas skaičius turi būti pašalinamas, ne paliekamas. */
			if ( $iv === '' ) {
				$buvo = get_post_meta( $pid, '_cost_price', true );
				if ( $buvo === '' || $buvo === null ) { continue; }
				$planas[] = array( 'pid' => $pid, 'buvo' => (float) $buvo, 'tapo' => null );
				continue;
			}
			if ( ! preg_match( '/^([+-]?)(\d{1,6}(?:\.\d{1,4})?)$/', $iv, $m ) ) {
				$klaidos[] = array( 'id' => $pid, 'kl' => 'netinkama savikaina: ' . $iv ); continue;
			}
			$buvo = get_post_meta( $pid, '_cost_price', true );
			$buvo = ( $buvo === '' || $buvo === null ) ? null : (float) $buvo;
			$sk   = (float) $m[2];
			if ( $m[1] === '+' )     { $tapo = (float) $buvo + $sk; }
			elseif ( $m[1] === '-' ) { $tapo = (float) $buvo - $sk; }
			else                     { $tapo = $sk; }
			$tapo = round( $tapo, 4 );
			if ( $tapo <= 0 ) { $klaidos[] = array( 'id' => $pid, 'kl' => 'savikaina turi būti didesnė už nulį' ); continue; }
			if ( $tapo > 9999 ) { $klaidos[] = array( 'id' => $pid, 'kl' => 'savikaina per didelė (riba 9999)' ); continue; }
			$planas[] = array( 'pid' => $pid, 'buvo' => $buvo, 'tapo' => $tapo );
		}
		if ( ! $planas ) { wp_send_json_error( array( 'zinute' => 'nėra galiojančių eilučių', 'klaidos' => $klaidos ) ); }

		global $wpdb;
		$t   = self::zurnalo_lentele();
		$op  = 'SV' . gmdate( 'ymdHis' ) . wp_rand( 10, 99 );
		$now = current_time( 'mysql' );
		$uid = get_current_user_id();
		$ok  = array();

		foreach ( $planas as $p ) {
			$pid = $p['pid'];
			if ( $p['tapo'] === null ) {
				delete_post_meta( $pid, '_cost_price' );
			} else {
				update_post_meta( $pid, '_cost_price', (string) $p['tapo'] );
				update_post_meta( $pid, '_cost_price_source', 'ranka' );
				update_post_meta( $pid, '_cost_price_manual_at', $now );
				update_post_meta( $pid, '_cost_price_manual_by', $uid );
			}
			$wpdb->insert( $t, array(
				'operacija' => $op, 'product_id' => $pid, 'laukas' => '_cost_price',
				'buvo' => $p['buvo'] === null ? null : (string) $p['buvo'],
				'tapo' => $p['tapo'] === null ? null : (string) $p['tapo'],
				'pokytis' => null, 'priezastis' => 'savikaina', 'user_id' => $uid, 'sukurta' => $now,
			) );
			/* Marža grąžinama iškart — kad eilutė persidažytų be perkrovimo. */
			$kaina = get_post_meta( $pid, '_regular_price', true );
			$mz    = ( $p['tapo'] === null ) ? null : self::marza( $kaina === '' ? null : (float) $kaina, $p['tapo'] );
			$ok[]  = array( 'id' => $pid, 'buvo' => $p['buvo'], 'tapo' => $p['tapo'], 'marza' => $mz );
		}
		delete_transient( 'ps_kat_duomenys' );

		wp_send_json_success( array(
			'operacija' => $op, 'irasyta' => count( $ok ),
			'eilutes' => $ok, 'klaidos' => $klaidos, 'priezastis' => 'Savikainos keitimas',
		) );
	}

	public static function ajax_kaina_irasyti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );

		$raw = isset( $_POST['pakeitimai'] ) ? wp_unslash( $_POST['pakeitimai'] ) : '';
		$sar = json_decode( $raw, true );
		if ( ! is_array( $sar ) || ! $sar ) { wp_send_json_error( 'nėra ką išsaugoti' ); }
		if ( count( $sar ) > 300 ) { wp_send_json_error( 'per daug eilučių vienu kartu (riba 300)' ); }
		if ( ! self::uztikrinti_zurnala() ) { wp_send_json_error( 'nepavyko paruošti žurnalo' ); }

		$planas = array(); $klaidos = array();
		foreach ( $sar as $e ) {
			$pid = isset( $e['id'] ) ? (int) $e['id'] : 0;
			$iv  = isset( $e['ivestis'] ) ? str_replace( array( ',', ' ' ), array( '.', '' ), trim( (string) $e['ivestis'] ) ) : '';
			if ( ! $pid || get_post_type( $pid ) !== 'product' ) { $klaidos[] = array( 'id' => $pid, 'kl' => 'nėra prekės' ); continue; }
			if ( ! preg_match( '/^([+-]?)(\d{1,6}(?:\.\d{1,2})?)$/', $iv, $m ) ) {
				$klaidos[] = array( 'id' => $pid, 'kl' => 'netinkama kaina: ' . $iv ); continue;
			}
			$buvo = get_post_meta( $pid, '_regular_price', true );
			$buvo = ( $buvo === '' || $buvo === null ) ? null : (float) $buvo;
			$sk   = (float) $m[2];
			if ( $m[1] === '+' )     { $tapo = (float) $buvo + $sk; }
			elseif ( $m[1] === '-' ) { $tapo = (float) $buvo - $sk; }
			else                     { $tapo = $sk; }
			$tapo = round( $tapo, 2 );
			if ( $tapo <= 0 ) { $klaidos[] = array( 'id' => $pid, 'kl' => 'kaina turi būti didesnė už nulį' ); continue; }
			$planas[] = array( 'pid' => $pid, 'buvo' => $buvo, 'tapo' => $tapo );
		}
		if ( ! $planas ) { wp_send_json_error( array( 'zinute' => 'nėra galiojančių eilučių', 'klaidos' => $klaidos ) ); }

		global $wpdb;
		$t = self::zurnalo_lentele();
		$op  = 'KN' . gmdate( 'ymdHis' ) . wp_rand( 10, 99 );
		$now = current_time( 'mysql' );
		$uid = get_current_user_id();
		$ok  = array();

		foreach ( $planas as $p ) {
			$pid  = $p['pid'];
			$sale = get_post_meta( $pid, '_sale_price', true );
			$buvo_lock = get_post_meta( $pid, '_manual_price_override', true );

			/* Per CRUD — save() atnaujina ir wc_product_meta_lookup (min_price,
			   max_price, onsale), be kurios parduotuvės filtrai rodytų seną kainą. */
			$prod = wc_get_product( $pid );
			if ( $prod ) {
				$prod->set_regular_price( (string) $p['tapo'] );
				/* akcija paliekama kaip yra; _price WooCommerce apskaičiuoja pats */
				$prod->save();
			} else {
				update_post_meta( $pid, '_regular_price', (string) $p['tapo'] );
				$rodoma = ( $sale !== '' && (float) $sale > 0 && (float) $sale < $p['tapo'] ) ? (float) $sale : $p['tapo'];
				update_post_meta( $pid, '_price', (string) $rodoma );
			}

			/* pakeista ranka — vadinasi nebe automatinė */
			if ( $buvo_lock !== 'yes' ) { update_post_meta( $pid, '_manual_price_override', 'yes' ); }

			$wpdb->insert( $t, array(
				'operacija' => $op, 'product_id' => $pid, 'laukas' => '_regular_price',
				'buvo' => $p['buvo'] === null ? null : (string) $p['buvo'], 'tapo' => (string) $p['tapo'],
				'pokytis' => null, 'priezastis' => 'kaina', 'user_id' => $uid, 'sukurta' => $now,
			) );
			if ( $buvo_lock !== 'yes' ) {
				$wpdb->insert( $t, array(
					'operacija' => $op, 'product_id' => $pid, 'laukas' => '_manual_price_override',
					'buvo' => $buvo_lock === '' ? null : (string) $buvo_lock, 'tapo' => 'yes',
					'pokytis' => null, 'priezastis' => 'kaina', 'user_id' => $uid, 'sukurta' => $now,
				) );
			}
			$ok[] = array( 'id' => $pid, 'buvo' => $p['buvo'], 'tapo' => $p['tapo'],
				'uzrakinta' => ( $buvo_lock !== 'yes' ) );
		}
		delete_transient( 'ps_kat_duomenys' );

		$nauji = 0;
		foreach ( $ok as $x ) { if ( $x['uzrakinta'] ) { $nauji++; } }
		wp_send_json_success( array(
			'operacija' => $op, 'irasyta' => count( $ok ), 'uzrakinta' => $nauji,
			'eilutes' => $ok, 'klaidos' => $klaidos, 'priezastis' => 'Kainos keitimas',
		) );
	}

	/**
	 * Prekės būsenos keitimas: juodraštis · prekyba · šiukšlinė · trynimas.
	 * Visi, išskyrus trynimą, grįžtami per žurnalą.
	 */
	/**
	 * v3.5: VIENO LAUKO irasymas is korteles.
	 *
	 * Atskiras nuo `ajax_kaina_irasyti` ir `ajax_av_irasyti`, nes tie dirba su
	 * SARASU eiluciu ir turi savo skaiciavimo taisykles (+5, −2). Cia — viena
	 * preke, vienas laukas, tiesiogine reiksme.
	 *
	 * SAVIKAINA: redaguojama TIK tada, kai jos nevaldo tiekejas. VF/ZB prekems
	 * savikaina ateina is `_vf_cost` / `_zb_cost`, todel irasymas i
	 * `_cost_price` nieko nepakeistu — resolveris jo net nepamatytu. Tyliai
	 * priimti tokia ivesti reikstu meluoti, kad issaugota.
	 *
	 * SKU ir EAN: tikrinamas unikalumas. Dublikatas sulauzytu susiejima su
	 * tiekejo XML ir gali sujungti dvi skirtingas prekes i viena.
	 */
	public static function ajax_laukas_irasyti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );

		$pid    = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		$laukas = isset( $_POST['laukas'] ) ? sanitize_key( wp_unslash( $_POST['laukas'] ) ) : '';
		$iv     = isset( $_POST['reiksme'] ) ? trim( (string) wp_unslash( $_POST['reiksme'] ) ) : '';

		if ( ! $pid || get_post_type( $pid ) !== 'product' ) { wp_send_json_error( 'nėra prekės' ); }

		$leistini = array(
			'_cost_price' => array( 'tipas' => 'pinigai', 'vardas' => 'Savikaina' ),
			'_sale_price' => array( 'tipas' => 'pinigai_tuscia', 'vardas' => 'Akcijinė kaina' ),
			'_sku'        => array( 'tipas' => 'kodas', 'vardas' => 'SKU' ),
			'_ean'        => array( 'tipas' => 'ean', 'vardas' => 'EAN' ),
			'_weight'     => array( 'tipas' => 'pinigai_tuscia', 'vardas' => 'Prekės svoris' ),
			'_ps_tik_kurjeriu' => array( 'tipas' => 'varnele', 'vardas' => 'Tik kurjeriu' ),
		);
		if ( ! isset( $leistini[ $laukas ] ) ) { wp_send_json_error( 'šio lauko keisti negalima' ); }
		$cfg = $leistini[ $laukas ];

		/* --- savikaina: ar jos nevaldo tiekejas --- */
		if ( $laukas === '_cost_price' && self::tiekejo_savikaina( $pid ) ) {
			wp_send_json_error( 'Savikainą valdo tiekėjo importas — rankinis įrašymas neturėtų poveikio' );
		}

		/* --- validacija --- */
		$tapo = $iv;
		if ( $cfg['tipas'] === 'pinigai' || $cfg['tipas'] === 'pinigai_tuscia' ) {
			$tapo = str_replace( array( ',', ' ' ), array( '.', '' ), $iv );
			if ( $tapo === '' ) {
				if ( $cfg['tipas'] === 'pinigai' ) { wp_send_json_error( $cfg['vardas'] . ' negali būti tuščia' ); }
			} elseif ( ! preg_match( '/^\d{1,7}(?:\.\d{1,3})?$/', $tapo ) ) {
				wp_send_json_error( 'netinkamas skaičius: ' . $iv );
			}
		}
		if ( $cfg['tipas'] === 'ean' && $tapo !== '' && ! preg_match( '/^[0-9]{8,14}$/', $tapo ) ) {
			wp_send_json_error( 'EAN turi būti 8–14 skaitmenų' );
		}
		if ( $cfg['tipas'] === 'varnele' ) {
			$tapo = ( $iv === 'yes' || $iv === '1' || $iv === 'true' ) ? 'yes' : '';
		}
		if ( $cfg['tipas'] === 'kodas' && $tapo !== '' && ! preg_match( '/^[A-Za-z0-9._\/-]{1,64}$/', $tapo ) ) {
			wp_send_json_error( 'SKU gali turėti tik raides, skaičius ir . _ / -' );
		}

		/* --- unikalumas --- */
		if ( $tapo !== '' && in_array( $laukas, array( '_sku', '_ean' ), true ) ) {
			global $wpdb;
			$kitas = $wpdb->get_var( $wpdb->prepare(
				"SELECT pm.post_id FROM {$wpdb->postmeta} pm
				  INNER JOIN {$wpdb->posts} p ON p.ID=pm.post_id AND p.post_type='product'
				    AND p.post_status IN ('publish','draft','private')
				  WHERE pm.meta_key=%s AND pm.meta_value=%s AND pm.post_id<>%d LIMIT 1",
				$laukas, $tapo, $pid ) );
			if ( $kitas ) {
				wp_send_json_error( $cfg['vardas'] . ' jau naudojamas prekėje #' . (int) $kitas
					. ' — „' . mb_substr( html_entity_decode( get_the_title( $kitas ) ), 0, 40 ) . '"' );
			}
		}

		$buvo = get_post_meta( $pid, $laukas, true );
		if ( (string) $buvo === (string) $tapo ) {
			wp_send_json_success( array( 'nepakito' => true, 'tapo' => $tapo ) );
		}

		if ( ! self::uztikrinti_zurnala() ) { wp_send_json_error( 'nepavyko paruošti žurnalo' ); }

		/* --- irasymas: per CRUD ten, kur WC turi lookup lentele --- */
		$prod = wc_get_product( $pid );
		if ( $prod && in_array( $laukas, array( '_sku', '_sale_price', '_weight' ), true ) ) {
			try {
				if ( $laukas === '_sku' )        { $prod->set_sku( $tapo ); }
				if ( $laukas === '_sale_price' ) { $prod->set_sale_price( $tapo === '' ? '' : $tapo ); }
				if ( $laukas === '_weight' )     { $prod->set_weight( $tapo === '' ? '' : $tapo ); }
				$prod->save();
			} catch ( Exception $e ) {
				wp_send_json_error( 'WooCommerce atmetė reikšmę: ' . $e->getMessage() );
			}
		} else {
			if ( $tapo === '' ) { delete_post_meta( $pid, $laukas ); }
			else { update_post_meta( $pid, $laukas, $tapo ); }
		}

		global $wpdb;
		$op  = 'LK' . gmdate( 'ymdHis' ) . wp_rand( 10, 99 );
		$wpdb->insert( self::zurnalo_lentele(), array(
			'operacija' => $op, 'product_id' => $pid, 'laukas' => $laukas,
			'buvo' => ( $buvo === '' ? null : (string) $buvo ), 'tapo' => (string) $tapo,
			'pokytis' => null, 'priezastis' => 'kortelė', 'user_id' => get_current_user_id(),
			'sukurta' => current_time( 'mysql' ),
		) );
		delete_transient( 'ps_kat_duomenys' );

		/* --- perskaiciuojam isvestinius rodiklius --- */
		if ( class_exists( 'Petshop_Pilnumas' ) ) { Petshop_Pilnumas::perskaiciuoti( $pid ); }

		$atsakas = array( 'operacija' => $op, 'laukas' => $laukas, 'buvo' => $buvo, 'tapo' => $tapo,
			'vardas' => $cfg['vardas'] );

		/* savikaina pasikeite — grazinam nauja marza, kad kortele ja parodytu */
		if ( $laukas === '_cost_price' ) {
			$kaina = get_post_meta( $pid, '_regular_price', true );
			if ( $kaina !== '' && $tapo !== '' ) {
				$atsakas['marza'] = self::marza( (float) $kaina, (float) $tapo );
				$atsakas['marza_eur'] = self::marza_eur( (float) $kaina, (float) $tapo );
			}
		}
		wp_send_json_success( $atsakas );
	}

	/**
	 * v3.9: APRASYMO IRASYMAS.
	 *
	 * `post_content` yra tai, ka mato pirkejas, todel:
	 *   · pries kiekviena irasyma senasis tekstas issaugomas `_ps_aprasymo_bak`
	 *     (paskutines 5 versijos) — atsaukimas galimas net po kelio zingsniu;
	 *   · rasoma per `wp_update_post`, NE per `wc/v3` — pastarasis aprasymus
	 *     korumpuoja (zinoma taisykle);
	 *   · irasius uzdedamas `_ps_aprasymas_uzrakintas`, kad importas
	 *     nebeperrasytu rankinio darbo.
	 */
	/* ==================== v4.5: ATRIBUTAI IR NUOTRAUKOS ==================== */

	/**
	 * Kokius atributus rodome ir leidžiame keisti — priklauso nuo kategorijos.
	 * Vienas šaltinis ir ekranui, ir įrašymui: kitaip ekranas leistų tai, ko
	 * serveris nepriimtų.
	 */
	public static function atributu_zemelapis( $tipas ) {
		$bendri = array(
			'pa_gyvuno_rusis'   => 'Gyvūno rūšis',
			'pa_pakuotes_dydis' => 'Pakuotės dydis',
		);
		$pagal = array(
			'maistas' => array(
				'pa_baltymu_saltinis' => 'Baltymų šaltinis',
				'pa_amzius'           => 'Amžius',
				'pa_be_grudu'         => 'Grūdai',
				'pa_monoprotein'      => 'Monoprotein',
				'pa_speciali_mityba'  => 'Speciali mityba',
				'pa_veisles_dydis'    => 'Veislės dydis',
			),
			'skanestai' => array(
				'pa_baltymu_saltinis' => 'Baltymų šaltinis',
				'pa_be_grudu'         => 'Grūdai',
			),
			'papildai' => array(
				'pa_paskirtis' => 'Paskirtis',
				'pa_forma'     => 'Forma',
			),
			'aksesuarai' => array(),
		);
		return $bendri + ( isset( $pagal[ $tipas ] ) ? $pagal[ $tipas ] : array() );
	}

	/**
	 * Taksonominis atributas NEIŠSILAIKO be `_product_attributes` registracijos —
	 * terminai priskirti, bet WooCommerce jų nerodo ir filtrai nemato.
	 * Todėl kiekvienas įrašymas: terminai → registracija → transientų valymas.
	 */
	private static function registruoti_atributa( $pid, $tax, $turi_reiksmiu ) {
		$reg = get_post_meta( $pid, '_product_attributes', true );
		if ( ! is_array( $reg ) ) { $reg = array(); }
		if ( $turi_reiksmiu ) {
			$reg[ $tax ] = array(
				'name'         => $tax,
				'value'        => '',
				'position'     => isset( $reg[ $tax ]['position'] ) ? $reg[ $tax ]['position'] : count( $reg ),
				'is_visible'   => 1,
				'is_variation' => 0,
				'is_taxonomy'  => 1,
			);
		} else {
			unset( $reg[ $tax ] );
		}
		update_post_meta( $pid, '_product_attributes', $reg );
		if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }
	}

	/**
	 * Atributo įrašymas. Terminai priskiriami TIK per term_id — pagal vardą
	 * negalima: „1,5 kg" ir „15 kg" duoda tą patį slug'ą „15-kg“.
	 */
	public static function ajax_atributas() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );

		$pid = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		$tax = isset( $_POST['tax'] ) ? sanitize_key( wp_unslash( $_POST['tax'] ) ) : '';
		$ids = isset( $_POST['terminai'] ) ? (array) json_decode( wp_unslash( $_POST['terminai'] ), true ) : array();
		$ids = array_values( array_filter( array_map( 'intval', $ids ) ) );

		if ( ! $pid || get_post_type( $pid ) !== 'product' ) { wp_send_json_error( 'nėra prekės' ); }
		if ( ! taxonomy_exists( $tax ) ) { wp_send_json_error( 'nėra tokio atributo' ); }

		$slugs = wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'slugs' ) );
		$slugs = is_wp_error( $slugs ) ? array() : $slugs;
		$kt    = self::sekciju_lukesciai( $slugs );
		$leist = self::atributu_zemelapis( $kt['tipas'] );
		if ( ! isset( $leist[ $tax ] ) ) {
			wp_send_json_error( 'šios kategorijos prekei šis atributas netaikomas' );
		}

		/* Kiekvienas ID privalo priklausyti BŪTENT šiai taksonomijai. */
		foreach ( $ids as $tid ) {
			$t = get_term( $tid );
			if ( ! $t || is_wp_error( $t ) || $t->taxonomy !== $tax ) {
				wp_send_json_error( 'netinkama reikšmė #' . (int) $tid );
			}
		}

		$buvo_t = wp_get_post_terms( $pid, $tax, array( 'fields' => 'names' ) );
		$buvo_t = is_wp_error( $buvo_t ) ? array() : $buvo_t;

		/* REPLACE, ne append: antras argumentas be `true`. */
		$rez = wp_set_object_terms( $pid, $ids ? $ids : array(), $tax, false );
		if ( is_wp_error( $rez ) ) { wp_send_json_error( $rez->get_error_message() ); }

		self::registruoti_atributa( $pid, $tax, ! empty( $ids ) );
		self::kesas_lauk( $pid );

		$tapo_t = wp_get_post_terms( $pid, $tax, array( 'fields' => 'names' ) );
		$tapo_t = is_wp_error( $tapo_t ) ? array() : $tapo_t;

		if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
			try {
				Petshop_Ivykiai::irasyti( $pid, 'atributas', array(
					'laukas' => $tax,
					'buvo'   => implode( ', ', $buvo_t ),
					'tapo'   => implode( ', ', $tapo_t ),
				) );
			} catch ( Throwable $e ) { /* žurnalas neprivalo blokuoti įrašymo */ }
		}

		wp_send_json_success( array(
			'tapo'      => $tapo_t ? implode( ', ', $tapo_t ) : '—',
			'terminai'  => $ids,
		) );
	}

	/**
	 * Nuotraukų veiksmai: pagrindinė, galerijos papildymas, šalinimas, tvarka.
	 * Failų įkėlimą atlieka WordPress medijos langas; čia tik priskyrimai.
	 */
	public static function ajax_nuotraukos() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );

		$pid  = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		$vks  = isset( $_POST['veiksmas'] ) ? sanitize_key( wp_unslash( $_POST['veiksmas'] ) ) : '';
		$ids  = isset( $_POST['ids'] ) ? (array) json_decode( wp_unslash( $_POST['ids'] ), true ) : array();
		$ids  = array_values( array_filter( array_map( 'intval', $ids ) ) );
		$alt  = isset( $_POST['alt'] ) ? sanitize_text_field( wp_unslash( $_POST['alt'] ) ) : '';

		if ( ! $pid || get_post_type( $pid ) !== 'product' ) { wp_send_json_error( 'nėra prekės' ); }

		foreach ( $ids as $a ) {
			if ( get_post_type( $a ) !== 'attachment' ) { wp_send_json_error( 'netinkamas failas #' . (int) $a ); }
		}

		$gal = get_post_meta( $pid, '_product_image_gallery', true );
		$gal = $gal ? array_values( array_filter( array_map( 'intval', explode( ',', (string) $gal ) ) ) ) : array();
		$tid = (int) get_post_meta( $pid, '_thumbnail_id', true );

		$buvusi_pagrindine = $tid;
		switch ( $vks ) {
			case 'pagrindine':
				if ( ! $ids ) { wp_send_json_error( 'nepasirinkta nuotrauka' ); }
				$nauja = $ids[0];
				/* Jei nauja pagrindinė buvo galerijoje — iš ten pašalinam,
				   kitaip ta pati nuotrauka kartotųsi dukart. */
				$gal = array_values( array_diff( $gal, array( $nauja ) ) );
				/* Senoji pagrindinė nedingsta — keliauja į galerijos pradžią. */
				if ( $tid && $tid !== $nauja && ! in_array( $tid, $gal, true ) ) { array_unshift( $gal, $tid ); }
				set_post_thumbnail( $pid, $nauja );
				update_post_meta( $pid, '_product_image_gallery', implode( ',', $gal ) );
				break;

			case 'pagrindine_salinti':
				delete_post_thumbnail( $pid );
				break;

			case 'galerija_prideti':
				foreach ( $ids as $a ) {
					if ( $a !== $tid && ! in_array( $a, $gal, true ) ) { $gal[] = $a; }
				}
				update_post_meta( $pid, '_product_image_gallery', implode( ',', $gal ) );
				break;

			case 'galerija_salinti':
				$gal = array_values( array_diff( $gal, $ids ) );
				update_post_meta( $pid, '_product_image_gallery', implode( ',', $gal ) );
				break;

			case 'galerija_tvarka':
				/* Priimame tik tuos, kurie jau yra galerijoje — kad naujų
				   nuotraukų nebūtų galima įsprausti pro tvarkymo kelią. */
				$nauja_tvarka = array_values( array_intersect( $ids, $gal ) );
				foreach ( $gal as $g ) { if ( ! in_array( $g, $nauja_tvarka, true ) ) { $nauja_tvarka[] = $g; } }
				$gal = $nauja_tvarka;
				update_post_meta( $pid, '_product_image_gallery', implode( ',', $gal ) );
				break;

			case 'alt':
				if ( ! $ids ) { wp_send_json_error( 'nepasirinkta nuotrauka' ); }
				update_post_meta( $ids[0], '_wp_attachment_image_alt', $alt );
				break;

			default:
				wp_send_json_error( 'nežinomas veiksmas' );
		}

		if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }
		self::kesas_lauk( $pid );

		if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
			try { Petshop_Ivykiai::irasyti( $pid, 'nuotraukos', array(
				'laukas' => $vks,
				'buvo'   => (string) $buvusi_pagrindine,
				'tapo'   => implode( ',', $ids ) ) ); }
			catch ( Throwable $e ) { /* žurnalas neprivalo blokuoti */ }
		}

		/* v4.7: buvusios pagrindinės ID grąžinamas, kad veiksmą būtų galima
		   ATŠAUKTI vienu paspaudimu. Iki šiol nuotrauka pasikeisdavo iškart ir
		   be jokio kelio atgal — kaip ir atsitiko prekei #34500. */
		wp_send_json_success( array( 'perkrauti' => true, 'buvusi' => (int) $buvusi_pagrindine ) );
	}

	/**
	 * v4.6: pavadinimo keitimas. Slug (`post_name`) SĄMONINGAI neliečiamas:
	 * jis jau indeksuotas, o keitimas reikštų 301 grandinę ir prarastą srautą.
	 */
	/**
	 * v5.5: partijos lauko redagavimas.
	 *
	 * Leidziami TIK trys laukai: likutis, savikaina ir „geriausia iki".
	 * Gavimo data, tiekejas ir gautas kiekis nekeiciami — tai siuntos faktai,
	 * kurie turi sutapti su saskaita; ju taisymas reikstu, kad apskaita ir
	 * dokumentas isvaziuoja.
	 */
	/**
	 * v7.3: nauja partija kortelėje.
	 *
	 * Naudojamas `Petshop_Partijos::priimti()` — tas pats kelias, kaip Gavime.
	 * Antro partiju kurimo kelio nedarome: partija kelia likuti ir
	 * perskaiciuoja svertine savikaina, ir sitos dvi operacijos privalo likti
	 * vienoje vietoje.
	 */
	/**
	 * v7.5: vienos prekes dabartiniai skaiciai sarasui.
	 *
	 * Imami is TO PACIO saltinio, kaip ir sarasas (`surinkti()`), tik vienai
	 * prekei — kitaip sarasas ir kortele vel isskirtu i dvi tiesas.
	 */
	/**
	 * v8.0: TIEKEJO likutis (Ambrosia, Prins, Quattro, Belacor).
	 *
	 * Atskiras nuo AV samoningai: tai kiekis, gulintis PAS TIEKEJA. Partiju,
	 * galiojimu ir savikainos cia nera — ju mes nezinom ir nevaldom.
	 */
	/**
	 * v8.3: busenos perjungimas.
	 *
	 * Naudojamas `wp_update_post` — tas pats kelias, kaip WooCommerce lange,
	 * todel `Petshop_Rankos` vartai suveikia savaime: zmogaus atliktas
	 * isemimas pazymimas, o grazinimas zyme nuima.
	 */
	public static function ajax_busena() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );

		$pid = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		if ( ! $pid || get_post_type( $pid ) !== 'product' ) { wp_send_json_error( 'nėra prekės' ); }

		$buvo = get_post_status( $pid );
		$tapo = ( $buvo === 'publish' ) ? 'draft' : 'publish';

		$r = wp_update_post( array( 'ID' => $pid, 'post_status' => $tapo ), true );
		if ( is_wp_error( $r ) ) { wp_send_json_error( $r->get_error_message() ); }

		/* Ar tikrai pasikeite: `Petshop_Rankos` vartai gali sustabdyti
		   grazinima, jei preke isimta ranka — ir tai teisinga elgsena. */
		clean_post_cache( $pid );
		$dabar = get_post_status( $pid );

		if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
			try { Petshop_Ivykiai::irasyti( $pid, 'busena', array(
				'laukas' => 'būsena', 'buvo' => $buvo, 'tapo' => $dabar,
				'pastaba' => 'Pakeista kortelėje' ) ); }
			catch ( Throwable $e ) { /* zurnalas neprivalo blokuoti */ }
		}
		self::kesas_lauk( $pid );
		if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }

		wp_send_json_success( array(
			'busena'    => $dabar,
			'prekyboje' => ( $dabar === 'publish' ),
			'pavyko'    => ( $dabar === $tapo ),
			'ranka'     => ( class_exists( 'Petshop_Rankos' ) && Petshop_Rankos::isimta( $pid ) ),
		) );
	}

	public static function ajax_tiekejo_likutis() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );

		$pid = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		if ( ! $pid || get_post_type( $pid ) !== 'product' ) { wp_send_json_error( 'nėra prekės' ); }
		if ( ! self::tiekejo_likutis_rankinis( $pid ) ) {
			wp_send_json_error( 'šio tiekėjo likutį valdo XML — ranka nekeičiamas' );
		}

		$iv = isset( $_POST['ivestis'] ) ? trim( (string) wp_unslash( $_POST['ivestis'] ) ) : '';
		$iv = str_replace( "\xE2\x88\x92", '-', $iv );
		if ( ! preg_match( '/^([+-]?)(\d{1,6})$/', $iv, $m ) ) { wp_send_json_error( 'įrašyk 12, +3 arba −2' ); }

		$laukas = self::tiekejo_laukas( $pid );
		$buvo   = get_post_meta( $pid, $laukas, true );
		$buvo_i = ( $buvo === '' || $buvo === null ) ? 0 : (int) $buvo;
		$sk     = (int) $m[2];
		if ( $m[1] === '+' )     { $tapo = $buvo_i + $sk; }
		elseif ( $m[1] === '-' ) { $tapo = $buvo_i - $sk; }
		else                     { $tapo = $sk; }
		if ( $tapo < 0 ) { $tapo = 0; }

		/* Per CRUD — kad `wc_product_meta_lookup` ir vitrina pasikeistu kartu. */
		$prod = wc_get_product( $pid );
		if ( $prod ) {
			$prod->set_manage_stock( true );
			$prod->set_stock_quantity( $tapo );
			$prod->set_stock_status( $tapo > 0 ? 'instock' : 'outofstock' );
			$prod->save();
		} else {
			update_post_meta( $pid, $laukas, $tapo );
		}

		if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
			try { Petshop_Ivykiai::irasyti( $pid, 'likutis', array(
				'laukas'  => 'tiekėjo likutis',
				'buvo'    => (string) $buvo_i,
				'tapo'    => (string) $tapo,
				'pastaba' => strtoupper( (string) get_post_meta( $pid, '_ps_sandelis', true ) ) . ' · įvesta ranka kortelėje',
			) ); }
			catch ( Throwable $e ) { /* zurnalas neprivalo blokuoti */ }
		}
		self::kesas_lauk( $pid );
		if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }

		wp_send_json_success( array( 'id' => $pid, 'buvo' => $buvo_i, 'tapo' => $tapo ) );
	}

	public static function ajax_eilute() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );
		$pid = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		if ( ! $pid || get_post_type( $pid ) !== 'product' ) { wp_send_json_error( 'nėra prekės' ); }

		/* Kesas valomas PRIES skaitant — kitaip eilute gautu dar sena
		   momentine kopija ir rodytu kita skaiciu nei kortele. */
		delete_transient( 'ps_kat_duomenys' );
		$visi = self::surinkti();
		$r = null;
		foreach ( $visi['prekes'] as $x ) {
			if ( (int) $x['id'] === $pid ) { $r = $x; break; }
		}
		if ( ! $r ) { wp_send_json_error( 'prekė sąraše nerasta' ); }

		/* v8.1: eilute piesiama TUO PACIU generatoriumi, kaip visas sarasas.
		   Anksciau JS atnaujindavo stulpelius po viena, ir kiekvienas naujas
		   stulpelis reiskdavo dar viena vieta, kuria galima pamirsti. */
		$f = array(
			'view' => isset( $_POST['view'] ) ? sanitize_key( wp_unslash( $_POST['view'] ) ) : '',
		);
		ob_start();
		self::lentele( array( $r ), 'n', 'asc', $f );
		$h = ob_get_clean();

		$eilute = '';
		if ( preg_match( '~<tr data-id="' . $pid . '">.*?</tr>~s', $h, $m ) ) { $eilute = $m[0]; }

		wp_send_json_success( array(
			'id'     => $pid,
			'eilute' => $eilute,
			/* Atskirai — kortelės antrastei ir statusams. */
			'av'     => $r['av'],
			'tiek'   => $r['tiek'],
			'pard'   => (int) $r['pard'],
			'busena' => get_post_status( $pid ),
		) );
	}

	/**
	 * v8.0: TIEKEJO likutis (Ambrosia, Prins, Quattro, Belacor).
	 *
	 * Atskiras nuo AV samoningai: tai kiekis, gulintis PAS TIEKEJA. Partiju,
	 * galiojimu ir savikainos cia nera — ju mes nezinom ir nevaldom.
	 */
	/** v5.3: parduotuvės paleidimo datos įrašymas. */
	public static function ajax_paleidimas() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );
		$d = isset( $_POST['data'] ) ? sanitize_text_field( wp_unslash( $_POST['data'] ) ) : '';
		if ( $d === '' ) { delete_option( 'ps_paleidimo_data' ); wp_send_json_success( array( 'isvalyta' => true ) ); }
		if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $d ) || ! strtotime( $d ) ) {
			wp_send_json_error( 'netinkama data' );
		}
		update_option( 'ps_paleidimo_data', $d, 'no' );
		wp_send_json_success( array( 'data' => $d ) );
	}

	public static function ajax_pavadinimas() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );

		$pid  = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		$tekstas = isset( $_POST['tekstas'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['tekstas'] ) ) ) : '';

		if ( ! $pid || get_post_type( $pid ) !== 'product' ) { wp_send_json_error( 'nėra prekės' ); }
		if ( $tekstas === '' ) { wp_send_json_error( 'pavadinimas negali būti tuščias' ); }
		if ( mb_strlen( $tekstas ) > 200 ) { wp_send_json_error( 'pavadinimas per ilgas (daugiau nei 200 simbolių)' ); }

		$buvo = get_the_title( $pid );
		if ( html_entity_decode( $buvo ) === $tekstas ) {
			wp_send_json_success( array( 'nepakito' => true, 'tapo' => $buvo ) );
		}

		$rez = wp_update_post( array( 'ID' => $pid, 'post_title' => $tekstas ), true );
		if ( is_wp_error( $rez ) ) { wp_send_json_error( $rez->get_error_message() ); }

		if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }
		self::kesas_lauk( $pid );

		if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
			try { Petshop_Ivykiai::irasyti( $pid, 'pavadinimas', array(
				'laukas' => 'post_title', 'buvo' => $buvo, 'tapo' => $tekstas ) ); }
			catch ( Throwable $e ) { /* žurnalas neprivalo blokuoti */ }
		}

		wp_send_json_success( array( 'tapo' => $tekstas ) );
	}

	/**
	 * v6.4: trumpas aprasymas — irasymas ir grazinimas.
	 *
	 * Mechanika ta pati, kaip pagrindinio aprasymo: pries kiekviena irasyma
	 * senasis tekstas keliauja i `_ps_trumpo_bak` (5 paskutines versijos), po
	 * irasymo uzdedamas `_ps_trumpas_uzrakintas`, kad tiekejo importas
	 * ranka rasyto teksto nebeperrasytu.
	 */
	private static function trumpas_aprasymas( $pid, $veiksmas, $po ) {
		$senas = (string) $po->post_excerpt;

		if ( $veiksmas === 'trumpas_atsaukti' ) {
			$bak = get_post_meta( $pid, '_ps_trumpo_bak', true );
			if ( ! is_array( $bak ) || ! $bak ) { wp_send_json_error( 'Ankstesnės versijos nėra' ); }
			$paskutine = array_pop( $bak );
			wp_update_post( array( 'ID' => $pid, 'post_excerpt' => $paskutine['tekstas'] ) );
			update_post_meta( $pid, '_ps_trumpo_bak', $bak );
			if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }
			self::kesas_lauk( $pid );
			wp_send_json_success( array( 'grazinta' => true, 'data' => $paskutine['laikas'],
				'tekstas' => $paskutine['tekstas'], 'liko_versiju' => count( $bak ) ) );
		}

		$tekstas = isset( $_POST['tekstas'] ) ? wp_unslash( $_POST['tekstas'] ) : '';
		$rezimas = isset( $_POST['rezimas'] ) ? sanitize_key( wp_unslash( $_POST['rezimas'] ) ) : 'tekstas';

		/* v6.5: TEKSTINIS REZIMAS. Zmogus rase sakinius — zymes uzdedam mes.
		   Tuscios eilutes praleidziamos, kad neatsirastu tusciu `<p></p>`. */
		if ( $rezimas === 'tekstas' ) {
			$eil = preg_split( '~\R~u', wp_strip_all_tags( $tekstas ) );
			$p   = array();
			foreach ( (array) $eil as $e ) {
				$e = trim( (string) $e );
				if ( $e !== '' ) { $p[] = '<p>' . esc_html( $e ) . '</p>'; }
			}
			$tekstas = implode( "\n", $p );
		} else {
			/* HTML rezimas: leidziam zymes, bet inline stilius ir tuscius
			   `<span>` apvalkalus ismetam — jie tik trukdo redaguoti. */
			$tekstas = self::valyti_html( wp_kses_post( $tekstas ) );
		}
		$tekstas = str_replace( array( '&nbsp;', "\xC2\xA0" ), ' ', $tekstas );
		$tekstas = preg_replace( '~[ \t]{2,}~', ' ', $tekstas );

		if ( trim( $tekstas ) === trim( $senas ) ) { wp_send_json_success( array( 'nepakito' => true ) ); }

		$bak = get_post_meta( $pid, '_ps_trumpo_bak', true );
		if ( ! is_array( $bak ) ) { $bak = array(); }
		$bak[] = array( 'tekstas' => $senas, 'laikas' => current_time( 'mysql' ) );
		if ( count( $bak ) > 5 ) { $bak = array_slice( $bak, -5 ); }
		update_post_meta( $pid, '_ps_trumpo_bak', $bak );

		$r = wp_update_post( array( 'ID' => $pid, 'post_excerpt' => $tekstas ), true );
		if ( is_wp_error( $r ) ) { wp_send_json_error( $r->get_error_message() ); }

		update_post_meta( $pid, '_ps_trumpas_uzrakintas', 'yes' );
		if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }
		self::kesas_lauk( $pid );
		if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
			try { Petshop_Ivykiai::irasyti( $pid, 'duomenys', array(
				'laukas'  => 'trumpas aprašymas',
				'sena'    => mb_strlen( wp_strip_all_tags( $senas ) ) . ' simb.',
				'nauja'   => mb_strlen( wp_strip_all_tags( $tekstas ) ) . ' simb.',
				'pastaba' => 'Trumpas aprašymas pakeistas kortelėje',
			) ); }
			catch ( Throwable $e ) { /* zurnalas neprivalo blokuoti */ }
		}
		delete_transient( 'ps_kat_duomenys' );

		wp_send_json_success( array(
			'ilgis'    => mb_strlen( wp_strip_all_tags( $tekstas ) ),
			'versiju'  => count( $bak ),
			'nuvalyta' => max( 0, mb_strlen( $senas ) - mb_strlen( $tekstas ) ),
			'tekstas'  => $tekstas,
			'plokscias'=> trim( wp_strip_all_tags( str_replace( array( '</p>', '<br>', '<br/>', '<br />' ), "\n", $tekstas ) ) ),
		) );
	}

	public static function ajax_aprasymas() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );

		$pid = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		if ( ! $pid || get_post_type( $pid ) !== 'product' ) { wp_send_json_error( 'nėra prekės' ); }

		$veiksmas = isset( $_POST['veiksmas'] ) ? sanitize_key( wp_unslash( $_POST['veiksmas'] ) ) : 'irasyti';
		$po = get_post( $pid );
		$senas = (string) $po->post_content;

		/* v6.4: TRUMPAS APRASYMAS (`post_excerpt`). Atskira saka, nes tai kitas
		   laukas su savo istorija ir savo uzraktu — sumaisius juos, „Grazinti
		   ankstesne" grazintu ne ta teksta. */
		if ( $veiksmas === 'trumpas' || $veiksmas === 'trumpas_atsaukti' ) {
			self::trumpas_aprasymas( $pid, $veiksmas, $po );
		}

		/* --- ATSAUKIMAS --- */
		if ( $veiksmas === 'atsaukti' ) {
			$bak = get_post_meta( $pid, '_ps_aprasymo_bak', true );
			if ( ! is_array( $bak ) || ! $bak ) { wp_send_json_error( 'Ankstesnės versijos nėra' ); }
			$paskutine = array_pop( $bak );
			wp_update_post( array( 'ID' => $pid, 'post_content' => $paskutine['tekstas'] ) );
			update_post_meta( $pid, '_ps_aprasymo_bak', $bak );
			wp_send_json_success( array( 'grazinta' => true, 'data' => $paskutine['laikas'],
				'liko_versiju' => count( $bak ) ) );
		}

		/* --- v7.0: SUDELIOJIMAS I LENTYNELES ---
		   Tas pats variklis, kuris dirba Gavime naujoms prekems. Ten jis buvo
		   nuo pat pradziu, o esamoms 1 875 prekems su duomenu skolomis —
		   nepasiekiamas. Tekstas imamas IS LAUKO (ne is bazes): zmogus ka tik
		   ikliajavo gamintojo teksta ir dar nespaude „Irasyti". */
		if ( $veiksmas === 'sudelioti' ) {
			if ( ! class_exists( 'Petshop_Gavimas' ) ) { wp_send_json_error( 'Gavimo modulis neįdiegtas' ); }
			$tekstas = isset( $_POST['tekstas'] ) ? (string) wp_unslash( $_POST['tekstas'] ) : '';
			if ( trim( wp_strip_all_tags( $tekstas ) ) === '' ) { $tekstas = $senas; }
			if ( trim( wp_strip_all_tags( $tekstas ) ) === '' ) { wp_send_json_error( 'Nėra teksto, kurį būtų galima sudėlioti' ); }

			$slugs = wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'slugs' ) );
			$luk   = self::sekciju_lukesciai( is_wp_error( $slugs ) ? array() : $slugs );
			$laukiamos = array_keys( $luk['sekcijos'] );

			/* HTML → tekstas: skaidytojui reikia antrasciu eiluciu pradzioje. */
			$pl = preg_replace( '~<\s*(style|script)\b[^>]*>.*?<\s*/\s*\1\s*>~is', ' ', $tekstas );
			$pl = preg_replace( '~<\s*(br|/p|/div|/h[1-6]|/li|/tr)\s*/?>~i', "\n", $pl );
			$pl = preg_replace( '~<\s*(h[1-6]|p|div|li|tr)\b[^>]*>~i', "\n", $pl );
			$pl = html_entity_decode( wp_strip_all_tags( $pl ), ENT_QUOTES, 'UTF-8' );

			$sk_info = null;
			$rasta = Petshop_Gavimas::skaidyti( $pl, $laukiamos, $sk_info );
			$sek = array();
			foreach ( $laukiamos as $a ) { if ( ! empty( $rasta[ $a ] ) ) { $sek[ $a ] = $rasta[ $a ]; } }
			foreach ( $rasta as $a => $v ) { if ( ! isset( $sek[ $a ] ) && trim( (string) $v ) !== '' ) { $sek[ $a ] = $v; } }
			if ( ! $sek ) {
				wp_send_json_error( 'Tekste antraščių atpažinti nepavyko. Patikrink, ar yra „Sudėtis:", „Analitinės sudedamosios dalys:" ir panašiai.' );
			}
			$naujas_html = Petshop_Gavimas::sekcijos_html( $sek );

			self::aprasymo_kopija( $pid, $senas );
			wp_update_post( array( 'ID' => $pid, 'post_content' => $naujas_html ) );
			update_post_meta( $pid, '_ps_aprasymas_uzrakintas', 'yes' );
			if ( class_exists( 'Petshop_Pilnumas' ) ) { Petshop_Pilnumas::perskaiciuoti( $pid ); }
			delete_transient( 'ps_kat_duomenys' );
			wp_send_json_success( array(
				'sudelieta' => true,
				'sekcijos'  => array_keys( $sek ),
				'tekstas'   => $naujas_html,
				'perkelta'  => is_array( $sk_info ) ? (int) $sk_info['perkelta'] : 0,
			) );
		}

		/* --- ANTRASCIU KARKASAS --- */
		if ( $veiksmas === 'karkasas' ) {
			$slugs = wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'slugs' ) );
			$luk   = self::sekciju_lukesciai( is_wp_error( $slugs ) ? array() : $slugs );
			$turimos = class_exists( 'Petshop_Desc_Parser' ) || function_exists( 'psdp_split' )
				? self::sekciju_antrastes( $senas ) : array();

			$prideti = array();
			foreach ( array_keys( $luk['sekcijos'] ) as $vardas ) {
				$rasta = false;
				foreach ( $turimos as $t ) {
					if ( mb_strpos( self::be_diakritiku( $t ), self::be_diakritiku( mb_substr( $vardas, 0, 5 ) ) ) !== false ) { $rasta = true; break; }
				}
				if ( ! $rasta ) { $prideti[] = $vardas; }
			}
			if ( ! $prideti ) { wp_send_json_success( array( 'nieko' => true, 'zinute' => 'Visos reikalingos antraštės jau yra' ) ); }

			/* Esamas tekstas NEIŠTRINAMAS — jis lieka po „Aprašymas:", o
			   trukstamos antrastes pridedamos tuscios, kad butu ka pildyti. */
			$naujas = '';
			$pirma = array_key_first( $luk['sekcijos'] );
			foreach ( array_keys( $luk['sekcijos'] ) as $vardas ) {
				$naujas .= $vardas . ':' . "\n";
				if ( $vardas === $pirma && trim( wp_strip_all_tags( $senas ) ) !== '' ) {
					$naujas .= trim( wp_strip_all_tags( $senas ) ) . "\n";
				}
				$naujas .= "\n";
			}
			self::aprasymo_kopija( $pid, $senas );
			wp_update_post( array( 'ID' => $pid, 'post_content' => $naujas ) );
			update_post_meta( $pid, '_ps_aprasymas_uzrakintas', 'yes' );
			wp_send_json_success( array( 'karkasas' => true, 'pridetos' => $prideti, 'tekstas' => $naujas ) );
		}

		/* --- VALYMAS: DRY (parodyti) arba APPLY --- */
		if ( $veiksmas === 'valyti_dry' ) {
			$svarus = self::valyti_html( $senas );
			wp_send_json_success( array(
				'buvo_simb'   => mb_strlen( $senas ),
				'tapo_simb'   => mb_strlen( $svarus ),
				'sankla_proc' => self::sanklos_dalis( $senas ),
				'lenteliu'    => substr_count( strtolower( $senas ), '<table' ),
				'lenteliu_po' => substr_count( strtolower( $svarus ), '<table' ),
				'tekstas'     => $svarus,
			) );
		}
		if ( $veiksmas === 'valyti' ) {
			$svarus = self::valyti_html( $senas );
			if ( trim( wp_strip_all_tags( $svarus ) ) === '' ) {
				wp_send_json_error( 'Po valymo neliktų teksto — nekeičiu' );
			}
			/* Apsauga: lenteles NEGALI dingti. Jei ju sumazejo — sustojam. */
			if ( substr_count( strtolower( $svarus ), '<table' ) < substr_count( strtolower( $senas ), '<table' ) ) {
				wp_send_json_error( 'Valymas prarastų lentelę — nekeičiu' );
			}
			self::aprasymo_kopija( $pid, $senas );
			wp_update_post( array( 'ID' => $pid, 'post_content' => $svarus ) );
			update_post_meta( $pid, '_ps_aprasymas_uzrakintas', 'yes' );
			wp_send_json_success( array( 'isvalyta' => true,
				'buvo' => mb_strlen( $senas ), 'tapo' => mb_strlen( $svarus ), 'tekstas' => $svarus ) );
		}

		/* --- IRASYMAS --- */
		$tekstas = isset( $_POST['tekstas'] ) ? wp_unslash( $_POST['tekstas'] ) : '';
		$tekstas = wp_kses_post( $tekstas );
		if ( trim( wp_strip_all_tags( $tekstas ) ) === trim( wp_strip_all_tags( $senas ) ) ) {
			wp_send_json_success( array( 'nepakito' => true ) );
		}

		self::aprasymo_kopija( $pid, $senas );
		$r = wp_update_post( array( 'ID' => $pid, 'post_content' => $tekstas ), true );
		if ( is_wp_error( $r ) ) { wp_send_json_error( $r->get_error_message() ); }

		update_post_meta( $pid, '_ps_aprasymas_uzrakintas', 'yes' );
		if ( class_exists( 'Petshop_Pilnumas' ) ) { Petshop_Pilnumas::perskaiciuoti( $pid ); }
		if ( class_exists( 'Petshop_Ivykiai' ) ) {
			Petshop_Ivykiai::irasyti( $pid, 'duomenys', array(
				'laukas' => 'aprašymas',
				'sena'   => mb_strlen( wp_strip_all_tags( $senas ) ) . ' simb.',
				'nauja'  => mb_strlen( wp_strip_all_tags( $tekstas ) ) . ' simb.',
				'pastaba'=> 'Aprašymas pakeistas kortelėje',
			) );
		}
		delete_transient( 'ps_kat_duomenys' );

		$bak = get_post_meta( $pid, '_ps_aprasymo_bak', true );
		wp_send_json_success( array(
			'ilgis'    => mb_strlen( wp_strip_all_tags( $tekstas ) ),
			'versiju'  => is_array( $bak ) ? count( $bak ) : 0,
			'sekcijos' => count( self::sekciju_antrastes( $tekstas ) ),
		) );
	}

	/**
	 * v4.0: HTML VALYMAS.
	 *
	 * Tiekeju aprasymuose iki 40 % teksto yra sanksla: `style="color:black
	 * !important"` prie kiekvieno elemento, pasikartojantys `<style>` blokai,
	 * `b2b-black` / `b2b-tight` apvalkalai, `<meta charset>` viduryje turinio.
	 * Redaguoti toki teksta reiskia redaguoti koda, ne teksta.
	 *
	 * KAS LIEKA: tekstas, pastraipos, sarasai, paryskinimai IR LENTELES —
	 * analitines sudedamosios dalys bei serimo normos yra lenteles, ir jas
	 * naikinti reikstu prarasti duomenis.
	 *
	 * KAS SALINAMA: visi `style` atributai, `<style>` blokai, `<meta>`,
	 * `class` su b2b-*, tusti div'ai, `<font>`, komentarai.
	 */
	public static function valyti_html( $html ) {
		$t = (string) $html;

		/* 1. <style> ir <script> blokai su turiniu */
		$t = preg_replace( '#<style\b[^>]*>.*?</style>#is', '', $t );
		$t = preg_replace( '#<script\b[^>]*>.*?</script>#is', '', $t );
		/* 2. <meta>, <link>, komentarai */
		$t = preg_replace( '#<(meta|link)\b[^>]*>#i', '', $t );
		$t = preg_replace( '#<!--.*?-->#s', '', $t );
		/* 3. style ir class atributai — LENTELIU RIBOS islaikomos per CSS,
		      todel ju praradimas turinio nekeicia. */
		$t = preg_replace( '#\s+style\s*=\s*("[^"]*"|\x27[^\x27]*\x27)#i', '', $t );
		$t = preg_replace( '#\s+class\s*=\s*("[^"]*"|\x27[^\x27]*\x27)#i', '', $t );
		$t = preg_replace( '#\s+(cellspacing|cellpadding|border|width|height|align|valign|bgcolor)\s*=\s*("[^"]*"|\x27[^\x27]*\x27|\d+)#i', '', $t );
		/* 4. <font> ir <span> be atributu — apvalkalai be prasmes */
		$t = preg_replace( '#</?font\b[^>]*>#i', '', $t );
		$t = preg_replace( '#<span\s*>(.*?)</span>#is', '$1', $t );
		/* 5. tusti div'ai: kartojama, nes jie ideti vienas i kita */
		for ( $i = 0; $i < 6; $i++ ) {
			$pries = $t;
			$t = preg_replace( '#<div\s*>\s*(.*?)\s*</div>#is', '$1', $t );
			if ( $t === $pries ) { break; }
		}
		/* 6. tuscios pastraipos ir daugybiniai tarpai */
		$t = preg_replace( '#<p\s*>\s*</p>#i', '', $t );
		$t = preg_replace( '#(\s*<br\s*/?>\s*){3,}#i', '<br><br>', $t );
		$t = preg_replace( '#[ \t]{2,}#', ' ', $t );
		$t = preg_replace( '#(\r?\n){3,}#', "\n\n", $t );

		return trim( $t );
	}

	/** Kiek procentu teksto sudaro sankla — kad matytusi, ar verta valyti. */
	public static function sanklos_dalis( $html ) {
		$viso = mb_strlen( (string) $html );
		if ( $viso === 0 ) { return 0; }
		$svarus = mb_strlen( self::valyti_html( $html ) );
		return (int) round( ( $viso - $svarus ) * 100 / $viso );
	}

	/** Issaugo iki 5 ankstesniu versiju. */
	private static function aprasymo_kopija( $pid, $tekstas ) {
		$bak = get_post_meta( $pid, '_ps_aprasymo_bak', true );
		if ( ! is_array( $bak ) ) { $bak = array(); }
		$bak[] = array( 'tekstas' => $tekstas, 'laikas' => current_time( 'mysql' ),
			'user' => get_current_user_id() );
		if ( count( $bak ) > 5 ) { $bak = array_slice( $bak, -5 ); }
		update_post_meta( $pid, '_ps_aprasymo_bak', $bak );
	}

	/** Antrasciu sarasas is teksto — per ta pati varikli, kaip prekes puslapis. */
	private static function sekciju_antrastes( $tekstas ) {
		if ( ! function_exists( 'psdp_split' ) ) { return array(); }
		$s = psdp_split( (string) $tekstas );
		$out = array();
		foreach ( (array) $s as $x ) {
			if ( isset( $x['antraste'] ) && $x['antraste'] !== '' ) { $out[] = $x['antraste']; }
		}
		return $out;
	}

	/** Ar savikaina ateina is tiekejo (VF/ZB), t.y. rankinis irasymas beprasmis. */
	public static function tiekejo_savikaina( $pid ) {
		foreach ( array( '_vf_cost', '_zb_cost' ) as $k ) {
			$v = get_post_meta( $pid, $k, true );
			if ( $v !== '' && (float) $v > 0 ) { return true; }
		}
		return false;
	}

	public static function ajax_isimti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );
		$pid = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		$veiksmas = isset( $_POST['veiksmas'] ) ? sanitize_key( $_POST['veiksmas'] ) : 'trash';
		if ( ! $pid || get_post_type( $pid ) !== 'product' ) { wp_send_json_error( 'nėra prekės' ); }

		/* Ar prekė dalyvauja užsakymuose — pasakom, bet nedraudžiam */
		global $wpdb;
		$oi = $wpdb->prefix . 'woocommerce_order_items';
		$om = $wpdb->prefix . 'woocommerce_order_itemmeta';
		$uzs = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(DISTINCT i.order_id) FROM {$om} m
			 INNER JOIN {$oi} i ON i.order_item_id = m.order_item_id
			 WHERE m.meta_key IN ('_product_id','_variation_id') AND m.meta_value = %s", (string) $pid ) );

		if ( ! self::uztikrinti_zurnala() ) { wp_send_json_error( 'nepavyko paruošti žurnalo' ); }

		$buvo = get_post_status( $pid );
		$pav  = html_entity_decode( get_the_title( $pid ) );

		/* NEGRĮŽTAMAS veiksmas — reikalauja atskiro patvirtinimo su prekės ID */
		if ( $veiksmas === 'delete' ) {
			$patv = isset( $_POST['patvirtinimas'] ) ? (int) $_POST['patvirtinimas'] : 0;
			if ( $patv !== $pid ) { wp_send_json_error( 'trynimui reikia įrašyti prekės numerį' ); }
			/* Pilna kopija PRIEŠ trynimą — kad liktų bent pėdsakas */
			$kopija = array( 'post' => get_post( $pid, ARRAY_A ), 'meta' => get_post_meta( $pid ) );
			$wpdb->insert( self::zurnalo_lentele(), array(
				'operacija' => 'DEL' . gmdate( 'ymdHis' ) . wp_rand( 10, 99 ),
				'product_id' => $pid, 'laukas' => 'IŠTRINTA', 'buvo' => $buvo, 'tapo' => 'deleted',
				'pokytis' => null, 'priezastis' => 'istrinta', 'user_id' => get_current_user_id(),
				'sukurta' => current_time( 'mysql' ),
			) );
			$bt = $wpdb->prefix . 'ps_istrintos_prekes_s668';
			if ( $wpdb->get_var( "SHOW TABLES LIKE '{$bt}'" ) === $bt ) {
				$wpdb->replace( $bt, array( 'id' => $pid, 'duomenys' => wp_json_encode( $kopija ),
					'istrinta' => current_time( 'mysql' ) ) );
			}
			$r = wp_delete_post( $pid, true );
			delete_transient( 'ps_kat_duomenys' );
			if ( ! $r ) { wp_send_json_error( 'nepavyko ištrinti' ); }
			wp_send_json_success( array( 'id' => $pid, 'pav' => $pav, 'veiksmas' => 'delete',
				'negrizta' => true, 'zinute' => 'Prekė ištrinta negrįžtamai' ) );
		}

		$zinutes = array(
			'draft'   => 'Prekė perkelta į juodraščius',
			'publish' => 'Prekė grąžinta į prekybą',
			'trash'   => 'Prekė perkelta į šiukšlinę',
		);
		if ( ! isset( $zinutes[ $veiksmas ] ) ) { wp_send_json_error( 'nežinomas veiksmas' ); }
		if ( $buvo === $veiksmas ) { wp_send_json_error( 'prekė jau tokios būsenos' ); }

		if ( $veiksmas === 'trash' ) {
			$r = wp_trash_post( $pid );
		} else {
			if ( $buvo === 'trash' ) { wp_untrash_post( $pid ); }
			$r = wp_update_post( array( 'ID' => $pid, 'post_status' => $veiksmas ), true );
			if ( is_wp_error( $r ) ) { $r = false; }
		}
		if ( ! $r ) { wp_send_json_error( 'nepavyko pakeisti būsenos' ); }

		$op = 'IS' . gmdate( 'ymdHis' ) . wp_rand( 10, 99 );
		$wpdb->insert( self::zurnalo_lentele(), array(
			'operacija' => $op, 'product_id' => $pid, 'laukas' => 'post_status',
			'buvo' => $buvo, 'tapo' => $veiksmas, 'pokytis' => null,
			'priezastis' => 'isimta', 'user_id' => get_current_user_id(),
			'sukurta' => current_time( 'mysql' ),
		) );
		delete_transient( 'ps_kat_duomenys' );

		wp_send_json_success( array(
			'operacija' => $op, 'id' => $pid, 'pav' => $pav, 'veiksmas' => $veiksmas,
			'uzsakymuose' => $uzs, 'zinute' => $zinutes[ $veiksmas ],
		) );
	}

	/** Masiniai veiksmai su būsena. Trynimo čia NĖRA sąmoningai. */
	public static function masiniai_veiksmai() {
		return array(
			'draft'   => 'Perkelti į juodraščius',
			'publish' => 'Publikuoti (į prekybą)',
			'trash'   => 'Perkelti į šiukšlinę',
		);
	}

	/**
	 * Du režimai: `perziura` — tik parodo, ką darytų; `vykdyti` — atlieka.
	 * Peržiūra privaloma, sąsaja be jos vykdyti neleidžia.
	 */
	public static function ajax_masinis() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );

		$veiksmas = isset( $_POST['veiksmas'] ) ? sanitize_key( $_POST['veiksmas'] ) : '';
		$rezimas  = isset( $_POST['rezimas'] ) ? sanitize_key( $_POST['rezimas'] ) : 'perziura';
		if ( ! isset( self::masiniai_veiksmai()[ $veiksmas ] ) ) { wp_send_json_error( 'nežinomas veiksmas' ); }

		$raw = isset( $_POST['ids'] ) ? wp_unslash( $_POST['ids'] ) : '';
		$ids = array_values( array_unique( array_filter( array_map( 'intval', (array) json_decode( $raw, true ) ) ) ) );
		if ( ! $ids ) { wp_send_json_error( 'nepažymėta nė viena prekė' ); }
		if ( count( $ids ) > 300 ) { wp_send_json_error( 'per daug vienu kartu (riba 300)' ); }

		global $wpdb;
		$oi = $wpdb->prefix . 'woocommerce_order_items';
		$om = $wpdb->prefix . 'woocommerce_order_itemmeta';

		$vykdyti = array(); $praleisti = array(); $ispejimai = array();
		foreach ( $ids as $pid ) {
			if ( get_post_type( $pid ) !== 'product' ) {
				$praleisti[] = array( 'id' => $pid, 'kodel' => 'nėra prekės' ); continue;
			}
			$buvo = get_post_status( $pid );
			if ( $buvo === $veiksmas ) {
				$praleisti[] = array( 'id' => $pid, 'pav' => mb_substr( html_entity_decode( get_the_title( $pid ) ), 0, 44 ),
					'kodel' => 'jau tokios būsenos' ); continue;
			}
			$e = array(
				'id'   => $pid,
				'pav'  => mb_substr( html_entity_decode( get_the_title( $pid ) ), 0, 52 ),
				'buvo' => $buvo,
				'sand' => (string) get_post_meta( $pid, '_ps_sandelis', true ),
			);
			/* Kas verta dėmesio PRIEŠ vykdant */
			if ( $veiksmas !== 'publish' ) {
				$lik = (int) get_post_meta( $pid, '_stock', true );
				if ( $lik > 0 ) { $e['demesio'] = 'likutis ' . $lik; $ispejimai[] = $pid; }
				$uzs = (int) $wpdb->get_var( $wpdb->prepare(
					"SELECT COUNT(DISTINCT i.order_id) FROM {$om} m
					 INNER JOIN {$oi} i ON i.order_item_id = m.order_item_id
					 WHERE m.meta_key IN ('_product_id','_variation_id') AND m.meta_value = %s", (string) $pid ) );
				if ( $uzs > 0 ) {
					$e['demesio'] = trim( ( isset( $e['demesio'] ) ? $e['demesio'] . ' · ' : '' ) . $uzs . ' užsakym.' );
					$ispejimai[] = $pid;
				}
			}
			$vykdyti[] = $e;
		}

		if ( $rezimas === 'perziura' ) {
			wp_send_json_success( array(
				'rezimas' => 'perziura', 'veiksmas' => $veiksmas,
				'pavadinimas' => self::masiniai_veiksmai()[ $veiksmas ],
				'vykdyti' => $vykdyti, 'praleisti' => $praleisti,
				'ispejimu' => count( array_unique( $ispejimai ) ),
			) );
		}

		if ( ! $vykdyti ) { wp_send_json_error( 'nėra ką vykdyti' ); }
		if ( ! self::uztikrinti_zurnala() ) { wp_send_json_error( 'nepavyko paruošti žurnalo' ); }

		$op  = 'MS' . gmdate( 'ymdHis' ) . wp_rand( 10, 99 );
		$now = current_time( 'mysql' );
		$uid = get_current_user_id();
		$ok = 0; $nepavyko = array();

		foreach ( $vykdyti as $e ) {
			$pid = $e['id'];
			if ( $veiksmas === 'trash' ) {
				$r = wp_trash_post( $pid );
			} else {
				if ( $e['buvo'] === 'trash' ) { wp_untrash_post( $pid ); }
				$r = wp_update_post( array( 'ID' => $pid, 'post_status' => $veiksmas ), true );
				if ( is_wp_error( $r ) ) { $r = false; }
			}
			if ( ! $r ) { $nepavyko[] = $pid; continue; }
			$wpdb->insert( self::zurnalo_lentele(), array(
				'operacija' => $op, 'product_id' => $pid, 'laukas' => 'post_status',
				'buvo' => $e['buvo'], 'tapo' => $veiksmas, 'pokytis' => null,
				'priezastis' => 'isimta', 'user_id' => $uid, 'sukurta' => $now,
			) );
			$ok++;
		}
		delete_transient( 'ps_kat_duomenys' );

		wp_send_json_success( array(
			'rezimas' => 'vykdyta', 'operacija' => $op, 'atlikta' => $ok,
			'nepavyko' => $nepavyko, 'praleista' => count( $praleisti ),
			'pavadinimas' => self::masiniai_veiksmai()[ $veiksmas ],
		) );
	}

	/** Visos operacijos atšaukimas — grąžina buvusias reikšmes. */
	public static function ajax_atsaukti() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );
		$op = isset( $_POST['operacija'] ) ? sanitize_text_field( wp_unslash( $_POST['operacija'] ) ) : '';
		if ( $op === '' ) { wp_send_json_error( 'nenurodyta operacija' ); }

		global $wpdb; $t = self::zurnalo_lentele();
		$eil = $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM {$t} WHERE operacija=%s AND atsaukta=0 ORDER BY id DESC", $op ), ARRAY_A );
		if ( ! $eil ) { wp_send_json_error( 'operacija nerasta arba jau atšaukta' ); }

		$n = 0;
		foreach ( $eil as $r ) {
			$pid = (int) $r['product_id'];
			if ( $r['laukas'] === 'post_status' ) {
				wp_untrash_post( $pid );
				wp_update_post( array( 'ID' => $pid, 'post_status' => $r['buvo'] ) );
				$wpdb->update( $t, array( 'atsaukta' => 1 ), array( 'id' => (int) $r['id'] ) );
				$n++;
				continue;
			}
			$prod = ( in_array( $r['laukas'], array( '_regular_price', '_stock' ), true ) ) ? wc_get_product( $pid ) : null;

			if ( $r['laukas'] === '_regular_price' && $prod ) {
				$prod->set_regular_price( $r['buvo'] === null ? '' : (string) $r['buvo'] );
				$prod->save();
			} elseif ( $r['laukas'] === '_stock' && $prod ) {
				if ( $r['buvo'] === null || $r['buvo'] === '' ) {
					$prod->set_manage_stock( false );
				} else {
					$prod->set_manage_stock( true );
					$prod->set_stock_quantity( (int) $r['buvo'] );
					$prod->set_stock_status( (int) $r['buvo'] > 0 ? 'instock' : 'outofstock' );
				}
				$prod->save();
			} elseif ( $r['buvo'] === null || $r['buvo'] === '' ) {
				delete_post_meta( $pid, $r['laukas'] );
			} else {
				update_post_meta( $pid, $r['laukas'], (string) $r['buvo'] );
			}
			$wpdb->update( $t, array( 'atsaukta' => 1 ), array( 'id' => (int) $r['id'] ) );
			$n++;
		}
		delete_transient( 'ps_kat_duomenys' );
		wp_send_json_success( array( 'atsaukta' => $n, 'operacija' => $op ) );
	}

	/** Vienos prekės kortelė. Duomenys imami GYVAI, ne iš sąrašo kešo. */
	public static function ajax_kortele() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );
		$pid = isset( $_GET['id'] ) ? (int) $_GET['id'] : 0;
		if ( ! $pid || get_post_type( $pid ) !== 'product' ) { wp_send_json_error( 'nėra prekės', 404 ); }
		ob_start();
		self::kortele( $pid );
		wp_send_json_success( array( 'html' => ob_get_clean() ) );
	}

	/** Kortelės turinys. */
	public static function kortele( $pid ) {
		$m = array();
		foreach ( get_post_meta( $pid ) as $k => $v ) { $m[ $k ] = is_array( $v ) ? reset( $v ) : $v; }
		$mv = function ( $k ) use ( $m ) { return isset( $m[ $k ] ) && $m[ $k ] !== '' ? $m[ $k ] : null; };

		$saltiniai = ( class_exists( 'Petshop_Sources' ) && method_exists( 'Petshop_Sources', 'saltiniai' ) )
			? Petshop_Sources::saltiniai( $pid ) : array( 'saltiniai' => array(), 'is_lenteles' => false );
		$stock = class_exists( 'Petshop_Stock_Service' )
			? Petshop_Stock_Service::parduodama( $pid ) : array( 'qty' => 0, 'kodel' => '—', 'saltiniai' => array(), 'perspejimai' => array() );

		$kats  = wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'names' ) );
		$kats  = is_wp_error( $kats ) ? array() : $kats;
		$slugs = wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'slugs' ) );
		$slugs = is_wp_error( $slugs ) ? array() : $slugs;

		$kaina = $mv( '_regular_price' ); $kaina = $kaina === null ? null : (float) $kaina;
		$cost  = null;
		foreach ( $saltiniai['saltiniai'] as $s ) { if ( $s['cost_net'] !== null ) { $cost = $s['cost_net']; } }
		/* v5.8: ta pati atsargine tvarka kaip sarase — tiekejo kaina yra
		   savikaina, todel `_vf_cost`/`_zb_cost` skaitomi ir tada, kai prekes
		   saltiniu registre dar nera. */
		if ( $cost === null ) {
			foreach ( array( '_cost_price', '_vf_cost', '_zb_cost' ) as $ck ) {
				$cv = $mv( $ck );
				if ( $cv !== null && (float) $cv > 0 ) { $cost = (float) $cv; break; }
			}
		}
		$marza = self::marza( $kaina, $cost );
		$grind = self::grindys_prekei( $slugs );

		$siul = null;
		if ( $cost !== null && $cost > 0 && class_exists( 'Petshop_Pricing' ) ) {
			try { $pp = new Petshop_Pricing(); $siul = $pp->preview_price( (float) $cost, $slugs ); }
			catch ( Throwable $e ) { $siul = null; }
		}

		$eur = function ( $v ) { return $v === null ? '—' : number_format( (float) $v, 2, ',', ' ' ) . ' €'; };
		$tid = (int) $mv( '_thumbnail_id' );
		$img = $tid ? wp_get_attachment_image_url( $tid, 'medium' ) : '';

		$r = array(
			'foto' => $tid > 0, 'apras' => trim( wp_strip_all_tags( get_post( $pid )->post_content ) ) !== ''
				|| $mv( 'petshop_desc_aprasymas' ) !== null,
			'ean' => (string) ( $mv( '_vf_barcode' ) ?: ( $mv( '_zb_ean' ) ?: ( $mv( '_ean' ) ?: '' ) ) ),
			'price' => $kaina, 'cost' => $cost, 'kat' => $kats,
			'br' => '', 'sand' => (string) $mv( '_ps_sandelis' ),
			'nesalt' => $mv( '_ps_be_saltinio' ) === '1',
		);
		$br = wp_get_post_terms( $pid, 'pa_brendas', array( 'fields' => 'names' ) );
		if ( ! is_wp_error( $br ) && $br ) { $r['br'] = $br[0]; }
		/* v2.9: balas is variklio (S723), kad kortele ir sarasas rodytu TA PATI. */
		$r['pbalas']  = ( $mv( '_ps_pilnumas' ) !== '' ) ? (int) $mv( '_ps_pilnumas' ) : null;
		$r['ptrukst'] = (string) $mv( '_ps_pilnumas_truksta' );
		$p = self::pilnumas( $r );

		echo '<div class="kort-head">';
		if ( $img ) { echo '<img class="kort-img" src="' . esc_url( $img ) . '" alt="">'; }
		else { echo '<div class="kort-img nera">◻</div>'; }
		echo '<div class="kort-pav"><h2 class="kort-pav-t">' . esc_html( html_entity_decode( get_the_title( $pid ) ) ) . '</h2>'
			. '<button type="button" class="kort-pav-keisti" title="Keisti pavadinimą">✎</button>';
		/* v4.6: pavadinimas redaguojamas VIETOJE. Nuoroda (slug) NEKEIČIAMA —
		   ji jau indeksuota, o jos keitimas reikštų 301 ir prarastą srautą. */
		echo '<div class="kort-pav-red" data-id="' . (int) $pid . '" hidden>'
			. '<textarea class="kort-pav-in" rows="2">' . esc_textarea( html_entity_decode( get_the_title( $pid ) ) ) . '</textarea>'
			. '<div class="kort-pav-myg"><button type="button" class="kort-pav-irasyti">Įrašyti</button>'
			. '<button type="button" class="kort-pav-atsisakyti">Atsisakyti</button>'
			. '<span class="kort-pav-stat"></span></div>'
			. '<div class="kort-uzuomina">Nuoroda (slug) nesikeičia — ji jau indeksuota paieškos sistemose.</div>'
			. '</div>';
		/* v8.3: BUSENOS JUOSTA. Pirmas dalykas, kuri zmogus turi matyti — ar
		   preke apskritai parduodama. */
		$bus = get_post_status( $pid );
		$prekyboje = ( $bus === 'publish' );
		$ranka = ( class_exists( 'Petshop_Rankos' ) && Petshop_Rankos::isimta( $pid ) );
		echo '<div class="kort-busena ' . ( $prekyboje ? 'yra' : 'ne' ) . '" data-id="' . (int) $pid . '">'
			. '<span class="kb-taskas"></span>'
			. '<b class="kb-tekstas">' . ( $prekyboje ? 'Prekyboje' : 'Juodraštyje' ) . '</b>'
			. '<span class="kb-paaisk">' . ( $prekyboje ? 'pirkėjas mato' : 'pirkėjas nemato' ) . '</span>'
			. ( $ranka ? '<span class="kb-ranka" title="Išimta žmogaus — automatika negrąžins">🔒 išimta ranka</span>' : '' )
			. '<button type="button" class="kb-keisti">'
			. ( $prekyboje ? 'Išimti iš prekybos' : 'Grąžinti į prekybą' ) . '</button>'
			. '<span class="kb-stat"></span></div>';

		echo '<div class="kort-sub">#' . (int) $pid . ' · ' . esc_html( (string) $mv( '_sku' ) )
			. ( $r['ean'] !== '' ? ' · ' . esc_html( $r['ean'] ) : '' )
			. ( $r['br'] !== '' ? ' · ' . esc_html( $r['br'] ) : '' ) . '</div>';
		/* v6.7: rankinis sprendimas matomas kortelėje. */
		if ( class_exists( 'Petshop_Rankos' ) && Petshop_Rankos::isimta( $pid ) ) {
			$rk = Petshop_Rankos::kas_kada( $pid );
			echo '<div class="kort-ranka">🔒 <b>Išimta iš prekybos ranka</b>'
				. ( ! empty( $rk['kada'] ) ? ' · ' . esc_html( mb_substr( $rk['kada'], 0, 16 ) ) : '' )
				. ( ! empty( $rk['kas'] ) ? ' · ' . esc_html( $rk['kas'] ) : '' )
				. '<span>Importai ir naktiniai darbai jos nebepublikuos, kol pats negrąžinsi į prekybą.</span></div>';
		}
		echo '<div class="kort-nuor">';
		if ( get_post_status( $pid ) === 'publish' ) {
			echo '<a target="_blank" href="' . esc_url( get_permalink( $pid ) ) . '">Parduotuvėje ↗</a>';
		}
		echo '<a target="_blank" href="' . esc_url( admin_url( 'post.php?post=' . $pid . '&action=edit' ) ) . '">WooCommerce ↗</a>';
		/* v6.2: naujos prekes kurimas nuo sios korteles. Perimama TIK
		   klasifikacija — sudetis ir kodai lieka naujai prekei. */
		if ( class_exists( 'Petshop_Gavimas' ) ) {
			echo '<a href="' . esc_url( admin_url( 'admin.php?page=ps-gavimas&kopija=' . $pid ) ) . '"'
				. ' title="Sukurti identišką kopiją: pavadinimas, kategorijos, brendas, atributai, aprašymas,'
				. ' nuotrauka ir galerija. Tušti lieka tik SKU, EAN ir kaina.">Kopijuoti į naują ↗</a>';
		}
		echo '</div></div></div>';

		/* SKIRTUKAI */
		echo '<div class="kort-tabs">'
			. '<button class="on" data-t="apz">Apžvalga</button>'
			. '<button data-t="apr">Aprašymai</button>'
			. '<button data-t="fot">Nuotraukos</button>'
			. '<button data-t="prd">Pardavimai</button>'
			. '<button data-t="ist">Istorija</button>'
			. ( class_exists( 'Petshop_Partijos' ) ? '<button data-t="pak">GPAIS pakuotė</button>' : '' )
			. '</div>';

		/* ---------- v2.9: PARDAVIMAI IR PILNUMAS VIRSUJE ----------
		   Atsidaręs kortelę per dvi sekundes turi žinoti, ar tai flagmanas,
		   ar negyva atsarga — visi kiti sprendimai daromi tame kontekste. */
		/* v3.4: blokai surenkami i buferius ir isvedami DVIEM KOLONOM.
		   Buferiai naudojami todel, kad nereiktu perkelineti simtu eiluciu
		   kodo — logika lieka vietoje, keiciasi tik isdestymas. */
		ob_start();
		self::kort_greitis( $pid, $p );

		/* v3.0: kur preke dalyvauja, broliai su €/kg, matomumas (S725).
		   Keisti kaina ar isimti is prekybos nematant "ji yra trijuose
		   rinkiniuose" — avarija, laukianti savo dienos. */
		if ( class_exists( 'Petshop_Rysiai' ) ) { self::kort_rysiai( $pid ); }
		$B_desine = ob_get_clean();

		/* ---------- APŽVALGA ---------- */
		echo '<div class="kort-pane on" data-p="apz">';
		ob_start();

		/* v3.1: senasis "Prekės pilnumas" blokas PASALINTAS — nuo v2.9 ta pati
		   informacija rodoma virsuje ("Duomenų pilnumas" su juosta ir trukstamu
		   sarasu). Vizualinė patikra parode DU blokus su tuo paciu 60 %.
		   Jei atsargine saka veikia (modulio nera), virsutinis blokas vis tiek
		   rodo $p, todel informacija nedingsta. */

		/* ŠALTINIAI */
		echo '<div class="kort-blokas"><div class="kort-antr">Šaltiniai'
			. '<span class="kort-p ' . ( $saltiniai['is_lenteles'] ? 'ok' : 'warn' ) . '">'
			. ( $saltiniai['is_lenteles'] ? 'iš registro' : 'iš laukų' ) . '</span></div>';
		if ( ! $saltiniai['saltiniai'] ) { echo '<div class="tuscia">Prekė be šaltinio</div>'; }
		else {
			echo '<table class="kort-t"><tr><th>Šaltinis</th><th>Kodas</th><th class="n">Likutis</th><th class="n">Savikaina</th><th>Duomenys</th></tr>';
			foreach ( $saltiniai['saltiniai'] as $s ) {
				$sena = $s['source'] !== 'av' && in_array( $s['source'], array( 'vf','zb' ), true ) && self::pasenes( $s['synced_at'] );
				echo '<tr><td><span class="sand s_' . esc_attr( $s['source'] ) . '">' . esc_html( strtoupper( $s['source'] ) ) . '</span>'
					. ( empty( $s['is_active'] ) ? ' <span class="z bad">išjungtas</span>' : '' ) . '</td>';
				echo '<td class="mono sml">' . esc_html( $s['supplier_sku'] ?: '—' ) . '</td>';
				echo '<td class="n">' . ( $s['stock_qty'] === null ? '<span class="nezinoma">nežinoma</span>' : (int) $s['stock_qty'] ) . '</td>';
				echo '<td class="n">' . $eur( $s['cost_net'] ) . '</td>';
				echo '<td class="sml' . ( $sena ? ' seni' : '' ) . '">' . esc_html( $s['synced_at'] ? mb_substr( $s['synced_at'], 0, 16 ) : 'rankiniai' ) . '</td></tr>';
			}
			echo '</table>';
		}
		echo '<div class="kort-eil"><span>Parduodama pirkėjui</span><b class="' . ( $stock['qty'] > 0 ? '' : 'nula' ) . '">'
			. (int) $stock['qty'] . ' vnt.</b></div>';
		echo '<div class="kort-kodel">' . esc_html( $stock['kodel'] ) . '</div>';
		if ( ! empty( $stock['perspejimai'] ) ) {
			echo '<div class="persp">' . esc_html( implode( ' · ', $stock['perspejimai'] ) ) . '</div>';
		}
		echo '</div>';

		/* ==================== v7.0: LIKUTIS ====================
		   Iki siol AV likuti buvo galima pakeisti TIK sarašo „Greitame
		   redagavime". Zmogus, atsidares prekes kortele, likucio matyti
		   galejo, o pakeisti — ne. Cia naudojamas TAS PATS `ps_kat_av`
		   endpoint\'as: du keliai i ta pati lauka anksciau ar veliau
		   issiskirtu, ir vienas ju liktu be zurnalo. */
		$sand_z   = strtoupper( (string) get_post_meta( $pid, '_ps_sandelis', true ) );
		$tiek_l   = self::tiekejo_laukas( $pid );
		$tiek_rank= self::tiekejo_likutis_rankinis( $pid );
		$av_kiek  = (int) self::av_dabar( $pid );
		$tiek_kiek= $tiek_l !== '' ? get_post_meta( $pid, $tiek_l, true ) : '';

		echo '<div class="kort-blokas kort-lik" data-id="' . (int) $pid . '">';
		echo '<div class="kort-antr">Likučiai</div>';

		/* ---- TIEKEJO LIKUTIS ---- */
		if ( $tiek_l !== '' ) {
			echo '<div class="kort-lik-eil">';
			echo '<div class="kort-eil"><span><b>' . esc_html( $sand_z ) . '</b> — tiekėjo sandėlyje'
				. '<span class="kort-p ' . ( $tiek_rank ? '' : 'warn' ) . '">'
				. ( $tiek_rank ? 'įvedamas ranka' : 'iš XML' ) . '</span></span>'
				. '<b class="kort-tiek-dabar">' . ( $tiek_kiek === '' ? '—' : (int) $tiek_kiek ) . ' vnt.</b></div>';
			if ( $tiek_rank ) {
				echo '<div class="kort-lik-red">'
					. '<input type="text" class="kort-tiek-in" placeholder="12 arba +3 arba −2" autocomplete="off">'
					. '<button type="button" class="kort-tiek-irasyti">Įrašyti tiekėjo likutį</button>'
					. '<span class="kort-tiek-stat"></span></div>';
				echo '<div class="kort-info-m">' . esc_html( $sand_z ) . ' likučio XML neatsiunčia, todėl jį sužinai iš tiekėjo ir įvedi čia. '
					. 'Galiojimo šioje eilutėje nėra — prekė guli pas tiekėją, jos partijų mes nevaldome.</div>';
			} else {
				echo '<div class="kort-persp-x">Likutį atsiunčia <b>' . esc_html( $sand_z ) . '</b> XML — ranka nekeičiamas.</div>';
			}
			echo '</div>';
		}

		/* ---- AV LIKUTIS ---- */
		echo '<div class="kort-lik-eil kort-lik-av">';
		echo '<div class="kort-eil"><span><b>AV</b> — Avesos sandėlyje'
			. '<span class="kort-spyna" data-p="Rašoma į ' . esc_attr( self::av_laukas( $pid ) ) . '">🔒</span></span>'
			. '<b class="kort-lik-dabar">' . $av_kiek . ' vnt.</b></div>';
		$sav_dab = class_exists( 'Petshop_Partijos' ) ? Petshop_Partijos::svertine_savikaina( $pid ) : null;
		if ( $sav_dab === null ) { $sav_dab = get_post_meta( $pid, '_cost_price', true ); }
		echo '<div class="kort-lik-red">'
			. '<input type="text" class="kort-lik-in" placeholder="12 arba +3 arba −2" autocomplete="off">'
			. '<select class="kort-lik-priez">';
		foreach ( self::priezastys() as $k => $v ) {
			if ( in_array( $k, array( 'kaina', 'isimta' ), true ) ) { continue; }
			echo '<option value="' . esc_attr( $k ) . '">' . esc_html( $v ) . '</option>';
		}
		echo '</select><button type="button" class="kort-lik-irasyti">Įrašyti</button>'
			. '<span class="kort-lik-stat"></span></div>';
		echo '<div class="kort-lik-gav">'
			. '<label>Geriausia iki<input type="text" class="kort-lik-gal ps-data" placeholder="2027-09-30"></label>'
			. '<label>Savikaina, € (be PVM)<input type="text" class="kort-lik-sav" placeholder="0,00" value="'
			. ( (float) $sav_dab > 0 ? esc_attr( number_format( (float) $sav_dab, 2, '.', '' ) ) : '' ) . '"></label>'
			. '<span class="kort-lik-uz">Sukuriama partija — kiekis su savo galiojimu ir savikaina.</span>'
			. '</div>';
		echo '<div class="kort-info-m">Tai <b>tavo lentyna</b>: kiek šios prekės parsivežei į Avesą. '
			. 'Pasirinkus <b>Gavimą</b>, kiekis įrašomas kaip partija su galiojimu ir savikaina; '
			. 'kitos priežastys tik tikslina skaičių. Partijos ir galiojimai priklauso tik AV.</div>';
		echo '</div>';

		/* Partijos — tik ten, kur jos apskritai yra (AV). */
		if ( class_exists( 'Petshop_Partijos' ) ) {
			$part = Petshop_Partijos::partijos( $pid, true );
			if ( $part ) {
				echo '<table class="kort-t"><tr><th>Gauta</th><th class="n">Liko</th>'
					. '<th class="n">Savikaina</th><th>Geriausia iki</th><th>Tiekėjas</th></tr>';
				foreach ( $part as $b ) {
					echo '<tr><td>' . esc_html( mb_substr( (string) $b['gauta'], 0, 10 ) ) . '</td>'
						. '<td class="n"><b>' . (int) $b['kiekis_liko'] . '</b></td>'
						. '<td class="n">' . number_format( (float) $b['savikaina_eur'], 2, ',', '' ) . ' €</td>'
						. '<td>' . esc_html( $b['geriausia_iki'] ? mb_substr( (string) $b['geriausia_iki'], 0, 10 ) : '—' ) . '</td>'
						. '<td class="sml2">' . esc_html( mb_substr( (string) $b['tiekejas'], 0, 22 ) ) . '</td></tr>';
				}
				echo '</table>';
				echo '<div class="kort-info-m">Partijas kuria Gavimo langas. Čia jos rodomos, kad matytum, '
					. 'kuri dar guli lentynoje ir kiek ji kainavo.</div>';
			}
		}
		echo '</div>';

		/* ==================== v7.0: KATEGORIJOS ====================
		   Kategorija lemia ne tik vieta kataloge: is jos skaiciuojami sekciju
		   lukesciai ir atributu zemelapis. Todel jos keitimas per WooCommerce
		   langa buvo skaudziausias — grizes matydavai kitokia kortele. */
		$dab_kat = wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'all' ) );
		$dab_kat = is_wp_error( $dab_kat ) ? array() : $dab_kat;
		$visos_kat = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );
		if ( is_wp_error( $visos_kat ) ) { $visos_kat = array(); }
		$vardai = array(); $tevas = array();
		foreach ( $visos_kat as $t ) { $vardai[ $t->term_id ] = $t->name; $tevas[ $t->term_id ] = (int) $t->parent; }
		$kelias = function ( $id ) use ( &$kelias, $vardai, $tevas ) {
			$v = isset( $vardai[ $id ] ) ? $vardai[ $id ] : '#' . $id;
			return ( ! empty( $tevas[ $id ] ) ) ? $kelias( $tevas[ $id ] ) . ' › ' . $v : $v;
		};
		echo '<div class="kort-blokas kort-kat" data-id="' . (int) $pid . '">';
		echo '<div class="kort-antr">Kategorijos<span class="kort-p ' . ( $dab_kat ? 'ok' : 'warn' ) . '">'
			. ( $dab_kat ? count( $dab_kat ) : 'nėra' ) . '</span></div>';
		echo '<div class="kort-kat-rodo">';
		if ( $dab_kat ) {
			foreach ( $dab_kat as $t ) { echo '<span class="kort-kat-z">' . esc_html( $kelias( $t->term_id ) ) . '</span>'; }
		} else {
			echo '<span class="kort-kat-nera">Prekė nepriskirta jokiai kategorijai — pirkėjas jos kataloge neras.</span>';
		}
		echo '</div>';
		echo '<div class="kort-kat-veiksmai"><button type="button" class="kort-kat-keisti">Keisti kategorijas</button>'
			. '<span class="kort-kat-stat"></span></div>';
		echo '<div class="kort-kat-lauk" hidden>'
			. '<input type="search" class="kort-kat-q" placeholder="rašyk: skanėstai, sausas maistas…" autocomplete="off">'
			. '<div class="kort-kat-sar"></div>'
			. '<div class="kort-kat-myg"><button type="button" class="kort-kat-irasyti">Įrašyti</button>'
			. '<button type="button" class="kort-kat-atsisakyti">Atsisakyti</button></div></div>';
		echo '<script type="application/json" class="kort-kat-duom">'
			. wp_json_encode( array(
				'visos' => array_map( function ( $t ) use ( $kelias ) {
					return array( 'id' => (int) $t->term_id, 'v' => $kelias( $t->term_id ), 'n' => (int) $t->count );
				}, $visos_kat ),
				'turi'  => array_map( 'intval', wp_list_pluck( $dab_kat, 'term_id' ) ),
			) ) . '</script>';
		echo '</div>';

		$B_saltiniai = ob_get_clean();

		/* v3.6: PARTIJOS — tik AV prekems. Dropship prekes partiju neturi,
		   ju savikaina ateina is tiekejo XML. */
		/* KAINA */
		ob_start();
		echo '<div class="kort-blokas"><div class="kort-antr">Kaina ir marža</div>';

		/* v3.5: REDAGUOJAMI LAUKAI. Iraso `Enter` arba paspaudus salia;
		   `Esc` atstato buvusia reiksme. Kiekvienas irasymas — i zurnala. */
		$laukas_red = function ( $laukas, $etikete, $reiksme, $vnt = '€', $pastaba = '', $klase = '' ) use ( $pid ) {
			$txt = in_array( $laukas, array( '_sku', '_ean' ), true ) ? ' txt' : '';
			/* v4.4: SKU ir EAN kopijuojami vienu paspaudimu — iki šiol tekdavo
			   žymėti pele, o šie kodai kopijuojami dešimtis kartų per dieną. */
			$kopij = in_array( $laukas, array( '_sku', '_ean' ), true ) && $reiksme !== ''
				? '<button type="button" class="kort-kopij" title="Kopijuoti" data-kop="' . esc_attr( $reiksme ) . '">📋</button>' : '';
			echo '<div class="kort-eil"><span>' . esc_html( $etikete ) . '</span>'
				. '<span class="kort-red" data-laukas="' . esc_attr( $laukas ) . '" data-id="' . (int) $pid . '">'
				. '<input type="text" class="' . esc_attr( trim( $txt . ' ' . $klase ) ) . '"'
				. ' value="' . esc_attr( $reiksme ) . '" data-buvo="' . esc_attr( $reiksme ) . '">'
				. $kopij
				. '<span class="vnt">' . esc_html( $vnt ) . '</span>'
				. ( $pastaba !== '' ? '<span class="vnt">' . esc_html( $pastaba ) . '</span>' : '' )
				. '</span></div>';
		};

		/* Kaina eina per esama `ps_kat_kaina` — ten yra +5/−2 logika ir
		   uzrakto tvarkymas, kurio dubliuoti nereikia. */
		echo '<div class="kort-eil"><span>Kaina su PVM</span>'
			. '<span class="kort-red kort-kaina" data-id="' . (int) $pid . '">'
			. '<input type="text" value="' . esc_attr( $kaina === null ? '' : number_format( $kaina, 2, '.', '' ) ) . '"'
			. ' data-buvo="' . esc_attr( $kaina === null ? '' : number_format( $kaina, 2, '.', '' ) ) . '">'
			. '<span class="vnt">€</span></span></div>';

		$laukas_red( '_sale_price', 'Akcijos kaina',
			$mv( '_sale_price' ) === null ? '' : number_format( (float) $mv( '_sale_price' ), 2, '.', '' ),
			'€', 'tuščia = be akcijos' );

		echo '<div class="kort-eil"><span>Kaina be PVM</span><b class="kort-be-pvm">'
			. ( $kaina === null ? '—' : $eur( $kaina / ( 1 + self::PVM ) ) ) . '</b></div>';

		$sv_rankine = false;
		if ( class_exists( 'Petshop_Partijos' ) && Petshop_Partijos::av_preke( $pid )
			&& Petshop_Partijos::svertine_savikaina( $pid ) !== null ) {
			/* v3.6: AV savikaina ateina is partiju — rankinis irasymas ja
			   tik issuktu is vietos, todel laukas nebeleistinas. */
			$sv_part = Petshop_Partijos::svertine_savikaina( $pid );
			$pask    = Petshop_Partijos::paskutine_savikaina( $pid );
			echo '<div class="kort-eil"><span>Savikaina <b>sandėlyje</b></span><b>' . $eur( $sv_part )
				. ' <span class="vnt">svertinis vidurkis</span></b></div>';
			if ( $pask !== null && abs( $pask - $sv_part ) > 0.005 ) {
				echo '<div class="kort-eil"><span>Paskutinis pirkimas</span><b>' . $eur( $pask ) . '</b></div>';
			}
			echo '<div class="kort-info-m">Savikaina skaičiuojama iš partijų, kuriose dar yra likučio. '
				. 'Keičiama priimant prekes, ne čia — kitaip du skaičiai išsiskirtų.</div>';
		} elseif ( self::tiekejo_savikaina( $pid ) ) {
			echo '<div class="kort-eil"><span>Savikaina be PVM</span><b>' . $eur( $cost )
				. ' <span class="vnt">iš tiekėjo</span></b></div>';
		} else {
			$sv_rankine = true;
			$laukas_red( '_cost_price', 'Savikaina be PVM',
				$cost === null ? '' : number_format( (float) $cost, 2, '.', '' ), '€' );
			if ( $cost === null ) {
				/* v4.2: tylus tuščias laukas neįspėja — o be savikainos nematyti
				   nei maržos, nei atsargų vertės (~1 175 legacy prekių). */
				echo '<div class="persp">Savikaina nesuvesta — nematyti nei maržos, nei atsargų vertės.</div>';
			}
		}
		/* v4.2: eilutė rodoma ir kai maržos dar nėra, jei savikaina įvedama
		   ranka — kad įrašius skaičių marža užsipildytų GYVAI, be Enter.
		   Data atributai maitina klientinį perskaičiavimą (skriptas_v35). */
		if ( $marza !== null || ( $sv_rankine && $kaina !== null ) ) {
			$kl = $marza === null ? '' : ( $marza < $grind ? 'bad' : ( $marza < $grind + 5 ? 'warn' : 'ok' ) );
			echo '<div class="kort-eil"><span>Marža</span><b class="kort-marza' . ( $kl !== '' ? ' m_' . $kl : '' ) . '"'
				. ' data-grind="' . (float) $grind . '" data-pvm="' . (float) self::PVM . '"'
				. ' data-cost="' . ( $cost === null ? '' : (float) $cost ) . '">'
				. ( $marza === null ? '—'
					: number_format( $marza, 1, ',', ' ' ) . ' % · ' . $eur( self::marza_eur( $kaina, $cost ) ) )
				. '</b></div>';
			echo '<div class="kort-eil sml2"><span>Kategorijos riba</span><span>'
				. rtrim( rtrim( number_format( $grind, 1, ',', '' ), '0' ), ',' ) . ' %</span></div>';
		}
		if ( $siul !== null ) {
			$sk = abs( $siul - (float) $kaina ) < 0.02;
			echo '<div class="kort-eil"><span>Pagal jūsų taisykles</span><b class="' . ( $sk ? '' : 'siul' ) . '">' . $eur( $siul )
				. ( $sk ? ' <span class="sml">sutampa</span>' : '' ) . '</b></div>';
		}
		if ( $mv( '_manual_price_override' ) === 'yes' ) {
			echo '<div class="uzrakinta">🔒 Kaina nustatyta ranka — automatika jos neliečia</div>';
		}
		/* v4.4: iki šiol NIEKUR nebuvo pasakyta, kad įrašo Enter — žmogus
		   pakeičia skaičių, uždaro kortelę ir pakeitimas dingsta tyliai. */
		/* v4.9: AKCIJOS INDIKATORIUS. Akcijine kaina korteleje NEREDAGUOJAMA —
		   ji gyvena Akciju lange (TZ 37.6), kitaip po pusmecio neaisku, kur
		   akcija sukurta ir kas ja turi isjungti. */
		$akc_id = (int) $mv( '_ps_akcija_id' );
		if ( $akc_id && class_exists( 'Petshop_Akcijos' ) ) {
			$akc = Petshop_Akcijos::gauti( $akc_id );
			if ( $akc ) {
				$bus = Petshop_Akcijos::busenos();
				echo '<div class="kort-akcija"><b>' . esc_html( $akc['pavadinimas'] ) . '</b>'
					. '<span>' . esc_html( isset( $bus[ $akc['busena'] ] ) ? $bus[ $akc['busena'] ] : $akc['busena'] )
					. ( $akc['iki'] ? ' · iki ' . esc_html( mb_substr( $akc['iki'], 0, 10 ) ) : '' ) . '</span>'
					. '<a href="' . esc_url( admin_url( 'admin.php?page=ps-akcijos&akcija=' . $akc_id ) ) . '">Atidaryti akciją ↗</a></div>';
			}
		} elseif ( $mv( '_sale_price' ) !== null && class_exists( 'Petshop_Akcijos' ) ) {
			echo '<div class="kort-akcija svetima"><b>Akcijos kaina uždėta ne per Akcijų langą</b>'
				. '<span>nesivaldo automatiškai — nei įsijungs, nei išsijungs pati</span></div>';
		}
		echo '<div class="kort-uzuomina"><b>Enter</b> įrašo · <b>Esc</b> atstato · pakeistas, bet neįrašytas laukas — geltonas</div>';
		echo '</div>';

		$B_kaina = ob_get_clean();

		/* DUOMENYS */
		ob_start();
		echo '<div class="kort-blokas"><div class="kort-antr">Kodai ir siuntimas</div>';
		/* v4.6: SKU UŽRAKINTAS. Prie jo rišasi ps_sources registras, tiekėjų
		   XML sutapdinimas, užsakymų eilutės ir kainų palyginimo feed sąrašai —
		   atsitiktinis pakeitimas nutrauktų visas šias grandis vienu metu.
		   Bet ne visiškai: naujoms ir legacy prekėms kodą suvesti reikia,
		   todėl spyna nuimama sąmoningu veiksmu su įspėjimu. */
		$sku_dabar = (string) $mv( '_sku' );
		echo '<div class="kort-eil"><span>SKU <span class="kort-spyna" data-p="Prie SKU rišasi šaltinių registras, tiekėjų sutapdinimas ir užsakymai">🔒</span></span>'
			. '<span class="kort-red kort-sku" data-laukas="_sku" data-id="' . (int) $pid . '">'
			. '<input type="text" class="txt uzrakintas" value="' . esc_attr( $sku_dabar ) . '"'
			. ' data-buvo="' . esc_attr( $sku_dabar ) . '" readonly>'
			. ( $sku_dabar !== '' ? '<button type="button" class="kort-kopij" title="Kopijuoti" data-kop="' . esc_attr( $sku_dabar ) . '">📋</button>' : '' )
			. '<button type="button" class="kort-atrakinti">atrakinti</button>'
			. '<span class="stat"></span></span></div>';
		$laukas_red( '_ean', 'EAN', (string) $r['ean'], '', 'brūkšninis kodas', 'mono' );
		$laukas_red( '_weight', 'Prekės svoris', (string) $mv( '_weight' ), 'kg', 'su pakuote' );
		/* v3.8: TIK KURJERIU — perjungiama varnele.
		   Automatika sprendzia is svorio ir matmenu, bet daliai preku ju nera
		   (tualetas 56×39×38,5 cm sistemoje turi 0.0000), todel resolveris
		   grazina `courier_only: false` ir preke pasiūloma i pastomata, kur ji
		   netilptu. Rankinis pazymejimas turi virsenybe pries automatika. */
		$kurj_rankinis = get_post_meta( $pid, '_ps_tik_kurjeriu', true ) === 'yes';
		$kurj_auto = false;
		if ( class_exists( 'Petshop_AV_Source' ) && method_exists( 'Petshop_AV_Source', 'resolve' ) ) {
			$ff = Petshop_AV_Source::resolve( $pid );
			$kurj_auto = is_array( $ff ) && ! empty( $ff['courier_only'] );
		}
		echo '<div class="kort-eil"><span>Tik kurjeriu</span>'
			. '<span class="kort-red kort-varnele" data-laukas="_ps_tik_kurjeriu" data-id="' . (int) $pid . '">'
			. '<input type="checkbox" ' . checked( $kurj_rankinis, true, false ) . '>'
			. '<span class="vnt">' . ( $kurj_auto ? 'automatika irgi rodo „tik kurjeriu"' : 'netelpa į paštomatą' ) . '</span>'
			. '<span class="stat"></span></span></div>';
		if ( ! $kurj_rankinis && ! $kurj_auto ) {
			$sv = (float) get_post_meta( $pid, '_weight', true );
			$mt = array( (float) get_post_meta( $pid, '_length', true ),
				(float) get_post_meta( $pid, '_width', true ), (float) get_post_meta( $pid, '_height', true ) );
			if ( $sv <= 0 && array_sum( $mt ) <= 0 ) {
				echo '<div class="kort-info-m">Svorio ir matmenų nėra, todėl automatika negali nuspręsti — '
					. 'jei prekė į paštomatą netelpa, pažymėkite ranka.</div>';
			}
		}

		/* --- FILTRAVIMO ATRIBUTAI --- */
		/* v4.5: REDAGUOJAMI VIETOJE. Iki šiol kortelė rodė reikšmes ir siųsdavo
		   į WooCommerce redagavimo puslapį — t. y. lauk iš lango, į kurį ką tik
		   atėjai. Terminai priskiriami TIK per term_id (slug kolizija:
		   „1,5 kg" ir „15 kg" duoda tą patį slug'ą). */
		/* v4.2: $kat_tipas skaičiuojamas ČIA, o ne po atributų bloko — iki šiol
		   jis buvo naudojamas prieš apibrėžimą, todėl $tipas_a visada buvo null
		   ir maisto atributai kortelėje nesirodė. */
		$kat_tipas     = self::sekciju_lukesciai( $slugs );
		$tipas_a       = $kat_tipas['tipas'];
		$atr_zemelapis = self::atributu_zemelapis( $tipas_a );

		if ( $atr_zemelapis ) {
			echo '</div><div class="kort-blokas"><div class="kort-antr">Filtravimo atributai</div>';
			foreach ( $atr_zemelapis as $tax => $vardas ) {
				if ( ! taxonomy_exists( $tax ) ) { continue; }

				$visi = get_terms( array( 'taxonomy' => $tax, 'hide_empty' => false ) );
				if ( is_wp_error( $visi ) ) { $visi = array(); }
				$turi = wp_get_post_terms( $pid, $tax, array( 'fields' => 'ids' ) );
				$turi = is_wp_error( $turi ) ? array() : array_map( 'intval', $turi );

				/* Kelių reikšmių atributai (baltymai, speciali mityba) — sąrašas
				   su varnelėmis; vienos reikšmės — paprastas pasirinkimas. */
				$daug = in_array( $tax, array( 'pa_baltymu_saltinis', 'pa_speciali_mityba', 'pa_amzius' ), true );

				echo '<div class="kort-atr" data-tax="' . esc_attr( $tax ) . '" data-id="' . (int) $pid . '"'
					. ' data-daug="' . ( $daug ? 1 : 0 ) . '">';
				echo '<div class="kort-atr-h"><span>' . esc_html( $vardas ) . '</span>'
					. '<span class="kort-atr-rodo">' . esc_html( $turi
						? implode( ', ', wp_list_pluck( array_filter( array_map( 'get_term', $turi ) ), 'name' ) )
						: '—' ) . '</span>'
					. '<button type="button" class="kort-atr-keisti">keisti</button>'
					. '<span class="kort-atr-stat"></span></div>';

				echo '<div class="kort-atr-lauk" hidden>';
				if ( ! $visi ) {
					echo '<div class="kort-info-m">Šis atributas dar neturi reikšmių.</div>';
				} elseif ( $daug ) {
					echo '<div class="kort-atr-sar">';
					foreach ( $visi as $t ) {
						echo '<label><input type="checkbox" value="' . (int) $t->term_id . '"'
							. ( in_array( (int) $t->term_id, $turi, true ) ? ' checked' : '' ) . '> '
							. esc_html( $t->name ) . '</label>';
					}
					echo '</div>';
				} else {
					echo '<select class="kort-atr-sel"><option value="">— nėra —</option>';
					foreach ( $visi as $t ) {
						echo '<option value="' . (int) $t->term_id . '"'
							. ( in_array( (int) $t->term_id, $turi, true ) ? ' selected' : '' ) . '>'
							. esc_html( $t->name ) . '</option>';
					}
					echo '</select>';
				}
				echo '<div class="kort-atr-myg"><button type="button" class="kort-atr-irasyti">Įrašyti</button>'
					. '<button type="button" class="kort-atr-atsisakyti">Atsisakyti</button></div>';
				echo '</div></div>';
			}
		}

		/* --- RYSYS SU TIEKEJU (maketas v18) --- */
		$tiek_eil = array();
		foreach ( array( '_vf_supplier_sku' => 'VF kodas', '_zb_sku' => 'ZB kodas' ) as $k => $v ) {
			if ( $mv( $k ) !== null ) { $tiek_eil[ $v ] = $mv( $k ); }
		}
		foreach ( array( '_vf_last_sync' => 'VF atnaujinta', '_zb_last_sync' => 'ZB atnaujinta' ) as $k => $v ) {
			if ( $mv( $k ) !== null ) { $tiek_eil[ $v ] = mb_substr( (string) $mv( $k ), 0, 16 ); }
		}
		if ( $tiek_eil ) {
			echo '</div><div class="kort-blokas"><div class="kort-antr">Ryšys su tiekėju</div>';
			foreach ( $tiek_eil as $vardas => $reiksme ) {
				echo '<div class="kort-eil"><span>' . esc_html( $vardas ) . '</span><span class="mono sml">' . esc_html( $reiksme ) . '</span></div>';
			}
		}

		/* --- SERIMO LENTELE — TIK maistui (v3.8; $kat_tipas jau suskaičiuotas
		   aukščiau, v4.2) --- */
		if ( $kat_tipas['tipas'] === 'maistas' && class_exists( 'Petshop_Pilnumas' ) ) {
			$turi = Petshop_Pilnumas::turi_serimo_lentele( $pid );
			if ( $turi !== null ) {
				echo '</div><div class="kort-blokas"><div class="kort-antr">Šėrimo lentelė'
					. '<span class="kort-p ' . ( $turi ? 'ok' : 'warn' ) . '">' . ( $turi ? 'yra' : 'nėra' ) . '</span></div>';
				echo '<div class="kort-info-m">'
					. ( $turi
						? 'Lentelė patvirtinta ir maitina šėrimo skaičiuoklę.'
						: 'Be jos skaičiuoklė šiai prekei neveiks. Skaičiai vedami tik iš gamintojo šaltinio.' )
					. '</div>';
			}
		}

		echo '</div><div class="kort-blokas"><div class="kort-antr">Duomenys</div>';
		$eil = array(
			'Būsena'      => get_post_status( $pid ),
			'Tiekėjas'    => $r['sand'] !== '' ? strtoupper( $r['sand'] ) : '—',
			'Kategorijos' => $kats ? implode( ', ', $kats ) : '—',
			'Svoris'      => $mv( '_weight' ) ? $mv( '_weight' ) . ' kg' : '—',
			'Sukurta'     => mb_substr( get_post( $pid )->post_date, 0, 10 ),
			'Atnaujinta'  => mb_substr( get_post( $pid )->post_modified, 0, 16 ),
		);
		foreach ( $eil as $k => $v ) {
			echo '<div class="kort-eil sml2"><span>' . esc_html( $k ) . '</span><span>' . esc_html( (string) $v ) . '</span></div>';
		}
		echo '</div>';

		$B_duomenys = ob_get_clean();

		/* --- ISDESTYMAS: kaire = darbas, desine = kontekstas.
		   Tvarka pagal naudojimo dazni: kaina ir likuciai virsuje, nes su
		   jais dirbama kasdien; pilnumas, rysiai ir matomumas — desineje. */
		echo '<div class="kort-grid">';
		/* v3.7: partijos i KAIRE kolona, po saltiniu. Anksciau jos buvo virs
		   viso tinklelio ir atstumdavo „Kaina ir marza" zemyn — o butent nuo
		   jos darbas ir prasideda. */
		$B_partijos = '';
		/* v7.3: ne tik „av" — visos prekes, kuriu likuti vedam patys.
		   Ambrosia, Prins, Quattro guli musu lentynoje lygiai taip pat. */
		if ( class_exists( 'Petshop_Partijos' ) && self::likutis_rankinis( $pid ) ) {
			ob_start();
			self::kort_partijos( $pid );
			$B_partijos = ob_get_clean();
		}
		echo '<div class="kort-kaire">' . $B_kaina . $B_saltiniai . $B_partijos . $B_duomenys . '</div>';
		echo '<div class="kort-desine">' . $B_desine . '</div>';
		echo '</div>';

		echo '</div>'; /* /apžvalga */

		self::kort_aprasymai( $pid, $m );
		self::kort_nuotraukos( $pid, $m );
		self::kort_pardavimai( $pid );
		self::kort_istorija( $pid );
		if ( class_exists( 'Petshop_Partijos' ) ) { self::kort_pakuote( $pid ); }

		/* v4.8: neįrašytų pakeitimų juosta. Kabo kortelės apačioje, matoma
		   visuose skirtukuose — kaip ir sąrašo juosta. */
		echo '<div class="kort-saugoti" id="kort-saugoti" hidden>'
			. '<span class="kiek">Neįrašyta: <b>0</b> <span class="ks-ka"></span></span>'
			. '<span class="ks-klaida"></span>'
			. '<button type="button" class="ks-atmesti">Atmesti</button>'
			. '<button type="button" class="ks-irasyti">Įrašyti</button>'
			. '</div>';
	}

	/* ---------- APRAŠYMAI ---------- */

	/**
	 * Kokių sekcijų tikimės — PRIKLAUSO NUO KATEGORIJOS (savininko pastaba).
	 * Žaislui sudėties ir šėrimo normos nebūna, todėl reikalauti jų iš visų
	 * prekių reikštų rodyti melagingą „trūksta".
	 *
	 * „Pagaminta" NEREIKALAUJAMA (savininko sprendimas 2026-08-07): jos turi tik
	 * dalis prekių, todėl reikalavimas klaidintų ir savininką, ir pirkėją.
	 * Akordeonas (snippetas 512) ją ir toliau rodo ten, kur ji tekste yra.
	 */
	public static function sekciju_lukesciai( $kat_slugs ) {
		$t = self::be_diakritiku( implode( ' ', (array) $kat_slugs ) );

		$maistas = ( strpos( $t, 'maistas' ) !== false || strpos( $t, 'konserv' ) !== false
			|| strpos( $t, 'pasar' ) !== false || strpos( $t, 'edalas' ) !== false );
		$skanestai = ( strpos( $t, 'skanest' ) !== false || strpos( $t, 'kramtal' ) !== false );
		$papildai  = ( strpos( $t, 'vitamin' ) !== false || strpos( $t, 'papild' ) !== false );

		if ( $maistas ) {
			return array( 'tipas' => 'maistas', 'sekcijos' => array(
				'Aprašymas' => 'apra', 'Sudėtis' => 'sud',
				'Analitinės sudedamosios dalys' => 'analit', 'Priedai' => 'pried',
				'Šėrimo instrukcija' => 'serim' ) );
		}
		if ( $skanestai ) {
			return array( 'tipas' => 'skanėstai', 'sekcijos' => array(
				'Aprašymas' => 'apra', 'Sudėtis' => 'sud',
				'Analitinės sudedamosios dalys' => 'analit' ) );
		}
		if ( $papildai ) {
			return array( 'tipas' => 'papildai', 'sekcijos' => array(
				'Aprašymas' => 'apra', 'Sudėtis' => 'sud',
				'Šėrimo instrukcija' => 'serim' ) );
		}
		/* v5.9: aksesuarams — plius Medžiaga ir Matmenys. Guoliui, dėžei ar
		   antkakliui tai pirkimo sprendimą lemianti informacija: pirkėjas
		   visada klausia „kokio dydžio" ir „ar galima skalbti". Daugiau
		   sekcijų nededama sąmoningai — „Naudojimas", „Priežiūra" ir panašios
		   būtų perteklius, kurio niekas nepildys. */
		return array( 'tipas' => 'aksesuarai', 'sekcijos' => array(
			'Aprašymas' => 'apra', 'Medžiaga' => 'medz', 'Matmenys' => 'matm' ) );
	}

	private static function kort_aprasymai( $pid, $m ) {
		echo '<div class="kort-pane" data-p="apr">';
		$po   = get_post( $pid );
		$html = (string) $po->post_content;
		$ilgis = function ( $t ) { return mb_strlen( trim( wp_strip_all_tags( (string) $t ) ) ); };

		/* Tos pačios funkcijos, kurias naudoja prekės puslapis (snippetas 512).
		   Jei jų nėra — sakom tiesiai, o ne rodom tuščią sąrašą. */
		$yra_variklis = function_exists( 'psdp_split' ) && function_exists( 'psdp_title' );
		$sekcijos = array();
		if ( $yra_variklis && $html !== '' ) {
			$sw = function_exists( 'psdp_clean' ) ? psdp_clean( $html ) : $html;
			$dalys = psdp_split( $sw );
			/* psdp_split() grąžina poras [antraštė, turinys], jau kanonine tvarka */
			if ( is_array( $dalys ) ) {
				foreach ( $dalys as $d ) {
					if ( ! is_array( $d ) || ! isset( $d[0] ) ) { continue; }
					$antr = (string) $d[0];
					$tur  = isset( $d[1] ) ? (string) $d[1] : '';
					if ( $antr !== '' ) { $sekcijos[] = array( 'antraste' => $antr, 'turinys' => $tur ); }
				}
			}
		}

		/* v3.7: kategorija nustatoma PRIES antrasciu sarasa. Anksciau sarasas
		   buvo vienodas visiems, todel zaislui rodydavo „Sudėtis, Analitinės,
		   Šėrimo instrukcija" — sekcijas, kuriu jam nereikia ir nebus. Tuo pat
		   metu blokas zemiau teisingai sake „vertinama kaip aksesuarai".
		   Du prieštaraujantys atsakymai viename lange. */
		$kat_slugs = wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'slugs' ) );
		$kat_slugs = is_wp_error( $kat_slugs ) ? array() : $kat_slugs;
		$lukesciai = self::sekciju_lukesciai( $kat_slugs );

		/* v3.9: REDAKTORIUS. Iki siol kortele tik konstatuodavo „tekste nėra
		   antraščių" — priekaistas be irankio. Dabar cia pat galima ir
		   pataisyti: rasyti, iterpti antrasciu karkasa, atsaukti. */
		$uzrakintas = get_post_meta( $pid, '_ps_aprasymas_uzrakintas', true ) === 'yes';
		$bak_n = get_post_meta( $pid, '_ps_aprasymo_bak', true );
		$bak_n = is_array( $bak_n ) ? count( $bak_n ) : 0;
		$turinys = (string) get_post_field( 'post_content', $pid );

		/* v6.4: TRUMPAS APRASYMAS — pirmas, nes pirkejas ji mato pirma:
		   jis stovi virs „I krepseli", o pilnas aprasymas — zemiau, akordeone. */
		$tr_uzr  = get_post_meta( $pid, '_ps_trumpas_uzrakintas', true ) === 'yes';
		$tr_bak  = get_post_meta( $pid, '_ps_trumpo_bak', true );
		$tr_bak  = is_array( $tr_bak ) ? count( $tr_bak ) : 0;
		$trumpas = (string) get_post_field( 'post_excerpt', $pid );
		echo '<div class="kort-blokas kort-tr-red" data-id="' . (int) $pid . '">'
			. '<div class="kort-antr">Trumpas aprašymas'
			. '<span>'
			. ( $tr_uzr ? '<span class="kort-p ok" title="Ranka pataisytas — importas nebeperrašo">🔒 užrakinta</span>' : '' )
			. ( $tr_bak ? '<span class="kort-p">' . (int) $tr_bak . ' ankst. versijos</span>' : '' )
			. '<span class="kort-p ' . ( trim( $trumpas ) === '' ? 'warn' : 'ok' ) . '">'
			. ( trim( $trumpas ) === '' ? 'tuščias' : mb_strlen( trim( wp_strip_all_tags( $trumpas ) ) ) . ' simb.' )
			. '</span></span></div>';
		/* v6.5: laukas rodo TEKSTA, ne zaliava. Zaliava lieka `data-html`
		   atribute — perjungus i „HTML kodas" ji grazinama nepakitusi. */
		$tr_plokscias = trim( wp_strip_all_tags(
			str_replace( array( '</p>', '<br>', '<br/>', '<br />' ), "\n", str_replace( '&nbsp;', ' ', $trumpas ) ) ) );
		$tr_sankla = ( trim( $trumpas ) !== '' ) ? self::sanklos_dalis( $trumpas ) : 0;
		echo '<textarea class="kort-apr-txt kort-tr-txt" spellcheck="false" data-html="' . esc_attr( $trumpas ) . '" '
			. 'placeholder="2–4 trumpi sakiniai: kam prekė, kuo ji gera. Šitą tekstą pirkėjas skaito prieš spausdamas „Į krepšelį“.">'
			. esc_textarea( $tr_plokscias ) . '</textarea>';
		echo '<div class="kort-apr-rezimas">'
			. '<button type="button" class="kt-rez kt-rez-tekstas on">Tekstas</button>'
			. '<button type="button" class="kt-rez kt-rez-kodas">HTML kodas</button>'
			. '</div>';
		if ( $tr_sankla >= 15 ) {
			echo '<div class="kort-spejimas">Įrašytame kode apie <b>' . (int) $tr_sankla . ' %</b> sudaro '
				. 'HTML šiukšlės (inline stiliai, tušti apvalkalai). Įrašius jos bus pašalintos.</div>';
		}
		echo '<div class="kort-apr-veiksmai">'
			. '<button type="button" class="kt-irasyti">Įrašyti</button>'
			. ( $tr_bak ? '<button type="button" class="kt-atsaukti">Grąžinti ankstesnę</button>' : '' )
			. '<span class="kt-stat"></span></div>';
		echo '<div class="kort-info-m">Rašyk paprastu tekstu — kiekviena eilutė taps atskira pastraipa. '
			. 'HTML reikia tik nuorodai ar sąrašui. Tas pats laukas, kurį WooCommerce vadina „Trumpas prekės aprašymas“ — '
			. 'įrašius čia, jis pasikeičia ir ten, ir parduotuvėje. Įrašius užrakinama nuo importo; saugomos 5 ankstesnės versijos.</div>';
		echo '</div>';

		echo '<div class="kort-blokas kort-apr-red" data-id="' . (int) $pid . '">'
			. '<div class="kort-antr">Aprašymo tekstas'
			. '<span>'
			. ( $uzrakintas ? '<span class="kort-p ok" title="Ranka pataisytas — importas nebeperrašo">🔒 užrakinta</span>' : '' )
			. ( $bak_n ? '<span class="kort-p">' . (int) $bak_n . ' ankst. versijos</span>' : '' )
			. '</span></div>';
		/* Rengykle inicializuojama JS'u, nes kortele ikraunama AJAX'u — WP
		   `wp_editor()` cia neveiktu, jo skriptai kraunami puslapio ikrovimo metu. */
		echo '<textarea id="ps-apr-editor" class="kort-apr-txt" spellcheck="false">'
			. esc_textarea( $turinys ) . '</textarea>';
		echo '<div class="kort-apr-rezimas">'
			. '<button type="button" class="ka-rez ka-rez-tekstas on">Tekstas</button>'
			. '<button type="button" class="ka-rez ka-rez-kodas">HTML kodas</button>'
			. '</div>';
		$sankla = self::sanklos_dalis( $turinys );
		if ( $sankla >= 15 ) {
			echo '<div class="kort-spejimas">Šiame tekste apie <b>' . (int) $sankla . ' %</b> sudaro '
				. 'HTML šiukšlės (inline stiliai, tušti apvalkalai). Redaguoti sunku — '
				. 'pirma verta išvalyti.</div>';
		}
		echo '<div class="kort-apr-veiksmai">'
			. '<button type="button" class="ka-irasyti">Įrašyti</button>'
			. ( $sankla >= 10 ? '<button type="button" class="ka-valyti" title="Pašalina stilius ir tuščius apvalkalus; lentelės ir tekstas lieka">Išvalyti kodą…</button>' : '' )
			. '<button type="button" class="ka-sudelioti" title="Tas pats variklis, kaip Gavime: atpažįsta antraštes tekste ir sudeda sekcijas">Sudėlioti į lentynėles</button>'
			. '<button type="button" class="ka-karkasas" title="Prideda šiai kategorijai reikalingas antraštes; esamas tekstas lieka">Įterpti antraščių karkasą</button>'
			. ( $bak_n ? '<button type="button" class="ka-atsaukti">Grąžinti ankstesnę</button>' : '' )
			. '<span class="ka-stat"></span></div>';
		echo '<div class="kort-info-m">Įrašius tekstas užrakinamas — tiekėjo importas jo nebeperrašys. '
			. 'Saugomos 5 ankstesnės versijos.</div>';
		echo '</div>';

		echo '<div class="kort-blokas"><div class="kort-antr">Kaip mato pirkėjas'
			. '<span class="kort-p ' . ( $sekcijos ? 'ok' : 'warn' ) . '">'
			. ( $sekcijos ? count( $sekcijos ) . ' sekcijos' : 'vientisas tekstas' ) . '</span></div>';

		if ( ! $yra_variklis ) {
			echo '<div class="tuscia-t">Akordeono variklis neįkeltas — negaliu parodyti, kaip tekstas suskils.</div>';
		} elseif ( ! $sekcijos ) {
			$laukiamos = array();
			foreach ( array_keys( $lukesciai['sekcijos'] ) as $v ) { $laukiamos[] = '<b>' . esc_html( $v ) . '</b>'; }
			echo '<div class="persp-b">Tekste nėra antraščių, pagal kurias akordeonas skaido — '
				. 'pirkėjas matys vieną ištisinį bloką.<br>';
			if ( $laukiamos ) {
				echo 'Šio tipo prekei (<b>' . esc_html( $lukesciai['tipas'] ) . '</b>) prasminga '
					. ( count( $laukiamos ) === 1 ? 'antraštė' : 'antraštės' ) . ': ' . implode( ', ', $laukiamos ) . '.';
			} else {
				echo 'Šio tipo prekei atskirų sekcijų nereikia — vientisas aprašymas tinka.';
			}
			echo '</div>';
		} else {
			foreach ( $sekcijos as $s ) {
				echo '<details class="kort-sek"><summary>' . esc_html( $s['antraste'] )
					. '<i>' . $ilgis( $s['turinys'] ) . ' simb.</i></summary>'
					. '<div class="kort-tekstas">' . esc_html( mb_substr( trim( wp_strip_all_tags( $s['turinys'] ) ), 0, 900 ) ) . '</div></details>';
			}
		}
		echo '</div>';

		/* Ko trūksta — pagal prekės kategoriją, ne pagal vieną sąrašą visiems */
		if ( $yra_variklis ) {
			$slugs = wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'slugs' ) );
			$slugs = is_wp_error( $slugs ) ? array() : $slugs;
			$luk   = self::sekciju_lukesciai( $slugs );

			$turimos = array();
			foreach ( $sekcijos as $s ) { $turimos[] = self::be_diakritiku( $s['antraste'] ); }
			$trukstamos = array();
			foreach ( $luk['sekcijos'] as $vardas => $raktas ) {
				$rasta = false;
				foreach ( $turimos as $t ) { if ( mb_strpos( $t, $raktas ) !== false ) { $rasta = true; break; } }
				if ( ! $rasta ) { $trukstamos[] = $vardas; }
			}
			$viso = count( $luk['sekcijos'] );
			echo '<div class="kort-blokas"><div class="kort-antr">Struktūros pilnumas'
				. '<span class="kort-p ' . ( $trukstamos ? 'warn' : 'ok' ) . '">'
				. ( $viso - count( $trukstamos ) ) . ' / ' . $viso . '</span></div>';
			echo '<div class="kort-eil sml2"><span>Vertinama kaip</span><span>' . esc_html( $luk['tipas'] ) . '</span></div>';
			if ( $trukstamos ) {
				echo '<div class="truksta">Trūksta: <b>' . esc_html( implode( ', ', $trukstamos ) ) . '</b></div>';
			} else { echo '<div class="viskas">Visos šiam tipui reikalingos sekcijos yra</div>'; }
			echo '<div class="kort-info-m">Reikalavimai priklauso nuo kategorijos: žaislui sudėties ir '
				. 'šėrimo normos nereikia, maistui — būtina.</div>';
			echo '</div>';
		}


		/* Šėrimo lentelė — TIK maistui.
		   v3.8: anksciau blokas rodesi visiems, todel tualetas ir zaislas
		   gaudavo „Šėrimo lentelė — nėra". Reikalavimas, kurio niekada nebus
		   ivykdyta, nera informacija — tai triuksmas. */
		global $wpdb;
		$fm = $wpdb->prefix . 'ps_feeding_map';
		if ( $lukesciai['tipas'] === 'maistas'
			&& $wpdb->get_var( "SHOW TABLES LIKE '{$fm}'" ) === $fm ) {
			$t = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$fm} WHERE product_id=%d LIMIT 1", $pid ), ARRAY_A );
			echo '<div class="kort-blokas"><div class="kort-antr">Šėrimo lentelė'
				. '<span class="kort-p ' . ( $t ? 'ok' : '' ) . '">' . ( $t ? 'yra' : 'nėra' ) . '</span></div>';
			echo '<div class="kort-info-m">Šėrimo skaičiai keičiami tik savo keliu — čia rodomi tik informacijai.</div>';
			echo '</div>';
		}
		echo '</div>';
	}

	private static function be_diakritiku( $s ) {
		return strtolower( strtr( $s, array(
			'ą'=>'a','č'=>'c','ę'=>'e','ė'=>'e','į'=>'i','š'=>'s','ų'=>'u','ū'=>'u','ž'=>'z',
			'Ą'=>'a','Č'=>'c','Ę'=>'e','Ė'=>'e','Į'=>'i','Š'=>'s','Ų'=>'u','Ū'=>'u','Ž'=>'z',
		) ) );
	}

	/* ---------- NUOTRAUKOS ---------- */
	/**
	 * v4.5: NUOTRAUKOS VALDOMOS VIETOJE. Iki šiol skirtukas buvo tik langas į
	 * failų vardus — įkelti, pakeisti pagrindinę ar išmesti iš galerijos
	 * tekdavo WooCommerce puslapyje. 263 prekės guli eilėje „Be nuotraukos",
	 * ir kiekviena jų reikalavo išeiti iš šio lango.
	 */
	private static function kort_nuotraukos( $pid, $m ) {
		echo '<div class="kort-pane" data-p="fot" data-id="' . (int) $pid . '">';
		$tid = isset( $m['_thumbnail_id'] ) ? (int) $m['_thumbnail_id'] : 0;
		$gal = isset( $m['_product_image_gallery'] ) ? array_filter( array_map( 'intval', explode( ',', (string) $m['_product_image_gallery'] ) ) ) : array();

		echo '<div class="kort-blokas"><div class="kort-antr">Pagrindinė nuotrauka</div>';
		if ( $tid ) {
			$u   = wp_get_attachment_image_url( $tid, 'medium' );
			$f   = get_post_meta( $tid, '_wp_attached_file', true );
			$alt = get_post_meta( $tid, '_wp_attachment_image_alt', true );
			echo '<div class="kort-foto"><img src="' . esc_url( $u ) . '" alt=""></div>';
			echo '<div class="kort-eil sml2"><span>Failas</span><span class="mono">' . esc_html( basename( (string) $f ) ) . '</span></div>';
			/* Alt tekstas — SEO ir prieinamumas; redaguojamas vietoje. */
			echo '<div class="kort-eil"><span>Alt tekstas</span>'
				. '<span class="kort-red kort-alt" data-att="' . (int) $tid . '" data-id="' . (int) $pid . '">'
				. '<input type="text" class="txt" value="' . esc_attr( (string) $alt ) . '"'
				. ' data-buvo="' . esc_attr( (string) $alt ) . '" placeholder="ko trūksta paveikslėlyje">'
				. '<span class="stat"></span></span></div>';
			echo '<div class="kort-foto-myg">'
				. '<button type="button" class="kn-ikelti">Įkelti naują…</button>'
				. '<button type="button" class="kn-pagrindine">Pasirinkti iš medijos…</button>'
				. '<button type="button" class="kn-pagrindine-salinti pav">Pašalinti</button></div>';
			echo '<div class="kort-uzuomina">Keičiant seną nuotrauką ji nedingsta — keliauja į galerijos pradžią, iš kur grąžinama ★ mygtuku.</div>';
		} else {
			echo '<div class="truksta">Nėra pagrindinės nuotraukos — prekė eilėje „Be nuotraukos"</div>';
			echo '<div class="kort-foto-myg">'
				. '<button type="button" class="kn-ikelti">Įkelti naują…</button>'
				. '<button type="button" class="kn-pagrindine">Pasirinkti iš medijos…</button></div>';
		}
		echo '</div>';

		echo '<div class="kort-blokas"><div class="kort-antr">Galerija'
			. '<span class="kort-p">' . count( $gal ) . '</span></div>';
		if ( ! $gal ) {
			echo '<div class="tuscia-t">Galerija tuščia</div>';
		} else {
			echo '<div class="kort-galerija kort-gal-red">';
			foreach ( $gal as $g ) {
				$gu = wp_get_attachment_image_url( $g, 'thumbnail' );
				if ( ! $gu ) { continue; }
				echo '<div class="kg-el" data-att="' . (int) $g . '">'
					. '<img src="' . esc_url( $gu ) . '" alt="" loading="lazy">'
					. '<span class="kg-veiksmai">'
					. '<button type="button" class="kg-kaire" title="Į kairę">←</button>'
					. '<button type="button" class="kg-pagr" title="Padaryti pagrindine">★</button>'
					. '<button type="button" class="kg-salinti" title="Išmesti iš galerijos">×</button>'
					. '<button type="button" class="kg-desine" title="Į dešinę">→</button>'
					. '</span></div>';
			}
			echo '</div>';
		}
		echo '<div class="kort-foto-myg">'
			. '<button type="button" class="kn-galerija-ikelti">Įkelti į galeriją…</button>'
			. '<button type="button" class="kn-galerija">Pasirinkti iš medijos…</button>'
			. '<span class="kn-stat"></span></div>';
		echo '<div class="kort-uzuomina">★ padaro pagrindine · × išmeta iš galerijos (failas lieka medijoje) · ← → keičia tvarką</div>';
		echo '</div></div>';
	}

	/* ---------- ISTORIJA ---------- */
	/**
	 * v2.9: pardavimu greitis ir duomenu pilnumas — pirmame ekrane, ne
	 * paskutiniame skirtuke. Skaiciai imami is meta (naktinis perskaiciavimas),
	 * o ne gyvai, kad kortele atsidarytu greitai.
	 */
	/** Vieninga juosta: visi ivykiai chronologiskai. */
	private static function kort_juosta( $pid ) {
		$eil  = Petshop_Ivykiai::juosta( $pid, array( 'riba' => 120 ) );
		$sant = Petshop_Ivykiai::santrauka( $pid );

		$tipu_vardai = array(
			'kaina' => 'Kainos', 'likutis' => 'Likučiai', 'savikaina' => 'Savikainos',
			'busena' => 'Būsena', 'sandelis' => 'Tiekėjas', 'duomenys' => 'Duomenys',
			'nuotrauka' => 'Nuotraukos',
		);
		$saltiniu_vardai = array(
			'zmogus' => 'ranka', 'importas' => 'importas', 'cron' => 'automatika',
			'sistema' => 'sistema', 'perkelta' => 'senas žurnalas', 'cli' => 'komandinė eilutė',
		);

		echo '<div class="kort-blokas"><div class="kort-antr">Viskas, kas vyko su preke'
			. '<span class="kort-p">' . count( $eil ) . '</span></div>';

		if ( $sant ) {
			$d = array();
			foreach ( $sant as $x ) {
				$v = isset( $tipu_vardai[ $x['tipas'] ] ) ? $tipu_vardai[ $x['tipas'] ] : $x['tipas'];
				$d[] = $v . ' ' . (int) $x['c'];
			}
			echo '<div class="kort-eil sml2"><span>Pagal sritį</span><span>'
				. esc_html( implode( ' · ', $d ) ) . '</span></div>';
		}

		if ( ! $eil ) {
			echo '<div class="tuscia-t">Įvykių dar nėra. Juosta pildosi nuo šio modulio įdiegimo.</div>';
		} else {
			echo '<div class="kort-ist">';
			foreach ( $eil as $r ) {
				$laukas = $r['pastaba'] !== '' ? $r['pastaba'] : $r['laukas'];
				$sena   = ( $r['sena'] === '' ) ? '—' : $r['sena'];
				$nauja  = ( $r['nauja'] === '' ) ? '—' : $r['nauja'];
				$salt   = isset( $saltiniu_vardai[ $r['saltinis'] ] ) ? $saltiniu_vardai[ $r['saltinis'] ] : $r['saltinis'];

				echo '<div class="ist-eil">';
				echo '<div class="ist-v"><b>' . esc_html( $laukas ) . '</b> '
					. '<span class="ist-sk">' . esc_html( $sena ) . ' → ' . esc_html( $nauja ) . '</span></div>';
				echo '<div class="ist-m">' . esc_html( mb_substr( (string) $r['laikas'], 0, 16 ) )
					. ' · ' . esc_html( $salt )
					. ( $r['kas'] !== '' ? ' · ' . esc_html( $r['kas'] ) : '' )
					. ( $r['op_nr'] !== '' ? ' · <span class="mono">' . esc_html( $r['op_nr'] ) . '</span>' : '' )
					. '</div>';
				echo '</div>';
			}
			echo '</div>';
		}
		echo '</div>';
		echo '<div class="kort-info-m">Rodomi keitimai iš visų šaltinių: šio lango, '
			. 'WooCommerce redagavimo puslapio, importų ir naktinių darbų.</div>';
	}

	/** v3.0: ryšiai, broliai, matomumas. */
	private static function kort_rysiai( $pid ) {
		$eur = function ( $v ) { return number_format( (float) $v, 2, ',', ' ' ); };

		/* ---------- DALYVAUJA ---------- */
		$d = Petshop_Rysiai::dalyvauja( $pid );
		$viso = count( $d['rinkiniai'] ) + count( $d['fbt'] ) + count( $d['dp'] ) + count( $d['akcijos'] );

		/* v3.4: TUSCIAS BLOKAS NERODOMAS. Anksciau kiekviena preke gaudavo
		   bloka su nuliu ir pastraipa paaiskinimo apie tai, ko nera. */
		if ( $viso ) {
			echo '<div class="kort-blokas"><div class="kort-antr">Kur ši prekė dalyvauja'
				. '<span class="kort-p ok">' . (int) $viso . '</span></div>';
			$grupe = function ( $antraste, $sar ) {
				if ( ! $sar ) { return; }
				echo '<div class="kort-eil sml2"><span>' . esc_html( $antraste ) . '</span><span>';
				$d = array();
				foreach ( $sar as $x ) {
					$t = esc_html( mb_substr( $x['pav'], 0, 46 ) );
					if ( ! empty( $x['nuoroda'] ) ) {
						$t = '<a href="' . esc_url( $x['nuoroda'] ) . '">' . $t . '</a>';
					}
					if ( ! empty( $x['pastaba'] ) ) { $t .= ' <i>' . esc_html( $x['pastaba'] ) . '</i>'; }
					if ( ! empty( $x['busena'] ) && $x['busena'] !== 'publish' ) {
						$t .= ' <span class="z draft">' . esc_html( $x['busena'] ) . '</span>';
					}
					$d[] = $t;
				}
				echo implode( '<br>', $d ) . '</span></div>';
			};
			$grupe( 'Rinkiniuose', $d['rinkiniai'] );
			$grupe( 'Perkama kartu', $d['fbt'] );
			$grupe( 'Pakuočių skelbimai', $d['dp'] );
			$grupe( 'Akcijose', $d['akcijos'] );
			echo '<div class="kort-info-m">Prieš keičiant kainą ar išimant iš prekybos '
				. 'verta patikrinti, kas dar nuo šios prekės priklauso.</div>';
			echo '</div>';
		}

		/* ---------- BROLIAI IR €/KG ---------- */
		$br = Petshop_Rysiai::broliai( $pid );
		if ( count( $br ) > 1 ) {
			echo '<div class="kort-blokas"><div class="kort-antr">Ta pati prekė kitais dydžiais'
				. '<span class="kort-p">' . ( count( $br ) - 1 ) . '</span></div>';
			echo '<table class="kort-broliai">';
			foreach ( $br as $b ) {
				$si = ! empty( $b['si'] );
				echo '<tr' . ( $si ? ' class="si"' : '' ) . '>';
				echo '<td>' . ( $si ? '<b>' : '' ) . esc_html( mb_substr( $b['pav'], 0, 40 ) ) . ( $si ? '</b>' : '' ) . '</td>';
				echo '<td class="num">' . ( $b['gramai'] !== null ? esc_html( self::gramai_tekstu( $b['gramai'] ) ) : '—' ) . '</td>';
				echo '<td class="num">' . ( $b['kaina'] !== null ? $eur( $b['kaina'] ) . ' €' : '—' ) . '</td>';
				echo '<td class="num"><b>' . ( $b['eur_kg'] !== null ? $eur( $b['eur_kg'] ) . ' €/kg' : '—' ) . '</b></td>';
				echo '</tr>';
			}
			echo '</table>';

			$nes = Petshop_Rysiai::kainos_nesamone( $br );
			if ( $nes ) {
				echo '<div class="kort-spejimas">Didesnė pakuotė brangesnė už kilogramą nei mažesnė:';
				foreach ( array_slice( $nes, 0, 3 ) as $n ) {
					echo '<br>' . esc_html( self::gramai_tekstu( $n['mazesne']['gramai'] ) ) . ' — '
						. $eur( $n['mazesne']['eur_kg'] ) . ' €/kg vs '
						. esc_html( self::gramai_tekstu( $n['didesne']['gramai'] ) ) . ' — '
						. $eur( $n['didesne']['eur_kg'] ) . ' €/kg';
				}
				echo '<div class="kort-info-m">Pirkėjas tai mato visada. Paprastai didesnė pakuotė '
					. 'turėtų būti pigesnė už kilogramą.</div></div>';
			}
			echo '<div class="kort-info-m">Sąrašas sudaromas automatiškai pagal prekės ženklą ir '
				. 'pavadinimą — tai pasiūlymas, ne įrašytas ryšys.</div>';
			echo '</div>';
		}

		/* ---------- MATOMUMAS ---------- */
		$m = Petshop_Rysiai::matomumas( $pid );
		echo '<div class="kort-blokas"><div class="kort-antr">Kur prekė matoma</div>';
		$z = function ( $etikete, $ar, $paaisk = '' ) {
			echo '<div class="kort-eil sml2"><span>' . esc_html( $etikete ) . '</span><span>'
				. '<span class="mat ' . ( $ar ? 'taip' : 'ne' ) . '">' . ( $ar ? 'taip' : 'ne' ) . '</span>'
				. ( $paaisk !== '' ? ' <i>' . esc_html( $paaisk ) . '</i>' : '' ) . '</span></div>';
		};
		/* v3.4: keturios eilutes "taip/taip/taip/taip" suspaustos i viena juosta. */
		$visi = array( 'parduotuvėje' => $m['parduotuveje'], 'sandėlyje' => $m['sandelyje'],
			'paieškoje' => $m['paieskoje'], 'feeduose' => $m['feeduose'] );
		echo '<div class="kort-eil"><span>Matoma</span><span>';
		foreach ( $visi as $vardas => $ar ) {
			echo '<span class="mat ' . ( $ar ? 'taip' : 'ne' ) . '">' . esc_html( $vardas ) . '</span> ';
		}
		echo '</span></div>';
		if ( ! $m['parduotuveje'] && $m['busena'] !== 'publish' ) {
			echo '<div class="kort-eil sml2"><span>Kodėl ne parduotuvėje</span><span>' . esc_html( $m['busena'] ) . '</span></div>';
		}
		if ( ! $m['sandelyje'] ) { echo '<div class="kort-eil sml2"><span>Sandėlyje</span><span>likučio nėra</span></div>'; }
		if ( $m['noindex'] ) { echo '<div class="kort-eil sml2"><span>Paieškoje</span><span>uždėtas noindex</span></div>'; }
		echo '</div>';
	}

	private static function gramai_tekstu( $g ) {
		if ( $g === null ) { return '—'; }
		if ( $g >= 1000 ) { return rtrim( rtrim( number_format( $g / 1000, 2, ',', '' ), '0' ), ',' ) . ' kg'; }
		return (int) $g . ' g';
	}

	/**
	 * v3.6: PARTIJOS. Rodo, kas dar guli lentynoje, kiek kainavo ir kada
	 * baigiasi galiojimas. Uzsienio valiuta rodoma su originalia suma ir kursu —
	 * kad matytusi, is kur atsirado EUR skaicius.
	 */
	private static function kort_partijos( $pid ) {
		$eur  = function ( $v ) { return number_format( (float) $v, 2, ',', ' ' ); };
		$part = Petshop_Partijos::partijos( $pid );
		$sant = Petshop_Partijos::santrauka( $pid );

		echo '<div class="kort-blokas"><div class="kort-antr">Partijos'
			. '<span class="kort-p ' . ( $sant['su_likuciu'] ? 'ok' : '' ) . '">'
			. (int) $sant['su_likuciu'] . ' su likučiu · ' . (int) $sant['av_likutis'] . ' vnt.</span></div>';

		if ( ! $part ) {
			echo '<div class="tuscia-t">Partijų dar nėra. Partija — tai konkretus kiekis su savo galiojimu '
				. 'ir savikaina; jų gali būti kelios, jei ta pati prekė lentynoje guli su skirtingomis datomis.</div>';
		} else {
			/* v5.5: partijos laukai REDAGUOJAMI. Sutarta taisykle — visi laukai
			   keiciami, isskyrus koda; partijos is jos buvo iskritusios.
			   Praktinis pagrindas: (1) priimant sunta lengva suklysti su data
			   ar kiekiu, (2) tiekejas gali pratesti „geriausia iki" termina,
			   ir tai teisetas sprendimas, kuriam sistema neturi trukdyti. */
			echo '<table class="kort-t kort-part"><tr><th>Partija</th><th class="n">Gauta</th><th class="n">Liko</th>'
				. '<th class="n">Savikaina</th><th>Geriausia iki</th><th></th></tr>';
			foreach ( $part as $b ) {
				$liko = (int) $b['kiekis_liko'];
				$stil = $liko > 0 ? '' : ' class="isnaudota"';
				echo '<tr' . $stil . ' data-part="' . (int) $b['id'] . '" data-id="' . (int) $pid . '">';
				echo '<td>#' . (int) $b['id'] . ' · ' . esc_html( mb_substr( (string) $b['gauta'], 0, 10 ) )
					. ( $b['tiekejas'] !== '' ? '<div class="sml2">' . esc_html( $b['tiekejas'] ) . '</div>' : '' ) . '</td>';
				echo '<td class="n">' . (int) $b['kiekis_gautas'] . '</td>';
				/* Likutis redaguojamas: nurasymai ir inventorizacija. */
				echo '<td class="n"><span class="pt-red" data-laukas="kiekis_liko">'
					. '<input type="text" value="' . $liko . '" data-buvo="' . $liko . '"></span></td>';
				echo '<td class="n"><span class="pt-red" data-laukas="savikaina_eur">'
					. '<input type="text" value="' . number_format( (float) $b['savikaina_eur'], 2, '.', '' )
					. '" data-buvo="' . number_format( (float) $b['savikaina_eur'], 2, '.', '' ) . '"></span> €';
				if ( $b['valiuta'] !== 'EUR' && $b['savikaina_orig'] !== null ) {
					echo '<div class="sml2">' . $eur( $b['savikaina_orig'] ) . ' ' . esc_html( $b['valiuta'] )
						. ' · ' . number_format( (float) $b['kursas'], 2, ',', '' ) . '</div>';
				}
				echo '</td>';
				echo '<td><span class="pt-red pt-data" data-laukas="geriausia_iki">'
					. '<input type="text" class="ps-data" placeholder="2027-09-30" value="' . esc_attr( (string) $b['geriausia_iki'] ) . '"'
					. ' data-buvo="' . esc_attr( (string) $b['geriausia_iki'] ) . '"></span>'
					. '<span class="pt-liko">' . ( $b['geriausia_iki'] ? self::liko_menesiu( $b['geriausia_iki'] ) : '' ) . '</span></td>';
				echo '<td class="pt-galas">'
					. ( (int) $b['importuota'] ? '<span class="z" title="Importuota — pakuotės patenka į GPAIS">GPAIS</span>' : '' )
					. '<span class="pt-stat"></span></td>';
				echo '</tr>';
			}
			echo '</table>';
			echo '<div class="kort-uzuomina"><b>Enter</b> įrašo · <b>Esc</b> atstato · kiekvienas pakeitimas patenka į įvykių žurnalą</div>';
			echo '<div class="kort-info-m">Nurašoma pagal artimiausią galiojimą (FEFO), o ne pagal '
				. 'gavimo eilę — taip apsisaugoma nuo nurašymų dėl pasibaigusio termino. '
				. 'Pakeitus likutį ar savikainą, prekės AV likutis ir svertinė savikaina perskaičiuojami.</div>';
		}

		echo '</div>';
	}

	/** Kiek meneisu liko iki datos — zenkleliu. */
	private static function liko_menesiu( $data ) {
		$t = strtotime( $data );
		if ( ! $t ) { return ''; }
		$men = (int) floor( ( $t - current_time( 'timestamp' ) ) / ( 30 * DAY_IN_SECONDS ) );
		if ( $men < 0 )  { return '<span class="z bad">pasibaigęs</span>'; }
		if ( $men < 3 )  { return '<span class="z bad">' . $men . ' mėn.</span>'; }
		if ( $men < 6 )  { return '<span class="z warn">' . $men . ' mėn.</span>'; }
		return '<span class="z ok">' . $men . ' mėn.</span>';
	}

	/**
	 * v3.6: PARDAVIMAI atskirame skirtuke. Sonineje kolonoje telpa tik
	 * santrauka; menesiu eiga ir uzsakymai reikalauja viso ploties.
	 */
	private static function kort_pardavimai( $pid ) {
		echo '<div class="kort-pane" data-p="prd">';
		if ( ! class_exists( 'Petshop_Pardavimai' ) ) {
			echo '<div class="tuscia-t">Pardavimų modulis neįdiegtas.</div></div>';
			return;
		}
		$eur = function ( $v ) { return number_format( (float) $v, 2, ',', ' ' ); };
		$m   = Petshop_Pardavimai::is_meta( $pid );

		echo '<div class="kort-blokas"><div class="kort-antr">Santrauka'
			. ( $m['abc'] !== '' ? '<span class="kort-p ok">' . esc_html( $m['abc'] ) . ' klasė</span>' : '' )
			. '</div>';
		echo '<div class="kort-eil"><span>Per 30 dienų</span><b>' . (int) $m['v30'] . ' vnt.</b></div>';
		echo '<div class="kort-eil"><span>Per 90 dienų</span><b>' . (int) $m['v90'] . ' vnt.</b></div>';
		echo '<div class="kort-eil"><span>Per metus</span><b>' . (int) $m['v365'] . ' vnt. · '
			. $eur( $m['pajamos365'] ) . ' €</b></div>';
		echo '<div class="kort-eil"><span>Užsakymų</span><b>' . (int) $m['uzsakymai'] . '</b></div>';
		if ( $m['marza365'] !== null ) {
			echo '<div class="kort-eil"><span>Marža per metus</span><b>' . $eur( $m['marza365'] ) . ' €</b></div>';
		}
		if ( $m['dienu'] !== null ) {
			echo '<div class="kort-eil"><span>Likučio užteks</span><b>' . (int) $m['dienu'] . ' d.</b></div>';
		}
		if ( $m['paskutinis'] !== '' ) {
			echo '<div class="kort-eil"><span>Paskutinis pardavimas</span><span class="sml2">'
				. esc_html( mb_substr( $m['paskutinis'], 0, 10 ) ) . '</span></div>';
		}
		if ( $m['marza365'] !== null ) {
			echo '<div class="kort-info-m">Marža apytikslė: dabartinė savikaina × parduotas kiekis. '
				. 'Jei tiekėjas per metus kėlė kainą, tikroji buvo kitokia.</div>';
		}
		if ( $m['atnaujinta'] !== '' ) {
			echo '<div class="kort-info-m">Perskaičiuota ' . esc_html( mb_substr( $m['atnaujinta'], 0, 16 ) )
				. ' · atnaujinama kas naktį 04:50.</div>';
		}
		echo '</div>';
		echo '</div>';
	}

	/**
	 * v3.6: PAKUOTE (GPAIS). Liecia tik importuotas partijas — VF/ZB prekes
	 * yra is LT tiekeju, kurie deklaruoja patys.
	 */
	private static function kort_pakuote( $pid ) {
		echo '<div class="kort-pane" data-p="pak">';
		$met = Petshop_Partijos::gpais_pagal_metus( $pid );

		/* v6.9: duomenys keliauja `data-` atributais, o ne `<script>` bloku:
		   kortele ikraunama per `innerHTML`, o taip iterpti skriptai
		   NIEKADA nepasileidzia. Ta pati klaida cia jau buvo su rengykle. */
		$eil = array();
		foreach ( Petshop_Partijos::pakuotes( $pid ) as $x ) {
			$eil[] = array(
				'id'  => (int) $x['id'], 'pav' => (string) $x['pavadinimas'], 'tip' => (string) $x['tipas'],
				'med' => (string) $x['medziaga'], 'sv' => (float) $x['svoris_g'],
				'vnt' => (int) $x['vienetu_pakuoteje'], 'su' => (int) $x['tiekiama_su_preke'],
			);
		}
		echo '<div class="kort-blokas kort-pak" data-id="' . (int) $pid . '"'
			. ' data-eil="' . esc_attr( wp_json_encode( $eil ) ) . '"'
			. ' data-med="' . esc_attr( wp_json_encode( Petshop_Partijos::medziagos() ) ) . '"'
			. ' data-tip="' . esc_attr( wp_json_encode( Petshop_Partijos::tipai() ) ) . '">';
		echo '<div class="kort-antr">GPAIS pakuotės sudėtis<span class="kort-pak-zyme"></span></div>';
		echo '<div class="kort-pak-info">Čia aprašomos <b>pakuotės, kuriomis prekė supakuota</b> — dėžutė, maišelis, plėvelė. '
			. 'Tai ne prekės dydis (12 kg, 400 g) — tas gyvena atributuose. '
			. 'Svoriai įvedami vieną kartą, o sistema toliau daugina iš gaunamų kiekių ir sudeda į metinę deklaraciją.</div>';
		echo '<div class="kort-pak-sar"></div>';
		echo '<div class="kort-pak-veiksmai"><button type="button" class="kpak-nauja">➕ Pridėti pakuotės eilutę</button>'
			. '<span class="kpak-stat"></span></div>';
		echo '<div class="kort-info-m">Grupinei pakuotei nurodomas vienetų skaičius pakuotėje — '
			. 'kitaip sistema padaugintų dėžutę iš visų vienetų ir gautųsi kelis kartus per daug.</div>';
		echo '</div>';

		echo '<div class="kort-blokas"><div class="kort-antr">Įnašas į deklaraciją</div>';
		if ( ! $met ) {
			echo '<div class="tuscia-t">Importuotų partijų nėra — ši prekė į jūsų pakuočių '
				. 'deklaraciją nepatenka. Pirkta Lietuvoje pakuotes deklaruoja tiekėjas.</div>';
		} else {
			echo '<table class="kort-t"><tr><th>Metai</th><th class="n">Įvežta vnt.</th>'
				. '<th class="n">Iš viso</th><th>Pagal medžiagas</th></tr>';
			foreach ( $met as $x ) {
				$dal = array();
				foreach ( $x['pagal_medziaga'] as $md => $kg ) {
					$dal[] = esc_html( $md ) . ' ' . number_format( $kg, 2, ',', '' ) . ' kg';
				}
				echo '<tr><td>' . (int) $x['metai'] . '</td><td class="n">' . (int) $x['vienetu'] . '</td>'
					. '<td class="n"><b>' . number_format( $x['viso_kg'], 2, ',', '' ) . ' kg</b></td>'
					. '<td class="sml2">' . implode( ' · ', $dal ) . '</td></tr>';
			}
			echo '</table>';
			echo '<div class="kort-info-m">Skaičiuojama tik iš partijų, pažymėtų „importas".</div>';
		}
		echo '</div>';
		echo '</div>';
	}

	/**
	 * v7.0: kategoriju priskyrimas.
	 *
	 * REPLACE, ne merge: sarasas, kuri zmogus mato lange, ir yra galutinis
	 * atsakymas. Pridejimo logika (merge) reikstu, kad varneles nuemimas
	 * nieko nedaro — o butent to zmogus ir tikisi.
	 */
	public static function ajax_kategorijos() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );

		$pid = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		if ( ! $pid || get_post_type( $pid ) !== 'product' ) { wp_send_json_error( 'nėra prekės' ); }

		$ids = isset( $_POST['kategorijos'] ) ? json_decode( wp_unslash( $_POST['kategorijos'] ), true ) : array();
		if ( ! is_array( $ids ) ) { $ids = array(); }
		$ok = array();
		foreach ( $ids as $id ) {
			$id = (int) $id;
			$t  = $id ? get_term( $id, 'product_cat' ) : null;
			if ( $t && ! is_wp_error( $t ) ) { $ok[] = $id; }
		}
		$ok = array_values( array_unique( $ok ) );

		$buvo = wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'names' ) );
		$buvo = is_wp_error( $buvo ) ? array() : $buvo;

		$r = wp_set_object_terms( $pid, $ok, 'product_cat', false );
		if ( is_wp_error( $r ) ) { wp_send_json_error( $r->get_error_message() ); }

		if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }
		self::kesas_lauk( $pid );
		if ( class_exists( 'Petshop_Pilnumas' ) ) { Petshop_Pilnumas::perskaiciuoti( $pid ); }

		$tapo = wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'names' ) );
		$tapo = is_wp_error( $tapo ) ? array() : $tapo;

		if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
			try { Petshop_Ivykiai::irasyti( $pid, 'duomenys', array(
				'laukas' => 'kategorijos', 'buvo' => implode( ', ', $buvo ), 'tapo' => implode( ', ', $tapo ),
				'pastaba' => 'Kategorijos pakeistos kortelėje' ) ); }
			catch ( Throwable $e ) { /* zurnalas neprivalo blokuoti */ }
		}

		wp_send_json_success( array( 'kategorijos' => $tapo, 'kiek' => count( $ok ) ) );
	}

	/** v6.8: GPAIS pakuociu eilutes. */
	public static function ajax_pakuote() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'nepakanka teisių', 403 ); }
		check_ajax_referer( 'ps_kat', 'nonce' );
		if ( ! class_exists( 'Petshop_Partijos' ) ) { wp_send_json_error( 'partijų modulis neįdiegtas' ); }

		$pid = isset( $_POST['id'] ) ? (int) $_POST['id'] : 0;
		if ( ! $pid || get_post_type( $pid ) !== 'product' ) { wp_send_json_error( 'nėra prekės' ); }

		$veiksmas = isset( $_POST['veiksmas'] ) ? sanitize_key( wp_unslash( $_POST['veiksmas'] ) ) : '';
		$d = isset( $_POST['duomenys'] ) ? json_decode( wp_unslash( $_POST['duomenys'] ), true ) : array();
		if ( ! is_array( $d ) ) { $d = array(); }

		if ( $veiksmas === 'trinti' ) {
			$r = Petshop_Partijos::trinti_pakuote( isset( $d['id'] ) ? (int) $d['id'] : 0, $pid );
			if ( is_wp_error( $r ) ) { wp_send_json_error( $r->get_error_message() ); }
		} elseif ( $veiksmas === 'irasyti' ) {
			/* Medziaga ir tipas TIK is saraso — laisvas tekstas suskaldytu
			   deklaracija i „Plastikas" ir „plastikas". */
			$med = isset( $d['medziaga'] ) ? (string) $d['medziaga'] : '';
			$tip = isset( $d['tipas'] ) ? (string) $d['tipas'] : '';
			if ( ! array_key_exists( $med, Petshop_Partijos::medziagos() ) ) { wp_send_json_error( 'nežinoma medžiaga' ); }
			if ( ! array_key_exists( $tip, Petshop_Partijos::tipai() ) ) { wp_send_json_error( 'nežinomas tipas' ); }

			$r = Petshop_Partijos::irasyti_pakuote( $pid, array(
				'id'                => isset( $d['id'] ) ? (int) $d['id'] : 0,
				'pavadinimas'       => isset( $d['pavadinimas'] ) ? sanitize_text_field( $d['pavadinimas'] ) : '',
				'tipas'             => $tip,
				'medziaga'          => $med,
				'svoris_g'          => isset( $d['svoris_g'] ) ? $d['svoris_g'] : 0,
				'vienetu_pakuoteje' => isset( $d['vienetu_pakuoteje'] ) ? (int) $d['vienetu_pakuoteje'] : 1,
				'tiekiama_su_preke' => ! empty( $d['tiekiama_su_preke'] ),
			) );
			if ( is_wp_error( $r ) ) { wp_send_json_error( $r->get_error_message() ); }

			if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
				try { Petshop_Ivykiai::irasyti( $pid, 'duomenys', array(
					'laukas' => 'GPAIS pakuotė', 'buvo' => '', 'tapo' => $med . ' · ' . (string) $d['svoris_g'] . ' g',
					'pastaba' => 'Pakuotės eilutė įrašyta kortelėje' ) ); }
				catch ( Throwable $e ) { /* zurnalas neprivalo blokuoti */ }
			}
		} else {
			wp_send_json_error( 'nežinomas veiksmas' );
		}

		$eil = array();
		foreach ( Petshop_Partijos::pakuotes( $pid ) as $x ) {
			$eil[] = array(
				'id'  => (int) $x['id'], 'pav' => (string) $x['pavadinimas'], 'tip' => (string) $x['tipas'],
				'med' => (string) $x['medziaga'], 'sv' => (float) $x['svoris_g'],
				'vnt' => (int) $x['vienetu_pakuoteje'], 'su' => (int) $x['tiekiama_su_preke'],
			);
		}
		wp_send_json_success( array( 'eilutes' => $eil ) );
	}

	private static function kort_greitis( $pid, $p ) {
		$mg = function ( $k ) use ( $pid ) { return get_post_meta( $pid, $k, true ); };
		$v30   = $mg( '_ps_sales_30d' );
		$v365  = $mg( '_ps_sales_365d' );
		$dienu = $mg( '_ps_dienu_atsargai' );
		$abc   = (string) $mg( '_ps_abc' );
		$marza = $mg( '_ps_margin_365d' );
		$pask  = (string) $mg( '_ps_last_sale' );
		$eur   = function ( $v ) { return number_format( (float) $v, 2, ',', ' ' ); };

		echo '<div class="kort-blokas"><div class="kort-antr">Kaip sekasi';
		if ( $abc !== '' ) { echo '<span class="kort-p ok">' . esc_html( $abc ) . ' klasė</span>'; }
		echo '</div>';

		if ( $v30 === '' && $v365 === '' ) {
			echo '<div class="tuscia-t">Pardavimai dar neperskaičiuoti</div>';
		} elseif ( (int) $v30 === 0 && (int) $v365 === 0 ) {
			echo '<div class="kort-eil sml2"><span>Pardavimų</span><span>per metus nebuvo</span></div>';
		} else {
			echo '<div class="kort-pard">';
			echo '<div><span>Per 30 d.</span><b>' . (int) $v30 . ' vnt.</b></div>';
			echo '<div><span>Per metus</span><b>' . (int) $v365 . ' vnt.</b></div>';
			if ( $dienu !== '' ) {
				echo '<div><span>Užteks</span><b>' . (int) $dienu . ' d.</b></div>';
			}
			if ( $marza !== '' ) {
				echo '<div><span>Marža per metus</span><b>' . $eur( $marza ) . ' €</b></div>';
			}
			echo '</div>';
			if ( $marza !== '' ) {
				echo '<div class="kort-info-m">Marža apytikslė: dabartinė savikaina × parduotas kiekis. '
					. 'Jei tiekėjas per metus kėlė kainą, tikroji buvo kitokia.</div>';
			}
			if ( $pask !== '' ) {
				echo '<div class="kort-eil sml2"><span>Paskutinis pardavimas</span><span>'
					. esc_html( mb_substr( $pask, 0, 10 ) ) . '</span></div>';
			}
		}
		echo '</div>';

		/* --- pilnumas --- */
		$proc = isset( $p['proc'] ) ? (int) $p['proc'] : 0;
		echo '<div class="kort-blokas"><div class="kort-antr">Duomenų pilnumas'
			. '<span class="kort-p ' . ( $proc >= 100 ? 'ok' : 'warn' ) . '">' . $proc . ' %</span></div>';
		echo '<div class="kort-piln-juosta"><i style="width:' . max( 0, min( 100, $proc ) ) . '%"></i></div>';
		if ( ! empty( $p['truksta'] ) ) {
			/* v4.4: tai vienintelis VEIKSMŲ sąrašas kortelėje — buvo pilkas ir
			   smulkus, todėl akis jį praleisdavo. Dabar gintarinis akcentas. */
			echo '<div class="truksta">Trūksta: <b>' . esc_html( implode( ', ', $p['truksta'] ) ) . '</b></div>';
		} else {
			echo '<div class="kort-info-m">Visi šio tipo prekei reikalingi laukai užpildyti.</div>';
		}
		echo '</div>';
	}

	/**
	 * v2.9: VIENINGA LAIKO JUOSTA.
	 *
	 * Iki siol cia buvo rodomi TIK per si langa atlikti keitimai, o apacioje
	 * stovejo prisipazinimas "Importu ir kitu saltiniu keitimai cia nepatenka".
	 * Butent ta akla zona leme, kad `_ps_sandelis` dingimo istorija (S718)
	 * uztruko keturis diagnostikos praejimus vietoj vieno zvilgsnio.
	 *
	 * Dabar juosta imama is `Petshop_Ivykiai` (S721), kabinamos ant meta
	 * hook'u ir todel matancios VISUS kelius: si langa, WC redagavimo puslapi,
	 * importa, cron'a. Senasis AV zurnalas lieka ATSARGINE saka.
	 */
	private static function kort_istorija( $pid ) {
		echo '<div class="kort-pane" data-p="ist">';

		if ( class_exists( 'Petshop_Ivykiai' ) ) {
			self::kort_juosta( $pid );
			echo '</div>';
			return;
		}

		global $wpdb;
		$t = self::zurnalo_lentele();
		$eil = array();
		if ( $wpdb->get_var( "SHOW TABLES LIKE '{$t}'" ) === $t ) {
			$eil = $wpdb->get_results( $wpdb->prepare(
				"SELECT * FROM {$t} WHERE product_id=%d ORDER BY id DESC LIMIT 40", $pid ), ARRAY_A );
		}

		echo '<div class="kort-blokas"><div class="kort-antr">Keitimai per katalogą'
			. '<span class="kort-p">' . count( $eil ) . '</span></div>';
		if ( ! $eil ) {
			echo '<div class="tuscia-t">Per šį langą prekė dar nekeista</div>';
		} else {
			$vardai = array( '_stock' => 'Likutis', '_own_stock_qty' => 'AV likutis',
				'_regular_price' => 'Kaina', '_manual_price_override' => 'Kainos užraktas' );
			echo '<div class="kort-ist">';
			foreach ( $eil as $r ) {
				$kas = get_userdata( (int) $r['user_id'] );
				$laukas = isset( $vardai[ $r['laukas'] ] ) ? $vardai[ $r['laukas'] ] : $r['laukas'];
				echo '<div class="ist-eil' . ( (int) $r['atsaukta'] ? ' atsaukta' : '' ) . '">';
				echo '<div class="ist-v"><b>' . esc_html( $laukas ) . '</b> '
					. '<span class="ist-sk">' . esc_html( $r['buvo'] === null ? '—' : $r['buvo'] ) . ' → '
					. esc_html( (string) $r['tapo'] ) . '</span>'
					. ( (int) $r['atsaukta'] ? '<span class="z bad">atšaukta</span>' : '' ) . '</div>';
				echo '<div class="ist-m">' . esc_html( mb_substr( $r['sukurta'], 0, 16 ) ) . ' · '
					. esc_html( isset( self::priezastys()[ $r['priezastis'] ] ) ? self::priezastys()[ $r['priezastis'] ] : $r['priezastis'] )
					. ' · ' . esc_html( $kas ? $kas->display_name : 'nežinomas' )
					. ' · <span class="mono">' . esc_html( $r['operacija'] ) . '</span></div>';
				echo '</div>';
			}
			echo '</div>';
		}
		echo '</div>';
		echo '<div class="kort-info-m">Rodomi tik keitimai, atlikti per šį katalogo langą. '
			. 'Importų ir kitų šaltinių keitimai čia nepatenka.</div>';
		echo '</div>';
	}

	/** v3.3: body klase, kad pilno ekrano CSS galiotu TIK siame puslapyje. */
	public static function body_klase( $klases ) {
		if ( isset( $_GET['page'] ) && $_GET['page'] === 'ps-katalogas' ) {
			$klases .= ' petshop-katalogas';
		}
		return $klases;
	}

	public static function meniu() {
		add_menu_page(
			'Petshop prekės', 'Petshop prekės', 'manage_woocommerce',
			'ps-katalogas', array( __CLASS__, 'puslapis' ), 'dashicons-products', 3
		);
	}

	/** WooCommerce prekių punktas slepiamas CSS'u — puslapis lieka veikiantis. */
	public static function slepti_wc_prekes() {
		echo '<style>
		#adminmenu li#menu-posts-product,
		#adminmenu li.menu-icon-product,
		#adminmenu a.menu-top[href="edit.php?post_type=product"]{display:none!important}
		</style>';
	}

	/* ==================== DUOMENYS ==================== */

	/**
	 * Visų prekių pagrindiniai duomenys VIENU praėjimu.
	 * Meta užkraunama masiškai (update_meta_cache) — kitaip 3 800 prekių
	 * duotų dešimtis tūkstančių atskirų užklausų.
	 */
	public static function surinkti() {
		$kesas = get_transient( 'ps_kat_duomenys' );
		if ( is_array( $kesas ) && isset( $kesas['v'] ) && $kesas['v'] === self::VERSIJA ) {
			return $kesas;
		}

		global $wpdb;
		$p = $wpdb->prefix;

		/* post_content NEIMAMAS — 3 800 aprašymų neišsitektų atmintyje.
		   Vietoj jo tik požymis, ar jis netuščias. */
		$eil = $wpdb->get_results(
			"SELECT ID, post_title, post_status, post_modified,
			        (TRIM(COALESCE(post_content,'')) <> '') AS turi_turini
			 FROM {$p}posts
			 WHERE post_type='product' AND post_status IN ('publish','draft','private','pending')
			 ORDER BY post_title ASC", ARRAY_A );

		$ids = wp_list_pluck( $eil, 'ID' );

		/* META VIENU SELECT ir TIK reikalingi raktai.
		   update_meta_cache() visoms prekėms suvalgo 256 MB ir nulaužia puslapį (S646). */
		$meta = self::meta_masinis( $ids );

		/* REGISTRAS, kategorijos, brendai, tipai — po vieną užklausą kiekvienam */
		$reg   = self::registras_masinis( $ids );
		$kat   = self::terminai( $ids, 'product_cat' );
		$brend = self::terminai( $ids, 'pa_brendas' );
		if ( ! $brend ) { $brend = self::terminai( $ids, 'product_brand' ); }
		$tipai = self::terminai( $ids, 'product_type' );

		$prekes = array(); $brendai = array(); $kategorijos = array();

		/* Miniatiūros vienu SELECT — po vieną per prekę būtų 3 800 užklausų. */
		$foto = self::miniatiuros( $ids, $meta );

		/* v5.1: GERIAUSIA IKI. Tas pats principas — vienas SELECT visoms
		   prekėms; `Petshop_Partijos::artimiausias_galiojimas()` atsako apie
		   VIENĄ prekę, todėl sąrašui netinka (būtų 1 400 užklausų). */
		$gi = self::partiju_datos();

		$kainodara = class_exists( 'Petshop_Pricing' ) ? new Petshop_Pricing() : null;

		foreach ( $eil as $r ) {
			$pid = (int) $r['ID'];
			$m   = isset( $meta[ $pid ] ) ? $meta[ $pid ] : array();
			$mv  = function ( $k, $num = false ) use ( $m ) {
				if ( ! isset( $m[ $k ] ) || $m[ $k ] === '' || $m[ $k ] === null ) { return null; }
				return $num ? (float) $m[ $k ] : $m[ $k ];
			};

			$s_list = self::saltiniai_prekei( $pid, isset( $reg[ $pid ] ) ? $reg[ $pid ] : array(), $m );

			/* v8.4: BUVIMAS ir VYKDYMAS atskirti.
			   `sand` = is kur siunciam (viena reiksme, kaip ir buvo).
			   `turi_*` = ar TOJE vietoje yra likutis (kelios vienu metu).
			   Del to preke, gulinti ir AV, ir VF, nebedingsta is filtro.
			   Savikaina renkama i du atskirus laukus, o aktyvioji
			   pasirenkama pagal AV likuti (savininko sprendimas 2026-08-17):
			   AV turi -> AV savikaina; AV tuscias -> tiekejo. */
			$av = null; $tiek = null; $sand = ''; $ssku = ''; $sync = null; $cost = null;
			$cost_av = null; $cost_tiek = null;
			$turi = array( 'av' => false, 'vf' => false, 'zb' => false );
			foreach ( $s_list as $s ) {
				$src = strtolower( trim( (string) $s['source'] ) );
				if ( $src === 'av' ) {
					$av = $s['stock_qty'];
					if ( $cost_av === null ) { $cost_av = $s['cost_net']; }
					if ( $sand === '' ) { $sand = 'av'; }
					if ( $av !== null && (int) $av > 0 ) { $turi['av'] = true; }
				} else {
					$tiek = $s['stock_qty'];
					$sand = $src;
					$ssku = (string) $s['supplier_sku'];
					$sync = $s['synced_at'];
					if ( $s['cost_net'] !== null ) { $cost_tiek = $s['cost_net']; }
					if ( isset( $turi[ $src ] ) && $tiek !== null && (int) $tiek > 0 ) { $turi[ $src ] = true; }
				}
			}
			if ( $sand === '' ) { $sand = (string) $mv( '_ps_sandelis' ); }
			/* v8.4: sandelis VISADA mazosiomis. Gavimas (petshop-gavimas.php:434)
			   ir laukai (petshop-laukai.php:581) raso didziosiomis; normalizuojam
			   skaitymo vietoje, kad nesvarbu butu, kas ir kaip irase. */
			$sand = strtolower( trim( (string) $sand ) );

			/* AKTYVIOJI savikaina. Iki v8.4 tiekejo saka perrasydavo AV
			   savikaina besalygiskai — dvigubai prekei butu laimejes tiekejas. */
			if ( $av !== null && (int) $av > 0 && $cost_av !== null ) {
				$cost = $cost_av;
			} elseif ( $cost_tiek !== null ) {
				$cost = $cost_tiek;
			} else {
				$cost = $cost_av;
			}

			/* v5.8: SAVIKAINA — tiekejo pateikta kaina YRA musu savikaina
			   (savininko sprendimas 2026-08-11).
			   Iki siol imta TIK is `ps_sources` registro, todel preke, kurios
			   registre nera, atrode „be savikainos", nors `_vf_cost` ar
			   `_zb_cost` meta buvo uzpildyta. Del to katalogas rode 795, o
			   pilnumo variklis — 744: du skirtingi atsakymai i ta pati
			   klausima. Dabar atsargine tvarka ta pati abiejose vietose. */
			if ( $cost === null ) {
				foreach ( array( '_cost_price', '_vf_cost', '_zb_cost' ) as $ck ) {
					$cv = $mv( $ck, true );
					if ( $cv !== null && (float) $cv > 0 ) { $cost = (float) $cv; break; }
				}
			}

			/* Parduodamas kiekis — TAS PATS Stock_Service, tik gryna funkcija,
			   kad nereikėtų iš naujo kelti šaltinių iš duomenų bazės. */
			$parduodama = 0;
			if ( class_exists( 'Petshop_Stock_Service' ) && method_exists( 'Petshop_Stock_Service', 'skaiciuoti_is_masyvo' ) ) {
				$x = Petshop_Stock_Service::skaiciuoti_is_masyvo( $s_list );
				$parduodama = (int) $x['qty'];
			}

			$kaina  = $mv( '_regular_price', true );
			$akcija = $mv( '_sale_price', true );
			$marza  = self::marza( $kaina, $cost );
			$kats   = isset( $kat[ $pid ] ) ? $kat[ $pid ] : array();
			$br     = isset( $brend[ $pid ] ) ? reset( $brend[ $pid ] ) : '';

			/* Siūloma kaina pagal taisykles — tam, kad matytum, kur nukrypta.
			   Skaičiuojama tik kai yra savikaina, kitaip beprasmiška. */
			$siuloma = null;
			if ( $cost !== null && $cost > 0 && $kainodara ) {
				try { $siuloma = $kainodara->preview_price( (float) $cost, $kats ); }
				catch ( Throwable $e ) { $siuloma = null; }
			}

			foreach ( $kats as $k ) { $kategorijos[ $k ] = true; }
			if ( $br ) { $brendai[ $br ] = true; }

			$ean = '';
			foreach ( array( '_vf_barcode', '_zb_barcode', '_ean', '_barcode', '_wpm_gtin_code' ) as $k ) {
				if ( isset( $m[ $k ] ) && $m[ $k ] !== '' ) { $ean = (string) $m[ $k ]; break; }
			}

			$apras = ! empty( $r['turi_turini'] )
				|| ( isset( $m['petshop_desc_aprasymas'] ) && trim( (string) $m['petshop_desc_aprasymas'] ) !== '' )
				|| ( isset( $m['petshop_desc_sudetis'] ) && trim( (string) $m['petshop_desc_sudetis'] ) !== '' );

			$tipas = 'simple';
			if ( isset( $tipai[ $pid ] ) && in_array( 'variable', $tipai[ $pid ], true ) ) { $tipas = 'var'; }
			if ( isset( $m['_ps_rinkinys'] ) || isset( $m['_petshop_dp_sablonas'] ) ) { $tipas = 'rinkinys'; }

			$prekes[] = array(
				'id'    => $pid,
				'n'     => html_entity_decode( $r['post_title'], ENT_QUOTES, 'UTF-8' ),
				'st'    => $r['post_status'],
				'upd'   => mb_substr( (string) $r['post_modified'], 0, 10 ),
				'sand'  => $sand,
				'av'    => $av,
				'tiek'  => $tiek,
				'pard'  => $parduodama,
				'price' => $kaina,
				'sale'  => $akcija,
				'cost'  => $cost,
				/* v8.4: abi savikainos matomos atskirai — filtruoti galima
				   ir „kur AV pigiau nei tiekejo", o tai pirkimo sprendimas. */
				'cost_av'   => $cost_av,
				'cost_tiek' => $cost_tiek,
				'turi_av'   => $turi['av'],
				'turi_vf'   => $turi['vf'],
				'turi_zb'   => $turi['zb'],
				'marza' => $marza,
				'grind' => self::grindys_prekei( $kats ),
				'kat'   => $kats,
				'br'    => $br,
				'sku'   => (string) $mv( '_sku' ),
				'ean'   => $ean,
				'ssku'  => $ssku,
				'sync'  => $sync,
				'foto'  => isset( $m['_thumbnail_id'] ) && (int) $m['_thumbnail_id'] > 0,
				'img'   => isset( $foto[ $pid ] ) ? $foto[ $pid ] : '',
				'siul'  => $siuloma,
				'lock'  => isset( $m['_manual_price_override'] ) && $m['_manual_price_override'] === 'yes',
				'apras' => $apras,
				'tipas' => $tipas,
				'delist'=> isset( $m['_ps_isimta'] ) && $m['_ps_isimta'] === '1',
				'nesalt'=> isset( $m['_ps_be_saltinio'] ) && $m['_ps_be_saltinio'] === '1',
				/* v2.9: pardavimu greitis ir pilnumo balas */
				'v30'   => isset( $m['_ps_sales_30d'] ) ? (int) $m['_ps_sales_30d'] : null,
				'v365'  => isset( $m['_ps_sales_365d'] ) ? (int) $m['_ps_sales_365d'] : null,
				'dienu' => ( isset( $m['_ps_dienu_atsargai'] ) && $m['_ps_dienu_atsargai'] !== '' ) ? (int) $m['_ps_dienu_atsargai'] : null,
				'abc'   => isset( $m['_ps_abc'] ) ? (string) $m['_ps_abc'] : '',
				'pmarza'=> ( isset( $m['_ps_margin_365d'] ) && $m['_ps_margin_365d'] !== '' ) ? (float) $m['_ps_margin_365d'] : null,
				'pbalas'=> ( isset( $m['_ps_pilnumas'] ) && $m['_ps_pilnumas'] !== '' ) ? (int) $m['_ps_pilnumas'] : null,
				'ptrukst'=> isset( $m['_ps_pilnumas_truksta'] ) ? (string) $m['_ps_pilnumas_truksta'] : '',
				'pkodai' => isset( $m['_ps_pilnumas_kodai'] ) ? (string) $m['_ps_pilnumas_kodai'] : '',
				/* v5.1: artimiausia „geriausia iki" data ir kiek dienų iki jos.
				   `null` reiškia, kad prekė partijomis nevaldoma — tai NE
				   problema, o kita atsargų rūšis (dropship guli pas tiekėją). */
				/* v5.2: kiek dienu neparduodama (nuo paskutinio pardavimo arba
				   nuo publikavimo, jei niekada neparduota). */
				'nepard'=> self::neparduodama_dienu(
					isset( $m['_ps_last_sale'] ) ? $m['_ps_last_sale'] : '',
					isset( $m['_ps_publikuota'] ) ? $m['_ps_publikuota'] : '' ),
				'pub'   => isset( $m['_ps_publikuota'] ) ? $m['_ps_publikuota'] : null,
				'psale' => isset( $m['_ps_last_sale'] ) ? $m['_ps_last_sale'] : null,
				'gi'    => isset( $gi[ $pid ] ) ? $gi[ $pid ]['data'] : null,
				'gid'   => isset( $gi[ $pid ] ) ? $gi[ $pid ]['dienu'] : null,
				'gikiek'=> isset( $gi[ $pid ] ) ? $gi[ $pid ]['kiekis'] : null,
			);
			$prekes[ count( $prekes ) - 1 ]['pilnumas'] = self::pilnumas( $prekes[ count( $prekes ) - 1 ] );
		}

		unset( $meta, $reg, $eil );

		$rez = array(
			'v'           => self::VERSIJA,
			'laikas'      => current_time( 'mysql' ),
			'prekes'      => $prekes,
			'brendai'     => array_keys( $brendai ),
			'kategorijos' => array_keys( $kategorijos ),
		);
		sort( $rez['brendai'] );
		sort( $rez['kategorijos'] );

		/* Transientas guli DB — jei masyvas pasirodytų per didelis, geriau
		   perskaičiuoti kas kartą, nei pripildyti options lentelę. */
		$dydis = strlen( maybe_serialize( $rez ) );
		if ( $dydis < 4000000 ) { set_transient( 'ps_kat_duomenys', $rez, 300 ); }
		$rez['kesas_b'] = $dydis;
		return $rez;
	}

	/**
	 * Miniatiūrų URL vienu SELECT. Naudojamas ESAMAS `thumbnail` dydis —
	 * naujo nekuriam, kad nedidintume ShortPixel sąskaitos.
	 */
	private static function miniatiuros( $ids, $meta ) {
		/* v6.6: VIENAS failas gali priklausyti KELIOMS prekems (kopija ir
		   originalas). Todel cia sarasas, ne viena reiksme — kitaip antroji
		   preke perrasytu pirmaja ir ta liktu be miniatiuros. */
		$att = array();
		foreach ( $ids as $pid ) {
			$t = isset( $meta[ $pid ]['_thumbnail_id'] ) ? (int) $meta[ $pid ]['_thumbnail_id'] : 0;
			if ( $t > 0 ) { $att[ $t ][] = (int) $pid; }
		}
		if ( ! $att ) { return array(); }
		global $wpdb; $p = $wpdb->prefix;
		$in = implode( ',', array_map( 'intval', array_keys( $att ) ) );
		$eil = $wpdb->get_results(
			"SELECT post_id, meta_key, meta_value FROM {$p}postmeta
			 WHERE post_id IN ({$in}) AND meta_key IN ('_wp_attached_file','_wp_attachment_metadata')", ARRAY_A );
		$failai = array(); $mdata = array();
		foreach ( $eil as $r ) {
			if ( $r['meta_key'] === '_wp_attached_file' ) { $failai[ (int) $r['post_id'] ] = $r['meta_value']; }
			else { $mdata[ (int) $r['post_id'] ] = $r['meta_value']; }
		}
		$baze = wp_get_upload_dir();
		$baze = trailingslashit( $baze['baseurl'] );
		$out  = array();
		foreach ( $att as $aid => $prekiu_ids ) {
			if ( ! isset( $failai[ $aid ] ) ) { continue; }
			$kelias = $failai[ $aid ];
			$url    = $baze . $kelias;
			if ( isset( $mdata[ $aid ] ) ) {
				$md = @maybe_unserialize( $mdata[ $aid ] );
				if ( is_array( $md ) && ! empty( $md['sizes']['thumbnail']['file'] ) ) {
					$url = $baze . trailingslashit( dirname( $kelias ) ) . $md['sizes']['thumbnail']['file'];
				}
			}
			foreach ( (array) $prekiu_ids as $pid ) { $out[ (int) $pid ] = $url; }
		}
		return $out;
	}

	/**
	 * Prekės pilnumas — kiek laukų užpildyta iš tų, kurių reikia paskelbimui.
	 * Juodraščiams tai atsako „kiek liko iki prekybos".
	 */
	/**
	 * v2.9: balas imamas is `Petshop_Pilnumas` (S723) — vieno saltinio
	 * taisyklė. Dvi pilnumo sistemos viename lange rodytu skirtingus
	 * skaicius tam paciam dalykui, o tai blogiau nei ne vienos.
	 * Senoji logika lieka ATSARGA, jei modulio nera.
	 */
	public static function pilnumas( $r ) {
		if ( isset( $r['pbalas'] ) && $r['pbalas'] !== null ) {
			return array(
				'yra'      => (int) $r['pbalas'],
				'viso'     => 100,
				'proc'     => (int) $r['pbalas'],
				'truksta'  => $r['ptrukst'] !== '' ? explode( ', ', $r['ptrukst'] ) : array(),
				'saltinis' => 'variklis',
			);
		}
		return self::pilnumas_atsargine( $r );
	}

	private static function pilnumas_atsargine( $r ) {
		$tikrinam = array(
			'nuotrauka'  => $r['foto'],
			'aprašymas'  => $r['apras'],
			'EAN'        => $r['ean'] !== '',
			'kaina'      => $r['price'] !== null,
			'savikaina'  => $r['cost'] !== null,
			'šaltinis'   => $r['sand'] !== '' && ! $r['nesalt'],
			'kategorija' => ! empty( $r['kat'] ),
			'brendas'    => $r['br'] !== '',
		);
		$truksta = array();
		foreach ( $tikrinam as $k => $v ) { if ( ! $v ) { $truksta[] = $k; } }
		$viso = count( $tikrinam );
		$yra  = $viso - count( $truksta );
		return array(
			'yra'      => $yra,
			'viso'     => $viso,
			'proc'     => $viso ? (int) round( $yra * 100 / $viso ) : 0,
			'truksta'  => $truksta,
			'saltinis' => 'atsarginė',
		);
	}

	/** Meta laukai VIENU SELECT — tik tie, kurių reikia ekranui. */
	private static function meta_masinis( $ids ) {
		if ( ! $ids ) { return array(); }
		global $wpdb; $p = $wpdb->prefix;
		$raktai = array(
			'_ps_sandelis','_own_stock_qty','_stock','_cost_price',
			'_vf_qty','_vf_cost','_vf_last_sync','_vf_supplier_sku','_vf_barcode',
			'_zb_qty','_zb_cost','_zb_last_sync','_zb_sku','_zb_barcode',
			'_regular_price','_sale_price','_sku','_thumbnail_id',
			'_ps_isimta','_ps_be_saltinio','_ean','_barcode','_wpm_gtin_code',
			'_manual_price_override','_petshop_lock_pricing',
			'petshop_desc_aprasymas','petshop_desc_sudetis',
			'_ps_rinkinys','_petshop_dp_sablonas',
			/* v2.9 varikliai: pardavimai (S722) ir pilnumas (S723).
			   Skaitomi is meta, ne skaiciuojami gyvai — 200 eiluciu puslapis
			   kitaip reikstu 200 agregaciju per uzklausa. */
			'_ps_sales_30d','_ps_sales_365d','_ps_dienu_atsargai','_ps_abc',
			'_ps_margin_365d','_ps_last_sale',
			'_ps_pilnumas','_ps_pilnumas_truksta',
			/* v5.2: publikavimo momentas — zr. `sekti_publikavima()` */
			'_ps_publikuota',
			/* v5.6: pilnas truksta raktu sarasas — atskiroms eilems */
			'_ps_pilnumas_kodai',
		);
		$in_k = implode( ',', array_fill( 0, count( $raktai ), '%s' ) );
		$in_i = implode( ',', array_map( 'intval', $ids ) );
		$eil  = $wpdb->get_results( $wpdb->prepare(
			"SELECT post_id, meta_key, meta_value FROM {$p}postmeta
			 WHERE post_id IN ({$in_i}) AND meta_key IN ({$in_k})", $raktai ), ARRAY_A );
		$out = array();
		foreach ( $eil as $r ) { $out[ (int) $r['post_id'] ][ $r['meta_key'] ] = $r['meta_value']; }
		return $out;
	}

	/** Visų prekių registro eilutės VIENU SELECT. */
	private static function registras_masinis( $ids ) {
		if ( ! $ids || ! class_exists( 'Petshop_Sources' ) ) { return array(); }
		global $wpdb;
		$t = $wpdb->prefix . 'ps_sources';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '{$t}'" ) !== $t ) { return array(); }
		$eil = $wpdb->get_results(
			"SELECT product_id, source, supplier_sku, ean, is_active, is_sellable, priority
			 FROM {$t} ORDER BY priority ASC, id ASC", ARRAY_A );
		$out = array();
		foreach ( $eil as $r ) { $out[ (int) $r['product_id'] ][] = $r; }
		return $out;
	}

	/**
	 * Vienos prekės šaltiniai: registras (jau paimtas) + gyvi skaičiai iš meta.
	 * Nėra įrašo registre → tas pats atsarginis kelias kaip Petshop_Sources.
	 */
	private static function saltiniai_prekei( $pid, $reg, $m ) {
		if ( ! $reg ) { return array(); }
		$out = array();
		foreach ( $reg as $r ) {
			$g = self::gyvi_is_meta( $r['source'], $m );
			$out[] = array(
				'source'       => $r['source'],
				'supplier_sku' => $r['supplier_sku'],
				'ean'          => $r['ean'],
				'stock_qty'    => $g['stock_qty'],
				'cost_net'     => $g['cost_net'],
				'synced_at'    => $g['synced_at'],
				'is_active'    => (int) $r['is_active'],
				'is_sellable'  => (int) $r['is_sellable'],
				'priority'     => (int) $r['priority'],
			);
		}
		return $out;
	}

	/**
	 * Gyvi skaičiai iš jau paimto meta masyvo — BE duomenų bazės.
	 * Ta pati logika kaip Petshop_Sources::gyvi(); jei ji keisis, keisti IR ČIA.
	 */
	private static function gyvi_is_meta( $source, $m ) {
		$v = function ( $k ) use ( $m ) { return isset( $m[ $k ] ) ? $m[ $k ] : ''; };
		$sk = function ( $x ) { return ( $x === '' || $x === null ) ? null : round( (float) $x, 4 ); };

		$sand  = $v( '_ps_sandelis' );
		$own   = $v( '_own_stock_qty' );
		$stock = $v( '_stock' );

		if ( $source === 'av' ) {
			$qty = ( $sand === 'av' )
				? ( ( $own !== '' ) ? (int) $own : ( ( $stock !== '' ) ? (int) $stock : null ) )
				: (int) $own;
			return array( 'stock_qty' => $qty, 'cost_net' => $sk( $v( '_cost_price' ) ), 'synced_at' => null );
		}

		$L = array(
			'vf' => array( 'qty' => '_vf_qty', 'cost' => '_vf_cost', 'sync' => '_vf_last_sync' ),
			'zb' => array( 'qty' => '_zb_qty', 'cost' => '_zb_cost', 'sync' => '_zb_last_sync' ),
		);
		$l = isset( $L[ $source ] ) ? $L[ $source ] : array( 'qty' => null, 'cost' => '_cost_price', 'sync' => null );

		$qty = $l['qty'] ? $v( $l['qty'] ) : '';
		if ( $qty === '' ) { $qty = $stock; }
		$cost = $l['cost'] ? $v( $l['cost'] ) : '';
		if ( $cost === '' || (float) $cost <= 0 ) { $cost = $v( '_cost_price' ); }

		return array(
			'stock_qty' => ( $qty === '' ) ? null : (int) $qty,
			'cost_net'  => $sk( $cost ),
			'synced_at' => $l['sync'] ? ( $v( $l['sync'] ) ?: null ) : null,
		);
	}

	/** Terminų pavadinimai visoms prekėms vienu SELECT. */
	private static function terminai( $ids, $taksonomija ) {
		if ( ! $ids ) { return array(); }
		global $wpdb; $p = $wpdb->prefix;
		$in = implode( ',', array_map( 'intval', $ids ) );
		$eil = $wpdb->get_results( $wpdb->prepare(
			"SELECT tr.object_id, t.name
			 FROM {$p}term_relationships tr
			 INNER JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
			 INNER JOIN {$p}terms t ON t.term_id = tt.term_id
			 WHERE tt.taxonomy = %s AND tr.object_id IN ({$in})", $taksonomija ), ARRAY_A );
		$out = array();
		foreach ( $eil as $r ) { $out[ (int) $r['object_id'] ][] = $r['name']; }
		return $out;
	}

	/** Marža procentais nuo kainos BE PVM. */
	public static function marza( $kaina_su_pvm, $savikaina_be_pvm ) {
		if ( $kaina_su_pvm === null || $savikaina_be_pvm === null ) { return null; }
		if ( $kaina_su_pvm <= 0 ) { return null; }
		$be = $kaina_su_pvm / ( 1 + self::PVM );
		if ( $be <= 0 ) { return null; }
		return round( ( ( $be - $savikaina_be_pvm ) / $be ) * 100, 1 );
	}

	/** Marža eurais nuo vieneto. */
	public static function marza_eur( $kaina_su_pvm, $savikaina_be_pvm ) {
		if ( $kaina_su_pvm === null || $savikaina_be_pvm === null ) { return null; }
		return round( ( $kaina_su_pvm / ( 1 + self::PVM ) ) - $savikaina_be_pvm, 2 );
	}

	/** Kurios grindys taikomos šiai prekei pagal kategoriją. */
	private static function grindys_prekei( $kategorijos ) {
		$g = self::grindys();
		$t = mb_strtolower( implode( ' ', (array) $kategorijos ) );
		if ( mb_strpos( $t, 'saus' ) !== false && mb_strpos( $t, 'maist' ) !== false ) { return (float) $g['sausas-maistas']; }
		if ( mb_strpos( $t, 'konserv' ) !== false ) { return (float) $g['konservai']; }
		if ( mb_strpos( $t, 'skanest' ) !== false ) { return (float) $g['skanestai']; }
		return (float) $g['numatyta'];
	}




	/* ==================== KRŪVOS ==================== */

	/** Ar prekė priklauso pasirinktai krūvai. Viena vieta — naudoja ir eilės, ir filtrai. */
	public static function kruvoje( $r, $kruva ) {
		if ( $r['delist'] ) { return $kruva === 'isimtos' || $kruva === 'visos'; }
		switch ( $kruva ) {
			case 'juodrasciai': return in_array( $r['st'], array( 'draft', 'pending' ), true );
			case 'isimtos':     return false;
			case 'visos':       return true;
			default:            return $r['st'] === 'publish';
		}
	}

	public static function kruvos() {
		return array(
			'prekyboje'   => 'Prekyboje',
			'juodrasciai' => 'Juodraščiai',
			'isimtos'     => 'Išimtos',
			'visos'       => 'Visos',
		);
	}

	/** Kiek prekių kiekvienoje krūvoje — perjungikliui. */
	public static function kruvu_skaiciai( $prekes ) {
		$k = array( 'prekyboje'=>0, 'juodrasciai'=>0, 'isimtos'=>0, 'visos'=>0 );
		foreach ( $prekes as $r ) {
			$k['visos']++;
			if ( $r['delist'] ) { $k['isimtos']++; continue; }
			if ( $r['st'] === 'publish' ) { $k['prekyboje']++; }
			elseif ( in_array( $r['st'], array( 'draft','pending' ), true ) ) { $k['juodrasciai']++; }
		}
		return $k;
	}

	/* ==================== DARBO EILĖS ==================== */

	/**
	 * Eilės rodo TIK prekyboje esančias prekes — juodraščiai neiškreipia skaičių
	 * (TŽ 37.14). Išimtis: Katalogo skiltis, kuri kaip tik jas ir rodo.
	 */
	/**
	 * Eilių skaičiai PASIRINKTAI KRŪVAI. Krūva ir eilė — atskiri matmenys:
	 * ta pati „Be EAN" eilė veikia ir prekyboje, ir juodraščiuose, bet niekada
	 * nemaišo abiejų vienoje krūvoje.
	 */
	/**
	 * v8.4: eilių skaičiai per tą patį sąlygų variklį.
	 *
	 * Anksčiau `eiles()` ir `filtruoti()` turėjo DVI atskiras to paties
	 * dalyko kopijas — todėl kairėje galėjo rodyti vieną skaičių, o
	 * atidarius eilę rasti kitą. Dabar šaltinis vienas.
	 */
	public static function eiles( $prekes, $kruva ) {
		$sal = self::eiliu_salygos();
		$e   = array_fill_keys( array_keys( $sal ), 0 );
		foreach ( $prekes as $r ) {
			if ( ! self::kruvoje( $r, $kruva ) ) { continue; }
			foreach ( $sal as $view => $s ) {
				if ( self::atitinka( $r, $s ) ) { $e[ $view ]++; }
			}
		}
		return $e;
	}

	/**
	 * v5.1: artimiausia galiojimo data KIEKVIENAI prekei — vienu SELECT.
	 *
	 * Imamos tik partijos, kurios dar turi likutį: pasibaigusi data ant
	 * partijos, kurioje nieko nebeliko, yra istorija, ne problema.
	 * FEFO tvarka reiškia, kad pirmiausia išeis būtent artimiausia — todėl
	 * sąrašui rūpi MIN(geriausia_iki), o ne vidurkis.
	 */
	public static function partiju_datos() {
		global $wpdb;
		$t = $wpdb->prefix . 'ps_partijos';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '{$t}'" ) !== $t ) { return array(); }

		$eil = $wpdb->get_results(
			"SELECT product_id,
			        MIN(geriausia_iki) AS data,
			        DATEDIFF(MIN(geriausia_iki), CURDATE()) AS dienu,
			        SUM(kiekis_liko) AS kiekis
			   FROM {$t}
			  WHERE atsaukta = 0 AND kiekis_liko > 0
			    AND geriausia_iki IS NOT NULL AND geriausia_iki <> '0000-00-00'
			  GROUP BY product_id", ARRAY_A );

		$out = array();
		foreach ( $eil as $r ) {
			$out[ (int) $r['product_id'] ] = array(
				'data'   => $r['data'],
				'dienu'  => (int) $r['dienu'],
				'kiekis' => (float) $r['kiekis'],
			);
		}
		return $out;
	}

	/**
	 * v5.2: PUBLIKAVIMO MOMENTAS.
	 *
	 * `post_date` netinka: dev bazeje 1 605 prekes „sukurtos" 2026-06-04 ir dar
	 * 927 — 06-06. Tai migracijos importas, ne publikavimas. Preke gali menesi
	 * gulėti juodrasciuose, todel sukurimo data apie jos gyvenima parduotuveje
	 * nesako nieko.
	 *
	 * Fiksuojame perejima I `publish` ir tik pirma karta: veliau prekei
	 * grizus i juodrascius ir vel isejus, skaitliukas nepersistato — kitaip
	 * uztektu vieno „isimti/grazinti" ir preke vel atrodytu nauja.
	 */
	public static function sekti_publikavima( $nauja, $sena, $post ) {
		if ( ! $post || $post->post_type !== 'product' ) { return; }
		if ( $nauja !== 'publish' || $sena === 'publish' ) { return; }
		if ( get_post_meta( $post->ID, '_ps_publikuota', true ) ) { return; }
		update_post_meta( $post->ID, '_ps_publikuota', current_time( 'mysql' ) );
	}

	/**
	 * Vienkartinis backfill esamoms prekems. Tikslios datos nera ir nebus —
	 * imamas `post_date`. Produkcijoje tai bus migracijos diena, ir tai
	 * TEISINGA: naujoje parduotuveje visos prekes is tikruju publikuojamos
	 * paleidimo diena.
	 */
	public static function backfill_publikavima() {
		global $wpdb;
		if ( get_option( 'ps_publikuota_backfill' ) === 'ok' ) { return 0; }
		$n = $wpdb->query(
			"INSERT INTO {$wpdb->postmeta} (post_id, meta_key, meta_value)
			 SELECT p.ID, '_ps_publikuota', p.post_date
			   FROM {$wpdb->posts} p
			   LEFT JOIN {$wpdb->postmeta} m ON m.post_id=p.ID AND m.meta_key='_ps_publikuota'
			  WHERE p.post_type='product' AND p.post_status='publish' AND m.meta_id IS NULL" );
		update_option( 'ps_publikuota_backfill', 'ok', 'no' );
		return (int) $n;
	}

	/**
	 * Kiek dienu preke NEPARDUODAMA.
	 *
	 * Vienas skaicius vietoj triju atskiru lauku (30/90/365): dienos nuo
	 * PASKUTINIO pardavimo, o jei preke niekada neparduota — nuo
	 * publikavimo. Todel veikia bet kokia riba (60, 90, 180, 360 ar nuo–iki),
	 * o vakar publikuota preke i eile neikrenta savaime — ji dar neturejo
	 * sanso.
	 *
	 * Grazina `null`, jei nezinoma nei viena data — tada eiles klausimas
	 * prekei netaikomas.
	 */
	public static function neparduodama_dienu( $paskutinis, $publikuota ) {
		$dabar = current_time( 'timestamp' );

		/* Pardavimas — stipriausias irodymas: preke juda. */
		if ( $paskutinis && $paskutinis !== '0000-00-00 00:00:00' ) {
			$ts = strtotime( $paskutinis );
			if ( $ts ) { return max( 0, (int) floor( ( $dabar - $ts ) / DAY_IN_SECONDS ) ); }
		}

		/* Nera pardavimo — skaiciuojame nuo tada, kai preke REALIAI galejo
		   buti perkama. Tai velesnis is dvieju: publikavimo ir parduotuves
		   paleidimo. Migracija ne pardavimo diena: prekes i dev'a sukeltos
		   birzeli, o parduotuve atsidaro spali — be sios apsaugos paleidimo
		   diena visas katalogas atrodytu „neparduodamas 120 dienu". */
		$pub = ( $publikuota && $publikuota !== '0000-00-00 00:00:00' ) ? strtotime( $publikuota ) : 0;
		$lch = self::paleidimo_data();

		$nuo = max( (int) $pub, (int) $lch );
		if ( $nuo <= 0 ) { return null; }

		/* Parduotuve dar neatidaryta — klausimas „kodel neparduodama"
		   dar neturi prasmes. */
		if ( $nuo > $dabar ) { return null; }

		return max( 0, (int) floor( ( $dabar - $nuo ) / DAY_IN_SECONDS ) );
	}

	/**
	 * Parduotuves paleidimo data. Kol nenustatyta — 0, ir tada skaiciuojama
	 * tik nuo publikavimo (dev aplinkai to pakanka).
	 */
	public static function paleidimo_data() {
		$d = get_option( 'ps_paleidimo_data' );
		if ( ! $d ) { return 0; }
		$ts = strtotime( $d . ' 00:00:00' );
		return $ts ? $ts : 0;
	}

	/**
	 * v5.2: „neparduodama" riba imama is URL, kad ji islaikytu perkrovima ir
	 * butu galima nusiusti nuoroda. Numatyta 60 d.
	 */
	public static function nepard_riba() {
		$nuo = isset( $_GET['nd'] ) ? (int) $_GET['nd'] : 60;
		$iki = ( isset( $_GET['nd_iki'] ) && $_GET['nd_iki'] !== '' ) ? (int) $_GET['nd_iki'] : null;
		$nuo = max( 1, min( 3650, $nuo ) );
		if ( $iki !== null ) { $iki = max( $nuo, min( 3650, $iki ) ); }
		return array( 'nuo' => $nuo, 'iki' => $iki );
	}

	/** Ribos, po kiek dienų prekė laikoma skubia. Keičiamos nustatymuose. */
	/**
	 * v5.4: ribos imamos is URL, kaip ir „neparduodama" — kad butu galima
	 * persijungti nepaliekant lango ir nusiusti nuoroda kolegai.
	 *
	 * Numatytosios: 30 d. — jau nebeparduosi be nuolaidos; 90 d. — dar spesi,
	 * jei pradesi dabar. Sausam maistui 90 d. yra normalu, sviežiai
	 * produkcijai per ilgai — todel ribos keiciamos, o ne ivestos i koda.
	 */
	public static function gi_ribos() {
		$k = isset( $_GET['gi'] ) ? (int) $_GET['gi'] : 0;
		$a = isset( $_GET['gi_iki'] ) ? (int) $_GET['gi_iki'] : 0;
		if ( $k > 0 || $a > 0 ) {
			$k = $k > 0 ? min( 3650, $k ) : 30;
			$a = $a > 0 ? min( 3650, max( $k, $a ) ) : max( $k, 90 );
			return array( 'kritine' => $k, 'arteja' => $a );
		}
		$n = get_option( 'ps_gi_ribos' );
		if ( is_array( $n ) && isset( $n['kritine'], $n['arteja'] ) ) { return $n; }
		return array( 'kritine' => 30, 'arteja' => 90 );
	}

	private static function pasenes( $sync ) {
		if ( empty( $sync ) || $sync === '0000-00-00 00:00:00' ) { return true; }
		$ts = strtotime( $sync );
		if ( ! $ts ) { return true; }
		return ( current_time( 'timestamp' ) - $ts ) > 24 * 3600;
	}

	/* ==================== FILTRAVIMAS ==================== */


	/* ==================== v8.4 · SĄLYGŲ VARIKLIS ====================
	 *
	 * Iki v8.4 langas turėjo DVI atskiras sistemas: darbo eilės (`view`)
	 * buvo užkoduotos `switch` sakinyje, o filtrai — šeši fiksuoti
	 * palyginimai. Eilė nebuvo išreikšta filtru, todėl jos NEBUVO GALIMA
	 * PATIKSLINTI: „Be savikainos" duodavo 443, bet pasakyti „iš jų tik
	 * tos, kurios turi likutį" buvo neįmanoma.
	 *
	 * Dabar viskas yra sąlyga: laukas + operatorius + reikšmė. Eilė yra
	 * tiesiog iš anksto paruoštas sąlygų rinkinys. Naujas laukas =
	 * viena eilutė registre, ne naujas filtras sąsajoje.
	 *
	 * Jungimas — TIK IR. `turi_av` / `turi_vf` / `turi_zb` esant atskirais
	 * laukais, ARBA poreikis dingsta: „AV arba VF" virsta dviem sąlygom.
	 */


	/* ==================== v8.4 · SĄLYGOS URL EILUTĖJE ====================
	 * Formatas: `laukas~operatorius~reikšmė`, kelios per kabliataškį.
	 * Pvz. `sal=cost~tuscia;av~>~0` — savikaina tuščia IR AV likutis > 0.
	 * Skaitoma akimis, todėl nuorodą galima ir pačiam susikurti. */

	public static function sal_is_teksto( $t ) {
		$t = trim( (string) $t );
		if ( $t === '' ) { return array(); }
		$reg = self::laukai();
		$ops = array( 'tuscia','netuscia','taip','ne','=','!=','>','<','>=','<=','tarp',
			'<lauk','>lauk','vienas_is','ne_vienas_is','turi','neturi','yra','nera','prasideda','skola_yra' );
		$out = array();
		foreach ( explode( ';', $t ) as $d ) {
			$d = trim( $d );
			if ( $d === '' ) { continue; }
			$p = explode( '~', $d );
			$l = isset( $p[0] ) ? trim( $p[0] ) : '';
			$op = isset( $p[1] ) ? trim( $p[1] ) : '';
			if ( ! isset( $reg[ $l ] ) || ! in_array( $op, $ops, true ) ) { continue; }
			$s = array( 'l' => $l, 'op' => $op );
			if ( isset( $p[2] ) ) {
				$r = $p[2];
				if ( $op === 'tarp' || $op === 'vienas_is' || $op === 'ne_vienas_is' ) {
					$s['r'] = array_map( 'trim', explode( ',', $r ) );
				} else {
					$s['r'] = trim( $r );
				}
			}
			$out[] = $s;
		}
		return $out;
	}

	public static function sal_i_teksta( $salygos ) {
		$d = array();
		foreach ( (array) $salygos as $s ) {
			if ( ! isset( $s['l'], $s['op'] ) ) { continue; }
			$x = $s['l'] . '~' . $s['op'];
			if ( array_key_exists( 'r', $s ) ) {
				$x .= '~' . ( is_array( $s['r'] ) ? implode( ',', $s['r'] ) : (string) $s['r'] );
			}
			$d[] = $x;
		}
		return implode( ';', $d );
	}

	/** Sąlygos aprašymas žmogui — plokštelei virš lentelės. */
	public static function sal_zodziais( $s ) {
		$reg = self::laukai();
		$v = isset( $reg[ $s['l'] ]['v'] ) ? $reg[ $s['l'] ]['v'] : $s['l'];
		$r = array_key_exists( 'r', $s ) ? ( is_array( $s['r'] ) ? implode( ', ', $s['r'] ) : (string) $s['r'] ) : '';
		$z = array( 'tuscia' => 'tuščia', 'netuscia' => 'užpildyta', 'taip' => 'taip', 'ne' => 'ne',
			'=' => '=', '!=' => '≠', '>' => '>', '<' => '<', '>=' => '≥', '<=' => '≤',
			'tarp' => 'tarp', '<lauk' => 'mažiau nei', '>lauk' => 'daugiau nei',
			'vienas_is' => 'vienas iš', 'ne_vienas_is' => 'nė vienas iš', 'turi' => 'turi',
			'neturi' => 'neturi', 'yra' => 'yra', 'nera' => 'nėra', 'prasideda' => 'prasideda',
			'skola_yra' => 'trūksta' );
		$op = isset( $z[ $s['op'] ] ) ? $z[ $s['op'] ] : $s['op'];
		if ( $s['op'] === '<lauk' || $s['op'] === '>lauk' ) {
			$r = isset( $reg[ $r ]['v'] ) ? $reg[ $r ]['v'] : $r;
		}
		return trim( $v . ' ' . $op . ' ' . $r );
	}

	/* ==================== v8.4 · IŠSAUGOTI VAIZDAI ====================
	 * Vaizdas = vardas + sąlygos + rikiavimas. Visa lango būsena ir taip
	 * gyvena URL eilutėje, todėl vaizdas yra tik jos pavadinimas.
	 * Penki paruošti ateina kaip pradiniai, bet gyvena toje pačioje
	 * vietoje kaip savi — juos galima pervadinti, keisti ir trinti. */

	const VAIZDU_RAKTAS = 'ps_kat_vaizdai';

	public static function vaizdai_pradiniai() {
		return array(
			array( 'v' => 'Kasdienis', 'sal' => '' ),
			array( 'v' => 'Pinigai',   'sal' => 'cost~netuscia;marza~<lauk~grind' ),
			array( 'v' => 'Likučiai',  'sal' => 'turi_av~taip;dienu~<=~30' ),
			array( 'v' => 'Turinys',   'sal' => 'pbalas~<~100' ),
			array( 'v' => 'Tiekimas',  'sal' => 'pard~<=~0' ),
		);
	}

	public static function vaizdai() {
		$u = get_current_user_id();
		$v = get_user_meta( $u, self::VAIZDU_RAKTAS, true );
		if ( $v === '' || $v === null ) { return self::vaizdai_pradiniai(); }
		return is_array( $v ) ? $v : array();
	}

	public static function vaizdai_irasyti( $sar ) {
		update_user_meta( get_current_user_id(), self::VAIZDU_RAKTAS, array_values( $sar ) );
	}

	/** Vaizdų veiksmai: išsaugoti dabartinį, ištrinti, atstatyti pradinius. */
	public static function vaizdo_veiksmas() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Nepakanka teisių.' ); }
		check_admin_referer( 'ps_kat_vaizdas' );
		$k = isset( $_POST['ka'] ) ? sanitize_key( $_POST['ka'] ) : '';
		$sar = self::vaizdai();
		if ( $k === 'irasyti' ) {
			$v = sanitize_text_field( wp_unslash( isset( $_POST['vardas'] ) ? $_POST['vardas'] : '' ) );
			$sal = sanitize_text_field( wp_unslash( isset( $_POST['sal'] ) ? $_POST['sal'] : '' ) );
			if ( $v !== '' ) {
				$rasta = false;
				foreach ( $sar as $i => $x ) { if ( $x['v'] === $v ) { $sar[ $i ]['sal'] = $sal; $rasta = true; } }
				if ( ! $rasta ) { $sar[] = array( 'v' => $v, 'sal' => $sal ); }
				self::vaizdai_irasyti( $sar );
			}
		} elseif ( $k === 'trinti' ) {
			$v = sanitize_text_field( wp_unslash( isset( $_POST['vardas'] ) ? $_POST['vardas'] : '' ) );
			foreach ( $sar as $i => $x ) { if ( $x['v'] === $v ) { unset( $sar[ $i ] ); } }
			self::vaizdai_irasyti( $sar );
		} elseif ( $k === 'atstatyti' ) {
			delete_user_meta( get_current_user_id(), self::VAIZDU_RAKTAS );
		}
		$grizti = isset( $_POST['_grizti'] ) ? esc_url_raw( wp_unslash( $_POST['_grizti'] ) ) : admin_url( 'admin.php?page=ps-katalogas' );
		wp_safe_redirect( $grizti ); exit;
	}

	/** Laukų registras. Tipas lemia, kokie operatoriai siūlomi sąsajoje. */
	public static function laukai() {
		return array(
			/* tapatybė */
			'n'          => array( 'g' => 'Prekė',    'v' => 'Pavadinimas',        't' => 'tekst' ),
			'sku'        => array( 'g' => 'Prekė',    'v' => 'SKU',                't' => 'tekst' ),
			'ean'        => array( 'g' => 'Prekė',    'v' => 'EAN',                't' => 'tekst' ),
			'ssku'       => array( 'g' => 'Prekė',    'v' => 'Tiekėjo kodas',      't' => 'tekst' ),
			'br'         => array( 'g' => 'Prekė',    'v' => 'Brendas',            't' => 'sar' ),
			'kat'        => array( 'g' => 'Prekė',    'v' => 'Kategorija',         't' => 'mas' ),
			'st'         => array( 'g' => 'Prekė',    'v' => 'Būsena',             't' => 'sar' ),
			'tipas'      => array( 'g' => 'Prekė',    'v' => 'Tipas',              't' => 'sar' ),
			/* vieta ir likučiai */
			'sand'       => array( 'g' => 'Vieta',    'v' => 'Vykdymo sandėlis',   't' => 'sar' ),
			'turi_av'    => array( 'g' => 'Vieta',    'v' => 'Guli AV',            't' => 'log' ),
			'turi_vf'    => array( 'g' => 'Vieta',    'v' => 'Guli VF',            't' => 'log' ),
			'turi_zb'    => array( 'g' => 'Vieta',    'v' => 'Guli ZB',            't' => 'log' ),
			'av'         => array( 'g' => 'Vieta',    'v' => 'AV likutis',         't' => 'sk' ),
			'tiek'       => array( 'g' => 'Vieta',    'v' => 'Tiekėjo likutis',    't' => 'sk' ),
			'pard'       => array( 'g' => 'Vieta',    'v' => 'Parduodama',         't' => 'sk' ),
			'dienu'      => array( 'g' => 'Vieta',    'v' => 'Dienų atsargai',     't' => 'sk' ),
			'nepard'     => array( 'g' => 'Vieta',    'v' => 'Neparduodama d.',    't' => 'sk' ),
			'v30'        => array( 'g' => 'Vieta',    'v' => 'Pardavimai 30 d.',   't' => 'sk' ),
			'abc'        => array( 'g' => 'Vieta',    'v' => 'ABC',                't' => 'sar' ),
			/* pinigai */
			'price'      => array( 'g' => 'Pinigai',  'v' => 'Kaina su PVM',       't' => 'sk' ),
			'cost'       => array( 'g' => 'Pinigai',  'v' => 'Savikaina',          't' => 'sk' ),
			'cost_av'    => array( 'g' => 'Pinigai',  'v' => 'AV savikaina',       't' => 'sk' ),
			'cost_tiek'  => array( 'g' => 'Pinigai',  'v' => 'Tiekėjo savikaina',  't' => 'sk' ),
			'marza'      => array( 'g' => 'Pinigai',  'v' => 'Marža %',            't' => 'sk' ),
			'pmarza'     => array( 'g' => 'Pinigai',  'v' => 'Marža €',            't' => 'sk' ),
			'grind'      => array( 'g' => 'Pinigai',  'v' => 'Maržos riba',        't' => 'sk' ),
			'siul'       => array( 'g' => 'Pinigai',  'v' => 'Siūloma kaina',      't' => 'sk' ),
			'sale'       => array( 'g' => 'Pinigai',  'v' => 'Akcijos kaina',      't' => 'sk' ),
			'lock'       => array( 'g' => 'Pinigai',  'v' => 'Rankinė kaina',      't' => 'log' ),
			/* turinys */
			'foto'       => array( 'g' => 'Turinys',  'v' => 'Turi nuotrauką',     't' => 'log' ),
			'apras'      => array( 'g' => 'Turinys',  'v' => 'Turi aprašymą',      't' => 'log' ),
			'pbalas'     => array( 'g' => 'Turinys',  'v' => 'Pilnumas %',         't' => 'sk' ),
			'skola'      => array( 'g' => 'Turinys',  'v' => 'Duomenų skola',      't' => 'sar' ),
			/* kita */
			'gid'        => array( 'g' => 'Kita',     'v' => 'Dienų iki geriausia iki', 't' => 'sk' ),
			'gikiek'     => array( 'g' => 'Kita',     'v' => 'Partijos kiekis',    't' => 'sk' ),
			'nesalt'     => array( 'g' => 'Kita',     'v' => 'Be šaltinio',        't' => 'log' ),
			'delist'     => array( 'g' => 'Kita',     'v' => 'Išimta',             't' => 'log' ),
			'sync_pasenes' => array( 'g' => 'Kita',   'v' => 'Sinchronizacija pasenusi', 't' => 'log' ),
			'upd'        => array( 'g' => 'Kita',     'v' => 'Atnaujinta',         't' => 'data' ),
		);
	}

	/** Lauko reikšmė. Keli laukai skaičiuojami, ne saugomi. */
	private static function lauko_reiksme( $r, $l ) {
		if ( $l === 'sync_pasenes' ) {
			return in_array( $r['sand'], array( 'vf', 'zb' ), true ) && self::pasenes( $r['sync'] );
		}
		if ( $l === 'skola' ) { return isset( $r['pkodai'] ) ? $r['pkodai'] : ''; }
		return array_key_exists( $l, $r ) ? $r[ $l ] : null;
	}

	private static function tuscia( $v ) {
		if ( $v === null ) { return true; }
		if ( is_array( $v ) ) { return count( $v ) === 0; }
		if ( is_bool( $v ) ) { return false; }
		return trim( (string) $v ) === '';
	}

	/** Viena sąlyga: array( 'l' => laukas, 'op' => operatorius, 'r' => reikšmė ) */
	public static function salyga( $r, $s ) {
		$l  = isset( $s['l'] ) ? $s['l'] : '';
		$op = isset( $s['op'] ) ? $s['op'] : '';
		$a  = array_key_exists( 'r', $s ) ? $s['r'] : null;
		$v  = self::lauko_reiksme( $r, $l );

		switch ( $op ) {
			case 'tuscia':    return self::tuscia( $v );
			case 'netuscia':  return ! self::tuscia( $v );
			case 'taip':      return (bool) $v === true;
			case 'ne':        return (bool) $v === false;

			case '=':   if ( self::tuscia( $v ) ) { return false; }
			            return is_numeric( $v ) && is_numeric( $a )
			                 ? (float) $v == (float) $a : (string) $v === (string) $a;
			case '!=':  return ! self::salyga( $r, array( 'l' => $l, 'op' => '=', 'r' => $a ) );
			case '>':   return ! self::tuscia( $v ) && (float) $v >  (float) $a;
			case '<':   return ! self::tuscia( $v ) && (float) $v <  (float) $a;
			case '>=':  return ! self::tuscia( $v ) && (float) $v >= (float) $a;
			case '<=':  return ! self::tuscia( $v ) && (float) $v <= (float) $a;
			case 'tarp': return ! self::tuscia( $v ) && is_array( $a )
			                 && (float) $v >= (float) $a[0] && (float) $v <= (float) $a[1];

			/* palyginimas su KITU lauku — „marža žemiau savo kategorijos ribos" */
			case '<lauk': $b = self::lauko_reiksme( $r, (string) $a );
			              return ! self::tuscia( $v ) && ! self::tuscia( $b ) && (float) $v <  (float) $b;
			case '>lauk': $b = self::lauko_reiksme( $r, (string) $a );
			              return ! self::tuscia( $v ) && ! self::tuscia( $b ) && (float) $v >  (float) $b;

			case 'vienas_is':     return ! self::tuscia( $v )
			                        && in_array( (string) $v, array_map( 'strval', (array) $a ), true );
			case 'ne_vienas_is':  return self::tuscia( $v )
			                        || ! in_array( (string) $v, array_map( 'strval', (array) $a ), true );

			case 'turi':    return is_array( $v ) && in_array( $a, $v, true );
			case 'neturi':  return ! ( is_array( $v ) && in_array( $a, $v, true ) );

			case 'yra':     return ! self::tuscia( $v )
			                    && mb_strpos( mb_strtolower( (string) $v ), mb_strtolower( (string) $a ) ) !== false;
			case 'nera':    return ! self::salyga( $r, array( 'l' => $l, 'op' => 'yra', 'r' => $a ) );
			case 'prasideda': return ! self::tuscia( $v )
			                    && mb_strpos( mb_strtolower( (string) $v ), mb_strtolower( (string) $a ) ) === 0;

			/* skolos žyma: pkodai laiko „|raktas|raktas|" */
			case 'skola_yra': return ! self::tuscia( $v )
			                    && strpos( (string) $v, '|' . $a . '|' ) !== false;

			default: return true;
		}
	}

	/** Visos sąlygos — IR. Tuščias rinkinys praleidžia viską. */
	public static function atitinka( $r, $salygos ) {
		if ( ! is_array( $salygos ) || ! $salygos ) { return true; }
		foreach ( $salygos as $s ) {
			if ( ! is_array( $s ) || ! isset( $s['l'] ) ) { continue; }
			if ( ! self::salyga( $r, $s ) ) { return false; }
		}
		return true;
	}

	/**
	 * Darbo eilės kaip sąlygų rinkiniai.
	 *
	 * Perrašyta 1:1 pagal senąjį `switch` — kontrolinė patikra reikalauja,
	 * kad kiekvienos eilės skaičius nepasikeistų nė vienetu.
	 */
	public static function eiliu_salygos() {
		$nd = self::nepard_riba();
		$gr = self::gi_ribos();
		$sk = array( 'sk_savikaina' => 'savikaina', 'sk_serimo_lentele' => 'serimo_lentele',
			'sk_analitines' => 'analitines', 'sk_sudetis' => 'sudetis',
			'sk_serimo_instr' => 'serimo_instr', 'sk_aprasymas' => 'aprasymas',
			'sk_pakuotes_dydis' => 'pakuotes_dydis', 'sk_gyvuno_rusis' => 'gyvuno_rusis' );

		$e = array(
			'visos_kruvoje' => array(),
			'be_savikainos' => array( array( 'l' => 'cost', 'op' => 'tuscia' ) ),
			'zemiau_ribos'  => array( array( 'l' => 'marza', 'op' => 'netuscia' ),
			                          array( 'l' => 'marza', 'op' => '<lauk', 'r' => 'grind' ) ),
			'uzsakyti'      => array( array( 'l' => 'pard', 'op' => '<=', 'r' => 0 ) ),
			'av_pasibaige'  => array( array( 'l' => 'av', 'op' => 'netuscia' ),
			                          array( 'l' => 'av', 'op' => '=', 'r' => 0 ) ),
			'pr_foto'       => array( array( 'l' => 'foto', 'op' => 'ne' ) ),
			'pr_apras'      => array( array( 'l' => 'apras', 'op' => 'ne' ) ),
			'pr_ean'        => array( array( 'l' => 'ean', 'op' => 'tuscia' ) ),
			'pr_sync'       => array( array( 'l' => 'sync_pasenes', 'op' => 'taip' ) ),
			'be_saltinio'   => array( array( 'l' => 'nesalt', 'op' => 'taip' ) ),
			'baigiasi'      => array( array( 'l' => 'dienu', 'op' => 'netuscia' ),
			                          array( 'l' => 'dienu', 'op' => '<=', 'r' => 14 ) ),
			'negyvos'       => array( array( 'l' => 'sand', 'op' => '=', 'r' => 'av' ),
			                          array( 'l' => 'av', 'op' => '>', 'r' => 0 ),
			                          array( 'l' => 'nepard', 'op' => 'netuscia' ),
			                          array( 'l' => 'nepard', 'op' => '>=', 'r' => $nd['nuo'] ) ),
			'skolos'        => array( array( 'l' => 'pbalas', 'op' => 'netuscia' ),
			                          array( 'l' => 'pbalas', 'op' => '<', 'r' => 100 ),
			                          array( 'l' => 'st', 'op' => '=', 'r' => 'publish' ) ),
			'gi_pasibaige'  => array( array( 'l' => 'gid', 'op' => 'netuscia' ),
			                          array( 'l' => 'gid', 'op' => '<', 'r' => 0 ) ),
			'gi_kritine'    => array( array( 'l' => 'gid', 'op' => '>=', 'r' => 0 ),
			                          array( 'l' => 'gid', 'op' => '<=', 'r' => $gr['kritine'] ) ),
			'gi_arteja'     => array( array( 'l' => 'gid', 'op' => '>', 'r' => $gr['kritine'] ),
			                          array( 'l' => 'gid', 'op' => '<=', 'r' => $gr['arteja'] ) ),
		);
		if ( $nd['iki'] !== null ) {
			$e['negyvos'][] = array( 'l' => 'nepard', 'op' => '<=', 'r' => $nd['iki'] );
		}
		foreach ( $sk as $view => $raktas ) {
			$e[ $view ] = array(
				array( 'l' => 'st', 'op' => '=', 'r' => 'publish' ),
				array( 'l' => 'skola', 'op' => 'skola_yra', 'r' => $raktas ),
			);
		}
		return $e;
	}

	/** Seni URL filtrai -> sąlygos. Kad esamos nuorodos ir eilės veiktų. */
	public static function senas_i_salygas( $f ) {
		$s = array();
		if ( ! empty( $f['sand'] ) )  { $s[] = array( 'l' => 'sand',  'op' => '=', 'r' => strtolower( $f['sand'] ) ); }
		if ( ! empty( $f['brand'] ) ) { $s[] = array( 'l' => 'br',    'op' => '=', 'r' => $f['brand'] ); }
		if ( ! empty( $f['kat'] ) )   { $s[] = array( 'l' => 'kat',   'op' => 'turi', 'r' => $f['kat'] ); }
		if ( ! empty( $f['tipas'] ) ) { $s[] = array( 'l' => 'tipas', 'op' => '=', 'r' => $f['tipas'] ); }

		if ( ! empty( $f['likutis'] ) ) {
			switch ( $f['likutis'] ) {
				case 'av_turi':  $s[] = array( 'l' => 'av', 'op' => '>', 'r' => 0 ); break;
				case 'av_nulis': $s[] = array( 'l' => 'av', 'op' => 'netuscia' );
				                 $s[] = array( 'l' => 'av', 'op' => '=', 'r' => 0 ); break;
				case 'tiekejas': $s[] = array( 'l' => 'av', 'op' => '<=', 'r' => 0 );
				                 $s[] = array( 'l' => 'tiek', 'op' => '>', 'r' => 0 ); break;
				case 'niekas':   $s[] = array( 'l' => 'pard', 'op' => '<=', 'r' => 0 ); break;
			}
		}
		if ( ! empty( $f['marza'] ) ) {
			switch ( $f['marza'] ) {
				case 'nera': $s[] = array( 'l' => 'marza', 'op' => 'tuscia' ); break;
				case 'zem':  $s[] = array( 'l' => 'marza', 'op' => 'netuscia' );
				             $s[] = array( 'l' => 'marza', 'op' => '<lauk', 'r' => 'grind' ); break;
				case 'lt10': $s[] = array( 'l' => 'marza', 'op' => '<', 'r' => 10 ); break;
				case 'lt20': $s[] = array( 'l' => 'marza', 'op' => '<', 'r' => 20 ); break;
				case 'lt30': $s[] = array( 'l' => 'marza', 'op' => '<', 'r' => 30 ); break;
				case 'gt40': $s[] = array( 'l' => 'marza', 'op' => '>', 'r' => 40 ); break;
			}
		}
		return $s;
	}

	/**
	 * v8.4: filtravimas per sąlygų variklį.
	 *
	 * Trys sluoksniai lieka tie patys, bet 2 ir 3 dabar yra sąlygos:
	 *   1) KRŪVA        — `kruvoje()`, nepaliesta
	 *   2) EILĖ         — `eiliu_salygos()[ view ]`
	 *   3) FILTRAI      — seni URL parametrai + laisvos sąlygos iš `$f['s']`
	 *
	 * `$f['s']` yra naujas: laisvas sąlygų masyvas. Jei jo nėra, elgesys
	 * identiškas senajam — todėl visos esamos nuorodos veikia toliau.
	 */
	public static function filtruoti( $prekes, $f ) {
		$eiles = self::eiliu_salygos();
		$view  = isset( $f['view'] ) ? $f['view'] : 'visos_kruvoje';
		$se    = isset( $eiles[ $view ] ) ? $eiles[ $view ] : array();
		$sf    = self::senas_i_salygas( $f );
		$sl    = ( isset( $f['s'] ) && is_array( $f['s'] ) ) ? $f['s'] : array();
		$visos = array_merge( $se, $sf, $sl );

		$q = isset( $f['q'] ) ? trim( (string) $f['q'] ) : '';
		if ( $q !== '' ) { $q = mb_strtolower( $q ); }

		$out = array();
		foreach ( $prekes as $r ) {
			if ( ! self::kruvoje( $r, $f['kruva'] ) ) { continue; }
			if ( ! self::atitinka( $r, $visos ) ) { continue; }
			if ( $q !== '' ) {
				$h = mb_strtolower( $r['n'] . ' ' . $r['sku'] . ' ' . $r['ean'] . ' ' . $r['ssku'] . ' ' . $r['br'] );
				if ( mb_strpos( $h, $q ) === false ) { continue; }
			}
			$out[] = $r;
		}
		return $out;
	}

	/** Brendų ir kategorijų sąrašai TIK iš krūvos — kad nesiūlytų to, ko ten nėra. */
	public static function sarasai( $prekes, $kruva ) {
		$br = array(); $kt = array();
		foreach ( $prekes as $r ) {
			if ( ! self::kruvoje( $r, $kruva ) ) { continue; }
			if ( $r['br'] !== '' ) { $br[ $r['br'] ] = true; }
			foreach ( $r['kat'] as $k ) { $kt[ $k ] = true; }
		}
		$br = array_keys( $br ); $kt = array_keys( $kt );
		sort( $br ); sort( $kt );
		return array( 'brendai' => $br, 'kategorijos' => $kt );
	}

	public static function rikiuoti( $prekes, $laukas, $kryptis ) {
		$k = ( $kryptis === 'desc' ) ? -1 : 1;
		usort( $prekes, function ( $a, $b ) use ( $laukas, $k ) {
			$x = isset( $a[ $laukas ] ) ? $a[ $laukas ] : null;
			$y = isset( $b[ $laukas ] ) ? $b[ $laukas ] : null;
			if ( $x === null && $y === null ) { return 0; }
			if ( $x === null ) { return 1; }   // tuščios visada gale
			if ( $y === null ) { return -1; }
			if ( is_numeric( $x ) && is_numeric( $y ) ) {
				return ( $x == $y ) ? 0 : ( ( $x < $y ) ? -$k : $k );
			}
			return $k * strcasecmp( (string) $x, (string) $y );
		} );
		return $prekes;
	}

	/* ==================== FINANSINĖ SUVESTINĖ ==================== */

	/**
	 * TIK AV atsargos. Tiekėjų likučiai NEPATENKA — tai ne įmonės turtas
	 * (TŽ 37.8; maketo v6 klaida rodė 42 162 € vietoj 292 €).
	 */
	public static function suvestine( $prekes ) {
		$s = array( 'av_savikaina' => 0.0, 'av_mazmenine' => 0.0, 'su_savikaina' => 0, 'be_savikainos' => 0,
			'vnt' => 0, 'marza_svertine' => null, 'potenciali' => 0.0 );
		$sv_suma = 0.0; $sv_marza = 0.0;
		foreach ( $prekes as $r ) {
			$av = (int) $r['av'];
			if ( $av <= 0 ) { continue; }
			$s['vnt'] += $av;
			if ( $r['cost'] !== null ) {
				$verte = $av * (float) $r['cost'];
				$s['av_savikaina'] += $verte;
				$s['su_savikaina']++;
				if ( $r['marza'] !== null ) {
					$sv_suma += $verte; $sv_marza += $verte * $r['marza'];
					$s['potenciali'] += $av * (float) self::marza_eur( $r['price'], $r['cost'] );
				}
			} else {
				$s['be_savikainos']++;
			}
			if ( $r['price'] !== null ) { $s['av_mazmenine'] += $av * (float) $r['price']; }
		}
		$s['av_savikaina']  = round( $s['av_savikaina'], 2 );
		$s['av_mazmenine']  = round( $s['av_mazmenine'], 2 );
		$s['potenciali']    = round( $s['potenciali'], 2 );
		$s['marza_svertine']= $sv_suma > 0 ? round( $sv_marza / $sv_suma, 1 ) : null;
		$s['padengimas']    = ( $s['su_savikaina'] + $s['be_savikainos'] ) > 0
			? round( $s['su_savikaina'] / ( $s['su_savikaina'] + $s['be_savikainos'] ) * 100 ) : 0;
		return $s;
	}

	/* ==================== EKRANAS ==================== */

	public static function puslapis() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Nepakanka teisių.' ); }

		if ( isset( $_GET['atnaujinti'] ) ) { delete_transient( 'ps_kat_duomenys' ); }

		$d      = self::surinkti();
		$prekes = $d['prekes'];

		$kruva  = isset( $_GET['kruva'] ) ? sanitize_key( $_GET['kruva'] ) : 'prekyboje';
		if ( ! isset( self::kruvos()[ $kruva ] ) ) { $kruva = 'prekyboje'; }
		$kruvu  = self::kruvu_skaiciai( $prekes );
		$eiles  = self::eiles( $prekes, $kruva );
		$sar    = self::sarasai( $prekes, $kruva );

		$f = array(
			'kruva'   => $kruva,
			'view'    => isset( $_GET['view'] ) ? sanitize_key( $_GET['view'] ) : 'visos_kruvoje',
			'sand'    => isset( $_GET['sand'] ) ? sanitize_text_field( wp_unslash( $_GET['sand'] ) ) : '',
			'kat'     => isset( $_GET['kat'] ) ? sanitize_text_field( wp_unslash( $_GET['kat'] ) ) : '',
			'brand'   => isset( $_GET['brand'] ) ? sanitize_text_field( wp_unslash( $_GET['brand'] ) ) : '',
			'likutis' => isset( $_GET['likutis'] ) ? sanitize_key( $_GET['likutis'] ) : '',
			'marza'   => isset( $_GET['marza'] ) ? sanitize_key( $_GET['marza'] ) : '',
			'tipas'   => isset( $_GET['tipas'] ) ? sanitize_key( $_GET['tipas'] ) : '',
			'q'       => isset( $_GET['q'] ) ? sanitize_text_field( wp_unslash( $_GET['q'] ) ) : '',
			/* v8.4: laisvos sąlygos iš URL. */
			'sal'     => isset( $_GET['sal'] ) ? sanitize_text_field( wp_unslash( $_GET['sal'] ) ) : '',
		);
		$f['s'] = self::sal_is_teksto( $f['sal'] );
		$sort  = isset( $_GET['sort'] ) ? sanitize_key( $_GET['sort'] ) : 'n';
		$kryp  = ( isset( $_GET['kryp'] ) && $_GET['kryp'] === 'desc' ) ? 'desc' : 'asc';
		$per   = isset( $_GET['per'] ) ? max( 25, min( 200, (int) $_GET['per'] ) ) : self::PUSLAPIS;
		$psl   = isset( $_GET['psl'] ) ? max( 1, (int) $_GET['psl'] ) : 1;

		$rasta = self::filtruoti( $prekes, $f );
		$rasta = self::rikiuoti( $rasta, $sort, $kryp );
		$suv   = self::suvestine( $rasta );

		$viso  = count( $rasta );
		$psl_n = max( 1, (int) ceil( $viso / $per ) );
		if ( $psl > $psl_n ) { $psl = $psl_n; }
		$lapas = array_slice( $rasta, ( $psl - 1 ) * $per, $per );

		/* v4.1: WordPress rengykle. Be jos aprasymo laukas rode HTML, ir
		   gramatines klaidos taisymas tarp <td> zymu buvo neimanomas. */
		if ( function_exists( 'wp_enqueue_editor' ) ) { wp_enqueue_editor(); }
		wp_enqueue_media();

		self::stilius();
		self::stilius_v29();
		self::stilius_v33();
		self::stilius_v34();
		self::stilius_v37();
		self::virsus( $f, $d );
		self::kruvu_juosta( $kruvu, $f );
		echo '<div class="pskat-layout">';
		self::rail( $eiles, $f );
		echo '<main class="pskat-main">';
		self::filtrai( $f, $sar, $sort, $kryp, $per );
		self::redagavimo_juosta();
		self::laikotarpio_juosta( $f );
		self::galiojimo_juosta( $f );
		self::lentele( $lapas, $sort, $kryp, $f );
		/* v3.3: suvestine nusileido PO lentele (maketas v18). Virsuje ji
		   atimdavo pirma ekrana is to, del ko langas ir atidaromas — preku. */
		self::suvestine_juosta( $suv, $viso );
		self::puslapiavimas( $psl, $psl_n, $viso, $per, $f, $sort, $kryp );
		echo '</main>';
		echo '<aside class="pskat-kort" id="pskat-kort" hidden>
			<div class="kort-juosta">
				<span class="kort-nav"><button class="k-prev" title="Ankstesnė (k)">←</button>
				<button class="k-next" title="Kita (j)">→</button></span>
				<span class="kort-veiksmai">
					<button class="kort-vm">Veiksmai ▾</button>
					<span class="kort-meniu" hidden>
						<button data-v="draft">Į juodraščius</button>
						<button data-v="publish">Grąžinti į prekybą</button>
						<button data-v="trash">Į šiukšlinę</button>
						<button data-v="delete" class="pav">Ištrinti visiškai…</button>
					</span>
				</span>
				<button class="kort-x" title="Uždaryti (Esc)">×</button>
			</div>
			<div class="kort-turinys"><div class="kort-kraunasi">Kraunama…</div></div>
		</aside>';
		/* v4.8: uždarymo klausimas — trys pasirinkimai, ne du. */
		echo '<div class="ps-klausimas" id="ps-klausimas" hidden><div class="lg">
			<h3>Išsaugoti pakeitimus?</h3>
			<p>Kortelėje yra pakeistų, bet dar neįrašytų laukų.</p>
			<div class="laukai"></div>
			<div class="myg">
				<button type="button" class="k-grizti">Grįžti į kortelę</button>
				<button type="button" class="k-prarasti">Uždaryti neišsaugojus</button>
				<button type="button" class="k-irasyti">Išsaugoti ir uždaryti</button>
			</div>
		</div></div>';
		echo '</div>';
		self::skriptas();
		self::skriptas_v35();
	}

	private static function url( $pakeitimai = array() ) {
		$b = array( 'page' => 'ps-katalogas' );
		foreach ( array( 'kruva','view','sand','kat','brand','likutis','marza','tipas','q','sal','vaizdas','sort','kryp','per','psl' ) as $k ) {
			if ( isset( $_GET[ $k ] ) && $_GET[ $k ] !== '' ) { $b[ $k ] = sanitize_text_field( wp_unslash( $_GET[ $k ] ) ); }
		}
		foreach ( $pakeitimai as $k => $v ) {
			if ( $v === null || $v === '' ) { unset( $b[ $k ] ); } else { $b[ $k ] = $v; }
		}
		return esc_url( admin_url( 'admin.php?' . http_build_query( $b ) ) );
	}

	/**
	 * v5.0: VIENINGA NAVIGACIJA visiems Petshop langams.
	 *
	 * Iki siol kiekvienas langas turejo savo juosta: kataloge nebuvo nei
	 * Akciju, nei Gavimo, akciju lange nebuvo Gavimo, o Gavime — tik
	 * „Katalogas". Zmogus, atsidures viename lange, nematydavo kelio i kitus.
	 * Vienas sarasas — viena vieta, kur ji keisti.
	 */
	public static function navigacija( $dabartinis = '' ) {
		$langai = array(
			'ps-katalogas' => 'Katalogas',
			'ps-akcijos'   => 'Akcijos',
			'ps-gavimas'   => 'Gavimas',
			'ps-tiekimas'  => 'Tiekimas',
			'ps-rinkiniai' => 'Rinkiniai',
			'ps-desk'      => 'Užsakymai',
		);
		$out = '';
		foreach ( $langai as $slug => $vardas ) {
			$out .= '<a class="' . ( $slug === $dabartinis ? 'on' : '' ) . '" href="'
				. esc_url( admin_url( 'admin.php?page=' . $slug ) ) . '">' . esc_html( $vardas ) . '</a>';
		}
		return $out;
	}

	private static function virsus( $f, $d ) {
		$laikas = esc_html( $d['laikas'] );
		echo '<div class="pskat-bar">
			<div class="pskat-logo">PETSHOP</div>
			<nav class="pskat-nav">' . self::navigacija( 'ps-katalogas' ) . '</nav>
			<form class="pskat-search" method="get">
				<input type="hidden" name="page" value="ps-katalogas">
				<input type="hidden" name="kruva" value="' . esc_attr( $f['kruva'] ) . '">
				<input type="hidden" name="view" value="' . esc_attr( $f['view'] ) . '">
				<span class="lupa" aria-hidden="true">🔍</span>
				<input type="search" name="q" value="' . esc_attr( $f['q'] ) . '" autocomplete="off" placeholder="Ieškoti: pavadinimas, SKU, EAN, tiekėjo kodas…">'
				. ( $f['q'] !== '' ? '<a class="isvalyti" href="' . self::url( array( 'q' => null, 'psl' => null ) ) . '" title="Išvalyti paiešką">×</a>' : '' ) . '
			</form>
			<div class="pskat-meta">Duomenys ' . $laikas . ' · <a href="' . self::url( array( 'atnaujinti' => '1' ) ) . '">atnaujinti</a></div>
		</div>';
	}

	/** Krūvos perjungiklis — kurioje krūvoje dirbu. Galioja VISOMS eilėms. */
	private static function kruvu_juosta( $k, $f ) {
		echo '<div class="pskat-kruvos"><span class="et">Dirbu su:</span>';
		foreach ( self::kruvos() as $id => $vardas ) {
			if ( $id === 'isimtos' && (int) $k['isimtos'] === 0 ) { continue; }
			$on = ( $f['kruva'] === $id ) ? ' on' : '';
			echo '<a class="k' . $on . '" href="' . self::url( array( 'kruva' => $id, 'psl' => null, 'brand' => null, 'kat' => null ) ) . '">'
				. esc_html( $vardas ) . '<span class="n">' . (int) $k[ $id ] . '</span></a>';
		}
		echo '<span class="paaisk">Eilės kairėje skaičiuoja tik pasirinktą krūvą</span></div>';
	}

	private static function rail( $e, $f ) {
		$g = function ( $view, $tekstas, $n, $klase = '' ) use ( $f ) {
			$on = ( $f['view'] === $view ) ? ' on' : '';
			$nk = ( (int) $n === 0 ) ? ' nula' : '';
			echo '<a class="pskat-view' . $on . '" href="' . self::url( array( 'view' => $view, 'psl' => null ) ) . '">'
				. esc_html( $tekstas ) . '<span class="n ' . esc_attr( $klase ) . $nk . '">' . (int) $n . '</span></a>';
		};
		$kv = self::kruvos();
		echo '<nav class="pskat-rail">';
		echo '<h3>' . esc_html( $kv[ $f['kruva'] ] ) . '</h3>';
		$g( 'visos_kruvoje', 'Visos', $e['visos_kruvoje'] );
		echo '<h3>Pinigai</h3>';
		$g( 'zemiau_ribos', 'Žemiau maržos ribos', $e['zemiau_ribos'], 'bad' );
		$g( 'be_savikainos', 'Be savikainos', $e['be_savikainos'], 'warn' );
		echo '<h3>Tiekėjas</h3>';
		$g( 'uzsakyti', 'Reikia užsakyti', $e['uzsakyti'], 'warn' );
		$g( 'av_pasibaige', 'AV pasibaigę', $e['av_pasibaige'], 'warn' );
		$g( 'baigiasi', 'Baigiasi greičiau nei tiekiama', $e['baigiasi'], 'bad' );
		/* v5.2: „Negyvos atsargos" pervadinta. Terminas buvo pazodinis vertimas
		   is „dead stock" ir lietuviskai skambejo kaip kapines; be to,
		   nesake, KA jis matuoja. */
		$ndr = self::nepard_riba();
		$g( 'negyvos', 'Neparduodama ' . ( $ndr['iki'] !== null
			? $ndr['nuo'] . '–' . $ndr['iki'] . ' d.' : '≥ ' . $ndr['nuo'] . ' d.' ), $e['negyvos'], 'warn' );

		/* v5.2: GALIOJIMAS — atskira grupe. Prekiu JUDEJIMAS (kiek laiko
		   neparduodama) ir GALIOJIMAS (geriausia iki) yra du skirtingi
		   klausimai su skirtingais saltiniais ir skirtingais sprendimais;
		   vienoje kruvoje jie tik maiso vienas kita. */
		echo '<h3>Galiojimas</h3>';
		$gir = self::gi_ribos();
		$g( 'gi_pasibaige', 'Pasibaigę', $e['gi_pasibaige'], 'bad' );
		$g( 'gi_kritine', 'Geriausia iki ≤ ' . (int) $gir['kritine'] . ' d.', $e['gi_kritine'], 'bad' );
		$g( 'gi_arteja', (int) $gir['kritine'] . '–' . (int) $gir['arteja'] . ' d.', $e['gi_arteja'], 'warn' );
		echo '<h3>Tvarkyti</h3>';
		$g( 'skolos', 'Visos duomenų skolos', $e['skolos'], 'warn' );
		/* v5.6: „Duomenų skolos 1 960" nesako, ką daryti. Konkrečios eilės —
		   atsidarai, sutvarkai, prekė iš eilės dingsta.
		   Savikaina, EAN ir nuotrauka čia NEKARTOJAMOS: jos jau turi savo
		   eiles aukščiau, o du to paties pavadinimo punktai skirtingais
		   skaičiais klaidina labiau nei vienas. */
		$g( 'pr_foto', 'Be nuotraukos', $e['pr_foto'], 'bad' );
		$g( 'pr_ean', 'Be EAN', $e['pr_ean'], 'bad' );
		$g( 'sk_aprasymas', 'Be aprašymo', $e['sk_aprasymas'], 'warn' );
		$g( 'sk_sudetis', 'Be sudėties', $e['sk_sudetis'], 'warn' );
		$g( 'sk_analitines', 'Be analitinių dalių', $e['sk_analitines'], 'warn' );
		$g( 'sk_serimo_lentele', 'Be šėrimo lentelės', $e['sk_serimo_lentele'], 'warn' );
		$g( 'sk_serimo_instr', 'Be šėrimo instrukcijos', $e['sk_serimo_instr'], 'warn' );
		$g( 'sk_pakuotes_dydis', 'Be pakuotės dydžio', $e['sk_pakuotes_dydis'], 'warn' );
		$g( 'sk_gyvuno_rusis', 'Be gyvūno rūšies', $e['sk_gyvuno_rusis'], 'warn' );
		$g( 'pr_sync', 'Negaunama iš tiekėjo', $e['pr_sync'], 'bad' );
		$g( 'be_saltinio', 'Be šaltinio registre', $e['be_saltinio'], 'bad' );
		echo '</nav>';
	}

	/**
	 * Ilgas sąrašas (brendai, kategorijos) — įvedimo laukas su paieška.
	 * Su 109 brendais slinkti sąrašu neįmanoma; datalist leidžia rašyti.
	 */
	private static function sel_paieska( $vardas, $etikete, $reiksmes, $dabar ) {
		$id = 'ps-l-' . $vardas;
		echo '<span class="ax">' . esc_html( $etikete ) . '</span>';
		echo '<span class="ieskolaukas">';
		echo '<input type="text" data-f="' . esc_attr( $vardas ) . '" list="' . esc_attr( $id ) . '"'
			. ' value="' . esc_attr( $dabar ) . '" placeholder="visi · rašyk ieškant" autocomplete="off">';
		if ( $dabar !== '' ) {
			echo '<a class="x" title="Išvalyti" href="' . self::url( array( $vardas => null, 'psl' => null ) ) . '">×</a>';
		}
		echo '</span>';
		echo '<datalist id="' . esc_attr( $id ) . '">';
		foreach ( $reiksmes as $v ) { echo '<option value="' . esc_attr( $v ) . '"></option>'; }
		echo '</datalist>';
	}

	private static function sel( $vardas, $etikete, $reiksmes, $dabar ) {
		echo '<span class="ax">' . esc_html( $etikete ) . '</span><select data-f="' . esc_attr( $vardas ) . '">';
		foreach ( $reiksmes as $v => $t ) {
			echo '<option value="' . esc_attr( $v ) . '"' . selected( (string) $dabar, (string) $v, false ) . '>' . esc_html( $t ) . '</option>';
		}
		echo '</select>';
	}

	private static function filtrai( $f, $sar, $sort, $kryp, $per ) {
		$sand = array( '' => 'visi', 'av' => 'AV', 'vf' => 'VF', 'zb' => 'ZB', 'quattro' => 'Quattro',
			'belcor_tofu' => 'Belacor tofu', 'prins' => 'Prins', 'ambrosia' => 'Ambrosia' );
		/* v8.6.4: JUNGIKLIS — vienas, su užrašu, VISADA toje pačioje vietoje.
		   v8.6.2 jis buvo 12 px ženkliukas dešiniame kampe, dar ir ant
		   „Išvalyti filtrus" užlipęs. Valdiklis, kurio reikia ieškoti, nėra
		   valdiklis. */
		$sal_t0 = isset( $f['sal'] ) ? (string) $f['sal'] : '';
		$sal0   = self::sal_is_teksto( $sal_t0 );
		$akt = array();
		if ( ! empty( $f['sand'] ) )    { $akt[] = 'tiekėjas: ' . $f['sand']; }
		if ( ! empty( $f['kat'] ) )     { $akt[] = 'kategorija: ' . $f['kat']; }
		if ( ! empty( $f['brand'] ) )   { $akt[] = 'brendas: ' . $f['brand']; }
		if ( ! empty( $f['likutis'] ) ) { $akt[] = 'likutis: ' . $f['likutis']; }
		if ( ! empty( $f['marza'] ) )   { $akt[] = 'marža: ' . $f['marza']; }
		if ( ! empty( $f['tipas'] ) )   { $akt[] = 'tipas: ' . $f['tipas']; }
		foreach ( $sal0 as $x ) { $akt[] = self::sal_zodziais( $x ); }

		echo '<div class="pskat-filters" id="pskat-filters">';
		echo '<div class="frline frl-sant">';
		echo '<button type="button" class="fr-jung" id="fr-jung">'
			. '<span class="rod">▸</span> Filtrai<span class="kiek">' . ( $akt ? ' · ' . count( $akt ) : '' ) . '</span></button>';
		if ( $akt ) {
			foreach ( $akt as $a ) { echo '<span class="sal-p sal-r">' . esc_html( $a ) . '</span>'; }
			echo '<a class="clear" href="' . self::url( array( 'sand'=>null,'kat'=>null,'brand'=>null,'likutis'=>null,'marza'=>null,'tipas'=>null,'q'=>null,'sal'=>null,'psl'=>null ) ) . '">Išvalyti</a>';
		} else {
			echo '<span class="sal-tuscia">filtrų nėra — visos krūvos prekės</span>';
		}
		echo '</div>';

		echo '<div class="frline frl-1">';
		self::sel( 'sand', 'Tiekėjas', $sand, $f['sand'] );
		echo '<span class="sep"></span>';
		self::sel_paieska( 'kat', 'Kategorija', $sar['kategorijos'], $f['kat'] );
		echo '<span class="sep"></span>';
		self::sel_paieska( 'brand', 'Brendas', $sar['brendai'], $f['brand'] );
		echo '<span class="kiek-sar">' . count( $sar['brendai'] ) . ' brendai · ' . count( $sar['kategorijos'] ) . ' kategorijos</span>';
		echo '<a class="clear" href="' . self::url( array( 'sand'=>null,'kat'=>null,'brand'=>null,'likutis'=>null,'marza'=>null,'tipas'=>null,'q'=>null,'sal'=>null,'psl'=>null ) ) . '">Išvalyti filtrus</a>';
		echo '</div><div class="frline frl-2">';
		self::sel( 'likutis', 'Likutis', array( '' => 'visi', 'av_turi' => 'AV turi', 'av_nulis' => 'AV pasibaigę',
			'tiekejas' => 'tik tiekėjas', 'niekas' => 'niekas neturi' ), $f['likutis'] );
		echo '<span class="sep"></span>';
		self::sel( 'marza', 'Marža', array( '' => 'visos', 'zem' => 'žemiau kategorijos ribos', 'lt10' => 'žemiau 10 %',
			'lt20' => 'žemiau 20 %', 'lt30' => 'žemiau 30 %', 'gt40' => 'virš 40 %', 'nera' => 'be savikainos' ), $f['marza'] );
		echo '<span class="sep"></span>';
		self::sel( 'tipas', 'Tipas', array( '' => 'visi', 'simple' => 'paprasta', 'var' => 'su variantais', 'rinkinys' => 'rinkinys / DP' ), $f['tipas'] );
		echo '<span class="sep"></span>';
		echo '<span class="ax">Rodyti</span><select data-f="per" class="siauras">';
		foreach ( array( 50, 100, 200 ) as $v ) {
			echo '<option value="' . $v . '"' . selected( (int) $per, $v, false ) . '>' . $v . '</option>';
		}
		echo '</select>';
		echo '</div>';

		/* ---------- v8.4: SĄLYGOS ----------
		   Iki v8.4 filtrai buvo šeši fiksuoti laukeliai, o darbo eilės —
		   atskira užkoduota sistema. Todėl eilės nebuvo galima patikslinti:
		   „Be savikainos" duodavo 443, bet „iš jų tik su likučiu" —
		   neįmanoma. Dabar viskas yra sąlyga, ir jos dedamos laisvai. */
		$sal_t = isset( $f['sal'] ) ? (string) $f['sal'] : '';
		$sal   = self::sal_is_teksto( $sal_t );
		$reg   = self::laukai();

		echo '<div class="frline pskat-sal frl-3">';
		echo '<span class="ax">Sąlygos</span>';
		if ( $sal ) {
			foreach ( $sal as $i => $x ) {
				$be = $sal; unset( $be[ $i ] );
				echo '<span class="sal-p">' . esc_html( self::sal_zodziais( $x ) )
					. '<a href="' . self::url( array( 'sal' => self::sal_i_teksta( $be ) ?: null, 'psl' => null ) ) . '" title="Pašalinti">×</a></span>';
			}
		} else {
			echo '<span class="sal-tuscia">nėra — visos krūvos prekės</span>';
		}
		echo '<span class="sal-pr"><select id="sal-l"><option value="">+ pridėti sąlygą</option>';
		$gr = array();
		foreach ( $reg as $k => $x ) { $gr[ $x['g'] ][ $k ] = $x; }
		foreach ( $gr as $g => $laukai ) {
			echo '<optgroup label="' . esc_attr( $g ) . '">';
			foreach ( $laukai as $k => $x ) {
				echo '<option value="' . esc_attr( $k ) . '" data-t="' . esc_attr( $x['t'] ) . '">' . esc_html( $x['v'] ) . '</option>';
			}
			echo '</optgroup>';
		}
		echo '</select><select id="sal-op"></select><input type="text" id="sal-r" placeholder="reikšmė" autocomplete="off">'
			. '<button type="button" id="sal-add">Pridėti</button></span>';
		echo '</div>';

		/* ---------- v8.4: IŠSAUGOTI VAIZDAI ---------- */
		$vaizdai = self::vaizdai();
		echo '<div class="frline pskat-vaizdai frl-4"><span class="ax">Vaizdai</span>';
		foreach ( $vaizdai as $v ) {
			$on = ( $sal_t !== '' && $v['sal'] === $sal_t ) ? ' on' : '';
			echo '<a class="vz' . $on . '" href="' . self::url( array( 'sal' => $v['sal'] ?: null, 'psl' => null ) ) . '">'
				. esc_html( $v['v'] ) . '</a>';
		}
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="vz-f">';
		wp_nonce_field( 'ps_kat_vaizdas' );
		echo '<input type="hidden" name="action" value="ps_kat_vaizdas">';
		echo '<input type="hidden" name="sal" value="' . esc_attr( $sal_t ) . '">';
		echo '<input type="hidden" name="_grizti" value="' . esc_attr( self::url( array() ) ) . '">';
		echo '<input type="text" name="vardas" placeholder="vaizdo vardas" autocomplete="off">';
		echo '<button type="submit" name="ka" value="irasyti" class="vz-b">Išsaugoti šį vaizdą</button>';
		echo '<button type="submit" name="ka" value="atstatyti" class="vz-b vz-mut" title="Grąžinti penkis pradinius vaizdus">Atstatyti</button>';
		echo '</form>';
		echo '</div>';

		echo '</div>';
	}

	private static function suvestine_juosta( $s, $viso ) {
		$e = function ( $v ) { return number_format( (float) $v, 2, ',', ' ' ); };
		echo '<div class="pskat-suv">
			<div class="p"><span class="l">Rasta prekių</span><span class="v">' . (int) $viso . '</span></div>
			<div class="p"><span class="l">AV atsargų savikaina<i title="AV likutis × savikaina, be PVM. Tiekėjų likučiai neįskaičiuoti — tai ne įmonės turtas.">ⓘ</i></span><span class="v">' . $e( $s['av_savikaina'] ) . ' €</span></div>
			<div class="p"><span class="l">AV mažmeninė vertė<i title="Visos AV prekės su kaina, su PVM.">ⓘ</i></span><span class="v">' . $e( $s['av_mazmenine'] ) . ' €</span></div>
			<div class="p"><span class="l">Svertinė marža<i title="Svertinė pagal atsargų vertę, ne procentų vidurkis.">ⓘ</i></span><span class="v">' . ( $s['marza_svertine'] === null ? '—' : number_format( $s['marza_svertine'], 1, ',', ' ' ) . ' %' ) . '</span></div>
			<div class="p"><span class="l">Savikaina žinoma</span><span class="v">' . (int) $s['padengimas'] . ' %</span></div>
			<div class="p"><span class="l">Potenciali marža<i title="Kiek uždirbtumėte pardavę visas AV atsargas dabartinėmis kainomis. Tik prekės su žinoma savikaina.">ⓘ</i></span><span class="v">' . $e( $s['potenciali'] ) . ' €</span></div>
			<div class="p"><span class="l">Vienetų AV</span><span class="v">' . (int) $s['vnt'] . '</span></div>
		</div>';
	}

	/**
	 * v5.2: laikotarpio pasirinkimas eilei „Neparduodama".
	 *
	 * 60 dienu be pardavimo skanestams jau signalas, o aksesuarams — norma.
	 * Todel viena fiksuota riba (buvo 365) netinka: ji arba slepia problema,
	 * arba kelia trukšma. Rodoma TIK savo eileje.
	 */
	private static function laikotarpio_juosta( $f ) {
		if ( $f['view'] !== 'negyvos' ) { return; }
		$nd  = self::nepard_riba();
		$baz = array( 'page' => 'ps-katalogas', 'kruva' => $f['kruva'], 'view' => 'negyvos' );
		if ( $f['q'] !== '' ) { $baz['q'] = $f['q']; }

		echo '<div class="pskat-laikot">';
		echo '<span class="et">Neparduodama</span>';
		foreach ( array( 60, 90, 180, 360 ) as $d ) {
			$url = add_query_arg( $baz + array( 'nd' => $d ), admin_url( 'admin.php' ) );
			echo '<a class="lg' . ( $nd['nuo'] === $d && $nd['iki'] === null ? ' on' : '' ) . '"'
				. ' href="' . esc_url( $url ) . '">≥ ' . $d . ' d.</a>';
		}
		echo '<form class="lg-nuo-iki" method="get">';
		foreach ( $baz as $k => $v ) { echo '<input type="hidden" name="' . esc_attr( $k ) . '" value="' . esc_attr( $v ) . '">'; }
		echo '<span class="et2">nuo</span><input type="number" name="nd" min="1" max="3650" value="' . (int) $nd['nuo'] . '">';
		echo '<span class="et2">iki</span><input type="number" name="nd_iki" min="1" max="3650" placeholder="—" value="'
			. ( $nd['iki'] !== null ? (int) $nd['iki'] : '' ) . '">';
		echo '<button type="submit">Rodyti</button></form>';
		$lch = self::paleidimo_data();
		if ( $lch ) {
			echo '<span class="pat2">Skaičiuojama nuo paskutinio pardavimo. Jei prekė dar neparduota — nuo '
				. esc_html( date( 'Y-m-d', $lch ) ) . ' (parduotuvės paleidimo) arba nuo vėlesnio publikavimo.</span>';
		} else {
			echo '<span class="pat2">Skaičiuojama nuo paskutinio pardavimo arba nuo publikavimo.</span>';
		}
		echo '</div>';

		/* Paleidimo data — be jos migracijos diena taptu atskaitos tasku ir
		   paleidimo diena visas katalogas atrodytu neparduodamas menesius. */
		echo '<div class="pskat-paleidimas' . ( $lch ? ' nustatyta' : '' ) . '">';
		if ( $lch ) {
			echo '<span>Parduotuvės paleidimas: <b>' . esc_html( date( 'Y-m-d', $lch ) ) . '</b></span>';
			echo '<button type="button" class="pl-keisti">keisti</button>';
		} else {
			echo '<span><b>Parduotuvės paleidimo data nenustatyta.</b> Kol jos nėra, skaičiuojama nuo publikavimo — '
				. 'o migruotoms prekėms tai reiškia importo dieną, ne dieną, kai jos tapo perkamos.</span>';
		}
		echo '<span class="pl-forma"' . ( $lch ? ' hidden' : '' ) . '>'
			. '<input type="text" class="pl-data ps-data" placeholder="2027-09-30" value="' . esc_attr( $lch ? date( 'Y-m-d', $lch ) : '' ) . '">'
			. '<button type="button" class="pl-irasyti">Įrašyti</button>'
			. '<span class="pl-stat"></span></span>';
		echo '</div>';
	}

	/**
	 * v5.4: galiojimo juosta — ribos ir kelias i akcija.
	 *
	 * Be paskutinio mygtuko visa si eile butu tik saraso: pamatai problema,
	 * bet kad ka nors su ja padarytum, tenka is naujo rinkti tas pacias prekes
	 * akciju lange. Cia — vienas paspaudimas su jau uzpildytu taikiniu.
	 */
	private static function galiojimo_juosta( $f ) {
		if ( ! in_array( $f['view'], array( 'gi_pasibaige', 'gi_kritine', 'gi_arteja' ), true ) ) { return; }
		$gir = self::gi_ribos();
		$baz = array( 'page' => 'ps-katalogas', 'kruva' => $f['kruva'], 'view' => $f['view'] );
		if ( $f['q'] !== '' ) { $baz['q'] = $f['q']; }

		echo '<div class="pskat-laikot">';
		echo '<span class="et">Geriausia iki</span>';
		foreach ( array( 30, 60, 90, 180 ) as $d ) {
			$url = add_query_arg( $baz + array( 'gi' => $d ), admin_url( 'admin.php' ) );
			echo '<a class="lg' . ( (int) $gir['kritine'] === $d ? ' on' : '' ) . '"'
				. ' href="' . esc_url( $url ) . '">≤ ' . $d . ' d.</a>';
		}
		echo '<form class="lg-nuo-iki" method="get">';
		foreach ( $baz as $k => $v ) { echo '<input type="hidden" name="' . esc_attr( $k ) . '" value="' . esc_attr( $v ) . '">'; }
		echo '<span class="et2">skubu iki</span><input type="number" name="gi" min="1" max="3650" value="' . (int) $gir['kritine'] . '">';
		echo '<span class="et2">stebėti iki</span><input type="number" name="gi_iki" min="1" max="3650" value="' . (int) $gir['arteja'] . '">';
		echo '<button type="submit">Rodyti</button></form>';

		/* Kelias i akcija — tik ten, kur jis prasmingas. Pasibaigusiu prekiu
		   su nuolaida pardavineti negalima, joms reikia nurasymo. */
		if ( $f['view'] !== 'gi_pasibaige' ) {
			$dienu = ( $f['view'] === 'gi_kritine' ) ? (int) $gir['kritine'] : (int) $gir['arteja'];
			$akc = add_query_arg( array( 'page' => 'ps-akcijos', 'nauja' => 1, 'gi' => $dienu ), admin_url( 'admin.php' ) );
			echo '<a class="lg-akcija" href="' . esc_url( $akc ) . '">Sukurti trumpo galiojimo akciją →</a>';
		} else {
			echo '<span class="pat2">Pasibaigusios prekės nurašomos, ne pardavinėjamos su nuolaida.</span>';
		}
		echo '</div>';
	}

	/** AV likučio įvedimo režimas. */
	private static function redagavimo_juosta() {
		echo '<div class="pskat-red" id="pskat-red">';
		echo '<button class="ijungti" id="red-ijungti">✎ Greitas redagavimas</button>';
		echo '<span class="red-vidus" hidden>';
		echo '<span class="ax">Priežastis</span><select id="red-priez">';
		foreach ( self::priezastys() as $k => $v ) {
			echo '<option value="' . esc_attr( $k ) . '">' . esc_html( $v ) . '</option>';
		}
		echo '</select>';
		echo '<span class="pat">Spustelk <b>AV</b>, <b>kainą</b> arba <b>savikainą</b> ir rašyk. <b>Enter</b> — žemyn, '
			. '<b>Tab</b> — į šoną. <b>12</b> nustato, <b>+5</b> prideda, <b>−2</b> atima.'
			. '<i>Kainą pakeitus, prekė iškrenta iš automatinės kainodaros.</i></span>';
		echo '<button class="baigti" id="red-baigti">Išjungti režimą</button>';
		echo '</span></div>';

		echo '<div class="pskat-masine" id="pskat-masine" hidden>'
			. '<span class="kiek">Pažymėta <b id="ms-kiek">0</b></span>'
			. '<select id="ms-veiksmas">';
		foreach ( self::masiniai_veiksmai() as $k => $v ) {
			echo '<option value="' . esc_attr( $k ) . '">' . esc_html( $v ) . '</option>';
		}
		echo '</select>'
			. '<button class="ms-perziura" id="ms-perziura">Peržiūrėti →</button>'
			. '<button class="ms-nuimti" id="ms-nuimti">Nuimti žymes</button>'
			. '</div>';

		echo '<div class="pskat-langas" id="ps-langas" hidden><div class="lg">'
			. '<h3 id="lg-antraste">Peržiūra</h3>'
			. '<div class="lg-santrauka" id="lg-santrauka"></div>'
			. '<div class="lg-turinys" id="lg-turinys"></div>'
			. '<div class="lg-myg">'
			. '<button class="atsauk" id="lg-atsauk">Atšaukti</button>'
			. '<button class="vykdyk" id="lg-vykdyk">Vykdyti</button>'
			. '</div></div></div>';

		echo '<div class="pskat-saugoti" id="pskat-saugoti" hidden>'
			. '<span class="kiek">Pakeista <b id="sg-kiek">0</b> eilučių <i id="sg-detalus"></i></span>'
			. '<button class="atmesti" id="sg-atmesti">Atmesti pakeitimus</button>'
			. '<button class="issaugoti" id="sg-saugoti">Išsaugoti</button>'
			. '</div>';
	}

	private static function th( $laukas, $tekstas, $sort, $kryp, $klase = '', $poantraste = '' ) {
		$nauja = ( $sort === $laukas && $kryp === 'asc' ) ? 'desc' : 'asc';
		$rodykle = ( $sort === $laukas ) ? ( $kryp === 'asc' ? ' ▲' : ' ▼' ) : '';
		echo '<th class="' . esc_attr( $klase ) . '"><a href="' . self::url( array( 'sort' => $laukas, 'kryp' => $nauja, 'psl' => null ) ) . '">'
			. esc_html( $tekstas ) . '<span class="ar">' . $rodykle . '</span>'
			. ( $poantraste !== '' ? '<span class="pvm">' . esc_html( $poantraste ) . '</span>' : '' )
			. '</a></th>';
	}

	private static function lentele( $lapas, $sort, $kryp, $f ) {
		/* v8.6: lentelė gyvena savame slinkties lauke — antraštė prilipusi,
		   filtrai ir kairė juosta nejuda. Nuvažiavus iki 40-tos prekės vis
		   tiek matai, kuris stulpelis yra kuris. */
		echo '<div class="pskat-lent-lauk">';
		echo '<table class="pskat-t"><thead><tr>';
		echo '<th class="ck"><input type="checkbox" id="ps-visi" title="Pažymėti visas puslapyje"></th>';
		/* v3.1: bukles taskas rikiuojamas pagal pilnumo bala. */
		self::th( 'pbalas', '', $sort, $kryp, 'c bukle-th', '' );
		echo '<th style="width:46px"></th>';
		self::th( 'n', 'Prekė', $sort, $kryp );
		self::th( 'sand', 'Tiekėjas', $sort, $kryp );
		self::th( 'av', 'AV', $sort, $kryp, 'num' );
		self::th( 'tiek', 'Tiekėjo', $sort, $kryp, 'num' );
		echo '<th class="num">Parduodama</th>';
		self::th( 'price', 'Kaina', $sort, $kryp, 'num', '€ su PVM' );
		self::th( 'cost', 'Savikaina', $sort, $kryp, 'num', '€ be PVM' );
		self::th( 'marza', 'Marža', $sort, $kryp, 'num', '% · € vnt.' );
		/* v2.9: pardavimu greitis ir pilnumas */
		/* v3.2: "Pardavimai" ir "Užteks" SUJUNGTI. Atskirai lentele netilpo
		   i ekrana (1251 px pries 1210 px konteinerio), o abu rodikliai yra
		   vienas informacinis blokas: kiek parduodama ir kiek dar uzteks. */
		self::th( 'v30', 'Pardavimai', $sort, $kryp, 'num', '30 d. · ABC · dienų' );
		/* v3.1: atskiras "Pilnumas" stulpelis PASALINTAS. Lentele su juo
		   nebetilpo i ekrana (desinysis krastas nukirstas), o pats stulpelis
		   dubliavo bukles taska kaireje, kuris JAU rodo ta pati procenta.
		   Vietoj to bukles taskas padarytas rikiuojamas. */
		/* v5.1: „Geriausia iki" stulpelis rodomas TIK savo eilese. Kitur jis
		   butu tuscias 1 399 eilutese is 1 400 — lentele nuo to tik siauresne. */
		$gi_stulpelis = in_array( $f['view'], array( 'gi_pasibaige', 'gi_kritine', 'gi_arteja' ), true );
		if ( $gi_stulpelis ) { self::th( 'gid', 'Geriausia iki', $sort, $kryp, 'num', 'liko dienų' ); }
		/* v5.2: „Neparduodama" — irgi tik savo eileje. */
		$nd_stulpelis = ( $f['view'] === 'negyvos' );
		if ( $nd_stulpelis ) { self::th( 'nepard', 'Neparduodama', $sort, $kryp, 'num', 'dienų' ); }
		self::th( 'upd', 'Atnaujinta', $sort, $kryp );
		echo '</tr></thead><tbody>';

		if ( ! $lapas ) {
			echo '<tr><td colspan="' . ( 13 + ( $gi_stulpelis ? 1 : 0 ) + ( $nd_stulpelis ? 1 : 0 ) )
				. '" class="tuscia">Pagal šiuos filtrus prekių nėra.</td></tr>';
		}

		$eur = function ( $v ) { return number_format( (float) $v, 2, ',', ' ' ); };

		foreach ( $lapas as $r ) {
			$p = $r['pilnumas'];

			/* BŪKLĖS TAŠKAS — santrauka. Raudonas tik tada, kai prekė guli
			   kurioje nors darbo eilėje; kitaip pilkas arba žalias. */
			$bkl = 'ok'; $kodel = array();
			if ( $r['marza'] !== null && $r['marza'] < $r['grind'] ) { $bkl = 'bad'; $kodel[] = 'marža ' . number_format( $r['marza'], 1, ',', ' ' ) . ' % žemiau ' . rtrim( rtrim( number_format( $r['grind'], 1, ',', '' ), '0' ), ',' ) . ' % ribos'; }
			if ( $r['pard'] <= 0 ) { $bkl = 'bad'; $kodel[] = 'parduodama 0'; }
			if ( $r['cost'] === null ) { if ( $bkl !== 'bad' ) { $bkl = 'warn'; } $kodel[] = 'nežinoma savikaina'; }
			if ( $p['truksta'] ) { if ( $bkl === 'ok' ) { $bkl = 'warn'; } $kodel[] = 'trūksta: ' . implode( ', ', $p['truksta'] ); }
			if ( in_array( $r['sand'], array( 'vf','zb' ), true ) && self::pasenes( $r['sync'] ) ) {
				if ( $bkl === 'ok' ) { $bkl = 'warn'; } $kodel[] = 'tiekėjo duomenys seni';
			}
			/* v5.1: artejantis galiojimas — busena, ne tik atskiras stulpelis.
			   Kitaip apie ji suzinotum tik nuejes i ta viena eile. */
			if ( $r['gid'] !== null ) {
				$gir_e = self::gi_ribos();
				if ( $r['gid'] <= 0 ) { $bkl = 'bad'; $kodel[] = 'geriausia iki PASIBAIGĖ'; }
				elseif ( $r['gid'] <= $gir_e['kritine'] ) { $bkl = 'bad'; $kodel[] = 'geriausia iki po ' . (int) $r['gid'] . ' d.'; }
				elseif ( $r['gid'] <= $gir_e['arteja'] ) { if ( $bkl === 'ok' ) { $bkl = 'warn'; } $kodel[] = 'geriausia iki po ' . (int) $r['gid'] . ' d.'; }
			}
			/* v2.9: naujas balas jau yra procentai, senoji atsargine — laukai. */
			$p_proc = isset( $p['proc'] ) ? (int) $p['proc'] : 0;
			$kodel_t = $kodel ? implode( ' · ', $kodel )
				: 'viskas tvarkoje · duomenų pilnumas ' . $p_proc . ' %';

			echo '<tr data-id="' . (int) $r['id'] . '">';
			echo '<td class="ck"><input type="checkbox" class="ps-zym" value="' . (int) $r['id'] . '"></td>';
			/* Skaicius = duomenu pilnumas procentais; ✓ = 100 %. Spalva —
			   ar preke guli kurioje nors darbo eileje. */
			$bukles_p = ( $r['ptrukst'] !== '' ? 'Trūksta: ' . $r['ptrukst'] . ' · ' : '' ) . $kodel_t;
			echo '<td class="c"><span class="bukle ' . esc_attr( $bkl ) . '" data-p="' . esc_attr( $bukles_p ) . '">'
				. ( $p_proc >= 100 ? '✓' : $p_proc ) . '</span></td>';

			/* NUOTRAUKA — esamas thumbnail dydis, sumažintas CSS'u */
			/* v3.3: kategorijos kodas po nuotrauka (maketas v18) — leidzia
			   atpazinti preke net kai nuotrauka nieko nesako. */
			echo '<td class="c foto-lang">';
			$kodas = '';
			if ( ! empty( $r['kat'] ) ) {
				$pirma = is_array( $r['kat'] ) ? reset( $r['kat'] ) : $r['kat'];
				$kodas = mb_strtoupper( mb_substr( self::be_diakritiku( (string) $pirma ), 0, 3 ) );
			}
			if ( $r['img'] !== '' ) {
				echo '<img class="mini" src="' . esc_url( $r['img'] ) . '" alt="" loading="lazy" decoding="async">';
			} else {
				echo '<span class="mini tuscia-img" title="Be nuotraukos">◻</span>';
			}
			if ( $kodas !== '' ) {
				echo '<span class="kat-kodas" data-p="' . esc_attr( is_array( $r['kat'] ) ? implode( ' · ', $r['kat'] ) : $r['kat'] ) . '">'
					. esc_html( $kodas ) . '</span>';
			}
			echo '</td>';

			/* PAVADINIMAS */
			$zenklai = '';
			if ( $r['st'] !== 'publish' ) { $zenklai .= '<span class="z draft">juodraštis</span>'; }
			if ( $r['delist'] ) { $zenklai .= '<span class="z bad">išimta</span>'; }
			if ( $r['nesalt'] ) { $zenklai .= '<span class="z bad" title="Registre nėra aktyvaus šaltinio įrašo">be šaltinio</span>'; }
			echo '<td class="pav"><a class="atv" href="#" data-id="' . (int) $r['id'] . '">' . esc_html( $r['n'] ) . '</a>'
				. ( $r['st'] === 'publish' ? ' <a class="namas" target="_blank" title="Atidaryti parduotuvėje" href="' . esc_url( get_permalink( $r['id'] ) ) . '">⌂</a>' : '' )
				. $zenklai . '<span class="sub mono">' . esc_html( $r['sku'] !== '' ? $r['sku'] : ( '#' . $r['id'] ) )
				. ( $r['ean'] !== '' ? ' · ' . esc_html( $r['ean'] ) : '' )
				. ( $r['br'] !== '' ? ' · ' . esc_html( $r['br'] ) : '' ) . '</span></td>';

			/* TIEKEJAS. v7.6: paaiskinimas sako ne „kur guli", o „is ko pirkta ir
			   is kur ateina likutis" — butent to reikia kasdien. */
			if ( $r['sand'] === 'av' ) {
				$sand_p = 'Sava prekė · likutis įvedamas ranka';
			} elseif ( in_array( $r['sand'], array( 'vf', 'zb' ), true ) ) {
				$sand_p = 'Tiekėjas ' . strtoupper( $r['sand'] ) . ' · dropship, likutį atsiunčia XML';
			} else {
				$sand_p = 'Tiekėjas ' . strtoupper( $r['sand'] ) . ' · prekė mūsų lentynoje, likutis įvedamas ranka';
			}
			if ( $r['sync'] ) { $sand_p .= ' · sinchronizuota ' . mb_substr( (string) $r['sync'], 0, 16 ); }
			echo '<td><span class="sand s_' . esc_attr( $r['sand'] ) . '" data-p="' . esc_attr( $sand_p ) . '">'
				. esc_html( strtoupper( $r['sand'] !== '' ? $r['sand'] : '—' ) ) . '</span></td>';

			/* AV ir TIEKĖJO */
			$sk = function ( $v, $paaisk ) {
				if ( $v === null ) { return '<span class="nezinoma" data-p="Nežinoma — tai ne nulis">—</span>'; }
				return '<span data-p="' . esc_attr( $paaisk ) . '">' . (int) $v . '</span>';
			};
			/* v7.2: greitas redagavimas — TIK ne-XML sandeliams. VF/ZB likuti
			   atsiuncia tiekejas, ir irasytas skaicius isgyventu iki artimiausio
			   importo — t. y. melas su galiojimo terminu. */
			$rank = self::likutis_rankinis( $r['id'] );
			echo '<td class="num av-lang' . ( $rank ? ' red-lang' : ' nerd' ) . '" data-st="av" data-id="' . (int) $r['id'] . '" data-buvo="'
				. ( $r['av'] === null ? '' : (int) $r['av'] ) . '">'
				. '<span class="av-rodo" data-p="' . ( $rank
					? 'Spustelk ir įrašyk. 12 nustato, +5 prideda, −2 atima.'
					: 'Likutį valdo tiekėjo XML — ranka nekeičiamas' ) . '">'
				. ( $r['av'] === null ? '<span class="nezinoma">—</span>' : (int) $r['av'] ) . '</span></td>';
			echo '<td class="num tiek-lang">' . $sk( $r['tiek'], 'Tiekėjo likutis iš jo duomenų — tik skaitymui' ) . '</td>';

			/* PARDUODAMA */
			echo '<td class="num pard' . ( $r['pard'] > 0 ? '' : ' nula' ) . '" data-p="Kiek pirkėjas gali užsisakyti: sava lentyna + tiekėjas">'
				. (int) $r['pard'] . '</td>';

			/* KAINA + akcija + užraktas + siūloma */
			echo '<td class="num kaina kaina-lang red-lang" data-st="kaina" data-id="' . (int) $r['id'] . '"'
				. ' data-buvo="' . ( $r['price'] === null ? '' : (float) $r['price'] ) . '"'
				. ' data-cost="' . ( $r['cost'] === null ? '' : (float) $r['cost'] ) . '"'
				. ' data-grind="' . (float) $r['grind'] . '"'
				. ' data-lock="' . ( $r['lock'] ? 1 : 0 ) . '">';
			echo '<span class="kaina-rodo">';
			if ( $r['price'] === null ) { echo '<span class="nezinoma">—</span>'; }
			else {
				echo $eur( $r['price'] );
				if ( $r['lock'] ) { echo '<span class="uzr" data-p="Kaina nustatyta ranka — automatika jos neliečia">🔒</span>'; }
				if ( $r['sale'] !== null ) { echo '<span class="akc" data-p="Akcijos kaina ' . esc_attr( $eur( $r['sale'] ) ) . ' €">AKC</span>'; }
				if ( $r['siul'] !== null && abs( (float) $r['siul'] - (float) $r['price'] ) >= 0.02 ) {
					$auks = (float) $r['siul'] > (float) $r['price'];
					echo '<span class="siul ' . ( $auks ? 'auks' : 'zem' ) . '" data-p="Kaina pagal jūsų kainodaros taisykles. '
						. ( $auks ? 'Dabartinė žemesnė' : 'Dabartinė aukštesnė' ) . ' už taisyklių.">siūloma '
						. $eur( $r['siul'] ) . '</span>';
				}
			}
			echo '</span></td>';

			/* SAVIKAINA — v8.5: redaguojama vietoje, bet TIK AV prekėms.
			   Dropship savikaina ateina iš tiekėjo, todėl ten laukelio nėra
			   visai: matomas laukelis, kuris nieko nekeičia, yra blogiau
			   nei jokio laukelio. */
			$sav_rd = ( $r['sand'] === 'av' );
			echo '<td class="num sav-lang' . ( $sav_rd ? ' red-lang' : ' nerd' ) . '"'
				. ( $sav_rd ? ' data-st="sav" data-id="' . (int) $r['id'] . '"'
					. ' data-buvo="' . ( $r['cost'] === null ? '' : (float) $r['cost'] ) . '"'
					. ' data-kaina="' . ( $r['price'] === null ? '' : (float) $r['price'] ) . '"'
					. ' data-grind="' . (float) $r['grind'] . '"' : '' ) . '>';
			echo '<span class="sav-rodo">';
			if ( $r['cost'] === null ) {
				echo '<span class="nezinoma bs" data-p="Savikaina nesuvesta — be jos nematyti nei maržos, nei atsargų vertės">—</span>';
			} else {
				echo '<span data-p="Be PVM · su PVM ' . esc_attr( $eur( $r['cost'] * ( 1 + self::PVM ) ) ) . ' €">' . $eur( $r['cost'] ) . '</span>';
			}
			echo '</span></td>';

			/* MARŽA PLOKŠTELE */
			echo '<td class="num">';
			if ( $r['marza'] === null ) { echo '<span class="nezinoma">—</span>'; }
			else {
				$zem  = $r['marza'] < $r['grind'];
				$kl   = $zem ? 'bad' : ( ( $r['marza'] < $r['grind'] + 5 ) ? 'warn' : 'ok' );
				$meur = self::marza_eur( $r['price'], $r['cost'] );
				$rib  = rtrim( rtrim( number_format( $r['grind'], 1, ',', '' ), '0' ), ',' );
				echo '<span class="marza m_' . $kl . '" data-p="Kategorijos riba ' . esc_attr( $rib ) . ' %. Skaičiuojama nuo kainos be PVM.">'
					. '<b>' . number_format( $r['marza'], 1, ',', ' ' ) . ' %</b>'
					. '<i>' . $eur( $meur ) . ' €</i></span>';
				if ( $zem ) { echo '<span class="zem-ribos">žemiau ribos</span>'; }
			}
			echo '</td>';

			/* ---------- v3.2: PARDAVIMAI IR UŽTEKS VIENAME ---------- */
			echo '<td class="num">';
			if ( $r['v30'] === null ) {
				echo '<span class="nezinoma" data-p="Dar neskaičiuota">—</span>';
			} else {
				$abc_kl = $r['abc'] !== '' ? ' abc_' . strtolower( $r['abc'] ) : '';
				$pp = '30 d.: ' . (int) $r['v30'] . ' vnt · 365 d.: ' . (int) $r['v365'] . ' vnt';
				if ( $r['pmarza'] !== null ) { $pp .= ' · marža ' . $eur( $r['pmarza'] ) . ' € (apytiksliai, pagal dabartinę savikainą)'; }
				if ( $r['abc'] !== '' ) { $pp .= ' · ' . $r['abc'] . ' klasė'; }
				if ( $r['dienu'] !== null ) { $pp .= ' · likučio užteks ' . (int) $r['dienu'] . ' d.'; }
				echo '<span class="pard-gr' . esc_attr( $abc_kl ) . '" data-p="' . esc_attr( $pp ) . '">'
					. '<b>' . (int) $r['v30'] . '</b>'
					. ( $r['abc'] !== '' ? '<i>' . esc_html( $r['abc'] ) . '</i>' : '' );
				if ( $r['dienu'] !== null ) {
					$dk = ( $r['dienu'] <= 7 ) ? 'bad' : ( ( $r['dienu'] <= 14 ) ? 'warn' : 'ok' );
					echo '<u class="dienu d_' . $dk . '">' . (int) $r['dienu'] . ' d.</u>';
				}
				echo '</span>';
			}
			echo '</td>';

			/* v5.1: „Geriausia iki" — data plius kiek dienų liko, nes viena
			   data be skaičiaus verčia žmogų skaičiuoti galvoje. */
			if ( $gi_stulpelis ) {
				if ( $r['gid'] === null ) {
					echo '<td class="num sml">—</td>';
				} else {
					$gk = ( $r['gid'] <= self::gi_ribos()['kritine'] ) ? 'bad' : 'warn';
					echo '<td class="num"><b class="gi ' . $gk . '">' . esc_html( $r['gi'] ) . '</b>'
						. '<span class="gi-d">' . ( $r['gid'] < 0
							? 'pasibaigė prieš ' . abs( (int) $r['gid'] ) . ' d.'
							: ( $r['gid'] === 0 ? 'baigiasi šiandien' : 'po ' . (int) $r['gid'] . ' d.' ) )
						. ( $r['gikiek'] ? ' · ' . rtrim( rtrim( number_format( (float) $r['gikiek'], 1, ',', ' ' ), '0' ), ',' ) . ' vnt.' : '' )
						. '</span></td>';
				}
			}
			if ( $nd_stulpelis ) {
				if ( $r['nepard'] === null ) {
					echo '<td class="num sml">—</td>';
				} else {
					/* Ivardijama, nuo ko skaiciuota — kitaip skaicius atrodo
					   paimtas is oro. */
					$nk = $r['nepard'] >= 360 ? 'bad' : ( $r['nepard'] >= 180 ? 'warn' : '' );
					echo '<td class="num"><b class="gi ' . $nk . '">' . (int) $r['nepard'] . '</b>'
						. '<span class="gi-d">' . ( $r['psale'] && $r['psale'] !== '0000-00-00 00:00:00'
							? 'nuo pardavimo' : 'nuo publikavimo' ) . '</span></td>';
				}
			}
			echo '<td class="mono sml">' . esc_html( $r['upd'] ) . '</td>';
			echo '</tr>';
		}
		echo '</tbody></table>';
		echo '</div>';
	}

	private static function puslapiavimas( $psl, $psl_n, $viso, $per, $f, $sort, $kryp ) {
		if ( $psl_n <= 1 ) { echo '<div class="pskat-psl">Viso: ' . (int) $viso . '</div>'; return; }
		echo '<div class="pskat-psl">';
		echo '<span>Viso ' . (int) $viso . ' · puslapis ' . (int) $psl . ' iš ' . (int) $psl_n . '</span>';
		if ( $psl > 1 ) { echo '<a href="' . self::url( array( 'psl' => $psl - 1 ) ) . '">← Ankstesnis</a>'; }
		if ( $psl < $psl_n ) { echo '<a href="' . self::url( array( 'psl' => $psl + 1 ) ) . '">Kitas →</a>'; }
		echo '</div>';
	}

	private static function skriptas() {
		$baze  = esc_js( admin_url( 'admin.php?page=ps-katalogas' ) );
		$ajax  = esc_js( admin_url( 'admin-ajax.php' ) );
		$nonce = esc_js( wp_create_nonce( 'ps_kat' ) );
		echo '<script>
		(function(){
			var AJAX="' . $ajax . '", NONCE="' . $nonce . '";
			var laukai=["kruva","view","sand","kat","brand","likutis","marza","tipas","q","sal","sort","kryp","per"];
			function eiti(){
				var u=new URLSearchParams(window.location.search);
				u.set("page","ps-katalogas"); u.delete("psl");
				document.querySelectorAll("[data-f]").forEach(function(el){
					var k=el.getAttribute("data-f"), v=el.value;
					if(v===""){u.delete(k);}else{u.set(k,v);}
				});
				window.location.href="' . $baze . '".split("?")[0]+"?"+u.toString();
			}


			/* ---------- v8.7: NORMALUS LANGAS ----------
			   v8.6 fiksuoto ekrano koncepcija (langas = ekrano aukstis,
			   prekems atiduodama "kas liko" po JS matavimu) realiame ekrane
			   palikdavo prekems 120 px ruozeli su vidiniu scroll-u.
			   Ismesta visa matavimo masinerija: puslapis vel slenka
			   normaliai, prekiu lentele auga pagal turini.
			   Lieka VIENAS matavimas - virsutines juostos apacia, kad
			   kaires eiles (sticky) nesulistu po ja. */
			function virsus(){
				var b=document.querySelector(".pskat-bar");
				var t=b?Math.max(0,Math.round(b.getBoundingClientRect().bottom)):118;
				document.documentElement.style.setProperty("--ps-virsus", t+"px");
			}
			virsus();
			window.addEventListener("resize", virsus);
			setTimeout(virsus, 400); setTimeout(virsus, 1200);

			/* v8.6.2 (lieka): filtru dezes suskleidimas. Busena isimenama. */
			function frBusena(b){
				document.body.classList.toggle("fr-suskleista", b);
				try{ localStorage.setItem("ps_kat_fr", b ? "1" : "0"); }catch(e){}
			}
			var frPr="1";
			try{ frPr=localStorage.getItem("ps_kat_fr")||"1"; }catch(e){}
			frBusena(frPr==="1");
			document.addEventListener("click", function(e){
				if(e.target.closest("#fr-jung")){ frBusena(!document.body.classList.contains("fr-suskleista")); return; }
			});

			/* ---------- v8.4: SĄLYGŲ PRIDĖJIMAS ----------
			   Operatoriai priklauso nuo lauko tipo: skaičiui nesiūlom
			   „prasideda", o loginiam — „tarp". Sąlyga įrašoma į `sal`
			   parametrą, kurį serveris išverčia atgal. */
			var OPS={
				sk:   [["=","="],["!=","≠"],[">",">"],["<","<"],[">=","≥"],["<=","≤"],["tarp","tarp (a,b)"],["tuscia","tuščia"],["netuscia","užpildyta"]],
				tekst:[["yra","yra"],["nera","nėra"],["prasideda","prasideda"],["=","tiksliai"],["tuscia","tuščia"],["netuscia","užpildyta"]],
				sar:  [["=","="],["!=","≠"],["vienas_is","vienas iš (a,b)"],["ne_vienas_is","nė vienas iš"],["tuscia","tuščia"],["netuscia","užpildyta"]],
				mas:  [["turi","turi"],["neturi","neturi"]],
				log:  [["taip","taip"],["ne","ne"]],
				data: [["yra","yra"],["tuscia","tuščia"],["netuscia","užpildyta"]]
			};
			var selL=document.getElementById("sal-l"),
			    selO=document.getElementById("sal-op"),
			    inpR=document.getElementById("sal-r"),
			    btnA=document.getElementById("sal-add");
			function opsAtnaujinti(){
				if(!selL||!selO) return;
				var o=selL.options[selL.selectedIndex], t=o?o.getAttribute("data-t"):"";
				selO.innerHTML="";
				(OPS[t]||OPS.tekst).forEach(function(p){
					var e=document.createElement("option"); e.value=p[0]; e.textContent=p[1]; selO.appendChild(e);
				});
				bereiksmes();
			}
			function bereiksmes(){
				if(!selO||!inpR) return;
				var v=selO.value, be=(v==="tuscia"||v==="netuscia"||v==="taip"||v==="ne");
				inpR.style.display= be ? "none" : "";
				if(be) inpR.value="";
			}
			function pridetiSalyga(){
				if(!selL||!selL.value) return;
				var v=selO.value, r=inpR.value.trim();
				var be=(v==="tuscia"||v==="netuscia"||v==="taip"||v==="ne");
				if(!be && r==="") { inpR.focus(); return; }
				var nauja=selL.value+"~"+v+(be?"":"~"+r);
				var u=new URLSearchParams(window.location.search);
				var esamos=u.get("sal")||"";
				u.set("page","ps-katalogas");
				u.set("sal", esamos ? esamos+";"+nauja : nauja);
				u.delete("psl");
				window.location.href=location.pathname+"?"+u.toString();
			}
			if(selL){ selL.addEventListener("change", opsAtnaujinti); opsAtnaujinti(); }
			if(selO){ selO.addEventListener("change", bereiksmes); }
			if(btnA){ btnA.addEventListener("click", pridetiSalyga); }
			if(inpR){ inpR.addEventListener("keydown", function(e){ if(e.key==="Enter"){ e.preventDefault(); pridetiSalyga(); } }); }

			document.querySelectorAll("[data-f]").forEach(function(el){
				el.addEventListener("change", eiti);
				if(el.tagName==="INPUT"){
					el.addEventListener("keydown", function(e){ if(e.key==="Enter"){ e.preventDefault(); eiti(); } });
				}
			});

			/* Debesėlis. Naršyklės title atsiranda po sekundės ir yra pilkas —
			   savas pasirodo iškart ir telpa kelios eilutės. */
			var deb=document.createElement("div");
			deb.className="pskat-deb"; document.body.appendChild(deb);
			var laikas=null;
			function rodyk(el){
				var t=el.getAttribute("data-p"); if(!t) return;
				deb.textContent=t; deb.style.display="block";
				var r=el.getBoundingClientRect();
				var x=r.left+r.width/2, y=r.top-8;
				deb.style.left="0px"; deb.style.top="0px";
				var d=deb.getBoundingClientRect();
				if(x-d.width/2<8) x=d.width/2+8;
				if(x+d.width/2>window.innerWidth-8) x=window.innerWidth-d.width/2-8;
				var apacia=false;
				if(y-d.height<8){ y=r.bottom+8; apacia=true; }
				else { y=y-d.height; }
				deb.style.left=Math.round(x-d.width/2)+"px";
				deb.style.top=Math.round(y+window.scrollY)+"px";
				deb.classList.toggle("apacia",apacia);
			}
			document.addEventListener("mouseover",function(e){
				var el=e.target.closest("[data-p]"); if(!el) return;
				clearTimeout(laikas); rodyk(el);
			});
			document.addEventListener("mouseout",function(e){
				if(!e.target.closest("[data-p]")) return;
				laikas=setTimeout(function(){ deb.style.display="none"; },80);
			});
			window.addEventListener("scroll",function(){ deb.style.display="none"; },{passive:true});

			/* v7.5: SARASO EILUTE ATNAUJINAMA PO KIEKVIENO IRASYMO KORTELEJE.
			   Be sito sarasas ir kortele rodo skirtingus skaicius apie ta
			   pacia preke — o zmogus, matantis du atsakymus, nustoja tiketi
			   abiem. Perkrauti puslapio negalima: dingtu filtrai ir vieta. */
			window.psAtnaujintiEilute=function(id){
				id=parseInt(id,10); if(!id) return;
				var tr=document.querySelector(".pskat-t tbody tr[data-id=\""+id+"\"]");
				if(!tr) return;
				var fd=new FormData();
				fd.append("action","ps_kat_eilute"); fd.append("nonce",NONCE); fd.append("id",id);
				/* view perduodamas, kad stulpeliu skaicius sutaptu su esamu sarasu */
				var vw=(new URLSearchParams(location.search)).get("view")||"";
				fd.append("view",vw);
				fetch(AJAX,{method:"POST",body:fd,credentials:"same-origin"})
					.then(function(r){return r.json();})
					.then(function(j){
						if(!j||!j.success||!j.data.eilute) return;
						var t=document.createElement("tbody");
						t.innerHTML=j.data.eilute;
						var nauja=t.querySelector("tr");
						if(!nauja) return;
						var buvo=tr.querySelector(".ps-zym");
						tr.replaceWith(nauja);
						/* pazymejimas islaikomas — kitaip masinis veiksmas prarastu preke */
						if(buvo && buvo.checked){ var c=nauja.querySelector(".ps-zym"); if(c) c.checked=true; }
						nauja.classList.add("psk-atnaujinta");
						setTimeout(function(){ nauja.classList.remove("psk-atnaujinta"); },1600);
					})
					.catch(function(){});
			};

			/* v8.1: UNIVERSALUS TRIGERIS. Po BET KURIOS sekmingos `ps_kat_*`
			   uzklausos atnaujinama atidarytos prekes eilute. Anksciau kiekvienas
			   irasymo blokas turejo pats apie tai prisiminti — ir puse ju
			   neprisimindavo. */
			(function(){
				var org=window.fetch;
				window.fetch=function(){
					var args=arguments, kunas=args[1]&&args[1].body;
					var veiksmas="";
					try{ if(kunas && typeof kunas.get==="function"){ veiksmas=String(kunas.get("action")||""); } }catch(e){}
					var atsakas=org.apply(this,args);
					if(veiksmas.indexOf("ps_kat_")===0 && veiksmas!=="ps_kat_eilute" && veiksmas!=="ps_kat_kortele"){
						atsakas.then(function(r){
							try{
								r.clone().json().then(function(j){
									if(j && j.success && typeof dabartinis!=="undefined" && dabartinis){
										setTimeout(function(){ window.psAtnaujintiEilute(dabartinis); },250);
									}
								}).catch(function(){});
							}catch(e){}
						}).catch(function(){});
					}
					return atsakas;
				};
			})();

			/* ---- PREKĖS KORTELĖ ---- */
			var kort=document.getElementById("pskat-kort");
			var turinys=kort.querySelector(".kort-turinys");
			var dabartinis=null;
			function eilutes(){ return Array.prototype.slice.call(document.querySelectorAll(".pskat-t tbody tr[data-id]")); }
			function rasti(id){
				var e=eilutes();
				for(var i=0;i<e.length;i++){ if(+e[i].dataset.id===+id) return e[i]; }
				return null;
			}
			function busena(tekstas, klaida, kartoti){
				turinys.innerHTML="";
				var d=document.createElement("div");
				d.className = klaida ? "kort-klaida" : "kort-kraunasi";
				d.textContent = tekstas;
				turinys.appendChild(d);
				if(kartoti){
					var b=document.createElement("button");
					b.className="kort-kartoti"; b.textContent="Bandyti dar kartą";
					b.onclick=function(){ atidaryk(kartoti); };
					d.appendChild(document.createElement("br"));
					d.appendChild(b);
				}
			}
			function inView(el){ var r=el.getBoundingClientRect(); return r.top>=60 && r.bottom<=window.innerHeight-10; }
			function atidaryk(id){
				if(!id) return;
				dabartinis=+id;
				kort.hidden=false;
				document.body.classList.add("kort-atverta");
				/* v4.5: kortelė VISADA atsidaro nuo viršaus. Iki šiol ji
				   išlaikydavo ankstesnės prekės slinkties poziciją, todėl
				   atsidarydavo per vidurį — pirmiausia matydavai ne prekės
				   pavadinimą ir kainą, o kažkurį bloką iš vidurio. */
				/* v4.6: kortelė FIXED, todėl puslapio slinkties liesti nereikia —
				   ji visada pilna nuo viršaus. Anksčiau čia buvo scrollTo(0,0),
				   bet iškart po jo `scrollIntoView` ant eilutės vėl nustumdavo
				   langą žemyn, ir kortelės viršus likdavo virš ekrano. Sąrašo
				   pozicija dabar nekeičiama — uždarius kortelę lieki ten, kur buvai. */
				kort.scrollTop=0;
				eilutes().forEach(function(tr){ tr.classList.toggle("aktyvi", +tr.dataset.id===+id); });
				var tr=rasti(id);
				if(tr && !inView(tr)) tr.scrollIntoView({block:"nearest",behavior:"auto"});
				busena("Kraunama…", false);
				/* Laiko riba: be jos nutrūkusi užklausa paliktų kortelę amžinai kraunamą */
				var ctrl = (typeof AbortController!=="undefined") ? new AbortController() : null;
				var nutrauke=false;
				var laikmatis=setTimeout(function(){
					nutrauke=true;
					if(ctrl) ctrl.abort();
					busena("Serveris neatsakė per 15 s.", true, id);
				},15000);
				fetch(AJAX+"?action=ps_kat_kortele&nonce="+NONCE+"&id="+id,
						{credentials:"same-origin", signal: ctrl ? ctrl.signal : undefined})
					.then(function(r){
						if(!r.ok) throw new Error("HTTP "+r.status);
						return r.json();
					})
					.then(function(j){
						clearTimeout(laikmatis);
						if(nutrauke) return;
						if(j && j.success && j.data && j.data.html){
							turinys.innerHTML=j.data.html;
							/* v6.9: kortelės viduje esantys moduliai paleidžiami ČIA —
							   per `innerHTML` įterptas `<script>` nepasileidžia. */
							if(window.pakuotesInit) window.pakuotesInit();
							if(window.korteleInit) window.korteleInit();
							/* v4.5: turinys pakeistas — grąžinam į viršų dar kartą,
							   nes naujas aukštis gali atstatyti seną poziciją. */
							kort.scrollTop=0;
						}
						else { busena("Serveris grąžino netikėtą atsakymą.", true, id); }
					})
					.catch(function(e){
						clearTimeout(laikmatis);
						if(nutrauke) return;
						busena("Nepavyko susisiekti su serveriu.", true, id);
					});
			}
			function uzdaryk(){
				/* v6.0: grizimas i TA PACIA vieta sarase.
				   Savininko pastaba: „isejus is prekes korteles, kataloge mane
				   ismeta visai i kita vieta, nei buvo redaguojama preke".
				   Priezastis: kortele buvo `fixed` (v4.6) ir sarasas po ja
				   likdavo ten, kur buvo, bet po uzdarymo naršykle grazindavo
				   scroll i virsu. Dabar eilute aiskiai parodoma ir pazymima. */
				var pask=dabartinis;
				kort.hidden=true;
				document.body.classList.remove("kort-atverta");
				eilutes().forEach(function(tr){ tr.classList.remove("aktyvi"); });
				dabartinis=null;
				if(pask){
					var tr=rasti(pask);
					if(tr){
						tr.classList.add("buvo");
						if(!inView(tr)) tr.scrollIntoView({block:"center",behavior:"auto"});
						setTimeout(function(){ tr.classList.remove("buvo"); }, 2600);
					}
				}
			}
			function zingsnis(kryptis){
				var e=eilutes(); if(!e.length) return;
				var i=-1;
				for(var x=0;x<e.length;x++){ if(+e[x].dataset.id===dabartinis){ i=x; break; } }
				if(i<0){ atidaryk(e[0].dataset.id); return; }
				var n=i+kryptis;
				if(n<0||n>=e.length) return;
				atidaryk(e[n].dataset.id);
			}
			document.addEventListener("click",function(e){
				var a=e.target.closest(".pskat-t .atv");
				if(a){ e.preventDefault(); atidaryk(a.dataset.id); return; }
				if(e.target.closest(".kort-x")){ uzdaryk(); return; }
				if(e.target.closest(".kort-vm")){
					var m=kort.querySelector(".kort-meniu");
					m.hidden=!m.hidden;
					return;
				}
				var vb=e.target.closest(".kort-meniu button");
				if(vb){
					var v=vb.dataset.v;
					kort.querySelector(".kort-meniu").hidden=true;
					if(!dabartinis) return;
					var pav=(kort.querySelector(".kort-pav h2")||{}).textContent||("#"+dabartinis);
					var f=new FormData();
					f.append("action","ps_kat_isimti"); f.append("nonce",NONCE);
					f.append("id",dabartinis); f.append("veiksmas",v);

					if(v==="delete"){
						var atsakymas=prompt("NEGRĮŽTAMAS VEIKSMAS\n\n"+pav+"\n\n"+
							"Prekė bus ištrinta visiškai — jos neatkursi nei iš šiukšlinės, nei kitaip.\n"+
							"Jei tikrai nori, įrašyk prekės numerį: "+dabartinis);
						if(atsakymas===null) return;
						if(String(atsakymas).trim()!==String(dabartinis)){ alert("Numeris nesutampa — neištrinta."); return; }
						f.append("patvirtinimas",dabartinis);
					} else {
						var kl={draft:"Perkelti į juodraščius?",publish:"Grąžinti į prekybą?",trash:"Perkelti į šiukšlinę?"};
						if(!confirm(kl[v]+"\n\n"+pav)) return;
					}
					vb.disabled=true;
					fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"})
						.then(function(r){ return r.json(); })
						.then(function(j){
							vb.disabled=false;
							if(j && j.success){
								var tr=rasti(j.data.id);
								if(tr){ tr.classList.add("isimta"); }
								uzdaryk();
								rodykIsemima(j.data);
							} else { alert("Nepavyko: "+((j&&j.data)||"nežinoma klaida")); }
						})
						.catch(function(){ vb.disabled=false; alert("Ryšio klaida."); });
					return;
				}
				if(!e.target.closest(".kort-veiksmai")){
					var mm=kort.querySelector(".kort-meniu");
					if(mm && !mm.hidden) mm.hidden=true;
				}
				var tb=e.target.closest(".kort-tabs button");
				if(tb){
					var t=tb.dataset.t;
					kort.querySelectorAll(".kort-tabs button").forEach(function(b){ b.classList.toggle("on", b===tb); });
					kort.querySelectorAll(".kort-pane").forEach(function(p){ p.classList.toggle("on", p.dataset.p===t); });
					kort.scrollTop=0;
					return;
				}
				if(e.target.closest(".k-next")){ zingsnis(1); return; }
				if(e.target.closest(".k-prev")){ zingsnis(-1); return; }
			});
			document.addEventListener("keydown",function(e){
				var t=e.target.tagName;
				if(t==="INPUT"||t==="SELECT"||t==="TEXTAREA") return;
				if(e.key==="Escape"&&!kort.hidden){ uzdaryk(); }
				else if(e.key==="j"){ zingsnis(1); }
				else if(e.key==="k"){ zingsnis(-1); }
				else if(e.key==="Enter"&&kort.hidden){
					var pirma=eilutes()[0]; if(pirma) atidaryk(pirma.dataset.id);
				}
			});

			/* ---- GREITAS REDAGAVIMAS: AV ir KAINA ---- */
			var redRezimas=false;
			var pak={av:{},kaina:{},sav:{}};
			var redJuosta=document.getElementById("pskat-red");
			var sgJuosta=document.getElementById("pskat-saugoti");
			var PVM=1.21;

			function langeliai(st){
				var s = st ? "td.red-lang[data-st=" + st + "]" : "td.red-lang";
				return Array.prototype.slice.call(document.querySelectorAll(s));
			}
			function kiekViso(){ return Object.keys(pak.av).length + Object.keys(pak.kaina).length + Object.keys(pak.sav).length; }
			function atnaujintiKieki(){
				var n=kiekViso();
				document.getElementById("sg-kiek").textContent=n;
				sgJuosta.hidden = (n===0);
				document.body.classList.toggle("yra-pakeitimu", n>0);
				var d=document.getElementById("sg-detalus");
				if(d){
					var a=Object.keys(pak.av).length, k=Object.keys(pak.kaina).length, sv=Object.keys(pak.sav).length;
					var t=[]; if(a) t.push(a+" likučiai"); if(k) t.push(k+" kainos"); if(sv) t.push(sv+" savikainos");
					d.textContent = t.length ? "(" + t.join(", ") + ")" : "";
				}
			}
			function ijungti(b){
				redRezimas=b;
				redJuosta.querySelector(".ijungti").hidden=b;
				redJuosta.querySelector(".red-vidus").hidden=!b;
				document.body.classList.toggle("red-rezimas",b);
				if(!b) atmesti();
			}
			function skai(v){ return parseFloat(String(v).replace(",",".")); }
			function fmt(v){ return v.toFixed(2).replace(".",","); }

			function apskaiciuoti(td,v){
				var st=td.dataset.st;
				var buvo = td.dataset.buvo==="" ? 0 : skai(td.dataset.buvo);
				var z=v[0]==="+"?1:(v[0]==="-"?-1:0);
				var sk=skai(z?v.slice(1):v);
				if(isNaN(sk)) return null;
				var tapo = z===0 ? sk : buvo + z*sk;
				if(st==="av"){ tapo=Math.round(tapo); if(tapo<0) tapo=0; }
				else { tapo=Math.round(tapo*100)/100; if(tapo<=0) return null; }
				return tapo;
			}
			function marzaSk(td,kaina){
				var c=td.dataset.cost;
				if(c==="") return null;
				var cost=skai(c), be=kaina/PVM;
				if(be<=0) return null;
				return {proc:Math.round((be-cost)/be*1000)/10, eur:Math.round((be-cost)*100)/100, cost:cost};
			}
			function atverkLangeli(td){
				var sp=td.querySelector(".av-rodo, .kaina-rodo, .sav-rodo");
				if(!sp) return;
				var st=td.dataset.st;
				var esama=pak[st][td.dataset.id];
				var inp=document.createElement("input");
				inp.type="text"; inp.className="av-ivestis";
				inp.value = esama!==undefined ? esama : "";
				inp.placeholder = td.dataset.buvo==="" ? "—" : td.dataset.buvo;
				sp.hidden=true; td.appendChild(inp);
				inp.focus(); inp.select();
			}
			function uzdarytiLangeli(td, issaugoti){
				var inp=td.querySelector(".av-ivestis");
				if(!inp) return;
				var v=inp.value.trim().replace(/\u2212/g,"-").replace(/\s+/g,"");
				inp.remove();
				var st=td.dataset.st;
				var sp=td.querySelector(".av-rodo, .kaina-rodo, .sav-rodo");
				sp.hidden=false;
				if(!issaugoti) return;
				if(v===""){ delete pak[st][td.dataset.id]; td.classList.remove("pakeista","persp"); grazintiRodini(td); atnaujintiKieki(); return; }
				/* v8.5: savikainai leidžiama 4 skaitmenys po kablelio — tiekėjų
				   kainoraščiuose taip ir ateina (7,2727), o apvalinimas iki centų
				   maržą pastumtų. */
				var geras = st==="av" ? /^[+-]?\d{1,6}$/.test(v)
					: ( st==="sav" ? /^[+-]?\d{1,6}([.,]\d{1,4})?$/.test(v) : /^[+-]?\d{1,6}([.,]\d{1,2})?$/.test(v) );
				var tapo = geras ? apskaiciuoti(td,v) : null;
				if(tapo===null){
					td.classList.add("bloga");
					setTimeout(function(){ td.classList.remove("bloga"); },900);
					return;
				}
				pak[st][td.dataset.id]=v;
				td.classList.add("pakeista");
				sp.innerHTML="";
				var b=document.createElement("b");
				b.textContent = st==="av" ? tapo : fmt(tapo);
				sp.appendChild(b);
				var i=document.createElement("i");
				var buvoT = td.dataset.buvo==="" ? "—" : (st==="av"?td.dataset.buvo:fmt(skai(td.dataset.buvo)));
				i.textContent="buvo "+buvoT;
				sp.appendChild(i);
				td.classList.remove("persp");
				if(st==="sav"){
					/* v8.5: marža persiskaičiuoja iškart — vedant savikainas
					   svarbiausia matyti, ar prekė neatsiduria žemiau ribos. */
					var kn=skai(td.dataset.kaina), gr=skai(td.dataset.grind);
					if(kn && tapo>0){
						var mp=Math.round(((kn/PVM)/tapo-1)*1000)/10;
						var mm=document.createElement("i"); mm.className="mz";
						mm.textContent="marža "+String(mp).replace(".",",")+" %";
						if(mp<0){ mm.classList.add("bad"); mm.textContent+=" · žemiau savikainos"; td.classList.add("persp"); }
						else if(mp<gr){ mm.classList.add("warn"); mm.textContent+=" · žemiau ribos"; td.classList.add("persp"); }
						sp.appendChild(mm);
					}
				}
				if(st==="kaina"){
					var m=marzaSk(td,tapo);
					if(m){
						var mm=document.createElement("i");
						mm.className="mz";
						mm.textContent="marža "+String(m.proc).replace(".",",")+" %";
						var grind=skai(td.dataset.grind);
						if(tapo < m.cost*PVM){ mm.classList.add("bad"); mm.textContent+=" · žemiau savikainos"; td.classList.add("persp"); }
						else if(m.proc < grind){ mm.classList.add("warn"); mm.textContent+=" · žemiau ribos"; td.classList.add("persp"); }
						sp.appendChild(mm);
					}
					if(td.dataset.lock==="0"){
						var u=document.createElement("i"); u.className="uzr-persp"; u.textContent="bus užrakinta";
						sp.appendChild(u);
					}
				}
				atnaujintiKieki();
			}
			function grazintiRodini(td){
				var sp=td.querySelector(".av-rodo, .kaina-rodo, .sav-rodo");
				if(!sp) return;
				if(td.dataset.st==="av"){
					sp.innerHTML = td.dataset.buvo==="" ? "<span class=\"nezinoma\">—</span>" : td.dataset.buvo;
				} else {
					sp.innerHTML = td.dataset.buvo==="" ? "<span class=\"nezinoma\">—</span>" : fmt(skai(td.dataset.buvo));
				}
			}
			function kitas(td,kryptis,tas_pats){
				var L = tas_pats ? langeliai(td.dataset.st) : langeliai();
				var i=L.indexOf(td), n=i+kryptis;
				if(i<0||n<0||n>=L.length) return null;
				return L[n];
			}
			document.addEventListener("click",function(e){
				if(e.target.closest("#red-ijungti")){ ijungti(true); return; }
				if(e.target.closest("#red-baigti")){
					if(kiekViso() && !confirm("Yra neišsaugotų pakeitimų. Atmesti?")) return;
					ijungti(false); return;
				}
				if(e.target.closest("#sg-atmesti")){ atmesti(); return; }
				if(e.target.closest("#sg-saugoti")){ saugoti(); return; }
				if(!redRezimas) return;
				var td=e.target.closest("td.red-lang");
				if(td && !td.querySelector(".av-ivestis")){
					langeliai().forEach(function(x){ if(x!==td) uzdarytiLangeli(x,true); });
					atverkLangeli(td);
				}
			});
			document.addEventListener("keydown",function(e){
				var inp=e.target.classList && e.target.classList.contains("av-ivestis") ? e.target : null;
				if(!inp) return;
				var td=inp.closest("td.red-lang");
				var kt=null;
				if(e.key==="Enter"||e.key==="ArrowDown"){ e.preventDefault(); uzdarytiLangeli(td,true); kt=kitas(td,1,true); }
				else if(e.key==="ArrowUp"){ e.preventDefault(); uzdarytiLangeli(td,true); kt=kitas(td,-1,true); }
				else if(e.key==="Tab"){ e.preventDefault(); uzdarytiLangeli(td,true); kt=kitas(td, e.shiftKey?-1:1, false); }
				else if(e.key==="Escape"){ e.preventDefault(); uzdarytiLangeli(td,false); return; }
				else { return; }
				if(kt){ atverkLangeli(kt); kt.scrollIntoView({block:"nearest"}); }
			});
			function atmesti(){
				pak={av:{},kaina:{}};
				langeliai().forEach(function(td){
					var inp=td.querySelector(".av-ivestis"); if(inp) inp.remove();
					var sp=td.querySelector(".av-rodo, .kaina-rodo, .sav-rodo");
					if(sp) sp.hidden=false;
					if(td.classList.contains("pakeista")){ td.classList.remove("pakeista","persp"); grazintiRodini(td); }
				});
				atnaujintiKieki();
			}
			function siusti(veiksmas, sar, priez){
				var f=new FormData();
				f.append("action",veiksmas); f.append("nonce",NONCE);
				f.append("pakeitimai",JSON.stringify(sar));
				if(priez) f.append("priezastis",priez);
				return fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"}).then(function(r){ return r.json(); });
			}
			function saugoti(){
				var av=Object.keys(pak.av).map(function(id){ return {id:+id, ivestis:pak.av[id]}; });
				var kn=Object.keys(pak.kaina).map(function(id){ return {id:+id, ivestis:pak.kaina[id]}; });
				var sv=Object.keys(pak.sav).map(function(id){ return {id:+id, ivestis:pak.sav[id]}; });
				if(!av.length && !kn.length && !sv.length) return;
				var zemiau=document.querySelectorAll("td.kaina-lang.persp").length;
				if(zemiau && !confirm(zemiau+" kaina(-os) krenta žemiau maržos ribos arba savikainos. Tęsti?")) return;
				var b=document.getElementById("sg-saugoti");
				b.disabled=true; b.textContent="Saugoma…";
				var priez=document.getElementById("red-priez").value;
				var darbai=[];
				if(av.length) darbai.push(siusti("ps_kat_av",av,priez));
				if(kn.length) darbai.push(siusti("ps_kat_kaina",kn,null));
				if(sv.length) darbai.push(siusti("ps_kat_sav",sv,null));
				Promise.all(darbai).then(function(rez){
					b.disabled=false; b.textContent="Išsaugoti";
					var blogas=rez.filter(function(j){ return !(j&&j.success); });
					if(blogas.length){
						alert("Dalis nepavyko: "+blogas.map(function(j){ return (j&&j.data&&j.data.zinute)||(j&&j.data)||"klaida"; }).join("; "));
					}
					rez.filter(function(j){ return j&&j.success; }).forEach(function(j){ rodykRezultata(j.data); });
					/* išsaugota — langeliai nebe „laukiantys“, o nauja tikrovė */
					langeliai().forEach(function(td){
						if(!td.classList.contains("pakeista")) return;
						var b=td.querySelector("b");
						if(b) td.dataset.buvo = td.dataset.st==="av" ? b.textContent : String(skai(b.textContent));
						td.classList.remove("pakeista","persp");
						td.classList.add("issaugota");
						if(td.dataset.st==="kaina") td.dataset.lock="1";
						var i=td.querySelectorAll("i");
						for(var q=0;q<i.length;q++){ if(i[q].className==="uzr-persp"||i[q].textContent.indexOf("buvo ")===0) i[q].remove(); }
					});
					pak={av:{},kaina:{},sav:{}}; atnaujintiKieki();
				}).catch(function(){
					b.disabled=false; b.textContent="Išsaugoti"; alert("Ryšio klaida.");
				});
			}
			function rodykIsemima(d){
				var j=document.createElement("div");
				j.className="pskat-pranes";
				var sp=document.createElement("span");
				sp.textContent=(d.zinute||"Atlikta")+": "+(d.pav||("#"+d.id));
				j.appendChild(sp);
				if(d.uzsakymuose>0){
					var u=document.createElement("div"); u.className="past";
					u.textContent="Dėmesio: ši prekė yra "+d.uzsakymuose+" užsakyme(-uose). Senos sąskaitos nepasikeičia.";
					j.appendChild(u);
				}
				var mb=document.createElement("button");
				mb.textContent="Grąžinti";
				if(d.negrizta){ mb.disabled=true; mb.textContent="Negrįžtama"; }
				mb.onclick=function(){
					if(d.negrizta) return;
					var f=new FormData();
					f.append("action","ps_kat_atsaukti"); f.append("nonce",NONCE); f.append("operacija",d.operacija);
					fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"})
						.then(function(r){return r.json();})
						.then(function(k){ if(k&&k.success){ location.reload(); } else { alert("Nepavyko grąžinti."); } });
				};
				j.appendChild(mb);
				var x=document.createElement("button"); x.className="x"; x.textContent="×";
				x.onclick=function(){ j.remove(); };
				j.appendChild(x);
				document.body.appendChild(j);
			}
			function rodykRezultata(d){
				var t="Išsaugota "+d.irasyta+" · "+d.priezastis;
				if(d.uzrakinta) t+=" · užrakinta "+d.uzrakinta;
				if(d.klaidos && d.klaidos.length) t+=" · praleista "+d.klaidos.length;
				var j=document.createElement("div");
				j.className="pskat-pranes";
				var sp=document.createElement("span"); sp.textContent=t; j.appendChild(sp);
				var pastabos=(d.eilutes||[]).filter(function(x){ return x.pastaba; });
				if(pastabos.length){
					var u=document.createElement("div"); u.className="past";
					u.textContent=pastabos.map(function(x){ return "#"+x.id+": "+x.pastaba; }).join(" · ");
					j.appendChild(u);
				}
				if(d.klaidos && d.klaidos.length){
					var kl=document.createElement("div"); kl.className="past";
					kl.textContent=d.klaidos.map(function(x){ return "#"+x.id+": "+x.kl; }).join(" · ");
					j.appendChild(kl);
				}
				var mb=document.createElement("button");
				mb.textContent="Atšaukti";
				mb.onclick=function(){
					if(!confirm("Grąžinti "+d.irasyta+" įrašus į buvusias reikšmes?")) return;
					var f=new FormData();
					f.append("action","ps_kat_atsaukti"); f.append("nonce",NONCE); f.append("operacija",d.operacija);
					fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"})
						.then(function(r){return r.json();})
						.then(function(k){ if(k&&k.success){ location.reload(); } else { alert("Nepavyko atšaukti."); } });
				};
				j.appendChild(mb);
				var x=document.createElement("button"); x.className="x"; x.textContent="×";
				x.onclick=function(){ j.remove(); };
				j.appendChild(x);
				document.body.appendChild(j);
			}
			window.addEventListener("beforeunload",function(e){
				if(kiekViso()){ e.preventDefault(); e.returnValue=""; }
			});

			/* ---- MASINIAI VEIKSMAI ---- */
			var msJuosta=document.getElementById("pskat-masine");
			var langas=document.getElementById("ps-langas");
			var msDuomenys=null;

			function zymes(){ return Array.prototype.slice.call(document.querySelectorAll("input.ps-zym")); }
			function pazymeti(){ return zymes().filter(function(c){ return c.checked; }).map(function(c){ return +c.value; }); }
			function msAtnaujinti(){
				var n=pazymeti().length;
				document.getElementById("ms-kiek").textContent=n;
				msJuosta.hidden=(n===0);
				zymes().forEach(function(c){ c.closest("tr").classList.toggle("zym", c.checked); });
				var visi=document.getElementById("ps-visi");
				if(visi){ visi.checked = n>0 && n===zymes().length; visi.indeterminate = n>0 && n<zymes().length; }
			}
			document.addEventListener("change",function(e){
				if(e.target.id==="ps-visi"){
					zymes().forEach(function(c){ c.checked=e.target.checked; });
					msAtnaujinti(); return;
				}
				if(e.target.classList && e.target.classList.contains("ps-zym")){ msAtnaujinti(); }
			});
			/* Shift pažymi ruožą */
			var paskutine=null;
			document.addEventListener("click",function(e){
				var c=e.target.classList && e.target.classList.contains("ps-zym") ? e.target : null;
				if(!c) return;
				var v=zymes(), i=v.indexOf(c);
				if(e.shiftKey && paskutine!==null){
					var a=Math.min(i,paskutine), b=Math.max(i,paskutine);
					for(var q=a;q<=b;q++){ v[q].checked=c.checked; }
					msAtnaujinti();
				}
				paskutine=i;
			});
			function langasRodyti(b){ langas.hidden=!b; }
			function msSiusti(rezimas){
				var ids=pazymeti();
				if(!ids.length) return Promise.resolve(null);
				var f=new FormData();
				f.append("action","ps_kat_masinis"); f.append("nonce",NONCE);
				f.append("veiksmas",document.getElementById("ms-veiksmas").value);
				f.append("rezimas",rezimas);
				f.append("ids",JSON.stringify(ids));
				return fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"}).then(function(r){ return r.json(); });
			}
			function esc(s){ var d=document.createElement("div"); d.textContent=s==null?"":s; return d.innerHTML; }
			function rodykPerziura(d){
				msDuomenys=d;
                document.getElementById("lg-antraste").textContent=d.pavadinimas;
				var s=document.getElementById("lg-santrauka");
				s.innerHTML="";
				var t=document.createElement("div");
				t.innerHTML="Bus paliesta <b>"+d.vykdyti.length+"</b> prekių"
					+(d.praleisti.length?" · praleista <b>"+d.praleisti.length+"</b>":"")
					+(d.ispejimu?" · <span class=persp>dėmesio: "+d.ispejimu+"</span>":"");
				s.appendChild(t);
				var v=document.getElementById("lg-turinys");
				v.innerHTML="";
				var tb=document.createElement("table"); tb.className="lg-t";
				var h=document.createElement("tr");
				h.innerHTML="<th>Prekė</th><th>Tiekėjas</th><th>Buvo</th><th>Dėmesio</th>";
				tb.appendChild(h);
				d.vykdyti.forEach(function(x){
					var tr=document.createElement("tr");
					tr.innerHTML="<td>"+esc(x.pav)+"<span class=sub>#"+x.id+"</span></td>"
						+"<td>"+esc((x.sand||"—").toUpperCase())+"</td>"
						+"<td>"+esc(x.buvo)+"</td>"
						+"<td class=d>"+(x.demesio?esc(x.demesio):"")+"</td>";
					if(x.demesio) tr.className="persp-eil";
					tb.appendChild(tr);
				});
				v.appendChild(tb);
				if(d.praleisti.length){
					var p=document.createElement("div"); p.className="lg-praleisti";
					p.textContent="Praleista: "+d.praleisti.map(function(x){ return "#"+x.id+" ("+x.kodel+")"; }).join(", ");
					v.appendChild(p);
				}
				langasRodyti(true);
			}
			document.addEventListener("click",function(e){
				if(e.target.closest("#ms-nuimti")){
					zymes().forEach(function(c){ c.checked=false; }); msAtnaujinti(); return;
				}
				if(e.target.closest("#ms-perziura")){
					var b=e.target.closest("#ms-perziura");
					b.disabled=true; b.textContent="Tikrinama…";
					msSiusti("perziura").then(function(j){
						b.disabled=false; b.textContent="Peržiūrėti →";
						if(j&&j.success){ rodykPerziura(j.data); }
						else { alert("Nepavyko: "+((j&&j.data)||"klaida")); }
					}).catch(function(){ b.disabled=false; b.textContent="Peržiūrėti →"; alert("Ryšio klaida."); });
					return;
				}
				if(e.target.closest("#lg-atsauk")){ langasRodyti(false); return; }
				if(e.target.closest("#lg-vykdyk")){
					if(!msDuomenys) return;
					var b2=e.target.closest("#lg-vykdyk");
					b2.disabled=true; b2.textContent="Vykdoma…";
					msSiusti("vykdyti").then(function(j){
						b2.disabled=false; b2.textContent="Vykdyti";
						langasRodyti(false);
						if(j&&j.success){
							pazymeti().forEach(function(id){
								var tr=rasti(id); if(tr){ tr.classList.add("isimta"); }
							});
							zymes().forEach(function(c){ c.checked=false; }); msAtnaujinti();
							rodykIsemima({zinute:"Atlikta: "+j.data.pavadinimas+" ("+j.data.atlikta+")",
								pav:"", id:"", operacija:j.data.operacija});
						} else { alert("Nepavyko: "+((j&&j.data)||"klaida")); }
					}).catch(function(){ b2.disabled=false; b2.textContent="Vykdyti"; alert("Ryšio klaida."); });
					return;
				}
				if(langas && !langas.hidden && e.target===langas){ langasRodyti(false); }
			});
			document.addEventListener("keydown",function(e){
				if(e.key==="Escape" && langas && !langas.hidden){ langasRodyti(false); }
			});
			/* v4.5: kortelės perkrovimas reikalingas kitam skriptui (nuotraukos,
			   atributai). Abu skriptai — atskiri IIFE, todėl be šio tilto
			   `atidaryk` ten būtų nepasiekiamas. */
			window.psKatAtidaryk=function(){ if(dabartinis) atidaryk(dabartinis); };
		})();
		</script>';
	}

	/** v2.9 stiliai — prirašomi prie esamų, nieko neperrašo. */
	/**
	 * v3.3 DIZAINAS pagal maketa v18.
	 *
	 * Pagrindine problema, kuria tai sprendzia: WordPress meniu atimdavo ~230 px,
	 * todel lentele netilpo ir teko salinti stulpelius (v3.1/v3.2). Taisyta ne
	 * ten, kur problema. Pilno ekrano rezimas grazina ta plota.
	 */
	/** v3.4: kortele — platus darbo langas vietoj siauros juostos. */
	/**
	 * v3.5: KORTELES REDAGAVIMO JS.
	 *
	 * Atskirai nuo saraso redagavimo, nes cia kitokia logika: viena preke,
	 * vienas laukas, tiesiogine reiksme (be +5/−2). Delegavimas naudojamas
	 * todel, kad kortele ikraunama AJAX'u — tiesioginiai listeneriai
	 * neveiktu naujam turiniui.
	 */
	private static function skriptas_v35() {
		$ajax  = esc_js( admin_url( 'admin-ajax.php' ) );
		$nonce = esc_js( wp_create_nonce( 'ps_kat' ) );
		echo '<script>(function(){
			var AJAX="' . $ajax . '", NONCE="' . $nonce . '";

			function zenklas(el, tekstas, klaida){
				var s=el.querySelector(".stat");
				if(!s){ s=document.createElement("span"); s.className="stat"; el.appendChild(s); }
				s.textContent=tekstas;
				s.style.color = klaida ? "#a52020" : "#1e7a3c";
				s.style.fontSize="12px";
				if(!klaida) setTimeout(function(){ if(s) s.textContent=""; }, 2600);
			}

			function siusti(el, laukas, id, reiksme, done){
				var f=new FormData();
				if(laukas==="_regular_price"){
					f.append("action","ps_kat_kaina"); f.append("nonce",NONCE);
					f.append("pakeitimai", JSON.stringify([{id:id, ivestis:reiksme}]));
				} else {
					f.append("action","ps_kat_laukas"); f.append("nonce",NONCE);
					f.append("id",id); f.append("laukas",laukas); f.append("reiksme",reiksme);
				}
				fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"})
					.then(function(r){return r.json();})
					.then(function(d){
						if(!d || !d.success){
							var m = (d && d.data) ? (d.data.zinute || d.data) : "nepavyko";
							zenklas(el, typeof m==="string"? m : "nepavyko", true);
							done(false);
							return;
						}
						zenklas(el, "įrašyta", false);
						/* v7.5: sarasas turi rodyti ta pati, ka kortele. */
						if(window.psAtnaujintiEilute) window.psAtnaujintiEilute(id);
						done(true, d.data);
					})
					.catch(function(){ zenklas(el,"ryšio klaida",true); done(false); });
			}

			/* v3.8: varnele siunciama is karto — Enter jai neturi prasmes. */
			/* v4.1: WordPress rengykles paleidimas, kai kortele atsidaro. */
			var REDAKTORIUS_ID="ps-apr-editor";
			function rengykleYra(){ return window.wp && wp.editor && typeof wp.editor.initialize==="function"; }
			function paleistiRengykle(){
				var ta=document.getElementById(REDAKTORIUS_ID);
				if(!ta || !rengykleYra()) return;
				try{ wp.editor.remove(REDAKTORIUS_ID); }catch(e){}
				wp.editor.initialize(REDAKTORIUS_ID, {
					tinymce:{
						/* v4.3: `table` PASALINTAS. WordPress komplekte tokio TinyMCE
						   priedo NERA (yra lists, link, paste, wordpress, wplink), todel
						   narsykle kiekviena karta metė „Failed to load plugin: table"
						   ir WP rode raudona klaidos juosta per visa ekrano auksti.
						   Lenteles nuo to nenukenčia: jos lieka tekste, rodomos ir
						   redaguojamos, o „Isvalyti koda" jas ir toliau saugo. */
						toolbar1:"bold italic bullist numlist link removeformat | formatselect | undo redo",
						plugins:"lists,link,paste,wordpress,wplink",
						block_formats:"Pastraipa=p;Antraštė=h4",
						menubar:false, statusbar:false, height:300,
						paste_as_text:false,
						/* Iklijuojant is narsykles stiliai numetami. Butent jie ir
						   yra ta sankla, del kurios aprasymai tapo neredaguojami. */
						paste_preprocess:function(pl,o){
							o.content=o.content.replace(/\sstyle="[^"]*"/gi,"")
								.replace(/<style[\s\S]*?<\/style>/gi,"")
								.replace(/\sclass="[^"]*"/gi,"");
						}
					},
					quicktags:true, mediaButtons:false
				});
			}
			function rengyklesTurinys(){
				if(rengykleYra() && window.tinymce){
					var ed=tinymce.get(REDAKTORIUS_ID);
					if(ed && !ed.isHidden()) return ed.getContent();
				}
				var ta=document.getElementById(REDAKTORIUS_ID);
				return ta ? ta.value : "";
			}
			function rengykleiIrasyti(t){
				var ta=document.getElementById(REDAKTORIUS_ID);
				if(ta) ta.value=t;
				if(window.tinymce){ var ed=tinymce.get(REDAKTORIUS_ID); if(ed) ed.setContent(t); }
			}
			/* Kortele ikraunama AJAX metodu, todel laukiam, kol textarea atsiras. */
			var stebetojas=new MutationObserver(function(){
				var ta=document.getElementById(REDAKTORIUS_ID);
				if(ta && !ta.dataset.paleista){ ta.dataset.paleista="1"; setTimeout(paleistiRengykle,120); }
			});
			stebetojas.observe(document.body,{childList:true,subtree:true});

			/* Tekstas / HTML kodas perjungimas */
			document.addEventListener("click", function(e){
				var b=e.target;
				if(!b.classList || !b.classList.contains("ka-rez")) return;
				var kodas=b.classList.contains("ka-rez-kodas");
				b.parentElement.querySelectorAll(".ka-rez").forEach(function(x){ x.classList.toggle("on", x===b); });
				if(window.switchEditors){ switchEditors.go(REDAKTORIUS_ID, kodas ? "html" : "tmce"); }
			});

			/* v6.9: GPAIS PAKUOCIU REDAKTORIUS.
			   Duomenys imami is `data-` atributu, o ne is `<script>` bloko —
			   kortele ikraunama per `innerHTML`, todel skriptai joje negyvi. */
			/* v7.0: LIKUTIS IR KATEGORIJOS KORTELEJE.
			   Paleidziama kartu su pakuotemis — is `atidaryk()`, nes kortele
			   ikraunama per `innerHTML` ir jos viduje esantys skriptai negyvi. */
			window.korteleInit=function(){
				/* --- LIKUTIS --- */
				var L=document.querySelector(".kort-lik");
				if(L && !L.dataset.paleista){
					L.dataset.paleista="1";
					var LID=parseInt(L.dataset.id,10);
					var inp=L.querySelector(".kort-lik-in"), st=L.querySelector(".kort-lik-stat");
					var priez=L.querySelector(".kort-lik-priez"), gav=L.querySelector(".kort-lik-gav");
					/* Gavimo laukai matomi tik tada, kai turi prasme: priezastis
					   „Gavimas" arba pridedamas kiekis. */
					function gavRodyti(){
						var v=(inp.value||"").trim();
						var pridedam = v.charAt(0)==="+" || (/^\d+$/.test(v) && priez.value==="gavimas");
						gav.classList.toggle("on", priez.value==="gavimas" || (pridedam && priez.value==="gavimas"));
					}
					priez.addEventListener("change",gavRodyti);
					inp.addEventListener("input",gavRodyti);
					gavRodyti();
					var irasyti=function(){
						var v=(inp.value||"").trim().replace("−","-");
						if(!/^[+-]?\d{1,6}$/.test(v)){ st.textContent="įrašyk 12, +3 arba −2"; st.className="kort-lik-stat kl"; inp.focus(); return; }
						st.textContent="saugoma…"; st.className="kort-lik-stat";
						var fd=new FormData();
						fd.append("action","ps_kat_av"); fd.append("nonce",NONCE);
						fd.append("priezastis", priez.value);
						fd.append("pakeitimai", JSON.stringify([{id:LID, ivestis:v}]));
						if(priez.value==="gavimas"){
							fd.append("geriausia_iki", (L.querySelector(".kort-lik-gal")||{}).value||"");
							fd.append("savikaina", (L.querySelector(".kort-lik-sav")||{}).value||"");
						}
						fetch(AJAX,{method:"POST",body:fd,credentials:"same-origin"})
							.then(function(r){return r.json();})
							.then(function(j){
								if(!j||!j.success){ st.textContent=(j&&j.data)?(j.data.zinute||j.data):"nepavyko"; st.className="kort-lik-stat kl"; return; }
								var e=(j.data.eilutes||[])[0];
								if(e){ L.querySelector(".kort-lik-dabar").textContent=e.tapo+" vnt.";
									st.textContent="buvo "+e.buvo+" → "+e.tapo
										+(e.partija?" · sukurta partija #"+e.partija:"")
										+(e.pastaba?" · "+e.pastaba:""); }
								else { st.textContent="įrašyta"; }
								st.className="kort-lik-stat ok"; inp.value="";
								if(window.psAtnaujintiEilute) window.psAtnaujintiEilute(LID);
								if(e && (e.partija || (v.charAt(0)==="-"))){
									/* Nauja partija — kortele perpiesiama, kad lenteleje
									   atsirastu eilute su galiojimu. */
									setTimeout(function(){
										var a=document.querySelector(".pskat-t tr[data-id=\"__ID__\"] .atv".replace("__ID__",LID));
										if(a) a.click();
									},900);
								}
							})
							.catch(function(){ st.textContent="ryšio klaida"; st.className="kort-lik-stat kl"; });
					};
					L.querySelector(".kort-lik-irasyti").onclick=irasyti;
					inp.addEventListener("keydown",function(ev){ if(ev.key==="Enter"){ ev.preventDefault(); irasyti(); } });
				}

				/* --- v8.3: BUSENA --- */
				var BS=document.querySelector(".kort-busena");
				if(BS && !BS.dataset.paleista){
					BS.dataset.paleista="1";
					var BID=parseInt(BS.dataset.id,10);
					var bmyg=BS.querySelector(".kb-keisti"), bst=BS.querySelector(".kb-stat");
					bmyg.onclick=function(){
						var yra=BS.classList.contains("yra");
						if(yra && !confirm("Išimti prekę iš prekybos?\n\nPirkėjas jos nebematys, o automatika negrąžins.")) return;
						bst.textContent="saugoma…"; bmyg.disabled=true;
						var fd=new FormData();
						fd.append("action","ps_kat_busena"); fd.append("nonce",NONCE); fd.append("id",BID);
						fetch(AJAX,{method:"POST",body:fd,credentials:"same-origin"})
							.then(function(r){return r.json();})
							.then(function(j){
								bmyg.disabled=false;
								if(!j||!j.success){ bst.textContent=(j&&j.data)?(j.data.zinute||j.data):"nepavyko"; return; }
								var p=j.data.prekyboje;
								BS.classList.toggle("yra",p); BS.classList.toggle("ne",!p);
								BS.querySelector(".kb-tekstas").textContent=p?"Prekyboje":"Juodraštyje";
								BS.querySelector(".kb-paaisk").textContent=p?"pirkėjas mato":"pirkėjas nemato";
								bmyg.textContent=p?"Išimti iš prekybos":"Grąžinti į prekybą";
								bst.textContent=j.data.pavyko?"":"būsena nepasikeitė — prekė išimta ranka";
								if(window.psAtnaujintiEilute) window.psAtnaujintiEilute(BID);
							})
							.catch(function(){ bmyg.disabled=false; bst.textContent="ryšio klaida"; });
					};
				}

				/* --- v8.0: TIEKEJO LIKUTIS (Ambrosia, Prins ir kiti be XML) --- */
				var T=document.querySelector(".kort-tiek-irasyti");
				if(T && !T.dataset.paleista){
					T.dataset.paleista="1";
					var TID=parseInt(document.querySelector(".kort-lik").dataset.id,10);
					var tin=document.querySelector(".kort-tiek-in"), tst=document.querySelector(".kort-tiek-stat");
					var tirasyti=function(){
						var v=(tin.value||"").trim().replace("−","-");
						if(!/^[+-]?\d{1,6}$/.test(v)){ tst.textContent="įrašyk 12, +3 arba −2"; tst.className="kort-tiek-stat kl"; tin.focus(); return; }
						tst.textContent="saugoma…"; tst.className="kort-tiek-stat";
						var fd=new FormData();
						fd.append("action","ps_kat_tiekejo_likutis"); fd.append("nonce",NONCE);
						fd.append("id",TID); fd.append("ivestis",v);
						fetch(AJAX,{method:"POST",body:fd,credentials:"same-origin"})
							.then(function(r){return r.json();})
							.then(function(j){
								if(!j||!j.success){ tst.textContent=(j&&j.data)?(j.data.zinute||j.data):"nepavyko"; tst.className="kort-tiek-stat kl"; return; }
								document.querySelector(".kort-tiek-dabar").textContent=j.data.tapo+" vnt.";
								tst.textContent="buvo "+j.data.buvo+" → "+j.data.tapo; tst.className="kort-tiek-stat ok";
								tin.value="";
								if(window.psAtnaujintiEilute) window.psAtnaujintiEilute(TID);
							})
							.catch(function(){ tst.textContent="ryšio klaida"; tst.className="kort-tiek-stat kl"; });
					};
					T.onclick=tirasyti;
					tin.addEventListener("keydown",function(ev){ if(ev.key==="Enter"){ ev.preventDefault(); tirasyti(); } });
				}

				/* --- KATEGORIJOS --- */
				var K=document.querySelector(".kort-kat");
				if(K && !K.dataset.paleista){
					K.dataset.paleista="1";
					var KID=parseInt(K.dataset.id,10), D={visos:[],turi:[]};
					try{ D=JSON.parse(K.querySelector(".kort-kat-duom").textContent)||D; }catch(e){}
					var pasirinkta=(D.turi||[]).slice();
					var lauk=K.querySelector(".kort-kat-lauk"), sar=K.querySelector(".kort-kat-sar");
					var kst=K.querySelector(".kort-kat-stat");
					function ke(t){ return String(t==null?"":t).replace(/[&<>"]/g,function(c){
						return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; }); }
					function sarasas(q){
						q=(q||"").toLowerCase().trim();
						var rodyti=(D.visos||[]).filter(function(x){
							return pasirinkta.indexOf(x.id)>=0 || !q || x.v.toLowerCase().indexOf(q)>=0; });
						if(!q) rodyti=rodyti.slice(0,80);
						sar.innerHTML=rodyti.map(function(x){
							return "<label class=\"kort-kat-e\"><input type=\"checkbox\" value=\""+x.id+"\""
								+(pasirinkta.indexOf(x.id)>=0?" checked":"")+"><span>"+ke(x.v)+"</span>"
								+"<i>"+x.n+"</i></label>"; }).join("")
							|| "<div class=\"kort-info-m\">Pagal šį žodį kategorijų nerasta.</div>";
						sar.querySelectorAll("input").forEach(function(c){
							c.onchange=function(){
								var id=parseInt(this.value,10), i=pasirinkta.indexOf(id);
								if(this.checked){ if(i<0) pasirinkta.push(id); } else if(i>=0){ pasirinkta.splice(i,1); }
								kst.textContent="pažymėta: "+pasirinkta.length; kst.className="kort-kat-stat";
							};
						});
					}
					K.querySelector(".kort-kat-keisti").onclick=function(){
						lauk.hidden=!lauk.hidden;
						if(!lauk.hidden){ sarasas(""); K.querySelector(".kort-kat-q").focus(); }
					};
					K.querySelector(".kort-kat-q").addEventListener("input",function(){ sarasas(this.value); });
					K.querySelector(".kort-kat-atsisakyti").onclick=function(){
						pasirinkta=(D.turi||[]).slice(); lauk.hidden=true; kst.textContent=""; };
					K.querySelector(".kort-kat-irasyti").onclick=function(){
						if(!pasirinkta.length && !confirm("Palikti prekę BE kategorijų?\n\nTokios prekės pirkėjas kataloge neras.")) return;
						kst.textContent="saugoma…"; kst.className="kort-kat-stat";
						var fd=new FormData();
						fd.append("action","ps_kat_kategorijos"); fd.append("nonce",NONCE);
						fd.append("id",KID); fd.append("kategorijos",JSON.stringify(pasirinkta));
						fetch(AJAX,{method:"POST",body:fd,credentials:"same-origin"})
							.then(function(r){return r.json();})
							.then(function(j){
								if(!j||!j.success){ kst.textContent=(j&&j.data)?(j.data.zinute||j.data):"nepavyko"; kst.className="kort-kat-stat kl"; return; }
								D.turi=pasirinkta.slice();
								K.querySelector(".kort-kat-rodo").innerHTML=(j.data.kategorijos||[])
									.map(function(v){ return "<span class=\"kort-kat-z\">"+ke(v)+"</span>"; }).join("")
									|| "<span class=\"kort-kat-nera\">Prekė nepriskirta jokiai kategorijai.</span>";
								lauk.hidden=true;
								kst.textContent="įrašyta · "+j.data.kiek; kst.className="kort-kat-stat ok";
								if(window.psAtnaujintiEilute) window.psAtnaujintiEilute(KID);
							})
							.catch(function(){ kst.textContent="ryšio klaida"; kst.className="kort-kat-stat kl"; });
					};
				}
			};

			window.pakuotesInit=function(){
				var BLK=document.querySelector(".kort-pak");
				if(!BLK || BLK.dataset.paleista) return;
				BLK.dataset.paleista="1";
				var ID=parseInt(BLK.dataset.id,10);
				var EIL=[], MED={}, TIP={};
				try{ EIL=JSON.parse(BLK.dataset.eil||"[]"); }catch(e){ EIL=[]; }
				try{ MED=JSON.parse(BLK.dataset.med||"{}"); }catch(e){ MED={}; }
				try{ TIP=JSON.parse(BLK.dataset.tip||"{}"); }catch(e){ TIP={}; }
				var redaguojama=null;

				function e2(t){ return String(t==null?"":t).replace(/[&<>"]/g,function(c){
					return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; }); }
				function stat(t,kl){ var e=BLK.querySelector(".kpak-stat"); if(!e) return;
					e.textContent=t||""; e.className="kpak-stat"+(kl?" "+kl:""); }

				function piesti(){
					var z=BLK.querySelector(".kort-pak-zyme");
					if(z){ z.className="kort-p "+(EIL.length?"ok":"warn");
						z.textContent=EIL.length?(EIL.length+" eilutės"):"neįvesta"; }
					var h="";
					if(!EIL.length){
						h=\'<div class="tuscia-t">Pakuotės dar neaprašytos. Jos reikalingos toms prekėms, kurias įvežate patys — \'
							+\'importuotos prekės pakuotes deklaruojate jūs, o pirktas Lietuvoje deklaruoja tiekėjas.</div>\';
					} else {
						h=\'<table class="kort-t kort-pak-t"><tr><th>Pakuotė</th><th>Tipas</th><th>Medžiaga</th>\'
							+\'<th class="n">Svoris</th><th class="n">Vnt. pak.</th><th>Kur atsiduria</th><th></th></tr>\';
						EIL.forEach(function(p,i){
							var tv=(TIP[p.tip]||p.tip||"").split(" — ")[0];
							h+=\'<tr><td>\'+e2(p.pav||"—")+\'</td><td>\'+e2(tv)+\'</td><td>\'+e2(p.med||"—")+\'</td>\'
								+\'<td class="n">\'+String(p.sv).replace(".",",")+\' g</td>\'
								+\'<td class="n">\'+p.vnt+\'</td>\'
								+\'<td>\'+(p.su?\'<span class="z ok">klientui</span>\':\'<span class="z">lieka pas mus</span>\')+\'</td>\'
								+\'<td class="n"><button type="button" class="kpak-red" data-i="\'+i+\'">Keisti</button>\'
								+\'<button type="button" class="kpak-tr" data-i="\'+i+\'">Ištrinti</button></td></tr>\';
						});
						h+=\'</table>\';
					}
					BLK.querySelector(".kort-pak-sar").innerHTML=h;
				}

				function forma(p){
					var e=p||{id:0,pav:"",tip:"pirmine",med:"Plastikas",sv:"",vnt:1,su:1};
					var mo="",to="";
					Object.keys(MED).forEach(function(k){ mo+=\'<option value="\'+e2(k)+\'"\'+(k===e.med?" selected":"")+\'>\'+e2(MED[k])+\'</option>\'; });
					Object.keys(TIP).forEach(function(k){ to+=\'<option value="\'+e2(k)+\'"\'+(k===e.tip?" selected":"")+\'>\'+e2(TIP[k])+\'</option>\'; });
					var h=\'<div class="kort-pak-forma">\'
						+\'<div class="kpf-eil"><label>Kas tai<input type="text" class="kpf-pav" value="\'+e2(e.pav)+\'" placeholder="dėžutė, maišelis, plėvelė…"></label>\'
						+\'<label>Tipas<select class="kpf-tip">\'+to+\'</select></label></div>\'
						+\'<div class="kpf-eil"><label>Medžiaga<select class="kpf-med">\'+mo+\'</select></label>\'
						+\'<label>Svoris, g<input type="text" class="kpf-sv" value="\'+e2(e.sv)+\'" placeholder="15,5"></label>\'
						+\'<label>Vienetų pakuotėje<input type="number" min="1" class="kpf-vnt" value="\'+e.vnt+\'"></label></div>\'
						+\'<div class="kpf-eil"><label class="kpf-var"><input type="checkbox" class="kpf-su"\'+(e.su?" checked":"")+\'> Ši pakuotė keliauja klientui</label></div>\'
						+\'<div class="kpf-myg"><button type="button" class="kpf-irasyti">Įrašyti</button>\'
						+\'<button type="button" class="kpf-atsisakyti">Atsisakyti</button></div></div>\';
					BLK.querySelector(".kort-pak-sar").insertAdjacentHTML("beforeend",h);
					var f=BLK.querySelector(".kort-pak-forma");
					f.querySelector(".kpf-pav").focus();
					f.querySelector(".kpf-atsisakyti").onclick=function(){ redaguojama=null; piesti(); stat(""); };
					f.querySelector(".kpf-irasyti").onclick=function(){
						var d={ id:e.id,
							pavadinimas:f.querySelector(".kpf-pav").value.trim(),
							tipas:f.querySelector(".kpf-tip").value,
							medziaga:f.querySelector(".kpf-med").value,
							svoris_g:f.querySelector(".kpf-sv").value.trim(),
							vienetu_pakuoteje:f.querySelector(".kpf-vnt").value,
							tiekiama_su_preke:f.querySelector(".kpf-su").checked?1:0 };
						if(!parseFloat(String(d.svoris_g).replace(",","."))){
							stat("įrašyk svorį gramais","kl"); f.querySelector(".kpf-sv").focus(); return; }
						siusti("irasyti",d);
					};
				}

				function siusti(veiksmas,d){
					stat("saugoma…");
					var fd=new FormData();
					fd.append("action","ps_kat_pakuote"); fd.append("nonce",NONCE);
					fd.append("id",ID); fd.append("veiksmas",veiksmas);
					fd.append("duomenys",JSON.stringify(d||{}));
					fetch(AJAX,{method:"POST",body:fd,credentials:"same-origin"})
						.then(function(r){return r.json();})
						.then(function(j){
							if(!j||!j.success){ stat((j&&j.data)?(j.data.zinute||j.data):"nepavyko","kl"); return; }
							EIL=j.data.eilutes||[]; redaguojama=null; piesti();
							stat(veiksmas==="trinti"?"eilutė ištrinta":"įrašyta","ok");
						})
						.catch(function(){ stat("ryšio klaida","kl"); });
				}

				BLK.addEventListener("click",function(ev){
					var b=ev.target;
					if(!b || b.tagName!=="BUTTON") return;
					if(b.classList.contains("kpak-nauja")){
						if(BLK.querySelector(".kort-pak-forma")) return;
						redaguojama=-1; piesti(); forma(null); return;
					}
					if(b.classList.contains("kpak-red")){ var i=+b.dataset.i; redaguojama=i; piesti(); forma(EIL[i]); return; }
					if(b.classList.contains("kpak-tr")){
						var j2=+b.dataset.i, p=EIL[j2];
						if(!confirm("Ištrinti pakuotės eilutę „"+(p.pav||p.tip)+"“?\n\nDeklaracijos skaičiai persiskaičiuos.")) return;
						siusti("trinti",{id:p.id});
					}
				});
				piesti();
			};

			/* v6.4: trumpo aprasymo redaktorius. Atskiras nuo pagrindinio —
			   kitas laukas, kita istorija, kitas uzraktas. */
			document.addEventListener("click", function(e){
				var b=e.target;
				if(!b || b.tagName!=="BUTTON") return;
				var blk=b.closest(".kort-tr-red");
				if(!blk) return;
				var id=blk.dataset.id, ta=blk.querySelector(".kort-tr-txt"), st=blk.querySelector(".kt-stat");
				/* v6.5: rezimo perjungimas — turinys konvertuojamas VIETOJE,
				   kad neirasyti pakeitimai nedingtu. */
				if(b.classList.contains("kt-rez")){
					var iKoda=b.classList.contains("kt-rez-kodas");
					var dabarKodas=blk.querySelector(".kt-rez-kodas").classList.contains("on");
					if(iKoda===dabarKodas) return;
					if(iKoda){
						var eil=ta.value.split(/\n/).map(function(x){return x.trim();}).filter(Boolean);
						ta.value=eil.map(function(x){
							return "<p>"+x.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</p>";
						}).join("\n");
					} else {
						var d=document.createElement("div");
						d.innerHTML=ta.value.replace(/<\/p>|<br\s*\/?>/gi,"\n");
						ta.value=(d.textContent||"").split(/\n/).map(function(x){return x.trim();}).filter(Boolean).join("\n");
					}
					blk.querySelectorAll(".kt-rez").forEach(function(x){ x.classList.toggle("on", x===b); });
					return;
				}
				var veiksmas = b.classList.contains("kt-irasyti") ? "trumpas"
				             : b.classList.contains("kt-atsaukti") ? "trumpas_atsaukti" : "";
				if(!veiksmas) return;
				if(veiksmas==="trumpas_atsaukti" && !confirm("Grąžinti ankstesnę trumpo aprašymo versiją?")) return;
				var f=new FormData();
				f.append("action","ps_kat_aprasymas"); f.append("nonce",NONCE);
				f.append("id",id); f.append("veiksmas",veiksmas);
				if(veiksmas==="trumpas"){
					f.append("tekstas", ta.value);
					f.append("rezimas", blk.querySelector(".kt-rez-kodas").classList.contains("on") ? "kodas" : "tekstas");
				}
				b.disabled=true; st.textContent="…"; st.className="kt-stat";
				fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"})
					.then(function(r){return r.json();})
					.then(function(d){
						b.disabled=false;
						if(!d || !d.success){ st.textContent=(d&&d.data)?(d.data.zinute||d.data):"nepavyko"; st.className="kt-stat kl"; return; }
						var x=d.data;
						if(x.nepakito){ st.textContent="tekstas nepakito"; st.className="kt-stat"; return; }
						if(x.grazinta){
							var dd=document.createElement("div");
							dd.innerHTML=(x.tekstas||"").replace(/<\/p>|<br\s*\/?>/gi,"\n");
							ta.value=(dd.textContent||"").split(/\n/).map(function(y){return y.trim();}).filter(Boolean).join("\n");
							blk.querySelectorAll(".kt-rez").forEach(function(y){ y.classList.toggle("on", y.classList.contains("kt-rez-tekstas")); });
							st.textContent="grąžinta versija nuo "+x.data; st.className="kt-stat ok"; return; }
						/* Po irasymo laukas rodo tai, KAS realiai issaugota. */
						if(!blk.querySelector(".kt-rez-kodas").classList.contains("on") && x.plokscias!==undefined){ ta.value=x.plokscias; }
						else if(x.tekstas!==undefined){ ta.value=x.tekstas; }
						st.textContent="įrašyta · "+x.ilgis+" simb."+(x.nuvalyta>0?" · išvalyta "+x.nuvalyta+" simb. kodo":"");
						st.className="kt-stat ok";
					})
					.catch(function(){ b.disabled=false; st.textContent="ryšio klaida"; st.className="kt-stat kl"; });
			});

			/* v3.9: aprasymo redaktorius. */
			document.addEventListener("click", function(e){
				var b=e.target;
				if(!b || b.tagName!=="BUTTON") return;
				var blk=b.closest(".kort-apr-red");
				if(!blk) return;
				var id=blk.dataset.id, ta=blk.querySelector(".kort-apr-txt"),
				    st=blk.querySelector(".ka-stat");
				var veiksmas = b.classList.contains("ka-irasyti") ? "irasyti"
				             : b.classList.contains("ka-sudelioti") ? "sudelioti"
				             : b.classList.contains("ka-karkasas") ? "karkasas"
				             : b.classList.contains("ka-atsaukti") ? "atsaukti"
				             : b.classList.contains("ka-valyti") ? "valyti_dry" : "";
				if(!veiksmas) return;
				if(veiksmas==="karkasas" && !confirm("Pridėti šiai kategorijai reikalingas antraštes?\nEsamas tekstas liks po pirmąja antrašte.")) return;
				if(veiksmas==="atsaukti" && !confirm("Grąžinti ankstesnę aprašymo versiją?")) return;

				var f=new FormData();
				f.append("action","ps_kat_aprasymas"); f.append("nonce",NONCE);
				f.append("id",id); f.append("veiksmas",veiksmas);
				if(veiksmas==="irasyti" || veiksmas==="sudelioti") f.append("tekstas", rengyklesTurinys());
				if(veiksmas==="sudelioti" && !confirm("Sudėlioti tekstą į lentynėles?\n\nAntraštės bus atpažintos automatiškai, ankstesnė versija išsaugoma.")) { b.disabled=false; return; }

				b.disabled=true; st.textContent="…"; st.className="ka-stat";
				fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"})
					.then(function(r){return r.json();})
					.then(function(d){
						b.disabled=false;
						if(!d || !d.success){
							st.textContent = (d && d.data) ? (d.data.zinute||d.data) : "nepavyko";
							st.className="ka-stat kl"; return;
						}
						var x=d.data;
						if(x.nepakito){ st.textContent="tekstas nepakito"; st.className="ka-stat"; return; }
						if(x.nieko){ st.textContent=x.zinute; st.className="ka-stat"; return; }
						if(x.sankla_proc!==undefined){
							/* Valymo PERZIURA: parodom skaicius ir klausiam. */
							var z="Buvo "+x.buvo_simb+" simb., liks "+x.tapo_simb+" ("+x.sankla_proc+" % šiukšlių).\n"
								+"Lentelės: "+x.lenteliu+" → "+x.lenteliu_po+"\n\nIšvalyti?";
							if(confirm(z)){
								var f2=new FormData();
								f2.append("action","ps_kat_aprasymas"); f2.append("nonce",NONCE);
								f2.append("id",id); f2.append("veiksmas","valyti");
								fetch(AJAX,{method:"POST",body:f2,credentials:"same-origin"})
									.then(function(r){return r.json();})
									.then(function(d2){
										if(!d2||!d2.success){ st.textContent=(d2&&d2.data)?d2.data:"nepavyko"; st.className="ka-stat kl"; return; }
										rengykleiIrasyti(d2.data.tekstas);
										st.textContent="išvalyta: "+d2.data.buvo+" → "+d2.data.tapo+" simb.";
										st.className="ka-stat ok";
									});
							} else { st.textContent="atšaukta"; st.className="ka-stat"; }
							return;
						}
						if(x.sudelieta){
							rengykleiIrasyti(x.tekstas);
							st.textContent="sudėta į "+x.sekcijos.length+" skiltis: "+x.sekcijos.join(", ")
								+(x.perkelta?" · "+x.perkelta+" eil. liko aprašyme":"");
							st.className="ka-stat ok";
							/* v8.2: kortele perpiesiama is serverio — kitaip rengykleje
							   lieka senas tekstas ir atrodo, kad mygtukas neveikia. */
							setTimeout(function(){
								var a=document.querySelector(".pskat-t tr[data-id=\"__ID__\"] .atv".replace("__ID__",id));
								if(a) a.click();
							},1200);
							return; }
						if(x.karkasas){ rengykleiIrasyti(x.tekstas);
							st.textContent="pridėta: "+x.pridetos.join(", "); st.className="ka-stat ok"; return; }
						if(x.grazinta){ st.textContent="grąžinta versija nuo "+x.data;
							st.className="ka-stat ok"; setTimeout(function(){ location.reload(); },1200); return; }
						st.textContent="įrašyta · "+x.ilgis+" simb."+(x.sekcijos?" · "+x.sekcijos+" sekcijos":"");
						st.className="ka-stat ok";
					})
					.catch(function(){ b.disabled=false; st.textContent="ryšio klaida"; st.className="ka-stat kl"; });
			});

			document.addEventListener("change", function(e){
				var inp=e.target;
				if(!inp || inp.type!=="checkbox") return;
				var el=inp.closest(".kort-varnele");
				if(!el) return;
				var v = inp.checked ? "yes" : "";
				inp.disabled=true;
				siusti(el, el.dataset.laukas, el.dataset.id, v, function(ok){
					inp.disabled=false;
					if(!ok){ inp.checked=!inp.checked; }
				});
			});

			/* v4.2: GYVA MARZA — skaicius keiciasi berasant, ne tik po Enter.
			   Formule ta pati kaip serveryje: (kaina/(1+PVM) − savikaina) / kaina be PVM. */
			function marzaGyvai(){
				var b=document.querySelector(".kort-marza");
				if(!b || b.dataset.grind===undefined) return;
				var grind=parseFloat(b.dataset.grind||"0"), pvm=parseFloat(b.dataset.pvm||"0.21");
				var kIn=document.querySelector(".kort-kaina input");
				var kaina=kIn?parseFloat(String(kIn.value).replace(",",".")):NaN;
				var cIn=document.querySelector(".kort-red[data-laukas=_cost_price] input");
				var cost=cIn?parseFloat(String(cIn.value).replace(",",".")):parseFloat(b.dataset.cost||"");
				if(!(kaina>0)||!(cost>0)||isNaN(cost)){ return; }
				var be=kaina/(1+pvm), m=(be-cost)/be*100, me=be-cost;
				var kl=m<grind?"m_bad":(m<grind+5?"m_warn":"m_ok");
				b.className="kort-marza "+kl;
				b.textContent=m.toFixed(1).replace(".",",")+" % · "+me.toFixed(2).replace(".",",")+" €";
			}
			document.addEventListener("input", function(e){
				var el=e.target;
				if(!el || el.tagName!=="INPUT") return;
				var r=el.closest(".kort-red");
				if(!r) return;
				/* v4.4: pakeistas laukas i\u0161kart nusida\u017eo geltonai */
				el.classList.toggle("purvinas", el.value.trim() !== (el.dataset.buvo||""));
				if(typeof juostaAtnaujinti==="function") juostaAtnaujinti();
				if(r.classList.contains("kort-kaina") || r.dataset.laukas==="_cost_price"){ marzaGyvai(); }
			});
			/* v4.8: pavadinimo laukas — ta pati juosta kaip kitiems laukams. */
			document.addEventListener("input", function(e){
				var el=e.target;
				if(!el || !el.classList || !el.classList.contains("kort-pav-in")) return;
				if(el.dataset.buvo===undefined) el.dataset.buvo=el.defaultValue||"";
				el.classList.toggle("purvinas", el.value.trim() !== (el.dataset.buvo||"").trim());
				juostaAtnaujinti();
			});

			/* v4.4: SARGAS \u2014 kortel\u0117s ne\u012fra\u0161yti laukai nebedingsta tyliai.
			   Capture faz\u0117 suveikia PRIE\u0160 u\u017edarymo/navigacijos logik\u0105. */
			function kortPurvinu(){ return document.querySelectorAll(".pskat-kort input.purvinas").length; }
			document.addEventListener("click", function(e){
				var b=e.target.closest(".kort-x,.k-prev,.k-next");
				if(!b || !kortPurvinu()) return;
				if(!confirm("Kortel\u0117je yra pakeist\u0173, bet ne\u012fra\u0161yt\u0173 lauk\u0173 (geltoni). I\u0161eiti ir prarasti pakeitimus?")){
					e.preventDefault(); e.stopImmediatePropagation();
				}
			}, true);
			window.addEventListener("beforeunload", function(e){
				if(kortPurvinu()){ e.preventDefault(); e.returnValue=""; }
			});

			/* v4.4: SKU/EAN kopijavimas vienu paspaudimu */
			document.addEventListener("click", function(e){
				var b=e.target.closest(".kort-kopij");
				if(!b) return;
				var v=b.dataset.kop||"";
				function pavyko(){ var t=b.textContent; b.textContent="\u2713"; setTimeout(function(){ b.textContent=t; },1200); }
				if(navigator.clipboard && navigator.clipboard.writeText){
					navigator.clipboard.writeText(v).then(pavyko, function(){});
				} else {
					var ta=document.createElement("textarea"); ta.value=v; document.body.appendChild(ta);
					ta.select(); try{ document.execCommand("copy"); pavyko(); }catch(x){} ta.remove();
				}
			});

			/* ============ v4.8: NEIRASYTI PAKEITIMAI ============
			   Problema, kuria tai sprendzia: irasymas vyko per Enter, kurio
			   nesimato, o sargas kabejo tik ant × ir ←/→. Uzdarant Esc klavisu arba
			   paspaudus kita preke sarase pakeitimai dingdavo tyliai. */
			function purvini(){
				return Array.prototype.slice.call(
					document.querySelectorAll(".pskat-kort .kort-red input.purvinas, .pskat-kort .kort-pav-in.purvinas, .pskat-kort .pt-red input.purvinas"));
			}
			function purviniVardai(){
				return purvini().map(function(i){
					if(i.classList.contains("kort-pav-in")) return "Pavadinimas";
					var pt2=i.closest(".pt-red");
					if(pt2){
						var v2={kiekis_liko:"Partijos likutis",savikaina_eur:"Partijos savikaina",geriausia_iki:"Geriausia iki"};
						return v2[pt2.dataset.laukas]||"Partija";
					}
					var eil=i.closest(".kort-eil");
					if(eil && eil.querySelector("span")) return eil.querySelector("span").textContent.trim();
					return "laukas";
				});
			}
			function juostaAtnaujinti(){
				var j=document.getElementById("kort-saugoti");
				if(!j) return;
				var n=purvini().length;
				j.hidden = n===0;
				if(n){
					j.querySelector(".kiek b").textContent=n;
					j.querySelector(".ks-ka").textContent="· "+purviniVardai().join(", ");
					j.querySelector(".ks-klaida").textContent="";
				}
			}
			/* Vienas laukas — vienas iraso kelias. Juosta ir Enter daro TA PATI. */
			function irasytiLauka(inp, done){
				var v=inp.value.trim();
				/* v5.5: partijos laukas turi savo kelia */
				var pt=inp.closest(".pt-red");
				if(pt){
					var ptr=pt.closest("tr");
					var f3=new FormData();
					f3.append("action","ps_kat_partija"); f3.append("nonce",NONCE);
					f3.append("part",ptr.dataset.part); f3.append("id",ptr.dataset.id);
					f3.append("laukas",pt.dataset.laukas); f3.append("reiksme",v);
					fetch(AJAX,{method:"POST",body:f3,credentials:"same-origin"})
						.then(function(r){return r.json();})
						.then(function(d){
							if(d&&d.success){ inp.dataset.buvo=v; inp.classList.remove("purvinas"); done(true); }
							else { done(false,(d&&d.data)?(d.data.zinute||d.data):"nepavyko"); }
						})
						.catch(function(){ done(false,"ryšio klaida"); });
					return;
				}
				if(inp.classList.contains("kort-pav-in")){
					var blk=inp.closest(".kort-pav-red");
					var f=new FormData();
					f.append("action","ps_kat_pavadinimas"); f.append("nonce",NONCE);
					f.append("id",blk.dataset.id); f.append("tekstas",v);
					fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"})
						.then(function(r){return r.json();})
						.then(function(d){
							if(d&&d.success){
								inp.dataset.buvo=v; inp.classList.remove("purvinas");
								var h=document.querySelector(".kort-pav-t"); if(h) h.textContent=(d.data&&d.data.tapo)||v;
								done(true);
							} else { done(false, (d&&d.data)?(d.data.zinute||d.data):"nepavyko"); }
						})
						.catch(function(){ done(false,"ryšio klaida"); });
					return;
				}
				var el=inp.closest(".kort-red");
				if(!el){ done(false,"nežinomas laukas"); return; }
				if(el.classList.contains("kort-alt")){
					nuotraukosSiusti(el.dataset.id,"alt",[+el.dataset.att],v,function(ok){
						if(ok){ inp.dataset.buvo=v; inp.classList.remove("purvinas"); }
						done(ok, ok?null:"nepavyko");
					});
					return;
				}
				var laukas = el.classList.contains("kort-kaina") ? "_regular_price" : el.dataset.laukas;
				siusti(el, laukas, el.dataset.id, v, function(ok){
					if(ok){ inp.dataset.buvo=v; inp.classList.remove("purvinas"); }
					done(ok, ok?null:"nepavyko");
				});
			}
			function irasytiVisus(cb){
				var sar=purvini(), liko=sar.length, klaidu=0, zinute=null;
				if(!liko){ cb(true); return; }
				sar.forEach(function(inp){
					irasytiLauka(inp, function(ok, kl){
						if(!ok){ klaidu++; zinute=kl||zinute; }
						if(--liko===0){ juostaAtnaujinti(); cb(klaidu===0, zinute); }
					});
				});
			}
			function atmestiVisus(){
				purvini().forEach(function(inp){ inp.value=inp.dataset.buvo||""; inp.classList.remove("purvinas"); });
				juostaAtnaujinti();
			}

			document.addEventListener("click", function(e){
				var b=e.target;
				if(!b.classList) return;
				if(b.classList.contains("ks-atmesti")){ atmestiVisus(); return; }
				if(b.classList.contains("ks-irasyti")){
					b.disabled=true;
					irasytiVisus(function(ok, zinute){
						b.disabled=false;
						if(!ok){
							var kl=document.querySelector("#kort-saugoti .ks-klaida");
							if(kl) kl.textContent=zinute||"dalis laukų neįrašyta";
						}
					});
				}
			});

			/* SARGAS: visi isejimo keliai — ×, ←/→, Esc, kita preke sarase.
			   Klausimas turi TRIS pasirinkimus, todel ne `confirm()`, o langas. */
			var klausimas=document.getElementById("ps-klausimas");
			var kaiIsspresta=null;
			function klausti(veiksmas){
				if(!klausimas){ veiksmas(); return; }
				klausimas.querySelector(".laukai").textContent="Neįrašyta: "+purviniVardai().join(", ");
				klausimas.hidden=false;
				kaiIsspresta=veiksmas;
			}
			if(klausimas){
				klausimas.addEventListener("click", function(e){
					var b=e.target;
					if(b===klausimas || (b.classList && b.classList.contains("k-grizti"))){
						klausimas.hidden=true; kaiIsspresta=null; return; }
					if(b.classList && b.classList.contains("k-prarasti")){
						atmestiVisus(); klausimas.hidden=true;
						if(kaiIsspresta){ var v=kaiIsspresta; kaiIsspresta=null; v(); }
						return;
					}
					if(b.classList && b.classList.contains("k-irasyti")){
						b.disabled=true;
						irasytiVisus(function(ok, zinute){
							b.disabled=false;
							if(!ok){ klausimas.querySelector(".laukai").textContent="Nepavyko įrašyti: "+(zinute||"klaida"); return; }
							klausimas.hidden=true;
							if(kaiIsspresta){ var v=kaiIsspresta; kaiIsspresta=null; v(); }
						});
					}
				});
			}
			document.addEventListener("click", function(e){
				if(!purvini().length) return;
				if(klausimas && !klausimas.hidden) return;
				var b=e.target.closest(".kort-x,.k-prev,.k-next,.pskat-t tbody tr[data-id] a.atv");
				if(!b) return;
				/* v6.1: kortelės vidus (laukai, mygtukai) — ne išėjimas. */
				if(!b.classList.contains("atv") && e.target.closest(".kort-turinys")) return;
				e.preventDefault(); e.stopImmediatePropagation();
				klausti(function(){ b.click(); });
			}, true);
			document.addEventListener("keydown", function(e){
				if(e.key!=="Escape") return;
				if(!purvini().length) return;
				var k=document.getElementById("pskat-kort");
				if(!k || k.hidden) return;
				if(klausimas && !klausimas.hidden) return;
				e.preventDefault(); e.stopImmediatePropagation();
				klausti(function(){ var x=document.querySelector(".kort-x"); if(x) x.click(); });
			}, true);
			window.addEventListener("beforeunload", function(e){
				if(purvini().length){ e.preventDefault(); e.returnValue=""; }
			});
			/* v6.0: navigacijos juosta. Iki siol sargas perimdavo tik korteles
			   uzdaryma, o paspaudus „Akcijos" ar „Gavimas" puslapis keisdavosi
			   ir neirasyti laukai dingdavo tyliai — savininko pastaba
			   „man nusimuse ir viskas dingo". */
			document.addEventListener("click", function(e){
				if(!purvini().length) return;
				if(klausimas && !klausimas.hidden) return;
				/* v6.1: TIK isorines nuorodos (kitas puslapis). Saraso eilutes
				   perima kitas, senesnis sargas — o dvigubas peremimas su
				   `stopImmediatePropagation` nutraukdavo Enter grandine ir
				   kaina apskritai neissisaugodavo. */
				if(e.target.closest(".pskat-kort")) return;
				var a=e.target.closest(".pskat-nav a, .pskat-rail a");
				if(!a || !a.href) return;
				e.preventDefault(); e.stopImmediatePropagation();
				klausti(function(){ location.href=a.href; });
			}, true);

			/* ============ v5.5: PARTIJOS REDAGAVIMAS ============
			   Ta pati logika kaip kitiems korteles laukams: pakeistas laukas
			   geltonas, Enter iraso, Esc atstato. Kitokia elgsena tame paciame
			   lange verstu zmogu prisiminti, kur kaip veikia. */
			function partijaSiusti(tr, laukas, reiksme, done){
				var f=new FormData();
				f.append("action","ps_kat_partija"); f.append("nonce",NONCE);
				f.append("part",tr.dataset.part); f.append("id",tr.dataset.id);
				f.append("laukas",laukas); f.append("reiksme",reiksme);
				fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"})
					.then(function(r){return r.json();})
					.then(function(d){
						if(d&&d.success&&window.psAtnaujintiEilute&&tr&&tr.dataset) window.psAtnaujintiEilute(tr.dataset.id);
						done(!!(d&&d.success), d&&d.data);
					})
					.catch(function(){ done(false,{zinute:"ryšio klaida"}); });
			}
			document.addEventListener("input", function(e){
				var i=e.target;
				if(!i.closest || !i.closest(".pt-red")) return;
				i.classList.toggle("purvinas", i.value.trim() !== (i.dataset.buvo||""));
				if(typeof juostaAtnaujinti==="function") juostaAtnaujinti();
			});
			document.addEventListener("keydown", function(e){
				var i=e.target;
				if(!i.closest) return;
				var el=i.closest(".pt-red");
				if(!el) return;
				if(e.key==="Escape"){
					i.value=i.dataset.buvo||""; i.classList.remove("purvinas");
					if(typeof juostaAtnaujinti==="function") juostaAtnaujinti();
					i.blur(); return;
				}
				if(e.key!=="Enter") return;
				e.preventDefault();
				var v=i.value.trim();
				if(v===(i.dataset.buvo||"")){ i.blur(); return; }
				var tr=el.closest("tr"), st=tr.querySelector(".pt-stat");
				i.disabled=true; if(st){ st.textContent="…"; st.className="pt-stat"; }
				partijaSiusti(tr, el.dataset.laukas, v, function(ok, d){
					i.disabled=false;
					if(!ok){
						if(st){ st.textContent=(d&&(d.zinute||d))||"nepavyko"; st.className="pt-stat kl"; }
						return;
					}
					i.dataset.buvo=v; i.classList.remove("purvinas");
					i.classList.add("irasyta");
					setTimeout(function(){ i.classList.remove("irasyta"); }, 1400);
					if(typeof juostaAtnaujinti==="function") juostaAtnaujinti();
					var lk=tr.querySelector(".pt-liko");
					if(lk && d && d.liko!==undefined) lk.textContent=d.liko||"";
					if(st){ st.textContent="įrašyta"; st.className="pt-stat ok";
						setTimeout(function(){ st.textContent=""; },2200); }
				});
			}, true);

			/* v5.3: parduotuves paleidimo data */
			document.addEventListener("click", function(e){
				var b=e.target;
				if(!b.classList) return;
				if(b.classList.contains("pl-keisti")){
					var f=document.querySelector(".pl-forma");
					if(f){ f.hidden=!f.hidden; }
					return;
				}
				if(!b.classList.contains("pl-irasyti")) return;
				var inp=document.querySelector(".pl-data"), st=document.querySelector(".pl-stat");
				b.disabled=true; st.textContent="…";
				var f2=new FormData();
				f2.append("action","ps_kat_paleidimas"); f2.append("nonce",NONCE);
				f2.append("data", inp?inp.value:"");
				fetch(AJAX,{method:"POST",body:f2,credentials:"same-origin"})
					.then(function(r){return r.json();})
					.then(function(d){
						b.disabled=false;
						if(!d||!d.success){ st.textContent=(d&&d.data)?(d.data.zinute||d.data):"nepavyko"; return; }
						st.textContent="įrašyta";
						location.reload();
					})
					.catch(function(){ b.disabled=false; st.textContent="ryšio klaida"; });
			});

			/* ============ v4.6: PAVADINIMAS IR SKU SPYNA ============ */
			document.addEventListener("click", function(e){
				var b=e.target;
				if(!b.classList) return;

				/* SKU atrakinimas — sąmoningas veiksmas su įspėjimu */
				if(b.classList.contains("kort-atrakinti")){
					if(!confirm("Atrakinti SKU?\n\nPrie jo rišasi šaltinių registras (ps_sources), tiekėjų XML sutapdinimas, užsakymų eilutės ir kainų palyginimo feed sąrašai. Pakeitus kodą šios grandys nutrūksta.")) return;
					var inp=b.closest(".kort-red").querySelector("input");
					inp.readOnly=false; inp.classList.remove("uzrakintas"); inp.focus();
					b.hidden=true;
					var sp=b.closest(".kort-eil").querySelector(".kort-spyna");
					if(sp) sp.textContent="🔓";
					return;
				}

				if(b.classList.contains("kort-pav-keisti")){
					var red=b.parentElement.querySelector(".kort-pav-red");
					red.hidden=!red.hidden;
					if(!red.hidden){ var t=red.querySelector(".kort-pav-in"); t.focus(); t.setSelectionRange(t.value.length,t.value.length); }
					return;
				}
				var blk=b.closest(".kort-pav-red");
				if(!blk) return;
				if(b.classList.contains("kort-pav-atsisakyti")){ blk.hidden=true; return; }
				if(!b.classList.contains("kort-pav-irasyti")) return;

				var ta=blk.querySelector(".kort-pav-in"), st=blk.querySelector(".kort-pav-stat");
				var v=ta.value.trim();
				if(v===""){ st.textContent="negali būti tuščias"; st.className="kort-pav-stat kl"; return; }
				b.disabled=true; st.textContent="…"; st.className="kort-pav-stat";
				var f=new FormData();
				f.append("action","ps_kat_pavadinimas"); f.append("nonce",NONCE);
				f.append("id",blk.dataset.id); f.append("tekstas",v);
				fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"})
					.then(function(r){return r.json();})
					.then(function(d){
						b.disabled=false;
						if(!d||!d.success){
							st.textContent=(d&&d.data)?(d.data.zinute||d.data):"nepavyko";
							st.className="kort-pav-stat kl"; return;
						}
						var h=document.querySelector(".kort-pav-t");
						if(h) h.textContent=d.data.tapo;
						/* sąrašo eilutė atnaujinama kartu — kitaip du skirtingi
						   pavadinimai tame pačiame ekrane */
						var a=document.querySelector(".pskat-t tbody tr[data-id=\\""+blk.dataset.id+"\\"] a.atv");
						if(a) a.textContent=d.data.tapo;
						var ta2=blk.querySelector(".kort-pav-in");
						if(ta2){ ta2.dataset.buvo=v; ta2.classList.remove("purvinas"); }
						if(typeof juostaAtnaujinti==="function") juostaAtnaujinti();
						blk.hidden=true;
						st.textContent="įrašyta"; st.className="kort-pav-stat ok";
					})
					.catch(function(){ b.disabled=false; st.textContent="ryšio klaida"; st.className="kort-pav-stat kl"; });
			});

			/* ============ v4.5: ATRIBUTAI VIETOJE ============ */
			document.addEventListener("click", function(e){
				var b=e.target;
				if(!b.classList) return;
				var blk=b.closest(".kort-atr");
				if(!blk) return;

				if(b.classList.contains("kort-atr-keisti")){
					var l=blk.querySelector(".kort-atr-lauk");
					l.hidden=!l.hidden;
					b.textContent=l.hidden?"keisti":"slėpti";
					return;
				}
				if(b.classList.contains("kort-atr-atsisakyti")){
					blk.querySelector(".kort-atr-lauk").hidden=true;
					blk.querySelector(".kort-atr-keisti").textContent="keisti";
					return;
				}
				if(!b.classList.contains("kort-atr-irasyti")) return;

				var daug=blk.dataset.daug==="1", ids=[];
				if(daug){
					blk.querySelectorAll(".kort-atr-sar input:checked").forEach(function(c){ ids.push(+c.value); });
				} else {
					var s=blk.querySelector(".kort-atr-sel");
					if(s && s.value) ids.push(+s.value);
				}
				var st=blk.querySelector(".kort-atr-stat");
				b.disabled=true; st.textContent="…"; st.className="kort-atr-stat";
				var f=new FormData();
				f.append("action","ps_kat_atributas"); f.append("nonce",NONCE);
				f.append("id",blk.dataset.id); f.append("tax",blk.dataset.tax);
				f.append("terminai",JSON.stringify(ids));
				fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"})
					.then(function(r){return r.json();})
					.then(function(d){
						b.disabled=false;
						if(!d||!d.success){
							st.textContent=(d&&d.data)?(d.data.zinute||d.data):"nepavyko";
							st.className="kort-atr-stat kl"; return;
						}
						blk.querySelector(".kort-atr-rodo").textContent=d.data.tapo;
						blk.querySelector(".kort-atr-lauk").hidden=true;
						blk.querySelector(".kort-atr-keisti").textContent="keisti";
						st.textContent="įrašyta"; st.className="kort-atr-stat ok";
						setTimeout(function(){ st.textContent=""; },2200);
					})
					.catch(function(){ b.disabled=false; st.textContent="ryšio klaida"; st.className="kort-atr-stat kl"; });
			});

			/* ============ v4.5: NUOTRAUKOS ============ */
			function nuotraukosSiusti(pid, veiksmas, ids, alt, done){
				var f=new FormData();
				f.append("action","ps_kat_nuotraukos"); f.append("nonce",NONCE);
				f.append("id",pid); f.append("veiksmas",veiksmas);
				f.append("ids",JSON.stringify(ids||[]));
				if(alt!==undefined) f.append("alt",alt);
				fetch(AJAX,{method:"POST",body:f,credentials:"same-origin"})
					.then(function(r){return r.json();})
					.then(function(d){
						if(d&&d.success&&window.psAtnaujintiEilute&&tr&&tr.dataset) window.psAtnaujintiEilute(tr.dataset.id);
						done(!!(d&&d.success), d&&d.data);
					})
					.catch(function(){ done(false); });
			}
			function perkrautiKortele(){
				if(typeof window.psKatAtidaryk==="function"){ window.psKatAtidaryk(); }
				else { location.reload(); }
			}

			/* Medijos langas — tas pats, kurį WordPress naudoja visur kitur.
			   v4.7: `ikelti=true` atidaro iškart ties „Įkelti failus" skirtuku.
			   Iki šiol buvo tik vienas mygtukas, atsidarydavęs ties biblioteka,
			   ir atrodė, kad įkelti naujos nuotraukos apskritai negalima. */
			function mediaLangas(daugelis, ikelti, cb){
				if(!(window.wp && wp.media)){ alert("Medijos langas nepasiekiamas."); return; }
				var fr=wp.media({title: daugelis?"Pasirinkite nuotraukas":"Pasirinkite nuotrauką",
					library:{type:"image"}, multiple: daugelis?"add":false,
					button:{text: daugelis?"Pridėti":"Pasirinkti"}});
				fr.on("select", function(){
					var sel=fr.state().get("selection").toJSON().map(function(x){ return x.id; });
					if(sel.length) cb(sel);
				});
				if(ikelti){ fr.on("open", function(){ try{ fr.content.mode("upload"); }catch(e){} }); }
				fr.open();
			}

			/* v4.7: ATŠAUKIMO juosta. Nuotraukos veiksmas įvyksta iškart, todėl
			   kelias atgal turi būti po ranka, o ne per medijos biblioteką. */
			function atsaukimoJuosta(pid, buvusi, tekstas){
				var sena=document.getElementById("ps-foto-atsaukti");
				if(sena) sena.remove();
				if(!buvusi) return;
				var j=document.createElement("div");
				j.className="pskat-pranes"; j.id="ps-foto-atsaukti";
				var sp=document.createElement("span"); sp.textContent=tekstas; j.appendChild(sp);
				var b=document.createElement("button"); b.textContent="Atšaukti";
				b.onclick=function(){
					nuotraukosSiusti(pid,"pagrindine",[buvusi],undefined,function(ok){
						j.remove();
						if(ok) perkrautiKortele();
					});
				};
				j.appendChild(b);
				var x=document.createElement("button"); x.className="x"; x.textContent="×";
				x.onclick=function(){ j.remove(); }; j.appendChild(x);
				document.body.appendChild(j);
				setTimeout(function(){ if(j.parentNode) j.remove(); }, 20000);
			}

			document.addEventListener("click", function(e){
				var b=e.target;
				if(!b.classList) return;
				var pane=b.closest(".kort-pane[data-p=fot]");
				if(!pane) return;
				var pid=pane.dataset.id;
				var st=pane.querySelector(".kn-stat");
				function busena2(t){ if(st){ st.textContent=t||""; } }

				if(b.classList.contains("kn-pagrindine") || b.classList.contains("kn-ikelti")){
					var ikelti=b.classList.contains("kn-ikelti");
					mediaLangas(false, ikelti, function(ids){
						/* v4.7: prieš keičiant — klausiama. Iki šiol nuotrauka
						   pasikeisdavo tyliai, be jokio patvirtinimo. */
						var turi=!!pane.querySelector(".kort-foto img");
						if(turi && !confirm("Pakeisti pagrindinę nuotrauką?\n\nSenoji nedingsta — keliauja į galerijos pradžią.")) return;
						busena2("įrašoma…");
						nuotraukosSiusti(pid,"pagrindine",ids,undefined,function(ok,d){
							if(ok){
								if(d && d.buvusi) atsaukimoJuosta(pid, d.buvusi, "Pagrindinė nuotrauka pakeista.");
								perkrautiKortele();
							} else { busena2("nepavyko"); }
						});
					});
					return;
				}
				if(b.classList.contains("kn-pagrindine-salinti")){
					if(!confirm("Pašalinti pagrindinę nuotrauką? Prekė pateks į eilę „Be nuotraukos\".")) return;
					nuotraukosSiusti(pid,"pagrindine_salinti",[],undefined,function(ok,d){
						if(ok){
							if(d && d.buvusi) atsaukimoJuosta(pid, d.buvusi, "Pagrindinė nuotrauka pašalinta.");
							perkrautiKortele();
						}
					});
					return;
				}
				if(b.classList.contains("kn-galerija") || b.classList.contains("kn-galerija-ikelti")){
					mediaLangas(true, b.classList.contains("kn-galerija-ikelti"), function(ids){
						busena2("įrašoma…");
						nuotraukosSiusti(pid,"galerija_prideti",ids,undefined,function(ok){
							if(ok){ perkrautiKortele(); } else { busena2("nepavyko"); }
						});
					});
					return;
				}

				var el=b.closest(".kg-el");
				if(!el) return;
				var att=+el.dataset.att;
				if(b.classList.contains("kg-pagr")){
					if(!confirm("Padaryti šią nuotrauką pagrindine?\n\nDabartinė pagrindinė keliaus į galerijos pradžią.")) return;
					nuotraukosSiusti(pid,"pagrindine",[att],undefined,function(ok,d){
						if(ok){
							if(d && d.buvusi) atsaukimoJuosta(pid, d.buvusi, "Pagrindinė nuotrauka pakeista.");
							perkrautiKortele();
						}
					});
					return;
				}
				if(b.classList.contains("kg-salinti")){
					el.classList.add("dingsta");
					nuotraukosSiusti(pid,"galerija_salinti",[att],undefined,function(ok){
						if(ok){ perkrautiKortele(); } else { el.classList.remove("dingsta"); }
					});
					return;
				}
				if(b.classList.contains("kg-kaire") || b.classList.contains("kg-desine")){
					var visi=Array.prototype.map.call(pane.querySelectorAll(".kg-el"),function(x){ return +x.dataset.att; });
					var i=visi.indexOf(att), j=b.classList.contains("kg-kaire")?i-1:i+1;
					if(i<0 || j<0 || j>=visi.length) return;
					visi[i]=visi[j]; visi[j]=att;
					nuotraukosSiusti(pid,"galerija_tvarka",visi,undefined,function(ok){ if(ok) perkrautiKortele(); });
					return;
				}
			});

			/* Alt tekstas — Enter įrašo, kaip ir kiti kortelės laukai. */
			document.addEventListener("keydown", function(e){
				var inp=e.target;
				if(!inp || inp.tagName!=="INPUT" || e.key!=="Enter") return;
				var el=inp.closest(".kort-alt");
				if(!el) return;
				e.preventDefault();
				var v=inp.value.trim();
				if(v===(inp.dataset.buvo||"")){ inp.blur(); return; }
				inp.disabled=true;
				nuotraukosSiusti(el.dataset.id,"alt",[+el.dataset.att],v,function(ok){
					inp.disabled=false;
					var s=el.querySelector(".stat");
					if(ok){ inp.dataset.buvo=v; inp.classList.remove("purvinas");
						if(s){ s.textContent="įrašyta"; s.style.color="#1e7a3c"; s.style.fontSize="12px";
							setTimeout(function(){ s.textContent=""; },2200); } }
					else if(s){ s.textContent="nepavyko"; s.style.color="#a52020"; }
				});
			}, true);

			document.addEventListener("keydown", function(e){
				var inp=e.target;
				if(!inp || inp.tagName!=="INPUT") return;
				if(inp.type==="checkbox") return;
				var el=inp.closest(".kort-red");
				if(!el) return;

				if(e.key==="Escape"){ inp.value=inp.dataset.buvo||""; inp.classList.remove("purvinas");
					if(typeof juostaAtnaujinti==="function") juostaAtnaujinti(); inp.blur(); return; }
				if(e.key!=="Enter") return;
				e.preventDefault();

				var laukas = el.classList.contains("kort-kaina") ? "_regular_price" : el.dataset.laukas;
				var id = el.dataset.id;
				var v = inp.value.trim();
				if(v === (inp.dataset.buvo||"")){ inp.blur(); return; }

				inp.disabled=true;
				siusti(el, laukas, id, v, function(ok, data){
					inp.disabled=false;
					if(ok){
						inp.dataset.buvo = v;
						inp.classList.remove("purvinas");
						if(typeof juostaAtnaujinti==="function") juostaAtnaujinti();
						/* v6.0: matomas patvirtinimas. Savininko pastaba: „po
						   kiekvieno issaugojimo turi buti refresh, nes neaisku
						   ar issisaugojo". Pilnas puslapio perkrovimas atimtu
						   vieta sarase, todel laukas trumpam nusidazo zaliai —
						   irodymas, kad serveris atsake, o ne kad tik parasei. */
						inp.classList.add("irasyta");
						setTimeout(function(){ inp.classList.remove("irasyta"); }, 1400);
						/* savikaina pasikeite → atnaujinam marza vietoje */
						if(data && data.marza !== undefined){
							var b=document.querySelector(".kort-marza");
							if(b) b.textContent = String(data.marza).replace(".",",")+" %";
						}
					} else {
						inp.focus();
					}
				});
			});
		})();</script>';
	}

	/**
	 * v3.7: TAMSESNIS TEKSTAS. Pilka #6b7580 ant siek tiek pilksvo fono
	 * susilieja, o su siuo langu dirbama valandomis (savininko pastaba
	 * 2026-08-10). Kontrastas pakeltas iki lygio, kuris skaitomas ir
	 * pavargusiomis akimis.
	 */
	private static function stilius_v37() {
		echo '<style>
		/* ==================== v8.6.3 · KOMPAKTIŠKA FILTRŲ DĖŽĖ ====================
		   Buvo: keturios eilutės per visą plotį, „pridėti sąlygą" nubėgęs į
		   dešinę, vaizdai atskirai, vardo laukelis dar toliau. Plotis buvo
		   naudojamas tuštumai, o aukštis — tai, ko trūksta labiausiai.
		   Dabar: viskas kairėje, viena eilutė kiek įmanoma, mažesni tarpai. */
		.pskat-filters{padding:6px 10px 7px;margin-bottom:8px}
		.pskat-filters .frline{display:flex;align-items:center;flex-wrap:wrap;
			gap:4px 10px;margin:0;padding:2px 0;min-height:0}
		.pskat-filters .frline + .frline{border-top:1px solid #eef1ee;margin-top:3px;padding-top:5px}
		.pskat-filters .ax{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;
			color:#8a958e;margin-right:1px}
		.pskat-filters select,.pskat-filters input[type=text]{font-size:12.5px;padding:2px 6px;
			height:26px;border:1px solid #dfe5e1;border-radius:4px;background:#fff}
		.pskat-filters .sep{display:none}
		.pskat-filters .kiek-sar{font-size:11px;color:#9aa49d}
		.pskat-filters .clear{font-size:12px;margin-left:auto}
		/* Sąlygų kūriklis — prie sąlygų, ne ekrano gale. */
		.pskat-sal .sal-pr{margin-left:0}
		.pskat-sal .sal-p{padding:2px 8px;font-size:12px}
		/* Vaizdai ir jų įrašymas — vienoje eilutėje, kairėje. */
		.pskat-vaizdai .vz{padding:2px 9px;font-size:12px}
		.pskat-vaizdai .vz-f{margin-left:0;gap:4px}
		.pskat-vaizdai .vz-f input{width:112px}
		.pskat-vaizdai .vz-b{padding:2px 9px;font-size:12px}
		/* Suvestinė apačioje — buvo trys eilutės aukščio, užtenka vienos. */
		.pskat-suv{margin:8px 0 0}
		.pskat-suv .p{padding:5px 12px}
		.pskat-suv .l{font-size:10.5px}
		.pskat-suv .v{font-size:14px}
		.pskat-psl{padding:5px 0 0;font-size:12px}
		/* Greitojo redagavimo juosta — buvo atskira dėžė su savo tarpais. */
		.pskat-red{margin:0 0 8px}

		/* ==================== v8.7 · NORMALUS LANGAS ====================
		   v8.6 "du slinkties laukai" (fiksuotas ekrano aukstis, vidinis
		   prekiu scroll-as, JS matavimai) ismestas: realiame ekrane
		   prekems likdavo 120 px. Dabar puslapis slenka normaliai;
		   virsutine juosta ir kaires eiles - sticky, tad orientyrai
		   nedingsta, o prekiu telpa tiek, kiek ju yra. */
		/* v8.6.2 (lieka): suskleidziamos filtru eilutes. */
		.pskat-filters{position:relative}
		.fr-jung{display:inline-flex;align-items:center;gap:6px;border:1px solid #cfd8d2;background:#fff;
			border-radius:5px;font-size:12.5px;line-height:1;padding:5px 12px;cursor:pointer;color:#22401f;
			font-weight:600;margin-right:4px}
		.fr-jung:hover{border-color:#2271b1;color:#2271b1;background:#f4f9fb}
		.fr-jung .rod{display:inline-block;transition:transform .12s;font-size:10px;color:#7a8b80}
		body:not(.fr-suskleista) .fr-jung .rod{transform:rotate(90deg)}
		.fr-jung .kiek{color:#7a8b80;font-weight:400}
		/* WP atnaujinimo pranesimas siame lange nereikalingas - WP 7.0
		   uzrakintas, o pranesimas atima eilute prekiu. Matomas visur kitur. */
		.update-nag,
		#wpbody-content > .updated,
		#wpbody-content > .update-nag{display:none!important}
		.frl-sant{align-items:center;flex-wrap:wrap;gap:6px}
		.frline[hidden]{display:none!important}
		.frl-sant .sal-r{background:#f2f5f3}
		body.fr-suskleista .pskat-filters .frl-1,
		body.fr-suskleista .pskat-filters .frl-2,
		body.fr-suskleista .pskat-filters .frl-3,
		body.fr-suskleista .pskat-filters .frl-4{display:none}
		.frl-sant{padding-top:0!important;border-top:0!important}
		body.fr-suskleista .pskat-filters{padding:5px 10px}
		/* Kaires eiles - sticky po virsutine juosta, su savo slinktimi. */
		.pskat-rail{position:sticky;top:var(--ps-virsus,118px);align-self:flex-start;
			max-height:calc(100vh - var(--ps-virsus,118px));overflow-y:auto;overflow-x:hidden;
			scrollbar-width:thin;scrollbar-color:#c3cbc5 transparent}
		.pskat-rail::-webkit-scrollbar{width:9px}
		.pskat-rail::-webkit-scrollbar-thumb{background:#c3cbc5;border-radius:5px}
		.pskat-rail::-webkit-scrollbar-track{background:transparent}
		/* Prekiu lentele: laukas tik horizontaliai slinkciai siauram ekranui.
		   Aukscio ribos NERA - lentele auga pagal turini, slenka puslapis. */
		.pskat-lent-lauk{overflow-x:auto;border:1px solid #d3d8d2;border-radius:9px;background:#fff;
			scrollbar-width:thin;scrollbar-color:#c3cbc5 transparent}
		.pskat-lent-lauk::-webkit-scrollbar{height:11px}
		.pskat-lent-lauk::-webkit-scrollbar-thumb{background:#c3cbc5;border-radius:6px}
		.pskat-lent-lauk::-webkit-scrollbar-track{background:#f2f4f1}
		/* Remeli pereme laukas - lentelei jo nebereikia. */
		.pskat-lent-lauk .pskat-t{border:0;border-radius:0;overflow:visible}
		.pskat-lent-lauk .pskat-t thead th{position:sticky;top:0;z-index:6;
			background:#f7f9f6;box-shadow:inset 0 -1px 0 #d3d8d2}
		/* Suvestine ir puslapiavimas - normaliame sraute po lentele. */
		.pskat-main > .pskat-suv,
		.pskat-main > .pskat-psl{margin-top:8px}
		.pskat-main > .pskat-psl{display:flex;align-items:center;gap:10px;
			padding:6px 2px 2px;font-size:12.5px;color:#3c4a41}
		.pskat-main > .pskat-psl a{padding:2px 10px;border:1px solid #cfd8d2;border-radius:4px;
			background:#fff;text-decoration:none;color:#22401f}
		.pskat-main > .pskat-psl a:hover{border-color:#2271b1;color:#2271b1}

		/* v8.4: sąlygos ir vaizdai — tie patys dažai kaip filtrų eilutėje,
		   kad langas neatrodytų kaip du skirtingi langai. */
		.pskat-sal{align-items:center;flex-wrap:wrap;gap:6px}
		.pskat-sal .sal-p{display:inline-flex;align-items:center;gap:6px;background:#eef4f0;border:1px solid #cfe0d6;
			border-radius:14px;padding:3px 10px;font-size:12.5px;color:#22401f}
		.pskat-sal .sal-p a{text-decoration:none;color:#7a8b80;font-weight:700;line-height:1}
		.pskat-sal .sal-p a:hover{color:#b3261e}
		.pskat-sal .sal-tuscia{font-size:12.5px;color:#8a958e}
		.pskat-sal .sal-pr{display:inline-flex;gap:4px;align-items:center;margin-left:auto}
		.pskat-sal .sal-pr select,.pskat-sal .sal-pr input{font-size:12.5px;padding:3px 6px}
		.pskat-sal .sal-pr input{width:110px}
		.pskat-sal .sal-pr button{font-size:12.5px;padding:3px 10px;cursor:pointer;border:1px solid #cfe0d6;
			background:#fff;border-radius:4px}
		.pskat-vaizdai{align-items:center;flex-wrap:wrap;gap:6px}
		.pskat-vaizdai .vz{display:inline-block;padding:3px 10px;border:1px solid #dfe5e1;border-radius:14px;
			font-size:12.5px;text-decoration:none;color:#3c4a41;background:#fff}
		.pskat-vaizdai .vz:hover{border-color:#2271b1}
		.pskat-vaizdai .vz.on{background:#22401f;color:#fff;border-color:#22401f}
		.pskat-vaizdai .vz-f{display:inline-flex;gap:4px;align-items:center;margin-left:auto}
		.pskat-vaizdai .vz-f input{font-size:12.5px;padding:3px 6px;width:130px}
		.pskat-vaizdai .vz-b{font-size:12.5px;padding:3px 10px;cursor:pointer;border:1px solid #cfe0d6;
			background:#fff;border-radius:4px}
		.pskat-vaizdai .vz-mut{color:#7a8b80}
		/* v8.4: paieškos valymas — kryžiukas, kuris IŠ TIKRŲJŲ pateikia formą.
		   Iki šiol `url()` nešiojo `q` su kiekviena nuoroda, todėl ištrynus
		   tekstą ir paspaudus bet ką kita, jis grįždavo. */
		.pskat-search .isvalyti{position:absolute;right:10px;top:50%;transform:translateY(-50%);
			text-decoration:none;color:#8a958e;font-size:15px;font-weight:700;line-height:1}
		.pskat-search .isvalyti:hover{color:#b3261e}
		.pskat-search{position:relative}

		.pskat-app, .pskat-kort { color:#1d2b24; }
		.pskat-app .sml, .pskat-app .sml2, .pskat-kort .sml, .pskat-kort .sml2 { color:#3d4650 !important; }
		.pskat-app .mini-t, .pskat-kort .mini-t { color:#3d4650 !important; }
		.kort-eil > span:first-child { color:#3d4650 !important; font-size:13.5px; }
		.kort-antr { color:#2a3530 !important; font-size:12px; }
		.kort-info-m { color:#2f3a34 !important; font-size:13px; line-height:1.55; }
		.kort-t th { color:#3d4650 !important; font-size:11px; }
		.kort-t td { color:#1d2b24; font-size:13.5px; }
		.pskat-t thead th { color:#3d4650 !important; }
		.pskat-t tbody td { color:#1d2b24; }
		.pskat-t .sub, .pskat-t .mono { color:#3d4650 !important; }
		.tuscia-t, .tuscia { color:#3d4650 !important; }
		.pskat-rail .n, .pskat-rail span { color:#3d4650; }
		.kort-red .vnt { color:#3d4650 !important; }
		.z, .zn { color:#3d4650; }

		/* v3.7: EAN ir SKU laukams reikia daugiau vietos — EAN yra 13 skaitmenu,
		   o 172 px juos nukerta. */
		.kort-red input.txt { width:196px !important; }
		.kort-varnele { display:inline-flex; align-items:center; gap:8px; }
		.kort-varnele input[type=checkbox] { width:17px; height:17px; margin:0; cursor:pointer; }
		.kort-varnele .vnt { font-size:12.5px; }
		.kort-apr-txt { width:100%; min-height:210px; padding:11px 13px; font:inherit; font-size:13.5px;
			line-height:1.6; border:1px solid #dfe4dd; border-radius:7px; resize:vertical;
			font-family:ui-monospace,Menlo,Consolas,monospace; }
		.kort-apr-txt:focus { outline:none; border-color:#3a7bd5; box-shadow:0 0 0 3px rgba(58,123,213,.14); }
		.kort-apr-veiksmai { display:flex; gap:8px; align-items:center; margin-top:9px; flex-wrap:wrap; }
		.kort-apr-veiksmai button { border:1px solid #dfe4dd; background:#fff; border-radius:6px;
			padding:6px 12px; font:inherit; font-size:13.5px; cursor:pointer; color:#1d2b24; }
		.kort-apr-veiksmai button:hover { background:#f4f6f3; }
		.kort-apr-veiksmai .ka-irasyti { background:#3a7bd5; border-color:#3a7bd5; color:#fff; }
		.pskat-t tbody tr.psk-atnaujinta td{background:#eef7f0!important;transition:background .4s}
		.kort-persp-x{background:#f6f7f7;border:1px solid #dcdcde;border-left:4px solid #8a8f88;border-radius:6px;
			padding:9px 11px;margin-top:8px;font-size:12.5px;color:#3d4650;line-height:1.55}
		.pskat-t td.nerd .av-rodo{color:#8a8f88}
		.kort-busena{display:flex;align-items:center;gap:9px;margin:8px 0 4px;padding:7px 12px;
			border-radius:8px;font-size:13px;border:1px solid transparent}
		.kort-busena.yra{background:#eef7f0;border-color:#cfe6d6;color:#1e7a3c}
		.kort-busena.ne{background:#fdf6e3;border-color:#efe0b8;color:#8a5b00}
		.kb-taskas{width:9px;height:9px;border-radius:50%;background:currentColor;flex:none}
		.kb-paaisk{color:#6b7280;font-size:12px}
		.kb-ranka{font-size:12px;color:#8a5b00}
		.kb-keisti{margin-left:auto;border:1px solid #cfd6cc;background:#fff;border-radius:6px;
			padding:4px 12px;cursor:pointer;font-size:12.5px;color:#3d4650}
		.kb-keisti:hover{background:#f2f7f3}
		.kb-stat{font-size:12px}
		.kort-lik-eil{border-top:1px solid #f0f0f1;padding:10px 0}
		.kort-lik-eil:first-of-type{border-top:0}
		.kort-lik-av{background:#fbfcfa;margin:0 -14px -12px;padding:10px 14px 12px;border-top:1px solid #e8ebe6}
		.kort-tiek-in{width:150px;padding:6px 9px;border:1px solid #cfd6cc;border-radius:6px;font-size:14px}
		.kort-tiek-irasyti{border:1px solid #cfd6cc;background:#fff;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:13px}
		.kort-tiek-irasyti:hover{background:#f2f7f3}
		.kort-tiek-stat{font-size:12px}.kort-tiek-stat.ok{color:#1e7a3c}.kort-tiek-stat.kl{color:#a52020}
		.kort-lik-gav{display:none;gap:12px;align-items:flex-end;margin:8px 0;flex-wrap:wrap}
		.kort-lik-gav.on{display:flex}
		.kort-lik-gav label{display:flex;flex-direction:column;gap:3px;font-size:12px;color:#3d4650}
		.kort-lik-gav input{padding:6px 9px;border:1px solid #cfd6cc;border-radius:6px;font-size:13px;width:150px}
		.kort-lik-uz{font-size:12px;color:#1e7a3c;padding-bottom:7px}
		.kort-lik-red{display:flex;gap:8px;align-items:center;margin:8px 0;flex-wrap:wrap}
		.kort-lik-in{width:150px;padding:6px 9px;border:1px solid #cfd6cc;border-radius:6px;font-size:14px}
		.kort-lik-priez{padding:6px 8px;border:1px solid #cfd6cc;border-radius:6px;font-size:13px}
		.kort-lik-irasyti{border:1px solid #3a7bd5;background:#3a7bd5;color:#fff;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:13px}
		.kort-lik-stat{font-size:12px}.kort-lik-stat.ok{color:#1e7a3c}.kort-lik-stat.kl{color:#a52020}
		.kort-kat-rodo{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
		.kort-kat-z{background:#f0f6fc;border:1px solid #c5d9ed;color:#0a4b78;border-radius:11px;padding:2px 10px;font-size:12.5px}
		.kort-kat-nera{color:#8a5b00;font-size:12.5px}
		.kort-kat-veiksmai{display:flex;gap:10px;align-items:center;margin-top:6px}
		.kort-kat-veiksmai button{border:1px solid #cfd6cc;background:#fff;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:13px}
		.kort-kat-stat{font-size:12px}.kort-kat-stat.ok{color:#1e7a3c}.kort-kat-stat.kl{color:#a52020}
		.kort-kat-lauk{border:1px solid #dfe4dd;border-radius:8px;padding:10px;margin-top:8px;background:#fbfcfa}
		.kort-kat-q{width:100%;padding:6px 9px;border:1px solid #cfd6cc;border-radius:6px;font-size:13px}
		.kort-kat-sar{max-height:230px;overflow:auto;margin:8px 0}
		.kort-kat-e{display:flex;align-items:center;gap:8px;padding:3px 4px;font-size:13px;border-radius:4px}
		.kort-kat-e:hover{background:#f2f7f3}.kort-kat-e i{margin-left:auto;color:#8a8f88;font-style:normal;font-size:11.5px}
		.kort-kat-myg{display:flex;gap:8px}
		.kort-kat-myg .kort-kat-irasyti{background:#3a7bd5;border-color:#3a7bd5;color:#fff}
		.kort-pak-info{font-size:12.5px;color:#3d4650;background:#f7f9f6;border-radius:6px;padding:9px 11px;margin:8px 0;line-height:1.55}
		.kort-pak-veiksmai{margin-top:10px;display:flex;align-items:center;gap:10px}
		.kort-pak-veiksmai button{border:1px solid #cfd6cc;background:#fff;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:13px}
		.kort-pak-veiksmai button:hover{background:#f2f7f3}
		.kpak-stat{font-size:12px}.kpak-stat.ok{color:#1e7a3c}.kpak-stat.kl{color:#a52020}
		.kort-pak-t td button{border:1px solid #dfe4dd;background:#fff;border-radius:5px;padding:2px 8px;margin-left:4px;cursor:pointer;font-size:12px}
		.kort-pak-t .kpak-tr{color:#a52020;border-color:#e8c9c9}
		.kort-pak-forma{border:1px solid #dfe4dd;border-radius:8px;padding:12px;margin-top:10px;background:#fbfcfa}
		.kpf-eil{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:9px}
		.kpf-eil label{font-size:12px;color:#3d4650;display:flex;flex-direction:column;gap:3px;flex:1;min-width:150px}
		.kpf-eil input[type=text],.kpf-eil input[type=number],.kpf-eil select{padding:6px 8px;border:1px solid #cfd6cc;border-radius:6px;font-size:13px}
		.kpf-var{flex-direction:row!important;align-items:center;gap:6px!important}
		.kpf-myg{display:flex;gap:8px;margin-top:4px}
		.kpf-myg button{border:1px solid #cfd6cc;background:#fff;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:13px}
		.kpf-myg .kpf-irasyti{background:#3a7bd5;border-color:#3a7bd5;color:#fff}
		.kort-ranka{background:#fff4e0;border:1px solid #f0d9a8;border-left:4px solid #dba617;border-radius:6px;
			padding:8px 11px;margin:8px 0;font-size:13px;color:#7a5c00;line-height:1.5}
		.kort-ranka span{display:block;font-size:12px;color:#8a6a20;margin-top:2px}
		.kort-apr-veiksmai .kt-irasyti { background:#3a7bd5; border-color:#3a7bd5; color:#fff; }
		.kort-apr-veiksmai .kt-irasyti:hover { background:#2f6ac0; }
		.kort-tr-txt { min-height:120px; }
		.kort-tr-red .kort-apr-rezimas { margin:6px 0 0; }
		.kort-tr-red .kt-rez { font-size:12px; padding:3px 10px; border:1px solid #d5d9d2; background:#fff; cursor:pointer; }
		.kort-tr-red .kt-rez.on { background:#2f3a34; color:#fff; border-color:#2f3a34; }
		.kt-stat { font-size:12px; margin-left:8px; }
		.kt-stat.ok { color:#1e7a3c; } .kt-stat.kl { color:#a52020; }
		.kort-apr-veiksmai .ka-irasyti:hover { background:#2f6ac0; }
		.kort-apr-veiksmai button:disabled { opacity:.45; cursor:not-allowed; }
		.ka-stat { font-size:12.5px; }
		.ka-stat.ok { color:#1e7a3c; } .ka-stat.kl { color:#a52020; }
		.kort-apr-rezimas { display:flex; gap:0; margin:8px 0 0; }
		.kort-apr-rezimas button { border:1px solid #dfe4dd; background:#fff; padding:4px 12px;
			font:inherit; font-size:12.5px; cursor:pointer; color:#3d4650; }
		.kort-apr-rezimas button:first-child { border-radius:5px 0 0 5px; }
		.kort-apr-rezimas button:last-child { border-radius:0 5px 5px 0; border-left:0; }
		.kort-apr-rezimas button.on { background:#1d2b24; border-color:#1d2b24; color:#fff; }
		.kort-apr-red .wp-editor-wrap { border:1px solid #dfe4dd; border-radius:7px; overflow:hidden; }
		.kort-apr-red .mce-toolbar-grp { border-bottom:1px solid #e8ebe6 !important; }
		.kort-apr-red .wp-editor-container textarea { border:0 !important; }
		.kort-apr-red iframe { min-height:280px !important; }
		.kort-apr-red table { border-collapse:collapse; }
		.kort-apr-red table td, .kort-apr-red table th { border:1px solid #dfe4dd; padding:5px 8px; }
		.kort-red input.mono { font-family:ui-monospace,Menlo,Consolas,monospace; letter-spacing:.02em; }
		/* v4.4: pakeistas, bet neįrašytas laukas — geltonas, kad nedingtų tyliai */
		.kort-red input.purvinas{background:#fbf0d5!important;border-color:#e5cf94!important}
		.kort-uzuomina{font-size:11px;color:#8d9691;margin-top:8px}
		.kort-uzuomina b{font-family:ui-monospace,Consolas,monospace;font-weight:600;background:#f4f6f3;
			padding:0 5px;border-radius:4px;color:#3d4650}
		/* v4.4: kopijavimo mygtukas prie SKU/EAN */
		.kort-kopij{background:0;border:0;cursor:pointer;font-size:13px;opacity:.5;padding:0 3px}
		.kort-kopij:hover{opacity:1}

		/* v4.9: akcijos indikatorius */
		.kort-akcija{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap;margin-top:9px;
			padding:8px 11px;border-radius:7px;background:#e4f2ea;font-size:12.5px}
		.kort-akcija b{color:#1f7a4d;font-size:13px}
		.kort-akcija span{color:#2c6b4c}
		.kort-akcija a{margin-left:auto;color:#1f7a4d;font-size:12px}
		.kort-akcija.svetima{background:#fbf0d5}
		.kort-akcija.svetima b{color:#8a5f00}
		.kort-akcija.svetima span{color:#7a5400}

		/* v4.8: NEIRASYTU PAKEITIMU JUOSTA korteleje — ta pati logika kaip
		   sarase. Iki siol vienintelis zenklas, kad kazkas neirasyta, buvo
		   geltonas laukas, o pats irasymas vyko per Enter, kurio nesimato. */
		.kort-saugoti{position:sticky;bottom:0;z-index:8;display:flex;align-items:center;gap:12px;
			background:#1d2422;color:#e8ebe6;padding:10px 16px;margin:0 -18px -24px;
			box-shadow:0 -4px 16px rgba(20,30,25,.18)}
		.kort-saugoti[hidden]{display:none!important}
		.kort-saugoti .kiek{font-size:13px;white-space:nowrap}
		.kort-saugoti .kiek b{font-family:ui-monospace,Consolas,monospace;font-size:16px;color:#fff}
		.kort-saugoti button{border:0;border-radius:7px;padding:8px 16px;font:inherit;font-size:13px;cursor:pointer}
		.kort-saugoti .ks-irasyti{margin-left:auto;background:#1f7a4d;color:#fff;font-weight:600}
		.kort-saugoti .ks-irasyti:hover{background:#1a6a43}
		.kort-saugoti .ks-atmesti{background:transparent;border:1px solid #4a534f;color:#c9d0cb}
		.kort-saugoti .ks-klaida{font-size:12px;color:#f0b4ab}

		/* v4.8: UZDARYMO KLAUSIMAS su TRIMIS pasirinkimais. `confirm()` teturi
		   du, todel juo buvo galima tik prarasti pakeitimus arba likti. */
		.ps-klausimas{position:fixed;inset:0;background:rgba(20,30,25,.5);z-index:200;
			display:flex;align-items:center;justify-content:center;padding:24px}
		.ps-klausimas[hidden]{display:none!important}
		.ps-klausimas .lg{background:#fff;border-radius:11px;max-width:520px;width:100%;padding:20px 22px;
			box-shadow:0 10px 40px rgba(20,30,25,.3)}
		.ps-klausimas h3{margin:0 0 8px;font-size:17px;color:#1d2b24}
		.ps-klausimas p{margin:0 0 16px;font-size:13.5px;line-height:1.6;color:#3d4650}
		.ps-klausimas .laukai{font-size:12.5px;color:#7a5400;background:#fbf0d5;padding:8px 11px;
			border-radius:6px;margin-bottom:16px;line-height:1.5}
		.ps-klausimas .myg{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}
		.ps-klausimas .myg button{border:1px solid #d3d8d2;background:#fff;border-radius:7px;
			padding:9px 16px;font:inherit;font-size:13.5px;cursor:pointer;color:#1d2b24}
		.ps-klausimas .myg .k-irasyti{background:#1f7a4d;border-color:#1f7a4d;color:#fff;font-weight:600}
		.ps-klausimas .myg .k-irasyti:hover{background:#1a6a43}
		.ps-klausimas .myg .k-prarasti{color:#ac3226}
		.ps-klausimas .myg .k-prarasti:hover{background:#fbe8e5;border-color:#ac3226}

		/* v4.6: PAVADINIMAS REDAGUOJAMAS */
		.kort-pav-keisti{background:0;border:0;cursor:pointer;color:#8d9691;font-size:14px;
			padding:0 4px;vertical-align:2px}
		.kort-pav-keisti:hover{color:#1f7a4d}
		.kort-pav-red{margin:8px 0 4px}
		.kort-pav-red[hidden]{display:none!important}
		.kort-pav-in{width:100%;padding:8px 11px;font:inherit;font-size:15px;line-height:1.4;
			border:1px solid #dfe4dd;border-radius:7px;resize:vertical}
		.kort-pav-in:focus{outline:none;border-color:#3a7bd5;box-shadow:0 0 0 3px rgba(58,123,213,.14)}
		.kort-pav-myg{display:flex;gap:7px;align-items:center;margin-top:7px}
		.kort-pav-myg button{border:1px solid #dfe4dd;background:#fff;border-radius:6px;padding:5px 13px;
			font:inherit;font-size:13px;cursor:pointer;color:#1d2b24}
		.kort-pav-myg .kort-pav-irasyti{background:#1f7a4d;border-color:#1f7a4d;color:#fff;font-weight:600}
		.kort-pav-myg .kort-pav-irasyti:hover{background:#1a6a43}
		.kort-pav-myg button:disabled{opacity:.5;cursor:default}
		.kort-pav-stat{font-size:12px}
		.kort-pav-stat.ok{color:#1e7a3c}.kort-pav-stat.kl{color:#a52020}

		/* v4.6: SKU SPYNA */
		.kort-spyna{font-size:11px;cursor:help;margin-left:3px}
		.kort-red input.uzrakintas{background:#f4f6f3;color:#59625d;cursor:default}
		.kort-atrakinti{background:0;border:0;color:#8a5f00;cursor:pointer;font-size:11.5px;
			text-decoration:underline;padding:0 3px}
		.kort-atrakinti:hover{color:#6b4a00}
		.kort-atrakinti[hidden]{display:none!important}

		/* v4.5: ATRIBUTAI VIETOJE */
		.kort-atr{padding:5px 0;border-bottom:1px solid #eef1ec}
		.kort-atr:last-child{border-bottom:0}
		.kort-atr-h{display:flex;align-items:baseline;gap:10px}
		.kort-atr-h > span:first-child{color:#3d4650;font-size:13.5px;flex:none;min-width:130px}
		.kort-atr-rodo{flex:1;text-align:right;font-size:13.5px;color:#1d2b24}
		.kort-atr-keisti{background:0;border:0;color:#1f7a4d;cursor:pointer;font-size:12px;
			text-decoration:underline;padding:0 2px}
		.kort-atr-keisti:hover{color:#155c3a}
		.kort-atr-stat{font-size:12px}
		.kort-atr-stat.ok{color:#1e7a3c}.kort-atr-stat.kl{color:#a52020}
		.kort-atr-lauk{padding:8px 0 4px}
		.kort-atr-lauk[hidden]{display:none!important}
		.kort-atr-sar{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:3px 10px;
			max-height:190px;overflow-y:auto;padding:6px 8px;border:1px solid #dfe4dd;border-radius:6px;background:#fff}
		.kort-atr-sar label{display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer}
		.kort-atr-sel{width:100%;padding:6px 8px;border:1px solid #dfe4dd;border-radius:6px;font-size:13.5px;background:#fff}
		.kort-atr-myg{display:flex;gap:7px;margin-top:7px}
		.kort-atr-myg button{border:1px solid #dfe4dd;background:#fff;border-radius:6px;padding:5px 12px;
			font:inherit;font-size:13px;cursor:pointer;color:#1d2b24}
		.kort-atr-myg .kort-atr-irasyti{background:#1f7a4d;border-color:#1f7a4d;color:#fff;font-weight:600}
		.kort-atr-myg .kort-atr-irasyti:hover{background:#1a6a43}
		.kort-atr-myg button:disabled{opacity:.5;cursor:default}

		/* v4.5: NUOTRAUKU VALDYMAS */
		.kort-foto-myg{display:flex;gap:8px;align-items:center;margin-top:9px;flex-wrap:wrap}
		.kort-foto-myg button{border:1px solid #dfe4dd;background:#fff;border-radius:6px;padding:6px 13px;
			font:inherit;font-size:13px;cursor:pointer;color:#1d2b24}
		.kort-foto-myg button:hover{background:#f4f6f3;border-color:#1f7a4d;color:#1f7a4d}
		.kort-foto-myg button.pav{color:#ac3226}
		.kort-foto-myg button.pav:hover{background:#fbe8e5;border-color:#ac3226;color:#ac3226}
		.kn-stat{font-size:12px;color:#1e7a3c}
		.kort-gal-red{grid-template-columns:repeat(auto-fill,minmax(96px,1fr))}
		.kg-el{position:relative}
		.kg-el img{width:100%;aspect-ratio:1;object-fit:contain;border:1px solid #e8ebe6;border-radius:5px;background:#fff}
		.kg-veiksmai{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:center;gap:1px;
			background:rgba(29,36,34,.82);border-radius:0 0 5px 5px;opacity:0;transition:opacity .12s}
		.kg-el:hover .kg-veiksmai{opacity:1}
		.kg-veiksmai button{background:0;border:0;color:#e8ebe6;cursor:pointer;font-size:12px;padding:3px 5px;line-height:1}
		.kg-veiksmai button:hover{color:#fff;background:rgba(255,255,255,.16)}
		.kg-veiksmai .kg-salinti:hover{background:#ac3226}
		.kg-el.dingsta{opacity:.35}
		</style>';
	}

	private static function stilius_v34() {
		echo '<style>
		.pskat-kort { width:min(1180px, calc(100vw - 60px)) !important; max-width:none !important;
			box-shadow:-2px 0 24px rgba(0,0,0,.14); }
		/* v4.6: kortelė FIXED, ne sticky. Su sticky ji sekė puslapio slinktį —
		   atidarius prekę iš nuscrollinto sąrašo kortelės viršus (nuotrauka,
		   pavadinimas, kaina) likdavo virš ekrano krašto. Dabar kortelė visada
		   pilna nuo viršaus, nesvarbu kur nuslinktas sąrašas. */
		/* v4.7 TAISYMAS: `height:auto` su nustatytais top+bottom pagal CSS
		   reiškia „aukštis pagal turinį", o `bottom` tada IGNORUOJAMAS.
		   Todėl kortelė išaugdavo iki 1161 px prie 1050 px ekrano, vidinė
		   slinktis nustodavo veikti (scrollHeight == clientHeight) ir apatinė
		   turinio dalis — pusė aprašymų lango — likdavo nukirsta ir
		   nepasiekiama. Aukštis nurodomas konkrečiai. */
		.pskat-kort { position:fixed !important; top:32px; right:0;
			height:calc(100vh - 32px) !important; max-height:none !important;
			overflow-y:auto !important; z-index:70; }
		body.kort-atverta .pskat-main { margin-right:min(1180px, calc(100vw - 60px)); }
		@media (max-width:782px){ .pskat-kort { top:46px; height:calc(100vh - 46px) !important; } }
		.pskat-kort .kort-turinys { padding:0 18px 24px; }
		.kort-grid { display:grid; grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);
			gap:16px; align-items:start; }
		@media (max-width:1100px){ .kort-grid { grid-template-columns:1fr; } }
		.kort-kaire .kort-blokas, .kort-desine .kort-blokas { margin:0 0 12px; }
		.kort-desine .kort-blokas { background:#f7f9f6; }
		.pskat-kort .kort-head { padding:14px 0 10px; gap:14px; }
		.pskat-kort .kort-img { width:64px; height:64px; }
		.pskat-kort .kort-pav h2 { font-size:19px; line-height:1.3; margin:0; }
		.kort-eil { display:flex; justify-content:space-between; gap:12px;
			padding:5px 0; border-bottom:1px solid #eef1ec; }
		.kort-eil:last-child { border-bottom:0; }
		.kort-eil > span:first-child { color:#6b7580; font-size:12px; }
		.kort-red { display:inline-flex; align-items:center; gap:6px; }
		.kort-red input { width:96px; text-align:right; padding:3px 7px; font-size:14px;
			border:1px solid #d6dbd4; border-radius:5px; background:#fff; }
		.kort-red input:focus { outline:none; border-color:#3a7bd5; box-shadow:0 0 0 2px rgba(58,123,213,.15); }
		.kort-red .vnt { color:#8d9691; font-size:12px; }
		.kort-skaic { font-size:12px; color:#6b7580; margin-top:4px; }
		</style>';
	}

	private static function stilius_v33() {
		echo '<style>
		/* --- PILNAS EKRANAS: WP meniu paslepiamas TIK siame puslapyje --- */
		#adminmenumain, #adminmenuwrap, #adminmenuback { display:none !important; }
		#wpcontent, #wpfooter { margin-left:0 !important; }
		#wpbody-content { padding-bottom:20px; }
		html.wp-toolbar { padding-top:32px; }
		body.petshop-katalogas { background:#e9ebe7 !important; }
		.pskat-app { max-width:none; }

		/* --- Sava virsutine juosta issitempia per visa ploti --- */
		.pskat-bar { position:sticky; top:32px; z-index:60; }

		/* --- Lentele: erdvesne, kaip makete --- */
		.pskat-t { background:#fff; }
		.pskat-t thead th { font-size:11px; letter-spacing:.04em; color:#8d9691;
			background:#f4f6f3; padding:8px 10px; }
		.pskat-t tbody td { padding:8px 10px; border-bottom:1px solid #e8ebe6; font-size:14px; }
		.pskat-t tbody tr:hover { background:#f7f9f6; }

		/* --- Prekes pavadinimas: pagrindinis atpazinimo taskas --- */
		.pskat-t td.pav { line-height:1.35; }
		.pskat-t td.pav a.atv { font-size:15px; font-weight:600; color:#1d2b24; text-decoration:none; }
		.pskat-t td.pav a.atv:hover { text-decoration:underline; }
		.pskat-t td.pav .sub { display:block; margin-top:2px; font-size:11px; color:#8d9691; }

		/* --- Nuotrauka + kategorijos kodas vienoje kolonoje --- */
		.pskat-t td.foto-lang { text-align:center; white-space:nowrap; }
		.pskat-t td.foto-lang .mini { width:34px; height:34px; object-fit:contain; border-radius:4px; }
		.pskat-t .kat-kodas { display:block; margin-top:3px; font-size:9px; font-weight:600;
			letter-spacing:.06em; color:#8d9691; }

		/* --- Suvestine po lentele --- */
		.pskat-suv { margin-top:14px; background:#fff; border-radius:8px; }
		</style>';
	}

	private static function stilius_v29() {
		echo '<style>
		.pskat-t .pard-gr{display:inline-flex;align-items:baseline;gap:5px;justify-content:flex-end}
		.pskat-t .pard-gr b{font-weight:600}
		.pskat-t .pard-gr i{font-style:normal;font-size:10px;padding:1px 5px;border-radius:9px;background:#eef1f4;color:#5b6672}
		.pskat-t .pard-gr.abc_a i{background:#e6f4ea;color:#1e7a3c}
		.pskat-t .pard-gr.abc_b i{background:#fff4e0;color:#8a5b00}
		.pskat-t .pard-gr.abc_c i{background:#eef1f4;color:#5b6672}
		.pskat-t .pard-gr u{text-decoration:none;font-size:10px;font-weight:600;padding:1px 5px;border-radius:9px;margin-left:2px}
		.pskat-t .dienu{font-weight:600;padding:1px 7px;border-radius:9px}
		.pskat-t .dienu.d_ok{background:#e6f4ea;color:#1e7a3c}
		.pskat-t .dienu.d_warn{background:#fff4e0;color:#8a5b00}
		.pskat-t .dienu.d_bad{background:#fdeaea;color:#a52020}
		.pskat-t th.bukle-th{width:34px;padding-left:2px;padding-right:2px}
		.pskat-t .piln{font-size:11px;font-weight:600;padding:1px 6px;border-radius:9px;white-space:nowrap}
		.pskat-t .piln.p_ok{background:#e6f4ea;color:#1e7a3c}
		.pskat-t .piln.p_kone{background:#eef4fb;color:#2c5b8f}
		.pskat-t .piln.p_warn{background:#fff4e0;color:#8a5b00}
		.pskat-t .piln.p_bad{background:#fdeaea;color:#a52020}
		.kort-pard{display:flex;gap:14px;flex-wrap:wrap;margin:2px 0 6px}
		.kort-pard div{min-width:74px}
		.kort-pard span{display:block;font-size:11px;color:#6b7580}
		.kort-pard b{font-size:16px;font-weight:600}
		.kort-piln-juosta{height:6px;border-radius:3px;background:#eef1f4;overflow:hidden;margin:4px 0}
		.kort-piln-juosta i{display:block;height:100%;background:#3a7bd5}
		.kort-broliai{width:100%;border-collapse:collapse;font-size:12px;margin:2px 0}
		.kort-broliai td{padding:3px 6px;border-bottom:1px solid #eef1f4}
		.kort-broliai tr.si{background:#f3f7fd}
		.kort-broliai .num{text-align:right;white-space:nowrap}
		.kort-spejimas{margin:6px 0;padding:7px 9px;border-radius:6px;background:#fff4e0;color:#8a5b00;font-size:12px;line-height:1.5}
		.mat{font-size:11px;font-weight:600;padding:1px 7px;border-radius:9px}
		.mat.taip{background:#e6f4ea;color:#1e7a3c}
		.mat.ne{background:#eef1f4;color:#6b7580}
		</style>';
	}

	private static function stilius() {
		echo '<style>
		#wpcontent{padding-left:0}
		.pskat-bar{display:flex;align-items:center;gap:18px;background:#1d2422;color:#e8ebe6;padding:10px 18px}
		.pskat-logo{font-weight:700;letter-spacing:.06em;font-size:13px}
		.pskat-nav a{color:#a9b3ad;text-decoration:none;margin-right:16px;font-size:13px}
		.pskat-nav a.on,.pskat-nav a:hover{color:#fff}
		.pskat-search{flex:1;position:relative;display:flex;align-items:center}
		/* v4.4: paieška buvo juoda ant juodos — lauko nesimatė (savininko
		   pastaba 2026-08-10). Dabar BALTAS laukas su lupa ant tamsios juostos. */
		.pskat-search .lupa{position:absolute;left:12px;font-size:14px;opacity:.55;pointer-events:none}
		.pskat-search input{width:100%;max-width:560px;padding:9px 12px 9px 34px;border:1px solid #fff;
			border-radius:8px;background:#fff;color:#1a201e;font-size:14px}
		.pskat-search input::placeholder{color:#7d8781}
		.pskat-search input:focus{outline:3px solid rgba(31,122,77,.45);outline-offset:0;border-color:#1f7a4d}
		.pskat-meta{font-size:12px;color:#8d9691}
		.pskat-meta a{color:#8d9691}
		.pskat-kruvos{display:flex;align-items:center;gap:6px;background:#fff;border-bottom:1px solid #d3d8d2;padding:8px 18px}
		.pskat-kruvos .et{font-size:11px;color:#8d9691;text-transform:uppercase;letter-spacing:.06em;margin-right:6px}
		.pskat-kruvos .k{display:inline-flex;align-items:center;gap:7px;padding:5px 12px;border-radius:20px;
			text-decoration:none;color:#59625d;font-size:13px;border:1px solid #d3d8d2;background:#fff}
		.pskat-kruvos .k:hover{background:#f4f6f3;color:#1a201e}
		.pskat-kruvos .k.on{background:#1d2422;border-color:#1d2422;color:#fff;font-weight:600}
		.pskat-kruvos .k .n{font-family:ui-monospace,Consolas,monospace;font-size:12px;opacity:.75}
		.pskat-kruvos .paaisk{margin-left:auto;font-size:11px;color:#8d9691}
		.pskat-layout{display:flex;gap:0;background:#e9ebe7;min-height:calc(100vh - 118px)}
		.pskat-rail{width:230px;flex:none;background:#e9ebe7;padding:14px 10px 20px}
		.pskat-rail h3{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#8d9691;margin:16px 6px 6px}
		.pskat-view{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 10px;border-radius:7px;
			text-decoration:none;color:#1a201e;font-size:13px;line-height:1.3}
		.pskat-view:hover{background:#dfe3dd;color:#1a201e}
		.pskat-view.on{background:#fff;font-weight:600;box-shadow:0 1px 2px rgba(20,30,25,.06)}
		.pskat-view .n{font-family:ui-monospace,Consolas,monospace;font-size:12px;color:#59625d}
		.pskat-view .n.warn{color:#8a5f00}
		.pskat-view .n.bad{color:#ac3226}
		.pskat-view .n.nula{color:#b3bab5!important;font-weight:400}
		.pskat-nota{margin:16px 8px;font-size:11px;color:#8d9691;line-height:1.5}
		.pskat-main{flex:1;padding:14px 18px 40px;min-width:0}
		body.yra-pakeitimu .pskat-main{padding-bottom:96px}
		body.kort-atverta .pskat-main{padding-right:8px}
		.pskat-kort{width:430px;flex:none;background:#fff;border-left:1px solid #d3d8d2;
			position:sticky;top:0;align-self:flex-start;max-height:100vh;overflow-y:auto}
		.kort-juosta{display:flex;align-items:center;gap:6px;padding:8px 12px;border-bottom:1px solid #e8ebe6;
			position:sticky;top:0;background:#fff;z-index:5}
		.kort-x{font-size:20px;line-height:1;background:0;border:0;cursor:pointer;color:#8d9691;padding:0 6px}
		.kort-x:hover{color:#ac3226}
		.kort-nav{display:flex;gap:4px}
		.kort-veiksmai{margin-left:auto;position:relative}
		.kort-vm{background:#fff;border:1px solid #d3d8d2;color:#59625d;border-radius:6px;
			padding:3px 10px;font-size:12px;cursor:pointer}
		.kort-vm:hover{background:#f4f6f3;color:#1a201e}
		.kort-meniu{position:absolute;right:0;top:26px;background:#fff;border:1px solid #d3d8d2;
			border-radius:8px;box-shadow:0 6px 18px rgba(20,30,25,.16);display:flex;flex-direction:column;
			min-width:184px;z-index:20;overflow:hidden;padding:3px}
		.kort-meniu[hidden]{display:none!important}
		.kort-meniu button{background:0;border:0;text-align:left;padding:7px 11px;font-size:12.5px;
			cursor:pointer;color:#1a201e;border-radius:5px}
		.kort-meniu button:hover{background:#f4f6f3}
		.kort-meniu button.pav{color:#ac3226;border-top:1px solid #e8ebe6;margin-top:3px;padding-top:8px;border-radius:0 0 5px 5px}
		.kort-meniu button.pav:hover{background:#fbe8e5}
		.kort-meniu button:disabled{opacity:.5;cursor:default}
		.pskat-t tbody tr.isimta{opacity:.4}
		.pskat-t tbody tr.isimta td{text-decoration:line-through}
		.kort-nav button{background:#f4f6f3;border:1px solid #d3d8d2;border-radius:6px;cursor:pointer;
			padding:2px 9px;color:#59625d;font-size:13px}
		.kort-nav button:hover{background:#e8ebe6;color:#1a201e}
		.kort-kraunasi,.kort-klaida{padding:30px 16px;color:#8d9691;text-align:center;font-size:13px;line-height:2}
		.kort-klaida{color:#ac3226}
		.kort-kartoti{margin-top:10px;background:#1f7a4d;color:#fff;border:0;border-radius:7px;
			padding:7px 15px;font-size:13px;cursor:pointer}
		.kort-kartoti:hover{background:#1a6a43}
		.kort-head{display:flex;gap:12px;padding:14px 16px;border-bottom:1px solid #e8ebe6}
		.kort-img{width:76px;height:76px;object-fit:contain;border:1px solid #e8ebe6;border-radius:7px;background:#fff;flex:none}
		.kort-img.nera{display:flex;align-items:center;justify-content:center;color:#cfd5d0;border-style:dashed;font-size:22px}
		.kort-pav h2{font-size:14px;margin:0 0 4px;line-height:1.35;font-weight:600}
		.kort-sub{font-size:11px;color:#8d9691;font-family:ui-monospace,Consolas,monospace;line-height:1.5}
		.kort-nuor{margin-top:6px;display:flex;gap:10px}
		.kort-nuor a{font-size:11px;color:#1f7a4d;text-decoration:none}
		.kort-nuor a:hover{text-decoration:underline}
		.kort-blokas{padding:12px 16px;border-bottom:1px solid #e8ebe6}
		.kort-antr{display:flex;align-items:center;font-size:11px;text-transform:uppercase;letter-spacing:.06em;
			color:#8d9691;font-weight:600;margin-bottom:8px}
		.kort-p{margin-left:auto;font-family:ui-monospace,Consolas,monospace;font-size:11px;
			padding:1px 7px;border-radius:5px;background:#f4f6f3;color:#59625d;text-transform:none;letter-spacing:0}
		.kort-p.ok{background:#e4f2ea;color:#1f7a4d}
		.kort-p.warn{background:#fbf0d5;color:#8a5f00}
		.kort-eil{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:3px 0;font-size:13px}
		.kort-eil span:first-child{color:#59625d}
		.kort-eil b{font-family:ui-monospace,Consolas,monospace;font-weight:600}
		.kort-eil b.nula{color:#ac3226}
		.kort-eil b.m_ok{color:#1f7a4d}.kort-eil b.m_warn{color:#8a5f00}.kort-eil b.m_bad{color:#ac3226}
		.kort-eil b.akcija{color:#8a5f00}
		.kort-eil b.siul{color:#1f5f88}
		.kort-eil.sml2{font-size:11.5px;color:#8d9691}
		.kort-eil.sml2 span{color:#8d9691}
		.kort-kodel{font-size:11px;color:#8d9691;margin-top:3px}
		.kort-t{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:8px}
		.kort-t th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:#8d9691;
			padding:2px 6px 4px;border-bottom:1px solid #e8ebe6;font-weight:600}
		.kort-t td{padding:5px 6px;border-bottom:1px solid #f2f4f1}
		.kort-t .n{text-align:right;font-family:ui-monospace,Consolas,monospace}
		.kort-t .seni{color:#8a5f00}
		.truksta{font-size:12px;color:#8a5f00;background:#fbf0d5;padding:6px 9px;border-radius:6px}
		.truksta b{color:#7a5400}
		.viskas{font-size:12px;color:#1f7a4d;background:#e4f2ea;padding:6px 9px;border-radius:6px}
		.persp{font-size:11px;color:#8a5f00;background:#fbf0d5;padding:5px 8px;border-radius:5px;margin-top:6px}
		.uzrakinta{font-size:11.5px;color:#59625d;background:#f4f6f3;padding:6px 9px;border-radius:6px;margin-top:6px}

		.kort-tabs{display:flex;gap:2px;padding:0 12px;border-bottom:1px solid #e8ebe6;
			position:sticky;top:41px;background:#fff;z-index:4}
		.kort-tabs button{background:0;border:0;border-bottom:2px solid transparent;padding:8px 10px;
			font-size:12px;color:#59625d;cursor:pointer}
		.kort-tabs button:hover{color:#1a201e}
		.kort-tabs button.on{color:#1f7a4d;border-bottom-color:#1f7a4d;font-weight:600}
		.kort-pane{display:none}
		.kort-pane.on{display:block}
		.tuscia-t{font-size:12px;color:#8d9691;background:#f4f6f3;padding:8px 10px;border-radius:6px}
		.persp-b{font-size:12px;color:#7a5400;background:#fbf0d5;padding:9px 11px;border-radius:6px;line-height:1.6}
		.persp-b b{color:#5e4100;font-family:ui-monospace,Consolas,monospace;font-size:11px}
		.kort-tekstas{font-size:12px;line-height:1.6;color:#3a423e;max-height:230px;overflow-y:auto;
			background:#f9faf8;border:1px solid #eef1ed;border-radius:6px;padding:8px 10px;white-space:pre-wrap}
		.kort-sek{border:1px solid #e8ebe6;border-radius:6px;margin-bottom:5px}
		.kort-sek summary{cursor:pointer;padding:6px 9px;font-size:12px;display:flex;align-items:center;
			justify-content:space-between;list-style:none;font-weight:500}
		.kort-sek summary::-webkit-details-marker{display:none}
		.kort-sek summary:hover{background:#f9faf8}
		.kort-sek summary i{font-style:normal;font-size:10px;color:#8d9691;font-family:ui-monospace,Consolas,monospace}
		.kort-sek[open] summary{border-bottom:1px solid #e8ebe6;background:#f4f6f3}
		.kort-sek .kort-tekstas{border:0;background:0;border-radius:0;max-height:200px}
		.kort-foto{text-align:center;margin-bottom:8px}
		.kort-foto img{max-width:100%;max-height:210px;object-fit:contain;border:1px solid #e8ebe6;
			border-radius:7px;background:#fff}
		.kort-eil .nera{color:#ac3226;font-weight:600}
		.kort-galerija{display:grid;grid-template-columns:repeat(auto-fill,minmax(58px,1fr));gap:5px}
		.kort-galerija img{width:100%;aspect-ratio:1;object-fit:contain;border:1px solid #e8ebe6;
			border-radius:5px;background:#fff}
		.kort-info-m{font-size:11px;color:#8d9691;line-height:1.5;padding:6px 0 0}
		.kort-ist{display:flex;flex-direction:column;gap:1px}
		.ist-eil{padding:6px 8px;border-radius:6px;background:#f9faf8;border-left:2px solid #b8ddc8}
		.ist-eil.atsaukta{opacity:.55;border-left-color:#d8b4ae}
		.ist-v{font-size:12.5px}
		.ist-v b{font-weight:600}
		.ist-sk{font-family:ui-monospace,Consolas,monospace;color:#1f7a4d}
		.ist-eil.atsaukta .ist-sk{color:#8d9691;text-decoration:line-through}
		.ist-m{font-size:10.5px;color:#8d9691;margin-top:2px}
		.kort-info{padding:12px 16px;font-size:11px;color:#b3bab5;line-height:1.5}
		.pskat-t tbody tr.aktyvi td{background:#e4f2ea!important;box-shadow:inset 3px 0 0 #1f7a4d}
		.pskat-t .atv{cursor:pointer}
		/* AV įvedimas */
		.pskat-red{display:flex;align-items:center;gap:8px;margin-bottom:10px;min-height:32px}
		.pskat-red .ijungti{background:#fff;border:1px solid #d3d8d2;border-radius:7px;padding:6px 13px;
			font-size:13px;cursor:pointer;color:#1a201e}
		.pskat-red .ijungti:hover{background:#f4f6f3;border-color:#1f7a4d;color:#1f7a4d}
		.pskat-red .red-vidus{display:flex;align-items:center;gap:8px;background:#e4f2ea;
			border:1px solid #b8ddc8;border-radius:7px;padding:5px 12px;width:100%}
		.pskat-red .ax{font-size:11px;color:#1f7a4d;text-transform:uppercase;letter-spacing:.05em}
		.pskat-red select{padding:4px 7px;border:1px solid #b8ddc8;border-radius:6px;font-size:13px;background:#fff}
		.pskat-red .pat{font-size:12px;color:#2c6b4c}
		.pskat-red .pat b{font-family:ui-monospace,Consolas,monospace;background:#fff;padding:0 4px;
			border-radius:3px;font-weight:600}
		.pskat-red .baigti{margin-left:auto;background:0;border:0;color:#2c6b4c;cursor:pointer;
			font-size:12px;text-decoration:underline}
		body.red-rezimas td.red-lang{cursor:cell;background:#f7fbf8;box-shadow:inset 0 0 0 1px #dceae2}
		body.red-rezimas td.red-lang:hover{background:#e4f2ea}
		td.red-lang.pakeista{background:#fbf0d5!important;box-shadow:inset 0 0 0 1px #e5cf94}
		td.red-lang.persp{background:#fbe8e5!important;box-shadow:inset 0 0 0 1px #e2b3aa}
		td.red-lang.bloga{background:#fbe8e5!important}
		td.red-lang b{font-weight:600;color:#8a5f00}
		td.red-lang i{display:block;font-style:normal;font-size:10px;color:#8d9691;font-weight:400}
		td.red-lang i.mz{color:#1f7a4d}
		td.red-lang i.mz.warn{color:#8a5f00}
		td.red-lang i.mz.bad{color:#ac3226;font-weight:600}
		td.red-lang i.uzr-persp{color:#1f5f88}
		.pskat-red .pat i{display:block;font-style:normal;color:#5a7d6a;font-size:11px;margin-top:1px}
		.pskat-saugoti .kiek i{font-style:normal;color:#a9b3ad;font-size:12px;margin-left:4px}
		.av-ivestis{width:74px;padding:3px 5px;border:2px solid #1f7a4d;border-radius:5px;
			font-family:ui-monospace,Consolas,monospace;font-size:13px;text-align:right;outline:0}
		/* [hidden] turi laimėti prieš display:flex — kitaip juosta kabo visą laiką */
		.pskat-saugoti[hidden],.pskat-red .red-vidus[hidden],.pskat-red .ijungti[hidden],
		.pskat-kort[hidden]{display:none!important}
		/* Kompaktiška juosta, ne per visą ekraną: nedengia nei kortelės, nei kairiojo stulpelio */
		.pskat-saugoti{position:fixed;left:50%;transform:translateX(-50%);bottom:18px;
			background:#1d2422;color:#e8ebe6;padding:10px 14px;display:flex;align-items:center;gap:12px;
			z-index:80;border-radius:11px;box-shadow:0 6px 22px rgba(20,30,25,.3);max-width:calc(100vw - 60px)}
		body.kort-atverta .pskat-saugoti{left:calc(50% - 215px)}
		.pskat-saugoti .kiek{white-space:nowrap;font-size:13px}
		.pskat-saugoti .kiek b{font-family:ui-monospace,Consolas,monospace;font-size:16px;color:#fff}
		td.red-lang.issaugota{background:#e4f2ea!important;box-shadow:inset 0 0 0 1px #b8ddc8}
		td.red-lang.issaugota b{color:#1f7a4d}
		.pskat-saugoti button{border:0;border-radius:7px;padding:8px 16px;font-size:13px;cursor:pointer}
		.pskat-saugoti .issaugoti{margin-left:auto;background:#1f7a4d;color:#fff;font-weight:600}
		.pskat-saugoti .issaugoti:hover{background:#1a6a43}
		.pskat-saugoti .issaugoti:disabled{opacity:.6;cursor:default}
		.pskat-saugoti .atmesti{background:transparent;border:1px solid #4a534f;color:#c9d0cb}

		/* masiniai veiksmai */
		.pskat-t th.ck,.pskat-t td.ck{width:30px;text-align:center;padding-left:8px;padding-right:0}
		.pskat-t .ck input{width:15px;height:15px;cursor:pointer;accent-color:#1f7a4d}
		.pskat-t tbody tr.zym td{background:#eef6f1!important}
		.pskat-masine{position:fixed;left:50%;transform:translateX(-50%);bottom:18px;background:#1d2422;
			color:#e8ebe6;padding:9px 14px;display:flex;align-items:center;gap:10px;z-index:78;
			border-radius:11px;box-shadow:0 6px 22px rgba(20,30,25,.3)}
		.pskat-masine[hidden]{display:none!important}
		body.kort-atverta .pskat-masine{left:calc(50% - 215px)}
		.pskat-masine .kiek{font-size:13px;white-space:nowrap}
		.pskat-masine .kiek b{font-family:ui-monospace,Consolas,monospace;font-size:16px;color:#fff}
		.pskat-masine select{padding:5px 8px;border:1px solid #4a534f;border-radius:6px;font-size:13px;
			background:#2b3532;color:#e8ebe6}
		.pskat-masine button{border:0;border-radius:7px;padding:7px 14px;font-size:13px;cursor:pointer}
		.pskat-masine .ms-perziura{background:#1f7a4d;color:#fff;font-weight:600}
		.pskat-masine .ms-perziura:hover{background:#1a6a43}
		.pskat-masine .ms-nuimti{background:transparent;border:1px solid #4a534f;color:#c9d0cb}
		/* peržiūros langas */
		.pskat-langas{position:fixed;inset:0;background:rgba(20,30,25,.5);z-index:130;
			display:flex;align-items:center;justify-content:center;padding:28px}
		.pskat-langas[hidden]{display:none!important}
		.pskat-langas .lg{background:#fff;border-radius:11px;max-width:820px;width:100%;max-height:84vh;
			display:flex;flex-direction:column;padding:18px 20px}
		.pskat-langas h3{margin:0 0 6px;font-size:16px}
		.lg-santrauka{font-size:13px;color:#59625d;margin-bottom:10px}
		.lg-santrauka .persp{color:#8a5f00;font-weight:600}
		.lg-turinys{flex:1;overflow-y:auto;border:1px solid #e8ebe6;border-radius:8px}
		.lg-t{width:100%;border-collapse:collapse;font-size:12.5px}
		.lg-t th{background:#f4f6f3;text-align:left;padding:6px 9px;font-size:10.5px;text-transform:uppercase;
			letter-spacing:.05em;color:#59625d;position:sticky;top:0}
		.lg-t td{padding:6px 9px;border-bottom:1px solid #f2f4f1;vertical-align:top}
		.lg-t tr.persp-eil td{background:#fbf0d5}
		.lg-t td.d{color:#8a5f00;font-weight:600;white-space:nowrap}
		.lg-t .sub{display:block;font-size:10px;color:#8d9691;font-family:ui-monospace,Consolas,monospace}
		.lg-praleisti{padding:8px 10px;font-size:11.5px;color:#8d9691;border-top:1px solid #e8ebe6}
		.lg-myg{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
		.lg-myg button{padding:8px 18px;border-radius:7px;font-size:13.5px;cursor:pointer;border:1px solid #d3d8d2;background:#fff}
		.lg-myg .vykdyk{background:#1f7a4d;color:#fff;border-color:#1f7a4d;font-weight:600}
		.lg-myg .vykdyk:hover{background:#1a6a43}
		.lg-myg button:disabled{opacity:.6;cursor:default}
		.pskat-pranes{position:fixed;right:20px;bottom:20px;z-index:120;background:#1d2422;color:#e8ebe6;
			padding:12px 16px;border-radius:9px;box-shadow:0 6px 20px rgba(0,0,0,.28);max-width:460px;
			display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-size:13px}
		.pskat-pranes .past{width:100%;font-size:11px;color:#c9d0cb;line-height:1.5}
		.pskat-pranes button{background:#3a4441;border:0;color:#e8ebe6;padding:5px 11px;border-radius:6px;
			cursor:pointer;font-size:12px}
		.pskat-pranes button:hover{background:#4a5450}
		.pskat-pranes .x{background:0;padding:0 6px;font-size:17px;line-height:1}

		.pskat-filters{background:#fff;border:1px solid #d3d8d2;border-radius:9px;padding:8px 12px;margin-bottom:10px}
		.pskat-filters .frline{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:3px 0}
		.pskat-filters .ax{font-size:11px;color:#8d9691;text-transform:uppercase;letter-spacing:.05em;margin-left:4px}
		.pskat-filters select{padding:4px 6px;border:1px solid #d3d8d2;border-radius:6px;font-size:13px;max-width:230px;min-width:86px}
		.pskat-filters select.siauras{min-width:64px;max-width:76px}
		.pskat-filters .sep{width:1px;height:18px;background:#e8ebe6;margin:0 6px}
		.pskat-filters .ieskolaukas{position:relative;display:inline-flex;align-items:center}
		.pskat-filters .ieskolaukas input{padding:4px 22px 4px 7px;border:1px solid #d3d8d2;border-radius:6px;
			font-size:13px;width:172px;background:#fff}
		.pskat-filters .ieskolaukas input:focus{outline:2px solid #1f7a4d;outline-offset:-1px;border-color:#1f7a4d}
		.pskat-filters .ieskolaukas .x{position:absolute;right:5px;color:#8d9691;text-decoration:none;
			font-size:15px;line-height:1;padding:0 2px}
		.pskat-filters .ieskolaukas .x:hover{color:#ac3226}
		.pskat-filters .kiek-sar{font-size:11px;color:#b3bab5;margin-left:4px}
		.pskat-filters .clear{margin-left:auto;font-size:12px;color:#59625d}
		.pskat-suv{display:flex;gap:0;background:#fff;border:1px solid #d3d8d2;border-radius:9px;margin-bottom:10px;overflow:hidden}
		.pskat-suv .p{flex:1;padding:9px 14px;border-right:1px solid #e8ebe6}
		.pskat-suv .p:last-child{border-right:0}
		.pskat-suv .l{display:block;font-size:11px;color:#8d9691}
		.pskat-suv .l i{font-style:normal;cursor:help;margin-left:3px;color:#b3bab5}
		.pskat-suv .v{display:block;font-size:17px;font-family:ui-monospace,Consolas,monospace;margin-top:2px}
		.pskat-t{width:100%;border-collapse:collapse;background:#fff;border:1px solid #d3d8d2;border-radius:9px;overflow:hidden;font-size:13px}
		.pskat-t th{background:#f4f6f3;text-align:left;padding:8px 10px;border-bottom:1px solid #d3d8d2;font-size:11px;
			text-transform:uppercase;letter-spacing:.05em;color:#59625d;font-weight:600}
		.pskat-t th a{color:#59625d;text-decoration:none}
		.pskat-t th .ar{color:#1f7a4d}
		.pskat-t td{padding:6px 10px;border-bottom:1px solid #e8ebe6;vertical-align:middle}
		.pskat-t tbody tr{content-visibility:auto;contain-intrinsic-size:auto 48px}
		.pskat-t th .pvm{display:block;font-size:10px;font-weight:400;text-transform:none;letter-spacing:0;color:#8d9691;margin-top:1px}
		.pskat-t tr:hover td{background:#f9faf8}
		.pskat-t .num{text-align:right;font-family:ui-monospace,Consolas,monospace}
		.pskat-t .c{text-align:center}
		.pskat-t .pav a{color:#1a201e;text-decoration:none;font-weight:500}
		.pskat-t .pav a:hover{color:#1f7a4d}
		.pskat-t .sub{display:block;font-size:11px;color:#8d9691;margin-top:2px}
		.pskat-t td{white-space:nowrap}
		.pskat-t td.pav{white-space:normal;min-width:300px}
		.pskat-t th.num,.pskat-t td.num{width:1%}
		.pskat-t .mono{font-family:ui-monospace,Consolas,monospace}
		.pskat-t .sml{font-size:11px;color:#8d9691}
		.pskat-t .tuscia{text-align:center;color:#8d9691;padding:26px}
		.pskat-t .nezinoma{color:#b3bab5}
		.pskat-t .pard{font-weight:600}
		.pskat-t .pard.nula{color:#ac3226}
		.pskat-t .m_ok{color:#1f7a4d}
		.pskat-t .m_warn{color:#8a5f00}
		.pskat-t .m_bad{color:#ac3226;font-weight:600}
		.pskat-t .namas{color:#b3bab5;text-decoration:none;font-size:14px;margin-left:4px}
		.pskat-t .namas:hover{color:#1f7a4d}
		/* būklės taškas su pilnumo skaičiumi */
		.bukle{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;
			border-radius:50%;font-size:10px;font-family:ui-monospace,Consolas,monospace;cursor:help;
			font-weight:600;line-height:1}
		.bukle.ok{background:#e4f2ea;color:#1f7a4d}
		.bukle.warn{background:#fbf0d5;color:#8a5f00}
		.bukle.bad{background:#fbe8e5;color:#ac3226}
		/* miniatiūra — esamas thumbnail, sumažintas */
		.pskat-t .mini{width:36px;height:36px;object-fit:contain;border-radius:4px;background:#fff;
			border:1px solid #e8ebe6;display:block}
		.pskat-t .tuscia-img{display:flex;align-items:center;justify-content:center;color:#cfd5d0;
			font-size:14px;border-style:dashed}
		/* kaina */
		.pskat-t .kaina .uzr{margin-left:4px;font-size:11px;cursor:help}
		.pskat-t .kaina .akc{display:inline-block;margin-left:5px;font-size:9px;padding:1px 4px;border-radius:3px;
			background:#fbf0d5;color:#8a5f00;font-family:inherit;letter-spacing:.03em;cursor:help;vertical-align:1px}
		.pskat-t .siul{display:block;font-size:11px;margin-top:1px;cursor:help;font-weight:400}
		.pskat-t .siul.auks{color:#1f7a4d}
		.pskat-t .siul.zem{color:#8d9691}
		/* marža plokštele */
		.pskat-t .marza{display:inline-flex;flex-direction:column;align-items:flex-end;gap:0;
			padding:3px 7px;border-radius:6px;cursor:help;line-height:1.25}
		.pskat-t .marza b{font-size:13px;font-weight:600}
		.pskat-t .marza i{font-style:normal;font-size:10px;opacity:.8}
		.pskat-t .marza.m_ok{background:#e4f2ea;color:#1f7a4d}
		.pskat-t .marza.m_warn{background:#fbf0d5;color:#8a5f00}
		.pskat-t .marza.m_bad{background:#fbe8e5;color:#ac3226}
		.pskat-t .zem-ribos{display:block;font-size:9px;color:#ac3226;margin-top:2px;letter-spacing:.02em}
		.pskat-t .nezinoma.bs{border-bottom:1px dashed #d8b4ae;cursor:help}
		.pskat-t [data-p]{cursor:help}
		/* debesėlis */
		.pskat-deb{position:absolute;display:none;z-index:99999;max-width:340px;background:#1d2422;color:#f2f4f1;
			padding:7px 10px;border-radius:7px;font-size:12px;line-height:1.45;pointer-events:none;
			box-shadow:0 4px 14px rgba(20,30,25,.22)}
		.pskat-deb:after{content:"";position:absolute;left:50%;margin-left:-5px;border:5px solid transparent;
			border-top-color:#1d2422;bottom:-10px}
		.pskat-deb.apacia:after{bottom:auto;top:-10px;border-top-color:transparent;border-bottom-color:#1d2422}
		.z{display:inline-block;font-size:10px;padding:1px 5px;border-radius:4px;margin-left:6px;vertical-align:middle}
		.z.draft{background:#e5eef5;color:#1f5f88}
		.z.bad{background:#fbe8e5;color:#ac3226}
		.z.warn{background:#fbf0d5;color:#8a5f00}
		.z.ok{background:#e4f2ea;color:#1f7a4d}
		.sand{font-size:11px;font-family:ui-monospace,Consolas,monospace;padding:2px 6px;border-radius:5px;background:#f4f6f3;color:#59625d}
		.sand.s_av{background:#e4f2ea;color:#1f7a4d}
		.sand.s_vf{background:#e5eef5;color:#1f5f88}
		.sand.s_zb{background:#efe9f7;color:#5c3d86}
		/* v4.2: spalvas turėjo tik AV/VF/ZB — kiti keturi šaltiniai susiliedavo
		   į pilką. Kiekvienam šaltiniui pastovi spalva visoje sistemoje. */
		.sand.s_quattro{background:#fdf0e3;color:#9a5b12}
		.sand.s_prins{background:#e2f2f2;color:#146b6b}
		.sand.s_ambrosia{background:#fbeaf3;color:#a1336f}
		.sand.s_belcor_tofu{background:#eef2df;color:#5a6e1f}
		.sand.s_legacy{background:#f1ede3;color:#6e5f3c}
		/* v5.5: partiju redagavimas */
		.kort-part .pt-red input{width:78px;padding:3px 7px;border:1px solid #dfe4dd;border-radius:5px;
			font:inherit;font-size:12.5px;text-align:right;font-family:ui-monospace,Consolas,monospace;background:#fff}
		.kort-part .pt-red.pt-data input{width:126px;text-align:left}
		.kort-part .pt-red input:focus{outline:none;border-color:#1f7a4d;box-shadow:0 0 0 3px rgba(31,122,77,.14)}
		.kort-part .pt-red input.purvinas{background:#fbf0d5!important;border-color:#e5cf94!important}
		.kort-part tr.isnaudota{color:#8d9691}
		.kort-part tr.isnaudota .pt-red input{background:#f7f8f6}
		.kort-part .pt-liko{display:block;font-size:10.5px;color:#8d9691;margin-top:2px}
		.kort-part .pt-galas{white-space:nowrap;text-align:right}
		.kort-part .pt-stat{display:block;font-size:11px;margin-top:2px}
		.kort-part .pt-stat.ok{color:#1e7a3c}
		.kort-part .pt-stat.kl{color:#a52020}

		/* v6.0: irasymo patvirtinimas lauke */
		.kort-red input.irasyta,.kort-part .pt-red input.irasyta{
			background:#e4f2ea!important;border-color:#8ec5a6!important;transition:background .4s}

		/* v6.0: kur buvai — trumpas paryskinimas grizus is korteles */
		.pskat-t tbody tr.buvo td{background:#fff8e6!important;transition:background .5s}
		.pskat-t tbody tr.buvo td:first-child{box-shadow:inset 3px 0 0 #e5cf94}

		/* v5.3: paleidimo data */
		.pskat-paleidimas{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#fbf0d5;
			border:1px solid #e5cf94;border-radius:9px;padding:9px 14px;margin-bottom:10px;
			font-size:12.5px;color:#7a5400;line-height:1.5}
		.pskat-paleidimas.nustatyta{background:#fff;border-color:#d3d8d2;color:#3d4650}
		.pskat-paleidimas b{color:#1d2b24}
		.pskat-paleidimas button{border:1px solid #d3d8d2;background:#fff;border-radius:6px;padding:4px 11px;
			font:inherit;font-size:12.5px;cursor:pointer;color:#1d2b24}
		.pskat-paleidimas button:hover{background:#f4f6f3;border-color:#1f7a4d;color:#1f7a4d}
		.pl-forma{display:flex;align-items:center;gap:6px}
		.pl-forma[hidden]{display:none!important}
		.pl-forma input{padding:4px 8px;border:1px solid #dfe4dd;border-radius:6px;font:inherit;font-size:12.5px}
		.pl-stat{font-size:12px;color:#1e7a3c}

		/* v5.2: laikotarpio juosta */
		.pskat-laikot{display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:#fff;
			border:1px solid #d3d8d2;border-radius:9px;padding:9px 14px;margin-bottom:10px;font-size:13px}
		.pskat-laikot .et{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#6b7580;font-weight:600}
		.pskat-laikot .lg{text-decoration:none;color:#3d4650;border:1px solid #dfe4dd;border-radius:6px;
			padding:4px 11px;font-size:12.5px}
		.pskat-laikot .lg:hover{background:#e4f2ea;border-color:#1f7a4d;color:#1f7a4d}
		.pskat-laikot .lg.on{background:#1d2422;border-color:#1d2422;color:#fff;font-weight:600}
		.lg-nuo-iki{display:flex;align-items:center;gap:5px;margin-left:4px}
		.lg-nuo-iki .et2{font-size:12px;color:#8d9691}
		.lg-nuo-iki input{width:62px;padding:4px 7px;border:1px solid #dfe4dd;border-radius:6px;
			font:inherit;font-size:12.5px;text-align:right;font-family:ui-monospace,Consolas,monospace}
		.lg-nuo-iki button{border:1px solid #dfe4dd;background:#fff;border-radius:6px;padding:4px 11px;
			font:inherit;font-size:12.5px;cursor:pointer;color:#1d2b24}
		.lg-nuo-iki button:hover{background:#f4f6f3;border-color:#1f7a4d;color:#1f7a4d}
		.pskat-laikot .pat2{font-size:11.5px;color:#8d9691;margin-left:auto;max-width:420px;line-height:1.45}
		.lg-akcija{margin-left:auto;background:#1f7a4d;color:#fff!important;text-decoration:none;
			padding:6px 14px;border-radius:7px;font-size:12.5px;font-weight:600}
		.lg-akcija:hover{background:#1a6a43}

		/* v5.1: geriausia iki */
		.gi{font-family:ui-monospace,Consolas,monospace;font-size:12.5px;font-weight:600}
		.gi.bad{color:#ac3226}.gi.warn{color:#8a5f00}
		.gi-d{display:block;font-size:10.5px;color:#8d9691;font-family:-apple-system,sans-serif}
		.pskat-psl{display:flex;align-items:center;gap:14px;padding:12px 2px;font-size:13px;color:#59625d}
		.pskat-psl a{color:#1f7a4d;text-decoration:none}
		</style>';
	}
}

Petshop_Katalogas::init();
