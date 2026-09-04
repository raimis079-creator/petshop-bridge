<?php
/**
 * Petshop Kliento siuntos v1.2 (S1612, 2026-09-04; 4 etapas #1 — būsena „Pristatyta“ iš Venipak sekimo) + kliento pusės sargai.
 *
 * v1.2 — trečia būsena **Pristatyta** (`kliento_siuntos()` `busena=pristatyta`, darbalaukis v3.11: visi dalies numeriai Venipak'e „Delivered“).
 *   Žymė žalia kaip „Išsiųsta“, be datos (kaip kitos būsenos); „Sekti siuntą“ lieka. Piešia tik — duomenys vis tas pats vienas šaltinis.
 *
 * KODĖL: paskyros užsakymo puslapyje siuntų nebuvo (S1609 `e8_uzsakymas_35421.png`) — Venipak/LP pluginai kliento pusėje nieko
 * nekabina, klientas po laiško „Išsiųsta 1 iš 2 siuntų“ paskyroje nematė nei siuntų, nei numerių.
 *
 * KĄ DARO: blokas „Siuntos“ paskyros užsakymo puslapyje (`paskyra/uzsakymas/N/`) VIRŠUJE, virš „Užsakymo informacija“ —
 * `woocommerce_order_details_before_order_table` prior. 5 (prieš `petshop-atsisakymas.php` pranešimo closure prior. 10).
 * Kiekvienai siuntai: „Siunta 1 iš 2“ (vienai — „Siunta“) · būsena TIK Ruošiama / Išsiųsta (be datos; „Pristatyta“ — 4 etape iš
 * Venipak API) · prekės × kiekis · siuntos numeris (Venipak / LP Express) + „Sekti siuntą“. Tiekėjų vardų klientui NĖRA —
 * viską siunčia petshop.lt.
 *
 * TIK PIEŠIA: duomenys — `Petshop_Darbalaukis::kliento_siuntos($o)` (darbalaukis v3.10.3) — tas pats šaltinis kaip laiške
 * (vienas tiesos šaltinis; 4 etapo Venipak cron rašys ten pat). Atskiro meniu skirtuko „Siuntos“ NĖRA (Raimis 09-03 naktį).
 * TIK REGISTRUOTIEMS: `customer_id` > 0 ir tai prisijungęs vartotojas; tik `view-order` endpoint'e (ne „ačiū“ puslapyje).
 * Svečiams — laiške „Sekti siuntą“; puslapis be prisijungimo — 5 etapas („Kaip mato klientas“).
 *
 * v1.1 — KLIENTO PUSĖS SARGAI (Raimis 2026-09-04):
 *  - (b) WC 11 „Confirm your email address to check for past orders and link them to your account.“ raginimas paskyros užsakymų
 *    sąraše IŠJUNGTAS (`VerificationController::render_prompt` nuimamas nuo `woocommerce_before_account_orders`; svečio užsakymų
 *    susiejimo funkcija nenaudojama). Rezultato pranešimas (`print_result_notice`, prior. 5) ir pats patvirtinimo apdorojimas lieka —
 *    nieko nerodo, kol raginimo nėra.
 *  - LP Express plugino SAVO sekimo laiškas klientui (`woo_lithuaniapost_send_tracking_email` → `send_tracking_email`) IŠJUNGTAS —
 *    viena sistema: laišką „Išsiųsta n iš N“ / „Užsakymas išsiųstas“ siunčia darbalaukis (`Petshop_Darbalaukis::siuntos_laiskas()`),
 *    LP numeris ten patenka per `_woo_lithuaniapost_barcode` (darbalaukis v3.10.4). Kartu plugino nustatymai
 *    `lpsettings_event_to_send_tracking_email` ir `lpsettings_event_to_change_status_to_completed` = „Never“ (S1610 e12), kad pluginas
 *    nei laiško nesiųstų, nei pats užbaigtų užsakymo aplenkdamas „Kurjeris paėmė“. Šis `remove_action` — saugiklis, jei nustatymas grįžtų.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Kliento_Siuntos {

	const VERSIJA = '1.2';

	public static function init() {
		add_action( 'woocommerce_order_details_before_order_table', array( __CLASS__, 'blokas' ), 5, 1 );
		add_action( 'init', array( __CLASS__, 'sargai' ), 20 );
	}

	/** v1.1: nuima WC el. pašto patvirtinimo raginimą (b) ir LP plugino sekimo laišką (viena sistema). Grąžina, ką nuėmė (patikrai). */
	public static function sargai() {
		global $wp_filter; $nuimta = array();
		if ( ! empty( $wp_filter['woocommerce_before_account_orders'] ) ) {
			foreach ( $wp_filter['woocommerce_before_account_orders']->callbacks as $pr => $cbs ) {
				foreach ( $cbs as $cb ) {
					$fn = $cb['function'];
					if ( is_array( $fn ) && is_object( $fn[0] ) && 'render_prompt' === $fn[1] && false !== strpos( get_class( $fn[0] ), 'CustomerEmailVerification' ) ) {
						remove_action( 'woocommerce_before_account_orders', $fn, $pr ); $nuimta[] = 'wc_render_prompt@' . $pr;
					}
				}
			}
		}
		if ( has_action( 'woo_lithuaniapost_send_tracking_email' ) ) { remove_all_actions( 'woo_lithuaniapost_send_tracking_email' ); $nuimta[] = 'lp_send_tracking_email'; }
		return $nuimta;
	}

	/** Rodyti tik savininkui, tik paskyros užsakymo puslapyje, tik kai variklis (darbalaukis v3.10.3+) yra. */
	public static function rodyti( $o ) {
		if ( ! $o instanceof WC_Order || ! is_user_logged_in() ) { return false; }
		if ( ! function_exists( 'is_wc_endpoint_url' ) || ! is_wc_endpoint_url( 'view-order' ) ) { return false; }
		$cid = (int) $o->get_customer_id();
		if ( $cid <= 0 || $cid !== (int) get_current_user_id() ) { return false; }
		return class_exists( 'Petshop_Darbalaukis' ) && method_exists( 'Petshop_Darbalaukis', 'kliento_siuntos' );
	}

	public static function blokas( $o ) {
		if ( ! self::rodyti( $o ) ) { return; }
		$siuntos = Petshop_Darbalaukis::kliento_siuntos( $o );
		if ( ! $siuntos ) { return; }
		echo self::html( $siuntos ); // phpcs:ignore WordPress.Security.EscapeOutput -- viskas esc'inama html()
	}

	/** HTML iš `kliento_siuntos()` sąrašo. Vienai siuntai — „Siunta“, kelioms — „Siunta n iš N“. */
	public static function html( $siuntos ) {
		$spalva = (string) get_option( 'woocommerce_email_base_color', '#2d6a35' );
		if ( ! preg_match( '/^#[0-9a-fA-F]{3,6}$/', $spalva ) ) { $spalva = '#2d6a35'; }
		$h  = '<section class="ps-siuntos" data-n="' . (int) count( $siuntos ) . '">';
		$h .= '<h2 class="woocommerce-order-details__title">' . esc_html( 'Siuntos' ) . '</h2>';
		foreach ( $siuntos as $s ) {
			$b = (string) ( $s['busena'] ?? '' ); $iss = in_array( $b, array( 'issiusta', 'pristatyta' ), true );
			$antr = (int) ( $s['viso'] ?? 1 ) > 1 ? sprintf( 'Siunta %d iš %d', (int) $s['n'], (int) $s['viso'] ) : 'Siunta';
			$h .= '<div class="ps-siunta ps-siunta--' . ( $iss ? 'issiusta' : 'ruosiama' ) . '">';
			$h .= '<div class="ps-siunta__antr"><b>' . esc_html( $antr ) . '</b><span class="ps-siunta__busena">' . esc_html( 'pristatyta' === $b ? 'Pristatyta' : ( $iss ? 'Išsiųsta' : 'Ruošiama' ) ) . '</span></div>';
			if ( ! empty( $s['prekes'] ) ) {
				$h .= '<ul class="ps-siunta__prekes">';
				foreach ( $s['prekes'] as $p ) { $h .= '<li>' . esc_html( (int) $p['q'] . ' × ' . $p['n'] ) . '</li>'; }
				$h .= '</ul>';
			}
			$nrs = array_values( array_filter( (array) ( $s['numeriai'] ?? array() ) ) );
			if ( $nrs ) {
				$vez = 'lp' === ( $s['vez'] ?? '' ) ? 'LP Express' : 'Venipak';
				$h .= '<div class="ps-siunta__nr"><span>' . esc_html( ( count( $nrs ) > 1 ? 'Siuntų numeriai (' . $vez . '): ' : 'Siuntos numeris (' . $vez . '): ' ) ) . '<b>' . esc_html( implode( ', ', $nrs ) ) . '</b></span>';
				if ( ! empty( $s['url'] ) ) { $h .= '<a class="button ps-siunta__sekti" href="' . esc_url( $s['url'] ) . '" target="_blank" rel="noopener">' . esc_html( 'Sekti siuntą' ) . '</a>'; }
				$h .= '</div>';
			}
			$h .= '</div>';
		}
		$h .= '</section>';
		$h .= '<style>.ps-siuntos{margin:0 0 30px}.ps-siunta{border:1px solid #e2e2e2;border-radius:6px;padding:14px 16px;margin:0 0 12px}'
			. '.ps-siunta__antr{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:1.05em}.ps-siunta__busena{font-size:.8em;font-weight:700;letter-spacing:.3px;padding:2px 10px;border-radius:12px;background:#ececec;color:#555}'
			. '.ps-siunta--issiusta .ps-siunta__busena{background:' . esc_attr( $spalva ) . ';color:#fff}'
			. '.ps-siunta__prekes{margin:8px 0 6px;padding-left:20px;font-size:.95em}.ps-siunta__prekes li{margin:0 0 3px}'
			. '.ps-siunta__nr{display:flex;align-items:center;justify-content:space-between;gap:10px 14px;flex-wrap:wrap;margin-top:8px;font-size:.95em}'
			. '.ps-siunta__nr b{letter-spacing:.4px}.ps-siunta__sekti.button{margin:0;background:' . esc_attr( $spalva ) . ';color:#fff}</style>';
		return $h;
	}
}
Petshop_Kliento_Siuntos::init();
