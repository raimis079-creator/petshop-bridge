<?php
/** TEMP PS S1615 run e2r — RECON (tik skaitymas) 5 etapo #4 „kiekiai“: av-reduce `mazinti` (hook, WC `_reduced_stock`), WC stock nustatymai, sąskaitų (AVPN/IAPV) generatorius ir kada, dropship laiško turinys/perduota, Tiekimo viešos f-jos, testinių eilučių meta (rq/_reduced_stock), Paysera refund API. */
add_action('init', function(){
  if (!isset($_GET['ps_e2r'])) return;
  $o=array('v'=>'S1615 e2r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $src=function($file,$pat,$len=2200){ $c=(string)@file_get_contents($file); if(!$c) return 'NĖRA'; $i=strpos($c,$pat); if($i===false) return 'pattern nerastas'; return substr($c,$i,$len); };
  try{
  $mu=WPMU_PLUGIN_DIR; $o['mu']=array_values(array_filter(scandir($mu),function($f){ return substr($f,-4)==='.php'; }));
  // 1. av-reduce: hooks + mazinti
  $f=$mu.'/petshop-av-reduce.php'; $c=(string)file_get_contents($f); $o['reduce_size']=strlen($c);
  preg_match_all('/add_action\(\s*[\'"]([^\'"]+)[\'"]\s*,\s*([^,]+),\s*(\d+)/',$c,$m); $o['reduce_hooks']=array_map(null,$m[1],$m[2],$m[3]);
  preg_match_all('/function\s+(\w+)\s*\(([^)]*)\)/',$c,$m); $o['reduce_fns']=array_map(null,$m[1],$m[2]);
  $o['reduce_mazinti']=$src($f,'function mazinti',2600);
  $o['reduce_header']=substr($c,0,1200);
  // 2. AV_Stock class
  foreach(array('Petshop_AV_Stock','Petshop_AV_Tiekimas','Petshop_AV_Dropship','Petshop_AV_Order','Petshop_AV_Source','Petshop_Desk') as $cl){ if(class_exists($cl)){ $r=new ReflectionClass($cl); $o['cls'][$cl]=array('file'=>basename($r->getFileName()),'m'=>array_map(function($mm){ return $mm->name.'('.implode(',',array_map(function($pp){ return '$'.$pp->name; },$mm->getParameters())).')'; },$r->getMethods(ReflectionMethod::IS_PUBLIC))); } }
  // 3. WC stock settings + WC own reduction on test orders
  $o['wc']=array('manage_stock'=>get_option('woocommerce_manage_stock'),'hold_stock'=>get_option('woocommerce_hold_stock_minutes'),'notify_low'=>get_option('woocommerce_notify_low_stock'),'has_reduce_hook_payment'=>has_action('woocommerce_payment_complete','wc_maybe_reduce_stock_levels'),'has_reduce_hook_processing'=>has_action('woocommerce_order_status_processing','wc_maybe_reduce_stock_levels'),'has_increase_cancelled'=>has_action('woocommerce_order_status_cancelled','wc_maybe_increase_stock_levels'),'adjust_line_item'=>has_action('woocommerce_before_order_item_object_save'), 'adjust_fn'=>function_exists('wc_maybe_adjust_line_item_product_stock'));
  $o['wc_adjust_hooks']=$wpdb->get_var("SELECT 1")?array_keys(array_filter((array)($GLOBALS['wp_filter']['woocommerce_before_delete_order_item']->callbacks??array()))):null;
  foreach(array(35438,35421,35431,35436,35442) as $id){ $x=wc_get_order($id); if(!$x) continue; $eil=array(); foreach($x->get_items() as $iid=>$it){ $pid=$it->get_product_id(); $eil[$iid]=array('n'=>mb_substr($it->get_name(),0,20),'q'=>$it->get_quantity(),'src'=>(string)$it->get_meta('_ps_source'),'k'=>(string)$it->get_meta('_ps_kelias'),'rq'=>(string)$it->get_meta('_ps_av_reduced_qty'),'wc_reduced'=>(string)$it->get_meta('_reduced_stock'),'src_qty'=>(string)$it->get_meta('_ps_source_qty'),'kons'=>(string)$it->get_meta('_ps_konsolidacija'),'own'=>get_post_meta($pid,'_own_stock_qty',true),'stock'=>get_post_meta($pid,'_stock',true),'manage'=>get_post_meta($pid,'_manage_stock',true),'total'=>$it->get_total(),'sub'=>$it->get_subtotal()); }
    $o['uzs'][$id]=array('st'=>$x->get_status(),'reduced'=>(string)$x->get_meta('_ps_av_reduced'),'restored'=>(string)$x->get_meta('_ps_av_restored'),'groups'=>(string)$x->get_meta('_ps_groups'),'type'=>(string)$x->get_meta('_ps_order_type'),'total'=>$x->get_total(),'ship'=>$x->get_shipping_total(),'tax'=>$x->get_total_tax(),'coupons'=>$x->get_coupon_codes(),'pay'=>$x->get_payment_method(),'ds_sent'=>(string)$x->get_meta('_ps_dropship_sent_src'),'invoice_meta'=>array_values(array_filter(array_keys($x->get_meta_data()?array_combine(array_map(function($m){return $m->key;},$x->get_meta_data()),$x->get_meta_data()):array()),function($k){ return preg_match('/sask|invoice|faktur|avpn|iapv|pdf/i',$k); })),'eil'=>$eil); }
  // 4. sąskaitos: kas generuoja
  $o['plugins_active']=array_values(array_filter((array)get_option('active_plugins'),function($x){ return preg_match('/invoice|pdf|sask|faktur|paysera|lithuania|venipak/i',$x); }));
  $o['avpn_opt']=$wpdb->get_results("SELECT option_name, LEFT(option_value,120) v FROM {$p}options WHERE option_name LIKE '%avpn%' OR option_name LIKE '%iapv%' OR option_name LIKE '%saskait%' OR option_name LIKE '%invoice%' LIMIT 25",ARRAY_A);
  $o['avpn_meta']=$wpdb->get_results("SELECT meta_key, COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key LIKE '%sask%' OR meta_key LIKE '%invoice%' OR meta_key LIKE '%avpn%' OR meta_key LIKE '%iapv%' OR meta_key LIKE '%faktur%' GROUP BY meta_key LIMIT 30",ARRAY_A);
  $grep=array(); foreach(glob($mu.'/*.php') as $ff){ $cc=(string)file_get_contents($ff); if(preg_match('/AVPN|IAPV/',$cc)){ preg_match_all('/add_action\(\s*[\'"]([^\'"]+)[\'"]/',$cc,$mm); $grep[basename($ff)]=array('size'=>strlen($cc),'hooks'=>array_values(array_unique($mm[1])),'head'=>substr($cc,0,700)); } } $o['avpn_grep_mu']=$grep;
  $grep2=array(); foreach(glob(WP_PLUGIN_DIR.'/*/*.php') as $ff){ $cc=(string)@file_get_contents($ff); if(preg_match('/AVPN|IAPV/',$cc)){ $grep2[]=str_replace(WP_PLUGIN_DIR.'/','',$ff); } } $o['avpn_grep_plugins']=array_slice($grep2,0,15);
  $o['snippets_avpn']=$wpdb->get_results("SELECT id,name,active FROM {$p}snippets WHERE code LIKE '%AVPN%' OR code LIKE '%IAPV%' LIMIT 15",ARRAY_A);
  // 5. dropship laiškas: ką skaito (kiekius)
  $f=$mu.'/petshop-dropship.php'; if(!file_exists($f)){ foreach(glob($mu.'/*dropship*.php') as $ff){ $f=$ff; } } $o['dropship_file']=basename($f); $c=(string)file_get_contents($f);
  preg_match_all('/function\s+(\w+)\s*\(([^)]*)\)/',$c,$m); $o['dropship_fns']=array_map(null,$m[1],$m[2]);
  $o['dropship_perduota']=$src($f,'function perduotos',1200); $o['dropship_send']=$src($f,'ps_dropship_send',1800);
  // 6. tiekimas
  $f=$mu.'/petshop-av-tiekimas.php'; $c=(string)file_get_contents($f); $o['tiekimas_isimti']=$src($f,'function isimti_eilute',1500); $o['tiekimas_prideti']=$src($f,'function prideti',1200);
  // 7. Paysera refund
  $o['paysera_refund']=array(); foreach(glob(WP_PLUGIN_DIR.'/*paysera*/*.php') as $ff){ $cc=(string)@file_get_contents($ff); if(preg_match('/process_refund|supports.*refunds/',$cc)) $o['paysera_refund'][]=basename($ff); }
  // 8. Petshop_Desk: atsaukti / veiksmai su eilutėmis
  $f=$mu.'/petshop-desk.php'; $c=(string)file_get_contents($f); preg_match_all('/function\s+(\w+)\s*\(([^)]*)\)/',$c,$m); $o['desk_fns']=array_map(null,$m[1],$m[2]);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
