<?php
/** TEMP PS S1688 mh — gyvų failų kopijos į repo (base64 JSON'e): petshop-pakartoti.php v1.1.6, petshop-lifecycle-vartai.php v1.2.2, petshop-relaunch.php v1.1.0. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688mh'])) return; $o=array('v'=>'S1688 mh');
  foreach(array('petshop-pakartoti.php','petshop-lifecycle-vartai.php','petshop-relaunch.php') as $f){ $p=WPMU_PLUGIN_DIR.'/'.$f; $o[$f]=array('md5'=>md5_file($p),'b64'=>base64_encode(file_get_contents($p))); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o); exit;
});
