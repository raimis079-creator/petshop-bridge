<?php
/** Plugin Name: TEMP PS S1713d rejected_uri + valymo testas + fragmentai */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1713d'])) return;
  $f=$_GET['ps_s1713d']; @set_time_limit(170); global $wpdb; $r=['v'=>'S1713d','faze'=>$f];
  $cp=$GLOBALS['cache_path']??(WP_CONTENT_DIR.'/cache/'); $sc=$cp.'supercache/petshop.lt/';
  $rm=function($d) use(&$rm){ if(!is_dir($d)) return; foreach(glob($d.'/*')?:[] as $x){ is_dir($x)?$rm($x):@unlink($x); } @rmdir($d); };
  try{
  if($f==='1'){
    // cache_rejected_uri: prideti augintinio-profilis
    $cfgf=WP_CONTENT_DIR.'/wp-cache-config.php'; $bak=dirname(rtrim(ABSPATH,'/')).'/ps-archyvas/wp-cache-config.php.bak_s1713';
    if(!file_exists($bak)) copy($cfgf,$bak); $r['bak']=[$bak,md5_file($bak)];
    $cur=$GLOBALS['cache_rejected_uri']??[]; $r['pries']=$cur;
    if(!in_array('augintinio-profilis',$cur)){ $cur[]='augintinio-profilis'; $cur[]='refill-feedback'; }
    if(function_exists('wp_cache_setting')){ wp_cache_setting('cache_rejected_uri',$cur); $r['irasyta']='wp_cache_setting'; }
    else { $s=file_get_contents($cfgf); $n=preg_replace('#^\$cache_rejected_uri\s*=.*$#m','$cache_rejected_uri = '.var_export($cur,true).';',$s,1,$c); if($c!==1) throw new Exception('cache_rejected_uri eilute nerasta'); file_put_contents($cfgf,$n); $r['irasyta']='regex'; }
    $s2=file_get_contents($cfgf); preg_match('#\$cache_rejected_uri\s*=\s*(array\s*\(|\[)(.*?)(\)|\]);#s',$s2,$m); $r['po_eil']=substr(preg_replace('#\s+#',' ',$m[0]??''),0,400); $r['token']=(bool)@token_get_all($s2,TOKEN_PARSE);
    $rm($sc.'augintinio-profilis'); $r['aug_dir_po']=is_dir($sc.'augintinio-profilis');
    $h=wp_remote_get(home_url('/?nc='.mt_rand()),['timeout'=>40,'sslverify'=>false]); $r['heartbeat']=wp_remote_retrieve_response_code($h);
  }
  if($f==='2'){
    // patikra: augintinio-profilis nebekesuojamas; fragmentai/analitika HTML'e
    foreach(['/augintinio-profilis/','/refill-feedback/','/'] as $u){ $row=[]; for($i=0;$i<2;$i++){ $t=microtime(true); $h=wp_remote_get(home_url($u),['timeout'=>40,'sslverify'=>false]); $b=wp_remote_retrieve_body($h); $row[]=[round((microtime(true)-$t)*1000),wp_remote_retrieve_response_code($h),preg_match('#Cached page generated#',$b)?'CACHED':'-',wp_remote_retrieve_header($h,'cache-control')]; } $r['urls'][$u]=$row; }
    $b=wp_remote_retrieve_body(wp_remote_get(home_url('/'),['timeout'=>40,'sslverify'=>false]));
    $r['html']=['wc_cart_fragments'=>preg_match('#wc-cart-fragments|cart-fragments#',$b)?1:0,'ps_web_analitika'=>preg_match('#ps-web/v1|ps_web|psWeb#',$b)?1:0,'clarity'=>preg_match('#clarity\.ms#',$b)?1:0,'gtm'=>preg_match('#googletagmanager#',$b)?1:0,'nonce_wc'=>preg_match('#wc_ajax_url|wc-ajax#',$b)?1:0,'wpnonce_in_html'=>preg_match_all('#_wpnonce=([a-f0-9]{10})#',$b,$mm),'nonce_pvz'=>array_slice(array_unique($mm[1]??[]),0,3)];
    $r['cache_dirs']=array_map('basename',glob($sc.'*')?:[]);
    $r['rejected_dabar']=$GLOBALS['cache_rejected_uri']??null;
  }
  if($f==='3'){
    // valymo testas per petshop-cache.php kelia: prekes likutis keiciasi -> cache dingsta
    $pid=(int)$wpdb->get_var("SELECT ID FROM {$wpdb->posts} WHERE post_name='josera-sensiplus-125-kg-sausas-maistas-sunims-su-jautria-virskinimo-sistema' AND post_type='product'"); $r['pid']=$pid;
    $u=get_permalink($pid); $path=parse_url($u,PHP_URL_PATH); $d=$sc.trim($path,'/').'/';
    wp_remote_get($u,['timeout'=>40,'sslverify'=>false]); usleep(500000); wp_remote_get($u,['timeout'=>40,'sslverify'=>false]); clearstatcache();
    $r['po_uzklausu']=[$d,is_dir($d),array_map('basename',glob($d.'*')?:[]),'home'=>array_map('basename',glob($sc.'index*')?:[])];
    // imituojame likucio pakeitima taip, kaip daro WC (be realaus pokycio: ta pati reiksme)
    $p=wc_get_product($pid); $st=$p->get_stock_quantity(); $r['stock']=$st;
    do_action('woocommerce_product_set_stock',$p); clearstatcache();
    $r['po_set_stock']=[is_dir($d),array_map('basename',glob($d.'*')?:[]),'home'=>array_map('basename',glob($sc.'index*')?:[])];
    if(is_dir($d)&&function_exists('wp_cache_post_change')){ wp_cache_post_change($pid); clearstatcache(); $r['po_post_change']=[is_dir($d),array_map('basename',glob($d.'*')?:[])]; }
    $r['ps_cache_hooks']=array_slice(preg_split('#\n#',(string)@file_get_contents(WPMU_PLUGIN_DIR.'/petshop-cache.php')),0,0);
    preg_match_all("#add_action\(\s*'([^']+)'#",(string)@file_get_contents(WPMU_PLUGIN_DIR.'/petshop-cache.php'),$mm); $r['ps_cache_actions']=array_values(array_unique($mm[1]));
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
