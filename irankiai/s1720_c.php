<?php
/** Plugin Name: TEMP PS S1720c — 2.15 recon 3, read-only (g: Flatsome ajax search kodas + analitika search hook; h: prekių egzistavimas) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720c'])) return; $f=$_GET['ps_s1720c']; $r=['v'=>'S1720c','faze'=>$f,'t'=>date('Y-m-d H:i:s')];
  global $wpdb; $p=$wpdb->prefix; @set_time_limit(280);
  $q=function($sql) use($wpdb){ $wpdb->last_error=''; $x=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error) return ['SQL_ERR'=>substr($wpdb->last_error,0,160)]; return $x; };
  try{
  if($f==='g'){
    $t=get_template_directory(); $hits=[];
    foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($t,FilesystemIterator::SKIP_DOTS)) as $fi){ if($fi->getExtension()!=='php') continue; $c=file_get_contents($fi->getPathname()); if(strpos($c,'flatsome_ajax_search_products')!==false){ $hits[]=str_replace($t,'',$fi->getPathname()); if(preg_match('/function flatsome_ajax_search_products.*?\n}\n/s',$c,$m)) $r['fn']=substr($m[0],0,7000); if(preg_match_all('/apply_filters\(\s*[\'"]([a-z_]+)[\'"]/',$c,$mm)) $r['filters'][$fi->getFilename()]=array_values(array_unique($mm[1])); } }
    $r['hits']=$hits; $lf=$t.'/inc/extensions/flatsome-live-search/flatsome-live-search.php'; $c=file_get_contents($lf); $r['ls_bytes']=strlen($c); $i=strpos($c,'function flatsome_ajax_search_products'); $r['ls_products_fn']=substr($c,$i,6500); $j=strpos($c,'No products found'); if($j===false) $j=strpos($c,'nerasta'); $r['ls_noresults_ctx']=$j!==false?substr($c,max(0,$j-1500),2200):'-'; preg_match_all('/function\s+(flatsome_[a-z_]+)/',$c,$mm); $r['ls_fns']=$mm[1];
    $c=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-analitika.php'); if(preg_match_all('/.{0,400}[\'"]search[\'"].{0,400}/s',$c,$m)) $r['analitika_search']=array_slice($m[0],0,3);
    $tp=$t.'/woocommerce/archive-product.php'; $c=file_get_contents($tp); if(preg_match('/.{0,300}no_products_found.{0,300}/s',$c,$m)) $r['archive_no_products']=$m[0];
    $r['flatsome_ver']=wp_get_theme('flatsome')->get('Version');
    $r['search_opts']=['search_result'=>get_theme_mod('search_result'),'search_placeholder'=>get_theme_mod('search_placeholder'),'search_ajax'=>get_theme_mod('live_search'),'header_search_form_style'=>get_theme_mod('header_search_form_style'),'search_categories'=>get_theme_mod('search_categories')];
    $r['mods_search']=array_filter(get_theme_mods(),function($k){return stripos($k,'search')!==false;},ARRAY_FILTER_USE_KEY);
  }
  if($f==='h'){
    foreach(['oasy','prima dog','primadog','rafi','kitty','struvite','vetsolution','pet solution','mini adult 8','8+','mature','hepatic','ambrosia','monge','pavad','žiurk','ziurk','bravecto','bio','sensible'] as $w){ $r['prekes'][$w]=$q($wpdb->prepare("SELECT ID,post_status,LEFT(post_title,70) t FROM {$p}posts WHERE post_type='product' AND post_status IN ('publish','draft') AND post_title LIKE %s ORDER BY post_status DESC LIMIT 4",'%'.$wpdb->esc_like($w).'%')); }
    $r['brand_terms']=$q("SELECT t.name,tt.count FROM {$p}terms t JOIN {$p}term_taxonomy tt ON tt.term_id=t.term_id WHERE tt.taxonomy='product_brand' AND (t.name LIKE '%oasy%' OR t.name LIKE '%prima%' OR t.name LIKE '%rafi%' OR t.name LIKE '%kitty%' OR t.name LIKE '%hill%' OR t.name LIKE '%royal%' OR t.name LIKE '%farmina%' OR t.name LIKE '%ambrosia%' OR t.name LIKE '%monge%' OR t.name LIKE '%exclusion%')");
    $r['hidden_by_brand']=$q("SELECT b.name,COUNT(*) n FROM {$p}postmeta pm JOIN {$p}posts p ON p.ID=pm.post_id AND p.post_status='publish' JOIN {$p}term_relationships tr ON tr.object_id=p.ID JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_brand' JOIN {$p}terms b ON b.term_id=tt.term_id WHERE pm.meta_key='_ps_dropship_paslepta' AND pm.meta_value='1' GROUP BY b.name ORDER BY n DESC LIMIT 25");
    $r['hidden_by_cat']=$q("SELECT c.name,COUNT(*) n FROM {$p}postmeta pm JOIN {$p}posts p ON p.ID=pm.post_id AND p.post_status='publish' JOIN {$p}term_relationships tr ON tr.object_id=p.ID JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_cat' JOIN {$p}terms c ON c.term_id=tt.term_id WHERE pm.meta_key='_ps_dropship_paslepta' AND pm.meta_value='1' GROUP BY c.name ORDER BY n DESC LIMIT 25");
    $r['stock_watch']=$q("SELECT status,COUNT(*) n FROM {$p}ps_stock_watch GROUP BY status");
    $r['top_cats']=$q("SELECT t.term_id,t.name,t.slug,tt.count FROM {$p}terms t JOIN {$p}term_taxonomy tt ON tt.term_id=t.term_id WHERE tt.taxonomy='product_cat' AND tt.parent=0 AND tt.count>0 ORDER BY tt.count DESC");
    $r['sub_cats']=$q("SELECT t.term_id,t.name,t.slug,tt.parent,tt.count FROM {$p}terms t JOIN {$p}term_taxonomy tt ON tt.term_id=t.term_id WHERE tt.taxonomy='product_cat' AND tt.parent IN (70,77,87,89,93) AND tt.count>0 ORDER BY tt.parent,tt.count DESC");
    $r['kontaktai']=['tel'=>get_option('woocommerce_store_phone'),'email'=>get_option('woocommerce_email_from_address'),'admin'=>get_option('admin_email')];
    // Flatsome ajax "hills"
    $rs=wp_remote_post(admin_url('admin-ajax.php'),['timeout'=>20,'sslverify'=>false,'body'=>['action'=>'flatsome_ajax_search_products','query'=>'pork peas']]); $r['ajax_porkpeas']=substr(wp_remote_retrieve_body($rs),0,300);
  }
  }catch(Throwable $e){ $r['ERR']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
