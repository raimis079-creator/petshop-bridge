<?php
/** TEMP PS S1681 n — read-only: kur suketi eShoprent pardavimai — lentelės su datomis <2026-09, uploads csv/xlsx, admin meniu, mu-plugin pavadinimai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681n'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 n');
  $o['lent']=$wpdb->get_results("SELECT table_name t,table_rows n FROM information_schema.tables WHERE table_schema=DATABASE() AND table_name LIKE '{$p}ps_%' AND table_rows>500 ORDER BY table_rows DESC LIMIT 40",ARRAY_A);
  foreach(array('pardav','esh','legacy','istor','senos','archyv','import','uzsak') as $k) foreach($wpdb->get_results("SHOW TABLES LIKE '%{$k}%'",ARRAY_N) as $r) $o['pav'][]=$r[0];
  $u=wp_upload_dir(); $files=array(); foreach(array('csv','xlsx','xls','json','txt') as $e) foreach(glob($u['basedir'].'/{,*/,*/*/}*.'.$e,GLOB_BRACE) as $f) if(filesize($f)>50000) $files[]=str_replace($u['basedir'],'',$f).' '.round(filesize($f)/1024).'K';
  $o['uploads']=array_slice($files,0,40);
  global $submenu; $o['meniu']=array(); foreach($submenu as $par=>$it) if(stripos($par,'petshop')!==false||stripos($par,'ps')===0) foreach($it as $x) $o['meniu'][]=$par.' → '.$x[0].' ('.$x[2].')';
  $o['mu']=array_map('basename',glob(WPMU_PLUGIN_DIR.'/*.php'));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
