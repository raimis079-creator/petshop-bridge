<?php
/**
 * Plugin Name: Petshop vertimai
 * Description: Trūkstami WooCommerce/Flatsome lt_LT vertimai (laiškai, paieškos antraštės). Tik eilutės, kurių nėra oficialiuose .mo.
 * Version: 1.2 (S1639, 2026-09-08: + grąžinimo laiško sakiniai — email_improvements body lt_LT vertimo nėra, matyta teste #35863)
 */
if ( ! defined( 'ABSPATH' ) ) exit;
add_filter( 'gettext_woocommerce', function( $translated, $text, $domain ) {
	static $map = array(
		// v1.2: grąžinimo laiškas (email_improvements)
		'Your order from %s has been partially refunded.' => 'Jums grąžinta dalis pinigų už užsakymą parduotuvėje %s.',
		'Your order from %s has been refunded.' => 'Jums grąžinti pinigai už užsakymą parduotuvėje %s.',
		'Your order on %s has been partially refunded. There are more details below for your reference:' => 'Jums grąžinta dalis pinigų už užsakymą parduotuvėje %s. Detalės žemiau:',
		'Your order on %s has been refunded. There are more details below for your reference:' => 'Jums grąžinti pinigai už užsakymą parduotuvėje %s. Detalės žemiau:',
		'Unfortunately, the payment for order #%1$s from %2$s has failed. The order was as follows:' => 'Deja, užsakymo #%1$s (pirkėjas %2$s) apmokėjimas nepavyko. Užsakymo informacija:',
		"We\xE2\x80\x99re getting in touch to let you know that order #%1\$s from %2\$s has been cancelled." => 'Pranešame, kad užsakymas #%1$s (pirkėjas %2$s) buvo atšauktas.',
		'Order Failed: %s' => 'Užsakymo apmokėti nepavyko: %s',
		'New Order: #%s' => 'Naujas užsakymas: #%s',
	);
	if ( $translated === $text && isset( $map[ $text ] ) ) return $map[ $text ];
	return $translated;
}, 10, 3 );
add_filter( 'gettext_flatsome', function( $translated, $text, $domain ) {
	static $map = array(
		'Pages found'    => 'Rasti puslapiai',
		'Products found' => 'Rastos prekės',
		'Posts found'    => 'Rasti įrašai',
	);
	if ( $translated === $text && isset( $map[ $text ] ) ) return $map[ $text ];
	return $translated;
}, 10, 3 );
