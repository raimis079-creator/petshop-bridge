<?php
/** TEMP PS S1613 run e2r — R: 4 etapo #2 LP recon 2 (tik skaitymas): update_tracking_status pilnas kodas, LpOrderStatus klasė, plugino lentelės, #35416 būklė, is_shipping_method_supported */
add_action('init', function(){
  if (!isset($_GET['ps_e2r'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e2r'])); $o=array('v'=>'S1613 e2r','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $src=function($cls,$m,$max=6000){ try{ $r=new ReflectionMethod($cls,$m); $ls=file($r->getFileName()); $c=implode('',array_slice($ls,$r->getStartLine()-1,$r->getEndLine()-$r->getStartLine()+1)); return array('f'=>basename($r->getFileName()),'l'=>$r->getStartLine().'-'.$r->getEndLine(),'kodas'=>mb_substr($c,0,$max)); }catch(Throwable $e){ return 'ERR '.$e->getMessage(); } };
  try{
  if($f==='R'){
    $D=WP_PLUGIN_DIR.'/woo-lithuaniapost-main';
    $o['update_tracking_status']=$src('Woo_Lithuaniapost_Admin_Order_Tracking','update_tracking_status',7000);
    $o['get_tracking_events']=$src('Woo_Lithuaniapost_Admin_Order_Tracking','get_tracking_events',2500);
    $o['is_supported']=$src('Woo_Lithuaniapost_Admin_Order_Service','is_shipping_method_supported',1200);
    $o['on_parcel_save']=$src('Woo_Lithuaniapost_Admin_Order_Service','on_parcel_save',2500);
    // LpOrderStatus klasė
    $c=file_get_contents($D.'/admin/class-woo-lithuaniapost-admin-order-service.php'); $ls=explode("\n",$c); $o['LpOrderStatus']=implode("\n",array_slice($ls,40,66));
    // lentelės
    foreach(array('woo_lithuaniapost_tracking_status','woo_lithuaniapost_tracking_events') as $t){ $tn=$wpdb->$t??($p.$t); $o['lenteles'][$t]=array('vardas'=>$tn,'yra'=>$wpdb->get_var("SHOW TABLES LIKE '$tn'"),'stulpeliai'=>$wpdb->get_col("SHOW COLUMNS FROM `$tn`",0),'eiluciu'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM `$tn`"),'pvz'=>$wpdb->get_results("SELECT * FROM `$tn` ORDER BY 1 DESC LIMIT 3",ARRAY_A)); }
    $o['lp_opcijos_tracking']=$wpdb->get_results("SELECT option_name n, option_value v FROM {$p}options WHERE option_name LIKE 'lpsettings_tracking%'",ARRAY_A);
    // #35416
    $x=wc_get_order(35416); if($x){ $m=array(); foreach($x->get_meta_data() as $md){ if(strpos($md->key,'_ps_')===0||strpos($md->key,'_woo_lith')===0) $m[$md->key]=mb_substr(is_scalar($md->value)?(string)$md->value:wp_json_encode($md->value),0,140); }
      $it=array(); foreach($x->get_items() as $iid=>$i){ $it[$iid]=array('n'=>mb_substr($i->get_name(),0,50),'q'=>$i->get_quantity(),'pid'=>$i->get_product_id(),'kelias'=>$i->get_meta('_ps_kelias'),'src'=>$i->get_meta('_ps_source'),'red'=>$i->get_meta('_ps_av_reduced_qty')); }
      $o['u35416']=array('st'=>$x->get_status(),'paid'=>$x->is_paid(),'cust'=>$x->get_customer_id(),'email'=>$x->get_billing_email(),'ship'=>$x->get_shipping_method(),'created'=>$x->get_date_created()->date('Y-m-d H:i'),'meta'=>$m,'items'=>$it,'reg'=>Petshop_Siuntos::sarasas(35416),'kl'=>Petshop_Darbalaukis::kliento_siuntos($x)); }
    // 5787 kliento LP užsakymų nėra? visi 5787 užsakymai + metodas
    $o['k5787']=array(); foreach(wc_get_orders(array('customer_id'=>5787,'limit'=>20,'return'=>'objects')) as $u){ $o['k5787'][]=$u->get_id().' '.$u->get_status().' '.$u->get_shipping_method(); }
    $o['dl_versija']=Petshop_Darbalaukis::VERSIJA; $o['dl_md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); $o['ks_md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-kliento-siuntos.php');
    $o['paskutinis']=get_option('ps_venipak_sekimas_paskutinis');
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
