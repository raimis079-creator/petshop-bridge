<?php
/** TEMP PS S1676 run r — Gavimo patikra: 17707 partijos, _own, ps_sources av eilutė; petshop-partijos versija. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676r'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 r');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['partijos_stulp']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_partijos",0);
  $o['p17707']=$wpdb->get_results("SELECT * FROM {$p}ps_partijos WHERE product_id=17707 ORDER BY id DESC LIMIT 5",ARRAY_A);
  $o['meta17707']=array('own'=>get_post_meta(17707,'_own_stock_qty',true),'stock'=>get_post_meta(17707,'_stock',true),'sand'=>get_post_meta(17707,'_ps_sandelis',true));
  $o['src17707']=$wpdb->get_results("SELECT id,source,stock_qty,is_active,updated_at FROM {$p}ps_sources WHERE product_id=17707",ARRAY_A);
  $o['partijos_ver']=md5_file(WPMU_PLUGIN_DIR.'/petshop-partijos.php'); preg_match('/Petshop Partijos v[\d.]+[^\n]{0,80}/',file_get_contents(WPMU_PLUGIN_DIR.'/petshop-partijos.php'),$m); $o['partijos_h']=$m[0]??'';
  $o['gavimai_po_0910']=$wpdb->get_results("SELECT product_id,kiekis,pastaba,created_at FROM {$p}ps_partijos WHERE created_at>='2026-09-10' AND (pastaba LIKE '%Gauta%' OR pastaba LIKE '%darbalauk%' OR pastaba LIKE '%gavim%') ORDER BY id DESC LIMIT 10",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
