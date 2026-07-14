<?php
/**
 * Plugin Name: Petshop Core
 * Description: Petshop.lt provider-neutralus sistemos pamatas: event log + retry queue, event registry, consent log/sync, action tokens, message provider interface. Prielaida: bet koks message provider (Sender, SMS, kt.) priklauso nuo šio plugin'o, ne atvirkščiai.
 * Version: 0.4.0
 * Author: UAB Avesa / Petshop.lt
 * Requires at least: 6.0
 * Requires PHP: 8.1
 *
 * Architektūros dokumentas: dokumentai/architektura_v2.md
 * Event registry: dokumentai/events/EVENTS.md + 13 .schema.json
 *
 * PRIKLAUSOMYBĖ:
 * - Provider'iai (petshop-esp, ateities petshop-sms) require'ina šį plugin'ą.
 * - Šis plugin'as NIEKADA nekviečia konkretaus provider'io tiesiogiai —
 *   tik per Petshop_Message_Provider interface arba do_action hooks.
 *
 * MIGRACIJA IŠ petshop-esp (S186):
 * - Klasės perkeltos: Event_Log, Consent_Log, Consent_Sync, Retry_Queue, interface (Message_Provider).
 * - Klasių prefixas Petshop_ESP_* → Petshop_*.
 * - DB lentelės (gaj6_ps_event_log, gaj6_ps_consent_log) tos pačios — jokių schema pakeitimų.
 * - petshop-esp v0.4.0 palieka class_alias() backward compat pereinamuoju laikotarpiu.
 *
 * PUBLIC API:
 * - ps_emit_event($event_id, $event_name, $email, $payload)  — event log + async processing
 * - ps_get_event($id), ps_get_pending_events()
 * - ps_set_marketing_consent($email, $consent, $source, $customer_id)
 * - ps_get_marketing_consent($email)
 *
 * Ateities:
 * - ps_generate_token(), ps_verify_token(), ps_consume_token()  (S187 M6)
 * - ps_register_event(), ps_validate_event()                    (S188 Event Registry)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PETSHOP_CORE_VERSION', '0.4.0' );
define( 'PETSHOP_CORE_DIR', plugin_dir_path( __FILE__ ) );
define( 'PETSHOP_CORE_URL', plugin_dir_url( __FILE__ ) );

// --- APLINKOS KONSTANTA (saugumas) ---
// PETSHOP_ENVIRONMENT valdo dev hard allowlist provider'iuose.
//
// PATIKIMIAUSIA: apibrezti wp-config.php faile (define('PETSHOP_ENVIRONMENT','production'))
// — nes wp-config veikia ir HTTP, ir cron/CLI kontekste (kur HTTP_HOST tuscias).
//
// LAUNCH CHECKLIST: petshop.lt wp-config.php PRIVALO tureti:
//     define( 'PETSHOP_ENVIRONMENT', 'production' );
// Kitaip cron siuntimai bus blokuojami (default 'dev' allowlist).
//
// Jei wp-config nenustatyta — fallback auto-detekcija pagal domena (tik HTTP kontekste).
// Cron/CLI kontekste be wp-config konstantos → default 'dev' (saugu: blokuoja).
if ( ! defined( 'PETSHOP_ENVIRONMENT' ) ) {
	$ps_host = isset( $_SERVER['HTTP_HOST'] ) ? strtolower( $_SERVER['HTTP_HOST'] ) : '';
	if ( strpos( $ps_host, 'petshop.lt' ) !== false ) {
		define( 'PETSHOP_ENVIRONMENT', 'production' );
	} else {
		// dev.avesa.lt, nezinomas domenas, arba cron/CLI (tuscias host) → dev (saugu)
		define( 'PETSHOP_ENVIRONMENT', 'dev' );
	}
}

// --- Include komponentai ---
require_once PETSHOP_CORE_DIR . 'includes/interface-message-provider.php';
require_once PETSHOP_CORE_DIR . 'includes/class-event-log.php';
require_once PETSHOP_CORE_DIR . 'includes/class-consent-log.php';
require_once PETSHOP_CORE_DIR . 'includes/class-consent-sync.php';
require_once PETSHOP_CORE_DIR . 'includes/class-retry-queue.php';
require_once PETSHOP_CORE_DIR . 'includes/class-action-tokens.php';
require_once PETSHOP_CORE_DIR . 'includes/class-event-registry.php';
require_once PETSHOP_CORE_DIR . 'includes/class-event-emitters.php';
require_once PETSHOP_CORE_DIR . 'includes/class-magic-login.php';

// --- Activation ---
register_activation_hook( __FILE__, function() {
	Petshop_Event_Log::install();
	Petshop_Consent_Log::install();
	Petshop_Action_Tokens::install();
	Petshop_Action_Tokens::ensure_keys();
	if ( ! wp_next_scheduled( 'ps_esp_cron_process_pending' ) ) {
		wp_schedule_event( time() + 300, 'ps_esp_5min', 'ps_esp_cron_process_pending' );
	}
} );

register_deactivation_hook( __FILE__, function() {
	$ts = wp_next_scheduled( 'ps_esp_cron_process_pending' );
	if ( $ts ) {
		wp_unschedule_event( $ts, 'ps_esp_cron_process_pending' );
	}
} );

// --- Custom cron interval (5 min) ---
add_filter( 'cron_schedules', function( $s ) {
	if ( ! isset( $s['ps_esp_5min'] ) ) {
		$s['ps_esp_5min'] = array( 'interval' => 300, 'display' => 'Petshop ESP 5min' );
	}
	return $s;
} );

// --- Bootstrap (plugins_loaded, priority 5, kad butume PIRMESNI uz provider'ius) ---
add_action( 'plugins_loaded', function() {
	// Uztikrinam lenteles (jei aktyvavimo hook praleistas per manual copy)
	Petshop_Event_Log::maybe_install();
	Petshop_Consent_Log::maybe_install();
	Petshop_Action_Tokens::maybe_install();

	// MIGRACIJOS APSAUGA (S186): jei petshop-esp v0.3.0 dar gyvas su savo Retry_Queue
	// ir Consent_Sync klasemis, NELEIDZIAM core registruoti tuos pacius hook'us
	// (butu dvigubas apdorojimas). Kai esp v0.4.0 bus deploy'inta, senos klases dings
	// ir core perims valdyma. Tai laikinas guard'as tik migracijos laikotarpiu.
	$esp_still_managing = class_exists( 'Petshop_ESP_Retry_Queue' ) || class_exists( 'Petshop_ESP_Consent_Sync' );

	if ( ! $esp_still_managing ) {
		// esp v0.4.0+ arba esp nebeaktyvus — core perima
		Petshop_Retry_Queue::init();
		Petshop_Consent_Sync::init();
	}
	// jei esp v0.3.0 dar valdo — core klases uzloaduotos ir kviesamos, bet hook'ai lieka esp pusej
}, 5 );

// --- Magic Login (M9) — nepriklauso nuo WC, init plugins_loaded ---
add_action( 'plugins_loaded', function() {
	if ( class_exists( 'Petshop_Magic_Login' ) ) {
		Petshop_Magic_Login::init();
	}
}, 6 );

// --- Event Emitters (order_paid ir kt.) ---
// Kabinam ant 'woocommerce_init' (NE plugins_loaded), nes plugins_loaded metu WooCommerce
// dar gali buti neinicializuotas — hook'ai neprisiregistruotu. woocommerce_init garantuoja
// kad WC pilnai uzkrautas. Fallback: jei WC nera, 'init' su class_exists patikra.
add_action( 'woocommerce_init', function() {
	if ( class_exists( 'Petshop_Event_Emitters' ) ) {
		Petshop_Event_Emitters::init();
	}
} );

// -----------------------------------------------------------------------------
// PUBLIC API — apsaugota function_exists() guard'ais migracijos laikotarpiu.
// Petshop-esp v0.3.0 dar deklaruoja tas pačias funkcijas. Kai esp v0.4.0 bus deploy'inta,
// esp nebeturės savo deklaracijų — core taps vieninteliu šaltiniu.
// -----------------------------------------------------------------------------

if ( ! function_exists( 'ps_emit_event' ) ) {
	/**
	 * Emit'ina event'a i log + planuoja async provider processing.
	 * Perkelta is petshop-esp v0.3.0 — identiska logika.
	 */
	function ps_emit_event( $event_id, $event_name, $email, $payload = array() ) {
		$t0 = microtime( true );
		$result = Petshop_Event_Log::insert(
			$event_id,
			$event_name,
			$email,
			$payload,
			'sender'
		);
		// Uzplanuoti async siuntima TIK jei naujas (ne dedup) ir turim log_id
		if ( $result['ok'] && ! $result['dedup'] && ! empty( $result['log_id'] ) ) {
			Petshop_Retry_Queue::enqueue( $result['log_id'] );
		}
		$result['ms'] = round( ( microtime( true ) - $t0 ) * 1000, 2 );
		return $result;
	}
}

if ( ! function_exists( 'ps_get_event' ) ) {
	function ps_get_event( $event_id, $adapter_name = 'sender' ) {
		return Petshop_Event_Log::get_by_event_id( $event_id, $adapter_name );
	}
}

if ( ! function_exists( 'ps_get_pending_events' ) ) {
	function ps_get_pending_events( $limit = 50 ) {
		return Petshop_Event_Log::get_pending( $limit );
	}
}

if ( ! function_exists( 'ps_set_marketing_consent' ) ) {
	function ps_set_marketing_consent( $email, $consent, $source = 'unknown', $customer_id = 0 ) {
		return Petshop_Consent_Sync::set_marketing_consent( $email, $consent, $source, $customer_id );
	}
}

if ( ! function_exists( 'ps_get_marketing_consent' ) ) {
	function ps_get_marketing_consent( $email ) {
		$val = Petshop_Consent_Log::current_value( $email, 'marketing_consent' );
		return ( $val === null ) ? '' : $val;
	}
}

// -----------------------------------------------------------------------------
// PUBLIC API — Action Tokens (M6)
// -----------------------------------------------------------------------------

if ( ! function_exists( 'ps_generate_token' ) ) {
	/**
	 * Sugeneruoti HMAC signed action token'a.
	 *
	 * @param array $args {purpose, subject_id, subject_email, resource_id, purpose_group, action, ttl_seconds}
	 * @return string|false Raw token.
	 */
	function ps_generate_token( array $args ) {
		return Petshop_Action_Tokens::generate( $args );
	}
}

if ( ! function_exists( 'ps_peek_token' ) ) {
	/**
	 * Nuskaityti token'a BE side-effect (scanner-safe, GET/confirmation page kontekstui).
	 * @return array {valid, reason, row}
	 */
	function ps_peek_token( $raw_token ) {
		return Petshop_Action_Tokens::peek( $raw_token );
	}
}

if ( ! function_exists( 'ps_consume_token' ) ) {
	/**
	 * Patikrinti + atlikti veiksma (status→used, invaliduoti susijusius).
	 * TIK POST kontekste (negrįžtamas veiksmas).
	 * @return array {valid, reason, row}
	 */
	function ps_consume_token( $raw_token ) {
		return Petshop_Action_Tokens::consume( $raw_token );
	}
}

if ( ! function_exists( 'ps_invalidate_token_group' ) ) {
	/**
	 * Invaliduoti visus aktyvius token'us pagal purpose_group.
	 */
	function ps_invalidate_token_group( $purpose_group ) {
		return Petshop_Action_Tokens::invalidate_group( $purpose_group );
	}
}
