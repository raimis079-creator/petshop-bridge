<?php
/** TEMP PS S1623 r4 — RECON: gyvi failai petshop-juosta.php ir petshop-av-tiekimas.php (b64), Petshop_Katalogas::eiles struktūra („uzsakyti“ per prekę), savikainos meta raktai. */
add_action('init', function(){
  if (!isset($_GET['ps_r6'])) return;
  $o=array('v'=>'S1623 r4'); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  foreach(array('juosta'=>'petshop-juosta.php','tiek'=>'petshop-av-tiekimas.php') as $k=>$f){ $c=(string)file_get_contents(WPMU_PLUGIN_DIR.'/'.$f); $o[$k]=array('md5'=>md5($c),'n'=>strlen($c),'b64'=>base64_encode($c)); }
  if(class_exists('Petshop_Katalogas')){ $m=new ReflectionClass('Petshop_Katalogas'); $o['kat_methods']=array_map(function($x){return $x->name.'('.implode(',',array_map(function($pp){return '$'.$pp->getName();},$x->getParameters())).')';},$m->getMethods(ReflectionMethod::IS_STATIC));
    $kf=$m->getFileName(); $L=explode("\n",(string)file_get_contents($kf)); $g=array(); foreach($L as $i=>$l){ if(preg_match('/function eiles|uzsakyti|riba|min_likutis|_ps_riba|reikia/i',$l)) $g[]=($i+1).': '.mb_substr(trim($l),0,170); if(count($g)>40) break; } $o['kat_grep']=$g; $o['kat_file']=basename($kf); }
  $o['cost_meta']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}postmeta WHERE meta_key IN ('_vf_cost','_zb_cost','_cost_price','_prins_cost','_belcor_cost','_quattro_cost','_ambrosia_cost','_ps_min_likutis','_ps_riba') GROUP BY meta_key",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
