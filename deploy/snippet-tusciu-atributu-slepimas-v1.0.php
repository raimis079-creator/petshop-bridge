/**
 * Prekes Tusciu atributu slepimas v1.0 (woocommerce_display_product_attributes)
 *
 * Nerodo kliento prekes kortelėje atributų eilučių, kurių reikšmė tuščia.
 * Priežastis: dalis prekių turi priskirtą atributą (pvz. pa_monoprotein) be jokio
 * termino — Woo tokiu atveju piešia antraštę su tuščiu langeliu.
 * Veikia tik ATVAIZDAVIMUI. Feed'ai, katalogas ir _product_attributes nekeičiami.
 * Code Snippets id 5255, aktyvus, scope global, priority 10. S1666 / 2026-09-09.
 */
add_filter( 'woocommerce_display_product_attributes', function( $attributes, $product = null ) {
	if ( ! is_array( $attributes ) ) {
		return $attributes;
	}
	foreach ( $attributes as $raktas => $eilute ) {
		$reiksme = isset( $eilute['value'] ) ? $eilute['value'] : '';
		if ( is_array( $reiksme ) ) {
			$reiksme = implode( ' ', $reiksme );
		}
		$svarus = trim( wp_strip_all_tags( (string) $reiksme ) );
		$svarus = trim( str_replace( array( "\xc2\xa0", '&nbsp;' ), ' ', $svarus ) );
		if ( '' === $svarus || '-' === $svarus || '–' === $svarus ) {
			unset( $attributes[ $raktas ] );
		}
	}
	return $attributes;
}, 20, 2 );
