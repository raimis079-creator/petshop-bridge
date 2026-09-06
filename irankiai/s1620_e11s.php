<?php
/** TEMP PS S1620 run e11s — S: Playwright kadras — darbalaukio sąrašas „Neišrūšiuoti“ po v3.35.2 (pilnas pavadinimas, „+ Naujas užsakymas“ tekstas). */
add_action('init', function(){
  if (!isset($_GET['ps_e11s'])) return;
  $o=array('v'=>'S1620 e11s'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+900; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $o['cookies']=array(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok)),array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok)),array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok)));
  $o['shots']=array(array('n'=>'s1620_e11_sarasas_neisrusiuoti_v3352','u'=>admin_url('admin.php?page=ps-desk&eile=nauji'),'w'=>1600,'h'=>900));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
