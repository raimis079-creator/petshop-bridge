<?php
/**
 * Petshop_Pet_Dashboard — "Mano augintinis" ekrano agregatorius (M8, S197).
 *
 * Vienas endpointas grazina VISKA vienam profilio ekranui:
 *   - augintinio info (is ps_pets)
 *   - refill (zied. dienos, spalva, avg intervalas, feedback)
 *   - artimiausi priminimai (laiko juosta)
 *   - lentynele (ps_pet_products su produktu duomenimis)
 *   - mitybos ritmas (pirkimu intervalai)
 *   - profilio pilnumas (%)
 *
 * REST:
 *   GET  /petshop/v1/pet-dashboard/{pet_id}    visas ekranas
 *   POST /petshop/v1/refill-feedback           prognozes grizt. rysys (similar/sooner/later)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Pet_Dashboard {

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
	}

	public static function register_routes() {
		register_rest_route( 'petshop/v1', '/pet-dashboard/(?P<id>\d+)', array(
			'methods'             => 'GET',
			'callback'            => array( __CLASS__, 'handle_dashboard' ),
			'permission_callback' => 'is_user_logged_in',
		) );
		register_rest_route( 'petshop/v1', '/refill-feedback', array(
			'methods'             => 'POST',
			'callback'            => array( __CLASS__, 'handle_refill_feedback' ),
			'permission_callback' => 'is_user_logged_in',
		) );
	}

	/**
	 * GET /pet-dashboard/{pet_id}
	 */
	public static function handle_dashboard( $request ) {
		$user_id = get_current_user_id();
		$pet_id = (int) $request['id'];

		if ( ! class_exists( 'Petshop_Pet_Profile' ) ) {
			return new WP_Error( 'no_backend', 'Backend nepasiekiamas.', array( 'status' => 500 ) );
		}
		$pet = Petshop_Pet_Profile::get_pet( $pet_id );
		if ( ! $pet || (int) $pet->user_id !== $user_id || $pet->status === 'deleted' ) {
			return new WP_Error( 'not_found', 'Augintinis nerastas.', array( 'status' => 404 ) );
		}

		$dashboard = array(
			'pet'          => self::format_pet( $pet ),
			'refill'       => self::get_refill( $user_id, $pet_id ),
			'reminders'    => self::get_reminders( $user_id, $pet_id ),
			'shelf'        => self::get_shelf( $pet_id ),
			'food_rhythm'  => self::get_food_rhythm( $user_id, $pet_id ),
			'completeness' => self::get_completeness( $pet ),
		);

		return rest_ensure_response( array( 'ok' => true, 'dashboard' => $dashboard ) );
	}

	private static function format_pet( $pet ) {
		$photo_url = null;
		if ( $pet->photo_file_id ) {
			$photo_url = wp_get_attachment_image_url( (int) $pet->photo_file_id, 'thumbnail' );
		}
		return array(
			'pet_id'         => (int) $pet->id,
			'pet_name'       => $pet->pet_name,
			'species'        => $pet->species,
			'species_detail' => $pet->species_detail,
			'life_stage'     => $pet->life_stage,
			'dog_size'       => $pet->dog_size,
			'is_sterilised'  => $pet->is_sterilised,
			'primary_need'   => $pet->primary_need,
			'photo_url'      => $photo_url,
			'is_primary'     => (int) $pet->is_primary === 1,
		);
	}

	/**
	 * Refill blokas — dienos iki tuscia, spalva, feedback.
	 */
	private static function get_refill( $user_id, $pet_id ) {
		global $wpdb;
		$t = $wpdb->prefix . 'ps_refill_tracking';
		if ( ! $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) ) {
			return null;
		}
		// Pagrindinis produktas (primary_food arba naujausias)
		$row = $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM `$t` WHERE user_id=%d AND (pet_id=%d OR pet_id IS NULL) AND status!='cancelled'
			 ORDER BY (pet_id=%d) DESC, predicted_empty_date ASC LIMIT 1",
			$user_id, $pet_id, $pet_id
		) );
		if ( ! $row ) {
			return array( 'has_data' => false );
		}

		$days_left = null;
		if ( $row->predicted_empty_date ) {
			$now = new DateTime( 'now', new DateTimeZone( 'UTC' ) );
			$empty = new DateTime( $row->predicted_empty_date, new DateTimeZone( 'UTC' ) );
			$days_left = (int) $now->diff( $empty )->format( '%r%a' );
		}

		// Spalva (zalia/gelsva/oranzine — NE raudona)
		$color = 'green';
		if ( $days_left !== null ) {
			if ( $days_left <= 3 ) {
				$color = 'orange';
			} elseif ( $days_left <= 10 ) {
				$color = 'yellow';
			}
		}

		$product = wc_get_product( $row->product_id );

		return array(
			'has_data'          => true,
			'days_left'         => $days_left,
			'color'             => $color,
			'avg_interval_days' => (int) $row->avg_interval_days,
			'confidence'        => (float) $row->confidence,
			'purchase_count'    => (int) $row->purchase_count,
			'product_id'        => (int) $row->product_id,
			'product_name'      => $product ? $product->get_name() : null,
			'product_image'     => $product && $product->get_image_id() ? wp_get_attachment_image_url( $product->get_image_id(), 'thumbnail' ) : null,
			'last_purchase'     => $row->last_purchase_date,
			'permalink'         => get_permalink( $row->product_id ),
		);
	}

	/**
	 * Artimiausi priminimai (laiko juosta).
	 */
	private static function get_reminders( $user_id, $pet_id ) {
		global $wpdb;
		$t = $wpdb->prefix . 'ps_reminders';
		if ( ! $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) ) {
			return array();
		}
		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM `$t` WHERE user_id=%d AND pet_id=%d AND status NOT IN ('cancelled','completed')
			 ORDER BY due_date ASC LIMIT 5",
			$user_id, $pet_id
		) );
		$out = array();
		$now = new DateTime( 'now', new DateTimeZone( 'UTC' ) );
		foreach ( $rows as $r ) {
			$days = null;
			if ( $r->due_date ) {
				$due = new DateTime( $r->due_date, new DateTimeZone( 'UTC' ) );
				$days = (int) $now->diff( $due )->format( '%r%a' );
			}
			$out[] = array(
				'id'        => (int) $r->id,
				'type'      => $r->reminder_type,
				'label'     => $r->reminder_label,
				'due_date'  => $r->due_date,
				'days_left' => $days,
			);
		}
		return $out;
	}

	/**
	 * Lentynele — augintinio produktai.
	 */
	private static function get_shelf( $pet_id ) {
		global $wpdb;
		$t = $wpdb->prefix . 'ps_pet_products';
		if ( ! $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) ) {
			return array();
		}
		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM `$t` WHERE pet_id=%d
			 ORDER BY FIELD(relationship_type,'primary_food','treat','supplement','care','other'),
			 last_purchased_at DESC LIMIT 5",
			$pet_id
		) );
		$out = array();
		foreach ( $rows as $row ) {
			$p = wc_get_product( $row->product_id );
			if ( ! $p ) {
				continue;
			}
			$img_id = $p->get_image_id();
			$out[] = array(
				'product_id'        => (int) $row->product_id,
				'name'              => $p->get_name(),
				'relationship_type' => $row->relationship_type,
				'price'             => $p->get_price(),
				'image'             => $img_id ? wp_get_attachment_image_url( $img_id, 'thumbnail' ) : null,
				'in_stock'          => $p->is_in_stock(),
				'last_purchased_at' => $row->last_purchased_at,
				'permalink'         => get_permalink( $row->product_id ),
			);
		}
		return $out;
	}

	/**
	 * Mitybos ritmas — paskutiniu pirkimu intervalai (is refill purchase_count + avg).
	 * MVP: grazinam avg intervala + paskutinius pirkimo taskus jei yra order istorija.
	 */
	private static function get_food_rhythm( $user_id, $pet_id ) {
		global $wpdb;
		$t = $wpdb->prefix . 'ps_refill_tracking';
		if ( ! $wpdb->get_var( "SHOW TABLES LIKE '$t'" ) ) {
			return null;
		}
		$row = $wpdb->get_row( $wpdb->prepare(
			"SELECT avg_interval_days, purchase_count, confidence FROM `$t`
			 WHERE user_id=%d AND (pet_id=%d OR pet_id IS NULL) AND status!='cancelled'
			 ORDER BY (pet_id=%d) DESC, purchase_count DESC LIMIT 1",
			$user_id, $pet_id, $pet_id
		) );
		if ( ! $row || (int) $row->purchase_count < 2 ) {
			return array( 'has_data' => false, 'purchase_count' => $row ? (int) $row->purchase_count : 0 );
		}
		return array(
			'has_data'          => true,
			'avg_interval_days' => (int) $row->avg_interval_days,
			'purchase_count'    => (int) $row->purchase_count,
			'confidence'        => (float) $row->confidence,
		);
	}

	/**
	 * Profilio pilnumas (%).
	 */
	private static function get_completeness( $pet ) {
		$fields = array( 'pet_name', 'species', 'life_stage', 'primary_need', 'current_food_brand', 'photo_file_id' );
		$filled = 0;
		foreach ( $fields as $f ) {
			if ( ! empty( $pet->$f ) ) {
				$filled++;
			}
		}
		$percent = (int) round( $filled / count( $fields ) * 100 );
		$missing = array();
		if ( empty( $pet->photo_file_id ) ) {
			$missing[] = 'photo';
		}
		if ( empty( $pet->current_food_brand ) ) {
			$missing[] = 'food';
		}
		return array(
			'percent' => $percent,
			'missing' => $missing,
			'show'    => $percent < 100,
		);
	}

	/**
	 * POST /refill-feedback — koreguoja prognoze pagal grizt. rysi.
	 * Body: pet_id, product_id, feedback (similar|sooner|later)
	 */
	public static function handle_refill_feedback( $request ) {
		$user_id = get_current_user_id();
		$pet_id = (int) $request->get_param( 'pet_id' );
		$product_id = (int) $request->get_param( 'product_id' );
		$feedback = sanitize_text_field( (string) $request->get_param( 'feedback' ) );

		if ( ! in_array( $feedback, array( 'similar', 'sooner', 'later' ), true ) ) {
			return new WP_Error( 'invalid', 'Netinkamas grįžtamasis ryšys.', array( 'status' => 400 ) );
		}

		global $wpdb;
		$t = $wpdb->prefix . 'ps_refill_tracking';
		$row = $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM `$t` WHERE user_id=%d AND product_id=%d ORDER BY (pet_id=%d) DESC LIMIT 1",
			$user_id, $product_id, $pet_id
		) );
		if ( ! $row ) {
			return new WP_Error( 'not_found', 'Refill įrašas nerastas.', array( 'status' => 404 ) );
		}

		// MVP korekcija: sooner -20%, later +20%, similar — nekeicia (bet zymim confidence auksciau)
		$avg = (int) $row->avg_interval_days;
		if ( $feedback === 'sooner' ) {
			$avg = max( 7, (int) round( $avg * 0.8 ) );
		} elseif ( $feedback === 'later' ) {
			$avg = min( 180, (int) round( $avg * 1.2 ) );
		}

		// Perskaiciuojam predicted_empty_date nuo paskutinio pirkimo
		$new_empty = null;
		if ( $row->last_purchase_date ) {
			$lp = new DateTime( $row->last_purchase_date, new DateTimeZone( 'UTC' ) );
			$lp->modify( '+' . $avg . ' days' );
			$new_empty = $lp->format( 'Y-m-d H:i:s' );
		}

		$wpdb->update( $t, array(
			'avg_interval_days'   => $avg,
			'predicted_empty_date' => $new_empty,
			'updated_at'          => gmdate( 'Y-m-d H:i:s' ),
		), array( 'id' => $row->id ) );

		// Event
		if ( class_exists( 'Petshop_Event_Registry' ) ) {
			$user = get_user_by( 'id', $user_id );
			if ( $user ) {
				Petshop_Event_Registry::emit( 'refill_feedback_submitted', $user->user_email, array(
					'pet_id'     => $pet_id,
					'product_id' => $product_id,
					'feedback'   => $feedback,
				), array( 'event_id' => 'refill_fb_' . $row->id . '_' . time() ) );
			}
		}

		return rest_ensure_response( array(
			'ok'                => true,
			'new_avg_interval'  => $avg,
			'new_empty_date'    => $new_empty,
		) );
	}
}
