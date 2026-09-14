<?php
/** TEMP PS S1680 h — read-only: LP paštomato lauko HTML checkout'e (simuliacija su LP pasirinktu), plugino kabliai/JS. */
add_action('wp_loaded', function(){
  if (!isset($_GET['ps_s1680h'])) return; global $wpdb,$wp_filter; $p=$wpdb->prefix; $o=array('v'=>'S1680 h');
  $d=WP_PLUGIN_DIR.'/woo-lithuaniapost-main/'; $c=file_get_contents($d.'includes/class-woo-lithuaniapost.php');
  preg_match_all("/add_(?:action|filter)\s*\(\s*['\"]([^'\"]+)['\"]\s*,\s*\\\$plugin_public\s*,\s*['\"]([^'\"]+)['\"]/",$c,$m); $o['public_hooks']=array_map(function($a,$b){return "$a→$b";},$m[1],$m[2]);
  $c2=file_get_contents($d.'public/class-woo-lithuaniapost-public.php'); preg_match_all('/wp_enqueue_script\s*\([^;]*;|wp_register_script\s*\([^;]*;/',$c2,$m2); $o['scripts']=array_map(function($s){return preg_replace('/\s+/',' ',substr($s,0,220));},$m2[0]);
  preg_match_all('/wp_localize_script\s*\([^;]*;|wp_add_inline_script[^;]*;/s',$c2,$m3); $o['localize']=array_map(function($s){return preg_replace('/\s+/',' ',substr($s,0,300));},$m3[0]);
  preg_match('/function render_terminal_field[^{]*\{(.*?)\n\s*\}\n/s',$c2,$m4); $o['render_terminal_field']=preg_replace('/\s+/',' ',substr($m4[1]??'',0,1500));
  preg_match('/function handle_generate_terminal_dropdown_html[^{]*\{(.*?)\n\s*\}\n/s',$c2,$m5); $o['dropdown_fn']=preg_replace('/\s+/',' ',substr($m5[1]??'',0,1200));
  foreach(glob($d.'public/js/*.js') as $j) $o['js'][]=basename($j).' '.filesize($j);
  $pid=16298; wc_load_cart(); WC()->session->set_customer_session_cookie(true); WC()->cart->empty_cart(); WC()->cart->add_to_cart($pid,1);
  WC()->customer->set_shipping_country('LT'); WC()->customer->set_billing_country('LT'); WC()->session->set('chosen_shipping_methods',array('woo_lithuaniapost_lpexpress_terminal:12'));
  $pk=WC()->shipping()->calculate_shipping(WC()->cart->get_shipping_packages()); WC()->session->set('shipping_for_package_0',array('package_hash'=>'x','rates'=>$pk[0]['rates']));
  $rate=$pk[0]['rates']['woo_lithuaniapost_lpexpress_terminal:12']??null; $o['rate']=$rate?$rate->get_label():null;
  foreach(array('woocommerce_after_shipping_rate','woocommerce_review_order_after_shipping','woocommerce_checkout_after_order_review','woocommerce_review_order_before_payment') as $h){ ob_start(); if($h==='woocommerce_after_shipping_rate'&&$rate) do_action($h,$rate,0); elseif($h!=='woocommerce_after_shipping_rate') do_action($h); $html=ob_get_clean(); $o['html'][$h]=array(strlen($html),substr(preg_replace('/\s+/',' ',strip_tags($html,'<select><option><input><div>')),0,400),substr_count($html,'<option')); }
  WC()->cart->empty_cart();
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
