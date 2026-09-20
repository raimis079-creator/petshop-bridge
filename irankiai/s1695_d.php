<?php
/** TEMP PS S1695 d — plan-attribution rašymo kontekstas; av-order/desk: ar praleidžia eilutę su esamu _ps_source; anketos-ataskaita skaitymas. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1695d'])) return; $o=array(); $C=WP_CONTENT_DIR;
  $ctx=function($f,$needle,$pries=25,$po=25) use($C){ $L=file($C.$f); $out=array(); foreach ($L as $i=>$l){ if (strpos($l,$needle)!==false){ $out[]=implode('',array_slice($L,max(0,$i-$pries),$pries+$po)); if (count($out)>=2) break; } } return $out; };
  $o['attr_md5']=md5_file("$C/plugins/petshop-core/includes/class-plan-attribution.php");
  $o['attr']=$ctx('/plugins/petshop-core/includes/class-plan-attribution.php',"add_meta_data( '_ps_source'",40,15);
  $o['attr_read']=$ctx('/plugins/petshop-core/includes/class-plan-attribution.php',"if ( ! \$item->get_meta( '_ps_source' ) )",10,20);
  $o['av_order']=$ctx('/mu-plugins/petshop-av-order.php',"update_meta_data( '_ps_source',",45,10);
  $o['desk_fiksuotas']=$ctx('/mu-plugins/petshop-desk.php','Fiksuotas _ps_source visada',3,25);
  $s=file_get_contents("$C/mu-plugins/petshop-anketos-ataskaita.php"); preg_match_all('/[^\n]{0,140}(_ps_source|ps_source|plan_dry|meta_key)[^\n]{0,140}/',$s,$m); $o['ataskaita']=array_slice(array_values(array_unique($m[0])),0,12);
  $o['av_order_md5']=md5_file("$C/mu-plugins/petshop-av-order.php"); $o['desk_md5']=md5_file("$C/mu-plugins/petshop-desk.php");
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
