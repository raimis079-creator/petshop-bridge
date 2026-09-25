<?php
/**
 * Plugin Name: Petshop Kelio Fiksavimas
 * Description: v1.1 (S1704 → S1717) — eilutės kelią (`_ps_source`) fiksuoja jau KASOJE, ne tik apmokėjus; v1.1 — ir po WC eilučių perkūrimo.
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
 * PROBLEMA 2 (S1717, #1177 / 36296): kasą pateikus antrą kartą (tas pats krepšelis, neapmokėtas užsakymas)
 * WooCommerce `create_order()` užsakymo nekuria iš naujo, o `remove_order_items()` ištrina eilutes ir sukuria
 * naujas — pirmo pateikimo eilučių `_ps_source*` ir WC `_reduced_stock` žymės dingsta, o užsakymo lygmens
 * `_ps_decided_at` lieka, todėl `nuspresta()` = true ir nei kasos sargas, nei variklio kabliai kelio nebefiksuoja:
 * AV likutis apmokėjus nenurašomas, dropship eilučių nemato tiekėjų kortelė („Užsakyti iš …").
 *
 * SPRENDIMAS v1.1: kasoje ir apmokėjimo kabliuose (prio 4, prieš variklio prio 5) tikrinama ne užsakymo žymė,
 * o ar KIEKVIENA prekių eilutė turi `_ps_source`; jei bent viena neturi, o užsakymas jau „nuspręstas" —
 * `fiksuoti( $order, true )` (priverstinai). Jei WC likutį jau buvo nurašęs pirmame pateikime
 * (`_order_stock_reduced`), naujoms ne-AV eilutėms grąžinama `_reduced_stock` = kiekis (kad atšaukus likutis grįžtų;
 * AV eilutėms WC nurašo 0 — joms nededama). Pastaba užsakyme.
 *
 * IŠJUNGTI: opcija `ps_kelio_fiksavimas_isjungta` = 1 (arba ištrinti failą).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Kelio_Fiksavimas {
	const VERSIJA = '1.1';

	public static function init() {
		add_action( 'woocommerce_checkout_order_processed', [ __CLASS__, 'kasoje' ], 5, 1 );
		add_action( 'woocommerce_store_api_checkout_order_processed', [ __CLASS__, 'kasoje' ], 5, 1 ); // blokų kasa (atsargai)
		// v1.1: apsauga ir apmokėjimo momentu — prieš Petshop_AV_Order::fiksuoti (prio 5) ir Petshop_AV_Reduce::mazinti (prio 15)
		add_action( 'woocommerce_payment_complete', [ __CLASS__, 'apmokejus' ], 4, 1 );
		add_action( 'woocommerce_order_status_processing', [ __CLASS__, 'apmokejus' ], 4, 1 );
		add_action( 'woocommerce_order_status_on-hold', [ __CLASS__, 'apmokejus' ], 4, 1 );
	}

	private static function galima() {
		if ( get_option( 'ps_kelio_fiksavimas_isjungta' ) ) { return false; }
		return class_exists( 'Petshop_AV_Order' ) && method_exists( 'Petshop_AV_Order', 'fiksuoti' );
	}

	/** Ar bent viena prekių eilutė be `_ps_source`. */
	private static function eilutes_be_kelio( $order ) {
		foreach ( $order->get_items() as $it ) {
			if ( '' === (string) $it->get_meta( '_ps_source' ) ) { return true; }
		}
		return false;
	}

	/** @param int|WC_Order $order_id */
	public static function kasoje( $order_id ) {
		if ( ! self::galima() ) { return; }
		$order = is_a( $order_id, 'WC_Order' ) ? $order_id : wc_get_order( $order_id );
		if ( ! $order ) { return; }
		self::uztikrinti( $order, 'kasoje' );
	}

	/** @param int $order_id */
	public static function apmokejus( $order_id ) {
		if ( ! self::galima() ) { return; }
		$order = wc_get_order( $order_id );
		if ( ! $order || ! $order->get_items() ) { return; }
		if ( ! Petshop_AV_Order::nuspresta( $order ) ) { return; } // pirmą kartą — variklio prio 5 kablys padarys pats
		if ( ! self::eilutes_be_kelio( $order ) ) { return; }
		self::uztikrinti( $order, 'apmokėjus' );
	}

	private static function uztikrinti( $order, $kontekstas ) {
		$nuspresta = Petshop_AV_Order::nuspresta( $order );
		$be_kelio  = self::eilutes_be_kelio( $order );
		if ( $nuspresta && ! $be_kelio ) { return; }
		$priverstinai = $nuspresta && $be_kelio; // v1.1: eilutės perkurtos
		try {
			Petshop_AV_Order::fiksuoti( $order, $priverstinai );
			if ( $priverstinai ) {
				$order = wc_get_order( $order->get_id() );
				$grazinta = array();
				if ( $order->get_data_store()->get_stock_reduced( $order->get_id() ) ) {
					foreach ( $order->get_items() as $it ) {
						$s = (string) $it->get_meta( '_ps_source' );
						$p = $it->get_product();
						if ( '' === $s || 'av' === $s || ! $p || ! $p->managing_stock() ) { continue; }
						if ( '' !== (string) $it->get_meta( '_reduced_stock' ) ) { continue; }
						$it->update_meta_data( '_reduced_stock', (int) $it->get_quantity() );
						$it->save();
						$grazinta[] = $it->get_name();
					}
				}
				$order->add_order_note( 'Kelio fiksavimas v1.1 (' . $kontekstas . '): eilutės buvo perkurtos (pakartotinis kasos pateikimas) — kelias užfiksuotas iš naujo.' . ( $grazinta ? ' WC _reduced_stock grąžinta: ' . implode( '; ', $grazinta ) . '.' : '' ), false, true );
			}
			$order = wc_get_order( $order->get_id() );
			$order->update_meta_data( '_ps_kelias_kasoje', current_time( 'mysql' ) . ( $priverstinai ? ' | perkurta (' . $kontekstas . ')' : '' ) );
			$order->save();
		} catch ( Throwable $e ) {
			error_log( 'petshop-kelio-fiksavimas: ' . $e->getMessage() );
		}
	}
}
Petshop_Kelio_Fiksavimas::init();
