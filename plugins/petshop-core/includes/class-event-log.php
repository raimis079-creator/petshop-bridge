<?php
/**
 * Petshop_Event_Log
 *
 * DB sluoksnis pries event log lentele (gaj6_ps_event_log).
 * Uztikrina idempotencija per UNIQUE(event_id, adapter_name).
 *
 * Naudojama:
 * - ps_emit_event() public API (main file)
 * - Petshop_ESP_Retry_Queue worker (v0.2.0)
 * - Health check dashboard (v0.3.0)
 * - Admin UI (v0.3.0)
 *
 * Schema:
 *   id              BIGINT PK
 *   event_id        VARCHAR(191)  UNIQUE per adapter
 *   event_name      VARCHAR(64)   snake_case (order_paid, refill_due, ...)
 *   email           VARCHAR(191)  recipient
 *   payload_json    LONGTEXT      JSON encoded
 *   emitted_at      DATETIME
 *   status          VARCHAR(16)   'pending' | 'sent' | 'failed' | 'dead' | 'skipped'
 *   adapter_name    VARCHAR(32)   'sender' | (ateity kiti)
 *   attempts        TINYINT       kiek retry'u pabandyta
 *   next_retry_at   DATETIME NULL Action Scheduler nustato
 *   last_error      VARCHAR(255) NULL
 *   esp_response    TEXT NULL     paskutinio siuntimo ESP atsakas (debug'ui)
 *
 * Retencija (v0.3.0 admin UI leis daryti valymo cron):
 *   status=sent  → 90 dienu
 *   status=dead  → 365 dienu
 *   status=other → nekliudom
 *
 * TZ v1.58 §7 (S180-B, principas 9):
 *   "Vietinis event zurnalas + retry queue su unikaliu event_id."
 *
 * POC pamokos (S180 Testai #3 + #11):
 * - INSERT IGNORE veikia, nes UNIQUE(event_id, adapter_name)
 * - cycle_n dinamiskai keiciamas periodiniams (refill_due:cust123:sku456:c1, c2, c3)
 * - Migracija: senas Test #3 lenteles versijas gali stigti stulpelu (next_retry_at, attempts, last_error)
 *   → maybe_install() daro ALTER TABLE ADD COLUMN IF NOT EXISTS
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * MIGRACIJA (S186): Perkelta iš petshop-esp/includes/class-event-log.php.
 * Klase Petshop_ESP_Event_Log pervadinta i Petshop_Event_Log.
 * DB lentele gaj6_ps_event_log ta pati — jokiu schema pakeitimu.
 * petshop-esp v0.4.0 palieka class_alias('Petshop_Event_Log','Petshop_ESP_Event_Log')
 * backward compat pereinamuoju laikotarpiu.
 */
class Petshop_Event_Log {

	const DB_VERSION_OPTION = 'petshop_esp_event_log_db_version';
	const CURRENT_DB_VERSION = '0.1.0';

	/**
	 * Grazina lenteles pavadinima su WP prefiksu (gaj6_ps_event_log dev'e).
	 */
	public static function table_name() {
		global $wpdb;
		return $wpdb->prefix . 'ps_event_log';
	}

	/**
	 * Sukurti lentele (aktyvavimo hook'as). Naudoja dbDelta.
	 */
	public static function install() {
		global $wpdb;
		$table = self::table_name();
		$charset = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE `$table` (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			event_id VARCHAR(191) NOT NULL,
			event_name VARCHAR(64) NOT NULL,
			email VARCHAR(191) NOT NULL,
			payload_json LONGTEXT,
			emitted_at DATETIME NOT NULL,
			status VARCHAR(16) NOT NULL DEFAULT 'pending',
			adapter_name VARCHAR(32) NOT NULL DEFAULT 'sender',
			attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
			next_retry_at DATETIME NULL,
			last_error VARCHAR(255) NULL,
			esp_response TEXT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY uq_event_id_adapter (event_id, adapter_name),
			KEY idx_status_retry (status, next_retry_at),
			KEY idx_email (email),
			KEY idx_emitted_at (emitted_at)
		) $charset";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
		update_option( self::DB_VERSION_OPTION, self::CURRENT_DB_VERSION );
	}

	/**
	 * Uztikrina, kad lentele egzistuoja + turi visus stulpelius.
	 * Kvieciama plugins_loaded (kad aktyvavimo praleista atveju vis dar veiktu).
	 *
	 * POC v1.58 pamoka: sena lentele is Testo #3 gali stigti next_retry_at, attempts, last_error →
	 * pridedame ALTER TABLE be klaidos.
	 */
	public static function maybe_install() {
		global $wpdb;
		$table = self::table_name();
		$exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $table ) );
		if ( ! $exists ) {
			self::install();
			return;
		}
		// Lentele yra — patikrinam stulpelius
		$cols = $wpdb->get_col( "SHOW COLUMNS FROM `$table`" );
		$missing = array();
		if ( ! in_array( 'attempts', $cols, true ) ) {
			$wpdb->query( "ALTER TABLE `$table` ADD COLUMN attempts TINYINT UNSIGNED NOT NULL DEFAULT 0" );
			$missing[] = 'attempts';
		}
		if ( ! in_array( 'next_retry_at', $cols, true ) ) {
			$wpdb->query( "ALTER TABLE `$table` ADD COLUMN next_retry_at DATETIME NULL" );
			$missing[] = 'next_retry_at';
		}
		if ( ! in_array( 'last_error', $cols, true ) ) {
			$wpdb->query( "ALTER TABLE `$table` ADD COLUMN last_error VARCHAR(255) NULL" );
			$missing[] = 'last_error';
		}
		if ( ! in_array( 'esp_response', $cols, true ) ) {
			$wpdb->query( "ALTER TABLE `$table` ADD COLUMN esp_response TEXT NULL" );
			$missing[] = 'esp_response';
		}
		// Indeksai — patikrinam (dbDelta indeksu ALTER'iais elgiasi kaprizingai, geriau SHOW INDEX)
		$idx_rows = $wpdb->get_results( "SHOW INDEX FROM `$table`" );
		$idx_names = array_unique( array_map( function( $r ) { return $r->Key_name; }, $idx_rows ) );
		if ( ! in_array( 'uq_event_id_adapter', $idx_names, true ) ) {
			$wpdb->query( "ALTER TABLE `$table` ADD UNIQUE KEY uq_event_id_adapter (event_id, adapter_name)" );
		}
		if ( ! in_array( 'idx_status_retry', $idx_names, true ) ) {
			$wpdb->query( "ALTER TABLE `$table` ADD KEY idx_status_retry (status, next_retry_at)" );
		}
		if ( count( $missing ) > 0 ) {
			error_log( '[Petshop ESP] event_log migration: pridedami stulpeliai: ' . implode( ',', $missing ) );
		}
	}

	/**
	 * INSERT IGNORE — idempotencijos pagrindas.
	 *
	 * @param string $event_id     Deterministinis unique per adapter.
	 * @param string $event_name   snake_case.
	 * @param string $email
	 * @param array  $payload      JSON encode'inamas.
	 * @param string $adapter_name Default 'sender'.
	 * @return array {
	 *     @type bool $ok
	 *     @type bool $dedup    True jei jau egzistavo (INSERT IGNORE row=0).
	 *     @type int  $log_id   PRIMARY key jei istaisyta arba jei jau buvo (get_by_event_id).
	 * }
	 */
	public static function insert( $event_id, $event_name, $email, array $payload, $adapter_name = 'sender' ) {
		global $wpdb;
		$table = self::table_name();

		$payload_json = wp_json_encode( $payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		if ( $payload_json === false ) {
			$payload_json = '{"_error":"json_encode failed"}';
		}

		$sql = $wpdb->prepare(
			"INSERT IGNORE INTO `$table`
			 (event_id, event_name, email, payload_json, emitted_at, status, adapter_name)
			 VALUES (%s, %s, %s, %s, %s, 'pending', %s)",
			$event_id,
			$event_name,
			$email,
			$payload_json,
			current_time( 'mysql', true ),  // UTC
			$adapter_name
		);
		$rows_affected = $wpdb->query( $sql );

		// $rows_affected: 1 = istaisyta; 0 = dedup (uzblokuota UNIQUE).
		// Grazinam log_id abiem atvejais (naudinga call'eriui).
		$existing = self::get_by_event_id( $event_id, $adapter_name );
		$log_id = $existing ? (int) $existing->id : 0;

		return array(
			'ok'     => ( $rows_affected !== false ),
			'dedup'  => ( $rows_affected === 0 ),
			'log_id' => $log_id,
		);
	}

	/**
	 * Grazina eilute pagal event_id + adapter (dedup patikrai + debug'ui).
	 */
	public static function get_by_event_id( $event_id, $adapter_name = 'sender' ) {
		global $wpdb;
		$table = self::table_name();
		return $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM `$table` WHERE event_id = %s AND adapter_name = %s LIMIT 1",
			$event_id,
			$adapter_name
		) );
	}

	/**
	 * Pending event'ai kurie laukia siuntimo (Action Scheduler v0.2.0 kvies).
	 * Grazina TIK tuos kurie:
	 * - status = 'pending' arba 'failed' su pribuvusia next_retry_at
	 * - order by id ASC (FIFO)
	 */
	public static function get_pending( $limit = 50, $adapter_name = 'sender' ) {
		global $wpdb;
		$table = self::table_name();
		return $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM `$table`
			 WHERE adapter_name = %s
			   AND status IN ('pending', 'failed')
			   AND ( next_retry_at IS NULL OR next_retry_at <= UTC_TIMESTAMP() )
			 ORDER BY id ASC
			 LIMIT %d",
			$adapter_name,
			(int) $limit
		) );
	}

	/**
	 * Atnaujina eilutes status/attempts/next_retry_at/last_error/esp_response.
	 *
	 * @param int   $id
	 * @param array $updates  Leidziami raktai: status, attempts, next_retry_at, last_error, esp_response
	 * @return bool
	 */
	public static function update( $id, array $updates ) {
		global $wpdb;
		$table = self::table_name();
		$allowed = array( 'status', 'attempts', 'next_retry_at', 'last_error', 'esp_response' );
		$safe = array();
		foreach ( $allowed as $k ) {
			if ( array_key_exists( $k, $updates ) ) {
				$safe[ $k ] = $updates[ $k ];
			}
		}
		if ( empty( $safe ) ) return false;
		return (bool) $wpdb->update( $table, $safe, array( 'id' => (int) $id ) );
	}

	/**
	 * Skaicius pagal statusa (health dashboard'ui).
	 */
	public static function count_by_status( $adapter_name = 'sender', $since_hours = 24 ) {
		global $wpdb;
		$table = self::table_name();
		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT status, COUNT(*) as cnt FROM `$table`
			 WHERE adapter_name = %s AND emitted_at >= (UTC_TIMESTAMP() - INTERVAL %d HOUR)
			 GROUP BY status",
			$adapter_name,
			(int) $since_hours
		) );
		$out = array( 'pending' => 0, 'sent' => 0, 'failed' => 0, 'dead' => 0, 'skipped' => 0 );
		foreach ( $rows as $r ) {
			$out[ $r->status ] = (int) $r->cnt;
		}
		return $out;
	}

	/**
	 * Retencijos valymas (v0.3.0 admin UI kvies).
	 */
	public static function purge_old( $adapter_name = 'sender' ) {
		global $wpdb;
		$table = self::table_name();
		$purged = array();
		$purged['sent_90d'] = (int) $wpdb->query( $wpdb->prepare(
			"DELETE FROM `$table` WHERE adapter_name = %s AND status = 'sent'
			 AND emitted_at < (UTC_TIMESTAMP() - INTERVAL 90 DAY)",
			$adapter_name
		) );
		$purged['dead_365d'] = (int) $wpdb->query( $wpdb->prepare(
			"DELETE FROM `$table` WHERE adapter_name = %s AND status = 'dead'
			 AND emitted_at < (UTC_TIMESTAMP() - INTERVAL 365 DAY)",
			$adapter_name
		) );
		return $purged;
	}
}
