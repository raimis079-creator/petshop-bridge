<?php
/** Plugin Name: TEMP PS S1736n snippet psc_daugiau_pigiau (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1736n'])) return;
  $f=$_GET['ps_s1736n']; @set_time_limit(200); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1736n','faze'=>$f];
  try{
  if($f==='1'){ foreach($wpdb->get_results("SELECT id,name,active,modified,code FROM {$P}snippets WHERE code LIKE '%psc_daugiau_pigiau%' AND name NOT LIKE 'TEMP%'",ARRAY_A) as $s){ $r['snip'][]=['id'=>$s['id'],'name'=>$s['name'],'active'=>$s['active'],'mod'=>$s['modified'],'md5'=>md5($s['code']),'code'=>$s['code']]; } }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
