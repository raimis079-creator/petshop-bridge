<?php
/**
 * Plugin Name: Petshop schema — prekės v1.0 (S1701)
 * Description: (Greta petshop-schema.php — takelis, S8.) Papildo Rank Math Product JSON-LD (filtras rank_math/json_ld) laukais, kurių trūko (2026-09-20 recon, 1.8):
 *   name be „ - Petshop.lt", description be HTML esybių, brand (product_brand), gtin13, offers.shippingDetails (Venipak/LP paštomatas
 *   €1,78, nemokamas nuo €30, kurjeris €3,30; išsiuntimas 1–3 d. d.), offers.hasMerchantReturnPolicy (14 d. ne maisto prekėms,
 *   maistui — negalima pagal CK), additionalProperty su atributų pavadinimais (ne pa_* slug), seller/Organization su logo,
 *   telefonu ir adresu. Tikslas — Google Merchant listings be įspėjimų ir AI botų (ChatGPT/Perplexity) citavimas.
 *   Išjungti: opcija ps_schema_prekes_isjungta = 1. Nieko nekeičia, jei Rank Math grafo nėra.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

final class Petshop_Schema_Prekes {
	const PASTOMATAS_CT = 178; const KURJERIS_CT = 330; const NEMOKAMAS_NUO_CT = 3000;
	const TEL = '+370 681 87787';

	public static function init() {
		if ( get_option( 'ps_schema_prekes_isjungta' ) ) { return; }
		add_filter( 'rank_math/json_ld', array( __CLASS__, 'json_ld' ), 99, 2 );
	}

	private static function maistas( $pid ) {
		$terms = get_the_terms( $pid, 'product_cat' );
		if ( ! $terms || is_wp_error( $terms ) ) { return false; }
		foreach ( $terms as $t ) {
			$s = $t->slug . ' ' . mb_strtolower( $t->name );
			if ( preg_match( '/maist|skanest|konserv|pasar|pašar/u', $s ) ) { return true; }
			foreach ( get_ancestors( $t->term_id, 'product_cat' ) as $aid ) { $a = get_term( $aid, 'product_cat' ); if ( $a && preg_match( '/maist|skanest|konserv/u', $a->slug ) ) { return true; } }
		}
		return false;
	}

	public static function json_ld( $data, $jsonld ) {
		if ( ! is_array( $data ) || ! is_singular( 'product' ) ) { return $data; }
		$pid = get_queried_object_id();
		$pr  = $pid ? wc_get_product( $pid ) : null;
		if ( ! $pr ) { return $data; }

		// Organization
		$logo = get_site_icon_url( 512 );
		if ( ! $logo ) { $cl = (int) get_theme_mod( 'custom_logo' ); $logo = $cl ? (string) wp_get_attachment_url( $cl ) : ''; }
		if ( ! $logo ) { $fl = get_theme_mod( 'site_logo' ); $logo = is_numeric( $fl ) ? (string) wp_get_attachment_url( (int) $fl ) : (string) $fl; } // Flatsome
		foreach ( $data as $k => &$node ) {
			if ( isset( $node['@type'] ) && 'Organization' === $node['@type'] ) {
				$node['url'] = home_url( '/' );
				if ( $logo ) { $node['logo'] = $logo; }
				$node['telephone'] = self::TEL;
				$node['address'] = array( '@type' => 'PostalAddress', 'streetAddress' => 'Liucionių g. 46, Liucionių k.', 'addressLocality' => 'Nemenčinės sen., Vilniaus r.', 'postalCode' => 'LT-15166', 'addressCountry' => 'LT' );
				$node['legalName'] = 'UAB Avesa';
			}
		}
		unset( $node );

		if ( ! isset( $data['richSnippet'] ) || ! is_array( $data['richSnippet'] ) ) { return $data; }
		$p = &$data['richSnippet'];
		if ( ( $p['@type'] ?? '' ) !== 'Product' ) { return $data; }

		$p['name'] = $pr->get_name();
		$desc = $pr->get_short_description() ?: $pr->get_description();
		$desc = trim( preg_replace( '/\s+/u', ' ', wp_strip_all_tags( html_entity_decode( html_entity_decode( (string) $desc, ENT_QUOTES, 'UTF-8' ), ENT_QUOTES, 'UTF-8' ) ) ) );
		if ( '' !== $desc ) { $p['description'] = mb_substr( $desc, 0, 500 ); }

		$bt = get_the_terms( $pid, 'product_brand' );
		if ( $bt && ! is_wp_error( $bt ) ) { $p['brand'] = array( '@type' => 'Brand', 'name' => $bt[0]->name ); }

		$gtin = (string) get_post_meta( $pid, '_global_unique_id', true );
		if ( preg_match( '/^\d{13}$/', $gtin ) ) { $p['gtin13'] = $gtin; $p['gtin'] = $gtin; }
		elseif ( preg_match( '/^\d{8}$/', $gtin ) ) { $p['gtin8'] = $gtin; }
		elseif ( preg_match( '/^\d{14}$/', $gtin ) ) { $p['gtin14'] = $gtin; }
		$sku = $pr->get_sku(); if ( $sku ) { $p['sku'] = $sku; $p['mpn'] = $sku; }

		// atributai su pavadinimais
		if ( ! empty( $p['additionalProperty'] ) && is_array( $p['additionalProperty'] ) ) {
			$ap = array();
			foreach ( $p['additionalProperty'] as $row ) {
				if ( empty( $row['value'] ) ) { continue; }
				$n = (string) ( $row['name'] ?? '' );
				if ( 0 === strpos( $n, 'pa_' ) ) { $row['name'] = wc_attribute_label( $n ); }
				$ap[] = $row;
			}
			$p['additionalProperty'] = $ap;
		}

		// pasiūlymas
		$offers = isset( $p['offers'] ) ? $p['offers'] : null;
		$vienas = $offers && isset( $offers['@type'] ) && 'Offer' === $offers['@type'];
		$list   = $vienas ? array( $offers ) : ( is_array( $offers ) ? $offers : array() );
		$kaina  = (float) $pr->get_price();
		$sv     = (float) $pr->get_weight(); // kg
		$maistas = self::maistas( $pid );
		foreach ( $list as &$of ) {
			if ( ! is_array( $of ) ) { continue; }
			$of['url'] = get_permalink( $pid );
			if ( isset( $of['seller'] ) && is_array( $of['seller'] ) ) { $of['seller']['@id'] = home_url( '/#organization' ); if ( $logo ) { $of['seller']['logo'] = $logo; } else { unset( $of['seller']['logo'] ); } }
			$pastomatas = ( $sv <= 25 ); // Venipak paštomatas iki 25 kg (LP iki 30)
			$rate = $pastomatas ? ( $kaina >= self::NEMOKAMAS_NUO_CT / 100 ? 0 : self::PASTOMATAS_CT / 100 ) : self::KURJERIS_CT / 100;
			$of['shippingDetails'] = array(
				'@type'               => 'OfferShippingDetails',
				'shippingRate'        => array( '@type' => 'MonetaryAmount', 'value' => number_format( $rate, 2, '.', '' ), 'currency' => 'EUR' ),
				'shippingDestination' => array( '@type' => 'DefinedRegion', 'addressCountry' => 'LT' ),
				'deliveryTime'        => array(
					'@type'        => 'ShippingDeliveryTime',
					'handlingTime' => array( '@type' => 'QuantitativeValue', 'minValue' => 0, 'maxValue' => 2, 'unitCode' => 'DAY' ),
					'transitTime'  => array( '@type' => 'QuantitativeValue', 'minValue' => 1, 'maxValue' => 2, 'unitCode' => 'DAY' ),
				),
			);
			$of['hasMerchantReturnPolicy'] = $maistas
				? array( '@type' => 'MerchantReturnPolicy', 'applicableCountry' => 'LT', 'returnPolicyCategory' => 'https://schema.org/MerchantReturnNotPermitted' )
				: array( '@type' => 'MerchantReturnPolicy', 'applicableCountry' => 'LT', 'returnPolicyCategory' => 'https://schema.org/MerchantReturnFiniteReturnWindow', 'merchantReturnDays' => 14, 'returnMethod' => 'https://schema.org/ReturnByMail', 'returnFees' => 'https://schema.org/ReturnShippingFees' );
		}
		unset( $of );
		$p['offers'] = $vienas ? $list[0] : $list;
		return $data;
	}
}
add_action( 'init', array( 'Petshop_Schema_Prekes', 'init' ), 5 );
