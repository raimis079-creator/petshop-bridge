<?php
/** TEMP PS S1608 run e3k — v3.6.1 patikra: skydelio „kodėl“ gautoms prekėms */
add_action('init', function(){
  if (!isset($_GET['ps_e3k'])) return;
  $o=array('v'=>'run e3k'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $u=get_user_by('login','testuotojas'); wp_set_current_user($u->ID);
  $o['versija']=Petshop_Darbalaukis::VERSIJA; $o['md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php');
  $oid=(int)get_option('ps_e3_oid'); $r=new ReflectionMethod('Petshop_Darbalaukis','faktai'); $r->setAccessible(true); $fx=$r->invoke(null,wc_get_order($oid),array());
  $r2=new ReflectionMethod('Petshop_Darbalaukis','skydelis'); $r2->setAccessible(true); $sk=$r2->invoke(null,$fx);
  foreach($sk['eil'] as $e){ $o['kodel'][]=$e['kodel']; }
  $o['temp_liko']=$wpdb->get_results("SELECT id,name,active FROM {$p}snippets WHERE name LIKE 'TEMP%'",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
