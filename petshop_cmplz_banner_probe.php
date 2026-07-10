/**
 * TEMP — Complianz banner probe v1 (token)
 * Naudojimas: /?cmplz_banner=1&token=cmplz_6680aa2a42151d54fa8d64ec
 */
if ( ! defined( 'ABSPATH' ) ) { return; }
add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['cmplz_banner'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	global $wpdb;
	$out = array();

	// 1. Ar yra cmplz banners lentele
	$tables = $wpdb->get_col( "SHOW TABLES LIKE '%cmplz%'" );
	$out['tables'] = $tables;

	// 2. Banner objektas
	if ( function_exists( 'cmplz_get_banner_by_id' ) ) {
		$b = cmplz_get_banner_by_id();
		$out['banner_class'] = get_class( $b );
		$props = get_object_vars( $b );
		$out['banner_props'] = array();
		foreach ( $props as $k => $v ) {
			$out['banner_props'][ $k ] = is_scalar( $v ) ? $v : ( is_array($v) ? '[array '.count($v).']' : gettype($v) );
		}
	} else {
		$out['banner_fn'] = 'cmplz_get_banner_by_id NEEGZISTUOJA';
	}

	// 3. Banner lenteles turinys
	$bt = $wpdb->prefix . 'cmplz_cookiebanners';
	if ( $wpdb->get_var( "SHOW TABLES LIKE '$bt'" ) === $bt ) {
		$row = $wpdb->get_row( "SELECT * FROM $bt LIMIT 1", ARRAY_A );
		$out['cookiebanners_columns'] = $row ? array_keys( $row ) : 'tuscia';
		$out['cookiebanners_row'] = $row;
	} else {
		$out['cookiebanners_table'] = 'NERA';
	}

	// 4. Privatumo pareiskimo nustatymai
	if ( function_exists( 'cmplz_get_value' ) ) {
		foreach ( array( 'privacy-statement','privacy_statement','cookie-statement','cookie_statement','accept','deny','view_preferences','save_preferences','message_optin','title' ) as $f ) {
			$v = cmplz_get_value( $f );
			$out['values'][ $f ] = is_array( $v ) ? $v : var_export( $v, true );
		}
	}

	// 5. Dokumentu nustatymai
	$out['documents'] = array();
	foreach ( array( 'cmplz_privacy_statement_generated','cmplz_documents' ) as $o ) {
		$out['documents'][ $o ] = get_option( $o );
	}
	if ( function_exists( 'cmplz_get_document_by_type' ) ) {
		foreach ( array('privacy-statement','cookie-statement') as $t ) {
			$out['doc_by_type'][ $t ] = cmplz_get_document_by_type( $t );
		}
	}

	// 6. Funkcijos
	$out['functions'] = array();
	foreach ( array('cmplz_update_option','cmplz_get_banner_by_id','cmplz_get_value','cmplz_get_document_by_type') as $f ) {
		$out['functions'][ $f ] = function_exists( $f ) ? 'yes' : 'no';
	}

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
