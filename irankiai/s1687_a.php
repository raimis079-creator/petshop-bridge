<?php
/** TEMP PS S1687 a — READ-ONLY: Ads būklė — ps_fakt_reklama paskutinės 10 d. pagal dieną/kampaniją (išlaidos, klikai, konversijos, vertė, atnaujinta_at); WC užsakymai iš Ads (gclid) per dieną 09-08…09-16 su suma; ar 09-16 02:01 atnaujinimas įvyko. */
add_action('init', function(){
  if (!isset($_GET['ps_s1687a'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1687 a');
  $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_reklama");
  $o['reklama']=$wpdb->get_results("SELECT * FROM {$p}ps_fakt_reklama WHERE diena>=CURDATE()-INTERVAL 10 DAY ORDER BY diena DESC, kampanija LIMIT 60",ARRAY_A);
  $o['wc_ads']=$wpdb->get_results("SELECT DATE(apmoketa_at) d, COUNT(*) n, ROUND(SUM(suma_ct)/100,2) eur FROM {$p}ps_fakt_uzsakymai WHERE gclid IS NOT NULL AND gclid<>'' AND testinis=0 AND apmoketa_at>=CURDATE()-INTERVAL 8 DAY GROUP BY d ORDER BY d",ARRAY_A);
  $o['wc_visi']=$wpdb->get_results("SELECT DATE(apmoketa_at) d, COUNT(*) n, ROUND(SUM(suma_ct)/100,2) eur FROM {$p}ps_fakt_uzsakymai WHERE testinis=0 AND apmoketa_at>=CURDATE()-INTERVAL 8 DAY GROUP BY d ORDER BY d",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
