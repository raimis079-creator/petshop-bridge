<?php
/** TEMP PS S1683t x — #18054 publikuoti (wp_update_post), patikrinti kas grąžina į draft; legacy-301 map formatas (2 įrašai). */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tx'])) return; global $wpdb; $o=array('v'=>'x');
  $o['pries']=get_post_status(18054); $o['upd']=wp_update_post(array('ID'=>18054,'post_status'=>'publish'),true); clean_post_cache(18054); $o['po']=get_post_status(18054); $o['po_db']=$wpdb->get_var("SELECT post_status FROM {$wpdb->posts} WHERE ID=18054");
  $pr=wc_get_product(18054); $o['stock']=$pr->get_stock_quantity().' '.$pr->get_stock_status().' vis='.$pr->get_catalog_visibility().' price='.$pr->get_price();
  $m=json_decode(file_get_contents(WPMU_PLUGIN_DIR.'/petshop-legacy-301-map.json'),true); $o['map_n']=is_array($m)?count($m):0; $o['map_pvz']=is_array($m)?array_slice($m,0,2,true):substr(file_get_contents(WPMU_PLUGIN_DIR.'/petshop-legacy-301-map.json'),0,300);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
