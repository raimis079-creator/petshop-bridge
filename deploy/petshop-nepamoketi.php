<?php
/**
 * Plugin Name: Petshop Neapmokėtų užsakymų taisyklė
 * Description: Bankiniu pavedimu apmokamų užsakymų neatšaukia 3 paras. Visiems kitiems galioja bendra riba.
 * Version: 1.0.0
 *
 * PROBLEMA: `woocommerce_hold_stock_minutes` yra VIENAS skaičius visiems
 * mokėjimo būdams. Kortelės atveju 90 min. yra tinkama — pamestas krepšelis
 * atsilaisvina greitai. Bankiniam pavedimui tai naikinamoji: pinigai ateina
 * per parą–dvi, o užsakymas atšaukiamas anksčiau, nei klientas sumoka.
 *
 * SPRENDIMAS: WooCommerce prieš atšaukdamas KIEKVIENĄ užsakymą klausia
 * filtro `woocommerce_cancel_unpaid_order` (wc-order-functions.php:1141)
 * ir paduoda patį užsakymą. Vadinasi atsakyti galima skirtingai.
 *
 * 🔒 SAUGUMO RIBA: šis modulis gali tik SULAIKYTI atšaukimą, niekada jo
 * nesukelti. Jei WooCommerce nusprendė neatšaukti, sprendimas nekeičiamas.
 * Blogiausias įmanomas padarinys — prekės pagulės ilgiau.
 *
 * IŠJUNGIMAS: wp-content/uploads/ps-nepamoketi.off
 */

if (!defined('ABSPATH')) exit;

final class Petshop_Nepamoketi {

	const VERSIJA = '1.0.0';
	const PAROS   = 3;                       // kiek laikyti pavedimo užsakymą
	const BUDAI   = ['bacs'];                // mokėjimo būdai, kuriems taikoma
	const VELIAVA = 'ps-nepamoketi.off';

	public static function pradzia() {
		add_filter('woocommerce_cancel_unpaid_order', [__CLASS__, 'ar_atsaukti'], 20, 2);
	}

	private static function veikia() {
		$u = wp_upload_dir();
		return !file_exists(trailingslashit($u['basedir']) . self::VELIAVA);
	}

	/**
	 * @param bool     $atsaukti Ką nusprendė WooCommerce.
	 * @param WC_Order $order
	 */
	public static function ar_atsaukti($atsaukti, $order) {

		// Nekeičiam sprendimo, jei jis ir taip „neatšaukti".
		if (!$atsaukti)             return $atsaukti;
		if (!self::veikia())        return $atsaukti;
		if (!$order instanceof WC_Order) return $atsaukti;

		try {
			$budas = (string) $order->get_payment_method();
			if (!in_array($budas, self::BUDAI, true)) return $atsaukti;

			$sukurta = $order->get_date_created();
			if (!$sukurta) return $atsaukti;          // datos nėra — nesikišam

			$amzius_s = time() - $sukurta->getTimestamp();
			$riba_s   = self::PAROS * DAY_IN_SECONDS;

			if ($amzius_s < $riba_s) {
				$order->add_order_note(sprintf(
					'Automatinis atšaukimas sulaikytas: bankinis pavedimas, užsakymui %d val. iš %d.',
					(int) floor($amzius_s / HOUR_IN_SECONDS),
					self::PAROS * 24
				));
				return false;
			}
		} catch (Throwable $e) {
			return $atsaukti;                          // klaida — paliekam WooCommerce sprendimą
		}

		return $atsaukti;
	}
}

Petshop_Nepamoketi::pradzia();
