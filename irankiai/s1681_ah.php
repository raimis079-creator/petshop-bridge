<?php
/** TEMP PS S1681 ah — read-only: darbalaukio siuntos() ir faktai() 'siunta'/'nr' logika LP atveju; lp_lipdukas() kas rašo fakt. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681ah'])) return; $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); $o=array('v'=>'S1681 ah');
  $i=strpos($s,'function siuntos('); $o['siuntos']=substr($s,$i,2200);
  preg_match_all("/^.*'siunta'\s*=>.*$/m",$s,$m); $o['siunta_eil']=array_map(function($x){return substr(trim($x),0,350);},$m[0]);
  $i=strpos($s,'function lp_lipdukas('); $o['lp_lipdukas']=substr($s,$i,3200);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
