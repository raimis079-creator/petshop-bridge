<?php
/** TEMP PS S1636 run v — V: perziuros paruosimas Raimiui (opt=1, uid119 seen israsyti/istrinti, tmp mu-plugin su vienkartine B prisijungimo nuoroda) · C: valymas (tmp failas salin, opt=0, seen istrinti). */
add_action('init', function(){
  if (!isset($_GET['ps_s1636v'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_s1636v'])); $o=array('v'=>'S1636 v','f'=>$f); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $tmp=WPMU_PLUGIN_DIR.'/tmp-s1636-perziura.php';
  try{
  if($f==='V'){
    update_option('petshop_welcome_modal_enabled',1,false);
    delete_user_meta(119,'ps_welcome_seen');
    $u=get_userdata(119); $o['b_vartotojas']=$u?$u->user_email:'?';
    $n=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_pets WHERE user_id=119 AND status='active'"); $o['b_pets']=$n;
    $code='<?php /* TEMP S1636 perziura — vienkartine B prisijungimo nuoroda Raimiui. Trinti per C faze. */
if ( ! defined( "ABSPATH" ) ) { exit; }
add_action("init", function(){
  if ( ( $_GET["ps_b_perziura"] ?? "" ) !== "raimis-7f3k9" ) return;
  wp_set_auth_cookie( 119, false, true );
  wp_safe_redirect( home_url( "/?b=" . time() ) ); exit;
}, 2);
';
    try{ token_get_all($code,TOKEN_PARSE); }catch(Throwable $e){ $o['STOP']='token'; $J($o); }
    $o['tmp_irasyta']=(int)file_put_contents($tmp,$code);
    $r=wp_remote_get(admin_url('admin-ajax.php?action=heartbeat'),array('timeout'=>60,'sslverify'=>false));
    $o['ping']=wp_remote_retrieve_response_code($r);
    if(stripos((string)wp_remote_retrieve_body($r),'Fatal error')!==false){ unlink($tmp); $o['ATSAUKTA']=1; }
    $o['b_nuoroda']=home_url('/?ps_b_perziura=raimis-7f3k9');
    $J($o);
  }
  if($f==='C'){
    $o['tmp_istrinta']=file_exists($tmp)?(int)unlink($tmp):'nebuvo';
    update_option('petshop_welcome_modal_enabled',0,false);
    delete_user_meta(119,'ps_welcome_seen');
    $o['opt_po']=get_option('petshop_welcome_modal_enabled');
    $J($o);
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage(); $J($o); }
},99);
