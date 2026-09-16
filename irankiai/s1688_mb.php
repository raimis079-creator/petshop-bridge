<?php
/** TEMP PS S1688 mb — RECON (read-only): Petshop_Pakartoti::grupe/duomenys elgsena kai last_order_id=0; Petshop_Email_Layout viešos f-jos; refill on_order_paid/track_purchase eilutės; Petshop_Sutikimai::nustatyti; WC order lookup pagal prekę. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688mb'])) return; $o=array('v'=>'S1688 mb');
  $src=function($cls,$m,$max=60){ $r=new ReflectionMethod($cls,$m); $L=file($r->getFileName()); $out=array(); for($i=$r->getStartLine()-1;$i<min($r->getEndLine(),$r->getStartLine()-1+$max);$i++){ $l=trim($L[$i]); if($l!==''&&strpos($l,'//')!==0) $out[]=($i+1).': '.mb_substr($l,0,190); } return $out; };
  $o['pakartoti_grupe']=$src('Petshop_Pakartoti','grupe',45);
  $o['refill_track']=$src('Petshop_Refill_Engine','track_purchase',60);
  $o['sutikimai_nustatyti']=$src('Petshop_Sutikimai','nustatyti',30);
  if(class_exists('Petshop_Email_Layout')){ $r=new ReflectionClass('Petshop_Email_Layout'); foreach($r->getMethods(ReflectionMethod::IS_PUBLIC) as $m){ $p=array(); foreach($m->getParameters() as $pp){$p[]=($pp->isOptional()?'?':'').'$'.$pp->getName();} $o['layout'][]=($m->isStatic()?'s ':'').$m->getName().'('.implode(',',$p).')'; } }
  $o['refill_engine_consts']=(new ReflectionClass('Petshop_Refill_Engine'))->getConstants();
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
