<?php
/** Plugin Name: TEMP PS S1721p read-only: Ryto sargo patikros() irasai (seimos lempute) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721p'])) return; $r=['v'=>'S1721p'];
  try{ $m=new ReflectionMethod('Petshop_Rytas','patikros'); $m->setAccessible(true); $out=$m->invoke(null);
    foreach((array)$out as $i=>$e){ $r['irasai'][]=is_array($e)?array_map(function($v){return is_string($v)?mb_substr($v,0,90):$v;},$e):$e; }
    $r['auto_log']=get_option('ps_dydziai_auto_log'); $r['kandidatai']=get_option('ps_dydziai_kandidatai');
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
