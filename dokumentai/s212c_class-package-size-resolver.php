<?php
/**
 * Petshop_Package_Size_Resolver v1.0 (grynas — jokio WP/DB/WC)
 *
 * Nustato, kiek maisto yra VIENAME parduodamame SKU vienete (sellable_unit_food_g).
 * quantity NEDALYVAUJA — Service vėliau daro total_food_g = sellable × quantity.
 *
 * Du atskiri žingsniai:
 *   1. parse      — ar term_value sintaksiškai suprantamas (žinoma gramatika).
 *   2. trust gate — ar produkto priskyrimu (assignment_status) galima pasitikėti.
 *
 * needs_manual_review VISADA nugali sėkmingą parse → status=ambiguous,
 * sellable_unit_food_g=null (parsed_candidate_g lieka TIK diagnostikai).
 *
 * Įvestis: ['term_value'=>string|null, 'assignment_status'=>string|null]
 * Išvestis: žr. resolve() PHPDoc.
 */

if ( ! class_exists( 'Petshop_Package_Size_Resolver' ) ) {

class Petshop_Package_Size_Resolver {

	/** Statusai, kuriais galima pasitikėti (whitelist). */
	const TRUSTED_STATUSES = array( null, '', 'fixed', 'stock_sync_checked' );

	/** Statusai, kurie aiškiai NEpatikimi. */
	const UNTRUSTED_STATUSES = array( 'needs_manual_review' );

	/**
	 * @param array $in ['term_value'=>string|null, 'assignment_status'=>string|null]
	 * @return array [
	 *   'status'               => 'resolved'|'unresolved'|'ambiguous',
	 *   'sellable_unit_food_g' => int|null,   // null jei ne 'resolved'
	 *   'parsed_candidate_g'   => int|null,   // parse rezultatas (diagnostikai), gali būti ir kai ambiguous/unresolved
	 *   'method'               => 'single'|'bonus_pack'|'multipack'|null,
	 *   'reason_code'          => string|null,
	 *   'raw_value'            => string|null,
	 * ]
	 */
	public static function resolve( array $in ) {
		$raw = array_key_exists( 'term_value', $in ) ? $in['term_value'] : null;
		$status = array_key_exists( 'assignment_status', $in ) ? $in['assignment_status'] : null;

		// --- 1. PARSE (sintaksė) ---
		$parsed = self::parse( $raw ); // ['g'=>int|null, 'method'=>string|null]

		// --- 2. TRUST GATE (prioriteto seka) ---

		// (1) Terminas tuščias / neparsinamas / <= 0 → unresolved.
		//     Šitas eina PIRMAS: jei nėra ką skaičiuoti, review vėliava nesvarbi.
		if ( $parsed['g'] === null || $parsed['g'] <= 0 ) {
			return self::out( 'unresolved', null, $parsed['g'], $parsed['method'],
				'unparseable_or_nonpositive', $raw );
		}

		// (2) Parsinamas, BET status nepatikimas → ambiguous. Parse NUGALIMAS.
		if ( self::is_untrusted( $status ) ) {
			return self::out( 'ambiguous', null, $parsed['g'], $parsed['method'],
				'assignment_needs_manual_review', $raw );
		}

		// (3) Parsinamas + statusas patikimas → resolved.
		if ( self::is_trusted( $status ) ) {
			return self::out( 'resolved', $parsed['g'], $parsed['g'], $parsed['method'],
				null, $raw );
		}

		// (4) Nežinomas naujas assignment_status → ambiguous (konservatyvu).
		//     Naujas S212-A statusas neturi tyliai tapti „patikimu".
		return self::out( 'ambiguous', null, $parsed['g'], $parsed['method'],
			'unknown_assignment_status', $raw );
	}

	/**
	 * Sintaksinis parse. Priima TIK žinomas gramatikas:
	 *   NUMBER UNIT            "7 kg", "85 g", "1,5 kg"
	 *   NUMBER + NUMBER UNIT   "15+3 kg"        (bonus pack)
	 *   COUNT × NUMBER UNIT    "2×7 kg", "2x7 kg" (multipack)
	 * Jokio universalaus „surask visus skaičius ir sudėk".
	 *
	 * @return array ['g'=>int|null, 'method'=>string|null]
	 */
	public static function parse( $raw ) {
		if ( ! is_string( $raw ) ) {
			return array( 'g' => null, 'method' => null );
		}
		$s = trim( $raw );
		if ( $s === '' ) {
			return array( 'g' => null, 'method' => null );
		}
		// Normalizuojam: mažosios raidės, LT kablelis → taškas, kelis tarpus → vieną.
		// Unicode × (U+00D7) → ASCII x PRIEŠ strtolower (kad regex matytų tik ASCII).
		$s = str_replace( array( "\xc3\x97", '×' ), 'x', $s );
		$s = strtolower( $s ); // paketų reikšmės ASCII (skaičiai, kg/g, x, +)
		$s = str_replace( ',', '.', $s );
		$s = preg_replace( '/\s+/', ' ', $s );

		// --- COUNT × NUMBER UNIT (multipack): "2×7 kg", "2 x 7 kg", "2x7kg" ---
		if ( preg_match( '/^(\d+)\s*[x×]\s*(\d+(?:\.\d+)?)\s*(kg|g)$/', $s, $m ) ) {
			$count = (int) $m[1];
			$num = (float) $m[2];
			$g = self::to_grams( $num, $m[3] );
			if ( $count > 0 && $g !== null && $g > 0 ) {
				return array( 'g' => (int) round( $count * $g ), 'method' => 'multipack' );
			}
			return array( 'g' => null, 'method' => null );
		}

		// --- NUMBER + NUMBER UNIT (bonus pack): "15+3 kg" ---
		if ( preg_match( '/^(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)\s*(kg|g)$/', $s, $m ) ) {
			$a = self::to_grams( (float) $m[1], $m[3] );
			$b = self::to_grams( (float) $m[2], $m[3] );
			if ( $a !== null && $b !== null && ( $a + $b ) > 0 ) {
				return array( 'g' => (int) round( $a + $b ), 'method' => 'bonus_pack' );
			}
			return array( 'g' => null, 'method' => null );
		}

		// --- NUMBER UNIT (paprastas): "7 kg", "85 g", "1.5 kg" ---
		if ( preg_match( '/^(\d+(?:\.\d+)?)\s*(kg|g)$/', $s, $m ) ) {
			$g = self::to_grams( (float) $m[1], $m[2] );
			if ( $g !== null && $g > 0 ) {
				return array( 'g' => (int) round( $g ), 'method' => 'single' );
			}
			return array( 'g' => null, 'method' => null );
		}

		// Nežinoma gramatika → neparsinama.
		return array( 'g' => null, 'method' => null );
	}

	private static function to_grams( $num, $unit ) {
		if ( ! is_numeric( $num ) ) return null;
		if ( $unit === 'kg' ) return $num * 1000.0;
		if ( $unit === 'g' )  return $num * 1.0;
		return null;
	}

	private static function is_trusted( $status ) {
		return in_array( $status, self::TRUSTED_STATUSES, true );
	}

	private static function is_untrusted( $status ) {
		return in_array( $status, self::UNTRUSTED_STATUSES, true );
	}

	private static function out( $status, $sellable, $candidate, $method, $reason, $raw ) {
		return array(
			'status'               => $status,
			'sellable_unit_food_g' => ( $sellable === null ? null : (int) $sellable ),
			'parsed_candidate_g'   => ( $candidate === null ? null : (int) $candidate ),
			'method'               => $method,
			'reason_code'          => $reason,
			'raw_value'            => $raw,
		);
	}
}

}
