<?php
/**
 * Petshop AV Limit v1.1 (S474; S1731 — be likučio valdymo → „nėra") — pardavimo riba iš KELIŲ šaltinių.
 *
 * TREČIAS SLUOKSNIS (REGISTRAS §17.7, §19).
 *
 * PROBLEMA: WooCommerce riboja pagal `_stock` — VIENO šaltinio kiekį.
 * Prekė gali turėti AV 2 ir VF 796, o klientas negalės nupirkti 3, nors realiai yra 798.
 *
 * TAISYKLĖ (Raimis §17.4):
 *   „Klientui likučio išvis nereikia rodyti, principas arba prekė yra arba nėra,
 *    o kai jis renkasi, jis negali paimti minusinio likučio."
 *
 * KĄ DARO:
 *   - bendra riba = AV + tiekėjas (tik toms, kurios turi ABU)
 *   - klientui skaičius NERODOMAS (tik „yra" / „nėra")
 *   - GRYNAI AV prekėms nieko nekeičia — jų `_stock` ir taip teisingas
 *
 * KO NEDARO:
 *   - NEKEIČIA `_stock` reikšmės (sync ją perrašo)
 *   - NEKURIA savo rezervacijų — WooCommerce jau turi (§18.6)
 *
 * SAUGIKLIS: veikia TIK toms prekėms, kurios turi `_own_stock_qty` IR tiekėjo
 * šaltinį. Visoms kitoms — WooCommerce elgiasi kaip anksčiau.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_AV_Limit {

	public static function init() {
		// bendra riba
		add_filter( 'woocommerce_product_get_stock_quantity', [ __CLASS__, 'stock_qty' ], 20, 2 );
		add_filter( 'woocommerce_product_variation_get_stock_quantity', [ __CLASS__, 'stock_qty' ], 20, 2 );
		// „yra / nėra"
		add_filter( 'woocommerce_product_get_stock_status', [ __CLASS__, 'stock_status' ], 20, 2 );
		// S1731: prekė be likučio valdymo neparduodama (nei paprasta, nei variacija)
		add_filter( 'woocommerce_product_get_stock_status', [ __CLASS__, 'be_valdymo' ], 25, 2 );
		add_filter( 'woocommerce_product_variation_get_stock_status', [ __CLASS__, 'be_valdymo' ], 25, 2 );
		// klientui skaičius NERODOMAS
		add_filter( 'woocommerce_get_availability_text', [ __CLASS__, 'availability_text' ], 20, 2 );
		add_filter( 'woocommerce_get_stock_html', [ __CLASS__, 'stock_html' ], 20, 2 );
	}

	/** Ar šiai prekei taikoma dviejų šaltinių logika. */
	protected static function taikoma( $product_id ) {
		if ( ! class_exists( 'Petshop_AV_Stock' ) ) { return false; }
		$av = Petshop_AV_Stock::qty( $product_id );
		if ( null === $av ) { return false; }               // AV neturi — nieko nekeičiam
		if ( ! class_exists( 'Petshop_Fulfillment_Source' ) ) { return false; }
		$s = Petshop_Fulfillment_Source::resolve( (int) $product_id )['source'];
		return ( 'legacy' !== $s );                          // grynai AV — nieko nekeičiam
	}

	/** Bendras kiekis = AV + tiekėjas. */
	public static function stock_qty( $qty, $product ) {
		if ( ! is_a( $product, 'WC_Product' ) ) { return $qty; }
		$pid = $product->get_id();
		if ( ! self::taikoma( $pid ) ) { return $qty; }
		$av = (int) Petshop_AV_Stock::qty( $pid );
		$tiek = (int) $qty;                                  // WC `_stock` = tiekėjo kiekis
		return $av + max( 0, $tiek );
	}

	/** „yra", jei bent vienas šaltinis turi. */
	public static function stock_status( $status, $product ) {
		if ( ! is_a( $product, 'WC_Product' ) ) { return $status; }
		$pid = $product->get_id();
		if ( ! self::taikoma( $pid ) ) { return $status; }
		$av = (int) Petshop_AV_Stock::qty( $pid );
		if ( $av > 0 ) { return 'instock'; }
		return $status;
	}

	/**
	 * S1731 (2026-09-28): prekė be likučio valdymo = „nėra".
	 * #1208: „Stirnos ausis" sukurta per Gavimą su manage_stock=no ir be partijos —
	 * WooCommerce ją laikė neribotai turima ir pardavė 5 vnt., kurių nebuvo.
	 * Išimtys: DP pakai (likutis iš bazinės), paslaugos; rinkiniai/variaciniai tėvai
	 * čia nepatenka (ne simple/variation tipas). Išjungti: opcija `ps_be_valdymo_isjungta`.
	 */
	public static function be_valdymo( $status, $product ) {
		if ( 'outofstock' === $status || ! is_a( $product, 'WC_Product' ) ) { return $status; }
		if ( ! $product->is_type( array( 'simple', 'variation' ) ) ) { return $status; }
		if ( $product->get_manage_stock() ) { return $status; }          // true arba 'parent'
		if ( '' !== (string) $product->get_meta( '_dp_base_product_id' ) ) { return $status; }
		if ( 'paslauga' === strtolower( (string) $product->get_meta( '_ps_sandelis' ) ) ) { return $status; }
		if ( get_option( 'ps_be_valdymo_isjungta' ) ) { return $status; }
		return 'outofstock';
	}

	/** Klientui — be skaičiaus. */
	public static function availability_text( $text, $product ) {
		if ( ! is_a( $product, 'WC_Product' ) ) { return $text; }
		if ( is_admin() && ! wp_doing_ajax() ) { return $text; }
		if ( ! $product->is_in_stock() ) { return $text; }
		// „Turime (127)" → „Turime"
		return preg_replace( '/\s*\(\s*\d+[^)]*\)\s*$/u', '', (string) $text );
	}

	/** Tas pats HTML lygmenyje — jei tema rodo savo variantą. */
	public static function stock_html( $html, $product ) {
		if ( is_admin() && ! wp_doing_ajax() ) { return $html; }
		if ( ! is_a( $product, 'WC_Product' ) || ! $product->is_in_stock() ) { return $html; }
		return preg_replace( '/\s*\(\s*\d+[^)]*\)/u', '', (string) $html );
	}
}
Petshop_AV_Limit::init();
