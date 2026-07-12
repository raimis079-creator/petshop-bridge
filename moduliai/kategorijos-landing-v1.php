if ( ! defined( 'ABSPATH' ) ) { return; }

/**
 * Petshop Kategorijos Landing v1 (sunims)
 * Parent gyvūno kategorijos archyvą pakeičia landing puslapiu.
 * Veikia TIK ant žemėlapyje esančių parent term_id (dabar: 70 = ŠUNIMS).
 * Vaikų kategorijos (Maistas #71 ir t.t.) NEPALIESTOS — normalus archyvas.
 * Reversible: deaktyvuok snippet -> grįžta normalus archyvas.
 */

function petshop_landing_map() {
	return array(
		70 => array(
			'species' => 'sunims',
			'h1'      => 'Prekės šunims',
			'intro'   => 'Viskas jūsų šuniui vienoje vietoje. Pasirinkite kategoriją arba iškart žiūrėkite atrinktas prekes žemiau.',
			'atr_title' => 'Atrinktos prekės šunims',
			'cards'   => array(
				// term_id => array( attachment_id, display_label )
				71  => array( 34615, 'Maistas šunims' ),
				95  => array( 34616, 'Skanėstai' ),
				115 => array( 34617, 'Žaislai' ),
				116 => array( 34618, 'Antkakliai ir pavadėliai' ),
				82  => array( 34619, 'Higiena' ),
				101 => array( 34620, 'Vitaminai ir papildai' ),
				233 => array( 34621, 'Guoliai' ),
				111 => array( 34622, 'Dubenėliai' ),
			),
		),
	);
}

add_action( 'template_redirect', function () {
	if ( is_admin() ) { return; }
	if ( ! function_exists( 'is_product_category' ) || ! is_product_category() ) { return; }
	$term = get_queried_object();
	if ( ! $term || empty( $term->term_id ) ) { return; }
	$map = petshop_landing_map();
	if ( ! isset( $map[ $term->term_id ] ) ) { return; }

	get_header();
	echo petshop_render_landing( $map[ $term->term_id ], $term->term_id );
	get_footer();
	exit;
}, 5 );

function petshop_render_landing( $cfg, $parent_id ) {
	$main_ids = array_keys( $cfg['cards'] );

	// 8 pagrindinės kortelės
	$cards_html = '';
	foreach ( $cfg['cards'] as $tid => $info ) {
		$link = get_term_link( $tid, 'product_cat' );
		if ( is_wp_error( $link ) ) { continue; }
		$img = wp_get_attachment_url( $info[0] );
		$cards_html .= '<a class="pcl-card" href="' . esc_url( $link ) . '">'
			. '<span class="pcl-imgwrap"><img src="' . esc_url( $img ) . '" alt="' . esc_attr( $info[1] ) . '" loading="lazy"></span>'
			. '<span class="pcl-name">' . esc_html( $info[1] ) . '</span></a>';
	}

	// „Rodyti visas kategorijas" — kiti vaikai su preke
	$extras = '';
	$children = get_terms( array( 'taxonomy' => 'product_cat', 'parent' => $parent_id, 'hide_empty' => false ) );
	if ( ! is_wp_error( $children ) ) {
		foreach ( $children as $c ) {
			if ( in_array( $c->term_id, $main_ids, true ) ) { continue; }
			if ( $c->count < 1 ) { continue; }
			$l = get_term_link( $c );
			if ( is_wp_error( $l ) ) { continue; }
			$nm = trim( str_replace( ' šunims', '', $c->name ) );
			$extras .= '<a class="pcl-chip" href="' . esc_url( $l ) . '">' . esc_html( $nm ) . '</a>';
		}
	}

	// „Rinkitės pagal poreikį" (MVP: nuorodos į maisto kategoriją; tikslūs filtrai — TODO)
	$food = get_term_link( 71, 'product_cat' );
	$food = is_wp_error( $food ) ? '#' : $food;
	$poreikis = array(
		array( 'Jautriam virškinimui', 'Sudėtis švelnesnė skrandžiui ir stabilesniam virškinimui.', $food ),
		array( 'Vienas baltymo šaltinis', 'Monoproteininis maistas — viena mėsos rūšis, aiški sudėtis.', $food ),
		array( 'Be grūdų', 'Grain-free receptūros angliavandeniams iš daržovių.', $food ),
		array( 'Naujam šuniukui', 'Maistas ir svarbiausios priežiūros prekės pirmai pradžiai.', $food ),
	);
	$por_html = '';
	foreach ( $poreikis as $p ) {
		$por_html .= '<a class="pcl-por" href="' . esc_url( $p[2] ) . '">'
			. '<span class="pcl-por-t">' . esc_html( $p[0] ) . '</span>'
			. '<span class="pcl-por-d">' . esc_html( $p[1] ) . '</span></a>';
	}

	$atr = do_shortcode( '[petshop_atrinktos species="' . esc_attr( $cfg['species'] ) . '" title="' . esc_attr( $cfg['atr_title'] ) . '"]' );

	ob_start(); ?>
<style>
.pcl{max-width:1200px;margin:0 auto;padding:24px 20px 10px;font-family:Inter,sans-serif}
.pcl *{box-sizing:border-box}
.pcl-hero{margin:6px 0 26px}
.pcl-hero h1{font-size:32px;font-weight:700;color:#2D5F3F;margin:0 0 8px}
.pcl-hero p{font-size:16px;color:#5a6b5e;margin:0;max-width:640px;line-height:1.5}
.pcl-cats{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.pcl-card{display:block;text-decoration:none;background:#fff;border:1px solid #E6ECE4;border-radius:12px;padding:16px;text-align:center;transition:box-shadow .18s,transform .18s}
.pcl-card:hover{box-shadow:0 8px 22px rgba(45,95,63,.12);transform:translateY(-2px)}
.pcl-imgwrap{display:block;aspect-ratio:1/1;border-radius:10px;overflow:hidden;background:#F2F5EF}
.pcl-imgwrap img{width:100%;height:100%;object-fit:cover}
.pcl-name{display:block;margin-top:12px;font-size:15px;font-weight:600;color:#2D5F3F}
.pcl-showall-wrap{text-align:center;margin-top:24px}
.pcl-showall{display:inline-block;background:#fff;color:#2D5F3F;border:1.5px solid #2D5F3F;font-family:inherit;font-weight:600;font-size:14px;padding:10px 24px;border-radius:8px;cursor:pointer;transition:all .15s}
.pcl-showall:hover{background:#2D5F3F;color:#fff}
.pcl-extras{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:16px}
.pcl-chip{background:#F3F7F1;border:1px solid #DDE8D8;color:#3a5a44;font-size:13px;padding:7px 14px;border-radius:20px;text-decoration:none;transition:all .15s}
.pcl-chip:hover{background:#2D5F3F;color:#fff;border-color:#2D5F3F}
.pcl-hidden{display:none}
.pcl-h2{font-size:24px;font-weight:700;color:#2D5F3F;margin:46px 0 4px}
.pcl-sub{font-size:14px;color:#8a998d;margin:0 0 20px}
.pcl-por-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:20px}
.pcl-por{display:block;background:#fff;border:1px solid #E6ECE4;border-radius:12px;padding:20px 18px;text-decoration:none;transition:box-shadow .18s,transform .18s}
.pcl-por:hover{box-shadow:0 6px 18px rgba(45,95,63,.1);transform:translateY(-2px)}
.pcl-por-t{display:block;font-size:16px;font-weight:700;color:#2D5F3F;margin-bottom:8px}
.pcl-por-d{display:block;font-size:13px;color:#6a786d;line-height:1.45}
.pcl-cta{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;background:#2D5F3F;border-radius:16px;padding:28px 32px;margin:46px 0 40px}
.pcl-cta h3{color:#fff;font-size:21px;margin:0 0 6px}
.pcl-cta p{color:#d9e6da;margin:0;font-size:14px}
.pcl-cta-btns{display:flex;gap:12px;flex-wrap:wrap}
.pcl-cta-btn{background:#fff;color:#2D5F3F!important;font-weight:600;padding:12px 26px;border-radius:8px;text-decoration:none;transition:opacity .15s}
.pcl-cta-btn:hover{opacity:.88}
.pcl-cta-btn.alt{background:transparent;color:#fff!important;border:1.5px solid #fff}
@media(max-width:900px){.pcl-cats{grid-template-columns:repeat(2,1fr);gap:14px}.pcl-por-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){
	.pcl{padding:16px 14px}
	.pcl-hero h1{font-size:25px}.pcl-hero p{font-size:14px}
	.pcl-cats{grid-template-columns:repeat(2,1fr);gap:12px}
	.pcl-card{padding:10px}.pcl-name{font-size:13px}
	.pcl-h2{font-size:20px}
	.pcl-por-grid{grid-template-columns:1fr;gap:12px}
	.pcl-cta{padding:22px;text-align:center;justify-content:center}
	.pcl-cta-btns{justify-content:center;width:100%}
}
</style>
<div class="pcl">
	<div class="pcl-hero"><h1><?php echo esc_html( $cfg['h1'] ); ?></h1><p><?php echo esc_html( $cfg['intro'] ); ?></p></div>

	<div class="pcl-cats"><?php echo $cards_html; ?></div>

	<?php if ( $extras ) : ?>
	<div class="pcl-showall-wrap"><button type="button" class="pcl-showall" onclick="var e=document.querySelector('.pcl-extras');e.classList.toggle('pcl-hidden');this.textContent=e.classList.contains('pcl-hidden')?'Rodyti visas kategorijas ▾':'Slėpti kategorijas ▴';">Rodyti visas kategorijas ▾</button></div>
	<div class="pcl-extras pcl-hidden"><?php echo $extras; ?></div>
	<?php endif; ?>

	<h2 class="pcl-h2"><?php echo esc_html( $cfg['atr_title'] ); ?></h2>
	<p class="pcl-sub">Mūsų rekomenduojami pasirinkimai šuniui</p>
	<?php echo $atr; ?>

	<h2 class="pcl-h2">Rinkitės pagal poreikį</h2>
	<div class="pcl-por-grid"><?php echo $por_html; ?></div>

	<div class="pcl-cta">
		<div><h3>Nežinote, ko ieškoti?</h3><p>Parašykite arba paskambinkite — padėsime išsirinkti pagal augintinio poreikį.</p></div>
		<div class="pcl-cta-btns"><a class="pcl-cta-btn" href="/kontaktai/">Paskambinti</a><a class="pcl-cta-btn alt" href="mailto:terra@petshop.lt">Parašyti</a></div>
	</div>
</div>
	<?php
	return ob_get_clean();
}
