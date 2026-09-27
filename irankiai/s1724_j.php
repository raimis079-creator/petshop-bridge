<?php
/** Plugin Name: TEMP PS S1724j recon: vf_sync closure vieta (Reflection), snippet'ai su vf_sync, stock rasymo kodas read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724j'])) return; $r=['v'=>'S1724j']; @set_time_limit(120); global $wpdb,$wp_filter; $P=$wpdb->prefix;
  try{
    if(isset($wp_filter['petshop_vf_sync_stock_hourly'])){ foreach($wp_filter['petshop_vf_sync_stock_hourly']->callbacks as $prio=>$fs){ foreach($fs as $k=>$f){ $fn=$f['function']; if($fn instanceof Closure){ $rf=new ReflectionFunction($fn); $r['closure']=['file'=>str_replace(ABSPATH,'',$rf->getFileName()),'nuo'=>$rf->getStartLine(),'iki'=>$rf->getEndLine()]; $file=$rf->getFileName(); if(preg_match('#eval\(\)\'d code#',$file)){ $r['closure']['eval']=true; } } } } }
    $sn=$wpdb->get_results("SELECT id,name,active,LENGTH(code) len FROM {$P}snippets WHERE code LIKE '%vf_sync%' OR code LIKE '%petshop_vf%'",ARRAY_A); $r['snippets']=$sn;
    foreach($sn as $s){ $code=$wpdb->get_var($wpdb->prepare("SELECT code FROM {$P}snippets WHERE id=%d",$s['id'])); $L=explode("\n",$code); $out=[]; foreach($L as $i=>$l){ if(preg_match('/stock_hourly|set_stock|_stock\b|wc_update_product_stock|update_post_meta|set_stock_status|->save\(|add_action|wp_schedule|function /',$l)) $out[]=($i+1).': '.mb_substr(trim($l),0,200); } $r['snippet_'.$s['id']]=array_slice($out,0,80); $r['snippet_'.$s['id'].'_head']=implode("\n",array_slice($L,0,25)); }
    // VF cache xml struktura (qty laukas)
    $x=wp_upload_dir()['basedir'].'/petshop-vf-cache.xml'; if(is_file($x)){ $h=fopen($x,'r'); $r['vf_xml_head']=fread($h,1200); fclose($h); $r['vf_xml_mtime']=date('m-d H:i',filemtime($x)); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
