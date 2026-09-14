<?php
/** TEMP PS S1681 ae — read-only: WP Mail SMTP host/user (be slaptažodžio) + testinis laiškas į uzsakymai@petshop.lt. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681ae'])) return; $o=array('v'=>'S1681 ae'); $s=get_option('wp_mail_smtp');
  $o['mailer']=$s['mail']['mailer']??''; $o['smtp']=array('host'=>$s['smtp']['host']??'','port'=>$s['smtp']['port']??'','enc'=>$s['smtp']['encryption']??'','auth'=>$s['smtp']['auth']??'','user'=>$s['smtp']['user']??'','pass_len'=>strlen((string)($s['smtp']['pass']??'')));
  $o['test']=wp_mail('uzsakymai@petshop.lt','PS testas po slaptažodžio keitimo '.date('H:i'),'Jei gavai — WP Mail SMTP dar veikia.');
  global $wpdb; $o['debug']=$wpdb->get_results("SELECT LEFT(content,200) c,created_at FROM {$wpdb->prefix}wpmailsmtp_debug_events ORDER BY id DESC LIMIT 2",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
