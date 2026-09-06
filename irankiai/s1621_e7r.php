<?php
/** TEMP PS S1621 run e7r — RECON: paskutinis laiškas iš `ps_laisku_archyvas` (VF #17), opcijų likučiai. */
add_action('init', function(){
  if (!isset($_GET['ps_e7r'])) return;
  $o=array('v'=>'S1621 e7r'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $a=(array)get_option('ps_laisku_archyvas',array()); $o['n']=count($a);
  foreach(array_slice($a,0,2) as $l){ $o['laiskai'][]=array('laikas'=>$l['laikas'],'kam'=>$l['kam'],'tema'=>$l['tema'],'kont'=>$l['kont'],'priedai'=>$l['priedai'],'tekstas'=>mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags(str_replace(array('</tr>','</p>'),"\n",(string)$l['html'])))),0,1500)); }
  $o['opt_liko']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE 'ps_s1621%'");
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
