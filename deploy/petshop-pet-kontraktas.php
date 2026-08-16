<?php
/**
 * Plugin Name: Petshop Pet Kontraktas
 * Description: PET INTELLIGENCE DATA CONTRACT v1.1 schema ir brand zodynas (§1-§3, §5).
 * Version: 1.0
 *
 * NAUJAS modulis — i M8 koda nelendama (savininko procesas 2026-08-16).
 * Cia gyvena: schema (ps_pets papildymai + 3 naujos lenteles), brand alias
 * normalizavimas ir klasifikavimas, laukų istorijos rasymo API.
 *
 * NUKRYPIMAI NUO KONTRAKTO RAIDES (recon 2026-08-16, savininkas patvirtino
 * "daryk pagal instrukcijas" — visi trys ta pacia kryptimi: nekurti antro
 * stulpelio ten, kur duomuo jau yra):
 *  1. `current_food_brand_raw` NEKURIAMAS — esamas `current_food_brand` JAU
 *     yra pazodine kliento ivestis (Josera 7, Ontario 3...). Pridedami tik
 *     `current_food_brand_id`, `current_food_line_raw`,
 *     `current_food_product_id`, `questionnaire_version`.
 *  2. `is_sterilised` LIEKA varchar 'yes'/'no'/NULL — trys busenos jau
 *     veikia, tipo keitimas i 0/1 lauzytu skaitytojus be naudos.
 *  3. `sensitivities` LIEKA kableliu sarasas (chicken,dairy), NE JSON.
 *     Kontraktui svarbu unknown(NULL) / none('none') / known(sarasas) —
 *     formatas ne. Reiksme 'unknown' (1 sena eilute) skaitoma kaip unknown.
 *  4. canonical_id = Woo `product_brand` termino SLUG (pvz. royal-canin,
 *     ne royal_canin) — viena tiesa, be antro zodyno.
 *
 * SCHEMA:
 *  ps_pets            +4 stulpeliai (IF NOT EXISTS — MariaDB 10.6 palaiko)
 *  ps_pet_field_log   §2 — lauku istorija, AMZINAI
 *  ps_brand_alias     §3 — brand zodynas, AMZINAI
 *  ps_rec_log         §5 — sprendimu zurnalas, AMZINAI
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Pet_Kontraktas {

	const VERSIJA         = '1.0';
	const SCHEMOS_RAKTAS  = 'ps_pet_kontraktas_schema';
	const SCHEMOS_VERSIJA = 1;

	/* Klasifikavimo ribos — nustatymai, ne konstantos (DoD #8). Konstantos = DEFAULT. */
	const OPT_AUTO_RIBA   = 'ps_brand_auto_riba';    /* >= sio panasumo -> AUTO   */
	const OPT_REVIEW_RIBA = 'ps_brand_review_riba';  /* >= sio panasumo -> REVIEW */
	const AUTO_RIBA   = 0.92;
	const REVIEW_RIBA = 0.62;
	/** Trumpesnes ivestys niekada ne-AUTO (kontraktas: "RC" netvirtinama automatiskai). */
	const MIN_AUTO_ILGIS = 4;

	public static function init() {
		add_action( 'init', array( __CLASS__, 'uztikrinti_schema' ), 4 );
	}

	/* ==================== LENTELES ==================== */

	public static function lentele_field_log() { global $wpdb; return $wpdb->prefix . 'ps_pet_field_log'; }
	public static function lentele_alias()     { global $wpdb; return $wpdb->prefix . 'ps_brand_alias'; }
	public static function lentele_rec_log()   { global $wpdb; return $wpdb->prefix . 'ps_rec_log'; }
	public static function lentele_pets()      { global $wpdb; return $wpdb->prefix . 'ps_pets'; }

	public static function uztikrinti_schema() {
		if ( (int) get_option( self::SCHEMOS_RAKTAS ) >= self::SCHEMOS_VERSIJA ) { return; }
		global $wpdb;
		$c    = $wpdb->get_charset_collate();
		$pets = self::lentele_pets();

		/* Jei ps_pets dar neegzistuoja (svari instaliacija) — ne musu darbas ja kurti. */
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$pets'" ) !== $pets ) { return; }

		/* §1.2 — nauji stulpeliai. IF NOT EXISTS: pakartotinis paleidimas saugus. */
		$wpdb->query( "ALTER TABLE $pets
			ADD COLUMN IF NOT EXISTS questionnaire_version VARCHAR(16) NULL,
			ADD COLUMN IF NOT EXISTS current_food_brand_id VARCHAR(64) NULL,
			ADD COLUMN IF NOT EXISTS current_food_line_raw VARCHAR(190) NULL,
			ADD COLUMN IF NOT EXISTS current_food_product_id BIGINT UNSIGNED NULL" );

		$fl = self::lentele_field_log();
		$wpdb->query( "CREATE TABLE IF NOT EXISTS $fl (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			pet_id BIGINT UNSIGNED NOT NULL,
			laukas VARCHAR(64) NOT NULL,
			buvo TEXT NULL,
			tapo TEXT NULL,
			saltinis VARCHAR(24) NOT NULL DEFAULT '',
			questionnaire_version VARCHAR(16) NULL,
			user_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			laikas DATETIME NOT NULL,
			PRIMARY KEY (id),
			KEY pet (pet_id),
			KEY laukas (laukas),
			KEY laikas (laikas)
		) $c" );

		$al = self::lentele_alias();
		$wpdb->query( "CREATE TABLE IF NOT EXISTS $al (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			alias VARCHAR(190) NOT NULL,
			canonical_id VARCHAR(64) NOT NULL DEFAULT '',
			busena ENUM('auto','review','new') NOT NULL DEFAULT 'review',
			confidence DECIMAL(3,2) NOT NULL DEFAULT 0.00,
			patvirtino BIGINT UNSIGNED NULL,
			sukurta DATETIME NOT NULL,
			atnaujinta DATETIME NOT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY alias (alias),
			KEY busena (busena)
		) $c" );

		$rl = self::lentele_rec_log();
		$wpdb->query( "CREATE TABLE IF NOT EXISTS $rl (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			recommendation_id CHAR(20) NOT NULL,
			pet_id BIGINT UNSIGNED NOT NULL,
			user_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			laikas DATETIME NOT NULL,
			engine_version VARCHAR(16) NOT NULL DEFAULT '',
			rezultatas ENUM('ok','fallback','failed') NOT NULL,
			reason_code VARCHAR(32) NULL,
			kandidatu_sk SMALLINT UNSIGNED NOT NULL DEFAULT 0,
			parodyti_ids TEXT NULL,
			inputs_json TEXT NULL,
			input_hash CHAR(32) NOT NULL DEFAULT '',
			PRIMARY KEY (id),
			UNIQUE KEY rec (recommendation_id),
			KEY pet (pet_id),
			KEY laikas (laikas),
			KEY hash (input_hash)
		) $c" );

		/* Sekmes salyga: visos trys lenteles realiai egzistuoja. */
		foreach ( array( $fl, $al, $rl ) as $t ) {
			if ( $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) !== $t ) { return; }
		}
		update_option( self::SCHEMOS_RAKTAS, self::SCHEMOS_VERSIJA, false );
	}

	/* ==================== BRAND ZODYNAS (§3) ==================== */

	/** Normalizavimas: mazosios, be tarpu ir skyrybos. "Royal Canin" -> "royalcanin". */
	public static function normalizuoti( $raw ) {
		$s = mb_strtolower( trim( (string) $raw ), 'UTF-8' );
		$s = preg_replace( '/[^a-z0-9\p{L}]+/u', '', $s );
		return mb_substr( $s, 0, 190, 'UTF-8' );
	}

	public static function auto_riba() {
		$v = (float) get_option( self::OPT_AUTO_RIBA, self::AUTO_RIBA );
		return ( $v > 0 && $v <= 1 ) ? $v : self::AUTO_RIBA;
	}
	public static function review_riba() {
		$v = (float) get_option( self::OPT_REVIEW_RIBA, self::REVIEW_RIBA );
		return ( $v > 0 && $v <= 1 ) ? $v : self::REVIEW_RIBA;
	}

	/** Canonical katalogas is Woo product_brand: [normalizuotas => ['id'=>slug,'name'=>..]]. */
	public static function canonical_katalogas() {
		static $k = null;
		if ( $k !== null ) { return $k; }
		$k = array();
		$ts = get_terms( array( 'taxonomy' => 'product_brand', 'hide_empty' => false, 'number' => 1000 ) );
		if ( is_array( $ts ) ) {
			foreach ( $ts as $t ) {
				$k[ self::normalizuoti( $t->name ) ] = array( 'id' => $t->slug, 'name' => $t->name );
				/* slug kaip antras raktas — "cat's best" vs slug cats_best */
				$ks = self::normalizuoti( $t->slug );
				if ( ! isset( $k[ $ks ] ) ) { $k[ $ks ] = array( 'id' => $t->slug, 'name' => $t->name ); }
			}
		}
		return $k;
	}

	/**
	 * Klasifikuoja raw ivesti. Grazina:
	 * ['alias','canonical_id','busena'(auto|review|new),'confidence','kandidatas_name']
	 * NIEKO neraso i DB — rasymas atskirai (dry-run pirma).
	 */
	public static function klasifikuoti( $raw ) {
		$alias = self::normalizuoti( $raw );
		$out = array( 'alias' => $alias, 'canonical_id' => '', 'busena' => 'new', 'confidence' => 0.0, 'kandidatas_name' => '' );
		if ( $alias === '' ) { return $out; }

		$kat = self::canonical_katalogas();

		/* 1. Tikslus sutapimas */
		if ( isset( $kat[ $alias ] ) ) {
			$out['canonical_id']    = $kat[ $alias ]['id'];
			$out['kandidatas_name'] = $kat[ $alias ]['name'];
			$out['confidence']      = 1.00;
			$out['busena'] = ( mb_strlen( $alias, 'UTF-8' ) >= self::MIN_AUTO_ILGIS ) ? 'auto' : 'review';
			return $out;
		}

		/* 2. Panasumo paieska */
		$best = 0.0; $best_id = ''; $best_name = '';
		foreach ( $kat as $norm => $info ) {
			similar_text( $alias, $norm, $proc );
			$p = $proc / 100;
			/* pradzios sutapimas sveria papildomai: "joser" ~ "josera" */
			if ( strpos( $norm, $alias ) === 0 || strpos( $alias, $norm ) === 0 ) { $p = max( $p, 0.90 ); }
			if ( $p > $best ) { $best = $p; $best_id = $info['id']; $best_name = $info['name']; }
		}
		$out['confidence']      = round( $best, 2 );
		$out['canonical_id']    = $best_id;
		$out['kandidatas_name'] = $best_name;

		if ( $best >= self::auto_riba() && mb_strlen( $alias, 'UTF-8' ) >= self::MIN_AUTO_ILGIS ) {
			$out['busena'] = 'auto';
		} elseif ( $best >= self::review_riba() ) {
			$out['busena'] = 'review';
		} else {
			$out['busena'] = 'new';
			$out['canonical_id'] = '';
		}
		return $out;
	}

	/**
	 * Iraso/atnaujina alias eilute. Patvirtinto zmogaus (patvirtino IS NOT NULL)
	 * irasas NIEKADA neperrasomas automatikos.
	 */
	public static function irasyti_alias( $raw, $kl = null, $user_id = null ) {
		global $wpdb;
		$t  = self::lentele_alias();
		$kl = $kl ? $kl : self::klasifikuoti( $raw );
		if ( $kl['alias'] === '' ) { return false; }
		$yra = $wpdb->get_row( $wpdb->prepare( "SELECT id, patvirtino FROM $t WHERE alias=%s", $kl['alias'] ), ARRAY_A );
		$dabar = current_time( 'mysql', true );
		if ( $yra ) {
			if ( $yra['patvirtino'] !== null ) { return (int) $yra['id']; } /* zmogus laimi */
			$wpdb->update( $t, array(
				'canonical_id' => $kl['canonical_id'], 'busena' => $kl['busena'],
				'confidence' => $kl['confidence'], 'atnaujinta' => $dabar,
			), array( 'id' => $yra['id'] ) );
			return (int) $yra['id'];
		}
		$wpdb->insert( $t, array(
			'alias' => $kl['alias'], 'canonical_id' => $kl['canonical_id'],
			'busena' => $kl['busena'], 'confidence' => $kl['confidence'],
			'patvirtino' => $user_id, 'sukurta' => $dabar, 'atnaujinta' => $dabar,
		) );
		return (int) $wpdb->insert_id;
	}

	/* ==================== LAUKU ISTORIJA (§2) ==================== */

	/** Vienintelis rasymo kelias i ps_pet_field_log — visi kabliukai eis per cia. */
	public static function log_lauka( $pet_id, $laukas, $buvo, $tapo, $saltinis, $user_id = 0, $qv = null ) {
		global $wpdb;
		if ( (string) $buvo === (string) $tapo ) { return 0; } /* nepakito — nerasom triuksmo */
		$wpdb->insert( self::lentele_field_log(), array(
			'pet_id'  => (int) $pet_id,
			'laukas'  => sanitize_key( $laukas ),
			'buvo'    => is_null( $buvo ) ? null : (string) $buvo,
			'tapo'    => is_null( $tapo ) ? null : (string) $tapo,
			'saltinis' => sanitize_key( $saltinis ),
			'questionnaire_version' => $qv ? sanitize_text_field( $qv ) : null,
			'user_id' => (int) $user_id,
			'laikas'  => current_time( 'mysql', true ),
		) );
		return (int) $wpdb->insert_id;
	}
}

Petshop_Pet_Kontraktas::init();
