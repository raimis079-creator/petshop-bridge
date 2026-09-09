<?php
/** TEMP PS S1664 e — spąstų E2E: #35868 eilutei laikinai add+delete _reduced_stock (999), tikrinam ps_rs_trap. */
add_action('init', function(){
  if (!isset($_GET['ps_s1664e'])) return;
  $o=array('v'=>'S1664 e'); global $wpdb;
  $ord=wc_get_order(35868);
  if(!$ord){ $o['klaida']='nera 35868'; wp_send_json($o); }
  $items=$ord->get_items(); $it=reset($items);
  if(!$it){ $o['klaida']='nera eiluciu'; wp_send_json($o); }
  $iid=$it->get_id();
  $pries=count((array)get_option('ps_rs_trap',array()));
  wc_add_order_item_meta($iid,'_reduced_stock',999);
  wc_delete_order_item_meta($iid,'_reduced_stock',999);
  wp_cache_delete('ps_rs_trap','options');
  $log=(array)get_option('ps_rs_trap',array());
  $o['pries']=$pries; $o['po']=count($log);
  $o['pask']=$log?end($log):null;
  $o['liko_meta']=wc_get_order_item_meta($iid,'_reduced_stock',true);
  wp_send_json($o);
});
