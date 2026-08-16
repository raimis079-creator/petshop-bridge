<?php
/**
 * Plugin Name: Petshop Statistika — Paruosti rinkiniai (ataskaita)
 * Description: „Petshop ataskaitos" → „Rinkiniai": paruosti MnM rinkiniai ir DP pakai, kanibalizacija, pakopos.
 * Version: 1.0
 *
 * Ekranas ant to paties standarto v2 karkaso kaip „Surenkami rinkiniai", bet
 * atsako i kita klausima. Surenkamoms dezems svarbu, KA klientas renkasi;
 * paruostiems rinkiniams — ar rinkinys PRIDEDA pardavimu, ar tik perkelia juos
 * is katalogo su mazesne marza (kanibalizacija). Todel vietoj dezes piltuvelio
 * cia: kanibalizacija, „Sutaupote" efektyvumas ir DP pakopos.
 *
 * Verdiktas (PRIDEDA / PERKELIA / PER MAZAI) — heuristika is palyginimo su
 * ankstesniu laikotarpiu, NE A/B irodymas. Todel jis kviecia perziureti, o ne
 * naikinti: tai savininko sprendimas, ne sistemos.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Paruostu_Ataskaita {

	const VERSIJA = '1.0';
	const CAP     = 'manage_woocommerce';
	const PARENT  = 'petshop-reports';
	const SLUG    = 'petshop-reports-paruosti';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ), 21 );
	}

	public static function menu() {
		add_submenu_page(
			self::PARENT, 'Rinkiniai', 'Rinkiniai',
			self::CAP, self::SLUG, array( __CLASS__, 'render' )
		);
	}

	/* ==================== DUOMENYS ==================== */

	/**
	 * Paruosti rinkiniai: MnM produktai BE `_ps_laukas` (tie yra surenkamos
	 * dezes — kitas ekranas) + DP pakai (`_dp_base_product_id`).
	 */
	public static function rinkiniai() {
		global $wpdb;
		$kesas = wp_cache_get( 'ps_ata_paruosti' );
		if ( is_array( $kesas ) ) { return $kesas; }

		$out = array();
		$mnm = $wpdb->get_col(
			"SELECT p.ID FROM {$wpdb->posts} p
			 INNER JOIN {$wpdb->term_relationships} tr ON tr.object_id=p.ID
			 INNER JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id
			 INNER JOIN {$wpdb->terms} t ON t.term_id=tt.term_id
			 WHERE p.post_type='product' AND p.post_status IN ('publish','draft')
			   AND tt.taxonomy='product_type' AND t.slug='mix-and-match' LIMIT 300"
		);
		foreach ( (array) $mnm as $id ) {
			$id = (int) $id;
			if ( get_post_meta( $id, '_ps_laukas', true ) === 'yes' ) { continue; }
			$out[ $id ] = array( 'id' => $id, 'pav' => get_the_title( $id ), 'tipas' => 'mnm', 'komp' => self::komponentai_mnm( $id ) );
		}

		$dp = $wpdb->get_col( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='_dp_base_product_id' LIMIT 300" );
		foreach ( (array) $dp as $id ) {
			$id = (int) $id;
			if ( get_post_status( $id ) === false ) { continue; }
			$baze = (int) get_post_meta( $id, '_dp_base_product_id', true );
			$qty  = (int) get_post_meta( $id, '_dp_pack_qty', true );
			$out[ $id ] = array( 'id' => $id, 'pav' => get_the_title( $id ), 'tipas' => 'dp', 'komp' => array( $baze ), 'baze' => $baze, 'qty' => $qty );
		}

		wp_cache_set( 'ps_ata_paruosti', $out, '', 300 );
		return $out;
	}

	private static function komponentai_mnm( $id ) {
		global $wpdb;
		$t = $wpdb->prefix . 'wc_mnm_child_items';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) !== $t ) { return array(); }
		return array_map( 'intval', (array) $wpdb->get_col( $wpdb->prepare( "SELECT product_id FROM $t WHERE container_id=%d", $id ) ) );
	}

	/** Gyvuno grupe — is kategoriju (sunims / katems / kita). */
	private static function gyvunas( $pid ) {
		$terms = wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'names' ) );
		$t = is_array( $terms ) ? mb_strtolower( implode( ' ', $terms ) ) : '';
		if ( strpos( $t, 'kat' ) !== false ) { return 'katems'; }
		if ( strpos( $t, 'šun' ) !== false || strpos( $t, 'sun' ) !== false ) { return 'sunims'; }
		return 'kita';
	}

	private static function duomenys( $nuo, $iki ) {
		return Petshop_Ataskaitu_Agregavimas::eilutes( $nuo, $iki, array( 'pardavimai', 'parduotuve' ) );
	}

	/** Rinkiniu metrikos is eiluciu. */
	private static function metrikos( $eil, $rinkiniai ) {
		$out = array();
		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'pardavimai' ) { continue; }
			$rid = (int) $e['deze_id'];
			if ( ! $rid || ! isset( $rinkiniai[ $rid ] ) ) { continue; }
			if ( ! isset( $out[ $rid ] ) ) {
				$out[ $rid ] = array( 'parduota' => 0, 'suma_ct' => 0, 'sav_ct' => 0, 'komp_vnt' => 0,
					'be_sav' => 0, 'be_sav_ct' => 0, 'pakopos' => array() );
			}
			$o =& $out[ $rid ];
			if ( $e['tipas'] === 'parduota' ) {
				if ( (int) $e['preke_id'] === 0 ) { $o['parduota'] += (int) $e['kiekis']; $o['suma_ct'] += (int) $e['suma_ct']; }
				else { $o['komp_vnt'] += (int) $e['kiekis']; $o['sav_ct'] += (int) $e['sav_ct']; }
			} elseif ( $e['tipas'] === 'be_savikainos' ) { $o['be_sav'] += (int) $e['kiekis']; }
			elseif ( $e['tipas'] === 'be_sav_suma' ) { $o['be_sav_ct'] += (int) $e['suma_ct']; }
			elseif ( $e['tipas'] === 'dp_pakopa' ) {
				$p = $e['dydis'];
				if ( ! isset( $o['pakopos'][ $p ] ) ) { $o['pakopos'][ $p ] = array( 'kiekis' => 0, 'suma_ct' => 0, 'sav_ct' => 0 ); }
				$o['pakopos'][ $p ]['kiekis']  += (int) $e['kiekis'];
				$o['pakopos'][ $p ]['suma_ct'] += (int) $e['suma_ct'];
				$o['pakopos'][ $p ]['sav_ct']  += (int) $e['sav_ct'];
			}
			unset( $o );
		}

		/* DP: konteinerio eilutes nera — pardavimu skaicius imamas is pakopu. */
		foreach ( $out as $rid => $o ) {
			if ( $rinkiniai[ $rid ]['tipas'] === 'dp' && ! $o['parduota'] ) {
				foreach ( $o['pakopos'] as $p ) { $out[ $rid ]['parduota'] += $p['kiekis']; $out[ $rid ]['suma_ct'] += $p['suma_ct']; }
			}
		}
		return $out;
	}

	/** Komponentu pardavimai ATSKIRAI kataloge (kanibalizacijos palyginimui). */
	private static function atskirai( $eil ) {
		$o = array();
		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'pardavimai' || $e['tipas'] !== 'atskirai' ) { continue; }
			$pid = (int) $e['preke_id'];
			if ( ! isset( $o[ $pid ] ) ) { $o[ $pid ] = array( 'vnt' => 0, 'suma_ct' => 0, 'sav_ct' => 0 ); }
			$o[ $pid ]['vnt']     += (int) $e['kiekis'];
			$o[ $pid ]['suma_ct'] += (int) $e['suma_ct'];
			$o[ $pid ]['sav_ct']  += (int) $e['sav_ct'];
		}
		return $o;
	}

	/** Komponentu vienetai RINKINYJE. */
	private static function rinkinyje( $eil, $rid ) {
		$o = array();
		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'pardavimai' || $e['tipas'] !== 'parduota' ) { continue; }
			if ( (int) $e['deze_id'] !== $rid || (int) $e['preke_id'] === 0 ) { continue; }
			$pid = (int) $e['preke_id'];
			if ( ! isset( $o[ $pid ] ) ) { $o[ $pid ] = array( 'vnt' => 0, 'suma_ct' => 0, 'sav_ct' => 0 ); }
			$o[ $pid ]['vnt']     += (int) $e['kiekis'];
			$o[ $pid ]['suma_ct'] += (int) $e['suma_ct'];
			$o[ $pid ]['sav_ct']  += (int) $e['sav_ct'];
		}
		return $o;
	}

	/* ==================== RENDER ==================== */

	public static function render() {
		if ( ! current_user_can( self::CAP ) ) { wp_die( 'Neturite teisiu.' ); }

		$lt = Petshop_Ataskaitu_UI::laikotarpis();
		$tipas   = isset( $_GET['tipas'] ) ? sanitize_key( $_GET['tipas'] ) : '';
		$gyvunas = isset( $_GET['gyvunas'] ) ? sanitize_key( $_GET['gyvunas'] ) : '';
		$rid_sel = isset( $_GET['rinkinys'] ) ? (int) $_GET['rinkinys'] : 0;

		$visi = self::rinkiniai();
		$rinkiniai = array();
		foreach ( $visi as $id => $r ) {
			if ( $tipas && $r['tipas'] !== $tipas ) { continue; }
			if ( $gyvunas && self::gyvunas( $id ) !== $gyvunas ) { continue; }
			$rinkiniai[ $id ] = $r;
		}

		$eil   = self::duomenys( $lt['nuo'], $lt['iki'] );
		$pries = $lt['lyginam'] ? self::duomenys( $lt['pries_nuo'], $lt['pries_iki'] ) : array();
		$m     = self::metrikos( $eil, $rinkiniai );
		$mp    = $pries ? self::metrikos( $pries, $rinkiniai ) : array();

		Petshop_Ataskaitu_UI::antraste(
			'Rinkiniai',
			'Paruošti rinkiniai (MnM) ir DP pakai: kiek uždirba, ar prideda pardavimų, ar tik perkelia juos su mažesne marža.'
		);

		Petshop_Ataskaitu_UI::juosta( self::SLUG, $lt, array(
			array( 'vardas' => 'tipas', 'uzrasas' => 'Tipas', 'parinktys' => array( '' => '— visi —', 'mnm' => 'MnM rinkiniai', 'dp' => 'DP pakai' ), 'reiksme' => $tipas ),
			array( 'vardas' => 'gyvunas', 'uzrasas' => 'Gyvūnas', 'parinktys' => array( '' => '— visi —', 'sunims' => 'Šunims', 'katems' => 'Katėms', 'kita' => 'Kita' ), 'reiksme' => $gyvunas ),
		) );

		if ( ! $visi ) {
			echo '<div class="psru-blokas"><b>Paruoštų rinkinių ir DP pakų dar nėra.</b><p class="psru-pastaba" style="margin-top:6px">Ekranas pradės pildytis, kai atsiras bent vienas paruoštas MnM rinkinys arba „Daugiau=pigiau" pakas. Surenkamos dėžės rodomos atskirame lange „Surenkami rinkiniai".</p></div>';
			Petshop_Ataskaitu_UI::pabaiga();
			return;
		}

		$p  = self::pinigai( $m, $eil );
		$pp = $mp ? self::pinigai( $mp, $pries ) : null;

		self::sekcija_kpi( $p, $pp, $eil, $pries );
		self::sekcija_tendencija( $eil, $pries, $rinkiniai );
		$verdiktai = self::verdiktai( $eil, $pries, $rinkiniai, $m );
		self::sekcija_veiksmai( $verdiktai, $rinkiniai );
		self::sekcija_lentele( $m, $rinkiniai, $verdiktai, $eil );
		if ( $rid_sel && isset( $rinkiniai[ $rid_sel ] ) ) { self::sekcija_kanibalizacija( $eil, $pries, $rinkiniai[ $rid_sel ] ); }
		self::sekcija_pakopos( $m, $rinkiniai );
		self::sekcija_nuolaidos( $m, $rinkiniai, $verdiktai, $eil );

		Petshop_Ataskaitu_UI::pabaiga();
	}

	private static function pinigai( $m, $eil ) {
		$paj = 0; $sav = 0; $vaiku_suma = 0; $be_sav_ct = 0; $be_sav = 0; $parduota = 0; $mnm = 0; $dp = 0;
		$rink = self::rinkiniai();
		foreach ( $m as $rid => $x ) {
			$paj      += $x['suma_ct'];
			$sav      += $x['sav_ct'];
			$be_sav   += $x['be_sav'];
			$be_sav_ct += $x['be_sav_ct'];
			$parduota += $x['parduota'];
			if ( isset( $rink[ $rid ] ) && $rink[ $rid ]['tipas'] === 'dp' ) { $dp += $x['parduota']; } else { $mnm += $x['parduota']; }
		}
		$su_sav = max( 0, $paj - $be_sav_ct );
		$be_pvm = Petshop_Ataskaitu_UI::be_pvm( $su_sav );
		$pelnas = (int) round( $be_pvm ) - $sav;

		$parduotuve = 0;
		foreach ( $eil as $e ) {
			if ( $e['sritis'] === 'parduotuve' && $e['tipas'] === 'pajamos' ) { $parduotuve += (int) $e['suma_ct']; }
		}

		return array(
			'pajamos_ct' => $paj, 'pelnas_ct' => $pelnas,
			'marza' => $be_pvm > 0 ? ( $pelnas / $be_pvm ) * 100 : 0,
			'parduota' => $parduota, 'mnm' => $mnm, 'dp' => $dp, 'be_sav' => $be_sav,
			'dalis' => $parduotuve > 0 ? ( $paj / $parduotuve ) * 100 : 0,
		);
	}

	private static function sekcija_kpi( $p, $pp, $eil, $pries ) {
		echo '<div class="psru-kpi">';
		Petshop_Ataskaitu_UI::kpi( 'Pajamos su PVM', Petshop_Ataskaitu_UI::eur( $p['pajamos_ct'] ),
			$pp ? array( 'dabar' => $p['pajamos_ct'], 'buvo' => $pp['pajamos_ct'] ) : null,
			$pp ? 'buvo ' . Petshop_Ataskaitu_UI::eur( $pp['pajamos_ct'] ) : '',
			'Visų rinkinių ir DP pakų suma su PVM. Grąžinimai atimti grąžinimo dieną.' );
		Petshop_Ataskaitu_UI::kpi( 'Pelnas', Petshop_Ataskaitu_UI::eur( $p['pelnas_ct'] ),
			$pp ? array( 'dabar' => $p['pelnas_ct'], 'buvo' => $pp['pelnas_ct'] ) : null,
			$pp ? 'buvo ' . Petshop_Ataskaitu_UI::eur( $pp['pelnas_ct'] ) : '',
			'Pajamos be PVM minus komponentų savikaina iš užsakymo eilučių pardavimo momentu.' );
		Petshop_Ataskaitu_UI::kpi( 'Marža', Petshop_Ataskaitu_UI::proc( $p['marza'] ),
			$pp ? array( 'dabar' => $p['marza'], 'buvo' => $pp['marza'], 'pp' => true ) : null,
			$pp ? 'buvo ' . Petshop_Ataskaitu_UI::proc( $pp['marza'] ) : '' );
		Petshop_Ataskaitu_UI::kpi( 'Parduota rinkinių', number_format( $p['parduota'], 0, ',', ' ' ),
			$pp ? array( 'dabar' => $p['parduota'], 'buvo' => $pp['parduota'] ) : null,
			'MnM ' . (int) $p['mnm'] . ' · DP ' . (int) $p['dp'] );
		Petshop_Ataskaitu_UI::kpi( 'Dalis parduotuvės apyvartoje', Petshop_Ataskaitu_UI::proc( $p['dalis'] ),
			$pp ? array( 'dabar' => $p['dalis'], 'buvo' => $pp['dalis'], 'pp' => true ) : null,
			$pp ? 'buvo ' . Petshop_Ataskaitu_UI::proc( $pp['dalis'] ) : '',
			'Rinkinių pajamos ÷ visos parduotuvės pajamos. Rodo, ar rinkinių strategija auga greičiau už parduotuvę.' );
		echo '</div>';

		if ( $p['be_sav'] > 0 ) {
			Petshop_Ataskaitu_UI::spejimas( '<b>' . (int) $p['be_sav'] . '</b> eilutės be savikainos į maržą neįskaičiuotos — tikras pelnas MAŽESNIS nei rodomas.' );
		}
	}

	private static function sekcija_tendencija( $eil, $pries, $rinkiniai ) {
		$dienos = function( $e ) use ( $rinkiniai ) {
			$paj = array(); $pel = array();
			foreach ( $e as $x ) {
				if ( $x['sritis'] !== 'pardavimai' || $x['tipas'] !== 'parduota' ) { continue; }
				if ( ! isset( $rinkiniai[ (int) $x['deze_id'] ] ) ) { continue; }
				$d = $x['diena'];
				if ( ! isset( $paj[ $d ] ) ) { $paj[ $d ] = 0; $pel[ $d ] = 0; }
				if ( (int) $x['preke_id'] === 0 ) { $paj[ $d ] += (int) $x['suma_ct']; }
				else { $pel[ $d ] += (int) round( Petshop_Ataskaitu_UI::be_pvm( (int) $x['suma_ct'] ) ) - (int) $x['sav_ct']; }
			}
			ksort( $paj ); ksort( $pel );
			return array( array_values( $paj ), array_values( $pel ) );
		};
		list( $paj, $pel ) = $dienos( $eil );
		if ( count( $paj ) < 2 ) {
			echo '<p class="psru-pastaba">Tendencijos diagramai reikia bent dviejų dienų su pardavimais.</p>';
			return;
		}
		list( $paj_p ) = $pries ? $dienos( $pries ) : array( array() );
		Petshop_Ataskaitu_UI::diagrama( $paj, $pel, $paj_p );
	}

	/* ---------- KANIBALIZACIJOS VARIKLIS ---------- */

	/**
	 * Kiekvienam rinkiniui: komponentu vienetai RINKINYJE + ATSKIRAI, palyginti
	 * su ankstesniu laikotarpiu. Jei bendri vienetai neauga, o marza rinkinyje
	 * gerokai mazesne — rinkinys ne prideda pardavimu, o perkelia juos.
	 */
	private static function verdiktai( $eil, $pries, $rinkiniai, $m ) {
		$atsk  = self::atskirai( $eil );
		$atsk_p = $pries ? self::atskirai( $pries ) : array();
		$r_prideda  = Petshop_Ataskaitu_UI::nustatymas( 'ps_rib_prideda', 10 );
		$r_perkelia = Petshop_Ataskaitu_UI::nustatymas( 'ps_rib_perkelia', 2 );
		$r_marzu    = Petshop_Ataskaitu_UI::nustatymas( 'ps_rib_marzu_skirtumas', 5 );
		$r_imtis    = Petshop_Ataskaitu_UI::nustatymas( 'ps_rib_min_imtis_rink', 5 );

		$out = array();
		foreach ( $rinkiniai as $rid => $r ) {
			$rink   = self::rinkinyje( $eil, $rid );
			$rink_p = $pries ? self::rinkinyje( $pries, $rid ) : array();

			$vnt_r = 0; $suma_r = 0; $sav_r = 0;
			foreach ( $rink as $x ) { $vnt_r += $x['vnt']; $suma_r += $x['suma_ct']; $sav_r += $x['sav_ct']; }
			$vnt_a = 0; $suma_a = 0; $sav_a = 0;
			foreach ( $r['komp'] as $pid ) {
				if ( isset( $atsk[ $pid ] ) ) { $vnt_a += $atsk[ $pid ]['vnt']; $suma_a += $atsk[ $pid ]['suma_ct']; $sav_a += $atsk[ $pid ]['sav_ct']; }
			}
			$vnt_rp = 0; foreach ( $rink_p as $x ) { $vnt_rp += $x['vnt']; }
			$vnt_ap = 0;
			foreach ( $r['komp'] as $pid ) { if ( isset( $atsk_p[ $pid ] ) ) { $vnt_ap += $atsk_p[ $pid ]['vnt']; } }

			$bendras   = $vnt_r + $vnt_a;
			$bendras_p = $vnt_rp + $vnt_ap;
			$pokytis   = $bendras_p > 0 ? ( ( $bendras / $bendras_p ) - 1 ) * 100 : null;

			$be_pvm_r = Petshop_Ataskaitu_UI::be_pvm( $suma_r );
			$be_pvm_a = Petshop_Ataskaitu_UI::be_pvm( $suma_a );
			$marza_r = $be_pvm_r > 0 ? ( ( $be_pvm_r - $sav_r ) / $be_pvm_r ) * 100 : null;
			$marza_a = $be_pvm_a > 0 ? ( ( $be_pvm_a - $sav_a ) / $be_pvm_a ) * 100 : null;

			$parduota = isset( $m[ $rid ] ) ? $m[ $rid ]['parduota'] : 0;
			$verd = '';
			if ( $parduota < $r_imtis || $pokytis === null || $bendras_p < 10 ) {
				$verd = 'neaisku';
			} elseif ( $pokytis > $r_prideda ) {
				$verd = 'prideda';
			} elseif ( $pokytis <= $r_perkelia && $marza_r !== null && $marza_a !== null && ( $marza_a - $marza_r ) > $r_marzu ) {
				$verd = 'perkelia';
			}

			$out[ $rid ] = array(
				'verdiktas' => $verd, 'pokytis' => $pokytis,
				'vnt_rinkinyje' => $vnt_r, 'vnt_atskirai' => $vnt_a,
				'vnt_rinkinyje_p' => $vnt_rp, 'vnt_atskirai_p' => $vnt_ap,
				'marza_rinkinyje' => $marza_r, 'marza_atskirai' => $marza_a,
				'suma_rinkinyje' => $suma_r, 'suma_atskirai' => $suma_a,
			);
		}
		return $out;
	}

	private static function sekcija_veiksmai( $verdiktai, $rinkiniai ) {
		$blogi = array(); $geri = array();
		foreach ( $verdiktai as $rid => $v ) {
			if ( ! isset( $rinkiniai[ $rid ] ) || $v['verdiktas'] === '' || $v['verdiktas'] === 'neaisku' ) { continue; }
			$pav = '<a href="' . esc_url( Petshop_Ataskaitu_UI::nuoroda( self::SLUG, array( 'rinkinys' => $rid ) ) ) . '">' . esc_html( $rinkiniai[ $rid ]['pav'] ) . '</a>';
			$kodel = 'bendri vnt. ' . ( $v['pokytis'] >= 0 ? '+' : '' ) . round( $v['pokytis'] ) . ' %'
				. ( $v['marza_rinkinyje'] !== null ? ' · marža rinkinyje ' . round( $v['marza_rinkinyje'] ) . ' %' : '' )
				. ( $v['marza_atskirai'] !== null ? ' vs ' . round( $v['marza_atskirai'] ) . ' % atskirai' : '' );
			if ( $v['verdiktas'] === 'perkelia' ) { $blogi[] = array( 'pav' => $pav, 'kodel' => $kodel ); }
			else { $geri[] = array( 'pav' => $pav, 'kodel' => $kodel ); }
		}

		echo '<h2>Ką daryti</h2><div class="psru-veiksmai">';
		Petshop_Ataskaitu_UI::veiksmai( 'bad', 'Įtariama kanibalizacija — peržiūrėti', array_slice( $blogi, 0, 5 ), 'Įtarimų nėra.' );
		Petshop_Ataskaitu_UI::veiksmai( 'ok', 'Veikia — prideda pardavimų', array_slice( $geri, 0, 5 ), 'Dar per maža imtis išvadoms.' );
		echo '</div>';
		echo '<p class="psru-pastaba">Taisyklės: „kanibalizuoja" — bendri komponentų vienetai (rinkinys + atskirai) neaugo, o maržos skirtumas &gt; ' . esc_html( Petshop_Ataskaitu_UI::nustatymas( 'ps_rib_marzu_skirtumas', 5 ) ) . ' p.p. rinkinio nenaudai. „Veikia" — bendri vienetai augo &gt; ' . esc_html( Petshop_Ataskaitu_UI::nustatymas( 'ps_rib_prideda', 10 ) ) . ' %. Verdiktas — heuristika iš palyginimo su ankstesniu laikotarpiu, <b>ne A/B įrodymas</b>, todėl „peržiūrėti", o ne „naikinti".</p>';
	}

	/* ---------- LENTELE ---------- */

	private static function nuolaida( $eil, $rid ) {
		/* „Sutaupote": komponentu kaina atskirai minus faktine — is uzsakymo
		   eiluciu snapshot'o. Suvestineje kainos atskirai nera, todel imam
		   dabartine katalogo kaina tik kaip atsargini varianta. */
		$rink = self::rinkinyje( $eil, $rid );
		$atsk_kaina = 0; $fakt = 0;
		foreach ( $rink as $pid => $x ) {
			$k = Petshop_Statistika::kaina_atskirai( $pid );
			if ( $k === null ) { continue; }
			$atsk_kaina += (int) round( $k * 100 ) * $x['vnt'];
			$fakt += $x['suma_ct'];
		}
		if ( $atsk_kaina <= 0 ) { return array( null, null ); }
		$nuol = $atsk_kaina - $fakt;
		return array( $nuol, ( $nuol / $atsk_kaina ) * 100 );
	}

	private static function sekcija_lentele( $m, $rinkiniai, $verdiktai, $eil ) {
		$eilutes = array();
		foreach ( $rinkiniai as $rid => $r ) {
			$x = isset( $m[ $rid ] ) ? $m[ $rid ] : null;
			if ( ! $x || ! $x['parduota'] ) { continue; }
			$v = isset( $verdiktai[ $rid ] ) ? $verdiktai[ $rid ] : array( 'verdiktas' => '', 'pokytis' => null );

			$su_sav = max( 0, $x['suma_ct'] - $x['be_sav_ct'] );
			$be_pvm = Petshop_Ataskaitu_UI::be_pvm( $su_sav );
			$pelnas = (int) round( $be_pvm ) - $x['sav_ct'];
			$marza  = $be_pvm > 0 ? ( $pelnas / $be_pvm ) * 100 : null;
			list( $nuol_ct, $nuol_p ) = self::nuolaida( $eil, $rid );

			$zyme = $r['tipas'] === 'dp' ? '<span class="psru-zyme dp">DP</span>' : '<span class="psru-zyme mnm">MnM</span>';
			$sub  = $r['tipas'] === 'dp'
				? 'bazinė #' . (int) ( isset( $r['baze'] ) ? $r['baze'] : 0 ) . ' × ' . (int) ( isset( $r['qty'] ) ? $r['qty'] : 0 )
				: count( $r['komp'] ) . ' komponentai';
			$verd = $v['verdiktas'] === 'prideda' ? '<span class="psru-verd prideda">PRIDEDA</span>'
				: ( $v['verdiktas'] === 'perkelia' ? '<span class="psru-verd perkelia">PERKELIA</span>'
				: '<span class="psru-verd neaisku">PER MAŽAI</span>' );

			$eilutes[] = array(
				'<a href="' . esc_url( Petshop_Ataskaitu_UI::nuoroda( self::SLUG, array( 'rinkinys' => $rid ) ) ) . '">' . esc_html( $r['pav'] ) . '</a>' . $zyme
					. '<div class="sub">' . esc_html( $sub ) . ' · <a href="' . esc_url( get_edit_post_link( $rid ) ) . '" style="font-weight:400">kortelė →</a></div>',
				'<b>' . number_format( $x['parduota'], 0, ',', ' ' ) . '</b>',
				Petshop_Ataskaitu_UI::eur( $x['suma_ct'] ),
				Petshop_Ataskaitu_UI::eur( $x['sav_ct'] ),
				Petshop_Ataskaitu_UI::eur( $pelnas ),
				$marza === null ? '—' : '<span class="' . ( $marza >= 25 ? 'ok' : ( $marza < 20 ? 'bad' : '' ) ) . '">' . Petshop_Ataskaitu_UI::proc( $marza ) . '</span>',
				$nuol_ct === null ? '—' : Petshop_Ataskaitu_UI::eur( $nuol_ct ) . ' <span class="sub">(' . Petshop_Ataskaitu_UI::proc( $nuol_p ) . ')</span>',
				$v['pokytis'] === null ? '—' : Petshop_Ataskaitu_UI::maza_imtis( ( $v['pokytis'] >= 0 ? '+' : '' ) . round( $v['pokytis'] ) . ' %', $x['parduota'], Petshop_Ataskaitu_UI::nustatymas( 'ps_rib_min_imtis_rink', 5 ) ),
				$verd,
			);
		}

		echo '<h2>Rinkiniai ir pakai</h2>';
		Petshop_Ataskaitu_UI::lentele( 'psru-rinkiniai', array(
			array( 'pav' => 'Rinkinys', 'kaire' => true ),
			array( 'pav' => 'Parduota' ),
			array( 'pav' => 'Pajamos' ),
			array( 'pav' => 'Savikaina' ),
			array( 'pav' => 'Pelnas' ),
			array( 'pav' => 'Marža' ),
			array( 'pav' => 'Nuolaida klientui', 'tt' => '„Sutaupote" suma: komponentų kainų suma atskirai minus rinkinio kaina. Tai marža, kurią atidavei už apjungimą.' ),
			array( 'pav' => 'Nuolaidos grąža', 'tt' => 'Bendrų komponentų vienetų pokytis (rinkinys + atskirai) prieš ankstesnį laikotarpį. Atsako: ar atiduota nuolaida atnešė augimą.' ),
			array( 'pav' => 'Verdiktas' ),
		), $eilutes, array( 'rikiuoti' => 1, 'failas' => 'rinkiniai.csv' ) );
		echo '<p class="psru-pastaba">Rinkinio pavadinimas atidaro kanibalizacijos analizę. MnM / DP žymės — abu modeliai vienoje lentelėje, filtruojasi atskirai.</p>';
	}

	/* ---------- KANIBALIZACIJOS DRILL-DOWN ---------- */

	private static function sekcija_kanibalizacija( $eil, $pries, $r ) {
		$rid = $r['id'];
		$rink   = self::rinkinyje( $eil, $rid );
		$rink_p = $pries ? self::rinkinyje( $pries, $rid ) : array();
		$atsk   = self::atskirai( $eil );
		$atsk_p = $pries ? self::atskirai( $pries ) : array();

		$vnt_r = 0; $suma_r = 0; $sav_r = 0; foreach ( $rink as $x ) { $vnt_r += $x['vnt']; $suma_r += $x['suma_ct']; $sav_r += $x['sav_ct']; }
		$vnt_rp = 0; foreach ( $rink_p as $x ) { $vnt_rp += $x['vnt']; }
		$vnt_a = 0; $suma_a = 0; $sav_a = 0; $vnt_ap = 0;
		foreach ( $r['komp'] as $pid ) {
			if ( isset( $atsk[ $pid ] ) ) { $vnt_a += $atsk[ $pid ]['vnt']; $suma_a += $atsk[ $pid ]['suma_ct']; $sav_a += $atsk[ $pid ]['sav_ct']; }
			if ( isset( $atsk_p[ $pid ] ) ) { $vnt_ap += $atsk_p[ $pid ]['vnt']; }
		}

		$marza = function( $suma, $sav ) {
			$b = Petshop_Ataskaitu_UI::be_pvm( $suma );
			return $b > 0 ? Petshop_Ataskaitu_UI::proc( ( ( $b - $sav ) / $b ) * 100 ) : '—';
		};
		$pok = function( $dabar, $buvo ) {
			$d = $dabar - $buvo;
			return '<span class="' . ( $d >= 0 ? 'ok' : 'bad' ) . '">' . ( $d >= 0 ? '+' : '' ) . (int) $d . '</span>';
		};
		$bendras = $vnt_r + $vnt_a; $bendras_p = $vnt_rp + $vnt_ap;
		$proc_b = $bendras_p > 0 ? ( ( $bendras / $bendras_p ) - 1 ) * 100 : null;

		echo '<h2>Kanibalizacijos analizė</h2><div class="psru-blokas bad">';
		echo '<div class="psru-galva" style="align-items:baseline;flex-wrap:wrap"><b style="font-size:15px">' . esc_html( $r['pav'] ) . '</b>';
		echo '<span class="psru-pastaba" style="margin:0">' . ( $r['tipas'] === 'dp' ? 'DP pakas' : count( $r['komp'] ) . ' komponentai' )
			. ' · <a href="' . esc_url( Petshop_Ataskaitu_UI::nuoroda( self::SLUG, array( 'rinkinys' => '' ) ) ) . '">užverti</a></span></div>';

		Petshop_Ataskaitu_UI::lentele( 'psru-kanib', array(
			array( 'pav' => '', 'kaire' => true ),
			array( 'pav' => 'Vnt. laikotarpiu' ), array( 'pav' => 'Ankstesnis' ), array( 'pav' => 'Pokytis' ),
			array( 'pav' => 'Pajamos' ), array( 'pav' => 'Marža' ),
		), array(
			array( 'Komponentai <b>rinkinyje</b>', number_format( $vnt_r, 0, ',', ' ' ), number_format( $vnt_rp, 0, ',', ' ' ), $pok( $vnt_r, $vnt_rp ), Petshop_Ataskaitu_UI::eur( $suma_r ), $marza( $suma_r, $sav_r ) ),
			array( 'Komponentai <b>atskirai</b> kataloge', number_format( $vnt_a, 0, ',', ' ' ), number_format( $vnt_ap, 0, ',', ' ' ), $pok( $vnt_a, $vnt_ap ), Petshop_Ataskaitu_UI::eur( $suma_a ), $marza( $suma_a, $sav_a ) ),
			array( '<b>Iš viso</b>', '<b>' . number_format( $bendras, 0, ',', ' ' ) . '</b>', '<b>' . number_format( $bendras_p, 0, ',', ' ' ) . '</b>',
				$proc_b === null ? '—' : '<b class="' . ( $proc_b >= 0 ? 'ok' : 'bad' ) . '">' . ( $proc_b >= 0 ? '+' : '' ) . round( $proc_b ) . ' %</b>',
				Petshop_Ataskaitu_UI::eur( $suma_r + $suma_a ), $marza( $suma_r + $suma_a, $sav_r + $sav_a ) ),
		), array( 'paieska' => false, 'csv' => false, 'rikiuoti' => 0 ) );

		echo '<p class="psru-pastaba" style="margin-bottom:0">Skaitosi taip: jei rinkinys pardavė daug, bet atskiri pardavimai krito panašiai — tie patys pirkėjai tiesiog perėjo į pigesnį formatą, o svertinė marža krito. Tada veiksmas: mažinti nuolaidą arba didinti rinkinio dydį, kad formatas taikytų į didesnį poreikį, ne į tą patį pirkėją. Jei atskiri pardavimai nekrenta — rinkinys prideda naujų pirkimų.</p></div>';
	}

	/* ---------- DP PAKOPOS ---------- */

	private static function sekcija_pakopos( $m, $rinkiniai ) {
		$turi = false;
		foreach ( $m as $rid => $x ) {
			if ( isset( $rinkiniai[ $rid ] ) && $rinkiniai[ $rid ]['tipas'] === 'dp' && $x['pakopos'] ) { $turi = true; break; }
		}
		if ( ! $turi ) { return; }

		echo '<h2>DP pakopos — kurią realiai perka' . Petshop_Ataskaitu_UI::tt( 'Pirkimų pasiskirstymas pagal pakopą. Jei visi ima žemiausią — aukštesnės pakopos neatlieka darbo, o jų nuolaida dovanojama veltui.' ) . '</h2>';
		foreach ( $m as $rid => $x ) {
			if ( ! isset( $rinkiniai[ $rid ] ) || $rinkiniai[ $rid ]['tipas'] !== 'dp' || ! $x['pakopos'] ) { continue; }
			$viso = 0;
			foreach ( $x['pakopos'] as $p ) { $viso += $p['kiekis']; }
			if ( ! $viso ) { continue; }
			ksort( $x['pakopos'] );

			echo '<div class="psru-blokas" style="margin-bottom:10px">';
			echo '<div style="font-weight:600;margin-bottom:6px">' . esc_html( $rinkiniai[ $rid ]['pav'] ) . '</div>';
			foreach ( $x['pakopos'] as $pak => $p ) {
				$b = Petshop_Ataskaitu_UI::be_pvm( $p['suma_ct'] );
				$mz = $b > 0 ? Petshop_Ataskaitu_UI::proc( ( ( $b - $p['sav_ct'] ) / $b ) * 100 ) : '—';
				$dalis = round( ( $p['kiekis'] / $viso ) * 100 );
				echo '<div class="psru-eilute"><span class="pav">' . esc_html( strtoupper( $pak ) ) . '</span>'
					. '<span class="juosta"><b style="width:' . (int) $dalis . '%"></b></span>'
					. '<span class="sk">' . (int) $p['kiekis'] . ' vnt. · ' . $dalis . ' % · marža ' . esc_html( $mz ) . '</span></div>';
			}
			echo '</div>';
		}
		echo '<p class="psru-pastaba">Jei aukščiausia pakopa perkama vos kelis kartus — nuolaidos gylis neatlieka darbo. Verta bandyti ją keisti į mažesnę pakopą su dovana: kaštas mažesnis, o suvokiama vertė didesnė.</p>';
	}

	/* ---------- NUOLAIDOS EFEKTYVUMAS ---------- */

	private static function sekcija_nuolaidos( $m, $rinkiniai, $verdiktai, $eil ) {
		$grupes = array(
			'iki5'  => array( 'pav' => 'iki 5 %', 'min' => 0, 'max' => 5 ),
			'5-10'  => array( 'pav' => '5–10 %', 'min' => 5, 'max' => 10 ),
			'10-15' => array( 'pav' => '10–15 %', 'min' => 10, 'max' => 15 ),
			'15+'   => array( 'pav' => '15 % ir daugiau', 'min' => 15, 'max' => 1000 ),
		);
		$sum = array();
		foreach ( $grupes as $k => $g ) { $sum[ $k ] = array( 'rink' => 0, 'parduota' => 0, 'marza' => array(), 'graza' => array() ); }

		foreach ( $m as $rid => $x ) {
			if ( ! isset( $rinkiniai[ $rid ] ) || ! $x['parduota'] ) { continue; }
			list( $nuol_ct, $nuol_p ) = self::nuolaida( $eil, $rid );
			if ( $nuol_p === null ) { continue; }
			foreach ( $grupes as $k => $g ) {
				if ( $nuol_p >= $g['min'] && $nuol_p < $g['max'] ) {
					$su_sav = max( 0, $x['suma_ct'] - $x['be_sav_ct'] );
					$b = Petshop_Ataskaitu_UI::be_pvm( $su_sav );
					$sum[ $k ]['rink']++;
					$sum[ $k ]['parduota'] += $x['parduota'];
					if ( $b > 0 ) { $sum[ $k ]['marza'][] = ( ( $b - $x['sav_ct'] ) / $b ) * 100; }
					if ( isset( $verdiktai[ $rid ] ) && $verdiktai[ $rid ]['pokytis'] !== null ) { $sum[ $k ]['graza'][] = $verdiktai[ $rid ]['pokytis']; }
					break;
				}
			}
		}

		$eilutes = array();
		foreach ( $grupes as $k => $g ) {
			if ( ! $sum[ $k ]['rink'] ) { continue; }
			$vid = function( $sar ) { return $sar ? array_sum( $sar ) / count( $sar ) : null; };
			$mz = $vid( $sum[ $k ]['marza'] );
			$gz = $vid( $sum[ $k ]['graza'] );
			$eilutes[] = array(
				esc_html( $g['pav'] ),
				(int) $sum[ $k ]['rink'],
				number_format( $sum[ $k ]['parduota'], 0, ',', ' ' ),
				number_format( $sum[ $k ]['parduota'] / max( 1, $sum[ $k ]['rink'] ), 1, ',', ' ' ),
				$mz === null ? '—' : '<span class="' . ( $mz >= 25 ? 'ok' : ( $mz < 20 ? 'bad' : '' ) ) . '">' . Petshop_Ataskaitu_UI::proc( $mz ) . '</span>',
				$gz === null ? '—' : ( ( $gz >= 0 ? '+' : '' ) . round( $gz ) . ' %' ),
			);
		}
		if ( ! $eilutes ) { return; }

		echo '<h2>Nuolaidos efektyvumas' . Petshop_Ataskaitu_UI::tt( 'Rinkiniai sugrupuoti pagal „Sutaupote" gylį. Atsako: koks nuolaidos dydis realiai judina pardavimą.' ) . '</h2>';
		Petshop_Ataskaitu_UI::lentele( 'psru-nuolaidos', array(
			array( 'pav' => 'Nuolaidos gylis', 'kaire' => true ),
			array( 'pav' => 'Rinkinių' ), array( 'pav' => 'Parduota' ), array( 'pav' => 'Vid. / rinkiniui' ),
			array( 'pav' => 'Vid. marža' ), array( 'pav' => 'Nuolaidos grąža' ),
		), $eilutes, array( 'paieska' => false, 'rikiuoti' => 0, 'failas' => 'nuolaidos.csv' ) );
		echo '<p class="psru-pastaba">Kai susikaups duomenų, ši lentelė parodys tavo tikslų tašką: kur nuolaida dar judina pirkimą, o kur jau dovanojama veltui.</p>';
	}
}

add_action( 'plugins_loaded', function() {
	if ( class_exists( 'Petshop_Ataskaitu_UI' ) ) { Petshop_Paruostu_Ataskaita::init(); }
}, 25 );
