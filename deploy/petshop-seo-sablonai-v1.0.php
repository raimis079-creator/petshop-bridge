<?php
/**
 * Plugin Name: Petshop SEO šablonai v1.0 (S1717, 2.14)
 * Description: (1) H1 kategorijų (išskyrus 5 hub'us su savo landing H1 — snippet 688), gamintojų ir /parduotuve/ puslapiuose:
 *   Flatsome H1 nerodo, kol `category_show_title`=0 (tema), o breadcrumb'ų blokas lieka — H1 dedamas per `flatsome_category_title` prio 2
 *   ta pačia Flatsome žyma (`h1.shop-page-title.is-xlarge`). Tuščioms kategorijoms (count 0, Rank Math noindex) H1 nededamas.
 *   (2) Rank Math atsarginiai title/description tik terminams BE savo rank_math_title / rank_math_description:
 *   gamintojui title „{Gamintojas} – {2 dažniausios subkategorijos} | Petshop.lt", description iš prekių skaičiaus ir 3 kategorijų;
 *   kategorijai be aprašymo — bendras tekstas su prekių skaičiumi. Skaičiai iš DB, cache 12 val. (transient ps_seo_sabl_{term}).
 *   Kategorijų title šablonas ir description iš aprašymo — Rank Math opcijose (S1717 t.php fazė 3), ne čia.
 *   Išjungti: opcija ps_seo_sablonai_isjungta = 1.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

final class Petshop_SEO_Sablonai {
	const VERSIJA = '1.0';
	/** Kategorijos su savo landing H1 (Code Snippet 688 „Kategorijos Landing v2 — 5 hub'ai"). */
	const HUBAI = array( 'sunims', 'katems', 'grauzikams', 'pauksciams', 'zuvims' );
	const PRISTATYMAS = 'Pristatymas per 1–3 d. d., nemokamai į paštomatą nuo 30 €.';

	public static function init() {
		if ( get_option( 'ps_seo_sablonai_isjungta' ) ) { return; }
		add_action( 'flatsome_category_title', array( __CLASS__, 'h1' ), 2 );
		add_filter( 'rank_math/frontend/title', array( __CLASS__, 'title' ), 20 );
		add_filter( 'rank_math/frontend/description', array( __CLASS__, 'description' ), 20 );
	}

	/** Dabartinis terminas archyve (product_cat / product_brand) arba null. */
	private static function terminas() {
		if ( ! function_exists( 'is_product_taxonomy' ) || ! is_product_taxonomy() ) { return null; }
		$t = get_queried_object();
		if ( ! $t || empty( $t->taxonomy ) || ! in_array( $t->taxonomy, array( 'product_cat', 'product_brand' ), true ) ) { return null; }
		return $t;
	}

	public static function h1() {
		if ( get_theme_mod( 'category_show_title', 0 ) ) { return; } // tema pati rodo — nedubliuojam
		$tekstas = '';
		$t = self::terminas();
		if ( $t ) {
			if ( 'product_cat' === $t->taxonomy && in_array( $t->slug, self::HUBAI, true ) ) { return; }
			if ( (int) $t->count < 1 ) { return; }
			$tekstas = $t->name;
		} elseif ( function_exists( 'is_shop' ) && is_shop() ) {
			$tekstas = 'Visos prekės';
		}
		if ( '' === $tekstas ) { return; }
		echo '<h1 class="shop-page-title is-xlarge ps-seo-h1">' . esc_html( $tekstas ) . '</h1>';
	}

	/** Gamintojo prekių skaičius ir dažniausios subkategorijos (publikuotos prekės). */
	private static function statistika( $t ) {
		$k = 'ps_seo_sabl_' . (int) $t->term_id;
		$c = get_transient( $k );
		if ( is_array( $c ) ) { return $c; }
		global $wpdb;
		$tt  = (int) $t->term_taxonomy_id;
		$ids = "SELECT tr2.object_id FROM {$wpdb->term_relationships} tr2 JOIN {$wpdb->posts} p2 ON p2.ID = tr2.object_id AND p2.post_type = 'product' AND p2.post_status = 'publish' WHERE tr2.term_taxonomy_id = {$tt}";
		$n   = (int) $wpdb->get_var( "SELECT COUNT(*) FROM ( {$ids} ) x" );
		$kat = array();
		if ( $n ) {
			$rows = $wpdb->get_results( "SELECT tm.name, COUNT(*) n FROM {$wpdb->term_relationships} tr JOIN {$wpdb->term_taxonomy} tx ON tx.term_taxonomy_id = tr.term_taxonomy_id AND tx.taxonomy = 'product_cat' AND tx.parent > 0 JOIN {$wpdb->terms} tm ON tm.term_id = tx.term_id WHERE tr.object_id IN ( {$ids} ) GROUP BY tx.term_id ORDER BY n DESC LIMIT 3", ARRAY_A );
			foreach ( (array) $rows as $r ) { $kat[] = mb_strtolower( (string) $r['name'] ); }
		}
		$c = array( 'n' => $n, 'kat' => $kat );
		set_transient( $k, $c, 12 * HOUR_IN_SECONDS );
		return $c;
	}

	/** Lietuviška daugiskaita: 1 prekė, 2–9 prekės, 10–20 prekių, 21 prekė, 22 prekės … */
	private static function prekiu( $n ) {
		$n = (int) $n; $d = $n % 10; $dd = $n % 100;
		if ( $dd >= 11 && $dd <= 19 ) { return $n . ' prekių'; }
		if ( 1 === $d ) { return $n . ' prekė'; }
		if ( 0 === $d ) { return $n . ' prekių'; }
		return $n . ' prekės';
	}

	private static function turi_meta( $t, $raktas ) {
		return '' !== trim( (string) get_term_meta( $t->term_id, $raktas, true ) );
	}

	public static function title( $title ) {
		$t = self::terminas();
		if ( ! $t || 'product_brand' !== $t->taxonomy || self::turi_meta( $t, 'rank_math_title' ) ) { return $title; }
		$s = self::statistika( $t );
		$kat = array_slice( $s['kat'], 0, 2 );
		$dalis = $kat ? implode( ', ', $kat ) : 'prekės gyvūnams';
		$naujas = $t->name . ' – ' . $dalis . ' | Petshop.lt';
		if ( mb_strlen( $naujas ) > 65 && count( $kat ) > 1 ) { $naujas = $t->name . ' – ' . $kat[0] . ' | Petshop.lt'; }
		return $naujas;
	}

	public static function description( $desc ) {
		if ( '' !== trim( (string) $desc ) ) { return $desc; }
		$t = self::terminas();
		if ( ! $t || self::turi_meta( $t, 'rank_math_description' ) ) { return $desc; }
		if ( 'product_brand' === $t->taxonomy ) {
			$s = self::statistika( $t );
			if ( $s['n'] < 1 ) { return $desc; }
			$kat = $s['kat'] ? ' – ' . implode( ', ', $s['kat'] ) : '';
			return $t->name . ' prekės internetu: ' . self::prekiu( $s['n'] ) . $kat . '. ' . self::PRISTATYMAS;
		}
		if ( 'product_cat' === $t->taxonomy && (int) $t->count > 0 ) {
			return $t->name . ' – ' . self::prekiu( (int) $t->count ) . ' iš patikimų gamintojų. Padedame išsirinkti pagal sudėtį ir poreikį. ' . self::PRISTATYMAS;
		}
		return $desc;
	}
}
add_action( 'init', array( 'Petshop_SEO_Sablonai', 'init' ), 20 );
