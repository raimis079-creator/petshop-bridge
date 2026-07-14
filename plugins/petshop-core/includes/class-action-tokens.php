<?php
/**
 * Petshop_Action_Tokens — universalūs HMAC signed action tokenai.
 *
 * NEPRIKLAUSO nuo ESP, Sender ar Google Identity. Petshop core saugumo komponentas.
 * Naudoja: magic login, prenumeratos valdymas, refill veiksmai, priminimai,
 * consent/preferences centras, siuntos praleidimas.
 *
 * SAUGUMO MODELIS (S187, konsultanto reikalavimai):
 *
 * 1. Token payload (kas pasirasoma HMAC):
 *    {version, purpose, subject_id, resource_id, action, expires_at, nonce, key_id}
 *
 * 2. DB saugom token_hash (SHA-256 nuo paties tokeno) + nonce, NE patį tokeną.
 *    Jei DB nutekės — tokenų atkurti negalima.
 *
 * 3. HMAC key rotation per key_id: keys wp_options masyve {v1:..., v2:...}.
 *    Naujas token — su naujausiu key_id. Verify — su tokeno nurodytu key_id.
 *    Rotation be visų senų tokenų invalidacijos.
 *
 * 4. SCANNER-SAFE: GET nuoroda niekada nevykdo negrįžtamo veiksmo.
 *    Email antivirusai (Outlook Safe Links) automatiškai atidaro nuorodas.
 *    Modelis: GET → confirmation page → POST → veiksmas.
 *    consume() (kuris atlieka veiksmą) — TIK POST kontekste.
 *    peek() (kuris tik nuskaito, be side-effect) — GET kontekste (confirmation page).
 *
 * 5. Susiję resource tokenai invaliduojami kartu: panaudojus vieną prenumeratos
 *    ciklo tokeną (pvz. confirm), kiti to paties (purpose_group + resource_id)
 *    tokenai (skip, reschedule, cancel) tampa negaliojantys.
 *
 * DB schema gaj6_ps_action_tokens:
 *   id            BIGINT PK
 *   token_hash    CHAR(64)      SHA-256 nuo raw token (unikalus)
 *   nonce         CHAR(32)      atsitiktinis, payload dalis
 *   purpose       VARCHAR(48)   magic_login|sub_confirm|sub_skip|sub_reschedule|sub_cancel|refill_confirm|reminder_confirm|unsubscribe|...
 *   purpose_group VARCHAR(48)   NULL; susijusiu tokenu grupavimui (pvz. "subscription_cycle_123")
 *   subject_id    BIGINT        WP user ID arba 0 (email-only)
 *   subject_email VARCHAR(191)  jei subject_id=0
 *   resource_id   VARCHAR(64)   NULL; su kuo susijes (subscription_id, reminder_id, ...)
 *   action        VARCHAR(48)   NULL; papildoma detale
 *   key_id        VARCHAR(8)    kuris HMAC key panaudotas
 *   status        VARCHAR(16)   active|used|invalidated|expired
 *   created_at    DATETIME
 *   expires_at    DATETIME
 *   used_at       DATETIME      NULL
 *   used_ip       VARCHAR(45)   NULL
 *
 * Indeksai: PK, UNIQUE(token_hash), idx_purpose_group_resource, idx_subject, idx_status_expires.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Action_Tokens {

	const TOKEN_VERSION = 1;
	const OPTION_KEYS = 'petshop_action_token_keys';       // {v1:'secret', v2:'secret', ...}
	const OPTION_CURRENT_KEY = 'petshop_action_token_current_key';  // 'v1'

	public static function table_name() {
		global $wpdb;
		return $wpdb->prefix . 'ps_action_tokens';
	}

	/**
	 * Sukurti lentele.
	 */
	public static function install() {
		global $wpdb;
		$table = self::table_name();
		$charset = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE `$table` (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			token_hash CHAR(64) NOT NULL,
			nonce CHAR(32) NOT NULL,
			purpose VARCHAR(48) NOT NULL,
			purpose_group VARCHAR(48) NULL,
			subject_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			subject_email VARCHAR(191) NULL,
			resource_id VARCHAR(64) NULL,
			action VARCHAR(48) NULL,
			key_id VARCHAR(8) NOT NULL,
			status VARCHAR(16) NOT NULL DEFAULT 'active',
			created_at DATETIME NOT NULL,
			expires_at DATETIME NOT NULL,
			used_at DATETIME NULL,
			used_ip VARCHAR(45) NULL,
			PRIMARY KEY (id),
			UNIQUE KEY uq_token_hash (token_hash),
			KEY idx_group_resource (purpose_group, resource_id),
			KEY idx_subject (subject_id, subject_email),
			KEY idx_status_expires (status, expires_at)
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

	/**
	 * Uztikrina kad egzistuoja bent vienas HMAC key. Grazina current key_id.
	 */
	public static function ensure_keys() {
		$keys = get_option( self::OPTION_KEYS, array() );
		if ( empty( $keys ) || ! is_array( $keys ) ) {
			$keys = array( 'v1' => self::random_secret() );
			update_option( self::OPTION_KEYS, $keys, false );
			update_option( self::OPTION_CURRENT_KEY, 'v1', false );
			return 'v1';
		}
		$current = get_option( self::OPTION_CURRENT_KEY, '' );
		if ( ! $current || ! isset( $keys[ $current ] ) ) {
			// pasirenkam paskutini
			$ids = array_keys( $keys );
			$current = end( $ids );
			update_option( self::OPTION_CURRENT_KEY, $current, false );
		}
		return $current;
	}

	/**
	 * Rotate key: sukuria nauja key versija + padaro ja current.
	 * Seni tokenai lieka galiojantys (verify per ju key_id).
	 *
	 * @return string naujas key_id
	 */
	public static function rotate_key() {
		$keys = get_option( self::OPTION_KEYS, array() );
		if ( ! is_array( $keys ) ) { $keys = array(); }
		// naujas key_id: v{max+1}
		$max = 0;
		foreach ( array_keys( $keys ) as $kid ) {
			if ( preg_match( '/^v(\d+)$/', $kid, $m ) ) {
				$max = max( $max, (int) $m[1] );
			}
		}
		$new_id = 'v' . ( $max + 1 );
		$keys[ $new_id ] = self::random_secret();
		update_option( self::OPTION_KEYS, $keys, false );
		update_option( self::OPTION_CURRENT_KEY, $new_id, false );
		return $new_id;
	}

	private static function random_secret() {
		return bin2hex( random_bytes( 32 ) );  // 64 hex simboliai
	}

	private static function get_key( $key_id ) {
		$keys = get_option( self::OPTION_KEYS, array() );
		return isset( $keys[ $key_id ] ) ? $keys[ $key_id ] : null;
	}

	/**
	 * Sugeneruoti token'a.
	 *
	 * @param array $args {
	 *   @type string $purpose        (privalomas)
	 *   @type int    $subject_id     WP user ID (0 jei email-only)
	 *   @type string $subject_email  jei subject_id=0
	 *   @type string $resource_id    su kuo susijes (pvz. subscription_id)
	 *   @type string $purpose_group  susijusiu tokenu grupei (pvz. "subscription_cycle_123")
	 *   @type string $action         papildoma detale
	 *   @type int    $ttl_seconds    galiojimas (default 30 min)
	 * }
	 * @return string|false Raw token (base64url) arba false.
	 */
	public static function generate( array $args ) {
		if ( empty( $args['purpose'] ) ) {
			return false;
		}
		global $wpdb;

		$key_id = self::ensure_keys();
		$secret = self::get_key( $key_id );
		if ( ! $secret ) {
			return false;
		}

		$nonce = bin2hex( random_bytes( 16 ) );  // 32 hex
		$ttl = isset( $args['ttl_seconds'] ) ? (int) $args['ttl_seconds'] : 1800;  // 30 min
		$now = time();
		$expires_ts = $now + $ttl;

		$payload = array(
			'version'     => self::TOKEN_VERSION,
			'purpose'     => $args['purpose'],
			'subject_id'  => isset( $args['subject_id'] ) ? (int) $args['subject_id'] : 0,
			'resource_id' => isset( $args['resource_id'] ) ? (string) $args['resource_id'] : '',
			'action'      => isset( $args['action'] ) ? (string) $args['action'] : '',
			'expires_at'  => $expires_ts,
			'nonce'       => $nonce,
			'key_id'      => $key_id,
		);

		$payload_json = wp_json_encode( $payload, JSON_UNESCAPED_SLASHES );
		$payload_b64 = self::b64url_encode( $payload_json );
		$signature = hash_hmac( 'sha256', $payload_b64, $secret );
		$raw_token = $payload_b64 . '.' . $signature;

		$token_hash = hash( 'sha256', $raw_token );

		$inserted = $wpdb->insert(
			self::table_name(),
			array(
				'token_hash'    => $token_hash,
				'nonce'         => $nonce,
				'purpose'       => substr( $args['purpose'], 0, 48 ),
				'purpose_group' => isset( $args['purpose_group'] ) ? substr( $args['purpose_group'], 0, 48 ) : null,
				'subject_id'    => isset( $args['subject_id'] ) ? (int) $args['subject_id'] : 0,
				'subject_email' => isset( $args['subject_email'] ) ? sanitize_email( $args['subject_email'] ) : null,
				'resource_id'   => isset( $args['resource_id'] ) ? substr( (string) $args['resource_id'], 0, 64 ) : null,
				'action'        => isset( $args['action'] ) ? substr( (string) $args['action'], 0, 48 ) : null,
				'key_id'        => $key_id,
				'status'        => 'active',
				'created_at'    => gmdate( 'Y-m-d H:i:s', $now ),
				'expires_at'    => gmdate( 'Y-m-d H:i:s', $expires_ts ),
			),
			array( '%s','%s','%s','%s','%d','%s','%s','%s','%s','%s','%s','%s' )
		);

		if ( ! $inserted ) {
			return false;
		}
		return $raw_token;
	}

	/**
	 * PEEK — nuskaito token'a BE side-effect (scanner-safe, GET kontekstui).
	 * Naudojama confirmation page rodymui. NEKEIČIA status.
	 *
	 * @param string $raw_token
	 * @return array {valid, reason, row} — row = DB eilute (jei valid).
	 */
	public static function peek( $raw_token ) {
		return self::validate_internal( $raw_token, false );
	}

	/**
	 * CONSUME — patikrina + atlieka veiksma (status→used) + invaliduoja susijusius.
	 * TIK POST kontekste (negrįžtamas veiksmas). Scanner-safe.
	 *
	 * @param string $raw_token
	 * @return array {valid, reason, row}
	 */
	public static function consume( $raw_token ) {
		$result = self::validate_internal( $raw_token, true );
		return $result;
	}

	/**
	 * Vidine validacija.
	 *
	 * @param string $raw_token
	 * @param bool   $mark_used  jei true — pazymi used + invaliduoja susijusius (consume).
	 * @return array {valid, reason, row}
	 */
	private static function validate_internal( $raw_token, $mark_used ) {
		global $wpdb;

		if ( ! is_string( $raw_token ) || strpos( $raw_token, '.' ) === false ) {
			return array( 'valid' => false, 'reason' => 'malformed' );
		}

		list( $payload_b64, $signature ) = explode( '.', $raw_token, 2 );
		$payload_json = self::b64url_decode( $payload_b64 );
		$payload = json_decode( $payload_json, true );

		if ( ! is_array( $payload ) || empty( $payload['key_id'] ) ) {
			return array( 'valid' => false, 'reason' => 'bad_payload' );
		}

		// HMAC verify su tokeno nurodytu key_id
		$secret = self::get_key( $payload['key_id'] );
		if ( ! $secret ) {
			return array( 'valid' => false, 'reason' => 'unknown_key' );
		}
		$expected = hash_hmac( 'sha256', $payload_b64, $secret );
		if ( ! hash_equals( $expected, $signature ) ) {
			return array( 'valid' => false, 'reason' => 'bad_signature' );
		}

		// Expiry pagal payload
		if ( empty( $payload['expires_at'] ) || (int) $payload['expires_at'] < time() ) {
			return array( 'valid' => false, 'reason' => 'expired' );
		}

		// DB eilute pagal token_hash
		$token_hash = hash( 'sha256', $raw_token );
		$row = $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM `" . self::table_name() . "` WHERE token_hash = %s LIMIT 1",
			$token_hash
		) );

		if ( ! $row ) {
			return array( 'valid' => false, 'reason' => 'not_found' );
		}
		if ( $row->status !== 'active' ) {
			return array( 'valid' => false, 'reason' => 'already_' . $row->status, 'row' => $row );
		}
		// DB expiry double-check
		if ( strtotime( $row->expires_at . ' UTC' ) < time() ) {
			$wpdb->update( self::table_name(), array( 'status' => 'expired' ), array( 'id' => $row->id ) );
			return array( 'valid' => false, 'reason' => 'expired', 'row' => $row );
		}

		if ( $mark_used ) {
			$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
			// 1. Pazymim si token'a used
			$wpdb->update(
				self::table_name(),
				array( 'status' => 'used', 'used_at' => gmdate( 'Y-m-d H:i:s' ), 'used_ip' => substr( $ip, 0, 45 ) ),
				array( 'id' => $row->id )
			);
			// 2. Invaliduojam susijusius (tas pats purpose_group + resource_id, isskyrus si)
			if ( ! empty( $row->purpose_group ) ) {
				$wpdb->query( $wpdb->prepare(
					"UPDATE `" . self::table_name() . "`
					 SET status = 'invalidated'
					 WHERE purpose_group = %s
					   AND status = 'active'
					   AND id != %d",
					$row->purpose_group,
					$row->id
				) );
			}
		}

		return array( 'valid' => true, 'reason' => 'ok', 'row' => $row );
	}

	/**
	 * Invaliduoti visus aktyvius token'us pagal purpose_group (rankinis).
	 */
	public static function invalidate_group( $purpose_group ) {
		global $wpdb;
		return $wpdb->query( $wpdb->prepare(
			"UPDATE `" . self::table_name() . "` SET status = 'invalidated'
			 WHERE purpose_group = %s AND status = 'active'",
			$purpose_group
		) );
	}

	/**
	 * Isvalyti pasenusius tokenus (cron). Expired > 7 d. — trinam.
	 */
	public static function purge_expired() {
		global $wpdb;
		return $wpdb->query(
			"DELETE FROM `" . self::table_name() . "`
			 WHERE status IN ('used','invalidated','expired')
			   AND expires_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 7 DAY)"
		);
	}

	// --- base64url helper'iai ---
	private static function b64url_encode( $data ) {
		return rtrim( strtr( base64_encode( $data ), '+/', '-_' ), '=' );
	}
	private static function b64url_decode( $data ) {
		return base64_decode( strtr( $data, '-_', '+/' ) );
	}
}
