<?php
/** Plugin Name: TEMP PS S1736c VF kodai ir laiško kvietėjai (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1736c'])) return;
  $f=$_GET['ps_s1736c']; @set_time_limit(200); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1736c','faze'=>$f];
  try{
  if($f==='1'){
    $pat=['laisko_html','laisko_dalis','ps_dropship_send','Petshop_AV_Dropship::siusti'];
    $files=glob(WPMU_PLUGIN_DIR.'/*.php');
    foreach($files as $fp){ $L=@file($fp); if(!$L) continue; foreach($L as $i=>$ln){ foreach($pat as $p){ if(strpos($ln,$p)!==false){ $r['hits'][]=basename($fp).':'.($i+1).' ['.$p.'] '.mb_substr(trim($ln),0,200); break; } } } }
    $t=$P.'ps_sources'; $r['cols']=$wpdb->get_col("SHOW COLUMNS FROM $t");
    $rows=$wpdb->get_results("SELECT s.product_id,s.supplier_sku,pm.meta_value sku FROM $t s LEFT JOIN {$P}postmeta pm ON pm.post_id=s.product_id AND pm.meta_key='_sku' WHERE s.source='vf'",ARRAY_A);
    $same=0;$diff=[];$empty=0; foreach($rows as $x){ if((string)$x['supplier_sku']==='') {$empty++; continue;} if(strcasecmp(trim($x['supplier_sku']),trim((string)$x['sku']))===0) $same++; else $diff[]=$x; }
    $r['vf']=['viso'=>count($rows),'sutampa'=>$same,'tuscias_supplier_sku'=>$empty,'skiriasi_n'=>count($diff),'skiriasi'=>array_slice($diff,0,40)];
    foreach([1135,1137,1138,1139,1142] as $nr){ $oid=(int)$wpdb->get_var($wpdb->prepare("SELECT id FROM {$P}wc_orders WHERE id=%d",$nr)); 
      $ids=wc_get_orders(['limit'=>1,'return'=>'ids','meta_key'=>'_order_number','meta_value'=>$nr]); 
      $o=wc_get_order($oid)?:($ids?wc_get_order($ids[0]):null); if(!$o){ $r['uzs'][$nr]='nerasta'; continue; }
      foreach($o->get_items() as $it){ $p=$it->get_product(); $pid=$it->get_product_id(); $r['uzs'][$nr][]=['id'=>$o->get_id(),'nr'=>$o->get_order_number(),'pav'=>$it->get_name(),'src'=>$it->get_meta('_ps_source'),'sku'=>$p?$p->get_sku():null,'vf_ss'=>$wpdb->get_var($wpdb->prepare("SELECT supplier_sku FROM $t WHERE product_id=%d AND source='vf' LIMIT 1",$pid)),'vf_meta'=>array_filter(['_vf_sku'=>get_post_meta($pid,'_vf_sku',true),'_vf_sku_id'=>get_post_meta($pid,'_vf_sku_id',true)])]; } }
    $r['vf_meta_keys']=$wpdb->get_col("SELECT DISTINCT meta_key FROM {$P}postmeta WHERE meta_key LIKE '\\_vf%' LIMIT 40");
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
