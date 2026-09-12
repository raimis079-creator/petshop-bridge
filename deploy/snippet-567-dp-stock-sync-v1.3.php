/**
 * Petshop Daugiau=Pigiau Stock Sync v1.3
 * v1.3 (S1676): eilutes, kurių šaltinis AV (`_ps_source=av`), tvarko AV variklis (petshop-av-reduce v1.2)
 *   per bazinę prekę — čia PRALEIDŽIAMOS (be dvigubo nurašymo / atstatymo).
 * Custom mechanizmas: "pack" produktai (fiksuoto kiekio kartotiniai) neturi savo
 * tikro sandelio skaiciaus - jis skaiciuojamas dinamiskai is bazinio produkto,
 * o realus nurasymas/atstatymas vyksta TIK ant bazinio produkto.
 *
 * Meta laukai ant pack produkto:
 *   _dp_base_product_id = bazinio produkto ID
 *   _dp_pack_qty        = kiek bazinio produkto vienetu sudaro 1 pack'a
 *
 * Pack produktas turi buti sukurtas su manage_stock=false.
 */

// 1. Dinamiskas "yra/nera sandelyje" statusas pack produktui
add_filter('woocommerce_product_is_in_stock', function($in_stock, $product){
  $base_id = $product->get_meta('_dp_base_product_id');
  if (!$base_id) return $in_stock;
  $pack_qty = (int) $product->get_meta('_dp_pack_qty');
  if ($pack_qty <= 0) return $in_stock;
  $base = wc_get_product($base_id);
  if (!$base) return false;
  $base_stock = (int) $base->get_stock_quantity();
  return $base_stock >= $pack_qty;
}, 10, 2);

// 2. Papildoma info - kiek "dėžučių" galima sudaryti (rodymui, ne privaloma)
add_filter('woocommerce_get_stock_html', function($html, $product){
  $base_id = $product->get_meta('_dp_base_product_id');
  if (!$base_id) return $html;
  $pack_qty = (int) $product->get_meta('_dp_pack_qty');
  if ($pack_qty <= 0) return $html;
  $base = wc_get_product($base_id);
  if (!$base) return $html;
  $base_stock = (int) $base->get_stock_quantity();
  if ($base_stock >= $pack_qty) {
    return '<p class="stock in-stock">Yra sandėlyje</p>';
  }
  return '<p class="stock out-of-stock">Šiuo metu nėra sandėlyje</p>';
}, 10, 2);

// 3. Add-to-cart apsauga - papildomas patikrinimas pries idedant i krepseli
add_filter('woocommerce_add_to_cart_validation', function($passed, $product_id, $quantity){
  $product = wc_get_product($product_id);
  if (!$product) return $passed;
  $base_id = $product->get_meta('_dp_base_product_id');
  if (!$base_id) return $passed;
  $pack_qty = (int) $product->get_meta('_dp_pack_qty');
  if ($pack_qty <= 0) return $passed;
  $base = wc_get_product($base_id);
  if (!$base) { wc_add_notice('Prekė šiuo metu nepasiekiama.', 'error'); return false; }
  $base_stock = (int) $base->get_stock_quantity();
  $needed = $pack_qty * $quantity;
  if ($base_stock < $needed) {
    wc_add_notice('Atsiprašome, šiuo metu sandėlyje nepakanka prekių šiam pasiūlymui.', 'error');
    return false;
  }
  return $passed;
}, 10, 3);

// 4. NURASYMAS - kai uzsakymas apmokamas/vykdomas, nurasom is BAZINIO produkto
add_action('woocommerce_reduce_order_stock', function($order){
  // Idempotencija: kiekvienam order item nurasom TIK VIENA KARTA
  if ($order->get_meta('_dp_stock_reduced') === 'yes') return;
  $order->update_meta_data('_dp_stock_reduced', 'yes');
  $order->save();
  foreach ($order->get_items() as $item) {
    $product = $item->get_product();
    if (!$product) continue;
    $base_id = $product->get_meta('_dp_base_product_id');
    if (!$base_id) continue;
    $pack_qty = (int) $product->get_meta('_dp_pack_qty');
    if ($pack_qty <= 0) continue;
    $base = wc_get_product($base_id);
    if (!$base) continue;
    if ($item->get_meta('_ps_source') === 'av') continue; // v1.3: AV variklis
    $reduce_by = $pack_qty * $item->get_quantity();
    wc_update_product_stock($base, $reduce_by, 'decrease');
    // Log audit trail
    $order->add_order_note(sprintf(
      'Daugiau=pigiau: pack "%s" (x%d) nurašė %d vnt. iš bazinio produkto #%d (%s).',
      $product->get_name(), $item->get_quantity(), $reduce_by, $base_id, $base->get_name()
    ));
  }
}, 10, 1);

// 5. ATSTATYMAS - kai uzsakymas atsaukiamas/grazinamas, atstatom i BAZINI produkta
add_action('woocommerce_restore_order_stock', function($order){
  // Atstatom TIK jei buvo nurasyta ir dar neatstatyta
  if ($order->get_meta('_dp_stock_reduced') !== 'yes') return;
  $order->update_meta_data('_dp_stock_reduced', 'no');
  $order->save();
  foreach ($order->get_items() as $item) {
    $product = $item->get_product();
    if (!$product) continue;
    $base_id = $product->get_meta('_dp_base_product_id');
    if (!$base_id) continue;
    $pack_qty = (int) $product->get_meta('_dp_pack_qty');
    if ($pack_qty <= 0) continue;
    $base = wc_get_product($base_id);
    if (!$base) continue;
    if ($item->get_meta('_ps_source') === 'av') continue; // v1.3: AV variklis
    $restore_by = $pack_qty * $item->get_quantity();
    wc_update_product_stock($base, $restore_by, 'increase');
    $order->add_order_note(sprintf(
      'Daugiau=pigiau: pack "%s" (x%d) atstatė %d vnt. į bazinį produktą #%d (%s).',
      $product->get_name(), $item->get_quantity(), $restore_by, $base_id, $base->get_name()
    ));
  }
}, 10, 1);