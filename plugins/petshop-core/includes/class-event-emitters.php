<?php
/**
 * Petshop_Event_Emitters — WC/consent hook'ai kurie fire'ina realius event'us.
 *
 * S188: tik event'ai su ŠVARIU šaltiniu:
 * - order_paid → WC 'woocommerce_payment_complete' (uzsakymas apmoketas)
 * - consent_changed → jau emit'inama Consent_Sync viduje (cia tik uztikrinam)
 *
 * order_shipped (M12, S192) — Venipak/LP neturi švaraus "shipment created" hook'o,
 * todel detektuojam per woocommerce_update_order (HPOS) — tikrinam ar atsirado
 * tracking kodas. Idempotencija per _ps_order_shipped_emitted meta zyma.
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

		// order_shipped: HPOS naudoja woocommerce_update_order (NE updated_postmeta).
		// Tikrinam ar atsirado tracking kodas (Venipak/LP). Idempotencija per order meta zyma.
		add_action( 'woocommerce_update_order', array( __CLASS__, 'maybe_emit_order_shipped' ), 20, 1 );
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

	// -------------------------------------------------------------------------
	// order_shipped (M12) — kabinamas ant woocommerce_update_order (HPOS).
	// -------------------------------------------------------------------------
	const SHIPPED_FLAG_META = '_ps_order_shipped_emitted';

	/**
	 * Tikrina ar order igijo tracking koda; jei taip ir dar nefire'inta — emit order_shipped.
	 */
	public static function maybe_emit_order_shipped( $order_id ) {
		// $order_id gali buti int arba WC_Order (priklauso nuo WC versijos)
		$order = is_a( $order_id, 'WC_Order' ) ? $order_id : wc_get_order( $order_id );
		if ( ! $order ) {
			return;
		}
		$oid = $order->get_id();

		// Idempotencija: jei jau fire'inta — stop
		if ( $order->get_meta( self::SHIPPED_FLAG_META ) === 'yes' ) {
			return;
		}

		// Nustatom carrier + tracking
		$shipping = self::resolve_tracking( $order );
		if ( ! $shipping || empty( $shipping['tracking_number'] ) ) {
			return;  // dar nera tracking — nefire'inam
		}

		$email = $order->get_billing_email();
		if ( ! $email ) {
			return;
		}

		$payload = array(
			'order_id'           => (int) $oid,
			'order_number'       => $order->get_order_number(),
			'carrier'            => $shipping['carrier'],
			'tracking_number'    => $shipping['tracking_number'],
			'tracking_url'       => $shipping['tracking_url'],
			'delivery_type'      => $shipping['delivery_type'],
			'estimated_delivery' => null,
		);

		$result = Petshop_Event_Registry::emit( 'order_shipped', $email, $payload, array(
			'event_id' => 'order_shipped_' . $oid,
		) );

		// Pazymim kaip fire'inta (kad nekartotume).
		// SVARBU: $order->save() viduje woocommerce_update_order hook'o retrigger'intu
		// si patti metoda -> begalinis ciklas. Todel laikinai atkabinam hook'a.
		if ( ! empty( $result['ok'] ) ) {
			remove_action( 'woocommerce_update_order', array( __CLASS__, 'maybe_emit_order_shipped' ), 20 );
			$order->update_meta_data( self::SHIPPED_FLAG_META, 'yes' );
			$order->save();
			add_action( 'woocommerce_update_order', array( __CLASS__, 'maybe_emit_order_shipped' ), 20, 1 );
		}
	}

	/**
	 * Nustato carrier + tracking_number + delivery_type is order meta.
	 * Venipak: get_venipak_tracking_code() arba meta. LP: _woo_lithuaniapost_barcode.
	 *
	 * @return array|null {carrier, tracking_number, tracking_url, delivery_type}
	 */
	private static function resolve_tracking( $order ) {
		// 1. LP Express — _woo_lithuaniapost_barcode meta
		$lp_barcode = $order->get_meta( '_woo_lithuaniapost_barcode' );
		if ( ! empty( $lp_barcode ) ) {
			return array(
				'carrier'         => 'lp_express',
				'tracking_number' => is_array( $lp_barcode ) ? reset( $lp_barcode ) : (string) $lp_barcode,
				'tracking_url'    => 'https://www.post.lt/siuntos-paieska?barcode=' . rawurlencode( is_array( $lp_barcode ) ? reset( $lp_barcode ) : (string) $lp_barcode ),
				'delivery_type'   => self::guess_delivery_type( $order ),
			);
		}

		// 2. Venipak — skaitom tiesiai is order meta 'venipak_shipping_order_data' (JSON).
		//    Struktura: {pack_numbers: [...]}. NENAUDOJAM Venipak klases (jos konstruktorius
		//    reikalauja 3 argumentu — plugin_name, version, settings — negalima instancijuoti).
		$venipak_data_raw = $order->get_meta( 'venipak_shipping_order_data' );
		if ( ! empty( $venipak_data_raw ) ) {
			$venipak_data = is_array( $venipak_data_raw ) ? $venipak_data_raw : json_decode( $venipak_data_raw, true );
			if ( is_array( $venipak_data ) && ! empty( $venipak_data['pack_numbers'] ) && is_array( $venipak_data['pack_numbers'] ) ) {
				$packs = array_filter( $venipak_data['pack_numbers'] );
				if ( ! empty( $packs ) ) {
					$first = reset( $packs );
					return array(
						'carrier'         => 'venipak',
						'tracking_number' => implode( ',', $packs ),
						'tracking_url'    => 'https://venipak.lt/track?code=' . rawurlencode( (string) $first ),
						'delivery_type'   => self::guess_delivery_type( $order ),
					);
				}
			}
		}

		return null;
	}

	/**
	 * Bando nustatyti delivery_type pagal shipping method.
	 * courier | parcel_terminal | post_office
	 */
	private static function guess_delivery_type( $order ) {
		$methods = $order->get_shipping_methods();
		foreach ( $methods as $method ) {
			$id = strtolower( $method->get_method_id() . ' ' . $method->get_name() );
			if ( strpos( $id, 'terminal' ) !== false || strpos( $id, 'pickup' ) !== false || strpos( $id, 'pastomat' ) !== false ) {
				return 'parcel_terminal';
			}
			if ( strpos( $id, 'post' ) !== false || strpos( $id, 'pastas' ) !== false || strpos( $id, 'office' ) !== false ) {
				return 'post_office';
			}
		}
		return 'courier';
	}
}
