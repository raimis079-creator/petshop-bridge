<?php
/**
 * Plugin Name: Petshop paieška v1.0 (S1699)
 * Description: Svetainės paieškos tolerancija (2026-09-20, 1.5 pjūvis: 21 % paieškų grąžino 0 rezultatų).
 *   (1) Sinonimai / rašybos klaidos brendams: jesera, jassera, jorsera → josera; eucanuba → eukanuba; expulsion, exclusive → exclusion;
 *       royal canine → royal canin; anikonds → animonda; sum palst → sum-plast ir kt. (SINONIMAI).
 *   (2) Kamienai: žodžiai ≥ 6 raidžių lyginami pagal pradžią (kiauliena ≈ kiaulienos, zirneis ≈ žirneliais, kačiukams ≈ kačiukas) —
 *       DB collation utf8mb4_unicode_ci jau ignoruoja diakritikus (ž = z), tad problema buvo tik galūnės.
 *   (3) SKU / prekės ID: „inps11", „hyos02", „19997" → prekė pagal _sku (LIKE) arba ID.
 *   Veikia frontend produktų paieškai (WC /?s= ir Flatsome live search) per posts_search; admin neliečiamas.
 *   Išjungti: opcija ps_paieska_isjungta = 1.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

final class Petshop_Paieska {
	const SINONIMAI = array(
		'jesera' => 'josera', 'jassera' => 'josera', 'jorsera' => 'josera', 'josena' => 'josera', 'joseta' => 'josera',
		'eucanuba' => 'eukanuba', 'eukanuva' => 'eukanuba',
		'expulsion' => 'exclusion', 'exclusive' => 'exclusion', 'exlusion' => 'exclusion', 'exclusion hypoalergenic' => 'exclusion hypoallergenic',
		'royal canine' => 'royal canin', 'royalcanin' => 'royal canin', 'royal cani' => 'royal canin',
		'anikonds' => 'animonda', 'animonda vom feinstein' => 'animonda vom feinsten', 'vom feinstein' => 'vom feinsten',
		'sum palst' => 'sum-plast', 'sumplast' => 'sum-plast',
		'gastrointensial' => 'gastrointestinal', 'gastrointestinial' => 'gastrointestinal', 'gastro intestinal' => 'gastrointestinal',
		'hypoalergenic' => 'hypoallergenic', 'hipoalergenis' => 'hypoallergenic', 'hipoalerginis' => 'hypoallergenic',
		'churru' => 'churu', 'ciuru' => 'churu',
		'furminatorius' => 'furminator', 'flexy' => 'flexi',
		'katės pieno pakaitalas' => 'pieno pakaitalas', 'kačių pieno pakaitalas' => 'pieno pakaitalas',
		'ausu valiklis' => 'ausų valiklis',
	);
	const STOP = array( 'ir', 'su', 'be', 'iš', 'is', 'the', 'and', 'for', 'sausas', 'sausasmaistas', 'maistas', 'pašaras', 'pasaras' );

	public static function init() {
		if ( is_admin() && ! wp_doing_ajax() ) { return; }
		if ( get_option( 'ps_paieska_isjungta' ) ) { return; }
		add_filter( 'posts_search', array( __CLASS__, 'posts_search' ), 20, 2 );
	}

	/** Ar tai produktų paieška (WC arba Flatsome ajax). */
	private static function produktu( WP_Query $q ) {
		$s = trim( (string) $q->get( 's' ) );
		if ( '' === $s ) { return false; }
		$pt = $q->get( 'post_type' );
		if ( is_array( $pt ) ) { return in_array( 'product', $pt, true ); }
		return 'product' === $pt || ( '' === $pt && $q->is_main_query() && isset( $_GET['post_type'] ) && 'product' === $_GET['post_type'] );
	}

	public static function normalizuoti( $s ) {
		$s = html_entity_decode( $s, ENT_QUOTES, 'UTF-8' );
		$s = mb_strtolower( trim( preg_replace( '/\s+/u', ' ', $s ) ) );
		foreach ( self::SINONIMAI as $nuo => $i ) {
			if ( false !== mb_strpos( $s, $nuo ) ) { $s = str_replace( $nuo, $i, $s ); }
		}
		return $s;
	}

	/** Žodžio kamienas LIKE'ui: ≥8 raidžių → 6, 6–7 → 5, kitaip visas. Skaičiai ir SKU lieka. */
	public static function kamienas( $w ) {
		if ( preg_match( '/\d/', $w ) ) { return $w; }
		$n = mb_strlen( $w );
		if ( $n >= 8 ) { return mb_substr( $w, 0, 6 ); }
		if ( $n >= 6 ) { return mb_substr( $w, 0, 5 ); }
		return $w;
	}

	public static function posts_search( $search, $q ) {
		if ( ! self::produktu( $q ) ) { return $search; }
		global $wpdb;
		$s = self::normalizuoti( (string) $q->get( 's' ) );
		$zodziai = array_values( array_filter( preg_split( '/[\s,\/]+/u', $s ), function ( $w ) { return '' !== $w && ! in_array( $w, self::STOP, true ); } ) );
		if ( ! $zodziai ) { return $search; }

		$and = array();
		foreach ( $zodziai as $w ) {
			$k = '%' . $wpdb->esc_like( self::kamienas( $w ) ) . '%';
			$and[] = $wpdb->prepare( "({$wpdb->posts}.post_title LIKE %s OR {$wpdb->posts}.post_excerpt LIKE %s OR {$wpdb->posts}.post_content LIKE %s)", $k, $k, $k );
		}
		$where = '(' . implode( ' AND ', $and ) . ')';

		// SKU / ID: visa užklausa be tarpų
		$sku = preg_replace( '/\s+/u', '', $s );
		if ( '' !== $sku && mb_strlen( $sku ) <= 20 && preg_match( '/\d/', $sku ) ) {
			$where .= $wpdb->prepare( " OR {$wpdb->posts}.ID IN (SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='_sku' AND meta_value LIKE %s)", '%' . $wpdb->esc_like( $sku ) . '%' );
			if ( ctype_digit( $sku ) ) { $where .= $wpdb->prepare( " OR {$wpdb->posts}.ID = %d", (int) $sku ); }
		}
		return " AND ({$where}) ";
	}
}
add_action( 'init', array( 'Petshop_Paieska', 'init' ), 5 );
