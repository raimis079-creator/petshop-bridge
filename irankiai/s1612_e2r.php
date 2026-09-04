<?php
/** TEMP PS S1612 run e2r — R: Venipak plugino sekimo funkcijų kodas (būsenų kodų žemėlapis), tik skaitymas */
add_action('init', function(){
  if (!isset($_GET['ps_e2r'])) return;
  $o=array('v'=>'run e2r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{
    $fi=WP_PLUGIN_DIR.'/wc-venipak-shipping/admin/class-woocommerce-shopup-venipak-shipping-admin-order-edit.php'; $c=file_get_contents($fi); $o['bytes']=strlen($c);
    foreach(array('get_venipak_status_title','get_venipak_status','get_order_event_detail','get_order_tracking_data','get_venipak_tracking_code') as $fn){
      if(preg_match('/(public|private|protected)?\s*(static)?\s*function\s+'.$fn.'\s*\(.*?\n\t\}\n/s',$c,$m)) $o['fn'][$fn]=mb_substr($m[0],0,2200); else $o['fn'][$fn]='nerasta';
    }
    if(preg_match_all('/pack_status[^\n]{0,200}/',$c,$m)) $o['pack_status_eilutes']=array_values(array_unique(array_slice($m[0],0,25)));
    $fi2=WP_PLUGIN_DIR.'/wc-venipak-shipping/public/class-woocommerce-shopup-venipak-shipping-public.php'; $c2=file_get_contents($fi2);
    if(preg_match('/function\s+venipak_shipping_status_shortcode\s*\(.*?\n\t\}\n/s',$c2,$m)) $o['shortcode']=mb_substr($m[0],0,1500);
    $o['meta_venipak']=$wpdb->get_results("SELECT meta_key k, COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key LIKE '%venipak%' GROUP BY meta_key",ARRAY_A);
    $r=wp_remote_get('https://tracking.venipak.com/api/v1/events?pack_no=V07267E1000030',array('timeout'=>20)); $o['track_030']=is_wp_error($r)?$r->get_error_message():mb_substr(wp_remote_retrieve_body($r),0,700);
    $r=wp_remote_get('https://tracking.venipak.com/api/v1/events?pack_no=V00000E0000000',array('timeout'=>20)); $o['track_neegz']=is_wp_error($r)?$r->get_error_message():array('code'=>wp_remote_retrieve_response_code($r),'body'=>mb_substr(wp_remote_retrieve_body($r),0,300));
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
