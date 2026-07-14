<?php
/**
 * Plugin Name: Petshop ESP (Email Service Provider adapter)
 * Description: Vienintelis vamzdis is Woo/Petshop-core i Sender.net (ir ateityje kitus ESP). Susideda is: adapterio (kontraktas + Sender implementacija), event log (idempotencija), retry queue (Action Scheduler backoff), webhook receiver (consent sync). Sender = kvailas vykdytojas; verslo logika lieka Woo pusėje. „Gelezine taisykle": isjungus Sender, parduotuve praranda TIK laisku/SMS pristatyma — visi klientai, sutikimai, refill skaiciavimai, prenumeratos, priminimai islieka.
 * Version: 0.1.0
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
 * KOMPONENTAI (v0.1.0):
 * - Interface_ESP_Adapter — ESP-agnostiskas kontraktas
 * - Petshop_ESP_Event_Log — DB sluoksnis (gaj6_ps_event_log, unique event_id+adapter_name)
 * - Petshop_ESP_Retry_Queue — Action Scheduler backoff (bus v0.2.0)
 * - Petshop_Sender_Adapter — Sender.net implementacija (bus v0.2.0)
 * - Petshop_ESP_Webhook_Receiver — Sender webhook prijemimas (bus v0.3.0)
 *
 * v0.1.0 (2026-07-14): PAMATO STATYMAS — main bootstrap + interface + event log. Be Sender emit'inimo. Testuojamas 'ps_emit_event()' public API + INSERT IGNORE idempotencija + status tracking. Sender adapter'is pridedamas v0.2.0.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PETSHOP_ESP_VERSION', '0.1.0' );
define( 'PETSHOP_ESP_FILE', __FILE__ );
define( 'PETSHOP_ESP_DIR', plugin_dir_path( __FILE__ ) );
define( 'PETSHOP_ESP_URL', plugin_dir_url( __FILE__ ) );

/**
 * Naming taisykle (TZ v1.45 §1):
 * - Vidiniai eventai (Woo pusej): snake_case (pvz. 'refill_due', 'pet_profile_updated')
 * - Sender custom attributes: PS_ prefiksas (PS_PET_SPECIES, PS_MARKETING_CONSENT)
 * - ASCII only — jokia LT raidziu API/webhookuose
 */

/**
 * Autoload — paprastas require_once includes/*.php.
 * Ne PSR-4, kad neprireiktu composer'io mazam plugin'ui.
 */
require_once PETSHOP_ESP_DIR . 'includes/interface-esp-adapter.php';
require_once PETSHOP_ESP_DIR . 'includes/class-event-log.php';

/**
 * Aktyvavimo hook — sukuria/atnaujina DB lentele.
 */
register_activation_hook( __FILE__, array( 'Petshop_ESP_Event_Log', 'install' ) );

/**
 * Bootstrap: patikrina priklausomybes ir inicijuoja.
 */
add_action( 'plugins_loaded', function() {
	// Priklausomybe: WooCommerce
	if ( ! class_exists( 'WooCommerce' ) ) {
		add_action( 'admin_notices', function() {
			echo '<div class="notice notice-error"><p><strong>Petshop ESP</strong>: reikalauja WooCommerce (neaktyvus arba neįdiegtas).</p></div>';
		} );
		return;
	}

	// Uztikrina lentele (jei aktyvavimo hook'as praleistas)
	Petshop_ESP_Event_Log::maybe_install();
} );

/**
 * ==========================================================================
 * PUBLIC API — vienintelis emit'inimo taskas visai sistemai
 * ==========================================================================
 *
 * Naudojimas kitose vietose (welcome hook, order_paid hook, refill cron, ir t.t.):
 *
 *   ps_emit_event(
 *       'order_paid:12345',       // event_id (deterministinis, unique per adapter)
 *       'order_paid',              // event_name (snake_case)
 *       'klientas@pavyzdys.lt',   // recipient email
 *       array(                    // payload (bus siunciamas ESP'ui)
 *           'order_id' => 12345,
 *           'total'    => 42.50,
 *           'currency' => 'EUR',
 *       )
 *   );
 *
 * Grazina: array(
 *   'ok'         => bool,        // ar sekmingai istaisyta i eile
 *   'dedup'      => bool,        // ar buvo dublikatas (jau egzistavo)
 *   'log_id'     => int|null,    // eiluciu id lenteleje (jei istaisyta arba jau buvo)
 *   'ms'         => float,       // kiek laiko uztruko (< 100ms tikslas)
 * )
 *
 * PRINCIPAI:
 * - SINCHRONISKAI < 100ms (klientas ne laukia realaus Sender API kvietimo)
 * - INSERT IGNORE — idempotencija per UNIQUE(event_id, adapter_name)
 * - Realus siuntimas Sender'iui delegated Action Scheduler'iui (v0.2.0)
 * - Kol Sender adapter'is nesukurtas, event'ai kaupiami 'pending' busenoje
 */
function ps_emit_event( $event_id, $event_name, $email, $payload = array() ) {
	$t0 = microtime( true );
	$result = Petshop_ESP_Event_Log::insert(
		$event_id,
		$event_name,
		$email,
		$payload,
		'sender'  // pagrindinis adapter'is; buves multi-ESP jei prireiks
	);
	$result['ms'] = round( ( microtime( true ) - $t0 ) * 1000, 2 );
	return $result;
}

/**
 * Alt public API: gauti event'a is log'o pagal event_id (debug'ui, health check'ui).
 */
function ps_get_event( $event_id, $adapter_name = 'sender' ) {
	return Petshop_ESP_Event_Log::get_by_event_id( $event_id, $adapter_name );
}

/**
 * Alt public API: gauti pending event'us (bus kviesta is Action Scheduler v0.2.0).
 */
function ps_get_pending_events( $limit = 50 ) {
	return Petshop_ESP_Event_Log::get_pending( $limit );
}
