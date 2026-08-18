<?php
/**
 * Petshop Pilnumas v1.3 (2026-08-18) — APRASYMO RIBA 120 -> 90.
 *   Savininko sprendimas. Riba iskelta i konstanta APRASYMO_MIN, kad kitą kartą
 *   nereiketu jos ieskoti kode. Vartu riba nepakeista (zr. konstantos komentara).
 *
 * Petshop Pilnumas v1.2 (D2, S763) — PILNAS TRUKSTA SARASAS.
 *   `_ps_pilnumas_truksta` yra tekstas zmogui ir sutrumpintas („EAN ir dar
 *   1"), todel filtravimui netinka. Pridetas `_ps_pilnumas_kodai` su visais
 *   raktais tarp vertikaliu bruksniu — kad kataloge butu galima atskiros
 *   eiles „Be savikainos", „Be serimo lenteles" ir t. t.
 *
 * Petshop Pilnumas v1.0 (D2, S723) — DUOMENU PILNUMO BALAS
 *
 * KAM: "trukstamu duomenu" buklė iki siol buvo miglotas jausmas ("reikia
 * sutvarkyti aprašymus"). Balas paverčia ją matuojamu, tirpstanciu skaiciumi
 * ir leidzia rikiuoti darba pagal verte: pirma tos prekes, kurios nesa pinigus.
 *
 * PAGRINDINIS PRINCIPAS (Raimio sprendimas): balas matuoja TIK tai, ka realiai
 * imanoma uzpildyti. Laukas, kurio uzpildymas reikalauja fizinio matavimo ar
 * isoriniu duomenu, i bala NEIEINA — jam vieta atskirame projekte, ne
 * kasdieniame rodiklyje. Kitaip preke, turinti viska, ka gali tureti, niekada
 * nerodytu 100%, ir balas mirtu kaip irankis.
 *   ISIMTA del to: matmenys (20% padengimas), prekes svoris aksesuaruose (35%),
 *   galerija kaip reikalavimas (45%).
 *
 * EAN — SAMONINGA ISIMTIS. Padengimas zemas (34-42%), taciau laukas paliktas,
 * nes prekiu vedimas skeneriu yra planuojama darbo forma — rodiklis turi
 * SPAUSTI link jos, ne tik konstatuoti dabarti. Kad tai nebutu bausme uz
 * neimanoma, veikia zyme `_ps_ean_netaikomas`: sveriamos ir naturalios prekes
 * EAN neturi ir neturės, todel jom sie taskai iskrenta IS VARDIKLIO.
 *
 * BALAS = surinkta / GALIMA * 100 (ne is fiksuoto 100). Preke, kuriai laukas
 * nezymetas kaip netaikomas, pasiekia 100%; ta, kuri galetu tureti bet neturi —
 * ne. Todel balas visada pasiekiamas ir visada teisingas.
 *
 * APRASYMU SEKCIJOS: skaidoma per `psdp_split()` — TA PACIA funkcija, kuria
 * naudoja prekes puslapis (snippetas 512) ir katalogo kortele. Antra sava
 * skaidymo logika reikstu, kad katalogas rodo viena, o pirkejas mato kita.
 * Jei variklio nera — sekciju laukai neskaiciuojami (iskrenta is vardiklio),
 * o ne vertinami nuliu: nezinojimas nera trukumas.
 *
 * v1.1: pridetas tipas `rinkinys` (Mix&Match) ir `nevertinama` grupe (DP
 *   skelbimai, testines prekes). Pirmas pilnas paleidimas parode, kad
 *   rinkiniai su 0% uzkiso eiles virsu: konteineris neturi nei savo
 *   savikainos, nei sudeties, nei EAN, todel vertinamas kaip paprasta preke
 *   jis amzinai stumtu zemyn tikrus darbus.
 *
 * @version 1.1
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! class_exists( 'Petshop_Pilnumas' ) ) :

class Petshop_Pilnumas {

	const VERSIJA = '1.3';

	/**
	 * Trumpiausias aprasymas, kuris laikomas aprasymu (simboliais, be HTML).
	 *
	 * v1.3 (2026-08-18, savininko sprendimas): 120 -> 90. Riba 120 buvo perimta
	 * is publikavimo vartu (`petshop-vartai.php`), kur ji saugo nuo tiekejo
	 * atsiunciamu tusciu korteliu. Bet pilnumo balas matuoja KITA dalyka —
	 * ar preke turi aprasyma zmogui. Trumpai, bet tiksliai aprasytas dubenelis
	 * ar zaislas yra aprasytas.
	 *
	 * SVARBU: vartu riba (petshop-vartai.php) SAMONINGAI palikta 120 — ji
	 * sprendzia, kas patenka i prekyba, ir tai atskiras sprendimas.
	 */
	const APRASYMO_MIN = 90;

	/* ============================================================
	 *  TAISYKLES
	 * ============================================================ */

	/** Laukas => svoris, pagal prekes tipa. Kiekvieno tipo suma = 100. */
	public static function taisykles( $tipas ) {
		$t = array(
			'maistas' => array(
				'savikaina'      => 15,
				'sudetis'        => 15,
				'serimo_lentele' => 15,
				'analitines'     => 10,
				'serimo_instr'   => 10,
				'aprasymas'      => 10,
				'ean'            => 10,
				'pakuotes_dydis' => 5,
				'gyvuno_rusis'   => 5,
				'nuotrauka'      => 5,
			),
			'skanestai' => array(
				'savikaina'      => 20,
				'aprasymas'      => 15,
				'sudetis'        => 15,
				'analitines'     => 15,
				'ean'            => 10,
				'pakuotes_dydis' => 10,
				'gyvuno_rusis'   => 10,
				'nuotrauka'      => 5,
			),
			'papildai' => array(
				'savikaina'    => 20,
				'aprasymas'    => 15,
				'sudetis'      => 15,
				'serimo_instr' => 15,
				'ean'          => 10,
				'paskirtis'    => 10,
				'forma'        => 5,
				'gyvuno_rusis' => 5,
				'nuotrauka'    => 5,
			),
			/* Rinkinys (Mix&Match) — KONTEINERIS, ne preke: savikaina isvestine is
			 * komponentu, savos sudeties neturi, EAN neturės niekada. Vertinamas
			 * tik pagal tai, ka realiai turi turėti pats rinkinys. */
			'rinkinys' => array(
				'aprasymas'    => 45,
				'nuotrauka'    => 30,
				'gyvuno_rusis' => 25,
			),
			'aksesuarai' => array(
				'aprasymas'    => 35,
				'savikaina'    => 25,
				'gyvuno_rusis' => 15,
				'ean'          => 10,
				'nuotrauka'    => 15,
			),
		);
		return isset( $t[ $tipas ] ) ? $t[ $tipas ] : $t['aksesuarai'];
	}

	/** Zmogui suprantami pavadinimai — "truksta: ..." sarasui. */
	public static function vardai() {
		return array(
			'savikaina'      => 'savikaina',
			'sudetis'        => 'sudėtis',
			'analitines'     => 'analitinės sudedamosios dalys',
			'serimo_instr'   => 'šėrimo instrukcija',
			'serimo_lentele' => 'šėrimo lentelė',
			'aprasymas'      => 'aprašymas',
			'ean'            => 'EAN',
			'pakuotes_dydis' => 'pakuotės dydis',
			'gyvuno_rusis'   => 'gyvūno rūšis',
			'paskirtis'      => 'paskirtis',
			'forma'          => 'forma',
			'nuotrauka'      => 'nuotrauka',
		);
	}

	private static function be_diakritiku( $s ) {
		return strtolower( strtr( (string) $s, array(
			'ą'=>'a','č'=>'c','ę'=>'e','ė'=>'e','į'=>'i','š'=>'s','ų'=>'u','ū'=>'u','ž'=>'z',
			'Ą'=>'a','Č'=>'c','Ę'=>'e','Ė'=>'e','Į'=>'i','Š'=>'s','Ų'=>'u','Ū'=>'u','Ž'=>'z',
		) ) );
	}

	/** Prekes tipas is kategoriju — ta pati logika kaip katalogo kortelėje. */
	public static function tipas( $pid ) {
		/* Rinkinys atpazistamas is product_type, ne is kategorijos — jis gali
		 * gyventi bet kurioje kategorijoje. */
		$tipai = wp_get_post_terms( $pid, 'product_type', array( 'fields' => 'slugs' ) );
		if ( ! is_wp_error( $tipai ) ) {
			foreach ( (array) $tipai as $sl ) {
				if ( strpos( $sl, 'mix' ) !== false || strpos( $sl, 'bundle' ) !== false
					|| strpos( $sl, 'grouped' ) !== false ) { return 'rinkinys'; }
			}
		}

		$t = '';
		foreach ( (array) wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'names' ) ) as $n ) {
			$t .= ' ' . self::be_diakritiku( $n );
		}
		if ( strpos( $t, 'maistas' ) !== false || strpos( $t, 'konserv' ) !== false
			|| strpos( $t, 'pasar' ) !== false || strpos( $t, 'edalas' ) !== false ) { return 'maistas'; }
		if ( strpos( $t, 'skanest' ) !== false || strpos( $t, 'kramtal' ) !== false ) { return 'skanestai'; }
		if ( strpos( $t, 'vitamin' ) !== false || strpos( $t, 'papild' ) !== false ) { return 'papildai'; }
		return 'aksesuarai';
	}

	/* ============================================================
	 *  APRASYMU SEKCIJOS
	 * ============================================================ */

	public static function sekciju_variklis_veikia() {
		return function_exists( 'psdp_split' );
	}

	/**
	 * Grazina rastu sekciju antrastes (be diakritiku), naudojant TA PACIA
	 * funkcija kaip prekes puslapis. NULL — variklio nera, negalima spresti.
	 */
	public static function sekcijos( $pid ) {
		if ( ! self::sekciju_variklis_veikia() ) { return null; }
		$po = get_post( $pid );
		if ( ! $po ) { return array(); }
		$html = (string) $po->post_content;
		if ( trim( $html ) === '' ) { return array(); }

		$sw = function_exists( 'psdp_clean' ) ? psdp_clean( $html ) : $html;
		$dalys = psdp_split( $sw );
		$rez = array();
		if ( is_array( $dalys ) ) {
			foreach ( $dalys as $d ) {
				if ( ! is_array( $d ) || ! isset( $d[0] ) ) { continue; }
				$antr = trim( (string) $d[0] );
				$tur  = isset( $d[1] ) ? trim( wp_strip_all_tags( (string) $d[1] ) ) : '';
				/* Tuscia sekcija su antraste nera turinys. */
				if ( $antr !== '' && mb_strlen( $tur ) >= 10 ) {
					$rez[] = self::be_diakritiku( $antr );
				}
			}
		}
		return $rez;
	}

	private static function turi_sekcija( $sekcijos, $raktazodziai ) {
		if ( ! is_array( $sekcijos ) ) { return null; }
		foreach ( $sekcijos as $s ) {
			foreach ( (array) $raktazodziai as $r ) {
				if ( strpos( $s, $r ) !== false ) { return true; }
			}
		}
		return false;
	}

	/* ============================================================
	 *  LAUKU PATIKRA
	 * ============================================================ */

	/**
	 * @return array laukas => true (yra) | false (truksta) | null (netaikoma /
	 *               negalima nustatyti -> iskrenta is vardiklio)
	 */
	public static function laukai( $pid ) {
		$pid = (int) $pid;
		$sek = self::sekcijos( $pid );
		$r   = array();

		/* --- savikaina --- */
		$sav = false;
		if ( class_exists( 'Petshop_Pardavimai' ) ) {
			$sav = Petshop_Pardavimai::savikaina( $pid ) > 0;
		} else {
			foreach ( array( '_cost_price', '_vf_cost', '_zb_cost', '_cost', '_petshop_cost' ) as $k ) {
				$v = get_post_meta( $pid, $k, true );
				if ( $v !== '' && is_numeric( $v ) && (float) $v > 0 ) { $sav = true; break; }
			}
		}
		$r['savikaina'] = $sav;

		/* --- aprasymu sekcijos --- */
		$r['aprasymas']  = $sek === null ? null : ( self::turi_sekcija( $sek, array( 'aprasym' ) )
			|| mb_strlen( trim( wp_strip_all_tags( (string) get_post_field( 'post_content', $pid ) ) ) ) >= self::APRASYMO_MIN );
		$r['sudetis']    = $sek === null ? null : self::turi_sekcija( $sek, array( 'sudet' ) );
		$r['analitines'] = $sek === null ? null : self::turi_sekcija( $sek, array( 'analit' ) );
		$r['serimo_instr'] = $sek === null ? null : self::turi_sekcija( $sek, array( 'serim', 'naudojim', 'vartojim' ) );

		/* --- serimo lentele: is repozitorijos, ne is teksto --- */
		$r['serimo_lentele'] = self::turi_serimo_lentele( $pid );

		/* --- EAN su "netaikoma" zyme --- */
		if ( get_post_meta( $pid, '_ps_ean_netaikomas', true ) === 'taip' ) {
			$r['ean'] = null; /* sveriama ar naturali preke — iskrenta is vardiklio */
		} else {
			$ean = '';
			foreach ( array( '_ean', '_global_unique_id', '_wpm_gtin_code' ) as $k ) {
				$v = get_post_meta( $pid, $k, true );
				if ( $v !== '' ) { $ean = $v; break; }
			}
			$r['ean'] = ( $ean !== '' );
		}

		/* --- atributai --- */
		$r['pakuotes_dydis'] = self::turi_termina( $pid, 'pa_pakuotes_dydis' );
		$r['gyvuno_rusis']   = self::turi_termina( $pid, 'pa_gyvuno_rusis' );
		$r['paskirtis']      = self::turi_termina( $pid, 'pa_paskirtis' );
		$r['forma']          = self::turi_termina( $pid, 'pa_forma' );

		/* --- nuotrauka --- */
		$r['nuotrauka'] = ( (int) get_post_thumbnail_id( $pid ) > 0 );

		return $r;
	}

	private static function turi_termina( $pid, $taksonomija ) {
		if ( ! taxonomy_exists( $taksonomija ) ) { return null; }
		$t = wp_get_post_terms( $pid, $taksonomija, array( 'fields' => 'ids' ) );
		return ( ! is_wp_error( $t ) && ! empty( $t ) );
	}

	/** Serimo lentele — is repozitorijos, priimant tik patvirtintas. */
	public static function turi_serimo_lentele( $pid ) {
		global $wpdb;
		$map = $wpdb->prefix . 'ps_feeding_map';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '{$map}'" ) !== $map ) { return null; }
		$n = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(*) FROM {$map} WHERE product_id=%d AND is_active=1", $pid ) );
		return $n > 0;
	}

	/* ============================================================
	 *  BALAS
	 * ============================================================ */

	/**
	 * Prekes, kurioms balas neturi prasmes:
	 *   - DP skelbimai: generuojami is bazines prekes, turinys paveldimas;
	 *   - testines prekes: sistemos irankiai, ne asortimentas.
	 * Jos iskrenta is eiles visai, o ne kabo virsuje su 0%.
	 */
	public static function nevertinama( $pid ) {
		if ( get_post_meta( $pid, '_dp_base_product_id', true ) ) { return 'DP skelbimas'; }
		$sku = (string) get_post_meta( $pid, '_sku', true );
		if ( $sku !== '' && strpos( $sku, 'PS-TEST' ) === 0 ) { return 'testinė prekė'; }
		if ( strpos( (string) get_the_title( $pid ), 'ZZ TEST' ) === 0 ) { return 'testinė prekė'; }
		return false;
	}

	public static function balas( $pid ) {
		$pid   = (int) $pid;

		$nev = self::nevertinama( $pid );
		if ( $nev ) {
			return array( 'pid' => $pid, 'tipas' => 'nevertinama', 'balas' => null,
				'surinkta' => 0, 'galima' => 0, 'truksta' => array(),
				'netaikoma' => array(), 'priezastis' => $nev );
		}

		$tipas = self::tipas( $pid );
		$tais  = self::taisykles( $tipas );
		$laukai = self::laukai( $pid );
		$vardai = self::vardai();

		$galima = 0; $surinkta = 0; $truksta = array(); $netaikoma = array();

		foreach ( $tais as $laukas => $svoris ) {
			$b = isset( $laukai[ $laukas ] ) ? $laukai[ $laukas ] : null;
			if ( $b === null ) { $netaikoma[] = isset( $vardai[ $laukas ] ) ? $vardai[ $laukas ] : $laukas; continue; }
			$galima += $svoris;
			if ( $b ) { $surinkta += $svoris; }
			else { $truksta[] = array( 'laukas' => $laukas, 'vardas' => isset( $vardai[ $laukas ] ) ? $vardai[ $laukas ] : $laukas, 'svoris' => $svoris ); }
		}

		/* Rikiuojam pagal svori — "truksta: ..." pirma rodo tai, kas svarbiausia. */
		usort( $truksta, function( $a, $b ) { return $b['svoris'] - $a['svoris']; } );

		$proc = $galima > 0 ? (int) round( $surinkta * 100 / $galima ) : 100;

		return array(
			'pid'       => $pid,
			'tipas'     => $tipas,
			'balas'     => $proc,
			'surinkta'  => $surinkta,
			'galima'    => $galima,
			'truksta'   => $truksta,
			'netaikoma' => $netaikoma,
		);
	}

	/** Trumpas "truksta: sudėtis, EAN" tekstas kortelei. */
	public static function truksta_tekstas( $b, $kiek = 3 ) {
		if ( empty( $b['truksta'] ) ) { return ''; }
		$v = array();
		foreach ( array_slice( $b['truksta'], 0, $kiek ) as $t ) { $v[] = $t['vardas']; }
		$likutis = count( $b['truksta'] ) - count( $v );
		return implode( ', ', $v ) . ( $likutis > 0 ? ' ir dar ' . $likutis : '' );
	}

	/* ============================================================
	 *  KESAVIMAS
	 * ============================================================ */

	public static function perskaiciuoti( $pid ) {
		$b = self::balas( $pid );
		if ( $b['balas'] === null ) {
			delete_post_meta( $pid, '_ps_pilnumas' );
			delete_post_meta( $pid, '_ps_pilnumas_truksta' );
			delete_post_meta( $pid, '_ps_pilnumas_kodai' );
			return $b;
		}
		update_post_meta( $pid, '_ps_pilnumas', $b['balas'] );
		update_post_meta( $pid, '_ps_pilnumas_truksta', self::truksta_tekstas( $b, 4 ) );
		/* v1.2: PILNAS truksta raktu sarasas.
		   `_ps_pilnumas_truksta` yra tekstas zmogui ir jis SUTRUMPINTAS
		   („EAN ir dar 1"), todel pagal ji filtruoti negalima: preke, kuriai
		   truksta serimo lenteles ir sudeties, pagal „sudetis" nebutu rasta.
		   Sis laukas laiko visus raktus, atskirtus vertikaliais bruksniais,
		   kad `LIKE '%|sudetis|%'` veiktu tiksliai. */
		$raktai = array();
		foreach ( (array) $b['truksta'] as $t ) {
			if ( isset( $t['laukas'] ) ) { $raktai[] = $t['laukas']; }
		}
		update_post_meta( $pid, '_ps_pilnumas_kodai', $raktai ? '|' . implode( '|', $raktai ) . '|' : '' );
		update_post_meta( $pid, '_ps_pilnumas_updated', current_time( 'mysql' ) );
		return $b;
	}

	public static function perskaiciuoti_visus( $args = array() ) {
		global $wpdb;
		$riba      = isset( $args['riba'] ) ? (int) $args['riba'] : 500;
		$poslinkis = isset( $args['poslinkis'] ) ? (int) $args['poslinkis'] : 0;
		$dry       = ! empty( $args['dry'] );

		$ids = $wpdb->get_col( $wpdb->prepare(
			"SELECT ID FROM {$wpdb->posts} WHERE post_type='product'
			   AND post_status IN ('publish','draft') ORDER BY ID ASC LIMIT %d, %d",
			$poslinkis, $riba ) );

		$rez = array( 'apdorota' => 0, 'dry' => $dry, 'kitas_poslinkis' => $poslinkis + count( $ids ),
			'vidurkis' => 0, 'pagal_tipa' => array(), 'pilni' => 0 );
		$suma = 0;
		foreach ( $ids as $pid ) {
			$b = $dry ? self::balas( (int) $pid ) : self::perskaiciuoti( (int) $pid );
			if ( $b['balas'] === null ) {
				if ( ! isset( $rez['nevertinamos'] ) ) { $rez['nevertinamos'] = 0; }
				$rez['nevertinamos']++;
				continue;
			}
			$suma += $b['balas'];
			$rez['apdorota']++;
			if ( $b['balas'] >= 100 ) { $rez['pilni']++; }
			if ( ! isset( $rez['pagal_tipa'][ $b['tipas'] ] ) ) {
				$rez['pagal_tipa'][ $b['tipas'] ] = array( 'n' => 0, 'suma' => 0 );
			}
			$rez['pagal_tipa'][ $b['tipas'] ]['n']++;
			$rez['pagal_tipa'][ $b['tipas'] ]['suma'] += $b['balas'];
		}
		if ( $rez['apdorota'] ) { $rez['vidurkis'] = round( $suma / $rez['apdorota'] ); }
		foreach ( $rez['pagal_tipa'] as $t => $d ) {
			$rez['pagal_tipa'][ $t ]['vidurkis'] = $d['n'] ? round( $d['suma'] / $d['n'] ) : 0;
			unset( $rez['pagal_tipa'][ $t ]['suma'] );
		}
		return $rez;
	}

	/* ============================================================
	 *  EILE "DUOMENU SKOLOS" — pagal verte, ne pagal abecele
	 * ============================================================ */

	/**
	 * Rikiuojama pagal pardavimus x trukuma: pirma tvarkomos tos prekes,
	 * kurios realiai nesa pinigus. Preke su 40% balu ir nuliu pardavimu
	 * laukia; preke su 80% ir gerais pardavimais — ne.
	 */
	public static function eile_skolos( $riba = 100 ) {
		global $wpdb;
		return $wpdb->get_results( $wpdb->prepare(
			"SELECT p.ID pid, p.post_title pav, p.post_status busena,
			        pl.meta_value+0 balas,
			        COALESCE(s.meta_value+0,0) v365,
			        tr.meta_value truksta,
			        ( (100 - pl.meta_value+0) * (1 + COALESCE(s.meta_value+0,0)) ) svoris
			   FROM {$wpdb->posts} p
			   INNER JOIN {$wpdb->postmeta} pl ON pl.post_id=p.ID AND pl.meta_key='_ps_pilnumas'
			   LEFT JOIN {$wpdb->postmeta} s  ON s.post_id=p.ID  AND s.meta_key='_ps_sales_365d'
			   LEFT JOIN {$wpdb->postmeta} tr ON tr.post_id=p.ID AND tr.meta_key='_ps_pilnumas_truksta'
			  WHERE p.post_type='product' AND p.post_status IN ('publish','draft')
			    AND pl.meta_value+0 < 100
			  ORDER BY svoris DESC LIMIT %d", (int) $riba ), ARRAY_A );
	}

	public static function statistika() {
		global $wpdb;
		return array(
			'versija'          => self::VERSIJA,
			'sekciju_variklis' => self::sekciju_variklis_veikia() ? 'veikia' : 'NĖRA (psdp_split)',
			'su_balu'          => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key='_ps_pilnumas'" ),
			'vidurkis'         => (float) $wpdb->get_var( "SELECT ROUND(AVG(meta_value+0),1) FROM {$wpdb->postmeta} WHERE meta_key='_ps_pilnumas'" ),
			'pilni_100'        => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key='_ps_pilnumas' AND meta_value+0>=100" ),
			'zemiau_50'        => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key='_ps_pilnumas' AND meta_value+0<50" ),
			'ean_netaikomas'   => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key='_ps_ean_netaikomas' AND meta_value='taip'" ),
		);
	}
}

/* Naktinis perskaiciavimas 05:00 — po pardavimu (04:50), nes balas
 * nepriklauso nuo ju, bet eile "Duomenu skolos" rikiuojama pagal pardavimus. */
add_action( 'init', function() {
	if ( ! wp_next_scheduled( 'ps_pilnumas_naktinis' ) ) {
		wp_schedule_event( strtotime( 'tomorrow 05:00' ), 'daily', 'ps_pilnumas_naktinis' );
	}
} );

add_action( 'ps_pilnumas_naktinis', function() {
	$pos = 0;
	for ( $i = 0; $i < 20; $i++ ) {
		$r = Petshop_Pilnumas::perskaiciuoti_visus( array( 'riba' => 500, 'poslinkis' => $pos ) );
		$pos = $r['kitas_poslinkis'];
		if ( $r['apdorota'] < 500 ) { break; }
	}
	update_option( 'ps_pilnumas_naktinis_rez', array( 'laikas' => current_time( 'mysql' ), 'apdorota' => $pos ), false );
} );

endif;
