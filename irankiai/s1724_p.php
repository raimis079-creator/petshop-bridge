<?php
/** Plugin Name: TEMP PS S1724p eksportas: snippet 565 kodas (b64) i repo read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724p'])) return; global $wpdb; $P=$wpdb->prefix; $c=$wpdb->get_row("SELECT name,code FROM {$P}snippets WHERE id=565",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode(['v'=>'S1724p','name'=>$c['name'],'md5'=>md5($c['code']),'b64'=>base64_encode($c['code'])]); exit;
}, 1);
