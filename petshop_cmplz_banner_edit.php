/**
 * TEMP — Complianz banner edit v1 (token)
 *
 * DRY:   /?cmplz_edit=1&token=cmplz_6680aa2a42151d54fa8d64ec
 * APPLY: /?cmplz_edit=1&token=cmplz_6680aa2a42151d54fa8d64ec&confirm=APPLY_BANNER
 *
 * Keicia: header, dismiss, message_optin/optout, spalvas.
 * Backup grazinamas atsakyme pries keiciant.
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['cmplz_edit'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	global $wpdb;
	$tbl = $wpdb->prefix . 'cmplz_cookiebanners';
	$row = $wpdb->get_row( "SELECT * FROM $tbl WHERE ID = 1", ARRAY_A );
	if ( ! $row ) { wp_send_json( array( 'error' => 'banner ID=1 nerastas' ) ); }

	$GREEN = '#2D5F3F';

	$msg = 'Naudojame slapukus, kad svetainė veiktų sklandžiai, o mūsų rekomendacijos būtų naudingesnės jūsų augintiniui. Būtinieji slapukai veikia visada. Analitikos ir rinkodaros slapukus įjungiame tik jums sutikus.';

	// --- Esamos reiksmes (unserialize) ---
	$cur = array();
	foreach ( array('header','dismiss','accept','message_optin','message_optout','view_preferences','save_preferences','revoke',
	                'colorpalette_text','colorpalette_toggles','colorpalette_button_accept','colorpalette_button_deny',
	                'colorpalette_button_settings','colorpalette_background','banner_version','category_prefs') as $f ) {
		$cur[ $f ] = maybe_unserialize( $row[ $f ] );
	}

	// --- Naujos reiksmes ---
	$new = array();
	$new['header']        = array( 'text' => 'Slapukai ir privatumas', 'show' => 1 );
	$new['dismiss']       = array( 'text' => 'Atmesti', 'show' => 1 );
	$new['message_optin'] = $msg;
	$new['message_optout']= $msg;

	// Spalvos: violetine -> zalia
	$ct = is_array($cur['colorpalette_text']) ? $cur['colorpalette_text'] : array();
	$ct['hyperlink'] = $GREEN;
	$new['colorpalette_text'] = $ct;

	$tg = is_array($cur['colorpalette_toggles']) ? $cur['colorpalette_toggles'] : array();
	$tg['background'] = $GREEN;
	$new['colorpalette_toggles'] = $tg;

	if ( is_array( $cur['colorpalette_button_accept'] ) ) {
		$ba = $cur['colorpalette_button_accept'];
		foreach ( array('background','border') as $k ) { if ( isset( $ba[$k] ) ) { $ba[$k] = $GREEN; } }
		$new['colorpalette_button_accept'] = $ba;
	}

	$out = array(
		'banner_id'      => 1,
		'banner_version' => $cur['banner_version'],
		'BACKUP'         => $cur,
		'PLANUOJAMA'     => $new,
	);

	if ( ! isset( $_GET['confirm'] ) || $_GET['confirm'] !== 'APPLY_BANNER' ) {
		$out['mode'] = 'DRY-RUN — niekas nepakeista';
		$out['apply_url'] = '/?cmplz_edit=1&token=' . 'cmplz_6680aa2a42151d54fa8d64ec' . '&confirm=APPLY_BANNER';
		header( 'Content-Type: application/json; charset=utf-8' );
		echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		exit;
	}

	// --- APPLY ---
	$data = array();
	foreach ( $new as $k => $v ) { $data[ $k ] = maybe_serialize( $v ); }
	$data['banner_version'] = intval( $cur['banner_version'] ) + 1;

	$res = $wpdb->update( $tbl, $data, array( 'ID' => 1 ) );
	$out['mode']     = 'APPLY';
	$out['updated']  = $res;
	$out['db_error'] = $wpdb->last_error;
	$out['new_version'] = $data['banner_version'];

	// --- Cache ---
	$cleared = array();
	foreach ( array( 'cmplz_delete_all_css_files', 'cmplz_reset_cookies', 'cmplz_clear_cache' ) as $fn ) {
		if ( function_exists( $fn ) ) { call_user_func( $fn ); $cleared[] = $fn; }
	}
	$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_cmplz%' OR option_name LIKE '_transient_timeout_cmplz%'" );
	$cleared[] = 'transients';
	if ( function_exists( 'wp_cache_flush' ) ) { wp_cache_flush(); $cleared[] = 'wp_cache_flush'; }
	$out['cache_cleared'] = $cleared;

	// --- Verifikacija ---
	$after = $wpdb->get_row( "SELECT header, dismiss, message_optin, banner_version, colorpalette_text FROM $tbl WHERE ID = 1", ARRAY_A );
	$out['PO_ATNAUJINIMO'] = array(
		'header'         => maybe_unserialize( $after['header'] ),
		'dismiss'        => maybe_unserialize( $after['dismiss'] ),
		'message_optin'  => $after['message_optin'],
		'banner_version' => $after['banner_version'],
		'colorpalette_text' => maybe_unserialize( $after['colorpalette_text'] ),
	);

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
