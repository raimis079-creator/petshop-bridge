<?php
/** TEMP PS S1616 run e1r — RECON (tik skaitymas) 5 etapo #4 „kiekiai“ B modeliui: WC `wc_create_refund` args, `get_order_item_totals` refund eilutės, paskyros/laiško kiekio rodymas (refunded qty), tema `petshop_generate_invoice_pdf` sumos, snippet #653, variklio parašai (AV_Stock, Dropship::perduotos, Fakt_Grazinimai hook), testinių užsakymų kandidatai. */
add_action('init', function(){
  if (!isset($_GET['ps_e1r'])) return;
  $o=array('v'=>'S1616 e1r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $src=function($file,$pat,$len=2200,$back=0){ $c=(string)@file_get_contents($file); if(!$c) return 'NĖRA '.$file; $i=strpos($c,$pat); if($i===false) return 'pattern nerastas: '.$pat; return substr($c,max(0,$i-$back),$len); };
  try{
  $wc=WP_PLUGIN_DIR.'/woocommerce'; $o['wc_ver']=defined('WC_VERSION')?WC_VERSION:'?';
  // 1. WC: wc_create_refund args + line_items apdorojimas
  $o['wc_create_refund']=$src($wc.'/includes/wc-core-functions.php','function wc_create_refund',4200);
  $o['wc_restock_refunded']=$src($wc.'/includes/wc-core-functions.php','function wc_restock_refunded_items',1600);
  // 2. WC: get_order_item_totals refund eilutės
  $o['wc_item_totals_refund']=$src($wc.'/includes/abstract-wc-order.php','$refunds = $this->get_refunds()',1400,200);
  $o['wc_item_totals_net']=$src($wc.'/includes/abstract-wc-order.php','net_payment',600,300);
  // 3. WC šablonai: kiekio rodymas paskyroje ir laiške (refunded qty)
  $o['tpl_order_item_qty']=$src($wc.'/templates/order/order-details-item.php','$qty_display',900,200);
  $o['tpl_email_item_qty']=$src($wc.'/templates/emails/email-order-items.php','$qty_display',900,200);
  $th=get_stylesheet_directory(); $o['theme_dir']=$th;
  foreach(array('/woocommerce/order/order-details-item.php','/woocommerce/emails/email-order-items.php','/woocommerce/order/order-details.php','/woocommerce/emails/email-order-details.php') as $t){ $o['theme_override'][$t]=file_exists($th.$t); }
  // 4. Tema: sąskaitos PDF sumos (ar naudoja get_total / refunds)
  $fn=$th.'/functions.php'; $c=(string)@file_get_contents($fn); $o['functions_size']=strlen($c);
  $o['invoice_pdf']=$src($fn,'function petshop_generate_invoice_pdf',5200);
  preg_match_all('/get_total_refunded|get_refunds|refund/i',$c,$m); $o['functions_refund_mentions']=count($m[0]);
  preg_match_all('/get_total\(\)|get_subtotal\(\)|get_shipping_total\(\)|get_total_tax\(\)/',$c,$m); $o['functions_total_calls']=array_count_values($m[0]);
  // 5. Snippet #653 (completed regeneruoja PDF)
  $o['snip_653']=$wpdb->get_row("SELECT id,name,active,LEFT(code,1800) code FROM {$p}snippets WHERE id=653",ARRAY_A);
  $o['snip_648']=$wpdb->get_row("SELECT id,name,active,LEFT(code,900) code FROM {$p}snippets WHERE id=648",ARRAY_A);
  // 6. Variklio parašai
  $sig=function($cl,$m){ if(!class_exists($cl)||!method_exists($cl,$m)) return 'NĖRA'; $r=new ReflectionMethod($cl,$m); return ($r->isPublic()?'public':'nonpublic').($r->isStatic()?' static':'').' '.$m.'('.implode(', ',array_map(function($x){ return '$'.$x->getName().($x->isOptional()?'=?':''); },$r->getParameters())).')'; };
  $o['sig']=array('AV_Stock::qty'=>$sig('Petshop_AV_Stock','qty'),'AV_Stock::increase'=>$sig('Petshop_AV_Stock','increase'),'AV_Stock::decrease'=>$sig('Petshop_AV_Stock','decrease'),'Dropship::perduotos'=>$sig('Petshop_AV_Dropship','perduotos'),'Tiekimas::ideti_eilute'=>$sig('Petshop_AV_Tiekimas','ideti_eilute'),'Tiekimas::isimti_eilute'=>$sig('Petshop_AV_Tiekimas','isimti_eilute'),'Tiekimas::eilutes_bukle'=>$sig('Petshop_AV_Tiekimas','eilutes_bukle'),'Fakt_Grazinimai::rasyti'=>$sig('Petshop_Fakt_Grazinimai','rasyti'),'Ivykiai::irasyti'=>$sig('Petshop_Uzsakymu_Ivykiai','irasyti'),'Faktai::ar_testinis'=>$sig('Petshop_Faktai','ar_testinis'),'Darbalaukis::VERSIJA'=>class_exists('Petshop_Darbalaukis')?Petshop_Darbalaukis::VERSIJA:'NĖRA');
  $hk=function($h){ global $wp_filter; $r=array(); if(empty($wp_filter[$h])) return $r; foreach($wp_filter[$h]->callbacks as $pr=>$cbs){ foreach($cbs as $cb){ $f=$cb['function']; $r[]=$pr.':'.(is_array($f)?(is_object($f[0])?get_class($f[0]):$f[0]).'::'.$f[1]:(is_string($f)?$f:'closure')); } } return $r; };
  $o['hooks']=array('order_refunded'=>$hk('woocommerce_order_refunded'),'partially_refunded'=>$hk('woocommerce_order_partially_refunded'),'fully_refunded'=>$hk('woocommerce_order_fully_refunded'),'refund_created'=>$hk('woocommerce_refund_created'),'restock_item'=>$hk('woocommerce_restock_refunded_item'),'update_order'=>$hk('woocommerce_update_order'),'before_delete_item'=>$hk('woocommerce_before_delete_order_item'),'delete_item'=>$hk('woocommerce_delete_order_item'),'item_qty_html'=>$hk('woocommerce_order_item_quantity_html'),'email_item_qty'=>$hk('woocommerce_email_order_item_quantity'),'item_totals'=>$hk('woocommerce_get_order_item_totals'));
  $o['fakt_graz_lentele']=$wpdb->get_results("SHOW COLUMNS FROM {$p}ps_fakt_grazinimai",ARRAY_A); $o['fakt_graz_lentele']=$o['fakt_graz_lentele']?array_column($o['fakt_graz_lentele'],'Field'):'NĖRA';
  // 7. Testinių užsakymų kandidatai
  $ids=array_merge(range(35414,35444),array(35450),range(35771,35780)); $reg=array();
  foreach($ids as $id){ $x=wc_get_order($id); if(!$x) continue; $perd=class_exists('Petshop_AV_Dropship')?Petshop_AV_Dropship::perduotos($x):null; $eil=array();
    foreach($x->get_items() as $iid=>$it){ $b=class_exists('Petshop_AV_Tiekimas')?Petshop_AV_Tiekimas::eilutes_bukle($id,(int)$iid):null;
      $eil[$iid]=array('n'=>mb_substr($it->get_name(),0,22),'pid'=>$it->get_product_id(),'q'=>$it->get_quantity(),'sub'=>$it->get_subtotal(),'tot'=>$it->get_total(),'tax'=>$it->get_total_tax(),'taxes'=>$it->get_taxes(),'src'=>(string)$it->get_meta('_ps_source'),'k'=>(string)$it->get_meta('_ps_kelias'),'rq'=>(string)$it->get_meta('_ps_av_reduced_qty'),'wcred'=>(string)$it->get_meta('_reduced_stock'),'ats'=>(string)$it->get_meta('_ps_atsaukta'),'iss'=>(string)$it->get_meta('_ps_issiusta'),'part'=>$b?array($b->partija_id,$b->busena):null,'refq'=>$x->get_qty_refunded_for_item($iid)); }
    $reg[$id]=array('st'=>$x->get_status(),'paid'=>$x->is_paid(),'pm'=>$x->get_payment_method(),'total'=>$x->get_total(),'ship'=>$x->get_shipping_total(),'refunded'=>$x->get_total_refunded(),'remaining'=>$x->get_remaining_refund_amount(),'surinkta'=>(string)$x->get_meta('_ps_surinkta'),'siuntos'=>substr((string)$x->get_meta('_ps_siuntos'),0,160),'perd'=>$perd,'vp'=>substr((string)$x->get_meta('venipak_shipping_order_data'),0,80),'lp'=>(string)$x->get_meta('_woo_lithuaniapost_barcode'),'groups'=>(string)$x->get_meta('_ps_groups'),'type'=>(string)$x->get_meta('_ps_order_type'),'graz'=>(string)$x->get_meta('_ps_grazinti_rankomis'),'tax_rates'=>array_keys($x->get_taxes()?array_combine(array_map(function($t){return $t->get_rate_id();},$x->get_taxes()),$x->get_taxes()):array()),'eil'=>$eil); }
  $o['uzs']=$reg;
  $o['likuciai']=array('19708_stock'=>get_post_meta(19708,'_stock',true),'19708_own'=>get_post_meta(19708,'_own_stock_qty',true),'16889_own'=>get_post_meta(16889,'_own_stock_qty',true),'16889_stock'=>get_post_meta(16889,'_stock',true));
  $o['dev_pastas']=count((array)get_option('ps_dev_pastas_zurnalas',array()));
  $o['dl_md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); $o['dl_size']=filesize(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php');
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getFile().':'.$e->getLine(); }
  $J($o);
},99);
