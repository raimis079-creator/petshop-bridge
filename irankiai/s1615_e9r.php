<?php
/** TEMP PS S1615 run e9r — RECON (tik skaitymas): kreditinės šablonas — WCDN pluginas (įdiegtas/aktyvus?), creditNote šablonas, KR-AVPN numeracija, tema functions.php `credit|kredit`, seno desk `wcdn_print_creditnote`, wcdn opcijos/šablonų failai. */
add_action('init', function(){
  if (!isset($_GET['ps_e9r'])) return;
  $o=array('v'=>'S1615 e9r'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $ctx=function($c,$pat,$len=1200,$back=200){ $r=array(); $off=0; $n=0; while(($i=stripos($c,$pat,$off))!==false && $n<4){ $r[]=substr($c,max(0,$i-$back),$len); $off=$i+1; $n++; } return $r; };
  try{
  $o['wcdn_dirs']=array_map('basename',glob(WP_PLUGIN_DIR.'/*wcdn*')+glob(WP_PLUGIN_DIR.'/*print*')+glob(WP_PLUGIN_DIR.'/*invoice*'));
  $o['active']=array_values(array_filter((array)get_option('active_plugins'),function($x){ return preg_match('/wcdn|print|invoice|pdf|delivery/i',$x); }));
  $o['wcdn_opts']=$wpdb->get_results("SELECT option_name, LEFT(option_value,300) v FROM {$p}options WHERE option_name LIKE 'wcdn%' ORDER BY option_name LIMIT 40",ARRAY_A);
  $th=get_stylesheet_directory(); $c=(string)file_get_contents($th.'/functions.php');
  $o['theme_credit']=$ctx($c,'credit',1400,300); $o['theme_kredit']=$ctx($c,'kredit',900,200); $o['theme_KR']=$ctx($c,"'KR",600,200);
  $o['theme_files']=array_map(function($f) use($th){ return str_replace($th.'/','',$f); },array_merge(glob($th.'/*'),glob($th.'/*/*'),glob($th.'/*/*/*')));
  $o['theme_grep']=array(); foreach(array_merge(glob($th.'/*.php'),glob($th.'/*/*.php'),glob($th.'/*/*/*.php'),glob($th.'/*/*.html'),glob($th.'/*/*/*.html')) as $f){ $cc=(string)@file_get_contents($f); if(stripos($cc,'creditnote')!==false||stripos($cc,'kreditin')!==false||stripos($cc,'KR-AVPN')!==false){ $o['theme_grep'][str_replace($th.'/','',$f)]=array(preg_match_all('/creditnote/i',$cc),preg_match_all('/kreditin/iu',$cc),preg_match_all('/KR-AVPN/',$cc)); } }
  $d=(string)file_get_contents(WPMU_PLUGIN_DIR.'/petshop-desk.php'); $o['desk_creditnote']=$ctx($d,'creditnote',900,300);
  $o['uploads_wcdn']=array('invoice'=>count(glob(wp_upload_dir()['basedir'].'/wcdn/invoice/*')),'kiti'=>array_map('basename',glob(wp_upload_dir()['basedir'].'/wcdn/*')));
  $o['kr_meta']=$wpdb->get_results("SELECT meta_key, COUNT(*) n FROM {$p}wc_orders_meta WHERE meta_key LIKE '%credit%' OR meta_key LIKE '%kredit%' GROUP BY meta_key",ARRAY_A);
  $o['snip_credit']=$wpdb->get_results("SELECT id,name,active,LENGTH(code) len FROM {$p}snippets WHERE (code LIKE '%creditnote%' OR code LIKE '%kreditin%' OR code LIKE '%KR-AVPN%') AND name NOT LIKE 'TEMP%' ORDER BY active DESC LIMIT 12",ARRAY_A);
  $o['pdf_lib']=array('dompdf'=>class_exists('Dompdf\\Dompdf'),'mpdf'=>class_exists('Mpdf\\Mpdf'),'tcpdf'=>class_exists('TCPDF'),'gen_ctx'=>$ctx($c,'function petshop_generate_invoice_pdf',3200,0));
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $J($o);
},99);
