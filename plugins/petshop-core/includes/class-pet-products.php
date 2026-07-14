<?php
/**
 * Petshop_Pet_Products — produkto priskyrimas augintiniui (M8).
 *
 * DB: gaj6_ps_pet_products. Sieja augintini su produktais (lentynelei, refill, rekomendacijoms).
 * "Reksui skirtas Josera SensiPlus" — kad kelioms augintiniu seimoje refill butu tikslus.
 *
 * relationship_type: primary_food | treat | supplement | care | other
 * source: user (rankinis) | order_inference (is uzsakymo) | admin
 *
 * REST:
 *   POST /petshop/v1/pet-product-link   priskirti produkta augintiniui
 *   GET  /petshop/v1/pet-product-link?pet_id=N   augintinio produktai (lentynele)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Pet_Products {

	const RELATIONSHIP_TYPES = array( 'primary_food', 'treat', 'supplement', 'care', 'other' );
	const SOURCES = array( 'user', 'order_inference', 'admin' );

	public static function table_name() {
		global $wpdb;
		return $wpdb->prefix . 'ps_pet_products';
	}

	public static function install() {
		global $wpdb;
		$table = self::table_name();
		$charset = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE `$table` (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			pet_id BIGINT UNSIGNED NOT NULL,
			user_id BIGINT UNSIGNED NOT NULL,
			product_id BIGINT UNSIGNED NOT NULL,
			sku VARCHAR(64) NULL,
			relationship_type VARCHAR(24) NOT NULL DEFAULT 'other',
			source VARCHAR(24) NOT NULL DEFAULT 'user',
			confidence DECIMAL(3,2) NOT NULL DEFAULT 1.00,
			last_order_id BIGINT UNSIGNED NULL,
			last_purchased_at DATETIME NULL,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY uq_pet_product (pet_id, product_id),
			KEY idx_pet (pet_id),
			KEY idx_user (user_id),
			KEY idx_pet_reltype (pet_id, relationship_type)
		) $charset";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	public static function maybe_install() {
		global $wpdb;
		if ( ! $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", self::table_name() ) ) ) {
			self::install();
		}
	}

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
	}

	public static function register_routes() {
		register_rest_route( 'petshop/v1', '/pet-product-link', array(
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'handle_link' ),
				'permission_callback' => 'is_user_logged_in',
			),
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'handle_list' ),
				'permission_callback' => 'is_user_logged_in',
			),
		) );
	}

	/**
	 * POST /pet-product-link — priskiria produkta augintiniui.
	 * Body: pet_id, product_id, relationship_type (nebutina, default 'other')
	 */
	public static function handle_link( $request ) {
		$user_id = get_current_user_id();
		$pet_id = (int) $request->get_param( 'pet_id' );
		$product_id = (int) $request->get_param( 'product_id' );
		$rel = sanitize_text_field( (string) $request->get_param( 'relationship_type' ) );
		if ( ! in_array( $rel, self::RELATIONSHIP_TYPES, true ) ) {
			$rel = 'other';
		}

		if ( ! $pet_id || ! $product_id ) {
			return new WP_Error( 'invalid', 'Trūksta pet_id arba product_id.', array( 'status' => 400 ) );
		}

		// IDOR: patikrinam kad pet priklauso user'iui
		if ( class_exists( 'Petshop_Pet_Profile' ) ) {
			$pet = Petshop_Pet_Profile::get_pet( $pet_id );
			if ( ! $pet || (int) $pet->user_id !== $user_id || $pet->status === 'deleted' ) {
				return new WP_Error( 'not_found', 'Augintinis nerastas.', array( 'status' => 404 ) );
			}
		}

		$product = wc_get_product( $product_id );
		$sku = $product ? $product->get_sku() : null;

		global $wpdb;
		$now = gmdate( 'Y-m-d H:i:s' );

		// UNIQUE(pet_id, product_id) — jei jau yra, atnaujinam relationship_type
		$existing = $wpdb->get_row( $wpdb->prepare(
			"SELECT id FROM `" . self::table_name() . "` WHERE pet_id=%d AND product_id=%d",
			$pet_id, $product_id
		) );

		if ( $existing ) {
			$wpdb->update( self::table_name(), array(
				'relationship_type' => $rel,
				'source'            => 'user',
				'confidence'        => 1.00,
				'updated_at'        => $now,
			), array( 'id' => $existing->id ) );
			$link_id = (int) $existing->id;
		} else {
			$wpdb->insert( self::table_name(), array(
				'pet_id'            => $pet_id,
				'user_id'           => $user_id,
				'product_id'        => $product_id,
				'sku'               => $sku,
				'relationship_type' => $rel,
				'source'            => 'user',
				'confidence'        => 1.00,
				'created_at'        => $now,
				'updated_at'        => $now,
			) );
			$link_id = (int) $wpdb->insert_id;
		}

		// Event
		if ( class_exists( 'Petshop_Event_Registry' ) ) {
			$user = get_user_by( 'id', $user_id );
			if ( $user ) {
				Petshop_Event_Registry::emit( 'pet_product_assigned', $user->user_email, array(
					'pet_id'            => $pet_id,
					'product_id'        => $product_id,
					'relationship_type' => $rel,
				), array( 'event_id' => 'pet_prod_' . $pet_id . '_' . $product_id . '_' . time() ) );
			}
		}

		return rest_ensure_response( array( 'ok' => true, 'link_id' => $link_id ) );
	}

	/**
	 * GET /pet-product-link?pet_id=N — augintinio produktai (lentynele).
	 */
	public static function handle_list( $request ) {
		$user_id = get_current_user_id();
		$pet_id = (int) $request->get_param( 'pet_id' );
		if ( ! $pet_id ) {
			return new WP_Error( 'invalid', 'Trūksta pet_id.', array( 'status' => 400 ) );
		}
		// IDOR
		if ( class_exists( 'Petshop_Pet_Profile' ) ) {
			$pet = Petshop_Pet_Profile::get_pet( $pet_id );
			if ( ! $pet || (int) $pet->user_id !== $user_id ) {
				return new WP_Error( 'not_found', 'Augintinis nerastas.', array( 'status' => 404 ) );
			}
		}

		global $wpdb;
		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM `" . self::table_name() . "` WHERE pet_id=%d ORDER BY
			 FIELD(relationship_type,'primary_food','treat','supplement','care','other'), last_purchased_at DESC",
			$pet_id
		) );

		// Papildom produktu duomenimis (nuotrauka, pavadinimas, kaina)
		$products = array();
		foreach ( $rows as $row ) {
			$p = wc_get_product( $row->product_id );
			if ( ! $p ) {
				continue;
			}
			$img_id = $p->get_image_id();
			$products[] = array(
				'product_id'        => (int) $row->product_id,
				'name'              => $p->get_name(),
				'sku'               => $row->sku,
				'relationship_type' => $row->relationship_type,
				'price'             => $p->get_price(),
				'image'             => $img_id ? wp_get_attachment_image_url( $img_id, 'thumbnail' ) : null,
				'in_stock'          => $p->is_in_stock(),
				'last_purchased_at' => $row->last_purchased_at,
				'permalink'         => get_permalink( $row->product_id ),
			);
		}

		return rest_ensure_response( array( 'ok' => true, 'products' => $products ) );
	}

	/**
	 * Auto-priskyrimas is uzsakymo (kviesti is order_paid, jei vienas augintinis).
	 * Jei user turi TIK VIENA tos rusies augintini — priskiriam automatiskai (confidence 0.7).
	 */
	public static function infer_from_order( $user_id, $product_id, $order_id, $sku = null ) {
		if ( ! class_exists( 'Petshop_Pet_Profile' ) ) {
			return;
		}
		global $wpdb;
		// Kiek aktyviu augintiniu turi user?
		$pets = $wpdb->get_results( $wpdb->prepare(
			"SELECT id, species FROM `" . Petshop_Pet_Profile::table_name() . "` WHERE user_id=%d AND status='active'",
			$user_id
		) );
		if ( count( $pets ) !== 1 ) {
			return;  // 0 arba keli — negalim automatiskai priskirti (klausiam UI)
		}
		$pet_id = (int) $pets[0]->id;
		$now = gmdate( 'Y-m-d H:i:s' );

		$existing = $wpdb->get_row( $wpdb->prepare(
			"SELECT id, source FROM `" . self::table_name() . "` WHERE pet_id=%d AND product_id=%d",
			$pet_id, $product_id
		) );
		if ( $existing ) {
			// Jei user jau rankiniu budu priskyre — neperrasom
			if ( $existing->source === 'user' ) {
				$wpdb->update( self::table_name(), array(
					'last_order_id' => $order_id, 'last_purchased_at' => $now, 'updated_at' => $now,
				), array( 'id' => $existing->id ) );
				return;
			}
			$wpdb->update( self::table_name(), array(
				'last_order_id' => $order_id, 'last_purchased_at' => $now, 'updated_at' => $now,
			), array( 'id' => $existing->id ) );
		} else {
			$wpdb->insert( self::table_name(), array(
				'pet_id'            => $pet_id,
				'user_id'           => $user_id,
				'product_id'        => $product_id,
				'sku'               => $sku,
				'relationship_type' => 'other',
				'source'            => 'order_inference',
				'confidence'        => 0.70,
				'last_order_id'     => $order_id,
				'last_purchased_at' => $now,
				'created_at'        => $now,
				'updated_at'        => $now,
			) );
		}
	}
}
