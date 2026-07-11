/**
 * Petshop Complianz Cookie Page Mapping v1 (token, read-only)
 * RUN: /?ps_cmplz_pagemap=1&token=cmplz_6680aa2a42151d54fa8d64ec
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['ps_cmplz_pagemap'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	global $wpdb;
	$out = array();

	// 1. banner legal_documents stulpelis
	$tbl = $wpdb->prefix . 'cmplz_cookiebanners';
	$ld  = $wpdb->get_var( "SELECT legal_documents FROM $tbl WHERE ID = 1" );
	$out['legal_documents_raw'] = $ld;
	$un = @maybe_unserialize( $ld );
	$out['legal_documents'] = $un;

	// 2. Complianz nustatymu page ID
	foreach ( array(
		'cmplz_cookie-statement_custom_page',
		'cmplz_privacy-statement_custom_page',
		'cmplz_cookie-statement',
		'cmplz_privacy-statement',
	) as $opt ) {
		$out['option_' . $opt] = get_option( $opt );
	}

	// 3. Complianz generated pages (jei toks option yra)
	$gp = get_option( 'cmplz_generated_pages' );
	$out['cmplz_generated_pages'] = $gp;

	// 4. Puslapiu 34526 ir 35 busena + cmplz meta
	foreach ( array( 34526, 35 ) as $pid ) {
		$p = get_post( $pid );
		if ( ! $p ) { $out['page_' . $pid] = 'NERASTAS'; continue; }
		$meta = get_post_meta( $pid );
		$cmplz_meta = array();
		foreach ( (array) $meta as $k => $v ) {
			if ( stripos( $k, 'cmplz' ) !== false || stripos( $k, 'complianz' ) !== false ) {
				$cmplz_meta[ $k ] = is_array( $v ) ? ( isset( $v[0] ) ? $v[0] : $v ) : $v;
			}
		}
		$out['page_' . $pid] = array(
			'title'   => $p->post_title,
			'slug'    => $p->post_name,
			'status'  => $p->post_status,
			'modified'=> $p->post_modified,
			'cmplz_meta' => $cmplz_meta,
			'content_has_cookie_table' => ( strpos( $p->post_content, 'cmplz-cookies' ) !== false || strpos( $p->post_content, 'cookie-statement' ) !== false ) ? 'taip' : 'ne',
			'content_len' => strlen( $p->post_content ),
		);
	}

	// 5. Complianz oficiali cookie-statement nuoroda (jei funkcija yra)
	if ( function_exists( 'cmplz_get_document_url' ) ) {
		$out['cmplz_get_document_url_cookie'] = cmplz_get_document_url( 'cookie-statement' );
		$out['cmplz_get_document_url_privacy'] = cmplz_get_document_url( 'privacy-statement' );
	}
	if ( function_exists( 'cmplz_get_page_id' ) ) {
		$out['cmplz_get_page_id_cookie'] = cmplz_get_page_id( 'cookie-statement', 'eu' );
	}

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
