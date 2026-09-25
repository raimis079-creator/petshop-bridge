<?php
/**
 * Plugin Name: Petshop paieška v1.1.1 (S1699 → S1720)
 * Description: Svetainės paieškos tolerancija. v1.0 (S1699, 2026-09-20): sinonimai/rašybos klaidos, kamienai, SKU/ID.
 *   v1.1 (S1720, 2026-09-25, planas 2.15): (4) EN→LT žodžių vertimas (pork→kiaulien, kitten→kačiuk, sterilised→sterilizuot, dog→šun…);
 *   (5) nežinomų žodžių atmetimas — jei žodis neatitinka nė vienos publikuotos prekės, o kiti atitinka, jis praleidžiamas
 *       („hill's kitten“ → kačiukų maistas; „oazy chicken adult sterilised“ → sterilizuotoms katėms su vištiena) ir virš rezultatų
 *       parodoma pastaba; (6) nulinių rezultatų puslapis vietoj „Produktų nerasta.“: brendo, kurio neturim, alternatyvos,
 *       kategorijų nuorodos, populiarios paieškos, kontaktas; (7) kategorijų/gamintojų juosta virš rezultatų.
 *   Veikia frontend produktų paieškai (WC /?s=&post_type=product ir Flatsome live search) per posts_search; admin neliečiamas.
 *   Išjungti visą: opcija ps_paieska_isjungta = 1. Paslėptų dropship prekių blokas nulinių puslapyje: opcija ps_paieska_pasleptos = 1 (numatyta 0, R sprendimas).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

final class Petshop_Paieska {
	const SINONIMAI = array(
		'jesera' => 'josera', 'jassera' => 'josera', 'jorsera' => 'josera', 'josena' => 'josera', 'joseta' => 'josera', 'jozera' => 'josera',
		'eucanuba' => 'eukanuba', 'eukanuva' => 'eukanuba', 'eukanupa' => 'eukanuba',
		'expulsion' => 'exclusion', 'exclusive' => 'exclusion', 'exlusion' => 'exclusion', 'exclusion hypoalergenic' => 'exclusion hypoallergenic', 'ekskliužion' => 'exclusion', 'ekskluzion' => 'exclusion',
		'royal canine' => 'royal canin', 'royalcanin' => 'royal canin', 'royal cani' => 'royal canin', 'rojal kanin' => 'royal canin',
		'anikonds' => 'animonda', 'animonda vom feinstein' => 'animonda vom feinsten', 'vom feinstein' => 'vom feinsten', 'animoda' => 'animonda',
		'ambrozia' => 'ambrosia', 'ambrosija' => 'ambrosia', 'ambrozija' => 'ambrosia',
		'monhe' => 'monge', 'mondže' => 'monge',
		'pet solution' => 'vetsolution', 'vet solution' => 'vetsolution', 'petsolution' => 'vetsolution',
		'vet life' => 'vet life', 'vetlife' => 'vet life',
		'sum palst' => 'sum-plast', 'sumplast' => 'sum-plast',
		'gastrointensial' => 'gastrointestinal', 'gastrointestinial' => 'gastrointestinal', 'gastro intestinal' => 'gastrointestinal',
		'hypoalergenic' => 'hypoallergenic', 'hipoalergenis' => 'hypoallergenic', 'hipoalerginis' => 'hypoallergenic', 'hipoalerginiai' => 'hypoallergenic', 'hipoalerginį' => 'hypoallergenic',
		'churru' => 'churu', 'ciuru' => 'churu', 'čiuru' => 'churu',
		'furminatorius' => 'furminator', 'flexy' => 'flexi', 'fleksi' => 'flexi',
		'katės pieno pakaitalas' => 'pieno pakaitalas', 'kačių pieno pakaitalas' => 'pieno pakaitalas',
		'ausu valiklis' => 'ausų valiklis', 'purskiamas' => 'purškiamas',
		'landfleish' => 'landfleisch', 'land fleisch' => 'landfleisch',
		'hepac' => 'hepatic', 'hepatik' => 'hepatic',
		'miamore' => 'miamor', 'mjamor' => 'miamor',
		'farmina n&d' => 'farmina n&d',
	);
	/** Praleidžiami žodžiai (jungtukai, bendriniai). */
	const STOP = array( 'ir', 'su', 'be', 'iš', 'is', 'the', 'and', 'for', 'with', 'of', 'a', 'in', 'on', 'į', 'ant', 'sausas', 'sausasmaistas', 'maistas', 'pašaras', 'pasaras', 'food', 'dry', 'wet' );
	/** Rūšies/bendriniai žodžiai: vieni patys nelaikomi „žinomais“ atmetant kitus ir nenaudojami kategorijų juostai. */
	const BENDRI = array( 'dog', 'dogs', 'cat', 'cats', 'šuo', 'katė', 'šun', 'kat', 'šunims', 'katėms', 'šuniui', 'katei', 'šunų', 'kačių', 'adult', 'suaug', 'suaugusiems', 'pet', 'gyvūnams' );
	/**
	 * EN (ir kt.) žodis → LT kamienai, kurie ieškomi kartu su pačiu žodžiu (OR).
	 * Kamienai jau nukirsti — kamienas() jiems netaikomas.
	 */
	const VERTIMAI = array(
		'pork' => array( 'kiaulien' ), 'peas' => array( 'žirn' ), 'pea' => array( 'žirn' ),
		'duck' => array( 'antien' ), 'lamb' => array( 'ėrien', 'avien' ), 'chicken' => array( 'vištien' ), 'pollo' => array( 'vištien' ), 'poultry' => array( 'paukšt' ),
		'salmon' => array( 'lašiš' ), 'rice' => array( 'ryž' ), 'potato' => array( 'bulv' ), 'potatoes' => array( 'bulv' ), 'sweet' => array( 'saldž' ),
		'kitten' => array( 'kačiuk' ), 'kittens' => array( 'kačiuk' ), 'puppy' => array( 'šuniuk', 'junior' ), 'puppies' => array( 'šuniuk' ), 'junior' => array( 'šuniuk', 'junior' ),
		'sterilised' => array( 'sterilizuot', 'steril' ), 'sterilized' => array( 'sterilizuot', 'steril' ), 'neutered' => array( 'sterilizuot', 'kastruot' ),
		'senior' => array( 'senjor', 'vyresn', 'mature' ), 'mature' => array( 'vyresn', 'senior' ), 'adult' => array( 'suaug', 'adult' ),
		'beef' => array( 'jautien' ), 'turkey' => array( 'kalakut' ), 'fish' => array( 'žuv' ), 'tuna' => array( 'tun' ), 'rabbit' => array( 'triuš' ),
		'venison' => array( 'elnien' ), 'deer' => array( 'elnien' ), 'horse' => array( 'arklien' ), 'boar' => array( 'šernien' ), 'quail' => array( 'putpel' ),
		'insect' => array( 'vabzdž' ), 'insects' => array( 'vabzdž' ), 'goose' => array( 'žąs' ), 'herring' => array( 'silk' ), 'trout' => array( 'upėtak' ), 'pumpkin' => array( 'moliūg' ),
		'grainfree' => array( 'begrūd' ), 'grain-free' => array( 'begrūd' ), 'begrudis' => array( 'begrūd' ), 'hypoallergenic' => array( 'hypoallerg', 'hipoalerg', 'hypoalerg' ),
		'dog' => array( 'šun' ), 'dogs' => array( 'šun' ), 'cat' => array( 'kat' ), 'cats' => array( 'kat' ), 'šuo' => array( 'šun' ), 'katė' => array( 'kat' ),
		'urinary' => array( 'urinar', 'šlapim' ), 'renal' => array( 'inkst', 'renal' ), 'dental' => array( 'dant', 'dental' ), 'hairball' => array( 'plaukų gumul', 'hairball' ),
		'indoor' => array( 'indoor', 'namuose' ), 'light' => array( 'light', 'leger', 'liekn' ), 'weight' => array( 'svor', 'light' ), 'diabetic' => array( 'diabet' ),
		'treats' => array( 'skanėst' ), 'treat' => array( 'skanėst' ), 'snack' => array( 'skanėst' ), 'litter' => array( 'kraik' ), 'shampoo' => array( 'šampūn' ),
		'small' => array( 'mažų', 'mini', 'small' ), 'mini' => array( 'mini', 'mažų' ), 'medium' => array( 'vidutin', 'medium' ), 'large' => array( 'didel', 'large', 'maxi' ), 'maxi' => array( 'didel', 'maxi' ),
		'breed' => array( 'veisl' ), 'canned' => array( 'konserv' ), 'can' => array( 'konserv' ), 'pouch' => array( 'pakel', 'pouch' ),
		'leash' => array( 'pavad' ), 'collar' => array( 'antkakl' ), 'harness' => array( 'petneš' ), 'bed' => array( 'guol' ), 'bowl' => array( 'duben' ), 'toy' => array( 'žaisl' ), 'toys' => array( 'žaisl' ),
		'hamster' => array( 'žiurkėn' ), 'rabbits' => array( 'triuš' ), 'bird' => array( 'paukšč' ), 'aquarium' => array( 'akvariu' ),
	);
	/**
	 * Brendai / grupės, kurių neturim → alternatyvos nulinių rezultatų puslapyje ir pastaboje.
	 * regex (be skiriklių) → [antraštė, tekstas, [ [pavadinimas, url], … ]]
	 */
	const ALTERNATYVOS = array(
		'hill|royal canin (vet|renal|gastro|urinary|satiety|hypoallergenic)|renal|gastro ?intestinal|virbac|trovet|prolivet|rolivet|specific|purina (pro plan )?vet|vet diet|veterinar' => array(
			'Veterinarinės dietos', 'Šio gamintojo veterinarinių dietų neturime. Panašaus poveikio dietinį maistą (virškinimas, inkstai, šlapimo takai, alergija) turime iš:',
			array( array( 'Exclusion Diet', '/gamintojas/exclusion/' ), array( 'Monge VetSolution', '/?s=vetsolution&post_type=product' ), array( 'Farmina Vet Life', '/?s=vet+life&post_type=product' ) ),
		),
		'carnilove|orijen|acana|brit care|applaws|purizon|taste of the wild|wolf of wilderness|oasy|oazy|prima dog|rafi|kitty time|sam.?s field|nature.?s protection|the good stuff|zesty|whimzees|boxby|trainer|ideapet|aladin|marp' => array(
			'Šio gamintojo neturime', 'Šiuo metu šio gamintojo prekių neturime. Panašaus lygio (begrūdis, monoproteininis, super premium) maistą turime iš:',
			array( array( 'Ambrosia', '/gamintojas/ambrosia/' ), array( 'Exclusion', '/gamintojas/exclusion/' ), array( 'Farmina N&amp;D', '/gamintojas/farmina/' ), array( 'Josera', '/gamintojas/josera/' ), array( 'Monge', '/gamintojas/monge/' ) ),
		),
		'bravecto|frontline|nexgard|simparica|advantix|advocate|drontal|milbemax|stronghold' => array(
			'Receptiniai vaistai', 'Receptinius antiparazitinius vaistus parduoda tik vaistinės ir veterinarijos gydytojai — mes jų neturime. Turime neceptinių priežiūros priemonių:',
			array( array( 'Antiparazitinės priemonės', '/?s=antiparazit&post_type=product' ), array( 'Šampūnai šunims', '/?s=šampūnas+šunims&post_type=product' ) ),
		),
		'dovan[uų] kupon|gift card|kuponas' => array(
			'Dovanų kuponas', 'Dovanų kuponų internetu kol kas neparduodame. Jei norite padovanoti — parašykite mums, sutarsime.',
			array(),
		),
	);
	/** Hub kategorijos nulinių puslapiui (S1717: 70 ŠUNIMS, 77, 87, 89, 93). */
	const HUBAI = array( 70, 77, 87, 89, 93 );
	const POPULIARIOS = array( 'exclusion', 'animonda', 'monge', 'josera', 'miamor', 'triušio', 'šuniukams', 'kraikas' );

	/** Paskutinės užklausos būsena (pastabai virš rezultatų). */
	private static $atmesti = array();
	private static $naudoti = array();
	private static $uzklausa = '';

	public static function init() {
		if ( is_admin() && ! wp_doing_ajax() ) { return; }
		if ( get_option( 'ps_paieska_isjungta' ) ) { return; }
		add_filter( 'posts_search', array( __CLASS__, 'posts_search' ), 20, 2 );
		if ( ! wp_doing_ajax() ) {
			add_action( 'wp', array( __CLASS__, 'puslapio_kabliai' ) );
		} else {
			add_filter( 'gettext', array( __CLASS__, 'ajax_nerasta' ), 20, 3 );
		}
	}

	public static function puslapio_kabliai() {
		if ( ! is_search() ) { return; }
		remove_action( 'woocommerce_no_products_found', 'wc_no_products_found', 10 );
		add_action( 'woocommerce_no_products_found', array( __CLASS__, 'nulinis_puslapis' ), 10 );
		add_action( 'woocommerce_before_shop_loop', array( __CLASS__, 'juosta' ), 5 );
	}

	/* ------------------------------------------------------------------ */
	/* Užklausos apdorojimas                                               */
	/* ------------------------------------------------------------------ */

	/** Ar tai produktų paieška (WC arba Flatsome ajax). */
	private static function produktu( WP_Query $q ) {
		$s = trim( (string) $q->get( 's' ) );
		if ( '' === $s ) { return false; }
		$pt = $q->get( 'post_type' );
		if ( is_array( $pt ) ) { return in_array( 'product', $pt, true ); }
		return 'product' === $pt || ( '' === $pt && $q->is_main_query() && isset( $_GET['post_type'] ) && 'product' === $_GET['post_type'] );
	}

	public static function normalizuoti( $s ) {
		$s = html_entity_decode( $s, ENT_QUOTES, 'UTF-8' );
		$s = str_replace( array( '’', '`', '´' ), "'", $s );
		$s = mb_strtolower( trim( preg_replace( '/\s+/u', ' ', $s ) ) );
		foreach ( self::SINONIMAI as $nuo => $i ) {
			if ( false !== mb_strpos( $s, $nuo ) ) { $s = str_replace( $nuo, $i, $s ); }
		}
		return $s;
	}

	/** Žodžio kamienas LIKE'ui: ≥8 raidžių → 6, 6–7 → 5, kitaip visas. Skaičiai ir SKU lieka. */
	public static function kamienas( $w ) {
		if ( preg_match( '/\d/', $w ) ) { return $w; }
		$n = mb_strlen( $w );
		if ( $n >= 8 ) { return mb_substr( $w, 0, 6 ); }
		if ( $n >= 6 ) { return mb_substr( $w, 0, 5 ); }
		return $w;
	}

	/** Užklausa → žodžių sąrašas (be stop-žodžių). */
	public static function zodziai( $s ) {
		$s = self::normalizuoti( $s );
		return array_values( array_filter( preg_split( '/[\s,\/]+/u', $s ), function ( $w ) { return '' !== $w && ! in_array( $w, self::STOP, true ); } ) );
	}

	/** Vieno žodžio LIKE variantai: kamienas + LT vertimai. */
	public static function variantai( $w ) {
		$v = array( self::kamienas( $w ) );
		$wl = rtrim( $w, "'’" );
		if ( isset( self::VERTIMAI[ $wl ] ) ) { $v = array_merge( $v, self::VERTIMAI[ $wl ] ); }
		return array_values( array_unique( $v ) );
	}

	/** SQL sąlyga žodžiui (title/excerpt/content, OR per variantus). */
	private static function salyga( $w ) {
		global $wpdb;
		$or = array();
		foreach ( self::variantai( $w ) as $k ) {
			$k = '%' . $wpdb->esc_like( $k ) . '%';
			$or[] = $wpdb->prepare( "{$wpdb->posts}.post_title LIKE %s OR {$wpdb->posts}.post_excerpt LIKE %s OR {$wpdb->posts}.post_content LIKE %s", $k, $k, $k );
		}
		return '(' . implode( ' OR ', $or ) . ')';
	}

	/** Kiek publikuotų prekių atitinka žodį (nežinomų žodžių atmetimui). */
	private static function kiek( $w ) {
		global $wpdb;
		static $c = array();
		if ( isset( $c[ $w ] ) ) { return $c[ $w ]; }
		$c[ $w ] = (int) $wpdb->get_var( "SELECT 1 FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND " . self::salyga( $w ) . ' LIMIT 1' );
		return $c[ $w ];
	}

	public static function posts_search( $search, $q ) {
		if ( ! self::produktu( $q ) ) { return $search; }
		global $wpdb;
		$s = self::normalizuoti( (string) $q->get( 's' ) );
		$zodziai = self::zodziai( $s );
		if ( ! $zodziai ) { return $search; }

		// (5) nežinomų žodžių atmetimas — tik kai žodžių ≥ 2
		$naudoti = $zodziai; $atmesti = array();
		if ( count( $zodziai ) >= 2 ) {
			$zin = array(); $nez = array();
			foreach ( $zodziai as $w ) { if ( self::kiek( $w ) > 0 ) { $zin[] = $w; } else { $nez[] = $w; } }
			$tik_bendri = ! array_diff( $zin, self::BENDRI );
			if ( $zin && $nez && ! $tik_bendri ) { $naudoti = $zin; $atmesti = $nez; }
		}
		if ( $q->is_main_query() ) { self::$uzklausa = (string) $q->get( 's' ); self::$naudoti = $naudoti; self::$atmesti = $atmesti; }

		$and = array();
		foreach ( $naudoti as $w ) { $and[] = self::salyga( $w ); }
		$where = '(' . implode( ' AND ', $and ) . ')';

		// SKU / ID: visa užklausa be tarpų
		$sku = preg_replace( '/\s+/u', '', $s );
		if ( '' !== $sku && mb_strlen( $sku ) <= 20 && preg_match( '/\d/', $sku ) ) {
			$where .= $wpdb->prepare( " OR {$wpdb->posts}.ID IN (SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='_sku' AND meta_value LIKE %s)", '%' . $wpdb->esc_like( $sku ) . '%' );
			if ( ctype_digit( $sku ) ) { $where .= $wpdb->prepare( " OR {$wpdb->posts}.ID = %d", (int) $sku ); }
		}
		return " AND ({$where}) ";
	}

	/* ------------------------------------------------------------------ */
	/* Alternatyvos                                                        */
	/* ------------------------------------------------------------------ */

	/** Ar užklausoje (ar atmestuose žodžiuose) yra brendas/grupė, kurios neturim. */
	public static function alternatyva( $tekstas ) {
		$t = self::normalizuoti( (string) $tekstas );
		foreach ( self::ALTERNATYVOS as $re => $a ) {
			if ( preg_match( '/(?:' . $re . ')/iu', $t ) ) { return $a; }
		}
		return null;
	}

	private static function alternatyvos_html( $a, $klase = 'ps-paieska-alt' ) {
		if ( ! $a ) { return ''; }
		$h = '<div class="' . $klase . '"><strong>' . esc_html( $a[0] ) . '.</strong> ' . esc_html( $a[1] );
		if ( ! empty( $a[2] ) ) {
			$h .= ' <span class="ps-paieska-chips">';
			foreach ( $a[2] as $l ) { $h .= '<a class="ps-chip" href="' . esc_url( home_url( $l[1] ) ) . '">' . $l[0] . '</a> '; }
			$h .= '</span>';
		}
		return $h . '</div>';
	}

	/* ------------------------------------------------------------------ */
	/* (7) Juosta virš rezultatų: pastaba apie atmestus žodžius + kategorijos/gamintojai */
	/* ------------------------------------------------------------------ */

	public static function juosta() {
		if ( ! is_search() ) { return; }
		$s = get_search_query();
		if ( '' === $s ) { return; }
		$h = '';
		if ( self::$atmesti ) {
			$alt = self::alternatyva( implode( ' ', self::$atmesti ) );
			$h .= '<div class="ps-paieska-pastaba">Pagal „<b>' . esc_html( implode( ' ', self::$atmesti ) ) . '</b>“ prekių nerasta — rodome rezultatus pagal „<b>' . esc_html( implode( ' ', self::$naudoti ) ) . '</b>“.</div>';
			if ( $alt ) { $h .= self::alternatyvos_html( $alt ); }
		}
		$terminai = self::terminai( $s );
		if ( $terminai ) {
			$h .= '<div class="ps-paieska-terminai"><span class="ps-paieska-label">Kategorijos ir gamintojai:</span> ';
			foreach ( $terminai as $t ) { $h .= '<a class="ps-chip" href="' . esc_url( get_term_link( $t ) ) . '">' . esc_html( $t->name ) . ' <span class="ps-chip-n">' . (int) $t->count . '</span></a> '; }
			$h .= '</div>';
		}
		if ( $h ) { echo '<div class="ps-paieska-juosta">' . self::css() . $h . '</div>'; }
	}

	/** Kategorijos/gamintojai, kurių pavadinimas atitinka užklausos žodžius. */
	public static function terminai( $s, $max = 8 ) {
		global $wpdb;
		$zodziai = self::zodziai( $s );
		if ( ! $zodziai ) { return array(); }
		$or = array();
		foreach ( $zodziai as $w ) {
			if ( in_array( $w, self::BENDRI, true ) ) { continue; }
			foreach ( self::variantai( $w ) as $k ) { if ( mb_strlen( $k ) < 3 ) { continue; } $or[] = $wpdb->prepare( 't.name LIKE %s', '%' . $wpdb->esc_like( $k ) . '%' ); }
		}
		if ( ! $or ) { return array(); }
		$ids = $wpdb->get_col( "SELECT t.term_id FROM {$wpdb->terms} t JOIN {$wpdb->term_taxonomy} tt ON tt.term_id=t.term_id
			WHERE tt.taxonomy IN ('product_cat','product_brand') AND tt.count>0 AND t.slug NOT IN ('rinkiniai','daugiau-pigiau','dovanos','uncategorized','sprendimai') AND (" . implode( ' OR ', $or ) . ")
			ORDER BY tt.count DESC LIMIT " . (int) $max );
		$out = array();
		foreach ( $ids as $id ) { $t = get_term( (int) $id ); if ( $t && ! is_wp_error( $t ) ) { $out[] = $t; } }
		return $out;
	}

	/* ------------------------------------------------------------------ */
	/* (6) Nulinių rezultatų puslapis                                      */
	/* ------------------------------------------------------------------ */

	public static function nulinis_puslapis() {
		$s = get_search_query();
		$alt = self::alternatyva( $s );
		echo '<div class="ps-paieska-nulis">' . self::css();
		echo '<h2 class="ps-paieska-h">Pagal „' . esc_html( $s ) . '“ prekių nerasta</h2>';
		if ( $alt ) { echo self::alternatyvos_html( $alt ); }
		else { echo '<p class="ps-paieska-p">Patikrinkite rašybą arba pabandykite trumpesnį žodį — pvz. gamintoją („josera“) ar prekės tipą („konservai katėms“).</p>'; }
		$terminai = self::terminai( $s );
		if ( $terminai ) {
			echo '<div class="ps-paieska-blokas"><span class="ps-paieska-label">Susijusios kategorijos ir gamintojai:</span> ';
			foreach ( $terminai as $t ) { echo '<a class="ps-chip" href="' . esc_url( get_term_link( $t ) ) . '">' . esc_html( $t->name ) . ' <span class="ps-chip-n">' . (int) $t->count . '</span></a> '; }
			echo '</div>';
		}

		// paslėptos dropship prekės (tik su R sprendimu — opcija)
		if ( get_option( 'ps_paieska_pasleptos' ) ) {
			$pasl = self::pasleptos( $s );
			if ( $pasl ) {
				echo '<div class="ps-paieska-blokas"><span class="ps-paieska-label">Šiuo metu neturime, bet galite užsisakyti pranešimą, kai atsiras:</span><ul class="ps-paieska-sarasas">';
				foreach ( $pasl as $p ) { echo '<li><a href="' . esc_url( get_permalink( $p ) ) . '">' . esc_html( get_the_title( $p ) ) . '</a></li>'; }
				echo '</ul></div>';
			}
		}

		// kategorijos
		$h = '';
		foreach ( self::HUBAI as $hid ) {
			$hub = get_term( $hid, 'product_cat' );
			if ( ! $hub || is_wp_error( $hub ) ) { continue; }
			$vaikai = get_terms( array( 'taxonomy' => 'product_cat', 'parent' => $hid, 'hide_empty' => true, 'orderby' => 'count', 'order' => 'DESC', 'number' => 4 ) );
			$h .= '<div class="ps-paieska-hub"><a class="ps-paieska-hub-a" href="' . esc_url( get_term_link( $hub ) ) . '">' . esc_html( mb_convert_case( $hub->name, MB_CASE_TITLE, 'UTF-8' ) ) . '</a> ';
			if ( $vaikai && ! is_wp_error( $vaikai ) ) { foreach ( $vaikai as $v ) { $h .= '<a class="ps-chip" href="' . esc_url( get_term_link( $v ) ) . '">' . esc_html( $v->name ) . '</a> '; } }
			$h .= '</div>';
		}
		if ( $h ) { echo '<div class="ps-paieska-blokas"><span class="ps-paieska-label">Ieškokite pagal kategoriją:</span>' . $h . '</div>'; }

		// populiarios paieškos
		echo '<div class="ps-paieska-blokas"><span class="ps-paieska-label">Dažniausiai ieškoma:</span> ';
		foreach ( self::POPULIARIOS as $p ) { echo '<a class="ps-chip" href="' . esc_url( home_url( '/?s=' . rawurlencode( $p ) . '&post_type=product' ) ) . '">' . esc_html( $p ) . '</a> '; }
		echo '</div>';

		// kontaktas
		$k = self::kontaktas();
		echo '<p class="ps-paieska-p ps-paieska-kontaktas">Nerandate? Parašykite, ką ieškote — ' . $k . '. Jei prekė yra pas mūsų tiekėjus, užsakysime.</p>';
		echo '</div>';
	}

	/** Paslėptos (exclude-from-search) publikuotos prekės, atitinkančios užklausą. */
	public static function pasleptos( $s, $max = 6 ) {
		global $wpdb;
		$zodziai = self::zodziai( $s );
		if ( ! $zodziai ) { return array(); }
		$and = array();
		foreach ( $zodziai as $w ) { if ( self::kiek( $w ) > 0 || count( $zodziai ) === 1 ) { $and[] = self::salyga( $w ); } }
		if ( ! $and ) { return array(); }
		$ids = wc_get_product_visibility_term_ids();
		$tt = (int) ( $ids['exclude-from-search'] ?? 0 );
		if ( ! $tt ) { return array(); }
		return array_map( 'intval', $wpdb->get_col( "SELECT {$wpdb->posts}.ID FROM {$wpdb->posts} JOIN {$wpdb->term_relationships} tr ON tr.object_id={$wpdb->posts}.ID AND tr.term_taxonomy_id={$tt}
			WHERE post_type='product' AND post_status='publish' AND " . implode( ' AND ', $and ) . " ORDER BY post_title LIMIT " . (int) $max ) );
	}

	private static function kontaktas() {
		$out = array();
		$e = get_option( 'ps_paieska_kontaktas_email' ) ?: get_option( 'woocommerce_email_from_address' );
		$t = get_option( 'ps_paieska_kontaktas_tel' ) ?: get_option( 'woocommerce_store_phone' );
		if ( $e ) { $out[] = '<a href="mailto:' . esc_attr( $e ) . '">' . esc_html( $e ) . '</a>'; }
		if ( $t ) { $out[] = '<a href="tel:' . esc_attr( preg_replace( '/[^\d+]/', '', $t ) ) . '">' . esc_html( $t ) . '</a>'; }
		$pg = get_page_by_path( 'kontaktai' );
		if ( $pg ) { $out[] = '<a href="' . esc_url( get_permalink( $pg ) ) . '">kontaktų forma</a>'; }
		return $out ? implode( ' arba ', $out ) : 'per kontaktų puslapį';
	}

	/** Flatsome live-search „Produktų nerasta.“ → nuoroda į pilną rezultatų puslapį. */
	public static function ajax_nerasta( $t, $orig, $domain ) {
		if ( false !== strpos( $orig, 'No products found' ) && isset( $_REQUEST['action'] ) && 'flatsome_ajax_search_products' === $_REQUEST['action'] ) {
			return 'Nerasta — spauskite Enter, parodysime kategorijas ir alternatyvas';
		}
		return $t;
	}

	private static function css() {
		static $d = false;
		if ( $d ) { return ''; }
		$d = true;
		return '<style>.ps-paieska-juosta{margin:0 0 18px}.ps-paieska-nulis{max-width:820px;margin:10px auto 30px}.ps-paieska-h{font-size:1.3em;margin:0 0 12px}.ps-paieska-p{margin:0 0 14px;color:#444}.ps-paieska-pastaba{background:#fff8e1;border-left:3px solid #f0b429;padding:8px 12px;margin:0 0 10px;font-size:.95em}.ps-paieska-alt{background:#f3f8f4;border-left:3px solid #4caf50;padding:10px 12px;margin:0 0 14px;font-size:.95em}.ps-paieska-blokas{margin:0 0 16px}.ps-paieska-label{display:block;font-weight:600;margin:0 0 6px;color:#333}.ps-paieska-terminai{margin:0 0 6px}.ps-paieska-terminai .ps-paieska-label{display:inline;margin-right:6px}.ps-paieska-hub{margin:0 0 6px;line-height:2}.ps-paieska-hub-a{font-weight:600;margin-right:6px}.ps-chip{display:inline-block;background:#f2f2f2;border-radius:14px;padding:2px 11px;margin:2px 4px 2px 0;font-size:.9em;color:#222;text-decoration:none;line-height:1.7}.ps-chip:hover{background:#e6e6e6;color:#000}.ps-chip-n{color:#888;font-size:.85em}.ps-paieska-sarasas{margin:0 0 0 18px}.ps-paieska-kontaktas{border-top:1px solid #eee;padding-top:12px}</style>';
	}
}
add_action( 'init', array( 'Petshop_Paieska', 'init' ), 5 );
