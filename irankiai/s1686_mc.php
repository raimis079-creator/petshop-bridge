<?php
/** TEMP PS S1686 mc — READ-ONLY: dispatch enqueue/eligibility kodas (150–300), Layout::wrap flow_class naudojimas, refill variklio enqueue kvietimas, Suppression kanalai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mc'])) return; $o=array('v'=>'S1686 mc'); $core=WP_PLUGIN_DIR.'/petshop-core/includes';
  $L=file("$core/class-email-dispatch.php"); $o['dispatch_150_300']=implode("\n",array_map('trim',array_slice($L,150,150)));
  foreach(glob("$core/*.php") as $f){ if(preg_match('/layout/i',$f)){ $M=file($f); foreach($M as $i=>$l) if(preg_match('/flow_class|reason|unsubscribe|optout|CH_/i',$l)) $o['layout'][]=basename($f).':'.($i+1).': '.trim(mb_substr($l,0,200)); } }
  $R=file("$core/class-refill-engine.php"); foreach($R as $i=>$l) if(preg_match('/enqueue|predicted_empty|reminder_days|DAY|status|feedback_url|reorder_url/i',$l)) $o['refill_engine'][]=($i+1).': '.trim(mb_substr($l,0,200));
  $S=glob("$core/*suppression*"); if($S){ $M=file($S[0]); foreach($M as $i=>$l) if(preg_match('/const CH_|function (is_suppressed|suppress)/',$l)) $o['suppr'][]=($i+1).': '.trim($l); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
