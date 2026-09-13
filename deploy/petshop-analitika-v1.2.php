<?php
/**
 * Plugin Name: Petshop Analitika
 * Description: Savas „GA4" — pirmosios salies analitika (ps_web_ivykiai, ps_web_dienos). Master planas v1.7 §4A.1–4A.2, etapas E2.
 * Version: 1.2
 *
 * KODEL (planas §4A): GA4 rodo tai, ka mato Google ir kaip Google skaiciuoja.
 * Sprendimams reikia SAVU duomenu, kur uzsakymas = Woo faktas, o ne pikselio
 * ivykis. GA4/GTM LIEKA — Google Ads algoritmui reikia konversiju signalo —
 * bet sprendimai priimami is musu ekranu.
 *
 * ══════════════════════════════════════════════════════════════════════
 * RAIMIO SPRENDIMAI 2026-08-26 (uzrakinta)
 * ══════════════════════════════════════════════════════════════════════
 *  1. `purchase` is narsykles — ATMETAMAS KIETAI. Vienas `purchase` = serverio
 *     faktas `ps_fakt_uzsakymai`. Dvieju „tiesu" vienoje lenteleje nebus.
 *     Atmetimas TRIJUOSE sluoksniuose: JS neleidzia i eile, serveris atmeta
 *     gavimo metu, `irasyti()` atmeta dar karta. Kiekvienas atmetimas
 *     SKAICIUOJAMAS (`ps_web_atmesta_purchase`) — jei skaitiklis auga, vadinasi
 *     kazkas bando ji siusti, ir tai matosi, o ne dingsta tyloje.
 *  2. „Aciu" puslapis NEISMETAMAS: fiksuojamas kaip paprastas `pageview` su
 *     `pusl_tipas='aciu'`, BE SUMU. Tai pigus ad-blocker/sutikimo nuostoliu
 *     matas §5.11 kontroles skirtukui: Woo uzsakymai vs `aciu` perziuros vs
 *     GA4 purchase (rankinis) — trys skaiciai, ir matosi, kuris tikras.
 *  3. `petshop-kanalai.php` PRIJUNGIAMAS, ne perrasomas. Jis jau turi UTM
 *     rinkima, gclid/fbclid kaip 0/1 ir klasifikatoriu su taisyklemis is
 *     nustatymo. Cia tik SKAITOM `WC()->session->get('ps_kanalai')`.
 *  4. Endpoint'as — ATSKIRAS namespace `ps-web/v1`, ne M8 `petshop/v1`.
 *     Priezastis: `petshop/v1` turi 38 marsrutus su kliento duomenimis
 *     (augintiniai, profiliai, magic-login), o beacon'as yra auksto daznio
 *     anoniminis kelias. Jiems nedera gyventi kartu.
 *  5. Valymas: zali ivykiai -> esamas 90 d. mechanizmas (`ps_stat_zaliu_dienos`);
 *     `ps_web_dienos` agregatas -> SAUGOMAS, valymas jo NEPASIEKIA (DoD).
 *
 * ══════════════════════════════════════════════════════════════════════
 * DU SLUOKSNIAI (tas pats principas, kuris jau uzrakintas statistikoje)
 * ══════════════════════════════════════════════════════════════════════
 *  Sluoksnis 0 — BE SUTIKIMO. `lankytojas_d` = sha256(IP + UA + DIENOS
 *    DRUSKA). Druska keiciasi kas para, todel nuolatinio ID NERA ir kryzminio
 *    sekimo neimanoma. IP NIEKADA nesaugomas — tik jo maisos dalis.
 *    Leidzia: unikalius lankytojus/d, atmetimo rodikli, saltinius, puslapius,
 *    paieskas. Etalonas — Plausible/Matomo cookieless (CNIL pripazintas).
 *  Sluoksnis 1 — SU STATISTIKOS SUTIKIMU (Complianz `statistics`).
 *    30 d. slapukas `ps_k` -> `lankytojas_30`: grizatantys lankytojai,
 *    keliu apsilankymu piltuvelis, pilnas atributacijos langas.
 *    Ekranuose zyma „is sutikusiu".
 *
 * SESIJA — esama WooCommerce sesija (butinas slapukas, sutikimo nereikalauja).
 * Naujo slapuko sluoksniui 0 NEKURIAM (planas Q1).
 *
 * LAIKO ZONA (§3 taisykle 11): `laikas` — UTC; `diena` — Vilniaus verslo diena.
 * Vienas saltinis — `Petshop_Faktai::dabar()` / `::verslo_diena()`.
 *
 * KONTRAKTO PAPILDYMAS (deklaruojamas, §7 taisykle 5 — i plana v1.8):
 *   + `pusl_tipas` atskiru stulpeliu. Planas §4A.1 zodi „tipas" vartoja DVIEM
 *     dalykams: ivykio tipui (`pageview`, `view_item`…) ir puslapio tipui
 *     (`home`, `preke`, `aciu`…). Sudejus i viena stulpeli, `pageview` ivykiu
 *     butu neimanoma suskaiciuoti bendrai. Todel: `tipas` = ivykis,
 *     `pusl_tipas` = puslapio rusis. Tai ta pati §7 taisykle 16 (vienas vardas
 *     dviem dalykams) — tik pagauta PRIES rasant, ne po.
 *
 * @package Petshop
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Analitika {

	const VERSIJA        = '1.2';
	const SCHEMOS_RAKTAS = 'ps_web_schema';
	const SCHEMOS_VER    = 1;

	const NS       = 'ps-web/v1';
	const KELIAS   = '/i';
	const COOKIE30 = 'ps_k';
	const SESIJA_K = 'ps_kanalai';           /* Petshop_Kanalai::SESIJA */

	const CRON_AGR   = 'ps_web_agregavimas';
	const CRON_VALYM = 'ps_web_valymas';

	const OPT_DRUSKA   = 'ps_web_druska';
	const OPT_ATMESTA  = 'ps_web_atmesta_purchase';
	const OPT_ZALIU_D  = 'ps_stat_zaliu_dienos';   /* esamas, 90 */

	/** Ivykiai, kuriuos priimam is dataLayer. `purchase` cia NERA ir NEBUS. */
	const IS_DATALAYER = array( 'view_item', 'add_to_cart', 'view_cart', 'begin_checkout' );

	/** Musu pacio ivykiai. */
	const SAVI = array( 'pageview', 'view_category', 'search', 'filter', 'skaiciuokle', 'quiz_start', 'remove_from_cart', 'error404' );

	/** 🔴 NIEKADA nepriimami — nesvarbu, kas ir kaip juos atsiustu. */
	const DRAUDZIAMI = array( 'purchase', 'refund' );

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'marsrutai' ) );
		add_action( 'wp_footer', array( __CLASS__, 'beacon' ), 99 );
		add_action( self::CRON_AGR, array( __CLASS__, 'agreguoti_vakar' ) );
		add_action( self::CRON_VALYM, array( __CLASS__, 'valyti' ) );
		self::planuoti();
	}

	public static function planuoti() {
		/* Agregavimas 00:10 UTC — PO siuntu sutikrinimo (00:05), PRIES
		   ps_ataskaitu_agregavimas (00:15). Valymas — po visko, 02:40 UTC. */
		if ( ! wp_next_scheduled( self::CRON_AGR ) ) {
			wp_schedule_event( strtotime( gmdate( 'Y-m-d', time() + DAY_IN_SECONDS ) . ' 00:10:00 UTC' ), 'daily', self::CRON_AGR );
		}
		if ( ! wp_next_scheduled( self::CRON_VALYM ) ) {
			wp_schedule_event( strtotime( gmdate( 'Y-m-d', time() + DAY_IN_SECONDS ) . ' 02:40:00 UTC' ), 'daily', self::CRON_VALYM );
		}
	}

	/* ================================================================== */
	/* LENTELES                                                           */
	/* ================================================================== */

	public static function t_ivykiai() { global $wpdb; return $wpdb->prefix . 'ps_web_ivykiai'; }
	public static function t_dienos()  { global $wpdb; return $wpdb->prefix . 'ps_web_dienos'; }

	public static function uztikrinti_lenteles( $priverstinai = false ) {
		if ( ! $priverstinai && (int) get_option( self::SCHEMOS_RAKTAS ) === self::SCHEMOS_VER ) { return; }
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		$cs = $wpdb->get_charset_collate();
		$i  = self::t_ivykiai();
		$d  = self::t_dienos();

		/* Apimtis (§4A.2): ~500 sesiju/d x ~12 ivykiu = ~6 k eiluciu/d,
		   90 d. ~540 k. Indeksai (laikas), (sesija), (diena, tipas). */
		dbDelta( "CREATE TABLE $i (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			laikas DATETIME NOT NULL,
			diena DATE NOT NULL,
			tipas VARCHAR(24) NOT NULL DEFAULT '',
			pusl_tipas VARCHAR(24) NULL DEFAULT NULL,
			url_kelias VARCHAR(255) NULL DEFAULT NULL,
			raktas VARCHAR(190) NULL DEFAULT NULL,
			raktas2 VARCHAR(190) NULL DEFAULT NULL,
			reiksme BIGINT NULL DEFAULT NULL,
			sesija VARCHAR(64) NULL DEFAULT NULL,
			lankytojas_d CHAR(64) NOT NULL DEFAULT '',
			lankytojas_30 CHAR(64) NULL DEFAULT NULL,
			saltinis VARCHAR(96) NULL DEFAULT NULL,
			medium VARCHAR(96) NULL DEFAULT NULL,
			kampanija VARCHAR(96) NULL DEFAULT NULL,
			referer_domenas VARCHAR(190) NULL DEFAULT NULL,
			kanalas VARCHAR(24) NULL DEFAULT NULL,
			landing TINYINT(1) NOT NULL DEFAULT 0,
			irenginys VARCHAR(10) NULL DEFAULT NULL,
			os_seima VARCHAR(24) NULL DEFAULT NULL,
			nars_seima VARCHAR(24) NULL DEFAULT NULL,
			salis VARCHAR(8) NULL DEFAULT NULL,
			prisijunges TINYINT(1) NOT NULL DEFAULT 0,
			sutikimas TINYINT(1) NOT NULL DEFAULT 0,
			testinis TINYINT(1) NOT NULL DEFAULT 0,
			saltinis_aplinka VARCHAR(10) NOT NULL DEFAULT 'dev',
			PRIMARY KEY  (id),
			KEY l (laikas),
			KEY s (sesija),
			KEY dt (diena, tipas),
			KEY ld (diena, lankytojas_d)
		) ENGINE=InnoDB ROW_FORMAT=DYNAMIC $cs;" );

		/* Agregatas — AMZINAS. Vienas variklis su `pjuvis` stulpeliu
		   (esamas principas „sritis, ne penki moduliai"). */
		dbDelta( "CREATE TABLE $d (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			data DATE NOT NULL,
			pjuvis VARCHAR(20) NOT NULL DEFAULT '',
			raktas VARCHAR(190) NOT NULL DEFAULT '',
			raktas2 VARCHAR(190) NOT NULL DEFAULT '',
			apsilankymai INT UNSIGNED NOT NULL DEFAULT 0,
			lankytojai INT UNSIGNED NOT NULL DEFAULT 0,
			perziuros INT UNSIGNED NOT NULL DEFAULT 0,
			atmetimai INT UNSIGNED NOT NULL DEFAULT 0,
			trukme_s_suma BIGINT UNSIGNED NOT NULL DEFAULT 0,
			view_item INT UNSIGNED NOT NULL DEFAULT 0,
			add_to_cart INT UNSIGNED NOT NULL DEFAULT 0,
			begin_checkout INT UNSIGNED NOT NULL DEFAULT 0,
			uzsakymai INT UNSIGNED NOT NULL DEFAULT 0,
			pajamos_ct BIGINT NOT NULL DEFAULT 0,
			kontribucija_ct BIGINT NOT NULL DEFAULT 0,
			sutikusiu_dalis DECIMAL(5,2) NOT NULL DEFAULT 0.00,
			aplinka VARCHAR(10) NOT NULL DEFAULT 'dev',
			PRIMARY KEY  (id),
			UNIQUE KEY vienas (data, pjuvis, raktas, raktas2, aplinka),
			KEY dp (data, pjuvis)
		) ENGINE=InnoDB ROW_FORMAT=DYNAMIC $cs;" );

		update_option( self::SCHEMOS_RAKTAS, self::SCHEMOS_VER );
	}

	/* ================================================================== */
	/* PAGALBININKAI — vienas saltinis, be savo kopiju                     */
	/* ================================================================== */

	public static function dabar() {
		return class_exists( 'Petshop_Faktai' ) ? Petshop_Faktai::dabar() : current_time( 'mysql', true );
	}
	public static function verslo_diena( $utc ) {
		if ( class_exists( 'Petshop_Faktai' ) ) { return Petshop_Faktai::verslo_diena( $utc ); }
		$ts = strtotime( $utc . ' UTC' );
		return $ts ? wp_date( 'Y-m-d', $ts ) : gmdate( 'Y-m-d' );
	}
	public static function aplinka() {
		return class_exists( 'Petshop_Faktai' ) ? Petshop_Faktai::aplinka() : 'dev';
	}

	/**
	 * DIENOS DRUSKA. Keiciasi kas para -> `lankytojas_d` kita diena kitoks,
	 * todel NUOLATINIO ID NERA. Tai ir yra priezastis, del kurios sluoksnis 0
	 * nereikalauja sutikimo.
	 */
	public static function druska() {
		$d = gmdate( 'Y-m-d' );
		$o = get_option( self::OPT_DRUSKA );
		if ( is_array( $o ) && isset( $o['diena'] ) && $o['diena'] === $d && ! empty( $o['druska'] ) ) {
			return $o['druska'];
		}
		$nauja = wp_generate_password( 48, false, false );
		update_option( self::OPT_DRUSKA, array( 'diena' => $d, 'druska' => $nauja ), false );
		return $nauja;
	}

	/** IP NIEKADA nesaugomas — tik ieina i maisa ir dingsta. */
	private static function ip() {
		foreach ( array( 'HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR' ) as $k ) {
			if ( ! empty( $_SERVER[ $k ] ) ) {
				$v = explode( ',', (string) wp_unslash( $_SERVER[ $k ] ) );
				return trim( $v[0] );
			}
		}
		return '';
	}

	public static function lankytojas_d() {
		$ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? (string) wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) : '';
		return hash( 'sha256', self::ip() . '|' . $ua . '|' . self::druska() );
	}

	/** Statistikos sutikimas — TAS PATS saltinis kaip kanaluose. */
	public static function sutikimas() {
		if ( class_exists( 'Petshop_Kanalai' ) && method_exists( 'Petshop_Kanalai', 'sutikimas' ) ) {
			return (bool) Petshop_Kanalai::sutikimas();
		}
		if ( function_exists( 'cmplz_has_consent' ) ) { return (bool) cmplz_has_consent( 'statistics' ); }
		return false;
	}

	/**
	 * WC sesijos ID. Skaitom SLAPUKA tiesiogiai, nes REST uzklausoje
	 * `WC()->session` gali buti dar neinicializuota, o startuoti jos del
	 * beacon'o NENORIM — sesijos slapukas turi atsirasti nuo kliento veiksmo,
	 * ne nuo musu matavimo.
	 */
	public static function sesija() {
		if ( ! defined( 'COOKIEHASH' ) ) { return null; }
		$k = 'wp_woocommerce_session_' . COOKIEHASH;
		if ( empty( $_COOKIE[ $k ] ) ) { return null; }
		$v = explode( '||', (string) wp_unslash( $_COOKIE[ $k ] ) );
		return isset( $v[0] ) ? mb_substr( sanitize_text_field( $v[0] ), 0, 64 ) : null;
	}

	/** Kanalai — SKAITOM is `petshop-kanalai.php`, savo rinkimo nedarom. */
	public static function kanalai() {
		$out = array( 'saltinis' => null, 'medium' => null, 'kampanija' => null, 'referer_domenas' => null, 'kanalas' => null );
		if ( ! function_exists( 'WC' ) || ! WC()->session ) { return $out; }
		$k = WC()->session->get( self::SESIJA_K );
		if ( ! is_array( $k ) || empty( $k['paskutinis'] ) ) { return $out; }
		$p = $k['paskutinis'];
		$out['saltinis']        = isset( $p['utm_source'] ) ? mb_substr( $p['utm_source'], 0, 96 ) : null;
		$out['medium']          = isset( $p['utm_medium'] ) ? mb_substr( $p['utm_medium'], 0, 96 ) : null;
		$out['kampanija']       = isset( $p['utm_campaign'] ) ? mb_substr( $p['utm_campaign'], 0, 96 ) : null;
		$out['referer_domenas'] = isset( $p['referer_domenas'] ) ? mb_substr( $p['referer_domenas'], 0, 190 ) : null;
		$out['kanalas']         = isset( $p['kanalas'] ) ? mb_substr( $p['kanalas'], 0, 24 ) : null;
		return $out;
	}

	/**
	 * 🔴 v1.2: dataLayer `item_id` yra SKU, ne prekes ID.
	 *
	 * Snippet 614 i `ecommerce.items[].item_id` deda **SKU** (taip daro GA4
	 * standartas). Isaugojus ji i `raktas`, `ps_web_ivykiai` NIEKADA
	 * nesusijungtu su `ps_fakt_eilutes.preke_id` — ta pati klaidu seima kaip
	 * radinys #28 (sandeliu kodai), tik kitoje vietoje. Empiriskai matyta
	 * rune #5001: `view_item raktas = "Rink-baltos-jaučio-ausų…"`.
	 *
	 * Todel: `raktas` = **prekes ID** (skaicius), `raktas2` = SKU.
	 * Neisspresta -> `raktas` lieka NULL, o SKU vis tiek issaugomas `raktas2`
	 * — spraga matoma, duomuo neprarastas.
	 *
	 * @return array{0:string|null,1:string|null} [preke_id, sku]
	 */
	public static function preke_is_dl( $item_id ) {
		$v = trim( (string) $item_id );
		if ( '' === $v ) { return array( null, null ); }

		/* Jau ID? Tikrinam, kad tai tikrai preke, o ne atsitiktinis skaicius. */
		if ( ctype_digit( $v ) ) {
			$p = function_exists( 'wc_get_product' ) ? wc_get_product( (int) $v ) : null;
			if ( $p ) { return array( (string) (int) $v, $p->get_sku() ? $p->get_sku() : null ); }
		}
		if ( function_exists( 'wc_get_product_id_by_sku' ) ) {
			$id = (int) wc_get_product_id_by_sku( $v );
			if ( $id ) { return array( (string) $id, $v ); }
		}
		return array( null, $v );   /* SKU nezinomas — bet neprarandam */
	}

	/** Botai be JS atkrenta patys; sis sarasas — papildomas sluoksnis. */
	public static function botas( $ua ) {
		if ( '' === $ua ) { return true; }
		return (bool) preg_match( '/bot|crawl|spider|slurp|headless|phantom|curl|wget|python-requests|monitor|preview|scrape|lighthouse|pingdom|gtmetrix|semrush|ahrefs|facebookexternalhit/i', $ua );
	}

	public static function irenginys( $ua ) {
		if ( preg_match( '/iPad|Tablet|PlayBook|Silk/i', $ua ) ) { return 'tablet'; }
		if ( preg_match( '/Mobile|Android|iPhone|iPod|Windows Phone/i', $ua ) ) { return 'mobile'; }
		return 'desktop';
	}
	public static function os_seima( $ua ) {
		foreach ( array( 'Windows' => 'Windows', 'Android' => 'Android', 'iPhone|iPad|iPod' => 'iOS', 'Mac OS X' => 'macOS', 'Linux' => 'Linux' ) as $re => $v ) {
			if ( preg_match( '/' . $re . '/i', $ua ) ) { return $v; }
		}
		return null;
	}
	public static function nars_seima( $ua ) {
		/* Eiles tvarka svarbi: Edge ir Chrome UA turi „Chrome", Chrome turi „Safari". */
		foreach ( array( 'Edg' => 'Edge', 'OPR|Opera' => 'Opera', 'Chrome|CriOS' => 'Chrome', 'Firefox|FxiOS' => 'Firefox', 'Safari' => 'Safari' ) as $re => $v ) {
			if ( preg_match( '/' . $re . '/i', $ua ) ) { return $v; }
		}
		return null;
	}
	/** Salis is Accept-Language arba Cloudflare — NE geo-IP (planas §4A.1). */
	public static function salis() {
		if ( ! empty( $_SERVER['HTTP_CF_IPCOUNTRY'] ) ) {
			return mb_substr( strtoupper( sanitize_text_field( wp_unslash( $_SERVER['HTTP_CF_IPCOUNTRY'] ) ) ), 0, 8 );
		}
		if ( ! empty( $_SERVER['HTTP_ACCEPT_LANGUAGE'] ) ) {
			$a = (string) wp_unslash( $_SERVER['HTTP_ACCEPT_LANGUAGE'] );
			if ( preg_match( '/[a-z]{2}-([A-Z]{2})/', $a, $m ) ) { return $m[1]; }
		}
		return null;
	}

	/* ================================================================== */
	/* REST — atskiras namespace (Raimio sprendimas 4)                    */
	/* ================================================================== */

	public static function marsrutai() {
		register_rest_route( self::NS, self::KELIAS, array(
			'methods'             => 'POST',
			'callback'            => array( __CLASS__, 'gauti' ),
			'permission_callback' => '__return_true',   /* anoniminis beacon'as */
		) );
	}

	public static function gauti( $req ) {
		$ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? (string) wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) : '';
		if ( self::botas( $ua ) ) { return new WP_REST_Response( array( 'ok' => 0, 'kodas' => 'botas' ), 200 ); }

		/* 🔴 v1.1: `navigator.sendBeacon` siuncia `Content-Type: text/plain`
		   (taip isvengiama CORS preflight — su `application/json` narsykle
		   pries POST siustu OPTIONS, o dalis jo nesulauktu puslapio uzdarymo
		   metu). WordPress `get_json_params()` kuna parsina TIK kai tipas yra
		   `application/json`, todel be sio atsarginio kelio beacon'o duomenys
		   pasiekdavo serveri ir buvo TYLIAI ismetami: 7 POST'ai isejo, 0 eiluciu
		   irasyta (runas #5000).
		   Todel: pirma bandom standartini kelia, paskui — zalia kuna. */
		$body = $req->get_json_params();
		if ( ! is_array( $body ) || ! isset( $body['e'] ) ) {
			$zalias = $req->get_body();
			if ( is_string( $zalias ) && '' !== $zalias ) {
				$d = json_decode( $zalias, true );
				if ( is_array( $d ) ) { $body = $d; }
			}
		}
		$eil  = ( is_array( $body ) && isset( $body['e'] ) && is_array( $body['e'] ) ) ? $body['e'] : array();
		if ( ! $eil ) {
			return new WP_REST_Response( array(
				'ok' => 0, 'kodas' => 'tuscia',
				'ct' => isset( $_SERVER['CONTENT_TYPE'] ) ? mb_substr( sanitize_text_field( wp_unslash( $_SERVER['CONTENT_TYPE'] ) ), 0, 60 ) : '',
				'baitu' => strlen( (string) $req->get_body() ),
			), 200 );
		}
		if ( count( $eil ) > 40 ) { $eil = array_slice( $eil, 0, 40 ); }

		$bendra = array(
			'ua'        => $ua,
			'sesija'    => self::sesija(),
			'lank_d'    => self::lankytojas_d(),
			'sutikimas' => self::sutikimas() ? 1 : 0,
		);
		$bendra['lank_30'] = $bendra['sutikimas'] ? self::lankytojas_30() : null;

		$rez = array( 'priimta' => 0, 'atmesta' => 0 );
		foreach ( $eil as $e ) {
			if ( ! is_array( $e ) ) { continue; }
			$st = self::irasyti( $e, $bendra );
			$rez[ ( 'ok' === $st ) ? 'priimta' : 'atmesta' ]++;
		}
		return new WP_REST_Response( array( 'ok' => 1 ) + $rez, 200 );
	}

	/**
	 * 30 d. lankytojo raktas — TIK su sutikimu. Slapukas statomas is serverio
	 * REST atsakyme; be sutikimo jis neegzistuoja apskritai.
	 */
	public static function lankytojas_30() {
		if ( ! empty( $_COOKIE[ self::COOKIE30 ] ) ) {
			$v = preg_replace( '/[^a-f0-9]/', '', (string) wp_unslash( $_COOKIE[ self::COOKIE30 ] ) );
			if ( strlen( $v ) === 64 ) { return $v; }
		}
		$naujas = hash( 'sha256', wp_generate_password( 64, false, false ) . microtime( true ) );
		if ( ! headers_sent() ) {
			setcookie( self::COOKIE30, $naujas, array(
				'expires'  => time() + 30 * DAY_IN_SECONDS,
				'path'     => COOKIEPATH ? COOKIEPATH : '/',
				'domain'   => COOKIE_DOMAIN,
				'secure'   => is_ssl(),
				'httponly' => true,
				'samesite' => 'Lax',
			) );
			$_COOKIE[ self::COOKIE30 ] = $naujas;
		}
		return $naujas;
	}

	/* ================================================================== */
	/* RASYTOJAS                                                          */
	/* ================================================================== */

	/**
	 * @return string ok|draudziamas|nezinomas|klaida
	 */
	public static function irasyti( $e, $bendra ) {
		global $wpdb;
		self::uztikrinti_lenteles();

		$tipas = isset( $e['tipas'] ) ? sanitize_key( (string) $e['tipas'] ) : '';

		/* 🔴 TRECIAS atmetimo sluoksnis (JS + gavimas + cia). Skaitiklis auga,
		   kad bandymas nedingtu tyloje. */
		if ( in_array( $tipas, self::DRAUDZIAMI, true ) ) {
			update_option( self::OPT_ATMESTA, (int) get_option( self::OPT_ATMESTA, 0 ) + 1, false );
			return 'draudziamas';
		}
		if ( ! in_array( $tipas, self::SAVI, true ) && ! in_array( $tipas, self::IS_DATALAYER, true ) ) {
			return 'nezinomas';
		}

		$laikas = self::dabar();
		$ua     = $bendra['ua'];
		$k      = self::kanalai();

		/* dataLayer ivykiams `raktas` ateina kaip SKU — verciam i prekes ID. */
		$raktas  = isset( $e['raktas'] ) ? (string) $e['raktas'] : '';
		$raktas2 = isset( $e['raktas2'] ) ? (string) $e['raktas2'] : '';
		if ( in_array( $tipas, self::IS_DATALAYER, true ) && '' !== $raktas ) {
			list( $pid, $sku ) = self::preke_is_dl( $raktas );
			$raktas  = ( null === $pid ) ? '' : $pid;
			$raktas2 = ( null === $sku ) ? $raktas2 : $sku;
		}

		$eil = array(
			'laikas'           => $laikas,
			'diena'            => self::verslo_diena( $laikas ),
			'tipas'            => $tipas,
			'pusl_tipas'       => isset( $e['pusl'] ) ? mb_substr( sanitize_key( (string) $e['pusl'] ), 0, 24 ) : null,
			'url_kelias'       => isset( $e['url'] ) ? mb_substr( sanitize_text_field( (string) $e['url'] ), 0, 255 ) : null,
			'raktas'           => ( '' === $raktas ) ? null : mb_substr( sanitize_text_field( $raktas ), 0, 190 ),
			'raktas2'          => ( '' === $raktas2 ) ? null : mb_substr( sanitize_text_field( $raktas2 ), 0, 190 ),
			'reiksme'          => isset( $e['reiksme'] ) ? (int) $e['reiksme'] : null,
			'sesija'           => $bendra['sesija'],
			'lankytojas_d'     => $bendra['lank_d'],
			'lankytojas_30'    => $bendra['lank_30'],
			'saltinis'         => $k['saltinis'],
			'medium'           => $k['medium'],
			'kampanija'        => $k['kampanija'],
			'referer_domenas'  => $k['referer_domenas'],
			'kanalas'          => $k['kanalas'],
			'landing'          => ! empty( $e['landing'] ) ? 1 : 0,
			'irenginys'        => self::irenginys( $ua ),
			'os_seima'         => self::os_seima( $ua ),
			'nars_seima'       => self::nars_seima( $ua ),
			'salis'            => self::salis(),
			'prisijunges'      => is_user_logged_in() ? 1 : 0,
			'sutikimas'        => (int) $bendra['sutikimas'],
			'testinis'         => ( 'prod' === self::aplinka() ) ? 0 : 1,
			'saltinis_aplinka' => self::aplinka(),
		);

		$wpdb->suppress_errors( true );
		$ok = $wpdb->insert( self::t_ivykiai(), $eil );
		$wpdb->suppress_errors( false );
		return $ok ? 'ok' : 'klaida';
	}

	/* ================================================================== */
	/* BEACON (naršyklės pusė)                                            */
	/* ================================================================== */

	/** Puslapio rusis nustatoma SERVERYJE — jis tai zino tiksliai. */
	public static function puslapio_tipas() {
		if ( function_exists( 'is_order_received_page' ) && is_order_received_page() ) { return 'aciu'; }
		if ( is_404() )        { return '404'; }
		if ( is_search() )     { return 'paieska'; }
		if ( function_exists( 'is_cart' ) && is_cart() )         { return 'krepselis'; }
		if ( function_exists( 'is_checkout' ) && is_checkout() ) { return 'checkout'; }
		if ( function_exists( 'is_product' ) && is_product() )   { return 'preke'; }
		if ( function_exists( 'is_product_category' ) && is_product_category() ) { return 'kategorija'; }
		if ( function_exists( 'is_shop' ) && is_shop() )         { return 'parduotuve'; }
		if ( is_front_page() ) { return 'home'; }
		if ( is_singular( 'post' ) || is_home() ) { return 'blog'; }
		if ( is_page() )       { return 'info'; }
		return 'kita';
	}

	public static function beacon() {
		if ( is_admin() || is_feed() || is_robots() ) { return; }
		$ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? (string) wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) : '';
		if ( self::botas( $ua ) ) { return; }

		/* `?rest_route=` — firewall pamoka (T-0 Q-WPJSON). */
		$url  = home_url( '/?rest_route=/' . self::NS . self::KELIAS );
		$pusl = self::puslapio_tipas();

		$raktas = '';
		if ( 'preke' === $pusl )      { $raktas = (string) get_queried_object_id(); }
		if ( 'kategorija' === $pusl ) { $raktas = (string) get_queried_object_id(); }
		if ( 'paieska' === $pusl )    { $raktas = (string) get_search_query(); }

		$rez = 0;
		if ( 'paieska' === $pusl ) {
			global $wp_query;
			$rez = (int) $wp_query->found_posts;
		}

		/* Landing = pirmas puslapis sesijoje: nera vidinio referer'io. */
		$ref     = isset( $_SERVER['HTTP_REFERER'] ) ? (string) wp_unslash( $_SERVER['HTTP_REFERER'] ) : '';
		$savas   = (string) wp_parse_url( home_url(), PHP_URL_HOST );
		$rh      = $ref ? (string) wp_parse_url( $ref, PHP_URL_HOST ) : '';
		$landing = ( '' === $rh || $rh !== $savas ) ? 1 : 0;

		$leist = wp_json_encode( array_values( self::IS_DATALAYER ) );
		?>
<script id="ps-web-beacon">
(function(){
"use strict";
var U=<?php echo wp_json_encode( $url ); ?>,
    LEIST=<?php echo $leist; ?>,
    Q=[],T=null,ATC=0;

function siusti(){
  if(!Q.length)return;
  var d=JSON.stringify({e:Q});Q=[];
  try{
    if(navigator.sendBeacon){navigator.sendBeacon(U,new Blob([d],{type:'text/plain;charset=UTF-8'}));return;}
  }catch(e){}
  try{fetch(U,{method:'POST',body:d,headers:{'Content-Type':'application/json'},keepalive:true,credentials:'same-origin'});}catch(e){}
}
function push(o){
  /* 🔴 purchase NIEKADA neiseina is narsykles — pirmas is triju sluoksniu. */
  if(!o||!o.tipas||o.tipas==='purchase'||o.tipas==='refund')return;
  Q.push(o);
  if(T)clearTimeout(T);
  T=setTimeout(siusti,900);
}
window.psWeb=push;

/* 1) pageview — puslapio rusis atejo is serverio */
push({tipas:'pageview',pusl:<?php echo wp_json_encode( $pusl ); ?>,
      url:location.pathname+location.search,
      raktas:<?php echo wp_json_encode( $raktas ); ?>,
      reiksme:<?php echo (int) $rez; ?>,
      landing:<?php echo (int) $landing; ?>});

<?php if ( 'paieska' === $pusl ) : ?>
/* 2) paieska — atskirai, kad „0 rezultatu" butu matomas pjuvis */
push({tipas:'search',raktas:<?php echo wp_json_encode( $raktas ); ?>,reiksme:<?php echo (int) $rez; ?>});
<?php endif; ?>
<?php if ( '404' === $pusl ) : ?>
push({tipas:'error404',url:location.pathname+location.search});
<?php endif; ?>

/* 3) dataLayer — klausomes esamo (snippet 614), nieko nedubliuojam */
try{
  var dl=window.dataLayer=window.dataLayer||[];
  function imk(a){
    if(!a||!a.event)return;
    if(LEIST.indexOf(a.event)<0)return;   /* purchase cia neipuola */
    var iid='';
    try{
      var it=a.ecommerce&&a.ecommerce.items&&a.ecommerce.items[0];
      if(it){iid=String(it.item_id||it.id||'');}
    }catch(e){}
    /* iid gali buti SKU — serveris ji isvers i prekes ID (v1.2). */
    push({tipas:a.event,raktas:iid,url:location.pathname});
  }
  for(var i=0;i<dl.length;i++)imk(dl[i]);   /* kas jau buvo push'inta iki musu */
  var orig=dl.push.bind(dl);
  dl.push=function(){
    try{for(var i=0;i<arguments.length;i++)imk(arguments[i]);}catch(e){}
    return orig.apply(null,arguments);
  };
}catch(e){}

/* 4) filtrai — YITH keicia URL be perkrovimo */
try{
  window.addEventListener('popstate',function(){
    var p=new URLSearchParams(location.search);
    p.forEach(function(v,k){if(k.indexOf('filter_')===0)push({tipas:'filter',raktas:k.replace('filter_',''),raktas2:v});});
  });
}catch(e){}

/* 5) issiuntimas paliekant puslapi */
window.addEventListener('pagehide',siusti);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')siusti();});
})();
</script>
		<?php
	}

	/* ================================================================== */
	/* AGREGAVIMAS                                                        */
	/* ================================================================== */

	public static function agreguoti_vakar() {
		$d = gmdate( 'Y-m-d', strtotime( wp_date( 'Y-m-d' ) . ' -1 day' ) );
		return self::agreguoti_diena( $d );
	}

	/**
	 * Idempotentiskas: dienos eilutes pirma TRINAMOS, tada rasomos is naujo
	 * (tas pats principas kaip `petshop-ataskaitu-agregavimas.php`).
	 */
	public static function agreguoti_diena( $diena ) {
		global $wpdb;
		self::uztikrinti_lenteles();
		if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', (string) $diena ) ) { return array( 'klaida' => 'bloga data' ); }
		$i = self::t_ivykiai();
		$d = self::t_dienos();
		$a = self::aplinka();

		$wpdb->query( $wpdb->prepare( "DELETE FROM $d WHERE data=%s AND aplinka=%s", $diena, $a ) );

		$pjuviai = array(
			'saltinis'   => 'COALESCE(saltinis, \'(none)\')',
			'kampanija'  => 'COALESCE(kampanija, \'(none)\')',
			'kanalas'    => 'COALESCE(kanalas, \'direct\')',
			'puslapis'   => 'COALESCE(url_kelias, \'\')',
			'tipas'      => 'COALESCE(pusl_tipas, \'\')',
			'irenginys'  => 'COALESCE(irenginys, \'\')',
			'salis'      => 'COALESCE(salis, \'\')',
			'paieska'    => 'COALESCE(raktas, \'\')',
		);

		$viso = 0;
		foreach ( $pjuviai as $pjuvis => $laukas ) {
			$kur = ( 'paieska' === $pjuvis ) ? "AND tipas='search'" : '';
			$eil = $wpdb->get_results( $wpdb->prepare(
				"SELECT $laukas AS r,
				        COUNT(DISTINCT sesija) apsilankymai,
				        COUNT(DISTINCT lankytojas_d) lankytojai,
				        SUM(CASE WHEN tipas='pageview' THEN 1 ELSE 0 END) perziuros,
				        SUM(CASE WHEN tipas='view_item' THEN 1 ELSE 0 END) vi,
				        SUM(CASE WHEN tipas='add_to_cart' THEN 1 ELSE 0 END) atc,
				        SUM(CASE WHEN tipas='begin_checkout' THEN 1 ELSE 0 END) bc,
				        AVG(sutikimas)*100 sut
				 FROM $i WHERE diena=%s AND saltinis_aplinka=%s $kur
				 GROUP BY r", $diena, $a ), ARRAY_A );

			foreach ( (array) $eil as $r ) {
				$wpdb->insert( $d, array(
					'data' => $diena, 'pjuvis' => $pjuvis,
					'raktas' => mb_substr( (string) $r['r'], 0, 190 ), 'raktas2' => '',
					'apsilankymai' => (int) $r['apsilankymai'],
					'lankytojai'   => (int) $r['lankytojai'],
					'perziuros'    => (int) $r['perziuros'],
					'view_item'    => (int) $r['vi'],
					'add_to_cart'  => (int) $r['atc'],
					'begin_checkout' => (int) $r['bc'],
					'sutikusiu_dalis' => round( (float) $r['sut'], 2 ),
					'aplinka' => $a,
				) );
				$viso++;
			}
		}
		update_option( 'ps_web_paskutinis_agregavimas', self::dabar() . ' | ' . $diena . ' | ' . $viso, false );
		return array( 'diena' => $diena, 'eiluciu' => $viso );
	}

	/* ================================================================== */
	/* VALYMAS (Raimio sprendimas 5)                                      */
	/* ================================================================== */

	/**
	 * ZALI ivykiai — 90 d. per ESAMA nustatyma `ps_stat_zaliu_dienos`;
	 * savo mechanizmo nekuriam.
	 *
	 * 🔴 `ps_web_dienos` AGREGATAS — AMZINAS. Sis metodas ji liecia TIK per
	 * `assert`-tipo patikra: jei kada nors kas nors i ji istaisys `DELETE`,
	 * DoD testas parodys. Planas §3 taisykle 9: valymas neliecia agregatu.
	 */
	public static function valyti( $dry = false ) {
		global $wpdb;
		self::uztikrinti_lenteles();
		$i  = self::t_ivykiai();
		$d  = self::t_dienos();
		$dn = (int) get_option( self::OPT_ZALIU_D, 90 );
		if ( $dn < 30 ) { $dn = 90; }   /* sargas nuo netycinio nulio */

		$riba = gmdate( 'Y-m-d', time() - $dn * DAY_IN_SECONDS );
		$kiek = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $i WHERE diena < %s", $riba ) );
		$agr_pries = (int) $wpdb->get_var( "SELECT COUNT(*) FROM $d" );

		if ( ! $dry && $kiek > 0 ) {
			$wpdb->query( $wpdb->prepare( "DELETE FROM $i WHERE diena < %s", $riba ) );
		}
		$agr_po = (int) $wpdb->get_var( "SELECT COUNT(*) FROM $d" );

		return array(
			'dry' => (bool) $dry, 'dienu' => $dn, 'riba' => $riba,
			'zaliu_istrinta' => $dry ? 0 : $kiek, 'zaliu_butu' => $kiek,
			'agregato_pries' => $agr_pries, 'agregato_po' => $agr_po,
			'agregatas_nepaliestas' => ( $agr_pries === $agr_po ),
		);
	}

	/* ================================================================== */
	/* KONTROLE (DoD)                                                     */
	/* ================================================================== */

	public static function kontrole( $diena = null ) {
		global $wpdb;
		$i = self::t_ivykiai();
		$diena = $diena ? $diena : wp_date( 'Y-m-d' );
		return array(
			'versija'          => self::VERSIJA,
			'endpoint'         => home_url( '/?rest_route=/' . self::NS . self::KELIAS ),
			'atmesta_purchase' => (int) get_option( self::OPT_ATMESTA, 0 ),
			'purchase_lenteleje' => (int) $wpdb->get_var( "SELECT COUNT(*) FROM $i WHERE tipas IN ('purchase','refund')" ),
			'ivykiu_viso'      => (int) $wpdb->get_var( "SELECT COUNT(*) FROM $i" ),
			'pagal_tipa'       => $wpdb->get_results( $wpdb->prepare( "SELECT tipas, COUNT(*) n FROM $i WHERE diena=%s GROUP BY tipas ORDER BY n DESC", $diena ), ARRAY_A ),
			'pagal_pusl'       => $wpdb->get_results( $wpdb->prepare( "SELECT pusl_tipas, COUNT(*) n FROM $i WHERE diena=%s AND tipas='pageview' GROUP BY pusl_tipas ORDER BY n DESC", $diena ), ARRAY_A ),
			'aciu_perziuros'   => (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $i WHERE diena=%s AND tipas='pageview' AND pusl_tipas='aciu'", $diena ) ),
		);
	}
}

Petshop_Analitika::init();
