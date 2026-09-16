<?php
/** TEMP PS S1688 mf — RECON: Petshop_Lifecycle_Vartai::eligibility/holdout ir Petshop_Pakartoti::vartai kodas — ar aiškiai paprašytas priminimas (feedback_cycle=relaunch, last_order_id=0) praeina holdout ir „jau siųsta" sargus. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688mf'])) return; $o=array('v'=>'S1688 mf');
  $src=function($cls,$m){ $r=new ReflectionMethod($cls,$m); $L=file($r->getFileName()); $out=array(); for($i=$r->getStartLine()-1;$i<$r->getEndLine();$i++){ $l=trim($L[$i]); if($l!==''&&strpos($l,'//')!==0) $out[]=($i+1).': '.mb_substr($l,0,230); } return $out; };
  $o['vartai_elig']=$src('Petshop_Lifecycle_Vartai','eligibility'); $o['vartai_holdout']=$src('Petshop_Lifecycle_Vartai','holdout'); $o['pakartoti_vartai']=$src('Petshop_Pakartoti','vartai');
  $o['md5_vartai']=md5_file(WPMU_PLUGIN_DIR.'/petshop-lifecycle-vartai.php'); $o['ver_vartai']=get_file_data(WPMU_PLUGIN_DIR.'/petshop-lifecycle-vartai.php',array('v'=>'Version'))['v'];
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
