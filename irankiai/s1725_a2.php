<?php
/** Plugin Name: TEMP PS S1725a2 read-only: kaina24/kainos feed formatas ir DP pakai juose, snippet 572 scope */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1725a2'])) return; $r=['v'=>'S1725a2']; global $wpdb; $P=$wpdb->prefix;
  try{
    $pk=$wpdb->get_results("SELECT p.ID,p.post_name FROM {$P}posts p JOIN {$P}postmeta b ON b.post_id=p.ID AND b.meta_key='_dp_base_product_id' AND b.meta_value<>'' WHERE p.post_type='product'",ARRAY_A);
    $up=wp_upload_dir()['basedir'].'/petshop-feeds/';
    foreach(['google.xml','kaina24.xml','kainos.xml'] as $fn){ $fx=$up.$fn; if(!is_file($fx)) continue; $s=file_get_contents($fx);
      preg_match_all('#<([a-zA-Z_:]+)[ >]#',substr($s,0,4000),$m); $tags=array_count_values($m[1]);
      $hit=[]; foreach($pk as $x){ if(strpos($s,'/'.$x['post_name'].'/')!==false || strpos($s,'/'.rawurlencode($x['post_name']).'/')!==false || preg_match('#>'.$x['ID'].'<#',$s)) $hit[]=$x['ID']; }
      $r[$fn]=['dydis'=>strlen($s),'pradzia'=>mb_substr($s,0,700),'tagai'=>$tags,'pakai_rasti'=>$hit,'exclusion_2vnt'=>substr_count($s,'2 vnt. Exclusion')]; }
    $r['snip572']=$wpdb->get_row("SELECT id,scope,active,priority FROM {$P}snippets WHERE id=572",ARRAY_A);
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
