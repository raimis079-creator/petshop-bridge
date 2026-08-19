<?php
/**
 * Plugin Name: Petshop Priežiūros režimas
 * Description: Priežiūros režimas per failo vėliavą. Įjungiamas ir išjungiamas be WP admin, be SSH, be tilto — tik sukuriant arba ištrinant failą per DirectAdmin failų tvarkyklę.
 * Version: 1.0.1
 *
 * VĖLIAVOS FAILAS:  wp-content/uploads/ps-prieziura.flag
 *   yra    → priežiūros režimas ĮJUNGTAS
 *   nėra   → parduotuvė veikia normaliai
 *
 * Failo turinys (neprivalomas) — pirmoji eilutė rodoma lankytojui vietoj
 * numatytojo teksto. Antroji eilutė, jei tai skaičius, = Retry-After sekundėmis.
 *
 * KODĖL FAILAS, O NE NUSTATYMAS DUOMENŲ BAZĖJE:
 *   DOD-19 §3.3 numato priežiūros režimą PRIEŠ duomenų bazės atstatymą.
 *   Jungiklis, gyvenantis duomenų bazėje, tuo metu būtų nepasiekiamas —
 *   tai yra vienintelis atvejis, kuriam jis ir reikalingas.
 *
 * KAS PRALEIDŽIAMA (sąmoningai):
 *   - prisijungę vartotojai su teise `manage_woocommerce`
 *   - wp-admin, wp-login.php, admin-ajax.php
 *   - WP-CLI ir cron
 *   - ?wc-api=...  — MOKĖJIMŲ ATGALINIAI KVIETIMAI. Užblokavus juos,
 *     klientas sumokėtų, o užsakymas liktų „laukiama apmokėjimo".
 *   - slaptas raktas ?ps_prieziura=<raktas> — nustato slapuką 12 val.
 *
 * SEO: grąžinamas 503 su antrašte Retry-After. Google tokio atsakymo
 * neindeksuoja ir puslapių iš indekso NEIŠMETA. 200 arba 302 čia būtų klaida.
 */

if (!defined('ABSPATH')) exit;

final class Petshop_Prieziura {

	const VERSIJA      = '1.0.1';
	const VELIAVA      = 'ps-prieziura.flag';
	const SLAPUKAS     = 'ps_prieziura_leidimas';
	const RAKTO_OPCIJA = 'ps_prieziura_raktas';

	public static function pradzia() {
		// template_redirect, NE init.
		// init vyksta ir REST uzklausoms -> ijungus rezima uzsidarytu tiltas,
		// t.y. irankis, kuriuo dirbama BUTENT prieziuros metu (DOD-19 3.3).
		// template_redirect vyksta tik vitrinos kelyje: REST, admin-ajax,
		// wc-api, wp-cron ir wp-admin praeina savaime, be isimciu saraso.
		add_action('template_redirect', [__CLASS__, 'tikrinti'], 0);
		add_action('admin_bar_menu', [__CLASS__, 'juostos_zyme'], 999);
		add_action('admin_notices', [__CLASS__, 'admin_pranesimas']);
	}

	/** Vėliavos failo pilnas kelias. Skaičiuojamas, ne įrašytas. */
	public static function velevos_kelias() {
		$u = wp_upload_dir();
		return trailingslashit($u['basedir']) . self::VELIAVA;
	}

	/** Ar režimas įjungtas. */
	public static function ijungtas() {
		return file_exists(self::velevos_kelias());
	}

	/** Slaptas raktas praėjimui. Sukuriamas pirmą kartą ir nebekeičiamas. */
	public static function raktas() {
		$r = get_option(self::RAKTO_OPCIJA);
		if (!$r) {
			$r = wp_generate_password(20, false, false);
			add_option(self::RAKTO_OPCIJA, $r, '', 'yes');
		}
		return $r;
	}

	public static function tikrinti() {

		if (!self::ijungtas()) return;

		/* --- praleidžiami keliai --- */


		if (defined('WP_CLI') && WP_CLI) return;

		// Mokėjimų atgaliniai kvietimai. template_redirect jų ir taip nepasiekia,
		// bet paliekama sąmoningai — tai vienintelė vieta, kur klaida reikštų
		// paimtus pinigus be užsakymo.
		if (isset($_GET['wc-api']) && $_GET['wc-api'] !== '') return;

		// Savininkas prisijungęs.
		if (is_user_logged_in() && current_user_can('manage_woocommerce')) return;

		// Slaptas raktas adrese → slapukas 12 val.
		if (isset($_GET['ps_prieziura']) && hash_equals(self::raktas(), (string) $_GET['ps_prieziura'])) {
			setcookie(self::SLAPUKAS, self::raktas(), time() + 12 * HOUR_IN_SECONDS, COOKIEPATH ?: '/', COOKIE_DOMAIN, is_ssl(), true);
			return;
		}
		if (isset($_COOKIE[self::SLAPUKAS]) && hash_equals(self::raktas(), (string) $_COOKIE[self::SLAPUKAS])) return;

		/* --- viskas kita: 503 --- */
		self::rodyti();
	}

	private static function rodyti() {

		$tekstas = 'Atnaujiname parduotuvę. Netrukus grįšime.';
		$retry   = 1800;

		$turinys = @file_get_contents(self::velevos_kelias());
		if (is_string($turinys) && trim($turinys) !== '') {
			$eil = preg_split('/\r\n|\r|\n/', trim($turinys));
			if (!empty($eil[0])) $tekstas = wp_strip_all_tags($eil[0]);
			if (isset($eil[1]) && ctype_digit(trim($eil[1]))) $retry = max(60, min(86400, (int) trim($eil[1])));
		}

		if (!headers_sent()) {
			status_header(503);
			nocache_headers();
			header('Retry-After: ' . $retry);
			header('Content-Type: text/html; charset=utf-8');
		}

		$t = esc_html($tekstas);
		echo <<<HTML
<!doctype html>
<html lang="lt"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Netrukus grįšime — petshop.lt</title>
<style>
 html,body{height:100%;margin:0}
 body{display:flex;align-items:center;justify-content:center;
      font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
      color:#2b2b2b;background:#faf8f5;padding:24px}
 .d{max-width:460px;text-align:center}
 h1{font-size:22px;font-weight:600;margin:0 0 12px}
 p{margin:0 0 8px;color:#555}
 .k{margin-top:24px;font-size:14px;color:#777}
 a{color:#2b2b2b}
</style>
</head><body>
<div class="d">
  <h1>Netrukus grįšime</h1>
  <p>{$t}</p>
  <p class="k">Klausimais rašykite <a href="mailto:terra@petshop.lt">terra@petshop.lt</a></p>
</div>
</body></html>
HTML;
		exit;
	}

	public static function juostos_zyme($juosta) {
		if (!self::ijungtas() || !current_user_can('manage_woocommerce')) return;
		$juosta->add_node([
			'id'    => 'ps-prieziura',
			'title' => '⚠ PRIEŽIŪROS REŽIMAS',
			'href'  => admin_url(),
			'meta'  => ['title' => 'Lankytojai mato 503. Išjungiama ištrynus ' . self::VELIAVA],
		]);
	}

	public static function admin_pranesimas() {
		if (!self::ijungtas() || !current_user_can('manage_woocommerce')) return;
		$u = wp_upload_dir();
		$k = esc_html(str_replace(ABSPATH, '', trailingslashit($u['basedir']) . self::VELIAVA));
		echo '<div class="notice notice-warning"><p><strong>Priežiūros režimas įjungtas.</strong> '
		   . 'Lankytojai mato 503. Išjungiama ištrynus failą <code>' . $k . '</code>.<br>'
		   . 'Peržiūrai be prisijungimo: <code>?ps_prieziura=' . esc_html(self::raktas()) . '</code></p></div>';
	}
}

Petshop_Prieziura::pradzia();
