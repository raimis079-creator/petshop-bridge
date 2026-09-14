<?php
/** TEMP PS S1680 g — read-only: simuliuoti krepšelį (lengva AV prekė) ir gauti pristatymo būdus — ar LP Express rodomas; kur dingsta. */
add_action('wp_loaded', function(){
  if (!isset($_GET['ps_s1680g'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1680 g');
  $ids=$wpdb->get_col("SELECT ID FROM {$p}posts WHERE post_type='product' AND post_status='publish' AND post_title LIKE '%stirnos koja%' LIMIT 1"); $pid=(int)($ids[0]??0);
  if(!$pid){ $pid=(int)$wpdb->get_var("SELECT post_id FROM {$p}postmeta WHERE meta_key='_sku' AND meta_value='48370'"); }
  $pr=wc_get_product($pid); $o['preke']=array($pid,$pr?$pr->get_name():null,$pr?$pr->get_weight():null,$pr?$pr->get_stock_quantity():null,$pr?$pr->get_meta('_ps_saltinis'):null);
  wc_load_cart(); WC()->session->set_customer_session_cookie(true); WC()->cart->empty_cart();
  $ck=WC()->cart->add_to_cart($pid,1); $o['cart']=$ck?'ok':'FAIL '.wc_print_notices(true);
  WC()->customer->set_shipping_country('LT'); WC()->customer->set_shipping_city('Vilnius'); WC()->customer->set_shipping_postcode('01100'); WC()->customer->set_billing_country('LT');
  $pk=WC()->cart->get_shipping_packages(); $pk=WC()->shipping()->calculate_shipping($pk);
  foreach($pk as $i=>$k){ foreach((array)($k['rates']??array()) as $rid=>$r){ $o['rates'][]=$rid.' '.$r->get_label().' '.$r->get_cost(); } }
  // be filtrų: tiesiogiai iš zonos metodų
  $zone=WC_Shipping_Zones::get_zone_matching_package($pk[0]); $o['zona']=$zone->get_zone_name();
  foreach($zone->get_shipping_methods(true) as $m){ $raw=array(); if(method_exists($m,'calculate_shipping')){ $m->rates=array(); $m->calculate_shipping($pk[0]); foreach($m->rates as $rid=>$r) $raw[]=$rid.' '.$r->get_cost(); } $o['metodai'][]=$m->id.':'.$m->instance_id.' '.$m->title.' → '.implode(' | ',$raw); }
  $o['kg']=WC()->cart->get_cart_contents_weight(); $o['riba']=class_exists('Petshop_Rinkiniai')&&defined('Petshop_Rinkiniai::PASTOMATO_RIBA')?Petshop_Rinkiniai::PASTOMATO_RIBA:null;
  if(function_exists('petshop_hide_parcel_if_courier_only')){ $rf=new ReflectionFunction('petshop_hide_parcel_if_courier_only'); $o['hide_fn']=array($rf->getFileName(),$rf->getStartLine()); $src=file($rf->getFileName()); $o['hide_src']=implode('',array_slice($src,$rf->getStartLine()-1,$rf->getEndLine()-$rf->getStartLine()+1)); }
  $o['filtrai']=array(); global $wp_filter; if(isset($wp_filter['woocommerce_package_rates'])){ foreach($wp_filter['woocommerce_package_rates']->callbacks as $pr_=>$cbs){ foreach($cbs as $cb){ $f=$cb['function']; $o['filtrai'][]=$pr_.' '.(is_array($f)?(is_object($f[0])?get_class($f[0]):$f[0]).'::'.$f[1]:(is_string($f)?$f:'closure')); } } }
  WC()->cart->empty_cart();
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
