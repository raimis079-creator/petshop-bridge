<?php
/** TEMP PS S1681 t — EE/LV Venipak paštomatai (inst 5) fee 2.47 → 3.59; bak opcija ps_s1681_inst5_bak; patikra: LV paketas → tarifas, ir LV kliento prekės kaina (PVM). */
add_action('init', function(){
  if (!isset($_GET['ps_s1681t'])) return; $o=array('v'=>'S1681 t'); $k='woocommerce_shopup_venipak_shipping_pickup_method_5_settings';
  $s=get_option($k); $o['buvo']=$s; if(!get_option('ps_s1681_inst5_bak')) add_option('ps_s1681_inst5_bak',$s,'',false);
  $s['fee']='3.59'; $s['min_amount_for_free_shipping']=''; update_option($k,$s); $o['dabar']=get_option($k);
  WC_Cache_Helper::get_transient_version('shipping',true);
  $pid=wc_get_products(array('limit'=>1,'status'=>'publish','stock_status'=>'instock','return'=>'ids','orderby'=>'rand'))[0];
  foreach(array('LV','EE','LT') as $c){ WC()->customer->set_billing_location($c,'','LV1010',''); WC()->customer->set_shipping_location($c,'','LV1010','');
    $pk=array('contents'=>array(array('product_id'=>$pid,'quantity'=>1,'data'=>wc_get_product($pid),'line_total'=>10,'line_subtotal'=>10,'line_tax'=>0,'line_subtotal_tax'=>0)),'contents_cost'=>10,'applied_coupons'=>array(),'destination'=>array('country'=>$c,'state'=>'','postcode'=>'LV1010','city'=>'Riga','address'=>'a','address_1'=>'a','address_2'=>''),'cart_subtotal'=>10);
    $z=WC_Shipping_Zones::get_zone_matching_package($pk); $r=array();
    foreach($z->get_shipping_methods(true) as $m){ $m->rates=array(); $m->calculate_shipping($pk); foreach($m->rates as $rt) $r[]=array('m'=>$rt->get_label(),'cost'=>$rt->get_cost(),'tax'=>array_sum($rt->get_taxes()),'viso'=>round($rt->get_cost()+array_sum($rt->get_taxes()),2)); }
    $pr=wc_get_product($pid); $o['test'][$c]=array('zona'=>$z->get_zone_name(),'tarifai'=>$r,'preke'=>$pr->get_name(),'kaina_su_pvm'=>wc_get_price_including_tax($pr),'kaina_be'=>wc_get_price_excluding_tax($pr),'kaina_reg'=>$pr->get_price()); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
