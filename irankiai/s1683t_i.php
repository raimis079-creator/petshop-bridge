<?php
/** TEMP PS S1683t i — read-only: petshop-desk.php klausimas() 1224–1290. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683ti'])) return; $l=explode("\n",file_get_contents(WPMU_PLUGIN_DIR.'/petshop-desk.php')); $o=array('v'=>'i','k'=>array());
  for($i=1223;$i<=1290;$i++) $o['k'][]=($i+1).': '.substr($l[$i],0,260);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
