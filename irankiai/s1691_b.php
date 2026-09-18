<?php
/** TEMP PS S1691 b — recon: pavėlavę email jobs, petshop-xml.php 330–350, php_error.log sudėtis. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691b'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true);
  $o['jobs']=$wpdb->get_results("SELECT id, flow, status, user_id, order_id, scheduled_at, created_at, LEFT(COALESCE(skip_reason,''),60) sr, LEFT(COALESCE(last_error,''),120) err FROM {$p}ps_email_jobs WHERE status IN ('pending','queued','scheduled') AND scheduled_at<NOW()-INTERVAL 2 HOUR ORDER BY scheduled_at",ARRAY_A);
  $o['jobs_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_email_jobs");
  $o['jobs_pending_viso']=$wpdb->get_results("SELECT status, COUNT(*) n, MIN(scheduled_at) min_s, MAX(scheduled_at) max_s FROM {$p}ps_email_jobs WHERE status IN ('pending','queued','scheduled') GROUP BY status",ARRAY_A);
  $o['dispatch_cron']=wp_next_scheduled('ps_email_dispatch_cron'); $o['dispatch_cron_lt']=$o['dispatch_cron']?date('m-d H:i',$o['dispatch_cron']+3*3600):null;
  $f=WP_PLUGIN_DIR.'/petshop-xml/petshop-xml.php'; $o['xml_md5']=md5_file($f); $o['xml_dydis']=filesize($f);
  $l=file($f); $o['xml_330_350']=array(); for($i=329;$i<350;$i++) if(isset($l[$i])) $o['xml_330_350'][$i+1]=rtrim($l[$i]);
  $o['xml_header']=implode("\n",array_slice($l,0,15));
  $pl=dirname(ABSPATH).'/logs/php_error.log';
  if (file_exists($pl)){ $sz=filesize($pl); $fh=fopen($pl,'r'); fseek($fh,max(0,$sz-2000000)); $t=fread($fh,2000000); fclose($fh);
    $lines=explode("\n",$t); array_shift($lines); $tip=array(); $dien=array();
    foreach ($lines as $ln){ if ($ln==='') continue; if (preg_match('/^\[(\d\d-\w{3}-\d{4})/',$ln,$m)) { $dien[$m[1]]=($dien[$m[1]]??0)+1; }
      $k=preg_replace('/^\[[^\]]+\]\s*/','',$ln); $k=preg_replace('/\d+/','#',$k); $k=mb_substr($k,0,110); $tip[$k]=($tip[$k]??0)+1; }
    arsort($tip); $o['log_pask2mb_tipai']=array_slice($tip,0,15,true); $o['log_pask2mb_dienos']=$dien; $o['log_dydis']=$sz;
    $fh=fopen($pl,'r'); $o['log_pirma_eil']=mb_substr(fgets($fh),0,120); fclose($fh); }
  $o['log_errors_ini']=array('log_errors'=>ini_get('log_errors'),'error_log'=>ini_get('error_log'),'error_reporting'=>ini_get('error_reporting'),'wp_debug'=>defined('WP_DEBUG')?WP_DEBUG:null,'wp_debug_log'=>defined('WP_DEBUG_LOG')?WP_DEBUG_LOG:null);
  $o['archyvas']=array_map('basename',(array)glob(dirname(ABSPATH).'/logs/*'));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
