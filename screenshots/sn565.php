/**
 * Petshop VF Sync v1.1 (dry-run/apply + WP cron)
 *
 * Trys sync keliai esamoms ir naujoms VF prekėms:
 *   A. REPRICE — kainos + akcijos (kartą per parą 03:00)
 *   B. STOCK   — likučiai (kas valandą)
 *   C. PUBLISH — auto-publish naujoms VF prekėms, kurios praėjo VISUS
 *                saugos filtrus (kartą per parą 04:00, po reprice)
 *
 * Visi trys naudoja tą patį VF feed cache'ą, tas pačias plugin'o klases.
 *
 * SAUGA (griežtos ribos, visiems trims):
 *   - Neliečia post_content (aprašymo)
 *   - Neliečia post_title (pavadinimo)
 *   - Neliečia paveikslų, kategorijų, atributų, terminų
 *   - Reprice gerbia: _manual_price_override / _petshop_lock_pricing /
 *     _petshop_sale_batch -> praleidžiama
 *   - Publish reikalauja: paveikslėlis + aprašymas + kaina>0 + likutis>0 +
 *     nėra review flag'ų + nėra SKU/EAN konfliktų
 *
 * Paleidimas rankomis (per bridge token-gate):
 *   ?psc_vf_sync=1&k=ps2026&path=reprice&mode=dryrun
 *   ?psc_vf_sync=1&k=ps2026&path=stock&mode=dryrun
 *   ?psc_vf_sync=1&k=ps2026&path=publish&mode=dryrun
 *   ?psc_vf_sync=1&k=ps2026&path=[reprice|stock|publish]&mode=apply&confirm=YES
 *   Papildomai: &limit=100&offset=0&only_sku=JOS1007,JOS1012
 *
 * Cron valdymas:
 *   ?psc_vf_sync=1&k=ps2026&cron=register / unregister / status
 */

// =============================================================================
// HTTP ENTRY
// =============================================================================
add_action( 'init', function() {

	if ( ( $_GET['psc_vf_sync'] ?? '' ) !== '1' ) return;
	if ( ( $_GET['k'] ?? '' ) !== 'ps2026' && ! current_user_can( 'manage_options' ) ) return;

	// Cron valdymas
	$cron = (string) ( $_GET['cron'] ?? '' );
	if ( $cron !== '' ) {
		wp_send_json( petshop_vf_sync_cron_manage( $cron ) );
	}

	$path = ( $_GET['path'] ?? 'reprice' );
	if ( ! in_array( $path, array( 'reprice', 'stock', 'publish' ), true ) ) $path = 'reprice';
	$mode      = ( $_GET['mode'] ?? 'dryrun' ) === 'apply' ? 'apply' : 'dryrun';
	$confirm   = (string) ( $_GET['confirm'] ?? '' );
	$limit     = max( 1, min( 2000, (int) ( $_GET['limit']  ?? 100 ) ) );
	$offset    = max( 0, (int) ( $_GET['offset'] ?? 0 ) );
	$only_sku  = array_filter( array_map( 'trim', explode( ',', (string) ( $_GET['only_sku'] ?? '' ) ) ) );

	if ( $mode === 'apply' && $confirm !== 'YES' ) {
		wp_send_json( array( 'error' => 'APPLY reikia &confirm=YES' ) );
	}

	if ( $path === 'stock' )   $result = petshop_vf_sync_stock( $mode, $limit, $offset, $only_sku );
	elseif ( $path === 'publish' ) $result = petshop_vf_sync_publish( $mode, $limit, $offset, $only_sku );
	else                       $result = petshop_vf_sync_reprice( $mode, $limit, $offset, $only_sku );

	wp_send_json( $result );
} );

// =============================================================================
// FEED SKAITYMAS (bendras abiem keliams)
// =============================================================================
function petshop_vf_sync_load_feed() {
	$cache = WP_CONTENT_DIR . '/uploads/petshop-vf-cache.xml';
	if ( ! file_exists( $cache ) ) return array( 'error' => 'VF cache nerastas' );

	libxml_use_internal_errors( true );
	$xml = simplexml_load_file( $cache );
	if ( $xml === false ) return array( 'error' => 'VF XML parse klaida' );

	$feed = array();
	foreach ( $xml->children() as $row ) {
		$sku = (string) ( $row->sku_id ?? '' );
		if ( $sku === '' ) continue;
		$feed[ $sku ] = array(
			'base'     => (float) ( $row->base_price ?? 0 ),
			'personal' => (float) ( $row->personal_price ?? 0 ),
			'qty'      => (int)   ( $row->qty ?? 0 ),
		);
	}
	return array(
		'feed'        => $feed,
		'cache_mtime' => date( 'Y-m-d H:i:s', filemtime( $cache ) ),
		'cache_age_h' => round( ( time() - filemtime( $cache ) ) / 3600, 2 ),
	);
}

// =============================================================================
// A. REPRICE (kainos + akcijos)
// =============================================================================
function petshop_vf_sync_reprice( $mode, $limit, $offset, $only_sku ) {

	if ( ! class_exists( 'Petshop_Pricing_VF' ) || ! function_exists( 'petshop_xml_vf_write_price_and_sync' ) ) {
		return array( 'error' => 'petshop-xml plugin klasės nerastos' );
	}

	$loaded = petshop_vf_sync_load_feed();
	if ( isset( $loaded['error'] ) ) return $loaded;
	$feed = $loaded['feed'];

	global $wpdb;

	// 1. Rasti visas VF prekes (per _vf_supplier_sku)
	$where_only = '';
	if ( ! empty( $only_sku ) ) {
		$in = "'" . implode( "','", array_map( 'esc_sql', $only_sku ) ) . "'";
		$where_only = " AND meta_value IN ($in)";
	}
	$pids = $wpdb->get_col( $wpdb->prepare(
		"SELECT DISTINCT post_id FROM {$wpdb->postmeta}
		 WHERE meta_key='_vf_supplier_sku' AND meta_value != '' $where_only
		 ORDER BY post_id ASC LIMIT %d OFFSET %d",
		$limit, $offset
	) );

	$pricing = new Petshop_Pricing_VF();

	$stats = array(
		'path'          => 'reprice',
		'mode'          => $mode,
		'now'           => current_time( 'mysql' ),
		'cache_mtime'   => $loaded['cache_mtime'],
		'cache_age_h'   => $loaded['cache_age_h'],
		'feed_items'    => count( $feed ),
		'products_scanned' => 0,
		'skip_no_feed'  => 0,   // prekės nėra VF feed'e
		'skip_locked'   => 0,   // _manual_price_override / _petshop_lock_pricing
		'skip_promo'    => 0,   // _petshop_sale_batch aktyvus
		'skip_no_change'=> 0,   // XML kainos ir final kainos nesikeičia
		'would_update_xml_only' => 0, // atsinaujins _vf_cost_xml/_vf_personal_xml, bet final kaina liks ta pati
		'would_change_price' => 0,    // pasikeis regular arba sale
		'would_clear_sale'   => 0,    // _sale_price bus išvalytas (akcija baigėsi)
		'would_add_sale'     => 0,    // atsiras _sale_price (nauja akcija)
		'applied'       => 0,
	);
	$examples = array();
	$changes  = array();

	foreach ( $pids as $pid ) {
		$stats['products_scanned']++;

		$sku = (string) get_post_meta( $pid, '_vf_supplier_sku', true );
		if ( $sku === '' || ! isset( $feed[ $sku ] ) ) {
			$stats['skip_no_feed']++;
			continue;
		}

		// Guard 1: rankinė kainos apsauga
		$manual = (string) get_post_meta( $pid, '_manual_price_override', true );
		$lock   = (string) get_post_meta( $pid, '_petshop_lock_pricing', true );
		if ( $manual === 'yes' || $lock === 'yes' ) {
			$stats['skip_locked']++;
			continue;
		}

		// Guard 2: aktyvi vidinė akcija (petshop-promotions batch)
		$promo_batch = (string) get_post_meta( $pid, '_petshop_sale_batch', true );
		if ( $promo_batch !== '' ) {
			$stats['skip_promo']++;
			continue;
		}

		$feed_base = $feed[ $sku ]['base'];
		$feed_pers = $feed[ $sku ]['personal'];

		$old_cost_xml = (float) get_post_meta( $pid, '_vf_cost_xml', true );
		$old_pers_xml = (float) get_post_meta( $pid, '_vf_personal_xml', true );

		// Skaičiuojam naują kainą pagal esamą plugin'o klasę
		$brand = (string) get_post_meta( $pid, '_vf_brand_normalized', true );
		if ( $brand === '' ) $brand = (string) get_post_meta( $pid, '_vf_brand_raw', true );
		$cat_slugs = function_exists( 'petshop_xml_get_cat_slugs' ) ? petshop_xml_get_cat_slugs( $pid ) : array();

		$new = $pricing->calculate_final_price_from_xml( $feed_base, $feed_pers, $brand, $cat_slugs );
		$new_regular = (float) $new['regular'];
		$new_sale    = (float) $new['sale'];

		$old_regular = (float) get_post_meta( $pid, '_regular_price', true );
		$old_sale_raw = get_post_meta( $pid, '_sale_price', true );
		$old_sale    = ( $old_sale_raw === '' || $old_sale_raw === null ) ? 0.0 : (float) $old_sale_raw;

		$xml_changed   = ( abs( $feed_base - $old_cost_xml ) > 0.0001 || abs( $feed_pers - $old_pers_xml ) > 0.0001 );
		$price_changed = ( abs( $new_regular - $old_regular ) > 0.001 || abs( $new_sale - $old_sale ) > 0.001 );

		if ( ! $xml_changed && ! $price_changed ) {
			$stats['skip_no_change']++;
			continue;
		}

		// Statistika
		if ( $price_changed ) {
			$stats['would_change_price']++;
			if ( $old_sale > 0 && $new_sale == 0 ) $stats['would_clear_sale']++;
			if ( $old_sale == 0 && $new_sale > 0 ) $stats['would_add_sale']++;
		} else {
			$stats['would_update_xml_only']++;
		}

		$change = array(
			'pid'         => $pid,
			'sku'         => $sku,
			'title'       => mb_substr( get_the_title( $pid ), 0, 45 ),
			'cost_xml'    => array( 'old' => $old_cost_xml, 'new' => $feed_base ),
			'pers_xml'    => array( 'old' => $old_pers_xml, 'new' => $feed_pers ),
			'regular'     => array( 'old' => $old_regular, 'new' => $new_regular ),
			'sale'        => array( 'old' => $old_sale, 'new' => $new_sale ),
			'change_type' => ( $old_sale > 0 && $new_sale == 0 ) ? 'CLEAR_SALE'
				: ( ( $old_sale == 0 && $new_sale > 0 ) ? 'ADD_SALE'
				: ( $price_changed ? 'CHANGE_PRICE' : 'XML_ONLY' ) ),
		);

		if ( count( $examples ) < 30 ) $examples[] = $change;
		if ( $mode === 'apply' && $price_changed ) $changes[] = $change['pid'];

		if ( $mode === 'apply' ) {
			// Rašom TIK meta laukus (jokio post_content/title/terms)
			$supplier_discount = $pricing->get_supplier_discount( $brand );
			$real_cost     = $pricing->apply_supplier_discount( $feed_base, $brand );
			$real_personal = $pricing->apply_supplier_discount( $feed_pers, $brand );

			update_post_meta( $pid, '_vf_cost_xml',     $feed_base );
			update_post_meta( $pid, '_vf_personal_xml', $feed_pers );
			update_post_meta( $pid, '_vf_cost',         $real_cost );
			update_post_meta( $pid, '_vf_personal_cost', $real_personal );
			update_post_meta( $pid, '_vf_supplier_discount', $supplier_discount );

			if ( $price_changed ) {
				// Naudojam esamą plugin'o helper'į — jis TEISINGAI išvalo _sale_price kai sale=0
				petshop_xml_vf_write_price_and_sync( $pid, $new_regular, $new_sale );
				update_post_meta( $pid, '_vf_price_rule_used', $new['rule'] );
				update_post_meta( $pid, '_vf_reprice_by_snippet_at', current_time( 'mysql' ) );

				if ( ! empty( $new['review_reasons'] ) ) {
					update_post_meta( $pid, '_petshop_needs_price_review', 'yes' );
					update_post_meta( $pid, '_petshop_price_review_reason', implode( ', ', $new['review_reasons'] ) );
				}
				$stats['applied']++;
			}
		}
	}

	return array(
		'stats'    => $stats,
		'examples' => $examples,
		'applied_pids_count' => count( $changes ),
	);
}

// =============================================================================
// B. STOCK (likučiai — kas valandą)
//
// Skirtingai nuo #7 (WPAI), šis kelias:
//   - Nueina PER visas 1121 VF prekes, ne tik pakitusius
//   - Rašo _vf_qty net jei nepakito -> refresh'ina _vf_last_sync
//   - Naudoja Petshop_Fulfillment->update_vf_qty() kaip vieną point of truth
//   - Prekės, iškritusios iš feed'o -> vf_qty=0 (išsprendžia "užšąlusius" 211)
// =============================================================================
function petshop_vf_sync_stock( $mode, $limit, $offset, $only_sku ) {

	if ( ! class_exists( 'Petshop_Fulfillment' ) ) {
		return array( 'error' => 'Petshop_Fulfillment klasė nerasta' );
	}

	$loaded = petshop_vf_sync_load_feed();
	if ( isset( $loaded['error'] ) ) return $loaded;
	$feed = $loaded['feed'];

	global $wpdb;

	$where_only = '';
	if ( ! empty( $only_sku ) ) {
		$in = "'" . implode( "','", array_map( 'esc_sql', $only_sku ) ) . "'";
		$where_only = " AND meta_value IN ($in)";
	}
	$pids = $wpdb->get_col( $wpdb->prepare(
		"SELECT DISTINCT post_id FROM {$wpdb->postmeta}
		 WHERE meta_key='_vf_supplier_sku' AND meta_value != '' $where_only
		 ORDER BY post_id ASC LIMIT %d OFFSET %d",
		$limit, $offset
	) );

	$stats = array(
		'path'             => 'stock',
		'mode'             => $mode,
		'now'              => current_time( 'mysql' ),
		'cache_mtime'      => $loaded['cache_mtime'],
		'cache_age_h'      => $loaded['cache_age_h'],
		'feed_items'       => count( $feed ),
		'products_scanned' => 0,
		'skip_no_feed'     => 0,  // -> zero out'inam qty
		'would_zero_out'   => 0,  // iškritusios iš feed -> qty=0
		'would_change_qty' => 0,  // qty pasikeis
		'would_refresh_only' => 0, // qty tas pats, tik sync stamp'as
		'applied'          => 0,
	);
	$examples = array();
	$fulfillment = new Petshop_Fulfillment();

	foreach ( $pids as $pid ) {
		$stats['products_scanned']++;
		$sku = (string) get_post_meta( $pid, '_vf_supplier_sku', true );
		$old_qty = (int) get_post_meta( $pid, '_vf_qty', true );

		if ( ! isset( $feed[ $sku ] ) ) {
			// Iškritusi iš feed'o -> zero out (kad "užšąlusi" instock nebeklaidintų)
			$stats['skip_no_feed']++;
			$new_qty = 0;
			$reason  = 'DROPPED_FROM_FEED';
		} else {
			$new_qty = (int) $feed[ $sku ]['qty'];
			$reason  = ( $new_qty === $old_qty ) ? 'REFRESH_STAMP_ONLY' : 'CHANGE_QTY';
		}

		if ( $reason === 'DROPPED_FROM_FEED' && $old_qty !== 0 ) $stats['would_zero_out']++;
		if ( $reason === 'CHANGE_QTY' ) $stats['would_change_qty']++;
		if ( $reason === 'REFRESH_STAMP_ONLY' ) $stats['would_refresh_only']++;

		if ( count( $examples ) < 20 && $reason !== 'REFRESH_STAMP_ONLY' ) {
			$examples[] = array(
				'pid'    => $pid,
				'sku'    => $sku,
				'title'  => mb_substr( get_the_title( $pid ), 0, 45 ),
				'old_qty'=> $old_qty,
				'new_qty'=> $new_qty,
				'reason' => $reason,
			);
		}

		if ( $mode === 'apply' ) {
			update_post_meta( $pid, '_vf_qty', $new_qty );
			update_post_meta( $pid, '_vf_last_sync', current_time( 'mysql' ) );
			$fulfillment->update_vf_qty( $pid, $new_qty );
			$stats['applied']++;
		}
	}

	return array( 'stats' => $stats, 'examples' => $examples );
}

// =============================================================================
// C. PUBLISH (auto-publish naujoms VF prekėms, kurios praėjo VISUS filtrus)
//
// Kriterijai (VISI privalo būti tenkinami — AND):
//   1. Status = 'draft'
//   2. Turi _vf_supplier_sku (yra VF prekė)
//   3. Yra dabartiniame VF feed'e (ne dropped)
//   4. VF feed qty > 0 (yra sandėly)
//   5. Turi _regular_price > 0 (kaina apskaičiuota)
//   6. Turi featured image ARBA product gallery > 0
//   7. Turi post_content nekrūvą (>= 30 simbolių po strip_tags)
//   8. NĖRA review flag'ų: _petshop_needs_price_review, _vf_sku_conflict_with,
//      _vf_skip_reason, _vf_duplicate_of, _petshop_review_reason
//   9. Priskirta bent vienai product_cat (kategorijai)
//
// Bet kurio kriterijaus nesatisfaktavimas -> praleidžia (lieka draft, review).
// =============================================================================
function petshop_vf_sync_publish( $mode, $limit, $offset, $only_sku ) {

	$loaded = petshop_vf_sync_load_feed();
	if ( isset( $loaded['error'] ) ) return $loaded;
	$feed = $loaded['feed'];

	global $wpdb;

	// Randam draft VF prekes
	$where_only = '';
	if ( ! empty( $only_sku ) ) {
		$in = "'" . implode( "','", array_map( 'esc_sql', $only_sku ) ) . "'";
		$where_only = " AND pm.meta_value IN ($in)";
	}
	$pids = $wpdb->get_col( $wpdb->prepare(
		"SELECT DISTINCT p.ID
		 FROM {$wpdb->posts} p
		 INNER JOIN {$wpdb->postmeta} pm ON pm.post_id=p.ID
		 WHERE p.post_type='product' AND p.post_status='draft'
		 AND pm.meta_key='_vf_supplier_sku' AND pm.meta_value != '' $where_only
		 ORDER BY p.ID ASC LIMIT %d OFFSET %d",
		$limit, $offset
	) );

	$stats = array(
		'path'             => 'publish',
		'mode'             => $mode,
		'now'              => current_time( 'mysql' ),
		'cache_mtime'      => $loaded['cache_mtime'],
		'cache_age_h'      => $loaded['cache_age_h'],
		'feed_items'       => count( $feed ),
		'draft_scanned'    => 0,
		'fail_not_in_feed' => 0,
		'fail_qty_zero'    => 0,
		'fail_no_price'    => 0,
		'fail_no_image'    => 0,
		'fail_no_content'  => 0,
		'fail_review_flag' => 0,
		'fail_no_category' => 0,
		'would_publish'    => 0,
		'applied'          => 0,
	);
	$examples = array();
	$publishable = array();

	foreach ( $pids as $pid ) {
		$stats['draft_scanned']++;
		$sku = (string) get_post_meta( $pid, '_vf_supplier_sku', true );

		// 3-4. Feed check
		if ( ! isset( $feed[ $sku ] ) ) {
			$stats['fail_not_in_feed']++;
			continue;
		}
		if ( (int) $feed[ $sku ]['qty'] <= 0 ) {
			$stats['fail_qty_zero']++;
			continue;
		}

		// 5. Kaina
		$regular = (float) get_post_meta( $pid, '_regular_price', true );
		if ( $regular <= 0 ) {
			$stats['fail_no_price']++;
			continue;
		}

		// 6. Paveikslėlis
		$thumb    = (int) get_post_thumbnail_id( $pid );
		$gallery  = (string) get_post_meta( $pid, '_product_image_gallery', true );
		$has_img  = ( $thumb > 0 ) || ( trim( $gallery ) !== '' );
		if ( ! $has_img ) {
			$stats['fail_no_image']++;
			continue;
		}

		// 7. Aprašymas
		$post = get_post( $pid );
		$content_stripped = trim( wp_strip_all_tags( (string) $post->post_content ) );
		if ( mb_strlen( $content_stripped ) < 30 ) {
			$stats['fail_no_content']++;
			continue;
		}

		// 8. Review flag'ai
		$needs_review = (string) get_post_meta( $pid, '_petshop_needs_price_review', true );
		$sku_conflict = get_post_meta( $pid, '_vf_sku_conflict_with', true );
		$skip_reason  = (string) get_post_meta( $pid, '_vf_skip_reason', true );
		$dup_of       = get_post_meta( $pid, '_vf_duplicate_of', true );
		$review_reason= (string) get_post_meta( $pid, '_petshop_review_reason', true );
		if ( $needs_review === 'yes' || ! empty( $sku_conflict ) || $skip_reason !== ''
		     || ! empty( $dup_of ) || $review_reason !== '' ) {
			$stats['fail_review_flag']++;
			continue;
		}

		// 9. Kategorija
		$cats = wp_get_object_terms( $pid, 'product_cat', array( 'fields' => 'ids' ) );
		if ( is_wp_error( $cats ) || empty( $cats ) ) {
			$stats['fail_no_category']++;
			continue;
		}

		// VISI kriterijai praėjo
		$stats['would_publish']++;
		$publishable[] = $pid;

		if ( count( $examples ) < 20 ) {
			$examples[] = array(
				'pid'     => $pid,
				'sku'     => $sku,
				'title'   => mb_substr( get_the_title( $pid ), 0, 45 ),
				'regular' => $regular,
				'qty'     => (int) $feed[ $sku ]['qty'],
			);
		}
	}

	if ( $mode === 'apply' ) {
		foreach ( $publishable as $pid ) {
			// Naudojam wp_update_post, bet TIK su post_status — nieko kito neliečia
			$r = wp_update_post( array( 'ID' => $pid, 'post_status' => 'publish' ), true );
			if ( ! is_wp_error( $r ) ) {
				update_post_meta( $pid, '_vf_auto_published_at', current_time( 'mysql' ) );
				$stats['applied']++;
			}
		}
	}

	return array( 'stats' => $stats, 'examples' => $examples );
}

// =============================================================================
function petshop_vf_sync_cron_manage( $action ) {
	$hook_reprice = 'petshop_vf_sync_reprice_daily';
	$hook_stock   = 'petshop_vf_sync_stock_hourly';
	$hook_publish = 'petshop_vf_sync_publish_daily';

	if ( $action === 'status' ) {
		return array(
			'reprice_next' => wp_next_scheduled( $hook_reprice ) ? date( 'Y-m-d H:i:s', wp_next_scheduled( $hook_reprice ) ) : null,
			'stock_next'   => wp_next_scheduled( $hook_stock   ) ? date( 'Y-m-d H:i:s', wp_next_scheduled( $hook_stock ) )   : null,
			'publish_next' => wp_next_scheduled( $hook_publish ) ? date( 'Y-m-d H:i:s', wp_next_scheduled( $hook_publish ) ) : null,
			'last_reprice' => get_option( 'petshop_vf_reprice_last_run' ),
			'last_stock'   => get_option( 'petshop_vf_stock_last_run' ),
			'last_publish' => get_option( 'petshop_vf_publish_last_run' ),
		);
	}

	if ( $action === 'unregister' ) {
		wp_clear_scheduled_hook( $hook_reprice );
		wp_clear_scheduled_hook( $hook_stock );
		wp_clear_scheduled_hook( $hook_publish );
		return array( 'unregistered' => true );
	}

	if ( $action === 'register' ) {
		if ( ! wp_next_scheduled( $hook_reprice ) ) {
			$ts = strtotime( 'tomorrow 03:00', current_time( 'timestamp' ) );
			wp_schedule_event( $ts, 'daily', $hook_reprice );
		}
		if ( ! wp_next_scheduled( $hook_stock ) ) {
			wp_schedule_event( time() + 300, 'hourly', $hook_stock );
		}
		if ( ! wp_next_scheduled( $hook_publish ) ) {
			$ts = strtotime( 'tomorrow 04:00', current_time( 'timestamp' ) );
			wp_schedule_event( $ts, 'daily', $hook_publish );
		}
		return array(
			'reprice_next' => date( 'Y-m-d H:i:s', wp_next_scheduled( $hook_reprice ) ),
			'stock_next'   => date( 'Y-m-d H:i:s', wp_next_scheduled( $hook_stock ) ),
			'publish_next' => date( 'Y-m-d H:i:s', wp_next_scheduled( $hook_publish ) ),
		);
	}

	return array( 'error' => 'unknown action' );
}

// Cron callback'ai (visada pridedami — kad WP žinotų, kaip vykdyti, jei suplanuota)
add_action( 'petshop_vf_sync_reprice_daily', function() {
	// Batch'ais po 200 (kad neuztrucktu)
	$offset = 0; $total_applied = 0; $safe = 20;
	while ( $safe-- > 0 ) {
		$r = petshop_vf_sync_reprice( 'apply', 200, $offset, array() );
		if ( isset( $r['error'] ) ) { error_log( '[VF Reprice Cron] ' . $r['error'] ); break; }
		$scanned = (int) ( $r['stats']['products_scanned'] ?? 0 );
		$total_applied += (int) ( $r['stats']['applied'] ?? 0 );
		if ( $scanned < 200 ) break;
		$offset += 200;
	}
	update_option( 'petshop_vf_reprice_last_run', array(
		'when' => current_time( 'mysql' ), 'applied' => $total_applied,
	) );
} );

add_action( 'petshop_vf_sync_stock_hourly', function() {
	$offset = 0; $total_applied = 0; $safe = 20;
	while ( $safe-- > 0 ) {
		$r = petshop_vf_sync_stock( 'apply', 200, $offset, array() );
		if ( isset( $r['error'] ) ) { error_log( '[VF Stock Cron] ' . $r['error'] ); break; }
		$scanned = (int) ( $r['stats']['products_scanned'] ?? 0 );
		$total_applied += (int) ( $r['stats']['applied'] ?? 0 );
		if ( $scanned < 200 ) break;
		$offset += 200;
	}
	update_option( 'petshop_vf_stock_last_run', array(
		'when' => current_time( 'mysql' ), 'applied' => $total_applied,
	) );
} );

add_action( 'petshop_vf_sync_publish_daily', function() {
	$offset = 0; $total_applied = 0; $safe = 20;
	while ( $safe-- > 0 ) {
		$r = petshop_vf_sync_publish( 'apply', 200, $offset, array() );
		if ( isset( $r['error'] ) ) { error_log( '[VF Publish Cron] ' . $r['error'] ); break; }
		$scanned = (int) ( $r['stats']['draft_scanned'] ?? 0 );
		$total_applied += (int) ( $r['stats']['applied'] ?? 0 );
		if ( $scanned < 200 ) break;
		$offset += 200;
	}
	update_option( 'petshop_vf_publish_last_run', array(
		'when' => current_time( 'mysql' ), 'applied' => $total_applied,
	) );
} );
