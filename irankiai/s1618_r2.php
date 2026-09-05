<?php
/** TEMP PS S1618 run r2 — RECON tęsinys: Venipak/LP metodų nustatymai (kainos, nemokamo riba), Venipak paštomatų šaltinis (venipak-fetch-pickups.php), LP terminalų lentelė (LT0001?), zona 1 pilnai. */
add_action('init', function(){
  if (!isset($_GET['ps_r2'])) return;
  $o=array('v'=>'S1618 r2'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  foreach(WC_Shipping_Zones::get_zones() as $z){ foreach($z['shipping_methods'] as $m){ $o['metodai'][]=array('zona'=>$z['zone_name'],'id'=>$m->id,'inst'=>$m->instance_id,'title'=>$m->title,'on'=>$m->enabled,'set'=>array_map(function($v){return is_scalar($v)?mb_substr((string)$v,0,60):$v;},(array)$m->instance_settings)); } }
  $s=get_option('shopup_venipak_shipping_settings'); $o['venipak_settings']=is_array($s)?array_map(function($v){return is_scalar($v)?mb_substr((string)$v,0,60):(is_array($v)?'array('.count($v).')':'');},$s):$s;
  $f=WP_PLUGIN_DIR.'/wc-venipak-shipping/venipak-fetch-pickups.php'; if(!file_exists($f)){ foreach(glob(WP_PLUGIN_DIR.'/wc-venipak-shipping/*/venipak-fetch-pickups.php') as $g){ $f=$g; } }
  if(file_exists($f)){ $c=file_get_contents($f); preg_match_all('/function\s+([a-z_0-9]+)\s*\(([^)]*)\)/i',$c,$fn,PREG_SET_ORDER); $o['vp_funcs']=array_map(function($m){return $m[1].'('.trim($m[2]).')';},$fn);
    preg_match_all("/(get_option|get_transient|set_transient|update_option|wp_upload_dir|file_get_contents|wp_remote_get)\s*\(\s*([^,)]{0,80})/",$c,$mm,PREG_SET_ORDER); $o['vp_saltiniai']=array_map(function($m){return $m[1].'('.$m[2];},$mm);
    if(function_exists('venipak_find_pickup_by_id')){ $rf=new ReflectionFunction('venipak_find_pickup_by_id'); $o['find_src']=implode("\n",array_slice(file($rf->getFileName()),$rf->getStartLine()-1,min(25,$rf->getEndLine()-$rf->getStartLine()+1))); }
    foreach(array('venipak_get_pickups','venipak_fetch_pickups','venipak_all_pickups','venipak_load_pickups','venipak_pickups') as $fnm){ if(function_exists($fnm)){ $rf=new ReflectionFunction($fnm); $o['src_'.$fnm]=implode("\n",array_slice(file($rf->getFileName()),$rf->getStartLine()-1,min(30,$rf->getEndLine()-$rf->getStartLine()+1))); } }
  }
  $o['vp_files']=array_map('basename',glob(WP_PLUGIN_DIR.'/wc-venipak-shipping/*'));
  $up=wp_upload_dir(); $o['vp_uploads']=array_map(function($x){return basename($x).' '.filesize($x);},array_merge(glob($up['basedir'].'/*venipak*'),glob($up['basedir'].'/venipak*/*')));
  $o['vp_transients']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE '%transient%venipak%' OR option_name LIKE '%transient%pickup%' LIMIT 10");
  if(function_exists('venipak_find_pickup_by_id')){ $pt=venipak_find_pickup_by_id(3648); $o['pickup_3648']=is_array($pt)?array_intersect_key($pt,array_flip(array('id','code','name','address','city','zip','type','country'))):$pt; }
  $o['lp_LT0001']=$wpdb->get_row("SELECT * FROM {$p}woo_lithuaniapost_unisend_terminals WHERE terminal_id='LT0001' LIMIT 1",ARRAY_A); $o['lp_lt_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}woo_lithuaniapost_unisend_terminals WHERE country_code='LT'"); $o['lp_lt_pvz']=$wpdb->get_results("SELECT terminal_id,name,address,city FROM {$p}woo_lithuaniapost_unisend_terminals WHERE country_code='LT' ORDER BY city,name LIMIT 3",ARRAY_A);
  $ox=wc_get_order(35416); $o['lp_order_meta']=array(); foreach($ox->get_meta_data() as $md){ if(strpos($md->key,'lithuaniapost')!==false) $o['lp_order_meta'][$md->key]=mb_substr(is_scalar($md->value)?(string)$md->value:json_encode($md->value,JSON_UNESCAPED_UNICODE),0,200); }
  $oy=wc_get_order(35442); $o['vp_order_meta']=array(); foreach($oy->get_meta_data() as $md){ if(strpos($md->key,'venipak')!==false) $o['vp_order_meta'][$md->key]=mb_substr(is_scalar($md->value)?(string)$md->value:json_encode($md->value,JSON_UNESCAPED_UNICODE),0,300); } $o['vp_order_total']=$oy->get_total(); $o['vp_order_items']=$oy->get_item_count();
  $o['fs_resolve_src']=''; if(class_exists('Petshop_Fulfillment_Source')){ $rm=new ReflectionMethod('Petshop_Fulfillment_Source','is_venipak_only'); $o['fs_venipak_only']=implode("\n",array_slice(file($rm->getFileName()),$rm->getStartLine()-1,min(15,$rm->getEndLine()-$rm->getStartLine()+1))); }
  // IAPV tema
  $tf=get_stylesheet_directory().'/functions.php'; $lines=file($tf); foreach($lines as $i=>$l){ if(preg_match('/iapv|proforma|isankstin|bacs|on-hold|on_hold/i',$l)){ $o['tema_iapv'][]=($i+1).': '.mb_substr(trim($l),0,160); } } $o['tema_iapv']=array_slice((array)($o['tema_iapv']??array()),0,40);
  $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
