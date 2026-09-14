<?php
/** TEMP PS S1681 d — read-only: ps_seo_cwv_diena — sargo žinios, seo plugino cwv būklė/žurnalas, funkcijos kūnas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681d'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 d','dabar_utc'=>gmdate('Y-m-d H:i'));
  $z=get_option('ps_sargas_cron_zinios'); $o['zinia_ts']=isset($z['ps_seo_cwv_diena'])?gmdate('Y-m-d H:i',$z['ps_seo_cwv_diena']):null;
  $o['opts']=$wpdb->get_results("SELECT option_name n,LEFT(option_value,600) v FROM {$p}options WHERE option_name LIKE 'ps_seo%' OR option_name LIKE 'ps_cwv%' OR option_name LIKE '_transient_ps_seo%' OR option_name LIKE '_transient_ps_cwv%'",ARRAY_A);
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $s=file_get_contents($f); if(strpos($s,'ps_seo_cwv_diena')!==false){ $n=basename($f); preg_match('/Version:\s*([\d.]+)/i',$s,$mv); $o['failas'][$n]=$mv[1]??'';
    if(preg_match_all('/^.*ps_seo_cwv_diena.*$/m',$s,$m)) $o['eil'][$n]=array_map(function($x){return substr(trim($x),0,300);},$m[0]);
    if(preg_match('/add_action\(\s*[\'"]ps_seo_cwv_diena[\'"]\s*,\s*(?:array\([^)]*,\s*)?[\'"]([A-Za-z_0-9:]+)[\'"]/',$s,$mm)){ $fn=end(explode(':',$mm[1])); $i=strpos($s,'function '.$fn.'('); if($i!==false) $o['fn_'.$fn]=substr($s,$i,2500); } } }
  foreach($wpdb->get_results("SHOW TABLES LIKE '{$p}ps_%cwv%'",ARRAY_N) as $r){ $t=$r[0]; $o['lent'][$t]=$wpdb->get_results("SELECT * FROM $t ORDER BY 1 DESC LIMIT 3",ARRAY_A); }
  $l=ABSPATH.'../logs/php_error.log'; if(file_exists($l)){ foreach(file($l) as $ln) if(preg_match('/14-Sep-2026 0[1-5]:/',$ln)) $o['log_0105'][]=substr($ln,0,250); }
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
