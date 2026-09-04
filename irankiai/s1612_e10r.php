<?php
/** TEMP PS S1612 run e10r — R: V13 recon — kas rašo `_ps_sla_velavimas` (variklio SLA sargas), #35421 meta — tik skaitymas */
add_action('init', function(){
  if (!isset($_GET['ps_e10r'])) return;
  $o=array('v'=>'run e10r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{
    foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $fi){ $c=file_get_contents($fi); if(strpos($c,'_ps_sla_velavimas')!==false){ $ls=explode("\n",$c); foreach($ls as $i=>$l){ if(strpos($l,'_ps_sla_velavimas')!==false || strpos($l,'ps_dropship_sargas')!==false) $o['vietos'][basename($fi)][]=($i+1).': '.trim(mb_substr($l,0,220)); } if(preg_match('/function\s+(sargas|sla_sargas|velavimo_sargas|dropship_sargas)\s*\(.*?\n\t\}\n/s',$c,$m)) $o['fn'][basename($fi)]=mb_substr($m[0],0,3200); } }
    $x=wc_get_order(35421); $o['35421']=array('st'=>$x->get_status(),'sla'=>(string)$x->get_meta('_ps_sla_velavimas'),'dropship_sent'=>(string)$x->get_meta('_ps_dropship_sent'),'dropship_sent_src'=>(string)$x->get_meta('_ps_dropship_sent_src'),'dalys_issiusta'=>(string)$x->get_meta('_ps_dalys_issiusta'),'shipments'=>(string)$x->get_meta('_ps_shipments'),'order_shipped'=>(string)$x->get_meta('_ps_order_shipped_emitted'));
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
