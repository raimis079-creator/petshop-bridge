<?php
/** TEMP PS S1685 mh — TESTAS: soft opt-out įrašymas (laikinas useris + laikinas užsakymas, pažymėta/nepažymėta, email_link), vartai similar_ok; viskas ištrinama. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685mh'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 mh'); require_once ABSPATH.'wp-admin/includes/user.php';
  $em='test-s1685-sutikimai@petshop.lt'; if(get_user_by('email',$em)) wp_delete_user(get_user_by('email',$em)->ID);
  $uid=wp_create_user('test_s1685_sut',wp_generate_password(),$em); $o['uid']=$uid;
  foreach(array(0,1) as $v){ $_POST['ps_similar_optout']=$v?'1':''; $ord=wc_create_order(array('customer_id'=>$uid)); $ord->set_billing_email($em); Petshop_Sutikimai::irasyti($ord,array()); $ord->save();
    $o['t'.$v]=array('meta'=>$ord->get_meta('_ps_similar_optout'),'basis'=>$ord->get_meta('_ps_similar_basis'),'elig'=>get_user_meta($uid,'ps_soft_optin_eligible',true),'optout'=>get_user_meta($uid,'ps_similar_optout',true),'similar_ok'=>Petshop_Lifecycle_Vartai::similar_ok($em,$uid)); $ord->delete(true); }
  $u=Petshop_Sutikimai::optout_url($em); $o['url']=$u; parse_str(parse_url($u,PHP_URL_QUERY),$q); $_GET['ps_atsisakyti_priminimu']=$q['ps_atsisakyti_priminimu']; $_GET['z']=$q['z'];
  Petshop_Sutikimai::nustatyti($em,0,1,'email_link'); $o['po_link']=array('optout'=>get_user_meta($uid,'ps_similar_optout',true),'ok'=>Petshop_Lifecycle_Vartai::similar_ok($em,0));
  $o['log']=$wpdb->get_results($wpdb->prepare("SELECT customer_id,field,from_value,to_value,source,changed_at FROM {$p}ps_consent_log WHERE email=%s ORDER BY id",$em),ARRAY_A);
  $wpdb->delete($p.'ps_consent_log',array('email'=>$em)); wp_delete_user($uid); $o['isvalyta']=!get_user_by('email',$em);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
