<?php
/** TEMP PS S1636 run l — READ-ONLY: gyvo ps-katalogas failo lokacija ir md5. */
add_action('init', function(){
  if (!isset($_GET['ps_s1636l'])) return;
  $o=array('v'=>'S1636 l'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/*/*.php')) as $f){
    $c=@file_get_contents($f,false,null,0,4000);
    if($c && strpos($c,'Petshop Katalogas')!==false){ $o['failai'][]=array('kelias'=>str_replace(WP_CONTENT_DIR,'',$f),'dydis'=>filesize($f),'md5'=>md5_file($f),'antra'=>trim((string)(explode("\n",$c)[2]??''))); }
  }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
