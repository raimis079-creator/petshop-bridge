<?php
/**
 * Petshop_Reminders — augintinio priminimai (M13).
 *
 * Tipai: vaccination, deworming, flea_tick, vet_checkup, grooming, custom.
 * DB: gaj6_ps_reminders. Cron kasdien tikrina due_date. Fire pet_reminder_due event.
 * REST: CRUD + confirm/reschedule per Action Tokens (M6, scanner-safe).
 *
 * Srautas:
 *   1. Vartotojas sukuria priminima (REST POST /petshop/v1/reminders)
 *   2. Cron kasdien -> artejantys (T-3d) -> fire pet_reminder_due event
 *   3. Event payload turi confirm_token + reschedule_token (M6 tokenai)
 *   4. Vartotojas paspaudzia confirm -> token consumed -> priminimas pazymimas done
 *      Arba reschedule -> token consumed -> due_date pastumiamas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Reminders {

	const TYPES = array( 'vaccination', 'deworming', 'flea_tick', 'vet_checkup', 'grooming', 'custom' );
	const ADVANCE_DAYS = 3;     // fire event X dienu pries due_date
	const TOKEN_TTL = 604800;   // 7 dienos (priminimo tokenai ilgesni nei login)

	public static function table_name() {
		global $wpdb;
		return $wpdb->prefix . 'ps_reminders';
	}

	public static function install() {
		global $wpdb;
		$table = self::table_name();
		$charset = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE `$table` (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			user_id BIGINT UNSIGNED NOT NULL,
			pet_id BIGINT UNSIGNED NOT NULL,
			reminder_type VARCHAR(24) NOT NULL,
			reminder_label VARCHAR(200) NULL,
			due_date DATE NOT NULL,
			repeat_interval_days INT UNSIGNED NULL,
			status VARCHAR(16) NOT NULL DEFAULT 'active',
			notified_at DATETIME NULL,
			completed_at DATETIME NULL,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			PRIMARY KEY (id),
			KEY idx_user_pet (user_id, pet_id),
			KEY idx_status_due (status, due_date)
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
		// Cron
		add_action( 'ps_reminders_daily_check', array( __CLASS__, 'check_due' ) );
		if ( ! wp_next_scheduled( 'ps_reminders_daily_check' ) ) {
			wp_schedule_event( strtotime( 'tomorrow 09:00' ), 'daily', 'ps_reminders_daily_check' );
		}
	}

	public static function register_routes() {
		// CRUD
		register_rest_route( 'petshop/v1', '/reminders', array(
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'handle_create' ),
				'permission_callback' => 'is_user_logged_in',
			),
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'handle_list' ),
				'permission_callback' => 'is_user_logged_in',
			),
		) );
		register_rest_route( 'petshop/v1', '/reminders/(?P<id>\d+)', array(
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'handle_update' ),
				'permission_callback' => 'is_user_logged_in',
			),
			array(
				'methods'             => 'DELETE',
				'callback'            => array( __CLASS__, 'handle_delete' ),
				'permission_callback' => 'is_user_logged_in',
			),
		) );
	}

	public static function handle_create( $request ) {
		$user_id = get_current_user_id();
		$pet_id = (int) $request->get_param( 'pet_id' );
		$type = sanitize_text_field( (string) $request->get_param( 'reminder_type' ) );
		$due = sanitize_text_field( (string) $request->get_param( 'due_date' ) );

		if ( ! $pet_id || ! in_array( $type, self::TYPES, true ) ) {
			return new WP_Error( 'invalid', 'Trūksta pet_id arba neteisingas reminder_type.', array( 'status' => 400 ) );
		}
		if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $due ) ) {
			return new WP_Error( 'invalid_date', 'due_date turi būti YYYY-MM-DD formatu.', array( 'status' => 400 ) );
		}
		// IDOR: patikrinam kad pet priklauso user'iui
		if ( class_exists( 'Petshop_Pet_Profile' ) ) {
			$pet = Petshop_Pet_Profile::get_pet( $pet_id );
			if ( ! $pet || (int) $pet->user_id !== $user_id ) {
				return new WP_Error( 'not_found', 'Augintinis nerastas.', array( 'status' => 404 ) );
			}
		}

		global $wpdb;
		$now = gmdate( 'Y-m-d H:i:s' );
		$wpdb->insert( self::table_name(), array(
			'user_id'              => $user_id,
			'pet_id'               => $pet_id,
			'reminder_type'        => $type,
			'reminder_label'       => $request->get_param( 'reminder_label' ) ? sanitize_text_field( (string) $request->get_param( 'reminder_label' ) ) : null,
			'due_date'             => $due,
			'repeat_interval_days' => $request->get_param( 'repeat_interval_days' ) ? (int) $request->get_param( 'repeat_interval_days' ) : null,
			'status'               => 'active',
			'created_at'           => $now,
			'updated_at'           => $now,
		) );
		$id = (int) $wpdb->insert_id;
		return rest_ensure_response( array( 'ok' => true, 'reminder_id' => $id ) );
	}

	public static function handle_list( $request ) {
		$user_id = get_current_user_id();
		$pet_id = (int) $request->get_param( 'pet_id' );
		global $wpdb;
		$where = $wpdb->prepare( "user_id = %d", $user_id );
		if ( $pet_id ) {
			$where .= $wpdb->prepare( " AND pet_id = %d", $pet_id );
		}
		$rows = $wpdb->get_results( "SELECT * FROM `" . self::table_name() . "` WHERE $where ORDER BY due_date ASC" );
		return rest_ensure_response( array( 'ok' => true, 'reminders' => $rows ) );
	}

	public static function handle_update( $request ) {
		$user_id = get_current_user_id();
		$id = (int) $request['id'];
		global $wpdb;
		$row = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM `" . self::table_name() . "` WHERE id=%d AND user_id=%d", $id, $user_id ) );
		if ( ! $row ) {
			return new WP_Error( 'not_found', 'Priminimas nerastas.', array( 'status' => 404 ) );
		}
		$updates = array( 'updated_at' => gmdate( 'Y-m-d H:i:s' ) );
		$due = $request->get_param( 'due_date' );
		if ( $due && preg_match( '/^\d{4}-\d{2}-\d{2}$/', $due ) ) {
			$updates['due_date'] = $due;
			$updates['status'] = 'active';
			$updates['notified_at'] = null;
		}
		$status = $request->get_param( 'status' );
		if ( $status && in_array( $status, array( 'active', 'done', 'cancelled' ), true ) ) {
			$updates['status'] = $status;
			if ( $status === 'done' ) {
				$updates['completed_at'] = gmdate( 'Y-m-d H:i:s' );
			}
		}
		$label = $request->get_param( 'reminder_label' );
		if ( $label !== null ) {
			$updates['reminder_label'] = sanitize_text_field( $label );
		}
		$wpdb->update( self::table_name(), $updates, array( 'id' => $id ) );

		// Jei done + has repeat -> sukuriam kita priminima
		if ( ( $updates['status'] ?? '' ) === 'done' && $row->repeat_interval_days > 0 ) {
			$next_due = date( 'Y-m-d', strtotime( $row->due_date ) + $row->repeat_interval_days * 86400 );
			$wpdb->insert( self::table_name(), array(
				'user_id'              => $user_id,
				'pet_id'               => $row->pet_id,
				'reminder_type'        => $row->reminder_type,
				'reminder_label'       => $row->reminder_label,
				'due_date'             => $next_due,
				'repeat_interval_days' => $row->repeat_interval_days,
				'status'               => 'active',
				'created_at'           => gmdate( 'Y-m-d H:i:s' ),
				'updated_at'           => gmdate( 'Y-m-d H:i:s' ),
			) );
		}
		return rest_ensure_response( array( 'ok' => true ) );
	}

	public static function handle_delete( $request ) {
		$user_id = get_current_user_id();
		$id = (int) $request['id'];
		global $wpdb;
		$deleted = $wpdb->delete( self::table_name(), array( 'id' => $id, 'user_id' => $user_id ) );
		if ( ! $deleted ) {
			return new WP_Error( 'not_found', 'Priminimas nerastas.', array( 'status' => 404 ) );
		}
		return rest_ensure_response( array( 'ok' => true, 'deleted' => true ) );
	}

	/**
	 * Cron: kasdienine patikra — fire pet_reminder_due event kai arteja.
	 */
	public static function check_due() {
		global $wpdb;
		$table = self::table_name();
		$target = date( 'Y-m-d', time() + self::ADVANCE_DAYS * 86400 );

		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT r.*, u.user_email, p.pet_name
			 FROM `$table` r
			 JOIN `{$wpdb->users}` u ON u.ID = r.user_id
			 LEFT JOIN `{$wpdb->prefix}ps_pets` p ON p.id = r.pet_id
			 WHERE r.status = 'active'
			   AND r.notified_at IS NULL
			   AND r.due_date <= %s
			 ORDER BY r.due_date ASC
			 LIMIT 100",
			$target
		) );

		foreach ( $rows as $row ) {
			if ( ! $row->user_email || ! class_exists( 'Petshop_Event_Registry' ) ) {
				continue;
			}
			// Generuojam confirm + reschedule tokenus (M6)
			$group = 'reminder_' . $row->id;
			$confirm_token = '';
			$reschedule_token = '';
			if ( function_exists( 'ps_generate_token' ) ) {
				$confirm_token = ps_generate_token( array(
					'purpose'       => 'reminder_confirm',
					'purpose_group' => $group,
					'subject_id'    => (int) $row->user_id,
					'resource_id'   => (string) $row->id,
					'ttl_seconds'   => self::TOKEN_TTL,
				) ) ?: '';
				$reschedule_token = ps_generate_token( array(
					'purpose'       => 'reminder_reschedule',
					'purpose_group' => $group,
					'subject_id'    => (int) $row->user_id,
					'resource_id'   => (string) $row->id,
					'ttl_seconds'   => self::TOKEN_TTL,
				) ) ?: '';
			}

			Petshop_Event_Registry::emit( 'pet_reminder_due', $row->user_email, array(
				'reminder_id'      => (int) $row->id,
				'pet_id'           => (int) $row->pet_id,
				'pet_name'         => $row->pet_name,
				'reminder_type'    => $row->reminder_type,
				'reminder_label'   => $row->reminder_label,
				'due_date'         => $row->due_date,
				'confirm_token'    => $confirm_token,
				'reschedule_token' => $reschedule_token,
			), array(
				'event_id' => 'reminder_due_' . $row->id . '_' . $row->due_date,
			) );

			$wpdb->update( $table, array(
				'notified_at' => gmdate( 'Y-m-d H:i:s' ),
				'updated_at'  => gmdate( 'Y-m-d H:i:s' ),
			), array( 'id' => $row->id ) );
		}
	}
}
