/**
 * TEMP — Complianz banner layout fix (token)
 * DRY:   /?cmplz_layout=1&token=cmplz_6680aa2a42151d54fa8d64ec
 * APPLY: /?cmplz_layout=1&token=cmplz_6680aa2a42151d54fa8d64ec&confirm=APPLY_LAYOUT
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['cmplz_layout'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	global $wpdb;
	$tbl = $wpdb->prefix . 'cmplz_cookiebanners';
	$row = $wpdb->get_row( "SELECT * FROM $tbl WHERE ID = 1", ARRAY_A );
	if ( ! $row ) { wp_send_json( array( 'error' => 'nerastas' ) ); }

	$css = '
/* Petshop: 3 mygtukai vienoje eiluteje (desktop), stack mobiliajame */
.cmplz-cookiebanner .cmplz-buttons {
	display: flex !important;
	flex-direction: row !important;
	flex-wrap: nowrap !important;
	gap: 8px !important;
	overflow-x: hidden !important;
	width: 100% !important;
}
.cmplz-cookiebanner .cmplz-buttons .cmplz-btn {
	flex: 1 1 0 !important;
	width: auto !important;
	min-width: 0 !important;
	max-width: none !important;
	white-space: nowrap !important;
	padding-left: 10px !important;
	padding-right: 10px !important;
	font-size: 13px !important;
	text-overflow: ellipsis;
	overflow: hidden;
}
.cmplz-cookiebanner,
.cmplz-cookiebanner .cmplz-body,
.cmplz-cookiebanner .cmplz-header {
	overflow-x: hidden !important;
}
@media (max-width: 600px) {
	.cmplz-cookiebanner .cmplz-buttons {
		flex-wrap: wrap !important;
	}
	.cmplz-cookiebanner .cmplz-buttons .cmplz-btn {
		flex: 1 1 100% !important;
	}
}
';


	$new = array(
		'banner_width'          => 620,
		'view_preferences'      => 'Nuostatos',
		'custom_css'            => $css,
		'use_custom_cookie_css' => 1,
		'banner_version'        => intval( $row['banner_version'] ) + 1,
	);

	$out = array(
		'PRIES' => array(
			'banner_width'          => $row['banner_width'],
			'view_preferences'      => $row['view_preferences'],
			'use_custom_cookie_css' => $row['use_custom_cookie_css'],
			'banner_version'        => $row['banner_version'],
			'custom_css_ilgis'      => strlen( $row['custom_css'] ),
		),
		'PLANUOJAMA' => array(
			'banner_width'          => $new['banner_width'],
			'view_preferences'      => $new['view_preferences'],
			'use_custom_cookie_css' => $new['use_custom_cookie_css'],
			'banner_version'        => $new['banner_version'],
			'custom_css_ilgis'      => strlen( $css ),
		),
	);

	if ( ! isset( $_GET['confirm'] ) || $_GET['confirm'] !== 'APPLY_LAYOUT' ) {
		$out['mode'] = 'DRY-RUN';
		header( 'Content-Type: application/json; charset=utf-8' );
		echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		exit;
	}

	$res = $wpdb->update( $tbl, $new, array( 'ID' => 1 ) );
	$out['mode']     = 'APPLY';
	$out['updated']  = $res;
	$out['db_error'] = $wpdb->last_error;

	// CSS regen
	$up  = wp_upload_dir();
	$dir = $up['basedir'] . '/complianz/css';
	$del = array();
	foreach ( (array) glob( $dir . '/*.css' ) as $f ) { if ( @unlink( $f ) ) { $del[] = basename( $f ); } }
	$out['istrinta_css'] = $del;

	$called = array();
	if ( function_exists( 'cmplz_resave_all_banners' ) ) { cmplz_resave_all_banners(); $called[] = 'resave'; }
	if ( function_exists( 'cmplz_maybe_update_css' ) )   { cmplz_maybe_update_css();   $called[] = 'maybe_update_css'; }
	$out['iskviesta'] = $called;

	// Priverstinis regen: Complianz generuoja CSS frontend uzklausoje
	if ( function_exists( 'cmplz_get_cookiebanner' ) ) {
		$b = cmplz_get_cookiebanner( 1 );
		if ( is_object( $b ) && method_exists( $b, 'save' ) ) { $b->save(); $called[] = 'cookiebanner::save'; }
	}
	if ( class_exists( 'CMPLZ_COOKIEBANNER' ) ) {
		$b2 = new CMPLZ_COOKIEBANNER( 1 );
		foreach ( array( 'generate_css', 'update_css', 'save' ) as $m ) {
			if ( method_exists( $b2, $m ) ) { try { $b2->$m(); $called[] = 'CMPLZ::' . $m; } catch ( Throwable $e ) {} }
		}
	}
	$out['iskviesta'] = $called;

	$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_cmplz%' OR option_name LIKE '_transient_timeout_cmplz%'" );
	wp_cache_flush();

	clearstatcache();
	$out['css_po'] = array();
	foreach ( (array) glob( $dir . '/*.css' ) as $f ) {
		$c = file_get_contents( $f );
		$out['css_po'][] = array(
			'file' => basename( $f ), 'size' => filesize( $f ),
			'turi_flex_wrap' => ( strpos( $c, 'flex-wrap' ) !== false ) ? '✅' : '❌',
			'turi_zalia'     => ( stripos( $c, '2D5F3F' ) !== false ) ? '✅' : '❌',
		);
	}
	$after = $wpdb->get_row( "SELECT banner_width, view_preferences, banner_version, use_custom_cookie_css FROM $tbl WHERE ID = 1", ARRAY_A );
	$out['PO'] = $after;

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
