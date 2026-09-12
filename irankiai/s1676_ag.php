<?php
/** TEMP PS S1676 run ag — 4 sluoksnis: kas fiksuoja _ps_source užsakymo momentu (Petshop_AV_Order?), šaltinis. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676ag'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 ag');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  foreach(get_declared_classes() as $c){ if(preg_match('/^Petshop_AV_/',$c)){ $rc=new ReflectionClass($c); $o['kl'][$c]=str_replace(WP_CONTENT_DIR,'',$rc->getFileName()); } }
  if(class_exists('Petshop_AV_Order')){ $rc=new ReflectionClass('Petshop_AV_Order'); $f=$rc->getFileName(); $o['order_md5']=md5_file($f); $o['order_b64']=base64_encode(file_get_contents($f)); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
