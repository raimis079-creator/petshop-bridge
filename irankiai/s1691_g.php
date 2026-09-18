<?php
/** TEMP PS S1691 g — petshop-klientai.php 90–113, petshop-xml.php 350–420 ($category naudojimas). Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691g'])) return; $o=array();
  $l=file(WPMU_PLUGIN_DIR.'/petshop-klientai.php'); for($i=88;$i<113;$i++) if(isset($l[$i])) $o['kl'][$i+1]=rtrim($l[$i]);
  preg_match('/Version:\s*([\d\.]+)/',implode('',array_slice($l,0,20)),$m); $o['kl_ver']=$m[1]??null;
  $l=file(WP_PLUGIN_DIR.'/petshop-xml/petshop-xml.php'); for($i=349;$i<425;$i++) if(isset($l[$i])) $o['xml'][$i+1]=rtrim($l[$i]);
  foreach ($l as $i=>$ln) if (preg_match('/\$category|\$brand/',$ln) && $i>424) $o['xml_kitur'][$i+1]=trim(mb_substr($ln,0,160));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
