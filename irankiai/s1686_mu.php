<?php
/** TEMP PS S1686 mu — READ-ONLY: Feeding_Service::calc() (kaip svetainė) išvesties forma — 18159/20, 18587/30 (out of range), 18587/8. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mu'])) return; $o=array('v'=>'S1686 mu');
  foreach(array(array(18159,20,'dog'),array(18587,30,'dog'),array(18587,8,'dog'),array(17992,5,'cat')) as $c){ $r=Petshop_Feeding_Service::calc(array('product_id'=>$c[0],'weight_kg'=>$c[1],'species_code'=>$c[2])); $o[$c[0].'/'.$c[1]]=$r; }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
