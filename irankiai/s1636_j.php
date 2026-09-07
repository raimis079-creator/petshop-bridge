<?php
/** TEMP PS S1636 run j — READ-ONLY: ps-katalogas sokinejimo diagnostika (testuotojas cookies; kadrai virsuje ir po scroll; --ps-virsus, .pskat-bar pozicijos, sticky thead top). */
add_action('init', function(){
  if (!isset($_GET['ps_s1636j'])) return;
  $o=array('v'=>'S1636 j'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+1200;
  $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $o['cookies']=array(
    array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok)),
    array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))
  );
  $m='(function(){var cs=getComputedStyle(document.documentElement);var b=document.querySelector(".pskat-bar");var th=document.querySelector(".pskat-t thead th");return {virsus:cs.getPropertyValue("--ps-virsus"),bar:b?Math.round(b.getBoundingClientRect().bottom):null,bar_pos:b?getComputedStyle(b).position:null,th_top:th?getComputedStyle(th).top:null,th_rect:th?Math.round(th.getBoundingClientRect().top):null,scrollY:Math.round(window.scrollY)};})()';
  $F='(function(){var cs=getComputedStyle(document.documentElement);var b=document.querySelector(".pskat-bar");var th=document.querySelector(".pskat-t thead th");return {virsus:cs.getPropertyValue("--ps-virsus"),bar:b?Math.round(b.getBoundingClientRect().bottom):null,bar_pos:b?getComputedStyle(b).position:null,th_top:th?getComputedStyle(th).top:null,th_rect:th?Math.round(th.getBoundingClientRect().top):null,scrollY:Math.round(window.scrollY)};})';
  $u=admin_url('admin.php?page=ps-katalogas');
  $o['shots']=array(
    array('n'=>'s1636_j_virsus','u'=>$u,'w'=>1440,'h'=>900,'eval'=>$m),
    array('n'=>'s1636_j_scroll','u'=>$u,'w'=>1440,'h'=>900,'eval'=>'new Promise(r=>{window.scrollTo(0,700);setTimeout(function(){r(('.$F.')())},800)})')
  );
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
