<?php
/** TEMP PS S1619 run r3 — RECON C (tik skaitymas): siuntu-laiskai `uzbaigimo_sargas` (§18.3, `_ps_uzbaigti_be_siuntu`), WC laiškų būsenos, desk `lapai` veiksmo sąlygos, `surinkta_zyme`. */
add_action('init', function(){
  if (!isset($_GET['ps_r3'])) return;
  $o=array('v'=>'S1619 r3'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $meth=function($cls,$m,$max=50){ try{ $r=new ReflectionMethod($cls,$m); $L=file($r->getFileName()); $n=min($max,$r->getEndLine()-$r->getStartLine()+1); return array('f'=>basename($r->getFileName()),'nuo'=>$r->getStartLine(),'kodas'=>array_map(function($x){return mb_substr(rtrim($x),0,230);},array_slice($L,$r->getStartLine()-1,$n))); }catch(Throwable $e){ return $e->getMessage(); } };
  $grep=function($f,$re,$ctx=0,$lim=30,$w=200){ $out=array(); if(!file_exists($f)) return array('NĖRA'); $L=file($f); foreach($L as $i=>$l){ if(preg_match($re,$l)){ for($j=max(0,$i-$ctx);$j<=min(count($L)-1,$i+$ctx);$j++){ $out[]=($j+1).': '.mb_substr(rtrim($L[$j]),0,$w); } if($ctx) $out[]='--'; if(count($out)>$lim*($ctx*2+1)) break; } } return $out; };
  try{
  $mu=WPMU_PLUGIN_DIR;
  foreach(array('Petshop_Siuntos','Petshop_Siuntu_Laiskai','Petshop_Siuntu_Registras') as $c){ if(class_exists($c)&&method_exists($c,'uzbaigimo_sargas')){ $o['sargas']=$meth($c,'uzbaigimo_sargas',40); $o['sargo_klase']=$c; break; } }
  if(empty($o['sargas'])){ $o['sargas']=$grep($mu.'/petshop-siuntu-laiskai.php','/function uzbaigimo_sargas/',20,1,230); }
  $em=WC()->mailer()->get_emails(); foreach(array('WC_Email_Customer_Completed_Order','WC_Email_Customer_Processing_Order','WC_Email_Customer_On_Hold_Order','WC_Email_New_Order') as $k){ $o['wc_laiskai'][$k]=isset($em[$k])?array('on'=>$em[$k]->is_enabled(),'subject'=>$em[$k]->get_subject()):'?'; }
  $o['desk_lapai']=$grep($mu.'/petshop-desk.php','/\'lapai\'/',1,12,200);
  $o['desk_veiksmas_apmoketa']=$grep($mu.'/petshop-desk.php','/\'apmoketa\'|payment_complete\(|set_date_paid/',1,12,200);
  $o['dl_surinkta_zyme']=$meth('Petshop_Darbalaukis','surinkta_zyme',30);
  $o['dl_siuntos_laiskas_head']=$meth('Petshop_Darbalaukis','siuntos_laiskas',14);
  $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
