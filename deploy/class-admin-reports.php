<?php
/**
 * Petshop_Admin_Reports — „Petshop ataskaitos" MENIU TEVAS ir pradzios ekranas.
 *
 * ISTORIJA (2026-08-16): sis failas buvo ir meniu tevas, IR atskira ataskaita
 * „Augintiniu anketos izvalgos". Del to admin'e buvo DU ekranai apie ta pati:
 * senasis cia ir naujasis „Augintinio anketa" (kontrakto §6, sesios skiltys).
 *
 * Visi unikalus senojo ekrano blokai PERKELTI i „Augintinio anketa":
 *   „Kita" laisvi tekstai              -> Paklausa
 *   Dazniausiai priskirtas maistas     -> Paklausa
 *   Rusys / Kuo maitina / Sterilizuoti -> Paklausa
 *   Pirkimai is Mitybos plano          -> Pinigai
 *   Apimtis, jautrumai, poreikiai      -> Paklausa ir Duomenu kokybe
 *
 * Todel cia nebeliko ataskaitos — liko TIK meniu registracija ir pradzios
 * ekranas su nuorodomis. Failo NETRINAM: jis registruoja `add_menu_page`, be
 * jo dingtu visas „Petshop ataskaitos" meniu su visomis ataskaitomis.
 *
 * PRINCIPAS: viena tema — vienas ekranas. Du langai apie ta pati reiskia, kad
 * anksciau ar veliau jie prasilenks, ir niekas nezinos, kuriuo tiketi.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Admin_Reports {

	const CAP    = 'manage_woocommerce';
	const PARENT = 'petshop-reports';
	const SLUG   = 'petshop-reports';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
	}

	/**
	 * „Petshop ataskaitos" — BENDRAS konteineris. Ateities ataskaitos kabinamos
	 * cia kaip nauji add_submenu_page( self::PARENT, ... ), kad viskas butu
	 * vienoje vietoje, o ne issibarste po WP meniu.
	 */
	public static function menu() {
		add_menu_page(
			'Petshop ataskaitos', 'Petshop ataskaitos', self::CAP, self::PARENT,
			array( __CLASS__, 'render' ), 'dashicons-chart-bar', 56
		);
		add_submenu_page(
			self::PARENT, 'Ataskaitos', 'Visos ataskaitos',
			self::CAP, self::PARENT, array( __CLASS__, 'render' )
		);
	}

	/**
	 * Pradzios ekranas. Sarasas sudaromas is REALIAI uzregistruotu submenu
	 * punktu, ne is rankinio saraso — pridejus nauja ataskaita ji atsiras cia
	 * pati, ir sis failas neliks pasenes.
	 */
	public static function render() {
		if ( ! current_user_can( self::CAP ) ) {
			wp_die( 'Neturite teisių.' );
		}
		global $submenu;
		$punktai = isset( $submenu[ self::PARENT ] ) ? $submenu[ self::PARENT ] : array();

		/* Trumpi paaiskinimai — kad zmogus zinotu, i kuria eiti, o ne spetu. */
		$aprasai = array(
			'petshop-reports-anketa'    => 'Anketos piltuvėlis, rekomendacijų gedimai, paklausa, duomenų kokybė, refill ir pinigai — šešiuose skirtukuose.',
			'petshop-reports-rinkiniai' => 'Surenkamų rinkinių pardavimai, marža ir vitrinos elgsena.',
			'petshop-reports-paruosti'  => 'Paruoštų rinkinių ataskaita.',
			'petshop-reports-brandai'   => 'Kliento įvestų maisto prekių ženklų susiejimas su katalogu. Čia patvirtinamos tik tos įvestys, kurių sistema netvirtina pati.',
		);

		echo '<div class="wrap"><h1>Petshop ataskaitos</h1>';
		echo '<p class="description">Visos ataskaitos vienoje vietoje. Duomenys — iš tų pačių sluoksnių, todėl skaičiai tarpusavyje sutampa.</p>';
		echo '<div class="ps-rep-grid">';

		$rodyta = 0;
		foreach ( $punktai as $p ) {
			$pav  = isset( $p[0] ) ? wp_strip_all_tags( $p[0] ) : '';
			$slug = isset( $p[2] ) ? $p[2] : '';
			if ( $slug === '' || $slug === self::PARENT ) { continue; } /* saves nerodom */
			$rodyta++;
			$url = admin_url( 'admin.php?page=' . $slug );
			echo '<a class="ps-rep-card" href="' . esc_url( $url ) . '">';
			echo '<span class="ps-rep-h">' . esc_html( $pav ) . '</span>';
			if ( isset( $aprasai[ $slug ] ) ) {
				echo '<span class="ps-rep-d">' . esc_html( $aprasai[ $slug ] ) . '</span>';
			}
			echo '</a>';
		}
		if ( ! $rodyta ) {
			echo '<p>Ataskaitų modulių nerasta.</p>';
		}
		echo '</div>';
		self::css();
		echo '</div>';
	}

	private static function css() {
		echo '<style>
		.ps-rep-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;margin-top:16px;max-width:1000px}
		.ps-rep-card{display:block;background:#fff;border:1px solid #dcdcde;border-radius:6px;padding:16px 18px;text-decoration:none;color:inherit}
		.ps-rep-card:hover{border-color:#2271b1;box-shadow:0 1px 4px rgba(0,0,0,.06)}
		.ps-rep-h{display:block;font-size:15px;font-weight:600;color:#2271b1;margin-bottom:5px}
		.ps-rep-d{display:block;font-size:12.5px;line-height:1.45;color:#646970}
		</style>';
	}
}
