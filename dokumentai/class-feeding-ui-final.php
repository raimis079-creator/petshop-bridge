<?php
/**
 * Petshop_Feeding_UI — REST endpoint + augintinio puslapio maitinimo vaizdas (F1).
 * VISOS sąsajos kviečia tik Petshop_Feeding_Service. Jokios atskiros formulės čia.
 *
 * REST: POST petshop/v1/feeding/calculate
 *   product_id (privaloma)
 *   pet_id     (prisijungęs; ownership tikrinama serveryje)
 *   weight_kg  (svečias; laikinas, nesaugomas)
 * Rūšies validacija ir nuosavybė — serveryje, ne UI.
 */
if ( ! class_exists( 'Petshop_Feeding_UI' ) ) {
class Petshop_Feeding_UI {

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		// F1 vertikalus pjūvis: matomas feeding blokas augintinio puslapyje (server-render, be JS priklausomybės)
		add_action( 'woocommerce_account_augintinis_endpoint', array( __CLASS__, 'render_pet_feeding' ), 99 );
		add_shortcode( 'petshop_feeding_demo', array( __CLASS__, 'shortcode_feeding' ) );
	}

	/** F1 demo: prisijungusio vartotojo aktyvaus augintinio porcija validuotam ?product_id= produktui, BE rankinio įvedimo. */
	public static function render_pet_feeding() {
		echo self::build_pet_feeding_html();
	}
	public static function shortcode_feeding() {
		return self::build_pet_feeding_html();
	}
	/**
	 * F1 demo įjungimas: eksplicitinė konstanta viršesnė; kitaip tik dev hoste (dev.avesa.lt).
	 * Production (petshop.lt) — OFF automatiškai, net po DB migracijos (gate pagal HTTP host, ne DB/config).
	 */
	protected static function feeding_demo_enabled() {
		if ( defined( 'PETSHOP_FEEDING_F1_DEMO' ) ) { return (bool) PETSHOP_FEEDING_F1_DEMO; }
		// Kanoninis svetainės hostas iš home_url() (ne kliento $_SERVER['HTTP_HOST'] — tas spoofinamas).
		$host = strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) );
		return ( $host === 'dev.avesa.lt' );
	}

	protected static function build_pet_feeding_html() {
		if ( ! is_user_logged_in() ) { return ''; }
		// F1 vertikalus pjūvis: dev-only demo (host-gated), production OFF. Nuolatinė integracija — F3.
		if ( ! self::feeding_demo_enabled() ) { return ''; }

		// Produktas TIK iš serverio validuoto ?product_id= (jokio hardcode).
		$product_id = isset( $_GET['product_id'] ) ? absint( $_GET['product_id'] ) : 0;
		if ( ! $product_id ) { return ''; }
		$product = wc_get_product( $product_id );
		if ( ! $product || $product->get_status() !== 'publish' ) { return ''; }
		// Feeding scope validacija: dog(72) / cat(81).
		$cats = wp_get_post_terms( $product_id, 'product_cat', array( 'fields' => 'ids' ) );
		if ( is_wp_error( $cats ) || ! ( in_array( 72, (array) $cats, true ) || in_array( 81, (array) $cats, true ) ) ) { return ''; }

		global $wpdb;
		$uid = get_current_user_id();
		$pet = $wpdb->get_row( $wpdb->prepare(
			"SELECT id, pet_name, species, current_weight_kg FROM {$wpdb->prefix}ps_pets
			 WHERE user_id = %d AND status = 'active' AND current_weight_kg IS NOT NULL AND current_weight_kg > 0
			 ORDER BY id ASC LIMIT 1", $uid ), ARRAY_A );
		if ( ! $pet ) { return ''; }

		$res = Petshop_Feeding_Service::evaluate( array(
			'product_id'    => $product_id,
			'quantity'      => 1,
			'usage_context' => 'catalog',
			'pet_input'     => array( 'current_weight_kg' => (float) $pet['current_weight_kg'], 'conditions' => array() ),
			'price_context' => null,
		) );
		$pname = $product->get_name();
		if ( ( $res['status'] ?? '' ) !== 'ok' && ( $res['status'] ?? '' ) !== 'partial' ) { return ''; }

		$fmt = function( $r, $dec, $unit ) {
			if ( ! $r ) { return null; }
			$f = function( $x ) use ( $dec ) { return str_replace( '.', ',', number_format( (float) $x, $dec, '.', '' ) ); };
			$s = ( $r['min'] == $r['max'] ) ? $f( $r['min'] ) : ( $f( $r['min'] ) . "\xe2\x80\x93" . $f( $r['max'] ) );
			return $s . ( $unit ? ( "\xc2\xa0" . $unit ) : '' );
		};
		$portion = $fmt( $res['portion_g'], 0, 'g' );
		$dur     = $fmt( $res['duration_days'], 0, '' );
		$epd     = $fmt( $res['eur_per_day'], 2, "\xe2\x82\xac" );
		$epm     = $fmt( $res['eur_per_month'], 2, "\xe2\x82\xac" );
		$petname = esc_html( $pet['pet_name'] ? $pet['pet_name'] : 'Augintinis' );
		$wtxt    = str_replace( '.', ',', rtrim( rtrim( number_format( (float) $pet['current_weight_kg'], 2, '.', '' ), '0' ), '.' ) );
		$NBSP = " "; $DASH = "–"; $BULL = "•"; $EUR = "€";

		$h  = '<div id="ps-pet-feeding" style="border:1px solid #e2e2e2;border-radius:8px;padding:16px;margin:16px 0;max-width:460px;">';
		$h .= '<div style="font-weight:600;margin-bottom:4px;">' . esc_html( "Šėrimo rekomendacija" ) . '</div>';
		$h .= '<div style="font-size:13px;color:#666;margin-bottom:10px;">' . $petname . ' (' . esc_html( $wtxt ) . $NBSP . 'kg) ' . $BULL . ' ' . esc_html( $pname ) . '</div>';
		if ( $portion ) { $h .= '<div><strong>Dienos porcija:</strong> ' . $portion . '</div>'; }
		if ( $dur )     { $h .= '<div style="margin-top:6px;"><strong>Pakuotės užteks:</strong> apie ' . $dur . $NBSP . 'd.</div>'; }
		if ( $epd )     { $h .= '<div style="margin-top:6px;"><strong>Kaina:</strong> ' . $epd . '/d.' . ( $epm ? ( ' ' . $BULL . ' ' . $epm . '/30' . $NBSP . 'd.' ) : '' ) . '</div>'; }
		$h .= '<div style="font-size:12px;color:#888;margin-top:10px;">Apskaičiuota pagal gamintojo lentelę ir jūsų augintinio svorį iš profilio.</div>';
		$h .= '</div>';
		return $h;
	}

	public static function register_routes() {
		register_rest_route( 'petshop/v1', '/feeding/calculate', array(
			'methods'             => 'POST',
			'callback'            => array( __CLASS__, 'handle_calculate' ),
			'permission_callback' => '__return_true', // vidinė logika tikrina login/ownership pagal pet_id buvimą
		) );
	}

	/** ps_pets svoris + rūšis pagal pet_id, TIK jei priklauso prisijungusiam vartotojui. */
	protected static function get_owned_pet( $pet_id ) {
		global $wpdb;
		$uid = get_current_user_id();
		if ( ! $uid ) { return array( 'error' => 'NOT_LOGGED_IN' ); }
		$pet = $wpdb->get_row( $wpdb->prepare(
			"SELECT id, user_id, species, current_weight_kg, status FROM {$wpdb->prefix}ps_pets WHERE id = %d",
			(int) $pet_id ), ARRAY_A );
		// 403 be informacijos apie egzistavimą: tas pats atsakymas ir kai nėra, ir kai svetimas
		if ( ! $pet || (int) $pet['user_id'] !== (int) $uid || $pet['status'] === 'deleted' ) {
			return array( 'error' => 'FORBIDDEN' );
		}
		return array( 'pet' => $pet );
	}

	/** Rūšies validacija: dog→cat 72, cat→cat 81 (deterministinė, serveryje). */
	protected static function species_matches_product( $species, $product_id ) {
		$cats = wp_get_object_terms( (int) $product_id, 'product_cat', array( 'fields' => 'ids' ) );
		$cats = is_wp_error( $cats ) ? array() : array_map( 'intval', $cats );
		$in72 = in_array( 72, $cats, true );
		$in81 = in_array( 81, $cats, true );
		if ( $in72 && $in81 ) { return 'AMBIGUOUS_SPECIES_SCOPE'; }
		if ( $species === 'dog' && $in72 ) { return 'ok'; }
		if ( $species === 'cat' && $in81 ) { return 'ok'; }
		if ( ! $in72 && ! $in81 ) { return 'UNSUPPORTED_SPECIES_SCOPE'; }
		return 'SPECIES_MISMATCH';
	}

	public static function handle_calculate( $request ) {
		$product_id = (int) $request->get_param( 'product_id' );
		$pet_id     = $request->get_param( 'pet_id' );
		$weight_in  = $request->get_param( 'weight_kg' );

		if ( ! $product_id ) {
			return new WP_REST_Response( array( 'status' => 'unavailable', 'issues' => array( array( 'code' => 'NO_PRODUCT' ) ) ), 400 );
		}

		$weight = null; $species = null; $used_pet = null;

		if ( $pet_id !== null && $pet_id !== '' ) {
			// PRISIJUNGĘS kelias — ownership serveryje
			$res = self::get_owned_pet( $pet_id );
			if ( isset( $res['error'] ) ) {
				$code = $res['error'] === 'NOT_LOGGED_IN' ? 401 : 403;
				return new WP_REST_Response( array( 'status' => 'unavailable', 'issues' => array( array( 'code' => $res['error'] ) ) ), $code );
			}
			$pet = $res['pet'];
			$species = $pet['species'];
			$weight = ( $pet['current_weight_kg'] !== null && $pet['current_weight_kg'] !== '' ) ? (float) $pet['current_weight_kg'] : null;
			$used_pet = (int) $pet['id'];

			// rūšies validacija
			$sp = self::species_matches_product( $species, $product_id );
			if ( $sp !== 'ok' ) {
				return new WP_REST_Response( array( 'status' => 'unavailable', 'issues' => array( array( 'code' => $sp ) ) ), 200 );
			}
		} else {
			// SVEČIO kelias — laikinas svoris, nesaugomas, jokio pet_id
			if ( $weight_in !== null && $weight_in !== '' ) {
				$weight = (float) str_replace( ',', '.', (string) $weight_in );
			}
		}

		$result = Petshop_Feeding_Service::evaluate( array(
			'product_id'    => $product_id,
			'quantity'      => 1,
			'usage_context' => 'catalog',
			'pet_input'     => array( 'current_weight_kg' => $weight, 'conditions' => array() ),
			'price_context' => null,
		) );
		$result['used_pet_id'] = $used_pet;
		return new WP_REST_Response( $result, 200 );
	}
}
Petshop_Feeding_UI::init();
}
