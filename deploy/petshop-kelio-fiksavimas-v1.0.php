<?php
/**
 * Plugin Name: Petshop Kelio Fiksavimas
 * Description: v1.0 (S1704, 2026-09-22) — eilutės kelią (`_ps_source`) fiksuoja jau KASOJE, ne tik apmokėjus.
 *
 * PROBLEMA (S1704): Paysera pluginas `process_payment()` viduje kviečia `wc_maybe_reduce_stock_levels()`
 * dar neapmokėjus. Tuo momentu `Petshop_AV_Order::fiksuoti()` dar nebuvo suveikęs (jis kabo ant
 * payment_complete / processing / on-hold), eilutės neturėjo `_ps_source=av`, todėl
 * `Petshop_AV_Reduce::wc_kiekis` filtras WC nurašymo nesustabdė → WC nurašė `_stock`, o po apmokėjimo
 * AV variklis nurašė antrą kartą. 124 prekės, 613 vnt. (grynai AV prekės, daugiausia Animonda).
 *
 * SPRENDIMAS: kviečiam tą patį `fiksuoti()` ant `woocommerce_checkout_order_processed` (prio 5) —
 * jis suveikia PRIEŠ vartų `process_payment()`. Variklių failai neliesti; `fiksuoti()` idempotentiškas,
 * todėl vėlesni kabliai antrą kartą neperskaičiuoja. Bacs užsakymams kelias ir anksčiau buvo fiksuojamas
 * prieš apmokėjimą (on-hold) — elgesys suvienodinamas.
 *
 * IŠJUNGTI: opcija `ps_kelio_fiksavimas_isjungta` = 1 (arba ištrinti failą).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Kelio_Fiksavimas {
	const VERSIJA = '1.0';

	public static function init() {
		add_action( 'woocommerce_checkout_order_processed', [ __CLASS__, 'kasoje' ], 5, 1 );
		add_action( 'woocommerce_store_api_checkout_order_processed', [ __CLASS__, 'kasoje' ], 5, 1 ); // blokų kasa (atsargai)
	}

	/** @param int|WC_Order $order_id */
	public static function kasoje( $order_id ) {
		if ( get_option( 'ps_kelio_fiksavimas_isjungta' ) ) { return; }
		if ( ! class_exists( 'Petshop_AV_Order' ) || ! method_exists( 'Petshop_AV_Order', 'fiksuoti' ) ) { return; }
		$order = is_a( $order_id, 'WC_Order' ) ? $order_id : wc_get_order( $order_id );
		if ( ! $order ) { return; }
		if ( Petshop_AV_Order::nuspresta( $order ) ) { return; }
		try {
			Petshop_AV_Order::fiksuoti( $order );
			$order->update_meta_data( '_ps_kelias_kasoje', current_time( 'mysql' ) );
			$order->save();
		} catch ( Throwable $e ) {
			error_log( 'petshop-kelio-fiksavimas: ' . $e->getMessage() );
		}
	}
}
Petshop_Kelio_Fiksavimas::init();
