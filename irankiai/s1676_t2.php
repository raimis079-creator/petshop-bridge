<?php
/** TEMP PS S1676 run t2 — snippet 2515 eilutės 117-140, 267-346, 392-420, 548-560. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676t2'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 t2');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $L=explode("\n",$wpdb->get_var("SELECT code FROM {$p}snippets WHERE id=2515"));
  foreach(array(array(117,140),array(267,346),array(392,420),array(548,560)) as $r){ $o['s'.$r[0]]=implode("\n",array_slice($L,$r[0]-1,$r[1]-$r[0]+1)); }
  $o['nesut']=$wpdb->get_results("SELECT s.product_id,s.stock_qty,(SELECT meta_value FROM {$p}postmeta WHERE post_id=s.product_id AND meta_key='_own_stock_qty') own,(SELECT meta_value FROM {$p}postmeta WHERE post_id=s.product_id AND meta_key='_stock') st,(SELECT meta_value FROM {$p}postmeta WHERE post_id=s.product_id AND meta_key='_ps_sandelis') sand,s.updated_at FROM {$p}ps_sources s WHERE s.source='av' AND s.is_active=1 AND s.stock_qty <> COALESCE((SELECT meta_value FROM {$p}postmeta WHERE post_id=s.product_id AND meta_key='_own_stock_qty'),(SELECT meta_value FROM {$p}postmeta WHERE post_id=s.product_id AND meta_key='_stock'),0)+0 LIMIT 20",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
