<?php
/** TEMP PS S1681 h — read-only: GSC paspaudimai per dieną 09-09…, srauto vardikliui. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681h'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 h');
  $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_gsc_dienos");
  $o['gsc']=$wpdb->get_results("SELECT * FROM {$p}ps_fakt_gsc_dienos WHERE diena>='2026-09-06' ORDER BY diena",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
