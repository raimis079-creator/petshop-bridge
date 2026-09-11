<?php
/** TEMP PS S1675 run h — 3: ps_bak_arch gz perkėlimas už webroot; 4: wp-config PHP klaidų žurnalas (display_errors 0, log_errors 1, error_log logs/php_error.log). DRY/APPLY. */
add_action('init', function(){
  if (!isset($_GET['ps_h5'])) return; $f=$_GET['ps_h5']; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1675 h','faze'=>$f);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $home=dirname(ABSPATH); $arch=$home.'/ps-archyvas'; $src=WP_CONTENT_DIR.'/uploads/ps_bak_arch_20260909.json.gz';
  $o['arch']=array('src'=>file_exists($src)?filesize($src):'NERA','dest_dir'=>$arch,'home_writable'=>is_writable($home),'logs_dir'=>is_dir($home.'/logs')?(is_writable($home.'/logs')?'rašomas':'nerašomas'):'NERA');
  $cfg=ABSPATH.'wp-config.php'; $c=file_get_contents($cfg); $o['cfg']=array('md5'=>md5($c),'turi_bloka'=>(int)(strpos($c,'S1675')!==false),'inkaras'=>(int)(strpos($c,"define('WP_DEBUG_DISPLAY', false);")!==false),'ini_dabar'=>array('display'=>ini_get('display_errors'),'log'=>ini_get('log_errors'),'file'=>ini_get('error_log')));
  if($f==='APPLY'){
    if(!is_dir($arch)) mkdir($arch,0700); if(file_exists($src)){ $o['arch']['moved']=rename($src,$arch.'/ps_bak_arch_20260909.json.gz'); $o['arch']['dest_md5']=md5_file($arch.'/ps_bak_arch_20260909.json.gz'); }
    $o['arch']['http_po']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/wp-content/uploads/ps_bak_arch_20260909.json.gz'),array('timeout'=>20,'sslverify'=>false)));
    if(!$o['cfg']['turi_bloka'] && $o['cfg']['inkaras']){
      $blk="define('WP_DEBUG_DISPLAY', false);\n// S1675 (2026-09-12): PHP klaidų žurnalas už webroot; klaidos lankytojams nerodomos\n@ini_set('display_errors', '0');\n@ini_set('log_errors', '1');\n@ini_set('error_log', dirname(__DIR__) . '/logs/php_error.log');\n";
      $n=str_replace("define('WP_DEBUG_DISPLAY', false);\n",$blk,$c,$cnt); $o['cfg']['pakeitimai']=$cnt;
      try{ token_get_all($n,TOKEN_PARSE); }catch(Throwable $e){ $o['cfg']['stop']='parse'; header('Content-Type: application/json'); echo json_encode($o); exit; }
      copy($cfg,$arch.'/wp-config.php.bak_s1675'); file_put_contents($cfg,$n); $o['cfg']['irasyta']=md5_file($cfg);
      $r=wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)); $o['ping']=wp_remote_retrieve_response_code($r); if($o['ping']>=500){ copy($arch.'/wp-config.php.bak_s1675',$cfg); $o['rollback']=1; }
    }
  }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
