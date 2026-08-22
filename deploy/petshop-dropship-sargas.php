<?php
/**
 * Petshop Dropship Sargas v1.0 (H210) — tiekėjo vėlavimo (SLA) stebėjimas.
 *
 * PROBLEMA: perdavus užsakymą tiekėjui (`_ps_dropship_sent`) niekas neseka,
 * ar tiekėjas realiai išsiuntė. Užsakymas gali tyliai kaboti „vykdomas" dienomis.
 *
 * SPRENDIMAS: valandinis cron. Jei nuo perdavimo praėjo daugiau nei 24 val.
 * (keičiama filtru `ps_dropship_sla_valandos`), o užsakymas vis dar
 * processing/on-hold — uždedama žymė `_ps_sla_velavimas` + pastaba istorijoje.
 * Darbalaukio `klausimas()` (desk v3.16) žymę paverčia kortele „Klausimuose".
 *
 * SAUGUMO RIBA: sargas gali TIK uždėti žymę ir pastabą. Jokių statusų,
 * likučių, laiškų. Žymė dedama VIENĄ kartą (idempotencija per žymės buvimą).
 * Savaitgalio niuansas sprendžiamas žmogaus: kortelėje yra „Laukti".
 */

defined( 'ABSPATH' ) || exit;

class Petshop_Dropship_Sargas {

	const ZYME   = '_ps_sla_velavimas';
	const CRON   = 'ps_dropship_sargas';
	const RIBA_H = 24;

	public static function init() {
		add_action( 'init', array( __CLASS__, 'planuoti' ) );
		add_action( self::CRON, array( __CLASS__, 'tikrinti' ) );
	}

	public static function planuoti() {
		if ( ! wp_next_scheduled( self::CRON ) ) {
			wp_schedule_event( time() + 300, 'hourly', self::CRON );
		}
	}

	/** Valandinis patikrinimas. Grąžina pažymėtų skaičių (testams). */
	public static function tikrinti() {
		global $wpdb;
		$valandu = (int) apply_filters( 'ps_dropship_sla_valandos', self::RIBA_H );
		$riba    = gmdate( 'Y-m-d H:i:s', current_time( 'timestamp' ) - $valandu * HOUR_IN_SECONDS );
		$t  = $wpdb->prefix . 'wc_orders';
		$mt = $wpdb->prefix . 'wc_orders_meta';

		$ids = $wpdb->get_col( $wpdb->prepare(
			"SELECT o.id
			 FROM {$t} o
			 JOIN {$mt} m ON m.order_id = o.id AND m.meta_key = '_ps_dropship_sent'
			 LEFT JOIN {$mt} f ON f.order_id = o.id AND f.meta_key = %s
			 WHERE o.status IN ('wc-processing','wc-on-hold')
			   AND f.order_id IS NULL
			   AND m.meta_value <> '' AND m.meta_value < %s
			 LIMIT 50", self::ZYME, $riba ) );

		$k = 0;
		foreach ( $ids as $oid ) {
			$o = wc_get_order( $oid );
			if ( ! $o || $o->get_meta( self::ZYME ) ) { continue; }
			$sent = (string) $o->get_meta( '_ps_dropship_sent' );
			if ( ! $sent || $sent >= $riba ) { continue; }

			$o->update_meta_data( self::ZYME, current_time( 'mysql' ) );
			$o->add_order_note( sprintf(
				'Dropship sargas: tiekėjui perduota %s (daugiau nei %d val.), užsakymas vis dar vykdomas. Įkelta į „Klausimus" — patikrink pas tiekėją.',
				$sent, $valandu ), false, true );
			$o->save();
			$k++;
		}
		return $k;
	}
}
Petshop_Dropship_Sargas::init();
