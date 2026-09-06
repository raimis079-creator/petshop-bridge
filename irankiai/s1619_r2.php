<?php
/** TEMP PS S1619 run r2 — RECON C (tik skaitymas): variklio Petshop_Desk — 'kita' vežėjas, auto rūšiavimas (kablys, prioritetas, ar gerbia `_ps_kelias`), veiksmai lapai/issiusta/apmoketa, STATUSAI, klausimas(); siuntu-laiskai kabliai; tema completed kablys; AV_Reduce mazinti sąlygos. */
add_action('init', function(){
  if (!isset($_GET['ps_r2'])) return;
  $o=array('v'=>'S1619 r2'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $grep=function($f,$re,$ctx=0,$lim=40,$w=200){ $out=array(); if(!file_exists($f)) return array('NĖRA '.$f); $L=file($f); foreach($L as $i=>$l){ if(preg_match($re,$l)){ for($j=max(0,$i-$ctx);$j<=min(count($L)-1,$i+$ctx);$j++){ $out[]=($j+1).': '.mb_substr(rtrim($L[$j]),0,$w); } if($ctx) $out[]='--'; if(count($out)>=$lim*($ctx*2+2)) break; } } return $out; };
  $meth=function($cls,$m,$max=60){ try{ $r=new ReflectionMethod($cls,$m); $L=file($r->getFileName()); $n=min($max,$r->getEndLine()-$r->getStartLine()+1); return array('nuo'=>$r->getStartLine(),'iki'=>$r->getEndLine(),'kodas'=>array_map(function($x){return mb_substr(rtrim($x),0,220);},array_slice($L,$r->getStartLine()-1,$n))); }catch(Throwable $e){ return $e->getMessage(); } };
  try{
  $mu=WPMU_PLUGIN_DIR; $desk=$mu.'/petshop-desk.php';
  $o['desk_metodai']=array_map(function($m){return $m->name;},(new ReflectionClass('Petshop_Desk'))->getMethods());
  $o['STATUSAI']=Petshop_Desk::STATUSAI;
  $o['kita']=$grep($desk,'/\'kita\'|vezejas\(/u',1,30);
  $o['auto_rus']=$grep($desk,'/Surūšiuota pati|function auto|_ps_rusiuota|add_action\( \'woocommerce_order_status_processing|add_action\( \'woocommerce_payment_complete/u',1,30);
  $o['ps_kelias']=$grep($desk,'/_ps_kelias/u',0,30);
  $o['veiksmai']=$grep($desk,'/case \'(lapai|issiusta|apmoketa|lipdukas|misrus|kons)\'/u',0,20);
  $o['klausimas']=$meth('Petshop_Desk','klausimas',70);
  $o['veiksmas_apmoketa']=$grep($desk,'/function (apmoketa|zymeti_apmoketa|pazymeti_apmoketa|veiksmas_apmoketa)/u',0,5);
  $o['issiusta_src']=$grep($desk,'/function issiusta|function pazymeti_issiusta|function uzbaigti|function baigti/u',0,8);
  $o['neapmoketi_darbas']=$grep($desk,'/is_paid\(\)/u',0,40,160);
  $o['laiskai_hooks']=$grep($mu.'/petshop-siuntu-laiskai.php','/add_action|add_filter|function /u',0,40,170);
  $o['siuntos_hooks']=$grep($mu.'/petshop-siuntos.php','/add_action|add_filter|_ps_dalys_issiusta/u',0,30,170);
  $o['av_reduce_mazinti']=$meth('Petshop_AV_Reduce','mazinti',40);
  $o['tema_completed']=$grep(get_stylesheet_directory().'/functions.php','/woocommerce_order_status_completed|_petshop_completed_pdf|customer_completed_order|woocommerce_email_attachments|petshop_get_invoice_document_type/u',1,20,200);
  $o['dl_matyta']=$grep($mu.'/petshop-darbalaukis.php','/_ps_matyta|_ps_dalys_issiusta\', /u',0,12,180);
  $o['local_pickup_klase']=class_exists('WC_Shipping_Local_Pickup'); $z=new WC_Shipping_Zone(1); $o['zona1']=$z->get_zone_name();
  $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
