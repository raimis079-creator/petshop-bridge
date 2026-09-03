<?php
/** TEMP PS S1608 run e3t — Laukiam kortelė: recon + nuotraukos (testuotojas) */
add_action('init', function(){
  if (!isset($_GET['ps_e3t'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e3t'])); $o=array('v'=>'run e3t','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $u=get_user_by('login','testuotojas'); $uid=$u?$u->ID:1; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $cook=array(); foreach(array(array(SECURE_AUTH_COOKIE,'secure_auth'),array(AUTH_COOKIE,'auth'),array(LOGGED_IN_COOKIE,'logged_in')) as $c){ $cook[]=array('name'=>$c[0],'value'=>wp_generate_auth_cookie($uid,$exp,$c[1],$tok)); }
  $_COOKIE[LOGGED_IN_COOKIE]=$cook[2]['value']; wp_set_current_user($uid);
  $o['versija']=Petshop_Darbalaukis::VERSIJA; $o['md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php');
  $o['partijos']=$wpdb->get_results("SELECT p.id,p.tiekejas,p.busena,p.pristatymas,p.svoris,p.dezes,p.venipak_pack,(SELECT COUNT(*) FROM {$p}ps_tiekimas_eil e WHERE e.partija_id=p.id) n,(SELECT GROUP_CONCAT(DISTINCT e.order_id) FROM {$p}ps_tiekimas_eil e WHERE e.partija_id=p.id) uzs FROM {$p}ps_tiekimas p WHERE p.busena<>'gauta' ORDER BY p.id",ARRAY_A);
  $r=new ReflectionMethod('Petshop_Darbalaukis','atviri'); $r->setAccessible(true); $at=$r->invoke(null);
  $o['laukiam']=array(); foreach($at as $x){ if(in_array('laukiam',$x['eiles'],true)){ $e=array(); foreach($x['eil'] as $l){ $e[]=$l['q'].'x '.mb_substr($l['n'],0,25).' ['.$l['k'].'/'.$l['src'].'] '.$l['bukle']; } $o['laukiam'][$x['id']]=array('st'=>$x['st'],'rus'=>$x['rus'],'eiles'=>$x['eiles'],'eil'=>$e); } }
  $o['eiles_sk']=array(); foreach($at as $x){ foreach($x['eiles'] as $e){ $o['eiles_sk'][$e]=($o['eiles_sk'][$e]??0)+1; } }
  $B=admin_url('admin.php?page=ps-desk');
  $o['cookies']=$cook; $o['shots']=array(
    array('n'=>'e3_laukiam','u'=>$B.'&eile=laukiam','full'=>true,'eval'=>"({h2:[...document.querySelectorAll('.dl-kortele h2')].map(x=>x.innerText.replace(/\\s+/g,' ')),h3:[...document.querySelectorAll('.dl-tk-blk h3')].map(x=>x.innerText.replace(/\\s+/g,' ')),btn:[...document.querySelectorAll('.dl-zingsniai-k button,.dl-zingsniai-k a')].map(x=>x.innerText.trim()).filter(Boolean),msg:(document.querySelector('.pd-msg')||{}).innerText,eiles:(document.querySelector('.dl-eiles')||{}).innerText})"),
    array('n'=>'e3_laukiam_perz','u'=>$B.'&eile=laukiam','click'=>'.dl-perz','eval'=>"({perz:(document.querySelector('.dl-perz-t')||{}).innerText})"),
    array('n'=>'e3_laukiam_sk','u'=>$B.'&eile=laukiam','click'=>'tr.eil','eval'=>"new Promise(function(r){setTimeout(function(){r({kur:(document.querySelector('.dl-kur')||{}).textContent,zing:[...document.querySelectorAll('#skEil .zingsneliai')].map(x=>x.innerText.replace(/\\s+/g,' ')),tiek:[...document.querySelectorAll('#skEil .kodel a')].map(a=>a.innerText+' '+a.getAttribute('href'))})},1200)})"),
    array('n'=>'e3_rytas','u'=>$B.'&view=rytas','eval'=>"({z:[...document.querySelectorAll('.dl-z')].map(x=>x.innerText.replace(/\\s+/g,' ')),urls:[...document.querySelectorAll('.dl-z a')].map(a=>a.getAttribute('href'))})"),
    array('n'=>'e3_laukiam_mob','u'=>$B.'&eile=laukiam','w'=>420,'h'=>900),
  );
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
