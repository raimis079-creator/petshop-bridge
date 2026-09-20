<?php
/** Plugin Name: TEMP PS S1701 schema/AI recon (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1701'])||$_GET['ps_s1701']!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1701 ma'); global $wpdb;
  try{
    // 1. prekės puslapio JSON-LD (Exclusion 7 kg #18587, konservas, aksesuaras)
    foreach(array(18587,19471,13164) as $pid){
      $r=wp_remote_get(get_permalink($pid),array('timeout'=>25,'user-agent'=>'Mozilla/5.0 ps-s1701')); $h=wp_remote_retrieve_body($r);
      preg_match_all('#<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>#si',$h,$m);
      $ld=array(); foreach($m[1] as $x){ $d=json_decode(trim($x),true); $ld[]=$d?$d:substr(trim($x),0,300); }
      $o['ld'][$pid]=array('kodas'=>wp_remote_retrieve_response_code($r),'n'=>count($m[1]),'json'=>$ld);
      $o['meta'][$pid]=array('gtin'=>get_post_meta($pid,'_global_unique_id',true),'sku'=>get_post_meta($pid,'_sku',true),'brand'=>wp_list_pluck((array)get_the_terms($pid,'product_brand'),'name'),'weight'=>get_post_meta($pid,'_weight',true));
    }
    // 2. robots.txt
    $r=wp_remote_get(home_url('/robots.txt'),array('timeout'=>15)); $o['robots']=wp_remote_retrieve_body($r);
    // 3. Rank Math schema/opcijos
    $rm=get_option('rank-math-options-titles'); $keys=array(); foreach((array)$rm as $k=>$v){ if(stripos($k,'schema')!==false||stripos($k,'product')!==false||stripos($k,'knowledge')!==false||stripos($k,'robots')!==false) $keys[$k]=is_array($v)?json_encode($v):$v; } $o['rankmath_titles']=$keys;
    $rg=get_option('rank-math-options-general'); $g=array(); foreach((array)$rg as $k=>$v){ if(stripos($k,'schema')!==false||stripos($k,'llms')!==false||stripos($k,'robots')!==false) $g[$k]=is_array($v)?json_encode($v):$v; } $o['rankmath_general']=$g;
    $o['rm_modules']=get_option('rank_math_modules');
    // 4. llms.txt, ai.txt
    foreach(array('/llms.txt','/ai.txt','/.well-known/ai-plugin.json') as $u){ $r=wp_remote_head(home_url($u),array('timeout'=>10)); $o['failai'][$u]=wp_remote_retrieve_response_code($r); }
    // 5. WC structured data hook aktyvus?
    $o['wc_sd']=has_action('wp_footer',array(WC()->structured_data,'output_structured_data'));
    // 6. AI botų apsilankymai per 14 d. — server log nėra; ps_seo_404? nėra UA. Praleidžiam.
    // 7. GSC merchant listings? — ne per API. Grąžinam headerius
    $r=wp_remote_head(home_url('/'),array('timeout'=>15)); $o['headers']=array('x-robots'=>wp_remote_retrieve_header($r,'x-robots-tag'),'server'=>wp_remote_retrieve_header($r,'server'));
    $o['sitemap']=wp_remote_retrieve_response_code(wp_remote_head(home_url('/sitemap_index.xml'),array('timeout'=>10)));
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
