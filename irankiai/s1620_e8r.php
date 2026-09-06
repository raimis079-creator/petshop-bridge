<?php
/** TEMP PS S1620 run e8r — R: darbuotojo rolės `ps_darbuotojas` teisės, ką mato testuotojas WP admin'e (meniu, juosta), login_redirect (tik skaitymas). */
add_action('init', function(){
  if (!isset($_GET['ps_e8r'])) return;
  $o=array('v'=>'S1620 e8r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  $r=get_role('ps_darbuotojas'); $o['role']=$r?array('name'=>$r->name,'caps'=>array_keys(array_filter($r->capabilities))):'NĖRA'; $o['roles_visos']=array_keys(wp_roles()->roles);
  global $wp_filter; foreach(array('login_redirect','show_admin_bar','admin_menu','admin_init','wp_login') as $h){ $cb=array(); if(isset($wp_filter[$h])){ foreach($wp_filter[$h]->callbacks as $pr=>$fs){ foreach($fs as $k=>$fn){ $f=$fn['function']; $n=is_array($f)?((is_object($f[0])?get_class($f[0]):$f[0]).'::'.$f[1]):(is_string($f)?$f:'closure'); if(stripos($n,'petshop')!==false||stripos($n,'ps_')!==false||stripos($n,'closure')!==false) $cb[]=$pr.':'.$n; } } } $o['kabliai'][$h]=array_slice($cb,0,25); }
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+900; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok))));
  $G=function($u) use($cs){ $r=wp_remote_get($u,array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false,'redirection'=>0)); return array('code'=>wp_remote_retrieve_response_code($r),'loc'=>(string)wp_remote_retrieve_header($r,'location'),'h'=>(string)wp_remote_retrieve_body($r)); };
  $x=$G(admin_url()); $o['wp_admin']=array('code'=>$x['code'],'loc'=>$x['loc']); $h=$x['h'];
  $o['adminmenu']=preg_match('/<ul id="adminmenu">(.*?)<\/ul>\s*<\/div>/su',$h,$m)?array_values(array_unique(array_map('trim',array_map('wp_strip_all_tags',preg_match_all('/<a[^>]+class="[^"]*menu-top[^"]*"[^>]*>(.*?)<\/a>/su',$m[1],$mm)?$mm[1]:array())))):'?';
  $o['adminbar']=(int)(strpos($h,'id="wpadminbar"')!==false); $o['juosta']=(int)(strpos($h,'ps-juosta')!==false||strpos($h,'psj-')!==false);
  $x=$G(admin_url('admin.php?page=ps-desk')); $o['desk']=array('code'=>$x['code'],'title'=>preg_match('/<title>(.*?)<\/title>/s',$x['h'],$t)?trim($t[1]):'','juosta_nuorodos'=>(preg_match_all('/<a[^>]*href="[^"]*page=(ps-[a-z-]+|petshop-[a-z-]+)[^"]*"[^>]*>([^<]{2,30})<\/a>/u',$x['h'],$jm2)?array_values(array_unique($jm2[2])):array()));
  foreach(array('admin.php?page=wc-orders','edit.php?post_type=product','admin.php?page=wc-settings','plugins.php','users.php','admin.php?page=ps-desk&view=saskaitos') as $u){ $x=$G(admin_url($u)); $o['prieiga'][$u]=$x['code'].($x['loc']?' → '.mb_substr(str_replace(home_url(),'',$x['loc']),0,60):''); }
  $o['testuotojas_meta']=array('last'=>get_user_meta($uid,'session_tokens',false)?'sesija':'','locale'=>get_user_meta($uid,'locale',true),'admin_color'=>get_user_meta($uid,'admin_color',true));
  $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
