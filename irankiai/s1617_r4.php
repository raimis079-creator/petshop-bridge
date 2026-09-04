<?php
/** TEMP PS S1617 run r4 (recon, tik skaitymas): faktų variklio `sandelis` logika (kur 'legacy'), partijos `av_preke`/`uzsakymo_nurasymas` be partijų, bacs nustatymai/sąskaitos, temos `petshop_get_invoice_document_type` + status_changed, bacs process_payment statusas, ps_fakt_uzsakymai stulpeliai, AV_Source::resolve paslaugai */
add_action('init', function(){
  if (!isset($_GET['ps_r4'])) return;
  $o=array('v'=>'S1617 r4'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $grep=function($file,$pats,$ctx=2,$max=40){ $r=array(); if(!file_exists($file)) return 'NĖRA '.$file; $l=file($file); foreach($l as $i=>$ln){ foreach((array)$pats as $pt){ if(preg_match($pt,$ln)){ $r[]=($i+1).': '.trim(implode(' ⏎ ',array_map('trim',array_slice($l,max(0,$i-$ctx),$ctx*2+1)))); break; } } if(count($r)>=$max) break; } return $r; };
  $mu=WPMU_PLUGIN_DIR; $fk=glob($mu.'/petshop-fakt*.php'); $o['fakt_failai']=array_map('basename',$fk);
  foreach($fk as $f){ $o['fakt_sandelis'][basename($f)]=$grep($f,array('/legacy/i','/sandelis/i'),1,60); }
  $o['partijos']=$grep($mu.'/petshop-partijos.php',array('/function av_preke/','/function uzsakymo_nurasymas/','/partij(ų|u) n(ė|e)ra/i','/_ps_partijos_nurasyta/'),3,20);
  $o['src_resolve']=$grep($mu.'/petshop-av-source.php',array('/function resolve/','/legacy/'),2,20);
  foreach(glob($mu.'/*.php') as $f){ $c=file_get_contents($f); if(strpos($c,'class Petshop_Fulfillment_Source')!==false){ $o['fs_file']=basename($f); $o['fs']=$grep($f,array('/legacy/','/_ps_sandelis/','/function resolve/'),1,40); } }
  $o['bacs_settings']=get_option('woocommerce_bacs_settings'); $acc=get_option('woocommerce_bacs_accounts'); $o['bacs_accounts']=is_array($acc)?array_map(function($a){ return array('name'=>$a['account_name']??'','bank'=>$a['bank_name']??'','iban'=>$a['iban']??'','nr'=>$a['account_number']??'','bic'=>$a['bic']??''); },$acc):$acc;
  $o['bacs_pp']=$grep(WP_PLUGIN_DIR.'/woocommerce/includes/gateways/bacs/class-wc-gateway-bacs.php',array('/function process_payment/','/update_status/','/payment_complete/','/function thankyou_page/','/function email_instructions/'),2,20);
  $th=get_stylesheet_directory().'/functions.php'; $o['tema_doc']=$grep($th,array('/function petshop_get_invoice_document_type/','/proforma/','/woocommerce_order_status_changed/'),3,30);
  $o['fakt_uzs_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_uzsakymai"); $o['fakt_eil_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_eilutes");
  $o['fakt_35793']=$wpdb->get_results("SELECT * FROM {$p}ps_fakt_uzsakymai WHERE uzsakymas_id=35793 OR uzsakymas=35793",ARRAY_A);
  $o['sandeliai_faktuose']=$wpdb->get_results("SELECT sandelis,COUNT(*) n FROM {$p}ps_fakt_eilutes GROUP BY sandelis",ARRAY_A);
  if(class_exists('Petshop_AV_Source')&&method_exists('Petshop_AV_Source','resolve')){ try{ $rm=new ReflectionMethod('Petshop_AV_Source','resolve'); $o['av_source_sig']=array_map(function($x){return $x->getName();},$rm->getParameters()); $o['resolve_35790']=Petshop_AV_Source::resolve(35790); }catch(Throwable $e){ $o['resolve_err']=$e->getMessage(); } }
  if(class_exists('Petshop_Fulfillment_Source')){ try{ $o['ffs_35790']=Petshop_Fulfillment_Source::resolve(35790); }catch(Throwable $e){ $o['ffs_err']=$e->getMessage(); } }
  $o['preke_35790']=array('sandelis'=>get_post_meta(35790,'_ps_sandelis',true),'src'=>get_post_meta(35790,'_ps_source',true),'legacy_manuf'=>get_post_meta(35790,'_legacy_manufacturer',true));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
