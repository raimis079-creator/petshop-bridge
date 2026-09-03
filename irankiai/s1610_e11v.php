<?php
/** TEMP PS S1610 run e11v — valymas: ps_e9_mail/ps_e9_oids opcijos, TEMP snippet'ai; galutinė būklė */
add_action('init', function(){
  if (!isset($_GET['ps_e11v'])) return;
  $o=array('v'=>'run e11v'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['oids']=get_option('ps_e9_oids'); $o['mail_buvo']=count((array)get_option('ps_e9_mail',array()));
  $o['del_mail']=delete_option('ps_e9_mail'); $o['del_oids']=delete_option('ps_e9_oids');
  $o['temp_like']=$wpdb->get_results("SELECT id,name,active FROM {$p}snippets WHERE name LIKE 'TEMP%'",ARRAY_A);
  $o['dl']=array('v'=>Petshop_Darbalaukis::VERSIJA,'md5'=>md5_file(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'),'bytes'=>filesize(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'));
  $o['ks']=array('v'=>Petshop_Kliento_Siuntos::VERSIJA,'md5'=>md5_file(WPMU_PLUGIN_DIR.'/petshop-kliento-siuntos.php'));
  foreach(array(35776,35777) as $id){ $x=wc_get_order($id); $o['uzs'][$id]=$x?array($x->get_status(),$x->get_customer_id()):null; }
  $o['dev_pastas']=count((array)get_option('ps_dev_pastas_zurnalas',array()));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
