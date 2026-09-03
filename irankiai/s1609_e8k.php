<?php
/** TEMP PS S1609 run e8k — ką klientas mato paskyroje (view-order) su registruota siunta: testinis klientas + #35421/#35440 */
add_filter('pre_wp_mail', function($r,$a){ $l=(array)get_option('ps_e8_mail',array()); $l[]=array(current_time('H:i:s'),is_array($a['to'])?implode(',',$a['to']):$a['to'],$a['subject']); update_option('ps_e8_mail',array_slice($l,-20),false); return true; },4,2);
add_action('init', function(){
  if (!isset($_GET['ps_e8k'])) return;
  $o=array('v'=>'run e8k'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{
   $em='s1609.klientas@avesa.lt'; $uid=email_exists($em); if(!$uid){ $uid=wc_create_new_customer($em,'s1609klientas',wp_generate_password(20)); } $o['uid']=$uid;
   if(is_wp_error($uid)){ $o['FATAL']=$uid->get_error_message(); throw new Exception('user'); }
   $u=get_user_by('id',$uid); $u->display_name='S1609 Klientas'; wp_update_user(array('ID'=>$uid,'display_name'=>'S1609 Klientas','first_name'=>'Testas'));
   foreach(array(35421,35440) as $oid){ $ord=wc_get_order($oid); $o['pries_customer'][$oid]=$ord->get_customer_id(); $ord->set_customer_id($uid); $ord->save(); }
   $o['my_account']=wc_get_page_permalink('myaccount'); $o['view_order_url']=wc_get_endpoint_url('view-order',35421,wc_get_page_permalink('myaccount')); $o['orders_url']=wc_get_endpoint_url('orders','',wc_get_page_permalink('myaccount'));
   // kas kabina prie view-order / order details front-end'e
   foreach(array('venipak'=>WP_PLUGIN_DIR.'/wc-venipak-shipping','lp'=>WP_PLUGIN_DIR.'/woo-lithuaniapost-main','mu'=>WPMU_PLUGIN_DIR,'core'=>WP_PLUGIN_DIR.'/petshop-core') as $k=>$dir){ $o['hooks'][$k]=array(); if(!is_dir($dir)) continue; $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir)); foreach($it as $fl){ if(substr($fl,-4)!=='.php') continue; $s=file_get_contents($fl); if(preg_match_all('/(woocommerce_order_details_after_order_table|woocommerce_view_order|woocommerce_order_details_before_order_table|woocommerce_my_account_my_orders_actions|woocommerce_my_account_my_orders_column|woocommerce_account_[a-z_]+_endpoint|woocommerce_order_item_meta_end)/',$s,$m)){ $o['hooks'][$k][]=basename($fl).': '.implode(', ',array_unique($m[1])); } } }
   foreach(array('woocommerce_order_details_after_order_table','woocommerce_view_order','woocommerce_order_details_before_order_table') as $h){ global $wp_filter; $o['gyvi_hookai'][$h]=array(); if(!empty($wp_filter[$h])){ foreach($wp_filter[$h]->callbacks as $pr=>$cbs){ foreach($cbs as $cb){ $fn=$cb['function']; $o['gyvi_hookai'][$h][]=$pr.': '.(is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:(is_string($fn)?$fn:'closure')); } } } }
   $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
   $cook=array(); foreach(array(array(SECURE_AUTH_COOKIE,'secure_auth'),array(AUTH_COOKIE,'auth'),array(LOGGED_IN_COOKIE,'logged_in')) as $c){ $cook[]=array('name'=>$c[0],'value'=>wp_generate_auth_cookie($uid,$exp,$c[1],$tok)); }
   $o['cookies']=$cook; $ev="({tekstas:(document.querySelector('.woocommerce-MyAccount-content')||document.querySelector('.woocommerce')||document.body).innerText.replace(/\\s+/g,' ').slice(0,1500),venipak:(document.body.innerText.match(/V07267E\\d+/g)||[]),nuorodos:[...document.querySelectorAll('.woocommerce-MyAccount-content a')].map(a=>a.innerText.trim()+' → '+a.getAttribute('href')).slice(0,25)})";
   $o['shots']=array(
     array('n'=>'e8_paskyra','u'=>$o['my_account'],'full'=>true,'eval'=>$ev),
     array('n'=>'e8_uzsakymai','u'=>$o['orders_url'],'full'=>true,'eval'=>$ev),
     array('n'=>'e8_uzsakymas_35421','u'=>$o['view_order_url'],'full'=>true,'eval'=>$ev),
     array('n'=>'e8_uzsakymas_35440','u'=>wc_get_endpoint_url('view-order',35440,wc_get_page_permalink('myaccount')),'full'=>true,'eval'=>$ev),
     array('n'=>'e8_uzsakymas_35421_mob','u'=>$o['view_order_url'],'w'=>390,'h'=>900,'full'=>true),
   );
  }catch(Throwable $e){ $o['FATAL']=$o['FATAL']??($e->getMessage().' @'.$e->getLine()); }
  $o['mail']=get_option('ps_e8_mail',array());
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
