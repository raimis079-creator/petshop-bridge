<?php
/** TEMP PS S1681 z — read-only: kur generuojamas surinkimo lapas ir jo CSS font-size. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681z'])) return; $o=array('v'=>'S1681 z');
  $files=array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(get_stylesheet_directory().'/{,*/,*/*/}*.{php,css}',GLOB_BRACE));
  foreach($files as $f){ $s=file_get_contents($f); if(stripos($s,'surinkimo lap')!==false||stripos($s,'surinkimo_lap')!==false){ $n=str_replace(ABSPATH,'',$f); preg_match_all('/^.*(surinkimo.lap|font-size|font:|@page|@media print).*$/mi',$s,$m); $o[$n]=array_slice(array_map(function($x){return substr(trim($x),0,200);},$m[0]),0,40); } }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
