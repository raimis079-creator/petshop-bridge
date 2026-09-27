<?php
/** Plugin Name: TEMP PS S1724k recon: snippet 565 petshop_vf_sync_stock kodas (263-360) + closure (550-570) read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724k'])) return; $r=['v'=>'S1724k']; global $wpdb; $P=$wpdb->prefix;
  try{
    $code=$wpdb->get_var("SELECT code FROM {$P}snippets WHERE id=565"); $L=explode("\n",$code); $r['eil']=count($L); $r['md5']=md5($code);
    $r['stock_fn']=implode("\n",array_map(function($i) use($L){ return ($i+1).': '.$L[$i]; },range(262,min(count($L)-1,361))));
    $r['closure']=implode("\n",array_map(function($i) use($L){ return ($i+1).': '.$L[$i]; },range(552,min(count($L)-1,572))));
    $r['last_run']=get_option('petshop_vf_stock_last_run');
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
