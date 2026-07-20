<?php
/**
 * Plugin Name: Petshop ps_pets Migration Freeze (TEMP)
 * Description: Laikinas globalus write-freeze ps_pets migracijai (MyISAM->InnoDB). ŠALINTI po migracijos.
 * Version: 1.4.2
 *
 * SAUGUMO PRINCIPAI:
 *  - query filtre TIK file_exists / string analizė (+ static token cache). JOKIŲ get_option / $wpdb / WP user API
 *    (rekursijos prevencija — ankstesnio incidento priežastis).
 *  - Freeze ON tik jei egzistuoja flag failas (ne-viešame ps_private).
 *  - Bypass = REQUEST-SCOPED: 64-hex tokenas (random_bytes(32)) iš neviešo failo, lyginamas su HTTP antrašte per hash_equals.
 *    Globalaus bypass failo NĖRA — bypass galioja tik tam request'ui, kuris atneša teisingą tokeną.
 *  - FAIL-CLOSED ALLOWLIST: ne-bypass request'ui užklausa, TIKSLIAI liečianti realią gaj6_ps_pets, praleidžiama
 *    TIK jei ji yra aiškiai read-only (SELECT/SHOW/DESCRIBE/DESC/EXPLAIN). VISKAS kita blokuojama.
 *    Backup/ALTER/RENAME išimčių ne-bypass request'ams NĖRA (jos vykdomos tik per bypass).
 *  - Blokavimas: query -> garantuota SINTAKSĖS klaida -> $wpdb write grąžina false + last_error (ne 0, ne tyli sėkmė).
 *  - query filtras VISADA grąžina string. Jokių WP_Error/false/null/throw.
 *  - Guard NIEKADA nemeta fatal.
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

if ( ! function_exists( 'petshop_pspf_flagfile' ) ) {

	// Flag ir token NE po wp-content (web-viešas), o ne-viešame ps_private (virš webroot).
	// Kelias grynai iš ABSPATH konstantos — jokių WP funkcijų (guard minimalus).
	function petshop_pspf_private_dir() { return dirname( dirname( rtrim( ABSPATH, '/\\' ) ) ) . '/ps_private'; }
	function petshop_pspf_flagfile()    { return petshop_pspf_private_dir() . '/ps_pets_freeze_ON'; }
	function petshop_pspf_tokenfile()   { return petshop_pspf_private_dir() . '/ps_pets_freeze_token'; }

	/**
	 * Tokenas iš neviešo failo. Skaitoma daugiausiai VIENĄ kartą per request'ą (static cache).
	 * Grąžina '' jei nėra / per trumpas. Jokių DB/WP kvietimų.
	 */
	function petshop_pspf_token() {
		static $tok = null;
		if ( $tok !== null ) { return $tok; }
		$tok = '';
		$tf = petshop_pspf_tokenfile();
		if ( is_file( $tf ) ) {
			// Be trim(): tokenas turi būti TIKSLIAI 64 lowercase hex baitai (bin2hex(random_bytes(32))).
			// Bet koks trailing tarpas/newline -> nebeatitinka -> nėra bypass.
			$raw = (string) @file_get_contents( $tf );
			if ( preg_match( '/\A[0-9a-f]{64}\z/D', $raw ) ) { $tok = $raw; }
		}
		return $tok;
	}

	/** Request-scoped bypass: token + HTTP antraštė + hash_equals. */
	function petshop_pspf_is_bypass() {
		$token = petshop_pspf_token();
		if ( $token === '' ) { return false; }
		$sent = isset( $_SERVER['HTTP_X_PETSHOP_MIGRATION_BYPASS'] )
			? (string) $_SERVER['HTTP_X_PETSHOP_MIGRATION_BYPASS'] : '';
		if ( $sent === '' ) { return false; }
		return hash_equals( $token, $sent );
	}

	/** Freeze aktyvus? is_file tik. Bypass request'as praeina. */
	function petshop_pspf_active() {
		if ( ! is_file( petshop_pspf_flagfile() ) ) { return false; }
		if ( petshop_pspf_is_bypass() ) { return false; }
		return true;
	}

	/**
	 * Ar užklausa TIKSLIAI liečia realią gaj6_ps_pets (ne _bak/_failed/_other/x, ne qualified kitos lentelės)?
	 * Padengia: gaj6_ps_pets, `gaj6_ps_pets`, db.gaj6_ps_pets, `db`.`gaj6_ps_pets`.
	 * Word-boundary su backtick: po `gaj6_ps_pets` einantis word simbolis (_bak, x) -> NEsutampa.
	 */
	function petshop_pspf_touches_real_ps_pets( $s ) {
		return (bool) preg_match( '/(^|[^a-zA-Z0-9_`])`?gaj6_ps' . '_pets`?([^a-zA-Z0-9_`]|$)/i', $s );
	}

	/**
	 * Ar užklausa aiškiai READ-ONLY? Tik SELECT/SHOW/DESCRIBE/DESC/EXPLAIN pradžioje (po komentarų/tarpų).
	 * (CTE „WITH ... UPDATE", „CREATE ... AS SELECT" ir pan. NĖRA read-only -> nepraeina.)
	 */
	function petshop_pspf_is_readonly( $s ) {
		return (bool) preg_match( '/^(SEL' . 'ECT|SH' . 'OW|DESC' . 'RIBE|DE' . 'SC|EXP' . 'LAIN)\b/i', $s );
	}

	/**
	 * FAIL-CLOSED sprendimas: ar blokuoti šią užklausą (ne-bypass, freeze aktyvus)?
	 * Blokuoti, jei liečia realią gaj6_ps_pets IR nėra aiškiai read-only.
	 * Grynas string/regex, jokių DB kvietimų.
	 */
	function petshop_pspf_should_block( $q ) {
		if ( ! is_string( $q ) || $q === '' ) { return false; }

		// Normalizuojam: nuimam pradinius komentarus (/* */ , -- , #) ir tarpus.
		$s = $q;
		for ( $i = 0; $i < 12; $i++ ) {
			$s2 = preg_replace( '#^\s+#', '', $s );
			$s2 = preg_replace( '#^/\*.*?\*/#s', '', $s2 );
			$s2 = preg_replace( '#^--[^\n]*(\n|$)#', '', $s2 );
			$s2 = preg_replace( '#^\#[^\n]*(\n|$)#', '', $s2 );
			if ( $s2 === $s ) { break; }
			$s = $s2;
		}
		$s = ltrim( $s );

		if ( ! petshop_pspf_touches_real_ps_pets( $s ) ) { return false; } // neliečia realios ps_pets
		if ( petshop_pspf_is_readonly( $s ) ) { return false; }            // aiškiai read-only -> leidžiama
		return true;                                                       // viskas kita -> BLOKUOJAMA (fail-closed)
	}
}

// REST route lygis: blokuoti ps_pets rašymo endpoint'us. WP_Error (ne throw). PIRMAS saugiklis (prieš DB).
add_filter( 'rest_pre_dispatch', function ( $result, $server, $request ) {
	if ( ! function_exists( 'petshop_pspf_active' ) || ! petshop_pspf_active() ) { return $result; }
	if ( ! is_object( $request ) ) { return $result; }
	// SAUGUMAS: override NEGALI SUMAŽINTI apsaugos. Request'as laikomas rašančiu, jei BENT VIENAS
	// matomas metodo šaltinis yra write metodas. (POST+override GET -> vis tiek write; GET+override DELETE -> write.)
	$write_methods = array( 'POST', 'PUT', 'PATCH', 'DELETE' );
	$methods = array(
		strtoupper( (string) $request->get_method() ),
		strtoupper( (string) ( isset( $_SERVER['REQUEST_METHOD'] ) ? $_SERVER['REQUEST_METHOD'] : '' ) ),
		strtoupper( (string) ( isset( $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ) ? $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] : '' ) ),
		strtoupper( (string) $request->get_param( '_method' ) ),
	);
	$is_write = false;
	foreach ( $methods as $method ) {
		if ( in_array( $method, $write_methods, true ) ) { $is_write = true; break; }
	}
	if ( ! $is_write ) { return $result; }
	$r = (string) $request->get_route();
	if ( preg_match( '#^/petshop/v1/pet-profile(?:/|$)#', $r ) || preg_match( '#^/petshop/v1/pet-photo(?:/|$)#', $r ) ) {
		return new WP_Error( 'ps_pets_write_frozen', 'ps_pets rašymas laikinai užšaldytas (migracija).', array( 'status' => 503 ) );
	}
	return $result;
}, 1, 3 );

// $wpdb query lygis: PASKUTINIS saugiklis. VISADA grąžina string.
// Blokavimas -> garantuota SINTAKSĖS klaida -> $wpdb write grąžina false + last_error (ne 0, ne tyli sėkmė).
add_filter( 'query', function ( $q ) {
	if ( ! function_exists( 'petshop_pspf_active' ) || ! petshop_pspf_active() ) { return $q; }
	if ( petshop_pspf_should_block( $q ) ) {
		// Garantuota SINTAKSĖS klaida (ne prielaida apie lentelės nebuvimą) -> $wpdb write grąžina false + last_error.
		return 'SELECT /* PETSHOP_PSPF_WRITE_FROZEN */ FROM';
	}
	return $q;
}, PHP_INT_MAX );
