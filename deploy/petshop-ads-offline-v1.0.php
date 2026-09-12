<?php
/**
 * Plugin Name: Petshop Ads Offline
 * Description: Apmokėtų užsakymų su gclid sąrašas Google Ads offline konversijų įkėlimui (Ads Script skaito JSON). Read-only. S1677.
 * Version: 1.0
 *
 * KODĖL: naršyklės Ads tag'as praranda konversijas (adblock, atmestas sutikimas), o gclid užsakyme lieka visada.
 * Viena tiesa = WC užsakymas: gclid + apmokėjimo laikas + suma. Google dubliuotus (gclid+laikas+pavadinimas) atmeta pats.
 * Užklausa: /?ps_ads_offline=<raktas>&dienos=3  → JSON {n, eil:[{gclid,laikas,verte,valiuta,uzs}]}
 * Raktas: opcija ps_ads_offline_raktas (sukuria deploy įrankis).
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
		"SELECT uzsakymas_id, gclid FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND gclid<>'' AND apmoketa_at IS NOT NULL AND apmoketa_at >= %s AND statusas_galutinis IN ('processing','completed')", $nuo ), ARRAY_A );
	$eil = array();
	foreach ( $rows as $r ) {
		$o = wc_get_order( (int) $r['uzsakymas_id'] );
		if ( ! $o || ! $o->is_paid() || ! $o->get_date_paid() ) { continue; }
		$eil[] = array(
			'gclid'   => $r['gclid'],
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
