<?php
/** Plugin Name: TEMP PS S1700 botu recon (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1700'])||$_GET['ps_s1700']!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1700 ma'); global $wpdb; $p=$wpdb->prefix; $W="{$p}ps_web_ivykiai"; $nuo='2026-09-13';
  try{
    $o['salys']=$wpdb->get_results("SELECT salis, COUNT(DISTINCT sesija) s, COUNT(*) n FROM $W WHERE laikas>='$nuo' GROUP BY salis ORDER BY s DESC LIMIT 15",ARRAY_A);
    // sesijos profilis
    $ses=$wpdb->get_results("SELECT sesija, MAX(salis) salis, MAX(irenginys) ir, MAX(nars_seima) nars, MAX(kanalas) kan, MAX(saltinis) sal, COUNT(*) n, SUM(tipas='pageview') pv, SUM(tipas IN ('view_item','add_to_cart','search','begin_checkout','view_cart','filter')) zm, SUM(tipas='error404') e404, MAX(sutikimas) sut, MAX(prisijunges) pris, TIMESTAMPDIFF(SECOND,MIN(laikas),MAX(laikas)) trukme FROM $W WHERE laikas>='$nuo' GROUP BY sesija",ARRAY_A);
    $agg=array();
    foreach($ses as $s){ $k=$s['salis']?:'?'; if(!isset($agg[$k])) $agg[$k]=array('ses'=>0,'tik1pv'=>0,'be_zm'=>0,'su_zm'=>0,'sut'=>0,'trukme0'=>0,'mob'=>0,'pv'=>0);
      $a=&$agg[$k]; $a['ses']++; $a['pv']+=$s['pv']; if($s['n']<=1) $a['tik1pv']++; if($s['zm']>0) $a['su_zm']++; else $a['be_zm']++; if($s['sut']) $a['sut']++; if($s['trukme']==0) $a['trukme0']++; if($s['ir']==='mobile') $a['mob']++; unset($a); }
    uasort($agg,function($a,$b){return $b['ses']-$a['ses'];}); $o['profilis']=array_slice($agg,0,12,true);
    $o['viso']=count($ses);
    // LT vs ne-LT su žmogiškais įvykiais
    $lt=0;$ltzm=0;$ne=0;$nezm=0; foreach($ses as $s){ if($s['salis']==='LT'){$lt++; if($s['zm']>0)$ltzm++;} else {$ne++; if($s['zm']>0)$nezm++;} }
    $o['lt']=array('ses'=>$lt,'su_zm'=>$ltzm); $o['ne_lt']=array('ses'=>$ne,'su_zm'=>$nezm);
    // ne-LT naršyklės / kanalai
    $o['nelt_nars']=$wpdb->get_results("SELECT nars_seima, os_seima, COUNT(DISTINCT sesija) s FROM $W WHERE laikas>='$nuo' AND salis<>'LT' GROUP BY 1,2 ORDER BY s DESC LIMIT 12",ARRAY_A);
    $o['nelt_kanalai']=$wpdb->get_results("SELECT kanalas, saltinis, COUNT(DISTINCT sesija) s FROM $W WHERE laikas>='$nuo' AND salis<>'LT' GROUP BY 1,2 ORDER BY s DESC LIMIT 12",ARRAY_A);
    // ne-LT sesijos su užsakymu?
    $o['nelt_checkout']=$wpdb->get_var("SELECT COUNT(DISTINCT sesija) FROM $W WHERE laikas>='$nuo' AND salis<>'LT' AND tipas='begin_checkout'");
    $o['nelt_aciu']=$wpdb->get_var("SELECT COUNT(DISTINCT sesija) FROM $W WHERE laikas>='$nuo' AND salis<>'LT' AND pusl_tipas='aciu'");
    // pageview tik 1 ir trukmė 0 — LT
    $o['lt_1pv']=$wpdb->get_var("SELECT COUNT(*) FROM (SELECT sesija FROM $W WHERE laikas>='$nuo' AND salis='LT' GROUP BY sesija HAVING COUNT(*)=1) x");
    // kaip nustatoma šalis — rinkiklio kodas
    $src=file_get_contents(WP_CONTENT_DIR.'/mu-plugins/petshop-analitika.php'); preg_match_all('/.{0,120}(salis|COUNTRY|GEOIP|CF-IPCountry|country).{0,160}/i',$src,$m); $o['salis_kodas']=array_slice(array_unique($m[0]),0,8);
    preg_match_all('/.{0,100}(bot|crawl|spider).{0,120}/i',$src,$m2); $o['bot_kodas']=array_slice(array_unique($m2[0]),0,8);
    // ses per dieną LT vs ne-LT
    $o['dienos']=$wpdb->get_results("SELECT DATE(laikas) d, SUM(salis='LT') lt_iv, COUNT(DISTINCT IF(salis='LT',sesija,NULL)) lt_ses, COUNT(DISTINCT IF(salis<>'LT',sesija,NULL)) ne_ses FROM $W WHERE laikas>='$nuo' GROUP BY d",ARRAY_A);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
