<?php
/**
 * Plugin Name: Petshop Ataskaita Lankomumas
 * Description: Lankomumo ekranas — lankytojai per dieną, valandą ir savaitės dieną, piltuvėlis, šaltiniai (Google Ads, Kainos.lt, Kaina24…), įrenginiai, įėjimo puslapiai, paieškos, 404.
 * Version: 1.0
 *
 * v1.0 (2026-09-10, S1669, Raimio prašymas „daryk"). Tik skaitymas.
 *
 * DUOMENYS. Lankomumas — `ps_web_ivykiai` (Petshop_Analitika, sluoksnis 0:
 * `lankytojas_d` be slapukų, dienos druska). „Lankytojas" = unikalus
 * lankytojas per dieną; laikotarpio suma = dienų sumų suma (kitą dieną tas pats
 * žmogus — naujas `lankytojas_d`, tai principas, ne klaida). Užsakymai —
 * `ps_fakt_uzsakymai` (serverio faktas, ne naršyklės `purchase`).
 * Žali įvykiai saugomi 90 d. — ekranas laikotarpį apkarpo iki turimų duomenų ir
 * tai parašo.
 *
 * LAIKAS. `diena` — Vilniaus verslo diena; valandos skaičiuojamos iš UTC
 * `laikas` per `wp_date()` (vasaros/žiemos laikas teisingas).
 *
 * ŠALTINIS. Lankytojo dienos šaltinis — pirmas įėjimo (`landing=1`) įvykis,
 * praleidžiant Paysera grįžimą. Užsakymo — `kanalas_paskutinis` + UTM/referer/
 * gclid. Abiem pusėms — ta pati `grupe()`.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Ataskaita_Lankomumas {
	const VERSIJA  = '1.0';
	const TEVAS    = 'petshop-reports';
	const PUSLAPIS = 'ps-lankomumas';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 20 );
		add_filter( 'petshop_ataskaitu_aprasai', function ( $a ) {
			$a[ self::PUSLAPIS ] = 'Kiek žmonių lankosi, kada, iš kur ir kur nukrenta: lankytojai per dieną ir valandą, piltuvėlis, šaltiniai (Ads, Kainos.lt, Kaina24), paieškos.';
			return $a;
		} );
	}

	public static function meniu() {
		add_submenu_page( self::TEVAS, 'Lankomumas', 'Lankomumas', 'manage_woocommerce', self::PUSLAPIS, array( __CLASS__, 'puslapis' ) );
	}

	private static function t( $k ) { global $wpdb; return $wpdb->prefix . $k; }
	private static function aplinka() { return method_exists( 'Petshop_Analitika', 'aplinka' ) ? Petshop_Analitika::aplinka() : 'prod'; }
	private static function n( $v ) { return number_format( (float) $v, 0, ',', ' ' ); }
	private static function p( $a, $b, $sk = 1 ) { return ( (float) $b > 0 ) ? number_format( 100 * $a / $b, $sk, ',', ' ' ) . ' %' : '—'; }

	/** Šaltinio grupė — ta pati lankytojams ir užsakymams. null = neskaičiuoti (Paysera grįžimas). */
	public static function grupe( $kanalas, $saltinis, $referer, $gclid = 0 ) {
		$s = strtolower( trim( (string) $saltinis . ' ' . (string) $referer ) );
		if ( false !== strpos( $s, 'paysera' ) ) { return null; }
		if ( false !== strpos( $s, 'kaina24' ) ) { return 'Kaina24'; }
		if ( false !== strpos( $s, 'kainos' ) ) { return 'Kainos.lt'; }
		if ( (int) $gclid === 1 || ( 'mokamas' === $kanalas && ( '' === $s || false !== strpos( $s, 'google' ) ) ) ) { return 'Google Ads'; }
		if ( false !== strpos( $s, 'google' ) ) { return 'Google paieška'; }
		if ( preg_match( '/facebook|instagram|fb\.|messenger/', $s ) ) { return 'Facebook / Instagram'; }
		if ( preg_match( '/chatgpt|openai|perplexity|claude|gemini|copilot/', $s ) ) { return 'AI asistentai'; }
		if ( preg_match( '/bing|duckduckgo|yahoo|yandex|ecosia/', $s ) ) { return 'Kitos paieškos'; }
		if ( preg_match( '/mail|gmail|outlook|sender|newsletter|email/', $s ) ) { return 'El. paštas'; }
		if ( '' === $s ) { return 'Tiesiogiai'; }
		$d = trim( (string) ( $referer ? $referer : $saltinis ) );
		return preg_replace( '/^www\./', '', $d );
	}

	/** Turimų žalių duomenų pradžia (diena). */
	private static function duomenu_pradzia() {
		global $wpdb;
		return (string) $wpdb->get_var( $wpdb->prepare( 'SELECT MIN(diena) FROM ' . self::t( 'ps_web_ivykiai' ) . ' WHERE saltinis_aplinka=%s AND testinis=0', self::aplinka() ) );
	}

	/** Pagrindiniai skaičiai laikotarpiui (KPI ir palyginimui). */
	public static function kpi( $nuo, $iki ) {
		global $wpdb;
		$i = self::t( 'ps_web_ivykiai' );
		$r = $wpdb->get_row( $wpdb->prepare(
			"SELECT COUNT(DISTINCT diena, lankytojas_d) lank,
			        COUNT(DISTINCT sesija) ses,
			        SUM(tipas='pageview') perz,
			        COUNT(DISTINCT IF(irenginys='mobile', CONCAT(diena, lankytojas_d), NULL)) mob,
			        COUNT(DISTINCT IF(sutikimas=1, CONCAT(diena, lankytojas_d), NULL)) sut,
			        COUNT(DISTINCT IF(tipas='view_item', CONCAT(diena, lankytojas_d), NULL)) vi,
			        COUNT(DISTINCT IF(tipas='add_to_cart', CONCAT(diena, lankytojas_d), NULL)) atc,
			        COUNT(DISTINCT IF(tipas='begin_checkout', CONCAT(diena, lankytojas_d), NULL)) bc
			 FROM $i WHERE diena BETWEEN %s AND %s AND saltinis_aplinka=%s AND testinis=0",
			$nuo, $iki, self::aplinka() ), ARRAY_A );
		$u = self::uzsakymai( $nuo, $iki );
		$r['uzs'] = count( $u );
		$r['paj'] = array_sum( array_column( $u, 'paj' ) );
		return $r;
	}

	/** Apmokėti, realūs užsakymai laikotarpyje (Vilniaus dienomis). */
	public static function uzsakymai( $nuo, $iki ) {
		global $wpdb;
		$tz  = wp_timezone();
		$utc = new DateTimeZone( 'UTC' );
		$a = ( new DateTime( $nuo . ' 00:00:00', $tz ) )->setTimezone( $utc )->format( 'Y-m-d H:i:s' );
		$b = ( new DateTime( $iki . ' 00:00:00', $tz ) )->modify( '+1 day' )->setTimezone( $utc )->format( 'Y-m-d H:i:s' );
		$eil = $wpdb->get_results( $wpdb->prepare(
			'SELECT uzsakymas_id, kanalas_paskutinis k, utm_source s, referer_domenas r, gclid g, irenginys ir, (viso_ct - pvm_ct) paj
			 FROM ' . self::t( 'ps_fakt_uzsakymai' ) . "
			 WHERE apmoketa_at >= %s AND apmoketa_at < %s AND testinis = 0
			   AND ( statusas_galutinis IS NULL OR statusas_galutinis NOT IN ('cancelled','refunded','failed') )",
			$a, $b ), ARRAY_A );
		return is_array( $eil ) ? $eil : array();
	}

	public static function puslapis() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Neturite teisių.' ); }
		global $wpdb;
		$UI = 'Petshop_Ataskaitu_UI';
		$i  = self::t( 'ps_web_ivykiai' );
		$ap = self::aplinka();

		$UI::antraste( 'Lankomumas', 'Kiek žmonių lankosi, kada, iš kur ateina ir kur nukrenta. Lankytojai skaičiuojami be slapukų, todėl matomi visi, ne tik sutikę.', 'faktai' );
		$lt = $UI::laikotarpis();
		$UI::juosta( self::PUSLAPIS, $lt );

		$pr = self::duomenu_pradzia();
		if ( ! $pr ) { $UI::tuscia( 'Lankomumo duomenų dar nėra.' ); $UI::pabaiga(); return; }
		$nuo = max( $lt['nuo'], $pr );
		$iki = min( $lt['iki'], current_time( 'Y-m-d' ) );
		if ( $nuo > $iki ) { $UI::tuscia( 'Šiuo laikotarpiu lankomumo duomenų nėra.', 'Duomenys renkami nuo ' . esc_html( $pr ) . '.' ); $UI::pabaiga(); return; }
		$dienu = max( 1, (int) round( ( strtotime( $iki ) - strtotime( $nuo ) ) / DAY_IN_SECONDS ) + 1 );
		if ( $nuo !== $lt['nuo'] ) {
			echo '<p class="psru-pastaba">Rodoma nuo <b>' . esc_html( $nuo ) . '</b> — anksčiau lankomumo duomenų nėra (renkami nuo ' . esc_html( $pr ) . ', žali įvykiai saugomi 90 d.).</p>';
		}

		/* ---------- KPI ---------- */
		$k = self::kpi( $nuo, $iki );
		$b = null;
		if ( $lt['lyginam'] && $lt['pries_iki'] >= $pr ) { $b = self::kpi( max( $lt['pries_nuo'], $pr ), $lt['pries_iki'] ); }
		$d = function ( $kl ) use ( $k, $b ) { return $b ? array( 'dabar' => (float) $k[ $kl ], 'buvo' => (float) $b[ $kl ] ) : null; };
		$konv   = $k['lank'] > 0 ? 100 * $k['uzs'] / $k['lank'] : 0;
		$konv_b = ( $b && $b['lank'] > 0 ) ? 100 * $b['uzs'] / $b['lank'] : 0;
		$UI::kpi_juosta( array(
			array( 'antraste' => 'Lankytojai', 'reiksme' => self::n( $k['lank'] ), 'delta' => $d( 'lank' ), 'tooltip' => 'Unikalūs lankytojai per dieną, sudėti per laikotarpį. Be slapukų — matomi visi.' ),
			array( 'antraste' => 'Vid. per dieną', 'reiksme' => self::n( $k['lank'] / $dienu ), 'tooltip' => 'Lankytojai ÷ ' . $dienu . ' d.' ),
			array( 'antraste' => 'Užsakymai', 'reiksme' => self::n( $k['uzs'] ), 'delta' => $d( 'uzs' ), 'tooltip' => 'Apmokėti realūs užsakymai (serverio faktas).' ),
			array( 'antraste' => 'Konversija', 'reiksme' => $k['lank'] > 0 ? number_format( $konv, 2, ',', ' ' ) . ' %' : '—', 'delta' => $b ? array( 'dabar' => $konv, 'buvo' => $konv_b, 'pp' => true ) : null, 'tooltip' => 'Užsakymai ÷ lankytojai.' ),
		), array(
			'Apsilankymai'          => self::n( $k['ses'] ),
			'Puslapių peržiūros'    => self::n( $k['perz'] ),
			'Peržiūrų / lankytojui' => $k['lank'] > 0 ? number_format( $k['perz'] / $k['lank'], 1, ',', ' ' ) : '—',
			'Mobilūs'               => self::p( $k['mob'], $k['lank'], 0 ),
			'Sutiko su slapukais'   => self::p( $k['sut'], $k['lank'], 0 ),
			'Pajamos be PVM'        => $UI::eur( (int) $k['paj'] ),
		) );
		if ( $k['lank'] < 500 ) {
			echo '<p class="psru-pastaba">Maža imtis (' . esc_html( self::n( $k['lank'] ) ) . ' lankytojų) — procentai ir šaltinių palyginimai kol kas orientaciniai.</p>';
		}

		/* ---------- Dienos ---------- */
		$dien = $wpdb->get_results( $wpdb->prepare(
			"SELECT diena, COUNT(DISTINCT lankytojas_d) l FROM $i WHERE diena BETWEEN %s AND %s AND saltinis_aplinka=%s AND testinis=0 GROUP BY diena", $nuo, $iki, $ap ), ARRAY_A );
		$per_diena = array();
		for ( $t = strtotime( $nuo ); $t <= strtotime( $iki ); $t += DAY_IN_SECONDS ) { $per_diena[ gmdate( 'Y-m-d', $t ) ] = 0; }
		foreach ( $dien as $r ) { $per_diena[ $r['diena'] ] = (int) $r['l']; }
		$uzs_diena = array_fill_keys( array_keys( $per_diena ), 0 );
		foreach ( self::uzs_pagal_diena( $nuo, $iki ) as $dd => $c ) { if ( isset( $uzs_diena[ $dd ] ) ) { $uzs_diena[ $dd ] = $c; } }
		$etiketes = array();
		foreach ( array_keys( $per_diena ) as $dd ) { $etiketes[] = wp_date( 'm-d', strtotime( $dd . ' 12:00:00' ) ); }
		self::stulpeliai( 'Lankytojai per dieną', array_values( $per_diena ), $etiketes, array_values( $uzs_diena ) );

		/* ---------- Valandos ir savaitės dienos ---------- */
		$val = array_fill( 0, 24, 0 );
		$hr  = $wpdb->get_results( $wpdb->prepare(
			"SELECT DATE_FORMAT(laikas, '%%Y-%%m-%%d %%H:00:00') h, COUNT(DISTINCT lankytojas_d) l FROM $i WHERE diena BETWEEN %s AND %s AND saltinis_aplinka=%s AND testinis=0 GROUP BY h", $nuo, $iki, $ap ), ARRAY_A );
		foreach ( $hr as $r ) { $val[ (int) wp_date( 'G', strtotime( $r['h'] . ' UTC' ) ) ] += (int) $r['l']; }
		$val_vid = array_map( function ( $v ) use ( $dienu ) { return round( $v / $dienu, 1 ); }, $val );
		$sd_pav = array( 1 => 'Pr', 2 => 'An', 3 => 'Tr', 4 => 'Kt', 5 => 'Pn', 6 => 'Št', 7 => 'Sk' );
		$sd = array_fill( 1, 7, 0 ); $sd_n = array_fill( 1, 7, 0 );
		foreach ( $per_diena as $dd => $l ) { $w = (int) gmdate( 'N', strtotime( $dd ) ); $sd[ $w ] += $l; $sd_n[ $w ]++; }
		$sd_vid = array(); foreach ( $sd as $w => $v ) { $sd_vid[] = $sd_n[ $w ] ? round( $v / $sd_n[ $w ], 1 ) : 0; }
		echo '<div style="display:grid;grid-template-columns:3fr 2fr;gap:14px">';
		echo '<div>'; self::stulpeliai( 'Kada lankosi — vid. lankytojų per valandą (Lietuvos laiku)', $val_vid, array_map( function ( $h ) { return (string) $h; }, range( 0, 23 ) ) ); echo '</div>';
		echo '<div>'; self::stulpeliai( 'Savaitės dienos — vid. lankytojų', $sd_vid, array_values( $sd_pav ) ); echo '</div>';
		echo '</div>';

		/* ---------- Piltuvėlis ---------- */
		echo '<h2>Piltuvėlis — kur nukrenta</h2>';
		$UI::piltuvelis( array(
			array( 'pav' => 'Lankytojai', 'sk' => (int) $k['lank'] ),
			array( 'pav' => 'Peržiūrėjo prekę', 'sk' => (int) $k['vi'] ),
			array( 'pav' => 'Įdėjo į krepšelį', 'sk' => (int) $k['atc'] ),
			array( 'pav' => 'Pradėjo apmokėjimą', 'sk' => (int) $k['bc'] ),
			array( 'pav' => 'Apmokėjo', 'sk' => (int) $k['uzs'] ),
		) );
		echo '<p class="psru-pastaba">Kiekviename žingsnyje — lankytojai (per dieną), bent kartą atlikę veiksmą. „Apmokėjo" — serverio užsakymų faktas.</p>';

		/* ---------- Šaltiniai ---------- */
		echo '<h2>Iš kur ateina</h2>';
		$sal = self::saltiniai( $nuo, $iki );
		$eil = array(); $viso_l = max( 1, array_sum( array_column( $sal, 'l' ) ) );
		foreach ( $sal as $g => $x ) {
			$eil[] = array( '<b>' . esc_html( $g ) . '</b>', self::n( $x['l'] ), $UI::juostele( self::p( $x['l'], $viso_l, 0 ), 100 * $x['l'] / $viso_l ),
				self::n( $x['atc'] ), self::n( $x['bc'] ), self::n( $x['uzs'] ), $x['l'] > 0 ? self::p( $x['uzs'], $x['l'], 2 ) : '—', $UI::eur( (int) $x['paj'] ) );
		}
		$UI::lentele( 'ps-lank-sal', array(
			array( 'pav' => 'Šaltinis', 'kaire' => true ), array( 'pav' => 'Lankytojai' ), array( 'pav' => 'Dalis' ),
			array( 'pav' => 'Į krepšelį' ), array( 'pav' => 'Apmokėjimas', 'tt' => 'Pradėjo apmokėjimą' ), array( 'pav' => 'Užsakymai', 'tt' => 'Pagal paskutinį kanalą prieš pirkimą' ),
			array( 'pav' => 'Konversija' ), array( 'pav' => 'Pajamos be PVM' ),
		), $eil, array( 'rikiuoti' => 1, 'failas' => 'lankomumas-saltiniai.csv', 'paieska' => false ) );
		echo '<p class="psru-pastaba">Lankytojo šaltinis — pirmas įėjimas tą dieną (Paysera grįžimas praleidžiamas). Užsakymo — paskutinis kanalas prieš pirkimą. Todėl konversija pagal šaltinį orientacinė.</p>';

		/* ---------- Įrenginiai ---------- */
		$ir = $wpdb->get_results( $wpdb->prepare(
			"SELECT COALESCE(NULLIF(irenginys,''),'nežinomas') ir, COUNT(DISTINCT diena, lankytojas_d) l,
			        COUNT(DISTINCT IF(tipas='add_to_cart', CONCAT(diena, lankytojas_d), NULL)) atc
			 FROM $i WHERE diena BETWEEN %s AND %s AND saltinis_aplinka=%s AND testinis=0 GROUP BY ir ORDER BY l DESC", $nuo, $iki, $ap ), ARRAY_A );
		$uz_ir = array(); foreach ( self::uzsakymai( $nuo, $iki ) as $u ) { $key = $u['ir'] ? $u['ir'] : 'nežinomas'; $uz_ir[ $key ] = ( $uz_ir[ $key ] ?? 0 ) + 1; }
		$ir_pav = array( 'mobile' => 'Telefonas', 'desktop' => 'Kompiuteris', 'tablet' => 'Tabletė' );
		$eil = array();
		foreach ( $ir as $r ) {
			$uz = $uz_ir[ $r['ir'] ] ?? 0;
			$eil[] = array( esc_html( $ir_pav[ $r['ir'] ] ?? $r['ir'] ), self::n( $r['l'] ), self::p( $r['l'], $k['lank'], 0 ), self::n( $r['atc'] ), self::n( $uz ), self::p( $uz, $r['l'], 2 ) );
		}

		/* ---------- Įėjimo puslapiai, paieškos, 404 ---------- */
		$lp = $wpdb->get_results( $wpdb->prepare(
			"SELECT url_kelias u, COUNT(DISTINCT diena, lankytojas_d) l FROM $i WHERE diena BETWEEN %s AND %s AND saltinis_aplinka=%s AND testinis=0 AND landing=1 AND tipas='pageview' GROUP BY u ORDER BY l DESC LIMIT 20", $nuo, $iki, $ap ), ARRAY_A );
		$ps = $wpdb->get_results( $wpdb->prepare(
			"SELECT LOWER(TRIM(raktas)) q, COUNT(*) c, COUNT(DISTINCT diena, lankytojas_d) l, MAX(reiksme) rez FROM $i WHERE diena BETWEEN %s AND %s AND saltinis_aplinka=%s AND testinis=0 AND tipas='search' AND raktas<>'' GROUP BY q ORDER BY c DESC LIMIT 20", $nuo, $iki, $ap ), ARRAY_A );
		$e4 = $wpdb->get_results( $wpdb->prepare(
			"SELECT url_kelias u, COUNT(*) c FROM $i WHERE diena BETWEEN %s AND %s AND saltinis_aplinka=%s AND testinis=0 AND tipas='error404' GROUP BY u ORDER BY c DESC LIMIT 15", $nuo, $iki, $ap ), ARRAY_A );

		echo '<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">';
		echo '<div><h2>Įrenginiai</h2>';
		$UI::lentele( 'ps-lank-ir', array( array( 'pav' => 'Įrenginys', 'kaire' => true ), array( 'pav' => 'Lankytojai' ), array( 'pav' => 'Dalis' ), array( 'pav' => 'Į krepšelį' ), array( 'pav' => 'Užsakymai' ), array( 'pav' => 'Konversija' ) ), $eil, array( 'paieska' => false, 'csv' => false ) );
		echo '<h2>Paieškos svetainėje</h2>';
		$eil = array(); foreach ( $ps as $r ) { $eil[] = array( esc_html( $r['q'] ), self::n( $r['c'] ), self::n( $r['l'] ) ); }
		$UI::lentele( 'ps-lank-pai', array( array( 'pav' => 'Paieška', 'kaire' => true ), array( 'pav' => 'Kartai' ), array( 'pav' => 'Lankytojai' ) ), $eil, array( 'rikiuoti' => 1, 'failas' => 'lankomumas-paieskos.csv' ) );
		echo '</div><div><h2>Įėjimo puslapiai</h2>';
		$eil = array(); foreach ( $lp as $r ) { $u = (string) $r['u']; $eil[] = array( '<a href="' . esc_url( home_url( $u ) ) . '" target="_blank" rel="noopener">' . esc_html( $u === '' ? '/' : $u ) . '</a>', self::n( $r['l'] ), self::p( $r['l'], $k['lank'], 1 ) ); }
		$UI::lentele( 'ps-lank-lp', array( array( 'pav' => 'Puslapis', 'kaire' => true ), array( 'pav' => 'Lankytojai' ), array( 'pav' => 'Dalis' ) ), $eil, array( 'rikiuoti' => 1, 'failas' => 'lankomumas-iejimai.csv' ) );
		echo '<h2>Nerasti puslapiai (404)</h2>';
		$eil = array(); foreach ( $e4 as $r ) { $eil[] = array( esc_html( (string) $r['u'] ), self::n( $r['c'] ) ); }
		$UI::lentele( 'ps-lank-404', array( array( 'pav' => 'Adresas', 'kaire' => true ), array( 'pav' => 'Kartai' ) ), $eil, array( 'rikiuoti' => 1, 'failas' => 'lankomumas-404.csv', 'paieska' => false ) );
		echo '</div></div>';

		$UI::pabaiga();
	}

	/** Užsakymai per Vilniaus dieną. */
	private static function uzs_pagal_diena( $nuo, $iki ) {
		global $wpdb;
		$tz = wp_timezone(); $utc = new DateTimeZone( 'UTC' );
		$a = ( new DateTime( $nuo . ' 00:00:00', $tz ) )->setTimezone( $utc )->format( 'Y-m-d H:i:s' );
		$b = ( new DateTime( $iki . ' 00:00:00', $tz ) )->modify( '+1 day' )->setTimezone( $utc )->format( 'Y-m-d H:i:s' );
		$eil = $wpdb->get_col( $wpdb->prepare(
			'SELECT apmoketa_at FROM ' . self::t( 'ps_fakt_uzsakymai' ) . "
			 WHERE apmoketa_at >= %s AND apmoketa_at < %s AND testinis = 0
			   AND ( statusas_galutinis IS NULL OR statusas_galutinis NOT IN ('cancelled','refunded','failed') )", $a, $b ) );
		$o = array();
		foreach ( (array) $eil as $at ) { $dd = wp_date( 'Y-m-d', strtotime( $at . ' UTC' ) ); $o[ $dd ] = ( $o[ $dd ] ?? 0 ) + 1; }
		return $o;
	}

	/** Šaltinių suvestinė: lankytojai + krepšelis + apmokėjimas iš įvykių, užsakymai ir pajamos iš faktų. */
	public static function saltiniai( $nuo, $iki ) {
		global $wpdb;
		$i  = self::t( 'ps_web_ivykiai' );
		$ap = self::aplinka();
		$lank = array();
		$eil = $wpdb->get_results( $wpdb->prepare(
			"SELECT diena, lankytojas_d v, kanalas, saltinis, referer_domenas r FROM $i
			 WHERE diena BETWEEN %s AND %s AND saltinis_aplinka=%s AND testinis=0 AND landing=1 ORDER BY laikas", $nuo, $iki, $ap ), ARRAY_A );
		foreach ( (array) $eil as $r ) {
			$key = $r['diena'] . '|' . $r['v'];
			if ( isset( $lank[ $key ] ) ) { continue; }
			$g = self::grupe( $r['kanalas'], $r['saltinis'], $r['r'] );
			if ( null === $g ) { continue; }
			$lank[ $key ] = $g;
		}
		$zingsn = $wpdb->get_results( $wpdb->prepare(
			"SELECT diena, lankytojas_d v, MAX(tipas='add_to_cart') atc, MAX(tipas='begin_checkout') bc FROM $i
			 WHERE diena BETWEEN %s AND %s AND saltinis_aplinka=%s AND testinis=0 GROUP BY diena, lankytojas_d", $nuo, $iki, $ap ), ARRAY_A );
		$o = array();
		$nulis = array( 'l' => 0, 'atc' => 0, 'bc' => 0, 'uzs' => 0, 'paj' => 0 );
		foreach ( (array) $zingsn as $r ) {
			$key = $r['diena'] . '|' . $r['v'];
			$g = $lank[ $key ] ?? 'Tiesiogiai';
			if ( ! isset( $o[ $g ] ) ) { $o[ $g ] = $nulis; }
			$o[ $g ]['l']++;
			$o[ $g ]['atc'] += (int) $r['atc'];
			$o[ $g ]['bc']  += (int) $r['bc'];
		}
		foreach ( self::uzsakymai( $nuo, $iki ) as $u ) {
			$g = self::grupe( $u['k'], $u['s'], $u['r'], $u['g'] );
			if ( null === $g ) { $g = 'Tiesiogiai'; }
			if ( ! isset( $o[ $g ] ) ) { $o[ $g ] = $nulis; }
			$o[ $g ]['uzs']++;
			$o[ $g ]['paj'] += (int) $u['paj'];
		}
		uasort( $o, function ( $a, $b ) { return $b['l'] <=> $a['l']; } );
		return $o;
	}

	/** Paprasta stulpelinė diagrama (SVG). $antros — antra seka (užsakymai) taškais virš stulpelių. */
	private static function stulpeliai( $antraste, $reiksmes, $etiketes, $antros = array() ) {
		$n = count( $reiksmes );
		if ( $n < 1 ) { return; }
		$max = max( 1, max( $reiksmes ) );
		$W = 1080; $H = 170; $apac = 18; $pl = $W / $n; $sw = max( 2, $pl * 0.7 );
		$kas = max( 1, (int) ceil( $n / 16 ) );
		echo '<div class="psru-diagrama"><div class="psru-galva"><b>' . esc_html( $antraste ) . '</b>';
		if ( $antros ) { echo '<div class="psru-legenda"><span><i style="background:#2271b1"></i>Lankytojai</span><span><i style="background:#00794b"></i>Užsakymai</span></div>'; }
		echo '</div><svg width="100%" height="' . ( $H + $apac ) . '" viewBox="0 0 ' . $W . ' ' . ( $H + $apac ) . '" preserveAspectRatio="none" style="overflow:visible">';
		echo '<text x="2" y="10" font-size="10" fill="#787c82">' . esc_html( self::n( $max ) ) . '</text>';
		foreach ( array_values( $reiksmes ) as $j => $v ) {
			$h = ( $v / $max ) * ( $H - 22 );
			$x = $j * $pl + ( $pl - $sw ) / 2;
			echo '<rect x="' . round( $x, 1 ) . '" y="' . round( $H - $h, 1 ) . '" width="' . round( $sw, 1 ) . '" height="' . round( $h, 1 ) . '" fill="#2271b1" rx="1.5"><title>' . esc_html( $etiketes[ $j ] . ': ' . str_replace( '.', ',', (string) $v ) ) . ( isset( $antros[ $j ] ) ? ' · užsakymai ' . (int) $antros[ $j ] : '' ) . '</title></rect>';
			if ( ! empty( $antros[ $j ] ) ) {
				echo '<text x="' . round( $j * $pl + $pl / 2, 1 ) . '" y="' . round( $H - $h - 4, 1 ) . '" font-size="10" text-anchor="middle" fill="#00794b" font-weight="600">' . (int) $antros[ $j ] . '</text>';
			}
			if ( 0 === $j % $kas ) {
				echo '<text x="' . round( $j * $pl + $pl / 2, 1 ) . '" y="' . ( $H + 13 ) . '" font-size="10" text-anchor="middle" fill="#787c82">' . esc_html( $etiketes[ $j ] ) . '</text>';
			}
		}
		echo '</svg></div>';
	}
}
Petshop_Ataskaita_Lankomumas::init();
