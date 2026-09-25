<?php
/** Plugin Name: TEMP PS S1720a — 2.15 paieškos recon, read-only (a: kodas+nulinės; b: paslėptos dropship + kategorijos; c: šablonas) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720a'])) return; $f=$_GET['ps_s1720a']; $r=['v'=>'S1720a','faze'=>$f,'t'=>date('Y-m-d H:i:s')];
  global $wpdb; $p=$wpdb->prefix; @set_time_limit(280);
  $q=function($sql) use($wpdb){ $wpdb->last_error=''; $x=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error) return ['SQL_ERR'=>substr($wpdb->last_error,0,160)]; return $x; };
  try{
  if($f==='a'){
    $fp=WPMU_PLUGIN_DIR.'/petshop-paieska.php'; $r['md5']=md5_file($fp); $r['bytes']=filesize($fp); $r['kodas']=file_get_contents($fp);
    $c=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_web_ivykiai"); $r['cols']=$c;
    $r['nulines_14d']=$q("SELECT LOWER(TRIM(COALESCE(tekstas,''))) fraze,COUNT(*) n FROM {$p}ps_web_ivykiai WHERE tipas='search' AND laikas>=UTC_TIMESTAMP()-INTERVAL 14 DAY AND reiksme='0' GROUP BY 1 ORDER BY n DESC LIMIT 120");
    $r['viso_14d']=$q("SELECT COUNT(*) n,SUM(reiksme='0') nul,COUNT(DISTINCT sesija) ses FROM {$p}ps_web_ivykiai WHERE tipas='search' AND laikas>=UTC_TIMESTAMP()-INTERVAL 14 DAY");
    $r['viso_po_0920']=$q("SELECT COUNT(*) n,SUM(reiksme='0') nul FROM {$p}ps_web_ivykiai WHERE tipas='search' AND laikas>='2026-09-20 20:00:00'");
    $r['top_14d']=$q("SELECT LOWER(TRIM(COALESCE(tekstas,''))) fraze,COUNT(*) n,MIN(reiksme) rez FROM {$p}ps_web_ivykiai WHERE tipas='search' AND laikas>=UTC_TIMESTAMP()-INTERVAL 14 DAY AND reiksme<>'0' GROUP BY 1 ORDER BY n DESC LIMIT 40");
  }
  if($f==='b'){
    $r['paslepti']=$q("SELECT p.post_status,pm.meta_value vis,COUNT(*) n FROM {$p}posts p LEFT JOIN {$p}postmeta pm ON pm.post_id=p.ID AND pm.meta_key='_ps_paslepta' WHERE p.post_type='product' GROUP BY 1,2");
    $r['vis_terms']=$q("SELECT t.name,COUNT(*) n FROM {$p}term_relationships tr JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$p}terms t ON t.term_id=tt.term_id JOIN {$p}posts p ON p.ID=tr.object_id AND p.post_type='product' AND p.post_status='publish' WHERE tt.taxonomy='product_visibility' GROUP BY t.name");
    $r['meta_paslepimo']=$q("SELECT meta_key,COUNT(*) n FROM {$p}postmeta WHERE meta_key IN ('_ps_paslepta','_ps_dropship_paslepta','_ps_rodyti','_ps_sandelis','_ps_ranka_isimta','_stock_status') GROUP BY meta_key");
    $r['stock_status']=$q("SELECT pm.meta_value,p.post_status,COUNT(*) n FROM {$p}postmeta pm JOIN {$p}posts p ON p.ID=pm.post_id AND p.post_type='product' WHERE pm.meta_key='_stock_status' GROUP BY 1,2");
    $r['cat_n']=$q("SELECT COUNT(*) n FROM {$p}term_taxonomy WHERE taxonomy='product_cat' AND count>0"); $r['brand_n']=$q("SELECT COUNT(*) n FROM {$p}term_taxonomy WHERE taxonomy='product_brand' AND count>0");
    $r['antiparazit']=$q("SELECT p.ID,p.post_title,p.post_status,(SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_stock_status') ss FROM {$p}posts p WHERE p.post_type='product' AND p.post_title LIKE '%antiparazit%' LIMIT 15");
    $r['hidden_sample']=$q("SELECT p.ID,p.post_title,p.post_status FROM {$p}posts p JOIN {$p}term_relationships tr ON tr.object_id=p.ID JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$p}terms t ON t.term_id=tt.term_id WHERE tt.taxonomy='product_visibility' AND t.name='exclude-from-search' AND p.post_type='product' AND p.post_status='publish' LIMIT 10");
    $r['ps_sources_hidden']=$q("SELECT source,COUNT(*) n FROM {$p}ps_sources GROUP BY source");
    foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fn){ $s=file_get_contents($fn); if(preg_match('/exclude-from-search|exclude-from-catalog/',$s)) $r['slepia_failai'][]=basename($fn); }
    $sn=$q("SELECT id,name FROM {$p}snippets WHERE active=1 AND (code LIKE '%exclude-from-search%' OR code LIKE '%exclude-from-catalog%' OR code LIKE '%posts_search%' OR code LIKE '%pre_get_posts%')"); $r['snippetai']=$sn;
  }
  if($f==='c'){
    $t=get_template_directory(); $c=get_stylesheet_directory();
    foreach(['woocommerce/loop/no-products-found.php','woocommerce/archive-product.php','template-parts/posts/archive-none.php','search.php'] as $x){ $r['tema'][$x]=[file_exists("$t/$x")?'parent':'', file_exists("$c/$x")?'child':'']; }
    $cf=WP_PLUGIN_DIR.'/woocommerce/templates/loop/no-products-found.php'; $r['wc_no_products']=file_exists($cf)?file_get_contents($cf):'-';
    $ff=glob($t.'/woocommerce/loop/no-products-found.php'); $r['flatsome_no_products']=$ff?file_get_contents($ff[0]):'-';
    $r['header_search']=['ajax'=>get_theme_mod('search_result'),'header_elements'=>get_theme_mod('header_elements_top_right'),'mobile'=>get_theme_mod('header_elements_top_right_mobile'),'nav_mobile'=>get_theme_mod('header_elements_mobile')];
    $r['flatsome_ajax_fn']=function_exists('flatsome_ajax_search_products')?'yra':'nera';
    $r['searchkw']=$q("SELECT option_name FROM {$p}options WHERE option_name LIKE '%flatsome%search%' OR option_name LIKE 'yith_wcas%' LIMIT 20");
    $rs=wp_remote_get(home_url('/?s=hills&post_type=product'),['timeout'=>20,'user-agent'=>'Mozilla/5.0 ps-s1720','sslverify'=>false]); $b=wp_remote_retrieve_body($rs); $r['hills_http']=wp_remote_retrieve_response_code($rs);
    if(preg_match('#<main[^>]*>(.*?)</main>#s',$b,$m)){ $r['hills_main']=substr(preg_replace('/\s+/',' ',strip_tags($m[1])),0,1200); }
    if(preg_match('#(<div[^>]*class="[^"]*(woocommerce-info|woocommerce-no-products-found)[^"]*"[^>]*>.*?</div>)#s',$b,$m)) $r['hills_notice']=substr($m[1],0,600);
    $rs2=wp_remote_get(home_url('/?s=pork&post_type=product'),['timeout'=>20,'user-agent'=>'Mozilla/5.0 ps-s1720','sslverify'=>false]); $b2=wp_remote_retrieve_body($rs2); $r['pork_products']=preg_match_all('/class="[^"]*product-small[^"]*"/',$b2);
    $rs3=wp_remote_post(admin_url('admin-ajax.php'),['timeout'=>20,'sslverify'=>false,'body'=>['action'=>'flatsome_ajax_search_products','query'=>'hills']]); $r['ajax_hills']=substr(wp_remote_retrieve_body($rs3),0,600);
  }
  }catch(Throwable $e){ $r['ERR']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
