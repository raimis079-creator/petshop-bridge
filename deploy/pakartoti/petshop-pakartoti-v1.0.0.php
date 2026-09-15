<?php
/**
 * Plugin Name: Petshop Pakartoti tą patį (refill_due laiškas)
 * Description: S1685 (Q4 planas, lifecycle etapas 1): refill_due laiško šablonas „Pakartoti tą patį" — konkreti prekė, paskutinio užsakymo kiekis, dabartinė kaina, vienas paspaudimas tiesiai į kasą, atsisakymo nuoroda (Petshop_Sutikimai::optout_url). Šablonas: mu-plugins/ps-sablonai/refill-pakartoti.php (core refill.php neliečiamas). Jei prekės nėra sandėlyje / neparduodama — laiškas atidedamas (deferred), ne siunčiamas.
 * Version: 1.0.0
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Pakartoti {
	const VER = '1.0.0';

	public static function init() {
		add_filter( 'petshop_email_template_path', array( __CLASS__, 'sablonas' ), 20, 3 );
		add_filter( 'petshop_email_eligibility', array( __CLASS__, 'sandelis' ), 30, 5 );
	}

	public static function sablonas( $file, $flow, $slug ) {
		if ( 'refill_due' !== $flow ) return $file;
		$f = WPMU_PLUGIN_DIR . '/ps-sablonai/refill-pakartoti.php';
		return file_exists( $f ) ? $f : $file;
	}

	/** Prekė turi būti perkama ir sandėlyje — kitaip atidėti (ne terminal), variklis bandys kitą dieną. */
	public static function sandelis( $result, $flow, $flow_class, $email, $context = array() ) {
		if ( 'refill_due' !== $flow ) return $result;
		if ( is_array( $result ) && isset( $result['allowed'] ) && ! $result['allowed'] ) return $result;
		$pid = isset( $context['product_id'] ) ? (int) $context['product_id'] : 0; $pr = $pid ? wc_get_product( $pid ) : null;
		if ( ! $pr || ! $pr->is_purchasable() || ! $pr->is_in_stock() || 'publish' !== $pr->get_status() ) {
			return array( 'allowed' => false, 'reason' => 'preke_nera_sandelyje', 'terminal' => false );
		}
		return $result;
	}

	/** Duomenys šablonui: kiekis iš paskutinio užsakymo, kaina, svoris, data, nuorodos. */
	public static function duomenys( $payload, $recipient ) {
		global $wpdb; $p = $wpdb->prefix; $pid = (int) ( isset( $payload['product_id'] ) ? $payload['product_id'] : 0 ); $pr = $pid ? wc_get_product( $pid ) : null;
		$d = array( 'pid' => $pid, 'pavadinimas' => $pr ? $pr->get_name() : (string) ( isset( $payload['product_name'] ) ? $payload['product_name'] : '' ), 'kiekis' => 1, 'kaina' => '', 'data' => '', 'kasa' => '', 'preke' => $pr ? $pr->get_permalink() : home_url( '/' ), 'optout' => '' );
		$u = get_user_by( 'email', $recipient ); $row = null;
		if ( $u && $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $p . 'ps_refill_tracking' ) ) ) {
			$row = $wpdb->get_row( $wpdb->prepare( "SELECT last_order_id, predicted_empty_date FROM {$p}ps_refill_tracking WHERE user_id=%d AND product_id=%d", $u->ID, $pid ), ARRAY_A );
		}
		if ( $row ) {
			$o = wc_get_order( (int) $row['last_order_id'] );
			if ( $o ) { foreach ( $o->get_items() as $it ) { if ( (int) $it->get_product_id() === $pid || (int) $it->get_variation_id() === $pid ) { $d['kiekis'] = max( 1, (int) $it->get_quantity() ); break; } } }
			if ( ! empty( $row['predicted_empty_date'] ) ) { $ts = strtotime( $row['predicted_empty_date'] ); $men = array( 1 => 'sausio', 'vasario', 'kovo', 'balandžio', 'gegužės', 'birželio', 'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio' ); $d['data'] = $men[ (int) date( 'n', $ts ) ] . ' ' . (int) date( 'j', $ts ) . ' d.'; }
		}
		if ( $pr ) {
			$d['kaina'] = number_format( (float) wc_get_price_to_display( $pr ) * $d['kiekis'], 2, ',', ' ' );
			$d['kasa'] = add_query_arg( array( 'add-to-cart' => $pid, 'quantity' => $d['kiekis'] ), wc_get_checkout_url() );
		}
		if ( class_exists( 'Petshop_Sutikimai' ) ) $d['optout'] = Petshop_Sutikimai::optout_url( $recipient );
		return $d;
	}
}
Petshop_Pakartoti::init();
