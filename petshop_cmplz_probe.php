/**
 * TEMP — Complianz options probe v1 (token)
 * Naudojimas: /?cmplz_probe=1&token=cmplz_6680aa2a42151d54fa8d64ec
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['cmplz_probe'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	global $wpdb;
	$out = array();

	// 1. Visi cmplz/complianz option raktai
	$rows = $wpdb->get_results( "SELECT option_name, LENGTH(option_value) AS len FROM {$wpdb->options} WHERE option_name LIKE '%cmplz%' OR option_name LIKE '%complianz%' ORDER BY option_name" );
	$out['options'] = array();
	foreach ( $rows as $r ) {
		$out['options'][] = array( 'name' => $r->option_name, 'len' => (int) $r->len );
	}
	$out['options_count'] = count( $rows );

	// 2. Wizard / settings turinys (raktai tik)
	foreach ( array( 'complianz_options_wizard', 'complianz_options_settings' ) as $opt ) {
		$v = get_option( $opt );
		if ( is_array( $v ) ) {
			$out[ $opt ] = array( 'keys' => array_keys( $v ), 'count' => count( $v ) );
		} else {
			$out[ $opt ] = is_bool( $v ) ? 'FALSE/none' : gettype( $v );
		}
	}

	// 3. Svarbios reiksmes
	$important = array(
		'cmplz_wizard_completed_once', 'cmplz_deleted_stats', 'cmplz_documents_update_date',
		'cmplz_privacy_statement_generated', 'cmplz_reviewed_regions', 'cmplz_detected_countries',
	);
	$out['important'] = array();
	foreach ( $important as $k ) {
		$v = get_option( $k );
		$out['important'][ $k ] = is_array( $v ) ? '[array ' . count( $v ) . ']' : var_export( $v, true );
	}

	// 4. cmplz_get_value jei egzistuoja
	if ( function_exists( 'cmplz_get_value' ) ) {
		$fields = array( 'regions', 'consenttype', 'uses_cookies', 'purpose_of_cookies',
			'compile_statistics', 'compile_statistics_more_info', 'gtm_code',
			'use_categories', 'safe_mode', 'block_recaptcha_service' );
		$out['cmplz_get_value'] = array();
		foreach ( $fields as $f ) {
			$v = cmplz_get_value( $f );
			$out['cmplz_get_value'][ $f ] = is_array( $v ) ? $v : var_export( $v, true );
		}
	} else {
		$out['cmplz_get_value'] = 'funkcija neegzistuoja';
	}

	// 5. Integracijos
	if ( defined( 'cmplz_plugin' ) ) { $out['cmplz_plugin'] = cmplz_plugin; }
	if ( defined( 'cmplz_version' ) ) { $out['cmplz_version'] = cmplz_version; }
	if ( function_exists( 'cmplz_get_used_cookies' ) ) { $out['has_cookie_fn'] = true; }
	$out['integrations_plugins'] = array();
	if ( isset( $GLOBALS['cmplz_integrations_list'] ) ) {
		$out['integrations_plugins'] = array_keys( (array) $GLOBALS['cmplz_integrations_list'] );
	}
	$out['cmplz_integrations_option'] = get_option( 'cmplz_integrations_list' );

	// 6. Aktyvus cmplz filtrai/hooks susije su script blocking
	$out['script_blocking'] = array(
		'cmplz_placeholder_markers' => has_filter( 'cmplz_placeholder_markers' ) ? 'yes' : 'no',
		'safe_mode_const' => defined( 'CMPLZ_SAFE_MODE' ) ? 'DEFINED' : 'no',
	);

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
