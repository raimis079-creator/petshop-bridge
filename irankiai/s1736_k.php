<?php
/** Plugin Name: TEMP PS S1736k Rinkinių lango šaltinis + meniu (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1736k'])) return;
  $f=$_GET['ps_s1736k']; @set_time_limit(200); $r=['v'=>'S1736k','faze'=>$f];
  try{
  if($f==='1'){
    foreach(['petshop-rinkiniai.php'] as $fn){ $fp=WPMU_PLUGIN_DIR.'/'.$fn; if(file_exists($fp)){ $c=file_get_contents($fp); $r['src'][$fn]=['md5'=>md5($c),'gz'=>base64_encode(gzcompress($c,9))]; } else $r['nera'][]=$fn; }
    $r['kesas_dp']=glob(WP_CONTENT_DIR.'/cache/supercache/petshop.lt/kategorija/daugiau-pigiau*');
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
