<?php
/** TEMP PS S1686 ma — READ-ONLY: win-back recon: šablonai win-back-*.php, kas juos siunčia (core grep), ps_email_jobs win-back būsenos, kandidatai (refill terminas +60 d. be pirkimo). */
add_action('init', function(){
  if (!isset($_GET['ps_s1686ma'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1686 ma');
  $core=WP_PLUGIN_DIR.'/petshop-core'; $o['core_exists']=is_dir($core);
  foreach(glob($core.'/templates/emails/win-back*') as $f){ $o['sablonai'][basename($f)]=array('dydis'=>filesize($f),'md5'=>substr(md5_file($f),0,8),'pradzia'=>mb_substr(strip_tags(file_get_contents($f)),0,600)); }
  $o['sablonu_sarasas']=array_map('basename',glob($core.'/templates/emails/*'));
  $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($core.'/includes'));
  foreach($it as $f){ if(substr($f,-4)!=='.php') continue; $L=file($f); foreach($L as $i=>$l) if(preg_match('/win.?back|winback/i',$l)) $o['core_grep'][]=str_replace($core,'',$f).':'.($i+1).': '.trim(mb_substr($l,0,200)); }
  foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $L=file($f); foreach($L as $i=>$l) if(preg_match('/win.?back/i',$l)) $o['mu_grep'][]=basename($f).':'.($i+1).': '.trim(mb_substr($l,0,200)); }
  $o['jobs_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_email_jobs");
  $o['jobs_tipai']=$wpdb->get_results("SELECT type t, status s, skip_reason r, COUNT(*) n, MIN(created_at) nuo, MAX(created_at) iki FROM {$p}ps_email_jobs GROUP BY t,s,r ORDER BY t,s",ARRAY_A);
  $o['cron']=array_filter(array_keys(_get_cron_array() ? array_merge(...array_values(_get_cron_array())) : array()), function($k){return strpos($k,'ps_')===0;});
  $o['refill_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_refill_tracking");
  $o['refill_praeje']=$wpdb->get_results("SELECT DATEDIFF(CURDATE(),predicted_date) d60, COUNT(*) n FROM {$p}ps_refill_tracking WHERE predicted_date<CURDATE()-INTERVAL 30 DAY GROUP BY FLOOR(DATEDIFF(CURDATE(),predicted_date)/30) ORDER BY d60 LIMIT 12",ARRAY_A);
  $o['ist_kandidatai']=$wpdb->get_var("SELECT COUNT(DISTINCT klientas_email) FROM {$p}ps_ist_fakt_uzsakymai WHERE apmoketa_at>=CURDATE()-INTERVAL 365 DAY AND apmoketa_at<CURDATE()-INTERVAL 120 DAY");
  $o['ist_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_ist_fakt_uzsakymai");
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
