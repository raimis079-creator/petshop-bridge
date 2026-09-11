<?php
/** TEMP PS S1675 run g — v2.13 E2E: #35902 (neapmokėtas bacs) PDF regeneravimas → AVPN neturi atsirasti, counter nesikeisti; IAPV numeris toks pat. */
add_action('init', function(){
  if (!isset($_GET['ps_g5'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1675 g');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['pries']=array('counter'=>get_option('petshop_avpn_counter'),'iapv_counter'=>get_option('petshop_iapv_counter'));
  $r=function_exists('petshop_generate_invoice_pdf')?petshop_generate_invoice_pdf(35902):'nėra f-jos'; $o['pdf']=is_string($r)?str_replace(ABSPATH,'',$r):$r;
  $w=wc_get_order(35902); $o['po']=array('counter'=>get_option('petshop_avpn_counter'),'iapv_counter'=>get_option('petshop_iapv_counter'),'avpn'=>(string)$w->get_meta('_petshop_avpn_number'),'iapv'=>(string)$w->get_meta('_petshop_iapv_number'),'tipas'=>(string)$w->get_meta('_petshop_invoice_document_type'));
  $pdf=(string)$w->get_meta('_petshop_order_pdf'); if($pdf && file_exists($pdf)){ $o["pdf_dydis"]=filesize($pdf); $o["pdf_mtime"]=date("H:i:s",filemtime($pdf)); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
