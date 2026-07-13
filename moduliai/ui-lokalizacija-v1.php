if ( ! defined( 'ABSPATH' ) ) { return; }

/**
 * Petshop UI Lokalizacija v2
 * Neišverstų angliškų UI eilučių vertimas į lietuvių.
 * 3 sluoksniai: gettext, gettext_with_context, widget_title (WC/YITH widget antraštės).
 * Plečiama: pridėk eilutę į $map (match pagal originalią anglišką eilutę, tikslų case).
 */
function petshop_ui_l10n_map() {
	return array(
		// WooCommerce widget antraštės (shop-sidebar) — saugomos su didžiosiom
		'Active Filters'    => 'Aktyvūs filtrai',
		'Active filters'    => 'Aktyvūs filtrai',
		'Filter by'         => 'Filtruoti pagal',
		'Filter by price'   => 'Filtruoti pagal kainą',
		// YITH Ajax filtras
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
	return isset( $map[ $text ] ) ? $map[ $text ] : $translation;
}, 20, 3 );

add_filter( 'gettext_with_context', function ( $translation, $text, $context, $domain ) {
	$map = petshop_ui_l10n_map();
	return isset( $map[ $text ] ) ? $map[ $text ] : $translation;
}, 20, 4 );

// Widget antraštės (WC layered nav filters „Active Filters" ir kt.) — neina per gettext
add_filter( 'widget_title', function ( $title ) {
	$map = petshop_ui_l10n_map();
	return isset( $map[ $title ] ) ? $map[ $title ] : $title;
}, 20 );
