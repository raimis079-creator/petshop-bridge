<?php
/** TEMP PS S1610 run e12s — recon 2: WC VerificationController kabliukai/filtrai; LP lpsettings_* reikšmės */
add_action('init', function(){
  if (!isset($_GET['ps_e12s'])) return;
  $o=array('v'=>'run e12s'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{
   $f=WP_PLUGIN_DIR.'/woocommerce/src/Internal/CustomerEmailVerification/VerificationController.php'; $s=file_get_contents($f);
   if(preg_match_all('/add_(?:action|filter)\s*\([^;]{0,160};/',$s,$m)) $o['vc_hooks']=array_map(function($x){return trim(preg_replace('/\s+/',' ',$x));},$m[0]);
   if(preg_match_all('/apply_filters\s*\(\s*[\'"]([^\'"]+)[\'"]/',$s,$m)) $o['vc_filters']=$m[1];
   if(preg_match('/function should_show_prompt\s*\(\)[^{]*\{(.{0,1200})/s',$s,$m)) $o['should_show']=trim(preg_replace('/\s+/',' ',$m[1]));
   if(preg_match_all('/const\s+(\w+)\s*=\s*([^;]+);/',$s,$m)){ foreach($m[1] as $i=>$k) $o['vc_const'][$k]=$m[2][$i]; }
   $d=dirname($f); foreach(scandir($d) as $x){ if(substr($x,-4)!=='.php') continue; $ss=file_get_contents($d.'/'.$x); if(preg_match_all('/apply_filters\s*\(\s*[\'"]([^\'"]+)[\'"]/',$ss,$m)) $o['dir_filters'][$x]=$m[1]; if(preg_match_all('/get_option\s*\(\s*[\'"]([^\'"]+)[\'"]/',$ss,$m)) $o['dir_options'][$x]=$m[1]; }
   global $wp_filter; foreach(array('woocommerce_before_account_orders','woocommerce_account_orders_endpoint','woocommerce_before_account_orders_pagination') as $h){ $o['gyvi'][$h]=array(); if(!empty($wp_filter[$h])){ foreach($wp_filter[$h]->callbacks as $pr=>$cbs){ foreach($cbs as $cb){ $fn=$cb['function']; $o['gyvi'][$h][]=$pr.': '.(is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:(is_string($fn)?$fn:'closure')); } } } }
   $o['lpsettings']=$wpdb->get_results("SELECT option_name,option_value FROM {$p}options WHERE option_name LIKE 'lpsettings%' OR option_name LIKE '%lithuaniapost%settings%'",ARRAY_A);
   if(class_exists('Woo_Lithuaniapost_Admin_Settings')){ foreach(array('event_to_send_tracking_email','event_to_change_status_to_completed','tracking_data_sync_completed') as $k){ $o['lp_get_option'][$k]=Woo_Lithuaniapost_Admin_Settings::get_option($k); } $r=new ReflectionMethod('Woo_Lithuaniapost_Admin_Settings','get_option'); $o['lp_get_option_src']=trim(preg_replace('/\s+/',' ',implode('',array_slice(file($r->getFileName()),$r->getStartLine()-1,$r->getEndLine()-$r->getStartLine()+1)))); }
   $fs=WP_PLUGIN_DIR.'/woo-lithuaniapost-main'; $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($fs)); foreach($it as $fl){ if(basename($fl)!=='class-woo-lithuaniapost-admin-settings.php') continue; $ss=file_get_contents($fl); if(preg_match_all('/.{0,60}(?:event_to_send_tracking_email|event_to_change_status_to_completed).{0,400}/s',$ss,$m)) $o['lp_settings_ctx']=array_map(function($x){return trim(preg_replace('/\s+/',' ',$x));},$m[0]); }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
