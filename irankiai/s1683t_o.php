<?php
/** TEMP PS S1683t o — read-only: VF dropship ekranas — „dėžių" laukas, lipdukų būsena (Lipdukai ✓), kas blokuoja; užsakymo tiekėjui #23 būklė. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683to'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1683t o');
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $s=file_get_contents($f); if(strpos($s,'Kaip atkeliaus į AV')!==false||strpos($s,'dėžių')!==false){ $n=basename($f); preg_match('/Version:\s*([\d.]+)/i',$s,$mv); $o['failas'][$n]=$mv[1]??''; $l=explode("\n",$s); foreach($l as $i=>$ln) if(preg_match('/dėžių|deziu|Lipdukai|readonly|disabled|av_siunta|_ps_av_lipduk|Kaip atkeliaus/i',$ln)) $o['eil'][$n][]=($i+1).': '.substr(trim($ln),0,260); } }
  foreach($wpdb->get_results("SHOW TABLES LIKE '{$p}ps_%partij%'",ARRAY_N) as $t) $o['lent'][]=$t[0];
  $o['partija23']=$wpdb->get_row("SELECT * FROM {$p}ps_partijos WHERE id=23",ARRAY_A);
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
