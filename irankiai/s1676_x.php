<?php
/** TEMP PS S1676 run x — kas rašo ps_fakt_siuntos; sutikrinimo cron; siuntų meta pavyzdys. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676x'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 x');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/includes/*.php')) as $f){ $s=file_get_contents($f); if(strpos($s,'ps_fakt_siuntos')!==false||strpos($s,'ps_fakt_siuntu_sutikrinimas')!==false){ $o['failai'][str_replace(WP_CONTENT_DIR,'',$f)]=array('md5'=>md5_file($f),'dydis'=>strlen($s)); $L=explode("\n",$s); foreach($L as $i=>$l){ if(preg_match("/fakt_siuntos|sutikrinim|function .*siunt|isvezta_at|pristatyta_at|dienos_iki|statusas|problema_kodas|add_action/",$l)) $o['eil'][basename($f)][]=($i+1).': '.trim(mb_substr($l,0,200)); } } }
  $w=wc_get_order(35883); $o['meta_1003']=array('issiusta'=>$w->get_meta('_ps_dalys_issiusta'),'sek'=>$w->get_meta('_ps_venipak_sekimas'),'shipments'=>$w->get_meta('_ps_shipments'),'completed'=>$w->get_date_completed()?$w->get_date_completed()->date('Y-m-d H:i'):null);
  $o['fakt_1003']=$wpdb->get_results("SELECT * FROM {$p}ps_fakt_siuntos WHERE uzsakymas_id=35883",ARRAY_A);
  $o['cron_cb']=array(); global $wp_filter; if(isset($wp_filter['ps_fakt_siuntu_sutikrinimas'])) foreach($wp_filter['ps_fakt_siuntu_sutikrinimas']->callbacks as $pr=>$cbs) foreach($cbs as $cb) $o['cron_cb'][]=is_array($cb['function'])?(is_object($cb['function'][0])?get_class($cb['function'][0]):$cb['function'][0]).'::'.$cb['function'][1]:(is_string($cb['function'])?$cb['function']:'closure');
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
