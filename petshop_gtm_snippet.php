/**
 * Petshop GTM Snippet v1.0 (GTM-MF3GZGT)
 *
 * Idiegia Google Tag Manager i front-end.
 * DEV apsauga: blokavimas vyksta GTM viduje (trigger'iai 17/18),
 * ne cia — snippet'as krauna GTM visur vienodai.
 *
 * Scope: front-end only
 * SVARBU: Complianz NETURI ideti savo GTM/GA4/Meta kodo.
 */

if ( ! defined( 'ABSPATH' ) ) { return; }

if ( ! defined( 'PETSHOP_GTM_ID' ) ) {
	define( 'PETSHOP_GTM_ID', 'GTM-MF3GZGT' );
}

if ( ! function_exists( 'petshop_gtm_head' ) ) {
	function petshop_gtm_head() {
		if ( is_admin() ) { return; }
		$id = PETSHOP_GTM_ID;
		echo "\n<!-- Google Tag Manager -->\n";
		echo "<script data-petshop-gtm-loader=\"1\">";
		echo "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':";
		echo "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],";
		echo "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=";
		echo "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);";
		echo "})(window,document,'script','dataLayer','" . esc_js( $id ) . "');";
		echo "</script>\n";
		echo "<!-- End Google Tag Manager -->\n";
	}
}
add_action( 'wp_head', 'petshop_gtm_head', 1 );

if ( ! function_exists( 'petshop_gtm_body' ) ) {
	function petshop_gtm_body() {
		if ( is_admin() ) { return; }
		$id = esc_attr( PETSHOP_GTM_ID );
		echo "\n<!-- Google Tag Manager (noscript) -->\n";
		echo '<noscript data-petshop-gtm-noscript="1"><iframe src="https://www.googletagmanager.com/ns.html?id=' . $id . '"';
		echo ' height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>';
		echo "\n<!-- End Google Tag Manager (noscript) -->\n";
	}
}
add_action( 'wp_body_open', 'petshop_gtm_body', 1 );
