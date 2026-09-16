<?php
/** TEMP PS S1688 mc — RECON: petshop-pakartoti.php grupe() 55 eil. pilna + šablono refill-pakartoti.php naudojami raktai; md5 abiejų failų. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688mc'])) return; $o=array('v'=>'S1688 mc');
  $f=WPMU_PLUGIN_DIR.'/petshop-pakartoti.php'; $L=file($f); $o['md5_pakartoti']=md5_file($f); $o['l55']=trim($L[54]); $o['l30']=trim($L[29]);
  foreach($L as $i=>$l) if(preg_match("/'kasa'|'data'|grupe\(/",$l)) $o['grupe_naud'][]=($i+1).': '.trim(mb_substr($l,0,200));
  $t=WPMU_PLUGIN_DIR.'/ps-sablonai/refill-pakartoti.php'; $o['md5_sablonas']=md5_file($t); preg_match_all("/\\\$g\\['(\\w+)'\\]|\\\$grupe\\['(\\w+)'\\]|\\['(prekes|nera|suma|data|kasa|order_id)'\\]/",file_get_contents($t),$m); $o['sablono_raktai']=array_values(array_unique(array_filter(array_merge($m[1],$m[2],$m[3]))));
  $o['md5_relaunch']=md5_file(WPMU_PLUGIN_DIR.'/petshop-relaunch.php');
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
