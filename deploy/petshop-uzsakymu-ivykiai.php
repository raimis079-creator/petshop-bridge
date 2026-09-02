<?php
/**
 * Petshop Užsakymų įvykiai v1.1 (S1606) — zmogui(): būsenos įrašui be dvigubo žodžio; wp_die pastaba su „wp_die:“.
 *
 * Petshop Užsakymų įvykiai v1.0 (S1606, spec §6 / §4.6) — UŽSAKYMŲ ŽURNALAS.
 *
 * KODĖL: naujam darbalaukiui (spec v1.1) reikia vieno tiesos šaltinio „kas, ką, kada
 * padarė su užsakymu, kas buvo prieš ir po“. Iki šiol tai buvo išbarstyta po WC
 * pastabas (add_order_note), transientus ir pašto archyvą. Žurnalas — pagrindas
 * automatikai 6.2 (Venipak sekimas), 6.8 (vėlavimo sargas), SLA ataskaitai ir
 * takeliui eilutėje.
 *
 * KODĖL NE `petshop-ivykiai.php` / `ps_ivykiai` (spec §10.1 vardas): toks failas ir
 * lentelė JAU YRA — prekių auditas (product_id, tipas, laukas, sena, nauja; 5 450
 * įrašų 2026-09-03). Neliečiama. Šis modulis — atskira lentelė `ps_uzsakymu_ivykiai`.
 *
 * KAIP VEIKIA (variklis A–J NEKEIČIAMAS — registras):
 *  1. Esami veiksmai gaudomi iš išorės: `admin_post_ps_desk_veiksmas`,
 *     `ps_dropship_*`, `ps_tiekimas*`, `ps_siuntu_siusti` — mūsų kablys prioritetu 1
 *     nufotografuoja užsakymus PRIEŠ, o `wp_redirect` filtras (kur variklis baigia
 *     su pd_ok/pd_nr/msg) — PO ir rezultatą. PDF atsakymai (lipdukai, manifestas)
 *     ir wp_die — per shutdown / wp_die_handler.
 *  2. WC būsenos keitimai (`woocommerce_order_status_changed`) ir apmokėjimas
 *     (`woocommerce_payment_complete` prior. 99, kad AV_Order::fiksuoti jau būtų
 *     priskyręs šaltinius) rašomi visada — ir kai keičia Paysera/cron (kanalas auto).
 *  3. Laiškai, išsiųsti veiksmo metu (wp_mail), įrašomi į `po.laiskai`.
 *  4. Vieša API kitiems moduliams (darbalaukis, sekimas, sargai):
 *       Petshop_Uzsakymu_Ivykiai::irasyti( array $a )   → id
 *       ::uzsakymo( $order_id, $limit )                  → eilutės DESC
 *       ::paskutinis( $order_id, $veiksmas = '' )
 *       ::zmogui( $row )                                 → sakinys lietuviškai
 *       ::html( $order_id )                              → blokas skydeliui
 *     Laukai: uzsakymas, eilute, sritis, veiksmas, rezultatas (ok|klaida|praleista|
 *     nezinoma), busena (''|siulyta|priimta|atmesta), kanalas (web|auto|cron|api),
 *     kas, kas_vardas, pries, po (masyvai → JSON), pastaba.
 *  5. Langas „Žurnalas“ (admin.php?page=ps-ivykiai): paskutiniai įrašai, filtrai
 *     užsakymas / sritis / veiksmas. Skydelio blokas — html().
 *
 * DUOMENYS: laikas UTC (gmdate), `diena` — Vilniaus verslo data (wp_date), kaip
 * faktų lentelėse. Nieko netrinama.
 *
 * @package Petshop
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Uzsakymu_Ivykiai {

	const VERSIJA = '1.1';
	const DB_VER  = '1.0';
	const OPT_DB  = 'ps_uzs_ivykiai_db';
	const SLUG    = 'ps-ivykiai';

	/** Aktyvus gaudymas (vienas per užklausą). */
	protected static $g = null;
	protected static $laiskai = array();

	/** Kaip WP veiksmai virsta žodynu (spec §2): action → [sritis, veiksmo raktas]. */
	const VEIKSMAI = array(
		'ps_desk_veiksmas'     => array( 'desk', '' ),        // veiksmas iš ?v=
		'ps_dropship_send'     => array( 'dropship', 'laiskas' ),
		'ps_dropship_zb_done'  => array( 'dropship', 'perduota_zb' ),
		'ps_dropship_visi'     => array( 'dropship', 'perduoti_visus' ),
		'ps_dropship_lipdukas' => array( 'dropship', 'lipdukas_pdf' ),
		'ps_tiekimas'          => array( 'tiekimas', '' ),    // veiksmas iš POST ka=
		'ps_tiekimas_eilute'   => array( 'tiekimas', '' ),    // veiksmas iš ?ka=
		'ps_tiekimas_lipdukas' => array( 'tiekimas', 'lipdukas_pdf' ),
		'ps_siuntu_siusti'     => array( 'siuntos', 'sekimo_laiskas' ),
	);

	/** Žodynas žmogui (spec §2): veiksmo raktas → tekstas. */
	const ZODYNAS = array(
		'misrus'          => 'Surūšiuota (mišraus planas)',
		'misrus_keisti'   => 'Rūšiavimas atidarytas iš naujo',
		'kons'            => 'Užsakyti iš tiekėjo į Avesą (konsolidacija)',
		'lapai'           => 'Surinkti (surinkimo lapas)',
		'vp_reg'          => 'Lipdukas (Venipak registracija)',
		'vp_bulk'         => 'Lipdukai (Venipak masinė registracija)',
		'vp_manifestas'   => 'Manifestas PDF',
		'perduoti'        => 'Perduoti tiekėjams (į laiškų langą)',
		'laiskas'         => 'Laiškas tiekėjui išsiųstas',
		'perduota_zb'     => 'Suvesta į ZB / Perduota',
		'perduoti_visus'  => 'Perduoti visus tiekėjams',
		'lipdukas_pdf'    => 'Lipdukas atsisiųstas',
		'issiusta'        => 'Išsiųsta',
		'klaus'           => 'Klausimo sprendimas',
		'atsaukti'        => 'Atšaukta',
		'apmoketa'        => 'Pažymėta apmokėtu',
		'pakuotes'        => 'Dėžių skaičius',
		'kg'              => 'Svoris',
		'av'              => 'Kelias: Avesa sandėlis',
		'sava'            => 'Kelias: Avesa sandėlis',
		'dropship'        => 'Kelias: tiekėjas → klientui',
		'istrinti'        => 'Ištrinta',
		'issaugoti'       => 'Partija išsaugota',
		'pridėti'         => 'Į partiją pridėta',
		'prideti'         => 'Į partiją pridėta',
		'uzsakyti'        => 'Užsakyta iš tiekėjo (partija)',
		'priimti'         => 'Gauta (partija priimta)',
		'likuciai'        => 'Partijos likučiai',
		'ideti'           => 'Eilutė į partiją',
		'sekimo_laiskas'  => 'Sekimo laiškas klientui',
		'busena'          => 'Būsena',
		'apmokejimas'     => 'Apmokėta',
	);

	public static function init() {
		add_action( 'plugins_loaded', array( __CLASS__, 'lentele' ), 20 );
		add_action( 'admin_menu', array( __CLASS__, 'meniu' ), 30 );

		foreach ( array_keys( self::VEIKSMAI ) as $a ) {
			add_action( 'admin_post_' . $a, array( __CLASS__, 'pradzia' ), 1 );
		}
		add_filter( 'wp_redirect', array( __CLASS__, 'peradresavimas' ), 1, 2 );
		add_filter( 'wp_mail', array( __CLASS__, 'laiskas' ), 999 );
		add_filter( 'wp_die_handler', array( __CLASS__, 'die_handleris' ), 999 );
		add_action( 'shutdown', array( __CLASS__, 'pabaiga_shutdown' ), 1 );

		add_action( 'woocommerce_order_status_changed', array( __CLASS__, 'busena' ), 99, 4 );
		add_action( 'woocommerce_payment_complete', array( __CLASS__, 'apmokejimas' ), 99, 1 );
	}

	/* ============================ LENTELĖ ============================ */

	public static function t() { global $wpdb; return $wpdb->prefix . 'ps_uzsakymu_ivykiai'; }

	public static function lentele() {
		if ( get_option( self::OPT_DB ) === self::DB_VER ) { return; }
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		$c = $wpdb->get_charset_collate();
		dbDelta( 'CREATE TABLE ' . self::t() . " (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			laikas datetime NOT NULL,
			diena date NOT NULL,
			uzsakymas bigint(20) unsigned NOT NULL DEFAULT 0,
			eilute bigint(20) unsigned NOT NULL DEFAULT 0,
			sritis varchar(20) NOT NULL DEFAULT '',
			veiksmas varchar(48) NOT NULL DEFAULT '',
			rezultatas varchar(16) NOT NULL DEFAULT '',
			busena varchar(12) NOT NULL DEFAULT '',
			kanalas varchar(10) NOT NULL DEFAULT 'web',
			kas bigint(20) unsigned NOT NULL DEFAULT 0,
			kas_vardas varchar(80) NOT NULL DEFAULT '',
			pries longtext NULL,
			po longtext NULL,
			pastaba text NULL,
			PRIMARY KEY  (id),
			KEY uzs_laikas (uzsakymas,laikas),
			KEY laikas (laikas),
			KEY sritis_veiksmas (sritis,veiksmas),
			KEY diena (diena)
		) $c;" );
		update_option( self::OPT_DB, self::DB_VER, false );
	}

	/* ============================ VIEŠA API ============================ */

	/**
	 * Įrašyti įvykį. Privaloma: uzsakymas (arba 0 — sisteminis), sritis, veiksmas.
	 * pries/po — masyvai (JSON) arba tekstas.
	 */
	public static function irasyti( array $a ) {
		global $wpdb;
		$u   = wp_get_current_user();
		$row = array(
			'laikas'     => gmdate( 'Y-m-d H:i:s' ),
			'diena'      => wp_date( 'Y-m-d' ),
			'uzsakymas'  => (int) ( $a['uzsakymas'] ?? 0 ),
			'eilute'     => (int) ( $a['eilute'] ?? 0 ),
			'sritis'     => substr( sanitize_key( $a['sritis'] ?? '' ), 0, 20 ),
			'veiksmas'   => mb_substr( (string) ( $a['veiksmas'] ?? '' ), 0, 48 ),
			'rezultatas' => substr( sanitize_key( $a['rezultatas'] ?? 'ok' ), 0, 16 ),
			'busena'     => substr( sanitize_key( $a['busena'] ?? '' ), 0, 12 ),
			'kanalas'    => substr( sanitize_key( $a['kanalas'] ?? ( ( defined( 'DOING_CRON' ) && DOING_CRON ) ? 'cron' : ( $u->ID ? 'web' : 'auto' ) ) ), 0, 10 ),
			'kas'        => isset( $a['kas'] ) ? (int) $a['kas'] : (int) $u->ID,
			'kas_vardas' => mb_substr( (string) ( $a['kas_vardas'] ?? ( $u->ID ? $u->display_name : 'sistema' ) ), 0, 80 ),
			'pries'      => self::json( $a['pries'] ?? null ),
			'po'         => self::json( $a['po'] ?? null ),
			'pastaba'    => isset( $a['pastaba'] ) ? mb_substr( (string) $a['pastaba'], 0, 4000 ) : null,
		);
		$wpdb->insert( self::t(), $row );
		$id = (int) $wpdb->insert_id;
		do_action( 'ps_uzs_ivykis', $id, $row );
		return $id;
	}

	protected static function json( $v ) {
		if ( null === $v || '' === $v ) { return null; }
		if ( is_string( $v ) ) { return $v; }
		return wp_json_encode( $v, JSON_UNESCAPED_UNICODE | JSON_PARTIAL_OUTPUT_ON_ERROR );
	}

	public static function uzsakymo( $order_id, $limit = 200 ) {
		global $wpdb;
		return $wpdb->get_results( $wpdb->prepare(
			'SELECT * FROM ' . self::t() . ' WHERE uzsakymas=%d ORDER BY id DESC LIMIT %d', (int) $order_id, (int) $limit ), ARRAY_A );
	}

	public static function paskutinis( $order_id, $veiksmas = '' ) {
		global $wpdb;
		if ( $veiksmas ) {
			return $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . self::t() . ' WHERE uzsakymas=%d AND veiksmas=%s ORDER BY id DESC LIMIT 1', (int) $order_id, $veiksmas ), ARRAY_A );
		}
		return $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . self::t() . ' WHERE uzsakymas=%d ORDER BY id DESC LIMIT 1', (int) $order_id ), ARRAY_A );
	}

	/** Vienas sakinys žmogui: „10:12 Testuotojas — Dėžių skaičius: 1 → 2“. */
	public static function zmogui( $row ) {
		$v   = $row['veiksmas'];
		$txt = self::ZODYNAS[ $v ] ?? ucfirst( str_replace( '_', ' ', $v ) );
		$ps  = self::skirtumas( $row );
		if ( 'busena' === $v && $ps ) { $txt = ucfirst( $ps ); $ps = ''; }
		$rez = '';
		if ( 'klaida' === $row['rezultatas'] )    { $rez = ' ✗'; }
		elseif ( 'praleista' === $row['rezultatas'] ) { $rez = ' (praleista)'; }
		elseif ( 'nezinoma' === $row['rezultatas'] )  { $rez = ' (?)'; }
		$kas = 'web' === $row['kanalas'] ? $row['kas_vardas'] : 'auto';
		$b   = $row['busena'] ? ' [' . $row['busena'] . ']' : '';
		return wp_date( 'm-d H:i', strtotime( $row['laikas'] . ' UTC' ) ) . ' · ' . $kas . ' — ' . $txt . $rez . $b . ( $ps ? ': ' . $ps : '' ) . ( $row['pastaba'] ? ' · ' . $row['pastaba'] : '' );
	}

	/** Trumpas prieš→po skirtumas (būsena, siuntos, šaltiniai, dėžės). */
	public static function skirtumas( $row ) {
		$a = json_decode( (string) $row['pries'], true ); $b = json_decode( (string) $row['po'], true );
		if ( ! is_array( $a ) || ! is_array( $b ) ) { return ''; }
		$d = array();
		foreach ( array( 'status' => 'būsena', 'pak' => 'dėžės', 'tipas' => 'tipas', 'dropship_sent' => 'perduota', 'konsolidacija' => 'į Avesą' ) as $k => $t ) {
			$x = $a[ $k ] ?? null; $y = $b[ $k ] ?? null;
			if ( $x !== $y ) { $d[] = $t . ' ' . self::v( $x ) . ' → ' . self::v( $y ); }
		}
		if ( ( $a['siuntos'] ?? array() ) !== ( $b['siuntos'] ?? array() ) ) {
			$n = array_diff( self::plokscias( $b['siuntos'] ?? array() ), self::plokscias( $a['siuntos'] ?? array() ) );
			$d[] = $n ? 'siuntos +' . implode( ',', $n ) : 'siuntos pakeistos';
		}
		foreach ( (array) ( $b['eil'] ?? array() ) as $iid => $e ) {
			$o = $a['eil'][ $iid ] ?? array();
			if ( ( $o['src'] ?? '' ) !== ( $e['src'] ?? '' ) ) { $d[] = '#' . $iid . ' kelias ' . self::v( $o['src'] ?? '' ) . ' → ' . self::v( $e['src'] ?? '' ); }
			if ( ( $o['av_q'] ?? null ) !== ( $e['av_q'] ?? null ) ) { $d[] = 'prekė ' . ( $e['pid'] ?? '?' ) . ' AV ' . self::v( $o['av_q'] ?? null ) . ' → ' . self::v( $e['av_q'] ?? null ); }
		}
		if ( ! empty( $b['laiskai'] ) ) { $d[] = 'laiškai: ' . implode( '; ', array_map( function ( $l ) { return $l['kam'] . ' „' . $l['tema'] . '“'; }, (array) $b['laiskai'] ) ); }
		if ( ! empty( $b['zinute'] ) ) { $d[] = $b['zinute']; }
		return implode( ' · ', $d );
	}

	protected static function v( $x ) { if ( null === $x || '' === $x ) { return '—'; } return is_scalar( $x ) ? (string) $x : wp_json_encode( $x, JSON_UNESCAPED_UNICODE ); }
	protected static function plokscias( $s ) { $r = array(); foreach ( (array) $s as $k => $v ) { if ( is_array( $v ) ) { foreach ( $v as $x ) { if ( is_scalar( $x ) ) { $r[] = (string) $x; } } } elseif ( is_scalar( $v ) ) { $r[] = (string) $v; } } return $r; }

	/** Blokas skydeliui: paskutiniai 30 užsakymo įvykių. */
	public static function html( $order_id, $limit = 30 ) {
		$rows = self::uzsakymo( $order_id, $limit );
		if ( ! $rows ) { return '<div class="psuz-zurnalas psuz-tuscia">Žurnale įrašų dar nėra.</div>'; }
		$h = '<div class="psuz-zurnalas"><ol>';
		foreach ( $rows as $r ) {
			$h .= '<li class="psuz-' . esc_attr( $r['rezultatas'] ) . ' psuz-k-' . esc_attr( $r['kanalas'] ) . '">' . esc_html( self::zmogui( $r ) ) . '</li>';
		}
		return $h . '</ol></div>';
	}

	/* ============================ GAUDYMAS ============================ */

	/** Prieš variklio veiksmą (prior. 1): kas, ką, kuriuos užsakymus. */
	public static function pradzia() {
		$action = current_action();
		$a = substr( $action, strlen( 'admin_post_' ) );
		if ( ! isset( self::VEIKSMAI[ $a ] ) ) { return; }
		list( $sritis, $veiksmas ) = self::VEIKSMAI[ $a ];
		$G = wp_unslash( $_GET ); $P = wp_unslash( $_POST );
		$ids = array();
		$param = array();

		if ( 'ps_desk_veiksmas' === $a ) {
			$veiksmas = sanitize_key( $G['v'] ?? '' );
			if ( ! empty( $G['id'] ) ) { $ids[] = absint( $G['id'] ); }
			if ( ! empty( $G['ids'] ) ) { $ids = array_merge( $ids, array_map( 'absint', explode( ',', sanitize_text_field( $G['ids'] ) ) ) ); }
			foreach ( array( 'sandelis', 'n', 'kg', 'perreg', 'src', 's', 'sprendimas', 'kelias', 'laukti' ) as $k ) { if ( isset( $G[ $k ] ) ) { $param[ $k ] = is_array( $G[ $k ] ) ? array_map( 'sanitize_text_field', $G[ $k ] ) : sanitize_text_field( $G[ $k ] ); } }
		} elseif ( 'ps_dropship_send' === $a || 'ps_dropship_visi' === $a ) {
			$ids = array_map( 'absint', array_filter( explode( ',', (string) ( $P['uzsakymai'] ?? $G['uzsakymai'] ?? '' ) ) ) );
			$param['tiekejas'] = sanitize_key( $P['tiekejas'] ?? $G['tiekejas'] ?? '' );
			foreach ( array( 'kam', 'kopija', 'pastaba', 'partija', 'be_lipduku' ) as $k ) { if ( isset( $P[ $k ] ) ) { $param[ $k ] = is_array( $P[ $k ] ) ? implode( ',', array_map( 'sanitize_text_field', $P[ $k ] ) ) : mb_substr( sanitize_text_field( $P[ $k ] ), 0, 200 ); } }
		} elseif ( 'ps_dropship_zb_done' === $a ) {
			$ids = array_map( 'absint', array_filter( explode( ',', (string) ( $P['uzsakymai'] ?? $P['ids'] ?? $G['ids'] ?? '' ) ) ) );
			if ( ! $ids && ! empty( $P['id'] ) ) { $ids[] = absint( $P['id'] ); }
			$param['tiekejas'] = 'zb';
		} elseif ( 'ps_dropship_lipdukas' === $a ) {
			if ( ! empty( $G['id'] ) ) { $ids[] = absint( $G['id'] ); }
			if ( ! empty( $G['ids'] ) ) { $ids = array_merge( $ids, array_map( 'absint', explode( ',', (string) $G['ids'] ) ) ); }
		} elseif ( 'ps_tiekimas' === $a ) {
			$veiksmas = sanitize_key( str_replace( 'ė', 'e', (string) ( $P['ka'] ?? '' ) ) );
			$pid = absint( $P['partija'] ?? 0 ); $param['partija'] = $pid;
			$ids = self::partijos_uzsakymai( $pid );
			foreach ( array( 'pristatymas', 'svoris', 'pastomatas' ) as $k ) { if ( isset( $P[ $k ] ) ) { $param[ $k ] = sanitize_text_field( $P[ $k ] ); } }
			if ( isset( $P['gauta'] ) && is_array( $P['gauta'] ) ) { $param['gauta'] = array_map( 'intval', $P['gauta'] ); }
			if ( isset( $P['qty'] ) && is_array( $P['qty'] ) ) { $param['qty'] = array_map( 'intval', $P['qty'] ); }
		} elseif ( 'ps_tiekimas_eilute' === $a ) {
			$veiksmas = sanitize_key( $G['ka'] ?? 'ideti' );
			if ( ! empty( $G['oid'] ) ) { $ids[] = absint( $G['oid'] ); }
			$param['iid'] = absint( $G['iid'] ?? 0 );
		} elseif ( 'ps_tiekimas_lipdukas' === $a ) {
			$param['partija'] = absint( $G['partija'] ?? $G['id'] ?? 0 );
			$ids = self::partijos_uzsakymai( $param['partija'] );
		} elseif ( 'ps_siuntu_siusti' === $a ) {
			if ( ! empty( $G['id'] ) ) { $ids[] = absint( $G['id'] ); }
			if ( ! empty( $P['id'] ) ) { $ids[] = absint( $P['id'] ); }
		}

		$ids = array_values( array_unique( array_filter( $ids ) ) );
		self::$laiskai = array();
		self::$g = array(
			'action'   => $a,
			'sritis'   => $sritis,
			'veiksmas' => $veiksmas ?: $a,
			'ids'      => $ids,
			'param'    => $param,
			'pries'    => array(),
			'baigta'   => false,
			't0'       => microtime( true ),
		);
		foreach ( $ids as $oid ) { self::$g['pries'][ $oid ] = self::snap( $oid ); }
	}

	protected static function partijos_uzsakymai( $pid ) {
		if ( ! $pid ) { return array(); }
		global $wpdb;
		$t = $wpdb->prefix . 'ps_tiekimas_eil';
		if ( ! $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) ) { return array(); }
		return array_map( 'intval', (array) $wpdb->get_col( $wpdb->prepare( "SELECT DISTINCT order_id FROM $t WHERE partija_id=%d AND order_id>0", $pid ) ) );
	}

	/** Užsakymo nuotrauka: būsena, eilutės su keliais ir AV likučiais, siuntos, žymės. */
	public static function snap( $oid ) {
		$o = wc_get_order( $oid );
		if ( ! $o ) { return array( 'nera' => true ); }
		$s = array(
			'status'        => $o->get_status(),
			'tipas'         => (string) $o->get_meta( '_ps_order_type' ),
			'pak'           => (int) $o->get_meta( '_ps_pakuociu' ),
			'siuntos'       => $o->get_meta( '_ps_siuntos' ) ?: array(),
			'vp'            => mb_substr( (string) $o->get_meta( 'venipak_shipping_order_data' ), 0, 120 ),
			'misrus'        => $o->get_meta( '_ps_misrus_sprendimas' ) ?: null,
			'konsolidacija' => $o->get_meta( '_ps_konsolidacija' ) ?: null,
			'dropship_sent' => $o->get_meta( '_ps_dropship_sent_src' ) ?: null,
			'av_reduced'    => (string) $o->get_meta( '_ps_av_reduced' ),
			'eil'           => array(),
		);
		foreach ( $o->get_items( 'line_item' ) as $iid => $it ) {
			$pid = $it->get_variation_id() ?: $it->get_product_id();
			$s['eil'][ $iid ] = array(
				'pid'   => $pid,
				'q'     => (int) $it->get_quantity(),
				'src'   => (string) $it->get_meta( '_ps_source' ),
				'car'   => (string) $it->get_meta( '_ps_carrier' ),
				'red'   => (string) $it->get_meta( '_ps_av_reduced_qty' ),
				'av_q'  => $pid ? get_post_meta( $pid, '_own_stock_qty', true ) : null,
				'stock' => $pid ? get_post_meta( $pid, '_stock', true ) : null,
			);
		}
		return $s;
	}

	/** Variklis baigė peradresavimu: iš URL paimam rezultatą, nufotografuojam PO. */
	public static function peradresavimas( $location, $status ) {
		if ( self::$g && ! self::$g['baigta'] ) {
			$q = array();
			parse_str( (string) parse_url( $location, PHP_URL_QUERY ), $q );
			$rez = array();
			foreach ( array( 'pd_ok', 'pd_nr', 'msg', 'ok', 'klaida', 'psl_sent', 'psl_src', 'ps_ok', 'ps_ready', 'page', 'b', 'eile' ) as $k ) { if ( isset( $q[ $k ] ) ) { $rez[ $k ] = mb_substr( sanitize_text_field( rawurldecode( (string) $q[ $k ] ) ), 0, 300 ); } }
			$kodas = 'ok';
			$pd = (string) ( $rez['pd_ok'] ?? '' );
			if ( isset( $rez['klaida'] ) || false !== strpos( $pd, 'klaida' ) || 'nezinomas' === $pd ) { $kodas = 'klaida'; }
			elseif ( false !== strpos( $pd, 'nieko' ) || false !== strpos( (string) ( $rez['pd_nr'] ?? '' ), 'praleist' ) ) { $kodas = 'praleista'; }
			$zin = trim( ( $rez['pd_ok'] ?? $rez['msg'] ?? $rez['klaida'] ?? ( isset( $rez['psl_sent'] ) ? 'išsiųsta ' . $rez['psl_sent'] : '' ) ) . ( isset( $rez['pd_nr'] ) ? ' ' . $rez['pd_nr'] : '' ) );
			self::pabaiga( $kodas, $zin, array( 'redirect' => $rez ) );
		}
		return $location;
	}

	public static function laiskas( $args ) {
		if ( self::$g && ! self::$g['baigta'] ) {
			$to = $args['to'] ?? '';
			self::$laiskai[] = array( 'kam' => is_array( $to ) ? implode( ',', $to ) : (string) $to, 'tema' => mb_substr( (string) ( $args['subject'] ?? '' ), 0, 120 ), 'priedai' => count( (array) ( $args['attachments'] ?? array() ) ) );
		}
		return $args;
	}

	public static function die_handleris( $handler ) {
		if ( ! self::$g || self::$g['baigta'] ) { return $handler; }
		return function ( $message, $title = '', $args = array() ) use ( $handler ) {
			$m = is_wp_error( $message ) ? $message->get_error_message() : ( is_string( $message ) ? wp_strip_all_tags( $message ) : 'wp_die' );
			self::pabaiga( 'klaida', 'wp_die: ' . mb_substr( $m, 0, 300 ) );
			if ( is_callable( $handler ) ) { call_user_func( $handler, $message, $title, $args ); }
			else { _default_wp_die_handler( $message, $title, $args ); }
		};
	}

	/** Be peradresavimo (PDF, tiesioginis echo) — užrašom shutdown metu. */
	public static function pabaiga_shutdown() {
		if ( ! self::$g || self::$g['baigta'] ) { return; }
		$pdf = false;
		foreach ( headers_list() as $h ) { if ( stripos( $h, 'content-type:' ) === 0 && stripos( $h, 'pdf' ) !== false ) { $pdf = true; } }
		self::pabaiga( $pdf ? 'ok' : 'nezinoma', $pdf ? 'PDF' : '' );
	}

	protected static function pabaiga( $kodas, $zinute = '', $extra = array() ) {
		$g = self::$g; if ( ! $g || $g['baigta'] ) { return; }
		self::$g['baigta'] = true;
		wp_cache_flush();
		$bendra = array( 'param' => $g['param'], 'trukme_ms' => (int) round( ( microtime( true ) - $g['t0'] ) * 1000 ) ) + $extra;
		if ( self::$laiskai ) { $bendra['laiskai'] = self::$laiskai; }
		if ( $zinute ) { $bendra['zinute'] = $zinute; }
		$ids = $g['ids'] ?: array( 0 );
		foreach ( $ids as $oid ) {
			$po = $oid ? self::snap( $oid ) : array();
			self::irasyti( array(
				'uzsakymas'  => $oid,
				'eilute'     => (int) ( $g['param']['iid'] ?? 0 ),
				'sritis'     => $g['sritis'],
				'veiksmas'   => $g['veiksmas'],
				'rezultatas' => $kodas,
				'kanalas'    => 'web',
				'pries'      => $oid ? ( $g['pries'][ $oid ] ?? null ) : null,
				'po'         => $po + $bendra,
				'pastaba'    => count( $g['ids'] ) > 1 ? 'grupė: ' . count( $g['ids'] ) . ' užs.' : null,
			) );
		}
	}

	/* ============================ WC KABLIAI ============================ */

	public static function busena( $id, $nuo, $i, $order ) {
		$vidinis = self::$g && ! self::$g['baigta'];
		self::irasyti( array(
			'uzsakymas'  => (int) $id,
			'sritis'     => 'wc',
			'veiksmas'   => 'busena',
			'rezultatas' => 'ok',
			'kanalas'    => $vidinis ? 'web' : ( is_user_logged_in() && ! ( defined( 'DOING_CRON' ) && DOING_CRON ) && ! ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ? 'web' : 'auto' ),
			'pries'      => array( 'status' => $nuo ),
			'po'         => array( 'status' => $i ),
			'pastaba'    => $vidinis ? 'per: ' . ( self::ZODYNAS[ self::$g['veiksmas'] ] ?? self::$g['veiksmas'] ) : ( is_admin() ? 'WooCommerce' : ( ( defined( 'DOING_CRON' ) && DOING_CRON ) ? 'cron' : 'mokėjimas / svetainė' ) ),
		) );
	}

	public static function apmokejimas( $id ) {
		$snap = self::snap( $id );
		$kel  = array();
		foreach ( $snap['eil'] ?? array() as $iid => $e ) { $kel[] = '#' . $iid . ' ' . ( $e['src'] ?: '?' ); }
		self::irasyti( array(
			'uzsakymas'  => (int) $id,
			'sritis'     => 'wc',
			'veiksmas'   => 'apmokejimas',
			'rezultatas' => 'ok',
			'kanalas'    => ( self::$g && ! self::$g['baigta'] ) ? 'web' : 'auto',
			'po'         => $snap,
			'pastaba'    => 'keliai: ' . implode( ', ', $kel ) . ( $snap['tipas'] ? ' · ' . $snap['tipas'] : '' ),
		) );
	}

	/* ============================ LANGAS ============================ */

	public static function meniu() {
		add_submenu_page( '', 'Užsakymų žurnalas', 'Žurnalas', 'edit_shop_orders', self::SLUG, array( __CLASS__, 'puslapis' ) );
	}

	public static function puslapis() {
		global $wpdb;
		$uz = isset( $_GET['uzs'] ) ? absint( $_GET['uzs'] ) : 0;
		$sr = isset( $_GET['sritis'] ) ? sanitize_key( $_GET['sritis'] ) : '';
		$vk = isset( $_GET['veiksmas'] ) ? sanitize_key( $_GET['veiksmas'] ) : '';
		$w = array( '1=1' ); $p = array();
		if ( $uz ) { $w[] = 'uzsakymas=%d'; $p[] = $uz; }
		if ( $sr ) { $w[] = 'sritis=%s';    $p[] = $sr; }
		if ( $vk ) { $w[] = 'veiksmas=%s';  $p[] = $vk; }
		$sql = 'SELECT * FROM ' . self::t() . ' WHERE ' . implode( ' AND ', $w ) . ' ORDER BY id DESC LIMIT 300';
		$rows = $p ? $wpdb->get_results( $wpdb->prepare( $sql, $p ), ARRAY_A ) : $wpdb->get_results( $sql, ARRAY_A );
		$sritys = $wpdb->get_col( 'SELECT DISTINCT sritis FROM ' . self::t() . ' ORDER BY 1' );
		$veiksmai = $wpdb->get_col( 'SELECT DISTINCT veiksmas FROM ' . self::t() . ' ORDER BY 1' );
		$n = (int) $wpdb->get_var( 'SELECT COUNT(*) FROM ' . self::t() );
		?>
		<div class="wrap psuz"><h1>Užsakymų žurnalas <small><?php echo esc_html( $n ); ?> įrašų</small></h1>
		<form method="get" class="psuz-f"><input type="hidden" name="page" value="<?php echo esc_attr( self::SLUG ); ?>">
			<input type="number" name="uzs" value="<?php echo $uz ? (int) $uz : ''; ?>" placeholder="Užsakymo nr.">
			<select name="sritis"><option value="">— sritis —</option><?php foreach ( $sritys as $s ) { printf( '<option value="%s"%s>%s</option>', esc_attr( $s ), selected( $sr, $s, false ), esc_html( $s ) ); } ?></select>
			<select name="veiksmas"><option value="">— veiksmas —</option><?php foreach ( $veiksmai as $s ) { printf( '<option value="%s"%s>%s</option>', esc_attr( $s ), selected( $vk, $s, false ), esc_html( self::ZODYNAS[ $s ] ?? $s ) ); } ?></select>
			<button class="button">Rodyti</button> <a class="button" href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::SLUG ) ); ?>">Išvalyti</a>
		</form>
		<table class="widefat striped psuz-t"><thead><tr><th>Laikas</th><th>Užsakymas</th><th>Kas</th><th>Sritis</th><th>Veiksmas</th><th>Rezultatas</th><th>Kas pasikeitė</th></tr></thead><tbody>
		<?php if ( ! $rows ) { echo '<tr><td colspan="7">Įrašų nėra.</td></tr>'; }
		foreach ( $rows as $r ) {
			$po = json_decode( (string) $r['po'], true );
			printf( '<tr class="psuz-%1$s"><td>%2$s</td><td>%3$s</td><td>%4$s</td><td>%5$s</td><td>%6$s</td><td>%1$s</td><td>%7$s</td></tr>',
				esc_attr( $r['rezultatas'] ),
				esc_html( wp_date( 'Y-m-d H:i:s', strtotime( $r['laikas'] . ' UTC' ) ) ),
				$r['uzsakymas'] ? '<a href="' . esc_url( admin_url( 'admin.php?page=' . self::SLUG . '&uzs=' . (int) $r['uzsakymas'] ) ) . '">#' . (int) $r['uzsakymas'] . '</a>' . ( $r['eilute'] ? ' / ' . (int) $r['eilute'] : '' ) : '—',
				esc_html( ( 'web' === $r['kanalas'] ? $r['kas_vardas'] : $r['kanalas'] ) ),
				esc_html( $r['sritis'] ),
				esc_html( self::ZODYNAS[ $r['veiksmas'] ] ?? $r['veiksmas'] ),
				esc_html( trim( self::skirtumas( $r ) . ( $r['pastaba'] ? ' · ' . $r['pastaba'] : '' ) . ( isset( $po['trukme_ms'] ) ? ' · ' . $po['trukme_ms'] . ' ms' : '' ), ' ·' ) )
			);
		}
		?></tbody></table></div>
		<style>.psuz h1 small{font-size:13px;color:#666;font-weight:400;margin-left:8px}.psuz-f{display:flex;gap:6px;margin:8px 0 12px}.psuz-f input[type=number]{width:120px}.psuz-t td{font-size:12px;vertical-align:top}.psuz-t tr.psuz-klaida td:nth-child(6){color:#b32d2e;font-weight:600}.psuz-t tr.psuz-praleista td:nth-child(6),.psuz-t tr.psuz-nezinoma td:nth-child(6){color:#996800}
		.psuz-zurnalas ol{margin:0;padding-left:18px;font-size:12px;line-height:1.5}.psuz-zurnalas li.psuz-klaida{color:#b32d2e}.psuz-zurnalas li.psuz-k-auto{color:#555}.psuz-tuscia{color:#777;font-size:12px}</style>
		<?php
	}
}

Petshop_Uzsakymu_Ivykiai::init();
