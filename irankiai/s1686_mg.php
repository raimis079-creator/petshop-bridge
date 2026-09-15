<?php
/** TEMP PS S1686 mg — PATIKRA (atskira užklausa): flows() win_back/refill_due klasė, cron, diena() (kandidatų dabar 0), win_back šablono render realiu užsakymu 35948 nesiunčiant (kaip s1685_mm). */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mg'])) return; $o=array('v'=>'S1686 mg');
  $fl=Petshop_Email_Dispatch::flows(); $o['flows']=array('win_back'=>isset($fl['win_back'])?$fl['win_back']:null,'refill_due'=>$fl['refill_due']);
  $o['cron_next']=wp_next_scheduled('ps_sugrazinimas_diena') ? get_date_from_gmt(gmdate('Y-m-d H:i:s',wp_next_scheduled('ps_sugrazinimas_diena'))) : null;
  Petshop_Sugrazinimas::diena(); $o['diena_log']=get_option('ps_sugrazinimas_pask');
  $oid=35948; $ord=wc_get_order($oid); $uid=$ord?$ord->get_customer_id():0; $email=$ord?$ord->get_billing_email():'';
  global $wpdb; $pid=(int)$wpdb->get_var($wpdb->prepare("SELECT product_id FROM {$wpdb->prefix}ps_refill_tracking WHERE user_id=%d AND last_order_id=%d LIMIT 1",$uid,$oid));
  $o['test']=array('uid'=>$uid,'pid'=>$pid);
  $path=apply_filters('petshop_email_template_path',PETSHOP_CORE_DIR.'templates/emails/win-back-60.php','win_back','win-back-60'); $o['tpl_path']=$path;
  $payload=array('product_id'=>$pid,'order_id'=>$oid); $flow_class='similar_soft_optin'; $recipient=$email; $subject='';
  ob_start(); include $path; $html=ob_get_clean(); $o['subject']=$subject; $o['html_len']=strlen($html);
  $o['tekstas']=trim(preg_replace('/\s+/',' ',strip_tags(str_replace('<','  <',$html)))); $o['tekstas']=mb_substr($o['tekstas'],0,900);
  $o['mygtukas']=preg_match('/href="([^"]*ps_pakartoti[^"]*)"/',$html,$m)?html_entity_decode($m[1]):null; $o['optout']=preg_match('/href="([^"]*ps_atsisakyti[^"]*)"/',$html,$m2)?'yra':'NĖRA'; $o['keisti']=strpos($html,'Keisti priminimą')!==false;
  $o['elig_test']=Petshop_Email_Dispatch::check_eligibility('similar_soft_optin',$email,'win_back',array('user_id'=>$uid,'product_id'=>$pid,'last_purchase_date'=>'2026-09-14'));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
