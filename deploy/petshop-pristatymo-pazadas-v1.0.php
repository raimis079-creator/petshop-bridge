<?php
/**
 * Plugin Name: Petshop pristatymo pažadas v1.0 (S1720, planas 2.17)
 * Description: (1) Prekės puslapyje po „Turime“: „Išsiunčiame per 1–2 d. d.“ + pristatymo kaina (paštomatas 2,15 € / nemokamai nuo 30 € / kurjeris 3,99 €;
 *   > 25 kg arba „Tik kurjeriu“ → tik kurjeris). (2) €/kg po kaina — tik sausam maistui ir kraikui, svoris iš pavadinimo, ≥ 1 kg.
 *   (3) Krepšelyje (po nemokamo pristatymo langelio), apmokėjime (po prekių, prieš „Pristatymas“) ir mini-krepšelyje — siuntimo eilutė:
 *   vienas šaltinis → „Išsiųsime per 1–2 d. d.“, keli šaltiniai (AV + tiekėjas / 2 tiekėjai) → „Išsiųsime per 3 d. d.“ (be paaiškinimų — R 2026-09-25).
 *   Šaltinių prognozė — ta pati logika kaip Petshop_AV_Order::fiksuoti (resolve → ar mišrus → parinkti), tik skaitymas.
 *   Maketas: S1720_maketas_2.17_pristatymo_pazadas_2026-09-25.md (v3). Išjungti visą: opcija ps_pristatymo_pazadas_isjungtas=1; tik €/kg: ps_kg_isjungta=1.
 * Version: 1.0
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

final class Petshop_Pristatymo_Pazadas {
	const TERMINAS_PREKE  = 'Išsiunčiame per 1–2 d. d.';
	const TERMINAS_VIENAS = 'Išsiųsime per 1–2 d. d.';
	const TERMINAS_MISRUS = 'Išsiųsime per 3 d. d.';
	const PASTOMATO_RIBA_KG = 25.0;
	/** Kategorijų slug'ų fragmentai, kur rodomas €/kg. */
	const KG_KATEGORIJOS = array( 'sausas', 'kraik' );

	private static $krepselio = null; // cache per užklausą

	public static function init() {
		if ( get_option( 'ps_pristatymo_pazadas_isjungtas' ) ) { return; }
		if ( is_admin() && ! wp_doing_ajax() ) { return; }
		add_filter( 'woocommerce_get_stock_html', array( __CLASS__, 'stock_html' ), 30, 2 );
		if ( ! get_option( 'ps_kg_isjungta' ) ) {
			add_action( 'woocommerce_single_product_summary', array( __CLASS__, 'kg' ), 10 ); // iškart po kainos (kaina prio 10, registruota anksčiau)
		}
		add_action( 'woocommerce_cart_totals_before_order_total', array( __CLASS__, 'krepselyje' ), 6 );      // po nemokamo pristatymo juostos (prio 5)
		add_action( 'woocommerce_review_order_before_shipping', array( __CLASS__, 'apmokejime' ), 10 );
		add_action( 'woocommerce_widget_shopping_cart_before_buttons', array( __CLASS__, 'mini' ), 6 );
		add_action( 'wp_head', array( __CLASS__, 'css' ), 50 );
	}

	/* ------------------------------------------------------------------ */
	/* Pristatymo kainos (iš schema konstantų, kad nesiskirtų)              */
	/* ------------------------------------------------------------------ */
	private static function kainos() {
		$c = class_exists( 'Petshop_Schema_Prekes' );
		return array(
			'pastomatas' => $c ? Petshop_Schema_Prekes::PASTOMATAS_CT / 100 : 2.15,
			'kurjeris'   => $c ? Petshop_Schema_Prekes::KURJERIS_CT / 100 : 3.99,
			'nemokamas'  => $c ? Petshop_Schema_Prekes::NEMOKAMAS_NUO_CT / 100 : 30.0,
		);
	}
	private static function eur( $v ) { return number_format( (float) $v, 2, ',', '' ) . ' €'; }

	private static function pastomato_riba() {
		return ( class_exists( 'Petshop_Rinkiniai' ) && defined( 'Petshop_Rinkiniai::PASTOMATO_RIBA' ) ) ? (float) Petshop_Rinkiniai::PASTOMATO_RIBA : self::PASTOMATO_RIBA_KG;
	}

	/** Ar prekė gali į paštomatą (svoris ir varnelė „Tik kurjeriu“). */
	private static function telpa_i_pastomata( WC_Product $p ) {
		$pid = $p->get_parent_id() ? $p->get_parent_id() : $p->get_id();
		if ( get_post_meta( $pid, '_ps_tik_kurjeriu', true ) === 'yes' || get_post_meta( $p->get_id(), '_ps_tik_kurjeriu', true ) === 'yes' ) { return false; }
		$w = (float) $p->get_weight();
		return ! ( $w > self::pastomato_riba() );
	}

	/* ------------------------------------------------------------------ */
	/* (1) Prekės puslapis — po „Turime“                                     */
	/* ------------------------------------------------------------------ */
	public static function stock_html( $html, $product ) {
		if ( ! is_a( $product, 'WC_Product' ) || ! is_product() ) { return $html; }
		if ( ! $product->is_in_stock() || ! $product->is_purchasable() ) { return $html; }
		if ( $product->is_type( 'variable' ) || $product->is_type( 'mix-and-match' ) || $product->is_type( 'grouped' ) ) { return $html; }
		if ( class_exists( 'Petshop_Laukai' ) && method_exists( 'Petshop_Laukai', 'yra_laukas' ) ) {
			global $post; if ( $post && Petshop_Laukai::yra_laukas( $post->ID ) ) { return $html; }
		}
		$k = self::kainos();
		$kaina = (float) wc_get_price_to_display( $product );
		if ( self::telpa_i_pastomata( $product ) ) {
			$eil2 = ( $kaina >= $k['nemokamas'] )
				? 'Į paštomatą nemokamai · kurjeriu ' . self::eur( $k['kurjeris'] )
				: 'Į paštomatą ' . self::eur( $k['pastomatas'] ) . ' · nemokamai nuo ' . self::eur( $k['nemokamas'] ) . ' · kurjeriu ' . self::eur( $k['kurjeris'] );
		} else {
			$eil2 = 'Pristatymas kurjeriu ' . self::eur( $k['kurjeris'] );
		}
		$html .= '<div class="ps-pazadas"><p class="ps-pazadas-1">' . self::ikona_sunkvezimis() . esc_html( self::TERMINAS_PREKE ) . '</p><p class="ps-pazadas-2">' . esc_html( $eil2 ) . '</p></div>';
		return $html;
	}

	/* ------------------------------------------------------------------ */
	/* (2) €/kg                                                              */
	/* ------------------------------------------------------------------ */
	public static function kg() {
		global $product;
		if ( ! is_a( $product, 'WC_Product' ) || ! is_product() ) { return; }
		if ( $product->is_type( 'mix-and-match' ) || $product->is_type( 'variable' ) ) { return; }
		if ( class_exists( 'Petshop_Laukai' ) && method_exists( 'Petshop_Laukai', 'yra_laukas' ) ) { global $post; if ( $post && Petshop_Laukai::yra_laukas( $post->ID ) ) { return; } }
		if ( ! self::kg_kategorija( $product->get_id() ) ) { return; }
		$kg = self::svoris_is_pavadinimo( $product->get_name(), $product->get_id() );
		if ( $kg < 1 ) { return; }
		$kaina = (float) wc_get_price_to_display( $product );
		if ( $kaina <= 0 ) { return; }
		echo '<p class="ps-kg">' . esc_html( self::eur( $kaina / $kg ) ) . '/kg</p>';
	}

	public static function kg_kategorija( $pid ) {
		$terms = get_the_terms( $pid, 'product_cat' );
		if ( ! $terms || is_wp_error( $terms ) ) { return false; }
		foreach ( $terms as $t ) {
			foreach ( self::KG_KATEGORIJOS as $k ) { if ( false !== strpos( $t->slug, $k ) ) { return true; } }
		}
		return false;
	}

	/** Svoris kg iš pavadinimo: „12 kg“, „1,5 kg“, „800 g“, „10+1kg“ → 11, DP pakas „2 vnt. … 2 kg“ → 4. 0 = nerasta. */
	public static function svoris_is_pavadinimo( $pav, $pid = 0 ) {
		$pav = mb_strtolower( html_entity_decode( (string) $pav, ENT_QUOTES, 'UTF-8' ) );
		if ( ! preg_match_all( '/(\d+(?:[.,]\d+)?)(?:\s*\+\s*(\d+(?:[.,]\d+)?))?\s*(kg|g)\b/u', $pav, $m, PREG_SET_ORDER ) ) { return 0.0; }
		$x = end( $m );
		$v = (float) str_replace( ',', '.', $x[1] ) + ( '' !== $x[2] ? (float) str_replace( ',', '.', $x[2] ) : 0 );
		$kg = ( 'g' === $x[3] ) ? $v / 1000 : $v;
		$n = 1;
		if ( $pid && class_exists( 'Petshop_AV_Source' ) && method_exists( 'Petshop_AV_Source', 'dp' ) ) { $dp = Petshop_AV_Source::dp( $pid ); if ( $dp ) { $n = (int) $dp['n']; } }
		elseif ( preg_match( '/^(\d+)\s*vnt\./u', $pav, $mm ) ) { $n = (int) $mm[1]; }
		return $kg * max( 1, $n );
	}

	/* ------------------------------------------------------------------ */
	/* (3) Krepšelio pažadas — šaltinių prognozė                             */
	/* ------------------------------------------------------------------ */
	/** Grąžina 'vienas' | 'misrus' | '' (nerodyti). */
	public static function krepselio_pazadas() {
		if ( null !== self::$krepselio ) { return self::$krepselio; }
		self::$krepselio = '';
		if ( ! function_exists( 'WC' ) || ! WC()->cart || WC()->cart->is_empty() ) { return ''; }
		if ( ! class_exists( 'Petshop_AV_Source' ) || ! method_exists( 'Petshop_AV_Source', 'resolve' ) ) { return ''; }
		$eilutes = array();
		foreach ( WC()->cart->get_cart() as $ci ) {
			$p = $ci['data'] ?? null;
			if ( ! $p || ! is_a( $p, 'WC_Product' ) ) { continue; }
			if ( $p->is_type( 'mix-and-match' ) ) { continue; } // konteineris — likutį lemia vaikai (jie krepšelyje atskiromis eilutėmis)
			$pid = (int) ( $ci['product_id'] ?? $p->get_id() );
			if ( ! $pid ) { continue; }
			$eilutes[] = array( 'pid' => $pid, 'qty' => max( 1, (int) ( $ci['quantity'] ?? 1 ) ) );
		}
		if ( ! $eilutes ) { return ''; }
		try {
			// 1) ar mišrus — kaip Petshop_AV_Source::ar_misrus (pagal tiekėją)
			$av = false; $tiek = false; $rez = array();
			foreach ( $eilutes as $i => $e ) {
				$r = Petshop_AV_Source::resolve( $e['pid'], $e['qty'] );
				$rez[ $i ] = $r;
				$t = isset( $r['tiekejas'] ) ? $r['tiekejas'] : 'av';
				if ( 'av' === $t || 'legacy' === $t ) { $av = true; } else { $tiek = true; }
			}
			$misrus = $av && $tiek;
			// 2) galutinis šaltinis kiekvienai eilutei — kaip fiksuoti()
			$saltiniai = array();
			foreach ( $eilutes as $i => $e ) {
				$x = method_exists( 'Petshop_AV_Source', 'parinkti' ) ? Petshop_AV_Source::parinkti( $e['pid'], $e['qty'], $misrus ) : $rez[ $i ];
				$s = isset( $x['source'] ) ? (string) $x['source'] : 'av';
				if ( 'legacy' === $s ) { $s = 'av'; }
				$saltiniai[ $s ] = 1;
			}
			self::$krepselio = ( count( $saltiniai ) >= 2 ) ? 'misrus' : 'vienas';
		} catch ( Throwable $e ) { self::$krepselio = ''; }
		return self::$krepselio;
	}

	private static function eilute( $klase = '' ) {
		$k = self::krepselio_pazadas();
		if ( ! $k ) { return ''; }
		$t = ( 'misrus' === $k ) ? self::TERMINAS_MISRUS : self::TERMINAS_VIENAS;
		return '<div class="ps-pazadas-krepselis ' . esc_attr( $klase ) . '" data-ps="' . esc_attr( $k ) . '">' . self::ikona_laikrodis() . esc_html( $t ) . '</div>';
	}

	public static function krepselyje() { if ( ! is_cart() ) { return; } $h = self::eilute( 'ps-pz-cart' ); if ( $h ) { echo '<tr class="ps-pazadas-tr"><td colspan="2">' . $h . '</td></tr>'; } }
	public static function apmokejime() { $h = self::eilute( 'ps-pz-checkout' ); if ( $h ) { echo '<tr class="ps-pazadas-tr"><td colspan="2">' . $h . '</td></tr>'; } }
	public static function mini() { echo self::eilute( 'ps-pz-mini' ); }

	/* ------------------------------------------------------------------ */
	private static function ikona_sunkvezimis() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/></svg>'; }
	private static function ikona_laikrodis() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>'; }

	public static function css() {
		// mini-krepšelis rodomas visur → CSS visur (0,9 KB)
		echo '<style id="ps-pazadas-css">.ps-pazadas{margin:2px 0 10px}.ps-pazadas p{margin:0 0 3px;font-size:13.5px;color:#555;line-height:1.5}.ps-pazadas-1{display:flex;align-items:center;gap:7px}.ps-pazadas svg{width:16px;height:16px;flex:none;stroke:#555;fill:none;stroke-width:1.8}.ps-pazadas-2{color:#777;font-size:13px;padding-left:23px}.ps-kg{font-size:13px;color:#777;margin:-6px 0 12px}.ps-pazadas-krepselis{display:flex;align-items:center;gap:8px;background:#f5f6f5;padding:9px 14px;font-size:13.5px;color:#333;margin:8px 0 0}.ps-pazadas-krepselis svg{width:16px;height:16px;flex:none;stroke:#2f5b4c;fill:none;stroke-width:1.9}.ps-pazadas-tr td{padding:0!important;border:0!important}.ps-pz-checkout{margin:6px 0 10px}.ps-pz-mini{margin:6px 0 8px;font-size:12.5px;padding:7px 10px}</style>';
	}
}
add_action( 'init', array( 'Petshop_Pristatymo_Pazadas', 'init' ), 20 );
