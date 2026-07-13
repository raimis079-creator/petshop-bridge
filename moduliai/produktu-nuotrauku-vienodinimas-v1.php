if ( ! defined( 'ABSPATH' ) ) { return; }

/**
 * Petshop Produktu Nuotrauku Vienodinimas v1
 * WC thumbnail = uncropped -> skirtingi native aspect ratios -> skirtingi aukščiai
 * loop'e (shop/kategorija/panašūs/cross-sell). Fix: 1:1 box + object-fit:contain.
 * Nieko neapkarpo (rinkinių plačios nuotraukos lieka pilnos), tik vienodina aukštį.
 */
add_action( 'wp_head', function () {
	echo '<style id="ps-img-uniform">
	.product-small .box-image img,
	ul.products li.product .box-image img,
	.related .product-small .box-image img,
	.up-sells .product-small .box-image img{
		aspect-ratio:1/1 !important;
		width:100% !important;
		height:auto !important;
		object-fit:contain !important;
		object-position:center !important;
	}
	.product-small .box-image,
	ul.products li.product .box-image{
		aspect-ratio:1/1 !important;
		display:block !important;
	}
	</style>' . "\n";
}, 99 );
