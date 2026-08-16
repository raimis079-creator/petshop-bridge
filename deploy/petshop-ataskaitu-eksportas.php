<?php
/**
 * Plugin Name: Petshop Ataskaitu Eksportas
 * Description: Ataskaitu atsisiuntimas i Excel (.xlsx) — keli lapai, tikri skaiciai, zali duomenys.
 * Version: 1.0
 *
 * KODEL SAVAS RASYTOJAS. Serveryje yra PhpSpreadsheet, bet jis atkeliaves su
 * kitu pluginu (importu) — jei tas plugin'as bus atnaujintas ar isjungtas,
 * eksportas nutruktu be jokio ispejimo. Cia rasomas minimalus XLSX per
 * `ZipArchive` (patikrinta: veikia): jokiu isoriniu priklausomybiu.
 *
 * KODEL NE CSV. Lenteles CSV eksportas ima tai, ka mato ekranas: „48,12 €",
 * „13,2 %", tarpai tukstanciuose. Excel'yje tai TEKSTAS — nei susumuosi, nei
 * pivot'a padarysi. Cia skaiciai rasomi kaip SKAICIAI, o formatavimas paliekamas
 * Excel'iui. Procentai — dalimis (0,132), kad veiktu vidurkiai.
 *
 * Lapas „Zali duomenys" yra svarbiausias analizei: ten visa dienos suvestine
 * be jokio apdorojimo — is jos galima susisukti bet koki pjuvi pivot'u,
 * neprasant naujos ataskaitos.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Ataskaitu_Eksportas {

	const VERSIJA = '1.0';
	const CAP     = 'manage_woocommerce';
	const VEIKSMAS = 'ps_ata_xlsx';

	public static function init() {
		add_action( 'admin_post_' . self::VEIKSMAS, array( __CLASS__, 'atsisiusti' ) );
	}

	/* ==================== MYGTUKAS ==================== */

	public static function mygtukas( $ekranas, $lt, $papildomi = array() ) {
		$args = array_merge( array(
			'action'   => self::VEIKSMAS,
			'ekranas'  => $ekranas,
			'nuo'      => $lt['nuo'],
			'iki'      => $lt['iki'],
			'_wpnonce' => wp_create_nonce( self::VEIKSMAS ),
		), $papildomi );
		$url = admin_url( 'admin-post.php?' . http_build_query( $args ) );
		echo '<a class="button button-primary psru-xlsx" href="' . esc_url( $url ) . '">⬇ Atsisiųsti į Excel</a>';
	}

	/* ==================== XLSX RASYTOJAS ==================== */

	private static function esc( $t ) {
		return htmlspecialchars( (string) $t, ENT_QUOTES | ENT_XML1, 'UTF-8' );
	}

	/** Stulpelio raide: 1 -> A, 27 -> AA. */
	private static function stulpelis( $n ) {
		$s = '';
		while ( $n > 0 ) {
			$m = ( $n - 1 ) % 26;
			$s = chr( 65 + $m ) . $s;
			$n = (int) ( ( $n - $m - 1 ) / 26 );
		}
		return $s;
	}

	/**
	 * Langelis. Masyvas array('v'=>reiksme,'t'=>tipas) arba paprasta reiksme.
	 * Tipai: 's' tekstas, 'n' skaicius, 'e' eurai, 'p' procentai, 'd' data, 'h' antraste.
	 */
	private static function langelis( $stulp, $eil, $reiksme, $tipas = 's' ) {
		$nuoroda = self::stulpelis( $stulp ) . $eil;
		$stilius = array( 's' => 0, 'h' => 1, 'n' => 2, 'e' => 3, 'p' => 4, 'd' => 5 );
		$s = isset( $stilius[ $tipas ] ) ? $stilius[ $tipas ] : 0;

		if ( $tipas === 'n' || $tipas === 'e' || $tipas === 'p' ) {
			if ( $reiksme === null || $reiksme === '' ) {
				return '<c r="' . $nuoroda . '" s="' . $s . '"/>';
			}
			/* Taskas, ne kablelis: lokale skaiciaus i XML patekti negali. */
			$v = rtrim( rtrim( number_format( (float) $reiksme, 6, '.', '' ), '0' ), '.' );
			if ( $v === '' || $v === '-' ) { $v = '0'; }
			return '<c r="' . $nuoroda . '" s="' . $s . '" t="n"><v>' . $v . '</v></c>';
		}
		return '<c r="' . $nuoroda . '" s="' . $s . '" t="inlineStr"><is><t xml:space="preserve">' . self::esc( $reiksme ) . '</t></is></c>';
	}

	/**
	 * Lapas is eiluciu. Kiekviena eilute — masyvas langeliu:
	 * array( array('v'=>..,'t'=>'e'), 'paprastas tekstas', ... )
	 */
	/**
	 * OOXML reikalauja GRIEZTOS elementu tvarkos:
	 *   dimension -> sheetViews -> sheetFormatPr -> cols -> sheetData -> pageMargins
	 * Pirmoje versijoje `<sheetViews/>` stovejo PO `sheetData` ir dar buvo
	 * tuscias — openpyxl toki faila atidaro, Excel atsisako („neskaitomas
	 * turinys"). Tvarka ir uzpildymas cia nera grazbylyste, o salyga atsidaryti.
	 */
	private static function lapas( $eilutes, $placiai = array() ) {
		$eil_sk = count( $eilutes );
		$st_sk = 1;
		foreach ( $eilutes as $e ) { $st_sk = max( $st_sk, count( $e ) ); }

		$x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n"
			. '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
			. '<dimension ref="A1:' . self::stulpelis( $st_sk ) . max( 1, $eil_sk ) . '"/>'
			. '<sheetViews><sheetView workbookViewId="0"/></sheetViews>'
			. '<sheetFormatPr defaultRowHeight="15"/>';

		if ( $placiai ) {
			$x .= '<cols>';
			foreach ( $placiai as $i => $p ) {
				$x .= '<col min="' . ( $i + 1 ) . '" max="' . ( $i + 1 ) . '" width="' . (float) $p . '" customWidth="1"/>';
			}
			$x .= '</cols>';
		}

		$x .= '<sheetData>';
		$nr = 0;
		foreach ( $eilutes as $eil ) {
			$nr++;
			$x .= '<row r="' . $nr . '">';
			$st = 0;
			foreach ( $eil as $l ) {
				$st++;
				if ( is_array( $l ) ) {
					$x .= self::langelis( $st, $nr, isset( $l['v'] ) ? $l['v'] : '', isset( $l['t'] ) ? $l['t'] : 's' );
				} else {
					$x .= self::langelis( $st, $nr, $l, 's' );
				}
			}
			$x .= '</row>';
		}
		$x .= '</sheetData>';
		$x .= '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>';
		$x .= '</worksheet>';
		return $x;
	}

	private static function stiliai() {
		return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n"
		. '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
		. '<numFmts count="2">'
		. '<numFmt numFmtId="164" formatCode="#,##0.00\ &quot;€&quot;"/>'
		. '<numFmt numFmtId="165" formatCode="0.0%"/>'
		. '</numFmts>'
		. '<fonts count="2">'
		. '<font><sz val="11"/><name val="Calibri"/></font>'
		. '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>'
		. '</fonts>'
		. '<fills count="3">'
		. '<fill><patternFill patternType="none"/></fill>'
		. '<fill><patternFill patternType="gray125"/></fill>'
		. '<fill><patternFill patternType="solid"><fgColor rgb="FF2271B1"/><bgColor indexed="64"/></patternFill></fill>'
		. '</fills>'
		. '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
		. '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
		. '<cellXfs count="6">'
		. '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
		. '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>'
		. '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>'
		. '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>'
		. '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>'
		. '<xf numFmtId="14" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>'
		. '</cellXfs>'
		. '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
		. '</styleSheet>';
	}

	/** Lapo vardas: Excel neleidzia [ ] : * ? / \ ir ilgesnio nei 31 simbolis. */
	private static function lapo_vardas( $v ) {
		$v = str_replace( array( '[', ']', ':', '*', '?', '/', '\\' ), '-', (string) $v );
		return function_exists( 'mb_substr' ) ? mb_substr( $v, 0, 31 ) : substr( $v, 0, 31 );
	}

	/** $lapai: array( 'Vardas' => array( 'eilutes' => [...], 'placiai' => [...] ) ) */
	public static function xlsx( $lapai, $failas ) {
		if ( ! class_exists( 'ZipArchive' ) ) { return false; }
		$kelias = tempnam( sys_get_temp_dir(), 'psxlsx' );
		$z = new ZipArchive();
		if ( $z->open( $kelias, ZipArchive::CREATE | ZipArchive::OVERWRITE ) !== true ) { return false; }

		$vardai = array();
		foreach ( array_keys( $lapai ) as $v ) { $vardai[] = self::lapo_vardas( $v ); }
		$n = count( $vardai );

		$ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n"
			. '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
			. '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
			. '<Default Extension="xml" ContentType="application/xml"/>'
			. '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
			. '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>';
		for ( $i = 1; $i <= $n; $i++ ) {
			$ct .= '<Override PartName="/xl/worksheets/sheet' . $i . '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
		}
		$ct .= '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>';
		$ct .= '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>';
		$ct .= '</Types>';
		$z->addFromString( '[Content_Types].xml', $ct );

		$z->addFromString( '_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n"
			. '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
			. '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
			. '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
			. '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
			. '</Relationships>' );

		$dabar = gmdate( 'Y-m-d\TH:i:s\Z' );
		$z->addFromString( 'docProps/core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n"
			. '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
			. 'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" '
			. 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
			. '<dc:creator>petshop.lt</dc:creator><cp:lastModifiedBy>petshop.lt</cp:lastModifiedBy>'
			. '<dcterms:created xsi:type="dcterms:W3CDTF">' . $dabar . '</dcterms:created>'
			. '<dcterms:modified xsi:type="dcterms:W3CDTF">' . $dabar . '</dcterms:modified>'
			. '</cp:coreProperties>' );

		$z->addFromString( 'docProps/app.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n"
			. '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
			. 'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
			. '<Application>Petshop</Application></Properties>' );

		$wb = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n"
			. '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
			. 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>';
		$rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n"
			. '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
		for ( $i = 1; $i <= $n; $i++ ) {
			$wb .= '<sheet name="' . self::esc( $vardai[ $i - 1 ] ) . '" sheetId="' . $i . '" r:id="rId' . $i . '"/>';
			$rels .= '<Relationship Id="rId' . $i . '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' . $i . '.xml"/>';
		}
		$wb .= '</sheets></workbook>';
		$rels .= '<Relationship Id="rId' . ( $n + 1 ) . '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>';
		$rels .= '</Relationships>';

		$z->addFromString( 'xl/workbook.xml', $wb );
		$z->addFromString( 'xl/_rels/workbook.xml.rels', $rels );
		$z->addFromString( 'xl/styles.xml', self::stiliai() );

		$i = 0;
		foreach ( $lapai as $duom ) {
			$i++;
			$z->addFromString( 'xl/worksheets/sheet' . $i . '.xml',
				self::lapas( isset( $duom['eilutes'] ) ? $duom['eilutes'] : array(), isset( $duom['placiai'] ) ? $duom['placiai'] : array() ) );
		}
		$z->close();

		$turinys = file_get_contents( $kelias );
		@unlink( $kelias );
		if ( $turinys === false ) { return false; }

		nocache_headers();
		header( 'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' );
		header( 'Content-Disposition: attachment; filename="' . $failas . '"' );
		header( 'Content-Length: ' . strlen( $turinys ) );
		echo $turinys;
		exit;
	}

	/* ==================== DUOMENU RINKIMAS ==================== */

	private static function ct( $c ) { return round( ( (int) $c ) / 100, 2 ); }

	public static function atsisiusti() {
		if ( ! current_user_can( self::CAP ) ) { wp_die( 'Neturite teisiu.' ); }
		check_admin_referer( self::VEIKSMAS );

		$nuo = sanitize_text_field( wp_unslash( $_GET['nuo'] ?? '' ) );
		$iki = sanitize_text_field( wp_unslash( $_GET['iki'] ?? '' ) );
		$d = '/^\d{4}-\d{2}-\d{2}$/';
		if ( ! preg_match( $d, $nuo ) || ! preg_match( $d, $iki ) ) {
			$iki = current_time( 'Y-m-d' );
			$nuo = gmdate( 'Y-m-d', strtotime( $iki . ' -29 day' ) );
		}
		$ekranas = sanitize_key( $_GET['ekranas'] ?? 'surenkami' );

		$lapai = ( $ekranas === 'paruosti' )
			? self::lapai_paruosti( $nuo, $iki )
			: self::lapai_surenkami( $nuo, $iki );

		self::xlsx( $lapai, 'petshop-' . $ekranas . '-' . $nuo . '_' . $iki . '.xlsx' );
	}

	/** Bendra antraste visiems lapams. */
	private static function galva( $tekstas, $nuo, $iki ) {
		return array(
			array( $tekstas ),
			array( 'Laikotarpis', $nuo . ' – ' . $iki ),
			array( 'Sugeneruota', current_time( 'Y-m-d H:i' ) ),
			array( '' ),
		);
	}

	/* ---------- SURENKAMI ---------- */

	private static function lapai_surenkami( $nuo, $iki ) {
		$eil = Petshop_Ataskaitu_Agregavimas::eilutes( $nuo, $iki, array( 'laukai', 'piltuvelis', 'pardavimai', 'parduotuve' ) );
		$dezes = Petshop_Rinkiniu_Ataskaita::dezes();

		/* --- 1. Suvestine --- */
		$kont = 0; $kont_suma = 0; $vaiku_suma = 0; $vaiku_sav = 0; $vaiku_vnt = 0;
		$be_sav_ct = 0; $be_sav = 0; $dov_sav = 0; $grazinta = 0;
		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'pardavimai' ) { continue; }
			if ( $e['tipas'] === 'parduota' ) {
				if ( (int) $e['preke_id'] === 0 ) { $kont += (int) $e['kiekis']; $kont_suma += (int) $e['suma_ct']; }
				else { $vaiku_vnt += (int) $e['kiekis']; $vaiku_suma += (int) $e['suma_ct']; $vaiku_sav += (int) $e['sav_ct']; }
			} elseif ( $e['tipas'] === 'be_sav_suma' ) { $be_sav_ct += (int) $e['suma_ct']; }
			elseif ( $e['tipas'] === 'be_savikainos' ) { $be_sav += (int) $e['kiekis']; }
			elseif ( $e['tipas'] === 'dovana' ) { $dov_sav += (int) $e['sav_ct']; }
			elseif ( $e['tipas'] === 'grazinta' ) { $grazinta += (int) $e['suma_ct']; }
		}
		$pajamos = $kont_suma + $grazinta;
		$su_sav  = max( 0, $vaiku_suma - $be_sav_ct );
		$be_pvm  = Petshop_Ataskaitu_UI::be_pvm( $su_sav );
		$pelnas  = (int) round( $be_pvm ) - $vaiku_sav - $dov_sav;

		$s = self::galva( 'PETSHOP — SURENKAMI RINKINIAI', $nuo, $iki );
		$s[] = array( array( 'v' => 'Rodiklis', 't' => 'h' ), array( 'v' => 'Reikšmė', 't' => 'h' ) );
		$s[] = array( 'Pajamos su PVM', array( 'v' => self::ct( $pajamos ), 't' => 'e' ) );
		$s[] = array( 'Pelnas', array( 'v' => self::ct( $pelnas ), 't' => 'e' ) );
		$s[] = array( 'Marža', array( 'v' => $be_pvm > 0 ? $pelnas / $be_pvm : null, 't' => 'p' ) );
		$s[] = array( 'Užsakymai su dėže', array( 'v' => $kont, 't' => 'n' ) );
		$s[] = array( 'Vid. čekis', array( 'v' => $kont > 0 ? self::ct( (int) round( $pajamos / $kont ) ) : null, 't' => 'e' ) );
		$s[] = array( 'Vid. dydis (vnt.)', array( 'v' => $kont > 0 ? round( $vaiku_vnt / $kont, 1 ) : null, 't' => 'n' ) );
		$s[] = array( 'Parduota vnt. viso', array( 'v' => $vaiku_vnt, 't' => 'n' ) );
		$s[] = array( 'Grąžinta', array( 'v' => self::ct( abs( $grazinta ) ), 't' => 'e' ) );
		$s[] = array( 'Dovanų savikaina', array( 'v' => self::ct( $dov_sav ), 't' => 'e' ) );
		$s[] = array( 'Eilutės be savikainos', array( 'v' => $be_sav, 't' => 'n' ) );
		$s[] = array( '' );
		$s[] = array( 'PASTABA: eilutės be savikainos į maržą neįskaičiuotos — tikras pelnas mažesnis.' );

		/* --- 2. Prekes --- */
		/* Mate/idejo — SESIJOMIS (kitaip „idejimo dalis" virsija 100 %, nes
		   `rodyta` fiksuojama karta per kortele, o `idejo` — kas paspaudima).
		   Idejimai ir isemimai vienetais laikomi atskirai. */
		$rodyta = array(); $idejo = array(); $idejo_vnt = array(); $iseme = array(); $prekes = array();
		foreach ( $eil as $e ) {
			$pid = (int) $e['preke_id'];
			if ( $e['sritis'] === 'laukai' && $pid ) {
				if ( $e['tipas'] === 'rodyta' ) { $rodyta[ $pid ] = ( $rodyta[ $pid ] ?? 0 ) + (int) $e['sesiju']; }
				elseif ( $e['tipas'] === 'idejo' ) {
					$idejo[ $pid ] = ( $idejo[ $pid ] ?? 0 ) + (int) $e['sesiju'];
					$idejo_vnt[ $pid ] = ( $idejo_vnt[ $pid ] ?? 0 ) + (int) $e['kiekis'];
				}
				elseif ( $e['tipas'] === 'iseme' ) { $iseme[ $pid ] = ( $iseme[ $pid ] ?? 0 ) + (int) $e['kiekis']; }
			}
			if ( $e['sritis'] === 'pardavimai' && $e['tipas'] === 'parduota' && $pid ) {
				if ( ! isset( $prekes[ $pid ] ) ) { $prekes[ $pid ] = array( 'vnt' => 0, 'suma' => 0, 'sav' => 0 ); }
				$prekes[ $pid ]['vnt']  += (int) $e['kiekis'];
				$prekes[ $pid ]['suma'] += (int) $e['suma_ct'];
				$prekes[ $pid ]['sav']  += (int) $e['sav_ct'];
			}
		}
		foreach ( array_keys( $rodyta + $idejo ) as $pid ) {
			if ( ! isset( $prekes[ $pid ] ) ) { $prekes[ $pid ] = array( 'vnt' => 0, 'suma' => 0, 'sav' => 0 ); }
		}
		$viso_suma = 0;
		foreach ( $prekes as $x ) { $viso_suma += $x['suma']; }

		$p = self::galva( 'PREKĖS DĖŽĖSE', $nuo, $iki );
		$p[] = array(
			array( 'v' => 'Prekės ID', 't' => 'h' ), array( 'v' => 'Prekė', 't' => 'h' ),
			array( 'v' => 'Matė (sesijos)', 't' => 'h' ), array( 'v' => 'Įsidėjo (sesijos)', 't' => 'h' ),
			array( 'v' => 'Įdėjimo dalis', 't' => 'h' ), array( 'v' => 'Įdėta vnt.', 't' => 'h' ),
			array( 'v' => 'Išimta', 't' => 'h' ),
			array( 'v' => 'Išėmimo rodiklis', 't' => 'h' ), array( 'v' => 'Parduota vnt.', 't' => 'h' ),
			array( 'v' => 'Pajamos', 't' => 'h' ), array( 'v' => 'Savikaina', 't' => 'h' ),
			array( 'v' => 'Pelnas', 't' => 'h' ), array( 'v' => 'Marža', 't' => 'h' ),
			array( 'v' => 'Dalis apyvartoje', 't' => 'h' ),
		);
		arsort( $prekes );
		foreach ( $prekes as $pid => $x ) {
			$r = $rodyta[ $pid ] ?? 0; $i = $idejo[ $pid ] ?? 0;
			$iv = $idejo_vnt[ $pid ] ?? 0; $is = $iseme[ $pid ] ?? 0;
			$bp = Petshop_Ataskaitu_UI::be_pvm( $x['suma'] );
			$pel = (int) round( $bp ) - $x['sav'];
			$p[] = array(
				array( 'v' => $pid, 't' => 'n' ),
				get_the_title( $pid ) ?: ( '#' . $pid ),
				array( 'v' => $r, 't' => 'n' ),
				array( 'v' => $i, 't' => 'n' ),
				array( 'v' => $r > 0 ? min( 1, $i / $r ) : null, 't' => 'p' ),
				array( 'v' => $iv, 't' => 'n' ),
				array( 'v' => $is, 't' => 'n' ),
				array( 'v' => $iv > 0 ? $is / $iv : null, 't' => 'p' ),
				array( 'v' => $x['vnt'], 't' => 'n' ),
				array( 'v' => self::ct( $x['suma'] ), 't' => 'e' ),
				array( 'v' => self::ct( $x['sav'] ), 't' => 'e' ),
				array( 'v' => self::ct( $pel ), 't' => 'e' ),
				array( 'v' => $bp > 0 ? $pel / $bp : null, 't' => 'p' ),
				array( 'v' => $viso_suma > 0 ? $x['suma'] / $viso_suma : null, 't' => 'p' ),
			);
		}

		/* --- 3. Rinkiniai ir dydziai --- */
		$g = array();
		foreach ( $eil as $e ) {
			$dz = (int) $e['deze_id'];
			if ( ! $dz || ! isset( $dezes[ $dz ] ) ) { continue; }
			$r = $dz . '|' . $e['dydis'];
			if ( ! isset( $g[ $r ] ) ) {
				$g[ $r ] = array( 'deze' => $dz, 'dydis' => $e['dydis'], 'atidare' => 0, 'nupirko' => 0,
					'parduota' => 0, 'vnt' => 0, 'suma' => 0, 'sav' => 0, 'be_sav' => 0, 'dov' => 0 );
			}
			$q =& $g[ $r ];
			if ( $e['sritis'] === 'piltuvelis' ) {
				if ( $e['tipas'] === 'atidare' ) { $q['atidare'] += (int) $e['sesiju']; }
				elseif ( $e['tipas'] === 'nupirko' ) { $q['nupirko'] += (int) $e['sesiju']; }
			} elseif ( $e['sritis'] === 'pardavimai' ) {
				if ( $e['tipas'] === 'parduota' ) {
					if ( (int) $e['preke_id'] === 0 ) { $q['parduota'] += (int) $e['kiekis']; $q['suma'] += (int) $e['suma_ct']; }
					else { $q['vnt'] += (int) $e['kiekis']; $q['sav'] += (int) $e['sav_ct']; }
				} elseif ( $e['tipas'] === 'be_sav_suma' ) { $q['be_sav'] += (int) $e['suma_ct']; }
				elseif ( $e['tipas'] === 'dovana' ) { $q['dov'] += (int) $e['sav_ct']; }
			}
			unset( $q );
		}
		$rd = self::galva( 'RINKINIAI IR DYDŽIAI', $nuo, $iki );
		$rd[] = array(
			array( 'v' => 'Dėžės ID', 't' => 'h' ), array( 'v' => 'Rinkinys', 't' => 'h' ),
			array( 'v' => 'Dydis', 't' => 'h' ), array( 'v' => 'Atidarė', 't' => 'h' ),
			array( 'v' => 'Nupirko', 't' => 'h' ), array( 'v' => 'Konversija', 't' => 'h' ),
			array( 'v' => 'Parduota', 't' => 'h' ), array( 'v' => 'Vid. dydis', 't' => 'h' ),
			array( 'v' => 'Pajamos', 't' => 'h' ), array( 'v' => 'Pelnas', 't' => 'h' ), array( 'v' => 'Marža', 't' => 'h' ),
		);
		foreach ( $g as $q ) {
			if ( ! $q['parduota'] && ! $q['atidare'] ) { continue; }
			$vs = 0;
			foreach ( $eil as $e ) {
				if ( $e['sritis'] === 'pardavimai' && $e['tipas'] === 'parduota' && (int) $e['deze_id'] === $q['deze']
					&& $e['dydis'] === $q['dydis'] && (int) $e['preke_id'] > 0 ) { $vs += (int) $e['suma_ct']; }
			}
			$bp = Petshop_Ataskaitu_UI::be_pvm( max( 0, $vs - $q['be_sav'] ) );
			$pel = (int) round( $bp ) - $q['sav'] - $q['dov'];
			$rd[] = array(
				array( 'v' => $q['deze'], 't' => 'n' ),
				$dezes[ $q['deze'] ] ?? ( '#' . $q['deze'] ),
				$q['dydis'] !== '' ? $q['dydis'] . ' g' : '',
				array( 'v' => $q['atidare'], 't' => 'n' ),
				array( 'v' => $q['nupirko'], 't' => 'n' ),
				array( 'v' => $q['atidare'] > 0 ? $q['nupirko'] / $q['atidare'] : null, 't' => 'p' ),
				array( 'v' => $q['parduota'], 't' => 'n' ),
				array( 'v' => $q['parduota'] > 0 ? round( $q['vnt'] / $q['parduota'], 1 ) : null, 't' => 'n' ),
				array( 'v' => self::ct( $q['suma'] ), 't' => 'e' ),
				array( 'v' => self::ct( $pel ), 't' => 'e' ),
				array( 'v' => $bp > 0 ? $pel / $bp : null, 't' => 'p' ),
			);
		}

		/* --- 4. Piltuvelis --- */
		$ses = function( $tipas ) use ( $eil ) {
			$s = 0;
			foreach ( $eil as $e ) { if ( $e['sritis'] === 'piltuvelis' && $e['tipas'] === $tipas ) { $s += (int) $e['sesiju']; } }
			return $s;
		};
		$zingsniai = array( 'Atidarė dėžę' => 'atidare', 'Prisidėjo bent vieną' => 'idejo',
			'Pasiekė minimumą' => 'min_pasiekta', 'Įsidėjo į krepšelį' => 'krepselis', 'Nupirko' => 'nupirko' );
		$pl = self::galva( 'PILTUVĖLIS (iš sutikusių su statistika)', $nuo, $iki );
		$pl[] = array( array( 'v' => 'Žingsnis', 't' => 'h' ), array( 'v' => 'Sesijos', 't' => 'h' ),
			array( 'v' => 'Perėjimas', 't' => 'h' ), array( 'v' => 'Nuo pradžios', 't' => 'h' ) );
		$pirmas = null; $ankstesnis = null;
		foreach ( $zingsniai as $pav => $tip ) {
			$v = $ses( $tip );
			if ( $pirmas === null ) { $pirmas = $v; }
			$pl[] = array( $pav, array( 'v' => $v, 't' => 'n' ),
				array( 'v' => ( $ankstesnis !== null && $ankstesnis > 0 ) ? $v / $ankstesnis : null, 't' => 'p' ),
				array( 'v' => $pirmas > 0 ? $v / $pirmas : null, 't' => 'p' ) );
			$ankstesnis = $v;
		}

		/* --- 5. Zali duomenys --- */
		$z = array( array(
			array( 'v' => 'Diena', 't' => 'h' ), array( 'v' => 'Sritis', 't' => 'h' ),
			array( 'v' => 'Tipas', 't' => 'h' ), array( 'v' => 'Dėžės ID', 't' => 'h' ),
			array( 'v' => 'Dėžė', 't' => 'h' ), array( 'v' => 'Prekės ID', 't' => 'h' ),
			array( 'v' => 'Prekė', 't' => 'h' ), array( 'v' => 'Dydis', 't' => 'h' ),
			array( 'v' => 'Skirtukas', 't' => 'h' ), array( 'v' => 'Įrenginys', 't' => 'h' ),
			array( 'v' => 'Kiekis', 't' => 'h' ), array( 'v' => 'Sesijos', 't' => 'h' ),
			array( 'v' => 'Suma EUR', 't' => 'h' ), array( 'v' => 'Savikaina EUR', 't' => 'h' ),
		) );
		foreach ( $eil as $e ) {
			$dz = (int) $e['deze_id']; $pid = (int) $e['preke_id'];
			$z[] = array(
				$e['diena'], $e['sritis'], $e['tipas'],
				array( 'v' => $dz ?: null, 't' => 'n' ), $dz ? ( $dezes[ $dz ] ?? get_the_title( $dz ) ) : '',
				array( 'v' => $pid ?: null, 't' => 'n' ), $pid ? get_the_title( $pid ) : '',
				$e['dydis'], $e['skirtukas'], $e['irenginys'],
				array( 'v' => (int) $e['kiekis'], 't' => 'n' ),
				array( 'v' => (int) $e['sesiju'], 't' => 'n' ),
				array( 'v' => self::ct( $e['suma_ct'] ), 't' => 'e' ),
				array( 'v' => self::ct( $e['sav_ct'] ), 't' => 'e' ),
			);
		}

		return array(
			'Suvestinė'   => array( 'eilutes' => $s,  'placiai' => array( 26, 16 ) ),
			'Prekės'      => array( 'eilutes' => $p,  'placiai' => array( 10, 46, 13, 15, 13, 11, 9, 15, 12, 12, 12, 12, 10, 14 ) ),
			'Rinkiniai'   => array( 'eilutes' => $rd, 'placiai' => array( 10, 34, 9, 10, 10, 12, 11, 11, 12, 12, 10 ) ),
			'Piltuvėlis'  => array( 'eilutes' => $pl, 'placiai' => array( 24, 10, 12, 14 ) ),
			'Žali duomenys' => array( 'eilutes' => $z, 'placiai' => array( 11, 12, 16, 10, 30, 10, 40, 8, 14, 10, 9, 9, 12, 13 ) ),
		);
	}

	/* ---------- PARUOSTI ---------- */

	private static function lapai_paruosti( $nuo, $iki ) {
		$eil = Petshop_Ataskaitu_Agregavimas::eilutes( $nuo, $iki, array( 'pardavimai', 'parduotuve' ) );
		$rink = Petshop_Paruostu_Ataskaita::rinkiniai();

		$m = array();
		foreach ( $eil as $e ) {
			if ( $e['sritis'] !== 'pardavimai' ) { continue; }
			$rid = (int) $e['deze_id'];
			if ( ! $rid || ! isset( $rink[ $rid ] ) ) { continue; }
			if ( ! isset( $m[ $rid ] ) ) { $m[ $rid ] = array( 'parduota' => 0, 'suma' => 0, 'sav' => 0, 'be_sav' => 0, 'pakopos' => array() ); }
			if ( $e['tipas'] === 'parduota' ) {
				if ( (int) $e['preke_id'] === 0 ) { $m[ $rid ]['parduota'] += (int) $e['kiekis']; $m[ $rid ]['suma'] += (int) $e['suma_ct']; }
				else { $m[ $rid ]['sav'] += (int) $e['sav_ct']; }
			} elseif ( $e['tipas'] === 'be_sav_suma' ) { $m[ $rid ]['be_sav'] += (int) $e['suma_ct']; }
			elseif ( $e['tipas'] === 'dp_pakopa' ) {
				$p = $e['dydis'];
				if ( ! isset( $m[ $rid ]['pakopos'][ $p ] ) ) { $m[ $rid ]['pakopos'][ $p ] = array( 'k' => 0, 's' => 0, 'sv' => 0 ); }
				$m[ $rid ]['pakopos'][ $p ]['k'] += (int) $e['kiekis'];
				$m[ $rid ]['pakopos'][ $p ]['s'] += (int) $e['suma_ct'];
				$m[ $rid ]['pakopos'][ $p ]['sv'] += (int) $e['sav_ct'];
			}
		}

		$r = self::galva( 'PETSHOP — RINKINIAI (paruošti ir DP pakai)', $nuo, $iki );
		$r[] = array(
			array( 'v' => 'ID', 't' => 'h' ), array( 'v' => 'Rinkinys', 't' => 'h' ),
			array( 'v' => 'Tipas', 't' => 'h' ), array( 'v' => 'Parduota', 't' => 'h' ),
			array( 'v' => 'Pajamos', 't' => 'h' ), array( 'v' => 'Savikaina', 't' => 'h' ),
			array( 'v' => 'Pelnas', 't' => 'h' ), array( 'v' => 'Marža', 't' => 'h' ),
		);
		foreach ( $m as $rid => $x ) {
			if ( ! $x['parduota'] ) { continue; }
			$bp = Petshop_Ataskaitu_UI::be_pvm( max( 0, $x['suma'] - $x['be_sav'] ) );
			$pel = (int) round( $bp ) - $x['sav'];
			$r[] = array(
				array( 'v' => $rid, 't' => 'n' ), $rink[ $rid ]['pav'],
				strtoupper( $rink[ $rid ]['tipas'] ),
				array( 'v' => $x['parduota'], 't' => 'n' ),
				array( 'v' => self::ct( $x['suma'] ), 't' => 'e' ),
				array( 'v' => self::ct( $x['sav'] ), 't' => 'e' ),
				array( 'v' => self::ct( $pel ), 't' => 'e' ),
				array( 'v' => $bp > 0 ? $pel / $bp : null, 't' => 'p' ),
			);
		}
		if ( count( $r ) === 5 ) { $r[] = array( 'Šiuo laikotarpiu paruoštų rinkinių ar DP pakų pardavimų nebuvo.' ); }

		$pk = self::galva( 'DP PAKOPOS', $nuo, $iki );
		$pk[] = array( array( 'v' => 'ID', 't' => 'h' ), array( 'v' => 'Pakas', 't' => 'h' ),
			array( 'v' => 'Pakopa', 't' => 'h' ), array( 'v' => 'Parduota', 't' => 'h' ),
			array( 'v' => 'Pajamos', 't' => 'h' ), array( 'v' => 'Marža', 't' => 'h' ) );
		foreach ( $m as $rid => $x ) {
			foreach ( $x['pakopos'] as $pav => $p ) {
				$bp = Petshop_Ataskaitu_UI::be_pvm( $p['s'] );
				$pk[] = array(
					array( 'v' => $rid, 't' => 'n' ), $rink[ $rid ]['pav'], strtoupper( $pav ),
					array( 'v' => $p['k'], 't' => 'n' ),
					array( 'v' => self::ct( $p['s'] ), 't' => 'e' ),
					array( 'v' => $bp > 0 ? ( $bp - $p['sv'] ) / $bp : null, 't' => 'p' ),
				);
			}
		}

		$z = array( array(
			array( 'v' => 'Diena', 't' => 'h' ), array( 'v' => 'Sritis', 't' => 'h' ), array( 'v' => 'Tipas', 't' => 'h' ),
			array( 'v' => 'Rinkinio ID', 't' => 'h' ), array( 'v' => 'Prekės ID', 't' => 'h' ),
			array( 'v' => 'Prekė', 't' => 'h' ), array( 'v' => 'Įrenginys', 't' => 'h' ),
			array( 'v' => 'Kiekis', 't' => 'h' ), array( 'v' => 'Suma EUR', 't' => 'h' ), array( 'v' => 'Savikaina EUR', 't' => 'h' ),
		) );
		foreach ( $eil as $e ) {
			$pid = (int) $e['preke_id'];
			$z[] = array(
				$e['diena'], $e['sritis'], $e['tipas'],
				array( 'v' => (int) $e['deze_id'] ?: null, 't' => 'n' ),
				array( 'v' => $pid ?: null, 't' => 'n' ), $pid ? get_the_title( $pid ) : '',
				$e['irenginys'],
				array( 'v' => (int) $e['kiekis'], 't' => 'n' ),
				array( 'v' => self::ct( $e['suma_ct'] ), 't' => 'e' ),
				array( 'v' => self::ct( $e['sav_ct'] ), 't' => 'e' ),
			);
		}

		return array(
			'Rinkiniai'     => array( 'eilutes' => $r,  'placiai' => array( 9, 44, 8, 11, 12, 12, 12, 10 ) ),
			'DP pakopos'    => array( 'eilutes' => $pk, 'placiai' => array( 9, 40, 11, 11, 12, 10 ) ),
			'Žali duomenys' => array( 'eilutes' => $z,  'placiai' => array( 11, 12, 14, 12, 10, 40, 10, 9, 12, 13 ) ),
		);
	}
}

add_action( 'plugins_loaded', function() {
	if ( class_exists( 'Petshop_Ataskaitu_UI' ) ) { Petshop_Ataskaitu_Eksportas::init(); }
}, 26 );
