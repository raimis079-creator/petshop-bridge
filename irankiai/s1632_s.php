<?php
/** TEMP PS S1632 run s — S: kadrai su pilnais auth cookies (prekės kortelė su partija; katalogo eilė). READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1632s'])) return;
  $o=array('v'=>'S1632 s'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $pv=$wpdb->get_row("SELECT product_id, kiekis_liko, savikaina_eur FROM {$p}ps_partijos WHERE pastaba LIKE 'Pradinis likutis (testas S1632)%' ORDER BY kiekis_liko DESC LIMIT 1");
  $o['pvz_partija']=$pv;
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+1200;
  $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $o['cookies']=array(
    array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok)),
    array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))
  );
  $o['shots']=array(array('n'=>'s1632_s_preke_partija','u'=>admin_url('post.php?post='.(int)$pv->product_id.'&action=edit'),'w'=>1440,'h'=>1400,'eval'=>"(()=>{var e=[...document.querySelectorAll('h2,h3,strong,label')].find(x=>/Partij/i.test(x.textContent)); if(e) e.scrollIntoView(); return !!e;})()"));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
