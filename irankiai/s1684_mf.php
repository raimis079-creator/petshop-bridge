<?php
/** TEMP PS S1684 mf — READ-ONLY: petshop-analitika-langas.php — visos vietos su savikaina/pvm/marža/reklama/CAC, kad pataisyti matematiką. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684mf'])) return; $o=array('v'=>'S1684 mf'); $f=WPMU_PLUGIN_DIR.'/petshop-analitika-langas.php'; $s=file_get_contents($f); $o['md5']=md5($s); $o['dydis']=strlen($s); $L=explode("\n",$s);
  foreach($L as $i=>$l) if(preg_match('/savikain|pvm_ct|marz|antkain|reklam|islaid|spend|CAC|cac|kontribuc/i',$l)) $o['eil'][]=($i+1).': '.trim(mb_substr($l,0,220));
  $o['blokai']=array(); foreach($L as $i=>$l) if(preg_match("/'(reklama|krepseliai|klientai|pristatymas|laiskai|[a-z_]+)'\s*=>\s*array\(\s*'pav/",$l,$m)) $o['blokai'][]=($i+1).': '.$m[1];
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
