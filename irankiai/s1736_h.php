<?php
/** Plugin Name: TEMP PS S1736h DP kategorija kataloge — kodėl ne visos prekės (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1736h'])) return;
  $f=$_GET['ps_s1736h']; @set_time_limit(200); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1736h','faze'=>$f];
  try{
  if($f==='1'){
    $r['terms']=$wpdb->get_results("SELECT t.term_id,t.name,t.slug,tt.parent,tt.count FROM {$P}terms t JOIN {$P}term_taxonomy tt ON tt.term_id=t.term_id AND tt.taxonomy='product_cat' WHERE t.name LIKE '%augiau%' OR t.slug LIKE '%daugiau%' OR t.slug LIKE '%pigiau%'",ARRAY_A);
    $dp=$wpdb->get_col("SELECT p.ID FROM {$P}posts p JOIN {$P}postmeta m ON m.post_id=p.ID AND m.meta_key='_dp_base_product_id' WHERE p.post_type='product'");
    $st=[]; $vis=[]; $stock=[]; $incat=[]; $nocat=[];
    $tid=$r['terms']?(int)$r['terms'][0]['term_id']:0;
    foreach($dp as $id){ $p=get_post($id); $st[$p->post_status]=($st[$p->post_status]??0)+1; if($p->post_status!=='publish') continue;
      $pr=wc_get_product($id); $v=$pr?$pr->get_catalog_visibility():'?'; $vis[$v]=($vis[$v]??0)+1; $s=$pr?$pr->get_stock_status():'?'; $stock[$s]=($stock[$s]??0)+1;
      $cats=wp_get_post_terms($id,'product_cat',['fields'=>'ids']); if($tid && in_array($tid,$cats)) $incat[]=$id; else $nocat[]=[$id,$p->post_title,$cats]; }
    $r['dp_viso']=count($dp); $r['statusai']=$st; $r['matomumas']=$vis; $r['sandelis']=$stock; $r['kategorijoje']=count($incat); $r['ne_kategorijoje_n']=count($nocat); $r['ne_kategorijoje']=array_slice($nocat,0,10);
    $r['hide_oos']=get_option('woocommerce_hide_out_of_stock_items');
    $r['dk_isjungta']=get_option('ps_dydziai_katalogas_isjungta');
    // simuliacija: kategorijos užklausa su ir be dydžių katalogo
    if($tid){ $term=get_term($tid,'product_cat');
      $q=function() use($term){ $wq=new WP_Query(['post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids','product_cat'=>$term->slug,'ps_s1736_sim'=>1]); return $wq; };
      $r['sim_query_vars_note']='WP_Query ne main query — dydžių katalogas gali nesikabinti';
    }
    $fp=WPMU_PLUGIN_DIR.'/petshop-dydziai-katalogas.php'; $c=file_get_contents($fp); $r['dk_src']=['md5'=>md5($c),'gz'=>base64_encode(gzcompress($c,9))];
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
