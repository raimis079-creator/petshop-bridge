<?php
/**
 * Petshop_ESP_Retry_Queue
 *
 * Async event processing per Action Scheduler (WooCommerce atsiveza).
 * Emit'inimas (ps_emit_event) tik istaiso i event_log 'pending'; realus
 * siuntimas i Sender vyksta ČIA, background'e, su backoff retry.
 *
 * SRAUTAS:
 * 1. ps_emit_event() → event_log 'pending' + as_enqueue_async_action('ps_esp_process_event')
 * 2. Action Scheduler paleidzia handle_process_event()
 * 3. handle → SenderAdapter->emit_event()
 *    - success → status='sent'
 *    - retriable fail (5xx/429/timeout) → status='failed', attempts++, next_retry_at=backoff, re-enqueue
 *    - non-retriable fail (4xx) → status='dead' (nekartojam, nes mūsų klaida)
 *    - 7 attempts pasiekta → status='dead' + DLQ alert email
 *
 * BACKOFF (POC S180 Test #11 patvirtinta seka): 1min, 5min, 30min, 2h, 6h, 24h + ±20% jitter.
 *
 * "GELEZINE TAISYKLE": isjungus Sender, event'ai kaupiasi 'failed' su next_retry_at,
 * niekas neprarandama. Sender atsigauna → visi issisiuncia. Idempotencija (UNIQUE key) apsaugo
 * nuo dubliu re-enqueue atveju.
 *
 * TZ v1.58 §7 (S180-B, principas 9): "retry queue su unikaliu event_id".
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_ESP_Retry_Queue {

	const ACTION_HOOK = 'ps_esp_process_event';
	const GROUP = 'petshop-esp';
	const MAX_ATTEMPTS = 7;
	const DLQ_ALERT_EMAIL = 'terra@gyvunai.lt';

	/** @var Petshop_Sender_Adapter|null */
	private static $adapter = null;

	/**
	 * Registruoja Action Scheduler hook'a. Kvieciama plugin bootstrap.
	 */
	public static function init() {
		add_action( self::ACTION_HOOK, array( __CLASS__, 'handle_process_event' ), 10, 1 );
	}

	/**
	 * Adapter'io singleton (kad tokenai kraunami karta).
	 */
	private static function adapter() {
		if ( self::$adapter === null ) {
			self::$adapter = new Petshop_Sender_Adapter();
		}
		return self::$adapter;
	}

	/**
	 * Uzplanuoja event'o apdorojima (kvieciama is ps_emit_event po INSERT).
	 * Jei Action Scheduler neprieinamas — nedaro nieko (event lieka 'pending',
	 * bus paimtas cron fallback'u process_pending_batch()).
	 *
	 * @param int $log_id  event_log eilutes id
	 */
	public static function enqueue( $log_id ) {
		if ( ! function_exists( 'as_enqueue_async_action' ) ) {
			return false;
		}
		// Idempotencija: jei jau uzplanuota siam log_id, nedubliuoti
		if ( function_exists( 'as_has_scheduled_action' ) &&
		     as_has_scheduled_action( self::ACTION_HOOK, array( 'log_id' => (int) $log_id ), self::GROUP ) ) {
			return true;
		}
		as_enqueue_async_action( self::ACTION_HOOK, array( 'log_id' => (int) $log_id ), self::GROUP );
		return true;
	}

	/**
	 * Uzplanuoja retry su delsa (backoff).
	 */
	public static function schedule_retry( $log_id, $delay_seconds ) {
		if ( ! function_exists( 'as_schedule_single_action' ) ) {
			return false;
		}
		as_schedule_single_action(
			time() + (int) $delay_seconds,
			self::ACTION_HOOK,
			array( 'log_id' => (int) $log_id ),
			self::GROUP
		);
		return true;
	}

	/**
	 * Backoff sekundemis pagal bandymo numeri (POC patvirtinta seka + jitter).
	 *
	 * @param int $attempt  Kelintas bandymas (1-based).
	 * @return int Sekundes iki kito bandymo.
	 */
	public static function backoff_seconds( $attempt ) {
		$base = array(
			1 => 60,      // 1 min
			2 => 300,     // 5 min
			3 => 1800,    // 30 min
			4 => 7200,    // 2 h
			5 => 21600,   // 6 h
			6 => 86400,   // 24 h
		);
		$seconds = isset( $base[ $attempt ] ) ? $base[ $attempt ] : 86400;
		// ±20% jitter (kad nekiltu thundering herd kai daug fail'u vienu metu)
		$jitter = (int) round( $seconds * 0.2 * ( ( mt_rand( 0, 2000 ) / 1000 ) - 1 ) );  // -20% .. +20%
		return max( 30, $seconds + $jitter );
	}

	/**
	 * Action Scheduler callback — apdoroja viena event'a.
	 *
	 * @param int $log_id
	 */
	public static function handle_process_event( $log_id ) {
		global $wpdb;
		$row = $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM `" . Petshop_ESP_Event_Log::table_name() . "` WHERE id = %d LIMIT 1",
			(int) $log_id
		) );
		if ( ! $row ) {
			return; // jau istrinta arba klaidingas id
		}
		// Jau issiusta — nekartojam (idempotencija status lygmenyje)
		if ( $row->status === 'sent' || $row->status === 'dead' || $row->status === 'skipped' ) {
			return;
		}

		$payload = json_decode( $row->payload_json, true );
		if ( ! is_array( $payload ) ) {
			$payload = array();
		}

		$adapter = self::adapter();

		// Jei adapter'is nesukonfiguruotas (nera tokenu) — palikti 'pending', nezymeti 'failed'
		if ( ! $adapter->is_configured() ) {
			Petshop_ESP_Event_Log::update( $row->id, array(
				'last_error' => 'adapter_not_configured',
			) );
			return;
		}

		// SIUNTIMAS
		$result = $adapter->emit_event(
			$row->email,
			$row->event_id,
			$row->event_name,
			$payload
		);

		if ( $result['ok'] ) {
			// SEKME
			Petshop_ESP_Event_Log::update( $row->id, array(
				'status'       => 'sent',
				'last_error'   => null,
				'esp_response' => isset( $result['esp_response'] ) ? $result['esp_response'] : null,
			) );
			return;
		}

		// NESEKME
		$attempts = (int) $row->attempts + 1;
		$retriable = ! empty( $result['should_retry'] );

		if ( ! $retriable ) {
			// 4xx = mūsų klaida, nekartojam
			Petshop_ESP_Event_Log::update( $row->id, array(
				'status'       => 'dead',
				'attempts'     => $attempts,
				'last_error'   => 'non_retriable: ' . ( isset( $result['error'] ) ? $result['error'] : 'HTTP ' . ( $result['http_code'] ?? '?' ) ),
				'esp_response' => isset( $result['esp_response'] ) ? $result['esp_response'] : null,
			) );
			self::maybe_dlq_alert( $row, 'non_retriable' );
			return;
		}

		if ( $attempts >= self::MAX_ATTEMPTS ) {
			// Ismesta — DLQ
			Petshop_ESP_Event_Log::update( $row->id, array(
				'status'     => 'dead',
				'attempts'   => $attempts,
				'last_error' => 'max_attempts (' . self::MAX_ATTEMPTS . '): ' . ( isset( $result['error'] ) ? $result['error'] : '' ),
			) );
			self::maybe_dlq_alert( $row, 'max_attempts' );
			return;
		}

		// RETRY — backoff + re-schedule
		$delay = self::backoff_seconds( $attempts );
		$next_retry = gmdate( 'Y-m-d H:i:s', time() + $delay );
		Petshop_ESP_Event_Log::update( $row->id, array(
			'status'        => 'failed',
			'attempts'      => $attempts,
			'next_retry_at' => $next_retry,
			'last_error'    => 'retriable (attempt ' . $attempts . '): ' . ( isset( $result['error'] ) ? $result['error'] : '' ),
		) );
		self::schedule_retry( $row->id, $delay );
	}

	/**
	 * Cron fallback: paima 'pending'/'failed' event'us kuriems atejo laikas,
	 * ir juos uzplanuoja (jei Action Scheduler async praleido arba adapter buvo nesukonfiguruotas).
	 * Kvieciama is WP cron (kas 5 min).
	 *
	 * @param int $limit
	 */
	public static function process_pending_batch( $limit = 50 ) {
		$adapter = self::adapter();
		// Jei Sender guli — nedaryti nieko (kad neuzkrautume fail'u).
		if ( ! $adapter->is_operational() ) {
			return array( 'skipped' => 'sender_not_operational' );
		}
		$pending = Petshop_ESP_Event_Log::get_pending( $limit );
		$enqueued = 0;
		foreach ( $pending as $row ) {
			self::enqueue( $row->id );
			$enqueued++;
		}
		return array( 'enqueued' => $enqueued );
	}

	/**
	 * DLQ alert — email adminui kai event patenka i 'dead'.
	 * Rate-limit: max 1 email per 15 min (transient), kad neuzpiltu inbox.
	 */
	private static function maybe_dlq_alert( $row, $reason ) {
		$throttle_key = 'petshop_esp_dlq_alert_sent';
		if ( get_transient( $throttle_key ) ) {
			return; // jau siuntem neseniai
		}
		$subject = '[Petshop ESP] Event pateko i DLQ (' . $reason . ')';
		$message = "Event nebus issiustas i Sender.\n\n"
			. "event_id: {$row->event_id}\n"
			. "event_name: {$row->event_name}\n"
			. "email: {$row->email}\n"
			. "attempts: {$row->attempts}\n"
			. "reason: {$reason}\n"
			. "last_error: {$row->last_error}\n\n"
			. "Patikrink Petshop ESP admin dashboard (v0.3.0) arba gaj6_ps_event_log lentele.";
		wp_mail( self::DLQ_ALERT_EMAIL, $subject, $message );
		set_transient( $throttle_key, 1, 15 * MINUTE_IN_SECONDS );
	}
}
