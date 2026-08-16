<?php
/**
 * Plugin Name: Petshop Rec Variklis
 * Description: Rekomendaciju variklis v1 — GET /petshop/v1/pet-recommendations/{pet_id}. Profilio faktai x produkto deklaruoti pozymiai x verifikuotos serimo lenteles.
 * Version: 1.1
 *
 * PRINCIPAS: siulom TIK sausa maista su verifikuota serimo lentele — jei
 * negalim suskaiciuoti paros normos ir €/d, nesiulom (geriau nesiulyti, nei
 * siulyti sulauzyta — ta pati logika kaip S232 rinkiniu isimtis).
 *
 * KIETI FILTRAI (eile fiksuota, kritimo vieta = reason_code):
 *  1. rusis dog|cat                     -> species_unsupported
 *  2. life_stage / svoris privalomi     -> missing_life_stage | missing_weight
 *  3. publish + pa_gyvuno_rusis + AKTYVI VERIFIKUOTA lentele
 *     (rusies prekiu nera -> no_product_for_need; yra, bet be lenteliu -> no_feeding_table)
 *  4. jautrumu konfliktas (TIK deklaruoti faktai):
 *       chicken -> vistiena, paukstiena       beef -> jautiena
 *       fish    -> lasisa, tunas, zuvis-balta  grains -> su-grudais, su-ryziais
 *     dairy pozymio taksonomijose NERA -> pagal fakta konflikto nefiksuojam
 *     (S230 principas: tikrinam tik tai, ka gamintojas deklaravo)
 *                                        -> sensitivity_conflict
 *  5. amzius: jei preke TURI pa_amzius ir ne viena nesutampa -> salinam
 *     (be pozymio — praleidziam, kitaip aprepiamumas suluztu); istustino -> no_product_for_need
 *  6. likutis                            -> out_of_stock
 *
 * MINKSTAS RUSIAVIMAS (svoriai — option ps_variklio_svoriai, DoD #8):
 *  need_match +3 (primary_need -> pa_speciali_mityba), steril +1
 *  (sterilizuotiems, kai is_sterilised=yes), mono +1 (pa_monoprotein, kai
 *  jautrumai zinomi), hipo +1 (hipoalerginis, kai jautrumai zinomi);
 *  lygiosios -> pigesnis pirmiau. primary_need NEBLOKUOJA (§1.3).
 *
 * v1.1 (7 punktas, savininko strateginiam sprendimui): marzos svoris
 * 'marza' — DEFAULT 0 (ISJUNGTA, niekas nesikeicia). Ijungus (>0), bonusas
 * kandidatams, kuriu apytiksle marza >= ps_variklio_marza_min (default 30%%).
 * Savikaina: _cost_price -> _vf_cost -> _zb_cost (NET, x1.21 PVM aproksimacija
 * — dokumentuota kaip apytiksle, ne buhalterine).
 *
 * Atsakymas nesa engine_version/inputs/reason — juos i ps_rec_log raso
 * petshop-rec-log (v1.2) tuo paciu §5 mechanizmu.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Rec_Variklis {

	const VERSIJA        = '1.1';
	const ENGINE_VERSION = 'variklis_v1';
	const OPT_SVORIAI    = 'ps_variklio_svoriai';
	const OPT_KIEK       = 'ps_variklio_kiek';

	const SENS_MAP = array(
		'chicken' => array( 'tax' => 'pa_baltymu_saltinis', 'terms' => array( 'vistiena', 'paukstiena' ) ),
		'beef'    => array( 'tax' => 'pa_baltymu_saltinis', 'terms' => array( 'jautiena' ) ),
		'fish'    => array( 'tax' => 'pa_baltymu_saltinis', 'terms' => array( 'lasisa', 'tunas', 'zuvis-balta' ) ),
		'grains'  => array( 'tax' => 'pa_be_grudu',         'terms' => array( 'su-grudais', 'su-ryziais' ) ),
	);
	const NEED_MAP = array(
		'digestion'      => 'jautriam-virskinimui',
		'weight_control' => 'svorio-kontrolei',
		'skin_coat'      => 'odai-ir-kailiui',
		'joints'         => 'sanariams',
		'urinary'        => 'slapimo-takams',
	);
	const RUSIS = array( 'dog' => 'sunims', 'cat' => 'katems' );
	const AMZIUS = array( 'junior' => array( 'jauniems' ), 'adult' => array( 'suaugusiems' ), 'senior' => array( 'senyviems', 'senjorams' ) );

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
	}

	public static function routes() {
		register_rest_route( 'petshop/v1', '/pet-recommendations/(?P<id>\d+)', array(
			'methods'  => 'GET',
			'callback' => array( __CLASS__, 'rekomenduoti' ),
			'permission_callback' => function () { return is_user_logged_in(); },
		) );
	}

	public static function svoriai() {
		$d = array( 'need' => 3, 'steril' => 1, 'mono' => 1, 'hipo' => 1, 'marza' => 0 );
		$o = get_option( self::OPT_SVORIAI, array() );
		return is_array( $o ) ? array_merge( $d, array_map( 'intval', $o ) ) : $d;
	}

	private static function atsakymas( $rezultatas, $reason, $kandidatai, $inputs, $debug = null ) {
		$r = array(
			'ok'             => true,
			'engine_version' => self::ENGINE_VERSION,
			'rezultatas'     => $rezultatas,
			'reason'         => $reason,
			'inputs'         => $inputs,
			'candidates'     => $kandidatai,
		);
		if ( $debug !== null ) { $r['debug'] = $debug; }
		return rest_ensure_response( $r );
	}

	public static function rekomenduoti( $req ) {
		global $wpdb;
		$P   = $wpdb->prefix;
		$pet = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$P}ps_pets WHERE id=%d", (int) $req['id'] ), ARRAY_A );
		if ( ! $pet ) { return new WP_Error( 'not_found', 'Augintinis nerastas.', array( 'status' => 404 ) ); }

		$sens = array();
		if ( $pet['sensitivities'] !== null && $pet['sensitivities'] !== '' && $pet['sensitivities'] !== 'none' && $pet['sensitivities'] !== 'unknown' ) {
			$sens = array_filter( array_map( 'trim', explode( ',', $pet['sensitivities'] ) ) );
		}
		$inputs = array(
			'species'       => $pet['species'],
			'life_stage'    => $pet['life_stage'],
			'weight_kg'     => $pet['current_weight_kg'] !== null ? (float) $pet['current_weight_kg'] : null,
			'sensitivities' => $sens ? array_values( $sens ) : ( $pet['sensitivities'] === 'none' ? 'none' : 'unknown' ),
			'primary_need'  => $pet['primary_need'],
			'is_sterilised' => $pet['is_sterilised'],
		);
		$dbg = isset( $_GET['dbg'] ) ? array() : null;

		/* 1-2. Kieti profilio reikalavimai */
		if ( ! isset( self::RUSIS[ $pet['species'] ] ) ) { return self::atsakymas( 'failed', 'species_unsupported', array(), $inputs, $dbg ); }
		if ( empty( $pet['life_stage'] ) )               { return self::atsakymas( 'failed', 'missing_life_stage', array(), $inputs, $dbg ); }
		if ( empty( $pet['current_weight_kg'] ) || (float) $pet['current_weight_kg'] <= 0 ) {
			return self::atsakymas( 'failed', 'missing_weight', array(), $inputs, $dbg );
		}

		/* 3. Baze: publish + rusis + aktyvi verifikuota lentele */
		$rusis = self::RUSIS[ $pet['species'] ];
		$rusies_viso = (int) $wpdb->get_var( $wpdb->prepare( "
			SELECT COUNT(DISTINCT p.ID) FROM {$P}posts p
			JOIN {$P}term_relationships tr ON tr.object_id=p.ID
			JOIN {$P}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='pa_gyvuno_rusis'
			JOIN {$P}terms t ON t.term_id=tt.term_id AND t.slug=%s
			WHERE p.post_type='product' AND p.post_status='publish'", $rusis ) );
		$pool = $wpdb->get_col( $wpdb->prepare( "
			SELECT DISTINCT p.ID FROM {$P}posts p
			JOIN {$P}term_relationships tr ON tr.object_id=p.ID
			JOIN {$P}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='pa_gyvuno_rusis'
			JOIN {$P}terms t ON t.term_id=tt.term_id AND t.slug=%s
			JOIN {$P}ps_feeding_map fm ON fm.product_id=p.ID AND fm.is_active=1
			JOIN {$P}ps_feeding_tables ft ON ft.id=fm.feeding_table_id AND ft.status='verified' AND ft.is_active=1
			WHERE p.post_type='product' AND p.post_status='publish'", $rusis ) );
		$pool = array_map( 'intval', (array) $pool );
		if ( $dbg !== null ) { $dbg['rusies_viso'] = $rusies_viso; $dbg['su_lentele'] = count( $pool ); }
		if ( ! $pool ) {
			return self::atsakymas( 'failed', $rusies_viso ? 'no_feeding_table' : 'no_product_for_need', array(), $inputs, $dbg );
		}

		/* 4. Jautrumai — tik deklaruoti faktai */
		if ( $sens ) {
			$po = array();
			foreach ( $pool as $pid ) { if ( ! self::konfliktas( $pid, $sens ) ) { $po[] = $pid; } }
			if ( $dbg !== null ) { $dbg['po_jautrumu'] = count( $po ); }
			if ( ! $po ) { return self::atsakymas( 'failed', 'sensitivity_conflict', array(), $inputs, $dbg ); }
			$pool = $po;
		}

		/* 5. Amzius: preke su pa_amzius pozymiu privalo sutapti */
		$leisti = isset( self::AMZIUS[ $pet['life_stage'] ] ) ? self::AMZIUS[ $pet['life_stage'] ] : array();
		if ( $leisti ) {
			$po = array();
			foreach ( $pool as $pid ) {
				$am = wp_get_object_terms( $pid, 'pa_amzius', array( 'fields' => 'slugs' ) );
				if ( is_wp_error( $am ) || ! $am || array_intersect( $leisti, $am ) ) { $po[] = $pid; }
			}
			if ( $dbg !== null ) { $dbg['po_amziaus'] = count( $po ); }
			if ( ! $po ) { return self::atsakymas( 'failed', 'no_product_for_need', array(), $inputs, $dbg ); }
			$pool = $po;
		}

		/* 6. Likutis */
		$gyvi = array();
		foreach ( $pool as $pid ) { $pr = wc_get_product( $pid ); if ( $pr && $pr->is_in_stock() ) { $gyvi[ $pid ] = $pr; } }
		if ( $dbg !== null ) { $dbg['po_likucio'] = count( $gyvi ); }
		if ( ! $gyvi ) { return self::atsakymas( 'failed', 'out_of_stock', array(), $inputs, $dbg ); }

		/* Minkstas rusiavimas */
		$w = self::svoriai();
		$need_term = ( $pet['primary_need'] && isset( self::NEED_MAP[ $pet['primary_need'] ] ) ) ? self::NEED_MAP[ $pet['primary_need'] ] : '';
		$eiles = array();
		foreach ( $gyvi as $pid => $pr ) {
			$sm = wp_get_object_terms( $pid, 'pa_speciali_mityba', array( 'fields' => 'slugs' ) );
			$sm = is_wp_error( $sm ) ? array() : $sm;
			$score = 0;
			$nm = ( $need_term && in_array( $need_term, $sm, true ) );
			if ( $nm ) { $score += $w['need']; }
			if ( $pet['is_sterilised'] === 'yes' && in_array( 'sterilizuotiems', $sm, true ) ) { $score += $w['steril']; }
			if ( $sens ) {
				$mono = wp_get_object_terms( $pid, 'pa_monoprotein', array( 'fields' => 'slugs' ) );
				if ( ! is_wp_error( $mono ) && $mono ) { $score += $w['mono']; }
				if ( in_array( 'hipoalerginis', $sm, true ) ) { $score += $w['hipo']; }
			}
			if ( ! empty( $w['marza'] ) ) {
				$kaina = (float) wc_get_price_to_display( $pr );
				$sav = 0.0;
				foreach ( array( '_cost_price', '_vf_cost', '_zb_cost' ) as $mk ) {
					$v = get_post_meta( $pid, $mk, true );
					if ( $v !== '' && $v !== false ) { $sav = (float) str_replace( ',', '.', $v ); break; }
				}
				if ( $sav > 0 && $kaina > 0 ) {
					$marza = ( $kaina - $sav * 1.21 ) / $kaina * 100;
					$min = (float) get_option( 'ps_variklio_marza_min', 30 );
					if ( $marza >= $min ) { $score += (int) $w['marza']; }
				}
			}
			$eiles[] = array( 'pid' => $pid, 'pr' => $pr, 'score' => $score, 'need' => $nm ? 1 : 0, 'kaina' => (float) wc_get_price_to_display( $pr ) );
		}
		usort( $eiles, function ( $a, $b ) {
			if ( $a['score'] !== $b['score'] ) { return $b['score'] - $a['score']; }
			if ( $a['need'] !== $b['need'] )   { return $b['need'] - $a['need']; }
			return ( $a['kaina'] < $b['kaina'] ) ? -1 : 1;
		} );

		$kiek = max( 1, min( 10, (int) get_option( self::OPT_KIEK, 3 ) ) );
		$out = array();
		foreach ( array_slice( $eiles, 0, $kiek ) as $e ) {
			$out[] = self::payload( $e['pr'], $e['score'], $e['need'] );
		}
		return self::atsakymas( 'ok', null, $out, $inputs, $dbg );
	}

	private static function konfliktas( $pid, $sens ) {
		foreach ( $sens as $s ) {
			if ( ! isset( self::SENS_MAP[ $s ] ) ) { continue; } /* dairy ir pan. — pozymio nera */
			$m = self::SENS_MAP[ $s ];
			$t = wp_get_object_terms( $pid, $m['tax'], array( 'fields' => 'slugs' ) );
			if ( ! is_wp_error( $t ) && $t && array_intersect( $m['terms'], $t ) ) { return true; }
		}
		return false;
	}

	private static function payload( $pr, $score, $need_match ) {
		$pid = $pr->get_id();
		$img = $pr->get_image_id();
		$ps  = wp_get_object_terms( $pid, 'pa_baltymu_saltinis', array( 'fields' => 'names' ) );
		return array(
			'product_id' => $pid,
			'name'       => $pr->get_name(),
			'sku'        => $pr->get_sku(),
			'package'    => $pr->get_attribute( 'pa_pakuotes_dydis' ),
			'price'      => wc_get_price_to_display( $pr ),
			'image'      => $img ? wp_get_attachment_image_url( $img, 'thumbnail' ) : null,
			'permalink'  => get_permalink( $pid ),
			'in_stock'   => true,
			'protein_sources' => is_wp_error( $ps ) ? array() : $ps,
			'score'      => $score,
			'need_match' => $need_match ? true : false,
		);
	}
}

Petshop_Rec_Variklis::init();
