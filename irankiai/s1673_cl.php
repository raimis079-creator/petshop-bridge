<?php
/** Plugin Name: TEMP PS S1673 custom labels */
add_action('init', function(){ if(!isset($_GET['ps_cl'])||$_GET['ps_cl']!=='GO') return;
  header('Content-Type: application/json; charset=utf-8'); $o=array();
  $c=file_get_contents(WP_CONTENT_DIR.'/uploads/petshop-feeds/google.xml');
  foreach(array(0,1,2,3,4) as $n){ preg_match_all('#<g:custom_label_'.$n.'>(.*?)</g:custom_label_'.$n.'>#s',$c,$m); $v=array_count_values(array_map('trim',$m[1])); arsort($v); $o['cl'.$n]=array_slice($v,0,25,true); $o['cl'.$n.'_viso']=count($m[1]); }
  preg_match_all('#<g:brand>(.*?)</g:brand>#s',$c,$m); $v=array_count_values(array_map('trim',$m[1])); arsort($v); $o['brand']=array_slice($v,0,30,true);
  preg_match_all('#<g:product_type>(.*?)</g:product_type>#s',$c,$m); $v=array_count_values(array_map(function($x){return trim(html_entity_decode($x));},$m[1])); arsort($v); $o['product_type']=array_slice($v,0,30,true);
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; });
