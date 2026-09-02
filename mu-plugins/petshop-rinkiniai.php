<?php
/**
 * Petshop Rinkiniai v1.44 (S1601) — „TIK KURJERIU“ galiausiai VEIKIA KASOJE:
 *   varnele `_ps_tik_kurjeriu` (katalogo kortele, 162 prekes) iki siol buvo tik zyma —
 *   pastomato_sargas() slepe pastomatus TIK pagal svori (>25 kg). Dabar: bet kuri krepselio
 *   preke (ar MnM vaikas) su `_ps_tik_kurjeriu=yes` -> pastomatu/terminalu tarifai nerodomi.
 *   Rinkiniai (MnM ir DP pakai) varnele PAVELDI is sudedamuju issaugant (S1601).
 * v1.43 (S1554) — prekes puslapiams NEBEsiunciamas nocache_headers() (v1.40 be_keso):
 * jis blokavo puslapiu cache (Cache-Control: no-store visose prekese, S1552 recon). Metodas be_keso()
 * paliktas, bet nebekabinamas. Narsykles keso problema (H298) sprendziama cache sluoksnio header'iais.
 *
 * Petshop Rinkiniai v1.42 (H301) — greita perziura GRAZINTA (savininkas: neisjungti),
 * modale rodoma ta pati vitrina: selektoriai per form.mnm_form (nepriklauso nuo
 * body klases), kiekis imamas is #532 fiksuoto input max, antrastes verciamos,
 * nuorodos i preke nuimamos.
 *
 * Petshop Rinkiniai v1.41 (H300) — RADAU: savininkas ziurejo ne prekes puslapi,
 * o GREITA PERZIURA (Flatsome quick view) kategorijoje /kategorija/rinkiniai/.
 * Body klase ten yra `archive`, ne `single-product`, todel vitrinos stilius
 * (is_product) nespausdinamas, o modale rodoma pliki MnM lentele.
 *
 * MANO REGRESIJA: #524 slepe quick view rinkiniu kortelems VISUOSE puslapiuose;
 * v1.29 ta CSS perkeliau i front_stilius, kuris veikia TIK prekes puslapyje —
 * kategorijose quick view atgijo. Dabar: (a) quick view visoms mix-and-match
 * kortelems slepiamas visur (CSS + JS nuima Flatsome kabliuka, kad paveikslo
 * paspaudimas vestu i preke), (b) vitrinos CSS papildomai galioja ir modalo
 * viduje (.product-lightbox / .mfp-content), jei kada nors vis tiek atsidarytu.
 *
 * Petshop Rinkiniai v1.40 (H298) — prekes puslapiai be narsykles keso.
 *
 * Serveris grazina teisinga HTML (tikrinta anonimiskai, be slapuku), bet
 * savininko narsykle rode sena versija. Puslapiai neturejo jokio Cache-Control,
 * todel narsykle galejo laikyti HTML euristiskai. Dabar prekes puslapiams
 * siunciamas nocache_headers() — narsykle visada perklausia serverio.
 * Statiniai failai (css/js/img) lieka kesuojami per .htaccess kaip buvo.
 *
 * Petshop Rinkiniai v1.39 (H295) — nuorodu nuemimas nebepriklauso nuo nuotrauku.
 *
 * v1.35 pavadinimu nuorodos buvo salinamos lightbox funkcijoje; ji nutraukia
 * darba, kai eilutese nera nuotraukos nuorodos (Animonda #35079) — todel
 * pavadinimai likdavo melyni ir vede i preke. Dabar salinama kartu su eiluciu
 * apdorojimu, o nuotrauku dalis atskira.
 *
 * Petshop Rinkiniai v1.38 (H294) — VITRINA VEIKIA IR SENIEMS RINKINIAMS.
 *
 * Animonda #35079 buvo be `_petshop_component_quantities` meta (sukurtas ne
 * siuo langu), todel body klase nebuvo dedama: klientas mate neapdorota MnM
 * lentele su „PRODUCT / QUANTITY". Dabar sudetis imama per kiekiai(): meta,
 * o jos nesant — is `wc_mnm_child_items` (po 1 vnt.). Rinkiniu pozymis dabar
 * yra PREKES TIPAS (mix-and-match), ne meta buvimas.
 *
 * Petshop Rinkiniai v1.37 (H293) — „PRODUCT/QUANTITY" verciami ir JS'u.
 *
 * Iki siol antrastes buvo tik PASLEPTOS CSS'u (::after su lietuvisku tekstu).
 * Jei stilius nespeja arba puslapis paimtas is narsykles kesо, klientas mato
 * anglisku zodziu lentele. Dabar tekstas KEICIAMAS pacioje lenteleje — net ir
 * be musu CSS eilute lieka lietuviska.
 *
 * Petshop Rinkiniai v1.36 (H290) — DU SAVININKO NURODYMAI (2026-08-25).
 *
 * (1) Nauda po 3 % nerodoma: „Sutaupote 0,28 € (1%)" atrodo juokingai ir
 *     mazina pasitikejima. Slepiama IR lentele, IR perbraukta senoji kaina.
 * (2) Automatines vietos zymos dabar nuimamos (✕) — anksciau ju nebuvo
 *     imanoma panaikinti. Nuimtos irasomos i _ps_rink_kat_off ir islieka
 *     tarp seansu; grazinti galima ta pacia „pridėti vietą ranka" eilute.
 *
 * Petshop Rinkiniai v1.35 (H284) — komponento pavadinimas be nuorodos i preke (savininko nurodymas).
 *
 * Petshop Rinkiniai v1.34 (H283) — savas lightbox (Magnific siame puslapyje nepasiekiamas).
 *
 * Petshop Rinkiniai v1.33 (H282) — komponento nuotrauka atidaroma lightbox'e (Magnific), ne nuvedama i faila/preke.
 *
 * Petshop Rinkiniai v1.32 (H281) — figure.woocommerce-product-gallery__image pseudo-elementai (temos) pridedavo 34 px eilutei → isjungti.
 *
 * Petshop Rinkiniai v1.31 (H280) — sudeties eiluciu aukstis (paslepti vidiniai elementai su padding/margin).
 *
 * Petshop Rinkiniai v1.30 (H279) — v1.29 patikslinimai: kaina tamsi (ne temos akcijine auksine), „Turime" eilutese paslepta, eilutes kompaktiskesnes.
 *
 * Petshop Rinkiniai v1.29 (H278) — PREKES PUSLAPIO VITRINA PAGAL TEMOS STILIU.
 *
 * Savininkas: rinkinio puslapis „ne petshop spalvu, istemptas". Priezastis —
 * senas snippetas #524 (auksine #b29051, dideles korteles 3 stulpeliais, 28 px
 * kaina) uzdedamas ant mu-plugino stiliaus. DABAR vitrina PILNAI priklauso
 * siam failui (front_stilius, wp_head prioritetas 100), #524 isjungiamas:
 * temos spalvos (#365a51 / #a2bd9d), kompaktiskas sudeties sarasas (56 px
 * nuotrauka · pavadinimas · ×N), mygtukas — temos numatytas (zalias), dvigubas
 * „Sutaupote" (#535 eilute) paslepiamas. #535 lieka del perbrauktos kainos
 * kortelese; #532 lieka — fiksuoja kiekius.
 *
 * Petshop Rinkiniai v1.28 (H276) — SANDELIO FILTRAS PAVELDI RINKINIO SANDELI.
 *
 * Redaguojant filtras visada rodydavo „Visi" — savininkas: turi rodyti tai, kas
 * pasirinkta kuriant. Rinkinys sandelio atskirai nesaugo (jis kyla is prekiu:
 * viena grupe = vienas sandelis = viena siunta), todel filtras nustatomas pagal
 * KOMPONENTUS: visi vienam sandelyje -> tas sandelis pazymimas ir paieska is
 * karto rodo tik tinkamas prekes; misrus -> „Visi" ir ispejimas.
 *
 * Petshop Rinkiniai v1.27 (H275) — „KUR BUS MATOMAS" TAISYMAS.
 *
 * (1) JS pieštiVieta() naudojo neapibrėžtą `a` → ReferenceError → žymos
 *     nepiešiamos, tikrinti() nepasiekiamas, mygtukas „Išsaugoti" lieka
 *     užrakintas. (2) Ranka pridėtos vietos redaguojant nebuvo užkraunamos
 *     (KAT_RANK = []) → po išsaugojimo dingdavo. (3) Savininkas: vieta
 *     parenkama AUTOMATIŠKAI pagal komponentus — auto_vieta() serveryje
 *     (JS autoVieta atitikmuo): tipo kategorija (dauguma) + porūšis 682/683/684.
 *     Rankinės vietos lieka priedu.
 *
 * Petshop Rinkiniai v1.26 (H266) — 🔴 PARDAVIMO KAINA „NEIŠSISAUGO“ (darbuotojo pastaba).
 *
 * FAKTAI: kaina išsaugoma (_regular_price, _mnm_base_price = 11.99, get_price() = 11.99),
 * bet MNM juodraščiui NEĮRAŠO `_price` meta → sąrašas, skaitęs get_post_meta('_price'),
 * rodė 0,00 € ir maržą „—“. DABAR: sąrašas ima kainą iš get_price() (jei _price tuščias),
 * o po išsaugojimo `_price` įrašomas tiesiogiai (abu keliai: rinkinys ir DP pakas) —
 * kad ir feed'ai/rūšiavimas/WC lookup matytų tą pačią kainą.
 *
 * Petshop Rinkiniai v1.3 (E4) — PARUOSTU RINKINIU VALDYMAS
 *
 * KAM: iki siol rinkinius buvo galima tik SUKURTI (snippet 539). Sarašo nebuvo,
 * redagavimo nebuvo, trynimo nebuvo. Norint pakeisti rinkinio kaina ar sudeti
 * reikejo eiti i WooCommerce prekes langa (415 lauku) ir taisyti ranka.
 * Del to atsirado ir tokie atvejai kaip #34196: tevinis rinkinys istrintas, o
 * seši pasleptri dydziai liko publikuoti — niekas to nemate.
 *
 * KAS CIA: vienas langas, kuriame matomi visi paruosti rinkiniai su marza,
 * savikaina ir likuciu, ir kuriame juos galima kurti, redaguoti bei istrinti.
 *
 * UNIVERSALUS MODELIS (savininko reikalavimas 2026-08-12):
 *   Rinkinys gali buti IS BET KOKIU prekiu — ne tik konservu/skanestu/kramtalu.
 *   2x Ambrosia 12,5 kg · tualetas + semtuvelis + maistas · kraikas 8 vnt ·
 *   rinkinys suniukui. Todel paieska eina per VISA kataloga (2 566 prekes) su
 *   filtrais: kategorija (medis su palikuonimis) · svoris (pa_pakuotes_dydis) ·
 *   sandelis · savikaina · tekstas.
 *
 * KAINODARA: renkant matoma prekes savikaina, pardavimo kaina ir marza.
 * Rinkinio lygmenyje — savikaina, prekiu suma, rekomenduojama kaina pagal
 * norima marza, ir gyvai persiskaiciuojanti marza keiciant kaina.
 *
 * SARGAI (ne blokuoja, bet pasako):
 *   - rinkinys brangesnis nei prekes atskirai
 *   - marza minusine
 *   - komponentas be likucio (rinkinio surinkti negalima)
 *   - keliu dropship tiekeju prekes viename rinkinyje (dvi siuntos)
 *   - norima marza nepasiekiama nevirsijant iprastos kainos
 *
 * PUBLIKAVIMAS: nauja rinkinys pagal nutylejima kuriamas JUODRASCIU. Varnele
 * „Publikuoti" ji paleidzia i parduotuve. Taip galima pirma pasiziureti, kaip
 * atrodo, ir tik tada rodyti klientams.
 *
 * DU TIPAI PAGAL SUDETI (savininko klausimas 2026-08-12):
 *   A) KELIOS SKIRTINGOS PREKES -> Mix and Match rinkinys.
 *      Likucius saugo `petshop-rinkiniu-likuciai.php` (rinkinys dingsta is
 *      prekybos, kai bent vieno komponento nebeuztenka).
 *   B) TA PATI PREKE x N -> „Daugiau=pigiau" pakas (`simple` + `_dp_base_product_id`
 *      + `_dp_pack_qty`). Ne MnM! Priezastis ne likuciai (juos tvarko snippet 567
 *      nurasydamas is bazines prekes), o VITRINA: pakas turi savo isvaizda —
 *      zenklas „xN VNT.", juosta „EKONOMISKA PAKUOTE", lentele su bendru kiekiu
 *      ir vieneto kaina (snippet 568/570/573). Sukurus toki rinkini kaip MnM,
 *      klientas gauna „PRODUCT / QUANTITY / ISVALYTI PASIRINKIMUS" — netinka.
 *      Nuotrauka DP atveju NEGENERUOJAMA: naudojama bazines prekes nuotrauka.
 *      Kategorija taip pat kita — DAUGIAU=PIGIAU (91), ne RINKINIAI (679).
 *
 * KAS LIEKA KITUR:
 *   - Susidejimo rinkiniai (klientas pats renkasi) — snippet 550/547.
 *   - Fiksuotu kiekiu rodymas vitrinoje („xN") — snippet 532.
 *   - Kategoriju auto-priskyrimas issaugant — snippet 569 (cia tik parodoma,
 *     ka jis nustatys, kad nebutu staigmenu).
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Rinkiniai {

	const VERSIJA = '1.44';   /* v1.44 (S1601): tik kurjeriu kasoje + paveldejimas. v1.31: siuksline — ketvirta busena toje pacioje lenteleje */
	const SLUG    = 'ps-rinkiniai';
	const META_KIEKIAI = '_petshop_component_quantities';

	/**
	 * v1.38 — rinkinio sudetis [product_id => kiekis].
	 *
	 * Pirmiausia musu meta (ten irasyti TIKRI kiekiai). Jos nesant — MnM
	 * lentele: seni rinkiniai kurti ne siuo langu, bet klientui atrodyti turi
	 * vienodai. Ten kiekio nera, todel po 1 vnt.
	 */
	public static function kiekiai( $pid ) {
		$k = json_decode( (string) get_post_meta( (int) $pid, self::META_KIEKIAI, true ), true );
		if ( is_array( $k ) && $k ) { return array_map( 'intval', $k ); }
		global $wpdb;
		$t = $wpdb->prefix . 'wc_mnm_child_items';
		$ids = $wpdb->get_col( $wpdb->prepare( "SELECT product_id FROM $t WHERE container_id = %d ORDER BY menu_order", (int) $pid ) );
		$out = array();
		foreach ( (array) $ids as $id ) { $out[ (int) $id ] = 1; }
		return $out;
	}
	const META_KAT_OFF = '_ps_rink_kat_off';   /* v1.36: rankomis nuimtos automatines vietos */
	const NAUDA_MIN_PROC = 3;                  /* v1.36: mazesne nauda nerodoma */

	/** Virs sio svorio siunta i pastomata nebetelpa (savininko sprendimas 2026-08-13). */
	const PASTOMATO_RIBA = 25.0;

	/* ==================== PALEIDIMAS ==================== */

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 20 );
		add_action( 'wp_head', array( __CLASS__, 'front_stilius' ), 100 ); /* v1.29: po #524 ir temos */
		add_filter( 'body_class', array( __CLASS__, 'front_klase' ) );
		/* v1.43 (S1554): send_headers/be_keso NUIMTA — nocache_headers() prekėse blokavo puslapių cache (WP Super Cache); naršyklės keso valdymas dabar per cache sluoksnį. */
		add_filter( 'woocommerce_single_product_image_gallery_classes', array( __CLASS__, 'galerijos_klases' ) );
		/* 200, nes aprasymu akordeonas (512) kabinasi prio 98 — su mazesniu
		   prioritetu jis perrasytu musu skirtuka atgal i savo psdp_render. */
		add_filter( 'woocommerce_product_tabs', array( __CLASS__, 'tabai' ), 200 );
		add_filter( 'woocommerce_package_rates', array( __CLASS__, 'pastomato_sargas' ), 100, 2 );
		add_filter( 'gettext', array( __CLASS__, 'vertimai' ), 20, 3 );
		/* Lenteles antrastes registruotos per _x() su kontekstu — jos eina
		   pro `gettext_with_context`, ne pro `gettext`. Be sio filtro liko
		   „PRODUCT" ir „QUANTITY". */
		add_filter( 'gettext_with_context', array( __CLASS__, 'vertimai_kontekste' ), 20, 4 );
		add_filter( 'ngettext', array( __CLASS__, 'vertimai_daugiskaita' ), 20, 5 );
		add_action( 'woocommerce_single_product_summary', array( __CLASS__, 'sutaupote' ), 11 );
		add_filter( 'woocommerce_get_availability_text', array( __CLASS__, 'komponento_bukle' ), 20, 2 );
		add_action( 'wp_ajax_ps_rink_paieska',   array( __CLASS__, 'ajax_paieska' ) );
		add_action( 'wp_ajax_ps_rink_issaugoti', array( __CLASS__, 'ajax_issaugoti' ) );
		add_action( 'wp_ajax_ps_rink_trinti',    array( __CLASS__, 'ajax_trinti' ) );
		add_action( 'wp_ajax_ps_rink_siuksline', array( __CLASS__, 'ajax_siuksline' ) );
		add_action( 'wp_ajax_ps_rink_seimos_kaina',   array( __CLASS__, 'ajax_seimos_kaina' ) );
		add_action( 'wp_ajax_ps_rink_seimos_krepsys', array( __CLASS__, 'ajax_seimos_krepsys' ) );
		add_filter( 'admin_body_class', array( __CLASS__, 'body_klase' ) );

		/* v1.25: LIKUCIO UZRAKTAS. Rinkinys ir DP pakas savo likucio NETURI —
		   MnM likuti skaiciuoja petshop-rinkiniu-likuciai.php is komponentu,
		   DP — snippet 567 is bazines prekes. Bet kokia irasyta reiksme butu
		   dviguba apskaita, todel rasymas blokuojamas DUOMENU lygmenyje:
		   ir tiesioginis update/add_post_meta, ir WC CRUD kelias (kortele,
		   importai, WC prekes langas). */
		add_filter( 'update_post_metadata', array( __CLASS__, 'likucio_uzraktas_meta' ), 10, 5 );
		add_filter( 'add_post_metadata',    array( __CLASS__, 'likucio_uzraktas_meta' ), 10, 5 );
		add_action( 'woocommerce_before_product_object_save', array( __CLASS__, 'likucio_uzraktas_crud' ) );
	}

	public static function meniu() {
		add_submenu_page(
			'ps-katalogas', 'Rinkiniai', 'Rinkiniai', 'manage_woocommerce',
			self::SLUG, array( __CLASS__, 'puslapis' )
		);
	}

	public static function body_klase( $k ) {
		if ( isset( $_GET['page'] ) && $_GET['page'] === self::SLUG ) { $k .= ' petshop-rinkiniai'; }
		return $k;
	}

	/**
	 * Vieninga virsutine juosta — TA PATI, kaip Kataloge/Akcijose/Gavime.
	 * `Petshop_Katalogas::navigacija()` GRAZINA html (ne echo), todel ji reikia
	 * isvesti pacia — pirmoje versijoje to truko ir juostos nesimate.
	 * Jei katalogo klases nera (isjungta), rodom savo atsargini sarasa, kad
	 * langas neliktu be kelio i kitus.
	 */
	private static function navigacija() {
		$nuorodos = '';
		if ( class_exists( 'Petshop_Katalogas' ) && method_exists( 'Petshop_Katalogas', 'navigacija' ) ) {
			$nuorodos = Petshop_Katalogas::navigacija( self::SLUG );
		} else {
			$langai = array(
				'ps-katalogas' => 'Katalogas', 'ps-rinkiniai' => 'Rinkiniai',
				'ps-akcijos' => 'Akcijos', 'ps-gavimas' => 'Gavimas',
				'ps-tiekimas' => 'Tiekimas', 'ps-desk' => 'Užsakymai',
			);
			foreach ( $langai as $slug => $vardas ) {
				$nuorodos .= '<a class="' . ( $slug === self::SLUG ? 'on' : '' ) . '" href="'
					. esc_url( admin_url( 'admin.php?page=' . $slug ) ) . '">' . esc_html( $vardas ) . '</a>';
			}
		}
		echo '<div class="pskat-bar">'
			. '<div class="pskat-logo">PETSHOP</div>'
			. '<nav class="pskat-nav">' . $nuorodos . '</nav>'
			. '<form class="pskat-search" method="get" action="' . esc_url( admin_url( 'admin.php' ) ) . '">'
			. '<input type="hidden" name="page" value="' . esc_attr( self::SLUG ) . '">'
			. '<span class="lupa" aria-hidden="true">🔍</span>'
			. '<input type="search" name="q" value="' . esc_attr( isset( $_GET['q'] ) ? sanitize_text_field( wp_unslash( $_GET['q'] ) ) : '' ) . '" placeholder="Ieškoti rinkinio: pavadinimas arba SKU…">'
			. '</form>'
			. '<div class="pskat-meta">Rinkinių valdymas</div>'
			. '</div>';
	}

	/**
	 * Prekes aprasymas rinkinio sudeciai.
	 *
	 * PROBLEMA, kuria tai sprendzia: prekiu aprasymuose yra sekciju antrastes
	 * („Sudėtis", „Analizė", „Papildai", „Pagrindinis aprašymas"...). Ikelus
	 * toki teksta i rinkinio aprasyma, aprasymu akordeonas (snippet 512) jas
	 * atpazista ir issikerpa i atskiras sekcijas — rinkinio sudetis suira, o
	 * viduryje atsiranda svetimas „Sudėtis" blokas su vienos prekes sudetimi.
	 *
	 * Todel imam tik pirma prasminga pastraipa IKI pirmos sekcijos antrastes.
	 */
	private static function svarus_aprasas( $preke ) {
		$tekstas = trim( wp_strip_all_tags( $preke->get_short_description() ) );
		if ( $tekstas === '' ) {
			$tekstas = trim( wp_strip_all_tags( $preke->get_description() ) );
		}
		if ( $tekstas === '' ) { return ''; }

		/* Sekciju zymekliai — ties jais kerpam. Be /u nesugautu lietuvisku raidziu. */
		$zymekliai = array(
			'Sudėtis', 'Sudetis', 'Sudedamosios', 'Analizė', 'Analize',
			'Analitinės', 'Analitines', 'Papildai', 'Priedai', 'Maistiniai priedai',
			'Pagrindinis aprašymas', 'Pagrindinis aprasymas', 'Šėrimo', 'Serimo',
			'Rekomenduojama', 'Naudojimas', 'Laikymas', 'Gamintojas', 'Šalis',
			'Techninė', 'Techniniai', 'Sudėtinės', 'Energinė',
		);
		$riba = mb_strlen( $tekstas );
		foreach ( $zymekliai as $z ) {
			$poz = mb_stripos( $tekstas, $z );
			if ( $poz !== false && $poz < $riba && $poz > 0 ) { $riba = $poz; }
		}
		$tekstas = trim( mb_substr( $tekstas, 0, $riba ) );

		/* Pastraipa: imam pirma, o ne visa teksta */
		$dalys = preg_split( '/\n\s*\n/u', $tekstas );
		$tekstas = trim( $dalys[0] );

		/* Sutvarkom sujungtus sakinius: „...prisiglausti!Pagrindinis" */
		$tekstas = preg_replace( '/([.!?])(\p{Lu})/u', '$1 $2', $tekstas );
		$tekstas = preg_replace( '/\s+/u', ' ', $tekstas );

		if ( mb_strlen( $tekstas ) > 300 ) {
			$kirpta = mb_substr( $tekstas, 0, 300 );
			$tsk = mb_strrpos( $kirpta, '.' );
			$tekstas = ( $tsk !== false && $tsk > 120 ) ? mb_substr( $kirpta, 0, $tsk + 1 ) : $kirpta . '…';
		}
		return $tekstas;
	}

	/**
	 * Pilnas prekes aprasymas — po „Placiau". Rodomas su HTML (lentelemis,
	 * sarasais), nes ten daznai buna sudetis ir analize, o tai klientui svarbu.
	 * Isimam tik ta dali, kuri jau parodyta trumpai, kad nesikartotu.
	 */
	private static function pilnas_aprasas( $preke, $jau_rodoma = '' ) {
		$html = trim( (string) $preke->get_description() );
		if ( $html === '' ) { return ''; }

		/*
		 * VALYMAS. Prekiu aprasymuose (ypac importuotuose) buna:
		 *   - <style> blokai (.b2b-black { color:#000 !important; }) — be valymo
		 *     jie issilieja i puslapi kaip tekstas;
		 *   - <div>/<section> su savo klasemis ir grid stiliais — jie suardo
		 *     rinkinio isdestyma i stulpelius;
		 *   - inline style="" atributai, kurie perima musu apipavidalinima.
		 * Todel paliekam tik teksto zymes, be klasiu ir stiliu.
		 */
		$html = preg_replace( '#<style\b[^>]*>.*?</style>#is', '', $html );
		$html = preg_replace( '#<script\b[^>]*>.*?</script>#is', '', $html );
		/* CSS likuciai, likę be zymiu: „.klase { ... }" */
		$html = preg_replace( '/\.[a-z0-9_-]+\s*(,\s*\.[a-z0-9_ *-]+)*\s*\{[^}]*\}/i', '', $html );

		if ( $jau_rodoma !== '' ) {
			$plikas  = trim( wp_strip_all_tags( $html ) );
			$pradzia = mb_substr( $plikas, 0, mb_strlen( $jau_rodoma ) );
			if ( mb_strtolower( $pradzia ) === mb_strtolower( $jau_rodoma ) ) {
				$uodega = mb_substr( $jau_rodoma, -40 );
				$poz = mb_strpos( $html, $uodega );
				if ( $poz !== false ) { $html = trim( mb_substr( $html, $poz + mb_strlen( $uodega ) ) ); }
			}
		}

		$leidziamos = array(
			'p' => array(), 'br' => array(), 'strong' => array(), 'b' => array(),
			'em' => array(), 'i' => array(), 'u' => array(),
			'ul' => array(), 'ol' => array(), 'li' => array(),
			'h3' => array(), 'h4' => array(), 'h5' => array(), 'h6' => array(),
			'table' => array(), 'thead' => array(), 'tbody' => array(),
			'tr' => array(), 'td' => array(), 'th' => array(),
			'span' => array(),
		);
		$html = wp_kses( $html, $leidziamos );
		$html = force_balance_tags( $html );
		$html = preg_replace( '/(<p>\s*<\/p>|<span>\s*<\/span>)/', '', $html );
		$html = trim( $html );

		if ( trim( wp_strip_all_tags( $html ) ) === '' ) { return ''; }
		return $html;
	}

	/**
	 * Aprasymo skirtukas rinkiniams.
	 *
	 * Aprasymu akordeonas (snippet 512) kabinasi ant `woocommerce_product_tabs`
	 * ir skaido teksta i sekcijas pagal antrastes („Sudėtis", „Analizė"...).
	 * Rinkinio aprasyme tokiu antrasciu yra — bet jos priklauso KOMPONENTAMS,
	 * ne rinkiniui. Todel akordeonas issikirpdavo vienos prekes sudeti i atskira
	 * sekcija, o rinkinio sudetis suirdavo.
	 *
	 * Rinkiniams paliekam paprasta skirtuka su musu strukturuota turiniu.
	 */
	public static function tabai( $tabs ) {
		global $product;
		if ( ! $product || ! is_a( $product, 'WC_Product' ) ) { return $tabs; }
		$pid = $product->get_id();
		$rinkinys = ( get_post_meta( $pid, self::META_KIEKIAI, true ) !== '' )
			|| ( get_post_meta( $pid, '_dp_base_product_id', true ) !== '' );
		if ( ! $rinkinys ) { return $tabs; }

		$leisti = array( 'description', 'additional_information', 'reviews' );
		foreach ( array_keys( $tabs ) as $raktas ) {
			if ( ! in_array( $raktas, $leisti, true ) ) { unset( $tabs[ $raktas ] ); }
		}
		if ( isset( $tabs['description'] ) ) {
			$tabs['description']['title']    = 'Aprašymas';
			$tabs['description']['priority'] = 10;
			$tabs['description']['callback'] = array( __CLASS__, 'aprasymo_turinys' );
		}
		return $tabs;
	}

	public static function aprasymo_turinys() {
		global $post;
		echo '<div class="ps-rink-aprasymas">';
		echo wp_kses_post( wpautop( do_shortcode( $post->post_content ) ) );
		echo '</div>';
	}

	/**
	 * Sunki siunta i pastomata netelpa.
	 *
	 * Virs PASTOMATO_RIBA kg klientui pastomatu pasirinkimas issijungia — lieka
	 * tik kurjeris. Tikrinam VISO krepselio svori, ne vienos prekes: du 15 kg
	 * maisai atskirai telpa, kartu — ne.
	 *
	 * Metodus atpazistam pagal pavadinima ir ID, nes vezejai vadinami ivairiai
	 * (venipak pickup point, omniva terminal, DPD locker...).
	 */
	/** v1.44 (S1601): ar bent viena sudedamoji pazymeta „Tik kurjeriu“. */
	public static function paveldeti_kurjeri( $prod, array $komponentu_ids ) {
		$yes = false;
		foreach ( $komponentu_ids as $cid ) { if ( get_post_meta( (int) $cid, '_ps_tik_kurjeriu', true ) === 'yes' ) { $yes = true; break; } }
		if ( $yes ) { $prod->update_meta_data( '_ps_tik_kurjeriu', 'yes' ); } else { $prod->delete_meta_data( '_ps_tik_kurjeriu' ); }
		return $yes;
	}

	public static function pastomato_sargas( $rates, $package ) {
		if ( is_admin() && ! wp_doing_ajax() ) { return $rates; }
		$kg = 0.0; $tik_kurjeriu = false;
		foreach ( (array) ( $package['contents'] ?? array() ) as $eil ) {
			$p = $eil['data'] ?? null;
			if ( ! $p || ! is_a( $p, 'WC_Product' ) ) { continue; }
			/* v1.44 (S1601): varnele „Tik kurjeriu“ — tikrinama VISOMS eilutems, iskaitant MnM vaikus */
			if ( get_post_meta( $p->get_id(), '_ps_tik_kurjeriu', true ) === 'yes' ) { $tik_kurjeriu = true; }
			if ( ! empty( $eil['mnm_child_id'] ) ) { continue; }   /* vaikai — svorio nesidubliuoti */
			$w = (float) $p->get_weight();
			if ( $w > 0 ) { $kg += $w * (int) $eil['quantity']; }
		}
		if ( ! $tik_kurjeriu && $kg <= self::PASTOMATO_RIBA ) { return $rates; }

		$zodziai = array( 'pastomat', 'paštomat', 'terminal', 'locker', 'pickup', 'atsiemim', 'parcel' );
		foreach ( $rates as $raktas => $tarifas ) {
			$tekstas = mb_strtolower( $raktas . ' ' . $tarifas->get_label() );
			foreach ( $zodziai as $z ) {
				if ( mb_strpos( $tekstas, $z ) !== false ) { unset( $rates[ $raktas ] ); break; }
			}
		}
		return $rates;
	}

	/** Ar dabar rodomas rinkinio (arba DP pako) puslapis. Kesuojam — gettext
	 *  kvieciamas simtus kartu viename uzklausime. */
	private static function rinkinio_puslapis() {
		static $atsakymas = null;
		if ( $atsakymas !== null ) { return $atsakymas; }
		if ( ! function_exists( 'is_product' ) || ! is_product() ) { return $atsakymas = false; }
		global $post;
		if ( ! $post ) { return $atsakymas = false; }
		$atsakymas = ( get_post_meta( $post->ID, self::META_KIEKIAI, true ) !== '' )
			|| ( get_post_meta( $post->ID, '_dp_base_product_id', true ) !== '' );
		return $atsakymas;
	}

	/**
	 * Mix and Match vertimai.
	 *
	 * Pluginas neisverstas: klientas mato „PRODUCT / QUANTITY",
	 * „You have selected 3 items. Add to cart to continue…" ir „(3/3 items)".
	 * Verciam per gettext — taip nereikia liesti plugino failu, kurie dings per
	 * atnaujinima.
	 */
	public static function vertimai( $vertimas, $tekstas, $domenas ) {
		/*
		 * Domeno netikrinam: Mix and Match viduje naudoja kelis („wc-mnm",
		 * „woocommerce-mix-and-match-products"), o lenteles antrastes „PRODUCT"
		 * ir „QUANTITY" ejo pro sali, kai filtravau tik pagal viena. Vietoj to
		 * ribojam pagal VIETA — verciam tik rinkinio puslapyje, kad nepaliestume
		 * likusios parduotuves.
		 */
		if ( is_admin() || ! self::rinkinio_puslapis() ) { return $vertimas; }
		$zodynas = array(
			'Product'                => 'Prekė',
			'PRODUCT'                => 'Prekė',
			'Products'               => 'Prekės',
			'Quantity'               => 'Kiekis',
			'QUANTITY'               => 'Kiekis',
			'Qty'                    => 'Kiekis',
			'Price'                  => 'Kaina',
			'Subtotal'               => 'Suma',
			'Total'                  => 'Iš viso',
			'Description'            => 'Aprašymas',
			'Select options'         => 'Pasirinkti',
			'Choose an option'       => 'Pasirinkite',
			'Clear'                  => 'Išvalyti',
			'Clear selections'       => 'Išvalyti pasirinkimus',
			'Reset selections'       => 'Išvalyti pasirinkimus',
			'In stock'               => 'Turime',
			'Out of stock'           => 'Neturime',
			'Add to cart to continue&hellip;' => 'Įsidėkite į krepšelį',
			'Add to cart to continue…'        => 'Įsidėkite į krepšelį',
		);
		if ( isset( $zodynas[ $tekstas ] ) ) { return $zodynas[ $tekstas ]; }

		/* Frazes su skaiciais — keiciam pagal dali, nes tikslus formatas kinta */
		if ( mb_strpos( $tekstas, 'You have selected' ) !== false ) {
			return str_replace(
				array( 'You have selected', 'items', 'item', 'Add to cart to continue&hellip;', 'Add to cart to continue…', '.' ),
				array( 'Pasirinkote', 'vnt.', 'vnt.', 'Įsidėkite į krepšelį', 'Įsidėkite į krepšelį', '.' ),
				$tekstas
			);
		}
		if ( mb_strpos( $tekstas, 'Please select' ) !== false ) {
			return str_replace(
				array( 'Please select', 'more items', 'more item', 'items', 'item' ),
				array( 'Pasirinkite dar', 'vnt.', 'vnt.', 'vnt.', 'vnt.' ),
				$tekstas
			);
		}
		if ( $tekstas === '%1$s / %2$s items' || $tekstas === '%s items' ) { return str_replace( 'items', 'vnt.', $tekstas ); }
		return $vertimas;
	}

	public static function vertimai_kontekste( $vertimas, $tekstas, $kontekstas, $domenas ) {
		return self::vertimai( $vertimas, $tekstas, $domenas );
	}

	public static function vertimai_daugiskaita( $vertimas, $vienas, $daug, $skaicius, $domenas ) {
		if ( is_admin() || ! self::rinkinio_puslapis() ) { return $vertimas; }
		$sablonas = ( $skaicius === 1 ) ? $vienas : $daug;
		return str_replace( array( 'items', 'item' ), array( 'vnt.', 'vnt.' ), $sablonas );
	}

	/**
	 * Komponento bukle rinkinio sudetyje — be skaiciu.
	 *
	 * Kiek konkreciai turim vienos prekes, klientui ne tik nesvarbu, bet ir
	 * klaidina: jis perka rinkini, ne ta preke atskirai. „Liko 2 vnt." salia
	 * komponento skaitosi kaip rinkinio likutis, nors reiskia visai kita.
	 * Todel cia tik „Turime" arba „Neturime".
	 *
	 * Liecia TIK komponentus — pacio rinkinio bukle lieka kaip buvo.
	 */
	public static function komponento_bukle( $tekstas, $preke ) {
		if ( is_admin() || ! self::rinkinio_puslapis() ) { return $tekstas; }
		global $post;
		if ( $post && $preke && (int) $preke->get_id() === (int) $post->ID ) { return $tekstas; }
		if ( ! $preke ) { return $tekstas; }
		return $preke->is_in_stock() ? 'Turime' : 'Neturime';
	}

	/**
	 * „Sutaupote X €" po kaina.
	 *
	 * Stipriausias pardavimo argumentas ir vienintelis skaicius, kurio klientas
	 * pats neapskaiciuos. DP pakai ji jau turi (snippet 570) — rinkiniams
	 * pridedam cia, kad butu vienodai.
	 */
	public static function sutaupote() {
		global $product;
		if ( ! $product || ! is_a( $product, 'WC_Product' ) ) { return; }
		$pid = $product->get_id();
		if ( get_post_meta( $pid, '_dp_base_product_id', true ) ) { return; }   /* DP tvarko 570 */

		$kiekiai = self::kiekiai( $pid );
		if ( ! $kiekiai ) { return; }

		$atskirai = 0; $vnt = 0;
		foreach ( $kiekiai as $cid => $kiek ) {
			$c = wc_get_product( (int) $cid );
			if ( ! $c ) { return; }
			$kaina = (float) $c->get_price();
			if ( $kaina <= 0 ) { return; }
			$atskirai += $kaina * max( 1, (int) $kiek );
			$vnt += max( 1, (int) $kiek );
		}
		$rinkinio = (float) $product->get_price();
		if ( $rinkinio <= 0 || $atskirai <= $rinkinio ) { return; }

		$skirtumas = $atskirai - $rinkinio;
		$proc = round( $skirtumas / $atskirai * 100 );
		/* v1.36: po 3 % nauda nerodoma — „Sutaupote 0,28 € (1%)" kenkia labiau nei padeda. */
		if ( $proc < self::NAUDA_MIN_PROC ) { return; }
		?>
		<div class="ps-rink-nauda">
			<table>
				<tr><td>Rinkinyje</td><td class="ps-r"><b><?php echo (int) $vnt; ?> vnt.</b></td></tr>
				<tr><td>Perkant atskirai</td><td class="ps-r ps-sen"><?php echo wp_kses_post( wc_price( $atskirai ) ); ?></td></tr>
				<tr class="ps-taupo"><td><b>Sutaupote</b></td>
					<td class="ps-r"><b><?php echo wp_kses_post( wc_price( $skirtumas ) ); ?> (<?php echo (int) $proc; ?>%)</b></td></tr>
			</table>
		</div>
		<?php
	}

	/** Rinkinio sudeties isvaizda prekes puslapyje. */
	public static function front_klase( $klases ) {
		if ( is_product() ) {
			global $post;
			$pr = $post ? wc_get_product( $post->ID ) : null;
			if ( $pr && ( $pr->is_type( 'mix-and-match' ) || get_post_meta( $post->ID, self::META_KIEKIAI, true ) ) ) {
				$klases[] = 'ps-fiksuotas-rinkinys';
				if ( ! self::nauda_verta( (int) $post->ID ) ) { $klases[] = 'ps-rink-be-naudos'; }
			}
		}
		return $klases;
	}

	/** v1.40: prekes puslapio HTML narsykle nekesuoja — visada perklausia serverio. */
	public static function be_keso() {
		if ( is_admin() || ! function_exists( 'is_product' ) ) { return; }
		if ( is_product() ) { nocache_headers(); }
	}

	/** v1.36: ar nauda verta rodyti (>= 3 %). Ta pati riba naudojama ir CSS klasei. */
	public static function nauda_verta( $pid ) {
		$kiekiai = self::kiekiai( $pid );
		if ( ! $kiekiai ) { return false; }
		$p = wc_get_product( $pid );
		if ( ! $p ) { return false; }
		$atskirai = 0;
		foreach ( $kiekiai as $cid => $kiek ) {
			$c = wc_get_product( (int) $cid );
			if ( ! $c ) { return false; }
			$k = (float) $c->get_price();
			if ( $k <= 0 ) { return false; }
			$atskirai += $k * max( 1, (int) $kiek );
		}
		$kaina = (float) $p->get_price();
		if ( $kaina <= 0 || $atskirai <= $kaina ) { return false; }
		return round( ( $atskirai - $kaina ) / $atskirai * 100 ) >= self::NAUDA_MIN_PROC;
	}

	/** Zenklo tekstas paduodamas per inline stiliu (patikimiau nei HTML perrasymas). */
	public static function galerijos_klases( $klases ) {
		if ( self::rinkinio_puslapis() ) { $klases[] = 'ps-rink-galerija'; }
		return $klases;
	}


	public static function front_stilius() {
		if ( is_admin() ) { return; }
		/* v1.42 — GREITA PERZIURA LIEKA (savininkas: neisjungti), bet modale ta pati
		   vitrina kaip prekes puslapyje. Selektoriai per form.mnm_form — nepriklauso
		   nuo body klases, todel veikia ir archyve, ir modale. */
		?>
		<style id="ps-rink-qv">
		.mfp-content .product-info .price,.mfp-content .product-info .price ins,.mfp-content .product-info .price .amount{color:#2a2a2a!important;font-weight:700}
		.mfp-content .product-info .price del,.mfp-content .product-info .price del .amount{color:#999!important;font-weight:400;font-size:.8em;margin-right:6px}
		.mfp-content .petshop-savings,.mfp-content form.mnm_form .mnm_reset,.mfp-content form.mnm_form .mnm_reset_link,.mfp-content form.mnm_form .mnm_message,
		.mfp-content form.mnm_form .mnm_status,.mfp-content form.mnm_form .mnm-container-status,.mfp-content form.mnm_form .mnm_price_container{display:none!important}
		.mfp-content form.mnm_form .mnm_child_products,.mfp-content form.mnm_form>table{border:1px solid #e4e4e4!important;border-radius:4px;background:#fff;margin:0 0 18px!important;padding:0 14px 4px;width:100%}
		.mfp-content form.mnm_form .mnm_child_products::before{content:"Rinkinio sudėtis";display:block;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#365a51;padding:11px 0 7px;border-bottom:1px solid #e9e9e9}
		.mfp-content form.mnm_form thead,.mfp-content form.mnm_form th{display:none!important}
		.mfp-content form.mnm_form tbody{display:block!important;border:0!important;background:transparent!important}
		.mfp-content form.mnm_form tbody tr{display:flex!important;align-items:center;gap:12px;padding:7px 0;line-height:1.3;border:0!important;border-bottom:1px solid #f0f0f0!important;background:transparent!important;margin:0!important;min-height:0!important;height:auto!important}
		.mfp-content form.mnm_form tbody tr:last-child{border-bottom:0!important}
		.mfp-content form.mnm_form tbody td{display:block!important;padding:0!important;border:0!important;width:auto!important;text-align:left!important;background:transparent!important;font-size:13.5px;line-height:1.3;height:auto!important}
		.mfp-content form.mnm_form tbody td.product-thumbnail,.mfp-content form.mnm_form tbody td:first-child{flex:none;width:56px!important;margin:0!important}
		.mfp-content form.mnm_form tbody td.product-thumbnail *{display:block;padding:0!important;margin:0!important;line-height:0}
		.mfp-content form.mnm_form tbody td.product-thumbnail figure{height:56px!important;width:56px!important;overflow:hidden}
		.mfp-content form.mnm_form tbody td img{width:56px!important;height:56px!important;max-width:none!important;object-fit:contain;background:#fff!important;border:1px solid #eee;border-radius:4px}
		.mfp-content form.mnm_form tbody td.product-details,.mfp-content form.mnm_form tbody td.product-name{flex:1 1 auto;font-weight:600;color:#2a2a2a!important;margin:0!important}
		.mfp-content form.mnm_form tbody td.product-details *{padding:0!important;margin:0!important}
		.mfp-content form.mnm_form tbody td.product-details a,.mfp-content form.mnm_form tbody td.product-name a{color:#2a2a2a!important;text-decoration:none;pointer-events:none;cursor:default}
		.mfp-content form.mnm_form tbody td [class*="stock"],.mfp-content form.mnm_form tbody td [class*="availab"],.mfp-content form.mnm_form tbody td.product-details p,
		.mfp-content form.mnm_form tbody td.product-quantity,.mfp-content form.mnm_form tbody td.product-price,.mfp-content form.mnm_form .mnm_child_products .quantity{display:none!important}
		.mfp-content form.mnm_form tbody tr::after{content:"× " attr(data-kiekis-rodyti);flex:none;margin-left:auto;background:#365a51;color:#fff;font-size:12px;font-weight:700;padding:5px 10px;border-radius:12px;line-height:1}
		.mfp-content form.mnm_form tbody tr:not([data-kiekis-rodyti])::after{content:"× 1"}
		.mfp-content form.mnm_form>.quantity{display:inline-flex;margin-right:10px}
		</style>
		<script id="ps-rink-qv-js">
		(function(){var LT={'product':'Prekė','quantity':'Kiekis','price':'Kaina','details':'Prekė'};
		function n(){var f=document.querySelectorAll('.mfp-content form.mnm_form');if(!f.length)return;
		 f.forEach(function(form){form.querySelectorAll('th').forEach(function(h){var k=h.textContent.trim().toLowerCase();if(LT[k])h.textContent=LT[k];});
		  form.querySelectorAll('td.product-details a,td.product-name a').forEach(function(l){var t=document.createElement('span');t.textContent=l.textContent;l.replaceWith(t);});
		  form.querySelectorAll('tr.mnm_item,tr[data-mnm_item_id]').forEach(function(row){var i=row.querySelector('input.qty,input[type=number],input[name^=mnm_quantity]');var q=i?(parseInt(i.getAttribute('max')||i.value)||1):1;row.setAttribute('data-kiekis-rodyti',q);});});}
		setInterval(n,400);})();
		</script>
		<?php
		if ( ! is_product() ) { return; }

		/* Zenklo tekstas — i CSS kintamaji, kad nereiktu perrasyti galerijos HTML */
		$zenklas = '';
		global $post;
		if ( $post ) {
			$kiekiai = self::kiekiai( $post->ID );
			if ( $kiekiai ) {
				$vnt = array_sum( array_map( 'intval', $kiekiai ) );
				$zodis = ( $vnt === 1 ) ? 'PREKĖ' : ( ( $vnt % 10 >= 2 && $vnt % 10 <= 9 && ( $vnt % 100 < 10 || $vnt % 100 >= 20 ) ) ? 'PREKĖS' : 'PREKIŲ' );
				$zenklas = $vnt . '\A' . $zodis;
			}
		}
		?>
		<?php if ( $zenklas ) : ?>
		<style>body.ps-fiksuotas-rinkinys{--ps-rink-zenklas:"<?php echo esc_html( $zenklas ); ?>"}</style>
		<?php endif; ?>
		<style>
		.ps-rink-sudetis{margin:14px 0}
		.ps-rink-preke{display:flex;gap:14px;align-items:flex-start;padding:12px 0;border-bottom:1px solid #eee}
		.ps-rink-preke:last-child{border-bottom:0}
		.ps-rink-img{flex:none;width:74px}
		.ps-rink-img img{width:74px;height:74px;object-fit:contain;background:#fff;border:1px solid #eee;border-radius:4px}
		.ps-rink-tekstas h4{margin:0 0 5px;font-size:15px;line-height:1.35}
		.ps-rink-tekstas p{margin:0;color:#555;font-size:14px;line-height:1.5}
		/* Rinkinio zenklas ant nuotraukos — CSS, ne idegintas i paveiksla.
		   Pakeitus sudeti skaicius atsinaujina pats, o nuotraukos perpiesti nereikia. */
		body.ps-fiksuotas-rinkinys .woocommerce-product-gallery{position:relative}
		body.ps-fiksuotas-rinkinys .woocommerce-product-gallery::before{
			content:var(--ps-rink-zenklas,"");position:absolute;top:14px;left:14px;z-index:5;
			background:#2e5c48;color:#fff;border-radius:50%;width:64px;height:64px;
			display:grid;place-items:center;text-align:center;font-size:11.5px;font-weight:700;line-height:1.15;
			white-space:pre-line;pointer-events:none}
		.ps-rink-nauda{background:#f6f8f6;border:1px solid #dfe7df;border-radius:4px;padding:10px 14px;margin:14px 0}
		.ps-rink-nauda table{width:100%;border-collapse:collapse;font-size:14px}
		.ps-rink-nauda td{padding:3px 0;border:0}
		.ps-rink-nauda .ps-r{text-align:right}
		.ps-rink-nauda .ps-sen{color:#888;text-decoration:line-through}
		.ps-rink-nauda .ps-taupo td{color:#2e5c48;padding-top:7px;border-top:1px solid #dfe7df;font-size:15px}
		/* Fiksuotam rinkiniui klientas nieko nesirenka — pasirinkimo valdikliai
		   tik klaidina. Kiekiai jau nustatyti, todel slepiam „Isvalyti" ir bukles
		   eilute; sudeties lentele lieka matoma. */
		body.ps-fiksuotas-rinkinys .mnm_reset,
		body.ps-fiksuotas-rinkinys .mnm_reset_link,
		body.ps-fiksuotas-rinkinys .mnm-reset,
		body.ps-fiksuotas-rinkinys a.reset_variations,
		body.ps-fiksuotas-rinkinys .mnm_message,
		body.ps-fiksuotas-rinkinys .mnm_status,
		body.ps-fiksuotas-rinkinys .mnm-container-status{display:none!important}
		/*
		 * Lenteles antrastes „PRODUCT" / „QUANTITY".
		 *
		 * Bandyta versti per gettext ir gettext_with_context — nepavyko nei karto:
		 * sablone jos irasytos tiesiai, be vertimo funkcijos, todel i WordPress
		 * vertimu sluoksni is viso nepatenka. Vietoj to keiciam per CSS —
		 * veikia nepriklausomai nuo to, kaip tekstas atsiranda, ir isliks po
		 * plugino atnaujinimo.
		 */
		body.ps-fiksuotas-rinkinys th.product-details,
		body.ps-fiksuotas-rinkinys th.product-quantity,
		body.ps-fiksuotas-rinkinys th.product-price{font-size:0!important;line-height:0!important}
		body.ps-fiksuotas-rinkinys th.product-details::after{content:"Prekė"}
		body.ps-fiksuotas-rinkinys th.product-quantity::after{content:"Kiekis"}
		body.ps-fiksuotas-rinkinys th.product-price::after{content:"Kaina"}
		body.ps-fiksuotas-rinkinys th.product-details::after,
		body.ps-fiksuotas-rinkinys th.product-quantity::after,
		body.ps-fiksuotas-rinkinys th.product-price::after{
			font-size:13px;line-height:1.4;font-weight:600;letter-spacing:.3px;display:inline-block}
		/* Kiekio laukelis fiksuotam rinkiniui — tik skaicius, be redagavimo */
		body.ps-fiksuotas-rinkinys .mnm-quantity{pointer-events:none;background:transparent;border:0;text-align:center}
		body.ps-fiksuotas-rinkinys .mnm_price .amount{font-weight:600}
		.ps-rink-daugiau{margin-top:8px}
		.ps-rink-daugiau>summary{cursor:pointer;color:#2e5c48;font-size:13.5px;font-weight:600;list-style:none;display:inline-flex;align-items:center;gap:6px;padding:3px 0}
		.ps-rink-daugiau>summary::-webkit-details-marker{display:none}
		.ps-rink-daugiau>summary::after{content:'▾';font-size:11px;transition:transform .15s}
		.ps-rink-daugiau[open]>summary::after{transform:rotate(180deg)}
		.ps-rink-daugiau>summary:hover{color:#1d4030}
		.ps-rink-pilnas{margin-top:8px;padding:12px 14px;background:#f7f7f5;border-radius:4px;font-size:13.5px;line-height:1.6;color:#444;overflow-x:auto;max-width:100%;display:block!important;column-count:initial!important}
		.ps-rink-pilnas *{max-width:100%;float:none!important;position:static!important;display:revert}
		.ps-rink-sudetis,.ps-rink-preke,.ps-rink-tekstas{display:block;column-count:initial!important}
		.ps-rink-preke{display:flex!important}
		.ps-rink-pilnas h1,.ps-rink-pilnas h2,.ps-rink-pilnas h3,.ps-rink-pilnas h4{font-size:14px;margin:12px 0 4px;color:#2e5c48}
		.ps-rink-pilnas h1:first-child,.ps-rink-pilnas h2:first-child,.ps-rink-pilnas h3:first-child{margin-top:0}
		.ps-rink-pilnas p{margin:0 0 8px}
		.ps-rink-pilnas ul,.ps-rink-pilnas ol{margin:0 0 8px 18px}
		.ps-rink-pilnas table{width:100%;border-collapse:collapse;margin:6px 0}
		.ps-rink-pilnas td,.ps-rink-pilnas th{padding:4px 8px;border-bottom:1px solid #e5e5e0;text-align:left}
		@media(max-width:600px){.ps-rink-img{width:56px}.ps-rink-img img{width:56px;height:56px}}
		/* ===== v1.29: vitrina temos stiliumi (perima #524) ===== */
		body.ps-fiksuotas-rinkinys .woocommerce-product-gallery::before{background:#365a51}
		body.ps-fiksuotas-rinkinys .product-info .price,body.ps-fiksuotas-rinkinys .price-wrapper .price,
		body.ps-fiksuotas-rinkinys .product-info .price ins,body.ps-fiksuotas-rinkinys .product-info .price ins .amount,
		body.ps-fiksuotas-rinkinys .product-info .price .amount{color:#2a2a2a!important;font-weight:700}
		body.ps-fiksuotas-rinkinys .product-info .price{font-size:1.5em;margin-bottom:.6em}
		body.ps-fiksuotas-rinkinys .product-info .price del,body.ps-fiksuotas-rinkinys .product-info .price del .amount{color:#999!important;font-weight:400;font-size:.8em;margin-right:6px}
		body.ps-fiksuotas-rinkinys .product-info .price ins{text-decoration:none}
		body.ps-fiksuotas-rinkinys .petshop-savings{display:none!important}
		body.ps-rink-be-naudos .product-info .price del,body.ps-rink-be-naudos .ps-rink-nauda{display:none!important}
		body.ps-fiksuotas-rinkinys .ps-rink-nauda{background:#f3f7f3;border-color:#d6e3d3;margin:0 0 16px}
		body.ps-fiksuotas-rinkinys .ps-rink-nauda .ps-taupo td{color:#365a51;border-top-color:#d6e3d3}
		body.ps-fiksuotas-rinkinys form.cart .mnm_child_products,
		body.ps-fiksuotas-rinkinys form.cart>table{border:1px solid #e4e4e4!important;border-radius:4px;background:#fff;margin:0 0 18px!important;padding:0 14px 4px;width:100%}
		body.ps-fiksuotas-rinkinys form.cart .mnm_child_products::before{content:"Rinkinio sudėtis";display:block;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#365a51;padding:11px 0 7px;border-bottom:1px solid #e9e9e9}
		body.ps-fiksuotas-rinkinys form.cart thead,body.ps-fiksuotas-rinkinys form.cart th{display:none!important}
		body.ps-fiksuotas-rinkinys form.cart tbody{display:block!important;border:0!important;background:transparent!important}
		body.ps-fiksuotas-rinkinys form.cart tbody tr{display:flex!important;align-items:center;gap:12px;padding:7px 0;line-height:1.3;border:0!important;border-bottom:1px solid #f0f0f0!important;background:transparent!important;margin:0!important;border-radius:0!important}
		body.ps-fiksuotas-rinkinys form.cart tbody tr:last-child{border-bottom:0!important}
		body.ps-fiksuotas-rinkinys form.cart tbody td{display:block!important;padding:0!important;border:0!important;width:auto!important;text-align:left!important;background:transparent!important;font-size:13.5px}
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-thumbnail,
		body.ps-fiksuotas-rinkinys form.cart tbody td:first-child{flex:none;width:56px!important;margin:0!important}
		body.ps-fiksuotas-rinkinys form.cart tbody td img{width:56px!important;height:56px!important;max-width:none!important;object-fit:contain;background:#fff!important;border:1px solid #eee;border-radius:4px;display:block;margin:0!important}
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-details,
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-name{flex:1 1 auto;font-weight:600;line-height:1.35;color:#2a2a2a!important;margin:0!important}
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-details>*{margin:0!important}
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-details *{padding:0!important;margin:0!important;min-height:0!important}
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-thumbnail *{display:block;padding:0!important;margin:0!important;line-height:0;min-height:0!important}
		body.ps-fiksuotas-rinkinys form.cart tbody tr{min-height:0!important;height:auto!important}
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-thumbnail figure{height:56px!important;width:56px!important;overflow:hidden}
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-thumbnail figure::before,body.ps-fiksuotas-rinkinys form.cart tbody td.product-thumbnail figure::after,
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-thumbnail .image-tools{display:none!important}
		body.ps-fiksuotas-rinkinys form.cart tbody td{line-height:1.3;height:auto!important;min-height:0!important}
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-details a,
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-name a,
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-details a{color:#2a2a2a!important;text-decoration:none;pointer-events:none;cursor:default}
		body.ps-fiksuotas-rinkinys form.cart tbody td .stock,body.ps-fiksuotas-rinkinys form.cart tbody td p.stock,
		body.ps-fiksuotas-rinkinys form.cart tbody td [class*="stock"],body.ps-fiksuotas-rinkinys form.cart tbody td [class*="availab"],
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-details p,body.ps-fiksuotas-rinkinys form.cart tbody td.product-details br,
		body.ps-fiksuotas-rinkinys form.cart tbody td .mnm_child_product_short_description,
		body.ps-fiksuotas-rinkinys form.cart tbody td.product-quantity,body.ps-fiksuotas-rinkinys form.cart tbody td.product-price,
		body.ps-fiksuotas-rinkinys form.cart .mnm_child_products .quantity,body.ps-fiksuotas-rinkinys form.cart .mnm_child_products input.qty,
		body.ps-fiksuotas-rinkinys form.cart .mnm_child_products .plus,body.ps-fiksuotas-rinkinys form.cart .mnm_child_products .minus{display:none!important}
		body.ps-fiksuotas-rinkinys form.cart tbody tr::after{content:"× " attr(data-kiekis-rodyti);flex:none;margin-left:auto;background:#365a51;color:#fff;font-size:12px;font-weight:700;padding:5px 10px;border-radius:12px;line-height:1}
		body.ps-fiksuotas-rinkinys form.cart tbody tr:not([data-kiekis-rodyti])::after{content:"× 1"}
		body.ps-fiksuotas-rinkinys form.cart>.quantity{display:inline-flex;margin-right:10px}
		body.ps-fiksuotas-rinkinys form.cart td.product-thumbnail a{cursor:zoom-in}
		.ps-lb{position:fixed;inset:0;z-index:99999;background:rgba(20,25,22,.88);display:flex;align-items:center;justify-content:center;cursor:zoom-out;padding:24px}
		.ps-lb img{max-width:min(92vw,900px);max-height:90vh;background:#fff;border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,.4)}
		.ps-lb-x{position:absolute;top:14px;right:22px;color:#fff;font-size:40px;line-height:1;font-weight:300}
		body.ps-fiksuotas-rinkinys .product-short-description{margin-bottom:14px}
		</style>
		<?php if ( $post && ! empty( $kiekiai ) ) : ?>
		<script id="ps-rink-vitrina">
		(function(){var Q=<?php echo wp_json_encode( array_map( 'intval', $kiekiai ) ); ?>;
		var LT={'product':'Prekė','quantity':'Kiekis','price':'Kaina','details':'Prekė','total':'Viso'};
		function th(){document.querySelectorAll('form.cart th').forEach(function(h){var k=h.textContent.trim().toLowerCase();if(LT[k])h.textContent=LT[k];});}
		function nuorodos(){document.querySelectorAll('form.cart td.product-details a,form.cart td.product-name a').forEach(function(l){var t=document.createElement('span');t.textContent=l.textContent;l.replaceWith(t);});}
		function f(){th();nuorodos();var r=document.querySelectorAll('form.cart tr.mnm_item,form.cart tr[data-mnm_item_id]');if(!r.length)return false;
		 r.forEach(function(row){var pid=row.getAttribute('data-mnm_item_id')||row.getAttribute('data-child_id');if(!pid)return;var n=Q[pid]||1;row.setAttribute('data-kiekis-rodyti',n);
		  var i=row.querySelector('input.qty,input[type=number],input[name^=mnm_quantity]');if(i&&String(i.value)!==String(n)){i.value=n;try{i.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}if(window.jQuery){jQuery(i).trigger('change');}}});return true;}
		var t=0,iv=setInterval(function(){if(f()||++t>25)clearInterval(iv);},200);window.addEventListener('load',function(){setTimeout(f,300);setTimeout(f,1500);});
		/* v1.33/1.34: nuotrauka — tik lightbox, jokio perejimo (savas, be priklausomybiu) */
		function lbOpen(src,alt){var w=document.createElement('div');w.className='ps-lb';w.innerHTML='<img src="'+src+'" alt="'+(alt||'').replace(/"/g,'')+'"><span class="ps-lb-x">×</span>';
		 function close(){w.remove();document.removeEventListener('keydown',esc);} function esc(e){if(e.key==='Escape')close();}
		 w.addEventListener('click',close);document.addEventListener('keydown',esc);document.body.appendChild(w);}
		function lb(){var a=document.querySelectorAll('form.cart td.product-thumbnail a:not([data-ps-lb])');if(!a.length)return false;
		 a.forEach(function(x){x.setAttribute('data-ps-lb','1');x.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var img=this.querySelector('img');
		  lbOpen(this.getAttribute('data-large_image')||(img&&img.getAttribute('data-large_image'))||this.getAttribute('href')||(img&&img.src),this.getAttribute('title'));},true);});return true;}
		var t2=0,iv2=setInterval(function(){if(lb()||++t2>25)clearInterval(iv2);},250);})();
		</script>
		<?php endif; ?>
		<?php
	}

	/* ==================== PAGALBINES ==================== */

	/**
	 * Savikaina. Eiliskumas TOKS PAT kaip snippet 539/550 — kitaip tas pats
	 * rinkinys dviejuose languose rodytu skirtinga marza.
	 */
	public static function savikaina( $pid ) {
		foreach ( array( '_cost_price', '_vf_cost', '_zb_cost' ) as $raktas ) {
			$v = get_post_meta( $pid, $raktas, true );
			if ( $v !== '' && $v !== false && $v !== null ) { return (float) $v; }
		}
		return null;
	}

	/* ==================== v1.25: LIKUCIO UZRAKTAS ==================== */

	/**
	 * Ar preke yra rinkinys (MnM) arba DP pakas. Kesuojama uzklausos ribose,
	 * nes update_post_metadata filtras kvieciamas del KIEKVIENO meta iraso
	 * visame WP — turi buti pigus.
	 */
	public static function ar_rinkinys( $pid ) {
		static $kesas = array();
		$pid = (int) $pid;
		if ( ! $pid ) { return false; }
		if ( isset( $kesas[ $pid ] ) ) { return $kesas[ $pid ]; }
		if ( get_post_type( $pid ) !== 'product' ) { return $kesas[ $pid ] = false; }
		if ( get_post_meta( $pid, '_dp_base_product_id', true ) ) { return $kesas[ $pid ] = true; }
		$tipas = get_the_terms( $pid, 'product_type' );
		if ( is_array( $tipas ) ) {
			foreach ( $tipas as $t ) { if ( $t->slug === 'mix-and-match' ) { return $kesas[ $pid ] = true; } }
		}
		return $kesas[ $pid ] = false;
	}

	/**
	 * Tiesioginio meta rasymo blokas. Tuscia reiksme praleidziam (WC pats
	 * raso `_stock = ''`, kai manage_stock isjungtas — tai valymas, ne
	 * likutis), `_manage_stock = no` praleidziam. Visa kita rinkiniui —
	 * blokuojama: grazinus false, update_post_meta nieko neiraso.
	 */
	public static function likucio_uzraktas_meta( $check, $object_id, $meta_key, $meta_value, $extra = null ) {
		if ( $meta_key !== '_stock' && $meta_key !== '_own_stock_qty' && $meta_key !== '_manage_stock' ) { return $check; }
		if ( ! self::ar_rinkinys( $object_id ) ) { return $check; }
		if ( $meta_key === '_manage_stock' ) {
			return ( $meta_value === 'no' || $meta_value === '' ) ? $check : false;
		}
		return ( $meta_value === '' || $meta_value === null ) ? $check : false;
	}

	/**
	 * WC CRUD kelias: katalogo kortele ir importai likuti raso per
	 * set_stock_quantity(), kuris atnaujina ir wc_product_meta_lookup
	 * tiesiogine SQL — meta filtras to nepagauna. Todel pries issaugant
	 * rinkinio objekta likutis nuvalomas.
	 */
	public static function likucio_uzraktas_crud( $product ) {
		if ( ! $product || ! self::ar_rinkinys( $product->get_id() ) ) { return; }
		if ( $product->get_manage_stock() || $product->get_stock_quantity() !== null ) {
			$product->set_manage_stock( false );
			$product->set_stock_quantity( null );
		}
	}

	/**
	 * v1.25: rankinio svorio taisykle (kurjeriui). Ranka irasyta reiksme
	 * NUSTELBIA automatika ir islieka per visus persirasymus, kol formoje
	 * neistrinama (tuscias laukas = grizta automatika). Ta pati logika
	 * kaip `_ps_ranka_isimta`. Ivestis, lygi automatinei, rankiniu nelaikoma.
	 */
	private static function svorio_sprendimas( $prod, $auto_kg, $ivestis ) {
		if ( $ivestis !== null ) {
			$r = (float) str_replace( ',', '.', (string) $ivestis );
			if ( $ivestis === '' || $r <= 0 || abs( $r - (float) $auto_kg ) <= 0.0005 ) {
				$prod->delete_meta_data( '_ps_svoris_ranka' );
			} else {
				$prod->update_meta_data( '_ps_svoris_ranka', $r );
			}
		}
		$ranka = (float) $prod->get_meta( '_ps_svoris_ranka' );
		return ( $ranka > 0 ) ? $ranka : (float) $auto_kg;
	}

	/** Siuntimo klases terminas pagal slug. */
	private static function klases_id( $slug ) {
		$t = get_term_by( 'slug', $slug, 'product_shipping_class' );
		return ( $t && ! is_wp_error( $t ) ) ? (int) $t->term_id : 0;
	}

	/** Sandelis rankiniam atrinkimui (kaip 539: pozymiu nebuvimas = AV). */
	public static function sandelis( $pid ) {
		if ( get_post_meta( $pid, '_vf_enabled', true ) === 'yes' ) { return 'vf'; }
		if ( get_post_meta( $pid, '_zb_enabled', true ) === 'yes' ) { return 'zb'; }
		return 'av';
	}

	/** Kategoriju medis su palikuoniu skaiciais. Kesuojamas — 2 500 prekiu. */
	public static function medis() {
		$kesas = get_transient( 'ps_rink_medis' );
		if ( is_array( $kesas ) && isset( $kesas['v'] ) && $kesas['v'] === self::VERSIJA ) { return $kesas; }

		$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );
		if ( is_wp_error( $terms ) ) { $terms = array(); }

		$cats = array(); $vaikai = array();
		foreach ( $terms as $t ) {
			$cats[ $t->term_id ] = array( 'id' => $t->term_id, 'n' => $t->name, 'p' => (int) $t->parent );
			$vaikai[ (int) $t->parent ][] = $t->term_id;
		}
		/* palikuonys */
		$palik = array();
		$rasti = function( $id ) use ( &$rasti, $vaikai ) {
			$out = array( $id );
			if ( ! empty( $vaikai[ $id ] ) ) {
				foreach ( $vaikai[ $id ] as $v ) { $out = array_merge( $out, $rasti( $v ) ); }
			}
			return $out;
		};
		foreach ( $cats as $id => $c ) { $palik[ $id ] = $rasti( $id ); }

		/* prekiu skaicius su palikuoniais */
		global $wpdb; $p = $wpdb->prefix;
		$eil = $wpdb->get_results(
			"SELECT tr.object_id pid, tt.term_id tid
			   FROM {$p}term_relationships tr
			   JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
			   JOIN {$p}posts po ON po.ID = tr.object_id AND po.post_type='product' AND po.post_status='publish'
			  WHERE tt.taxonomy='product_cat'", ARRAY_A );
		$prekes = array();
		foreach ( $eil as $e ) { $prekes[ (int) $e['pid'] ][] = (int) $e['tid']; }
		$kiek = array();
		foreach ( $palik as $id => $sarasas ) {
			$rink = array_flip( $sarasas ); $n = 0;
			foreach ( $prekes as $pid => $ks ) {
				foreach ( $ks as $k ) { if ( isset( $rink[ $k ] ) ) { $n++; break; } }
			}
			$kiek[ $id ] = $n;
		}

		/* meniu tvarka: kas rodoma klientui, tas ir cia pirma */
		$meniu_top = array(); $meniu = wp_get_nav_menu_object( 'Pagrindinis meniu' );
		if ( $meniu ) {
			foreach ( (array) wp_get_nav_menu_items( $meniu->term_id ) as $it ) {
				if ( (int) $it->menu_item_parent === 0 && $it->object === 'product_cat' ) {
					$meniu_top[] = (int) $it->object_id;
				}
			}
		}
		if ( ! $meniu_top ) {
			foreach ( $cats as $id => $c ) { if ( $c['p'] === 0 && $kiek[ $id ] > 20 ) { $meniu_top[] = $id; } }
		}

		$T = array();
		$deti = function( $id, $lygis ) use ( &$deti, $cats, $vaikai, $kiek, &$T ) {
			if ( ! isset( $cats[ $id ] ) ) { return; }
			if ( $kiek[ $id ] === 0 && empty( $vaikai[ $id ] ) ) { return; }
			$T[] = array( $id, $cats[ $id ]['n'], $kiek[ $id ], $lygis );
			if ( ! empty( $vaikai[ $id ] ) ) {
				$vv = $vaikai[ $id ];
				usort( $vv, function( $a, $b ) use ( $cats ) { return strcoll( $cats[ $a ]['n'], $cats[ $b ]['n'] ); } );
				foreach ( $vv as $v ) { $deti( $v, $lygis + 1 ); }
			}
		};
		foreach ( $meniu_top as $id ) { $deti( $id, 0 ); }

		/* likusios sakniniai su prekemis — i „senos" grupe */
		$O = array();
		foreach ( $cats as $id => $c ) {
			if ( $c['p'] !== 0 || in_array( $id, $meniu_top, true ) || $kiek[ $id ] === 0 ) { continue; }
			$O[] = array( $id, $c['n'], $kiek[ $id ] );
		}
		usort( $O, function( $a, $b ) { return $b[2] - $a[2]; } );

		$rez = array( 'v' => self::VERSIJA, 'T' => $T, 'O' => $O, 'palik' => $palik,
			'vardai' => wp_list_pluck( $cats, 'n' ) );
		set_transient( 'ps_rink_medis', $rez, 6 * HOUR_IN_SECONDS );
		return $rez;
	}

	/**
	 * Gyvunu rusys — imamos IS MENIU, ne iraso i koda. Jei rytoj atsiras nauja
	 * rusis (pvz. „Ropliams"), filtras ja paims pats. Rinkinys priskiriamas
	 * pagal komponentu kategorijas, o ne pagal pavadinima — „Churu" pavadinime
	 * gyvuno nera, bet komponentai guli po KATEMS.
	 */
	public static function rusys() {
		$kesas = get_transient( 'ps_rink_rusys' );
		if ( is_array( $kesas ) ) { return $kesas; }
		$medis = self::medis();
		$out = array();
		$meniu = wp_get_nav_menu_object( 'Pagrindinis meniu' );
		$neimti = array( 'RINKINIAI', 'PASIŪLYMAI', 'SPRENDIMAI', 'AKCIJOS', 'DAUGIAU=PIGIAU' );
		if ( $meniu ) {
			foreach ( (array) wp_get_nav_menu_items( $meniu->term_id ) as $it ) {
				if ( (int) $it->menu_item_parent !== 0 || $it->object !== 'product_cat' ) { continue; }
				$id = (int) $it->object_id;
				$v  = isset( $medis['vardai'][ $id ] ) ? $medis['vardai'][ $id ] : $it->title;
				if ( in_array( mb_strtoupper( $v ), $neimti, true ) ) { continue; }
				$out[] = array(
					'id'    => $id,
					'v'     => $v,
					'palik' => isset( $medis['palik'][ $id ] ) ? $medis['palik'][ $id ] : array( $id ),
				);
			}
		}
		set_transient( 'ps_rink_rusys', $out, 6 * HOUR_IN_SECONDS );
		return $out;
	}

	/** Kuriai rusiai priklauso rinkinys — balsuoja komponentu kategorijos. */
	private static function rusis( $komponentu_ids, $rinkinio_kat = array() ) {
		$rusys = self::rusys();
		if ( ! $rusys ) { return null; }
		$balsai = array();
		foreach ( (array) $komponentu_ids as $cid ) {
			foreach ( wc_get_product_term_ids( $cid, 'product_cat' ) as $kid ) {
				foreach ( $rusys as $r ) {
					if ( in_array( (int) $kid, $r['palik'], true ) ) {
						$balsai[ $r['id'] ] = ( $balsai[ $r['id'] ] ?? 0 ) + 1;
					}
				}
			}
		}
		if ( ! $balsai ) {
			foreach ( (array) $rinkinio_kat as $kid ) {
				foreach ( $rusys as $r ) {
					if ( in_array( (int) $kid, $r['palik'], true ) ) {
						$balsai[ $r['id'] ] = ( $balsai[ $r['id'] ] ?? 0 ) + 1;
					}
				}
			}
		}
		if ( ! $balsai ) { return null; }
		arsort( $balsai );
		return (int) array_key_first( $balsai );
	}

	/**
	 * Kur rinkinys atsiras kataloge.
	 *
	 * TIK RINKINIAI (679) automatiskai. Visa kita — savininko rankomis.
	 *
	 * Kodel ne automatiskai: bandymas atspeti pagal komponentus davė bloga
	 * rezultata. „Maistas + skanestas + zaislas" atsidure po SUNIMS, nors
	 * savininkas ji mato kaip „Sausas maistas sunims" rinkini. Sprendima, kur
	 * rinkinys parduodamas, priima zmogus, ne balsavimo algoritmas — cia
	 * rinkodara, ne duomenu apdorojimas.
	 */
	private static function kategorijos( $komponentu_ids, $rankiniu = array(), $isjungti = array() ) {
		$auto = array_merge( array( 679 ), self::auto_vieta( $komponentu_ids ) );
		$isj  = array_map( 'intval', (array) $isjungti );
		$auto = array_diff( array_map( 'intval', $auto ), $isj );
		$out  = $auto;
		if ( $rankiniu ) { $out = array_merge( $out, array_map( 'intval', $rankiniu ) ); }
		return array_values( array_unique( array_filter( array_map( 'intval', $out ) ) ) );
	}

	/**
	 * v1.27 — automatine vieta pagal komponentus (JS autoVieta() atitikmuo, tos
	 * pacios taisykles). Grazina [tipo_kat, porusis] arba [].
	 */
	public static function auto_vieta( $komponentu_ids ) {
		$sk = array(); $pav = array();
		foreach ( (array) $komponentu_ids as $cid ) {
			$pr = wc_get_product( (int) $cid );
			if ( ! $pr ) { continue; }
			$pav[] = mb_strtolower( $pr->get_name() );
			foreach ( wc_get_product_term_ids( (int) $cid, 'product_cat' ) as $k ) {
				$k = (int) $k;
				if ( in_array( $k, array( 91, 679, 682, 683, 684 ), true ) ) { continue; }
				$sk[ $k ] = ( $sk[ $k ] ?? 0 ) + 1;
			}
		}
		if ( ! $sk ) { return array(); }
		ksort( $sk, SORT_NUMERIC );
		$best = null; $bn = 0;
		foreach ( $sk as $k => $n ) { if ( $n > $bn ) { $bn = $n; $best = $k; } }
		$out = array( $best );
		$t  = get_term( $best, 'product_cat' );
		$nm = ( $t && ! is_wp_error( $t ) ) ? mb_strtolower( $t->name ) : '';
		if ( mb_strpos( $nm, 'konserv' ) !== false ) { $out[] = 682; }
		elseif ( 96 === $best ) { $out[] = 683; }
		elseif ( 95 === $best ) {
			$j = implode( ' ', $pav ); $kramt = false;
			foreach ( array( 'ausis', 'ausys', 'koja', 'kojos', 'trachėj', 'kaul', 'snukis', 'kanop', 'sausgysl', 'kramtal', 'ragas', 'uodeg', 'sparn' ) as $w ) {
				if ( mb_strpos( $j, $w ) !== false ) { $kramt = true; break; }
			}
			$out[] = $kramt ? 684 : 683;
		}
		elseif ( mb_strpos( $nm, 'skanėst' ) !== false ) { $out[] = 683; }
		return $out;
	}

	/**
	 * Rinkinio svoris ir siuntimo klase.
	 *
	 * KODEL SVARBU: rinkinys uzsakyme yra VIENA preke, todel WooCommerce siuntimo
	 * kaina skaiciuoja pagal PREKES svori. Iki siol jis buvo tuscias — 24 kg
	 * maisai siuntimui svere nuli, ir siunta „tilpdavo" i pastomata, nors
	 * fiziskai netelpa.
	 *
	 * MnM turi `_mnm_weight_cumulative`, bet juo nesiremiam: jis suveikia tik
	 * krepselyje ir tik kai pluginas taip nusprendzia. Ivedam svori tiesiai i
	 * preke — taip ji matoma ir uzsakyme, ir manifeste, ir ataskaitose.
	 */
	public static function svoris( $kiekiai ) {
		$suma = 0.0; $truksta = array();
		foreach ( (array) $kiekiai as $cid => $kiek ) {
			$p = wc_get_product( (int) $cid );
			if ( ! $p ) { continue; }
			$w = (float) $p->get_weight();
			if ( $w > 0 ) { $suma += $w * max( 1, (int) $kiek ); }
			else { $truksta[] = array( 'id' => (int) $cid, 'pav' => $p->get_name() ); }
		}
		return array( 'kg' => round( $suma, 3 ), 'truksta' => $truksta );
	}

	/**
	 * Siuntimo klase pagal gradacija. Kurjerio kaina imama pagal svori, todel
	 * klase parenkam automatiskai — kad nereiktu galvoti kiekvienam rinkiniui.
	 */
	public static function siuntimo_klase( $kg ) {
		$kg = (float) $kg;
		if ( $kg <= 0 ) { return ''; }
		if ( $kg <= 50 )  { return 'iki-50kg'; }
		if ( $kg <= 70 )  { return '50-70kg'; }
		if ( $kg <= 100 ) { return '70-100kg'; }
		return '100-200kg';
	}

	/** Svorio reiksmes, surikiuotos pagal tikra dydi (ne abecele). */
	public static function svoriai() {
		$t = get_terms( array( 'taxonomy' => 'pa_pakuotes_dydis', 'hide_empty' => true ) );
		if ( is_wp_error( $t ) ) { return array(); }
		$sar = wp_list_pluck( $t, 'name' );
		usort( $sar, function( $a, $b ) {
			$f = function( $s ) {
				if ( ! preg_match( '/^([\d,\.]+)\s*(g|kg|ml|l)?/ui', trim( $s ), $m ) ) { return 999999; }
				$v = (float) str_replace( ',', '.', $m[1] );
				$u = strtolower( $m[2] ?? '' );
				return $v * ( ( $u === 'kg' || $u === 'l' ) ? 1000 : 1 );
			};
			return $f( $a ) <=> $f( $b );
		} );
		return $sar;
	}

	/* ==================== RINKINIU SARASAS ==================== */

	/**
	 * Paruosti rinkiniai = MnM prekes, kurios NEPRIKLAUSO susidejimo rinkiniui.
	 * Susidejimo pasleptri dydziai turi `_petshop_choice_parent` — juos praleidziam,
	 * nes jie valdomi kitame lange ir cia tik triuksmautu.
	 */
	public static function rinkiniai() {
		return array_merge( self::rinkiniai_mnm(), self::rinkiniai_dp() );
	}

	/** „Daugiau=pigiau" pakai — ta pati preke x N. */
	public static function rinkiniai_dp() {
		global $wpdb; $p = $wpdb->prefix;
		$ids = $wpdb->get_col( "SELECT post_id FROM {$p}postmeta WHERE meta_key='_dp_base_product_id'" );
		$out = array();
		foreach ( (array) $ids as $pid ) {
			$pid  = (int) $pid;
			$post = get_post( $pid );
			if ( ! $post || $post->post_status === 'trash' ) { continue; }
			if ( get_post_meta( $pid, '_ps_laukas', true ) === 'yes' ) { continue; }
			$bid  = (int) get_post_meta( $pid, '_dp_base_product_id', true );
			$qty  = (int) get_post_meta( $pid, '_dp_pack_qty', true );
			$baze = wc_get_product( $bid );
			$kaina = (float) get_post_meta( $pid, '_price', true );
			if ( $kaina <= 0 ) { $pp_k = wc_get_product( $pid ); $kaina = $pp_k ? (float) $pp_k->get_price() : 0; } // H266: MNM juodraštis be _price
			$sav   = $baze ? self::savikaina( $bid ) : null;
			$suma  = $baze ? (float) $baze->get_price() * $qty : 0;
			$lik   = $baze ? $baze->get_stock_quantity() : null;

			$prod = wc_get_product( $pid );
			$out[] = array(
				'id' => $pid, 'pav' => $post->post_title, 'busena' => $post->post_status,
				'sku' => (string) get_post_meta( $pid, '_sku', true ),
				'kaina' => $kaina,
				'savikaina' => ( $sav === null ) ? null : $sav * $qty,
				'suma' => $suma,
				'marza' => ( $sav === null || $kaina <= 0 ) ? null : $kaina - $sav * $qty,
				'vnt' => $qty, 'fiksuota' => true, 'poz' => 1, 'truksta' => ( $sav === null ) ? 1 : 0,
				'lubos' => ( $lik === null || $qty < 1 ) ? null : (int) floor( $lik / $qty ),
				'negalimi' => ( $baze && $baze->get_stock_status() === 'instock' ) ? 0 : 1,
				'sandeliai' => $baze ? array( self::sandelis( $bid ) ) : array(),
				'kat' => wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'names' ) ),
				'tipas' => 'dp', 'baze' => $bid,
				'baze_pav' => $baze ? $baze->get_name() : '(nerasta #' . $bid . ')',
				'foto' => ( $prod && $prod->get_image_id() ) ? wp_get_attachment_image_url( $prod->get_image_id(), 'thumbnail' ) : '',
				'rusis' => self::rusis( array( $bid ), wc_get_product_term_ids( $pid, 'product_cat' ) ),
				'keista' => mb_substr( $post->post_modified, 0, 10 ),
				'komp' => $baze ? array( array(
					'id' => $bid, 'pav' => $baze->get_name(), 'kiekis' => $qty,
					'foto' => $baze->get_image_id() ? wp_get_attachment_image_url( $baze->get_image_id(), 'thumbnail' ) : '',
				) ) : array(),
			);
		}
		return $out;
	}

	public static function rinkiniai_mnm() {
		global $wpdb; $p = $wpdb->prefix;

		$ids = $wpdb->get_col(
			"SELECT po.ID FROM {$p}posts po
			   JOIN {$p}term_relationships tr ON tr.object_id = po.ID
			   JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
			   JOIN {$p}terms t ON t.term_id = tt.term_id
			  WHERE po.post_type='product' AND po.post_status IN ('publish','draft','pending','private')
			    AND tt.taxonomy='product_type' AND t.slug='mix-and-match'
			  ORDER BY po.post_title ASC" );
		if ( ! $ids ) { return array(); }

		update_meta_cache( 'post', $ids );
		$out = array();
		foreach ( $ids as $pid ) {
			$pid = (int) $pid;
			if ( get_post_meta( $pid, '_petshop_choice_parent', true ) ) { continue; }

			/* v1.30: SURENKAMI rinkiniai (petshop-laukai.php) technikai irgi yra MnM
			   konteineriai, todel i si sarasa kris savaime. Bet tai KITAS modelis ir
			   KITAS langas — cia jie tik maiso du dalykus i viena. Filtro nebuvo nuo
			   pat pradziu; matesi ne is karto, nes juodrasciai gulejo saraso apacioje. */
			if ( get_post_meta( $pid, '_ps_laukas', true ) === 'yes' ) { continue; }

			$post = get_post( $pid );
			$kiekiai = json_decode( (string) get_post_meta( $pid, self::META_KIEKIAI, true ), true );
			if ( ! is_array( $kiekiai ) ) { $kiekiai = array(); }

			$vaikai = $wpdb->get_col( $wpdb->prepare(
				"SELECT product_id FROM {$p}wc_mnm_child_items WHERE container_id=%d ORDER BY menu_order", $pid ) );

			$sav = 0; $suma = 0; $truksta = 0; $vnt = 0; $lubos = null; $negalimi = array(); $sandeliai = array();
			$komp = array();
			foreach ( $vaikai as $vid ) {
				$vid = (int) $vid;
				$vp = wc_get_product( $vid );
				if ( ! $vp ) { $negalimi[] = $vid; continue; }
				$q = isset( $kiekiai[ $vid ] ) ? (int) $kiekiai[ $vid ] : 0;
				$c = self::savikaina( $vid );
				$vnt += $q;
				$suma += (float) $vp->get_price() * max( 1, $q );
				if ( $q > 0 ) {
					if ( $c === null ) { $truksta++; } else { $sav += $c * $q; }
					$lik = $vp->get_stock_quantity();
					if ( $lik !== null && $lik !== '' ) {
						$gali = (int) floor( $lik / $q );
						if ( $lubos === null || $gali < $lubos ) { $lubos = $gali; }
					}
				}
				if ( $vp->get_stock_status() !== 'instock' || $vp->get_status() !== 'publish' ) { $negalimi[] = $vid; }
				$sandeliai[ self::sandelis( $vid ) ] = true;
				$komp[] = array(
					'id' => $vid, 'pav' => $vp->get_name(), 'kiekis' => $q,
					'foto' => $vp->get_image_id() ? wp_get_attachment_image_url( $vp->get_image_id(), 'thumbnail' ) : '',
				);
			}

			$kaina = (float) get_post_meta( $pid, '_price', true );
			if ( $kaina <= 0 ) { $pp_k = wc_get_product( $pid ); $kaina = $pp_k ? (float) $pp_k->get_price() : 0; } // H266: MNM juodraštis be _price
			$fiksuota = ! empty( $kiekiai );
			$marza = ( $fiksuota && ! $truksta && $kaina > 0 ) ? $kaina - $sav : null;

			$out[] = array(
				'id'        => $pid,
				'pav'       => $post->post_title,
				'busena'    => $post->post_status,
				'sku'       => (string) get_post_meta( $pid, '_sku', true ),
				'kaina'     => $kaina,
				'savikaina' => ( $fiksuota && ! $truksta ) ? $sav : null,
				'suma'      => $suma,
				'marza'     => $marza,
				'vnt'       => $fiksuota ? $vnt : (int) get_post_meta( $pid, '_mnm_min_container_size', true ),
				'fiksuota'  => $fiksuota,
				'poz'       => count( $vaikai ),
				'truksta'   => $truksta,
				'lubos'     => $lubos,
				'negalimi'  => count( array_unique( $negalimi ) ),
				'sandeliai' => array_keys( $sandeliai ),
				'kat'       => wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'names' ) ),
				'tipas'     => 'mnm',
				'foto'      => get_post_thumbnail_id( $pid ) ? wp_get_attachment_image_url( get_post_thumbnail_id( $pid ), 'thumbnail' ) : '',
				'rusis'     => self::rusis( $vaikai, wc_get_product_term_ids( $pid, 'product_cat' ) ),
				'keista'    => mb_substr( $post->post_modified, 0, 10 ),
				'komp'      => $komp,
			);
		}
		return $out;
	}

	/* ==================== PUSLAPIS ==================== */

	public static function puslapis() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Neturite teisių.' ); }
		$veiksmas = isset( $_GET['veiksmas'] ) ? sanitize_key( $_GET['veiksmas'] ) : '';
		$id       = isset( $_GET['id'] ) ? (int) $_GET['id'] : 0;

		self::stilius();
		self::navigacija();
		echo '<div class="wrap psrink">';

		$skirtukas = isset( $_GET['sk'] ) ? sanitize_key( $_GET['sk'] ) : 'paruosti';

		if ( $veiksmas === 'naujas' || ( $veiksmas === 'keisti' && $id ) ) {
			self::forma( $veiksmas === 'keisti' ? $id : 0 );
		} elseif ( $skirtukas === 'pasirenkami' ) {
			/* Senos nuorodos (issaugotos, laiskuose) nebeturi ka rodyti — vedam i nauja langa. */
			wp_safe_redirect( admin_url( 'admin.php?page=ps-laukai' ) );
			exit;
		} else {
			self::skirtukai( 'paruosti' );
			self::sarasas();
		}
		echo '</div>';
	}


	/* ==================== v1.26: PASIRENKAMI RINKINIAI ==================== */

	/**
	 * Skirtukai. Paruosti rinkiniai ir DP gyvena sename sarase; pasirenkami —
	 * atskirai, nes tai ne prekes, o seimos: viena eilute = viena seima, ne 36
	 * pasleptos prekes.
	 */
	private static function skirtukai( $akt ) {
		$b = admin_url( 'admin.php?page=' . self::SLUG );
		/* Senasis „Pasirenkami" modelis (seimos su fiksuotais dydziais) istrintas
		   2026-08-14. Skirtukas dabar veda i „Surenkamus rinkinius" — nauja
		   petshop-laukai panele: laisvas kiekis nuo 3 vnt. ir pakopines nuolaidos. */
		$sk = array(
			'paruosti'    => array( 'Paruošti rinkiniai', $b ),
			'pasirenkami' => array( 'Surenkami rinkiniai', admin_url( 'admin.php?page=ps-laukai' ) ),
		);
		echo '<h1 class="wp-heading-inline">Rinkiniai</h1>';
		echo '<p class="description">Paruošti rinkiniai ir pakai — prekės su savo kortele. '
			. 'Pasirenkami — šeimos, kurių turinį susideda klientas.</p>';
		echo '<div class="psr-skirtukai">';
		foreach ( $sk as $k => $v ) {
			echo '<a class="' . ( $k === $akt ? 'on' : '' ) . '" href="' . esc_url( $v[1] ) . '">'
				. esc_html( $v[0] ) . '</a>';
		}
		echo '</div>';
	}

	/**
	 * Susidejimo seimos. Tevinis turi `_petshop_is_choice_bundle`, o dydziai —
	 * `_petshop_choice_parent`. Naslaiciai (dydziai be tevinio) rodomi atskirai,
	 * kitaip jie liktu nematomi, kaip #34196.
	 */
	public static function seimos() {
		global $wpdb;
		$tevai = $wpdb->get_col( "SELECT post_id FROM {$wpdb->postmeta}
			WHERE meta_key='_petshop_is_choice_bundle' AND meta_value='yes'" );
		$vaikai = $wpdb->get_results( "SELECT post_id, meta_value AS tevas FROM {$wpdb->postmeta}
			WHERE meta_key='_petshop_choice_parent'", ARRAY_A );

		$pagal_teva = array();
		foreach ( $vaikai as $v ) { $pagal_teva[ (int) $v['tevas'] ][] = (int) $v['post_id']; }

		$visi = array_map( 'intval', $tevai );
		foreach ( array_keys( $pagal_teva ) as $t ) { if ( ! in_array( $t, $visi, true ) ) { $visi[] = (int) $t; } }

		$eil = array();
		foreach ( $visi as $tid ) {
			$eil[] = self::seimos_eilute( $tid, $pagal_teva[ $tid ] ?? array() );
		}
		usort( $eil, function( $a, $b ) { return $a['id'] <=> $b['id']; } );
		self::seimu_lentele( $eil );
	}

	/** Vienos seimos suvestine sarasui. */
	private static function seimos_eilute( $tid, $dydziai ) {
		global $wpdb;
		$post = get_post( $tid );
		$cfg  = json_decode( (string) get_post_meta( $tid, '_petshop_choice_config', true ), true );
		$tbl  = $wpdb->prefix . 'wc_mnm_child_items';

		$grupes = array(); $kainos = array(); $krepsiai = array(); $ivertinta = array(); $brangiau = 0;
		if ( is_array( $cfg ) ) {
			foreach ( $cfg as $gk => $gd ) {
				$grupes[] = ( $gd['label'] ?? $gk );
				foreach ( (array) ( $gd['gramaturos'] ?? array() ) as $gram => $dyd ) {
					/* Krepsys priklauso GRAMATURAI, ne grupei: mix 400 g ir 800 g turi
					   skirtingas prekes. Nuskaitom viena karta kiekvienai gramaturai. */
					$pirmas = 0;
					foreach ( (array) $dyd as $si0 ) { $pirmas = (int) ( $si0['product_id'] ?? 0 ); if ( $pirmas ) { break; } }
					$sav = array(); $kain_kr = array(); $truksta = 0;
					if ( $pirmas ) {
						$rows = $wpdb->get_col( $wpdb->prepare(
							"SELECT product_id FROM {$tbl} WHERE container_id=%d", $pirmas ) );
						$krepsiai[] = count( $rows );
						foreach ( $rows as $cid ) {
							$c = self::savikaina( (int) $cid );
							if ( $c === null ) { $truksta++; } else { $sav[] = $c; }
							$cp = wc_get_product( (int) $cid );
							if ( $cp && (float) $cp->get_price() > 0 ) { $kain_kr[] = (float) $cp->get_price(); }
						}
					}
					foreach ( (array) $dyd as $sz => $si ) {
						$kaina = (float) ( $si['price'] ?? 0 );
						$kainos[] = $kaina;
						$n = (int) $sz;
						/* Kainu palyginimui savikainos NEREIKIA — tik prekiu kainu. */
						if ( $kain_kr && $kaina > $n * min( $kain_kr ) + 0.005 ) { $brangiau++; }
						if ( $sav && ! $truksta && $kaina > 0 ) {
							$net = $kaina / 1.21;
							$ivertinta[] = array(
								round( ( $net - $n * max( $sav ) ) / $net * 100 ),
								round( ( $net - $n * min( $sav ) ) / $net * 100 ),
							);
						} elseif ( $truksta ) {
							$ivertinta[] = null;
						}
					}
				}
			}
		}

		$m_lo = null; $m_hi = null;
		foreach ( $ivertinta as $iv ) {
			if ( $iv === null ) { continue; }
			$m_lo = ( $m_lo === null ) ? $iv[0] : min( $m_lo, $iv[0] );
			$m_hi = ( $m_hi === null ) ? $iv[1] : max( $m_hi, $iv[1] );
		}

		return array(
			'id'       => (int) $tid,
			'pav'      => $post ? $post->post_title : '— tėvinio nebėra —',
			'yra'      => (bool) $post,
			'busena'   => $post ? $post->post_status : '',
			'grupes'   => $grupes,
			'dydziu'   => count( $dydziai ),
			'krepsys'  => $krepsiai ? ( min( $krepsiai ) === max( $krepsiai )
				? (string) min( $krepsiai )
				: min( $krepsiai ) . '–' . max( $krepsiai ) ) : '—',
			'per_didelis' => $krepsiai ? ( max( $krepsiai ) > 8 ) : false,
			'm_lo'     => $m_lo,
			'm_hi'     => $m_hi,
			'brangiau' => $brangiau,
			'be_sav'   => count( array_filter( $ivertinta, function( $x ) { return $x === null; } ) ),
		);
	}

	/** Marzos intervalo juosta. Vienas skaicius cia meluotu — renkasi klientas. */
	private static function juosta( $lo, $hi ) {
		if ( $lo === null ) { return '<span class="psr-mut">negalima suskaičiuoti</span>'; }
		$p = function( $v ) { return max( 0, min( 100, $v + 20 ) ); };
		$a = $p( $lo ); $b = $p( $hi );
		return '<div class="psr-juostele"><u style="left:20%"></u><u style="left:45%"></u>'
			. '<i class="' . ( $lo < 20 ? 'bloga' : '' ) . '" style="left:' . $a . '%;width:'
			. max( 2, $b - $a ) . '%"></i></div>'
			. '<div class="psr-juostele-t"><span>' . (int) $lo . ' %</span><span>' . (int) $hi . ' %</span></div>';
	}

	private static function seimu_lentele( $eil ) {
		$sk = array( 'visos' => count( $eil ), 'brangiau' => 0, 'be_sav' => 0, 'didelis' => 0, 'naslaitis' => 0 );
		foreach ( $eil as $e ) {
			if ( $e['brangiau'] ) { $sk['brangiau']++; }
			if ( $e['be_sav'] ) { $sk['be_sav']++; }
			if ( $e['per_didelis'] ) { $sk['didelis']++; }
			if ( ! $e['yra'] ) { $sk['naslaitis']++; }
		}
		echo '<div class="psr-eiles">';
		echo '<button class="psr-eile on"><b>' . $sk['visos'] . '</b><span>Visos šeimos</span></button>';
		echo '<button class="psr-eile r"><b>' . $sk['brangiau'] . '</b><span>Brangiau nei atskirai</span></button>';
		echo '<button class="psr-eile y"><b>' . $sk['be_sav'] . '</b><span>Prekės be savikainos</span></button>';
		echo '<button class="psr-eile y"><b>' . $sk['didelis'] . '</b><span>Krepšys per didelis</span></button>';
		echo '<button class="psr-eile r"><b>' . $sk['naslaitis'] . '</b><span>Tėvinio nebėra</span></button>';
		echo '</div>';

		echo '<table class="wp-list-table widefat striped psr-lentele"><thead><tr>'
			. '<th style="width:26%">Šeima</th><th>Grupės</th><th>Dydžių</th><th>Krepšys</th>'
			. '<th style="min-width:170px">Marža blogiausiu–geriausiu atveju</th><th>Būsena</th>'
			. '</tr></thead><tbody>';
		if ( ! $eil ) { echo '<tr><td colspan="6" class="psr-tuscia">Susidėjimo rinkinių nerasta.</td></tr>'; }
		foreach ( $eil as $e ) {
			$nuoroda = admin_url( 'admin.php?page=' . self::SLUG . '&sk=pasirenkami&id=' . $e['id'] );
			echo '<tr>';
			echo '<td><a class="psr-pav" href="' . esc_url( $nuoroda ) . '">' . esc_html( $e['pav'] ) . '</a>'
				. '<div class="psr-mut">#' . $e['id'] . '</div></td>';
			echo '<td class="psr-mut">' . ( $e['grupes'] ? esc_html( implode( ' · ', $e['grupes'] ) ) : '—' ) . '</td>';
			echo '<td>' . $e['dydziu'] . '</td>';
			echo '<td>' . esc_html( $e['krepsys'] ) . '</td>';
			echo '<td>' . self::juosta( $e['m_lo'], $e['m_hi'] ) . '</td>';
			echo '<td>';
			if ( ! $e['yra'] )        { echo '<span class="psr-z r">Tėvinio nebėra</span>'; }
			elseif ( $e['brangiau'] ) { echo '<span class="psr-z r">Brangiau nei atskirai</span>'; }
			else                      { echo '<span class="psr-z g">Sutvarkyta</span>'; }
			if ( $e['be_sav'] )      { echo ' <span class="psr-z y">' . $e['be_sav'] . ' be savikainos</span>'; }
			if ( $e['per_didelis'] ) { echo ' <span class="psr-z y">krepšys &gt; 8</span>'; }
			echo '</td></tr>';
		}
		echo '</tbody></table>';
		echo '<p class="psr-mut" style="margin-top:14px">Pasirenkamas rinkinys nėra prekė — jis yra mini katalogas, '
			. 'todėl į prekių sąrašą neįrašomas. Jo prekės kataloge jau yra kiekviena atskira eilute. '
			. '<b>Marža rodoma intervalu</b>, nes renkasi klientas.</p>';
	}

	/** Vienos seimos vidus: grupes, dydziai su kainomis, krepsys, apsaugos. */
	public static function seima( $tid ) {
		global $wpdb;
		$post = get_post( $tid );
		$cfg  = json_decode( (string) get_post_meta( $tid, '_petshop_choice_config', true ), true );
		$grizti = admin_url( 'admin.php?page=' . self::SLUG . '&sk=pasirenkami' );

		echo '<p><a class="button" href="' . esc_url( $grizti ) . '">← Šeimos</a> '
			. '<b style="font-size:15px;margin-left:8px">' . esc_html( $post ? $post->post_title : '— tėvinio nebėra —' )
			. '</b> <span class="psr-z b">#' . (int) $tid . '</span></p>';

		if ( ! is_array( $cfg ) || ! $cfg ) {
			echo '<div class="psr-kort"><div class="psr-vidus psr-tuscia">'
				. 'Šios šeimos nustatymų (<code>_petshop_choice_config</code>) nėra — greičiausiai tėvinis ištrintas, '
				. 'o dydžiai liko. Kol tvarkome, jie nerodomi klientams tik todėl, kad paslėpti nuo katalogo.'
				. '</div></div>';
			return;
		}

		$akt = isset( $_GET['gr'] ) ? sanitize_key( $_GET['gr'] ) : (string) array_key_first( $cfg );
		if ( ! isset( $cfg[ $akt ] ) ) { $akt = (string) array_key_first( $cfg ); }

		/* grupiu juosta */
		echo '<div class="psr-kort"><h3>Grupės <span class="psr-mut">klientui tai pirmas pasirinkimas</span></h3>'
			. '<div class="psr-vidus"><div class="psr-grupe">';
		foreach ( $cfg as $gk => $gd ) {
			$n = 0;
			foreach ( (array) ( $gd['gramaturos'] ?? array() ) as $dyd ) { $n += count( (array) $dyd ); }
			$u = admin_url( 'admin.php?page=' . self::SLUG . '&sk=pasirenkami&id=' . (int) $tid . '&gr=' . $gk );
			echo '<a class="button ' . ( $gk === $akt ? 'button-primary' : '' ) . '" href="' . esc_url( $u ) . '">'
				. esc_html( $gd['label'] ?? $gk ) . ' <i class="psr-mut">(' . $n . ' dydžiai)</i></a>';
		}
		echo '</div></div></div>';

		self::seimos_grupe( $tid, $akt, $cfg[ $akt ] );
	}


	/** Grupes vidus: dydziu/kainu lentele, krepsys, apsaugos. */
	private static function seimos_grupe( $tid, $gk, $gd ) {
		$gk_akt = $gk;
		global $wpdb;
		$tbl = $wpdb->prefix . 'wc_mnm_child_items';

		/* Krepsys priklauso GRAMATURAI: mix 400 g ir 800 g turi skirtingas prekes.
		   Rodom aktyvios gramaturos krepsi; jei ju kelios — leidziam persijungti. */
		$gramos = array_keys( (array) ( $gd['gramaturos'] ?? array() ) );
		sort( $gramos, SORT_NUMERIC );
		$akt_gram = isset( $_GET['gm'] ) ? sanitize_text_field( wp_unslash( $_GET['gm'] ) ) : (string) reset( $gramos );
		if ( ! in_array( $akt_gram, array_map( 'strval', $gramos ), true ) ) { $akt_gram = (string) reset( $gramos ); }

		$eilutes = array(); $hid_pirmas = 0;
		foreach ( (array) ( $gd['gramaturos'][ $akt_gram ] ?? array() ) as $sz => $si ) {
			if ( ! $hid_pirmas ) { $hid_pirmas = (int) ( $si['product_id'] ?? 0 ); }
			$eilutes[] = array( 'gram' => $akt_gram, 'sz' => (int) $sz,
				'kaina' => (float) ( $si['price'] ?? 0 ), 'hid' => (int) ( $si['product_id'] ?? 0 ) );
		}
		usort( $eilutes, function( $a, $b ) { return $a['sz'] <=> $b['sz']; } );

		if ( count( $gramos ) > 1 ) {
			echo '<div class="psr-kort"><h3>Gramatūra <span class="psr-mut">kiekviena turi savo krepšį</span></h3>'
				. '<div class="psr-vidus"><div class="psr-grupe">';
			foreach ( $gramos as $g ) {
				$u = add_query_arg( 'gm', $g );
				echo '<a class="button ' . ( (string) $g === $akt_gram ? 'button-primary' : '' ) . '" href="'
					. esc_url( $u ) . '">' . esc_html( $g ) . ' g</a>';
			}
			echo '</div></div></div>';
		}

		$krepsys = array();
		if ( $hid_pirmas ) {
			$ids = $wpdb->get_col( $wpdb->prepare(
				"SELECT product_id FROM {$tbl} WHERE container_id=%d ORDER BY menu_order", $hid_pirmas ) );
			foreach ( $ids as $cid ) {
				$p = wc_get_product( (int) $cid );
				if ( ! $p ) { $krepsys[] = array( 'id' => (int) $cid, 'nera' => true ); continue; }
				$sav = self::savikaina( (int) $cid );
				$kaina = (float) $p->get_price();
				$krepsys[] = array(
					'id'    => (int) $cid,
					'pav'   => $p->get_name(),
					'kaina' => $kaina,
					'sav'   => $sav,
					'marza' => ( $sav !== null && $kaina > 0 ) ? round( ( ( $kaina / 1.21 ) - $sav ) / ( $kaina / 1.21 ) * 100 ) : null,
					'yra'   => $p->is_in_stock(),
					'lik'   => $p->get_stock_quantity(),
					'sand'  => strtoupper( (string) get_post_meta( (int) $cid, '_ps_sandelis', true ) ?: 'AV' ),
					'apr'   => ( trim( wp_strip_all_tags( $p->get_short_description() ) ) !== ''
						|| trim( wp_strip_all_tags( $p->get_description() ) ) !== '' ),
				);
			}
		}

		$k_visos = array(); $s_visos = array(); $truksta = 0;
		foreach ( $krepsys as $p ) {
			if ( ! empty( $p['nera'] ) ) { continue; }
			$k_visos[] = $p['kaina'];
			if ( $p['sav'] === null ) { $truksta++; } else { $s_visos[] = $p['sav']; }
		}

		/* ---------- dydziai ---------- */
		echo '<div class="psr-kort"><h3>Dydžiai ir kainos</h3><div class="psr-vidus" style="padding:0">';
		echo '<table class="wp-list-table widefat striped psr-lentele"><thead><tr>'
			. '<th>Dydis</th><th>Dėžės kaina</th><th>Už vnt.</th><th>Savikaina</th>'
			. '<th>Atskirai kainuotų</th><th style="min-width:170px">Marža</th></tr></thead><tbody>';
		foreach ( $eilutes as $e ) {
			$n = $e['sz']; $kaina = $e['kaina'];
			$ats_lo = $k_visos ? $n * min( $k_visos ) : null;
			$ats_hi = $k_visos ? $n * max( $k_visos ) : null;
			$m_lo = null; $m_hi = null;
			if ( $s_visos && ! $truksta && $kaina > 0 ) {
				$net = $kaina / 1.21;
				$m_lo = round( ( $net - $n * max( $s_visos ) ) / $net * 100 );
				$m_hi = round( ( $net - $n * min( $s_visos ) ) / $net * 100 );
			}
			$brangiau = ( $ats_lo !== null && $kaina > $ats_lo + 0.005 );
			echo '<tr>';
			echo '<td><b>' . $n . '</b> vnt. <span class="psr-mut">' . esc_html( $e['gram'] ) . ' g</span></td>';
			echo '<td><span class="psr-kaina-lauk"><input type="text" class="psr-kaina" value="'
				. esc_attr( number_format( $kaina, 2, ',', '' ) ) . '" data-gr="' . esc_attr( $gk_akt )
				. '" data-gram="' . esc_attr( $e['gram'] ) . '" data-sz="' . (int) $n . '"> €</span></td>';
			echo '<td>' . ( $n ? self::eur( $kaina / $n ) : '—' ) . '</td>';
			echo '<td class="psr-mut">' . ( $s_visos && ! $truksta
				? self::eur( $n * min( $s_visos ) ) . ( min( $s_visos ) !== max( $s_visos ) ? '–' . self::eur( $n * max( $s_visos ) ) : '' )
				: '—' ) . '</td>';
			echo '<td' . ( $brangiau ? ' class="psr-bad"' : '' ) . '>'
				. ( $ats_lo === null ? '—' : self::eur( $ats_lo ) . ( $ats_lo !== $ats_hi ? '–' . self::eur( $ats_hi ) : '' ) )
				. ( $brangiau ? '<div class="psr-mut psr-bad">dėžė brangesnė</div>' : '' ) . '</td>';
			echo '<td>' . self::juosta( $m_lo, $m_hi ) . '</td>';
			echo '</tr>';
		}
		echo '</tbody></table></div></div>';

		/* ---------- krepsys ---------- */
		echo '<div class="psr-kort"><h3>Krepšys — iš ko klientas renkasi '
			. '<span class="psr-z b">' . count( $krepsys ) . ' iš 8</span>'
			. '<span class="psr-sp"></span><span class="psr-mut">savikaina rodoma renkant — pagal ją atrenkamos prekės</span></h3>';
		echo '<div class="psr-vidus" style="padding:0">';
		echo '<table class="wp-list-table widefat striped psr-lentele"><thead><tr>'
			. '<th style="width:34%">Prekė</th><th>Kaina</th><th>Savikaina</th><th>Marža</th>'
			. '<th>Likutis</th><th>Sandėlis</th><th>Aprašymas</th><th></th></tr></thead><tbody>';
		if ( ! $krepsys ) { echo '<tr><td colspan="8" class="psr-tuscia">Krepšys tuščias.</td></tr>'; }
		foreach ( $krepsys as $p ) {
			if ( ! empty( $p['nera'] ) ) {
				echo '<tr><td colspan="8" class="psr-bad">Prekės #' . $p['id'] . ' nebėra</td></tr>';
				continue;
			}
			echo '<tr>';
			echo '<td>' . esc_html( $p['pav'] ) . '<div class="psr-mut">#' . $p['id'] . '</div></td>';
			echo '<td>' . self::eur( $p['kaina'] ) . '</td>';
			echo '<td>' . ( $p['sav'] === null ? '<span class="psr-bad">nėra</span>' : self::eur( $p['sav'] ) ) . '</td>';
			echo '<td' . ( ( $p['marza'] !== null && $p['marza'] < 20 ) ? ' class="psr-warn"' : '' ) . '>'
				. ( $p['marza'] === null ? '—' : $p['marza'] . ' %' ) . '</td>';
			echo '<td>' . ( $p['yra'] ? ( $p['lik'] === null ? '—' : (int) $p['lik'] ) : '<span class="psr-z r">neturime</span>' ) . '</td>';
			echo '<td class="psr-mut">' . esc_html( $p['sand'] ) . '</td>';
			echo '<td>' . ( $p['apr'] ? '<span class="psr-z g">yra</span>' : '<span class="psr-z y">nėra</span>' ) . '</td>';
			echo '<td class="r"><button type="button" class="button psr-isimti" data-preke="' . $p['id']
				. '" title="Išimti iš krepšio">×</button></td>';
			echo '</tr>';
		}
		echo '</tbody></table>';

		echo '<div class="psr-filtrai">';
		echo '<span class="psr-f"><label>Sandėlis</label><span id="psr-f-sand">';
		foreach ( array( '' => 'Visi', 'av' => 'AV', 'vf' => 'VF', 'zb' => 'ZB' ) as $kk => $vv ) {
			echo '<button type="button" class="button psr-wh' . ( $kk === '' ? ' button-primary' : '' )
				. '" data-wh="' . esc_attr( $kk ) . '">' . esc_html( $vv ) . '</button>';
		}
		echo '</span></span>';
		echo '<span class="psr-f"><label>Savikaina</label><select id="psr-f-savik">'
			. '<option value="">— bet kokia —</option><option value="a">iki 2 €</option><option value="b">2–5 €</option>'
			. '<option value="c">5–15 €</option><option value="d">virš 15 €</option><option value="x">be savikainos</option></select></span>';
		echo '<span class="psr-f psr-f-plati"><label>Pridėti prekę</label>'
			. '<input type="text" id="psr-q" placeholder="pavadinimas arba SKU…" autocomplete="off">'
			. '<button type="button" class="button" id="psr-browse">Rodyti visus tinkamus</button></span>';
		echo '</div>';
		echo '<div id="psr-rez" class="psr-rez"></div>';
		echo '</div></div>';

		self::apsaugos( $eilutes, $krepsys, $k_visos, $truksta );
		self::seimos_js( $tid, $gk_akt, $akt_gram );
	}

	/** Apsaugos — skaiciuojamos is tu paciu duomenu, ne irasytos ranka. */
	private static function apsaugos( $eilutes, $krepsys, $k_visos, $truksta ) {
		$a = array();
		if ( $k_visos ) {
			$brangus = array();
			foreach ( $eilutes as $e ) {
				if ( $e['kaina'] > $e['sz'] * min( $k_visos ) + 0.005 ) {
					$brangus[] = $e['sz'] . ' vnt. (permoka ' . self::eur( $e['kaina'] - $e['sz'] * min( $k_visos ) ) . ')';
				}
			}
			if ( $brangus ) {
				$a[] = array( 'r', 'Dėžė brangesnė nei prekės atskirai',
					implode( ', ', $brangus ) . ' — pigiausiai renkantis klientas permoka. Publikuoti negalima.' );
			}
		}
		$nera = 0; $be_apr = 0;
		foreach ( $krepsys as $p ) {
			if ( ! empty( $p['nera'] ) ) { continue; }
			if ( ! $p['yra'] ) { $nera++; }
			if ( ! $p['apr'] ) { $be_apr++; }
		}
		if ( $nera )    { $a[] = array( 'y', 'Krepšyje trūksta prekių', $nera . ' iš ' . count( $krepsys ) . ' neturime — klientas mato mažiau pasirinkimo.' ); }
		if ( $truksta ) { $a[] = array( 'y', 'Prekės be savikainos', $truksta . ' prekės — maržos suskaičiuoti negalima.' ); }
		if ( $be_apr )  { $a[] = array( 'y', 'Prekės be aprašymo', $be_apr . ' prekės — klientas nemato, ką renkasi.' ); }
		if ( count( $krepsys ) > 8 ) { $a[] = array( 'y', 'Krepšys per didelis', count( $krepsys ) . ' prekės. Virš 8 dėžė pralaimi savo kategorijai.' ); }
		if ( $k_visos && min( $k_visos ) > 0 && max( $k_visos ) / min( $k_visos ) > 1.5 ) {
			$a[] = array( 'y', 'Krepšyje labai skirtingos kainos',
				self::eur( min( $k_visos ) ) . '–' . self::eur( max( $k_visos ) )
				. ' (' . number_format( max( $k_visos ) / min( $k_visos ), 1, ',', '' ) . '×). Su fiksuota kaina marža nestabili.' );
		}
		$sand = array();
		foreach ( $krepsys as $p ) { if ( empty( $p['nera'] ) ) { $sand[ $p['sand'] ] = 1; } }
		if ( count( $sand ) > 1 ) {
			$a[] = array( 'r', 'Kelių sandėlių prekės', implode( ' + ', array_keys( $sand ) ) . ' — klientui tai bus dvi siuntos.' );
		}
		if ( ! $a ) { $a[] = array( 'g', 'Sutvarkyta', 'Kainos, likučiai, savikainos ir aprašymai švarūs.' ); }

		echo '<div class="psr-kort"><h3>Apsaugos</h3><div class="psr-vidus">';
		foreach ( $a as $x ) {
			echo '<div class="psr-apsauga psr-' . $x[0] . '-l"><b>' . esc_html( $x[1] ) . '</b>'
				. '<span>' . esc_html( $x[2] ) . '</span></div>';
		}
		echo '</div></div>';
	}


	/** Redagavimo JS. Kaina issaugoma pametus fokusa; krepsys — mygtuku. */
	private static function seimos_js( $tid, $gk, $gram ) {
		$nonce = wp_create_nonce( 'ps_rink' );
		?>
		<div id="psr-stat" class="psr-stat"></div>
		<script>
		(function(){
			var TEV=<?php echo (int) $tid; ?>, GR='<?php echo esc_js( $gk ); ?>', GRAM='<?php echo esc_js( $gram ); ?>';
			var N='<?php echo esc_js( $nonce ); ?>', A=ajaxurl;
			var stat=document.getElementById('psr-stat');
			function saky(t,bloga){
				stat.textContent=t; stat.className='psr-stat '+(bloga?'bloga':'gerai')+' rodo';
				clearTimeout(stat._t); stat._t=setTimeout(function(){stat.classList.remove('rodo');}, bloga?9000:3500);
			}
			function siusti(veiksmas,duom,ok){
				var f=new FormData(); f.append('action',veiksmas); f.append('nonce',N); f.append('tevas',TEV);
				f.append('gr',GR); f.append('gram',GRAM);
				for(var k in duom) f.append(k,duom[k]);
				fetch(A,{method:'POST',credentials:'same-origin',body:f}).then(function(r){return r.json();})
					.then(function(j){ if(j&&j.success){ ok(j.data); } else { saky((j&&j.data)||'Nepavyko.',true); } })
					.catch(function(){ saky('Ryšio klaida.',true); });
			}

			/* --- kaina --- */
			document.querySelectorAll('.psr-kaina').forEach(function(inp){
				inp.dataset.buvo=inp.value;
				inp.addEventListener('keydown',function(e){ if(e.key==='Enter'){ inp.blur(); } });
				inp.addEventListener('blur',function(){
					if(inp.value===inp.dataset.buvo) return;
					inp.disabled=true;
					siusti('ps_rink_seimos_kaina',{gr:inp.dataset.gr,gram:inp.dataset.gram,sz:inp.dataset.sz,kaina:inp.value},
						function(){ saky('Kaina išsaugota. Perkraunu, kad marža persiskaičiuotų…'); setTimeout(function(){location.reload();},700); });
					setTimeout(function(){ if(inp.disabled){ inp.disabled=false; inp.value=inp.dataset.buvo; } },4000);
				});
			});

			/* --- isimimas --- */
			document.querySelectorAll('.psr-isimti').forEach(function(b){
				b.addEventListener('click',function(){
					if(!confirm('Išimti šią prekę iš krepšio? Ji dings iš visų šios gramatūros dydžių.')) return;
					b.disabled=true;
					siusti('ps_rink_seimos_krepsys',{veiksmas:'isimti',preke:b.dataset.preke},
						function(d){ saky(d.zinute); setTimeout(function(){location.reload();},600); });
					setTimeout(function(){ b.disabled=false; },4000);
				});
			});

			/* --- paieska --- */
			var q=document.getElementById('psr-q'), rez=document.getElementById('psr-rez'), laik=0, wh='';
			document.querySelectorAll('#psr-f-sand .psr-wh').forEach(function(b){
				b.addEventListener('click',function(){
					document.querySelectorAll('#psr-f-sand .psr-wh').forEach(function(x){x.classList.remove('button-primary');});
					b.classList.add('button-primary'); wh=b.dataset.wh; ieskoti(false);
				});
			});
			document.getElementById('psr-browse').addEventListener('click',function(){ ieskoti(true); });
			q.addEventListener('input',function(){ clearTimeout(laik); laik=setTimeout(function(){ieskoti(false);},350); });

			function ieskoti(browse){
				var t=q.value.trim();
				if(!browse && t.length<2){ rez.innerHTML=''; return; }
				rez.innerHTML='<div class="psr-tuscia">Ieškoma…</div>';
				var u=A+'?action=ps_rink_paieska&nonce='+N+'&q='+encodeURIComponent(t)
					+'&sand='+wh+'&savik='+document.getElementById('psr-f-savik').value+(browse?'&browse=1':'');
				fetch(u,{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(j){
					if(!j||!j.success){ rez.innerHTML='<div class="psr-tuscia">Nepavyko ieškoti.</div>'; return; }
					var sar=(j.data&&j.data.prekes)||[];
					if(!sar.length){ rez.innerHTML='<div class="psr-tuscia">Nerasta. Atlaisvink filtrus.</div>'; return; }
					var h='<div class="psr-mut" style="padding:6px 12px">rasta '+sar.length+' — rodomos pirmos 40</div>'
						+'<table class="wp-list-table widefat striped psr-rez-t"><thead><tr><th>Prekė</th>'
						+'<th>Kaina</th><th>Savikaina</th><th>Sandėlis</th><th></th></tr></thead><tbody>';
					sar.slice(0,40).forEach(function(p){
						h+='<tr><td>'+(p.pav||'')+'<div class="psr-mut">#'+p.id+'</div></td>'
						 +'<td>'+(p.kaina!=null?Number(p.kaina).toFixed(2).replace('.',',')+' €':'—')+'</td>'
						 +'<td>'+(p.savikaina!=null?Number(p.savikaina).toFixed(2).replace('.',',')+' €':'<span class="psr-bad">nėra</span>')+'</td>'
						 +'<td class="psr-mut">'+((p.sandelis||'av')+'').toUpperCase()+(p.yra?'':' <span class="psr-z r">neturime</span>')+'</td>'
						 +'<td class="r"><button type="button" class="button button-primary psr-prideti" data-preke="'+p.id+'">Pridėti</button></td></tr>';
					});
					rez.innerHTML=h+'</tbody></table>';
					rez.querySelectorAll('.psr-prideti').forEach(function(b){
						b.addEventListener('click',function(){
							b.disabled=true;
							siusti('ps_rink_seimos_krepsys',{veiksmas:'prideti',preke:b.dataset.preke},
								function(d){ saky(d.zinute); setTimeout(function(){location.reload();},600); });
							setTimeout(function(){ b.disabled=false; },4000);
						});
					});
				});
			}
		})();
		</script>
		<?php
	}

	/** Kaina lietuviskai. */
	private static function eur( $n ) {
		return number_format( (float) $n, 2, ',', ' ' ) . ' €';
	}


	/* ==================== v1.27: REDAGAVIMAS ==================== */

	/**
	 * Kainos keitimas. Kaina gyvena DVIEJOSE vietose: tevinio `_petshop_choice_config`
	 * JSON'e (is jo vitrina piesia mygtukus) ir pacioje pasleptoje prekeje. Jei
	 * pakeisi tik viena — vitrina rodys viena, o i krepseli kris kita.
	 */
	public static function ajax_seimos_kaina() {
		check_ajax_referer( 'ps_rink', 'nonce' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'Neturite teisių.' ); }

		$tid   = (int) ( $_POST['tevas'] ?? 0 );
		$gk    = sanitize_key( $_POST['gr'] ?? '' );
		$gram  = sanitize_text_field( wp_unslash( $_POST['gram'] ?? '' ) );
		$sz    = sanitize_text_field( wp_unslash( $_POST['sz'] ?? '' ) );
		$kaina = round( (float) str_replace( ',', '.', (string) ( $_POST['kaina'] ?? 0 ) ), 2 );

		if ( $kaina <= 0 ) { wp_send_json_error( 'Kaina turi būti teigiama.' ); }

		$cfg = json_decode( (string) get_post_meta( $tid, '_petshop_choice_config', true ), true );
		if ( ! isset( $cfg[ $gk ]['gramaturos'][ $gram ][ $sz ] ) ) { wp_send_json_error( 'Toks dydis nerastas.' ); }

		$hid = (int) $cfg[ $gk ]['gramaturos'][ $gram ][ $sz ]['product_id'];
		$prod = wc_get_product( $hid );
		if ( ! $prod ) { wp_send_json_error( 'Paslėpta prekė #' . $hid . ' nerasta.' ); }

		/* APSAUGA: dėžė negali būti brangesnė nei tos pačios prekės atskirai. */
		$pigiausia = self::krepsio_pigiausia( $hid );
		if ( $pigiausia !== null && $kaina > (int) $sz * $pigiausia + 0.005 ) {
			wp_send_json_error( sprintf(
				'Dėžė brangesnė nei prekės atskirai: %s vnt. pigiausiai kainuotų %s, o siūlai %s. Publikuoti negalima.',
				(int) $sz, self::eur( (int) $sz * $pigiausia ), self::eur( $kaina ) ) );
		}

		$prod->set_price( $kaina );
		$prod->set_regular_price( $kaina );
		$prod->save();

		$cfg[ $gk ]['gramaturos'][ $gram ][ $sz ]['price'] = $kaina;
		update_post_meta( $tid, '_petshop_choice_config', wp_slash( wp_json_encode( $cfg ) ) );

		/* tevinio kaina = pirmo dydzio, kaip 550 formoje */
		$fg = array_key_first( $cfg );
		$fgram = array_key_first( $cfg[ $fg ]['gramaturos'] );
		$fsz = array_key_first( $cfg[ $fg ]['gramaturos'][ $fgram ] );
		$tp = wc_get_product( $tid );
		if ( $tp ) {
			$tp->set_price( $cfg[ $fg ]['gramaturos'][ $fgram ][ $fsz ]['price'] );
			$tp->set_regular_price( $cfg[ $fg ]['gramaturos'][ $fgram ][ $fsz ]['price'] );
			$tp->save();
		}
		wc_delete_product_transients( $hid );

		if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
			Petshop_Ivykiai::irasyti( $hid, 'rinkinys_pakeistas', array(
				'saltinis' => 'Pasirenkami rinkiniai', 'reiksme' => 'kaina → ' . self::eur( $kaina ) ) );
		}
		wp_send_json_success( array( 'kaina' => $kaina, 'hid' => $hid ) );
	}

	/** Pigiausia krepsio prekes kaina — kainos apsaugai. */
	private static function krepsio_pigiausia( $hid ) {
		global $wpdb;
		$ids = $wpdb->get_col( $wpdb->prepare(
			"SELECT product_id FROM {$wpdb->prefix}wc_mnm_child_items WHERE container_id=%d", (int) $hid ) );
		$k = array();
		foreach ( $ids as $cid ) {
			$p = wc_get_product( (int) $cid );
			if ( $p && (float) $p->get_price() > 0 ) { $k[] = (float) $p->get_price(); }
		}
		return $k ? min( $k ) : null;
	}

	/**
	 * Krepsio keitimas. Krepsys priklauso GRAMATURAI, todel prekė dedama/isimama
	 * is VISU tos gramaturos dydziu — kitaip 6 vnt. ir 12 vnt. turetu skirtinga
	 * pasirinkima, ko klientas nesupranta.
	 */
	public static function ajax_seimos_krepsys() {
		check_ajax_referer( 'ps_rink', 'nonce' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'Neturite teisių.' ); }
		global $wpdb;

		$tid  = (int) ( $_POST['tevas'] ?? 0 );
		$gk   = sanitize_key( $_POST['gr'] ?? '' );
		$gram = sanitize_text_field( wp_unslash( $_POST['gram'] ?? '' ) );
		$pid  = (int) ( $_POST['preke'] ?? 0 );
		$veiksmas = sanitize_key( $_POST['veiksmas'] ?? '' );

		$cfg = json_decode( (string) get_post_meta( $tid, '_petshop_choice_config', true ), true );
		if ( ! isset( $cfg[ $gk ]['gramaturos'][ $gram ] ) ) { wp_send_json_error( 'Grupė arba gramatūra nerasta.' ); }

		$hids = array();
		foreach ( $cfg[ $gk ]['gramaturos'][ $gram ] as $si ) { $hids[] = (int) $si['product_id']; }
		$hids = array_filter( $hids );
		if ( ! $hids ) { wp_send_json_error( 'Šios gramatūros dydžių nėra.' ); }

		$tbl = $wpdb->prefix . 'wc_mnm_child_items';

		if ( $veiksmas === 'prideti' ) {
			$p = wc_get_product( $pid );
			if ( ! $p ) { wp_send_json_error( 'Prekė #' . $pid . ' nerasta.' ); }
			$esami = $wpdb->get_col( $wpdb->prepare(
				"SELECT product_id FROM {$tbl} WHERE container_id=%d", $hids[0] ) );
			if ( in_array( (string) $pid, array_map( 'strval', $esami ), true ) ) {
				wp_send_json_error( 'Ši prekė krepšyje jau yra.' );
			}
			if ( count( $esami ) >= 8 ) {
				wp_send_json_error( 'Krepšyje jau 8 prekės. Virš 8 dėžė pralaimi savo kategorijai — pirma išimk kurią nors.' );
			}
			/* sandelio taisykle: viena grupe = vienas sandelis = viena siunta */
			$naujo = strtolower( (string) get_post_meta( $pid, '_ps_sandelis', true ) ?: 'av' );
			foreach ( $esami as $cid ) {
				$s = strtolower( (string) get_post_meta( (int) $cid, '_ps_sandelis', true ) ?: 'av' );
				if ( $s !== $naujo ) {
					wp_send_json_error( 'Krepšyje jau yra ' . strtoupper( $s ) . ' sandėlio prekių, o ši — '
						. strtoupper( $naujo ) . '. Vienas krepšys = vienas sandėlis = viena siunta.' );
				}
			}
			foreach ( $hids as $hid ) {
				$eile = (int) $wpdb->get_var( $wpdb->prepare(
					"SELECT COALESCE(MAX(menu_order),0)+1 FROM {$tbl} WHERE container_id=%d", $hid ) );
				$wpdb->insert( $tbl, array( 'product_id' => $pid, 'container_id' => $hid, 'menu_order' => $eile ),
					array( '%d', '%d', '%d' ) );
				wc_delete_product_transients( $hid );
			}
			$zinute = 'Pridėta: ' . $p->get_name();
		} elseif ( $veiksmas === 'isimti' ) {
			$esami = $wpdb->get_col( $wpdb->prepare(
				"SELECT product_id FROM {$tbl} WHERE container_id=%d", $hids[0] ) );
			if ( count( $esami ) <= 2 ) {
				wp_send_json_error( 'Krepšyje liktų mažiau nei 2 prekės — klientui nebūtų iš ko rinktis.' );
			}
			foreach ( $hids as $hid ) {
				$wpdb->delete( $tbl, array( 'container_id' => $hid, 'product_id' => $pid ), array( '%d', '%d' ) );
				wc_delete_product_transients( $hid );
			}
			$p = wc_get_product( $pid );
			$zinute = 'Išimta: ' . ( $p ? $p->get_name() : '#' . $pid );
		} else {
			wp_send_json_error( 'Nežinomas veiksmas.' );
		}

		if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
			Petshop_Ivykiai::irasyti( $tid, 'rinkinys_pakeistas', array(
				'saltinis' => 'Pasirenkami rinkiniai', 'reiksme' => $zinute . ' (' . $gk . ' / ' . $gram . ' g)' ) );
		}
		wp_send_json_success( array( 'zinute' => $zinute ) );
	}

	/* ==================== SARASAS ==================== */

	/* ==================== SARASAS ==================== */

	/**
	 * Sarasas sukurtas galvojant apie 200+ rinkiniu, ne apie 14.
	 * Serveris paduoda visus duomenis vienu kartu, filtravimas/rikiavimas vyksta
	 * narsykleje — taip kiekvienas filtro paspaudimas neperkrauna puslapio.
	 * Prie kelių tukstanciu tektu pereiti i serverio puse; iki tol tai greiciau.
	 */
	private static function sarasas() {
		$sar    = self::rinkiniai();
		$rusys  = self::rusys();
		$nauja  = admin_url( 'admin.php?page=' . self::SLUG . '&veiksmas=naujas' );

		/* kategorijos filtrui — tik tos, kurios realiai naudojamos */
		$kat = array();
		foreach ( $sar as $r ) {
			foreach ( (array) $r['kat'] as $k ) { $kat[ $k ] = ( $kat[ $k ] ?? 0 ) + 1; }
		}
		ksort( $kat );

		$duomenys = array();
		foreach ( $sar as $r ) {
			$proc = ( $r['marza'] !== null && $r['kaina'] > 0 ) ? round( $r['marza'] / $r['kaina'] * 100 ) : null;
			$duomenys[] = array(
				'id'    => (int) $r['id'],
				'pav'   => $r['pav'],
				'sku'   => $r['sku'],
				'st'    => $r['busena'],
				'tipas' => $r['tipas'] ?? 'mnm',
				'kaina' => (float) $r['kaina'],
				'sav'   => $r['savikaina'],
				'suma'  => (float) $r['suma'],
				'marza' => $r['marza'],
				'pct'   => $proc,
				'vnt'   => (int) $r['vnt'],
				'poz'   => (int) $r['poz'],
				'miss'  => (int) $r['truksta'],
				'lubos' => $r['lubos'],
				'sand'  => array_values( (array) $r['sandeliai'] ),
				'rusis' => $r['rusis'] ?? null,
				'kat'   => array_values( (array) $r['kat'] ),
				'foto'  => $r['foto'] ?? '',
				'komp'  => array_slice( (array) ( $r['komp'] ?? array() ), 0, 8 ),
				'keista' => $r['keista'] ?? '',
				'nuoroda' => admin_url( 'admin.php?page=' . self::SLUG . '&veiksmas=keisti&id=' . (int) $r['id'] ),
				'perziura' => get_permalink( (int) $r['id'] ),
			);
		}

		/* v1.31: siuksline — ta pati lentele, ketvirta busena. Atskiro bloko
		   nebera: prie 50 rinkiniu jis butu uzemes geriausia ekrano vieta ir
		   dubliaves tai, ka lentele jau moka (rikiavimas, paieska, nuotraukos). */
		foreach ( self::siuksliadezeje() as $t ) {
			$duomenys[] = array(
				'id' => (int) $t['id'], 'pav' => $t['pav'], 'sku' => $t['sku'],
				'st' => 'trash', 'tipas' => $t['tipas'],
				'kaina' => (float) $t['kaina'], 'sav' => null, 'suma' => 0.0,
				'marza' => null, 'pct' => null, 'vnt' => 0, 'poz' => 0, 'miss' => 0,
				'lubos' => null, 'sand' => array(), 'rusis' => null,
				'kat' => array_values( (array) $t['kat'] ), 'foto' => $t['foto'],
				'komp' => array(), 'keista' => $t['keista'], 'dienos' => (int) $t['dienos'],
				'nuoroda' => '', 'perziura' => '',
			);
		}

		echo '<h1 class="wp-heading-inline">Rinkiniai</h1> ';
		echo '<a href="' . esc_url( $nauja ) . '" class="page-title-action">➕ Sukurti rinkinį</a>';
		echo '<p class="description">Bet kokių prekių derinys su fiksuota kaina. Klientas gauna tai, ką sudėjome.</p>';

		echo '<div id="psr-eiles" class="psr-eiles"></div>';
		echo '<div id="psr-eile-paaisk" class="psr-eile-paaisk"></div>';
		echo '<div id="psr-filtrai" class="psr-filtrai-blk"></div>';
		echo '<div id="psr-masiniai"></div>';
		echo '<div class="psr-virsus">'
			. '<span class="psr-mut" id="psr-rodoma"></span><span class="psr-sp"></span>'
			. '<span class="psr-f"><label>Rikiuoti</label><select id="psr-sort">'
			. '<option value="keista">Paskutinis keitimas</option>'
			. '<option value="pav">Pavadinimas</option>'
			. '<option value="marza">Marža €</option>'
			. '<option value="pct">Marža %</option>'
			. '<option value="kaina">Kaina</option>'
			. '<option value="lubos">Galima parduoti</option>'
			. '</select></span><span class="psr-grupe" id="psr-vaizdas"></span></div>';
		echo '<div id="psr-turinys"></div>';

		self::sarasas_js( $duomenys, $rusys, array_keys( $kat ) );
	}

	/**
	 * Bukle = ka mato klientas + kas neaisku mums. Pirmas zenklas — svarbiausias.
	 * Zodziai kliento kalba: ne „nesurenkamas", o „klientas mato Neturime".
	 */
	private static function bedos( $r ) {
		$b = array();
		if ( $r['busena'] !== 'publish' ) {
			$b[] = array( 'b', 'juodraštis · klientas nemato' );
		} elseif ( $r['lubos'] === 0 ) {
			$b[] = array( 'r', 'klientas mato „Neturime"' );
		}
		if ( $r['lubos'] !== null && $r['lubos'] > 0 && $r['lubos'] < 5 ) { $b[] = array( 'y', 'likutis ' . $r['lubos'] ); }
		if ( $r['truksta'] ) { $b[] = array( 'y', $r['truksta'] . ' be savikainos' ); }
		if ( $r['marza'] !== null && $r['marza'] < 0 ) { $b[] = array( 'r', 'marža minusinė' ); }
		if ( ( $r['tipas'] ?? 'mnm' ) === 'mnm' && ! $r['fiksuota'] ) { $b[] = array( 'y', 'kiekiai nefiksuoti' ); }
		if ( ( $r['tipas'] ?? 'mnm' ) === 'dp' && empty( $r['baze_pav'] ) ) { $b[] = array( 'r', 'bazinė prekė nerasta' ); }
		return $b;
	}

	private static function busena_pav( $b ) {
		$m = array( 'draft' => 'juodraštis', 'pending' => 'laukia', 'private' => 'privatus' );
		return $m[ $b ] ?? $b;
	}

	private static function sarasas_js( $duomenys, $rusys, $kategorijos ) {
		$nonce  = wp_create_nonce( 'ps_rink' );
		$grizti = admin_url( 'admin.php?page=' . self::SLUG );
		?>
		<script>
		(function(){
			var N='<?php echo esc_js( $nonce ); ?>';
			var R=<?php echo wp_json_encode( $duomenys ); ?>;
			var RUSYS=<?php echo wp_json_encode( array_map( function( $r ) { return array( 'id' => $r['id'], 'v' => $r['v'] ); }, $rusys ) ); ?>;
			var KAT=<?php echo wp_json_encode( $kategorijos ); ?>;
			var f={eile:'',tipas:'',rusis:'',bus:'',sand:'',marza:'',kat:'',q:''};
			var vaizdas='lentele', kryptis={}, pazymeti={};
			var $=function(s){return document.querySelector(s);};

			function eur(n){return (n===null||n===undefined||isNaN(n))?'—':Number(n).toFixed(2).replace('.',',')+' €';}
			function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}

			/* Bukle kliento kalba — tas pats, kas serveryje, kad nesiskirtu. */
			function bedos(x){
				var b=[];
				if(x.st!=='publish') b.push(['b','juodraštis · klientas nemato']);
				else if(x.lubos===0) b.push(['r','klientas mato „Neturime“']);
				if(x.lubos!==null&&x.lubos>0&&x.lubos<5) b.push(['y','likutis '+x.lubos]);
				if(x.miss) b.push(['y',x.miss+' be savikainos']);
				if(x.marza!==null&&x.marza<0) b.push(['r','marža minusinė']);
				if(x.tipas==='mnm'&&x.vnt===0) b.push(['y','kiekiai nefiksuoti']);
				return b;
			}

			/* Eiles = darbo krepseliai: kiekviena atsako „ka dabar daryti". */
			var EILES=[
			 ['','Visi rinkiniai','',function(x){return x.st!=='trash';},'Viskas, kas sukurta — ir prekyboje, ir juodraščiai. Šiukšlinė neįskaičiuota.'],
			 ['prekyboje','Prekyboje','g',function(x){return x.st==='publish'&&x.lubos!==0;},'Publikuoti ir klientas gali nusipirkti.'],
			 ['neparduoda','Klientas negali nusipirkti','r',function(x){return x.st==='publish'&&x.lubos===0;},'Rinkinys publikuotas, bet trūksta prekių — parduotuvėje rodomas kaip „Neturime“. Papildyk likutį arba nuimk iš prekybos.'],
			 ['likutis','Likutis baigiasi','y',function(x){return x.st!=='trash'&&x.lubos!==null&&x.lubos>0&&x.lubos<5;},'Liko mažiau nei 5 rinkiniai. Verta užsakyti prekių.'],
			 ['nocost','Be savikainos','y',function(x){return x.st!=='trash'&&x.miss>0;},'Bent vienos prekės savikaina neįrašyta — maržos apskaičiuoti negalima.'],
			 ['juod','Juodraščiai','b',function(x){return x.st!=='publish'&&x.st!=='trash';},'Sukurti, bet dar nepublikuoti. Klientas jų nemato.'],
			 ['siuk','Šiukšlinėje','r',function(x){return x.st==='trash';},'Ištrinti, bet dar atstatomi. Grąžinami arba trinami visam čia pat, eilutėje.']
			];

			function filtruoti(){
				var e=EILES.filter(function(x){return x[0]===f.eile;})[0]||EILES[0];
				var out=R.filter(e[3]);
				if(f.tipas) out=out.filter(function(x){return x.tipas===f.tipas;});
				if(f.rusis) out=out.filter(function(x){return String(x.rusis)===String(f.rusis);});
				if(f.bus)   out=out.filter(function(x){
					if(f.bus==='trash')   return x.st==='trash';
					if(f.bus==='publish') return x.st==='publish';
					return x.st!=='publish'&&x.st!=='trash';
				});
				if(f.sand)  out=out.filter(function(x){return x.sand.indexOf(f.sand)>=0;});
				if(f.kat)   out=out.filter(function(x){return x.kat.indexOf(f.kat)>=0;});
				if(f.marza) out=out.filter(function(x){
					if(f.marza==='nezinoma') return x.marza===null;
					if(x.pct===null) return false;
					if(f.marza==='zema') return x.pct<25;
					if(f.marza==='vid') return x.pct>=25&&x.pct<35;
					if(f.marza==='auksta') return x.pct>=35;
					return true;
				});
				var q=(f.q||'').toLowerCase().trim();
				if(q) out=out.filter(function(x){
					if((x.pav+' '+x.sku).toLowerCase().indexOf(q)>=0) return true;
					return x.komp.some(function(c){return c.pav.toLowerCase().indexOf(q)>=0;});
				});
				var s=$('#psr-sort').value, kr=kryptis[s]||1;
				out.sort(function(a,b){
					if(s==='pav') return a.pav.localeCompare(b.pav)*kr;
					if(s==='keista') return (a.keista<b.keista?1:a.keista>b.keista?-1:0)*kr;
					var va=a[s]===null?-99999:a[s], vb=b[s]===null?-99999:b[s];
					return (vb-va)*kr;
				});
				return out;
			}

			function pieštiEiles(){
				document.getElementById('psr-eiles').innerHTML=EILES.map(function(e){
					var n=R.filter(e[3]).length;
					return '<button class="psr-eile '+e[2]+(f.eile===e[0]?' on':'')+'" title="'+esc(e[4])+'"'
						+' data-e="'+e[0]+'"><b>'+n+'</b><span>'+e[1]+'</span></button>';
				}).join('');
				document.querySelectorAll('#psr-eiles .psr-eile').forEach(function(b){
					b.onclick=function(){ var k=this.dataset.e; f.eile=(f.eile===k?'':k); pieštiEiles(); pieszti(); };
				});
				var e=EILES.filter(function(x){return x[0]===f.eile;})[0];
				document.getElementById('psr-eile-paaisk').innerHTML=(e&&e[0])?'<b>'+esc(e[1])+'</b> — '+esc(e[4]):'';
			}

			function grupe(laukas,reiksmes){
				return '<span class="psr-grupe">'+reiksmes.map(function(t){
					return '<button class="'+(f[laukas]===t[0]?'on':'')+(t[2]===0?' tuscia':'')+'"'
						+(t[3]?' title="'+esc(t[3])+'"':'')
						+' data-l="'+laukas+'" data-v="'+t[0]+'">'+esc(t[1])
						+(t[2]?' <i>'+t[2]+'</i>':'')+'</button>';
				}).join('')+'</span>';
			}
			function pieštiFiltrus(){
				var rsk={}, ksk={};
				R.forEach(function(x){ if(x.rusis) rsk[x.rusis]=(rsk[x.rusis]||0)+1;
					x.kat.forEach(function(k){ksk[k]=(ksk[k]||0)+1;}); });
				var h='<div class="psr-frow">';
				h+='<span class="psr-f"><label>Tipas</label>'+grupe('tipas',[['','Visi'],['mnm','Rinkinys'],['dp','Daugiau=pigiau']])+'</span>';
				var rr=[['','Visi']];
				RUSYS.forEach(function(g){
					var n=rsk[g.id]||0;
					var v=g.v.charAt(0)+g.v.slice(1).toLowerCase();
					rr.push([String(g.id),v,n,n?n+' rinkiniai':'kol kas nėra, bet galima kurti']);
				});
				h+='<span class="psr-f"><label>Gyvūnas</label>'+grupe('rusis',rr)+'</span>';
				h+='<span class="psr-f"><label>Būsena</label>'+grupe('bus',[['','Visos'],['publish','Prekyboje'],['draft','Juodraščiai'],['trash','Šiukšlinėje']])+'</span>';
				h+='</div><div class="psr-frow">';
				h+='<span class="psr-f"><label>Kategorija</label><select data-l="kat"><option value="">— visos —</option>'
					+KAT.map(function(k){return '<option value="'+esc(k)+'"'+(f.kat===k?' selected':'')+'>'+esc(k)+' ('+(ksk[k]||0)+')</option>';}).join('')
					+'</select></span>';
				h+='<span class="psr-f"><label>Marža</label><select data-l="marza">'
					+[['','— bet kokia —'],['zema','žemiau 25 %'],['vid','25–35 %'],['auksta','virš 35 %'],['nezinoma','nežinoma']]
						.map(function(m){return '<option value="'+m[0]+'"'+(f.marza===m[0]?' selected':'')+'>'+m[1]+'</option>';}).join('')
					+'</select></span>';
				h+='<span class="psr-f"><label>Sandėlis</label>'+grupe('sand',[['','Visi'],['av','AV'],['vf','VF'],['zb','ZB']])+'</span>';
				h+='<span class="psr-f psr-f-plati"><label>Paieška</label><input type="text" id="psr-q" value="'+esc(f.q)+'" placeholder="rinkinio pavadinimas, SKU arba prekė viduje…"></span>';
				h+='</div>';
				var akt=[];
				if(f.tipas) akt.push(['Tipas: '+(f.tipas==='dp'?'Daugiau=pigiau':'Rinkinys'),'tipas']);
				if(f.rusis){ var g=RUSYS.filter(function(x){return String(x.id)===String(f.rusis);})[0]; akt.push(['Gyvūnas: '+(g?g.v:f.rusis),'rusis']); }
				if(f.bus) akt.push(['Būsena: '+(f.bus==='publish'?'Prekyboje':(f.bus==='trash'?'Šiukšlinėje':'Juodraščiai')),'bus']);
				if(f.kat) akt.push(['Kategorija: '+f.kat,'kat']);
				if(f.marza) akt.push(['Marža: '+f.marza,'marza']);
				if(f.sand) akt.push(['Sandėlis: '+f.sand.toUpperCase(),'sand']);
				if(f.q) akt.push(['Paieška: '+f.q,'q']);
				if(akt.length) h+='<div class="psr-aktyvus"><span class="psr-mut">Filtrai:</span>'
					+akt.map(function(a){return '<span class="psr-chip">'+esc(a[0])+'<button data-x="'+a[1]+'">✕</button></span>';}).join('')
					+'<button class="button button-small" id="psr-isvalyti">Išvalyti visus</button></div>';
				document.getElementById('psr-filtrai').innerHTML=h;

				document.querySelectorAll('#psr-filtrai .psr-grupe button').forEach(function(b){
					b.onclick=function(){ f[this.dataset.l]=this.dataset.v; pieszti(); };
				});
				document.querySelectorAll('#psr-filtrai select[data-l]').forEach(function(sel){
					sel.onchange=function(){ f[this.dataset.l]=this.value; pieszti(); };
				});
				document.querySelectorAll('#psr-filtrai .psr-chip button').forEach(function(b){
					b.onclick=function(){ f[this.dataset.x]=''; pieszti(); };
				});
				var iv=document.getElementById('psr-isvalyti');
				if(iv) iv.onclick=function(){ f={eile:f.eile,tipas:'',rusis:'',bus:'',sand:'',marza:'',kat:'',q:''}; pieszti(); };
				var qi=document.getElementById('psr-q');
				if(qi){ qi.oninput=function(){ f.q=this.value; pieszti(); };
					if(f.q){ qi.focus(); qi.setSelectionRange(qi.value.length,qi.value.length); } }
			}

			function komponentai(x){
				var fo=x.komp.filter(function(c){return c.foto;}).slice(0,6);
				if(!fo.length) return '';
				return '<div class="psr-komp-eil">'+fo.map(function(c){
					return '<img src="'+c.foto+'" title="'+esc(c.pav)+(c.kiekis>1?' ×'+c.kiekis:'')+'">';}).join('')
					+(x.poz>6?'<span class="psr-dar">+'+(x.poz-6)+'</span>':'')+'</div>';
			}
			function zenklai(x){
				var b=bedos(x);
				return b.length?b.map(function(z){return '<span class="psr-z '+z[0]+'">'+z[1]+'</span>';}).join('')
					:'<span class="psr-z g">✓ prekyboje</span>';
			}

			function lentele(sar){
				var h='<table class="wp-list-table widefat striped psr-lentele"><thead><tr>'
					+'<th style="width:26px"><input type="checkbox" id="psr-visi"></th>'
					+'<th style="width:66px"></th>'
					+'<th class="psr-sort" data-s="pav">Rinkinys</th>'
					+'<th style="width:118px">Tipas</th>'
					+'<th style="width:56px" class="r">Vnt.</th>'
					+'<th style="width:88px" class="r psr-sort" data-s="sav">Savikaina</th>'
					+'<th style="width:88px" class="r">Atskirai</th>'
					+'<th style="width:88px" class="r psr-sort" data-s="kaina">Kaina</th>'
					+'<th style="width:118px" class="r psr-sort" data-s="marza">Marža</th>'
					+'<th style="width:96px" class="r psr-sort" data-s="lubos">Galima parduoti</th>'
					+'<th style="width:168px">Būklė</th></tr></thead><tbody>';
				if(!sar.length) h+='<tr><td colspan="11"><div class="psr-tuscia"><b>Nieko nerasta</b>Pakeisk filtrą arba paieškos žodį.</div></td></tr>';
				sar.forEach(function(x){
					h+='<tr class="'+(pazymeti[x.id]?'psr-pazymeta':'')+'">'
						+'<td><input type="checkbox" class="psr-chk" value="'+x.id+'" '+(pazymeti[x.id]?'checked':'')+'></td>'
						+'<td>'+(x.foto?'<img class="psr-foto" src="'+x.foto+'">':'<div class="psr-foto-n">nėra</div>')+'</td>'
						+'<td><div class="psr-pav"><a href="'+x.nuoroda+'">'+esc(x.pav)+'</a></div>'
						+'<div class="psr-mut">#'+x.id+(x.sku?' · '+esc(x.sku):'')+' · '+x.poz+' pozicijos · keista '+x.keista+'</div>'
						+komponentai(x)
						+veiksmai(x)+'</td>'
						+'<td>'+(x.tipas==='dp'?'<span class="psr-z b">Daugiau=pigiau</span>':'<span class="psr-z gr">Rinkinys</span>')
						+'<div class="psr-mut">'+esc((x.kat[0]||'—')).slice(0,22)+'</div></td>'
						+'<td class="r"><b>'+x.vnt+'</b></td>'
						+'<td class="r">'+(x.sav===null?'<span class="psr-mut">—</span>':eur(x.sav))+'</td>'
						+'<td class="r psr-mut">'+eur(x.suma)+'</td>'
						+'<td class="r"><b>'+eur(x.kaina)+'</b></td>'
						+'<td class="r">'+(x.marza===null?'<span class="psr-mut">—</span>'
							:(x.marza<0?'<b class="psr-bad">'+eur(x.marza)+' ('+x.pct+'%)</b>':'<b class="psr-ok">'+eur(x.marza)+' ('+x.pct+'%)</b>'))+'</td>'
						+'<td class="r">'+(x.lubos===null?'<span class="psr-mut">—</span>'
							:'<b class="'+(x.lubos===0?'psr-bad':(x.lubos<5?'psr-warn':'psr-ok'))+'">'+x.lubos+' vnt.</b>')+'</td>'
						+'<td>'+(x.st==='trash'
							? '<span class="psr-z r">šiukšlinėje '+(x.dienos||0)+' d.</span>'
							: zenklai(x))+'</td></tr>';
				});
				return h+'</tbody></table>';
			}

			function korteles(sar){
				if(!sar.length) return '<div class="psr-tuscia"><b>Nieko nerasta</b>Pakeisk filtrą.</div>';
				return '<div class="psr-korteles">'+sar.map(function(x){
					var b=bedos(x);
					return '<div class="psr-kort"><div class="psr-kfoto">'
						+(x.foto?'<img src="'+x.foto+'">':'<span class="psr-mut">nėra nuotraukos</span>')
						+'<span class="psr-zenklas">'+(x.tipas==='dp'?'<span class="psr-z b">×'+x.vnt+'</span>':'<span class="psr-z gr">'+x.vnt+' vnt.</span>')+'</span></div>'
						+'<div class="psr-kbody"><div class="psr-kpav"><a href="'+x.nuoroda+'">'+esc(x.pav)+'</a></div>'
						+'<div class="psr-kkaina">'+eur(x.kaina)+' '+(x.marza===null?'<span class="psr-mut">marža —</span>'
							:'<span class="'+(x.marza<0?'psr-bad':'psr-ok')+'" style="font-size:12px">'+x.pct+'%</span>')+'</div>'
						+'<div class="psr-kmeta"><span>'+(x.lubos===null?'—':x.lubos+' vnt.')+'</span><span>'
						+(b.length?'<span class="'+(b[0][0]==='r'?'psr-bad':(b[0][0]==='b'?'psr-mut':'psr-warn'))+'">'+b[0][1]+'</span>':'<span class="psr-ok">✓ prekyboje</span>')
						+'</span></div></div></div>';
				}).join('')+'</div>';
			}

			function pieštiMasinius(){
				var n=Object.keys(pazymeti).filter(function(k){return pazymeti[k];}).length;
				document.getElementById('psr-masiniai').innerHTML = n
					? '<div class="psr-masiniai"><b>Pažymėta: '+n+'</b>'
						+'<button class="button button-small" data-m="publish">Publikuoti</button>'
						+'<button class="button button-small" data-m="draft">Į juodraščius</button>'
						+'<button class="button button-small" data-m="csv">Eksportuoti CSV</button>'
						+'<span class="psr-sp"></span>'
						+'<button class="button button-small" data-m="atzymeti">Atžymėti</button></div>'
					: '';
				document.querySelectorAll('#psr-masiniai button').forEach(function(b){
					b.onclick=function(){
						var m=this.dataset.m;
						if(m==='atzymeti'){ pazymeti={}; pieszti(); return; }
						var ids=Object.keys(pazymeti).filter(function(k){return pazymeti[k];});
						if(m==='csv'){ eksportas(ids); return; }
						if(!confirm(ids.length+' rinkiniams pakeisti būseną į „'+(m==='publish'?'Prekyboje':'Juodraštis')+'"?')) return;
						alert('Masinis būsenos keitimas dar neįjungtas — bus kitame žingsnyje.');
					};
				});
			}
			function eksportas(ids){
				var sar=R.filter(function(x){return ids.indexOf(String(x.id))>=0;});
				var eil=[['ID','Pavadinimas','SKU','Tipas','Vnt','Savikaina','Atskirai','Kaina','Marza','Marza%','Galima parduoti','Busena']];
				sar.forEach(function(x){ eil.push([x.id,x.pav,x.sku,x.tipas,x.vnt,x.sav,x.suma,x.kaina,x.marza,x.pct,x.lubos,x.st]); });
				var csv=eil.map(function(r){return r.map(function(c){return '"'+String(c===null?'':c).replace(/"/g,'""')+'"';}).join(';');}).join('\n');
				var a=document.createElement('a');
				a.href='data:text/csv;charset=utf-8,\ufeff'+encodeURIComponent(csv);
				a.download='rinkiniai-'+new Date().toISOString().slice(0,10)+'.csv';
				a.click();
			}

			function veiksmai(x){
				if(x.st==='trash'){
					return '<div class="row-actions">'
						+'<span><a class="psr-siuk" data-v="grazinti" data-id="'+x.id+'" data-pav="'+esc(x.pav)+'">Grąžinti</a> | </span>'
						+'<span class="trash"><a class="psr-siuk" data-v="trinti" data-id="'+x.id+'" data-pav="'+esc(x.pav)+'">Ištrinti visam</a></span></div>';
				}
				return '<div class="row-actions"><span><a href="'+x.nuoroda+'">Redaguoti</a> | </span>'
					+'<span><a href="'+x.nuoroda+'&kopija='+x.id+'">Kopijuoti</a> | </span>'
					+'<span><a href="'+x.perziura+'" target="_blank">Peržiūrėti</a> | </span>'
					+'<span class="trash"><a class="psr-trinti" data-id="'+x.id+'" data-pav="'+esc(x.pav)+'">Ištrinti</a></span></div>';
			}

			function pieszti(){
				pieštiFiltrus();
				var sar=filtruoti();
				document.getElementById('psr-rodoma').textContent='Rodoma '+sar.length+' iš '+R.length;
				document.getElementById('psr-vaizdas').innerHTML=
					[['lentele','☰ Lentelė'],['korteles','▦ Kortelės']].map(function(v){
						return '<button class="'+(vaizdas===v[0]?'on':'')+'" data-v="'+v[0]+'">'+v[1]+'</button>';}).join('');
				document.querySelectorAll('#psr-vaizdas button').forEach(function(b){
					b.onclick=function(){ vaizdas=this.dataset.v; pieszti(); };
				});
				document.getElementById('psr-turinys').innerHTML = vaizdas==='lentele'?lentele(sar):korteles(sar);
				pieštiMasinius();

				document.querySelectorAll('.psr-chk').forEach(function(c){
					c.onchange=function(){ pazymeti[this.value]=this.checked; pieszti(); };
				});
				var v=document.getElementById('psr-visi');
				if(v) v.onchange=function(){ var c=this.checked; sar.forEach(function(x){pazymeti[x.id]=c;}); pieszti(); };
				document.querySelectorAll('.psr-sort').forEach(function(th){
					th.onclick=function(){
						var k=this.dataset.s, s=document.getElementById('psr-sort');
						if(s.value===k) kryptis[k]=(kryptis[k]||1)*-1; else { s.value=k; kryptis[k]=1; }
						pieszti();
					};
				});
				siukslinesMygtukai();
				document.querySelectorAll('.psr-trinti').forEach(function(a){
					a.onclick=function(e){
						e.preventDefault();
						var id=this.dataset.id;
						var visam=confirm('Ištrinti rinkinį „'+this.dataset.pav+'"?\n\nGerai = ištrinam VISAM LAIKUI (prekės kortelė dingsta).\nAtšaukti = tik į šiukšlinę (galima grąžinti).')?'1':'0';
						if(visam==='0' && !confirm('Perkelti „'+this.dataset.pav+'" į šiukšlinę?')) return;
						var fd=new FormData(); fd.append('action','ps_rink_trinti'); fd.append('nonce',N); fd.append('id',id); fd.append('visam',visam);
						fetch(ajaxurl,{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(j){
							if(j.success) location.href='<?php echo esc_js( $grizti ); ?>';
							else alert('Klaida: '+(j.data||'nežinoma'));
						});
					};
				});
			}
			function siukslinesMygtukai(){
			document.querySelectorAll('.psr-siuk').forEach(function(b){
				b.onclick=function(e){
					if(e&&e.preventDefault) e.preventDefault();
					var v=this.dataset.v, pav=this.dataset.pav;
					if(v==='trinti' && !confirm('Ištrinti „'+pav+'" NEGRĮŽTAMAI?\n\nPrekės kortelė dings visam laikui. Prekės, iš kurių rinkinys sudėtas, lieka.')) return;
					var fd=new FormData(); fd.append('action','ps_rink_siuksline'); fd.append('nonce',N);
					fd.append('id',this.dataset.id); fd.append('veiksmas',v);
					this.disabled=true;
					fetch(ajaxurl,{method:'POST',body:fd}).then(function(r){return r.json()}).then(function(j){
						if(j.success) location.reload(); else { alert('Klaida: '+(j.data||'nežinoma')); location.reload(); }
					});
				};
			});
			}
			document.getElementById('psr-sort').onchange=pieszti;
			pieštiEiles(); pieszti();
		})();
		</script>
		<?php
	}

	/* ==================== FORMA ==================== */

	private static function forma( $id ) {
		$kopija = isset( $_GET['kopija'] ) ? (int) $_GET['kopija'] : 0;
		$saltinis = $id ? $id : $kopija;
		$dp_baze = $saltinis ? (int) get_post_meta( $saltinis, '_dp_base_product_id', true ) : 0;

		$d = array(
			'pav' => '', 'sku' => '', 'kaina' => '', 'aprasymas' => '',
			'komp' => array(), 'publikuoti' => 0, 'kat_rankiniu' => array(), 'kat_off' => array(), 'tikslas' => 35,
		);
		if ( $saltinis ) {
			$post = get_post( $saltinis );
			if ( $post && $dp_baze ) {
				/* DP pakas: sudetis = viena bazine preke x pack_qty */
				$d['komp'][] = array( 'id' => $dp_baze, 'kiekis' => (int) get_post_meta( $saltinis, '_dp_pack_qty', true ) );
				$d['pav']   = $kopija ? $post->post_title . ' (kopija)' : $post->post_title;
				$d['sku']   = $kopija ? '' : (string) get_post_meta( $saltinis, '_sku', true );
				$d['kaina'] = (string) get_post_meta( $saltinis, '_price', true );
				$d['aprasymas'] = $post->post_excerpt;
				$d['publikuoti'] = ( ! $kopija && $post->post_status === 'publish' ) ? 1 : 0;
			} elseif ( $post ) {
				$kiekiai = json_decode( (string) get_post_meta( $saltinis, self::META_KIEKIAI, true ), true );
				if ( ! is_array( $kiekiai ) ) { $kiekiai = array(); }
				global $wpdb; $p = $wpdb->prefix;
				$vaikai = $wpdb->get_col( $wpdb->prepare(
					"SELECT product_id FROM {$p}wc_mnm_child_items WHERE container_id=%d ORDER BY menu_order", $saltinis ) );
				foreach ( $vaikai as $vid ) {
					$d['komp'][] = array( 'id' => (int) $vid, 'kiekis' => isset( $kiekiai[ (int) $vid ] ) ? (int) $kiekiai[ (int) $vid ] : 1 );
				}
				$d['pav']   = $kopija ? $post->post_title . ' (kopija)' : $post->post_title;
				$d['sku']   = $kopija ? '' : (string) get_post_meta( $saltinis, '_sku', true );
				$d['kaina'] = (string) get_post_meta( $saltinis, '_price', true );
				$d['aprasymas'] = $post->post_excerpt;
				$d['publikuoti'] = ( ! $kopija && $post->post_status === 'publish' ) ? 1 : 0;
				/* v1.27: rankines vietos = prekes kategorijos be automatiniu */
				$komp_ids = array_map( function ( $c ) { return (int) $c['id']; }, $d['komp'] );
				$auto = array_merge( array( 679 ), self::auto_vieta( $komp_ids ) );
				$off  = json_decode( (string) get_post_meta( $saltinis, self::META_KAT_OFF, true ), true );
				$d['kat_off'] = is_array( $off ) ? array_map( 'intval', $off ) : array();
				foreach ( array_map( 'intval', wc_get_product_term_ids( $saltinis, 'product_cat' ) ) as $kid ) {
					if ( ! in_array( $kid, $auto, true ) ) { $d['kat_rankiniu'][] = $kid; }
				}
			}
		}

		$medis  = self::medis();
		$svoriai = self::svoriai();
		$grizti = admin_url( 'admin.php?page=' . self::SLUG );

		echo '<h1 class="wp-heading-inline">' . ( $id ? '✏️ Redaguoti rinkinį' : '➕ Sukurti rinkinį' ) . '</h1> ';
		echo '<a href="' . esc_url( $grizti ) . '" class="page-title-action">← Į sąrašą</a>';
		echo '<p class="description">Bet kokios prekės, bet koks derinys, fiksuota kaina.</p>';

		echo '<div class="psr-forma" data-id="' . (int) $id . '">';

		/* ---------- KAIRE ---------- */
		echo '<div class="psr-kaire">';

		echo '<div class="psr-kort"><h3>1. Rinkinio duomenys</h3><div class="psr-vidus">';
		echo '<table class="form-table"><tbody>';
		echo '<tr><th><label>Pavadinimas *</label></th><td><input type="text" id="psr-pav" class="large-text" value="' . esc_attr( $d['pav'] ) . '" placeholder="Pvz. Startas šuniukui · maistas + skanėstai + žaislas"></td></tr>';
		echo '<tr><th><label>SKU *</label></th><td><input type="text" id="psr-sku" class="regular-text" value="' . esc_attr( $d['sku'] ) . '" placeholder="Pvz. RINK-STARTAS"></td></tr>';
		echo '<tr><th><label>Kur bus matomas</label></th><td><div id="psr-vieta"></div>';
		echo '<select id="psr-kat-rank"><option value="">+ pridėti vietą ranka…</option>';
		echo '<optgroup label="Katalogo struktūra">';
		foreach ( $medis['T'] as $t ) {
			echo '<option value="' . (int) $t[0] . '">' . esc_html( str_repeat( "\xC2\xA0\xC2\xA0\xC2\xA0", (int) $t[3] ) . $t[1] ) . '</option>';
		}
		echo '</optgroup><optgroup label="Kitos">';
		foreach ( $medis['O'] as $t ) { echo '<option value="' . (int) $t[0] . '">' . esc_html( $t[1] ) . '</option>'; }
		echo '</optgroup></select>';
		echo '<p class="description">Pilkos žymos priskiriamos automatiškai pagal pridėtas prekes. Klientas rinkinį ras šiose katalogo kategorijose.</p>';
		echo '</td></tr>';
		echo '<tr><th><label>Trumpas aprašymas</label></th><td><textarea id="psr-apr" class="large-text" rows="2">' . esc_textarea( $d['aprasymas'] ) . '</textarea></td></tr>';
		echo '</tbody></table></div></div>';

		/* ---- atranka ---- */
		echo '<div class="psr-kort"><h3>2. Prekių atranka<span class="psr-sp"></span><span class="description" id="psr-kat-info"></span></h3>';
		echo '<div class="psr-filtrai">';
		echo '<span class="psr-f"><label>Kategorija</label><select id="psr-f-kat"><option value="">— visos —</option>';
		echo '<optgroup label="Katalogo struktūra">';
		foreach ( $medis['T'] as $t ) {
			echo '<option value="' . (int) $t[0] . '">' . esc_html( str_repeat( "\xC2\xA0\xC2\xA0\xC2\xA0", (int) $t[3] ) . $t[1] ) . ' (' . (int) $t[2] . ')</option>';
		}
		echo '</optgroup><optgroup label="Senos kategorijos (ne meniu)">';
		foreach ( $medis['O'] as $t ) { echo '<option value="' . (int) $t[0] . '">' . esc_html( $t[1] ) . ' (' . (int) $t[2] . ')</option>'; }
		echo '</optgroup></select></span>';

		echo '<span class="psr-f"><label>Svoris / dydis</label><select id="psr-f-svoris"><option value="">— bet koks —</option>';
		foreach ( $svoriai as $s ) { echo '<option value="' . esc_attr( $s ) . '">' . esc_html( $s ) . '</option>'; }
		echo '</select></span>';

		echo '<span class="psr-f"><label>Sandėlis</label><span id="psr-f-sand">';
		foreach ( array( '' => 'Visi', 'av' => 'AV', 'vf' => 'VF', 'zb' => 'ZB' ) as $k => $v ) {
			echo '<button type="button" class="button psr-wh' . ( $k === '' ? ' button-primary' : '' ) . '" data-wh="' . esc_attr( $k ) . '">' . esc_html( $v ) . '</button>';
		}
		echo '</span></span>';

		echo '<span class="psr-f"><label>Savikaina</label><select id="psr-f-savik">'
			. '<option value="">— bet kokia —</option><option value="a">iki 2 €</option><option value="b">2–5 €</option>'
			. '<option value="c">5–15 €</option><option value="d">virš 15 €</option><option value="x">be savikainos</option></select></span>';

		echo '<span class="psr-f psr-f-plati"><label>Paieška</label>'
			. '<input type="text" id="psr-q" placeholder="pavadinimas arba SKU…" autocomplete="off">'
			. '<button type="button" class="button" id="psr-browse">Rodyti visus tinkamus</button>'
			. '<a href="#" id="psr-isvalyti" class="psr-mut">išvalyti</a></span>';
		echo '</div>';
		echo '<div id="psr-rez" class="psr-rez"><div class="psr-tuscia">Įrašyk bent 2 simbolius arba spausk „Rodyti visus tinkamus".</div></div>';
		echo '</div>';

		/* ---- sudetis ---- */
		echo '<div class="psr-kort"><h3>3. Rinkinio sudėtis<span class="psr-sp"></span><span class="description" id="psr-sud-info"></span></h3>';
		echo '<div id="psr-tipas"></div>';
		echo '<div id="psr-sudetis"></div></div>';

		echo '</div>'; /* /kaire */

		/* ---------- DESINE ---------- */
		echo '<div class="psr-desine">';

		echo '<div class="psr-kort psr-lipni"><h3>4. Kainodara</h3><div class="psr-vidus" id="psr-kainodara"></div></div>';

		echo '<div class="psr-kort"><h3>5. Kaip matys klientas</h3><div class="psr-vidus" id="psr-perziura"></div></div>';

		echo '</div></div>'; /* /desine /forma */

		/* ---------- APATINE JUOSTA ---------- */
		echo '<div class="psr-juosta">';
		echo '<button type="button" class="button button-primary button-large" id="psr-issaugoti" disabled>' . ( $id ? '💾 Išsaugoti pakeitimus' : 'Sukurti rinkinį' ) . '</button>';
		echo '<a href="' . esc_url( $grizti ) . '" class="button">Atšaukti</a>';
		echo '<label class="psr-varnele"><input type="checkbox" id="psr-publikuoti"' . checked( $d['publikuoti'], 1, false ) . '> <b>Publikuoti</b> <i>be varnelės rinkinys lieka juodraščiu ir parduotuvėje nematomas</i></label>';
		if ( $id ) {
			echo '<a href="' . esc_url( get_preview_post_link( $id ) ) . '" target="_blank" class="button">Peržiūrėti parduotuvėje</a>';
		}
		echo '<span class="psr-sp"></span><span class="psr-stat" id="psr-stat"></span>';
		if ( $id ) {
			echo '<button type="button" class="button psr-trink" id="psr-trinti-f" data-id="' . (int) $id . '" data-pav="' . esc_attr( $d['pav'] ) . '">Ištrinti</button>';
		}
		echo '</div>';

		self::forma_js( $id, $d, $medis, $kopija );
	}


	/* ==================== FORMOS JS ==================== */

	private static function forma_js( $id, $d, $medis, $kopija ) {
		$nonce  = wp_create_nonce( 'ps_rink' );
		$grizti = admin_url( 'admin.php?page=' . self::SLUG );
		$pradiniai = array();
		foreach ( $d['komp'] as $k ) {
			$pr = wc_get_product( $k['id'] );
			if ( ! $pr ) { continue; }
			$pradiniai[] = self::prekes_eilute( $pr, $k['kiekis'] );
		}
		?>
		<script>
		(function(){
			var N   = '<?php echo esc_js( $nonce ); ?>';
			var ID  = <?php echo (int) $id; ?>;
			var VARDAI = <?php echo wp_json_encode( $medis['vardai'] ); ?>;
			var K   = <?php echo wp_json_encode( $pradiniai ); ?>;   /* sudetis */
			var KAT_RANK = <?php echo wp_json_encode( array_values( array_map( 'intval', $d['kat_rankiniu'] ) ) ); ?>; /* rankiniu budu pridetos vietos */
			var KAT_OFF  = <?php echo wp_json_encode( array_values( array_map( 'intval', $d['kat_off'] ) ) ); ?>;      /* v1.36: nuimtos automatines vietos */
			/* v1.28: pradinis sandelis paveldimas is jau esanciu komponentu */
			var PRAD_SAND=(function(){ var u={}; K.forEach(function(c){ u[(c.sandelis||'av')]=1; });
				var l=Object.keys(u); return l.length===1?l[0]:''; })();
			var f = { kat:'', svoris:'', sand:PRAD_SAND, savik:'', q:'', browse:false };
			var PRADINE_KAINA = '<?php echo esc_js( str_replace( '.', ',', (string) $d['kaina'] ) ); ?>';
			var laikmatis = null, uzklausa = 0;

			var $ = function(s){ return document.querySelector(s); };
			function eur(n){ return (n===null||n===undefined||isNaN(n))?'—':Number(n).toFixed(2).replace('.',',')+' €'; }
			function siuntKlase(kg){ return kg<=50?'Iki 50kg':(kg<=70?'50-70kg':(kg<=100?'70-100kg':'100-200kg')); }
			/* Kaina ivedama lietuviskai: 13,90. type=number tokio formato nepriima,
			   todel laukas paprastas, o cia normalizuojam abu variantus. */
			function skaicius(v){
				if(v===null||v===undefined) return 0;
				var t=String(v).replace(/\s/g,'').replace(',','.').replace(/[^0-9.\-]/g,'');
				var n=parseFloat(t);
				return isNaN(n)?0:n;
			}
			function kainaTekstu(n){ return (Math.round(n*100)/100).toFixed(2).replace('.',','); }
			function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

			/* ---------- skaiciavimai ---------- */
			function skaiciuoti(){
				var vnt=0, sav=0, suma=0, truksta=0, lubos=null, negalimi=[], sand={};
				K.forEach(function(c){
					vnt += c.kiekis;
					suma += c.kaina * c.kiekis;
					if (c.savikaina===null) truksta++; else sav += c.savikaina*c.kiekis;
					if (c.likutis!==null){ var g=Math.floor(c.likutis/c.kiekis); if(lubos===null||g<lubos) lubos=g; }
					if (!c.yra) negalimi.push(c);
					sand[c.sandelis]=1;
				});
				var svoris=0, beSvorio=[];
				K.forEach(function(c){
					if(c.svoris_kg>0) svoris += c.svoris_kg * c.kiekis;
					else beSvorio.push(c.pav);
				});
				svoris=Math.round(svoris*1000)/1000;
				var kaina = skaicius($('#psr-kaina') ? $('#psr-kaina').value : PRADINE_KAINA);
				var tikslas = parseInt($('#psr-tikslas')?$('#psr-tikslas').value:35)||35;
				var marza = (!truksta && kaina>0) ? kaina-sav : null;
				var proc  = (marza!==null && kaina>0) ? marza/kaina*100 : null;
				var rek   = (!truksta && sav>0 && tikslas<100) ? sav/(1-tikslas/100) : null;
				var maxM  = (!truksta && suma>0) ? (suma-sav)/suma*100 : null;
				var drops = Object.keys(sand).filter(function(s){return s!=='av';});
				return { vnt:vnt, sav:sav, suma:suma, truksta:truksta, kaina:kaina, tikslas:tikslas,
					marza:marza, proc:proc, rek:rek, maxM:maxM, lubos:lubos, negalimi:negalimi,
					mix: drops.length>1, sand:Object.keys(sand),
					svoris:svoris, beSvorio:beSvorio };
			}

			/* ---------- vieta kataloge (atkartoja snippet 569) ---------- */
			function autoVieta(){
				var sk={}, pav=[];
				K.forEach(function(c){
					pav.push(c.pav.toLowerCase());
					(c.kat||[]).forEach(function(id){
						if ([91,679,682,683,684].indexOf(id)>=0) return;
						sk[id]=(sk[id]||0)+1;
					});
				});
				var best=null,bn=0;
				Object.keys(sk).forEach(function(id){ if(sk[id]>bn){bn=sk[id];best=parseInt(id);} });
				var res={tipas:best,porusis:null,nezinomas:false};
				if(best!==null){
					var nm=(VARDAI[best]||'').toLowerCase();
					if(nm.indexOf('konserv')>=0) res.porusis=682;
					else if(best===96) res.porusis=683;
					else if(best===95){
						var j=pav.join(' ');
						var kw=['ausis','ausys','koja','kojos','trachėj','kaul','snukis','kanop','sausgysl','kramtal','ragas','uodeg','sparn'];
						res.porusis = kw.some(function(w){return j.indexOf(w)>=0;}) ? 684 : 683;
					}
					else if(nm.indexOf('skanėst')>=0) res.porusis=683;
					else res.nezinomas=true;
				}
				return res;
			}
			function pieštiVieta(){
				var dp=(tipas()==='dp'), h='<div class="psr-chips">';
				var a=(!dp&&K.length)?autoVieta():{tipas:null,porusis:null,nezinomas:false};
				/* v1.36: automatines zymos irgi nuimamos — anksciau ju panaikinti nebuvo kaip */
				var autoIds=[dp?91:679]; if(a.tipas!==null)autoIds.push(a.tipas); if(a.porusis!==null)autoIds.push(a.porusis);
				autoIds.forEach(function(id){
					if(KAT_OFF.indexOf(id)>=0) return;
					var v=(id===679&&!dp)?'RINKINIAI':(id===91?'DAUGIAU=PIGIAU':esc(VARDAI[id]||id));
					h+='<span class="psr-chip auto">'+v+'<button type="button" data-off="'+id+'">✕</button></span>';
				});
				KAT_RANK.forEach(function(id,i){
					h+='<span class="psr-chip">'+esc(VARDAI[id]||id)+'<button type="button" data-i="'+i+'">✕</button></span>';
				});
				h+='</div>';
				if(!K.length) h+='<p class="description">Pridėk prekių — vieta nustatoma pagal jas.</p>';
				else if(dp) h+='<p class="description">Pakas paveldi bazinės prekės kategorijas ir DAUGIAU=PIGIAU.</p>';
				else if(a.nezinomas||a.porusis===null) h+='<div class="psr-perspejimas y">Porūšio nustatyti nepavyko (mišrus rinkinys) — kataloge atsiras tik po RINKINIAI. Pridėk vietą ranka, jei nori kitur.</div>';
				$('#psr-vieta').innerHTML=h;
				$('#psr-vieta').querySelectorAll('button').forEach(function(b){
					b.onclick=function(){
						if(this.dataset.off!==undefined){ var id=parseInt(this.dataset.off); if(KAT_OFF.indexOf(id)<0) KAT_OFF.push(id); }
						else { KAT_RANK.splice(parseInt(this.dataset.i),1); }
						pieštiVieta();
					};
				});
			}

			/* ---------- sudetis ---------- */
			function pieštiSudeti(){
				var s=skaiciuoti();
				$('#psr-sud-info').textContent = K.length ? (s.vnt+' vnt. · '+K.length+' pozicijos') : '';
				if(!K.length){
					$('#psr-sudetis').innerHTML='<div class="psr-tuscia">Tuščia. Susirask prekių viršuje ir spausk „Pridėti".</div>';
					return;
				}
				var h='<table class="wp-list-table widefat striped psr-sud"><thead><tr>'
					+'<th style="width:44px"></th><th>Prekė</th><th style="width:76px">Svoris</th>'
					+'<th style="width:72px">Kiekis</th><th style="width:88px" class="r">Savikaina</th>'
					+'<th style="width:88px" class="r">Pard. kaina</th><th style="width:92px" class="r">Eilutė</th>'
					+'<th style="width:34px"></th></tr></thead><tbody>';
				K.forEach(function(c,i){
					h+='<tr'+(c.yra?'':' class="psr-neg"')+'>'
						+'<td>'+(c.foto?'<img src="'+c.foto+'" class="psr-t32">':'')+'</td>'
						+'<td>'+esc(c.pav)+(c.yra?'':' <span class="psr-z r">nėra likučio</span>')
							+'<div class="psr-mut">'+esc(c.sku||'be SKU')+' · '+c.sandelis.toUpperCase()+' · likutis '+(c.likutis===null?'∞':c.likutis)+'</div></td>'
						+'<td class="psr-mut">'+esc(c.svoris||'—')+'</td>'
						+'<td><input type="number" min="1" step="1" value="'+c.kiekis+'" class="psr-kiekis small-text" data-i="'+i+'"></td>'
						+'<td class="r">'+(c.savikaina===null?'<span class="psr-warn">nėra</span>':eur(c.savikaina))+'</td>'
						+'<td class="r">'+eur(c.kaina)+'</td>'
						+'<td class="r">'+(c.savikaina===null?'—':eur(c.savikaina*c.kiekis))+'</td>'
						+'<td><button type="button" class="psr-x" data-i="'+i+'">✕</button></td></tr>';
				});
				h+='</tbody><tfoot><tr><th colspan="4">Iš viso '+s.vnt+' vnt.</th><th colspan="2"></th>'
					+'<th class="r">'+(s.truksta?'<span class="psr-warn">nepilna</span>':eur(s.sav))+'</th><th></th></tr></tfoot></table>';
				$('#psr-sudetis').innerHTML=h;
				$('#psr-sudetis').querySelectorAll('.psr-kiekis').forEach(function(inp){
					inp.onchange=function(){ K[parseInt(this.dataset.i)].kiekis=Math.max(1,parseInt(this.value)||1); atnaujinti(); };
				});
				$('#psr-sudetis').querySelectorAll('.psr-x').forEach(function(b){
					b.onclick=function(){ K.splice(parseInt(this.dataset.i),1); atnaujinti(); };
				});
			}

			/* ---------- tipas: viena preke xN = DP pakas, kelios = MnM rinkinys ---------- */
			function tipas(){
				if(K.length===1 && K[0].kiekis>=2) return 'dp';
				return 'mnm';
			}
			function pieštiTipa(){
				var t=tipas(), h='';
				if(!K.length){
					h='<div class="psr-tipas tuscia">Tipas nustatomas pagal sudėtį: <b>ta pati prekė × N</b> → Daugiau=pigiau pakas, <b>kelios skirtingos</b> → rinkinys.</div>';
				} else if(t==='dp'){
					var sku=$('#psr-sku');
					if(sku && !sku.value.trim() && K[0].sku){ sku.value='DP-'+K[0].sku+'-'+K[0].kiekis; tikrinti(); }
					h='<div class="psr-tipas dp"><b>Daugiau=pigiau pakas</b> — '+esc(K[0].pav.slice(0,40))+' × '+K[0].kiekis+' vnt.'
					 +'<div class="psr-mut">Klientas matys ženklą „×'+K[0].kiekis+' VNT.\u201c, juostą „EKONOMIŠKA PAKUOTĖ\u201c ir vieneto kainą. '
					 +'Iš bazinės prekės perimama: aprašymas, nuotrauka, atributai (filtrams), kategorijos ir brendas. '
					 +'SKU sugeneruojamas automatiškai. Kompozicija negeneruojama.</div></div>';
				} else {
					h='<div class="psr-tipas mnm"><b>Rinkinys</b> — '+K.length+' skirtingos prekės'
					 +'<div class="psr-mut">Klientas matys sudėties sąrašą. Nuotrauka sugeneruojama iš komponentų. Kategorija: RINKINIAI + porūšis.</div></div>';
				}
				var el=document.getElementById('psr-tipas'); if(el) el.innerHTML=h;
			}

			/* ---------- kainodara ---------- */
			function pieštiKainodara(){
				var s=skaiciuoti();
				var kaina = $('#psr-kaina') ? $('#psr-kaina').value : PRADINE_KAINA;
				var h='<table class="psr-kn">'
					+'<tr><td>Savikaina</td><td class="r">'+(s.truksta?'<span class="psr-warn">'+s.truksta+' be savikainos</span>':'<b>'+eur(s.sav)+'</b>')+'</td></tr>'
					+'<tr><td>Prekės atskirai</td><td class="r">'+eur(s.suma)+'</td></tr>'
					+'<tr><td>Norima marža</td><td class="r"><input type="number" id="psr-tikslas" min="0" max="95" value="'+s.tikslas+'" class="small-text"> %</td></tr>'
					+'<tr class="psr-rek"><td><b>Rekomenduojama kaina</b><div class="psr-mut">pagal savikainą ir norimą maržą</div></td>'
					+'<td class="r">'+(s.rek!==null?'<b>'+eur(s.rek)+'</b><div><a href="#" id="psr-naudoti">naudoti</a></div>':'<span class="psr-mut">—</span>')+'</td></tr>'
					+'</table>';
				if(s.rek!==null && s.suma>0 && s.rek>s.suma){
					h+='<div class="psr-perspejimas y">Su '+s.tikslas+' % marža kaina išeitų brangesnė nei prekės atskirai. Didžiausia marža nekeliant kainos virš '+eur(s.suma)+' — <b>'+Math.round(s.maxM)+' %</b>. <a href="#" id="psr-lubos">taikyti</a></div>';
				}
				h+='<div class="psr-kaina-blk"><label>Rinkinio kaina (€) *</label>'
					+'<input type="text" inputmode="decimal" id="psr-kaina" value="'+esc(kaina)+'" placeholder="0,00" autocomplete="off"></div>';
				h+='<table class="psr-kn">'
					+'<tr><td>Marža</td><td class="r">'+(s.marza!==null
						?(s.marza<0?'<b class="psr-bad">'+eur(s.marza)+' ('+Math.round(s.proc)+'%) ❌</b>'
						            :'<b class="psr-ok">'+eur(s.marza)+' ('+Math.round(s.proc)+'%) ✅</b>')
						:'<span class="psr-mut">—</span>')+'</td></tr>'
					+'<tr><td>Klientas sutaupo</td><td class="r">'+((s.kaina>0&&s.suma>0)
						?(s.suma>s.kaina?'<span class="psr-ok">'+eur(s.suma-s.kaina)+' ('+Math.round((s.suma-s.kaina)/s.suma*100)+'%)</span>':'<b class="psr-bad">brangiau ❌</b>')
						:'—')+'</td></tr>'
					+'<tr><td>Galima parduoti</td><td class="r">'+(s.lubos!==null?'<b class="'+(s.lubos<5?'psr-bad':'psr-ok')+'">'+s.lubos+' vnt.</b>':'—')+'</td></tr>'
					+'<tr><td>Svoris</td><td class="r">'+(s.svoris>0
						?'<b>'+String(s.svoris).replace('.',',')+' kg</b>'+(s.svoris>25?' <span class="psr-bad">⚠</span>':'')
						:'<span class="psr-warn">nežinomas</span>')+'</td></tr>'
					+(s.svoris>0?'<tr><td>Siuntimo klasė</td><td class="r psr-mut">'+siuntKlase(s.svoris)+'</td></tr>':'')
					+'</table>';
				if(s.kaina>0&&s.suma>0&&s.suma<=s.kaina) h+='<div class="psr-perspejimas r">Rinkinys brangesnis nei prekės atskirai ('+eur(s.suma)+'). Klientui tai atrodys kaip apgaulė.</div>';
				if(s.marza!==null&&s.marza<0) h+='<div class="psr-perspejimas r">Marža minusinė — parduodi žemiau savikainos.</div>';
				if(s.negalimi.length) h+='<div class="psr-perspejimas r">'+s.negalimi.length+' prekės be likučio: '+esc(s.negalimi[0].pav.slice(0,34))+(s.negalimi.length>1?'…':'')+'. Rinkinio surinkti negalima.</div>';
				if(s.mix) h+='<div class="psr-perspejimas y">Rinkinyje kelių dropship tiekėjų prekės ('+s.sand.join(', ').toUpperCase()+') — klientui išeis kelios siuntos.</div>';
				if(s.beSvorio.length) h+='<div class="psr-perspejimas y"><b>'+s.beSvorio.length+' prekės be svorio</b> ('+esc(s.beSvorio[0].slice(0,34))+(s.beSvorio.length>1?'…':'')+'). Siuntimo kaina bus paskaičiuota neteisingai — įrašyk svorį prekės kortelėje.</div>';
				if(s.svoris>25) h+='<div class="psr-perspejimas r"><b>Svoris '+String(s.svoris).replace('.',',')+' kg — per didelis paštomatui.</b> Klientui paštomatų pasirinkimas bus išjungtas, liks tik kurjeris.</div>';
				var senas=$('#psr-kaina');
				var fokusas = senas && document.activeElement===senas;
				var poz = fokusas ? senas.selectionStart : null;
				$('#psr-kainodara').innerHTML=h;
				if(fokusas){
					var nn=$('#psr-kaina');
					if(nn){ nn.focus(); try{ nn.setSelectionRange(poz,poz); }catch(e){} }
				}

				var kv=$('#psr-kaina');
				kv.oninput=function(){ pieštiKainodara(); pieštiPerziura(); tikrinti(); };
				kv.onblur=function(){
					var n=skaicius(this.value);
					if(n>0){ this.value=kainaTekstu(n); pieštiKainodara(); pieštiPerziura(); tikrinti(); }
				};
				/* Enter neturi siusti formos — tik uzbaigti ivedima. */
				kv.onkeydown=function(e){ if(e.key==='Enter'){ e.preventDefault(); this.blur(); } };
				$('#psr-tikslas').onchange=function(){ pieštiKainodara(); };
				var nd=$('#psr-naudoti');
				if(nd) nd.onclick=function(e){ e.preventDefault(); $('#psr-kaina').value=kainaTekstu(s.rek); pieštiKainodara(); pieštiPerziura(); tikrinti(); };
				var lb=$('#psr-lubos');
				if(lb) lb.onclick=function(e){ e.preventDefault(); $('#psr-tikslas').value=Math.floor(s.maxM); $('#psr-kaina').value=kainaTekstu(s.suma*0.95); pieštiKainodara(); pieštiPerziura(); tikrinti(); };
			}

			/* ---------- perziura (kaip matys klientas) ---------- */
			function pieštiPerziura(){
				var s=skaiciuoti();
				var pav=$('#psr-pav').value||'(rinkinio pavadinimas)';
				if(tipas()==='dp'){ $('#psr-perziura').innerHTML=perziuraDP(s,pav); return; }
				var foto=K.filter(function(c){return c.foto;}).map(function(c){return c.foto;});
				var uniq=[]; foto.forEach(function(f){ if(uniq.indexOf(f)<0) uniq.push(f); });
				var stulp = uniq.length<=1?1:(uniq.length<=2?2:(uniq.length<=6?3:4));
				var h='<div class="psr-perz">';
				if(uniq.length){
					h+='<div class="psr-komp" style="grid-template-columns:repeat('+stulp+',1fr)">';
					uniq.slice(0,12).forEach(function(src){ h+='<div class="psr-kt"><img src="'+src+'"></div>'; });
					h+='</div>';
				} else {
					h+='<div class="psr-komp-tuscia">Pridėk prekių — nuotrauka susidėlios pati</div>';
				}
				h+='<div class="psr-perz-pav">'+esc(pav)+'</div>';
				h+='<div class="psr-perz-kaina">'+(s.kaina>0?eur(s.kaina):'—')
					+(s.suma>s.kaina&&s.kaina>0?' <s>'+eur(s.suma)+'</s>':'')+'</div>';
				if(s.kaina>0&&s.suma>s.kaina) h+='<div class="psr-perz-taupo">Sutaupote '+eur(s.suma-s.kaina)+'</div>';
				if(K.length){
					h+='<div class="psr-perz-sud"><b>Rinkinyje rasite ('+s.vnt+' vnt.):</b><ol>';
					K.forEach(function(c){ h+='<li>'+(c.kiekis>1?c.kiekis+' × ':'')+esc(c.pav)+'</li>'; });
					h+='</ol></div>';
				}
				h+='</div><p class="description">Nuotrauka sugeneruojama automatiškai iš komponentų (GD tinklelis) ir tampa pagrindine.</p>';
				$('#psr-perziura').innerHTML=h;
			}

			function perziuraDP(s,pav){
				var c=K[0], vnt=(s.kaina>0?s.kaina/c.kiekis:0);
				var h='<div class="psr-perz psr-perz-dp">';
				h+='<div class="psr-dp-foto">'+(c.foto?'<img src="'+c.foto+'">':'<div class="psr-komp-tuscia">nėra nuotraukos</div>')
					+'<span class="psr-dp-zenklas">×'+c.kiekis+'<br>VNT.</span></div>';
				h+='<div class="psr-dp-juosta">EKONOMIŠKA PAKUOTĖ · '+c.kiekis+' × '+esc(c.svoris||'1 vnt.')+'</div>';
				h+='<div class="psr-perz-pav">'+esc(pav)+'</div>';
				h+='<div class="psr-perz-kaina">'+eur(s.kaina)+'</div>';
				h+='<table class="psr-kn" style="margin-top:8px">'
					+'<tr><td>Pakuotėje</td><td class="r"><b>'+c.kiekis+' vnt.</b></td></tr>'
					+'<tr><td>Vieneto kaina</td><td class="r"><b>'+eur(vnt)+'</b></td></tr>'
					+'<tr><td>Įprastai po vieną</td><td class="r psr-mut">'+eur(c.kaina)+'/vnt.</td></tr>'
					+(s.suma>s.kaina&&s.kaina>0?'<tr><td>Sutaupote</td><td class="r"><b class="psr-ok">'+eur(s.suma-s.kaina)+' ('+Math.round((s.suma-s.kaina)/s.suma*100)+'%)</b></td></tr>':'')
					+'</table></div>'
					+'<p class="description">Šią išvaizdą sukuria jau veikiantys vitrinos moduliai (#568, #570, #573) — pakanka teisingo tipo.</p>';
				return h;
			}
			function atnaujinti(){ pieštiSudeti(); pieštiTipa(); pieštiKainodara(); pieštiVieta(); pieštiPerziura(); tikrinti(); }

			/* ---------- validacija ---------- */
			function tikrinti(){
				var s=skaiciuoti();
				var truk=[];
				if(!$('#psr-pav').value.trim()) truk.push('pavadinimo');
				if(!$('#psr-sku').value.trim() && tipas()!=='dp') truk.push('SKU');
				if(!(s.kaina>0)) truk.push('kainos');
				if(!K.length) truk.push('prekių');
				var ok = truk.length===0;
				$('#psr-issaugoti').disabled = !ok;
				$('#psr-stat').innerHTML = ok
					? '<span class="psr-ok">✓ '+s.vnt+' vnt. · '+eur(s.kaina)+(s.marza!==null?' · marža '+eur(s.marza)+' ('+Math.round(s.proc)+'%)':'')+'</span>'
					: '<span class="psr-mut">Trūksta: '+truk.join(', ')+'</span>';
			}

			/* ---------- paieska ---------- */
			function ieskoti(){
				if(!f.browse && f.q.trim().length<2){
					$('#psr-rez').innerHTML='<div class="psr-tuscia">Įrašyk bent 2 simbolius arba spausk „Rodyti visus tinkamus".</div>';
					return;
				}
				var mano=++uzklausa;
				$('#psr-rez').innerHTML='<div class="psr-tuscia">Ieškoma…</div>';
				var u=new URLSearchParams({action:'ps_rink_paieska',nonce:N,q:f.q,kat:f.kat,svoris:f.svoris,
					sand:f.sand,savik:f.savik,browse:f.browse?'1':'0'});
				fetch(ajaxurl+'?'+u.toString()).then(function(r){return r.json()}).then(function(j){
					if(mano!==uzklausa) return;
					if(!j.success){ $('#psr-rez').innerHTML='<div class="psr-tuscia">Klaida: '+(j.data||'')+'</div>'; return; }
					pieštiRez(j.data.prekes, j.data.viso);
				});
			}
			function pieštiRez(sar, viso){
				var esami={}; K.forEach(function(c){esami[c.id]=1;});
				sar=sar.filter(function(p){return !esami[p.id];});
				if(!sar.length){ $('#psr-rez').innerHTML='<div class="psr-tuscia">Nerasta. Atlaisvink filtrus.</div>'; return; }
				var h='<div class="psr-rez-juosta"><label><input type="checkbox" id="psr-visi"> Pažymėti visus</label>'
					+'<button type="button" class="button button-primary" id="psr-prideti-pazymetus">➕ Pridėti pažymėtus</button>'
					+'<span class="psr-mut">'+viso+' rezultatai'+(viso>sar.length?' · rodoma '+sar.length:'')+'</span></div>';
				h+='<table class="wp-list-table widefat striped psr-rez-t"><thead><tr>'
					+'<th style="width:26px"></th><th style="width:44px"></th><th>Prekė</th><th style="width:76px">Svoris</th>'
					+'<th style="width:84px" class="r">Savikaina</th><th style="width:84px" class="r">Pard. kaina</th>'
					+'<th style="width:96px" class="r">Marža</th><th style="width:62px" class="r">Likutis</th>'
					+'<th style="width:80px"></th></tr></thead><tbody>';
				sar.forEach(function(p){
					var m=(p.savikaina!==null&&p.kaina>0)?(p.kaina-p.savikaina):null;
					var mp=(m!==null&&p.kaina>0)?Math.round(m/p.kaina*100):null;
					h+='<tr><td><input type="checkbox" class="psr-chk" value="'+p.id+'"></td>'
						+'<td>'+(p.foto?'<img src="'+p.foto+'" class="psr-t32">':'')+'</td>'
						+'<td>'+esc(p.pav)+'<div class="psr-mut">'+esc(p.sku||'be SKU')+' · '+p.sandelis.toUpperCase()+'</div></td>'
						+'<td class="psr-mut">'+esc(p.svoris||'—')+'</td>'
						+'<td class="r">'+(p.savikaina===null?'<span class="psr-warn">nėra</span>':eur(p.savikaina))+'</td>'
						+'<td class="r">'+eur(p.kaina)+'</td>'
						+'<td class="r">'+(m!==null?'<span class="'+(m<0?'psr-bad':'psr-ok')+'">'+eur(m)+' ('+mp+'%)</span>':'<span class="psr-mut">—</span>')+'</td>'
						+'<td class="r '+(p.yra?'':'psr-bad')+'">'+(p.likutis===null?'∞':p.likutis)+'</td>'
						+'<td><button type="button" class="button psr-prideti" data-p=\''+JSON.stringify(p).replace(/'/g,'&#39;')+'\'>+ Pridėti</button></td></tr>';
				});
				h+='</tbody></table>';
				$('#psr-rez').innerHTML=h;
				$('#psr-visi').onchange=function(){ var c=this.checked; $('#psr-rez').querySelectorAll('.psr-chk').forEach(function(x){x.checked=c;}); };
				$('#psr-rez').querySelectorAll('.psr-prideti').forEach(function(b){
					b.onclick=function(){ prideti(JSON.parse(this.dataset.p)); };
				});
				$('#psr-prideti-pazymetus').onclick=function(){
					var pridėta=0;
					$('#psr-rez').querySelectorAll('.psr-chk:checked').forEach(function(c){
						var b=c.closest('tr').querySelector('.psr-prideti');
						if(b){ prideti(JSON.parse(b.dataset.p), true); pridėta++; }
					});
					if(pridėta) atnaujinti();
				};
			}
			function prideti(p, tyliai){
				if(K.some(function(c){return c.id===p.id;})) return;
				p.kiekis=1; K.push(p);
				if(!tyliai) atnaujinti();
			}

			/* ---------- filtru ivykiai ---------- */
			$('#psr-f-kat').onchange=function(){ f.kat=this.value; f.browse=true; ieskoti(); };
			$('#psr-f-svoris').onchange=function(){ f.svoris=this.value; f.browse=true; ieskoti(); };
			$('#psr-f-savik').onchange=function(){ f.savik=this.value; f.browse=true; ieskoti(); };
			document.querySelectorAll('.psr-wh').forEach(function(x){
				x.classList.toggle('button-primary',(x.dataset.wh||'')===f.sand);
			});
			document.querySelectorAll('.psr-wh').forEach(function(b){
				b.onclick=function(){
					f.sand=this.dataset.wh||''; f.browse=true;
					document.querySelectorAll('.psr-wh').forEach(function(x){x.classList.remove('button-primary');});
					this.classList.add('button-primary');
					ieskoti();
				};
			});
			$('#psr-q').oninput=function(){
				f.q=this.value; f.browse=false;
				clearTimeout(laikmatis); laikmatis=setTimeout(ieskoti,300);
			};
			$('#psr-browse').onclick=function(){ f.browse=true; ieskoti(); };
			$('#psr-isvalyti').onclick=function(e){
				e.preventDefault();
				f={kat:'',svoris:'',sand:PRAD_SAND,savik:'',q:'',browse:false};
				$('#psr-f-kat').value=''; $('#psr-f-svoris').value=''; $('#psr-f-savik').value=''; $('#psr-q').value='';
				document.querySelectorAll('.psr-wh').forEach(function(x){ x.classList.toggle('button-primary',(x.dataset.wh||'')===f.sand); });
				ieskoti();
			};
			$('#psr-kat-rank').onchange=function(){
				var v=parseInt(this.value); this.value='';
				if(!v) return;
				var oi=KAT_OFF.indexOf(v);
				if(oi>=0){ KAT_OFF.splice(oi,1); pieštiVieta(); return; }   /* v1.36: grazinam automatine */
				if(KAT_RANK.indexOf(v)<0){ KAT_RANK.push(v); pieštiVieta(); }
			};
			$('#psr-pav').oninput=function(){ tikrinti(); pieštiPerziura(); };
			$('#psr-sku').oninput=function(){ tikrinti(); };

			/* ---------- issaugojimas ---------- */
			$('#psr-issaugoti').onclick=function(){
				var s=skaiciuoti();
				var btn=this; btn.disabled=true;
				$('#psr-stat').innerHTML='<span class="psr-mut">Saugoma…</span>';
				var fd=new FormData();
				fd.append('action','ps_rink_issaugoti');
				fd.append('nonce',N);
				fd.append('id',ID);
				fd.append('duomenys',JSON.stringify({
					pav:$('#psr-pav').value.trim(),
					sku:$('#psr-sku').value.trim(),
					kaina:s.kaina,
					aprasymas:$('#psr-apr').value,
					publikuoti:$('#psr-publikuoti').checked?1:0,
					tipas:tipas(),
					pergeneruoti:(document.getElementById('psr-regen')&&document.getElementById('psr-regen').checked)?1:0,
					kat:KAT_RANK,
					kat_off:KAT_OFF,
					komponentai:K.map(function(c){return {id:c.id,kiekis:c.kiekis};})
				}));
				fetch(ajaxurl,{method:'POST',body:fd}).then(function(r){return r.json()}).then(function(j){
					btn.disabled=false;
					if(!j.success){ $('#psr-stat').innerHTML='<span class="psr-bad">Klaida: '+(j.data||'nežinoma')+'</span>'; return; }
					$('#psr-stat').innerHTML='<span class="psr-ok">✓ Išsaugota</span>';
					location.href='<?php echo esc_js( $grizti ); ?>&irasyta='+j.data.id;
				}).catch(function(e){
					btn.disabled=false;
					$('#psr-stat').innerHTML='<span class="psr-bad">Ryšio klaida</span>';
				});
			};
			var tr=$('#psr-trinti-f');
			if(tr) tr.onclick=function(){
				var visam=confirm('Ištrinti rinkinį „'+this.dataset.pav+'"?\n\nGerai = ištrinam VISAM LAIKUI (prekės kortelė dingsta).\nAtšaukti = tik į šiukšlinę (galima grąžinti).')?'1':'0';
				if(visam==='0' && !confirm('Perkelti „'+this.dataset.pav+'" į šiukšlinę?')) return;
				var fd=new FormData(); fd.append('action','ps_rink_trinti'); fd.append('nonce',N); fd.append('id',this.dataset.id); fd.append('visam',visam);
				fetch(ajaxurl,{method:'POST',body:fd}).then(function(r){return r.json()}).then(function(j){
					if(j.success) location.href='<?php echo esc_js( $grizti ); ?>';
					else alert('Klaida: '+(j.data||''));
				});
			};

			/* ---------- sargas: neirasyti pakeitimai ---------- */
			var pradzia=JSON.stringify(K);
			window.addEventListener('beforeunload',function(e){
				if(JSON.stringify(K)!==pradzia && !$('#psr-issaugoti').disabled){
					e.preventDefault(); e.returnValue='';
				}
			});

			atnaujinti();
			<?php if ( $kopija ) : ?>
			$('#psr-stat').innerHTML='<span class="psr-mut">Kopija — pakeisk pavadinimą ir SKU</span>';
			<?php endif; ?>
		})();
		</script>
		<?php
	}


	/* ==================== AJAX ==================== */

	/** Vienoda prekes eilute — ir paieskoje, ir sudetyje. */
	private static function prekes_eilute( $p, $kiekis = 1 ) {
		$pid = $p->get_id();
		$lik = $p->get_stock_quantity();
		return array(
			'id'        => $pid,
			'pav'       => $p->get_name(),
			'sku'       => (string) $p->get_sku(),
			'kaina'     => (float) $p->get_price(),
			'savikaina' => self::savikaina( $pid ),
			'likutis'   => ( $lik === null || $lik === '' ) ? null : (int) $lik,
			'yra'       => ( $p->get_stock_status() === 'instock' && $p->get_status() === 'publish' ),
			'sandelis'  => self::sandelis( $pid ),
			'svoris'    => self::svoris_tekstas( $pid ),
			'svoris_kg' => (float) $p->get_weight(),
			'foto'      => wp_get_attachment_image_url( $p->get_image_id(), 'thumbnail' ) ?: '',
			'kat'       => array_map( 'intval', wc_get_product_term_ids( $pid, 'product_cat' ) ),
			'kiekis'    => (int) $kiekis,
		);
	}

	/** Pakuotes dydis rodymui (atributas), ne fizinis svoris. */
	private static function svoris_tekstas( $pid ) {
		$t = wc_get_product_terms( $pid, 'pa_pakuotes_dydis', array( 'fields' => 'names' ) );
		return ( is_wp_error( $t ) || empty( $t ) ) ? '' : $t[0];
	}

	public static function ajax_paieska() {
		check_ajax_referer( 'ps_rink', 'nonce' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'Neturite teisių.' ); }

		$q      = sanitize_text_field( $_GET['q'] ?? '' );
		$kat    = (int) ( $_GET['kat'] ?? 0 );
		$svoris = sanitize_text_field( $_GET['svoris'] ?? '' );
		$sand   = sanitize_key( $_GET['sand'] ?? '' );
		$savik  = sanitize_key( $_GET['savik'] ?? '' );
		$browse = ( ( $_GET['browse'] ?? '' ) === '1' );

		if ( ! $browse && mb_strlen( $q ) < 2 ) { wp_send_json_success( array( 'prekes' => array(), 'viso' => 0 ) ); }

		$tax = array( array( 'taxonomy' => 'product_type', 'field' => 'slug', 'terms' => array( 'simple' ) ) );
		if ( $kat ) {
			$medis = self::medis();
			$ids   = isset( $medis['palik'][ $kat ] ) ? $medis['palik'][ $kat ] : array( $kat );
			$tax[] = array( 'taxonomy' => 'product_cat', 'field' => 'term_id', 'terms' => $ids );
		}
		if ( $svoris !== '' ) {
			$tax[] = array( 'taxonomy' => 'pa_pakuotes_dydis', 'field' => 'name', 'terms' => $svoris );
		}
		if ( count( $tax ) > 1 ) { $tax['relation'] = 'AND'; }

		/* Sandelio filtras — tas pats principas kaip 539/550: AV = nei VF, nei ZB. */
		$meta = array();
		if ( $sand === 'vf' ) { $meta[] = array( 'key' => '_vf_enabled', 'value' => 'yes' ); }
		elseif ( $sand === 'zb' ) { $meta[] = array( 'key' => '_zb_enabled', 'value' => 'yes' ); }
		elseif ( $sand === 'av' ) {
			$meta['relation'] = 'AND';
			$meta[] = array( 'relation' => 'OR',
				array( 'key' => '_vf_enabled', 'compare' => 'NOT EXISTS' ),
				array( 'key' => '_vf_enabled', 'value' => 'yes', 'compare' => '!=' ) );
			$meta[] = array( 'relation' => 'OR',
				array( 'key' => '_zb_enabled', 'compare' => 'NOT EXISTS' ),
				array( 'key' => '_zb_enabled', 'value' => 'yes', 'compare' => '!=' ) );
		}

		$args = array(
			'post_type'      => 'product',
			'post_status'    => 'publish',
			'posts_per_page' => 400,
			'orderby'        => 'title',
			'order'          => 'ASC',
			'tax_query'      => $tax,
			'no_found_rows'  => false,
		);
		if ( mb_strlen( $q ) >= 2 ) { $args['s'] = $q; }
		if ( $meta ) { $args['meta_query'] = $meta; }

		$uzk = new WP_Query( $args );
		$prekes = array();

		/* SKU tiksli atitiktis — pirma eilute (kaip 539) */
		if ( mb_strlen( $q ) >= 2 ) {
			$sku_id = wc_get_product_id_by_sku( $q );
			if ( $sku_id ) {
				$sp = wc_get_product( $sku_id );
				if ( $sp && $sp->is_type( 'simple' ) && $sp->get_status() === 'publish' ) {
					$prekes[] = self::prekes_eilute( $sp );
				}
			}
		}
		$matyti = wp_list_pluck( $prekes, 'id' );
		foreach ( $uzk->posts as $post ) {
			if ( count( $prekes ) >= 150 ) { break; }
			if ( in_array( (int) $post->ID, $matyti, true ) ) { continue; }
			$pr = wc_get_product( $post->ID );
			if ( ! $pr ) { continue; }

			if ( $savik !== '' ) {
				$c = self::savikaina( $post->ID );
				if ( $savik === 'x' && $c !== null ) { continue; }
				if ( $savik !== 'x' ) {
					if ( $c === null ) { continue; }
					if ( $savik === 'a' && ! ( $c < 2 ) ) { continue; }
					if ( $savik === 'b' && ! ( $c >= 2 && $c < 5 ) ) { continue; }
					if ( $savik === 'c' && ! ( $c >= 5 && $c < 15 ) ) { continue; }
					if ( $savik === 'd' && ! ( $c >= 15 ) ) { continue; }
				}
			}
			$prekes[] = self::prekes_eilute( $pr );
		}
		wp_reset_postdata();

		wp_send_json_success( array( 'prekes' => $prekes, 'viso' => ( $savik !== '' ? count( $prekes ) : (int) $uzk->found_posts ) ) );
	}

	/* ==================== ISSAUGOJIMAS ==================== */

	public static function ajax_issaugoti() {
		check_ajax_referer( 'ps_rink', 'nonce' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'Neturite teisių.' ); }

		$id = (int) ( $_POST['id'] ?? 0 );
		$d  = json_decode( wp_unslash( $_POST['duomenys'] ?? '' ), true );
		if ( ! is_array( $d ) ) { wp_send_json_error( 'Neteisingi duomenys.' ); }

		$pav   = sanitize_text_field( $d['pav'] ?? '' );
		$sku   = sanitize_text_field( $d['sku'] ?? '' );
		$kaina = (float) str_replace( ',', '.', (string) ( $d['kaina'] ?? 0 ) );
		$apr   = sanitize_textarea_field( $d['aprasymas'] ?? '' );
		$publ  = ! empty( $d['publikuoti'] );
		$kat   = array_map( 'intval', (array) ( $d['kat'] ?? array() ) );
		$kat_off = array_map( 'intval', (array) ( $d['kat_off'] ?? array() ) );
		$komp  = (array) ( $d['komponentai'] ?? array() );
		/* v1.25: neprivalomas rankinis svoris (kurjeriui). null = formoje lauko nebuvo. */
		$svoris_iv = array_key_exists( 'svoris', $d ) ? trim( (string) $d['svoris'] ) : null;

		$klaidos = array();
		$dp_tipas = ( ( $d['tipas'] ?? '' ) === 'dp' );
		if ( $pav === '' ) { $klaidos[] = 'Trūksta pavadinimo.'; }
		if ( $sku === '' && ! $dp_tipas ) { $klaidos[] = 'Trūksta SKU.'; }
		if ( $kaina <= 0 ) { $klaidos[] = 'Kaina turi būti teigiama.'; }
		if ( ! $komp )     { $klaidos[] = 'Pridėkite bent vieną prekę.'; }

		$sku_id = wc_get_product_id_by_sku( $sku );
		if ( $sku_id && $sku_id !== $id ) { $klaidos[] = 'SKU „' . $sku . '" jau naudojamas (prekė #' . $sku_id . ').'; }
		if ( $klaidos ) { wp_send_json_error( implode( ' ', $klaidos ) ); }

		$kiekiai = array(); $viso = 0; $pavadinimai = array();
		foreach ( $komp as $c ) {
			$cid = (int) ( $c['id'] ?? 0 );
			$k   = max( 1, (int) ( $c['kiekis'] ?? 1 ) );
			if ( $cid <= 0 ) { continue; }
			$cp = wc_get_product( $cid );
			if ( ! $cp ) { wp_send_json_error( 'Prekė #' . $cid . ' nerasta.' ); }
			$kiekiai[ $cid ] = $k;
			$viso += $k;
			$pavadinimai[] = ( $k > 1 ? $k . ' × ' : '' ) . $cp->get_name();
		}
		if ( $viso < 1 ) { wp_send_json_error( 'Kiekių suma turi būti bent 1.' ); }

		/*
		 * Aprasymas. Anksciau buvo tik sarasas pavadinimu — klientas nezinojo,
		 * ka perka. Dabar prie kiekvienos prekes pridedam jos pacios aprasyma
		 * (trumpa, o jei jo nera — pirma pilno aprasymo pastraipa).
		 */
		$turinys = '<h3>Rinkinyje rasite (' . $viso . ' vnt.):</h3>' . "\n";
		$turinys .= '<div class="ps-rink-sudetis">' . "\n";
		foreach ( $kiekiai as $cid => $kiek ) {
			$cp = wc_get_product( $cid );
			if ( ! $cp ) { continue; }
			$aprasas = self::svarus_aprasas( $cp );
			$pilnas  = self::pilnas_aprasas( $cp, $aprasas );
			$img = $cp->get_image_id() ? wp_get_attachment_image( $cp->get_image_id(), 'thumbnail', false, array( 'class' => 'ps-rink-foto' ) ) : '';
			$turinys .= '<div class="ps-rink-preke">' . "\n";
			if ( $img ) { $turinys .= '  <div class="ps-rink-img">' . $img . "</div>\n"; }
			$turinys .= '  <div class="ps-rink-tekstas">' . "\n";
			$turinys .= '    <h4>' . ( $kiek > 1 ? $kiek . ' × ' : '' ) . esc_html( $cp->get_name() ) . "</h4>\n";
			if ( $aprasas !== '' ) { $turinys .= '    <p>' . esc_html( $aprasas ) . "</p>\n"; }
			if ( $pilnas !== '' ) {
				$turinys .= '    <details class="ps-rink-daugiau">' . "\n";
				$turinys .= '      <summary>Plačiau apie šią prekę</summary>' . "\n";
				$turinys .= '      <div class="ps-rink-pilnas">' . $pilnas . "</div>\n";
				$turinys .= "    </details>\n";
			}
			$turinys .= "  </div>\n</div>\n";
		}
		$turinys .= "</div>\n";

		/* TA PATI PREKE x N -> „Daugiau=pigiau" pakas, ne MnM. Priezastis — vitrina:
		   pakas turi savo isvaizda (zenklas xN, ekonomiska pakuote, vieneto kaina),
		   o MnM klientui parodytu pasirinkimo forma, kurios cia nereikia. */
		$tipas = ( ( $d['tipas'] ?? '' ) === 'dp' || ( count( $kiekiai ) === 1 && $viso >= 2 ) ) ? 'dp' : 'mnm';
		if ( $tipas === 'dp' ) {
			return self::issaugoti_dp( $id, $pav, $sku, $kaina, $apr, $publ, $kat, $kiekiai, $svoris_iv, $kat_off );
		}

		try {
			$naujas = ! $id;
			$prod = $naujas ? new WC_Product_Mix_and_Match() : wc_get_product( $id );
			if ( ! $prod || ! is_a( $prod, 'WC_Product_Mix_and_Match' ) ) {
				wp_send_json_error( 'Rinkinys #' . $id . ' nerastas arba ne Mix&Match tipo.' );
			}
			$sena_busena = $naujas ? '' : $prod->get_status();

			$prod->set_name( $pav );
			$prod->set_sku( $sku );
			$prod->set_status( $publ ? 'publish' : 'draft' );
			$prod->set_catalog_visibility( 'visible' );
			$prod->set_price( $kaina );
			$prod->set_regular_price( $kaina );
			$prod->set_short_description( $apr );
			$prod->set_description( $turinys );
			$prod->set_sold_individually( false );
			$prod->set_min_container_size( $viso );
			$prod->set_max_container_size( $viso );
			$prod->update_meta_data( '_mnm_content_source', 'products' );
			$prod->update_meta_data( '_mnm_per_product_pricing', 'no' );
			$prod->update_meta_data( self::META_KIEKIAI, wp_json_encode( $kiekiai ) );

			/* Svoris: suma is komponentu; ranka irasytas nustelbia (v1.25). */
			$sv = self::svoris( $kiekiai );
			$kg = self::svorio_sprendimas( $prod, $sv['kg'], $svoris_iv );
			if ( $kg > 0 ) {
				$prod->set_weight( $kg );
				$klase = self::siuntimo_klase( $kg );
				if ( $klase ) { $prod->set_shipping_class_id( self::klases_id( $klase ) ); }
			}

			/* v1.25: savikaina i _cost_price — kad katalogo kortele ir marzos
			   ataskaitos matytu rinkini kaip normalia preke. Jei bent vienos
			   komponento savikainos nera — NErasom nieko (geriau tuscia nei
			   melas) ir istrinam sena, kad neliktu pasenusio skaiciaus. */
			$sav_suma = 0.0; $sav_truksta = 0;
			foreach ( $kiekiai as $sav_cid => $sav_kiek ) {
				$sav_c = self::savikaina( (int) $sav_cid );
				if ( $sav_c === null ) { $sav_truksta++; } else { $sav_suma += $sav_c * (int) $sav_kiek; }
			}
			if ( $sav_truksta === 0 && $sav_suma > 0 ) { $prod->update_meta_data( '_cost_price', round( $sav_suma, 4 ) ); }
			else { $prod->delete_meta_data( '_cost_price' ); }
			$prod->update_meta_data( '_mnm_weight_cumulative', 'no' );   /* svoris jau irasytas i preke */
			$prod->set_category_ids( self::kategorijos( array_keys( $kiekiai ), $kat, $kat_off ) );
			if ( $kat_off ) { $prod->update_meta_data( self::META_KAT_OFF, wp_json_encode( array_values( $kat_off ) ) ); }
			else { $prod->delete_meta_data( self::META_KAT_OFF ); }
			self::paveldeti_kurjeri( $prod, array_keys( $kiekiai ) );   /* v1.44 (S1601) */
			$prod->save();
			update_post_meta( $prod->get_id(), '_price', wc_format_decimal( $kaina ) ); // H266: MNM _price neįrašo juodraščiui
			$pid = $prod->get_id();
			if ( ! $pid ) { wp_send_json_error( 'Nepavyko išsaugoti prekės.' ); }

			/* komponentu rysiai perrasomi is naujo — jokiu likuciu nuo senos sudeties */
			global $wpdb; $p = $wpdb->prefix;
			$wpdb->delete( $p . 'wc_mnm_child_items', array( 'container_id' => $pid ), array( '%d' ) );
			$eile = 0;
			foreach ( array_keys( $kiekiai ) as $cid ) {
				$eile++;
				$wpdb->insert( $p . 'wc_mnm_child_items',
					array( 'product_id' => $cid, 'container_id' => $pid, 'menu_order' => $eile ),
					array( '%d', '%d', '%d' ) );
			}
			if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }

			/* kompozicija: naujam visada, esamam — jei pasikeite sudetis */
			$priverstinai = $naujas || ! empty( $d['pergeneruoti'] );
			$komp_rez = self::kompozicija( $pid, array_keys( $kiekiai ), $priverstinai );

			/* zurnalas */
			if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
				Petshop_Ivykiai::irasyti( $pid, $naujas ? 'rinkinys_sukurtas' : 'rinkinys_pakeistas', array(
					'saltinis' => 'Rinkinių langas',
					'reiksme'  => $viso . ' vnt. · ' . number_format( $kaina, 2, '.', '' ) . ' €',
				) );
			}

			wp_send_json_success( array(
				'id'      => $pid,
				'busena'  => $publ ? 'publish' : 'draft',
				'nuoroda' => $publ ? get_permalink( $pid ) : get_preview_post_link( $pid ),
				'kompozicija' => $komp_rez,
			) );

		} catch ( Exception $e ) {
			wp_send_json_error( 'Klaida: ' . $e->getMessage() );
		}
	}

	/**
	 * „Daugiau=pigiau" pakas: `simple` preke be savo likucio. Likutis skaiciuojamas
	 * ir nurasomas is bazines prekes (snippet 567), todel `manage_stock=no`.
	 * Nuotrauka — bazines prekes; kompozicija cia netinka (ta pati preke kartojasi).
	 */
	private static function issaugoti_dp( $id, $pav, $sku, $kaina, $apr, $publ, $kat, $kiekiai, $svoris_iv = null, $kat_off = array() ) {
		$bid  = (int) array_key_first( $kiekiai );
		$qty  = (int) reset( $kiekiai );
		$baze = wc_get_product( $bid );
		if ( ! $baze ) { wp_send_json_error( 'Bazinė prekė #' . $bid . ' nerasta.' ); }
		if ( $qty < 2 ) { wp_send_json_error( 'Pakui reikia bent 2 vnt.' ); }

		/* SKU: jei neirasytas, generuojam pagal esama tvarka — DP-{bazes SKU}-{N} */
		if ( $sku === '' || $sku === null ) {
			$bsku = (string) $baze->get_sku();
			$sku  = 'DP-' . ( $bsku !== '' ? $bsku : $bid ) . '-' . $qty;
			$n = 2;
			while ( wc_get_product_id_by_sku( $sku ) && wc_get_product_id_by_sku( $sku ) !== (int) $id ) {
				$sku = 'DP-' . ( $bsku !== '' ? $bsku : $bid ) . '-' . $qty . '-' . $n;
				$n++;
				if ( $n > 20 ) { break; }
			}
		}

		$naujas = ! $id;
		if ( ! $naujas ) {
			$esamas = get_post( $id );
			if ( $esamas && ! get_post_meta( $id, '_dp_base_product_id', true ) ) {
				/* buvo MnM, tampa paku — senus komponentu rysius pasaliname */
				global $wpdb;
				$wpdb->delete( $wpdb->prefix . 'wc_mnm_child_items', array( 'container_id' => $id ), array( '%d' ) );
				wp_set_object_terms( $id, 'simple', 'product_type' );
			}
		}

		try {
			$prod = $naujas ? new WC_Product_Simple() : wc_get_product( $id );
			if ( ! $prod ) { wp_send_json_error( 'Prekė #' . $id . ' nerasta.' ); }
			if ( ! $naujas && ! $prod->is_type( 'simple' ) ) {
				wp_set_object_terms( $id, 'simple', 'product_type' );
				$prod = new WC_Product_Simple( $id );
			}

			$prod->set_name( $pav );
			$prod->set_sku( $sku );
			$prod->set_status( $publ ? 'publish' : 'draft' );
			$prod->set_catalog_visibility( 'visible' );
			$prod->set_price( $kaina );
			$prod->set_regular_price( $kaina );
			$prod->set_short_description( $apr );
			$prod->set_description( $baze->get_description() );
			$prod->set_manage_stock( false );          /* likutis — is bazines prekes */
			$prod->set_stock_status( 'instock' );      /* tikra busena skaiciuoja snippet 567 */
			$prod->update_meta_data( '_dp_base_product_id', $bid );
			$prod->update_meta_data( '_dp_pack_qty', $qty );

			/* v1.25: savikaina = bazes savikaina x N; jei bazes nera — trinam sena. */
			$bsav = self::savikaina( $bid );
			if ( $bsav !== null && $bsav > 0 ) { $prod->update_meta_data( '_cost_price', round( $bsav * $qty, 4 ) ); }
			else { $prod->delete_meta_data( '_cost_price' ); }

			/* Svoris: bazes x N; ranka irasytas nustelbia (v1.25). */
			$auto_kg = round( (float) $baze->get_weight() * $qty, 3 );
			$kg = self::svorio_sprendimas( $prod, $auto_kg, $svoris_iv );
			if ( $kg > 0 ) {
				$prod->set_weight( $kg );
				$klase = self::siuntimo_klase( $kg );
				if ( $klase ) { $prod->set_shipping_class_id( self::klases_id( $klase ) ); }
			}

			/* kategorijos: bazines prekes + DAUGIAU=PIGIAU (91) */
			$kategorijos = wc_get_product_term_ids( $bid, 'product_cat' );
			$kategorijos[] = 91;
			if ( $kat ) { $kategorijos = array_merge( $kategorijos, $kat ); }
			$kategorijos = array_diff( array_map( 'intval', (array) $kategorijos ), array_map( 'intval', (array) $kat_off ) );
			$prod->set_category_ids( array_values( array_unique( $kategorijos ) ) );
			if ( $kat_off ) { $prod->update_meta_data( self::META_KAT_OFF, wp_json_encode( array_values( array_map( 'intval', $kat_off ) ) ) ); }
			else { $prod->delete_meta_data( self::META_KAT_OFF ); }

			/*
			 * ATRIBUTAI. Be ju pakas iskrenta is parduotuves filtru — klientas,
			 * filtruodamas „be grudu" ar „12 kg", pako nemato. Todel perkeliam
			 * VISUS bazines prekes atributus.
			 *
			 * Isimtis — pakuotes dydis: pakas nera 12 kg, jis yra 2 x 12 kg.
			 * Jei kataloge jau yra multipack terminas („12 kg x 2", „2 x 12 kg"),
			 * naudojam ji; jei ne — paliekam bazines reiksme, kad filtras bent
			 * veiktu. Naujo termino cia NEKURIAM: terminu sarasas — katalogo
			 * struktura, ja tvarko savininkas, ne rinkiniu langas.
			 */
			$atributai = array();
			foreach ( (array) $baze->get_attributes() as $raktas => $atr ) {
				$naujas_atr = clone $atr;
				if ( $raktas === 'pa_pakuotes_dydis' && $atr->is_taxonomy() ) {
					$bazes_dydis = wc_get_product_terms( $bid, 'pa_pakuotes_dydis', array( 'fields' => 'names' ) );
					$multi = null;
					if ( ! empty( $bazes_dydis[0] ) ) {
						$d = trim( $bazes_dydis[0] );
						$variantai = array(
							$d . ' × ' . $qty, $d . ' x ' . $qty, $d . '×' . $qty,
							$qty . ' × ' . $d, $qty . ' x ' . $d, $qty . '×' . $d,
						);
						foreach ( $variantai as $v ) {
							$t = get_term_by( 'name', $v, 'pa_pakuotes_dydis' );
							if ( $t && ! is_wp_error( $t ) ) { $multi = (int) $t->term_id; break; }
						}
					}
					if ( $multi ) { $naujas_atr->set_options( array( $multi ) ); }
				}
				$atributai[ $raktas ] = $naujas_atr;
			}
			if ( $atributai ) { $prod->set_attributes( $atributai ); }

			/* brendas ir zymos — kad pakas gyventu kartu su bazine preke */
			$brand = wp_get_post_terms( $bid, 'product_brand', array( 'fields' => 'ids' ) );
			self::paveldeti_kurjeri( $prod, array( $bid ) );   /* v1.44 (S1601) */

			$prod->save();
			update_post_meta( $prod->get_id(), '_price', wc_format_decimal( $kaina ) ); // H266: MNM _price neįrašo juodraščiui

			/* Taksonominiai atributai neislieka be `_product_attributes` — todel
			   set_attributes() PRIES save(), o terminai priskiriami PO jo. */
			foreach ( (array) $baze->get_attributes() as $raktas => $atr ) {
				if ( ! $atr->is_taxonomy() ) { continue; }
				$ids_t = ( $raktas === 'pa_pakuotes_dydis' && isset( $atributai[ $raktas ] ) )
					? $atributai[ $raktas ]->get_options()
					: wc_get_product_terms( $bid, $raktas, array( 'fields' => 'ids' ) );
				if ( $ids_t ) { wp_set_object_terms( $prod->get_id(), array_map( 'intval', $ids_t ), $raktas ); }
			}
			if ( $brand && ! is_wp_error( $brand ) ) { wp_set_object_terms( $prod->get_id(), array_map( 'intval', $brand ), 'product_brand' ); }
			$pid = $prod->get_id();
			if ( ! $pid ) { wp_send_json_error( 'Nepavyko išsaugoti pako.' ); }

			/* nuotrauka: bazines prekes, kompozicija negeneruojama */
			$img = $baze->get_image_id();
			if ( $img ) { set_post_thumbnail( $pid, $img ); }

			if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }
			if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
				Petshop_Ivykiai::irasyti( $pid, $naujas ? 'dp_pakas_sukurtas' : 'dp_pakas_pakeistas', array(
					'saltinis' => 'Rinkinių langas',
					'reiksme'  => $qty . ' × #' . $bid . ' · ' . number_format( $kaina, 2, '.', '' ) . ' €',
				) );
			}

			wp_send_json_success( array(
				'id' => $pid, 'tipas' => 'dp', 'busena' => $publ ? 'publish' : 'draft',
				'nuoroda' => $publ ? get_permalink( $pid ) : get_preview_post_link( $pid ),
			) );
		} catch ( Exception $e ) {
			wp_send_json_error( 'Klaida: ' . $e->getMessage() );
		}
	}

	public static function ajax_trinti() {
		check_ajax_referer( 'ps_rink', 'nonce' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'Neturite teisių.' ); }
		$id = (int) ( $_POST['id'] ?? 0 );
		if ( ! $id ) { wp_send_json_error( 'Nenurodytas rinkinys.' ); }
		$prod = wc_get_product( $id );
		if ( ! $prod ) { wp_send_json_error( 'Rinkinys nerastas.' ); }

		/* uzsakymu patikra — netrinam to, kas dalyvauja neivykdytuose */
		$blogi = self::uzsakymuose( $id );
		if ( $blogi ) {
			wp_send_json_error( 'Rinkinys dalyvauja neįvykdytuose užsakymuose (' . implode( ', ', $blogi ) . '). Pirma juos užbaikite.' );
		}

		$visam = ( $_POST['visam'] ?? '' ) === '1';
		$pav   = get_the_title( $id );

		/* v1.29: i siuksline — NELIECIAM krepsio eiluciu. Anksciau jos buvo
		   istrinamos pries wp_trash_post(), todel grazintas rinkinys grizdavo
		   TUSCIAS. Sudetis dabar gyvena tol, kol gyvena pati preke. */
		if ( ! $visam ) {
			if ( ! wp_trash_post( $id ) ) { wp_send_json_error( 'Nepavyko perkelti į šiukšlinę.' ); }
			self::po_trynimo( $id, 'rinkinys_i_siuksline' );
			wp_send_json_success( array( 'id' => $id, 'zinute' => '„' . $pav . '“ perkeltas į šiukšlinę — dar galima grąžinti.' ) );
		}

		self::isvalyti_pedsakus( $id );
		if ( ! wp_delete_post( $id, true ) ) { wp_send_json_error( 'Nepavyko ištrinti.' ); }
		self::po_trynimo( $id, 'rinkinys_istrintas' );
		wp_send_json_success( array( 'id' => $id, 'zinute' => '„' . $pav . '“ ištrintas negrįžtamai.' ) );
	}

	/**
	 * Pedsakai, kuriuos palieka NEGRIZTAMAI trinamas rinkinys.
	 * Prekiu NELIECIA — jos gyvena atskirai ir apie rinkini nieko nezino.
	 */
	private static function isvalyti_pedsakus( $id ) {
		global $wpdb; $p = $wpdb->prefix;
		$wpdb->delete( $p . 'wc_mnm_child_items', array( 'container_id' => (int) $id ), array( '%d' ) );

		/* Musu pacio piesta kompozicija. Gamintoju nuotraukos NETRINAMOS:
		   imamos tik tos, kurios yra sio rinkinio vaikai IR musu vardu. */
		$att = $wpdb->get_col( $wpdb->prepare(
			"SELECT ID FROM {$wpdb->posts} WHERE post_parent=%d AND post_type='attachment'
			   AND post_title LIKE %s", (int) $id, 'rink-kompozicija-%' ) );
		foreach ( (array) $att as $a ) { wp_delete_attachment( (int) $a, true ); }
	}

	private static function po_trynimo( $id, $ivykis ) {
		if ( class_exists( 'Petshop_Ivykiai' ) && method_exists( 'Petshop_Ivykiai', 'irasyti' ) ) {
			Petshop_Ivykiai::irasyti( $id, $ivykis, array( 'saltinis' => 'Rinkinių langas' ) );
		}
		delete_transient( 'ps_rink_medis' );
	}

	/**
	 * Siuksline PACIAME lange (v1.29). Be sito rinkinys, perkeltas i siuksline,
	 * tapdavo nepasiekiamas: sarasas jo nerodo, o WooCommerce prekiu langas —
	 * ne si darbo vieta.
	 */
	public static function ajax_siuksline() {
		check_ajax_referer( 'ps_rink', 'nonce' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'Neturite teisių.' ); }
		$id = (int) ( $_POST['id'] ?? 0 );
		$veiksmas = sanitize_key( $_POST['veiksmas'] ?? '' );
		$post = get_post( $id );
		if ( ! $post || $post->post_status !== 'trash' ) { wp_send_json_error( 'Šio rinkinio šiukšlinėje nėra.' ); }
		$pav = $post->post_title;

		if ( $veiksmas === 'grazinti' ) {
			if ( ! wp_untrash_post( $id ) ) { wp_send_json_error( 'Nepavyko grąžinti.' ); }
			/* WP grazina i „draft" — klientui rinkinys neatsiranda savaime. */
			wp_update_post( array( 'ID' => $id, 'post_status' => 'draft' ) );
			delete_transient( 'ps_rink_medis' );
			wp_send_json_success( array( 'zinute' => '„' . $pav . '“ grąžintas kaip juodraštis.' ) );
		}
		if ( $veiksmas === 'trinti' ) {
			self::isvalyti_pedsakus( $id );
			if ( ! wp_delete_post( $id, true ) ) { wp_send_json_error( 'Nepavyko ištrinti.' ); }
			self::po_trynimo( $id, 'rinkinys_istrintas' );
			wp_send_json_success( array( 'zinute' => '„' . $pav . '“ ištrintas negrįžtamai.' ) );
		}
		wp_send_json_error( 'Nežinomas veiksmas.' );
	}

	/** Kas guli siuksLineje: MnM konteineriai ir DP pakai. */
	public static function siuksliadezeje() {
		global $wpdb; $p = $wpdb->prefix;
		$mnm = $wpdb->get_col(
			"SELECT po.ID FROM {$p}posts po
			   JOIN {$p}term_relationships tr ON tr.object_id = po.ID
			   JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
			   JOIN {$p}terms t ON t.term_id = tt.term_id
			  WHERE po.post_type='product' AND po.post_status='trash'
			    AND tt.taxonomy='product_type' AND t.slug='mix-and-match'" );
		$dp = $wpdb->get_col(
			"SELECT pm.post_id FROM {$p}postmeta pm
			   JOIN {$p}posts po ON po.ID = pm.post_id AND po.post_status='trash'
			  WHERE pm.meta_key='_dp_base_product_id'" );
		$out = array();
		foreach ( array_unique( array_merge( (array) $mnm, (array) $dp ) ) as $pid ) {
			$pid = (int) $pid;
			if ( get_post_meta( $pid, '_ps_laukas', true ) === 'yes' ) { continue; }  /* surenkami — kitas langas */
			$post = get_post( $pid );
			if ( ! $post ) { continue; }
			$dienos = (int) floor( ( time() - strtotime( $post->post_modified_gmt . ' UTC' ) ) / DAY_IN_SECONDS );
			$prod = wc_get_product( $pid );
			$out[] = array(
				'id' => $pid, 'pav' => $post->post_title,
				'tipas' => get_post_meta( $pid, '_dp_base_product_id', true ) ? 'dp' : 'mnm',
				'dienos' => $dienos,
				'sku' => (string) get_post_meta( $pid, '_sku', true ),
				'kaina' => (float) get_post_meta( $pid, '_price', true ),
				'kat' => wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'names' ) ),
				'foto' => ( $prod && $prod->get_image_id() ) ? wp_get_attachment_image_url( $prod->get_image_id(), 'thumbnail' ) : '',
				'keista' => mb_substr( $post->post_modified, 0, 10 ),
			);
		}
		usort( $out, function( $a, $b ) { return $b['dienos'] <=> $a['dienos']; } );
		return $out;
	}


	/** Ar rinkinys yra neivykdytuose uzsakymuose. HPOS ir senas budas. */
	private static function uzsakymuose( $pid ) {
		$out = array();
		$statusai = array( 'wc-pending', 'wc-processing', 'wc-on-hold' );
		$uzs = wc_get_orders( array( 'limit' => 20, 'status' => $statusai, 'return' => 'ids' ) );
		foreach ( (array) $uzs as $oid ) {
			$o = wc_get_order( $oid );
			if ( ! $o ) { continue; }
			foreach ( $o->get_items() as $it ) {
				if ( (int) $it->get_product_id() === (int) $pid ) { $out[] = '#' . $oid; break; }
			}
			if ( count( $out ) >= 5 ) { break; }
		}
		return $out;
	}


	/* ==================== KOMPOZICIJA ==================== */

	/**
	 * Kompozicijos nuotrauka. Jei snippet 539 funkcija gyva — naudojam ja
	 * (kad rinkiniai atrodytu vienodai, nesvarbu kur sukurti). Jei ne — savo
	 * kopija su tuo paciu tinkleliu.
	 */
	/** Isdestymo algoritmo versija — keiciant ji, senos kompozicijos persipiesia. */
	/* v3: v2 metu parasas jau buvo atnaujintas, bet paveiksla dar piese senoji
	   539 funkcija — todel v1.22 nusprende, kad kompozicija sviezia, ir praleido.
	   Keiciant versija parasas nesutampa ir viskas persipiesia is naujo. */
	const KOMPOZICIJOS_VERSIJA = 'v4-herojus-66';

	private static function kompozicija( $pid, $komponentai, $priverstinai = false ) {
		/*
		 * I parasa iskaitom ir algoritmo versija. Kitaip, pakeitus isdestyma,
		 * seni rinkiniai liktu su sena nuotrauka net ir issaugoti is naujo —
		 * juk komponentai nepasikeite, tik piesimo budas.
		 */
		$parasas = md5( self::KOMPOZICIJOS_VERSIJA . '|' . implode( ',', $komponentai ) );
		if ( ! $priverstinai && get_post_thumbnail_id( $pid ) ) {
			$sena = (string) get_post_meta( $pid, '_ps_rink_komp_hash', true );
			if ( $sena === $parasas ) { return array( 'praleista' => true ); }
		}
		update_post_meta( $pid, '_ps_rink_komp_hash', $parasas );

		/*
		 * Anksciau cia pirma buvo kviecama snippet 539 funkcija
		 * `petshop_generate_composition()`, o mano isdestymas likdavo atsargine
		 * varianta. Del to nauja kompozicija (herojus + palydovai) taip ir
		 * nepasirodydavo — 539 pieste 3x1 juosta ir grazindavo rezultata pirma.
		 *
		 * Dabar rinkiniu langas piesia pats: isdestymo taisykle (2-3 prekes —
		 * herojus, 4+ — tinklelis) yra sio lango sprendimas, todel ir piesimas
		 * turi likti cia. Snippet 539 forma nepaliesta — ji piesia savo.
		 */
		return self::kompozicija_vidine( $pid, $komponentai );
	}

	/**
	 * Kompozicijos nuotrauka.
	 *
	 * Drobe VISADA kvadratine — katalogo miniatiuros kvadratines, o ankstesne
	 * 3x1 juosta ten virsdavo siaura ruozeliu su tusciais pakrasciais.
	 *
	 * Du isdestymai (savininko sprendimas 2026-08-13):
	 *
	 *   2-3 prekes — HEROJUS + PALYDOVAI. Brangiausia preke kaireje, didele;
	 *   priedai desineje, mazesni. Taip 12 kg maisas ir 113 g skanestas
	 *   nebeatrodo vienodai svarbus, o dydis ekrane atitinka tikrove.
	 *
	 *   4 ir daugiau — LYGUS TINKLELIS. Herojaus isdestymas cia jau susigrustu:
	 *   palydovai taptu per smulkus, kad ka nors reikstu.
	 *
	 * Zenklo („3 PREKES") i nuotrauka NEDEGINAM — ji piesia vitrina per CSS.
	 * Taip pakeitus sudeti nereikia perpiesti paveikslo, ir nelieka pavojaus,
	 * kad nuotraukoje liks senas skaicius.
	 */
	private static function kompozicija_vidine( $pid, $komponentai ) {
		if ( ! function_exists( 'imagecreatetruecolor' ) ) { return array( 'error' => 'GD neprieinamas' ); }

		/* Nuotraukos + kainos: brangiausia bus herojus */
		$prekes = array(); $matyti = array();
		foreach ( $komponentai as $cid ) {
			$cid = (int) $cid;
			if ( isset( $matyti[ $cid ] ) ) { continue; }
			$matyti[ $cid ] = true;
			$cp = wc_get_product( $cid );
			if ( ! $cp || ! $cp->get_image_id() ) { continue; }
			$f = get_attached_file( $cp->get_image_id() );
			if ( ! $f || ! file_exists( $f ) ) { continue; }
			$prekes[] = array( 'kelias' => $f, 'kaina' => (float) $cp->get_price() );
		}
		$n = count( $prekes );
		if ( $n < 1 ) { return array( 'error' => 'Nėra nuotraukų' ); }

		$S = 1000;                 /* kvadratine drobe */
		$krastas = 46;
		$tarpas  = 18;

		$drobe = imagecreatetruecolor( $S, $S );
		imagefilledrectangle( $drobe, 0, 0, $S - 1, $S - 1, imagecolorallocate( $drobe, 255, 255, 255 ) );
		imagealphablending( $drobe, true );

		$laukai = array();

		if ( $n <= 3 ) {
			/* HEROJUS + PALYDOVAI: brangiausia i prieki */
			usort( $prekes, function( $a, $b ) { return $b['kaina'] <=> $a['kaina']; } );
			$vidus_p = $S - $krastas * 2;
			$vidus_a = $S - $krastas * 2;

			if ( $n === 1 ) {
				$laukai[] = array( $krastas, $krastas, $vidus_p, $vidus_a );
			} else {
				/* 0.66 — savininko sprendimas 2026-08-13: pagrindine preke turi
				   dominuoti aiskiau. Palydovams lieka apie treciadalis ploco,
				   to uztenka, kad jie liktu atpazistami. */
				$hero_p = (int) round( $vidus_p * 0.66 );
				$sal_p  = $vidus_p - $hero_p - $tarpas;
				$laukai[] = array( $krastas, $krastas, $hero_p, $vidus_a );
				$kiek = $n - 1;
				$sal_a = (int) round( ( $vidus_a - $tarpas * ( $kiek - 1 ) ) / $kiek );
				for ( $i = 0; $i < $kiek; $i++ ) {
					$laukai[] = array(
						$krastas + $hero_p + $tarpas,
						$krastas + $i * ( $sal_a + $tarpas ),
						$sal_p, $sal_a
					);
				}
			}
		} else {
			/* LYGUS TINKLELIS */
			$stulp = (int) ceil( sqrt( $n ) );
			$eil   = (int) ceil( $n / $stulp );
			$plot  = (int) round( ( $S - $krastas * 2 - $tarpas * ( $stulp - 1 ) ) / $stulp );
			$auks  = (int) round( ( $S - $krastas * 2 - $tarpas * ( $eil - 1 ) ) / $eil );
			for ( $i = 0; $i < $n; $i++ ) {
				$r = (int) floor( $i / $stulp );
				$c = $i % $stulp;
				/* paskutine eilute centruojam, jei nepilna */
				$eiluteje = min( $stulp, $n - $r * $stulp );
				$poslinkis = ( $eiluteje < $stulp )
					? (int) round( ( ( $stulp - $eiluteje ) * ( $plot + $tarpas ) ) / 2 )
					: 0;
				$laukai[] = array(
					$krastas + $poslinkis + $c * ( $plot + $tarpas ),
					$krastas + $r * ( $auks + $tarpas ),
					$plot, $auks
				);
			}
		}

		foreach ( $prekes as $i => $pr ) {
			if ( ! isset( $laukai[ $i ] ) ) { break; }
			list( $x, $y, $p, $a ) = $laukai[ $i ];
			self::piesti( $drobe, $pr['kelias'], $x, $y, $p, $a );
		}

		$up = wp_upload_dir();
		$vardas = 'rink-kompozicija-' . $pid . '-' . time() . '.jpg';
		$kelias = trailingslashit( $up['path'] ) . $vardas;
		imagejpeg( $drobe, $kelias, 90 );
		imagedestroy( $drobe );
		if ( ! file_exists( $kelias ) ) { return array( 'error' => 'Nepavyko išsaugoti' ); }

		$tipas = wp_check_filetype( $vardas, null );
		$att = wp_insert_attachment( array(
			'guid'           => trailingslashit( $up['url'] ) . $vardas,
			'post_mime_type' => $tipas['type'],
			'post_title'     => sanitize_file_name( pathinfo( $vardas, PATHINFO_FILENAME ) ),
			'post_status'    => 'inherit',
		), $kelias, $pid );
		if ( is_wp_error( $att ) ) { return array( 'error' => $att->get_error_message() ); }

		require_once ABSPATH . 'wp-admin/includes/image.php';
		wp_update_attachment_metadata( $att, wp_generate_attachment_metadata( $att, $kelias ) );
		set_post_thumbnail( $pid, $att );
		return array( 'media_id' => $att, 'url' => wp_get_attachment_url( $att ), 'isdestymas' => ( $n <= 3 ? 'herojus' : 'tinklelis' ) );
	}

	/** Ipiesia nuotrauka i nurodyta laukeli islaikant proporcijas. */
	private static function piesti( $drobe, $kelias, $x, $y, $plotis, $aukstis ) {
		$info = @getimagesize( $kelias );
		if ( ! $info ) { return; }
		$src = null;
		if ( $info['mime'] === 'image/jpeg' ) { $src = @imagecreatefromjpeg( $kelias ); }
		elseif ( $info['mime'] === 'image/png' ) { $src = @imagecreatefrompng( $kelias ); }
		elseif ( $info['mime'] === 'image/webp' && function_exists( 'imagecreatefromwebp' ) ) { $src = @imagecreatefromwebp( $kelias ); }
		if ( ! $src ) { return; }

		/*
		 * Nukerpam tuscius kampus. Gamintoju nuotraukose aplink preke daznai
		 * lieka daug balto ploto — del to preke laukelyje atrodo perpus mazesne,
		 * nei galetu. Nukirpus, ji uzpildo laukeli ir kompozicija atrodo tvirciau.
		 */
		if ( function_exists( 'imagecropauto' ) ) {
			$kirpta = @imagecropauto( $src, IMG_CROP_SIDES, 0.55 );
			if ( $kirpta !== false && imagesx( $kirpta ) > 40 && imagesy( $kirpta ) > 40 ) {
				imagedestroy( $src );
				$src = $kirpta;
			}
		}

		$sw = imagesx( $src ); $sh = imagesy( $src );
		$k  = min( $plotis / $sw, $aukstis / $sh );
		$nw = max( 1, (int) round( $sw * $k ) );
		$nh = max( 1, (int) round( $sh * $k ) );

		$laik = imagecreatetruecolor( $nw, $nh );
		imagefilledrectangle( $laik, 0, 0, $nw - 1, $nh - 1, imagecolorallocate( $laik, 255, 255, 255 ) );
		imagecopyresampled( $laik, $src, 0, 0, 0, 0, $nw, $nh, $sw, $sh );
		imagecopy( $drobe, $laik,
			$x + (int) round( ( $plotis - $nw ) / 2 ),
			$y + (int) round( ( $aukstis - $nh ) / 2 ),
			0, 0, $nw, $nh );
		imagedestroy( $laik );
		imagedestroy( $src );
	}

	/* ==================== STILIUS ==================== */

	private static function stilius() {
		?>
		<style>
		/* Virsutine juosta — tie patys stiliai kaip kataloge, kad langai atrodytu
		   kaip viena sistema, o ne penki skirtingi irankiai. */
		#wpcontent{padding-left:0}
		.pskat-bar{display:flex;align-items:center;gap:18px;background:#1d2422;color:#e8ebe6;padding:10px 18px;position:sticky;top:32px;z-index:60}
		.pskat-logo{font-weight:700;letter-spacing:.06em;font-size:13px}
		.pskat-nav a{color:#a9b3ad;text-decoration:none;margin-right:16px;font-size:13px}
		.pskat-nav a.on,.pskat-nav a:hover{color:#fff}
		.pskat-search{flex:1;position:relative;display:flex;align-items:center}
		.pskat-search .lupa{position:absolute;left:12px;font-size:14px;opacity:.55;pointer-events:none}
		.pskat-search input{width:100%;max-width:560px;padding:9px 12px 9px 34px;border:1px solid #fff;border-radius:8px;background:#fff;color:#1a201e;font-size:14px}
		.pskat-meta{font-size:12px;color:#a9b3ad;white-space:nowrap}
		.psrink{margin:0 20px 60px}
		.psrink .r{text-align:right}
		.psrink .psr-mut{color:#646970;font-size:11.5px}
		.psrink .psr-ok{color:#007017}
		.psrink .psr-bad{color:#b32d2e}
		.psrink .psr-warn{color:#996800}
		.psrink .psr-sp{flex:1}
		.psrink .psr-t32{width:32px;height:32px;object-fit:contain;background:#fff;border:1px solid #eee;border-radius:2px;display:block}
		.psrink .psr-tuscia{padding:22px;text-align:center;color:#787c82}

		.psr-eiles{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
		.psr-eile{display:block;background:#fff;border:1px solid #c3c4c7;border-left:3px solid #c3c4c7;border-radius:3px;padding:7px 12px;text-decoration:none;color:inherit;min-width:120px}
		.psr-eile:hover{box-shadow:0 1px 4px rgba(0,0,0,.08);color:inherit}
		.psr-eile b{display:block;font-size:19px;line-height:1.2}
		.psr-eile span{font-size:11.5px;color:#646970}
		.psr-eile.on{border-color:#2271b1;border-left-color:#2271b1;background:#f0f6fc}
		.psr-eile.y{border-left-color:#dba617}.psr-eile.y b{color:#996800}
		.psr-eile.r{border-left-color:#d63638}.psr-eile.r b{color:#d63638}
		.psr-eile.g{border-left-color:#00a32a}.psr-eile.g b{color:#007017}
		.psr-eile.b{border-left-color:#72aee6}.psr-eile.b b{color:#0a4b78}

		/* --- sarasas --- */
		.psr-eiles{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
		.psr-eile{background:#fff;border:1px solid #c3c4c7;border-left:3px solid #c3c4c7;border-radius:3px;padding:7px 13px;text-align:left;min-width:118px;cursor:pointer}
		.psr-eile:hover{box-shadow:0 1px 4px rgba(0,0,0,.08)}
		.psr-eile b{display:block;font-size:19px;line-height:1.2}
		.psr-eile span{font-size:11.5px;color:#646970}
		.psr-eile.on{border-color:#2271b1;border-left-color:#2271b1;background:#f0f6fc}
		.psr-eile.y{border-left-color:#dba617}.psr-eile.y b{color:#996800}
		.psr-eile.r{border-left-color:#d63638}.psr-eile.r b{color:#d63638}
		.psr-eile.g{border-left-color:#00a32a}.psr-eile.g b{color:#007017}
		.psr-eile.b{border-left-color:#72aee6}.psr-eile.b b{color:#0a4b78}
		.psr-eile-paaisk{background:#fff;border:1px solid #c3c4c7;border-left:3px solid #72aee6;border-radius:3px;padding:8px 12px;margin:-6px 0 12px;font-size:12.5px}
		.psr-eile-paaisk:empty{display:none}
		.psr-filtrai-blk{background:#fff;border:1px solid #c3c4c7;border-radius:3px;padding:10px 12px;margin-bottom:12px}
		.psr-frow{display:flex;flex-wrap:wrap;gap:9px 16px;align-items:center}
		.psr-frow+.psr-frow{margin-top:9px;padding-top:9px;border-top:1px solid #f0f0f1}
		.psr-f-plati{flex:1;min-width:260px}
		.psr-f-plati input{flex:1;min-width:200px}
		.psr-grupe{display:inline-flex;border:1px solid #8c8f94;border-radius:3px;overflow:hidden}
		.psr-grupe button{border:0;background:#fff;padding:4px 11px;font-size:12.5px;color:#50575e;border-right:1px solid #dcdcde;cursor:pointer}
		.psr-grupe button:last-child{border-right:0}
		.psr-grupe button.on{background:#2271b1;color:#fff}
		.psr-grupe button.tuscia{color:#a7aaad}
		.psr-grupe button i{font-style:normal;font-size:11px;opacity:.65}
		.psr-aktyvus{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:9px}
		.psr-virsus{display:flex;align-items:center;gap:12px;margin-bottom:9px;flex-wrap:wrap}
		.psr-foto{width:56px;height:56px;object-fit:contain;background:#fff;border:1px solid #e5e5e5;border-radius:3px;display:block}
		.psr-foto-n{width:56px;height:56px;border:1px dashed #c3c4c7;border-radius:3px;display:grid;place-items:center;color:#a7aaad;font-size:10px}
		.psr-pav{font-weight:600;font-size:13.5px;line-height:1.35}
		.psr-komp-eil{display:flex;gap:4px;margin-top:5px;flex-wrap:wrap}
		.psr-komp-eil img{width:22px;height:22px;object-fit:contain;background:#fff;border:1px solid #eee;border-radius:2px}
		.psr-dar{font-size:10.5px;color:#787c82;align-self:center}
		.psr-lentele th.psr-sort{cursor:pointer}
		.psr-lentele th.psr-sort:hover{color:#2271b1}
		.psr-lentele td{vertical-align:top}
		.psr-lentele tr.psr-pazymeta td{background:#f0f6fc}
		.psr-masiniai{background:#2c3338;color:#fff;border-radius:3px;padding:8px 14px;display:flex;align-items:center;gap:12px;margin-bottom:10px;font-size:12.5px}
		.psr-korteles{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
		.psr-kort{background:#fff;border:1px solid #c3c4c7;border-radius:3px;overflow:hidden}
		.psr-kort:hover{box-shadow:0 2px 8px rgba(0,0,0,.09)}
		.psr-kfoto{height:150px;display:grid;place-items:center;background:#fafafa;border-bottom:1px solid #f0f0f1;position:relative}
		.psr-kfoto img{max-width:88%;max-height:88%;object-fit:contain}
		.psr-zenklas{position:absolute;top:7px;left:7px}
		.psr-kbody{padding:9px 11px}
		.psr-kpav{font-weight:600;font-size:13px;line-height:1.35;height:53px;overflow:hidden}
		.psr-kkaina{font-size:16px;font-weight:600;margin-top:5px}
		.psr-kmeta{display:flex;justify-content:space-between;font-size:11.5px;color:#646970;margin-top:5px;border-top:1px solid #f0f0f1;padding-top:6px}
		.psr-z{display:inline-block;font-size:11px;border:1px solid;border-radius:2px;padding:0 6px;white-space:nowrap;margin:0 2px 2px 0}
		.psr-z.g{background:#edfaef;border-color:#b8e6c1;color:#00622a}
		.psr-z.y{background:#fcf9e8;border-color:#e8dfa8;color:#7a5c00}
		.psr-z.r{background:#fcf0f1;border-color:#f0c3c4;color:#8a2424}
		.psr-z.b{background:#f0f6fc;border-color:#c5d9ed;color:#0a4b78}



		.psr-kaina{width:82px;text-align:right;padding:3px 6px;border:1px solid #8c8f94;border-radius:3px;font-size:13px}
		.psr-kaina:focus{border-color:#2271b1;box-shadow:0 0 0 1px #2271b1;outline:0}
		.psr-kaina:disabled{background:#f0f0f1}
		.psr-isimti{color:#b32d2e;border-color:#dcdcde}
		.psr-stat{position:fixed;right:18px;bottom:18px;z-index:9999;padding:11px 16px;border-radius:4px;
			font-size:13.5px;box-shadow:0 3px 12px rgba(0,0,0,.2);opacity:0;transform:translateY(8px);
			transition:opacity .2s,transform .2s;pointer-events:none;max-width:420px}
		.psr-stat.rodo{opacity:1;transform:none}
		.psr-stat.gerai{background:#00a32a;color:#fff}
		.psr-stat.bloga{background:#d63638;color:#fff}
		.psr-rez{max-height:340px;overflow:auto;border-top:1px solid #f0f0f1}
		/* v1.26 pasirenkami */
		.psr-skirtukai{border-bottom:1px solid #c3c4c7;display:flex;gap:4px;margin:14px 0 18px}
		.psr-skirtukai a{padding:9px 15px;text-decoration:none;color:#646970;font-size:14px;border:1px solid transparent;border-bottom:0;margin-bottom:-1px;border-radius:3px 3px 0 0}
		.psr-skirtukai a.on{background:#f0f0f1;border-color:#c3c4c7;color:#1d2327;font-weight:600}
		.psr-juostele{position:relative;height:22px;border:1px solid #dcdcde;border-radius:2px;background:linear-gradient(90deg,#fcf0f1 0 20%,#fcf9e8 20% 45%,#f6faf7 45% 100%)}
		.psr-juostele i{position:absolute;top:3px;bottom:3px;background:#00a32a;border-radius:2px}
		.psr-juostele i.bloga{background:#d63638}
		.psr-juostele u{position:absolute;top:0;bottom:0;width:1px;background:#fff;text-decoration:none}
		.psr-juostele-t{display:flex;justify-content:space-between;font-size:11px;color:#646970;margin-top:2px}
		.psr-apsauga{padding:9px 0 9px 11px;border-top:1px solid #f0f0f1;border-left:3px solid #c3c4c7;font-size:12.5px}
		.psr-apsauga:first-child{border-top:0;padding-top:0}
		.psr-apsauga b{display:block}
		.psr-apsauga span{color:#646970}
		.psr-r-l{border-left-color:#d63638}.psr-y-l{border-left-color:#dba617}.psr-g-l{border-left-color:#00a32a}
		.psr-grupe{display:flex;gap:6px;flex-wrap:wrap}
		.psr-grupe .button i{font-style:normal}
		.psr-forma{display:grid;grid-template-columns:minmax(0,1fr) 350px;gap:16px;align-items:start;margin-top:14px}
		.psr-kaire{min-width:0}
		@media(max-width:1400px){.psr-forma{grid-template-columns:1fr}}
		.psr-kort{background:#fff;border:1px solid #c3c4c7;border-radius:3px;margin-bottom:16px;box-shadow:0 1px 1px rgba(0,0,0,.04)}
		.psr-kort>h3{margin:0;padding:10px 14px;font-size:13.5px;border-bottom:1px solid #f0f0f1;background:#f6f7f7;display:flex;align-items:center;gap:8px}
		.psr-vidus{padding:12px 14px}
		/* Anksciau „lipni" buvo tik kainodaros kortele, o perziura po ja slinko ir
		   uzdengdavo — atrode, kad puse lango juda, puse ne. Dabar lipni yra VISA
		   desine kolona su savo vidine slinktimi: nieko nepersidengia. */
		.psr-lipni{position:static}
		.psr-desine{position:sticky;top:calc(var(--wp-admin--admin-bar--height, 32px) + 14px);max-height:calc(100vh - 130px);overflow-y:auto;overflow-x:hidden;padding-right:2px}
		.psr-desine::-webkit-scrollbar{width:8px}
		.psr-desine::-webkit-scrollbar-thumb{background:#c3c4c7;border-radius:4px}
		@media(max-width:1400px){.psr-desine{position:static;max-height:none;overflow:visible}}
		.psr-kort .form-table th{width:150px;padding:10px 10px 10px 0}
		.psr-kort .form-table td{padding:8px 0}

		.psr-filtrai{padding:10px 14px;background:#fbfbfc;border-bottom:1px solid #f0f0f1;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}
		.psr-f{display:flex;align-items:center;gap:6px}
		.psr-f>label{font-size:12px;color:#646970;white-space:nowrap}
		.psr-f-plati{flex:1;min-width:300px}
		.psr-f-plati input{flex:1;min-width:180px}
		.psr-rez{max-height:430px;overflow:auto;position:relative}
		.psr-rez-juosta{position:sticky;top:0;z-index:2;background:#f6f7f7;border-bottom:1px solid #ddd;padding:6px 12px;display:flex;gap:14px;align-items:center;font-size:12.5px}
		.psr-rez-t{border:0;box-shadow:none}
		.psr-rez-t th{position:sticky;top:31px;background:#fff;z-index:1;font-size:11.5px}
		.psr-sud tr.psr-neg td{background:#fff5f5}
		.psr-x{border:1px solid #dcdcde;background:#fff;color:#b32d2e;border-radius:3px;width:24px;height:24px;line-height:1;cursor:pointer}
		.psr-x:hover{background:#fcf0f1;border-color:#b32d2e}

		.psr-kn{width:100%;border-collapse:collapse;font-size:12.5px}
		.psr-kn td{padding:5px 0;border-bottom:1px solid #f4f4f4}
		.psr-kn tr.psr-rek td{background:#f0f6fc;padding:7px 6px;border-bottom:1px solid #cfe2f3}
		.psr-kaina-blk{margin:12px 0;padding:10px;background:#f6f7f7;border:1px solid #dcdcde;border-radius:3px}
		.psr-kaina-blk label{display:block;font-size:12px;color:#50575e;margin-bottom:4px;font-weight:600}
		.psr-kaina-blk input{width:100%;font-size:20px;padding:6px 8px}
		.psr-perspejimas{border:1px solid;border-left-width:4px;border-radius:2px;padding:8px 10px;font-size:12px;margin:10px 0 0}
		.psr-perspejimas.y{background:#fcf9e8;border-color:#e8dfa8;border-left-color:#dba617}
		.psr-perspejimas.r{background:#fcf0f1;border-color:#f0c3c4;border-left-color:#d63638}

		.psr-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px;min-height:24px}
		.psr-chip{background:#f0f6fc;border:1px solid #c5d9ed;color:#0a4b78;border-radius:11px;padding:2px 6px 2px 10px;font-size:12px;display:inline-flex;align-items:center;gap:4px}
		.psr-chip.auto{background:#f6f7f7;border-color:#dcdcde;color:#50575e}
		.psr-chip button{border:0;background:none;color:inherit;cursor:pointer;font-size:12px;padding:0 2px}

		.psr-perz{border:1px solid #e5e5e5;border-radius:3px;padding:10px;background:#fff}
		.psr-komp{display:grid;gap:6px;background:#f8f8f8;padding:6px;border-radius:2px}
		.psr-kt{background:#fff;border-radius:2px;aspect-ratio:1/1;display:grid;place-items:center;padding:4px}
		.psr-kt img{max-width:100%;max-height:100%;object-fit:contain}
		.psr-komp-tuscia{background:#f8f8f8;border:1px dashed #c3c4c7;border-radius:2px;padding:24px 10px;text-align:center;color:#787c82;font-size:12.5px}
		.psr-perz-pav{font-size:15px;font-weight:600;margin:10px 0 4px}
		.psr-perz-kaina{font-size:20px;color:#007017;font-weight:600}
		.psr-perz-kaina s{font-size:14px;color:#787c82;font-weight:400;margin-left:6px}
		.psr-perz-taupo{display:inline-block;background:#edfaef;border:1px solid #b8e6c1;color:#00622a;border-radius:2px;padding:1px 7px;font-size:12px;margin-top:5px}
		.psr-perz-sud{margin-top:10px;font-size:12.5px}
		.psr-perz-sud ol{margin:5px 0 0 18px;padding:0}
		.psr-perz-sud li{margin-bottom:2px}

		.psr-juosta{position:sticky;bottom:0;background:#fff;border-top:1px solid #c3c4c7;padding:10px 16px;display:flex;gap:10px;align-items:center;margin:14px -20px 0;box-shadow:0 -2px 8px rgba(0,0,0,.08);z-index:100;flex-wrap:wrap}
		.psr-tipas{margin:0;padding:10px 14px;border-bottom:1px solid #f0f0f1;font-size:12.5px}
		.psr-tipas.tuscia{background:#fbfbfc;color:#646970}
		.psr-tipas.dp{background:#f0f6fc;border-left:3px solid #2271b1}
		.psr-tipas.mnm{background:#edfaef;border-left:3px solid #00a32a}
		.psr-perz-dp .psr-dp-foto{position:relative;background:#fff;border:1px solid #eee;border-radius:2px;padding:8px;text-align:center}
		.psr-perz-dp .psr-dp-foto img{max-width:100%;max-height:150px;object-fit:contain}
		.psr-dp-zenklas{position:absolute;top:8px;left:8px;background:#2e5c48;color:#fff;border-radius:50%;width:44px;height:44px;display:grid;place-items:center;font-size:11px;font-weight:700;line-height:1.1}
		.psr-dp-juosta{background:#2e5c48;color:#fff;text-align:center;font-size:11px;font-weight:600;padding:4px;letter-spacing:.3px}
		.psr-z.gr{background:#f6f7f7;border-color:#dcdcde;color:#50575e}
		.psr-varnele{font-size:12.5px;display:flex;align-items:center;gap:5px}
		.psr-varnele i{color:#646970;font-style:normal;font-size:11.5px}
		.psr-trink{color:#b32d2e!important;border-color:#b32d2e!important}
		.psr-stat{font-size:12.5px}
		</style>
		<?php
	}

}

Petshop_Rinkiniai::init();
