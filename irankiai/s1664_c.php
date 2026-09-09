<?php
/** TEMP PS S1664 c — READ-ONLY: 3 realūs legacy URL iš petshop-legacy-301-map.json. */
add_action('init', function(){
  if (!isset($_GET['ps_s1664c'])) return;
  $o=array('v'=>'S1664 c');
  $f=WPMU_PLUGIN_DIR.'/petshop-legacy-301-map.json';
  $map=file_exists($f)?json_decode(file_get_contents($f),true):null;
  $o['map_n']=is_array($map)?count($map):'NERA';
  if(is_array($map)&&$map){
    $keys=array_values(array_slice(array_keys($map),0,3));
    foreach($keys as $k){ $u=(strpos($k,'/')===0?$k:'/'.$k);
      $r=wp_remote_get(home_url($u),array('timeout'=>15,'redirection'=>0));
      $o['legacy'][$u]=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r).' -> '.substr((string)wp_remote_retrieve_header($r,'location'),0,90);
    }
  }
  wp_send_json($o);
});
