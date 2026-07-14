<?php
/**
 * Petshop_Message_Provider — kontrakts message provider'iams (Sender, ateities SMS, etc.)
 *
 * Petshop core NEZINO konkretaus provider'io specifikos. Provider'is (Sender adapter)
 * implementuoja šį interface. Retry queue, event log, consent sync — kviečia
 * per si interface, ne per konkretu Sender API.
 *
 * MIGRACIJA is Interface_ESP_Adapter (petshop-esp): tas pats kontrakts, kitas
 * pavadinimas. Sender adapter'is bus atnaujintas kad implementuotu šį.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

interface Petshop_Message_Provider {

	/**
	 * Provider'io pavadinimas (unikalus ID). Naudojamas event_log.adapter_name lauke.
	 * Pvz. 'sender', 'brevo', 'sms_lt'.
	 *
	 * @return string
	 */
	public function get_name();

	/**
	 * Ar provider'is sukonfiguruotas (tokenai, endpoint'ai).
	 *
	 * @return bool
	 */
	public function is_configured();

	/**
	 * Greita <3s patikra ar provider'is atsako (pries batch operacijas).
	 *
	 * @return bool
	 */
	public function is_operational();

	/**
	 * Upsert kontakto atributai provider'io puseje.
	 *
	 * @param string $email
	 * @param array  $attributes  ['PS_ORDER_COUNT'=>5, 'PS_MARKETING_CONSENT'=>'true', ...]
	 * @return array {
	 *   @type bool   $ok
	 *   @type bool   $should_retry
	 *   @type string $error
	 *   @type mixed  $raw
	 * }
	 */
	public function upsert_contact( $email, array $attributes );

	/**
	 * Emit'ina event'a i provider'io srautus.
	 *
	 * @param string      $email
	 * @param string      $event_id     Unikalus event ID (idempotencijai provider'io puseje).
	 * @param string      $event_name   Kanoninis event vardas.
	 * @param array       $payload
	 * @param string|null $timestamp    ISO 8601 formatas; null → dabar.
	 * @return array {ok, should_retry, error, raw}
	 */
	public function emit_event( $email, $event_id, $event_name, array $payload, $timestamp = null );

	/**
	 * Siunčia transakcini el. laisska tiesiogiai (be event/workflow tarpo).
	 * Kritinis srautas (magic link, password reset). Provider gali nepalaikyti — grazina should_retry=false.
	 *
	 * @param string $to_email
	 * @param string $subject
	 * @param string $html_body
	 * @param array  $meta  (from, reply_to, headers, etc.)
	 * @return array {ok, should_retry, error, raw}
	 */
	public function send_transactional_email( $to_email, $subject, $html_body, array $meta = array() );

	/**
	 * Siunčia SMS. Provider gali nepalaikyti (grazina should_retry=false, error='not_supported').
	 *
	 * @param string $phone_e164   E.164 formatas (+370...).
	 * @param string $message
	 * @param array  $meta
	 * @return array {ok, should_retry, error, raw}
	 */
	public function send_transactional_sms( $phone_e164, $message, array $meta = array() );

	/**
	 * Patikrina webhook parasa.
	 *
	 * @param string $raw_body
	 * @param string $signature
	 * @return bool
	 */
	public function verify_webhook( $raw_body, $signature );

	/**
	 * Provider'io health metrics (rate limit, kvota, paskutine klaida).
	 *
	 * @return array
	 */
	public function get_health_status();
}
