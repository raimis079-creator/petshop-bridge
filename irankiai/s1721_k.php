<?php
/** Plugin Name: TEMP PS S1721k read-only: skaiciuokles priminimai (ps_refill_tracking, refill_due laiskai) nuo T-0 */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721k'])) return; $r=['v'=>'S1721k']; global $wpdb; $P=$wpdb->prefix;
  $q=function($sql) use ($wpdb,&$r){ $x=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error) $r['SQL_ERR'][]=mb_substr($wpdb->last_error,0,200); return $x; };
  try{
    $r['cols']=$wpdb->get_col("SHOW COLUMNS FROM {$P}ps_refill_tracking");
    $r['pvz']=$q("SELECT * FROM {$P}ps_refill_tracking ORDER BY id DESC LIMIT 2");
    $r['viso']=$q("SELECT COUNT(*) n, MIN(created_at) nuo, MAX(created_at) iki FROM {$P}ps_refill_tracking");
    $cols=$r['cols']; $src=in_array('source',$cols)?'source':(in_array('saltinis',$cols)?'saltinis':(in_array('origin',$cols)?'origin':null));
    if($src) $r['pagal_saltini']=$q("SELECT $src s, status, COUNT(*) n, SUM(created_at>='2026-09-09') po_t0 FROM {$P}ps_refill_tracking GROUP BY 1,2 ORDER BY 1,2");
    else $r['pagal_statusa']=$q("SELECT status, COUNT(*) n, SUM(created_at>='2026-09-09') po_t0 FROM {$P}ps_refill_tracking GROUP BY 1");
    // skaiciuokles opt-in ivykiai
    $r['web_ivykiai']=$q("SELECT tipas, COUNT(*) n, COUNT(DISTINCT sesija) ses, MIN(diena) nuo, MAX(diena) iki FROM {$P}ps_web_ivykiai WHERE tipas LIKE '%calc%' OR tipas LIKE '%remind%' OR tipas LIKE '%primin%' OR tipas LIKE '%refill%' GROUP BY tipas ORDER BY n DESC LIMIT 20");
    $r['calc_optin_lentele']=$wpdb->get_var("SHOW TABLES LIKE '{$P}ps_refill_feedback'");
    foreach(['ps_refill_optin','ps_calc_reminders','ps_refill_requests','ps_reminders'] as $t){ if($wpdb->get_var("SHOW TABLES LIKE '{$P}$t'")) $r['lenteles'][$t]=$wpdb->get_var("SELECT COUNT(*) FROM {$P}$t"); }
    $r['tables_refill']=$wpdb->get_col("SHOW TABLES LIKE '{$P}ps_re%'");
    // laiskai
    $cols2=$wpdb->get_col("SHOW COLUMNS FROM {$P}ps_email_jobs"); $dc=null; foreach($cols2 as $c){ if(preg_match('#^(created|created_at|sukurta|sukurta_at|scheduled_at|laikas)$#',$c)){ $dc=$c; break; } }
    $r['laiskai']=$q("SELECT flow, status, COALESCE(skip_reason,'') sr, COUNT(*) n, MIN($dc) nuo, MAX($dc) iki FROM {$P}ps_email_jobs WHERE flow IN('refill_due','win_back','calc_reminder','refill_reminder') GROUP BY 1,2,3 ORDER BY 1,2");
    $r['email_cols']=$cols2;
    // atidarymai/paspaudimai jei yra
    if(in_array('opened_at',$cols2)||in_array('clicked_at',$cols2)) $r['atidaryta']=$q("SELECT flow, SUM(opened_at IS NOT NULL) atid, SUM(clicked_at IS NOT NULL) pasp, COUNT(*) n FROM {$P}ps_email_jobs WHERE status='sent' AND flow IN('refill_due','win_back') GROUP BY flow");
    $r['pakartoti_uzs']=$q("SELECT COUNT(*) n FROM {$P}wc_orders_meta WHERE meta_key='_ps_pakartoti_is'");
    // artimiausi terminai
    if(in_array('predicted_empty_date',$cols)) $r['artimiausi']=$q("SELECT predicted_empty_date d, status, COUNT(*) n FROM {$P}ps_refill_tracking WHERE predicted_empty_date>=CURDATE() GROUP BY 1,2 ORDER BY 1 LIMIT 15");
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
