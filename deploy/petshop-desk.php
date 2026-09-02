<?php
/**
 * Petshop Desk v3.48 (S1602, K1) — RYTINĖ PARTIJA IR REGISTRACIJA NEBELIEČIA ATŠAUKTŲ.
 *
 * KODĖL (auditas 2026-09-02, K1): užsakymas #35430 atšauktas PO partijos užrakinimo liko
 * 3 žingsnyje su „registruota 0 iš 1“ → „Registruoti“ sukūrė realią Venipak siuntą
 * (V07267E1000041) atšauktam užsakymui. Dabar: (1) ryto_partija() grąžindama užrakintą
 * partiją PERFILTRUOJA ją pagal esamą statusą — atšaukti/įvykdyti/grąžinti dingsta iš
 * visų sąrašų (visi, av, ds, vp, lp, vp_grupes, vp_misrus, klausimai, eil, tiekejai);
 * (2) vp_reg/vp_bulk praleidžia ne-processing/on-hold užsakymus su pranešimu „#N atšauktas“;
 * (3) „Atšaukti“ darbalaukyje iš karto išima ID iš visų vartotojų ryto partijų.
 *
 * Petshop Desk v3.47 (H265) — viršutinėje juostoje mygtukas „Prekių katalogas“ (ps-katalogas), šalia „Rytinė eiga“ ir „WooCommerce sąrašas“.
 *
 * Petshop Desk v3.46 (H259) — PAŠTOMATAS: KELIOS DĖŽĖS = KELIOS SIUNTOS TAM PAČIAM KLIENTUI.
 *
 * KODĖL (Raimis, H259): „jei į paštomatą — formuojamos kelios siuntos tam pačiam
 * klientui". Venipak paštomatui priima tik 1 dėžę siuntai (API: „One package
 * per shipment allowed if sending to/from locker"), packs[] atmetamas. DABAR
 * venipak_registruoti(): paštomato užsakymui su n dėžių registruojama n kartų
 * po 1 dėžę (svoris dalinamas), visi siuntų nr. sudedami į vieną
 * venipak_shipping_order_data → n lipdukų viename PDF, vienas manifestas.
 *
 * Petshop Desk v3.45 (H258) — VENIPAK PERREGISTRAVIMAS SU KITU DĖŽIŲ SKAIČIUMI.
 *
 * KODĖL (Raimis, H258): „o jei man reikia ne vieno lipduko tam pačiam klientui?"
 * — dėžių skaičius nustatomas kortelėje PRIEŠ registraciją; jei siunta jau
 * registruota su 1 dėže, vp_reg ją praleisdavo („jau registruotas") ir kelio
 * atgal nebuvo. DABAR vp_reg su `perreg=1&n=N` (tik su aiškiais ids): įrašo
 * dėžių skaičių ir registruoja iš naujo; senas siuntos nr. lieka pastaboje.
 *
 * Petshop Desk v3.44 (H257) — Įrankių nuoroda „Išsiųsti laiškai" → „Laiškai tiekėjams"
 * (langas turi ir „Laukia išsiuntimo", ir archyvą; senas vardas slėpė pirmąjį).
 *
 * Petshop Desk v3.43 (H255) — 🔴 DROPSHIP NEBEDINGSTA PO VENIPAK + IŠĖJIMAS IŠ „PARUOŠTA SIŲSTI“.
 *
 * KODĖL (H253 E2E testas, Raimis: „sistema neveikia“): užregistravus Venipak
 * siuntas, VISI dropship užsakymai peršokdavo į „Paruošta siųsti“, mygtukas
 * „Perduoti“ dingdavo, pipeline rodė „Neperduota tiekėjams 0“ — nors tiekėjui
 * niekas neperduota. eile() tikrino „turi siuntą“ ANKSČIAU nei „liko neperduotų
 * sandėlių“. DABAR: kol Petshop_AV_Dropship::neperduotos() netuščia — užsakymas
 * lieka „Nauji“ su „Perduoti“, nesvarbu ar lipdukai jau registruoti.
 *
 * ANTRA SPRAGA: iš „Paruošta siųsti“ Venipak užsakymas NIEKADA neišeidavo —
 * nebuvo jokio veiksmo (statuso keitimą į „Įvykdytas“ plugine išjungėm). DABAR
 * eilėje „Paruošta siųsti“ — mygtukas „Išsiųsta“ (dialogas, be WC laiško pagal
 * nutylėjimą; sekimo laiškas — atskiras) → statusas completed → eilė „Išsiųsti“.
 * Grynas dropship po perdavimo: pirmas mygtukas „Išsiųsta“, lipduko nespausdinam.
 * Sargas (siuntu-laiskai §18.3) gali užblokuoti — tada sakom tiesą: 'issiusta_blokas'.
 *
 * Petshop Desk v3.42 (H250) — Įrankiuose nuoroda „Išsiųsti laiškai" (archyvas).
 *
 * Petshop Desk v3.41 (H249) — „KURIOJE EILĖJE?" MATOMA SĄRAŠE IR PAIEŠKOJE.
 *
 * KODĖL (Raimis, H249): „kur, kokioje eilėje visi šie užsakymai yra, jei noriu
 * pasižiūrėti?" — atidarius „Visi užsakymai" arba paiešką, iš eilutės nebuvo
 * matyti, kurioje darbo eilėje kiekvienas užsakymas kabo. DABAR po užsakymo
 * numeriu — spalvotas eilės ženklas („Nauji", „Mišrūs", „Laukia prekių"...),
 * kuris veikia kaip nuoroda į tą eilę. Rodomas „Visi užsakymai" ir paieškos
 * rezultatuose; atskirose eilėse nerodomas — ten ir taip aišku.
 *
 * Petshop Desk v3.40 (H245) — GEOGRAFIJOS PATAISOS PO RAIMIO TESTO.
 *
 * KODĖL (Raimis, H245): „paspaudžiau mišrų į AV ir viskas dingo; Tiekimas ir
 * Perdavimas tiekėjams neveikia". Faktai: (1) niekas nedingo — planai įrašyti,
 * kortelės nusileido į apatinę sekciją, bet tai nepakankamai akivaizdu;
 * (2) „Partijose" skaitliukas skaičiavo ir TUŠČIAS kaupiamas partijas (vakar
 * testų liekanos), todėl Tiekimo puslapis rodė tuščias lenteles; (3) rail
 * nuoroda „Perdavimas tiekėjams" vedė į ps-dropship, kuris be transient'o
 * atsidaro tuščias. DABAR: skaitliukas skaičiuoja tik partijas SU eilutėmis;
 * rail nuoroda veda į „Nauji" su neperduotų filtru (ten Perduoti mygtukai);
 * po „Patvirtinti planą" grįžtama su #inkaru tiesiai prie nuleistos kortelės.
 *
 * Petshop Desk v3.39 (H244) — SISTEMOS GEOGRAFIJA: ĮRANKIAI, KELIO ŽEMĖLAPIS, NUORODOS.
 *
 * KODĖL (Raimis, H244): „praktiškai niekas neaišku koks Tiekimas, kur nuorodos,
 * kaip pažiūrėti — visiškas chaosas". Tiekimo partijos, perdavimo ekranas gyveno
 * atskiruose puslapiuose be jokios matomos navigacijos — paspaudei „Į tiekimo
 * partiją" ir eilutės „kažkur išskrido". DABAR: (1) kairėje juostoje skiltis
 * ĮRANKIAI — Tiekimas (su kaupiamų/užsakytų partijų skaitliukais) ir Perdavimas
 * tiekėjams; (2) pipeline juostoje grandis „Partijose" → ps-tiekimas;
 * (3) kons_ok pranešime nuoroda „Atidaryti Tiekimą"; (4) tuščias langas rodo
 * užsakymo kelio žemėlapį, o ne mįslę „arba viskas padaryta, arba filtrai".
 *
 * Petshop Desk v3.38 (H243) — PIPELINE JUOSTA + BŪSENOS CHIP'AI.
 *
 * KODĖL (Raimis, H243): „kaip greitai pasižiūrėti, kur sudėti užsakymai tiekėjams,
 * kur užsakymai paruošti išsiųsti" — iki šiol reikėjo vaikščioti po eiles ir
 * atidarinėti korteles. Dabar viršuje viena juosta su skaičiais (kiekvienas —
 * nuoroda į filtruotą sąrašą): Laukia sprendimo · Nepaleisti planai · Neperduota
 * tiekėjams · Laukia prekių · Paruošta siųsti · Išsiųsta šiandien. O kiekvienoje
 * sąrašo eilutėje — spalvoti chip'ai pagal sandėlį: žalias „VF ✓ 11:04" (perduota),
 * gintarinis „PRI ⏳" (neperduota), pilkas „ZB→AV" (planuota per AV). Duomenys
 * jau buvo (_ps_dropship_sent_src) — tik niekur nesimatė vienu žvilgsniu.
 *
 * Petshop Desk v3.37 (H242) — MIŠRUS SU NEPALEISTU PLANU LIEKA MIŠRIUOSE.
 *
 * KODĖL (Raimis, H242): patvirtinus planą užsakymas dingdavo iš Mišrių į „Nauji",
 * o žalia juosta liepdavo „paleisk mygtukais" — kurių tame lange nebėra. Darbuotojas
 * turėjo eiti ieškoti užsakymo kitoje eilėje. Sprendimas ir paleidimas — dabar
 * vienoje vietoje: Mišrių eilė turi dvi sekcijas — „Reikia sprendimo" ir
 * „Planas įrašytas — nepaleista" (su mygtukais „Į tiekimo partiją" / „Perduoti X" /
 * „Keisti planą"). Užsakymas iš Mišrių išeina tik kai „į AV" dalys sudėtos į partiją.
 * Jei plane viskas „tiesiai klientui" — grįžta į „Nauji" (ten įprastas „Perduoti"),
 * ir pranešimas dabar sako, KUR jis nuėjo.
 *
 * Petshop Desk v3.36 (H240) — PERDAVIMAS PAGAL SANDĖLĮ (išsiuntimo laikas — žmogaus).
 *
 * KODĖL (Raimis H237, H239): „mišriuose užsakymuose rankiniu būdu sprendžiama,
 * kada bus siuntos siunčiamos klientui — kad visos siuntos klientą pasiektų kartu“.
 * Iki šiol „Perduoti tiekėjui“ buvo vienas mygtukas visam užsakymui: paspaudei —
 * iškeliavo VISI tiekėjai iš karto, ir laiko suvaldyti buvo neįmanoma.
 *
 * DABAR kiekvienas neperduotas sandėlis turi savo mygtuką („Perduoti VF“,
 * „Perduoti ZB“). Vieną gali paleisti šiandien, kitą pasilikti rankoje, kol
 * pirmoji dalis atkeliaus — kad klientui abi siuntos pasiektų maždaug kartu.
 *
 * v3.35 (H239) — 🔴 SPRENDIMAS ATSKIRTAS NUO VYKDYMO.
 *
 * KODĖL (Raimis, H239): „užsakymas iškarto nukrito į vykdymą, nors aš nenorėjau...
 * aš noriu nuspręsti ką daryti, o ne sistema“. Mygtukas „Patvirtinti“ darė du
 * dalykus vienu paspaudimu — įrašydavo planą IR iškart sudėdavo eilutes į tiekimo
 * partijas, todėl užsakymas savaime iškrisdavo iš Mišrių į „Laukia prekių“.
 *
 * DABAR: „Patvirtinti planą“ tik UŽRAŠO (`_ps_misrus_sprendimas`). Nieko neperkelia,
 * niekam nerašo. Vykdymą pradeda Raimis atskirais mygtukais:
 *   „Į tiekimo partiją“ — sudeda „į AV“ eilutes ir tik tada užsakymas eina laukti;
 *   „Perduoti tiekėjui“ — „tiesiai klientui“ dalims, kaip visada;
 *   „Keisti planą“      — kol niekas neperduota ir partijos kaupiamos.
 * Sistema neturi nė vieno savarankiško žingsnio: ji atsimena ir primena, ne veikia.
 *
 * v3.34 (H237) — mišrių kortelė perdaryta pagal Raimio pastabas;
 * SVORIS PAGAL SANDĖLĮ rytinėje eigoje.
 *
 * Raimis: „viskas vienoje spalvoje, neaišku kur koks užsakymas... įsivaizduok
 * jei tokių 10“. Kortelė susiaurinta, užsakymai atskirti, eilutės kompaktiškos.
 *
 * IŠIMTA IŠGALVOTA KAINA: rodžiau „vežėjui ~3,56 €“, dauginęs užsakymo dabartinį
 * tarifą iš siuntų skaičiaus. Tai netiesa — nežinia, kuo bus siunčiama kiekviena
 * dalis, ir visai nežinia, kiek kainuos parsivežimas į AV. Be tarifų lentelės
 * kaštai NERODOMI. Klientas sumokėjo — rodoma, nes tai faktas užsakyme.
 *
 * SVORIS: kviečiant kurjerį į bet kurį sandėlį reikia pasakyti BENDRĄ svorį,
 * nesvarbu, ar siuntos į paštomatą, ar kurjeriu (Raimis H237). Todėl rytinės
 * eigos Venipak ir LP žingsniuose kiekviena sandėlio grupė turi savo sumą.
 *
 * v3.33 (H236) — EILĖ „MIŠRŪS“ + SPRENDIMO KORTELĖ.
 *
 * KODĖL (Raimis, H235–H236): „darbuotojui bus painu... turi visur būti labai
 * aiškūs mechanizmai“. Mišrus užsakymas gulėjo bendroje krūvoje su dviem
 * mygtukais, o pasirinkimas „siųsti atskirai ar parsivežti į AV“ buvo paslėptas
 * mygtuku prie eilutės skydelyje. Sprendimas neiškildavo pats.
 *
 * DABAR: apmokėtas mišrus be sprendimo krenta į atskirą eilę ir į rytinę partiją
 * NEPATENKA. Kortelė rodo kiekvieną sandėlį atskirai — darbuotojas kiekvienam
 * nurodo kelią (tiesiai klientui / į AV). Skaidymas PAGAL SANDĖLĮ (Raimio
 * sprendimas): ZB dalis keliauja kartu, VF gali keliauti kitaip.
 * Priėmus sprendimą užsakymas iš eilės dingsta — tuščia eilė reiškia, kad
 * viskas nuspręsta.
 *
 * v3.32 (H235) — VIENA MIŠRUMO TAISYKLĖ: mišrus = sandėlių > 1,
 * nesvarbu, ar tarp jų yra AV. Iki šiol ZB+VF+PRINS užsakymas vadinosi
 * „DROPSHIP“, o filtras „Mišrūs“ jo apskritai nerasdavo — nors rytinė eiga tą
 * patį užsakymą jau skaičiavo kaip mišrų (count($sal) > 1). Dvi taisyklės tame
 * pačiame modulyje = prieštaringi atsakymai darbuotojui.
 *
 * Kartu: veiksmų mygtukai nebeišvedami iš etiketės. „Surinkti“ rodoma, kai yra
 * AV eilučių, „Perduoti“ — kai yra tiekėjo eilučių. Mišrus be AV (ZB+VF) gauna
 * TIK „Perduoti“; anksčiau jam būtų pasiūlyta surinkti tai, ko sandėlyje nėra.
 *
 * v3.31 (H234) — perdavimo būklė skaitoma PAGAL SANDĖLĮ
 * (Petshop_AV_Dropship::perduotos/neperduotos). Iki šiol viena viso užsakymo
 * žymė reiškė „viskas perduota“, todėl mišrus su dviem tiekėjais po pirmo
 * perdavimo dingdavo iš tiekėjų sąrašo su antruoju kartu (H234).
 *
 * v3.30 (H233) — TRYNIMAS DARBALAUKYJE: uždarytiems (atšauktas /
 * grąžintas) užsakymams atsirado „Ištrinti užsakymą“ su negrįžtamumo patvirtinimu.
 * Iki šiol trynimas buvo įmanomas TIK per WooCommerce sąrašą. HPOS: delete( true ).
 *
 * v3.29 (H227): 🔴 masinis „Venipak registruoti“ dabar SANDĖLIŲ atžvilgiu: grupuoja pagal šaltinį, kiekvienai grupei savas manifestas; mišrūs praleidžiami. Iki šiol mygtukas viską pylė į vieną manifestą 001 (v3.28: auto refresh).
 *
 * KODĖL: WooCommerce sąrašas — numatytasis ekranas, į kurį penki pluginai sudėjo
 * mygtukus be užrašų. Raimis: „turi būti malonu į darbalaukį užeiti, o ne į chaosą".
 *
 * STRUKTŪRA (Raimio patvirtinta 2026-08-05, pokalbis dėl v3 maketo):
 *   Nauji · Neapmokėti · Paruošta siųsti · Klausimai · Atšaukti · Visi
 *   „Kelyje" ir „Įvykdyti" NĖRA eilės — ten nėra darbo, jie filtrai „Visuose".
 *   Prekės ir Sandėlis IŠIMTI — bus atskiras „Prekių dirbtuvės" langas.
 *
 * FILTRAI — DVI SKIRTINGOS AŠYS, niekada nemaišomos vienoje eilėje:
 *   Vykdymas    (iš kur prekės)  Sava · Dropship · Mišrūs · pagal tiekėją
 *   Pristatymas (kas veža)       Venipak kurjeris/paštomatas · LP Express
 *   Data        greitieji + intervalas
 *
 * ŠALTINIS gyvena EILUTĖS meta (s510 patvirtinta):
 *   _ps_source · _ps_carrier · _ps_source_qty · _ps_source_at · _ps_source_reason
 *
 * WooCommerce sąrašas NEIŠJUNGIAMAS — lieka atsarginiu keliu.
 * Užsakymo REDAGAVIMAS lieka WooCommerce (retas, sudėtingas darbas).
 *
 * 1 SLUOKSNIS: sąrašas · eilės · filtrai · paieška · skydelis · masiniai veiksmai.
 * 2 sluoksnis (atskirai): rytinė eiga, klausimų sprendimai, atšaukimas su kreditine.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Desk {

	const SLUG = 'ps-desk';

	/** Būsenų spalvos: [fonas, tekstas]. */
	const SPALVOS = array(
		'pending'           => array( '#FBF2DE', '#96660C' ),
		'failed'            => array( '#FAECEC', '#98262A' ),
		'on-hold'           => array( '#FBF2DE', '#96660C' ),
		'processing'        => array( '#E9F1EA', '#2D5F3F' ),
		'lp-parcel-created' => array( '#E9F1F8', '#2B5C8A' ),
		'lp-label-created'  => array( '#E9F1F8', '#2B5C8A' ),
		'lp-courier-await'  => array( '#E9F1F8', '#2B5C8A' ),
		'lp-courier-called' => array( '#E9F1F8', '#2B5C8A' ),
		'lp-parcel-await'   => array( '#FBF2DE', '#96660C' ),
		'lp-parcel-failed'  => array( '#FAECEC', '#98262A' ),
		'lp-on-the-way'     => array( '#F1F1EE', '#6B7269' ),
		'lp-delivered'      => array( '#F1F1EE', '#6B7269' ),
		'completed'         => array( '#F1F1EE', '#6B7269' ),
		'cancelled'         => array( '#FAECEC', '#98262A' ),
		'lp-cancelled'      => array( '#FAECEC', '#98262A' ),
		'refunded'          => array( '#F1ECF9', '#5B3B92' ),
	);

	/** Šaltinių žymės: [spalva, trumpinys, pilnas]. */
	const SALTINIAI = array(
		'av'          => array( '#2D5F3F', 'AV',  'Savas sandėlis' ),
		'vf'          => array( '#2B5C8A', 'VF',  'Vetfarmas' ),
		'zb'          => array( '#5B3B92', 'ZB',  'Žalioji Banga' ),
		'quattro'     => array( '#96660C', 'QUA', 'Kauno grūdai / Quattro' ),
		'prins'       => array( '#96660C', 'PRI', 'Faunas / Prins' ),
		'ambrosia'    => array( '#96660C', 'AMB', 'Ambrosia' ),
		'belcor_tofu' => array( '#96660C', 'BEL', 'Belacor' ),
	);

	/**
	 * Manifesto numeris pagal sandėlį. Venipak manifesto pavadinimas =
	 * kliento ID + data + ŠIS kodas (s544). Vienas manifestas = vienas
	 * kurjerio paėmimas iš vieno adreso, todėl sandėliai NIEKADA nemaišomi.
	 */
	const MANIFESTAI = array(
		'av'          => '001',
		'vf'          => '002',
		'zb'          => '003',
		'quattro'     => '004',
		'prins'       => '005',
		'ambrosia'    => '006',
		'belcor_tofu' => '007',
	);

	/**
	 * Iki kada užsakymas turi būti perduotas sandėliui, kad spėtų
	 * į TOS DIENOS kurjerio paėmimą. AV — kada kurjeris atvažiuoja pas mus.
	 */
	const RIBOS = array(
		'av'          => '11:00',
		'lp'          => '13:00',
		'vf'          => '13:00',
		'zb'          => '09:00',
		'prins'       => '09:00',
		'ambrosia'    => '10:00',
		'belcor_tofu' => '09:00',
		'quattro'     => '09:00',
	);

	/** Eilės: slug => [pavadinimas, paaiškinimas, spalva]. */
	const EILES = array(
		'nauji'      => array( 'Nauji',           'apmokėti, laukia surinkimo ar perdavimo', '#5FA97A' ),
		'misrus'     => array( 'Mišrūs',          'kelių sandėlių užsakymai — reikia sprendimo', '#B5762A' ),
		'neapmoketi' => array( 'Neapmokėti',      'laukia kliento pinigų — tik stebėti',     '#D9A62B' ),
		'paruosta'   => array( 'Paruošta siųsti', 'supakuota su lipduku, laukia kurjerio',   '#5E96C9' ),
		'laukia'     => array( 'Laukia prekių',   'tiekėjo prekės dar neatvyko į AV',        '#8E6FD0' ),
		'klausimai'  => array( 'Klausimai',       'reikia tavo sprendimo',                   '#C4595C' ),
		'issiusti'   => array( 'Išsiųsti',        'kelyje ir įvykdyti užsakymai',            '#9AA39C' ),
		'atsaukti'   => array( 'Atšaukti',        'atšaukti ir grąžinti užsakymai',          '#9AA39C' ),
		'visi'       => array( 'Visi užsakymai',  '',                                        '#9AA39C' ),
	);

	/** Statusai pagal eilę (klausimai skaičiuojami atskirai). */
	const STATUSAI = array(
		'neapmoketi' => array( 'pending', 'failed', 'on-hold', 'lp-parcel-await' ),
		'paruosta'   => array( 'lp-label-created', 'lp-parcel-created', 'lp-courier-await', 'lp-courier-called' ),
		'atsaukti'   => array( 'cancelled', 'lp-cancelled', 'refunded' ),
		'kelyje'     => array( 'lp-on-the-way' ),
		'ivykdyti'   => array( 'completed', 'lp-delivered' ),
	);

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ) );
		add_action( 'admin_head', array( __CLASS__, 'slepti_wc' ) );
		add_action( 'admin_head', array( __CLASS__, 'chrome' ) );
		add_action( 'admin_post_ps_desk_veiksmas', array( __CLASS__, 'vykdyti_veiksma' ) );
	}

	/* ======================= VEIKSMŲ SLUOKSNIS =======================
	 * VISI darbalaukio veiksmai eina per vieną vietą: nonce, teisių patikra,
	 * įrašas į užsakymo istoriją, grįžimas atgal. Kai atsiras automatiniai
	 * siūlymai, jie kvies TĄ PATĮ vykdymą — tik su tavo patvirtinimu.
	 * ================================================================ */

	/** Laiškai klientui laikinai išjungiami (dublikatų atšaukimas ir pan.). */
	const LAISKAI = array(
		'customer_processing_order', 'customer_completed_order', 'customer_on_hold_order',
		'customer_invoice', 'customer_refunded_order', 'customer_cancelled_order',
		'cancelled_order', 'customer_partially_refunded_order',
	);

	protected static function laiskai_off() {
		foreach ( self::LAISKAI as $e ) {
			add_filter( 'woocommerce_email_enabled_' . $e, '__return_false', 999 );
		}
	}

	protected static function laiskai_on() {
		foreach ( self::LAISKAI as $e ) {
			remove_filter( 'woocommerce_email_enabled_' . $e, '__return_false', 999 );
		}
	}

	protected static function veiksmo_url( $v, $id ) {
		return wp_nonce_url(
			admin_url( 'admin-post.php?action=ps_desk_veiksmas&v=' . rawurlencode( $v ) . '&id=' . (int) $id
				. '&g=' . rawurlencode( self::url() ) ),
			'ps_desk_' . $v . '_' . (int) $id
		);
	}

	/** Galimi veiksmai užsakymui. Pirmas — pagrindinis (žalias mygtukas). */
	protected static function veiksmai( $o, $row ) {
		$id  = $o->get_id();
		$st  = $o->get_status();
		$out = array();

		$uzdaryti = array( 'cancelled', 'lp-cancelled', 'refunded' );
		$antraste = sprintf( 'Užsakymas #%s · %s',
			$o->get_order_number(), wp_strip_all_tags( $o->get_formatted_order_total() ) );

		if ( ! $o->is_paid() && ! in_array( $st, $uzdaryti, true ) ) {
			$out[] = array(
				'id'  => 'apmoketa',
				't'   => 'Pažymėti apmokėtu',
				'url' => self::veiksmo_url( 'apmoketa', $id ),
				'd'   => array(
					'antraste' => $antraste,
					'tekstas'  => 'Pažymėti kaip apmokėtą? Prekės bus nurašytos iš likučio; užsakymas keliaus į „Nauji“ (arba į „Klausimus“, jei sandėlyje trūksta).',
					'ok'       => 'Pažymėti apmokėtu',
					'opt'      => array(
						'vardas' => 'be_laisko',
						'tekstas'=> 'Nesiųsti laiško klientui',
						'def'    => 0,
					),
				),
			);
		}

		if ( ! empty( $row['klausimas'] ) ) {
			$out[] = array( 'id' => 'sprendimas', 't' => 'Spręsti', 'url' => '', 'k' => '' );
		} elseif ( 'nauji' === $row['eile'] ) {
			// Mygtukai — pagal tai, KOKIŲ EILUČIŲ užsakyme yra, o ne pagal etiketę.
			// ZB+VF (mišrus be AV) neturi ko surinkti sandėlyje — jam tik „Perduoti“.
			$sal = self::saltiniai( $o );
			$turi_av = in_array( 'av', $sal, true );
			$turi_ds = count( array_diff( $sal, array( 'av' ) ) ) > 0;

			if ( $turi_av ) {
				$out[] = array( 'id' => 'lapai', 't' => 'Surinkti', 'url' => self::veiksmo_url( 'lapai', $id ), 'd' => null );
			}
			/**
			 * Perdavimas PAGAL SANDĖLĮ. Kai tiekėjas vienas — vienas mygtukas kaip
			 * anksčiau. Kai keli — po mygtuką kiekvienam, kad išsiuntimo laiką
			 * valdytum tu, o ne sistema (H240).
			 */
			$ds_liko = ( $turi_ds && class_exists( 'Petshop_AV_Dropship' ) )
				? Petshop_AV_Dropship::neperduotos( $o )
				: array_values( array_diff( $sal, array( 'av' ) ) );

			if ( 1 === count( $ds_liko ) ) {
				$out[] = array(
					'id'  => 'perduoti',
					't'   => $turi_av ? 'Perduoti tiekėjui' : 'Perduoti',
					'url' => self::veiksmo_url( 'perduoti', $id ) . '&src=' . rawurlencode( $ds_liko[0] ),
					'd'   => null,
				);
			} else {
				foreach ( $ds_liko as $src ) {
					$out[] = array(
						'id'  => 'perduoti_' . $src,
						't'   => 'Perduoti ' . ( self::SALTINIAI[ $src ][1] ?? mb_strtoupper( $src ) ),
						'url' => self::veiksmo_url( 'perduoti', $id ) . '&src=' . rawurlencode( $src ),
						'd'   => null,
					);
				}
			}

			// Planas yra, bet „į AV“ dalys dar nesudėtos — paleidžia ŽMOGUS (H239).
			$laukia_kons = self::kons_laukia( $o );
			if ( $laukia_kons ) {
				$out[] = array(
					'id'  => 'kons',
					't'   => sprintf( 'Į tiekimo partiją (%d)', count( $laukia_kons ) ),
					'url' => self::veiksmo_url( 'kons', $id ),
					'd'   => null,
				);
			}
			if ( self::misrus_sprendimas( $o ) ) {
				$out[] = array(
					'id'  => 'misrus_keisti',
					't'   => 'Keisti planą',
					'url' => self::veiksmo_url( 'misrus_keisti', $id ),
					'd'   => null,
				);
			}
		} elseif ( 'laukia' === $row['eile'] ) {
			$out[] = array( 'id' => 'tiekimas', 't' => 'Tiekimas',
				'url' => admin_url( 'admin.php?page=ps-tiekimas&b=laukia' ), 'd' => null );
		} elseif ( 'paruosta' === $row['eile'] ) {
			$lp = 'lp' === self::vezejas( $o );
			// Lipduką spausdinam tik kai siunčiam patys (yra AV eilučių).
			// Grynas dropship čia jau PERDUOTAS tiekėjui — lipdukas išėjo laiške.
			if ( in_array( 'av', self::saltiniai( $o ), true ) ) {
				$out[] = array(
					'id' => 'spausdinti', 't' => 'Spausdinti lipduką', 'url' => '', 'd' => null,
					'wc' => $lp ? 'woo_lp_print_label' : 'shopup_venipak_shipping_labels',
				);
			}
			// H255: išėjimas iš eilės — žmogus patvirtina, kad siunta išėjo.
			$out[] = array(
				'id'  => 'issiusta',
				't'   => 'Išsiųsta',
				'url' => self::veiksmo_url( 'issiusta', $id ),
				'd'   => array(
					'antraste' => $antraste,
					'tekstas'  => 'Pažymėti kaip išsiųstą? Užsakymas keliaus į „Išsiųsti“ (statusas „Įvykdytas“). Sekimo laiškas klientui — atskiras mygtukas, jis nesikeičia.',
					'ok'       => 'Išsiųsta',
					'opt'      => array(
						'vardas' => 'su_laisku',
						'tekstas'=> 'Siųsti WooCommerce laišką „Užsakymas įvykdytas“',
						'def'    => 0,
					),
				),
			);
		}

		if ( ! $out ) {
			$out[] = array( 'id' => 'atidaryti', 't' => 'Atidaryti', 'url' => $o->get_edit_order_url(), 'd' => null );
		}

		if ( 'lapai' !== $out[0]['id'] ) {
			$out[] = array( 'id' => 'lapai', 't' => 'Pakavimo lapas', 'url' => self::veiksmo_url( 'lapai', $id ), 'd' => null );
		}

		if ( $o->is_paid() ) {
			$out[] = array( 'id' => 'saskaita', 't' => 'Sąskaita', 'url' => '', 'd' => null, 'wc' => 'wcdn_print_invoice' );
		}

		if ( class_exists( 'Petshop_Siuntos' ) && Petshop_Siuntos::turi( $id ) ) {
			$out[] = array( 'id' => 'sekimo', 't' => 'Sekimo laiškas',
				'url' => admin_url( 'admin.php?page=ps-siuntos-laiskas&id=' . $id ), 'd' => null );
		}

		// Atšaukimas — antrinis veiksmas, tik skydelyje.
		if ( ! in_array( $st, $uzdaryti, true ) ) {
			$out[] = array(
				'id'  => 'atsaukti',
				't'   => 'Atšaukti užsakymą',
				'url' => self::veiksmo_url( 'atsaukti', $id ),
				'pav' => 'pavojus',
				'd'   => array(
					'antraste' => $antraste,
					'tekstas'  => $o->is_paid()
						? 'Atšaukti šį APMOKĖTĄ užsakymą? Prekės grįš į likutį. Pinigai NEGRĄŽINAMI automatiškai — grąžinimą ir kreditinę tvarkysi atskirai.'
						: 'Atšaukti šį užsakymą? Prekės grįš į likutį. Klientui laiškas nesiunčiamas — patogu, kai tas pats žmogus pridarė kelis užsakymus, kol apmokėjo.',
					'ok'       => 'Atšaukti užsakymą',
					'opt'      => array(
						'vardas' => 'su_laisku',
						'tekstas'=> 'Pranešti klientui laišku',
						'def'    => 0,
					),
				),
			);
		} elseif ( current_user_can( 'delete_shop_orders' ) ) {
			// Uždarytas užsakymas — vienintelė vieta, kur trynimas apskritai galimas.
			// Iki šiol tam reikėjo eiti į WooCommerce sąrašą (H233).
			$out[] = array(
				'id'  => 'istrinti',
				't'   => 'Ištrinti užsakymą',
				'url' => self::veiksmo_url( 'istrinti', $id ),
				'pav' => 'pavojus',
				'd'   => array(
					'antraste' => $antraste,
					'tekstas'  => 'Ištrinti šį užsakymą NEGRĮŽTAMAI? Dings pats užsakymas, jo eilutės ir istorija. '
						. 'Apskaitai ir sąskaitoms atšauktas užsakymas paprastai turi likti — trink tik testinius arba akivaizdų šlamštą.',
					'ok'       => 'Ištrinti negrįžtamai',
				),
			);
		}
		return $out;
	}

	/**
	 * Registruoja siuntų GRUPĘ vienu XML → vienas manifestas.
	 * Pluginas manifesto numerį laiko privačioje savybėje ir ima jį iš
	 * nustatymų konstruktoriuje (s545: keitimas per Reflection PAVYKO),
	 * todėl prieš kvietimą jį laikinai pakeičiam, po to grąžinam.
	 */
	protected static function venipak_registruoti( $ids, $manifesto_kodas ) {
		$cls = 'Woocommerce_Shopup_Venipak_Shipping_Admin_Dispatch';
		if ( ! class_exists( $cls ) ) { return array( 'status' => 'error', 'data' => 'Venipak pluginas neįjungtas' ); }

		global $wp_filter;
		$h   = 'handle_bulk_actions-woocommerce_page_wc-orders';
		$obj = null;
		if ( isset( $wp_filter[ $h ] ) ) {
			foreach ( $wp_filter[ $h ]->callbacks as $cbs ) {
				foreach ( $cbs as $cb ) {
					$fn = $cb['function'];
					if ( is_array( $fn ) && is_object( $fn[0] ) && get_class( $fn[0] ) === $cls ) { $obj = $fn[0]; break 2; }
				}
			}
		}
		if ( ! $obj ) { return array( 'status' => 'error', 'data' => 'Venipak tvarkyklė nerasta' ); }

		try {
			$rp = new ReflectionProperty( $cls, 'venipak_manifest' );
			$rp->setAccessible( true );
			$sena = $rp->getValue( $obj );
			$rp->setValue( $obj, $manifesto_kodas );
		} catch ( Throwable $e ) {
			return array( 'status' => 'error', 'data' => 'Manifesto nustatyti nepavyko: ' . $e->getMessage() );
		}

		// Kelių dėžių siuntoms sudedam packs[] — po vieną įrašą kiekvienai dėžei.
		$packs = false;
		$viena = ( 1 === count( $ids ) ) ? wc_get_order( reset( $ids ) ) : false;
		if ( $viena && self::reikia_pakuociu( $viena ) ) {
			$n = self::pakuociu( $viena );
			if ( $n > 1 ) {
				$sv = 0;
				foreach ( $viena->get_items() as $it ) {
					$p = $it->get_product();
					if ( $p && $p->get_weight() ) { $sv += (float) $p->get_weight() * (int) $it->get_quantity(); }
				}
				$dalis = $sv > 0 ? round( $sv / $n, 2 ) : 1;
				$packs = array();
				for ( $i = 0; $i < $n; $i++ ) {
					$packs[] = array( 'weight' => max( 0.1, $dalis ), 'width' => 0, 'height' => 0,
						'length' => 0, 'description' => '' );
				}
			}
		}

		// H259: paštomatas + kelios dėžės → n atskirų siuntų po 1 dėžę (Venipak locker riba).
		if ( $packs && $viena && $viena->get_meta( 'venipak_pickup_point' ) ) {
			$visi = array(); $rez = array( 'status' => 'ok' ); $oid = $viena->get_id();
			foreach ( $packs as $i => $pk ) {
				$oo = wc_get_order( $oid );
				$vd = json_decode( (string) $oo->get_meta( 'venipak_shipping_order_data' ), true );
				if ( ! is_array( $vd ) ) { $vd = array(); }
				$vd['status'] = ''; $vd['pack_numbers'] = array();
				$oo->update_meta_data( 'venipak_shipping_order_data', wp_json_encode( $vd ) ); $oo->save();
				ob_start();
				try { $r1 = $obj->venipak_shipping_dispatch_order( array( (int) $oid ), array( $pk ), false ); }
				catch ( Throwable $e ) { $r1 = array( 'status' => 'error', 'data' => $e->getMessage() ); }
				ob_end_clean();
				if ( ! is_array( $r1 ) || 'ok' !== ( $r1['status'] ?? '' ) ) {
					$rez = array( 'status' => 'error', 'data' => sprintf( '%d dėžė iš %d: %s', $i + 1, count( $packs ),
						is_array( $r1 ) ? ( $r1['data'] ?? '?' ) : 'Venipak negrąžino atsakymo' ) );
					break;
				}
				$oo = wc_get_order( $oid );
				$vd = json_decode( (string) $oo->get_meta( 'venipak_shipping_order_data' ), true );
				foreach ( (array) ( $vd['pack_numbers'] ?? array() ) as $pn ) { $visi[] = $pn; }
			}
			if ( $visi ) { // sudedam visus nr. į vieną įrašą — lipdukai, manifestas, sekimas mato visas siuntas
				$oo = wc_get_order( $oid );
				$vd = json_decode( (string) $oo->get_meta( 'venipak_shipping_order_data' ), true );
				$vd['pack_numbers'] = array_values( array_unique( $visi ) );
				if ( 'ok' === $rez['status'] ) { $vd['status'] = 'sent'; $vd['error_message'] = ''; }
				$oo->update_meta_data( 'venipak_shipping_order_data', wp_json_encode( $vd ) ); $oo->save();
				$oo->add_order_note( sprintf( 'Paštomatas: %d dėžės = %d siuntos: %s', count( $packs ), count( $visi ), implode( ', ', $visi ) ), false, true );
			}
			$rp->setValue( $obj, $sena );
			return $rez;
		}

		ob_start();
		try {
			$rez = $obj->venipak_shipping_dispatch_order( array_values( array_map( 'intval', $ids ) ), $packs, false );
		} catch ( Throwable $e ) {
			$rez = array( 'status' => 'error', 'data' => $e->getMessage() );
		}
		ob_end_clean();

		$rp->setValue( $obj, $sena );
		return is_array( $rez ) ? $rez : array( 'status' => 'error', 'data' => 'Venipak negrąžino atsakymo' );
	}

	/** Manifesto PDF iš Venipak. s549: ws/print_list, laukas „code“. */
	protected static function venipak_manifesto_pdf( $kodas ) {
		$n = get_option( 'shopup_venipak_shipping_settings' );
		if ( ! is_array( $n ) ) { return new WP_Error( 'nustatymai', 'Venipak nustatymų nėra' ); }
		$resp = wp_remote_post( 'https://go.venipak.lt/ws/print_list', array(
			'timeout' => 45,
			'headers' => array( 'Referer' => 'https://woocommerce.com/' ),
			'body'    => array(
				'user' => $n['shopup_venipak_shipping_field_username'],
				'pass' => $n['shopup_venipak_shipping_field_password'],
				'code' => $kodas,
			),
		) );
		if ( is_wp_error( $resp ) ) { return $resp; }
		$b = wp_remote_retrieve_body( $resp );
		if ( '%PDF' !== substr( $b, 0, 4 ) ) {
			return new WP_Error( 'ne_pdf', wp_strip_all_tags( mb_substr( $b, 0, 200 ) ) );
		}
		return $b;
	}

	public static function vykdyti_veiksma() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }

		$v  = isset( $_GET['v'] ) ? sanitize_key( wp_unslash( $_GET['v'] ) ) : '';
		$id = isset( $_GET['id'] ) ? absint( $_GET['id'] ) : 0;
		check_admin_referer( 'ps_desk_' . $v . '_' . $id );

		$masinis = in_array( $v, array( 'lapai', 'perduoti', 'vp_reg', 'vp_bulk', 'vp_manifestas' ), true );
		$o = $id ? wc_get_order( $id ) : false;
		if ( ! $o && ! $masinis ) { wp_die( 'Užsakymas nerastas' ); }

		$atgal = isset( $_GET['g'] ) ? wp_unslash( $_GET['g'] ) : '';
		$atgal = wp_validate_redirect( $atgal, admin_url( 'admin.php?page=' . self::SLUG ) );

		$zinute = 'nezinomas';

		$naudotojas = wp_get_current_user()->display_name;

		/* --- DARBO ĮRANKIAI. s524: abu priima užsakymus per transient. --- */
		$ids = array();
		if ( isset( $_GET['ids'] ) ) {
			$ids = array_filter( array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_GET['ids'] ) ) ) ) );
		}
		if ( ! $ids && $id ) { $ids = array( $id ); }

		if ( 'lapai' === $v && $ids ) {
			set_transient( 'ps_sheets_' . get_current_user_id(), $ids, 900 );
			wp_safe_redirect( admin_url( 'admin.php?page=ps-lapai&ps_ready=1' ) );
			exit;
		}

		/* MASINIS Venipak (H227): pažymėtus grupuojam pagal SANDĖLĮ ir kiekvieną
		   grupę registruojam su jos manifestu — kitaip viskas krenta į 001 krūvą.
		   Mišrūs praleidžiami (§18): pluginas užsakymui temoka vieną siuntą. */
		if ( 'vp_bulk' === $v && $ids ) {
			$grupes = array(); $praleisti = array();
			foreach ( $ids as $oid ) {
				$oo = wc_get_order( $oid );
				if ( ! $oo ) { continue; }
				if ( ! in_array( $oo->get_status(), array( 'processing', 'on-hold' ), true ) ) { $praleisti[] = '#' . $oo->get_order_number() . ' ' . ( in_array( $oo->get_status(), array( 'cancelled', 'lp-cancelled' ), true ) ? 'atšauktas' : wc_get_order_status_name( $oo->get_status() ) ); continue; } // K1
				if ( self::turi_siunta( $oo ) ) { $praleisti[] = '#' . $oo->get_order_number() . ' jau registruotas'; continue; }
				if ( 'venipak_pastomatas' === self::vezejas( $oo ) && ! $oo->get_meta( 'venipak_pickup_point' ) ) {
					$praleisti[] = '#' . $oo->get_order_number() . ' be paštomato'; continue;
				}
				$sal = self::saltiniai( $oo );
				if ( count( $sal ) > 1 ) { $praleisti[] = '#' . $oo->get_order_number() . ' mišrus — per rytinę eigą'; continue; }
				$s = $sal ? reset( $sal ) : 'av';
				if ( ! isset( self::MANIFESTAI[ $s ] ) ) { $s = 'av'; }
				$grupes[ $s ][] = $oid;
			}
			if ( ! $grupes ) {
				wp_safe_redirect( add_query_arg( array(
					'pd_ok' => 'vp_nieko',
					'pd_nr' => rawurlencode( $praleisti ? implode( ', ', $praleisti ) : 'nepažymėta tinkamų' ),
				), $atgal ) );
				exit;
			}
			$ok = true; $klaidos = array(); $suvestine = array();
			foreach ( $grupes as $s => $gids ) {
				$kodas = self::MANIFESTAI[ $s ];
				$daugiadezes = array(); $paprasti = array();
				foreach ( $gids as $oid ) {
					$oo = wc_get_order( $oid );
					if ( $oo && self::reikia_pakuociu( $oo ) && self::pakuociu( $oo ) > 1 ) { $daugiadezes[] = $oid; }
					else { $paprasti[] = $oid; }
				}
				$g_ok = true;
				if ( $paprasti ) {
					$rez = self::venipak_registruoti( $paprasti, $kodas );
					if ( ! isset( $rez['status'] ) || 'ok' !== $rez['status'] ) { $g_ok = false; $klaidos[] = mb_strtoupper( $s ) . ': ' . ( $rez['data'] ?? '?' ); }
				}
				foreach ( $daugiadezes as $oid ) {
					$rez = self::venipak_registruoti( array( $oid ), $kodas );
					if ( ! isset( $rez['status'] ) || 'ok' !== $rez['status'] ) { $g_ok = false; $klaidos[] = '#' . $oid . ': ' . ( $rez['data'] ?? '?' ); }
				}
				foreach ( $gids as $oid ) {
					$oo = wc_get_order( $oid );
					if ( ! $oo ) { continue; }
					$oo->add_order_note( sprintf( 'Venipak registracija darbalaukyje (%s, manifestas %s): %s',
						mb_strtoupper( $s ), $kodas, $g_ok ? 'sėkminga' : 'KLAIDA' ), false, true );
					if ( $g_ok && class_exists( 'Petshop_Siuntos' ) ) {
						Petshop_Siuntos::prideti_is_plugino( $oid, $s, $kodas );
					}
				}
				if ( $g_ok ) { $suvestine[] = mb_strtoupper( $s ) . ' ' . count( $gids ); }
				else { $ok = false; }
			}
			wp_safe_redirect( add_query_arg( array(
				'pd_ok'  => $ok ? 'vp_ok' : 'vp_klaida',
				'pd_nr'  => rawurlencode( ( $suvestine ? implode( ', ', $suvestine ) : implode( ' · ', $klaidos ) )
					. ( $klaidos && $ok === false && $suvestine ? ' · klaidos: ' . implode( ' · ', $klaidos ) : '' )
					. ( $praleisti ? ' · praleista: ' . implode( ', ', $praleisti ) : '' ) ),
			), $atgal ) );
			exit;
		}

		if ( 'vp_reg' === $v && $ids ) {
			$sandelis = isset( $_GET['sandelis'] ) ? sanitize_key( wp_unslash( $_GET['sandelis'] ) ) : 'av';
			$kodas    = isset( self::MANIFESTAI[ $sandelis ] ) ? self::MANIFESTAI[ $sandelis ] : '001';

			// SAUGIKLIS (H221): registruojam TIK tuos, kurie dar neturi siuntos kodo
			// ir kuriems netrūksta paštomato — kitaip pakartotinis paspaudimas
			// siunčia dublikatus ir visas grupinis XML lūžta „be atsakymo".
			$praleisti = array();
			// H258: perregistravimas su kitu dėžių skaičiumi (tik aiškiems ids, iš perdavimo lango).
			$perreg = ! empty( $_GET['perreg'] ) && ! empty( $_GET['ids'] );
			$perreg_n = isset( $_GET['n'] ) ? max( 1, min( 20, absint( $_GET['n'] ) ) ) : 0;
			$ids = array_values( array_filter( $ids, function ( $oid ) use ( &$praleisti, $perreg, $perreg_n ) {
				$oo = wc_get_order( $oid );
				if ( ! $oo ) { return false; }
				if ( $perreg ) {
					list( $senas ) = self::siuntos_kodas( $oo );
					if ( $perreg_n ) { $oo->update_meta_data( self::META_PAK, $perreg_n ); }
					// Venipak pluginas užsakymą su status=sent XML'e praleidžia (dispatch.php:467) —
					// atlaisvinam kaip jo paties „resend" (dispatch.php:221–225), seną įrašą pasidedam.
					$vd = json_decode( (string) $oo->get_meta( 'venipak_shipping_order_data' ), true );
					if ( is_array( $vd ) ) {
						$oo->update_meta_data( '_ps_venipak_sena', wp_json_encode( $vd ) );
						$vd['status'] = ''; $vd['pack_numbers'] = array();
						$oo->update_meta_data( 'venipak_shipping_order_data', wp_json_encode( $vd ) );
					}
					$oo->add_order_note( sprintf( 'Darbalaukis: siunta perregistruojama su %d dėž. (sena siunta %s — nebenaudojama).',
						$perreg_n ?: self::pakuociu( $oo ), $senas ?: '—' ), false, true );
					$oo->save();
					return true;
				}
				// K1 (S1602): atšauktam / įvykdytam / grąžintam siuntos neregistruojam.
				if ( ! in_array( $oo->get_status(), array( 'processing', 'on-hold' ), true ) ) {
					$praleisti[] = '#' . $oo->get_order_number() . ' ' . ( in_array( $oo->get_status(), array( 'cancelled', 'lp-cancelled' ), true ) ? 'atšauktas' : wc_get_order_status_name( $oo->get_status() ) ); return false;
				}
				if ( self::turi_siunta( $oo ) ) { $praleisti[] = '#' . $oo->get_order_number() . ' jau registruotas'; return false; }
				if ( 'venipak_pastomatas' === self::vezejas( $oo ) && ! $oo->get_meta( 'venipak_pickup_point' ) ) {
					$praleisti[] = '#' . $oo->get_order_number() . ' be paštomato'; return false;
				}
				return true;
			} ) );
			if ( ! $ids ) {
				wp_safe_redirect( add_query_arg( array(
					'pd_ok' => 'vp_nieko',
					'pd_nr' => rawurlencode( implode( ', ', $praleisti ) ),
				), $atgal ) );
				exit;
			}
			// Kelių dėžių užsakymus registruojam PO VIENĄ — tik taip pluginas
			// gauna jų packs[]; grupinė registracija dėžių skaičiaus nemoka.
			$daugiadezes = array(); $paprasti = array();
			foreach ( $ids as $oid ) {
				$oo = wc_get_order( $oid );
				if ( $oo && self::reikia_pakuociu( $oo ) && self::pakuociu( $oo ) > 1 ) { $daugiadezes[] = $oid; }
				else { $paprasti[] = $oid; }
			}
			$ok = true; $klaidos = array();
			if ( $paprasti ) {
				$rez = self::venipak_registruoti( $paprasti, $kodas );
				if ( ! isset( $rez['status'] ) || 'ok' !== $rez['status'] ) { $ok = false; $klaidos[] = $rez['data'] ?? '?'; }
			}
			foreach ( $daugiadezes as $oid ) {
				$rez = self::venipak_registruoti( array( $oid ), $kodas );
				if ( ! isset( $rez['status'] ) || 'ok' !== $rez['status'] ) { $ok = false; $klaidos[] = '#' . $oid . ': ' . ( $rez['data'] ?? '?' ); }
			}
			$rez = $ok ? array( 'status' => 'ok' ) : array( 'status' => 'error', 'data' => implode( ' · ', $klaidos ) );
			foreach ( $ids as $oid ) {
				$oo = wc_get_order( $oid );
				if ( $oo ) {
					// H258: perregistravimas nepavyko → grąžinam seną siuntą (pluginas jau būna įrašęs naujus, neregistruotus pack nr.).
					if ( ! $ok && $perreg && $oo->get_meta( '_ps_venipak_sena' ) ) {
						$oo->update_meta_data( 'venipak_shipping_order_data', $oo->get_meta( '_ps_venipak_sena' ) );
						$oo->delete_meta_data( '_ps_venipak_sena' );
						$oo->add_order_note( 'Darbalaukis: perregistravimas nepavyko — sena siunta grąžinta, galioja kaip buvo.', false, true );
						$oo->save();
					}
					$oo->add_order_note( sprintf( 'Venipak registracija darbalaukyje (%s, manifestas %s): %s',
						mb_strtoupper( $sandelis ), $kodas, $ok ? 'sėkminga' : ( 'KLAIDA — ' . ( $rez['data'] ?? '?' ) ) ), false, true );
					if ( $ok && class_exists( 'Petshop_Siuntos' ) ) {
						Petshop_Siuntos::prideti_is_plugino( $oid, $sandelis, $kodas );
					}
				}
			}
			wp_safe_redirect( add_query_arg( array(
				'pd_ok'  => $ok ? 'vp_ok' : 'vp_klaida',
				'pd_nr'  => rawurlencode( ( $ok ? count( $ids ) . ' · ' . mb_strtoupper( $sandelis ) : ( $rez['data'] ?? '' ) )
					. ( $praleisti ? ' · praleista: ' . implode( ', ', $praleisti ) : '' ) ),
			), $atgal ) );
			exit;
		}

		if ( 'klaus' === $v && $o ) {
			$t   = isset( $_GET['t'] ) ? sanitize_key( wp_unslash( $_GET['t'] ) ) : '';
			$iid = isset( $_GET['iid'] ) ? absint( $_GET['iid'] ) : 0;
			$src = isset( $_GET['src'] ) ? sanitize_key( wp_unslash( $_GET['src'] ) ) : '';
			$item = $iid ? $o->get_item( $iid ) : false;

			if ( 'laukti' === $t ) {
				$o->update_meta_data( '_ps_klaus_laukti', current_time( 'mysql' ) );
				$o->add_order_note( sprintf( 'Klausimas: pažymėta LAUKTI (%s). Jokio automatinio priminimo — grįši pats.',
					wp_get_current_user()->display_name ), false, true );
				$o->save();
				$zinute = 'kl_laukti';
			} elseif ( $item && $src && in_array( $t, array( 'siusti', 'parsivezti' ), true ) ) {
				$item->update_meta_data( '_ps_source', $src );
				$item->update_meta_data( '_ps_source_reason', 'darbalaukis: AV neužteko' );
				$item->update_meta_data( '_ps_source_at', current_time( 'mysql' ) );
				$item->save();

				$o->delete_meta_data( '_ps_klaus_laukti' );
				$o->add_order_note( sprintf( 'Klausimas išspręstas: „%s“ šaltinis pakeistas į %s (%s).',
					$item->get_name(), mb_strtoupper( $src ),
					'siusti' === $t ? 'siunčia tiekėjas' : 'parsivežam į AV' ), false, true );
				$o->save();

				if ( 'parsivezti' === $t && class_exists( 'Petshop_AV_Tiekimas' ) ) {
					wp_safe_redirect( Petshop_AV_Tiekimas::eilutes_url( $o->get_id(), $iid, 'ideti', $atgal ) );
					exit;
				}
				$zinute = 'kl_saltinis';
			}

			wp_safe_redirect( add_query_arg( array(
				'pd_ok' => $zinute, 'pd_nr' => rawurlencode( $o->get_order_number() ) ), $atgal ) );
			exit;
		}

		if ( 'pakuotes' === $v && $o ) {
			$n = isset( $_GET['n'] ) ? max( 1, min( 20, absint( $_GET['n'] ) ) ) : 1;
			$o->update_meta_data( self::META_PAK, $n );
			$o->add_order_note( sprintf( 'Darbalaukis: pakuočių skaičius nustatytas — %d.', $n ), false, true );
			$o->save();
			wp_safe_redirect( add_query_arg( array( 'pd_ok' => 'pakuotes', 'pd_nr' => $n ), $atgal ) );
			exit;
		}

		if ( 'vp_manifestas' === $v ) {
			$kodas = isset( $_GET['kodas'] ) ? sanitize_text_field( wp_unslash( $_GET['kodas'] ) ) : '';
			$pdf   = $kodas ? self::venipak_manifesto_pdf( $kodas ) : new WP_Error( 'nera', 'Manifesto kodas nenurodytas' );
			if ( is_wp_error( $pdf ) ) { wp_die( esc_html( 'Manifesto gauti nepavyko: ' . $pdf->get_error_message() ) ); }
			nocache_headers();
			header( 'Content-Type: application/pdf' );
			header( 'Content-Disposition: inline; filename="manifestas-' . $kodas . '.pdf"' );
			echo $pdf; // phpcs:ignore
			exit;
		}

		if ( 'perduoti' === $v && $ids ) {
			set_transient( 'ps_dropship_' . get_current_user_id(), $ids, 1800 );
			$src = isset( $_GET['src'] ) ? sanitize_key( wp_unslash( $_GET['src'] ) ) : '';
			wp_safe_redirect( admin_url( 'admin.php?page=ps-dropship' ) . ( $src ? '&src=' . rawurlencode( $src ) : '' ) );
			exit;
		}

		if ( 'apmoketa' === $v ) {
			if ( $o->is_paid() ) {
				$zinute = 'jau_apmoketa';
			} else {
				$tylus = ! empty( $_GET['be_laisko'] );
				$o->add_order_note(
					sprintf( 'Pažymėta kaip apmokėta darbalaukyje. Mokėjimo būdas: %s. Vartotojas: %s. Laiškas klientui: %s.',
						$o->get_payment_method_title() ? $o->get_payment_method_title() : '—',
						$naudotojas, $tylus ? 'NESIŲSTAS' : 'išsiųstas' ),
					false, true );
				if ( $tylus ) { self::laiskai_off(); }
				$o->payment_complete();
				if ( $tylus ) { self::laiskai_on(); }
				$zinute = $tylus ? 'apmoketa_tyliai' : 'apmoketa';

				// Sakyti TIESĄ: apmokėjus galėjo suveikti sandėlio/LP patikra —
				// tada užsakymas guli ne „Naujuose", o „Klausimuose".
				$sviezes = wc_get_order( $o->get_id() );
				$kl = $sviezes ? self::klausimas( $sviezes ) : '';
				if ( $kl ) { $zinute = 'apmoketa_klausimas'; $nr_priedas = $kl; }
			}
		}

		if ( 'atsaukti' === $v ) {
			if ( in_array( $o->get_status(), array( 'cancelled', 'lp-cancelled', 'refunded' ), true ) ) {
				$zinute = 'jau_atsaukta';
			} else {
				$su_laisku = ! empty( $_GET['su_laisku'] );
				$o->add_order_note(
					sprintf( 'Atšaukta darbalaukyje. Vartotojas: %s. Laiškas klientui: %s.',
						$naudotojas, $su_laisku ? 'išsiųstas' : 'NESIŲSTAS' ),
					false, true );
				if ( ! $su_laisku ) { self::laiskai_off(); }
				$o->update_status( 'cancelled', '' );
				if ( ! $su_laisku ) { self::laiskai_on(); }
				self::ryto_partija_ismesti( $o->get_id() ); // K1
				$zinute = $su_laisku ? 'atsaukta_laiskas' : 'atsaukta';
			}
		}

		if ( 'issiusta' === $v ) {
			if ( in_array( $o->get_status(), array( 'completed', 'lp-delivered', 'lp-on-the-way' ), true ) ) {
				$zinute = 'jau_issiusta';
			} else {
				$su_laisku = ! empty( $_GET['su_laisku'] );
				$o->add_order_note(
					sprintf( 'Pažymėta išsiųsta darbalaukyje. Vartotojas: %s. WC laiškas klientui: %s.',
						$naudotojas, $su_laisku ? 'išsiųstas' : 'NESIŲSTAS' ),
					false, true );
				if ( ! $su_laisku ) { self::laiskai_off(); }
				$o->update_status( 'completed', '' );
				if ( ! $su_laisku ) { self::laiskai_on(); }
				$sviezes = wc_get_order( $o->get_id() );
				if ( $sviezes && 'completed' !== $sviezes->get_status() ) {
					$zinute = 'issiusta_blokas'; // sargas neleido — ne visos siuntos registruotos
				} else {
					$zinute = $su_laisku ? 'issiusta_laiskas' : 'issiusta';
				}
			}
		}

		/**
		 * Mišraus užsakymo sprendimas: kiekvienam sandėliui — kelias.
		 * „į AV“ eilutės keliauja į tiekimo lentelę (Petshop_AV_Tiekimas) ir
		 * pažymimos `_ps_konsolidacija`, todėl tiekėjo laiške jų nebelieka (H233).
		 * „tiesiai“ — atvirkščias veiksmas, kol partija dar kaupiama.
		 */
		/**
		 * Mišraus užsakymo PLANAS. Tik įrašomas — jokių perkėlimų, jokių laiškų.
		 * Vykdymą pradeda žmogus atskiru mygtuku (H239).
		 */
		if ( 'misrus' === $v ) {
			$pasirinkta = isset( $_GET['s'] ) ? (array) wp_unslash( $_GET['s'] ) : array();
			$spr = array();
			foreach ( self::saltiniai( $o ) as $src ) {
				if ( 'av' === $src ) { continue; }
				$spr[ $src ] = ( isset( $pasirinkta[ $src ] ) && 'av' === sanitize_key( $pasirinkta[ $src ] ) ) ? 'av' : 'tiesiai';
			}

			$aprasas = array();
			foreach ( $spr as $t => $k ) {
				$aprasas[] = ( self::SALTINIAI[ $t ][1] ?? mb_strtoupper( $t ) ) . ' — ' . ( 'av' === $k ? 'į AV' : 'tiesiai' );
			}
			$o->update_meta_data( '_ps_misrus_sprendimas', wp_json_encode( $spr ) );
			$o->update_meta_data( '_ps_misrus_sprestas', current_time( 'mysql' ) . ' | ' . $naudotojas );
			$o->add_order_note( 'Mišraus užsakymo PLANAS: ' . implode( ' · ', $aprasas )
				. '. Dar neįvykdyta — laukia paleidimo. Vartotojas: ' . $naudotojas . '.', false, true );
			$o->save();

			$zinute     = self::kons_laukia( $o ) ? 'misrus_cia' : 'misrus_ok';
			$nr_priedas = implode( ' · ', $aprasas );
		}

		/**
		 * Plano VYKDYMAS: „į AV“ eilutės sudedamos į tiekimo partijas.
		 * Tik nuo šio paspaudimo užsakymas keliauja į „Laukia prekių“.
		 */
		if ( 'kons' === $v ) {
			$spr = self::misrus_sprendimas( $o );
			$n = 0;
			foreach ( $o->get_items() as $iid => $it ) {
				$src = self::eilutes_saltinis( $it );
				if ( ! $src || 'av' === $src || 'av' !== ( $spr[ $src ] ?? '' ) ) { continue; }
				if ( ! class_exists( 'Petshop_AV_Tiekimas' ) ) { continue; }
				if ( Petshop_AV_Tiekimas::ideti_eilute( $o, (int) $iid, $src ) ) {
					$it->update_meta_data( '_ps_konsolidacija', 1 );
					$it->save();
					$n++;
				}
			}
			$o = wc_get_order( $id );
			$zinute     = $n ? 'kons_ok' : 'kons_nieko';
			$nr_priedas = (string) $n;
		}

		/** Plano atšaukimas — kol partijos dar kaupiamos. */
		if ( 'misrus_keisti' === $v ) {
			foreach ( $o->get_items() as $iid => $it ) {
				if ( class_exists( 'Petshop_AV_Tiekimas' ) ) {
					Petshop_AV_Tiekimas::isimti_eilute( $o, (int) $iid );
				}
				if ( $it->get_meta( '_ps_konsolidacija' ) ) {
					$it->delete_meta_data( '_ps_konsolidacija' );
					$it->save();
				}
			}
			$o = wc_get_order( $id );
			$o->delete_meta_data( '_ps_misrus_sprendimas' );
			$o->delete_meta_data( '_ps_misrus_sprestas' );
			$o->add_order_note( 'Mišraus užsakymo planas atšauktas — grįžta į Mišrius. Vartotojas: ' . $naudotojas . '.', false, true );
			$o->save();
			$zinute = 'misrus_atsaukta';
		}

		/**
		 * Trynimas. Tik uždarytiems (atšauktas / grąžintas) ir tik su teise
		 * `delete_shop_orders`. HPOS: BŪTINA $order->delete( true ) — wp_delete_post()
		 * HPOS lentelių nepaliečia ir paliktų užsakymą pusiau gyvą.
		 */
		if ( 'istrinti' === $v ) {
			if ( ! current_user_can( 'delete_shop_orders' ) ) { wp_die( 'Nepakanka teisių trinti užsakymus' ); }
			if ( ! in_array( $o->get_status(), array( 'cancelled', 'lp-cancelled', 'refunded' ), true ) ) {
				$zinute = 'trinti_negalima';
			} else {
				$nr = $o->get_order_number();
				$o->delete( true );
				wp_safe_redirect( add_query_arg( array(
					'pd_ok' => 'istrinta',
					'pd_nr' => rawurlencode( $nr ),
				), $atgal ) );
				exit;
			}
		}

		wp_safe_redirect( add_query_arg( array(
			'pd_ok' => $zinute,
			'pd_nr' => rawurlencode( ( $o ? $o->get_order_number() : '' ) . ( isset( $nr_priedas ) ? '|' . $nr_priedas : '' ) ),
		), $atgal ) );
		exit;
	}

	public static function meniu() {
		add_menu_page( 'Petshop užsakymai', 'Petshop užsakymai', 'edit_shop_orders',
			self::SLUG, array( __CLASS__, 'puslapis' ), 'dashicons-clipboard', 2 );
	}

	/**
	 * WooCommerce užsakymų sąrašas nuimamas nuo akių, BET puslapis privalo
	 * likti veikiantis: per jį vykdomi vežėjų lipdukai ir sąskaitos (s526).
	 *
	 * s585: remove_submenu_page() puslapį uždaro visiškai — po jo wc-orders
	 * grąžino 403 ir lipdukai būtų nustoję veikti. Todėl slepiam CSS'u.
	 */
	public static function slepti_wc() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { return; }
		echo '<style>#adminmenu a[href*="page=wc-orders"]{display:none!important}</style>';
	}

	protected static function musu_puslapis() {
		return isset( $_GET['page'] ) && self::SLUG === $_GET['page'];
	}

	/** WordPress apdaras nuimamas TIK mūsų puslapyje. */
	public static function chrome() {
		if ( ! self::musu_puslapis() ) { return; }
		echo '<style>
			#adminmenumain,#wpfooter,#screen-meta,#screen-meta-links,.update-nag,.notice,#wpbody-content>.wrap>h1{display:none!important}
			#wpcontent{margin-left:0!important;padding-left:0!important}
			#wpbody-content{padding-bottom:0!important}
			html.wp-toolbar{padding-top:32px!important}
			#wpbody{margin:0!important}
		</style>';
	}

	/* ============================ DUOMENYS ============================ */

	/**
	 * Petshop_AV_Source::resolve() rezultatas su kešu.
	 * s513 patvirtinta: grąžina MASYVĄ
	 * [source, carrier, courier_only, av_qty, av_uztenka, tiekejas, reason].
	 */
	protected static function sprendimas( $pid, $qty ) {
		static $kesas = array();
		$r = (int) $pid . ':' . (int) $qty;
		if ( isset( $kesas[ $r ] ) ) { return $kesas[ $r ]; }
		$v = array();
		if ( $pid && class_exists( 'Petshop_AV_Source' ) ) {
			$x = Petshop_AV_Source::resolve( $pid, max( 1, (int) $qty ) );
			if ( is_array( $x ) ) { $v = $x; }
		}
		$kesas[ $r ] = $v;
		return $v;
	}

	/** Vienos eilutės šaltinis. Fiksuotas _ps_source visada viršesnis. */
	protected static function eilutes_saltinis( $item ) {
		$s = $item->get_meta( '_ps_source' );
		if ( is_string( $s ) && '' !== $s ) { return $s; }
		$v = self::sprendimas( $item->get_product_id(), $item->get_quantity() );
		if ( ! empty( $v['source'] ) && is_string( $v['source'] ) ) { return $v['source']; }
		return '';
	}

	/** Visi užsakyme esantys šaltiniai. */
	protected static function saltiniai( $order ) {
		$out = array();
		foreach ( $order->get_items() as $it ) {
			$s = self::eilutes_saltinis( $it );
			if ( is_string( $s ) && '' !== $s && ! in_array( $s, $out, true ) ) { $out[] = $s; }
		}
		return $out;
	}

	/**
	 * SAVA / DROPSHIP / MIŠRUS / —  (+ kiek siuntų klientui)
	 *
	 * MIŠRUS = sandėlių daugiau nei vienas. AV buvimas nieko nelemia: ZB+VF
	 * elgiasi lygiai kaip AV+ZB — dvi vietos, dvi siuntos, vienas pristatymo
	 * mokestis. Ta pati taisyklė galioja sąraše, filtre ir rytinėje eigoje (H235).
	 */
	protected static function vykdymas( $order ) {
		$s = self::saltiniai( $order );
		if ( ! $s ) { return array( '', 0 ); }
		if ( count( $s ) > 1 ) { return array( 'MIŠRUS', count( $s ) ); }
		return array( in_array( 'av', $s, true ) ? 'SAVA' : 'DROPSHIP', 1 );
	}

	const META_PAK = '_ps_pakuociu';

	/**
	 * Kiek dėžių šiai siuntai. Reikšmė reikalinga TIK kurjeriui —
	 * paštomate siunta visada viena.
	 * s571: Venipak priima packs[] masyvą, LP — lp_part_count lauką.
	 */
	public static function pakuociu( $o ) {
		$n = (int) $o->get_meta( self::META_PAK );
		return $n > 0 ? $n : 1;
	}

	protected static function reikia_pakuociu( $o ) {
		$v = self::vezejas( $o );
		// Venipak: ir kurjeriui, ir paštomatui — į paštomatą kiekviena dėžė
		// keliauja kaip atskira siunta (§19.11), todėl klausiama abiem.
		return in_array( $v, array( 'venipak_kurjeris', 'venipak_pastomatas', 'lp' ), true )
			&& ( 'lp' !== $v || ! $o->get_meta( '_woo_lithuaniapost_lpexpress_terminal_id' ) );
	}

	/**
	 * LP dydį pluginas skaičiuoja PATS pagal bendrą svorį (s570: size-service).
	 * Mums rinktis nereikia — bet verta parodyti, iš ko jis skaičiuoja,
	 * ir įspėti, jei prekė be svorio, nes tada rezultatas melagingas.
	 */
	public static function lp_svoris( $o ) {
		$g = 0; $be = array();
		foreach ( $o->get_items() as $it ) {
			$p = $it->get_product();
			$w = $p ? (float) $p->get_weight() : 0;
			if ( $w <= 0 ) { $be[] = $it->get_name(); continue; }
			$g += $w * (int) $it->get_quantity();
		}
		$vnt = get_option( 'woocommerce_weight_unit' );
		if ( 'kg' === $vnt ) { $g = $g * 1000; }
		return array( (int) round( $g ), $be );
	}

	/** Siuntos kodai iš Venipak / LP. */
	public static function siuntos_kodas( $o ) {
		$d = $o->get_meta( 'venipak_shipping_order_data' );
		// Pluginas raktą saugo JSON eilute (H202/H222) — maybe_unserialize jo NEatkoduoja.
		if ( is_string( $d ) && $d ) {
			$j = json_decode( $d, true );
			$d = null !== $j ? $j : maybe_unserialize( $d );
		}
		if ( is_array( $d ) && ! empty( $d['pack_numbers'] ) ) {
			$p = (array) $d['pack_numbers'];
			return array( implode( ', ', $p ), count( $p ) );
		}
		foreach ( array( '_lpexpress_tracking_number', 'lpexpress_tracking_number', '_lp_tracking' ) as $k ) {
			$v = $o->get_meta( $k );
			if ( $v ) { return array( is_array( $v ) ? implode( ', ', $v ) : $v, 1 ); }
		}
		return array( '', 0 );
	}

	/** venipak_kurjeris | venipak_pastomatas | lp | kita */
	protected static function vezejas( $order ) {
		$m = mb_strtoupper( (string) $order->get_shipping_method() );
		$lp = ( false !== mb_strpos( $m, 'UNISEND' ) || false !== mb_strpos( $m, 'LP ' ) || false !== mb_strpos( $m, 'LIETUVOS PAŠT' ) );
		$pastomatas = ( false !== mb_strpos( $m, 'PAŠTOMAT' ) || false !== mb_strpos( $m, 'ATSIĖMIM' ) || false !== mb_strpos( $m, 'PICKUP' ) );
		if ( $lp ) { return 'lp'; }
		if ( false !== mb_strpos( $m, 'VENIPAK' ) ) { return $pastomatas ? 'venipak_pastomatas' : 'venipak_kurjeris'; }
		return 'kita';
	}

	/** Ar užsakymas turi realią siuntą. */
	protected static function turi_siunta( $order ) {
		list( $k ) = self::siuntos_kodas( $order );
		return '' !== $k;
	}

	/** Kurios eilės užsakymas. */
	protected static function eile( $order ) {
		$st = $order->get_status();
		foreach ( array( 'neapmoketi', 'paruosta', 'atsaukti' ) as $e ) {
			if ( in_array( $st, self::STATUSAI[ $e ], true ) ) { return $e; }
		}
		if ( in_array( $st, self::STATUSAI['kelyje'], true ) )   { return 'kelyje'; }
		if ( in_array( $st, self::STATUSAI['ivykdyti'], true ) ) { return 'ivykdyti'; }
		if ( 'processing' === $st || 'on-hold' === $st ) {
			// H255: registruota siunta NEREIŠKIA paruošta — dropship dalys, dar
			// neperduotos tiekėjui, laiko užsakymą „Nauji“ su mygtuku „Perduoti“.
			$ds_liko = ( 'processing' === $st && class_exists( 'Petshop_AV_Dropship' ) )
				? Petshop_AV_Dropship::neperduotos( $order ) : array();
			if ( self::turi_siunta( $order ) && ! $ds_liko ) { return 'paruosta'; }
			// Mišrus be sprendimo — atskira eilė. Į rytinę partiją nepatenka (H236).
			// Planas įrašytas, bet „į AV" dalys dar nesudėtos į partiją — irgi liekam
			// Mišriuose, kad sprendimas ir paleidimas būtų vienoje vietoje (H242).
			if ( 'processing' === $st && count( self::saltiniai( $order ) ) > 1 ) {
				if ( ! $order->get_meta( '_ps_misrus_sprendimas' ) ) { return 'misrus'; }
				if ( self::kons_laukia( $order ) ) { return 'misrus'; }
			}
			if ( $order->get_meta( '_ps_tiekimas_laukia' ) ) { return 'laukia'; }
			return 'processing' === $st ? 'nauji' : 'kita';
		}
		return 'kita';
	}

	/**
	 * Ar užsakymas yra KLAUSIMAS. Grąžina priežastį arba ''.
	 * Tikrinami tik atviri užsakymai — įvykdytų ir atšauktų neliečiam.
	 */
	protected static function klausimas( $order ) {
		$st = $order->get_status();
		if ( in_array( $st, array( 'completed', 'lp-delivered', 'cancelled', 'lp-cancelled', 'refunded', 'checkout-draft' ), true ) ) {
			return '';
		}
		if ( 'failed' === $st )           { return 'Mokėjimas nepavyko'; }
		if ( 'lp-parcel-failed' === $st ) { return 'Siuntos sukurti nepavyko'; }

		if ( $order->get_meta( '_ps_withdrawal' ) ) { return 'Klientas atsisako sutarties'; }

		if ( $order->get_meta( '_ps_sla_velavimas' ) ) { return 'Tiekėjas vėluoja — perduota prieš 24+ val.'; }

		if ( ! $order->is_paid() ) { return ''; }

		// LP Express galimas TIK iš AV — dropship eilutė su LP pristatymu yra
		// fiziškai neįmanomas derinys, kuris kitaip išlįstų tik prie lipduko.
		if ( 'lp' === self::vezejas( $order ) ) {
			foreach ( $order->get_items() as $it ) {
				$ls = self::eilutes_saltinis( $it );
				if ( $ls && 'av' !== $ls ) { return 'LP negalimas — siuntoje ne-AV prekių'; }
			}
		}

		foreach ( $order->get_items() as $it ) {
			if ( 'av' !== self::eilutes_saltinis( $it ) ) { continue; }
			// jau nurašyta iš AV — prekė paimta, klausimo nėra
			if ( $it->get_meta( '_reduced_stock' ) || $it->get_meta( '_ps_av_reduced' ) ) { continue; }
			$pid = $it->get_product_id();
			if ( ! $pid ) { continue; }
			$fiksuota = (int) $it->get_meta( '_ps_source_qty' );
			$reikia   = $fiksuota ? $fiksuota : (int) $it->get_quantity();
			/*
			 * s589 — TIKRASIS modelis (perskaitytas AV_Source::resolve kode):
			 *   legacy prekė = AV sandėlis, likutis WooCommerce `_stock` lauke;
			 *   `_own_stock_qty` reikalingas TIK toms prekėms, kurios turi ir
			 *   tiekėją (jų katalogе vos 3).
			 * Todėl AV_Stock::qty() legacy prekėms grąžina null — remtis juo
			 * NEGALIMA. Vienintelis teisingas rodiklis yra resolve()['av_qty'].
			 */
			$v = self::sprendimas( $pid, $reikia );
			if ( $v && ! empty( $v['source'] ) && 'av' === $v['source']
				&& isset( $v['av_qty'] ) && (int) $v['av_qty'] < $reikia ) {
				return 'Trūksta sandėlyje';
			}
		}
		return '';
	}

	/**
	 * Problemiškos užsakymo eilutės su siūlomu sprendimu.
	 * Grąžina [ [iid, pavadinimas, reikia, av_turi, tiekejas, tiekejo_vardas] ]
	 */
	protected static function klausimo_eilutes( $order ) {
		$out = array();
		foreach ( $order->get_items() as $iid => $it ) {
			if ( 'av' !== self::eilutes_saltinis( $it ) ) { continue; }
			if ( $it->get_meta( '_reduced_stock' ) || $it->get_meta( '_ps_av_reduced' ) ) { continue; }
			$pid = $it->get_product_id();
			if ( ! $pid ) { continue; }
			$fix = (int) $it->get_meta( '_ps_source_qty' );
			$reikia = $fix ? $fix : (int) $it->get_quantity();
			$v    = self::sprendimas( $pid, $reikia );
			$turi = ( $v && isset( $v['av_qty'] ) ) ? (int) $v['av_qty'] : 0;
			if ( empty( $v['source'] ) || 'av' !== $v['source'] || $turi >= $reikia ) { continue; }

			$tiek = '';
			if ( ! empty( $v['tiekejas'] ) && is_string( $v['tiekejas'] ) && 'av' !== $v['tiekejas'] ) {
				$tiek = $v['tiekejas'];
			} elseif ( ! empty( $v['source'] ) && 'av' !== $v['source'] ) {
				$tiek = $v['source'];
			}

			$out[] = array(
				'iid'    => $iid,
				'pav'    => $it->get_name(),
				'reikia' => $reikia,
				'turi'   => $turi,
				'tiek'   => $tiek,
				'tiekv'  => $tiek ? ( self::SALTINIAI[ $tiek ][2] ?? mb_strtoupper( $tiek ) ) : '',
			);
		}
		return $out;
	}

	/* ============================ UŽKLAUSA ============================ */

	protected static function paieska_ids( $q ) {
		global $wpdb; $pf = $wpdb->prefix;
		$like = '%' . $wpdb->esc_like( $q ) . '%';
		$ids  = $wpdb->get_col( $wpdb->prepare(
			"SELECT DISTINCT o.id FROM {$pf}wc_orders o
			 LEFT JOIN {$pf}wc_order_addresses a ON a.order_id = o.id
			 WHERE o.type = 'shop_order' AND o.status <> 'wc-checkout-draft' AND (
			   o.id LIKE %s OR o.billing_email LIKE %s OR a.first_name LIKE %s
			   OR a.last_name LIKE %s OR a.phone LIKE %s
			   OR CONCAT(a.first_name,' ',a.last_name) LIKE %s
			   OR a.address_1 LIKE %s OR a.city LIKE %s OR a.postcode LIKE %s
			   OR a.company LIKE %s )
			 ORDER BY o.id DESC LIMIT 120",
			$like, $like, $like, $like, $like, $like, $like, $like, $like, $like ) );

		$pagal_preke = $wpdb->get_col( $wpdb->prepare(
			"SELECT DISTINCT order_id FROM {$pf}woocommerce_order_items
			 WHERE order_item_name LIKE %s ORDER BY order_id DESC LIMIT 60", $like ) );

		$pagal_siunta = $wpdb->get_col( $wpdb->prepare(
			"SELECT DISTINCT order_id FROM {$pf}wc_orders_meta
			 WHERE meta_value LIKE %s LIMIT 40", $like ) );

		return array_slice( array_unique( array_merge( $ids, $pagal_preke, $pagal_siunta ) ), 0, 150 );
	}

	/** Tikslinė paieška atskirais laukais (Raimio filtrai). AND semantika. */
	protected static function lauku_paieska( $f ) {
		if ( '' === $f['nr'] && '' === $f['klientas'] && '' === $f['tel'] && '' === $f['adresas'] ) { return null; }
		global $wpdb; $pf = $wpdb->prefix;
		$kur = array( "o.type='shop_order'", "o.status<>'wc-checkout-draft'" );
		$par = array();
		if ( '' !== $f['nr'] ) { $kur[] = 'o.id LIKE %s'; $par[] = '%' . $wpdb->esc_like( $f['nr'] ) . '%'; }
		if ( '' !== $f['klientas'] ) {
			$kur[] = "(CONCAT(a.first_name,' ',a.last_name) LIKE %s OR o.billing_email LIKE %s OR a.company LIKE %s)";
			$l = '%' . $wpdb->esc_like( $f['klientas'] ) . '%'; $par[] = $l; $par[] = $l; $par[] = $l;
		}
		if ( '' !== $f['tel'] ) { $kur[] = 'a.phone LIKE %s'; $par[] = '%' . $wpdb->esc_like( $f['tel'] ) . '%'; }
		if ( '' !== $f['adresas'] ) {
			$kur[] = '(a.address_1 LIKE %s OR a.city LIKE %s OR a.postcode LIKE %s)';
			$l = '%' . $wpdb->esc_like( $f['adresas'] ) . '%'; $par[] = $l; $par[] = $l; $par[] = $l;
		}
		return $wpdb->get_col( $wpdb->prepare(
			"SELECT DISTINCT o.id FROM {$pf}wc_orders o
			 LEFT JOIN {$pf}wc_order_addresses a ON a.order_id=o.id
			 WHERE " . implode( ' AND ', $kur ) . ' ORDER BY o.id DESC LIMIT 150', $par ) );
	}

	protected static function datos_riba( $kodas, $nuo, $iki ) {
		$tz = wp_timezone();
		$d  = new DateTime( 'now', $tz );
		switch ( $kodas ) {
			case 'siandien': return array( $d->format( 'Y-m-d' ) . ' 00:00:00', $d->format( 'Y-m-d' ) . ' 23:59:59' );
			case 'vakar':
				$v = ( clone $d )->modify( '-1 day' )->format( 'Y-m-d' );
				return array( $v . ' 00:00:00', $v . ' 23:59:59' );
			case 'savaite':
				$p = ( clone $d )->modify( 'monday this week' )->format( 'Y-m-d' );
				return array( $p . ' 00:00:00', $d->format( 'Y-m-d' ) . ' 23:59:59' );
			case 'menuo':
				return array( $d->format( 'Y-m-01' ) . ' 00:00:00', $d->format( 'Y-m-d' ) . ' 23:59:59' );
			case 'praeitas':
				$p = ( clone $d )->modify( 'first day of last month' );
				$g = ( clone $d )->modify( 'last day of last month' );
				return array( $p->format( 'Y-m-01' ) . ' 00:00:00', $g->format( 'Y-m-d' ) . ' 23:59:59' );
			case 'intervalas':
				if ( ! $nuo && ! $iki ) { return null; }
				return array( ( $nuo ? $nuo : '2000-01-01' ) . ' 00:00:00', ( $iki ? $iki : '2099-12-31' ) . ' 23:59:59' );
		}
		return null;
	}

	/** Grąžina [užsakymai, skaičiai]. */
	protected static function gauti( $eile, $f ) {
		$args = array(
			'limit'   => 200,
			'type'    => 'shop_order',
			'orderby' => 'date',
			'order'   => 'DESC',
			'return'  => 'objects',
		);

		if ( ! empty( $f['q'] ) ) {
			$ids = self::paieska_ids( $f['q'] );
			if ( ! $ids ) { return array(); }
			$args['post__in'] = $ids;
			$args['include']  = $ids;
			$args['limit']    = 150;
		}

		$lids = self::lauku_paieska( $f );
		if ( null !== $lids ) {
			if ( ! $lids ) { return array(); }
			$lids = isset( $args['include'] ) ? array_values( array_intersect( $args['include'], $lids ) ) : $lids;
			if ( ! $lids ) { return array(); }
			$args['post__in'] = $lids;
			$args['include']  = $lids;
			$args['limit']    = 150;
		}

		$riba = self::datos_riba( $f['data'], $f['nuo'], $f['iki'] );
		if ( $riba ) { $args['date_created'] = $riba[0] . '...' . $riba[1]; }

		if ( 'laukia' === $eile ) {
			$args['status'] = array( 'processing', 'on-hold' );
		} elseif ( 'atsaukti' === $eile ) {
			$args['status'] = self::STATUSAI['atsaukti'];
		} elseif ( 'issiusti' === $eile ) {
			$args['status'] = array_merge( self::STATUSAI['kelyje'], self::STATUSAI['ivykdyti'] );
		} elseif ( 'neapmoketi' === $eile ) {
			$args['status'] = self::STATUSAI['neapmoketi'];
		} elseif ( 'visi' === $eile || 'klausimai' === $eile ) {
			$args['status'] = array_keys( wc_get_order_statuses() );
			$args['status'] = array_map( function ( $s ) { return str_replace( 'wc-', '', $s ); }, $args['status'] );
			$args['status'] = array_diff( $args['status'], array( 'checkout-draft' ) );
		} else {
			$args['status'] = array( 'processing', 'on-hold', 'failed' );
			$args['status'] = array_merge( $args['status'], self::STATUSAI['paruosta'] );
		}

		$orders = wc_get_orders( $args );
		if ( ! is_array( $orders ) ) { return array(); }

		$out = array();
		foreach ( $orders as $o ) {
			if ( ! is_a( $o, 'WC_Order' ) ) { continue; }
			$kl = self::klausimas( $o );
			$e  = self::eile( $o );

			if ( 'klausimai' === $eile ) {
				if ( ! $kl ) { continue; }
			} elseif ( 'issiusti' === $eile ) {
				if ( ! in_array( $e, array( 'kelyje', 'ivykdyti' ), true ) ) { continue; }
			} elseif ( 'visi' !== $eile ) {
				if ( $e !== $eile ) { continue; }
				if ( $kl && 'klausimai' !== $eile && 'atsaukti' !== $eile ) { continue; }
			}

			if ( ! empty( $f['busena'] ) ) {
				$leidz = self::STATUSAI[ $f['busena'] ] ?? array();
				if ( 'nauji' === $f['busena'] ) {
					if ( 'nauji' !== $e ) { continue; }
				} elseif ( $leidz && ! in_array( $o->get_status(), $leidz, true ) ) { continue; }
			}

			// vykdymo filtras
			if ( ! empty( $f['vykdymas'] ) ) {
				$s   = self::saltiniai( $o );
				$v   = $f['vykdymas'];
				$av  = in_array( 'av', $s, true );
				$ds  = count( array_diff( $s, array( 'av' ) ) ) > 0;
				// H235: mišrus = sandėlių > 1. SAVA/DROPSHIP — tik vieno sandėlio užsakymai.
				if ( 'sava' === $v && ( count( $s ) > 1 || ! $av ) ) { continue; }
				if ( 'dropship' === $v && ( count( $s ) > 1 || $av || ! $ds ) ) { continue; }
				if ( 'misrus' === $v && count( $s ) < 2 ) { continue; }
				if ( isset( self::SALTINIAI[ $v ] ) && ! in_array( $v, $s, true ) ) { continue; }
			}

			// pristatymo filtras
			if ( ! empty( $f['vezejas'] ) && self::vezejas( $o ) !== $f['vezejas'] ) { continue; }

			// mokėjimo filtras
			if ( ! empty( $f['mokejimas'] ) ) {
				$m = $f['mokejimas'];
				if ( 'apmoketa' === $m && ! $o->is_paid() ) { continue; }
				if ( 'neapmoketa' === $m && $o->is_paid() ) { continue; }
				if ( 'paysera' === $m && false === strpos( (string) $o->get_payment_method(), 'paysera' ) ) { continue; }
				if ( 'bacs' === $m && 'bacs' !== $o->get_payment_method() ) { continue; }
			}

			// amžiaus filtras — užstrigusiems gaudyti
			if ( ! empty( $f['amzius'] ) ) {
				$sk = $o->get_date_created();
				if ( ! $sk ) { continue; }
				$dienu = ( time() - $sk->getTimestamp() ) / DAY_IN_SECONDS;
				if ( 'd2' === $f['amzius'] && $dienu < 2 ) { continue; }
				if ( 'd3' === $f['amzius'] && $dienu < 3 ) { continue; }
				if ( 'd5' === $f['amzius'] && $dienu < 5 ) { continue; }
			}

			// Pipeline žvilgsnis (H243): „Neperduota tiekėjams" — tik su neperduotom grupėm.
			if ( 'neperduota' === ( $f['zvilgsnis'] ?? '' ) ) {
				if ( ! class_exists( 'Petshop_AV_Dropship' ) || ! Petshop_AV_Dropship::neperduotos( $o ) ) { continue; }
			}

			$out[] = array( 'o' => $o, 'eile' => $e, 'klausimas' => $kl );
		}
		return $out;
	}

	/** Eilių skaitikliai — viena praeiga per atvirus užsakymus. */
	protected static function skaiciai() {
		$c = array( 'nauji' => 0, 'misrus' => 0, 'neapmoketi' => 0, 'laukia' => 0, 'paruosta' => 0,
			'klausimai' => 0, 'atsaukti' => 0, 'visi' => 0 );

		$atviri = wc_get_orders( array(
			'limit'  => 200,
			'type'   => 'shop_order',
			'status' => array_merge( array( 'processing', 'on-hold', 'pending', 'failed', 'lp-parcel-await', 'lp-parcel-failed' ), self::STATUSAI['paruosta'] ),
		) );
		$c['pipe_spresti'] = 0; $c['pipe_nepaleisti'] = 0; $c['pipe_neperduota'] = 0;
		foreach ( (array) $atviri as $o ) {
			if ( ! is_a( $o, 'WC_Order' ) ) { continue; }
			if ( self::klausimas( $o ) ) { $c['klausimai']++; continue; }
			$e = self::eile( $o );
			if ( isset( $c[ $e ] ) ) { $c[ $e ]++; }
			// Pipeline (H243): mišrių skilimas + neperduoti tiekėjams tarp „Naujų".
			if ( 'misrus' === $e ) {
				self::misrus_sprendimas( $o ) ? $c['pipe_nepaleisti']++ : $c['pipe_spresti']++;
			} elseif ( 'nauji' === $e && class_exists( 'Petshop_AV_Dropship' )
				&& Petshop_AV_Dropship::neperduotos( $o ) ) {
				$c['pipe_neperduota']++;
			}
		}

		global $wpdb; $pf = $wpdb->prefix;
		$c['atsaukti'] = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$pf}wc_orders WHERE type='shop_order'
			 AND status IN ('wc-cancelled','wc-lp-cancelled','wc-refunded')" );
		$c['issiusti'] = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$pf}wc_orders WHERE type='shop_order'
			 AND status IN ('wc-lp-on-the-way','wc-completed','wc-lp-delivered')" );
		$c['visi'] = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$pf}wc_orders WHERE type='shop_order' AND status<>'wc-checkout-draft'" );
		// Tiekimo partijos navigacijai (H244): kiek kaupiama, kiek užsakyta pas tiekėją.
		$c['tiek_kaupiama'] = 0; $c['tiek_uzsakyta'] = 0;
		if ( class_exists( 'Petshop_AV_Tiekimas' ) ) {
			foreach ( (array) $wpdb->get_results(
				"SELECT p.busena, COUNT(DISTINCT p.id) n
				 FROM {$pf}ps_tiekimas p
				 JOIN {$pf}ps_tiekimas_eil e ON e.partija_id=p.id
				 WHERE p.busena IN ('kaupiama','uzsakyta') GROUP BY p.busena" ) as $r ) {
				if ( 'kaupiama' === $r->busena ) { $c['tiek_kaupiama'] = (int) $r->n; }
				if ( 'uzsakyta' === $r->busena ) { $c['tiek_uzsakyta'] = (int) $r->n; }
			}
		}

		// „Išsiųsta šiandien" — statusas kelyje/įvykdytas, atnaujintas nuo vietinės vidurnakties (H243).
		$c['pipe_issiusta'] = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(*) FROM {$pf}wc_orders WHERE type='shop_order'
			 AND status IN ('wc-lp-on-the-way','wc-completed','wc-lp-delivered')
			 AND date_updated_gmt >= %s", get_gmt_from_date( wp_date( 'Y-m-d' ) . ' 00:00:00' ) ) );
		return $c;
	}

	/* ============================ VAIZDAS ============================ */

	protected static function url( $args = array() ) {
		$b = array( 'page' => self::SLUG );
		foreach ( array( 'eile', 'q', 'data', 'nuo', 'iki', 'vykdymas', 'vezejas', 'busena' ) as $k ) {
			if ( isset( $_GET[ $k ] ) && '' !== $_GET[ $k ] ) { $b[ $k ] = sanitize_text_field( wp_unslash( $_GET[ $k ] ) ); }
		}
		foreach ( $args as $k => $v ) {
			if ( null === $v || '' === $v ) { unset( $b[ $k ] ); } else { $b[ $k ] = $v; }
		}
		return admin_url( 'admin.php?' . http_build_query( $b ) );
	}

	protected static function zyme( $s ) {
		$d = self::SALTINIAI[ $s ] ?? array( '#6B7269', mb_strtoupper( $s ), $s );
		$stilius = 'av' === $s
			? 'background:' . $d[0] . ';color:#fff'
			: 'border:1px solid ' . $d[0] . ';color:' . $d[0];
		return '<span class="pd-src" style="' . $stilius . '" title="' . esc_attr( $d[2] ) . '">' . esc_html( $d[1] ) . '</span>';
	}

	public static function puslapis() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }

		if ( isset( $_GET['view'] ) && 'rytas' === $_GET['view'] ) { self::rytas(); return; }

		$eile = isset( $_GET['eile'] ) ? sanitize_key( $_GET['eile'] ) : 'nauji';
		if ( ! isset( self::EILES[ $eile ] ) ) { $eile = 'nauji'; }

		$f = array(
			'q'        => isset( $_GET['q'] ) ? sanitize_text_field( wp_unslash( $_GET['q'] ) ) : '',
			'data'     => isset( $_GET['data'] ) ? sanitize_key( $_GET['data'] ) : '',
			'nuo'      => isset( $_GET['nuo'] ) ? sanitize_text_field( wp_unslash( $_GET['nuo'] ) ) : '',
			'iki'      => isset( $_GET['iki'] ) ? sanitize_text_field( wp_unslash( $_GET['iki'] ) ) : '',
			'vykdymas' => isset( $_GET['vykdymas'] ) ? sanitize_key( $_GET['vykdymas'] ) : '',
			'vezejas'  => isset( $_GET['vezejas'] ) ? sanitize_key( $_GET['vezejas'] ) : '',
			'busena'   => isset( $_GET['busena'] ) ? sanitize_key( $_GET['busena'] ) : '',
			'mokejimas'=> isset( $_GET['mokejimas'] ) ? sanitize_key( $_GET['mokejimas'] ) : '',
			'amzius'   => isset( $_GET['amzius'] ) ? sanitize_key( $_GET['amzius'] ) : '',
			'nr'       => isset( $_GET['nr'] ) ? sanitize_text_field( wp_unslash( $_GET['nr'] ) ) : '',
			'klientas' => isset( $_GET['klientas'] ) ? sanitize_text_field( wp_unslash( $_GET['klientas'] ) ) : '',
			'tel'      => isset( $_GET['tel'] ) ? sanitize_text_field( wp_unslash( $_GET['tel'] ) ) : '',
			'adresas'  => isset( $_GET['adresas'] ) ? sanitize_text_field( wp_unslash( $_GET['adresas'] ) ) : '',
			'zvilgsnis'=> isset( $_GET['zvilgsnis'] ) ? sanitize_key( $_GET['zvilgsnis'] ) : '',
		);

		$eilutes = self::gauti( $eile, $f );
		if ( 'klausimai' === $eile || 'misrus' === $eile ) { $f['korteles'] = 1; }
		$c       = self::skaiciai();
		$statusai = wc_get_order_statuses();

		self::stilius();
		echo '<div class="pd">';
		self::virsus( $f );
		self::pranesimas();
		echo '<div class="pd-body">';
		self::rail( $eile, $c );
		echo '<main class="pd-main">';
		self::pipe( $c );
		self::juosta( $eile, $f, count( $eilutes ) );
		if ( 'klausimai' === $eile && $eilutes ) {
			echo '<div class="pd-wrap">';
			self::klausimu_korteles( $eilutes );
			echo '</div>';
		} elseif ( 'misrus' === $eile && $eilutes ) {
			echo '<div class="pd-wrap">';
			self::misriu_korteles( $eilutes );
			echo '</div>';
		} else {
			self::lentele( $eilutes, $statusai, $eile, $f );
		}
		echo '</main></div>';
		self::skydelis();
		self::dialogas();
		self::bulk();
		self::skriptas();
		echo '</div>';
	}

	/** Rezultatas po veiksmo. */
	/* ============================ RYTINĖ EIGA ============================
	 * Šeši žingsniai vietoj rankinio rankiojimo. Partija UŽRAKINAMA pirmame
	 * žingsnyje (transient 3 val.) — kad viduryje atėję nauji užsakymai
	 * nepakeistų to, ką jau atsispausdinai.
	 *
	 * Žingsniai spaudžiami: gali šokti tiesiai į „Tiekėjams“, jei Belacor
	 * kurjeris atvažiuoja 10:00, ir grįžti prie likusio darbo vėliau.
	 *
	 * Kiekvienas darbo mygtukas atidaro NAUJĄ kortelę — eiga lieka vietoje.
	 * ==================================================================== */

	const RYTO_ZINGSNIAI = array(
		1 => 'Peržiūra',
		2 => 'Surinkimo lapai',
		3 => 'Venipak',
		4 => 'LP Express',
		5 => 'Tiekėjams',
		6 => 'Baigta',
	);

	/** Partijos sudėtis. $naujai = perskaičiuoti iš naujo. */
	protected static function ryto_partija( $naujai = false ) {
		$raktas = 'ps_rytas_' . get_current_user_id();
		if ( ! $naujai ) {
			$k = get_transient( $raktas );
			if ( is_array( $k ) && ! empty( $k['ts'] ) ) { return self::ryto_partija_isvalyti( $k, $raktas ); }
		}

		$orders = wc_get_orders( array(
			'limit'  => 200,
			'type'   => 'shop_order',
			'status' => array( 'processing', 'on-hold' ),
		) );

		$p = array(
			'ts' => time(), 'visi' => array(), 'av' => array(), 'ds' => array(),
			'vp' => array(), 'lp' => array(), 'klausimai' => array(),
			'vp_grupes' => array(), 'vp_misrus' => array(),
			'tiekejai' => array(), 'eil' => array(),
		);

		foreach ( (array) $orders as $o ) {
			if ( ! is_a( $o, 'WC_Order' ) ) { continue; }
			if ( ! $o->is_paid() ) { continue; }
			$id = $o->get_id();

			if ( self::klausimas( $o ) ) { $p['klausimai'][] = $id; continue; }
			if ( 'nauji' !== self::eile( $o ) ) { continue; }

			$sal = self::saltiniai( $o );
			$av  = in_array( 'av', $sal, true );
			$ds  = array_values( array_diff( $sal, array( 'av' ) ) );
			// Perdavimas skaitomas PAGAL SANDĖLĮ: mišrus su VF ir PRINS po VF perdavimo
			// dar laukia PRINS laiško (H234).
			$liko_ds = class_exists( 'Petshop_AV_Dropship' )
				? Petshop_AV_Dropship::neperduotos( $o )
				: $ds;
			$perduoti = class_exists( 'Petshop_AV_Dropship' )
				? array_keys( Petshop_AV_Dropship::perduotos( $o ) )
				: array();
			$jau_perduota = ( $ds && ! $liko_ds );

			$p['visi'][] = $id;
			$p['eil'][]  = array(
				'id'  => $id,
				'nr'  => $o->get_order_number(),
				'kl'  => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ),
				'vyk' => self::vykdymas( $o )[0],
				'vez' => self::vezejo_vardas( $o ),
				'ds'  => $ds,
				'perduota'  => $jau_perduota,
				'perduoti'  => $perduoti,
				'liko'      => $liko_ds,
			);

			if ( $av ) { $p['av'][] = $id; }

			// Venipak grupuojam PAGAL SANDĖLĮ — vienas manifestas vienam paėmimui.
			// Siuntėjas visada Avesa; skiriasi tik iš kur kurjeris paima.
			if ( 'lp' === self::vezejas( $o ) ) {
				if ( $av ) { $p['lp'][] = $id; }
			} else {
				$p['vp'][] = $id;
				if ( count( $sal ) > 1 ) {
					$p['vp_misrus'][] = $id;
				} else {
					$k = $sal ? $sal[0] : 'av';
					if ( ! isset( $p['vp_grupes'][ $k ] ) ) { $p['vp_grupes'][ $k ] = array(); }
					$p['vp_grupes'][ $k ][] = $id;
				}
			}
			if ( $liko_ds ) {
				$p['ds'][] = $id;
				foreach ( $liko_ds as $t ) {
					if ( ! isset( $p['tiekejai'][ $t ] ) ) { $p['tiekejai'][ $t ] = 0; }
					$p['tiekejai'][ $t ]++;
				}
			}
		}

		set_transient( $raktas, $p, 3 * HOUR_IN_SECONDS );
		return $p;
	}

	/**
	 * K1 (S1602): užrakinta partija perfiltruojama pagal ESAMĄ užsakymo statusą.
	 * Partija lieka užrakinta (nauji užsakymai į ją nepatenka), bet atšaukti,
	 * įvykdyti ar grąžinti per tą laiką užsakymai iš jos dingsta — kitaip 3 žingsnis
	 * siūlo registruoti siuntą užsakymui, kurio nebėra.
	 */
	protected static function ryto_partija_isvalyti( $p, $raktas = '' ) {
		$blogi = array();
		foreach ( (array) ( $p['visi'] ?? array() ) as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o || ! in_array( $o->get_status(), array( 'processing', 'on-hold' ), true ) || ! $o->is_paid() ) {
				$blogi[] = (int) $id;
			}
		}
		foreach ( (array) ( $p['klausimai'] ?? array() ) as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o || ! in_array( $o->get_status(), array( 'processing', 'on-hold' ), true ) ) { $blogi[] = (int) $id; }
		}
		if ( ! $blogi ) { return $p; }
		$p = self::ryto_partija_be( $p, $blogi );
		if ( $raktas ) { set_transient( $raktas, $p, 3 * HOUR_IN_SECONDS ); }
		return $p;
	}

	/** Išima nurodytus užsakymų ID iš visų partijos sąrašų. */
	protected static function ryto_partija_be( $p, $ids ) {
		$ids = array_map( 'intval', (array) $ids );
		$be  = function ( $arr ) use ( $ids ) {
			return array_values( array_filter( (array) $arr, function ( $x ) use ( $ids ) { return ! in_array( (int) $x, $ids, true ); } ) );
		};
		foreach ( array( 'visi', 'av', 'ds', 'vp', 'lp', 'klausimai', 'vp_misrus' ) as $k ) {
			if ( isset( $p[ $k ] ) ) { $p[ $k ] = $be( $p[ $k ] ); }
		}
		foreach ( (array) ( $p['vp_grupes'] ?? array() ) as $g => $arr ) {
			$p['vp_grupes'][ $g ] = $be( $arr );
			if ( ! $p['vp_grupes'][ $g ] ) { unset( $p['vp_grupes'][ $g ] ); }
		}
		$tiek = array();
		$p['eil'] = array_values( array_filter( (array) ( $p['eil'] ?? array() ), function ( $e ) use ( $ids ) { return ! in_array( (int) ( $e['id'] ?? 0 ), $ids, true ); } ) );
		foreach ( $p['eil'] as $e ) {
			foreach ( (array) ( $e['liko'] ?? array() ) as $t ) { $tiek[ $t ] = ( $tiek[ $t ] ?? 0 ) + 1; }
		}
		$p['tiekejai'] = $tiek;
		return $p;
	}

	/** K1: atšaukus darbalaukyje — išimti iš VISŲ vartotojų ryto partijų iš karto. */
	protected static function ryto_partija_ismesti( $id ) {
		global $wpdb;
		$names = $wpdb->get_col( "SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE '_transient_ps_rytas_%'" );
		foreach ( (array) $names as $n ) {
			$raktas = substr( $n, strlen( '_transient_' ) );
			$p = get_transient( $raktas );
			if ( ! is_array( $p ) ) { continue; }
			set_transient( $raktas, self::ryto_partija_be( $p, array( $id ) ), 3 * HOUR_IN_SECONDS );
		}
	}

	protected static function ryto_url( $z, $extra = array() ) {
		return admin_url( 'admin.php?' . http_build_query( array_merge(
			array( 'page' => self::SLUG, 'view' => 'rytas', 'z' => (int) $z ), $extra ) ) );
	}

	protected static function rytas() {
		$z = isset( $_GET['z'] ) ? max( 1, min( 6, absint( $_GET['z'] ) ) ) : 1;
		$p = self::ryto_partija( 1 === $z && isset( $_GET['naujai'] ) );

		self::stilius();
		echo '<div class="pd pd-rytas">';
		?>
		<header class="pd-top">
			<div class="pd-brand">Petshop <span>· rytinė eiga</span></div>
			<div class="pd-steps">
				<?php foreach ( self::RYTO_ZINGSNIAI as $n => $t ) :
					$b = $n < $z ? 'atlikta' : ( $n === $z ? 'dabar' : '' ); ?>
					<a class="pd-step <?php echo esc_attr( $b ); ?>" href="<?php echo esc_url( self::ryto_url( $n ) ); ?>">
						<span class="pd-sdot"><?php echo $n < $z ? '✓' : (int) $n; ?></span><?php echo esc_html( $t ); ?>
					</a>
					<?php if ( 6 !== $n ) { echo '<span class="pd-sarr">›</span>'; } ?>
				<?php endforeach; ?>
			</div>
			<div class="pd-top-r">
				<a class="pd-tbtn" href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::SLUG ) ); ?>">✕ Išeiti</a>
			</div>
		</header>
		<div class="pd-ryt-body">
		<?php

		if ( ! $p['visi'] ) {
			echo '<div class="pd-empty" style="padding:80px 20px"><b>Nieko ruošti</b>
				<span>Apmokėtų užsakymų, laukiančių surinkimo ar perdavimo, nėra.</span></div>';
		} else {
			switch ( $z ) {
				case 1: self::ryt1( $p ); break;
				case 2: self::ryt2( $p ); break;
				case 3: self::ryt3( $p ); break;
				case 4: self::ryt4( $p ); break;
				case 5: self::ryt5( $p ); break;
				default: self::ryt6( $p );
			}
		}

		echo '</div>';
		self::ryt_kojele( $z, $p );
		self::wc_forma();
		self::ryt_skriptas();
		echo '</div>';
	}

	protected static function ryt_kojele( $z, $p ) {
		echo '<div class="pd-ryt-f">';
		if ( $z > 1 ) {
			printf( '<a class="pd-btn" href="%s">Atgal</a>', esc_url( self::ryto_url( $z - 1 ) ) );
		}
		echo '<span class="pd-ryt-hint">' . esc_html( self::ryt_uzuomina( $z ) ) . '</span>';
		if ( $z < 6 ) {
			printf( '<a class="pd-btn pd-btn-p" href="%s">%s</a>',
				esc_url( self::ryto_url( $z + 1 ) ), 1 === $z ? 'Pradėti' : 'Toliau' );
		} else {
			printf( '<a class="pd-btn pd-btn-p" href="%s">Uždaryti</a>',
				esc_url( admin_url( 'admin.php?page=' . self::SLUG ) ) );
		}
		echo '</div>';
	}

	protected static function ryt_uzuomina( $z ) {
		$u = array(
			1 => 'Partija užrakinama — vėliau atėję užsakymai jos nepakeis.',
			2 => 'A4 spausdintuvas. Atsidaro naujoje kortelėje, eiga lieka čia.',
			3 => 'Etikečių spausdintuvas 10×15. Pirma registruoti, tada spausdinti.',
			4 => 'LP siuntoms dydis renkamas formuojant lipduką.',
			5 => 'Laiškai neišeina be tavo paspaudimo perdavimo ekrane.',
			6 => '',
		);
		return $u[ $z ] ?? '';
	}

	protected static function ryt_kort( $sk, $etikete, $spalva ) {
		printf( '<div class="pd-rcard"><div class="pd-rv" style="color:%s">%d</div><div class="pd-rl">%s</div></div>',
			esc_attr( $spalva ), (int) $sk, wp_kses_post( $etikete ) );
	}

	protected static function ryt1( $p ) {
		echo '<h2 class="pd-rh2">Į rytinę partiją patenka</h2><div class="pd-rgrid">';
		self::ryt_kort( count( $p['av'] ), 'iš sandėlio (AV)<br><small>' . count( $p['vp'] ) . ' Venipak · ' . count( $p['lp'] ) . ' LP</small>', '#2D5F3F' );
		$t = array();
		foreach ( $p['tiekejai'] as $k => $n ) { $t[] = ( self::SALTINIAI[ $k ][1] ?? mb_strtoupper( $k ) ) . ' ' . $n; }
		self::ryt_kort( count( $p['ds'] ), 'tiekėjams<br><small>' . ( $t ? esc_html( implode( ' · ', $t ) ) : '—' ) . '</small>', '#5B3B92' );
		self::ryt_kort( count( $p['klausimai'] ), 'klausimai<br><small>į partiją NEPATENKA</small>', '#98262A' );
		echo '</div>';

		echo '<table class="pd-tbl pd-rtbl"><thead><tr><th>Nr.</th><th>Klientas</th><th>Kelias</th><th>Pristatymas</th><th>Tiekėjai</th></tr></thead><tbody>';
		foreach ( $p['eil'] as $e ) {
			$ts = array();
			foreach ( $e['ds'] as $t ) { $ts[] = self::zyme( $t ); }
			printf( '<tr><td class="pd-nr">#%s</td><td>%s</td><td><span class="pd-exec">%s</span></td><td>%s</td><td>%s%s</td></tr>',
				esc_html( $e['nr'] ), esc_html( $e['kl'] ), esc_html( $e['vyk'] ), esc_html( $e['vez'] ),
				implode( '', $ts ) ? implode( '', $ts ) : '—',
				self::perdavimo_zenklas( $e ) );
		}
		echo '</tbody></table>';
		printf( '<p class="pd-rnote">Partija sudaryta %s. <a href="%s">Perskaičiuoti iš naujo</a></p>',
			esc_html( wp_date( 'H:i', $p['ts'] ) ), esc_url( self::ryto_url( 1, array( 'naujai' => 1 ) ) ) );
	}

	protected static function ryt2( $p ) {
		echo '<h2 class="pd-rh2">Surinkimo lapai</h2>';
		if ( ! $p['av'] ) {
			echo '<p class="pd-rnote">Šioje partijoje nėra prekių iš savo sandėlio — šį žingsnį praleisk.</p>';
			return;
		}
		printf( '<p class="pd-rnote">%d %s su prekėmis iš sandėlio. Lape trys blokai: bendras surinkimas, Venipak eilėmis, LP eilėmis. Dropship eilutės į lapus neįtraukiamos.</p>',
			count( $p['av'] ), esc_html( self::linksnis( count( $p['av'] ), 'užsakymas', 'užsakymai', 'užsakymų' ) ) );
		printf( '<a class="pd-btn pd-btn-p pd-rbig" target="_blank" rel="noopener" href="%s">Atidaryti surinkimo lapus →</a>',
			esc_url( self::veiksmo_url( 'lapai', 0 ) . '&ids=' . implode( ',', $p['av'] ) ) );
	}

	/**
	 * Siuntų būklė. Vežėjo pluginas apie nesėkmę nepraneša (s538), todėl
	 * po kiekvieno veiksmo pasitikrinam PATYS: ar atsirado siuntos kodas.
	 * Grąžina [eilutės[], registruota, viso].
	 */
	protected static function siuntu_bukle( $ids ) {
		$eil = array(); $ok = 0;
		foreach ( (array) $ids as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o ) { continue; }
			list( $kodas, $pak ) = self::siuntos_kodas( $o );
			if ( $kodas ) { $ok++; }
			$eil[] = array(
				'nr'    => $o->get_order_number(),
				'kl'    => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ),
				'vieta' => $o->get_meta( 'venipak_pickup_point' ),
				'vez'   => self::vezejo_vardas( $o ),
				'kodas' => $kodas,
				'pak'   => $pak,
			);
		}
		return array( $eil, $ok, count( (array) $ids ) );
	}

	/**
	 * Perdavimo ženklas rytinės eigos lentelėje. Mišriam būtina matyti DALINĮ
	 * perdavimą — „perduota VF · liko PRI“ — kitaip antras tiekėjas pasimeta (H234).
	 */
	protected static function perdavimo_zenklas( $e ) {
		if ( empty( $e['ds'] ) ) { return ''; }
		if ( ! empty( $e['perduota'] ) ) { return ' <span class="pd-sent">jau perduota</span>'; }
		if ( empty( $e['perduoti'] ) ) { return ''; }

		$p = array();
		foreach ( (array) $e['perduoti'] as $t ) { $p[] = self::SALTINIAI[ $t ][1] ?? mb_strtoupper( $t ); }
		$l = array();
		foreach ( (array) $e['liko'] as $t ) { $l[] = self::SALTINIAI[ $t ][1] ?? mb_strtoupper( $t ); }

		return sprintf( ' <span class="pd-sent">perduota %s</span><span class="pd-liko">liko %s</span>',
			esc_html( implode( ', ', $p ) ), esc_html( implode( ', ', $l ) ) );
	}

	protected static function siuntu_lentele( $ids, $pastomatu_tikrinti = true ) {
		list( $eil, $ok, $viso ) = self::siuntu_bukle( $ids );
		printf( '<div class="pd-rstat %s">%s</div>',
			$ok === $viso ? 'ok' : ( $ok ? 'dalis' : 'nulis' ),
			esc_html( sprintf( 'Registruota %d iš %d', $ok, $viso ) ) );

		echo '<table class="pd-tbl pd-rtbl"><thead><tr><th>Nr.</th><th>Klientas</th><th>Pristatymas</th><th>Siuntos kodas</th></tr></thead><tbody>';
		foreach ( $eil as $e ) {
			$trukumas = ( $pastomatu_tikrinti && ! $e['kodas'] && false !== mb_stripos( $e['vez'], 'paštomat' ) && ! $e['vieta'] )
				? ' <span class="pd-rbad">nenurodytas paštomatas</span>' : '';
			printf( '<tr><td class="pd-nr">#%s</td><td>%s</td><td>%s%s</td><td>%s</td></tr>',
				esc_html( $e['nr'] ), esc_html( $e['kl'] ), esc_html( $e['vez'] ), $trukumas,
				$e['kodas']
					? '<span class="pd-rok">✓ ' . esc_html( $e['kodas'] ) . ( $e['pak'] > 1 ? ' · ' . (int) $e['pak'] . ' lipdukai' : '' ) . '</span>'
					: '<span class="pd-rbad">— nėra</span>' );
		}
		echo '</tbody></table>';
		return $ok;
	}

	protected static function ryt3( $p ) {
		echo '<h2 class="pd-rh2">Venipak</h2>';
		echo '<script>document.addEventListener("change",function(ev){
			var i=ev.target.closest("[data-pk]"); if(!i) return;
			var n=Math.max(1,Math.min(20,parseInt(i.value||"1",10)));
			window.location.href = i.getAttribute("data-pk") + "&n=" + n;
		});</script>';
		if ( ! $p['vp'] ) { echo '<p class="pd-rnote">Venipak siuntų šioje partijoje nėra.</p>'; return; }

		echo '<p class="pd-rnote">Kiekvienas sandėlis registruojamas <b>atskirai</b> — taip gaunamas savas manifestas
			tam kurjerio paėmimui. Siuntėjas visose siuntose lieka UAB Avesa.</p>';

		$pav = array(
			'av' => 'Savas sandėlis', 'vf' => 'Vetfarmas', 'zb' => 'Žalioji Banga',
			'quattro' => 'Quattro', 'prins' => 'Prins / Faunas', 'ambrosia' => 'Ambrosia', 'belcor_tofu' => 'Belacor',
		);

		foreach ( self::MANIFESTAI as $k => $mkod ) {
			if ( empty( $p['vp_grupes'][ $k ] ) ) { continue; }
			$grupe = $p['vp_grupes'][ $k ];
			list( $eil, $ok, $viso ) = self::siuntu_bukle( $grupe );

			list( $kg, $be_svorio ) = self::grupes_svoris( $grupe );

			echo '<div class="pd-vgrp">';
			printf( '<div class="pd-vgrp-h"><b>%s</b><span class="pd-vman">manifestas %s</span>%s%s%s</div>',
				esc_html( $pav[ $k ] ?? mb_strtoupper( $k ) ),
				esc_html( self::manifesto_numeris( $mkod ) ),
				self::ribos_zyme( $k ),
				// Kurjeriui iškviesti reikia BENDRO svorio iš to sandėlio (H237).
				sprintf( '<span class="pd-vkg" title="Bendras svoris kurjerio iškvietimui">%d %s · viso %s%s</span>',
					$viso, esc_html( self::linksnis( $viso, 'siunta', 'siuntos', 'siuntų' ) ),
					esc_html( self::kg( $kg ) ),
					$be_svorio ? esc_html( sprintf( ' · %d be svorio', $be_svorio ) ) : '' ),
				sprintf( '<span class="pd-rstat %s">%s</span>',
					$ok === $viso ? 'ok' : ( $ok ? 'dalis' : 'nulis' ),
					esc_html( sprintf( 'registruota %d iš %d', $ok, $viso ) ) ) );

			echo '<div class="pd-vgrp-b">';
			$liko = $viso - $ok;
			if ( $liko > 0 ) {
				printf( '<a class="pd-btn pd-btn-p" href="%s">Registruoti %d %s</a>',
					esc_url( self::veiksmo_url( 'vp_reg', 0 ) . '&sandelis=' . rawurlencode( $k ) . '&ids=' . implode( ',', $grupe ) ),
					$liko, esc_html( self::linksnis( $liko, 'siuntą', 'siuntas', 'siuntų' ) ) );
			} else {
				echo '<span class="pd-rok">✓ visos registruotos</span> ';
			}

			printf( '<button class="pd-btn" data-wcnew="shopup_venipak_shipping_labels" data-ids="%s">Lipdukai 10×15</button>',
				esc_attr( implode( ',', $grupe ) ) );

			$man = self::grupes_manifestas( $grupe );
			if ( $man ) {
				printf( '<a class="pd-btn" target="_blank" rel="noopener" href="%s">Manifestas PDF</a>',
					esc_url( self::veiksmo_url( 'vp_manifestas', 0 ) . '&kodas=' . rawurlencode( $man ) ) );
			}
			echo '</div>';

			echo '<table class="pd-tbl pd-rtbl"><tbody>';
			foreach ( $eil as $e ) {
				$pk = '';
				if ( ! $e['kodas'] ) {
					$oid_p = 0;
					foreach ( $grupe as $gid ) { $go = wc_get_order( $gid ); if ( $go && $go->get_order_number() == $e['nr'] ) { $oid_p = $gid; break; } }
					if ( $oid_p ) {
						$bazine = self::veiksmo_url( 'pakuotes', $oid_p );
						$pk = sprintf( ' <span class="pd-pk">dėžių <input type="number" min="1" max="20" value="%d" data-pk="%s" style="width:46px"></span>',
							(int) self::pakuociu( wc_get_order( $oid_p ) ), esc_attr( $bazine ) );
					}
				}
				printf( '<tr><td class="pd-nr">#%s</td><td>%s</td><td>%s%s</td><td>%s</td></tr>',
					esc_html( $e['nr'] ), esc_html( $e['kl'] ), esc_html( $e['vez'] ), $pk,
					$e['kodas'] ? '<span class="pd-rok">✓ ' . esc_html( $e['kodas'] ) . '</span>'
						: '<span class="pd-rbad">' . esc_html( self::siuntos_klaida( $e['nr'], $grupe ) ) . '</span>' );
			}
			echo '</tbody></table></div>';
		}

		if ( ! empty( $p['vp_misrus'] ) ) {
			echo '<div class="pd-vgrp pd-vmix"><div class="pd-vgrp-h"><b>Mišrūs užsakymai</b>
				<span class="pd-vman">registruojami rankomis</span></div>
				<div class="pd-rwarn" style="margin:0 14px 12px">Šie užsakymai turi prekių iš kelių sandėlių, tad
				fiziškai iškeliauja dviem siuntomis iš skirtingų vietų. Venipak pluginas vienam užsakymui moka
				sukurti tik VIENĄ siuntą, todėl automatiškai jų neregistruojame — kitaip viena dalis atsidurtų
				ne tame manifeste.</div><table class="pd-tbl pd-rtbl"><tbody>';
			foreach ( $p['vp_misrus'] as $id ) {
				$o = wc_get_order( $id ); if ( ! $o ) { continue; }
				$z = '';
				foreach ( self::saltiniai( $o ) as $x ) { $z .= self::zyme( $x ); }
				printf( '<tr><td class="pd-nr">#%s</td><td>%s</td><td>%s</td><td><a class="pd-btn pd-btn-s" href="%s">Atidaryti</a></td></tr>',
					esc_html( $o->get_order_number() ),
					esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ),
					$z, esc_url( $o->get_edit_order_url() ) );
			}
			echo '</tbody></table></div>';
		}
	}

	/**
	 * Kiek liko iki sandėlio ribos. Grąžina [būsena, tekstas] arba null.
	 * būsena: speji | skuba | praejo
	 */
	protected static function riba( $sandelis ) {
		if ( empty( self::RIBOS[ $sandelis ] ) ) { return null; }
		$laikas = self::RIBOS[ $sandelis ];
		$dabar  = (int) current_time( 'timestamp' );
		$riba   = strtotime( wp_date( 'Y-m-d', $dabar ) . ' ' . $laikas . ':00' );
		$liko   = $riba - $dabar;

		if ( $liko <= 0 ) {
			return array( 'praejo', $laikas . ' · praėjo, keliaus rytoj' );
		}
		$val = (int) floor( $liko / 3600 );
		$min = (int) floor( ( $liko % 3600 ) / 60 );
		$t   = $val ? ( $val . ' val ' . $min . ' min' ) : ( $min . ' min' );
		return array( $liko < 3600 ? 'skuba' : 'speji', $laikas . ' · liko ' . $t );
	}

	protected static function ribos_zyme( $sandelis ) {
		$r = self::riba( $sandelis );
		if ( ! $r ) { return ''; }
		return '<span class="pd-riba pd-riba-' . esc_attr( $r[0] ) . '">' . esc_html( $r[1] ) . '</span>';
	}

	/** Pilnas manifesto numeris, koks atsiras Venipake. */
	protected static function manifesto_numeris( $kodas ) {
		$n = get_option( 'shopup_venipak_shipping_settings' );
		$cid = is_array( $n ) ? ( $n['shopup_venipak_shipping_field_userid'] ?? '' ) : '';
		return $cid . wp_date( 'ymd' ) . $kodas;
	}

	/** Manifesto numeris iš jau užregistruotų grupės siuntų. */
	protected static function grupes_manifestas( $ids ) {
		foreach ( (array) $ids as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o ) { continue; }
			$d = json_decode( (string) $o->get_meta( 'venipak_shipping_order_data' ), true );
			if ( ! empty( $d['manifest'] ) ) { return $d['manifest']; }
		}
		return '';
	}

	/** Venipak klaidos tekstas iš meta — pluginas jį įrašo, bet nerodo (s544). */
	protected static function siuntos_klaida( $nr, $ids ) {
		foreach ( (array) $ids as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o || $o->get_order_number() !== $nr ) { continue; }
			$d = json_decode( (string) $o->get_meta( 'venipak_shipping_order_data' ), true );
			if ( ! empty( $d['error_message'] ) ) { return mb_substr( $d['error_message'], 0, 90 ); }
			if ( 'venipak_pastomatas' === self::vezejas( $o ) && ! $o->get_meta( 'venipak_pickup_point' ) ) {
				return 'nenurodytas paštomatas';
			}
			break;
		}
		return '— nėra';
	}

	protected static function ryt4( $p ) {
		echo '<h2 class="pd-rh2">LP Express</h2>';
		if ( ! $p['lp'] ) { echo '<p class="pd-rnote">LP Express siuntų šioje partijoje nėra.</p>'; return; }

		list( $lp_kg ) = self::grupes_svoris( $p['lp'] );
		printf( '<p class="pd-rnote">%d %s · <b>viso %s</b> (kurjerio iškvietimui). Dydį LP parenka pats pagal svorį — rinktis nereikia.
			Kurjeris atvažiuoja <b>13:00</b>. %s</p>',
			count( $p['lp'] ), esc_html( self::linksnis( count( $p['lp'] ), 'siunta', 'siuntos', 'siuntų' ) ),
			esc_html( self::kg( $lp_kg ) ),
			wp_kses_post( self::ribos_zyme( 'lp' ) ) );

		echo '<div class="pd-rwarn" style="margin:0 0 16px">Lipduko formavimas LP sistemoje <b>iškart išsikviečia
			kurjerį</b> — spausdink tik tada, kai siuntos tikrai keliaus šiandien.</div>';

		printf( '<button class="pd-btn pd-btn-p pd-rbig" data-wcnew="woo_lp_print_label" data-ids="%s">Spausdinti LP lipdukus</button>',
			esc_attr( implode( ',', $p['lp'] ) ) );
		printf( '<button class="pd-btn pd-rbig" data-wcnew="woo_lp_print_manifest" data-ids="%s">Kurjeris + manifestas</button>',
			esc_attr( implode( ',', $p['lp'] ) ) );

		// būklė: kodas, svoris, dėžės, ar kurjeris jau kviestas
		echo '<table class="pd-tbl pd-rtbl"><thead><tr><th>Nr.</th><th>Klientas</th><th>Kelias</th>
			<th>Svoris</th><th>Dėžių</th><th>Siuntos kodas</th></tr></thead><tbody>';
		$kviesta = '';
		foreach ( $p['lp'] as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o ) { continue; }
			list( $kodas ) = self::siuntos_kodas( $o );
			list( $g, $be ) = self::lp_svoris( $o );
			$term = $o->get_meta( '_woo_lithuaniapost_lpexpress_terminal_id' );
			$kv   = $o->get_meta( '_woo_lithuaniapost_lpexpress_courier_called_date' );
			if ( $kv ) { $kviesta = $kv; }

			printf( '<tr><td class="pd-nr">#%s</td><td>%s</td><td>%s</td><td class="mono%s">%s</td><td class="mono">%s</td><td>%s</td></tr>',
				esc_html( $o->get_order_number() ),
				esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ),
				$term ? 'paštomatas' : 'kurjeris',
				$be ? ' pd-rbad' : '',
				$be ? 'trūksta svorio' : esc_html( number_format_i18n( $g ) . ' g' ),
				$term ? '—' : (int) self::pakuociu( $o ),
				$kodas ? '<span class="pd-rok">✓ ' . esc_html( $kodas ) . '</span>' : '<span class="pd-rbad">— nėra</span>' );
		}
		echo '</tbody></table>';

		if ( $kviesta ) {
			printf( '<p class="pd-rnote"><b>Kurjeris jau iškviestas:</b> %s. Antro karto kviesti nereikia.</p>',
				esc_html( is_string( $kviesta ) ? $kviesta : wp_date( 'Y-m-d H:i', (int) $kviesta ) ) );
		}
		echo '<p class="pd-rnote">Dėžių skaičių kurjerio siuntoms nustatai užsakymo skydelyje sąraše —
			LP jį priima kaip <span class="mono">partCount</span>.</p>';
	}

	protected static function ryt5( $p ) {
		echo '<h2 class="pd-rh2">Perduoti tiekėjams</h2>';
		if ( ! $p['ds'] ) { echo '<p class="pd-rnote">Dropship užsakymų šioje partijoje nėra.</p>'; return; }
		// rikiuojam pagal tai, kam liko mažiausiai laiko
		$eile = $p['tiekejai'];
		uksort( $eile, function ( $a, $b ) {
			$ra = self::RIBOS[ $a ] ?? '23:59';
			$rb = self::RIBOS[ $b ] ?? '23:59';
			return strcmp( $ra, $rb );
		} );
		echo '<table class="pd-tbl pd-rtbl"><tbody>';
		foreach ( $eile as $k => $n ) {
			printf( '<tr><td><b>%s</b></td><td>%d %s</td><td>%s</td></tr>',
				esc_html( self::SALTINIAI[ $k ][2] ?? $k ), (int) $n,
				esc_html( self::linksnis( $n, 'užsakymas', 'užsakymai', 'užsakymų' ) ),
				self::ribos_zyme( $k ) );
		}
		echo '</tbody></table>';
		printf( '<a class="pd-btn pd-btn-p pd-rbig" target="_blank" rel="noopener" href="%s">Atidaryti perdavimo ekraną →</a>',
			esc_url( self::veiksmo_url( 'perduoti', 0 ) . '&ids=' . implode( ',', $p['ds'] ) ) );
		echo '<p class="pd-rwarn">Ten pamatysi kiekvieno tiekėjo kortelę su laišku ir lipdukais. Laiškas išeina tik tau paspaudus.</p>';
	}

	protected static function ryt6( $p ) {
		echo '<div class="pd-rdone"><div class="pd-rcheck">✓</div><h2>Rytas uždarytas</h2>
			<p>Prie stalo: lapai A4 ir lipdukai 10×15. Tvarka sutampa — pakuok iš eilės.</p></div>';
		echo '<div class="pd-rgrid">';
		self::ryt_kort( count( $p['av'] ), 'surinkti iš sandėlio', '#2D5F3F' );
		self::ryt_kort( count( $p['vp'] ), 'Venipak lipdukai', '#2B5C8A' );
		self::ryt_kort( count( $p['lp'] ), 'LP lipdukai', '#2B5C8A' );
		self::ryt_kort( count( $p['ds'] ), 'perduota tiekėjams', '#5B3B92' );
		echo '</div>';
		if ( $p['klausimai'] ) {
			printf( '<p class="pd-rwarn">Liko %d %s, kurių eiga nelietė — jie laukia tavo sprendimo. <a href="%s">Atidaryti →</a></p>',
				count( $p['klausimai'] ),
				esc_html( self::linksnis( count( $p['klausimai'] ), 'klausimas', 'klausimai', 'klausimų' ) ),
				esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&eile=klausimai' ) ) );
		}
	}

	protected static function ryt_skriptas() {
		?>
<script>
(function(){
 var f=document.getElementById('pdWcForm');
 [].forEach.call(document.querySelectorAll('[data-wcnew]'),function(b){
  b.addEventListener('click',function(e){
   e.preventDefault();
   var box=document.getElementById('pdWcIds'); box.innerHTML='';
   (b.getAttribute('data-ids')||'').split(',').forEach(function(id){
    if(!id) return;
    ['id[]','post[]'].forEach(function(n){
     var i=document.createElement('input'); i.type='hidden'; i.name=n; i.value=id; box.appendChild(i);
    });
   });
   document.getElementById('pdWcAction').value=b.getAttribute('data-wcnew');
   f.target='_blank'; f.submit();
   b.classList.add('pd-done'); b.textContent='✓ '+b.textContent.replace(/^✓ /,'');
  });
 });
 [].forEach.call(document.querySelectorAll('.pd-rbig[target="_blank"]'),function(a){
  a.addEventListener('click',function(){ a.classList.add('pd-done'); });
 });
})();
</script>
		<?php
	}

	protected static function pranesimas() {
		if ( empty( $_GET['pd_ok'] ) ) { return; }
		$nr = isset( $_GET['pd_nr'] ) ? sanitize_text_field( wp_unslash( $_GET['pd_nr'] ) ) : '';
		$k  = sanitize_key( wp_unslash( $_GET['pd_ok'] ) );
		$t  = array(
			'apmoketa'        => array( 'ok', 'Užsakymas #%s pažymėtas apmokėtu. Prekės nurašytos, klientui išsiųstas patvirtinimas.' ),
			'apmoketa_tyliai' => array( 'ok', 'Užsakymas #%s pažymėtas apmokėtu. Prekės nurašytos. Laiškas klientui NEIŠSIŲSTAS.' ),
			'jau_apmoketa'    => array( 'info', 'Užsakymas #%s jau buvo apmokėtas — niekas nepakeista.' ),
			'apmoketa_klausimas' => array( 'info', 'Užsakymas #%s apmokėtas, bet perkeltas į KLAUSIMUS: %s. Spręsk kortelėje.' ),
			'atsaukta'        => array( 'ok', 'Užsakymas #%s atšauktas. Prekės grąžintos į likutį. Klientui nepranešta.' ),
			'atsaukta_laiskas'=> array( 'ok', 'Užsakymas #%s atšauktas. Prekės grąžintos į likutį. Klientui išsiųstas pranešimas.' ),
			'jau_atsaukta'    => array( 'info', 'Užsakymas #%s jau buvo atšauktas — niekas nepakeista.' ),
			'issiusta'        => array( 'ok', 'Užsakymas #%s pažymėtas išsiųstu — eilė „Išsiųsti“. WC laiškas klientui NEIŠSIŲSTAS.' ),
			'issiusta_laiskas'=> array( 'ok', 'Užsakymas #%s pažymėtas išsiųstu — eilė „Išsiųsti“. Klientui išsiųstas WC laiškas „Įvykdytas“.' ),
			'jau_issiusta'    => array( 'info', 'Užsakymas #%s jau buvo išsiųstas — niekas nepakeista.' ),
			'issiusta_blokas' => array( 'klaida', 'Užsakymo #%s užbaigti neleido sargas — registruotos ne visos siuntos. Registruok trūkstamas ir bandyk vėl.' ),
			'istrinta'        => array( 'ok', 'Užsakymas #%s ištrintas negrįžtamai.' ),
			'misrus_ok'       => array( 'ok', 'Užsakymo #%s planas įrašytas: %s. Viskas tiesiai klientui — užsakymas grįžo į „Nauji", perdavimą paleisi ten.' ),
			'misrus_cia'      => array( 'ok', 'Užsakymo #%s planas įrašytas: %s. Užsakymas liko čia — paleisk mygtukais kortelėje apačioje.' ),
			'kons_ok'         => array( 'ok', 'Užsakymas #%s: %s eilutė(-ės) įdėtos į tiekimo partijas — laukiam prekių į AV.' ),
			'kons_nieko'      => array( 'info', 'Užsakyme #%s nėra ko dėti į tiekimo partijas.' ),
			'misrus_atsaukta' => array( 'ok', 'Užsakymo #%s planas atšauktas — grįžo į Mišrius.' ),
			'trinti_negalima' => array( 'klaida', 'Užsakymo #%s ištrinti negalima — pirma jį atšauk.' ),
			'vp_ok'           => array( 'ok', 'Venipak: siuntos užregistruotos (%s). Manifestas paruoštas.' ),
			'vp_klaida'       => array( 'klaida', 'Venipak nepriėmė: %s' ),
			'vp_nieko'        => array( 'info', 'Registruoti nėra ko: %s.' ),
			'eilute_ideta'    => array( 'ok', 'Prekė įtraukta į tiekimo lentelę — parsivešim į AV. %s' ),
			'eilute_isimta'   => array( 'ok', 'Prekė išimta iš tiekimo lentelės — keliaus dropshipu. %s' ),
			'pakuotes'        => array( 'ok', 'Pakuočių skaičius išsaugotas: %s.' ),
			'kl_saltinis'     => array( 'ok', 'Užsakymo #%s šaltinis pakeistas — klausimas išspręstas.' ),
			'kl_laukti'       => array( 'info', 'Užsakymas #%s pažymėtas laukti. Priminimų nebus — grįši pats.' ),
		);
		if ( ! isset( $t[ $k ] ) ) { return; }
		$dalys = explode( '|', $nr, 2 );
		$tekstas = in_array( $k, array( 'apmoketa_klausimas', 'misrus_ok', 'misrus_cia', 'kons_ok' ), true )
			? sprintf( $t[ $k ][1], $dalys[0], $dalys[1] ?? '' )
			: sprintf( $t[ $k ][1], $nr );
		if ( 'kons_ok' === $k ) {
			$tekstas .= ' <a href="' . esc_url( admin_url( 'admin.php?page=ps-tiekimas' ) ) . '">Atidaryti Tiekimą</a>';
			printf( '<div class="pd-msg pd-msg-%s">%s<button class="pd-msg-x" onclick="this.parentNode.remove()">✕</button></div>',
				esc_attr( $t[ $k ][0] ), wp_kses( $tekstas, array( 'a' => array( 'href' => true ) ) ) );
			return;
		}
		if ( 'apmoketa_klausimas' === $k ) {
			$tekstas .= ' <a href="' . esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&eile=klausimai' ) ) . '">Atidaryti Klausimus</a>';
			printf( '<div class="pd-msg pd-msg-%s">%s<button class="pd-msg-x" onclick="this.parentNode.remove()">✕</button></div>',
				esc_attr( $t[ $k ][0] ), wp_kses( $tekstas, array( 'a' => array( 'href' => true ) ) ) );
			return;
		}
		printf( '<div class="pd-msg pd-msg-%s">%s<button class="pd-msg-x" onclick="this.parentNode.remove()">✕</button></div>',
			esc_attr( $t[ $k ][0] ), esc_html( $tekstas ) );
	}

	protected static function virsus( $f ) {
		?>
		<header class="pd-top">
			<div class="pd-brand">Petshop <span>· užsakymai</span></div>
			<form method="get" class="pd-search">
				<input type="hidden" name="page" value="<?php echo esc_attr( self::SLUG ); ?>">
				<input type="hidden" name="eile" value="visi">
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/></svg>
				<input type="search" name="q" id="pdQ" value="<?php echo esc_attr( $f['q'] ); ?>"
					placeholder="Užsakymas, klientas, telefonas, adresas, prekė, siuntos kodas" autocomplete="off">
				<kbd>/</kbd>
			</form>
			<div class="pd-top-r">
				<a class="pd-tbtn pd-go" href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&view=rytas' ) ); ?>">▶ Rytinė eiga</a>
				<a class="pd-tbtn" href="<?php echo esc_url( admin_url( 'admin.php?page=wc-orders' ) ); ?>">WooCommerce sąrašas</a>
				<a class="pd-tbtn pd-tbtn-kat" href="<?php echo esc_url( admin_url( 'admin.php?page=ps-katalogas' ) ); ?>" title="Petshop prekės — kainos, likučiai, tiekėjai">Prekių katalogas</a>
				<?php
				$artimiausia = null;
				foreach ( self::RIBOS as $sk => $lk ) {
					$rz = self::riba( $sk );
					if ( $rz && 'praejo' !== $rz[0] && ( ! $artimiausia || $lk < $artimiausia[1] ) ) {
						$artimiausia = array( $sk, $lk, $rz );
					}
				}
				if ( $artimiausia ) {
					printf( '<span class="pd-tr pd-tr-%s"><b>%s</b>%s</span>',
						esc_attr( $artimiausia[2][0] ),
						esc_html( self::SALTINIAI[ $artimiausia[0] ][1] ?? $artimiausia[0] ),
						esc_html( str_replace( ' · ', ' ', $artimiausia[2][1] ) ) );
				} else {
					echo '<span class="pd-tr pd-tr-praejo">ribos šiandien praėjo · nauji keliaus rytoj</span>';
				}
				?>
				<span class="pd-av"><?php
					global $wpdb;
					$n = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}postmeta WHERE meta_key='_own_stock_qty' AND meta_value>0" );
					echo 'AV sandėlis <b>' . esc_html( $n ) . '</b>';
				?></span>
			</div>
		</header>
		<?php
	}

	/** Pipeline juosta (H243): visa dienos būklė vienu žvilgsniu, kiekvienas skaičius — nuoroda. */
	protected static function pipe( $c ) {
		$langai = array(
			array( 'Laukia sprendimo',      (int) ( $c['pipe_spresti'] ?? 0 ),    self::url( array( 'eile' => 'misrus', 'zvilgsnis' => null ) ) ),
			array( 'Nepaleisti planai',     (int) ( $c['pipe_nepaleisti'] ?? 0 ), self::url( array( 'eile' => 'misrus', 'zvilgsnis' => null ) ) ),
			array( 'Neperduota tiekėjams',  (int) ( $c['pipe_neperduota'] ?? 0 ), self::url( array( 'eile' => 'nauji', 'zvilgsnis' => 'neperduota' ) ) ),
			array( 'Partijose',             (int) ( $c['tiek_kaupiama'] ?? 0 ),   admin_url( 'admin.php?page=ps-tiekimas' ) ),
			array( 'Laukia prekių',         (int) ( $c['laukia'] ?? 0 ),          self::url( array( 'eile' => 'laukia', 'zvilgsnis' => null ) ) ),
			array( 'Paruošta siųsti',       (int) ( $c['paruosta'] ?? 0 ),        self::url( array( 'eile' => 'paruosta', 'zvilgsnis' => null ) ) ),
			array( 'Išsiųsta šiandien',     (int) ( $c['pipe_issiusta'] ?? 0 ),   self::url( array( 'eile' => 'issiusti', 'zvilgsnis' => null ) ) ),
		);
		echo '<div class="pd-pipe">';
		foreach ( $langai as $i => $l ) {
			if ( $i ) { echo '<span class="pd-pipe-s">›</span>'; }
			printf( '<a class="pd-pipe-i%s" href="%s">%s <b>%d</b></a>',
				$l[1] ? '' : ' pd-pipe-0', esc_url( $l[2] ), esc_html( $l[0] ), $l[1] );
		}
		echo '</div>';
	}

	protected static function rail( $eile, $c ) {
		echo '<nav class="pd-rail"><div class="pd-rh">Užsakymai</div>';
		foreach ( array( 'nauji', 'misrus', 'neapmoketi', 'laukia', 'paruosta', 'klausimai' ) as $k ) {
			self::rail_punktas( $k, $eile, $c[ $k ] ?? 0, false );
		}
		echo '<div class="pd-sep"></div>';
		foreach ( array( 'issiusti', 'atsaukti', 'visi' ) as $k ) {
			self::rail_punktas( $k, $eile, $c[ $k ] ?? 0, true );
		}
		// ĮRANKIAI (H244): sistemos geografija matoma visada, ne tik per veiksmus.
		echo '<div class="pd-sep"></div><div class="pd-rh">Įrankiai</div>';
		printf( '<a class="pd-ri" href="%s"><span>Tiekimas</span>%s%s</a>',
			esc_url( admin_url( 'admin.php?page=ps-tiekimas' ) ),
			! empty( $c['tiek_kaupiama'] ) ? '<b class="pd-rb pd-rb-k" title="kaupiamos partijos">' . (int) $c['tiek_kaupiama'] . '</b>' : '',
			! empty( $c['tiek_uzsakyta'] ) ? '<b class="pd-rb pd-rb-u" title="užsakyta pas tiekėją — laukiam prekių">' . (int) $c['tiek_uzsakyta'] . '</b>' : '' );
		printf( '<a class="pd-ri" href="%s"><span>Laiškai tiekėjams</span>%s</a>',
			esc_url( admin_url( 'admin.php?page=ps-laiskai&b=laukia' ) ),
			! empty( $c['pipe_neperduota'] ) ? '<b class="pd-rb pd-rb-k" title="užsakymai, laukiantys laiško tiekėjui">' . (int) $c['pipe_neperduota'] . '</b>' : '' );
		printf( '<a class="pd-ri" href="%s"><span>Perdavimas tiekėjams</span>%s</a>',
			esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&eile=nauji&zvilgsnis=neperduota' ) ),
			! empty( $c['pipe_neperduota'] ) ? '<b class="pd-rb pd-rb-k">' . (int) $c['pipe_neperduota'] . '</b>' : '' );
		echo '<div class="pd-ai"><div class="pd-ai-h"><span class="pd-dot"></span>Siūlymai</div>
			<div class="pd-ai-t">Tuščia. Čia rinksis automatiniai siūlymai — kiekvieną tvirtinsi arba atmesi tu.</div></div>';
		echo '</nav>';
	}

	protected static function rail_punktas( $k, $eile, $n, $blankus ) {
		$d = self::EILES[ $k ];
		$a = $k === $eile;
		printf(
			'<a class="pd-q%s%s" href="%s" style="--qc:%s"><i></i>%s<span class="pd-n%s">%s</span></a>',
			$a ? ' on' : '', $blankus ? ' dim' : '',
			esc_url( self::url( array( 'eile' => $k, 'busena' => null ) ) ),
			esc_attr( $d[2] ), esc_html( $d[0] ),
			( $n && ! $blankus ) ? ' hot' : '', esc_html( number_format_i18n( $n ) )
		);
	}

	protected static function juosta( $eile, $f, $kiek ) {
		$d = self::EILES[ $eile ];
		echo '<div class="pd-bar"><div class="pd-h1">' . esc_html( $d[0] );
		if ( $d[1] ) { echo '<em>' . esc_html( $d[1] ) . '</em>'; }
		echo '</div>';

		echo '<div class="pd-filters">';

		// Vykdymas
		$vopt = array( '' => 'Vykdymas: visi', 'sava' => 'Sava (AV)', 'dropship' => 'Dropship', 'misrus' => 'Mišrūs' );
		foreach ( self::SALTINIAI as $k => $v ) {
			if ( 'av' === $k ) { continue; }
			$vopt[ $k ] = '— ' . $v[2];
		}
		self::select( 'vykdymas', $vopt, $f['vykdymas'] );

		// Pristatymas
		self::select( 'vezejas', array(
			''                   => 'Pristatymas: visi',
			'venipak_kurjeris'   => 'Venipak kurjeris',
			'venipak_pastomatas' => 'Venipak paštomatas',
			'lp'                 => 'LP Express',
		), $f['vezejas'] );

		// Data
		self::select( 'data', array(
			''           => 'Data: visos',
			'siandien'   => 'Šiandien',
			'vakar'      => 'Vakar',
			'savaite'    => 'Šią savaitę',
			'menuo'      => 'Šį mėnesį',
			'praeitas'   => 'Praėjusį mėnesį',
			'intervalas' => 'Intervalas…',
		), $f['data'] );

		if ( 'intervalas' === $f['data'] ) {
			echo '<form method="get" class="pd-range"><input type="hidden" name="page" value="' . esc_attr( self::SLUG ) . '">
				<input type="hidden" name="eile" value="' . esc_attr( $eile ) . '">
				<input type="hidden" name="data" value="intervalas">
				<input type="date" name="nuo" value="' . esc_attr( $f['nuo'] ) . '">
				<span>–</span><input type="date" name="iki" value="' . esc_attr( $f['iki'] ) . '">
				<button class="pd-btn">Rodyti</button></form>';
		}

		self::select( 'busena', array(
			''         => 'Būsena: visos',
			'nauji'    => 'Nauji',
			'paruosta' => 'Paruošta siųsti',
			'kelyje'   => 'Kelyje',
			'ivykdyti' => 'Įvykdyti',
			'atsaukti' => 'Atšaukti',
		), $f['busena'] );

		// Mokėjimas
		self::select( 'mokejimas', array(
			''           => 'Mokėjimas: visi',
			'apmoketa'   => 'Apmokėta',
			'neapmoketa' => 'Neapmokėta',
			'paysera'    => 'Paysera',
			'bacs'       => 'Pavedimas',
		), $f['mokejimas'] );

		// Laukiantys
		self::select( 'amzius', array(
			''   => 'Laukiantys: visi',
			'd2' => 'Laukia 2+ d.',
			'd3' => 'Laukia 3+ d.',
			'd5' => 'Laukia 5+ d.',
		), $f['amzius'] );

		$aktyvus = array_filter( array( $f['vykdymas'], $f['vezejas'], $f['data'], $f['busena'], $f['q'], $f['mokejimas'], $f['amzius'], $f['nr'], $f['klientas'], $f['tel'], $f['adresas'] ) );
		if ( $aktyvus ) {
			echo '<a class="pd-clear" href="' . esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&eile=' . $eile ) ) . '">Išvalyti filtrus</a>';
		}
		echo '</div>';

		/* ANTRA EILUTĖ — atskiri paieškos laukai (Raimio filtrai). */
		echo '<form method="get" class="pd-fields">';
		printf( '<input type="hidden" name="page" value="%s"><input type="hidden" name="eile" value="%s">',
			esc_attr( self::SLUG ), esc_attr( $eile ) );
		foreach ( array( 'vykdymas', 'vezejas', 'data', 'nuo', 'iki', 'busena', 'mokejimas', 'amzius' ) as $k ) {
			if ( '' !== $f[ $k ] ) { printf( '<input type="hidden" name="%s" value="%s">', esc_attr( $k ), esc_attr( $f[ $k ] ) ); }
		}
		printf( '<input type="text" name="nr" value="%s" placeholder="Užsak. Nr." size="9">', esc_attr( $f['nr'] ) );
		printf( '<input type="text" name="klientas" value="%s" placeholder="Klientas / el. paštas / įmonė" size="24">', esc_attr( $f['klientas'] ) );
		printf( '<input type="text" name="tel" value="%s" placeholder="Telefonas" size="12">', esc_attr( $f['tel'] ) );
		printf( '<input type="text" name="adresas" value="%s" placeholder="Adresas / miestas / pašto kodas" size="24">', esc_attr( $f['adresas'] ) );
		echo '<button class="pd-btn">Filtruoti</button></form>';

		if ( 'laukia' === $eile && class_exists( 'Petshop_AV_Tiekimas' ) ) {
			$sk = Petshop_AV_Tiekimas::laukianciu_skaiciai();
			printf( '<a class="pd-btn%s" href="%s">%s</a>',
				$sk['gali'] ? ' pd-btn-p' : '',
				esc_url( admin_url( 'admin.php?page=ps-tiekimas&b=laukia' ) ),
				$sk['gali']
					? esc_html( sprintf( 'Atnaujinti likučius · %d gali judėti', $sk['gali'] ) )
					: 'Atnaujinti likučius' );
		}
		echo '<div class="pd-bar-r"><span class="pd-count">' . esc_html( $kiek ) . ' ' .
			esc_html( self::linksnis( $kiek, 'užsakymas', 'užsakymai', 'užsakymų' ) ) . '</span>';
		if ( $kiek ) { echo '<button class="pd-btn" id="pdAll">Žymėti visus</button>'; }
		echo '</div></div>';
	}

	protected static function linksnis( $n, $v, $d, $g ) {
		$n = abs( (int) $n ); $p = $n % 100; $l = $n % 10;
		if ( 1 === $l && 11 !== $p ) { return $v; }
		if ( $l >= 2 && $l <= 9 && ( $p < 11 || $p > 19 ) ) { return $d; }
		return $g;
	}

	protected static function select( $vardas, $opcijos, $reiksme ) {
		echo '<select class="pd-sel" data-k="' . esc_attr( $vardas ) . '"' . ( $reiksme ? ' data-on="1"' : '' ) . '>';
		foreach ( $opcijos as $k => $v ) {
			printf( '<option value="%s"%s>%s</option>', esc_attr( $k ), selected( $k, $reiksme, false ), esc_html( $v ) );
		}
		echo '</select>';
	}

	/** Klausimai rodomi kortelėmis su sprendimo mygtukais, ne eilute sąraše. */
	/**
	 * Mišraus užsakymo sprendimas: kiekvienam sandėliui — kelias.
	 * Skaidymas PAGAL SANDĖLĮ (Raimio sprendimas H236): visa ZB dalis keliauja
	 * kartu. Jei kada prireiks eilutės tikslumo — struktūra tam pasiruošusi,
	 * nes žymė guli ant EILUTĖS (`_ps_konsolidacija`), ne ant užsakymo.
	 */
	/** Užsakymo svoris kilogramais (prekės × kiekis). */
	protected static function uzsakymo_svoris( $o ) {
		$kg = 0.0;
		foreach ( $o->get_items() as $it ) {
			$p = $it->get_product();
			if ( $p ) { $kg += (float) $p->get_weight() * (int) $it->get_quantity(); }
		}
		return $kg;
	}

	/** Grupės (sandėlio) bendras svoris — kurjerio iškvietimui (H237). */
	protected static function grupes_svoris( $ids ) {
		$kg = 0.0;
		$be = 0;
		foreach ( (array) $ids as $id ) {
			$o = wc_get_order( $id );
			if ( ! $o ) { continue; }
			$s = self::uzsakymo_svoris( $o );
			if ( $s <= 0 ) { $be++; }
			$kg += $s;
		}
		return array( $kg, $be );
	}

	/** „12,4 kg“ arba „—“. */
	protected static function kg( $kg ) {
		if ( $kg <= 0 ) { return '—'; }
		return rtrim( rtrim( number_format( $kg, 1, ',', ' ' ), '0' ), ',' ) . ' kg';
	}

	protected static function misrus_grupes( $o ) {
		$g = array();
		foreach ( $o->get_items() as $iid => $it ) {
			$src = self::eilutes_saltinis( $it );
			if ( ! $src ) { continue; }
			$p = $it->get_product();
			if ( ! isset( $g[ $src ] ) ) {
				$g[ $src ] = array( 'eilutes' => 0, 'vnt' => 0, 'svoris' => 0.0, 'pav' => array(), 'iid' => array() );
			}
			$g[ $src ]['eilutes']++;
			$g[ $src ]['vnt']   += (int) $it->get_quantity();
			$g[ $src ]['svoris'] += $p ? ( (float) $p->get_weight() * (int) $it->get_quantity() ) : 0;
			$g[ $src ]['pav'][]  = $it->get_quantity() . '× ' . $it->get_name();
			$g[ $src ]['iid'][]  = (int) $iid;
		}
		return $g;
	}

	/**
	 * Kurios „į AV“ eilutės pagal planą dar NĖRA tiekimo lentelėje.
	 * Tuščias masyvas = planas įvykdytas (arba jo nėra).
	 */
	protected static function kons_laukia( $o ) {
		$spr = self::misrus_sprendimas( $o );
		if ( ! $spr ) { return array(); }
		$liko = array();
		foreach ( $o->get_items() as $iid => $it ) {
			$src = self::eilutes_saltinis( $it );
			if ( ! $src || 'av' === $src || 'av' !== ( $spr[ $src ] ?? '' ) ) { continue; }
			if ( class_exists( 'Petshop_AV_Tiekimas' )
				&& Petshop_AV_Tiekimas::eilutes_bukle( $o->get_id(), (int) $iid ) ) { continue; }
			$liko[] = (int) $iid;
		}
		return $liko;
	}

	/** Įrašytas sprendimas: sandėlis => tiesiai|av. */
	protected static function misrus_sprendimas( $o ) {
		$m = $o->get_meta( '_ps_misrus_sprendimas' );
		$j = is_array( $m ) ? $m : json_decode( (string) $m, true );
		return is_array( $j ) ? $j : array();
	}

	protected static function misriu_korteles( $eilutes ) {
		/* Dvi sekcijos (H242): be sprendimo — sprendimo kortelė su radio;
		   su planu, bet nepaleista — paleidimo kortelė su mygtukais. */
		$spresti = array(); $paleisti = array();
		foreach ( $eilutes as $row ) {
			if ( self::misrus_sprendimas( $row['o'] ) ) { $paleisti[] = $row; } else { $spresti[] = $row; }
		}
		if ( $spresti ) { printf( '<h2 class="pd-msec">Reikia sprendimo (%d)</h2>', count( $spresti ) ); }
		echo '<div class="pd-mlist">';
		foreach ( $spresti as $row ) {
			$o   = $row['o'];
			$id  = $o->get_id();
			$g   = self::misrus_grupes( $o );
			$spr = self::misrus_sprendimas( $o );

			$sh = 0;
			foreach ( $o->get_items( 'shipping' ) as $x ) { $sh += (float) $x->get_total() + (float) $x->get_total_tax(); }

			printf( '<div class="pd-mcard" id="pd-m%d"><div class="pd-mh"><b>#%s</b><span class="pd-mkl">%s</span>%s<span class="pd-msuma">%s</span><span class="pd-mvez">%s</span></div>',
				$id,
				esc_html( $o->get_order_number() ),
				esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ),
				$o->is_paid() ? '<span class="pd-kpaid">apmokėta</span>' : '<span class="pd-kunpaid">neapmokėta</span>',
				wp_kses_post( $o->get_formatted_order_total() ),
				esc_html( self::vezejo_vardas( $o ) ) );

			printf( '<form method="get" action="%s" class="pd-mform">', esc_url( admin_url( 'admin-post.php' ) ) );
			echo '<input type="hidden" name="action" value="ps_desk_veiksmas"><input type="hidden" name="v" value="misrus">';
			printf( '<input type="hidden" name="id" value="%d"><input type="hidden" name="_wpnonce" value="%s">',
				$id, esc_attr( wp_create_nonce( 'ps_desk_misrus_' . $id ) ) );
			printf( '<input type="hidden" name="g" value="%s">',
				esc_attr( admin_url( 'admin.php?page=' . self::SLUG . '&eile=misrus' ) . '#pd-m' . $id ) );

			foreach ( $g as $src => $d ) {
				$vardas = self::SALTINIAI[ $src ][1] ?? mb_strtoupper( $src );
				$rz     = self::riba( $src );

				echo '<div class="pd-mrow">';
				printf( '<div class="pd-mleft">%s<b>%s</b></div>', self::zyme( $src ), esc_html( $vardas ) );

				printf( '<div class="pd-mprek">%s</div>', esc_html( implode( ' · ', $d['pav'] ) ) );

				printf( '<div class="pd-mkg">%s</div>', esc_html( self::kg( $d['svoris'] ) ) );

				printf( '<div class="pd-mriba">%s</div>',
					$rz ? sprintf( '<small class="pd-riba-%s">%s</small>', esc_attr( $rz[0] ), esc_html( $rz[1] ) ) : '' );

				if ( 'av' === $src ) {
					echo '<div class="pd-mopt"><span class="pd-mfix">savas sandėlis</span></div>';
				} else {
					$dabar = $spr[ $src ] ?? 'tiesiai';
					printf( '<div class="pd-mopt">
							<label class="pd-mchk"><input type="radio" name="s[%1$s]" value="tiesiai"%2$s><span>tiesiai klientui</span></label>
							<label class="pd-mchk"><input type="radio" name="s[%1$s]" value="av"%3$s><span>į AV</span></label>
						</div>',
						esc_attr( $src ),
						'av' === $dabar ? '' : ' checked',
						'av' === $dabar ? ' checked' : '' );
				}
				echo '</div>';
			}

			/* Suvestinėje TIK tai, kas žinoma: siuntų skaičius, svoris, kliento sumokėtas
			   pristatymas. Vežėjo kaštai — kai bus tarifų lentelė (H237). */
			printf( '<div class="pd-mf"><span class="pd-msum-t"></span><span class="pd-mpay">klientas už pristatymą sumokėjo %s</span><button type="submit" class="pd-btn pd-btn-p">Patvirtinti planą</button></div>',
				esc_html( number_format( $sh, 2, ',', ' ' ) . ' €' ) );

			echo '</form></div>';
		}
		echo '</div>';
		if ( $spresti ) {
			echo '<div class="pd-khint"><b>Planas nieko nepradeda.</b> Jei plane yra „į AV“ dalių — užsakymas lieka čia,
				skiltyje „Planas įrašytas“, kol paspausi „Į tiekimo partiją“. Jei viskas tiesiai klientui — grįžta į „Nauji“,
				perdavimą paleisi ten. Kol nepaleista, planą gali perrašyti „Keisti planą“.
				Kaip prekės atkeliaus į AV (paštomatu, kurjeriu ar tiekėjas atveš) — sprendžiama partijos lygmenyje.</div>';
		}

		if ( $paleisti ) {
			printf( '<h2 class="pd-msec">Planas įrašytas — nepaleista (%d)</h2>', count( $paleisti ) );
			echo '<div class="pd-mlist">';
			foreach ( $paleisti as $row ) {
				$o      = $row['o'];
				$id     = $o->get_id();
				$g      = self::misrus_grupes( $o );
				$spr    = self::misrus_sprendimas( $o );
				$laukia = self::kons_laukia( $o );
				$perd   = class_exists( 'Petshop_AV_Dropship' ) ? Petshop_AV_Dropship::perduotos( $o ) : array();

				printf( '<div class="pd-mcard" id="pd-m%d"><div class="pd-mh"><b>#%s</b><span class="pd-mkl">%s</span>%s<span class="pd-msuma">%s</span><span class="pd-mvez">%s</span></div>',
					$id,
					esc_html( $o->get_order_number() ),
					esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ),
					$o->is_paid() ? '<span class="pd-kpaid">apmokėta</span>' : '<span class="pd-kunpaid">neapmokėta</span>',
					wp_kses_post( $o->get_formatted_order_total() ),
					esc_html( self::vezejo_vardas( $o ) ) );

				foreach ( $g as $src => $d ) {
					$vardas = self::SALTINIAI[ $src ][1] ?? mb_strtoupper( $src );
					echo '<div class="pd-mrow">';
					printf( '<div class="pd-mleft">%s<b>%s</b></div>', self::zyme( $src ), esc_html( $vardas ) );
					printf( '<div class="pd-mprek">%s</div>', esc_html( implode( ' · ', $d['pav'] ) ) );
					printf( '<div class="pd-mkg">%s</div>', esc_html( self::kg( $d['svoris'] ) ) );

					if ( 'av' === $src ) {
						$bukle = '<span class="pd-mfix">savas sandėlis</span>';
					} elseif ( 'av' === ( $spr[ $src ] ?? '' ) ) {
						$liko  = (bool) array_intersect( $d['iid'], $laukia );
						$bukle = 'į AV · ' . ( $liko ? '<b class="pd-mng">nepaleista</b>' : '<span class="pd-mok">partijoje</span>' );
					} else {
						$bukle = 'tiesiai klientui · ' . ( isset( $perd[ $src ] )
							? '<span class="pd-mok">perduota ' . esc_html( mysql2date( 'm-d H:i', $perd[ $src ] ) ) . '</span>'
							: '<b class="pd-mng">neperduota</b>' );
					}
					echo '<div class="pd-mriba"></div><div class="pd-mopt pd-mbukle">' . wp_kses_post( $bukle ) . '</div></div>';
				}

				echo '<div class="pd-mf">';
				if ( $laukia ) {
					printf( '<a class="pd-btn pd-btn-p" href="%s">Į tiekimo partiją (%d)</a>',
						esc_url( self::veiksmo_url( 'kons', $id ) ), count( $laukia ) );
				}
				foreach ( $g as $src => $d ) {
					if ( 'av' === $src || 'av' === ( $spr[ $src ] ?? '' ) || isset( $perd[ $src ] ) ) { continue; }
					printf( '<a class="pd-btn" href="%s">Perduoti %s</a>',
						esc_url( self::veiksmo_url( 'perduoti', $id ) . '&src=' . rawurlencode( $src ) ),
						esc_html( self::SALTINIAI[ $src ][1] ?? mb_strtoupper( $src ) ) );
				}
				printf( '<a class="pd-btn pd-btn-s" href="%s">Keisti planą</a>', esc_url( self::veiksmo_url( 'misrus_keisti', $id ) ) );
				echo '</div></div>';
			}
			echo '</div>';
			echo '<div class="pd-khint">Užsakymas iš Mišrių išeis, kai „į AV“ dalys bus sudėtos į tiekimo partiją.
				„Perduoti X“ gali paleisti dabar arba palikti vėlesniam laikui — kad visos siuntos klientą pasiektų kartu.</div>';
		}
	}

	protected static function klausimu_korteles( $eilutes ) {
		foreach ( $eilutes as $row ) {
			$o      = $row['o'];
			$prob   = self::klausimo_eilutes( $o );
			$laukia = $o->get_meta( '_ps_klaus_laukti' );

			printf( '<div class="pd-kcard%s"><div class="pd-kh"><b>#%s</b><span>%s · %s</span>%s%s</div>',
				$laukia ? ' pd-kdim' : '',
				esc_html( $o->get_order_number() ),
				esc_html( trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ) ),
				wp_kses_post( $o->get_formatted_order_total() ),
				$o->is_paid() ? '<span class="pd-kpaid">apmokėta</span>' : '<span class="pd-kunpaid">neapmokėta</span>',
				$laukia ? '<span class="pd-kwait">laukiama nuo ' . esc_html( mysql2date( 'm-d', $laukia ) ) . '</span>' : '' );

			printf( '<div class="pd-kwhy">▲ %s</div>', esc_html( $row['klausimas'] ) );

			if ( 0 === strpos( $row['klausimas'], 'Klientas atsisako' ) ) {
				printf( '<div class="pd-kline"><div class="pd-kprek"><b>Gauta %s</b><span>%s</span></div><div class="pd-kbtns"><button type="button" class="pd-btn pd-btn-s" data-wc1="wcdn_print_creditnote" data-oid="%d">Kreditinė</button><span class="pd-knone">pinigai — rankinis grąžinimas (Paysera)</span></div></div>',
					esc_html( mysql2date( 'Y-m-d H:i', $o->get_meta( '_ps_withdrawal' ) ) ),
					esc_html( $o->get_meta( '_ps_withdrawal_reason' ) ?: 'priežastis nenurodyta' ),
					(int) $o->get_id() );
			}

			if ( $prob ) {
				foreach ( $prob as $p ) {
					printf( '<div class="pd-kline"><div class="pd-kprek"><b>%s</b><span>reikia %d · AV likutis %d%s</span></div><div class="pd-kbtns">',
						esc_html( $p['pav'] ), (int) $p['reikia'], (int) $p['turi'],
						$p['tiekv'] ? ' · ' . esc_html( $p['tiekv'] ) . ' turi' : '' );

					if ( $p['tiek'] ) {
						printf( '<a class="pd-btn pd-btn-p pd-btn-s" href="%s">Siųsti iš %s</a>',
							esc_url( self::veiksmo_url( 'klaus', $o->get_id() ) . '&t=siusti&iid=' . (int) $p['iid'] . '&src=' . rawurlencode( $p['tiek'] ) ),
							esc_html( self::SALTINIAI[ $p['tiek'] ][1] ?? mb_strtoupper( $p['tiek'] ) ) );
						printf( '<a class="pd-btn pd-btn-s" href="%s">Parsivežti į AV</a>',
							esc_url( self::veiksmo_url( 'klaus', $o->get_id() ) . '&t=parsivezti&iid=' . (int) $p['iid'] . '&src=' . rawurlencode( $p['tiek'] ) ) );
					} else {
						echo '<span class="pd-knone">tiekėjo, turinčio šią prekę, nėra</span>';
					}
					echo '</div></div>';
				}
			}

			echo '<div class="pd-kf">';
			if ( ! $laukia ) {
				printf( '<a class="pd-btn pd-btn-s" href="%s">Laukti</a>',
					esc_url( self::veiksmo_url( 'klaus', $o->get_id() ) . '&t=laukti' ) );
			}
			$vs = self::veiksmai( $o, $row );
			foreach ( $vs as $x ) {
				if ( 'atsaukti' !== $x['id'] ) { continue; }
				printf( '<a class="pd-btn pd-btn-s pd-btn-pav" href="%s"%s>%s</a>',
					esc_url( $x['url'] ),
					empty( $x['d'] ) ? '' : ' data-d="' . esc_attr( wp_json_encode( $x['d'] ) ) . '"',
					esc_html( $x['t'] ) );
			}
			printf( '<a class="pd-btn pd-btn-s" href="%s">WooCommerce</a>', esc_url( $o->get_edit_order_url() ) );
			echo '</div></div>';
		}
		echo '<div class="pd-khint">Kiekvienas mygtukas atlieka visą grandinę: pakeičia šaltinį, įrašo į istoriją
			ir grąžina užsakymą į darbo eilę. „Laukti“ nieko neprimena — pažymi ir tiek.</div>';
	}

	protected static function lentele( $eilutes, $statusai, $eile = '', $f = array() ) {
		if ( ! $eilutes ) {
			echo '<div class="pd-empty"><b>Nieko nėra</b><span>Šioje eilėje tuščia — arba viskas padaryta, arba filtrai per siauri.</span>
				<span class="pd-empty-map">Užsakymo kelias: <b>Nauji</b> → <b>Mišrūs</b> (jei keli sandėliai) → <b>Laukia prekių</b> (kai dalis eina per AV)
				→ <b>Paruošta siųsti</b> → <b>Išsiųsti</b>. Tiekėjų partijos, laiškai ir priėmimas — skiltyje <b>Tiekimas</b> kairėje apačioje.</span></div>';
			return;
		}
		echo '<div class="pd-wrap"><table class="pd-tbl"><thead><tr>
			<th class="pd-stripe"></th><th class="pd-cb"><input type="checkbox" id="pdAllCb"></th>
			<th>Užsakymas</th><th>Klientas</th><th>Ką pirko</th><th>Vykdymas</th>
			<th class="pd-r">Suma</th><th>Pristatymas</th><th>Būsena</th><th></th></tr></thead><tbody>';

		$i = 0;
		foreach ( $eilutes as $row ) {
			$o  = $row['o'];
			$id = $o->get_id();
			$st = $o->get_status();
			$sp = self::SPALVOS[ $st ] ?? array( '#F1F1EE', '#6B7269' );
			$juosta = self::juostos_spalva( $row );

			list( $vyk, $siuntu ) = self::vykdymas( $o );
			list( $kodas, $pak )  = self::siuntos_kodas( $o );
			$sal = self::saltiniai( $o );

			$pastaba = '';
			foreach ( $o->get_customer_note() ? array( $o->get_customer_note() ) : array() as $n ) { $pastaba = $n; }

			$vardas = trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() );
			if ( ! $vardas ) { $vardas = $o->get_billing_email() ? $o->get_billing_email() : '—'; }

			printf( '<tr data-i="%d" data-id="%d" data-json="%s">', $i, $id,
				esc_attr( wp_json_encode( self::skydelio_duomenys( $o, $row ) ) ) );

			echo '<td class="pd-stripe"><div style="background:' . esc_attr( $juosta ) . '"></div></td>';
			echo '<td class="pd-cb"><input type="checkbox" class="pd-row-cb" value="' . esc_attr( $id ) . '"></td>';

			// Eilės ženklas (H249): „Visi užsakymai" ir paieškoje — kad matytum, kur kabo.
			$ez = '';
			if ( 'visi' === $eile || ! empty( $f['nr'] ) || ! empty( $f['klientas'] )
				|| ! empty( $f['telefonas'] ) || ! empty( $f['adresas'] ) ) {
				$ek = $row['klausimas'] ? 'klausimai' : $row['eile'];
				if ( isset( self::EILES[ $ek ] ) ) {
					$ez = sprintf( '<a class="pd-ez" style="--ez:%s" href="%s">%s</a>',
						esc_attr( self::EILES[ $ek ][2] ),
						esc_url( self::url( array( 'eile' => $ek ) ) ),
						esc_html( self::EILES[ $ek ][0] ) );
				}
			}
			printf( '<td><div class="pd-nr">#%s</div><div class="pd-sub">%s</div>%s</td>',
				esc_html( $o->get_order_number() ),
				esc_html( self::laikas( $o->get_date_created() ) ),
				$ez ); // phpcs:ignore WordPress.Security.EscapeOutput

			printf( '<td><div class="pd-cust" title="%s">%s</div><div class="pd-sub">%s</div></td>',
				esc_attr( $vardas . ( $o->get_billing_email() ? ' · ' . $o->get_billing_email() : '' ) ),
				esc_html( $vardas ),
				esc_html( $o->get_billing_city() ? $o->get_billing_city() : '—' ) );

			echo '<td><div class="pd-items">';
			// PREKĖS — PILNAIS pavadinimais su miniatiūromis. Pakuotojui tai darbo
			// objektas: „Gemon mini adult 3 kg" ir „…15 kg" turi skirtis iš pirmo žvilgsnio.
			foreach ( $o->get_items() as $it ) {
				$p   = $it->get_product();
				$img = $p ? get_the_post_thumbnail_url( $p->get_id(), 'thumbnail' ) : '';
				$ls  = self::eilutes_saltinis( $it );
				echo '<div class="pd-item">'
					. ( $img ? '<img class="pd-thumb" loading="lazy" src="' . esc_url( $img ) . '" alt="">' : '<span class="pd-thumb pd-thumb-e"></span>' )
					. ( $ls ? self::zyme( $ls ) : '' )
					. '<span>' . esc_html( $it->get_quantity() . '× ' . $it->get_name() ) . '</span></div>';
			}
			echo '</div>';
			if ( $row['klausimas'] ) { echo '<div class="pd-note pd-red">▲ ' . esc_html( $row['klausimas'] ) . '</div>'; }
			// KLIENTO PASTABA — PILNA, nekarpoma. Raimis: „kartais labai svarbu".
			if ( $pastaba ) { echo '<div class="pd-note pd-cnote">✎ ' . esc_html( $pastaba ) . '</div>'; }
			echo '</td>';

			echo '<td><div class="pd-exec">' . esc_html( $vyk ? $vyk : '—' );
			if ( 'MIŠRUS' === $vyk ) { echo '<small>' . esc_html( $siuntu ) . ' siuntos</small>'; }
			// Planas matomas sąraše, kad nereikėtų atidarinėti (H239).
			$spr_z = self::misrus_sprendimas( $o );
			if ( $spr_z ) {
				$dal = array();
				foreach ( $spr_z as $t => $k ) {
					$dal[] = ( self::SALTINIAI[ $t ][1] ?? mb_strtoupper( $t ) ) . '→' . ( 'av' === $k ? 'AV' : 'klientui' );
				}
				printf( '<small class="pd-planas">planas: %s%s</small>',
					esc_html( implode( ' · ', $dal ) ),
					self::kons_laukia( $o ) ? ' <b>· nepaleista</b>' : '' );
			}
			// BŪSENOS CHIP'AI (H243): perdavimo būklė pagal sandėlį — matoma be atidarymo.
			$sal_ds = array_diff( $sal, array( 'av' ) );
			if ( $sal_ds && in_array( $row['eile'], array( 'nauji', 'misrus', 'laukia' ), true ) ) {
				$perd2 = class_exists( 'Petshop_AV_Dropship' ) ? Petshop_AV_Dropship::perduotos( $o ) : array();
				$spr2  = self::misrus_sprendimas( $o );
				echo '<span class="pd-chips">';
				foreach ( $sal_ds as $ts2 ) {
					$v2 = self::SALTINIAI[ $ts2 ][1] ?? mb_strtoupper( $ts2 );
					if ( isset( $perd2[ $ts2 ] ) ) {
						printf( '<span class="pd-chip pd-chip-ok">%s ✓ %s</span>',
							esc_html( $v2 ), esc_html( mysql2date( 'H:i', $perd2[ $ts2 ] ) ) );
					} elseif ( 'av' === ( $spr2[ $ts2 ] ?? '' ) ) {
						printf( '<span class="pd-chip pd-chip-av">%s→AV</span>', esc_html( $v2 ) );
					} else {
						printf( '<span class="pd-chip pd-chip-w">%s ⏳</span>', esc_html( $v2 ) );
					}
				}
				echo '</span>';
			}
			// riba rodoma tik ten, kur darbas dar nepadarytas
			// riba prasminga tik ŠIANDIENOS užsakymui — senam „keliaus rytoj" jau 17-a diena būtų melas
			if ( 'nauji' === $row['eile'] && $o->get_date_created()
				&& wp_date( 'Y-m-d', $o->get_date_created()->getTimestamp() ) === wp_date( 'Y-m-d' ) ) {
				foreach ( $sal as $ts ) {
					if ( 'av' !== $ts && class_exists( 'Petshop_AV_Dropship' )
						&& Petshop_AV_Dropship::perduota( $o, $ts ) ) { continue; }
					$rz = self::riba( $ts );
					if ( $rz ) { printf( '<small class="pd-riba-%s">%s %s</small>',
						esc_attr( $rz[0] ), esc_html( self::SALTINIAI[ $ts ][1] ?? $ts ), esc_html( $rz[1] ) ); }
				}
			}
			echo '</div></td>';

			printf( '<td class="pd-sum pd-r">%s<span class="pd-pay %s">%s</span></td>',
				wp_kses_post( $o->get_formatted_order_total() ),
				$o->is_paid() ? 'ok' : 'no',
				$o->is_paid() ? 'apmokėta' : 'neapmokėta' );

			echo '<td class="pd-ship"><b>' . esc_html( self::vezejo_vardas( $o ) ) . '</b>';
			if ( $kodas ) {
				echo '<span class="pd-track">' . esc_html( $kodas ) . ( $pak > 1 ? ' · ' . $pak . ' lipdukai' : '' ) . '</span>';
			}
			echo '</td>';

			$amz = '';
			$skd = $o->get_date_created();
			if ( $skd && ( in_array( $row['eile'], array( 'nauji', 'neapmoketi', 'laukia' ), true ) || $row['klausimas'] ) ) {
				$dienu = (int) floor( ( time() - $skd->getTimestamp() ) / DAY_IN_SECONDS );
				if ( 1 === $dienu ) { $amz = '<span class="pd-age">nuo vakar</span>'; }
				elseif ( $dienu >= 2 ) {
					$amz = '<span class="pd-age ' . ( $dienu >= 5 ? 'pd-age-r' : 'pd-age-w' ) . '">laukia ' . $dienu . ' d.</span>';
				}
			}
			printf( '<td><span class="pd-pill" style="background:%s;color:%s">%s</span>%s</td>',
				esc_attr( $sp[0] ), esc_attr( $sp[1] ),
				esc_html( $statusai[ 'wc-' . $st ] ?? $st ), $amz );

			echo '<td class="pd-act">';
			self::veiksmas( $o, $row );
			echo '</td></tr>';
			$i++;
		}
		echo '</tbody></table></div>';
	}

	/** Kairės briaunos spalva pagal eilę. */
	protected static function juostos_spalva( $row ) {
		if ( ! empty( $row['klausimas'] ) ) { return self::EILES['klausimai'][2]; }
		$e = isset( $row['eile'] ) ? $row['eile'] : '';
		if ( isset( self::EILES[ $e ] ) ) { return self::EILES[ $e ][2]; }
		return '#9AA39C';
	}

	protected static function vezejo_vardas( $o ) {
		$v = self::vezejas( $o );
		$m = array(
			'venipak_kurjeris'   => 'Venipak kurjeris',
			'venipak_pastomatas' => 'Venipak paštomatas',
			'lp'                 => 'LP Express',
		);
		return $m[ $v ] ?? ( $o->get_shipping_method() ? $o->get_shipping_method() : '—' );
	}

	/** Vienas kitas veiksmas pagal eilę. */
	protected static function veiksmas( $o, $row ) {
		$vs = self::veiksmai( $o, $row );
		$p  = $vs[0];
		if ( $p['url'] ) {
			printf( '<a class="pd-btn pd-btn-p pd-btn-s" href="%s"%s>%s</a>',
				esc_url( $p['url'] ),
				empty( $p['d'] ) ? '' : ' data-d="' . esc_attr( wp_json_encode( $p['d'] ) ) . '"',
				esc_html( $p['t'] ) );
		} elseif ( ! empty( $p['wc'] ) ) {
			printf( '<button class="pd-btn pd-btn-p pd-btn-s" data-wc1="%s" data-oid="%d">%s</button>',
				esc_attr( $p['wc'] ), (int) $o->get_id(), esc_html( $p['t'] ) );
		} else {
			printf( '<button class="pd-btn pd-btn-p pd-btn-s" data-act="%s">%s</button>',
				esc_attr( $p['id'] ), esc_html( $p['t'] ) );
		}
		printf( '<a class="pd-more" href="%s" title="Atidaryti WooCommerce">⋯</a>',
			esc_url( $o->get_edit_order_url() ) );
	}

	protected static function laikas( $d ) {
		if ( ! $d ) { return '—'; }
		$ts  = $d->getTimestamp();
		$now = current_time( 'timestamp' );
		$td  = wp_date( 'Y-m-d', $now );
		$dd  = wp_date( 'Y-m-d', $ts );
		if ( $dd === $td ) { return 'šiandien ' . wp_date( 'H:i', $ts ); }
		if ( $dd === wp_date( 'Y-m-d', $now - DAY_IN_SECONDS ) ) { return 'vakar ' . wp_date( 'H:i', $ts ); }
		return wp_date( 'm-d H:i', $ts );
	}

	/** Duomenys skydeliui — įdedami į eilutę, kad nereikėtų AJAX. */
	protected static function skydelio_duomenys( $o, $row ) {
		$items = array();
		foreach ( $o->get_items() as $iid => $it ) {
			$pid = $it->get_product_id();
			$s   = self::eilutes_saltinis( $it );
			$inf = '';
			if ( 'av' === $s && $pid ) {
				$sp  = self::sprendimas( $pid, $it->get_quantity() );
				$inf = 'AV likutis ' . ( isset( $sp['av_qty'] ) ? (int) $sp['av_qty'] : 0 );
				if ( class_exists( 'Petshop_AV_Expiry' ) ) {
					$dt = Petshop_AV_Expiry::data( $pid );
					if ( $dt ) { $inf .= ' · galioja ' . $dt; }
					$pb = Petshop_AV_Expiry::pastaba( $pid );
					if ( $pb ) { $inf .= ' · ✎ ' . $pb; }
				}
			} elseif ( $s ) {
				$inf = self::SALTINIAI[ $s ][2] ?? $s;
				$inf = 'dropship — ' . $inf;
			}
			// Tiekimo mygtukas — tik tiekėjo eilutėms mišriame ar dropship užsakyme
			$tiek = null;
			if ( $s && 'av' !== $s && class_exists( 'Petshop_AV_Tiekimas' ) ) {
				$b = Petshop_AV_Tiekimas::eilutes_bukle( $o->get_id(), $iid );
				if ( $b ) {
					$tiek = array(
						'yra'    => 1,
						'busena' => $b->busena,
						'tekstas'=> 'gauta' === $b->busena
							? 'gauta iš partijos #' . (int) $b->partija_id
							: ( 'uzsakyta' === $b->busena
								? 'užsakyta · partija #' . (int) $b->partija_id
								: 'tiekimo lentelėje · partija #' . (int) $b->partija_id ),
						'url'    => 'kaupiama' === $b->busena
							? Petshop_AV_Tiekimas::eilutes_url( $o->get_id(), $iid, 'istrinti', self::url() ) : '',
						'mygtukas' => 'Išimti',
					);
				} else {
					$tiek = array(
						'yra'      => 0,
						'url'      => Petshop_AV_Tiekimas::eilutes_url( $o->get_id(), $iid, 'ideti', self::url() ),
						'mygtukas' => 'Į tiekimo lentelę',
						'tekstas'  => '',
					);
				}
			}

			$items[] = array(
				'q' => $it->get_quantity(),
				'n' => $it->get_name(),
				's' => $s,
				'i' => $inf,
				'p' => strip_tags( wc_price( $it->get_total() ) ),
				'tiek' => $tiek,
			);
		}
		list( $kodas, $pak ) = self::siuntos_kodas( $o );
		$adr = $o->get_formatted_shipping_address();
		if ( ! $adr ) { $adr = $o->get_formatted_billing_address(); }

		$uzs = 0; $pries = '';
		$mail = $o->get_billing_email();
		if ( $mail ) {
			global $wpdb;
			$uzs = (int) $wpdb->get_var( $wpdb->prepare(
				"SELECT COUNT(*) FROM {$wpdb->prefix}wc_orders
				 WHERE type='shop_order' AND billing_email=%s
				   AND status IN ('wc-processing','wc-completed','wc-lp-delivered','wc-lp-on-the-way')",
				$mail ) );
			$pries = (string) $wpdb->get_var( $wpdb->prepare(
				"SELECT date_created_gmt FROM {$wpdb->prefix}wc_orders
				 WHERE type='shop_order' AND billing_email=%s AND id<>%d
				   AND status IN ('wc-processing','wc-completed','wc-lp-delivered','wc-lp-on-the-way')
				 ORDER BY id DESC LIMIT 1",
				$mail, $o->get_id() ) );
			if ( $pries ) { $pries = wp_date( 'Y-m-d', strtotime( $pries . ' UTC' ) ); }
		}

		return array(
			'id'      => $o->get_id(),
			'nr'      => $o->get_order_number(),
			'st'      => wc_get_order_statuses()[ 'wc-' . $o->get_status() ] ?? $o->get_status(),
			'laikas'  => wp_date( 'Y-m-d H:i', $o->get_date_created() ? $o->get_date_created()->getTimestamp() : 0 ),
			'mok'     => $o->get_payment_method_title(),
			'apmok'   => $o->is_paid() ? 1 : 0,
			'saskaita'=> $o->get_meta( '_petshop_avpn_number' ) ? $o->get_meta( '_petshop_avpn_number' ) : $o->get_meta( '_wcdn_invoice_number' ),
			'vardas'  => trim( $o->get_billing_first_name() . ' ' . $o->get_billing_last_name() ),
			'tel'     => $o->get_billing_phone(),
			'mail'    => $o->get_billing_email(),
			'adresas' => wp_strip_all_tags( str_replace( '<br/>', ', ', $adr ) ),
			'items'   => $items,
			'suma'    => strip_tags( $o->get_formatted_order_total() ),
			'siunta'  => strip_tags( $o->get_shipping_total() > 0 ? wc_price( $o->get_shipping_total() ) : 'nemokamas' ),
			'vezejas' => self::vezejo_vardas( $o ),
			'vieta'   => $o->get_meta( 'venipak_pickup_point' ),
			'kodas'   => $kodas,
			'pak'     => $pak,
			'vykdymas'=> self::vykdymas( $o )[0],
			'pastaba' => $o->get_customer_note(),
			'klausimas' => $row['klausimas'],
			'uzsakymu'=> $uzs,
			'pries'   => $pries,
			'veiksmai'=> self::veiksmai( $o, $row ),
			'pak'     => self::reikia_pakuociu( $o ) ? array(
				'kiek' => self::pakuociu( $o ),
				'url'  => self::veiksmo_url( 'pakuotes', $o->get_id() ),
				'lp'   => ( 'lp' === self::vezejas( $o ) ) ? 1 : 0,
			) : null,
			'lp_info' => ( 'lp' === self::vezejas( $o ) ) ? self::lp_svoris( $o ) : null,
			'edit'    => $o->get_edit_order_url(),
		);
	}

	protected static function skydelis() {
		?>
		<aside class="pd-peek" id="pdPeek" aria-hidden="true">
			<div class="pd-peek-h">
				<div class="pd-peek-r1"><h2 id="pkNr"></h2><span class="pd-pill" id="pkSt"></span>
				<button class="pd-x" id="pkX" aria-label="Uždaryti">✕</button></div>
				<div class="pd-sub" id="pkSub"></div>
			</div>
			<div class="pd-peek-b" id="pkBody"></div>
			<div class="pd-peek-f">
				<span id="pkActs"></span>
				<a class="pd-btn" id="pkEdit" href="#">WooCommerce</a>
			</div>
		</aside>
		<?php
	}

	protected static function dialogas() {
		?>
		<div class="pd-dscrim" id="pdDScrim"></div>
		<div class="pd-dlg" id="pdDlg" role="dialog" aria-modal="true">
			<h3 id="pdDlgA"></h3>
			<p id="pdDlgT"></p>
			<label class="pd-dopt" id="pdDlgOptW"><input type="checkbox" id="pdDlgOpt"><span id="pdDlgOptT"></span></label>
			<div class="pd-dlg-f">
				<button class="pd-btn" id="pdDlgNo">Atsisakyti</button>
				<button class="pd-btn pd-btn-p" id="pdDlgYes">Patvirtinti</button>
			</div>
		</div>
		<?php
	}

	protected static function bulk() {
		?>
		<div class="pd-bulk" id="pdBulk">
			<span class="pd-bcnt" id="pdBcnt">Pažymėta 0</span>
			<button class="pd-btn" data-ba="<?php echo esc_attr( self::veiksmo_url( 'lapai', 0 ) ); ?>">Surinkimo lapai</button>
			<button class="pd-btn" data-ba="<?php echo esc_attr( self::veiksmo_url( 'perduoti', 0 ) ); ?>">Perduoti tiekėjams</button>
			<span class="pd-bsep"></span>
			<button class="pd-btn" data-ba="<?php echo esc_attr( self::veiksmo_url( 'vp_bulk', 0 ) ); ?>">Venipak registruoti</button>
			<button class="pd-btn" data-wc="shopup_venipak_shipping_labels">Venipak lipdukai</button>
			<span class="pd-bsep"></span>
			<button class="pd-btn" data-wc="woo_lp_print_label">LP lipdukai</button>
			<button class="pd-btn" data-wc="woo_lp_print_manifest">LP kurjeris + manifestas</button>
			<span class="pd-bsep"></span>
			<button class="pd-btn" data-wc="wcdn_print_invoice">Sąskaitos</button>
			<button type="button" class="pd-btn" id="pdClr">Atžymėti</button>
		</div>
		<?php
		self::wc_forma();
	}

	/** Paslėpta forma WooCommerce masiniams veiksmams (lipdukai, sąskaitos). */
	protected static function wc_forma() {
		?>
		<form id="pdWcForm" method="post" style="display:none"
			action="<?php echo esc_url( admin_url( 'admin.php?page=wc-orders' ) ); ?>">
			<?php wp_nonce_field( 'bulk-orders' ); ?>
			<input type="hidden" name="action" id="pdWcAction" value="">
			<input type="hidden" name="action2" value="-1">
			<div id="pdWcIds"></div>
		</form>
		<?php
	}

	/* ============================ STILIUS ============================ */

	protected static function stilius() {
		?>
<style>
.pd{--paper:#FAFAF8;--card:#fff;--rail:#1C2320;--rail2:#28312C;--rink:#C8D0C9;--rdim:#7E8A82;
 --ink:#1A1D1B;--ink2:#5E6661;--ink3:#8A918C;--line:#E4E4DE;--line2:#EFEFEA;
 --green:#2D5F3F;--greend:#234B32;--greent:#E9F1EA;--red:#98262A;--r:6px;--row:38px;
 position:fixed;top:32px;left:0;right:0;bottom:0;display:flex;flex-direction:column;
 background:var(--paper);color:var(--ink);font-family:"IBM Plex Sans",-apple-system,"Segoe UI",Roboto,sans-serif;
 font-size:14.5px;line-height:1.45;-webkit-font-smoothing:antialiased}
.pd *{box-sizing:border-box}
.pd button,.pd input,.pd select{font:inherit}
.pd :focus-visible{outline:2px solid var(--green);outline-offset:2px}

.pd-top{height:44px;background:var(--rail);display:flex;align-items:center;gap:14px;padding:0 12px 0 14px;color:var(--rink);flex:0 0 44px}
.pd-brand{font-weight:600;font-size:13px;color:#fff;white-space:nowrap}
.pd-brand span{color:var(--rdim);font-weight:400}
.pd-search{flex:0 1 400px;display:flex;align-items:center;gap:8px;height:28px;padding:0 10px;
 background:var(--rail2);border:1px solid #37413B;border-radius:var(--r);color:var(--rdim)}
.pd-search input[type=search]{flex:1;background:none;border:0;color:#fff;font-size:12.5px;outline:none;min-width:0}
.pd-search input::placeholder{color:var(--rdim)}
.pd kbd{font-family:"IBM Plex Mono",monospace;font-size:10.5px;padding:1px 5px;border-radius:4px;
 background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.14);color:var(--rink)}
.pd-top-r{margin-left:auto;display:flex;align-items:center;gap:12px;font-size:12px;color:var(--rdim)}
.pd-av b{color:#fff;font-weight:500}
.pd-tbtn{height:28px;padding:0 11px;border:1px solid #37413B;background:var(--rail2);border-radius:var(--r);
 color:var(--rink);font-size:12px;display:inline-flex;align-items:center;text-decoration:none}
.pd-tbtn:hover{border-color:#4A554E;color:#fff}
.pd-go{background:var(--green);border-color:var(--green);color:#fff;font-weight:500}
.pd-go:hover{background:#357049;border-color:#357049;color:#fff}

.pd-body{flex:1;display:grid;grid-template-columns:216px minmax(0,1fr);min-height:0}
.pd-rail{background:var(--rail);display:flex;flex-direction:column;overflow:auto}
.pd-rh{padding:13px 14px 5px;font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--rdim)}
.pd-q{display:grid;grid-template-columns:3px 1fr auto;align-items:center;gap:10px;padding-right:12px;height:33px;
 color:var(--rink);font-size:13px;text-decoration:none}
.pd-q i{display:block;height:18px;border-radius:0 2px 2px 0;background:transparent}
.pd-q:hover{background:rgba(255,255,255,.05);color:var(--rink)}
.pd-q.on{background:rgba(255,255,255,.09);color:#fff;font-weight:500}
.pd-q.on i{background:var(--qc,#fff)}
.pd-q.dim{color:var(--rdim)}
.pd-n{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--rdim)}
.pd-q.on .pd-n{color:#fff}
.pd-n.hot{background:var(--qc);color:#101512;padding:1px 6px;border-radius:9px;font-weight:600}
.pd-sep{height:1px;background:rgba(255,255,255,.09);margin:9px 12px}
.pd-ai{margin-top:auto;padding:12px;border-top:1px solid rgba(255,255,255,.09)}
.pd-ai-h{display:flex;align-items:center;gap:7px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--rdim);margin-bottom:7px}
.pd-dot{width:6px;height:6px;border-radius:50%;background:#4C5A52}
.pd-ai-t{font-size:11.5px;line-height:1.5;color:var(--rdim)}

.pd-main{display:flex;flex-direction:column;min-width:0;overflow:hidden}
.pd-bar{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid var(--line);flex-wrap:wrap;flex:0 0 auto}
.pd-h1{font-size:15px;font-weight:600;letter-spacing:-.01em}
.pd-h1 em{font-style:normal;color:var(--ink3);font-weight:400;margin-left:8px;font-size:12.5px}
.pd-filters{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-left:6px}
.pd-sel{height:28px;border:1px solid var(--line);background:var(--card);border-radius:var(--r);
 font-size:12.5px;color:var(--ink2);padding:0 6px;cursor:pointer;max-width:210px}
.pd-sel[data-on="1"]{background:var(--ink);border-color:var(--ink);color:#fff}
.pd-sel option{background:#fff;color:#1C201D}
.pd-range{display:flex;gap:5px;align-items:center;font-size:12px;color:var(--ink3)}
.pd-range input{height:28px;border:1px solid var(--line);border-radius:var(--r);padding:0 7px;font-size:12.5px}
.pd-clear{font-size:12px;color:var(--ink3);text-decoration:underline}
.pd-bar-r{margin-left:auto;display:flex;gap:10px;align-items:center}
.pd-count{font-size:12px;color:var(--ink3)}
.pd-btn{height:28px;padding:0 11px;border:1px solid var(--line);background:var(--card);border-radius:var(--r);
 font-size:12.5px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;color:var(--ink2);
 white-space:nowrap;text-decoration:none}
.pd-btn:hover{border-color:#CFCFC7;color:var(--ink)}
.pd-btn-p{background:var(--green);border-color:var(--green);color:#fff;font-weight:500}
.pd-btn-p:hover{background:var(--greend);border-color:var(--greend);color:#fff}
.pd-btn-s{height:25px;padding:0 9px;font-size:12px}

.pd-fields{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:6px 18px 8px;border-bottom:1px solid var(--line2)}
.pd-fields input[type=text]{height:26px;padding:0 8px;border:1px solid var(--line);border-radius:var(--r);font-size:12.5px;background:var(--card)}
.pd-wrap{flex:1;overflow:auto;padding-bottom:80px}
.pd-tbl{width:100%;border-collapse:collapse}
.pd-tbl thead th{position:sticky;top:0;z-index:2;background:var(--paper);text-align:left;
 font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--ink3);font-weight:500;
 padding:7px 10px;border-bottom:1px solid var(--line);white-space:nowrap}
.pd-tbl th.pd-r,.pd-tbl td.pd-r{text-align:right}
.pd-tbl tbody tr{border-bottom:1px solid var(--line2);min-height:var(--row);cursor:pointer}
.pd-tbl tbody tr:hover{background:#F4F4F0}
.pd-tbl tbody tr.sel{background:var(--greent)}
.pd-tbl tbody tr.cur{box-shadow:inset 2px 0 0 var(--ink),inset -2px 0 0 var(--ink)}
.pd-tbl td{padding:4px 8px;vertical-align:middle}
td.pd-stripe,th.pd-stripe{width:3px;padding:0;height:inherit}
td.pd-stripe div{width:3px;height:100%;min-height:var(--row)}
td.pd-cb,th.pd-cb{width:30px;padding-left:8px}
.pd input[type=checkbox]{width:14px;height:14px;accent-color:var(--green);cursor:pointer;margin:0}
.pd-nr{font-size:13px;font-weight:600;font-family:"IBM Plex Mono",monospace}
.pd-sub{font-size:11.5px;color:var(--ink3);margin-top:1px}
.pd-cust{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:170px}
.pd-items{font-size:12.5px;color:var(--ink2);max-width:420px;white-space:normal}
.pd-item{display:flex;align-items:center;gap:6px;padding:1px 0;line-height:1.3}
.pd-thumb{width:26px;height:26px;object-fit:cover;border-radius:4px;flex:none;border:1px solid var(--line2);background:#fff}
.pd-thumb-e{display:inline-block}
.pd-age{display:block;font-size:11px;margin-top:2px;color:var(--ink3)}
.pd-age-w{color:#96660C;font-weight:600}
.pd-age-r{color:var(--red);font-weight:600}
.pd-src{display:inline-flex;align-items:center;height:16px;padding:0 5px;border-radius:3px;
 font-family:"IBM Plex Mono",monospace;font-size:10px;font-weight:600;margin-right:3px}
.pd-exec{font-size:12.5px;font-weight:600}
.pd-exec small{display:block;font-weight:400;color:var(--ink3)}
.pd-sum{font-size:13.5px;font-weight:600;white-space:nowrap;font-family:"IBM Plex Mono",monospace}
.pd-pay{display:block;font-size:11px;font-weight:400;margin-top:1px;font-family:"IBM Plex Sans",sans-serif}
.pd-pay.ok{color:var(--green)}.pd-pay.no{color:#96660C}
.pd-ship{font-size:13px;color:var(--ink2);white-space:nowrap}
.pd-ship b{display:block;font-weight:500;color:var(--ink)}
.pd-track{font-size:11.5px;color:var(--ink3);font-family:"IBM Plex Mono",monospace}
.pd-pill{display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:99px;
 font-size:12.5px;font-weight:500;white-space:nowrap}
td.pd-act{text-align:right;white-space:nowrap;width:1%}
.pd-more{display:inline-grid;place-items:center;width:26px;height:26px;border:1px solid transparent;
 border-radius:var(--r);color:var(--ink3);text-decoration:none;margin-left:4px}
.pd-more:hover{border-color:var(--line);color:var(--ink)}
.pd-note{font-size:12.5px;color:#96660C;margin-top:3px;white-space:normal;max-width:340px;line-height:1.35}
.pd-note.pd-red{color:var(--red);font-weight:500}
.pd-note.pd-cnote{background:#FBF2DE;border-left:2px solid #96660C;padding:3px 8px;border-radius:0 4px 4px 0;display:inline-block}
.pd-tbl tbody tr:has(.pd-cnote){height:auto}
.pd-cbox{background:#FBF2DE;border:1px solid #E7D7AE;border-left:3px solid #96660C;padding:9px 11px;
 font-size:13px;color:#6B4A08;border-radius:0 6px 6px 0;margin-bottom:12px;line-height:1.45}
.pd-cbox b{display:block;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px;color:#96660C}
.pd-dscrim{position:fixed;inset:0;background:rgba(22,26,23,.42);opacity:0;pointer-events:none;transition:.12s;z-index:200}
.pd-dscrim.on{opacity:1;pointer-events:auto}
.pd-dlg{position:fixed;top:50%;left:50%;transform:translate(-50%,-48%) scale(.98);width:min(430px,92vw);
 background:var(--card);border-radius:12px;box-shadow:0 22px 60px rgba(20,24,21,.32);padding:20px 22px 16px;
 opacity:0;pointer-events:none;transition:.12s;z-index:201}
.pd-dlg.on{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}
.pd-dlg h3{margin:0 0 8px;font-size:16px;font-weight:600;font-family:"IBM Plex Mono",monospace}
.pd-dlg p{margin:0 0 14px;font-size:13.5px;color:var(--ink2);line-height:1.5}
.pd-dopt{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--ink);cursor:pointer;
 background:#F4F4F0;border:1px solid var(--line);border-radius:var(--r);padding:9px 11px;margin-bottom:14px}
.pd-dopt input{margin-top:2px}
.pd-dlg-f{display:flex;gap:8px;justify-content:flex-end}
.pd-dlg-f .pd-btn{height:32px;padding:0 14px}
.pd-btn-pav{color:var(--red);border-color:#EAD2D2}
.pd-btn-pav:hover{background:#FAECEC;color:var(--red);border-color:#DDB6B6}
.pd-msg{display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13.5px;border-bottom:1px solid var(--line)}
.pd-msg-ok{background:var(--greent);color:var(--green)}
.pd-msg-info{background:#F1F1EE;color:var(--ink2)}
.pd-msg-klaida{background:#FAECEC;color:var(--red);font-weight:500}
.pd-msg-x{margin-left:auto;border:0;background:none;cursor:pointer;color:inherit;font-size:14px;opacity:.6}
.pd-msg-x:hover{opacity:1}
.pd-empty{padding:60px 20px;text-align:center;color:var(--ink3)}
.pd-empty b{display:block;font-size:15px;color:var(--ink);margin-bottom:4px}

.pd-bulk{position:fixed;left:50%;bottom:20px;transform:translate(-50%,90px);opacity:0;pointer-events:none;
 display:flex;align-items:center;gap:8px;padding:9px 10px 9px 16px;background:var(--ink);color:#fff;
 border-radius:10px;box-shadow:0 10px 34px rgba(20,24,21,.28);transition:.16s;z-index:120;flex-wrap:wrap;max-width:94vw}
.pd-bulk.on{transform:translate(-50%,0);opacity:1;pointer-events:auto}
.pd-bcnt{font-size:12.5px;color:#CFD6D0;margin-right:4px}
.pd-bsep{width:1px;height:18px;background:rgba(255,255,255,.18)}
.pd-bulk .pd-btn{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.16);color:#fff}
.pd-bulk .pd-btn:hover{background:rgba(255,255,255,.2);color:#fff}

.pd-peek{position:fixed;top:76px;right:0;bottom:0;width:452px;background:var(--card);
 border-left:1px solid var(--line);box-shadow:-12px 0 34px rgba(20,24,21,.08);
 transform:translateX(100%);transition:.16s;display:flex;flex-direction:column;z-index:110}
.pd-peek.on{transform:none}
.pd-peek-h{padding:14px 16px 12px;border-bottom:1px solid var(--line)}
.pd-peek-r1{display:flex;align-items:center;gap:10px}
.pd-peek-r1 h2{margin:0;font-size:17px;font-weight:600;font-family:"IBM Plex Mono",monospace}
.pd-x{margin-left:auto;width:26px;height:26px;border:1px solid var(--line);background:none;
 border-radius:var(--r);cursor:pointer;color:var(--ink3)}
.pd-peek-b{flex:1;overflow:auto;padding:14px 16px 20px}
.pd-sec{margin-bottom:16px}
.pd-sec h3{margin:0 0 7px;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3);font-weight:500}
.pd-kv{display:grid;grid-template-columns:98px 1fr;gap:3px 10px;font-size:13px;margin:0}
.pd-kv dt{color:var(--ink3)}
.pd-kv dd{margin:0}
.pd-line{display:flex;gap:9px;padding:8px 0;border-bottom:1px solid var(--line2);align-items:flex-start}
.pd-line:last-child{border-bottom:0}
.pd-q2{font-family:"IBM Plex Mono",monospace;font-size:12.5px;color:var(--ink2);min-width:26px}
.pd-t{flex:1;font-size:12.5px}
.pd-p{font-family:"IBM Plex Mono",monospace;font-size:12.5px;white-space:nowrap}
.pd-warn{background:#FBF2DE;border-left:2px solid #96660C;padding:7px 10px;font-size:12px;color:#96660C;border-radius:0 4px 4px 0;margin-bottom:8px}
.pd-alert{background:#FAECEC;border-left:2px solid var(--red);padding:7px 10px;font-size:12.5px;color:var(--red);border-radius:0 4px 4px 0;margin-bottom:8px;font-weight:500}
.pd-mem{background:#E9F1F8;border-left:2px solid #2B5C8A;padding:8px 10px;font-size:12.5px;color:#23405C;border-radius:0 4px 4px 0}
.pd-mem b{display:block;margin-bottom:2px}
.pd-tot{display:flex;justify-content:space-between;font-size:13px;padding:3px 0}
.pd-tot.big{font-size:15px;font-weight:600;border-top:1px solid var(--line);margin-top:6px;padding-top:8px}
.pd-peek-f{border-top:1px solid var(--line);padding:10px 16px;display:flex;gap:8px;flex-wrap:wrap}
#pkActs{display:flex;gap:8px}

/* ---- rytinė eiga ---- */
.pd-steps{display:flex;align-items:center;gap:2px;margin-left:6px;overflow:auto}
.pd-step{display:flex;align-items:center;gap:6px;padding:4px 9px;border-radius:99px;
 font-size:12.5px;color:var(--rdim);text-decoration:none;white-space:nowrap}
.pd-step:hover{background:rgba(255,255,255,.07);color:var(--rink)}
.pd-sdot{width:19px;height:19px;border-radius:50%;border:1.5px solid #4A554E;display:grid;place-items:center;
 font-size:10.5px;font-family:"IBM Plex Mono",monospace}
.pd-step.atlikta{color:var(--rink)}
.pd-step.atlikta .pd-sdot{background:var(--green);border-color:var(--green);color:#fff}
.pd-step.dabar{background:rgba(255,255,255,.12);color:#fff;font-weight:500}
.pd-step.dabar .pd-sdot{border-color:#fff;color:#fff}
.pd-sarr{color:#4A554E;font-size:12px}
.pd-ryt-body{flex:1;overflow:auto;padding:26px 32px 40px;max-width:1000px;width:100%;margin:0 auto}
.pd-rh2{margin:0 0 14px;font-size:19px;font-weight:600;letter-spacing:-.01em}
.pd-rgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:20px}
.pd-rcard{border:1px solid var(--line);border-radius:8px;padding:14px 16px;background:var(--card)}
.pd-rv{font-size:30px;font-weight:700;font-family:"IBM Plex Mono",monospace;letter-spacing:-.02em;line-height:1.1}
.pd-rl{font-size:12.5px;color:var(--ink3);margin-top:3px}
.pd-rl small{color:var(--ink3);font-size:11.5px}
.pd-rtbl{background:var(--card);border:1px solid var(--line);border-radius:8px;overflow:hidden}
.pd-rtbl tbody tr{cursor:default;height:42px}
.pd-rtbl tbody tr:hover{background:#F7F7F4}
.pd-rtbl thead th{background:#F5F5F1}
.pd-rnote{font-size:13.5px;color:var(--ink2);margin:0 0 16px;line-height:1.5}
.pd-rwarn{font-size:13px;color:#96660C;background:#FBF2DE;border-left:2px solid #96660C;
 padding:9px 12px;border-radius:0 4px 4px 0;margin-top:16px;line-height:1.5}
.pd-rbig{height:42px;padding:0 20px;font-size:14.5px;margin-right:10px}
.pd-done{opacity:.55}
.pd-sent{font-size:11.5px;color:var(--green);background:var(--greent);padding:1px 7px;border-radius:99px}
.pd-liko{display:inline-block;margin-left:6px;font-size:11.5px;color:#96660C;background:#FBF2DE;border-radius:3px;padding:1px 6px}
.pd-mlist{max-width:1120px;padding:16px 24px 0}
.pd-mcard{background:var(--card);border:1px solid var(--line);border-radius:var(--r);margin:0 0 18px;
 overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.pd-mh{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#F4F2ED;
 border-bottom:1px solid var(--line)}
.pd-mh b{font-size:14px}
.pd-mkl{font-size:13px;color:var(--ink2)}
.pd-msuma{margin-left:auto;font-size:13.5px;font-weight:600}
.pd-mvez{font-size:12px;color:var(--ink2);padding-left:12px;border-left:1px solid var(--line);margin-left:12px}
.pd-mrow{display:grid;grid-template-columns:150px 1fr 74px 132px 224px;gap:10px;align-items:center;
 padding:8px 14px;border-bottom:1px solid var(--line2);font-size:13px}
.pd-mrow:last-of-type{border-bottom:0}
.pd-mleft{display:flex;align-items:center;gap:6px;min-width:0}
.pd-mleft b{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pd-mprek{color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pd-mkg{text-align:right;color:var(--ink2);font-variant-numeric:tabular-nums}
.pd-mriba{font-size:11.5px}
.pd-mopt{display:flex;gap:8px;justify-content:flex-end}
.pd-mchk{display:flex;align-items:center;gap:5px;cursor:pointer;white-space:nowrap;
 border:1px solid var(--line);border-radius:99px;padding:3px 10px 3px 8px;font-size:12.5px}
.pd-mchk:has(input:checked){border-color:var(--green);background:var(--greent);color:var(--greend);font-weight:600}
.pd-mfix{font-size:12px;color:var(--ink3)}
.pd-mf{display:flex;align-items:center;gap:14px;padding:9px 14px;background:var(--greent);font-size:13px}
.pd-mf.pd-mwarn{background:#FBF2DE;color:#96660C}
.pd-msum-t{font-weight:600}
.pd-mpay{margin-left:auto;color:var(--ink2);font-size:12.5px}
.pd-pipe{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:0 0 12px;font-size:12.5px}
.pd-pipe-i{display:inline-flex;gap:6px;align-items:baseline;padding:5px 11px;border:1px solid #E4E1DA;border-radius:999px;text-decoration:none;color:#3c3c3c;background:#fff}
.pd-pipe-i:hover{border-color:#B5762A}
.pd-pipe-i b{font-size:13px}
.pd-pipe-0{opacity:.45}
.pd-pipe-s{color:#B7B2A7}
.pd-chips{display:flex;gap:4px;flex-wrap:wrap;margin-top:3px}
.pd-chip{font-size:11px;line-height:1.7;padding:0 7px;border-radius:999px;border:1px solid transparent;white-space:nowrap}
.pd-chip-ok{background:#E7F4EA;color:#1B7A3D;border-color:#BFE3C8}
.pd-chip-w{background:#FDF3E1;color:#96660C;border-color:#F1DDB2}
.pd-chip-av{background:#EFEFEF;color:#555;border-color:#DDD}
.pd-ri{display:flex;align-items:center;gap:6px;padding:7px 14px;color:#C9C5BC;text-decoration:none;font-size:13px}
.pd-ri:hover{color:#fff;background:rgba(255,255,255,.05)}
.pd-ri span{flex:1}
.pd-rb{font-size:11px;line-height:1.6;min-width:18px;text-align:center;border-radius:999px;padding:0 5px;font-weight:600}
.pd-rb-k{background:#B5762A;color:#fff}
.pd-rb-u{background:#3E6B4A;color:#fff}
.pd-empty-map{display:block;margin-top:10px;font-size:12px;color:#8b877e;max-width:560px}
.pd-mcard:target{outline:2px solid #B5762A;outline-offset:2px}
.pd-msec{font-size:14px;margin:18px 0 8px;color:#3c3c3c}
.pd-mbukle{font-size:12.5px;white-space:nowrap}
.pd-mok{color:#1B7A3D}
.pd-mng{color:#B3261E}
.pd-ez{display:inline-block;margin-top:3px;font-size:11px;line-height:1.7;padding:0 8px;border-radius:999px;text-decoration:none;color:#fff;background:var(--ez);opacity:.9}
.pd-ez:hover{opacity:1;color:#fff}
.pd-planas{display:block;font-size:11.5px;color:#96660C}
.pd-vkg{font-size:12px;color:var(--ink2);margin-left:12px;font-variant-numeric:tabular-nums}
.pd-ryt-f{border-top:1px solid var(--line);padding:12px 32px;display:flex;gap:10px;align-items:center;background:var(--card)}
.pd-ryt-hint{font-size:12.5px;color:var(--ink3);flex:1;text-align:center}
.pd-rdone{text-align:center;padding:26px 0 22px}
.pd-rcheck{font-size:42px;line-height:1;color:var(--green);margin-bottom:6px}
.pd-rdone h2{margin:0 0 6px;font-size:20px;font-weight:600}
.pd-rdone p{margin:0;color:var(--ink2);font-size:13.5px}

.pd-rstat{display:inline-block;margin:16px 0 10px;padding:6px 13px;border-radius:99px;font-size:13.5px;font-weight:600}
.pd-rstat.ok{background:var(--greent);color:var(--green)}
.pd-rstat.dalis{background:#FBF2DE;color:#96660C}
.pd-rstat.nulis{background:#FAECEC;color:var(--red)}
.pd-rok{color:var(--green);font-family:"IBM Plex Mono",monospace;font-size:12.5px}
.pd-rbad{color:var(--red);font-size:12.5px}

.pd-vgrp{border:1px solid var(--line);border-radius:8px;background:var(--card);margin-bottom:16px;overflow:hidden}
.pd-vgrp-h{display:flex;align-items:center;gap:12px;padding:11px 14px;background:#F5F5F1;border-bottom:1px solid var(--line)}
.pd-vgrp-h b{font-size:14px}
.pd-vman{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--ink3)}
.pd-vgrp-h .pd-rstat{margin:0 0 0 auto;font-size:12.5px;padding:4px 11px}
.pd-vgrp-b{display:flex;gap:8px;padding:12px 14px;flex-wrap:wrap}
.pd-vgrp .pd-rtbl{border:0;border-radius:0;border-top:1px solid var(--line2)}
.pd-vmix{border-color:#E7D7AE}
.pd-vmix .pd-vgrp-h{background:#FBF2DE}

.pd-riba{font-family:"IBM Plex Sans",sans-serif;font-size:12px;padding:3px 9px;border-radius:99px;font-weight:500}
.pd-riba-speji{background:var(--greent);color:var(--green)}
.pd-riba-skuba{background:#FBF2DE;color:#96660C}
.pd-riba-praejo{background:#F1F1EE;color:var(--ink3)}
small.pd-riba-speji,small.pd-riba-skuba,small.pd-riba-praejo{display:block;background:none;padding:0;font-size:11.5px;font-weight:500}
small.pd-riba-speji{color:var(--green)}
small.pd-riba-skuba{color:#96660C}
small.pd-riba-praejo{color:var(--ink3)}
/* artimiausia riba viršutinėje juostoje — ant tamsaus fono reikia plytelės */
.pd-tr{display:inline-flex;align-items:center;gap:7px;height:26px;padding:0 11px;border-radius:99px;
 font-size:12.5px;line-height:1;white-space:nowrap;border:1px solid transparent}
.pd-tr b{font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:600;letter-spacing:.04em}
.pd-tr-speji{background:rgba(126,196,150,.16);border-color:rgba(126,196,150,.3);color:#A9DCBB}
.pd-tr-speji b{color:#7EC496}
.pd-tr-skuba{background:rgba(240,200,104,.18);border-color:rgba(240,200,104,.38);color:#F3D99A;font-weight:500}
.pd-tr-skuba b{color:#F0C868}

.pd-tiek{display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap}
.pd-tiek-p{font-size:11.5px;color:var(--ink3)}
.pd-tiek-y{font-size:12px;color:var(--green);background:var(--greent);padding:3px 9px;border-radius:99px;font-weight:500}
.pd-tiek-x{font-size:11.5px;color:var(--ink3);text-decoration:underline}
.pd-tiek-x:hover{color:var(--red)}

.pd-pak{display:flex;align-items:center;gap:8px;margin-bottom:10px;background:#F4F4F0;border:1px solid var(--line);
 border-radius:var(--r);padding:9px 11px;flex-wrap:wrap}
.pd-pak label{font-size:12.5px;color:var(--ink2)}
.pd-pak input{width:62px;height:28px;border:1px solid var(--line);border-radius:4px;padding:0 8px;
 font-family:"IBM Plex Mono",monospace;text-align:right}
.pd-pak-p{font-size:11.5px;color:var(--ink3);width:100%}
.pd-lp{background:#E9F1F8;border-left:2px solid #2B5C8A;padding:8px 11px;font-size:12.5px;color:#23405C;
 border-radius:0 4px 4px 0;margin-bottom:10px}
.pd-lp-bl{background:#FBF2DE;border-color:#96660C;color:#6B4A08}
.pd-lp-w{margin-top:4px;font-weight:500}

.pd-kcard{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--red);border-radius:8px;
 margin:14px 16px;overflow:hidden}
.pd-kdim{opacity:.62;border-left-color:#9AA39C}
.pd-kh{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#F5F5F1;border-bottom:1px solid var(--line)}
.pd-kh b{font-family:"IBM Plex Mono",monospace;font-size:15px}
.pd-kh span{font-size:13px;color:var(--ink2)}
.pd-kpaid{background:var(--greent);color:var(--green);padding:2px 9px;border-radius:99px;font-size:11.5px;font-weight:600}
.pd-kunpaid{background:#FBF2DE;color:#96660C;padding:2px 9px;border-radius:99px;font-size:11.5px;font-weight:600}
.pd-kwait{margin-left:auto;background:#F1F1EE;color:var(--ink3);padding:2px 9px;border-radius:99px;font-size:11.5px}
.pd-kwhy{padding:10px 14px 0;color:var(--red);font-weight:500;font-size:13.5px}
.pd-kline{display:flex;align-items:center;gap:12px;padding:10px 14px;flex-wrap:wrap}
.pd-kprek b{display:block;font-size:13.5px}
.pd-kprek span{font-size:12.5px;color:var(--ink3)}
.pd-kbtns{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}
.pd-knone{font-size:12.5px;color:var(--ink3);font-style:italic}
.pd-kf{display:flex;gap:8px;padding:11px 14px;border-top:1px solid var(--line2);background:#FAFAF8;flex-wrap:wrap}
.pd-khint{margin:0 16px 20px;padding:9px 12px;background:var(--gray-t);border-radius:var(--r);
 font-size:12px;color:var(--ink2)}
@media (prefers-reduced-motion:reduce){.pd *{transition:none!important}}
</style>
		<?php
	}

	/* ============================ SKRIPTAS ============================ */

	protected static function skriptas() {
		?>
<script>
(function(){
 /* MIŠRIŲ KORTELĖ: gyva suvestinė. Kiek siuntų gaus klientas ir kiek tai
    kainuos mums — perskaičiuojama kiekvieną kartą pajudinus jungiklį (H236). */
 function misrusSuma(f){
  var eil=f.querySelectorAll('.pd-mrow');
  var tiesiai=0, iAv=0, savo=0, kgTiesiai=0, kgAv=0;
  eil.forEach(function(r){
   var kgTxt=(r.querySelector('.pd-mkg')||{}).textContent||'';
   var kg=parseFloat(kgTxt.replace(/[^0-9,\.]/g,'').replace(',','.'))||0;
   if (r.querySelector('.pd-mfix')) { savo=1; kgAv+=kg; return; }
   var v=r.querySelector('input[type=radio]:checked');
   if (!v) return;
   if (v.value==='av') { iAv++; kgAv+=kg; } else { tiesiai++; kgTiesiai+=kg; }
  });
  var siuntos = tiesiai + ((savo || iAv) ? 1 : 0);
  var t=f.querySelector('.pd-msum-t');
  var box=f.querySelector('.pd-mf');
  if (!t) return;
  var kg=function(x){ return x>0 ? (Math.round(x*10)/10).toString().replace('.',',')+' kg' : '—'; };
  t.textContent = 'Klientui ' + siuntos + (siuntos===1?' siunta':(siuntos<10?' siuntos':' siuntų'))
   + (iAv||savo ? ' · per AV' + (kgAv>0 ? ' ' + kg(kgAv) : '') : '')
   + (tiesiai ? ' · tiesiai' + (kgTiesiai>0 ? ' ' + kg(kgTiesiai) : '') : '');
  if (box) box.classList.toggle('pd-mwarn', siuntos>2);
 }
 document.querySelectorAll('.pd-mform').forEach(function(f){
  misrusSuma(f);
  f.addEventListener('change', function(){ misrusSuma(f); });
 });

 /* AUTOMATINIS ATSINAUJINIMAS (H226): kas 60 s, bet TIK kai netrukdo —
    skirtukas matomas, nieko nepažymėta, neatidarytas skydelis/dialogas,
    žymeklis ne įvesties lauke. Rytinėje eigoje neveikia. */
 if (location.search.indexOf('view=rytas') === -1) {
  setInterval(function(){
   try{
    if (document.visibilityState !== 'visible') return;
    if (typeof sel !== 'undefined' && sel.size > 0) return;
    var pk=document.getElementById('pdPeek');
    if (pk && pk.classList.contains('on')) return;
    var ds=document.getElementById('pdDScrim');
    if (ds && ds.classList.contains('on')) return;
    var a=document.activeElement;
    if (a && (a.tagName==='INPUT' || a.tagName==='SELECT' || a.tagName==='TEXTAREA')) return;
    window.location.reload();
   }catch(e){}
  }, 60000);
 }

 var T=document.querySelector('.pd-tbl'), peek=document.getElementById('pdPeek'),
     bulk=document.getElementById('pdBulk'), cur=0, sel=new Set();
 var rows=T?[].slice.call(T.querySelectorAll('tbody tr')):[];

 function d(r){ try{ return JSON.parse(r.getAttribute('data-json')); }catch(e){ return null; } }
 function esc(s){ return String(s==null?'':s).replace(/[<>&"]/g,function(c){
   return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]; }); }

 var DS=document.getElementById('pdDScrim'), DL=document.getElementById('pdDlg'), dgUrl='', dgOpt=null;
 function dlg(url,d){
  dgUrl=url; dgOpt=d.opt||null;
  document.getElementById('pdDlgA').textContent=d.antraste||'';
  document.getElementById('pdDlgT').textContent=d.tekstas||'';
  document.getElementById('pdDlgYes').textContent=d.ok||'Patvirtinti';
  var w=document.getElementById('pdDlgOptW'), c=document.getElementById('pdDlgOpt');
  if(dgOpt){ w.style.display='flex'; c.checked=!!dgOpt.def;
   document.getElementById('pdDlgOptT').textContent=dgOpt.tekstas; }
  else { w.style.display='none'; }
  DS.classList.add('on'); DL.classList.add('on');
  document.getElementById('pdDlgYes').focus();
 }
 function dlgOff(){ DS.classList.remove('on'); DL.classList.remove('on'); }
 document.getElementById('pdDlgNo').onclick=dlgOff;
 DS.onclick=dlgOff;
 document.getElementById('pdDlgYes').onclick=function(){
  var u=dgUrl;
  if(dgOpt){ u+='&'+encodeURIComponent(dgOpt.vardas)+'='+(document.getElementById('pdDlgOpt').checked?'1':'0'); }
  dlgOff(); window.location.href=u;
 };

 function mark(){
  rows.forEach(function(r,i){
   r.classList.toggle('cur', i===cur);
   r.classList.toggle('sel', sel.has(r.dataset.id));
   var cb=r.querySelector('.pd-row-cb'); if(cb) cb.checked=sel.has(r.dataset.id);
  });
  bulk.classList.toggle('on', sel.size>0);
  document.getElementById('pdBcnt').textContent='Pažymėta '+sel.size;
  var box=document.getElementById('pdWcIds'); box.innerHTML='';
  sel.forEach(function(id){
   var i=document.createElement('input'); i.type='hidden'; i.name='id[]'; i.value=id; box.appendChild(i);
   var p=document.createElement('input'); p.type='hidden'; p.name='post[]'; p.value=id; box.appendChild(p);
  });
 }

 function open(i){
  var r=rows[i]; if(!r) return; var o=d(r); if(!o) return;
  document.getElementById('pkNr').textContent='#'+o.nr;
  var st=document.getElementById('pkSt'); st.textContent=o.st;
  var sp=r.querySelector('.pd-pill');
  if(sp){ st.style.background=sp.style.background; st.style.color=sp.style.color; }
  document.getElementById('pkSub').textContent=o.laikas+' · '+(o.mok||'—')+(o.saskaita?' · '+o.saskaita:'');
  document.getElementById('pkEdit').href=o.edit;
  var box=document.getElementById('pkActs'); box.innerHTML='';
  (o.veiksmai||[]).forEach(function(v,ix){
   var el;
   if(v.url){
    el=document.createElement('a'); el.href=v.url;
    if(v.d) el.addEventListener('click',function(ev){ ev.preventDefault(); dlg(v.url,v.d); });
   } else if(v.wc){
    el=document.createElement('button');
    el.addEventListener('click',function(){ wcVienam(v.wc,o.id); });
   } else {
    el=document.createElement('button');
    el.addEventListener('click',function(){ alert('Šis veiksmas dar nepajungtas (2 sluoksnis).'); });
   }
   el.className='pd-btn'+(ix===0?' pd-btn-p':'')+(v.pav==='pavojus'?' pd-btn-pav':'');
   el.textContent=v.t; box.appendChild(el);
  });

  var h='';
  if(o.klausimas) h+='<div class="pd-alert">▲ '+esc(o.klausimas)+'</div>';
  if(o.pastaba) h+='<div class="pd-cbox"><b>Kliento pastaba</b>'+esc(o.pastaba)+'</div>';
  h+='<div class="pd-sec"><div class="pd-mem"><b>'+esc(o.vardas)+'</b>'+
     (o.uzsakymu>1?(o.uzsakymu+'-as užsakymas'+(o.pries?' · prieš tai '+esc(o.pries):''))
                  :'Pirmas užsakymas')+'</div></div>';
  h+='<div class="pd-sec"><h3>Pirkėjas</h3><dl class="pd-kv">'+
     '<dt>Telefonas</dt><dd>'+esc(o.tel||'—')+'</dd>'+
     '<dt>El. paštas</dt><dd>'+esc(o.mail||'—')+'</dd>'+
     '<dt>Adresas</dt><dd>'+esc(o.adresas||'—')+'</dd></dl></div>';
  h+='<div class="pd-sec"><h3>Eilutės</h3>';
  (o.items||[]).forEach(function(x){
   var t='';
   if(x.tiek){
    if(x.tiek.yra){
     t='<div class="pd-tiek"><span class="pd-tiek-y">✓ '+esc(x.tiek.tekstas)+'</span>'+
       (x.tiek.url?'<a class="pd-tiek-x" href="'+x.tiek.url+'">'+esc(x.tiek.mygtukas)+'</a>':'')+'</div>';
    } else {
     t='<div class="pd-tiek"><a class="pd-btn pd-btn-s" href="'+x.tiek.url+'">'+esc(x.tiek.mygtukas)+'</a>'+
       '<span class="pd-tiek-p">parsivežti į AV ir siųsti kartu</span></div>';
    }
   }
   h+='<div class="pd-line"><span class="pd-q2">'+x.q+'×</span><span class="pd-t">'+esc(x.n)+
      '<div class="pd-sub">'+esc(x.i||'')+'</div>'+t+'</span><span class="pd-p">'+esc(x.p)+'</span></div>';
  });
  h+='<div class="pd-tot"><span>Pristatymas</span><span>'+esc(o.siunta)+'</span></div>'+
     '<div class="pd-tot big"><span>Iš viso</span><span>'+esc(o.suma)+'</span></div></div>';
  h+='<div class="pd-sec"><h3>Siunta</h3>';
  if(o.pak){
   h+='<div class="pd-pak"><label>Dėžių šioje siuntoje</label>'+
      '<input type="number" min="1" max="20" value="'+o.pak.kiek+'" id="pdPakN">'+
      '<a class="pd-btn pd-btn-s" id="pdPakOk" data-u="'+o.pak.url+'">Išsaugoti</a>'+
      '<span class="pd-pak-p">kurjeriui · paštomate visada viena</span></div>';
  }
  if(o.lp_info){
   var g=o.lp_info[0], be=o.lp_info[1]||[];
   h+='<div class="pd-lp'+(be.length?' pd-lp-bl':'')+'">LP dydį parenka pats pagal svorį: <b>'+g+' g</b>'+
      (be.length?'<div class="pd-lp-w">▲ be svorio: '+esc(be.join(', '))+' — dydis bus apskaičiuotas neteisingai</div>':'')+
      '</div>';
  }
  h+='<dl class="pd-kv">'+
     '<dt>Būdas</dt><dd>'+esc(o.vezejas)+'</dd>'+
     '<dt>Vieta</dt><dd>'+esc(o.vieta||'—')+'</dd>'+
     '<dt>Kodas</dt><dd>'+esc(o.kodas||'dar nesuformuota')+(o.pak>1?' · '+o.pak+' lipdukai':'')+'</dd>'+
     '<dt>Vykdymas</dt><dd>'+esc(o.vykdymas||'—')+'</dd>'+
     (o.pak?'<dt>Dėžių</dt><dd>'+o.pak.kiek+'</dd>':'')+'</dl></div>';
  setTimeout(function(){
   var b=document.getElementById('pdPakOk');
   if(b) b.addEventListener('click',function(ev){
    ev.preventDefault();
    var n=document.getElementById('pdPakN');
    window.location.href=b.getAttribute('data-u')+'&n='+(n?n.value:1);
   });
  },0);
  document.getElementById('pkBody').innerHTML=h;
  peek.classList.add('on'); peek.setAttribute('aria-hidden','false');
 }
 function close(){ peek.classList.remove('on'); peek.setAttribute('aria-hidden','true'); }
 document.getElementById('pkX').onclick=close;

 rows.forEach(function(r,i){
  r.addEventListener('click',function(e){
   if(e.target.closest('.pd-more')) return;
   if(e.target.classList.contains('pd-row-cb')){
    sel.has(r.dataset.id)?sel.delete(r.dataset.id):sel.add(r.dataset.id); mark(); return;
   }
   var lnk=e.target.closest('a[data-d]');
   if(lnk){ e.preventDefault(); dlg(lnk.getAttribute('href'), JSON.parse(lnk.getAttribute('data-d'))); return; }
   var w1=e.target.closest('[data-wc1]');
   if(w1){ e.preventDefault(); wcVienam(w1.getAttribute('data-wc1'), w1.getAttribute('data-oid')); return; }
   if(e.target.closest('a.pd-btn')) return;
   if(e.target.closest('[data-act]')){ e.preventDefault(); alert('Šis veiksmas dar nepajungtas (2 sluoksnis).'); return; }
   cur=i; mark(); open(i);
  });
 });

 var all=document.getElementById('pdAllCb'), allb=document.getElementById('pdAll');
 function selAll(){ rows.forEach(function(r){ sel.add(r.dataset.id); }); mark(); }
 if(all) all.addEventListener('change',function(){ if(all.checked) selAll(); else { sel.clear(); mark(); } });
 if(allb) allb.addEventListener('click',selAll);
 document.getElementById('pdClr').onclick=function(){ sel.clear(); mark(); };

 function wcVienam(veiksmas,id){
  var box=document.getElementById('pdWcIds'); box.innerHTML='';
  ['id[]','post[]'].forEach(function(n){
   var i=document.createElement('input'); i.type='hidden'; i.name=n; i.value=id; box.appendChild(i);
  });
  document.getElementById('pdWcAction').value=veiksmas;
  document.getElementById('pdWcForm').submit();
 }
 document.addEventListener('click',function(ev){
  var b=ev.target.closest('[data-wc1]');
  if(!b) return;
  wcVienam(b.getAttribute('data-wc1'), b.getAttribute('data-oid'));
 });
 function pazymeti(){ return Array.from(sel).join(','); }
 [].forEach.call(bulk.querySelectorAll('[data-ba]'),function(b){
  b.addEventListener('click',function(e){
   e.preventDefault(); if(!sel.size) return;
   window.location.href=b.getAttribute('data-ba')+'&ids='+pazymeti();
  });
 });
 [].forEach.call(bulk.querySelectorAll('[data-wc]'),function(b){
  b.addEventListener('click',function(e){
   e.preventDefault(); if(!sel.size) return;
   document.getElementById('pdWcAction').value=b.getAttribute('data-wc');
   document.getElementById('pdWcForm').submit();
  });
 });

 [].forEach.call(document.querySelectorAll('.pd-sel'),function(s){
  s.addEventListener('change',function(){
   var u=new URL(window.location.href);
   if(s.value) u.searchParams.set(s.dataset.k,s.value); else u.searchParams.delete(s.dataset.k);
   if(s.dataset.k==='data'&&s.value!=='intervalas'){ u.searchParams.delete('nuo'); u.searchParams.delete('iki'); }
   window.location.href=u.toString();
  });
 });

 document.addEventListener('keydown',function(e){
  var t=e.target.tagName;
  if(t==='INPUT'||t==='SELECT'||t==='TEXTAREA'){
   if(e.key==='Escape') e.target.blur();
   return;
  }
  var k=e.key.toLowerCase();
  if(k==='/'){ e.preventDefault(); document.getElementById('pdQ').focus(); return; }
  if(!rows.length) return;
  if(k==='j'){ cur=Math.min(cur+1,rows.length-1); mark(); if(peek.classList.contains('on'))open(cur);
   rows[cur].scrollIntoView({block:'nearest'}); e.preventDefault(); }
  if(k==='k'){ cur=Math.max(cur-1,0); mark(); if(peek.classList.contains('on'))open(cur);
   rows[cur].scrollIntoView({block:'nearest'}); e.preventDefault(); }
  if(e.key==='Enter'){ open(cur); e.preventDefault(); }
  if(k==='x'){ var id=rows[cur].dataset.id; sel.has(id)?sel.delete(id):sel.add(id); mark(); e.preventDefault(); }
  if(e.key==='Escape'){
   if(DL.classList.contains('on')) dlgOff();
   else if(peek.classList.contains('on')) close();
   else { sel.clear(); mark(); }
  }
 });
 mark();
})();
</script>
		<?php
	}
}
Petshop_Desk::init();
