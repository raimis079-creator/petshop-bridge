<?php
/** TEMP PS S1665 j — E2E: POST į webhook su teisingu HMAC (DB secret) + ps_topic fallback; tikrinam žurnalą ir routing. */
add_action('init', function(){
  if (!isset($_GET['ps_s1665j'])) return;
  $o=array('v'=>'S1665 j');
  $secret=get_option('petshop_esp_sender_webhook_secret','');
  $body=json_encode(array('data'=>array('email'=>'s1665-test@petshop.lt')));
  $sig=hash_hmac('sha256',$body,$secret);
  $u=home_url('/?rest_route=/petshop/v1/sender-webhook&ps_topic=bounces/new');
  $r=wp_remote_post($u,array('timeout'=>20,'body'=>$body,'headers'=>array('Content-Type'=>'application/json','x-sender-signature'=>$sig)));
  $o['atsakas']=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r).' '.mb_substr(wp_remote_retrieve_body($r),0,300);
  wp_cache_delete('ps_sender_webhook_log','options');
  $zl=(array)get_option('ps_sender_webhook_log',array());
  $o['zurnale']=count($zl); $o['pask']=$zl?end($zl):null;
  // suppression irasas testiniam
  global $wpdb; $p=$wpdb->prefix;
  $o['suppr']=$wpdb->get_row($wpdb->prepare("SELECT channel,reason,source FROM {$p}ps_email_suppression WHERE email=%s ORDER BY id DESC LIMIT 1",'s1665-test@petshop.lt'),ARRAY_A);
  // isvalom testini suppression
  $o['isvalyta']=(int)$wpdb->query($wpdb->prepare("DELETE FROM {$p}ps_email_suppression WHERE email=%s",'s1665-test@petshop.lt'));
  wp_send_json($o);
});
