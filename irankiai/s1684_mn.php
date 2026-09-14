<?php
/** TEMP PS S1684 mn — backfill ps_fakt_uzsakymai/eilutes klientas_naujas/klientas_uzsakymo_nr/dienos_nuo_ankstesnio pagal ps_ist (po s1684_mm). */
add_action('init', function(){
  if (!isset($_GET['ps_s1684mn'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1684 mn');
  // backfill: esamos fakt eilutės su istorija
  $U="{$p}ps_fakt_uzsakymai"; $E="{$p}ps_fakt_eilutes"; $I="{$p}ps_ist_fakt_uzsakymai";
  $rows=$wpdb->get_results("SELECT u.uzsakymas_id id, u.klientas_email_hash h, u.apmoketa_at a, u.klientas_uzsakymo_nr nr, u.klientas_naujas kn, (SELECT COUNT(*) FROM $I i WHERE i.klientas_email_hash=u.klientas_email_hash AND i.apmoketa_at IS NOT NULL AND i.apmoketa_at<=u.apmoketa_at) ni, (SELECT MAX(i.apmoketa_at) FROM $I i WHERE i.klientas_email_hash=u.klientas_email_hash AND i.apmoketa_at<=u.apmoketa_at) pi, (SELECT MAX(x.apmoketa_at) FROM $U x WHERE x.klientas_email_hash=u.klientas_email_hash AND x.apmoketa_at<u.apmoketa_at AND x.testinis=0) pw FROM $U u WHERE u.klientas_email_hash<>'' AND u.apmoketa_at IS NOT NULL",ARRAY_A);
  $o['backfill']=array('tikrinta'=>count($rows),'keista'=>0,'err'=>$wpdb->last_error);
  foreach($rows as $r){ if((int)$r['ni']<=0) continue; $pask=$r['pw']; if($r['pi']&&(!$pask||$r['pi']>$pask)) $pask=$r['pi']; $dienos=$pask?(int)floor((strtotime($r['a'])-strtotime($pask))/DAY_IN_SECONDS):null;
    $nr=(int)$r['nr']+(int)$r['ni']; $wpdb->update($U,array('klientas_naujas'=>0,'klientas_uzsakymo_nr'=>$nr,'dienos_nuo_ankstesnio'=>$dienos),array('uzsakymas_id'=>$r['id'])); $wpdb->update($E,array('klientas_naujas'=>0),array('uzsakymas_id'=>$r['id'])); $o['backfill']['keista']++; }
  $o['po']=$wpdb->get_row("SELECT COUNT(*) n, SUM(klientas_naujas=1) nauji, SUM(klientas_naujas=0) grizt, ROUND(AVG(CASE WHEN klientas_naujas=0 THEN dienos_nuo_ankstesnio END)) vid_d FROM $U WHERE testinis=0 AND apmoketa_at IS NOT NULL",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
