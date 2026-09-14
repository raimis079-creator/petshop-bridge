<?php
/** TEMP PS S1684 mb — READ-ONLY: product/variation → savikaina mapping (kur gyvena savikaina WC, kaip sujungti su ps_ist_fakt_eilutes), padengimas pagal metodą, proxy CM pagal brendą. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684mb'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1684 mb'); $wpdb->suppress_errors(true);
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
  // 3. savikainos šaltiniai (be _ps_savikaina — jo nėra): _cost_price (rankinė/importuota), ps_sources.cost_net, _vf_cost/_zb_cost, ps_partijos
  $cp=array(); foreach($wpdb->get_results("SELECT post_id id, meta_value v FROM {$p}postmeta WHERE meta_key='_cost_price' AND meta_value>0",ARRAY_A) as $r) $cp[$r['id']]=floatval($r['v']);
  $src=array(); $sc=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_sources"); $o['sources_cols']=$sc;
  foreach($wpdb->get_results("SELECT product_id id, MIN(cost_net) v FROM {$p}ps_sources WHERE cost_net>0 GROUP BY product_id",ARRAY_A) as $r) $src[$r['id']]=floatval($r['v']);
  $ds=array(); foreach($wpdb->get_results("SELECT post_id id, MIN(meta_value+0) v FROM {$p}postmeta WHERE meta_key IN('_vf_cost','_zb_cost') AND meta_value>0 GROUP BY post_id",ARRAY_A) as $r) $ds[$r['id']]=floatval($r['v']);
  $pc=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_partijos"); $o['partijos_cols']=$pc; $part=array();
  $pidc=in_array('product_id',$pc)?'product_id':(in_array('preke_id',$pc)?'preke_id':null);
  if($pidc) foreach($wpdb->get_results("SELECT $pidc id, savikaina_eur v FROM {$p}ps_partijos WHERE savikaina_eur>0 ORDER BY id DESC",ARRAY_A) as $r) if(!isset($part[$r['id']])) $part[$r['id']]=floatval($r['v']);
  $o['maps']=array('cost_price'=>count($cp),'sources'=>count($src),'vf_zb'=>count($ds),'partijos'=>count($part));
  // sku→pid dabartinis (jei istorinis preke_id nesutampa su WC ID)
  $skuPid=array(); foreach($wpdb->get_results("SELECT post_id id, meta_value sku FROM {$p}postmeta WHERE meta_key='_sku' AND meta_value<>''",ARRAY_A) as $r) $skuPid[strtolower(trim($r['sku']))]=$r['id'];
  $o['pid_is_wc']=$wpdb->get_var("SELECT COUNT(DISTINCT e.preke_id) FROM $E e JOIN {$p}posts po ON po.ID=e.preke_id AND po.post_type='product'")." / ".$wpdb->get_var("SELECT COUNT(DISTINCT preke_id) FROM $E");
  // 4. sujungimas: maisto eilutės nuo 2025-09-01
  $q=$wpdb->get_results("SELECT e.preke_id pid, e.sku, e.brendas_slug b, e.kaina_ct, e.pvm_ct, e.kiekis, e.gyvunas g FROM $E e JOIN $U u ON u.uzsakymas_id=e.uzsakymas_id WHERE u.apmoketa_at>'2025-08-31' AND u.testinis=0 AND $FOOD",ARRAY_A);
  $cov=array('n'=>0,'eur'=>0); foreach(array('cost_price','sources','vf_zb','partijos','any') as $m) $cov[$m]=array('n'=>0,'eur'=>0);
  $bm=array(); $miss=array(); $gm=array();
  foreach($q as $r){ $eur=$r['kaina_ct']/100; $net=$eur; /* kaina_ct jau be PVM (patikrinta mb2) */ $cov['n']++; $cov['eur']+=$eur;
    $pid=$r['pid']; $k=strtolower(trim($r['sku'])); if(!isset($cp[$pid])&&!isset($src[$pid])&&!isset($ds[$pid])&&!isset($part[$pid])&&isset($skuPid[$k])) $pid=$skuPid[$k];
    $sav=null;$how=null; if(isset($cp[$pid])){$sav=$cp[$pid];$how='cost_price';} elseif(isset($src[$pid])){$sav=$src[$pid];$how='sources';} elseif(isset($ds[$pid])){$sav=$ds[$pid];$how='vf_zb';} elseif(isset($part[$pid])){$sav=$part[$pid];$how='partijos';}
    if($how){ $cov[$how]['n']++; $cov[$how]['eur']+=$eur; $cov['any']['n']++; $cov['any']['eur']+=$eur; }
    foreach(array(array(&$bm,$r['b']?:'-'),array(&$gm,$r['g']?:'-')) as $pair){ $arr=&$pair[0]; $b=$pair[1]; if(!isset($arr[$b])) $arr[$b]=array('eur'=>0,'n'=>0,'net_m'=>0,'sav'=>0,'n_m'=>0); $arr[$b]['eur']+=$eur; $arr[$b]['n']++; if($how!==null&&$r['kiekis']>0){ $arr[$b]['net_m']+=$net; $arr[$b]['sav']+=$sav*$r['kiekis']; $arr[$b]['n_m']++; } unset($arr); }
    if(!$how){ $kk=$r['b'].'|'.$r['sku']; if(!isset($miss[$kk])) $miss[$kk]=array('b'=>$r['b'],'sku'=>$r['sku'],'pid'=>$r['pid'],'eur'=>0); $miss[$kk]['eur']+=$eur; }
  }
  foreach($cov as $k=>&$c) if(is_array($c)){ $c['eur']=round($c['eur']); $c['pct_eur']=$cov['eur']>0?round($c['eur']/$cov['eur']*100,1):0; } unset($c); $cov['eur']=round($cov['eur']); $o['coverage']=$cov;
  $fmt=function($m,$lim){ uasort($m,function($a,$b){return $b['eur']<=>$a['eur'];}); $out=array(); foreach(array_slice($m,0,$lim,true) as $b=>$x){ $out[$b]=array('eur'=>round($x['eur']),'n'=>$x['n'],'padengta_pct'=>$x['eur']>0?round($x['n_m']/$x['n']*100):0,'marza_pct_net'=>$x['net_m']>0?round((1-$x['sav']/$x['net_m'])*100,1):null); } return $out; };
  $o['brendai']=$fmt($bm,20); $o['gyvunai']=$fmt($gm,5);
  usort($miss,function($a,$b){return $b['eur']<=>$a['eur'];}); $o['top_miss']=array_slice($miss,0,20); foreach($o['top_miss'] as &$m) $m['eur']=round($m['eur']); unset($m);
  $o['cp_vs_price']=$wpdb->get_results("SELECT c.post_id id, c.meta_value cost, pr.meta_value price, s.meta_value sku FROM {$p}postmeta c JOIN {$p}postmeta pr ON pr.post_id=c.post_id AND pr.meta_key='_price' LEFT JOIN {$p}postmeta s ON s.post_id=c.post_id AND s.meta_key='_sku' WHERE c.meta_key='_cost_price' AND c.meta_value>0 ORDER BY RAND() LIMIT 8",ARRAY_A);
  // 5. kaip petshop-faktai skaičiuoja savikainą gyvai
  $f=WPMU_PLUGIN_DIR.'/petshop-faktai.php'; if(file_exists($f)){ $L=file($f); $hits=array(); foreach($L as $i=>$l) if(preg_match('/_cost_price|_vf_cost|_zb_cost|cost_net|savikaina_eur|savikainos_saltinis|nezinoma|pardavimai/',$l)) $hits[]=($i+1).': '.trim(substr($l,0,160)); $o['faktai_cost_lines']=array_slice($hits,0,30); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
