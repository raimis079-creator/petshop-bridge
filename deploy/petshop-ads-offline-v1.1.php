<?php
/**
 * Plugin Name: Petshop Ads Offline
 * Description: Apmokėtų užsakymų su gclid sąrašas Google Ads offline konversijų įkėlimui (Ads Script skaito JSON). Read-only. S1677.
 * Version: 1.1
 *
 * KODĖL: naršyklės Ads tag'as praranda konversijas (adblock, atmestas sutikimas), o gclid užsakyme lieka visada.
 * Viena tiesa = WC užsakymas: gclid + apmokėjimo laikas + suma. Google dubliuotus (gclid+laikas+pavadinimas) atmeta pats.
 * Užklausa: /?ps_ads_offline=<raktas>&dienos=3  → JSON {n, eil:[{gclid,laikas,verte,valiuta,uzs}]}
 * Raktas: opcija ps_ads_offline_raktas (sukuria deploy įrankis).
 * v1.1: faktų gclid = tik žymė '1'; tikras gclid: (1) užsakymo meta _ps_gclid (fiksuojam patys: ?gclid= -> WC sesija -> užsakymas,
 *   serverio pusėje, nepriklausomai nuo slapukų sutikimo), (2) _wc_order_attribution_session_entry, (3) ps_fakt_uzsakymai.landing_url.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
add_action( 'init', function () {
	if ( ! isset( $_GET['ps_ads_offline'] ) ) { return; }
	$raktas = (string) get_option( 'ps_ads_offline_raktas', '' );
	if ( '' === $raktas || ! hash_equals( $raktas, (string) $_GET['ps_ads_offline'] ) ) { status_header( 403 ); exit; }
	global $wpdb; $p = $wpdb->prefix;
	$dienos = max( 1, min( 30, (int) ( $_GET['dienos'] ?? 3 ) ) );
	$nuo    = gmdate( 'Y-m-d H:i:s', time() - $dienos * 86400 );
	$rows   = $wpdb->get_results( $wpdb->prepare(
		"SELECT uzsakymas_id, landing_url FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND gclid<>'' AND apmoketa_at IS NOT NULL AND apmoketa_at >= %s AND statusas_galutinis IN ('processing','completed')", $nuo ), ARRAY_A );
	$eil = array();
	foreach ( $rows as $r ) {
		$o = wc_get_order( (int) $r['uzsakymas_id'] );
		if ( ! $o || ! $o->is_paid() || ! $o->get_date_paid() ) { continue; }
		$g = ps_ads_offline_gclid( $o, (string) $r['landing_url'] );
		if ( '' === $g ) { continue; }
		$eil[] = array(
			'gclid'   => $g,
			'laikas'  => $o->get_date_paid()->format( 'Y-m-d H:i:sP' ),
			'verte'   => round( (float) $o->get_total(), 2 ),
			'valiuta' => $o->get_currency(),
			'uzs'     => $o->get_id(),
		);
	}
	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( array( 'v' => '1.0', 'dienos' => $dienos, 'n' => count( $eil ), 'eil' => $eil ) );
	exit;
} );

/** v1.1: tikras gclid užsakymui. */
function ps_ads_offline_gclid( $o, string $landing = '' ): string {
	$g = (string) $o->get_meta( '_ps_gclid' );
	if ( '' !== $g ) { return $g; }
	foreach ( array( (string) $o->get_meta( '_wc_order_attribution_session_entry' ), $landing ) as $u ) {
		if ( preg_match( '/[?&]gclid=([A-Za-z0-9_-]+)/', $u, $m ) ) { return $m[1]; }
	}
	return '';
}
/** v1.1: ?gclid= -> WC sesija (serverio pusė). */
add_action( 'wp', function () {
	if ( empty( $_GET['gclid'] ) || ! function_exists( 'WC' ) || ! WC()->session ) { return; }
	$g = preg_replace( '/[^A-Za-z0-9_-]/', '', (string) $_GET['gclid'] );
	if ( '' === $g ) { return; }
	if ( ! WC()->session->has_session() ) { WC()->session->set_customer_session_cookie( true ); }
	WC()->session->set( 'ps_gclid', array( 'g' => $g, 't' => time() ) );
} );
/** v1.1: sesija -> užsakymo meta _ps_gclid (gclid galioja 90 d.). */
add_action( 'woocommerce_checkout_create_order', function ( $order ) {
	if ( ! WC()->session ) { return; }
	$s = WC()->session->get( 'ps_gclid' );
	if ( is_array( $s ) && ! empty( $s['g'] ) && time() - (int) $s['t'] < 90 * 86400 ) { $order->update_meta_data( '_ps_gclid', $s['g'] ); }
}, 10, 1 );
