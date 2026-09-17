<?php
/** TEMP PS S1690 d — testas: svečio kasa su esamos paskyros el. paštu (terra@gyvunai.lt), bacs, testinė prekė; po to atšaukti. */
add_action('wp_loaded', function(){
  global $wpdb; $p=$wpdb->prefix; $E='terra@gyvunai.lt';
  if ((isset($_GET['ps_s1690d']) && $_GET['ps_s1690d']==='d2')) {
    $pid=34889; $wpdb->update($p.'posts',array('post_status'=>'publish'),array('ID'=>$pid)); clean_post_cache($pid); $pr=wc_get_product($pid); $pr->set_manage_stock(false); $pr->set_stock_status('instock'); $pr->save(); $pr=wc_get_product($pid); if(!$pr||!$pr->is_purchasable()){echo json_encode(array('neperkama'=>1,'st'=>$pr?$pr->get_status():null,'price'=>$pr?$pr->get_price():null,'stock'=>$pr?$pr->get_stock_status():null));exit;} wc_load_cart(); WC()->cart->empty_cart(); WC()->cart->add_to_cart($pid,1);
    $_POST=array('billing_first_name'=>'Testas','billing_last_name'=>'S1690','billing_country'=>'LT','billing_address_1'=>'Testo g. 1','billing_city'=>'Vilnius','billing_postcode'=>'01100','billing_phone'=>'+37060000000','billing_email'=>$E,'createaccount'=>1,'payment_method'=>'bacs','terms'=>1,'terms-field'=>1,'ship_to_different_address'=>0,'order_comments'=>'TESTAS S1690 — atšaukti');
    $_POST['woocommerce-process-checkout-nonce']=wp_create_nonce('woocommerce-process_checkout'); $_POST['_wpnonce']=$_POST['woocommerce-process-checkout-nonce'];
    $_REQUEST=array_merge($_REQUEST,$_POST); $_SERVER['REQUEST_METHOD']='POST'; if(!defined('DOING_AJAX')) define('DOING_AJAX',true);
    add_filter('wp_doing_ajax','__return_true'); WC()->checkout()->process_checkout(); echo json_encode(array('nebuvo_exit'=>true, 'notices'=>wc_get_notices())); exit; }
  if ((isset($_GET['ps_s1690d']) && $_GET['ps_s1690d']==='d3')) { $o=array();
    $ids=wc_get_orders(array('limit'=>2,'orderby'=>'id','order'=>'DESC','billing_email'=>$E,'return'=>'ids'));
    foreach($ids as $id){ $ord=wc_get_order($id); $n=array(); foreach(wc_get_order_notes(array('order_id'=>$id,'limit'=>6)) as $nt) $n[]=mb_substr(preg_replace('/\s+/',' ',$nt->content),0,100);
      $row=array('id'=>$id,'st'=>$ord->get_status(),'uid'=>$ord->get_customer_id(),'meta'=>$ord->get_meta('_ps_paskyra_priskirta'),'sukurtas'=>$ord->get_date_created()->date('m-d H:i'),'pastabos'=>$n);
      if ($ord->get_customer_note()==='TESTAS S1690 — atšaukti' && $ord->has_status('on-hold')) { $ord->update_status('cancelled','TESTAS S1690 atšauktas automatiškai.'); $row['atsaukta']=true; }
      $o['uzs'][]=$row; }
    $wpdb->update($p.'posts',array('post_status'=>'draft'),array('ID'=>34889)); clean_post_cache(34889); $pr=wc_get_product(34889); $pr->set_stock_status('outofstock'); $pr->save(); $o['testine_grazinta']=get_post_status(34889); $u=get_user_by('email',$E); $o['paskyros_adresas']=array('addr'=>get_user_meta($u->ID,'billing_address_1',true),'city'=>get_user_meta($u->ID,'billing_city',true));
    header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; }
  if ((isset($_GET['ps_s1690d']) && $_GET['ps_s1690d']==='d1')) { $o=array();
    $o['uid']=email_exists($E); $o['prod']=$wpdb->get_results("SELECT ID,post_name,post_status FROM {$p}posts WHERE post_type='product' AND (post_name LIKE '%testas%' OR post_title LIKE '%testin%' OR post_name LIKE '%test-%') LIMIT 8",ARRAY_A);
    $o['plugin']=class_exists('Petshop_Kasa_Paskyra');
    $d=apply_filters('woocommerce_checkout_posted_data',array('billing_email'=>$E,'createaccount'=>1));
    $o['createaccount_po']=$d['createaccount']; $o['customer_id_po']=apply_filters('woocommerce_checkout_customer_id',0); $o['update_data']=apply_filters('woocommerce_checkout_update_customer_data',true,null);
    header('Content-Type: application/json'); echo json_encode($o); exit; }
},99);
