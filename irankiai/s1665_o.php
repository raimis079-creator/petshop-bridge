<?php
/** TEMP PS S1665 o — READ-ONLY: ps_ads_recon body gz+b64. */
add_action('init', function(){
  if (!isset($_GET['ps_s1665o'])) return;
  $r=get_option('ps_ads_recon');
  wp_send_json(array('v'=>'S1665 o','kada'=>$r['kada']??'','dydis'=>$r['dydis']??0,'b64'=>base64_encode(gzencode((string)($r['body']??''),9))));
});
