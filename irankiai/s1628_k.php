<?php
/** TEMP PS S1628 k — kadras: kliento (#5787) užsakymo #35826 puslapis po petshop-klientui v1.0 (tik „Spausdinti sąskaitą“). */
add_action('init', function(){
  if (!isset($_GET['ps_k3'])) return;
  $o=array('v'=>'S1628 k'); global $wpdb; $p=$wpdb->prefix; $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $uid=5787; $exp=time()+900; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $o['cookies']=array(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok)),array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok)),array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok)));
  $o['shots']=array(array('n'=>'s1628_klientas_uzsakymas_35826','u'=>wc_get_endpoint_url('view-order',35826,wc_get_page_permalink('myaccount')),'w'=>1440,'h'=>1400,'full'=>1));
  header('Content-Type: application/json'); echo json_encode($o); exit;
},99);
