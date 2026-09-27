<?php
/** Plugin Name: TEMP PS S1728mc read-only: parinkti() + misrus */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1728mc'])) return; $r=['v'=>'S1728mc'];
  try{
    foreach([['Petshop_AV_Source','parinkti'],['Petshop_AV_Order','fiksuoti']] as $m){ if(!method_exists($m[0],$m[1])) { $r[$m[1]]='nėra'; continue; } $rf=new ReflectionMethod($m[0],$m[1]); $s=file($rf->getFileName()); $r[$m[1]]=implode('',array_slice($s,$rf->getStartLine()-1,$rf->getEndLine()-$rf->getStartLine()+1)); }
    $f=WPMU_PLUGIN_DIR.'/petshop-av-order.php'; $s=file($f); $r['av_order_40_100']=implode('',array_slice($s,39,62));
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
}, 1);
