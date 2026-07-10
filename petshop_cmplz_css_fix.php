/**
 * TEMP — Complianz CSS regen + privacy statement fix (token)
 * RECON: /?cmplz_css=1&token=cmplz_6680aa2a42151d54fa8d64ec
 * APPLY: /?cmplz_css=1&token=cmplz_6680aa2a42151d54fa8d64ec&confirm=APPLY_CSS
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['cmplz_css'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	$out = array();
	$apply = isset( $_GET['confirm'] ) && $_GET['confirm'] === 'APPLY_CSS';
	$out['mode'] = $apply ? 'APPLY' : 'RECON';

	// ---- 1. CSS failai ----
	$up = wp_upload_dir();
	$dirs = array( $up['basedir'] . '/complianz/css', $up['basedir'] . '/complianz' );
	$out['css_files'] = array();
	foreach ( $dirs as $d ) {
		if ( ! is_dir( $d ) ) { $out['css_files'][ $d ] = 'NERA KATALOGO'; continue; }
		$files = glob( $d . '/*' );
		$out['css_files'][ $d ] = array();
		foreach ( (array) $files as $f ) {
			if ( is_file( $f ) ) {
				$out['css_files'][ $d ][] = array( 'file' => basename( $f ), 'size' => filesize( $f ), 'mtime' => date( 'Y-m-d H:i:s', filemtime( $f ) ) );
			}
		}
	}

	// ---- 2. Complianz klases/funkcijos ----
	$fns = array();
	foreach ( get_defined_functions()['user'] as $f ) {
		if ( strpos( $f, 'cmplz' ) === 0 && ( strpos( $f, 'css' ) !== false || strpos( $f, 'banner' ) !== false ) ) { $fns[] = $f; }
	}
	$out['cmplz_css_functions'] = $fns;
	$out['cmplz_classes'] = array_values( array_filter( get_declared_classes(), function( $c ){ return stripos( $c, 'cmplz' ) !== false || stripos( $c, 'complianz' ) !== false; } ) );

	// ---- 3. Privacy statement nustatymai ----
	$w = get_option( 'complianz_options_wizard' );
	$out['wizard_privacy'] = array();
	if ( is_array( $w ) ) {
		foreach ( $w as $k => $v ) {
			if ( stripos( $k, 'privacy' ) !== false || stripos( $k, 'statement' ) !== false || stripos( $k, 'document' ) !== false || stripos( $k, 'page' ) !== false ) {
				$out['wizard_privacy'][ $k ] = $v;
			}
		}
	} else { $out['wizard_privacy'] = 'complianz_options_wizard nera masyvas: ' . gettype($w); }

	global $wpdb;
	$rows = $wpdb->get_results( "SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE '%privacy%statement%' OR option_name LIKE 'cmplz_privacy%'", ARRAY_A );
	$out['privacy_options'] = $rows;

	if ( ! $apply ) {
		header( 'Content-Type: application/json; charset=utf-8' );
		echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		exit;
	}

	// ---- APPLY: trinam CSS ----
	$deleted = array();
	foreach ( $dirs as $d ) {
		if ( ! is_dir( $d ) ) { continue; }
		foreach ( (array) glob( $d . '/*.css' ) as $f ) {
			if ( is_file( $f ) && @unlink( $f ) ) { $deleted[] = basename( $f ); }
		}
	}
	$out['deleted_css'] = $deleted;

	// Bandom regeneruoti
	$called = array();
	foreach ( array( 'cmplz_generate_css', 'cmplz_update_css_file', 'cmplz_regenerate_css' ) as $fn ) {
		if ( function_exists( $fn ) ) { call_user_func( $fn ); $called[] = $fn; }
	}
	if ( class_exists( 'cmplz_cookiebanner' ) ) {
		try {
			$b = new cmplz_cookiebanner( 1 );
			if ( method_exists( $b, 'save' ) ) { $b->save(); $called[] = 'cmplz_cookiebanner::save'; }
			if ( method_exists( $b, 'generate_css' ) ) { $b->generate_css(); $called[] = 'cmplz_cookiebanner::generate_css'; }
		} catch ( Exception $e ) { $out['banner_class_error'] = $e->getMessage(); }
	}
	$out['called'] = $called;

	// transients
	$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_cmplz%' OR option_name LIKE '_transient_timeout_cmplz%'" );
	wp_cache_flush();

	// po
	$out['css_after'] = array();
	foreach ( $dirs as $d ) {
		if ( ! is_dir( $d ) ) { continue; }
		foreach ( (array) glob( $d . '/*' ) as $f ) {
			if ( is_file( $f ) ) { $out['css_after'][] = basename( $f ) . ' (' . filesize( $f ) . ' B)'; }
		}
	}

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
