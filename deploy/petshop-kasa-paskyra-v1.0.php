<?php
/**
 * Plugin Name: Petshop Kasa: užsakymas esamai paskyrai v1.0 (S1690)
 * Description: Neprisijungęs pirkėjas su el. paštu, kuris jau turi paskyrą, gali užbaigti užsakymą be klaidos
 *   „Paskyra su tokiu el. pašto adresu jau yra sukurta". Užsakymas priskiriamas esamai paskyrai; paskyros
 *   išsaugotas adresas NEPERRAŠOMAS; pirkėjas neprijungiamas. Užsakymo meta `_ps_paskyra_priskirta`=1 + pastaba.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

final class Petshop_Kasa_Paskyra {
	/** @var int|null esamo vartotojo ID šiai kasos užklausai */
	private static $uid = null;

	public static function init() {
		add_filter( 'woocommerce_checkout_posted_data', array( __CLASS__, 'posted' ), 5 );
		add_filter( 'woocommerce_checkout_customer_id', array( __CLASS__, 'customer_id' ), 20 );
		add_filter( 'woocommerce_checkout_update_customer_data', array( __CLASS__, 'nekeisti_paskyros' ), 20 );
		add_action( 'woocommerce_checkout_create_order', array( __CLASS__, 'zyme' ), 20, 2 );
		add_action( 'woocommerce_checkout_order_created', array( __CLASS__, 'pastaba' ), 20 );
	}

	/** Prieš validaciją: jei svečias, o el. paštas jau turi paskyrą — paskyros nekurti, o priskirti. */
	public static function posted( $data ) {
		self::$uid = null;
		if ( is_user_logged_in() || empty( $data['billing_email'] ) || ! is_email( $data['billing_email'] ) ) { return $data; }
		$id = email_exists( sanitize_email( $data['billing_email'] ) );
		if ( ! $id ) { return $data; }
		$u = get_userdata( $id );
		if ( ! $u || array_intersect( array( 'administrator', 'shop_manager', 'editor' ), (array) $u->roles ) ) { return $data; } // admin paskyrų svečiui nepriskirti
		self::$uid = (int) $id;
		$data['createaccount'] = 0;
		return $data;
	}

	public static function customer_id( $id ) {
		return ( ! $id && self::$uid ) ? self::$uid : $id;
	}

	/** Esamos paskyros billing/shipping laukų iš svečio įvesties neperrašyti. */
	public static function nekeisti_paskyros( $update ) {
		return self::$uid ? false : $update;
	}

	public static function zyme( $order, $data ) {
		if ( ! self::$uid ) { return; }
		$order->update_meta_data( '_ps_paskyra_priskirta', 1 );
	}

	public static function pastaba( $order ) {
		if ( ! self::$uid || ! $order->get_meta( '_ps_paskyra_priskirta' ) ) { return; }
		$order->add_order_note( 'Svečio užsakymas priskirtas esamai paskyrai #' . self::$uid . ' pagal el. paštą (S1690).' );
	}
}
Petshop_Kasa_Paskyra::init();
