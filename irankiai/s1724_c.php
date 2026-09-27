<?php
/** Plugin Name: TEMP PS S1724c rytas dropship_sla kodas + darbalaukio darbo_diena helperiai read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724c'])) return;
  $r=['v'=>'S1724c'];
  try{
    $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-rytas.php'); $L=explode("\n",$s);
    $r['rytas_430_480']=implode("\n",array_map(function($i) use($L){ return ($i+1).': '.($L[$i]??''); },range(425,485)));
    // kur dar rytas naudoja "> 2 d." (neissiusti) – kalendorines
    foreach($L as $i=>$l){ if(preg_match('/neissiusti|DAY_IN_SECONDS|INTERVAL \d+ (DAY|HOUR)|lead_d/',$l)) $r['rytas_dienos'][]=($i+1).': '.trim($l); }
    $d=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); $M=explode("\n",$d);
    foreach($M as $i=>$l){ if(preg_match('/function\s+(darbo_diena|pilnos_darbo_dienos)\s*\(/',$l)){ $r['dl_helper'][]=implode("\n",array_map(function($j) use($M){ return ($j+1).': '.($M[$j]??''); },range(max(0,$i-3),min(count($M)-1,$i+22)))); } }
    foreach($M as $i=>$l){ if(preg_match('/pilnos_darbo_dienos\(|darbo_diena\(/',$l)&&!preg_match('/function/',$l)) $r['dl_naudojimas'][]=($i+1).': '.mb_substr(trim($l),0,220); }
    $ds=WPMU_PLUGIN_DIR.'/petshop-dropship-sargas.php'; if(is_file($ds)){ $c=file_get_contents($ds); $r['dropship_sargas_md5']=md5($c); $N=explode("\n",$c); foreach($N as $i=>$l){ if(preg_match('/_ps_sla_velavimas|24|HOUR|DAY_IN|darbo|savaitg|weekend|->format\(.N.\)/',$l)) $r['dropship_sargas'][]=($i+1).': '.mb_substr(trim($l),0,220); } $r['dropship_sargas_eil']=count($N); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
