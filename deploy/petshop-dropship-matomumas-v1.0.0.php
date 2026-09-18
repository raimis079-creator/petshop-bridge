<?php
/**
 * Plugin Name: Petshop Dropship Matomumas
 * Description: Dropship (VF/ZB) prekė be likučio → katalogo matomumas „hidden" (URL lieka 200, „Pranešti kai bus" veikia, SEO nepraranda); likučiui grįžus → vėl matoma. Išimtis: prekė su pardavimais per 365 d. arba su laukiančiais ps_stock_watch — lieka matoma. Raimio taisyklė 2026-09-18 (S1691).
 * Version: 1.0.0
 *
 * KODĖL: 2026-06-14 taisyklė (petshop-xml v1.5.15) laikė buvusias publish dropship
 * prekes su qty=0 pilnai matomas (SEO + paklausa). 09-18 kataloge buvo 297 tokios
 * prekės (VF 198, ZB 99), iš jų perkamų per metus — 6. Raimis: dropship publikuojama
 * tik su likučiu, bet turinčios istoriją lieka (klientai spaudžia „Pranešti kai bus").
 * „hidden" vietoj draft: draft = 404 = SEO nuostolis ir nėra „Pranešti kai bus" formos.
 *
 * KAIP: WC product_visibility terminai `exclude-from-catalog` + `exclude-from-search`
 * (kiti terminai — outofstock/featured/rated — neliečiami). Žymė `_ps_dropship_paslepta=1`
 * — atidengiame TIK tai, ką patys paslėpėme (rankiniu būdu paslėptos prekės neliečiamos).
 * Dropship = `_ps_sandelis` IN (vf, zb) ir AV likutis (`_own_stock_qty`) <= 0.
 * Keliai: (1) `woocommerce_product_set_stock_status` kablys; (2) valandinis peržiūrėjimas
 * (importas gali rašyti meta apeidamas kablį). Žurnalas: opcija `ps_dropship_matomumas_pask`.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Dropship_Matomumas {

	const VERSIJA   = '1.0.0';
	const META      = '_ps_dropship_paslepta';
	const CRON      = 'ps_dropship_matomumas_valanda';
	const OPCIJA    = 'ps_dropship_matomumas_pask';
	const SANDELIAI = array( 'vf', 'zb' );
	const DIENOS    = 365; // pardavimų langas išimčiai

	public static function init() {
		add_action( 'woocommerce_product_set_stock_status', array( __CLASS__, 'statusas_pasikeite' ), 30, 3 );
		add_action( self::CRON, array( __CLASS__, 'perziureti' ) );
		add_action( 'init', array( __CLASS__, 'planuoti' ) );
	}

	public static function planuoti() {
		if ( ! wp_next_scheduled( self::CRON ) ) {
			// :15 kas valandą — po VF likučių sinchronizacijos (:59) ir ZB importo (03:01)
			$t = strtotime( gmdate( 'Y-m-d H:15:00' ) ); if ( $t <= time() ) { $t += HOUR_IN_SECONDS; }
			wp_schedule_event( $t, 'hourly', self::CRON );
		}
	}

	/* ------------------------------------------------------------------ */
	/* Sprendimas vienai prekei                                            */
	/* ------------------------------------------------------------------ */

	public static function ar_dropship( $pid ) {
		$s = (string) get_post_meta( $pid, '_ps_sandelis', true );
		if ( ! in_array( $s, self::SANDELIAI, true ) ) { return false; }
		if ( (int) get_post_meta( $pid, '_own_stock_qty', true ) > 0 ) { return false; }
		return true;
	}

	/** Išimtis: pardavimai per 365 d. (istorija + WC) arba laukiantys „Pranešti kai bus". */
	public static function turi_istorija( $pid ) {
		global $wpdb; $p = $wpdb->prefix; $pid = (int) $pid;
		$n = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(*) FROM {$p}ps_ist_eilutes e JOIN {$p}ps_ist_uzsakymai u ON u.id=e.uzsakymo_id
			 WHERE e.wc_product_id=%d AND u.ivykdytas=1 AND u.data>=NOW()-INTERVAL %d DAY", $pid, self::DIENOS ) );
		if ( $n > 0 ) { return 'istorija'; }
		$n = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(*) FROM {$p}wc_order_product_lookup l JOIN {$p}wc_orders o ON o.id=l.order_id
			 WHERE l.product_id=%d AND o.status IN ('wc-processing','wc-completed') AND o.date_created_gmt>=NOW()-INTERVAL %d DAY", $pid, self::DIENOS ) );
		if ( $n > 0 ) { return 'wc'; }
		$t = $p . 'ps_stock_watch';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) === $t ) {
			$n = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $t WHERE product_id=%d AND status='waiting'", $pid ) );
			if ( $n > 0 ) { return 'laukia'; }
		}
		return '';
	}

	public static function paslepta_musu( $pid ) { return (string) get_post_meta( $pid, self::META, true ) === '1'; }

	public static function paslepti( $pid ) {
		wp_set_object_terms( $pid, array( 'exclude-from-catalog', 'exclude-from-search' ), 'product_visibility', true );
		update_post_meta( $pid, self::META, '1' );
		update_post_meta( $pid, self::META . '_nuo', current_time( 'mysql' ) );
		self::valyti( $pid );
	}

	public static function atidengti( $pid ) {
		wp_remove_object_terms( $pid, array( 'exclude-from-catalog', 'exclude-from-search' ), 'product_visibility' );
		delete_post_meta( $pid, self::META );
		delete_post_meta( $pid, self::META . '_nuo' );
		self::valyti( $pid );
	}

	private static function valyti( $pid ) {
		clean_post_cache( $pid );
		if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $pid ); }
	}

	/**
	 * Vienos prekės sprendimas. Grąžina: 'paslepta' | 'atidengta' | '' (nieko).
	 * $dry — tik sprendimas, be rašymo.
	 */
	public static function spresti( $pid, $dry = false ) {
		$pid = (int) $pid;
		if ( 'publish' !== get_post_status( $pid ) || 'product' !== get_post_type( $pid ) ) { return ''; }
		$product = wc_get_product( $pid ); if ( ! $product ) { return ''; }
		$musu = self::paslepta_musu( $pid );
		if ( ! self::ar_dropship( $pid ) ) {
			// nebe dropship (pvz. atsirado AV likutis) — jei slėpėme mes, atidengti
			if ( $musu ) { if ( ! $dry ) { self::atidengti( $pid ); } return 'atidengta'; }
			return '';
		}
		$yra = $product->is_in_stock();
		if ( $yra ) {
			if ( $musu ) { if ( ! $dry ) { self::atidengti( $pid ); } return 'atidengta'; }
			return '';
		}
		// nėra likučio
		if ( $musu ) { return ''; }
		if ( self::turi_istorija( $pid ) ) { return ''; }
		if ( 'hidden' === $product->get_catalog_visibility() ) { return ''; } // paslėpta rankomis — neliečiam
		if ( ! $dry ) { self::paslepti( $pid ); }
		return 'paslepta';
	}

	/* ------------------------------------------------------------------ */
	/* Kabliai                                                             */
	/* ------------------------------------------------------------------ */

	public static function statusas_pasikeite( $product_id, $stock_status, $product ) {
		if ( ! $product_id ) { return; }
		$pid = $product->is_type( 'variation' ) ? $product->get_parent_id() : (int) $product_id;
		if ( ! $pid ) { return; }
		$r = self::spresti( $pid );
		if ( $r ) { self::zurnalas( array( 'kablys' => $pid . ':' . $r ) ); }
	}

	/** Valandinis peržiūrėjimas visų publish dropship prekių + mūsų paslėptų. */
	public static function perziureti( $dry = false ) {
		global $wpdb; $p = $wpdb->prefix; @set_time_limit( 280 );
		$in = "'" . implode( "','", array_map( 'esc_sql', self::SANDELIAI ) ) . "'";
		$ids = $wpdb->get_col( "SELECT DISTINCT ps.ID FROM {$p}posts ps
			JOIN {$p}postmeta s ON s.post_id=ps.ID AND s.meta_key='_ps_sandelis' AND s.meta_value IN ($in)
			WHERE ps.post_type='product' AND ps.post_status='publish'" );
		$musu = $wpdb->get_col( "SELECT post_id FROM {$p}postmeta WHERE meta_key='" . self::META . "' AND meta_value='1'" );
		$ids = array_unique( array_map( 'intval', array_merge( $ids, $musu ) ) );
		$rez = array( 'laikas' => current_time( 'mysql' ), 'dry' => $dry, 'tikrinta' => count( $ids ), 'paslepta' => 0, 'atidengta' => 0, 'pvz' => array() );
		foreach ( $ids as $pid ) {
			$r = self::spresti( $pid, $dry );
			if ( $r ) { $rez[ $r ]++; if ( count( $rez['pvz'] ) < 15 ) { $rez['pvz'][] = $pid . ':' . $r; } }
		}
		if ( ! $dry ) { self::zurnalas( $rez ); }
		return $rez;
	}

	private static function zurnalas( $d ) {
		$o = (array) get_option( self::OPCIJA, array() );
		$o = array_merge( $o, $d ); $o['laikas'] = current_time( 'mysql' );
		update_option( self::OPCIJA, $o, false );
	}
}
Petshop_Dropship_Matomumas::init();
