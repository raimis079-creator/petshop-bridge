<?php
/** TEMP PS S1683 c — READ-ONLY: V12 pagal antro pirkimo laiką (d12 grupės), R60 pagal brendą/gyvūną, mėn. dinamika (1→2→3→4 konversijos, intervalai, AOV pagal etapą, šuo/katė, brendas), grįžimo hazard kreivė, top klientai vs populiacija, brendų marža su dabartine savikaina. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683c'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1683 c'); $wpdb->suppress_errors(true);
  $U="{$p}ps_ist_fakt_uzsakymai"; $E="{$p}ps_ist_fakt_eilutes";
  $o['e_cols']=$wpdb->get_col("SHOW COLUMNS FROM $E");
  $FOOD="(LOWER(e.kategoriju_kelias) LIKE '%maist%' OR LOWER(e.kategoriju_kelias) LIKE '%skan%' OR LOWER(e.kategoriju_kelias) LIKE '%konserv%')";
  $rows=$wpdb->get_results("SELECT u.uzsakymas_id id, COALESCE(NULLIF(u.klientas_email_hash,''),CONCAT('id',u.klientas_id)) kl, DATE(u.apmoketa_at) d, u.viso_ct, u.sandeliai, u.vezejai, u.misrus, SUM(CASE WHEN $FOOD THEN e.kaina_ct ELSE 0 END) maist_ct, COUNT(DISTINCT e.sku) sku_n, SUBSTRING_INDEX(GROUP_CONCAT(CASE WHEN $FOOD THEN e.brendas_slug END ORDER BY e.kaina_ct DESC),',',1) brendas, SUBSTRING_INDEX(GROUP_CONCAT(CASE WHEN $FOOD THEN e.gyvunas END ORDER BY e.kaina_ct DESC),',',1) gyv, SUBSTRING_INDEX(GROUP_CONCAT(CASE WHEN $FOOD THEN e.sku END ORDER BY e.kaina_ct DESC),',',1) sku, SUBSTRING_INDEX(GROUP_CONCAT(CASE WHEN $FOOD THEN e.pavadinimas_tuo_metu END ORDER BY e.kaina_ct DESC),',',1) pav, SUM(LOWER(e.kategoriju_kelias) LIKE '%konserv%' OR LOWER(e.pavadinimas_tuo_metu) LIKE '%konserv%' OR e.pavadinimas_tuo_metu LIKE '% g' OR e.pavadinimas_tuo_metu LIKE '%400g%' OR e.pavadinimas_tuo_metu LIKE '%800g%') slap_n FROM $U u JOIN $E e ON e.uzsakymas_id=u.uzsakymas_id WHERE u.apmoketa_at IS NOT NULL AND u.testinis=0 GROUP BY u.uzsakymas_id HAVING maist_ct>0 ORDER BY kl, d",ARRAY_A);
  $K=array(); foreach($rows as $r) $K[$r['kl']][]=$r;
  $LIM='2025-08-31'; $G=array(); $BR=array(); $MEN=array();
  $bk=function($d){ return $d===null?'ne':($d<=30?'≤30':($d<=60?'31-60':($d<=90?'61-90':($d<=180?'91-180':'>180')))); };
  foreach($K as $kl=>$L){ $f=$L[0]; if($f['d']<'2024-01-01') continue; $fd=strtotime($f['d']); $n=count($L);
    $d12=$n>=2?(strtotime($L[1]['d'])-$fd)/86400:null; $g=$f['gyv']=='suo'?'suo':($f['gyv']=='kate'?'kate':'-'); $b=$f['brendas']?:'-';
    // mėnesio R60 dinamika (pirmas iki 2026-06)
    if($f['d']<='2026-06-30'){ $m=substr($f['d'],0,7); if(!isset($MEN[$m]))$MEN[$m]=array('kl'=>0,'r60'=>0); $MEN[$m]['kl']++; if($d12!==null&&$d12<=60)$MEN[$m]['r60']++; }
    if($f['d']>$LIM) continue;
    $in12=array(); foreach($L as $x){ if((strtotime($x['d'])-$fd)/86400<=365) $in12[]=$x; } $m=count($in12); $v12=0; foreach($in12 as $x)$v12+=$x['viso_ct'];
    $in24=0; $v24=0; foreach($L as $x){ if((strtotime($x['d'])-$fd)/86400<=730){$in24++;$v24+=$x['viso_ct'];} }
    foreach(array('visi',$g) as $t){ $k=$bk($d12); if(!isset($G[$t][$k]))$G[$t][$k]=array('kl'=>0,'uzs12'=>0,'v12'=>0,'top'=>0,'v24'=>0,'uzs24'=>0); $x=&$G[$t][$k]; $x['kl']++; $x['uzs12']+=$m; $x['v12']+=$v12; if($m>=5)$x['top']++; $x['v24']+=$v24; $x['uzs24']+=$in24; unset($x); }
    if(!isset($BR[$b]))$BR[$b]=array('kl'=>0,'r60'=>0,'r30'=>0,'v12_60'=>0,'n60'=>0,'v12_ne'=>0,'nne'=>0); $x=&$BR[$b]; $x['kl']++; if($d12!==null&&$d12<=60){$x['r60']++; $x['v12_60']+=$v12; $x['n60']++;} if($d12!==null&&$d12<=30)$x['r30']++; if($d12===null){$x['v12_ne']+=$v12;$x['nne']++;} unset($x);
  }
  foreach($G as $t=>$B){ foreach($B as $k=>$x) $o['d12_grupes'][$t][$k]=array('kl'=>$x['kl'],'pct'=>0,'uzs12'=>round($x['uzs12']/$x['kl'],2),'v12'=>round($x['v12']/$x['kl']/100),'top_pct'=>round($x['top']/$x['kl']*100),'uzs24'=>round($x['uzs24']/$x['kl'],2),'v24'=>round($x['v24']/$x['kl']/100)); $tot=0; foreach($B as $x)$tot+=$x['kl']; foreach($B as $k=>$x)$o['d12_grupes'][$t][$k]['pct']=round($x['kl']/$tot*100,1); }
  uasort($BR,function($a,$b){return $b['kl']-$a['kl'];}); foreach(array_slice($BR,0,12,true) as $b=>$x) $o['r60_brendas'][]=array('b'=>$b,'kl'=>$x['kl'],'r30'=>round($x['r30']/$x['kl']*100),'r60'=>round($x['r60']/$x['kl']*100),'v12_jei60'=>$x['n60']?round($x['v12_60']/$x['n60']/100):null,'v12_jei_ne'=>$x['nne']?round($x['v12_ne']/$x['nne']/100):null);
  ksort($MEN); foreach($MEN as $m=>$x) $o['r60_men'][]=array('m'=>$m,'kl'=>$x['kl'],'r60'=>round($x['r60']/$x['kl']*100));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
