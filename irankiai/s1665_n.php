<?php
/** TEMP PS S1665 n — READ-ONLY: ps_ads_recon busena. */
add_action('init', function(){
  if (!isset($_GET['ps_s1665n'])) return;
  $r=get_option('ps_ads_recon');
  wp_send_json(array('v'=>'S1665 n','kada'=>$r['kada']??'NERA','dydis'=>$r['dydis']??0,'pradzia'=>mb_substr((string)($r['body']??''),0,200)));
});
