<?php
/** TEMP PS S1683t g — read-only: darbalaukis eil. 700–740 (eilučių ciklas, $reduced, $v). */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tg'])) return; $l=explode("\n",file_get_contents(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php')); $o=array('v'=>'S1683t g','k'=>array());
  for($i=700;$i<=740;$i++) $o['k'][]=($i+1).': '.substr($l[$i],0,400);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
