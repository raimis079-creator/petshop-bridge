<?php
/** TEMP PS S1678 k — READ-ONLY: klientų aktyvumas ir pakartotinumas iš istorijos (ps_ist_fakt_uzsakymai/eilutes). */
add_action('init', function(){
  if (!isset($_GET['ps_sec8k'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1678 k'); $wpdb->suppress_errors(true);
  $U="{$p}ps_ist_fakt_uzsakymai"; $E="{$p}ps_ist_fakt_eilutes"; $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM $U");
  $kl=in_array('klientas_id',$o['cols'])?'klientas_id':(in_array('el_pastas_hash',$o['cols'])?'el_pastas_hash':(in_array('klientas_hash',$o['cols'])?'klientas_hash':'el_pastas'));
  $dt=in_array('apmoketa_at',$o['cols'])?'apmoketa_at':'sukurta_at'; $sum=in_array('suma_ct',$o['cols'])?'suma_ct':'viso_ct'; $o['kl']=$kl; $o['dt']=$dt; $o['sum']=$sum;
  $o['viso']=$wpdb->get_row("SELECT COUNT(*) n, COUNT(DISTINCT $kl) kl, MIN($dt) nuo, MAX($dt) iki, ROUND(SUM($sum)/100) eur FROM $U",ARRAY_A);
  foreach(array(12,24,36) as $m){ $o['per'.$m]=$wpdb->get_row("SELECT COUNT(*) uzs, COUNT(DISTINCT $kl) klientai, ROUND(SUM($sum)/100) eur, ROUND(AVG($sum)/100,1) aov FROM $U WHERE $dt>DATE_SUB(NOW(),INTERVAL $m MONTH)",ARRAY_A); }
  $o['pakart12']=$wpdb->get_results("SELECT n, COUNT(*) klientai, ROUND(SUM(eur)) eur FROM (SELECT $kl k, COUNT(*) n, SUM($sum)/100 eur FROM $U WHERE $dt>DATE_SUB(NOW(),INTERVAL 12 MONTH) GROUP BY $kl) t GROUP BY LEAST(n,6) ORDER BY n",ARRAY_A);
  $o['interv']=$wpdb->get_var("SELECT ROUND(AVG(d)) FROM (SELECT DATEDIFF(MAX($dt),MIN($dt))/(COUNT(*)-1) d FROM $U WHERE $dt>DATE_SUB(NOW(),INTERVAL 24 MONTH) GROUP BY $kl HAVING COUNT(*)>=3) t");
  $o['ciklines']=$wpdb->get_results("SELECT e.sku, MAX(e.pavadinimas_tuo_metu) p, COUNT(DISTINCT u.$kl) kl, COUNT(*) pirk, ROUND(COUNT(*)/COUNT(DISTINCT u.$kl),1) per_kl, ROUND(SUM(e.kaina_ct)/100) eur FROM $E e JOIN $U u ON u.id=e.uzsakymas_id WHERE u.$dt>DATE_SUB(NOW(),INTERVAL 24 MONTH) GROUP BY e.sku HAVING kl>=5 AND per_kl>=2 ORDER BY pirk DESC LIMIT 40",ARRAY_A);
  $o['top_eur24']=$wpdb->get_results("SELECT e.brendas_slug b, ROUND(SUM(e.kaina_ct)/100) eur, COUNT(DISTINCT u.$kl) kl FROM $E e JOIN $U u ON u.id=e.uzsakymas_id WHERE u.$dt>DATE_SUB(NOW(),INTERVAL 12 MONTH) GROUP BY b ORDER BY eur DESC LIMIT 20",ARRAY_A);
  $o['sender']=array('kontaktai_opcija'=>get_option('petshop_esp_sender_kontaktu_sk','-'),'sutikimai_meta'=>$wpdb->get_var("SELECT COUNT(*) FROM {$p}usermeta WHERE meta_key LIKE '%newsletter%' OR meta_key LIKE '%rinkodar%' OR meta_key LIKE '%marketing_consent%'"),'sutik_raktai'=>$wpdb->get_col("SELECT DISTINCT meta_key FROM {$p}usermeta WHERE meta_key LIKE '%newsletter%' OR meta_key LIKE '%rinkodar%' OR meta_key LIKE '%consent%' OR meta_key LIKE '%sutik%' LIMIT 10'"));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
