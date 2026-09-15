<?php
/**
 * Plugin Name: Petshop Relaunch (informacinė kampanija istoriniams klientams)
 * Description: S1686 (Q4 planas, 2 punktas — „Maišas 55 €. O diena?"): (1) prekės puslapyje `?svoris=20` užpildo šėrimo skaičiuoklę ir paspaudžia „Apskaičiuoti" (tik UI, localStorage/profilio logika neliečiama); (2) `cid` — opaque atsitiktinis kampanijos tokenas (ne el. paštas, ne hash) iš `ps_relaunch_kontaktai` → paspaudimas įrašomas kaip signalas: usermeta `ps_weight_signal` (source email_calc_click, confidence medium; Pet Profile NEPERRAŠOMAS), `ps_web_ivykiai` tipas `email_calc_click`, lentelės klik_n/pask_svoris. Lentelę pildo 2 punkto skriptas (segmentai calc/product/generic, exact_product = ≤12 mėn. arba ≥3× ir ≤18 mėn.). Core neliečiamas.
 * Version: 1.0.1
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Relaunch {
	const T = 'ps_relaunch_kontaktai';
	const META = 'ps_weight_signal';

	public static function init() {
		add_action( 'init', array( __CLASS__, 'lentele' ), 5 );
		add_action( 'template_redirect', array( __CLASS__, 'paspaudimas' ), 20 );
		add_action( 'wp_footer', array( __CLASS__, 'js' ), 99 );
	}

	public static function t() { global $wpdb; return $wpdb->prefix . self::T; }

	public static function lentele() {
		if ( get_option( 'ps_relaunch_lentele_v' ) === '1' ) return; global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( "CREATE TABLE " . self::t() . " (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			cid VARCHAR(24) NOT NULL,
			email VARCHAR(191) NOT NULL,
			user_id BIGINT UNSIGNED NULL,
			segmentas VARCHAR(16) NOT NULL DEFAULT 'generic',
			product_id BIGINT UNSIGNED NULL,
			rusis VARCHAR(8) NULL,
			svoriai VARCHAR(32) NULL,
			duomenys TEXT NULL,
			sukurta_at DATETIME NOT NULL,
			klik_n INT UNSIGNED NOT NULL DEFAULT 0,
			pask_klik_at DATETIME NULL,
			pask_svoris DECIMAL(5,1) NULL,
			PRIMARY KEY (id), UNIQUE KEY cid (cid), KEY email (email), KEY segmentas (segmentas)
		) " . $wpdb->get_charset_collate() . ";" );
		update_option( 'ps_relaunch_lentele_v', '1', false );
	}

	public static function cid() { return substr( str_replace( array( '+', '/', '=' ), '', base64_encode( random_bytes( 18 ) ) ), 0, 20 ); }

	public static function svoris() {
		if ( ! isset( $_GET['svoris'] ) ) return null;
		$v = (float) str_replace( ',', '.', (string) $_GET['svoris'] );
		return ( $v >= 0.5 && $v <= 120 ) ? $v : null;
	}

	/** cid + svoris → signalas. Vieną kartą per užklausą, tik prekės puslapyje. */
	public static function paspaudimas() {
		if ( ! function_exists( 'is_product' ) || ! is_product() ) return;
		$kg = self::svoris(); $cid = isset( $_GET['cid'] ) ? preg_replace( '/[^A-Za-z0-9]/', '', (string) $_GET['cid'] ) : '';
		if ( null === $kg ) return;
		global $wpdb; $k = null; $uid = get_current_user_id();
		if ( $cid ) { $k = $wpdb->get_row( $wpdb->prepare( "SELECT id,email,user_id,segmentas FROM " . self::t() . " WHERE cid=%s", $cid ), ARRAY_A ); if ( $k && ! $uid ) $uid = (int) $k['user_id']; }
		if ( ! $k && ! $uid ) return;
		$pid = (int) get_queried_object_id(); $dabar = current_time( 'mysql', true );
		if ( $k ) $wpdb->query( $wpdb->prepare( "UPDATE " . self::t() . " SET klik_n=klik_n+1, pask_klik_at=%s, pask_svoris=%f WHERE id=%d", $dabar, $kg, $k['id'] ) );
		if ( $uid ) {
			$s = get_user_meta( $uid, self::META, true ); $s = is_array( $s ) ? $s : array();
			$s[] = array( 'weight_kg' => $kg, 'source' => 'email_calc_click', 'confidence' => 'medium', 'product_id' => $pid, 'cid' => $cid ?: null, 'at' => $dabar );
			update_user_meta( $uid, self::META, array_slice( $s, -5 ) );
		}
		if ( class_exists( 'Petshop_Analitika' ) ) {
			$wpdb->insert( Petshop_Analitika::t_ivykiai(), array(
				'laikas' => $dabar, 'diena' => method_exists( 'Petshop_Analitika', 'verslo_diena' ) ? Petshop_Analitika::verslo_diena( $dabar ) : substr( $dabar, 0, 10 ),
				'tipas' => 'email_calc_click', 'pusl_tipas' => 'product', 'url_kelias' => substr( (string) parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ), 0, 190 ),
				'raktas' => (string) $pid, 'raktas2' => $k ? $k['segmentas'] : 'login', 'reiksme' => $kg,
				'saltinis' => 'sender', 'medium' => 'email', 'kampanija' => 'relaunch', 'kanalas' => 'email',
				'irenginys' => method_exists( 'Petshop_Analitika', 'irenginys' ) ? Petshop_Analitika::irenginys( (string) ( $_SERVER['HTTP_USER_AGENT'] ?? '' ) ) : null,
				'prisijunges' => get_current_user_id() ? 1 : 0, 'sutikimas' => 0, 'testinis' => 0,
				'saltinis_aplinka' => method_exists( 'Petshop_Analitika', 'aplinka' ) ? Petshop_Analitika::aplinka() : 'prod',
			) );
		}
	}

	/** Skaičiuoklės užpildymas: laukia #ps-calc-w, įrašo svorį, paspaudžia mygtuką, priartina. */
	public static function js() {
		if ( ! function_exists( 'is_product' ) || ! is_product() ) return; $kg = self::svoris(); if ( null === $kg ) return;
		echo '<script>(function(){var kg=' . json_encode( $kg ) . ',n=0,t=setInterval(function(){var r=document.getElementById("ps-calc"),w=document.getElementById("ps-calc-w"),b=r&&r.querySelector(".ps-calc-go");n++;if(w&&b){clearInterval(t);w.value=kg;b.click();setTimeout(function(){r.scrollIntoView({behavior:"smooth",block:"start"});},250);}else if(n>40){clearInterval(t);}},100);})();</script>';
	}
}
Petshop_Relaunch::init();
