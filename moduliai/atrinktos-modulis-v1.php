if ( ! defined('ABSPATH') ) { return; }

/**
 * Atrinktos Prekės Modulis v1 (rotacija)
 * Reusable shortcode: [petshop_atrinktos species="sunims"]
 * - Pool per rūšis (registras)
 * - Date-seed rotacija (tą dieną visiems vienoda, kasdien kinta)
 * - Kategorijos limitas (max per_cat iš tos pačios)
 * - Auto-skip: nepublish / išparduota / kaina 0
 * - Matomos {visible}, „Rodyti daugiau" atskleidžia iki {max}
 * - Nebūtinas pin="ID,ID" fiksuotiems slotams (default: gryna rotacija)
 */

function ps_atr_pool( $species ) {
	$pools = array(
		'sunims' => array(
			array(34471,'maistas'), array(34486,'maistas'), array(34156,'maistas'),
			array(34168,'kramtalai'), array(34175,'kramtalai'),
			array(27198,'zaislai'), array(26500,'zaislai'),
			array(33994,'pavadeliai'), array(33956,'pavadeliai'),
			array(26897,'higiena'),
			array(23934,'sampunai'),
			array(27852,'guoliai'), array(26640,'guoliai'),
			array(27071,'dubeneliai'), array(23705,'dubeneliai'),
			array(24802,'vitaminai'), array(26919,'vitaminai'),
			array(26958,'sukos'),
			array(14492,'apranga'),
			array(33894,'transportavimas'),
		),
		'katems' => array(
			array(34498,'maistas'),
			array(34500,'maistas'),
			array(34488,'maistas'),
			array(34172,'skanestai'),
			array(34170,'skanestai'),
			array(24992,'zaislai'),
			array(17305,'zaislai'),
			array(26342,'kraikai'),
			array(24790,'kraikai'),
			array(32554,'tualetai'),
			array(27866,'tualetai'),
			array(33990,'draskykles'),
			array(32578,'draskykles'),
			array(25121,'dubeneliai'),
			array(19140,'dubeneliai'),
			array(18485,'vitaminai'),
			array(26790,'sukos'),
			array(26017,'guoliai'),
			array(19268,'antkakliai'),
			array(33894,'transportavimas'),
		),
	);
	return isset( $pools[ $species ] ) ? $pools[ $species ] : array();
}

function ps_atr_valid( $id ) {
	$p = wc_get_product( $id );
	return ( $p && $p->get_status() === 'publish' && $p->is_in_stock() && (float) $p->get_price() > 0 );
}

function ps_atr_pick( $species, $per_cat = 2, $max = 12, $pin = array() ) {
	$pool = ps_atr_pool( $species );
	if ( empty( $pool ) ) { return array(); }
	$arr = $pool; $n = count( $arr );
	mt_srand( intval( date( 'Ymd' ) ) );
	for ( $i = $n - 1; $i > 0; $i-- ) { $j = mt_rand( 0, $i ); $t = $arr[$i]; $arr[$i] = $arr[$j]; $arr[$j] = $t; }
	$picked = array(); $cc = array(); $used = array();
	foreach ( $pin as $pid ) {
		if ( count( $picked ) >= $max ) { break; }
		if ( ps_atr_valid( $pid ) ) { $picked[] = intval( $pid ); $used[ $pid ] = 1; }
	}
	foreach ( $arr as $it ) {
		if ( count( $picked ) >= $max ) { break; }
		if ( isset( $used[ $it[0] ] ) ) { continue; }
		$cat = $it[1];
		if ( isset( $cc[ $cat ] ) && $cc[ $cat ] >= $per_cat ) { continue; }
		if ( ! ps_atr_valid( $it[0] ) ) { continue; }
		$picked[] = $it[0]; $used[ $it[0] ] = 1;
		$cc[ $cat ] = ( isset( $cc[ $cat ] ) ? $cc[ $cat ] : 0 ) + 1;
	}
	return $picked;
}

function ps_atr_card( $id ) {
	$p = wc_get_product( $id );
	if ( ! $p ) { return ''; }
	$img   = wp_get_attachment_image_url( get_post_thumbnail_id( $id ), 'woocommerce_thumbnail' );
	$title = html_entity_decode( get_the_title( $id ) );
	$price = $p->get_price_html();
	$link  = get_permalink( $id );
	if ( $p->is_type('simple') && $p->is_purchasable() && $p->is_in_stock() ) {
		$btn = sprintf(
			'<a href="?add-to-cart=%1$d" data-quantity="1" data-product_id="%1$d" class="button product_type_simple add_to_cart_button ajax_add_to_cart ps-atr-btn" rel="nofollow">Į krepšelį</a>',
			$id
		);
	} else {
		$btn = '<a href="' . esc_url( $link ) . '" class="button ps-atr-btn ps-atr-btn-alt">Peržiūrėti</a>';
	}
	return '<div class="ps-atr-card">'
		. '<a class="ps-atr-imgwrap" href="' . esc_url( $link ) . '"><img src="' . esc_url( $img ) . '" alt="' . esc_attr( $title ) . '" loading="lazy"></a>'
		. '<a class="ps-atr-title" href="' . esc_url( $link ) . '">' . esc_html( $title ) . '</a>'
		. '<div class="ps-atr-price">' . $price . '</div>'
		. $btn
		. '</div>';
}

function ps_atr_shortcode( $atts ) {
	$a = shortcode_atts( array(
		'species' => 'sunims',
		'title'   => 'Atrinktos prekės šunims',
		'visible' => 8,
		'max'     => 12,
		'per_cat' => 2,
		'pin'     => '',
	), $atts );

	$pin = array_filter( array_map( 'intval', array_filter( explode( ',', $a['pin'] ) ) ) );
	$ids = ps_atr_pick( $a['species'], intval( $a['per_cat'] ), intval( $a['max'] ), $pin );
	if ( empty( $ids ) ) { return ''; }

	$visible = intval( $a['visible'] );
	$extra   = max( 0, count( $ids ) - $visible );

	ob_start(); ?>
<style>
.ps-atr{max-width:1200px;margin:0 auto;padding:8px 0}
.ps-atr *{box-sizing:border-box}
.ps-atr-h{font-family:Inter,sans-serif;font-size:26px;font-weight:700;color:#2D5F3F;margin:0 0 18px;text-align:center}
.ps-atr-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;align-items:stretch}
.ps-atr-cell{display:flex}
.ps-atr-card{display:flex;flex-direction:column;width:100%;background:#fff;border:1px solid #E6ECE4;border-radius:8px;padding:12px;transition:box-shadow .18s,transform .18s}
.ps-atr-card:hover{box-shadow:0 6px 18px rgba(45,95,63,.12);transform:translateY(-2px)}
.ps-atr-imgwrap{display:block;aspect-ratio:1/1;overflow:hidden;border-radius:6px;background:#F7F9F6}
.ps-atr-imgwrap img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
.ps-atr-title{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-family:Inter,sans-serif;font-size:14px;line-height:1.35;color:#333;margin:10px 0 6px;min-height:38px;text-decoration:none}
.ps-atr-title:hover{color:#2D5F3F}
.ps-atr-price{font-family:Inter,sans-serif;font-weight:700;color:#2D5F3F;font-size:17px;margin:auto 0 10px;line-height:1.2}
.ps-atr-price .screen-reader-text{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.ps-atr-price del{color:#999;font-weight:400;font-size:14px;margin-right:6px}
.ps-atr-price ins{text-decoration:none;color:#E67E22}
.ps-atr-btn{display:block;text-align:center;background:#2D5F3F;color:#fff!important;font-family:Inter,sans-serif;font-weight:600;font-size:14px;padding:10px 8px;border-radius:8px;border:none;text-decoration:none;cursor:pointer;transition:background .15s;white-space:nowrap}
.ps-atr-btn:hover{background:#234c32;color:#fff!important}
.ps-atr-btn-alt{background:#fff;color:#2D5F3F!important;border:1px solid #2D5F3F}
.ps-atr-btn-alt:hover{background:#F1F6EF;color:#2D5F3F!important}
.ps-atr-more-wrap{text-align:center;margin-top:22px}
.ps-atr-more{display:inline-block;background:#fff;color:#2D5F3F;border:1.5px solid #2D5F3F;font-family:Inter,sans-serif;font-weight:600;font-size:15px;padding:11px 28px;border-radius:8px;cursor:pointer;transition:all .15s}
.ps-atr-more:hover{background:#2D5F3F;color:#fff}
.ps-atr-hidden{display:none}
@media(max-width:900px){.ps-atr-grid{grid-template-columns:repeat(3,1fr);gap:14px}.ps-atr-h{font-size:22px}}
@media(max-width:600px){
	.ps-atr{padding:4px 0}
	.ps-atr-grid{grid-template-columns:repeat(2,1fr);gap:10px}
	.ps-atr-h{font-size:19px;margin-bottom:14px}
	.ps-atr-card{padding:10px;border-radius:8px}
	.ps-atr-title{font-size:13.5px;line-height:1.32;min-height:36px;margin:9px 0 5px}
	.ps-atr-price{font-size:16px;margin-bottom:9px}
	.ps-atr-price del{font-size:12.5px;margin-right:5px}
	.ps-atr-price ins{font-size:16px}
	.ps-atr-btn{font-size:13.5px;padding:9px 4px;border-radius:6px}
	.ps-atr-more{font-size:14px;padding:10px 22px}
}
</style>
<div class="ps-atr">
	<?php if ( trim( (string) $a['title'] ) !== '' ) : ?><h2 class="ps-atr-h"><?php echo esc_html( $a['title'] ); ?></h2><?php endif; ?>
	<div class="ps-atr-grid">
		<?php
		foreach ( $ids as $i => $id ) {
			$hidden = ( $i >= $visible ) ? ' ps-atr-hidden ps-atr-extra' : '';
			echo '<div class="ps-atr-cell' . $hidden . '">' . ps_atr_card( $id ) . '</div>';
		}
		?>
	</div>
	<?php if ( $extra > 0 ) : ?>
	<div class="ps-atr-more-wrap">
		<button type="button" class="ps-atr-more" onclick="var b=this;document.querySelectorAll('.ps-atr-extra').forEach(function(e){e.classList.remove('ps-atr-hidden')});b.style.display='none';">Rodyti daugiau (dar <?php echo intval( $extra ); ?>)</button>
	</div>
	<?php endif; ?>
</div>
	<?php
	return ob_get_clean();
}
add_shortcode( 'petshop_atrinktos', 'ps_atr_shortcode' );
