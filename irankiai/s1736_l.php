<?php
/** Plugin Name: TEMP PS S1736l kur veda „Daugiau=pigiau" nuorodos (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1736l'])) return;
  $f=$_GET['ps_s1736l']; @set_time_limit(200); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1736l','faze'=>$f];
  try{
  if($f==='1'){
    $r['meniu']=$wpdb->get_results("SELECT p.ID,p.post_title,m1.meta_value tipas,m2.meta_value obj,m3.meta_value url FROM {$P}posts p LEFT JOIN {$P}postmeta m1 ON m1.post_id=p.ID AND m1.meta_key='_menu_item_type' LEFT JOIN {$P}postmeta m2 ON m2.post_id=p.ID AND m2.meta_key='_menu_item_object_id' LEFT JOIN {$P}postmeta m3 ON m3.post_id=p.ID AND m3.meta_key='_menu_item_url' WHERE p.post_type='nav_menu_item' AND (p.post_title LIKE '%igiau%' OR m3.meta_value LIKE '%igiau%' OR m2.meta_value='91')",ARRAY_A);
    $r['puslapiai']=$wpdb->get_results("SELECT ID,post_title,post_name,post_status FROM {$P}posts WHERE post_type IN('page','post') AND (post_name LIKE '%igiau%' OR post_title LIKE '%igiau%' OR post_content LIKE '%daugiau-pigiau%')",ARRAY_A);
    $x=wp_remote_get(home_url('/?ps_hb='.time()),['timeout'=>30,'sslverify'=>false,'headers'=>['Cookie'=>'ps_js=1']]); $h=is_wp_error($x)?'':wp_remote_retrieve_body($x);
    preg_match_all('~href="([^"]*(?:igiau|daugiau)[^"]*)"~i',$h,$m); $r['pradzios_nuorodos']=array_values(array_unique($m[1]));
    // pati kategorija: kiek per puslapį, puslapių skaičius, pirmos kortelės
    $u=add_query_arg('ps_hb',time().'1',get_term_link(91,'product_cat')); $x=wp_remote_get($u,['timeout'=>40,'sslverify'=>false,'headers'=>['Cookie'=>'ps_js=1']]); $h=is_wp_error($x)?'':wp_remote_retrieve_body($x);
    preg_match_all('~class="[^"]*\bproduct-small\b[^"]*"~',$h,$m2); $r['korteliu_1psl']=count($m2[0]);
    preg_match_all('~/page/(\d+)/~',$h,$m3); $r['puslapiai_nuorodos']=array_values(array_unique($m3[1]));
    if(preg_match('~woocommerce-result-count[^>]*>(.*?)</p>~s',$h,$m4)) $r['rc']=trim(wp_strip_all_tags($m4[1]));
    $r['kesas']=glob(WP_CONTENT_DIR.'/cache/supercache/petshop.lt/kategorija/daugiau-pigiau/*');
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
