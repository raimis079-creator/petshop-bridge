<?php
/**
 * Plugin Name: Petshop Dim — Klientai
 * Description: Kliento busena (ps_dim_klientai) — kohortos, LTV, RFM. Perskaiciuojama kas nakti IS VISOS JUOSTOS (istorija + faktai per Petshop_Ist_Adapteris). Master planas v1.8 §4.8; B1 segmentai — S1546 #1.
 * Version: 1.1.1
 *
 * KODEL: maistas yra periodinis pirkimas. Be kohortu ir pakartotinio pirkimo
 * rodikliu refill variklis aklas, o „nauji vs grizatantys" pjuvis neimanomas.
 * Chewy ir zooplus tai laiko PAGRINDINE metrika (planas §2).
 *
 * ══════════════════════════════════════════════════════════════════════
 * SI LENTELE — IsVESTINE, NE FAKTAS
 * ══════════════════════════════════════════════════════════════════════
 * Skirtingai nuo `ps_fakt_*`, ji **perskaiciuojama nuo nulio** kas nakti is
 * `ps_fakt_uzsakymai`. Todel ja galima trinti be nuostoliu — tai tik greitesnis
 * budas atsakyti i klausima, o ne istorijos saltinis. Faktai lieka faktais.
 *
 * RAKTAS: `email_hash`, ne `klientas_id`. Priezastis — dev'e visi 4 uzsakymai
 * turi `klientas_id=0` (sveciai), ir taip bus daugumai realiu pirkimu.
 * `klientas_id` saugomas SALIA, kai jis yra.
 * GDPR (`ps_gdpr_rezimas=anonimizuoti`): `klientas_id` -> NULL, hash lieka.
 * Hash yra vienkryptis, todel anonimizavimas kohortu nesugriauna.
 *
 * RFM — KVINTILIAI, ne fiksuotos ribos. Su mazu klientu skaiciumi kvintiliai
 * issigimsta (visi patenka i ta pati), todel:
 *   < 5 klientai -> visiems `rfm_* = NULL`, `segmentas` skaiciuojamas TIK is
 *   uzsakymu skaiciaus ir senumo. Melagingas „VIP" is vieno kliento butu
 *   blogiau nei tuscias laukas (§7 taisykle 15).
 *
 * `refill_laukiama_at` — SAMONINGAI NULL. E2b recon (#5010) rado, kad
 * `refill_laukiama` neminimas ne viename faile; `ps_refill_tracking` lentele
 * yra (23 eilutes), bet jos schemos dar netikrinom. Geriau tuscia nei atspeta;
 * prijungiama atskirai, kai schema bus perskaityta.
 *
 * @package Petshop
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Dim_Klientai {

	const VERSIJA        = '1.1';
	const SCHEMOS_RAKTAS = 'ps_dim_klientai_schema';
	const SCHEMOS_VER    = 1;
	const CRON           = 'ps_dim_klientu_perskaiciavimas';

	/** Maziau nei tiek klientu — RFM kvintiliai beprasmiai. */
	const RFM_MIN = 5;

	public static function init() {
		add_action( self::CRON, array( __CLASS__, 'perskaiciuoti' ) );
		self::planuoti();
	}

	/** 20:40 UTC — PRIES atsargu snapshot'a (20:55) ir pries agregavima. */
	public static function planuoti() {
		if ( ! wp_next_scheduled( self::CRON ) ) {
			wp_schedule_event( strtotime( gmdate( 'Y-m-d' ) . ' 20:40:00 UTC' ) + DAY_IN_SECONDS, 'daily', self::CRON );
		}
	}

	public static function t() { global $wpdb; return $wpdb->prefix . 'ps_dim_klientai'; }

	public static function uztikrinti_lenteles( $priverstinai = false ) {
		if ( ! $priverstinai && (int) get_option( self::SCHEMOS_RAKTAS ) === self::SCHEMOS_VER ) { return; }
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		$cs = $wpdb->get_charset_collate();
		$t  = self::t();

		dbDelta( "CREATE TABLE $t (
			raktas CHAR(64) NOT NULL,
			klientas_id BIGINT UNSIGNED NULL DEFAULT NULL,
			pirmas_pirkimas_at DATETIME NULL DEFAULT NULL,
			paskutinis_pirkimas_at DATETIME NULL DEFAULT NULL,
			uzsakymu_sk INT UNSIGNED NOT NULL DEFAULT 0,
			pajamos_ct BIGINT NOT NULL DEFAULT 0,
			marza_ct BIGINT NOT NULL DEFAULT 0,
			kontribucija_ct BIGINT NOT NULL DEFAULT 0,
			ltv_90_ct BIGINT NOT NULL DEFAULT 0,
			ltv_180_ct BIGINT NOT NULL DEFAULT 0,
			ltv_365_ct BIGINT NOT NULL DEFAULT 0,
			vid_intervalas_d DECIMAL(8,1) NULL DEFAULT NULL,
			kohorta CHAR(7) NULL DEFAULT NULL,
			rfm_r TINYINT NULL DEFAULT NULL,
			rfm_f TINYINT NULL DEFAULT NULL,
			rfm_m TINYINT NULL DEFAULT NULL,
			segmentas VARCHAR(16) NULL DEFAULT NULL,
			gyvunu_sk SMALLINT UNSIGNED NOT NULL DEFAULT 0,
			rusys VARCHAR(190) NULL DEFAULT NULL,
			pagrindinis_brendas VARCHAR(96) NULL DEFAULT NULL,
			refill_laukiama_at DATETIME NULL DEFAULT NULL,
			kanalas_pirmas VARCHAR(24) NULL DEFAULT NULL,
			legacy TINYINT(1) NOT NULL DEFAULT 0,
			testinis TINYINT(1) NOT NULL DEFAULT 0,
			perskaiciuota_at DATETIME NULL DEFAULT NULL,
			aplinka VARCHAR(10) NOT NULL DEFAULT 'dev',
			PRIMARY KEY  (raktas),
			KEY k (kohorta),
			KEY s (segmentas),
			KEY p (paskutinis_pirkimas_at)
		) ENGINE=InnoDB ROW_FORMAT=DYNAMIC $cs;" );

		update_option( self::SCHEMOS_RAKTAS, self::SCHEMOS_VER );
	}

	private static function dabar() { return class_exists( 'Petshop_Faktai' ) ? Petshop_Faktai::dabar() : current_time( 'mysql', true ); }
	private static function aplinka() { return class_exists( 'Petshop_Faktai' ) ? Petshop_Faktai::aplinka() : 'dev'; }

	/* ================================================================== */
	/* PERSKAICIAVIMAS                                                    */
	/* ================================================================== */

	/**
	 * Pilnas perskaiciavimas is faktu. Idempotentiskas: lentele isvaloma ir
	 * uzpildoma is naujo. Tai saugu, nes lentele yra ISVESTINE (zr. antraste).
	 */
	public static function perskaiciuoti( $dry = false ) {
		global $wpdb;
		self::uztikrinti_lenteles();
		/* S1546 #2: nakties perskaiciavimas visada is VISOS juostos (istorija + faktai),
		   nepriklausomai nuo vartotojo jungiklio — dim yra bendra tiesa. */
		$U = class_exists( 'Petshop_Ist_Adapteris' ) && Petshop_Ist_Adapteris::paruostas() ? Petshop_Ist_Adapteris::vu() : $wpdb->prefix . 'ps_fakt_uzsakymai';
		$E = class_exists( 'Petshop_Ist_Adapteris' ) && Petshop_Ist_Adapteris::paruostas() ? Petshop_Ist_Adapteris::ve() : $wpdb->prefix . 'ps_fakt_eilutes';
		if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $U ) ) !== $U ) { return array( 'klaida' => 'nera ' . $U ); }

		$a = self::aplinka();
		$now = self::dabar();

		$eil = $wpdb->get_results(
			"SELECT klientas_email_hash AS raktas,
			        MAX(NULLIF(klientas_id,0)) klientas_id,
			        MIN(apmoketa_at) pirmas, MAX(apmoketa_at) paskutinis,
			        COUNT(*) uzs,
			        SUM(prekiu_suma_ct - nuolaidu_ct) pajamos,
			        SUM(marza_ct) marza, SUM(kontribucija_ct) kontrib,
			        MAX(testinis) testinis,
			        SUBSTRING_INDEX(GROUP_CONCAT(kanalas_pirmas ORDER BY apmoketa_at ASC), ',', 1) kan,
			        SUBSTRING_INDEX(GROUP_CONCAT(saltinis_aplinka ORDER BY apmoketa_at ASC), ',', 1) pirmas_saltinis
			 FROM $U
			 WHERE klientas_email_hash <> ''
			 GROUP BY klientas_email_hash", ARRAY_A );

		$rez = array( 'dry' => (bool) $dry, 'klientu' => count( $eil ), 'irasyta' => 0, 'rfm' => 'praleista' );
		if ( ! $eil ) { return $rez; }

		/* --- LTV langai ir vidutinis intervalas --- */
		$duom = array();
		foreach ( $eil as $r ) {
			$h = $r['raktas'];
			$pirmas_ts = strtotime( $r['pirmas'] . ' UTC' );

			$ltv = array( 90 => 0, 180 => 0, 365 => 0 );
			$datos = array();
			foreach ( (array) $wpdb->get_results( $wpdb->prepare(
				"SELECT apmoketa_at, (prekiu_suma_ct - nuolaidu_ct) suma FROM $U
				 WHERE klientas_email_hash=%s ORDER BY apmoketa_at", $h ), ARRAY_A ) as $u ) {
				$ts = strtotime( $u['apmoketa_at'] . ' UTC' );
				$datos[] = $ts;
				$d = ( $ts - $pirmas_ts ) / DAY_IN_SECONDS;
				foreach ( array( 90, 180, 365 ) as $lang ) {
					if ( $d <= $lang ) { $ltv[ $lang ] += (int) $u['suma']; }
				}
			}

			/* Vidutinis intervalas — TIK jei uzsakymu >= 2. Vieno uzsakymo
			   klientui intervalo NERA (ne 0 — jo tiesiog dar nera). */
			$interv = null;
			if ( count( $datos ) >= 2 ) {
				$sk = 0; $n = 0;
				for ( $i = 1; $i < count( $datos ); $i++ ) { $sk += ( $datos[ $i ] - $datos[ $i - 1 ] ); $n++; }
				$interv = $n ? round( $sk / $n / DAY_IN_SECONDS, 1 ) : null;
			}

			/* Pagrindinis brendas — daugiausiai pirktas (pagal neto suma). */
			$brendas = null;
			if ( $wpdb->get_var( "SHOW TABLES LIKE '" . esc_sql( $E ) . "'" ) === $E ) {
				$brendas = $wpdb->get_var( $wpdb->prepare(
					"SELECT e.brendas_slug FROM $E e
					 JOIN $U u ON u.uzsakymas_id=e.uzsakymas_id
					 WHERE u.klientas_email_hash=%s AND e.brendas_slug <> ''
					 GROUP BY e.brendas_slug ORDER BY SUM(e.kaina_ct) DESC LIMIT 1", $h ) );
			}

			$duom[ $h ] = array(
				'raktas' => $h,
				'klientas_id' => $r['klientas_id'] ? (int) $r['klientas_id'] : null,
				'pirmas_pirkimas_at' => $r['pirmas'],
				'paskutinis_pirkimas_at' => $r['paskutinis'],
				'uzsakymu_sk' => (int) $r['uzs'],
				'pajamos_ct' => (int) $r['pajamos'],
				'marza_ct' => (int) $r['marza'],
				'kontribucija_ct' => (int) $r['kontrib'],
				'ltv_90_ct' => $ltv[90], 'ltv_180_ct' => $ltv[180], 'ltv_365_ct' => $ltv[365],
				'vid_intervalas_d' => $interv,
				'kohorta' => $r['pirmas'] ? gmdate( 'Y-m', $pirmas_ts ) : null,
				'pagrindinis_brendas' => $brendas ? mb_substr( $brendas, 0, 96 ) : null,
				'kanalas_pirmas' => $r['kan'] ? mb_substr( $r['kan'], 0, 24 ) : null,
				'gyvunu_sk' => 0, 'rusys' => null,
				'refill_laukiama_at' => null,   /* samoningai — zr. antraste */
				'legacy' => ( 'ist' === $r['pirmas_saltinis'] ) ? 1 : 0,
				'testinis' => (int) $r['testinis'],
				'perskaiciuota_at' => $now,
				'aplinka' => $a,
				'_paskutinis_ts' => strtotime( $r['paskutinis'] . ' UTC' ),
			);
		}

		/* --- GYVUNAI (M8) --- */
		$pt = $wpdb->prefix . 'ps_pets';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$pt'" ) === $pt ) {
			$stulp = $wpdb->get_col( "SHOW COLUMNS FROM $pt" );
			if ( in_array( 'user_id', $stulp, true ) ) {
				$rusis_lauk = in_array( 'rusis', $stulp, true ) ? 'rusis' : ( in_array( 'species', $stulp, true ) ? 'species' : null );
				foreach ( $duom as $h => $d ) {
					if ( ! $d['klientas_id'] ) { continue; }
					$duom[ $h ]['gyvunu_sk'] = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $pt WHERE user_id=%d", $d['klientas_id'] ) );
					if ( $rusis_lauk ) {
						$r2 = $wpdb->get_col( $wpdb->prepare( "SELECT DISTINCT `$rusis_lauk` FROM $pt WHERE user_id=%d", $d['klientas_id'] ) );
						$duom[ $h ]['rusys'] = $r2 ? mb_substr( wp_json_encode( array_values( array_filter( $r2 ) ), JSON_UNESCAPED_UNICODE ), 0, 190 ) : null;
					}
				}
			}
		}

		/* --- RFM (kvintiliai) --- */
		if ( count( $duom ) >= self::RFM_MIN ) {
			$rez['rfm'] = 'skaiciuota';
			$dabar_ts = time();
			$R = array(); $F = array(); $M = array();
			foreach ( $duom as $h => $d ) {
				$R[ $h ] = -( $dabar_ts - $d['_paskutinis_ts'] );   /* naujesnis = didesnis */
				$F[ $h ] = $d['uzsakymu_sk'];
				$M[ $h ] = $d['kontribucija_ct'];
			}
			$rr = self::kvintiliai( $R ); $ff = self::kvintiliai( $F ); $mm = self::kvintiliai( $M );
			foreach ( $duom as $h => $d ) {
				$duom[ $h ]['rfm_r'] = $rr[ $h ]; $duom[ $h ]['rfm_f'] = $ff[ $h ]; $duom[ $h ]['rfm_m'] = $mm[ $h ];
			}
		}

		/* --- SEGMENTAS --- */
		foreach ( $duom as $h => $d ) {
			$duom[ $h ]['segmentas'] = self::segmentas( $d );
			unset( $duom[ $h ]['_paskutinis_ts'] );
		}

		/* --- B1 (S1546 #1): viena taisykliu knyga. Segmentas ir refill data imami
		   is ps_kl_suvestine (Petshop_Klientai 7 taisykles) pagal el. pasto hash.
		   Klientams be paskyros lieka self::segmentas() poaibis (be refill). --- */
		$KL = $wpdb->prefix . 'ps_kl_suvestine';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$KL'" ) === $KL ) {
			$b1 = 0;
			foreach ( $wpdb->get_results( "SELECT SHA2(LOWER(TRIM(email)),256) h, segmentas, kita FROM $KL WHERE email<>'' AND segmentas IS NOT NULL", ARRAY_A ) as $kr ) {
				if ( isset( $duom[ $kr['h'] ] ) ) {
					$duom[ $kr['h'] ]['segmentas'] = $kr['segmentas'];
					$duom[ $kr['h'] ]['refill_laukiama_at'] = $kr['kita'] ? $kr['kita'] . ' 00:00:00' : null;
					$b1++;
				}
			}
			$rez['b1_suvienodinta'] = $b1;
		}

		if ( $dry ) { $rez['pavyzdys'] = array_slice( $duom, 0, 3 ); return $rez; }

		$t = self::t();
		$wpdb->query( $wpdb->prepare( "DELETE FROM $t WHERE aplinka=%s", $a ) );
		/* S1691: replace vietoj insert — 09-08 eilutės liko su aplinka='dev', DELETE WHERE aplinka='prod' jų nelietė ir kas naktį visi 5 431 INSERT krito Duplicate PRIMARY (43 MB php_error.log, dim nesikeitė nuo 09-08). */
		foreach ( $duom as $d ) { if ( $wpdb->replace( $t, $d ) ) { $rez['irasyta']++; } }
		update_option( 'ps_dim_klientu_paskutinis', $now . ' | ' . $rez['irasyta'], false );
		return $rez;
	}

	/** Kvintiliai 1..5. Vienodos reiksmes gauna ta pati bala. */
	private static function kvintiliai( $reiksmes ) {
		$out = array();
		$v = array_values( $reiksmes );
		sort( $v );
		$n = count( $v );
		foreach ( $reiksmes as $k => $x ) {
			$poz = 0;
			foreach ( $v as $i => $y ) { if ( $y < $x ) { $poz = $i + 1; } }
			$out[ $k ] = max( 1, min( 5, (int) ceil( ( ( $poz + 1 ) / $n ) * 5 ) ) );
		}
		return $out;
	}

	/**
	 * Segmentas — B1 poaibis (S1546 #1): tos pacios Petshop_Klientai 7 taisykles,
	 * be refill_laikas/refill_arteja (ciklas zinomas tik ps_kl_suvestine — ten, kur
	 * yra paskyra, segmentas perrasomas is jos perskaiciuoti() pabaigoje).
	 * RFM lieka kaip papildomas pjuvis, NEBEVADINAMAS segmentu.
	 */
	public static function segmentas( $d ) {
		$dienos = ( time() - (int) ( isset( $d['_paskutinis_ts'] ) ? $d['_paskutinis_ts'] : strtotime( $d['paskutinis_pirkimas_at'] . ' UTC' ) ) ) / DAY_IN_SECONDS;
		$u = (int) $d['uzsakymu_sk'];

		if ( 1 === $u && $dienos <= 180 ) { return 'pirmas'; }
		if ( $u >= 2 && $dienos <= 90 )   { return 'aktyvus'; }
		if ( $dienos <= 180 )             { return 'reaktyvacija'; }
		return 'win_back';
	}

	/* ================================================================== */
	/* KONTROLE (DoD)                                                     */
	/* ================================================================== */

	public static function kontrole() {
		global $wpdb;
		$t = self::t();
		$U = $wpdb->prefix . 'ps_fakt_uzsakymai';
		return array(
			'versija'   => self::VERSIJA,
			'klientu'   => (int) $wpdb->get_var( "SELECT COUNT(*) FROM $t" ),
			'eilutes'   => $wpdb->get_results( "SELECT LEFT(raktas,10) r,klientas_id,uzsakymu_sk,pajamos_ct,marza_ct,kontribucija_ct,ltv_90_ct,ltv_365_ct,vid_intervalas_d,kohorta,rfm_r,rfm_f,rfm_m,segmentas,pagrindinis_brendas,kanalas_pirmas,gyvunu_sk,testinis FROM $t ORDER BY pajamos_ct DESC LIMIT 10", ARRAY_A ),
			'segmentai' => $wpdb->get_results( "SELECT segmentas, COUNT(*) n FROM $t GROUP BY segmentas", ARRAY_A ),
			'kohortos'  => $wpdb->get_results( "SELECT kohorta, COUNT(*) n, SUM(pajamos_ct) pajamos FROM $t GROUP BY kohorta ORDER BY kohorta", ARRAY_A ),
			'kontrole_su_faktais' => array(
				'faktu_uzsakymu'  => (int) $wpdb->get_var( "SELECT COUNT(*) FROM $U WHERE klientas_email_hash <> ''" ),
				'dim_uzsakymu'    => (int) $wpdb->get_var( "SELECT COALESCE(SUM(uzsakymu_sk),0) FROM $t" ),
				'faktu_pajamos'   => (int) $wpdb->get_var( "SELECT COALESCE(SUM(prekiu_suma_ct - nuolaidu_ct),0) FROM $U WHERE klientas_email_hash <> ''" ),
				'dim_pajamos'     => (int) $wpdb->get_var( "SELECT COALESCE(SUM(pajamos_ct),0) FROM $t" ),
			),
		);
	}
}

Petshop_Dim_Klientai::init();
