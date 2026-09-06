<?php
/** TEMP PS S1620 run e5s — S: Playwright kadras — svečio užsakymo puslapis (#35813) po vertimai v1.2 (vizuali patikra). */
add_action('init', function(){
  if (!isset($_GET['ps_e5s'])) return;
  $o=array('v'=>'S1620 e5s'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $g=wc_get_order(35813); $o['shots']=array(array('n'=>'s1620_e5_svecio_uzsakymas_35813','u'=>$g->get_checkout_order_received_url(),'w'=>1280,'h'=>800));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
