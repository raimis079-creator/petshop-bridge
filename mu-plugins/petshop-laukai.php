<?php
/**
 * Plugin Name: Petshop Laukai
 * Description: Pasirenkami rinkiniai naujuoju modeliu — laukas (iki 8 prekiu is vieno sandelio),
 *              laisvas kiekis nuo 3 vnt. ir pakopine nuolaida pagal krepselio verte.
 * Version:     1.00
 * Author:      Petshop
 *
 * KODEL ATSKIRAS FAILAS:
 * `petshop-rinkiniai.php` tvarko paruostus rinkinius ir DP pakus — jie veikia ir ju
 * liesti nereikia. Laukai yra kitas modelis (ne fiksuotas dydis, o laisvas kiekis),
 * todel gyvena atskirai. Jei laukai kada nors bus atmesti, uztenka istrinti si faila.
 *
 * MODELIS:
 * - Vienas laukas = vienas MnM konteineris: kainos atskirai, min 3, maks. neribota.
 * - Krepsys = iki 9 vaikiniu prekiu, visos is TO PACIO sandelio (viena siunta).
 * - Klientas gali imti kelis to paties vienetus — MnM kiekio laukelis.
 * - Nuolaida pakopomis pagal krepselio SUMA, ne pagal kieki. Ji taikoma
 *   VISOMS lauko prekems, ne paskutinei.
 *
 * KODEL NUOLAIDA KREPSELYJE, O NE MnM `_mnm_discount`:
 * MnM moka tik viena fiksuota procenta. Pakopa priklauso nuo sumos, kuri
 * paaiskeja tik surinkus krepseli, todel kaina koreguojama
 * `woocommerce_before_calculate_totals` metu — kiekvienai vaikinei prekei
 * atskirai. Taip kiekviena preke lieka atskira eilute su savo kaina ir
 * savikaina — to reikia pardavumo analizei: kuri deze ka realiai parduoda.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Laukai {

	/** v1.44: rinkiklio kategoriju filtro sarasas (product_cat term_id, tvarka = rodymo tvarka). */
	const RINKIKLIO_KATEGORIJOS = array( 95, 96, 73, 79, 97, 98 );
	const VERSIJA = '1.45';   /* v1.44 (S1595): rinkiklio kategorijos + konservai. v1.45 (S1596): meniu „Susidek…“ nuorodos dinamiskai -> iejimo deze pagal grupe (buvo irasyti URL i TEST dezes -> 404 po trynimo) */

	/** Ar preke yra laukas. */
	const META_LAUKAS = '_ps_laukas';
	/** Pakopos: JSON [{"nuo":20,"d":2},...] — „nuo\" yra suma su PVM. */
	const META_PAKOPOS = '_ps_laukas_pakopos';
	/** Zodis vitrinai: „deze\" sunims, „dezute\" katems. Linksniai atskirai. */
	const META_ZODIS = '_ps_laukas_zodis';
	/** Sandelis, is kurio krepsys. Kito sandelio prekes idėti draudziama. */
	const META_SANDELIS = '_ps_laukas_sandelis';
	/** Seima grupavimui admin lange (pvz. „Sunims\"). */
	const META_SEIMA = '_ps_laukas_seima';
	/** Dovanu prekiu ID (JSON, iki 3). Konservu dezems. */
	const META_DOVANOS = '_ps_laukas_dovanos';
	/** Suma su PVM, nuo kurios dovana atrakinama. 0 = dovanu nera. */
	const META_DOV_RIBA = '_ps_laukas_dovanos_riba';
	/** Pakuotes dydis (800 g / 400 g / 100 g) — vitrinos dydzio eilutei. */
	const META_DYDIS = '_ps_laukas_dydis';
	/* Iejimas: viena dezė grupeje, i kuria veda kategorijos banneris. Klientas
	   ieina i VIENA lauka, o dydzius ir poreikius renkasi jau vitrinoje
	   (savininko patikslinimas 2026-08-15). */
	const META_IEJIMAS = '_ps_laukas_iejimas';

	/** Maziausias kiekis, kad deze butu deze, o ne viena preke. */
	const MIN_KIEKIS = 3;
	/** 9 prekes — 3x3 tinklelis vitrinoje uzsipildo svariai (savininko sprendimas 2026-08-14). */
	/* 12, ne 9: savininko sprendimas 2026-08-15 — konservu dezei devyniu
	   skoniu maza, kai klientas deda 13–17 vnt. Skanestu dezems niekas
	   nesikeicia: ju krepsiai lieka po 9, cia tik virsutine riba. */
	const MAX_KREPSYS = 12;
	/** Po nuolaidos silpniausios prekes marza privalo likti bent tiek. */
	const MARZOS_RIBA = 20.0;

	public static function init() {
		/* Pakopu variklis. 100 — po MnM, kuris savo kainas sudeda ties 10. */
		add_action( 'woocommerce_before_calculate_totals', array( __CLASS__, 'pakopos_krepselyje' ), 100 );

		/* Laukas nera nukainota preke. WC ji tokia laiko, nes iprasta kaina
		   yra visu krepsio prekiu suma (32,21 EUR), o aktyvi — 0, kol klientas
		   nieko nepasirinko. Del to krepselyje kabejo „Akcija: -100 %". */
		/* 999, nes MnM savo kabliuka registruoja veliau ir su 20 jis mus perrasydavo
		   — patikrinta gyvai: is_on_sale liko true. */
		add_filter( 'woocommerce_product_is_on_sale', array( __CLASS__, 'ne_akcija' ), 999, 2 );

		/* Kiekio laukelis: leidziam kelis to paties vienetus. */
		add_filter( 'wc_mnm_child_item_quantity_input_args', array( __CLASS__, 'kiekio_laukelis' ), 10, 3 );

		/* Nuotrauka parduotuveje. Iki v1.43 `foto_id()` gyveno TIK admin lange,
		   todel rinkinys be savos nuotraukos kataloge rode WooCommerce vietos
		   uzpilda, nors grupes nuotrauka buvo nustatyta. Kabinames ant WC CRUD
		   getterio — per ji eina ir katalogo tinklelis, ir prekes puslapis, ir
		   krepselis, todel uztenka vienos vietos. */
		add_filter( 'woocommerce_product_get_image_id', array( __CLASS__, 'foto_atsargine' ), 10, 2 );

		/* Vitrina: savas sablonas vietoj MnM saraso. */
		add_action( 'wp', array( __CLASS__, 'vitrina_init' ), 20 );
		add_filter( 'body_class', array( __CLASS__, 'vitrina_klase' ) );

		/* Admin panele. */
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 22 );
		add_action( 'wp_ajax_ps_laukai_naujas',      array( __CLASS__, 'ajax_naujas' ) );
		add_action( 'wp_ajax_ps_laukai_nustatymai',  array( __CLASS__, 'ajax_nustatymai' ) );
		add_action( 'wp_ajax_ps_laukai_pakopos',     array( __CLASS__, 'ajax_pakopos' ) );
		add_action( 'wp_ajax_ps_laukai_krepsys',     array( __CLASS__, 'ajax_krepsys' ) );
		add_action( 'wp_ajax_ps_laukai_paieska',     array( __CLASS__, 'ajax_paieska' ) );
		add_action( 'wp_ajax_ps_laukai_prekes',      array( __CLASS__, 'ajax_prekes' ) );
		add_action( 'wp_ajax_ps_laukai_prideti_kelias', array( __CLASS__, 'ajax_prideti_kelias' ) );
		add_action( 'wp_ajax_ps_laukai_foto',        array( __CLASS__, 'ajax_foto' ) );
		add_action( 'wp_ajax_ps_laukai_dovanos',     array( __CLASS__, 'ajax_dovanos' ) );
		add_action( 'wp_ajax_ps_laukai_dov_paieska', array( __CLASS__, 'ajax_dov_paieska' ) );
		add_action( 'wp_ajax_ps_laukai_trinti',      array( __CLASS__, 'ajax_trinti' ) );
		add_action( 'wp_ajax_ps_laukai_busena',      array( __CLASS__, 'ajax_busena' ) );

		/* Dovanu variklis (v1.16). Sinchronizacija — ties krepselio ivykiais,
		   NE ties calculate_totals: ten prekiu deti negalima. */
		add_filter( 'woocommerce_add_cart_item_data', array( __CLASS__, 'dovana_i_krepseli' ), 10, 2 );
		add_action( 'woocommerce_add_to_cart',                    array( __CLASS__, 'sinchronizuoti_dovanas' ), 20 );
		add_action( 'woocommerce_after_cart_item_quantity_update', array( __CLASS__, 'sinchronizuoti_dovanas' ), 20 );
		add_action( 'woocommerce_cart_item_removed',              array( __CLASS__, 'sinchronizuoti_dovanas' ), 20 );
		add_action( 'woocommerce_cart_loaded_from_session',       array( __CLASS__, 'sinchronizuoti_dovanas' ), 20 );
		/* Kaina 0 — kiekvieno skaiciavimo metu, po pakopu. */
		add_action( 'woocommerce_before_calculate_totals', array( __CLASS__, 'dovanos_kaina' ), 101 );
		add_filter( 'woocommerce_cart_item_quantity', array( __CLASS__, 'dovanos_kiekis' ), 10, 3 );
		add_filter( 'woocommerce_cart_item_price',    array( __CLASS__, 'dovanos_zyme' ), 10, 3 );
		add_action( 'woocommerce_checkout_create_order_line_item', array( __CLASS__, 'dovanos_eilute' ), 11, 4 );

		/* Uzsakyme irasom, kokia pakopa suveike — kad apskaita ir grazinimai
		   rodytu, kodel kaina buvo mazesne nei kortele. */
		add_action( 'woocommerce_checkout_create_order_line_item', array( __CLASS__, 'eilutes_zyme' ), 10, 4 );
	}

	/* ==================== PAGRINDAI ==================== */

	/** Ar sis produktas yra laukas. */
	public static function yra_laukas( $pid ) {
		return get_post_meta( (int) $pid, self::META_LAUKAS, true ) === 'yes';
	}

	/** Pakopos, surikiuotos didejant. Blogas JSON grazina tuscia — ne klaida. */
	public static function pakopos( $pid ) {
		$r = json_decode( (string) get_post_meta( (int) $pid, self::META_PAKOPOS, true ), true );
		if ( ! is_array( $r ) ) { return array(); }
		$sv = array();
		foreach ( $r as $p ) {
			if ( ! isset( $p['nuo'], $p['d'] ) ) { continue; }
			$sv[] = array( 'nuo' => (float) $p['nuo'], 'd' => (float) $p['d'] );
		}
		usort( $sv, function( $a, $b ) { return $a['nuo'] <=> $b['nuo']; } );
		return $sv;
	}

	/** Kuri pakopa galioja siai sumai. Grazina procentus (0, jei nei viena). */
	public static function pakopa_sumai( $pid, $suma ) {
		$d = 0.0;
		foreach ( self::pakopos( $pid ) as $p ) {
			if ( $suma + 0.0001 >= $p['nuo'] ) { $d = $p['d']; }
		}
		return $d;
	}

	/** Zodis vitrinai su linksniais. */
	public static function zodis( $pid ) {
		$z = get_post_meta( (int) $pid, self::META_ZODIS, true );
		$z = $z ? $z : 'deze';
		$formos = array(
			'deze'   => array( 'v' => 'dėžė',   'g' => 'dėžės',   'k' => 'dėžę',   'n' => 'dėžei' ),
			'dezute' => array( 'v' => 'dėžutė', 'g' => 'dėžutės', 'k' => 'dėžutę', 'n' => 'dėžutei' ),
		);
		return isset( $formos[ $z ] ) ? $formos[ $z ] : $formos['deze'];
	}

	/** Savikaina. Tie patys raktai kaip petshop-rinkiniuose — nekartojam logikos. */
	public static function savikaina( $pid ) {
		if ( class_exists( 'Petshop_Rinkiniai' ) && method_exists( 'Petshop_Rinkiniai', 'savikaina' ) ) {
			return Petshop_Rinkiniai::savikaina( $pid );
		}
		foreach ( array( '_cost_price', '_vf_cost', '_zb_cost' ) as $r ) {
			$v = get_post_meta( (int) $pid, $r, true );
			if ( $v !== '' && $v !== false && $v !== null ) { return (float) $v; }
		}
		return null;
	}

	/** Lauko krepsio prekiu ID. */
	public static function krepsys( $pid ) {
		global $wpdb;
		return array_map( 'intval', $wpdb->get_col( $wpdb->prepare(
			"SELECT product_id FROM {$wpdb->prefix}wc_mnm_child_items
			 WHERE container_id = %d ORDER BY menu_order", (int) $pid ) ) );
	}

	/**
	 * Didziausia nuolaida, kuria sis krepsys atlaiko.
	 * Riboja SILPNIAUSIA preke: po nuolaidos jos ANTKAINIS privalo likti >= 20 %.
	 *
	 * ANTKAINIS (2026-08-26, Raimio sprendimas). `MARZOS_RIBA` reiksme visada
	 * buvo duota kaip ANTKAINIS (nuo savikainos), o kodas ja taike kaip MARZA
	 * (nuo kainos). Del to riba suveikdavo per anksti: prie 20 imties nuolaida
	 * buvo ribojama taip, lyg riba butu antkainis 25 %.
	 * Konstanta NEKEISTA — pakeista FORMULE, kad 20 reikstu antkaini 20 %.
	 *   marza  d = 1 - (1 - silpn) / (1 - RIBA/100)
	 *   antkainis d = 1 - (1 + RIBA/100) / (1 + silpn)
	 * Patikra: savikaina 10, kaina be PVM 15 (antkainis 50 %), riba 20 %
	 *   -> d = 1 - 1.20/1.50 = 20 %; 15 x 0.80 = 12.00 = 10 x 1.20  OK
	 * Klientas gali prisidėti vien silpniausiu — todel skaiciuojam is blogiausio,
	 * ne is vidurkio.
	 */
	public static function saugi_pakopa( $pid ) {
		$marzos = array();
		foreach ( self::krepsys( $pid ) as $cid ) {
			$p = wc_get_product( $cid );
			$sav = self::savikaina( $cid );
			if ( ! $p || $sav === null ) { continue; }
			$kaina_be = (float) $p->get_price() / 1.21;
			if ( $kaina_be <= 0 ) { continue; }
			/* ANTKAINIS nuo savikainos (2026-08-26), ne marza nuo kainos. */
			$marzos[] = ( $kaina_be - $sav ) / $sav;
		}
		if ( ! $marzos ) { return 0; }
		$silpn = min( $marzos );
		$d = 1 - ( 1 + self::MARZOS_RIBA / 100 ) / ( 1 + $silpn );
		return max( 0, (int) floor( $d * 100 ) );
	}

	/* ==================== PAKOPU VARIKLIS ==================== */

	/**
	 * Krepselyje: kiekvienam lauko konteineriui suskaiciuojam jo vaiku suma,
	 * randam pakopa ir tuo paciu procentu sumazinam KIEKVIENOS vaikines
	 * prekes kaina.
	 *
	 * Kodel per vaikus, o ne per konteineri: kai kainos skaiciuojamos atskirai,
	 * konteinerio kaina yra 0, o pinigai gyvena vaikuose. Sumazinus konteineri
	 * nesikeistu niekas.
	 */
	public static function pakopos_krepselyje( $cart ) {
		if ( is_admin() && ! defined( 'DOING_AJAX' ) ) { return; }
		if ( ! $cart instanceof WC_Cart ) { return; }

		/* 1) surenkam vaikus pagal konteinerio krepselio rakta */
		$grupes = array();
		foreach ( $cart->get_cart() as $raktas => $eil ) {
			$tevas = self::tevo_raktas( $eil );
			if ( ! $tevas ) { continue; }
			$grupes[ $tevas ][ $raktas ] = $eil;
		}
		if ( ! $grupes ) { return; }

		foreach ( $grupes as $tevo_raktas => $vaikai ) {
			$tevo_eil = $cart->get_cart_item( $tevo_raktas );
			if ( ! $tevo_eil || empty( $tevo_eil['product_id'] ) ) { continue; }
			$lid = (int) $tevo_eil['product_id'];
			if ( ! self::yra_laukas( $lid ) ) { continue; }

			$pakopos = self::pakopos( $lid );
			if ( ! $pakopos ) { continue; }

			/* 2) suma is vaiku PRADINIU kainu (su PVM, kaip mato klientas) */
			$suma = 0.0;
			foreach ( $vaikai as $eil ) {
				$p = $eil['data'];
				if ( ! $p instanceof WC_Product ) { continue; }
				$pradine = self::pradine_kaina( $eil );
				$suma += $pradine * (int) $eil['quantity'];
			}
			if ( $suma <= 0 ) { continue; }

			/* 3) pakopa ir apsauga: niekada giliau, nei krepsys atlaiko */
			$d = self::pakopa_sumai( $lid, $suma );
			$saugi = self::saugi_pakopa( $lid );
			if ( $saugi > 0 && $d > $saugi ) { $d = $saugi; }
			if ( $d <= 0 ) { continue; }

			/* 4) taikom kiekvienam vaikui */
			foreach ( $vaikai as $raktas => $eil ) {
				$p = $eil['data'];
				if ( ! $p instanceof WC_Product ) { continue; }
				$pradine = self::pradine_kaina( $eil );
				if ( $pradine <= 0 ) { continue; }
				$nauja = round( $pradine * ( 1 - $d / 100 ), wc_get_price_decimals() );
				$p->set_price( $nauja );
				$cart->cart_contents[ $raktas ]['ps_laukas_nuolaida'] = $d;
				$cart->cart_contents[ $raktas ]['ps_laukas_pradine']  = $pradine;
			}
			$cart->cart_contents[ $tevo_raktas ]['ps_laukas_nuolaida'] = $d;
			$cart->cart_contents[ $tevo_raktas ]['ps_laukas_suma']     = $suma;
		}
	}

	/**
	 * Vaiko tevo krepselio raktas. MnM versijos ji vadina skirtingai, todel
	 * tikrinam abu variantus — kitaip po plėtinio atnaujinimo nuolaida tyliai
	 * nustotu veikti.
	 */
	private static function tevo_raktas( $eil ) {
		foreach ( array( 'mnm_container', 'mnm_container_key', 'bundled_by' ) as $r ) {
			if ( ! empty( $eil[ $r ] ) && is_string( $eil[ $r ] ) ) { return $eil[ $r ]; }
		}
		return '';
	}

	/**
	 * Pradine vaiko kaina. Antra karta skaiciuojant totalus WC gali paduoti
	 * jau sumazinta objekta, todel remiames issaugota reiksme, o ne tuo,
	 * ka rodo produktas dabar. Be to nuolaida uzsidetu ant nuolaidos.
	 */
	private static function pradine_kaina( $eil ) {
		if ( isset( $eil['ps_laukas_pradine'] ) ) { return (float) $eil['ps_laukas_pradine']; }
		$p = $eil['data'];
		return $p instanceof WC_Product ? (float) $p->get_price() : 0.0;
	}

	/** Kiekio laukelis: be virsutines ribos, kad butu galima imti 5 vienodus. */
	public static function kiekio_laukelis( $args, $child_item, $konteineris ) {
		$pid = 0;
		if ( is_object( $konteineris ) && method_exists( $konteineris, 'get_id' ) ) { $pid = $konteineris->get_id(); }
		if ( ! $pid || ! self::yra_laukas( $pid ) ) { return $args; }
		$args['min_value'] = 0;
		$args['max_value'] = '';   /* tuscia = neribota */
		return $args;
	}

	/** Laukas niekada nera „akcijoje" — nuolaida gimsta tik is pakopu. */
	public static function ne_akcija( $ar, $product ) {
		if ( $product instanceof WC_Product && self::yra_laukas( $product->get_id() ) ) { return false; }
		return $ar;
	}

	/** Uzsakymo eiluteje paliekam pedsaka, kokia pakopa suveike. */
	public static function eilutes_zyme( $item, $raktas, $reiksmes, $order ) {
		if ( empty( $reiksmes['ps_laukas_nuolaida'] ) ) { return; }
		$item->add_meta_data( '_ps_laukas_nuolaida', (float) $reiksmes['ps_laukas_nuolaida'], true );
		if ( isset( $reiksmes['ps_laukas_pradine'] ) ) {
			$item->add_meta_data( '_ps_laukas_pradine', (float) $reiksmes['ps_laukas_pradine'], true );
		}
	}


	/* ==================== DOVANU MODELIS (v1.16) ====================
	 *
	 * Konservu dezems pakopu NEDAROM — savininko sprendimas 2026-08-15:
	 * musu kainos nera uzkeltos, tad procentine nuolaida butu arba melas,
	 * arba maržos praradimas. Vietoj jos — DVI paskatos:
	 *   1) nemokamas pristatymas (jau veikia WooCommerce nustatymuose),
	 *   2) DOVANA pasiekus sumos riba — klientas renkasi is triju.
	 *
	 * Pakopos ir dovana yra NEPRIKLAUSOMI mechanizmai: skanestu deze turi
	 * pakopas ir neturi dovanos, konservu deze — atvirksciai. Techniskai
	 * niekas netrukdo turėti abu, bet to nedarom (klientui du pazadai vienu
	 * metu — triukšmas).
	 */

	/** Dovanos riba EUR su PVM. 0 = dovanu sis laukas neturi. */
	public static function dovanos_riba( $pid ) {
		$v = get_post_meta( (int) $pid, self::META_DOV_RIBA, true );
		return $v === '' ? 0.0 : (float) $v;
	}

	/** Dovanu prekiu ID (iki 3). Grazina tik tas, kurias realiai galima siusti. */
	public static function dovanos( $pid, $tik_turimos = true ) {
		$raw = get_post_meta( (int) $pid, self::META_DOVANOS, true );
		$ids = $raw ? (array) json_decode( $raw, true ) : array();
		$ids = array_values( array_filter( array_map( 'intval', $ids ) ) );
		if ( ! $tik_turimos ) { return $ids; }
		$out = array();
		foreach ( $ids as $id ) {
			$p = wc_get_product( $id );
			/* Dovana, kurios nera sandelyje, nerodoma: pazadas, kurio negalim
			   ivykdyti, brangesnis nei pati dovana. */
			if ( $p && $p->is_in_stock() ) { $out[] = $id; }
		}
		return $out;
	}

	/** Pakuotes dydis (800 g / 400 g / 100 g). Vitrinai — dydzio eilutei virs lauku. */
	public static function dydis( $pid ) {
		return (string) get_post_meta( (int) $pid, self::META_DYDIS, true );
	}

	/** Ar sis laukas dirba su dovana (o ne su pakopomis). */
	public static function su_dovana( $pid ) {
		return self::dovanos_riba( $pid ) > 0 && self::dovanos( $pid ) !== array();
	}

	/* ==================== DOVANU VARIKLIS ====================
	 *
	 * Dovana krepselyje yra ATSKIRA eilute su kaina 0, o ne konteinerio
	 * priedas. Taip todel, kad:
	 *   — sandelininkas mato ja kaip preke, kuria reikia idėti i deze;
	 *   — apskaita mato realia savikaina (dovana kainuoja mums, ne klientui);
	 *   — grazinimo atveju ja galima nurasyti atskirai.
	 *
	 * Sinchronizacija daroma NE ties calculate_totals (ten prekiu dėti negalima
	 * — begalinis ciklas), o ties krepselio ivykiais: idėjus, pakeitus kieki,
	 * isėmus, uzkrovus is sesijos.
	 */

	/** Ar si krepselio eilute yra dovana. */
	private static function ar_dovana( $eil ) {
		return ! empty( $eil['ps_dovana_tevas'] );
	}

	/**
	 * Konteineriu sumos krepselyje: [konteinerio_raktas => vaiku suma su PVM].
	 * Dovanu eilutes i suma NESKAICIUOJAMOS — kitaip dovana pati islaikytu
	 * riba, kai klientas isima prekes.
	 */
	private static function konteineriu_sumos( $cart ) {
		$sumos = array();
		foreach ( $cart->get_cart() as $raktas => $eil ) {
			if ( self::ar_dovana( $eil ) ) { continue; }
			$tevas = self::tevo_raktas( $eil );
			if ( ! $tevas ) { continue; }
			$p = $eil['data'];
			if ( ! $p instanceof WC_Product ) { continue; }
			$kaina = self::pradine_kaina( $eil );
			if ( ! isset( $sumos[ $tevas ] ) ) { $sumos[ $tevas ] = 0.0; }
			$sumos[ $tevas ] += $kaina * (int) $eil['quantity'];
		}
		return $sumos;
	}

	/**
	 * Sutvarko dovanas krepselyje: prideda truktamas, isima nebepriklausancias.
	 * Saugiklis `$dirba` — kad `add_to_cart` viduje kiles ivykis nesuktu ratu.
	 */
	public static function sinchronizuoti_dovanas() {
		static $dirba = false;
		if ( $dirba ) { return; }
		if ( is_admin() && ! defined( 'DOING_AJAX' ) ) { return; }
		if ( ! function_exists( 'WC' ) || ! WC()->cart ) { return; }
		$cart = WC()->cart;
		if ( ! $cart instanceof WC_Cart ) { return; }

		$dirba = true;

		$sumos = self::konteineriu_sumos( $cart );

		/* 1) kokios dovanos PRIVALO buti: [tevo_raktas => prekes_id] */
		$reikia = array();
		foreach ( $cart->get_cart() as $raktas => $eil ) {
			if ( empty( $eil['product_id'] ) ) { continue; }
			$lid = (int) $eil['product_id'];
			if ( ! self::yra_laukas( $lid ) || ! self::su_dovana( $lid ) ) { continue; }
			$suma = isset( $sumos[ $raktas ] ) ? $sumos[ $raktas ] : 0.0;
			if ( $suma < self::dovanos_riba( $lid ) ) { continue; }

			$galimos = self::dovanos( $lid );
			if ( ! $galimos ) { continue; }
			$pasirinkta = isset( $eil['ps_laukas_dovana'] ) ? (int) $eil['ps_laukas_dovana'] : 0;
			/* Jei klientas nieko nepasirinko arba pasirinkta dingo is sandelio —
			   duodam pirma is saraso, kad pazadas nepakibtu. */
			if ( ! $pasirinkta || ! in_array( $pasirinkta, $galimos, true ) ) {
				$pasirinkta = $galimos[0];
			}
			$reikia[ $raktas ] = $pasirinkta;
		}

		/* 2) kas jau yra */
		$yra = array();
		foreach ( $cart->get_cart() as $raktas => $eil ) {
			if ( ! self::ar_dovana( $eil ) ) { continue; }
			$yra[ $raktas ] = array(
				'tevas'  => (string) $eil['ps_dovana_tevas'],
				'preke'  => (int) $eil['product_id'],
				'kiekis' => (int) $eil['quantity'],
			);
		}

		/* 3) isimam tai, kas nebepriklauso arba pasikeite */
		foreach ( $yra as $raktas => $d ) {
			$ok = isset( $reikia[ $d['tevas'] ] ) && $reikia[ $d['tevas'] ] === $d['preke'];
			if ( ! $ok ) {
				$cart->remove_cart_item( $raktas );
				unset( $yra[ $raktas ] );
				continue;
			}
			if ( $d['kiekis'] !== 1 ) {
				/* Dovana visada viena. */
				$cart->set_quantity( $raktas, 1, false );
			}
		}

		/* 4) pridedam truktamas */
		foreach ( $reikia as $tevo_raktas => $preke ) {
			$rasta = false;
			foreach ( $yra as $d ) {
				if ( $d['tevas'] === $tevo_raktas && $d['preke'] === $preke ) { $rasta = true; break; }
			}
			if ( $rasta ) { continue; }
			$cart->add_to_cart( $preke, 1, 0, array(), array(
				'ps_dovana_tevas' => $tevo_raktas,
				'ps_dovana'       => 1,
			) );
		}

		$dirba = false;
	}

	/** Dovanos kaina krepselyje — visada 0. */
	public static function dovanos_kaina( $cart ) {
		if ( ! $cart instanceof WC_Cart ) { return; }
		foreach ( $cart->get_cart() as $raktas => $eil ) {
			if ( ! self::ar_dovana( $eil ) ) { continue; }
			$p = $eil['data'];
			if ( $p instanceof WC_Product ) { $p->set_price( 0 ); }
		}
	}

	/** Kliento pasirinkta dovana atkeliauja su vitrinos forma. */
	public static function dovana_i_krepseli( $duom, $pid ) {
		if ( ! empty( $_POST['ps_laukas_dovana'] ) ) {
			$duom['ps_laukas_dovana'] = (int) $_POST['ps_laukas_dovana'];
		}
		return $duom;
	}

	/** Dovanos eilute krepselyje: kiekis nekeiciamas, kaina — zodis. */
	public static function dovanos_kiekis( $html, $raktas, $eil ) {
		if ( ! self::ar_dovana( $eil ) ) { return $html; }
		return '1';
	}

	public static function dovanos_zyme( $kaina, $eil, $raktas ) {
		if ( ! self::ar_dovana( $eil ) ) { return $kaina; }
		return '<span class="ps-dovana-zyme">Dovana</span>';
	}

	/** Uzsakyme dovana pazymima, kad sandelininkas ir apskaita matytu, kodel 0 EUR. */
	public static function dovanos_eilute( $item, $raktas, $reiksmes, $order ) {
		if ( empty( $reiksmes['ps_dovana'] ) ) { return; }
		$item->add_meta_data( '_ps_dovana', 1, true );
		$item->add_meta_data( 'Dovana', 'taip', true );
	}

	/* ==================== LAUKO KURIMAS ==================== */

	/**
	 * Sukuria arba atnaujina lauka.
	 *
	 * $args: pav, seima, zodis, sandelis, prekes[], pakopos[], id (jei atnaujinam),
	 *        kategorijos[] (product_cat ID), aprasas
	 *
	 * Grazina array su ID ir ivykiu sarasu arba WP_Error.
	 */
	public static function issaugoti( $args ) {
		$pav      = isset( $args['pav'] ) ? sanitize_text_field( $args['pav'] ) : '';
		$prekes   = isset( $args['prekes'] ) ? array_values( array_unique( array_map( 'intval', (array) $args['prekes'] ) ) ) : array();
		$pakopos  = isset( $args['pakopos'] ) ? (array) $args['pakopos'] : array();
		$zodis    = isset( $args['zodis'] ) && $args['zodis'] === 'dezute' ? 'dezute' : 'deze';
		$seima    = isset( $args['seima'] ) ? sanitize_text_field( $args['seima'] ) : '';
		$id       = isset( $args['id'] ) ? (int) $args['id'] : 0;
		$kat      = isset( $args['kategorijos'] ) ? array_map( 'intval', (array) $args['kategorijos'] ) : array();
		$aprasas  = isset( $args['aprasas'] ) ? wp_kses_post( $args['aprasas'] ) : '';

		if ( $pav === '' ) { return new WP_Error( 'pav', 'Lauko pavadinimas butinas.' ); }
		if ( count( $prekes ) < 2 ) { return new WP_Error( 'prekes', 'Krepsyje turi buti bent 2 prekes — kitaip klientui nera is ko rinktis.' ); }
		if ( count( $prekes ) > self::MAX_KREPSYS ) {
			return new WP_Error( 'prekes', 'Krepsyje daugiausia ' . self::MAX_KREPSYS . ' prekes, gauta ' . count( $prekes ) . '.' );
		}

		/* Sandelio taisykle: vienas krepsys = vienas sandelis = viena siunta. */
		$sandeliai = array();
		foreach ( $prekes as $cid ) {
			$p = wc_get_product( $cid );
			if ( ! $p ) { return new WP_Error( 'preke', 'Prekes #' . $cid . ' nera.' ); }
			$s = strtoupper( (string) get_post_meta( $cid, '_ps_sandelis', true ) );
			$sandeliai[ $s ? $s : 'AV' ] = 1;
		}
		if ( count( $sandeliai ) > 1 ) {
			return new WP_Error( 'sandelis', 'Krepsyje kelių sandėlių prekės: ' . implode( ' + ', array_keys( $sandeliai ) )
				. '. Vienas krepšys = vienas sandėlis = viena siunta.' );
		}
		$sandelis = key( $sandeliai );

		/* Produktas */
		$prod = $id ? wc_get_product( $id ) : null;
		if ( ! $prod ) {
			$prod = new WC_Product_Mix_and_Match();
		} elseif ( $prod->get_type() !== 'mix-and-match' ) {
			return new WP_Error( 'tipas', 'Preke #' . $id . ' nera MnM konteineris.' );
		}
		$prod->set_name( $pav );
		$prod->set_status( 'publish' );
		/* Matomuma nustatom PABAIGOJE pagal iejimo taisykle — cia priverstinis
		   „visible" panaikindavo slepima ir kataloge vel atsirasdavo visos
		   grupes dezes (rasta 2026-08-15). */
		if ( $aprasas !== '' ) { $prod->set_description( $aprasas ); }
		if ( $kat ) { $prod->set_category_ids( $kat ); }

		/* Esme: kainos atskirai, be virsutines ribos. Min — per-dezes:
		   skanestams 3, konservams 6 (savininko sprendimas 2026-08-15).
		   MnM min laiko paciame produkte, papildomo meta nereikia. */
		$prod->set_priced_per_product( true );
		$min = isset( $args['min'] ) ? max( 2, (int) $args['min'] ) : (int) ( $prod->get_min_container_size() ?: self::MIN_KIEKIS );
		$prod->set_min_container_size( $min );
		$prod->set_max_container_size( 0 );
		$prod->set_discount( '' );        /* nuolaida tvarkom patys, pakopomis */
		$prod->set_manage_stock( false ); /* likutis gyvena prekese */
		$lid = $prod->save();
		if ( ! $lid ) { return new WP_Error( 'save', 'Nepavyko issaugoti konteinerio.' ); }

		update_post_meta( $lid, self::META_LAUKAS, 'yes' );
		update_post_meta( $lid, self::META_ZODIS, $zodis );
		update_post_meta( $lid, self::META_SANDELIS, $sandelis );
		update_post_meta( $lid, self::META_SEIMA, $seima );
		update_post_meta( $lid, '_ps_sandelis', $sandelis );
		update_post_meta( $lid, '_mnm_weight_cumulative', 'yes' );  /* svoris is kliento pasirinkimo */

		/* Krepsys */
		self::rasyti_krepsi( $lid, $prekes );

		/* Pakopos — po krepsio, nes apsauga skaiciuojama is jo marzu. */
		$svarios = self::svarios_pakopos( $lid, $pakopos );
		update_post_meta( $lid, self::META_PAKOPOS, wp_json_encode( $svarios['pakopos'] ) );

		/* Kataloge matomas tik grupes iejimas. */
		self::sutvarkyti_matomuma( self::grupe( $lid ) );
		wc_delete_product_transients( $lid );

		return array(
			'id'        => $lid,
			'sandelis'  => $sandelis,
			'prekiu'    => count( $prekes ),
			'pakopos'   => $svarios['pakopos'],
			'perspejimai' => $svarios['perspejimai'],
			'saugi'     => self::saugi_pakopa( $lid ),
		);
	}

	/** Krepsio irasymas: pilnas perrasymas, ne pridejimas. */
	private static function rasyti_krepsi( $lid, $prekes ) {
		global $wpdb;
		$tbl = $wpdb->prefix . 'wc_mnm_child_items';
		$wpdb->delete( $tbl, array( 'container_id' => (int) $lid ), array( '%d' ) );
		$eile = 1;
		foreach ( $prekes as $cid ) {
			$wpdb->insert( $tbl, array(
				'product_id'   => (int) $cid,
				'container_id' => (int) $lid,
				'menu_order'   => $eile++,
			), array( '%d', '%d', '%d' ) );
		}
	}

	/**
	 * Pakopu apsauga. Per gilios pakopos NETYLIAI nukerpamos iki saugios ribos,
	 * o ne atmetamos — bet apie tai grazinamas perspejimas, kad savininkas
	 * matytu, jog jo ivestas skaicius pakeistas.
	 */
	private static function svarios_pakopos( $lid, $pakopos ) {
		$saugi = self::saugi_pakopa( $lid );
		$sv = array(); $persp = array();
		foreach ( $pakopos as $p ) {
			$nuo = isset( $p['nuo'] ) ? round( (float) $p['nuo'], 2 ) : 0;
			$d   = isset( $p['d'] ) ? (float) $p['d'] : 0;
			if ( $nuo <= 0 || $d <= 0 ) { continue; }
			if ( $saugi > 0 && $d > $saugi ) {
				$persp[] = sprintf( 'Pakopa nuo %s €: %s %% per gili, sumazinta iki %s %% (krepsio riba).',
					number_format( $nuo, 2, ',', '' ), $d, $saugi );
				$d = $saugi;
			}
			$sv[] = array( 'nuo' => $nuo, 'd' => $d );
		}
		usort( $sv, function( $a, $b ) { return $a['nuo'] <=> $b['nuo']; } );
		/* Pakopos privalo augti: 30 € −2 % po 20 € −3 % butu spastai klientui. */
		$pask = 0;
		foreach ( $sv as $i => $p ) {
			if ( $p['d'] < $pask ) {
				$persp[] = sprintf( 'Pakopa nuo %s € buvo mazesne uz ankstesne — pakelta iki %s %%.',
					number_format( $p['nuo'], 2, ',', '' ), $pask );
				$sv[ $i ]['d'] = $pask;
			}
			$pask = $sv[ $i ]['d'];
		}
		return array( 'pakopos' => $sv, 'perspejimai' => $persp );
	}

	/* ==================== v1.02: VITRINA ==================== */

	/**
	 * Lauko puslapis piesiamas pats, o ne per MnM sablona: MnM rodo sarasa su
	 * kiekio laukeliais, o mums reikia dezes, kuri pildosi, ir pakopu juostos.
	 * Forma lieka MnM: laukeliai vadinasi `mnm_quantity[child_item_id]`, todel
	 * serverio pusej veikia visos jo patikros (min 3, likuciai).
	 */
	public static function vitrina_init() {
		if ( ! is_product() ) { return; }
		global $post;
		if ( ! $post || ! self::yra_laukas( $post->ID ) ) { return; }

		/* MnM sarasas ir standartine WC suvestine — salin, statom savo. */
		remove_action( 'woocommerce_mix-and-match_add_to_cart', 'woocommerce_mnm_add_to_cart', 30 );
		remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
		remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
		remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20 );
		remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40 );
		remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_title', 5 );

		/* Piesiam PRIES visa produkto sekcija: `before_single_product_summary` yra
		   Flatsome galerijos stulpelio viduje, kuri mes slepiam — blokas butu
		   DOM'e, bet nematomas ir nepaspaudziamas. */
		add_action( 'woocommerce_before_single_product', array( __CLASS__, 'vitrina' ), 20 );

		/* „Sutaupote" juosta is petshop-rinkiniu laukui netinka — ji skaiciuoja
		   nuo konteinerio kainos, kuri cia 0, todel rodo 100 %. */
		remove_action( 'woocommerce_single_product_summary', array( 'Petshop_Rinkiniai', 'sutaupote' ), 11 );
	}

	public static function vitrina_klase( $k ) {
		if ( is_product() ) {
			global $post;
			if ( $post && self::yra_laukas( $post->ID ) ) { $k[] = 'ps-laukas'; }
		}
		return $k;
	}

	/** Kiti tos pacios seimos laukai — mygtukai virsuje. */
	/**
	 * Juostoje rodom tik TOS PACIOS GRUPES rinkinius. Anksciau jungiau pagal
	 * seima („Sunims"), ir kramtalu puslapyje kabejo hipoalerginiai skanestai —
	 * klientui tai butu sokinejimas i visai kita lentyna.
	 */
	private static function seimos_laukai( $lid ) {
		$grupe = self::grupe( $lid );
		$q = new WP_Query( array(
			'post_type' => 'product', 'post_status' => 'publish', 'posts_per_page' => 20,
			'fields' => 'ids', 'orderby' => 'menu_order title', 'order' => 'ASC',
			'meta_query' => array( array( 'key' => self::META_LAUKAS, 'value' => 'yes' ) ),
		) );
		$r = array();
		foreach ( $q->posts as $id ) {
			if ( self::grupe( $id ) !== $grupe ) { continue; }
			$r[] = array(
				'id'    => (int) $id,
				'pav'   => get_post_meta( $id, '_ps_laukas_trumpas', true ) ?: get_the_title( $id ),
				'kiek'  => count( self::krepsys( $id ) ),
				'url'   => get_permalink( $id ),
				/* Dydis (800 g / 400 g / 100 g). Tuscias — laukas be dydzio lygmens
				   (skanestai, kramtalai): tada dydzio eilutes vitrina nerodo. */
				'dydis' => self::dydis( $id ),
			);
		}
		return $r;
	}

	/** Krepsio prekes su viskuo, ko reikia kortelei. */
	private static function vitrinos_prekes( $lid ) {
		$p = wc_get_product( $lid );
		if ( ! $p ) { return array(); }
		$r = array();
		foreach ( $p->get_child_items() as $ci ) {
			$pid = (int) $ci->get_product_id();
			$cp  = wc_get_product( $pid );
			if ( ! $cp ) { continue; }
			$pav = $cp->get_name();
			$zenklas = mb_strtoupper( preg_replace( '/[,;].*$/u', '', mb_substr( $pav, 0, mb_strpos( $pav . ' ', ' ' ) ) ) );
			/* Kortelese kartojasi „Skanestas sunims, …" — nukertam bendra pradzia,
			   kad liktu tik tai, kas skiria. Pilnas pavadinimas lieka perziuroje. */
			$vardas = trim( preg_replace( '/^\S+\s/u', '', $pav ) );
			$vardas = preg_replace( '/^(skanėstai|skanėstas|skanėstų)\s+(šunims|katėms|šuniukams|kačiukams)\s*,?\s*/ui', '', $vardas );
			/* Dalies tiekeju pavadinimai yra „Miamor - kremine pasta…": nukirtus
			   zenkla lieka kabantis brukšnys. */
			$vardas = preg_replace( '/^[\s\-–—:,\.]+/u', '', $vardas );
			if ( $vardas === '' ) { $vardas = trim( preg_replace( '/^\S+\s/u', '', $pav ) ); }
			$vardas = mb_strtoupper( mb_substr( $vardas, 0, 1 ) ) . mb_substr( $vardas, 1 );
			/* Konservu pavadinimai kito rasto („…: konservai šunims su X, 800 g") —
			   jiems skonio taisykle. Jei nesuveike, lieka bendroji. */
			$skonis = self::skonio_pavadinimas( $pav );
			if ( $skonis !== $pav ) { $vardas = $skonis; }
			$r[] = array(
				'cid'    => (int) $ci->get_child_item_id(),
				'pid'    => $pid,
				'pav'    => $vardas,
				'zenklas'=> $zenklas,
				'kaina'  => (float) $cp->get_price(),
				'foto'   => wp_get_attachment_image_url( $cp->get_image_id(), 'woocommerce_thumbnail' ),
				'yra'    => $cp->is_in_stock(),
				'apr'    => self::trumpas_aprasas( $cp ),
				'url'    => get_permalink( $pid ),
			);
		}
		return $r;
	}

	/** Aprasas greitai perziurai. Analitines dalys sulipdomos i viena eilute. */
	private static function trumpas_aprasas( $cp ) {
		/* PILNAS aprasas pirmas (savininko reikalavimas 08-15): prekes turi ir
		   trumpa (163 z.), ir pilna (1300–1600 z.) — perziuroje rodomas pilnas,
		   trumpas tik atsarga, kai pilno nera. */
		$t = $cp->get_description();
		if ( trim( wp_strip_all_tags( $t ) ) === '' ) { $t = $cp->get_short_description(); }
		$t = preg_replace( '#<style.*?</style>#si', '', $t );
		/* Serimo lenteles: be sito <table> suvirsta i „5 kg255 - 295 g10 kg…".
		   Langeliai skiriami bruksniu, eilutes — nauja eilute. */
		$t = preg_replace( '#</t[dh]>\s*<t[dh][^>]*>#i', ' — ', $t );
		$t = preg_replace( '#</tr>#i', "\n", $t );
		$t = preg_replace( '#</p>|<br\s*/?>#i', "\n", $t );
		/* Importuotuose aprasuose lieka HTML esybiu (&#8211; ir pan.) ir
		   sarasu simboliu — klientui tai atrodo kaip šiukšlės (pastaba 08-15). */
		$t = html_entity_decode( $t, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
		$t = preg_replace( '/^[\s\*\-•·>–—]+/mu', '', $t );
		$t = str_replace( array( '&nbsp;', "\xc2\xa0" ), ' ', $t );
		$t = preg_replace( '/(Trumpas prekės aprašymas|Prekės aprašymas|Pagrindinis aprašymas)/ui', "\n", $t );
		$t = wp_strip_all_tags( $t );
		$eil = array();
		foreach ( explode( "\n", $t ) as $x ) {
			$x = trim( preg_replace( '/\s+/u', ' ', $x ) );
			if ( $x === '' ) { continue; }
			if ( preg_match( '/^(Trumpas prekės aprašymas|Prekės aprašymas|Pagrindinis aprašymas)$/ui', $x ) ) { continue; }
			if ( $eil && preg_match( '/^[\d,.\s]+%$/u', $x ) ) { $eil[ count( $eil ) - 1 ] .= ' — ' . $x; }
			else { $eil[] = $x; }
		}
		$t = implode( "\n", $eil );
		/* Kirpimo nebera (buvo 700): perziuros langas slenka, o klientas nori
		   PILNO apraso — nukirptas atrodo kaip klaida (savininko pastaba 08-15). */
		return $t;
	}

	/** Nemokamo pristatymo riba. Vienaskaita — kalbam apie sio kliento siunta. */

	/**
	 * Dovanu duomenys vitrinai. Rodom tik tas, kurias realiai galim issiusti —
	 * dovana, kurios nera sandelyje, yra pazadas, kurio neivykdysim.
	 */
	/**
	 * Trumpas dovanos vardas kortelei. „Animonda skanėstai katėms nuo plaukų
	 * kamuoliukų - Milkies Adult Harmony Anti-Hairball, 30 g" uzima visa kortele
	 * ir griauna vaizda. Pilnas vardas lieka perziuroje.
	 */
	private static function dovanos_vardas( $pav ) {
		$t = $pav;
		$t = preg_replace( '/[,·]\s*\d+[.,]?\d*\s*(g|kg|ml|vnt\.?)\s*$/iu', '', $t );
		/* Po bruksnio paprastai eina konkretus produkto vardas. */
		if ( preg_match( '/^(.*?)\s+[-–—]\s+(.+)$/u', $t, $m ) && mb_strlen( $m[2] ) >= 3 ) { $t = $m[2]; }
		$t = preg_replace( '/\s*(katėms|šunims|kačiukams|šuniukams)\s*/ui', ' ', $t );
		$t = trim( preg_replace( '/\s+/u', ' ', $t ), " -–—,·" );
		if ( $t === '' || mb_strlen( $t ) < 3 ) { return $pav; }
		return mb_strtoupper( mb_substr( $t, 0, 1 ) ) . mb_substr( $t, 1 );
	}

	/**
	 * Kategoriju sarasas dovanu rinkikliui. Imamos TIKROS katalogo kategorijos
	 * (raktazodziu spejimas buvo klaida — „Kramtalai" grazindavo nuli), rodomos
	 * to gyvuno, kuriam dezė skirta, ir su prekiu skaiciumi.
	 */
	/**
	 * Tos pacios grupes dezes — perjungimas neiseinant is redagavimo. Vitrinoje
	 * klientas mato skirtukus, o admine tekdavo grizti i sarasa ir vel ieskoti
	 * (savininko pastaba 08-15). Rikiuojam pagal dydi, kaip vitrinoje.
	 */
	private static function grupes_juosta( $lid ) {
		$grupe = self::grupe( $lid );
		$q = new WP_Query( array(
			'post_type' => 'product', 'post_status' => array( 'publish', 'draft' ),
			'posts_per_page' => 40, 'fields' => 'ids', 'orderby' => 'title', 'order' => 'ASC',
			'meta_query' => array( array( 'key' => self::META_LAUKAS, 'value' => 'yes' ) ),
		) );
		$broliai = array();
		foreach ( $q->posts as $id ) {
			if ( self::grupe( $id ) !== $grupe ) { continue; }
			$broliai[] = array(
				'id'      => (int) $id,
				'pav'     => get_post_meta( $id, '_ps_laukas_trumpas', true ) ?: get_the_title( $id ),
				'dydis'   => self::dydis( $id ),
				'prekiu'  => count( self::krepsys( $id ) ),
				'busena'  => get_post_status( $id ),
			);
		}
		if ( count( $broliai ) < 2 ) { return; }

		$vardai = self::grupiu_vardai();
		echo '<div class="pslka-kort pslka-grjuosta"><h3>' . esc_html( $vardai[ $grupe ] ?? $grupe )
			. ' <span class="pslka-mut">' . count( $broliai ) . ' rinkiniai · spausk, kad pereitum</span></h3>';
		echo '<div class="pslka-vidus" style="padding:12px 14px">';

		/* Grupuojam pagal dydi — konservams tai duoda dvi eilutes (400/800). */
		$pagal = array();
		foreach ( $broliai as $b ) { $pagal[ $b['dydis'] ][] = $b; }
		ksort( $pagal );
		foreach ( $pagal as $dydis => $sar ) {
			echo '<div class="pslka-grow">';
			if ( $dydis !== '' ) { echo '<span class="pslka-grlab">' . esc_html( $dydis ) . '</span>'; }
			foreach ( $sar as $b ) {
				$dabar = ( $b['id'] === (int) $lid );
				echo '<a class="pslka-grbtn' . ( $dabar ? ' on' : '' ) . '" href="'
					. esc_url( self::nuoroda( array( 'id' => $b['id'] ) ) ) . '">'
					. esc_html( $b['pav'] )
					. '<small>' . (int) $b['prekiu'] . '</small>'
					. ( get_post_meta( $b['id'], self::META_IEJIMAS, true ) === 'yes'
						? '<i title="įėjimas iš kategorijos" style="color:#00a32a">▸</i>' : '' )
					. ( $b['busena'] !== 'publish' ? '<i title="juodraštis — klientas nemato">•</i>' : '' )
					. '</a>';
			}
			/* Naujas rinkinys BUTENT sitai grupei ir siam dydziui — grupe ir
			   pakuote nukeliauja per nuoroda, nereikia rinktis is naujo. */
			echo '<a class="pslka-grbtn pslka-grnaujas" href="'
				. esc_url( self::nuoroda( array( 'veiksmas' => 'naujas', 'grupe' => $grupe, 'dydis' => $dydis ) ) )
				. '" title="Naujas rinkinys šiai grupei' . ( $dydis !== '' ? ' ir pakuotei ' . esc_attr( $dydis ) : '' ) . '">＋</a>';
			echo '</div>';
		}
		echo '</div></div>';
	}

	private static function dovanu_kategoriju_sarasas( $lid ) {
		$kates = in_array( self::grupe( $lid ), array( 'kates', 'kons_kates' ), true );
		$saknis = $kates ? 77 : 70;   /* KATĖMS / ŠUNIMS */
		$terms = get_terms( array(
			'taxonomy' => 'product_cat', 'hide_empty' => true,
			'child_of' => $saknis, 'orderby' => 'count', 'order' => 'DESC',
		) );
		$h = '<select id="dov-kat"><option value="">— visos ' . ( $kates ? 'katėms' : 'šunims' ) . ' —</option>';
		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $t ) {
				/* Maistas dovana nebuna — nesiūlom to, ko niekada nepasirinks. */
				if ( preg_match( '/maistas|konservai|kraikai|tualet/ui', $t->name ) ) { continue; }
				$h .= '<option value="' . (int) $t->term_id . '">' . esc_html( $t->name ) . ' (' . (int) $t->count . ')</option>';
			}
		}
		return $h . '</select>';
	}

	private static function dovanu_duomenys( $lid ) {
		$out = array();
		foreach ( self::dovanos( $lid ) as $id ) {
			$p = wc_get_product( $id );
			if ( ! $p ) { continue; }
			$foto = wp_get_attachment_image_url( $p->get_image_id(), 'woocommerce_thumbnail' );
			$out[] = array(
				'id'    => (int) $id,
				'pav'   => self::dovanos_vardas( $p->get_name() ),
				'pilnas'=> $p->get_name(),
				'foto' => $foto ? $foto : wc_placeholder_img_src( 'woocommerce_thumbnail' ),
				'apr'  => self::trumpas_aprasas( $p ),
				'kaina'=> (float) $p->get_price(),
			);
		}
		return $out;
	}

	/**
	 * Skonio pavadinimas kortelei. Katalogo pavadinimas („Animonda GranCarno
	 * Adult Beef: konservai šunims su šviežia jautiena, 800 g") kortelei per
	 * ilgas ir nukerpamas daugtaškiu — klientas skirtumo tarp devynių
	 * „GranCarno Adult…" nemato. Kortelei reikia SKONIO; pilnas pavadinimas
	 * lieka greitoje peržiūroje.
	 * Atsargiai: jei šablonas neatpažįstamas — grąžinam pilną pavadinimą,
	 * geriau ilgas nei sugadintas.
	 */
	private static function skonio_pavadinimas( $pav ) {
		$t = $pav;
		if ( strpos( $t, ':' ) !== false ) { $t = trim( substr( $t, strpos( $t, ':' ) + 1 ) ); }
		$t = preg_replace( '/,\s*[\d.,]+\s*(g|kg|ml|l)\s*$/iu', '', $t );
		$t = preg_replace( '/^.*?(konservai|šlapias maistas)\s+(suaugusiems\s+)?(šunims|katėms|kačiukams|šuniukams)\s*(su\s+)?/iu', '', $t );
		$t = trim( $t, " \t-–—,." );
		/* Kataloge pasitaiko nukirstu pavadinimu („…Beef + Lamb: konserv") —
		   po dvitaskio lieka vien boilerplate nuolauza. Tada imam dali PRIES
		   dvitaski be zenklo zodzio: „GranCarno Adult Beef + Lamb". */
		if ( $t === '' || mb_strlen( $t ) < 3 || preg_match( '/^(konserv\w*|šlapias( maistas)?|maistas)$/iu', $t ) ) {
			if ( strpos( $pav, ':' ) !== false ) {
				$pries = trim( substr( $pav, 0, strpos( $pav, ':' ) ) );
				$pries = trim( preg_replace( '/^\S+\s+/u', '', $pries ) );
				if ( mb_strlen( $pries ) >= 3 ) { return $pries; }
			}
			return $pav;
		}
		if ( $t === $pav ) { return $pav; }
		return mb_strtoupper( mb_substr( $t, 0, 1 ) ) . mb_substr( $t, 1 );
	}

	/**
	 * Grupes iejimo deze. Pirma — rankiniu budu pazymeta; jei nepazymeta,
	 * imam pirma publish deze grupeje, kad banneris niekada neliktu tuscias.
	 * Grazina 0, jei grupeje nera nei vienos publikuotos dezes.
	 */
	/**
	 * v1.45: „RINKINIAI -> Susidek savo rinkini“ meniu punktai. Buvo irasyti URL
	 * i konkrecias TEST dezes; savininkas TEST dezes trina/kuria naujas, ir
	 * meniu tampa 404 (S1596: „konservu rinkini katems“ -> istrinta 34948).
	 * Dabar nuoroda skaiciuojama is punkto pavadinimo -> grupe -> iejimas().
	 * Jei grupeje publish dezes nera — vedam i RINKINIU kategorija, ne i 404.
	 */
	public static function meniu_nuorodos( $items ) {
		$zem = array(
			'/konserv\w*.*(šun|sun)/iu'  => 'kons_sunims',
			'/konserv\w*.*kat/iu'         => 'kons_kates',
			'/kramtal/iu'                  => 'kramtalai',
			'/skan\w*.*(šun|sun)/iu'      => 'sunys',
			'/skan\w*.*kat/iu'            => 'kates',
		);
		$kesas = array();
		foreach ( $items as $it ) {
			if ( $it->type !== 'custom' || ! preg_match( '/susid[ėe]k/iu', (string) $it->title ) ) { continue; }
			if ( strpos( (string) $it->url, '/product/' ) === false ) { continue; }
			$grupe = '';
			foreach ( $zem as $re => $g ) { if ( preg_match( $re, (string) $it->title ) ) { $grupe = $g; break; } }
			if ( $grupe === '' ) { continue; }
			if ( ! isset( $kesas[ $grupe ] ) ) { $kesas[ $grupe ] = self::iejimas( $grupe ); }
			$id = $kesas[ $grupe ];
			$it->url = $id ? get_permalink( $id ) : get_term_link( 679, 'product_cat' );
			if ( is_wp_error( $it->url ) ) { $it->url = home_url( '/kategorija/rinkiniai/' ); }
		}
		return $items;
	}

	public static function iejimas( $grupe ) {
		$q = new WP_Query( array(
			'post_type' => 'product', 'post_status' => 'publish', 'posts_per_page' => 40,
			'fields' => 'ids', 'orderby' => 'menu_order title', 'order' => 'ASC',
			'meta_query' => array( array( 'key' => self::META_LAUKAS, 'value' => 'yes' ) ),
		) );
		$pirmas = 0;
		foreach ( $q->posts as $id ) {
			if ( self::grupe( $id ) !== $grupe ) { continue; }
			if ( ! $pirmas ) { $pirmas = (int) $id; }
			if ( get_post_meta( $id, self::META_IEJIMAS, true ) === 'yes' ) { return (int) $id; }
		}
		return $pirmas;
	}

	/**
	 * Kataloge rodoma TIK iejimo deze. Kitos tos pacios grupes dezes slepiamos:
	 * klientas ieina i VIENA lauka, o poreikius ir dydzius renkasi vitrinoje
	 * (savininko sprendimas 2026-08-15). Slepiam per catalog_visibility —
	 * nuorodos veikia, tad vitrinos skirtukai nenukencia.
	 * Grazina, kiek dežiu pakeista.
	 */
	public static function sutvarkyti_matomuma( $grupe ) {
		$iej = self::iejimas( $grupe );
		$q = new WP_Query( array(
			'post_type' => 'product', 'post_status' => array( 'publish', 'draft' ),
			'posts_per_page' => 60, 'fields' => 'ids',
			'meta_query' => array( array( 'key' => self::META_LAUKAS, 'value' => 'yes' ) ),
		) );
		$keista = array();
		foreach ( $q->posts as $id ) {
			if ( self::grupe( $id ) !== $grupe ) { continue; }
			$p = wc_get_product( $id );
			if ( ! $p ) { continue; }
			$nori = ( (int) $id === (int) $iej ) ? 'visible' : 'hidden';
			if ( $p->get_catalog_visibility() !== $nori ) {
				$p->set_catalog_visibility( $nori );
				$p->save();
				$keista[] = array( (int) $id, get_the_title( $id ), $nori );
			}
		}
		return $keista;
	}

	private static function pristatymo_riba() {
		return (float) apply_filters( 'ps_laukas_pristatymo_riba', 30.0 );
	}

	public static function vitrina() {
		global $post;
		$lid = (int) $post->ID;
		$p   = wc_get_product( $lid );
		if ( ! $p ) { return; }

		$prekes  = self::vitrinos_prekes( $lid );
		$pakopos = self::pakopos( $lid );
		$zodis   = self::zodis( $lid );
		$broliai = self::seimos_laukai( $lid );
		$riba    = self::pristatymo_riba();
		$dydis   = self::dydis( $lid );
		$dovanos = self::dovanu_duomenys( $lid );
		$dovRiba = self::dovanos_riba( $lid );

		/* Kainos inkaras: kiek kainuoja „po viena kiekvieno". Klientas per 5 s
		   privalo pamatyti KAINA — tuscia deze su 0,00 EUR jos neduoda. */
		$po1 = 0.0; $po1n = 0;
		foreach ( $prekes as $pr ) { if ( $pr['yra'] ) { $po1 += $pr['kaina']; $po1n++; } }

		/* Dydzio lygmuo (konservu dezes). Jei nė vienas grupes laukas dydzio
		   neturi, si eilute nerodoma is viso — skanestu vitrina lieka kaip buvo.
		   Perjungiant dydi vedam i TA PATI poreiki, jei jis tame dydyje egzistuoja
		   (800 g monoproteino nera ir nebus — tada vedam i pirma to dydzio lauka). */
		$dydziai = array();
		foreach ( $broliai as $b ) {
			if ( $b['dydis'] === '' ) { continue; }
			if ( ! isset( $dydziai[ $b['dydis'] ] ) ) {
				$dydziai[ $b['dydis'] ] = array( 'url' => $b['url'], 'kiek' => 0 );
			}
			$dydziai[ $b['dydis'] ]['kiek']++;
			/* tas pats poreikis kitame dydyje — pirmenybe jam */
			if ( $b['pav'] === ( get_post_meta( $lid, '_ps_laukas_trumpas', true ) ?: get_the_title( $lid ) ) ) {
				$dydziai[ $b['dydis'] ]['url'] = $b['url'];
			}
		}
		/* Laukai rodomi TIK to paties dydzio — kitaip 400 g monoproteinas kabetu
		   800 g puslapyje, kur jo nera. */
		if ( $dydziai ) {
			$broliai = array_values( array_filter( $broliai, function( $b ) use ( $dydis ) {
				return $b['dydis'] === $dydis;
			} ) );
		}
		$laukelis = function_exists( 'wc_mnm_get_child_input_name' )
			? wc_mnm_get_child_input_name( $lid ) : 'mnm_quantity';

		$js = array(
			'prekes'  => $prekes,
			'pakopos' => $pakopos,
			'min'     => (int) $p->get_min_container_size(),
			'zodis'   => $zodis,
			'riba'    => $riba,
			'laukelis'=> $laukelis,
			'dovanos' => $dovanos,
			'dovRiba' => $dovRiba,
			'suDovana'=> self::su_dovana( $lid ),
		);

		self::vitrinos_stilius();
		?>
		<div class="pslk<?php echo $dydis !== '' ? ' pslk-kons' : ''; ?>">
			<h1 class="pslk-h1"><?php echo esc_html( get_the_title( $lid ) ); ?>
				<?php if ( $pakopos ) : ?><span class="pslk-pakopos">
					<?php foreach ( $pakopos as $i => $pk ) : ?>
						<?php echo $i ? '<i>·</i>' : ''; ?><b>nuo <?php echo esc_html( wc_format_decimal( $pk['nuo'], 0 ) ); ?> € −<?php echo esc_html( wc_format_decimal( $pk['d'], 0 ) ); ?> %</b>
					<?php endforeach; ?>
				</span><?php endif; ?>
			</h1>
			<?php if ( $p->get_description() ) : ?>
				<p class="pslk-ivadas"><?php echo esc_html( wp_strip_all_tags( $p->get_description() ) ); ?></p>
			<?php endif; ?>

			<?php if ( count( $dydziai ) > 1 ) : ?>
				<div class="pslk-dydis">
					<span class="pslk-det">Pakuotė</span>
					<?php foreach ( $dydziai as $d => $inf ) : ?>
						<a class="pslk-dbtn<?php echo $d === $dydis ? ' on' : ''; ?>" href="<?php echo esc_url( $inf['url'] ); ?>">
							<?php echo esc_html( $d ); ?></a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<?php if ( count( $broliai ) > 1 ) : ?>
				<div class="pslk-laukai">
					<?php foreach ( $broliai as $b ) : ?>
						<a class="pslk-lbtn<?php echo $b['id'] === $lid ? ' on' : ''; ?>" href="<?php echo esc_url( $b['url'] ); ?>">
							<?php echo esc_html( $b['pav'] ); ?><small><?php echo (int) $b['kiek']; ?></small></a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<form class="pslk-tinkl" method="post" enctype="multipart/form-data"
				action="<?php echo esc_url( $p->get_permalink() ); ?>" id="pslk-forma">
				<?php /* Vitrina yra dvieju stulpeliu tinklelis (korteles | deze). Viskas,
				         kas priklauso kairei pusei, privalo buti VIENAME grid elemente —
				         kitaip juosta uzima kaire kolona, korteles nustumia i desine,
				         o deze iskrenta zemyn uz ekrano. */ ?>
				<div class="pslk-kaire">
				<div class="pslk-visi">
					<span>Nežinai, nuo ko pradėti? Imk <b>po vieną kiekvieno skonio</b> — visi jau atrinkti.</span>
					<button type="button" id="pslk-visi"><?php echo (int) $po1n; ?> skoniai · <?php echo esc_html( number_format( $po1, 2, ',', '' ) ); ?> €</button>
				</div>
				<div class="pslk-korteles">
					<?php foreach ( $prekes as $pr ) : ?>
						<div class="pslk-kort<?php echo $pr['yra'] ? '' : ' nera'; ?>" id="pslk-k-<?php echo (int) $pr['cid']; ?>">
							<span class="pslk-zym"><?php echo esc_html( mb_strtoupper( $zodis['v'] === 'dėžė' ? 'Dėžėje' : 'Dėžutėje' ) ); ?></span>
							<div class="pslk-f" data-cid="<?php echo (int) $pr['cid']; ?>">
								<?php if ( $pr['foto'] ) : ?><img src="<?php echo esc_url( $pr['foto'] ); ?>" alt="" loading="lazy"><?php endif; ?>
							</div>
							<span class="pslk-b"><?php echo esc_html( $pr['zenklas'] ); ?></span>
							<span class="pslk-p" data-cid="<?php echo (int) $pr['cid']; ?>"><?php echo esc_html( $pr['pav'] ); ?></span>
							<span class="pslk-apie" data-cid="<?php echo (int) $pr['cid']; ?>">Apie prekę ›</span>
							<span class="pslk-kaina"><?php echo wp_kses_post( wc_price( $pr['kaina'] ) ); ?><small>/ vnt.</small></span>
							<?php if ( $pr['yra'] ) : ?>
								<button type="button" class="pslk-deti" data-cid="<?php echo (int) $pr['cid']; ?>">Į <?php echo esc_html( $zodis['k'] ); ?></button>
								<div class="pslk-stp">
									<button type="button" data-cid="<?php echo (int) $pr['cid']; ?>" data-d="-1" aria-label="Mažiau">−</button>
									<b>0</b>
									<button type="button" data-cid="<?php echo (int) $pr['cid']; ?>" data-d="1" aria-label="Daugiau">+</button>
								</div>
							<?php else : ?>
								<span class="pslk-nera">Šiuo metu neturime</span>
							<?php endif; ?>
							<?php /* MnM POST skaito pagal PREKES ID, ne krepsio eilutes ID — patikrinta
							         gyvai: su cid meta „Product #521 does not exist". */ ?>
							<input type="hidden" name="<?php echo esc_attr( $laukelis ); ?>[<?php echo (int) $pr['pid']; ?>]"
								value="0" id="pslk-in-<?php echo (int) $pr['cid']; ?>">
						</div>
					<?php endforeach; ?>
				</div>
				</div>

				<aside class="pslk-sonas">
					<div class="pslk-deze">
						<div class="pslk-deze-v"><h3>Tavo <?php echo esc_html( $zodis['v'] ); ?></h3><span id="pslk-kiek">tuščia</span></div>
						<div class="pslk-deze-vid">
							<div class="pslk-grid" id="pslk-grid"></div>
							<div class="pslk-zinia" id="pslk-zinia"></div>
						</div>
						<?php if ( $dovanos ) : ?>
							<div class="pslk-dov" id="pslk-dov">
								<div class="pslk-dov-a"><span>Dovana</span><span class="bl" id="pslk-dov-bl"></span></div>
								<div class="pslk-dovs">
									<?php foreach ( $dovanos as $i => $g ) : ?>
										<div class="pslk-dovk<?php echo $i === 0 ? ' pas' : ''; ?>" data-gid="<?php echo (int) $g['id']; ?>">
											<?php /* Nuotrauka atidaro perziura, korteles kunas — renka dovana.
											         Buvo suplakta i viena: atrakinus dovana perziura tapdavo
											         nepasiekiama, nors klientas kaip tik tada ir nori pamatyti,
											         ka renkasi. Rasta testuojant, ne teoriskai. */ ?>
											<img src="<?php echo esc_url( $g['foto'] ); ?>" alt="" loading="lazy"
												class="pslk-dov-f" data-gid="<?php echo (int) $g['id']; ?>">
											<span class="pv"><?php echo esc_html( $g['pav'] ); ?></span>
											<span class="pslk-dov-apie" data-gid="<?php echo (int) $g['id']; ?>">Apie ›</span>
										</div>
									<?php endforeach; ?>
								</div>
							</div>
							<input type="hidden" name="ps_laukas_dovana" id="pslk-dov-in"
								value="<?php echo (int) $dovanos[0]['id']; ?>">
						<?php endif; ?>
						<?php if ( $dovanos ) : ?>
							<?php /* Du tikslai — dvi atskiros korteles su savo progresu.
							         Viena juosta su dviem brukšneliais kliento nekabina:
							         zenklai susispaudzia, o „dar liko X" nesimato (08-15). */ ?>
							<div class="pslk-eiga"><div class="pslk-tikslai">
								<?php /* Vektoriniai zenkliukai, ne emoji: emoji kiekvienoje sistemoje
								         piesiami kitaip (Android/iOS/Windows) ir atrodo kaip lipdukai
								         salia tvarkingos tipografijos (savininko pastaba 08-15).
								         currentColor — zenkliukas seka korteles busenos spalva. */ ?>
								<div class="pslk-tk" id="pslk-tk-pr">
									<div class="v"><span class="ik"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/></svg></span><span class="tx">Nemokamas pristatymas į paštomatą</span><span class="liko"></span></div>
									<div class="jt"><i></i></div>
								</div>
								<div class="pslk-tk dov" id="pslk-tk-dov">
									<div class="v"><span class="ik"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11h16v9H4z"/><path d="M3 7.5h18V11H3z"/><path d="M12 7.5V20"/><path d="M12 7.5S10.8 4 8.8 4a2 2 0 000 3.5H12zm0 0s1.2-3.5 3.2-3.5a2 2 0 010 3.5H12z"/></svg></span><span class="tx">Dovana — rinkis vieną iš <?php echo count( $dovanos ); ?></span><span class="liko"></span></div>
									<div class="jt"><i></i></div>
								</div>
							</div></div>
						<?php else : ?>
							<div class="pslk-eiga">
								<div class="pslk-eiga-e"><div id="pslk-dbr"></div><div class="pslk-kita" id="pslk-kita"></div></div>
								<div class="pslk-juosta" id="pslk-juosta"><i id="pslk-fill"></i></div>
							</div>
						<?php endif; ?>
						<div class="pslk-sumos">
							<div class="pslk-eil"><span>Suma</span><span class="r" id="pslk-suma">0,00 €</span></div>
							<div class="pslk-eil" id="pslk-neil" style="display:none"><span>Nuolaida <span id="pslk-np"></span></span><span class="r pslk-n" id="pslk-nuol"></span></div>
							<div class="pslk-eil pslk-moki"><span>Mokėsi</span>
								<span><span class="pslk-sena" id="pslk-sena" style="display:none"></span><span class="pslk-viso" id="pslk-viso">0,00 €</span></span></div>
							<div class="pslk-uzvnt" id="pslk-uzvnt"></div>
							<input type="hidden" name="add-to-cart" value="<?php echo (int) $lid; ?>">
							<button type="submit" class="pslk-cta" id="pslk-cta" disabled>Įdėk bent <?php echo (int) $p->get_min_container_size(); ?></button>
							<div class="pslk-po" id="pslk-po">Nemokamas pristatymas į paštomatą nuo <?php echo esc_html( wc_format_decimal( $riba, 0 ) ); ?> €</div>
						</div>
					</div>
				</aside>
			</form>
		</div>

		<div class="pslk-pz-fonas" id="pslk-pz"><div class="pslk-pz-l" role="dialog" aria-modal="true">
			<button class="pslk-pz-x" type="button" aria-label="Uždaryti">×</button>
			<div class="pslk-pz-v">
				<div class="pslk-pz-f" id="pslk-pz-f"></div>
				<div>
					<div class="pslk-b" id="pslk-pz-b"></div>
					<div class="pslk-pz-pav" id="pslk-pz-pav"></div>
					<div class="pslk-pz-kaina" id="pslk-pz-kaina"></div>
					<div class="pslk-pz-apr" id="pslk-pz-apr"></div>
					<div class="pslk-pz-v2">
						<button type="button" class="pslk-deti" id="pslk-pz-deti">Į <?php echo esc_html( $zodis['k'] ); ?></button>
						<div class="pslk-stp" id="pslk-pz-stp">
							<button type="button" data-d="-1" aria-label="Mažiau">−</button><b>0</b><button type="button" data-d="1" aria-label="Daugiau">+</button>
						</div>
					</div>
				</div>
			</div>
		</div></div>

		<script>
		window.PSLK = <?php echo wp_json_encode( $js ); ?>;
		</script>
		<?php
		self::vitrinos_js();
	}


	/** Vitrinos stilius. Tie patys dydziai ir spalvos, kaip patvirtintame makete. */
	private static function vitrinos_stilius() {
		?>
		<style id="pslk-stilius">
		.ps-laukas .product-main, .ps-laukas .product-footer,
		.ps-laukas .related, .ps-laukas .product-page-sections { display:none !important; }
		.pslk{--z:#0F6E56;--zt:#0B5443;--zf:#EAF3EF;--kraft:#EFE7D8;--kraft2:#E4D8C2;--kraft3:#D9CBB0;
			max-width:1220px;margin:0 auto;padding:4px 0 60px;color:#2B2B2B;
			font-family:Inter,"Segoe UI",Arial,sans-serif;font-size:15px;line-height:1.5}
		.pslk *{box-sizing:border-box}
		.pslk-h1{font-size:29px;font-weight:800;margin:0 0 6px;letter-spacing:-.01em;color:#1e1e1e}
		.pslk-pakopos{display:inline-block;vertical-align:middle;font-size:13px;font-weight:800;color:#C7891C;
			background:#FBF3E2;border:1px solid #EBD9B4;border-radius:20px;padding:5px 14px;margin-left:12px}
		.pslk-pakopos i{font-style:normal;opacity:.45;margin:0 4px}
		.pslk-ivadas{color:#6b6b6b;margin:6px 0 18px;max-width:66ch}
		/* Dydzio eilute — virs poreikiu. Kvadratiniai mygtukai, kad butu
		   matomas skirtumas nuo apvaliu poreikio mygtuku. */
		.pslk-dydis{display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
		.pslk-det{font-size:11px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#9a9a9a;margin-right:2px}
		.pslk-dbtn{border:2px solid #E6E6E3;background:#fff;border-radius:10px;padding:9px 20px;
			font-weight:800;font-size:14.5px;color:#555;text-decoration:none}
		.pslk-dbtn:hover{border-color:#BFCEC8;color:#555}
		.pslk-dbtn.on{border-color:var(--z);background:var(--z);color:#fff}
		/* „Po 1 vnt. visu" — atsakymas i tuscia deze: vienu paspaudimu pilna. */
		.pslk-visi{display:flex;align-items:center;gap:12px;background:var(--zf);border:1px solid #BFCEC8;
			border-radius:10px;padding:11px 14px;margin-bottom:14px;font-size:13.5px;color:var(--zt)}
		.pslk-visi button{margin-left:auto;border:0;background:var(--z);color:#fff;font-weight:800;
			font-size:13.5px;letter-spacing:.02em;border-radius:9px;padding:12px 18px;cursor:pointer;white-space:nowrap;
			box-shadow:0 3px 10px rgba(15,110,86,.25)}
		.pslk-visi button:hover{background:var(--zt)}
		.pslk-visi button::before{content:'+ ';font-weight:800}
		@media(max-width:560px){.pslk-visi{flex-direction:column;align-items:stretch;text-align:center}
			.pslk-visi button{margin-left:0}}
		/* Dovanos: matomos nuo pirmos sekundes kaip tikslas, atrakinamos pasiekus suma. */
		.pslk-dov{border-top:1px solid #EFEAE0;padding:15px 18px}
		.pslk-dov-a{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;font-size:12.5px;font-weight:800;letter-spacing:.05em;
			text-transform:uppercase;color:#C7891C;margin-bottom:10px}
		.pslk-dov-a .bl{margin-left:auto;font-size:11.5px;font-weight:700;color:#8a7a5c;text-transform:none;letter-spacing:0;white-space:nowrap}
		.pslk-dovs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
		.pslk-dovk{border:2px solid #E6E6E3;border-radius:10px;padding:8px 5px 7px;text-align:center;
			background:#FAFAF8;opacity:.55;position:relative;cursor:default}
		.pslk-dovk img{max-width:44px;max-height:44px;object-fit:contain;display:block;margin:0 auto 3px}
		.pslk-dovk .pv{font-size:10.5px;font-weight:700;line-height:1.25;color:#555;
			display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.5em}
		.pslk-dovk img{cursor:pointer}
		.pslk-dov-apie{display:block;margin-top:4px;font-size:10px;font-weight:700;color:var(--z);cursor:pointer}
		.pslk-dov-apie:hover{text-decoration:underline}
		/* Viena dovana siaurame stulpelyje atrodo kaip klaida — istempiam gulsčiai. */
		.pslk-dovk:only-child{grid-column:1/-1;display:flex;align-items:center;gap:12px;text-align:left;padding:10px 12px}
		.pslk-dovk:only-child img{margin:0;max-width:52px;max-height:52px}
		.pslk-dovk:only-child .pv{font-size:12px}
		.pslk-dovk:only-child .pslk-dov-apie{margin:0 0 0 auto;font-size:11px;white-space:nowrap}
		.pslk-dov.atrakinta .pslk-dovk{cursor:pointer;opacity:1;background:#fff}
		.pslk-dov.atrakinta .pslk-dovk:hover{border-color:#C7891C}
		.pslk-dov.atrakinta .pslk-dovk.pas{border-color:#C7891C;background:#FBF3E2}
		.pslk-dov.atrakinta .pslk-dovk.pas::after{content:'✓';position:absolute;top:-8px;right:-8px;width:20px;height:20px;
			border-radius:50%;background:#C7891C;color:#fff;font-size:12px;font-weight:800;display:grid;place-items:center}
		.pslk-laukai{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:18px}
		.pslk-lbtn{border:2px solid #E6E6E3;background:#fff;border-radius:24px;padding:9px 18px;
			font-weight:700;font-size:13.5px;color:#555;text-decoration:none;display:inline-block}
		.pslk-lbtn:hover{border-color:#BFCEC8;color:#555}
		.pslk-lbtn.on{border-color:var(--z);background:var(--z);color:#fff}
		.pslk-lbtn small{font-weight:400;opacity:.75;margin-left:5px}
		.pslk-tinkl{display:grid;grid-template-columns:minmax(0,1fr) 350px;gap:30px;align-items:start}
		@media(max-width:960px){.pslk-tinkl{grid-template-columns:1fr;gap:18px}}
		.pslk-kaire{min-width:0}
		/* Konservu dezems (dydis nustatytas) — 4 stulpeliai ir mazesne foto:
		   12 skoniu po 3 stulpelius istempia puslapi per tris ekranus.
		   Skanestu vitrina (be dydzio) lieka kaip patvirtinta. */
		.pslk-kons .pslk-korteles{grid-template-columns:repeat(4,1fr);gap:12px}
		@media(max-width:1100px){.pslk-kons .pslk-korteles{grid-template-columns:repeat(3,1fr)}}
		@media(max-width:760px){.pslk-kons .pslk-korteles{grid-template-columns:repeat(2,1fr)}}
		.pslk-kons .pslk-f{height:112px}
		.pslk-kons .pslk-f img{max-width:104px;max-height:104px}
		.pslk-kons .pslk-kort{padding:11px 11px 10px}
		.pslk-kons .pslk-p{font-size:12.5px;min-height:2.6em}
		.pslk-kons .pslk-kaina{font-size:15px;margin-bottom:8px}
		.pslk-korteles{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
		@media(max-width:760px){.pslk-korteles{grid-template-columns:repeat(2,1fr);gap:10px}}
		@media(max-width:420px){.pslk-korteles{grid-template-columns:1fr}}
		.pslk-kort{border:2px solid #E6E6E3;border-radius:12px;background:#fff;padding:14px 14px 12px;
			display:flex;flex-direction:column;position:relative;transition:box-shadow .15s,border-color .15s}
		.pslk-kort:hover{box-shadow:0 6px 18px rgba(0,0,0,.08)}
		.pslk-kort.turi{border-color:var(--z)}
		.pslk-kort.nera{opacity:.55}
		.pslk-zym{position:absolute;top:10px;left:10px;background:var(--z);color:#fff;font-size:11.5px;
			font-weight:800;border-radius:12px;padding:2px 9px;display:none;z-index:2}
		.pslk-kort.turi .pslk-zym{display:block}
		.pslk-f{height:148px;display:grid;place-items:center;margin-bottom:10px;cursor:pointer}
		.pslk-f img{max-width:140px;max-height:140px;object-fit:contain;width:auto;height:auto}
		.pslk-b{font-size:10.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#9a9a9a}
		.pslk-p{font-size:13.5px;font-weight:700;line-height:1.35;margin:3px 0 4px;color:#222;cursor:pointer;
			min-height:2.7em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
		.pslk-p:hover{color:var(--z)}
		.pslk-apie{font-size:12px;font-weight:700;color:var(--z);cursor:pointer;margin-bottom:8px}
		.pslk-apie:hover{text-decoration:underline}
		.pslk-kaina{font-size:16px;font-weight:800;color:#1e1e1e;margin-bottom:10px}
		.pslk-kaina small{font-size:11.5px;font-weight:400;color:#9a9a9a;margin-left:4px}
		.pslk-kaina .amount{font-weight:800}
		.pslk-deti{border:2px solid var(--z);border-radius:8px;background:#fff;color:var(--z);font-weight:800;
			font-size:13px;letter-spacing:.03em;padding:10px;text-transform:uppercase;cursor:pointer;width:100%}
		.pslk-deti:hover{background:var(--zf)}
		.pslk-stp{display:none;align-items:stretch;border:2px solid var(--z);border-radius:8px;overflow:hidden;background:#fff}
		.pslk-stp button{flex:1;border:0;background:#fff;font-size:20px;font-weight:700;color:var(--z);padding:7px 0;cursor:pointer}
		.pslk-stp button:hover{background:var(--zf)}
		.pslk-stp b{min-width:44px;display:grid;place-items:center;font-size:15px;background:var(--zf);color:var(--zt)}
		.pslk-kort.turi .pslk-deti{display:none}
		.pslk-kort.turi .pslk-stp{display:flex}
		.pslk-nera{font-size:12.5px;color:#b32d2e;font-weight:700;text-align:center;padding:9px 0}
		.pslk-sonas{position:sticky;top:14px}
		@media(max-width:960px){.pslk-sonas{position:static}}
		.pslk-deze{border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.10);border:1px solid var(--kraft3);background:#fff}
		.pslk-deze-v{background:linear-gradient(180deg,var(--kraft2),var(--kraft));padding:13px 18px 11px;
			border-bottom:1px solid var(--kraft3);display:flex;align-items:baseline;gap:10px}
		.pslk-deze-v h3{margin:0;font-size:14.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#5c4d33}
		.pslk-deze-v span{margin-left:auto;font-size:12.5px;font-weight:700;color:#8a7a5c}
		.pslk-deze-vid{background:linear-gradient(180deg,rgba(0,0,0,.035),rgba(0,0,0,0) 14px),var(--kraft);padding:16px 18px 18px;min-height:110px}
		.pslk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
		.pslk-el{position:relative;background:#fff;border-radius:9px;border:1px solid var(--kraft3);height:64px;
			display:grid;place-items:center;box-shadow:0 2px 4px rgba(0,0,0,.06)}
		.pslk-el img{max-width:52px;max-height:52px;object-fit:contain}
		.pslk-el{cursor:pointer}
		.pslk-el:hover{border-color:#b32d2e}
		.pslk-el:hover::after{content:'−1';position:absolute;inset:0;display:grid;place-items:center;
			background:rgba(255,255,255,.86);border-radius:9px;font-weight:800;color:#b32d2e;font-size:15px}
		.pslk-el.dov{border:2px solid #C7891C;background:#FBF3E2;cursor:default}
		.pslk-el.dov:hover{border-color:#C7891C}
		.pslk-el.dov:hover::after{display:none}
		.pslk-el u{position:absolute;top:-7px;right:-7px;min-width:21px;height:21px;border-radius:11px;background:var(--z);
			color:#fff;font-size:11.5px;font-weight:800;display:grid;place-items:center;padding:0 5px;text-decoration:none}
		.pslk-tuscia{border:2px dashed #CBBD9F;border-radius:9px;height:64px;display:grid;place-items:center;color:#B3A483;font-weight:800;font-size:14px}
		.pslk-zinia{font-size:12.5px;color:#8a7a5c;margin-top:12px;text-align:center}
		.pslk-eiga{padding:15px 18px 6px;border-top:1px solid #EFEAE0}
		.pslk-tikslai{display:flex;flex-direction:column;gap:10px;padding-bottom:9px}
		.pslk-tk{border:1.5px solid #EFEAE0;border-radius:10px;padding:10px 12px 11px;transition:background .25s,border-color .25s}
		.pslk-tk .v{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;color:#4c4c4c;line-height:1.3}
		.pslk-tk .ik{flex:none;width:19px;height:19px;color:#9a9a9a;display:grid;place-items:center}
		.pslk-tk .ik svg{width:19px;height:19px;display:block}
		.pslk-tk.gauta .ik{color:var(--z)}
		.pslk-tk.dov.gauta .ik{color:#C7891C}
		.pslk-tk .liko{margin-left:auto;font-weight:800;color:var(--zt);white-space:nowrap;font-size:12.5px}
		.pslk-tk .jt{height:6px;background:#EDEDE9;border-radius:4px;margin-top:8px;overflow:hidden}
		.pslk-tk .jt i{display:block;height:100%;background:linear-gradient(90deg,var(--z),#199A76);width:0;transition:width .35s cubic-bezier(.4,0,.2,1)}
		.pslk-tk.dov .jt i{background:linear-gradient(90deg,#C7891C,#E0A83A)}
		.pslk-tk.gauta{background:var(--zf);border-color:#BFCEC8}
		.pslk-tk.gauta .v,.pslk-tk.gauta .liko{color:var(--zt)}
		.pslk-tk.dov.gauta{background:#FBF3E2;border-color:#EBD9B4}
		.pslk-tk.dov.gauta .v,.pslk-tk.dov.gauta .liko{color:#8a6a1c}
		.pslk-tk.gauta .jt{display:none}
		.pslk-eiga-e{display:flex;align-items:baseline;gap:8px;margin-bottom:9px;flex-wrap:wrap;font-size:14.5px;font-weight:800;color:var(--zt)}
		.pslk-eiga-e b{font-size:18px}
		.pslk-kita{margin-left:auto;font-size:12.5px;color:#666;text-align:right;font-weight:400}
		.pslk-kita b{color:var(--zt);font-weight:800}
		.pslk-juosta{position:relative;height:9px;background:#EDEDE9;border-radius:5px;margin:0 0 22px}
		.pslk-juosta i{display:block;height:100%;background:linear-gradient(90deg,var(--z),#199A76);border-radius:5px;width:0;transition:width .35s cubic-bezier(.4,0,.2,1)}
		.pslk-zyme{position:absolute;top:-3px;transform:translateX(-50%)}
		.pslk-zyme u{display:block;width:3px;height:15px;background:#D6D6D1;border-radius:2px;text-decoration:none}
		.pslk-zyme.pas u{background:var(--zt)}
		.pslk-zyme s{position:absolute;top:17px;left:50%;transform:translateX(-50%);font-size:11px;color:#9a9a9a;
			text-decoration:none;white-space:nowrap;font-weight:700;letter-spacing:.02em}
		.pslk-zyme.pas s{color:var(--zt)}
		.pslk-sumos{padding:4px 18px 18px}
		.pslk-eil{display:flex;justify-content:space-between;font-size:13.5px;padding:6px 0;border-top:1px solid #F1F1EE}
		.pslk-eil:first-child{border-top:0}
		.pslk-eil .r{font-weight:700}
		.pslk-n{color:var(--zt);font-weight:800}
		.pslk-moki{align-items:baseline;padding-top:10px}
		.pslk-viso{font-size:26px;font-weight:800;color:#1e1e1e}
		.pslk-sena{font-size:14px;color:#9a9a9a;text-decoration:line-through;margin-right:7px}
		.pslk-uzvnt{font-size:11.5px;color:#9a9a9a;text-align:right;margin-top:-4px}
		.pslk-cta{display:block;width:100%;margin-top:13px;border:0;border-radius:9px;background:var(--z);color:#fff;
			font-weight:800;font-size:14px;text-transform:uppercase;letter-spacing:.05em;padding:15px;cursor:pointer}
		.pslk-cta:hover{background:var(--zt)}
		.pslk-cta:disabled{background:#E7E4DB;color:#A6A292;cursor:default}
		.pslk-po{font-size:11.5px;color:#9a9a9a;text-align:center;margin-top:9px}
		.pslk-po b{color:var(--zt)}
		.pslk-pz-fonas{position:fixed;inset:0;background:rgba(20,24,22,.55);z-index:2000;display:none;
			align-items:center;justify-content:center;padding:18px}
		.pslk-pz-fonas.rodo{display:flex}
		.pslk-pz-l{background:#fff;border-radius:16px;max-width:760px;width:100%;max-height:88vh;overflow:auto;
			position:relative;box-shadow:0 24px 70px rgba(0,0,0,.30);
			font-family:Inter,"Segoe UI",Arial,sans-serif;color:#2B2B2B}
		.pslk-pz-x{position:absolute;top:12px;right:12px;width:38px;height:38px;border:0;border-radius:50%;
			background:#F2F2EF;font-size:19px;color:#555;z-index:2;cursor:pointer}
		.pslk-pz-v{display:grid;grid-template-columns:290px 1fr;gap:26px;padding:28px}
		@media(max-width:640px){.pslk-pz-v{grid-template-columns:1fr;gap:14px;padding:20px}}
		/* align-self:start — be jo fotolangas issitempia per visa teksto auksti
		   (1500 px), o centruota nuotrauka atsiduria puslapio viduryje: atidarius
		   matai tuscia pilka plota (savininko pastaba 08-15). sticky — nuotrauka
		   lieka matoma slenkant aprasyma. */
		.pslk-pz-f{display:grid;place-items:center;background:#FAFAF8;border-radius:12px;padding:18px;
			min-height:250px;align-self:start;position:sticky;top:0}
		.pslk-pz-f img{max-width:100%;max-height:260px;object-fit:contain}
		.pslk-pz-pav{font-size:19px;font-weight:800;line-height:1.3;margin:4px 0 10px}
		.pslk-pz-kaina{font-size:21px;font-weight:800;margin-bottom:14px}
		.pslk-pz-apr b{display:block;margin-top:12px;color:#2B2B2B;font-size:13px;letter-spacing:.02em}
		.pslk-pz-apr b:first-child{margin-top:0}
		.pslk-pz-apr{font-size:13.5px;color:#4c4c4c;line-height:1.6;white-space:pre-line;
			border-top:1px solid #F0F0ED;padding-top:13px;margin-bottom:18px}
		.pslk-pz-v2{display:flex;gap:10px}
		.pslk-pz-v2 .pslk-deti{flex:1}
		.pslk-pz-v2 .pslk-stp{flex:1}
		.pslk-pz-v2.turi .pslk-deti{display:none}
		.pslk-pz-v2.turi .pslk-stp{display:flex}
		</style>
		<?php
	}

	/** Vitrinos JS. Kiekiai gyvena paslėptuose input'uose — juos ir siunčia forma. */
	private static function vitrinos_js() {
		?>
		<script id="pslk-js">
		(function(){
			var D=window.PSLK; if(!D) return;
			var sel={}, pz=null;
			var pagalCid={}; D.prekes.forEach(function(p){ pagalCid[p.cid]=p; });
			var dovanos=D.dovanos||[], dovPagal={};
			dovanos.forEach(function(g){ dovPagal[g.id]=g; });
			var dovPas=dovanos.length?dovanos[0].id:0;
			function dovAtrakinta(s){ return D.suDovana && dovanos.length && s+0.0001>=D.dovRiba; }
			function eur(n){ return n.toFixed(2).replace('.',',')+' €'; }
			/* Tiekejo aprasymas — vientisa mase. Eilute, kuri baigiasi dvitaskiu
			   ir nera per ilga („Sudėtis:", „Analitinė sudėtis:", „Trumpa apžvalga:"),
			   yra antraste — paryskinam ir atskiriam tarpu. Tekstas escapinamas,
			   nes is textContent pereinam i innerHTML. */
			function aprHtml(t){
				if(!t) return 'Aprašymas ruošiamas.';
				var esc=t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
				return esc.split('\n').map(function(e){
					var ee=e.trim();
					/* Antraste visa eilute („Trumpa apžvalga:") */
					if(ee.length>1 && ee.length<70 && ee.slice(-1)===':'){ return '<b>'+ee+'</b>'; }
					/* Tiekejo rastas: etikete ir turinys vienoje eiluteje
					   („Sudėtis: 68% jautiena…") — etikete iskeliame i antraste. */
					var m=ee.match(/^([A-ZĄČĘĖĮŠŲŪŽ][^:.!?]{1,38}):\s+(.+)$/);
					if(m){ return '<b>'+m[1]+':</b>'+m[2]; }
					return ee;
				}).join('\n');
			}
			function vnt(){ var s=0; for(var k in sel) s+=sel[k]; return s; }
			function suma(){ var s=0; for(var k in sel){ var p=pagalCid[k]; if(p) s+=p.kaina*sel[k]; } return s; }
			function pakopa(s){ var d=0,kita=null;
				D.pakopos.forEach(function(p){ if(s+0.0001>=p.nuo){ d=p.d; } else if(!kita){ kita=p; } });
				return {d:d,kita:kita}; }

			function keisk(cid,delta){
				var n=(sel[cid]||0)+delta; if(n<0) return;
				if(!n){ delete sel[cid]; } else { sel[cid]=n; }
				var in_=document.getElementById('pslk-in-'+cid); if(in_) in_.value=n||0;
				var k=document.getElementById('pslk-k-'+cid);
				if(k){ k.classList.toggle('turi',n>0); var b=k.querySelector('.pslk-stp b'); if(b) b.textContent=n||0; }
				if(pz===cid){ pzAtnaujink(); }
				atnaujink();
			}

			function atnaujink(){
				var s=suma(), n=vnt(), r=pakopa(s), d=r.d;
				var nuolEur=s*d/100, moka=s-nuolEur;
				var virs=D.pakopos.length?D.pakopos[D.pakopos.length-1]:null;

				/* deze */
				var g=document.getElementById('pslk-grid'), h='';
				var yra=Object.keys(sel);
				if(yra.length){
					yra.forEach(function(cid){ var p=pagalCid[cid];
						h+='<div class="pslk-el" data-cid="'+cid+'" title="Paspaudus — vienu mažiau">'
						 +(p&&p.foto?'<img src="'+p.foto+'" alt="">':'')
						 +(sel[cid]>1?'<u>×'+sel[cid]+'</u>':'')+'</div>'; });
				} else {
					for(var i=1;i<=D.min;i++) h+='<div class="pslk-tuscia">'+i+'</div>';
				}
				/* Dovana krenta i deze tik tada, kai riba pasiekta — kitaip klientas
				   matytu daikta, kurio dar neuzsidirbo. */
				if(dovAtrakinta(s)){ var gg=dovPagal[dovPas];
					if(gg){ h+='<div class="pslk-el dov" title="Dovana"><img src="'+gg.foto+'" alt=""></div>'; } }
				g.innerHTML=h;
				var dovB=document.getElementById('pslk-dov');
				if(dovB){
					var atr=dovAtrakinta(s);
					dovB.classList.toggle('atrakinta',atr);
					document.getElementById('pslk-dov-bl').textContent = atr ? 'rinkis vieną' : ('nuo '+eur(D.dovRiba));
					Array.prototype.forEach.call(dovB.querySelectorAll('.pslk-dovk'),function(k){
						k.classList.toggle('pas', +k.dataset.gid===dovPas); });
					var din=document.getElementById('pslk-dov-in'); if(din) din.value=atr?dovPas:'';
				}
				document.getElementById('pslk-kiek').textContent=n?n+' vnt.':'tuščia';
				document.getElementById('pslk-zinia').textContent=yra.length?'':'Įdėk bent '+D.min+' — vienodus ar skirtingus.';

				/* eiga */
				if(D.suDovana){
					/* Du tikslai — dvi korteles su savo progresu ir „dar liko".
					   dbr/kita/juostos kons rezime DOM'e NERA — ju neliesti. */
					function tikslas(id,riba,gautaTxt){
						var el=document.getElementById(id); if(!el) return;
						var gauta = s+0.0001>=riba;
						el.classList.toggle('gauta',gauta);
						el.querySelector('.liko').textContent = gauta ? '✓' : 'dar '+eur(riba-s);
						if(gauta){ el.querySelector('.tx').textContent = gautaTxt; }
						else { el.querySelector('.jt i').style.width = Math.min(100, s/riba*100)+'%'; }
					}
					tikslas('pslk-tk-pr', D.riba, 'Pristatymas į paštomatą — nemokamas');
					tikslas('pslk-tk-dov', D.dovRiba, 'Dovana tavo — rinkis vieną');
				}
				else { var dbr=document.getElementById('pslk-dbr'), kita=document.getElementById('pslk-kita');
				if(d>0){ dbr.innerHTML='Turi <b>−'+d+' %</b> · sutaupai '+eur(nuolEur); }
				else if(D.pakopos.length){ dbr.innerHTML='Nuolaida nuo '+eur(D.pakopos[0].nuo); }
				else { dbr.textContent=''; }
				if(r.kita){ kita.innerHTML='Dar <b>'+eur(r.kita.nuo-s)+'</b> ir visai '+D.zodis.n+' <b>−'+r.kita.d+' %</b>'; }
				else if(d>0){ kita.innerHTML='Didžiausia nuolaida jau tavo'; }
				else { kita.innerHTML=''; }

				if(!D.suDovana){
				var max=virs?virs.nuo*1.12:1;
				/* pastaba: sis blokas dabar gyvena else-sakoje virsuje pradetoje */
				document.getElementById('pslk-fill').style.width=Math.min(100,s/max*100)+'%';
				var j=document.getElementById('pslk-juosta');
				Array.prototype.forEach.call(j.querySelectorAll('.pslk-zyme'),function(x){ x.remove(); });
				D.pakopos.forEach(function(p){
					var el=document.createElement('span');
					el.className='pslk-zyme'+(s>=p.nuo?' pas':'');
					el.style.left=Math.min(97,p.nuo/max*100)+'%';
					el.innerHTML='<u></u><s>'+p.nuo+' €</s>';
					j.appendChild(el);
				});
				}
				}

				/* sumos */
				document.getElementById('pslk-suma').textContent=eur(s);
				document.getElementById('pslk-neil').style.display=d>0?'flex':'none';
				document.getElementById('pslk-np').textContent='−'+d+' %';
				document.getElementById('pslk-nuol').textContent='−'+eur(nuolEur);
				document.getElementById('pslk-sena').style.display=d>0?'inline':'none';
				document.getElementById('pslk-sena').textContent=eur(s);
				document.getElementById('pslk-viso').textContent=eur(moka);
				document.getElementById('pslk-uzvnt').textContent=(n>=D.min&&d>0)?'≈ '+eur(moka/n)+' už vienetą':'';

				var c=document.getElementById('pslk-cta');
				if(n>=D.min){ c.disabled=false; c.textContent='Įsidėti į krepšelį'; }
				else { var tr=D.min-n; c.disabled=true; c.textContent='Įdėk dar '+tr; }
				document.getElementById('pslk-po').innerHTML = D.suDovana ? ''
					: ((moka>0&&moka<D.riba)
					? 'Dar <b>'+eur(D.riba-moka)+'</b> iki nemokamo pristatymo į paštomatą'
					: 'Nemokamas pristatymas į paštomatą nuo '+D.riba.toFixed(0)+' €');
			}

			/* greita perziura */
			function perziura(cid){
				var p=pagalCid[cid]; if(!p) return;
				pz=cid;
				document.getElementById('pslk-pz-f').innerHTML=p.foto?'<img src="'+p.foto+'" alt="">':'';
				document.getElementById('pslk-pz-b').textContent=p.zenklas;
				document.getElementById('pslk-pz-pav').textContent=p.pav;
				document.getElementById('pslk-pz-kaina').innerHTML=eur(p.kaina)+' <small style="font-size:12px;font-weight:400;color:#9a9a9a">/ vnt.</small>';
				document.getElementById('pslk-pz-apr').innerHTML=aprHtml(p.apr);
				pzAtnaujink();
				document.getElementById('pslk-pz').classList.add('rodo');
				document.body.style.overflow='hidden';
			}
			/* Dovanos perziura — tas pats langas kaip prekems (savininko reikalavimas).
			   Skirtumas vienas: kiekio mygtuku nera, nes dovana visada viena. */
			function dovPerziura(gid){
				var g=dovPagal[gid]; if(!g) return;
				pz=null;
				document.getElementById('pslk-pz-f').innerHTML='<img src="'+g.foto+'" alt="">';
				document.getElementById('pslk-pz-b').textContent='Dovana';
				document.getElementById('pslk-pz-pav').textContent=g.pilnas||g.pav;
				document.getElementById('pslk-pz-kaina').innerHTML='<span style="color:#C7891C">Nemokamai nuo '+eur(D.dovRiba)+'</span>';
				document.getElementById('pslk-pz-apr').innerHTML=aprHtml(g.apr);
				document.querySelector('.pslk-pz-v2').style.display='none';
				document.getElementById('pslk-pz').classList.add('rodo');
				document.body.style.overflow='hidden';
			}
			function uzdaryk(){ document.getElementById('pslk-pz').classList.remove('rodo'); document.body.style.overflow='';
				var v2=document.querySelector('.pslk-pz-v2'); if(v2) v2.style.display=''; pz=null; }
			function pzAtnaujink(){
				if(pz===null) return;
				var n=sel[pz]||0;
				document.querySelector('.pslk-pz-v2').classList.toggle('turi',n>0);
				document.querySelector('#pslk-pz-stp b').textContent=n;
			}

			document.addEventListener('click',function(e){
				var t=e.target;
				var deti=t.closest ? t.closest('.pslk-deti') : null;
				if(deti){ e.preventDefault();
					var cid=deti.dataset.cid ? +deti.dataset.cid : pz;
					if(cid) keisk(cid,1); return; }
				var stp=t.closest ? t.closest('.pslk-stp button') : null;
				if(stp){ e.preventDefault();
					var cid2=stp.dataset.cid ? +stp.dataset.cid : pz;
					if(cid2) keisk(cid2, +stp.dataset.d); return; }
				/* Langelis dezeje — vienu maziau. Paspaudimas nuima VIENA, ne visus:
				   ×3 langelis klientui reiskia tris vienetus, tad lukestis — kad
				   sumazetu vienetu. Nuemus per daug tektu grizti i kaire puse. */
				var el2=t.closest ? t.closest('.pslk-el') : null;
				if(el2 && !el2.classList.contains('dov') && el2.dataset.cid){
					e.preventDefault(); keisk(+el2.dataset.cid,-1); return; }
				var visi=t.closest ? t.closest('#pslk-visi') : null;
				if(visi){ e.preventDefault();
					D.prekes.forEach(function(p){ if(p.yra) keisk(p.cid,1); }); return; }
				/* Dovanos kortele: ATRAKINTA — bet koks paspaudimas RENKA (iskaitant
				   nuotrauka: realus peles paspaudimas beveik visada pataiko i ja),
				   perziura tik per „Apie ›". UZRAKINTA — bet koks paspaudimas rodo
				   perziura. Buvo atvirksciai (nuotrauka=perziura) — testas prasileido,
				   nes evaluate().click() apeina vaikus; realus klientas pakeisti
				   dovanos negalejo. */
				var dovA=t.closest ? t.closest('.pslk-dov-apie') : null;
				if(dovA){ e.preventDefault(); dovPerziura(+dovA.dataset.gid); return; }
				var dk=t.closest ? t.closest('.pslk-dovk') : null;
				if(dk){ e.preventDefault();
					var db=document.getElementById('pslk-dov');
					if(db && db.classList.contains('atrakinta')){ dovPas=+dk.dataset.gid; atnaujink(); }
					else { dovPerziura(+dk.dataset.gid); }
					return; }
				var ap=t.closest ? t.closest('.pslk-apie, .pslk-f, .pslk-p') : null;
				if(ap && ap.dataset.cid){ e.preventDefault(); perziura(+ap.dataset.cid); return; }
				if(t.closest && t.closest('.pslk-pz-x')){ uzdaryk(); return; }
				if(t.id==='pslk-pz'){ uzdaryk(); }
			});
			document.addEventListener('keydown',function(e){ if(e.key==='Escape') uzdaryk(); });

			atnaujink();
		})();
		</script>
		<?php
	}

	/* ==================== v1.07: ADMIN PANELE ==================== */

	public static function meniu() {
		/* 22, kad atsidurtu is karto po „Rinkiniai" (jie registruojami ties 20). */
		add_submenu_page(
			'ps-katalogas', 'Surenkami rinkiniai', 'Surenkami rinkiniai', 'manage_woocommerce',
			'ps-laukai', array( __CLASS__, 'puslapis' )
		);
	}

	public static function puslapis() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Neturite teisių.' ); }
		wp_enqueue_media();   /* nuotrauku rinkimui reikia WP medijos lango */
		self::admin_stilius();
		echo '<script>window.PSLKA_NONCE=' . wp_json_encode( wp_create_nonce( 'ps_laukai' ) ) . ';</script>';
		$id = isset( $_GET['id'] ) ? (int) $_GET['id'] : 0;
		$veiksmas = isset( $_GET['veiksmas'] ) ? sanitize_key( $_GET['veiksmas'] ) : '';
		echo '<div class="wrap pslka">';
		self::skirtukai();
		if ( $veiksmas === 'naujas' ) { self::admin_naujas(); }
		elseif ( $id ) { self::admin_laukas( $id ); }
		else { self::admin_sarasas(); }
		echo '</div>';
	}

	/**
	 * Tie patys skirtukai kaip Rinkiniuose — kad zmogus nejaustu, jog persoko
	 * i kita sistema. Kaire nuoroda veda atgal i petshop-rinkinius.
	 */
	private static function skirtukai() {
		$r = admin_url( 'admin.php?page=ps-rinkiniai' );
		echo '<h1 class="wp-heading-inline">Rinkiniai</h1>';
		echo '<p class="description">Paruošti rinkiniai ir pakai — prekės su savo kortele. '
			. 'Surenkami — rinkiniai, kurių turinį susideda klientas.</p>';
		echo '<div class="pslka-skirtukai">'
			. '<a href="' . esc_url( $r ) . '">Paruošti rinkiniai</a>'
			. '<a class="on" href="' . esc_url( self::nuoroda() ) . '">Surenkami rinkiniai</a>'
			. '</div>';
	}

	private static function nuoroda( $args = array() ) {
		return add_query_arg( array_merge( array( 'page' => 'ps-laukai' ), $args ), admin_url( 'admin.php' ) );
	}

	/* ---------- SARASAS ---------- */

	/**
	 * Sarasas su filtrais. Mechanika ta pati kaip Rinkiniuose: serveris paduoda
	 * visus laukus vienu kartu, filtravimas vyksta narsykleje — kiekvienas
	 * paspaudimas neperkrauna puslapio. Prie keliu desimciu laukų to uztenka.
	 */
	private static function admin_sarasas() {
		$laukai = self::visi();
		$duom = array();
		foreach ( $laukai as $l ) {
			$max = 0;
			foreach ( $l['pakopos'] as $p ) { $max = max( $max, $p['d'] ); }
			$duom[] = array(
				'id'      => $l['id'],
				'pav'     => $l['pav'],
				'trumpas' => get_post_meta( $l['id'], '_ps_laukas_trumpas', true ),
				'grupe'   => self::grupe( $l['id'] ),
				'seima'   => $l['seima'],
				'st'      => get_post_status( $l['id'] ),
				'prekiu'  => $l['prekiu'],
				'kainos'  => $l['kainos'],
				'marzos'  => $l['marzos'],
				'saugi'   => $l['saugi'],
				'giliausia' => $max,
				'pakopos' => $l['pakopos'],
				'sand'    => strtoupper( (string) $l['sandelis'] ),
				'be_sav'  => $l['be_savikainos'],
				'nera'    => $l['neturime'],
				'foto'    => self::grupes_foto( $l['id'] ),
				'nuoroda' => self::nuoroda( array( 'id' => $l['id'] ) ),
				'perziura'=> get_permalink( $l['id'] ),
			);
		}

		echo '<h2 class="pslka-antraste">Surenkami rinkiniai '
			. '<a class="page-title-action" href="' . esc_url( self::nuoroda( array( 'veiksmas' => 'naujas' ) ) ) . '">➕ Sukurti rinkinį</a></h2>';
		echo '<p class="description">Klientas susideda pats: iki ' . self::MAX_KREPSYS . ' prekių iš vieno sandėlio, '
			. 'laisvas kiekis nuo ' . self::MIN_KIEKIS . ' vnt. ir nuolaida pakopomis pagal krepšelio sumą.</p>';

		self::grupiu_foto_blokas();
		echo '<div id="pslka-eiles" class="pslka-eiles"></div>';
		echo '<div id="pslka-filtrai" class="pslka-filtrai-blk"></div>';
		echo '<div class="pslka-virsus"><span class="pslka-mut" id="pslka-rodoma"></span><span class="pslka-sp"></span>'
			. '<span class="pslka-f"><label>Rikiuoti</label><select id="pslka-sort">'
			. '<option value="grupe">Grupė</option><option value="pav">Pavadinimas</option>'
			. '<option value="marza">Marža</option><option value="saugi">Saugi nuolaida</option>'
			. '<option value="prekiu">Prekių krepšyje</option></select></span></div>';
		echo '<div id="pslka-turinys"></div>';
		echo '<div id="pslka-stat" class="pslka-stat"></div>';

		self::sarasas_js( $duom );
		self::rinkiklio_js( 0 );   /* grupiu nuotrauku mygtukams */
	}

	/**
	 * Grupe = lango skirstymas: skanestai sunims, skanestai katems, kramtalai.
	 * Imama is krepsio prekiu kategoriju, ne rasoma ranka — kitaip savininkas
	 * turetu prizieti dar viena lauka, kuris gali nesutapti su tikrove.
	 */
	public static function grupe( $lid ) {
		$rankinis = get_post_meta( $lid, '_ps_laukas_grupe', true );
		if ( $rankinis ) {
			/* Meta gali buti irasyta ne raktu, o grupes VARDU (taip nutiko kuriant
			   testines dezes per koda). Filtrai lygina raktus, tad vardas duotu
			   tuscia sarasa. Priimam abu — ir grazinam rakta. */
			$vardai = self::grupiu_vardai();
			if ( isset( $vardai[ $rankinis ] ) ) { return $rankinis; }
			foreach ( $vardai as $rakt => $vard ) {
				if ( self::sulyginti( $vard ) === self::sulyginti( $rankinis ) ) { return $rakt; }
			}
			return $rankinis;
		}

		/* Pirma — pats rinkinys: jo pavadinimas ir kategorijos. Kramtalai guli
		   „Skanestu sunims" kategorijoje, todel is vien krepsio prekiu ju
		   atskirti neimanoma — rinkinys pats pasako, kas jis toks. */
		$savo = get_the_title( $lid ) . ' ' . implode( ' ',
			(array) wp_get_post_terms( $lid, 'product_cat', array( 'fields' => 'names' ) ) );
		if ( preg_match( '/kramt/iu', $savo ) ) { return 'kramtalai'; }
		if ( preg_match( '/kat[ėe]/iu', $savo ) ) { return 'kates'; }

		$kramtalas = false; $kates = false; $sunys = false;
		foreach ( self::krepsys( $lid ) as $cid ) {
			$kat = wp_get_post_terms( $cid, 'product_cat', array( 'fields' => 'names' ) );
			foreach ( (array) $kat as $k ) {
				if ( preg_match( '/kramt/iu', $k ) ) { $kramtalas = true; }
				if ( preg_match( '/kat[ėe]ms/iu', $k ) ) { $kates = true; }
				if ( preg_match( '/šunims|sunims/iu', $k ) ) { $sunys = true; }
			}
			$pav = get_the_title( $cid );
			if ( preg_match( '/kramt/iu', $pav ) ) { $kramtalas = true; }
			if ( preg_match( '/kat[ėe]ms/iu', $pav ) ) { $kates = true; }
			if ( preg_match( '/šunims|sunims/iu', $pav ) ) { $sunys = true; }
		}
		if ( $kramtalas ) { return 'kramtalai'; }
		if ( $kates && ! $sunys ) { return 'kates'; }
		return 'sunys';
	}

	public static function grupiu_vardai() {
		return array(
			'sunys'      => 'Skanėstai šunims',
			'kates'      => 'Skanėstai katėms',
			'kramtalai'  => 'Kramtalai',
			/* Konservu dezes — atskiros grupes, nes vitrinoje jos jungiamos
			   i dydzio + poreikio eilutes ir su skanestais nesimaiso. */
			'kons_sunims' => 'Konservai šunims',
			'kons_kates'  => 'Konservai katėms',
		);
	}

	/** Palyginimui: be diakritiku, mazosiomis — „Konservai sunims" = „Konservai šunims". */
	private static function sulyginti( $t ) {
		$t = mb_strtolower( trim( (string) $t ) );
		return strtr( $t, array( 'ą'=>'a','č'=>'c','ę'=>'e','ė'=>'e','į'=>'i','š'=>'s','ų'=>'u','ū'=>'u','ž'=>'z' ) );
	}

	/**
	 * Kortelės nuotrauka sarase (v1.43): sava → grupes → pirmos krepsio prekes.
	 * Anksciau rode vien pirma krepsio preke, todel savininkas sarase nematydavo
	 * tos nuotraukos, kuria ka tik priskyre grupei.
	 */
	private static function grupes_foto( $lid ) {
		$fid = self::foto_id( $lid );
		if ( $fid ) {
			$u = wp_get_attachment_image_url( $fid, 'thumbnail' );
			if ( $u ) { return $u; }
		}
		foreach ( self::krepsys( $lid ) as $cid ) {
			$p = wc_get_product( $cid );
			if ( ! $p ) { continue; }
			$u = wp_get_attachment_image_url( $p->get_image_id(), 'thumbnail' );
			if ( $u ) { return $u; }
		}
		return '';
	}

	private static function sarasas_js( $duom ) {
		?>
		<script>
		(function(){
			var R=<?php echo wp_json_encode( $duom ); ?>;
			var GRUPES=<?php echo wp_json_encode( self::grupiu_vardai() ); ?>;
			var f={eile:'',grupe:'',bus:'',sand:'',marza:'',q:''};
			var sort='grupe';
			function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){
				return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
			function eur(n){ return Number(n).toFixed(2).replace('.',',')+' €'; }

			var EILES=[
				['', 'Visi rinkiniai', function(){ return true; }, '', 'Visi surenkami rinkiniai.'],
				['gilu','Nuolaida per gili', function(x){ return x.saugi>0 && x.giliausia>x.saugi; }, 'r',
					'Pakopa gilesnė, nei krepšys atlaiko — po nuolaidos silpniausios prekės marža nukristų per žemai.'],
				['bepak','Be pakopų', function(x){ return !x.pakopos.length; }, 'y',
					'Klientas nuolaidos negaus — rinkinys veiks kaip paprastas sąrašas.'],
				['nepilnas','Krepšys nepilnas', function(x){ return x.prekiu<<?php echo (int) self::MAX_KREPSYS; ?>; }, 'y',
					'Vitrinoje lieka tuščios vietos.'],
				['bedos','Prekių bėdos', function(x){ return x.be_sav>0 || x.nera>0; }, 'y',
					'Krepšyje yra prekių be savikainos arba tokių, kurių neturime.'],
				['juodr','Juodraščiai', function(x){ return x.st!=='publish'; }, 'b',
					'Klientas jų dar nemato.']
			];

			function filtruoti(){
				var e=EILES.filter(function(x){ return x[0]===f.eile; })[0];
				return R.filter(function(x){
					if(e && !e[2](x)) return false;
					if(f.grupe && x.grupe!==f.grupe) return false;
					if(f.bus && x.st!==f.bus) return false;
					if(f.sand && x.sand!==f.sand.toUpperCase()) return false;
					if(f.marza){
						var m=x.marzos?x.marzos[0]:null;
						if(m===null) { if(f.marza!=='nezinoma') return false; }
						else if(f.marza==='zema' && m>=25) return false;
						else if(f.marza==='vid' && (m<25||m>35)) return false;
						else if(f.marza==='auksta' && m<=35) return false;
						else if(f.marza==='nezinoma') return false;
					}
					if(f.q){
						var q=f.q.toLowerCase();
						if(String(x.pav).toLowerCase().indexOf(q)<0 && String(x.trumpas||'').toLowerCase().indexOf(q)<0) return false;
					}
					return true;
				});
			}

			function grupe(laukas,reiksmes){
				return '<span class="pslka-grupe">'+reiksmes.map(function(t){
					return '<button class="'+(f[laukas]===t[0]?'on':'')+(t[2]===0?' tuscia':'')+'"'
						+' data-l="'+laukas+'" data-v="'+t[0]+'">'+esc(t[1])
						+(t[2]?' <i>'+t[2]+'</i>':'')+'</button>';
				}).join('')+'</span>';
			}

			function pieskEiles(){
				document.getElementById('pslka-eiles').innerHTML=EILES.map(function(e){
					var n=R.filter(e[2]).length;
					return '<button class="pslka-e '+(e[3]||'')+(f.eile===e[0]?' on':'')+'" data-e="'+e[0]+'" title="'+esc(e[4])+'">'
						+'<b>'+n+'</b><span>'+esc(e[1])+'</span></button>';
				}).join('');
				document.querySelectorAll('#pslka-eiles .pslka-e').forEach(function(b){
					b.onclick=function(){ f.eile=(f.eile===this.dataset.e)?'':this.dataset.e; pieszti(); };
				});
			}

			function pieskFiltrus(){
				var gsk={};
				R.forEach(function(x){ gsk[x.grupe]=(gsk[x.grupe]||0)+1; });
				var gg=[['','Visos']];
				Object.keys(GRUPES).forEach(function(k){ gg.push([k,GRUPES[k],gsk[k]||0]); });
				var h='<div class="pslka-frow">';
				h+='<span class="pslka-f"><label>Grupė</label>'+grupe('grupe',gg)+'</span>';
				h+='<span class="pslka-f"><label>Būsena</label>'+grupe('bus',[['','Visos'],['publish','Prekyboje'],['draft','Juodraščiai']])+'</span>';
				h+='<span class="pslka-f"><label>Sandėlis</label>'+grupe('sand',[['','Visi'],['av','AV'],['vf','VF'],['zb','ZB']])+'</span>';
				h+='</div><div class="pslka-frow">';
				h+='<span class="pslka-f"><label>Marža</label><select data-l="marza">'
					+[['','— bet kokia —'],['zema','žemiau 25 %'],['vid','25–35 %'],['auksta','virš 35 %'],['nezinoma','nežinoma']]
						.map(function(m){ return '<option value="'+m[0]+'"'+(f.marza===m[0]?' selected':'')+'>'+m[1]+'</option>'; }).join('')
					+'</select></span>';
				h+='<span class="pslka-f pslka-plati"><label>Paieška</label>'
					+'<input type="text" id="pslka-q" value="'+esc(f.q)+'" placeholder="rinkinio pavadinimas…"></span>';
				h+='</div>';
				var akt=[];
				if(f.grupe) akt.push(['Grupė: '+(GRUPES[f.grupe]||f.grupe),'grupe']);
				if(f.bus) akt.push(['Būsena: '+(f.bus==='publish'?'Prekyboje':'Juodraščiai'),'bus']);
				if(f.sand) akt.push(['Sandėlis: '+f.sand.toUpperCase(),'sand']);
				if(f.marza) akt.push(['Marža: '+f.marza,'marza']);
				if(f.q) akt.push(['Paieška: '+f.q,'q']);
				if(akt.length) h+='<div class="pslka-aktyvus"><span class="pslka-mut">Filtrai:</span>'
					+akt.map(function(a){ return '<span class="pslka-chip">'+esc(a[0])+'<button data-x="'+a[1]+'">✕</button></span>'; }).join('')
					+'<button class="button button-small" id="pslka-isvalyti">Išvalyti visus</button></div>';
				document.getElementById('pslka-filtrai').innerHTML=h;

				document.querySelectorAll('#pslka-filtrai .pslka-grupe button').forEach(function(b){
					b.onclick=function(){ f[this.dataset.l]=this.dataset.v; pieszti(); };
				});
				document.querySelectorAll('#pslka-filtrai select[data-l]').forEach(function(s){
					s.onchange=function(){ f[this.dataset.l]=this.value; pieszti(); };
				});
				document.querySelectorAll('#pslka-filtrai .pslka-chip button').forEach(function(b){
					b.onclick=function(){ f[this.dataset.x]=''; pieszti(); };
				});
				var iv=document.getElementById('pslka-isvalyti');
				if(iv) iv.onclick=function(){ f={eile:f.eile,grupe:'',bus:'',sand:'',marza:'',q:''}; pieszti(); };
				var qi=document.getElementById('pslka-q');
				if(qi){ qi.oninput=function(){ f.q=this.value; pieszti(); };
					if(f.q){ qi.focus(); qi.setSelectionRange(qi.value.length,qi.value.length); } }
			}

			function kortele(x){
				var gilu = x.saugi>0 && x.giliausia>x.saugi;
				var h='<a class="pslka-kortele" href="'+x.nuoroda+'">';
				h+='<div class="pslka-kfoto">'+(x.foto?'<img src="'+x.foto+'">':'<span class="pslka-mut">be nuotraukos</span>')+'</div>';
				h+='<div class="pslka-kbody"><b>'+esc(x.pav)+'</b>';
				h+='<div class="pslka-met">'+x.prekiu+' prekės'
					+(x.kainos?' · '+eur(x.kainos[0])+'–'+eur(x.kainos[1]):'')
					+(x.marzos?' · marža '+x.marzos[0]+'–'+x.marzos[1]+' %':'')+'</div>';
				h+='<div>'+(x.pakopos.length
					? x.pakopos.map(function(p){ return '<span class="pslka-z '+(gilu&&p.d>x.saugi?'r':'b')+'">'+p.nuo+' € −'+p.d+' %</span>'; }).join('')
					: '<span class="pslka-z y">pakopų nėra</span>')+'</div>';
				h+='<div style="margin-top:6px">';
				if(x.st!=='publish') h+='<span class="pslka-z b">juodraštis · klientas nemato</span>';
				if(gilu) h+='<span class="pslka-z r">nuolaida per gili</span>';
				else if(x.st==='publish' && !x.be_sav && !x.nera && x.pakopos.length) h+='<span class="pslka-z g">sutvarkyta</span>';
				if(x.prekiu<<?php echo (int) self::MAX_KREPSYS; ?>) h+='<span class="pslka-z y">vietos dar '+(<?php echo (int) self::MAX_KREPSYS; ?>-x.prekiu)+'</span>';
				if(x.be_sav) h+='<span class="pslka-z y">'+x.be_sav+' be savikainos</span>';
				if(x.nera) h+='<span class="pslka-z r">'+x.nera+' neturime</span>';
				h+='<span class="pslka-z b">'+esc(x.sand)+'</span>';
				h+='</div></div></a>';
				return h;
			}

			function pieszti(){
				pieskEiles(); pieskFiltrus();
				var sar=filtruoti();
				sar.sort(function(a,b){
					if(sort==='pav') return a.pav.localeCompare(b.pav,'lt');
					if(sort==='marza') return (b.marzos?b.marzos[0]:0)-(a.marzos?a.marzos[0]:0);
					if(sort==='saugi') return b.saugi-a.saugi;
					if(sort==='prekiu') return b.prekiu-a.prekiu;
					var ga=Object.keys(GRUPES).indexOf(a.grupe), gb=Object.keys(GRUPES).indexOf(b.grupe);
					return ga===gb ? a.pav.localeCompare(b.pav,'lt') : ga-gb;
				});
				document.getElementById('pslka-rodoma').textContent='Rodoma '+sar.length+' iš '+R.length;

				var t=document.getElementById('pslka-turinys');
				if(!sar.length){ t.innerHTML='<div class="pslka-kort"><div class="pslka-vidus pslka-tuscia">'
					+(R.length?'Pagal šiuos filtrus nieko nėra. Atlaisvink filtrus.':'Surenkamų rinkinių dar nėra. Spausk „Sukurti rinkinį“.')
					+'</div></div>'; return; }

				var h='';
				if(sort==='grupe'){
					Object.keys(GRUPES).forEach(function(g){
						var dalis=sar.filter(function(x){ return x.grupe===g; });
						if(!dalis.length) return;
						h+='<h2 class="pslka-seima">'+esc(GRUPES[g])+' <span>'+dalis.length+'</span></h2>';
						h+='<div class="pslka-tinkl">'+dalis.map(kortele).join('')+'</div>';
					});
				} else {
					h='<div class="pslka-tinkl">'+sar.map(kortele).join('')+'</div>';
				}
				t.innerHTML=h;
			}

			document.getElementById('pslka-sort').onchange=function(){ sort=this.value; pieszti(); };
			pieszti();
		})();
		</script>
		<?php
	}

	/* ---------- NAUJAS ---------- */

	private static function admin_naujas() {
		echo '<h1>Naujas surenkamas rinkinys</h1>';
		echo '<p class="description">Pirma duok pavadinimą ir šeimą — prekes ir pakopas sudėsi kitame žingsnyje.</p>';
		echo '<div class="pslka-kort" style="max-width:640px"><div class="pslka-vidus">';
		echo '<div class="pslka-laukas"><label>Pavadinimas <span>matys klientas</span></label>'
			. '<input type="text" id="n-pav" placeholder="Skanėstų dėžė šuniui — be vištienos"></div>';
		echo '<div class="pslka-laukas"><label>Trumpas pavadinimas <span>mygtukui vitrinoje</span></label>'
			. '<input type="text" id="n-trumpas" placeholder="Be vištienos"></div>';
		/* Grupe ir pakuote gali ateiti is nuorodos — spaudziant „＋" konkrecioje
		   grupes/dydzio eiluteje jos jau parinktos (savininko pastaba 08-15). */
		$is_url_grupe = isset( $_GET['grupe'] ) ? sanitize_key( $_GET['grupe'] ) : '';
		$is_url_dydis = isset( $_GET['dydis'] ) ? sanitize_text_field( wp_unslash( $_GET['dydis'] ) ) : '';
		echo '<div class="pslka-laukas"><label>Grupė <span>kartu rodomi vitrinoje ir sąraše</span></label><select id="n-seima">';
		foreach ( self::grupiu_vardai() as $gk => $gv ) {
			echo '<option value="' . esc_attr( $gk ) . '"' . selected( $is_url_grupe, $gk, false ) . '>' . esc_html( $gv ) . '</option>';
		}
		echo '</select></div>';
		echo '<div class="pslka-laukas"><label>Pakuotė <span>konservams: 400 g, 800 g, 100 g; skanėstams palik tuščią</span></label>'
			. '<input type="text" id="n-dydis" list="n-dydziai" value="' . esc_attr( $is_url_dydis ) . '" placeholder="pvz. 400 g">'
			. '<datalist id="n-dydziai"><option value="400 g"><option value="800 g"><option value="100 g"><option value="85 g"></datalist></div>';
		echo '<div class="pslka-laukas"><label>Kaip vadinti</label>'
			. '<select id="n-zodis"><option value="deze">dėžė</option><option value="dezute">dėžutė</option></select></div>';
		echo '<div class="pslka-laukas"><label>Aprašymas</label><textarea id="n-aprasas" rows="3"></textarea></div>';
		echo '<p><button class="button button-primary" id="n-kurti">Sukurti ir dėti prekes</button> '
			. '<a class="button" href="' . esc_url( self::nuoroda() ) . '">Atgal</a></p>';
		echo '</div></div>';
		self::admin_js( 0 );
	}

	/* ---------- VIENAS LAUKAS ---------- */

	private static function admin_laukas( $lid ) {
		$p = wc_get_product( $lid );
		if ( ! $p || ! self::yra_laukas( $lid ) ) {
			echo '<div class="notice notice-error"><p>Toks laukas nerastas.</p></div>'; return;
		}
		$pakopos = self::pakopos( $lid );
		$saugi   = self::saugi_pakopa( $lid );
		$kr      = self::krepsys( $lid );
		$zodis   = get_post_meta( $lid, self::META_ZODIS, true ) ?: 'deze';

		$busena = get_post_status( $lid );
		$kliutys = self::publikavimo_kliutys( $lid );

		echo '<div class="pslka-galva">';
		echo '<a class="button" href="' . esc_url( self::nuoroda() ) . '">← Surenkami rinkiniai</a> ';
		echo '<b style="font-size:15px">' . esc_html( get_the_title( $lid ) ) . '</b> ';
		echo '<span class="pslka-z b">#' . (int) $lid . '</span> ';
		echo $busena === 'publish'
			? '<span class="pslka-z g" id="b-zyme">prekyboje · klientas mato</span>'
			: '<span class="pslka-z y" id="b-zyme">juodraštis · klientas nemato</span>';
		echo '<span class="pslka-sp"></span>';
		echo '<a class="button" target="_blank" href="' . esc_url( get_permalink( $lid ) ) . '">Peržiūrėti parduotuvėje</a> ';
		echo '<button class="button pslka-trinti-btn" id="b-trinti">Ištrinti</button> ';
		if ( $busena === 'publish' ) {
			echo '<button class="button" id="b-jungiklis" data-i="juodrastis">Grąžinti į juodraštį</button>';
		} else {
			echo '<button class="button button-primary" id="b-jungiklis" data-i="publish"'
				. ( $kliutys ? ' disabled title="' . esc_attr( implode( ' ', $kliutys ) ) . '"' : '' )
				. '>Publikuoti</button>';
		}
		echo '</div>';
		if ( $busena !== 'publish' && $kliutys ) {
			echo '<div class="pslka-kliutys"><b>Publikuoti dar negalima</b>';
			foreach ( $kliutys as $k ) { echo '<span>' . esc_html( $k ) . '</span>'; }
			echo '</div>';
		}

		self::grupes_juosta( $lid );

		/* --- nustatymai --- */
		echo '<div class="pslka-kort"><h3>Nustatymai</h3><div class="pslka-vidus pslka-du">';
		echo '<div class="pslka-laukas"><label>Pavadinimas</label><input type="text" id="s-pav" value="' . esc_attr( get_the_title( $lid ) ) . '"></div>';
		echo '<div class="pslka-laukas"><label>Trumpas <span>mygtukui</span></label><input type="text" id="s-trumpas" value="'
			. esc_attr( get_post_meta( $lid, '_ps_laukas_trumpas', true ) ) . '"></div>';
		$dab_grupe = get_post_meta( $lid, '_ps_laukas_grupe', true ) ?: self::grupe( $lid );
		echo '<div class="pslka-laukas"><label>Grupė <span>kartu rodomi vitrinoje</span></label><select id="s-seima">';
		foreach ( self::grupiu_vardai() as $gk => $gv ) {
			echo '<option value="' . esc_attr( $gk ) . '"' . selected( $dab_grupe, $gk, false ) . '>' . esc_html( $gv ) . '</option>';
		}
		echo '</select></div>';
		echo '<div class="pslka-laukas"><label>Kaip vadinti</label><select id="s-zodis">'
			. '<option value="deze"' . selected( $zodis, 'deze', false ) . '>dėžė</option>'
			. '<option value="dezute"' . selected( $zodis, 'dezute', false ) . '>dėžutė</option></select></div>';
		/* Pakuotes dydis — tik konservu dezems. Tuscias = dydzio eilutes vitrinoje
		   nera (skanestai ir kramtalai jos neturi ir neturetu). */
		$dab_dydis = (string) get_post_meta( $lid, self::META_DYDIS, true );
		echo '<div class="pslka-laukas"><label>Pakuotė <span>konservams; tuščia — eilutės nerodom</span></label>'
			. '<input type="text" id="s-dydis" list="s-dydziai" value="' . esc_attr( $dab_dydis ) . '" placeholder="pvz. 800 g">'
			. '<datalist id="s-dydziai"><option value="400 g"><option value="800 g"><option value="100 g"><option value="85 g"></datalist></div>';
		echo '<div class="pslka-laukas"><label>Mažiausias kiekis <span>vnt. dėžėje</span></label>'
			. '<input type="number" id="s-min" min="2" max="24" value="' . (int) $p->get_min_container_size() . '"></div>';
		/* Iejimas: kategorijos banneris veda BUTENT i sia deze; dydzius ir
		   poreikius klientas renkasi jau viduje. Vienas grupei. */
		$dab_iej = get_post_meta( $lid, self::META_IEJIMAS, true ) === 'yes';
		$kito_iej = self::iejimas( self::grupe( $lid ) );
		echo '<div class="pslka-laukas" style="grid-column:1/-1"><label>Įėjimas iš kategorijos</label>'
			. '<label style="font-weight:400;display:flex;align-items:center;gap:8px">'
			. '<input type="checkbox" id="s-iejimas"' . checked( $dab_iej, true, false ) . '> '
			. 'Į šią dėžę veda banneris kategorijos viršuje'
			. ( ! $dab_iej && $kito_iej && $kito_iej !== (int) $lid
				? ' <span class="pslka-mut">(dabar veda į #' . (int) $kito_iej . ' — ' . esc_html( get_the_title( $kito_iej ) ) . ')</span>'
				: '' )
			. '</label></div>';
		echo '<div class="pslka-laukas" style="grid-column:1/-1"><label>Aprašymas</label>'
			. '<textarea id="s-aprasas" rows="2">' . esc_textarea( wp_strip_all_tags( $p->get_description() ) ) . '</textarea></div>';
		echo '<div style="grid-column:1/-1"><button class="button button-primary" id="s-saugoti">Išsaugoti nustatymus</button></div>';
		echo '</div></div>';

		self::foto_laukas( $lid );

		/* --- pakopos --- */
		echo '<div class="pslka-kort"><h3>Nuolaidos pakopos <span class="pslka-mut">nuolaida nuo krepšelio sumos, ne nuo kiekio</span>'
			. '<span class="pslka-sp"></span>';
		echo '<span class="pslka-z ' . ( $saugi < 3 ? 'r' : 'b' ) . '">didžiausia saugi nuolaida ' . (int) $saugi . ' %</span></h3>';
		echo '<div class="pslka-vidus" style="padding:0"><table class="wp-list-table widefat striped">'
			. '<thead><tr><th style="width:150px">Nuo sumos</th><th style="width:130px">Nuolaida</th>'
			. '<th>Marža blogiausiu atveju</th><th>Kiek maždaug reikia</th><th></th></tr></thead><tbody id="pak-kunas"></tbody></table>'
			. '<div style="padding:10px 14px"><button class="button" id="pak-prideti">＋ Pakopa</button> '
			. '<button class="button button-primary" id="pak-saugoti">Išsaugoti pakopas</button></div></div></div>';

		/* --- dovanos --- */
		$dov_riba = (float) get_post_meta( $lid, self::META_DOV_RIBA, true );
		echo '<div class="pslka-kort"><h3>Dovana <span class="pslka-mut">iki 3 — klientas renkasi vieną, kai pasiekia sumą</span>'
			. '<span class="pslka-sp"></span>'
			. '<span class="pslka-f"><label>Nuo sumos</label>'
			. '<input type="number" id="dov-riba" step="1" min="0" style="width:90px" value="' . ( $dov_riba > 0 ? esc_attr( $dov_riba ) : '' ) . '" placeholder="—"> €</span>'
			. '<button class="button" id="dov-riba-saugoti">Išsaugoti sumą</button></h3>';
		echo '<div class="pslka-vidus" style="padding:0"><table class="wp-list-table widefat striped">'
			. '<thead><tr><th style="width:44%">Dovana</th><th>Kaina</th><th>Savikaina</th><th>Likutis</th><th></th></tr></thead>'
			. '<tbody id="dov-kunas"></tbody></table>'
			. '<div style="padding:10px 14px" id="dov-pridejimas">';
		$kr_sand = $kr ? ( strtoupper( (string) get_post_meta( $kr[0], '_ps_sandelis', true ) ) ?: 'AV' ) : 'AV';
		echo '<div class="pslka-frow">'
			. '<span class="pslka-f pslka-plati"><label>Paieška</label>'
			. '<input type="text" id="dov-q" placeholder="palik tuščią — parodysim pigiausias"></span>'
			. '<span class="pslka-f"><label>Kategorija</label>' . self::dovanu_kategoriju_sarasas( $lid ) . '</span>'
			. '<span class="pslka-f"><label>Kaina iki</label><select id="dov-iki">'
			. '<option value="">— bet kokia —</option><option value="1.5">1,50 €</option><option value="2.5">2,50 €</option>'
			. '<option value="4">4 €</option><option value="7">7 €</option></select></span>'
			. '<span class="pslka-f"><label>Rodyti</label><select id="dov-filtras">'
			. '<option value="turimi">Tik turimas</option><option value="turimi_sav">Turimas su savikaina</option>'
			. '<option value="visos">Visas</option></select></span>'
			. '<span class="pslka-f"><label>Automatiškai</label>'
			. '<span class="pslka-z b" title="Sandėlis imamas iš krepšio, gyvūnas — iš rinkinio grupės">'
			. esc_html( $kr_sand ) . ' · ' . ( in_array( self::grupe( $lid ), array( 'kates', 'kons_kates' ), true ) ? 'katėms' : 'šunims' )
			. '</span></span>'
			. '<span class="pslka-f"><label>&nbsp;</label>'
			. '<button type="button" class="button button-primary" id="dov-rodyti">Rodyti</button></span>'
			. '</div>';
		echo '<div id="dov-rez" class="pslka-rez"></div></div></div></div>';

		/* --- krepsys --- */
		echo '<div class="pslka-kort"><h3>Krepšys — iš ko klientas renkasi '
			. '<span class="pslka-z b">' . count( $kr ) . ' iš ' . self::MAX_KREPSYS . '</span>'
			. '<span class="pslka-sp"></span><span class="pslka-mut">savikaina rodoma renkant — pagal ją atrenkamos prekės</span></h3>';
		echo '<div class="pslka-vidus" style="padding:0"><table class="wp-list-table widefat striped">'
			. '<thead><tr><th style="width:36%">Prekė</th><th>Kaina</th><th>Savikaina</th><th>Marža</th>'
			. '<th>Likutis</th><th>Sandėlis</th><th></th></tr></thead><tbody>';
		if ( ! $kr ) { echo '<tr><td colspan="7" class="pslka-tuscia">Krepšys tuščias.</td></tr>'; }
		foreach ( $kr as $cid ) {
			$cp = wc_get_product( $cid );
			if ( ! $cp ) { echo '<tr><td colspan="7" class="pslka-bad">Prekės #' . (int) $cid . ' nebėra</td></tr>'; continue; }
			$sav = self::savikaina( $cid );
			$k = (float) $cp->get_price();
			$m = ( $sav !== null && $k > 0 && $sav > 0 ) ? round( ( ( $k / 1.21 ) - $sav ) / $sav * 100 ) : null;   /* ANTKAINIS */
			$riboja = ( $m !== null && $m === self::min_marza( $lid ) );
			echo '<tr><td>' . esc_html( $cp->get_name() ) . '<div class="pslka-mut">#' . (int) $cid . '</div></td>';
			echo '<td>' . self::eur( $k ) . '</td>';
			echo '<td>' . ( $sav === null ? '<span class="pslka-bad">nėra</span>' : self::eur( $sav ) ) . '</td>';
			echo '<td' . ( $riboja ? ' class="pslka-warn"' : '' ) . '>' . ( $m === null ? '—' : $m . ' %' . ( $riboja ? ' ← riboja' : '' ) ) . '</td>';
			echo '<td>' . ( $cp->is_in_stock() ? (int) $cp->get_stock_quantity() : '<span class="pslka-z r">neturime</span>' ) . '</td>';
			echo '<td class="pslka-mut">' . esc_html( strtoupper( (string) get_post_meta( $cid, '_ps_sandelis', true ) ?: 'AV' ) ) . '</td>';
			echo '<td class="r"><button class="button pslka-isimti" data-preke="' . (int) $cid . '">×</button></td></tr>';
		}
		echo '</tbody></table>';

		/* --- pridejimas: rinkiklis su filtrais --- */
		echo '</div><div class="pslka-vidus" style="padding:0">';
		self::rinkiklis( $lid );
		echo '</div></div>';

		/* --- apsaugos --- */
		echo '<div class="pslka-kort"><h3>Apsaugos</h3><div class="pslka-vidus">';
		foreach ( self::apsaugos( $lid ) as $a ) {
			echo '<div class="pslka-apsauga a-' . $a[0] . '"><b>' . esc_html( $a[1] ) . '</b><span>' . esc_html( $a[2] ) . '</span></div>';
		}
		echo '</div></div>';

		echo '<div id="pslka-stat" class="pslka-stat"></div>';
		self::admin_js( $lid, $pakopos, $saugi );
		self::rinkiklio_js( $lid );
	}

	/**
	 * Kas trukdo publikuoti. Ne perspejimai, o tikros kliutys: su tokiu rinkiniu
	 * klientas arba nieko negaletu nusipirkti, arba matytu tuscia langa.
	 */
	public static function publikavimo_kliutys( $lid ) {
		$k = array();
		$kr = self::krepsys( $lid );
		if ( count( $kr ) < self::MIN_KIEKIS ) {
			$k[] = 'Krepšyje ' . count( $kr ) . ' prekės, o klientas privalo įdėti bent '
				. self::MIN_KIEKIS . ' — nusipirkti būtų neįmanoma.';
		}
		$turim = 0;
		foreach ( $kr as $cid ) { $p = wc_get_product( $cid ); if ( $p && $p->is_in_stock() ) { $turim++; } }
		if ( $turim < self::MIN_KIEKIS ) {
			$k[] = 'Sandėlyje turime tik ' . $turim . ' iš ' . count( $kr ) . ' krepšio prekių.';
		}
		if ( trim( get_the_title( $lid ) ) === '' ) { $k[] = 'Nėra pavadinimo.'; }
		return $k;
	}

	/** Busenos jungiklis. Pakopu nebuvimas netrukdo — tik nuolaidos nebus. */
	public static function ajax_busena() {
		self::tikrink();
		$lid = (int) ( $_POST['lid'] ?? 0 );
		$i   = sanitize_key( $_POST['i'] ?? '' );
		if ( ! self::yra_laukas( $lid ) ) { wp_send_json_error( 'Toks rinkinys nerastas.' ); }

		if ( $i === 'publish' ) {
			$kliutys = self::publikavimo_kliutys( $lid );
			if ( $kliutys ) { wp_send_json_error( implode( ' ', $kliutys ) ); }
			wp_update_post( array( 'ID' => $lid, 'post_status' => 'publish' ) );
			$zinute = 'Paskelbta — klientas jau mato.';
			if ( ! self::pakopos( $lid ) ) { $zinute .= ' Pakopų nėra, tad nuolaidos klientas negaus.'; }
		} else {
			wp_update_post( array( 'ID' => $lid, 'post_status' => 'draft' ) );
			$zinute = 'Grąžinta į juodraštį — klientas nebemato.';
		}
		wc_delete_product_transients( $lid );
		wp_send_json_success( array( 'zinute' => $zinute, 'busena' => get_post_status( $lid ) ) );
	}

	/** Silpniausia krepsio marza — ja riboja visa lauka. */
	private static function min_marza( $lid ) {
		$m = array();
		foreach ( self::krepsys( $lid ) as $cid ) {
			$cp = wc_get_product( $cid ); $sav = self::savikaina( $cid );
			if ( ! $cp || $sav === null ) { continue; }
			$k = (float) $cp->get_price(); if ( $k <= 0 ) { continue; }
			$m[] = round( ( ( $k / 1.21 ) - $sav ) / ( $k / 1.21 ) * 100 );
		}
		return $m ? min( $m ) : null;
	}

	/** Apsaugos — skaiciuojamos is duomenu, ne irasytos ranka. */
	private static function apsaugos( $lid ) {
		$a = array();
		$kr = self::krepsys( $lid );
		$saugi = self::saugi_pakopa( $lid );
		$pakopos = self::pakopos( $lid );
		$gilios = array();
		foreach ( $pakopos as $p ) { if ( $saugi > 0 && $p['d'] > $saugi ) { $gilios[] = self::sk( $p['nuo'] ) . ' € −' . self::sk( $p['d'] ) . ' %'; } }
		if ( $gilios ) {
			$a[] = array( 'r', 'Nuolaida gilesnė, nei krepšys atlaiko',
				implode( ', ', $gilios ) . ' — po nuolaidos silpniausios prekės antkainis nukristų žemiau ' . self::MARZOS_RIBA . ' %.' );
		}
		$nera = 0; $be_sav = 0; $kainos = array(); $sand = array();
		foreach ( $kr as $cid ) {
			$cp = wc_get_product( $cid ); if ( ! $cp ) { continue; }
			if ( ! $cp->is_in_stock() ) { $nera++; }
			if ( self::savikaina( $cid ) === null ) { $be_sav++; }
			if ( (float) $cp->get_price() > 0 ) { $kainos[] = (float) $cp->get_price(); }
			$sand[ strtoupper( (string) get_post_meta( $cid, '_ps_sandelis', true ) ?: 'AV' ) ] = 1;
		}
		if ( ! $pakopos ) { $a[] = array( 'y', 'Pakopų nėra', 'Klientas nuolaidos negaus — dėžė veiks kaip paprastas sąrašas.' ); }
		if ( $nera )    { $a[] = array( 'y', 'Krepšyje trūksta prekių', $nera . ' iš ' . count( $kr ) . ' neturime — klientas mato mažiau pasirinkimo.' ); }
		if ( $be_sav )  { $a[] = array( 'y', 'Prekės be savikainos', $be_sav . ' prekės — saugios nuolaidos suskaičiuoti negalima.' ); }
		if ( count( $kr ) < self::MAX_KREPSYS ) { $a[] = array( 'y', 'Krepšys nepilnas', count( $kr ) . ' iš ' . self::MAX_KREPSYS . ' — vitrinoje lieka tuščios vietos.' ); }
		if ( count( $sand ) > 1 ) { $a[] = array( 'r', 'Kelių sandėlių prekės', implode( ' + ', array_keys( $sand ) ) . ' — klientui tai bus dvi siuntos.' ); }
		if ( $kainos && min( $kainos ) > 0 && max( $kainos ) / min( $kainos ) > 3 ) {
			$a[] = array( 'y', 'Krepšyje labai skirtingos kainos',
				self::eur( min( $kainos ) ) . '–' . self::eur( max( $kainos ) ) . ' — pakopą klientas pasieks labai skirtingu prekių kiekiu.' );
		}
		if ( ! $a ) { $a[] = array( 'g', 'Sutvarkyta', 'Pakopos telpa į maržą, krepšys pilnas, vienas sandėlis, savikainos ir likučiai švarūs.' ); }
		return $a;
	}

	private static function eur( $n ) { return number_format( (float) $n, 2, ',', ' ' ) . ' €'; }
	private static function sk( $n ) { return rtrim( rtrim( number_format( (float) $n, 2, ',', '' ), '0' ), ',' ); }


	private static function admin_stilius() {
		?>
		<style>
		.pslka h2.pslka-seima{font-size:15px;margin:22px 0 10px;font-weight:600}
		.pslka h2.pslka-seima span{color:#646970;font-weight:400;font-size:12.5px}
		.pslka-eiles{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
		.pslka-e{background:#fff;border:1px solid #c3c4c7;border-left:3px solid #c3c4c7;border-radius:3px;padding:7px 13px;min-width:118px;display:block}
		.pslka-e b{display:block;font-size:19px;line-height:1.2}
		.pslka-e span{font-size:11.5px;color:#646970}
		.pslka-e.y{border-left-color:#dba617}.pslka-e.y b{color:#996800}
		.pslka-e.r{border-left-color:#d63638}.pslka-e.r b{color:#d63638}
		.pslka-rinkiklis{padding:12px 14px;background:#fbfbfc;border-top:1px solid #f0f0f1}
		.pslka-rvirsus{display:flex;align-items:center;gap:10px;margin:10px 0 6px;flex-wrap:wrap}
		.pslka-rrez{max-height:460px;overflow:auto;background:#fff;border:1px solid #e6e6e6;border-radius:3px}
		.r-foto{width:38px;height:38px;object-fit:contain;display:block}
		tr.pazymeta td{background:#f0f6fc !important}
		.pslka-foto{width:120px;height:120px;border:1px solid #dcdcde;border-radius:3px;background:#fafafa;
			display:grid;place-items:center;overflow:hidden}
		.pslka-foto img{max-width:100%;max-height:100%;object-fit:contain}
		.pslka-foto-blk{display:flex;gap:16px;align-items:flex-start}
		.pslka-gfoto{display:flex;gap:22px;flex-wrap:wrap}
		.pslka-gf{text-align:center;font-size:12.5px}
		.pslka-gf b{display:block;margin:6px 0 2px}
		.pslka-galva{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:12px 0}
		.pslka-kliutys{background:#fcf9e8;border:1px solid #e8dfa8;border-left:3px solid #dba617;
			border-radius:3px;padding:9px 12px;margin-bottom:14px;font-size:12.5px}
		.pslka-kliutys b{display:block;margin-bottom:3px}
		.pslka-kliutys span{display:block;color:#7a5c00}
		.pslka-skirtukai{border-bottom:1px solid #c3c4c7;display:flex;gap:4px;margin:14px 0 18px}
		.pslka-skirtukai a{padding:9px 15px;text-decoration:none;color:#646970;font-size:14px;
			border:1px solid transparent;border-bottom:0;margin-bottom:-1px;border-radius:3px 3px 0 0}
		.pslka-skirtukai a.on{background:#f0f0f1;border-color:#c3c4c7;color:#1d2327;font-weight:600}
		.pslka-antraste{font-size:18px;font-weight:600;margin:0 0 4px;display:flex;align-items:center;gap:12px}
		.pslka-filtrai-blk{background:#fff;border:1px solid #c3c4c7;border-radius:3px;padding:10px 12px;margin-bottom:12px}
		.pslka-frow{display:flex;flex-wrap:wrap;gap:9px 16px;align-items:center}
		.pslka-frow+.pslka-frow{margin-top:9px;padding-top:9px;border-top:1px solid #f0f0f1}
		.pslka-grupe{display:inline-flex;border:1px solid #8c8f94;border-radius:3px;overflow:hidden}
		.pslka-grupe button{border:0;background:#fff;padding:4px 11px;font-size:12.5px;color:#50575e;border-right:1px solid #dcdcde;cursor:pointer}
		.pslka-grupe button:last-child{border-right:0}
		.pslka-grupe button.on{background:#2271b1;color:#fff}
		.pslka-grupe button.tuscia{color:#a7aaad}
		.pslka-grupe button i{font-style:normal;font-size:11px;opacity:.65}
		.pslka-aktyvus{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:9px}
		.pslka-chip{background:#f0f6fc;border:1px solid #c5d9ed;border-radius:12px;padding:2px 6px 2px 10px;font-size:12px;color:#0a4b78}
		.pslka-chip button{border:0;background:none;cursor:pointer;color:#0a4b78;font-size:11px;padding:0 3px}
		.pslka-virsus{display:flex;align-items:center;gap:12px;margin-bottom:9px;flex-wrap:wrap}
		.pslka-e{cursor:pointer;font:inherit;text-align:left}
		.pslka-e.on{border-color:#2271b1;border-left-color:#2271b1;background:#f0f6fc}
		.pslka-e.b{border-left-color:#2271b1}
		.pslka-kfoto{height:130px;display:grid;place-items:center;background:#fafafa;
			border-bottom:1px solid #f0f0f1;overflow:hidden;padding:10px}
		.pslka-kfoto img{max-width:100%;max-height:110px;width:auto;height:auto;object-fit:contain;display:block}
		.pslka-kbody{padding:10px 12px}
		.pslka-kortele{padding:0;overflow:hidden;display:flex;flex-direction:column}
		.pslka-kortele b{padding:0;min-height:2.6em}
		.pslka-tinkl{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:12px}
		.pslka-kortele{display:block;background:#fff;border:1px solid #c3c4c7;border-radius:3px;padding:12px 14px;text-decoration:none;color:#3c434a}
		.pslka-kortele:hover{box-shadow:0 2px 8px rgba(0,0,0,.09);color:#3c434a}
		.pslka-kortele b{font-size:14.5px;display:block;margin-bottom:3px}
		.pslka-met{font-size:12px;color:#646970;margin-bottom:8px}
		.pslka-kort{background:#fff;border:1px solid #c3c4c7;border-radius:3px;margin-bottom:16px;box-shadow:0 1px 1px rgba(0,0,0,.04)}
		.pslka-kort>h3{margin:0;padding:10px 14px;font-size:13.5px;border-bottom:1px solid #f0f0f1;background:#f6f7f7;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
		.pslka-vidus{padding:12px 14px}
		.pslka-du{display:grid;grid-template-columns:1fr 1fr;gap:12px 16px}
		.pslka-sp{flex:1}
		.pslka-mut{color:#646970;font-size:11.5px;font-weight:400}
		.pslka-bad{color:#b32d2e}.pslka-warn{color:#996800}
		.pslka-tuscia{color:#646970;padding:16px;text-align:center}
		.r{text-align:right}
		.pslka-z{display:inline-block;font-size:11px;border:1px solid;border-radius:2px;padding:0 6px;white-space:nowrap;margin:0 3px 3px 0}
		.pslka-z.g{background:#edfaef;border-color:#b8e6c1;color:#00622a}
		.pslka-z.y{background:#fcf9e8;border-color:#e8dfa8;color:#7a5c00}
		.pslka-z.r{background:#fcf0f1;border-color:#f0c3c4;color:#8a2424}
		.pslka-z.b{background:#f0f6fc;border-color:#c5d9ed;color:#0a4b78}
		.pslka-laukas label{display:block;font-size:12px;font-weight:600;margin-bottom:3px}
		.pslka-laukas label span{font-weight:400;color:#646970}
		.pslka-laukas input[type=text],.pslka-laukas select,.pslka-laukas textarea{width:100%}
		.pslka-in{width:88px;text-align:right}
		.pslka-filtrai{padding:10px 14px;background:#fbfbfc;border-top:1px solid #f0f0f1;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}
		.pslka-f{display:flex;align-items:center;gap:6px}
		.pslka-f>label{font-size:12px;color:#646970;white-space:nowrap}
		.pslka-plati{flex:1;min-width:260px}
		.pslka-plati input{flex:1;min-width:180px}
		.pslka-wh{padding:3px 10px !important;font-size:12.5px !important;height:auto !important}
		.pslka-rez{max-height:330px;overflow:auto;border-top:1px solid #f0f0f1}
		/* Grupes juosta — tie patys skirtukai kaip vitrinoje, tik admine. */
		.pslka-grjuosta h3{margin-bottom:0}
		.pslka-grow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px}
		.pslka-grow:last-child{margin-bottom:0}
		.pslka-grlab{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
			color:#646970;min-width:52px}
		.pslka-grbtn{display:inline-flex;align-items:center;gap:6px;text-decoration:none;
			border:1px solid #c3c4c7;background:#fff;color:#2c3338;border-radius:14px;padding:5px 13px;
			font-size:13px;font-weight:600;line-height:1.6}
		.pslka-grbtn:hover{border-color:#2271b1;color:#2271b1}
		.pslka-grbtn.on{background:#2271b1;border-color:#2271b1;color:#fff}
		.pslka-grbtn small{background:rgba(0,0,0,.08);border-radius:9px;padding:0 6px;font-size:11px;font-weight:700}
		.pslka-grbtn.on small{background:rgba(255,255,255,.25)}
		.pslka-grbtn i{color:#b26200;font-style:normal;font-weight:800}
		.pslka-grnaujas{border-style:dashed;color:#646970;font-weight:800;padding:5px 12px}
		.pslka-grnaujas:hover{border-color:#00a32a;color:#00a32a}
		.pslka-trinti-btn{color:#b32d2e !important;border-color:#b32d2e !important}
		.pslka-trinti-btn:hover{background:#b32d2e !important;color:#fff !important}
		.pslka-apsauga{padding:9px 0 9px 11px;border-top:1px solid #f0f0f1;border-left:3px solid #c3c4c7;font-size:12.5px}
		.pslka-apsauga:first-child{border-top:0;padding-top:0}
		.pslka-apsauga b{display:block}.pslka-apsauga span{color:#646970}
		.a-r{border-left-color:#d63638}.a-y{border-left-color:#dba617}.a-g{border-left-color:#00a32a}
		.pslka-stat{position:fixed;right:18px;bottom:18px;z-index:9999;padding:11px 16px;border-radius:4px;font-size:13.5px;
			box-shadow:0 3px 12px rgba(0,0,0,.2);opacity:0;transform:translateY(8px);transition:.2s;max-width:440px;pointer-events:none}
		.pslka-stat.rodo{opacity:1;transform:none}
		.pslka-stat.gerai{background:#00a32a;color:#fff}
		.pslka-stat.bloga{background:#d63638;color:#fff}
		</style>
		<?php
	}

	private static function admin_js( $lid, $pakopos = array(), $saugi = 0 ) {
		$nonce = wp_create_nonce( 'ps_laukai' );
		?>
		<script>
		(function(){
			var LID=<?php echo (int) $lid; ?>, N='<?php echo esc_js( $nonce ); ?>', A=ajaxurl;
			var PAK=<?php echo wp_json_encode( array_values( $pakopos ) ); ?>;
			var SAUGI=<?php echo (int) $saugi; ?>;
			var KAINOS=<?php echo wp_json_encode( array_map( 'floatval', self::krepsio_kainos( $lid ) ) ); ?>;
			function eur(n){ return n.toFixed(2).replace('.',',')+' €'; }
			/* esc() sitame bloke NEBUVO — dovanu lentele luzdavo ties pirmu prekes
			   pavadinimu ir langas amzinai rodydavo „Ieškoma…" (rasta naršyklėje
			   2026-08-15; serverio testai to nepagavo, nes luzo piesimas, ne uzklausa). */
			function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){
				return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
			function stat(t,bloga){
				var s=document.getElementById('pslka-stat'); if(!s) { alert(t); return; }
				s.textContent=t; s.className='pslka-stat rodo '+(bloga?'bloga':'gerai');
				clearTimeout(s._t); s._t=setTimeout(function(){ s.classList.remove('rodo'); }, bloga?9000:3000);
			}
			function siusti(veiksmas,duom,ok){
				var f=new FormData(); f.append('action',veiksmas); f.append('nonce',N); f.append('lid',LID);
				for(var k in duom){ f.append(k, typeof duom[k]==='object' ? JSON.stringify(duom[k]) : duom[k]); }
				fetch(A,{method:'POST',credentials:'same-origin',body:f}).then(function(r){return r.json();})
					.then(function(j){ if(j&&j.success){ ok(j.data); } else { stat((j&&j.data)||'Nepavyko.',true); } })
					.catch(function(){ stat('Ryšio klaida.',true); });
			}

			/* --- naujas laukas --- */
			var kurti=document.getElementById('n-kurti');
			if(kurti){ kurti.addEventListener('click',function(){
				var pav=document.getElementById('n-pav').value.trim();
				if(!pav){ stat('Pavadinimas būtinas.',true); return; }
				kurti.disabled=true;
				var nd=document.getElementById('n-dydis');
				siusti('ps_laukai_naujas',{pav:pav,trumpas:document.getElementById('n-trumpas').value,
					seima:document.getElementById('n-seima').value,zodis:document.getElementById('n-zodis').value,
					dydis: nd?nd.value.trim():'',
					aprasas:document.getElementById('n-aprasas').value},
					function(d){ location.href=d.url; });
				setTimeout(function(){ kurti.disabled=false; },5000);
			}); }
			if(!LID) return;

			/* --- trynimas --- */
			var bt=document.getElementById('b-trinti');
			if(bt){ bt.addEventListener('click',function(e){
				e.preventDefault();
				var pav=document.getElementById('s-pav').value;
				if(!confirm('Perkelti „'+pav+'\u201C į šiukšlinę?\n\nRinkinys dings iš parduotuvės, bet jį bus galima grąžinti.')) return;
				var visam=false;
				if(confirm('Ištrinti IŠ KARTO ir NEGRĮŽTAMAI?\n\nGerai = trinam visam laikui.\nAtšaukti = tik į šiukšlinę.')) visam=true;
				bt.disabled=true;
				siusti('ps_laukai_trinti',{visam:visam?'1':'0'},function(d){
					stat(d.zinute);
					setTimeout(function(){ location.href=d.nuoroda; },1200);
				});
				setTimeout(function(){ bt.disabled=false; },5000);
			}); }

			/* --- busena --- */
			var bj=document.getElementById('b-jungiklis');
			if(bj){ bj.addEventListener('click',function(e){
				e.preventDefault(); bj.disabled=true;
				siusti('ps_laukai_busena',{i:bj.dataset.i}, function(d){
					stat(d.zinute); setTimeout(function(){ location.reload(); },900);
				});
				setTimeout(function(){ bj.disabled=false; },5000);
			}); }

			/* --- nustatymai --- */
			var sav=document.getElementById('s-saugoti');
			if(sav){ sav.addEventListener('click',function(){
				sav.disabled=true;
				var dd=document.getElementById('s-dydis'), mn=document.getElementById('s-min'), dr=document.getElementById('dov-riba');
				siusti('ps_laukai_nustatymai',{pav:document.getElementById('s-pav').value,
					trumpas:document.getElementById('s-trumpas').value, seima:document.getElementById('s-seima').value,
					zodis:document.getElementById('s-zodis').value, aprasas:document.getElementById('s-aprasas').value,
					dydis: dd?dd.value:'', min: mn?mn.value:0, dov_riba: dr?dr.value:'',
					iejimas: (document.getElementById('s-iejimas')||{}).checked ? '1' : '0'},
					function(){ stat('Nustatymai išsaugoti.'); sav.disabled=false; });
				setTimeout(function(){ sav.disabled=false; },5000);
			}); }

			/* --- dovanos --- */
			var DOV = <?php echo wp_json_encode( array_values( array_filter( array_map( function( $id ) {
				$p = wc_get_product( $id );
				if ( ! $p ) { return null; }
				return array( 'id' => (int) $id, 'pav' => $p->get_name(), 'kaina' => (float) $p->get_price(),
					'sav' => self::savikaina( $id ), 'yra' => $p->is_in_stock(),
					'foto' => wp_get_attachment_image_url( $p->get_image_id(), 'thumbnail' ) );
			}, self::dovanos( $lid ) ) ) ) ); ?>;
			function pieskDovanas(){
				var t=document.getElementById('dov-kunas'); if(!t) return;
				if(!DOV.length){ t.innerHTML='<tr><td colspan="5" class="pslka-tuscia">'
					+'Dovanų nėra — tikslo juosta klientui nerodoma.</td></tr>'; }
				else {
					t.innerHTML=DOV.map(function(d){
						var m = (d.sav && d.kaina) ? Math.round(((d.kaina/1.21)-d.sav)/(d.kaina/1.21)*100) : null;
						return '<tr><td>'+(d.foto?'<img src="'+d.foto+'" style="width:34px;height:34px;object-fit:contain;vertical-align:middle;margin-right:8px">':'')
							+esc(d.pav)+'</td>'
							+'<td>'+eur(d.kaina)+'</td>'
							+'<td>'+(d.sav?eur(d.sav):'<span class="pslka-z y">nėra</span>')+'</td>'
							+'<td>'+(d.yra?'<span class="pslka-z g">turime</span>':'<span class="pslka-z r">neturime</span>')+'</td>'
							+'<td class="r"><button class="button dov-trinti" data-id="'+d.id+'">×</button></td></tr>';
					}).join('');
					t.querySelectorAll('.dov-trinti').forEach(function(b){
						b.addEventListener('click',function(){
							b.disabled=true;
							siusti('ps_laukai_dovanos',{veiksmas:'salinti',preke:b.dataset.id},function(d){
								DOV=d.dovanos; pieskDovanas(); stat('Dovana išimta.'); });
						});
					});
				}
				var pr=document.getElementById('dov-pridejimas');
				if(pr) pr.style.display = DOV.length>=3 ? 'none' : '';
			}
			var dq=document.getElementById('dov-q'), dlaik=0;
			if(dq){
				dq.addEventListener('input',function(){ clearTimeout(dlaik); dlaik=setTimeout(dovIeskoti,350); });
				['dov-kat','dov-iki','dov-filtras'].forEach(function(id){
					var e=document.getElementById(id); if(e) e.addEventListener('change',dovIeskoti);
				});
				var drb=document.getElementById('dov-rodyti');
				if(drb) drb.addEventListener('click',function(e){ e.preventDefault(); dovIeskoti(); });
				dq.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); dovIeskoti(); } });
			}
			/* Lenktyniu sargas: uzsikrovus paleidziama paieska be filtro, o zmogus
			   tuo metu jau pasirenka kategorija. Letesnis PIRMAS atsakymas
			   ateidavo paskutinis ir perrasydavo filtruota sarasa — atrodydavo,
			   kad filtras neveikia (rasta narsykleje 08-15). */
			var dovSeq=0;
			function dovIeskoti(){
				var rez=document.getElementById('dov-rez'); if(!rez) return;
				var mano=++dovSeq;
				var f=document.getElementById('dov-filtras').value;
				rez.innerHTML='<div class="pslka-tuscia">Ieškoma…</div>';
				var u=A+'?action=ps_laukai_dov_paieska&nonce='+N+'&lid='+LID
					+'&q='+encodeURIComponent(dq.value.trim())
					+'&kat='+document.getElementById('dov-kat').value
					+'&iki='+document.getElementById('dov-iki').value
					+'&turimi='+(f==='visos'?'0':'1')+'&sav='+(f==='turimi_sav'?'1':'0');
				/* Saugiklis: be jo kiekviena serverio klaida palikdavo amzina
				   „Ieškoma…" ir zmogus nezinodavo, ar laukti (pastaba 08-15). */
				fetch(u,{credentials:'same-origin'}).then(function(r){
					if(!r.ok) throw new Error('HTTP '+r.status);
					return r.text();
				}).then(function(tekstas){
					if(mano!==dovSeq) return null;   /* pasenes atsakymas — metam */
					var j;
					try { j=JSON.parse(tekstas); }
					catch(e){ throw new Error('Serveris grąžino ne JSON: '+tekstas.slice(0,120)); }
					return j;
				}).then(function(j){
					if(j===null || mano!==dovSeq) return;
					if(!j||!j.success){ rez.innerHTML='<div class="pslka-tuscia">Nepavyko ieškoti.</div>'; return; }
					var sar=j.data.prekes||[];
					if(!sar.length){ rez.innerHTML='<div class="pslka-tuscia">Nieko nerasta — atlaisvink filtrus.</div>'; return; }
					var h='<div class="pslka-mut" style="padding:8px 4px">Rodoma '+sar.length+' iš '+j.data.viso
						+' · rikiuota nuo pigiausios</div>';
					h+='<table class="wp-list-table widefat striped"><thead><tr><th style="width:44%">Prekė</th>'
						+'<th>Kaina</th><th>Savikaina</th><th>Likutis</th><th></th></tr></thead><tbody>';
					sar.forEach(function(p){
						h+='<tr><td>'+(p.foto?'<img src="'+p.foto+'" style="width:32px;height:32px;object-fit:contain;vertical-align:middle;margin-right:8px">':'')
							+esc(p.pav)+'<div class="pslka-mut">#'+p.id+(p.kat?' · '+esc(p.kat):'')+'</div></td>'
							+'<td>'+eur(p.kaina)+'</td>'
							+'<td>'+(p.savikaina!=null?eur(p.savikaina):'<span class="pslka-z y">nėra</span>')+'</td>'
							+'<td>'+(p.yra?'<span class="pslka-z g">turime</span>':'<span class="pslka-z r">neturime</span>')+'</td>'
							+'<td class="r"><button class="button button-primary dov-prideti" data-id="'+p.id+'">Dovana</button></td></tr>';
					});
					rez.innerHTML=h+'</tbody></table>';
					rez.querySelectorAll('.dov-prideti').forEach(function(b){
						b.addEventListener('click',function(){
							b.disabled=true;
							siusti('ps_laukai_dovanos',{veiksmas:'prideti',preke:b.dataset.id},function(d){
								DOV=d.dovanos; pieskDovanas(); dovIeskoti(); stat('Dovana pridėta.'); });
							setTimeout(function(){ b.disabled=false; },4000);
						});
					});
				}).catch(function(e){
					if(mano!==dovSeq) return;
					rez.innerHTML='<div class="pslka-tuscia">Paieška nepavyko: '+esc(String(e.message||e))
						+'<br><button class="button" id="dov-kartoti">Bandyti dar kartą</button></div>';
					var kk=document.getElementById('dov-kartoti');
					if(kk) kk.addEventListener('click',function(){ dovIeskoti(); });
				});
			}
			var drs=document.getElementById('dov-riba-saugoti');
			if(drs){ drs.addEventListener('click',function(){
				drs.disabled=true;
				var dd=document.getElementById('s-dydis'), mn=document.getElementById('s-min');
				siusti('ps_laukai_nustatymai',{pav:document.getElementById('s-pav').value,
					trumpas:document.getElementById('s-trumpas').value, seima:document.getElementById('s-seima').value,
					zodis:document.getElementById('s-zodis').value, aprasas:document.getElementById('s-aprasas').value,
					dydis: dd?dd.value:'', min: mn?mn.value:0,
					dov_riba: document.getElementById('dov-riba').value},
					function(){ stat('Dovanos suma išsaugota.'); drs.disabled=false; });
				setTimeout(function(){ drs.disabled=false; },5000);
			}); }
			pieskDovanas();
			/* Siulomi rodomi is karto — tuscias langas nepasako, ka rinktis. */
			if(dq) dovIeskoti();

			/* --- pakopos --- */
			function marzaPo(d){ return SAUGI>0 ? null : null; }
			function kiekReikia(nuo){
				if(!KAINOS.length) return '—';
				var pig=Math.min.apply(null,KAINOS), br=Math.max.apply(null,KAINOS);
				var a=Math.ceil(nuo/br), b=Math.ceil(nuo/pig);
				return a===b ? a+' vnt.' : a+'–'+b+' vnt.';
			}
			function pieskPakopas(){
				var t=document.getElementById('pak-kunas'); if(!t) return;
				if(!PAK.length){ t.innerHTML='<tr><td colspan="5" class="pslka-tuscia">Pakopų nėra — klientas nuolaidos negaus.</td></tr>'; return; }
				t.innerHTML=PAK.map(function(p,i){
					var gilu = SAUGI>0 && p.d>SAUGI;
					return '<tr><td><input type="text" class="pslka-in pak-nuo" data-i="'+i+'" value="'+String(p.nuo).replace('.',',')+'"> €</td>'
						+'<td><input type="text" class="pslka-in pak-d" style="width:60px" data-i="'+i+'" value="'+String(p.d).replace('.',',')+'"> %</td>'
						+'<td class="'+(gilu?'pslka-bad':'')+'">'+(gilu?'per gili — riba '+SAUGI+' %':'telpa į '+SAUGI+' % ribą')+'</td>'
						+'<td class="pslka-mut">'+kiekReikia(p.nuo)+'</td>'
						+'<td class="r"><button class="button pak-trinti" data-i="'+i+'">×</button></td></tr>';
				}).join('');
				t.querySelectorAll('.pak-nuo').forEach(function(x){ x.addEventListener('change',function(){
					PAK[+x.dataset.i].nuo=parseFloat(x.value.replace(',','.'))||0; PAK.sort(function(a,b){return a.nuo-b.nuo;}); pieskPakopas(); }); });
				t.querySelectorAll('.pak-d').forEach(function(x){ x.addEventListener('change',function(){
					PAK[+x.dataset.i].d=parseFloat(x.value.replace(',','.'))||0; pieskPakopas(); }); });
				t.querySelectorAll('.pak-trinti').forEach(function(x){ x.addEventListener('click',function(){
					PAK.splice(+x.dataset.i,1); pieskPakopas(); }); });
			}
			var pr=document.getElementById('pak-prideti');
			if(pr){ pr.addEventListener('click',function(){
				var pask=PAK.length?PAK[PAK.length-1]:{nuo:10,d:0};
				PAK.push({nuo:pask.nuo+10, d:Math.min(pask.d+1, SAUGI||1)});
				pieskPakopas();
			}); }
			var ps=document.getElementById('pak-saugoti');
			if(ps){ ps.addEventListener('click',function(){
				ps.disabled=true;
				siusti('ps_laukai_pakopos',{pakopos:PAK}, function(d){
					if(d.perspejimai && d.perspejimai.length){ stat(d.perspejimai.join(' '),true); }
					else { stat('Pakopos išsaugotos.'); }
					setTimeout(function(){ location.reload(); },1200);
				});
				setTimeout(function(){ ps.disabled=false; },5000);
			}); }
			pieskPakopas();

			/* --- krepsys --- */
			document.querySelectorAll('.pslka-isimti').forEach(function(b){
				b.addEventListener('click',function(){
					if(!confirm('Išimti šią prekę iš krepšio?')) return;
					b.disabled=true;
					siusti('ps_laukai_krepsys',{veiksmas:'isimti',preke:b.dataset.preke},
						function(d){ stat(d.zinute); setTimeout(function(){ location.reload(); },700); });
					setTimeout(function(){ b.disabled=false; },5000);
				});
			});

			/* --- paieska --- */
			var q=document.getElementById('f-q'), rez=document.getElementById('f-rez'), laik=0, wh='';
			if(q){
				document.querySelectorAll('#f-sand .pslka-wh').forEach(function(b){
					b.addEventListener('click',function(){
						document.querySelectorAll('#f-sand .pslka-wh').forEach(function(x){ x.classList.remove('button-primary'); });
						b.classList.add('button-primary'); wh=b.dataset.wh; ieskoti();
					});
				});
				q.addEventListener('input',function(){ clearTimeout(laik); laik=setTimeout(ieskoti,350); });
				document.getElementById('f-savik').addEventListener('change',ieskoti);
				document.getElementById('f-marza').addEventListener('change',ieskoti);
			}
			function ieskoti(){
				var t=q.value.trim();
				if(t.length<2){ rez.innerHTML=''; return; }
				rez.innerHTML='<div class="pslka-tuscia">Ieškoma…</div>';
				var u=A+'?action=ps_laukai_paieska&nonce='+N+'&lid='+LID+'&q='+encodeURIComponent(t)
					+'&sand='+wh+'&savik='+document.getElementById('f-savik').value+'&marza='+document.getElementById('f-marza').value;
				fetch(u,{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(j){
					if(!j||!j.success){ rez.innerHTML='<div class="pslka-tuscia">Nepavyko ieškoti.</div>'; return; }
					var sar=j.data.prekes||[];
					if(!sar.length){ rez.innerHTML='<div class="pslka-tuscia">Nerasta. Atlaisvink filtrus.</div>'; return; }
					var h='<table class="wp-list-table widefat striped"><thead><tr><th style="width:36%">Prekė</th><th>Kaina</th>'
						+'<th>Savikaina</th><th>Marža</th><th>Sandėlis</th><th>Įtaka nuolaidai</th><th></th></tr></thead><tbody>';
					sar.forEach(function(p){
						h+='<tr><td>'+p.pav+'<div class="pslka-mut">#'+p.id+'</div></td>'
						 +'<td>'+(p.kaina!=null?eur(p.kaina):'—')+'</td>'
						 +'<td>'+(p.savikaina!=null?eur(p.savikaina):'<span class="pslka-bad">nėra</span>')+'</td>'
						 +'<td>'+(p.marza!=null?p.marza+' %':'—')+'</td>'
						 +'<td class="pslka-mut">'+(p.sandelis||'AV')+(p.yra?'':' <span class="pslka-z r">neturime</span>')+'</td>'
						 +'<td class="'+(p.krenta?'pslka-warn':'')+'">'+(p.krenta?'nukristų iki '+p.nauja_saugi+' %':'nekeičia')+'</td>'
						 +'<td class="r"><button class="button button-primary pslka-prideti" data-preke="'+p.id+'">Pridėti</button></td></tr>';
					});
					rez.innerHTML=h+'</tbody></table>';
					rez.querySelectorAll('.pslka-prideti').forEach(function(b){
						b.addEventListener('click',function(){
							b.disabled=true;
							siusti('ps_laukai_krepsys',{veiksmas:'prideti',preke:b.dataset.preke},
								function(d){ stat(d.zinute); setTimeout(function(){ location.reload(); },700); });
							setTimeout(function(){ b.disabled=false; },5000);
						});
					});
				});
			}
		})();
		</script>
		<?php
	}

	/** Krepsio kainos JS'ui — kiek vienetu reikia pakopai pasiekti. */
	public static function krepsio_kainos( $lid ) {
		$k = array();
		foreach ( self::krepsys( $lid ) as $cid ) {
			$cp = wc_get_product( $cid );
			if ( $cp && (float) $cp->get_price() > 0 ) { $k[] = (float) $cp->get_price(); }
		}
		return $k;
	}

	/* ---------- AJAX ---------- */

	private static function tikrink() {
		check_ajax_referer( 'ps_laukai', 'nonce' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_send_json_error( 'Neturite teisių.' ); }
	}

	public static function ajax_naujas() {
		self::tikrink();
		$pav = sanitize_text_field( wp_unslash( $_POST['pav'] ?? '' ) );
		if ( $pav === '' ) { wp_send_json_error( 'Pavadinimas būtinas.' ); }
		$prod = new WC_Product_Mix_and_Match();
		$prod->set_name( $pav );
		$prod->set_status( 'draft' );   /* be prekiu publikuoti negalima */
		$prod->set_priced_per_product( true );
		$prod->set_min_container_size( self::MIN_KIEKIS );
		$prod->set_max_container_size( 0 );
		$prod->set_manage_stock( false );
		$prod->set_description( wp_kses_post( wp_unslash( $_POST['aprasas'] ?? '' ) ) );
		$lid = $prod->save();
		if ( ! $lid ) { wp_send_json_error( 'Nepavyko sukurti.' ); }
		update_post_meta( $lid, self::META_LAUKAS, 'yes' );
		update_post_meta( $lid, self::META_ZODIS, ( $_POST['zodis'] ?? '' ) === 'dezute' ? 'dezute' : 'deze' );
		/* Pakuote is kurimo formos: su ja rinkinys is karto atsistoja i savo
		   dydzio eilute vitrinoje ir gauna konservu minimuma. */
		$n_dydis = sanitize_text_field( wp_unslash( $_POST['dydis'] ?? '' ) );
		if ( $n_dydis !== '' ) {
			update_post_meta( $lid, self::META_DYDIS, $n_dydis );
			$prod->set_min_container_size( 6 );
			$prod->save();
		}
		$g = sanitize_key( $_POST['seima'] ?? '' );
		if ( isset( self::grupiu_vardai()[ $g ] ) ) {
			update_post_meta( $lid, '_ps_laukas_grupe', $g );
			update_post_meta( $lid, self::META_SEIMA, self::grupiu_vardai()[ $g ] );
		}
		update_post_meta( $lid, '_ps_laukas_trumpas', sanitize_text_field( wp_unslash( $_POST['trumpas'] ?? '' ) ) );
		update_post_meta( $lid, self::META_PAKOPOS, wp_json_encode( array() ) );
		wp_send_json_success( array( 'id' => $lid, 'url' => self::nuoroda( array( 'id' => $lid ) ) ) );
	}

	public static function ajax_nustatymai() {
		self::tikrink();
		$lid = (int) ( $_POST['lid'] ?? 0 );
		if ( ! self::yra_laukas( $lid ) ) { wp_send_json_error( 'Toks rinkinys nerastas.' ); }
		$pav = sanitize_text_field( wp_unslash( $_POST['pav'] ?? '' ) );
		if ( $pav === '' ) { wp_send_json_error( 'Pavadinimas būtinas.' ); }
		$p = wc_get_product( $lid );
		$p->set_name( $pav );
		$p->set_description( wp_kses_post( wp_unslash( $_POST['aprasas'] ?? '' ) ) );
		$p->save();
		update_post_meta( $lid, self::META_ZODIS, ( $_POST['zodis'] ?? '' ) === 'dezute' ? 'dezute' : 'deze' );
		$g = sanitize_key( $_POST['seima'] ?? '' );
		if ( isset( self::grupiu_vardai()[ $g ] ) ) {
			update_post_meta( $lid, '_ps_laukas_grupe', $g );
			update_post_meta( $lid, self::META_SEIMA, self::grupiu_vardai()[ $g ] );
		}
		update_post_meta( $lid, '_ps_laukas_trumpas', sanitize_text_field( wp_unslash( $_POST['trumpas'] ?? '' ) ) );

		/* Konservu dezems: pakuotes dydis (vitrinoje virsutine eilute) ir
		   minimalus kiekis. Tuscias dydis = dydzio eilutes nera (skanestai). */
		update_post_meta( $lid, self::META_DYDIS, sanitize_text_field( wp_unslash( $_POST['dydis'] ?? '' ) ) );
		$min = (int) ( $_POST['min'] ?? 0 );
		if ( $min >= 2 ) {
			$p->set_min_container_size( $min );
			$p->save();
		}
		$riba = (float) str_replace( ',', '.', (string) ( $_POST['dov_riba'] ?? 0 ) );
		update_post_meta( $lid, self::META_DOV_RIBA, $riba > 0 ? $riba : '' );

		/* Iejimas — vienas grupei: pazymejus sia, nuo kitu zyme nuimam. */
		if ( isset( $_POST['iejimas'] ) ) {
			if ( $_POST['iejimas'] === '1' ) {
				$grupe = self::grupe( $lid );
				$q = new WP_Query( array( 'post_type' => 'product', 'post_status' => array( 'publish', 'draft' ),
					'posts_per_page' => 40, 'fields' => 'ids',
					'meta_query' => array( array( 'key' => self::META_LAUKAS, 'value' => 'yes' ) ) ) );
				foreach ( $q->posts as $id ) {
					if ( (int) $id !== $lid && self::grupe( $id ) === $grupe ) { delete_post_meta( $id, self::META_IEJIMAS ); }
				}
				update_post_meta( $lid, self::META_IEJIMAS, 'yes' );
			} else {
				delete_post_meta( $lid, self::META_IEJIMAS );
			}
			self::sutvarkyti_matomuma( self::grupe( $lid ) );
		}

		wc_delete_product_transients( $lid );
		wp_send_json_success( array( 'ok' => 1 ) );
	}

	/**
	 * Dovanu sarasas: iki 3 prekiu. Dovana turi buti to paties sandelio kaip
	 * krepsys — kitaip viena dovana issauktu antra siunta ir suvalgytu visa
	 * dezes pelna.
	 */
	public static function ajax_dovanos() {
		self::tikrink();
		$lid = (int) ( $_POST['lid'] ?? 0 );
		if ( ! self::yra_laukas( $lid ) ) { wp_send_json_error( 'Toks rinkinys nerastas.' ); }
		$pid = (int) ( $_POST['preke'] ?? 0 );
		$veiksmas = sanitize_key( $_POST['veiksmas'] ?? '' );
		$esamos = self::dovanos( $lid );

		if ( $veiksmas === 'prideti' ) {
			if ( count( $esamos ) >= 3 ) { wp_send_json_error( 'Daugiausia 3 dovanos — daugiau klientui tampa rinkimusi, ne dovana.' ); }
			$p = wc_get_product( $pid );
			if ( ! $p ) { wp_send_json_error( 'Tokios prekės nėra.' ); }
			if ( in_array( $pid, $esamos, true ) ) { wp_send_json_error( 'Ši dovana jau sąraše.' ); }
			$dov_s = strtoupper( (string) get_post_meta( $pid, '_ps_sandelis', true ) ) ?: 'AV';
			$kr = self::krepsys( $lid );
			$kr_s = $kr ? ( strtoupper( (string) get_post_meta( $kr[0], '_ps_sandelis', true ) ) ?: 'AV' ) : $dov_s;
			if ( $dov_s !== $kr_s ) {
				wp_send_json_error( 'Dovana iš ' . $dov_s . ' sandėlio, o krepšys iš ' . $kr_s . '. Būtų dvi siuntos.' );
			}
			$esamos[] = $pid;
		} elseif ( $veiksmas === 'salinti' ) {
			$esamos = array_values( array_diff( $esamos, array( $pid ) ) );
		}
		update_post_meta( $lid, self::META_DOVANOS, wp_json_encode( array_values( $esamos ) ) );
		$r = array();
		foreach ( $esamos as $id ) {
			$p = wc_get_product( $id );
			if ( ! $p ) { continue; }
			$sav = self::savikaina( $id );
			$r[] = array( 'id' => (int) $id, 'pav' => $p->get_name(), 'kaina' => (float) $p->get_price(),
				'sav' => $sav, 'yra' => $p->is_in_stock(),
				'foto' => wp_get_attachment_image_url( $p->get_image_id(), 'thumbnail' ) );
		}
		wp_send_json_success( array( 'dovanos' => $r ) );
	}

	/**
	 * Dovanu paieska. Nuo krepsio paieskos skiriasi trimis dalykais:
	 * 1) sandelis NEPASIRENKAMAS — jis visada toks, kaip krepsio, kitaip butu
	 *    dvi siuntos; filtro rodyti nereikia, serveris ji uzdeda pats;
	 * 2) be uzklausos grazina SIULOMUS (pigiausius turimus) — tuscias langas
	 *    nieko nepasako, o dovana renkantis svarbiausia kaina;
	 * 3) rikiuoja pagal kaina didejant — dovanos savikaina yra dezes savikaina.
	 */
	/**
	 * Rinkinio trynimas. MnM vaiku eilutes gyvena atskiroje lenteleje — be ju
	 * isvalymo liktu naslaiciai, rodantys i neegzistuojancia preke.
	 * Pirmas paspaudimas — i siuksline (grazinama), su „visam" — negriztamai.
	 */
	public static function ajax_trinti() {
		self::tikrink();
		global $wpdb;
		$lid = (int) ( $_POST['lid'] ?? 0 );
		if ( ! self::yra_laukas( $lid ) ) { wp_send_json_error( 'Toks rinkinys nerastas.' ); }
		$visam = ( $_POST['visam'] ?? '' ) === '1';
		$pav = get_the_title( $lid );

		if ( ! $visam ) {
			if ( ! wp_trash_post( $lid ) ) { wp_send_json_error( 'Nepavyko perkelti į šiukšlinę.' ); }
			wp_send_json_success( array( 'zinute' => '„' . $pav . '" perkeltas į šiukšlinę — dar galima grąžinti.',
				'nuoroda' => self::nuoroda() ) );
		}
		$wpdb->delete( $wpdb->prefix . 'wc_mnm_child_items', array( 'container_id' => $lid ), array( '%d' ) );
		if ( ! wp_delete_post( $lid, true ) ) { wp_send_json_error( 'Nepavyko ištrinti.' ); }
		wp_send_json_success( array( 'zinute' => '„' . $pav . '" ištrintas negrįžtamai.', 'nuoroda' => self::nuoroda() ) );
	}

	public static function ajax_dov_paieska() {
		self::tikrink();
		$lid   = (int) ( $_GET['lid'] ?? 0 );
		if ( ! self::yra_laukas( $lid ) ) { wp_send_json_error( 'Toks rinkinys nerastas.' ); }
		$q     = sanitize_text_field( wp_unslash( $_GET['q'] ?? '' ) );
		$kat_id = (int) ( $_GET['kat'] ?? 0 );
		/* Gyvunas NEPASIRENKAMAS — jis issprendziamas is dezes grupes. Kates
		   dezei siulyti jaucio ausi butu klaida, o dar vienas filtras zmogui —
		   dar vienas budas suklysti (savininko sprendimas 08-15). */
		$g = self::grupe( $lid );
		$gyv = ( $g === 'kates' || $g === 'kons_kates' ) ? 'katems' : 'sunims';
		$iki   = (float) str_replace( ',', '.', (string) ( $_GET['iki'] ?? 0 ) );
		$tik_turimi = ( $_GET['turimi'] ?? '1' ) === '1';
		$tik_sav    = ( $_GET['sav'] ?? '' ) === '1';

		/* Sandelis — is krepsio, ne is vartotojo. */
		$kr = self::krepsys( $lid );
		$sand = $kr ? ( strtoupper( (string) get_post_meta( $kr[0], '_ps_sandelis', true ) ) ?: 'AV' ) : 'AV';

		/* Greitis: 120 prekiu × po kelias taksonomijos uzklausas kiekvienai buvo
		   per letas kelias — narsykleje uzklausa pakibdavo ties „Ieškoma…"
		   (pastaba 08-15). Dabar rusi ir gyvuna atrenkam WP_Query lygyje. */
		$args = array(
			'post_type' => 'product', 'post_status' => 'publish', 'posts_per_page' => 60,
			'fields' => 'ids', 'orderby' => 'title', 'order' => 'ASC',
			'no_found_rows' => true, 'update_post_term_cache' => false,
		);
		$tax = array();
		if ( $gyv === 'sunims' || $gyv === 'katems' ) {
			$tax[] = array( 'taxonomy' => 'pa_gyvuno_rusis', 'field' => 'name',
				'terms' => ( $gyv === 'sunims' ? array( 'Šunims', 'Šuniukams' ) : array( 'Katėms', 'Kačiukams' ) ),
				'operator' => 'IN' );
		}
		if ( $kat_id > 0 ) {
			$tax[] = array( 'taxonomy' => 'product_cat', 'field' => 'term_id',
				'terms' => array( $kat_id ), 'include_children' => true );
		}
		if ( $tax ) { $tax['relation'] = 'AND'; $args['tax_query'] = $tax; }
		if ( mb_strlen( $q ) >= 2 ) { $args['s'] = $q; }
		$args['meta_query'] = array(
			'relation' => 'OR',
			array( 'key' => '_ps_sandelis', 'value' => $sand, 'compare' => '=' ),
		);
		if ( $sand === 'AV' ) { $args['meta_query'][] = array( 'key' => '_ps_sandelis', 'compare' => 'NOT EXISTS' ); }

		$q2 = new WP_Query( $args );
		$esamos = self::dovanos( $lid );
		$r = array();
		foreach ( $q2->posts as $pid ) {
			if ( in_array( (int) $pid, $esamos, true ) ) { continue; }
			$p = wc_get_product( $pid );
			if ( ! $p || $p->get_type() === 'mix-and-match' ) { continue; }
			if ( $tik_turimi && ! $p->is_in_stock() ) { continue; }
			$k = (float) $p->get_price();
			if ( $k <= 0 ) { continue; }
			if ( $iki > 0 && $k > $iki ) { continue; }
			$sav = self::savikaina( $pid );
			if ( $tik_sav && $sav === null ) { continue; }

			$kat = (array) wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'names' ) );
			$kat_t = mb_strtolower( implode( ' ', $kat ) . ' ' . $p->get_name() );
			$atributo_nera = ( trim( (string) $p->get_attribute( 'pa_gyvuno_rusis' ) ) === '' );

			/* Gyvunas: pirma atributas (patikimas), tada pavadinimas/kategorija.
			   Katės dėžei siūlyti jaučio ausį — akivaizdi klaida (pastaba 08-15). */
			/* Atsarga prekems be atributo: sprendziam is pavadinimo/kategorijos. */
			if ( ( $gyv === 'sunims' || $gyv === 'katems' ) && $atributo_nera ) {
				$tinka = ( $gyv === 'sunims' )
					? ( preg_match( '/šun|šuni/u', $kat_t ) && ! preg_match( '/katėm|kačiuk/u', $kat_t ) )
					: (bool) preg_match( '/katė|kačiuk/u', $kat_t );
				if ( ! $tinka ) { continue; }
			}

			$r[] = array(
				'id' => (int) $pid, 'pav' => $p->get_name(), 'kaina' => $k,
				'savikaina' => $sav, 'yra' => $p->is_in_stock(),
				'sandelis' => $sand,
				'foto' => wp_get_attachment_image_url( $p->get_image_id(), 'thumbnail' ),
				'kat' => implode( ', ', array_slice( $kat, 0, 2 ) ),
			);
		}
		usort( $r, function( $a, $b ) { return $a['kaina'] <=> $b['kaina']; } );
		wp_send_json_success( array( 'prekes' => array_slice( $r, 0, 40 ), 'sandelis' => $sand, 'viso' => count( $r ) ) );
	}

	public static function ajax_pakopos() {
		self::tikrink();
		$lid = (int) ( $_POST['lid'] ?? 0 );
		if ( ! self::yra_laukas( $lid ) ) { wp_send_json_error( 'Toks rinkinys nerastas.' ); }
		$raw = json_decode( (string) wp_unslash( $_POST['pakopos'] ?? '[]' ), true );
		if ( ! is_array( $raw ) ) { $raw = array(); }
		$sv = self::svarios_pakopos( $lid, $raw );
		update_post_meta( $lid, self::META_PAKOPOS, wp_json_encode( $sv['pakopos'] ) );
		wp_send_json_success( array( 'pakopos' => $sv['pakopos'], 'perspejimai' => $sv['perspejimai'] ) );
	}

	public static function ajax_krepsys() {
		self::tikrink();
		global $wpdb;
		$lid = (int) ( $_POST['lid'] ?? 0 );
		$pid = (int) ( $_POST['preke'] ?? 0 );
		$veiksmas = sanitize_key( $_POST['veiksmas'] ?? '' );
		if ( ! self::yra_laukas( $lid ) ) { wp_send_json_error( 'Toks rinkinys nerastas.' ); }
		$esami = self::krepsys( $lid );
		$tbl = $wpdb->prefix . 'wc_mnm_child_items';

		if ( $veiksmas === 'prideti' ) {
			$p = wc_get_product( $pid );
			if ( ! $p ) { wp_send_json_error( 'Prekė #' . $pid . ' nerasta.' ); }
			if ( in_array( $pid, $esami, true ) ) { wp_send_json_error( 'Ši prekė krepšyje jau yra.' ); }
			if ( count( $esami ) >= self::MAX_KREPSYS ) {
				wp_send_json_error( 'Krepšyje jau ' . self::MAX_KREPSYS . ' prekės — pirma išimk kurią nors.' );
			}
			$naujo = strtoupper( (string) get_post_meta( $pid, '_ps_sandelis', true ) ?: 'AV' );
			foreach ( $esami as $cid ) {
				$s = strtoupper( (string) get_post_meta( $cid, '_ps_sandelis', true ) ?: 'AV' );
				if ( $s !== $naujo ) {
					wp_send_json_error( 'Krepšyje jau yra ' . $s . ' sandėlio prekių, o ši — ' . $naujo
						. '. Vienas krepšys = vienas sandėlis = viena siunta.' );
				}
			}
			$eile = (int) $wpdb->get_var( $wpdb->prepare(
				"SELECT COALESCE(MAX(menu_order),0)+1 FROM {$tbl} WHERE container_id=%d", $lid ) );
			$wpdb->insert( $tbl, array( 'product_id' => $pid, 'container_id' => $lid, 'menu_order' => $eile ), array( '%d','%d','%d' ) );
			$zinute = 'Pridėta: ' . $p->get_name();
		} elseif ( $veiksmas === 'isimti' ) {
			if ( count( $esami ) <= 2 ) { wp_send_json_error( 'Krepšyje liktų mažiau nei 2 prekės — klientui nebūtų iš ko rinktis.' ); }
			$wpdb->delete( $tbl, array( 'container_id' => $lid, 'product_id' => $pid ), array( '%d','%d' ) );
			$p = wc_get_product( $pid );
			$zinute = 'Išimta: ' . ( $p ? $p->get_name() : '#' . $pid );
		} else { wp_send_json_error( 'Nežinomas veiksmas.' ); }

		wc_delete_product_transients( $lid );
		/* Pakopos gali nebetilpti i nauja krepsi — persvarstom is karto. */
		$sv = self::svarios_pakopos( $lid, self::pakopos( $lid ) );
		update_post_meta( $lid, self::META_PAKOPOS, wp_json_encode( $sv['pakopos'] ) );
		if ( $sv['perspejimai'] ) { $zinute .= ' ' . implode( ' ', $sv['perspejimai'] ); }
		wp_send_json_success( array( 'zinute' => $zinute ) );
	}

	public static function ajax_paieska() {
		self::tikrink();
		$lid = (int) ( $_GET['lid'] ?? 0 );
		$q = sanitize_text_field( wp_unslash( $_GET['q'] ?? '' ) );
		$sand = sanitize_key( $_GET['sand'] ?? '' );
		$savik = sanitize_key( $_GET['savik'] ?? '' );
		$marza_nuo = (int) ( $_GET['marza'] ?? 0 );
		if ( mb_strlen( $q ) < 2 ) { wp_send_json_success( array( 'prekes' => array() ) ); }

		$args = array(
			'post_type' => 'product', 'post_status' => 'publish', 'posts_per_page' => 60,
			'fields' => 'ids', 's' => $q,
		);
		if ( $sand ) { $args['meta_query'] = array( array( 'key' => '_ps_sandelis', 'value' => $sand, 'compare' => 'LIKE' ) ); }
		$q2 = new WP_Query( $args );
		$esami = self::krepsys( $lid );
		$dabartine_min = self::min_marza( $lid );
		$saugi = self::saugi_pakopa( $lid );

		$r = array();
		foreach ( $q2->posts as $pid ) {
			if ( in_array( (int) $pid, $esami, true ) ) { continue; }
			$p = wc_get_product( $pid );
			if ( ! $p || $p->get_type() === 'mix-and-match' ) { continue; }
			$k = (float) $p->get_price();
			$sav = self::savikaina( $pid );
			$m = ( $sav !== null && $k > 0 && $sav > 0 ) ? round( ( ( $k / 1.21 ) - $sav ) / $sav * 100 ) : null;   /* ANTKAINIS */
			if ( $marza_nuo && ( $m === null || $m < $marza_nuo ) ) { continue; }
			if ( $savik === 'a' && ( $sav === null || $sav >= 2 ) ) { continue; }
			if ( $savik === 'b' && ( $sav === null || $sav < 2 || $sav >= 5 ) ) { continue; }
			if ( $savik === 'c' && ( $sav === null || $sav < 5 || $sav >= 15 ) ) { continue; }
			if ( $savik === 'd' && ( $sav === null || $sav < 15 ) ) { continue; }

			/* Itaka nuolaidai: ar sita preke taps silpniausia grandimi. */
			$nauja_saugi = $saugi;
			if ( $m !== null ) {
				$min = ( $dabartine_min === null ) ? $m : min( $dabartine_min, $m );
				$nauja_saugi = max( 0, (int) floor( ( 1 - ( 1 + self::MARZOS_RIBA / 100 ) / ( 1 + $min / 100 ) ) * 100 ) );
			}
			$r[] = array(
				'id' => (int) $pid, 'pav' => $p->get_name(), 'kaina' => $k,
				'savikaina' => $sav, 'marza' => $m,
				'sandelis' => strtoupper( (string) get_post_meta( $pid, '_ps_sandelis', true ) ?: 'AV' ),
				'yra' => $p->is_in_stock(),
				'krenta' => ( $nauja_saugi < $saugi ), 'nauja_saugi' => $nauja_saugi,
			);
			if ( count( $r ) >= 30 ) { break; }
		}
		wp_send_json_success( array( 'prekes' => $r ) );
	}

	/* ==================== v1.11: NUOTRAUKOS ==================== */

	/** Grupiu nuotraukos: viena skanestams sunims, viena katems, viena kramtalams. */
	public static function grupiu_foto() {
		$r = get_option( 'ps_laukai_grupiu_foto', array() );
		return is_array( $r ) ? $r : array();
	}

	/** Rinkinio nuotrauka: sava, o jei nera — grupes. */
	public static function foto_id( $lid ) {
		$sava = (int) get_post_thumbnail_id( $lid );
		if ( $sava ) { return $sava; }
		$g = self::grupiu_foto();
		$grupe = self::grupe( $lid );
		return isset( $g[ $grupe ] ) ? (int) $g[ $grupe ] : 0;
	}

	/**
	 * Atsargine nuotrauka parduotuveje (v1.43).
	 * Liecia TIK laukus ir TIK tada, kai savos nuotraukos nera — kitos prekes
	 * pro sita filtra praeina nepaliestos.
	 */
	public static function foto_atsargine( $id, $product ) {
		if ( $id ) { return $id; }
		if ( ! is_object( $product ) || ! method_exists( $product, 'get_id' ) ) { return $id; }
		$pid = (int) $product->get_id();
		if ( ! $pid || ! self::yra_laukas( $pid ) ) { return $id; }
		$g = self::grupiu_foto();
		if ( ! $g ) { return $id; }
		$grupe = self::grupe( $pid );
		return isset( $g[ $grupe ] ) ? (int) $g[ $grupe ] : $id;
	}

	public static function ajax_foto() {
		self::tikrink();
		$att = (int) ( $_POST['att'] ?? 0 );
		$lid = (int) ( $_POST['lid'] ?? 0 );
		$grupe = sanitize_key( $_POST['grupe'] ?? '' );

		if ( $grupe ) {
			$g = self::grupiu_foto();
			if ( $att ) { $g[ $grupe ] = $att; } else { unset( $g[ $grupe ] ); }
			update_option( 'ps_laukai_grupiu_foto', $g, false );
			wp_send_json_success( array( 'url' => $att ? wp_get_attachment_image_url( $att, 'medium' ) : '' ) );
		}
		if ( ! self::yra_laukas( $lid ) ) { wp_send_json_error( 'Toks rinkinys nerastas.' ); }
		if ( $att ) { set_post_thumbnail( $lid, $att ); } else { delete_post_thumbnail( $lid ); }
		wc_delete_product_transients( $lid );
		wp_send_json_success( array( 'url' => $att ? wp_get_attachment_image_url( $att, 'medium' ) : '',
			'atsargine' => $att ? '' : wp_get_attachment_image_url( self::foto_id( $lid ), 'medium' ) ) );
	}

	/* ==================== v1.11: PREKIU RINKIKLIS ==================== */

	/**
	 * Atranka, ne paieska. Is 281 skanesto sunims rasti devynis ivedant teksta
	 * neimanoma, todel filtruojama pagal tai, kuo prekes realiai skiriasi:
	 * kategorija, baltymu saltinis, speciali mityba, monoproteinas, grudai.
	 * Paieska lieka, bet kaip papildymas, ne kaip vienintelis kelias.
	 */
	public static function ajax_prekes() {
		self::tikrink();
		$lid  = (int) ( $_GET['lid'] ?? 0 );
		$kat  = (int) ( $_GET['kat'] ?? 0 );
		$q    = sanitize_text_field( wp_unslash( $_GET['q'] ?? '' ) );
		$sand = sanitize_key( $_GET['sand'] ?? '' );
		$savik = sanitize_key( $_GET['savik'] ?? '' );
		$marza_nuo = (int) ( $_GET['marza'] ?? 0 );
		$rikiuoti = sanitize_key( $_GET['rik'] ?? 'marza' );
		$tik_turim = ! empty( $_GET['turim'] );
		$atr = array();
		foreach ( array( 'baltymai' => 'pa_baltymu_saltinis', 'mityba' => 'pa_speciali_mityba',
			'mono' => 'pa_monoprotein', 'grudai' => 'pa_be_grudu' ) as $raktas => $tax ) {
			$v = isset( $_GET[ $raktas ] ) ? sanitize_text_field( wp_unslash( $_GET[ $raktas ] ) ) : '';
			if ( $v !== '' ) { $atr[ $tax ] = $v; }
		}

		$args = array(
			'post_type' => 'product', 'post_status' => 'publish',
			'posts_per_page' => 300, 'fields' => 'ids', 'orderby' => 'title', 'order' => 'ASC',
		);
		if ( $q !== '' ) { $args['s'] = $q; }
		if ( $kat ) {
			$args['tax_query'] = array( array( 'taxonomy' => 'product_cat', 'field' => 'term_id',
				'terms' => $kat, 'include_children' => true ) );
		}
		foreach ( $atr as $tax => $v ) {
			$args['tax_query'][] = array( 'taxonomy' => $tax, 'field' => 'name', 'terms' => $v );
		}
		if ( ! empty( $args['tax_query'] ) && count( $args['tax_query'] ) > 1 ) { $args['tax_query']['relation'] = 'AND'; }
		if ( $sand ) { $args['meta_query'] = array( array( 'key' => '_ps_sandelis', 'value' => $sand, 'compare' => 'LIKE' ) ); }

		$wq = new WP_Query( $args );
		$esami = self::krepsys( $lid );
		$dab_min = self::min_marza( $lid );
		$saugi = self::saugi_pakopa( $lid );

		$r = array();
		foreach ( $wq->posts as $pid ) {
			if ( in_array( (int) $pid, $esami, true ) ) { continue; }
			$p = wc_get_product( $pid );
			if ( ! $p || $p->get_type() === 'mix-and-match' ) { continue; }
			if ( $tik_turim && ! $p->is_in_stock() ) { continue; }
			$k = (float) $p->get_price();
			$sav = self::savikaina( $pid );
			$m = ( $sav !== null && $k > 0 && $sav > 0 ) ? round( ( ( $k / 1.21 ) - $sav ) / $sav * 100 ) : null;   /* ANTKAINIS */
			if ( $marza_nuo && ( $m === null || $m < $marza_nuo ) ) { continue; }
			if ( $savik === 'a' && ( $sav === null || $sav >= 2 ) ) { continue; }
			if ( $savik === 'b' && ( $sav === null || $sav < 2 || $sav >= 5 ) ) { continue; }
			if ( $savik === 'c' && ( $sav === null || $sav < 5 || $sav >= 15 ) ) { continue; }
			if ( $savik === 'd' && ( $sav === null || $sav < 15 ) ) { continue; }
			if ( $savik === 'x' && $sav !== null ) { continue; }

			$nauja_saugi = $saugi;
			if ( $m !== null ) {
				$min = ( $dab_min === null ) ? $m : min( $dab_min, $m );
				$nauja_saugi = max( 0, (int) floor( ( 1 - ( 1 + self::MARZOS_RIBA / 100 ) / ( 1 + $min / 100 ) ) * 100 ) );
			}
			$r[] = array(
				'id' => (int) $pid, 'pav' => $p->get_name(), 'kaina' => $k, 'savikaina' => $sav, 'marza' => $m,
				'sandelis' => strtoupper( (string) get_post_meta( $pid, '_ps_sandelis', true ) ?: 'AV' ),
				'yra' => $p->is_in_stock(), 'lik' => (int) $p->get_stock_quantity(),
				'foto' => wp_get_attachment_image_url( $p->get_image_id(), 'thumbnail' ),
				'krenta' => ( $nauja_saugi < $saugi ), 'nauja_saugi' => $nauja_saugi,
			);
		}
		usort( $r, function( $a, $b ) use ( $rikiuoti ) {
			if ( $rikiuoti === 'kaina' )      { return $a['kaina'] <=> $b['kaina']; }
			if ( $rikiuoti === 'kaina_maz' )  { return $b['kaina'] <=> $a['kaina']; }
			if ( $rikiuoti === 'likutis' )    { return $b['lik'] <=> $a['lik']; }
			if ( $rikiuoti === 'pav' )        { return strcmp( $a['pav'], $b['pav'] ); }
			return ( $b['marza'] ?? -1 ) <=> ( $a['marza'] ?? -1 );
		} );
		wp_send_json_success( array( 'prekes' => $r, 'rasta' => count( $r ) ) );
	}

	/** Keliu prekiu pridejimas vienu kartu. */
	public static function ajax_prideti_kelias() {
		self::tikrink();
		global $wpdb;
		$lid = (int) ( $_POST['lid'] ?? 0 );
		$ids = json_decode( (string) wp_unslash( $_POST['prekes'] ?? '[]' ), true );
		if ( ! self::yra_laukas( $lid ) ) { wp_send_json_error( 'Toks rinkinys nerastas.' ); }
		if ( ! is_array( $ids ) || ! $ids ) { wp_send_json_error( 'Nepažymėta nė viena prekė.' ); }

		$esami = self::krepsys( $lid );
		$vietos = self::MAX_KREPSYS - count( $esami );
		if ( $vietos <= 0 ) { wp_send_json_error( 'Krepšyje jau ' . self::MAX_KREPSYS . ' prekės — pirma išimk kurią nors.' ); }
		if ( count( $ids ) > $vietos ) {
			wp_send_json_error( 'Pažymėta ' . count( $ids ) . ', o laisvos tik ' . $vietos
				. ' vietos. Nuimk žymes arba išimk prekių iš krepšio.' );
		}
		$sand = array();
		foreach ( $esami as $cid ) { $sand[ strtoupper( (string) get_post_meta( $cid, '_ps_sandelis', true ) ?: 'AV' ) ] = 1; }

		$tbl = $wpdb->prefix . 'wc_mnm_child_items';
		$prideta = 0; $praleista = array();
		foreach ( $ids as $pid ) {
			$pid = (int) $pid;
			$p = wc_get_product( $pid );
			if ( ! $p || in_array( $pid, $esami, true ) ) { continue; }
			$s = strtoupper( (string) get_post_meta( $pid, '_ps_sandelis', true ) ?: 'AV' );
			if ( $sand && ! isset( $sand[ $s ] ) ) { $praleista[] = $p->get_name() . ' (' . $s . ')'; continue; }
			$sand[ $s ] = 1;
			$eile = (int) $wpdb->get_var( $wpdb->prepare(
				"SELECT COALESCE(MAX(menu_order),0)+1 FROM {$tbl} WHERE container_id=%d", $lid ) );
			$wpdb->insert( $tbl, array( 'product_id' => $pid, 'container_id' => $lid, 'menu_order' => $eile ), array( '%d','%d','%d' ) );
			$esami[] = $pid; $prideta++;
		}
		wc_delete_product_transients( $lid );
		$sv = self::svarios_pakopos( $lid, self::pakopos( $lid ) );
		update_post_meta( $lid, self::META_PAKOPOS, wp_json_encode( $sv['pakopos'] ) );

		$zinute = 'Pridėta prekių: ' . $prideta . '.';
		if ( $praleista ) { $zinute .= ' Praleista dėl kito sandėlio: ' . implode( ', ', array_slice( $praleista, 0, 3 ) ) . '.'; }
		if ( $sv['perspejimai'] ) { $zinute .= ' ' . implode( ' ', $sv['perspejimai'] ); }
		wp_send_json_success( array( 'zinute' => $zinute, 'prideta' => $prideta ) );
	}

	/** Filtru reiksmes su kiekiais — imamos is realiu prekiu, ne rasomos ranka. */
	public static function filtru_reiksmes() {
		$kesas = get_transient( 'ps_laukai_filtrai' );
		if ( is_array( $kesas ) ) { return $kesas; }
		$r = array( 'kategorijos' => array(), 'baltymai' => array(), 'mityba' => array(), 'grudai' => array() );
		/* v1.44: sarasas buvo tik skanestai (95–98) — konservu dezems (grupes
		   kons_sunims/kons_kates) kategorijos filtre nebuvo, prekes buvo galima
		   rasti tik paieska. Dabar + Konservai sunims (73) ir Konservai katems (79). */
		foreach ( self::RINKIKLIO_KATEGORIJOS as $tid ) {
			$t = get_term( $tid, 'product_cat' );
			if ( $t && ! is_wp_error( $t ) ) { $r['kategorijos'][] = array( (string) $tid, $t->name, (int) $t->count ); }
		}
		$q = new WP_Query( array( 'post_type' => 'product', 'post_status' => 'publish', 'posts_per_page' => -1, 'fields' => 'ids',
			'tax_query' => array( array( 'taxonomy' => 'product_cat', 'field' => 'term_id',
				'terms' => self::RINKIKLIO_KATEGORIJOS, 'include_children' => true ) ) ) );
		$sk = array( 'pa_baltymu_saltinis' => array(), 'pa_speciali_mityba' => array(), 'pa_be_grudu' => array() );
		foreach ( $q->posts as $pid ) {
			foreach ( $sk as $tax => $x ) {
				foreach ( (array) wp_get_post_terms( $pid, $tax, array( 'fields' => 'names' ) ) as $n ) {
					$sk[ $tax ][ $n ] = ( $sk[ $tax ][ $n ] ?? 0 ) + 1;
				}
			}
		}
		foreach ( array( 'baltymai' => 'pa_baltymu_saltinis', 'mityba' => 'pa_speciali_mityba', 'grudai' => 'pa_be_grudu' ) as $k => $tax ) {
			arsort( $sk[ $tax ] );
			foreach ( $sk[ $tax ] as $n => $c ) { if ( $c >= 3 ) { $r[ $k ][] = array( $n, $n, $c ); } }
		}
		set_transient( 'ps_laukai_filtrai', $r, HOUR_IN_SECONDS );
		return $r;
	}


	/** Prekiu rinkiklio HTML — filtrai virsuje, rezultatai su zymejimo langeliais. */
	private static function rinkiklis( $lid ) {
		$f = self::filtru_reiksmes();
		$grupe = self::grupe( $lid );
		/* v1.44: numatytoji kategorija pagal dezes grupe — konservu dezei atsidaro konservai */
		$pagal_grupe = array( 'sunys' => 95, 'kramtalai' => 95, 'kates' => 96, 'kons_sunims' => 73, 'kons_kates' => 79 );
		$numatyta = $pagal_grupe[ $grupe ] ?? 95;

		echo '<div class="pslka-rinkiklis">';
		echo '<div class="pslka-frow">';
		echo '<span class="pslka-f"><label>Kategorija</label><select id="r-kat">';
		foreach ( $f['kategorijos'] as $k ) {
			echo '<option value="' . esc_attr( $k[0] ) . '"' . selected( (int) $k[0], $numatyta, false ) . '>'
				. esc_html( $k[1] ) . ' (' . (int) $k[2] . ')</option>';
		}
		echo '<option value="0">— visos prekės —</option></select></span>';
		echo '<span class="pslka-f"><label>Baltymai</label><select id="r-baltymai"><option value="">— bet kokie —</option>';
		foreach ( $f['baltymai'] as $x ) { echo '<option value="' . esc_attr( $x[0] ) . '">' . esc_html( $x[1] ) . ' (' . (int) $x[2] . ')</option>'; }
		echo '</select></span>';
		echo '<span class="pslka-f"><label>Speciali mityba</label><select id="r-mityba"><option value="">— bet kokia —</option>';
		foreach ( $f['mityba'] as $x ) { echo '<option value="' . esc_attr( $x[0] ) . '">' . esc_html( $x[1] ) . ' (' . (int) $x[2] . ')</option>'; }
		echo '</select></span>';
		echo '<span class="pslka-f"><label>Grūdai</label><select id="r-grudai"><option value="">— bet kaip —</option>';
		foreach ( $f['grudai'] as $x ) { echo '<option value="' . esc_attr( $x[0] ) . '">' . esc_html( $x[1] ) . ' (' . (int) $x[2] . ')</option>'; }
		echo '</select></span>';
		echo '<span class="pslka-f"><label><input type="checkbox" id="r-mono"> Tik monoproteinas</label></span>';
		echo '</div><div class="pslka-frow">';
		echo '<span class="pslka-f"><label>Sandėlis</label><span id="r-sand">';
		foreach ( array( '' => 'Visi', 'av' => 'AV', 'vf' => 'VF', 'zb' => 'ZB' ) as $k2 => $v2 ) {
			echo '<button type="button" class="button pslka-wh' . ( $k2 === '' ? ' button-primary' : '' ) . '" data-wh="' . esc_attr( $k2 ) . '">' . esc_html( $v2 ) . '</button>';
		}
		echo '</span></span>';
		echo '<span class="pslka-f"><label>Savikaina</label><select id="r-savik">'
			. '<option value="">— bet kokia —</option><option value="a">iki 2 €</option><option value="b">2–5 €</option>'
			. '<option value="c">5–15 €</option><option value="d">virš 15 €</option><option value="x">be savikainos</option></select></span>';
		echo '<span class="pslka-f"><label>Marža nuo</label><select id="r-marza">'
			. '<option value="">— bet kokia —</option><option value="25">25 %</option><option value="27">27 %</option>'
			. '<option value="30">30 %</option><option value="35">35 %</option></select></span>';
		echo '<span class="pslka-f"><label>Rikiuoti</label><select id="r-rik">'
			. '<option value="marza">Marža ↓</option><option value="kaina">Kaina ↑</option>'
			. '<option value="kaina_maz">Kaina ↓</option><option value="likutis">Likutis ↓</option>'
			. '<option value="pav">Pavadinimas</option></select></span>';
		echo '<span class="pslka-f"><label><input type="checkbox" id="r-turim" checked> Tik tai, ką turime</label></span>';
		echo '<span class="pslka-f pslka-plati"><label>Paieška</label>'
			. '<input type="text" id="r-q" placeholder="neprivaloma — pavadinimas arba SKU…"></span>';
		echo '</div>';
		echo '<div class="pslka-rvirsus"><span id="r-rasta" class="pslka-mut"></span>'
			. '<span class="pslka-sp"></span>'
			. '<span class="pslka-mut" id="r-pazymeta"></span> '
			. '<button class="button button-primary" id="r-prideti" disabled>Pridėti pažymėtas</button></div>';
		echo '<div id="r-rez" class="pslka-rrez"></div>';
		echo '</div>';
	}

	/** Nuotraukos laukelis. */
	private static function foto_laukas( $lid ) {
		$sava = (int) get_post_thumbnail_id( $lid );
		$rodoma = self::foto_id( $lid );
		$url = $rodoma ? wp_get_attachment_image_url( $rodoma, 'medium' ) : '';
		$grupe = self::grupe( $lid );
		$vardai = self::grupiu_vardai();
		echo '<div class="pslka-kort"><h3>Nuotrauka <span class="pslka-mut">rodoma kataloge ir rinkinių sąraše</span></h3>'
			. '<div class="pslka-vidus pslka-foto-blk">';
		echo '<div class="pslka-foto" id="foto-langas">' . ( $url ? '<img src="' . esc_url( $url ) . '">' : '<span class="pslka-mut">nėra</span>' ) . '</div>';
		echo '<div><p class="pslka-mut" id="foto-bukle">'
			. ( $sava ? 'Šio rinkinio nuotrauka.' : ( $rodoma
				? 'Rodoma grupės „' . esc_html( $vardai[ $grupe ] ?? $grupe ) . '“ nuotrauka.'
				: 'Nuotraukos nėra — nei savos, nei grupės.' ) ) . '</p>';
		echo '<p><button class="button" id="foto-rinkti">Pasirinkti nuotrauką</button> '
			. '<button class="button" id="foto-salinti"' . ( $sava ? '' : ' disabled' ) . '>Naudoti grupės nuotrauką</button></p>';
		echo '<p class="pslka-mut">Grupių nuotraukos nustatomos rinkinių sąraše — vieną kartą visai grupei.</p>';
		echo '</div></div></div>';
	}

	/** Grupiu nuotraukos sarase. */
	private static function grupiu_foto_blokas() {
		$g = self::grupiu_foto();
		echo '<div class="pslka-kort"><h3>Grupių nuotraukos <span class="pslka-mut">naudojamos, kai rinkinys neturi savos</span></h3>'
			. '<div class="pslka-vidus pslka-gfoto">';
		foreach ( self::grupiu_vardai() as $k => $v ) {
			$id = isset( $g[ $k ] ) ? (int) $g[ $k ] : 0;
			$url = $id ? wp_get_attachment_image_url( $id, 'medium' ) : '';
			echo '<div class="pslka-gf" data-grupe="' . esc_attr( $k ) . '">';
			echo '<div class="pslka-foto gf-langas">' . ( $url ? '<img src="' . esc_url( $url ) . '">' : '<span class="pslka-mut">nėra</span>' ) . '</div>';
			echo '<b>' . esc_html( $v ) . '</b>';
			echo '<p><button class="button button-small gf-rinkti">Pasirinkti</button> '
				. '<button class="button button-small gf-trinti"' . ( $id ? '' : ' disabled' ) . '>Nuimti</button></p>';
			echo '</div>';
		}
		echo '</div></div>';
	}


	/** Rinkiklio ir nuotrauku JS. */
	private static function rinkiklio_js( $lid ) {
		?>
		<script>
		(function(){
			var LID=<?php echo (int) $lid; ?>;
			var N=window.PSLKA_NONCE, A=ajaxurl;
			var pazymeta={}, laik=0, wh='', eile=0;
			function eur(n){ return Number(n).toFixed(2).replace('.',',')+' €'; }
			function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){
				return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
			function stat(t,bloga){
				var s=document.getElementById('pslka-stat'); if(!s){ alert(t); return; }
				s.textContent=t; s.className='pslka-stat rodo '+(bloga?'bloga':'gerai');
				clearTimeout(s._t); s._t=setTimeout(function(){ s.classList.remove('rodo'); }, bloga?9000:3500);
			}

			/* ---------- nuotraukos ---------- */
			function medija(ok){
				var r=wp.media({title:'Rinkinio nuotrauka',button:{text:'Naudoti'},multiple:false});
				r.on('select',function(){ ok(r.state().get('selection').first().toJSON()); });
				r.open();
			}
			function siustiFoto(duom,ok){
				var f=new FormData(); f.append('action','ps_laukai_foto'); f.append('nonce',N);
				for(var k in duom) f.append(k,duom[k]);
				fetch(A,{method:'POST',credentials:'same-origin',body:f}).then(function(r){return r.json();})
					.then(function(j){ if(j&&j.success){ ok(j.data); } else { stat((j&&j.data)||'Nepavyko.',true); } });
			}
			var fr=document.getElementById('foto-rinkti');
			if(fr) fr.addEventListener('click',function(e){ e.preventDefault();
				medija(function(a){ siustiFoto({lid:LID,att:a.id},function(d){
					document.getElementById('foto-langas').innerHTML='<img src="'+d.url+'">';
					document.getElementById('foto-bukle').textContent='Šio rinkinio nuotrauka.';
					document.getElementById('foto-salinti').disabled=false;
					stat('Nuotrauka išsaugota.'); }); });
			});
			var fs=document.getElementById('foto-salinti');
			if(fs) fs.addEventListener('click',function(e){ e.preventDefault();
				siustiFoto({lid:LID,att:0},function(d){
					var u=d.atsargine||'';
					document.getElementById('foto-langas').innerHTML=u?'<img src="'+u+'">':'<span class="pslka-mut">nėra</span>';
					document.getElementById('foto-bukle').textContent=u?'Rodoma grupės nuotrauka.':'Nuotraukos nėra.';
					fs.disabled=true; stat('Sava nuotrauka nuimta.'); });
			});
			document.querySelectorAll('.pslka-gf').forEach(function(bl){
				var g=bl.dataset.grupe;
				bl.querySelector('.gf-rinkti').addEventListener('click',function(e){ e.preventDefault();
					medija(function(a){ siustiFoto({grupe:g,att:a.id},function(d){
						bl.querySelector('.gf-langas').innerHTML='<img src="'+d.url+'">';
						bl.querySelector('.gf-trinti').disabled=false; stat('Grupės nuotrauka išsaugota.'); }); });
				});
				bl.querySelector('.gf-trinti').addEventListener('click',function(e){ e.preventDefault();
					siustiFoto({grupe:g,att:0},function(){
						bl.querySelector('.gf-langas').innerHTML='<span class="pslka-mut">nėra</span>';
						bl.querySelector('.gf-trinti').disabled=true; stat('Grupės nuotrauka nuimta.'); });
				});
			});

			if(!LID || !document.getElementById('r-rez')) return;

			/* ---------- rinkiklis ---------- */
			function param(){
				var p=new URLSearchParams();
				p.set('action','ps_laukai_prekes'); p.set('nonce',N); p.set('lid',LID);
				p.set('kat',document.getElementById('r-kat').value);
				p.set('baltymai',document.getElementById('r-baltymai').value);
				p.set('mityba',document.getElementById('r-mityba').value);
				p.set('grudai',document.getElementById('r-grudai').value);
				if(document.getElementById('r-mono').checked) p.set('mono','Taip');
				p.set('sand',wh);
				p.set('savik',document.getElementById('r-savik').value);
				p.set('marza',document.getElementById('r-marza').value);
				p.set('rik',document.getElementById('r-rik').value);
				if(document.getElementById('r-turim').checked) p.set('turim','1');
				var q=document.getElementById('r-q').value.trim(); if(q) p.set('q',q);
				return p.toString();
			}
			function pazymetuSk(){
				var n=Object.keys(pazymeta).length;
				document.getElementById('r-pazymeta').textContent = n?('pažymėta '+n):'';
				document.getElementById('r-prideti').disabled = !n;
				document.getElementById('r-prideti').textContent = n?('Pridėti pažymėtas ('+n+')'):'Pridėti pažymėtas';
			}
			function krauti(){
				var rez=document.getElementById('r-rez');
				rez.innerHTML='<div class="pslka-tuscia">Renkama…</div>';
				/* Eiles sargas: greitai spaudant filtrus uzklausos grizta ne ta tvarka,
				   ir senesne perrasydavo naujesne — ekranas rodydavo ne ta, kas pasirinkta. */
				var mano=++eile;
				fetch(A+'?'+param(),{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(j){
					if(mano!==eile) return;
					if(!j||!j.success){ rez.innerHTML='<div class="pslka-tuscia">Nepavyko.</div>'; return; }
					var sar=j.data.prekes||[];
					document.getElementById('r-rasta').textContent='Tinka '+j.data.rasta+' prekės';
					if(!sar.length){ rez.innerHTML='<div class="pslka-tuscia">Pagal šiuos filtrus nieko nėra. Atlaisvink filtrus.</div>'; return; }
					var h='<table class="wp-list-table widefat striped"><thead><tr><th style="width:34px"></th>'
						+'<th style="width:46px"></th><th>Prekė</th><th>Kaina</th><th>Savikaina</th><th>Marža</th>'
						+'<th>Likutis</th><th>Sandėlis</th><th>Įtaka nuolaidai</th></tr></thead><tbody>';
					sar.forEach(function(p){
						h+='<tr class="r-eil'+(pazymeta[p.id]?' pazymeta':'')+'" data-id="'+p.id+'">'
						 +'<td><input type="checkbox" class="r-ch" data-id="'+p.id+'"'+(pazymeta[p.id]?' checked':'')+'></td>'
						 +'<td>'+(p.foto?'<img class="r-foto" src="'+p.foto+'">':'')+'</td>'
						 +'<td>'+esc(p.pav)+'<div class="pslka-mut">#'+p.id+'</div></td>'
						 +'<td>'+eur(p.kaina)+'</td>'
						 +'<td>'+(p.savikaina!=null?eur(p.savikaina):'<span class="pslka-bad">nėra</span>')+'</td>'
						 +'<td>'+(p.marza!=null?p.marza+' %':'—')+'</td>'
						 +'<td>'+(p.yra?p.lik:'<span class="pslka-z r">neturime</span>')+'</td>'
						 +'<td class="pslka-mut">'+esc(p.sandelis)+'</td>'
						 +'<td class="'+(p.krenta?'pslka-warn':'')+'">'+(p.krenta?'nukristų iki '+p.nauja_saugi+' %':'nekeičia')+'</td></tr>';
					});
					rez.innerHTML=h+'</tbody></table>';
					rez.querySelectorAll('.r-ch').forEach(function(c){
						c.addEventListener('change',function(){
							var id=this.dataset.id;
							if(this.checked){ pazymeta[id]=1; } else { delete pazymeta[id]; }
							this.closest('tr').classList.toggle('pazymeta',this.checked);
							pazymetuSk();
						});
					});
				});
			}
			['r-kat','r-baltymai','r-mityba','r-grudai','r-savik','r-marza','r-rik'].forEach(function(id){
				document.getElementById(id).addEventListener('change',krauti);
			});
			document.getElementById('r-mono').addEventListener('change',krauti);
			document.getElementById('r-turim').addEventListener('change',krauti);
			document.getElementById('r-q').addEventListener('input',function(){ clearTimeout(laik); laik=setTimeout(krauti,400); });
			document.querySelectorAll('#r-sand .pslka-wh').forEach(function(b){
				b.addEventListener('click',function(e){ e.preventDefault();
					document.querySelectorAll('#r-sand .pslka-wh').forEach(function(x){ x.classList.remove('button-primary'); });
					b.classList.add('button-primary'); wh=b.dataset.wh; krauti();
				});
			});
			document.getElementById('r-prideti').addEventListener('click',function(e){
				e.preventDefault();
				var b=this; b.disabled=true;
				var f=new FormData(); f.append('action','ps_laukai_prideti_kelias'); f.append('nonce',N);
				f.append('lid',LID); f.append('prekes',JSON.stringify(Object.keys(pazymeta)));
				fetch(A,{method:'POST',credentials:'same-origin',body:f}).then(function(r){return r.json();})
					.then(function(j){
						if(j&&j.success){ stat(j.data.zinute); setTimeout(function(){ location.reload(); },900); }
						else { stat((j&&j.data)||'Nepavyko.',true); b.disabled=false; }
					});
			});
			krauti();
		})();
		</script>
		<?php
	}

	/* ==================== BUKLE ==================== */

	/** Visi laukai su svarbiausiais skaiciais — admin langui ir patikroms. */
	public static function visi() {
		$q = new WP_Query( array(
			'post_type'      => 'product',
			'post_status'    => array( 'publish', 'draft' ),
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'meta_query'     => array( array( 'key' => self::META_LAUKAS, 'value' => 'yes' ) ),
		) );
		$r = array();
		foreach ( $q->posts as $lid ) {
			$kr = self::krepsys( $lid );
			$kainos = array(); $marzos = array(); $be_sav = 0; $nera = 0;
			foreach ( $kr as $cid ) {
				$p = wc_get_product( $cid );
				if ( ! $p ) { continue; }
				$k = (float) $p->get_price();
				if ( $k > 0 ) { $kainos[] = $k; }
				$sav = self::savikaina( $cid );
				if ( $sav === null ) { $be_sav++; }
				elseif ( $k > 0 ) { $marzos[] = round( ( ( $k / 1.21 ) - $sav ) / ( $k / 1.21 ) * 100 ); }
				if ( ! $p->is_in_stock() ) { $nera++; }
			}
			$r[] = array(
				'id'       => (int) $lid,
				'pav'      => get_the_title( $lid ),
				'seima'    => get_post_meta( $lid, self::META_SEIMA, true ),
				'zodis'    => get_post_meta( $lid, self::META_ZODIS, true ),
				'sandelis' => get_post_meta( $lid, self::META_SANDELIS, true ),
				'prekiu'   => count( $kr ),
				'kainos'   => $kainos ? array( min( $kainos ), max( $kainos ) ) : null,
				'marzos'   => $marzos ? array( min( $marzos ), max( $marzos ) ) : null,
				'be_savikainos' => $be_sav,
				'neturime' => $nera,
				'pakopos'  => self::pakopos( $lid ),
				'saugi'    => self::saugi_pakopa( $lid ),
			);
		}
		return $r;
	}
}

add_filter( 'wp_nav_menu_objects', array( 'Petshop_Laukai', 'meniu_nuorodos' ), 20 );  /* v1.45 */
Petshop_Laukai::init();
