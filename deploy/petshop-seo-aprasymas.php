<?php
/**
 * Plugin Name: Petshop SEO Aprašymo Valymas v1.0.0 (esybių dekodavimas)
 * Description: Iššifruoja HTML esybes ir pašalina tagus Rank Math meta aprašyme.
 *              Dalis prekių turi dvigubai užkoduotą post_excerpt (&lt;p&gt;...),
 *              kurį Rank Math ima žalią, aplenkdamas WooCommerce filtrų grandinę.
 *              Vitrinoje tekstas švarus, o meta aprašyme nutekėdavo matoma šiukšlė.
 *              Filtras taiso ir esamus, ir busimus importų atvejus.
 * Version: 1.0.0
 * Author: Petshop.lt
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Petshop_SEO_Aprasymas' ) ) {

	class Petshop_SEO_Aprasymas {

		const VERSIJA = '1.0.0';

		/** Kiek kartų daugiausiai bandoma dekoduoti (dvigubas/trigubas kodavimas). */
		const MAX_DEKODAVIMU = 3;

		public static function init() {
			add_filter( 'rank_math/frontend/description', array( __CLASS__, 'valyti' ), 20 );
		}

		/**
		 * Nuvalo meta aprašymą.
		 *
		 * Eiga: pakartotinai dekoduojamos esybes (kol tekstas nustoja keistis),
		 * tada pašalinami atsidengę tagai, tada suvienodinami tarpai.
		 * Jei po valymo liktų tuščia — grąžinamas originalas (geriau šiukšlė nei niekas).
		 *
		 * @param  string $tekstas Rank Math paruoštas aprašymas.
		 * @return string
		 */
		public static function valyti( $tekstas ) {

			if ( ! is_string( $tekstas ) || '' === trim( $tekstas ) ) {
				return $tekstas;
			}

			$t = $tekstas;

			for ( $i = 0; $i < self::MAX_DEKODAVIMU; $i++ ) {
				$pries = $t;
				$t     = html_entity_decode( $t, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
				if ( $t === $pries ) {
					break;
				}
			}

			$t = wp_strip_all_tags( $t );
			$t = preg_replace( '/\s+/u', ' ', $t );
			$t = trim( $t );

			return ( '' === $t ) ? $tekstas : $t;
		}
	}

	Petshop_SEO_Aprasymas::init();
}
