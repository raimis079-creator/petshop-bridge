<?php
/** TEMP PS S1691 l — petshop-atsargu-laukimas.php: antraštė, ps_stock_watch turinys/statusai, ar mygtukas rodomas outofstock prekėse. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691l'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true);
  $f=WPMU_PLUGIN_DIR.'/petshop-atsargu-laukimas.php'; $l=file($f); $o['antraste']=implode('',array_slice($l,0,40)); $o['md5']=md5_file($f); $o['eil']=count($l);
  foreach ($l as $i=>$ln){ if (preg_match('/add_action\(|add_filter\(|is_in_stock|outofstock|catalog_visibility|post_status|wp_mail|Petshop_Email|dispatch|cron/i',$ln)) $o['kabliai'][$i+1]=trim(mb_substr($ln,0,180)); }
  $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_stock_watch");
  $o['viso']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_stock_watch");
  $o['pagal_status']=$wpdb->get_results("SELECT status, COUNT(*) n, MIN(created_at) nuo, MAX(created_at) iki FROM {$p}ps_stock_watch GROUP BY status",ARRAY_A);
  $o['pask10']=$wpdb->get_results("SELECT * FROM {$p}ps_stock_watch ORDER BY id DESC LIMIT 10",ARRAY_A);
  $o['top_prekes']=$wpdb->get_results("SELECT w.product_id, ps.post_title, COUNT(*) n FROM {$p}ps_stock_watch w LEFT JOIN {$p}posts ps ON ps.ID=w.product_id GROUP BY w.product_id ORDER BY n DESC LIMIT 10",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
