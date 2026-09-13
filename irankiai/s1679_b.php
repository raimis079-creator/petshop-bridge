<?php
/** TEMP PS S1679 b — read-only: Ads būklė (pataisyti stulpeliai). */
add_action('init', function(){
  if (!isset($_GET['ps_s1679b'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1679 b');
  $o['reklama']=$wpdb->get_results("SELECT diena,kampanija,islaidos_ct/100 isl,paspaudimai klik,konversijos konv,konv_verte_ct/100 kv FROM {$p}ps_fakt_reklama WHERE diena>=DATE_SUB(CURDATE(),INTERVAL 6 DAY) ORDER BY diena,kampanija",ARRAY_A);
  $o['err1']=$wpdb->last_error;
  $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_uzsakymai");
  $o['siandien']=$wpdb->get_results("SELECT order_id,statusas_galutinis s,viso_ct/100 v,gclid<>'' g,utm_source src,utm_campaign kamp,sukurta_at FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND sukurta_at>=DATE_SUB(NOW(),INTERVAL 2 DAY) ORDER BY sukurta_at",ARRAY_A);
  $o['err2']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
