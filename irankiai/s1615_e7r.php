<?php
/** TEMP PS S1615 run e7r — RECON (tik skaitymas): taisyklių puslapių HTML žymėjimas — 34524 §6 (6.4–6.9) ir §8.6 pilnas HTML, 14894 pastraipa apie neatsiėmimą + „Pristatymas kurjeriu“ tarifai, 34523 pabaiga. */
add_action('init', function(){
  if (!isset($_GET['ps_e7r'])) return;
  $o=array('v'=>'S1615 e7r'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $seg=function($c,$a,$b,$max=6000){ $i=strpos($c,$a); if($i===false) return 'A nerastas'; $j=$b?strpos($c,$b,$i):false; $s=$j===false?substr($c,$i,$max):substr($c,$i,min($max,$j-$i+strlen($b))); return $s; };
  try{
  $c=get_post(34524)->post_content; $o['t_6']=$seg($c,'6.4.','7. Prekių kokybės',7000); $o['t_86']=$seg($c,'8.6.','9. Pirkėjo',1500); $o['t_head']=substr($c,0,600); $o['t_md5']=md5($c);
  $c2=get_post(14894)->post_content; $o['p_neatsi']=$seg($c2,'Jeigu Pirkėjas prekių nepriima',"\n",1200); $o['p_kurjeris']=$seg($c2,'Pristatymas kurjeriu','Prekių pristatymas į Kuršių',2500); $o['p_md5']=md5($c2);
  $c3=get_post(34523)->post_content; $o['g_pabaiga']=substr($c3,-1500); $o['g_md5']=md5($c3);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
