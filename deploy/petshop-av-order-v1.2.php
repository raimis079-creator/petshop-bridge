<?php
/**
 * Petshop AV Order v1.2 (S1676) — šaltinio FIKSAVIMAS užsakymo eilutėje.
 *
 * v1.2 (S1676, Raimio taisyklė): dropship prekės pirmiausia iš tiekėjo; AV — kai tiekėjas neturi arba užsakymas
 *   mišrus (yra grynai AV prekių). Sprendimas per Petshop_AV_Source::parinkti($pid,$qty,$misrus) (v1.3);
 *   mišrumas — Petshop_AV_Source::ar_misrus($order). Pastaboje rašoma taisyklė.
 *
 * KETVIRTAS SLUOKSNIS (REGISTRAS §17.7, §18.2).
 *
 * KONSULTANTO PUNKTAS 3 (priimtas): `resolve()` NEGALI būti perskaičiuojamas
 * vėliau pagal DABARTINIUS likučius. Šiandien prekė priskirta AV, rytoj po
 * likučio pasikeitimo sistema nuspręstų VF. Pakuotojas mato viena, sistema kita.
 *
 * TODĖL: sprendimas priimamas VIENĄ kartą — kai užsakymas apmokamas — ir
 * ĮRAŠOMAS į eilutę. Vėliau tik SKAITOMAS.
 *
 * KIEKVIENOJE EILUTĖJE:
 *   _ps_source        av|vf|zb|quattro|ambrosia|belcor_tofu|prins
 *   _ps_carrier       any|venipak
 *   _ps_source_qty    kiek vienetų iš to šaltinio
 *   _ps_source_at     kada nuspręsta
 *   _ps_source_reason kodėl (diagnostikai)
 *
 * UŽSAKYME:
 *   _ps_order_type    MAIN|DS|MIXED|REVIEW
 *   _ps_groups        šaltinių sąrašas
 *   _ps_shipments     kiek siuntų išeis
 *
 * KADA: `woocommerce_payment_complete` + `woocommerce_order_status_processing`,
 * PRIORITETAS 5 — PRIEŠ likučių mažinimą (žr. init()).
 * Idempotentiška — jei jau nuspręsta, antrą kartą neperskaičiuoja.
 *
 * NEMAŽINA likučio — tai 5 sluoksnis.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_AV_Order {

	public static function init() {
		// PRIORITETAS 5 — BŪTINA. `wc_maybe_reduce_stock_levels` yra 10, o
		// Petshop_AV_Reduce — 15. Jei fiksuotume vėliau, `_ps_source` eilutėse dar
		// neegzistuotų ir NEI WC stabdymas, NEI AV nurašymas nesuveiktų (S480 klaida).
		add_action( 'woocommerce_payment_complete', [ __CLASS__, 'fiksuoti' ], 5, 1 );
		add_action( 'woocommerce_order_status_processing', [ __CLASS__, 'fiksuoti' ], 5, 1 );
		add_action( 'woocommerce_order_status_on-hold', [ __CLASS__, 'fiksuoti' ], 5, 1 );
	}

	/** Ar užsakymui jau nuspręsta. */
	public static function nuspresta( $order ) {
		$order = is_numeric( $order ) ? wc_get_order( $order ) : $order;
		return ( $order && $order->get_meta( '_ps_order_type' ) );
	}

	/**
	 * Priima sprendimą ir ĮRAŠO. Idempotentiška.
	 *
	 * @param bool $priverstinai perskaičiuoti net jei jau nuspręsta
	 */
	public static function fiksuoti( $order_id, $priverstinai = false ) {
		$order = is_numeric( $order_id ) ? wc_get_order( $order_id ) : $order_id;
		if ( ! $order ) { return; }
		if ( ! $priverstinai && self::nuspresta( $order ) ) { return; }
		if ( ! class_exists( 'Petshop_AV_Source' ) ) { return; }

		$grupes = [];
		$misrus = method_exists( 'Petshop_AV_Source', 'ar_misrus' ) ? Petshop_AV_Source::ar_misrus( $order ) : false; // v1.2
		foreach ( $order->get_items() as $item_id => $item ) {
			$pid = (int) $item->get_product_id();
			if ( ! $pid ) { continue; }
			$qty = max( 1, (int) $item->get_quantity() );

			$x = method_exists( 'Petshop_AV_Source', 'parinkti' ) ? Petshop_AV_Source::parinkti( $pid, $qty, $misrus ) : Petshop_AV_Source::resolve( $pid, $qty ); // v1.2

			$item->update_meta_data( '_ps_source',        $x['source'] );
			$item->update_meta_data( '_ps_carrier',       $x['carrier'] );
			$item->update_meta_data( '_ps_source_qty',    $qty );
			$item->update_meta_data( '_ps_source_at',     current_time( 'mysql' ) );
			$item->update_meta_data( '_ps_source_reason', $x['reason'] );
			$item->save();

			$s = $x['source'];
			if ( ! isset( $grupes[ $s ] ) ) {
				$grupes[ $s ] = [ 'carrier' => $x['carrier'], 'eilutes' => 0, 'vienetai' => 0 ];
			}
			$grupes[ $s ]['eilutes']++;
			$grupes[ $s ]['vienetai'] += $qty;
		}

		$tipas = Petshop_AV_Source::order_type( $grupes );
		$order->update_meta_data( '_ps_order_type', $tipas );
		$order->update_meta_data( '_ps_groups',     wp_json_encode( $grupes ) );
		$order->update_meta_data( '_ps_shipments',  count( $grupes ) );
		$order->update_meta_data( '_ps_decided_at', current_time( 'mysql' ) );
		$order->save();

		$sant = [];
		foreach ( $grupes as $s => $g ) { $sant[] = strtoupper( $s ) . ' ' . $g['vienetai'] . ' vnt'; }
		$order->add_order_note( 'Vykdymas: ' . $tipas . ' — ' . implode( ' · ', $sant )
			. ' (' . count( $grupes ) . ' siunta(-os))' . ( $misrus ? ' · mišrus → AV pirmenybė' : ' · dropship pirma' ) );

		return [ 'tipas' => $tipas, 'grupes' => $grupes ];
	}

	/** Perskaito ĮRAŠYTĄ sprendimą. NEPERSKAIČIUOJA. */
	public static function skaityti( $order ) {
		$order = is_numeric( $order ) ? wc_get_order( $order ) : $order;
		if ( ! $order ) { return null; }
		$tipas = $order->get_meta( '_ps_order_type' );
		if ( ! $tipas ) { return null; }

		$eilutes = [];
		foreach ( $order->get_items() as $item_id => $item ) {
			$eilutes[] = [
				'item_id' => $item_id,
				'pavadinimas' => $item->get_name(),
				'qty'     => (int) $item->get_quantity(),
				'source'  => $item->get_meta( '_ps_source' ) ?: '?',
				'carrier' => $item->get_meta( '_ps_carrier' ) ?: '?',
				'reason'  => $item->get_meta( '_ps_source_reason' ) ?: '',
			];
		}
		return [
			'tipas'      => $tipas,
			'grupes'     => json_decode( (string) $order->get_meta( '_ps_groups' ), true ) ?: [],
			'siuntos'    => (int) $order->get_meta( '_ps_shipments' ),
			'nusprasta'  => $order->get_meta( '_ps_decided_at' ),
			'eilutes'    => $eilutes,
		];
	}
}
Petshop_AV_Order::init();
