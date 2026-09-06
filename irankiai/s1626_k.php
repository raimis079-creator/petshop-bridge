<?php
/** TEMP PS S1626 k — kadras: tuščia Dropshipping eilė su tiekėjų mygtukais (v3.39.2) ir `tiek=zb` tuščia kortelė. */
add_action('init', function(){
  if (!isset($_GET['ps_k1'])) return;
  $o=array('v'=>'S1626 k'); global $wpdb; $p=$wpdb->prefix; $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+900; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $o['cookies']=array(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok)),array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok)),array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok)));
  $o['shots']=array(array('n'=>'s1626_tuscia_dropshipping','u'=>admin_url('admin.php?page=ps-desk&eile=laiskai'),'w'=>1440,'h'=>600),array('n'=>'s1626_tiek_zb','u'=>admin_url('admin.php?page=ps-desk&eile=laiskai&tiek=zb'),'w'=>1440,'h'=>800,'click'=>'.dl-rink[data-src="zb"] .dl-rink-atv'));
  header('Content-Type: application/json'); echo json_encode($o); exit;
},99);
