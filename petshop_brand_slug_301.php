/**
 * Petshop Brand Slug 301 Catch-All v1 (NEAKTYVUS - aktyvuojama T-14 / launch dieną)
 *
 * Ištaiso v1.56 #4 spraga: bare brand slug (/{slug}) 301 -> /gamintojas/{slug}/,
 * kad apeitume WP redirect_canonical() slug spejima į atsitiktini SKU.
 *
 * Verified 2026-07-11: pries fix'a 144 fail / 72 brendai / 2131 prekes.
 * Verifikacija po aktyvavimo: paleisti Petshop QA 6-oji Salyga snippet'a
 * (#633), turi grazinti 0 fail.
 *
 * Kritine: template_redirect prioritetas 0 - suveikia PRIES WP core
 * redirect_canonical (prio 10). Kitaip WP spejimas ivyktu pirmiau.
 *
 * Analogiskas patternas: #613 Petshop Shop -> Parduotuve 301, #632 ES 301.
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'template_redirect', function () {
	if ( is_admin() ) { return; }
	if ( ! isset( $_SERVER['REQUEST_URI'] ) ) { return; }

	$path = wp_parse_url( (string) $_SERVER['REQUEST_URI'], PHP_URL_PATH );
	if ( ! is_string( $path ) || $path === '' || $path === '/' ) { return; }

	// Tik top-level bare slugs (nera antro '/' po pradinio)
	$trimmed = trim( $path, '/' );
	if ( strpos( $trimmed, '/' ) !== false ) { return; }
	if ( $trimmed === '' ) { return; }

	// Ne skaicius, ne query, ne WP rezervuoti
	if ( in_array( $trimmed, array( 'wp-login', 'wp-admin', 'wp-json', 'feed', 'sitemap', 'sitemap.xml', 'wp-sitemap.xml' ), true ) ) { return; }

	$term = get_term_by( 'slug', $trimmed, 'product_brand' );
	if ( ! $term || is_wp_error( $term ) ) { return; }
	if ( (int) $term->count === 0 ) { return; } // tusciai brand'ai - nesiuciam i tuscia archyva

	$target = home_url( '/gamintojas/' . $trimmed . '/' );
	wp_safe_redirect( $target, 301 );
	exit;
}, 0 ); // prio 0 = pries WP core redirect_canonical (prio 10)
