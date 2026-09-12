<?php
/**
 * Petshop AV Reduce v1.2 (S1676) — AV likučio nurašymas.
 *
 * v1.2 (S1676): DP pakas (Daugiau=pigiau) nurašomas/grąžinamas per BAZINĘ prekę × pako kiekį
 *   (bendras principas visoms bazinėms rūšims). Eilutėje `_ps_av_reduced_pid` = bazinės ID,
 *   `_ps_av_reduced_qty` = baziniais vienetais. Snippet 567 v1.3 AV eilutes praleidžia.
 *
 * PENKTAS SLUOKSNIS (REGISTRAS §17.7, §19.6).
 *
 * PROBLEMA (rasta s479): WooCommerce jau mažina `_stock` per
 * `wc_maybe_reduce_stock_levels` (payment_complete / processing).
 * Jei papildomai mažintume `_own_stock_qty`, AV prekei nusirašytų DU kartus.
 *
 * SPRENDIMAS — nurašymas pagal EILUTĖS šaltinį:
 *   _ps_source = av   → mažinam `_own_stock_qty`, WC mažinimą PRALEIDŽIAM
 *   kiti šaltiniai    → paliekam WC elgtis kaip įprasta
 *
 * KAIP SUSTABDOM WC eilutei: `woocommerce_order_item_quantity` filtras grąžina 0
 * toms eilutėms, kurių šaltinis AV. WC tada nusirašo 0 vienetų iš `_stock`.
 * Tai švariau nei `can_reduce_order_stock`, kuris veikia VISAM užsakymui.
 *
 * KADA MAŽINAM AV: tuo pačiu momentu kaip WC — payment_complete / processing.
 * Idempotentiška per `_ps_av_reduced` žymę užsakyme.
 *
 * GRĄŽINIMAS: `woocommerce_order_status_cancelled` ir `..._refunded` — AV likutis
 * grąžinamas atgal.
 *
 * PRIKLAUSO nuo 4 sluoksnio: eilutė turi turėti `_ps_source`. Jei jo nėra
 * (senas užsakymas) — nieko nedarom, WC elgiasi kaip anksčiau.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_AV_Reduce {

	public static function init() {
		// 1) sustabdom WC mažinimą AV eilutėms
		add_filter( 'woocommerce_order_item_quantity', [ __CLASS__, 'wc_kiekis' ], 20, 3 );
		// 2) mažinam AV — PO WC (prioritetas 15, wc_maybe_reduce_stock_levels yra 10)
		add_action( 'woocommerce_payment_complete', [ __CLASS__, 'mazinti' ], 15, 1 );
		add_action( 'woocommerce_order_status_processing', [ __CLASS__, 'mazinti' ], 15, 1 );
		// 3) grąžinam
		add_action( 'woocommerce_order_status_cancelled', [ __CLASS__, 'grazinti' ], 15, 1 );
		add_action( 'woocommerce_order_status_refunded', [ __CLASS__, 'grazinti' ], 15, 1 );
	}

	/** WC nurašymui: AV eilutėms grąžinam 0, kitoms — tikrą kiekį. */
	public static function wc_kiekis( $qty, $order, $item ) {
		if ( ! is_a( $item, 'WC_Order_Item_Product' ) ) { return $qty; }
		$src = $item->get_meta( '_ps_source' );
		if ( 'av' !== $src ) { return $qty; }
		// AV eilutė — WC `_stock` neliečiam
		return 0;
	}

	/** Sumažina AV likutį toms eilutėms, kurių šaltinis AV. */
	public static function mazinti( $order_id ) {
		$order = is_numeric( $order_id ) ? wc_get_order( $order_id ) : $order_id;
		if ( ! $order ) { return; }
		if ( $order->get_meta( '_ps_av_reduced' ) ) { return; }          // idempotencija
		if ( ! class_exists( 'Petshop_AV_Stock' ) ) { return; }

		$padaryta = []; $klaidos = [];
		foreach ( $order->get_items() as $item_id => $item ) {
			if ( 'av' !== $item->get_meta( '_ps_source' ) ) { continue; }
			$pid = (int) $item->get_product_id();
			$qty = max( 1, (int) $item->get_quantity() );
			$dp  = class_exists( 'Petshop_AV_Source' ) ? Petshop_AV_Source::dp( $pid ) : null; // v1.2
			if ( $dp ) { $pid = $dp['base']; $qty = $qty * $dp['n']; $item->update_meta_data( '_ps_av_reduced_pid', $pid ); }

			// GRYNAI AV prekės likutis gyvena `_stock`, ne `_own_stock_qty` —
			// joms WC nurašymo NESTABDOM... bet mes jį jau sustabdėm filtru.
			// Todėl čia nurašom pagal tai, kur likutis realiai yra.
			$av = Petshop_AV_Stock::qty( $pid );
			if ( null === $av ) {
				// grynai AV: mažinam WooCommerce `_stock` rankomis
				$p = wc_get_product( $pid );
				if ( $p && $p->managing_stock() ) {
					$dabar = (int) get_post_meta( $pid, '_stock', true );
					$naujas = max( 0, $dabar - $qty );
					$p->set_stock_quantity( $naujas );
					if ( 0 === $naujas ) { $p->set_stock_status( 'outofstock' ); }
					$p->save();
					wc_delete_product_transients( $pid );
					$padaryta[] = "#{$pid} grynai AV {$dabar} -> {$naujas}";
					$item->update_meta_data( '_ps_av_reduced_qty', $qty );
					$item->save();
				}
				continue;
			}

			$rez = Petshop_AV_Stock::decrease( $pid, $qty, 'užsakymas #' . $order->get_order_number() );
			if ( is_wp_error( $rez ) ) {
				$klaidos[] = "#{$pid}: " . $rez->get_error_message();
			} else {
				$padaryta[] = "#{$pid} AV {$av} -> {$rez}";
				$item->update_meta_data( '_ps_av_reduced_qty', $qty );
				$item->save();
			}
		}

		if ( $padaryta || $klaidos ) {
			$order->update_meta_data( '_ps_av_reduced', current_time( 'mysql' ) );
			$order->save();
			$tekstas = 'AV nurašymas: ' . ( $padaryta ? implode( ' · ', $padaryta ) : 'nieko' );
			if ( $klaidos ) { $tekstas .= ' | KLAIDOS: ' . implode( ' · ', $klaidos ); }
			$order->add_order_note( $tekstas );
		}
	}

	/** Grąžina AV likutį atšaukus arba grąžinus pinigus. */
	public static function grazinti( $order_id ) {
		$order = is_numeric( $order_id ) ? wc_get_order( $order_id ) : $order_id;
		if ( ! $order ) { return; }
		if ( ! $order->get_meta( '_ps_av_reduced' ) ) { return; }
		if ( $order->get_meta( '_ps_av_restored' ) ) { return; }
		if ( ! class_exists( 'Petshop_AV_Stock' ) ) { return; }

		$padaryta = [];
		foreach ( $order->get_items() as $item_id => $item ) {
			$qty = (int) $item->get_meta( '_ps_av_reduced_qty' );
			if ( $qty <= 0 ) { continue; }
			$pid = (int) $item->get_meta( '_ps_av_reduced_pid' ); // v1.2: DP pakui — bazinė
			if ( $pid <= 0 ) { $pid = (int) $item->get_product_id(); }

			if ( null === Petshop_AV_Stock::qty( $pid ) ) {
				$p = wc_get_product( $pid );
				if ( $p ) {
					$dabar = (int) get_post_meta( $pid, '_stock', true );
					$p->set_stock_quantity( $dabar + $qty );
					$p->set_stock_status( 'instock' );
					$p->save();
					wc_delete_product_transients( $pid );
					$padaryta[] = "#{$pid} grynai AV +{$qty}";
				}
			} else {
				$rez = Petshop_AV_Stock::increase( $pid, $qty, 'grąžinta #' . $order->get_order_number() );
				if ( ! is_wp_error( $rez ) ) { $padaryta[] = "#{$pid} AV +{$qty} -> {$rez}"; }
			}
		}
		if ( $padaryta ) {
			$order->update_meta_data( '_ps_av_restored', current_time( 'mysql' ) );
			$order->save();
			$order->add_order_note( 'AV grąžinimas: ' . implode( ' · ', $padaryta ) );
		}
	}
}
Petshop_AV_Reduce::init();
