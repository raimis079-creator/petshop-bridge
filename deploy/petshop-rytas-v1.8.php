<?php
/**
 * Plugin Name: Petshop Rytas
 * Description: Savininko ekranas (planas v2.0 §4.1) — 8 skaičiai, 5 lemputės, 3 veiksmai, HUB. + Verslo sargas (§5.1): naktinės patikros, laiškas TIK kai raudona.
 * Version: 1.8
 *
 * KAM. Vienas ekranas kelioms minutėms: kiek uždirbau, ar auga, kas dega, ką
 * daryti. Į gylį — Pardavimų / Klientų / Atsargų analizė. Rytas PATS NIEKO
 * NESKAIČIUOJA IŠ NAUJO: 8 skaičiai eina per `Petshop_Ataskaita_Pardavimai::
 * suvestine()`, todėl visada sutampa su analizės ekranu iki cento.
 *
 * HUB. `class-admin-reports.php` (petshop-core) NELIEČIAMAS: jo `render`
 * nukabinamas nuo `toplevel_page_petshop-reports` (`admin_menu` p99) ir
 * vietoj jo kabinamas šis. Kortelės į kitas ataskaitas — apačioje, iš to
 * paties `$submenu` + filtro `petshop_ataskaitu_aprasai`, kaip ir buvo.
 *
 * SARGAS (S4). Esamas `petshop-sargas.php` v1.2 stebi PHP klaidas ir cron'us
 * — jo nedubliuojam. Šis modulis tikrina VERSLO/DUOMENŲ dalykus: importai,
 * feed'ai, faktų vientisumas, agregatai, siuntos, dropship SLA, laiškai,
 * eventai, 404, beacon, Ads webhook. Laiškas siunčiamas TIK jei bent viena raudona;
 * tas pats raudonųjų rinkinys — vieną kartą per parą. Žalia/geltona — tyla.
 * Rytas viršuje rodo vieną eilutę „Sistema: ✓ / N raudonos".
 *
 * NEŽINOMA = pilka, ne žalia: kai bazinei linijai trūksta 4 sav. arba
 * šaltinio nėra, lemputė pilka su paaiškinimu. Nulis čia nėra teiginys.
 *
 * @package Petshop
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Rytas {
	const VERSIJA = '1.4';
	const TEVAS   = 'petshop-reports';
	const CAP     = 'manage_woocommerce';
	const CRON    = 'ps_rytas_sargas';
	const OPT_PASK   = 'ps_rytas_sargas_pask';    /* paskutinė patikra (masyvas) */
	const OPT_SIUSTA = 'ps_rytas_sargas_siusta';  /* parašas => diena */
	const OPT_RIBOS  = 'ps_rytas_ribos';
	const OPT_VEIKSM = 'ps_rytas_veiksmai';

	/* ==================== PALEIDIMAS ==================== */

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'perimti_huba' ), 99 );
		add_action( self::CRON, array( __CLASS__, 'sargas_cron' ) );
		add_action( 'init', array( __CLASS__, 'planuoti' ) );
		add_action( 'admin_post_ps_rytas_ribos', array( __CLASS__, 'issaugoti_ribas' ) );
		add_action( 'admin_post_ps_rytas_tikrinti', array( __CLASS__, 'tikrinti_dabar' ) );
	}

	/** 06:30 Vilniaus laiku kasdien. */
	public static function planuoti() {
		if ( wp_next_scheduled( self::CRON ) ) { return; }
		$tz = wp_timezone();
		$d  = new DateTime( 'today 06:30', $tz );
		if ( $d->getTimestamp() <= time() ) { $d->modify( '+1 day' ); }
		wp_schedule_event( $d->getTimestamp(), 'daily', self::CRON );
	}

	public static function perimti_huba() {
		global $submenu;
		if ( class_exists( 'Petshop_Admin_Reports' ) ) {
			remove_action( 'toplevel_page_' . self::TEVAS, array( 'Petshop_Admin_Reports', 'render' ) );
		}
		add_action( 'toplevel_page_' . self::TEVAS, array( __CLASS__, 'render' ) );
		if ( isset( $submenu[ self::TEVAS ] ) ) {
			foreach ( $submenu[ self::TEVAS ] as $i => $p ) {
				if ( isset( $p[2] ) && $p[2] === self::TEVAS ) { $submenu[ self::TEVAS ][ $i ][0] = 'Rytas'; }
			}
		}
	}

	/* ==================== NUSTATYMAI ==================== */

	public static function ribos_numatytos() {
		return array(
			'pajamos_gelt'   => 20,  'pajamos_raud'   => 35,   /* % kritimas vs bazinė */
			'nauji_gelt'     => 20,  'nauji_raud'     => 35,
			'nuost_gelt'     => 3,   'nuost_raud'     => 6,    /* nuostolingi per 7 d. */
			'stockout_gelt'  => 1,   'stockout_raud'  => 3,    /* A-prekės be likučio */
			'neissiusti_gelt'=> 1,   'neissiusti_raud'=> 3,    /* apmokėti >2 d. be siuntos */
			'lead_d'         => 7,   /* tiekėjo lead time + buferis, d. */
			'galiojimas_d'   => 30,
			'refill_d'       => 7,
			'importai'       => '2,3,7', /* pmxi id, kuriuos sargas tikrina */
			'import_val'     => 26,
			'laiskai'        => 1,
			'poas_gelt'      => 3,   /* POAS (pajamos / reklamos islaidos) zemiau -> geltona; kontribucija po reklamos < 0 -> raudona */
		);
	}
	public static function riba( $k ) {
		$r = get_option( self::OPT_RIBOS, array() );
		$n = self::ribos_numatytos();
		return ( is_array( $r ) && isset( $r[ $k ] ) && $r[ $k ] !== '' ) ? $r[ $k ] : $n[ $k ];
	}
	public static function veiksmai_ijungti() {
		$v = get_option( self::OPT_VEIKSM, null );
		return is_array( $v ) ? $v : array( 'uzsakyti' => 1, 'galiojimas' => 1, 'refill' => 1, 'nuostolingi' => 1 );
	}
	public static function issaugoti_ribas() {
		if ( ! current_user_can( self::CAP ) ) { wp_die( 'Neturite teisių.' ); }
		check_admin_referer( 'ps_rytas_ribos' );
		$n = self::ribos_numatytos(); $r = array();
		foreach ( $n as $k => $d ) {
			if ( ! isset( $_POST[ $k ] ) ) { continue; }
			$v = sanitize_text_field( wp_unslash( $_POST[ $k ] ) );
			$r[ $k ] = ( 'importai' === $k ) ? preg_replace( '/[^0-9,]/', '', $v ) : (float) str_replace( ',', '.', $v );
		}
		update_option( self::OPT_RIBOS, $r, false );
		$v = array();
		foreach ( array( 'uzsakyti', 'galiojimas', 'refill', 'nuostolingi' ) as $k ) { $v[ $k ] = empty( $_POST[ 'v_' . $k ] ) ? 0 : 1; }
		update_option( self::OPT_VEIKSM, $v, false );
		wp_safe_redirect( admin_url( 'admin.php?page=' . self::TEVAS . '&issaugota=1' ) ); exit;
	}
	public static function tikrinti_dabar() {
		if ( ! current_user_can( self::CAP ) ) { wp_die( 'Neturite teisių.' ); }
		check_admin_referer( 'ps_rytas_tikrinti' );
		self::sargas_cron( true );
		wp_safe_redirect( admin_url( 'admin.php?page=' . self::TEVAS . '&patikrinta=1' ) ); exit;
	}

	/* ==================== PAGALBOS ==================== */

	private static function u() { global $wpdb; return $wpdb->prefix . 'ps_fakt_uzsakymai'; }
	private static function e() { global $wpdb; return $wpdb->prefix . 'ps_fakt_eilutes'; }
	private static function s() { global $wpdb; return $wpdb->prefix . 'ps_fakt_siuntos'; }
	private static function a() { global $wpdb; return $wpdb->prefix . 'ps_fakt_atsargos_d'; }
	private static function lentele_yra( $t ) { global $wpdb; return $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $t ) ) === $t; }
	private static function testiniai() { return class_exists( 'Petshop_Ataskaita_Pardavimai' ) && Petshop_Ataskaita_Pardavimai::rodom_testinius(); }
	private static function ts( $pre = 'u' ) { return self::testiniai() ? '' : " AND {$pre}.testinis = 0 "; }
	private static function siandien() { return wp_date( 'Y-m-d' ); }
	private static function pries_d( $d, $nuo = null ) { $b = $nuo ? strtotime( $nuo ) : strtotime( self::siandien() ); return gmdate( 'Y-m-d', $b - $d * DAY_IN_SECONDS ); }
	private static function stat_pradzia() { return class_exists( 'Petshop_Ataskaita_Pardavimai' ) ? Petshop_Ataskaita_Pardavimai::stat_pradzia() : ''; }
	private static function apkarpyti( $nuo ) { $p = self::stat_pradzia(); return ( $p && $nuo < $p ) ? $p : $nuo; }
	private static function eur( $ct ) { return class_exists( 'Petshop_Ataskaitu_UI' ) ? Petshop_Ataskaitu_UI::eur( (int) $ct ) : number_format( $ct / 100, 2, ',', ' ' ) . ' €'; }
	private static function url_pard( $args = array() ) {
		$a = array_merge( array( 'page' => 'ps-pardavimai' ), $args );
		if ( self::testiniai() ) { $a['testiniai'] = '1'; }
		return admin_url( 'admin.php?' . http_build_query( $a ) );
	}

	/* ==================== 1. AŠTUONI SKAIČIAI ==================== */

	/** Laikotarpiai: 'men' — mėnuo iki šiandien vs tas pats praėjusio mėn. tarpsnis; '30' — 30 d. vs ankstesnės 30. */
	public static function laikotarpiai( $rezimas ) {
		$iki = self::siandien();
		if ( '30' === $rezimas ) {
			$nuo = self::pries_d( 29 ); $p_iki = self::pries_d( 30 ); $p_nuo = self::pries_d( 59 );
			$uzrasas = 'Paskutinės 30 d. vs ankstesnės 30 d.';
		} else {
			$nuo   = gmdate( 'Y-m-01', strtotime( $iki ) );
			$diena = (int) gmdate( 'j', strtotime( $iki ) );
			$p_nuo = gmdate( 'Y-m-01', strtotime( $nuo . ' -1 month' ) );
			$p_men_d = (int) gmdate( 't', strtotime( $p_nuo ) );
			$p_iki = gmdate( 'Y-m-', strtotime( $p_nuo ) ) . str_pad( min( $diena, $p_men_d ), 2, '0', STR_PAD_LEFT );
			$uzrasas = 'Šis mėnuo iki šiandien vs tas pats praėjusio mėnesio tarpsnis';
		}
		return array( 'nuo' => $nuo, 'iki' => $iki, 'p_nuo' => $p_nuo, 'p_iki' => $p_iki, 'uzrasas' => $uzrasas );
	}

	public static function skaiciai( $lt ) {
		if ( ! class_exists( 'Petshop_Ataskaita_Pardavimai' ) ) { return null; }
		$d = Petshop_Ataskaita_Pardavimai::suvestine( self::apkarpyti( $lt['nuo'] ), $lt['iki'] );
		$p = Petshop_Ataskaita_Pardavimai::suvestine( self::apkarpyti( $lt['p_nuo'] ), $lt['p_iki'] );
		$f = function ( $r ) {
			$u = (int) $r['uzsakymu'];
			return array(
				'kontribucija' => (int) $r['kontribucija_ct'],
				'pajamos'      => (int) $r['pajamos_ct'],
				'antkainis_p'  => ( (int) $r['savikaina_ct'] > 0 ) ? $r['antkainis_ct'] / $r['savikaina_ct'] * 100 : null,
				'uzsakymai'    => $u,
				'aov'          => $u ? (int) round( $r['pajamos_ct'] / $u ) : 0,
				'nauji'        => (int) $r['nauju'],
				'griztanciu_p' => $u ? ( $u - (int) $r['nauju'] ) / $u * 100 : null,
				'nuostolingi'  => (int) $r['nuostolingu'],
			);
		};
		return array( 'dabar' => $f( $d ), 'buvo' => $f( $p ), 'buvo_uzs' => (int) $p['uzsakymu'] );
	}

	private static function delta_html( $a, $b, $pp = false, $atv = false ) {
		if ( null === $a || null === $b || 0 == $b ) { return '<span class="psr-delta neut">—</span>'; }
		$d  = $a - $b;
		$sk = $pp ? $d : $d / abs( $b ) * 100;
		if ( abs( $sk ) < 0.05 ) { return '<span class="psr-delta neut">— 0,0 ' . ( $pp ? 'p.p.' : '%' ) . '</span>'; }
		$ger = ( $sk > 0 ) ? ! $atv : $atv;
		return '<span class="psr-delta ' . ( $ger ? 'up' : 'down' ) . '">' . ( $sk > 0 ? '▲' : '▼' ) . ' '
			. number_format( abs( $sk ), 1, ',', ' ' ) . ( $pp ? ' p.p.' : ' %' ) . '</span>';
	}

	/* ==================== 2. LEMPUTĖS ==================== */

	/** Dienų eilutės 35 d. atgal — bazinei linijai. */
	private static function dienos_35() {
		global $wpdb;
		$u = self::u(); $t = self::ts();
		$nuo = self::apkarpyti( self::pries_d( 34 ) );
		$r = $wpdb->get_results( $wpdb->prepare(
			"SELECT u.diena, SUM(u.prekiu_suma_ct - u.nuolaidu_ct) paj, SUM(u.klientas_naujas) nauji,
			        SUM(CASE WHEN u.kontribucija_ct < 0 THEN 1 ELSE 0 END) nuost
			 FROM $u u WHERE u.diena BETWEEN %s AND %s $t GROUP BY u.diena", $nuo, self::siandien() ), ARRAY_A );
		$m = array();
		foreach ( (array) $r as $x ) { $m[ $x['diena'] ] = $x; }
		return array( $m, $nuo );
	}

	/** 7 d. suma vs vidurkis 4 ankstesnių 7-dienių langų. Grąžina [dabar, bazinė, pokytis %] arba null. */
	private static function bazine( $m, $k, $nuo ) {
		$pakanka = ( $nuo <= self::pries_d( 34 ) );
		if ( ! $pakanka ) { return null; }
		$dab = 0; $baz = 0;
		for ( $i = 0; $i < 35; $i++ ) {
			$d = self::pries_d( $i ); $v = isset( $m[ $d ] ) ? (float) $m[ $d ][ $k ] : 0;
			if ( $i < 7 ) { $dab += $v; } else { $baz += $v; }
		}
		$baz = $baz / 4;
		if ( $baz <= 0 ) { return null; }
		return array( $dab, $baz, ( $dab - $baz ) / $baz * 100 );
	}

	private static function spalva_kritimas( $pok, $g, $r ) {
		if ( null === $pok ) { return 'pilka'; }
		if ( $pok <= -$r ) { return 'raudona'; }
		if ( $pok <= -$g ) { return 'geltona'; }
		return 'zalia';
	}
	private static function spalva_kiekis( $n, $g, $r ) {
		if ( $n >= $r ) { return 'raudona'; }
		if ( $n >= $g ) { return 'geltona'; }
		return 'zalia';
	}

	public static function lemputes() {
		global $wpdb;
		list( $m, $nuo ) = self::dienos_35();
		$out = array();

		$b = self::bazine( $m, 'paj', $nuo );
		$out[] = array( 'pav' => 'Pajamos 7 d.', 'spalva' => self::spalva_kritimas( $b ? $b[2] : null, self::riba( 'pajamos_gelt' ), self::riba( 'pajamos_raud' ) ),
			'tekstas' => $b ? self::eur( $b[0] ) . ' vs bazinė ' . self::eur( $b[1] ) . ' (' . number_format( $b[2], 0, ',', ' ' ) . ' %)' : 'bazinei linijai reikia 5 sav. duomenų',
			'url' => self::url_pard( array( 'preset' => '7' ) ) );

		$b = self::bazine( $m, 'nauji', $nuo );
		$out[] = array( 'pav' => 'Nauji klientai 7 d.', 'spalva' => self::spalva_kritimas( $b ? $b[2] : null, self::riba( 'nauji_gelt' ), self::riba( 'nauji_raud' ) ),
			'tekstas' => $b ? (int) $b[0] . ' vs bazinė ' . number_format( $b[1], 1, ',', ' ' ) . ' (' . number_format( $b[2], 0, ',', ' ' ) . ' %)' : 'bazinei linijai reikia 5 sav. duomenų',
			'url' => self::url_pard( array( 'preset' => '7', 'pjuvis' => 'klientas' ) ) );

		$n = 0; for ( $i = 0; $i < 7; $i++ ) { $d = self::pries_d( $i ); $n += isset( $m[ $d ] ) ? (int) $m[ $d ]['nuost'] : 0; }
		$out[] = array( 'pav' => 'Nuostolingi 7 d.', 'spalva' => self::spalva_kiekis( $n, self::riba( 'nuost_gelt' ), self::riba( 'nuost_raud' ) ),
			'tekstas' => $n . ' užsakym. su neigiama kontribucija', 'url' => self::url_pard( array( 'preset' => '7' ) ) . '#nuostolingi' );

		/* A-prekių stockout — paskutinis atsargų snapshot */
		$sp = 'pilka'; $tx = 'atsargų snapshot dar nėra';
		if ( self::lentele_yra( self::a() ) ) {
			$a = self::a();
			$max = $wpdb->get_var( "SELECT MAX(data) FROM $a" );
			if ( $max ) {
				$n = (int) $wpdb->get_var( $wpdb->prepare(
					"SELECT COUNT(*) FROM $a x JOIN {$wpdb->postmeta} pm ON pm.post_id = x.preke_id AND pm.meta_key = '_ps_abc' AND pm.meta_value = 'A'
					 WHERE x.data = %s AND x.stockout = 1", $max ) );
				$sp = self::spalva_kiekis( $n, self::riba( 'stockout_gelt' ), self::riba( 'stockout_raud' ) );
				$tx = $n . ' A-prekės be likučio (' . $max . ')';
			}
		}
		$out[] = array( 'pav' => 'A-prekių stockout', 'spalva' => $sp, 'tekstas' => $tx, 'url' => '' );

		$r7 = self::reklama( self::pries_d( 6 ), self::siandien() );
		if ( null === $r7 || ! $r7['yra_isl'] ) { $sp = 'pilka'; $tx = 'reklamos išlaidų faktų dar nėra'; }
		else { $sp = $r7['po'] < 0 ? 'raudona' : ( ( null !== $r7['poas'] && $r7['poas'] < (float) self::riba( 'poas_gelt' ) ) ? 'geltona' : 'zalia' ); $tx = 'išlaidos ' . self::eur( $r7['isl'] ) . ' · po reklamos ' . self::eur( $r7['po'] ) . ' · POAS ' . ( null === $r7['poas'] ? '—' : number_format( $r7['poas'], 1, ',', ' ' ) ); }
		$out[] = array( 'pav' => 'Reklama 7 d.', 'spalva' => $sp, 'tekstas' => $tx, 'url' => self::url_pard( array( 'preset' => '7', 'pjuvis' => 'kampanija' ) ) );

		$n = self::neissiusti_sk();
		$out[] = array( 'pav' => 'Neišsiųsti', 'spalva' => self::spalva_kiekis( $n, self::riba( 'neissiusti_gelt' ), self::riba( 'neissiusti_raud' ) ),
			'tekstas' => $n . ' apmokėti > 2 d. be siuntos', 'url' => admin_url( 'admin.php?page=petshop-desk' ) );
		return $out;
	}

	/** Reklama per laikotarpį: išlaidos (ps_fakt_reklama) + mokamų kanalų pajamos/kontribucija. null — reklamos faktų nėra. */
	public static function reklama( $nuo, $iki ) {
		global $wpdb;
		if ( ! class_exists( 'Petshop_Fakt_Reklama' ) ) { return null; }
		$rk = Petshop_Fakt_Reklama::islaidos( $nuo, $iki );
		$u = self::u(); $t = self::ts();
		$m = $wpdb->get_row( $wpdb->prepare( "SELECT COUNT(*) n, COALESCE(SUM(u.prekiu_suma_ct - u.nuolaidu_ct),0) paj, COALESCE(SUM(u.kontribucija_ct),0) kontr FROM $u u WHERE u.diena BETWEEN %s AND %s AND u.kanalas_paskutinis = 'mokamas' $t", $nuo, $iki ), ARRAY_A );
		if ( ! $rk['viso_ct'] && ! (int) $m['n'] ) { return null; }
		return array( 'isl' => (int) $rk['viso_ct'], 'n' => (int) $m['n'], 'paj' => (int) $m['paj'], 'kontr' => (int) $m['kontr'], 'po' => (int) $m['kontr'] - (int) $rk['viso_ct'], 'poas' => $rk['viso_ct'] ? (int) $m['paj'] / $rk['viso_ct'] : null, 'yra_isl' => (bool) $rk['viso_ct'] );
	}

	/** Apmokėti > 48 val., ne baigti/atšaukti, be siuntos fakto. */
	private static function neissiusti_sk() {
		global $wpdb;
		$u = self::u(); $s = self::s(); $t = self::ts();
		if ( ! self::lentele_yra( $s ) ) { return 0; }
		return (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM $u u
			 WHERE u.apmoketa_at < UTC_TIMESTAMP() - INTERVAL 48 HOUR $t
			   AND u.statusas_galutinis NOT IN ('completed','cancelled','refunded','failed')
			   AND NOT EXISTS (SELECT 1 FROM $s s WHERE s.uzsakymas_id = u.uzsakymas_id)" );
	}

	/* ==================== 3. KĄ DARYTI ==================== */

	public static function veiksmai() {
		global $wpdb;
		$on = self::veiksmai_ijungti(); $v = array();

		/* Užsakyti: AV prekės, kur likutis / 30 d. paklausa < lead time */
		if ( ! empty( $on['uzsakyti'] ) && self::lentele_yra( self::a() ) ) {
			$a = self::a(); $e = self::e(); $lead = (float) self::riba( 'lead_d' );
			$max = $wpdb->get_var( "SELECT MAX(data) FROM $a" );
			if ( $max ) {
				$r = $wpdb->get_results( $wpdb->prepare(
					"SELECT x.preke_id, x.likutis_av, p.k30, p.paj30
					 FROM $a x
					 JOIN (SELECT e.preke_id, SUM(e.kiekis) k30, SUM(e.kaina_ct) paj30 FROM $e e
					       WHERE e.diena >= %s " . str_replace( 'u.', 'e.', self::ts() ) . " GROUP BY e.preke_id) p ON p.preke_id = x.preke_id
					 WHERE x.data = %s AND x.likutis_av IS NOT NULL AND p.k30 > 0
					   AND x.likutis_av / (p.k30 / 30) < %f
					 ORDER BY p.paj30 DESC LIMIT 3", self::pries_d( 29 ), $max, $lead ), ARRAY_A );
				foreach ( (array) $r as $x ) {
					$rate = $x['k30'] / 30; $n = (int) ceil( $rate * 30 - $x['likutis_av'] );
					if ( $n <= 0 ) { continue; }
					$pav = get_the_title( (int) $x['preke_id'] );
					$v[] = array( 'poveikis' => (int) $x['paj30'], 'tekstas' => 'Užsakyti <b>' . esc_html( mb_substr( $pav ? $pav : '#' . $x['preke_id'], 0, 50 ) ) . '</b> ~' . $n . ' vnt. — liko ' . (int) $x['likutis_av'] . ', užtenka ' . number_format( $x['likutis_av'] / max( $rate, 0.01 ), 0, ',', ' ' ) . ' d.',
						'url' => admin_url( 'post.php?post=' . (int) $x['preke_id'] . '&action=edit' ) );
				}
			}
		}

		/* Galiojimas ≤ N d. su likučiu */
		$pt = $wpdb->prefix . 'ps_partijos';
		if ( ! empty( $on['galiojimas'] ) && self::lentele_yra( $pt ) ) {
			$gd = (int) self::riba( 'galiojimas_d' );
			$r = $wpdb->get_row( $wpdb->prepare(
				"SELECT COUNT(DISTINCT product_id) n, SUM(kiekis_liko) vnt, SUM(kiekis_liko * savikaina_eur * 100) verte_ct
				 FROM $pt WHERE kiekis_liko > 0 AND atsaukta = 0 AND geriausia_iki IS NOT NULL AND geriausia_iki <= %s", self::pries_d( -$gd ) ), ARRAY_A );
			if ( $r && (int) $r['n'] > 0 ) {
				$v[] = array( 'poveikis' => (int) $r['verte_ct'], 'tekstas' => 'Trumpo galiojimo akcija: <b>' . (int) $r['n'] . ' prekės</b>, ' . (int) $r['vnt'] . ' vnt., savikaina ' . self::eur( (int) $r['verte_ct'] ) . ' — galioja ≤ ' . $gd . ' d.',
					'url' => admin_url( 'admin.php?page=petshop-akcijos' ) );
			}
		}

		/* Refill praėjo, nepirko */
		$dk = $wpdb->prefix . 'ps_dim_klientai';
		if ( ! empty( $on['refill'] ) && self::lentele_yra( $dk ) ) {
			$rd = (int) self::riba( 'refill_d' );
			$n = (int) $wpdb->get_var(
				"SELECT COUNT(*) FROM $dk WHERE refill_laukiama_at IS NOT NULL AND refill_laukiama_at < UTC_TIMESTAMP() - INTERVAL $rd DAY
				 AND (paskutinis_pirkimas_at IS NULL OR paskutinis_pirkimas_at < refill_laukiama_at) " . ( self::testiniai() ? '' : ' AND testinis = 0' ) );
			if ( $n > 0 ) {
				$aov = (int) $wpdb->get_var( "SELECT AVG(pajamos_ct / GREATEST(uzsakymu_sk,1)) FROM $dk WHERE uzsakymu_sk > 0" );
				$v[] = array( 'poveikis' => $n * $aov, 'tekstas' => '<b>' . $n . ' klientų rizikoje</b> — refill laikas praėjo ≥ ' . $rd . ' d., nepirko. Segmentas į Sender (Klientų analizė, E4).', 'url' => '' );
			}
		}

		/* Kontribucija < 0 */
		if ( ! empty( $on['nuostolingi'] ) ) {
			$u = self::u(); $t = self::ts();
			$r = $wpdb->get_row( $wpdb->prepare( "SELECT COUNT(*) n, COALESCE(SUM(kontribucija_ct),0) s FROM $u u WHERE u.diena >= %s AND u.kontribucija_ct < 0 $t", self::pries_d( 6 ) ), ARRAY_A );
			if ( $r && (int) $r['n'] >= (int) self::riba( 'nuost_gelt' ) ) {
				$v[] = array( 'poveikis' => abs( (int) $r['s'] ), 'tekstas' => '<b>' . (int) $r['n'] . ' nuostolingi užsakymai</b> per 7 d. (' . self::eur( (int) $r['s'] ) . ') — peržiūrėti nemokamo pristatymo ribą / small-cart.', 'url' => self::url_pard( array( 'preset' => '7' ) ) . '#nuostolingi' );
			}
		}
		usort( $v, function ( $a, $b ) { return $b['poveikis'] <=> $a['poveikis']; } );
		return array_slice( $v, 0, 3 );
	}

	/* ==================== 4. VERSLO SARGAS ==================== */

	/** Grąžina patikrų sąrašą: [ ['kodas','lygis'(zalia|geltona|raudona|pilka),'tekstas'] ]. */
	public static function patikros() {
		global $wpdb; $p = $wpdb->prefix; $o = array();
		$add = function ( $k, $l, $t ) use ( &$o ) { $o[] = array( 'kodas' => $k, 'lygis' => $l, 'tekstas' => $t ); };
		$val = (int) self::riba( 'import_val' );
		$launch = get_option( 'ps_paleidimo_data', '' );
		$po_launch = ( $launch && $launch <= self::siandien() );

		/* importai */
		$ids = array_filter( array_map( 'intval', explode( ',', (string) self::riba( 'importai' ) ) ) );
		if ( $ids && self::lentele_yra( $p . 'pmxi_imports' ) ) {
			$r = $wpdb->get_results( "SELECT id, name, last_activity, failed FROM {$p}pmxi_imports WHERE id IN (" . implode( ',', $ids ) . ')', ARRAY_A );
			$rasti = array();
			foreach ( (array) $r as $x ) {
				$rasti[] = (int) $x['id'];
				$val_pr = ( time() - strtotime( $x['last_activity'] . ' UTC' ) ) / 3600;
				$l = ( $val_pr > $val ) ? 'raudona' : 'zalia';
				if ( (int) $x['failed'] > 0 ) { $l = 'raudona'; }
				$add( 'import_' . $x['id'], $l, 'Importas #' . $x['id'] . ' ' . $x['name'] . ': paskutinis prieš ' . number_format( $val_pr, 0, ',', ' ' ) . ' val.' . ( (int) $x['failed'] ? ', failed ' . (int) $x['failed'] : '' ) );
			}
			foreach ( array_diff( $ids, $rasti ) as $id ) { $add( 'import_' . $id, 'raudona', 'Importas #' . $id . ' nerastas pmxi_imports' ); }
		} else { $add( 'importai', 'pilka', 'Importai: šaltinio nėra' ); }

		/* feed'ai */
		$f = get_option( 'ps_feeds_paskutinis', array() );
		if ( is_array( $f ) && ! empty( $f['kada'] ) ) {
			$h = ( time() - strtotime( $f['kada'] ) ) / 3600;
			$add( 'feeds', ( $h > $val ) ? 'raudona' : 'zalia', 'Feed\'ai Kaina24/Kainos: generuoti prieš ' . number_format( $h, 0, ',', ' ' ) . ' val.' );
		} else { $add( 'feeds', 'pilka', 'Feed\'ai: `ps_feeds_paskutinis` tuščias' ); }

		/* faktų vientisumas: Woo apmokėti (processing/completed) ⊆ ps_fakt_uzsakymai */
		$u = self::u(); $sp = self::stat_pradzia();
		$nuo_sql = $sp ? $wpdb->prepare( ' AND o.date_created_gmt >= %s', $sp . ' 00:00:00' ) : '';
		$tr = $wpdb->get_col( "SELECT o.id FROM {$p}wc_orders o WHERE o.type = 'shop_order' AND o.status IN ('wc-processing','wc-completed') $nuo_sql AND NOT EXISTS (SELECT 1 FROM $u u WHERE u.uzsakymas_id = o.id) ORDER BY o.id DESC LIMIT 20" );
		$add( 'faktai', $tr ? 'raudona' : 'zalia', $tr ? 'Faktų trūksta ' . count( $tr ) . ' apmokėtiems užsakymams: #' . implode( ', #', array_slice( $tr, 0, 8 ) ) : 'Faktai: visi apmokėti užsakymai turi faktą' );

		/* agregatas už vakar (tik jei vakar buvo užsakymų) */
		$vakar = self::pries_d( 1 );
		$buvo = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $u u WHERE u.diena = %s", $vakar ) );
		if ( $buvo ) {
			$agr = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$p}ps_ataskaitu_dienos WHERE diena = %s AND sritis = 'pardavimai'", $vakar ) );
			$add( 'agregatas', $agr ? 'zalia' : 'raudona', 'Agregatas ' . $vakar . ': ' . ( $agr ? $agr . ' eil.' : 'TUŠČIAS, nors užsakymų buvo ' . $buvo ) );
		} else { $add( 'agregatas', 'zalia', 'Agregatas ' . $vakar . ': užsakymų nebuvo' ); }

		/* ps_shipments našlaičiai */
		if ( self::lentele_yra( $p . 'ps_shipments' ) ) {
			$n = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$p}ps_shipments s WHERE NOT EXISTS (SELECT 1 FROM {$p}wc_orders o WHERE o.id = s.order_id)" );
			$add( 'siuntu_naslaiciai', $n ? 'raudona' : 'zalia', 'ps_shipments našlaičiai: ' . $n );
		}
		/* AVPN numeracija (S1719): dublikatai — raudona, spragos (be 011016) — geltona */
		try {
			$db_ = $GLOBALS['wpdb'];
			$av_ = $db_->get_col( "SELECT meta_value FROM {$db_->prefix}wc_orders_meta WHERE meta_key='_petshop_avpn_number' AND meta_value LIKE 'AVPN%'" );
			$cnt_ = array_count_values( $av_ ); $dubl_ = array_keys( array_filter( $cnt_, function( $n ) { return $n > 1; } ) );
			$nums_ = array(); foreach ( $av_ as $x_ ) { $nums_[] = (int) substr( $x_, 4 ); } $nums_ = array_values( array_unique( $nums_ ) ); sort( $nums_ ); $gaps_ = array();
			for ( $i_ = 1; $i_ < count( $nums_ ); $i_++ ) { for ( $k_ = $nums_[ $i_ - 1 ] + 1; $k_ < $nums_[ $i_ ]; $k_++ ) { if ( 11016 !== $k_ ) { $gaps_[] = $k_; } } }
			$add( 'avpn', $dubl_ ? 'raudona' : ( $gaps_ ? 'geltona' : 'zalia' ), 'AVPN numeracija: ' . ( $dubl_ ? 'DUBLIKATAI ' . implode( ', ', $dubl_ ) : 'be dublikatų (' . count( $av_ ) . ')' ) . ( $gaps_ ? '; spragos ' . implode( ', ', array_slice( $gaps_, 0, 10 ) ) : '' ) );
		} catch ( \Throwable $e_ ) { $add( 'avpn', 'pilka', 'AVPN patikra nepavyko: ' . $e_->getMessage() ); }
		/* pakuočių šeimų automatas (S1721, petshop-dydziai-automatas) */
		if ( class_exists( 'Petshop_Dydziu_Automatas' ) ) {
			try { $sv_ = Petshop_Dydziu_Automatas::suvestine( 26 ); $add( 'seimos', $sv_[2] ? 'raudona' : ( $sv_[1] ? 'geltona' : 'zalia' ), $sv_[3] ); }
			catch ( \Throwable $e_ ) { $add( 'seimos', 'pilka', 'Šeimų automatas: ' . $e_->getMessage() ); }
		}
		/* DP pakų kainos (S1722, petshop-dp-kainos) */
		if ( class_exists( 'Petshop_DP_Kainos' ) ) {
			try { $dk_ = Petshop_DP_Kainos::suvestine(); $add( 'dp_kainos', $dk_[0], $dk_[1] ); }
			catch ( \Throwable $e_ ) { $add( 'dp_kainos', 'pilka', 'DP kainos: ' . $e_->getMessage() ); }
		}
		/* botų užtvara (S1724, petshop-botu-sargas v1.2: vakarykštis access log archyvas) */
		if ( class_exists( 'Petshop_Botu_Sargas' ) && method_exists( 'Petshop_Botu_Sargas', 'uztvara_suvestine' ) ) {
			try { $bu_ = Petshop_Botu_Sargas::uztvara_suvestine(); $add( 'botu_uztvara', $bu_[0], $bu_[1] ); }
			catch ( \Throwable $e_ ) { $add( 'botu_uztvara', 'pilka', 'Botų užtvara: ' . $e_->getMessage() ); }
		}
		/* rinkiniai be nuotraukos (S1724): publikuoti MnM rinkiniai, kurių thumbnail nėra arba failo diske nėra */
		try {
			$rk_ = $wpdb->get_results( "SELECT p.ID, p.post_title, (SELECT meta_value FROM {$wpdb->postmeta} WHERE post_id = p.ID AND meta_key = '_thumbnail_id' LIMIT 1) thumb FROM {$wpdb->posts} p JOIN {$wpdb->term_relationships} tr ON tr.object_id = p.ID JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id AND tt.taxonomy = 'product_type' JOIN {$wpdb->terms} t ON t.term_id = tt.term_id AND t.slug = 'mix-and-match' WHERE p.post_type = 'product' AND p.post_status = 'publish'", ARRAY_A );
			$be_ = array();
			foreach ( (array) $rk_ as $x_ ) { $tid_ = (int) $x_['thumb']; $ok_ = $tid_ && ( $fp_ = get_attached_file( $tid_ ) ) && is_file( $fp_ ); if ( ! $ok_ ) { $pr_ = function_exists( 'wc_get_product' ) ? wc_get_product( (int) $x_['ID'] ) : null; $iid_ = $pr_ ? (int) $pr_->get_image_id() : 0; if ( ! $iid_ || ! ( $fp_ = get_attached_file( $iid_ ) ) || ! is_file( $fp_ ) ) $be_[] = '#' . $x_['ID'] . ' ' . mb_substr( $x_['post_title'], 0, 30 ); } }
			$add( 'rinkiniai_foto', $be_ ? ( count( $be_ ) >= 3 ? 'raudona' : 'geltona' ) : 'zalia', 'Rinkiniai be nuotraukos: ' . count( $be_ ) . ' iš ' . count( (array) $rk_ ) . ( $be_ ? ' — ' . implode( ', ', array_slice( $be_, 0, 4 ) ) : '' ) );
		} catch ( \Throwable $e_ ) { $add( 'rinkiniai_foto', 'pilka', 'Rinkiniai be nuotraukos: ' . $e_->getMessage() ); }
		/* neišsiųsti */
		$n = self::neissiusti_sk();
		$add( 'neissiusti', $n >= (int) self::riba( 'neissiusti_raud' ) ? 'raudona' : ( $n ? 'geltona' : 'zalia' ), 'Apmokėti > 2 d. be siuntos: ' . $n );

		/* dropship SLA (petshop-dropship-sargas žymė) */
		$n = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$p}wc_orders_meta m JOIN {$p}wc_orders o ON o.id = m.order_id WHERE m.meta_key = '_ps_sla_velavimas' AND o.status IN ('wc-processing','wc-on-hold')" );
		$add( 'dropship_sla', $n ? 'raudona' : 'zalia', 'Dropship tiekėjas vėluoja > 2 darbo d.: ' . $n . ' užsak.' );

		/* laiškai */
		if ( self::lentele_yra( $p . 'ps_email_jobs' ) ) {
			$r = $wpdb->get_row( "SELECT SUM(status='sent') s, SUM(status='failed') f FROM {$p}ps_email_jobs WHERE created_at >= UTC_TIMESTAMP() - INTERVAL 1 DAY", ARRAY_A );
			$s = (int) $r['s']; $f2 = (int) $r['f'];
			$add( 'laiskai', ( $f2 && ( $s + $f2 ) && $f2 / ( $s + $f2 ) > 0.05 ) ? 'raudona' : ( $f2 ? 'geltona' : 'zalia' ), 'Laiškai 24 val.: išsiųsta ' . $s . ', nepavyko ' . $f2 );
		}
		/* eventai */
		if ( self::lentele_yra( $p . 'ps_event_log' ) ) {
			$f3 = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$p}ps_event_log WHERE status = 'failed' AND emitted_at >= UTC_TIMESTAMP() - INTERVAL 1 DAY" );
			$nutilo = $wpdb->get_col( "SELECT event_name FROM {$p}ps_event_log WHERE emitted_at >= UTC_TIMESTAMP() - INTERVAL 35 DAY GROUP BY event_name
				HAVING SUM(emitted_at >= UTC_TIMESTAMP() - INTERVAL 7 DAY) = 0 AND SUM(emitted_at < UTC_TIMESTAMP() - INTERVAL 7 DAY) >= 4" );
			$add( 'eventai', $f3 ? 'raudona' : ( $nutilo ? 'geltona' : 'zalia' ), 'Eventai: failed 24 val. ' . $f3 . ( $nutilo ? '; nutilo 7 d.: ' . implode( ', ', $nutilo ) : '' ) );
		}
		/* Google Ads webhook: jei kada gauta — turi ateiti kasdien */
		$ap = get_option( 'ps_ads_paskutinis', array() );
		if ( is_array( $ap ) && ! empty( $ap['kada'] ) ) {
			$h = ( time() - strtotime( $ap['kada'] . ' UTC' ) ) / 3600;
			$add( 'ads', ( $h > 50 ) ? 'raudona' : 'zalia', 'Google Ads duomenys: paskutinį kartą prieš ' . number_format( $h, 0, ',', ' ' ) . ' val. (' . (int) $ap['eiluciu'] . ' eil.)' . ( $h > 50 ? ' — Ads Script nesuveikė (autorizacija? tvarkaraštis?)' : '' ) );
		} else { $add( 'ads', 'pilka', 'Google Ads duomenys: dar negauta' ); }

		/* 404 ir beacon — po launch */
		if ( self::lentele_yra( $p . 'ps_web_ivykiai' ) ) {
			$r = $wpdb->get_row( $wpdb->prepare(
				"SELECT SUM(diena = %s AND tipas = 'error404') v404, SUM(diena BETWEEN %s AND %s AND tipas = 'error404') / 7 vid404, SUM(diena = %s) viso
				 FROM {$p}ps_web_ivykiai WHERE diena BETWEEN %s AND %s", $vakar, self::pries_d( 8 ), self::pries_d( 2 ), $vakar, self::pries_d( 8 ), $vakar ), ARRAY_A );
			$v404 = (int) $r['v404']; $vid = (float) $r['vid404'];
			$l = 'zalia'; if ( $vid > 0 && $v404 > 3 * $vid ) { $l = 'raudona'; } elseif ( $vid == 0 && $v404 > 20 ) { $l = 'geltona'; }
			$add( '404', $l, '404 vakar: ' . $v404 . ' (7 d. vid. ' . number_format( $vid, 1, ',', ' ' ) . ')' );
			if ( $po_launch ) { $add( 'beacon', (int) $r['viso'] ? 'zalia' : 'raudona', 'Web įvykiai vakar: ' . (int) $r['viso'] . ( (int) $r['viso'] ? '' : ' — beacon nerašo' ) ); }
			else { $add( 'beacon', 'pilka', 'Web įvykiai vakar: ' . (int) $r['viso'] . ' (iki launch nevertinama)' ); }
		}
		return $o;
	}

	/** Cron: patikra + laiškas TIK jei raudona. $priverstinai — iš mygtuko, laiško nesiunčia. */
	public static function sargas_cron( $priverstinai = false ) {
		$pt = self::patikros();
		$raud = array(); $gelt = array(); $z = 0;
		foreach ( $pt as $x ) {
			if ( 'raudona' === $x['lygis'] ) { $raud[] = $x; } elseif ( 'geltona' === $x['lygis'] ) { $gelt[] = $x; } elseif ( 'zalia' === $x['lygis'] ) { $z++; }
		}
		update_option( self::OPT_PASK, array( 'laikas' => current_time( 'mysql', true ), 'raudonos' => $raud, 'geltonos' => $gelt, 'zalios' => $z, 'viso' => count( $pt ) ), false );
		if ( $priverstinai || ! $raud || ! (int) self::riba( 'laiskai' ) ) { return array( 'raud' => count( $raud ), 'siusta' => false ); }
		/* tas pats raudonųjų rinkinys — kartą per parą */
		$par = md5( implode( '|', wp_list_pluck( $raud, 'kodas' ) ) );
		$s = get_option( self::OPT_SIUSTA, array() ); $s = is_array( $s ) ? $s : array();
		if ( isset( $s[ $par ] ) && $s[ $par ] === self::siandien() ) { return array( 'raud' => count( $raud ), 'siusta' => false ); }
		$s[ $par ] = self::siandien(); if ( count( $s ) > 60 ) { $s = array_slice( $s, -30, null, true ); }
		update_option( self::OPT_SIUSTA, $s, false );
		$t = "RAUDONA (" . count( $raud ) . "):\n";
		foreach ( $raud as $x ) { $t .= '  • ' . $x['tekstas'] . "\n"; }
		if ( $gelt ) { $t .= "\nGeltona (" . count( $gelt ) . "):\n"; foreach ( $gelt as $x ) { $t .= '  • ' . $x['tekstas'] . "\n"; } }
		$t .= "\nRytas: " . admin_url( 'admin.php?page=' . self::TEVAS ) . "\nTas pats raudonųjų rinkinys šią parą daugiau nesiunčiamas.\n";
		$html = '<html><body style="margin:0;padding:16px"><pre style="font:13px/1.5 Consolas,Menlo,monospace;white-space:pre;margin:0">' . esc_html( $t ) . '</pre></body></html>';
		$ok = wp_mail( get_option( 'ps_sargas_pastas', get_option( 'admin_email' ) ), '[Petshop] Rytas: ' . count( $raud ) . ' raudonos', $html, array( 'Content-Type: text/html; charset=UTF-8' ) );
		return array( 'raud' => count( $raud ), 'siusta' => (bool) $ok );
	}

	/* ==================== EKRANAS ==================== */

	public static function render() {
		if ( ! current_user_can( self::CAP ) ) { wp_die( 'Neturite teisių.' ); }
		$UI = class_exists( 'Petshop_Ataskaitu_UI' ) ? 'Petshop_Ataskaitu_UI' : null;
		$rez = ( isset( $_GET['rez'] ) && '30' === $_GET['rez'] ) ? '30' : 'men';
		$lt  = self::laikotarpiai( $rez );
		$sk  = self::skaiciai( $lt );
		$t_url = admin_url( 'admin.php?page=' . self::TEVAS . '&rez=' . $rez . ( self::testiniai() ? '' : '&testiniai=1' ) );

		echo '<div class="wrap psru psr">';
		echo '<h1 style="display:flex;align-items:center;gap:14px">Rytas <span class="psr-data">' . esc_html( wp_date( 'l, Y-m-d' ) ) . '</span></h1>';
		if ( ! empty( $_GET['issaugota'] ) ) { echo '<div class="notice notice-success is-dismissible"><p>Ribos išsaugotos.</p></div>'; }
		if ( ! empty( $_GET['patikrinta'] ) ) { echo '<div class="notice notice-success is-dismissible"><p>Sistema patikrinta (laiškas iš mygtuko nesiunčiamas).</p></div>'; }
		if ( self::testiniai() ) { echo '<div class="psru-spejimas"><b>Rodomi IR testiniai įrašai.</b> <a href="' . esc_url( remove_query_arg( 'testiniai', $t_url ) ) . '">✕ slėpti</a></div>'; }

		/* Sistema */
		$pk = get_option( self::OPT_PASK, array() );
		echo '<div class="psr-sistema">';
		if ( ! is_array( $pk ) || empty( $pk['laikas'] ) ) {
			echo '<span class="psr-dot pilka"></span> Sistema: dar netikrinta.';
		} else {
			$r = count( (array) $pk['raudonos'] ); $g = count( (array) $pk['geltonos'] );
			echo '<span class="psr-dot ' . ( $r ? 'raudona' : ( $g ? 'geltona' : 'zalia' ) ) . '"></span> Sistema: '
				. ( $r ? '<b>' . $r . ' raudonos</b>' : '✓' ) . ( $g ? ' · ' . $g . ' geltonos' : '' )
				. ' <span class="psru-mut">(' . esc_html( wp_date( 'm-d H:i', strtotime( $pk['laikas'] . ' UTC' ) ) ) . ')</span>';
			if ( $r || $g ) {
				echo '<details style="display:inline-block;margin-left:10px"><summary style="cursor:pointer;display:inline">detalės</summary><ul style="margin:6px 0 0 18px">';
				foreach ( array_merge( (array) $pk['raudonos'], (array) $pk['geltonos'] ) as $x ) { echo '<li><span class="psr-dot ' . esc_attr( $x['lygis'] ) . '"></span> ' . esc_html( $x['tekstas'] ) . '</li>'; }
				echo '</ul></details>';
			}
		}
		echo ' <a class="psr-mini" href="' . esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=ps_rytas_tikrinti' ), 'ps_rytas_tikrinti' ) ) . '">tikrinti dabar</a>';
		echo '</div>';

		/* 8 skaičiai */
		echo '<div class="psr-rez">';
		foreach ( array( 'men' => 'Šis mėnuo', '30' => '30 d.' ) as $k => $v ) {
			echo '<a class="psr-tab' . ( $k === $rez ? ' akt' : '' ) . '" href="' . esc_url( admin_url( 'admin.php?page=' . self::TEVAS . '&rez=' . $k . ( self::testiniai() ? '&testiniai=1' : '' ) ) ) . '">' . esc_html( $v ) . '</a>';
		}
		echo '<span class="psru-mut">' . esc_html( $lt['uzrasas'] ) . ': ' . esc_html( $lt['nuo'] . ' – ' . $lt['iki'] ) . ' vs ' . esc_html( $lt['p_nuo'] . ' – ' . $lt['p_iki'] ) . '</span>';
		if ( ! self::testiniai() ) { echo ' <a class="psr-mini" href="' . esc_url( $t_url ) . '">rodyti ir testinius</a>'; }
		echo '</div>';

		if ( ! $sk ) {
			echo '<p>Modulis <code>petshop-ataskaita-pardavimai.php</code> nerastas — skaičių nėra.</p>';
		} elseif ( 0 === $sk['dabar']['uzsakymai'] && 0 === $sk['buvo_uzs'] ) {
			echo '<div class="psru-tuscia"><b>Užsakymų šiuo laikotarpiu nėra.</b> ' . ( self::stat_pradzia() ? 'Statistikos pradžia: ' . esc_html( self::stat_pradzia() ) . '.' : '' ) . '</div>';
		} else {
			$d = $sk['dabar']; $b = $sk['buvo'];
			$k = array(
				array( 'Kontribucija', self::eur( $d['kontribucija'] ), self::delta_html( $d['kontribucija'], $b['kontribucija'] ), self::url_pard( array( 'preset' => $rez === '30' ? '30' : 'menuo' ) ), 'Kas lieka po užsakymo: antkainis + pristatymas iš kliento − pristatymo savikaina − mokėjimas − pakuotė − taškai − dovanos.', true ),
				array( 'Pajamos', self::eur( $d['pajamos'] ), self::delta_html( $d['pajamos'], $b['pajamos'] ), self::url_pard( array( 'preset' => $rez === '30' ? '30' : 'menuo' ) ), 'Prekių suma be PVM po nuolaidų.' ),
				array( 'Antkainis %', null === $d['antkainis_p'] ? '—' : number_format( $d['antkainis_p'], 1, ',', ' ' ) . ' %', self::delta_html( $d['antkainis_p'], $b['antkainis_p'], true ), self::url_pard( array( 'preset' => $rez === '30' ? '30' : 'menuo', 'pjuvis' => 'tiekejas' ) ), 'Nuo savikainos.' ),
				array( 'Užsakymai', number_format( $d['uzsakymai'], 0, ',', ' ' ), self::delta_html( $d['uzsakymai'], $b['uzsakymai'] ), self::url_pard( array( 'preset' => $rez === '30' ? '30' : 'menuo' ) ), 'Apmokėti užsakymai.' ),
				array( 'Vid. užsakymas', self::eur( $d['aov'] ), self::delta_html( $d['aov'], $b['aov'] ), '', 'Pajamos / užsakymai.' ),
				array( 'Nauji klientai', number_format( $d['nauji'], 0, ',', ' ' ), self::delta_html( $d['nauji'], $b['nauji'] ), self::url_pard( array( 'preset' => $rez === '30' ? '30' : 'menuo', 'pjuvis' => 'klientas' ) ), 'Pirmas šio el. pašto pirkimas.' ),
				array( 'Grįžtančių dalis', null === $d['griztanciu_p'] ? '—' : number_format( $d['griztanciu_p'], 0, ',', ' ' ) . ' %', self::delta_html( $d['griztanciu_p'], $b['griztanciu_p'], true ), self::url_pard( array( 'preset' => $rez === '30' ? '30' : 'menuo', 'pjuvis' => 'klientas' ) ), 'Grįžtančių užsakymų dalis.' ),
				array( 'Nuostolingi', number_format( $d['nuostolingi'], 0, ',', ' ' ), self::delta_html( $d['nuostolingi'], $b['nuostolingi'], false, true ), self::url_pard( array( 'preset' => $rez === '30' ? '30' : 'menuo' ) ) . '#nuostolingi', 'Užsakymai su neigiama kontribucija.' ),
			);
			echo '<div class="psr-grid8">';
			foreach ( $k as $x ) {
				$tag = $x[3] ? 'a' : 'div';
				echo '<' . $tag . ( $x[3] ? ' href="' . esc_url( $x[3] ) . '"' : '' ) . ' class="psr-k' . ( ! empty( $x[5] ) ? ' psr-k-main' : '' ) . '" title="' . esc_attr( $x[4] ) . '">';
				echo '<h3>' . esc_html( $x[0] ) . '</h3><div class="psr-v">' . wp_kses_post( $x[1] ) . '</div>' . $x[2];
				echo '</' . $tag . '>';
			}
			echo '</div>';
			if ( 0 === $sk['buvo_uzs'] ) { echo '<p class="psru-pastaba">Ankstesniu laikotarpiu užsakymų nebuvo — pokyčiai nerodomi.</p>'; }
			$rk = self::reklama( self::apkarpyti( $lt['nuo'] ), $lt['iki'] );
			if ( $rk ) {
				echo '<div class="psr-sistema" style="margin-top:6px">Reklama: išlaidos <b>' . esc_html( self::eur( $rk['isl'] ) ) . '</b> · iš mokamų kanalų ' . (int) $rk['n'] . ' užs., pajamos <b>' . esc_html( self::eur( $rk['paj'] ) ) . '</b>, kontribucija <b>' . esc_html( self::eur( $rk['kontr'] ) ) . '</b> · <b style="color:' . ( $rk['po'] < 0 ? '#b32d2e' : '#00753a' ) . '">po reklamos ' . esc_html( self::eur( $rk['po'] ) ) . '</b>'
					. ( null !== $rk['poas'] ? ' · POAS ' . esc_html( number_format( $rk['poas'], 2, ',', ' ' ) ) : ' · išlaidų nėra' )
					. ' <a class="psr-mini" href="' . esc_url( self::url_pard( array( 'preset' => $rez === '30' ? '30' : 'menuo', 'pjuvis' => 'kampanija' ) ) ) . '">per kampaniją</a></div>';
			}
		}

		/* Lemputės */
		echo '<h2 class="psr-h2">Kas dega</h2><div class="psr-lemp">';
		foreach ( self::lemputes() as $l ) {
			$tag = $l['url'] ? 'a' : 'div';
			echo '<' . $tag . ( $l['url'] ? ' href="' . esc_url( $l['url'] ) . '"' : '' ) . ' class="psr-l"><span class="psr-dot ' . esc_attr( $l['spalva'] ) . '"></span><b>' . esc_html( $l['pav'] ) . '</b><span>' . esc_html( $l['tekstas'] ) . '</span></' . $tag . '>';
		}
		echo '</div>';

		/* Veiksmai */
		echo '<h2 class="psr-h2">Ką daryti</h2>';
		$v = self::veiksmai();
		if ( ! $v ) { echo '<p class="psru-mut">Taisyklės nieko nesiūlo — gerai.</p>'; }
		else {
			echo '<ol class="psr-veiksmai">';
			foreach ( $v as $x ) { echo '<li>' . wp_kses_post( $x['tekstas'] ) . ( $x['url'] ? ' <a href="' . esc_url( $x['url'] ) . '">→</a>' : '' ) . '</li>'; }
			echo '</ol>';
		}

		/* Kortelės */
		self::korteles();

		/* Ribos */
		self::ribos_forma();

		echo '</div>';
		if ( $UI ) { $UI::stilius(); }
		self::css();
	}

	private static function korteles() {
		global $submenu;
		$punktai = isset( $submenu[ self::TEVAS ] ) ? $submenu[ self::TEVAS ] : array();
		$aprasai = apply_filters( 'petshop_ataskaitu_aprasai', array(
			'petshop-reports-anketa'    => 'Anketos piltuvėlis, rekomendacijų gedimai, paklausa, duomenų kokybė, refill ir pinigai.',
			'petshop-reports-rinkiniai' => 'Surenkamų rinkinių pardavimai, marža ir vitrinos elgsena.',
			'petshop-reports-paruosti'  => 'Paruoštų rinkinių ataskaita.',
			'petshop-reports-brandai'   => 'Kliento įvestų prekių ženklų susiejimas su katalogu.',
		) );
		$analize = array( 'ps-pardavimai', 'ps-klientai', 'ps-prekes', 'ps-atsargos', 'ps-menuo' );
		$nustat  = array( 'ps-islaidos', 'ps-tarifai' );
		$grupes  = array( 'Analizė' => array(), 'Nustatymai' => array(), 'Įrankiai' => array() );
		foreach ( $punktai as $p ) {
			$slug = isset( $p[2] ) ? $p[2] : ''; if ( '' === $slug || self::TEVAS === $slug ) { continue; }
			$g = in_array( $slug, $analize, true ) ? 'Analizė' : ( in_array( $slug, $nustat, true ) ? 'Nustatymai' : 'Įrankiai' );
			$grupes[ $g ][] = array( wp_strip_all_tags( $p[0] ), $slug, isset( $aprasai[ $slug ] ) ? $aprasai[ $slug ] : '' );
		}
		foreach ( $grupes as $g => $k ) {
			if ( ! $k ) { continue; }
			echo '<h2 class="psr-h2">' . esc_html( $g ) . '</h2><div class="psr-kort' . ( 'Analizė' === $g ? ' psr-kort-big' : '' ) . '">';
			foreach ( $k as $x ) {
				echo '<a class="psr-c" href="' . esc_url( admin_url( 'admin.php?page=' . $x[1] ) ) . '"><span class="psr-ch">' . esc_html( $x[0] ) . '</span>' . ( $x[2] ? '<span class="psr-cd">' . esc_html( $x[2] ) . '</span>' : '' ) . '</a>';
			}
			echo '</div>';
		}
	}

	private static function ribos_forma() {
		$n = self::ribos_numatytos(); $on = self::veiksmai_ijungti();
		$lab = array(
			'pajamos_gelt' => 'Pajamos ↓ geltona, %', 'pajamos_raud' => 'Pajamos ↓ raudona, %',
			'nauji_gelt' => 'Nauji klientai ↓ geltona, %', 'nauji_raud' => 'Nauji klientai ↓ raudona, %',
			'nuost_gelt' => 'Nuostolingi / 7 d. geltona', 'nuost_raud' => 'Nuostolingi / 7 d. raudona',
			'stockout_gelt' => 'A-stockout geltona', 'stockout_raud' => 'A-stockout raudona',
			'neissiusti_gelt' => 'Neišsiųsti geltona', 'neissiusti_raud' => 'Neišsiųsti raudona',
			'lead_d' => 'Tiekėjo lead time + buferis, d.', 'galiojimas_d' => 'Galiojimas ≤ d.', 'refill_d' => 'Refill praėjo ≥ d.',
			'importai' => 'Importų ID (pmxi), kableliais', 'import_val' => 'Importas/feed pasenęs po, val.', 'laiskai' => 'Sargo laiškai (1/0)', 'poas_gelt' => 'Reklama: POAS geltona žemiau',
		);
		echo '<details class="psr-ribos"><summary>Ribos ir taisyklės</summary><form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
		wp_nonce_field( 'ps_rytas_ribos' ); echo '<input type="hidden" name="action" value="ps_rytas_ribos">';
		echo '<div class="psr-ribos-grid">';
		foreach ( $n as $k => $d ) { echo '<label>' . esc_html( $lab[ $k ] ) . '<input type="text" name="' . esc_attr( $k ) . '" value="' . esc_attr( self::riba( $k ) ) . '"></label>'; }
		echo '</div><p>Veiksmai: ';
		foreach ( array( 'uzsakyti' => 'Užsakyti', 'galiojimas' => 'Trumpas galiojimas', 'refill' => 'Refill rizika', 'nuostolingi' => 'Nuostolingi' ) as $k => $v ) {
			echo '<label style="margin-right:14px"><input type="checkbox" name="v_' . esc_attr( $k ) . '" value="1"' . ( ! empty( $on[ $k ] ) ? ' checked' : '' ) . '> ' . esc_html( $v ) . '</label>';
		}
		if ( class_exists( 'Petshop_Fakt_Reklama' ) ) {
			$pk = get_option( 'ps_ads_paskutinis', array() );
			echo '</p><p class="psru-mut">Google Ads webhook: <code>' . esc_html( rest_url( 'ps-web/v1/ads' ) ) . '</code> · raktas <code>' . esc_html( (string) get_option( 'ps_ads_raktas' ) ) . '</code>'
				. ( is_array( $pk ) && ! empty( $pk['kada'] ) ? ' · paskutinis gavimas ' . esc_html( wp_date( 'm-d H:i', strtotime( $pk['kada'] . ' UTC' ) ) ) . ' (' . (int) $pk['eiluciu'] . ' eil.)' : ' · dar negauta' );
		}
		echo '</p><p><button class="button button-primary">Išsaugoti</button> <span class="psru-mut">Tuščias laukas = numatytoji reikšmė.</span></p></form></details>';
	}

	private static function css() {
		echo '<style>
.psr .psr-data{font-size:13px;font-weight:400;color:#787c82}
.psr-sistema{font-size:13px;color:#1d2327;margin:4px 0 14px;padding:8px 12px;background:#fff;border:1px solid #dcdcde;border-radius:4px}
.psr-mini{font-size:12px;margin-left:8px}
.psr-rez{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 10px;font-size:13px}
.psr-tab{padding:5px 12px;border:1px solid #dcdcde;border-radius:4px;background:#fff;text-decoration:none;color:#1d2327}
.psr-tab.akt{background:#1d2327;color:#fff;border-color:#1d2327}
.psr-grid8{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:0 0 6px}
.psr-k{display:block;background:#fff;border:1px solid #dcdcde;border-radius:6px;padding:14px 16px;text-decoration:none;color:inherit}
a.psr-k:hover{border-color:#2271b1}
.psr-k h3{margin:0 0 6px;font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#646970;font-weight:600}
.psr-v{font-size:26px;font-weight:600;line-height:1.1;color:#1d2327;margin-bottom:4px}
.psr-k-main{border-color:#135e96;box-shadow:inset 3px 0 0 #135e96}.psr-k-main .psr-v{font-size:32px;color:#135e96}
.psr-delta{font-size:12px;font-weight:600}.psr-delta.up{color:#00753a}.psr-delta.down{color:#b32d2e}.psr-delta.neut{color:#8c8f94}
.psr-h2{font-size:14px;margin:22px 0 8px;color:#1d2327}
.psr-lemp{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
.psr-l{display:flex;flex-direction:column;gap:3px;background:#fff;border:1px solid #dcdcde;border-radius:6px;padding:10px 12px;font-size:12.5px;color:#50575e;text-decoration:none}
.psr-l b{color:#1d2327}a.psr-l:hover{border-color:#2271b1}
.psr-dot{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:6px;vertical-align:-1px;background:#c3c4c7}
.psr-dot.zalia{background:#00a32a}.psr-dot.geltona{background:#dba617}.psr-dot.raudona{background:#d63638}.psr-dot.pilka{background:#c3c4c7}
.psr-veiksmai{background:#fff;border:1px solid #dcdcde;border-radius:6px;padding:10px 14px 10px 32px;margin:0;font-size:13.5px}.psr-veiksmai li{margin:5px 0}
.psr-kort{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}.psr-kort-big{grid-template-columns:repeat(3,1fr)}
.psr-c{display:block;background:#fff;border:1px solid #dcdcde;border-radius:6px;padding:12px 14px;text-decoration:none;color:inherit}.psr-c:hover{border-color:#2271b1}
.psr-kort-big .psr-c{padding:16px 18px;border-color:#c8d7e4}
.psr-ch{display:block;font-size:14px;font-weight:600;color:#2271b1;margin-bottom:3px}.psr-cd{display:block;font-size:12px;line-height:1.4;color:#646970}
.psr-ribos{margin-top:24px;font-size:13px}.psr-ribos summary{cursor:pointer;color:#646970}
.psr-ribos-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px 14px;margin:10px 0}.psr-ribos-grid label{display:flex;flex-direction:column;font-size:12px;color:#50575e}.psr-ribos-grid input{margin-top:3px}
@media(max-width:1100px){.psr-grid8{grid-template-columns:repeat(2,1fr)}.psr-lemp{grid-template-columns:repeat(3,1fr)}}
</style>';
	}
}
Petshop_Rytas::init();
