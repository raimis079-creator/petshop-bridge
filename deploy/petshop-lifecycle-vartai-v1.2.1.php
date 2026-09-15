<?php
/**
 * Plugin Name: Petshop Lifecycle Vartai
 * Description: S1684 (Q4 planas, vartai C): (0) refill pagal augintinio anketą (dienos norma × pakuotė, Feeding_Service) kai yra svoris; (1) refill ciklai pagal brendą × pakuotę iš 2,5 m. istorijos (CIKLAI_ir_R_due_baseline_s1684.md) vietoj grubių 14/30/60 d.; (2) refill_due / post_purchase_14d eligibility = ERĮ 81(2) soft opt-out (ps_soft_optin_eligible && !ps_similar_optout), kol lauko nėra — atidedama; (3) 90/10 holdout (permanentinis, pagal el. pašto hash). Raimio leidimas „taisyk ką reikia" 09-14.
 * v1.2.0 (S1685, Raimio sprendimas): kliento „išmoktas" intervalas (2+ pirkimai) trumpesnis už istorinį p25 tam brendui/pakuotei (arba <14 d., kai lentelės nėra) = papildymas, ne ciklas → imama lentelės mediana (arba 30 d.) nuo paskutinio pirkimo, confidence 0.50; kitaip 09-04+09-14 pirkimai duodavo priminimą po 2 d.
 * Version: 1.2.1
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Lifecycle_Vartai {
	const VER = '1.2.0';
	const OPT_VARTAI = 'ps_lifecycle_vartai'; // 'soft' (numatyta: reikia soft opt-out žymos) | 'atvira' (Raimio sprendimas leisti be žymos) | 'uzdaryta'
	const HOLDOUT_PCT = 10;
	/** brendas|pakuotė → array(p25, mediana, p75) dienomis. Šaltinis: ps_ist 2024-01…2026-08, recon s1684_me. */
	const CIKLAI = array(
		'animonda|1.5-5kg' => array( 19, 34, 57 ),
		'josera|11kg+' => array( 33, 56, 100 ),
		'animonda|iki1.5kg' => array( 28, 41, 65 ),
		'josera|5-11kg' => array( 36, 73, 135 ),
		'exclusion|11kg+' => array( 39, 62, 96 ),
		'exclusion|5-11kg' => array( 55, 76, 118 ),
		'exclusion|1.5-5kg' => array( 23, 38, 66 ),
		'ontario|iki1.5kg' => array( 26, 40, 61 ),
		'animonda|5-11kg' => array( 29, 33, 60 ),
		'quattro|1.5-5kg' => array( 23, 37, 72 ),
		'hikari|iki1.5kg' => array( 96, 137, 217 ),
		'quattro|11kg+' => array( 31, 50, 81 ),
		'miamor|iki1.5kg' => array( 22, 35, 84 ),
		'ontario|1.5-5kg' => array( 20, 43, 90 ),
		'animonda|11kg+' => array( 32, 38, 46 ),
		'quattro|5-11kg' => array( 51, 91, 104 ),
		'ambrosia|11kg+' => array( 23, 30, 44 ),
		'josera|1.5-5kg' => array( 34, 56, 103 ),
		'monge|1.5-5kg' => array( 25, 39, 50 ),
		'rasco|11kg+' => array( 42, 50, 57 ),
		'royal-canin|1.5-5kg' => array( 24, 39, 76 ),
		'royal-canin|5-11kg' => array( 98, 115, 197 ),
		'prins|1.5-5kg' => array( 35, 46, 83 ),
		'apollo|1.5-5kg' => array( 29, 46, 74 ),
	);
	const CIKLAI_BRENDAS = array(
		'animonda' => array( 23, 38, 60 ),
		'josera' => array( 33, 61, 110 ),
		'exclusion' => array( 41, 62, 97 ),
		'ontario' => array( 26, 43, 79 ),
		'quattro' => array( 28, 50, 87 ),
		'miamor' => array( 23, 34, 86 ),
		'hikari' => array( 85, 131, 217 ),
		'royal-canin' => array( 37, 64, 108 ),
		'monge' => array( 26, 38, 51 ),
		'rasco' => array( 40, 48, 56 ),
		'apollo' => array( 29, 43, 71 ),
		'ambrosia' => array( 26, 30, 49 ),
		'prins' => array( 45, 63, 94 ),
	);

	public static function init() {
		add_action( 'woocommerce_order_status_processing', array( __CLASS__, 'pataisyti_ciklus' ), 40, 1 );
		add_action( 'woocommerce_order_status_completed', array( __CLASS__, 'pataisyti_ciklus' ), 40, 1 );
		add_filter( 'petshop_email_eligibility', array( __CLASS__, 'eligibility' ), 20, 5 );
	}

	public static function bucket( $g ) { if ( $g <= 0 ) return null; if ( $g < 1500 ) return 'iki1.5kg'; if ( $g < 5000 ) return '1.5-5kg'; if ( $g < 11000 ) return '5-11kg'; return '11kg+'; }

	/** @return array|null (p25, med, p75) */
	public static function ciklas( $brendas, $g ) {
		$b = strtolower( (string) $brendas ); $bk = self::bucket( (int) $g );
		if ( $b && $bk && isset( self::CIKLAI[ $b . '|' . $bk ] ) ) return self::CIKLAI[ $b . '|' . $bk ];
		if ( $b && $bk && 'iki1.5kg' !== $bk && isset( self::CIKLAI_BRENDAS[ $b ] ) ) return self::CIKLAI_BRENDAS[ $b ]; // v1.0.1: mažoms pakuotėms be tikslaus įrašo brendo mediana netinka (skanėstai/konservai) — paliekam variklio įvertį
		return null;
	}

	/** Augintinio dienos norma: pet iš ps_pet_products (user+product) arba vienintelis šuo/katė; svoris iš ps_pets; Petshop_Feeding_Service::evaluate → duration_days. @return array|null (dienos, pet_id) */
	public static function pagal_anketa( $uid, $pid, $qty ) {
		global $wpdb; $p = $wpdb->prefix;
		if ( ! class_exists( 'Petshop_Feeding_Service' ) ) return null;
		static $wcol = null; if ( null === $wcol ) { $wcol = ''; foreach ( (array) $wpdb->get_col( "SHOW COLUMNS FROM {$p}ps_pets" ) as $c ) { if ( preg_match( '/^(current_weight_kg|weight_kg|current_weight|weight)$/', $c ) ) { $wcol = $c; break; } } }
		if ( ! $wcol ) return null;
		$pet_id = (int) $wpdb->get_var( $wpdb->prepare( "SELECT pet_id FROM {$p}ps_pet_products WHERE user_id=%d AND product_id=%d ORDER BY updated_at DESC LIMIT 1", $uid, $pid ) );
		if ( ! $pet_id ) { $ids = $wpdb->get_col( $wpdb->prepare( "SELECT id FROM {$p}ps_pets WHERE user_id=%d AND `$wcol`>0", $uid ) ); if ( count( $ids ) !== 1 ) return null; $pet_id = (int) $ids[0]; }
		$w = (float) $wpdb->get_var( $wpdb->prepare( "SELECT `$wcol` FROM {$p}ps_pets WHERE id=%d", $pet_id ) ); if ( $w <= 0 ) return null;
		try { $r = Petshop_Feeding_Service::evaluate( array( 'product_id' => (int) $pid, 'quantity' => max( 1, (int) $qty ), 'pet_input' => array( 'current_weight_kg' => $w, 'conditions' => array() ) ) ); } catch ( Throwable $e ) { return null; }
		$dd = isset( $r['duration_days'] ) ? $r['duration_days'] : 0; $d = is_array( $dd ) ? ( (float) ( $dd['min'] ?? 0 ) + (float) ( $dd['max'] ?? 0 ) ) / 2 : (float) $dd; // v1.1.1: Feeding_Service grąžina intervalą {min,max}
		if ( $d < 3 || $d > 365 ) return null;
		return array( (int) round( $d ), $pet_id );
	}

	/** Po Refill_Engine::track_purchase (prio 30): pirmam pirkimui — 1) anketa (dienos norma × pakuotė), 2) ciklų lentelė (mediana); kalibruotų (2+) neliečia. */
	public static function pataisyti_ciklus( $order_id ) {
		global $wpdb; $p = $wpdb->prefix; $t = $p . 'ps_refill_tracking';
		if ( ! $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $t ) ) ) return;
		$order = wc_get_order( $order_id ); if ( ! $order ) return;
		$uid = (int) $order->get_user_id(); if ( ! $uid ) return;
		$eil = $wpdb->get_results( $wpdb->prepare( "SELECT preke_id, brendas_slug, svoris_g, kiekis FROM {$p}ps_fakt_eilutes WHERE uzsakymas_id=%d", $order_id ), ARRAY_A );
		foreach ( $eil as $e ) { self::pataisyti_eilute( $t, $uid, (int) $e['preke_id'], $e['brendas_slug'], (int) $e['svoris_g'], max( 1, (int) $e['kiekis'] ) ); }
	}

	public static function pataisyti_eilute( $t, $uid, $pid, $brendas, $svoris_g, $qty ) {
		global $wpdb;
		$row = $wpdb->get_row( $wpdb->prepare( "SELECT id, purchase_count, last_purchase_date FROM $t WHERE user_id=%d AND product_id=%d", $uid, $pid ), ARRAY_A );
		if ( ! $row ) return null;
		if ( (int) $row['purchase_count'] > 1 ) {
			// Kalibruotas intervalas: per trumpas = papildymas, ne suvartojimo ciklas (S1685).
			$c = self::ciklas( $brendas, $svoris_g * $qty ); $p25 = $c ? (int) $c[0] : 14; $med = $c ? (int) $c[1] : 30;
			$dab = (int) $wpdb->get_var( $wpdb->prepare( "SELECT avg_interval_days FROM $t WHERE id=%d", $row['id'] ) );
			if ( $dab > 0 && $dab >= $p25 ) return null;
			$wpdb->update( $t, array( 'avg_interval_days' => $med, 'confidence' => 0.50, 'predicted_empty_date' => date( 'Y-m-d', strtotime( $row['last_purchase_date'] ) + $med * 86400 ), 'updated_at' => gmdate( 'Y-m-d H:i:s' ) ), array( 'id' => $row['id'] ) );
			return array( 'papildymas', $med );
		}
		$a = self::pagal_anketa( $uid, $pid, $qty );
		if ( $a ) { $upd = array( 'avg_interval_days' => $a[0], 'pet_id' => $a[1], 'confidence' => 0.60, 'saltinis' => 'anketa' ); }
		else { $c = self::ciklas( $brendas, $svoris_g * $qty ); if ( ! $c ) return null; $upd = array( 'avg_interval_days' => (int) $c[1], 'saltinis' => 'ciklai' ); }
		$sal = $upd['saltinis']; unset( $upd['saltinis'] );
		$upd['predicted_empty_date'] = date( 'Y-m-d', strtotime( $row['last_purchase_date'] ) + $upd['avg_interval_days'] * 86400 ); $upd['updated_at'] = gmdate( 'Y-m-d H:i:s' );
		$wpdb->update( $t, $upd, array( 'id' => $row['id'] ) );
		return array( $sal, $upd['avg_interval_days'] );
	}

	public static function holdout( $email ) { return ( hexdec( substr( hash( 'sha256', strtolower( trim( $email ) ) ), 0, 8 ) ) % 100 ) < self::HOLDOUT_PCT; }

	/** Soft opt-out žyma (usermeta) — pildoma kasos lauko (spec S1684). null = žymos dar nėra. */
	public static function similar_ok( $email, $user_id = 0 ) {
		$u = $user_id ? get_user_by( 'id', $user_id ) : get_user_by( 'email', $email ); if ( ! $u ) return null;
		$elig = get_user_meta( $u->ID, 'ps_soft_optin_eligible', true ); if ( $elig !== '1' && $elig !== 'yes' ) return null;
		return get_user_meta( $u->ID, 'ps_similar_optout', true ) !== '1';
	}

	public static function eligibility( $result, $flow, $flow_class, $email, $context = array() ) {
		if ( ! in_array( $flow, array( 'refill_due', 'post_purchase_14d', 'win_back' ), true ) ) return $result;
		if ( is_array( $result ) && isset( $result['allowed'] ) && ! $result['allowed'] ) return $result;
		$vartai = get_option( self::OPT_VARTAI, 'soft' );
		if ( 'uzdaryta' === $vartai ) return array( 'allowed' => false, 'reason' => 'lifecycle_uzdaryta', 'terminal' => false );
		if ( self::holdout( $email ) ) return array( 'allowed' => false, 'reason' => 'holdout_10', 'terminal' => true );
		if ( 'soft' === $vartai ) {
			$ok = self::similar_ok( $email, isset( $context['user_id'] ) ? (int) $context['user_id'] : 0 );
			if ( null === $ok ) return array( 'allowed' => false, 'reason' => 'soft_optout_nezinomas', 'terminal' => false );
			if ( ! $ok ) return array( 'allowed' => false, 'reason' => 'similar_optout', 'terminal' => true );
		}
		return $result;
	}
}
Petshop_Lifecycle_Vartai::init();
