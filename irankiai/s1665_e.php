<?php
/** TEMP PS S1665 e — READ-ONLY: class-webhook-receiver.php pilnas + esp plugino failai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1665e'])) return;
  $o=array('v'=>'S1665 e');
  $f=WP_PLUGIN_DIR.'/petshop-esp/includes/class-webhook-receiver.php';
  $o['dydis']=filesize($f); $o['md5']=md5_file($f);
  $o['b64']=base64_encode(gzencode(file_get_contents($f),9));
  $o['esp_failai']=array_map('basename',glob(WP_PLUGIN_DIR.'/petshop-esp/includes/*.php'));
  wp_send_json($o);
});
