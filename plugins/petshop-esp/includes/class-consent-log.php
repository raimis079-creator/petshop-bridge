<?php
/**
 * Petshop_ESP_Consent_Log
 *
 * Sutikimu (consent) istorijos zurnalas — GDPR/teisinis irodymas.
 * KIEKVIENAS marketing consent pakeitimas irasomas: kas, kada, is kur, koks IP/UA.
 *
 * TZ v1.58 §4 (retencijos doktrina): "Consent tiesa — MŪSŲ DB. Sender = kopija."
 * ps_consent_log = viena tiesa. PS_MARKETING_CONSENT Sender pusej — tik atspindys.
 *
 * Schema gaj6_ps_consent_log:
 *   id           BIGINT PK
 *   customer_id  BIGINT (WP user ID; 0 jei guest/email-only)
 *   email        VARCHAR(191)
 *   field        VARCHAR(48)   'marketing_consent' | 'transactional_only'
 *   from_value   VARCHAR(16)   'true'|'false'|'' (buvusi reiksme)
 *   to_value     VARCHAR(16)   nauja reiksme
 *   source       VARCHAR(32)   'checkout'|'mano-paskyra'|'unsubscribe-link'|'webhook'|'import'|'admin'
 *   ip           VARCHAR(45)   IPv4/IPv6
 *   user_agent   VARCHAR(255)
 *   changed_at   DATETIME (UTC)
 *
 * Indeksai: PK, idx_email, idx_customer, idx_changed_at.
 *
 * Retencija: NIEKADA netrinam (teisinis irodymas). Auga letai (tik consent pakeitimai).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_ESP_Consent_Log {

	public static function table_name() {
		global $wpdb;
		return $wpdb->prefix . 'ps_consent_log';
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
			customer_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
			email VARCHAR(191) NOT NULL,
			field VARCHAR(48) NOT NULL,
			from_value VARCHAR(16) NULL,
			to_value VARCHAR(16) NOT NULL,
			source VARCHAR(32) NOT NULL,
			ip VARCHAR(45) NULL,
			user_agent VARCHAR(255) NULL,
			changed_at DATETIME NOT NULL,
			PRIMARY KEY (id),
			KEY idx_email (email),
			KEY idx_customer (customer_id),
			KEY idx_changed_at (changed_at)
		) $charset";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	/**
	 * Uztikrina lentele.
	 */
	public static function maybe_install() {
		global $wpdb;
		$table = self::table_name();
		if ( ! $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $table ) ) ) {
			self::install();
		}
	}

	/**
	 * Irasyti consent pakeitima.
	 *
	 * @param array $data {
	 *   @type int    $customer_id
	 *   @type string $email       (privalomas)
	 *   @type string $field       marketing_consent|transactional_only
	 *   @type string $from_value
	 *   @type string $to_value    (privalomas)
	 *   @type string $source      checkout|mano-paskyra|unsubscribe-link|webhook|import|admin
	 *   @type string $ip          (jei nepaduota, imam is REMOTE_ADDR)
	 *   @type string $user_agent  (jei nepaduota, imam is HTTP_USER_AGENT)
	 * }
	 * @return int|false Iraso ID arba false.
	 */
	public static function record( array $data ) {
		global $wpdb;
		if ( empty( $data['email'] ) || ! isset( $data['to_value'] ) || empty( $data['field'] ) ) {
			return false;
		}

		$ip = isset( $data['ip'] ) ? $data['ip'] : ( isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '' );
		$ua = isset( $data['user_agent'] ) ? $data['user_agent'] : ( isset( $_SERVER['HTTP_USER_AGENT'] ) ? substr( sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ), 0, 255 ) : '' );

		$inserted = $wpdb->insert(
			self::table_name(),
			array(
				'customer_id' => isset( $data['customer_id'] ) ? (int) $data['customer_id'] : 0,
				'email'       => sanitize_email( $data['email'] ),
				'field'       => substr( $data['field'], 0, 48 ),
				'from_value'  => isset( $data['from_value'] ) ? substr( (string) $data['from_value'], 0, 16 ) : null,
				'to_value'    => substr( (string) $data['to_value'], 0, 16 ),
				'source'      => substr( isset( $data['source'] ) ? $data['source'] : 'unknown', 0, 32 ),
				'ip'          => substr( $ip, 0, 45 ),
				'user_agent'  => $ua,
				'changed_at'  => current_time( 'mysql', true ),
			),
			array( '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
		);
		return $inserted ? (int) $wpdb->insert_id : false;
	}

	/**
	 * Paskutine consent reiksme konkreciam email+field (dabartine tiesa).
	 */
	public static function current_value( $email, $field = 'marketing_consent' ) {
		global $wpdb;
		return $wpdb->get_var( $wpdb->prepare(
			"SELECT to_value FROM `" . self::table_name() . "`
			 WHERE email = %s AND field = %s
			 ORDER BY id DESC LIMIT 1",
			sanitize_email( $email ),
			$field
		) );
	}

	/**
	 * Consent istorija konkreciam email (audit).
	 */
	public static function history( $email, $limit = 50 ) {
		global $wpdb;
		return $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM `" . self::table_name() . "`
			 WHERE email = %s ORDER BY id DESC LIMIT %d",
			sanitize_email( $email ),
			(int) $limit
		) );
	}
}
