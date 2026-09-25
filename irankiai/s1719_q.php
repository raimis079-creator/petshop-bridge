<?php
/** Plugin Name: TEMP PS S1719q — recon: snippet 5323 kodas, petshop-rytas.php struktūra (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719q'])) return; $r=['v'=>'S1719q']; global $wpdb; $p=$wpdb->prefix;
  try{ $r['snip5323']=$wpdb->get_var("SELECT code FROM {$p}snippets WHERE id=5323");
    $c=file_get_contents(WP_CONTENT_DIR.'/mu-plugins/petshop-rytas.php'); $r['rytas_head']=substr($c,0,1800); preg_match_all('/^\s*(public |private |protected )?(static )?function\s+(\w+)\s*\([^)]*\)/m',$c,$m); $r['rytas_fn']=$m[3];
    preg_match_all('/[^\n]{0,100}(raudon|gelton|zali|lemput|neissiusti|Neišsiųsti)[^\n]{0,100}/i',$c,$m2); $r['rytas_lemputes']=array_slice(array_unique(array_map('trim',$m2[0])),0,30);
    $r['rytas_pask']=get_option('ps_rytas_sargas_pask');
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},1);
