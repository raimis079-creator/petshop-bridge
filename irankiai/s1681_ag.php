<?php
/** TEMP PS S1681 ag — read-only: darbalaukio issiusta() kūnas ir kvietimo vieta. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681ag'])) return; $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); $o=array('v'=>'S1681 ag');
  $i=strpos($s,'function issiusta('); $o['fn']=substr($s,$i-120,2600);
  preg_match_all('/^.*self::issiusta\(.*$/m',$s,$m); $o['calls']=array_map(function($x){return substr(trim($x),0,300);},$m[0]);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
