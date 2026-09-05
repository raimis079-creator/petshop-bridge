<?php
/** TEMP PS S1617 run r10 (recon, tik skaitymas) — „Sąskaita“ langas: juostos nav elementai (petshop-juosta.php), dokumentų meta raktai temoje (`_petshop_*`), jų kiekiai/pavyzdžiai wc_orders_meta, IAPV PDF kelias/pavadinimas, wcdn/invoice failų pavadinimai, refund'ų KR meta, petshop-pragma (kas eksportuoja), skydelio „Sąskaita“ duomenų vieta (ps_dl_skydelis). */
add_action('init', function(){
  if (!isset($_GET['ps_r10'])) return;
  $o=array('v'=>'S1617 r10'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $grep=function($file,$pats,$ctx=1,$max=30,$w=420){ $r=array(); if(!file_exists($file)) return 'NĖRA '.$file; $l=file($file); foreach($l as $i=>$ln){ foreach((array)$pats as $pt){ if(preg_match($pt,$ln)){ $r[]=($i+1).': '.mb_substr(trim(implode(' ⏎ ',array_map('trim',array_slice($l,max(0,$i-$ctx),$ctx*2+1)))),0,$w); break; } } if(count($r)>=$max) break; } return $r; };
  $mu=WPMU_PLUGIN_DIR; $th=get_stylesheet_directory();
  $o['juosta_nav']=$grep($mu.'/petshop-juosta.php',array('/Žurnalas|Rinkiniai|Akcijos|Laiškai|Rytinė eiga|Gavimas|Tiekimas/u','/function nav|function juosta|function html|add_action\(/'),1,30,500);
  $o['tema_meta']=$grep($th.'/functions.php',array('/_petshop_[a-z_]+/'),0,60,300);
  $o['meta_kiekiai']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key LIKE '_petshop_%' GROUP BY meta_key",ARRAY_A);
  $o['meta_pvz']=$wpdb->get_results("SELECT order_id,meta_key,LEFT(meta_value,160) v FROM {$p}wc_orders_meta WHERE meta_key IN ('_petshop_order_pdf','_petshop_iapv_number','_petshop_completed_pdf','_petshop_avpn_number','_petshop_invoice_document_type','_petshop_kravpn_number','_petshop_kravpn_pdf','_petshop_kravpn_date','_petshop_avpn_date','_petshop_iapv_date') ORDER BY order_id DESC LIMIT 24",ARRAY_A);
  $up=wp_upload_dir(); $inv=glob($up['basedir'].'/wcdn/invoice/*.pdf'); $o['invoice_failai']=array('n'=>count($inv),'pvz'=>array_map('basename',array_slice($inv,-8)),'iapv'=>count(array_filter($inv,function($f){ return stripos(basename($f),'IAPV')!==false||stripos(basename($f),'sankstin')!==false; })));
  $o['refunds_kr']=$wpdb->get_results("SELECT o.id,o.parent_order_id,o.total_amount,o.date_created_gmt,m.meta_value kr FROM {$p}wc_orders o JOIN {$p}wc_orders_meta m ON m.order_id=o.id AND m.meta_key='_petshop_kravpn_number' WHERE o.type='shop_order_refund'",ARRAY_A);
  $o['pragma']=array(); foreach(glob($mu.'/petshop-pragma*.php') as $f){ $o['pragma'][basename($f)]=$grep($f,array('/^\s*\*\s/','/function /','/_petshop_|AVPN|kredit|refund/i'),0,25,300); }
  $o['dl_saskaita']=$grep($mu.'/petshop-darbalaukis.php',array("/'Sąskaita'|Sąskaita<\\/button>|skSask|'saskaita'/u"),0,10,300);
  $o['skydelis_fn']=$grep($mu.'/petshop-darbalaukis.php',array('/function skydelis\(|function skydelio_duomenys|ps_dl_skydelis/'),0,8,300);
  $o['orders_docs']=$wpdb->get_var("SELECT COUNT(DISTINCT order_id) FROM {$p}wc_orders_meta WHERE meta_key IN ('_petshop_avpn_number','_petshop_iapv_number')");
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
