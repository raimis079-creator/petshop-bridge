<?php
/**
 * Plugin Name: Petshop Ataskaitu UI
 * Description: Bendras ataskaitu karkasas (standartas v2): laikotarpis, KPI, diagrama, lentele, veiksmai.
 * Version: 1.0
 *
 * KODEL BENDRAS KARKASAS. Kiekviena ataskaita atsako i tris klausimus ta pacia
 * tvarka — kiek uzdirbau ir ar auga -> kas tai lemia -> ka daryti. Jei kiekvienas
 * ekranas tai pieštu savaip, po metu turetume penkis skirtingus ir penkis kartus
 * taisomus. Cia tik atvaizdavimas: JOKIOS verslo logikos, duomenis paduoda ekranai.
 *
 * Diagramos — grynas SVG (jokiu bibliotekų): greita, veikia amzinai, nieko
 * neuzkrauna is isores.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Ataskaitu_UI {

	const VERSIJA = '1.0';

	/* ==================== PAGALBOS ==================== */

	public static function pvm() {
		$p = (float) get_option( 'ps_stat_pvm', 21 );
		return $p > 0 ? $p : 21;
	}

	public static function be_pvm( $suma ) {
		return $suma / ( 1 + ( self::pvm() / 100 ) );
	}

	public static function eur( $ct, $zenklas = true ) {
		$v = number_format( ( (int) $ct ) / 100, 2, ',', ' ' );
		return $zenklas ? $v . ' €' : $v;
	}

	public static function proc( $v, $sk = 1 ) {
		return number_format( (float) $v, $sk, ',', ' ' ) . ' %';
	}

	/** Saugi dalyba — nuliniai vardikliai ataskaitose yra norma, ne klaida. */
	public static function dal( $a, $b ) {
		return ( (float) $b == 0.0 ) ? 0.0 : ( (float) $a / (float) $b );
	}

	public static function nustatymas( $raktas, $numatytoji ) {
		$v = get_option( $raktas, null );
		return ( $v === null || $v === '' ) ? $numatytoji : (float) $v;
	}

	/* ==================== LAIKOTARPIS ==================== */

	/**
	 * Grazina laikotarpi is GET su palyginimo intervalu. Busena URL'e — nuoroda
	 * issisaugoma ar persiunciama, filtrai nedingsta.
	 */
	public static function laikotarpis() {
		$siandien = current_time( 'Y-m-d' );
		$preset   = isset( $_GET['preset'] ) ? sanitize_key( $_GET['preset'] ) : '30';
		$nuo_g    = isset( $_GET['nuo'] ) ? sanitize_text_field( wp_unslash( $_GET['nuo'] ) ) : '';
		$iki_g    = isset( $_GET['iki'] ) ? sanitize_text_field( wp_unslash( $_GET['iki'] ) ) : '';
		$data_ok  = '/^\d{4}-\d{2}-\d{2}$/';

		if ( $preset === 'savas' && preg_match( $data_ok, $nuo_g ) && preg_match( $data_ok, $iki_g ) ) {
			$nuo = $nuo_g; $iki = $iki_g;
		} elseif ( $preset === 'men' ) {
			$nuo = gmdate( 'Y-m-01', strtotime( $siandien ) ); $iki = $siandien;
		} elseif ( $preset === 'pmen' ) {
			$nuo = gmdate( 'Y-m-01', strtotime( $siandien . ' -1 month' ) );
			$iki = gmdate( 'Y-m-t', strtotime( $nuo ) );
		} elseif ( $preset === 'visi' ) {
			$p = class_exists( 'Petshop_Statistika' ) ? Petshop_Statistika::pradzia() : '';
			$nuo = $p ? $p : gmdate( 'Y-m-d', strtotime( $siandien . ' -365 day' ) );
			$iki = $siandien;
		} elseif ( $preset === '7' ) {
			$nuo = gmdate( 'Y-m-d', strtotime( $siandien . ' -6 day' ) ); $iki = $siandien;
		} else {
			$preset = '30';
			$nuo = gmdate( 'Y-m-d', strtotime( $siandien . ' -29 day' ) ); $iki = $siandien;
		}

		$dienu = max( 1, (int) round( ( strtotime( $iki ) - strtotime( $nuo ) ) / DAY_IN_SECONDS ) + 1 );
		$pries_iki = gmdate( 'Y-m-d', strtotime( $nuo . ' -1 day' ) );
		$pries_nuo = gmdate( 'Y-m-d', strtotime( $pries_iki . ' -' . ( $dienu - 1 ) . ' day' ) );

		return array(
			'preset' => $preset, 'nuo' => $nuo, 'iki' => $iki, 'dienu' => $dienu,
			'pries_nuo' => $pries_nuo, 'pries_iki' => $pries_iki,
			'lyginam' => ( $preset !== 'visi' ),
		);
	}

	public static function nuoroda( $slug, $args = array() ) {
		$bazė = array( 'page' => $slug );
		foreach ( array( 'preset', 'nuo', 'iki', 'deze', 'tipas', 'gyvunas', 'pjuvis', 'preke' ) as $k ) {
			if ( isset( $_GET[ $k ] ) && $_GET[ $k ] !== '' ) { $bazė[ $k ] = sanitize_text_field( wp_unslash( $_GET[ $k ] ) ); }
		}
		$bazė = array_merge( $bazė, $args );
		foreach ( $bazė as $k => $v ) { if ( $v === '' || $v === null ) { unset( $bazė[ $k ] ); } }
		return admin_url( 'admin.php?' . http_build_query( $bazė ) );
	}

	/**
	 * Laikotarpio juosta. $filtrai: [['vardas'=>'deze','uzrasas'=>'Rinkinys','parinktys'=>[id=>pav],'reiksme'=>x], ...]
	 */
	public static function juosta( $slug, $lt, $filtrai = array() ) {
		$presetai = array( '7' => '7 d.', '30' => '30 d.', 'men' => 'Šis mėnuo', 'pmen' => 'Praėjęs mėn.', 'visi' => 'Nuo pradžios' );
		echo '<div class="psru-juosta"><form method="get" action="' . esc_url( admin_url( 'admin.php' ) ) . '">';
		echo '<input type="hidden" name="page" value="' . esc_attr( $slug ) . '">';
		echo '<div class="psru-presetai">';
		foreach ( $presetai as $k => $v ) {
			$akt = ( $lt['preset'] === $k ) ? ' akt' : '';
			echo '<a class="psru-pbtn' . esc_attr( $akt ) . '" href="' . esc_url( self::nuoroda( $slug, array( 'preset' => $k, 'nuo' => '', 'iki' => '' ) ) ) . '">' . esc_html( $v ) . '</a>';
		}
		echo '</div>';
		echo '<label>nuo</label><input type="date" name="nuo" value="' . esc_attr( $lt['nuo'] ) . '">';
		echo '<label>iki</label><input type="date" name="iki" value="' . esc_attr( $lt['iki'] ) . '">';
		echo '<input type="hidden" name="preset" value="savas">';

		foreach ( $filtrai as $f ) {
			echo '<label>' . esc_html( $f['uzrasas'] ) . '</label><select name="' . esc_attr( $f['vardas'] ) . '">';
			foreach ( $f['parinktys'] as $k => $v ) {
				echo '<option value="' . esc_attr( $k ) . '"' . selected( (string) $f['reiksme'], (string) $k, false ) . '>' . esc_html( $v ) . '</option>';
			}
			echo '</select>';
		}
		echo '<button class="button">Rodyti</button>';
		if ( $lt['lyginam'] ) {
			echo '<span class="psru-palyginys">lyginama su: <b>' . esc_html( $lt['pries_nuo'] . ' – ' . $lt['pries_iki'] ) . '</b></span>';
		}
		echo '</form></div>';
	}

	/* ==================== KPI ==================== */

	/**
	 * $delta: null — nerodom; kitaip masyvas ['dabar'=>x,'buvo'=>y,'pp'=>bool,'atv'=>bool]
	 * pp — skirtuma rodom procentiniais punktais; atv — mazejimas yra gerai.
	 */
	public static function kpi( $antraste, $reiksme, $delta = null, $pastaba = '', $tooltip = '', $spark = array() ) {
		echo '<div class="psru-k">';
		echo '<h3>' . esc_html( $antraste ) . self::tt( $tooltip ) . '</h3>';
		echo '<div class="psru-reiksme">' . wp_kses_post( $reiksme ) . '</div>';
		if ( is_array( $delta ) ) {
			$d = $delta['dabar'] - $delta['buvo'];
			$pp = ! empty( $delta['pp'] );
			$sk = $pp ? $d : ( $delta['buvo'] != 0 ? ( $d / abs( $delta['buvo'] ) ) * 100 : 0 );
			$klase = 'neut'; $rodykle = '—';
			if ( abs( $sk ) >= 0.05 ) {
				$ger = ( $sk > 0 ) ? empty( $delta['atv'] ) : ! empty( $delta['atv'] );
				$klase = $ger ? 'up' : 'down';
				$rodykle = ( $sk > 0 ) ? '▲' : '▼';
			}
			echo '<span class="psru-delta ' . esc_attr( $klase ) . '">' . esc_html( $rodykle . ' ' . number_format( abs( $sk ), 1, ',', ' ' ) . ( $pp ? ' p.p.' : ' %' ) ) . '</span>';
		}
		if ( $pastaba !== '' ) { echo '<span class="psru-pries">' . wp_kses_post( $pastaba ) . '</span>'; }
		if ( count( $spark ) > 2 ) { echo self::spark( $spark ); }
		echo '</div>';
	}

	/** Mini tendencija KPI kortelėje. */
	public static function spark( $reiksmes, $spalva = '#2271b1' ) {
		$n = count( $reiksmes );
		$max = max( $reiksmes ); $min = min( $reiksmes );
		$sk = ( $max - $min ) ?: 1;
		$t = array();
		foreach ( array_values( $reiksmes ) as $i => $v ) {
			$x = ( $n > 1 ) ? ( $i / ( $n - 1 ) ) * 72 : 0;
			$y = 24 - ( ( $v - $min ) / $sk ) * 20;
			$t[] = round( $x, 1 ) . ',' . round( $y, 1 );
		}
		return '<svg class="psru-spark" width="72" height="26" viewBox="0 0 72 26" aria-hidden="true"><polyline fill="none" stroke="' . esc_attr( $spalva ) . '" stroke-width="1.6" points="' . esc_attr( implode( ' ', $t ) ) . '"/></svg>';
	}

	public static function tt( $tekstas ) {
		if ( $tekstas === '' ) { return ''; }
		return '<i class="psru-tt" data-t="' . esc_attr( $tekstas ) . '">i</i>';
	}

	public static function spejimas( $html ) {
		echo '<div class="psru-spejimas">' . wp_kses_post( $html ) . '</div>';
	}

	/** Maza imtis — pilka reiksme su zyme, kad nepriimtum sprendimo is triuksmo. */
	public static function maza_imtis( $tekstas, $imtis, $riba = null ) {
		$riba = ( $riba === null ) ? self::nustatymas( 'ps_rib_maza_imtis', 30 ) : $riba;
		if ( $imtis >= $riba ) { return esc_html( $tekstas ); }
		return '<span class="psru-maza">' . esc_html( $tekstas ) . ' <span class="psru-maza-z">maža imtis</span></span>';
	}

	/* ==================== DIAGRAMA ==================== */

	/**
	 * Laiko eilutes: dabartinis laikotarpis (pajamos + pelnas) ir ankstesnis
	 * (punktyras). Grynas SVG — jokiu bibliotekų.
	 */
	public static function diagrama( $pajamos, $pelnas, $pries = array(), $antraste = 'Pajamos ir pelnas pagal dieną' ) {
		$visi = array_merge( array_values( $pajamos ), array_values( $pelnas ), array_values( $pries ) );
		$max = $visi ? max( $visi ) : 0;
		if ( $max <= 0 ) { $max = 1; }
		$P = 170;

		$linija = function( $reiksmes ) use ( $max, $P ) {
			$n = count( $reiksmes );
			if ( $n < 1 ) { return ''; }
			$t = array();
			foreach ( array_values( $reiksmes ) as $i => $v ) {
				$x = ( $n > 1 ) ? ( $i / ( $n - 1 ) ) * 1080 : 0;
				$y = $P - ( $v / $max ) * ( $P - 20 );
				$t[] = round( $x, 1 ) . ',' . round( $y, 1 );
			}
			return implode( ' ', $t );
		};

		echo '<div class="psru-diagrama"><div class="psru-galva"><b>' . esc_html( $antraste ) . '</b>';
		echo '<div class="psru-legenda"><span><i style="background:#2271b1"></i>Pajamos su PVM</span><span><i style="background:#00794b"></i>Pelnas</span>';
		if ( $pries ) { echo '<span style="opacity:.75"><i style="background:#c3c4c7"></i>ankstesnis laikotarpis</span>'; }
		echo '</div></div>';
		echo '<svg width="100%" height="190" viewBox="0 0 1080 190" preserveAspectRatio="none">';
		echo '<g stroke="#f0f0f1"><line x1="0" y1="40" x2="1080" y2="40"/><line x1="0" y1="85" x2="1080" y2="85"/><line x1="0" y1="130" x2="1080" y2="130"/></g>';
		foreach ( array( 40 => 0.85, 85 => 0.55, 130 => 0.25 ) as $y => $dalis ) {
			echo '<text x="4" y="' . (int) ( $y - 4 ) . '" font-size="10" fill="#787c82">' . esc_html( self::eur( (int) round( $max * $dalis ) ) ) . '</text>';
		}
		if ( $pries ) { echo '<polyline fill="none" stroke="#c3c4c7" stroke-width="1.4" stroke-dasharray="4 4" points="' . esc_attr( $linija( $pries ) ) . '"/>'; }
		echo '<polyline fill="none" stroke="#2271b1" stroke-width="2.2" points="' . esc_attr( $linija( $pajamos ) ) . '"/>';
		echo '<polyline fill="none" stroke="#00794b" stroke-width="2" points="' . esc_attr( $linija( $pelnas ) ) . '"/>';
		echo '</svg></div>';
	}

	/* ==================== LENTELE ==================== */

	/**
	 * $stulpeliai: [['pav'=>'Prekė','tt'=>'','kaire'=>true], ...]
	 * $eilutes: [[html, html, ...], ...]  (jau paruosti langeliai)
	 */
	public static function lentele( $id, $stulpeliai, $eilutes, $opts = array() ) {
		$o = wp_parse_args( $opts, array( 'paieska' => true, 'csv' => true, 'rikiuoti' => 0, 'failas' => 'ataskaita.csv' ) );

		if ( $o['paieska'] || $o['csv'] ) {
			echo '<div class="psru-lent-galva">';
			if ( $o['paieska'] ) { echo '<input type="search" class="psru-pai" data-lent="' . esc_attr( $id ) . '" placeholder="Ieškoti…">'; }
			echo '<span class="psru-pastaba" style="margin:0">Spausk stulpelio antraštę rikiavimui</span>';
			if ( $o['csv'] ) { echo '<button type="button" class="psru-csv" data-lent="' . esc_attr( $id ) . '" data-failas="' . esc_attr( $o['failas'] ) . '">⬇ CSV eksportas</button>'; }
			echo '</div>';
		}

		echo '<table class="psru-lent" id="' . esc_attr( $id ) . '" data-rik="' . (int) $o['rikiuoti'] . '"><thead><tr>';
		foreach ( $stulpeliai as $i => $s ) {
			$k = ! empty( $s['kaire'] ) ? ' class="kaire"' : '';
			echo '<th data-k="' . (int) $i . '"' . $k . '>' . esc_html( $s['pav'] ) . self::tt( isset( $s['tt'] ) ? $s['tt'] : '' ) . '</th>';
		}
		echo '</tr></thead><tbody>';
		if ( ! $eilutes ) {
			echo '<tr class="psru-tuscia"><td colspan="' . count( $stulpeliai ) . '">Šiuo laikotarpiu duomenų nėra.</td></tr>';
		}
		foreach ( $eilutes as $e ) {
			echo '<tr>';
			foreach ( $e as $i => $l ) {
				$k = ( isset( $stulpeliai[ $i ]['kaire'] ) && $stulpeliai[ $i ]['kaire'] ) ? ' class="kaire"' : '';
				echo '<td' . $k . '>' . wp_kses_post( $l ) . '</td>';
			}
			echo '</tr>';
		}
		echo '</tbody></table>';
	}

	/* ==================== VEIKSMAI IR PILTUVELIS ==================== */

	/** $irasai: [['pav'=>html,'kodel'=>html], ...] */
	public static function veiksmai( $tipas, $antraste, $irasai, $tuscia = 'Kandidatų nėra.' ) {
		/* Antrasteje leidziamas HTML — i ja deda tooltip'a (`tt()`). Su esc_html
		   vartotojas matydavo zalia `<i class=...>` koda ekrane. */
		echo '<div class="psru-v psru-v-' . esc_attr( $tipas ) . '"><h3>' . wp_kses_post( $antraste ) . '</h3><ul>';
		if ( ! $irasai ) { echo '<li class="psru-mut">' . esc_html( $tuscia ) . '</li>'; }
		foreach ( $irasai as $i ) {
			echo '<li>' . wp_kses_post( $i['pav'] ) . '<span class="psru-kodel">' . wp_kses_post( $i['kodel'] ) . '</span></li>';
		}
		echo '</ul></div>';
	}

	/** $zingsniai: [['pav'=>'Atidarė','sk'=>1240], ...] — perejimai skaiciuojami cia. */
	public static function piltuvelis( $zingsniai ) {
		$n = count( $zingsniai );
		$per = array();
		for ( $i = 1; $i < $n; $i++ ) {
			$pr = (float) $zingsniai[ $i - 1 ]['sk'];
			$per[ $i ] = $pr > 0 ? ( $zingsniai[ $i ]['sk'] / $pr ) * 100 : 0;
		}
		/* Silpna vieta zymima tik kai yra ka lyginti: su nuliniais skaiciais
		   „silpniausias perejimas" butu atsitiktinis pirmas. */
		$yra_duomenu = false;
		foreach ( $zingsniai as $z ) { if ( (int) $z['sk'] > 0 ) { $yra_duomenu = true; break; } }
		$silpna = 0; $min = null;
		if ( $yra_duomenu ) {
			foreach ( $per as $i => $v ) { if ( $min === null || $v < $min ) { $min = $v; $silpna = $i; } }
		}

		echo '<div class="psru-pilt">';
		foreach ( $zingsniai as $i => $z ) {
			if ( $i > 0 ) {
				$kl = ( $i === $silpna && $n > 2 ) ? ' silpna' : '';
				echo '<div class="psru-perej' . esc_attr( $kl ) . '">';
				echo '<svg width="26" height="10" aria-hidden="true"><path d="M0 5h20m-5-4 5 4-5 4" stroke="' . ( $kl ? '#b32d2e' : '#787c82' ) . '" fill="none" stroke-width="1.4"/></svg>';
				echo '<b>' . esc_html( number_format( $per[ $i ], 0, ',', ' ' ) . ' %' ) . '</b>';
				if ( $kl ) { echo '<span>silpna vieta</span>'; }
				echo '</div>';
			}
			echo '<div class="psru-zings"><div class="sk">' . esc_html( number_format( (int) $z['sk'], 0, ',', ' ' ) ) . '</div><div class="pav">' . esc_html( $z['pav'] ) . '</div></div>';
		}
		echo '</div>';
	}

	/** Horizontali dalies juostele lentelese. */
	public static function juostele( $tekstas, $dalis ) {
		$p = max( 0, min( 100, (float) $dalis ) );
		return '<span class="psru-dalis">' . esc_html( $tekstas ) . '<i><b style="width:' . esc_attr( round( $p, 1 ) ) . '%"></b></i></span>';
	}

	/* ==================== ANTRASTE, STILIUS, JS ==================== */

	public static function antraste( $pavadinimas, $aprasas ) {
		$sv = class_exists( 'Petshop_Ataskaitu_Agregavimas' ) ? Petshop_Ataskaitu_Agregavimas::sviezumas() : '';
		echo '<div class="wrap psru">';
		echo '<span class="psru-sviezuma">' . ( $sv ? 'Duomenys atnaujinti ' . esc_html( $sv ) . ' · ' : '' ) . 'dienos suvestinė 03:15</span>';
		echo '<h1>' . esc_html( $pavadinimas ) . '</h1>';
		echo '<p class="psru-aprasas">' . esc_html( $aprasas ) . '</p>';
	}

	public static function pabaiga() {
		echo '</div>';
		self::stilius();
		self::js();
	}

	public static function stilius() {
		?>
<style>
.psru{--fon:#f0f0f1;--korta:#fff;--linija:#dcdcde;--tekstas:#1d2327;--mut:#787c82;--akc:#2271b1;--ok:#00794b;--bad:#b32d2e;--gelsva:#dba617;--ok-fonas:#edfaef;--bad-fonas:#fcf0f1;max-width:1180px}
.psru h1{font-size:23px;font-weight:400;margin:8px 0 4px}
.psru h2{font-size:15px;margin:30px 0 10px}
.psru .psru-aprasas{color:var(--mut);margin:0 0 14px}
.psru .psru-sviezuma{float:right;color:var(--mut);font-size:12px;margin-top:14px}
.psru .psru-pastaba{color:var(--mut);font-size:12px;margin-top:8px}
.psru .psru-mut{color:var(--mut)}
.psru-juosta{display:flex;gap:12px;flex-wrap:wrap;align-items:center;background:var(--korta);border:1px solid var(--linija);border-radius:6px;padding:10px 14px;margin:12px 0 16px}
.psru-juosta form{display:flex;gap:12px;flex-wrap:wrap;align-items:center;width:100%}
.psru-juosta label{font-weight:600;font-size:12.5px}
.psru-juosta input[type=date],.psru-juosta select{border:1px solid var(--linija);border-radius:4px;padding:4px 8px;font-size:12.5px}
.psru-presetai{display:flex;gap:4px}
.psru-pbtn{border:1px solid var(--linija);background:#fff;border-radius:4px;padding:5px 11px;font-size:12.5px;color:var(--tekstas);text-decoration:none}
.psru-pbtn.akt{background:var(--akc);border-color:var(--akc);color:#fff}
.psru-palyginys{color:var(--mut);font-size:12px;margin-left:auto}
.psru-kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:12px}
.psru-k{background:var(--korta);border:1px solid var(--linija);border-radius:6px;padding:13px 15px;position:relative}
.psru-k h3{margin:0 0 4px;font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--mut);font-weight:600}
.psru-reiksme{font-size:22px;font-weight:600;line-height:1.15}
.psru-delta{font-size:12px;font-weight:600;margin-top:2px;display:inline-block;padding:1px 7px;border-radius:10px}
.psru-delta.up{color:var(--ok);background:var(--ok-fonas)}
.psru-delta.down{color:var(--bad);background:var(--bad-fonas)}
.psru-delta.neut{color:var(--mut);background:#f0f0f1}
.psru-pries{color:var(--mut);font-size:11.5px;margin-left:6px}
.psru-spark{position:absolute;right:12px;bottom:12px;opacity:.9}
.psru-tt{display:inline-flex;width:14px;height:14px;border-radius:50%;background:#e3e5e8;color:var(--mut);font-size:10px;align-items:center;justify-content:center;cursor:help;position:relative;vertical-align:1px;margin-left:4px;font-style:normal}
.psru-tt:hover::after{content:attr(data-t);position:absolute;bottom:20px;left:50%;transform:translateX(-50%);background:#1d2327;color:#fff;padding:7px 10px;border-radius:5px;width:240px;font-size:11.5px;line-height:1.45;font-weight:400;text-transform:none;letter-spacing:0;z-index:20;text-align:left}
.psru-diagrama{background:var(--korta);border:1px solid var(--linija);border-radius:6px;padding:14px 16px;margin-top:14px}
.psru-galva{display:flex;gap:16px;align-items:center;margin-bottom:6px}
.psru-legenda{display:flex;gap:14px;font-size:12px;color:var(--mut);margin-left:auto}
.psru-legenda i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px;vertical-align:-1px;font-style:normal}
.psru-veiksmai{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px}
.psru-veiksmai.trys{grid-template-columns:1fr 1fr 1fr}
@media(max-width:960px){.psru-veiksmai,.psru-veiksmai.trys{grid-template-columns:1fr}}
.psru-v{background:var(--korta);border:1px solid var(--linija);border-radius:6px;padding:13px 15px}
.psru-v-bad{border-left:4px solid var(--bad)}
.psru-v-ok{border-left:4px solid var(--ok)}
.psru-v h3{margin:0 0 8px;font-size:13px}
.psru-v ul{margin:0;padding:0;list-style:none}
.psru-v li{padding:6px 0;border-top:1px solid #f0f0f1;display:flex;gap:8px;align-items:baseline}
.psru-v li:first-child{border-top:none}
.psru-v li a{color:var(--akc);text-decoration:none;font-weight:600}
.psru-v li .psru-kodel{color:var(--mut);font-size:12px;margin-left:auto;text-align:right}
.psru-lent-galva{display:flex;gap:10px;align-items:center;margin:0 0 8px}
.psru-pai{border:1px solid var(--linija);border-radius:4px;padding:5px 10px;width:230px;font-size:12.5px}
.psru-csv{margin-left:auto;border:1px solid var(--linija);background:#fff;border-radius:4px;padding:5px 12px;cursor:pointer;font-size:12.5px}
table.psru-lent{width:100%;border-collapse:collapse;background:var(--korta);border:1px solid var(--linija);border-radius:6px;overflow:hidden}
.psru-lent th{background:#fff;border-bottom:1px solid var(--linija);padding:9px 10px;font-size:11.5px;text-transform:uppercase;letter-spacing:.04em;color:var(--mut);text-align:right;cursor:pointer;user-select:none;white-space:nowrap}
.psru-lent th.kaire{text-align:left}
.psru-lent th.akt{color:var(--akc)}
.psru-lent th .r{font-size:9px;margin-left:3px;opacity:.6}
.psru-lent td{padding:9px 10px;border-bottom:1px solid #f0f0f1;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.psru-lent td.kaire{text-align:left;white-space:normal}
.psru-lent tr:hover td{background:#f6f9fc}
.psru-lent a{color:var(--akc);text-decoration:none;font-weight:600}
.psru-lent .sub{color:var(--mut);font-size:11.5px;font-weight:400}
.psru-lent .ok{color:var(--ok);font-weight:700}
.psru-lent .bad{color:var(--bad);font-weight:700}
.psru-tuscia td{text-align:center;color:var(--mut);padding:22px 10px}
.psru-dalis{display:inline-block;min-width:64px}
.psru-dalis i{display:block;height:4px;border-radius:2px;background:#e3e5e8;margin-top:3px;font-style:normal}
.psru-dalis i b{display:block;height:4px;border-radius:2px;background:var(--akc)}
.psru-maza{color:var(--mut)!important;font-weight:400!important}
.psru-maza-z{font-size:10px;background:#f0f0f1;color:var(--mut);border-radius:8px;padding:0 6px;margin-left:4px;white-space:nowrap}
.psru-spejimas{background:#fcf9e8;border-left:4px solid var(--gelsva);padding:10px 14px;margin:12px 0;border-radius:0 4px 4px 0}
.psru-pilt{display:flex;background:var(--korta);border:1px solid var(--linija);border-radius:6px;padding:18px 16px;align-items:stretch;overflow-x:auto}
.psru-zings{flex:1;min-width:120px;text-align:center;padding:0 8px}
.psru-zings .sk{font-size:21px;font-weight:600}
.psru-zings .pav{color:var(--mut);font-size:12px;margin-top:2px}
.psru-perej{width:70px;display:flex;flex-direction:column;justify-content:center;align-items:center;color:var(--mut);font-size:11.5px}
.psru-perej b{font-size:13px;color:var(--tekstas)}
.psru-perej.silpna b{color:var(--bad)}
.psru-skirt{display:inline-flex;gap:3px;align-items:center}
.psru-skirt b{display:inline-block;height:14px;border-radius:3px;min-width:6px}
.psru-skirt-leg{font-size:11px;color:var(--mut)}
.psru-eilute{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12.5px}
.psru-eilute .pav{width:140px}
.psru-eilute .juosta{flex:1;height:6px;background:#f0f0f1;border-radius:3px;overflow:hidden}
.psru-eilute .juosta b{display:block;height:6px;background:var(--akc)}
.psru-eilute .sk{width:150px;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.psru-blokas{background:var(--korta);border:1px solid var(--linija);border-radius:6px;padding:14px 16px}
.psru-blokas.bad{border-left:4px solid var(--bad)}
.psru-zyme{display:inline-block;font-size:10px;border-radius:3px;padding:1px 6px;margin-left:6px;vertical-align:1px;font-weight:600}
.psru-zyme.mnm{background:#e7f0f7;color:#2271b1}
.psru-zyme.dp{background:#f0e9f5;color:#8c5e9e}
.psru-verd{font-size:11px;font-weight:700;border-radius:3px;padding:2px 7px}
.psru-verd.prideda{background:var(--ok-fonas);color:var(--ok)}
.psru-verd.perkelia{background:var(--bad-fonas);color:var(--bad)}
.psru-verd.neaisku{background:#f0f0f1;color:var(--mut)}
</style>
		<?php
	}

	public static function js() {
		?>
<script>
(function(){
	document.querySelectorAll('table.psru-lent').forEach(function(t){
		var tb=t.tBodies[0]; if(!tb) return;
		var ak=parseInt(t.dataset.rik||'0',10), kr=-1;
		function zyme(th,k){
			t.querySelectorAll('th').forEach(function(x){x.classList.remove('akt');var r=x.querySelector('.r'); if(r)r.remove();});
			th.classList.add('akt');
			th.insertAdjacentHTML('beforeend','<span class="r">'+(kr<0?'▼':'▲')+'</span>');
		}
		var th0=t.querySelector('th[data-k="'+ak+'"]'); if(th0) zyme(th0,ak);
		t.tHead.addEventListener('click',function(e){
			var th=e.target.closest('th'); if(!th||e.target.classList.contains('psru-tt')) return;
			var k=parseInt(th.dataset.k,10); if(isNaN(k)) return;
			kr=(k===ak)?-kr:-1; ak=k; zyme(th,k);
			var eil=Array.prototype.slice.call(tb.rows).filter(function(r){return !r.classList.contains('psru-tuscia');});
			eil.sort(function(a,b){
				var va=(a.cells[k]?a.cells[k].innerText:'').trim(), vb=(b.cells[k]?b.cells[k].innerText:'').trim();
				var na=parseFloat(va.replace(/[^\d,.-]/g,'').replace(',','.')), nb=parseFloat(vb.replace(/[^\d,.-]/g,'').replace(',','.'));
				if(!isNaN(na)&&!isNaN(nb)) return (na-nb)*(-kr);
				return va.localeCompare(vb,'lt')*(-kr);
			});
			eil.forEach(function(r){tb.appendChild(r);});
		});
	});
	document.querySelectorAll('.psru-pai').forEach(function(inp){
		inp.addEventListener('input',function(){
			var t=document.getElementById(inp.dataset.lent); if(!t) return;
			var q=this.value.toLowerCase();
			t.querySelectorAll('tbody tr').forEach(function(r){
				if(r.classList.contains('psru-tuscia')) return;
				r.style.display=(r.cells[0]&&r.cells[0].innerText.toLowerCase().indexOf(q)>-1)?'':'none';
			});
		});
	});
	document.querySelectorAll('.psru-csv').forEach(function(b){
		b.addEventListener('click',function(){
			var t=document.getElementById(b.dataset.lent); if(!t) return;
			var eil=Array.prototype.slice.call(t.querySelectorAll('tr')).map(function(r){
				return Array.prototype.slice.call(r.cells).map(function(c){
					return '"'+c.innerText.replace(/"/g,'""').replace(/\s+/g,' ').trim()+'"';
				}).join(';');
			}).join('\n');
			var a=document.createElement('a');
			a.href=URL.createObjectURL(new Blob(['\ufeff'+eil],{type:'text/csv;charset=utf-8'}));
			a.download=b.dataset.failas||'ataskaita.csv'; a.click();
		});
	});
})();
</script>
		<?php
	}
}
