<?php
/**
 * Plugin Name: Petshop Pakartoti tą patį (refill_due laiškas)
 * Description: S1685 (Q4 planas, lifecycle etapas 1): refill_due laiškas „Pakartoti tą patį" — v1.1.0 GRUPUOJA PAGAL PASKUTINĮ UŽSAKYMĄ (Raimio sprendimas 09-15): laiške visos to užsakymo sekamos maisto prekės su kiekiais ir dabartinėmis kainomis, vienas mygtukas → endpoint'as /?ps_pakartoti=<order>&z=<hmac> sudeda viską į krepšelį ir veda į kasą; kiti to paties užsakymo refill_due laiškai per 45 d. praleidžiami (terminal `pakartoti_jau_siustas`). Šablonas: mu-plugins/ps-sablonai/refill-pakartoti.php (core refill.php neliečiamas). Prekė ne sandėlyje → praleidžiama iš sąrašo; jei nė vienos — laiškas atidedamas.
 * v1.1.1: Mix-and-Match rinkiniai — konteinerio eilutė rodoma viena (kaina iš užsakymo), komponentų eilutės praleidžiamos, į krepšelį dedama per woocommerce_order_again_cart_item_data (MnM konfigūracija išsaugoma).
 * v1.1.5: matavimui — endpoint'as žymi WC sesiją ps_pakartoti_is=<order>, kasoje užsakymas gauna meta _ps_pakartoti_is (Q4 plano langas skaičiuoja konversiją).
 * Version: 1.1.5
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Pakartoti {
	const VER = '1.1.5';
	const OPT_RAKTAS = 'ps_pakartoti_raktas';
	const LANGAS_D = 45; // per tiek dienų to paties užsakymo antras refill_due nesiunčiamas

	public static function init() {
		add_filter( 'petshop_email_template_path', array( __CLASS__, 'sablonas' ), 20, 3 );
		add_filter( 'petshop_email_eligibility', array( __CLASS__, 'vartai' ), 30, 5 );
		add_action( 'wp_loaded', array( __CLASS__, 'endpoint' ), 20 );
		add_action( 'woocommerce_checkout_create_order', array( __CLASS__, 'zyme' ), 30, 2 );
	}

	public static function sablonas( $file, $flow, $slug ) {
		if ( 'refill_due' !== $flow ) return $file;
		$f = WPMU_PLUGIN_DIR . '/ps-sablonai/refill-pakartoti.php';
		return file_exists( $f ) ? $f : $file;
	}

	/** Sekamos to paties užsakymo prekės (iš ps_refill_tracking) su kiekiais iš užsakymo ir dabartine kaina. */
	public static function grupe( $uid, $pid ) {
		global $wpdb; $p = $wpdb->prefix; $t = $p . 'ps_refill_tracking';
		$r = $wpdb->get_row( $wpdb->prepare( "SELECT last_order_id, predicted_empty_date FROM $t WHERE user_id=%d AND product_id=%d", $uid, $pid ), ARRAY_A );
		if ( ! $r ) return null;
		$oid = (int) $r['last_order_id']; $o = wc_get_order( $oid ); if ( ! $o ) return null;
		$sek = $wpdb->get_col( $wpdb->prepare( "SELECT product_id FROM $t WHERE user_id=%d AND last_order_id=%d", $uid, $oid ) );
		$sek = array_map( 'intval', $sek ); if ( ! in_array( $pid, $sek, true ) ) $sek[] = $pid;
		$prekes = array(); $suma = 0.0; $nera = array();
		foreach ( $o->get_items() as $it ) {
			if ( $it->get_meta( '_mnm_container' ) ) continue; // rinkinio komponentas — eina su konteineriu (_mnm_container = konteinerio cart key)
			$ipid = (int) ( $it->get_variation_id() ? $it->get_variation_id() : $it->get_product_id() ); $ppid = (int) $it->get_product_id();
			$cfg = $it->get_meta( '_mnm_config' ); $konteineris = is_array( $cfg ) && $cfg; $vaikai = array();
			if ( $konteineris ) foreach ( $cfg as $c ) { if ( is_array( $c ) && ! empty( $c['product_id'] ) ) $vaikai[] = array( (int) ( ! empty( $c['variation_id'] ) ? $c['variation_id'] : $c['product_id'] ), max( 1, (int) ( isset( $c['quantity'] ) ? $c['quantity'] : 1 ) ) ); }
			$sekamas = in_array( $ipid, $sek, true ) || in_array( $ppid, $sek, true ) || ( $konteineris && array_intersect( array_column( $vaikai, 0 ), $sek ) );
			if ( ! $sekamas ) continue;
			$pr = wc_get_product( $ipid ); $k = max( 1, (int) $it->get_quantity() );
			if ( ! $pr || 'publish' !== $pr->get_status() || ! $pr->is_purchasable() || ! $pr->is_in_stock() || ! $pr->has_enough_stock( $k ) ) { $nera[] = $it->get_name(); continue; }
			$kaina = (float) wc_get_price_to_display( $pr ) * $k; $truksta = '';
			if ( $konteineris ) { $kk = 0.0; foreach ( $vaikai as $v ) { $vp = wc_get_product( $v[0] ); if ( ! $vp || ! $vp->is_purchasable() || ! $vp->is_in_stock() || ! $vp->has_enough_stock( $v[1] * $k ) ) { $truksta = $vp ? $vp->get_name() : '#' . $v[0]; break; } $kk += (float) wc_get_price_to_display( $vp ) * $v[1]; } if ( $kaina <= 0 ) $kaina = $kk * $k; }
			if ( $truksta ) { $nera[] = $it->get_name() . ' (trūksta: ' . $truksta . ')'; continue; }
			$suma += $kaina;
			$prekes[] = array( 'pid' => $ipid, 'item_id' => (int) $it->get_id(), 'pav' => $pr->get_name(), 'kiekis' => $k, 'kaina' => $kaina, 'url' => $pr->get_permalink(), 'rinkinys' => $konteineris );
		}
		$ts = strtotime( (string) $r['predicted_empty_date'] );
		$men = array( 1 => 'sausio', 'vasario', 'kovo', 'balandžio', 'gegužės', 'birželio', 'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio' );
		return array( 'order_id' => $oid, 'prekes' => $prekes, 'nera' => $nera, 'suma' => $suma, 'data' => $ts ? $men[ (int) date( 'n', $ts ) ] . ' ' . (int) date( 'j', $ts ) . ' d.' : '', 'kasa' => self::url( $oid ) );
	}

	/** Vartai: (a) to paties užsakymo laiškas jau išsiųstas per LANGAS_D → terminal; (b) nė vienos prekės sandėlyje → deferred. */
	public static function vartai( $result, $flow, $flow_class, $email, $context = array() ) {
		if ( 'refill_due' !== $flow ) return $result;
		if ( is_array( $result ) && isset( $result['allowed'] ) && ! $result['allowed'] ) return $result;
		global $wpdb; $p = $wpdb->prefix;
		$uid = isset( $context['user_id'] ) ? (int) $context['user_id'] : 0; $pid = isset( $context['product_id'] ) ? (int) $context['product_id'] : 0;
		if ( ! $uid ) { $u = get_user_by( 'email', $email ); $uid = $u ? (int) $u->ID : 0; }
		$g = ( $uid && $pid ) ? self::grupe( $uid, $pid ) : null;
		if ( ! $g ) return $result;
		if ( empty( $g['prekes'] ) ) return array( 'allowed' => false, 'reason' => 'preke_nera_sandelyje', 'terminal' => false );
		// jau siųstas to paties užsakymo refill_due?
		$siusti = $wpdb->get_col( $wpdb->prepare( "SELECT context_json FROM {$p}ps_email_jobs WHERE flow='refill_due' AND status='sent' AND recipient_email=%s AND sent_at >= %s", $email, gmdate( 'Y-m-d H:i:s', time() - self::LANGAS_D * 86400 ) ) );
		foreach ( $siusti as $cj ) {
			$c = json_decode( (string) $cj, true ); $spid = is_array( $c ) && isset( $c['product_id'] ) ? (int) $c['product_id'] : 0; if ( ! $spid || $spid === $pid ) continue;
			$soid = (int) $wpdb->get_var( $wpdb->prepare( "SELECT last_order_id FROM {$p}ps_refill_tracking WHERE user_id=%d AND product_id=%d", $uid, $spid ) );
			if ( $soid && $soid === (int) $g['order_id'] ) return array( 'allowed' => false, 'reason' => 'pakartoti_jau_siustas', 'terminal' => true );
		}
		return $result;
	}

	public static function raktas() { $k = get_option( self::OPT_RAKTAS ); if ( ! $k ) { $k = wp_generate_password( 32, false ); update_option( self::OPT_RAKTAS, $k, false ); } return $k; }
	public static function zenklas( $oid ) { return substr( hash_hmac( 'sha256', 'pakartoti:' . (int) $oid, self::raktas() ), 0, 20 ); }
	public static function url( $oid ) { return add_query_arg( array( 'ps_pakartoti' => (int) $oid, 'z' => self::zenklas( $oid ) ), home_url( '/' ) ); }

	/** /?ps_pakartoti=<order>&z=<hmac>: sudeda sekamas užsakymo prekes į krepšelį (esamą išvalo) ir veda į kasą. */
	public static function endpoint() {
		if ( ! isset( $_GET['ps_pakartoti'], $_GET['z'] ) || ! function_exists( 'WC' ) ) return;
		$oid = (int) $_GET['ps_pakartoti']; // phpcs:ignore
		if ( ! hash_equals( self::zenklas( $oid ), (string) $_GET['z'] ) ) { wp_die( 'Nuoroda negalioja.', '', array( 'response' => 403 ) ); }
		$o = wc_get_order( $oid ); if ( ! $o ) { wp_safe_redirect( wc_get_cart_url() ); exit; }
		$uid = (int) $o->get_user_id(); $g = null;
		// grupe() reikia pid iš tracking — imam bet kurią sekamą to užsakymo prekę
		if ( ! $g ) { global $wpdb; $pid = (int) $wpdb->get_var( $wpdb->prepare( "SELECT product_id FROM {$wpdb->prefix}ps_refill_tracking WHERE user_id=%d AND last_order_id=%d LIMIT 1", $uid, $oid ) ); $g = $pid ? self::grupe( $uid, $pid ) : null; }
		if ( ! $g || empty( $g['prekes'] ) ) { wc_add_notice( 'Šių prekių šiuo metu nėra sandėlyje.', 'notice' ); wp_safe_redirect( wc_get_cart_url() ); exit; }
		if ( null === WC()->cart ) wc_load_cart();
		WC()->cart->empty_cart(); $n = 0;
		$items = $o->get_items();
		foreach ( $g['prekes'] as $pr ) {
			$it = isset( $items[ $pr['item_id'] ] ) ? $items[ $pr['item_id'] ] : null; $pr_obj = wc_get_product( $pr['pid'] );
			$vid = $pr_obj && $pr_obj->is_type( 'variation' ) ? $pr['pid'] : 0; $ppid = $vid ? $pr_obj->get_parent_id() : $pr['pid'];
			$data = $it ? apply_filters( 'woocommerce_order_again_cart_item_data', array(), $it, $o ) : array();
			try { if ( WC()->cart->add_to_cart( $ppid, $pr['kiekis'], $vid, array(), $data ) ) $n++; } catch ( Exception $e ) { $g['nera'][] = $pr['pav']; }
		}
		if ( $g['nera'] ) wc_add_notice( 'Šiuo metu nėra: ' . implode( ', ', array_map( 'esc_html', $g['nera'] ) ) . '.', 'notice' );
		if ( WC()->session ) { WC()->session->set( 'ps_pakartoti_is', $oid ); WC()->session->set_customer_session_cookie( true ); WC()->session->save_data(); } if ( method_exists( WC()->cart, 'maybe_set_cart_cookies' ) ) WC()->cart->maybe_set_cart_cookies();
		wp_safe_redirect( $n ? wc_get_checkout_url() : wc_get_cart_url() ); exit;
	}

	public static function zyme( $order, $data ) { if ( WC()->session && WC()->session->get( 'ps_pakartoti_is' ) ) { $order->update_meta_data( '_ps_pakartoti_is', (int) WC()->session->get( 'ps_pakartoti_is' ) ); WC()->session->set( 'ps_pakartoti_is', null ); } }

	/** Duomenys šablonui. */
	public static function duomenys( $payload, $recipient ) {
		$pid = (int) ( isset( $payload['product_id'] ) ? $payload['product_id'] : 0 ); $u = get_user_by( 'email', $recipient );
		$g = ( $u && $pid ) ? self::grupe( (int) $u->ID, $pid ) : null;
		if ( ! $g ) { $pr = $pid ? wc_get_product( $pid ) : null; $g = array( 'prekes' => $pr ? array( array( 'pid' => $pid, 'pav' => $pr->get_name(), 'kiekis' => 1, 'kaina' => (float) wc_get_price_to_display( $pr ), 'url' => $pr->get_permalink() ) ) : array(), 'nera' => array(), 'suma' => $pr ? (float) wc_get_price_to_display( $pr ) : 0, 'data' => '', 'kasa' => $pr ? add_query_arg( array( 'add-to-cart' => $pid, 'quantity' => 1 ), wc_get_checkout_url() ) : '' ); }
		$g['optout'] = class_exists( 'Petshop_Sutikimai' ) ? Petshop_Sutikimai::optout_url( $recipient ) : '';
		return $g;
	}
}
Petshop_Pakartoti::init();
