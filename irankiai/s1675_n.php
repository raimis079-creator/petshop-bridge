<?php
/** TEMP PS S1675 run n — STAGE2_AFTER reikšmė. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_n5'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1675 n');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $c=file_get_contents(WP_PLUGIN_DIR.'/petshop-core/includes/class-cart-abandonment.php'); preg_match_all('/const\s+\w+\s*=\s*[^;]+;[^\n]*/',$c,$m); $o['const']=$m[0];
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
