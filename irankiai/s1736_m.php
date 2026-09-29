<?php
/** Plugin Name: TEMP PS S1736m puslapis /daugiau-pigiau/ turinys (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1736m'])) return;
  $f=$_GET['ps_s1736m']; @set_time_limit(200); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1736m','faze'=>$f];
  try{
  if($f==='1'){
    $p=get_post(34476); $r['turinys']=$p->post_content; $r['modified']=$p->post_modified; $r['template']=get_post_meta(34476,'_wp_page_template',true);
    $r['meta']=array_map(function($v){return mb_substr((string)$v[0],0,300);},array_filter(get_post_meta(34476),function($k){return strpos($k,'_edit')!==0;},ARRAY_FILTER_USE_KEY));
    preg_match_all('/\[([a-z_\-]+)/i',$p->post_content,$m); $r['shortcodes']=array_values(array_unique($m[1]));
    foreach($r['shortcodes'] as $sc){ global $shortcode_tags; if(isset($shortcode_tags[$sc])){ $cb=$shortcode_tags[$sc]; if(is_string($cb)) $r['sc_cb'][$sc]=$cb; elseif(is_array($cb)) $r['sc_cb'][$sc]=(is_object($cb[0])?get_class($cb[0]):$cb[0]).'::'.$cb[1]; elseif($cb instanceof Closure){ $rf=new ReflectionFunction($cb); $r['sc_cb'][$sc]='closure '.str_replace(WP_CONTENT_DIR,'',$rf->getFileName()).':'.$rf->getStartLine(); } } }
    $x=wp_remote_get(home_url('/daugiau-pigiau/?ps_hb='.time()),['timeout'=>40,'sslverify'=>false,'headers'=>['Cookie'=>'ps_js=1']]); $h=is_wp_error($x)?'':wp_remote_retrieve_body($x);
    preg_match_all('~class="[^"]*\bproduct-small\b[^"]*"~',$h,$m2); $r['korteles']=count($m2[0]); preg_match_all('~data-product_id="(\d+)"~',$h,$m3); $r['prekiu_id_n']=count(array_unique($m3[1]));
    $r['kesas']=glob(WP_CONTENT_DIR.'/cache/supercache/petshop.lt/daugiau-pigiau/*');
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
