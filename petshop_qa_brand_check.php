/**
 * Petshop QA 6-oji Salyga - Brand Slug Melagingu Praejimu Skeneris v1 (token, read-only)
 * RUN: /?ps_qa_brand_check=1&token=cmplz_6680aa2a42151d54fa8d64ec
 * (opcinis) &brand=<slug>  - vieno brendo patikra
 *
 * 6-oji QA salyga: bare brand slug (/{slug}) NIEKADA neturi grazinti 301 su
 * x-redirect-by:WordPress i /product/... - tai WP redirect_canonical spejimas,
 * kuris apeina 5 esamus QA laikus (200 finish + 1 hop + ne home + ne noindex + canonical).
 *
 * Smoke test rezimas: paleidziamas po launch redirect'u aktyvavimo. Turi grazinti 0 fail.
 * Verified 2026-07-11: pries fix'a 144 fail / 72 brendai (59% brandu, 2131 prekes).
 */
if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['ps_qa_brand_check'] ) ) { return; }
	$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
	if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }

	$only = isset( $_GET['brand'] ) ? sanitize_title( wp_unslash( $_GET['brand'] ) ) : '';

	// Renkam visus brand terminus is DB (ne CSV - dinamiskai)
	$terms = get_terms( array(
		'taxonomy'   => 'product_brand',
		'hide_empty' => false,
	) );
	if ( is_wp_error( $terms ) || empty( $terms ) ) {
		wp_send_json( array( 'error' => 'product_brand taksonomija tuscia arba klaida' ) );
	}

	$base = home_url();
	$pool = array();
	foreach ( $terms as $t ) {
		if ( $only && $t->slug !== $only ) { continue; }
		if ( (int) $t->count === 0 ) { continue; } // tuscius brendus praleidziam - jie neturi expected taikinio
		$pool[] = array( 'slug' => $t->slug, 'name' => $t->name, 'count' => (int) $t->count );
	}

	$fail = array();
	$pass = 0;
	$checked = 0;

	foreach ( $pool as $b ) {
		foreach ( array( '/' . $b['slug'], '/' . $b['slug'] . '/' ) as $path ) {
			$checked++;
			$url = $base . $path;
			$args = array(
				'redirection' => 0,
				'timeout'     => 5,
				'sslverify'   => false,
				'user-agent'  => 'PetshopQA/1.0',
			);
			$resp = wp_remote_head( $url, $args );
			if ( is_wp_error( $resp ) ) {
				$fail[] = array( 'brand' => $b['slug'], 'url' => $path, 'reason' => 'wp_error:' . $resp->get_error_message() );
				continue;
			}
			$code = wp_remote_retrieve_response_code( $resp );
			$xrb  = wp_remote_retrieve_header( $resp, 'x-redirect-by' );
			$loc  = wp_remote_retrieve_header( $resp, 'location' );

			// 6-oji QA salyga: 301 + x-redirect-by:WordPress = automatinis FAIL
			if ( $code >= 300 && $code < 400 && strcasecmp( (string) $xrb, 'WordPress' ) === 0 ) {
				$fail[] = array(
					'brand'     => $b['slug'],
					'name'      => $b['name'],
					'count'     => $b['count'],
					'url'       => $path,
					'code'      => $code,
					'xrb'       => (string) $xrb,
					'redirects_to' => (string) $loc,
					'expected'  => '/gamintojas/' . $b['slug'] . '/',
					'reason'    => 'x-redirect-by:WordPress spejimas apeidzia mapping',
				);
			} else {
				$pass++;
			}
		}
	}

	$out = array(
		'6_qa_salyga' => '301 su x-redirect-by:WordPress bare brand slug\'ui = FAIL',
		'tikrinta'    => $checked,
		'brendu'      => count( $pool ),
		'pass'        => $pass,
		'fail'        => count( $fail ),
		'verdiktas'   => count( $fail ) === 0 ? '✅ SMOKE TEST OK' : '❌ ' . count( $fail ) . ' MELAGINGU PRAEJIMU',
		'fail_details'=> array_slice( $fail, 0, 30 ),
		'fail_total_prekes' => array_sum( array_column( array_slice( $fail, 0, PHP_INT_MAX ), 'count' ) ),
	);

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	exit;
}, 6 );
