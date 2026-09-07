<?php
/** TEMP PS S1636 run k3 — READ-ONLY: upl_cat failu buvimas diske, //petshop.lt nuorodu kiekis turinyje, dev certo galiojimas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1636k3'])) return;
  $o=array('v'=>'S1636 k3'); global $wpdb; $p=$wpdb->prefix;
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  $up=wp_upload_dir(); $d=$up['basedir'].'/2026/07/';
  foreach(array('upl_cat-sunims-v2.webp','upl_cat-katems-v2.webp','upl_cat-grauzikams-v2.webp','upl_cat-pauksciams-v2.webp','upl_cat-zuvims-v2.webp') as $f){ $o['failai'][$f]=file_exists($d.$f)?filesize($d.$f):0; }
  $o['upl_visi']=count(glob($d.'upl_*'));
  $c=get_post((int)get_option('page_on_front'))->post_content;
  $o['petshop_lt_nuorodu_turinyje']=substr_count($c,'//petshop.lt/');
  $o['dev_avesa_nuorodu']=substr_count($c,'dev.avesa.lt');
  // certas: sslverify=true i save
  $r=wp_remote_get('https://dev.avesa.lt/',array('timeout'=>20,'sslverify'=>true));
  $o['cert']=is_wp_error($r)?$r->get_error_message():('OK '.wp_remote_retrieve_response_code($r));
  $cx=stream_context_create(array('ssl'=>array('capture_peer_cert'=>true,'verify_peer'=>false,'verify_peer_name'=>false)));
  $s=@stream_socket_client('ssl://dev.avesa.lt:443',$e1,$e2,15,STREAM_CLIENT_CONNECT,$cx);
  if($s){ $pr=stream_context_get_params($s); $crt=openssl_x509_parse($pr['options']['ssl']['peer_certificate']); $o['cert_cn']=$crt['subject']['CN']??'?'; $o['cert_iki']=date('Y-m-d H:i',$crt['validTo_time_t']); }
  $J($o);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage(); $J($o); }
},99);
