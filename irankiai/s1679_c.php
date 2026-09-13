<?php
/** TEMP PS S1679 c — read-only: kodėl ps_web_ivykiai 0 nuo 09-13. */
add_action('init', function(){
  if (!isset($_GET['ps_s1679c'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1679 c','dabar'=>current_time('mysql'));
  $o['dienos']=$wpdb->get_results("SELECT diena,COUNT(*) n,MAX(laikas) pask FROM {$p}ps_web_ivykiai WHERE diena>=DATE_SUB(CURDATE(),INTERVAL 3 DAY) GROUP BY 1",ARRAY_A);
  $o['err']=$wpdb->last_error;
  $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_web_ivykiai");
  $o['pask']=$wpdb->get_row("SELECT * FROM {$p}ps_web_ivykiai ORDER BY id DESC LIMIT 1",ARRAY_A);
  $o['klase']=class_exists('Petshop_Analitika')?(new ReflectionClass('Petshop_Analitika'))->getFileName():'NERA';
  $sn=$wpdb->get_results("SELECT id,name,active FROM {$p}snippets WHERE name LIKE '%nalitik%' OR code LIKE '%ps_web_ivykiai%'",ARRAY_A); $o['snippets']=$sn;
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ if(strpos(file_get_contents($f),'ps_web_ivykiai')!==false) $o['mu'][]=basename($f); }
  foreach(glob(WP_PLUGIN_DIR.'/petshop-*/*.php') as $f){ if(strpos(file_get_contents($f),'ps_web_ivykiai')!==false) $o['pl'][]=str_replace(WP_PLUGIN_DIR,'',$f); }
  foreach(glob(WP_PLUGIN_DIR.'/petshop-*/includes/*.php') as $f){ if(strpos(file_get_contents($f),'ps_web_ivykiai')!==false) $o['pl'][]=str_replace(WP_PLUGIN_DIR,'',$f); }
  $o['htaccess']=substr(file_get_contents(ABSPATH.'.htaccess'),0,1500);
  $log=dirname(ABSPATH).'/logs/php_error.log'; if(file_exists($log)){ $l=file($log); $o['log_tail']=array_slice($l,-15); }
  $r=wp_remote_get('https://petshop.lt/?rest_route=/ps-web/v1/ivykis',array('timeout'=>10)); $o['rest_ivykis']=is_wp_error($r)?$r->get_error_message():array(wp_remote_retrieve_response_code($r),substr(wp_remote_retrieve_body($r),0,200));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
