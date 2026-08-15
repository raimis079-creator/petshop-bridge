<?php
/**
 * Plugin Name: Petshop Statistika — Rinkiniai (ataskaita)
 * Description: „Petshop ataskaitos" → „Surenkami rinkiniai": pinigai, prekiu lentele, piltuvelis.
 * Version: 1.1
 *
 * Kabinamas ant esamo konteinerio `petshop-reports` (class-admin-reports.php),
 * kad visos ataskaitos gyventu vienoje vietoje.
 *
 * Skaiciavimo taisykles (savininko sprendimai 2026-08-15):
 * - savikaina imama IS UZSAKYMO EILUTES (`_ps_savikaina_vnt`), fiksuota pardavimo
 *   momentu; perskaiciavus tiekejo savikaina praeities marza nesikeicia;
 * - eilutes be savikainos i marza NEIRASOMOS ir rodomos atskirai;
 * - marza skaiciuojama be PVM: kaina/1,21 − savikaina;
 * - dovana: pajamos 0, savikaina reali — mazina pelna;
 * - statistikos pradzia — nustatymas, ne konstanta.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Rinkiniu_Ataskaita {

	const CAP    = 'manage_woocommerce';
	const PARENT = 'petshop-reports';
	const SLUG   = 'petshop-reports-rinkiniai';

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
		update_option( 'ps_stat_pradzia', preg_match( '/^\d{4}-\d{2}-\d{2}$/', $d ) ? $d : '' , false );
		wp_safe_redirect( admin_url( 'admin.php?page=' . self::SLUG . '&issaugota=1' ) );
		exit;
	}

	/* ==================== DUOMENYS ==================== */

	private static function dezes() {
		$q = new WP_Query( array(
			'post_type' => 'product', 'post_status' => array( 'publish', 'draft' ),
			'posts_per_page' => 60, 'fields' => 'ids', 'orderby' => 'title', 'order' => 'ASC',
			'meta_query' => array( array( 'key' => '_ps_laukas', 'value' => 'yes' ) ),
		) );
		$r = array();
		foreach ( $q->posts as $id ) { $r[ (int) $id ] = get_the_title( $id ); }
		return $r;
	}

	/**
	 * Pardavimai is uzsakymu. Deze atpazistama pagal konteinerio eilute
	 * (MnM tevas) — vaikines eilutes turi `_mnm_container_id`.
	 */
	private static function pardavimai( $nuo, $iki, $deze_id = 0 ) {
		$args = array(
			'limit' => -1,
			'status' => array( 'processing', 'completed', 'on-hold' ),
			'type' => 'shop_order',
		);
		if ( $nuo ) { $args['date_created'] = '>=' . $nuo; }
		$uzs = wc_get_orders( $args );

		$out = array(
			'dezes' => array(), 'prekes' => array(),
			'uzsakymu' => 0, 'vnt' => 0, 'pajamos' => 0.0, 'savikaina' => 0.0,
			'be_sav' => 0, 'dovanu_sav' => 0.0, 'dovanu_vnt' => 0,
		);

		foreach ( $uzs as $ord ) {
			/* MnM sieja vaikus su konteineriu per krepselio MAISA, ne per eilutes ID:
			   konteineryje `_mnm_cart_key`, vaikuose `_mnm_container` su ta pacia
			   verte (patikrinta uzsakyme #34952). */
			$konteineriai = array();
			foreach ( $ord->get_items() as $it ) {
				$p = $it->get_product();
				if ( ! $p || $p->get_type() !== 'mix-and-match' ) { continue; }
				$raktas = (string) $it->get_meta( '_mnm_cart_key', true );
				if ( $raktas !== '' ) { $konteineriai[ $raktas ] = $it->get_product_id(); }
			}
			if ( ! $konteineriai ) { continue; }

			$sio_uzsakymo = false;
			foreach ( $ord->get_items() as $it ) {
				$tevas = (string) $it->get_meta( '_mnm_container', true );
				if ( $tevas === '' ) { continue; }
				$deze = isset( $konteineriai[ $tevas ] ) ? $konteineriai[ $tevas ] : 0;
				if ( ! $deze ) { continue; }
				if ( $deze_id && $deze !== $deze_id ) { continue; }
				$sio_uzsakymo = true;

				$pid   = $it->get_product_id();
				$kiek  = (int) $it->get_quantity();
				$suma  = (float) $it->get_total();
				$sav_v = $it->get_meta( '_ps_savikaina_vnt', true );
				$dov   = (bool) $it->get_meta( '_ps_dovana', true );
				$turi  = ( $sav_v !== '' && $sav_v !== null );
				$sav   = $turi ? (float) $sav_v * $kiek : 0.0;

				if ( ! isset( $out['dezes'][ $deze ] ) ) {
					$out['dezes'][ $deze ] = array( 'uzs' => array(), 'vnt' => 0, 'pajamos' => 0.0, 'sav' => 0.0, 'be_sav' => 0, 'dov_sav' => 0.0 );
				}
				$d =& $out['dezes'][ $deze ];
				$d['uzs'][ $ord->get_id() ] = 1;
				$d['vnt'] += $kiek;
				$d['pajamos'] += $suma;
				$d['sav'] += $sav;
				if ( ! $turi ) { $d['be_sav']++; }
				if ( $dov ) { $d['dov_sav'] += $sav; }

				if ( ! isset( $out['prekes'][ $pid ] ) ) {
					$out['prekes'][ $pid ] = array( 'vnt' => 0, 'pajamos' => 0.0, 'sav' => 0.0, 'be_sav' => 0, 'dov' => 0, 'dezes' => array() );
				}
				$pr =& $out['prekes'][ $pid ];
				$pr['vnt'] += $kiek;
				$pr['pajamos'] += $suma;
				$pr['sav'] += $sav;
				if ( ! $turi ) { $pr['be_sav']++; }
				if ( $dov ) { $pr['dov'] += $kiek; }
				$pr['dezes'][ $deze ] = 1;

				$out['vnt'] += $kiek;
				$out['pajamos'] += $suma;
				$out['savikaina'] += $sav;
				if ( ! $turi ) { $out['be_sav']++; }
				if ( $dov ) { $out['dovanu_sav'] += $sav; $out['dovanu_vnt'] += $kiek; }
				unset( $d, $pr );
			}
			if ( $sio_uzsakymo ) { $out['uzsakymu']++; }
		}
		return $out;
	}

	/** Elgsena is savo lenteles (kol rasymas neijungtas — nuliai). */
	private static function elgsena( $nuo, $deze_id = 0 ) {
		global $wpdb;
		if ( ! class_exists( 'Petshop_Statistika' ) ) { return array(); }
		$t = Petshop_Statistika::lentele();
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) !== $t ) { return array(); }

		$kur = array( "aplinka = %s" );
		$par = array( Petshop_Statistika::aplinka() );
		if ( $nuo ) { $kur[] = 'laikas >= %s'; $par[] = $nuo . ' 00:00:00'; }
		if ( $deze_id ) { $kur[] = 'deze_id = %d'; $par[] = $deze_id; }
		$w = 'WHERE ' . implode( ' AND ', $kur );

		$r = array();
		$r['pagal_tipa'] = $wpdb->get_results( $wpdb->prepare(
			"SELECT tipas, COUNT(*) k, COUNT(DISTINCT sesija) s FROM $t $w GROUP BY tipas", $par ), ARRAY_A );
		$r['prekes'] = $wpdb->get_results( $wpdb->prepare(
			"SELECT preke_id, SUM(tipas='rode') rode, SUM(tipas='idejo') idejo, SUM(tipas='iseme') iseme
			 FROM $t $w AND preke_id > 0 GROUP BY preke_id", $par ), ARRAY_A );
		return $r;
	}

	/* ==================== EKRANAS ==================== */

	public static function render() {
		if ( ! current_user_can( self::CAP ) ) { wp_die( 'Neturite teisiu.' ); }
		$pradzia = class_exists( 'Petshop_Statistika' ) ? Petshop_Statistika::pradzia() : '';
		$deze_id = isset( $_GET['deze'] ) ? (int) $_GET['deze'] : 0;
		$dezes   = self::dezes();
		$p       = self::pardavimai( $pradzia, '', $deze_id );
		$e       = self::elgsena( $pradzia, $deze_id );

		self::css();
		echo '<div class="wrap psra">';
		echo '<h1>Surenkami rinkiniai</h1>';
		echo '<p class="description">Ką klientai renkasi ir kiek iš to uždirbame. '
			. 'Savikaina imama iš užsakymo eilutės — tokia, kokia buvo <b>pardavimo dieną</b>.</p>';

		/* --- pradzia + dezes filtras --- */
		echo '<div class="psra-juosta">';
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="psra-f">';
		wp_nonce_field( 'ps_stat_pradzia' );
		echo '<input type="hidden" name="action" value="ps_stat_pradzia">';
		echo '<label>Statistikos pradžia</label> ';
		echo '<input type="date" name="pradzia" value="' . esc_attr( $pradzia ) . '"> ';
		echo '<button class="button">Išsaugoti</button>';
		echo $pradzia ? '' : ' <span class="psra-mut">nenustatyta — rodomi visi duomenys</span>';
		echo '</form>';
		echo '<form method="get" class="psra-f"><input type="hidden" name="page" value="' . esc_attr( self::SLUG ) . '">';
		echo '<label>Rinkinys</label> <select name="deze" onchange="this.form.submit()">';
		echo '<option value="0">— visi —</option>';
		foreach ( $dezes as $id => $pav ) {
			echo '<option value="' . (int) $id . '"' . selected( $deze_id, $id, false ) . '>' . esc_html( $pav ) . '</option>';
		}
		echo '</select></form>';
		echo '</div>';

		/* --- 1) PINIGAI --- */
		$be_pvm  = $p['pajamos'] / 1.21;
		$pelnas  = $be_pvm - $p['savikaina'];
		$marza   = $be_pvm > 0 ? ( $pelnas / $be_pvm * 100 ) : 0;
		$vid     = $p['uzsakymu'] > 0 ? $p['pajamos'] / $p['uzsakymu'] : 0;
		$vid_vnt = $p['uzsakymu'] > 0 ? $p['vnt'] / $p['uzsakymu'] : 0;

		echo '<h2>Pinigai</h2>';
		echo '<div class="psra-kort">';
		self::kort( 'Užsakymai', array(
			array( 'Užsakymų su dėže', number_format_i18n( $p['uzsakymu'] ) ),
			array( 'Vidutinis čekis', wc_price( $vid ) ),
			array( 'Vidutinis dydis', number_format_i18n( $vid_vnt, 1 ) . ' vnt.' ),
		) );
		self::kort( 'Apyvarta', array(
			array( 'Pajamos su PVM', wc_price( $p['pajamos'] ) ),
			array( 'Pajamos be PVM', wc_price( $be_pvm ) ),
			array( 'Savikaina', wc_price( $p['savikaina'] ) ),
		) );
		self::kort( 'Uždarbis', array(
			array( '<b>Pelnas</b>', '<b>' . wc_price( $pelnas ) . '</b>' ),
			array( 'Marža', number_format_i18n( $marza, 1 ) . ' %' ),
			array( 'Dovanų kaštai', wc_price( $p['dovanu_sav'] ) . ' <span class="psra-mut">(' . (int) $p['dovanu_vnt'] . ' vnt.)</span>' ),
		) );
		echo '</div>';

		if ( $p['be_sav'] > 0 ) {
			echo '<div class="psra-spejimas"><b>' . (int) $p['be_sav'] . '</b> eilutės be savikainos — '
				. 'jos į maržą neįskaičiuotos. Kol savikaina neįvesta, tikras pelnas yra MAŽESNIS nei rodomas.</div>';
		}

		/* --- 2) PREKES --- */
		echo '<h2>Prekės dėžėse</h2>';
		if ( ! $p['prekes'] ) {
			echo '<div class="psra-tuscia">Pardavimų su dėžėmis dar nėra.</div>';
		} else {
			$elg = array();
			foreach ( ( $e['prekes'] ?? array() ) as $x ) { $elg[ (int) $x['preke_id'] ] = $x; }
			uasort( $p['prekes'], function( $a, $b ) { return $b['vnt'] <=> $a['vnt']; } );
			echo '<table class="wp-list-table widefat striped psra-lent"><thead><tr>'
				. '<th style="width:34%">Prekė</th><th>Rodyta</th><th>Įdėta</th><th>Išimta</th>'
				. '<th>Parduota</th><th>Pajamos</th><th>Savikaina</th><th>Pelnas</th><th>Marža</th></tr></thead><tbody>';
			foreach ( $p['prekes'] as $pid => $x ) {
				$pav = get_the_title( $pid );
				$pbe = $x['pajamos'] / 1.21;
				$pel = $pbe - $x['sav'];
				$mrz = $pbe > 0 ? ( $pel / $pbe * 100 ) : null;
				$el  = $elg[ $pid ] ?? array();
				echo '<tr>';
				echo '<td><a href="' . esc_url( get_edit_post_link( $pid ) ) . '">' . esc_html( $pav ) . '</a>'
					. '<div class="psra-mut">#' . (int) $pid . ( $x['dov'] ? ' · dovana ' . (int) $x['dov'] . ' vnt.' : '' ) . '</div></td>';
				echo '<td>' . ( isset( $el['rode'] ) ? (int) $el['rode'] : '<span class="psra-mut">—</span>' ) . '</td>';
				echo '<td>' . ( isset( $el['idejo'] ) ? (int) $el['idejo'] : '<span class="psra-mut">—</span>' ) . '</td>';
				echo '<td>' . ( isset( $el['iseme'] ) ? (int) $el['iseme'] : '<span class="psra-mut">—</span>' ) . '</td>';
				echo '<td><b>' . (int) $x['vnt'] . '</b></td>';
				echo '<td>' . wc_price( $x['pajamos'] ) . '</td>';
				echo '<td>' . ( $x['be_sav'] ? '<span class="psra-bad">nežinoma</span>' : wc_price( $x['sav'] ) ) . '</td>';
				echo '<td>' . ( $x['be_sav'] ? '<span class="psra-mut">—</span>' : wc_price( $pel ) ) . '</td>';
				echo '<td>' . ( $mrz === null || $x['be_sav'] ? '<span class="psra-mut">—</span>'
					: '<b class="' . ( $mrz < 20 ? 'psra-bad' : 'psra-ok' ) . '">' . number_format_i18n( $mrz, 1 ) . ' %</b>' ) . '</td>';
				echo '</tr>';
			}
			echo '</tbody></table>';
			echo '<p class="description">Rodyta / Įdėta / Išimta pildosi iš elgsenos įvykių — jie renkami nuo tada, '
				. 'kai vitrinoje įjungiamas rašymas. Brūkšnelis reiškia „dar nerenkama".</p>';
		}

		/* --- 3) PILTUVELIS --- */
		echo '<h2>Piltuvėlis</h2>';
		$t = array();
		foreach ( ( $e['pagal_tipa'] ?? array() ) as $x ) { $t[ $x['tipas'] ] = $x; }
		if ( ! $t ) {
			echo '<div class="psra-tuscia">Elgsenos duomenų dar nėra — įvykių rašymas vitrinoje neįjungtas.</div>';
		} else {
			echo '<div class="psra-kort">';
			self::kort( 'Kelias', array(
				array( 'Atidarė dėžę', (int) ( $t['atidare']['s'] ?? 0 ) ),
				array( 'Prisidėjo bent vieną', (int) ( $t['idejo']['s'] ?? 0 ) ),
				array( 'Įsidėjo į krepšelį', (int) ( $t['krepselis']['s'] ?? 0 ) ),
			) );
			self::kort( 'Dovana', array(
				array( 'Pasiekė ribą', (int) ( $t['dovana_atrakinta']['s'] ?? 0 ) ),
				array( 'Keitė dovaną', (int) ( $t['dovana_rinko']['k'] ?? 0 ) ),
				array( 'Spaudė „po 1 vnt."', (int) ( $t['po1']['k'] ?? 0 ) ),
			) );
			echo '</div>';
		}

		echo '</div>';
	}

	private static function kort( $antraste, $eilutes ) {
		echo '<div class="psra-k"><h3>' . esc_html( $antraste ) . '</h3><table>';
		foreach ( $eilutes as $e ) {
			echo '<tr><td>' . $e[0] . '</td><td class="r">' . $e[1] . '</td></tr>';
		}
		echo '</table></div>';
	}

	private static function css() {
		echo '<style>
		.psra h2{margin:26px 0 10px}
		.psra-juosta{display:flex;gap:26px;flex-wrap:wrap;align-items:center;background:#fff;border:1px solid #dcdcde;
			border-radius:6px;padding:12px 16px;margin:14px 0 4px}
		.psra-f{display:flex;align-items:center;gap:8px;margin:0}
		.psra-f label{font-weight:600}
		.psra-kort{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
		.psra-k{background:#fff;border:1px solid #dcdcde;border-radius:6px;padding:14px 16px}
		.psra-k h3{margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#646970}
		.psra-k table{width:100%;border-collapse:collapse}
		.psra-k td{padding:4px 0;font-size:14px}
		.psra-k td.r{text-align:right;font-weight:600;white-space:nowrap}
		.psra-mut{color:#787c82;font-size:12px}
		.psra-bad{color:#b32d2e;font-weight:700}
		.psra-ok{color:#00794b}
		.psra-spejimas{background:#fcf9e8;border-left:4px solid #dba617;padding:10px 14px;margin:12px 0}
		.psra-tuscia{background:#fff;border:1px solid #dcdcde;border-radius:6px;padding:20px;color:#787c82}
		.psra-lent td,.psra-lent th{vertical-align:middle}
		.psra-lent td:nth-child(n+2){text-align:right}
		.psra-lent th:nth-child(n+2){text-align:right}
		</style>';
	}
}

Petshop_Rinkiniu_Ataskaita::init();
