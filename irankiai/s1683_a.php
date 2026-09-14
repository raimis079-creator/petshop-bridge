<?php
/** TEMP PS S1683 a — READ-ONLY istorija: maisto/skanėstų pirkėjų kohortos (nauji/mėn., aktyvi bazė, nubyrėjimas, išlaidos/mėn., intervalai, negrįžusių profilis). */
add_action('init', function(){
  if (!isset($_GET['ps_s1683a'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1683 a'); $wpdb->suppress_errors(true);
  $U="{$p}ps_ist_fakt_uzsakymai"; $E="{$p}ps_ist_fakt_eilutes";
  $o['kat_top']=$wpdb->get_results("SELECT SUBSTRING_INDEX(kategoriju_kelias,'>',1) k, COUNT(*) n FROM $E GROUP BY k ORDER BY n DESC LIMIT 15",ARRAY_A);
  $o['kat_l2']=$wpdb->get_results("SELECT SUBSTRING_INDEX(kategoriju_kelias,'>',2) k, COUNT(*) n FROM $E GROUP BY k ORDER BY n DESC LIMIT 30",ARRAY_A);
  $FOOD="(LOWER(e.kategoriju_kelias) LIKE '%maist%' OR LOWER(e.kategoriju_kelias) LIKE '%skan%' OR LOWER(e.kategoriju_kelias) LIKE '%konserv%')";
  // laikina lentelė: maisto užsakymai su kliento raktu
  $wpdb->query("DROP TEMPORARY TABLE IF EXISTS t_mu");
  $wpdb->query("CREATE TEMPORARY TABLE t_mu AS SELECT u.uzsakymas_id, COALESCE(NULLIF(u.klientas_email_hash,''),CONCAT('id',u.klientas_id)) kl, DATE(u.apmoketa_at) d, u.viso_ct, u.klientas_uzsakymo_nr nr, SUM(CASE WHEN $FOOD THEN e.kaina_ct ELSE 0 END) maist_ct, COUNT(DISTINCT e.sku) sku_n, MAX(CASE WHEN $FOOD THEN e.brendas_slug END) brendas FROM $U u JOIN $E e ON e.uzsakymas_id=u.uzsakymas_id WHERE u.apmoketa_at IS NOT NULL AND u.testinis=0 GROUP BY u.uzsakymas_id HAVING maist_ct>0");
  $o['t_mu_n']=$wpdb->get_var("SELECT COUNT(*) FROM t_mu");
  $o['vis_uzs']=$wpdb->get_var("SELECT COUNT(*) FROM $U WHERE apmoketa_at IS NOT NULL AND testinis=0");
  $wpdb->query("DROP TEMPORARY TABLE IF EXISTS t_kl");
  $wpdb->query("CREATE TEMPORARY TABLE t_kl AS SELECT kl, MIN(d) pirmas, MAX(d) pask, COUNT(*) uzs, SUM(viso_ct) viso_ct, SUM(maist_ct) maist_ct FROM t_mu GROUP BY kl");
  // 1. nauji maisto klientai per mėnesį + grįžtantys + pajamos
  $o['men']=$wpdb->get_results("SELECT DATE_FORMAT(m.d,'%Y-%m') m, COUNT(*) uzs, COUNT(DISTINCT m.kl) kl, SUM(k.pirmas=m.d) nauji, ROUND(SUM(m.viso_ct)/100) eur, ROUND(SUM(m.maist_ct)/100) maist_eur FROM t_mu m JOIN t_kl k ON k.kl=m.kl WHERE m.d>='2024-01-01' GROUP BY 1 ORDER BY 1",ARRAY_A);
  // 2. aktyvi bazė (maisto pirkimas per paskutines 90 d.) mėnesio pabaigoje + išlaidos/aktyviam
  $rows=array();
  for($y=2024;$y<=2026;$y++) for($mo=1;$mo<=12;$mo++){ $end=date('Y-m-t',mktime(0,0,0,$mo,1,$y)); if($end>'2026-08-31') break 2;
    $r=$wpdb->get_row($wpdb->prepare("SELECT COUNT(DISTINCT kl) akt, ROUND(SUM(viso_ct)/100) eur90, ROUND(SUM(maist_ct)/100) maist90 FROM t_mu WHERE d>DATE_SUB(%s,INTERVAL 90 DAY) AND d<=%s",$end,$end),ARRAY_A);
    $r['m']=substr($end,0,7); $rows[]=$r; }
  $o['aktyvi90']=$rows;
  // 3. nubyrėjimas: iš aktyvių mėn. M (90 d.) kiek liko aktyvūs M+3
  $ch=array(); foreach(array('2024-06-30','2024-12-31','2025-03-31','2025-06-30','2025-09-30','2025-12-31','2026-03-31','2026-05-31') as $end){
    $e2=date('Y-m-d',strtotime($end.' +92 days'));
    $ch[]=$wpdb->get_row($wpdb->prepare("SELECT %s m, COUNT(*) akt, SUM(EXISTS(SELECT 1 FROM t_mu b WHERE b.kl=a.kl AND b.d>%s AND b.d<=%s)) liko FROM (SELECT DISTINCT kl FROM t_mu WHERE d>DATE_SUB(%s,INTERVAL 90 DAY) AND d<=%s) a",$end,$end,$e2,$end,$end),ARRAY_A); }
  $o['nubyr_ketv']=$ch;
  // 4. kohortos pagal pirmo maisto pirkimo ketvirtį: grįžo per 90/180/365 d., užs. ir € per 12 mėn.
  $o['kohortos']=$wpdb->get_results("SELECT CONCAT(YEAR(k.pirmas),'Q',QUARTER(k.pirmas)) q, COUNT(*) kl, SUM(EXISTS(SELECT 1 FROM t_mu b WHERE b.kl=k.kl AND b.d>k.pirmas AND b.d<=DATE_ADD(k.pirmas,INTERVAL 90 DAY))) g90, SUM(EXISTS(SELECT 1 FROM t_mu b WHERE b.kl=k.kl AND b.d>k.pirmas AND b.d<=DATE_ADD(k.pirmas,INTERVAL 180 DAY))) g180, SUM(EXISTS(SELECT 1 FROM t_mu b WHERE b.kl=k.kl AND b.d>k.pirmas AND b.d<=DATE_ADD(k.pirmas,INTERVAL 365 DAY))) g365, ROUND(AVG((SELECT COUNT(*) FROM t_mu b WHERE b.kl=k.kl AND b.d<=DATE_ADD(k.pirmas,INTERVAL 365 DAY))),2) uzs12, ROUND(AVG((SELECT SUM(viso_ct) FROM t_mu b WHERE b.kl=k.kl AND b.d<=DATE_ADD(k.pirmas,INTERVAL 365 DAY)))/100,1) eur12 FROM t_kl k WHERE k.pirmas>='2023-11-01' GROUP BY q ORDER BY q",ARRAY_A);
  // 5. intervalai tarp maisto užsakymų (grįžtantys), pagal brendą
  $wpdb->query("DROP TEMPORARY TABLE IF EXISTS t_iv");
  $wpdb->query("CREATE TEMPORARY TABLE t_iv AS SELECT a.kl, a.brendas, DATEDIFF(a.d,(SELECT MAX(b.d) FROM t_mu b WHERE b.kl=a.kl AND b.d<a.d)) iv FROM t_mu a WHERE a.d>='2024-09-01'");
  $o['interv']=$wpdb->get_row("SELECT COUNT(*) n, ROUND(AVG(iv)) vid, SUM(iv<=30) d30, SUM(iv BETWEEN 31 AND 60) d60, SUM(iv BETWEEN 61 AND 90) d90, SUM(iv BETWEEN 91 AND 180) d180, SUM(iv>180) d180p FROM t_iv WHERE iv IS NOT NULL",ARRAY_A);
  $o['interv_brend']=$wpdb->get_results("SELECT brendas b, COUNT(*) n, ROUND(AVG(iv)) vid FROM t_iv WHERE iv IS NOT NULL GROUP BY b HAVING n>=20 ORDER BY n DESC LIMIT 12",ARRAY_A);
  // 6. negrįžę vs grįžę (pirmas pirkimas 2024-09…2025-08): profilis
  $o['profilis']=$wpdb->get_results("SELECT (k.uzs>1) grizo, COUNT(*) kl, ROUND(AVG(m.viso_ct)/100,1) pirmo_aov, ROUND(AVG(m.maist_ct/m.viso_ct)*100) maist_pct, ROUND(AVG(m.sku_n),1) sku_n, SUM(m.viso_ct<3000) iki30, SUM(m.viso_ct>=6000) nuo60 FROM t_kl k JOIN t_mu m ON m.kl=k.kl AND m.d=k.pirmas WHERE k.pirmas BETWEEN '2024-09-01' AND '2025-08-31' GROUP BY 1",ARRAY_A);
  $o['negrizo_brend']=$wpdb->get_results("SELECT m.brendas b, COUNT(*) kl, SUM(k.uzs>1) grizo, ROUND(AVG(m.viso_ct)/100,1) aov FROM t_kl k JOIN t_mu m ON m.kl=k.kl AND m.d=k.pirmas WHERE k.pirmas BETWEEN '2024-09-01' AND '2025-08-31' GROUP BY b HAVING kl>=15 ORDER BY kl DESC LIMIT 15",ARRAY_A);
  $o['negrizo_gyv']=$wpdb->get_results("SELECT e.gyvunas g, COUNT(DISTINCT k.kl) kl, COUNT(DISTINCT CASE WHEN k.uzs>1 THEN k.kl END) grizo FROM t_kl k JOIN t_mu m ON m.kl=k.kl AND m.d=k.pirmas JOIN $E e ON e.uzsakymas_id=m.uzsakymas_id WHERE k.pirmas BETWEEN '2024-09-01' AND '2025-08-31' AND $FOOD GROUP BY g",ARRAY_A);
  // 7. kliento vertė: pasiskirstymas pagal užsakymų sk. (visi maisto klientai nuo 2024-09)
  $o['vertes']=$wpdb->get_results("SELECT CASE WHEN uzs=1 THEN '1' WHEN uzs<=3 THEN '2-3' WHEN uzs<=6 THEN '4-6' WHEN uzs<=12 THEN '7-12' ELSE '13+' END g, COUNT(*) kl, ROUND(SUM(viso_ct)/100) eur, ROUND(AVG(viso_ct)/100) eur_kl FROM t_kl WHERE pirmas>='2024-09-01' GROUP BY g ORDER BY MIN(uzs)",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
