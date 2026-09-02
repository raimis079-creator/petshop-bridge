<?php
/**
 * Petshop Rinkinių Rūšis v1.0 (pa_gyvuno_rusis rinkiniams iš kategorijų)
 *
 * PRIEŽASTIS (S1597, 2026-09-02): /kategorija/rinkiniai/ filtras „pagal gyvūną“
 * tuščias — 13 iš 16 rinkinių (laukai + mix-and-match) neturėjo `pa_gyvuno_rusis`
 * atributo (turėjo tik 3 DP pakai, paveldėję iš bazinės prekės). YITH slepia
 * filtrą, kai terminų nėra. Rinkiniai kuriami keliose vietose (petshop-laukai,
 * petshop-rinkiniai), todėl viena bendra vieta: bet kuriai prekei RINKINIAI (679)
 * medyje išvedama rūšis iš product_cat pavadinimų.
 *
 * TAISYKLĖS: šunims→252, katėms→253, graužikams→255, paukščiams→254, žuvims→256.
 * Rašoma TIK kai atributas tuščias (savininko ranka nustatytas neliečiamas).
 * Rašoma abiem sluoksniais: `_product_attributes` + wp_set_object_terms (pamoka:
 * taksonominis atributas neišsilaiko be `_product_attributes`).
 *
 * HOOK: woocommerce_update_product / woocommerce_new_product (po išsaugojimo).
 * BACKFILL: ?ps_rink_rusis=backfill — tik prisijungusiam su manage_woocommerce. JSON.
 */
defined( 'ABSPATH' ) || exit;

final class Petshop_Rinkiniu_Rusis {

	const VERSIJA = '1.0';
	const RINKINIAI_CAT = 679;
	const TAX = 'pa_gyvuno_rusis';

	public static function init(): void {
		add_action( 'woocommerce_update_product', [ __CLASS__, 'po_issaugojimo' ], 30 );
		add_action( 'woocommerce_new_product', [ __CLASS__, 'po_issaugojimo' ], 30 );
		add_action( 'init', [ __CLASS__, 'http' ], 5 );
	}

	/** Rūšies term_id rinkinys iš kategorijų pavadinimų. */
	public static function isvesti( int $pid ): array {
		$vardai = wp_get_post_terms( $pid, 'product_cat', [ 'fields' => 'names' ] );
		if ( is_wp_error( $vardai ) ) return [];
		$t = mb_strtolower( implode( ' ', $vardai ) . ' ' . get_the_title( $pid ) );
		$t = strtr( $t, [ 'š' => 's', 'ė' => 'e', 'ų' => 'u', 'ž' => 'z', 'č' => 'c' ] );
		$map = [ 'sunims' => 252, 'suniui' => 252, 'suniukam' => 252, 'katems' => 253, 'katei' => 253, 'kaciuk' => 253, 'grauzik' => 255, 'pauksc' => 254, 'zuvim' => 256 ];
		$out = [];
		foreach ( $map as $zodis => $tid ) { if ( strpos( $t, $zodis ) !== false ) $out[ $tid ] = $tid; }
		return array_values( $out );
	}

	public static function rinkinys( int $pid ): bool {
		$ids = wp_get_post_terms( $pid, 'product_cat', [ 'fields' => 'ids' ] );
		if ( is_wp_error( $ids ) ) return false;
		foreach ( $ids as $id ) {
			if ( (int) $id === self::RINKINIAI_CAT ) return true;
			$anc = get_ancestors( (int) $id, 'product_cat' );
			if ( in_array( self::RINKINIAI_CAT, array_map( 'intval', $anc ), true ) ) return true;
		}
		return false;
	}

	/** Grąžina 'irasyta' | 'jau_yra' | 'ne_rinkinys' | 'neisvesta'. */
	public static function taikyti( int $pid ): string {
		if ( ! self::rinkinys( $pid ) ) return 'ne_rinkinys';
		$esami = wp_get_post_terms( $pid, self::TAX, [ 'fields' => 'ids' ] );
		if ( ! is_wp_error( $esami ) && $esami ) return 'jau_yra';
		$tids = self::isvesti( $pid );
		if ( ! $tids ) return 'neisvesta';
		$attrs = get_post_meta( $pid, '_product_attributes', true );
		if ( ! is_array( $attrs ) ) $attrs = [];
		if ( ! isset( $attrs[ self::TAX ] ) ) {
			$attrs[ self::TAX ] = [ 'name' => self::TAX, 'value' => '', 'position' => count( $attrs ), 'is_visible' => 1, 'is_variation' => 0, 'is_taxonomy' => 1 ];
			update_post_meta( $pid, '_product_attributes', $attrs );
		}
		wp_set_object_terms( $pid, $tids, self::TAX, false );
		wc_delete_product_transients( $pid );
		return 'irasyta';
	}

	public static function po_issaugojimo( $pid ): void {
		static $dirba = [];
		$pid = (int) $pid;
		if ( ! $pid || isset( $dirba[ $pid ] ) ) return;
		$dirba[ $pid ] = 1;
		self::taikyti( $pid );
		unset( $dirba[ $pid ] );
	}

	public static function backfill(): array {
		$ids = get_posts( [ 'post_type' => 'product', 'post_status' => [ 'publish', 'draft' ], 'posts_per_page' => -1, 'fields' => 'ids',
			'tax_query' => [ [ 'taxonomy' => 'product_cat', 'field' => 'term_id', 'terms' => self::RINKINIAI_CAT, 'include_children' => true ] ] ] );
		$r = [];
		foreach ( $ids as $id ) $r[ $id ] = self::taikyti( (int) $id );
		return $r;
	}

	public static function http(): void {
		if ( ( $_GET['ps_rink_rusis'] ?? '' ) !== 'backfill' ) return;
		if ( ! current_user_can( 'manage_woocommerce' ) ) { status_header( 403 ); exit( 'forbidden' ); }
		wp_send_json( self::backfill() );
	}
}
Petshop_Rinkiniu_Rusis::init();
