<?php
/**
 * Plugin Name: Petshop AV manifestas (paėmimo diena)
 * Description: AV sandėlio Venipak siuntos po 15:00, savaitgalį ir švenčių dienomis registruojamos į KITOS DARBO DIENOS manifestą.
 * Version: 1.0
 *
 * v1.0 (2026-09-23, S1709, Raimis: „sandėlys AV užsidaro 15:00, nuo 15:00 jau kita diena; penktadienį nuo 15:00 — į pirmadienį;
 * šventės neįskaitomos — užsakymai persikelia į sekančią darbo dieną“).
 *
 * KODĖL: wc-venipak-shipping (admin-dispatch.php) manifesto pavadinimą sudaro `kliento ID + date('ymd') + kodas` (AV = 001,
 * Petshop_Desk::MANIFESTAI). Kurjeris AV siuntas paima ~11 val. ir Venipak manifestą uždaro, o vėliau tą pačią dieną registruotos
 * siuntos krito į tą patį jau uždarytą manifestą (#1147 / 36146, 09-23 20:55 → 07267260923001).
 *
 * KAIP: plugino failų neliečiam (kaip petshop-venipak-docno.php):
 *   1) `http_request_args` — užklausoje į go.venipak.lt/import/send.php XML `<manifest title="{uid}{yymmdd}001">` data keičiama į
 *      paėmimo dieną (tik AV kodas 001; tiekėjų 002…007 — neliečiami);
 *   2) `woocommerce_before_order_object_save` — tik registracijos užklausoje (darbalaukio `ps_desk_veiksmas` v=vp_reg / vp_bulk)
 *      užsakymo `venipak_shipping_order_data.manifest` pataisomas tuo pačiu keliu, kad lipdukai, „Kurjerio sąrašas“ ir `_ps_siuntos`
 *      rodytų tikrą manifestą.
 * Paėmimo diena: dabar (Europe/Vilnius) iki 15:00 darbo dieną → šiandien; kitaip → kita darbo diena (be šeštadienių, sekmadienių ir
 * LR švenčių, įskaitant Velykų pirmadienį). Išjungti: opcija `ps_av_manifestas_isjungta` = 1. Žurnalas: opcija `ps_av_manifestas_log` (50).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

final class Petshop_AV_Manifestas {

	const KODAS    = '001';   // Petshop_Desk::MANIFESTAI['av']
	const RIBA_VAL = 15;      // nuo 15:00 — kita diena

	public static function init() {
		if ( get_option( 'ps_av_manifestas_isjungta' ) ) { return; }
		add_filter( 'http_request_args', array( __CLASS__, 'uzklausa' ), 20, 2 );
		add_action( 'woocommerce_before_order_object_save', array( __CLASS__, 'uzsakymas' ), 5, 1 );
	}

	/** Paėmimo diena 'ymd' pagal dabartinį laiką (arba nurodytą, testams). */
	public static function diena( $dabar = null ) {
		$tz = new DateTimeZone( 'Europe/Vilnius' );
		$d  = $dabar instanceof DateTimeInterface ? DateTime::createFromInterface( $dabar )->setTimezone( $tz ) : new DateTime( 'now', $tz );
		$poriba = (int) $d->format( 'G' ) >= self::RIBA_VAL;
		$d->setTime( 12, 0 );
		if ( $poriba || ! self::darbo_diena( $d ) ) {
			do { $d->modify( '+1 day' ); } while ( ! self::darbo_diena( $d ) );
		}
		return $d->format( 'ymd' );
	}

	public static function darbo_diena( DateTimeInterface $d ) {
		if ( (int) $d->format( 'N' ) >= 6 ) { return false; }
		$md = $d->format( 'm-d' );
		if ( in_array( $md, array( '01-01', '02-16', '03-11', '05-01', '06-24', '07-06', '08-15', '11-01', '11-02', '12-24', '12-25', '12-26' ), true ) ) { return false; }
		$v = self::velykos( (int) $d->format( 'Y' ) ); $v->modify( '+1 day' ); // Velykų antroji diena
		return $v->format( 'm-d' ) !== $md;
	}

	/** Velykų sekmadienis (Gregorian, anonimo algoritmas). */
	public static function velykos( $y ) {
		$a = $y % 19; $b = intdiv( $y, 100 ); $c = $y % 100; $d = intdiv( $b, 4 ); $e = $b % 4; $f = intdiv( $b + 8, 25 );
		$g = intdiv( $b - $f + 1, 3 ); $h = ( 19 * $a + $b - $d - $g + 15 ) % 30; $i = intdiv( $c, 4 ); $k = $c % 4;
		$l = ( 32 + 2 * $e + 2 * $i - $h - $k ) % 7; $m = intdiv( $a + 11 * $h + 22 * $l, 451 );
		$men = intdiv( $h + $l - 7 * $m + 114, 31 ); $die = ( ( $h + $l - 7 * $m + 114 ) % 31 ) + 1;
		return new DateTime( sprintf( '%04d-%02d-%02d 12:00', $y, $men, $die ), new DateTimeZone( 'Europe/Vilnius' ) );
	}

	protected static function uid() {
		$n = get_option( 'shopup_venipak_shipping_settings' );
		return is_array( $n ) ? preg_replace( '/\D/', '', (string) ( $n['shopup_venipak_shipping_field_userid'] ?? '' ) ) : '';
	}

	/** Perrašo AV manifesto datą eilutėje; grąžina [nauja eilutė, senas, naujas] arba null. */
	protected static function perrasyti( $s ) {
		$uid = self::uid(); if ( '' === $uid ) { return null; }
		$t = self::diena(); $senas = null; $naujas = null;
		$r = preg_replace_callback( '#(' . preg_quote( $uid, '#' ) . ')(\d{6})(' . self::KODAS . ')(?!\d)#', function ( $m ) use ( $t, &$senas, &$naujas ) {
			if ( $m[2] === $t ) { return $m[0]; }
			$senas = $m[0]; $naujas = $m[1] . $t . $m[3]; return $naujas;
		}, (string) $s );
		return ( $senas && is_string( $r ) ) ? array( $r, $senas, $naujas ) : null;
	}

	public static function uzklausa( $args, $url ) {
		if ( false === strpos( (string) $url, 'go.venipak.lt/import/send.php' ) ) { return $args; }
		if ( empty( $args['body'] ) || ! is_array( $args['body'] ) || empty( $args['body']['xml_text'] ) || ! is_string( $args['body']['xml_text'] ) ) { return $args; }
		try {
			$xml = $args['body']['xml_text']; $log = array( '', '' );
			$nauja = preg_replace_callback( '#<manifest\s+title="([^"]*)"#', function ( $m ) use ( &$log ) {
				$p = self::perrasyti( $m[1] ); if ( ! $p ) { return $m[0]; }
				$log = array( $p[1], $p[2] ); return '<manifest title="' . $p[0] . '"';
			}, $xml );
			if ( is_string( $nauja ) && $nauja !== $xml ) { $args['body']['xml_text'] = $nauja; self::zurnalas( 'xml', $log[0], $log[1] ); }
		} catch ( Throwable $e ) { error_log( '[petshop-av-manifestas] ' . $e->getMessage() ); }
		return $args;
	}

	/** Tik registracijos užklausoje: darbalaukio variklis `ps_desk_veiksmas` v=vp_reg / vp_bulk. */
	protected static function registracija() {
		$a = isset( $_REQUEST['action'] ) ? sanitize_key( wp_unslash( $_REQUEST['action'] ) ) : '';
		$v = isset( $_REQUEST['v'] ) ? sanitize_key( wp_unslash( $_REQUEST['v'] ) ) : '';
		return 'ps_desk_veiksmas' === $a && in_array( $v, array( 'vp_reg', 'vp_bulk' ), true );
	}

	public static function uzsakymas( $o ) {
		if ( ! $o instanceof WC_Order || ! self::registracija() ) { return; }
		try {
			$raw = $o->get_meta( 'venipak_shipping_order_data' ); if ( ! $raw ) { return; }
			$d = is_array( $raw ) ? $raw : json_decode( (string) $raw, true );
			if ( ! is_array( $d ) || empty( $d['manifest'] ) ) { return; }
			$p = self::perrasyti( $d['manifest'] ); if ( ! $p ) { return; }
			$d['manifest'] = $p[0];
			$o->update_meta_data( 'venipak_shipping_order_data', wp_json_encode( $d ) );
			self::zurnalas( 'uzs#' . $o->get_id(), $p[1], $p[2] );
		} catch ( Throwable $e ) { error_log( '[petshop-av-manifestas] ' . $e->getMessage() ); }
	}

	protected static function zurnalas( $kur, $senas, $naujas ) {
		$l = get_option( 'ps_av_manifestas_log', array() ); if ( ! is_array( $l ) ) { $l = array(); }
		array_unshift( $l, array( 'l' => current_time( 'mysql' ), 'k' => $kur, 's' => $senas, 'n' => $naujas ) );
		update_option( 'ps_av_manifestas_log', array_slice( $l, 0, 50 ), false );
	}
}
Petshop_AV_Manifestas::init();
