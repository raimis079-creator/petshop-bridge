<?php
/**
 * Plugin Name: Petshop Kategorijos Aprašymo Vieta v1.0.1 (perkėlimas po prekių + išskleidimas)
 * Description: WooCommerce kategorijos aprašymą numatytai deda VIRŠ prekių tinklelio.
 *              Išmatuota (2026-08-18): 296 žodžių tekstas nustumia pirmą prekę į
 *              1 284 px desktop ir 2 128 px mobile, kai langas yra 1 100 / 844.
 *              Sename petshop.lt tekstas buvo po prekėmis. Šis modulis grąžina tą
 *              tvarką ir suskleidžia ilgą tekstą.
 *
 *              Originali WooCommerce funkcija NEPERRAŠOMA — tik perkeliama jos
 *              išvestis, todėl išlieka visos jos patikros (taksonomija, antras
 *              puslapis, wp_kses_post, wc_format_content).
 *
 *              Hub kategorijos (ŠUNIMS, KATĖMS ir kt.) naudoja atskirą landing
 *              šabloną, kuris baigiasi exit — ten šie kabliukai nesuveikia.
 * Version: 1.0.1
 * Author: Petshop.lt
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Petshop_Kategorijos_Aprasymas' ) ) {

	class Petshop_Kategorijos_Aprasymas {

		const VERSIJA = '1.0.1';

		/** Suskleisto bloko aukštis pikseliais. Ilgesnis tekstas gauna „Plačiau". */
		const SUSKLEISTAS_AUKSTIS = 190;

		public static function init() {
			add_action( 'init', array( __CLASS__, 'nuimti_is_virsaus' ), 20 );
			add_action( 'woocommerce_after_main_content', array( __CLASS__, 'rodyti_apacioje' ), 5 );
		}

		/**
		 * Nuima numatytąjį aprašymą nuo archyvo viršaus.
		 *
		 * Vykdoma per `init`, nes mu-plugin'ai kraunami PRIEŠ WooCommerce —
		 * anksčiau kabliuko dar nebūtų ką nuimti.
		 */
		public static function nuimti_is_virsaus() {
			remove_action( 'woocommerce_archive_description', 'woocommerce_taxonomy_archive_description', 10 );
		}

		/**
		 * Išveda tą patį aprašymą po prekių tinklelio.
		 */
		public static function rodyti_apacioje() {

			if ( ! function_exists( 'woocommerce_taxonomy_archive_description' ) ) {
				return;
			}

			ob_start();
			woocommerce_taxonomy_archive_description();
			$turinys = trim( (string) ob_get_clean() );

			if ( '' === $turinys ) {
				return;
			}

			self::stilius();

			$id = 'ps-kat-tog';
			?>
			<div class="ps-kat">
				<input type="checkbox" id="<?php echo esc_attr( $id ); ?>" class="ps-kat-tog">
				<div class="ps-kat-box"><?php echo $turinys; // jau praėjęs wp_kses_post WooCommerce pusėje ?></div>
				<label for="<?php echo esc_attr( $id ); ?>" class="ps-kat-lab"></label>
			</div>
			<?php
		}

		/**
		 * Stilius. Išskleidimas be JS — paslėptas checkbox plius label.
		 */
		protected static function stilius() {

			static $ispausdinta = false;
			if ( $ispausdinta ) {
				return;
			}
			$ispausdinta = true;

			$h = (int) self::SUSKLEISTAS_AUKSTIS;
			?>
			<style id="ps-kat-stilius">
			.ps-kat{margin:2.2em 0 1em;position:relative}
			/* Jungiklio NEGALIMA slepti per display:none ar [hidden] — Flatsome CSS
			   perrašo ir langelis lieka matomas (patikrinta 2026-08-18). Slepiam
			   iškirpimu: nematomas, bet pasiekiamas klaviatūra. */
			.ps-kat-tog{position:absolute!important;width:1px;height:1px;margin:0;padding:0;border:0;
				opacity:0;pointer-events:none;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;appearance:none}
			.ps-kat-box{position:relative;overflow:hidden;max-height:<?php echo $h; ?>px;transition:max-height .35s ease}
			.ps-kat-box::after{content:"";position:absolute;left:0;right:0;bottom:0;height:70px;
				background:linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,.97));pointer-events:none;transition:opacity .2s}
			.ps-kat-lab{display:inline-block;margin-top:.7em;cursor:pointer;font-weight:600;
				font-size:.95em;letter-spacing:.02em;border-bottom:1px solid currentColor;padding-bottom:1px}
			.ps-kat-lab::after{content:"Plačiau ▾"}
			.ps-kat-tog:checked ~ .ps-kat-box{max-height:none}
			.ps-kat-tog:checked ~ .ps-kat-box::after{opacity:0}
			.ps-kat-tog:checked ~ .ps-kat-lab::after{content:"Suskleisti ▴"}
			.ps-kat .term-description{margin:0}
			.ps-kat .term-description h2,.ps-kat .term-description h3{margin-top:1.1em}
			.ps-kat .term-description p:last-child{margin-bottom:0}
			</style>
			<?php
		}
	}

	Petshop_Kategorijos_Aprasymas::init();
}
