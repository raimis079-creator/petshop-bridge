<?php
/** Plugin Name: TEMP PS S1721j read-only: Feeding_Service::calc atsakymas 18590 w=8 (kodel dienos tuscios) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721j'])) return; $r=['v'=>'S1721j'];
  try{
    $r['class']=class_exists('Feeding_Service'); $r['classes']=array_values(array_filter(get_declared_classes(),function($c){return stripos($c,'feeding')!==false;}));
    if(class_exists('Feeding_Service')){ foreach([['product_id'=>18590,'weight_kg'=>8,'species_code'=>'dog'],['product_id'=>18590,'weight_kg'=>8.0,'species_code'=>'dog','activity'=>'normal']] as $in){ $c=Feeding_Service::calc($in); $r['calc'][]=json_decode(mb_substr(json_encode($c,JSON_UNESCAPED_UNICODE),0,1800),true); }
      $ev=Feeding_Service::evaluate(['product_id'=>18590,'weight_kg'=>8,'species_code'=>'dog']); $r['evaluate']=json_decode(mb_substr(json_encode($ev,JSON_UNESCAPED_UNICODE),0,1500),true); }
    $core=WP_PLUGIN_DIR.'/petshop-core/includes/class-product-calc.php'; $s=file_get_contents($core); preg_match_all('#[^\n]{0,200}(Feeding_Service::|feeding-calc|register_rest_route|function rest_|\$in\s*=|weight_kg)[^\n]{0,240}#',$s,$m); $r['calc_php']=array_slice(array_map('trim',$m[0]),0,20);
    foreach(glob(WP_PLUGIN_DIR.'/petshop-core/includes/*.php') as $f){ $s=file_get_contents($f); if(strpos($s,"'feeding-calc'")!==false||strpos($s,'feeding-calc')!==false){ preg_match_all('#[^\n]{0,200}(feeding-calc|Feeding_Service::calc|Feeding_Service::evaluate|get_json_params|get_param)[^\n]{0,240}#',$s,$m); $r['rest'][basename($f)]=array_slice(array_map('trim',$m[0]),0,16); } }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
