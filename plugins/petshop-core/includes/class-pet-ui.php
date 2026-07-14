<?php
/**
 * Petshop_Pet_UI — "Mano augintinis" frontend (M8, S196).
 *
 * 1. Shortcode [petshop_pet_form] — anketa (veikia ir be prisijungimo)
 * 2. MyAccount tab "Mano augintinis"
 * 3. CSS/JS assets su config (REST url, nonce, isLoggedIn)
 *
 * Anketa yra self-contained: 2 zingsniai, dinamiski laukai pagal rusi,
 * localStorage juodrastis (anonim.), magic link issaugojimas.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Pet_UI {

	const ENDPOINT = 'augintinis';  // /my-account/augintinis/
	const VERSION = '1.0.0';

	public static function init() {
		// Shortcode anketai
		add_shortcode( 'petshop_pet_form', array( __CLASS__, 'shortcode_form' ) );

		// MyAccount tab
		add_action( 'init', array( __CLASS__, 'add_endpoint' ) );
		add_filter( 'woocommerce_account_menu_items', array( __CLASS__, 'add_menu_item' ) );
		add_action( 'woocommerce_account_' . self::ENDPOINT . '_endpoint', array( __CLASS__, 'render_account_page' ) );

		// Assets
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
	}

	// --- MyAccount endpoint ---
	public static function add_endpoint() {
		add_rewrite_endpoint( self::ENDPOINT, EP_ROOT | EP_PAGES );
	}

	public static function add_menu_item( $items ) {
		// Idedam "Mano augintinis" po Dashboard (pirmas), pries Orders
		$new = array();
		foreach ( $items as $key => $label ) {
			if ( $key === 'orders' ) {
				$new[ self::ENDPOINT ] = 'Mano augintinis';
			}
			$new[ $key ] = $label;
		}
		// Jei 'orders' nerastas — idedam pabaigoj pries logout
		if ( ! isset( $new[ self::ENDPOINT ] ) ) {
			$logout = isset( $new['customer-logout'] ) ? $new['customer-logout'] : null;
			if ( $logout ) {
				unset( $new['customer-logout'] );
			}
			$new[ self::ENDPOINT ] = 'Mano augintinis';
			if ( $logout ) {
				$new['customer-logout'] = $logout;
			}
		}
		return $new;
	}

	public static function render_account_page() {
		// MyAccount viduje — profilio ekranas (JS: jei nera augintiniu -> empty state su anketa)
		echo '<div id="pspet-profile"></div>';
		echo '<div id="pspet-form" style="display:none"></div>';
	}

	// --- Shortcode ---
	public static function shortcode_form( $atts ) {
		self::enqueue_assets( true ); // force enqueue
		return '<div id="pspet-form"></div>';
	}

	// --- Assets ---
	public static function enqueue_assets( $force = false ) {
		// Iterpiam tik jei puslapyje yra shortcode arba MyAccount augintinis tab
		if ( ! $force && ! self::should_load() ) {
			return;
		}

		$base = plugins_url( 'assets/', dirname( __FILE__ ) );

		wp_enqueue_style( 'pspet-form', $base . 'pet-form.css', array(), self::VERSION );
		// Inter is Google Fonts
		wp_enqueue_style( 'pspet-inter', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap', array(), null );

		wp_enqueue_script( 'pspet-form', $base . 'pet-form.js', array(), self::VERSION, true );

		// Profilio ekranas — MyAccount puslapyje (JS pats tikrina ar yra #pspet-profile)
		if ( function_exists( 'is_account_page' ) && is_account_page() ) {
			wp_enqueue_script( 'pspet-profile', $base . 'pet-profile.js', array(), self::VERSION, true );
		}

		$config = array(
			'restUrl'     => esc_url_raw( get_rest_url( null, 'petshop/v1' ) ),
			'nonce'       => wp_create_nonce( 'wp_rest' ),
			'isLoggedIn'  => is_user_logged_in(),
			'homeUrl'     => home_url( '/' ),
			'petPageUrl'  => wc_get_account_endpoint_url( self::ENDPOINT ),
			'imagesUrl'   => plugins_url( 'assets/images/', dirname( __FILE__ ) ),
		);
		wp_localize_script( 'pspet-form', 'PSPetConfig', $config );
	}

	private static function should_load() {
		global $post;
		// Bet kuris MyAccount puslapis (page id 14) — kad augintinis tab veiktu
		if ( function_exists( 'is_account_page' ) && is_account_page() ) {
			return true;
		}
		// Puslapis su shortcode
		if ( $post && has_shortcode( $post->post_content, 'petshop_pet_form' ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Aktyvuojant plugin — flush rewrite (kad endpoint veiktu).
	 */
	public static function flush_rewrite() {
		self::add_endpoint();
		flush_rewrite_rules();
	}
}
