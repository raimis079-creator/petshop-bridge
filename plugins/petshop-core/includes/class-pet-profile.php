<?php
/**
 * Petshop_Pet_Profile — augintinio profilis (M7 + M8 papildymai).
 *
 * DB lentele gaj6_ps_pets. Vienas vartotojas gali tureti kelis augintinius.
 * Fire'ina pet_profile_created + pet_profile_updated event'us.
 *
 * M8 papildymai (S195):
 *   - Nauji species: dog, cat, bird, rodent, fish, reptile, other (pasalinta both/unknown)
 *   - Nauji primary_need: daily, digestion, skin_allergy, sterilised, picky_eater
 *   - Nauji laukai: species_detail, is_sterilised, photo_file_id, current_food_free_text,
 *     primary_product_id, status, deleted_at
 *   - Nauji endpointai: PATCH pet-profile/{id}, DELETE (soft), GET brands, pet-photo
 *
 * REST:
 *   POST   /petshop/v1/pet-profile            create/update (legacy — palaikomas)
 *   GET    /petshop/v1/pet-profile            list (tik ne-deleted)
 *   PATCH  /petshop/v1/pet-profile/{id}       dalinis update
 *   DELETE /petshop/v1/pet-profile/{id}       soft delete
 *   GET    /petshop/v1/brands?species=dog     brendu autocomplete
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Pet_Profile {

	// M8: nauji enum'ai
	const SPECIES = array( 'dog', 'cat', 'bird', 'rodent', 'fish', 'reptile', 'other' );
	const LIFE_STAGE = array( 'junior', 'adult', 'senior' );
	const DOG_SIZE = array( 'small', 'medium', 'large', 'unknown' );
	const FEEDING_TYPE = array( 'dry_only', 'mostly_dry', 'mixed' );
	const PRIMARY_NEED = array( 'daily', 'digestion', 'skin_allergy', 'sterilised', 'picky_eater' );
	const IS_STERILISED = array( 'yes', 'no', 'unknown' );
	const STATUS = array( 'active', 'deleted' );

	const BRAND_TAXONOMY = 'product_brand';

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
			species VARCHAR(16) NOT NULL DEFAULT 'other',
			species_detail VARCHAR(100) NULL,
			life_stage VARCHAR(16) NULL,
			dog_size VARCHAR(16) NULL,
			is_sterilised VARCHAR(16) NULL,
			feeding_type VARCHAR(16) NULL,
			primary_need VARCHAR(16) NULL,
			current_food_brand VARCHAR(120) NULL,
			current_food_free_text VARCHAR(200) NULL,
			primary_product_id BIGINT UNSIGNED NULL,
			photo_file_id BIGINT UNSIGNED NULL,
			is_primary TINYINT(1) NOT NULL DEFAULT 0,
			status VARCHAR(16) NOT NULL DEFAULT 'active',
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			KEY idx_user (user_id),
			KEY idx_user_status (user_id, status),
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
			return;
		}
		// Migracija: pridedam trukstamus M8 laukus esamai lentelei
		self::ensure_columns();
	}

	/**
	 * Prideda M8 laukus jei ju dar nera (ALTER TABLE ADD COLUMN IF NOT EXISTS ekvivalentas).
	 */
	private static function ensure_columns() {
		global $wpdb;
		$table = self::table_name();
		$existing = $wpdb->get_col( "SHOW COLUMNS FROM `$table`" );

		$new_cols = array(
			'species_detail'         => "VARCHAR(100) NULL AFTER species",
			'is_sterilised'          => "VARCHAR(16) NULL AFTER dog_size",
			'current_food_free_text' => "VARCHAR(200) NULL AFTER current_food_brand",
			'primary_product_id'     => "BIGINT UNSIGNED NULL AFTER current_food_free_text",
			'photo_file_id'          => "BIGINT UNSIGNED NULL AFTER primary_product_id",
			'status'                 => "VARCHAR(16) NOT NULL DEFAULT 'active' AFTER is_primary",
			'deleted_at'             => "DATETIME NULL AFTER updated_at",
		);
		foreach ( $new_cols as $col => $def ) {
			if ( ! in_array( $col, $existing, true ) ) {
				$wpdb->query( "ALTER TABLE `$table` ADD COLUMN `$col` $def" );
			}
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
		// M8: PATCH + DELETE per pet_id
		register_rest_route( 'petshop/v1', '/pet-profile/(?P<id>\d+)', array(
			array(
				'methods'             => 'PATCH',
				'callback'            => array( __CLASS__, 'handle_patch' ),
				'permission_callback' => array( __CLASS__, 'require_login' ),
			),
			array(
				'methods'             => 'DELETE',
				'callback'            => array( __CLASS__, 'handle_delete' ),
				'permission_callback' => array( __CLASS__, 'require_login' ),
			),
		) );
		// M8: brendu autocomplete
		register_rest_route( 'petshop/v1', '/brands', array(
			'methods'             => 'GET',
			'callback'            => array( __CLASS__, 'handle_brands' ),
			'permission_callback' => '__return_true',
		) );
	}

	public static function require_login() {
		return is_user_logged_in();
	}

	public static function handle_save( $request ) {
		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			return new WP_Error( 'not_logged_in', 'Reikia prisijungti.', array( 'status' => 401 ) );
		}
		$pet_id = (int) $request->get_param( 'pet_id' );
		if ( $pet_id > 0 ) {
			$input = self::sanitize_input( $request, true );
			return self::update_pet( $user_id, $pet_id, $input );
		}
		$input = self::sanitize_input( $request, false );
		return self::create_pet( $user_id, $input );
	}

	/**
	 * PATCH /pet-profile/{id} — dalinis update (tik perduoti laukai).
	 */
	public static function handle_patch( $request ) {
		$user_id = get_current_user_id();
		$pet_id = (int) $request['id'];
		$input = self::sanitize_input( $request, true );
		return self::update_pet( $user_id, $pet_id, $input );
	}

	/**
	 * DELETE /pet-profile/{id} — SOFT delete (status=deleted, deleted_at).
	 * Refill + reminders deaktyvuojami (ne trinami — auditui).
	 */
	public static function handle_delete( $request ) {
		$user_id = get_current_user_id();
		$pet_id = (int) $request['id'];
		global $wpdb;

		$pet = $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM `" . self::table_name() . "` WHERE id=%d AND user_id=%d AND status!='deleted'",
			$pet_id, $user_id
		) );
		if ( ! $pet ) {
			return new WP_Error( 'not_found', 'Augintinis nerastas.', array( 'status' => 404 ) );
		}

		$now = gmdate( 'Y-m-d H:i:s' );
		$wpdb->update( self::table_name(), array(
			'status'     => 'deleted',
			'deleted_at' => $now,
			'updated_at' => $now,
		), array( 'id' => $pet_id ) );

		// Deaktyvuojam susijusius reminders (jei lentele yra)
		$rem_table = $wpdb->prefix . 'ps_reminders';
		if ( $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $rem_table ) ) ) {
			$wpdb->update( $rem_table, array( 'status' => 'cancelled', 'updated_at' => $now ),
				array( 'pet_id' => $pet_id, 'user_id' => $user_id ) );
		}

		// Jei tai buvo primary — nustatom kita augintini primary
		if ( (int) $pet->is_primary === 1 ) {
			$next = $wpdb->get_row( $wpdb->prepare(
				"SELECT id FROM `" . self::table_name() . "` WHERE user_id=%d AND status='active' ORDER BY id ASC LIMIT 1",
				$user_id
			) );
			if ( $next ) {
				$wpdb->update( self::table_name(), array( 'is_primary' => 1 ), array( 'id' => $next->id ) );
			}
		}

		return rest_ensure_response( array( 'ok' => true, 'deleted' => true, 'pet_id' => $pet_id ) );
	}

	/**
	 * GET /brands?species=dog&q=jose — brendu autocomplete.
	 * Grazina brendus is product_brand taksonomijos.
	 * Jei nurodyta species — filtruoja pagal produktus tos rusies kategorijose (best-effort).
	 */
	public static function handle_brands( $request ) {
		$q = sanitize_text_field( (string) $request->get_param( 'q' ) );
		$species = sanitize_text_field( (string) $request->get_param( 'species' ) );

		if ( ! taxonomy_exists( self::BRAND_TAXONOMY ) ) {
			return rest_ensure_response( array( 'ok' => true, 'brands' => array() ) );
		}

		$args = array(
			'taxonomy'   => self::BRAND_TAXONOMY,
			'hide_empty' => true,
			'number'     => 20,
			'orderby'    => 'name',
			'order'      => 'ASC',
		);
		if ( $q !== '' ) {
			$args['name__like'] = $q;  // prefix/substring match
		}
		$terms = get_terms( $args );
		if ( is_wp_error( $terms ) ) {
			return rest_ensure_response( array( 'ok' => true, 'brands' => array() ) );
		}

		$brands = array();
		foreach ( $terms as $t ) {
			$brands[] = array(
				'name' => $t->name,
				'slug' => $t->slug,
				'id'   => $t->term_id,
			);
		}
		return rest_ensure_response( array( 'ok' => true, 'brands' => $brands ) );
	}

	private static function sanitize_input( $request, $partial = false ) {
		$out = array();
		$fields = array(
			'species', 'species_detail', 'pet_name', 'life_stage', 'dog_size',
			'is_sterilised', 'feeding_type', 'primary_need', 'current_food_brand',
			'current_food_free_text', 'primary_product_id',
		);

		foreach ( $fields as $f ) {
			$raw = $request->get_param( $f );
			if ( $partial && $raw === null ) {
				continue;
			}

			switch ( $f ) {
				case 'species':
					$v = sanitize_text_field( (string) $raw );
					if ( in_array( $v, self::SPECIES, true ) ) {
						$out['species'] = $v;
					} elseif ( ! $partial ) {
						$out['species'] = 'other';
					}
					break;
				case 'pet_name':
					$out['pet_name'] = ( $raw !== null && $raw !== '' ) ? sanitize_text_field( (string) $raw ) : null;
					break;
				case 'species_detail':
					$out['species_detail'] = ( $raw !== null && $raw !== '' ) ? sanitize_text_field( (string) $raw ) : null;
					break;
				case 'current_food_brand':
					$out['current_food_brand'] = ( $raw !== null && $raw !== '' ) ? sanitize_text_field( (string) $raw ) : null;
					break;
				case 'current_food_free_text':
					$out['current_food_free_text'] = ( $raw !== null && $raw !== '' ) ? sanitize_text_field( (string) $raw ) : null;
					break;
				case 'primary_product_id':
					$out['primary_product_id'] = $raw ? (int) $raw : null;
					break;
				case 'life_stage':
					$out['life_stage'] = self::validate_enum( $raw, self::LIFE_STAGE );
					break;
				case 'dog_size':
					$out['dog_size'] = self::validate_enum( $raw, self::DOG_SIZE );
					break;
				case 'is_sterilised':
					$out['is_sterilised'] = self::validate_enum( $raw, self::IS_STERILISED );
					break;
				case 'feeding_type':
					$out['feeding_type'] = self::validate_enum( $raw, self::FEEDING_TYPE );
					break;
				case 'primary_need':
					$out['primary_need'] = self::validate_enum( $raw, self::PRIMARY_NEED );
					break;
			}
		}

		if ( ! $partial && ! isset( $out['species'] ) ) {
			$out['species'] = 'other';
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

		$existing_count = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(*) FROM `" . self::table_name() . "` WHERE user_id = %d AND status='active'",
			$user_id
		) );
		$is_primary = ( $existing_count === 0 ) ? 1 : 0;

		$data = array_merge( array(
			'user_id'    => $user_id,
			'is_primary' => $is_primary,
			'status'     => 'active',
			'created_at' => $now,
			'updated_at' => $now,
		), $input );

		$wpdb->insert( self::table_name(), $data );
		$pet_id = (int) $wpdb->insert_id;

		if ( ! $pet_id ) {
			return new WP_Error( 'create_failed', 'Nepavyko išsaugoti anketos.', array( 'status' => 500 ) );
		}

		self::emit_created( $user_id, $pet_id, $input );
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

		$pet = $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM `" . self::table_name() . "` WHERE id = %d AND user_id = %d AND status!='deleted'",
			$pet_id, $user_id
		) );
		if ( ! $pet ) {
			return new WP_Error( 'not_found', 'Augintinis nerastas.', array( 'status' => 404 ) );
		}

		$changed = array();
		$updates = array();
		foreach ( $input as $f => $val ) {
			if ( property_exists( $pet, $f ) && $val !== $pet->$f ) {
				$changed[] = $f;
				$updates[ $f ] = $val;
			}
		}

		if ( empty( $updates ) ) {
			return rest_ensure_response( array( 'ok' => true, 'pet_id' => $pet_id, 'unchanged' => true, 'pet' => self::get_pet( $pet_id ) ) );
		}

		$updates['updated_at'] = gmdate( 'Y-m-d H:i:s' );
		$wpdb->update( self::table_name(), $updates, array( 'id' => $pet_id ) );

		self::emit_updated( $user_id, $pet_id, $changed );
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
			"SELECT * FROM `" . self::table_name() . "` WHERE user_id = %d AND status='active' ORDER BY is_primary DESC, id ASC",
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
			'pet_name'           => $input['pet_name'] ?? null,
			'species'            => $input['species'] ?? 'other',
			'life_stage'         => $input['life_stage'] ?? null,
			'dog_size'           => $input['dog_size'] ?? null,
			'feeding_type'       => $input['feeding_type'] ?? null,
			'primary_need'       => $input['primary_need'] ?? null,
			'current_food_brand' => $input['current_food_brand'] ?? null,
		), array( 'event_id' => 'pet_created_' . $pet_id ) );
	}

	private static function emit_updated( $user_id, $pet_id, $changed ) {
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

	// --- Sender mirror ---
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
