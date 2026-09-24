<?php
/** Plugin Name: TEMP PS S1713a WP_CACHE ijungimas (1 deploy / 2 patikra / 3 valymo testas / 9 atstatyti) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1713a'])) return;
  $f=$_GET['ps_s1713a']; @set_time_limit(170); global $wpdb; $r=['v'=>'S1713a','faze'=>$f];
  $cfg=ABSPATH.'wp-config.php'; $arch=dirname(rtrim(ABSPATH,'/')).'/ps-archyvas/'; $bak=$arch.'wp-config.php.bak_s1713';
  $hb=function() use(&$r){ $h=wp_remote_get(home_url('/?nc='.mt_rand()),['timeout'=>40,'sslverify'=>false]); $c=is_wp_error($h)?0:wp_remote_retrieve_response_code($h); $r['heartbeat']=$c; return $c; };
  try{
  if($f==='1'){
    $r['cfg']=[$cfg,file_exists($cfg),is_writable($cfg),filesize($cfg),md5_file($cfg)]; $r['arch']=[$arch,is_dir($arch),is_writable($arch)];
    $s=file_get_contents($cfg);
    if(preg_match('#WP_CACHE#',$s)){ $r['skip']='WP_CACHE eilute jau yra'; preg_match_all('#^.*WP_CACHE.*$#m',$s,$m); $r['eil']=$m[0]; }
    else {
      if(!file_exists($bak)){ if(!copy($cfg,$bak)) throw new Exception('bak nepavyko'); } $r['bak']=[$bak,md5_file($bak)];
      $n=preg_replace('#^(<\?php[^\n]*\n)#','$1define(\'WP_CACHE\', true); // S1713 2026-09-24 WP Super Cache\n',$s,1,$cnt);
      if($cnt!==1) throw new Exception('nerasta <?php pradzia');
      $tok=@token_get_all($n,TOKEN_PARSE); if(!$tok) throw new Exception('token_get_all nepavyko');
      if(file_put_contents($cfg,$n)===false) throw new Exception('irasyti nepavyko');
      $r['nauja_md5']=md5_file($cfg); preg_match_all('#^.*WP_CACHE.*$#m',file_get_contents($cfg),$m); $r['eil']=$m[0];
      $c=$hb(); if($c>=500||$c==0){ copy($bak,$cfg); $r['ROLLBACK']='heartbeat '.$c.' -> atstatyta is bak'; }
    }
  }
  if($f==='2'){
    $r['WP_CACHE']=defined('WP_CACHE')?WP_CACHE:null; $r['globals']=['cache_enabled'=>$GLOBALS['cache_enabled']??null,'super_cache_enabled'=>$GLOBALS['super_cache_enabled']??null,'wp_cache_not_logged_in'=>$GLOBALS['wp_cache_not_logged_in']??null,'mod_rewrite'=>$GLOBALS['wp_cache_mod_rewrite']??null,'max_time'=>$GLOBALS['cache_max_time']??null];
    $ua=['User-Agent'=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128'];
    $urls=['/','/kategorija/katems/','/product/josera-sensiplus-125-kg-sausas-maistas-sunims-su-jautria-virskinimo-sistema/','/skaiciuokle/','/taksas/','/krepselis/','/kasa/','/paskyra/','/augintinio-profilis/','/parduotuve/?orderby=price'];
    foreach($urls as $u){ $row=[]; for($i=0;$i<3;$i++){ $t=microtime(true); $h=wp_remote_get(home_url($u),['timeout'=>40,'sslverify'=>false,'headers'=>$ua]); $ms=round((microtime(true)-$t)*1000); $b=is_wp_error($h)?'':wp_remote_retrieve_body($h); preg_match_all('#<!--\s*(Dynamic page generated|Cached page generated|Cache Enabled|super cache|WP-Super-Cache|Cached page served)[^>]{0,110}-->#i',$b,$m); $row[]=['ms'=>$ms,'kodas'=>is_wp_error($h)?'ERR':wp_remote_retrieve_response_code($h),'kb'=>round(strlen($b)/1024),'koment'=>array_slice(array_map(function($x){return substr($x,0,80);},$m[0]),0,2),'kaina'=>preg_match('#woocommerce-Price-amount#',$b)?1:0,'cmplz'=>preg_match('#cmplz|complianz#i',$b)?1:0,'modal'=>preg_match('#psw-b1|ps-welcome#i',$b)?1:0,'cc'=>wp_remote_retrieve_header($h,'cache-control')]; if($i<2) usleep(300000);} $r['urls'][$u]=$row; }
    $cp=$GLOBALS['cache_path']??(WP_CONTENT_DIR.'/cache/'); $dir=$cp.'supercache/petshop.lt/'; $r['cache_failai']=[is_dir($dir),count(glob($dir.'*')?:[]),array_slice(array_map('basename',glob($dir.'*')?:[]),0,15)];
    $r['cached_nelauktini']=array_values(array_filter(array_map('basename',glob($dir.'*')?:[]),function($d){return preg_match('#krepsel|kasa|paskyr|augintin|checkout|cart#',$d);}));
    $r['php_err_tail']=array_slice(file(dirname(rtrim(ABSPATH,'/')).'/logs/php_error.log')?:[],-8);
  }
  if($f==='3'){
    // valymo testas: prekes puslapis -> cache failas -> wp_cache_post_change -> failas dingsta
    $pid=(int)$wpdb->get_var("SELECT ID FROM {$wpdb->posts} WHERE post_name='josera-sensiplus-125-kg-sausas-maistas-sunims-su-jautria-virskinimo-sistema' AND post_type='product'"); $r['pid']=$pid;
    $u=get_permalink($pid); $path=parse_url($u,PHP_URL_PATH); $cp=$GLOBALS['cache_path']??(WP_CONTENT_DIR.'/cache/'); $d=$cp.'supercache/petshop.lt'.rtrim($path,'/').'/';
    wp_remote_get($u,['timeout'=>40,'sslverify'=>false]); sleep(1); wp_remote_get($u,['timeout'=>40,'sslverify'=>false]);
    $r['po_uzklausu']=[$d,is_dir($d),array_map('basename',glob($d.'*')?:[])];
    if(function_exists('wp_cache_post_change')){ wp_cache_post_change($pid); clearstatcache(); $r['po_post_change']=[is_dir($d),array_map('basename',glob($d.'*')?:[])]; } else $r['po_post_change']='wp_cache_post_change nera';
    $r['ps_cache_mu']=file_exists(WPMU_PLUGIN_DIR.'/petshop-cache.php');
    $r['home_cache']=[is_dir($cp.'supercache/petshop.lt/'),array_map('basename',glob($cp.'supercache/petshop.lt/index*')?:[])];
  }
  if($f==='9'){
    if(!file_exists($bak)) throw new Exception('bak nera');
    copy($bak,$cfg); $r['atstatyta']=md5_file($cfg)===md5_file($bak); $hb();
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
