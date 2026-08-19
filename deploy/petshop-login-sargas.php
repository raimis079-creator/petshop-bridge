<?php
/**
 * Plugin Name: Petshop Prisijungimo sargas
 * Description: Riboja nesėkmingus prisijungimo bandymus (NF9). 5 bandymai per 15 min. iš to paties adreso — tada 15 min. pauzė. Magic link ir REST NELIEČIAMI.
 * Version: 1.0.0
 *
 * TŽ §5 NF9: „Login attempt limits (5 bandymai / 15 min lockout)".
 * Išmatuota 2026-08-19 (H085): saugumo pluginų nėra nė vieno, wp-login.php
 * priima neribotai.
 *
 * TRYS SAUGIKLIAI — sąmoningai, nes tai autentifikacijos sluoksnis:
 *
 *  1. IŠJUNGIMO VĖLIAVA  wp-content/uploads/ps-login-sargas.off
 *     Failas yra → sargas nedirba. Sukuriama per DirectAdmin, be WP admin.
 *     Jei kada nors užsirakintum — vienas failas ir viskas atsidaro.
 *
 *  2. NIEKADA NEBLOKUOJAMA:
 *     - REST API (tiltas, programinės sąsajos)
 *     - magic link (M8 P0 kelias — žmogus be slaptažodžio)
 *     - jau prisijungę vartotojai
 *     Sargas dirba TIK ten, kur siunčiamas slaptažodis: wp-login.php ir xmlrpc.php.
 *
 *  3. NIEKADA NEBLOKUOJAMA VISAM LAIKUI. Ilgiausia pauzė — 15 min.
 *     Jokių „juodųjų sąrašų", jokio rankinio atrakinimo.
 *
 * ADRESAS imamas TIK iš REMOTE_ADDR. `X-Forwarded-For` sąmoningai
 * neskaitomas: jį galima suklastoti, todėl juo pasitikint sargą apeitų
 * tas, nuo ko jis saugo.
 */

if (!defined('ABSPATH')) exit;

final class Petshop_Prisijungimo_Sargas {

	const VERSIJA   = '1.0.0';
	const RIBA      = 5;                 // bandymų
	const LANGAS    = 900;               // 15 min. — per kiek skaičiuojama
	const PAUZE     = 900;               // 15 min. — kiek laukiama
	const VELIAVA   = 'ps-login-sargas.off';
	const PREFIKSAS = 'ps_lgn_';

	public static function pradzia() {
		add_filter('authenticate',  [__CLASS__, 'tikrinti'], 30, 3);
		add_action('wp_login_failed', [__CLASS__, 'nesekme'], 10, 1);
		add_action('wp_login',        [__CLASS__, 'sekme'], 10, 2);
		add_filter('login_message',   [__CLASS__, 'pranesimas']);
	}

	/** Ar sargas apskritai dirba. */
	private static function veikia() {
		$u = wp_upload_dir();
		return !file_exists(trailingslashit($u['basedir']) . self::VELIAVA);
	}

	/** Ar ŠI užklausa yra ta, kurią saugom. */
	private static function saugomas_kelias() {
		if (defined('REST_REQUEST') && REST_REQUEST) return false;
		if (defined('WP_CLI') && WP_CLI)             return false;
		if (defined('DOING_CRON') && DOING_CRON)     return false;
		if (is_user_logged_in())                      return false;

		$kelias = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '';
		if (strpos($kelias, '/wp-json/') !== false)   return false;

		$login = (strpos($kelias, 'wp-login.php') !== false);
		$xml   = (strpos($kelias, 'xmlrpc.php')   !== false);
		return ($login || $xml);
	}

	private static function adresas() {
		$ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
		return $ip !== '' ? $ip : '0.0.0.0';
	}

	private static function raktas($ip = null) {
		return self::PREFIKSAS . md5(($ip === null ? self::adresas() : $ip));
	}

	/** Dabartinė būklė: kiek bandymų ir ar užrakinta. */
	public static function bukle($ip = null) {
		$b = get_transient(self::raktas($ip));
		if (!is_array($b)) $b = ['kiek' => 0, 'iki' => 0];
		return $b;
	}

	/** Blokavimas PRIEŠ tikrinant slaptažodį. */
	public static function tikrinti($vartotojas, $login, $slaptazodis) {

		if (!self::veikia())          return $vartotojas;
		if ($slaptazodis === '')      return $vartotojas;   // magic link, tuščia forma
		if (!self::saugomas_kelias()) return $vartotojas;

		$b = self::bukle();
		if (!empty($b['iki']) && $b['iki'] > time()) {
			$liko = (int) ceil(($b['iki'] - time()) / 60);
			return new WP_Error(
				'ps_per_daug_bandymu',
				sprintf(
					/* translators: %d — minučių */
					__('Per daug nesėkmingų bandymų. Pabandykite po %d min. Slaptažodį galite atkurti el. paštu.', 'petshop'),
					max(1, $liko)
				)
			);
		}
		return $vartotojas;
	}

	public static function nesekme($login) {

		if (!self::veikia())          return;
		if (!self::saugomas_kelias()) return;

		$b = self::bukle();
		if (!empty($b['iki']) && $b['iki'] > time()) return;   // jau užrakinta

		$b['kiek'] = (int) $b['kiek'] + 1;

		if ($b['kiek'] >= self::RIBA) {
			$b['iki']  = time() + self::PAUZE;
			$b['kiek'] = 0;
			self::zurnalas('uzrakinta', $login);
		}

		set_transient(self::raktas(), $b, max(self::LANGAS, self::PAUZE));
	}

	/** Pavykus — skaitiklis nunulinamas. */
	public static function sekme($login, $vartotojas = null) {
		delete_transient(self::raktas());
	}

	public static function pranesimas($zinute) {
		if (!self::veikia()) return $zinute;
		$b = self::bukle();
		if (empty($b['iki']) || $b['iki'] <= time()) return $zinute;
		$liko = (int) ceil(($b['iki'] - time()) / 60);
		return $zinute . '<p class="message">' . esc_html(sprintf(
			'Prisijungimas laikinai pristabdytas. Liko apie %d min.', max(1, $liko)
		)) . '</p>';
	}

	/** Įrašas į petshop-sargas žurnalą, jei jis yra; kitaip tyliai praleidžiama. */
	private static function zurnalas($ivykis, $login) {
		global $wpdb;
		$l = $wpdb->prefix . 'ps_sargas_klaidos';
		if ($wpdb->get_var("SHOW TABLES LIKE '{$l}'") !== $l) return;
		$wpdb->insert($l, [
			'ivyko'   => current_time('mysql'),
			'tipas'   => 'login',
			'zinute'  => sprintf('%s: %s (bandytas vardas: %s)', $ivykis, self::adresas(), substr((string) $login, 0, 60)),
		]);
	}
}

Petshop_Prisijungimo_Sargas::pradzia();
