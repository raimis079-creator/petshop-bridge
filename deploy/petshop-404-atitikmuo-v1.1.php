<?php
/**
 * Plugin Name: Petshop 404 atitikmuo v1.1 (S1689s, S1698)
 * Description: Senos platformos adresams, kurių nėra legacy-301 žemėlapyje. Veikia po petshop-legacy-301 (prio 1), tik kai is_404().
 *   v1.0: 301 kai paskutinis segmentas (be .html ir ID priešdėlio) TIKSLIAI = publikuotos prekės / kategorijos / gamintojo slug; alias.
 *   v1.1 (S1698, 2026-09-20): (a) alias checkout→/kasa/, cart→/krepselis/, content/*nuostatos* → taisyklių puslapis, parduotuve/page/N → /parduotuve/;
 *     (b) prekė yra, bet NE publish (draft/trash/private, pvz. Exclusion Intestinal po S1688) → 301 į jos giliausią kategoriją;
 *     (c) gamintojas pagal _legacy_manufacturer (placek-pet-products-s-r-o → /gamintojas/placek/, greenpetfood → green-petfood);
 *     (d) ARTIMIAUSIAS slug: senas eShoprent slug be ID (trixie-kilimelis-purvui-surinkti-120-80-cm) → publikuota prekė, kai
 *         VISI seno slug'o skaičiai/pakuotės sutampa ir ≥75 % žodžių randami naujame slug'e, ir geriausias kandidatas vienintelis;
 *     (e) žurnalas opcijoje ps_404_atitikmuo_log (paskutiniai 300: kelias → url, taisyklė) auditui.
 *   Kitaip lieka 404 (jokio nukreipimo į paiešką). X-Redirect-By: Petshop-404-Atitikmuo
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** „5kg" → „5-kg", „120x80" → „120-x-80", „al119" → „al-119" — vienodinam seną ir naują slug'ą. */
function ps404_norm( $slug ) {
	return preg_replace( array( '/(\d)([a-z])/', '/([a-z])(\d)/' ), '$1-$2', $slug );
}

function ps404_zodziai( $slug ) {
	$stop = array( 'ir','su','is','iš','be','kg','g','l','ml','cm','mm','vnt','m','x','sausas','maistas','pasaras','pašaras','sunims','šunims','katems','katėms','sunu','šunų','kaciu','kačių','suaugusiems','jauniems','mazu','mažu','veisliu','veislių','konservai','skanestai','skanėstai','naturalus','natūralūs','kraikas','the','and','for' );
	$raw = array_values( array_filter( explode( '-', ps404_norm( $slug ) ), 'strlen' ) );
	// skaičių grupės pagal gretimumą originale: „2-5" → grupė „2-5" (naujame gali būti „25")
	$grp = array(); $prev = false;
	foreach ( $raw as $w ) {
		if ( preg_match( '/^\d+$/', $w ) ) { if ( $prev ) { $grp[ count( $grp ) - 1 ] .= '-' . $w; } else { $grp[] = $w; } $prev = true; }
		else { $prev = false; }
	}
	$zo = array_values( array_filter( $raw, function ( $w ) use ( $stop ) { return ! preg_match( '/^\d+$/', $w ) && strlen( $w ) >= 3 && ! in_array( $w, $stop, true ); } ) );
	return array( $zo, $grp );
}

function ps404_giliausia_kat( $pid ) {
	$terms = get_the_terms( $pid, 'product_cat' );
	if ( ! $terms || is_wp_error( $terms ) ) { return null; }
	$best = null; $bd = -1;
	foreach ( $terms as $t ) { $d = count( get_ancestors( $t->term_id, 'product_cat' ) ); if ( $d > $bd ) { $bd = $d; $best = $t; } }
	$l = $best ? get_term_link( $best ) : null;
	return ( $l && ! is_wp_error( $l ) ) ? $l : null;
}

function ps404_log( $kelias, $url, $taisykle ) {
	$log = get_option( 'ps_404_atitikmuo_log', array() );
	if ( ! is_array( $log ) ) { $log = array(); }
	$log[] = array( 'k' => $kelias, 'u' => $url, 't' => $taisykle, 'l' => current_time( 'mysql' ) );
	if ( count( $log ) > 300 ) { $log = array_slice( $log, -300 ); }
	update_option( 'ps_404_atitikmuo_log', $log, false );
}

add_action( 'template_redirect', function () {
	if ( is_admin() || wp_doing_ajax() || is_robots() || is_feed() || ! is_404() ) { return; }

	$uri    = (string) ( $_SERVER['REQUEST_URI'] ?? '' );
	$kelias = strtolower( trim( rawurldecode( (string) parse_url( $uri, PHP_URL_PATH ) ), '/' ) );
	if ( '' === $kelias || preg_match( '#(^|/)(wp-|\.)|\.(php|css|js|png|jpe?g|webp|gif|xml|txt|env|json|map|lock|log)$#i', $kelias ) ) { return; }
	if ( preg_match( '#^(api|graphql|v1|auth|admin|panel|console|_profiler|cache|ipfs|webroot|vendor|node_modules|backoffice|portal|app|models|chat)(/|$)#', $kelias ) ) { return; }

	global $wpdb;
	$taisykle = '';
	$alias = array(
		'paieska'      => '/parduotuve/',
		'visos-prekes' => '/parduotuve/',
		'allproducts'  => '/parduotuve/',
		'login'        => '/paskyra/',
		'checkout'     => '/kasa/',
		'cart'         => '/krepselis/',
		'basket'       => '/krepselis/',
		'order'        => '/kasa/',
	);
	$url = null;
	if ( isset( $alias[ $kelias ] ) ) {
		$url = home_url( $alias[ $kelias ] ); $taisykle = 'alias';
	} elseif ( preg_match( '#^parduotuve/page/\d+$#', $kelias ) ) {
		$url = home_url( '/parduotuve/' ); $taisykle = 'page-n';
	} elseif ( preg_match( '#^content/#', $kelias ) ) {
		$kand = array();
		if ( preg_match( '/salyg|taisykl|nuostat/', $kelias ) ) { $kand = array( 'pirkimo-taisykles', 'taisykles', 'nuostatos-ir-salygos', 'pirkimo-salygos' ); }
		elseif ( false !== strpos( $kelias, 'privatum' ) ) { $kand = array( 'privatumo-politika' ); }
		elseif ( preg_match( '/pristat|siunt/', $kelias ) ) { $kand = array( 'pristatymas', 'pristatymas-ir-apmokejimas' ); }
		foreach ( $kand as $ps ) {
			$pg = get_page_by_path( $ps ); if ( $pg && 'publish' === $pg->post_status ) { $url = get_permalink( $pg ); $taisykle = 'content'; break; }
		}
	} else {
		$seg  = array_values( array_filter( explode( '/', $kelias ), 'strlen' ) );
		$last = end( $seg );
		if ( count( $seg ) >= 3 && 'page' === $seg[ count( $seg ) - 2 ] ) { $last = $seg[ count( $seg ) - 3 ]; }
		$slug = sanitize_title( preg_replace( array( '#\.html?$#', '#^\d{3,}-#', '#-\d{4,6}-\d$#' ), '', $last ) );
		if ( '' === $slug ) { return; }

		// (1) tikslus publikuotos prekės slug
		$pid = (int) $wpdb->get_var( $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND post_name=%s LIMIT 1", $slug ) );
		if ( $pid ) { $url = get_permalink( $pid ); $taisykle = 'slug'; }

		// (2) kategorija / gamintojas pagal slug
		if ( ! $url ) {
			foreach ( array( 'product_cat', 'product_brand' ) as $tax ) {
				$t = get_term_by( 'slug', $slug, $tax );
				if ( $t && ! is_wp_error( $t ) ) { $l = get_term_link( $t ); if ( ! is_wp_error( $l ) ) { $url = $l; $taisykle = 'term'; break; } }
			}
		}

		// (3) prekė yra, bet ne publish → giliausia kategorija
		if ( ! $url ) {
			$pid = (int) $wpdb->get_var( $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} WHERE post_type='product' AND post_status IN ('draft','private','pending','trash') AND post_name=%s ORDER BY ID DESC LIMIT 1", $slug ) );
			if ( $pid ) { $url = ps404_giliausia_kat( $pid ); if ( $url ) { $taisykle = 'draft-kat'; } }
		}

		// (4) gamintojas pagal _legacy_manufacturer
		if ( ! $url && count( $seg ) === 1 ) {
			$rows = $wpdb->get_col( "SELECT DISTINCT meta_value FROM {$wpdb->postmeta} WHERE meta_key='_legacy_manufacturer' AND meta_value<>''" );
			foreach ( $rows as $lm ) {
				if ( sanitize_title( $lm ) === $slug ) {
					$pid2 = (int) $wpdb->get_var( $wpdb->prepare( "SELECT pm.post_id FROM {$wpdb->postmeta} pm JOIN {$wpdb->posts} p ON p.ID=pm.post_id AND p.post_status='publish' WHERE pm.meta_key='_legacy_manufacturer' AND pm.meta_value=%s LIMIT 1", $lm ) );
					$bt = $pid2 ? get_the_terms( $pid2, 'product_brand' ) : null;
					if ( $bt && ! is_wp_error( $bt ) ) { $l = get_term_link( $bt[0] ); if ( ! is_wp_error( $l ) ) { $url = $l; $taisykle = 'legacy-brand'; } }
					break;
				}
			}
		}

		// (5) artimiausias slug — tik prekėms iš šaknies / product, su griežtais vartais
		if ( ! $url && count( $seg ) <= 2 ) {
			list( $zo, $sk ) = ps404_zodziai( $slug );
			if ( count( $zo ) >= 2 ) {
				// pirminis filtras: 2 ilgiausi (specifiškiausi) žodžiai, pagal 5 raidžių pradžią (purvui ~ purva-)
				$ilg = $zo; usort( $ilg, function ( $a, $b ) { return strlen( $b ) - strlen( $a ); } );
				$like = array(); $params = array();
				foreach ( array_slice( $ilg, 0, 2 ) as $w ) { $like[] = "post_name LIKE %s"; $params[] = '%' . $wpdb->esc_like( strlen( $w ) >= 6 ? substr( $w, 0, 5 ) : $w ) . '%'; }
				$kand = $wpdb->get_results( $wpdb->prepare( "SELECT ID, post_name FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND " . implode( ' AND ', $like ) . " LIMIT 300", $params ), ARRAY_A );
				$best = null; $bs = 0; $second = 0;
				foreach ( $kand as $c ) {
					$cn = ps404_norm( $c['post_name'] ); $ct = array_values( array_filter( explode( '-', $cn ), 'strlen' ) ); $cs = '-' . $cn . '-';
					// skaičių grupės: „2-5-kg" sename gali būti „25-kg" naujame; „120-80" gali būti „120-x-80" — tinka ir kai visi grupės skaičiai yra atskirai
					$ok = true;
					foreach ( $sk as $g ) {
						$j = str_replace( '-', '', $g ); $dalys = explode( '-', $g ); $visi = true;
						foreach ( $dalys as $d ) { if ( ! in_array( $d, $ct, true ) ) { $visi = false; break; } }
						if ( false === strpos( $cs, '-' . $g . '-' ) && false === strpos( $cs, '-' . $j . '-' ) && ! $visi ) { $ok = false; break; }
					}
					if ( ! $ok ) { continue; }
					// žodžiai: tikslus arba 5 raidžių pradžia (purvui ~ purva-), ≥6 raidžių žodžiams
					$hit = 0;
					foreach ( $zo as $w ) {
						if ( in_array( $w, $ct, true ) ) { $hit++; continue; }
						if ( strlen( $w ) >= 6 ) { $pre = substr( $w, 0, 5 ); foreach ( $ct as $x ) { if ( strlen( $x ) >= 5 && substr( $x, 0, 5 ) === $pre ) { $hit += 0.85; break; } } } // pradžios atitikmuo silpnesnis už tikslų (suaugusiu ≠ suaugusioms)
					}
					$sc = $hit / count( $zo );
					// bauda už kandidato skaičius, kurių sename slug'e nėra (8-vnt pakuotė vs vienetas)
					$sen = implode( '-', $sk ); foreach ( $ct as $x ) { if ( preg_match( '/^\d+$/', $x ) && false === strpos( '-' . $sen . '-', '-' . $x . '-' ) && false === strpos( str_replace( '-', '', $sen ), $x ) ) { $sc -= 0.1; } }
					if ( $sc > $bs ) { $second = $bs; $bs = $sc; $best = $c; } elseif ( $sc > $second ) { $second = $sc; }
				}
				if ( $best && $bs >= 0.75 && $bs > $second ) { $url = get_permalink( (int) $best['ID'] ); $taisykle = 'artimiausias ' . round( $bs, 2 ); }
			}
		}
	}
	if ( ! $url ) { return; }
	if ( strtolower( trim( (string) parse_url( $url, PHP_URL_PATH ), '/' ) ) === $kelias ) { return; }

	$qs = (string) parse_url( $uri, PHP_URL_QUERY );
	if ( '' !== $qs ) { $url .= ( false === strpos( $url, '?' ) ? '?' : '&' ) . $qs; }

	ps404_log( $kelias, (string) parse_url( $url, PHP_URL_PATH ), $taisykle );
	remove_action( 'template_redirect', 'redirect_canonical' );
	wp_redirect( $url, 301, 'Petshop-404-Atitikmuo' );
	exit;
}, 2 );
