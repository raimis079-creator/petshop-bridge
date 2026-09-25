<?php
/**
 * Plugin Name: Petshop prekės puslapio tvarka v1.0 (S1720, planas 2.17)
 * Description: „Dažnai perkama kartu“ (Petshop_FBT::render_widget, woocommerce_after_add_to_cart_form prio 20) perkeliamas PO skaičiuoklės
 *   (Petshop_Product_Calc::widget, woocommerce_single_product_summary prio 31) → summary prio 32. Raimio sprendimas 2026-09-25 (S1712 radinys #9).
 *   Išjungti: opcija ps_prekes_tvarka_isjungta=1 (grįžta sena tvarka).
 * Version: 1.0
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'wp', function () {
	if ( is_admin() || get_option( 'ps_prekes_tvarka_isjungta' ) ) { return; }
	global $wp_filter;
	$h = 'woocommerce_after_add_to_cart_form';
	if ( empty( $wp_filter[ $h ] ) || empty( $wp_filter[ $h ]->callbacks[20] ) ) { return; }
	foreach ( $wp_filter[ $h ]->callbacks[20] as $cb ) {
		$fn = $cb['function'];
		if ( ! is_array( $fn ) || count( $fn ) !== 2 ) { continue; }
		$kl = is_object( $fn[0] ) ? get_class( $fn[0] ) : (string) $fn[0];
		if ( 'Petshop_FBT' !== $kl || 'render_widget' !== $fn[1] ) { continue; }
		remove_action( $h, $fn, 20 );
		add_action( 'woocommerce_single_product_summary', $fn, 32 );
		return;
	}
}, 20 );
