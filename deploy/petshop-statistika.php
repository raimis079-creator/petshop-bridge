<?php
/**
 * Plugin Name: Petshop Statistika
 * Description: Elgsenos ivykiai (surenkamos dezes) ir savikainos fiksavimas pardavimo momentu.
 * Version: 1.0
 *
 * Du sluoksniai, sąmoningai atskirti:
 *
 * 1) PARDAVIMAI. Savikaina irasoma i uzsakymo eilute PARDAVIMO MOMENTU
 *    (`_ps_savikaina_vnt`). Be to perskaiciavus tiekejo savikaina pasikeistu ir
 *    praejusio menesio marza — istorija taptu netikra (savininko sprendimas
 *    2026-08-15). Galioja VISOMS eilutems: surenkamoms, paruostoms, dovanoms.
 *
 * 2) ELGSENA. Kliento veiksmai vitrinoje — savo lentele `ps_laukai_ivykiai`.
 *    NEMAISYTI su `ps_ivykiai` (ten prekiu auditas: kas keite kaina/likuti).
 *    Neapdoroti ivykiai laikomi 90 d., paros suvestines — neribotai.
 *
 * Statistikos pradzia — NUSTATYMAS (`ps_stat_pradzia`), ne konstanta: skaiciuojam
 * nuo produkcijos paleidimo, o data gali slinkti i abi puses.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Statistika {

	const VERSIJA         = '1.0';
	const SCHEMOS_RAKTAS  = 'ps_stat_schema';
	const SCHEMOS_VERSIJA = 1;

	const META_SAVIKAINA  = '_ps_savikaina_vnt';
	const META_SAV_SALTINIS = '_ps_savikaina_saltinis';
	const OPT_PRADZIA     = 'ps_stat_pradzia';

	/** Neapdoroti ivykiai — 90 dienu (savininko sprendimas). */
	const ZALIU_DIENOS = 90;

	public static function init() {
		add_action( 'init', array( __CLASS__, 'uztikrinti_lentele' ) );

		/* --- 1) savikaina i uzsakymo eilute --- */
		add_action( 'woocommerce_checkout_create_order_line_item', array( __CLASS__, 'savikaina_i_eilute' ), 20, 4 );
		/* Uzsakymai, kuriami ne per checkout (admin, API) — tas pats snapshot'as. */
		add_action( 'woocommerce_new_order_item', array( __CLASS__, 'savikaina_naujam_item' ), 20, 3 );

		/* --- 2) elgsenos ivykiai --- */
		add_action( 'wp_ajax_ps_stat_ivykis', array( __CLASS__, 'ajax_ivykis' ) );
		add_action( 'wp_ajax_nopriv_ps_stat_ivykis', array( __CLASS__, 'ajax_ivykis' ) );

		/* Valymas kartą per parą. */
		add_action( 'ps_stat_valymas', array( __CLASS__, 'valyti' ) );
		if ( ! wp_next_scheduled( 'ps_stat_valymas' ) ) {
			wp_schedule_event( time() + 3600, 'daily', 'ps_stat_valymas' );
		}
	}

	/* ==================== LENTELE ==================== */

	public static function lentele() {
		global $wpdb;
		return $wpdb->prefix . 'ps_laukai_ivykiai';
	}

	public static function uztikrinti_lentele() {
		if ( (int) get_option( self::SCHEMOS_RAKTAS ) === self::SCHEMOS_VERSIJA ) { return; }
		global $wpdb;
		$t = self::lentele();
		$c = $wpdb->get_charset_collate();
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( "CREATE TABLE $t (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			laikas DATETIME NOT NULL,
			sesija CHAR(32) NOT NULL DEFAULT '',
			sritis VARCHAR(24) NOT NULL DEFAULT 'laukai',
			deze_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			preke_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			tipas VARCHAR(24) NOT NULL DEFAULT '',
			verte VARCHAR(64) NOT NULL DEFAULT '',
			aplinka VARCHAR(8) NOT NULL DEFAULT 'dev',
			PRIMARY KEY (id),
			KEY laikas (laikas),
			KEY deze (deze_id, tipas),
			KEY preke (preke_id, tipas),
			KEY sesija (sesija)
		) $c;" );
		update_option( self::SCHEMOS_RAKTAS, self::SCHEMOS_VERSIJA, false );
	}

	/* ==================== 1) SAVIKAINA PARDAVIMO MOMENTU ==================== */

	/**
	 * Savikaina imama is to paties saltinio, kaip visur kitur sistemoje, ir
	 * IRASOMA i eilute. Nezinoma savikaina zymima atskirai — geriau matyti
	 * spraga, nei skaiciuoti 100 % marza is nulio.
	 */
	public static function savikaina_preke( $pid ) {
		if ( class_exists( 'Petshop_Pardavimai' ) && method_exists( 'Petshop_Pardavimai', 'savikaina' ) ) {
			$s = Petshop_Pardavimai::savikaina( $pid );
			if ( $s !== null && $s !== '' && (float) $s > 0 ) { return array( (float) $s, 'pardavimai' ); }
		}
		foreach ( array( '_ps_savikaina', '_wc_cog_cost', '_alg_wc_cog_cost' ) as $raktas ) {
			$s = get_post_meta( $pid, $raktas, true );
			if ( $s !== '' && (float) $s > 0 ) { return array( (float) $s, $raktas ); }
		}
		return array( null, 'nezinoma' );
	}

	public static function savikaina_i_eilute( $item, $raktas, $reiksmes, $order ) {
		$pid = $item->get_variation_id() ? $item->get_variation_id() : $item->get_product_id();
		if ( ! $pid ) { return; }
		list( $sav, $saltinis ) = self::savikaina_preke( $pid );
		$item->add_meta_data( self::META_SAVIKAINA, $sav === null ? '' : wc_format_decimal( $sav, 4 ), true );
		$item->add_meta_data( self::META_SAV_SALTINIS, $saltinis, true );
	}

	/** Uzsakymai ne is checkout (admin, API, importas). */
	public static function savikaina_naujam_item( $item_id, $item, $order_id ) {
		if ( ! is_a( $item, 'WC_Order_Item_Product' ) ) { return; }
		if ( wc_get_order_item_meta( $item_id, self::META_SAVIKAINA, true ) !== '' ) { return; }
		$pid = $item->get_variation_id() ? $item->get_variation_id() : $item->get_product_id();
		if ( ! $pid ) { return; }
		list( $sav, $saltinis ) = self::savikaina_preke( $pid );
		wc_add_order_item_meta( $item_id, self::META_SAVIKAINA, $sav === null ? '' : wc_format_decimal( $sav, 4 ), true );
		wc_add_order_item_meta( $item_id, self::META_SAV_SALTINIS, $saltinis, true );
	}

	/* ==================== 2) ELGSENOS IVYKIAI ==================== */

	/** dev ivykiai zymimi atskirai, kad nesusimaisytu su produkcija. */
	public static function aplinka() {
		$h = wp_parse_url( home_url(), PHP_URL_HOST );
		return ( $h === 'petshop.lt' || $h === 'www.petshop.lt' ) ? 'prod' : 'dev';
	}

	/** Anoniminis sesijos raktas: be IP, be asmens duomenu. */
	public static function sesija() {
		if ( ! session_id() && ! headers_sent() ) { /* sesiju nekuriam */ }
		$c = isset( $_COOKIE['ps_stat_s'] ) ? sanitize_key( $_COOKIE['ps_stat_s'] ) : '';
		if ( strlen( $c ) === 32 ) { return $c; }
		return '';
	}

	public static function irasyti( $tipas, $args = array() ) {
		global $wpdb;
		$tipas = sanitize_key( $tipas );
		if ( $tipas === '' ) { return false; }
		return (bool) $wpdb->insert( self::lentele(), array(
			'laikas'   => current_time( 'mysql' ),
			'sesija'   => isset( $args['sesija'] ) ? substr( sanitize_key( $args['sesija'] ), 0, 32 ) : self::sesija(),
			'sritis'   => isset( $args['sritis'] ) ? sanitize_key( $args['sritis'] ) : 'laukai',
			'deze_id'  => isset( $args['deze'] ) ? (int) $args['deze'] : 0,
			'preke_id' => isset( $args['preke'] ) ? (int) $args['preke'] : 0,
			'tipas'    => $tipas,
			'verte'    => isset( $args['verte'] ) ? substr( (string) $args['verte'], 0, 64 ) : '',
			'aplinka'  => self::aplinka(),
		), array( '%s','%s','%s','%d','%d','%s','%s','%s' ) );
	}

	/**
	 * Vitrina siuncia ivykius paketais. Sutikimo tikrinimas — Complianz
	 * statistikos kategorija; be sutikimo neraso NIEKO.
	 */
	public static function ajax_ivykis() {
		if ( ! self::sutikimas() ) { wp_send_json_success( array( 'praleista' => 'nera sutikimo' ) ); }
		$raw = isset( $_POST['ivykiai'] ) ? wp_unslash( $_POST['ivykiai'] ) : '';
		$sar = json_decode( (string) $raw, true );
		if ( ! is_array( $sar ) ) { wp_send_json_error( 'blogas formatas' ); }
		$sesija = isset( $_POST['sesija'] ) ? substr( sanitize_key( $_POST['sesija'] ), 0, 32 ) : '';
		$n = 0;
		foreach ( array_slice( $sar, 0, 50 ) as $iv ) {
			if ( empty( $iv['tipas'] ) ) { continue; }
			$n += self::irasyti( $iv['tipas'], array(
				'sesija' => $sesija,
				'deze'   => $iv['deze'] ?? 0,
				'preke'  => $iv['preke'] ?? 0,
				'verte'  => $iv['verte'] ?? '',
			) ) ? 1 : 0;
		}
		wp_send_json_success( array( 'irasyta' => $n ) );
	}

	/** Complianz statistikos sutikimas. Nera plugino — laikom, kad sutikimo nera. */
	public static function sutikimas() {
		if ( function_exists( 'cmplz_has_consent' ) ) { return (bool) cmplz_has_consent( 'statistics' ); }
		return false;
	}

	/* ==================== PRADZIA IR VALYMAS ==================== */

	/** Grazina Y-m-d arba '' — data yra NUSTATYMAS, ne konstanta kode. */
	public static function pradzia() {
		$d = (string) get_option( self::OPT_PRADZIA, '' );
		return preg_match( '/^\d{4}-\d{2}-\d{2}$/', $d ) ? $d : '';
	}

	public static function valyti() {
		global $wpdb;
		$t = self::lentele();
		$riba = gmdate( 'Y-m-d H:i:s', time() - ( self::ZALIU_DIENOS * DAY_IN_SECONDS ) );
		return (int) $wpdb->query( $wpdb->prepare( "DELETE FROM $t WHERE laikas < %s", $riba ) );
	}
}

Petshop_Statistika::init();
