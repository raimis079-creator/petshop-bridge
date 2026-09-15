<?php
/** TEMP PS S1686 mj v2 — READ-ONLY (be evaluate kvietimo — fatal): (1) product-calc.js — svorio įvestis, localStorage, init; (2) feeding-calc REST — permission_callback (svečias?); (3) Feeding_Service::evaluate parašas ir pavyzdinis skaičiavimas 3 svoriams; (4) Feeding_UI render vieta. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mj'])) return; $o=array('v'=>'S1686 mj'); $core=WP_PLUGIN_DIR.'/petshop-core';
  $J=file("$core/assets/product-calc.js"); $o['js_n']=count($J); foreach($J as $i=>$l) if(preg_match('/localStorage|sessionStorage|querySelector|addEventListener|weight|svoris|function |const [A-Z]|fetch\(|location\.|URLSearchParams|ps_pet_draft|value\s*=/i',$l)) $o['js'][]=($i+1).': '.trim(mb_substr($l,0,150));
  $o['js']=array_slice($o['js'],0,90);
  $R=file(WPMU_PLUGIN_DIR.'/petshop-feeding-calc-rest.php'); $o['rest']=implode("\n",array_map('trim',array_slice($R,171,30)));
  $S=file("$core/includes/class-feeding-service.php"); foreach($S as $i=>$l) if(preg_match('/public static function/',$l)) $o['svc'][]=($i+1).': '.trim($l);
  $o['svc_evaluate']=implode("\n",array_map('trim',array_slice($S,20,50)));
  $U=file("$core/includes/class-feeding-ui.php"); foreach($U as $i=>$l) if(preg_match('/add_action|add_filter|function |input|data-/',$l)) $o['ui'][]=($i+1).': '.trim(mb_substr($l,0,150));
  $o['svc_100_135']=implode("\n",array_map('trim',array_slice($S,95,45)));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
