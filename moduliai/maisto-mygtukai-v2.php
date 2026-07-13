if ( ! defined( 'ABSPATH' ) ) { return; }

/**
 * Petshop Maisto Tipo Mygtukai v2
 * Sausas / Konservai / Visas maistas mygtukai virš produktų.
 * Veikia ant maisto grupių (šunims 71/72/73, katėms 78/81/79).
 * Veda tiesiai į subkategorijas (SEO + aišku), aktyvus = dabartinė.
 */
add_action( 'woocommerce_before_shop_loop', function () {
	if ( ! function_exists( 'is_product_category' ) || ! is_product_category() ) { return; }
	$t = get_queried_object();
	if ( ! $t || empty( $t->term_id ) ) { return; }
	$cur = (int) $t->term_id;

	$groups = array(
		array( 'visas' => 71, 'sausas' => 72, 'konservai' => 73 ), // šunims
		array( 'visas' => 78, 'sausas' => 81, 'konservai' => 79 ), // katėms
	);
	$grp = null;
	foreach ( $groups as $g ) {
		if ( in_array( $cur, array( $g['visas'], $g['sausas'], $g['konservai'] ), true ) ) { $grp = $g; break; }
	}
	if ( ! $grp ) { return; }

	$items = array(
		$grp['sausas']    => 'Sausas maistas',
		$grp['konservai'] => 'Konservai',
		$grp['visas']     => 'Visas maistas',
	);

	$btns = '';
	foreach ( $items as $tid => $label ) {
		$link = get_term_link( (int) $tid, 'product_cat' );
		if ( is_wp_error( $link ) ) { continue; }
		$active = ( (int) $tid === $cur ) ? ' pcf-active' : '';
		$btns .= '<a class="pcf-btn' . $active . '" href="' . esc_url( $link ) . '">' . esc_html( $label ) . '</a>';
	}
	if ( '' === $btns ) { return; }

	echo '<div class="pcf-wrap"><span class="pcf-label">Maisto tipas:</span><div class="pcf-btns">' . $btns . '</div></div>';
	echo '<style>
	.pcf-wrap{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:0 0 22px;font-family:Inter,sans-serif}
	.pcf-label{font-size:14px;font-weight:600;color:#5a6b5e}
	.pcf-btns{display:inline-flex;gap:8px;flex-wrap:wrap}
	.pcf-btn{display:inline-block;background:#fff;color:#2D5F3F;border:1.5px solid #cfe0c8;font-size:14px;font-weight:600;padding:9px 18px;border-radius:8px;text-decoration:none;transition:all .15s}
	.pcf-btn:hover{border-color:#2D5F3F;background:#F1F6EF}
	.pcf-btn.pcf-active{background:#2D5F3F;color:#fff;border-color:#2D5F3F}
	@media(max-width:600px){.pcf-wrap{gap:8px;margin-bottom:16px}.pcf-label{width:100%;font-size:13px}.pcf-btn{flex:1;text-align:center;padding:9px 8px;font-size:13px}}
	</style>';
}, 4 );
