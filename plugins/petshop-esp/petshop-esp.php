<?php
/**
 * Plugin Name: Petshop ESP (Sender adapter)
 * Description: Sender.net adapter'is Petshop.lt. Priklauso nuo petshop-core plugin'o. Realizuoja Petshop_Message_Provider interface + Sender-specifinis webhook receiver + PS_ laukų mapping'as. Provider-specifinės sudėtinės perkeltos iš esp v0.3.0 į core — šis plugin'as lieka tik Sender-specifinės logikos.
 * Version: 0.4.0
 * Author: UAB Avesa / Petshop.lt
 * Requires at least: 6.0
 * Requires PHP: 8.1
 *
 * MIGRACIJA S186 (v0.3.0 → v0.4.0):
 * - Event_Log, Consent_Log, Consent_Sync, Retry_Queue klasės perkeltos į petshop-core.
 * - Interface_ESP_Adapter perkeltas į petshop-core kaip Petshop_Message_Provider.
 * - Public API funkcijos (ps_emit_event, ps_set_marketing_consent, ...) perkeltos į petshop-core.
 * - Backward compat class_alias'ai palikti (Petshop_ESP_Event_Log → Petshop_Event_Log ir kt.),
 *   kad senas kodas veiktų, kol viską perkirpsim.
 * - Sender_Adapter dabar implements Petshop_Message_Provider.
 * - Pridėtas DEV hard allowlist Sender_Adapter viduje (saugumas kode, ne Sender ekrane).
 *
 * PALIEKA:
 * - Petshop_Sender_Adapter (implements Petshop_Message_Provider, +DEV allowlist)
 * - Petshop_ESP_Webhook_Receiver (Sender-specifinis HMAC parašo formatas)
 * - Public helper ps_esp_adapter() — Sender-specifinis singleton (Retry_Queue jį kviečia)
 *
 * PRIKLAUSOMYBĖ:
 * - petshop-core PRIVALO buti aktyvus. Jei ne — šis plugin'as sustoja ir rodo admin notice.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PETSHOP_ESP_VERSION', '0.4.0' );
define( 'PETSHOP_ESP_DIR', plugin_dir_path( __FILE__ ) );

// --- PRIKLAUSOMYBĖS TIKRINIMAS ---
// petshop-core PRIVALO buti aktyvus. Kitaip PHP fatal error (klases nezinomos).
add_action( 'plugins_loaded', function() {
	if ( ! defined( 'PETSHOP_CORE_VERSION' ) ) {
		add_action( 'admin_notices', function() {
			echo '<div class="notice notice-error"><p><strong>Petshop ESP</strong> reikalauja aktyvuoto <strong>petshop-core</strong> plugin\'o.</p></div>';
		} );
		return;
	}
	// Priklausomybė patenkinta — kraunam Sender adapter + webhook receiver.
	require_once PETSHOP_ESP_DIR . 'includes/class-sender-adapter.php';
	require_once PETSHOP_ESP_DIR . 'includes/class-webhook-receiver.php';

	// Backward compat class_alias'ai:
	// Senas kodas (kiti moduliai, snippet'ai) gali naudoti Petshop_ESP_* pavadinimus.
	// Šie alias'ai leidžia jam veikti be perkompiliavimo.
	if ( class_exists( 'Petshop_Event_Log' ) && ! class_exists( 'Petshop_ESP_Event_Log' ) ) {
		class_alias( 'Petshop_Event_Log', 'Petshop_ESP_Event_Log' );
	}
	if ( class_exists( 'Petshop_Consent_Log' ) && ! class_exists( 'Petshop_ESP_Consent_Log' ) ) {
		class_alias( 'Petshop_Consent_Log', 'Petshop_ESP_Consent_Log' );
	}
	if ( class_exists( 'Petshop_Consent_Sync' ) && ! class_exists( 'Petshop_ESP_Consent_Sync' ) ) {
		class_alias( 'Petshop_Consent_Sync', 'Petshop_ESP_Consent_Sync' );
	}
	if ( class_exists( 'Petshop_Retry_Queue' ) && ! class_exists( 'Petshop_ESP_Retry_Queue' ) ) {
		class_alias( 'Petshop_Retry_Queue', 'Petshop_ESP_Retry_Queue' );
	}
	if ( interface_exists( 'Petshop_Message_Provider' ) && ! interface_exists( 'Interface_ESP_Adapter' ) ) {
		class_alias( 'Petshop_Message_Provider', 'Interface_ESP_Adapter' );
	}

	// Webhook receiver — Sender specifika, lieka esp pusej
	Petshop_ESP_Webhook_Receiver::init();
}, 10 );  // priority 10 — po petshop-core (priority 5)

// -----------------------------------------------------------------------------
// SENDER-SPECIFINIS HELPER
// -----------------------------------------------------------------------------
// ps_esp_adapter() — Sender adapter singleton. Naudojama Retry_Queue (core viduje)
// ir Consent_Sync. Kai atsiras antras provider (SMS), pereisim į filter mechanizmą
// apply_filters('petshop_get_message_provider').
if ( ! function_exists( 'ps_esp_adapter' ) ) {
	function ps_esp_adapter() {
		static $adapter = null;
		if ( $adapter === null && class_exists( 'Petshop_Sender_Adapter' ) ) {
			$adapter = new Petshop_Sender_Adapter();
		}
		return $adapter;
	}
}
