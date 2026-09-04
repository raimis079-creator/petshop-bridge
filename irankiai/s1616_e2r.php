<?php
/** TEMP PS S1616 run e2r — RECON (tik skaitymas): WC 11 `wc_create_refund` (wc-order-functions.php), `get_order_item_totals` refund eilutės (abstracts/abstract-wc-order.php), temos base.php sumų šaltiniai. */
add_action('init', function(){
  if (!isset($_GET['ps_e2r'])) return;
  $o=array('v'=>'S1616 e2r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $src=function($file,$pat,$len=2200,$back=0){ $c=(string)@file_get_contents($file); if(!$c) return 'NĖRA '.$file; $i=strpos($c,$pat); if($i===false) return 'pattern nerastas: '.$pat; return substr($c,max(0,$i-$back),$len); };
  try{
  $wc=WP_PLUGIN_DIR.'/woocommerce';
  $o['files']=array(); foreach(array('/includes/wc-order-functions.php','/includes/abstracts/abstract-wc-order.php','/includes/abstract-wc-order.php','/includes/class-wc-order.php') as $f){ $o['files'][$f]=file_exists($wc.$f); }
  $o['wc_create_refund']=$src($wc.'/includes/wc-order-functions.php','function wc_create_refund',5600);
  $o['wc_restock']=$src($wc.'/includes/wc-order-functions.php','function wc_restock_refunded_items',1800);
  $ab=file_exists($wc.'/includes/abstracts/abstract-wc-order.php')?$wc.'/includes/abstracts/abstract-wc-order.php':$wc.'/includes/abstract-wc-order.php';
  $o['item_totals_refund']=$src($ab,'$refunds = $this->get_refunds()',1500,300); if(strpos($o['item_totals_refund'],'nerastas')!==false){ $o['item_totals_refund']=$src($wc.'/includes/class-wc-order.php','$refunds = $this->get_refunds()',1500,300); }
  $o['item_totals_fn']=$src($wc.'/includes/class-wc-order.php','function get_order_item_totals',3600);
  $bp=get_stylesheet_directory().'/woocommerce-delivery-notes/base.php'; $c=(string)@file_get_contents($bp); $o['base_size']=strlen($c);
  preg_match_all('/get_items\([^)]*\)|get_quantity\(\)|get_total\(\)|get_subtotal\(\)|get_total_tax\(\)|get_shipping_total\(\)|get_total_refunded|get_refunds|get_qty_refunded_for_item|get_order_item_totals|refund|creditnote|KR-AVPN/i',$c,$m); $o['base_calls']=array_count_values($m[0]);
  $o['base_items']=$src($bp,'get_items(',1600,400);
  $o['base_totals']=$src($bp,'get_shipping_total',1400,700);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getFile().':'.$e->getLine(); }
  $J($o);
},99);
