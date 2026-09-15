<?php
/** TEMP PS S1685 nj — RECON read-only (saugus): Ads signalas — reklamos faktų lentelė, offline endpoint'o atsakymas, gclid užsakymai per dieną. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685nj'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 nj');
  try {
    $o['lenteles']=$wpdb->get_col("SHOW TABLES LIKE '{$p}ps_%rekl%'"); $o['lenteles2']=$wpdb->get_col("SHOW TABLES LIKE '{$p}ps_ads%'");
    foreach(array_merge($o['lenteles'],$o['lenteles2']) as $t){ $o['cols'][$t]=$wpdb->get_col("SHOW COLUMNS FROM `$t`"); $o['pask'][$t]=$wpdb->get_results("SELECT * FROM `$t` ORDER BY 1 DESC LIMIT 6",ARRAY_A); }
    $r=wp_remote_get(home_url('/?ps_ads_offline='.get_option('ps_ads_offline_raktas').'&dienos=7'),array('timeout'=>30,'sslverify'=>false)); $b=wp_remote_retrieve_body($r); $o['offline_code']=wp_remote_retrieve_response_code($r); $o['offline_raw']=substr($b,0,600);
    $o['gclid_per_diena']=$wpdb->get_results("SELECT DATE(o.date_created_gmt) d, COUNT(*) n, ROUND(SUM(o.total_amount),0) eur FROM {$p}wc_orders o JOIN {$p}wc_orders_meta m ON m.order_id=o.id AND m.meta_key='_ps_gclid' AND m.meta_value<>'' WHERE o.date_created_gmt>='2026-09-10' AND o.status IN ('wc-processing','wc-completed') GROUP BY 1 ORDER BY 1",ARRAY_A);
  } catch (Throwable $e) { $o['ERR']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
