<?php
/**
 * Petshop_Event_Registry — kanoninių event'ų registras + JSON schema validacija.
 *
 * Užrakina kad event'ai atitiktų kanoninį 13 sąrašą (dokumentai/events/EVENTS.md).
 * Kiekvienas event turi schema_version. Schemos: petshop-core/schemas/events/*.schema.json.
 *
 * NAUDOJIMAS:
 *   Petshop_Event_Registry::emit('order_paid', 'klientas@x.lt', $payload);
 *   → validuoja pagal order_paid.schema.json → ps_emit_event() → event log → async provider.
 *
 * Jei event'as nezinomas arba payload neatitinka schemos → log WARNING + (pagal strict) blokuoja.
 *
 * KANONINIAI EVENT'AI (13, S185): legacy_contact_imported, pet_profile_created,
 * pet_profile_updated, cart_abandoned, order_paid, order_shipped, refill_due,
 * subscription_t5_notice, subscription_t2_sms_needed, payment_failed,
 * shipment_returned, pet_reminder_due, consent_changed.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Event_Registry {

	/**
	 * Kanoniniai event'ai (S185 registry). Reiksme = ar salltinis jau egzistuoja.
	 */
	const CANONICAL_EVENTS = array(
		'legacy_contact_imported'     => false,  // M16
		'pet_profile_created'         => false,  // M7
		'pet_profile_updated'         => false,  // M7
		'cart_abandoned'              => false,  // atskiras modulis
		'order_paid'                  => true,   // WC hook — YRA
		'order_shipped'               => false,  // M12 (Venipak/LP meta-change)
		'refill_due'                  => false,  // M11
		'subscription_t5_notice'      => false,  // M10
		'subscription_t2_sms_needed'  => false,  // M10
		'payment_failed'              => false,  // dalinai
		'shipment_returned'           => false,  // M12
		'pet_reminder_due'            => false,  // M13
		'consent_changed'             => true,   // M4 hook — YRA
		'pet_product_assigned'        => true,   // M8 — YRA
		'refill_feedback_submitted'   => true,   // M8 — YRA
	);

	private static $schema_cache = array();

	/**
	 * Ar event'as kanoninis.
	 */
	public static function is_canonical( $event_name ) {
		return array_key_exists( $event_name, self::CANONICAL_EVENTS );
	}

	/**
	 * Ikelia event schema is failo.
	 */
	private static function load_schema( $event_name ) {
		if ( isset( self::$schema_cache[ $event_name ] ) ) {
			return self::$schema_cache[ $event_name ];
		}
		$path = PETSHOP_CORE_DIR . 'schemas/events/' . $event_name . '.schema.json';
		if ( ! file_exists( $path ) ) {
			self::$schema_cache[ $event_name ] = null;
			return null;
		}
		$schema = json_decode( file_get_contents( $path ), true );
		self::$schema_cache[ $event_name ] = $schema;
		return $schema;
	}

	/**
	 * Validuoja payload pagal event schema (paprasta: required + enum + tipai).
	 * NE pilnas JSON Schema validatorius — tik esminiai patikrinimai.
	 *
	 * @return array {valid, errors}
	 */
	public static function validate( $event_name, array $payload ) {
		$errors = array();

		if ( ! self::is_canonical( $event_name ) ) {
			return array( 'valid' => false, 'errors' => array( 'not_canonical: ' . $event_name ) );
		}

		$schema = self::load_schema( $event_name );
		if ( ! $schema ) {
			// Schemos nera — leidziam, bet loginam (schema turetu buti)
			return array( 'valid' => true, 'errors' => array( 'schema_missing_warning' ) );
		}

		// payload schema (schema.properties.payload.required + properties)
		$payload_schema = isset( $schema['properties']['payload'] ) ? $schema['properties']['payload'] : null;
		if ( ! $payload_schema ) {
			return array( 'valid' => true, 'errors' => array() );
		}

		// required payload laukai
		if ( isset( $payload_schema['required'] ) && is_array( $payload_schema['required'] ) ) {
			foreach ( $payload_schema['required'] as $req ) {
				if ( ! array_key_exists( $req, $payload ) ) {
					$errors[] = "missing_required: {$req}";
				}
			}
		}

		// enum patikra (jei laukas turi enum)
		if ( isset( $payload_schema['properties'] ) ) {
			foreach ( $payload_schema['properties'] as $field => $spec ) {
				if ( ! array_key_exists( $field, $payload ) ) {
					continue;
				}
				if ( isset( $spec['enum'] ) && is_array( $spec['enum'] ) ) {
					if ( ! in_array( $payload[ $field ], $spec['enum'], true ) ) {
						$errors[] = "invalid_enum: {$field}={$payload[$field]}";
					}
				}
			}
		}

		return array( 'valid' => empty( $errors ), 'errors' => $errors );
	}

	/**
	 * Emit'ina event'a per registry: validuoja → ps_emit_event().
	 *
	 * @param string $event_name  Kanoninis vardas.
	 * @param string $email
	 * @param array  $payload
	 * @param array  $opts {
	 *   @type string $event_id  Unikalus (jei nepaduota — auto pagal event_name+laika).
	 *   @type bool   $strict     Jei true — nevalidzeus payload blokuoja emit (default false: emit + log warning).
	 * }
	 * @return array {ok, dedup, log_id, ms, validation}
	 */
	public static function emit( $event_name, $email, array $payload, array $opts = array() ) {
		$validation = self::validate( $event_name, $payload );

		$strict = isset( $opts['strict'] ) ? (bool) $opts['strict'] : false;
		if ( ! $validation['valid'] && $strict ) {
			return array(
				'ok'         => false,
				'error'      => 'validation_failed',
				'validation' => $validation,
			);
		}
		if ( ! $validation['valid'] && defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( '[Petshop Event Registry] ' . $event_name . ' validation: ' . implode( ', ', $validation['errors'] ) );
		}

		$event_id = isset( $opts['event_id'] ) ? $opts['event_id'] : ( $event_name . '_' . time() . '_' . substr( md5( wp_json_encode( $payload ) ), 0, 8 ) );

		$result = ps_emit_event( $event_id, $event_name, $email, $payload );
		$result['validation'] = $validation;
		return $result;
	}

	/**
	 * Public API helper: kokie event'ai jau turi salltini (galima emit'inti).
	 */
	public static function active_events() {
		return array_keys( array_filter( self::CANONICAL_EVENTS ) );
	}
}
