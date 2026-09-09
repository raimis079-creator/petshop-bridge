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
 * S1478 (2026-08-29): G4 ANALITIKA — delivered/opened/clicked topikai
 * atnaujina ps_email_jobs.delivered_at/opened_at/clicked_at (first-touch,
 * NULL -> data; pakartojimai neperraso). Atitikimas: provider_message_id,
 * fallback — naujausias 'sent' job'as tam email per 14 d. Topiku aliasu
 * sarasas platus, nes tikslus Sender vardai pasitvirtins gyvai; nezinomi
 * ir toliau grazina 'ignored'. Sprendimo kilme: registro „NESTATOM" perrasytas
 * savininko 2026-08-29 nurodymu daryti visa marketingo sarasa.
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

		// S1665: zalias zurnalas (rolling 20) — payload formos ir paraso headerio diagnostikai.
		$zl = get_option( 'ps_sender_webhook_log', array() );
		if ( ! is_array( $zl ) ) { $zl = array(); }
		$hs = array();
		foreach ( array( 'x-sender-signature', 'x-signature', 'signature', 'x-hub-signature', 'x-webhook-signature', 'user-agent', 'content-type' ) as $hk ) {
			$hv = $request->get_header( $hk );
			if ( $hv ) { $hs[ $hk ] = mb_substr( $hv, 0, 100 ); }
		}
		$zl[] = array( 't' => current_time( 'mysql' ), 'topic_get' => sanitize_text_field( (string) $request->get_param( 'ps_topic' ) ), 'headers' => $hs, 'body' => mb_substr( $raw, 0, 2000 ) );
		if ( count( $zl ) > 20 ) { $zl = array_slice( $zl, -20 ); }
		update_option( 'ps_sender_webhook_log', $zl, false );

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

		$topic_get = sanitize_text_field( (string) $request->get_param( 'ps_topic' ) );
		foreach ( $events as $event ) {
			$type = isset( $event['type'] ) ? $event['type'] : '';
			if ( $type === '' && isset( $event['topic'] ) ) { $type = (string) $event['topic']; }
			if ( $type === '' && $topic_get !== '' ) { $type = $topic_get; }
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
			case 'groups/unsubscribed':
				// Grupes palikimas != globalus unsubscribe — jokio suppression.
				return array( 'ok' => true, 'action' => 'ignored_group_unsub' );

			case 'subscribers/unsubscribed':
			case 'subscriber.unsubscribed':
			case 'unsubscribe':
				// S314: atsisakymas liecia TIK marketingo kanala.
				if ( class_exists( 'Petshop_Email_Suppression' ) ) {
					Petshop_Email_Suppression::suppress(
						$email, Petshop_Email_Suppression::CH_MARKETING, 'unsubscribe', 'sender_webhook' );
				}
				return Petshop_Consent_Sync::handle_sender_unsubscribe( $email );

			case 'bounces/new':
			case 'subscribers/bounced':
			case 'subscriber.bounced':
			case 'bounce':
			case 'hard_bounce':
			case 'subscribers/spam_reported':
			case 'spam':
			case 'spam_report':
				// S314: bounce = pristatymo klaida -> liecia ABU kanalus.
				// spam skundas -> marketinga; transakciniu del skundo neblokuojam.
				if ( class_exists( 'Petshop_Email_Suppression' ) ) {
					$is_spam = ( strpos( $type, 'spam' ) !== false );
					Petshop_Email_Suppression::suppress(
						$email, Petshop_Email_Suppression::CH_MARKETING,
						$is_spam ? 'spam' : 'bounce', 'sender_webhook' );
					if ( ! $is_spam ) {
						Petshop_Email_Suppression::suppress(
							$email, Petshop_Email_Suppression::CH_TRANSACTIONAL, 'bounce', 'sender_webhook' );
					}
				}
				return Petshop_Consent_Sync::handle_sender_bounce( $email );

			case 'subscribers/updated':
			case 'subscriber.updated':
				// S314: KANALINIS vertinimas.
				// Sender status objektas: { email: <marketingas>, temail: <transakciniai> }.
				// Marketingo atsisakymas NEBLOKUOJA transakciniu — todel niekada
				// nedarom globalaus suppress pagal "bet koks neaktyvus statusas".
				// Lauko/vardo/grupes pakeitimas -> jokio suppression (interpret_status
				// grazina 'none', jei busena nera nei terminali, nei 'active').
				if ( ! class_exists( 'Petshop_Email_Suppression' ) ) {
					return array( 'ok' => true, 'action' => 'logged_only' );
				}
				$status = self::extract_status( $event );
				if ( empty( $status ) ) {
					return array( 'ok' => true, 'action' => 'no_status' );
				}
				$changed = Petshop_Email_Suppression::apply_status( $email, $status, 'sender_webhook' );
				return array(
					'ok'      => true,
					'action'  => $changed ? 'channel_suppression_updated' : 'no_change',
					'changed' => $changed,
				);

			case 'campaigns/delivered':
			case 'emails/delivered':
			case 'email.delivered':
			case 'delivered':
			case 'delivery':
				return self::analitika( 'delivered_at', $email, $event );

			case 'campaigns/opened':
			case 'emails/opened':
			case 'email.opened':
			case 'subscribers/opened':
			case 'opened':
			case 'open':
				return self::analitika( 'opened_at', $email, $event );

			case 'campaigns/clicked':
			case 'emails/clicked':
			case 'email.clicked':
			case 'link_clicked':
			case 'clicked':
			case 'click':
				return self::analitika( 'clicked_at', $email, $event );

			default:
				return array( 'ok' => true, 'action' => 'ignored', 'type' => $type );
		}
	}

	/**
	 * S1478: analitikos zyma i ps_email_jobs. First-touch: raso tik jei NULL.
	 * @param string $stulpelis delivered_at|opened_at|clicked_at
	 */
	private static function analitika( $stulpelis, $email, $event ) {
		global $wpdb;
		if ( ! in_array( $stulpelis, array( 'delivered_at', 'opened_at', 'clicked_at' ), true ) ) {
			return array( 'ok' => false, 'action' => 'bad_column' );
		}
		$t   = $wpdb->prefix . 'ps_email_jobs';
		$now = current_time( 'mysql', true );
		$mid = '';
		foreach ( array( 'message_id', 'email_message_id' ) as $k ) {
			if ( isset( $event[ $k ] ) )          { $mid = (string) $event[ $k ]; break; }
			if ( isset( $event['data'][ $k ] ) )  { $mid = (string) $event['data'][ $k ]; break; }
		}
		$job_id = 0;
		if ( $mid !== '' ) {
			$job_id = (int) $wpdb->get_var( $wpdb->prepare(
				"SELECT id FROM `$t` WHERE provider_message_id = %s ORDER BY id DESC LIMIT 1", $mid ) );
		}
		if ( ! $job_id ) {
			$job_id = (int) $wpdb->get_var( $wpdb->prepare(
				"SELECT id FROM `$t` WHERE recipient_email = %s AND status = 'sent'
				   AND sent_at >= %s ORDER BY sent_at DESC LIMIT 1",
				$email, gmdate( 'Y-m-d H:i:s', time() - 14 * DAY_IN_SECONDS ) ) );
		}
		if ( ! $job_id ) {
			return array( 'ok' => true, 'action' => 'no_match', 'metric' => $stulpelis );
		}
		$updated = $wpdb->query( $wpdb->prepare(
			"UPDATE `$t` SET `$stulpelis` = %s WHERE id = %d AND `$stulpelis` IS NULL",
			$now, $job_id ) );
		return array( 'ok' => true, 'action' => $updated ? 'recorded' : 'already_set',
			'metric' => $stulpelis, 'job_id' => $job_id );
	}

	/**
	 * S314: istraukia Sender busenos objekta is webhook payload'o.
	 * Sender gali ji deti i 'status', 'subscriber.status' arba i saknį.
	 */
	private static function extract_status( $event ) {
		if ( ! is_array( $event ) ) { return array(); }
		if ( isset( $event['status'] ) && is_array( $event['status'] ) ) { return $event['status']; }
		if ( isset( $event['subscriber']['status'] ) && is_array( $event['subscriber']['status'] ) ) {
			return $event['subscriber']['status'];
		}
		if ( isset( $event['data']['status'] ) && is_array( $event['data']['status'] ) ) {
			return $event['data']['status'];
		}
		$out = array();
		if ( isset( $event['email_status'] ) )  { $out['email']  = $event['email_status']; }
		if ( isset( $event['temail_status'] ) ) { $out['temail'] = $event['temail_status']; }
		return $out;
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
