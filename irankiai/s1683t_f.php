<?php
/** TEMP PS S1683t f — read-only: darbalaukio 'av_ok'/'av_qty'/'reduced' skaičiavimas ir „Trūksta sandėlyje" sąlyga. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tf'])) return; $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); $o=array('v'=>'S1683t f','md5'=>md5($s),'dydis'=>strlen($s)); preg_match('/Version:\s*([\d.]+)/i',$s,$m); $o['ver']=$m[1]??'';
  $l=explode("\n",$s); foreach($l as $i=>$ln) if(preg_match("/'av_ok'\s*=>|\\\$av_ok\s*=|Trūksta sandėlyje|'av_qty'\s*=>|\\\$av_qty\s*=|mnm|mix-and-match/i",$ln)) $o['eil'][]=($i+1).': '.substr(trim($ln),0,330);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
