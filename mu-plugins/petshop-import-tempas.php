<?php
/**
 * Petshop Import Tempas v1.2 (WP All Import #3 processing kas 2 min)
 *
 * PRIEŽASTIS (S1594, 2026-09-02): hosting cron ZB likučiams (Import #3) kviečia
 * `action=processing` TIK 1 kartą per valandą (`2 *`) → vienas kvietimas ~59 s
 * apdoroja ~480 iš 2 659 įrašų → pilnas praėjimas 4–5 h. Panelio prieigos
 * bridge neturi (shell_exec išjungtas), todėl dažnumas keliamas WP pusėje.
 *
 * VEIKIMAS: WP-cron `petshop_import_tempas` kas 120 s (WP-cron pažadinamas
 * kiekvienu hosting cron `wp-load.php` kvietimu — 12 užduočių/val + lankytojai).
 * Jei pmxi #3 `triggered=1` ir `processing=0` → nebloguojantis GET į
 * `<hostas>/wp-load.php?import_key=<cron_job_key>&import_id=3&action=processing`.
 * Tai tas pats kelias, kuriuo eina hosting cron — pmxi užraktai (processing
 * flag) apsaugo nuo dubliavimo. Trigger'io NEKVIEČIA — jį duoda hosting cron `0 *`.
 *
 * HOSTAS: option `ps_import_tempas_host` (dabar `https://dev.avesa.lt`, nes
 * petshop.lt DNS dar rodo į eShoprent). T-0: ištrinti option → naudoja home_url().
 *
 * BŪSENA: option `ps_import_tempas_paskutinis` {laikas, import_id, veiksmas}.
 * Rankinis: ?ps_import_tempas=status&k=<secure>
 */
defined( 'ABSPATH' ) || exit;

final class Petshop_Import_Tempas {

	const VERSIJA  = '1.2';
	const HOOK     = 'petshop_import_tempas';
	const INTERVAL = 'petshop_2min';
	const IMPORTAI = [ 3 ];
	const OPT      = 'ps_import_tempas_paskutinis';

	public static function init(): void {
		add_filter( 'cron_schedules', [ __CLASS__, 'intervalas' ] );
		add_action( self::HOOK, [ __CLASS__, 'vykdyti' ] );
		add_action( 'init', [ __CLASS__, 'registruoti' ] );
		add_action( 'init', [ __CLASS__, 'http' ], 4 );
	}

	public static function intervalas( array $s ): array {
		$s[ self::INTERVAL ] = [ 'interval' => 120, 'display' => 'Petshop kas 2 min' ];
		return $s;
	}

	public static function registruoti(): void {
		if ( ! wp_next_scheduled( self::HOOK ) ) wp_schedule_event( time() + 60, self::INTERVAL, self::HOOK );
	}

	public static function hostas(): string {
		$h = (string) get_option( 'ps_import_tempas_host', '' );
		return $h !== '' ? rtrim( $h, '/' ) : rtrim( home_url(), '/' );
	}

	public static function raktas(): string {
		$o = get_option( 'PMXI_Plugin_Options' );
		return is_array( $o ) ? (string) ( $o['cron_job_key'] ?? '' ) : ''; // v1.2: 'secure' yra bool flag ("1"), tikras raktas — cron_job_key
	}

	public static function vykdyti(): void {
		global $wpdb;
		$key = self::raktas();
		if ( $key === '' ) return;
		foreach ( self::IMPORTAI as $id ) {
			$r = $wpdb->get_row( $wpdb->prepare( "SELECT triggered, processing, executing FROM {$wpdb->prefix}pmxi_imports WHERE id=%d", $id ), ARRAY_A );
			if ( ! $r || (int) $r['triggered'] !== 1 || (int) $r['processing'] === 1 || (int) $r['executing'] === 1 ) continue;
			if ( get_transient( 'ps_import_tempas_lock_' . $id ) ) continue;
			set_transient( 'ps_import_tempas_lock_' . $id, 1, 90 );
			$url = self::hostas() . '/wp-load.php?import_key=' . rawurlencode( $key ) . '&import_id=' . $id . '&action=processing';
			$t0  = microtime( true );
			$r   = wp_remote_get( $url, [ 'timeout' => 75, 'sslverify' => false ] );
			$ats = is_wp_error( $r ) ? $r->get_error_message() : mb_substr( (string) wp_remote_retrieve_body( $r ), 0, 120 );
			delete_transient( 'ps_import_tempas_lock_' . $id );
			update_option( self::OPT, [ 'laikas' => current_time( 'mysql' ), 'import_id' => $id, 'veiksmas' => 'processing', 'hostas' => self::hostas(), 'sek' => round( microtime( true ) - $t0, 1 ), 'atsakymas' => $ats ], false );
		}
	}

	public static function http(): void {
		if ( ( $_GET['ps_import_tempas'] ?? '' ) === '' ) return;
		$k = self::raktas();
		if ( $k === '' || ! hash_equals( $k, (string) ( $_GET['k'] ?? '' ) ) ) { status_header( 403 ); exit( 'forbidden' ); }
		wp_send_json( [ 'versija' => self::VERSIJA, 'hostas' => self::hostas(), 'kitas' => ( $n = wp_next_scheduled( self::HOOK ) ) ? date( 'c', $n ) : null, 'paskutinis' => get_option( self::OPT ) ] );
	}
}
Petshop_Import_Tempas::init();
