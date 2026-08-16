<?php
/**
 * Plugin Name: Petshop Pet Kontraktas
 * Description: PET INTELLIGENCE DATA CONTRACT v1.1 schema ir brand zodynas (§1-§3, §5).
 * Version: 1.2
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
 * v1.1 (§7 GDPR + DoD #4/#10):
 *  - schema v2: field_log ir rec_log `user_id` leidzia NULL (anonimizacijai);
 *  - GDPR jungiklis `ps_gdpr_rezimas` (anonimizuoti|trinti, DEFAULT anonimizuoti,
 *    galutini zodi taria teisininkas) + kabliukas ant `delete_user`.
 *    ps_laukai_ivykiai anonimizacija = user_id 0 (ten 0 IR YRA anonimas);
 *  - Brand REVIEW eile adminui: Petshop ataskaitos -> "Brand zodynas"
 *    (parent 'petshop-reports'), patvirtinimas vienu paspaudimu, patvirtintas
 *    aliasas nebeperrasomas automatikos (irasyti_alias tai jau saugo).
 *
 * v1.2 (dvi spragos, rastos savininko klausus "kas pildys zodyna"):
 *  (a) SEKLA BUVO VIENKARTINE — pridejus nauja brenda i WooCommerce zodynas
 *      apie ji nesuzinodavo, kol kas nors jo neirasydavo anketoje, ir TAVO
 *      turimas brendas keliaudavo per REVIEW eile. Dabar kabliukas ant
 *      `created_product_brand` / `edited_product_brand` iraso ji kaip AUTO
 *      is karto. Papildomai `sekla_is_katalogo()` — vienkartinis pilnas
 *      suvienodinimas (kvieciamas is admin mygtuko).
 *  (b) NEBUVO "tai ne brendas" — siuksles ("testas", atsitiktinis tekstas)
 *      kabodavo NEW eileje amzinai. Prideta busena `atmesta`: eiluteje lieka
 *      (kad tas pats tekstas nebegrizt), bet is darbo eiles dingsta.
 *
 * SCHEMA:
 *  ps_pets            +4 stulpeliai (IF NOT EXISTS — MariaDB 10.6 palaiko)
 *  ps_pet_field_log   §2 — lauku istorija, AMZINAI
 *  ps_brand_alias     §3 — brand zodynas, AMZINAI
 *  ps_rec_log         §5 — sprendimu zurnalas, AMZINAI
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Pet_Kontraktas {

	const VERSIJA         = '1.2';
	const SCHEMOS_RAKTAS  = 'ps_pet_kontraktas_schema';
	const SCHEMOS_VERSIJA = 3;

	/* Klasifikavimo ribos — nustatymai, ne konstantos (DoD #8). Konstantos = DEFAULT. */
	const OPT_AUTO_RIBA   = 'ps_brand_auto_riba';    /* >= sio panasumo -> AUTO   */
	const OPT_REVIEW_RIBA = 'ps_brand_review_riba';  /* >= sio panasumo -> REVIEW */
	const AUTO_RIBA   = 0.92;
	const REVIEW_RIBA = 0.62;
	/** Trumpesnes ivestys niekada ne-AUTO (kontraktas: "RC" netvirtinama automatiskai). */
	const MIN_AUTO_ILGIS = 4;

	const OPT_GDPR = 'ps_gdpr_rezimas'; /* anonimizuoti | trinti */
	const ADMIN_SLUG = 'petshop-reports-brandai';

	public static function init() {
		add_action( 'init', array( __CLASS__, 'uztikrinti_schema' ), 4 );
		add_action( 'delete_user', array( __CLASS__, 'gdpr_vartotojas' ), 5 );
		add_action( 'admin_menu', array( __CLASS__, 'admin_meniu' ), 40 );
		add_action( 'admin_post_ps_brand_veiksmas', array( __CLASS__, 'admin_veiksmas' ) );
		/* (a) naujas brendas kataloge -> iskart i zodyna kaip AUTO */
		add_action( 'created_product_brand', array( __CLASS__, 'brendas_sukurtas' ), 10, 2 );
		add_action( 'edited_product_brand', array( __CLASS__, 'brendas_sukurtas' ), 10, 2 );
	}

	/* ==================== GDPR (§7, DoD #10) ==================== */

	public static function gdpr_rezimas() {
		$r = get_option( self::OPT_GDPR, 'anonimizuoti' );
		return ( $r === 'trinti' ) ? 'trinti' : 'anonimizuoti';
	}

	/**
	 * Vienas jungiklis, du keliai. Anonimizacija: istorija LIEKA be asmens
	 * (user_id -> NULL; ps_laukai_ivykiai -> 0, nes ten 0 = anonimas pagal
	 * dizaina). ps_pets eilute lieka analitikai, bet asmens laukai isvalomi.
	 * Trynimas: pets + field_log + rec_log salinami; elgsenos ivykiai
	 * nuasmeninami (jie ir taip be turinio apie asmeni).
	 */
	public static function gdpr_vartotojas( $user_id ) {
		global $wpdb;
		$uid = (int) $user_id;
		if ( $uid <= 0 ) { return array(); }
		$P  = $wpdb->prefix;
		$re = self::gdpr_rezimas();
		$k  = array( 'rezimas' => $re );
		if ( $re === 'trinti' ) {
			$petai = $wpdb->get_col( $wpdb->prepare( "SELECT id FROM {$P}ps_pets WHERE user_id=%d", $uid ) );
			$k['field_log'] = (int) $wpdb->query( $wpdb->prepare( "DELETE FROM {$P}ps_pet_field_log WHERE user_id=%d", $uid ) );
			if ( $petai ) {
				$in = implode( ',', array_map( 'intval', $petai ) );
				$k['field_log'] += (int) $wpdb->query( "DELETE FROM {$P}ps_pet_field_log WHERE pet_id IN ($in)" );
			}
			$k['rec_log'] = (int) $wpdb->query( $wpdb->prepare( "DELETE FROM {$P}ps_rec_log WHERE user_id=%d", $uid ) );
			$k['pets']    = (int) $wpdb->query( $wpdb->prepare( "DELETE FROM {$P}ps_pets WHERE user_id=%d", $uid ) );
			$k['ivykiai'] = (int) $wpdb->query( $wpdb->prepare( "UPDATE {$P}ps_laukai_ivykiai SET user_id=0 WHERE user_id=%d", $uid ) );
			return $k;
		}
		$k['field_log'] = (int) $wpdb->query( $wpdb->prepare( "UPDATE {$P}ps_pet_field_log SET user_id=NULL WHERE user_id=%d", $uid ) );
		$k['rec_log']   = (int) $wpdb->query( $wpdb->prepare( "UPDATE {$P}ps_rec_log SET user_id=NULL WHERE user_id=%d", $uid ) );
		$k['ivykiai']   = (int) $wpdb->query( $wpdb->prepare( "UPDATE {$P}ps_laukai_ivykiai SET user_id=0 WHERE user_id=%d", $uid ) );
		$k['pets']      = (int) $wpdb->query( $wpdb->prepare(
			"UPDATE {$P}ps_pets SET pet_name=NULL, birth_date=NULL, photo_file_id=NULL,
			 species_detail=NULL, current_food_free_text=NULL, client_ref=NULL,
			 source_draft_id=NULL, status='deleted', updated_at=UTC_TIMESTAMP()
			 WHERE user_id=%d", $uid ) );
		return $k;
	}

	/* ==================== BRAND REVIEW ADMIN (DoD #4) ==================== */

	/**
	 * (a) Naujas ar pervadintas `product_brand` terminas — iskart i zodyna.
	 * Zmogaus patvirtintu irasu NELIECIAM (irasyti_alias tai saugo).
	 */
	public static function brendas_sukurtas( $term_id, $tt_id = 0 ) {
		$t = get_term( (int) $term_id, 'product_brand' );
		if ( ! $t || is_wp_error( $t ) ) { return; }
		self::sekla_terminui( $t );
	}

	private static function sekla_terminui( $t ) {
		global $wpdb;
		$dabar = current_time( 'mysql', true );
		$n = 0;
		foreach ( array( $t->name, $t->slug ) as $sal ) {
			$a = self::normalizuoti( $sal );
			if ( $a === '' ) { continue; }
			$yra = $wpdb->get_row( $wpdb->prepare(
				"SELECT id, patvirtino, busena FROM " . self::lentele_alias() . " WHERE alias=%s", $a ), ARRAY_A );
			if ( $yra ) {
				/* Zmogaus sprendimas — sventas. Atmestu irgi neprikeliam. */
				if ( $yra['patvirtino'] !== null || $yra['busena'] === 'atmesta' ) { continue; }
				$wpdb->update( self::lentele_alias(), array(
					'canonical_id' => $t->slug, 'busena' => 'auto', 'confidence' => 1.00, 'atnaujinta' => $dabar,
				), array( 'id' => $yra['id'] ) );
				$n++;
				continue;
			}
			$wpdb->query( $wpdb->prepare(
				"INSERT IGNORE INTO " . self::lentele_alias() . "
				 (alias,canonical_id,busena,confidence,patvirtino,sukurta,atnaujinta)
				 VALUES (%s,%s,'auto',1.00,NULL,%s,%s)", $a, $t->slug, $dabar, $dabar ) );
			$n++;
		}
		return $n;
	}

	/** Vienkartinis pilnas suvienodinimas — is admin mygtuko. */
	public static function sekla_is_katalogo() {
		$ts = get_terms( array( 'taxonomy' => 'product_brand', 'hide_empty' => false, 'number' => 1000 ) );
		$n = 0;
		if ( is_array( $ts ) ) { foreach ( $ts as $t ) { $n += (int) self::sekla_terminui( $t ); } }
		return $n;
	}

	/** (b) "Tai ne brendas" — eilute lieka, bet is darbo eiles dingsta. */
	public static function atmesti_alias( $alias_id, $user_id ) {
		global $wpdb;
		return false !== $wpdb->update( self::lentele_alias(), array(
			'canonical_id' => '', 'busena' => 'atmesta', 'confidence' => 0.00,
			'patvirtino' => (int) $user_id, 'atnaujinta' => current_time( 'mysql', true ),
		), array( 'id' => (int) $alias_id ) );
	}

	public static function admin_meniu() {
		add_submenu_page( 'petshop-reports', 'Brand zodynas', 'Brand zodynas',
			'manage_woocommerce', self::ADMIN_SLUG, array( __CLASS__, 'admin_render' ) );
	}

	public static function patvirtinti_alias( $alias_id, $canonical_id, $user_id ) {
		global $wpdb;
		$canonical_id = sanitize_title( $canonical_id );
		if ( $canonical_id === '' ) { return false; }
		return false !== $wpdb->update( self::lentele_alias(), array(
			'canonical_id' => $canonical_id, 'busena' => 'auto', 'confidence' => 1.00,
			'patvirtino' => (int) $user_id, 'atnaujinta' => current_time( 'mysql', true ),
		), array( 'id' => (int) $alias_id ) );
	}

	public static function admin_veiksmas() {
		if ( ! current_user_can( 'manage_woocommerce' ) ) { wp_die( 'teises' ); }
		check_admin_referer( 'ps_brand_veiksmas' );
		$id  = isset( $_POST['alias_id'] ) ? (int) $_POST['alias_id'] : 0;
		$can = isset( $_POST['canonical_id'] ) ? sanitize_title( wp_unslash( $_POST['canonical_id'] ) ) : '';
		$veiksmas = isset( $_POST['ps_veiksmas'] ) ? sanitize_key( wp_unslash( $_POST['ps_veiksmas'] ) ) : 'tvirtinti';

		if ( $veiksmas === 'sekla' ) {
			$n = self::sekla_is_katalogo();
			wp_safe_redirect( admin_url( 'admin.php?page=' . self::ADMIN_SLUG . '&ps_sekla=' . (int) $n ) );
			exit;
		}
		if ( $veiksmas === 'atmesti' && $id ) { self::atmesti_alias( $id, get_current_user_id() ); }
		elseif ( $id && $can ) { self::patvirtinti_alias( $id, $can, get_current_user_id() ); }
		wp_safe_redirect( admin_url( 'admin.php?page=' . self::ADMIN_SLUG ) );
		exit;
	}

	public static function admin_render() {
		global $wpdb;
		$t = self::lentele_alias();
		$rodyti_atmestus = ( isset( $_GET['atmesti'] ) && $_GET['atmesti'] === '1' );
		$eile = $rodyti_atmestus
			? $wpdb->get_results( "SELECT * FROM $t WHERE busena='atmesta' ORDER BY atnaujinta DESC LIMIT 200", ARRAY_A )
			: $wpdb->get_results( "SELECT * FROM $t WHERE busena IN ('review','new') ORDER BY busena DESC, confidence DESC LIMIT 200", ARRAY_A );
		$busenos = $wpdb->get_results( "SELECT busena, COUNT(*) n FROM $t GROUP BY busena", ARRAY_A );
		echo '<div class="wrap"><h1>Brand žodynas</h1>';
		if ( isset( $_GET['ps_sekla'] ) ) {
			echo '<div class="notice notice-success"><p>Iš katalogo įrašyta / atnaujinta aliasų: <b>' . (int) $_GET['ps_sekla'] . '</b>.</p></div>';
		}
		echo '<p>';
		foreach ( $busenos as $b ) { echo esc_html( strtoupper( $b['busena'] ) . ': ' . $b['n'] ) . ' &nbsp; '; }
		echo '</p>';
		echo '<p class="description">Kliento įvestys susiejamos automatiškai. Čia lieka tik tos, kurių sistema netvirtina pati. Patvirtintas aliasas įsimenamas visam laikui.</p>';

		/* Seklos mygtukas — po naujo brendo kataloge arba po importo */
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" style="margin:10px 0 16px">';
		wp_nonce_field( 'ps_brand_veiksmas' );
		echo '<input type="hidden" name="action" value="ps_brand_veiksmas"><input type="hidden" name="ps_veiksmas" value="sekla">';
		echo '<button class="button">Suvienodinti su katalogu</button> ';
		echo '<span class="description">Įrašo visus <code>product_brand</code> terminus kaip patikimus. Nauji brendai tai daro patys — tai atsarginis mygtukas.</span>';
		echo '</form>';

		echo '<p><a href="' . esc_url( admin_url( 'admin.php?page=' . self::ADMIN_SLUG . ( $rodyti_atmestus ? '' : '&atmesti=1' ) ) ) . '">' .
			( $rodyti_atmestus ? '← Grįžti į darbo eilę' : 'Rodyti atmestus' ) . '</a></p>';
		if ( ! $eile ) {
			echo '<p><b>' . ( $rodyti_atmestus ? 'Atmestų nėra.' : 'Darbo eilė tuščia — visi kliento įvesti brandai susieti.' ) . '</b></p></div>';
			return;
		}
		echo '<table class="widefat striped" style="max-width:820px"><thead><tr><th>Aliasas</th><th>Busena</th><th>Spejimas</th><th>Conf</th><th>Patvirtinti kaip</th></tr></thead><tbody>';
		foreach ( $eile as $e ) {
			echo '<tr><td><code>' . esc_html( $e['alias'] ) . '</code></td><td>' . esc_html( $e['busena'] ) . '</td><td>' . esc_html( $e['canonical_id'] ) . '</td><td>' . esc_html( $e['confidence'] ) . '</td><td>';
			echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" style="display:flex;gap:6px">';
			wp_nonce_field( 'ps_brand_veiksmas' );
			echo '<input type="hidden" name="action" value="ps_brand_veiksmas"><input type="hidden" name="alias_id" value="' . (int) $e['id'] . '">';
			echo '<input type="hidden" name="ps_veiksmas" value="tvirtinti">';
			echo '<input type="text" name="canonical_id" value="' . esc_attr( $e['canonical_id'] ) . '" placeholder="canonical-slug" list="ps-brand-slugai">';
			echo '<button class="button button-primary">Patvirtinti</button></form>';
			if ( $e['busena'] !== 'atmesta' ) {
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" style="margin-top:4px">';
				wp_nonce_field( 'ps_brand_veiksmas' );
				echo '<input type="hidden" name="action" value="ps_brand_veiksmas"><input type="hidden" name="ps_veiksmas" value="atmesti">';
				echo '<input type="hidden" name="alias_id" value="' . (int) $e['id'] . '">';
				echo '<button class="button-link" style="color:#b32d2e">Tai ne brendas</button></form>';
			}
			echo '</td></tr>';
		}
		echo '</tbody></table>';
		/* Slug'u sarasas — kad nereiketu ju atsiminti ranka */
		$ts = get_terms( array( 'taxonomy' => 'product_brand', 'hide_empty' => false, 'number' => 1000 ) );
		echo '<datalist id="ps-brand-slugai">';
		if ( is_array( $ts ) ) { foreach ( $ts as $tt ) { echo '<option value="' . esc_attr( $tt->slug ) . '">' . esc_html( $tt->name ) . '</option>'; } }
		echo '</datalist>';
		echo '<p class="description">„Tai ne brendas" palieka įrašą duomenyse, bet iš darbo eilės pašalina — tas pats tekstas daugiau nebeklaus.</p></div>';
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
			busena ENUM('auto','review','new','atmesta') NOT NULL DEFAULT 'review',
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

		/* v3: busena +atmesta (siuksliu salinimas is darbo eiles) */
		$wpdb->query( "ALTER TABLE $al MODIFY busena ENUM('auto','review','new','atmesta') NOT NULL DEFAULT 'review'" );

		/* v2: user_id NULL leidziamas — GDPR anonimizacijai (§7) */
		$wpdb->query( "ALTER TABLE $fl MODIFY user_id BIGINT UNSIGNED NULL" );
		$wpdb->query( "ALTER TABLE $rl MODIFY user_id BIGINT UNSIGNED NULL" );

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
