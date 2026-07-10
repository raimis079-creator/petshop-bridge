/**
 * TEMP — Complianz integracijos probe v2 (token)
 * Naudojimas: /?cmplz_probe2=1&token=cmplz_6680aa2a42151d54fa8d64ec
 */
if ( ! defined( 'ABSPATH' ) ) { return; }
add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['cmplz_probe2'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	$out = array();

	// Visos cmplz reiksmes is complianz_options_settings
	$s = get_option( 'complianz_options_settings' );
	$out['settings_keys'] = is_array( $s ) ? array_keys( $s ) : 'nera';
	if ( is_array( $s ) ) {
		$want = array();
		foreach ( $s as $k => $v ) {
			if ( preg_match( '/consent_mode|gtm|google|tagmanager|analytics|facebook|meta|pixel|ads|integration|script|block|category/i', $k ) ) {
				$want[ $k ] = is_array( $v ) ? $v : $v;
			}
		}
		$out['relevant_settings'] = $want;
	}

	$w = get_option( 'complianz_options_wizard' );
	if ( is_array( $w ) ) {
		$out['wizard_relevant'] = array();
		foreach ( $w as $k => $v ) {
			if ( preg_match( '/statistic|marketing|advertis|consent|gtm|google|third_party|social/i', $k ) ) {
				$out['wizard_relevant'][ $k ] = is_array( $v ) ? $v : $v;
			}
		}
	} else { $out['wizard_relevant'] = 'nera'; }

	$out['active_integrations'] = get_option( 'cmplz_active_integrations' );
	$out['integrations_changed'] = get_option( 'cmplz_integrations_changed' );

	if ( function_exists( 'cmplz_get_value' ) ) {
		foreach ( array( 'consent_mode','google_consent_mode','enable_google_consent_mode','gtm_code','compile_statistics','uses_ad_cookies','uses_ad_cookies_personalized','safe_mode','use_categories','consenttype','regions' ) as $f ) {
			$v = cmplz_get_value( $f );
			$out['values'][ $f ] = is_array( $v ) ? $v : var_export( $v, true );
		}
	}
	$out['has_consent_mode_fn'] = function_exists( 'cmplz_consent_mode' ) ? 'yes' : 'no';
	if ( function_exists( 'cmplz_consent_mode' ) ) { $out['consent_mode_active'] = cmplz_consent_mode() ? 'TRUE' : 'FALSE'; }
	if ( function_exists( 'cmplz_tcf_active' ) ) { $out['tcf_active'] = cmplz_tcf_active() ? 'TRUE' : 'FALSE'; }

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
