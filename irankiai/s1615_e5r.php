<?php
/** TEMP PS S1615 run e5r — RECON (tik skaitymas) #4: Partijos::uzsakymo_nurasymas (partijų FIFO), Faktai::rasyti + fakt-grazinimai (ar yra korekcijos/grąžinimo API), tema: invoice doc type / generate pdf / received email (ar PDF su AVPN klientui išeina iškart), atšaukimo kabliukai. */
add_action('init', function(){
  if (!isset($_GET['ps_e5r'])) return;
  $o=array('v'=>'S1615 e5r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $ctx=function($c,$pat,$len=1500,$back=0){ $i=strpos($c,$pat); if($i===false) return null; return substr($c,max(0,$i-$back),$len); };
  $meth=function($cl){ if(!class_exists($cl)) return null; $r=new ReflectionClass($cl); return array('file'=>basename($r->getFileName()),'m'=>array_map(function($mm){ return $mm->name.'('.implode(',',array_map(function($pp){ return '$'.$pp->name; },$mm->getParameters())).')'; },$r->getMethods(ReflectionMethod::IS_PUBLIC))); };
  try{
  $mu=WPMU_PLUGIN_DIR;
  foreach(array('Petshop_Partijos','Petshop_Faktai','Petshop_Fakt_Grazinimai','Petshop_Fakt_Siuntos','Petshop_Fakt_Atsargos','Petshop_Event_Emitters') as $cl){ $o['cls'][$cl]=$meth($cl); }
  $c=(string)file_get_contents($mu.'/petshop-partijos.php'); $o['partijos_head']=substr($c,0,1400); $o['partijos_nurasymas']=$ctx($c,'function uzsakymo_nurasymas',2200); $o['partijos_grazinimas']=$ctx($c,'function uzsakymo_grazinimas',1200) ?: $ctx($c,'grazin',900,300);
  preg_match_all('/add_action\(\s*[\'"]([^\'"]+)[\'"]\s*,\s*([^,\)]{0,60})/',$c,$m); $o['partijos_hooks']=array_map(null,$m[1],$m[2]);
  $c=(string)file_get_contents($mu.'/petshop-faktai.php'); $o['faktai_head']=substr($c,0,1600); $o['faktai_rasyti']=$ctx($c,'function rasyti',1800); $o['faktai_korekcija']=$ctx($c,'korekc',900,300);
  preg_match_all('/add_action\(\s*[\'"]([^\'"]+)[\'"]\s*,\s*([^,\)]{0,60})/',$c,$m); $o['faktai_hooks']=array_map(null,$m[1],$m[2]);
  $c=(string)file_get_contents($mu.'/petshop-fakt-grazinimai.php'); $o['fg_head']=substr($c,0,1600); preg_match_all('/add_action\(\s*[\'"]([^\'"]+)[\'"]\s*,\s*([^,\)]{0,60})/',$c,$m); $o['fg_hooks']=array_map(null,$m[1],$m[2]); preg_match_all('/function\s+(\w+)\s*\(([^)]*)\)/',$c,$m); $o['fg_fns']=array_map(null,$m[1],$m[2]);
  $c=(string)file_get_contents(get_stylesheet_directory().'/functions.php'); $o['th_doc_type']=$ctx($c,'function petshop_get_invoice_document_type',900); $o['th_gen_pdf']=$ctx($c,'function petshop_generate_invoice_pdf',2200); $o['th_received']=$ctx($c,"'petshop_send_order_received_email'",1800); $o['th_attach']=$ctx($c,"'woocommerce_email_attachments'",1200); $o['th_status_changed']=$ctx($c,"'woocommerce_order_status_changed'",1400);
  $o['ivykiai']=$meth('Petshop_Uzsakymu_Ivykiai');
  $o['cancel_hooks']=array(); foreach(array('woocommerce_order_status_cancelled','woocommerce_order_status_refunded','woocommerce_order_partially_refunded','woocommerce_order_refunded','woocommerce_order_fully_refunded','woocommerce_saved_order_items','woocommerce_before_delete_order_item') as $h){ $cb=array(); if(isset($GLOBALS['wp_filter'][$h])){ foreach($GLOBALS['wp_filter'][$h]->callbacks as $pr=>$cbs){ foreach($cbs as $k=>$v){ $fn=$v['function']; $cb[]=$pr.':'.(is_string($fn)?$fn:(is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:'closure')); } } } $o['cancel_hooks'][$h]=$cb; }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
