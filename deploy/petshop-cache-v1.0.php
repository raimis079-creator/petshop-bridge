<?php
/**
 * Plugin Name: Petshop Cache v1.0 (WP Super Cache išvalymas po atsargų/kainų/importų pakeitimų)
 * Description: WP Super Cache (Simple režimas, S1555–S1557) laiko puslapius 1 h. Šis modulis išvalo cache iš karto,
 *   kai keičiasi prekės likutis/kaina/statusas, baigiasi WP All Import importas (VF/ZB), keičiasi kategorijos
 *   ar meniu — kad lankytojas nematytų pasenusio likučio/kainos. Nieko nekeičia, tik kviečia Super Cache funkcijas.
 * Version: 1.0
 *
 * S1557 (2026-09-01). Sąmoningai be savo logikos: `wp_cache_post_change($id)` (prekė + pradinis + archyvai)
 * ir `wp_cache_clear_cache()` (viskas) — tik plugino API. Jei Super Cache išjungtas — funkcijų nėra, nieko nedaro.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Cache {
	const VERSIJA = '1.0';
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
		foreach ( array_keys( self::$laukia ) as $id ) { wp_cache_post_change( $id ); } // prekė + pradinis + archyvai (Super Cache logika)
		self::$laukia = array();
	}
}
Petshop_Cache::init();
