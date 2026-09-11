<?php
/** TEMP PS S1675 run e — front patikra po outofstock (be kešo). READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_e5'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1675 e');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  foreach(array(14984,15651,17345) as $id){ $pr=wc_get_product($id); $u=add_query_arg('ps_nc',time(),get_permalink($id)); $r=wp_remote_get($u,array('timeout'=>30,'sslverify'=>false,'headers'=>array('Cache-Control'=>'no-cache'))); $b=(string)wp_remote_retrieve_body($r);
    $o[$id]=array('wc'=>$pr->get_stock_status().'/'.(int)$pr->is_purchasable(),'code'=>wp_remote_retrieve_response_code($r),'btn'=>(int)(strpos($b,'single_add_to_cart_button')!==false),'oos'=>(int)(strpos($b,'out-of-stock')!==false),'txt'=>preg_match('/<p class="stock[^"]*">([^<]{0,60})/',$b,$m)?$m[1]:'-','cache_hdr'=>wp_remote_retrieve_header($r,'x-ps-cache')); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
