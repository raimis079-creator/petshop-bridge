<?php
/** TEMP PS S1608 run e3v — nuotraukos po trijų sandėlių testo */
add_action('init', function(){
  if (!isset($_GET['ps_e3v'])) return;
  $o=array('v'=>'run e3v'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $u=get_user_by('login','testuotojas'); $uid=$u?$u->ID:1; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  foreach(array(array(SECURE_AUTH_COOKIE,'secure_auth'),array(AUTH_COOKIE,'auth'),array(LOGGED_IN_COOKIE,'logged_in')) as $c){ $o['cookies'][]=array('name'=>$c[0],'value'=>wp_generate_auth_cookie($uid,$exp,$c[1],$tok)); }
  $oid=(int)get_option('ps_e3_oid'); $B=admin_url('admin.php?page=ps-desk');
  $o['shots']=array(
    array('n'=>'e3_t2_surinkti','u'=>$B.'&eile=surinkti&atidaryti='.$oid,'eval'=>"new Promise(function(r){setTimeout(function(){r({kur:(document.querySelector('.dl-kur')||{}).textContent,zing:[...document.querySelectorAll('#skEil .zingsneliai')].map(x=>x.innerText.replace(/\\s+/g,' ')),kodel:[...document.querySelectorAll('#skEil .kodel')].map(x=>x.innerText.replace(/\\s+/g,' '))})},1500)})"),
    array('n'=>'e3_t2_lapas','u'=>admin_url('admin.php?page=ps-lapai&ids='.$oid),'full'=>true,'eval'=>"({t:document.body.innerText.replace(/\\s+/g,' ').slice(0,500)})"),
  );
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
