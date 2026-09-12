<?php
/** TEMP PS S1676 run p — pilni failai: av-source, av-reduce, snippet 567. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676p'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 p');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  foreach(array('petshop-av-source.php','petshop-av-reduce.php') as $n){ $f=WPMU_PLUGIN_DIR.'/'.$n; $o[$n]=array('md5'=>md5_file($f),'b64'=>base64_encode(file_get_contents($f))); }
  $s=$wpdb->get_row("SELECT id,name,code,priority,scope FROM {$p}snippets WHERE id=567",ARRAY_A); $o['s567']=array('name'=>$s['name'],'pri'=>$s['priority'],'scope'=>$s['scope'],'md5'=>md5($s['code']),'b64'=>base64_encode($s['code']));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o); exit;
});
