<?php
/** TEMP PS S1664 b — ps_*_bak archyvas į uploads + DELETE; realūs legacy 301 testai iš map. */
add_action('init', function(){
  if (!isset($_GET['ps_s1664b'])) return;
  $o=array('v'=>'S1664 b'); global $wpdb; $p=$wpdb->prefix;
  // 1. legacy 301 realūs pavyzdžiai
  $map=get_option('petshop_legacy_301_map', get_option('ps_legacy_301_map', array()));
  if(is_string($map)) $map=json_decode($map,true);
  $o['map_n']=is_array($map)?count($map):0;
  if(is_array($map)&&$map){ $keys=array_slice(array_keys($map),0,3);
    foreach($keys as $k){ $u=(strpos($k,'/')===0?$k:'/'.$k);
      $r=wp_remote_get(home_url($u),array('timeout'=>15,'redirection'=>0));
      $o['legacy'][$u]=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r).' -> '.substr((string)wp_remote_retrieve_header($r,'location'),0,90);
    } }
  // 2. bak archyvas + trynimas
  $bak=$wpdb->get_results("SELECT option_name,option_value FROM {$p}options WHERE option_name LIKE 'ps\_%bak%'");
  $arch=array(); foreach($bak as $r) $arch[$r->option_name]=$r->option_value;
  $up=wp_upload_dir(); $f=$up['basedir'].'/ps_bak_arch_20260909.json.gz';
  $ok=file_put_contents($f, gzencode(json_encode($arch),9));
  $o['arch']=array('failas'=>$f,'baitai'=>$ok,'md5'=>$ok?md5_file($f):null,'n'=>count($arch));
  if($ok && count($arch)){
    $del=0; foreach(array_keys($arch) as $n){ if(delete_option($n)) $del++; }
    $o['istrinta']=$del;
    $o['liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}options WHERE option_name LIKE 'ps\_%bak%'");
  } else $o['istrinta']='PRALEISTA (arch nepavyko)';
  wp_send_json($o);
});
