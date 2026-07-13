<?php
/**
 * ESP Adapter Interface — Petshop Event Layer
 *
 * ESP-agnostiškas kontraktas tarp Petshop-core (duomenų/logikos šaltinis)
 * ir bet kurios email/SMS platformos (šiuo metu — Sender; ankstesnė TŽ v1.44
 * versija numatė Brevo; principai išlieka tie patys, keičiasi tik implementacija).
 *
 * GELEŽINĖ TAISYKLĖ: išjungus konkretų ESP, parduotuvė neprarand nė vieno
 * kliento, sutikimo, refill skaičiavimo, prenumeratos ar priminimo.
 * Sustoja tik laiškų ir SMS pristatymas.
 *
 * Todėl šis interface'as TIK vykdymo sąsaja. Jokios verslo logikos čia nėra.
 *
 * @package Petshop\EventLayer
 */

namespace Petshop\EventLayer;

if ( ! defined( 'ABSPATH' ) ) { exit; }

interface ESP_Adapter_Interface {

	/**
	 * Kontaktas: sukurti arba atnaujinti pagal el. paštą (dedup raktas).
	 * Petshop-core siunčia paruoštus PS_* atributus; adapter juos maps'ina
	 * į konkretaus ESP naming'ą (Sender custom fields, Brevo attributes, t. t.).
	 *
	 * @param string $email       El. paštas — vienintelis dedup raktas.
	 * @param array  $attributes  Asociatyvinis masyvas: PS_CUSTOMER_ID, PS_PET_SPECIES...
	 * @return Contact_Sync_Result Sėkmės/nesėkmės objektas su ESP kontakto ID (jei yra).
	 */
	public function upsert_contact( string $email, array $attributes ): Contact_Sync_Result;

	/**
	 * Custom event: order_paid, cart_abandoned, refill_due ir t.t.
	 * Idempotencija — jei `event_id` jau buvo priimtas, ESP GALI grąžinti sėkmę
	 * (natūrali dedup) arba adapter turi jį apsaugoti savo pusėje.
	 *
	 * @param string $email     Kontakto identifikatorius.
	 * @param string $event_id  Unikalus eventas — žr. class-event-id-schema.md.
	 * @param string $event     Snake_case pavadinimas (žr. TŽ v1.45 sąrašą).
	 * @param array  $payload   Event property (naudojama workflow'uose filtruoti).
	 * @param int    $timestamp Unix timestamp (epoch), leidžia „pavėluoti" seniems.
	 * @return Event_Emit_Result
	 */
	public function emit_event( string $email, string $event_id, string $event, array $payload, int $timestamp ): Event_Emit_Result;

	/**
	 * Transakcinis laiškas — visada praeina, nepriklausomai nuo marketing consent.
	 * Adapter privalo naudoti ESP transactional endpoint, ne marketing.
	 * Petshop-core atsakingas už tai, kad transakcinis TIKRAI transakcinis
	 * (paslaugos vykdymas, ne rinkodara).
	 *
	 * @param string $to_email Gavėjas.
	 * @param string $template_id ESP šablono ID (dizainas laikomas Sender pusėje).
	 * @param array  $variables Liquid/Handlebars variables šablonui.
	 * @param string $message_id Unikalus siunčiamos žinutės ID (idempotencija).
	 * @return Message_Send_Result
	 */
	public function send_transactional_email( string $to_email, string $template_id, array $variables, string $message_id ): Message_Send_Result;

	/**
	 * Transakcinis SMS. LT numeriai, alphanumeric Sender ID „Petshop.lt".
	 * Petshop-core prieš iškviesdamas privalo patikrinti:
	 *   - kontakto PS_MARKETING_CONSENT vs transakcinė būtinybė;
	 *   - PS_UNSUBSCRIBED_AT nulinis TIK marketingui, ne transakcijai;
	 *   - LT numerio formatas (+3706XXXXXXX).
	 *
	 * @param string $to_phone   E.164 formatas (+37060012345).
	 * @param string $body       SMS turinys (max 160 simbolių, arba multi-part).
	 * @param string $message_id Idempotencijos raktas.
	 * @return Message_Send_Result
	 */
	public function send_transactional_sms( string $to_phone, string $body, string $message_id ): Message_Send_Result;

	/**
	 * Webhook signature verifikacija. ESP siunčia unsubscribe/bounce/spam
	 * eventus atgal į Woo, kad Petshop-core atnaujintų PS_MARKETING_CONSENT,
	 * PS_UNSUBSCRIBED_AT, PS_TRANSACTIONAL_ONLY.
	 *
	 * @param string $payload Neapdorotas HTTP body.
	 * @param string $signature Antraštė (X-Sender-Signature ar analogas).
	 * @return bool True jei parašas tikras.
	 */
	public function verify_webhook( string $payload, string $signature ): bool;

	/**
	 * Diagnostika savaitiniam health dashboard'ui (TŽ v1.47 KPI).
	 * Grąžina rate limits, paskutinės klaidos, uptime status.
	 * Naudojama „nulio, kurio neturi būti" aptikimui (analogija S72).
	 */
	public function get_health_status(): Health_Status;

	/**
	 * Adapterio identifikacija — kad logs žinotų kuris ESP dabar aktyvus.
	 * Reikalinga po platformos keitimo, kad istorija būtų aiški.
	 */
	public function get_adapter_name(): string;

	/**
	 * Grąžina true, jei adapter'is dabar veikia (API pasiekiama, kreditas yra).
	 * Petshop-core naudoja tai retry queue'ui priimti sprendimą:
	 * ar bandyti dabar, ar iškart eiti į backoff.
	 */
	public function is_operational(): bool;
}

/**
 * DTO — kontakto sync rezultatas.
 */
final class Contact_Sync_Result {
	public bool $success;
	public ?string $esp_contact_id = null;
	public ?string $error_code = null;
	public ?string $error_message = null;
	public bool $should_retry = false;  // true → retry queue
}

/**
 * DTO — eventų emit'inimo rezultatas.
 */
final class Event_Emit_Result {
	public bool $success;
	public string $event_id;
	public ?string $error_code = null;
	public ?string $error_message = null;
	public bool $should_retry = false;
	public bool $already_processed = false;  // true → ESP grąžino „jau matėm šį event_id"
}

/**
 * DTO — žinutės siuntimo rezultatas (email/SMS).
 */
final class Message_Send_Result {
	public bool $success;
	public string $message_id;
	public ?string $esp_message_id = null;
	public ?string $error_code = null;
	public ?string $error_message = null;
	public bool $should_retry = false;
}

/**
 * DTO — health status.
 */
final class Health_Status {
	public bool $api_reachable;
	public bool $auth_valid;
	public int $rate_limit_remaining = 0;
	public int $rate_limit_reset_at = 0;
	public ?string $last_error_at = null;
	public ?string $last_error_message = null;
	public array $extras = array();  // ESP-specific metrikos
}
