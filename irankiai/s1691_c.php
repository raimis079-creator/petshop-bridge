<?php
/** TEMP PS S1691 c — php_error.log sudėtis per visą failą (pilnas skenas eilutėmis), pavyzdinės pilnos eilutės. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691c'])) return; $o=array();
  $pl=dirname(ABSPATH).'/logs/php_error.log'; $fh=fopen($pl,'r'); $dien=array(); $tip=array(); $pvz=array(); $n=0;
  while (($ln=fgets($fh))!==false){ $n++; if (preg_match('/^\[(\d\d-\w{3}-\d{4})/',$ln,$m)) $dien[$m[1]]=($dien[$m[1]]??0)+1;
    $k=preg_replace('/^\[[^\]]+\]\s*/','',$ln); $k=preg_replace('/\d+/','#',$k); $k=preg_replace("/'[^']*'/","'…'",$k); $k=mb_substr($k,0,90); $tip[$k]=($tip[$k]??0)+1;
    if (!isset($pvz[$k]) && (strpos($ln,'Duplicate entry')!==false || strpos($ln,'Undefined array key')!==false || strpos($ln,'petshop-xml')!==false || strpos($ln,'could_not_set')!==false)) $pvz[$k]=mb_substr($ln,0,700); }
  fclose($fh); arsort($tip);
  $o['eiluciu']=$n; $o['dienos']=$dien; $o['tipai_top20']=array_slice($tip,0,20,true); $o['pvz']=$pvz;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
