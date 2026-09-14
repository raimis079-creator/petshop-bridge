<?php
/** TEMP PS S1681 y — read-only: telefono validacijos patikra naujoje užklausoje (po s1681_x). */
add_action('init', function(){
  if (!isset($_GET['ps_s1681y'])) return; $o=array('v'=>'S1681 y','md5'=>md5_file(get_stylesheet_directory().'/functions.php'));
  $t=function($salis,$tel){ $_POST['billing_country']=$salis; $_POST['billing_phone']=$tel; wc_clear_notices(); do_action('woocommerce_checkout_process'); $n=wc_get_notices('error'); wc_clear_notices(); return ($n?'KLAIDA':'ok').' → '.apply_filters('woocommerce_process_checkout_field_billing_phone',$tel); };
  foreach(array(array('LT','+370 612 34567'),array('LT','861234567'),array('LT','+371 21234567'),array('LV','+371 21234567'),array('LV','21234567'),array('LV','2123456'),array('EE','+372 5123 4567'),array('EE','51234567'),array('EE','+370 61234567')) as $c) $o['test'][$c[0].' '.$c[1]]=$t($c[0],$c[1]);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
