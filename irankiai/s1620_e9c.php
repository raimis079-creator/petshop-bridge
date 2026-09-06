<?php
/** TEMP PS S1620 run e9c — C: darbuotojos paskyra „Inga“ (login `inga`, terra@petshop.lt, rolė `ps_darbuotojas`) + slaptažodžio nustatymo laiškas (dev-pastas praleidžia tik šiai užklausai) · Q: patikra (rolė, teisės, prisijungimo peradresavimas). */
add_action('init', function(){
  if (!isset($_GET['ps_e9c'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e9c'])); $o=array('v'=>'S1620 e9c','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $EL='terra@petshop.lt'; $LOGIN='inga';
  try{
  if($f==='C'){
    $ex=email_exists($EL); $o['email_exists']=$ex?array($ex,get_user_by('id',$ex)->user_login):0; $ul=username_exists($LOGIN); $o['login_exists']=$ul?:0;
    if($ex&&(!$ul||$ul!=$ex)){ $o['STOP']='el. paštas jau priskirtas kitam vartotojui'; $J($o); }
    if(!$ul){ $uid=wp_insert_user(array('user_login'=>$LOGIN,'user_email'=>$EL,'user_pass'=>wp_generate_password(24,true,true),'role'=>'ps_darbuotojas','first_name'=>'Inga','display_name'=>'Inga','nickname'=>'Inga','locale'=>'lt_LT')); if(is_wp_error($uid)){ $o['STOP']='insert: '.$uid->get_error_message(); $J($o); } $o['sukurta']=$uid; } else { $uid=$ul; $o['jau_buvo']=$uid; }
    $u=get_user_by('id',$uid); $o['user']=array($u->ID,$u->user_login,$u->user_email,$u->display_name,implode(',',$u->roles));
    update_option('ps_dev_pastas_leisti',1,false); $sent=retrieve_password($LOGIN); delete_option('ps_dev_pastas_leisti');
    $o['reset_laiskas']=is_wp_error($sent)?'KLAIDA: '.$sent->get_error_message():($sent===true?'išsiųsta':var_export($sent,true)); $o['leisti_po']=get_option('ps_dev_pastas_leisti',null);
    $o['reset_key_yra']=(int)((bool)$wpdb->get_var($wpdb->prepare("SELECT user_activation_key FROM {$p}users WHERE ID=%d",$uid)));
    $z=(array)get_option('ps_dev_pastas_zurnalas',array()); $o['dev_pastas_pask']=array_map(function($e){return array($e['laikas']??'',$e['kam']??'',mb_substr($e['tema']??'',0,60));},array_slice($z,-2)); $J($o);
  }
  if($f==='Q'){
    $u=get_user_by('login',$LOGIN); if(!$u){ $o['STOP']='nėra'; $J($o); } $o['user']=array($u->ID,$u->user_login,$u->user_email,$u->display_name,implode(',',$u->roles),$u->user_registered);
    foreach(array('manage_woocommerce','edit_shop_orders','edit_products','upload_files','activate_plugins','manage_options','edit_snippets','manage_snippets','list_users','edit_pages','edit_posts','edit_theme_options') as $c){ $o['can'][$c]=(int)user_can($u,$c); }
    $uid=$u->ID; $exp=time()+600; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
    $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok))));
    $G=function($u) use($cs){ $r=wp_remote_get($u,array('cookies'=>$cs,'timeout'=>90,'sslverify'=>false,'redirection'=>0)); return wp_remote_retrieve_response_code($r).(($l=(string)wp_remote_retrieve_header($r,'location'))?' → '.mb_substr(str_replace(home_url(),'',$l),0,50):''); };
    foreach(array('','admin.php?page=ps-desk','admin.php?page=ps-desk&view=naujas','admin.php?page=ps-desk&view=saskaitos','admin.php?page=ps-katalogas','plugins.php','users.php','admin.php?page=snippets','admin.php?page=wc-settings','options-general.php') as $pth){ $o['prieiga'][$pth?:'wp-admin/']=$G(admin_url($pth)); }
    WP_Session_Tokens::get_instance($uid)->destroy($tok); $o['leisti']=get_option('ps_dev_pastas_leisti',null); $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'"); $J($o);
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
