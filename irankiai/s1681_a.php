<?php
/** TEMP PS S1681 a — read-only: sargų būklė — kur „lemputės", ps_sargas_klaidos 24 val., ps_ cron'ai, *_pask žymos. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681a'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 a','dabar'=>current_time('mysql'));
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $s=file_get_contents($f); $n=basename($f);
    if(preg_match_all('/^.*(lemput|raudon|🔴|"red"|\'red\').*$/miu',$s,$m)) $o['lemp'][$n]=array_slice(array_map(function($x){return substr(trim($x),0,220);},$m[0]),0,12); }
  $t=$p.'ps_sargas_klaidos'; if($wpdb->get_var("SHOW TABLES LIKE '$t'")){ $o['klaidos_cols']=$wpdb->get_col("SHOW COLUMNS FROM $t");
    $o['klaidos_24h']=$wpdb->get_results("SELECT * FROM $t WHERE created_at>=DATE_SUB(NOW(),INTERVAL 36 HOUR) ORDER BY id DESC LIMIT 40",ARRAY_A); }
  foreach($wpdb->get_results("SHOW TABLES LIKE '{$p}ps_sarg%'",ARRAY_N) as $r) $o['sarg_lent'][]=$r[0];
  $o['opts']=$wpdb->get_results("SELECT option_name n,LEFT(option_value,300) v FROM {$p}options WHERE option_name LIKE 'ps_sarg%' OR option_name LIKE 'ps_%_pask%' OR option_name LIKE 'ps_%_bukle%' OR option_name LIKE 'ps_%_lemp%'",ARRAY_A);
  $c=_get_cron_array(); $now=time(); foreach($c as $ts=>$hooks) foreach($hooks as $h=>$x) if(preg_match('/^(ps_|petshop)/',$h)) $o['cron'][]=array('h'=>$h,'kada'=>date('m-d H:i',$ts),'velavimas_min'=>$ts<$now?round(($now-$ts)/60):0);
  $l=ABSPATH.'../logs/php_error.log'; if(file_exists($l)){ $a=file($l); $o['php_log_tail']=array_map(function($s){return substr($s,0,250);},array_slice($a,-15)); }
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
