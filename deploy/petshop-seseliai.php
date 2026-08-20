<?php
/**
 * Petshop Seseliu Sinchronas v1.0 (ZB šešėlis → AV prekė)
 *
 * KONTEKSTAS (2026-08-20, Monge sujungimas):
 *   Prekė gali gyventi dviem įrašais: AV prekė (publish, klientui) ir ZB
 *   „šešėlis" (draft + hidden, `_ps_shadow_of` = AV prekės ID). Šešėlis
 *   NETRINAMAS, nes ZB Import #2/#3 prekes atpažįsta pagal ZB kodą `_sku` —
 *   ištrynus jį naktinis importas sukurtų iš naujo. Vietoj to importas toliau
 *   atnaujina ŠEŠĖLĮ, o šis modulis kiekius perkelia į AV prekę.
 *
 * KĄ DARO po kiekvieno ZB importo (#2/#3) ir kas valandą (saugiklis):
 *   - šešėlio `_zb_qty`/`_zb_cost`/`_zb_last_sync` → AV prekės meta
 *   - AV prekės `ps_sources` zb eilutė (stock_qty, cost_net, synced_at)
 *   - Petshop_Fulfillment::recalculate() — WC `_stock` = tiekėjo kiekis
 *     (AV lentynos kiekį rodymui prideda Petshop_AV_Limit, S590)
 *
 * KO NEDARO:
 *   - nekeičia šešėlio būsenos/matomumo (draft+hidden lieka)
 *   - neliečia kainos (`_price`) — ji AV prekės, savininko sprendimas
 *   - nekuria porų — pora fiksuojama tik ranka (`_ps_shadow_of`)
 *
 * Paskutinio paleidimo santrauka: option `ps_seseliai_paskutinis`.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Seseliai {

	const ZYME = '_ps_shadow_of';

	public static function init() {
		add_action( 'pmxi_after_xml_import', [ __CLASS__, 'po_importo' ], 20, 1 );
		add_action( 'ps_seseliai_valandinis', [ __CLASS__, 'sync' ] );
		if ( ! wp_next_scheduled( 'ps_seseliai_valandinis' ) ) {
			wp_schedule_event( time() + 600, 'hourly', 'ps_seseliai_valandinis' );
		}
	}

	/** Tik po ZB importų (#2 produktai, #3 likučiai). */
	public static function po_importo( $import_id ) {
		if ( in_array( (int) $import_id, array( 2, 3 ), true ) ) {
			self::sync( 'import#' . (int) $import_id );
		}
	}

	public static function sync( $kas = 'cron' ) {
		global $wpdb;
		$P = $wpdb->prefix;

		$poros = $wpdb->get_results(
			"SELECT pm.post_id AS seselis, pm.meta_value AS taikinys
			 FROM {$P}postmeta pm
			 JOIN {$P}posts p ON p.ID = pm.post_id AND p.post_type = 'product'
			 WHERE pm.meta_key = '" . self::ZYME . "' AND pm.meta_value <> ''",
			ARRAY_A
		);

		$s = array( 'kada' => current_time( 'mysql' ), 'kas' => (string) $kas,
			'poru' => count( $poros ), 'atnaujinta' => 0, 'praleista' => 0, 'klaidos' => array() );

		$F = class_exists( 'Petshop_Fulfillment' ) ? new Petshop_Fulfillment() : null;
		$T = $P . 'ps_sources';

		foreach ( $poros as $pr ) {
			$z = (int) $pr['seselis'];
			$a = (int) $pr['taikinys'];
			if ( ! $a || ! get_post( $a ) || ! get_post( $z ) ) { $s['praleista']++; continue; }

			$qty  = (int) get_post_meta( $z, '_zb_qty', true );
			$cost = (string) get_post_meta( $z, '_zb_cost', true );
			$sync = (string) get_post_meta( $z, '_zb_last_sync', true );

			$sena_q = (int) get_post_meta( $a, '_zb_qty', true );
			$sena_c = (string) get_post_meta( $a, '_zb_cost', true );

			if ( $sena_q === $qty && $sena_c === $cost ) { $s['praleista']++; continue; }

			update_post_meta( $a, '_zb_qty', $qty );
			if ( $cost !== '' ) { update_post_meta( $a, '_zb_cost', $cost ); }
			if ( $sync !== '' ) { update_post_meta( $a, '_zb_last_sync', $sync ); }

			$wpdb->update( $T,
				array( 'stock_qty' => $qty,
					'cost_net'   => ( $cost !== '' ? (float) $cost : null ),
					'synced_at'  => current_time( 'mysql' ),
					'updated_at' => current_time( 'mysql' ) ),
				array( 'product_id' => $a, 'source' => 'zb' ) );

			if ( $F ) { $F->recalculate( $a ); }
			if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( $a ); }

			$s['atnaujinta']++;
		}

		update_option( 'ps_seseliai_paskutinis', $s, false );
		return $s;
	}
}
Petshop_Seseliai::init();
