<?php
/** TEMP PS S1633 run dns — DNS: petshop.lt NS/A/TTL per dns.google (READ-ONLY, iš serverio). */
add_action('init', function(){
  if (!isset($_GET['ps_s1633dns'])) return;
  $o=array('v'=>'S1633 dns');
  foreach(array('NS','A','SOA') as $t){
    $r=wp_remote_get('https://dns.google/resolve?name=petshop.lt&type='.$t,array('timeout'=>20));
    $j=json_decode((string)wp_remote_retrieve_body($r),true);
    $o[$t]=array_map(function($x){return array('d'=>$x['data'],'TTL'=>$x['TTL']);},(array)($j['Answer']??array()));
  }
  $r=wp_remote_get('https://dns.google/resolve?name=www.petshop.lt&type=A',array('timeout'=>20));
  $j=json_decode((string)wp_remote_retrieve_body($r),true);
  $o['www']=array_map(function($x){return array('t'=>$x['type'],'d'=>$x['data'],'TTL'=>$x['TTL']);},(array)($j['Answer']??array()));
  header('Content-Type: application/json'); echo json_encode($o); exit;
},99);
