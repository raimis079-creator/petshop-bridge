<?php
/**
 * Petshop VF Feed v1.0 (lokalus failas WP All Import'ui + cache snippet'ui)
 *
 * PRIEŽASTIS (S1591, 2026-09-02): po R191→R192 (svetainė perkelta į
 * petshop.lt/public_html, dev.avesa.lt liko tik router'is) URL
 * https://dev.avesa.lt/wp-content/petshop-xml-vf-fetcher.php grąžina 404.
 * Import #5 (VF katalogas) negyvas nuo 2026-08-22, Import #7 (VF likučiai)
 * nuo 2026-08-27, `uploads/petshop-vf-cache.xml` sustingęs 2026-08-21 12:16 —
 * snippet 565 „VF Sync" kas valandą rašė 12 d. senus likučius.
 *
 * SPRENDIMAS: VF API → lokalus failas `uploads/wpallimport/files/vf-feed.xml`
 * (pmxi #5/#7 type=file, kaip Import #1) + tas pats turinys į
 * `uploads/petshop-vf-cache.xml` (snippet 565). Jokios priklausomybės nuo
 * hosto — veikia ir prieš, ir po T-0.
 *
 * KREDENCIALAI neduplikuojami: skaitomi iš esamo
 * `wp-content/petshop-xml-vf-fetcher.php` (const VF_USERNAME/VF_PASSWORD/
 * VF_API_URL/FETCHER_SECRET_KEY). Šis failas eina į bridge repo — slaptažodžio
 * jame NĖRA (pamoka #21).
 *
 * SAUGIKLIAI: rašoma tik jei XML validus, root <data>, eilučių ≥ 1000 ir
 * ≥ 50 % ankstesnio kiekio; rašymas atominis (tmp + rename). Klaidos — į
 * option `ps_vf_feed_paskutinis` ir petshop_xml_log().
 *
 * CRON: `petshop_vf_feed_hourly` kas valandą :05 (pmxi #7 trigger :15,
 * #5 06:30 UTC — gauna šviežią failą).
 *
 * RANKINIS: ?ps_vf_feed=refresh&k=<FETCHER_SECRET_KEY> | ?ps_vf_feed=status&k=...
 */
defined( 'ABSPATH' ) || exit;

final class Petshop_VF_Feed {

	const VERSIJA   = '1.0';
	const HOOK      = 'petshop_vf_feed_hourly';
	const OPT       = 'ps_vf_feed_paskutinis';
	const MIN_EIL   = 1000;

	public static function init(): void {
		add_action( self::HOOK, [ __CLASS__, 'atnaujinti' ] );
		add_action( 'init', [ __CLASS__, 'registruoti_cron' ] );
		add_action( 'init', [ __CLASS__, 'http' ], 4 );
	}

	public static function failas(): string {
		return WP_CONTENT_DIR . '/uploads/wpallimport/files/vf-feed.xml';
	}

	public static function cache(): string {
		return WP_CONTENT_DIR . '/uploads/petshop-vf-cache.xml';
	}

	/** Kredencialai iš esamo fetcher failo (neduplikuojami). */
	public static function cfg(): array {
		$f = WP_CONTENT_DIR . '/petshop-xml-vf-fetcher.php';
		$out = [ 'user' => '', 'pass' => '', 'url' => '', 'key' => '' ];
		if ( ! is_readable( $f ) ) return $out;
		$c = (string) file_get_contents( $f );
		$map = [ 'user' => 'VF_USERNAME', 'pass' => 'VF_PASSWORD', 'url' => 'VF_API_URL', 'key' => 'FETCHER_SECRET_KEY' ];
		foreach ( $map as $k => $const ) {
			if ( preg_match( "/const\s+{$const}\s*=\s*'([^']*)'/", $c, $m ) ) $out[ $k ] = $m[1];
		}
		return $out;
	}

	public static function registruoti_cron(): void {
		if ( wp_next_scheduled( self::HOOK ) ) return;
		$kita = strtotime( date( 'Y-m-d H:05:00', time() + 3600 ) );
		wp_schedule_event( $kita, 'hourly', self::HOOK );
	}

	private static function log( string $m ): void {
		if ( function_exists( 'petshop_xml_log' ) ) petshop_xml_log( '[VF FEED] ' . $m );
		else error_log( '[VF FEED] ' . $m );
	}

	/** Parsisiunčia VF XML ir atnaujina abu failus. Grąžina būklės masyvą. */
	public static function atnaujinti(): array {
		$t0  = microtime( true );
		$cfg = self::cfg();
		$r   = [ 'laikas' => current_time( 'mysql' ), 'ok' => false, 'klaida' => '', 'eilutes' => 0, 'baitai' => 0, 'sek' => 0 ];
		if ( $cfg['user'] === '' || $cfg['pass'] === '' || $cfg['url'] === '' ) {
			$r['klaida'] = 'nera kredencialu (fetcher failas neperskaitytas)';
			return self::baigti( $r );
		}
		$ch = curl_init();
		curl_setopt_array( $ch, [
			CURLOPT_URL            => $cfg['url'],
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_USERPWD        => $cfg['user'] . ':' . $cfg['pass'],
			CURLOPT_HTTPAUTH       => CURLAUTH_BASIC,
			CURLOPT_TIMEOUT        => 120,
			CURLOPT_CONNECTTIMEOUT => 15,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_MAXREDIRS      => 3,
			CURLOPT_ENCODING       => 'gzip,deflate',
			CURLOPT_USERAGENT      => 'petshop.lt VF feed ' . self::VERSIJA,
		] );
		$xml  = curl_exec( $ch );
		$code = (int) curl_getinfo( $ch, CURLINFO_HTTP_CODE );
		$err  = curl_error( $ch );
		curl_close( $ch );
		$r['http'] = $code;
		if ( $err || $code !== 200 || ! is_string( $xml ) || strlen( $xml ) < 10000 ) {
			$r['klaida'] = "API: HTTP {$code} {$err} baitai=" . ( is_string( $xml ) ? strlen( $xml ) : 0 );
			return self::baigti( $r );
		}
		$eil = preg_match_all( '/<row>/', $xml );
		$r['eilutes'] = $eil;
		$r['baitai']  = strlen( $xml );
		if ( strpos( $xml, '<data>' ) === false || $eil < self::MIN_EIL ) {
			$r['klaida'] = "XML nevalidus arba per mazai eiluciu ({$eil})";
			return self::baigti( $r );
		}
		libxml_use_internal_errors( true );
		if ( simplexml_load_string( $xml ) === false ) {
			$r['klaida'] = 'simplexml: XML nesiparsina';
			return self::baigti( $r );
		}
		$sena = (array) get_option( self::OPT, [] );
		if ( ! empty( $sena['eilutes'] ) && $eil < 0.5 * (int) $sena['eilutes'] ) {
			$r['klaida'] = "eiluciu krytis {$sena['eilutes']} -> {$eil}, nerasoma";
			return self::baigti( $r );
		}
		foreach ( [ self::failas(), self::cache() ] as $p ) {
			$dir = dirname( $p );
			if ( ! is_dir( $dir ) ) wp_mkdir_p( $dir );
			$tmp = $p . '.tmp';
			if ( file_put_contents( $tmp, $xml, LOCK_EX ) === false || ! rename( $tmp, $p ) ) {
				$r['klaida'] = "rasymas nepavyko: {$p}";
				@unlink( $tmp );
				return self::baigti( $r );
			}
		}
		$r['ok']  = true;
		$r['sek'] = round( microtime( true ) - $t0, 1 );
		return self::baigti( $r );
	}

	private static function baigti( array $r ): array {
		$r['sek'] = $r['sek'] ?: round( microtime( true ) - ( $_SERVER['REQUEST_TIME_FLOAT'] ?? microtime( true ) ), 1 );
		if ( $r['ok'] ) {
			update_option( self::OPT, $r, false );
			self::log( "OK eilutes={$r['eilutes']} baitai={$r['baitai']} sek={$r['sek']}" );
		} else {
			$sena = (array) get_option( self::OPT, [] );
			$sena['paskutine_klaida'] = $r['klaida'];
			$sena['klaidos_laikas']   = $r['laikas'];
			update_option( self::OPT, $sena, false );
			self::log( 'KLAIDA ' . $r['klaida'] );
		}
		return $r;
	}

	public static function busena(): array {
		$f = self::failas(); $c = self::cache();
		return [
			'versija'    => self::VERSIJA,
			'paskutinis' => get_option( self::OPT, [] ),
			'failas'     => file_exists( $f ) ? [ 'baitai' => filesize( $f ), 'mtime' => date( 'c', filemtime( $f ) ) ] : null,
			'cache'      => file_exists( $c ) ? [ 'baitai' => filesize( $c ), 'mtime' => date( 'c', filemtime( $c ) ) ] : null,
			'cron_kitas' => ( $n = wp_next_scheduled( self::HOOK ) ) ? date( 'c', $n ) : null,
		];
	}

	public static function http(): void {
		$a = (string) ( $_GET['ps_vf_feed'] ?? '' );
		if ( $a === '' ) return;
		$cfg = self::cfg();
		if ( $cfg['key'] === '' || ! hash_equals( $cfg['key'], (string) ( $_GET['k'] ?? '' ) ) ) {
			status_header( 403 ); exit( 'forbidden' );
		}
		if ( $a === 'refresh' ) wp_send_json( [ 'refresh' => self::atnaujinti(), 'busena' => self::busena() ] );
		wp_send_json( self::busena() );
	}
}
Petshop_VF_Feed::init();
