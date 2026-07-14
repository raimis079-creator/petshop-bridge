<?php
/**
 * Petshop_Pet_Profile — augintinio anketa (M7).
 *
 * DB lentele gaj6_ps_pets. Vienas vartotojas gali tureti kelis augintinius.
 * Fire'ina pet_profile_created (pirma karta) + pet_profile_updated (pakeitimai) event'us.
 *
 * Laukai atitinka pet_profile_created.schema.json (S185):
 *   species: dog|cat|both|unknown (required)
 *   pet_name: string|null
 *   life_stage: junior|adult|senior|null
 *   dog_size: small|medium|large|unknown|null
 *   feeding_type: dry_only|mostly_dry|mixed|null
 *   primary_need: hypo|digestion|sterilised|daily|unknown|null
 *   current_food_brand: string|null
 *
 * NEPRIKLAUSO nuo M8 UI — anketa gali buti pildoma iskart po magic login (M9).
 * REST endpoint: POST /petshop/v1/pet-profile (create/update), GET (list).
 *
 * Autentifikacija: reikalauja prisijungusio WP user (magic login arba slaptazodis).
 *
 * Sender mirror: po create/update push'inam PS_PET_* laukus (pirmo/pagrindinio augintinio).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Pet_Profile {

	const SPECIES = array( 'dog', 'cat', 'both', 'unknown' );
	const LIFE_STAGE = array( 'junior', 'adult', 'senior' );
	const DOG_SIZE = array( 'small', 'medium', 'large', 'unknown' );
	const FEEDING_TYPE = array( 'dry_only', 'mostly_dry', 'mixed' );
	const PRIMARY_NEED = array( 'hypo', 'digestion', 'sterilised', 'daily', 'unknown' );

	public static function table_name() {
		global $wpdb;
		return $wpdb->prefix . 'ps_pets';
	}

	public static function install() {
		global $wpdb;
		$table = self::table_name();
		$charset = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE `$table` (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			user_id BIGINT UNSIGNED NOT NULL,
			pet_name VARCHAR(100) NULL,
			species VARCHAR(16) NOT NULL DEFAULT 'unknown',
			life_stage VARCHAR(16) NULL,
			dog_size VARCHAR(16) NULL,
			feeding_type VARCHAR(16) NULL,
			primary_need VARCHAR(16) NULL,
			current_food_brand VARCHAR(120) NULL,
			is_primary TINYINT(1) NOT NULL DEFAULT 0,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			PRIMARY KEY (id),
			KEY idx_user (user_id),
			KEY idx_user_primary (user_id, is_primary)
		) $charset";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	public static function maybe_install() {
		global $wpdb;
		$table = self::table_name();
		if ( ! $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $table ) ) ) {
			self::install();
		}
	}

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
	}

	public static function register_routes() {
		register_rest_route( 'petshop/v1', '/pet-profile', array(
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'handle_save' ),
				'permission_callback' => array( __CLASS__, 'require_login' ),
			),
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'handle_list' ),
				'permission_callback' => array( __CLASS__, 'require_login' ),
			),
		) );
	}

	public static function require_login() {
		return is_user_logged_in();
	}

	/**
	 * POST /petshop/v1/pet-profile
	 * Jei paduotas pet_id -> update; kitaip create.
	 */
	public static function handle_save( $request ) {
		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			return new WP_Error( 'not_logged_in', 'Reikia prisijungti.', array( 'status' => 401 ) );
		}

		$pet_id = (int) $request->get_param( 'pet_id' );

		if ( $pet_id > 0 ) {
			// UPDATE: tik perduoti laukai (dalinis update — neperduoti laukai NEKEICIAMI)
			$input = self::sanitize_input( $request, true );
			return self::update_pet( $user_id, $pet_id, $input );
		}
		// CREATE: visi laukai (neperduoti = null/default)
		$input = self::sanitize_input( $request, false );
		return self::create_pet( $user_id, $input );
	}

	/**
	 * Sanitize input.
	 *
	 * @param WP_REST_Request $request
	 * @param bool $partial  Jei true (update) — i rezultata itraukiam TIK perduotus laukus.
	 *                        Jei false (create) — visi laukai (neperduoti = null/default).
	 */
	private static function sanitize_input( $request, $partial = false ) {
		$out = array();
		$fields = array( 'species', 'pet_name', 'life_stage', 'dog_size', 'feeding_type', 'primary_need', 'current_food_brand' );

		foreach ( $fields as $f ) {
			$raw = $request->get_param( $f );
			// Partial (update): praleidziam laukus kuriu nera request'e
			if ( $partial && $raw === null ) {
				continue;
			}

			switch ( $f ) {
				case 'species':
					$v = sanitize_text_field( (string) $raw );
					$out['species'] = in_array( $v, self::SPECIES, true ) ? $v : ( $partial ? null : 'unknown' );
					if ( $partial && $out['species'] === null ) {
						unset( $out['species'] );  // negaliojanti reiksme partial atveju — nekeiciam
					}
					break;
				case 'pet_name':
					$out['pet_name'] = ( $raw !== null && $raw !== '' ) ? sanitize_text_field( (string) $raw ) : null;
					break;
				case 'current_food_brand':
					$out['current_food_brand'] = ( $raw !== null && $raw !== '' ) ? sanitize_text_field( (string) $raw ) : null;
					break;
				case 'life_stage':
					$out['life_stage'] = self::validate_enum( $raw, self::LIFE_STAGE );
					break;
				case 'dog_size':
					$out['dog_size'] = self::validate_enum( $raw, self::DOG_SIZE );
					break;
				case 'feeding_type':
					$out['feeding_type'] = self::validate_enum( $raw, self::FEEDING_TYPE );
					break;
				case 'primary_need':
					$out['primary_need'] = self::validate_enum( $raw, self::PRIMARY_NEED );
					break;
			}
		}

		// CREATE: uztikrinam kad species visada yra
		if ( ! $partial && ! isset( $out['species'] ) ) {
			$out['species'] = 'unknown';
		}

		return $out;
	}

	private static function validate_enum( $value, $allowed ) {
		if ( $value === null || $value === '' ) {
			return null;
		}
		$v = sanitize_text_field( (string) $value );
		return in_array( $v, $allowed, true ) ? $v : null;
	}

	private static function create_pet( $user_id, $input ) {
		global $wpdb;
		$now = gmdate( 'Y-m-d H:i:s' );

		// Ar tai pirmas augintinis? -> is_primary=1
		$existing_count = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(*) FROM `" . self::table_name() . "` WHERE user_id = %d",
			$user_id
		) );
		$is_primary = ( $existing_count === 0 ) ? 1 : 0;

		$wpdb->insert(
			self::table_name(),
			array(
				'user_id'            => $user_id,
				'pet_name'           => $input['pet_name'],
				'species'            => $input['species'],
				'life_stage'         => $input['life_stage'],
				'dog_size'           => $input['dog_size'],
				'feeding_type'       => $input['feeding_type'],
				'primary_need'       => $input['primary_need'],
				'current_food_brand' => $input['current_food_brand'],
				'is_primary'         => $is_primary,
				'created_at'         => $now,
				'updated_at'         => $now,
			),
			array( '%d','%s','%s','%s','%s','%s','%s','%s','%d','%s','%s' )
		);
		$pet_id = (int) $wpdb->insert_id;

		if ( ! $pet_id ) {
			return new WP_Error( 'create_failed', 'Nepavyko išsaugoti anketos.', array( 'status' => 500 ) );
		}

		// Event: pet_profile_created
		self::emit_created( $user_id, $pet_id, $input );
		// Sender mirror (jei primary)
		if ( $is_primary ) {
			self::mirror_to_sender( $user_id, $pet_id );
		}

		return rest_ensure_response( array(
			'ok'         => true,
			'pet_id'     => $pet_id,
			'is_primary' => (bool) $is_primary,
			'pet'        => self::get_pet( $pet_id ),
		) );
	}

	private static function update_pet( $user_id, $pet_id, $input ) {
		global $wpdb;

		// Patikrinam kad augintinis priklauso siam user'iui (IDOR apsauga)
		$pet = $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM `" . self::table_name() . "` WHERE id = %d AND user_id = %d",
			$pet_id, $user_id
		) );
		if ( ! $pet ) {
			return new WP_Error( 'not_found', 'Augintinis nerastas.', array( 'status' => 404 ) );
		}

		// Nustatom pakeistus laukus (changed_fields event'ui)
		$changed = array();
		$updates = array();
		foreach ( array( 'pet_name', 'species', 'life_stage', 'dog_size', 'feeding_type', 'primary_need', 'current_food_brand' ) as $f ) {
			if ( array_key_exists( $f, $input ) && $input[ $f ] !== $pet->$f ) {
				$changed[] = $f;
				$updates[ $f ] = $input[ $f ];
			}
		}

		if ( empty( $updates ) ) {
			return rest_ensure_response( array( 'ok' => true, 'pet_id' => $pet_id, 'unchanged' => true, 'pet' => self::get_pet( $pet_id ) ) );
		}

		$updates['updated_at'] = gmdate( 'Y-m-d H:i:s' );
		$wpdb->update( self::table_name(), $updates, array( 'id' => $pet_id ) );

		// Event: pet_profile_updated (su changed_fields)
		self::emit_updated( $user_id, $pet_id, $changed, $input );
		// Sender mirror (jei primary)
		if ( (int) $pet->is_primary === 1 ) {
			self::mirror_to_sender( $user_id, $pet_id );
		}

		return rest_ensure_response( array(
			'ok'             => true,
			'pet_id'         => $pet_id,
			'changed_fields' => $changed,
			'pet'            => self::get_pet( $pet_id ),
		) );
	}

	public static function handle_list( $request ) {
		$user_id = get_current_user_id();
		global $wpdb;
		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM `" . self::table_name() . "` WHERE user_id = %d ORDER BY is_primary DESC, id ASC",
			$user_id
		) );
		return rest_ensure_response( array( 'ok' => true, 'pets' => $rows ) );
	}

	public static function get_pet( $pet_id ) {
		global $wpdb;
		return $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM `" . self::table_name() . "` WHERE id = %d",
			$pet_id
		) );
	}

	// --- Event emit ---
	private static function emit_created( $user_id, $pet_id, $input ) {
		if ( ! class_exists( 'Petshop_Event_Registry' ) ) {
			return;
		}
		$user = get_user_by( 'id', $user_id );
		if ( ! $user ) {
			return;
		}
		Petshop_Event_Registry::emit( 'pet_profile_created', $user->user_email, array(
			'pet_id'             => $pet_id,
			'pet_name'           => $input['pet_name'],
			'species'            => $input['species'],
			'life_stage'         => $input['life_stage'],
			'dog_size'           => $input['dog_size'],
			'feeding_type'       => $input['feeding_type'],
			'primary_need'       => $input['primary_need'],
			'current_food_brand' => $input['current_food_brand'],
		), array( 'event_id' => 'pet_created_' . $pet_id ) );
	}

	private static function emit_updated( $user_id, $pet_id, $changed, $input ) {
		if ( ! class_exists( 'Petshop_Event_Registry' ) ) {
			return;
		}
		$user = get_user_by( 'id', $user_id );
		if ( ! $user ) {
			return;
		}
		Petshop_Event_Registry::emit( 'pet_profile_updated', $user->user_email, array(
			'pet_id'         => $pet_id,
			'changed_fields' => $changed,
		), array( 'event_id' => 'pet_updated_' . $pet_id . '_' . time() ) );
	}

	// --- Sender mirror (PS_PET_* laukai) — skaito PILNA augintini is DB ---
	private static function mirror_to_sender( $user_id, $pet_id ) {
		if ( ! function_exists( 'ps_esp_adapter' ) ) {
			return;
		}
		$user = get_user_by( 'id', $user_id );
		if ( ! $user ) {
			return;
		}
		$pet = self::get_pet( $pet_id );
		if ( ! $pet ) {
			return;
		}
		$adapter = ps_esp_adapter();
		if ( ! $adapter || ! $adapter->is_configured() ) {
			return;
		}
		$attrs = array(
			'PS_PET_SPECIES'    => $pet->species,
			'PS_PET_NAME'       => $pet->pet_name ?: '',
			'PS_PET_LIFE_STAGE' => $pet->life_stage ?: '',
			'PS_DOG_SIZE'       => $pet->dog_size ?: '',
			'PS_FEEDING_TYPE'   => $pet->feeding_type ?: '',
			'PS_PRIMARY_NEED'   => $pet->primary_need ?: '',
		);
		if ( $pet->current_food_brand ) {
			$attrs['PS_CURRENT_FOOD_BRAND'] = $pet->current_food_brand;
		}
		$adapter->upsert_contact( $user->user_email, $attrs );
	}
}
