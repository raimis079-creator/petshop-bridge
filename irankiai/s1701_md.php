<?php
/** Plugin Name: TEMP PS S1701 esamas schema recon (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1701'])||$_GET['ps_s1701']!=='1') return;
  header('Content-Type: application/json; charset=utf-8'); $o=array();
  $t=WP_CONTENT_DIR.'/mu-plugins/petshop-schema.php'; $o['md5']=md5_file($t); $o['dydis']=filesize($t); $o['galva']=substr(file_get_contents($t),0,2500);
  $src=file_get_contents($t); preg_match_all('/add_(action|filter)\(\s*[\'"]([^\'"]+)/',$src,$m); $o['hooks']=$m[2]; preg_match_all('/class\s+(\w+)/',$src,$c); $o['klases']=$c[1];
  foreach(glob(WP_CONTENT_DIR.'/mu-plugins/petshop-*schema*.php') as $g) $o['failai'][]=basename($g);
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
