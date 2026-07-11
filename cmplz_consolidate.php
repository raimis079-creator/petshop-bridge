/**
 * Petshop Complianz Cookie Page Konsolidacija v1 (token)
 * DRY:   /?ps_cmplz_consolidate=1&token=cmplz_6680aa2a42151d54fa8d64ec
 * APPLY: /?ps_cmplz_consolidate=1&token=cmplz_6680aa2a42151d54fa8d64ec&confirm=APPLY_CONSOLIDATE
 *
 * Tikslas: /slapuku-politika/ tampa Complianz VALDOMU cookie-statement puslapiu (svarus URL),
 * senas dublikatas (34526 "Slapuku naudojimas") -> draft + slug 'slapuku-politika-old'.
 * WP _wp_old_slug automatiskai 301-ina /slapuku-politika-es/ -> /slapuku-politika/.
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['ps_cmplz_consolidate'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	$out = array();
	$old = get_post( 34526 );
	$es  = get_page_by_path( 'slapuku-politika-es' );
	$es2 = get_page_by_path( 'slapuku-politika' ); // dabartinis clean slug savininkas

	$out['senas_34526'] = $old ? array( 'id' => $old->ID, 'title' => $old->post_title, 'slug' => $old->post_name, 'status' => $old->post_status ) : 'NERASTAS';
	$out['complianz_es'] = $es ? array( 'id' => $es->ID, 'title' => $es->post_title, 'slug' => $es->post_name, 'status' => $es->post_status ) : 'NERASTAS';
	$out['dabartinis_clean_slug_savininkas'] = $es2 ? array( 'id' => $es2->ID, 'title' => $es2->post_title ) : 'nera';
	if ( function_exists( 'cmplz_get_document_url' ) ) {
		$out['cmplz_cookie_url_PRIES'] = cmplz_get_document_url( 'cookie-statement' );
	}

	if ( ! $es ) { $out['error'] = 'Complianz -es puslapis nerastas, stabdau'; header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($out, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES); exit; }

	$apply = isset( $_GET['confirm'] ) && $_GET['confirm'] === 'APPLY_CONSOLIDATE';
	$out['mode'] = $apply ? 'APPLY' : 'DRY-RUN';
	$out['PLANAS'] = array(
		'1_senas_34526' => 'slug -> slapuku-politika-old, status -> draft',
		'2_complianz_es_' . $es->ID => 'slug -> slapuku-politika, title -> "Slapuku politika"',
		'3_rezultatas' => '/slapuku-politika/ = Complianz valdomas cookie-statement; /slapuku-politika-es/ 301 -> /slapuku-politika/ (wp_old_slug)',
	);

	if ( ! $apply ) {
		header( 'Content-Type: application/json; charset=utf-8' );
		echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		exit;
	}

	// ═══ APPLY ═══
	// 1. Atlaisvinam clean slug: senas dublikatas -> old slug + draft
	if ( $old && (int) $old->ID === 34526 ) {
		$r1 = wp_update_post( array( 'ID' => 34526, 'post_name' => 'slapuku-politika-old', 'post_status' => 'draft' ), true );
		$out['step1_senas'] = is_wp_error( $r1 ) ? $r1->get_error_message() : 'OK (draft, slug=slapuku-politika-old)';
	} else {
		$out['step1_senas'] = 'praleista (34526 nerastas ar netinka)';
	}
	clean_post_cache( 34526 );

	// 2. Complianz puslapiui -> clean slug + svarus title (wp_update_post uzfiksuoja _wp_old_slug='slapuku-politika-es')
	$r2 = wp_update_post( array( 'ID' => $es->ID, 'post_name' => 'slapuku-politika', 'post_title' => 'Slapukų politika' ), true );
	$out['step2_complianz'] = is_wp_error( $r2 ) ? $r2->get_error_message() : 'OK';
	clean_post_cache( $es->ID );

	flush_rewrite_rules( false );
	wp_cache_flush();

	// 3. Verifikacija
	$new_owner = get_page_by_path( 'slapuku-politika' );
	$out['PO_clean_slug_savininkas'] = $new_owner ? array( 'id' => $new_owner->ID, 'title' => $new_owner->post_title, 'status' => $new_owner->post_status ) : 'NERASTAS';
	$out['PO_ar_complianz_puslapis'] = ( $new_owner && (int) $new_owner->ID === (int) $es->ID ) ? '✅ TAIP (Complianz valdomas)' : '❌ NE';
	$es_check = get_post( $es->ID );
	$out['PO_complianz_slug'] = $es_check ? $es_check->post_name : '?';
	$old_check = get_post( 34526 );
	$out['PO_senas_status'] = $old_check ? $old_check->post_status . ' / ' . $old_check->post_name : '?';
	if ( function_exists( 'cmplz_get_document_url' ) ) {
		$out['cmplz_cookie_url_PO'] = cmplz_get_document_url( 'cookie-statement' );
	}
	// _wp_old_slug patikra
	$out['es_old_slugs'] = get_post_meta( $es->ID, '_wp_old_slug' );

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
