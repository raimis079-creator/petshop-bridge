<?php
/** TEMP PS S1691 e — petshop-dim-klientai.php: antraštė, insert/replace vietos su kontekstu. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691e'])) return; $o=array();
  $f=WPMU_PLUGIN_DIR.'/petshop-dim-klientai.php'; $l=file($f); $o['md5']=md5_file($f); $o['dydis']=filesize($f); $o['eil']=count($l);
  $o['antraste']=implode('',array_slice($l,0,30));
  foreach ($l as $i=>$ln){ if (preg_match('/->insert\(|->replace\(|INSERT |REPLACE |ON DUPLICATE|->update\(|->query\(|DELETE |TRUNCATE|perskaiciuota_at|add_action\(|wp_schedule|ps_dim_klientu/i',$ln)) $o['vietos'][$i+1]=trim(mb_substr($ln,0,240)); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
