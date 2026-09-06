<?php
/** TEMP PS S1620 run e3r — R: kliento paskyros (5787) puslapių matomi tekstai + svečio „Kaip mato klientas“ + WC vertimų būklė (tik skaitymas). */
add_action('init', function(){
  if (!isset($_GET['ps_e3r'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e3r'])); $o=array('v'=>'S1620 e3r','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(250);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  $uid=5787; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok))));
  $tekstas=function($h){ $h=preg_replace('#<(script|style|noscript|svg)\b.*?</\1>#si',' ',$h); if(preg_match('#<main\b.*?</main>#si',$h,$m)) $h=$m[0]; elseif(preg_match('#<div[^>]+class="[^"]*woocommerce[^"]*".*#si',$h,$m)) $h=$m[0]; $h=preg_replace('#<(br|/p|/li|/tr|/h\d|/div|/td|/th|/label|/option|/a|/button|/span)[^>]*>#i',"\n",$h); $t=html_entity_decode(wp_strip_all_tags($h),ENT_QUOTES,'UTF-8'); $out=array(); foreach(explode("\n",$t) as $l){ $l=trim(preg_replace('/\s+/',' ',$l)); if($l===''||mb_strlen($l)<2||preg_match('/^[\d\s.,:€%€\-–—#|]+$/u',$l)) continue; $out[$l]=1; } return array_slice(array_keys($out),0,110); };
  $G=function($u,$log=true) use($cs,$tekstas){ $r=wp_remote_get($u,array('cookies'=>$log?$cs:array(),'timeout'=>90,'sslverify'=>false,'redirection'=>2)); return array('code'=>wp_remote_retrieve_response_code($r),'t'=>$tekstas((string)wp_remote_retrieve_body($r))); };
  $my=wc_get_page_permalink('myaccount'); $o['my']=$my; $o['locale']=get_locale(); $o['wc_td']=is_textdomain_loaded('woocommerce'); $o['wc_orders_str']=__('Orders','woocommerce'); $o['wc_ver']=WC()->version;
  $o['menu']=wc_get_account_menu_items(); $o['statusai']=wc_get_order_statuses();
  $ords=wc_get_orders(array('customer_id'=>$uid,'limit'=>60,'orderby'=>'date','order'=>'DESC','return'=>'ids')); $o['uzs_n']=count($ords); $sel=array(); foreach($ords as $id){ $x=wc_get_order($id); $st=$x->get_status(); if(!isset($sel[$st])){ $sel[$st]=$id; } } $o['sel']=$sel;
  $o['p_dashboard']=$G($my); $o['p_orders']=$G(wc_get_endpoint_url('orders','',$my)); $o['p_edit_address']=$G(wc_get_endpoint_url('edit-address','',$my)); $o['p_edit_account']=$G(wc_get_endpoint_url('edit-account','',$my));
  foreach(array('completed','processing','on-hold','cancelled') as $st){ if(isset($sel[$st])){ $o['p_view_'.$st]=$G(wc_get_endpoint_url('view-order',$sel[$st],$my)); $o['p_view_'.$st]['id']=$sel[$st]; } }
  foreach(array_keys($o['menu']) as $ep){ if(!in_array($ep,array('dashboard','orders','edit-address','edit-account','customer-logout','view-order'),true)){ $o['p_ep_'.$ep]=$G(wc_get_endpoint_url($ep,'',$my)); } }
  $g=wc_get_order(35813); $o['p_svecio_aciu']=$G($g->get_checkout_order_received_url(),false); $o['p_svecio_aciu']['id']=35813;
  $o['p_login']=$G($my,false);
  $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
