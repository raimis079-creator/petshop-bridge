<?php
/** TEMP PS S1685 mk — RECON read-only: kaip renderinamas šablonas (dispatch render, laiskai override, Layout::wrap footer/opt-out), filtrai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685mk'])) return; $o=array('v'=>'S1685 mk');
  $d=file_get_contents(WP_PLUGIN_DIR.'/petshop-core/includes/class-email-dispatch.php'); preg_match_all('/apply_filters\(\s*\'[^\']+\'[^;]{0,200}/',$d,$m); $o['dispatch_filters']=array_unique($m[0]);
  $i=strpos($d,'templates/emails'); $o['dispatch_render']=substr($d,max(0,$i-1800),2600);
  foreach(glob(WP_PLUGIN_DIR.'/petshop-core/includes/*.php') as $f){ if(strpos(file_get_contents($f),'class Petshop_Email_Layout')!==false){ $l=file_get_contents($f); $j=strpos($l,'function wrap'); $o['layout_wrap']=substr($l,$j,3200); $k=strpos($l,'function button'); $o['layout_button']=substr($l,$k,700); } }
  $la=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-laiskai.php'); preg_match_all('/add_filter\(\s*\'[^\']+\'[^;]{0,120}/',$la,$m2); $o['laiskai_filters']=$m2[0]; $j=strpos($la,'published'); $o['laiskai_ctx']=substr($la,max(0,$j-800),1600);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
