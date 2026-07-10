/**
 * Petshop DataLayer v1.1 (GA4 ecommerce)
 *
 * Siuncia GA4 e-commerce ivykius i dataLayer, kuriuos pagauna GTM-MF3GZGT.
 * Ivykiai: view_item, add_to_cart, view_cart, begin_checkout, purchase
 *
 * Scope: front-end only
 * Priklausomybes: WooCommerce (klasikinis checkout, shortcode)
 * Idempotencija: purchase siunciamas vienakart per uzsakyma (_petshop_dl_purchase_sent + static guard)
 *
 * v1.1 pataisymai:
 *   - add_to_cart: prekes puslapyje mygtukas NETURI ajax_add_to_cart -> forma submit'ina,
 *     JS push'as dingsta su navigacija. Sprendimas: WC session queue + flush kitame page load.
 *     AJAX atveju (loop mygtukai) queue NEpildoma — ten veikia JS listener.
 *   - purchase: pridetas static guard nuo dvigubo hook kvietimo tame paciame request'e.
 */

if ( ! defined( 'ABSPATH' ) ) { return; }
if ( ! function_exists( 'WC' ) ) { return; }

/* ============================================================
 * HELPERS
 * ============================================================ */

if ( ! function_exists( 'petshop_gtm_brand' ) ) {
	/**
	 * Prekes zenklas. Pirma bandom brand taksonomija, tada _legacy_manufacturer.
	 */
	function petshop_gtm_brand( $product_id ) {
		foreach ( array( 'product_brand', 'pa_prekiu_zenklas', 'yith_product_brand' ) as $tax ) {
			if ( taxonomy_exists( $tax ) ) {
				$terms = wp_get_object_terms( $product_id, $tax, array( 'fields' => 'names' ) );
				if ( ! is_wp_error( $terms ) && ! empty( $terms[0] ) ) {
					return $terms[0];
				}
			}
		}
		$manuf = get_post_meta( $product_id, '_legacy_manufacturer', true );
		return $manuf ? $manuf : '';
	}
}

if ( ! function_exists( 'petshop_gtm_category' ) ) {
	/**
	 * Pirmoji prekes kategorija (pavadinimas).
	 */
	function petshop_gtm_category( $product_id ) {
		$terms = wp_get_object_terms( $product_id, 'product_cat', array( 'fields' => 'names' ) );
		if ( ! is_wp_error( $terms ) && ! empty( $terms[0] ) ) {
			return $terms[0];
		}
		return '';
	}
}

if ( ! function_exists( 'petshop_gtm_item' ) ) {
	/**
	 * WC_Product -> GA4 item objektas.
	 * Kaina — su PVM (B2C), kad atitiktu uzsakymo suma.
	 */
	function petshop_gtm_item( $product, $qty = 1, $index = 0 ) {
		if ( ! $product instanceof WC_Product ) { return null; }

		$pid   = $product->get_id();
		$price = (float) wc_get_price_including_tax( $product );

		$item = array(
			'item_id'   => $product->get_sku() ? $product->get_sku() : (string) $pid,
			'item_name' => wp_strip_all_tags( $product->get_name() ),
			'price'     => round( $price, 2 ),
			'quantity'  => (int) $qty,
			'index'     => (int) $index,
		);

		$brand = petshop_gtm_brand( $pid );
		if ( $brand ) { $item['item_brand'] = $brand; }

		$cat = petshop_gtm_category( $pid );
		if ( $cat ) { $item['item_category'] = $cat; }

		return $item;
	}
}

if ( ! function_exists( 'petshop_gtm_push' ) ) {
	/**
	 * Isveda dataLayer.push. Pries kiekviena ecommerce ivyki isvalo ecommerce objekta
	 * (Google rekomendacija, kad nepersidengtu duomenys).
	 */
	function petshop_gtm_push( $payload ) {
		if ( empty( $payload ) ) { return; }
		$json = wp_json_encode( $payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
		if ( false === $json ) { return; }
		echo "\n<script data-petshop-gtm=\"1\">\n";
		echo "window.dataLayer = window.dataLayer || [];\n";
		echo "window.dataLayer.push({ ecommerce: null });\n";
		echo "window.dataLayer.push(" . $json . ");\n";
		echo "</script>\n";
	}
}

if ( ! function_exists( 'petshop_gtm_currency' ) ) {
	function petshop_gtm_currency() {
		return get_woocommerce_currency();
	}
}

/* ============================================================
 * 1. view_item — prekes puslapis
 * ============================================================ */

if ( ! function_exists( 'petshop_gtm_view_item' ) ) {
	function petshop_gtm_view_item() {
		if ( ! function_exists( 'is_product' ) || ! is_product() ) { return; }

		global $product;
		if ( ! $product instanceof WC_Product ) {
			$product = wc_get_product( get_the_ID() );
		}
		$item = petshop_gtm_item( $product, 1, 0 );
		if ( ! $item ) { return; }

		petshop_gtm_push( array(
			'event'     => 'view_item',
			'ecommerce' => array(
				'currency' => petshop_gtm_currency(),
				'value'    => $item['price'],
				'items'    => array( $item ),
			),
		) );
	}
}
add_action( 'wp_footer', 'petshop_gtm_view_item', 20 );

/* ============================================================
 * 2. add_to_cart — duomenys i mygtukus (loop + single)
 * ============================================================ */

if ( ! function_exists( 'petshop_gtm_loop_atc_args' ) ) {
	/**
	 * Prisega data-gtm-item prie kategoriju/loop mygtuku.
	 */
	function petshop_gtm_loop_atc_args( $args, $product ) {
		$item = petshop_gtm_item( $product, 1, 0 );
		if ( $item ) {
			$args['attributes']['data-gtm-item'] = wp_json_encode( $item, JSON_UNESCAPED_UNICODE );
		}
		return $args;
	}
}
add_filter( 'woocommerce_loop_add_to_cart_args', 'petshop_gtm_loop_atc_args', 10, 2 );

if ( ! function_exists( 'petshop_gtm_single_item_data' ) ) {
	/**
	 * Prekes puslapyje isveda window.petshopGtmItem — JS pasiima ji AJAX add-to-cart metu.
	 */
	function petshop_gtm_single_item_data() {
		if ( ! function_exists( 'is_product' ) || ! is_product() ) { return; }

		global $product;
		if ( ! $product instanceof WC_Product ) {
			$product = wc_get_product( get_the_ID() );
		}
		$item = petshop_gtm_item( $product, 1, 0 );
		if ( ! $item ) { return; }

		echo "\n<script data-petshop-gtm=\"1\">\n";
		echo "window.petshopGtmItem = " . wp_json_encode( $item, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . ";\n";
		echo "</script>\n";
	}
}
add_action( 'wp_footer', 'petshop_gtm_single_item_data', 19 );

/* ============================================================
 * 2b. add_to_cart — WC session queue (NE-AJAX atvejis)
 *
 * Prekes puslapyje mygtukas neturi ajax_add_to_cart klases:
 *   <button type="submit" class="single_add_to_cart_button button alt">
 * Forma submit'ina, puslapis persikrauna, JS push'as dingsta.
 * Todel PHP puseje irasom i sesija, o flush'inam kitame page load.
 *
 * AJAX atveju (kategoriju loop mygtukai) queue NEpildoma —
 * ten suveikia JS `added_to_cart` listener'is (zr. 3 sekcija).
 * ============================================================ */

if ( ! function_exists( 'petshop_gtm_queue_atc' ) ) {
	function petshop_gtm_queue_atc( $cart_item_key, $product_id, $quantity, $variation_id, $variation, $cart_item_data ) {
		if ( wp_doing_ajax() ) { return; }
		if ( ! function_exists( 'WC' ) || ! WC()->session ) { return; }

		$pid     = $variation_id ? $variation_id : $product_id;
		$product = wc_get_product( $pid );
		$item    = petshop_gtm_item( $product, $quantity, 0 );
		if ( ! $item ) { return; }

		$queue   = WC()->session->get( 'petshop_gtm_atc_queue', array() );
		if ( ! is_array( $queue ) ) { $queue = array(); }
		$queue[] = $item;
		WC()->session->set( 'petshop_gtm_atc_queue', $queue );
	}
}
add_action( 'woocommerce_add_to_cart', 'petshop_gtm_queue_atc', 10, 6 );

if ( ! function_exists( 'petshop_gtm_flush_atc' ) ) {
	function petshop_gtm_flush_atc() {
		if ( is_admin() ) { return; }
		if ( ! function_exists( 'WC' ) || ! WC()->session ) { return; }

		$queue = WC()->session->get( 'petshop_gtm_atc_queue', array() );
		if ( empty( $queue ) || ! is_array( $queue ) ) { return; }

		WC()->session->set( 'petshop_gtm_atc_queue', array() );

		foreach ( $queue as $item ) {
			if ( empty( $item['price'] ) && 0 !== $item['price'] ) { continue; }
			$value = round( (float) $item['price'] * (int) $item['quantity'], 2 );
			petshop_gtm_push( array(
				'event'     => 'add_to_cart',
				'ecommerce' => array(
					'currency' => petshop_gtm_currency(),
					'value'    => $value,
					'items'    => array( $item ),
				),
			) );
		}
	}
}
add_action( 'wp_footer', 'petshop_gtm_flush_atc', 18 );

/* ============================================================
 * 3. add_to_cart — JS listener (TIK AJAX mygtukams)
 * ============================================================ */

if ( ! function_exists( 'petshop_gtm_atc_listener' ) ) {
	function petshop_gtm_atc_listener() {
		if ( is_admin() ) { return; }

		$currency = esc_js( petshop_gtm_currency() );

		$js = <<<'PETSHOPJS'
<script data-petshop-gtm="1">
(function () {
	window.dataLayer = window.dataLayer || [];
	var PETSHOP_CURRENCY = '__CURRENCY__';

	function petshopPushAtc(item, qty) {
		if (!item) { return; }
		var q = parseInt(qty, 10);
		if (!q || q < 1) { q = 1; }
		var it = JSON.parse(JSON.stringify(item));
		it.quantity = q;
		var value = Math.round((parseFloat(it.price) || 0) * q * 100) / 100;

		window.dataLayer.push({ ecommerce: null });
		window.dataLayer.push({
			event: 'add_to_cart',
			ecommerce: {
				currency: PETSHOP_CURRENCY,
				value: value,
				items: [it]
			}
		});
	}

	function petshopReadItem(el) {
		if (!el || !el.getAttribute) { return null; }
		var raw = el.getAttribute('data-gtm-item');
		if (!raw) { return null; }
		try { return JSON.parse(raw); } catch (e) { return null; }
	}

	/* AJAX add-to-cart (WooCommerce jQuery event) */
	if (window.jQuery) {
		jQuery(document.body).on('added_to_cart', function (event, fragments, cart_hash, button) {
			var btn = (button && button.length) ? button[0] : null;
			var item = petshopReadItem(btn);
			var qty = 1;

			if (btn) {
				var q = btn.getAttribute('data-quantity');
				if (q) { qty = q; }
			}

			if (!item && window.petshopGtmItem) {
				item = window.petshopGtmItem;
				var qtyInput = document.querySelector('form.cart input.qty, form.cart input[name="quantity"]');
				if (qtyInput && qtyInput.value) { qty = qtyInput.value; }
			}
			petshopPushAtc(item, qty);
		});
	}

	/* Ne-AJAX forma prekes puslapyje (fallback) */
	document.addEventListener('submit', function (e) {
		var form = e.target;
		if (!form || !form.classList || !form.classList.contains('cart')) { return; }
		if (!window.petshopGtmItem) { return; }

		var btn = form.querySelector('.single_add_to_cart_button');
		if (btn && btn.classList.contains('ajax_add_to_cart')) { return; }

		var qtyInput = form.querySelector('input.qty, input[name="quantity"]');
		var qty = (qtyInput && qtyInput.value) ? qtyInput.value : 1;
		petshopPushAtc(window.petshopGtmItem, qty);
	}, true);
})();
</script>
PETSHOPJS;

		echo "\n" . str_replace( '__CURRENCY__', $currency, $js ) . "\n";
	}
}
add_action( 'wp_footer', 'petshop_gtm_atc_listener', 21 );

/* ============================================================
 * 4. view_cart — krepselio puslapis
 * ============================================================ */

if ( ! function_exists( 'petshop_gtm_view_cart' ) ) {
	function petshop_gtm_view_cart() {
		if ( ! WC()->cart || WC()->cart->is_empty() ) { return; }

		$items = array();
		$i     = 0;
		foreach ( WC()->cart->get_cart() as $cart_item ) {
			$product = isset( $cart_item['data'] ) ? $cart_item['data'] : null;
			$qty     = isset( $cart_item['quantity'] ) ? $cart_item['quantity'] : 1;
			$item    = petshop_gtm_item( $product, $qty, $i );
			if ( $item ) { $items[] = $item; $i++; }
		}
		if ( empty( $items ) ) { return; }

		$total = (float) WC()->cart->get_cart_contents_total() + (float) WC()->cart->get_cart_contents_tax();

		petshop_gtm_push( array(
			'event'     => 'view_cart',
			'ecommerce' => array(
				'currency' => petshop_gtm_currency(),
				'value'    => round( $total, 2 ),
				'items'    => $items,
			),
		) );
	}
}
add_action( 'woocommerce_before_cart', 'petshop_gtm_view_cart', 10 );

/* ============================================================
 * 5. begin_checkout — apmokejimo puslapis
 * ============================================================ */

if ( ! function_exists( 'petshop_gtm_begin_checkout' ) ) {
	function petshop_gtm_begin_checkout() {
		if ( ! WC()->cart || WC()->cart->is_empty() ) { return; }

		$items = array();
		$i     = 0;
		foreach ( WC()->cart->get_cart() as $cart_item ) {
			$product = isset( $cart_item['data'] ) ? $cart_item['data'] : null;
			$qty     = isset( $cart_item['quantity'] ) ? $cart_item['quantity'] : 1;
			$item    = petshop_gtm_item( $product, $qty, $i );
			if ( $item ) { $items[] = $item; $i++; }
		}
		if ( empty( $items ) ) { return; }

		$total = (float) WC()->cart->get_cart_contents_total() + (float) WC()->cart->get_cart_contents_tax();

		$payload = array(
			'event'     => 'begin_checkout',
			'ecommerce' => array(
				'currency' => petshop_gtm_currency(),
				'value'    => round( $total, 2 ),
				'items'    => $items,
			),
		);

		$coupons = WC()->cart->get_applied_coupons();
		if ( ! empty( $coupons ) ) {
			$payload['ecommerce']['coupon'] = implode( ',', $coupons );
		}

		petshop_gtm_push( $payload );
	}
}
add_action( 'woocommerce_before_checkout_form', 'petshop_gtm_begin_checkout', 10 );

/* ============================================================
 * 6. purchase — thankyou puslapis (idempotentiskai)
 * ============================================================ */

if ( ! function_exists( 'petshop_gtm_purchase' ) ) {
	function petshop_gtm_purchase( $order_id ) {
		if ( ! $order_id ) { return; }

		/* Guard 1: dvigubas hook kvietimas tame paciame request'e */
		static $already_sent = array();
		if ( isset( $already_sent[ $order_id ] ) ) { return; }

		$order = wc_get_order( $order_id );
		if ( ! $order ) { return; }

		/* Guard 2: HPOS-safe meta zyma (apsaugo nuo puslapio perkrovimo) */
		if ( $order->get_meta( '_petshop_dl_purchase_sent' ) === 'yes' ) { return; }

		$already_sent[ $order_id ] = true;

		$items = array();
		$i     = 0;
		foreach ( $order->get_items() as $line ) {
			$product = $line->get_product();
			if ( ! $product instanceof WC_Product ) { continue; }

			$qty = (int) $line->get_quantity();
			if ( $qty < 1 ) { $qty = 1; }

			$line_total = (float) $line->get_total() + (float) $line->get_total_tax();
			$unit_price = round( $line_total / $qty, 2 );

			$pid  = $product->get_id();
			$item = array(
				'item_id'   => $product->get_sku() ? $product->get_sku() : (string) $pid,
				'item_name' => wp_strip_all_tags( $line->get_name() ),
				'price'     => $unit_price,
				'quantity'  => $qty,
				'index'     => $i,
			);

			$brand = petshop_gtm_brand( $pid );
			if ( $brand ) { $item['item_brand'] = $brand; }

			$cat = petshop_gtm_category( $pid );
			if ( $cat ) { $item['item_category'] = $cat; }

			$items[] = $item;
			$i++;
		}
		if ( empty( $items ) ) { return; }

		$ecommerce = array(
			'transaction_id' => (string) $order->get_order_number(),
			'value'          => round( (float) $order->get_total(), 2 ),
			'currency'       => $order->get_currency(),
			'tax'            => round( (float) $order->get_total_tax(), 2 ),
			'shipping'       => round( (float) $order->get_shipping_total(), 2 ),
			'items'          => $items,
		);

		$coupons = $order->get_coupon_codes();
		if ( ! empty( $coupons ) ) {
			$ecommerce['coupon'] = implode( ',', $coupons );
		}

		$payload = array(
			'event'     => 'purchase',
			'ecommerce' => $ecommerce,
		);

		/* Enhanced conversions: SHA-256 hash'uotas el. pastas.
		 * GTM tag'as siusti gali tik su ad_user_data sutikimu. */
		$email = $order->get_billing_email();
		if ( $email ) {
			$payload['user_data'] = array(
				'sha256_email_address' => hash( 'sha256', strtolower( trim( $email ) ) ),
			);
		}

		petshop_gtm_push( $payload );

		$order->update_meta_data( '_petshop_dl_purchase_sent', 'yes' );
		$order->save();
	}
}
add_action( 'woocommerce_thankyou', 'petshop_gtm_purchase', 10, 1 );
