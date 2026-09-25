<?php
/** Plugin Name: TEMP PS S1719h — AVPN numeravimo kodo ir istorijos recon, read-only (m) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719h'])) return; $r=['v'=>'S1719h','t'=>date('Y-m-d H:i:s')]; @set_time_limit(120);
  global $wpdb; $p=$wpdb->prefix;
  try{
    $f=WP_CONTENT_DIR.'/themes/flatsome-child/functions.php'; $c=file_get_contents($f); $lines=explode("\n",$c);
    foreach($lines as $i=>$l){ if(preg_match('/avpn|AVPN|invoice_number|invoice_document_type|counter/i',$l)) $r['functions_eil'][$i+1]=trim(substr($l,0,170)); }
    if(preg_match('/function petshop_get_avpn_number[\s\S]{0,2500}?\n}/',$c,$m)) $r['fn_avpn']=$m[0];
    if(preg_match('/function petshop_get_invoice_document_type[\s\S]{0,1800}?\n}/',$c,$m)) $r['fn_doctype']=$m[0];
    $b=WP_CONTENT_DIR.'/themes/flatsome-child/woocommerce-delivery-notes/base.php'; $bc=file_get_contents($b); foreach(explode("\n",$bc) as $i=>$l){ if(preg_match('/avpn|invoice_number|document_type|counter/i',$l)) $r['base_eil'][$i+1]=trim(substr($l,0,170)); }
    foreach(glob(WP_CONTENT_DIR.'/mu-plugins/*.php') as $fx){ $cc=file_get_contents($fx); if(preg_match_all('/[^\n]{0,60}(petshop_get_avpn_number|petshop_avpn_counter|_petshop_avpn_number)[^\n]{0,60}/',$cc,$m)) $r['mu_naudoja'][basename($fx)]=array_slice(array_unique(array_map('trim',$m[0])),0,6); }
    $sn=$wpdb->get_results("SELECT id,name,code FROM {$p}snippets WHERE active=1 AND (code LIKE '%avpn%' OR code LIKE '%AVPN%')",ARRAY_A); foreach($sn as $s){ preg_match_all('/[^\n]{0,70}(avpn|AVPN)[^\n]{0,70}/',$s['code'],$m); $r['snip_avpn'][$s['id'].' '.$s['name']]=array_slice(array_unique(array_map('trim',$m[0])),0,8); }
    foreach([36020,36112,36118,36141,36144,36279,36281] as $oid){ $o=wc_get_order($oid); if(!$o) continue; $notes=array_map(function($n){return $n->date_created->date('m-d H:i:s').' '.substr(strip_tags($n->content),0,70);},array_reverse(wc_get_order_notes(['order_id'=>$oid])));
      $r['uzs'][$oid]=['nr'=>$o->get_order_number(),'avpn'=>$o->get_meta('_petshop_avpn_number',false)?array_map(function($m){return $m->value;},$o->get_meta('_petshop_avpn_number',false)):null,'doc'=>$o->get_meta('_petshop_invoice_document_type'),'wcdn'=>$o->get_meta('_wcdn_invoice_number'),'wcdn_date'=>$o->get_meta('_wcdn_invoice_date'),'completed'=>$o->get_date_completed()?$o->get_date_completed()->date('m-d H:i:s'):null,'paid'=>$o->get_date_paid()?$o->get_date_paid()->date('m-d H:i:s'):null,'notes'=>array_slice(array_filter($notes,function($x){return preg_match('/AVPN|sąskait|saskait|PDF|Išsiųst|issiust|Baigt|completed|Kurjeris/i',$x);}),0,8)]; }
    $r['counter_opcija']=$wpdb->get_row("SELECT option_name,option_value,autoload FROM {$p}options WHERE option_name='petshop_avpn_counter'",ARRAY_A);
    $r['avpn_chronologija']=$wpdb->get_results("SELECT m.meta_value avpn,o.id,o.date_created_gmt,(SELECT date_completed_gmt FROM {$p}wc_order_operational_data d WHERE d.order_id=o.id) completed FROM {$p}wc_orders_meta m JOIN {$p}wc_orders o ON o.id=m.order_id WHERE m.meta_key='_petshop_avpn_number' AND m.meta_value>='AVPN011100' ORDER BY completed,o.id",ARRAY_A);
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},1);
