/**
 * Petshop Complianz Close Recon v1 (token, read-only)
 * RUN: /?ps_cmplz_close_recon=1&token=cmplz_6680aa2a42151d54fa8d64ec
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['ps_cmplz_close_recon'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	global $wpdb;
	$out = array();

	// Complianz versija
	$out['cmplz_version'] = defined( 'cmplz_version' ) ? cmplz_version : ( defined( 'CMPLZ_VERSION' ) ? CMPLZ_VERSION : 'nezinoma' );

	// 1. Banerio lentele - visi stulpeliai + reiksmes (ID=1)
	$tbl = $wpdb->prefix . 'cmplz_cookiebanners';
	$row = $wpdb->get_row( "SELECT * FROM $tbl WHERE ID = 1", ARRAY_A );
	$out['banner_columns'] = $row ? array_keys( $row ) : 'nerastas';
	// isskiriam close/dismiss/deny/functional susijusius laukus
	$out['close_related_fields'] = array();
	if ( $row ) {
		foreach ( $row as $k => $v ) {
			if ( preg_match( '/close|dismiss|deny|functional|revoke|scroll|reject/i', $k ) ) {
				$out['close_related_fields'][ $k ] = is_scalar( $v ) ? $v : gettype( $v );
			}
		}
	}

	// 2. cmplz options su close/dismiss/deny/functional/banner
	$opts = $wpdb->get_results(
		"SELECT option_name, option_value FROM {$wpdb->options}
		 WHERE option_name LIKE 'cmplz%'
		 AND ( option_name LIKE '%close%' OR option_name LIKE '%dismiss%' OR option_name LIKE '%deny%'
		    OR option_name LIKE '%functional%' OR option_name LIKE '%reject%' OR option_name LIKE '%revoke%' )",
		ARRAY_A
	);
	$out['close_options'] = array();
	foreach ( (array) $opts as $o ) {
		$val = $o['option_value'];
		$out['close_options'][ $o['option_name'] ] = ( strlen( $val ) > 120 ) ? substr( $val, 0, 120 ) . '…' : $val;
	}

	// 3. Pagrindiniai cmplz_options masyvo raktai (kur laikomi banner nustatymai)
	$main = get_option( 'complianz_options_settings' );
	if ( is_array( $main ) ) {
		$out['settings_keys_close'] = array();
		foreach ( $main as $k => $v ) {
			if ( preg_match( '/close|dismiss|deny|functional|reject|scroll|revoke/i', $k ) ) {
				$out['settings_keys_close'][ $k ] = is_scalar( $v ) ? $v : gettype( $v );
			}
		}
		$out['settings_total_keys'] = count( $main );
	} else {
		$out['complianz_options_settings'] = gettype( $main );
	}

	// 4. Ar close mygtukas apskritai ijungtas kokiu nors flag
	if ( $row ) {
		foreach ( array( 'use_categories', 'position', 'layout', 'soft_cookiewall' ) as $f ) {
			if ( array_key_exists( $f, $row ) ) { $out['banner_' . $f ] = $row[ $f ]; }
		}
	}

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
