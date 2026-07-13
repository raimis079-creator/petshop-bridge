if ( ! defined( 'ABSPATH' ) ) { return; }

/**
 * Petshop Produktu Nuotrauku Vienodinimas v2
 * WC thumbnail = uncropped -> skirtingi native aspect ratios -> skirtingi aukščiai.
 * Fix: 1:1 box + object-fit:contain visose produktų loop'o formose.
 * v2: pridėta build-a-box (Mix and Match) prekių eilutės (.mnm_child_product_images).
 * Nieko neapkarpo (rinkinių plačios nuotraukos lieka pilnos), tik vienodina aukštį.
 */
add_action( 'wp_head', function () {
	echo '<style id="ps-img-uniform">
	/* Shop/kategorija/panašūs/cross-sell loop */
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
	/* Build-a-box (Mix and Match) prekių eilutės */
	.mnm_child_product_images{
		width:90px !important;
		aspect-ratio:1/1 !important;
		display:block !important;
	}
	.mnm_child_product_images .mnm_child_product_image,
	.mnm_child_product_images figure{
		width:100% !important;
		height:100% !important;
		margin:0 !important;
	}
	.mnm_child_product_images img{
		aspect-ratio:1/1 !important;
		width:100% !important;
		height:100% !important;
		object-fit:contain !important;
		object-position:center !important;
	}
	</style>' . "\n";
}, 99 );
