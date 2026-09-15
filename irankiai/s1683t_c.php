<?php
/** TEMP PS S1683 c — read-only: petshop-partijos.php — visos foreach per užsakymo eilutes (kontekstas ±6 eil.), versija, md5. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683c'])) return; $f=WPMU_PLUGIN_DIR.'/petshop-partijos.php'; $s=file_get_contents($f); $o=array('v'=>'S1683 c','md5'=>md5($s),'dydis'=>strlen($s));
  preg_match('/Version:\s*([\d.]+)/i',$s,$m); $o['ver']=$m[1]??''; $l=explode("\n",$s);
  foreach($l as $i=>$ln) if(preg_match('/foreach\s*\(\s*\$\w+->get_items\(\)/',$ln)) $o['blokai'][]=array('nuo'=>$i+1,'kodas'=>array_slice($l,$i,9));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
