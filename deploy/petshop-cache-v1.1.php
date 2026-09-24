<?php
/**
 * Plugin Name: Petshop Cache v1.1 (WP Super Cache išvalymas po atsargų/kainų/importų pakeitimų)
 * Description: WP Super Cache (Simple režimas, S1555–S1557) laiko puslapius 1 h. Šis modulis išvalo cache iš karto,
 *   kai keičiasi prekės likutis/kaina/statusas, baigiasi WP All Import importas (VF/ZB), keičiasi kategorijos
 *   ar meniu — kad lankytojas nematytų pasenusio likučio/kainos. Nieko nekeičia, tik kviečia Super Cache funkcijas.
 * Version: 1.1
 * S1713 (2026-09-24, WP_CACHE įjungtas): Super Cache `wp_cache_post_change()` valo tik prekę + pradinį + /page/,
 *   bet ne kategorijų/gamintojo/parduotuvės archyvus, kuriuose rodoma kaina ir „Turime" — v1.1 po prekės pokyčio
 *   pažymi rebuild ir jos kategorijų (su tėvais), gamintojo bei /parduotuve/ katalogus (`wpsc_rebuild_files`).
 *
 * S1557 (2026-09-01). Sąmoningai be savo logikos: `wp_cache_post_change($id)` (prekė + pradinis + archyvai)
 * ir `wp_cache_clear_cache()` (viskas) — tik plugino API. Jei Super Cache išjungtas — funkcijų nėra, nieko nedaro.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Cache {
	const VERSIJA = '1.1';
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
		add_action( 'pmxi_after_xml_import', array( __CLASS__, 'viskas' ) );
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
	public static function viskas() { self::$viskas = true; }

	public static function vykdyti() {
		if ( self::$viskas ) {
			if ( function_exists( 'wp_cache_clear_cache' ) ) { wp_cache_clear_cache(); }
			self::$viskas = false; self::$laukia = array(); return;
		}
		if ( ! self::$laukia || ! function_exists( 'wp_cache_post_change' ) ) { return; }
		if ( count( self::$laukia ) > 25 ) { if ( function_exists( 'wp_cache_clear_cache' ) ) { wp_cache_clear_cache(); } self::$laukia = array(); return; }
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
