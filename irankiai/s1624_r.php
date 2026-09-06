<?php
/** TEMP PS S1624 r — RECON: dropship laisko_html() pastabos vieta, tiekimo uzsakyti() body. */
add_action('init', function(){
  if (!isset($_GET['ps_r8'])) return;
  $o=array('v'=>'S1624 r'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $L=explode("\n",(string)file_get_contents(WPMU_PLUGIN_DIR.'/petshop-av-dropship.php')); $r=array(); for($i=950;$i<1004;$i++){ $r[]=($i+1).': '.mb_substr(rtrim($L[$i]),0,220); } $o['laisko_html']=$r;
  $L2=explode("\n",(string)file_get_contents(WPMU_PLUGIN_DIR.'/petshop-av-tiekimas.php')); $r2=array(); for($i=1170;$i<1182;$i++){ $r2[]=($i+1).': '.mb_substr(rtrim($L2[$i]),0,260); } $o['tiek_body']=$r2;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
