/**
 * Petshop Complianz X = Atmesti v1
 * X (close) mygtukas elgiasi kaip ATMESTI (uzfiksuoja pilna deny per .cmplz-deny),
 * o ne tuscias dismiss. Capture-phase kad preemptintu Complianz handleri.
 * Consent Bridge (#619) neliestas.
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_footer', function () {
	if ( is_admin() ) { return; }
	echo "<script id=\"petshop-cmplz-x-deny\">(function(){document.addEventListener('click',function(e){var t=e.target;var x=(t&&t.closest)?t.closest('.cmplz-cookiebanner .cmplz-close'):null;if(!x)return;var d=document.querySelector('.cmplz-cookiebanner .cmplz-deny');if(d){e.preventDefault();e.stopImmediatePropagation();d.click();}},true);})();</script>\n";
}, 100 );
