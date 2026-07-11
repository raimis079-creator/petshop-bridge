/**
 * Petshop Complianz ES Redirect Fix v1 (token)
 * RUN: /?ps_cmplz_esfix=1&token=cmplz_6680aa2a42151d54fa8d64ec
 * Prideda _wp_old_slug='slapuku-politika-es' prie 34591, kad WP 301-intu i /slapuku-politika/.
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['ps_cmplz_esfix'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	$out = array();
	$es = get_page_by_path( 'slapuku-politika' ); // dabar Complianz puslapis
	$out['clean_slug_page'] = $es ? array( 'id' => $es->ID, 'title' => $es->post_title, 'slug' => $es->post_name ) : 'NERASTAS';

	if ( $es ) {
		$existing = get_post_meta( $es->ID, '_wp_old_slug' );
		$out['esami_old_slugs'] = $existing;
		if ( ! in_array( 'slapuku-politika-es', (array) $existing, true ) ) {
			add_post_meta( $es->ID, '_wp_old_slug', 'slapuku-politika-es' );
			$out['pridetas'] = 'slapuku-politika-es';
		} else {
			$out['pridetas'] = 'jau buvo';
		}
		$out['po_old_slugs'] = get_post_meta( $es->ID, '_wp_old_slug' );
	}
	wp_cache_flush();

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
