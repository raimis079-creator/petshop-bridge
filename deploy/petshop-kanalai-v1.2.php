<?php
/**
 * Plugin Name: Petshop Kanalai
 * Description: Kanalo (UTM/referer) fiksavimas WC sesijoje ir perkelimas i uzsakyma. Master planas v1.3 §4.7 minimumas (E1a).
 * Version: 1.2
 *
 * v1.2 (2026-09-10, S1669, Raimio sprendimas): Google Ads kampanijos ID is
 *   `gad_campaignid` (Ads auto-tagging) -> `utm_campaign`, jei UTM kampanijos
 *   nuorodoje nera. Reiksme — tik skaitmenys (Ads kampanijos ID).
 *
 * KODEL SIS MODULIS. E0 recon rado, kad `utm_` neminimas NE VIENAME is 137
 * projekto failu — kanalo faktas neuzfiksuojamas niekur. Be jo North Star
 * („ne-mokamu pajamu dalis") nematuojamas, o Google Ads „prisirasa" 72,5 %
 * pajamu (TZ v1.39). Sis modulis fiksuoja PIRMA ir PASKUTINI prisilietima
 * pardavimo momentu — po metu jie nebeatkuriami.
 *
 * Q1 SPRENDIMAS (planas §4.7): naujo slapuko NEKURIAM. Naudojam WooCommerce
 * sesija — tai jau egzistuojantis BUTINAS slapukas (krepseliui), sutikimo
 * nereikalauja. Sesijos slapukas priverstinai startuojamas TIK tada, kai yra
 * ka issaugoti (yra utm/gclid/isorinis referer) — ne kiekvienam lankytojui.
 *
 * TRUKUMAS (samoningas, planas §4.7): WC sesija gyvena ~48 val. Klientas,
 * atejes is reklamos ir pirkes po 3 dienu, taps „direct". 30 d. langas su
 * sutikimu — E2 (`petshop-analitika.php`).
 *
 * E2 PERKELIMAS: sis failas yra E1a MINIMUMAS. E2 metu `petshop-analitika.php`
 * perima rinkima; cia liks tik uzsakymo meta rasymas. Kontraktas
 * (`_ps_kanalai` JSON raktai) NESIKEIS.
 *
 * LAIKO ZONA (v1.1): `laikas` ir `fiksuota_at` — UTC, kaip ir `ps_fakt_*`
 * bei visas petshop-core sluoksnis (`ps_carts`, `ps_email_jobs`).
 *
 * @package Petshop
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Kanalai {

	const VERSIJA = '1.2';
	const SESIJA    = 'ps_kanalai';
	const META      = '_ps_kanalai';
	const OPT_TAISYKLES = 'ps_fakt_kanalu_taisykles';

	/** UTM raktai, kuriuos priimam. Kiti ignoruojami samoningai. */
	const UTM = array( 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term' );

	public static function init() {
		add_action( 'woocommerce_init', array( __CLASS__, 'pagauti' ), 1 );
		add_action( 'woocommerce_checkout_create_order', array( __CLASS__, 'i_uzsakyma' ), 21, 2 );
		add_action( 'woocommerce_store_api_checkout_order_processed', array( __CLASS__, 'i_uzsakyma_api' ), 21, 1 );
	}

	/* ================================================================== */
	/* 1) RINKIMAS                                                        */
	/* ================================================================== */

	/**
	 * Pirmas prisilietimas irasomas VIENA KARTA ir nebekeiciamas.
	 * Paskutinis perrasomas kiekvieno naujo saltinio metu.
	 */
	public static function pagauti() {
		if ( is_admin() || wp_doing_cron() || wp_doing_ajax() ) { return; }
		if ( ! function_exists( 'WC' ) || ! WC()->session ) { return; }

		$dabar = self::is_uzklausos();
		if ( $dabar === null ) { return; }   /* nera ka saugoti */

		/* Sesijos slapukas startuojamas TIK cia — kai tikrai yra duomenu. */
		if ( ! WC()->session->has_session() ) {
			WC()->session->set_customer_session_cookie( true );
		}

		$k = WC()->session->get( self::SESIJA );
		if ( ! is_array( $k ) ) { $k = array(); }

		if ( empty( $k['pirmas'] ) ) {
			$k['pirmas'] = $dabar;
		}
		$k['paskutinis'] = $dabar;
		WC()->session->set( self::SESIJA, $k );
	}

	/**
	 * Vieno prisilietimo momentine nuotrauka.
	 * @return array|null null = nera nieko verto irasyti (vidinis perejimas)
	 */
	private static function is_uzklausos() {
		$t = array();
		foreach ( self::UTM as $r ) {
			if ( isset( $_GET[ $r ] ) ) {
				$v = sanitize_text_field( wp_unslash( $_GET[ $r ] ) );
				if ( $v !== '' ) { $t[ $r ] = mb_substr( $v, 0, 96 ); }
			}
		}
		/* v1.2: Google Ads kampanijos ID (auto-tagging) -> utm_campaign, jei UTM kampanijos nera. */
		if ( empty( $t['utm_campaign'] ) && isset( $_GET['gad_campaignid'] ) ) {
			$gc = preg_replace( '/\D/', '', (string) wp_unslash( $_GET['gad_campaignid'] ) );
			if ( $gc !== '' ) { $t['utm_campaign'] = mb_substr( $gc, 0, 32 ); }
		}
		/* gclid/fbclid — TIK faktas 0/1, pati reiksme nesaugoma (planas §4.7). */
		$t['gclid']  = isset( $_GET['gclid'] ) ? 1 : 0;
		$t['fbclid'] = isset( $_GET['fbclid'] ) ? 1 : 0;

		$ref = isset( $_SERVER['HTTP_REFERER'] ) ? esc_url_raw( wp_unslash( $_SERVER['HTTP_REFERER'] ) ) : '';
		$rd  = '';
		if ( $ref !== '' ) {
			$h = wp_parse_url( $ref, PHP_URL_HOST );
			$s = wp_parse_url( home_url(), PHP_URL_HOST );
			if ( $h && $h !== $s && $h !== 'www.' . $s && ( 'www.' . $h ) !== $s ) {
				$rd = mb_substr( strtolower( $h ), 0, 190 );
			}
		}
		$t['referer_domenas'] = $rd;

		$turi_utm = false;
		foreach ( self::UTM as $r ) { if ( ! empty( $t[ $r ] ) ) { $turi_utm = true; break; } }
		if ( ! $turi_utm && ! $t['gclid'] && ! $t['fbclid'] && $rd === '' ) {
			return null;   /* vidinis perejimas arba tiesioginis — nieko nekeiciam */
		}

		$t['landing_url'] = mb_substr( self::dabartinis_url(), 0, 255 );
		$t['laikas']      = current_time( 'mysql', true );
		$t['kanalas']     = self::klasifikuoti( $t );
		return $t;
	}

	private static function dabartinis_url() {
		$u = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/';
		return esc_url_raw( home_url( $u ) );
	}

	/* ================================================================== */
	/* 2) KLASIFIKACIJA                                                   */
	/* ================================================================== */

	/**
	 * Taisykles gyvena NUSTATYME, ne kode (planas §4.7) — Raimis gali keisti
	 * be deploy'o. Kodas turi tik atsargini rinkini.
	 */
	public static function taisykles() {
		$j = get_option( self::OPT_TAISYKLES, '' );
		$t = is_string( $j ) ? json_decode( $j, true ) : ( is_array( $j ) ? $j : null );
		if ( is_array( $t ) && ! empty( $t ) ) { return $t; }
		return self::numatytosios();
	}

	public static function numatytosios() {
		return array(
			/* Q2: Kaina24 ir Kainos.lt = CPC 0,08 EUR + PVM -> MOKAMI. */
			'mokamas'      => array(
				'utm_medium' => array( 'cpc', 'ppc', 'paid', 'paidsocial', 'display', 'shopping', 'cpm' ),
				'utm_source' => array( 'kaina24', 'kainos', 'kainos.lt', 'google_ads', 'facebook_ads' ),
				'referer'    => array( 'kaina24.lt', 'www.kaina24.lt', 'kainos.lt', 'www.kainos.lt' ),
				'gclid'      => 1,
				'fbclid'     => 1,
			),
			'email'        => array(
				'utm_medium' => array( 'email', 'e-mail', 'newsletter' ),
				'utm_source' => array( 'sender', 'petshop' ),
			),
			'organika'     => array(
				'utm_medium' => array( 'organic' ),
				'referer'    => array( 'google.com', 'www.google.com', 'google.lt', 'www.google.lt', 'bing.com', 'duckduckgo.com', 'search.yahoo.com', 'ecosia.org' ),
			),
			'soc_organika' => array(
				'utm_medium' => array( 'social', 'social-organic' ),
				'referer'    => array( 'facebook.com', 'm.facebook.com', 'l.facebook.com', 'instagram.com', 'l.instagram.com', 'youtube.com', 'tiktok.com', 'lm.facebook.com' ),
			),
		);
	}

	/**
	 * Eiles tvarka svarbi: mokamas tikrinamas PIRMAS (gclid ant google.com
	 * referer'io yra reklama, ne organika).
	 */
	public static function klasifikuoti( $t ) {
		$taisykles = self::taisykles();
		$med = isset( $t['utm_medium'] ) ? strtolower( (string) $t['utm_medium'] ) : '';
		$src = isset( $t['utm_source'] ) ? strtolower( (string) $t['utm_source'] ) : '';
		$ref = isset( $t['referer_domenas'] ) ? strtolower( (string) $t['referer_domenas'] ) : '';

		foreach ( array( 'mokamas', 'email', 'soc_organika', 'organika' ) as $kanalas ) {
			if ( empty( $taisykles[ $kanalas ] ) ) { continue; }
			$r = $taisykles[ $kanalas ];
			if ( ! empty( $r['gclid'] ) && ! empty( $t['gclid'] ) ) { return $kanalas; }
			if ( ! empty( $r['fbclid'] ) && ! empty( $t['fbclid'] ) ) { return $kanalas; }
			if ( $med !== '' && ! empty( $r['utm_medium'] ) && in_array( $med, array_map( 'strtolower', (array) $r['utm_medium'] ), true ) ) { return $kanalas; }
			if ( $src !== '' && ! empty( $r['utm_source'] ) && in_array( $src, array_map( 'strtolower', (array) $r['utm_source'] ), true ) ) { return $kanalas; }
			if ( $ref !== '' && ! empty( $r['referer'] ) && in_array( $ref, array_map( 'strtolower', (array) $r['referer'] ), true ) ) { return $kanalas; }
		}

		if ( $med !== '' || $src !== '' ) { return 'referral'; }
		if ( $ref !== '' ) { return 'referral'; }
		return 'direct';
	}

	/* ================================================================== */
	/* 3) I UZSAKYMA                                                      */
	/* ================================================================== */

	public static function i_uzsakyma( $order, $duomenys = null ) {
		if ( ! is_object( $order ) ) { return; }
		if ( $order->get_meta( self::META ) ) { return; }   /* jau irasyta */

		$k = array();
		if ( function_exists( 'WC' ) && WC()->session ) {
			$s = WC()->session->get( self::SESIJA );
			if ( is_array( $s ) ) { $k = $s; }
		}
		$k['sutikimas_statistika'] = self::sutikimas() ? 1 : 0;
		$k['fiksuota_at']          = current_time( 'mysql', true );
		$k['modulis']              = 'kanalai/' . self::VERSIJA;

		/* Tuscias kanalas irgi FAKTAS — „direct" turi buti irasytas, ne NULL. */
		if ( empty( $k['paskutinis'] ) ) {
			$k['paskutinis'] = array(
				'kanalas'         => 'direct',
				'gclid'           => 0,
				'fbclid'          => 0,
				'referer_domenas' => '',
				'laikas'          => current_time( 'mysql', true ),
			);
		}
		if ( empty( $k['pirmas'] ) ) { $k['pirmas'] = $k['paskutinis']; }

		$order->update_meta_data( self::META, wp_json_encode( $k, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) );
	}

	public static function i_uzsakyma_api( $order ) {
		self::i_uzsakyma( $order );
		if ( is_object( $order ) && method_exists( $order, 'save' ) ) { $order->save(); }
	}

	/** Complianz statistikos sutikimas — tas pats sluoksnis kaip statistikoje. */
	public static function sutikimas() {
		if ( class_exists( 'Petshop_Statistika' ) && method_exists( 'Petshop_Statistika', 'sutikimas' ) ) {
			return (bool) Petshop_Statistika::sutikimas();
		}
		return false;
	}

	/** Skaitymas is uzsakymo — naudoja `petshop-faktai.php`. */
	public static function is_uzsakymo( $order ) {
		if ( ! is_object( $order ) ) { return array(); }
		$raw = $order->get_meta( self::META );
		if ( is_array( $raw ) ) { return $raw; }
		$d = json_decode( (string) $raw, true );
		return is_array( $d ) ? $d : array();
	}
}

Petshop_Kanalai::init();
