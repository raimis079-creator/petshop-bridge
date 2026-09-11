<?php
/** Plugin Name: TEMP PS S1673 snippets grep */
add_action('init', function(){ if(!isset($_GET['ps_sn'])||$_GET['ps_sn']!=='GO') return;
  header('Content-Type: application/json; charset=utf-8'); global $wpdb; $o=array();
  $o['snippets']=$wpdb->get_results("SELECT id,name,active,scope,LENGTH(code) len FROM {$wpdb->prefix}snippets WHERE code LIKE '%transaction_id%' OR code LIKE '%GTM-MF3GZGT%' OR code LIKE '%dataLayer%'",ARRAY_A);
  foreach($o['snippets'] as $s){ $c=$wpdb->get_var($wpdb->prepare("SELECT code FROM {$wpdb->prefix}snippets WHERE id=%d",$s['id'])); preg_match_all('/.{0,80}(transaction_id|dataLayer\.push|user_data|email).{0,120}/',$c,$m); $o['s'.$s['id']]=array_slice(array_map(function($x){return preg_replace('/\s+/',' ',$x);},$m[0]),0,6); }
  $o['opt']=$wpdb->get_results("SELECT option_name FROM {$wpdb->options} WHERE option_value LIKE '%GTM-MF3GZGT%'",ARRAY_A);
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; });
