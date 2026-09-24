<?php
/**
 * Plugin Name: Petshop Filtrų sargas v1.0 (500 su keliomis kategorijomis YITH filtre)
 * Description: YITH WooCommerce Ajax Product Filter leidžia pažymėti kelias kategorijas — URL gauna
 *   `product_cat=a,b` (arba `a+b`). WP užklausa tai supranta, bet WooCommerce core filtro mygtukas
 *   (WC_Widget::get_current_page_url → get_term_link('a,b')) gauna WP_Error ir add_query_arg() meta
 *   TypeError → 500 visam kategorijos puslapiui (php_error.log: 09-20…24 po 7–43/d.).
 *   Sargas po pagrindinės užklausos (`wp`, kai rezultatai jau surinkti) pakeičia `product_cat` query var
 *   į pirmos (užklaustos) kategorijos slug'ą — prekių sąrašo tai nekeičia, tik nuorodų generavimą.
 * Version: 1.0
 * S1714 (2026-09-24). Išjungti: opcija `ps_filtru_sargas_isjungta`=1.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'wp', function () {
	if ( get_option( 'ps_filtru_sargas_isjungta' ) ) { return; }
	if ( ! function_exists( 'is_product_category' ) || ! is_product_category() ) { return; }
	global $wp_query;
	$v = get_query_var( 'product_cat' );
	if ( ! is_string( $v ) || ! preg_match( '/[,+ ]/', $v ) ) { return; }
	$q    = get_queried_object();
	$slug = ( $q && ! empty( $q->slug ) ) ? $q->slug : preg_split( '/[,+ ]/', $v )[0];
	if ( ! $slug ) { return; }
	$wp_query->query_vars['product_cat']    = $slug;
	$wp_query->query_vars['ps_product_cat_orig'] = $v;
}, 1 );
