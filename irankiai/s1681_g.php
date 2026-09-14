<?php
/** TEMP PS S1681 g — read-only: Analitikos lango verdiktai (30 d.), ps_carts piltuvas, GA4 sesijos jei yra. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681g'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 g');
  if(class_exists('Petshop_Analitika_Langas')) foreach(array('krepseliai','reklama','klientai','pristatymas','laiskai') as $m){ $r=Petshop_Analitika_Langas::$m(30); unset($r['kamp']); $o['A30'][$m]=$r; }
  $o['carts_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_carts");
  $o['carts14']=$wpdb->get_results("SELECT status,COUNT(*) n,SUM(email<>'' AND email IS NOT NULL) su_el FROM {$p}ps_carts WHERE created_at>=DATE_SUB(NOW(),INTERVAL 14 DAY) GROUP BY status",ARRAY_A);
  foreach($wpdb->get_results("SHOW TABLES LIKE '{$p}ps_fakt_%'",ARRAY_N) as $r) $o['fakt_lent'][]=$r[0];
  foreach($wpdb->get_results("SELECT option_name n,LEFT(option_value,400) v FROM {$p}options WHERE option_name LIKE 'ps_ga4%' OR option_name LIKE 'ps_%sesij%' OR option_name LIKE 'ps_kontrol%'",ARRAY_A) as $r) $o['opt'][$r['n']]=$r['v'];
  if($wpdb->get_var("SHOW TABLES LIKE '{$p}ps_fakt_ga4'")){ $o['ga4_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_ga4"); $o['ga4']=$wpdb->get_results("SELECT * FROM {$p}ps_fakt_ga4 ORDER BY 1 DESC LIMIT 14",ARRAY_A); }
  $o['uzs14']=$wpdb->get_results("SELECT DATE(date_created_gmt) d,COUNT(*) n,ROUND(SUM(total_amount),0) eur FROM {$p}wc_orders WHERE type='shop_order' AND status IN('wc-processing','wc-completed') AND date_created_gmt>=DATE_SUB(NOW(),INTERVAL 14 DAY) GROUP BY d",ARRAY_A);
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
