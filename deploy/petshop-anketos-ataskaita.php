<?php
/**
 * Plugin Name: Petshop Anketos Ataskaita
 * Description: Kontrakto §6 P1 — sesios "Augintinio anketa" skiltys ant ataskaitu standarto v2 karkaso.
 * Version: 1.1
 *
 * SESIOS SKILTYS (kontraktas §6, eile fiksuota):
 *  1. Variklio sveikata / piltuvelis   — kur zmones iskrenta ir ar variklis atsako
 *  2. Rekomendaciju coverage + gedimai — reason_code pjuvis, kas neveikia SIANDIEN
 *  3. Paklausos / asortimento zemelapis — ko klientai serai ir ko mes neturim
 *  4. Duomenu kokybe                    — RECOMMENDABLE vs HIGH_CONFIDENCE tarpas
 *  5. Refill / gyvybingumas             — due -> priminimas -> pirkimas
 *  6. Pinigai / cohort                  — SAZININGAI "duomenu dar nepakanka" iki istorijos
 *
 * v1.1: KPI kortelių apvalkalas buvo `psru-k-eile` — TOKIOS KLASĖS KARKASE NĖRA,
 * todėl kortelės krito viena po kita per visą plotį. Teisinga: `psru-kpi`
 * (grid, auto-fit minmax 215px). Rasta ekrano kopijoje, ne skaičiuose.
 *
 * PRINCIPAI:
 *  - JOKIU nauju duomenu nerenkam: viskas is keturiu kontrakto sluoksniu
 *    (ps_pets, ps_pet_field_log, ps_laukai_ivykiai, ps_rec_log);
 *  - is_test=1 profiliai ismetami VISUR (DoD #7) — filtras `test_filtras()`;
 *  - mazos imtys zymimos, ne slepiamos (`Petshop_Ataskaitu_UI::maza_imtis`);
 *  - kai duomenu tikrai nera, sakom TIESIAI, o ne piesiam nuli kaip fakta;
 *  - ribos — options, ne konstantos (DoD #8).
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Anketos_Ataskaita {

	const VERSIJA = '1.1';
	const PARENT  = 'petshop-reports';
	const SLUG    = 'petshop-reports-anketa';
	const CAP     = 'manage_woocommerce';

	/** Nuo kiek uzsakymu 6 skiltis rodo pinigus, o ne "duomenu dar nepakanka". */
	const OPT_PINIGU_RIBA = 'ps_anketa_pinigu_riba';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 41 );
	}

	public static function meniu() {
		add_submenu_page( self::PARENT, 'Augintinio anketa', 'Augintinio anketa',
			self::CAP, self::SLUG, array( __CLASS__, 'render' ) );
	}

	/* ==================== PAGALBOS ==================== */

	private static function ui() { return class_exists( 'Petshop_Ataskaitu_UI' ); }

	private static function t( $vardas ) { global $wpdb; return $wpdb->prefix . $vardas; }

	/** DoD #7: testiniai profiliai ismetami visur. */
	private static function test_filtras( $alias = 'p' ) {
		return " AND ({$alias}.is_test IS NULL OR {$alias}.is_test=0) ";
	}

	private static function lentele_yra( $t ) {
		global $wpdb;
		return $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) === $t;
	}

	private static function ivykiai_intervale( $sritis, $nuo, $iki ) {
		global $wpdb;
		$t = self::t( 'ps_laukai_ivykiai' );
		if ( ! self::lentele_yra( $t ) ) { return array(); }
		$r = $wpdb->get_results( $wpdb->prepare(
			"SELECT tipas, COUNT(*) n, COUNT(DISTINCT CASE WHEN user_id>0 THEN user_id END) vart
			 FROM $t WHERE sritis=%s AND DATE(laikas) BETWEEN %s AND %s GROUP BY tipas",
			$sritis, $nuo, $iki ), ARRAY_A );
		$o = array();
		foreach ( (array) $r as $x ) { $o[ $x['tipas'] ] = array( 'n' => (int) $x['n'], 'vart' => (int) $x['vart'] ); }
		return $o;
	}

	private static function sk( $m, $tipas ) { return isset( $m[ $tipas ] ) ? $m[ $tipas ]['n'] : 0; }

	/* ==================== RENDER ==================== */

	public static function render() {
		if ( ! current_user_can( self::CAP ) ) { wp_die( 'Teisiu nepakanka.' ); }
		if ( ! self::ui() ) {
			echo '<div class="wrap"><h1>Augintinio anketa</h1><p>Trūksta modulio <code>petshop-ataskaitos-ui.php</code>.</p></div>';
			return;
		}
		$U  = 'Petshop_Ataskaitu_UI';
		$lt = $U::laikotarpis();

		$U::antraste( 'Augintinio anketa',
			'Kontrakto §6 skiltys: kur žmonės iškrenta, ką variklis atsako, ko trūksta kataloge ir duomenyse.' );
		$U::juosta( self::SLUG, $lt );

		self::skiltis_1( $U, $lt );
		self::skiltis_2( $U, $lt );
		self::skiltis_3( $U, $lt );
		self::skiltis_4( $U, $lt );
		self::skiltis_5( $U, $lt );
		self::skiltis_6( $U, $lt );

		$U::pabaiga();
	}

	/* ========== 1. VARIKLIO SVEIKATA / PILTUVELIS ========== */

	private static function skiltis_1( $U, $lt ) {
		global $wpdb;
		echo '<h2 class="psru-h2">1. Anketos piltuvėlis ir variklio sveikata</h2>';

		$a = self::ivykiai_intervale( 'anketa', $lt['nuo'], $lt['iki'] );
		$zingsniai = array(
			array( 'pav' => 'Atidarė anketą', 'sk' => self::sk( $a, 'anketa_started' ) ),
			array( 'pav' => 'Baigė 1 žingsnį', 'sk' => self::sk( $a, 'step_completed' ) ),
			array( 'pav' => 'Užbaigė anketą',  'sk' => self::sk( $a, 'anketa_completed' ) ),
			array( 'pav' => 'Perkėlė į paskyrą', 'sk' => self::sk( $a, 'profile_claimed' ) ),
		);
		$U::piltuvelis( $zingsniai );

		/* Kur konkreciai sustojo — is anketa_abandoned vertes (s{N}|+pilni|-tusti) */
		$t = self::t( 'ps_laukai_ivykiai' );
		$met = array();
		if ( self::lentele_yra( $t ) ) {
			$met = $wpdb->get_col( $wpdb->prepare(
				"SELECT verte FROM $t WHERE sritis='anketa' AND tipas='anketa_abandoned'
				 AND DATE(laikas) BETWEEN %s AND %s LIMIT 2000", $lt['nuo'], $lt['iki'] ) );
		}
		$pagal_zingsni = array(); $tusti_laukai = array();
		foreach ( (array) $met as $v ) {
			$d = explode( '|', $v );
			$z = isset( $d[0] ) ? $d[0] : 's?';
			$pagal_zingsni[ $z ] = isset( $pagal_zingsni[ $z ] ) ? $pagal_zingsni[ $z ] + 1 : 1;
			foreach ( $d as $dalis ) {
				if ( strpos( $dalis, '-' ) === 0 ) {
					foreach ( array_filter( explode( ',', substr( $dalis, 1 ) ) ) as $l ) {
						$tusti_laukai[ $l ] = isset( $tusti_laukai[ $l ] ) ? $tusti_laukai[ $l ] + 1 : 1;
					}
				}
			}
		}
		arsort( $tusti_laukai );

		echo '<div class="psru-kpi">';
		$U::kpi( 'Metė anketą', number_format( count( $met ), 0, ',', ' ' ), null,
			'per laikotarpį', 'Įvykis anketa_abandoned — žmogus paliko puslapį anketos neužbaigęs.' );
		$U::kpi( 'Užbaigė', number_format( self::sk( $a, 'anketa_completed' ), 0, ',', ' ' ), null, '', '' );
		$pr = self::sk( $a, 'anketa_started' );
		$U::kpi( 'Užbaigimo dalis',
			$U::proc( $pr > 0 ? ( self::sk( $a, 'anketa_completed' ) / $pr ) * 100 : 0 ),
			null, $U::maza_imtis( 'nuo pradėjusių', $pr ), '' );
		echo '</div>';

		if ( $tusti_laukai ) {
			$eil = array();
			$viso = max( 1, count( $met ) );
			foreach ( array_slice( $tusti_laukai, 0, 12, true ) as $laukas => $n ) {
				$eil[] = array(
					esc_html( str_replace( '_', ' ', $laukas ) ),
					number_format( $n, 0, ',', ' ' ),
					$U::juostele( $U::proc( ( $n / $viso ) * 100 ), ( $n / $viso ) * 100 ),
				);
			}
			echo '<h3 class="psru-h3">Ties kuo sustoja — tušti laukai metimo momentu</h3>';
			$U::lentele( 'ank-laukai', array(
				array( 'pav' => 'Laukas', 'kaire' => 1 ),
				array( 'pav' => 'Kiek kartų liko tuščias' ),
				array( 'pav' => 'Dalis metusiųjų', 'tt' => 'Iš visų šio laikotarpio anketos metimų.' ),
			), $eil, array( 'failas' => 'anketa-laukai.csv', 'rikiuoti' => 1 ) );
		} elseif ( $met ) {
			$U::spejimas( 'Metimų yra, bet laukų būsena neužfiksuota — tikėtina, senesni įvykiai iki laukų sąrašo įvedimo.' );
		}

		if ( $pagal_zingsni ) {
			$eil = array();
			foreach ( $pagal_zingsni as $z => $n ) { $eil[] = array( esc_html( $z ), number_format( $n, 0, ',', ' ' ) ); }
			$U::lentele( 'ank-zingsniai', array(
				array( 'pav' => 'Žingsnis', 'kaire' => 1 ), array( 'pav' => 'Metimų' ),
			), $eil, array( 'paieska' => false, 'failas' => 'anketa-zingsniai.csv' ) );
		}
	}

	/* ========== 2. REKOMENDACIJU COVERAGE IR GEDIMAI ========== */

	private static function skiltis_2( $U, $lt ) {
		global $wpdb;
		echo '<h2 class="psru-h2">2. Rekomendacijos: kiek atsako ir kodėl nepavyksta</h2>';
		$rl = self::t( 'ps_rec_log' );
		if ( ! self::lentele_yra( $rl ) ) { $U::spejimas( 'Lentelės <code>ps_rec_log</code> nėra.' ); return; }

		$b = $wpdb->get_row( $wpdb->prepare(
			"SELECT COUNT(*) viso,
			        SUM(rezultatas='ok') ok,
			        SUM(rezultatas='fallback') fb,
			        SUM(rezultatas='failed') fail,
			        COUNT(DISTINCT pet_id) petai
			 FROM $rl WHERE DATE(laikas) BETWEEN %s AND %s", $lt['nuo'], $lt['iki'] ), ARRAY_A );
		$viso = (int) $b['viso'];

		echo '<div class="psru-kpi">';
		$U::kpi( 'Sprendimų', number_format( $viso, 0, ',', ' ' ), null, 'per laikotarpį',
			'Kiekvienas variklio atsakymas rašomas į ps_rec_log sprendimo momentu.' );
		$U::kpi( 'Atsakė su rekomendacija', $U::proc( $viso ? ( $b['ok'] / $viso ) * 100 : 0 ), null,
			$U::maza_imtis( 'nuo visų sprendimų', $viso ), '' );
		$U::kpi( 'Nepavyko', number_format( (int) $b['fail'], 0, ',', ' ' ), null, '', '' );
		$U::kpi( 'Skirtingų augintinių', number_format( (int) $b['petai'], 0, ',', ' ' ), null, '', '' );
		echo '</div>';

		if ( ! $viso ) { $U::spejimas( 'Šiuo laikotarpiu variklis nebuvo kviestas — sprendimų nėra.' ); return; }

		$pr = $wpdb->get_results( $wpdb->prepare(
			"SELECT COALESCE(reason_code,'(be kodo)') k, COUNT(*) n FROM $rl
			 WHERE rezultatas='failed' AND DATE(laikas) BETWEEN %s AND %s
			 GROUP BY k ORDER BY n DESC", $lt['nuo'], $lt['iki'] ), ARRAY_A );

		$paaisk = array(
			'no_product_for_need'  => 'Nėra prekės pagal poreikį — asortimento spraga.',
			'sensitivity_conflict' => 'Visi kandidatai konfliktuoja su jautrumu — reikia hipoalerginių.',
			'no_feeding_table'     => 'Kandidatai be patikrintos šėrimo lentelės — duomenų darbas.',
			'out_of_stock'         => 'Tinkamos prekės išparduotos — likučių klausimas.',
			'missing_weight'       => 'Profilyje nėra svorio — priminimas klientui.',
			'missing_life_stage'   => 'Nėra gyvenimo etapo — priminimas klientui.',
			'no_size_variant'      => 'Nėra tinkamo pakuotės dydžio.',
			'product_data_gap'     => 'Prekės duomenų spraga (pvz. be gyvūno rūšies).',
			'species_unsupported'  => 'Variklis šios rūšies nepalaiko (v1 — tik šunys ir katės).',
			'no_purchase_history'  => 'Nėra pirkimų istorijos, iš kurios rinkti kandidatus.',
		);
		$eil = array(); $fail = max( 1, (int) $b['fail'] );
		foreach ( (array) $pr as $x ) {
			$eil[] = array(
				'<code>' . esc_html( $x['k'] ) . '</code>',
				number_format( (int) $x['n'], 0, ',', ' ' ),
				$U::juostele( $U::proc( ( $x['n'] / $fail ) * 100 ), ( $x['n'] / $fail ) * 100 ),
				esc_html( isset( $paaisk[ $x['k'] ] ) ? $paaisk[ $x['k'] ] : '' ),
			);
		}
		echo '<h3 class="psru-h3">Gedimų priežastys</h3>';
		$U::lentele( 'rec-reason', array(
			array( 'pav' => 'Kodas', 'kaire' => 1 ), array( 'pav' => 'Kartų' ),
			array( 'pav' => 'Dalis nesėkmių' ), array( 'pav' => 'Ką tai reiškia', 'kaire' => 1 ),
		), $eil, array( 'failas' => 'rec-priezastys.csv', 'rikiuoti' => 1 ) );

		/* Piltuvelis: parodyta -> paspausta -> i krepseli -> pirkta */
		$r = self::ivykiai_intervale( 'rec', $lt['nuo'], $lt['iki'] );
		echo '<h3 class="psru-h3">Nuo parodymo iki pirkimo</h3>';
		$U::piltuvelis( array(
			array( 'pav' => 'Parodyta',    'sk' => self::sk( $r, 'rec_shown' ) ),
			array( 'pav' => 'Paspausta',   'sk' => self::sk( $r, 'rec_clicked' ) ),
			array( 'pav' => 'Į krepšelį',  'sk' => self::sk( $r, 'rec_add_to_cart' ) ),
			array( 'pav' => 'Nupirkta',    'sk' => self::sk( $r, 'rec_purchased' ) ),
		) );
	}

	/* ========== 3. PAKLAUSOS / ASORTIMENTO ZEMELAPIS ========== */

	private static function skiltis_3( $U, $lt ) {
		global $wpdb;
		echo '<h2 class="psru-h2">3. Paklausa ir asortimento spragos</h2>';
		$p = self::t( 'ps_pets' );
		$al = self::t( 'ps_brand_alias' );

		/* Ka klientai seria — raw brandas + ar mes ji turim */
		$br = $wpdb->get_results(
			"SELECT p.current_food_brand raw, p.current_food_brand_id cid, COUNT(*) n
			 FROM $p p WHERE p.current_food_brand IS NOT NULL AND p.current_food_brand<>''
			 " . self::test_filtras( 'p' ) . "
			 GROUP BY p.current_food_brand, p.current_food_brand_id ORDER BY n DESC LIMIT 40", ARRAY_A );

		$eil = array();
		foreach ( (array) $br as $x ) {
			$turim = '—';
			if ( ! empty( $x['cid'] ) ) {
				$term = get_term_by( 'slug', $x['cid'], 'product_brand' );
				$turim = $term ? ( '<b>' . (int) $term->count . '</b> prekės' ) : 'susieta, prekių 0';
			}
			$eil[] = array(
				esc_html( $x['raw'] ),
				number_format( (int) $x['n'], 0, ',', ' ' ),
				$x['cid'] ? '<code>' . esc_html( $x['cid'] ) . '</code>' : '<span class="psru-mut">nesusieta</span>',
				$turim,
			);
		}
		echo '<h3 class="psru-h3">Kuo šeria dabar (perėmimo taikiniai)</h3>';
		$U::lentele( 'ank-brandai', array(
			array( 'pav' => 'Kliento įvestis', 'kaire' => 1 ),
			array( 'pav' => 'Profilių' ),
			array( 'pav' => 'Susieta su', 'kaire' => 1, 'tt' => 'Brand žodyno canonical_id. Nesusietus tvirtini skiltyje „Brand žodynas".' ),
			array( 'pav' => 'Mūsų kataloge', 'kaire' => 1 ),
		), $eil, array( 'failas' => 'anketa-brandai.csv', 'rikiuoti' => 1 ) );

		/* Poreikiu paklausa vs katalogo padengimas */
		$need_map = array(
			'digestion' => 'jautriam-virskinimui', 'weight_control' => 'svorio-kontrolei',
			'skin_coat' => 'odai-ir-kailiui', 'joints' => 'sanariams', 'urinary' => 'slapimo-takams',
		);
		$nd = $wpdb->get_results(
			"SELECT primary_need k, COUNT(*) n FROM $p p
			 WHERE primary_need IS NOT NULL AND primary_need<>'' AND primary_need<>'none'
			 " . self::test_filtras( 'p' ) . " GROUP BY primary_need ORDER BY n DESC", ARRAY_A );
		$eil2 = array();
		foreach ( (array) $nd as $x ) {
			$slug = isset( $need_map[ $x['k'] ] ) ? $need_map[ $x['k'] ] : '';
			$term = $slug ? get_term_by( 'slug', $slug, 'pa_speciali_mityba' ) : null;
			$kiek = $term ? (int) $term->count : 0;
			$eil2[] = array(
				esc_html( $x['k'] ),
				number_format( (int) $x['n'], 0, ',', ' ' ),
				$slug ? '<code>' . esc_html( $slug ) . '</code>' : '<span class="psru-mut">nėra atitikmens</span>',
				$kiek ? number_format( $kiek, 0, ',', ' ' ) : '<b class="psru-maza-z">0 — spraga</b>',
			);
		}
		echo '<h3 class="psru-h3">Poreikiai vs katalogas</h3>';
		$U::lentele( 'ank-poreikiai', array(
			array( 'pav' => 'Poreikis', 'kaire' => 1 ), array( 'pav' => 'Profilių' ),
			array( 'pav' => 'Katalogo žyma', 'kaire' => 1 ), array( 'pav' => 'Prekių su žyma' ),
		), $eil2, array( 'paieska' => false, 'failas' => 'anketa-poreikiai.csv' ) );

		/* Jautrumai — ka privalom galeti pasiulyti */
		$sn = $wpdb->get_results(
			"SELECT sensitivities s, COUNT(*) n FROM $p p
			 WHERE sensitivities IS NOT NULL AND sensitivities NOT IN ('none','unknown','')
			 " . self::test_filtras( 'p' ) . " GROUP BY sensitivities", ARRAY_A );
		$pavieniai = array();
		foreach ( (array) $sn as $x ) {
			foreach ( array_filter( explode( ',', $x['s'] ) ) as $k ) {
				$k = trim( $k );
				if ( strpos( $k, 'other:' ) === 0 ) { $k = 'kita: ' . substr( $k, 6 ); }
				$pavieniai[ $k ] = ( isset( $pavieniai[ $k ] ) ? $pavieniai[ $k ] : 0 ) + (int) $x['n'];
			}
		}
		arsort( $pavieniai );
		$eil3 = array();
		foreach ( $pavieniai as $k => $n ) { $eil3[] = array( esc_html( $k ), number_format( $n, 0, ',', ' ' ) ); }
		echo '<h3 class="psru-h3">Deklaruoti jautrumai</h3>';
		$U::lentele( 'ank-jautrumai', array(
			array( 'pav' => 'Jautrumas', 'kaire' => 1 ), array( 'pav' => 'Profilių' ),
		), $eil3, array( 'paieska' => false, 'failas' => 'anketa-jautrumai.csv' ) );
	}

	/* ========== 4. DUOMENU KOKYBE ========== */

	private static function skiltis_4( $U, $lt ) {
		global $wpdb;
		echo '<h2 class="psru-h2">4. Duomenų kokybė — kiek profilių tinka varikliui</h2>';
		$p = self::t( 'ps_pets' );
		$f = self::test_filtras( 'p' );

		$viso = (int) $wpdb->get_var( "SELECT COUNT(*) FROM $p p WHERE (p.status IS NULL OR p.status<>'deleted') $f" );
		$rec  = (int) $wpdb->get_var( "SELECT COUNT(*) FROM $p p WHERE (p.status IS NULL OR p.status<>'deleted') $f
			AND species IS NOT NULL AND species<>'' AND life_stage IS NOT NULL AND life_stage<>''
			AND current_weight_kg IS NOT NULL AND current_weight_kg>0" );
		$hig  = (int) $wpdb->get_var( "SELECT COUNT(*) FROM $p p WHERE (p.status IS NULL OR p.status<>'deleted') $f
			AND species IS NOT NULL AND species<>'' AND life_stage IS NOT NULL AND life_stage<>''
			AND current_weight_kg IS NOT NULL AND current_weight_kg>0
			AND sensitivities IS NOT NULL AND sensitivities<>''" );

		echo '<div class="psru-kpi">';
		$U::kpi( 'Aktyvūs profiliai', number_format( $viso, 0, ',', ' ' ), null, 'be testinių', 'is_test=1 profiliai neįskaičiuoti.' );
		$U::kpi( 'RECOMMENDABLE', number_format( $rec, 0, ',', ' ' ), null,
			$U::proc( $viso ? ( $rec / $viso ) * 100 : 0 ) . ' nuo visų', 'Rūšis + gyvenimo etapas + svoris — variklio minimumas.' );
		$U::kpi( 'HIGH_CONFIDENCE', number_format( $hig, 0, ',', ' ' ), null,
			$U::proc( $viso ? ( $hig / $viso ) * 100 : 0 ) . ' nuo visų', '+ atsakyta apie jautrumus.' );
		$U::kpi( 'Tarpas', number_format( max( 0, $rec - $hig ), 0, ',', ' ' ), null,
			'trūksta tik jautrumų atsakymo', 'Vienas priminimas paverstų juos HIGH_CONFIDENCE.' );
		echo '</div>';

		/* Ko truksta — pagal lauka */
		$laukai = array(
			'life_stage'        => 'Gyvenimo etapas',
			'current_weight_kg' => 'Svoris',
			'sensitivities'     => 'Jautrumai (neatsakyta)',
			'primary_need'      => 'Poreikis (neatsakyta)',
			'is_sterilised'     => 'Sterilizacija (neatsakyta)',
			'current_food_brand'=> 'Dabartinis maistas',
			'birth_date'        => 'Gimimo data',
		);
		$eil = array();
		foreach ( $laukai as $L => $pav ) {
			$salyga = ( $L === 'current_weight_kg' )
				? "($L IS NULL OR $L<=0)"
				: "($L IS NULL OR $L='')";
			$n = (int) $wpdb->get_var( "SELECT COUNT(*) FROM $p p WHERE (p.status IS NULL OR p.status<>'deleted') $f AND $salyga" );
			$eil[] = array(
				esc_html( $pav ),
				number_format( $n, 0, ',', ' ' ),
				$U::juostele( $U::proc( $viso ? ( $n / $viso ) * 100 : 0 ), $viso ? ( $n / $viso ) * 100 : 0 ),
			);
		}
		echo '<h3 class="psru-h3">Ko trūksta profiliuose</h3>';
		$U::lentele( 'ank-truksta', array(
			array( 'pav' => 'Laukas', 'kaire' => 1 ), array( 'pav' => 'Profilių be reikšmės' ),
			array( 'pav' => 'Dalis' ),
		), $eil, array( 'paieska' => false, 'failas' => 'anketa-truksta.csv' ) );

		/* Brand zodyno bukle — tavo eile */
		$al = self::t( 'ps_brand_alias' );
		if ( self::lentele_yra( $al ) ) {
			$bs = $wpdb->get_results( "SELECT busena, COUNT(*) n FROM $al GROUP BY busena", ARRAY_A );
			$m = array(); foreach ( (array) $bs as $x ) { $m[ $x['busena'] ] = (int) $x['n']; }
			$rev = isset( $m['review'] ) ? $m['review'] : 0;
			$new = isset( $m['new'] ) ? $m['new'] : 0;
			$U::veiksmai( $rev + $new > 0 ? 'zyma' : 'gerai', 'Brand žodynas',
				( $rev + $new > 0 ) ? array( array(
					'pav'   => 'Peržiūrėti ' . ( $rev + $new ) . ' aliasų',
					'kodel' => 'REVIEW ' . $rev . ' · NEW ' . $new . ' · patvirtinta ' . ( isset( $m['auto'] ) ? $m['auto'] : 0 ) .
					           ' — <a href="' . esc_url( admin_url( 'admin.php?page=petshop-reports-brandai' ) ) . '">atidaryti eilę</a>',
				) ) : array(),
				'REVIEW eilė tuščia — visi kliento įvesti brandai susieti.' );
		}

		/* Lauku istorijos gyvybe */
		$fl = self::t( 'ps_pet_field_log' );
		if ( self::lentele_yra( $fl ) ) {
			$sh = $wpdb->get_results( $wpdb->prepare(
				"SELECT saltinis, COUNT(*) n FROM $fl WHERE DATE(laikas) BETWEEN %s AND %s GROUP BY saltinis ORDER BY n DESC",
				$lt['nuo'], $lt['iki'] ), ARRAY_A );
			$eil2 = array();
			foreach ( (array) $sh as $x ) { $eil2[] = array( esc_html( $x['saltinis'] ), number_format( (int) $x['n'], 0, ',', ' ' ) ); }
			echo '<h3 class="psru-h3">Laukų pakeitimai pagal šaltinį</h3>';
			$U::lentele( 'ank-saltiniai', array(
				array( 'pav' => 'Šaltinis', 'kaire' => 1 ), array( 'pav' => 'Pakeitimų' ),
			), $eil2, array( 'paieska' => false, 'failas' => 'anketa-saltiniai.csv' ) );
		}
	}

	/* ========== 5. REFILL / GYVYBINGUMAS ========== */

	private static function skiltis_5( $U, $lt ) {
		echo '<h2 class="psru-h2">5. Refill — ar priminimai virsta pirkimais</h2>';
		$r = self::ivykiai_intervale( 'refill', $lt['nuo'], $lt['iki'] );
		$due = self::sk( $r, 'refill_due' );
		$snt = self::sk( $r, 'refill_reminder_sent' );
		$prk = self::sk( $r, 'refill_purchase' );

		if ( ! $due && ! $snt && ! $prk ) {
			$U::spejimas( 'Šiuo laikotarpiu refill įvykių nėra. Sritis pildosi iš <code>ps_event_log</code> ir <code>ps_email_jobs</code> kas valandą.' );
			return;
		}
		$U::piltuvelis( array(
			array( 'pav' => 'Atėjo laikas papildyti', 'sk' => $due ),
			array( 'pav' => 'Išsiųstas priminimas',   'sk' => $snt ),
			array( 'pav' => 'Nupirko',                'sk' => $prk ),
		) );
		echo '<div class="psru-kpi">';
		$U::kpi( 'Priminimas → pirkimas', $U::proc( $snt ? ( $prk / $snt ) * 100 : 0 ), null,
			$U::maza_imtis( 'nuo išsiųstų', $snt ), 'Kiek priminimų baigėsi pirkimu per laikotarpį.' );
		$U::kpi( 'Priminimų neišsiųsta', number_format( max( 0, $due - $snt ), 0, ',', ' ' ), null,
			'nors laikas atėjo', 'Skirtumas rodo sutikimo, pristatymo arba srauto stabdžius.' );
		echo '</div>';
	}

	/* ========== 6. PINIGAI / COHORT ========== */

	private static function skiltis_6( $U, $lt ) {
		global $wpdb;
		echo '<h2 class="psru-h2">6. Pinigai: ar profilis keičia pirkimą</h2>';
		$riba = (int) $U::nustatymas( self::OPT_PINIGU_RIBA, 30 );
		$p = self::t( 'ps_pets' );

		$su_profiliu = (int) $wpdb->get_var( "SELECT COUNT(DISTINCT user_id) FROM $p p
			WHERE user_id>0 AND (p.status IS NULL OR p.status<>'deleted') " . self::test_filtras( 'p' ) );

		/* Uzsakymai per laikotarpi — HPOS ir senas kelias */
		$uzs = array();
		if ( function_exists( 'wc_get_orders' ) ) {
			$uzs = wc_get_orders( array(
				'limit' => 2000, 'status' => array( 'wc-processing', 'wc-completed' ),
				'date_created' => $lt['nuo'] . '...' . $lt['iki'], 'return' => 'objects',
			) );
		}
		$su = array( 'n' => 0, 'suma' => 0.0 ); $be = array( 'n' => 0, 'suma' => 0.0 );
		$profiliu_vart = array();
		foreach ( (array) $wpdb->get_col( "SELECT DISTINCT user_id FROM $p p WHERE user_id>0 " . self::test_filtras( 'p' ) ) as $u ) {
			$profiliu_vart[ (int) $u ] = true;
		}
		foreach ( (array) $uzs as $o ) {
			$uid = (int) $o->get_customer_id();
			$sum = (float) $o->get_total();
			if ( $uid && isset( $profiliu_vart[ $uid ] ) ) { $su['n']++; $su['suma'] += $sum; }
			else { $be['n']++; $be['suma'] += $sum; }
		}
		$viso_uzs = $su['n'] + $be['n'];

		echo '<div class="psru-kpi">';
		$U::kpi( 'Klientai su profiliu', number_format( $su_profiliu, 0, ',', ' ' ), null, '', '' );
		$U::kpi( 'Užsakymų laikotarpiu', number_format( $viso_uzs, 0, ',', ' ' ), null, '', '' );
		echo '</div>';

		if ( $viso_uzs < $riba ) {
			$U::spejimas(
				'<b>Duomenų dar nepakanka.</b> Palyginimui reikia bent ' . (int) $riba .
				' užsakymų per laikotarpį, dabar jų ' . (int) $viso_uzs .
				'. Skaičiai būtų triukšmas, ne signalas, todėl jų nerodome. Ribą keisi nustatymu <code>' .
				esc_html( self::OPT_PINIGU_RIBA ) . '</code>.' );
			return;
		}

		$vid_su = $su['n'] ? $su['suma'] / $su['n'] : 0;
		$vid_be = $be['n'] ? $be['suma'] / $be['n'] : 0;
		echo '<div class="psru-kpi">';
		$U::kpi( 'Vidutinis krepšelis — su profiliu', number_format( $vid_su, 2, ',', ' ' ) . ' €', null,
			$U::maza_imtis( $su['n'] . ' užsak.', $su['n'] ), '' );
		$U::kpi( 'Vidutinis krepšelis — be profilio', number_format( $vid_be, 2, ',', ' ' ) . ' €', null,
			$U::maza_imtis( $be['n'] . ' užsak.', $be['n'] ), '' );
		$U::kpi( 'Skirtumas', ( $vid_be > 0 ? $U::proc( ( ( $vid_su - $vid_be ) / $vid_be ) * 100 ) : '—' ), null,
			'su profiliu vs be', 'Tai PRISKYRIMAS, ne priežastingumas: profilį susikuria labiau įsitraukę klientai.' );
		echo '</div>';
		$U::spejimas( 'Skaičiai rodo <b>sąsają</b>, ne priežastį. Profilio turėjimas ir didesnis krepšelis gali turėti bendrą priežastį — įsitraukimą.' );
	}
}

Petshop_Anketos_Ataskaita::init();
