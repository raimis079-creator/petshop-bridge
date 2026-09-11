<?php
/**
 * Plugin Name: Petshop Venipak dokumento Nr.
 * Description: Venipak siuntos XML lauke `doc_no` vidinį WooCommerce ID (35886) pakeičia į užsakymo numerį (1006), kad lipduke būtų mūsų numeris.
 * Version: 1.0
 *
 * v1.0 (2026-09-11, S1670, Raimio prašymas). Pluginas wc-venipak-shipping 1.26.5
 * `admin-dispatch.php` rašo `doc_no = $order->get_id()` be filtro. Plugino failų
 * neliečiam — perrašom tik išsiunčiamą XML per WP `http_request_args`, ir tik
 * užklausai į go.venipak.lt/import/send.php. Keičiamas TIK `doc_no`;
 * `shipment_code`, pakų numeriai, adresai — nekeičiami. Bet kokia klaida →
 * paliekamas originalas.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_filter( 'http_request_args', 'petshop_venipak_docno', 10, 2 );

function petshop_venipak_docno( $args, $url ) {
	if ( false === strpos( (string) $url, 'go.venipak.lt/import/send.php' ) ) { return $args; }
	if ( empty( $args['body'] ) || ! is_array( $args['body'] ) || empty( $args['body']['xml_text'] ) || ! is_string( $args['body']['xml_text'] ) ) { return $args; }
	try {
		$args['body']['xml_text'] = petshop_venipak_docno_xml( $args['body']['xml_text'] );
	} catch ( Throwable $e ) {
		error_log( '[petshop-venipak-docno] ' . $e->getMessage() );
	}
	return $args;
}

function petshop_venipak_docno_xml( $xml ) {
	$naujas = preg_replace_callback( '#<doc_no>(\d+)</doc_no>#', function ( $m ) {
		$o = function_exists( 'wc_get_order' ) ? wc_get_order( (int) $m[1] ) : null;
		if ( ! $o || ! is_a( $o, 'WC_Order' ) ) { return $m[0]; }
		$nr = trim( (string) $o->get_order_number() );
		if ( '' === $nr || $nr === $m[1] ) { return $m[0]; }
		return '<doc_no>' . htmlspecialchars( $nr, ENT_XML1 | ENT_QUOTES, 'UTF-8' ) . '</doc_no>';
	}, (string) $xml );
	return is_string( $naujas ) ? $naujas : $xml;
}
