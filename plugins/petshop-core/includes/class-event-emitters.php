<?php
/**
 * Petshop_Event_Emitters — WC/consent hook'ai kurie fire'ina realius event'us.
 *
 * S188: tik event'ai su ŠVARIU šaltiniu:
 * - order_paid → WC 'woocommerce_payment_complete' (uzsakymas apmoketas)
 * - consent_changed → jau emit'inama Consent_Sync viduje (cia tik uztikrinam)
 *
 * order_shipped ATIDETAS (M12) — Venipak/LP neturi švaraus "shipment created" hook'o,
 * reikia meta-change detection (kai atsiranda tracking kodas / _woo_lithuaniapost_barcode).
 *
 * Visi event'ai eina per Petshop_Event_Registry::emit() (schema validacija).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Event_Emitters {

	public static function init() {
		// order_paid: WC payment complete (patikimiausias "apmoketa" signalas)
		add_action( 'woocommerce_payment_complete', array( __CLASS__, 'on_payment_complete' ), 20, 1 );

		// Fallback: kai kurie mokejimo budai (bank transfer) neturi payment_complete —
		// uzsakymas pereina i 'processing' arba 'completed'. Gaudom ir tai, bet su dedup
		// apsauga (event_id pagal order_id — ps_emit_event INSERT IGNORE nekartos).
		add_action( 'woocommerce_order_status_processing', array( __CLASS__, 'on_order_paid_status' ), 20, 1 );
		add_action( 'woocommerce_order_status_completed', array( __CLASS__, 'on_order_paid_status' ), 20, 1 );
	}

	/**
	 * WC payment complete → order_paid event.
	 */
	public static function on_payment_complete( $order_id ) {
		self::emit_order_paid( $order_id );
	}

	/**
	 * WC status → processing/completed → order_paid (fallback bank transfer).
	 */
	public static function on_order_paid_status( $order_id ) {
		$order = wc_get_order( $order_id );
		if ( ! $order ) {
			return;
		}
		// Tik jei realiai apmoketa (turi date_paid) — kad nefire'intume nemoketiems
		if ( ! $order->get_date_paid() ) {
			return;
		}
		self::emit_order_paid( $order_id );
	}

	/**
	 * Sudaro order_paid payload + emit per registry.
	 * Idempotencija: event_id = 'order_paid_'.$order_id → INSERT IGNORE nekartos.
	 */
	private static function emit_order_paid( $order_id ) {
		$order = wc_get_order( $order_id );
		if ( ! $order ) {
			return;
		}

		$email = $order->get_billing_email();
		if ( ! $email ) {
			return;
		}

		// items su fulfillment source (jei resolveris yra)
		$items = array();
		foreach ( $order->get_items() as $item ) {
			$product = $item->get_product();
			$product_id = $product ? $product->get_id() : 0;
			$source = 'legacy';
			if ( $product_id && class_exists( 'Petshop_Fulfillment_Source' ) && method_exists( 'Petshop_Fulfillment_Source', 'resolve' ) ) {
				$resolved = Petshop_Fulfillment_Source::resolve( $product_id );
				if ( is_array( $resolved ) && isset( $resolved['source'] ) ) {
					$source = $resolved['source'];
				} elseif ( is_string( $resolved ) ) {
					$source = $resolved;
				}
			}
			$items[] = array(
				'product_id'         => $product_id,
				'sku'                => $product ? $product->get_sku() : null,
				'name'               => $item->get_name(),
				'quantity'           => (float) $item->get_quantity(),
				'line_total'         => (float) $item->get_total(),
				'fulfillment_source' => $source,
			);
		}

		// order_count klientui (jei email zinomas)
		$customer_id = $order->get_customer_id();
		$order_count = 0;
		if ( $customer_id ) {
			$order_count = wc_get_customer_order_count( $customer_id );
		}

		$payload = array(
			'order_id'            => (int) $order_id,
			'order_number'        => $order->get_order_number(),
			'order_total'         => (float) $order->get_total(),
			'order_currency'      => $order->get_currency(),
			'order_items'         => $items,
			'payment_method'      => $order->get_payment_method(),
			'shipping_method'     => implode( ', ', $order->get_shipping_methods() ? array_map( function( $m ) { return $m->get_method_title(); }, $order->get_shipping_methods() ) : array() ),
			'customer_note'       => $order->get_customer_note() ?: null,
			'is_first_order'      => ( $order_count === 1 ),
			'order_count_at_time' => (int) $order_count,
		);

		Petshop_Event_Registry::emit( 'order_paid', $email, $payload, array(
			'event_id' => 'order_paid_' . $order_id,
		) );
	}
}
