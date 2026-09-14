<?php
/** TEMP PS S1684 b — READ-ONLY: product/variation → savikaina mapping (kur gyvena savikaina WC, kaip sujungti su ps_ist_fakt_eilutes), padengimas pagal metodą, proxy CM pagal brendą. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684b'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1684 b'); $wpdb->suppress_errors(true);
  $E="{$p}ps_ist_fakt_eilutes"; $U="{$p}ps_ist_fakt_uzsakymai"; $F="{$p}ps_fakt_eilutes";
  $FOOD="(LOWER(e.kategoriju_kelias) LIKE '%maist%' OR LOWER(e.kategoriju_kelias) LIKE '%skan%' OR LOWER(e.kategoriju_kelias) LIKE '%konserv%')";
  // 1. kur gyvena savikaina
  $o['meta_keys']=$wpdb->get_results("SELECT m.meta_key k, po.post_type t, COUNT(*) n, SUM(m.meta_value>0) n_pos FROM {$p}postmeta m JOIN {$p}posts po ON po.ID=m.post_id WHERE (m.meta_key LIKE '%savik%' OR m.meta_key LIKE '%cost%' OR m.meta_key LIKE '%pirk%' OR m.meta_key LIKE '%gtin%' OR m.meta_key LIKE '%unique_id%') GROUP BY m.meta_key, po.post_type ORDER BY n DESC",ARRAY_A);
  $o['tables_sav']=$wpdb->get_col("SHOW TABLES LIKE '{$p}ps_%'");
  foreach($o['tables_sav'] as $t){ $c=$wpdb->get_col("SHOW COLUMNS FROM $t"); $hit=array_filter($c,function($x){return stripos($x,'savik')!==false||stripos($x,'cost')!==false;}); if($hit) $o['tables_with_cost'][$t]=array_values($hit); }
  // 2. istorinių eilučių id/sku/gtin pobūdis
  $o['ist_sample']=$wpdb->get_results("SELECT e.preke_id, e.variacija_id, e.sku, e.gtin, e.savikainos_saltinis, e.savikaina_ct FROM $E e JOIN $U u ON u.uzsakymas_id=e.uzsakymas_id WHERE u.apmoketa_at>'2026-06-01' AND $FOOD ORDER BY RAND() LIMIT 8",ARRAY_A);
  $o['ist_sav_fill']=$wpdb->get_row("SELECT COUNT(*) n, SUM(e.savikaina_ct>0) su_sav, SUM(e.preke_id>0) su_pid, SUM(e.variacija_id>0) su_vid, SUM(e.sku<>'') su_sku, SUM(e.gtin<>'') su_gtin FROM $E e JOIN $U u ON u.uzsakymas_id=e.uzsakymas_id WHERE u.apmoketa_at>'2025-08-31' AND $FOOD",ARRAY_A);
  $o['fakt_sav_fill']=$wpdb->get_row("SELECT COUNT(*) n, SUM(savikaina_ct>0) su_sav, GROUP_CONCAT(DISTINCT savikainos_saltinis) salt FROM $F",ARRAY_A);
  $o['fakt_cols']=$wpdb->get_col("SHOW COLUMNS FROM $F");
  // 3. WC prekės su savikaina: id, parent, sku, gtin
  $rows=$wpdb->get_results("SELECT po.ID id, po.post_parent parent, po.post_type t, s.meta_value sku, g.meta_value gtin, c.meta_key ck, c.meta_value sav FROM {$p}posts po JOIN {$p}postmeta c ON c.post_id=po.ID AND c.meta_key IN('_ps_savikaina','_wc_cog_cost','_alg_wc_cog_cost','_savikaina') AND c.meta_value>0 LEFT JOIN {$p}postmeta s ON s.post_id=po.ID AND s.meta_key='_sku' LEFT JOIN {$p}postmeta g ON g.post_id=po.ID AND g.meta_key IN('_global_unique_id','_gtin','_wc_gtin') WHERE po.post_type IN('product','product_variation')",ARRAY_A);
  $byId=array(); $bySku=array(); $byGtin=array(); $byParent=array();
  foreach($rows as $r){ $v=floatval($r['sav']); $byId[$r['id']]=$v; if($r['sku']!=='' && $r['sku']!==null) $bySku[strtolower(trim($r['sku']))]=$v; if($r['gtin']) $byGtin[trim($r['gtin'])]=$v; if($r['parent']>0){ if(!isset($byParent[$r['parent']])) $byParent[$r['parent']]=array(); $byParent[$r['parent']][]=$v; } }
  $o['wc_cost']=array('rows'=>count($rows),'ids'=>count($byId),'skus'=>count($bySku),'gtins'=>count($byGtin),'keys'=>array_count_values(array_column($rows,'ck')),'types'=>array_count_values(array_column($rows,'t')));
  // 4. sujungimas su istorinėmis maisto eilutėmis nuo 2025-09-01
  $q=$wpdb->get_results("SELECT e.preke_id pid, e.variacija_id vid, e.sku, e.gtin, e.brendas_slug b, e.kaina_ct, e.kiekis FROM $E e JOIN $U u ON u.uzsakymas_id=e.uzsakymas_id WHERE u.apmoketa_at>'2025-08-31' AND u.testinis=0 AND $FOOD",ARRAY_A);
  $cov=array('n'=>0,'eur'=>0); foreach(array('vid','pid','sku','gtin','parent_avg','any') as $m) $cov[$m]=array('n'=>0,'eur'=>0);
  $bm=array(); $miss=array();
  foreach($q as $r){ $eur=$r['kaina_ct']/100; $cov['n']++; $cov['eur']+=$eur; $sav=null; $how=null;
    if($r['vid']>0 && isset($byId[$r['vid']])){$sav=$byId[$r['vid']];$how='vid';}
    elseif($r['pid']>0 && isset($byId[$r['pid']])){$sav=$byId[$r['pid']];$how='pid';}
    elseif($r['sku']!=='' && isset($bySku[strtolower(trim($r['sku']))])){$sav=$bySku[strtolower(trim($r['sku']))];$how='sku';}
    elseif($r['gtin']!=='' && isset($byGtin[trim($r['gtin'])])){$sav=$byGtin[trim($r['gtin'])];$how='gtin';}
    elseif($r['pid']>0 && isset($byParent[$r['pid']])){$sav=array_sum($byParent[$r['pid']])/count($byParent[$r['pid']]);$how='parent_avg';}
    if($how){ $cov[$how]['n']++; $cov[$how]['eur']+=$eur; $cov['any']['n']++; $cov['any']['eur']+=$eur; }
    $b=$r['b']?:'-'; if(!isset($bm[$b])) $bm[$b]=array('eur'=>0,'n'=>0,'eur_m'=>0,'sav'=>0,'n_m'=>0);
    $bm[$b]['eur']+=$eur; $bm[$b]['n']++; if($how!==null && $r['kiekis']>0){ $bm[$b]['eur_m']+=$eur; $bm[$b]['sav']+=$sav*$r['kiekis']; $bm[$b]['n_m']++; }
    else { $k=$b.'|'.$r['sku']; if(!isset($miss[$k])) $miss[$k]=array('b'=>$b,'sku'=>$r['sku'],'pid'=>$r['pid'],'eur'=>0); $miss[$k]['eur']+=$eur; }
  }
  foreach($cov as $k=>&$c) if(is_array($c)){ $c['eur']=round($c['eur']); $c['pct_eur']=$cov['eur']>0?round($c['eur']/$cov['eur']*100,1):0; } unset($c); $cov['eur']=round($cov['eur']);
  $o['coverage']=$cov;
  uasort($bm,function($a,$b){return $b['eur']<=>$a['eur'];}); $out=array();
  foreach(array_slice($bm,0,20,true) as $b=>$x){ $out[$b]=array('eur'=>round($x['eur']),'n'=>$x['n'],'padengta_pct'=>$x['eur']>0?round($x['eur_m']/$x['eur']*100):0,'marza_pct'=>$x['eur_m']>0?round((1-$x['sav']/($x['eur_m']/1.21))*100,1):null,'marza_pct_su_pvm'=>$x['eur_m']>0?round((1-$x['sav']/$x['eur_m'])*100,1):null); }
  $o['brendai']=$out;
  usort($miss,function($a,$b){return $b['eur']<=>$a['eur'];}); $o['top_miss']=array_slice($miss,0,25);
  // 5. ar _ps_savikaina su PVM ar be? palyginti su _price keliems
  $o['sav_vs_price']=$wpdb->get_results("SELECT po.ID id, c.meta_value sav, pr.meta_value price, s.meta_value sku FROM {$p}posts po JOIN {$p}postmeta c ON c.post_id=po.ID AND c.meta_key='_ps_savikaina' AND c.meta_value>0 JOIN {$p}postmeta pr ON pr.post_id=po.ID AND pr.meta_key='_price' LEFT JOIN {$p}postmeta s ON s.post_id=po.ID AND s.meta_key='_sku' ORDER BY RAND() LIMIT 8",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
