<?php
/** TEMP PS S1664 a — READ-ONLY: zb/vf cron paieška, titulinis img, sender webhook log, ps_*_bak sąrašas, 404 legacy. */
add_action('init', function(){
  if (!isset($_GET['ps_s1664a'])) return;
  $o=array('v'=>'S1664 a'); global $wpdb; $p=$wpdb->prefix;
  // 1. zb/vf cron pilna paieška
  $cr=_get_cron_array(); $hits=array();
  foreach($cr as $ts=>$hooks){ foreach($hooks as $h=>$x){ if(stripos($h,'zb')!==false||stripos($h,'vf')!==false||stripos($h,'import')!==false) $hits[$h]=date('m-d H:i',$ts); } }
  $o['cron_zb_vf_import']=$hits;
  // 2. titulinis img
  $r=wp_remote_get(home_url('/'),array('timeout'=>20));
  if(!is_wp_error($r)){ $h=wp_remote_retrieve_body($r); $o['titulinis']=array('code'=>wp_remote_retrieve_response_code($r),'img'=>preg_match_all('/<img[\s>]/i',$h),'ilgis'=>strlen($h)); }
  else $o['titulinis']=array('err'=>$r->get_error_message());
  // 3. sender webhook log
  $wl=get_option('ps_sender_webhook_log','NERA');
  $o['sender_webhook_log']=is_array($wl)?array('n'=>count($wl),'pask'=>end($wl)):(is_string($wl)?mb_substr($wl,0,120):$wl);
  // 4. ps_*_bak
  $bak=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE 'ps\_%\_bak' OR option_name LIKE 'ps\_%bak%'");
  $o['bak_n']=count($bak); $o['bak']=array_slice($bak,0,50);
  // 5. 404/301 legacy pavyzdžiai
  foreach(array('/katalogas/sunims','/prekes/kate-maistas','/nesamas-xyz-123') as $u){
    $r=wp_remote_get(home_url($u),array('timeout'=>15,'redirection'=>0));
    $o['legacy'][$u]=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r).' '.substr((string)wp_remote_retrieve_header($r,'location'),0,80);
  }
  wp_send_json($o);
});
