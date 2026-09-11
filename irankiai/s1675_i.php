<?php
/** TEMP PS S1675 run i — 4 patikra: ini po wp-config, testinis Warning į logs/php_error.log. */
add_action('init', function(){
  if (!isset($_GET['ps_i5'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1675 i');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['ini']=array('display'=>ini_get('display_errors'),'log'=>ini_get('log_errors'),'file'=>ini_get('error_log'));
  trigger_error('S1675 testinis warning',E_USER_WARNING);
  $lf=dirname(ABSPATH).'/logs/php_error.log'; $o['log']=file_exists($lf)?array('dydis'=>filesize($lf),'uodega'=>array_slice(array_filter(explode("\n",substr(file_get_contents($lf),-1500))),-3)):'NERA';
  $o['ping']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),array('timeout'=>30,'sslverify'=>false)));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
