<?php
/**
 * Petshop Legacy 301 v2.1 (S436, S1668) — senos platformos adresų nukreipimas.
 *
 * v2.1 (S1668): 301 PERKELIA užklausos eilutę (gclid, gad_source, utm_*, _gl).
 *   v2.0 ją numesdavo → PMax/Merchant paspaudimai praradavo gclid, Ads nematė konversijų.
 *
 * Vienas mechanizmas visiems seniems adresams. Žemėlapis laikomas ATSKIRAME
 * JSON faile ir kraunamas TIK tada, kai adresas realiai 404 — kad kiekviena
 * užklausa neparsintų 137 KB PHP masyvo.
 *
 * ŠEŠI SLUOKSNIAI (visi ĮŠALDYTI iš GSC 2 445 URL / 19 735 clicks / 16 mėn.):
 *   1. kategorijos be /kategorija/ priešdėlio          34 · 1 596
 *   2. seni URL su ID uodegomis                        42 ·   666
 *   3. pervadinti slug                                 10 ·    30
 *   4. produktai iš šaknies → /product/                805 · 2 968
 *   5. likusios kategorijos                            24 ·   102
 *   6. brendai → /gamintojas/                          22 ·   501
 *
 * KRITINIS 6 sluoksnis: be jo WordPress redirect_canonical /exclusion
 * (218 clicks) SPĖJIMU 301-ina į ATSITIKTINĮ SKU. TŽ v1.56 tai įspėjo, ir
 * 2026-08-04 tai vis dar vyko.
 *
 * VARTAI:
 *   - TIK tiksliam adresui iš žemėlapio, TIK kai jis DABAR 404
 *   - vienas 301 tiesiai į galutinį 200, jokių grandinių
 *   - JOKIO „panašiausio URL" spėjimo
 *   - redirect_canonical išjungiamas TIK mūsų atpažintam adresui
 *   - X-Redirect-By: Petshop-Legacy-Category
 *
 * ĮŠALDYTA, NE DINAMINIS. Naujoms kategorijoms/prekėms taisyklės NEKURIAMOS.
 * Naujas įrašas — tik rankiniu būdu su GSC pagrindimu.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

const PS_LEGACY_301_MAP = __DIR__ . '/petshop-legacy-301-map.json';

function petshop_legacy_301_map() {
	static $m = null;
	if ( null !== $m ) { return $m; }
	$raw = @file_get_contents( PS_LEGACY_301_MAP );
	$m   = ( false === $raw ) ? array() : (array) json_decode( $raw, true );
	return $m;
}

function petshop_legacy_301_path() {
	$p = (string) parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH );
	return strtolower( trim( rawurldecode( $p ), '/' ) );
}

add_action( 'template_redirect', function () {
	if ( is_admin() || wp_doing_ajax() || is_robots() || is_feed() ) { return; }
	if ( ! is_404() ) { return; }          // esami puslapiai NELIEČIAMI

	$kelias = petshop_legacy_301_path();
	if ( '' === $kelias ) { return; }

	$map = petshop_legacy_301_map();
	if ( ! isset( $map[ $kelias ] ) ) { return; }   // jokio spėjimo

	$t = $map[ $kelias ];
	if ( 0 === strpos( $t, '__TERM__' ) ) {
		$term = get_term( (int) substr( $t, 8 ), 'product_cat' );
		if ( ! $term || is_wp_error( $term ) ) { return; }
		$url = get_term_link( $term );
		if ( is_wp_error( $url ) || ! $url ) { return; }
	} else {
		$url = home_url( $t );
	}

	// Apsauga nuo kilpos
	if ( strtolower( trim( (string) parse_url( $url, PHP_URL_PATH ), '/' ) ) === $kelias ) { return; }

	// v2.1: užklausos eilutė keliauja kartu (gclid/utm/gad_source — Ads atribucijai)
	$qs = (string) parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_QUERY );
	if ( '' !== $qs ) { $url .= ( false === strpos( $url, '?' ) ? '?' : '&' ) . $qs; }

	remove_action( 'template_redirect', 'redirect_canonical' );
	wp_redirect( $url, 301, 'Petshop-Legacy-Category' );
	exit;
}, 1 );
