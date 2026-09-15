<?php
/** TEMP PS S1683t ac — read-only: petshop-rankos.php ranka()/busena_pasikeite() (40–108); katalogo publikavimo veiksmas (ajax?). */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tac'])) return; $l=explode("\n",file_get_contents(WPMU_PLUGIN_DIR.'/petshop-rankos.php')); $o=array('v'=>'ac','k'=>array_slice($l,40,68));
  $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-katalogas.php'); preg_match_all("/^.*(wp_ajax_ps_kat|post_status.*publish|'publish'.*post_status).*$/m",$s,$m); $o['kat']=array_slice(array_map(function($x){return substr(trim($x),0,200);},$m[0]),0,12);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
