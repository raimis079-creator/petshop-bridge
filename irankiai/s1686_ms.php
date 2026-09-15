<?php
/** TEMP PS S1686 ms — READ-ONLY: ps_relaunch_prekes 'product' būsenos priežastys — calc_issue pasiskirstymas, ar prekė turi feeding_map, rūšis; pavyzdžiai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686ms'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1686 ms'); $c=get_option('ps_relaunch_prekes',array()); $st=array(); $pvz=array();
  foreach($c as $pid=>$d){ if($d['busena']!=='product') continue; $map=(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$p}ps_feeding_map WHERE product_id=%d AND is_active=1",$pid)); $k=($d['rusis']?:'-').'|'.($map?'map':'nomap').'|'.($d['calc_issue']??'-'); $st[$k]=($st[$k]??0)+1; if(count($pvz)<6 && $map) $pvz[]=$pid.' '.$d['pav'].' → '.($d['calc_issue']??'?'); }
  arsort($st); $o['stat']=$st; $o['pvz']=$pvz;
  $pid=array_key_first(array_filter($c,function($x){return $x['busena']==='product'&&isset($x['calc_issue'])&&$x['calc_issue']==='needs_input';})); if($pid){ $r=Petshop_Feeding_Service::evaluate(array('product_id'=>$pid,'quantity'=>1,'pet_input'=>array('current_weight_kg'=>20,'conditions'=>array()))); $o['needs_input_pvz']=array($pid,$r['issues'],$r['meta']??null); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
