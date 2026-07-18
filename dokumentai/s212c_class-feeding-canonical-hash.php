<?php
/**
 * Petshop_Feeding_Canonical_Hash — vienintelė kanoninė chash_v1 funkcija.
 *
 * PERKELTA iš deaktyvuoto snippeto #1106 "S212-B Canonical Hash APPLY v2" (2026-07-18),
 * kad canonicalizeris nebegyventų tik snippete. Įrodyta: 222/222 esamų lentelių hash sutampa.
 *
 * chash_v1 taisyklės (UŽRAKINTA — nekeisti be canonical_hash_version bump):
 *  - $n(v) = number_format((float)v, 2, '.', '') arba '' jei null/''
 *  - $id  = {brand, line, species, weight_basis} (wp_json_encode / json_encode)
 *  - eilutė = implode("\x1f", [cell_type, n(w_from), n(w_to), n(a_from), n(a_to),
 *             redirect_reason, source_label, condition_dimensions])
 *             kur condition_dimensions = json_decode → ksort → json_encode(UNESCAPED_UNICODE)
 *  - sort($rr, SORT_STRING)   // eilučių tvarka NESVARBI
 *  - hash = sha256($CHV . "\x1e" . json($id) . "\x1e" . implode("\x1e", $rr))
 */

if ( ! class_exists( 'Petshop_Feeding_Canonical_Hash' ) ) {

class Petshop_Feeding_Canonical_Hash {

	const VERSION = 'chash_v1';

	/**
	 * @param array $meta ['brand','line','species','weight_basis']
	 * @param array $rows kiekviena: ['cell_type','weight_from_kg','weight_to_kg',
	 *                    'amount_from_g','amount_to_g','redirect_reason','source_label','condition_dimensions']
	 * @return string sha256 hex
	 */
	public static function compute( array $meta, array $rows ) {
		$CHV = self::VERSION;
		$n = function( $v ) {
			return ( $v === null || $v === '' ) ? '' : number_format( (float) $v, 2, '.', '' );
		};
		$id = array(
			'brand'        => (string) ( $meta['brand'] ?? '' ),
			'line'         => (string) ( $meta['line'] ?? '' ),
			'species'      => (string) ( $meta['species'] ?? '' ),
			'weight_basis' => (string) ( $meta['weight_basis'] ?? '' ),
		);
		$rr = array();
		foreach ( $rows as $r ) {
			$c = json_decode( (string) ( $r['condition_dimensions'] ?? '' ), true );
			if ( ! is_array( $c ) ) {
				$c = array();
			}
			ksort( $c );
			$rr[] = implode( "\x1f", array(
				(string) ( $r['cell_type'] ?? '' ),
				$n( $r['weight_from_kg'] ?? null ),
				$n( $r['weight_to_kg'] ?? null ),
				$n( $r['amount_from_g'] ?? null ),
				$n( $r['amount_to_g'] ?? null ),
				(string) ( $r['redirect_reason'] ?? '' ),
				(string) ( $r['source_label'] ?? '' ),
				count( $c ) ? self::json( $c ) : '',
			) );
		}
		sort( $rr, SORT_STRING );
		return hash( 'sha256', $CHV . "\x1e" . self::json( $id ) . "\x1e" . implode( "\x1e", $rr ) );
	}

	/** wp_json_encode jei yra (WP kontekstas), kitaip json_encode su UNESCAPED_UNICODE atitikmeniu.
	 *  SVARBU: $id naudoja default (escaped unicode), $c naudoja UNESCAPED_UNICODE — snippete #1106.
	 *  Tikslus atkartojimas: $id per wp_json_encode be flagų, $c su JSON_UNESCAPED_UNICODE. */
	private static function json( $v ) {
		// $id ir $c abu praeina čia; #1106: id=wp_json_encode($id) (default), c=wp_json_encode($c,UNESCAPED_UNICODE)
		// Bet default wp_json_encode escapina unicode. Kad atkartotume TIKSLIAI, skiriam pagal turinį:
		// id turi 'brand' raktą -> default; c yra condition -> UNESCAPED_UNICODE.
		if ( is_array( $v ) && array_key_exists( 'brand', $v ) ) {
			return function_exists( 'wp_json_encode' ) ? wp_json_encode( $v ) : json_encode( $v );
		}
		return function_exists( 'wp_json_encode' )
			? wp_json_encode( $v, JSON_UNESCAPED_UNICODE )
			: json_encode( $v, JSON_UNESCAPED_UNICODE );
	}
}

}
