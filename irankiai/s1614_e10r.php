<?php
/** TEMP PS S1614 run e10r — RECON (tik skaitymas): petshop-av-sheets.php — kaip lapas atrenka AV eilutes (kokie item meta), ar galima eilutę praleisti nekeičiant variklio. */
add_action('init', function(){
  if (!isset($_GET['ps_e10r'])) return;
  $o=array('v'=>'S1614 e10r'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{ $f=WPMU_PLUGIN_DIR.'/petshop-av-sheets.php'; $ls=file($f); $o['dydis']=count($ls); $out=array(); foreach($ls as $i=>$l){ if(preg_match('/_ps_|get_meta|get_items|source|kelias|apply_filters|do_action|function /',$l)){ $out[]=($i+1).': '.trim(mb_substr($l,0,200)); } } $o['grep']=array_slice($out,0,90);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
