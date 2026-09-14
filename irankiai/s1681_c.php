<?php
/** TEMP PS S1681 c — read-only: petshop-rytas.php neissiusti_sk() kūnas + dabartinis skaičius. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681c'])) return; $o=array('v'=>'S1681 c');
  $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-rytas.php'); $i=strpos($s,'function neissiusti_sk'); $o['fn']=substr($s,$i,1200);
  if(class_exists('Petshop_Rytas')&&method_exists('Petshop_Rytas','neissiusti_sk')){ $r=new ReflectionMethod('Petshop_Rytas','neissiusti_sk'); $r->setAccessible(true); $o['dabar']=$r->invoke(null); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
