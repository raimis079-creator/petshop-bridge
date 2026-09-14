<?php
/** TEMP PS S1681 j — read-only: WC užsakymų savaitės 12 sav. (ar yra senos svetainės istorija), pagal statusą. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681j'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 j');
  $o['sav']=$wpdb->get_results("SELECT YEARWEEK(date_created_gmt,3) sav,MIN(DATE(date_created_gmt)) nuo,COUNT(*) n,SUM(status IN('wc-processing','wc-completed')) apm,ROUND(SUM(total_amount)) eur,MIN(id) nuo_id,MAX(id) iki_id FROM {$p}wc_orders WHERE type='shop_order' AND date_created_gmt>=DATE_SUB(NOW(),INTERVAL 16 WEEK) GROUP BY sav ORDER BY sav",ARRAY_A);
  $o['seniausias']=$wpdb->get_row("SELECT MIN(date_created_gmt) nuo,COUNT(*) n FROM {$p}wc_orders WHERE type='shop_order'",ARRAY_A);
  $o['stat']=$wpdb->get_results("SELECT status,COUNT(*) n FROM {$p}wc_orders WHERE type='shop_order' AND date_created_gmt>='2026-09-08' GROUP BY status",ARRAY_A);
  foreach($wpdb->get_results("SHOW TABLES LIKE '{$p}ps_sen%'",ARRAY_N) as $r) $o['sen_lent'][]=$r[0];
  foreach($wpdb->get_results("SHOW TABLES LIKE '{$p}ps_%istor%'",ARRAY_N) as $r) $o['sen_lent'][]=$r[0];
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
