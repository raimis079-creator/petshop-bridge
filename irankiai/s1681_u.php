<?php
/** TEMP PS S1681 u — PVM 21 % tarifai LV ir EE (kaip LT, su siuntimu), Venipak EE/LV fee 3.59 → 2.97 (=3.59 su PVM); patikra LV/EE/LT. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681u'])) return; global $wpdb; $o=array('v'=>'S1681 u');
  $lt=$wpdb->get_row("SELECT * FROM {$wpdb->prefix}woocommerce_tax_rates WHERE tax_rate_country='LT' AND tax_rate_class='' LIMIT 1",ARRAY_A); $o['lt']=$lt;
  foreach(array('LV','EE') as $c){ $ex=$wpdb->get_var($wpdb->prepare("SELECT tax_rate_id FROM {$wpdb->prefix}woocommerce_tax_rates WHERE tax_rate_country=%s AND tax_rate_class=''",$c));
    if($ex){ $o['tarifas'][$c]='jau buvo #'.$ex; continue; }
    $id=WC_Tax::_insert_tax_rate(array('tax_rate_country'=>$c,'tax_rate_state'=>'','tax_rate'=>$lt['tax_rate'],'tax_rate_name'=>$lt['tax_rate_name'],'tax_rate_priority'=>$lt['tax_rate_priority'],'tax_rate_compound'=>0,'tax_rate_shipping'=>1,'tax_rate_order'=>(int)$lt['tax_rate_order']+1,'tax_rate_class'=>''));
    $o['tarifas'][$c]='sukurtas #'.$id; }
  $k='woocommerce_shopup_venipak_shipping_pickup_method_5_settings'; $s=get_option($k); $s['fee']='2.97'; update_option($k,$s);
  WC_Cache_Helper::get_transient_version('shipping',true); wp_cache_flush();
  $o['rates']=$wpdb->get_results("SELECT tax_rate_country c,tax_rate r,tax_rate_name n,tax_rate_shipping s,tax_rate_class cl FROM {$wpdb->prefix}woocommerce_tax_rates",ARRAY_A);
  $pid=wc_get_products(array('limit'=>1,'status'=>'publish','stock_status'=>'instock','return'=>'ids','orderby'=>'rand'))[0];
  foreach(array('LV','EE','LT') as $c){ WC()->customer->set_billing_location($c,'','LV1010',''); WC()->customer->set_shipping_location($c,'','LV1010','');
    $pk=array('contents'=>array(),'contents_cost'=>10,'applied_coupons'=>array(),'destination'=>array('country'=>$c,'state'=>'','postcode'=>'LV1010','city'=>'Riga','address'=>'a','address_1'=>'a','address_2'=>''),'cart_subtotal'=>10);
    $z=WC_Shipping_Zones::get_zone_matching_package($pk); $r=array();
    foreach($z->get_shipping_methods(true) as $m){ if($m->id!=='shopup_venipak_shipping_pickup_method') continue; $m->rates=array(); $m->calculate_shipping($pk); foreach($m->rates as $rt) $r[]=array('cost'=>$rt->get_cost(),'tax'=>round(array_sum($rt->get_taxes()),3),'viso'=>round($rt->get_cost()+array_sum($rt->get_taxes()),2)); }
    $pr=wc_get_product($pid); $o['test'][$c]=array('past'=>$r,'preke'=>$pr->get_name(),'su_pvm'=>wc_get_price_including_tax($pr),'be_pvm'=>round(wc_get_price_excluding_tax($pr),2)); }
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
