<?php
/**
 * Petshop Dev paštas v1.0 (S1608, 2026-09-03) — dev.avesa.lt laiškai NEIŠSIUNČIAMI, tik užrašomi.
 *
 * KODĖL: T3 testas (320 „laukia apmokėjimo“ užsakymų) išsiuntė ~320 tikrų WC laiškų į terra@petshop.lt (Raimio spam).
 * Dev ir prod — tas pats WP (dev veidrodis), todėl skiriama pagal užklausos hostą: kai `HTTP_HOST` = dev.avesa.lt
 * (arba bet kuris ne petshop.lt hostas), `pre_wp_mail` grąžina true (laiškas neišeina) ir įrašo į žurnalą
 * `ps_dev_pastas_zurnalas` (paskutiniai 300: laikas, kam, tema, priedų sk., URL). Cron/CLI be hosto — neliečiama
 * (prod cron laiškai eina). Išimtis: opcija `ps_dev_pastas_leisti=1` — praleisti (Raimiui, kai reikia tikro laiško iš dev).
 * Langas: admin.php?page=ps-dev-pastas (manage_woocommerce). Testų gaudyklės (`pre_wp_mail` prior. 10) veikia toliau —
 * šis filtras prior. 5, todėl testų žurnalas `ps_audit_mail` nebeužsipildo; naudoti `ps_dev_pastas_zurnalas`.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Dev_Pastas {
	const VERSIJA = '1.0';
	const OPT = 'ps_dev_pastas_zurnalas';

	public static function init() {
		add_filter( 'pre_wp_mail', array( __CLASS__, 'gaudyti' ), 5, 2 );
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ) );
		add_action( 'admin_notices', array( __CLASS__, 'pranesimas' ) );
	}

	/** Dev = užklausa ne per petshop.lt (www. irgi prod). */
	public static function dev() {
		$h = strtolower( (string) ( $_SERVER['HTTP_HOST'] ?? '' ) );
		if ( '' === $h ) { return false; } // cron / CLI — nežinom, praleidžiam
		return ! in_array( preg_replace( '/:\d+$/', '', $h ), array( 'petshop.lt', 'www.petshop.lt' ), true );
	}

	public static function gaudyti( $r, $a ) {
		if ( null !== $r || ! self::dev() || get_option( 'ps_dev_pastas_leisti' ) ) { return $r; }
		$z = (array) get_option( self::OPT, array() );
		$z[] = array( 'laikas' => current_time( 'mysql' ), 'kam' => is_array( $a['to'] ?? '' ) ? implode( ', ', $a['to'] ) : (string) ( $a['to'] ?? '' ), 'tema' => mb_substr( (string) ( $a['subject'] ?? '' ), 0, 120 ), 'priedai' => count( (array) ( $a['attachments'] ?? array() ) ), 'url' => mb_substr( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), 0, 120 ) );
		update_option( self::OPT, array_slice( $z, -300 ), false );
		return true; // „išsiųsta“ — kodas nemato skirtumo, laiškas neišeina
	}

	public static function meniu() { add_submenu_page( null, 'Dev paštas', 'Dev paštas', 'manage_woocommerce', 'ps-dev-pastas', array( __CLASS__, 'langas' ) ); }

	public static function pranesimas() {
		if ( ! self::dev() || ! current_user_can( 'manage_woocommerce' ) || empty( $_GET['page'] ) || 0 !== strpos( (string) $_GET['page'], 'ps-' ) || 'ps-dev-pastas' === $_GET['page'] ) { return; }
		$z = (array) get_option( self::OPT, array() ); $d = wp_date( 'Y-m-d' ); $n = 0; foreach ( $z as $x ) { if ( 0 === strpos( $x['laikas'] ?? '', $d ) ) { $n++; } }
		echo '<div class="notice notice-info" style="margin:8px 24px 0"><p>Dev: laiškai neišsiunčiami' . ( get_option( 'ps_dev_pastas_leisti' ) ? ' — <b>IŠJUNGTA (ps_dev_pastas_leisti)</b>' : '' ) . ' · šiandien sugauta ' . (int) $n . ' · <a href="' . esc_url( admin_url( 'admin.php?page=ps-dev-pastas' ) ) . '">žiūrėti</a></p></div>';
	}

	public static function langas() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'Nepakanka teisių' ); }
		if ( ! empty( $_POST['ps_dev_pastas_valyti'] ) && check_admin_referer( 'ps_dev_pastas' ) ) { delete_option( self::OPT ); echo '<div class="notice notice-success"><p>Žurnalas išvalytas.</p></div>'; }
		$z = array_reverse( (array) get_option( self::OPT, array() ) );
		echo '<div class="wrap"><h1>Dev paštas <small style="font-weight:400;color:#666">v' . self::VERSIJA . ' · laiškai iš dev.avesa.lt neišsiunčiami, tik užrašomi (paskutiniai 300)</small></h1>';
		echo '<form method="post" style="margin:8px 0">' . wp_nonce_field( 'ps_dev_pastas', '_wpnonce', true, false ) . '<button class="button" name="ps_dev_pastas_valyti" value="1">Išvalyti žurnalą</button></form>';
		if ( ! $z ) { echo '<p>Tuščia.</p></div>'; return; }
		echo '<table class="widefat striped"><thead><tr><th>Laikas</th><th>Kam</th><th>Tema</th><th>Priedų</th><th>Iš kur</th></tr></thead><tbody>';
		foreach ( $z as $x ) { echo '<tr><td>' . esc_html( $x['laikas'] ) . '</td><td>' . esc_html( $x['kam'] ) . '</td><td>' . esc_html( $x['tema'] ) . '</td><td>' . (int) $x['priedai'] . '</td><td style="color:#666">' . esc_html( $x['url'] ) . '</td></tr>'; }
		echo '</tbody></table></div>';
	}
}
Petshop_Dev_Pastas::init();
