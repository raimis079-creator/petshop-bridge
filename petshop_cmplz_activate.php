/**
 * TEMP — Complianz aktyvavimas v1 (token)
 *
 * REST /wp/v2/plugins blokuojamas serverio (%2F URL'e -> 404).
 * Sis snippet'as aktyvuoja plugin'a per activate_plugin().
 *
 * Naudojimas: /?cmplz_do=STATUS  arba  /?cmplz_do=ACTIVATE&token=cmplz_6680aa2a42151d54fa8d64ec
 * Po naudojimo — DEAKTYVUOTI si snippet'a.
 */

if ( ! defined( 'ABSPATH' ) ) { return; }

add_action( 'wp_loaded', function () {
	if ( ! isset( $_GET['cmplz_do'] ) ) { return; }

	if ( ! function_exists( 'get_plugins' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}

	$action = sanitize_text_field( wp_unslash( $_GET['cmplz_do'] ) );
	$out    = array( 'action' => $action );

	if ( 'STATUS' === $action ) {
		$all = get_plugins();
		$hits = array();
		foreach ( $all as $file => $data ) {
			if ( stripos( $file, 'complianz' ) !== false ) {
				$hits[] = array(
					'file'    => $file,
					'name'    => $data['Name'],
					'version' => $data['Version'],
					'active'  => is_plugin_active( $file ),
				);
			}
		}
		$out['complianz'] = $hits;
		$out['total_plugins'] = count( $all );
	} elseif ( 'ACTIVATE' === $action ) {
		$token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
		if ( $token !== 'cmplz_6680aa2a42151d54fa8d64ec' ) {
			$out['error'] = 'bad token';
		} else {
			$file = 'complianz-gdpr/complianz-gpdr.php';
			if ( ! file_exists( WP_PLUGIN_DIR . '/' . $file ) ) {
				$out['error'] = 'plugin file not found: ' . $file;
			} else {
				$res = activate_plugin( $file );
				$out['result'] = is_wp_error( $res ) ? $res->get_error_message() : 'activated';
				$out['active'] = is_plugin_active( $file );
			}
		}
	} else {
		$out['error'] = 'unknown action';
	}

	header( 'Content-Type: application/json; charset=utf-8' );
	echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );
	exit;
}, 5 );
