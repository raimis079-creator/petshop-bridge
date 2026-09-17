<?php
/** TEMP PS S1689 a — RECON Ads būklė: ps_fakt_reklama 09-09…09-17 (visi stulpeliai), WC užsakymai su _ps_gclid per dieną, visų užsakymų per dieną. */
add_action('init', function(){
  if (!isset($_GET['ps_s1689a'])) return; global $wpdb; $o=array('v'=>'S1689 a'); $p=$wpdb->prefix;
  $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_reklama");
  $o['reklama']=$wpdb->get_results("SELECT * FROM {$p}ps_fakt_reklama WHERE diena>='2026-09-09' ORDER BY diena DESC LIMIT 12",ARRAY_A);
  $o['gclid_uzs']=$wpdb->get_results("SELECT DATE(o.date_created_gmt) d, COUNT(*) n, ROUND(SUM(o.total_amount),0) eur FROM {$p}wc_orders o JOIN {$p}wc_orders_meta m ON m.order_id=o.id AND m.meta_key='_ps_gclid' AND m.meta_value<>'' WHERE o.status IN ('wc-processing','wc-completed','wc-on-hold') AND o.date_created_gmt>='2026-09-09' GROUP BY d ORDER BY d",ARRAY_A);
  $o['visi_uzs']=$wpdb->get_results("SELECT DATE(date_created_gmt) d, COUNT(*) n, ROUND(SUM(total_amount),0) eur FROM {$p}wc_orders WHERE status IN ('wc-processing','wc-completed','wc-on-hold') AND date_created_gmt>='2026-09-09' GROUP BY d ORDER BY d",ARRAY_A);
  $o['pask_traukimas']=get_option('ps_fakt_reklama_pask'); 
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
