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
 * - Krepsys = iki 8 vaikiniu prekiu, visos is TO PACIO sandelio (viena siunta).
 * - Klientas gali imti kelis to paties vienetus — MnM kiekio laukelis.
 * - Nuolaida pakopomis pagal krepselio SUMA, ne pagal kieki. Ji taikoma
 *   VISOMS lauko prekems, ne paskutinei.
 *
 * KODEL NUOLAIDA KREPSELYJE, O NE MnM `_mnm_discount`:
 * MnM moka tik viena fiksuota procenta. Pakopa priklauso nuo sumos, kuri
 * paaiskeja tik surinkus krepseli, todel kaina koreguojama
 * `woocommerce_before_calculate_totals` metu — kiekvienai vaikinei prekei
 * atskirai. Taip kiekviena preke lieka atskira eilute su savo savikaina,
 * ir Pragma gauna teisingus duomenis (ne viena „rinkinio\" eilute).
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Laukai {

	const VERSIJA = '1.00';

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
	/** Virs 8 pasirinkimu deze pralaimi savo kategorijai (savininko sprendimas). */
	const MAX_KREPSYS = 8;
	/** Po nuolaidos silpniausios prekes marza privalo likti bent tiek. */
	const MARZOS_RIBA = 20.0;

	public static function init() {
		/* Pakopu variklis. 100 — po MnM, kuris savo kainas sudeda ties 10. */
		add_action( 'woocommerce_before_calculate_totals', array( __CLASS__, 'pakopos_krepselyje' ), 100 );

		/* Kiekio laukelis: leidziam kelis to paties vienetus. */
		add_filter( 'wc_mnm_child_item_quantity_input_args', array( __CLASS__, 'kiekio_laukelis' ), 10, 3 );

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
