<?php
/** TEMP PS S1681 i — read-only: užsakymų kritimo diagnostika — savaitės: užsakymai/pajamos (ps_fakt_uzsakymai), GSC klikai/parodymai, Ads išlaidos/klikai; pernai tas pats laikotarpis. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681i'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 i');
  $o['u_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_uzsakymai");
  $o['sav']=$wpdb->get_results("SELECT YEARWEEK(apmoketa_at,3) sav,MIN(DATE(apmoketa_at)) nuo,COUNT(*) n,ROUND(SUM(viso_ct)/100) eur,GROUP_CONCAT(DISTINCT saltinis_aplinka) apl,SUM(klientas_naujas=1) nauji FROM {$p}ps_fakt_uzsakymai WHERE apmoketa_at>=DATE_SUB(NOW(),INTERVAL 12 WEEK) GROUP BY sav ORDER BY sav",ARRAY_A);
  $o['pernai']=$wpdb->get_results("SELECT YEARWEEK(apmoketa_at,3) sav,COUNT(*) n,ROUND(SUM(viso_ct)/100) eur FROM {$p}ps_fakt_uzsakymai WHERE apmoketa_at BETWEEN '2025-08-11' AND '2025-09-28' GROUP BY sav ORDER BY sav",ARRAY_A);
  $o['gsc']=$wpdb->get_results("SELECT YEARWEEK(diena,3) sav,SUM(clicks) kl,SUM(impr) impr,ROUND(AVG(pos),1) pos FROM {$p}ps_fakt_gsc_dienos WHERE diena>=DATE_SUB(NOW(),INTERVAL 12 WEEK) GROUP BY sav ORDER BY sav",ARRAY_A);
  $o['ads']=$wpdb->get_results("SELECT YEARWEEK(diena,3) sav,ROUND(SUM(islaidos_ct)/100) eur,SUM(paspaudimai) kl,ROUND(SUM(konversijos),1) konv FROM {$p}ps_fakt_reklama WHERE kanalas='google_ads' AND diena>=DATE_SUB(NOW(),INTERVAL 12 WEEK) GROUP BY sav ORDER BY sav",ARRAY_A);
  $o['dienos']=$wpdb->get_results("SELECT DATE(apmoketa_at) d,COUNT(*) n,ROUND(SUM(viso_ct)/100) eur FROM {$p}ps_fakt_uzsakymai WHERE apmoketa_at>=DATE_SUB(NOW(),INTERVAL 21 DAY) GROUP BY d ORDER BY d",ARRAY_A);
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
