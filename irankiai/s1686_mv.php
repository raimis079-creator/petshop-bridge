<?php
/** TEMP PS S1686 mv — RELAUNCH 2A: generic segmento skaidymas. (&alter) stulpeliai last_kat, last_any_product_id, last_any_date, same_any_orders, grupe; (&eiti&n0&k1500) kiekvienam generic kontaktui: paskutinė bet kokia pirkta prekė (istorija+nauji faktai, be maisto ir be žuvų maisto), jos kategorijos kelias, senumas, ar gyva, kiek užsakymų su ta pačia preke, dažniausia 2 lygio kategorija; grupė G1 recent_nonfood (≤12 mėn.) / G1r repeat_nonfood (≥3× ≤18 mėn.) / G2 old_food (maistas 12–24) / G3 very_old (>24) / G4 dead_product; (be parametrų) suvestinė: grupė × kategorija × ar gyva. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mv'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1686 mv'); $t=Petshop_Relaunch::t();
  $faze='suvestine'; foreach(array('alter','eiti') as $fz) if(isset($_GET[$fz])) $faze=$fz; $nuo=0; $kiek=1500; foreach(array_keys($_GET) as $gk){ if(preg_match('/^n(\d+)$/',$gk,$m)) $nuo=(int)$m[1]; if(preg_match('/^k(\d+)$/',$gk,$m)) $kiek=(int)$m[1]; }
  $T0='2026-09-15'; $m12=date('Y-m-d',strtotime("$T0 -12 months")); $m18=date('Y-m-d',strtotime("$T0 -18 months")); $m24=date('Y-m-d',strtotime("$T0 -24 months"));
  if($faze==='alter'){ foreach(array('last_kat VARCHAR(120) NULL','last_any_product_id BIGINT UNSIGNED NULL','last_any_date DATE NULL','same_any_orders INT UNSIGNED NULL','grupe VARCHAR(20) NULL','top_kat VARCHAR(120) NULL') as $c){ $k=strtok($c,' '); if(!$wpdb->get_var("SHOW COLUMNS FROM $t LIKE '$k'")) $wpdb->query("ALTER TABLE $t ADD COLUMN $c"); } $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM $t"); }
  elseif($faze==='eiti'){
    $ks=$wpdb->get_results("SELECT id,email,hero_reason,last_food_date FROM $t WHERE segmentas='generic' ORDER BY id LIMIT $kiek OFFSET $nuo",ARRAY_A); $o['apdorota']=count($ks); $stat=array();
    foreach($ks as $k){ $h=hash('sha256',$k['email']);
      $rows=$wpdb->get_results($wpdb->prepare("SELECT preke_id pid, MAX(pask) pask, SUM(n) n, MAX(kelias) kelias FROM (
        SELECT e.preke_id, MAX(e.apmoketa_at) pask, COUNT(DISTINCT e.uzsakymas_id) n, e.kategoriju_kelias kelias FROM {$p}ps_ist_fakt_eilutes e JOIN {$p}ps_ist_fakt_uzsakymai u ON u.uzsakymas_id=e.uzsakymas_id WHERE u.klientas_email_hash=%s AND u.apmoketa_at IS NOT NULL AND e.kategoriju_kelias NOT LIKE '%%maist%%' GROUP BY e.preke_id
        UNION ALL SELECT e.preke_id, MAX(e.apmoketa_at), COUNT(DISTINCT e.uzsakymas_id), e.kategoriju_kelias FROM {$p}ps_fakt_eilutes e JOIN {$p}ps_fakt_uzsakymai u ON u.uzsakymas_id=e.uzsakymas_id WHERE u.klientas_email_hash=%s AND u.apmoketa_at IS NOT NULL AND u.testinis=0 AND e.kategoriju_kelias NOT LIKE '%%maist%%' GROUP BY e.preke_id
      ) x GROUP BY preke_id ORDER BY pask DESC",$h,$h),ARRAY_A);
      $r0=$rows?$rows[0]:null; $kat=null; $top=array(); foreach($rows as $r){ $seg=array_map('trim',explode('>',$r['kelias'])); $k2=isset($seg[1])?$seg[0].' > '.$seg[1]:$seg[0]; $top[$k2]=($top[$k2]??0)+(int)$r['n']; } arsort($top); $topk=$top?array_key_first($top):null;
      $gyva=false; if($r0){ $pr=wc_get_product((int)$r0['pid']); $gyva=$pr && 'publish'===$pr->get_status() && $pr->is_purchasable() && $pr->is_in_stock(); $seg=array_map('trim',explode('>',$r0['kelias'])); $kat=isset($seg[1])?$seg[0].' > '.$seg[1]:$seg[0]; }
      $pask=$r0?substr($r0['pask'],0,10):null; $fd=$k['last_food_date'];
      $rep=null; foreach($rows as $r){ if((int)$r['n']>=3 && substr($r['pask'],0,10)>=$m18){ $rep=$r; break; } }
      if($r0 && $pask>=$m12 && $gyva) $g='G1_recent_nonfood'; elseif($rep && wc_get_product((int)$rep['pid']) && wc_get_product((int)$rep['pid'])->is_in_stock()) { $g='G1r_repeat_nonfood'; $r0=$rep; $gyva=true; $pask=substr($rep['pask'],0,10); $seg=array_map('trim',explode('>',$rep['kelias'])); $kat=isset($seg[1])?$seg[0].' > '.$seg[1]:$seg[0]; }
      elseif($r0 && $pask>=$m12 && !$gyva) $g='G4_dead_product'; elseif($fd && $fd>=$m24) $g='G2_old_food'; elseif(($pask && $pask>=$m24)) $g='G2_old_nonfood'; else $g='G3_very_old';
      $wpdb->update($t,array('last_kat'=>$kat,'last_any_product_id'=>$r0?(int)$r0['pid']:null,'last_any_date'=>$pask,'same_any_orders'=>$r0?(int)$r0['n']:null,'grupe'=>$g,'top_kat'=>$topk),array('id'=>$k['id']));
      $stat[$g]=($stat[$g]??0)+1; }
    $o['stat']=$stat;
  } else {
    $o['grupes']=$wpdb->get_results("SELECT grupe, COUNT(*) n, SUM(consent) c FROM $t WHERE segmentas='generic' GROUP BY grupe ORDER BY n DESC",ARRAY_A);
    $o['g1_kat']=$wpdb->get_results("SELECT last_kat, COUNT(*) n FROM $t WHERE grupe LIKE 'G1%' GROUP BY last_kat ORDER BY n DESC LIMIT 15",ARRAY_A);
    $o['top_kat_visi_generic']=$wpdb->get_results("SELECT top_kat, COUNT(*) n FROM $t WHERE segmentas='generic' AND top_kat IS NOT NULL GROUP BY top_kat ORDER BY n DESC LIMIT 15",ARRAY_A);
    $o['g1_repeat']=$wpdb->get_results("SELECT CASE WHEN same_any_orders>=3 THEN '3+' WHEN same_any_orders=2 THEN '2' ELSE '1' END k, COUNT(*) n FROM $t WHERE grupe LIKE 'G1%' GROUP BY k",ARRAY_A);
  }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
