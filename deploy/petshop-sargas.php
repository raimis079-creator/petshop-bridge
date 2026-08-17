<?php
/**
 * Petshop Sargas v1.1 (DOD-13)
 *
 * KAM: realiausias incidentas sioje sistemoje nera „svetaine nukrito".
 * Svetaine bus gyva, grazi, ir niekas nepastebes, kad nakti nesuveike ZB
 * likuciu importas. Kita diena pardavinesim tai, ko nebeturim. Uptime to
 * nemato; PHP klaidos irgi gali nebuti — cron'as tiesiog nepasileido.
 *
 * TRYS SLUOKSNIAI (1-as NE cia):
 *   1. ar svetaine gyva      -> UptimeRobot, ISORINIS. Musu serveryje
 *                               veikiantis sargas mirtu kartu su svetaine.
 *   2. ar viduje neluzta     -> sis modulis: fatal + klaidu kaupimas
 *   3. ar cron'ai atliko     -> sis modulis: tylusis sluoksnis
 *
 * SIUNTIMO POLITIKA (savininko klausimas „kiek siu pranesimu bus?"):
 *   gera savaite   1 laiskas  (pirmadienio suvestine)
 *   bloga savaite  2-3
 *   viskas gerai   TYLA + savaitine suvestine kaip irodymas, kad sargas gyvas
 *
 *   - warning'ai NESIUNCIAMI is viso (WP ju generuoja desimtimis per diena) —
 *     kaupiami lenteleje, matomi savaitineje suvestineje skaiciumi;
 *   - to paties tipo klaida siunciama VIENA KARTA PER PARA. Be sio saugiklio
 *     luzimas kas uzklausa duotu 4 000 laisku per nakti;
 *   - siunciama tik tai, kas reikalauja savininko VEIKSMO.
 *
 * CRON'U VARDAI NEHARDKODINTI. Modulis atranda juos pats per
 * `_get_cron_array()` ir isimena kaip lauktinus. Taip sargas nesugrius,
 * kai kabliukai pasikeis ar atsiras naujas importas.
 *
 * PRIKLAUSOMYBIU NULIS. Sentry ir panasus samoningai atmesti: dar viena
 * isorine priklausomybe + menesinis mokestis, o 90 % naudos gaunam is to,
 * ka jau turim.
 *
 * v1.1 (2026-08-17): laiskai siunciami HTML su <pre> — Outlook gryname
 * tekste ismeta eiluciu luzius ir suvestine tampa neskaitoma.
 *
 * NUSTATYMAI (keiciami be kodo):
 *   ps_sargas_pastas        gavejas (numatyta: terra@gyvunai.lt)
 *   ps_sargas_ijungtas      'yes'|'no'
 *   ps_sargas_cron_valandos po kiek valandu cron laikomas neatsiskaiciusiu (24)
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Sargas {

	const LENTELE      = 'ps_sargas_klaidos';
	const CRON_ZINIOS  = 'ps_sargas_cron_zinios';   // option: hook => paskutinis laikas
	const CRON_LAUKIAM = 'ps_sargas_cron_laukiam';  // option: hook => schedule
	const SIUSTA       = 'ps_sargas_siusta';        // option: parasas => data

	/* ==================== PALEIDIMAS ==================== */

	public static function init() {

		add_action( 'init', array( __CLASS__, 'lentele' ) );

		if ( 'no' === get_option( 'ps_sargas_ijungtas', 'yes' ) ) {
			return;
		}

		/* 2 sluoksnis — klaidos */
		set_error_handler( array( __CLASS__, 'klaida' ), E_ALL );
		register_shutdown_function( array( __CLASS__, 'pabaiga' ) );

		/* 3 sluoksnis — cron'u stebejimas.
		   Kiekvienas ivykdytas cron'as palieka zyme; atskiras cron tikrina,
		   kas nepaliko. Naudojam bendra WP kabliuka, tad ivardyti atskirai
		   nereikia. */
		add_action( 'wp_loaded', array( __CLASS__, 'isiminti_laukiamus' ) );
		foreach ( self::laukiami() as $hook => $sched ) {
			add_action( $hook, array( __CLASS__, 'cron_atsiskaite' ), 1 );
		}

		/* Musu pacio cron'ai */
		add_action( 'ps_sargas_kasdien',    array( __CLASS__, 'kasdien' ) );
		add_action( 'ps_sargas_savaitinis', array( __CLASS__, 'savaitine_suvestine' ) );
		self::planuoti();
	}

	public static function lentele() {
		global $wpdb;
		$t = $wpdb->prefix . self::LENTELE;
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) === $t ) { return; }
		$c = $wpdb->get_charset_collate();
		/* ENGINE nurodomas AISKIAI — serverio default yra MyISAM (zr. §8j) */
		$wpdb->query(
			"CREATE TABLE IF NOT EXISTS `$t` (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
				laikas DATETIME NOT NULL,
				lygis VARCHAR(16) NOT NULL,
				parasas CHAR(32) NOT NULL,
				zinute TEXT NULL,
				failas VARCHAR(255) NULL,
				eilute INT UNSIGNED NULL,
				url VARCHAR(255) NULL,
				kiek INT UNSIGNED NOT NULL DEFAULT 1,
				PRIMARY KEY (id),
				KEY parasas_idx (parasas),
				KEY laikas_idx (laikas)
			) ENGINE=InnoDB $c"
		);
	}

	/* ==================== 2 SLUOKSNIS: KLAIDOS ==================== */

	public static function klaida( $nr, $zinute, $failas = '', $eilute = 0 ) {
		/* Grazinam false -> PHP tvarko toliau kaip iprastai. Nieko neslepiam. */
		self::rasyti( self::lygis( $nr ), $zinute, $failas, $eilute );
		return false;
	}

	public static function pabaiga() {
		$e = error_get_last();
		if ( ! $e ) { return; }
		if ( ! in_array( $e['type'], array( E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR ), true ) ) { return; }
		self::rasyti( 'fatal', $e['message'], $e['file'], $e['line'] );
		self::pranesti_fatal( $e );
	}

	private static function lygis( $nr ) {
		switch ( $nr ) {
			case E_ERROR: case E_PARSE: case E_CORE_ERROR: case E_COMPILE_ERROR: case E_USER_ERROR:
				return 'fatal';
			case E_WARNING: case E_CORE_WARNING: case E_COMPILE_WARNING: case E_USER_WARNING:
				return 'warning';
			case E_DEPRECATED: case E_USER_DEPRECATED:
				return 'deprecated';
			default:
				return 'notice';
		}
	}

	private static function rasyti( $lygis, $zinute, $failas, $eilute ) {
		global $wpdb;
		$t = $wpdb->prefix . self::LENTELE;

		/* Parasas: to paties luzimo pakartojimai jungiami i viena eilute. */
		$parasas = md5( $lygis . '|' . preg_replace( '/\d+/', 'N', (string) $zinute ) . '|' . $failas . '|' . $eilute );

		$yra = $wpdb->get_row( $wpdb->prepare(
			"SELECT id, kiek FROM `$t` WHERE parasas=%s AND laikas > %s LIMIT 1",
			$parasas, gmdate( 'Y-m-d H:i:s', time() - DAY_IN_SECONDS )
		) );

		if ( $yra ) {
			$wpdb->query( $wpdb->prepare( "UPDATE `$t` SET kiek=kiek+1, laikas=%s WHERE id=%d", current_time( 'mysql' ), $yra->id ) );
			return;
		}

		$wpdb->insert( $t, array(
			'laikas'  => current_time( 'mysql' ),
			'lygis'   => $lygis,
			'parasas' => $parasas,
			'zinute'  => mb_substr( (string) $zinute, 0, 1000 ),
			'failas'  => mb_substr( (string) $failas, 0, 255 ),
			'eilute'  => (int) $eilute,
			'url'     => isset( $_SERVER['REQUEST_URI'] ) ? mb_substr( (string) $_SERVER['REQUEST_URI'], 0, 255 ) : '',
			'kiek'    => 1,
		) );
	}

	/* ==================== 3 SLUOKSNIS: CRON'AI ==================== */

	/** Atranda visus suplanuotus cron'us. Vardai NEHARDKODINTI. */
	public static function isiminti_laukiamus() {
		if ( ! function_exists( '_get_cron_array' ) ) { return; }
		$laukiami = self::laukiami();
		$rasti     = array();
		foreach ( (array) _get_cron_array() as $x ) {
			foreach ( (array) $x as $hook => $d ) {
				/* Tik pasikartojantys — vienkartiniai neturi „nesuveike" prasmes */
				foreach ( (array) $d as $k ) {
					if ( ! empty( $k['schedule'] ) ) { $rasti[ $hook ] = $k['schedule']; }
				}
			}
		}
		if ( $rasti !== $laukiami ) { update_option( self::CRON_LAUKIAM, $rasti, false ); }
	}

	private static function laukiami() {
		$v = get_option( self::CRON_LAUKIAM, array() );
		return is_array( $v ) ? $v : array();
	}

	public static function cron_atsiskaite() {
		$hook = current_action();
		if ( ! $hook ) { return; }
		$z = get_option( self::CRON_ZINIOS, array() );
		if ( ! is_array( $z ) ) { $z = array(); }
		$z[ $hook ] = time();
		update_option( self::CRON_ZINIOS, $z, false );
	}

	/* ==================== PRANESIMAI ==================== */

	private static function pastas() {
		return get_option( 'ps_sargas_pastas', 'terra@gyvunai.lt' );
	}

	/** Vienas to paties tipo pranesimas per para. */
	private static function galima_siusti( $parasas ) {
		$s = get_option( self::SIUSTA, array() );
		if ( ! is_array( $s ) ) { $s = array(); }
		$siandien = current_time( 'Y-m-d' );
		if ( isset( $s[ $parasas ] ) && $s[ $parasas ] === $siandien ) { return false; }
		$s[ $parasas ] = $siandien;
		/* neleidziam augti be ribu */
		if ( count( $s ) > 200 ) { $s = array_slice( $s, -100, null, true ); }
		update_option( self::SIUSTA, $s, false );
		return true;
	}

	/**
	 * v1.1: SIUNCIAM HTML SU <pre>, NE gryna teksta.
	 *
	 * PRIEZASTIS (ismatuota 2026-08-17, savininko ekrano kopija): Outlook
	 * gryname tekste nusprendzia, kad tai „flowed" tekstas, ir ISMETA
	 * EILUCIU LUZIUS — virsuje parodo „We removed extra line breaks from
	 * this message". Testiniam laiskui tai nesvarbu, bet savaitine
	 * suvestine sudelioja stulpeliais, ir suplakta i viena kamuoli ji
	 * tampa neskaitoma. <pre> blokas lygiavima apsaugo.
	 *
	 * Serverio puseje wp_mail() abiem atvejais grazina true — problema
	 * matosi TIK gavejo ekrane.
	 */
	private static function siusti( $tema, $tekstas ) {
		$html = '<html><body style="margin:0;padding:16px;background:#fff">'
			. '<pre style="font:13px/1.5 Consolas,Menlo,monospace;color:#22301f;'
			. 'white-space:pre;margin:0">'
			. esc_html( $tekstas )
			. '</pre></body></html>';

		wp_mail(
			self::pastas(),
			'[Petshop sargas] ' . $tema,
			$html,
			array( 'Content-Type: text/html; charset=UTF-8' )
		);
	}

	private static function pranesti_fatal( $e ) {
		$parasas = 'fatal:' . md5( $e['file'] . $e['line'] );
		if ( ! self::galima_siusti( $parasas ) ) { return; }
		self::siusti(
			'Fatal error',
			"Fatal error svetaineje.\n\n"
			. "Zinute: {$e['message']}\n"
			. "Failas: {$e['file']}:{$e['line']}\n"
			. 'URL: ' . ( isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '-' ) . "\n"
			. 'Laikas: ' . current_time( 'mysql' ) . "\n\n"
			. "Tokio pat tipo pranesimas sia para daugiau nebus siunciamas.\n"
		);
	}

	/* ==================== KASDIENINIS TIKRINIMAS ==================== */

	public static function kasdien() {
		$val    = (int) get_option( 'ps_sargas_cron_valandos', 24 );
		$riba   = time() - ( $val * HOUR_IN_SECONDS );
		$zinios = get_option( self::CRON_ZINIOS, array() );
		$zinios = is_array( $zinios ) ? $zinios : array();

		$tyli = array();
		foreach ( self::laukiami() as $hook => $sched ) {
			/* reciau nei kas para vykstantiems netaikom paros ribos */
			if ( in_array( $sched, array( 'weekly', 'monthly' ), true ) ) { continue; }
			$pask = isset( $zinios[ $hook ] ) ? (int) $zinios[ $hook ] : 0;
			if ( $pask < $riba ) {
				$tyli[] = $hook . ' (' . $sched . ') — '
					. ( $pask ? 'paskutinis ' . gmdate( 'Y-m-d H:i', $pask ) : 'niekada nefiksuotas' );
			}
		}

		if ( ! $tyli ) { return; }
		if ( ! self::galima_siusti( 'cron:' . md5( implode( '|', $tyli ) ) ) ) { return; }

		self::siusti(
			'Cron neatsiskaite (' . count( $tyli ) . ')',
			"Sie suplanuoti darbai per paskutines {$val} val. neatsiskaite:\n\n"
			. '- ' . implode( "\n- ", $tyli ) . "\n\n"
			. "Tai gali reiksti, kad importas nepasileido ir likuciai pasene.\n"
			. "Patikrinti: serveriai.lt cron nustatymai ir WP Tools -> Scheduled Actions.\n"
		);
	}

	/* ==================== SAVAITINE SUVESTINE ==================== */

	public static function savaitine_suvestine() {
		global $wpdb;
		$t = $wpdb->prefix . self::LENTELE;
		$nuo = gmdate( 'Y-m-d H:i:s', time() - WEEK_IN_SECONDS );

		$pagal = $wpdb->get_results( $wpdb->prepare(
			"SELECT lygis, COUNT(*) eiluciu, SUM(kiek) kartu FROM `$t` WHERE laikas > %s GROUP BY lygis", $nuo
		), ARRAY_A );

		$top = $wpdb->get_results( $wpdb->prepare(
			"SELECT lygis, zinute, failas, eilute, kiek FROM `$t`
			 WHERE laikas > %s AND lygis IN('fatal','warning') ORDER BY kiek DESC LIMIT 5", $nuo
		), ARRAY_A );

		$zinios = get_option( self::CRON_ZINIOS, array() );
		$zinios = is_array( $zinios ) ? $zinios : array();
		$cron_ok = 0; $cron_ne = 0;
		foreach ( self::laukiami() as $hook => $sched ) {
			$pask = isset( $zinios[ $hook ] ) ? (int) $zinios[ $hook ] : 0;
			if ( $pask > time() - 2 * DAY_IN_SECONDS ) { $cron_ok++; } else { $cron_ne++; }
		}

		$e = "Savaitine sargo suvestine — " . current_time( 'Y-m-d' ) . "\n";
		$e .= str_repeat( '-', 46 ) . "\n\n";
		$e .= "CRON'AI\n";
		$e .= "  atsiskaite:      {$cron_ok}\n";
		$e .= "  tyli:            {$cron_ne}\n\n";
		$e .= "KLAIDOS (7 d.)\n";
		if ( $pagal ) {
			foreach ( $pagal as $r ) {
				$e .= sprintf( "  %-12s %4d unikaliu / %6d kartu\n", $r['lygis'], $r['eiluciu'], $r['kartu'] );
			}
		} else {
			$e .= "  nera\n";
		}
		if ( $top ) {
			$e .= "\nDAZNIAUSIOS\n";
			foreach ( $top as $r ) {
				$e .= '  [' . $r['lygis'] . ' x' . $r['kiek'] . '] ' . mb_substr( $r['zinute'], 0, 90 ) . "\n";
				$e .= '      ' . basename( $r['failas'] ) . ':' . $r['eilute'] . "\n";
			}
		}
		$e .= "\n" . str_repeat( '-', 46 ) . "\n";
		$e .= "Si suvestine ateina kas pirmadieni. Jei ji NEATEJO — sargas\n";
		$e .= "neveikia, ir tai pats svarbiausias signalas.\n";

		self::siusti( 'Savaitine suvestine', $e );

		/* valymas: laikom 60 d. */
		$wpdb->query( $wpdb->prepare( "DELETE FROM `$t` WHERE laikas < %s", gmdate( 'Y-m-d H:i:s', time() - 60 * DAY_IN_SECONDS ) ) );
	}

	/* ==================== PLANAVIMAS ==================== */

	private static function planuoti() {
		if ( ! wp_next_scheduled( 'ps_sargas_kasdien' ) ) {
			/* 07:00 vietos laiku — po naktiniu importu */
			wp_schedule_event( self::rytoj( 7 ), 'daily', 'ps_sargas_kasdien' );
		}
		if ( ! wp_next_scheduled( 'ps_sargas_savaitinis' ) ) {
			wp_schedule_event( self::rytoj( 8 ), 'weekly', 'ps_sargas_savaitinis' );
		}
	}

	private static function rytoj( $valanda ) {
		$dabar = current_time( 'timestamp' );
		$t     = mktime( $valanda, 0, 0, (int) date( 'n', $dabar ), (int) date( 'j', $dabar ), (int) date( 'Y', $dabar ) );
		if ( $t <= $dabar ) { $t += DAY_IN_SECONDS; }
		/* i UTC, nes wp_schedule_event dirba su UTC */
		return $t - ( (int) get_option( 'gmt_offset', 0 ) * HOUR_IN_SECONDS );
	}
}

Petshop_Sargas::init();
