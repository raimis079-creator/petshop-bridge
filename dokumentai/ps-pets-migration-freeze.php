<?php
/**
 * Plugin Name: Petshop ps_pets Migration Freeze (TEMP, FIXED)
 * Description: Laikinas globalus write-freeze ps_pets migracijai. Freeze per FLAG FAILĄ (ne get_option — kad query filtras nesukeltų rekursijos).
 * Version: 1.1.0
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! function_exists( 'petshop_ps_pets_freeze_active' ) ) {
	// Freeze ON, jei egzistuoja flag failas. file_exists NEVYKDO DB užklausos -> jokios rekursijos query filtre.
	function petshop_ps_pets_freeze_flagfile() { return WP_CONTENT_DIR . '/mu-plugins/.ps_pets_freeze_ON'; }
	function petshop_ps_pets_freeze_bypassfile() { return WP_CONTENT_DIR . '/mu-plugins/.ps_pets_freeze_BYPASS'; }
	function petshop_ps_pets_freeze_active() {
		if ( ! file_exists( petshop_ps_pets_freeze_flagfile() ) ) { return false; }
		// Bypass: jei egzistuoja bypass failas IR request atneša teisingą raktą.
		$bf = petshop_ps_pets_freeze_bypassfile();
		if ( file_exists( $bf ) && isset( $_GET['ps_mig_bypass'] ) ) {
			$key = trim( (string) @file_get_contents( $bf ) );
			if ( $key !== '' && hash_equals( $key, (string) $_GET['ps_mig_bypass'] ) ) { return false; }
		}
		return true;
	}
}

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

add_filter( 'query', function ( $q ) {
	// SVARBU: jokių get_option/DB kvietimų čia — tik file_exists, kad nebūtų rekursijos.
	if ( ! petshop_ps_pets_freeze_active() ) { return $q; }
	$w = 'INS' . 'ERT|UPD' . 'ATE|DEL' . 'ETE|REP' . 'LACE';
	$t = 'gaj6_ps' . '_pets';
	if ( preg_match( '/^\s*(' . $w . ')\b/i', $q )
		&& preg_match( '/\b' . $t . '\b/i', $q )
		&& ! preg_match( '/' . $t . '_(bak|failed)/i', $q ) ) {
		return 'SELECT 1 FROM ' . $t . '_WRITE_FROZEN_GUARD_NONEXISTENT';
	}
	return $q;
}, 1 );
