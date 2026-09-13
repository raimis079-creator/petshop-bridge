<?php
/** TEMP PS S1679 e — read-only: ar rinkiklis vėl rašo įvykius; fatal žurnalas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1679e'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1679 e','dabar'=>current_time('mysql'));
  $o['siandien']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_web_ivykiai WHERE diena=CURDATE()");
  $o['pask']=$wpdb->get_results("SELECT laikas,tipas,url_kelias,saltinis,irenginys FROM {$p}ps_web_ivykiai ORDER BY id DESC LIMIT 4",ARRAY_A);
  $log=dirname(ABSPATH).'/logs/php_error.log'; $o['fatal']=file_exists($log)?array_values(array_map(function($l){return substr($l,0,220);},array_filter(array_slice(file($log),-40),function($l){return stripos($l,'fatal')!==false||stripos($l,'redeclare')!==false;}))):null;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
