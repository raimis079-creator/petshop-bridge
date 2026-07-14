<?php
/**
 * Interface_ESP_Adapter
 *
 * ESP-agnostiskas kontraktas. Kiekvienas realus ESP (Sender, Brevo, Klaviyo)
 * implementuoja si interface. Todel pakeisti platforma = pakeisti klase,
 * ne perrasyti visa sistema.
 *
 * TZ v1.58 §7 (S180-B, 10 architekturos principu):
 *   "Vienas plonas adapteris (Petshop_Sender_Adapter implements ESP_Adapter_Interface).
 *    API kvietimai vienoje vietoje, ne isbarstyti."
 *
 * Metodai (v0.1.0):
 *   upsert_contact()          — sukurti/atnaujinti abonenta ESP pusej
 *   emit_event()              — iskeliauja custom event'a (pvz. refill_due)
 *   send_transactional_email()— hardcoded HTML transakciniai (kritiniams uz WC/SMTP ribos)
 *   send_transactional_sms()  — SMS (bus v0.2.0+ su Sender ID)
 *   verify_webhook()          — HMAC signing patikra
 *   get_health_status()       — cache'inta health info (kvota, rate limit, klaidos)
 *   is_operational()          — greita on/off patikra (< 3s timeout)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

interface Interface_ESP_Adapter {

	/**
	 * Sukurti arba atnaujinti abonenta ESP pusej.
	 *
	 * @param string $email       Abonemento el. pastas (dedup raktas).
	 * @param array  $attributes  Asocijatyvinis (PS_ORDER_COUNT => 5, PS_PET_SPECIES => 'dog', ...).
	 * @return array {
	 *     @type bool   $ok             Ar sekmingai atlikta.
	 *     @type string $status         'created' | 'updated' | 'unchanged' | 'error'
	 *     @type string $esp_contact_id ESP pusej priskirtas ID (jei atsakas rodo).
	 *     @type string $error          Jei $ok=false — trumpa priezastis.
	 * }
	 */
	public function upsert_contact( $email, array $attributes );

	/**
	 * Iskelti custom event'a ESP pusej (paleisti workflow, trigger'i).
	 *
	 * @param string $email     Kontaktas.
	 * @param string $event_id  Deterministinis unique ID (dedupu apsauga adapter'io pusej).
	 * @param string $event     snake_case event'o pavadinimas.
	 * @param array  $payload   Merge tag'ai + workflow property.
	 * @param int    $timestamp Unix TS (leidzia siusti su tikslia data, ne emit'inimo).
	 * @return array {
	 *     @type bool   $ok
	 *     @type bool   $already_processed  Idempotencija — buvo jau siustas.
	 *     @type bool   $should_retry       Klaida yra retriable (5xx/429/timeout).
	 *     @type string $esp_event_id       ESP grazintas event id.
	 *     @type string $error
	 * }
	 */
	public function emit_event( $email, $event_id, $event, array $payload, $timestamp = null );

	/**
	 * Isiusti hardcoded HTML transakcini laiska (kritiniams kai WC/SMTP negali).
	 * Naudojama tik SPECIFINIAMS atvejams — dauguma transakciniu eina per WC → SMTP.
	 *
	 * @param string $to_email
	 * @param string $subject
	 * @param string $html_body
	 * @param array  $meta      { name?, message_id?, cc?, bcc? }
	 * @return array
	 */
	public function send_transactional_email( $to_email, $subject, $html_body, array $meta = array() );

	/**
	 * Issisti SMS (placeholder v0.1.0 — realaus impl. v0.2.0 su LT Sender ID).
	 *
	 * @param string $phone_e164  +370... format
	 * @param string $message
	 * @param array  $meta        { sender_id?, message_id? }
	 * @return array
	 */
	public function send_transactional_sms( $phone_e164, $message, array $meta = array() );

	/**
	 * Patikrina Sender webhook parasa (HMAC-SHA256 su signing secret).
	 *
	 * @param string $raw_payload  Ne parsintas ($_POST/php://input raw).
	 * @param string $signature    Header'io reiksme.
	 * @return bool
	 */
	public function verify_webhook( $raw_payload, $signature );

	/**
	 * Grazina cache'inta health info (60s TTL). Nekvieciam kiekviename request'e.
	 *
	 * @return array {
	 *     @type bool   $healthy         Bendrai OK ar ne.
	 *     @type int    $quota_used      Menesio kvota kiek isnaudota.
	 *     @type int    $quota_max       Menesio kvota limitas.
	 *     @type array  $rate_limits     { hourly_used, hourly_max, ... }
	 *     @type string $last_error      Jei buvo klaida per pastarasias 5 min.
	 *     @type int    $last_error_at   Unix TS.
	 * }
	 */
	public function get_health_status();

	/**
	 * Greita on/off patikra (< 3s timeout). Naudojama pries batch emit'ini,
	 * kad neuztrukdytume paleisti daug klaidingu retry'u kai ESP guli.
	 *
	 * @return bool
	 */
	public function is_operational();
}
