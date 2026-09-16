<?php
/**
 * Plugin Name: Petshop Relaunch (informacinė kampanija istoriniams klientams)
 * Description: S1686 (Q4 planas, 2 punktas — „Maišas 55 €. O diena?"): (1) prekės puslapyje `?svoris=20` užpildo šėrimo skaičiuoklę ir paspaudžia „Apskaičiuoti" (tik UI, localStorage/profilio logika neliečiama); (2) `cid` — opaque atsitiktinis kampanijos tokenas (ne el. paštas, ne hash) iš `ps_relaunch_kontaktai` → paspaudimas įrašomas kaip signalas: usermeta `ps_weight_signal` (source email_calc_click, confidence medium; Pet Profile NEPERRAŠOMAS), `ps_web_ivykiai` tipas `email_calc_click`, lentelės klik_n/pask_svoris. Lentelę pildo 2 punkto skriptas (segmentai calc/product/generic, exact_product = ≤12 mėn. arba ≥3× ir ≤18 mėn.). Core neliečiamas.
 * Version: 1.1.0 — S1688: priminimo registracija prekės puslapyje po skaičiavimo (blokas #ps-primink, REST ps-relaunch/v1/priminti; prisijungęs → iš karto, svečias → patvirtinimo nuoroda el. paštu ?ps_primink=&z=). Registracija = ps_refill_tracking eilutė (feedback_cycle='relaunch', confidence 0.5, terminas pagal calc dienas × maišo būseną), Petshop_Sutikimai::nustatyti(optout=0,'relaunch_calc'), ps_weight_signal confidence high, ps_web_ivykiai `reminder_optin`. Svorio paspaudimas ir priminimas — du skirtingi veiksmai.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Relaunch {
	const T = 'ps_relaunch_kontaktai';
	const META = 'ps_weight_signal';

	public static function init() {
		add_action( 'init', array( __CLASS__, 'lentele' ), 5 );
		add_action( 'init', array( __CLASS__, 'lentele_v11' ), 6 );
		add_action( 'template_redirect', array( __CLASS__, 'paspaudimas' ), 20 );
		add_action( 'wp_footer', array( __CLASS__, 'js' ), 99 );
		add_action( 'rest_api_init', array( __CLASS__, 'rest' ) );
		add_action( 'template_redirect', array( __CLASS__, 'patvirtinimas' ), 19 );
	}

	public static function t() { global $wpdb; return $wpdb->prefix . self::T; }

	public static function lentele() {
		if ( get_option( 'ps_relaunch_lentele_v' ) === '1' ) return; global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( "CREATE TABLE " . self::t() . " (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			cid VARCHAR(24) NOT NULL,
			email VARCHAR(191) NOT NULL,
			user_id BIGINT UNSIGNED NULL,
			segmentas VARCHAR(16) NOT NULL DEFAULT 'generic',
			product_id BIGINT UNSIGNED NULL,
			rusis VARCHAR(8) NULL,
			svoriai VARCHAR(32) NULL,
			duomenys TEXT NULL,
			sukurta_at DATETIME NOT NULL,
			klik_n INT UNSIGNED NOT NULL DEFAULT 0,
			pask_klik_at DATETIME NULL,
			pask_svoris DECIMAL(5,1) NULL,
			PRIMARY KEY (id), UNIQUE KEY cid (cid), KEY email (email), KEY segmentas (segmentas)
		) " . $wpdb->get_charset_collate() . ";" );
		update_option( 'ps_relaunch_lentele_v', '1', false );
	}

	/** v1.1: papildomi stulpeliai (be dbDelta — ALTER tik jei nėra). */
	public static function lentele_v11() {
		if ( get_option( 'ps_relaunch_lentele_v11' ) === '1' ) return; global $wpdb; $t = self::t();
		$cols = $wpdb->get_col( "SHOW COLUMNS FROM $t" );
		if ( ! in_array( 'primink_at', $cols, true ) ) $wpdb->query( "ALTER TABLE $t ADD primink_at DATETIME NULL, ADD primink_kg DECIMAL(5,1) NULL, ADD primink_busena VARCHAR(12) NULL" );
		update_option( 'ps_relaunch_lentele_v11', '1', false );
	}

	public static function raktas() { $k = get_option( 'ps_relaunch_raktas' ); if ( ! $k ) { $k = wp_generate_password( 40, false ); update_option( 'ps_relaunch_raktas', $k, false ); } return $k; }
	public static function zenklas( $tok ) { return substr( hash_hmac( 'sha256', 'primink|' . $tok, self::raktas() ), 0, 24 ); }

	/** Rūšis: iš kampanijos eilutės, kitaip iš prekės kategorijų. */
	public static function rusis( $pid, $k = null ) {
		if ( $k && ! empty( $k['rusis'] ) ) return in_array( $k['rusis'], array( 'kate', 'cat' ), true ) ? 'cat' : 'dog';
		$slugs = wp_get_post_terms( $pid, 'product_cat', array( 'fields' => 'slugs' ) ); $s = is_array( $slugs ) ? implode( ' ', $slugs ) : '';
		return ( strpos( $s, 'katem' ) !== false || strpos( $s, 'kaciu' ) !== false ) ? 'cat' : 'dog';
	}

	/** Dienų vidurkis pagal gamintojo lentelę (tas pats kelias kaip svetainės skaičiuoklė). */
	public static function dienos( $pid, $kg, $sp ) {
		if ( ! class_exists( 'Petshop_Feeding_Service' ) ) return null;
		$r = Petshop_Feeding_Service::calc( array( 'product_id' => $pid, 'weight_kg' => $kg, 'species_code' => $sp ) );
		if ( ( $r['status'] ?? '' ) !== 'ok' || $r['days_min'] === null ) return null;
		return array( 'min' => (int) $r['days_min'], 'max' => (int) $r['days_max'], 'vid' => (int) round( ( (int) $r['days_min'] + (int) $r['days_max'] ) / 2 ) );
	}

	public static function rest() {
		register_rest_route( 'ps-relaunch/v1', '/priminti', array( 'methods' => 'POST', 'permission_callback' => '__return_true', 'callback' => array( __CLASS__, 'rest_priminti' ) ) );
	}

	/** POST {pid, kg, busena: naujas|puse|baigiasi, email?, cid?} */
	public static function rest_priminti( $req ) {
		self::lentele_v11();
		$pid = (int) $req->get_param( 'pid' ); $kg = (float) str_replace( ',', '.', (string) $req->get_param( 'kg' ) ); $bus = sanitize_key( (string) $req->get_param( 'busena' ) ); if ( ! in_array( $bus, array( 'naujas', 'puse', 'baigiasi' ), true ) ) $bus = 'puse';
		$cid = preg_replace( '/[^A-Za-z0-9]/', '', (string) $req->get_param( 'cid' ) ); $email = sanitize_email( (string) $req->get_param( 'email' ) );
		$pr = $pid ? wc_get_product( $pid ) : null;
		if ( ! $pr || 'publish' !== $pr->get_status() || ! $pr->is_purchasable() ) return new WP_REST_Response( array( 'ok' => false, 'klaida' => 'Šios prekės priminimų kol kas nesiūlome.' ), 400 );
		if ( $kg < 0.5 || $kg > 120 ) return new WP_REST_Response( array( 'ok' => false, 'klaida' => 'Įveskite augintinio svorį.' ), 400 );
		global $wpdb; $k = $cid ? $wpdb->get_row( $wpdb->prepare( "SELECT id,email,user_id,rusis FROM " . self::t() . " WHERE cid=%s", $cid ), ARRAY_A ) : null;
		$d = self::dienos( $pid, $kg, self::rusis( $pid, $k ) );
		if ( ! $d ) return new WP_REST_Response( array( 'ok' => false, 'klaida' => 'Šiai prekei gamintojo lentelės neturime, todėl termino apskaičiuoti negalime.' ), 400 );
		$uid = get_current_user_id();
		if ( $uid ) { $u = get_userdata( $uid ); $r = self::registruoti( $uid, $u->user_email, $pid, $kg, $bus, $d, $cid, $k ); return new WP_REST_Response( $r, 200 ); }
		// svečias — patvirtinimas el. paštu
		if ( ! $email || ! is_email( $email ) ) return new WP_REST_Response( array( 'ok' => false, 'klaida' => 'Įveskite el. paštą, kuriuo pirkote.' ), 400 );
		$rk = 'ps_primink_rl_' . md5( strtolower( $email ) ); $n = (int) get_transient( $rk ); if ( $n >= 3 ) return new WP_REST_Response( array( 'ok' => false, 'klaida' => 'Nuorodą jau išsiuntėme – patikrinkite paštą (ir šlamštą).' ), 429 ); set_transient( $rk, $n + 1, 900 );
		$tok = self::cid(); set_transient( 'ps_primink_' . $tok, array( 'email' => strtolower( $email ), 'pid' => $pid, 'kg' => $kg, 'busena' => $bus, 'cid' => $cid, 'd' => $d ), 7 * DAY_IN_SECONDS );
		$url = add_query_arg( array( 'ps_primink' => $tok, 'z' => self::zenklas( $tok ) ), home_url( '/' ) );
		$ok = self::laiskas_patvirtinti( $email, $pr, $kg, $d, $url );
		return new WP_REST_Response( array( 'ok' => (bool) $ok, 'svecias' => true, 'zinute' => $ok ? 'Išsiuntėme patvirtinimo nuorodą į ' . $email . '. Paspauskite ją – ir priminimas įjungtas.' : 'Nepavyko išsiųsti laiško. Bandykite vėliau.' ), $ok ? 200 : 500 );
	}

	/** Svečio patvirtinimo nuoroda ?ps_primink=&z= → registracija → prekės puslapis su ?ps_primink_ok=1 */
	public static function patvirtinimas() {
		if ( empty( $_GET['ps_primink'] ) || empty( $_GET['z'] ) ) return;
		$tok = preg_replace( '/[^A-Za-z0-9]/', '', (string) $_GET['ps_primink'] ); $z = preg_replace( '/[^a-f0-9]/', '', (string) $_GET['z'] );
		if ( ! hash_equals( self::zenklas( $tok ), $z ) ) { wp_die( 'Nuoroda neteisinga.' ); }
		$p = get_transient( 'ps_primink_' . $tok ); if ( ! $p ) { wp_die( 'Nuoroda nebegalioja (7 d.). Prekės puslapyje galite paprašyti priminimo iš naujo.' ); }
		self::lentele_v11(); $email = $p['email']; $u = get_user_by( 'email', $email );
		if ( ! $u ) { add_filter( 'woocommerce_email_enabled_customer_new_account', '__return_false' ); $nid = wc_create_new_customer( $email, '', wp_generate_password( 24 ) ); if ( is_wp_error( $nid ) ) wp_die( 'Nepavyko sukurti paskyros.' ); $u = get_userdata( $nid ); }
		global $wpdb; $k = ! empty( $p['cid'] ) ? $wpdb->get_row( $wpdb->prepare( "SELECT id,email,user_id,rusis FROM " . self::t() . " WHERE cid=%s", $p['cid'] ), ARRAY_A ) : null;
		self::registruoti( (int) $u->ID, $email, (int) $p['pid'], (float) $p['kg'], $p['busena'], $p['d'], (string) $p['cid'], $k, 'email_link' );
		delete_transient( 'ps_primink_' . $tok );
		wp_safe_redirect( add_query_arg( 'ps_primink_ok', '1', get_permalink( (int) $p['pid'] ) ) ); exit;
	}

	/** Pati registracija: refill eilutė + sutikimas + svorio signalas + įvykis + kampanijos eilutė. */
	public static function registruoti( $uid, $email, $pid, $kg, $bus, $d, $cid, $k, $saltinis = 'site' ) {
		global $wpdb; $p = $wpdb->prefix; $t = $p . 'ps_refill_tracking'; $dabar = current_time( 'mysql', true ); $today = current_time( 'Y-m-d' );
		$f = array( 'naujas' => 1.0, 'puse' => 0.5, 'baigiasi' => 0.15 ); $liko = max( 3, (int) round( $d['vid'] * $f[ $bus ] ) );
		$predicted = date( 'Y-m-d', strtotime( $today ) + $liko * 86400 );
		$ex = $wpdb->get_row( $wpdb->prepare( "SELECT id,last_order_id,purchase_count FROM $t WHERE user_id=%d AND product_id=%d", $uid, $pid ), ARRAY_A );
		if ( $ex ) {
			$wpdb->update( $t, array( 'avg_interval_days' => $d['vid'], 'predicted_empty_date' => $predicted, 'confidence' => 0.5, 'status' => 'active', 'feedback_cycle' => 'relaunch', 'updated_at' => gmdate( 'Y-m-d H:i:s' ) ), array( 'id' => $ex['id'] ) );
		} else {
			$oid = (int) $wpdb->get_var( $wpdb->prepare( "SELECT l.order_id FROM {$p}wc_order_product_lookup l JOIN {$p}wc_orders o ON o.id=l.order_id WHERE l.customer_id=%d AND l.product_id=%d AND o.status IN ('wc-processing','wc-completed') ORDER BY l.order_id DESC LIMIT 1", $uid, $pid ) );
			$wpdb->insert( $t, array( 'user_id' => $uid, 'product_id' => $pid, 'pet_id' => null, 'last_order_id' => $oid, 'last_purchase_date' => $today, 'purchase_count' => 0, 'avg_interval_days' => $d['vid'], 'predicted_empty_date' => $predicted, 'confidence' => 0.5, 'status' => 'active', 'feedback_cycle' => 'relaunch', 'created_at' => gmdate( 'Y-m-d H:i:s' ), 'updated_at' => gmdate( 'Y-m-d H:i:s' ) ) );
		}
		if ( class_exists( 'Petshop_Sutikimai' ) ) Petshop_Sutikimai::nustatyti( $email, $uid, 0, 'relaunch_calc_' . $saltinis );
		$s = get_user_meta( $uid, self::META, true ); $s = is_array( $s ) ? $s : array();
		$s[] = array( 'weight_kg' => $kg, 'source' => 'reminder_optin', 'confidence' => 'high', 'product_id' => $pid, 'cid' => $cid ?: null, 'at' => $dabar ); update_user_meta( $uid, self::META, array_slice( $s, -5 ) );
		if ( $k ) $wpdb->update( self::t(), array( 'primink_at' => $dabar, 'primink_kg' => $kg, 'primink_busena' => $bus ), array( 'id' => $k['id'] ) );
		elseif ( $email ) $wpdb->query( $wpdb->prepare( "UPDATE " . self::t() . " SET primink_at=%s, primink_kg=%f, primink_busena=%s WHERE email=%s", $dabar, $kg, $bus, strtolower( $email ) ) );
		if ( class_exists( 'Petshop_Analitika' ) ) {
			$wpdb->insert( Petshop_Analitika::t_ivykiai(), array( 'laikas' => $dabar, 'diena' => method_exists( 'Petshop_Analitika', 'verslo_diena' ) ? Petshop_Analitika::verslo_diena( $dabar ) : substr( $dabar, 0, 10 ), 'tipas' => 'reminder_optin', 'pusl_tipas' => 'product', 'url_kelias' => substr( (string) parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), 0, 190 ), 'raktas' => (string) $pid, 'raktas2' => $k ? 'relaunch' : $saltinis, 'reiksme' => $liko, 'saltinis' => $k ? 'sender' : 'site', 'medium' => $k ? 'email' : 'site', 'kampanija' => $k ? 'relaunch' : null, 'kanalas' => $k ? 'email' : 'site', 'irenginys' => method_exists( 'Petshop_Analitika', 'irenginys' ) ? Petshop_Analitika::irenginys( (string) ( $_SERVER['HTTP_USER_AGENT'] ?? '' ) ) : null, 'prisijunges' => get_current_user_id() ? 1 : 0, 'sutikimas' => 1, 'testinis' => 0, 'saltinis_aplinka' => method_exists( 'Petshop_Analitika', 'aplinka' ) ? Petshop_Analitika::aplinka() : 'prod' ) );
		}
		$men = array( 1 => 'sausio', 'vasario', 'kovo', 'balandžio', 'gegužės', 'birželio', 'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio' ); $ts = strtotime( $predicted ) - 5 * 86400;
		return array( 'ok' => true, 'data' => $men[ (int) date( 'n', $ts ) ] . ' ' . (int) date( 'j', $ts ) . ' d.', 'liko' => $liko, 'zinute' => 'Priminsime apie ' . $men[ (int) date( 'n', $ts ) ] . ' ' . (int) date( 'j', $ts ) . ' d. Jei sunaudosite greičiau ar lėčiau – laiške galėsite patikslinti.' );
	}

	/** Svečio patvirtinimo laiškas (transakcinis, per wp_mail). */
	public static function laiskas_patvirtinti( $email, $pr, $kg, $d, $url ) {
		$pav = $pr->get_name(); $tema = 'Patvirtinkite priminimą: ' . $pav;
		$body = '<p style="margin:0 0 14px;font-size:16px;line-height:24px;color:#1f2a1f;">Paprašėte priminti, kai baigsis <strong>' . esc_html( $pav ) . '</strong> (' . esc_html( rtrim( rtrim( number_format( $kg, 1, ',', '' ), '0' ), ',' ) ) . ' kg augintiniui, maišo užtenka apie ' . (int) $d['min'] . '–' . (int) $d['max'] . ' d.).</p>'
			. '<p style="margin:0 0 22px;font-size:16px;line-height:24px;color:#1f2a1f;">Kad įjungtume priminimą, patvirtinkite el. paštą vienu paspaudimu:</p>'
			. '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 22px;"><tr><td bgcolor="#2f6b3a" style="border-radius:6px;padding:14px 40px;"><a href="' . esc_url( $url ) . '" style="font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;display:inline-block;">Įjungti priminimą</a></td></tr></table>'
			. '<p style="margin:0;font-size:13px;line-height:19px;color:#777;">Nuoroda galioja 7 dienas. Jei priminimo neprašėte – tiesiog ignoruokite šį laišką, nieko neįjungsime.</p>';
		$html = '<!DOCTYPE html><html lang="lt"><body style="margin:0;padding:0;background:#f3f4f1;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f1;"><tr><td align="center" style="padding:24px 12px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:8px;font-family:Arial,Helvetica,sans-serif;"><tr><td style="padding:22px 32px 6px;font-size:15px;font-weight:bold;color:#2f6b3a;">petshop.lt</td></tr><tr><td style="padding:10px 32px 26px;">' . $body . '</td></tr></table></td></tr></table></body></html>';
		return wp_mail( $email, $tema, $html, array( 'Content-Type: text/html; charset=UTF-8' ) );
	}

	public static function cid() { return substr( str_replace( array( '+', '/', '=' ), '', base64_encode( random_bytes( 18 ) ) ), 0, 20 ); }

	public static function svoris() {
		if ( ! isset( $_GET['svoris'] ) ) return null;
		$v = (float) str_replace( ',', '.', (string) $_GET['svoris'] );
		return ( $v >= 0.5 && $v <= 120 ) ? $v : null;
	}

	/** cid + svoris → signalas. Vieną kartą per užklausą, tik prekės puslapyje. */
	public static function paspaudimas() {
		if ( ! function_exists( 'is_product' ) || ! is_product() ) return;
		$kg = self::svoris(); $cid = isset( $_GET['cid'] ) ? preg_replace( '/[^A-Za-z0-9]/', '', (string) $_GET['cid'] ) : '';
		if ( null === $kg ) return;
		global $wpdb; $k = null; $uid = get_current_user_id();
		if ( $cid ) { $k = $wpdb->get_row( $wpdb->prepare( "SELECT id,email,user_id,segmentas FROM " . self::t() . " WHERE cid=%s", $cid ), ARRAY_A ); if ( $k && ! $uid ) $uid = (int) $k['user_id']; }
		if ( ! $k && ! $uid ) return;
		$pid = (int) get_queried_object_id(); $dabar = current_time( 'mysql', true );
		if ( $k ) $wpdb->query( $wpdb->prepare( "UPDATE " . self::t() . " SET klik_n=klik_n+1, pask_klik_at=%s, pask_svoris=%f WHERE id=%d", $dabar, $kg, $k['id'] ) );
		if ( $uid ) {
			$s = get_user_meta( $uid, self::META, true ); $s = is_array( $s ) ? $s : array();
			$s[] = array( 'weight_kg' => $kg, 'source' => 'email_calc_click', 'confidence' => 'medium', 'product_id' => $pid, 'cid' => $cid ?: null, 'at' => $dabar );
			update_user_meta( $uid, self::META, array_slice( $s, -5 ) );
		}
		if ( class_exists( 'Petshop_Analitika' ) ) {
			$wpdb->insert( Petshop_Analitika::t_ivykiai(), array(
				'laikas' => $dabar, 'diena' => method_exists( 'Petshop_Analitika', 'verslo_diena' ) ? Petshop_Analitika::verslo_diena( $dabar ) : substr( $dabar, 0, 10 ),
				'tipas' => 'email_calc_click', 'pusl_tipas' => 'product', 'url_kelias' => substr( (string) parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ), 0, 190 ),
				'raktas' => (string) $pid, 'raktas2' => $k ? $k['segmentas'] : 'login', 'reiksme' => $kg,
				'saltinis' => 'sender', 'medium' => 'email', 'kampanija' => 'relaunch', 'kanalas' => 'email',
				'irenginys' => method_exists( 'Petshop_Analitika', 'irenginys' ) ? Petshop_Analitika::irenginys( (string) ( $_SERVER['HTTP_USER_AGENT'] ?? '' ) ) : null,
				'prisijunges' => get_current_user_id() ? 1 : 0, 'sutikimas' => 0, 'testinis' => 0,
				'saltinis_aplinka' => method_exists( 'Petshop_Analitika', 'aplinka' ) ? Petshop_Analitika::aplinka() : 'prod',
			) );
		}
	}

	/** Skaičiuoklės užpildymas (?svoris) + priminimo blokas po skaičiavimo (cid / ?svoris / prisijungęs). */
	public static function js() {
		if ( ! function_exists( 'is_product' ) || ! is_product() ) return; $kg = self::svoris(); $pid = (int) get_queried_object_id();
		$cid = isset( $_GET['cid'] ) ? preg_replace( '/[^A-Za-z0-9]/', '', (string) $_GET['cid'] ) : ''; $uid = get_current_user_id();
		if ( null !== $kg ) echo '<script>(function(){var kg=' . json_encode( $kg ) . ',n=0,t=setInterval(function(){var r=document.getElementById("ps-calc"),w=document.getElementById("ps-calc-w"),b=r&&r.querySelector(".ps-calc-go");n++;if(w&&b){clearInterval(t);w.value=kg;b.click();setTimeout(function(){r.scrollIntoView({behavior:"smooth",block:"start"});},250);}else if(n>40){clearInterval(t);}},100);})();</script>';
		if ( null === $kg && ! $cid && ! $uid ) return;
		$pr = wc_get_product( $pid ); if ( ! $pr || ! $pr->is_purchasable() ) return;
		$cfg = array( 'pid' => $pid, 'pav' => $pr->get_name(), 'rest' => esc_url_raw( rest_url( 'ps-relaunch/v1/priminti' ) ), 'nonce' => wp_create_nonce( 'wp_rest' ), 'uid' => $uid ? 1 : 0, 'cid' => $cid, 'ok' => ! empty( $_GET['ps_primink_ok'] ) ? 1 : 0 );
		?>
<style>.ps-primink{margin:14px 0 6px;padding:16px 18px;border:1px solid #cfe0d2;border-radius:10px;background:#f4f9f5;font-size:14px;line-height:1.45;color:#1f2a1f}.ps-primink .t{font-weight:700;font-size:16px;margin-bottom:4px}.ps-primink .d{color:#4b5a4d;margin-bottom:10px}.ps-primink .s{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.ps-primink .s label{border:1px solid #b9cdbd;border-radius:20px;padding:5px 12px;cursor:pointer;background:#fff;font-size:13px}.ps-primink .s input{display:none}.ps-primink .s input:checked+span{font-weight:700;color:#2f6b3a}.ps-primink .s label:has(input:checked){border-color:#2f6b3a;background:#e6f2e8}.ps-primink input[type=email]{width:100%;max-width:320px;padding:9px 10px;border:1px solid #b9cdbd;border-radius:6px;margin:0 0 8px;font-size:14px}.ps-primink button{background:#2f6b3a;color:#fff;border:0;border-radius:6px;padding:11px 20px;font-weight:700;font-size:15px;cursor:pointer}.ps-primink button[disabled]{opacity:.6}.ps-primink .m{margin-top:8px;font-size:12.5px;color:#6b776d}.ps-primink .ok{font-weight:700;color:#2f6b3a;font-size:15px}.ps-primink .err{color:#b3261e;margin-top:6px}</style>
<script>(function(){var C=<?php echo wp_json_encode( $cfg ); ?>,root=null,done=false;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function blokas(out){if(document.getElementById('ps-primink'))return;var kgEl=document.getElementById('ps-calc-w'),kg=kgEl?parseFloat(String(kgEl.value).replace(',','.')):0;if(!kg)return;var big=out.querySelector('.big'),d=big?big.textContent:'';
var el=document.createElement('div');el.id='ps-primink';el.className='ps-primink';
el.innerHTML='<div class="t">Priminti, kai šis maišas baigsis?</div><div class="d">'+esc(C.pav)+' · '+esc(kg)+' kg augintiniui'+(d?' · '+esc(d.replace(/^Apie\s*/,'užtenka apie '))+'':'')+'</div>'
+'<div class="s"><span style="align-self:center;color:#4b5a4d;margin-right:4px">Dabartinis maišas:</span><label><input type="radio" name="ps-pb" value="naujas"><span>ką tik atidarytas</span></label><label><input type="radio" name="ps-pb" value="puse" checked><span>įpusėjęs</span></label><label><input type="radio" name="ps-pb" value="baigiasi"><span>baigiasi</span></label></div>'
+(C.uid?'':'<input type="email" id="ps-primink-e" placeholder="El. paštas, kuriuo pirkote" autocomplete="email">')
+'<div><button type="button" id="ps-primink-go">Taip, priminkite</button></div><div class="m">Vienas laiškas likus ~5 d. iki pabaigos – ir nieko daugiau. Atsisakyti galėsite vienu paspaudimu pačiame laiške.</div><div class="err" id="ps-primink-err"></div>';
out.parentNode.insertBefore(el,out.nextSibling);
document.getElementById('ps-primink-go').addEventListener('click',function(){var b=this,bus=(el.querySelector('input[name=ps-pb]:checked')||{}).value||'puse',e=C.uid?'':(document.getElementById('ps-primink-e')||{}).value||'',err=document.getElementById('ps-primink-err');err.textContent='';
if(!C.uid&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)){err.textContent='Įveskite el. paštą, kuriuo pirkote.';return;}
b.disabled=true;fetch(C.rest,{method:'POST',headers:{'Content-Type':'application/json','X-WP-Nonce':C.nonce},credentials:'same-origin',body:JSON.stringify({pid:C.pid,kg:kg,busena:bus,email:e,cid:C.cid})}).then(function(r){return r.json();}).then(function(j){if(j&&j.ok){el.innerHTML='<div class="ok">'+esc(j.zinute||'Priminimas įjungtas.')+'</div>';}else{b.disabled=false;err.textContent=(j&&j.klaida)||'Nepavyko. Bandykite dar kartą.';}}).catch(function(){b.disabled=false;err.textContent='Nepavyko. Bandykite dar kartą.';});});}
function start(){root=document.getElementById('ps-calc');var out=root&&root.querySelector('.ps-calc-out');if(!out)return false;
if(C.ok){var okEl=document.createElement('div');okEl.id='ps-primink';okEl.className='ps-primink';okEl.innerHTML='<div class="ok">Priminimas įjungtas. Pirmą laišką išsiųsime likus ~5 d. iki maišo pabaigos.</div>';out.parentNode.insertBefore(okEl,out.nextSibling);return true;}
new MutationObserver(function(){if(out.querySelector('.big'))blokas(out);}).observe(out,{childList:true,subtree:true});if(out.querySelector('.big'))blokas(out);return true;}
var n=0,t=setInterval(function(){n++;if(start()||n>50)clearInterval(t);},150);})();</script>
		<?php
	}
}
Petshop_Relaunch::init();
