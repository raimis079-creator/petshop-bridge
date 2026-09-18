<?php
/** TEMP PS S1691 i — paimti 3 pakeistus failus (base64) repo deploy/ kopijoms; php_error.log būklė. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691i'])) return; $o=array();
  foreach (array('dim'=>WPMU_PLUGIN_DIR.'/petshop-dim-klientai.php','kl'=>WPMU_PLUGIN_DIR.'/petshop-klientai.php','xml'=>WP_PLUGIN_DIR.'/petshop-xml/petshop-xml.php') as $k=>$f){ $o[$k]=array('md5'=>md5_file($f),'b64'=>base64_encode(file_get_contents($f))); }
  $pl=dirname(ABSPATH).'/logs/php_error.log'; $o['log']=array('dydis'=>filesize($pl),'turinys'=>mb_substr(file_get_contents($pl),0,1500));
  header('Content-Type: application/json'); echo json_encode($o,JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
