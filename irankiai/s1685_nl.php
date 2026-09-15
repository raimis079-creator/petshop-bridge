<?php
/** TEMP PS S1685 nl — RECON read-only: ps_fakt_uzsakymai kanalų reikšmės nuo T-0, refill_due jobs būsenos, blokas() matomumas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685nl'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 nl');
  $o['kan']=$wpdb->get_results("SELECT kanalas_paskutinis k, utm_medium m, (gclid<>'' AND gclid IS NOT NULL) g, klientas_naujas nj, COUNT(*) n, ROUND(SUM(viso_ct)/100) eur FROM {$p}ps_fakt_uzsakymai WHERE sukurta_at>='2026-09-09' AND testinis=0 GROUP BY 1,2,3,4 ORDER BY n DESC LIMIT 25",ARRAY_A);
  $o['stat']=$wpdb->get_results("SELECT statusas_galutinis s, COUNT(*) n FROM {$p}ps_fakt_uzsakymai WHERE sukurta_at>='2026-09-09' GROUP BY 1",ARRAY_A);
  $o['jobs']=$wpdb->get_results("SELECT flow,status,block_reason,skip_reason,COUNT(*) n FROM {$p}ps_email_jobs WHERE flow IN ('refill_due','post_purchase_14d') GROUP BY 1,2,3,4",ARRAY_A);
  $rm=new ReflectionMethod('Petshop_Analitika_Langas','blokas'); $o['blokas_public']=$rm->isPublic(); $rm2=new ReflectionMethod('Petshop_Analitika_Langas','eur'); $o['eur_public']=$rm2->isPublic();
  $o['eil_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_eilutes");
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
