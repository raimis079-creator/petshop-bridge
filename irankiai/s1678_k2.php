<?php
/** TEMP PS S1678 k2 — READ-ONLY istorija 12/24 mėn.: ciklinės prekės, brendai/kategorijos/gyvūnas pagal pajamas, marža/kontribucija, vežėjai, miestai, mokėjimai, savikainų padengimas. */
add_action('init', function(){
  if (!isset($_GET['ps_sec8k2'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1678 k2'); $wpdb->suppress_errors(true);
  $U="{$p}ps_ist_fakt_uzsakymai"; $E="{$p}ps_ist_fakt_eilutes"; $W12="apmoketa_at>DATE_SUB(NOW(),INTERVAL 12 MONTH)"; $J="JOIN $U u ON u.uzsakymas_id=e.uzsakymas_id";
  $o['ekonomika12']=$wpdb->get_row("SELECT COUNT(*) n, ROUND(SUM(viso_ct)/100) viso, ROUND(SUM(prekiu_suma_ct)/100) prekes, ROUND(SUM(savikaina_ct)/100) sav, ROUND(SUM(marza_ct)/100) marza, ROUND(SUM(kontribucija_ct)/100) kontrib, ROUND(AVG(marza_ct)/100,2) marza_uzs, ROUND(AVG(kontribucija_ct)/100,2) kontrib_uzs, ROUND(SUM(pristatymas_paimta_ct)/100) prist_paimta, ROUND(SUM(pristatymas_savikaina_ct)/100) prist_sav, SUM(savikaina_ct>0) su_sav FROM $U WHERE $W12",ARRAY_A);
  $o['marza_pct12']=$wpdb->get_var("SELECT ROUND(SUM(marza_ct)/SUM(prekiu_suma_ct-pvm_ct)*100,1) FROM $U WHERE $W12 AND savikaina_ct>0");
  $o['brendai12']=$wpdb->get_results("SELECT e.brendas_slug b, ROUND(SUM(e.kaina_ct)/100) eur, COUNT(DISTINCT u.klientas_id) kl, COUNT(*) eil, ROUND(AVG(CASE WHEN e.savikaina_ct>0 THEN (e.kaina_ct/1.21-e.savikaina_ct)/(e.kaina_ct/1.21)*100 END),0) m FROM $E e $J WHERE u.$W12 GROUP BY b ORDER BY eur DESC LIMIT 25",ARRAY_A);
  $o['gyvunas12']=$wpdb->get_results("SELECT e.gyvunas g, ROUND(SUM(e.kaina_ct)/100) eur, COUNT(DISTINCT u.klientas_id) kl FROM $E e $J WHERE u.$W12 GROUP BY g ORDER BY eur DESC",ARRAY_A);
  $o['kategorijos12']=$wpdb->get_results("SELECT SUBSTRING_INDEX(e.kategoriju_kelias,'>',2) k, ROUND(SUM(e.kaina_ct)/100) eur, COUNT(*) eil FROM $E e $J WHERE u.$W12 GROUP BY k ORDER BY eur DESC LIMIT 25",ARRAY_A);
  $o['ciklines24']=$wpdb->get_results("SELECT e.sku, MAX(e.pavadinimas_tuo_metu) p, COUNT(DISTINCT u.klientas_id) kl, COUNT(*) pirk, ROUND(COUNT(*)/COUNT(DISTINCT u.klientas_id),1) per_kl, ROUND(SUM(e.kaina_ct)/100) eur FROM $E e $J WHERE u.apmoketa_at>DATE_SUB(NOW(),INTERVAL 24 MONTH) GROUP BY e.sku HAVING kl>=5 AND per_kl>=2 ORDER BY pirk DESC LIMIT 40",ARRAY_A);
  $o['top_prekes12']=$wpdb->get_results("SELECT e.sku, MAX(e.pavadinimas_tuo_metu) p, COUNT(*) pirk, ROUND(SUM(e.kaina_ct)/100) eur FROM $E e $J WHERE u.$W12 GROUP BY e.sku ORDER BY eur DESC LIMIT 30",ARRAY_A);
  $o['vezejai12']=$wpdb->get_results("SELECT vezejai v, COUNT(*) n, ROUND(AVG(viso_ct)/100,1) aov FROM $U WHERE $W12 GROUP BY v ORDER BY n DESC LIMIT 8",ARRAY_A);
  $o['mokejimai12']=$wpdb->get_results("SELECT mokejimo_budas m, COUNT(*) n FROM $U WHERE $W12 GROUP BY m ORDER BY n DESC",ARRAY_A);
  $o['miestai12']=$wpdb->get_results("SELECT miestas m, COUNT(*) n FROM $U WHERE $W12 GROUP BY m ORDER BY n DESC LIMIT 12",ARRAY_A);
  $o['sandeliai12']=$wpdb->get_results("SELECT sandeliai s, misrus, COUNT(*) n FROM $U WHERE $W12 GROUP BY s, misrus ORDER BY n DESC LIMIT 10",ARRAY_A);
  $o['nauji12']=$wpdb->get_results("SELECT klientas_naujas nj, COUNT(*) n, ROUND(AVG(viso_ct)/100,1) aov FROM $U WHERE $W12 GROUP BY nj",ARRAY_A);
  $o['aov_pasisk12']=$wpdb->get_results("SELECT CASE WHEN viso_ct<2000 THEN '<20' WHEN viso_ct<3000 THEN '20-30' WHEN viso_ct<4500 THEN '30-45' WHEN viso_ct<7000 THEN '45-70' ELSE '70+' END b, COUNT(*) n, ROUND(SUM(viso_ct)/100) eur FROM $U WHERE $W12 GROUP BY b ORDER BY MIN(viso_ct)",ARRAY_A);
  $o['menesiai']=$wpdb->get_results("SELECT DATE_FORMAT(apmoketa_at,'%Y-%m') m, COUNT(*) n, ROUND(SUM(viso_ct)/100) eur FROM $U WHERE apmoketa_at>DATE_SUB(NOW(),INTERVAL 25 MONTH) GROUP BY m ORDER BY m",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
