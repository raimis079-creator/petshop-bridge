<?php
/**
 * Plugin Name: Petshop DP kainos v1.0.1 (Daugiau=Pigiau pakų kainų sinchronizacija)
 * Description: S1722 (2026-09-26, Raimio sprendimai 20:30–20:41). DP pako (`_dp_base_product_id` + `_dp_pack_qty`) kaina
 *   = kiekis × bazinės kaina × (1 − `_dp_nuolaida_proc` / 100), apvalinta iki „…9" centų (42,583 → 42,59). Jei bazinė akcijoje —
 *   pako akcijos kaina ta pačia formule nuo bazinės akcijos kainos. Persiskaičiuoja iš karto po bazinės kainos pokyčio
 *   (`updated_post_meta` _regular_price/_sale_price/_price, vykdoma `shutdown`, be dubliavimo per importus), pakeitus
 *   `_dp_nuolaida_proc`, ir naktiniu cron 05:10 (`ps_dp_kainos_naktinis`, saugiklis). Pakai BE `_dp_nuolaida_proc`
 *   neliečiami (kaina rankinė). Nuolaidų lentelė pagal kategoriją — opcija `ps_dp_nuolaidos` (sausas 3, Josera 2,5,
 *   konservai 3,5, skanėstai 10, kraikas 10) — naudoja 572 forma ir generatorius. Žurnalas `ps_dp_kainos_zurnalas` (60),
 *   v1.0.1: po pakeitimo išvalomas pako puslapio Super Cache (wp_cache_post_change).
 *   naktinio suvestinė `ps_dp_kainos_pask`, Ryto sargo lemputė `dp_kainos` per suvestine(). Išjungti: `ps_dp_kainos_isjungta=1`.
 * Version: 1.0.1
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_DP_Kainos {

	const META      = '_dp_nuolaida_proc';
	const OPT_NUOL  = 'ps_dp_nuolaidos';
	const OPT_PASK  = 'ps_dp_kainos_pask';
	const OPT_ZURN  = 'ps_dp_kainos_zurnalas';
	const T_MAP     = 'ps_dp_zemelapis';
	const CRON      = 'ps_dp_kainos_naktinis';
	const KAINU_META = array( '_regular_price', '_sale_price', '_price', '_sale_price_dates_from', '_sale_price_dates_to' );

	private static $eile = array();
	private static $registruota = false;
	private static $vykdoma = false;

	public static function init() {
		if ( get_option( 'ps_dp_kainos_isjungta' ) ) { return; }
		foreach ( array( 'added_post_meta', 'updated_post_meta', 'deleted_post_meta' ) as $h ) {
			add_action( $h, array( __CLASS__, 'meta_pokytis' ), 10, 3 );
		}
		add_action( self::CRON, array( __CLASS__, 'naktinis' ) );
		add_action( 'init', array( __CLASS__, 'planuoti' ), 20 );
	}

	public static function planuoti() {
		if ( ! wp_next_scheduled( self::CRON ) ) {
			$kada = strtotime( 'tomorrow 05:10', current_time( 'timestamp' ) ) - ( (int) get_option( 'gmt_offset' ) * HOUR_IN_SECONDS );
			wp_schedule_event( $kada, 'daily', self::CRON );
		}
	}

	/* ---------- nuolaidų lentelė ---------- */

	public static function nuolaidos() {
		$num = array( 'kraikas' => 10, 'skanestai' => 10, 'konservai' => 3.5, 'sausas' => 3, 'brendai' => array( 'josera' => 2.5 ) );
		$o = get_option( self::OPT_NUOL );
		if ( is_string( $o ) ) { $o = json_decode( $o, true ); }
		return is_array( $o ) ? array_replace_recursive( $num, $o ) : $num;
	}

	/** Grupė pagal bazinės kategorijas: kraikas / skanestai / konservai / sausas / '' */
	public static function grupe( $base_id ) {
		$slugs = array();
		$terms = get_the_terms( (int) $base_id, 'product_cat' );
		if ( $terms && ! is_wp_error( $terms ) ) {
			foreach ( $terms as $t ) {
				$slugs[] = $t->slug;
				foreach ( get_ancestors( $t->term_id, 'product_cat' ) as $a ) { $at = get_term( $a, 'product_cat' ); if ( $at && ! is_wp_error( $at ) ) { $slugs[] = $at->slug; } }
			}
		}
		$s = implode( ' ', $slugs );
		if ( strpos( $s, 'kraik' ) !== false ) { return 'kraikas'; }
		if ( strpos( $s, 'skanest' ) !== false ) { return 'skanestai'; }
		if ( strpos( $s, 'konserv' ) !== false ) { return 'konservai'; }
		if ( preg_match( '/sausas|hipoalerginis|super-premium/', $s ) ) { return 'sausas'; }
		return '';
	}

	/** Numatytoji nuolaida % bazinei prekei ('' kai grupė nežinoma). */
	public static function numatytoji_proc( $base_id ) {
		$g = self::grupe( $base_id );
		if ( $g === '' ) { return ''; }
		$n = self::nuolaidos();
		if ( $g === 'sausas' ) {
			$bt = get_the_terms( (int) $base_id, 'product_brand' );
			if ( $bt && ! is_wp_error( $bt ) ) {
				foreach ( $bt as $b ) { if ( isset( $n['brendai'][ $b->slug ] ) ) { return (string) (float) $n['brendai'][ $b->slug ]; } }
			}
		}
		return isset( $n[ $g ] ) ? (string) (float) $n[ $g ] : '';
	}

	/* ---------- kaina ---------- */

	/** Apvalinimas iki „…9" centų: 42,583 → 42,59; 110,5606 → 110,59; 14,996 → 14,99. */
	public static function apvalinti( $x ) {
		$r = round( (float) $x * 10 ) / 10 - 0.01;
		if ( $r < 0.09 ) { $r = 0.09; }
		return number_format( $r, 2, '.', '' );
	}

	public static function kaina( $bazine, $qty, $proc ) {
		return self::apvalinti( (float) $bazine * (int) $qty * ( 1 - (float) $proc / 100 ) );
	}

	/* ---------- sinchronizacija ---------- */

	/** Vieno pako sinchronizacija. Grąžina masyvą su rezultatu; $dry — tik skaičiuoja. */
	public static function sinchronizuoti( $pid, $dry = false, $kvietejas = '' ) {
		$pid = (int) $pid;
		$r = array( 'pid' => $pid, 'pakeista' => false );
		$proc = get_post_meta( $pid, self::META, true );
		if ( $proc === '' || $proc === null || ! is_numeric( $proc ) ) { $r['praleista'] = 'be_proc'; return $r; }
		$proc = (float) $proc; $r['proc'] = $proc;
		$base_id = (int) get_post_meta( $pid, '_dp_base_product_id', true );
		$qty     = (int) get_post_meta( $pid, '_dp_pack_qty', true );
		if ( $base_id <= 0 || $qty < 2 ) { $r['klaida'] = 'nera_bazes_ar_kiekio'; return $r; }
		$base = wc_get_product( $base_id );
		if ( ! $base ) { $r['klaida'] = 'bazine_nerasta'; return $r; }
		if ( $base->get_status() !== 'publish' ) { $r['klaida'] = 'bazine_ne_publish'; return $r; }
		$breg = (float) $base->get_regular_price( 'edit' );
		if ( $breg <= 0 ) { $r['klaida'] = 'bazine_be_kainos'; return $r; }
		$bsale = $base->is_on_sale( 'edit' ) ? (float) $base->get_sale_price( 'edit' ) : 0;
		$nreg  = self::kaina( $breg, $qty, $proc );
		$nsale = $bsale > 0 ? self::kaina( $bsale, $qty, $proc ) : '';
		if ( $nsale !== '' && (float) $nsale >= (float) $nreg ) { $nsale = ''; }
		$pak = wc_get_product( $pid );
		if ( ! $pak ) { $r['klaida'] = 'pakas_nerastas'; return $r; }
		$sreg  = (string) $pak->get_regular_price( 'edit' );
		$ssale = (string) $pak->get_sale_price( 'edit' );
		$r['buvo'] = array( $sreg, $ssale ); $r['nauja'] = array( $nreg, $nsale );
		$lygu = ( $sreg !== '' && abs( (float) $sreg - (float) $nreg ) < 0.005 ) && ( ( $ssale === '' && $nsale === '' ) || ( $ssale !== '' && $nsale !== '' && abs( (float) $ssale - (float) $nsale ) < 0.005 ) );
		if ( $lygu ) { return $r; }
		$r['pakeista'] = true;
		if ( $dry ) { return $r; }
		self::$vykdoma = true;
		try {
			$pak->set_regular_price( $nreg );
			$pak->set_sale_price( $nsale );
			$pak->save();
			wc_delete_product_transients( $pid );
			if ( function_exists( 'wp_cache_post_change' ) ) { wp_cache_post_change( $pid ); } // Super Cache: pako puslapis
			self::zurnalas( array( 'laikas' => current_time( 'mysql' ), 'pid' => $pid, 'buvo' => $sreg . ( $ssale !== '' ? '/' . $ssale : '' ), 'tapo' => $nreg . ( $nsale !== '' ? '/' . $nsale : '' ), 'proc' => $proc, 'baze' => $base_id, 'kas' => $kvietejas ) );
		} catch ( \Throwable $e ) { $r['klaida'] = 'irasymas: ' . $e->getMessage(); }
		self::$vykdoma = false;
		return $r;
	}

	/** bazinė → [pakai] */
	public static function zemelapis() {
		$m = get_transient( self::T_MAP );
		if ( is_array( $m ) ) { return $m; }
		global $wpdb;
		$m = array();
		foreach ( (array) $wpdb->get_results( "SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE meta_key='_dp_base_product_id' AND meta_value<>''", ARRAY_A ) as $x ) {
			$m[ (int) $x['meta_value'] ][] = (int) $x['post_id'];
		}
		set_transient( self::T_MAP, $m, 6 * HOUR_IN_SECONDS );
		return $m;
	}

	public static function visi_pakai() {
		$v = array();
		foreach ( self::zemelapis() as $pakai ) { foreach ( $pakai as $p ) { $v[] = $p; } }
		sort( $v );
		return $v;
	}

	public static function meta_pokytis( $mid, $pid, $key ) {
		if ( self::$vykdoma ) { return; }
		if ( $key === '_dp_base_product_id' || $key === '_dp_pack_qty' ) { delete_transient( self::T_MAP ); }
		if ( $key === self::META || $key === '_dp_pack_qty' ) { self::i_eile( (int) $pid ); return; }
		if ( ! in_array( $key, self::KAINU_META, true ) ) { return; }
		$m = self::zemelapis();
		if ( empty( $m[ (int) $pid ] ) ) { return; }
		foreach ( $m[ (int) $pid ] as $pak ) { self::i_eile( $pak ); }
	}

	private static function i_eile( $pid ) {
		self::$eile[ $pid ] = 1;
		if ( ! self::$registruota ) { self::$registruota = true; add_action( 'shutdown', array( __CLASS__, 'vykdyti_eile' ), 5 ); }
	}

	public static function vykdyti_eile() {
		$e = array_keys( self::$eile ); self::$eile = array();
		if ( ! $e || ! function_exists( 'wc_get_product' ) ) { return; }
		foreach ( $e as $pid ) { if ( get_post_type( $pid ) === 'product' ) { self::sinchronizuoti( $pid, false, 'pokytis' ); } }
	}

	/** Naktinis: visi pakai; suvestinė į opciją. */
	public static function naktinis( $dry = false ) {
		$s = array( 'kada' => current_time( 'mysql' ), 'viso' => 0, 'su_proc' => 0, 'be_proc' => 0, 'pakeista' => array(), 'klaidos' => array() );
		foreach ( self::visi_pakai() as $pid ) {
			$s['viso']++;
			$r = self::sinchronizuoti( $pid, $dry, 'naktinis' );
			if ( isset( $r['praleista'] ) ) { $s['be_proc']++; continue; }
			$s['su_proc']++;
			if ( ! empty( $r['klaida'] ) ) { $s['klaidos'][] = $pid . ':' . $r['klaida']; }
			if ( ! empty( $r['pakeista'] ) ) { $s['pakeista'][] = $pid . ' ' . implode( '/', array_filter( $r['buvo'] ) ) . '→' . implode( '/', array_filter( $r['nauja'] ) ); }
		}
		if ( ! $dry ) { update_option( self::OPT_PASK, $s, false ); }
		return $s;
	}

	/** Ryto sargui: [lygis, tekstas]. Gyva patikra (dry) — ar visi pakai su % atitinka formulę. */
	public static function suvestine() {
		$s = self::naktinis( true );
		$drift = count( $s['pakeista'] ); $kl = count( $s['klaidos'] );
		$lygis = $kl ? 'raudona' : ( $drift ? 'geltona' : 'zalia' );
		$t = 'DP pakų kainos: su % ' . $s['su_proc'] . ', rankinių ' . $s['be_proc'] . ', neatitinka ' . $drift . ', klaidų ' . $kl;
		if ( $kl ) { $t .= ' (' . implode( ', ', array_slice( $s['klaidos'], 0, 4 ) ) . ')'; }
		$p = get_option( self::OPT_PASK );
		if ( is_array( $p ) && ! empty( $p['kada'] ) ) { $t .= '; naktinis ' . substr( $p['kada'], 5, 11 ) . ' pakeitė ' . count( (array) $p['pakeista'] ); }
		return array( $lygis, $t );
	}

	private static function zurnalas( $e ) {
		$z = get_option( self::OPT_ZURN, array() );
		if ( ! is_array( $z ) ) { $z = array(); }
		array_unshift( $z, $e );
		update_option( self::OPT_ZURN, array_slice( $z, 0, 60 ), false );
	}
}
Petshop_DP_Kainos::init();
