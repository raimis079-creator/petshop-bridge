<?php
/** Plugin Name: TEMP PS S1724m recon: class-fulfillment.php 1-125 (recalculate, set_wc_stock) read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724m'])) return; $r=['v'=>'S1724m'];
  try{ $f=WP_PLUGIN_DIR.'/petshop-xml/includes/class-fulfillment.php'; $L=file($f); $r['eil']=count($L); $r['kodas']=implode('',array_map(function($i) use($L){ return ($i+1).': '.$L[$i]; },range(0,min(count($L)-1,125)))); }
  catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
