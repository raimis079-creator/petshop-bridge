<?php
/** TEMP PS S1620 run e14s — S: Playwright kadras — „Visi“ su filtrais nuo–iki + Atšaukti chip (v3.36). */
add_action('init', function(){
  if (!isset($_GET['ps_e14s'])) return;
  $o=array('v'=>'S1620 e14s'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+900; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $o['cookies']=array(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok)),array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok)),array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok)));
  $o['shots']=array(array('n'=>'s1620_e14_visi_filtrai_v336','u'=>admin_url('admin.php?page=ps-desk&eile=visi&nuo=2026-09-05&iki=2026-09-06&mok=grynais'),'w'=>1600,'h'=>900),array('n'=>'s1620_e14_visi_atsaukti_v336','u'=>admin_url('admin.php?page=ps-desk&eile=visi&b=atsaukti'),'w'=>1600,'h'=>700,'click'=>'.dl-f-tog'));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
