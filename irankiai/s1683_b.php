<?php
/** TEMP PS S1683 b — READ-ONLY: V12 mechanika (1→2→3→4 konversijos, intervalai, AOV pagal etapą, šuo/katė, brendas), grįžimo hazard kreivė, top klientai vs populiacija, brendų marža su dabartine savikaina. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683b'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1683 b'); $wpdb->suppress_errors(true);
  $U="{$p}ps_ist_fakt_uzsakymai"; $E="{$p}ps_ist_fakt_eilutes";
  $o['e_cols']=$wpdb->get_col("SHOW COLUMNS FROM $E");
  $FOOD="(LOWER(e.kategoriju_kelias) LIKE '%maist%' OR LOWER(e.kategoriju_kelias) LIKE '%skan%' OR LOWER(e.kategoriju_kelias) LIKE '%konserv%')";
  $rows=$wpdb->get_results("SELECT u.uzsakymas_id id, COALESCE(NULLIF(u.klientas_email_hash,''),CONCAT('id',u.klientas_id)) kl, DATE(u.apmoketa_at) d, u.viso_ct, u.sandeliai, u.vezejai, u.misrus, SUM(CASE WHEN $FOOD THEN e.kaina_ct ELSE 0 END) maist_ct, COUNT(DISTINCT e.sku) sku_n, SUBSTRING_INDEX(GROUP_CONCAT(CASE WHEN $FOOD THEN e.brendas_slug END ORDER BY e.kaina_ct DESC),',',1) brendas, SUBSTRING_INDEX(GROUP_CONCAT(CASE WHEN $FOOD THEN e.gyvunas END ORDER BY e.kaina_ct DESC),',',1) gyv, SUBSTRING_INDEX(GROUP_CONCAT(CASE WHEN $FOOD THEN e.sku END ORDER BY e.kaina_ct DESC),',',1) sku, SUBSTRING_INDEX(GROUP_CONCAT(CASE WHEN $FOOD THEN e.pavadinimas_tuo_metu END ORDER BY e.kaina_ct DESC),',',1) pav, SUM(LOWER(e.kategoriju_kelias) LIKE '%konserv%' OR LOWER(e.pavadinimas_tuo_metu) LIKE '%konserv%' OR e.pavadinimas_tuo_metu LIKE '% g' OR e.pavadinimas_tuo_metu LIKE '%400g%' OR e.pavadinimas_tuo_metu LIKE '%800g%') slap_n FROM $U u JOIN $E e ON e.uzsakymas_id=u.uzsakymas_id WHERE u.apmoketa_at IS NOT NULL AND u.testinis=0 GROUP BY u.uzsakymas_id HAVING maist_ct>0 ORDER BY kl, d",ARRAY_A);
  $K=array(); foreach($rows as $r) $K[$r['kl']][]=$r;
  $LIM='2025-08-31'; // pirmas pirkimas iki čia → 12 mėn. stebėta
  $agg=function(){ return array('kl'=>0,'s2'=>0,'s3'=>0,'s4'=>0,'iv12'=>array(),'iv23'=>array(),'iv34'=>array(),'aov1'=>0,'aov2'=>array(),'aov3p'=>array(),'v12'=>0); };
  $seg=array('visi'=>$agg(),'suo'=>$agg(),'kate'=>$agg()); $br=array(); $haz=array('visi'=>array(),'suo'=>array(),'kate'=>array(),'josera'=>array(),'exclusion'=>array(),'animonda'=>array());
  $top=array(); $pop=array();
  $feat=function($L,$n){ $f=$L[0]; $x=array('n'=>1,'gyv_'.($f['gyv']?:'-')=>1,'br_'.($f['brendas']?:'-')=>1,'aov1'=>$f['viso_ct'],'food_pct'=>$f['maist_ct']/$f['viso_ct'],'sku_n'=>$f['sku_n'],'slap'=>$f['slap_n']>0?1:0,'aov1_60p'=>$f['viso_ct']>=6000?1:0,'aov1_30m'=>$f['viso_ct']<3000?1:0,'av'=>(strpos($f['sandeliai'],'av')!==false||strpos($f['sandeliai'],'AV')!==false)?1:0,'misrus'=>$f['misrus']?1:0,'pastomatas'=>(stripos($f['vezejai'],'pick')!==false||stripos($f['vezejai'],'pastom')!==false||stripos($f['vezejai'],'lp')!==false)?1:0);
    if($n>=2){ $x['d12']=(strtotime($L[1]['d'])-strtotime($f['d']))/86400; $x['d12_60']=$x['d12']<=60?1:0; $x['same_br']=($L[1]['brendas']==$f['brendas'])?1:0; $x['aov2']=$L[1]['viso_ct']; $x['n2']=1; } return $x; };
  foreach($K as $kl=>$L){ $f=$L[0]; if($f['d']<'2024-01-01') continue; $n=count($L); $fd=strtotime($f['d']);
    $g=$f['gyv']=='suo'?'suo':($f['gyv']=='kate'?'kate':null); $b=$f['brendas']?:'-';
    // hazard: dienos iki 2-o (tik pilnai stebėti 365 d.)
    if($f['d']<=$LIM){ $dd=$n>=2?(strtotime($L[1]['d'])-$fd)/86400:9999; $bk=$dd>365?'ne':(string)(10*floor($dd/10));
      foreach(array_filter(array('visi',$g,in_array($b,array('josera','exclusion','animonda'))?$b:null)) as $h){ if(!isset($haz[$h][$bk]))$haz[$h][$bk]=0; $haz[$h][$bk]++; }
      // etapai
      $targets=array('visi'); if($g)$targets[]=$g; if(!isset($br[$b]))$br[$b]=$agg();
      $in12=array(); foreach($L as $x){ if((strtotime($x['d'])-$fd)/86400<=365) $in12[]=$x; } $m=count($in12); $v12=0; foreach($in12 as $x)$v12+=$x['viso_ct'];
      foreach($targets as $t){ $S=&$seg[$t]; $S['kl']++; $S['aov1']+=$f['viso_ct']; $S['v12']+=$v12; if($m>=2){$S['s2']++; $S['iv12'][]=(strtotime($in12[1]['d'])-$fd)/86400; $S['aov2'][]=$in12[1]['viso_ct'];} if($m>=3){$S['s3']++; $S['iv23'][]=(strtotime($in12[2]['d'])-strtotime($in12[1]['d']))/86400; for($i=2;$i<$m;$i++)$S['aov3p'][]=$in12[$i]['viso_ct'];} if($m>=4){$S['s4']++; $S['iv34'][]=(strtotime($in12[3]['d'])-strtotime($in12[2]['d']))/86400;} unset($S); }
      $S=&$br[$b]; $S['kl']++; $S['v12']+=$v12; if($m>=2)$S['s2']++; if($m>=3)$S['s3']++; unset($S);
      // top vs populiacija (pirmas 2024-01…2025-08, top = ≥5 užs. per 12 mėn.)
      $x=$feat($in12,$m); $x['uzs12']=$m; $x['v12']=$v12; $dst=$m>=5?'top':($m==1?'vien':'vid'); foreach($x as $k=>$v){ if(!isset($pop[$dst][$k]))$pop[$dst][$k]=0; $pop[$dst][$k]+=$v; }
    }
  }
  $stat=function($a){ if(!$a) return null; sort($a); $n=count($a); $le60=0; foreach($a as $v) if($v<=60)$le60++; return array('n'=>$n,'med'=>$a[intval($n/2)],'vid'=>round(array_sum($a)/$n),'le60'=>round($le60/$n*100)); };
  foreach($seg as $t=>$S){ if(!$S['kl']) continue; $o['etapai'][$t]=array('kl'=>$S['kl'],'p2'=>round($S['s2']/$S['kl']*100,1),'p3_of_2'=>$S['s2']?round($S['s3']/$S['s2']*100,1):null,'p4_of_3'=>$S['s3']?round($S['s4']/$S['s3']*100,1):null,'iv12'=>$stat($S['iv12']),'iv23'=>$stat($S['iv23']),'iv34'=>$stat($S['iv34']),'aov1'=>round($S['aov1']/$S['kl']/100,1),'aov2'=>$S['aov2']?round(array_sum($S['aov2'])/count($S['aov2'])/100,1):null,'aov3p'=>$S['aov3p']?round(array_sum($S['aov3p'])/count($S['aov3p'])/100,1):null,'v12'=>round($S['v12']/$S['kl']/100,1)); }
  foreach($haz as $h=>$H){ ksort($H,SORT_NATURAL); $o['hazard'][$h]=$H; }
  // brendai + savikaina (dabartinė WC, SKU → _ps_savikaina/_wc_cog_cost), marža % per brendą pagal istorines eilutes
  $sav=array(); foreach($wpdb->get_results("SELECT s.meta_value sku, MAX(c.meta_value) sav FROM {$p}postmeta s JOIN {$p}postmeta c ON c.post_id=s.post_id AND c.meta_key IN('_ps_savikaina','_wc_cog_cost') WHERE s.meta_key='_sku' AND s.meta_value<>'' AND c.meta_value>0 GROUP BY s.meta_value",ARRAY_A) as $r) $sav[$r['sku']]=floatval($r['sav']);
  $o['sav_sku_n']=count($sav);
  $q=$wpdb->get_results("SELECT e.brendas_slug b, e.sku, SUM(e.kaina_ct) kaina_ct, SUM(e.kiekis) kiekis, COUNT(*) n FROM $E e JOIN $U u ON u.uzsakymas_id=e.uzsakymas_id WHERE u.apmoketa_at>'2025-08-31' AND $FOOD GROUP BY b, e.sku",ARRAY_A);
  $bm=array(); foreach($q as $r){ $b=$r['b']?:'-'; if(!isset($bm[$b]))$bm[$b]=array('eur'=>0,'eur_su_sav'=>0,'sav'=>0,'n'=>0); $bm[$b]['eur']+=$r['kaina_ct']/100; $bm[$b]['n']+=$r['n']; if(isset($sav[$r['sku']])&&$r['kiekis']>0){ $bm[$b]['eur_su_sav']+=$r['kaina_ct']/100; $bm[$b]['sav']+=$sav[$r['sku']]*$r['kiekis']; } }
  arsort($bm); foreach(array_slice($bm,0,14,true) as $b=>$x){ $o['brend_marza'][]=array('b'=>$b,'eur12'=>round($x['eur']),'padengta_pct'=>$x['eur']?round($x['eur_su_sav']/$x['eur']*100):0,'marza_pct'=>$x['eur_su_sav']?round(($x['eur_su_sav']/1.21-$x['sav'])/($x['eur_su_sav']/1.21)*100,1):null,'kl'=>isset($br[$b])?$br[$b]['kl']:null,'p2'=>isset($br[$b])&&$br[$b]['kl']?round($br[$b]['s2']/$br[$b]['kl']*100):null,'p3_of_2'=>isset($br[$b])&&$br[$b]['s2']?round($br[$b]['s3']/$br[$b]['s2']*100):null,'v12'=>isset($br[$b])&&$br[$b]['kl']?round($br[$b]['v12']/$br[$b]['kl']/100):null); }
  foreach($pop as $dst=>$x){ $n=$x['n']; $n2=isset($x['n2'])?$x['n2']:0; $r=array('kl'=>$n); foreach($x as $k=>$v){ if(in_array($k,array('n','n2'))) continue; $den=in_array($k,array('d12','d12_60','same_br','aov2'))?max(1,$n2):$n;
      $r[$k]=in_array($k,array('aov1','aov2','v12'))?round($v/$den/100,1):(in_array($k,array('d12','sku_n','uzs12'))?round($v/$den,1):round($v/$den*100)); } $o['top_vs_pop'][$dst]=$r; }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
