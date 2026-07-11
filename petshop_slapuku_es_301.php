/**
 * Petshop Slapuku Politika ES 301 v1 (LIVE)
 * Senas Complianz -es URL 301 -> svarus /slapuku-politika/ (page redirect,
 * nes WP native _wp_old_slug neveikia puslapiams).
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'template_redirect', function () {
	if ( is_admin() ) { return; }
	$path = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ) : '';
	$path = untrailingslashit( $path );
	if ( $path === '/slapuku-politika-es' ) {
		wp_safe_redirect( home_url( '/slapuku-politika/' ), 301 );
		exit;
	}
}, 1 );
