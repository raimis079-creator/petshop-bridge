/**
 * TEMP — Footer KLIENTAMS DUK fix (token)
 * DRY:   /?footer_fix=1&token=cmplz_6680aa2a42151d54fa8d64ec
 * APPLY: /?footer_fix=1&token=cmplz_6680aa2a42151d54fa8d64ec&confirm=FIX_DUK
 */
if ( ! defined( 'ABSPATH' ) ) { return; }
add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['footer_fix'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	$out   = array();
	$apply = isset( $_GET['confirm'] ) && $_GET['confirm'] === 'FIX_DUK';
	$out['mode'] = $apply ? 'APPLY' : 'DRY-RUN';

	$opt = get_option( 'widget_custom_html' );
	if ( ! isset( $opt[3]['content'] ) && ! isset( $opt[3]['text'] ) ) {
		wp_send_json( array( 'error' => 'widget_custom_html[3] nerastas', 'keys' => isset($opt[3]) ? array_keys($opt[3]) : null ) );
	}
	$field = isset( $opt[3]['content'] ) ? 'content' : 'text';
	$html  = $opt[3][ $field ];

	$out['title']  = isset($opt[3]['title']) ? $opt[3]['title'] : null;
	$out['PRIES']  = $html;

	// 1. Pasalinam netvarkinga <br><a href="/duk/">DUK</a>
	$clean = preg_replace( '#<br\s*/?>\s*<a[^>]*href="/duk/"[^>]*>\s*DUK\s*</a>#i', '', $html );
	$out['po_valymo_pakeista'] = ( $clean !== $html );

	// 2. Idedam tvarkinga <li> po Grazinimas <li>
	$duk_li = '<li style="margin-bottom:6px;"><a href="/duk/" style="color:#fffcec;">DUK</a></li>';
	$done = false;
	if ( preg_match( '#(<li[^>]*>\s*<a[^>]*href="[^"]*grazinimas[^"]*"[^>]*>.*?</a>\s*</li>)#is', $clean, $m ) ) {
		$clean = str_replace( $m[1], $m[1] . $duk_li, $clean );
		$out['metodas'] = 'idetas <li> po Grazinimas';
		$done = true;
	} elseif ( preg_match( '#(<li[^>]*>\s*<a[^>]*href="[^"]*taisykles[^"]*"[^>]*>)#is', $clean, $m ) ) {
		$clean = str_replace( $m[1], $duk_li . $m[1], $clean );
		$out['metodas'] = 'idetas <li> pries Taisykles';
		$done = true;
	} else {
		$out['metodas'] = 'NERASTAS iterpimo taskas';
	}

	$out['PO']    = $clean;
	$out['ilgis'] = strlen( $html ) . ' -> ' . strlen( $clean );
	$out['duk_li_kiekis'] = substr_count( $clean, 'href="/duk/"' );

	if ( ! $apply || ! $done ) {
		header( 'Content-Type: application/json; charset=utf-8' );
		echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		exit;
	}

	$opt[3][ $field ] = $clean;
	update_option( 'widget_custom_html', $opt );
	wp_cache_flush();

	$after = get_option( 'widget_custom_html' );
	$out['issaugota'] = ( $after[3][ $field ] === $clean );
	$out['duk_kiekis_po'] = substr_count( $after[3][ $field ], 'href="/duk/"' );

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
