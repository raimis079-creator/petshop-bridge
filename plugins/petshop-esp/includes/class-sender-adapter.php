<?php
/**
 * Petshop_Sender_Adapter
 *
 * Sender.net implementacija Interface_ESP_Adapter kontraktui.
 * VIENINTELE vieta kur vyksta HTTP kvietimai i Sender API.
 * Pakeisti platforma i kita ESP = parasyti nauja klase, ne liesti likusi koda.
 *
 * Sender API v2 faktai (patvirtinti POC S180 + recon 2026-07-14):
 * - Base: https://api.sender.net/v2, Bearer auth
 * - Du tokenai: marketing (subscribers, events) + transactional (message/send)
 * - Custom fields: PATCH /subscribers/{email} su {fields:{TITLE:value}} (TITLE ne ID!)
 * - Custom event: POST /events su {subscriber:{email}, type:"...", ...props} → {message:"Event created"}
 * - Transakcinis: POST /message/send su {from,to,subject,html} (transactional token)
 * - Status modelis: subscriber.status = {email:"active|unsubscribed", temail:"active|unsubscribed"}
 *   → email = marketing consent, temail = transactional consent (ATSKIRI)
 * - Subscriber GET grazina columns[] su {id, title, type, value} — is cia skaitom PS_ reiksmes
 * - POST /subscribers ant egzistuojancio → HTTP 200 (atnaujina, NE 409 konfliktas)
 *   → upsert saugus be atskiro "ar egzistuoja" tikrinimo
 * - Rate limit: 300/min (x-ratelimit-limit header)
 *
 * Tokenu saugojimas: WordPress option'uose (base64) ARBA wp-config konstantose.
 * Dev'e — is aplinkos (bridge env). Produkcijoje — reikes irasyti i option.
 *
 * TZ v1.58 §7 (S180-B): "Vienas plonas adapteris. API kvietimai vienoje vietoje."
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Sender_Adapter implements Interface_ESP_Adapter {

	const API_BASE = 'https://api.sender.net/v2';
	const ADAPTER_NAME = 'sender';
	const HTTP_TIMEOUT = 15;
	const HEALTH_CACHE_TTL = 60;
	const HEALTH_TRANSIENT = 'petshop_esp_sender_health';

	/** @var string Marketing token (subscribers, events) */
	private $marketing_token;

	/** @var string Transactional token (message/send) */
	private $transactional_token;

	/**
	 * @param string $marketing_token
	 * @param string $transactional_token
	 */
	public function __construct( $marketing_token = '', $transactional_token = '' ) {
		$this->marketing_token = $marketing_token ?: self::get_stored_token( 'marketing' );
		$this->transactional_token = $transactional_token ?: self::get_stored_token( 'transactional' );
	}

	/**
	 * Tokenu skaitymas is WP option (base64) arba konstantos.
	 * Prioritetas: konstanta > option.
	 */
	public static function get_stored_token( $type ) {
		$const = ( $type === 'transactional' ) ? 'PETSHOP_SENDER_TRANSACTIONAL_TOKEN' : 'PETSHOP_SENDER_MARKETING_TOKEN';
		if ( defined( $const ) && constant( $const ) ) {
			return constant( $const );
		}
		$opt_key = ( $type === 'transactional' ) ? 'petshop_esp_sender_tk' : 'petshop_esp_sender_mk';
		$stored = get_option( $opt_key, '' );
		if ( $stored ) {
			$decoded = base64_decode( $stored, true );
			return $decoded !== false ? $decoded : $stored;
		}
		return '';
	}

	/**
	 * Tokenu irasymas (admin UI arba deploy metu). Base64, kad option'e nesimatytu plain.
	 */
	public static function store_token( $type, $token ) {
		$opt_key = ( $type === 'transactional' ) ? 'petshop_esp_sender_tk' : 'petshop_esp_sender_mk';
		return update_option( $opt_key, base64_encode( $token ), false );
	}

	/**
	 * Ar adapter'is turi tokenus (konfiguruotas)?
	 */
	public function is_configured() {
		return ! empty( $this->marketing_token );
	}

	// ======================================================================
	// HTTP zemas sluoksnis
	// ======================================================================

	/**
	 * Bendras HTTP request per wp_remote_request.
	 *
	 * @return array {
	 *   @type int    $code    HTTP status (0 = tinklo klaida/timeout)
	 *   @type array  $body    JSON decoded
	 *   @type string $raw     Raw body string
	 *   @type bool   $ok      2xx?
	 *   @type array  $headers
	 *   @type string $error   Jei buvo klaida
	 * }
	 */
	private function request( $method, $path, $body = null, $token = null ) {
		$token = $token ?: $this->marketing_token;
		$args = array(
			'method'  => $method,
			'timeout' => self::HTTP_TIMEOUT,
			'headers' => array(
				'Authorization' => 'Bearer ' . $token,
				'Accept'        => 'application/json',
				'Content-Type'  => 'application/json',
			),
		);
		if ( $body !== null ) {
			$args['body'] = wp_json_encode( $body );
		}

		$response = wp_remote_request( self::API_BASE . $path, $args );

		if ( is_wp_error( $response ) ) {
			return array(
				'code'    => 0,
				'body'    => array(),
				'raw'     => '',
				'ok'      => false,
				'headers' => array(),
				'error'   => $response->get_error_message(),
			);
		}

		$code = (int) wp_remote_retrieve_response_code( $response );
		$raw = wp_remote_retrieve_body( $response );
		$decoded = json_decode( $raw, true );

		return array(
			'code'    => $code,
			'body'    => is_array( $decoded ) ? $decoded : array(),
			'raw'     => $raw,
			'ok'      => ( $code >= 200 && $code < 300 ),
			'headers' => wp_remote_retrieve_headers( $response ),
			'error'   => ( $code >= 400 ) ? ( isset( $decoded['message'] ) ? $decoded['message'] : 'HTTP ' . $code ) : '',
		);
	}

	/**
	 * Ar HTTP status yra retriable (5xx, 429, tinklo klaida)?
	 * Nustato ar event turi grizti i eile, ar zymeti 'dead' is karto.
	 */
	public static function is_retriable_code( $code ) {
		if ( $code === 0 ) return true;         // tinklo klaida/timeout
		if ( $code === 429 ) return true;        // rate limit
		if ( $code >= 500 && $code < 600 ) return true; // serverio klaida
		return false;                            // 4xx (isskyrus 429) = mūsų klaida, nekartojam
	}

	// ======================================================================
	// Interface_ESP_Adapter implementacija
	// ======================================================================

	/**
	 * Sukurti/atnaujinti abonenta.
	 * Recon patvirtino: POST /subscribers ant egzistuojancio → HTTP 200 (atnaujina).
	 * Fields atskirai per PATCH (nes POST fields formatas nepatikimas — POC pamoka).
	 */
	public function upsert_contact( $email, array $attributes ) {
		if ( ! $this->is_configured() ) {
			return array( 'ok' => false, 'status' => 'error', 'esp_contact_id' => '', 'error' => 'not_configured' );
		}

		// 1. POST /subscribers — sukuria arba (jei yra) atnaujina baze
		$base_payload = array( 'email' => $email );
		// firstname/lastname jei yra
		if ( isset( $attributes['PS_PET_NAME'] ) && $attributes['PS_PET_NAME'] ) {
			// PS_PET_NAME NE firstname — augintinio vardas atskiras laukas. Nemaišom.
		}
		$r1 = $this->request( 'POST', '/subscribers', $base_payload );

		$esp_id = '';
		if ( isset( $r1['body']['data']['id'] ) ) {
			$esp_id = $r1['body']['data']['id'];
		}

		// 200 arba 201 abu OK (200 = jau egzistavo, 201 = sukurta)
		$base_ok = ( $r1['code'] === 200 || $r1['code'] === 201 );
		if ( ! $base_ok ) {
			return array(
				'ok'             => false,
				'status'         => 'error',
				'esp_contact_id' => $esp_id,
				'error'          => 'base_upsert: ' . $r1['error'],
				'retriable'      => self::is_retriable_code( $r1['code'] ),
			);
		}

		// 2. PATCH /subscribers/{email} su {fields:{TITLE:value}} — PS_ laukai
		$ps_fields = array();
		foreach ( $attributes as $key => $val ) {
			if ( strpos( $key, 'PS_' ) === 0 ) {
				// Boolean → "true"/"false" string (Sender text/number laukams)
				if ( is_bool( $val ) ) {
					$val = $val ? 'true' : 'false';
				}
				$ps_fields[ $key ] = $val;
			}
		}

		$fields_ok = true;
		$fields_err = '';
		if ( ! empty( $ps_fields ) ) {
			$r2 = $this->request( 'PATCH', '/subscribers/' . rawurlencode( $email ), array( 'fields' => $ps_fields ) );
			$fields_ok = ( $r2['code'] === 200 );
			if ( ! $fields_ok ) {
				$fields_err = 'fields_patch: ' . $r2['error'];
			}
		}

		return array(
			'ok'             => ( $base_ok && $fields_ok ),
			'status'         => ( $r1['code'] === 201 ) ? 'created' : 'updated',
			'esp_contact_id' => $esp_id,
			'error'          => $fields_err,
			'retriable'      => false,
		);
	}

	/**
	 * Iskelti custom event'a. POST /events su {subscriber:{email}, type, ...payload}.
	 * Idempotencija — call'eris (retry queue) tikrina event_log PRIES kviesdamas.
	 * Cia adapter'is TIK siuncia; already_processed grazinam false (log sluoksnis sprendzia).
	 */
	public function emit_event( $email, $event_id, $event, array $payload, $timestamp = null ) {
		if ( ! $this->is_configured() ) {
			return array( 'ok' => false, 'already_processed' => false, 'should_retry' => false, 'esp_event_id' => '', 'error' => 'not_configured' );
		}

		$request_body = array_merge(
			array(
				'subscriber' => array( 'email' => $email ),
				'type'       => $event,
			),
			$payload  // merge tag'ai + workflow property tiesiai i root
		);

		$r = $this->request( 'POST', '/events', $request_body );

		return array(
			'ok'                => $r['ok'],
			'already_processed' => false,
			'should_retry'      => ( ! $r['ok'] && self::is_retriable_code( $r['code'] ) ),
			'esp_event_id'      => isset( $r['body']['id'] ) ? $r['body']['id'] : '',
			'error'             => $r['error'],
			'http_code'         => $r['code'],
			'esp_response'      => substr( $r['raw'], 0, 500 ),
		);
	}

	/**
	 * Transakcinis laiskas per transactional token.
	 * Naudojam tik SPECIFINIAM atvejui — dauguma transakciniu eina per WC → SMTP.
	 */
	public function send_transactional_email( $to_email, $subject, $html_body, array $meta = array() ) {
		if ( empty( $this->transactional_token ) ) {
			return array( 'ok' => false, 'error' => 'no_transactional_token' );
		}

		$from_email = isset( $meta['from_email'] ) ? $meta['from_email'] : 'terra@petshop.lt';
		$from_name  = isset( $meta['from_name'] ) ? $meta['from_name'] : 'Petshop.lt';
		$to_name    = isset( $meta['to_name'] ) ? $meta['to_name'] : '';

		$body = array(
			'from'    => array( 'email' => $from_email, 'name' => $from_name ),
			'to'      => array( array( 'email' => $to_email, 'name' => $to_name ) ),
			'subject' => $subject,
			'html'    => $html_body,
		);

		$r = $this->request( 'POST', '/message/send', $body, $this->transactional_token );

		return array(
			'ok'           => $r['ok'],
			'esp_message_id' => isset( $r['body']['emailId'] ) ? $r['body']['emailId'] : ( isset( $r['body']['id'] ) ? $r['body']['id'] : '' ),
			'error'        => $r['error'],
			'http_code'    => $r['code'],
			'should_retry' => ( ! $r['ok'] && self::is_retriable_code( $r['code'] ) ),
		);
	}

	/**
	 * SMS — placeholder v0.2.0. Realus impl. kai bus LT Sender ID + kreditas.
	 */
	public function send_transactional_sms( $phone_e164, $message, array $meta = array() ) {
		// TODO v0.2.x: POST /sms arba message/send su type=sms kai Sender ID patvirtintas + kreditas.
		return array(
			'ok'    => false,
			'error' => 'sms_not_implemented_yet',
			'note'  => 'Laukia LT Sender ID patvirtinimo + SMS kredito (Etapo A blokas 8).',
		);
	}

	/**
	 * Webhook parasa (HMAC-SHA256 su signing secret).
	 * Signing secret — WP option petshop_esp_sender_webhook_secret.
	 */
	public function verify_webhook( $raw_payload, $signature ) {
		$secret = defined( 'PETSHOP_SENDER_WEBHOOK_SECRET' )
			? PETSHOP_SENDER_WEBHOOK_SECRET
			: get_option( 'petshop_esp_sender_webhook_secret', '' );
		if ( empty( $secret ) || empty( $signature ) ) {
			return false;
		}
		$expected = hash_hmac( 'sha256', $raw_payload, $secret );
		return hash_equals( $expected, $signature );
	}

	/**
	 * Health status — cache'inta 60s.
	 */
	public function get_health_status() {
		$cached = get_transient( self::HEALTH_TRANSIENT );
		if ( $cached !== false ) {
			return $cached;
		}

		$r = $this->request( 'GET', '/groups' );
		$rate_limit = 0;
		$rate_remaining = 0;
		if ( isset( $r['headers']['x-ratelimit-limit'] ) ) {
			$rate_limit = (int) $r['headers']['x-ratelimit-limit'];
		}
		if ( isset( $r['headers']['x-ratelimit-remaining'] ) ) {
			$rate_remaining = (int) $r['headers']['x-ratelimit-remaining'];
		}

		$status = array(
			'healthy'        => $r['ok'],
			'quota_used'     => null,  // Sender neteikia per si endpoint
			'quota_max'      => null,
			'rate_limit'     => $rate_limit,
			'rate_remaining' => $rate_remaining,
			'last_error'     => $r['ok'] ? '' : $r['error'],
			'last_error_at'  => $r['ok'] ? 0 : time(),
			'checked_at'     => time(),
		);

		set_transient( self::HEALTH_TRANSIENT, $status, self::HEALTH_CACHE_TTL );
		return $status;
	}

	/**
	 * Greita on/off patikra (< 3s). Naudojama pries batch, kad neleistume daug fail'u.
	 */
	public function is_operational() {
		$args = array(
			'method'  => 'GET',
			'timeout' => 3,
			'headers' => array(
				'Authorization' => 'Bearer ' . $this->marketing_token,
				'Accept'        => 'application/json',
			),
		);
		$response = wp_remote_request( self::API_BASE . '/groups', $args );
		if ( is_wp_error( $response ) ) {
			return false;
		}
		$code = (int) wp_remote_retrieve_response_code( $response );
		return ( $code >= 200 && $code < 300 );
	}

	/**
	 * Skaityti PS_ lauko reiksme is subscriber columns[] (nes /account/fields neveikia).
	 * Naudinga consent sync patikrai.
	 */
	public function get_contact_field( $email, $field_title ) {
		$r = $this->request( 'GET', '/subscribers/' . rawurlencode( $email ) );
		if ( ! $r['ok'] || ! isset( $r['body']['data']['columns'] ) ) {
			return null;
		}
		foreach ( $r['body']['data']['columns'] as $col ) {
			if ( isset( $col['title'] ) && $col['title'] === $field_title ) {
				return isset( $col['value'] ) ? $col['value'] : null;
			}
		}
		return null;
	}

	/**
	 * Gauti subscriber consent status (email=marketing, temail=transactional).
	 */
	public function get_contact_status( $email ) {
		$r = $this->request( 'GET', '/subscribers/' . rawurlencode( $email ) );
		if ( ! $r['ok'] || ! isset( $r['body']['data']['status'] ) ) {
			return null;
		}
		return $r['body']['data']['status'];  // {email:..., temail:...}
	}
}
