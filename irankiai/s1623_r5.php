<?php
/** TEMP PS S1623 r5 — RECON: Petshop_Katalogas eiles() ir 'pard' / 'uzsakyti' apibrėžimas. */
add_action('init', function(){
  if (!isset($_GET['ps_r7'])) return;
  $o=array('v'=>'S1623 r5'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $L=explode("\n",(string)file_get_contents(WPMU_PLUGIN_DIR.'/petshop-katalogas.php')); $r=function($a,$b) use($L){ $x=array(); for($i=$a-1;$i<$b;$i++) $x[]=($i+1).': '.mb_substr(rtrim($L[$i]),0,200); return $x; };
  $o['eiles']=$r(5349,5372); $o['taisykles']=$r(5790,5815); $g=array(); foreach($L as $i=>$l){ if(preg_match("/'pard'\s*=>|\\\$pard\s*=|\['pard'\]\s*=/",$l)) $g[]=($i+1).': '.mb_substr(trim($l),0,220); } $o['pard']=$g;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
