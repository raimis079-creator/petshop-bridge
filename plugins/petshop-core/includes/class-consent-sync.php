<?php
/**
 * Petshop_Consent_Sync
 *
 * Consent sinchronizacija tarp Woo (tiesa) ir Sender (kopija).
 *
 * KRYPTYS:
 * A. Woo → Sender (push): kai klientas pakeicia consent (checkout, mano-paskyra),
 *    irasom i ps_consent_log + user_meta + push'inam PS_MARKETING_CONSENT i Sender.
 * B. Sender → Woo (webhook): kai klientas unsubscribe'ina per Sender laiska,
 *    Sender webhook praneša, mes atnaujinam mūsų puse (user_meta + ps_consent_log).
 *    (Webhook receiver — atskira klase; cia tik handleriai.)
 *
 * VIENA TIESA: ps_consent_log paskutine reiksme + user_meta 'ps_marketing_consent'.
 * Sender PS_MARKETING_CONSENT = atspindys (push'inamas is cia).
 *
 * TZ v1.58 §4: consent-conditional komerciniai blokai. Atsisakius marketingo:
 * kampanijiniai + komerciniai neina; TIK paslauginiai (refill, prenumeratos pranešimai).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * MIGRACIJA (S186): Perkelta iš petshop-esp/includes/class-consent-sync.php.
 * Klases pervadintos Petshop_ESP_* -> Petshop_*. DB nekeičiam.
 *
 * ATEITY (S187+): Consent push i provider'i keiciamas is tiesioginio ps_esp_adapter()
 * kvietimo i do_action('petshop_contact_update',\$email,\$attrs) — provider'iai klauso.
 * Dabar (S186 migracijoje) paliekam kaip yra, kad testai patikrintu tik migracijos švara.
 */
class Petshop_Consent_Sync {

	const META_MARKETING = 'ps_marketing_consent';
	const META_TRANSACTIONAL_ONLY = 'ps_transactional_only';

	/**
	 * Registruoja Woo hook'us (checkout, account).
	 */
	public static function init() {
		// Checkout marketing opt-in (custom checkbox — jei tema/plugin renderina)
		add_action( 'woocommerce_checkout_update_customer', array( __CLASS__, 'capture_checkout_consent' ), 10, 2 );
		// Mano paskyra — consent toggle (bus M-vartotojo UI; hook paruostas)
		add_action( 'petshop_consent_changed', array( __CLASS__, 'handle_consent_change' ), 10, 1 );
	}

	/**
	 * Woo → Sender: nustatyti marketing consent klientui.
	 * VIENINTELE vieta kur consent keiciamas is Woo puses.
	 *
	 * @param string $email
	 * @param bool   $consent  true=sutinka, false=atsisako
	 * @param string $source   checkout|mano-paskyra|admin|import
	 * @param int    $customer_id  (0 jei nezinom)
	 * @return array {ok, from, to, pushed_to_sender}
	 */
	public static function set_marketing_consent( $email, $consent, $source = 'unknown', $customer_id = 0 ) {
		$email = sanitize_email( $email );
		if ( ! $email ) {
			return array( 'ok' => false, 'error' => 'invalid_email' );
		}
		$new_value = $consent ? 'true' : 'false';

		// buvusi reiksme (is consent_log arba user_meta)
		$from = Petshop_Consent_Log::current_value( $email, 'marketing_consent' );
		if ( $from === null && $customer_id ) {
			$from = get_user_meta( $customer_id, self::META_MARKETING, true );
		}
		$from = ( $from === '' || $from === null ) ? '' : $from;

		// jei nepasikeite — nedaryti nieko (idempotencija)
		if ( $from === $new_value ) {
			return array( 'ok' => true, 'from' => $from, 'to' => $new_value, 'pushed_to_sender' => false, 'unchanged' => true );
		}

		// 1. Irasyti i consent_log (teisinis irodymas)
		Petshop_Consent_Log::record( array(
			'customer_id' => $customer_id,
			'email'       => $email,
			'field'       => 'marketing_consent',
			'from_value'  => $from,
			'to_value'    => $new_value,
			'source'      => $source,
		) );

		// 2. Irasyti i user_meta (jei zinom customer_id)
		if ( $customer_id ) {
			update_user_meta( $customer_id, self::META_MARKETING, $new_value );
		}

		// 3. Push i Sender (PS_MARKETING_CONSENT + jei atsisake, PS_UNSUBSCRIBED_AT)
		$attributes = array( 'PS_MARKETING_CONSENT' => $new_value );
		if ( ! $consent ) {
			$attributes['PS_UNSUBSCRIBED_AT'] = gmdate( 'Y-m-d' );
		}
		$pushed = false;
		if ( function_exists( 'ps_esp_adapter' ) ) {
			$adapter = ps_esp_adapter();
			if ( $adapter->is_configured() ) {
				$res = $adapter->upsert_contact( $email, $attributes );
				$pushed = ! empty( $res['ok'] );
			}
		}

		return array(
			'ok'               => true,
			'from'             => $from,
			'to'               => $new_value,
			'pushed_to_sender' => $pushed,
		);
	}

	/**
	 * Sender → Woo: apdoroti unsubscribe is Sender webhook.
	 * Klientas atsisake per Sender laiska → atnaujinti MŪSŲ puse.
	 * NE push'inam atgal i Sender (kad neuzsiciklintume).
	 *
	 * @param string $email
	 * @return array
	 */
	public static function handle_sender_unsubscribe( $email ) {
		$email = sanitize_email( $email );
		if ( ! $email ) {
			return array( 'ok' => false, 'error' => 'invalid_email' );
		}

		$user = get_user_by( 'email', $email );
		$customer_id = $user ? $user->ID : 0;

		$from = Petshop_Consent_Log::current_value( $email, 'marketing_consent' );
		$from = ( $from === '' || $from === null ) ? '' : $from;

		// jau false — nedaryti nieko
		if ( $from === 'false' ) {
			return array( 'ok' => true, 'unchanged' => true );
		}

		// Irasyti i consent_log (source=webhook)
		Petshop_Consent_Log::record( array(
			'customer_id' => $customer_id,
			'email'       => $email,
			'field'       => 'marketing_consent',
			'from_value'  => $from,
			'to_value'    => 'false',
			'source'      => 'webhook',
		) );

		if ( $customer_id ) {
			update_user_meta( $customer_id, self::META_MARKETING, 'false' );
		}

		return array( 'ok' => true, 'from' => $from, 'to' => 'false', 'customer_id' => $customer_id );
	}

	/**
	 * Sender → Woo: apdoroti hard bounce/spam.
	 * Email nebepasiekiamas → PS_TRANSACTIONAL_ONLY=true (nesiust marketingo,
	 * bet transakciniai vis dar per WC/SMTP gali eiti).
	 *
	 * @param string $email
	 * @return array
	 */
	public static function handle_sender_bounce( $email ) {
		$email = sanitize_email( $email );
		if ( ! $email ) {
			return array( 'ok' => false, 'error' => 'invalid_email' );
		}
		$user = get_user_by( 'email', $email );
		$customer_id = $user ? $user->ID : 0;

		Petshop_Consent_Log::record( array(
			'customer_id' => $customer_id,
			'email'       => $email,
			'field'       => 'transactional_only',
			'from_value'  => '',
			'to_value'    => 'true',
			'source'      => 'webhook',
		) );

		if ( $customer_id ) {
			update_user_meta( $customer_id, self::META_TRANSACTIONAL_ONLY, 'true' );
		}

		return array( 'ok' => true, 'customer_id' => $customer_id );
	}

	/**
	 * WC checkout hook — pagauti marketing opt-in checkbox.
	 * (Checkbox renderinima daro tema/kitas modulis; cia tik capture.)
	 */
	public static function capture_checkout_consent( $customer, $data ) {
		// custom POST laukas 'ps_marketing_optin' (jei checkout formoje yra)
		if ( isset( $_POST['ps_marketing_optin'] ) ) {
			$consent = ( $_POST['ps_marketing_optin'] === '1' || $_POST['ps_marketing_optin'] === 'on' );
			$email = is_callable( array( $customer, 'get_billing_email' ) ) ? $customer->get_billing_email() : '';
			$cid = is_callable( array( $customer, 'get_id' ) ) ? $customer->get_id() : 0;
			if ( $email ) {
				self::set_marketing_consent( $email, $consent, 'checkout', $cid );
			}
		}
	}

	/**
	 * Generic consent change hook (is Mano paskyra UI).
	 * do_action('petshop_consent_changed', array('email'=>..., 'consent'=>bool, 'customer_id'=>..., 'source'=>...))
	 */
	public static function handle_consent_change( $args ) {
		if ( empty( $args['email'] ) || ! isset( $args['consent'] ) ) {
			return;
		}
		self::set_marketing_consent(
			$args['email'],
			(bool) $args['consent'],
			isset( $args['source'] ) ? $args['source'] : 'mano-paskyra',
			isset( $args['customer_id'] ) ? (int) $args['customer_id'] : 0
		);
	}
}
