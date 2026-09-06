<?php
/** TEMP PS S1623 r3 — RECON (tik skaitymas): juosta (punktai, surinkti/eiles), Petshop_Partijos::priimti / paskutine_savikaina, Tiekimo priimti() kūnas, ps_partijos stulpeliai, ženklų/tiekėjų sąsaja. */
add_action('init', function(){
  if (!isset($_GET['ps_r5'])) return;
  $o=array('v'=>'S1623 r3'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $lines=function($file,$a,$b){ $L=explode("\n",(string)file_get_contents($file)); $r=array(); for($i=$a-1;$i<min($b,count($L));$i++){ $r[]=($i+1).': '.mb_substr(rtrim($L[$i]),0,210); } return $r; };
  $g=function($file,$re,$max=40){ $L=explode("\n",(string)file_get_contents($file)); $r=array(); foreach($L as $k=>$l){ if(preg_match($re,$l)) $r[]=($k+1).': '.mb_substr(trim($l),0,190); if(count($r)>=$max) break; } return $r; };
  $jf=WPMU_PLUGIN_DIR.'/petshop-juosta.php'; $o['juosta_dydis']=filesize($jf); $o['juosta_md5']=md5_file($jf); $o['juosta']=$g($jf,'/Version|@version|v1\.\d|Tiekimas|Laiškai|Laiskai|ps-tiekimas|ps-laiskai|function surinkti|function eiles|function punktai|function reikia|ps_juosta_reikia|prekyboje|uzsakyti/i',45);
  $pf=WPMU_PLUGIN_DIR.'/petshop-partijos.php'; $o['part_priimti']=$lines($pf,200,258); $o['part_av']=$lines($pf,140,164); $o['part_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_partijos");
  $tf=WPMU_PLUGIN_DIR.'/petshop-av-tiekimas.php'; $o['tiek_priimti']=$lines($tf,1300,1318); $o['tiek_md5']=md5_file($tf); $o['tiek_dydis']=filesize($tf);
  $o['zenklai_vf']=$wpdb->get_results("SELECT t.name,COUNT(*) n FROM {$p}term_relationships r JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=r.term_taxonomy_id AND tt.taxonomy='product_brand' JOIN {$p}terms t ON t.term_id=tt.term_id JOIN {$p}postmeta m ON m.post_id=r.object_id AND m.meta_key='_ps_sandelis' AND m.meta_value='vf' JOIN {$p}posts po ON po.ID=r.object_id AND po.post_status='publish' GROUP BY t.name ORDER BY n DESC LIMIT 8",ARRAY_A);
  $o['zenklai_n_pagal_tiek']=$wpdb->get_results("SELECT m.meta_value sand,COUNT(DISTINCT tt.term_id) n FROM {$p}term_relationships r JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=r.term_taxonomy_id AND tt.taxonomy='product_brand' JOIN {$p}postmeta m ON m.post_id=r.object_id AND m.meta_key='_ps_sandelis' GROUP BY m.meta_value",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
