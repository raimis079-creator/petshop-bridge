<?php
/**
 * Petshop_Magic_Login — passwordless login per email nuoroda (magic link).
 *
 * Naudoja M6 Petshop_Action_Tokens (purpose=magic_login, TTL 15 min).
 * Laiskas siunciamas per WP Mail SMTP (C-hibrido kritinis kelias -> inbox).
 *
 * SAUGUMO REIKALAVIMAI (S190):
 * 1. Ta pati atsakymo forma egzistuojanciam ir neegzistuojanciam email
 *    (nesako "toks vartotojas nerastas" — enumeration apsauga).
 * 2. Rate limit: IP + email (max N uzklausu per langa).
 * 3. TTL 15 min (trumpesnis nei default 30).
 * 4. Single-use (M6 consume -> status used).
 * 5. Scanner-safe: GET = confirmation page (peek, be login), POST = login (consume).
 *    Email antivirusai atidaro GET — negalima auto-login ant GET.
 * 6. Session ID regeneracija po login (session fixation apsauga).
 * 7. NEAUTO-KURIA paskyru — magic link tik ESAMIEMS vartotojams.
 *    (Jei email neturi WP user — tyliai nieko, bet atsakymas toks pat.)
 * 8. PS_EMAIL_VERIFIED mirror — po sekmingo login pazymim verified.
 *
 * SRAUTAS:
 *   1. Vartotojas iveda email -> POST /petshop/v1/magic-login/request
 *   2. Jei email turi WP user: generate token, siusti laiska su nuoroda
 *      /petshop-login?token=XXX. Visais atvejais atsakymas: "Jei toks email
 *      egzistuoja, issiuntem nuoroda".
 *   3. Vartotojas paspaudzia nuoroda -> GET /petshop-login?token=XXX ->
 *      confirmation page (peek token, rodo "Prisijungti" mygtuka su POST forma).
 *   4. POST -> consume token -> wp_set_auth_cookie + session regen -> redirect MyAccount.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Magic_Login {

	const TOKEN_PURPOSE = 'magic_login';
	const TOKEN_TTL = 900;               // 15 min
	const RATE_LIMIT_WINDOW = 900;       // 15 min langas
	const RATE_LIMIT_MAX_EMAIL = 3;      // max 3 uzklausos per email per langa
	const RATE_LIMIT_MAX_IP = 10;        // max 10 per IP per langa
	const LOGIN_PATH = 'petshop-login';  // /petshop-login?token=XXX
	const META_EMAIL_VERIFIED = '_ps_email_verified';

	public static function init() {
		// REST endpoint magic link uzklausai
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		// Login puslapio handler (GET confirmation + POST consume)
		add_action( 'init', array( __CLASS__, 'handle_login_page' ) );
	}

	public static function register_routes() {
		register_rest_route( 'petshop/v1', '/magic-login/request', array(
			'methods'             => 'POST',
			'callback'            => array( __CLASS__, 'handle_request' ),
			'permission_callback' => '__return_true',
			'args'                => array(
				'email' => array( 'required' => true, 'type' => 'string' ),
			),
		) );
	}

	/**
	 * POST /petshop/v1/magic-login/request
	 * Visada grazina ta pati atsakyma (enumeration apsauga).
	 */
	public static function handle_request( $request ) {
		$email = sanitize_email( $request->get_param( 'email' ) );
		$ip = self::get_client_ip();

		// Bendras "sekmes" atsakymas — visais atvejais (yra/nera user, rate limit)
		$generic = array(
			'ok'      => true,
			'message' => 'Jei tokia paskyra egzistuoja, išsiuntėme prisijungimo nuorodą į el. paštą.',
		);

		if ( ! is_email( $email ) ) {
			// Net ir blogo formato atveju — toks pat atsakymas (nesako "blogas email")
			return rest_ensure_response( $generic );
		}

		// Rate limit patikra (email + IP)
		if ( ! self::check_rate_limit( $email, $ip ) ) {
			// Toks pat atsakymas — nesako "per daug bandymu"
			return rest_ensure_response( $generic );
		}

		// Ar email turi WP user (NEAUTO-KURIAM)
		$user = get_user_by( 'email', $email );
		if ( $user ) {
			// Generuojam token + siunciam laiska
			$token = ps_generate_token( array(
				'purpose'       => self::TOKEN_PURPOSE,
				'subject_id'    => $user->ID,
				'subject_email' => $email,
				'ttl_seconds'   => self::TOKEN_TTL,
			) );
			if ( $token ) {
				self::send_login_email( $email, $user, $token );
			}
		}
		// Jei user nera — nieko nedarom, bet atsakymas toks pat.

		return rest_ensure_response( $generic );
	}

	/**
	 * Login puslapio handler: GET (confirmation) + POST (consume).
	 * URL: /petshop-login?token=XXX
	 */
	public static function handle_login_page() {
		if ( ! isset( $_GET['ps_magic'] ) && ! self::is_login_path() ) {
			return;
		}
		if ( ! self::is_login_path() ) {
			return;
		}

		$token = isset( $_REQUEST['token'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['token'] ) ) : '';
		if ( ! $token ) {
			self::render_error( 'Nuoroda neteisinga arba pasibaigusi.' );
			return;
		}

		$method = isset( $_SERVER['REQUEST_METHOD'] ) ? strtoupper( $_SERVER['REQUEST_METHOD'] ) : 'GET';

		if ( $method === 'POST' ) {
			// CONSUME — atlieka login
			self::process_login( $token );
		} else {
			// GET — confirmation page (scanner-safe, peek be side-effect)
			self::render_confirmation( $token );
		}
	}

	/**
	 * GET confirmation page — peek token, rodo POST forma su "Prisijungti".
	 */
	private static function render_confirmation( $token ) {
		$peek = ps_peek_token( $token );
		if ( ! $peek['valid'] ) {
			self::render_error( 'Nuoroda neteisinga arba pasibaigusi. Prašome prisijungti iš naujo.' );
			return;
		}
		// Patikrinam kad tai magic_login purpose
		if ( isset( $peek['row']->purpose ) && $peek['row']->purpose !== self::TOKEN_PURPOSE ) {
			self::render_error( 'Nuoroda neteisinga.' );
			return;
		}

		$action_url = esc_url( home_url( '/' . self::LOGIN_PATH ) );
		$token_esc = esc_attr( $token );
		$nonce = wp_create_nonce( 'ps_magic_login' );

		self::render_page(
			'Prisijungimas',
			'<h1 style="color:#2D5F3F;">Prisijungti prie Petshop.lt</h1>
			<p>Paspauskite mygtuką, kad užbaigtumėte prisijungimą.</p>
			<form method="POST" action="' . $action_url . '" style="margin-top:24px;">
				<input type="hidden" name="token" value="' . $token_esc . '">
				<input type="hidden" name="ps_nonce" value="' . esc_attr( $nonce ) . '">
				<button type="submit" style="background:#2D5F3F;color:#fff;border:none;padding:14px 32px;border-radius:8px;font-size:16px;cursor:pointer;font-weight:600;">Prisijungti</button>
			</form>
			<p style="margin-top:16px;color:#888;font-size:13px;">Nuoroda galioja 15 minučių ir gali būti panaudota vieną kartą.</p>'
		);
	}

	/**
	 * POST — consume token, login, session regen, redirect.
	 */
	private static function process_login( $token ) {
		// Nonce patikra (CSRF)
		$nonce = isset( $_POST['ps_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['ps_nonce'] ) ) : '';
		if ( ! wp_verify_nonce( $nonce, 'ps_magic_login' ) ) {
			self::render_error( 'Sesija pasibaigusi. Prašome prisijungti iš naujo.' );
			return;
		}

		$result = ps_consume_token( $token );
		if ( ! $result['valid'] ) {
			self::render_error( 'Nuoroda nebegalioja arba jau panaudota. Prašome prisijungti iš naujo.' );
			return;
		}
		if ( isset( $result['row']->purpose ) && $result['row']->purpose !== self::TOKEN_PURPOSE ) {
			self::render_error( 'Nuoroda neteisinga.' );
			return;
		}

		$user_id = (int) $result['row']->subject_id;
		$user = get_user_by( 'id', $user_id );
		if ( ! $user ) {
			self::render_error( 'Paskyra nerasta.' );
			return;
		}

		// Session fixation apsauga: wp_clear_auth_cookie + naujas wp_set_auth_cookie
		// zemiau duoda nauja auth cookie (sena negalioja). WP neturi PHP session'u
		// pagal nutylejima, tad atskiro session_regenerate_id nereikia.

		// Login
		wp_clear_auth_cookie();
		wp_set_current_user( $user_id );
		wp_set_auth_cookie( $user_id, true );  // remember=true
		do_action( 'wp_login', $user->user_login, $user );

		// PS_EMAIL_VERIFIED mirror
		update_user_meta( $user_id, self::META_EMAIL_VERIFIED, 'yes' );
		// Push i Sender (jei yra)
		if ( function_exists( 'ps_esp_adapter' ) ) {
			$adapter = ps_esp_adapter();
			if ( $adapter && $adapter->is_configured() ) {
				$adapter->upsert_contact( $user->user_email, array(
					'PS_EMAIL_VERIFIED' => 'true',
					'PS_LOGIN_METHOD'   => 'magic_link',
				) );
			}
		}

		// Redirect i MyAccount
		$redirect = wc_get_page_permalink( 'myaccount' );
		if ( ! $redirect ) {
			$redirect = home_url( '/' );
		}
		wp_safe_redirect( $redirect );
		exit;
	}

	/**
	 * Siunciam magic link laiska per WP Mail SMTP.
	 */
	private static function send_login_email( $email, $user, $token ) {
		$login_url = add_query_arg( 'token', rawurlencode( $token ), home_url( '/' . self::LOGIN_PATH ) );
		$name = $user->first_name ? $user->first_name : $user->display_name;

		$subject = 'Prisijungimas prie Petshop.lt';
		$body  = '<html><body style="font-family:Arial,sans-serif;color:#333;max-width:560px;margin:0 auto;">';
		$body .= '<div style="padding:24px;">';
		$body .= '<h2 style="color:#2D5F3F;">Prisijungimas prie Petshop.lt</h2>';
		$body .= '<p>Sveiki' . ( $name ? ', ' . esc_html( $name ) : '' ) . ',</p>';
		$body .= '<p>Gavome prašymą prisijungti prie jūsų paskyros. Paspauskite mygtuką žemiau:</p>';
		$body .= '<p style="margin:28px 0;"><a href="' . esc_url( $login_url ) . '" style="background:#2D5F3F;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;display:inline-block;">Prisijungti</a></p>';
		$body .= '<p style="color:#888;font-size:13px;">Nuoroda galioja 15 minučių ir gali būti panaudota vieną kartą.</p>';
		$body .= '<p style="color:#888;font-size:13px;">Jei šio prašymo nepateikėte — tiesiog ignoruokite šį laišką.</p>';
		$body .= '<hr style="border:none;border-top:1px solid #eee;margin:24px 0;">';
		$body .= '<p style="color:#aaa;font-size:12px;">Petshop.lt</p>';
		$body .= '</div></body></html>';

		$headers = array(
			'Content-Type: text/html; charset=UTF-8',
			'From: Petshop.lt <terra@petshop.lt>',
		);
		wp_mail( $email, $subject, $body, $headers );
	}

	// --- Rate limiting (transient pagristas) ---
	private static function check_rate_limit( $email, $ip ) {
		$email_key = 'ps_ml_e_' . md5( strtolower( $email ) );
		$ip_key = 'ps_ml_i_' . md5( $ip );

		$email_count = (int) get_transient( $email_key );
		$ip_count = (int) get_transient( $ip_key );

		if ( $email_count >= self::RATE_LIMIT_MAX_EMAIL ) {
			return false;
		}
		if ( $ip_count >= self::RATE_LIMIT_MAX_IP ) {
			return false;
		}

		set_transient( $email_key, $email_count + 1, self::RATE_LIMIT_WINDOW );
		set_transient( $ip_key, $ip_count + 1, self::RATE_LIMIT_WINDOW );
		return true;
	}

	private static function get_client_ip() {
		// Paprastas — REMOTE_ADDR (uz proxy gali reiketi X-Forwarded-For, bet dev'e ok)
		$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '0.0.0.0';
		return $ip;
	}

	private static function is_login_path() {
		$req = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
		$path = trim( parse_url( $req, PHP_URL_PATH ), '/' );
		return ( $path === self::LOGIN_PATH );
	}

	// --- Puslapiu render ---
	private static function render_error( $msg ) {
		self::render_page( 'Prisijungimas', '<h1 style="color:#c0392b;">Nepavyko prisijungti</h1><p>' . esc_html( $msg ) . '</p><p style="margin-top:20px;"><a href="' . esc_url( wc_get_page_permalink( 'myaccount' ) ?: home_url( '/' ) ) . '" style="color:#2D5F3F;">Grįžti į prisijungimą</a></p>' );
	}

	private static function render_page( $title, $content ) {
		if ( headers_sent() ) {
			echo $content; exit;
		}
		header( 'Content-Type: text/html; charset=UTF-8' );
		echo '<!DOCTYPE html><html lang="lt"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>' . esc_html( $title ) . '</title></head>';
		echo '<body style="font-family:Arial,sans-serif;background:#f7f7f7;margin:0;padding:40px 20px;">';
		echo '<div style="max-width:480px;margin:0 auto;background:#fff;padding:40px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.06);">';
		echo $content;
		echo '</div></body></html>';
		exit;
	}
}
