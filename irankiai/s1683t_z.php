<?php
/** TEMP PS S1683t z — read-only: petshop-rankos.php antraštė + vartai() (100–150). */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tz'])) return; $l=explode("\n",file_get_contents(WPMU_PLUGIN_DIR.'/petshop-rankos.php')); $o=array('v'=>'z','antr'=>array_slice($l,0,30),'vartai'=>array_slice($l,108,45));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
