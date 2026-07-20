<?php
/**
 * Plugin Name: Petshop ps_pets Migration Freeze (TEMP)
 * Description: Laikinas globalus write-freeze ps_pets migracijai (MyISAM->InnoDB). Flag-driven. ŠALINTI po migracijos.
 * Version: 1.0.0
 *
 * Freeze aktyvus TIK kai option petshop_ps_pets_write_freeze === '1'.
 * Bypass: migracijos request'as su teisingu bypass raktu (admin-only) praeina, kad backup/ALTER galėtų veikti.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! function_exists( 'petshop_ps_pets_freeze_active' ) ) {
	function petshop_ps_pets_freeze_bypass() {
		// Vienkartinis migracijos bypass: konstanta arba slaptas GET raktas + admin.
		if ( defined( 'PETSHOP_PS_PETS_MIGRATION_BYPASS' ) && PETSHOP_PS_PETS_MIGRATION_BYPASS ) { return true; }
		$key = get_option( 'petshop_ps_pets_freeze_bypass_key' );
		if ( $key && isset( $_GET['ps_mig_bypass'] ) && hash_equals( (string) $key, (string) $_GET['ps_mig_bypass'] ) ) {
			return true;
		}
		return false;
	}
	function petshop_ps_pets_freeze_active() {
		if ( get_option( 'petshop_ps_pets_write_freeze' ) !== '1' ) { return false; }
		if ( petshop_ps_pets_freeze_bypass() ) { return false; }
		return true;
	}
}

// 1. REST route lygis: blokuoti ps_pets rašymo endpoint'us.
add_filter( 'rest_pre_dispatch', function ( $result, $server, $request ) {
	if ( ! petshop_ps_pets_freeze_active() ) { return $result; }
	$m = $request->get_method();
	if ( ! in_array( $m, array( 'POST', 'PUT', 'PATCH', 'DELETE' ), true ) ) { return $result; }
	$r = $request->get_route();
	if ( preg_match( '#^/petshop/v1/pet-profile#', $r ) || preg_match( '#^/petshop/v1/pet-photo#', $r ) ) {
		return new WP_Error( 'ps_pets_write_frozen', 'ps_pets rašymas laikinai užšaldytas (migracija).', array( 'status' => 503 ) );
	}
	return $result;
}, 1, 3 );

// 2. $wpdb query lygis: blokuoti tiesioginius rašymus į gaj6_ps_pets (metodas-nepriklausomas belt).
add_filter( 'query', function ( $q ) {
	if ( ! petshop_ps_pets_freeze_active() ) { return $q; }
	$w = 'INS' . 'ERT|UPD' . 'ATE|DEL' . 'ETE|REP' . 'LACE';
	$t = 'gaj6_ps' . '_pets';
	if ( preg_match( '/^\s*(' . $w . ')\b/i', $q )
		&& preg_match( '/\b' . $t . '\b/i', $q )
		&& ! preg_match( '/' . $t . '_(bak|failed)/i', $q ) ) {
		// Grąžinam garantuotai klystantį query -> $wpdb write FAIL (ne tylus no-op).
		return 'SELECT 1 FROM ' . $t . '_WRITE_FROZEN_GUARD_NONEXISTENT';
	}
	return $q;
}, 1 );
