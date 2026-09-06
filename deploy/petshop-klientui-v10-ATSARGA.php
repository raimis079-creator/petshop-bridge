<?php
/**
 * Petshop Klientui v1.0 (S1628, Raimis 09-06: „klientui reikia tik sąskaitos, o kvitų ir važtaraščių tikrai nereikia“)
 *
 * KAS: WCDN (WooCommerce Print Invoice & Delivery Notes 7.3) kliento pusėje — paskyros užsakymų sąraše, užsakymo
 * puslapyje ir „ačiū“ puslapyje — rodo po mygtuką kiekvienam įjungtam šablonui: „Spausdinti sąskaitą“, „Spausdinti kvitą“,
 * „Spausdinti važtaraštį“ (delivery-note) ir dar kartą „Spausdinti važtaraštį“ (packing-slip). Klientui reikia tik PVM sąskaitos.
 *
 * KAIP: WCDN filtras `wcdn_template_types_from_order` (helpers/class-utils.php `get_template_types()`, naudojamas ir mygtukams,
 * ir `print-order` endpoint'ui) — ne administratoriui (front-end, be `edit_shop_orders`) paliekamas TIK `invoice`.
 * Admin'e (WC užsakymo langas, `wp_ajax_print_order`) ir darbuotojams — viskas kaip buvo. Šablonai WCDN nustatymuose neišjungiami
 * (darbuotojų spausdinimui lieka). Kliento paskyros „Atsisakyti sutarties (ES 14 d. teisė)“ — `petshop-atsisakymas.php`, neliesta.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_filter( 'wcdn_template_types_from_order', function ( $types, $order ) {
	if ( is_admin() && ! wp_doing_ajax() ) { return $types; }
	if ( current_user_can( 'edit_shop_orders' ) ) { return $types; }
	return in_array( 'invoice', (array) $types, true ) ? array( 'invoice' ) : array();
}, 20, 2 );
