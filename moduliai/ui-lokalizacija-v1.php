if ( ! defined( 'ABSPATH' ) ) { return; }

/**
 * Petshop UI Lokalizacija v1
 * Neišverstų angliškų UI eilučių vertimas į lietuvių (gettext override).
 * Plečiama: pridėk eilutę į $map. Match pagal originalią (anglišką) eilutę.
 * Rodoma DIDŽIOSIOM raidėm dažnai per CSS (text-transform) — verčiam normalią eilutę.
 */
function petshop_ui_l10n_map() {
	return array(
		// YITH Ajax filtras
		'Active filters'    => 'Aktyvūs filtrai',
		'Clear'             => 'Išvalyti',
		// WooCommerce
		'Select options'    => 'Pasirinkti',
		'Add to cart'       => 'Į krepšelį',
		'Read more'         => 'Plačiau',
		// Rinkinio dėžė (build-a-box)
		'Clear selections'  => 'Išvalyti pasirinkimus',
		'Clear selection'   => 'Išvalyti pasirinkimą',
	);
}

add_filter( 'gettext', function ( $translation, $text, $domain ) {
	$map = petshop_ui_l10n_map();
	if ( isset( $map[ $text ] ) ) {
		return $map[ $text ];
	}
	return $translation;
}, 20, 3 );

// su_domain variantas (kai kurie plugin'ai naudoja gettext_with_context)
add_filter( 'gettext_with_context', function ( $translation, $text, $context, $domain ) {
	$map = petshop_ui_l10n_map();
	if ( isset( $map[ $text ] ) ) {
		return $map[ $text ];
	}
	return $translation;
}, 20, 4 );
