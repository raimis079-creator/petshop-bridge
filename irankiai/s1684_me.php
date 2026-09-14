<?php
/** TEMP PS S1684 me — READ-ONLY: produkto ciklų lentelė (brendas × pakuotė → 2-o pirkimo intervalas) iš ps_ist, istorinis R_due baseline, R60 palyginimui; Ads offline įkėlimo būklė serveryje. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684me'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1684 me'); $wpdb->suppress_errors(true);
  $U="{$p}ps_ist_fakt_uzsakymai"; $E="{$p}ps_ist_fakt_eilutes";
  $FOOD="(LOWER(e.kategoriju_kelias) LIKE '%maist%' OR LOWER(e.kategoriju_kelias) LIKE '%konserv%')";
  $rows=$wpdb->get_results("SELECT u.uzsakymas_id id, COALESCE(NULLIF(u.klientas_email_hash,''),CONCAT('id',u.klientas_id)) kl, DATE(u.apmoketa_at) d, e.brendas_slug b, e.gyvunas g, e.pavadinimas_tuo_metu pav, e.svoris_g sv, e.kiekis k, e.kaina_ct FROM $U u JOIN $E e ON e.uzsakymas_id=u.uzsakymas_id WHERE u.apmoketa_at>='2024-01-01' AND u.testinis=0 AND $FOOD ORDER BY kl, u.apmoketa_at",ARRAY_A);
  $sz=function($r){ $pav=mb_strtolower($r['pav']); $g=intval($r['sv']); if($g<=0){ if(preg_match('/(\d+[.,]?\d*)\s*kg/u',$pav,$m)) $g=floatval(str_replace(',','.',$m[1]))*1000; elseif(preg_match('/(\d+)\s*g\b/u',$pav,$m)) $g=intval($m[1]); }
    $g=$g*max(1,intval($r['k'])); if($g<=0) return 'nezinoma'; if($g<1500) return 'iki1.5kg'; if($g<5000) return '1.5-5kg'; if($g<11000) return '5-11kg'; return '11kg+'; };
  // per klientą: užsakymų seka pagal brendą (pagrindinis maisto brendas užsakyme)
  $ord=array(); foreach($rows as $r){ $key=$r['kl'].'|'.$r['id']; if(!isset($ord[$key])) $ord[$key]=array('kl'=>$r['kl'],'d'=>$r['d'],'br'=>array(),'g'=>$r['g'],'eur'=>0); $ord[$key]['eur']+=$r['kaina_ct']; $bk=$r['b'].'|'.$sz($r); $ord[$key]['br'][$bk]=($ord[$key]['br'][$bk]??0)+$r['kaina_ct']; }
  $byKl=array(); foreach($ord as $x){ arsort($x['br']); $x['top']=key($x['br']); $byKl[$x['kl']][]=$x; }
  $int=array(); $first=array(); 
  foreach($byKl as $kl=>$L){ usort($L,function($a,$b){return strcmp($a['d'],$b['d']);}); $n=count($L);
    for($i=0;$i<$n-1;$i++){ $a=$L[$i]; $b=$L[$i+1]; $dd=(strtotime($b['d'])-strtotime($a['d']))/86400; if($dd<=0||$dd>365) continue; $int[$a['top']][]=$dd; }
    $f=$L[0]; if($f['d']>='2024-01-01' && $f['d']<='2025-12-31'){ $second=null; for($i=1;$i<$n;$i++){ $dd=(strtotime($L[$i]['d'])-strtotime($f['d']))/86400; if($dd>0){$second=$dd;break;} } $first[]=array('top'=>$f['top'],'g'=>$f['g'],'d'=>$f['d'],'s'=>$second); } }
  $pct=function($a,$q){ sort($a); $i=($q/100)*(count($a)-1); $lo=floor($i); $hi=ceil($i); return round($a[$lo]+($a[$hi]-$a[$lo])*($i-$lo)); };
  $tbl=array(); foreach($int as $k=>$a){ if(count($a)<15) continue; $tbl[$k]=array('n'=>count($a),'p25'=>$pct($a,25),'med'=>$pct($a,50),'p75'=>$pct($a,75),'due'=>$pct($a,50)); }
  uasort($tbl,function($a,$b){return $b['n']<=>$a['n'];}); $o['ciklai']=array_slice($tbl,0,30,true);
  // brendo lygio (be pakuotės)
  $intb=array(); foreach($int as $k=>$a){ $b=explode('|',$k)[0]; foreach($a as $v) $intb[$b][]=$v; } $tb=array(); foreach($intb as $b=>$a){ if(count($a)<20) continue; $tb[$b]=array('n'=>count($a),'p25'=>$pct($a,25),'med'=>$pct($a,50),'p75'=>$pct($a,75)); } uasort($tb,function($a,$b){return $b['n']<=>$a['n'];}); $o['ciklai_brendas']=array_slice($tb,0,15,true);
  // R_due baseline: pirmi užsakymai 2024–2025; due = brendas×pakuotė mediana (fallback brendas, fallback 45), tolerancija +14 d.; R60 palyginimui
  $tot=0;$rdue=0;$r60=0;$r90=0; $byB=array();
  foreach($first as $f){ $k=$f['top']; $b=explode('|',$k)[0]; $due=isset($tbl[$k])?$tbl[$k]['med']:(isset($tb[$b])?$tb[$b]['med']:45); $win=$due+14; $tot++; $hit=$f['s']!==null&&$f['s']<=$win; if($hit)$rdue++; if($f['s']!==null&&$f['s']<=60)$r60++; if($f['s']!==null&&$f['s']<=90)$r90++;
    if(!isset($byB[$b]))$byB[$b]=array('n'=>0,'rdue'=>0,'r60'=>0,'due_vid'=>0); $byB[$b]['n']++; if($hit)$byB[$b]['rdue']++; if($f['s']!==null&&$f['s']<=60)$byB[$b]['r60']++; $byB[$b]['due_vid']+=$due; }
  $o['R_due_baseline']=array('pirmu_uzs'=>$tot,'R_due'=>round($rdue/$tot*100,1),'R60'=>round($r60/$tot*100,1),'R90'=>round($r90/$tot*100,1),'tolerancija_d'=>14);
  uasort($byB,function($a,$b){return $b['n']<=>$a['n'];}); foreach(array_slice($byB,0,10,true) as $b=>$x) $o['R_due_brendas'][$b]=array('n'=>$x['n'],'due_vid'=>round($x['due_vid']/$x['n']),'R_due'=>round($x['rdue']/$x['n']*100,1),'R60'=>round($x['r60']/$x['n']*100,1));
  // Ads offline būklė
  foreach(array('ps_ads_paskutinis','ps_ads_recon','ps_ads_offline_paskutinis') as $k) $o['ads_opt'][$k]=get_option($k,null);
  $o['ads_order_meta']=$wpdb->get_results("SELECT meta_key k, COUNT(*) n, MAX(meta_value) pask FROM {$p}wc_orders_meta WHERE meta_key LIKE '%ads%' OR meta_key LIKE '%offline%' OR meta_key LIKE '%gclid%' GROUP BY k",ARRAY_A);
  $o['ads_cron']=array(); foreach((array)_get_cron_array() as $ts=>$hooks) foreach($hooks as $h=>$x) if(stripos($h,'ads')!==false||stripos($h,'reklam')!==false||stripos($h,'offline')!==false) $o['ads_cron'][]=array('h'=>$h,'kada'=>date('Y-m-d H:i',$ts));
  $o['ads_failai']=array(); foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $s=file_get_contents($f); if(stripos($s,'offline')!==false&&stripos($s,'gclid')!==false) $o['ads_failai'][basename($f)]=md5($s); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
