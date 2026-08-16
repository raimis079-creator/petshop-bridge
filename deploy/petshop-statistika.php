<?php
/**
 * Plugin Name: Petshop Statistika
 * Description: Elgsenos ivykiai (surenkamos dezes), savikaina ir uzsakymo atributai pardavimo momentu.
 * Version: 2.0
 *
 * Du sluoksniai, sąmoningai atskirti:
 *
 * 1) PARDAVIMAI. Savikaina irasoma i uzsakymo eilute PARDAVIMO MOMENTU
 *    (`_ps_savikaina_vnt`). Be to perskaiciavus tiekejo savikaina pasikeistu ir
 *    praejusio menesio marza — istorija taptu netikra (savininko sprendimas
 *    2026-08-15). Galioja VISOMS eilutems: surenkamoms, paruostoms, dovanoms.
 *
 * 2) ELGSENA. Kliento veiksmai vitrinoje — savo lentele `ps_laukai_ivykiai`.
 *    NEMAISYTI su `ps_ivykiai` (ten prekiu auditas: kas keite kaina/likuti).
 *
 * v2.0 (ataskaitu standartas v2, spec v1.1):
 *  - schema v2: + dydis, skirtukas, kiek_dezeje, irenginys;
 *  - NAUJA lentele `ps_ataskaitu_dienos` — dienos suvestine (pinigai CENTAIS);
 *  - DU SLUOKSNIAI: be sutikimo ivykiai rasomi ANONIMISKAI (sesija=''),
 *    su Complianz statistikos sutikimu — su sesija. Anksciau be sutikimo
 *    nebuvo rasoma NIEKO, todel dingdavo ir anoniminiai skaitliukai;
 *  - nauji uzsakymo meta: `_ps_stat_sesija`, `_ps_dydis`, `_ps_irenginys`,
 *    `_ps_kaina_atskirai_vnt`;
 *  - valymas nebetrina neagreguotu dienu (buvo duomenu praradimo klaida).
 *
 * REALYBES PATIKSLINIMAI (recon 2026-08-16, NE prielaidos):
 *  - dydis gyvena dezes PRODUKTO meta `_ps_laukas_dydis` ('400 g','800 g','100 g'),
 *    ne krepselio pasirinkime — normalizuojam i '400','800','100';
 *  - skirtukas nera filtras dezes viduje: kiekvienas skirtukas yra ATSKIRAS
 *    dezes produktas-brolis. Todel dydi ir skirtuka pildo SERVERIS is dezes
 *    produkto, o ne narsykle — patikimiau ir nepriklauso nuo JS.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Statistika {

	const VERSIJA         = '2.0';
	const SCHEMOS_RAKTAS  = 'ps_stat_schema';
	const SCHEMOS_VERSIJA = 2;

	const META_SAVIKAINA    = '_ps_savikaina_vnt';
	const META_SAV_SALTINIS = '_ps_savikaina_saltinis';
	const META_KAINA_ATSK   = '_ps_kaina_atskirai_vnt';
	const META_UZS_SESIJA   = '_ps_stat_sesija';
	const META_UZS_IRENG    = '_ps_irenginys';
	const META_EIL_DYDIS    = '_ps_dydis';
	const OPT_PRADZIA       = 'ps_stat_pradzia';

	/** Neapdoroti ivykiai — 90 dienu (savininko sprendimas). Trinami TIK po agregavimo. */
	const ZALIU_DIENOS = 90;

	public static function init() {
		add_action( 'init', array( __CLASS__, 'uztikrinti_lentele' ) );

		/* --- 1) savikaina ir eiluciu atributai --- */
		add_action( 'woocommerce_checkout_create_order_line_item', array( __CLASS__, 'savikaina_i_eilute' ), 20, 4 );
		/* Uzsakymai, kuriami ne per checkout (admin, API) — tas pats snapshot'as. */
		add_action( 'woocommerce_new_order_item', array( __CLASS__, 'savikaina_naujam_item' ), 20, 3 );

		/* --- 2) uzsakymo atributai (sesija, irenginys) --- */
		add_action( 'woocommerce_checkout_create_order', array( __CLASS__, 'uzsakymo_atributai' ), 20, 2 );
		add_action( 'wp_footer', array( __CLASS__, 'irenginio_laukas' ), 20 );

		/* --- 3) elgsenos ivykiai --- */
		add_action( 'wp_ajax_ps_stat_ivykis', array( __CLASS__, 'ajax_ivykis' ) );
		add_action( 'wp_ajax_nopriv_ps_stat_ivykis', array( __CLASS__, 'ajax_ivykis' ) );

		/* Valymas kartą per parą (po agregavimo — jis sukasi 03:15). */
		add_action( 'ps_stat_valymas', array( __CLASS__, 'valyti' ) );
		if ( ! wp_next_scheduled( 'ps_stat_valymas' ) ) {
			wp_schedule_event( time() + 3600, 'daily', 'ps_stat_valymas' );
		}
	}

	/* ==================== LENTELES ==================== */

	public static function lentele() {
		global $wpdb;
		return $wpdb->prefix . 'ps_laukai_ivykiai';
	}

	public static function lentele_dienos() {
		global $wpdb;
		return $wpdb->prefix . 'ps_ataskaitu_dienos';
	}

	public static function uztikrinti_lentele() {
		if ( (int) get_option( self::SCHEMOS_RAKTAS ) === self::SCHEMOS_VERSIJA ) { return; }
		global $wpdb;
		$t = self::lentele();
		$d = self::lentele_dienos();
		$c = $wpdb->get_charset_collate();
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		dbDelta( "CREATE TABLE $t (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			laikas DATETIME NOT NULL,
			sesija CHAR(32) NOT NULL DEFAULT '',
			sritis VARCHAR(24) NOT NULL DEFAULT 'laukai',
			deze_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			preke_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			tipas VARCHAR(24) NOT NULL DEFAULT '',
			verte VARCHAR(64) NOT NULL DEFAULT '',
			dydis VARCHAR(8) NOT NULL DEFAULT '',
			skirtukas VARCHAR(24) NOT NULL DEFAULT '',
			kiek_dezeje SMALLINT UNSIGNED NOT NULL DEFAULT 0,
			irenginys VARCHAR(8) NOT NULL DEFAULT '',
			aplinka VARCHAR(8) NOT NULL DEFAULT 'dev',
			PRIMARY KEY (id),
			KEY laikas (laikas),
			KEY deze (deze_id, tipas),
			KEY preke (preke_id, tipas),
			KEY sesija (sesija)
		) $c;" );

		dbDelta( "CREATE TABLE $d (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			diena DATE NOT NULL,
			aplinka VARCHAR(8) NOT NULL DEFAULT 'dev',
			sritis VARCHAR(24) NOT NULL,
			deze_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			preke_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			dydis VARCHAR(8) NOT NULL DEFAULT '',
			skirtukas VARCHAR(24) NOT NULL DEFAULT '',
			irenginys VARCHAR(8) NOT NULL DEFAULT '',
			tipas VARCHAR(24) NOT NULL,
			kiekis INT NOT NULL DEFAULT 0,
			sesiju INT NOT NULL DEFAULT 0,
			suma_ct BIGINT NOT NULL DEFAULT 0,
			sav_ct BIGINT NOT NULL DEFAULT 0,
			PRIMARY KEY (id),
			UNIQUE KEY dim (diena, aplinka, sritis, deze_id, preke_id, dydis, skirtukas, irenginys, tipas),
			KEY dsk (diena, sritis, tipas)
		) $c;" );

		update_option( self::SCHEMOS_RAKTAS, self::SCHEMOS_VERSIJA, false );
	}

	/* ==================== DEZES ATRIBUTAI (SERVERIO PUSE) ==================== */

	/**
	 * Dydis normalizuotas: '400 g' -> '400'. Sauganti forma, kad suvestines
	 * dimensija butu stabili net pakeitus uzrasa vitrinoje.
	 */
	public static function dydis_normalus( $tekstas ) {
		$t = trim( (string) $tekstas );
		if ( $t === '' ) { return ''; }
		if ( preg_match( '/(\d+)/', $t, $m ) ) { return substr( $m[1], 0, 8 ); }
		return substr( sanitize_key( $t ), 0, 8 );
	}

	/** Dezes dydis is produkto meta (`_ps_laukas_dydis`). */
	public static function dezes_dydis( $deze_id ) {
		$deze_id = (int) $deze_id;
		if ( ! $deze_id ) { return ''; }
		return self::dydis_normalus( get_post_meta( $deze_id, '_ps_laukas_dydis', true ) );
	}

	/**
	 * Skirtukas is dezes produkto. Kiekvienas skirtukas yra atskiras produktas
	 * (broliai), todel atpazistam pagal pavadinima — su aiskiu uzdaru sarasu.
	 * Nerandam — tuscia (ekranai tada rodo be skirtuko pjuvio, o ne spėja).
	 */
	public static function dezes_skirtukas( $deze_id ) {
		$deze_id = (int) $deze_id;
		if ( ! $deze_id ) { return ''; }
		$p = get_post_meta( $deze_id, '_ps_laukas_skirtukas', true );
		if ( $p !== '' && $p !== null ) { return substr( sanitize_key( $p ), 0, 24 ); }

		$pav = function_exists( 'mb_strtolower' ) ? mb_strtolower( (string) get_the_title( $deze_id ) ) : strtolower( (string) get_the_title( $deze_id ) );
		$zemelapis = array(
			'be_vistienos'  => array( 'be višt', 'be vist' ),
			'monoproteinas' => array( 'monoprotein' ),
			'isrankioms'    => array( 'išrank', 'isrank' ),
			'visi'          => array( 'visi skon' ),
		);
		foreach ( $zemelapis as $slug => $frazes ) {
			foreach ( $frazes as $f ) {
				if ( strpos( $pav, $f ) !== false ) { return $slug; }
			}
		}
		return '';
	}

	/** Zmoniski skirtuku uzrasai ekranams. */
	public static function skirtuko_vardas( $slug ) {
		$v = array(
			'be_vistienos'  => 'Be vištienos',
			'monoproteinas' => 'Monoproteinas',
			'isrankioms'    => 'Išrankioms',
			'visi'          => 'Visi skoniai',
		);
		return isset( $v[ $slug ] ) ? $v[ $slug ] : ( $slug === '' ? '—' : $slug );
	}

	/* ==================== 1) SAVIKAINA PARDAVIMO MOMENTU ==================== */

	/**
	 * Savikaina imama is to paties saltinio, kaip visur kitur sistemoje, ir
	 * IRASOMA i eilute. Nezinoma savikaina zymima atskirai — geriau matyti
	 * spraga, nei skaiciuoti 100 % marza is nulio.
	 */
	public static function savikaina_preke( $pid ) {
		if ( class_exists( 'Petshop_Pardavimai' ) && method_exists( 'Petshop_Pardavimai', 'savikaina' ) ) {
			$s = Petshop_Pardavimai::savikaina( $pid );
			if ( $s !== null && $s !== '' && (float) $s > 0 ) { return array( (float) $s, 'pardavimai' ); }
		}
		foreach ( array( '_ps_savikaina', '_wc_cog_cost', '_alg_wc_cog_cost' ) as $raktas ) {
			$s = get_post_meta( $pid, $raktas, true );
			if ( $s !== '' && (float) $s > 0 ) { return array( (float) $s, $raktas ); }
		}
		return array( null, 'nezinoma' );
	}

	/**
	 * Kaina perkant ATSKIRAI (su PVM) pardavimo momentu. Reikalinga „Sutaupote"
	 * ir nuolaidos gylio skaiciavimui rinkiniu ataskaitoje. DP pakui — bazines
	 * prekes kaina; MnM vaikui — paties vaiko kaina kataloge.
	 */
	public static function kaina_atskirai( $pid ) {
		$pid = (int) $pid;
		if ( ! $pid ) { return null; }
		$baze = (int) get_post_meta( $pid, '_dp_base_product_id', true );
		if ( $baze ) { $pid = $baze; }
		$p = wc_get_product( $pid );
		if ( ! $p ) { return null; }
		$k = wc_get_price_including_tax( $p );
		return ( $k === '' || $k === null ) ? null : (float) $k;
	}

	/** Ar eilute yra MnM konteineris (deze / paruostas rinkinys). */
	private static function ar_konteineris( $item ) {
		$raktas = (string) $item->get_meta( '_mnm_cart_key', true );
		return ( $raktas !== '' );
	}

	public static function savikaina_i_eilute( $item, $raktas, $reiksmes, $order ) {
		$pid = $item->get_variation_id() ? $item->get_variation_id() : $item->get_product_id();
		if ( ! $pid ) { return; }
		list( $sav, $saltinis ) = self::savikaina_preke( $pid );
		$item->add_meta_data( self::META_SAVIKAINA, $sav === null ? '' : wc_format_decimal( $sav, 4 ), true );
		$item->add_meta_data( self::META_SAV_SALTINIS, $saltinis, true );
		self::papildomi_eilutes_atributai( $item, $pid );
	}

	/** Uzsakymai ne is checkout (admin, API, importas). */
	public static function savikaina_naujam_item( $item_id, $item, $order_id ) {
		if ( ! is_a( $item, 'WC_Order_Item_Product' ) ) { return; }
		if ( wc_get_order_item_meta( $item_id, self::META_SAVIKAINA, true ) !== '' ) { return; }
		$pid = $item->get_variation_id() ? $item->get_variation_id() : $item->get_product_id();
		if ( ! $pid ) { return; }
		list( $sav, $saltinis ) = self::savikaina_preke( $pid );
		wc_add_order_item_meta( $item_id, self::META_SAVIKAINA, $sav === null ? '' : wc_format_decimal( $sav, 4 ), true );
		wc_add_order_item_meta( $item_id, self::META_SAV_SALTINIS, $saltinis, true );

		/* Dydis konteineriui, kaina atskirai — visoms kitoms eilutems. */
		if ( self::ar_konteineris( $item ) ) {
			$d = self::dezes_dydis( $item->get_product_id() );
			if ( $d !== '' && wc_get_order_item_meta( $item_id, self::META_EIL_DYDIS, true ) === '' ) {
				wc_add_order_item_meta( $item_id, self::META_EIL_DYDIS, $d, true );
			}
		} else {
			$k = self::kaina_atskirai( $pid );
			if ( $k !== null && wc_get_order_item_meta( $item_id, self::META_KAINA_ATSK, true ) === '' ) {
				wc_add_order_item_meta( $item_id, self::META_KAINA_ATSK, wc_format_decimal( $k, 4 ), true );
			}
		}
	}

	/**
	 * Konteineriui — dezes dydis; visoms kitoms eilutems — kaina atskirai.
	 * Abu snapshot'ai pardavimo momentu: veliau pasikeitusios kainos ar
	 * pakuotes uzrasai praeities ataskaitu nebekeicia.
	 */
	private static function papildomi_eilutes_atributai( $item, $pid ) {
		if ( self::ar_konteineris( $item ) ) {
			$d = self::dezes_dydis( $item->get_product_id() );
			if ( $d !== '' ) { $item->add_meta_data( self::META_EIL_DYDIS, $d, true ); }
			return;
		}
		$k = self::kaina_atskirai( $pid );
		if ( $k !== null ) { $item->add_meta_data( self::META_KAINA_ATSK, wc_format_decimal( $k, 4 ), true ); }
	}

	/* ==================== 2) UZSAKYMO ATRIBUTAI ==================== */

	/**
	 * Irenginys — UZSAKYMO atributas (mobile/desktop), ne sekimas: jokio
	 * identifikatoriaus, jokio IP, user-agent serveryje NESKAITOMAS. Todel
	 * veikia 100 % uzsakymu ir sutikimo nereikalauja.
	 */
	public static function irenginio_laukas() {
		if ( ! function_exists( 'is_checkout' ) || ! is_checkout() ) { return; }
		?>
		<script>
		(function(){
			try{
				if (document.getElementById('ps_irenginys')) { return; }
				var v = (window.matchMedia && window.matchMedia('(max-width:768px)').matches) ? 'mobile' : 'desktop';
				var f = document.querySelector('form.checkout') || document.querySelector('form.woocommerce-checkout');
				if (!f) { return; }
				var i = document.createElement('input');
				i.type = 'hidden'; i.name = 'ps_irenginys'; i.value = v; i.id = 'ps_irenginys';
				f.appendChild(i);
			}catch(e){}
		})();
		</script>
		<?php
	}

	public static function uzsakymo_atributai( $order, $duomenys ) {
		$ir = isset( $_POST['ps_irenginys'] ) ? sanitize_key( wp_unslash( $_POST['ps_irenginys'] ) ) : '';
		if ( $ir === 'mobile' || $ir === 'desktop' ) {
			$order->update_meta_data( self::META_UZS_IRENG, $ir );
		}
		$s = self::sesija();
		if ( $s !== '' ) { $order->update_meta_data( self::META_UZS_SESIJA, $s ); }
	}

	/* ==================== 3) ELGSENOS IVYKIAI ==================== */

	/** dev ivykiai zymimi atskirai, kad nesusimaisytu su produkcija. */
	public static function aplinka() {
		$h = wp_parse_url( home_url(), PHP_URL_HOST );
		return ( $h === 'petshop.lt' || $h === 'www.petshop.lt' ) ? 'prod' : 'dev';
	}

	/** Anoniminis sesijos raktas: be IP, be asmens duomenu. */
	public static function sesija() {
		$c = isset( $_COOKIE['ps_stat_s'] ) ? sanitize_key( $_COOKIE['ps_stat_s'] ) : '';
		if ( strlen( $c ) === 32 ) { return $c; }
		return '';
	}

	public static function irasyti( $tipas, $args = array() ) {
		global $wpdb;
		$tipas = sanitize_key( $tipas );
		if ( $tipas === '' ) { return false; }

		$deze = isset( $args['deze'] ) ? (int) $args['deze'] : 0;

		/* Dydis ir skirtukas — is dezes PRODUKTO (serverio puse), o ne is
		   narsykles: dezes-broliai yra atskiri produktai, tad tai patikimiau. */
		$dydis     = ( isset( $args['dydis'] ) && $args['dydis'] !== '' ) ? self::dydis_normalus( $args['dydis'] ) : self::dezes_dydis( $deze );
		$skirtukas = ( isset( $args['skirtukas'] ) && $args['skirtukas'] !== '' ) ? substr( sanitize_key( $args['skirtukas'] ), 0, 24 ) : self::dezes_skirtukas( $deze );
		$ireng     = isset( $args['irenginys'] ) ? sanitize_key( $args['irenginys'] ) : '';
		if ( $ireng !== 'mobile' && $ireng !== 'desktop' ) { $ireng = ''; }

		return (bool) $wpdb->insert( self::lentele(), array(
			'laikas'      => current_time( 'mysql' ),
			'sesija'      => isset( $args['sesija'] ) ? substr( sanitize_key( $args['sesija'] ), 0, 32 ) : self::sesija(),
			'sritis'      => isset( $args['sritis'] ) ? sanitize_key( $args['sritis'] ) : 'laukai',
			'deze_id'     => $deze,
			'preke_id'    => isset( $args['preke'] ) ? (int) $args['preke'] : 0,
			'tipas'       => $tipas,
			'verte'       => isset( $args['verte'] ) ? substr( (string) $args['verte'], 0, 64 ) : '',
			'dydis'       => $dydis,
			'skirtukas'   => $skirtukas,
			'kiek_dezeje' => isset( $args['kiek_dezeje'] ) ? max( 0, min( 65535, (int) $args['kiek_dezeje'] ) ) : 0,
			'irenginys'   => $ireng,
			'aplinka'     => self::aplinka(),
		), array( '%s','%s','%s','%d','%d','%s','%s','%s','%s','%d','%s','%s' ) );
	}

	/**
	 * DU SLUOKSNIAI (savininko sprendimas 2026-08-16):
	 *  1) be sutikimo — ivykiai rasomi ANONIMISKAI (sesija priverstinai ''),
	 *     jokio identifikatoriaus irenginyje. Is cia veikia idejimo dalys,
	 *     skirtuku/dydziu pjuviai, isemimai pagal pilnuma;
	 *  2) su Complianz statistikos sutikimu — pridedama sesija, ir tik tada
	 *     imanomas piltuvelis, konversija, kabliukai, uzdarytojos.
	 */
	public static function ajax_ivykis() {
		$raw = isset( $_POST['ivykiai'] ) ? wp_unslash( $_POST['ivykiai'] ) : '';
		$sar = json_decode( (string) $raw, true );
		if ( ! is_array( $sar ) ) { wp_send_json_error( 'blogas formatas' ); }

		$sesija = '';
		if ( self::sutikimas() ) {
			$sesija = isset( $_POST['sesija'] ) ? substr( sanitize_key( wp_unslash( $_POST['sesija'] ) ), 0, 32 ) : '';
			if ( strlen( $sesija ) !== 32 ) { $sesija = ''; }
		}
		$ireng = isset( $_POST['irenginys'] ) ? sanitize_key( wp_unslash( $_POST['irenginys'] ) ) : '';

		$n = 0;
		foreach ( array_slice( $sar, 0, 50 ) as $iv ) {
			if ( empty( $iv['tipas'] ) ) { continue; }
			$n += self::irasyti( $iv['tipas'], array(
				'sesija'      => $sesija,
				'deze'        => isset( $iv['deze'] ) ? $iv['deze'] : 0,
				'preke'       => isset( $iv['preke'] ) ? $iv['preke'] : 0,
				'verte'       => isset( $iv['verte'] ) ? $iv['verte'] : '',
				'kiek_dezeje' => isset( $iv['kiek'] ) ? $iv['kiek'] : 0,
				'irenginys'   => $ireng,
			) ) ? 1 : 0;
		}
		wp_send_json_success( array( 'irasyta' => $n, 'su_sesija' => ( $sesija !== '' ) ) );
	}

	/** Complianz statistikos sutikimas. Nera plugino — laikom, kad sutikimo nera. */
	public static function sutikimas() {
		if ( function_exists( 'cmplz_has_consent' ) ) { return (bool) cmplz_has_consent( 'statistics' ); }
		return false;
	}

	/* ==================== PRADZIA IR VALYMAS ==================== */

	/** Grazina Y-m-d arba '' — data yra NUSTATYMAS, ne konstanta kode. */
	public static function pradzia() {
		$d = (string) get_option( self::OPT_PRADZIA, '' );
		return preg_match( '/^\d{4}-\d{2}-\d{2}$/', $d ) ? $d : '';
	}

	/**
	 * Trinam TIK tas dienas, kurios jau yra suvestineje. Anksciau trynem pagal
	 * data aklai — po 90 d. istorija dingdavo negriztamai (klaida, rasta
	 * auditu 2026-08-16).
	 */
	public static function valyti() {
		global $wpdb;
		$t = self::lentele();
		$d = self::lentele_dienos();
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$d'" ) !== $d ) { return 0; }

		$riba = gmdate( 'Y-m-d', time() - ( self::ZALIU_DIENOS * DAY_IN_SECONDS ) );
		$dienos = $wpdb->get_col( $wpdb->prepare(
			"SELECT DISTINCT DATE(laikas) FROM $t WHERE laikas < %s LIMIT 200", $riba . ' 00:00:00'
		) );
		$istrinta = 0;
		foreach ( (array) $dienos as $diena ) {
			$yra = (int) $wpdb->get_var( $wpdb->prepare(
				"SELECT COUNT(*) FROM $d WHERE diena=%s AND sritis=%s", $diena, 'laukai'
			) );
			if ( ! $yra ) { continue; } /* neagreguota — NELIECIAM */
			$istrinta += (int) $wpdb->query( $wpdb->prepare(
				"DELETE FROM $t WHERE DATE(laikas)=%s", $diena
			) );
		}
		return $istrinta;
	}
}

Petshop_Statistika::init();
