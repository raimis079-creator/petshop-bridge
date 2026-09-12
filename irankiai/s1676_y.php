<?php
/** TEMP PS S1676 run y — petshop-fakt-siuntos.php: nakties_sutikrinimas ir is_desko šaltiniai; pilnas failas b64. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676y'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 y');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $f=WPMU_PLUGIN_DIR.'/petshop-fakt-siuntos.php'; $s=file_get_contents($f); $o['md5']=md5($s); $o['b64']=base64_encode($s);
  $L=explode("\n",$s); $o['s600_800']=implode("\n",array_slice($L,599,230));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
