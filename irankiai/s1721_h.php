<?php
/** Plugin Name: TEMP PS S1721h recon read-only: feeding-calc REST atsakymas, Feeding_Service API, pet svoris prisijungusiam, katalogo ajax_seima, product-calc.js rezultato kablys */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721h'])) return; $f=$_GET['ps_s1721h']; $r=['v'=>'S1721h']; @set_time_limit(120); $mu=WPMU_PLUGIN_DIR; $core=WP_PLUGIN_DIR.'/petshop-core';
  $grep=function($file,$pat,$ctx=160,$max=14){ if(!is_file($file)) return 'NERA'; $s=file_get_contents($file); preg_match_all('#[^\n]{0,'.$ctx.'}('.$pat.')[^\n]{0,'.$ctx.'}#',$s,$m); return array_slice(array_map(function($x){return mb_substr(trim($x),0,420);},$m[0]),0,$max); };
  try{
    $r['calc_rest']=$grep($core.'/includes/class-product-calc.php','register_rest_route|feeding-calc|PSPetConfig|\'rest\'|\'account\'|\'pets\'|species|function ',200,30);
    foreach(glob($core.'/includes/*.php') as $ph){ $s=file_get_contents($ph); if(strpos($s,"feeding-calc")!==false) $r['rest_files'][]=basename($ph); if(preg_match('/class\s+\w*Feeding_Service/',$s)) $r['fs_file']=basename($ph); }
    $fs=$core.'/includes/class-feeding-service.php'; $s=file_get_contents($fs); preg_match('/^(namespace\s+[^;]+;)/m',$s,$ns); $r['fs_ns']=$ns[1]??''; preg_match_all('#(public|private|protected)?\s*(static )?function (\w+)\s*\(([^)]*)\)#',$s,$m); $r['fs_fns']=array_map(function($a,$b){return $a.'('.mb_substr($b,0,90).')';},$m[3],$m[4]);
    $r['fs_calc']=$grep($fs,'function calc\b|function evaluate|\'days_min|\'days_max|days_min|days_max|grams_per_day|\'gpd|\'range|\'min\'|\'max\'|status|needs_input|WEIGHT_OUT',200,30);
    foreach(glob($core.'/includes/*.php') as $ph){ $s=file_get_contents($ph); if(preg_match('#feeding-calc#',$s)){ $r['rest_cb'][basename($ph)]=$grep($ph,'feeding-calc|function handle_calc|function calc_endpoint|rest_ensure_response|WP_REST_Response|\$out\[|\'result\'|\'days',200,25); } }
    $r['pet_fns']=$grep($core.'/includes/class-pet-profile.php','public static function (get|pets|for_user|current|list|by_user|find)\w*|current_weight_kg',160,20);
    $r['pet_ui']=$grep($core.'/includes/class-pet-ui.php','public static function \w+',100,20);
    $r['js_result']=$grep($core.'/assets/product-calc.js','ps-calc-res|CustomEvent|dispatchEvent|function render|lastWeight =|res\.|data\.days|days',160,30);
    $r['katalogas_seima']=$grep($mu.'/petshop-katalogas.php','function ajax_seima',10,1); $s=file_get_contents($mu.'/petshop-katalogas.php'); if(($i=strpos($s,'function ajax_seima'))!==false) $r['katalogas_seima_body']=mb_substr($s,$i,1800);
    $r['species_meta']=[get_post_meta(18590,'_ps_species',true), wp_get_object_terms(18590,'pa_gyvuno_rusis',['fields'=>'slugs'])];
    // REST calc gyvai
    $rq=new WP_REST_Request('POST','/petshop/v1/feeding-calc'); $rq->set_body_params(['product_id'=>18590,'weight_kg'=>8,'species_code'=>'dog']); $rs=rest_do_request($rq); $r['rest_try']=['status'=>$rs->get_status(),'data'=>json_decode(mb_substr(json_encode($rs->get_data(),JSON_UNESCAPED_UNICODE),0,1500),true)];
    if($rs->get_status()>=400){ $srv=rest_get_server(); $routes=array_keys($srv->get_routes()); $r['routes']=array_values(array_filter($routes,function($x){return strpos($x,'feeding')!==false||strpos($x,'pet')!==false;})); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
