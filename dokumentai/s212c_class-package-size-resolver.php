<?php
/**
 * Petshop_Package_Size_Resolver v2.0 (grynas — jokio WP/DB/WC)
 *
 * Nustato, kiek maisto yra VIENAME parduodamame SKU vienete (sellable_unit_food_g).
 * quantity NEDALYVAUJA — Service vėliau daro total_food_g = sellable × quantity.
 *
 * DVI ORTOGONALIOS DIMENSIJOS (v2 pataisa — nebemaišyti į vieną statusą):
 *   parse_status     — ar term_value sintaksiškai išparsintas (resolved | unresolved)
 *   assignment_trust — ar priskyrimu produktui galima pasitikėti
 *                      (verified | unverified | review_required | unknown)
 *
 * Resolver gauna JAU NORMALIZUOTĄ domeno trust reikšmę (ne WP istorinį statusą).
 * WP statusų → trust mappingą daro Provider (map_wp_status_to_trust helper).
 *
 * SPRENDIMŲ MATRICA (runtime):
 *   parse unresolved                 → svoris null (bet koks trust)
 *   parse resolved + verified        → sellable leidžiamas
 *   parse resolved + review_required → svoris null
 *   parse resolved + unknown         → svoris null (konservatyvu)
 *   parse resolved + unverified      → svoris null (backfill audito laukia)
 *
 * sellable_unit_food_g != null TIK kai parse=resolved IR trust=verified.
 * parsed_candidate_g — TIK diagnostikai/auditui, NIEKADA verslo logikai.
 */

if ( ! class_exists( 'Petshop_Package_Size_Resolver' ) ) {

class Petshop_Package_Size_Resolver {

	const TRUST_VERIFIED        = 'verified';
	const TRUST_UNVERIFIED      = 'unverified';
	const TRUST_REVIEW_REQUIRED = 'review_required';
	const TRUST_UNKNOWN         = 'unknown';

	public static function resolve( array $in ) {
		$raw   = array_key_exists( 'term_value', $in ) ? $in['term_value'] : null;
		$trust = self::normalize_trust(
			array_key_exists( 'assignment_trust', $in ) ? $in['assignment_trust'] : null
		);

		$parsed = self::parse( $raw );
		$parse_ok = ( $parsed['g'] !== null && $parsed['g'] > 0 );

		if ( ! $parse_ok ) {
			return self::out( 'unresolved', $trust, null, $parsed['g'], $parsed['method'],
				'unparseable_or_nonpositive', $raw );
		}

		switch ( $trust ) {
			case self::TRUST_VERIFIED:
				return self::out( 'resolved', $trust, $parsed['g'], $parsed['g'], $parsed['method'],
					null, $raw );
			case self::TRUST_REVIEW_REQUIRED:
				return self::out( 'resolved', $trust, null, $parsed['g'], $parsed['method'],
					'assignment_review_required', $raw );
			case self::TRUST_UNVERIFIED:
				return self::out( 'resolved', $trust, null, $parsed['g'], $parsed['method'],
					'assignment_not_audited', $raw );
			case self::TRUST_UNKNOWN:
			default:
				return self::out( 'resolved', self::TRUST_UNKNOWN, null, $parsed['g'], $parsed['method'],
					'assignment_trust_unknown', $raw );
		}
	}

	private static function normalize_trust( $trust ) {
		$valid = array( self::TRUST_VERIFIED, self::TRUST_UNVERIFIED, self::TRUST_REVIEW_REQUIRED, self::TRUST_UNKNOWN );
		if ( in_array( $trust, $valid, true ) ) {
			return $trust;
		}
		return self::TRUST_UNKNOWN;
	}

	public static function parse( $raw ) {
		if ( ! is_string( $raw ) ) {
			return array( 'g' => null, 'method' => null );
		}
		$s = trim( $raw );
		if ( $s === '' ) {
			return array( 'g' => null, 'method' => null );
		}
		$s = str_replace( array( "\xc3\x97", '×' ), 'x', $s );
		$s = strtolower( $s );
		$s = str_replace( ',', '.', $s );
		$s = preg_replace( '/\s+/', ' ', $s );

		if ( preg_match( '/^(\d+)\s*x\s*(\d+(?:\.\d+)?)\s*(kg|g)$/', $s, $m ) ) {
			$count = (int) $m[1];
			$g = self::to_grams( (float) $m[2], $m[3] );
			if ( $count > 0 && $g !== null && $g > 0 ) {
				return array( 'g' => (int) round( $count * $g ), 'method' => 'multipack' );
			}
			return array( 'g' => null, 'method' => null );
		}
		if ( preg_match( '/^(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)\s*(kg|g)$/', $s, $m ) ) {
			$a = self::to_grams( (float) $m[1], $m[3] );
			$b = self::to_grams( (float) $m[2], $m[3] );
			if ( $a !== null && $b !== null && ( $a + $b ) > 0 ) {
				return array( 'g' => (int) round( $a + $b ), 'method' => 'bonus_pack' );
			}
			return array( 'g' => null, 'method' => null );
		}
		if ( preg_match( '/^(\d+(?:\.\d+)?)\s*(kg|g)$/', $s, $m ) ) {
			$g = self::to_grams( (float) $m[1], $m[2] );
			if ( $g !== null && $g > 0 ) {
				return array( 'g' => (int) round( $g ), 'method' => 'single' );
			}
			return array( 'g' => null, 'method' => null );
		}
		return array( 'g' => null, 'method' => null );
	}

	private static function to_grams( $num, $unit ) {
		if ( ! is_numeric( $num ) ) return null;
		if ( $unit === 'kg' ) return $num * 1000.0;
		if ( $unit === 'g' )  return $num * 1.0;
		return null;
	}

	private static function out( $parse_status, $trust, $sellable, $candidate, $method, $reason, $raw ) {
		return array(
			'parse_status'         => $parse_status,
			'assignment_trust'     => $trust,
			'sellable_unit_food_g' => ( $sellable === null ? null : (int) $sellable ),
			'parsed_candidate_g'   => ( $candidate === null ? null : (int) $candidate ),
			'method'               => $method,
			'reason_code'          => $reason,
			'raw_value'            => $raw,
		);
	}

	/** Provider: WP _petshop_pkg_assignment_status → domeno trust. */
	public static function map_wp_status_to_trust( $wp_status ) {
		switch ( $wp_status ) {
			case 'fixed':
			case 'stock_sync_checked':
				return self::TRUST_VERIFIED;
			case 'needs_manual_review':
				return self::TRUST_REVIEW_REQUIRED;
			case null:
			case '':
				return self::TRUST_UNVERIFIED;
			default:
				return self::TRUST_UNKNOWN;
		}
	}
}

}
