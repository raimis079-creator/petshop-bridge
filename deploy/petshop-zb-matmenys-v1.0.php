<?php
/**
 * Plugin Name: Petshop ZB matmenys v1.0 (ZB feed'o matmenų nenaudoti)
 * Description: ZB (Žalioji Banga) XML matmenys nepatikimi (0×0×0, metrai vietoj cm, 20×20×20 nuo 2 iki 12 kg, maišai
 *   80 cm), o Venipak pluginas pagal juos atmeta paštomatą (riba 61×41×39,5 cm) — 12–20 kg maišai kasoje gaudavo tik
 *   kurjerį, nors į paštomatą telpa (Raimis, 2026-09-24). Šis modulis ZB prekėms (`_zb_enabled=yes` arba
 *   `_ps_sandelis=zb`) neleidžia išsaugoti WC matmenų `_length/_width/_height`: `petshop-xml` importas juos rašo per
 *   `update_post_meta`, todėl `added/updated_post_meta` kabliai juos iškart ištrina. Žali ZB laukai `_zb_length` ir kt.
 *   lieka. Paštomato galimybę toliau lemia svoris (Venipak inst. riba) ir varnelė „Tik kurjeriu".
 * Version: 1.0
 * S1716 (2026-09-25). Išjungti: opcija `ps_zb_matmenys_isjungta`=1. Kopija prieš valymą: `ps-archyvas/zb_matmenys_s1716.json`
 *   ir opcija `ps_s1716_zb_matmenys_bak`.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_ZB_Matmenys {
	const RAKTAI = array( '_length', '_width', '_height' );
	private static $vyksta = false;

	public static function init() {
		add_action( 'added_post_meta', array( __CLASS__, 'meta' ), 10, 4 );
		add_action( 'updated_post_meta', array( __CLASS__, 'meta' ), 10, 4 );
	}

	public static function zb( $pid ) {
		$pid = (int) $pid; if ( $pid <= 0 ) { return false; }
		if ( get_post_meta( $pid, '_zb_enabled', true ) === 'yes' ) { return true; }
		return strtolower( (string) get_post_meta( $pid, '_ps_sandelis', true ) ) === 'zb';
	}

	public static function meta( $meta_id, $pid, $key, $value ) {
		if ( self::$vyksta || ! in_array( $key, self::RAKTAI, true ) ) { return; }
		if ( get_option( 'ps_zb_matmenys_isjungta' ) ) { return; }
		$tipas = get_post_type( $pid );
		if ( $tipas !== 'product' && $tipas !== 'product_variation' ) { return; }
		$pid_t = ( $tipas === 'product_variation' ) ? (int) wp_get_post_parent_id( $pid ) : (int) $pid;
		if ( ! self::zb( $pid_t ) ) { return; }
		self::$vyksta = true;
		delete_post_meta( $pid, $key );
		self::$vyksta = false;
	}

	/** ZB prekės su WC matmenimis: [id => [l,w,h]] */
	public static function sarasas() {
		global $wpdb; $out = array();
		$ids = $wpdb->get_col( "SELECT DISTINCT p.ID FROM {$wpdb->posts} p JOIN {$wpdb->postmeta} m ON m.post_id=p.ID AND m.meta_key IN ('_length','_width','_height') AND m.meta_value<>'' WHERE p.post_type IN ('product','product_variation')" );
		foreach ( $ids as $id ) {
			$id = (int) $id; $t = ( get_post_type( $id ) === 'product_variation' ) ? (int) wp_get_post_parent_id( $id ) : $id;
			if ( ! self::zb( $t ) ) { continue; }
			$out[ $id ] = array( get_post_meta( $id, '_length', true ), get_post_meta( $id, '_width', true ), get_post_meta( $id, '_height', true ) );
		}
		return $out;
	}

	/** Vienkartinis valymas pagal sarasas(); senos reikšmės — opcijoje. Grąžina išvalytų skaičių. */
	public static function isvalyti( $sarasas, $bak_opcija = 'ps_s1716_zb_matmenys_bak' ) {
		$bak = get_option( $bak_opcija, array() ); $n = 0;
		foreach ( $sarasas as $id => $d ) {
			$bak[ $id ] = $d;
			self::$vyksta = true;
			foreach ( self::RAKTAI as $k ) { delete_post_meta( (int) $id, $k ); }
			self::$vyksta = false;
			if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( (int) $id ); }
			$n++;
		}
		update_option( $bak_opcija, $bak, false );
		return $n;
	}
}
Petshop_ZB_Matmenys::init();