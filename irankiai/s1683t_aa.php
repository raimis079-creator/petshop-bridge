<?php
/** TEMP PS S1683t aa — read-only: darbalaukio „Parašyti klientui" — nuoroda/veiksmas/dialogas, apdorojimas; paskutinės php klaidos. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683taa'])) return; $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); $o=array('v'=>'aa'); $l=explode("\n",$s);
  foreach($l as $i=>$ln) if(preg_match('/Parašyti klientui|parasyti_klientui|laiskas_klientui|rasyti_klientui|mailto:/',$ln)) $o['eil'][]=($i+1).': '.substr(trim($ln),0,500);
  $lg=ABSPATH.'../logs/php_error.log'; if(file_exists($lg)){ $a=file($lg); $o['log']=array_map(function($x){return substr($x,0,220);},array_slice(array_filter($a,function($x){return strpos($x,'15-Sep-2026 1')!==false;}),-8)); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
