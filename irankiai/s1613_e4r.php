<?php
/** TEMP PS S1613 run e4r — R (tik skaitymas): kuris LP plugino kabliukas po `completed` bando kurti siuntą iš naujo (#35416 `lp-parcel-failed` po r2), #35416 po testo */
add_action('init', function(){
  if (!isset($_GET['ps_e4r'])) return;
  $o=array('v'=>'S1613 e4r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
    $D=WP_PLUGIN_DIR.'/woo-lithuaniapost-main'; $fi=$D.'/admin/class-woo-lithuaniapost-admin-order-service.php'; $ls=file($fi);
    $o['f540_575']=array(); for($i=535;$i<575;$i++){ $o['f540_575'][]=($i+1).': '.mb_substr(rtrim($ls[$i]),0,200); }
    $c=file_get_contents($D.'/includes/class-woo-lithuaniapost.php'); $o['hooks_order']=array(); if(preg_match_all('/add_(action|filter)\s*\(\s*[\'"]([^\'"]*(order_status|payment_complete|order_save|update_order|status_changed|new_order|thankyou)[^\'"]*)[\'"][^\n]{0,140}/',$c,$m,PREG_SET_ORDER)){ foreach($m as $x){ $o['hooks_order'][]=$x[0]; } }
    $x=wc_get_order(35416); $o['u35416']=array('st'=>$x->get_status(),'lp_st'=>(string)$x->get_meta('_woo_lithuaniapost_shipping_status_value'),'bc'=>(string)$x->get_meta('_woo_lithuaniapost_barcode'),'item_id'=>(string)$x->get_meta('_woo_lithuaniapost_shipping_item_id'),'err'=>mb_substr((string)$x->get_meta('_woo_lithuaniapost_parcel_create_error'),0,200));
    $o['lp_tracking_rows']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}woo_lithuaniapost_tracking_status");
    $o['temp_aktyvus']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=1");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
