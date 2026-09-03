<?php
/** TEMP PS S1610 run e12r — recon: LP plugino nustatymai (laiško/completed įvykiai) + WC „Confirm your email“ pranešimo kilmė */
add_action('init', function(){
  if (!isset($_GET['ps_e12r'])) return;
  $o=array('v'=>'run e12r'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  try{
   $o['lp_opcijos']=array(); foreach($wpdb->get_results("SELECT option_name,option_value FROM {$p}options WHERE option_name LIKE 'woo_lithuaniapost%' OR option_name LIKE 'woocommerce_lithuaniapost%' OR option_name LIKE '%lpexpress%'",ARRAY_A) as $r){ $v=maybe_unserialize($r['option_value']); $o['lp_opcijos'][$r['option_name']]=is_array($v)?array_map(function($x){return is_string($x)?mb_substr($x,0,80):$x;},$v):mb_substr((string)$v,0,120); }
   $dir=WP_PLUGIN_DIR.'/woo-lithuaniapost-main'; $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
   foreach($it as $fl){ if(substr($fl,-4)!=='.php') continue; $s=file_get_contents($fl);
     if(preg_match_all('/.{0,100}event_to_(?:send_tracking_email|complete_order).{0,160}/',$s,$m)){ $o['event_ctx'][basename($fl)]=array_slice(array_unique(array_map(function($x){return trim(preg_replace('/\s+/',' ',$x));},$m[0])),0,6); }
     if(preg_match_all('/add_action\s*\(\s*[\'"]woo_lithuaniapost_send_tracking_email[\'"].{0,120}/',$s,$m)){ $o['send_hook'][basename($fl)]=array_map(function($x){return trim(preg_replace('/\s+/',' ',$x));},$m[0]); }
     if(preg_match_all('/get_option\s*\(\s*[\'"]([^\'"]*(?:event|email|complete|status)[^\'"]*)[\'"]/i',$s,$m)){ foreach($m[1] as $k) $o['opt_keys'][$k]=basename($fl); }
   }
   global $wp_filter; $o['send_hook_gyvas']=array(); if(!empty($wp_filter['woo_lithuaniapost_send_tracking_email'])){ foreach($wp_filter['woo_lithuaniapost_send_tracking_email']->callbacks as $pr=>$cbs){ foreach($cbs as $cb){ $fn=$cb['function']; $o['send_hook_gyvas'][]=$pr.': '.(is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:(is_string($fn)?$fn:'closure')); } } }
   // WC: „Confirm your email address“ kilmė
   $wc=WP_PLUGIN_DIR.'/woocommerce'; $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($wc.'/includes')); foreach($it as $fl){ if(substr($fl,-4)!=='.php') continue; $s=file_get_contents($fl); if(strpos($s,'check for past orders')!==false){ $pos=strpos($s,'check for past orders'); $o['wc_confirm'][str_replace($wc,'',$fl)]=trim(preg_replace('/\s+/',' ',substr($s,max(0,$pos-1400),1900))); } }
   $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($wc.'/src')); foreach($it as $fl){ if(substr($fl,-4)!=='.php') continue; $s=file_get_contents($fl); if(strpos($s,'check for past orders')!==false){ $pos=strpos($s,'check for past orders'); $o['wc_confirm'][str_replace($wc,'',$fl)]=trim(preg_replace('/\s+/',' ',substr($s,max(0,$pos-1400),1900))); } }
   $o['wc_versija']=WC()->version;
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
