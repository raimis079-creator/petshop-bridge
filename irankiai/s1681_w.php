<?php
/** TEMP PS S1681 w — read-only: flatsome-child functions.php telefono validacijos blokas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681w'])) return; $f=get_stylesheet_directory().'/functions.php'; $s=file_get_contents($f); $o=array('v'=>'S1681 w','md5'=>md5($s),'dydis'=>strlen($s));
  $i=strpos($s,"billing_phone']['placeholder'"); $o['placeholder']=substr($s,max(0,$i-400),700);
  $i=strpos($s,'billing_phone\'] ) ? sanitize_text_field'); $o['val']=substr($s,$i+500,900);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
