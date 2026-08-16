<?php
/**
 * Plugin Name: Petshop Statistika — Rinkiniai (ataskaita)
 * Description: „Petshop ataskaitos" → „Surenkami rinkiniai": pinigai, prekes, kelias dezeje, dovana, irenginiai.
 * Version: 2.0
 *
 * Perdaryta pagal „Petshop ataskaitu standarta v2" (spec v1.1).
 * v1.1 buvo grazi prezentacijai, bet ne darbui: be laikotarpio, be palyginimo,
 * be rikiavimo, be veiksmu — ir skaite VISUS uzsakymus kiekvienu atidarymu.
 *
 * Kas pasikeite is esmes:
 *  - skaitom dienos suvestine (`ps_ataskaitu_dienos`), o ne zalius uzsakymus;
 *  - kiekvienas skaicius turi palyginima su ankstesniu tokiu paciu laikotarpiu;
 *  - „Ka daryti" blokai: kandidatai isimti / lyderiai pagal NUSTATYMU ribas;
 *  - kelias dezeje (kabliukai, uzdarytojos), dovanos grazá, irenginiu pjuvis.
 *
 * Skaiciavimo taisykles (savininko sprendimai):
 *  - savikaina — IS UZSAKYMO EILUTES, fiksuota pardavimo momentu;
 *  - eilutes be savikainos i marza NEIRASOMOS ir rodomos atskirai;
 *  - marza be PVM; dovana: pajamos 0, savikaina reali — mazina pelna;
 *  - sekos metrikos (piltuvelis, konversija, kabliukai) skaiciuojamos tik is
 *    sesiju su statistikos sutikimu — ekrane tai zymima.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Rinkiniu_Ataskaita {

	const VERSIJA = '2.0';
	const CAP     = 'manage_woocommerce';
	const PARENT  = 'petshop-reports';
	const SLUG    = 'petshop-reports-rinkiniai';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ), 20 );
		add_action( 'admin_post_ps_stat_pradzia', array( __CLASS__, 'saugoti_pradzia' ) );
	}

	public static function menu() {
		add_submenu_page(
			self::PARENT, 'Surenkami rinkiniai', 'Surenkami rinkiniai',
			self::CAP, self::SLUG, array( __CLASS__, 'render' )
		);
	}

	public static function saugoti_pradzia() {
		if ( ! current_user_can( self::CAP ) ) { wp_die( 'Neturite teisiu.' ); }
		check_admin_referer( 'ps_stat_pradzia' );
		$d = sanitize_text_field( wp_unslash( $_POST['pradzia'] ?? '' ) );
		update_option( 'ps_stat_pradzia', preg_match( '/^\d{4}-\d{2}-\d{2}$/', $d ) ? $d : '', false );
		wp_safe_redirect( admin_url( 'admin.php?page=' . self::SLUG . '&issaugota=1' ) );
		exit;
	}

	/* ==================== DUOMENYS ==================== */

	/** Surenkamos dezes (laukai). Paruosti rinkiniai — kitas ekranas. */
	public static function dezes() {
		$kesas = wp_cache_get( 'ps_ata_dezes' );
		if ( is_array( $kesas ) ) { return $kesas; }
		$q = new WP_Query( array(
			'post_type' => 'product', 'post_status' => array( 'publish', 'draft' ),
			'posts_per_page' => 60, 'fields' => 'ids', 'orderby' => 'title', 'order' => 'ASC',
			'meta_query' => array( array( 'key' => '_ps_laukas', 'value' => 'yes' ) ),
		) );
		$r = array();
		foreach ( $q->posts as $id ) { $r[ (int) $id ] = get_the_title( $id ); }
		wp_cache_set( 'ps_ata_dezes', $r, '', 300 );
		return $r;
	}

	/** Eilutes uz laikotarpi, apribotos siuo ekranu (tik surenkamos dezes). */
	private static function duomenys( $nuo, $iki, $deze_id = 0 ) {
		$dezes = self::dezes();
		$eil = Petshop_Ataskaitu_Agregavimas::eilutes( $nuo, $iki, array( 'laukai', 'pardavimai', 'parduotuve' ) );
		$out = array();
		foreach ( $eil as $e ) {
			if ( $e['sritis'] === 'parduotuve' ) { $out[] = $e; continue; }
			$d = (int) $e['deze_id'];
			if ( $e['tipas'] === 'grazinta' ) { $out[] = $e; continue; }
			if ( $d && ! isset( $dezes[ $d ] ) ) { continue; }        /* ne surenkama deze */
			if ( $deze_id && $d !== $deze_id ) { continue; }
			$out[] = $e;
		}
		return $out;
	}

	/** Pagrindiniai pinigai is eiluciu rinkinio. */
	private static function pinigai( $eil ) {
		$U = 'Petshop_Ataskaitu_UI';
		$kont = array( 'kiekis' => 0, 'suma_ct' => 0 );
		$vaikai = array( 'suma_ct' => 0, 'sav_ct' => 0, 'kiekis' => 0 );
		$be_sav_ct = 0; $be_sav_eil = 0; $dov_sav = 0; $grazinta = 0;

		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'pardavimai' ) { continue; }
			if ( $e['tipas'] === 'parduota' ) {
				if ( (int) $e['preke_id'] === 0 ) {
					$kont['kiekis']  += (int) $e['kiekis'];
					$kont['suma_ct'] += (int) $e['suma_ct'];
				} else {
					$vaikai['kiekis']  += (int) $e['kiekis'];
					$vaikai['suma_ct'] += (int) $e['suma_ct'];
					$vaikai['sav_ct']  += (int) $e['sav_ct'];
				}
			} elseif ( $e['tipas'] === 'be_sav_suma' ) { $be_sav_ct += (int) $e['suma_ct']; }
			elseif ( $e['tipas'] === 'be_savikainos' ) { $be_sav_eil += (int) $e['kiekis']; }
			elseif ( $e['tipas'] === 'dovana' ) { $dov_sav += (int) $e['sav_ct']; }
			elseif ( $e['tipas'] === 'grazinta' ) { $grazinta += (int) $e['suma_ct']; }
		}

		$pajamos_ct = $kont['suma_ct'] + $grazinta;
		$su_sav_ct  = max( 0, $vaikai['suma_ct'] - $be_sav_ct );
		$be_pvm     = call_user_func( array( $U, 'be_pvm' ), $su_sav_ct );
		$pelnas_ct  = (int) round( $be_pvm ) - $vaikai['sav_ct'] - $dov_sav;
		$marza      = $be_pvm > 0 ? ( $pelnas_ct / $be_pvm ) * 100 : 0;

		return array(
			'pajamos_ct' => $pajamos_ct,
			'pelnas_ct'  => $pelnas_ct,
			'marza'      => $marza,
			'dezes'      => $kont['kiekis'],
			'vnt'        => $vaikai['kiekis'],
			'cekis_ct'   => $kont['kiekis'] > 0 ? (int) round( $pajamos_ct / $kont['kiekis'] ) : 0,
			'vid_dydis'  => $kont['kiekis'] > 0 ? $vaikai['kiekis'] / $kont['kiekis'] : 0,
			'be_sav_eil' => $be_sav_eil,
			'dov_sav_ct' => $dov_sav,
		);
	}

	/** Elgsenos suvestine: [tipas][preke_id] => kiekis/sesiju. */
	private static function elgsena( $eil, $tipas, $laukas = 'kiekis', $pagal = 'preke_id' ) {
		$o = array();
		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'laukai' || $e['tipas'] !== $tipas ) { continue; }
			$r = (string) $e[ $pagal ];
			if ( ! isset( $o[ $r ] ) ) { $o[ $r ] = 0; }
			$o[ $r ] += (int) $e[ $laukas ];
		}
		return $o;
	}

	private static function sesiju( $eil, $tipas ) {
		$s = 0;
		foreach ( $eil as $e ) {
			if ( $e['sritis'] === 'laukai' && $e['tipas'] === $tipas ) { $s += (int) $e['sesiju']; }
		}
		return $s;
	}

	/* ==================== RENDER ==================== */

	public static function render() {
		if ( ! current_user_can( self::CAP ) ) { wp_die( 'Neturite teisiu.' ); }
		$U = 'Petshop_Ataskaitu_UI';

		$lt    = Petshop_Ataskaitu_UI::laikotarpis();
		$dezes = self::dezes();
		$deze  = isset( $_GET['deze'] ) ? (int) $_GET['deze'] : 0;
		$preke = isset( $_GET['preke'] ) ? (int) $_GET['preke'] : 0;

		$eil   = self::duomenys( $lt['nuo'], $lt['iki'], $deze );
		$pries = $lt['lyginam'] ? self::duomenys( $lt['pries_nuo'], $lt['pries_iki'], $deze ) : array();

		$p  = self::pinigai( $eil );
		$pp = $pries ? self::pinigai( $pries ) : null;

		Petshop_Ataskaitu_UI::antraste(
			'Surenkami rinkiniai',
			'Ką klientai renkasi ir kiek iš to uždirbame. Savikaina — iš užsakymo eilutės pardavimo dieną.'
		);

		$parinktys = array( 0 => '— visi —' );
		foreach ( $dezes as $id => $pav ) { $parinktys[ $id ] = $pav; }
		Petshop_Ataskaitu_UI::juosta( self::SLUG, $lt, array(
			array( 'vardas' => 'deze', 'uzrasas' => 'Rinkinys', 'parinktys' => $parinktys, 'reiksme' => $deze ),
		) );

		self::sekcija_kpi( $p, $pp, $eil, $lt );
		self::sekcija_tendencija( $eil, $pries, $lt );
		self::sekcija_veiksmai( $eil );
		self::sekcija_dydziai( $eil, $dezes );
		self::sekcija_prekes( $eil, $lt );
		if ( $preke ) { self::sekcija_preke( $eil, $preke ); }
		self::sekcija_piltuvelis( $eil );
		self::sekcija_kelias( $eil );
		self::sekcija_dovana( $eil, $pries );
		self::sekcija_irenginiai( $eil );
		self::sekcija_nustatymai();

		Petshop_Ataskaitu_UI::pabaiga();
	}

	/* ---------- 1. KPI ---------- */

	private static function sekcija_kpi( $p, $pp, $eil, $lt ) {
		$U = 'Petshop_Ataskaitu_UI';
		echo '<div class="psru-kpi">';

		Petshop_Ataskaitu_UI::kpi( 'Pajamos su PVM', Petshop_Ataskaitu_UI::eur( $p['pajamos_ct'] ),
			$pp ? array( 'dabar' => $p['pajamos_ct'], 'buvo' => $pp['pajamos_ct'] ) : null,
			$pp ? 'buvo ' . Petshop_Ataskaitu_UI::eur( $pp['pajamos_ct'] ) : '',
			'Visų dėžių suma su PVM pasirinktu laikotarpiu. Grąžinimai atimti grąžinimo dieną.',
			self::dienu_eilute( $eil, 'pajamos' ) );

		Petshop_Ataskaitu_UI::kpi( 'Pelnas', Petshop_Ataskaitu_UI::eur( $p['pelnas_ct'] ),
			$pp ? array( 'dabar' => $p['pelnas_ct'], 'buvo' => $pp['pelnas_ct'] ) : null,
			$pp ? 'buvo ' . Petshop_Ataskaitu_UI::eur( $pp['pelnas_ct'] ) : '',
			'Pajamos be PVM minus savikaina iš užsakymo eilučių. Dovanų savikaina atimta. Eilutės be savikainos NEĮSKAIČIUOTOS.' );

		Petshop_Ataskaitu_UI::kpi( 'Marža', Petshop_Ataskaitu_UI::proc( $p['marza'] ),
			$pp ? array( 'dabar' => $p['marza'], 'buvo' => $pp['marza'], 'pp' => true ) : null,
			$pp ? 'buvo ' . Petshop_Ataskaitu_UI::proc( $pp['marza'] ) : '',
			'Pelnas ÷ pajamos be PVM × 100. Skaičiuojama tik iš eilučių su žinoma savikaina.' );

		Petshop_Ataskaitu_UI::kpi( 'Užsakymai su dėže', number_format( $p['dezes'], 0, ',', ' ' ),
			$pp ? array( 'dabar' => $p['dezes'], 'buvo' => $pp['dezes'] ) : null,
			$pp ? 'buvo ' . number_format( $pp['dezes'], 0, ',', ' ' ) : '' );

		Petshop_Ataskaitu_UI::kpi( 'Vid. čekis / dydis', Petshop_Ataskaitu_UI::eur( $p['cekis_ct'] ),
			$pp ? array( 'dabar' => $p['cekis_ct'], 'buvo' => $pp['cekis_ct'] ) : null,
			number_format( $p['vid_dydis'], 1, ',', ' ' ) . ' vnt. dėžėje' );

		echo '</div>';

		if ( $p['be_sav_eil'] > 0 ) {
			Petshop_Ataskaitu_UI::spejimas( '<b>' . (int) $p['be_sav_eil'] . '</b> eilutės be savikainos į maržą neįskaičiuotos — tikras pelnas MAŽESNIS nei rodomas.' );
		}
	}

	/** Dienos eilute sparkline'ui ir diagramai. */
	private static function dienu_eilute( $eil, $ka = 'pajamos' ) {
		$d = array();
		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'pardavimai' ) { continue; }
			$diena = $e['diena'];
			if ( ! isset( $d[ $diena ] ) ) { $d[ $diena ] = 0; }
			if ( $ka === 'pajamos' && $e['tipas'] === 'parduota' && (int) $e['preke_id'] === 0 ) {
				$d[ $diena ] += (int) $e['suma_ct'];
			} elseif ( $ka === 'pelnas' && $e['tipas'] === 'parduota' && (int) $e['preke_id'] > 0 ) {
				$d[ $diena ] += (int) round( Petshop_Ataskaitu_UI::be_pvm( (int) $e['suma_ct'] ) ) - (int) $e['sav_ct'];
			}
		}
		ksort( $d );
		return array_values( $d );
	}

	/* ---------- 2. TENDENCIJA ---------- */

	private static function sekcija_tendencija( $eil, $pries, $lt ) {
		$paj = self::dienu_eilute( $eil, 'pajamos' );
		$pel = self::dienu_eilute( $eil, 'pelnas' );
		if ( count( $paj ) < 2 ) {
			echo '<p class="psru-pastaba">Tendencijos diagramai reikia bent dviejų dienų su pardavimais.</p>';
			return;
		}
		Petshop_Ataskaitu_UI::diagrama( $paj, $pel, $pries ? self::dienu_eilute( $pries, 'pajamos' ) : array() );
	}

	/* ---------- 3. KA DARYTI ---------- */

	private static function prekiu_metrikos( $eil ) {
		$rodyta = self::elgsena( $eil, 'rodyta' );
		$idejo  = self::elgsena( $eil, 'idejo' );
		$iseme  = self::elgsena( $eil, 'iseme' );

		$prekes = array();
		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'pardavimai' || $e['tipas'] !== 'parduota' ) { continue; }
			$pid = (int) $e['preke_id'];
			if ( ! $pid ) { continue; }
			if ( ! isset( $prekes[ $pid ] ) ) { $prekes[ $pid ] = array( 'vnt' => 0, 'suma_ct' => 0, 'sav_ct' => 0, 'be_sav' => 0 ); }
			$prekes[ $pid ]['vnt']     += (int) $e['kiekis'];
			$prekes[ $pid ]['suma_ct'] += (int) $e['suma_ct'];
			$prekes[ $pid ]['sav_ct']  += (int) $e['sav_ct'];
		}
		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'pardavimai' || $e['tipas'] !== 'be_savikainos' ) { continue; }
			$pid = (int) $e['preke_id'];
			if ( $pid && isset( $prekes[ $pid ] ) ) { $prekes[ $pid ]['be_sav'] += (int) $e['kiekis']; }
		}
		/* prekes, kurios rodytos/idetos, bet nenupirktos — irgi svarbios */
		foreach ( array_keys( $idejo + $rodyta ) as $pid ) {
			$pid = (int) $pid;
			if ( $pid && ! isset( $prekes[ $pid ] ) ) { $prekes[ $pid ] = array( 'vnt' => 0, 'suma_ct' => 0, 'sav_ct' => 0, 'be_sav' => 0 ); }
		}

		$viso_suma = 0;
		foreach ( $prekes as $x ) { $viso_suma += $x['suma_ct']; }

		$out = array();
		foreach ( $prekes as $pid => $x ) {
			$r = isset( $rodyta[ $pid ] ) ? (int) $rodyta[ $pid ] : 0;
			$i = isset( $idejo[ $pid ] ) ? (int) $idejo[ $pid ] : 0;
			$is = isset( $iseme[ $pid ] ) ? (int) $iseme[ $pid ] : 0;
			$be_pvm = Petshop_Ataskaitu_UI::be_pvm( $x['suma_ct'] );
			$pelnas = $x['be_sav'] ? null : (int) round( $be_pvm ) - $x['sav_ct'];
			$out[ $pid ] = array(
				'id' => $pid,
				'pav' => get_the_title( $pid ) ?: ( '#' . $pid ),
				'rodyta' => $r, 'idejo' => $i, 'iseme' => $is,
				'dalis' => $r > 0 ? ( $i / $r ) * 100 : null,
				'isemimo' => $i > 0 ? ( $is / $i ) * 100 : null,
				'vnt' => $x['vnt'], 'suma_ct' => $x['suma_ct'], 'sav_ct' => $x['sav_ct'],
				'be_sav' => $x['be_sav'],
				'pelnas_ct' => $pelnas,
				'marza' => ( $pelnas !== null && $be_pvm > 0 ) ? ( $pelnas / $be_pvm ) * 100 : null,
				'apyvartos_dalis' => $viso_suma > 0 ? ( $x['suma_ct'] / $viso_suma ) * 100 : 0,
			);
		}
		return $out;
	}

	private static function sekcija_veiksmai( $eil ) {
		$m = self::prekiu_metrikos( $eil );
		$r_dalis = Petshop_Ataskaitu_UI::nustatymas( 'ps_rib_isimti_dalis', 3 );
		$r_marza = Petshop_Ataskaitu_UI::nustatymas( 'ps_rib_isimti_marza', 20 );
		$l_dalis = Petshop_Ataskaitu_UI::nustatymas( 'ps_rib_lyderis_dalis', 10 );
		$l_marza = Petshop_Ataskaitu_UI::nustatymas( 'ps_rib_lyderis_marza', 25 );
		$imtis   = Petshop_Ataskaitu_UI::nustatymas( 'ps_rib_maza_imtis', 30 );

		$isimti = array(); $lyderiai = array();
		foreach ( $m as $x ) {
			$nuoroda = '<a href="' . esc_url( get_edit_post_link( $x['id'] ) ) . '">' . esc_html( $x['pav'] ) . '</a>';
			if ( $x['be_sav'] > 0 && $x['vnt'] > 0 ) {
				$isimti[] = array( 'pav' => $nuoroda, 'kodel' => 'savikaina neįvesta — pelnas nežinomas' );
				continue;
			}
			if ( $x['dalis'] === null || $x['marza'] === null ) { continue; }
			if ( $x['rodyta'] < $imtis ) { continue; }
			if ( $x['dalis'] < $r_dalis && $x['marza'] < $r_marza ) {
				$isimti[] = array( 'pav' => $nuoroda, 'kodel' => 'rodyta ' . $x['rodyta'] . ' · įdėta ' . $x['idejo'] . ' (' . Petshop_Ataskaitu_UI::proc( $x['dalis'] ) . ') · marža <b style="color:#b32d2e">' . Petshop_Ataskaitu_UI::proc( $x['marza'] ) . '</b>' );
			} elseif ( $x['dalis'] > $l_dalis && $x['marza'] > $l_marza ) {
				$lyderiai[] = array( 'pav' => $nuoroda, 'kodel' => 'įdėta ' . Petshop_Ataskaitu_UI::proc( $x['dalis'] ) . ' rodymų · marža <b style="color:#00794b">' . Petshop_Ataskaitu_UI::proc( $x['marza'] ) . '</b>' );
			}
		}
		usort( $isimti, function( $a, $b ) { return 0; } );

		echo '<h2>Ką daryti</h2><div class="psru-veiksmai">';
		Petshop_Ataskaitu_UI::veiksmai( 'bad', 'Kandidatai išimti iš dėžės', array_slice( $isimti, 0, 5 ), 'Kandidatų nėra — arba dar per maža imtis.' );
		Petshop_Ataskaitu_UI::veiksmai( 'ok', 'Lyderiai — verta plėsti', array_slice( $lyderiai, 0, 5 ), 'Lyderių dar neišsiskyrė.' );
		echo '</div>';
		echo '<p class="psru-pastaba">Taisyklės: „išimti" — įdėjimo dalis &lt; ' . esc_html( $r_dalis ) . ' % IR marža &lt; ' . esc_html( $r_marza ) . ' %, arba savikaina nežinoma. „Lyderis" — dalis &gt; ' . esc_html( $l_dalis ) . ' % IR marža &gt; ' . esc_html( $l_marza ) . ' %. Ribos — nustatymai, ne konstantos.</p>';
	}

	/* ---------- 4. RINKINIAI IR DYDZIAI ---------- */

	private static function sekcija_dydziai( $eil, $dezes ) {
		$grupes = array();
		foreach ( $eil as $e ) {
			$d = (int) $e['deze_id'];
			if ( ! $d || ! isset( $dezes[ $d ] ) ) { continue; }
			$r = $d . '|' . $e['dydis'];
			if ( ! isset( $grupes[ $r ] ) ) {
				$grupes[ $r ] = array( 'deze' => $d, 'dydis' => $e['dydis'], 'atidare' => 0, 'nupirko' => 0,
					'parduota' => 0, 'vnt' => 0, 'suma_ct' => 0, 'sav_ct' => 0, 'be_sav_ct' => 0, 'dov_sav' => 0, 'skirt' => array() );
			}
			$g =& $grupes[ $r ];
			if ( $e['sritis'] === 'laukai' ) {
				if ( $e['tipas'] === 'atidare' ) { $g['atidare'] += (int) $e['sesiju']; }
				elseif ( $e['tipas'] === 'nupirko' ) { $g['nupirko'] += (int) $e['sesiju']; }
				elseif ( $e['tipas'] === 'idejo' && $e['skirtukas'] !== '' ) {
					if ( ! isset( $g['skirt'][ $e['skirtukas'] ] ) ) { $g['skirt'][ $e['skirtukas'] ] = 0; }
					$g['skirt'][ $e['skirtukas'] ] += (int) $e['kiekis'];
				}
			} elseif ( $e['sritis'] === 'pardavimai' ) {
				if ( $e['tipas'] === 'parduota' ) {
					if ( (int) $e['preke_id'] === 0 ) { $g['parduota'] += (int) $e['kiekis']; $g['suma_ct'] += (int) $e['suma_ct']; }
					else { $g['vnt'] += (int) $e['kiekis']; $g['sav_ct'] += (int) $e['sav_ct']; }
				} elseif ( $e['tipas'] === 'be_sav_suma' ) { $g['be_sav_ct'] += (int) $e['suma_ct']; }
				elseif ( $e['tipas'] === 'dovana' ) { $g['dov_sav'] += (int) $e['sav_ct']; }
			}
			unset( $g );
		}

		$eilutes = array();
		foreach ( $grupes as $g ) {
			if ( ! $g['parduota'] && ! $g['atidare'] ) { continue; }
			$pav = isset( $dezes[ $g['deze'] ] ) ? $dezes[ $g['deze'] ] : ( '#' . $g['deze'] );
			$dyd = $g['dydis'] !== '' ? $g['dydis'] . ' g' : '—';
			$konv = $g['atidare'] > 0 ? ( $g['nupirko'] / $g['atidare'] ) * 100 : null;

			$vaiku_suma = 0; $vaiku_sav = $g['sav_ct'];
			foreach ( $eil as $e ) {
				if ( $e['sritis'] === 'pardavimai' && $e['tipas'] === 'parduota' && (int) $e['deze_id'] === $g['deze'] && $e['dydis'] === $g['dydis'] && (int) $e['preke_id'] > 0 ) {
					$vaiku_suma += (int) $e['suma_ct'];
				}
			}
			$su_sav = max( 0, $vaiku_suma - $g['be_sav_ct'] );
			$be_pvm = Petshop_Ataskaitu_UI::be_pvm( $su_sav );
			/* Dovanos savikaina atimama ir cia — kitaip sios lenteles pelnas
			   nesutaptu su virsuje esanciu KPI (buvo 5,15 vs 4,49 €). */
			$pelnas = (int) round( $be_pvm ) - $vaiku_sav - (int) $g['dov_sav'];
			$marza  = $be_pvm > 0 ? ( $pelnas / $be_pvm ) * 100 : null;

			$sk_html = '—';
			if ( $g['skirt'] ) {
				arsort( $g['skirt'] );
				$viso = array_sum( $g['skirt'] );
				$spalvos = array( 'be_vistienos' => '#2271b1', 'monoproteinas' => '#72aee6', 'isrankioms' => '#8c5e9e', 'visi' => '#c3c4c7' );
				$juostos = ''; $leg = array();
				foreach ( $g['skirt'] as $s => $v ) {
					$pl = $viso > 0 ? round( ( $v / $viso ) * 70 ) : 0;
					$c = isset( $spalvos[ $s ] ) ? $spalvos[ $s ] : '#c3c4c7';
					$juostos .= '<b style="background:' . esc_attr( $c ) . ';width:' . (int) max( 4, $pl ) . 'px"></b>';
					$leg[] = Petshop_Statistika::skirtuko_vardas( $s ) . ' ' . round( ( $v / max( 1, $viso ) ) * 100 );
				}
				$sk_html = '<span class="psru-skirt">' . $juostos . '</span><div class="psru-skirt-leg">' . esc_html( implode( ' · ', $leg ) ) . '</div>';
			}

			$eilutes[] = array(
				'<a href="' . esc_url( get_edit_post_link( $g['deze'] ) ) . '">' . esc_html( $pav ) . '</a><div class="sub">' . esc_html( $dyd ) . '</div>',
				number_format( $g['atidare'], 0, ',', ' ' ),
				$konv === null ? '—' : Petshop_Ataskaitu_UI::maza_imtis( Petshop_Ataskaitu_UI::proc( $konv ), $g['atidare'] ),
				'<b>' . number_format( $g['parduota'], 0, ',', ' ' ) . '</b>',
				$g['parduota'] > 0 ? number_format( $g['vnt'] / $g['parduota'], 1, ',', ' ' ) . ' vnt.' : '—',
				Petshop_Ataskaitu_UI::eur( $g['suma_ct'] ),
				Petshop_Ataskaitu_UI::eur( $pelnas ),
				$marza === null ? '—' : Petshop_Ataskaitu_UI::proc( $marza ),
				$sk_html,
			);
		}

		echo '<h2>Rinkiniai ir dydžiai</h2>';
		Petshop_Ataskaitu_UI::lentele( 'psru-dydziai', array(
			array( 'pav' => 'Rinkinys · dydis', 'kaire' => true ),
			array( 'pav' => 'Atidarė', 'tt' => 'Unikalios sesijos, atidariusios dėžę. Iš sutikusių su statistika.' ),
			array( 'pav' => 'Konversija', 'tt' => 'Atidarė → nupirko. Pagrindinis dėžės sveikatos rodiklis. Iš sutikusių su statistika.' ),
			array( 'pav' => 'Parduota' ),
			array( 'pav' => 'Vid. dydis' ),
			array( 'pav' => 'Pajamos' ),
			array( 'pav' => 'Pelnas' ),
			array( 'pav' => 'Marža' ),
			array( 'pav' => 'Skirtukai', 'tt' => 'Įdėjimų pasiskirstymas pagal dėžės skirtuką — per kurį filtrą klientai realiai renkasi.' ),
		), $eilutes, array( 'rikiuoti' => 3, 'failas' => 'rinkiniai-dydziai.csv' ) );
	}

	/* ---------- 5. PREKES ---------- */

	private static function sekcija_prekes( $eil, $lt ) {
		$m = self::prekiu_metrikos( $eil );
		uasort( $m, function( $a, $b ) { return $b['vnt'] <=> $a['vnt']; } );

		$eilutes = array();
		foreach ( $m as $x ) {
			$uzs = admin_url( 'admin.php?page=wc-orders&s=' . rawurlencode( $x['pav'] ) . '&search-filter=all' );
			$eilutes[] = array(
				'<a href="' . esc_url( Petshop_Ataskaitu_UI::nuoroda( self::SLUG, array( 'preke' => $x['id'] ) ) ) . '">' . esc_html( $x['pav'] ) . '</a>'
					. '<div class="sub">#' . (int) $x['id'] . ' · <a href="' . esc_url( $uzs ) . '" style="font-weight:400">užsakymai →</a></div>',
				$x['rodyta'] ? number_format( $x['rodyta'], 0, ',', ' ' ) : '—',
				$x['idejo'] ? number_format( $x['idejo'], 0, ',', ' ' ) : '—',
				$x['dalis'] === null ? '—' : Petshop_Ataskaitu_UI::maza_imtis( Petshop_Ataskaitu_UI::proc( $x['dalis'] ), $x['rodyta'] ),
				'<b>' . number_format( $x['vnt'], 0, ',', ' ' ) . '</b>',
				Petshop_Ataskaitu_UI::eur( $x['suma_ct'] ),
				$x['be_sav'] > 0 ? '<span class="bad">nežinoma</span>' : Petshop_Ataskaitu_UI::eur( $x['sav_ct'] ),
				$x['pelnas_ct'] === null ? '—' : Petshop_Ataskaitu_UI::eur( $x['pelnas_ct'] ),
				$x['marza'] === null ? '—' : ( '<span class="' . ( $x['marza'] >= 25 ? 'ok' : ( $x['marza'] < 20 ? 'bad' : '' ) ) . '">' . Petshop_Ataskaitu_UI::proc( $x['marza'] ) . '</span>' ),
				Petshop_Ataskaitu_UI::juostele( Petshop_Ataskaitu_UI::proc( $x['apyvartos_dalis'] ), $x['apyvartos_dalis'] ),
			);
		}

		echo '<h2>Prekės dėžėse</h2>';
		Petshop_Ataskaitu_UI::lentele( 'psru-prekes', array(
			array( 'pav' => 'Prekė', 'kaire' => true ),
			array( 'pav' => 'Rodyta', 'tt' => 'Kiek kartų prekės kortelė buvo matoma atidarytoje dėžėje. Renkama iš visų lankytojų (anonimiškai).' ),
			array( 'pav' => 'Įdėta' ),
			array( 'pav' => 'Įdėjimo dalis', 'tt' => 'Įdėta ÷ rodyta. Pagrindinis „ar prekė traukia" rodiklis — nepriklauso nuo srauto dydžio.' ),
			array( 'pav' => 'Parduota' ),
			array( 'pav' => 'Pajamos' ),
			array( 'pav' => 'Savikaina' ),
			array( 'pav' => 'Pelnas' ),
			array( 'pav' => 'Marža' ),
			array( 'pav' => 'Dalis apyvartoje' ),
		), $eilutes, array( 'rikiuoti' => 4, 'failas' => 'prekes-dezese.csv' ) );
		echo '<p class="psru-pastaba">Prekės pavadinimas atidaro jos analizę; „užsakymai →" veda į užsakymų sąrašą. Brūkšnys elgsenos stulpelyje reiškia „dar nerenkama".</p>';
	}

	/* ---------- 6. PREKES DRILL-DOWN ---------- */

	private static function sekcija_preke( $eil, $pid ) {
		$m = self::prekiu_metrikos( $eil );
		if ( ! isset( $m[ $pid ] ) ) { return; }
		$x = $m[ $pid ];

		$skirt = array(); $pilnumas = array( 'iseme_p1' => 0, 'iseme_p2' => 0, 'iseme_p3' => 0 );
		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'laukai' || (int) $e['preke_id'] !== $pid ) { continue; }
			if ( $e['tipas'] === 'idejo' && $e['skirtukas'] !== '' ) {
				if ( ! isset( $skirt[ $e['skirtukas'] ] ) ) { $skirt[ $e['skirtukas'] ] = 0; }
				$skirt[ $e['skirtukas'] ] += (int) $e['kiekis'];
			} elseif ( isset( $pilnumas[ $e['tipas'] ] ) ) {
				$pilnumas[ $e['tipas'] ] += (int) $e['kiekis'];
			}
		}

		$sav = get_post_meta( $pid, '_ps_savikaina', true );
		echo '<h2>Prekės analizė</h2><div class="psru-blokas">';
		echo '<div class="psru-galva" style="align-items:baseline;flex-wrap:wrap"><b style="font-size:15px">' . esc_html( $x['pav'] ) . '</b>';
		echo '<span class="psru-pastaba" style="margin:0">#' . (int) $pid . ( $sav !== '' ? ' · savikaina ' . esc_html( $sav ) . ' €' : '' )
			. ' · <a href="' . esc_url( get_edit_post_link( $pid ) ) . '">prekės kortelė →</a>'
			. ' · <a href="' . esc_url( Petshop_Ataskaitu_UI::nuoroda( self::SLUG, array( 'preke' => '' ) ) ) . '">užverti</a></span></div>';

		echo '<div class="psru-kpi" style="margin:12px 0">';
		Petshop_Ataskaitu_UI::kpi( 'Įdėjimo dalis', $x['dalis'] === null ? '—' : Petshop_Ataskaitu_UI::proc( $x['dalis'] ) );
		Petshop_Ataskaitu_UI::kpi( 'Išėmimo rodiklis', $x['isemimo'] === null ? '—' : Petshop_Ataskaitu_UI::proc( $x['isemimo'] ), null, '',
			'Iš įdėtų — kiek vėliau išimta. Aukštas = gerai atrodo kortelėje, nuvilia pagalvojus: kandidatas keisti nuotrauką ar aprašą, ne būtinai išimti.' );
		Petshop_Ataskaitu_UI::kpi( 'Parduota vnt.', number_format( $x['vnt'], 0, ',', ' ' ) );
		Petshop_Ataskaitu_UI::kpi( 'Marža', $x['marza'] === null ? '—' : Petshop_Ataskaitu_UI::proc( $x['marza'] ) );
		echo '</div>';

		echo '<div class="psru-veiksmai">';
		echo '<div class="psru-v"><h3>Įdėjimai pagal skirtuką</h3>';
		if ( $skirt ) {
			$viso = array_sum( $skirt );
			foreach ( $skirt as $s => $v ) {
				echo '<div class="psru-eilute"><span class="pav">' . esc_html( Petshop_Statistika::skirtuko_vardas( $s ) ) . '</span>'
					. '<span class="juosta"><b style="width:' . esc_attr( round( ( $v / max( 1, $viso ) ) * 100 ) ) . '%"></b></span>'
					. '<span class="sk">' . (int) $v . ' (' . round( ( $v / max( 1, $viso ) ) * 100 ) . ' %)</span></div>';
			}
		} else { echo '<p class="psru-pastaba">Duomenų dar nėra.</p>'; }
		echo '</div>';

		echo '<div class="psru-v"><h3>Išėmimai pagal dėžės pilnumą' . Petshop_Ataskaitu_UI::tt( 'Kiek vnt. buvo dėžėje išėmimo momentu. Rodo, ties kuriuo žingsniu prekė metama vardan kitos.' ) . '</h3>';
		$viso_p = array_sum( $pilnumas );
		if ( $viso_p > 0 ) {
			$vardai = array( 'iseme_p1' => '1–4 vnt.', 'iseme_p2' => '5–8 vnt.', 'iseme_p3' => '9+ vnt.' );
			foreach ( $pilnumas as $k => $v ) {
				echo '<div class="psru-eilute"><span class="pav">' . esc_html( $vardai[ $k ] ) . '</span>'
					. '<span class="juosta"><b style="width:' . esc_attr( round( ( $v / $viso_p ) * 100 ) ) . '%"></b></span>'
					. '<span class="sk">' . (int) $v . '</span></div>';
			}
		} else { echo '<p class="psru-pastaba">Išėmimų šiuo laikotarpiu nefiksuota.</p>'; }
		echo '</div></div></div>';
	}

	/* ---------- 7. PILTUVELIS ---------- */

	private static function sekcija_piltuvelis( $eil ) {
		$z = array(
			array( 'pav' => 'Atidarė dėžę', 'sk' => self::sesiju( $eil, 'atidare' ) ),
			array( 'pav' => 'Prisidėjo bent vieną', 'sk' => self::sesiju( $eil, 'idejo' ) ),
			array( 'pav' => 'Pasiekė minimumą', 'sk' => self::sesiju( $eil, 'min_pasiekta' ) ),
			array( 'pav' => 'Įsidėjo į krepšelį', 'sk' => self::sesiju( $eil, 'krepselis' ) ),
			array( 'pav' => 'Nupirko', 'sk' => self::sesiju( $eil, 'nupirko' ) ),
		);
		echo '<h2>Piltuvėlis <span style="font-weight:400;color:#787c82;font-size:13px">— iš sutikusių su statistika</span></h2>';
		Petshop_Ataskaitu_UI::piltuvelis( $z );

		/* pjuviai */
		$pjuvis = isset( $_GET['pjuvis'] ) ? sanitize_key( $_GET['pjuvis'] ) : 'skirtukas';
		$leistini = array( 'skirtukas' => 'skirtuką', 'dydis' => 'dydį', 'irenginys' => 'įrenginį' );
		if ( ! isset( $leistini[ $pjuvis ] ) ) { $pjuvis = 'skirtukas'; }

		echo '<h2 style="font-size:14px;margin-top:22px">Piltuvėlis pjūviais <span style="font-weight:400;color:#787c82">— tas pats kelias, perjungiamas pagal</span> <span class="psru-presetai" style="display:inline-flex;vertical-align:-4px;margin-left:6px">';
		foreach ( $leistini as $k => $v ) {
			echo '<a class="psru-pbtn' . ( $pjuvis === $k ? ' akt' : '' ) . '" href="' . esc_url( Petshop_Ataskaitu_UI::nuoroda( self::SLUG, array( 'pjuvis' => $k ) ) ) . '">' . esc_html( $v ) . '</a>';
		}
		echo '</span></h2>';

		$g = array();
		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'laukai' ) { continue; }
			$r = (string) $e[ $pjuvis ];
			if ( ! isset( $g[ $r ] ) ) { $g[ $r ] = array( 'atidare' => 0, 'idejo' => 0, 'min_pasiekta' => 0, 'krepselis' => 0, 'nupirko' => 0 ); }
			if ( isset( $g[ $r ][ $e['tipas'] ] ) ) { $g[ $r ][ $e['tipas'] ] += (int) $e['sesiju']; }
		}
		$eilutes = array();
		foreach ( $g as $r => $v ) {
			if ( ! array_sum( $v ) ) { continue; }
			$pav = $pjuvis === 'skirtukas' ? Petshop_Statistika::skirtuko_vardas( $r )
				: ( $pjuvis === 'dydis' ? ( $r !== '' ? $r . ' g' : '—' ) : ( $r === 'mobile' ? 'Mobilus' : ( $r === 'desktop' ? 'Kompiuteris' : '—' ) ) );
			$konv = $v['atidare'] > 0 ? ( $v['nupirko'] / $v['atidare'] ) * 100 : 0;
			$eilutes[] = array(
				esc_html( $pav ),
				number_format( $v['atidare'], 0, ',', ' ' ),
				number_format( $v['idejo'], 0, ',', ' ' ),
				number_format( $v['min_pasiekta'], 0, ',', ' ' ),
				number_format( $v['krepselis'], 0, ',', ' ' ),
				'<b>' . number_format( $v['nupirko'], 0, ',', ' ' ) . '</b>',
				Petshop_Ataskaitu_UI::maza_imtis( Petshop_Ataskaitu_UI::proc( $konv ), $v['atidare'] ),
			);
		}
		Petshop_Ataskaitu_UI::lentele( 'psru-pjuviai', array(
			array( 'pav' => ucfirst( $pjuvis ), 'kaire' => true ),
			array( 'pav' => 'Atidarė' ), array( 'pav' => 'Prisidėjo' ), array( 'pav' => 'Pasiekė min.' ),
			array( 'pav' => 'Į krepšelį' ), array( 'pav' => 'Nupirko' ),
			array( 'pav' => 'Konversija', 'tt' => 'Atidarė → nupirko. Lyginti eilutes tarpusavyje — matosi, kuris pjūvis atveda perkančius.' ),
		), $eilutes, array( 'paieska' => false, 'rikiuoti' => 1, 'failas' => 'piltuvelis-pjuviais.csv' ) );
	}

	/* ---------- 8. KELIAS DEZEJE ---------- */

	private static function sekcija_kelias( $eil ) {
		$kabliukai = self::elgsena( $eil, 'kabliukas', 'kiekis' );
		$uzdaryt   = self::elgsena( $eil, 'uzdarytoja', 'kiekis' );

		/* buvimas nupirktose dezese */
		$dezes_sk = 0; $prekiu_dezese = array();
		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'pardavimai' || $e['tipas'] !== 'parduota' ) { continue; }
			if ( (int) $e['preke_id'] === 0 ) { $dezes_sk += (int) $e['kiekis']; }
			else {
				$pid = (int) $e['preke_id'];
				if ( ! isset( $prekiu_dezese[ $pid ] ) ) { $prekiu_dezese[ $pid ] = 0; }
				$prekiu_dezese[ $pid ]++;
			}
		}

		/* $vardiklis: kabliukams/uzdarytojoms — visu ivykiu suma (dalis sesiju),
		   „nupirktose dezese" — NUPIRKTU DEZIU skaicius. Anksciau abiem buvo
		   naudojama suma, todel „yra 9 % deziu" reiske „1 is 11 eiluciu" — melas. */
		$sarasas = function( $duom, $formatas, $vardiklis = null ) {
			arsort( $duom );
			$viso = ( $vardiklis === null ) ? array_sum( $duom ) : (int) $vardiklis;
			$out = array();
			foreach ( array_slice( $duom, 0, 3, true ) as $pid => $v ) {
				if ( ! $pid ) { continue; }
				$out[] = array(
					'pav' => '<a href="' . esc_url( get_edit_post_link( $pid ) ) . '">' . esc_html( get_the_title( $pid ) ?: ( '#' . $pid ) ) . '</a>',
					'kodel' => sprintf( $formatas, $viso > 0 ? round( ( $v / $viso ) * 100 ) : 0, $v ),
				);
			}
			return $out;
		};

		echo '<h2>Kelias dėžėje</h2><div class="psru-veiksmai trys">';
		Petshop_Ataskaitu_UI::veiksmai( '', 'Kabliukai' . Petshop_Ataskaitu_UI::tt( 'Dažniausiai įdedama PIRMOJI. Šios prekės įtraukia žmogų į dėžę — neišimti, net jei marža vidutinė.' ),
			$sarasas( $kabliukai, 'pirmoji %d %% sesijų' ), 'Duomenų dar nėra.' );
		Petshop_Ataskaitu_UI::veiksmai( '', 'Uždarytojos' . Petshop_Ataskaitu_UI::tt( 'Paskutinė įdėta prieš „į krepšelį". Prekės, kurios užbaigia sprendimą — dažnai jomis užpildoma dėžė iki ribos.' ),
			$sarasas( $uzdaryt, 'paskutinė %d %%' ), 'Duomenų dar nėra.' );
		Petshop_Ataskaitu_UI::veiksmai( '', 'Nupirktose dėžėse' . Petshop_Ataskaitu_UI::tt( 'Kokioje dalyje nupirktų dėžių prekė yra. Iš užsakymų — sutikimo nereikia.' ),
			$dezes_sk > 0 ? $sarasas( $prekiu_dezese, 'yra %1$d %% dėžių (%2$d)', $dezes_sk ) : array(), 'Pardavimų dar nėra.' );
		echo '</div>';
		echo '<p class="psru-pastaba">Kabliukas ≠ uždarytoja ≠ pelningiausia — trys skirtingi vaidmenys dėžėje. Prekė gali būti žemos maržos, bet gyventi kaip užpildas gale: tai keičia sprendimą „išimti ar palikti".</p>';
	}

	/* ---------- 9. DOVANA ---------- */

	private static function sekcija_dovana( $eil, $pries ) {
		$sk = function( $e ) {
			$o = array( 'dezes' => 0, 'dezes_suma' => 0, 'sd' => 0, 'sd_suma' => 0, 'dov_sav' => 0, 'dovanos' => array(),
				'riba' => 0, 'riba_krep' => 0, 'be_ribos_krep' => 0 );
			foreach ( $e as $x ) {
				if ( $x['sritis'] === 'pardavimai' ) {
					if ( $x['tipas'] === 'parduota' && (int) $x['preke_id'] === 0 ) { $o['dezes'] += (int) $x['kiekis']; $o['dezes_suma'] += (int) $x['suma_ct']; }
					elseif ( $x['tipas'] === 'parduota_sd' ) { $o['sd'] += (int) $x['kiekis']; $o['sd_suma'] += (int) $x['suma_ct']; $o['dov_sav'] += (int) $x['sav_ct']; }
					elseif ( $x['tipas'] === 'dovana' ) {
						$pid = (int) $x['preke_id'];
						if ( ! isset( $o['dovanos'][ $pid ] ) ) { $o['dovanos'][ $pid ] = 0; }
						$o['dovanos'][ $pid ] += (int) $x['kiekis'];
					}
				} elseif ( $x['sritis'] === 'laukai' ) {
					if ( $x['tipas'] === 'riba_pasieke' ) { $o['riba'] += (int) $x['sesiju']; }
					elseif ( $x['tipas'] === 'riba_pasieke_krepselis' ) { $o['riba_krep'] += (int) $x['sesiju']; }
					elseif ( $x['tipas'] === 'riba_nepasieke_krepselis' ) { $o['be_ribos_krep'] += (int) $x['sesiju']; }
				}
			}
			return $o;
		};
		$d = $sk( $eil );
		$dp = $pries ? $sk( $pries ) : null;
		if ( ! $d['dezes'] && ! $d['riba'] ) { return; }

		$dalis   = $d['dezes'] > 0 ? ( $d['sd'] / $d['dezes'] ) * 100 : 0;
		$dalis_p = ( $dp && $dp['dezes'] > 0 ) ? ( $dp['sd'] / $dp['dezes'] ) * 100 : 0;
		$cekis_sd = $d['sd'] > 0 ? (int) round( $d['sd_suma'] / $d['sd'] ) : 0;
		$be_sk = $d['dezes'] - $d['sd'];
		$cekis_be = $be_sk > 0 ? (int) round( ( $d['dezes_suma'] - $d['sd_suma'] ) / $be_sk ) : 0;
		$prieaugis = $cekis_sd - $cekis_be;
		$kastas = $d['sd'] > 0 ? (int) round( $d['dov_sav'] / $d['sd'] ) : 0;
		$graza = $kastas > 0 ? $prieaugis / $kastas : 0;

		echo '<h2>Dovana — ar riba veikia' . Petshop_Ataskaitu_UI::tt( 'Dėžės su dovana = konteineriai, kuriuose yra dovanos eilutė. Iš VISŲ užsakymų — sutikimo nereikia.' ) . '</h2>';
		echo '<div class="psru-kpi">';
		Petshop_Ataskaitu_UI::kpi( 'Nupirkta su dovana',
			(int) $d['sd'] . ' <span style="font-size:14px;color:#787c82;font-weight:400">iš ' . (int) $d['dezes'] . ' (' . round( $dalis ) . ' %)</span>',
			$dp ? array( 'dabar' => $dalis, 'buvo' => $dalis_p, 'pp' => true ) : null,
			$dp ? 'buvo ' . round( $dalis_p ) . ' %' : '' );
		Petshop_Ataskaitu_UI::kpi( 'Vid. čekis su dovana', Petshop_Ataskaitu_UI::eur( $cekis_sd ), null,
			'be dovanos — ' . ( $be_sk > 0 ? Petshop_Ataskaitu_UI::eur( $cekis_be ) : '—' ) );
		/* Be „be dovanos" deziu palyginimo grupes nera — cekio prieaugis butu
		   lygus visam cekiui, o graza absurdiskai didele (72,9x incidentas). */
		$yra_palyginimas = ( $be_sk > 0 );
		Petshop_Ataskaitu_UI::kpi( 'Čekio prieaugis',
			$yra_palyginimas ? '<span style="color:' . ( $prieaugis >= 0 ? '#00794b' : '#b32d2e' ) . '">' . Petshop_Ataskaitu_UI::eur( $prieaugis ) . '</span>' : '—', null,
			$yra_palyginimas ? 'dovanos kaštas ' . Petshop_Ataskaitu_UI::eur( $kastas ) . '/dėžei' : 'nėra dėžių be dovanos — nėra su kuo lyginti' );
		Petshop_Ataskaitu_UI::kpi( 'Grąža', ( $yra_palyginimas && $kastas > 0 ) ? number_format( $graza, 1, ',', ' ' ) . '×' : '—', null, '',
			'Čekio prieaugis ÷ dovanos savikaina. Virš 1 — dovana atsiperka. Skaičius orientacinis: dalis prieaugio būtų buvusi ir be dovanos, todėl žiūrėti tendenciją, ne absoliutą.' );
		echo '</div>';

		echo '<div class="psru-veiksmai" style="margin-top:12px">';
		$dov = array();
		arsort( $d['dovanos'] );
		$viso_dov = array_sum( $d['dovanos'] );
		foreach ( array_slice( $d['dovanos'], 0, 3, true ) as $pid => $v ) {
			if ( ! $pid ) { continue; }
			$dov[] = array(
				'pav' => '<a href="' . esc_url( get_edit_post_link( $pid ) ) . '">' . esc_html( get_the_title( $pid ) ?: ( '#' . $pid ) ) . '</a>',
				'kodel' => (int) $v . ' dėžių (' . ( $viso_dov > 0 ? round( ( $v / $viso_dov ) * 100 ) : 0 ) . ' %)',
			);
		}
		Petshop_Ataskaitu_UI::veiksmai( '', 'Kurią dovaną renkasi', $dov, 'Dovanų dar neparduota.' );

		$k1 = $d['riba'] > 0 ? round( ( $d['riba_krep'] / $d['riba'] ) * 100 ) : 0;
		Petshop_Ataskaitu_UI::veiksmai( '', 'Riba kaip variklis' . Petshop_Ataskaitu_UI::tt( 'Sesijos, pasiekusios dovanos ribą, vs nepasiekusios. Iš sutikusių su statistika.' ), array(
			array( 'pav' => 'Pasiekė ribą → krepšelis', 'kodel' => '<b style="color:#00794b">' . $k1 . ' %</b>' ),
			array( 'pav' => 'Nepasiekė ribos → krepšelis', 'kodel' => (int) $d['be_ribos_krep'] . ' sesijos' ),
		), 'Duomenų dar nėra.' );
		echo '</div>';
		echo '<p class="psru-pastaba">Jei „su dovana" dalis nukristų žemiau ~40 % arba grąža artėtų prie 1× — riba per aukšta arba dovanos neįdomios.</p>';
	}

	/* ---------- 10. IRENGINIAI ---------- */

	private static function sekcija_irenginiai( $eil ) {
		$g = array( 'mobile' => null, 'desktop' => null );
		foreach ( $eil as $e ) {
			$i = $e['irenginys'];
			if ( $i !== 'mobile' && $i !== 'desktop' ) { continue; }
			if ( $g[ $i ] === null ) { $g[ $i ] = array( 'atidare' => 0, 'krepselis' => 0, 'nupirko' => 0, 'dezes' => 0, 'suma_ct' => 0 ); }
			if ( $e['sritis'] === 'laukai' ) {
				if ( isset( $g[ $i ][ $e['tipas'] ] ) ) { $g[ $i ][ $e['tipas'] ] += (int) $e['sesiju']; }
			} elseif ( $e['sritis'] === 'pardavimai' && $e['tipas'] === 'parduota' && (int) $e['preke_id'] === 0 ) {
				$g[ $i ]['dezes'] += (int) $e['kiekis'];
				$g[ $i ]['suma_ct'] += (int) $e['suma_ct'];
			}
		}
		$viso_at = 0;
		foreach ( $g as $v ) { if ( $v ) { $viso_at += $v['atidare']; } }

		$eilutes = array();
		foreach ( array( 'mobile' => 'Mobilus', 'desktop' => 'Kompiuteris' ) as $k => $pav ) {
			if ( $g[ $k ] === null ) { continue; }
			$v = $g[ $k ];
			$konv = $v['atidare'] > 0 ? ( $v['nupirko'] / $v['atidare'] ) * 100 : null;
			$eilutes[] = array(
				esc_html( $pav ),
				number_format( $v['atidare'], 0, ',', ' ' ) . ( $viso_at > 0 ? ' (' . round( ( $v['atidare'] / $viso_at ) * 100 ) . ' %)' : '' ),
				number_format( $v['krepselis'], 0, ',', ' ' ),
				$konv === null ? '—' : Petshop_Ataskaitu_UI::maza_imtis( Petshop_Ataskaitu_UI::proc( $konv ), $v['atidare'] ),
				'<b>' . number_format( $v['dezes'], 0, ',', ' ' ) . '</b>',
				Petshop_Ataskaitu_UI::eur( $v['suma_ct'] ),
				$v['dezes'] > 0 ? Petshop_Ataskaitu_UI::eur( (int) round( $v['suma_ct'] / $v['dezes'] ) ) : '—',
			);
		}
		if ( ! $eilutes ) { return; }

		echo '<h2>Įrenginiai — per kur perka' . Petshop_Ataskaitu_UI::tt( 'Pirkimai — iš užsakymo atributo (visi užsakymai). Elgsenos žingsniai — iš įvykių.' ) . '</h2>';
		Petshop_Ataskaitu_UI::lentele( 'psru-irenginiai', array(
			array( 'pav' => 'Įrenginys', 'kaire' => true ),
			array( 'pav' => 'Atidarė' ), array( 'pav' => 'Į krepšelį' ),
			array( 'pav' => 'Konversija', 'tt' => 'Atidarė → nupirko, iš sutikusių su statistika.' ),
			array( 'pav' => 'Nupirkta dėžių' ), array( 'pav' => 'Pajamos' ), array( 'pav' => 'Vid. čekis' ),
		), $eilutes, array( 'paieska' => false, 'rikiuoti' => 5, 'failas' => 'irenginiai.csv' ) );
		echo '<p class="psru-pastaba">Nupirkta ir pajamos — iš VISŲ užsakymų; konversija — iš sutikusių su statistika. Jei mobili konversija gerokai žemesnė, tai UX darbas su išmatuojamu prizu.</p>';
	}

	/* ---------- 11. NUSTATYMAI ---------- */

	private static function sekcija_nustatymai() {
		$p = class_exists( 'Petshop_Statistika' ) ? Petshop_Statistika::pradzia() : '';
		echo '<h2>Nustatymai</h2><div class="psru-blokas">';
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">';
		wp_nonce_field( 'ps_stat_pradzia' );
		echo '<input type="hidden" name="action" value="ps_stat_pradzia">';
		echo '<label><b>Statistikos pradžia</b></label>';
		echo '<input type="date" name="pradzia" value="' . esc_attr( $p ) . '">';
		echo '<button class="button">Išsaugoti</button>';
		echo '<span class="psru-pastaba" style="margin:0">Nuo šios datos skaičiuojama „Nuo pradžios". Ribos (kandidatų, lyderių, mažos imties) keičiamos per opcijas.</span>';
		echo '</form></div>';
	}
}

add_action( 'plugins_loaded', function() {
	if ( class_exists( 'Petshop_Ataskaitu_UI' ) ) { Petshop_Rinkiniu_Ataskaita::init(); }
}, 25 );
