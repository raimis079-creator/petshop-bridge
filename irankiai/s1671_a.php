<?php
/** Plugin Name: TEMP PS S1671 Venipak API 6 nr */
add_action('init', function(){
  if (!isset($_GET['ps_s1671a']) || $_GET['ps_s1671a']!=='A') return;
  header('Content-Type: application/json; charset=utf-8'); $o=array('v'=>'S1671a','now_lt'=>current_time('mysql'));
  foreach (array('V07267E1000065','V07267E1000066','V07267E1000079','V07267E1000080','V07267E1000081','V07267E1000082') as $nr) {
    $r = wp_remote_get('https://tracking.venipak.com/api/v1/events?pack_no='.$nr, array('timeout'=>15,'headers'=>array('Accept'=>'application/json')));
    if (is_wp_error($r)) { $o[$nr]=$r->get_error_message(); continue; }
    $b = json_decode(wp_remote_retrieve_body($r), true); $ev=array();
    foreach ((array)$b as $x) { $ev[] = ($x['date']??'').' '.($x['pack_status']??'').' '.($x['pack_status_text']??'').' '.(($x['location']['city']??'')); }
    $o[$nr] = array('http'=>wp_remote_retrieve_response_code($r), 'ev'=>$ev);
  }
  echo json_encode($o, JSON_UNESCAPED_UNICODE); exit;
});
