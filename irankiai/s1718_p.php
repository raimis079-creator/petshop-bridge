<?php
/** Plugin Name: TEMP PS S1718p — kur rodomas term description (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1718p'])) return; $r=['v'=>'S1718p'];
  foreach(['/kategorija/katems/maistas-katems/','/gamintojas/josera/','/kategorija/sunims/','/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/'] as $u){
    $h=wp_remote_retrieve_body(wp_remote_get(home_url($u.'?ps_v=3'),['timeout'=>30])); $x=['len'=>strlen($h)];
    foreach(['term-description','shop-page-title','<h1','class="products','ps-kat-apacia','apatinis','woocommerce-products-header','<footer','ps-seo-blokas'] as $k){ $x[$k]=strpos($h,$k); }
    $r[$u]=$x; }
  $t=get_term_by('slug','maistas-katems','product_cat'); $r['maistas-katems_desc']=mb_substr($t->description,0,120);
  $r['brand_desc_hooks']=has_action('woocommerce_archive_description'); global $wp_filter; $r['arch_desc']=[]; if(isset($wp_filter['woocommerce_archive_description'])) foreach($wp_filter['woocommerce_archive_description']->callbacks as $p=>$cbs) foreach($cbs as $cb) $r['arch_desc'][]=$p.':'.(is_string($cb['function'])?$cb['function']:(is_array($cb['function'])?(is_object($cb['function'][0])?get_class($cb['function'][0]):$cb['function'][0]).'::'.$cb['function'][1]:'closure'));
  wp_send_json($r);
},1);
