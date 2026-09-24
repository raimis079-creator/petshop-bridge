<?php
/** Plugin Name: TEMP PS S1716o url_passthrough saltinis + Super Cache GET taisykle read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1716o'])) return;
  @set_time_limit(170); $r=['v'=>'S1716o'];
  try{
    foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/includes/*.php'),glob(get_stylesheet_directory().'/*.php')) as $g){ $s=file_get_contents($g); if(strpos($s,'url_passthrough')!==false){ preg_match_all('#[^\n]{0,200}url_passthrough[^\n]{0,120}#',$s,$m); preg_match('#Plugin Name:[^\n]*#',$s,$pn); preg_match('#Version:[^\n]*#',$s,$vv); $r['failai'][str_replace(ABSPATH,'',$g)]=['plugin'=>$pn[0]??'','versija'=>$vv[0]??'','md5'=>md5($s),'eil'=>array_map('trim',$m[0])]; } }
    global $wpdb; $r['snippets']=$wpdb->get_results("SELECT id, name, active FROM {$wpdb->prefix}snippets WHERE code LIKE '%url_passthrough%'",ARRAY_A);
    // Super Cache: kaip traktuoja GET parametrus
    $p1=WP_PLUGIN_DIR.'/wp-super-cache/wp-cache-phase1.php'; $s=file_get_contents($p1); preg_match('#function wpsc_is_get_query\(.*?\n\}#s',$s,$m); $r['wpsc_is_get_query']=substr($m[0]??'',0,1500);
    foreach(['wp-cache-phase1.php','wp-cache-phase2.php','wp-cache.php'] as $f){ $s=file_get_contents(WP_PLUGIN_DIR.'/wp-super-cache/'.$f); preg_match_all('#[^\n]{0,120}(tracking|utm_|fbclid|gclid|ignore_get|wpsc_get_params|cache_get_params)[^\n]{0,120}#i',$s,$m); if($m[0]) $r['sc_get'][$f]=array_slice(array_values(array_unique(array_map('trim',$m[0]))),0,10); }
    $r['sc_globals']=['wp_cache_no_cache_for_get'=>$GLOBALS['wp_cache_no_cache_for_get']??null,'wpsc_ignore_get'=>$GLOBALS['wpsc_ignore_get']??null,'wp_cache_tracking_parameters'=>$GLOBALS['wp_cache_tracking_parameters']??null];
    // ar /krepselis/?_gl=... ir /kategorija/katems/?_gl=... kesuojami
    foreach(['/kategorija/katems/?_gl=1*abc*_up*MQ..*_ga*x','/kategorija/katems/'] as $u){ $h=wp_remote_get(home_url($u),['timeout'=>40,'sslverify'=>false,'headers'=>['User-Agent'=>'Mozilla/5.0 Chrome/128']]); $b=wp_remote_retrieve_body($h); $r['kesas'][$u]=[wp_remote_retrieve_response_code($h),preg_match('#Cached page generated#',$b)?'CACHED':(preg_match('#Dynamic page generated#',$b)?'dynamic':'-'),wp_remote_retrieve_header($h,'cache-control')]; }
    $r['sutikimai']=$wpdb->get_results("SELECT sutikimas, COUNT(DISTINCT sesija) ses FROM {$wpdb->prefix}ps_web_ivykiai WHERE laikas>=DATE_SUB(NOW(),INTERVAL 7 DAY) AND testinis=0 GROUP BY sutikimas",ARRAY_A);
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
