<?php
/** TEMP PS S1685 na — RECON read-only: Petshop_Email_Layout p()/open()/close() markup (paraštės, šriftai), kad lentelė sutaptų su tekstu. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685na'])) return; $o=array('v'=>'S1685 na');
  foreach(glob(WP_PLUGIN_DIR.'/petshop-core/includes/*.php') as $f){ $l=file_get_contents($f); if(strpos($l,'class Petshop_Email_Layout')!==false){ foreach(array('function p(','function open(','function close(','const C_','function secondary(') as $k){ $i=strpos($l,$k); $o[$k]=substr($l,$i,$k==='function open('?2200:900); } } }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
