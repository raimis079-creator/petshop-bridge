<?php
/** Plugin Name: TEMP PS S1721e read-only: 3 prekiu miniatiuros base64 maketui */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721e'])) return; $r=['v'=>'S1721e'];
  $d=WP_CONTENT_DIR.'/uploads/2026/06/';
  foreach(['exclusion-sausas-edalas-mazu-veisliu-sunims-su-kiauliena-ir-zirniais-300x300.png','exclusion-sausas-edalas-mazu-veisliu-sunims-su-kiauliena-ir-zirniais-4-300x300.png','exclusion-sausas-edalas-mazu-veisliu-sunims-su-kiauliena-ir-zirniais-2-300x300.png'] as $f){ $p=$d.$f; $r['img'][$f]=is_file($p)?['kb'=>round(filesize($p)/1024,1),'b64'=>base64_encode(file_get_contents($p))]:'NERA'; }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r); exit;
}, 1);
