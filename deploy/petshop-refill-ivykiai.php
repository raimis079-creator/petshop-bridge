<?php
/**
 * Plugin Name: Petshop Refill Ivykiai
 * Description: Kontrakto §4.3 refill sritis — veidrodis is ps_event_log/ps_email_jobs + refill_purchase kabliukas. petshop-core NELIESTAS.
 * Version: 1.2
 *
 * KODEL VEIDRODIS: refill_due gimsta Petshop_Refill_Engine::check_due(), kuris
 * saukia Event_Registry::emit() ir Email_Dispatch::enqueue() — WP do_action
 * ten NERA (recon 2026-08-16). Vietoj lindimo i petshop-core, kas 10 min
 * kopijuojam is tiesos saltiniu i ps_laukai_ivykiai (sritis=refill, amzinai
 * zali pagal §7):
 *   refill_due            <- ps_event_log  (event_type=refill_due)
 *   refill_reminder_sent  <- ps_email_jobs (flow=refill_due, status=sent)
 *   refill_purchase       <- woocommerce_checkout_order_processed, kai
 *                            uzsakyme yra preke su refill_due per 45 d.;
 *                            verte = order:dienos_nuo_due
 * v1.1: stulpeliu kandidatai papildyti realiais vardais (recon per verify):
 * event_log tipo stulpelis = event_name, jobs el. pastas = recipient_email.
 *
 * v1.2 (dvi skolos is 2026-08-16 verify):
 *  - LAIKO ZONA: Statistika::irasyti() raso current_time('mysql') = LOKALUS
 *    laikas, o as skaiciavau strtotime($laikas.' UTC') -> ~3 val. poslinkis,
 *    del kurio sviezias pirkimas rodydavo '+-1d'. Dabar lyginam per
 *    current_time('timestamp') ta pacia skale, ir neigiamas rezultatas
 *    apkerpamas i 0 (pirkimas negali ivykti pries due).
 *  - IDEMPOTENCIJA: order meta _ps_refill_purchase_logged — hook'as gali
 *    suveikti kelis kartus (checkout retry, admin), ivykis turi buti vienas.
 *
 * Stulpeliu vardai aptinkami dinamiskai (SHOW COLUMNS) — jei schema kitokia,
 * veidrodis tyliai praleidzia ir raso diagnoze i option, o ne griuna.
 * Rodykles (paskutinis apdorotas id) — options (DoD #8):
 *   ps_refill_iv_event_id, ps_refill_iv_job_id
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Refill_Ivykiai {

	const VERSIJA = '1.2';
	const OPT_EV  = 'ps_refill_iv_event_id';
	const OPT_JOB = 'ps_refill_iv_job_id';
	const OPT_DIAG = 'ps_refill_iv_diag';
	const LANGAS_D = 45;

	public static function init() {
		add_action( 'ps_refill_iv_veidrodis', array( __CLASS__, 'veidrodis' ) );
		if ( ! wp_next_scheduled( 'ps_refill_iv_veidrodis' ) ) {
			wp_schedule_event( time() + 300, 'hourly', 'ps_refill_iv_veidrodis' );
		}
		add_action( 'woocommerce_checkout_order_processed', array( __CLASS__, 'pirkta' ), 30, 3 );
	}

	private static function stulpelis( $lentele, $kandidatai ) {
		global $wpdb;
		$cols = $wpdb->get_col( "SHOW COLUMNS FROM $lentele" );
		foreach ( $kandidatai as $k ) { if ( in_array( $k, (array) $cols, true ) ) { return $k; } }
		return '';
	}

	private static function ivykis( $tipas, $verte, $uid ) {
		if ( ! class_exists( 'Petshop_Statistika' ) ) { return false; }
		return Petshop_Statistika::irasyti( $tipas, array(
			'sritis' => 'refill', 'verte' => $verte, 'user_id' => (int) $uid,
		) );
	}

	public static function veidrodis() {
		global $wpdb;
		$P = $wpdb->prefix;
		$diag = array();
		$n_ev = 0; $n_job = 0;

		/* --- refill_due is ps_event_log --- */
		$t = $P . 'ps_event_log';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) === $t ) {
			$c_type  = self::stulpelis( $t, array( 'event_name', 'event_type', 'type', 'event' ) );
			$c_pay   = self::stulpelis( $t, array( 'payload', 'payload_json', 'data', 'context' ) );
			$c_email = self::stulpelis( $t, array( 'email', 'recipient_email', 'recipient', 'to_email', 'user_email' ) );
			if ( $c_type ) {
				$nuo = (int) get_option( self::OPT_EV, 0 );
				$eil = $wpdb->get_results( $wpdb->prepare(
					"SELECT * FROM $t WHERE `$c_type`='refill_due' AND id>%d ORDER BY id LIMIT 200", $nuo ), ARRAY_A );
				foreach ( (array) $eil as $e ) {
					$pl = ( $c_pay && ! empty( $e[ $c_pay ] ) ) ? json_decode( $e[ $c_pay ], true ) : array();
					$pet = isset( $pl['pet_id'] ) ? (int) $pl['pet_id'] : 0;
					$pid = isset( $pl['product_id'] ) ? (int) $pl['product_id'] : 0;
					$uid = 0;
					if ( $c_email && ! empty( $e[ $c_email ] ) ) {
						$u = get_user_by( 'email', $e[ $c_email ] ); if ( $u ) { $uid = (int) $u->ID; }
					}
					self::ivykis( 'refill_due', $pet . ':' . $pid, $uid );
					$n_ev++;
					update_option( self::OPT_EV, (int) $e['id'], false );
				}
			} else { $diag[] = 'event_log: type stulpelis nerastas'; }
		} else { $diag[] = 'ps_event_log nera'; }

		/* --- refill_reminder_sent is ps_email_jobs --- */
		$t2 = $P . 'ps_email_jobs';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t2'" ) === $t2 ) {
			$c_flow   = self::stulpelis( $t2, array( 'flow', 'flow_key', 'template', 'type' ) );
			$c_status = self::stulpelis( $t2, array( 'status', 'state' ) );
			$c_email  = self::stulpelis( $t2, array( 'recipient_email', 'to_email', 'recipient', 'email', 'user_email' ) );
			if ( $c_flow && $c_status ) {
				$nuo = (int) get_option( self::OPT_JOB, 0 );
				$eil = $wpdb->get_results( $wpdb->prepare(
					"SELECT * FROM $t2 WHERE `$c_flow`='refill_due' AND `$c_status`='sent' AND id>%d ORDER BY id LIMIT 200", $nuo ), ARRAY_A );
				foreach ( (array) $eil as $e ) {
					$uid = 0;
					if ( $c_email && ! empty( $e[ $c_email ] ) ) {
						$u = get_user_by( 'email', $e[ $c_email ] ); if ( $u ) { $uid = (int) $u->ID; }
					}
					self::ivykis( 'refill_reminder_sent', 'job:' . (int) $e['id'], $uid );
					$n_job++;
					update_option( self::OPT_JOB, (int) $e['id'], false );
				}
			} else { $diag[] = 'email_jobs: flow/status stulpeliai nerasti'; }
		} else { $diag[] = 'ps_email_jobs nera'; }

		update_option( self::OPT_DIAG, array( 'kada' => current_time( 'mysql', true ), 'ev' => $n_ev, 'job' => $n_job, 'diag' => $diag ), false );
		return array( 'ev' => $n_ev, 'job' => $n_job, 'diag' => $diag );
	}

	/** refill_purchase: uzsakyme preke, kuriai buvo refill_due per LANGAS_D d. */
	public static function pirkta( $order_id, $posted = array(), $order = null ) {
		global $wpdb;
		if ( ! class_exists( 'Petshop_Statistika' ) ) { return; }
		$order = $order instanceof WC_Order ? $order : wc_get_order( $order_id );
		if ( ! $order ) { return; }
		$uid = (int) $order->get_customer_id();
		if ( ! $uid ) { return; }
		$P = $wpdb->prefix;
		$riba = date( 'Y-m-d H:i:s', (int) current_time( 'timestamp' ) - self::LANGAS_D * DAY_IN_SECONDS );
		$due = $wpdb->get_results( $wpdb->prepare(
			"SELECT verte, laikas FROM {$P}ps_laukai_ivykiai
			 WHERE sritis='refill' AND tipas='refill_due' AND user_id=%d AND laikas>=%s
			 ORDER BY id DESC LIMIT 50", $uid, $riba ), ARRAY_A );
		if ( ! $due ) { return; }
		if ( $order->get_meta( '_ps_refill_purchase_logged' ) ) { return; } /* idempotencija */
		$pagal_preke = array();
		foreach ( $due as $d ) {
			$dalys = explode( ':', $d['verte'] );
			$pid = isset( $dalys[1] ) ? (int) $dalys[1] : 0;
			if ( $pid && ! isset( $pagal_preke[ $pid ] ) ) { $pagal_preke[ $pid ] = $d['laikas']; }
		}
		foreach ( $order->get_items() as $item ) {
			$pid = (int) $item->get_product_id();
			if ( isset( $pagal_preke[ $pid ] ) ) {
				/* ta pati laiko skale kaip Statistika::irasyti() — current_time('mysql') */
				$dabar = (int) current_time( 'timestamp' );
				$dienos = (int) floor( ( $dabar - strtotime( $pagal_preke[ $pid ] ) ) / DAY_IN_SECONDS );
				if ( $dienos < 0 ) { $dienos = 0; }
				self::ivykis( 'refill_purchase', (int) $order_id . ':+' . $dienos . 'd', $uid );
				$order->update_meta_data( '_ps_refill_purchase_logged', current_time( 'mysql', true ) );
				$order->save();
				return; /* vienas ivykis uzsakymui */
			}
		}
	}
}

Petshop_Refill_Ivykiai::init();
