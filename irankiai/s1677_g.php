<?php
/** TEMP PS S1677 g — read-only: kur guli tikras gclid (fakt vs užsakymo meta vs landing_url). */
add_action('init', function(){
  if (!isset($_GET['ps_s1677g'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1677 g');
  $o['fakt_gclid_ilgiai']=$wpdb->get_results("SELECT LENGTH(gclid) l,COUNT(*) n FROM {$p}ps_fakt_uzsakymai WHERE gclid<>'' GROUP BY 1",ARRAY_A);
  $o['landing']=$wpdb->get_col("SELECT SUBSTRING(landing_url,1,200) FROM {$p}ps_fakt_uzsakymai WHERE gclid<>'' LIMIT 3");
  $o['meta']=$wpdb->get_results("SELECT meta_key,SUBSTRING(meta_value,1,120) v FROM {$p}wc_orders_meta WHERE order_id=35882 AND (meta_key LIKE '%attribution%' OR meta_key LIKE '%gclid%' OR meta_key LIKE '%ps_ga4%' OR meta_key LIKE '%client%')",ARRAY_A);
  $o['meta_raktai_gclid']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key LIKE '%gclid%' OR meta_key LIKE '%_attribution_%' GROUP BY 1",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
