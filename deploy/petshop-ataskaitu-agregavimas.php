<?php
/**
 * Plugin Name: Petshop Ataskaitu Agregavimas
 * Description: Dienos suvestine (`ps_ataskaitu_dienos`) — naktinis cron + siandienos sluoksnis.
 * Version: 1.0
 *
 * KODEL SIS MODULIS. Ekranai NIEKADA neskaito visu uzsakymu uzklausos metu:
 * su tukstanciais uzsakymu tai lemtu leta puslapi ir atminties rizika (v1.1
 * ataskaita taip ir dare — `limit => -1`). Vietoj to naktis suskaiciuoja
 * diena, o ekranas sumuoja paruostas eilutes.
 *
 * Tvarka (spec v1.1 §5):
 *   03:15 -> agreguojam vakar (+ persukam paskutines 3 dienas del velyvu
 *   pakeitimu) -> tik po to statistikos valymas gali trinti zalius ivykius.
 *
 * Idempotencija: dienos eilutes pirma TRINAMOS, tada rasomos is naujo. Todel
 * ta pacia diena galima persukti kiek nori kartu — rezultatas nesidubliuoja.
 *
 * Pinigai — CENTAIS (INT), kad nebutu float paklaidu sumuojant.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Ataskaitu_Agregavimas {

	const VERSIJA   = '1.0';
	const CRON      = 'ps_ataskaitu_agregavimas';
	const PERSUKTI  = 3;    /* kiek paskutiniu dienu persukti kas nakti */
	const TRANSIENT = 'ps_ata_siandien_';
	const KESO_SEK  = 300;  /* siandienos sluoksnis — 5 min. */

	public static function init() {
		add_action( self::CRON, array( __CLASS__, 'nakties_darbas' ) );
		if ( ! wp_next_scheduled( self::CRON ) ) {
			/* 03:15 vietos laiku artimiausia diena. */
			$dabar = current_time( 'timestamp' );
			$kada  = strtotime( gmdate( 'Y-m-d', $dabar ) . ' 03:15:00' );
			if ( $kada <= $dabar ) { $kada += DAY_IN_SECONDS; }
			wp_schedule_event( $kada - ( get_option( 'gmt_offset' ) * HOUR_IN_SECONDS ), 'daily', self::CRON );
		}
	}

	private static function lentele() {
		return Petshop_Statistika::lentele_dienos();
	}

	private static function ivykiai() {
		return Petshop_Statistika::lentele();
	}

	private static function aplinka() {
		return Petshop_Statistika::aplinka();
	}

	/** Eurai -> centai. Vienoda taisykle visur, kad sumos sutaptu. */
	public static function ct( $eurai ) {
		return (int) round( ( (float) $eurai ) * 100 );
	}

	/* ==================== CRON ==================== */

	public static function nakties_darbas() {
		$siandien = current_time( 'Y-m-d' );
		for ( $i = 1; $i <= self::PERSUKTI; $i++ ) {
			$d = gmdate( 'Y-m-d', strtotime( $siandien . ' -' . $i . ' day' ) );
			self::agreguoti_diena( $d );
		}
		update_option( 'ps_ata_paskutinis_agregavimas', current_time( 'mysql' ), false );
	}

	/**
	 * Viena diena: elgsena + isvestiniai sekos rodikliai + pardavimai.
	 * Grazina irasytu eiluciu skaiciu (diagnostikai).
	 */
	public static function agreguoti_diena( $diena ) {
		global $wpdb;
		$t = self::lentele();
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) !== $t ) { return 0; }
		if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', (string) $diena ) ) { return 0; }

		$wpdb->query( $wpdb->prepare( "DELETE FROM $t WHERE diena=%s AND aplinka=%s", $diena, self::aplinka() ) );

		$eil = array();
		self::elgsena( $diena, $eil );
		self::piltuvelis( $diena, $eil );
		self::sekos_rodikliai( $diena, $eil );
		self::pardavimai( $diena, $eil );
		return self::irasyti( $diena, $eil );
	}

	/**
	 * Eiluciu kaupiklis: raktas = visos dimensijos. Taip tas pats derinys
	 * sudedamas, o ne rasomas kelis kartus.
	 */
	private static function pridek( &$eil, $sritis, $tipas, $dim, $kiekis = 0, $sesiju = 0, $suma_ct = 0, $sav_ct = 0 ) {
		$d = wp_parse_args( $dim, array( 'deze_id' => 0, 'preke_id' => 0, 'dydis' => '', 'skirtukas' => '', 'irenginys' => '' ) );
		$r = $sritis . '|' . $tipas . '|' . (int) $d['deze_id'] . '|' . (int) $d['preke_id'] . '|' . $d['dydis'] . '|' . $d['skirtukas'] . '|' . $d['irenginys'];
		if ( ! isset( $eil[ $r ] ) ) {
			$eil[ $r ] = array(
				'sritis' => $sritis, 'tipas' => $tipas,
				'deze_id' => (int) $d['deze_id'], 'preke_id' => (int) $d['preke_id'],
				'dydis' => (string) $d['dydis'], 'skirtukas' => (string) $d['skirtukas'], 'irenginys' => (string) $d['irenginys'],
				'kiekis' => 0, 'sesiju' => 0, 'suma_ct' => 0, 'sav_ct' => 0,
			);
		}
		$eil[ $r ]['kiekis']  += (int) $kiekis;
		$eil[ $r ]['sesiju']  += (int) $sesiju;
		$eil[ $r ]['suma_ct'] += (int) $suma_ct;
		$eil[ $r ]['sav_ct']  += (int) $sav_ct;
	}

	private static function irasyti( $diena, $eil ) {
		global $wpdb;
		if ( ! $eil ) { return 0; }
		$t = self::lentele();
		$a = self::aplinka();
		$n = 0;
		foreach ( $eil as $e ) {
			$ok = $wpdb->query( $wpdb->prepare(
				"INSERT INTO $t (diena,aplinka,sritis,deze_id,preke_id,dydis,skirtukas,irenginys,tipas,kiekis,sesiju,suma_ct,sav_ct)
				 VALUES (%s,%s,%s,%d,%d,%s,%s,%s,%s,%d,%d,%d,%d)
				 ON DUPLICATE KEY UPDATE kiekis=VALUES(kiekis), sesiju=VALUES(sesiju), suma_ct=VALUES(suma_ct), sav_ct=VALUES(sav_ct)",
				$diena, $a, $e['sritis'], $e['deze_id'], $e['preke_id'], $e['dydis'], $e['skirtukas'], $e['irenginys'],
				$e['tipas'], $e['kiekis'], $e['sesiju'], $e['suma_ct'], $e['sav_ct']
			) );
			if ( $ok !== false ) { $n++; }
		}
		return $n;
	}

	/* ==================== ELGSENA ==================== */

	/** Ivykiu suvestine: kiekis = visi ivykiai, sesiju = unikalios NE tuscios sesijos. */
	private static function elgsena( $diena, &$eil ) {
		global $wpdb;
		$i = self::ivykiai();
		$r = $wpdb->get_results( $wpdb->prepare(
			"SELECT sritis, tipas, deze_id, preke_id, dydis, skirtukas, irenginys,
			        COUNT(*) kiek, COUNT(DISTINCT NULLIF(sesija,'')) ses
			 FROM $i WHERE DATE(laikas)=%s AND aplinka=%s
			 GROUP BY sritis,tipas,deze_id,preke_id,dydis,skirtukas,irenginys",
			$diena, self::aplinka()
		), ARRAY_A );
		foreach ( (array) $r as $x ) {
			self::pridek( $eil, $x['sritis'], $x['tipas'], $x, (int) $x['kiek'], (int) $x['ses'] );
		}

		/* Isemimai pagal dezes pilnuma — atskiri tipai, nes `kiek_dezeje` nera
		   suvestines dimensija (butu per daug eiluciu). Grupes: 1-4 / 5-8 / 9+. */
		$g = $wpdb->get_results( $wpdb->prepare(
			"SELECT deze_id, preke_id, dydis, skirtukas,
			        CASE WHEN kiek_dezeje<=4 THEN 'iseme_p1' WHEN kiek_dezeje<=8 THEN 'iseme_p2' ELSE 'iseme_p3' END grupe,
			        COUNT(*) kiek
			 FROM $i WHERE DATE(laikas)=%s AND aplinka=%s AND tipas='iseme' AND kiek_dezeje>0
			 GROUP BY deze_id,preke_id,dydis,skirtukas,grupe",
			$diena, self::aplinka()
		), ARRAY_A );
		foreach ( (array) $g as $x ) {
			self::pridek( $eil, 'laukai', $x['grupe'], $x, (int) $x['kiek'] );
		}
	}

	/**
	 * PILTUVELIS — atskira sritis, be `preke_id` dimensijos.
	 *
	 * KODEL ATSKIRAI. `sritis='laukai'` eilutese `sesiju` skaiciuojamas kartu su
	 * preke_id, todel viena sesija, idejusi keturias prekes, duoda keturias
	 * eilutes po 1 sesija. Sudejus jas piltuveleje gaudavosi „atidare 2 ->
	 * prisidejo 8" — nesamone, nes unikalus skaiciai NESUDEDAMI. Cia sesijos
	 * skaiciuojamos dezes lygmeniu, tad ekranas gali saugiai sumuoti.
	 */
	private static function piltuvelis( $diena, &$eil ) {
		global $wpdb;
		$i = self::ivykiai();
		$r = $wpdb->get_results( $wpdb->prepare(
			"SELECT tipas, deze_id, dydis, skirtukas, irenginys,
			        COUNT(DISTINCT NULLIF(sesija,'')) ses
			 FROM $i WHERE DATE(laikas)=%s AND aplinka=%s AND sritis='laukai'
			   AND tipas IN ('atidare','idejo','min_pasiekta','krepselis')
			 GROUP BY tipas,deze_id,dydis,skirtukas,irenginys",
			$diena, self::aplinka()
		), ARRAY_A );
		foreach ( (array) $r as $x ) {
			self::pridek( $eil, 'piltuvelis', $x['tipas'], $x, 0, (int) $x['ses'] );
		}
	}

	/**
	 * Isvestiniai sekos rodikliai. Skaiciuojami TIK is sesiju su sutikimu
	 * (sesija != ''), todel ekranuose jie zymimi „is sutikusiu su statistika".
	 *
	 *  kabliukas  — pirmoji i deze idėta preke (itraukia zmogu i deze);
	 *  uzdarytoja — paskutine idėta pries „i krepseli" (uzbaigia sprendima);
	 *  riba_*     — dovanos ribos itaka pirkimui.
	 */
	private static function sekos_rodikliai( $diena, &$eil ) {
		global $wpdb;
		$i = self::ivykiai();
		$r = $wpdb->get_results( $wpdb->prepare(
			"SELECT sesija, tipas, deze_id, preke_id, dydis, skirtukas, laikas, id
			 FROM $i WHERE DATE(laikas)=%s AND aplinka=%s AND sesija<>'' AND sritis='laukai'
			 ORDER BY sesija, laikas, id",
			$diena, self::aplinka()
		), ARRAY_A );
		if ( ! $r ) { return; }

		$sesijos = array();
		foreach ( $r as $x ) { $sesijos[ $x['sesija'] ][] = $x; }

		foreach ( $sesijos as $ivykiai ) {
			$pirmas_idejo = null;
			$pask_pries_krepseli = null;
			$turi_krepseli = false;
			$turi_riba = false;

			foreach ( $ivykiai as $iv ) {
				if ( $iv['tipas'] === 'idejo' ) {
					if ( $pirmas_idejo === null ) { $pirmas_idejo = $iv; }
					if ( ! $turi_krepseli ) { $pask_pries_krepseli = $iv; }
				} elseif ( $iv['tipas'] === 'krepselis' && ! $turi_krepseli ) {
					$turi_krepseli = true;
				} elseif ( $iv['tipas'] === 'dovana_atrakinta' ) {
					$turi_riba = true;
				}
			}

			if ( $pirmas_idejo ) {
				self::pridek( $eil, 'laukai', 'kabliukas', $pirmas_idejo, 1, 1 );
			}
			if ( $turi_krepseli && $pask_pries_krepseli ) {
				self::pridek( $eil, 'laukai', 'uzdarytoja', $pask_pries_krepseli, 1, 1 );
			}

			$deze = $pirmas_idejo ? $pirmas_idejo : $ivykiai[0];
			$dim  = array( 'deze_id' => $deze['deze_id'], 'dydis' => $deze['dydis'], 'skirtukas' => $deze['skirtukas'] );
			if ( $turi_riba ) {
				self::pridek( $eil, 'laukai', 'riba_pasieke', $dim, 1, 1 );
				if ( $turi_krepseli ) { self::pridek( $eil, 'laukai', 'riba_pasieke_krepselis', $dim, 1, 1 ); }
			} elseif ( $turi_krepseli ) {
				self::pridek( $eil, 'laukai', 'riba_nepasieke_krepselis', $dim, 1, 1 );
			}
		}
	}

	/* ==================== PARDAVIMAI ==================== */

	/** Prekes, kurios yra bent vieno rinkinio/pako komponentas — kanibalizacijai. */
	public static function komponentai() {
		global $wpdb;
		$kesas = wp_cache_get( 'ps_ata_komponentai' );
		if ( is_array( $kesas ) ) { return $kesas; }
		$t = $wpdb->prefix . 'wc_mnm_child_items';
		$sar = array();
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) === $t ) {
			foreach ( (array) $wpdb->get_col( "SELECT DISTINCT product_id FROM $t" ) as $x ) { $sar[ (int) $x ] = true; }
		}
		foreach ( (array) $wpdb->get_col( "SELECT DISTINCT meta_value FROM {$wpdb->postmeta} WHERE meta_key='_dp_base_product_id'" ) as $x ) {
			$sar[ (int) $x ] = true;
		}
		wp_cache_set( 'ps_ata_komponentai', $sar, '', 300 );
		return $sar;
	}

	/**
	 * Vienos dienos uzsakymai. HPOS ijungtas, todel imam per wc_get_orders su
	 * datos riba — vienos dienos apimtis maza, pilnas skenavimas cia saugus.
	 */
	public static function uzsakymai_diena( $diena ) {
		return wc_get_orders( array(
			'limit'        => -1,
			'status'       => array( 'processing', 'completed', 'on-hold' ),
			'type'         => 'shop_order',
			'date_created' => $diena . '...' . $diena,
		) );
	}

	/**
	 * Pardavimai i suvestine. Konteineriu <-> vaiku rysys per krepselio MAISA
	 * (`_mnm_cart_key` / `_mnm_container`) — patikrinta uzsakyme #34952; per
	 * eilutes ID sieti NEGALIMA.
	 */
	public static function pardavimai( $diena, &$eil ) {
		$komp = self::komponentai();

		foreach ( self::uzsakymai_diena( $diena ) as $ord ) {
			$ireng = (string) $ord->get_meta( Petshop_Statistika::META_UZS_IRENG, true );
			if ( $ireng !== 'mobile' && $ireng !== 'desktop' ) { $ireng = ''; }
			$sesija = (string) $ord->get_meta( Petshop_Statistika::META_UZS_SESIJA, true );

			/* Visos parduotuves pajamos — KPI „dalis apyvartoje" vardikliui. */
			self::pridek( $eil, 'parduotuve', 'pajamos', array(), 1, 0, self::ct( $ord->get_total() ) );

			/* 1) konteineriai */
			$kont = array();   /* cart_key => info */
			foreach ( $ord->get_items() as $it ) {
				$raktas = (string) $it->get_meta( '_mnm_cart_key', true );
				if ( $raktas === '' ) { continue; }
				$pid = $it->get_product_id();
				$kont[ $raktas ] = array(
					'deze_id'   => (int) $pid,
					'dydis'     => (string) ( $it->get_meta( Petshop_Statistika::META_EIL_DYDIS, true ) ?: Petshop_Statistika::dezes_dydis( $pid ) ),
					'skirtukas' => Petshop_Statistika::dezes_skirtukas( $pid ),
					'laukas'    => ( get_post_meta( $pid, '_ps_laukas', true ) === 'yes' ),
					'suma_ct'   => 0,
					'item'      => $it,
				);
			}

			/* 2) vaikai ir kitos eilutes */
			$dovanos = array();
			foreach ( $ord->get_items() as $it ) {
				$pid   = (int) $it->get_product_id();
				$kiek  = (int) $it->get_quantity();
				$suma  = self::ct( $it->get_total() );
				$sav_v = $it->get_meta( Petshop_Statistika::META_SAVIKAINA, true );
				$turi  = ( $sav_v !== '' && $sav_v !== null );
				$sav   = $turi ? self::ct( (float) $sav_v * $kiek ) : 0;
				$dov   = (bool) $it->get_meta( '_ps_dovana', true );
				$tevas = (string) $it->get_meta( '_mnm_container', true );
				$kont_raktas = (string) $it->get_meta( '_mnm_cart_key', true );

				if ( $kont_raktas !== '' ) { continue; } /* konteinerio eilute — apacioje */

				if ( $tevas !== '' && isset( $kont[ $tevas ] ) ) {
					/* rinkinio/dezes vaikas */
					$k = $kont[ $tevas ];
					$dim = array( 'deze_id' => $k['deze_id'], 'preke_id' => $pid, 'dydis' => $k['dydis'], 'skirtukas' => $k['skirtukas'], 'irenginys' => $ireng );
					self::pridek( $eil, 'pardavimai', 'parduota', $dim, $kiek, 0, $suma, $sav );
					if ( ! $turi ) {
						self::pridek( $eil, 'pardavimai', 'be_savikainos', $dim, 1 );
						self::pridek( $eil, 'pardavimai', 'be_sav_suma', $dim, $kiek, 0, $suma );
					}
					$kont[ $tevas ]['suma_ct'] += $suma;
					continue;
				}

				if ( $dov ) {
					$dovanos[] = array( 'preke_id' => $pid, 'kiekis' => $kiek, 'sav_ct' => $sav );
					continue;
				}

				/* DP pakas — ta pati preke x N */
				$baze = (int) get_post_meta( $pid, '_dp_base_product_id', true );
				$pqty = (int) get_post_meta( $pid, '_dp_pack_qty', true );
				if ( $baze && $pqty > 0 ) {
					$dim = array( 'deze_id' => $pid, 'preke_id' => $baze, 'irenginys' => $ireng );
					self::pridek( $eil, 'pardavimai', 'parduota', $dim, $kiek * $pqty, 0, $suma, $sav );
					self::pridek( $eil, 'pardavimai', 'parduota', array( 'deze_id' => $pid, 'irenginys' => $ireng ), $kiek, 0, $suma, $sav );
					self::pridek( $eil, 'pardavimai', 'dp_pakopa', array( 'deze_id' => $pid, 'preke_id' => $baze, 'dydis' => 'x' . $pqty, 'irenginys' => $ireng ), $kiek, 0, $suma, $sav );
					if ( ! $turi ) {
						self::pridek( $eil, 'pardavimai', 'be_savikainos', $dim, 1 );
						self::pridek( $eil, 'pardavimai', 'be_sav_suma', $dim, $kiek, 0, $suma );
					}
					continue;
				}

				/* Paprastas pardavimas. Jei preke yra kurio nors rinkinio
				   komponentas — zymim `atskirai` (kanibalizacijos palyginimui). */
				if ( isset( $komp[ $pid ] ) ) {
					self::pridek( $eil, 'pardavimai', 'atskirai', array( 'preke_id' => $pid, 'irenginys' => $ireng ), $kiek, 0, $suma, $sav );
				}
			}

			/* 3) konteineriu lygmuo + dovanos */
			$dovanu_sav = 0;
			foreach ( $dovanos as $d ) { $dovanu_sav += $d['sav_ct']; }

			$dovana_priskirta = false;
			foreach ( $kont as $k ) {
				/* Konteinerio eilute laiko PILNA dezes verte (konteineris + vaikai).
				   Su per-product pricing konteinerio `get_total()` yra 0, o kaina
				   sedi vaikuose — todel sudedam abu, kitaip pajamos dingtu. */
				$suma = self::ct( $k['item']->get_total() ) + (int) $k['suma_ct'];
				$dim  = array( 'deze_id' => $k['deze_id'], 'preke_id' => 0, 'dydis' => $k['dydis'], 'skirtukas' => $k['skirtukas'], 'irenginys' => $ireng );
				self::pridek( $eil, 'pardavimai', 'parduota', $dim, 1, 0, $suma );

				/* Dovana priskiriama PIRMAI dezei uzsakyme — kitaip ta pati dovana
				   butu suskaiciuota kelis kartus. */
				if ( $dovanos && ! $dovana_priskirta ) {
					$dovana_priskirta = true;
					self::pridek( $eil, 'pardavimai', 'parduota_sd', $dim, 1, 0, $suma, $dovanu_sav );
					foreach ( $dovanos as $d ) {
						self::pridek( $eil, 'pardavimai', 'dovana',
							array( 'deze_id' => $k['deze_id'], 'preke_id' => $d['preke_id'], 'dydis' => $k['dydis'], 'skirtukas' => $k['skirtukas'], 'irenginys' => $ireng ),
							$d['kiekis'], 0, 0, $d['sav_ct'] );
					}
				}

				/* Piltuvelio paskutinis zingsnis — tik jei uzsakyma galima susieti
				   su elgsenos sesija (t. y. buvo statistikos sutikimas). */
				if ( $sesija !== '' && $k['laukas'] ) {
					self::pridek( $eil, 'piltuvelis', 'nupirko',
						array( 'deze_id' => $k['deze_id'], 'dydis' => $k['dydis'], 'skirtukas' => $k['skirtukas'], 'irenginys' => $ireng ), 1, 1 );
				}
			}
		}

		self::grazinimai( $diena, $eil );
	}

	/**
	 * Grazinimai mazina GRAZINIMO dienos skaicius (savininko sprendimas):
	 * istorija atgaline data nesikeicia — kaip ir su savikaina.
	 */
	private static function grazinimai( $diena, &$eil ) {
		$uzs = wc_get_orders( array(
			'limit'        => -1,
			'type'         => 'shop_order_refund',
			'date_created' => $diena . '...' . $diena,
		) );
		foreach ( (array) $uzs as $ref ) {
			if ( ! is_a( $ref, 'WC_Order_Refund' ) ) { continue; }
			$suma = self::ct( $ref->get_amount() );
			if ( $suma <= 0 ) { continue; }
			self::pridek( $eil, 'pardavimai', 'grazinta', array(), -1, 0, -$suma );
			self::pridek( $eil, 'parduotuve', 'pajamos', array(), 0, 0, -$suma );
		}
	}

	/* ==================== SIANDIENOS SLUOKSNIS ==================== */

	/**
	 * Siandiena dar nera suvestineje — skaiciuojam lekiant tomis paciomis
	 * taisyklemis ir kesuojam 5 min. Apimtis maza (viena diena), tad saugu.
	 */
	public static function siandien() {
		$diena = current_time( 'Y-m-d' );
		$raktas = self::TRANSIENT . $diena;
		$kesas = get_transient( $raktas );
		if ( is_array( $kesas ) ) { return $kesas; }

		$eil = array();
		self::elgsena( $diena, $eil );
		self::piltuvelis( $diena, $eil );
		self::sekos_rodikliai( $diena, $eil );
		self::pardavimai( $diena, $eil );

		$out = array_values( $eil );
		set_transient( $raktas, $out, self::KESO_SEK );
		update_option( 'ps_ata_siandien_laikas', current_time( 'mysql' ), false );
		return $out;
	}

	/** Kada paskutini karta perskaiciuotas siandienos sluoksnis. */
	public static function sviezumas() {
		$l = get_option( 'ps_ata_siandien_laikas', '' );
		if ( ! $l ) { return ''; }
		$sk = (int) round( ( current_time( 'timestamp' ) - strtotime( $l ) ) / 60 );
		if ( $sk < 1 ) { return 'ką tik'; }
		return 'prieš ' . $sk . ' min.';
	}

	public static function agregavimo_laikas() {
		return (string) get_option( 'ps_ata_paskutinis_agregavimas', '' );
	}

	/* ==================== EKRANU SALTINIS ==================== */

	/**
	 * Suvestines eilutes uz laikotarpi (imtinai) + siandienos sluoksnis, jei
	 * laikotarpis apima siandiena. Ekranai grupuoja patys — cia tik saltinis.
	 */
	public static function eilutes( $nuo, $iki, $sritys = array() ) {
		global $wpdb;
		$t = self::lentele();
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) !== $t ) { return array(); }

		$siandien = current_time( 'Y-m-d' );
		$iki_db   = ( $iki >= $siandien ) ? gmdate( 'Y-m-d', strtotime( $siandien . ' -1 day' ) ) : $iki;

		$out = array();
		if ( $nuo <= $iki_db ) {
			$kur = '';
			if ( $sritys ) {
				$vietos = implode( ',', array_fill( 0, count( $sritys ), '%s' ) );
				$kur = $wpdb->prepare( " AND sritis IN ($vietos)", $sritys );
			}
			$out = $wpdb->get_results( $wpdb->prepare(
				"SELECT diena,sritis,deze_id,preke_id,dydis,skirtukas,irenginys,tipas,kiekis,sesiju,suma_ct,sav_ct
				 FROM $t WHERE aplinka=%s AND diena>=%s AND diena<=%s",
				self::aplinka(), $nuo, $iki_db
			) . $kur, ARRAY_A );
		}

		if ( $iki >= $siandien && $nuo <= $siandien ) {
			foreach ( self::siandien() as $e ) {
				if ( $sritys && ! in_array( $e['sritis'], $sritys, true ) ) { continue; }
				$e['diena'] = $siandien;
				$out[] = $e;
			}
		}
		return $out;
	}

	/**
	 * Sumavimo pagalbininkas: grazina [tipas][raktas] => metrikos.
	 * $raktas_f — funkcija, kuri is eilutes padaro grupavimo rakta.
	 */
	public static function sumuoti( $eilutes, $tipas, $raktas_f ) {
		$out = array();
		foreach ( $eilutes as $e ) {
			if ( $e['tipas'] !== $tipas ) { continue; }
			$r = call_user_func( $raktas_f, $e );
			if ( $r === null ) { continue; }
			if ( ! isset( $out[ $r ] ) ) { $out[ $r ] = array( 'kiekis' => 0, 'sesiju' => 0, 'suma_ct' => 0, 'sav_ct' => 0 ); }
			$out[ $r ]['kiekis']  += (int) $e['kiekis'];
			$out[ $r ]['sesiju']  += (int) $e['sesiju'];
			$out[ $r ]['suma_ct'] += (int) $e['suma_ct'];
			$out[ $r ]['sav_ct']  += (int) $e['sav_ct'];
		}
		return $out;
	}

	/** Viso pagal tipa (be grupavimo). */
	public static function viso( $eilutes, $tipas ) {
		$o = array( 'kiekis' => 0, 'sesiju' => 0, 'suma_ct' => 0, 'sav_ct' => 0 );
		foreach ( $eilutes as $e ) {
			if ( $e['tipas'] !== $tipas ) { continue; }
			$o['kiekis']  += (int) $e['kiekis'];
			$o['sesiju']  += (int) $e['sesiju'];
			$o['suma_ct'] += (int) $e['suma_ct'];
			$o['sav_ct']  += (int) $e['sav_ct'];
		}
		return $o;
	}
}

add_action( 'plugins_loaded', function() {
	if ( class_exists( 'Petshop_Statistika' ) ) { Petshop_Ataskaitu_Agregavimas::init(); }
}, 20 );
