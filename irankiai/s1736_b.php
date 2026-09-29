<?php
/** Plugin Name: TEMP PS S1736b VF laiško šaltiniai (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1736b'])) return;
  $f=$_GET['ps_s1736b']; @set_time_limit(200); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1736b','faze'=>$f];
  try{
  if($f==='1'){
    foreach(['petshop-av-dropship.php','petshop-av-tiekimas.php'] as $fn){ $fp=WPMU_PLUGIN_DIR.'/'.$fn; $c=file_get_contents($fp); $r['src'][$fn]=['md5'=>md5($c),'len'=>strlen($c),'gz'=>base64_encode(gzcompress($c,9))]; }
    $r['pastai']=get_option('ps_tiekeju_pastai');
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
