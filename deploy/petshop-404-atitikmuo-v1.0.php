<?php
/**
 * Plugin Name: Petshop 404 atitikmuo v1.0 (S1689s)
 * Description: Senos platformos adresams, kurių nėra legacy-301 žemėlapyje: 301 TIK kai paskutinis kelio
 *   segmentas (be .html ir ID priešdėlio) TIKSLIAI sutampa su publikuotos prekės / prekių kategorijos /
 *   gamintojo slug. Jokio „panašiausio" spėjimo. Veikia po petshop-legacy-301 (prio 1), tik kai is_404().
 *   Papildomai fiksuoti alias: paieska, visos-prekes, allproducts, login.
 *   X-Redirect-By: Petshop-404-Atitikmuo
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'template_redirect', function () {
	if ( is_admin() || wp_doing_ajax() || is_robots() || is_feed() || ! is_404() ) { return; }

	$uri    = (string) ( $_SERVER['REQUEST_URI'] ?? '' );
	$kelias = strtolower( trim( rawurldecode( (string) parse_url( $uri, PHP_URL_PATH ) ), '/' ) );
	if ( '' === $kelias || preg_match( '#(^|/)(wp-|\.)|\.(php|css|js|png|jpe?g|webp|gif|xml|txt|env)$#i', $kelias ) ) { return; }

	$alias = array(
		'paieska'      => '/parduotuve/',
		'visos-prekes' => '/parduotuve/',
		'allproducts'  => '/parduotuve/',
		'login'        => '/paskyra/',
	);
	$url = null;
	if ( isset( $alias[ $kelias ] ) ) {
		$url = home_url( $alias[ $kelias ] );
	} else {
		$seg  = array_values( array_filter( explode( '/', $kelias ), 'strlen' ) );
		$last = end( $seg );
		if ( count( $seg ) >= 3 && 'page' === $seg[ count( $seg ) - 2 ] ) { $last = $seg[ count( $seg ) - 3 ]; }
		$slug = sanitize_title( preg_replace( array( '#\.html?$#', '#^\d+-#' ), '', $last ) );
		if ( '' === $slug ) { return; }

		global $wpdb;
		$pid = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT ID FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND post_name=%s LIMIT 1", $slug ) );
		if ( $pid ) {
			$url = get_permalink( $pid );
		} else {
			foreach ( array( 'product_cat', 'product_brand' ) as $tax ) {
				$t = get_term_by( 'slug', $slug, $tax );
				if ( $t && ! is_wp_error( $t ) ) { $l = get_term_link( $t ); if ( ! is_wp_error( $l ) ) { $url = $l; break; } }
			}
		}
	}
	if ( ! $url ) { return; }
	if ( strtolower( trim( (string) parse_url( $url, PHP_URL_PATH ), '/' ) ) === $kelias ) { return; }

	$qs = (string) parse_url( $uri, PHP_URL_QUERY );
	if ( '' !== $qs ) { $url .= ( false === strpos( $url, '?' ) ? '?' : '&' ) . $qs; }

	remove_action( 'template_redirect', 'redirect_canonical' );
	wp_redirect( $url, 301, 'Petshop-404-Atitikmuo' );
	exit;
}, 2 );
