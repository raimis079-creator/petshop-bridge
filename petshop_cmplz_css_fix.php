/**
 * TEMP — Complianz CSS regen + privacy statement fix v2 (token)
 * RECON: /?cmplz_css=1&token=cmplz_6680aa2a42151d54fa8d64ec
 * APPLY: /?cmplz_css=1&token=cmplz_6680aa2a42151d54fa8d64ec&confirm=APPLY_CSS
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['cmplz_css'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	global $wpdb;
	$out = array();
	$apply = isset( $_GET['confirm'] ) && $_GET['confirm'] === 'APPLY_CSS';
	$out['mode'] = $apply ? 'APPLY' : 'RECON';

	// ---- Privatumo politikos puslapis ----
	$cur_id = (int) get_option( 'cmplz_privacy-statement_custom_page' );
	$cur_post = $cur_id ? get_post( $cur_id ) : null;
	$out['dabartinis_privacy_page'] = array(
		'id'    => $cur_id,
		'title' => $cur_post ? $cur_post->post_title : '(nerastas)',
		'slug'  => $cur_post ? $cur_post->post_name : null,
	);

	// Ieskom "Privatumo politika"
	$found = get_posts( array(
		'post_type'   => 'page',
		'post_status' => 'publish',
		'numberposts' => 10,
		's'           => 'Privatumo politika',
	) );
	$out['kandidatai'] = array();
	$target_id = 0;
	foreach ( $found as $p ) {
		$out['kandidatai'][] = array( 'id' => $p->ID, 'title' => $p->post_title, 'slug' => $p->post_name );
		if ( $p->post_title === 'Privatumo politika' && ! $target_id ) { $target_id = $p->ID; }
	}
	if ( ! $target_id ) {
		$by_slug = get_page_by_path( 'privatumo-politika' );
		if ( $by_slug ) { $target_id = $by_slug->ID; $out['rasta_pagal_slug'] = $target_id; }
	}
	$out['target_privacy_page_id'] = $target_id ? $target_id : 'NERASTA';

	// ---- CSS failai ----
	$up  = wp_upload_dir();
	$dir = $up['basedir'] . '/complianz/css';
	$out['css_pries'] = array();
	foreach ( (array) glob( $dir . '/*.css' ) as $f ) {
		$c = file_get_contents( $f );
		$out['css_pries'][] = array(
			'file'  => basename( $f ),
			'size'  => filesize( $f ),
			'mtime' => date( 'H:i:s', filemtime( $f ) ),
			'turi_3B29FF' => ( stripos( $c, '3B29FF' ) !== false ) ? 'TAIP (violetine)' : 'ne',
			'turi_2D5F3F' => ( stripos( $c, '2D5F3F' ) !== false ) ? 'TAIP (zalia)' : 'ne',
		);
	}

	if ( ! $apply ) {
		header( 'Content-Type: application/json; charset=utf-8' );
		echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		exit;
	}

	// ═══ APPLY ═══

	// 1. Privacy statement puslapis
	if ( $target_id ) {
		update_option( 'cmplz_privacy-statement_custom_page', $target_id );
		$out['privacy_updated'] = 'nuo ' . $cur_id . ' i ' . $target_id;
	} else {
		$out['privacy_updated'] = 'PRALEISTA — puslapis nerastas';
	}

	// 2. Trinam CSS
	$deleted = array();
	foreach ( (array) glob( $dir . '/*.css' ) as $f ) {
		if ( is_file( $f ) && @unlink( $f ) ) { $deleted[] = basename( $f ); }
	}
	$out['istrinta_css'] = $deleted;

	// 3. Regeneruojam
	$called = array();
	if ( function_exists( 'cmplz_resave_all_banners' ) ) { cmplz_resave_all_banners(); $called[] = 'cmplz_resave_all_banners'; }
	if ( function_exists( 'cmplz_maybe_update_css' ) )   { cmplz_maybe_update_css();   $called[] = 'cmplz_maybe_update_css'; }
	if ( class_exists( 'CMPLZ_COOKIEBANNER' ) ) {
		try {
			$b = new CMPLZ_COOKIEBANNER( 1 );
			foreach ( array( 'save', 'generate_css', 'update_css' ) as $m ) {
				if ( method_exists( $b, $m ) ) { $b->$m(); $called[] = 'CMPLZ_COOKIEBANNER::' . $m; }
			}
		} catch ( Throwable $e ) { $out['banner_err'] = $e->getMessage(); }
	}
	$out['iskviesta'] = $called;

	// 4. Cache
	$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_cmplz%' OR option_name LIKE '_transient_timeout_cmplz%'" );
	wp_cache_flush();

	// 5. Verifikacija
	clearstatcache();
	$out['css_po'] = array();
	foreach ( (array) glob( $dir . '/*.css' ) as $f ) {
		$c = file_get_contents( $f );
		$out['css_po'][] = array(
			'file'  => basename( $f ),
			'size'  => filesize( $f ),
			'mtime' => date( 'H:i:s', filemtime( $f ) ),
			'turi_3B29FF' => ( stripos( $c, '3B29FF' ) !== false ) ? '❌ VIS DAR violetine' : '✅ nera',
			'turi_2D5F3F' => ( stripos( $c, '2D5F3F' ) !== false ) ? '✅ zalia' : '❌ nera',
		);
	}
	$out['privacy_page_po'] = (int) get_option( 'cmplz_privacy-statement_custom_page' );

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
