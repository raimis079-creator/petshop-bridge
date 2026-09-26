<?php
/**
 * Plugin Name: Petshop Dydžių automatas v1.0 (nauja prekė → pakuočių šeima)
 * Description: S1721 (2026-09-26, Raimio sprendimas 17:04). Publikuojant prekę be _ps_dydzio_seima (sausas maistas / konservai / DP pakai):
 *   DP pakas → bazinės prekės šeima; kitaip ieškoma šeimos su tuo pačiu gamintoju (product_brand) ir TIKSLIAI tuo pačiu pavadinimu be svorio
 *   (be pašaras/maistas/sausas/akcija ir pan.) → priskiriama pati (+ trūkstamas pa_pakuotes_dydis terminas iš pavadinimo); jei sutampa tik
 *   panašiai (Jaccard ≥ 0,6, linijos žodžiai mažų/junior/sterilised/… sutampa) → kandidatas (opcija ps_dydziai_kandidatai), R prijungia
 *   katalogo įrankyje. Žurnalas opcija ps_dydziai_auto_log (60 įrašų) → Ryto sargo lemputė „seimos". Išjungti: ps_dydziai_automatas_isjungtas=1.
 * Version: 1.0
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Dydziu_Automatas {

	const KAT = array( 'sausas-maistas-sunims', 'sausas-maistas-katems', 'konservai-sunims', 'konservai-katems', 'animonda-konservai-sunims', 'miamor-katems', 'hipoalerginis-maistas-sunims', 'super-premium-sunu-maistas', 'maistas-sunims', 'maistas-katems', 'daugiau-pigiau' );
	const STOP = array( 'sausas', 'sausa', 'pašaras', 'pasaras', 'maistas', 'ėdalas', 'edalas', 'akcija', 'šunims', 'sunims', 'katėms', 'katems', 'šunų', 'sunu', 'kačių', 'kaciu', '&', '+', 'a', 's', 'su', 'ir', 'visavertis', 'pilnavertis', 'litrų', 'litrai', 'l', 'kg', 'g', 'vnt', 'vnt.', '-', 'x', '×', 'the', 'for', 'dry', 'food', 'dog', 'cat', 'begrūdis', 'begrudis', 'konservai', 'konservuotas', 'konservas', 'pate', 'paštetas', 'pastetas' );
	const KEY  = array( 'mažų', 'mazu', 'veisl', 'mini', 'small', 'mediu', 'maxi', 'didel', 'junio', 'puppy', 'senio', 'kitte', 'steri', 'light', 'šuniu', 'suniu', 'kačiu', 'kaciu', 'large', 'giant', 'indoo', 'urina', 'sensi', 'vidut', 'suaug', 'adult', 'jaunų', 'jauni', 'senjo', 'sterl', 'hairb', 'plauk', 'activ', 'diet', 'vet', 'veter', 'kačiukams', 'šuniukams' );

	private static $eile = array();

	public static function init() {
		add_action( 'transition_post_status', array( __CLASS__, 'publikuota' ), 20, 3 );
		foreach ( array( 'added_post_meta', 'updated_post_meta', 'deleted_post_meta' ) as $h ) { add_action( $h, array( __CLASS__, 'meta_pokytis' ), 10, 3 ); }
	}

	public static function meta_pokytis( $mid, $pid, $key ) { if ( $key === '_ps_dydzio_seima' ) { delete_transient( 'ps_dydz_auto_bazes' ); } }

	/** Publikavimo momentu (WPAI, admin) kategorijos/gamintojas/meta dar gali būti neįrašyti → tikriname užklausos pabaigoje (shutdown). */
	public static function publikuota( $new, $old, $post ) {
		if ( $new !== 'publish' || $old === 'publish' || ! $post || $post->post_type !== 'product' ) { return; }
		if ( get_option( 'ps_dydziai_automatas_isjungtas' ) ) { return; }
		if ( ! self::$eile ) { add_action( 'shutdown', array( __CLASS__, 'vykdyti' ), 5 ); }
		self::$eile[ (int) $post->ID ] = true;
	}

	public static function vykdyti() {
		$ids = array_keys( self::$eile ); self::$eile = array();
		foreach ( array_slice( $ids, 0, 200 ) as $pid ) {
			if ( get_post_status( $pid ) !== 'publish' ) { continue; }
			try { self::rasti( $pid, false ); } catch ( \Throwable $e ) { self::log( 'klaida', $pid, '', $e->getMessage() ); }
		}
	}

	/** Pavadinimas be svorio → žodžių aibė (stemai 5 simb., be STOP ir skaičių). */
	public static function baze( $title ) {
		$t = mb_strtolower( $title );
		$t = preg_replace( '/^\s*\d+\s*(?:vnt\.?|x|×)\s*-?\s*/u', ' ', $t );
		$t = preg_replace( '/(\d+)\s*(?:x|×)\s*(\d+(?:[.,]\d+)?)\s*(kg|g|l|ml)\b/u', ' ', $t );
		$t = preg_replace( '/(\d+(?:[.,]\d+)?)\s*\+\s*(\d+(?:[.,]\d+)?)\s*(kg|g)\b/u', ' ', $t );
		$t = preg_replace( '/(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l|litrai|litrų|lt)\b/u', ' ', $t );
		$t = preg_replace( '/\b\d+\s*vnt\.?/u', ' ', $t );
		$t = preg_replace( '/[()\[\]\/,–\-—|:;.!?"„“]+/u', ' ', $t );
		$w = array(); foreach ( preg_split( '/\s+/u', trim( $t ) ) as $x ) { if ( $x === '' || is_numeric( $x ) || in_array( $x, self::STOP, true ) ) { continue; } $w[ mb_substr( $x, 0, 5 ) ] = true; }
		return array_keys( $w );
	}

	public static function brendas( $pid ) { $b = wp_get_object_terms( $pid, 'product_brand', array( 'fields' => 'slugs' ) ); return ( ! is_wp_error( $b ) && $b ) ? (string) $b[0] : ''; }

	public static function tinka_kat( $pid ) { $c = wp_get_object_terms( $pid, 'product_cat', array( 'fields' => 'slugs' ) ); return ! is_wp_error( $c ) && array_intersect( (array) $c, self::KAT ); }

	/** Šeimų bazės: [seima => ['b' => brendas, 'n' => [ [id, baze[]], ... ]]] (transient 6 val.) */
	public static function bazes() {
		$c = get_transient( 'ps_dydz_auto_bazes' ); if ( is_array( $c ) ) { return $c; }
		global $wpdb; $out = array();
		$rows = $wpdb->get_results( "SELECT m.post_id id, m.meta_value seima, p.post_title t FROM {$wpdb->postmeta} m JOIN {$wpdb->posts} p ON p.ID = m.post_id AND p.post_type = 'product' AND p.post_status = 'publish' WHERE m.meta_key = '_ps_dydzio_seima' AND m.meta_value <> ''", ARRAY_A );
		foreach ( (array) $rows as $r ) { $id = (int) $r['id']; if ( ! isset( $out[ $r['seima'] ] ) ) { $out[ $r['seima'] ] = array( 'b' => self::brendas( $id ), 'n' => array() ); } $out[ $r['seima'] ]['n'][] = array( $id, self::baze( $r['t'] ) ); }
		set_transient( 'ps_dydz_auto_bazes', $out, 6 * HOUR_IN_SECONDS );
		return $out;
	}

	/** Grąžina ['tipas' => tiksli|kandidatas|dp|ne, 'seima' => , 'narys' => , 'jac' => ]; $dry — tik ieško, nerašo. */
	public static function rasti( $pid, $dry = true, $ignoruoti_sava = false ) {
		$res = array( 'tipas' => 'ne', 'seima' => '', 'narys' => 0, 'jac' => 0 );
		if ( ! $ignoruoti_sava && get_post_meta( $pid, '_ps_dydzio_seima', true ) ) { $res['tipas'] = 'jau'; return $res; }
		if ( ! self::tinka_kat( $pid ) ) { $res['tipas'] = 'ne_kat'; return $res; }
		// DP pakas → bazinės šeima
		$base = (int) get_post_meta( $pid, '_dp_base_product_id', true );
		if ( $base ) { $s = (string) get_post_meta( $base, '_ps_dydzio_seima', true ); if ( $s ) { $res = array( 'tipas' => 'dp', 'seima' => $s, 'narys' => $base, 'jac' => 1 ); if ( ! $dry ) { self::priskirti( $pid, $s, 'dp', $base ); } } return $res; }
		$br = self::brendas( $pid ); if ( $br === '' ) { $res['tipas'] = 'ne_brendas'; return $res; }
		$mano = self::baze( get_the_title( $pid ) ); if ( count( $mano ) < 2 ) { return $res; }
		$best = null;
		foreach ( self::bazes() as $seima => $x ) {
			if ( $x['b'] !== $br ) { continue; }
			foreach ( $x['n'] as $n ) {
				if ( $ignoruoti_sava && $n[0] === $pid ) { continue; }
				$jo = $n[1]; if ( count( $jo ) < 2 ) { continue; }
				$a = array_flip( $mano ); $b = array_flip( $jo );
				$inter = count( array_intersect_key( $a, $b ) ); $union = count( $a + $b ); $jac = $union ? $inter / $union : 0;
				if ( $jac >= 0.999 ) { $res = array( 'tipas' => 'tiksli', 'seima' => $seima, 'narys' => $n[0], 'jac' => 1 ); if ( ! $dry ) { self::priskirti( $pid, $seima, 'tiksli', $n[0] ); } return $res; }
				$diff = array_keys( array_diff_key( $a, $b ) + array_diff_key( $b, $a ) );
				if ( array_intersect( $diff, self::KEY ) ) { continue; }
				if ( $jac >= 0.6 && ( ! $best || $jac > $best['jac'] ) ) { $best = array( 'tipas' => 'kandidatas', 'seima' => $seima, 'narys' => $n[0], 'jac' => round( $jac, 2 ) ); }
			}
		}
		if ( $best ) { $res = $best; if ( ! $dry ) { self::kandidatas( $pid, $best ); } }
		return $res;
	}

	private static function priskirti( $pid, $seima, $tipas, $narys ) {
		update_post_meta( $pid, '_ps_dydzio_seima', $seima );
		$info = 'kaip #' . $narys;
		// pa_pakuotes_dydis terminas — jei trūksta, iš pavadinimo
		$t = wp_get_object_terms( $pid, 'pa_pakuotes_dydis', array( 'fields' => 'names' ) );
		if ( ! is_wp_error( $t ) && ! $t && taxonomy_exists( 'pa_pakuotes_dydis' ) ) {
			$lab = self::dydis_is_pavadinimo( get_the_title( $pid ) );
			if ( $lab !== '' ) { $r = wp_set_object_terms( $pid, $lab, 'pa_pakuotes_dydis', true ); $info .= is_wp_error( $r ) ? '; terminas NEPAVYKO' : '; terminas „' . $lab . '“ pridėtas'; }
			else { $info .= '; TRŪKSTA pa_pakuotes_dydis'; }
		}
		foreach ( array( 'ps_dk_seimos', 'ps_dydz_auto_bazes', 'ps_dk_' . md5( $seima ) ) as $tk ) { delete_transient( $tk ); }
		if ( class_exists( 'Petshop_Cache' ) ) { Petshop_Cache::preke_id( $pid ); if ( $narys ) { Petshop_Cache::preke_id( $narys ); } }
		self::log( $tipas, $pid, $seima, $info );
	}

	private static function kandidatas( $pid, $best ) {
		$k = get_option( 'ps_dydziai_kandidatai' ); if ( ! is_array( $k ) ) { $k = array(); }
		$k[ (string) $pid ] = array( 'seima' => $best['seima'], 'narys' => $best['narys'], 'jac' => $best['jac'], 'laikas' => wp_date( 'Y-m-d H:i' ) );
		if ( count( $k ) > 100 ) { $k = array_slice( $k, -100, 100, true ); }
		update_option( 'ps_dydziai_kandidatai', $k, false );
		self::log( 'kandidatas', $pid, $best['seima'], 'panašu į #' . $best['narys'] . ' (' . $best['jac'] . ')' );
	}

	public static function dydis_is_pavadinimo( $title ) {
		$t = str_replace( ',', '.', $title );
		if ( preg_match( '/(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)\s*(kg|g)\b/iu', $t, $m ) ) { return str_replace( '.', ',', $m[1] . '+' . $m[2] ) . ' ' . strtolower( $m[3] ); }
		if ( preg_match( '/(\d+)\s*(?:x|×)\s*(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\b/iu', $t, $m ) ) { return $m[1] . ' × ' . str_replace( '.', ',', $m[2] ) . ' ' . strtolower( $m[3] ); }
		if ( preg_match( '/(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\b/iu', $t, $m ) ) { return str_replace( '.', ',', $m[1] ) . ' ' . strtolower( $m[2] ); }
		return '';
	}

	public static function log( $tipas, $pid, $seima, $info ) {
		$z = get_option( 'ps_dydziai_auto_log' ); if ( ! is_array( $z ) ) { $z = array(); }
		$z[] = array( wp_date( 'Y-m-d H:i' ), $tipas, (int) $pid, (string) $seima, mb_substr( (string) $info, 0, 120 ) );
		if ( count( $z ) > 60 ) { $z = array_slice( $z, -60 ); }
		update_option( 'ps_dydziai_auto_log', $z, false );
	}

	/** Ryto sargui: įrašai per paskutines N val. → [priskirta, kandidatai, klaidos, tekstas] */
	public static function suvestine( $val = 26 ) {
		$z = get_option( 'ps_dydziai_auto_log' ); if ( ! is_array( $z ) ) { $z = array(); }
		$nuo = time() - $val * 3600; $pr = array(); $ka = array(); $kl = 0;
		foreach ( $z as $e ) { $ts = strtotime( $e[0] . ' ' . wp_timezone_string() ); if ( $ts === false ) { $ts = strtotime( $e[0] ); } if ( $ts < $nuo ) { continue; }
			if ( $e[1] === 'tiksli' || $e[1] === 'dp' ) { $pr[] = '#' . $e[2] . '→' . $e[3]; } elseif ( $e[1] === 'kandidatas' ) { $ka[] = '#' . $e[2] . '~' . $e[3]; } elseif ( $e[1] === 'klaida' ) { $kl++; } }
		return array( count( $pr ), count( $ka ), $kl, 'Šeimos: priskirta ' . count( $pr ) . ( $pr ? ' (' . implode( ', ', array_slice( $pr, 0, 6 ) ) . ')' : '' ) . ', kandidatų ' . count( $ka ) . ( $ka ? ' (' . implode( ', ', array_slice( $ka, 0, 6 ) ) . ')' : '' ) . ( $kl ? ', klaidų ' . $kl : '' ) );
	}
}
Petshop_Dydziu_Automatas::init();
