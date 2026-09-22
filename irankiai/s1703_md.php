<?php
/** Plugin Name: TEMP PS S1703 md — recon (read-only): analitika įvykių tipai, kategorijos prekių su lentele, pardavimai 90 d, veislės puslapio meta/šablonas */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1703md'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1703 md');
  try{
    $a=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-analitika.php');
    foreach(array('TIPAI','LEISTINI','tipas') as $k){ $i=strpos($a,'const '.$k); if($i!==false) $o['konst_'.$k]=mb_substr($a,$i,900); }
    if(preg_match_all('/const ([A-Z_]+)\s*=\s*array\((.{0,600}?)\);/s',$a,$m)) foreach($m[1] as $i=>$n) $o['const'][$n]=preg_replace('/\s+/',' ',$m[2][$i]);
    $i=strpos($a,'function irasyti'); $o['irasyti']=$i!==false?mb_substr($a,$i,3200):'NĖRA';
    $i=strpos($a,'function gauti'); if($i===false) $i=strpos($a,'register_rest_route'); $o['rest_gavimas']=$i!==false?mb_substr($a,$i,2200):'NĖRA';
    // kategorijos prekių su lentele
    $rows=$wpdb->get_results("SELECT m.product_id pid, t.species FROM {$p}ps_feeding_map m JOIN {$p}ps_feeding_tables t ON t.id=m.feeding_table_id JOIN {$p}posts po ON po.ID=m.product_id JOIN {$p}postmeta ps ON ps.post_id=m.product_id AND ps.meta_key='_stock_status' AND ps.meta_value='instock' WHERE m.is_active=1 AND t.is_active=1 AND po.post_status='publish'",ARRAY_A);
    $kat=array(); $konserv=0; $pids=array();
    foreach($rows as $r){ $pids[]=(int)$r['pid']; $sl=wp_get_object_terms((int)$r['pid'],'product_cat',array('fields'=>'slugs')); foreach((array)$sl as $s){ $kat[$r['species'].' '.$s]=($kat[$r['species'].' '.$s]??0)+1; } $n=get_the_title((int)$r['pid']); if(preg_match('/konserv|paštet|pastet|guliaš|padaž|drėgn|dregn|maišel|maisel/iu',$n)) $konserv++; }
    arsort($kat); $o['kategorijos']=array_slice($kat,0,60,true); $o['konservai_pagal_pav']=$konserv;
    // pa_maisto_tipas / atributai
    $o['attr_taxonomies']=array_keys(wc_get_attribute_taxonomies()?array_column(wc_get_attribute_taxonomies(),'attribute_name','attribute_name'):array());
    $sample=array_slice($pids,0,3); foreach($sample as $pid){ $pr=wc_get_product($pid); $o['attr_sample'][$pid]=array('n'=>$pr->get_name(),'attrs'=>array_map(function($x){return is_object($x)?$x->get_name().'='.implode(',',(array)$x->get_options()):$x;},$pr->get_attributes()),'img'=>wp_get_attachment_image_url($pr->get_image_id(),'woocommerce_thumbnail'),'pak'=>$pr->get_attribute('pa_pakuotes_dydis'),'w'=>$pr->get_weight(),'sale'=>$pr->is_on_sale()); }
    // pardavimai 90 d
    $in=implode(',',array_map('intval',$pids));
    $o['pard90']=$wpdb->get_results("SELECT preke_id pid, SUM(kiekis) k, COUNT(DISTINCT uzsakymas_id) u FROM {$p}ps_fakt_eilutes WHERE preke_id IN ($in) AND apmoketa_at>=NOW()-INTERVAL 90 DAY AND testinis=0 GROUP BY preke_id ORDER BY u DESC LIMIT 15",ARRAY_A);
    $o['ist_pard90']=$wpdb->get_results("SELECT preke_id pid, SUM(kiekis) k, COUNT(DISTINCT uzsakymas_id) u FROM {$p}ps_ist_fakt_eilutes WHERE preke_id IN ($in) AND apmoketa_at>=NOW()-INTERVAL 180 DAY GROUP BY preke_id ORDER BY u DESC LIMIT 15",ARRAY_A);
    $o['ist_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_ist_fakt_eilutes",0);
    // veislės puslapis 3206 — meta ir šablonas
    $o['veisle_meta']=$wpdb->get_results("SELECT meta_key, LEFT(meta_value,120) v FROM {$p}postmeta WHERE post_id=3206 AND meta_key NOT LIKE '\_oembed%'",ARRAY_A);
    $pg=get_post(3206); $o['veisle_content_head']=mb_substr($pg->post_content,0,1500); $o['veisle_title']=$pg->post_title; $o['veisle_url']=get_permalink(3206);
    $o['veisles_visos']=$wpdb->get_results("SELECT ID,post_name,post_title FROM {$p}posts WHERE post_type='page' AND post_status='publish' AND post_parent=(SELECT post_parent FROM {$p}posts WHERE ID=3206) ORDER BY post_name",ARRAY_A);
    $o['veisle_parent']=$pg->post_parent?get_post($pg->post_parent)->post_name:0;
    $o['cat_urls']=array('sunims'=>get_term_link('sausas-maistas-sunims','product_cat'),'katems'=>get_term_link('sausas-maistas-katems','product_cat'));
    $o['kill']=get_option('petshop_feeding_calc_kill');
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getFile().':'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
