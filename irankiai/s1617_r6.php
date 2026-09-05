<?php
/** TEMP PS S1617 run r6 (recon, tik skaitymas) — kreditinė: WCDN 7.3.0 creditnote (kaip generuojama, iš ko ima eilutes — refund'ai ar visas užsakymas, numeracija, opcijos), temos base.php creditnote šakos, temos functions.php PDF generavimas (petshop_generate_invoice_pdf, kreditinės f-jos), seno desk `wcdn_print_creditnote`, esami `_wcdn_creditnote_*` meta, refund'ai #35788/#35789, atsisakymas plugin. */
add_action('init', function(){
  if (!isset($_GET['ps_r6'])) return;
  $o=array('v'=>'S1617 r6'); global $wpdb; $p=$wpdb->prefix; set_time_limit(200);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $grep=function($file,$pats,$ctx=1,$max=40,$w=420){ $r=array(); if(!file_exists($file)) return 'NĖRA '.$file; $l=file($file); foreach($l as $i=>$ln){ foreach((array)$pats as $pt){ if(preg_match($pt,$ln)){ $r[]=($i+1).': '.mb_substr(trim(implode(' ⏎ ',array_map('trim',array_slice($l,max(0,$i-$ctx),$ctx*2+1)))),0,$w); break; } } if(count($r)>=$max) break; } return $r; };
  $pd=WP_PLUGIN_DIR.'/woocommerce-delivery-notes'; $o['wcdn_dir']=is_dir($pd);
  $files=array(); foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($pd)) as $f){ if($f->isFile()&&preg_match('/\.php$/',$f->getFilename())){ $c=file_get_contents($f->getPathname()); if(stripos($c,'creditnote')!==false||stripos($c,'credit_note')!==false||stripos($c,'creditNote')!==false){ $files[str_replace($pd.'/','',$f->getPathname())]=substr_count(strtolower($c),'creditnote'); } } }
  arsort($files); $o['wcdn_creditnote_failai']=array_slice($files,0,15,true);
  foreach(array_slice(array_keys($files),0,5) as $f){ $o['wcdn_grep'][$f]=$grep($pd.'/'.$f,array('/creditnote|credit_note|creditNote/i','/get_refunds|wc_get_orders.*refund|shop_order_refund|refund_id/i','/number_counter|NumberFormat|numberFormat|_number\b/i'),1,45,360); }
  $o['wcdn_tpl_creditnote']=array(); $ts=get_option('wcdn_template_settings'); if(is_array($ts)){ foreach($ts as $k=>$v){ $o['wcdn_tpl_keys'][]=$k; } if(isset($ts['creditnote'])){ $o['wcdn_tpl_creditnote']=array_filter($ts['creditnote'],function($v){ return !is_array($v); }); } if(isset($ts['invoice'])){ $o['wcdn_tpl_invoice_nr']=array_intersect_key($ts['invoice'],array_flip(array('enabled','pdfFilename','invoiceNumberFormat','numberFormat','invoiceNumber','numberCounter','invoiceNumberCounter','sequentialNumber','nextNumber','number_start','numbering','attachCustomerEmail'))); foreach($ts['invoice'] as $k=>$v){ if(stripos($k,'number')!==false) $o['wcdn_tpl_invoice_nr'][$k]=$v; } } }
  $o['wcdn_opcijos']=$wpdb->get_results("SELECT option_name,LEFT(option_value,200) v FROM {$p}options WHERE option_name LIKE 'wcdn%'",ARRAY_A);
  $th=get_stylesheet_directory(); $o['base_creditnote']=$grep($th.'/woocommerce-delivery-notes/base.php',array('/creditnote|credit|kredit/i','/refund/i','/template_type|get_template_type|\$type\b/'),1,40,360);
  $o['functions_pdf']=$grep($th.'/functions.php',array('/function petshop_generate_invoice_pdf/','/function petshop_.*(pdf|invoice|credit|kredit|avpn|iapv)/i','/creditnote|kredit|KR-AVPN|credit/i','/dompdf|mpdf|tcpdf|wcdn_print|WCDN|wcdn/i'),2,50,420);
  $o['desk_creditnote']=$grep(WPMU_PLUGIN_DIR.'/petshop-desk.php',array('/creditnote|kredit/i'),1,20,360);
  $o['atsisakymas']=$grep(WPMU_PLUGIN_DIR.'/petshop-atsisakymas.php',array('/creditnote|kredit|_ps_withdrawal|wcdn/i'),1,20,300);
  $o['meta_creditnote']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key LIKE '%credit%' OR meta_key LIKE '%kredit%' GROUP BY meta_key",ARRAY_A);
  $o['meta_wcdn']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key LIKE '%wcdn%' GROUP BY meta_key",ARRAY_A);
  $o['postmeta_wcdn']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}postmeta WHERE meta_key LIKE '%wcdn%' OR meta_key LIKE '%credit%' GROUP BY meta_key",ARRAY_A);
  $up=wp_upload_dir(); $cd=$up['basedir'].'/wcdn'; $o['wcdn_uploads']=is_dir($cd)?array_map(function($d){ return basename($d).' ('.count(glob($d.'/*')).')'; },glob($cd.'/*',GLOB_ONLYDIR)):null;
  foreach(array(35788,35789) as $rid){ $r=wc_get_order($rid); if($r){ $it=array(); foreach($r->get_items() as $i){ $it[]=array('n'=>$i->get_name(),'q'=>$i->get_quantity(),'tot'=>$i->get_total(),'tax'=>$i->get_total_tax(),'refunded_item_id'=>$i->get_meta('_refunded_item_id')); } $o['refund'][$rid]=array('type'=>$r->get_type(),'parent'=>$r->get_parent_id(),'amount'=>$r->get_amount(),'reason'=>$r->get_reason(),'total'=>$r->get_total(),'items'=>$it,'ps_kiekis'=>$r->get_meta('_ps_kiekis')); } }
  $o['desk_saskaita']=$grep(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php',array('/wcdn_print|Sąskaita|saskaita/i'),0,25,300);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
