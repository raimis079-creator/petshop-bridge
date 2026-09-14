<?php
/** TEMP PS S1680 a — read-only: LP Express lipduko klaida — užsakymų meta, plugino būsena, žurnalas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1680a'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1680 a');
  $ids=$wpdb->get_col("SELECT o.id FROM {$p}wc_orders o JOIN {$p}wc_order_stats s ON s.order_id=o.id WHERE o.type='shop_order' AND o.status IN('wc-processing','wc-on-hold','wc-pending') AND o.date_created_gmt>='2026-09-08' ORDER BY o.id DESC LIMIT 60");
  foreach($ids as $id){ $w=wc_get_order($id); if(!$w) continue; $m=array();
    foreach(array('_woo_lithuaniapost_shipping_status_value','_woo_lithuaniapost_parcel_create_error','_woo_lithuaniapost_lpexpress_terminal_id','_woo_lithuaniapost_lpexpress_terminal','_woo_lithuaniapost_shipping_item_id','_woo_lithuaniapost_barcode','_woo_lithuaniapost_shipping_method') as $k){ $v=$w->get_meta($k); if($v!=='') $m[$k]=is_scalar($v)?substr((string)$v,0,300):json_encode($v,JSON_UNESCAPED_UNICODE); }
    $sm=array(); foreach($w->get_shipping_methods() as $s){ $sm[]=$s->get_method_id().':'.$s->get_instance_id().' '.$s->get_name(); }
    if($m||preg_grep('/lithuania|lpexpress|lp_/i',$sm)) $o['lp_uzs'][]=array('id'=>$id,'nr'=>$w->get_order_number(),'st'=>$w->get_status(),'sm'=>$sm,'meta'=>$m,'notes'=>array_map(function($n){return substr($n->date_created->date('m-d H:i').' '.$n->content,0,200);},array_slice(wc_get_order_notes(array('order_id'=>$id,'limit'=>6)),0,6)));
  }
  foreach(get_option('active_plugins') as $pl) if(stripos($pl,'lithuania')!==false||stripos($pl,'lp')!==false||stripos($pl,'post')!==false) $o['plugins'][]=$pl.' '.(get_plugin_data(WP_PLUGIN_DIR.'/'.$pl,false,false)['Version']??'');
  $opts=$wpdb->get_results("SELECT option_name n,LENGTH(option_value) l FROM {$p}options WHERE option_name LIKE '%lithuaniapost%' OR option_name LIKE 'woocommerce_lpexpress%'",ARRAY_A); $o['opts']=$opts;
  foreach($opts as $x){ if(preg_match('/settings|api|token|auth/i',$x['n'])){ $v=get_option($x['n']); if(is_array($v)){ foreach($v as $k=>$vv){ if(preg_match('/pass|secret|token|key/i',$k)) $v[$k]=$vv?'[yra '.strlen((string)$vv).']':'[TUSCIA]'; elseif(is_string($vv)) $v[$k]=substr($vv,0,80);} $o['opt_'.$x['n']]=$v; } } }
  $logs=glob(WC_LOG_DIR.'*lithuania*'); $o['log_files']=array_map('basename',(array)$logs); rsort($logs); if($logs){ $l=file($logs[0]); $o['log_tail']=array_map(function($s){return substr($s,0,300);},array_slice($l,-25)); }
  $o['terminalai_n']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}woo_lithuaniapost_unisend_terminals"); $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
