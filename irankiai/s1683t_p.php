<?php
/** TEMP PS S1683t p — read-only: darbalaukio „Kaip atkeliaus į AV / svoris / dėžių" laukas (render + apdorojimas), tiekimo 1060–1080; partija #23 pilnai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tp'])) return; global $wpdb; $o=array('v'=>'p');
  $l=explode("\n",file_get_contents(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php')); foreach($l as $i=>$ln) if(preg_match('/Kaip atkeliaus į AV|name="dezes"|name="svoris"|\$_POST\[.dezes.\]|\$_POST\[.svoris.\]/',$ln)) $o['dl'][]=($i+1).': '.substr(trim($ln),0,700);
  $t=explode("\n",file_get_contents(WPMU_PLUGIN_DIR.'/petshop-av-tiekimas.php')); for($i=1062;$i<=1082;$i++) $o['tk'][]=($i+1).': '.substr($t[$i],0,300);
  $o['p23']=$wpdb->get_row("SELECT * FROM {$wpdb->prefix}ps_partijos WHERE id=23",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
