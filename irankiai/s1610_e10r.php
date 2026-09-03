<?php
/** TEMP PS S1610 run e10r — #6 LP recon: LP plugino meta raktai (kodas + dev užsakymai), statusai, kaip lipdukas kuriamas */
add_action('init', function(){
  if (!isset($_GET['ps_e10r'])) return;
  $o=array('v'=>'run e10r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{
   $dirs=array(); foreach(scandir(WP_PLUGIN_DIR) as $d){ if(stripos($d,'lithuaniapost')!==false||stripos($d,'lpexpress')!==false||stripos($d,'unisend')!==false) $dirs[]=$d; } $o['lp_dirs']=$dirs;
   $o['aktyvus']=array_values(array_filter((array)get_option('active_plugins'),function($x){return stripos($x,'lithuaniapost')!==false||stripos($x,'lp')!==false||stripos($x,'unisend')!==false;}));
   $keys=array(); $hooks=array(); $files=0;
   foreach($dirs as $d){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator(WP_PLUGIN_DIR.'/'.$d)); foreach($it as $fl){ if(substr($fl,-4)!=='.php') continue; $files++; $s=file_get_contents($fl);
     if(preg_match_all('/(?:update_meta_data|update_post_meta|add_post_meta|get_post_meta|get_meta|add_meta_data)\s*\(\s*(?:\$[\w\->\(\)]+\s*,\s*)?[\'"]([^\'"]{3,80})[\'"]/',$s,$m)){ foreach($m[1] as $k){ if(stripos($k,'lithuania')!==false||stripos($k,'lp')!==false||stripos($k,'barcode')!==false||stripos($k,'track')!==false||stripos($k,'parcel')!==false||stripos($k,'shipment')!==false||stripos($k,'label')!==false||stripos($k,'manifest')!==false){ $keys[$k]=($keys[$k]??0)+1; } } }
     if(preg_match_all('/wp_ajax_([a-z_]*(?:lp|lithuania|label|manifest|courier)[a-z_]*)/i',$s,$m)){ foreach($m[1] as $k){ $hooks[$k]=basename($fl); } }
     if(preg_match_all('/register_post_status\s*\(\s*[\'"]([^\'"]+)[\'"]/',$s,$m)){ foreach($m[1] as $k){ $o['statusai_plugine'][]=$k; } }
   } }
   arsort($keys); $o['files']=$files; $o['meta_raktai_kode']=$keys; $o['ajax']=$hooks;
   // Statusų perėjimai LP plugine (kur keičia statusą)
   foreach($dirs as $d){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator(WP_PLUGIN_DIR.'/'.$d)); foreach($it as $fl){ if(substr($fl,-4)!=='.php') continue; $s=file_get_contents($fl); if(preg_match_all('/(?:update_status|set_status)\s*\(\s*[\'"]([^\'"]+)[\'"]/',$s,$m)){ foreach(array_unique($m[1]) as $k){ $o['status_keitimai'][basename($fl)][]=$k; } } } }
   // barcode kontekstas
   foreach($dirs as $d){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator(WP_PLUGIN_DIR.'/'.$d)); foreach($it as $fl){ if(substr($fl,-4)!=='.php') continue; $s=file_get_contents($fl); if(preg_match_all('/.{0,90}_woo_lithuaniapost_(?:barcode|tracking|parcel|shipment)[a-z_]*.{0,90}/i',$s,$m)){ $o['barcode_ctx'][basename($fl)]=array_slice(array_unique(array_map(function($x){return trim(preg_replace('/\s+/',' ',$x));},$m[0])),0,8); } } }
   // Dev DB: LP meta raktai užsakymuose (HPOS)
   $o['db_raktai']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key LIKE '%lithuaniapost%' OR meta_key LIKE '%lpexpress%' OR meta_key LIKE '%_lp_%' GROUP BY meta_key ORDER BY n DESC LIMIT 40",ARRAY_A);
   $o['db_raktai_post']=$wpdb->get_results("SELECT meta_key,COUNT(*) n FROM {$p}postmeta WHERE meta_key LIKE '%lithuaniapost%' OR meta_key LIKE '%lpexpress%' GROUP BY meta_key ORDER BY n DESC LIMIT 20",ARRAY_A);
   // pavyzdžiai: paskutiniai 3 užsakymai su barcode/tracking meta
   $ex=$wpdb->get_results("SELECT order_id,meta_key,meta_value FROM {$p}wc_orders_meta WHERE (meta_key LIKE '%lithuaniapost%' OR meta_key LIKE '%lpexpress%') AND (meta_key LIKE '%barcode%' OR meta_key LIKE '%track%' OR meta_key LIKE '%parcel%' OR meta_key LIKE '%shipment%' OR meta_key LIKE '%status%') ORDER BY order_id DESC LIMIT 30",ARRAY_A);
   foreach($ex as $r){ $o['pavyzdziai'][$r['order_id']][$r['meta_key']]=mb_substr(is_string($r['meta_value'])?$r['meta_value']:json_encode($r['meta_value']),0,160); }
   // LP statusų užsakymai dev'e
   $o['lp_statusai_db']=$wpdb->get_results("SELECT status,COUNT(*) n FROM {$p}wc_orders WHERE status LIKE 'wc-lp-%' GROUP BY status",ARRAY_A);
   $o['wc_statusai_lp']=array_filter(wc_get_order_statuses(),function($v,$k){return strpos($k,'lp-')!==false;},ARRAY_FILTER_USE_BOTH);
   // LP siuntimo būdai + užsakymai su LP pristatymu (vezejas=lp) — kiek, paskutiniai 5
   $r=new ReflectionMethod('Petshop_Desk','vezejas'); $r->setAccessible(true); $lp=array(); foreach(wc_get_orders(array('limit'=>200,'orderby'=>'date','order'=>'DESC','status'=>array_keys(wc_get_order_statuses()))) as $ord){ if('lp'===$r->invoke(null,$ord)){ $lp[]=array('id'=>$ord->get_id(),'st'=>$ord->get_status(),'metodas'=>$ord->get_shipping_method(),'term'=>$ord->get_meta('_woo_lithuaniapost_lpexpress_terminal_id'),'meta_lp'=>array_values(array_filter(array_keys($ord->get_meta_data()?array_combine(array_map(function($m){return $m->key;},$ord->get_meta_data()),$ord->get_meta_data()):array()),function($k){return stripos($k,'lithuania')!==false||stripos($k,'lp')!==false;}))); if(count($lp)>=8) break; } } $o['lp_uzsakymai']=$lp;
   $o['ps_siuntos_su_lp']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders_meta WHERE meta_key='_ps_siuntos' AND meta_value LIKE '%\"lp\"%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
