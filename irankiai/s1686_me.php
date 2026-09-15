<?php
/** TEMP PS S1686 me — READ-ONLY: Petshop_Email_Layout metodai ir wrap() argumentai (antraštė). */
add_action('init', function(){
  if (!isset($_GET['ps_s1686me'])) return; $o=array('v'=>'S1686 me'); $M=file(WP_PLUGIN_DIR.'/petshop-core/includes/class-email-layout.php');
  foreach($M as $i=>$l) if(preg_match('/public static function/',$l)) $o['met'][]=($i+1).': '.trim($l);
  $o['wrap']=implode("\n",array_map('trim',array_slice($M,143,20)));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
