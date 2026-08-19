<?php
/**
 * Plugin Name: Petshop Tipų žurnalas (laikinas)
 * Description: Užrašo, kokio tipo laukus WP All Import paduoda petshop-xml blokavimo funkcijoms. Nieko nekeičia — tik stebi. Skirtas „Array to string conversion" priežasčiai nustatyti.
 * Version: 1.0.0
 *
 * KODĖL: petshop-xml.php eilutės 343/344 ir 513/515 kas importą meta
 * „Array to string conversion". XML struktūroje pasikartojančių laukų NĖRA
 * (išmatuota H115: ZB 2 622 įrašai, VF 2 351 — nė vieno). Vadinasi masyvą
 * sukuria pats WP All Import, o ne tiekėjo failas.
 *
 * ELGSENA: kabinasi tuo pačiu filtru PO petshop-xml (prioritetas 999),
 * grąžina reikšmę NEPAKEISTĄ. Jokios įtakos importui.
 *
 * IŠJUNGIMAS: sukurti failą wp-content/uploads/ps-tipu-zurnalas.off
 * REZULTATAS: wp-content/uploads/ps-backups/tipu-zurnalas.json
 *
 * PAŠALINTI, kai priežastis nustatyta.
 */

if (!defined('ABSPATH')) exit;

final class Petshop_Tipu_Zurnalas {

	const VERSIJA  = '1.0.0';
	const RIBA     = 150;      // daugiausia įrašų, kad failas neaugtų be galo
	const VELIAVA  = 'ps-tipu-zurnalas.off';

	public static function pradzia() {
		add_filter('wp_all_import_is_post_to_create', [__CLASS__, 'stebek'], 999, 3);
		add_filter('wp_all_import_is_post_to_update', [__CLASS__, 'stebek_upd'], 999, 4);
	}

	private static function veikia() {
		$u = wp_upload_dir();
		return !file_exists(trailingslashit($u['basedir']) . self::VELIAVA);
	}

	public static function stebek($tesk, $data, $import_id) {
		self::rasyk('create', $data, $import_id);
		return $tesk;
	}

	public static function stebek_upd($tesk, $data, $post, $import_id) {
		self::rasyk('update', $data, $import_id);
		return $tesk;
	}

	/** Rašoma TIK tada, kai bent vienas laukas nėra paprasta reikšmė. */
	private static function rasyk($kur, $data, $import_id) {

		try {
			if (!self::veikia())   return;
			if (!is_array($data))  return;

			$netipiniai = [];
			foreach ($data as $raktas => $reiksme) {
				if (is_scalar($reiksme) || is_null($reiksme)) continue;
				$netipiniai[$raktas] = [
					'tipas'  => gettype($reiksme),
					'kiek'   => is_array($reiksme) ? count($reiksme) : null,
					'turinys'=> is_array($reiksme)
						? array_map(function ($v) { return is_scalar($v) ? mb_substr((string) $v, 0, 60) : gettype($v); },
						            array_slice($reiksme, 0, 3, true))
						: null,
				];
			}
			if (empty($netipiniai)) return;

			$u  = wp_upload_dir();
			$bk = trailingslashit($u['basedir']) . 'ps-backups';
			if (!is_dir($bk)) @mkdir($bk, 0755, true);
			$f = $bk . '/tipu-zurnalas.json';

			$sar = [];
			if (file_exists($f)) {
				$t = @file_get_contents($f);
				if ($t) { $j = json_decode($t, true); if (is_array($j)) $sar = $j; }
			}
			if (count($sar) >= self::RIBA) return;

			$sar[] = [
				'laikas'     => current_time('mysql'),
				'kur'        => $kur,
				'import_id'  => (int) $import_id,
				'visi_raktai'=> array_slice(array_keys($data), 0, 40),
				'NETIPINIAI' => $netipiniai,
			];
			@file_put_contents($f, wp_json_encode($sar, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

		} catch (Throwable $e) {
			// Stebėtojas niekada negali sulaužyti importo.
		}
	}
}

Petshop_Tipu_Zurnalas::pradzia();
