<?php
/** Plugin Name: TEMP PS S1716r Super Cache tracking params _gl/_ga (1 nustatyti+patikra / 9 atstatyti) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1716r'])) return;
  $f=$_GET['ps_s1716r']; @set_time_limit(170); $r=['v'=>'S1716r','faze'=>$f];
  try{
    if($f==='1'){
      if(!function_exists('wp_cache_setting')) throw new Exception('wp_cache_setting nera');
      $cfg=WP_CONTENT_DIR.'/wp-cache-config.php'; $bak=dirname(rtrim(ABSPATH,'/')).'/ps-archyvas/wp-cache-config.php.bak_s1716b'; if(!file_exists($bak)) copy($cfg,$bak); $r['bak']=[$bak,md5_file($bak)];
      $r['pries']=['ignore'=>$GLOBALS['wpsc_ignore_tracking_parameters']??null,'list'=>$GLOBALS['wpsc_tracking_parameters']??null];
      wp_cache_setting('wpsc_ignore_tracking_parameters',1); wp_cache_setting('wpsc_tracking_parameters',['_gl','_ga']);
      $s=file_get_contents($cfg); preg_match_all('#^.*wpsc_(ignore_)?tracking_parameters.*$#m',$s,$m); $r['cfg_eil']=$m[0]; $r['token']=(bool)@token_get_all($s,TOKEN_PARSE);
      if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache();
      $h=wp_remote_get(home_url('/?nc='.mt_rand()),['timeout'=>40,'sslverify'=>false]); $b=wp_remote_retrieve_body($h); $r['html']=['kodas'=>wp_remote_retrieve_response_code($h),'passthrough_true'=>preg_match("#url_passthrough',\s*true#",$b)?1:0,'passthrough_false'=>preg_match("#url_passthrough',\s*false#",$b)?1:0,'v15'=>strpos($b,'Consent Bridge v1.5')!==false?1:0];
    }
    if($f==='3'){ foreach(['/kategorija/katems/','/kategorija/katems/?_gl=1*abc*_up*MQ..*_ga*x','/kategorija/katems/?_gl=1*zzz*_ga*y','/kategorija/katems/?utm_source=test'] as $u){ $h=wp_remote_get(home_url($u),['timeout'=>40,'sslverify'=>false,'headers'=>['User-Agent'=>'Mozilla/5.0 Chrome/128']]); $b=wp_remote_retrieve_body($h); $r['kesas'][$u]=[wp_remote_retrieve_response_code($h),preg_match('#Cached page generated#',$b)?'CACHED':(preg_match('#Dynamic page generated#',$b)?'dynamic':'-')]; } $r['cfg']=['ignore'=>$GLOBALS['wpsc_ignore_tracking_parameters']??null,'list'=>$GLOBALS['wpsc_tracking_parameters']??null]; }
    if($f==='9'){ wp_cache_setting('wpsc_ignore_tracking_parameters',0); wp_cache_setting('wpsc_tracking_parameters',''); if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); $r['atstatyta']=1; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
