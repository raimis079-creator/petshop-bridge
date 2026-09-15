<?php
/** TEMP PS S1686 mb — READ-ONLY: win-back šablonų turinys, ps_email_jobs pagal flow, refill kandidatai +60 d. po predicted_empty_date be pirkimo, klientai win_back segmentas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mb'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1686 mb');
  $core=WP_PLUGIN_DIR.'/petshop-core';
  foreach(array('win-back-60','refill') as $t) $o['tpl'][$t]=file_get_contents("$core/templates/emails/$t.php");
  $L=file("$core/includes/class-email-dispatch.php"); foreach($L as $i=>$l) if(preg_match('/function (enqueue|schedule|render|send|eligib)|apply_filters|holdout|marketing/i',$l)) $o['dispatch_grep'][]=($i+1).': '.trim(mb_substr($l,0,160));
  $o['jobs_flow']=$wpdb->get_results("SELECT flow, status, skip_reason, COUNT(*) n FROM {$p}ps_email_jobs GROUP BY flow,status,skip_reason ORDER BY flow",ARRAY_A);
  $o['refill_status']=$wpdb->get_results("SELECT status, COUNT(*) n, MIN(predicted_empty_date) mn, MAX(predicted_empty_date) mx FROM {$p}ps_refill_tracking GROUP BY status",ARRAY_A);
  $o['kand60']=$wpdb->get_results("SELECT r.user_id, COUNT(*) prekes, MAX(r.predicted_empty_date) pask_term, MAX(r.last_purchase_date) pask_pirk, DATEDIFF(CURDATE(),MAX(r.predicted_empty_date)) d FROM {$p}ps_refill_tracking r WHERE r.predicted_empty_date<=CURDATE()-INTERVAL 60 DAY GROUP BY r.user_id ORDER BY d LIMIT 15",ARRAY_A);
  $o['kand60_n']=$wpdb->get_var("SELECT COUNT(DISTINCT user_id) FROM {$p}ps_refill_tracking WHERE predicted_empty_date<=CURDATE()-INTERVAL 60 DAY");
  $o['klientai_tbl']=$wpdb->get_results("SELECT segmentas, COUNT(*) n FROM {$p}ps_klientai GROUP BY segmentas",ARRAY_A);
  $o['klientai_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_klientai");
  $o['ist_segm']=$wpdb->get_results("SELECT CASE WHEN d<=90 THEN 'a<=90' WHEN d<=180 THEN 'b91-180' WHEN d<=365 THEN 'c181-365' ELSE 'd>365' END s, COUNT(*) n FROM (SELECT klientas_email_hash h, DATEDIFF(CURDATE(),MAX(apmoketa_at)) d FROM {$p}ps_ist_fakt_uzsakymai WHERE testinis=0 AND apmoketa_at IS NOT NULL GROUP BY h) x GROUP BY s",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
