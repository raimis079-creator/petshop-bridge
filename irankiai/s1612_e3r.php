<?php
/** TEMP PS S1612 run e3r — R: Venipak sekimo API su realiais numeriais (Raimis 09-04): 106313457, 106325241 — bandom pack_no ir shipment_id parametrus; tik skaitymas */
add_action('init', function(){
  if (!isset($_GET['ps_e3r'])) return;
  $o=array('v'=>'run e3r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{
    foreach(array('106313457','106325241') as $n){
      foreach(array('pack_no','shipment_id','shipment_no','id') as $par){
        $u='https://tracking.venipak.com/api/v1/events?'.$par.'='.$n;
        $r=wp_remote_get($u,array('timeout'=>20,'headers'=>array('Accept'=>'application/json')));
        $o[$n][$par]=is_wp_error($r)?$r->get_error_message():array('code'=>wp_remote_retrieve_response_code($r),'body'=>mb_substr(wp_remote_retrieve_body($r),0,3000));
      }
      $r=wp_remote_get('https://go.venipak.lt/ws/tracking.php?type=1&code='.$n,array('timeout'=>20));
      $o[$n]['ws_tracking']=is_wp_error($r)?$r->get_error_message():array('code'=>wp_remote_retrieve_response_code($r),'body'=>mb_substr(wp_remote_retrieve_body($r),0,800));
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
