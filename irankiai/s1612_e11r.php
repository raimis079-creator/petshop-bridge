<?php
/** TEMP PS S1612 run e11r — R: petshop-dropship-sargas.php logika (V13) — tik skaitymas */
add_action('init', function(){
  if (!isset($_GET['ps_e11r'])) return;
  $o=array('v'=>'run e11r'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $c=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-dropship-sargas.php'); $o['bytes']=strlen($c); $o['kodas']=mb_substr($c,0,6000);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
