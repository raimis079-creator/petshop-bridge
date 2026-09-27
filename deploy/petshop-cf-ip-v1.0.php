<?php
/**
 * Plugin Name: Petshop CF IP v1.0 (tikras lankytojo IP už Cloudflare)
 * Version: 1.0
 *
 * S1724 (2026-09-27). Po Cloudflare proxy serveris (Apache/PHP) mato Cloudflare IP kaip
 * REMOTE_ADDR. Šis mu-plugin'as ANKSTI (mu-plugins krauna prieš visus plugin'us) perrašo
 * $_SERVER['REMOTE_ADDR'] iš antraštės CF-Connecting-IP, BET TIK kai REMOTE_ADDR priklauso
 * oficialiems Cloudflare diapazonams (kitaip antraštę galėtų suklastoti bet kas).
 * Naudotojai: botų sargas (IP žurnalas), WC užsakymų IP, ps_web_ivykiai, login sargas,
 * Complianz, WP Mail SMTP antraštės ir kt. Apache access log'ą tai NEKEIČIA (mod_remoteip
 * — serverio lygis, shared hostinge neprieinamas; log'e liks CF IP, tikras IP — antraštėje).
 *
 * Išjungti: wp-config.php `define('PS_CF_IP_ISJUNGTA', true);` (opcijų DB dar nėra šiame etape).
 * Diapazonai: https://www.cloudflare.com/ips/ (2026-09 būklė). Atnaujinti, jei Cloudflare praneš.
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'ps_cf_ip_apply' ) ) {
	function ps_cf_ip_cidr_match( $ip, $cidr ) {
		list( $sub, $bits ) = explode( '/', $cidr, 2 );
		$bits = (int) $bits;
		$ip_b  = @inet_pton( $ip );
		$sub_b = @inet_pton( $sub );
		if ( $ip_b === false || $sub_b === false || strlen( $ip_b ) !== strlen( $sub_b ) ) { return false; }
		$bytes = intdiv( $bits, 8 ); $rest = $bits % 8;
		if ( $bytes > 0 && substr( $ip_b, 0, $bytes ) !== substr( $sub_b, 0, $bytes ) ) { return false; }
		if ( $rest === 0 ) { return true; }
		$mask = ( 0xFF << ( 8 - $rest ) ) & 0xFF;
		return ( ord( $ip_b[ $bytes ] ) & $mask ) === ( ord( $sub_b[ $bytes ] ) & $mask );
	}

	function ps_cf_ip_apply() {
		if ( defined( 'PS_CF_IP_ISJUNGTA' ) && PS_CF_IP_ISJUNGTA ) { return; }
		if ( empty( $_SERVER['HTTP_CF_CONNECTING_IP'] ) || empty( $_SERVER['REMOTE_ADDR'] ) ) { return; }
		$cf = trim( (string) $_SERVER['HTTP_CF_CONNECTING_IP'] );
		if ( filter_var( $cf, FILTER_VALIDATE_IP ) === false ) { return; }
		$remote = (string) $_SERVER['REMOTE_ADDR'];
		$ranges = array(
			'173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18',
			'108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17',
			'162.158.0.0/15', '104.16.0.0/13', '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
			'2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32',
			'2a06:98c0::/29', '2c0f:f248::/32',
		);
		foreach ( $ranges as $r ) {
			if ( ps_cf_ip_cidr_match( $remote, $r ) ) {
				$_SERVER['PS_CF_EDGE_IP'] = $remote;
				$_SERVER['REMOTE_ADDR']   = $cf;
				return;
			}
		}
	}
	ps_cf_ip_apply();
}
