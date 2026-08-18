<?php
/**
 * Plugin Name: Petshop Feeds
 * Description: XML feed'ai Kaina24, Kainos.lt ir Google Merchant Center
 * Version: 2.2.0
 * Author: Petshop.lt
 *
 * v2.2.0 (2026-08-18) — Google kategorijos (google_product_category).
 *   55 musu kategorijos susietos su oficialiu Google sarasu; savininkas
 *   patvirtino. Akciju skiltys nesumapintos samoningai — preke gauna
 *   kategorija is kitos savo kategorijos.
 *
 * v2.1.0 (2026-08-18) — administracija: varneles prekes kortelеje (Atsargos),
 *   stulpelis prekiu sarase ir masiniai veiksmai (isjungti/ijungti grupe).
 *
 * v2.0.2 (2026-08-18) — aprasymo valymo eiles tvarka (zr. ps_feeds_preke).
 *
 * v2.0.1 (2026-08-18) — generavimas perkeltas is 'init' i 'wp_loaded':
 *   ant 'init' wc_get_product() grazina false visoms prekems (rasta DRY G841).
 *
 * v2.0.0 (2026-08-18) — pilnas perrasymas.
 *
 *   KODEL: v1.0.0 kraudavo VISAS prekes i atminti vienu metu
 *   (posts_per_page => -1 + wc_get_product kiekvienai) ir mirdavo:
 *   "Allowed memory size of 268435456 bytes exhausted". Feed'ai buvo negyvi.
 *
 *   MODELIS: generuojama PAKETAIS i STATINI faila, endpoint'as tik atiduoda
 *   ta faila. Toks feed'as nemirs ir su 10 000 prekiu, nes atmintyje vienu
 *   metu bunа daugiausia 200 prekiu.
 *
 *   ISTAISYTA IS v1.0.0:
 *     1. Kategorija. Komentaras skelbe "paskutine (giliausia) kategorija", bet
 *        end() ima paskutini ABECELES tvarkos elementa. Dabar giliausia
 *        skaiciuojama per get_ancestors().
 *     2. EAN. Buvo imamas is _zb_ean/_ean; dabar is kanoninio
 *        _global_unique_id (sutvarkytas 2026-08-17, GTIN-13).
 *     3. <model> nera EAN. Gyvame petshop.lt feed'e <ean_code> ir <model> yra
 *        DU laukai: ean_code = EAN, model = gamintojo kodas. v1.0.0 EAN rase i
 *        <model> ir <ean_code> is viso neturejo.
 *     4. Rinkiniai. v1.0.0 ju neatfiltruodavo — butu patekе i feed'a.
 *     5. Nulinis likutis. Savininko sprendimas 2026-08-18: prekes be likucio
 *        i feed'us NESIUNCIAMOS (gyvame sename feed'e ju buvo 194 is 1 270).
 *
 *   PREKIU RIBOJIMAS (savininko prasymas 2026-08-18):
 *     _do_not_export        = 'yes'  -> niekur
 *     _ps_feed_off_kaina24  = 'yes'  -> tik i Kaina24 nesiunciama
 *     _ps_feed_off_kainos   = 'yes'  -> tik i Kainos.lt
 *     _ps_feed_off_google   = 'yes'  -> tik i Google
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PS_FEEDS_VERSIJA', '2.2.0' );
define( 'PS_FEEDS_PAKETAS', 200 );

/* =======================================================================
 * KANALAI
 * ===================================================================== */

function ps_feeds_kanalai(): array {
	return array(
		'kaina24' => array( 'failas' => 'kaina24.xml', 'meta' => '_ps_feed_off_kaina24' ),
		'kainos'  => array( 'failas' => 'kainos.xml',  'meta' => '_ps_feed_off_kainos' ),
		'google'  => array( 'failas' => 'google.xml',  'meta' => '_ps_feed_off_google' ),
	);
}

function ps_feeds_katalogas(): string {
	$up  = wp_upload_dir();
	$dir = trailingslashit( $up['basedir'] ) . 'petshop-feeds';
	if ( ! is_dir( $dir ) ) {
		wp_mkdir_p( $dir );
	}
	return $dir;
}

function ps_feeds_kelias( string $kanalas ): string {
	$k = ps_feeds_kanalai();
	return ps_feeds_katalogas() . '/' . $k[ $kanalas ]['failas'];
}

/* =======================================================================
 * DUOMENU SLUOKSNIS — vienodas visiems kanalams
 * ===================================================================== */

/**
 * Prekiu ID sarasas feed'ams.
 *
 * Filtrai: publish · ne pasleptos · ne rinkiniai · ne rinkiniu laukai ·
 * likutis instock · _do_not_export != yes.
 */
function ps_feeds_ids(): array {
	global $wpdb;
	$p = $wpdb->prefix;

	$sql = "SELECT p.ID FROM {$p}posts p
		WHERE p.post_type = 'product' AND p.post_status = 'publish'
		AND EXISTS (
			SELECT 1 FROM {$p}postmeta s
			WHERE s.post_id = p.ID AND s.meta_key = '_stock_status' AND s.meta_value = 'instock'
		)
		AND NOT EXISTS (
			SELECT 1 FROM {$p}postmeta d
			WHERE d.post_id = p.ID AND d.meta_key = '_do_not_export' AND d.meta_value = 'yes'
		)
		AND NOT EXISTS (
			SELECT 1 FROM {$p}postmeta l
			WHERE l.post_id = p.ID AND l.meta_key = '_ps_laukas' AND l.meta_value = 'yes'
		)
		AND NOT EXISTS (
			SELECT 1 FROM {$p}term_relationships tr
			JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
			JOIN {$p}terms t ON t.term_id = tt.term_id
			WHERE tr.object_id = p.ID AND tt.taxonomy = 'product_visibility'
			  AND t.slug = 'exclude-from-catalog'
		)
		AND NOT EXISTS (
			SELECT 1 FROM {$p}term_relationships tr2
			JOIN {$p}term_taxonomy tt2 ON tt2.term_taxonomy_id = tr2.term_taxonomy_id
			JOIN {$p}terms t2 ON t2.term_id = tt2.term_id
			WHERE tr2.object_id = p.ID AND tt2.taxonomy = 'product_type'
			  AND t2.slug IN ('mix-and-match','bundle','grouped','composite')
		)
		ORDER BY p.ID";

	return array_map( 'intval', $wpdb->get_col( $sql ) );
}

/**
 * Atributu zemelapis <spec> laukams.
 *
 * Kaireje — vardas, kuri mato palyginimo svetaine (sutampa su senuoju
 * petshop.lt feed'u, kur toks buvo). Desineje — musu taksonomija.
 */
function ps_feeds_spec_zemelapis(): array {
	return array(
		'Augintinio amžius'  => 'pa_amzius',
		'Ėdalo paskirtis'    => 'pa_paskirtis',
		'Veislės dydis'      => 'pa_veisles_dydis',
		'Šunų žaislai'       => 'pa_zaislo_tipas',
		'Gyvūno rūšis'       => 'pa_gyvuno_rusis',
		'Tipas'              => 'pa_tipas',
		'Baltymų šaltinis'   => 'pa_baltymu_saltinis',
		'Speciali mityba'    => 'pa_speciali_mityba',
		'Pakuotės dydis'     => 'pa_pakuotes_dydis',
	);
}

/**
 * Giliausia prekes kategorija.
 *
 * v1.0.0 naudojo end() — tai grazina paskutini ABECELES elementa, ne giliausia.
 */
function ps_feeds_giliausia_kategorija( int $id ) {
	$terms = get_the_terms( $id, 'product_cat' );
	if ( ! $terms || is_wp_error( $terms ) ) {
		return null;
	}
	$geriausias = null;
	$gylis      = -1;
	foreach ( $terms as $t ) {
		$g = count( get_ancestors( $t->term_id, 'product_cat' ) );
		if ( $g > $gylis ) {
			$gylis      = $g;
			$geriausias = $t;
		}
	}
	return $geriausias;
}

/**
 * Google kategoriju zemelapis: musu product_cat term_id => [Google ID, kelias].
 *
 * v2.2.0 (2026-08-18). ID paimti is oficialaus Google saraso
 * (taxonomy-with-ids.en-US.txt), NE is atminties. Savininkas peziurejo ir
 * patvirtino 2026-08-18. Padengia 2 435 is 2 440 prekiu.
 *
 * Nesumapintos SAMONINGAI: DAUGIAU=PIGIAU, DOVANOS, RINKINIAI, SPRENDIMAI —
 * tai akciju skiltys, ne prekiu tipai. Tokioms prekems kategorija imama is
 * kitos ju kategorijos (zr. ps_feeds_google_kategorija).
 */
function ps_feeds_google_zemelapis(): array {
	return array(
		70 => array( 5, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies' ),
		71 => array( 3530, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Food' ),
		72 => array( 3530, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Food' ),
		73 => array( 3530, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Food' ),
		75 => array( 6385, 'Animals & Pet Supplies > Pet Supplies > Pet Grooming Supplies > Pet Combs & Brushes' ),
		76 => array( 6406, 'Animals & Pet Supplies > Pet Supplies > Pet Grooming Supplies > Pet Shampoo & Conditioner' ),
		77 => array( 4, 'Animals & Pet Supplies > Pet Supplies > Cat Supplies' ),
		78 => array( 3367, 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Food' ),
		79 => array( 3367, 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Food' ),
		80 => array( 3367, 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Food' ),
		81 => array( 3367, 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Food' ),
		82 => array( 6383, 'Animals & Pet Supplies > Pet Supplies > Pet Grooming Supplies' ),
		83 => array( 3530, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Food' ),
		85 => array( 3530, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Food' ),
		86 => array( 3530, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Food' ),
		87 => array( 5013, 'Animals & Pet Supplies > Pet Supplies > Small Animal Supplies' ),
		88 => array( 5015, 'Animals & Pet Supplies > Pet Supplies > Small Animal Supplies > Small Animal Food' ),
		89 => array( 3, 'Animals & Pet Supplies > Pet Supplies > Bird Supplies' ),
		90 => array( 4990, 'Animals & Pet Supplies > Pet Supplies > Bird Supplies > Bird Food' ),
		93 => array( 6, 'Animals & Pet Supplies > Pet Supplies > Fish Supplies' ),
		94 => array( 5024, 'Animals & Pet Supplies > Pet Supplies > Fish Supplies > Fish Food' ),
		95 => array( 5011, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Treats' ),
		96 => array( 5002, 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Treats' ),
		97 => array( 7517, 'Animals & Pet Supplies > Pet Supplies > Small Animal Supplies > Small Animal Treats' ),
		98 => array( 4993, 'Animals & Pet Supplies > Pet Supplies > Bird Supplies > Bird Treats' ),
		100 => array( 5024, 'Animals & Pet Supplies > Pet Supplies > Fish Supplies > Fish Food' ),
		101 => array( 5086, 'Animals & Pet Supplies > Pet Supplies > Pet Medicine' ),
		102 => array( 5086, 'Animals & Pet Supplies > Pet Supplies > Pet Medicine' ),
		106 => array( 5000, 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Litter Boxes' ),
		107 => array( 4999, 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Litter' ),
		108 => array( 6248, 'Animals & Pet Supplies > Pet Supplies > Pet Flea & Tick Control' ),
		109 => array( 6248, 'Animals & Pet Supplies > Pet Supplies > Pet Flea & Tick Control' ),
		111 => array( 6252, 'Animals & Pet Supplies > Pet Supplies > Pet Bowls, Feeders & Waterers' ),
		112 => array( 6252, 'Animals & Pet Supplies > Pet Supplies > Pet Bowls, Feeders & Waterers' ),
		114 => array( 5001, 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Toys' ),
		115 => array( 5010, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Toys' ),
		116 => array( 6250, 'Animals & Pet Supplies > Pet Supplies > Pet Collars & Harnesses' ),
		117 => array( 6250, 'Animals & Pet Supplies > Pet Supplies > Pet Collars & Harnesses' ),
		121 => array( 6251, 'Animals & Pet Supplies > Pet Supplies > Pet Carriers & Crates' ),
		122 => array( 6251, 'Animals & Pet Supplies > Pet Supplies > Pet Carriers & Crates' ),
		123 => array( 6251, 'Animals & Pet Supplies > Pet Supplies > Pet Carriers & Crates' ),
		124 => array( 4997, 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Furniture' ),
		125 => array( 7274, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Kennels & Runs' ),
		130 => array( 6383, 'Animals & Pet Supplies > Pet Supplies > Pet Grooming Supplies' ),
		233 => array( 4434, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Beds' ),
		304 => array( 5017, 'Animals & Pet Supplies > Pet Supplies > Small Animal Supplies > Small Animal Habitats & Cages' ),
		305 => array( 5004, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Apparel' ),
		371 => array( 6, 'Animals & Pet Supplies > Pet Supplies > Fish Supplies' ),
		569 => array( 4433, 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Beds' ),
		639 => array( 6385, 'Animals & Pet Supplies > Pet Supplies > Pet Grooming Supplies > Pet Combs & Brushes' ),
		654 => array( 4434, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Beds' ),
		655 => array( 5, 'Animals & Pet Supplies > Pet Supplies > Dog Supplies' ),
		656 => array( 8068, 'Animals & Pet Supplies > Pet Supplies > Pet First Aid & Emergency Kits' ),
		657 => array( 5014, 'Animals & Pet Supplies > Pet Supplies > Small Animal Supplies > Small Animal Bedding' ),
		666 => array( 7385, 'Animals & Pet Supplies > Pet Supplies > Bird Supplies > Bird Cage Accessories' ),
	);
}

/**
 * Google kategorija prekei: einam per VISAS jos kategorijas nuo giliausios,
 * grazinam pirma, kuri turi atitikmeni. Taip akciju skiltyse esancios prekes
 * vis tiek gauna teisinga kategorija.
 */
function ps_feeds_google_kategorija( int $id ) {
	$z = ps_feeds_google_zemelapis();
	$terms = get_the_terms( $id, 'product_cat' );
	if ( ! $terms || is_wp_error( $terms ) ) {
		return null;
	}
	$rikiuota = array();
	foreach ( $terms as $t ) {
		$rikiuota[] = array( count( get_ancestors( $t->term_id, 'product_cat' ) ), $t->term_id );
	}
	usort( $rikiuota, function ( $a, $b ) { return $b[0] <=> $a[0]; } );

	foreach ( $rikiuota as $r ) {
		if ( isset( $z[ $r[1] ] ) ) {
			return $z[ $r[1] ];
		}
		/* jei pati kategorija nesumapinta — bandom jos tevus */
		foreach ( get_ancestors( $r[1], 'product_cat' ) as $a ) {
			if ( isset( $z[ $a ] ) ) {
				return $z[ $a ];
			}
		}
	}
	return null;
}

/**
 * Vienos prekes duomenys. Grazina null, jei preke netinkama.
 */
function ps_feeds_preke( int $id ) {
	$pr = wc_get_product( $id );
	if ( ! $pr ) {
		return null;
	}

	$kaina = $pr->get_price();
	if ( '' === $kaina || null === $kaina || (float) $kaina <= 0 ) {
		return null;
	}

	// Aprasymas: svarus tekstas (savininko sprendimas 2026-08-18).
	$apr = $pr->get_description();
	if ( '' === trim( (string) $apr ) ) {
		$apr = $pr->get_short_description();
	}
	// EILES TVARKA SVARBI (G842): bazeje aprasymai laikomi su UZKODUOTOMIS
	// zymomis (&lt;p&gt;). Jei pirma nuvalytum zymas, o paskui dekoduotum
	// esybes — jos atsiverstu atgal i HTML. Todel: dekoduojam, valom, ir tik
	// tada tvarkom likusias esybes (&nbsp; ir pan.).
	$apr = html_entity_decode( (string) $apr, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
	$apr = wp_strip_all_tags( $apr );
	$apr = html_entity_decode( $apr, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
	$apr = str_replace( "\xc2\xa0", ' ', $apr ); // nedalomas tarpas
	$apr = trim( preg_replace( '/\s+/u', ' ', $apr ) );
	if ( function_exists( 'mb_substr' ) && mb_strlen( $apr ) > 5000 ) {
		$apr = mb_substr( $apr, 0, 5000 );
	}

	$img_id  = $pr->get_image_id();
	$pilna   = $img_id ? wp_get_attachment_image_url( $img_id, 'full' ) : '';
	$maza    = $img_id ? wp_get_attachment_image_url( $img_id, 'woocommerce_thumbnail' ) : '';

	$galerija = array();
	foreach ( array_slice( (array) $pr->get_gallery_image_ids(), 0, 5 ) as $gid ) {
		$u = wp_get_attachment_image_url( $gid, 'full' );
		if ( $u ) {
			$galerija[] = $u;
		}
	}

	$brendas = '';
	$bt      = get_the_terms( $id, 'product_brand' );
	if ( $bt && ! is_wp_error( $bt ) ) {
		$brendas = $bt[0]->name;
	}

	$gamintojas = (string) get_post_meta( $id, '_legacy_manufacturer', true );

	$kat = ps_feeds_giliausia_kategorija( $id );

	$specs = array();
	if ( $gamintojas ) {
		$specs['Gamintojas'] = $gamintojas;
	}
	if ( $brendas ) {
		$specs['Prekės ženklas'] = $brendas;
	}
	foreach ( ps_feeds_spec_zemelapis() as $etikete => $taksonomija ) {
		$tt = get_the_terms( $id, $taksonomija );
		if ( $tt && ! is_wp_error( $tt ) ) {
			$specs[ $etikete ] = implode( ', ', wp_list_pluck( $tt, 'name' ) );
		}
	}

	$likutis = $pr->get_stock_quantity();
	if ( null === $likutis ) {
		$likutis = 1; // valdymas isjungtas, bet statusas instock
	}

	return array(
		'id'          => $id,
		'sku'         => (string) $pr->get_sku(),
		'gtin'        => (string) get_post_meta( $id, '_global_unique_id', true ),
		'pavadinimas' => $pr->get_name(),
		'aprasymas'   => $apr,
		'kaina'       => number_format( (float) $kaina, 2, '.', '' ),
		'likutis'     => max( 0, (int) $likutis ),
		'brendas'     => $brendas,
		'gamintojas'  => $gamintojas,
		'nuoroda'     => get_permalink( $id ),
		'img_pilna'   => (string) $pilna,
		'img_maza'    => (string) $maza,
		'galerija'    => $galerija,
		'kat_id'      => $kat ? (int) $kat->term_id : 0,
		'kat_vardas'  => $kat ? $kat->name : '',
		'kat_nuoroda' => $kat ? get_term_link( $kat ) : '',
		'svoris'      => (string) $pr->get_weight(),
		'specs'       => $specs,
		'g_kat'       => ps_feeds_google_kategorija( $id ),
	);
}

/* =======================================================================
 * RASYTOJAI
 * ===================================================================== */

function ps_feeds_cdata( $t ): string {
	// ]]> viduje sulaužytu CDATA bloka
	return '<![CDATA[' . str_replace( ']]>', ']]&gt;', (string) $t ) . ']]>';
}

function ps_feeds_kaina24_galva(): string {
	return '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<products>' . "\n";
}

function ps_feeds_kaina24_koja(): string {
	return '</products>' . "\n";
}

function ps_feeds_kaina24_eilute( array $p ): string {
	$x  = '  <product id="' . (int) $p['id'] . '">' . "\n";
	$x .= '    <title>' . ps_feeds_cdata( $p['pavadinimas'] ) . '</title>' . "\n";
	$x .= '    <description>' . ps_feeds_cdata( $p['aprasymas'] ) . '</description>' . "\n";
	$x .= '    <price>' . $p['kaina'] . '</price>' . "\n";
	$x .= '    <condition>new</condition>' . "\n";
	$x .= '    <stock>' . $p['likutis'] . '</stock>' . "\n";

	if ( $p['gtin'] ) {
		$x .= '    <ean_code>' . esc_html( $p['gtin'] ) . '</ean_code>' . "\n";
	}
	if ( $p['gamintojas'] || $p['brendas'] ) {
		$x .= '    <manufacturer>' . ps_feeds_cdata( $p['gamintojas'] ?: $p['brendas'] ) . '</manufacturer>' . "\n";
	}
	if ( $p['sku'] ) {
		$x .= '    <model>' . ps_feeds_cdata( $p['sku'] ) . '</model>' . "\n";
	}
	if ( $p['img_pilna'] ) {
		$x .= '    <image_url>' . ps_feeds_cdata( $p['img_pilna'] ) . '</image_url>' . "\n";
	}

	if ( $p['galerija'] ) {
		$x .= '    <additional_images>' . "\n";
		foreach ( $p['galerija'] as $g ) {
			$x .= '      <image>' . ps_feeds_cdata( $g ) . '</image>' . "\n";
		}
		$x .= '    </additional_images>' . "\n";
	} else {
		$x .= '    <additional_images/>' . "\n";
	}

	$x .= '    <product_url>' . ps_feeds_cdata( $p['nuoroda'] ) . '</product_url>' . "\n";
	$x .= '    <purchase_url>' . ps_feeds_cdata( $p['nuoroda'] ) . '</purchase_url>' . "\n";

	if ( $p['kat_id'] ) {
		$x .= '    <category_id>' . $p['kat_id'] . '</category_id>' . "\n";
		$x .= '    <category_name>' . ps_feeds_cdata( $p['kat_vardas'] ) . '</category_name>' . "\n";
		$x .= '    <category_link>' . ps_feeds_cdata( $p['kat_nuoroda'] ) . '</category_link>' . "\n";
	}

	if ( $p['specs'] ) {
		$x .= '    <specs>' . "\n";
		foreach ( $p['specs'] as $vardas => $reiksme ) {
			$x .= '      <spec name="' . esc_attr( $vardas ) . '">' . ps_feeds_cdata( $reiksme ) . '</spec>' . "\n";
		}
		$x .= '    </specs>' . "\n";
	}

	return $x . '  </product>' . "\n";
}

function ps_feeds_kainos_galva(): string {
	return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
		. '<product_feed xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="0.4" timestamp="' . time() . '">' . "\n"
		. '  <products>' . "\n";
}

function ps_feeds_kainos_koja(): string {
	return '  </products>' . "\n" . '</product_feed>' . "\n";
}

function ps_feeds_kainos_eilute( array $p ): string {
	$x  = '    <product id="' . (int) $p['id'] . '">' . "\n";
	$x .= '      <title>' . ps_feeds_cdata( $p['pavadinimas'] ) . '</title>' . "\n";
	$x .= '      <description>' . ps_feeds_cdata( $p['aprasymas'] ) . '</description>' . "\n";
	$x .= '      <item_price>' . $p['kaina'] . '</item_price>' . "\n";
	$x .= '      <stock>' . $p['likutis'] . '</stock>' . "\n";

	if ( $p['gtin'] ) {
		$x .= '      <ean_code>' . esc_html( $p['gtin'] ) . '</ean_code>' . "\n";
	}
	if ( $p['gamintojas'] || $p['brendas'] ) {
		$x .= '      <manufacturer>' . ps_feeds_cdata( $p['gamintojas'] ?: $p['brendas'] ) . '</manufacturer>' . "\n";
	}

	// Kainos.lt sename feed'e naudojo 200x200 miniatiura
	$img = $p['img_maza'] ?: $p['img_pilna'];
	if ( $img ) {
		$x .= '      <image_url>' . ps_feeds_cdata( $img ) . '</image_url>' . "\n";
	}

	$x .= '      <product_url>' . esc_url( $p['nuoroda'] ) . '</product_url>' . "\n";
	$x .= '      <purchase_url>' . esc_url( $p['nuoroda'] ) . '</purchase_url>' . "\n";

	if ( $p['kat_vardas'] ) {
		$x .= '      <categories>' . "\n";
		$x .= '        <category>' . ps_feeds_cdata( $p['kat_vardas'] ) . '</category>' . "\n";
		$x .= '      </categories>' . "\n";
	}

	if ( $p['specs'] ) {
		$x .= '      <specs>' . "\n";
		foreach ( $p['specs'] as $vardas => $reiksme ) {
			$x .= '        <spec name="' . esc_attr( $vardas ) . '" label="' . esc_attr( $vardas ) . '">'
				. ps_feeds_cdata( $reiksme ) . '</spec>' . "\n";
		}
		$x .= '      </specs>' . "\n";
	}

	return $x . '    </product>' . "\n";
}

function ps_feeds_google_galva(): string {
	return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
		. '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">' . "\n"
		. '  <channel>' . "\n"
		. '    <title>' . ps_feeds_cdata( get_bloginfo( 'name' ) ) . '</title>' . "\n"
		. '    <link>' . esc_url( home_url( '/' ) ) . '</link>' . "\n"
		. '    <description>' . ps_feeds_cdata( get_bloginfo( 'description' ) ) . '</description>' . "\n";
}

function ps_feeds_google_koja(): string {
	return '  </channel>' . "\n" . '</rss>' . "\n";
}

function ps_feeds_google_eilute( array $p ): string {
	$x  = '    <item>' . "\n";
	$x .= '      <g:id>' . esc_html( $p['sku'] ?: (string) $p['id'] ) . '</g:id>' . "\n";
	$x .= '      <title>' . ps_feeds_cdata( $p['pavadinimas'] ) . '</title>' . "\n";
	$x .= '      <description>' . ps_feeds_cdata( $p['aprasymas'] ) . '</description>' . "\n";
	$x .= '      <link>' . esc_url( $p['nuoroda'] ) . '</link>' . "\n";

	if ( $p['img_pilna'] ) {
		$x .= '      <g:image_link>' . esc_url( $p['img_pilna'] ) . '</g:image_link>' . "\n";
	}
	foreach ( $p['galerija'] as $g ) {
		$x .= '      <g:additional_image_link>' . esc_url( $g ) . '</g:additional_image_link>' . "\n";
	}

	$x .= '      <g:availability>in_stock</g:availability>' . "\n";
	$x .= '      <g:condition>new</g:condition>' . "\n";
	$x .= '      <g:price>' . $p['kaina'] . ' EUR</g:price>' . "\n";

	if ( $p['brendas'] ) {
		$x .= '      <g:brand>' . ps_feeds_cdata( $p['brendas'] ) . '</g:brand>' . "\n";
	}

	// GTIN yra — siunciam ji. Nera — brand + mpn, ir sakom Google, kad kodo nera.
	if ( $p['gtin'] ) {
		$x .= '      <g:gtin>' . esc_html( $p['gtin'] ) . '</g:gtin>' . "\n";
		if ( $p['sku'] ) {
			$x .= '      <g:mpn>' . esc_html( $p['sku'] ) . '</g:mpn>' . "\n";
		}
	} else {
		if ( $p['sku'] ) {
			$x .= '      <g:mpn>' . esc_html( $p['sku'] ) . '</g:mpn>' . "\n";
		}
		$x .= '      <g:identifier_exists>no</g:identifier_exists>' . "\n";
	}

	if ( ! empty( $p['g_kat'] ) ) {
		$x .= '      <g:google_product_category>' . (int) $p['g_kat'][0] . '</g:google_product_category>' . "\n";
	}
	if ( $p['kat_vardas'] ) {
		$x .= '      <g:product_type>' . ps_feeds_cdata( $p['kat_vardas'] ) . '</g:product_type>' . "\n";
	}
	if ( $p['svoris'] ) {
		$x .= '      <g:shipping_weight>' . esc_html( $p['svoris'] ) . ' kg</g:shipping_weight>' . "\n";
	}

	return $x . '    </item>' . "\n";
}

/* =======================================================================
 * GENERATORIUS
 * ===================================================================== */

/**
 * @param array $kanalai Kanalu raktai arba tuscias = visi.
 * @param bool  $dry     true = niekas nerasoma i galutini faila, tik skaiciai.
 */
function ps_feeds_generuoti( array $kanalai = array(), bool $dry = false ): array {
	@set_time_limit( 900 );
	global $wpdb;

	$visi = ps_feeds_kanalai();
	if ( ! $kanalai ) {
		$kanalai = array_keys( $visi );
	}
	$kanalai = array_values( array_intersect( $kanalai, array_keys( $visi ) ) );

	$pradzia = microtime( true );
	$ids     = ps_feeds_ids();
	$st      = array(
		'versija'      => PS_FEEDS_VERSIJA,
		'dry'          => $dry ? 1 : 0,
		'kandidatu'    => count( $ids ),
		'kanalai'      => array(),
		'praleista'    => array( 'nera_kainos' => 0, 'nera_objekto' => 0 ),
		'pvz'          => array(),
	);

	$fh = array();
	foreach ( $kanalai as $k ) {
		$laik = ps_feeds_kelias( $k ) . '.tmp';
		$fh[ $k ] = fopen( $laik, 'w' );
		if ( ! $fh[ $k ] ) {
			$st['klaida'] = 'nepavyko atidaryti ' . $laik;
			return $st;
		}
		fwrite( $fh[ $k ], call_user_func( 'ps_feeds_' . $k . '_galva' ) );
		$st['kanalai'][ $k ] = array( 'irasyta' => 0, 'praleista_isjungta' => 0, 'be_gtin' => 0 );
	}

	foreach ( array_chunk( $ids, PS_FEEDS_PAKETAS ) as $paketas ) {
		foreach ( $paketas as $id ) {
			$pr_obj = wc_get_product( (int) $id );
			if ( ! $pr_obj ) {
				$st['praleista']['nera_objekto']++;
				continue;
			}
			$p = ps_feeds_preke( (int) $id );
			if ( null === $p ) {
				$st['praleista']['nera_kainos']++;
				continue;
			}
			foreach ( $kanalai as $k ) {
				if ( 'yes' === get_post_meta( $id, $visi[ $k ]['meta'], true ) ) {
					$st['kanalai'][ $k ]['praleista_isjungta']++;
					continue;
				}
				if ( ! $p['gtin'] ) {
					$st['kanalai'][ $k ]['be_gtin']++;
				}
				$eil = call_user_func( 'ps_feeds_' . $k . '_eilute', $p );
				fwrite( $fh[ $k ], $eil );
				$st['kanalai'][ $k ]['irasyta']++;
				if ( count( $st['pvz'] ) < 3 && 'kaina24' === $k ) {
					$st['pvz'][] = $eil;
				}
			}
		}
		// Atminties higiena tarp paketu — be sito v1.0.0 ir mirdavo.
		wp_cache_flush();
		$wpdb->queries = array();
	}

	foreach ( $kanalai as $k ) {
		fwrite( $fh[ $k ], call_user_func( 'ps_feeds_' . $k . '_koja' ) );
		fclose( $fh[ $k ] );
		$laik = ps_feeds_kelias( $k ) . '.tmp';
		$st['kanalai'][ $k ]['baitai'] = file_exists( $laik ) ? filesize( $laik ) : 0;
		if ( $dry ) {
			@unlink( $laik );
		} else {
			@rename( $laik, ps_feeds_kelias( $k ) ); // atominis pakeitimas
		}
	}

	$st['sekundes']    = round( microtime( true ) - $pradzia, 1 );
	$st['atmintis_mb'] = round( memory_get_peak_usage( true ) / 1048576, 1 );

	if ( ! $dry ) {
		update_option( 'ps_feeds_paskutinis', array( 'kada' => current_time( 'mysql' ), 'statistika' => $st ), false );
	}

	return $st;
}

/* =======================================================================
 * CRON
 * ===================================================================== */

add_action( 'ps_feeds_naktinis', function () {
	if ( ! function_exists( 'wc_get_product' ) ) {
		return; // WooCommerce neaktyvus — tyliai praleidziam
	}
	ps_feeds_generuoti();
} );

add_action( 'init', function () {
	if ( ! wp_next_scheduled( 'ps_feeds_naktinis' ) ) {
		// 04:30 vietos laiku — po 04:00 backup'o, pries darbo diena
		$kada = strtotime( 'tomorrow 04:30', current_time( 'timestamp' ) ) - ( (int) get_option( 'gmt_offset' ) * HOUR_IN_SECONDS );
		wp_schedule_event( $kada, 'daily', 'ps_feeds_naktinis' );
	}
} );

/* =======================================================================
 * ENDPOINT'AI — atiduoda statini faila
 * ===================================================================== */

add_action( 'init', function () {
	add_rewrite_rule( '^feed/kaina24/?$', 'index.php?petshop_feed=kaina24', 'top' );
	add_rewrite_rule( '^feed/kainos/?$',  'index.php?petshop_feed=kainos',  'top' );
	add_rewrite_rule( '^feed/google/?$',  'index.php?petshop_feed=google',  'top' );
} );

add_filter( 'query_vars', function ( $vars ) {
	$vars[] = 'petshop_feed';
	return $vars;
} );

add_action( 'template_redirect', function () {
	$kanalas = get_query_var( 'petshop_feed' );
	if ( ! $kanalas || ! isset( ps_feeds_kanalai()[ $kanalas ] ) ) {
		return;
	}

	$failas = ps_feeds_kelias( $kanalas );
	if ( ! file_exists( $failas ) ) {
		status_header( 503 );
		header( 'Retry-After: 3600' );
		header( 'Content-Type: text/plain; charset=utf-8' );
		echo 'Feed dar nesugeneruotas.';
		exit;
	}

	header( 'Content-Type: application/xml; charset=utf-8' );
	header( 'Content-Length: ' . filesize( $failas ) );
	header( 'X-Petshop-Feed-Generated: ' . gmdate( 'c', filemtime( $failas ) ) );
	readfile( $failas );
	exit;
} );

/* =======================================================================
 * RANKINIS PALEIDIMAS
 * ===================================================================== */

function ps_feeds_raktas(): string {
	$r = get_option( 'ps_feeds_raktas' );
	if ( ! $r ) {
		$r = wp_generate_password( 24, false );
		update_option( 'ps_feeds_raktas', $r, false );
	}
	return $r;
}

// Svarbu: 'wp_loaded', ne 'init'. Ant 'init' WooCommerce duomenu saugyklos dar
// nera paruostos ir wc_get_product() grazina false VISOMS prekems (G841).
add_action( 'wp_loaded', function () {
	if ( empty( $_GET['ps_feeds_generuoti'] ) ) {
		return;
	}
	if ( ! hash_equals( ps_feeds_raktas(), (string) $_GET['ps_feeds_generuoti'] ) ) {
		return;
	}

	$kanalai = isset( $_GET['kanalai'] ) && 'all' !== $_GET['kanalai']
		? array_map( 'sanitize_key', explode( ',', (string) $_GET['kanalai'] ) )
		: array();
	$dry = ! empty( $_GET['dry'] );

	$st = ps_feeds_generuoti( $kanalai, $dry );

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $st );
	exit;
} );

/* =======================================================================
 * ADMINISTRACIJA — varneles kortelėje, stulpelis sąraše, masiniai veiksmai
 * ===================================================================== */

/**
 * Varneles prekes kortelеje: Prekes duomenys -> Atsargos.
 */
add_action( 'woocommerce_product_options_inventory_product_data', function () {
	echo '<div class="options_group ps-feeds-blokas">';
	echo '<p class="form-field"><strong>' . esc_html__( 'Feed\'ai (palyginimo svetainės)', 'petshop' ) . '</strong><br>'
		. '<span class="description">' . esc_html__( 'Pažymėk, kur šios prekės NERODYTI. Nepažymėta = siunčiama visur.', 'petshop' ) . '</span></p>';

	woocommerce_wp_checkbox( array(
		'id'          => '_ps_feed_off_kaina24',
		'label'       => __( 'Nerodyti Kaina24', 'petshop' ),
		'description' => __( 'Prekė nebus siunčiama į Kaina24 feed\'ą', 'petshop' ),
	) );
	woocommerce_wp_checkbox( array(
		'id'          => '_ps_feed_off_kainos',
		'label'       => __( 'Nerodyti Kainos.lt', 'petshop' ),
		'description' => __( 'Prekė nebus siunčiama į Kainos.lt feed\'ą', 'petshop' ),
	) );
	woocommerce_wp_checkbox( array(
		'id'          => '_ps_feed_off_google',
		'label'       => __( 'Nerodyti Google', 'petshop' ),
		'description' => __( 'Prekė nebus siunčiama į Google Merchant Center', 'petshop' ),
	) );

	$id = get_the_ID();
	if ( $id && 'yes' === get_post_meta( $id, '_do_not_export', true ) ) {
		echo '<p class="form-field"><em>' . esc_html__( 'Dėmesio: nustatytas _do_not_export — prekė nesiunčiama NIEKUR.', 'petshop' ) . '</em></p>';
	}
	echo '</div>';
} );

add_action( 'woocommerce_process_product_meta', function ( $post_id ) {
	foreach ( ps_feeds_kanalai() as $k => $cfg ) {
		$laukas = $cfg['meta'];
		if ( isset( $_POST[ $laukas ] ) && 'yes' === $_POST[ $laukas ] ) {
			update_post_meta( $post_id, $laukas, 'yes' );
		} else {
			delete_post_meta( $post_id, $laukas );
		}
	}
} );

/**
 * Stulpelis prekiu saraso lenteleje.
 */
add_filter( 'manage_product_posts_columns', function ( $stulpeliai ) {
	$nauji = array();
	foreach ( $stulpeliai as $raktas => $vardas ) {
		$nauji[ $raktas ] = $vardas;
		if ( 'is_in_stock' === $raktas ) {
			$nauji['ps_feeds'] = __( 'Feed\'ai', 'petshop' );
		}
	}
	if ( ! isset( $nauji['ps_feeds'] ) ) {
		$nauji['ps_feeds'] = __( 'Feed\'ai', 'petshop' );
	}
	return $nauji;
} );

add_action( 'manage_product_posts_custom_column', function ( $stulpelis, $post_id ) {
	if ( 'ps_feeds' !== $stulpelis ) {
		return;
	}
	if ( 'yes' === get_post_meta( $post_id, '_do_not_export', true ) ) {
		echo '<span style="color:#b32d2e" title="_do_not_export">niekur</span>';
		return;
	}
	$isjungti = array();
	$vardai   = array( 'kaina24' => 'K24', 'kainos' => 'Kainos', 'google' => 'Google' );
	foreach ( ps_feeds_kanalai() as $k => $cfg ) {
		if ( 'yes' === get_post_meta( $post_id, $cfg['meta'], true ) ) {
			$isjungti[] = $vardai[ $k ];
		}
	}
	if ( ! $isjungti ) {
		echo '<span style="color:#2271b1" title="siunciama i visus">visur</span>';
	} else {
		echo '<span style="color:#b32d2e">be: ' . esc_html( implode( ', ', $isjungti ) ) . '</span>';
	}
}, 10, 2 );

/**
 * Masiniai veiksmai prekiu sarase.
 */
add_filter( 'bulk_actions-edit-product', function ( $veiksmai ) {
	$veiksmai['ps_feeds_off_all']     = __( 'Feed\'ai: išjungti iš visų', 'petshop' );
	$veiksmai['ps_feeds_on_all']      = __( 'Feed\'ai: įjungti į visus', 'petshop' );
	$veiksmai['ps_feeds_off_kaina24'] = __( 'Feed\'ai: išjungti iš Kaina24', 'petshop' );
	$veiksmai['ps_feeds_off_kainos']  = __( 'Feed\'ai: išjungti iš Kainos.lt', 'petshop' );
	$veiksmai['ps_feeds_off_google']  = __( 'Feed\'ai: išjungti iš Google', 'petshop' );
	return $veiksmai;
} );

add_filter( 'handle_bulk_actions-edit-product', function ( $nuoroda, $veiksmas, $ids ) {
	if ( 0 !== strpos( $veiksmas, 'ps_feeds_' ) ) {
		return $nuoroda;
	}
	$kanalai = ps_feeds_kanalai();
	$n       = 0;

	foreach ( $ids as $id ) {
		$id = (int) $id;
		if ( 'ps_feeds_off_all' === $veiksmas ) {
			foreach ( $kanalai as $cfg ) {
				update_post_meta( $id, $cfg['meta'], 'yes' );
			}
			$n++;
		} elseif ( 'ps_feeds_on_all' === $veiksmas ) {
			foreach ( $kanalai as $cfg ) {
				delete_post_meta( $id, $cfg['meta'] );
			}
			$n++;
		} else {
			$kanalas = str_replace( 'ps_feeds_off_', '', $veiksmas );
			if ( isset( $kanalai[ $kanalas ] ) ) {
				update_post_meta( $id, $kanalai[ $kanalas ]['meta'], 'yes' );
				$n++;
			}
		}
	}

	return add_query_arg( array( 'ps_feeds_pakeista' => $n ), $nuoroda );
}, 10, 3 );

add_action( 'admin_notices', function () {
	if ( empty( $_GET['ps_feeds_pakeista'] ) ) {
		return;
	}
	$n = (int) $_GET['ps_feeds_pakeista'];
	echo '<div class="notice notice-success is-dismissible"><p>'
		. esc_html( sprintf( 'Feed\'ų nustatymai pakeisti: %d prekės. Pakeitimai atsiras po naktinio generavimo (04:30).', $n ) )
		. '</p></div>';
} );

/* =======================================================================
 * AKTYVAVIMAS
 * ===================================================================== */

register_activation_hook( __FILE__, function () {
	flush_rewrite_rules();
} );

register_deactivation_hook( __FILE__, function () {
	wp_clear_scheduled_hook( 'ps_feeds_naktinis' );
	flush_rewrite_rules();
} );
