<?php
/** Plugin Name: TEMP PS S1716e kas ismeta pastomata 12466 read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1716e'])) return;
  @set_time_limit(170); global $wpdb, $wp_filter; $r=['v'=>'S1716e'];
  try{
    foreach([12466,17978] as $pid){ $r['meta'][$pid]=$wpdb->get_results($wpdb->prepare("SELECT meta_key, LEFT(meta_value,60) v FROM {$wpdb->postmeta} WHERE post_id=%d AND (meta_key LIKE '%%venipak%%' OR meta_key LIKE '%%pickup%%' OR meta_key LIKE '%%locker%%' OR meta_key LIKE '%%pastomat%%' OR meta_key LIKE '%%shipping%%' OR meta_key LIKE '%%dimension%%' OR meta_key IN ('_length','_width','_height','_weight','_zb_enabled','_ps_sandelis'))",$pid),ARRAY_A); }
    foreach(glob(WP_PLUGIN_DIR.'/*venipak*/public/*.php') as $g){ $s=file_get_contents($g); if(strpos($s,'show_pickup_if_product_included_in_locker')!==false){ preg_match('#function show_pickup_if_product_included_in_locker.*?\n\t\}#s',$s,$m); $r['venipak_fn'][basename($g)]=substr($m[0]??'',0,3000); } }
    $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-rinkiniai.php'); preg_match('#function pastomato_sargas.*?\n\t\}#s',$s,$m); $r['pastomato_sargas']=substr($m[0]??'',0,2500);
    // po vieną filtrą: kuris išmeta
    wc_load_cart(); WC()->cart->empty_cart(false); WC()->customer->set_shipping_country('LT'); WC()->customer->set_shipping_postcode('01100'); WC()->cart->add_to_cart(12466,1); WC()->cart->calculate_totals();
    $pk=WC()->cart->get_shipping_packages(); $pkg=$pk[0]; $zone=WC_Shipping_Zones::get_zone_matching_package($pkg); $raw=[];
    foreach($zone->get_shipping_methods(true) as $m){ $m->calculate_shipping($pkg); foreach($m->rates as $rid=>$rt){ $raw[$rid]=$rt; } $m->rates=[]; }
    $r['zali_tarifai']=array_keys($raw);
    $cbs=$wp_filter['woocommerce_package_rates']->callbacks; ksort($cbs); $cur=$raw;
    foreach($cbs as $prio=>$list){ foreach($list as $cb){ $fn=$cb['function']; $nm=is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:(is_string($fn)?$fn:'closure'); $pries=array_keys($cur); $cur=call_user_func_array($fn,[$cur,$pkg]); $po=array_keys((array)$cur); if($pries!==$po) $r['ismete'][]=[$prio,$nm,'pries'=>$pries,'po'=>$po]; } }
    WC()->cart->empty_cart(false);
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
