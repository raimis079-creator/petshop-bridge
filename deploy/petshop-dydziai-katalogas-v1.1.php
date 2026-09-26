<?php
/**
 * Plugin Name: Petshop Dydžių katalogas v1.1 (viena kortelė šeimai)
 * Description: S1721 (2026-09-26, Raimio sprendimas 17:04). Kataloge, kategorijose, gamintojo puslapyje ir paieškoje pakuočių šeima
 *   (_ps_dydzio_seima) rodoma viena kortele — „veidu". Veidas = perkamiausias narys (365 d. faktai); kai aktyvus filtras
 *   „Pakuotės dydis" (filter_pakuotes_dydis / pa_pakuotes_dydis) arba kainos filtras (min_price/max_price) — veidas = perkamiausias
 *   iš filtrą atitinkančių narių, kortelė vis tiek viena. Kiti nariai išimami pačioje užklausoje (post__not_in), todėl puslapiavimas
 *   ir prekių skaičius teisingi. v1.1 (S1721, R 18:35): „mirę" nariai (likutis 0, 0 pardavimų 30 d. bonusiniams / 90 d. kitiems) veidu netampa. Prekių puslapiai, feed'ai, sitemap, admin — neliečiami. Šeimų sąrašas — transient ps_dk_seimos
 *   (2 val.; išvalomas keičiant _ps_dydzio_seima). Išjungti: opcija ps_dydziai_katalogas_isjungta=1.
 * Version: 1.1
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Dydziu_Katalogas {

	const T = 'ps_dk_seimos';

	public static function init() {
		add_action( 'pre_get_posts', array( __CLASS__, 'uzklausa' ), 25 );
		foreach ( array( 'added_post_meta', 'updated_post_meta', 'deleted_post_meta' ) as $h ) { add_action( $h, array( __CLASS__, 'meta_pokytis' ), 10, 3 ); }
	}

	public static function meta_pokytis( $mid, $pid, $key ) { if ( $key === '_ps_dydzio_seima' ) { delete_transient( self::T ); } }

	/** Visos šeimos: [seima => [ [id, pard365, kaina, dydzio_slugai, kg, term_ids(cat/brand/tag), mires], ... ]] */
	public static function seimos() {
		$c = get_transient( self::T ); if ( is_array( $c ) ) { return $c; }
		global $wpdb; $out = array();
		try {
			$rows = $wpdb->get_results( "SELECT m.post_id id, m.meta_value seima, l.min_price kaina, l.stock_status ss FROM {$wpdb->postmeta} m JOIN {$wpdb->posts} p ON p.ID = m.post_id AND p.post_type = 'product' AND p.post_status = 'publish' LEFT JOIN {$wpdb->prefix}wc_product_meta_lookup l ON l.product_id = m.post_id WHERE m.meta_key = '_ps_dydzio_seima' AND m.meta_value <> ''", ARRAY_A );
			if ( ! $rows ) { set_transient( self::T, array(), 2 * HOUR_IN_SECONDS ); return array(); }
			$ids = array_map( function ( $r ) { return (int) $r['id']; }, $rows ); $in = implode( ',', $ids );
			$pard = array_fill_keys( $ids, 0 ); $p90 = array_fill_keys( $ids, 0 ); $p30 = array_fill_keys( $ids, 0 );
			foreach ( array( 'ps_ist_fakt_eilutes', 'ps_fakt_eilutes' ) as $t ) {
				if ( ! $wpdb->get_var( "SHOW TABLES LIKE '{$wpdb->prefix}$t'" ) ) { continue; }
				foreach ( (array) $wpdb->get_results( "SELECT preke_id, SUM(kiekis) q, SUM(IF(diena >= DATE_SUB(CURDATE(), INTERVAL 90 DAY), kiekis, 0)) q90, SUM(IF(diena >= DATE_SUB(CURDATE(), INTERVAL 30 DAY), kiekis, 0)) q30 FROM {$wpdb->prefix}$t WHERE preke_id IN ($in) AND COALESCE(testinis,0)=0 AND diena >= DATE_SUB(CURDATE(), INTERVAL 365 DAY) GROUP BY preke_id", ARRAY_A ) as $r ) { $i = (int) $r['preke_id']; $pard[ $i ] += (int) $r['q']; $p90[ $i ] += (int) $r['q90']; $p30[ $i ] += (int) $r['q30']; }
			}
			$dyd = array(); $tax = array();
			foreach ( (array) $wpdb->get_results( "SELECT tr.object_id id, tt.taxonomy tx, tt.term_id tid, t.slug FROM {$wpdb->term_relationships} tr JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id JOIN {$wpdb->terms} t ON t.term_id = tt.term_id WHERE tt.taxonomy IN ('pa_pakuotes_dydis','product_cat','product_brand','product_tag') AND tr.object_id IN ($in)", ARRAY_A ) as $r ) {
				if ( $r['tx'] === 'pa_pakuotes_dydis' ) { $dyd[ (int) $r['id'] ][] = $r['slug']; } else { $tax[ (int) $r['id'] ][] = (int) $r['tid']; }
			}
			foreach ( $rows as $r ) {
				$id = (int) $r['id']; $kg = 0; $u = ''; $mires = 0;
				if ( class_exists( 'Petshop_Dydziai' ) ) { $u = Petshop_Dydziai::uzrasas( $id ); $k = Petshop_Dydziai::kg( $u ); $kg = (float) ( $k[0] ?: $k[1] ); }
				$yra = ! isset( $r['ss'] ) || $r['ss'] !== 'outofstock';
				if ( class_exists( 'Petshop_Dydziai' ) && method_exists( 'Petshop_Dydziai', 'mires' ) ) { $mires = Petshop_Dydziai::mires( $u, $yra, array( $pard[ $id ], $p90[ $id ], $p30[ $id ] ) ) ? 1 : 0; }
				$out[ $r['seima'] ][] = array( $id, (int) $pard[ $id ], (float) $r['kaina'], $dyd[ $id ] ?? array(), $kg, $tax[ $id ] ?? array(), $mires );
			}
			foreach ( $out as $s => $m ) { if ( count( $m ) < 2 ) { unset( $out[ $s ] ); } }
		} catch ( \Throwable $e ) { $out = array(); }
		set_transient( self::T, $out, 2 * HOUR_IN_SECONDS );
		return $out;
	}

	private static function tinka( $q ) {
		if ( is_admin() ) { return false; }
		if ( ! $q->is_main_query() || $q->is_feed() || $q->is_singular() ) { return false; }
		if ( get_option( 'ps_dydziai_katalogas_isjungta' ) ) { return false; }
		if ( $q->is_search() ) { $pt = $q->get( 'post_type' ); return $pt === 'product' || ( is_array( $pt ) && in_array( 'product', $pt, true ) ) || isset( $_GET['post_type'] ) && $_GET['post_type'] === 'product'; }
		return $q->is_post_type_archive( 'product' ) || $q->is_tax( array( 'product_cat', 'product_brand', 'product_tag' ) );
	}

	public static function uzklausa( $q ) {
		if ( ! self::tinka( $q ) ) { return; }
		$seimos = self::seimos(); if ( ! $seimos ) { return; }
		// aktyvūs filtrai
		$dyd = array();
		foreach ( array( 'filter_pakuotes_dydis', 'pa_pakuotes_dydis' ) as $k ) { if ( ! empty( $_GET[ $k ] ) ) { $dyd = array_merge( $dyd, array_filter( array_map( 'sanitize_title', explode( ',', (string) $_GET[ $k ] ) ) ) ); } }
		$qv = $q->get( 'pa_pakuotes_dydis' ); if ( $qv ) { $dyd = array_merge( $dyd, array_filter( array_map( 'sanitize_title', explode( ',', (string) $qv ) ) ) ); }
		$min = isset( $_GET['min_price'] ) ? (float) $_GET['min_price'] : null; $max = isset( $_GET['max_price'] ) ? (float) $_GET['max_price'] : null;
		// taksonomijos archyvas: nariai turi priklausyti terminui (product_cat — su vaikais)
		$terminai = array();
		if ( $q->is_tax( array( 'product_cat', 'product_brand', 'product_tag' ) ) ) {
			$qo = $q->get_queried_object();
			if ( $qo && ! empty( $qo->term_id ) ) { $terminai = array( (int) $qo->term_id ); if ( $qo->taxonomy === 'product_cat' ) { $ch = get_term_children( (int) $qo->term_id, 'product_cat' ); if ( ! is_wp_error( $ch ) ) { $terminai = array_merge( $terminai, array_map( 'intval', $ch ) ); } } }
		}
		$islaikyti = array();
		foreach ( $seimos as $nariai ) {
			$kand = array();
			foreach ( $nariai as $n ) {
				if ( ! empty( $n[6] ) ) { continue; } // miręs narys veidu netampa
				if ( $terminai && ! array_intersect( $terminai, $n[5] ?? array() ) ) { continue; }
				if ( $dyd && ! array_intersect( $dyd, $n[3] ) ) { continue; }
				if ( $min !== null && $n[2] < $min - 0.001 ) { continue; }
				if ( $max !== null && $max > 0 && $n[2] > $max + 0.001 ) { continue; }
				$kand[] = $n;
			}
			if ( ! $kand ) { $kand = $nariai; } // niekas neatitinka — WC pats išfiltruos, mes nieko neslepiam
			usort( $kand, function ( $a, $b ) { return ( $b[1] <=> $a[1] ) ?: ( $b[4] <=> $a[4] ); } );
			$veidas = $kand[0][0];
			foreach ( $nariai as $n ) { if ( $n[0] !== $veidas ) { $islaikyti[] = $n[0]; } }
		}
		if ( ! $islaikyti ) { return; }
		$ne = (array) $q->get( 'post__not_in' );
		$q->set( 'post__not_in', array_values( array_unique( array_merge( array_map( 'intval', $ne ), $islaikyti ) ) ) );
	}
}
Petshop_Dydziu_Katalogas::init();
