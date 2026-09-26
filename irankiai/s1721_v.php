<?php
/** Plugin Name: TEMP PS S1721v read-only: kramtalu-rinkiniai psl. korteles id->img; laukai filtro kontekstas */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721v'])) return; $r=['v'=>'S1721v']; @set_time_limit(120);
  $ua=['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1721','cookies'=>['ps_js'=>'1']];
  try{
    foreach(['kramtalu'=>'/kategorija/rinkiniai/kramtalu-rinkiniai/','rinkiniai'=>'/kategorija/rinkiniai/'] as $k=>$u){
      $t=get_term_by('slug',$k==='kramtalu'?'kramtalu-rinkiniai':'rinkiniai','product_cat'); $link=get_term_link($t);
      $rs=wp_remote_get($link.'?ps_v='.time(),$ua); $h=wp_remote_retrieve_body($rs);
      $r[$k]['link']=$link; $r[$k]['code']=wp_remote_retrieve_response_code($rs); $r[$k]['cache_hdr']=array_intersect_key((array)wp_remote_retrieve_headers($rs)->getAll(),array_flip(['x-cache','cache-control','x-super-cache','cf-cache-status','age']));
      preg_match_all('/class="product-small col[^"]*\bpost-(\d+)\b.*?<div class="box-image">.*?<img[^>]*\ssrc="([^"]+)"/s',$h,$m,PREG_SET_ORDER);
      foreach($m as $x){ $r[$k]['cards'][(int)$x[1]]=basename($x[2]); }
      $r[$k]['supercache_komentaras']=preg_match('/<!--\s*(Dynamic page generated|Cached page generated)[^>]*-->/i',$h,$c)?$c[0]:'nera';
    }
    // laukai: add_filter kontekstas
    $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-laukai.php'); $pos=strpos($s,"add_filter( 'woocommerce_product_get_image_id'"); $r['filter_ctx']=preg_replace('/\s+/',' ',substr($s,max(0,$pos-900),1100));
    $r['has_filter_now']=has_filter('woocommerce_product_get_image_id');
    $r['yra_laukas_src']=preg_match('/function\s+yra_laukas\s*\([^)]*\)\s*\{.{0,300}/s',$s,$mm)?preg_replace('/\s+/',' ',$mm[0]):'';
    $r['grupe_src']=preg_match('/function\s+grupe\s*\([^)]*\)\s*\{.{0,400}/s',$s,$mm)?preg_replace('/\s+/',' ',$mm[0]):'';
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
