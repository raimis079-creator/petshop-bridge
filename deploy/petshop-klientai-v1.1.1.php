<?php
/**
 * Plugin Name: Petshop Klientai
 * Description: Petshop langai → Klientai. Vienas žmogus = viena eilutė: banga, sutikimas, pirkimai (eShoprent istorija + WC), segmentas taisyklėmis, kortelė. Auditorija → Kampanijos per CSV.
 * Version: 1.1.1
 *
 * v1.1 (S1544): sava viršutinė šaka „Petshop klientai“ (Klientai · Naujienlaiškiai ir kampanijos ·
 * Laiškų šablonai · Laiškų rezultatai — perkeliami iš „Petshop langai“ perregistruojant callback'us,
 * originalūs failai neliečiami). Kampanijos gyvena Naujienlaiškių lange.
 *
 * S1543 (2026-08-31). TŽ v1.91 (4): valdymas TIK per mūsų langus; segmentas NESAUGOMAS kaip
 * sprendimas — išvedamas taisyklėmis iš ps_ist_* + WC ir perskaičiuojamas kas naktį į
 * suvestinės lentelę ps_kl_suvestine (spartai; šaltinis visada perskaičiuojamas).
 *
 * Segmentų taisyklės (prioritetas 1→7, pirma tinkanti laimi):
 *  1 refill_laikas   — pagrindinės prekės ciklas žinomas (≥3 pirkimai) ir tikėtina data ≤ šiandien (iki 120 d. pradelsimo)
 *  2 refill_arteja   — tikėtina data per artimiausias 14 d.
 *  3 pirmas          — 1 užsakymas, ne senesnis nei 180 d.
 *  4 aktyvus         — ≥2 užsakymai, paskutinis ≤ 90 d.
 *  5 reaktyvacija    — paskutinis 91–180 d.
 *  6 win_back        — paskutinis > 180 d.
 *  7 nepirkes        — 0 įvykdytų užsakymų
 * Gyvūnas — pagal pirktų prekių kategorijų šaknį (ŠUNIMS 70 / KATĖMS 77): Šuo / Katė / Abu (mažuma ≥25 %).
 * Ciklas — dienos tarp pirmo ir paskutinio pagrindinės prekės pirkimo / (pirkimų − 1), tik nuo 3 pirkimų.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Klientai {
	const PSL     = 'petshop-klientai';
	const CAP     = 'manage_woocommerce';
	const CRON    = 'ps_klientai_perskaiciuoti';
	const PER_PSL = 50;
	const CAT_SUO = 70;
	const CAT_KAT = 77;
	const SEG = array(
		'refill_laikas' => 'Maistas baigiasi',
		'refill_arteja' => 'Artėja papildymas',
		'pirmas'        => 'Pirko kartą',
		'aktyvus'       => 'Aktyvus pakartotinis',
		'reaktyvacija'  => 'Reaktyvacija',
		'win_back'      => 'Win-back',
		'nepirkes'      => 'Nepirkęs',
	);
	const BANGOS = array(
		'eshoprent_istorija'      => 'eShoprent istorija',
		'eshoprent_naujienlaiskis'=> 'eShoprent naujienlaiškis',
		'organic'                 => 'Naujas petshop.lt',
	);

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ), 99 );
		add_action( 'admin_init', array( __CLASS__, 'veiksmai' ) );
		add_action( self::CRON, array( __CLASS__, 'perskaiciuoti' ) );
		if ( ! wp_next_scheduled( self::CRON ) ) {
			$t = new DateTime( 'tomorrow 05:30', wp_timezone() );
			wp_schedule_event( $t->getTimestamp(), 'daily', self::CRON );
		}
	}

	public static function lentele() { global $wpdb; return $wpdb->prefix . 'ps_kl_suvestine'; }

	public static function idiegti() {
		global $wpdb; $t = self::lentele();
		$wpdb->query( "CREATE TABLE IF NOT EXISTS `$t` (
			user_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
			email VARCHAR(190) NOT NULL, vardas VARCHAR(100) NULL, banga VARCHAR(40) NULL,
			sutikimas VARCHAR(8) NULL, sutikimo_data DATETIME NULL, sutikimo_saltinis VARCHAR(60) NULL, suppression TINYINT(1) NOT NULL DEFAULT 0,
			ist_n SMALLINT NOT NULL DEFAULT 0, ist_suma DECIMAL(10,2) NOT NULL DEFAULT 0, wc_n SMALLINT NOT NULL DEFAULT 0, wc_suma DECIMAL(10,2) NOT NULL DEFAULT 0,
			uzsakymai SMALLINT NOT NULL DEFAULT 0, suma DECIMAL(10,2) NOT NULL DEFAULT 0, pirmas DATE NULL, paskutinis DATE NULL,
			segmentas VARCHAR(20) NULL, gyvunas VARCHAR(10) NULL, top_preke VARCHAR(255) NULL, top_pid BIGINT UNSIGNED NULL, top_n SMALLINT NOT NULL DEFAULT 0, ciklas SMALLINT NULL, kita DATE NULL,
			augintiniu TINYINT NOT NULL DEFAULT 0, atnaujinta DATETIME NOT NULL,
			KEY email (email), KEY segmentas (segmentas), KEY banga (banga), KEY sutikimas (sutikimas), KEY paskutinis (paskutinis), KEY gyvunas (gyvunas)
		) " . $wpdb->get_charset_collate() );
	}

	/* ------------------------------------------------------------------ */
	/* Perskaičiavimas                                                     */
	/* ------------------------------------------------------------------ */

	/** Prekė → gyvūnas pagal product_cat šaknį. */
	protected static function gyvunu_zemelapis() {
		global $wpdb; $p = $wpdb->prefix;
		$terms = $wpdb->get_results( "SELECT term_id,parent FROM {$p}term_taxonomy WHERE taxonomy='product_cat'", ARRAY_A );
		$par = array(); foreach ( $terms as $t ) { $par[ (int) $t['term_id'] ] = (int) $t['parent']; }
		$saknis = function( $id ) use ( $par ) { $g = 0; while ( $id && $g < 10 ) { if ( $id === self::CAT_SUO || $id === self::CAT_KAT ) return $id; $id = isset( $par[ $id ] ) ? $par[ $id ] : 0; $g++; } return 0; };
		$ts = array(); foreach ( $par as $id => $x ) { $r = $saknis( $id ); if ( $r ) $ts[ $id ] = $r === self::CAT_SUO ? 'suo' : 'kate'; }
		if ( ! $ts ) return array();
		$rel = $wpdb->get_results( "SELECT tr.object_id, tt.term_id FROM {$p}term_relationships tr JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id WHERE tt.term_id IN (" . implode( ',', array_map( 'intval', array_keys( $ts ) ) ) . ")", ARRAY_A );
		$m = array(); foreach ( $rel as $r ) { $a = $ts[ (int) $r['term_id'] ]; $pid = (int) $r['object_id']; if ( ! isset( $m[ $pid ] ) ) $m[ $pid ] = $a; elseif ( $m[ $pid ] !== $a ) $m[ $pid ] = 'abu'; }
		// variacijos → tėvas
		$var = $wpdb->get_results( "SELECT ID,post_parent FROM {$p}posts WHERE post_type='product_variation' AND post_parent>0", ARRAY_A );
		foreach ( $var as $v ) { if ( isset( $m[ (int) $v['post_parent'] ] ) ) $m[ (int) $v['ID'] ] = $m[ (int) $v['post_parent'] ]; }
		return $m;
	}

	/**
	 * Pilnas perskaičiavimas į ps_kl_suvestine. Grąžina statistiką.
	 * $tik_uid — vienam klientui (kortelės mygtukas).
	 */
	public static function perskaiciuoti( $tik_uid = 0 ) {
		global $wpdb; $p = $wpdb->prefix; $T = self::lentele(); self::idiegti();
		@set_time_limit( 280 ); $t0 = microtime( true );
		$TU = $p . 'ps_ist_uzsakymai'; $TE = $p . 'ps_ist_eilutes';
		$where_u = $tik_uid ? $wpdb->prepare( 'AND u.ID=%d', $tik_uid ) : '';
		// 1. klientai (customer rolė)
		$users = $wpdb->get_results( "SELECT u.ID,LOWER(u.user_email) email,u.display_name FROM {$p}users u JOIN {$p}usermeta c ON c.user_id=u.ID AND c.meta_key='{$p}capabilities' AND c.meta_value LIKE '%customer%' $where_u", ARRAY_A );
		if ( ! $users ) return array( 'klientai' => 0 );
		$emails = array(); $ids = array(); foreach ( $users as $u ) { $emails[ $u['email'] ] = (int) $u['ID']; $ids[] = (int) $u['ID']; }
		$in_e = implode( ',', array_map( function( $e ) use ( $wpdb ) { return $wpdb->prepare( '%s', $e ); }, array_keys( $emails ) ) );
		$in_i = implode( ',', $ids );
		// 2. meta vienu kartu
		$meta = array(); foreach ( $wpdb->get_results( "SELECT user_id,meta_key,meta_value FROM {$p}usermeta WHERE user_id IN ($in_i) AND meta_key IN ('first_name','_ps_banga','" . esc_sql( Petshop_Consent_Sync::META_MARKETING ) . "')", ARRAY_A ) as $r ) { $meta[ (int) $r['user_id'] ][ $r['meta_key'] ] = $r['meta_value']; }
		// 3. istorija per email
		$ist = array(); foreach ( $wpdb->get_results( "SELECT email,COUNT(*) n,ROUND(SUM(suma),2) s,MIN(data) mn,MAX(data) mx FROM $TU WHERE ivykdytas=1 AND email IN ($in_e) GROUP BY email", ARRAY_A ) as $r ) $ist[ $r['email'] ] = $r;
		// 4. WC užsakymai (HPOS) per customer_id
		$wc = array(); foreach ( $wpdb->get_results( "SELECT customer_id,COUNT(*) n,ROUND(SUM(total_amount),2) s,MIN(date_created_gmt) mn,MAX(date_created_gmt) mx FROM {$p}wc_orders WHERE type='shop_order' AND status IN ('wc-completed','wc-processing') AND customer_id IN ($in_i) GROUP BY customer_id", ARRAY_A ) as $r ) $wc[ (int) $r['customer_id'] ] = $r;
		// 5. prekių eilutės (istorija + WC) → per klientą: raktas = wc_product_id arba modelis
		$zem = self::gyvunu_zemelapis();
		$prek = array(); // uid => key => [n, dates[], pav, pid]
		$eil = $wpdb->get_results( "SELECT u.email, e.wc_product_id pid, e.modelis, e.pavadinimas, u.data FROM $TE e JOIN $TU u ON u.id=e.uzsakymo_id WHERE u.ivykdytas=1 AND u.email IN ($in_e)", ARRAY_A );
		$gyv = array();
		$prideti = function( $uid, $pid, $key, $pav, $data ) use ( &$prek, &$gyv, $zem ) {
			if ( ! isset( $prek[ $uid ][ $key ] ) ) $prek[ $uid ][ $key ] = array( 'n' => 0, 'd' => array(), 'pav' => $pav, 'pid' => $pid );
			$prek[ $uid ][ $key ]['n']++; $prek[ $uid ][ $key ]['d'][ substr( $data, 0, 10 ) ] = 1;
			if ( $pid && isset( $zem[ $pid ] ) ) { $a = $zem[ $pid ]; if ( $a === 'abu' ) { $gyv[ $uid ]['suo'] = ( $gyv[ $uid ]['suo'] ?? 0 ) + 0.5; $gyv[ $uid ]['kate'] = ( $gyv[ $uid ]['kate'] ?? 0 ) + 0.5; } else $gyv[ $uid ][ $a ] = ( $gyv[ $uid ][ $a ] ?? 0 ) + 1; }
		};
		foreach ( $eil as $r ) { $uid = $emails[ strtolower( $r['email'] ) ] ?? 0; if ( ! $uid ) continue; $pid = $r['pid'] ? (int) $r['pid'] : 0; $prideti( $uid, $pid, $pid ? 'p' . $pid : 'm' . $r['modelis'], $r['pavadinimas'], $r['data'] ); }
		unset( $eil );
		$wcl = $wpdb->get_results( "SELECT o.customer_id uid, l.product_id pid, l.variation_id vid, l.date_created d, oi.order_item_name pav FROM {$p}wc_order_product_lookup l JOIN {$p}wc_orders o ON o.id=l.order_id JOIN {$p}woocommerce_order_items oi ON oi.order_item_id=l.order_item_id WHERE o.type='shop_order' AND o.status IN ('wc-completed','wc-processing') AND o.customer_id IN ($in_i)", ARRAY_A );
		foreach ( $wcl as $r ) { $pid = (int) $r['pid']; $prideti( (int) $r['uid'], $pid, 'p' . $pid, $r['pav'], $r['d'] ); }
		unset( $wcl );
		// 6. sutikimai (paskutinis įrašas) + suppression
		$cons = array(); foreach ( $wpdb->get_results( "SELECT c.email,c.to_value,c.source,c.changed_at FROM {$p}ps_consent_log c JOIN (SELECT email,MAX(id) mid FROM {$p}ps_consent_log WHERE field='marketing_consent' AND email IN ($in_e) GROUP BY email) x ON x.mid=c.id", ARRAY_A ) as $r ) $cons[ strtolower( $r['email'] ) ] = $r;
		$sup = array(); $st = $p . 'ps_email_suppression'; if ( $wpdb->get_var( "SHOW TABLES LIKE '$st'" ) === $st ) foreach ( $wpdb->get_col( "SELECT LOWER(email) FROM $st WHERE channel='marketing' AND released_at IS NULL AND LOWER(email) IN ($in_e)" ) as $e ) $sup[ $e ] = 1;
		// 7. augintiniai
		$pets = array(); $pt = $p . 'ps_pets'; if ( $wpdb->get_var( "SHOW TABLES LIKE '$pt'" ) === $pt ) foreach ( $wpdb->get_results( "SELECT user_id,COUNT(*) n FROM $pt WHERE deleted_at IS NULL AND status<>'deleted' AND user_id IN ($in_i) GROUP BY user_id", ARRAY_A ) as $r ) $pets[ (int) $r['user_id'] ] = (int) $r['n'];
		// 8. surinkti ir įrašyti
		$today = new DateTime( 'today', wp_timezone() ); $now = current_time( 'mysql', true ); $n = 0; $seg = array_fill_keys( array_keys( self::SEG ), 0 );
		$rows = array();
		foreach ( $users as $u ) {
			$uid = (int) $u['ID']; $e = $u['email']; $m = $meta[ $uid ] ?? array();
			$i = $ist[ $e ] ?? null; $w = $wc[ $uid ] ?? null;
			$uz = ( $i ? (int) $i['n'] : 0 ) + ( $w ? (int) $w['n'] : 0 );
			$suma = ( $i ? (float) $i['s'] : 0 ) + ( $w ? (float) $w['s'] : 0 );
			$dates = array_filter( array( $i ? $i['mn'] : null, $i ? $i['mx'] : null, $w ? $w['mn'] : null, $w ? $w['mx'] : null ) );
			$pirm = $dates ? substr( min( $dates ), 0, 10 ) : null; $pask = $dates ? substr( max( $dates ), 0, 10 ) : null;
			// pagrindinė prekė
			$top = null; if ( ! empty( $prek[ $uid ] ) ) { foreach ( $prek[ $uid ] as $k => $x ) { if ( ! $top || $x['n'] > $top['n'] || ( $x['n'] === $top['n'] && max( array_keys( $x['d'] ) ) > max( array_keys( $top['d'] ) ) ) ) $top = $x; } }
			$ciklas = null; $kita = null;
			if ( $top && count( $top['d'] ) >= 3 ) { $ds = array_keys( $top['d'] ); sort( $ds ); $span = ( strtotime( end( $ds ) ) - strtotime( $ds[0] ) ) / 86400; $ciklas = (int) round( $span / ( count( $ds ) - 1 ) ); if ( $ciklas >= 5 ) { $kita = date( 'Y-m-d', strtotime( end( $ds ) . " +$ciklas days" ) ); } else $ciklas = null; }
			// gyvūnas
			$g = $gyv[ $uid ] ?? array(); $gs = $g['suo'] ?? 0; $gk = $g['kate'] ?? 0; $gyvunas = null;
			if ( $gs + $gk > 0 ) { $min = min( $gs, $gk ) / ( $gs + $gk ); $gyvunas = $min >= 0.25 ? 'abu' : ( $gs > $gk ? 'suo' : 'kate' ); }
			// segmentas
			$dsl = $pask ? (int) $today->diff( new DateTime( $pask, wp_timezone() ) )->days : null;
			$dk = $kita ? ( (int) ( ( strtotime( $kita ) - $today->getTimestamp() ) / 86400 ) ) : null;
			if ( $uz === 0 ) $s = 'nepirkes';
			elseif ( $dk !== null && $dk <= 0 && $dk >= -120 ) $s = 'refill_laikas';
			elseif ( $dk !== null && $dk > 0 && $dk <= 14 ) $s = 'refill_arteja';
			elseif ( $uz === 1 && $dsl <= 180 ) $s = 'pirmas';
			elseif ( $uz >= 2 && $dsl <= 90 ) $s = 'aktyvus';
			elseif ( $dsl <= 180 ) $s = 'reaktyvacija';
			else $s = 'win_back';
			$seg[ $s ]++;
			$c = $cons[ $e ] ?? null; $sut = $c ? ( $c['to_value'] === 'true' ? 'taip' : 'ne' ) : ( ( $m[ Petshop_Consent_Sync::META_MARKETING ] ?? '' ) === 'true' ? 'taip' : '' );
			$banga = $m['_ps_banga'] ?? 'organic';
			$rows[] = $wpdb->prepare( '(%d,%s,%s,%s,%s,%s,%s,%d,%d,%f,%d,%f,%d,%f,%s,%s,%s,%s,%s,%d,%d,%s,%s,%d,%s)',
				$uid, $e, $m['first_name'] ?? $u['display_name'], $banga, $sut, $c ? $c['changed_at'] : null, $c ? $c['source'] : null, isset( $sup[ $e ] ) ? 1 : 0,
				$i ? (int) $i['n'] : 0, $i ? (float) $i['s'] : 0, $w ? (int) $w['n'] : 0, $w ? (float) $w['s'] : 0, $uz, $suma, $pirm, $pask,
				$s, $gyvunas, $top ? mb_substr( $top['pav'], 0, 255 ) : null, $top ? (int) $top['pid'] : null, $top ? (int) $top['n'] : 0, $ciklas, $kita, $pets[ $uid ] ?? 0, $now );
			$n++;
			if ( count( $rows ) >= 300 ) { self::irasyti( $rows ); $rows = array(); }
		}
		if ( $rows ) self::irasyti( $rows );
		if ( ! $tik_uid ) update_option( 'ps_klientai_perskaiciuota', $now, false );
		return array( 'klientai' => $n, 'segmentai' => $seg, 's' => round( microtime( true ) - $t0, 1 ) );
	}

	protected static function irasyti( $rows ) {
		global $wpdb; $T = self::lentele();
		$sql = "REPLACE INTO `$T` (user_id,email,vardas,banga,sutikimas,sutikimo_data,sutikimo_saltinis,suppression,ist_n,ist_suma,wc_n,wc_suma,uzsakymai,suma,pirmas,paskutinis,segmentas,gyvunas,top_preke,top_pid,top_n,ciklas,kita,augintiniu,atnaujinta) VALUES " . implode( ',', $rows );
		$sql = str_replace( "'',", "NULL,", $sql ); // tušti datų/segmentų laukai → NULL
		$wpdb->query( $sql );
	}

	/* ------------------------------------------------------------------ */
	/* Admin                                                               */
	/* ------------------------------------------------------------------ */

	public static function menu() {
		add_menu_page( 'Petshop klientai', 'Petshop klientai', self::CAP, self::PSL, array( __CLASS__, 'ekranas' ), 'dashicons-groups', 56 );
		add_submenu_page( self::PSL, 'Klientai', 'Klientai', self::CAP, self::PSL, array( __CLASS__, 'ekranas' ) );
		foreach ( array( 'petshop-naujienlaiskiai' => 'Naujienlaiškiai ir kampanijos', 'petshop-laiskai' => 'Laiškų šablonai', 'petshop-rezultatai' => 'Laiškų rezultatai' ) as $slug => $title ) {
			self::perkelti( 'petshop-langai', $slug, $title );
		}
	}

	/** Perkelia esamą submenu iš kito tėvo, išsaugant jo callback'ą (originalus failas neliečiamas). */
	protected static function perkelti( $from, $slug, $title ) {
		global $submenu, $wp_filter;
		if ( empty( $submenu[ $from ] ) || ! function_exists( 'get_plugin_page_hookname' ) ) return;
		foreach ( $submenu[ $from ] as $it ) {
			if ( $it[2] !== $slug ) continue;
			$hook = get_plugin_page_hookname( $slug, $from ); $cb = null;
			if ( isset( $wp_filter[ $hook ] ) ) { foreach ( $wp_filter[ $hook ]->callbacks as $cbs ) { foreach ( $cbs as $c ) { $cb = $c['function']; break 2; } } }
			if ( ! $cb ) return;
			remove_submenu_page( $from, $slug );
			add_submenu_page( self::PSL, isset( $it[3] ) ? $it[3] : $title, $title, $it[1], $slug, $cb );
			return;
		}
	}

	protected static function kampaniju_url() {
		return admin_url( 'admin.php?page=petshop-naujienlaiskiai' );
	}

	public static function veiksmai() {
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== self::PSL || ! current_user_can( self::CAP ) ) return;
		if ( isset( $_POST['ps_kl_veiksmas'] ) && check_admin_referer( 'ps_kl' ) ) {
			$v = sanitize_key( $_POST['ps_kl_veiksmas'] ); $uid = (int) ( $_POST['uid'] ?? 0 ); $msg = '';
			if ( $v === 'perskaiciuoti' ) { $r = self::perskaiciuoti(); $msg = 'Perskaičiuota: ' . $r['klientai'] . ' klientų (' . $r['s'] . ' s).'; }
			elseif ( $v === 'perskaiciuoti_viena' && $uid ) { self::perskaiciuoti( $uid ); $msg = 'Kliento suvestinė atnaujinta.'; }
			elseif ( in_array( $v, array( 'sutikimas_taip', 'sutikimas_ne' ), true ) && $uid ) {
				$u = get_user_by( 'id', $uid ); if ( $u ) { $r = Petshop_Consent_Sync::set_marketing_consent( $u->user_email, $v === 'sutikimas_taip', 'admin', $uid ); self::perskaiciuoti( $uid ); $msg = ! empty( $r['unchanged'] ) ? 'Sutikimas nepakito.' : 'Sutikimas įrašytas (šaltinis: admin, ' . wp_get_current_user()->display_name . '). Klientui išsiųstas patvirtinimas.'; }
			}
			elseif ( $v === 'pastaba' && $uid ) { update_user_meta( $uid, '_ps_pastaba', sanitize_textarea_field( $_POST['pastaba'] ?? '' ) ); $msg = 'Pastaba išsaugota.'; }
			elseif ( $v === 'auditorija' ) { $msg = self::sukurti_auditorija(); }
			set_transient( 'ps_kl_msg_' . get_current_user_id(), $msg, 60 );
			wp_safe_redirect( remove_query_arg( array( '_wpnonce' ) ) ); exit;
		}
	}

	/** Filtrai iš GET. */
	protected static function filtrai() {
		$f = array(); foreach ( array( 'banga', 'sutikimas', 'segmentas', 'gyvunas', 'q', 'pirko' ) as $k ) { $f[ $k ] = isset( $_REQUEST[ $k ] ) ? sanitize_text_field( wp_unslash( $_REQUEST[ $k ] ) ) : ''; }
		return $f;
	}

	protected static function where( $f ) {
		global $wpdb; $w = array( '1=1' );
		if ( $f['banga'] ) $w[] = $wpdb->prepare( 'banga=%s', $f['banga'] );
		if ( $f['sutikimas'] === 'taip' ) $w[] = "sutikimas='taip' AND suppression=0"; elseif ( $f['sutikimas'] === 'ne' ) $w[] = "(sutikimas<>'taip' OR sutikimas IS NULL OR suppression=1)";
		if ( $f['segmentas'] && isset( self::SEG[ $f['segmentas'] ] ) ) $w[] = $wpdb->prepare( 'segmentas=%s', $f['segmentas'] );
		if ( $f['gyvunas'] ) $w[] = $wpdb->prepare( 'gyvunas=%s', $f['gyvunas'] );
		if ( $f['pirko'] === '12' ) $w[] = 'paskutinis>=DATE_SUB(CURDATE(),INTERVAL 12 MONTH)'; elseif ( $f['pirko'] === '24' ) $w[] = 'paskutinis>=DATE_SUB(CURDATE(),INTERVAL 24 MONTH)';
		if ( $f['q'] ) { $l = '%' . $wpdb->esc_like( $f['q'] ) . '%'; $w[] = $wpdb->prepare( '(email LIKE %s OR vardas LIKE %s OR top_preke LIKE %s)', $l, $l, $l ); }
		return implode( ' AND ', $w );
	}

	protected static function sukurti_auditorija() {
		global $wpdb; $T = self::lentele(); $f = self::filtrai();
		$el = $wpdb->get_col( "SELECT email FROM `$T` WHERE " . self::where( $f ) . " AND sutikimas='taip' AND suppression=0 ORDER BY email" );
		if ( ! $el ) return 'Auditorija tuščia (su galiojančiu sutikimu — 0).';
		$u = wp_upload_dir(); $d = trailingslashit( $u['basedir'] ) . ( class_exists( 'Petshop_Kampaniju_Langas' ) && defined( 'Petshop_Kampaniju_Langas::KATALOGAS' ) ? Petshop_Kampaniju_Langas::KATALOGAS : 'ps-import' );
		if ( ! is_dir( $d ) ) wp_mkdir_p( $d );
		$zyma = implode( '_', array_filter( array( $f['segmentas'], $f['banga'], $f['gyvunas'] ? $f['gyvunas'] : '', $f['pirko'] ? 'p' . $f['pirko'] : '' ) ) ); $zyma = $zyma ? sanitize_file_name( $zyma ) : 'visi';
		$fn = 'klientai_' . $zyma . '_' . current_time( 'Ymd-Hi' ) . '.csv';
		file_put_contents( $d . '/' . $fn, "email\n" . implode( "\n", $el ) . "\n" );
		return 'Auditorija sukurta: <b>' . count( $el ) . '</b> el. paštų su sutikimu → <code>' . esc_html( $fn ) . '</code>. Naujienlaiškių lange (kampanijos) pasirink šaltinį „csv: ' . esc_html( $fn ) . '“. <a class="button button-small" href="' . esc_url( self::kampaniju_url() ) . '">Į Naujienlaiškius →</a>';
	}

	public static function ekranas() {
		if ( ! current_user_can( self::CAP ) ) return;
		self::idiegti();
		echo '<div class="wrap pskl">'; self::stilius();
		$msg = get_transient( 'ps_kl_msg_' . get_current_user_id() ); if ( $msg ) { delete_transient( 'ps_kl_msg_' . get_current_user_id() ); echo '<div class="notice notice-success is-dismissible"><p>' . wp_kses_post( $msg ) . '</p></div>'; }
		if ( ! empty( $_GET['uid'] ) ) self::kortele( (int) $_GET['uid'] ); else self::sarasas();
		echo '</div>';
	}

	protected static function stilius() {
		echo '<style>
		.pskl .kort{display:inline-block;min-width:150px;margin:0 10px 10px 0;padding:10px 14px;border-radius:6px;border:1px solid #ccd0d4;background:#fff;vertical-align:top;border-left:5px solid #2D5F3F}
		.pskl .kort b{font-size:21px;display:block;line-height:1.2}.pskl .kort small{color:#666}
		.pskl .kort.seg{border-left-color:#dba617;cursor:pointer}.pskl .kort.seg.akt{background:#fdf7e3}
		.pskl .filtrai{background:#fff;border:1px solid #ccd0d4;padding:10px 14px;margin:8px 0 14px;border-radius:6px}
		.pskl .filtrai select,.pskl .filtrai input[type=search]{margin-right:6px}
		.pskl table.wp-list-table td,.pskl table.wp-list-table th{padding:6px 10px;vertical-align:middle}
		.pskl .num{text-align:right;font-variant-numeric:tabular-nums}.pskl .muted{color:#777}.pskl .ok{color:#2D5F3F;font-weight:600}.pskl .ne{color:#d63638}
		.pskl .zyma{display:inline-block;padding:1px 7px;border-radius:10px;background:#f0f0f1;font-size:12px;white-space:nowrap}
		.pskl .zyma.refill_laikas{background:#fcf0f1;color:#8a1f1f}.pskl .zyma.refill_arteja{background:#fdf7e3;color:#7a5a00}.pskl .zyma.aktyvus{background:#e7f3ea;color:#1e4d2b}.pskl .zyma.pirmas{background:#e8f0fb;color:#1d4e89}
		.pskl .veluoja{color:#d63638;font-weight:600}
		.pskl h2.sk{margin:22px 0 6px;font-size:15px}
		.pskl .hero{background:#fff;border:1px solid #ccd0d4;border-left:5px solid #2D5F3F;border-radius:6px;padding:14px 18px;margin:8px 0 14px}
		.pskl .hero .em{font-size:18px;font-weight:600}
		.pskl .dvi{display:flex;gap:18px;flex-wrap:wrap}.pskl .dvi>div{flex:1 1 420px}
		.pskl form.inline{display:inline}
		</style>';
	}

	/* ---------------------------- sąrašas ---------------------------- */

	protected static function sarasas() {
		global $wpdb; $T = self::lentele(); $f = self::filtrai(); $W = self::where( $f );
		$viso = (int) $wpdb->get_var( "SELECT COUNT(*) FROM `$T`" );
		$persk = get_option( 'ps_klientai_perskaiciuota' );
		echo '<h1>Klientai <span class="muted" style="font-size:13px;font-weight:400">' . ( $persk ? 'suvestinė ' . esc_html( get_date_from_gmt( $persk, 'Y-m-d H:i' ) ) : 'suvestinė dar neskaičiuota' ) . '</span>
			<form class="inline" method="post">' . wp_nonce_field( 'ps_kl', '_wpnonce', true, false ) . '<input type="hidden" name="ps_kl_veiksmas" value="perskaiciuoti"><button class="button button-small">Perskaičiuoti dabar</button></form></h1>';
		if ( ! $viso ) { echo '<div class="notice notice-info"><p>Suvestinė tuščia — paspausk „Perskaičiuoti dabar“.</p></div>'; return; }
		// kortelės
		$sut = (int) $wpdb->get_var( "SELECT COUNT(*) FROM `$T` WHERE sutikimas='taip' AND suppression=0" );
		$b = array(); foreach ( $wpdb->get_results( "SELECT banga,COUNT(*) n FROM `$T` GROUP BY banga", ARRAY_A ) as $r ) $b[ $r['banga'] ] = (int) $r['n'];
		echo '<div><div class="kort"><b>' . number_format_i18n( $viso ) . '</b><small>klientų</small></div>';
		echo '<div class="kort"><b>' . number_format_i18n( $sut ) . '</b><small>su galiojančiu sutikimu</small></div>';
		foreach ( self::BANGOS as $k => $l ) if ( ! empty( $b[ $k ] ) ) echo '<div class="kort"><b>' . number_format_i18n( $b[ $k ] ) . '</b><small>' . esc_html( $l ) . '</small></div>';
		echo '</div><div>';
		$seg = array(); foreach ( $wpdb->get_results( "SELECT segmentas,COUNT(*) n FROM `$T` GROUP BY segmentas", ARRAY_A ) as $r ) $seg[ $r['segmentas'] ] = (int) $r['n'];
		foreach ( self::SEG as $k => $l ) { $u = add_query_arg( array( 'page' => self::PSL, 'segmentas' => $f['segmentas'] === $k ? '' : $k ), admin_url( 'admin.php' ) ); echo '<a class="kort seg' . ( $f['segmentas'] === $k ? ' akt' : '' ) . '" href="' . esc_url( $u ) . '" style="text-decoration:none;color:inherit"><b>' . number_format_i18n( $seg[ $k ] ?? 0 ) . '</b><small>' . esc_html( $l ) . '</small></a>'; }
		echo '</div>';
		// filtrai
		echo '<form class="filtrai" method="get"><input type="hidden" name="page" value="' . self::PSL . '">';
		echo '<select name="banga"><option value="">Visos bangos</option>'; foreach ( self::BANGOS as $k => $l ) echo '<option value="' . $k . '"' . selected( $f['banga'], $k, false ) . '>' . esc_html( $l ) . '</option>'; echo '</select>';
		echo '<select name="sutikimas"><option value="">Sutikimas: visi</option><option value="taip"' . selected( $f['sutikimas'], 'taip', false ) . '>Su sutikimu</option><option value="ne"' . selected( $f['sutikimas'], 'ne', false ) . '>Be sutikimo / atsisakę</option></select>';
		echo '<select name="segmentas"><option value="">Visi segmentai</option>'; foreach ( self::SEG as $k => $l ) echo '<option value="' . $k . '"' . selected( $f['segmentas'], $k, false ) . '>' . esc_html( $l ) . '</option>'; echo '</select>';
		echo '<select name="gyvunas"><option value="">Gyvūnas: visi</option><option value="suo"' . selected( $f['gyvunas'], 'suo', false ) . '>Šuo</option><option value="kate"' . selected( $f['gyvunas'], 'kate', false ) . '>Katė</option><option value="abu"' . selected( $f['gyvunas'], 'abu', false ) . '>Abu</option></select>';
		echo '<select name="pirko"><option value="">Pirko: bet kada</option><option value="12"' . selected( $f['pirko'], '12', false ) . '>per 12 mėn.</option><option value="24"' . selected( $f['pirko'], '24', false ) . '>per 24 mėn.</option></select>';
		echo '<input type="search" name="q" value="' . esc_attr( $f['q'] ) . '" placeholder="el. paštas, vardas, prekė"> <button class="button">Filtruoti</button> <a class="button" href="' . esc_url( admin_url( 'admin.php?page=' . self::PSL ) ) . '">Išvalyti</a></form>';
		$n = (int) $wpdb->get_var( "SELECT COUNT(*) FROM `$T` WHERE $W" );
		$n_sut = (int) $wpdb->get_var( "SELECT COUNT(*) FROM `$T` WHERE $W AND sutikimas='taip' AND suppression=0" );
		echo '<p><b>' . number_format_i18n( $n ) . '</b> klientų atitinka filtrą, iš jų <b>' . number_format_i18n( $n_sut ) . '</b> su galiojančiu sutikimu. ';
		echo '<form class="inline" method="post">' . wp_nonce_field( 'ps_kl', '_wpnonce', true, false ) . '<input type="hidden" name="ps_kl_veiksmas" value="auditorija">'; foreach ( $f as $k => $v ) echo '<input type="hidden" name="' . $k . '" value="' . esc_attr( $v ) . '">'; echo '<button class="button button-primary"' . ( $n_sut ? '' : ' disabled' ) . '>Siųsti šiai auditorijai (' . number_format_i18n( $n_sut ) . ') →</button></form></p>';
		// lentelė
		$psl = max( 1, (int) ( $_GET['psl'] ?? 1 ) ); $off = ( $psl - 1 ) * self::PER_PSL;
		$rows = $wpdb->get_results( "SELECT * FROM `$T` WHERE $W ORDER BY paskutinis DESC, email LIMIT " . self::PER_PSL . " OFFSET $off", ARRAY_A );
		echo '<table class="wp-list-table widefat fixed striped"><thead><tr><th>Klientas</th><th>Banga</th><th>Sutikimas</th><th class="num">Užsak.</th><th class="num">Suma €</th><th>Paskutinis</th><th>Segmentas</th><th>Gyv.</th><th>Pagrindinė prekė</th><th>Tikėtina kita</th></tr></thead><tbody>';
		foreach ( $rows as $r ) {
			$u = admin_url( 'admin.php?page=' . self::PSL . '&uid=' . (int) $r['user_id'] );
			echo '<tr><td><a href="' . esc_url( $u ) . '"><b>' . esc_html( $r['vardas'] ?: '—' ) . '</b></a><br><span class="muted">' . esc_html( $r['email'] ) . '</span></td>';
			echo '<td>' . esc_html( self::BANGOS[ $r['banga'] ] ?? $r['banga'] ) . '</td>';
			echo '<td>' . self::sutikimo_html( $r ) . '</td>';
			echo '<td class="num">' . (int) $r['uzsakymai'] . ( $r['wc_n'] ? ' <span class="muted">(+' . (int) $r['wc_n'] . ' nauji)</span>' : '' ) . '</td><td class="num">' . number_format_i18n( (float) $r['suma'], 0 ) . '</td>';
			echo '<td>' . ( $r['paskutinis'] ? esc_html( $r['paskutinis'] ) : '<span class="muted">—</span>' ) . '</td>';
			echo '<td><span class="zyma ' . esc_attr( $r['segmentas'] ) . '">' . esc_html( self::SEG[ $r['segmentas'] ] ?? $r['segmentas'] ) . '</span></td>';
			echo '<td>' . self::gyvunas_html( $r['gyvunas'] ) . '</td>';
			echo '<td>' . ( $r['top_preke'] ? esc_html( mb_strimwidth( $r['top_preke'], 0, 48, '…' ) ) . ' <span class="muted">×' . (int) $r['top_n'] . '</span>' : '<span class="muted">—</span>' ) . '</td>';
			echo '<td>' . self::kita_html( $r ) . '</td></tr>';
		}
		if ( ! $rows ) echo '<tr><td colspan="10" class="muted">Nėra atitinkančių.</td></tr>';
		echo '</tbody></table>';
		$pages = (int) ceil( $n / self::PER_PSL );
		if ( $pages > 1 ) { echo '<p class="tablenav-pages">'; for ( $i = max( 1, $psl - 3 ); $i <= min( $pages, $psl + 3 ); $i++ ) { $u = add_query_arg( array_merge( array( 'page' => self::PSL, 'psl' => $i ), array_filter( $f ) ), admin_url( 'admin.php' ) ); echo $i === $psl ? "<b class='button disabled'>$i</b> " : '<a class="button" href="' . esc_url( $u ) . "\">$i</a> "; } echo '<span class="muted">iš ' . $pages . '</span></p>'; }
	}

	protected static function sutikimo_html( $r ) {
		if ( $r['sutikimas'] === 'taip' && ! $r['suppression'] ) return '<span class="ok">✓ taip</span><br><span class="muted">' . esc_html( $r['sutikimo_saltinis'] ) . ( $r['sutikimo_data'] ? ' · ' . esc_html( substr( $r['sutikimo_data'], 0, 10 ) ) : '' ) . '</span>';
		if ( $r['suppression'] ) return '<span class="ne">atsisakė (Sender)</span>';
		if ( $r['sutikimas'] === 'ne' ) return '<span class="ne">atsisakė</span><br><span class="muted">' . esc_html( $r['sutikimo_saltinis'] ) . ' · ' . esc_html( substr( (string) $r['sutikimo_data'], 0, 10 ) ) . '</span>';
		return '<span class="muted">—</span>';
	}
	protected static function gyvunas_html( $g ) { $m = array( 'suo' => 'Šuo', 'kate' => 'Katė', 'abu' => 'Abu' ); return isset( $m[ $g ] ) ? esc_html( $m[ $g ] ) : '<span class="muted">—</span>'; }
	protected static function kita_html( $r ) {
		if ( ! $r['kita'] ) return '<span class="muted">' . ( $r['top_n'] >= 2 ? 'ciklas nuo 3 pirk.' : '—' ) . '</span>';
		$d = (int) ( ( strtotime( $r['kita'] ) - strtotime( current_time( 'Y-m-d' ) ) ) / 86400 );
		return esc_html( $r['kita'] ) . ' <span class="muted">(~' . (int) $r['ciklas'] . ' d.)</span>' . ( $d < 0 ? '<br><span class="veluoja">vėluoja ' . abs( $d ) . ' d.</span>' : ( $d <= 14 ? '<br><span style="color:#7a5a00">po ' . $d . ' d.</span>' : '' ) );
	}

	/* ---------------------------- kortelė ---------------------------- */

	protected static function kortele( $uid ) {
		global $wpdb; $p = $wpdb->prefix; $T = self::lentele(); $TU = $p . 'ps_ist_uzsakymai'; $TE = $p . 'ps_ist_eilutes';
		$u = get_user_by( 'id', $uid ); if ( ! $u ) { echo '<p>Vartotojo nėra.</p>'; return; }
		$r = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM `$T` WHERE user_id=%d", $uid ), ARRAY_A );
		if ( ! $r ) { self::perskaiciuoti( $uid ); $r = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM `$T` WHERE user_id=%d", $uid ), ARRAY_A ); }
		$e = strtolower( $u->user_email );
		echo '<p><a href="' . esc_url( admin_url( 'admin.php?page=' . self::PSL ) ) . '">← Klientai</a></p>';
		$vardas = trim( get_user_meta( $uid, 'first_name', true ) . ' ' . get_user_meta( $uid, 'last_name', true ) );
		echo '<div class="hero"><div class="em">' . esc_html( $vardas ?: $e ) . ' <span class="muted" style="font-weight:400;font-size:14px">' . esc_html( $e ) . ( ( $t = get_user_meta( $uid, 'billing_phone', true ) ) ? ' · ' . esc_html( $t ) : '' ) . '</span></div>';
		$sak = array();
		$sak[] = self::gyvunas_html( $r['gyvunas'] );
		$sak[] = '<span class="zyma ' . esc_attr( $r['segmentas'] ) . '">' . esc_html( self::SEG[ $r['segmentas'] ] ?? '' ) . '</span>';
		$sak[] = esc_html( self::BANGOS[ $r['banga'] ] ?? $r['banga'] );
		if ( $r['ist_n'] ) $sak[] = '<b>' . (int) $r['ist_n'] . '</b> užsak. / <b>' . number_format_i18n( (float) $r['ist_suma'], 2 ) . ' €</b> per eShoprent';
		if ( $r['wc_n'] ) $sak[] = '<b>' . (int) $r['wc_n'] . '</b> užsak. / <b>' . number_format_i18n( (float) $r['wc_suma'], 2 ) . ' €</b> petshop.lt';
		if ( $r['top_preke'] ) $sak[] = 'pagrindinė: <b>' . esc_html( $r['top_preke'] ) . '</b> ×' . (int) $r['top_n'] . ( $r['kita'] ? ' · ' . self::kita_html( $r ) : '' );
		echo '<p style="margin:8px 0 0">' . implode( ' · ', $sak ) . '</p>';
		echo '<p style="margin:8px 0 0">Sutikimas: ' . self::sutikimo_html( $r ) . ' &nbsp; ';
		echo '<form class="inline" method="post">' . wp_nonce_field( 'ps_kl', '_wpnonce', true, false ) . '<input type="hidden" name="uid" value="' . $uid . '">';
		if ( $r['sutikimas'] !== 'taip' ) echo '<button class="button button-small" name="ps_kl_veiksmas" value="sutikimas_taip" onclick="return confirm(\'Įrašyti sutikimą rinkodarai (šaltinis: admin)? Klientas gaus patvirtinimo laišką.\')">Įrašyti sutikimą</button> ';
		else echo '<button class="button button-small" name="ps_kl_veiksmas" value="sutikimas_ne" onclick="return confirm(\'Atšaukti sutikimą? Klientas gaus patvirtinimo laišką.\')">Atšaukti sutikimą</button> ';
		echo '<button class="button button-small" name="ps_kl_veiksmas" value="perskaiciuoti_viena">Atnaujinti suvestinę</button></form></p></div>';

		echo '<div class="dvi"><div>';
		// prekės
		echo '<h2 class="sk">Pirkimai pagal prekę</h2>';
		$pr = $wpdb->get_results( $wpdb->prepare( "SELECT COALESCE(CONCAT('p',e.wc_product_id),CONCAT('m',e.modelis)) k, e.wc_product_id pid, MAX(e.pavadinimas) pav, COUNT(DISTINCT u.id) kartu, MIN(u.data) pirm, MAX(u.data) pask, SUM(e.kiekis) vnt, ROUND(SUM(e.suma),2) suma FROM $TE e JOIN $TU u ON u.id=e.uzsakymo_id WHERE u.ivykdytas=1 AND u.email=%s GROUP BY k ORDER BY kartu DESC, pask DESC", $e ), ARRAY_A );
		$wcp = $wpdb->get_results( $wpdb->prepare( "SELECT l.product_id pid, MAX(oi.order_item_name) pav, COUNT(DISTINCT l.order_id) kartu, MIN(l.date_created) pirm, MAX(l.date_created) pask, SUM(l.product_qty) vnt, ROUND(SUM(l.product_net_revenue+l.tax_amount),2) suma FROM {$p}wc_order_product_lookup l JOIN {$p}wc_orders o ON o.id=l.order_id JOIN {$p}woocommerce_order_items oi ON oi.order_item_id=l.order_item_id WHERE o.type='shop_order' AND o.status IN ('wc-completed','wc-processing') AND o.customer_id=%d GROUP BY l.product_id", $uid ), ARRAY_A );
		// sujungti pagal pid
		$vis = array(); foreach ( $pr as $x ) $vis[ $x['k'] ] = $x;
		foreach ( $wcp as $x ) { $k = 'p' . $x['pid']; if ( isset( $vis[ $k ] ) ) { $v =& $vis[ $k ]; $v['kartu'] += $x['kartu']; $v['vnt'] += $x['vnt']; $v['suma'] += $x['suma']; $v['pask'] = max( $v['pask'], $x['pask'] ); $v['pirm'] = min( $v['pirm'], $x['pirm'] ); unset( $v ); } else $vis[ $k ] = $x; }
		usort( $vis, function( $a, $b ) { $c = $b['kartu'] <=> $a['kartu']; return $c !== 0 ? $c : strcmp( $b['pask'], $a['pask'] ); } );
		echo '<table class="wp-list-table widefat striped"><thead><tr><th>Prekė</th><th class="num">Kartų</th><th class="num">Vnt.</th><th>Paskutinį kartą</th><th class="num">Kas kiek d.</th><th class="num">Iš viso €</th></tr></thead><tbody>';
		foreach ( $vis as $x ) { $c = ''; if ( $x['kartu'] >= 3 ) { $span = ( strtotime( $x['pask'] ) - strtotime( $x['pirm'] ) ) / 86400; $c = '~' . round( $span / ( $x['kartu'] - 1 ) ); }
			$pav = $x['pid'] ? '<a href="' . esc_url( get_edit_post_link( (int) $x['pid'] ) ?: '#' ) . '">' . esc_html( $x['pav'] ) . '</a>' : esc_html( $x['pav'] ) . ' <span class="muted">(nebeparduodama)</span>';
			echo '<tr><td>' . $pav . '</td><td class="num">' . (int) $x['kartu'] . '</td><td class="num">' . (int) $x['vnt'] . '</td><td>' . esc_html( substr( $x['pask'], 0, 10 ) ) . '</td><td class="num">' . ( $c ?: '<span class="muted">—</span>' ) . '</td><td class="num">' . number_format_i18n( (float) $x['suma'], 2 ) . '</td></tr>'; }
		if ( ! $vis ) echo '<tr><td colspan="6" class="muted">Pirkimų nėra.</td></tr>';
		echo '</tbody></table>';
		// užsakymai chronologiškai
		echo '<h2 class="sk">Užsakymai</h2><table class="wp-list-table widefat striped"><thead><tr><th>Data</th><th>Šaltinis</th><th>Nr.</th><th>Prekės</th><th class="num">Suma €</th><th>Būsena</th></tr></thead><tbody>';
		$uz = $wpdb->get_results( $wpdb->prepare( "SELECT u.id,u.data,u.suma,u.statusas,u.ivykdytas,u.siuntimas,(SELECT GROUP_CONCAT(CONCAT(e.kiekis,'× ',e.pavadinimas) SEPARATOR ' | ') FROM $TE e WHERE e.uzsakymo_id=u.id) prekes FROM $TU u WHERE u.email=%s ORDER BY u.data DESC LIMIT 100", $e ), ARRAY_A );
		$wco = $wpdb->get_results( $wpdb->prepare( "SELECT o.id,o.date_created_gmt data,o.total_amount suma,o.status,(SELECT GROUP_CONCAT(CONCAT(l.product_qty,'× ',oi.order_item_name) SEPARATOR ' | ') FROM {$p}wc_order_product_lookup l JOIN {$p}woocommerce_order_items oi ON oi.order_item_id=l.order_item_id WHERE l.order_id=o.id) prekes FROM {$p}wc_orders o WHERE o.type='shop_order' AND o.customer_id=%d ORDER BY o.date_created_gmt DESC LIMIT 100", $uid ), ARRAY_A );
		$all = array(); foreach ( $wco as $x ) $all[] = array( 'd' => get_date_from_gmt( $x['data'], 'Y-m-d' ), 's' => 'petshop.lt', 'nr' => '#' . $x['id'], 'p' => $x['prekes'], 'suma' => $x['suma'], 'b' => wc_get_order_status_name( $x['status'] ), 'ok' => in_array( $x['status'], array( 'wc-completed', 'wc-processing' ), true ) );
		foreach ( $uz as $x ) $all[] = array( 'd' => substr( $x['data'], 0, 10 ), 's' => 'eShoprent', 'nr' => $x['id'], 'p' => $x['prekes'], 'suma' => $x['suma'], 'b' => $x['statusas'], 'ok' => (int) $x['ivykdytas'] );
		usort( $all, function( $a, $b ) { return strcmp( $b['d'], $a['d'] ); } );
		foreach ( $all as $x ) echo '<tr' . ( $x['ok'] ? '' : ' style="opacity:.55"' ) . '><td>' . esc_html( $x['d'] ) . '</td><td>' . esc_html( $x['s'] ) . '</td><td>' . esc_html( $x['nr'] ) . '</td><td>' . esc_html( mb_strimwidth( (string) $x['p'], 0, 140, '…' ) ) . '</td><td class="num">' . number_format_i18n( (float) $x['suma'], 2 ) . '</td><td>' . esc_html( $x['b'] ) . '</td></tr>';
		if ( ! $all ) echo '<tr><td colspan="6" class="muted">Užsakymų nėra.</td></tr>';
		echo '</tbody></table></div><div>';
		// sutikimų žurnalas
		echo '<h2 class="sk">Sutikimų žurnalas</h2><table class="wp-list-table widefat striped"><thead><tr><th>Kada</th><th>Laukas</th><th>Iš → į</th><th>Šaltinis</th></tr></thead><tbody>';
		foreach ( $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$p}ps_consent_log WHERE email=%s ORDER BY id DESC LIMIT 30", $e ), ARRAY_A ) as $c ) echo '<tr><td>' . esc_html( $c['changed_at'] ) . '</td><td>' . esc_html( $c['field'] ) . '</td><td>' . esc_html( ( $c['from_value'] ?: '—' ) . ' → ' . $c['to_value'] ) . '</td><td>' . esc_html( $c['source'] ) . '</td></tr>';
		if ( $r['suppression'] ) echo '<tr><td colspan="4" class="ne">Aktyvi rinkodaros suppression (Sender atsisakymas) — rinkodaros laiškai praleidžiami.</td></tr>';
		echo '</tbody></table>';
		// laiškai
		echo '<h2 class="sk">Laiškai</h2><table class="wp-list-table widefat striped"><thead><tr><th>Kada</th><th>Srautas</th><th>Tema</th><th>Būsena</th></tr></thead><tbody>';
		$jobs = $wpdb->get_results( $wpdb->prepare( "SELECT created_at,flow,flow_class,subject,status,skip_reason,delivered_at,opened_at,clicked_at FROM {$p}ps_email_jobs WHERE recipient_email=%s ORDER BY id DESC LIMIT 30", $e ), ARRAY_A );
		foreach ( $jobs as $j ) { $b = $j['status']; if ( $j['skip_reason'] ) $b .= ' (' . $j['skip_reason'] . ')'; if ( $j['clicked_at'] ) $b .= ' · paspausta'; elseif ( $j['opened_at'] ) $b .= ' · atidaryta'; elseif ( $j['delivered_at'] ) $b .= ' · pristatyta';
			echo '<tr><td>' . esc_html( get_date_from_gmt( $j['created_at'], 'Y-m-d H:i' ) ) . '</td><td>' . esc_html( $j['flow'] ) . ' <span class="muted">' . esc_html( $j['flow_class'] ) . '</span></td><td>' . esc_html( $j['subject'] ?: '—' ) . '</td><td>' . esc_html( $b ) . '</td></tr>'; }
		if ( ! $jobs ) echo '<tr><td colspan="4" class="muted">Laiškų dar nebuvo.</td></tr>';
		echo '</tbody></table>';
		// augintiniai
		$pt = $p . 'ps_pets';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$pt'" ) === $pt ) { $pets = $wpdb->get_results( $wpdb->prepare( "SELECT pet_name,species,life_stage,dog_size,current_weight_kg,primary_product_name,current_food_brand,updated_at FROM $pt WHERE user_id=%d AND deleted_at IS NULL ORDER BY is_primary DESC", $uid ), ARRAY_A );
			echo '<h2 class="sk">Augintiniai</h2>'; if ( $pets ) { echo '<table class="wp-list-table widefat striped"><thead><tr><th>Vardas</th><th>Rūšis</th><th>Stadija</th><th class="num">Svoris</th><th>Maistas</th></tr></thead><tbody>'; foreach ( $pets as $x ) echo '<tr><td>' . esc_html( $x['pet_name'] ) . '</td><td>' . esc_html( $x['species'] ) . '</td><td>' . esc_html( $x['life_stage'] . ( $x['dog_size'] ? ' / ' . $x['dog_size'] : '' ) ) . '</td><td class="num">' . ( $x['current_weight_kg'] ? esc_html( $x['current_weight_kg'] ) . ' kg' : '—' ) . '</td><td>' . esc_html( $x['primary_product_name'] ?: $x['current_food_brand'] ?: '—' ) . '</td></tr>'; echo '</tbody></table>'; } else echo '<p class="muted">Augintinio anketos nėra.</p>'; }
		// pastaba
		echo '<h2 class="sk">Pastaba</h2><form method="post">' . wp_nonce_field( 'ps_kl', '_wpnonce', true, false ) . '<input type="hidden" name="uid" value="' . $uid . '"><input type="hidden" name="ps_kl_veiksmas" value="pastaba"><textarea name="pastaba" rows="3" style="width:100%">' . esc_textarea( get_user_meta( $uid, '_ps_pastaba', true ) ) . '</textarea><p><button class="button">Išsaugoti pastabą</button></p></form>';
		if ( ( $s = $wpdb->get_row( $wpdb->prepare( "SELECT segmentas,nba,gyvunas,brandas FROM {$p}ps_nl_snapshot WHERE email=%s", $e ), ARRAY_A ) ) ) echo '<p class="muted">eShoprent naujienlaiškio nuotrauka 2026-08-30: ' . esc_html( $s['segmentas'] ) . ' · ' . esc_html( $s['gyvunas'] ) . ' · ' . esc_html( $s['brandas'] ) . ' · NBA: ' . esc_html( $s['nba'] ) . '</p>';
		echo '</div></div>';
	}
}
Petshop_Klientai::init();
