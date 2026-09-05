<?php
/** TEMP PS S1618 run r4 — RECON: temos functions.php 395–520 (petshop_send_order_received_email, status_changed, attachments). */
add_action('init', function(){
  if (!isset($_GET['ps_r4'])) return;
  $o=array('v'=>'S1618 r4'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $lines=file(get_stylesheet_directory().'/functions.php'); $o['src']=implode('',array_slice($lines,394,140));
  $o['kas_kviecia']=array(); foreach($lines as $i=>$l){ if(strpos($l,'petshop_send_order_received_email')!==false) $o['kas_kviecia'][]=($i+1).': '.trim($l); }
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $c=file_get_contents($f); if(strpos($c,'petshop_send_order_received_email')!==false){ foreach(explode("\n",$c) as $i=>$l){ if(strpos($l,'petshop_send_order_received_email')!==false) $o['kas_kviecia'][]=basename($f).':'.($i+1).': '.mb_substr(trim($l),0,160); } } }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
