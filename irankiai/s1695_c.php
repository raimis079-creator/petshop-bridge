<?php
/** TEMP PS S1695 c — `_ps_source` konfliktas: kas rašo calc_product (kodas), kaip desk/darbalaukis/av-source skaito `_ps_source`, kiek užsakymų eilučių turi ne av/vf/zb reikšmes; #1121 eilutė. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1695c'])) return; global $wpdb; $o=array(); $p=$wpdb->prefix; $C=WP_CONTENT_DIR;
  $o['reiksmes']=$wpdb->get_results("SELECT oim.meta_value v,COUNT(*) n,MIN(oi.order_id) nuo,MAX(oi.order_id) iki FROM {$p}woocommerce_order_itemmeta oim JOIN {$p}woocommerce_order_items oi ON oi.order_item_id=oim.order_item_id WHERE oim.meta_key='_ps_source' GROUP BY v",ARRAY_A);
  $o['calc_uzs']=$wpdb->get_results("SELECT oi.order_id,o.status,o.date_created_gmt,oi.order_item_name FROM {$p}woocommerce_order_itemmeta oim JOIN {$p}woocommerce_order_items oi ON oi.order_item_id=oim.order_item_id JOIN {$p}wc_orders o ON o.id=oi.order_id WHERE oim.meta_key='_ps_source' AND oim.meta_value NOT IN ('av','vf','zb','prins') ORDER BY oi.order_id DESC LIMIT 15",ARRAY_A);
  $o['e1121']=$wpdb->get_results("SELECT oim.meta_key,LEFT(oim.meta_value,60) v FROM {$p}woocommerce_order_itemmeta oim JOIN {$p}woocommerce_order_items oi ON oi.order_item_id=oim.order_item_id WHERE oi.order_id=36095 AND oi.order_item_type='line_item' AND oim.meta_key LIKE '_ps_%'",ARRAY_A);
  // kas rašo calc_product / _ps_source
  $files=array_merge(glob("$C/mu-plugins/*.php"),glob("$C/plugins/petshop-core/*.php"),glob("$C/plugins/petshop-core/includes/*.php"),glob("$C/plugins/petshop-core/includes/*/*.php"),glob("$C/plugins/petshop-core/assets/*.js"),glob("$C/themes/flatsome-child/*.php"),glob("$C/themes/flatsome-child/js/*.js"));
  foreach ($files as $f){ $s=@file_get_contents($f); if ($s===false) continue; $k=str_replace($C,'',$f);
    if (strpos($s,'calc_product')!==false){ preg_match_all('/[^\n]{0,120}calc_product[^\n]{0,140}/',$s,$m); $o['calc_product_kode'][$k]=array_slice(array_values(array_unique($m[0])),0,6); }
    if (strpos($s,"_ps_source")!==false){ preg_match_all('/[^\n]{0,110}_ps_source[^\n]{0,140}/',$s,$m); $o['_ps_source_kode'][$k]=array_slice(array_values(array_unique($m[0])),0,8); } }
  $o['snippets']=$wpdb->get_results("SELECT id,name,active FROM {$p}snippets WHERE active=1 AND (code LIKE '%calc_product%' OR code LIKE '%_ps_source%') LIMIT 10",ARRAY_A);
  // darbalaukio tekstas „siunčia klientui"
  foreach (array("$C/mu-plugins/petshop-darbalaukis.php","$C/mu-plugins/petshop-desk.php") as $f){ $s=file_get_contents($f); preg_match_all('/[^\n]{0,140}siun(č|c)ia klientui[^\n]{0,140}/u',$s,$m); $o['siuncia_klientui'][basename($f)]=array_slice(array_values(array_unique($m[0])),0,6); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
