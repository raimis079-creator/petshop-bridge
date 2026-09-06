<?php
/** TEMP PS S1627 k — kadrai: juosta „Ataskaitos ▾“ atidaryta (Inga #5788 akimis — ps_darbuotojas) darbalaukyje ir ataskaitoje ps-prekes. */
add_action('init', function(){
  if (!isset($_GET['ps_k2'])) return;
  $o=array('v'=>'S1627 k'); global $wpdb; $p=$wpdb->prefix; $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $uid=5788; $exp=time()+900; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $o['cookies']=array(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok)),array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok)),array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok)));
  $o['shots']=array(array('n'=>'s1627_juosta_ataskaitos_inga','u'=>admin_url('admin.php?page=ps-desk'),'w'=>1440,'h'=>500,'click'=>'.psj-dd-b'),array('n'=>'s1627_ataskaita_prekes_inga','u'=>admin_url('admin.php?page=ps-prekes'),'w'=>1440,'h'=>700));
  header('Content-Type: application/json'); echo json_encode($o); exit;
},99);
