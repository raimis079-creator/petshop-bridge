<?php
/**
 * Petshop_ESP_Webhook_Receiver
 *
 * Produkcinis Sender webhook prijemimas. Registruoja REST endpoint:
 *   POST /wp-json/petshop/v1/sender-webhook
 *
 * SAUGUMAS:
 * - HMAC-SHA256 signature verify (SenderAdapter->verify_webhook)
 * - Signing secret WP option petshop_esp_sender_webhook_secret
 * - Jei parasas neteisingas → 401, nedaro nieko
 *
 * SENDER WEBHOOK TOPIKAI (kuriuos apdorojam):
 * - subscribers/unsubscribed → Consent_Sync::handle_sender_unsubscribe
 * - subscribers/bounced (hard) → Consent_Sync::handle_sender_bounce
 * - subscribers/spam_reported → Consent_Sync::handle_sender_bounce (traktuojam kaip bounce)
 * - subscribers/updated → (log tik; ateity gali sinchronizuoti atgal)
 *
 * IDEMPOTENCIJA: Sender webhook gali pakartoti ta pati event'a. Apsauga per
 * consent_log (jei reiksme jau tokia, handleris grazina unchanged).
 *
 * POC #4 (geltonas) uzbaigimas: Sender webhookai fire'ina TIK ant realiu user
 * veiksmu (ne API pakeitimu). Todel end-to-end testas reikalauja realaus unsubscribe.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_ESP_Webhook_Receiver {

	const NAMESPACE = 'petshop/v1';
	const ROUTE = '/sender-webhook';
	const SIGNATURE_HEADER = 'x-sender-signature';  // Sender siunciamo parašo header'is

	/**
	 * Registruoja REST route.
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_route' ) );
	}

	public static function register_route() {
		register_rest_route( self::NAMESPACE, self::ROUTE, array(
			'methods'             => 'POST',
			'callback'            => array( __CLASS__, 'handle' ),
			'permission_callback' => '__return_true',  // auth per HMAC signature, ne WP capability
		) );
	}

	/**
	 * Webhook handleris.
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public static function handle( $request ) {
		$raw = $request->get_body();
		$signature = $request->get_header( self::SIGNATURE_HEADER );

		// HMAC verify — jei secret sukonfiguruotas
		$secret = defined( 'PETSHOP_SENDER_WEBHOOK_SECRET' )
			? PETSHOP_SENDER_WEBHOOK_SECRET
			: get_option( 'petshop_esp_sender_webhook_secret', '' );

		if ( ! empty( $secret ) ) {
			$adapter = function_exists( 'ps_esp_adapter' ) ? ps_esp_adapter() : new Petshop_Sender_Adapter();
			if ( ! $adapter->verify_webhook( $raw, $signature ) ) {
				return new WP_REST_Response( array( 'error' => 'invalid_signature' ), 401 );
			}
		}
		// Jei secret nesukonfiguruotas — dev'e leidziam (bet loginam WARNING)
		elseif ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( '[Petshop ESP] Webhook be signing secret — DEV rezimas. Produkcijoje BUTINA nustatyti petshop_esp_sender_webhook_secret.' );
		}

		$payload = json_decode( $raw, true );
		if ( ! is_array( $payload ) ) {
			return new WP_REST_Response( array( 'error' => 'invalid_json' ), 400 );
		}

		// Sender webhook struktura: {type: "subscribers/unsubscribed", data: {email: ...}}
		// arba array of events. Normalizuojam.
		$events = self::normalize_events( $payload );
		$processed = 0;
		$results = array();

		foreach ( $events as $event ) {
			$type = isset( $event['type'] ) ? $event['type'] : '';
			$email = self::extract_email( $event );
			if ( ! $email ) {
				$results[] = array( 'type' => $type, 'skipped' => 'no_email' );
				continue;
			}

			$r = self::route_event( $type, $email, $event );
			$results[] = array( 'type' => $type, 'email' => $email, 'result' => $r );
			$processed++;
		}

		return new WP_REST_Response( array(
			'ok'        => true,
			'processed' => $processed,
			'results'   => $results,
		), 200 );
	}

	/**
	 * Nukreipia event'a i atitinkama handleri.
	 */
	private static function route_event( $type, $email, $event ) {
		switch ( $type ) {
			case 'subscribers/unsubscribed':
			case 'subscriber.unsubscribed':
			case 'unsubscribe':
				return Petshop_Consent_Sync::handle_sender_unsubscribe( $email );

			case 'subscribers/bounced':
			case 'subscriber.bounced':
			case 'bounce':
			case 'hard_bounce':
			case 'subscribers/spam_reported':
			case 'spam':
			case 'spam_report':
				return Petshop_Consent_Sync::handle_sender_bounce( $email );

			case 'subscribers/updated':
			case 'subscriber.updated':
				// Kol kas tik log (ateity — atgalinis sync jei reikes)
				return array( 'ok' => true, 'action' => 'logged_only' );

			default:
				return array( 'ok' => true, 'action' => 'ignored', 'type' => $type );
		}
	}

	/**
	 * Normalizuoja payload'a i event'u masyva.
	 * Sender gali siusti viena event'a arba masyva.
	 */
	private static function normalize_events( $payload ) {
		// Jei turi 'type' root'e — vienas event
		if ( isset( $payload['type'] ) ) {
			return array( $payload );
		}
		// Jei turi 'events' masyva
		if ( isset( $payload['events'] ) && is_array( $payload['events'] ) ) {
			return $payload['events'];
		}
		// Jei pats yra indeksuotas masyvas
		if ( isset( $payload[0] ) ) {
			return $payload;
		}
		// Fallback — traktuojam kaip viena
		return array( $payload );
	}

	/**
	 * Istraukia email is ivairiu galimu Sender payload struktura.
	 */
	private static function extract_email( $event ) {
		if ( isset( $event['data']['email'] ) ) return sanitize_email( $event['data']['email'] );
		if ( isset( $event['email'] ) ) return sanitize_email( $event['email'] );
		if ( isset( $event['subscriber']['email'] ) ) return sanitize_email( $event['subscriber']['email'] );
		if ( isset( $event['data']['subscriber']['email'] ) ) return sanitize_email( $event['data']['subscriber']['email'] );
		return '';
	}

	/**
	 * Sugeneruoja + irašo webhook signing secret (jei dar nera).
	 * Kviesim deploy metu. Grazina secret'a (kad galetume ji irašyti Sender pusej).
	 */
	public static function ensure_secret() {
		$existing = get_option( 'petshop_esp_sender_webhook_secret', '' );
		if ( ! empty( $existing ) ) {
			return $existing;
		}
		$secret = wp_generate_password( 40, false, false );
		update_option( 'petshop_esp_sender_webhook_secret', $secret, false );
		return $secret;
	}

	/**
	 * Webhook URL (produkcijoje petshop.lt, dev'e dev.avesa.lt).
	 */
	public static function webhook_url() {
		return rest_url( self::NAMESPACE . self::ROUTE );
	}
}
