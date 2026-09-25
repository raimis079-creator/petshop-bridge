<?php
/**
 * Plugin Name: Petshop GSC tvarka v1.2 (S1711 → S1717)
 * Description: Google Search Console radinių pataisos (2026-09-24):
 *   (1) robots.txt — Google neskanuoja YITH filtrų / rikiavimo kombinacijų (?yith_wcan=, filter_, query_type_, orderby=);
 *   (2) Product schema be offers neišvedama archyvuose (gamintojai/kategorijos) — GSC „Reikia nurodyti offers";
 *       v1.1: ir Rank Math json_ld (gamintojų puslapiuose prekių sąrašas) — Product mazgai be offers išmetami ne prekės puslapyje;
 *   (3) seni eShoprent tinklaraščio URL (?route=blog/article…&blogid=N) → 301 į atitinkamą straipsnį;
 *   (4) keli seni 404 URL su organikos paspaudimais → 301.
 *   v1.2 (S1717, 2.14): (4) papildyta 25 keliais iš ps_seo_404 (Exclusion 1,5 kg → prekės, Super Beno konservai → konservai šunims,
 *       Monge Puppy → prekės, Deli Nature → gamintojas, kiaulės ausys → prekės, senos kategorijos/register/login → puslapiai; tipas 'g' = puslapio kelias);
 *       (5) seni eShoprent nuotraukų keliai (/image/cache/, /cache/images/, /images/uploader/, /image/data/) → 410 Gone
 *       (Googlebot-Image 7 d. ~245 × 404; 410 — Google išmeta greičiau ir nebekartoja).
 * Išjungti: opcija ps_gsc_tvarka_isjungta=1 arba pervadinti failą.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_GSC_Tvarka {

	const ROBOTS = array(
		'Disallow: /*?*yith_wcan=',
		'Disallow: /*?*filter_',
		'Disallow: /*?*query_type_',
		'Disallow: /*?*orderby=',
	);

	/** eShoprent blogid → WP puslapio ID (iš _petshop_pre_force_content spausdinimo nuorodų, S1711). */
	const BLOG = array(
		6 => 3205, 7 => 3207, 8 => 3215, 9 => 3227, 12 => 3233, 13 => 3218, 14 => 3211, 15 => 3217,
		16 => 3206, 17 => 3219, 18 => 3209, 19 => 3213, 20 => 3221, 21 => 3214, 22 => 3212, 23 => 3208,
		25 => 3216, 26 => 3225, 27 => 3231, 28 => 3224, 29 => 3210, 30 => 3222, 31 => 3220, 32 => 3223,
		37 => 3229,
	);

	/** Senas kelias → [tipas, id]: p = prekė/įrašas (post ID), c = product_cat, b = product_brand slug, pc = prekės kategorija, g = puslapio kelias (get_page_by_path). */
	const KELIAI = array(
		'trixie-kilimelis-purvui-surinkti-120-80-cm' => array( 'p', 13975 ),
		'kiaules-snipas-baltas'                      => array( 'c', 95 ),
		'automatine-serykla-kateisuniui'             => array( 'pc', 19125 ),
		'kraikas-katems-tofu-belocat-original-bekvapis-6-l-2-5-kg-2-mm-granules' => array( 'b', 'belocat' ),
		'sterilizuotu-kaciu-maistas'                 => array( 'c', 81 ),
		'saldziosios-bulves-apvyniotos-antiena-500-g-naturalus-skanestai-sunims-hau-and-miau' => array( 'b', 'haumiau' ),
		// v1.2 (S1717) — iš ps_seo_404, 30 d.
		'exclusion-me-mono-noble-grain-sausas-pasaras-sterilizuotoms-didelems-katems-su-vistiena-1-5-kg' => array( 'p', 18533 ),
		'exclusion-me-mono-noble-grain-sausas-pasaras-katems-su-vistiena-1-5-kg'                       => array( 'p', 18539 ),
		'exclusion-me-mono-noble-grain-sausas-pasaras-kaciukams-su-vistiena-1-5-kg'                    => array( 'p', 18536 ),
		'konservai-sunims-super-beno-grain-free-jautiena-ir-zveriena-415-g'            => array( 'c', 73 ),
		'konservai-sunims-super-beno-grain-free-light-su-kalakutiena-415-g'             => array( 'c', 73 ),
		'konservai-sunims-super-beno-grain-free-antiena-ir-zirniai-415-g'               => array( 'c', 73 ),
		'konservai-sunims-super-beno-grain-free-eriena-ir-vistos-kepeneles-415-g'       => array( 'c', 73 ),
		'konservai-sunims-super-beno-grain-free-kalakutiena-ir-triusiena-415-g'         => array( 'c', 73 ),
		'konservai-sunims-super-beno-grain-free-versiena-vistos-kepeneles-ir-sirdeles-415-g' => array( 'c', 73 ),
		'sampunas-jautriai-odai-nuo-sudirgimo-frexin-220-g'                             => array( 'c', 76 ),
		'monge-puppy-sausas-pascaronaras-eriena-ir-ryziai-12kg-48091-1'                 => array( 'p', 12547 ),
		'monge-puppy-sausas-pascaronaras-lascaroniscarona-ir-ryziai-12kg-48092-1'       => array( 'p', 12550 ),
		'maistas-sterilizuotai-katei-su-antsvorio-problema-ka-pirkti-ir-kaip-maitinti'  => array( 'p', 34261 ),
		'20-vnt-kiaules-ausu'                                                           => array( 'p', 13520 ),
		'kiaules-ausis-ruda'                                                            => array( 'p', 16305 ),
		'deli-nature-menu-super-premium-lesalas-banguotosioms-papugelems-800-g'         => array( 'b', 'deli-nature' ),
		'deli-nature-menu-super-premium-lesalas-didelems-afrikos-papugoms-800-g'        => array( 'b', 'deli-nature' ),
		'deli-nature-menu-super-premium-lesalas-afrikos-papugoms-800-g'                 => array( 'b', 'deli-nature' ),
		'deli-nature-menu-super-premium-lesalas-pietu-amerikos-papugoms-800-g'          => array( 'b', 'deli-nature' ),
		'deli-nature-menu-super-premium-lesalas-amadinams-800-g'                        => array( 'b', 'deli-nature' ),
		'deli-nature-menu-super-premium-pasaras-juru-kiaulytems-750-g'                  => array( 'b', 'deli-nature' ),
		'deli-nature-menu-super-premium-pasaras-didesniems-grauzikams-750-g'            => array( 'b', 'deli-nature' ),
		'deli-nature-menu-super-premium-pasaras-sinsiloms-2-5-kg'                       => array( 'b', 'deli-nature' ),
		'deli-nature-rodelicious-rabbit-sensitive-pasaras-didesniems-grauzikams-750-g'  => array( 'b', 'deli-nature' ),
		'sunims/prieziuros-priemones'                                                   => array( 'c', 82 ),
		'daugiau-pigiau/katems-741072930'                                               => array( 'c', 91 ),
		'kita-446007278/daugiau-pigiau/pauksciams-132251148'                            => array( 'c', 91 ),
		'register'                                                                      => array( 'g', 'paskyra' ),
		'login'                                                                         => array( 'g', 'paskyra' ),
		'account/register'                                                              => array( 'g', 'paskyra' ),
		'account/login'                                                                 => array( 'g', 'paskyra' ),
		'contact'                                                                       => array( 'g', 'kontaktai' ),
	);

	/** Seni eShoprent nuotraukų keliai → 410 (v1.2). */
	const SENOS_NUOTRAUKOS = array( 'image/cache/', 'cache/images/', 'images/uploader/', 'image/data/' );

	public static function init() {
		if ( get_option( 'ps_gsc_tvarka_isjungta' ) ) { return; }
		add_filter( 'robots_txt', array( __CLASS__, 'robots' ), 99, 2 );
		add_filter( 'woocommerce_structured_data_product', array( __CLASS__, 'schema' ), 99, 2 );
		add_filter( 'rank_math/json_ld', array( __CLASS__, 'rm_json' ), 100, 2 );
		add_action( 'template_redirect', array( __CLASS__, 'blog' ), 0 );
		add_action( 'template_redirect', array( __CLASS__, 'senos_nuotraukos' ), 1 );
		add_action( 'template_redirect', array( __CLASS__, 'keliai' ), 3 );
	}

	public static function robots( $out, $public ) {
		if ( ! $public ) { return $out; }
		$trukst = array();
		foreach ( self::ROBOTS as $l ) {
			if ( strpos( $out, $l ) === false ) { $trukst[] = $l; }
		}
		if ( ! $trukst ) { return $out; }
		$eil = preg_split( "/\r?\n/", $out );
		$idx = -1; $grupe = false;
		foreach ( $eil as $i => $e ) {
			if ( preg_match( '/^User-agent:\s*\*\s*$/i', trim( $e ) ) ) { $grupe = true; $idx = $i; continue; }
			if ( $grupe ) {
				if ( preg_match( '/^(Disallow|Allow):/i', trim( $e ) ) ) { $idx = $i; continue; }
				if ( trim( $e ) === '' || preg_match( '/^User-agent:/i', trim( $e ) ) ) { break; }
			}
		}
		if ( $idx < 0 ) {
			return rtrim( $out ) . "\n\nUser-agent: *\n" . implode( "\n", $trukst ) . "\n";
		}
		array_splice( $eil, $idx + 1, 0, $trukst );
		return implode( "\n", $eil );
	}

	public static function schema( $markup, $product ) {
		if ( function_exists( 'is_product' ) && is_product() ) { return $markup; }
		return array();
	}

	public static function rm_json( $data, $jsonld = null ) {
		if ( ( function_exists( 'is_product' ) && is_product() ) || ! is_array( $data ) ) { return $data; }
		return self::valyti( $data );
	}

	private static function valyti( $a ) {
		$sarasas = array_keys( $a ) === range( 0, count( $a ) - 1 );
		$out = array();
		foreach ( $a as $k => $v ) {
			if ( is_array( $v ) ) {
				$t = isset( $v['@type'] ) ? (array) $v['@type'] : array();
				if ( in_array( 'Product', $t, true ) && empty( $v['offers'] ) && empty( $v['review'] ) && empty( $v['aggregateRating'] ) ) { continue; }
				$v = self::valyti( $v );
				if ( ( $k === '@graph' || $k === 'itemListElement' ) && ! $v ) { continue; }
			}
			$out[ $k ] = $v;
		}
		return $sarasas ? array_values( $out ) : $out;
	}

	public static function blog() {
		if ( empty( $_GET['route'] ) || empty( $_GET['blogid'] ) ) { return; }
		$route = (string) wp_unslash( $_GET['route'] );
		if ( strpos( $route, 'blog/article' ) !== 0 ) { return; }
		$b = (int) $_GET['blogid'];
		if ( ! isset( self::BLOG[ $b ] ) || get_post_status( self::BLOG[ $b ] ) !== 'publish' ) { return; }
		wp_safe_redirect( get_permalink( self::BLOG[ $b ] ), 301, 'Petshop-GSC-Tvarka' );
		exit;
	}

	/** v1.2: senos platformos nuotraukų keliai — 410 Gone (tik is_404, tik nuotraukų plėtiniai). */
	public static function senos_nuotraukos() {
		if ( ! is_404() ) { return; }
		$kelias = ltrim( (string) wp_parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), '/' );
		if ( ! preg_match( '/\.(jpe?g|png|gif|webp)$/i', $kelias ) ) { return; }
		foreach ( self::SENOS_NUOTRAUKOS as $pref ) {
			if ( strpos( $kelias, $pref ) === 0 ) {
				status_header( 410 );
				nocache_headers();
				header( 'Content-Type: text/plain; charset=utf-8' );
				header( 'X-Redirect-By: Petshop-GSC-Tvarka' );
				echo "410 Gone";
				exit;
			}
		}
	}

	public static function keliai() {
		if ( ! is_404() ) { return; }
		$kelias = trim( (string) wp_parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), '/' );
		if ( ! isset( self::KELIAI[ $kelias ] ) ) { return; }
		list( $t, $id ) = self::KELIAI[ $kelias ];
		$url = '';
		if ( $t === 'p' && get_post_status( $id ) === 'publish' ) {
			$url = get_permalink( $id );
		} elseif ( $t === 'c' ) {
			$l = get_term_link( (int) $id, 'product_cat' );
			$url = is_wp_error( $l ) ? '' : $l;
		} elseif ( $t === 'b' ) {
			$l = get_term_link( (string) $id, 'product_brand' );
			$url = is_wp_error( $l ) ? '' : $l;
		} elseif ( $t === 'g' ) {
			$pg = get_page_by_path( (string) $id );
			$url = ( $pg && 'publish' === $pg->post_status ) ? get_permalink( $pg ) : '';
		} elseif ( $t === 'pc' ) {
			$terms = wp_get_post_terms( $id, 'product_cat' );
			if ( $terms && ! is_wp_error( $terms ) ) {
				usort( $terms, function ( $a, $b ) { return count( get_ancestors( $b->term_id, 'product_cat' ) ) - count( get_ancestors( $a->term_id, 'product_cat' ) ); } );
				$l = get_term_link( $terms[0] );
				$url = is_wp_error( $l ) ? '' : $l;
			}
		}
		if ( $url ) {
			wp_safe_redirect( $url, 301, 'Petshop-GSC-Tvarka' );
			exit;
		}
	}
}
add_action( 'plugins_loaded', array( 'Petshop_GSC_Tvarka', 'init' ) );
