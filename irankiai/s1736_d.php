<?php
/** Plugin Name: TEMP PS S1736d dropship laiškų archyvas, DP/MnM eilutės (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1736d'])) return;
  $f=$_GET['ps_s1736d']; @set_time_limit(200); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1736d','faze'=>$f];
  try{
  if($f==='1'){
    $a=(array)get_option('ps_laisku_archyvas',[]); $r['arch_n']=count($a);
    foreach(array_slice($a,0,60) as $l){ $h=(string)$l['html']; $r['arch'][]=[$l['laikas'],mb_substr($l['kam'],0,60),$l['tema'],mb_substr((string)$l['kont'],0,70),'DP='.preg_match_all('/DP-[A-Za-z0-9]/',$h),'pr='.count((array)$l['priedai'])]; }
    $rows=$wpdb->get_results("SELECT oi.order_id,oi.order_item_id,oi.order_item_name,m1.meta_value src,m2.meta_value pid,m3.meta_value qty FROM {$P}woocommerce_order_items oi JOIN {$P}woocommerce_order_itemmeta m1 ON m1.order_item_id=oi.order_item_id AND m1.meta_key='_ps_source' JOIN {$P}woocommerce_order_itemmeta m2 ON m2.order_item_id=oi.order_item_id AND m2.meta_key='_product_id' JOIN {$P}woocommerce_order_itemmeta m3 ON m3.order_item_id=oi.order_item_id AND m3.meta_key='_qty' JOIN {$P}wc_orders o ON o.id=oi.order_id WHERE o.date_created_gmt>'2026-09-07' AND m1.meta_value NOT IN('','av')",ARRAY_A);
    $r['ne_av_eil']=count($rows); $dp=[];$mnm=[];$src=[];
    foreach($rows as $x){ $src[$x['src']]=($src[$x['src']]??0)+1; $b=get_post_meta($x['pid'],'_dp_base_product_id',true); if($b){ $dp[]=$x+['base'=>$b,'kiek'=>get_post_meta($x['pid'],'_dp_pack_qty',true),'nr'=>wc_get_order($x['order_id'])?wc_get_order($x['order_id'])->get_order_number():'']; }
      if(get_post_meta($x['pid'],'_mnm_config',true)!=='' ) $mnm[]=$x; }
    $r['pagal_src']=$src; $r['dp']=array_slice($dp,0,30); $r['dp_n']=count($dp); $r['mnm']=array_slice($mnm,0,10);
    $r['tiek_eil_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$P}ps_tiekimas_eil");
    $r['tiek_src']=$wpdb->get_results("SELECT tiekejas,COUNT(*) n FROM {$P}ps_tiekimas GROUP BY tiekejas",ARRAY_A);
    $r['sources_src']=$wpdb->get_results("SELECT source,COUNT(*) n FROM {$P}ps_sources GROUP BY source",ARRAY_A);
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
