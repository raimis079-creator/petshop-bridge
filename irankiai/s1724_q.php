<?php
/** Plugin Name: TEMP PS S1724q Super Cache Expert dry: sugeneruotos mod_rewrite taisykles, .htaccess dabar, cache config, WC slapukai read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724q2'])) return; $r=['v'=>'S1724q2']; @set_time_limit(120); require_once ABSPATH.'wp-admin/includes/misc.php'; require_once ABSPATH.'wp-admin/includes/file.php';
  try{
    $ht=ABSPATH.'.htaccess'; $s=file_get_contents($ht); $r['htaccess']=$s; $r['ht_md5']=md5($s); $r['ht_len']=strlen($s);
    if(!function_exists('wpsc_get_htaccess_info')){ foreach([WP_PLUGIN_DIR.'/wp-super-cache/wp-cache.php'] as $fx){} }
    $cand=[WP_PLUGIN_DIR.'/wp-super-cache/inc/htaccess.php', WP_PLUGIN_DIR.'/wp-super-cache/wp-cache.php'];
    foreach($cand as $fx){ if(is_file($fx)) $r['wpsc_files'][]=basename($fx); }
    if(function_exists('wpsc_get_htaccess_info')){ $i=wpsc_get_htaccess_info(); $r['rules']=$i['rules']??null; $r['gziprules']=$i['gziprules']??null; $r['info_keys']=array_keys($i); }
    else { $r['wpsc_get_htaccess_info']='NERA'; $fn=get_defined_functions()['user']; $r['wpsc_fn']=array_values(array_filter($fn,function($x){return strpos($x,'htaccess')!==false||strpos($x,'mod_rewrite')!==false;})); }
    global $wp_cache_mod_rewrite,$cache_enabled,$super_cache_enabled,$wp_cache_not_logged_in,$cache_max_time,$wp_cache_no_cache_for_get,$cache_rebuild_files,$wp_cache_mobile_enabled,$wp_cache_mobile_browsers,$wp_cache_config_file,$cache_path,$wp_cache_home_path,$wpsc_version;
    $r['cfg']=compact('wp_cache_mod_rewrite','cache_enabled','super_cache_enabled','wp_cache_not_logged_in','cache_max_time','wp_cache_no_cache_for_get','cache_rebuild_files','wp_cache_mobile_enabled','cache_path','wp_cache_home_path','wpsc_version');
    $r['rejected_cookies']=function_exists('wpsc_get_rejected_cookies')?wpsc_get_rejected_cookies():'nera f-jos'; $r['cookie_filter']=apply_filters('wpsc_rejected_cookies',[]);
    $r['plugins_wpsc']=glob(WP_PLUGIN_DIR.'/wp-super-cache/plugins/*.php'); $r['plugins_wpsc']=array_map('basename',$r['plugins_wpsc']);
    global $wp_cache_plugins_dir; $r['wpsc_plugins_dir']=$wp_cache_plugins_dir??null; $r['wpsc_wc_plugin_enabled']=function_exists('wpsc_get_plugins')?null:null;
    $r['plugins_enabled_opt']=get_option('wpsc_plugins');
    $r['supercache_psl']=count(glob(WP_CONTENT_DIR.'/cache/supercache/petshop.lt/*/index-https.html')?:[]);
    $r['bak_yra']=is_file(dirname(untrailingslashit(ABSPATH)).'/ps-archyvas/.htaccess.bak_s1724');
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
