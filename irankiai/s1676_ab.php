<?php
/** TEMP PS S1676 run ab — PHP error log Fatal; #17397 AV; TEMP #5424/#5584/#5589; ps_sargas_pastas; 12:55 laiškas be gavėjo. READ-ONLY (išskyrus TEMP snippetų trynimą). */
add_action('init', function(){
  if (!isset($_GET['ps_s1676ab'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 ab');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $log='/home/gyvunai2/domains/petshop.lt/logs/php_error.log'; $o['log']=array('yra'=>file_exists($log),'dydis'=>file_exists($log)?filesize($log):0);
  if(file_exists($log)){ $s=file_get_contents($log,false,null,max(0,filesize($log)-200000)); $L=explode("\n",$s); $f=array(); $w=array(); foreach($L as $l){ if(stripos($l,'Fatal')!==false||stripos($l,'Uncaught')!==false) $f[]=mb_substr($l,0,400); elseif(preg_match('/Warning|Deprecated|Notice/',$l)) { $k=preg_replace('/^\[[^\]]+\]\s*/','',mb_substr($l,0,160)); $w[$k]=($w[$k]??0)+1; } } $o['fatal']=array_slice(array_unique($f),-12); arsort($w); $o['warn_top']=array_slice($w,0,8,true); }
  $o['snip']=$wpdb->get_results("SELECT id,name,active,LEFT(code,150) c FROM {$p}snippets WHERE id IN (5424,5584,5589)",ARRAY_A);
  $o['snip_istrinta']=$wpdb->query("DELETE FROM {$p}snippets WHERE id IN (5424,5584,5589) AND active=0 AND name LIKE 'TEMP%'");
  $pr=wc_get_product(17397); $o['p17397']=array('pav'=>$pr?$pr->get_name():null,'stock'=>get_post_meta(17397,'_stock',true),'own'=>get_post_meta(17397,'_own_stock_qty',true),'sand'=>get_post_meta(17397,'_ps_sandelis',true),'zb'=>get_post_meta(17397,'_zb_qty',true),'vf'=>get_post_meta(17397,'_vf_qty',true),'partijos'=>$wpdb->get_results("SELECT id,gauta,kiekis_gautas,kiekis_liko,tiekejas,pastaba FROM {$p}ps_partijos WHERE product_id=17397 ORDER BY id DESC LIMIT 5",ARRAY_A),'ivykiai'=>$wpdb->get_results("SELECT laukas,sena,nauja,pastaba,LEFT(sukurta,16) t FROM {$p}ps_ivykiai WHERE product_id=17397 AND laukas IN ('_stock','_own_stock_qty','partija','likutis') ORDER BY id DESC LIMIT 6",ARRAY_A),'src'=>$wpdb->get_results("SELECT source,stock_qty,is_active FROM {$p}ps_sources WHERE product_id=17397",ARRAY_A));
  $o['sargas']=array('pastas'=>get_option('ps_sargas_pastas'),'admin'=>get_option('admin_email'));
  $o['ivykiai_stulp']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_ivykiai",0);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
