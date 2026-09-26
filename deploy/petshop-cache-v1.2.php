<?php
/**
 * Plugin Name: Petshop Cache v1.2 (WP Super Cache išvalymas po atsargų/kainų/importų pakeitimų)
 * Description: WP Super Cache (Simple režimas, S1555–S1557) laiko puslapius 1 h. Šis modulis išvalo cache iš karto,
 *   kai keičiasi prekės likutis/kaina/statusas, baigiasi WP All Import importas (VF/ZB), keičiasi kategorijos
 *   ar meniu — kad lankytojas nematytų pasenusio likučio/kainos. Nieko nekeičia, tik kviečia Super Cache funkcijas.
 * Version: 1.2
 * S1721 (2026-09-26): po WPAI importo VISAS kešas valomas tik jei importas ką nors sukūrė/atnaujino (pmxi_imports.imported+updated > 0);
 *   „skip unchanged" importai (ZB #3 kas valandą) kešo nebetrina. Valymų žurnalas: opcija ps_cache_valymai (paskutiniai 30, su kvietėju),
 *   įrašomas ir per Super Cache `wp_cache_cleared` — kad būtų matyti, kas dar valo viską. > 25 prekių slenkstis paliktas, tik žurnaluojamas.
 * S1713 (2026-09-24, WP_CACHE įjungtas): Super Cache `wp_cache_post_change()` valo tik prekę + pradinį + /page/,
 *   bet ne kategorijų/gamintojo/parduotuvės archyvus, kuriuose rodoma kaina ir „Turime" — v1.1 po prekės pokyčio
 *   pažymi rebuild ir jos kategorijų (su tėvais), gamintojo bei /parduotuve/ katalogus (`wpsc_rebuild_files`).
 *
 * S1557 (2026-09-01). Sąmoningai be savo logikos: `wp_cache_post_change($id)` (prekė + pradinis + archyvai)
 * ir `wp_cache_clear_cache()` (viskas) — tik plugino API. Jei Super Cache išjungtas — funkcijų nėra, nieko nedaro.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Cache {
	const VERSIJA = '1.2';
	private static $laukia = array();   // prekių id, kurioms išvalyti shutdown'e (dedupe)
	private static $viskas = false;

	public static function init() {
		// atsargos / kainos / prekės objektas
		add_action( 'woocommerce_product_set_stock', array( __CLASS__, 'preke_obj' ) );
		add_action( 'woocommerce_variation_set_stock', array( __CLASS__, 'preke_obj' ) );
		add_action( 'woocommerce_product_set_stock_status', array( __CLASS__, 'preke_id' ), 10, 1 );
		add_action( 'woocommerce_variation_set_stock_status', array( __CLASS__, 'preke_id' ), 10, 1 );
		add_action( 'woocommerce_product_object_updated_props', array( __CLASS__, 'preke_props' ), 10, 2 );
		add_action( 'woocommerce_update_product', array( __CLASS__, 'preke_id' ) );
		add_action( 'woocommerce_update_product_variation', array( __CLASS__, 'preke_id' ) );
		// importai (WP All Import: VF/ZB) ir taksonomijos
		add_action( 'pmxi_after_xml_import', array( __CLASS__, 'po_importo' ), 10, 1 );
		add_action( 'wp_cache_cleared', array( __CLASS__, 'zurnalas_cleared' ) );
		add_action( 'edited_product_cat', array( __CLASS__, 'viskas' ) );
		add_action( 'created_product_cat', array( __CLASS__, 'viskas' ) );
		add_action( 'edited_product_brand', array( __CLASS__, 'viskas' ) );
		add_action( 'wp_update_nav_menu', array( __CLASS__, 'viskas' ) );
		// mūsų moduliams: do_action('petshop_cache_isvalyti') arba do_action('petshop_cache_isvalyti_preke', $id)
		add_action( 'petshop_cache_isvalyti', array( __CLASS__, 'viskas' ) );
		add_action( 'petshop_cache_isvalyti_preke', array( __CLASS__, 'preke_id' ) );
		add_action( 'shutdown', array( __CLASS__, 'vykdyti' ), 5 );
	}

	public static function preke_obj( $p ) { if ( is_object( $p ) && method_exists( $p, 'get_id' ) ) { self::preke_id( $p->get_id() ); } }
	public static function preke_props( $p, $props ) {
		$svarbu = array( 'stock_quantity', 'stock_status', 'price', 'regular_price', 'sale_price', 'status', 'catalog_visibility', 'name', 'image_id', 'gallery_image_ids' );
		if ( array_intersect( (array) $props, $svarbu ) ) { self::preke_obj( $p ); }
	}
	public static function preke_id( $id ) {
		$id = (int) $id; if ( $id <= 0 ) { return; }
		$post = get_post( $id );
		if ( $post && 'product_variation' === $post->post_type && $post->post_parent ) { $id = (int) $post->post_parent; }
		self::$laukia[ $id ] = true;
	}
	public static function viskas() { self::$viskas = true; self::$kodel = self::$kodel ?: current_filter(); }
	private static $kodel = '';
	private static $zurnale = false;

	/** WPAI importo pabaiga: valyti viską tik jei šis paleidimas ką nors sukūrė ar atnaujino. */
	public static function po_importo( $import_id ) {
		global $wpdb;
		$r = $wpdb->get_row( $wpdb->prepare( "SELECT imported, updated, skipped FROM {$wpdb->prefix}pmxi_imports WHERE id = %d", (int) $import_id ), ARRAY_A );
		$pakeista = $r ? ( (int) $r['imported'] + (int) $r['updated'] ) : -1;
		if ( $pakeista === 0 ) { self::zurnalas( 'importas_be_pokyciu', 'import #' . (int) $import_id . ' skipped ' . (int) $r['skipped'] ); return; }
		self::$kodel = 'pmxi_after_xml_import #' . (int) $import_id . ' imported ' . ( $r ? (int) $r['imported'] : '?' ) . ' updated ' . ( $r ? (int) $r['updated'] : '?' );
		self::$viskas = true;
	}

	/** Žurnalas: opcija ps_cache_valymai — paskutiniai 30 įrašų [laikas, tipas, info, kvietėjas]. */
	public static function zurnalas( $tipas, $info = '' ) {
		try {
			$bt = array();
			foreach ( array_slice( debug_backtrace( DEBUG_BACKTRACE_IGNORE_ARGS, 14 ), 2, 12 ) as $f ) {
				if ( empty( $f['file'] ) ) continue;
				$fn = basename( $f['file'] );
				if ( in_array( $fn, array( 'class-wp-hook.php', 'plugin.php' ), true ) ) continue;
				$bt[] = $fn . ':' . ( $f['line'] ?? '' ) . ' ' . ( $f['function'] ?? '' );
				if ( count( $bt ) >= 5 ) break;
			}
			$uri = substr( (string) ( $_SERVER['REQUEST_URI'] ?? ( defined( 'WP_CLI' ) ? 'cli' : '' ) ), 0, 90 );
			$z = get_option( 'ps_cache_valymai' ); if ( ! is_array( $z ) ) $z = array();
			$z[] = array( wp_date( 'm-d H:i:s' ), $tipas, substr( (string) $info, 0, 120 ), $uri, implode( ' < ', $bt ) );
			if ( count( $z ) > 30 ) $z = array_slice( $z, -30 );
			update_option( 'ps_cache_valymai', $z, false );
		} catch ( \Throwable $e ) {}
	}

	/** Super Cache pats praneša apie pilną valymą (wp_cache_clear_cache) — rašom kvietėją, jei tai ne mes. */
	public static function zurnalas_cleared() {
		if ( self::$zurnale ) return;
		self::zurnalas( 'wp_cache_cleared', 'svetimas kvietėjas' );
	}

	public static function vykdyti() {
		if ( self::$viskas ) {
			self::zurnalas( 'viskas', self::$kodel );
			self::$zurnale = true;
			if ( function_exists( 'wp_cache_clear_cache' ) ) { wp_cache_clear_cache(); }
			self::$zurnale = false;
			self::$viskas = false; self::$laukia = array(); return;
		}
		if ( ! self::$laukia || ! function_exists( 'wp_cache_post_change' ) ) { return; }
		if ( count( self::$laukia ) > 25 ) {
			self::zurnalas( 'viskas_25', count( self::$laukia ) . ' prekės: ' . implode( ',', array_slice( array_keys( self::$laukia ), 0, 8 ) ) );
			self::$zurnale = true;
			if ( function_exists( 'wp_cache_clear_cache' ) ) { wp_cache_clear_cache(); }
			self::$zurnale = false;
			self::$laukia = array(); return;
		}
		$archyvai = array();
		foreach ( array_keys( self::$laukia ) as $id ) {
			wp_cache_post_change( $id ); // prekė + pradinis + /page/ (Super Cache logika)
			foreach ( self::archyvu_keliai( $id ) as $k ) { $archyvai[ $k ] = true; }
		}
		self::$laukia = array();
		self::archyvus_rebuild( array_keys( $archyvai ) );
	}

	/** Prekės kategorijų (su tėvais), gamintojo ir parduotuvės URL keliai, pvz. 'kategorija/sunims/maistas-sunims/'. */
	public static function archyvu_keliai( $id ) {
		$keliai = array();
		foreach ( array( 'product_cat', 'product_brand' ) as $tax ) {
			$terms = get_the_terms( $id, $tax );
			if ( ! is_array( $terms ) ) { continue; }
			foreach ( $terms as $t ) {
				$ids = array_merge( array( $t->term_id ), (array) get_ancestors( $t->term_id, $tax ) );
				foreach ( $ids as $tid ) { $l = get_term_link( (int) $tid, $tax ); if ( ! is_wp_error( $l ) ) { $keliai[] = $l; } }
			}
		}
		if ( function_exists( 'wc_get_page_id' ) && wc_get_page_id( 'shop' ) > 0 ) { $keliai[] = get_permalink( wc_get_page_id( 'shop' ) ); }
		$out = array();
		foreach ( $keliai as $l ) { $p = trim( (string) wp_parse_url( $l, PHP_URL_PATH ), '/' ); if ( $p !== '' ) { $out[ $p . '/' ] = true; } }
		return array_keys( $out );
	}

	/** Pažymi archyvų cache failus „needs-rebuild" (Super Cache pats atstato kitam lankytojui). */
	public static function archyvus_rebuild( $keliai ) {
		if ( ! $keliai || ! function_exists( 'get_supercache_dir' ) || ! function_exists( 'wpsc_rebuild_files' ) ) { return; }
		$sc = get_supercache_dir();
		foreach ( $keliai as $k ) {
			$d = $sc . $k;
			if ( ! is_dir( $d ) ) { continue; }
			wpsc_rebuild_files( $d );
			if ( is_dir( $d . 'page/' ) && function_exists( 'prune_super_cache' ) ) { prune_super_cache( $d . 'page/', true ); }
		}
	}
}
Petshop_Cache::init();
