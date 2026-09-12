<?php
/** TEMP PS S1676 run g — desk atšaukimo su laišku funkcija; dispatch enqueue API; dunning-1 pilnas; payment_failed kur kviečiamas. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676g'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 g');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-desk.php'); $L=explode("\n",$s);
  foreach($L as $i=>$l){ if(preg_match('/su_laisku|atsaukta_laiskas|function atsaukti|order_cancelled|laiskai_off/',$l)) $o['desk'][]=($i+1).': '.trim(mb_substr($l,0,220)); }
  // funkcija, kurioje su_laisku
  if(preg_match('/function\s+(\w+)\s*\([^)]*\)\s*\{(?:(?!function\s).){0,4000}?su_laisku/su',$s,$m)){ $o['desk_fn']=$m[1]; $st=strpos($s,'function '.$m[1]); $o['desk_fn_src']=mb_substr($s,$st,2600); }
  $rc=new ReflectionClass('Petshop_Email_Dispatch'); foreach($rc->getMethods() as $m){ $ps=array(); foreach($m->getParameters() as $pp) $ps[]=($pp->isOptional()?'?':'').$pp->getName(); $o['dispatch_api'][$m->getName()]=implode(',',$ps); }
  $o['dunning1']=file_get_contents(PETSHOP_CORE_DIR.'templates/emails/dunning-1.php');
  foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/petshop-core/includes/*.php')) as $f){ $c=file_get_contents($f); if(preg_match_all("/[^\n]{0,100}'payment_failed'[^\n]{0,120}/",$c,$m)) $o['payment_failed_kur'][basename($f)]=array_map('trim',$m[0]); }
  // atsauktas kliento laiskas — kas siuncia (S1639: WC cancelled email? petshop-laiskai?)
  foreach(glob(WPMU_PLUGIN_DIR.'/petshop-laiskai*.php') as $f){ $c=file_get_contents($f); if(preg_match_all("/[^\n]{0,100}(cancelled|atsauk)[^\n]{0,140}/i",$c,$m)) $o['laiskai_cancel'][basename($f)]=array_slice(array_map('trim',array_unique($m[0])),0,12); }
  $o['wc_cancel_email']=get_option('woocommerce_customer_cancelled_order_settings');
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
