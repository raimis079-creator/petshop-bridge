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

	const VERSIJA = '1.02';   /* v1.02: vitrinos sablonas — deze, pakopu juosta, greita perziura */

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

	/** Maziausias kiekis, kad deze butu deze, o ne viena preke. */
	const MIN_KIEKIS = 3;
	/** 9 prekes — 3x3 tinklelis vitrinoje uzsipildo svariai (savininko sprendimas 2026-08-14). */
	const MAX_KREPSYS = 9;
	/** Po nuolaidos silpniausios prekes marza privalo likti bent tiek. */
	const MARZOS_RIBA = 20.0;

	public static function init() {
		/* Pakopu variklis. 100 — po MnM, kuris savo kainas sudeda ties 10. */
		add_action( 'woocommerce_before_calculate_totals', array( __CLASS__, 'pakopos_krepselyje' ), 100 );

		/* Kiekio laukelis: leidziam kelis to paties vienetus. */
		add_filter( 'wc_mnm_child_item_quantity_input_args', array( __CLASS__, 'kiekio_laukelis' ), 10, 3 );

		/* Vitrina: savas sablonas vietoj MnM saraso. */
		add_action( 'wp', array( __CLASS__, 'vitrina_init' ), 20 );
		add_filter( 'body_class', array( __CLASS__, 'vitrina_klase' ) );

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
	 * Riboja SILPNIAUSIA preke: po nuolaidos jos marza privalo likti >= 20 %.
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
			$marzos[] = ( $kaina_be - $sav ) / $kaina_be;
		}
		if ( ! $marzos ) { return 0; }
		$silpn = min( $marzos );
		$d = 1 - ( 1 - $silpn ) / ( 1 - self::MARZOS_RIBA / 100 );
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

	/** Uzsakymo eiluteje paliekam pedsaka, kokia pakopa suveike. */
	public static function eilutes_zyme( $item, $raktas, $reiksmes, $order ) {
		if ( empty( $reiksmes['ps_laukas_nuolaida'] ) ) { return; }
		$item->add_meta_data( '_ps_laukas_nuolaida', (float) $reiksmes['ps_laukas_nuolaida'], true );
		if ( isset( $reiksmes['ps_laukas_pradine'] ) ) {
			$item->add_meta_data( '_ps_laukas_pradine', (float) $reiksmes['ps_laukas_pradine'], true );
		}
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
		$prod->set_catalog_visibility( 'visible' );
		if ( $aprasas !== '' ) { $prod->set_description( $aprasas ); }
		if ( $kat ) { $prod->set_category_ids( $kat ); }

		/* Esme: kainos atskirai, min 3, be virsutines ribos. */
		$prod->set_priced_per_product( true );
		$prod->set_min_container_size( self::MIN_KIEKIS );
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

		add_action( 'woocommerce_before_single_product_summary', array( __CLASS__, 'vitrina' ), 5 );
	}

	public static function vitrina_klase( $k ) {
		if ( is_product() ) {
			global $post;
			if ( $post && self::yra_laukas( $post->ID ) ) { $k[] = 'ps-laukas'; }
		}
		return $k;
	}

	/** Kiti tos pacios seimos laukai — mygtukai virsuje. */
	private static function seimos_laukai( $lid ) {
		$seima = get_post_meta( $lid, self::META_SEIMA, true );
		if ( ! $seima ) { return array(); }
		$q = new WP_Query( array(
			'post_type' => 'product', 'post_status' => 'publish', 'posts_per_page' => 12,
			'fields' => 'ids', 'orderby' => 'menu_order title', 'order' => 'ASC',
			'meta_query' => array(
				array( 'key' => self::META_LAUKAS, 'value' => 'yes' ),
				array( 'key' => self::META_SEIMA, 'value' => $seima ),
			),
		) );
		$r = array();
		foreach ( $q->posts as $id ) {
			$r[] = array(
				'id'   => (int) $id,
				'pav'  => get_post_meta( $id, '_ps_laukas_trumpas', true ) ?: get_the_title( $id ),
				'kiek' => count( self::krepsys( $id ) ),
				'url'  => get_permalink( $id ),
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
			$vardas = trim( preg_replace( '/^\S+\s/u', '', $pav ) );
			$vardas = mb_strtoupper( mb_substr( $vardas, 0, 1 ) ) . mb_substr( $vardas, 1 );
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
		$t = $cp->get_short_description();
		if ( trim( wp_strip_all_tags( $t ) ) === '' ) { $t = $cp->get_description(); }
		$t = preg_replace( '#<style.*?</style>#si', '', $t );
		$t = preg_replace( '#</p>|<br\s*/?>#i', "\n", $t );
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
		if ( mb_strlen( $t ) > 700 ) { $t = mb_substr( $t, 0, 700 ); $t = mb_substr( $t, 0, mb_strrpos( $t, '.' ) + 1 ); }
		return $t;
	}

	/** Nemokamo pristatymo riba. Vienaskaita — kalbam apie sio kliento siunta. */
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
		$laukelis = function_exists( 'wc_mnm_get_child_input_name' )
			? wc_mnm_get_child_input_name( $lid ) : 'mnm_quantity';

		$js = array(
			'prekes'  => $prekes,
			'pakopos' => $pakopos,
			'min'     => (int) $p->get_min_container_size(),
			'zodis'   => $zodis,
			'riba'    => $riba,
			'laukelis'=> $laukelis,
		);

		self::vitrinos_stilius();
		?>
		<div class="pslk">
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
							<input type="hidden" name="<?php echo esc_attr( $laukelis ); ?>[<?php echo (int) $pr['cid']; ?>]"
								value="0" id="pslk-in-<?php echo (int) $pr['cid']; ?>">
						</div>
					<?php endforeach; ?>
				</div>

				<aside class="pslk-sonas">
					<div class="pslk-deze">
						<div class="pslk-deze-v"><h3>Tavo <?php echo esc_html( $zodis['v'] ); ?></h3><span id="pslk-kiek">tuščia</span></div>
						<div class="pslk-deze-vid">
							<div class="pslk-grid" id="pslk-grid"></div>
							<div class="pslk-zinia" id="pslk-zinia"></div>
						</div>
						<div class="pslk-eiga">
							<div class="pslk-eiga-e"><div id="pslk-dbr"></div><div class="pslk-kita" id="pslk-kita"></div></div>
							<div class="pslk-juosta" id="pslk-juosta"><i id="pslk-fill"></i></div>
						</div>
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
		.ps-laukas .product-main > .row > .large-6:first-child,
		.ps-laukas .product-gallery, .ps-laukas .product-info > .price-wrapper,
		.ps-laukas .product-footer, .ps-laukas .product-info .cart { display:none !important; }
		.ps-laukas .product-main { padding-top:14px }
		.pslk{--z:#0F6E56;--zt:#0B5443;--zf:#EAF3EF;--kraft:#EFE7D8;--kraft2:#E4D8C2;--kraft3:#D9CBB0;
			max-width:1220px;margin:0 auto;padding:4px 0 60px;color:#2B2B2B;
			font-family:Inter,"Segoe UI",Arial,sans-serif;font-size:15px;line-height:1.5}
		.pslk *{box-sizing:border-box}
		.pslk-h1{font-size:29px;font-weight:800;margin:0 0 6px;letter-spacing:-.01em;color:#1e1e1e}
		.pslk-pakopos{display:inline-block;vertical-align:middle;font-size:13px;font-weight:800;color:#C7891C;
			background:#FBF3E2;border:1px solid #EBD9B4;border-radius:20px;padding:5px 14px;margin-left:12px}
		.pslk-pakopos i{font-style:normal;opacity:.45;margin:0 4px}
		.pslk-ivadas{color:#6b6b6b;margin:6px 0 18px;max-width:66ch}
		.pslk-laukai{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:18px}
		.pslk-lbtn{border:2px solid #E6E6E3;background:#fff;border-radius:24px;padding:9px 18px;
			font-weight:700;font-size:13.5px;color:#555;text-decoration:none;display:inline-block}
		.pslk-lbtn:hover{border-color:#BFCEC8;color:#555}
		.pslk-lbtn.on{border-color:var(--z);background:var(--z);color:#fff}
		.pslk-lbtn small{font-weight:400;opacity:.75;margin-left:5px}
		.pslk-tinkl{display:grid;grid-template-columns:minmax(0,1fr) 350px;gap:30px;align-items:start}
		@media(max-width:960px){.pslk-tinkl{grid-template-columns:1fr;gap:18px}}
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
		.pslk-el u{position:absolute;top:-7px;right:-7px;min-width:21px;height:21px;border-radius:11px;background:var(--z);
			color:#fff;font-size:11.5px;font-weight:800;display:grid;place-items:center;padding:0 5px;text-decoration:none}
		.pslk-tuscia{border:2px dashed #CBBD9F;border-radius:9px;height:64px;display:grid;place-items:center;color:#B3A483;font-weight:800;font-size:14px}
		.pslk-zinia{font-size:12.5px;color:#8a7a5c;margin-top:12px;text-align:center}
		.pslk-eiga{padding:15px 18px 6px;border-top:1px solid #EFEAE0}
		.pslk-eiga-e{display:flex;align-items:baseline;gap:8px;margin-bottom:9px;flex-wrap:wrap;font-size:14.5px;font-weight:800;color:var(--zt)}
		.pslk-eiga-e b{font-size:18px}
		.pslk-kita{margin-left:auto;font-size:12.5px;color:#666;text-align:right;font-weight:400}
		.pslk-kita b{color:var(--zt);font-weight:800}
		.pslk-juosta{position:relative;height:9px;background:#EDEDE9;border-radius:5px;margin:0 0 22px}
		.pslk-juosta i{display:block;height:100%;background:linear-gradient(90deg,var(--z),#199A76);border-radius:5px;width:0;transition:width .35s cubic-bezier(.4,0,.2,1)}
		.pslk-zyme{position:absolute;top:-3px;transform:translateX(-50%)}
		.pslk-zyme u{display:block;width:3px;height:15px;background:#D6D6D1;border-radius:2px;text-decoration:none}
		.pslk-zyme.pas u{background:var(--zt)}
		.pslk-zyme s{position:absolute;top:17px;left:50%;transform:translateX(-50%);font-size:10.5px;color:#9a9a9a;
			text-decoration:none;white-space:nowrap;font-weight:700}
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
		.pslk-pz-f{display:grid;place-items:center;background:#FAFAF8;border-radius:12px;padding:18px;min-height:250px}
		.pslk-pz-f img{max-width:100%;max-height:260px;object-fit:contain}
		.pslk-pz-pav{font-size:19px;font-weight:800;line-height:1.3;margin:4px 0 10px}
		.pslk-pz-kaina{font-size:21px;font-weight:800;margin-bottom:14px}
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
			function eur(n){ return n.toFixed(2).replace('.',',')+' €'; }
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
						h+='<div class="pslk-el">'+(p&&p.foto?'<img src="'+p.foto+'" alt="">':'')
						 +(sel[cid]>1?'<u>×'+sel[cid]+'</u>':'')+'</div>'; });
				} else {
					for(var i=1;i<=D.min;i++) h+='<div class="pslk-tuscia">'+i+'</div>';
				}
				g.innerHTML=h;
				document.getElementById('pslk-kiek').textContent=n?n+' vnt.':'tuščia';
				document.getElementById('pslk-zinia').textContent=yra.length?'':'Įdėk bent '+D.min+' — vienodus ar skirtingus.';

				/* eiga */
				var dbr=document.getElementById('pslk-dbr'), kita=document.getElementById('pslk-kita');
				if(d>0){ dbr.innerHTML='Turi <b>−'+d+' %</b> · sutaupai '+eur(nuolEur); }
				else if(D.pakopos.length){ dbr.innerHTML='Nuolaida nuo '+eur(D.pakopos[0].nuo); }
				else { dbr.textContent=''; }
				if(r.kita){ kita.innerHTML='Dar <b>'+eur(r.kita.nuo-s)+'</b> ir visai '+D.zodis.n+' <b>−'+r.kita.d+' %</b>'; }
				else if(d>0){ kita.innerHTML='Didžiausia nuolaida jau tavo'; }
				else { kita.innerHTML=''; }

				var max=virs?virs.nuo*1.12:1;
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
				document.getElementById('pslk-po').innerHTML=(moka>0&&moka<D.riba)
					? 'Dar <b>'+eur(D.riba-moka)+'</b> iki nemokamo pristatymo į paštomatą'
					: 'Nemokamas pristatymas į paštomatą nuo '+D.riba.toFixed(0)+' €';
			}

			/* greita perziura */
			function perziura(cid){
				var p=pagalCid[cid]; if(!p) return;
				pz=cid;
				document.getElementById('pslk-pz-f').innerHTML=p.foto?'<img src="'+p.foto+'" alt="">':'';
				document.getElementById('pslk-pz-b').textContent=p.zenklas;
				document.getElementById('pslk-pz-pav').textContent=p.pav;
				document.getElementById('pslk-pz-kaina').innerHTML=eur(p.kaina)+' <small style="font-size:12px;font-weight:400;color:#9a9a9a">/ vnt.</small>';
				document.getElementById('pslk-pz-apr').textContent=p.apr||'Aprašymas ruošiamas.';
				pzAtnaujink();
				document.getElementById('pslk-pz').classList.add('rodo');
				document.body.style.overflow='hidden';
			}
			function uzdaryk(){ document.getElementById('pslk-pz').classList.remove('rodo'); document.body.style.overflow=''; pz=null; }
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

Petshop_Laukai::init();
