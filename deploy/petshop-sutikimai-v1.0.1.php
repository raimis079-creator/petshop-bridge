<?php
/**
 * Plugin Name: Petshop Sutikimai (soft opt-out kasoje)
 * Description: S1685 (Q4 planas, vartai C; spec SPEC_kasos_soft_optout_s1684.md): kasoje ERĮ 81(2) soft opt-out laukas „Nenoriu priminimų apie pakartotinį užsakymą" (nepažymėtas = neprieštarauja). Įrašo order meta, usermeta (ps_soft_optin_eligible / ps_similar_optout), ps_consent_log (source checkout), atsisakymo nuoroda laiškams (source email_link). Raimio tekstas 09-15.
 * Version: 1.0.1
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Sutikimai {
	const VER = '1.0.1';
	const LAUKAS = 'ps_similar_optout';
	const ETIKETE = 'Nenoriu priminimų apie pakartotinį užsakymą';
	const PAAISKINIMAS = 'Galime priminti tik apie anksčiau pirktas prekes. Atsisakyti galėsite bet kada.';
	const OPT_RAKTAS = 'ps_sutikimai_raktas';

	public static function init() {
		add_action( 'woocommerce_after_checkout_billing_form', array( __CLASS__, 'laukas' ), 20, 1 );
		add_action( 'woocommerce_checkout_create_order', array( __CLASS__, 'irasyti' ), 20, 2 );
		add_action( 'init', array( __CLASS__, 'nuoroda' ), 5 );
	}

	public static function laukas( $checkout ) {
		$v = $checkout->get_value( self::LAUKAS ) ? ' checked="checked"' : '';
		echo '<div class="ps-sutikimai" style="margin:10px 0 4px"><p class="form-row form-row-wide ps-similar-optout" id="' . self::LAUKAS . '_field">'
			. '<label class="checkbox woocommerce-form__label woocommerce-form__label-for-checkbox" for="' . self::LAUKAS . '">'
			. '<input type="checkbox" class="input-checkbox woocommerce-form__input woocommerce-form__input-checkbox" name="' . self::LAUKAS . '" id="' . self::LAUKAS . '" value="1"' . $v . '> '
			. '<span>' . esc_html( self::ETIKETE ) . '</span></label></p>'
			. '<p class="ps-sutikimai-paaisk" style="font-size:.85em;opacity:.75;margin:-6px 0 10px">' . esc_html( self::PAAISKINIMAS ) . '</p></div>';
	}

	/** Užsakymo momentu: order meta + usermeta + consent log. */
	public static function irasyti( $order, $data ) {
		$optout = ! empty( $_POST[ self::LAUKAS ] ) ? 1 : 0; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- WC checkout nonce
		$order->update_meta_data( '_ps_similar_optout', $optout );
		$order->update_meta_data( '_ps_similar_basis', 'erl81_2_checkout' );
		$email = $order->get_billing_email(); $uid = (int) $order->get_user_id();
		self::nustatyti( $email, $uid, $optout, 'checkout' );
	}

	/** Bendra būsenos keitimo funkcija (checkout / email_link). */
	public static function nustatyti( $email, $uid, $optout, $source ) {
		global $wpdb; $p = $wpdb->prefix; $email = strtolower( trim( (string) $email ) ); if ( ! $email ) return;
		if ( ! $uid ) { $u = get_user_by( 'email', $email ); $uid = $u ? (int) $u->ID : 0; }
		$nuo = '';
		if ( $uid ) {
			$nuo = (string) get_user_meta( $uid, 'ps_similar_optout', true );
			update_user_meta( $uid, 'ps_soft_optin_eligible', '1' );
			update_user_meta( $uid, 'ps_similar_optout', (string) $optout );
			if ( $optout ) update_user_meta( $uid, 'ps_similar_optout_at', gmdate( 'Y-m-d H:i:s' ) );
		}
		if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $p . 'ps_consent_log' ) ) ) {
			$wpdb->insert( $p . 'ps_consent_log', array(
				'customer_id' => $uid, 'email' => $email, 'field' => 'similar_products_optout',
				'from_value' => $nuo, 'to_value' => (string) $optout, 'source' => $source,
				'ip' => isset( $_SERVER['REMOTE_ADDR'] ) ? substr( (string) $_SERVER['REMOTE_ADDR'], 0, 45 ) : '',
				'user_agent' => isset( $_SERVER['HTTP_USER_AGENT'] ) ? substr( (string) $_SERVER['HTTP_USER_AGENT'], 0, 255 ) : '',
				'changed_at' => current_time( 'mysql' ),
			) );
		}
		do_action( 'ps_similar_optout_pakeista', $email, $uid, $optout, $source );
	}

	public static function raktas() { $k = get_option( self::OPT_RAKTAS ); if ( ! $k ) { $k = wp_generate_password( 32, false ); update_option( self::OPT_RAKTAS, $k, false ); } return $k; }
	public static function zenklas( $email ) { return substr( hash_hmac( 'sha256', strtolower( trim( (string) $email ) ), self::raktas() ), 0, 24 ); }
	/** Atsisakymo nuoroda lifecycle laiškams (refill_due, pakartoti, win-back). */
	public static function optout_url( $email ) { return add_query_arg( array( 'ps_atsisakyti_priminimu' => rawurlencode( strtolower( trim( (string) $email ) ) ), 'z' => self::zenklas( $email ) ), home_url( '/' ) ); }

	public static function nuoroda() {
		if ( ! isset( $_GET['ps_atsisakyti_priminimu'], $_GET['z'] ) ) return;
		$email = strtolower( trim( rawurldecode( (string) $_GET['ps_atsisakyti_priminimu'] ) ) ); // phpcs:ignore
		if ( ! is_email( $email ) || ! hash_equals( self::zenklas( $email ), (string) $_GET['z'] ) ) { wp_die( 'Nuoroda negalioja.', '', array( 'response' => 403 ) ); }
		self::nustatyti( $email, 0, 1, 'email_link' );
		wp_die( '<p style="font:16px/1.5 sans-serif">Priminimų apie pakartotinį užsakymą daugiau nesiųsime.</p>', 'petshop.lt', array( 'response' => 200 ) );
	}
}
Petshop_Sutikimai::init();
