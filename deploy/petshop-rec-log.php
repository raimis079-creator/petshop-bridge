<?php
/**
 * Plugin Name: Petshop Rec Log
 * Description: Kontrakto §5 sprendimu zurnalas ir §4.2 rec piltuvelio ivykiai. M8 kodas neliestas — kabinamasi ant REST ir Woo kabliuku.
 * Version: 1.2
 *
 * SPRENDIMO MOMENTAS = GET /petshop/v1/pet-food-candidates/{pet_id}
 * (petshop-m8-food.php `candidates()`): tai vienintele vieta, kur variklis
 * siandien priima rekomendacijos sprendima. Kabliukas per
 * `rest_request_after_callbacks` — todel §5 pavyko be M8 redagavimo.
 *
 * inputs_json — TIK tai, ka dabartinis variklis realiai naudoja (§5.1):
 * `species` ir pirkimu istorijos buvimas. Variklis primityvokas (FeedingPlan
 * dar nera); kai atsiras tikras variklis, inputs plesis, schema jau paruosta.
 *
 * reason_code zodyno PAPILDYMAI (kontraktas: "pleciamas tik pridedant"):
 *   species_unsupported   variklis nepalaiko sios rusies
 *   no_purchase_history   nera pirkimu istorijos, is kurios rinkti kandidatus
 *
 * §4.2 ivykiai:
 *   rec_shown        cia pat (kandidatu atsakymas IR YRA parodymas paskyroje)
 *   rec_add_to_cart  woocommerce_add_to_cart + paskutinio sprendimo transient
 *   rec_purchased    woocommerce_checkout_order_processed (DoD #3)
 * v1.1 KLAIDOS TAISYMAS (rasta verify 2026-08-16): kandidato ID raktas
 * payload'e ne 'id' — ids istraukimas grazino tuscia, nors kandidatu buvo.
 * Dabar tikrinami raktai id/product_id/ID, o kandidatu_sk = count(candidates)
 * nepriklausomai nuo ids istraukimo (jei raktu nera — rasoma su ok ir
 * parodyti_ids [], bet skaicius teisingas).
 *
 * v1.2: logina ir NAUJA VARIKLI /pet-recommendations/{id} — engine_version,
 * inputs, rezultatas, reason imami is paties variklio atsakymo (tikslesni nei
 * spejimas kabliuke); senas /pet-food-candidates kelias nepakito.
 *
 *   rec_clicked      ATIDETA: reikia M8 dashboard zymejimo (atskiras GO)
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Rec_Log {

	const VERSIJA        = '1.2';
	const ENGINE_VERSION = 'm8food_v1';
	const TRANS_TTL      = 1800; /* 30 min sprendimo -> pirkimo susiejimui */

	public static function init() {
		add_filter( 'rest_request_after_callbacks', array( __CLASS__, 'po' ), 20, 3 );
		add_action( 'woocommerce_add_to_cart', array( __CLASS__, 'i_krepseli' ), 20, 6 );
		add_action( 'woocommerce_checkout_order_processed', array( __CLASS__, 'pirkta' ), 20, 3 );
	}

	private static function galima() {
		return class_exists( 'Petshop_Statistika' ) && class_exists( 'Petshop_Pet_Kontraktas' );
	}

	public static function lentele() { global $wpdb; return $wpdb->prefix . 'ps_rec_log'; }

	private static function rec_id() {
		return substr( dechex( time() ) . bin2hex( random_bytes( 8 ) ), 0, 20 );
	}

	private static function ivykis( $tipas, $verte, $uid ) {
		if ( ! class_exists( 'Petshop_Statistika' ) ) { return; }
		Petshop_Statistika::irasyti( $tipas, array(
			'sritis' => 'rec', 'verte' => $verte, 'user_id' => (int) $uid,
		) );
	}

	/* ==================== §5: SPRENDIMO LOG ==================== */

	public static function po( $response, $handler, $request ) {
		if ( ! self::galima() ) { return $response; }
		$route = $request->get_route();
		if ( ! preg_match( '#^/petshop/v1/(pet-food-candidates|pet-recommendations)/(\d+)$#', $route, $m ) ) { return $response; }
		if ( is_wp_error( $response ) ) { return $response; }
		if ( $response instanceof WP_REST_Response && $response->get_status() >= 400 ) { return $response; }

		global $wpdb;
		$pet_id = (int) $m[2];
		$uid    = get_current_user_id();
		$data   = ( $response instanceof WP_REST_Response ) ? $response->get_data() : array();
		if ( ! is_array( $data ) ) { return $response; }

		$kandidatai = ( isset( $data['candidates'] ) && is_array( $data['candidates'] ) ) ? $data['candidates'] : array();
		$ids = array();
		foreach ( $kandidatai as $c ) {
			if ( ! is_array( $c ) ) { continue; }
			foreach ( array( 'id', 'product_id', 'ID' ) as $rk ) {
				if ( isset( $c[ $rk ] ) && is_numeric( $c[ $rk ] ) ) { $ids[] = (int) $c[ $rk ]; break; }
			}
		}

		$pet = $wpdb->get_row( $wpdb->prepare(
			"SELECT species, is_test FROM {$wpdb->prefix}ps_pets WHERE id=%d", $pet_id ), ARRAY_A );

		$engine = isset( $data['engine_version'] ) ? sanitize_key( $data['engine_version'] ) : self::ENGINE_VERSION;
		if ( isset( $data['inputs'] ) && is_array( $data['inputs'] ) ) {
			$inputs = $data['inputs']; /* variklis pats sako, ka naudojo (§5.1) */
		} else {
			$inputs = array( 'species' => $pet ? $pet['species'] : null );
		}
		$inputs_json = wp_json_encode( $inputs );

		if ( isset( $data['rezultatas'] ) && in_array( $data['rezultatas'], array( 'ok', 'fallback', 'failed' ), true ) ) {
			$rezultatas = $data['rezultatas'];
			$reason = ( ! empty( $data['reason'] ) ) ? substr( sanitize_key( $data['reason'] ), 0, 32 ) : null;
		} else {
			$rezultatas = $kandidatai ? 'ok' : 'failed';
			$reason = null;
			if ( ! $kandidatai ) {
				$reason = ( isset( $data['reason'] ) && $data['reason'] === 'species_unsupported' )
					? 'species_unsupported' : 'no_purchase_history';
			}
		}

		$rid = self::rec_id();
		$wpdb->insert( self::lentele(), array(
			'recommendation_id' => $rid,
			'pet_id'         => $pet_id,
			'user_id'        => $uid ? $uid : null,
			'laikas'         => current_time( 'mysql', true ),
			'engine_version' => $engine,
			'rezultatas'     => $rezultatas,
			'reason_code'    => $reason,
			'kandidatu_sk'   => count( $kandidatai ),
			'parodyti_ids'   => wp_json_encode( $ids ),
			'inputs_json'    => $inputs_json,
			'input_hash'     => md5( (string) $inputs_json ),
		) );

		/* rec_shown — kandidatu atsakymas ir yra parodymas paskyros lange */
		self::ivykis( 'rec_shown', $rid . ':account', $uid );

		/* susiejimui su krepseliu/pirkimu */
		if ( $uid && $ids ) {
			set_transient( 'ps_rec_last_' . $uid, array( 'rid' => $rid, 'ids' => $ids ), self::TRANS_TTL );
		}

		/* recommendation_id atiduodamas frontend'ui — rec_clicked ateiciai */
		$data['recommendation_id'] = $rid;
		if ( $response instanceof WP_REST_Response ) { $response->set_data( $data ); }
		return $response;
	}

	/* ==================== §4.2: PILTUVELIS ==================== */

	public static function i_krepseli( $key, $product_id, $qty = 1, $var_id = 0, $variation = array(), $item_data = array() ) {
		if ( ! self::galima() ) { return; }
		$uid = get_current_user_id();
		if ( ! $uid ) { return; }
		$t = get_transient( 'ps_rec_last_' . $uid );
		if ( ! is_array( $t ) || empty( $t['ids'] ) ) { return; }
		if ( ! in_array( (int) $product_id, $t['ids'], true ) ) { return; }
		self::ivykis( 'rec_add_to_cart', $t['rid'] . ':' . (int) $product_id, $uid );
	}

	/** DoD #3: order_id <-> recommendation_id. */
	public static function pirkta( $order_id, $posted = array(), $order = null ) {
		if ( ! self::galima() ) { return; }
		$order = $order instanceof WC_Order ? $order : wc_get_order( $order_id );
		if ( ! $order ) { return; }
		$uid = (int) $order->get_customer_id();
		if ( ! $uid ) { return; }
		$t = get_transient( 'ps_rec_last_' . $uid );
		if ( ! is_array( $t ) || empty( $t['ids'] ) ) { return; }
		foreach ( $order->get_items() as $item ) {
			$pid = (int) $item->get_product_id();
			if ( in_array( $pid, $t['ids'], true ) ) {
				self::ivykis( 'rec_purchased', $t['rid'] . ':' . (int) $order_id, $uid );
				delete_transient( 'ps_rec_last_' . $uid );
				return;
			}
		}
	}
}

Petshop_Rec_Log::init();
