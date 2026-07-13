if ( ! defined( 'ABSPATH' ) ) { return; }

/**
 * Petshop Build-a-box UI Valymas v2
 * Build-a-box (#547 psc-form) palieka matomą MNM container add-to-cart bloką apačioje:
 * validacijos žinutę (.mnm_status/.mnm_message) + container kiekį (.mnm_button_wrap .quantity).
 * Custom „Jūsų rinkinys" suvestinė + proxy CTA juos pakeičia -> paslepiam.
 * Scope: body.petshop-choice-page .psc-form. Container kiekis yra .mnm_button_wrap viduje;
 * prekių kiekiai (.mnm_child_products) NEPALIESTI. Tikras add-to-cart mygtukas lieka (proxy jį spaudžia).
 */
add_action( 'wp_head', function () {
	if ( ! function_exists( 'is_product' ) || ! is_product() ) { return; }
	echo '<style id="ps-boxui">
	body.petshop-choice-page .psc-form .mnm_button_wrap .ux-quantity,
	body.petshop-choice-page .psc-form .mnm_button_wrap .quantity{display:none !important;}
	body.petshop-choice-page .psc-form .mnm_status,
	body.petshop-choice-page .psc-form .mnm_message{display:none !important;}
	</style>' . "\n";
}, 99 );
