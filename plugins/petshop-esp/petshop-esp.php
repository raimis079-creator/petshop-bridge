<?php
/**
 * Plugin Name: Petshop ESP (Email Service Provider adapter)
 * Description: Vienintelis vamzdis is Woo/Petshop-core i Sender.net (ir ateityje kitus ESP). Susideda is: adapterio (kontraktas + Sender implementacija), event log (idempotencija), retry queue (Action Scheduler backoff), webhook receiver (consent sync). Sender = kvailas vykdytojas; verslo logika lieka Woo pusėje. „Gelezine taisykle": isjungus Sender, parduotuve praranda TIK laisku/SMS pristatyma — visi klientai, sutikimai, refill skaiciavimai, prenumeratos, priminimai islieka.
 * Version: 0.3.0
 * Author: petshop.lt
 * Requires Plugins: woocommerce
 * Text Domain: petshop-esp
 *
 * ARCHITEKTURA (uzrakinta 2026-07-14):
 * - Woo/Petshop-core = duomenu + logikos tiesa
 * - Sender = vykdymo variklis (lifecycle/marketing laiskai)
 * - WC + WP Mail SMTP = kritiniai teisiniai transakciniai (order, invoice)
 * - ESP-nepriklausomas dizainas: adapter'is per interface, keisti Sender'i i kita ESP = keisti tik SenderAdapter klase
 *
 * KOMPONENTAI:
 * - Interface_ESP_Adapter — ESP-agnostiskas kontraktas
 * - Petshop_ESP_Event_Log — DB sluoksnis (gaj6_ps_event_log, unique event_id+adapter_name)
 * - Petshop_Sender_Adapter — Sender.net implementacija (v0.2.0)
 * - Petshop_ESP_Retry_Queue — Action Scheduler backoff (v0.2.0)
 * - Petshop_ESP_Consent_Log — sutikimu istorija (gaj6_ps_consent_log, teisinis irodymas) (v0.3.0)
 * - Petshop_ESP_Consent_Sync — Woo↔Sender consent sinchronizacija (v0.3.0)
 * - Petshop_ESP_Webhook_Receiver — Sender webhook prijemimas /petshop/v1/sender-webhook (v0.3.0)
 *
 * v0.1.0 (2026-07-14): PAMATO STATYMAS — main bootstrap + interface + event log.
 * v0.2.0 (2026-07-14): SENDER ADAPTER + RETRY QUEUE — realus HTTP kvietimai i Sender API
 *   (upsert_contact, emit_event, send_transactional_email/sms placeholder, verify_webhook,
 *   health, is_operational) + Action Scheduler backoff worker (1min/5min/30min/2h/6h/24h + jitter,
 *   7 bandymai → DLQ + alert). ps_emit_event() dabar planuoja async siuntima. Cron fallback kas 5 min.
 * v0.3.0 (2026-07-14): CONSENT SYNC + WEBHOOK RECEIVER — ps_consent_log lentele (teisinis irodymas),
 *   Woo→Sender consent push (set_marketing_consent), Sender→Woo webhook receiver (/petshop/v1/sender-webhook
 *   su HMAC verify), handleriai (unsubscribe→consent=false, bounce/spam→transactional_only). Consent tiesa
 *   MŪSŲ DB, Sender = kopija. Public API: ps_set_marketing_consent(), ps_get_marketing_consent().
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PETSHOP_ESP_VERSION', '0.3.0' );
define( 'PETSHOP_ESP_FILE', __FILE__ );
define( 'PETSHOP_ESP_DIR', plugin_dir_path( __FILE__ ) );
define( 'PETSHOP_ESP_URL', plugin_dir_url( __FILE__ ) );

/**
 * Naming taisykle (TZ v1.45 §1):
 * - Vidiniai eventai (Woo pusej): snake_case (pvz. 'refill_due', 'pet_profile_updated')
 * - Sender custom attributes: PS_ prefiksas (PS_PET_SPECIES, PS_MARKETING_CONSENT)
 * - ASCII only — jokia LT raidziu API/webhookuose
 */

require_once PETSHOP_ESP_DIR . 'includes/interface-esp-adapter.php';
require_once PETSHOP_ESP_DIR . 'includes/class-event-log.php';
require_once PETSHOP_ESP_DIR . 'includes/class-sender-adapter.php';
require_once PETSHOP_ESP_DIR . 'includes/class-retry-queue.php';
require_once PETSHOP_ESP_DIR . 'includes/class-consent-log.php';
require_once PETSHOP_ESP_DIR . 'includes/class-consent-sync.php';
require_once PETSHOP_ESP_DIR . 'includes/class-webhook-receiver.php';

/**
 * Aktyvavimo hook — sukuria/atnaujina DB lentele + registruoja cron.
 */
register_activation_hook( __FILE__, function() {
	Petshop_ESP_Event_Log::install();
	Petshop_ESP_Consent_Log::install();
	if ( ! wp_next_scheduled( 'ps_esp_cron_process_pending' ) ) {
		wp_schedule_event( time() + 300, 'ps_esp_5min', 'ps_esp_cron_process_pending' );
	}
} );

/**
 * Deaktyvavimo hook — isvalo cron.
 */
register_deactivation_hook( __FILE__, function() {
	$ts = wp_next_scheduled( 'ps_esp_cron_process_pending' );
	if ( $ts ) {
		wp_unschedule_event( $ts, 'ps_esp_cron_process_pending' );
	}
} );

/**
 * Custom cron interval — 5 min.
 */
add_filter( 'cron_schedules', function( $schedules ) {
	if ( ! isset( $schedules['ps_esp_5min'] ) ) {
		$schedules['ps_esp_5min'] = array(
			'interval' => 300,
			'display'  => 'Petshop ESP — kas 5 min',
		);
	}
	return $schedules;
} );

/**
 * Bootstrap: patikrina priklausomybes ir inicijuoja.
 */
add_action( 'plugins_loaded', function() {
	if ( ! class_exists( 'WooCommerce' ) ) {
		add_action( 'admin_notices', function() {
			echo '<div class="notice notice-error"><p><strong>Petshop ESP</strong>: reikalauja WooCommerce (neaktyvus arba neįdiegtas).</p></div>';
		} );
		return;
	}

	// Uztikrina lenteles (jei aktyvavimo hook'as praleistas)
	Petshop_ESP_Event_Log::maybe_install();
	Petshop_ESP_Consent_Log::maybe_install();

	// Retry queue Action Scheduler hook
	Petshop_ESP_Retry_Queue::init();

	// Consent sync Woo hook'ai
	Petshop_ESP_Consent_Sync::init();

	// Webhook receiver REST endpoint
	Petshop_ESP_Webhook_Receiver::init();

	// Cron fallback registracija (jei aktyvavimo praleista)
	if ( ! wp_next_scheduled( 'ps_esp_cron_process_pending' ) ) {
		wp_schedule_event( time() + 300, 'ps_esp_5min', 'ps_esp_cron_process_pending' );
	}
} );

/**
 * Cron fallback: apdoroja pending/failed batch'a.
 */
add_action( 'ps_esp_cron_process_pending', function() {
	Petshop_ESP_Retry_Queue::process_pending_batch( 50 );
} );

/**
 * ==========================================================================
 * PUBLIC API — vienintelis emit'inimo taskas visai sistemai
 * ==========================================================================
 *
 * Naudojimas:
 *   ps_emit_event('order_paid:12345', 'order_paid', 'klientas@pvz.lt', array('order_id'=>12345, ...));
 *
 * Grazina: array('ok', 'dedup', 'log_id', 'ms')
 *
 * PRINCIPAI:
 * - SINCHRONISKAI < 100ms (klientas nelaukia Sender API)
 * - INSERT IGNORE — idempotencija per UNIQUE(event_id, adapter_name)
 * - Realus siuntimas delegated Action Scheduler'iui (jei prieinamas)
 * - Jei AS neprieinamas — event lieka 'pending', paimtas cron fallback'u
 */
function ps_emit_event( $event_id, $event_name, $email, $payload = array() ) {
	$t0 = microtime( true );
	$result = Petshop_ESP_Event_Log::insert(
		$event_id,
		$event_name,
		$email,
		$payload,
		'sender'
	);
	// Uzplanuoti async siuntima TIK jei naujas (ne dedup) ir turim log_id
	if ( $result['ok'] && ! $result['dedup'] && ! empty( $result['log_id'] ) ) {
		Petshop_ESP_Retry_Queue::enqueue( $result['log_id'] );
	}
	$result['ms'] = round( ( microtime( true ) - $t0 ) * 1000, 2 );
	return $result;
}

/**
 * Alt public API: gauti event'a is log'o pagal event_id (debug'ui).
 */
function ps_get_event( $event_id, $adapter_name = 'sender' ) {
	return Petshop_ESP_Event_Log::get_by_event_id( $event_id, $adapter_name );
}

/**
 * Alt public API: gauti pending event'us.
 */
function ps_get_pending_events( $limit = 50 ) {
	return Petshop_ESP_Event_Log::get_pending( $limit );
}

/**
 * Alt public API: gauti adapter'io instancija (upsert_contact ir kt. tiesiogiai).
 * Naudojama consent sync, contact attribute update hook'uose.
 */
function ps_esp_adapter() {
	static $adapter = null;
	if ( $adapter === null ) {
		$adapter = new Petshop_Sender_Adapter();
	}
	return $adapter;
}

/**
 * Public API: nustatyti marketing consent (Woo → Sender).
 * Vienintele vieta consent keitimui is kodo.
 *
 * @param string $email
 * @param bool   $consent
 * @param string $source   checkout|mano-paskyra|admin|import
 * @param int    $customer_id
 * @return array
 */
function ps_set_marketing_consent( $email, $consent, $source = 'unknown', $customer_id = 0 ) {
	return Petshop_ESP_Consent_Sync::set_marketing_consent( $email, $consent, $source, $customer_id );
}

/**
 * Public API: gauti dabartine marketing consent reiksme (is ps_consent_log tiesos).
 *
 * @param string $email
 * @return string 'true'|'false'|'' (tuscia = niekada nenustatyta)
 */
function ps_get_marketing_consent( $email ) {
	$val = Petshop_ESP_Consent_Log::current_value( $email, 'marketing_consent' );
	return ( $val === null ) ? '' : $val;
}
