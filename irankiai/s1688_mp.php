<?php
/** TEMP PS S1688 mp — RECON: el. pašto domenų pasiskirstymas ps_relaunch_kontaktai (visi / consent=1). */
add_action('init', function(){
  if (!isset($_GET['ps_s1688mp'])) return; global $wpdb; $o=array('v'=>'S1688 mp'); $t=Petshop_Relaunch::t();
  foreach(array('visi'=>'1','consent'=>'consent=1') as $k=>$w){ $o[$k]=$wpdb->get_results("SELECT LOWER(SUBSTRING_INDEX(email,'@',-1)) d, COUNT(*) n FROM $t WHERE $w GROUP BY d ORDER BY n DESC LIMIT 12",ARRAY_A); $o[$k.'_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $t WHERE $w"); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
