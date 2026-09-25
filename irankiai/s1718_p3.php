<?php
/** Plugin Name: TEMP PS S1718p3 — Petshop_Kategorijos_Aprasymas saltinis (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1718p3'])) return; $r=['v'=>'S1718p3']; global $wpdb;
  $rc=new ReflectionClass('Petshop_Kategorijos_Aprasymas'); $r['file']=$rc->getFileName(); $r['lines']=[$rc->getStartLine(),$rc->getEndLine()];
  if(strpos($rc->getFileName(),'eval')!==false || !is_file($rc->getFileName())){ $sn=$wpdb->get_results("SELECT id,name,scope,active FROM {$wpdb->prefix}snippets WHERE code LIKE '%Petshop_Kategorijos_Aprasymas%'",ARRAY_A); $r['snippets']=$sn; foreach($sn as $s){ $r['code'][$s['id']]=$wpdb->get_var($wpdb->prepare("SELECT code FROM {$wpdb->prefix}snippets WHERE id=%d",$s['id'])); } }
  else { $r['code']=file_get_contents($rc->getFileName()); }
  wp_send_json($r);
},1);
