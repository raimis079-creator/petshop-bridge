<?php
/** Plugin Name: TEMP PS S1698 404 recon 3 (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1698'])||$_GET['ps_s1698']!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1698 mc'); global $wpdb; $p=$wpdb->prefix;
  try{
    $test=array('/prekes-zenklas/exclusion','/prekes-zenklas/ontario','/checkout','/login','/sunims/prieziuros-priemones','/kita-446007278/daugiau-pigiau/pauksciams-132251148','/trixie-kilimelis-purvui-surinkti-120-80-cm','/automatine-serykla-kateisuniui','/jaucio-ausis-ruda','/josera-miniwell-10-kg-sausas-maistas-mazu-veisliu-sunims','/real-dog-sensitive-15kg-pascaronaras-suaugusiems-scaronunims-su-antiena-48486-1','/placek-pet-products-s-r-o','/greenpetfood','/content/3-nuostatos-ir-salygos','/pagrindinis/2809-ontario-adult-medium-chicken-and-potatoes-12-kg-pasaras-vidutiniu-veisliu-sunims.html','/parduotuve/page/108','/product/exclusion-intestinal-monoprotein-sausas-sunu-maistas-su-kiauliena-ir-ryziais-m-l12-kg/','/product/druska-ziurkenams-ir-kitiems-grauzikams/','/kraikas-katems-tofu-belocat-levandu-kvapo-6-l-2-5-kg-2-mm-granules');
    foreach($test as $u){ $r=wp_remote_head(home_url($u),array('timeout'=>15,'redirection'=>0,'user-agent'=>'Mozilla/5.0 ps-s1698')); $o['http'][$u]=is_wp_error($r)?$r->get_error_message():array(wp_remote_retrieve_response_code($r),wp_remote_retrieve_header($r,'location'),wp_remote_retrieve_header($r,'x-redirect-by')); }
    // legacy meta raktai
    $o['legacy_meta']=$wpdb->get_results("SELECT meta_key, COUNT(*) n FROM {$p}postmeta WHERE meta_key LIKE '%legacy%' OR meta_key LIKE '%old_%' OR meta_key LIKE '%eshop%' GROUP BY meta_key ORDER BY n DESC LIMIT 20",ARRAY_A);
    $o['legacy_pvz']=$wpdb->get_results("SELECT post_id, meta_key, LEFT(meta_value,120) v FROM {$p}postmeta WHERE meta_key IN ('_legacy_url','_legacy_id','_legacy_slug','_legacy_product_id','_legacy_manufacturer') ORDER BY post_id LIMIT 8",ARRAY_A);
    // vidinės nuorodos į /checkout, /login, kita-.../pauksciams: meniu, opcijos, tema, laiškų šablonai
    $o['menu_items']=$wpdb->get_results("SELECT pm.post_id, pm.meta_value url FROM {$p}postmeta pm WHERE pm.meta_key='_menu_item_url' AND (pm.meta_value LIKE '%checkout%' OR pm.meta_value LIKE '%/login%' OR pm.meta_value LIKE '%pauksciams%' OR pm.meta_value LIKE '%kita-4460%')",ARRAY_A);
    $o['options_hits']=$wpdb->get_results("SELECT option_name, LENGTH(option_value) len FROM {$p}options WHERE option_value LIKE '%/checkout%' OR option_value LIKE '%pauksciams-132251148%' OR option_value LIKE '%kita-446007278%' LIMIT 20",ARRAY_A);
    $o['posts_hits']=$wpdb->get_results("SELECT ID, post_type, post_title FROM {$p}posts WHERE post_status IN ('publish','draft') AND (post_content LIKE '%kita-446007278%' OR post_content LIKE '%pauksciams-132251148%' OR post_content LIKE '%href=\"/checkout%' OR post_content LIKE '%petshop.lt/checkout%' OR post_content LIKE '%petshop.lt/login%') LIMIT 20",ARRAY_A);
    $o['seo404_checkout_ref']=$wpdb->get_results("SELECT kelias, referer, SUM(hits) h FROM {$p}ps_seo_404 WHERE diena>='2026-09-11' AND kelias IN ('checkout','login','kita-446007278/daugiau-pigiau/pauksciams-132251148') GROUP BY kelias, referer ORDER BY h DESC LIMIT 15",ARRAY_A);
    $o['web_checkout']=$wpdb->get_results("SELECT url_kelias, referer_domenas, irenginys, nars_seima, salis, COUNT(*) n FROM {$p}ps_web_ivykiai WHERE tipas='error404' AND url_kelias LIKE '/checkout%' GROUP BY 1,2,3,4,5 LIMIT 10",ARRAY_A);
    $o['brand_slugs']=$wpdb->get_results("SELECT t.slug FROM {$p}terms t JOIN {$p}term_taxonomy tt ON tt.term_id=t.term_id AND tt.taxonomy='product_brand' WHERE t.slug IN ('exclusion','ontario','miamor','josera','greenpetfood','green-petfood','placek')",ARRAY_A);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
