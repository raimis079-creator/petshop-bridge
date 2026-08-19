<?php
/**
 * Plugin Name: Petshop Schema — prekių naršymo takelis
 * Description: Prideda BreadcrumbList schemą prekių puslapiams. Rank Math ją išveda kategorijoms, bet ne prekėms, nors būtent prekių puslapiuose Google paieškos rezultate rodo takelį vietoj adreso.
 * Version: 1.0.2
 *
 * TŽ §S8 reikalauja: Product schema, BreadcrumbList, Organization.
 * Išmatuota 2026-08-19 (H092): kategorijoje BreadcrumbList yra, prekėje nėra.
 *
 * Takelis statomas iš pirminės kategorijos (Rank Math `rank_math_primary_product_cat`),
 * o jos nesant — iš giliausios priskirtos kategorijos, su visais protėviais.
 */

if (!defined('ABSPATH')) exit;

final class Petshop_Schema_Takelis {

	const VERSIJA = '1.0.2';

	/**
	 * JSON-LD yra duomenys, ne HTML. `get_the_title()` ir termino vardas grąžina
	 * jau užkoduotas esybes (`&amp;`, `&#8211;`), o įdėtos į JSON jos lieka
	 * pažodžiui — Google perskaitytų „N&amp;D". Todėl dekoduojama.
	 */
	private static function tekstas($t) {
		$t = wp_strip_all_tags((string) $t);
		// Dalis pavadinimų duomenų bazėje užkoduoti DU kartus (`&amp;amp;`),
		// todėl dekoduojama kartotinai, kol nustoja keistis. Riba — 4 kartai,
		// kad sugadintas įrašas nesuktų ciklo be pabaigos.
		for ($i = 0; $i < 4; $i++) {
			$naujas = html_entity_decode($t, ENT_QUOTES | ENT_HTML5, 'UTF-8');
			if ($naujas === $t) break;
			$t = $naujas;
		}
		return $t;
	}

	public static function pradzia() {
		add_filter('rank_math/json_ld', [__CLASS__, 'prideti'], 99, 2);
	}

	public static function prideti($data, $jsonld) {

		if (!function_exists('is_product') || !is_product()) return $data;
		if (!is_array($data)) return $data;

		// Jei Rank Math kada nors pradės išvesti pats — nedubliuojam.
		foreach ((array) $data as $blokas) {
			if (!is_array($blokas) || empty($blokas['@type'])) continue;
			$t = $blokas['@type'];
			if (is_array($t) ? in_array('BreadcrumbList', $t, true) : $t === 'BreadcrumbList') {
				return $data;
			}
		}

		$id = get_the_ID();
		if (!$id) return $data;

		$elementai = [];
		$poz = 1;

		$elementai[] = [
			'@type'    => 'ListItem',
			'position' => $poz++,
			'name'     => __('Pradžia', 'petshop'),
			'item'     => home_url('/'),
		];

		$terminas = self::pirmine_kategorija($id);

		if ($terminas) {
			$grandine = array_reverse(get_ancestors($terminas->term_id, 'product_cat'));
			$grandine[] = $terminas->term_id;

			foreach ($grandine as $tid) {
				$t = get_term($tid, 'product_cat');
				if (!$t || is_wp_error($t)) continue;
				$nuoroda = get_term_link($t);
				if (is_wp_error($nuoroda)) continue;
				$elementai[] = [
					'@type'    => 'ListItem',
					'position' => $poz++,
					'name'     => self::tekstas($t->name),
					'item'     => $nuoroda,
				];
			}
		}

		// Paskutinis narys — pati prekė, be `item` (dabartinis puslapis).
		$elementai[] = [
			'@type'    => 'ListItem',
			'position' => $poz,
			'name'     => self::tekstas(get_the_title($id)),
		];

		$data['BreadcrumbList'] = [
			'@type'           => 'BreadcrumbList',
			'@id'             => trailingslashit(get_permalink($id)) . '#breadcrumb',
			'itemListElement' => $elementai,
		];

		return $data;
	}

	/** Pirminė kategorija pagal Rank Math, kitu atveju — giliausia priskirta. */
	private static function pirmine_kategorija($id) {

		$pirmine = (int) get_post_meta($id, 'rank_math_primary_product_cat', true);
		if ($pirmine) {
			$t = get_term($pirmine, 'product_cat');
			if ($t && !is_wp_error($t)) return $t;
		}

		$terminai = get_the_terms($id, 'product_cat');
		if (!$terminai || is_wp_error($terminai)) return null;

		$geriausias = null;
		$gylis = -1;
		foreach ($terminai as $t) {
			$g = count(get_ancestors($t->term_id, 'product_cat'));
			if ($g > $gylis) { $gylis = $g; $geriausias = $t; }
		}
		return $geriausias;
	}
}

Petshop_Schema_Takelis::pradzia();
