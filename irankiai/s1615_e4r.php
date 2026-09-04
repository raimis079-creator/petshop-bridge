<?php
/** TEMP PS S1615 run e4r — RECON (tik skaitymas): kas išrašo AVPN/IAPV (grep case-insensitive mu-plugins, plugins, tema, aktyvūs snippet'ai), hook'ai, PDF generatorius, ar yra kreditinė/perrašymas. */
add_action('init', function(){
  if (!isset($_GET['ps_e4r'])) return;
  $o=array('v'=>'S1615 e4r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $ctx=function($c,$pat,$len=1400){ $i=stripos($c,$pat); if($i===false) return null; return substr($c,max(0,$i-300),$len); };
  try{
  $hits=array();
  foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/*/*.php'),glob(WP_PLUGIN_DIR.'/*/*/*.php'),glob(get_stylesheet_directory().'/*.php'),glob(get_template_directory().'/*.php')) as $ff){ $c=(string)@file_get_contents($ff); if(stripos($c,'avpn')!==false||stripos($c,'iapv')!==false){ $n=preg_match_all('/avpn|iapv/i',$c); preg_match_all('/add_(action|filter)\(\s*[\'"]([^\'"]+)[\'"]/',$c,$m); $hits[str_replace(array(WPMU_PLUGIN_DIR.'/',WP_PLUGIN_DIR.'/',WP_CONTENT_DIR.'/'),'',$ff)]=array('n'=>$n,'size'=>strlen($c),'hooks'=>array_slice(array_values(array_unique($m[2])),0,25)); } }
  $o['files']=$hits;
  $sn=$wpdb->get_results("SELECT id,name,active,LENGTH(code) len FROM {$p}snippets WHERE (code LIKE '%avpn%' OR code LIKE '%iapv%' OR code LIKE '%_petshop_invoice_document_type%') AND name NOT LIKE 'TEMP%' ORDER BY active DESC, id DESC LIMIT 20",ARRAY_A); $o['snippets']=$sn;
  foreach($sn as $s){ if((int)$s['active']!==1) continue; $c=(string)$wpdb->get_var($wpdb->prepare("SELECT code FROM {$p}snippets WHERE id=%d",$s['id'])); preg_match_all('/add_(action|filter)\(\s*[\'"]([^\'"]+)[\'"]\s*,\s*([^,\)]{0,60})/',$c,$m); $o['snip'][$s['id']]=array('name'=>$s['name'],'hooks'=>array_map(null,$m[2],$m[3]),'head'=>substr($c,0,900),'counter_ctx'=>$ctx($c,'petshop_avpn_counter',1600),'doc_type_ctx'=>$ctx($c,'_petshop_invoice_document_type',900),'kredit'=>preg_match_all('/kredit|credit|storno|anuliu/i',$c),'pdf'=>preg_match_all('/dompdf|mpdf|tcpdf|wcdn|wpo_wcpdf/i',$c,$mm)?array_values(array_unique($mm[0])):array()); }
  // 2 failai su hitais — kontekstas
  foreach($hits as $f=>$h){ if($h['n']<3) continue; $ff=(strpos($f,'petshop-')===0&&file_exists(WPMU_PLUGIN_DIR.'/'.$f))?WPMU_PLUGIN_DIR.'/'.$f:(file_exists(WP_PLUGIN_DIR.'/'.$f)?WP_PLUGIN_DIR.'/'.$f:WP_CONTENT_DIR.'/'.$f); $c=(string)@file_get_contents($ff); $o['ctx'][$f]=array('counter'=>$ctx($c,'petshop_avpn_counter',1400),'doc_type'=>$ctx($c,'_petshop_invoice_document_type',800)); }
  $o['wcdn_dir']=array_slice(array_map('basename',glob(wp_upload_dir()['basedir'].'/wcdn/invoice/*.pdf')),-5); $o['wcdn_n']=count(glob(wp_upload_dir()['basedir'].'/wcdn/invoice/*.pdf'));
  $o['status_hooks']=array(); foreach(array('woocommerce_payment_complete','woocommerce_order_status_processing','woocommerce_order_status_completed','woocommerce_checkout_order_processed','woocommerce_new_order','woocommerce_thankyou') as $h){ $cb=array(); if(isset($GLOBALS['wp_filter'][$h])){ foreach($GLOBALS['wp_filter'][$h]->callbacks as $pr=>$cbs){ foreach($cbs as $k=>$v){ $fn=$v['function']; $cb[]=$pr.':'.(is_string($fn)?$fn:(is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:'closure')); } } } $o['status_hooks'][$h]=$cb; }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
