<?php
/** TEMP PS S1692 b — fatal WP_Error::get_matched_route() kontekstas (URL, failas), ZB struktūrinio žurnalo vieta ir excluded_brand įrašai. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1692b'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true);
  $pl=dirname(ABSPATH).'/logs/php_error.log'; $c=file_get_contents($pl); preg_match_all('/\[([^\]]+)\] PHP Fatal error:  Uncaught Error: Call to undefined method WP_Error::get_matched_route\(\) in ([^\n]{0,200})\n(?:Stack trace:\n)?((?:#\d[^\n]*\n){0,12})/',$c,$m,PREG_SET_ORDER);
  $o['fatal_n']=count($m); foreach (array_slice($m,0,3) as $x) $o['fatal_pvz'][]=array('laikas'=>$x[1],'kur'=>$x[2],'stack'=>mb_substr($x[3],0,900));
  $o['sargas_fatal']=$wpdb->get_results("SELECT laikas, LEFT(url,160) url, failas, eilute FROM {$p}ps_sargas_klaidos WHERE lygis='fatal' AND laikas>=NOW()-INTERVAL 48 HOUR ORDER BY laikas DESC LIMIT 10",ARRAY_A);
  $o['sargas_headers']=$wpdb->get_results("SELECT laikas, LEFT(url,160) url, LEFT(zinute,200) z FROM {$p}ps_sargas_klaidos WHERE zinute LIKE 'Cannot modify header%' AND laikas>=NOW()-INTERVAL 48 HOUR ORDER BY laikas DESC LIMIT 5",ARRAY_A);
  // get_matched_route naudojimas mūsų kode
  foreach (array(WPMU_PLUGIN_DIR, WP_PLUGIN_DIR.'/petshop-core', get_stylesheet_directory()) as $dir){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir)); foreach ($it as $f){ if (substr($f,-4)!=='.php') continue; $cc=@file_get_contents($f); if ($cc && strpos($cc,'get_matched_route')!==false){ foreach (explode("\n",$cc) as $i=>$l) if (strpos($l,'get_matched_route')!==false) $o['kodas'][str_replace(ABSPATH,'',$f)][$i+1]=trim(mb_substr($l,0,200)); } } }
  // ZB structured log
  $xf=WP_PLUGIN_DIR.'/petshop-xml/petshop-xml.php'; $l=file($xf); foreach ($l as $i=>$ln) if (strpos($ln,'function petshop_xml_log_structured')!==false){ for($j=$i;$j<$i+25;$j++) $o['log_fn'][$j+1]=rtrim($l[$j]); break; }
  $o['zb_log_opc']=array(); foreach ($wpdb->get_results("SELECT option_name, LENGTH(option_value) len FROM {$p}options WHERE option_name LIKE '%petshop_xml%' OR option_name LIKE '%ps_xml%' OR option_name LIKE '%zb_%' LIMIT 30",ARRAY_A) as $r) $o['zb_log_opc'][$r['option_name']]=$r['len'];
  $o['zb_lenteles']=array_values(array_filter($wpdb->get_col("SHOW TABLES"),function($t){return preg_match('/xml|zb|import_log|vf_/i',$t);}));
  $o['wc_logs_naujausi']=array(); foreach ((array)glob(wp_upload_dir()['basedir'].'/wc-logs/*.log') as $f){ if (filemtime($f)>time()-20*3600) $o['wc_logs_naujausi'][]=preg_replace('/-[0-9a-f]{32}\.log$/','',basename($f)).' '.filesize($f); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
