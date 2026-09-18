<?php
/** TEMP PS S1691 k — ar yra „pranešti kai bus" (back-in-stock) funkcija: pluginai, lentelės, kodo paieška, įvykiai. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691k'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true);
  $o['aktyvus_pluginai']=array_values(array_filter((array)get_option('active_plugins'),function($x){return preg_match('/stock|wait|notif|alert|prane|back/i',$x);}));
  $o['visi_pluginai_atitinka']=array(); foreach ((array)glob(WP_PLUGIN_DIR.'/*',GLOB_ONLYDIR) as $d){ if (preg_match('/stock|wait|notif|alert|back/i',basename($d))) $o['visi_pluginai_atitinka'][]=basename($d); }
  $o['lenteles']=$wpdb->get_col("SHOW TABLES LIKE '%'"); $o['lenteles']=array_values(array_filter($o['lenteles'],function($t){return preg_match('/wait|notif|alert|stock|prane|lauk|subscr/i',$t);}));
  $hits=array(); foreach (array(WPMU_PLUGIN_DIR, WP_PLUGIN_DIR.'/petshop-core', get_stylesheet_directory(), WP_PLUGIN_DIR.'/petshop-xml') as $dir){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir)); foreach ($it as $f){ if (!preg_match('/\.(php|js)$/',$f)) continue; $c=@file_get_contents($f); if ($c===false) continue; if (preg_match_all('/pranešti kai|pranesti kai|kai bus|back.?in.?stock|waitlist|stock_notif|informuoti kai|laukimo/iu',$c,$m)){ $hits[str_replace(ABSPATH,'',$f)]=array_count_values(array_map('mb_strtolower',$m[0])); } } }
  $o['kodo_atitikmenys']=$hits;
  $o['ivykiai_tipai']=$wpdb->get_results("SELECT tipas, COUNT(*) n FROM {$p}ps_web_ivykiai WHERE laikas>=NOW()-INTERVAL 10 DAY GROUP BY tipas ORDER BY n DESC LIMIT 30",ARRAY_A);
  $o['ivykiai_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_web_ivykiai");
  $o['snippetai']=$wpdb->get_results("SELECT id, name, active FROM {$p}snippets WHERE name LIKE '%prane%' OR name LIKE '%stock%' OR name LIKE '%lauk%' OR code LIKE '%kai bus%' OR code LIKE '%back_in_stock%' LIMIT 20",ARRAY_A);
  $o['istorija_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_ist_uzsakymai");
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
