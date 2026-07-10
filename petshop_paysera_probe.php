/**
 * TEMP — Paysera recon (token)
 * /?ps_probe=1&token=cmplz_6680aa2a42151d54fa8d64ec
 */
if ( ! defined( 'ABSPATH' ) ) { return; }
add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['ps_probe'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	global $wpdb;
	$out = array();

	// 1. Paysera gateway nustatymai
	$opts = $wpdb->get_results( "SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE '%paysera%' OR option_name LIKE '%evp%'", ARRAY_A );
	$out['option_names'] = wp_list_pluck( $opts, 'option_name' );

	foreach ( $out['option_names'] as $name ) {
		$v = get_option( $name );
		if ( is_array( $v ) ) {
			$safe = array();
			foreach ( $v as $k => $val ) {
				if ( preg_match( '/pass|sign|secret|key/i', $k ) ) {
					$safe[ $k ] = $val ? '[NUSTATYTA, ' . strlen( (string) $val ) . ' simb.]' : '[TUSCIA]';
				} else {
					$safe[ $k ] = is_scalar( $val ) ? $val : gettype( $val );
				}
			}
			$out['options'][ $name ] = $safe;
		} else {
			$out['options'][ $name ] = is_scalar( $v ) ? $v : gettype( $v );
		}
	}

	// 2. WC gateways
	if ( function_exists( 'WC' ) && WC()->payment_gateways ) {
		$gws = WC()->payment_gateways->payment_gateways();
		$out['gateways'] = array();
		foreach ( $gws as $id => $g ) {
			$out['gateways'][ $id ] = array(
				'title'   => $g->get_title(),
				'enabled' => $g->enabled,
				'method'  => $g->method_title,
			);
			if ( stripos( $id, 'paysera' ) !== false ) {
				$out['paysera_gateway_props'] = array();
				foreach ( get_object_vars( $g ) as $k => $v ) {
					if ( preg_match( '/pass|sign|secret|key/i', $k ) ) { $out['paysera_gateway_props'][ $k ] = $v ? '[NUSTATYTA]' : '[TUSCIA]'; }
					elseif ( is_scalar( $v ) ) { $out['paysera_gateway_props'][ $k ] = $v; }
				}
			}
		}
	}

	// 3. Plugin versija
	if ( ! function_exists( 'get_plugins' ) ) { require_once ABSPATH . 'wp-admin/includes/plugin.php'; }
	$all = get_plugins();
	$out['paysera_plugins'] = array();
	foreach ( $all as $f => $d ) {
		if ( stripos( $f, 'paysera' ) !== false || stripos( $d['Name'], 'paysera' ) !== false ) {
			$out['paysera_plugins'][] = array( 'file' => $f, 'name' => $d['Name'], 'version' => $d['Version'], 'active' => is_plugin_active( $f ) );
		}
	}

	// 4. Callback URL
	$out['callback_url_kandidatai'] = array(
		home_url( '/?wc-api=wc_gateway_paysera' ),
		home_url( '/wc-api/wc_gateway_paysera/' ),
		home_url( '/?wc-api=paysera' ),
	);
	$out['site_url'] = get_site_url();
	$out['home_url'] = home_url();

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
