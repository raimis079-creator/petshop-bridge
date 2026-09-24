<?php
/** Plugin Name: TEMP PS S1713h valymo testas per petshop.lt hosta (1 cache+vidine uzklausa / 2 patikra) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1713h'])) return;
  $f=$_GET['ps_s1713h']; @set_time_limit(170); $r=['v'=>'S1713h','faze'=>$f,'host'=>$_SERVER['HTTP_HOST']??null]; $pid=17978;
  $cp=$GLOBALS['cache_path']??(WP_CONTENT_DIR.'/cache/'); $sc=$cp.'supercache/petshop.lt/'; $u=get_permalink($pid); $d=$sc.trim(parse_url($u,PHP_URL_PATH),'/').'/';
  $st=function() use($d,$sc){ clearstatcache(); return ['preke'=>is_dir($d)?array_values(array_map('basename',array_filter(glob($d.'{,.}*',GLOB_BRACE)?:[],'is_file'))):'NERA','home'=>array_map('basename',glob($sc.'index*')?:[]),'kat_katems'=>is_dir($sc.'kategorija/katems')?array_map('basename',glob($sc.'kategorija/katems/*')?:[]):'NERA']; };
  try{
    if($f==='1'){ wp_remote_get($u,['timeout'=>40,'sslverify'=>false]); wp_remote_get(home_url('/'),['timeout'=>40,'sslverify'=>false]); wp_remote_get(home_url('/kategorija/katems/'),['timeout'=>40,'sslverify'=>false]); $r['pries']=$st();
      $h=wp_remote_get(home_url('/?ps_s1713h=6&nc='.mt_rand()),['timeout'=>60,'sslverify'=>false]); $r['vidine']=[wp_remote_retrieve_response_code($h),substr(wp_remote_retrieve_body($h),0,300)]; $r['po']=$st(); }
    if($f==='6'){ $r['pries']=$st(); $p=wc_get_product($pid); do_action('woocommerce_product_set_stock',$p); $r['eile']='shutdown'; $r['gcusd']=get_current_url_supercache_dir($pid); }
    if($f==='2'){ $r['dabar']=$st(); $r['dev_dir']=is_dir($cp.'supercache/dev.avesa.lt')?array_map('basename',glob($cp.'supercache/dev.avesa.lt/*')?:[]):'NERA'; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
