<?php
/**
 * Plugin Name: Petshop Sugrąžinimas (win_back laiškas)
 * Description: S1686 (Q4 planas, retention etapas 2, Raimio sprendimai 09-16): vienas win_back laiškas „Pakartoti ankstesnį užsakymą?" ties refill_due terminu +30 d. (formulė win_back_at = predicted_empty_date + 30), po jo ciklas sustoja iki naujo pirkimo. Teisinis pagrindas ERĮ 81(2) soft opt-out — nauja flow klasė `similar_soft_optin` (refill_due perkeliamas į ją; ne service, ne marketing; opt_out viršesnis); vartai/holdout 90/10 per petshop-lifecycle-vartai. Prekės/kaina/mygtukas — Petshop_Pakartoti::grupe (tas pats užsakymas). Core neliečiamas. Serijos 60/90/120 nedaromos.
 * Version: 1.0.0
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Sugrazinimas {
	const KLASE   = 'similar_soft_optin';
	const PO_D    = 30;   // dienų po predicted_empty_date
	const CRON    = 'ps_sugrazinimas_diena';
	const OPT_LOG = 'ps_sugrazinimas_pask';

	public static function init() {
		add_filter( 'petshop_email_flows', array( __CLASS__, 'flows' ), 20 );
		add_filter( 'petshop_email_template_path', array( __CLASS__, 'sablonas' ), 20, 3 );
		add_filter( 'petshop_email_eligibility', array( __CLASS__, 'vartai' ), 30, 5 );
		add_action( self::CRON, array( __CLASS__, 'diena' ) );
		add_action( 'init', array( __CLASS__, 'cron' ) );
	}

	public static function cron() {
		if ( ! wp_next_scheduled( self::CRON ) ) wp_schedule_event( strtotime( 'tomorrow 08:30 Europe/Vilnius' ), 'daily', self::CRON );
	}

	/** win_back srautas + refill_due į tą pačią klasę (ERĮ 81(2)). Dispatch nežinomai klasei: transakcinis suppression kanalas, be newsletter consent, toliau eligibility filtrai. */
	public static function flows( $flows ) {
		$flows['win_back'] = array( 'class' => self::KLASE, 'template' => 'win-back-60', 'delay' => 0 );
		if ( isset( $flows['refill_due'] ) ) $flows['refill_due']['class'] = self::KLASE;
		return $flows;
	}

	public static function sablonas( $file, $flow, $slug ) {
		if ( 'win_back' !== $flow ) return $file;
		$f = WPMU_PLUGIN_DIR . '/ps-sablonai/win-back-pakartoti.php';
		return file_exists( $f ) ? $f : $file;
	}

	/** Ar klientas pirko po nurodytos datos (apmokėtas užsakymas). */
	public static function pirko_po( $uid, $data ) {
		global $wpdb;
		return (bool) $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$wpdb->prefix}wc_orders WHERE customer_id=%d AND status IN ('wc-processing','wc-completed') AND date_created_gmt > %s LIMIT 1", $uid, gmdate( 'Y-m-d H:i:s', strtotime( $data . ' 23:59:59' ) ) ) );
	}

	/** Dienos cron: refill_due jau šautas (status=notified), terminas + PO_D praėjo, po paskutinio pirkimo nepirko → vienas win_back per užsakymą. */
	public static function diena() {
		global $wpdb; $p = $wpdb->prefix; $log = array( 'laikas' => current_time( 'mysql' ), 'kand' => 0, 'ikelta' => 0, 'pirko' => 0, 'dubl' => 0 );
		if ( ! class_exists( 'Petshop_Email_Dispatch' ) ) return;
		$rows = $wpdb->get_results( $wpdb->prepare( "SELECT r.user_id, r.last_order_id, MIN(r.product_id) product_id, MIN(r.id) refill_id, MAX(r.predicted_empty_date) terminas, MAX(r.last_purchase_date) pirkta, u.user_email FROM {$p}ps_refill_tracking r JOIN {$p}users u ON u.ID=r.user_id WHERE r.status='notified' AND r.predicted_empty_date <= %s GROUP BY r.user_id, r.last_order_id", date( 'Y-m-d', strtotime( '-' . self::PO_D . ' days' ) ) ) );
		foreach ( $rows as $r ) {
			$log['kand']++;
			if ( self::pirko_po( (int) $r->user_id, substr( (string) $r->pirkta, 0, 10 ) ) ) { $log['pirko']++; continue; }
			$pr = wc_get_product( (int) $r->product_id );
			$res = Petshop_Email_Dispatch::enqueue( 'win_back', $r->user_email, array(
				'product_id' => (int) $r->product_id, 'product_name' => $pr ? $pr->get_name() : '', 'order_id' => (int) $r->last_order_id,
			), array(
				'job_key' => 'win_back:' . (int) $r->user_id . ':' . (int) $r->last_order_id, 'user_id' => (int) $r->user_id,
				'context' => array( 'user_id' => (int) $r->user_id, 'product_id' => (int) $r->product_id, 'order_id' => (int) $r->last_order_id, 'last_purchase_date' => $r->pirkta, 'refill_id' => (int) $r->refill_id, 'cycle' => (string) $r->terminas ),
			) );
			if ( ! empty( $res['duplicate'] ) ) $log['dubl']++; elseif ( ! empty( $res['ok'] ) ) $log['ikelta']++;
		}
		update_option( self::OPT_LOG, $log, false );
	}

	/** Vartai win_back: pirko vėliau → terminal; nė vienos prekės sandėlyje → deferred. (Soft opt-out/holdout — lifecycle-vartai prio 20.) */
	public static function vartai( $result, $flow, $flow_class, $email, $context = array() ) {
		if ( 'win_back' !== $flow ) return $result;
		if ( is_array( $result ) && isset( $result['allowed'] ) && ! $result['allowed'] ) return $result;
		$uid = isset( $context['user_id'] ) ? (int) $context['user_id'] : 0; $pid = isset( $context['product_id'] ) ? (int) $context['product_id'] : 0;
		if ( ! $uid ) { $u = get_user_by( 'email', $email ); $uid = $u ? (int) $u->ID : 0; }
		if ( $uid && ! empty( $context['last_purchase_date'] ) && self::pirko_po( $uid, substr( (string) $context['last_purchase_date'], 0, 10 ) ) ) return array( 'allowed' => false, 'reason' => 'pirko_veliau', 'terminal' => true );
		$g = ( $uid && $pid && class_exists( 'Petshop_Pakartoti' ) ) ? Petshop_Pakartoti::grupe( $uid, $pid ) : null;
		if ( $g && empty( $g['prekes'] ) ) return array( 'allowed' => false, 'reason' => 'preke_nera_sandelyje', 'terminal' => false );
		return $result;
	}
}
Petshop_Sugrazinimas::init();
