<?php
/** TEMP PS S1685 mz — testinis refill_due „Pakartoti užsakymą" laiškas Raimiui (terra@gyvunai.lt): renderis realiu užsakymu 35948, atsisakymo nuoroda pakeista į terra (kad paspaudus neatsisakytų klientas), siunčiama wp_mail. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685mz'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 mz'); $uid=2530; $oid=35948; $terra='terra@gyvunai.lt';
  $pid=(int)$wpdb->get_var($wpdb->prepare("SELECT product_id FROM {$p}ps_refill_tracking WHERE user_id=%d AND last_order_id=%d LIMIT 1",$uid,$oid)); $em=get_user_by('id',$uid)->user_email;
  $x=Petshop_Email_Dispatch::render('refill_due',array('product_id'=>$pid,'product_name'=>'x','feedback_url'=>home_url('/')),array('flow_class'=>'service','recipient_email'=>$em));
  $h=str_replace(array(Petshop_Sutikimai::optout_url($em),$em),array(Petshop_Sutikimai::optout_url($terra),$terra),$x['html']);
  $o['liko_kliento_email']=strpos($h,$em)!==false;
  add_filter('wp_mail_content_type',function(){return 'text/html';});
  $o['sent']=wp_mail($terra,'[TESTAS] '.$x['subject'],$h); $o['subject']=$x['subject']; $o['len']=strlen($h);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
