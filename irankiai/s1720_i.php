<?php
/** Plugin Name: TEMP PS S1720i — 2.17 recon prieš kodą (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720i'])) return; $r=['v'=>'S1720i'];
  global $wpdb; $p=$wpdb->prefix; @set_time_limit(280);
  $mu=WPMU_PLUGIN_DIR;
  $fn=function($file,$name,$len=2600){ $c=file_get_contents($file); $i=strpos($c,'function '.$name); return $i===false?'-':substr($c,$i,$len); };
  try{
  $r['parinkti']=$fn($mu.'/petshop-av-source.php','parinkti',3200);
  $r['resolve']=$fn($mu.'/petshop-av-source.php','resolve',2600);
  $r['dp']=$fn($mu.'/petshop-av-source.php','dp',900);
  $c=file_get_contents($mu.'/petshop-schema-prekes.php'); preg_match_all('/const\s+([A-Z_]+)\s*=\s*([^;]+);/',$c,$m); $r['schema_const']=array_combine($m[1],$m[2]); preg_match('/class\s+(\w+)/',$c,$m); $r['schema_class']=$m[1]; $i=strpos($c,"'handlingTime'"); $r['schema_handling']=substr($c,$i-100,400); $r['schema_md5']=md5_file($mu.'/petshop-schema-prekes.php');
  $c=file_get_contents($mu.'/petshop-rinkiniai.php'); $i=strpos($c,'function pastomato_sargas'); $r['pastomato_sargas']=substr($c,$i,1800);
  $r['tik_kurjeriu_meta']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}postmeta WHERE meta_key LIKE '%kurjer%' OR meta_key LIKE '%courier%' OR meta_key LIKE '%tik_kurj%' GROUP BY meta_key",ARRAY_A);
  $r['cats']=$wpdb->get_results("SELECT t.term_id,t.slug,tt.parent,tt.count FROM {$p}terms t JOIN {$p}term_taxonomy tt ON tt.term_id=t.term_id WHERE tt.taxonomy='product_cat' AND (t.slug LIKE '%saus%' OR t.slug LIKE '%kraik%' OR t.slug LIKE '%lesal%') ORDER BY tt.parent",ARRAY_A);
  $r['hide_parcel']=$fn(get_stylesheet_directory().'/functions.php','petshop_hide_parcel_if_courier_only',2200);
  $r['free_progress']=$fn(get_stylesheet_directory().'/functions.php','petshop_free_shipping_progress',3000);
  $r['mnm_dp_keys']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}postmeta WHERE meta_key IN ('_dp_base_product_id','_dp_pack_qty','_mnm_config','_ps_sandelis','_ps_tik_kurjeriu','_ps_only_courier') GROUP BY meta_key",ARRAY_A);
  $r['stock_html_fn']=$fn($mu.'/petshop-av-limit.php','stock_html',900);
  $r['titles_sample']=$wpdb->get_col("SELECT post_title FROM {$p}posts p JOIN {$p}term_relationships tr ON tr.object_id=p.ID JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$p}terms t ON t.term_id=tt.term_id WHERE p.post_type='product' AND p.post_status='publish' AND t.slug LIKE '%kraik%' LIMIT 12");
  }catch(Throwable $e){ $r['ERR']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
