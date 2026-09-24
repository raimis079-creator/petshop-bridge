<?php
/** Plugin Name: TEMP PS S1716d kasos metodu testas (1 pries / 2 perrikiuoti pastomata pirmu / 3 po / 9 atstatyti) — krepselis neissaugomas */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1716d'])) return;
  $f=$_GET['ps_s1716d']; @set_time_limit(170); global $wpdb; $r=['v'=>'S1716d','faze'=>$f]; $P=$wpdb->prefix;
  $test=function($pid,$qty=1){ wc_load_cart(); WC()->cart->empty_cart(false); wc_clear_notices(); WC()->customer->set_shipping_country('LT'); WC()->customer->set_billing_country('LT'); WC()->customer->set_shipping_postcode('01100'); $k=WC()->cart->add_to_cart($pid,$qty); if(!$k) return ['add'=>false,'notices'=>wc_get_notices()]; WC()->cart->calculate_totals(); $pk=WC()->cart->get_shipping_packages(); $pk=WC()->shipping()->calculate_shipping($pk); $o=[]; foreach($pk as $i=>$p){ $rates=[]; foreach($p['rates'] as $rid=>$rate){ $rates[]=[$rid,$rate->get_label(),$rate->get_cost()]; } $o[$i]=['rates'=>$rates,'default'=>function_exists('wc_get_default_shipping_method_for_package')?wc_get_default_shipping_method_for_package($i,$p,''):null]; } $res=class_exists('Petshop_Fulfillment_Source')?Petshop_Fulfillment_Source::resolve((int)$pid):null; WC()->cart->empty_cart(false); return ['add'=>true,'subtotal'=>WC()->cart->get_subtotal(),'paketai'=>$o,'fulfillment_resolve'=>$res,'tik_kurjeriu'=>get_post_meta($pid,'_ps_tik_kurjeriu',true),'svoris'=>get_post_meta($pid,'_weight',true)]; };
  try{
    if($f==='1'||$f==='3'){ foreach([17978=>'Josera SensiPlus 12,5 kg (VF)',12466=>'Eukanuba Dermatosis 12 kg (ZB)',15870=>'Georplast Vicky tualetas (tik kurjeriu)'] as $pid=>$pav){ $r['testai'][$pid.' '.$pav]=$test($pid); } $r['metodai']=$wpdb->get_results("SELECT instance_id, method_id, method_order, is_enabled FROM {$P}woocommerce_shipping_zone_methods WHERE zone_id=1 ORDER BY method_order, instance_id",ARRAY_A); }
    if($f==='2'){ $bak=$wpdb->get_results("SELECT instance_id, method_order FROM {$P}woocommerce_shipping_zone_methods WHERE zone_id=1",ARRAY_A); update_option('ps_s1716_zona1_eile_bak',$bak,false); $r['bak']=$bak;
      // paštomatai (inst 3) → 1, kurjeris inst 2 → 2, kiti +0 (jau ≥3)
      $wpdb->update("{$P}woocommerce_shipping_zone_methods",['method_order'=>0],['zone_id'=>1,'instance_id'=>3]);
      $wpdb->update("{$P}woocommerce_shipping_zone_methods",['method_order'=>1],['zone_id'=>1,'instance_id'=>1]); // free_shipping (isjungtas) po pastomato
      WC_Cache_Helper::get_transient_version('shipping',true); wp_cache_flush(); if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache();
      $r['po']=$wpdb->get_results("SELECT instance_id, method_id, method_order, is_enabled FROM {$P}woocommerce_shipping_zone_methods WHERE zone_id=1 ORDER BY method_order, instance_id",ARRAY_A); }
    if($f==='9'){ foreach(get_option('ps_s1716_zona1_eile_bak',[]) as $b){ $wpdb->update("{$P}woocommerce_shipping_zone_methods",['method_order'=>(int)$b['method_order']],['zone_id'=>1,'instance_id'=>(int)$b['instance_id']]); } WC_Cache_Helper::get_transient_version('shipping',true); $r['atstatyta']=1; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
