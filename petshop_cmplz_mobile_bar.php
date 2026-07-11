/**
 * Petshop Complianz Mobile Baris v1 (sticky juosta)
 * DRY:   /?ps_cmplz_mobile=1&token=cmplz_6680aa2a42151d54fa8d64ec
 * APPLY: /?ps_cmplz_mobile=1&token=cmplz_6680aa2a42151d54fa8d64ec&confirm=APPLY_MOBILE
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['ps_cmplz_mobile'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	global $wpdb;
	$tbl = $wpdb->prefix . 'cmplz_cookiebanners';
	$row = $wpdb->get_row( "SELECT * FROM $tbl WHERE ID = 1", ARRAY_A );
	if ( ! $row ) { wp_send_json( array( 'error' => 'banner ID=1 nerastas' ) ); }

	$css = <<<'CSS'
/* ===== PETSHOP COMPLIANZ BANNER CSS v2 (desktop mygtuku eilute + mobile sticky juosta) ===== */

/* --- Desktop: 3 mygtukai vienoje eiluteje (issaugota is layout_fix) --- */
.cmplz-cookiebanner .cmplz-buttons {
	display: flex !important;
	flex-direction: row !important;
	flex-wrap: nowrap !important;
	gap: 8px !important;
	width: 100% !important;
	overflow-x: hidden !important;
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

/* --- Mobile <=768px: kompaktiska sticky juosta apacioje, nedengia turinio --- */
@media (max-width: 768px) {
	#cmplz-cookiebanner-container .cmplz-cookiebanner,
	.cmplz-cookiebanner.cmplz-bottom-right {
		left: 0 !important;
		right: 0 !important;
		bottom: 0 !important;
		top: auto !important;
		width: 100% !important;
		max-width: 100% !important;
		margin: 0 !important;
		border-radius: 14px 14px 0 0 !important;
		max-height: 42vh !important;
		overflow-y: auto !important;
		padding: 10px 14px 12px !important;
		box-shadow: 0 -3px 16px rgba(0,0,0,.18) !important;
	}
	.cmplz-cookiebanner .cmplz-header { margin-bottom: 2px !important; }
	.cmplz-cookiebanner .cmplz-title { font-size: 15px !important; line-height: 1.2 !important; margin: 0 !important; }
	.cmplz-cookiebanner .cmplz-logo { display: none !important; }
	.cmplz-cookiebanner .cmplz-body { margin: 4px 0 6px !important; }
	.cmplz-cookiebanner .cmplz-message { font-size: 11.5px !important; line-height: 1.32 !important; }
	.cmplz-cookiebanner .cmplz-buttons { flex-wrap: wrap !important; gap: 6px !important; margin-top: 4px !important; }
	.cmplz-cookiebanner .cmplz-buttons .cmplz-btn { flex: 1 1 30% !important; min-width: 90px !important; margin: 0 !important; padding: 9px 8px !important; font-size: 12.5px !important; }
	.cmplz-cookiebanner .cmplz-links { margin-top: 4px !important; font-size: 10.5px !important; }
}
CSS;

	$apply = isset( $_GET['confirm'] ) && $_GET['confirm'] === 'APPLY_MOBILE';
	$out = array(
		'mode'  => $apply ? 'APPLY' : 'DRY-RUN',
		'PRIES' => array(
			'banner_version'        => $row['banner_version'],
			'use_custom_cookie_css' => $row['use_custom_cookie_css'],
			'custom_css_ilgis'      => strlen( (string) $row['custom_css'] ),
			'turi_mobile_42vh'      => ( strpos( (string) $row['custom_css'], '42vh' ) !== false ) ? 'taip' : 'ne',
		),
		'PLANUOJAMA' => array(
			'custom_css_ilgis' => strlen( $css ),
			'banner_version'   => intval( $row['banner_version'] ) + 1,
		),
	);

	if ( ! $apply ) {
		header( 'Content-Type: application/json; charset=utf-8' );
		echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		exit;
	}

	// ═══ APPLY ═══
	$res = $wpdb->update( $tbl, array(
		'custom_css'            => $css,
		'use_custom_cookie_css' => 1,
		'banner_version'        => intval( $row['banner_version'] ) + 1,
	), array( 'ID' => 1 ) );
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
	if ( function_exists( 'cmplz_get_cookiebanner' ) ) {
		$b = cmplz_get_cookiebanner( 1 );
		if ( is_object( $b ) && method_exists( $b, 'save' ) ) { $b->save(); $called[] = 'cb::save'; }
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
			'file'      => basename( $f ),
			'size'      => filesize( $f ),
			'turi_42vh' => ( strpos( $c, '42vh' ) !== false ) ? '✅ yra' : '❌ nera',
			'turi_zalia'=> ( stripos( $c, '2D5F3F' ) !== false ) ? '✅' : '(nesvarbu)',
		);
	}
	$after = $wpdb->get_row( "SELECT banner_version, use_custom_cookie_css, LENGTH(custom_css) AS css_len FROM $tbl WHERE ID = 1", ARRAY_A );
	$out['PO'] = $after;

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
