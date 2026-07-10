/**
 * TEMP — Footer KLIENTAMS + DUK (token)
 * DRY:   /?footer_duk=1&token=cmplz_6680aa2a42151d54fa8d64ec
 * APPLY: /?footer_duk=1&token=cmplz_6680aa2a42151d54fa8d64ec&confirm=APPLY_DUK
 */
if ( ! defined( 'ABSPATH' ) ) { return; }
add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['footer_duk'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	global $wpdb;
	$out = array();
	$apply = isset( $_GET['confirm'] ) && $_GET['confirm'] === 'APPLY_DUK';
	$out['mode'] = $apply ? 'APPLY' : 'DRY-RUN';

	// Ieskom widget'u su KLIENTAMS
	$rows = $wpdb->get_results( "SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE 'widget_%'", ARRAY_A );
	$found = array();
	foreach ( $rows as $r ) {
		$v = maybe_unserialize( $r['option_value'] );
		if ( ! is_array( $v ) ) { continue; }
		foreach ( $v as $idx => $w ) {
			if ( ! is_array( $w ) ) { continue; }
			$blob = wp_json_encode( $w );
			if ( stripos( $blob, 'KLIENTAMS' ) !== false || stripos( $blob, 'grazinimas' ) !== false ) {
				$found[] = array( 'option' => $r['option_name'], 'index' => $idx, 'keys' => array_keys( $w ),
					'title' => isset($w['title'])?$w['title']:null,
					'has_duk' => ( stripos( $blob, '/duk/' ) !== false ),
					'content_preview' => isset($w['text']) ? substr($w['text'],0,400) : ( isset($w['content']) ? substr($w['content'],0,400) : substr($blob,0,400) ) );
			}
		}
	}
	$out['rasti_widgetai'] = $found;

	if ( ! $apply || empty( $found ) ) {
		header( 'Content-Type: application/json; charset=utf-8' );
		echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		exit;
	}

	// APPLY: pridedam DUK po Grazinimas
	$updated = array();
	foreach ( $found as $f ) {
		if ( $f['has_duk'] ) { $updated[] = array('option'=>$f['option'],'index'=>$f['index'],'status'=>'jau turi DUK'); continue; }
		$opt = get_option( $f['option'] );
		if ( ! isset( $opt[ $f['index'] ] ) ) { continue; }
		$w = $opt[ $f['index'] ];
		$field = isset($w['text']) ? 'text' : ( isset($w['content']) ? 'content' : null );
		if ( ! $field ) { $updated[] = array('option'=>$f['option'],'status'=>'nezinomas laukas'); continue; }

		$html = $w[ $field ];
		$backup_len = strlen( $html );

		// Randam Grazinimas eilute ir po jos idedam DUK
		$duk_li = '<li><a href="/duk/">DUK</a></li>';
		if ( preg_match( '#(<li>\s*<a[^>]*href="[^"]*grazinimas[^"]*"[^>]*>.*?</a>\s*</li>)#is', $html, $m ) ) {
			$html = str_replace( $m[1], $m[1] . $duk_li, $html );
			$method = 'po Grazinimas (<li>)';
		} elseif ( preg_match( '#(<a[^>]*href="[^"]*grazinimas[^"]*"[^>]*>.*?</a>)#is', $html, $m ) ) {
			$html = str_replace( $m[1], $m[1] . '<br><a href="/duk/">DUK</a>', $html );
			$method = 'po Grazinimas (<a>)';
		} else {
			$updated[] = array('option'=>$f['option'],'status'=>'Grazinimas nerastas — praleista');
			continue;
		}

		$opt[ $f['index'] ][ $field ] = $html;
		update_option( $f['option'], $opt );
		$updated[] = array( 'option'=>$f['option'], 'index'=>$f['index'], 'metodas'=>$method,
			'ilgis' => $backup_len . ' -> ' . strlen($html), 'status'=>'OK' );
	}
	$out['atnaujinta'] = $updated;

	// Verifikacija
	$out['po'] = array();
	foreach ( $found as $f ) {
		$opt = get_option( $f['option'] );
		if ( isset( $opt[ $f['index'] ] ) ) {
			$blob = wp_json_encode( $opt[ $f['index'] ] );
			$out['po'][] = array( 'option'=>$f['option'], 'turi_duk' => ( stripos( $blob, '/duk/' ) !== false ) );
		}
	}
	if ( function_exists('wp_cache_flush') ) { wp_cache_flush(); }

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
