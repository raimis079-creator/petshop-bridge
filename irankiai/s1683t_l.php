<?php
/** TEMP PS S1683t l — read-only: #1053 darbalaukio faktai() (kas rodoma kortelėje, klaidos/blokai), partijų meta, lapo eilutės. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tl'])) return; global $wpdb; $o=array('v'=>'S1683t l'); $w=wc_get_order(35955);
  $r=new ReflectionMethod('Petshop_Darbalaukis','zurnalas'); $r->setAccessible(true); $z=$r->invoke(null,array(35955));
  $r=new ReflectionMethod('Petshop_Darbalaukis','faktai'); $r->setAccessible(true); $f=$r->invoke(null,$w,$z);
  foreach($f as $k=>$v){ if(is_scalar($v)||is_null($v)) $o['f'][$k]=$v; else $o['f'][$k]=substr(json_encode($v,JSON_UNESCAPED_UNICODE),0,400); }
  $o['partijos_meta']=array_filter(array_map(function($m){return preg_match('/partij|ispej|klaid/i',$m->key)?$m->key.'='.substr(json_encode($m->value,JSON_UNESCAPED_UNICODE),0,200):null;},$w->get_meta_data()));
  $o['part_lent']=$wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->prefix}ps_partiju_judejimai WHERE uzsakymas_id=%d",35955),ARRAY_A);
  if(!$o['part_lent']) foreach($wpdb->get_results("SHOW TABLES LIKE '{$wpdb->prefix}ps_partij%'",ARRAY_N) as $t) $o['part_lentos'][]=$t[0];
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
