<?php
/** TEMP PS S1684 ma — READ-ONLY: vartai A — kanalai nuo T-0 (ps_fakt_uzsakymai), nauji vs grįžę pagal kanalą, ps_fakt_reklama spend/konversijos, pristatymo subsidija, istorinis Ads spend jei yra. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684ma'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1684 ma'); $wpdb->suppress_errors(true);
  $U="{$p}ps_fakt_uzsakymai"; $R="{$p}ps_fakt_reklama"; $IU="{$p}ps_ist_fakt_uzsakymai";
  $o['u_cols']=$wpdb->get_col("SHOW COLUMNS FROM $U"); $o['r_cols']=$wpdb->get_col("SHOW COLUMNS FROM $R");
  $kan=array(); foreach($o['u_cols'] as $c) if(preg_match('/kanal|gclid|utm|saltinis|referer|medium|campaign/i',$c)) $kan[]=$c; $o['kanalo_stulpeliai']=$kan;
  // seni klientai (istorija) pagal email hash
  $ist=array(); foreach($wpdb->get_col("SELECT DISTINCT klientas_email_hash FROM $IU WHERE klientas_email_hash<>''") as $h) $ist[$h]=1; $o['ist_klientu']=count($ist);
  $kc=in_array('kanalas_pirmas',$o['u_cols'])?'kanalas_pirmas':(in_array('kanalas',$o['u_cols'])?'kanalas':null);
  $sel="uzsakymas_id id, DATE(apmoketa_at) d, viso_ct, klientas_email_hash h, klientas_id kid, ".($kc?"$kc kan":"'' kan").", ".(in_array('gclid',$o['u_cols'])?'gclid':"''")." gclid, ".(in_array('pristatymas_ct',$o['u_cols'])?'pristatymas_ct':'0')." pr_ct, ".(in_array('pristatymas_savikaina_ct',$o['u_cols'])?'pristatymas_savikaina_ct':'0')." pr_sav, ".(in_array('kanalas_paskutinis',$o['u_cols'])?'kanalas_paskutinis':"''")." kan2";
  $rows=$wpdb->get_results("SELECT $sel FROM $U WHERE apmoketa_at IS NOT NULL AND testinis=0 ORDER BY apmoketa_at",ARRAY_A);
  $seen=array(); $k=array(); $dien=array(); $o['uzs_n']=count($rows); $o['nuo']=$rows?$rows[0]['d']:null; $o['iki']=$rows?end($rows)['d']:null;
  foreach($rows as $r){ $h=$r['h']?:('id'.$r['kid']); $naujas=!isset($ist[$h])&&!isset($seen[$h]); $seen[$h]=1; $kn=$r['kan']?:( $r['gclid']?'google/cpc(gclid)':'-'); if(!isset($k[$kn])) $k[$kn]=array('uzs'=>0,'eur'=>0,'nauji'=>0,'nauji_eur'=>0,'grize'=>0,'gclid'=>0); $k[$kn]['uzs']++; $k[$kn]['eur']+=$r['viso_ct']/100; if($naujas){$k[$kn]['nauji']++;$k[$kn]['nauji_eur']+=$r['viso_ct']/100;} else $k[$kn]['grize']++; if($r['gclid'])$k[$kn]['gclid']++; if(!isset($dien[$r['d']]))$dien[$r['d']]=array('uzs'=>0,'nauji'=>0,'eur'=>0); $dien[$r['d']]['uzs']++; $dien[$r['d']]['eur']+=round($r['viso_ct']/100); if($naujas)$dien[$r['d']]['nauji']++; }
  foreach($k as &$x){$x['eur']=round($x['eur']);$x['nauji_eur']=round($x['nauji_eur']);} unset($x); arsort($k); $o['kanalai']=$k; $o['dienos']=$dien;
  $o['kan2_sample']=$wpdb->get_results("SELECT $kc a, ".(in_array('kanalas_paskutinis',$o['u_cols'])?'kanalas_paskutinis':"''")." b, COUNT(*) n FROM $U WHERE testinis=0 GROUP BY a,b ORDER BY n DESC LIMIT 15",ARRAY_A);
  // pristatymas: ką moka klientas vs savikaina
  $o['pristatymas']=$wpdb->get_row("SELECT COUNT(*) n, SUM(viso_ct)/100 eur, ROUND(AVG(viso_ct)/100,1) aov, SUM(".(in_array('pristatymas_ct',$o['u_cols'])?'pristatymas_ct':'0').")/100 kl_moka, SUM(".(in_array('pristatymas_ct',$o['u_cols'])?'pristatymas_ct':'0').">0) moka_n FROM $U WHERE apmoketa_at IS NOT NULL AND testinis=0",ARRAY_A);
  $o['siuntos_savikaina']=$wpdb->get_row("SELECT COUNT(*) n, SUM(kaina_vezejo_ct)/100 eur, ROUND(AVG(kaina_vezejo_ct)/100,2) vid FROM {$p}ps_fakt_siuntos WHERE kaina_vezejo_ct>0",ARRAY_A);
  $o['nemokamo_slenkstis']=get_option('woocommerce_free_shipping_min_amount', null);
  $fs=$wpdb->get_results("SELECT instance_id, method_id FROM {$p}woocommerce_shipping_zone_methods WHERE method_id='free_shipping' AND is_enabled=1",ARRAY_A); foreach($fs as $f){ $opt=get_option('woocommerce_free_shipping_'.$f['instance_id'].'_settings'); $o['free_shipping'][$f['instance_id']]=array('min'=>isset($opt['min_amount'])?$opt['min_amount']:null,'requires'=>isset($opt['requires'])?$opt['requires']:null); }
  // reklama
  $o['reklama_sample']=$wpdb->get_results("SELECT * FROM $R ORDER BY 1 DESC LIMIT 5",ARRAY_A);
  $dc=null; foreach($o['r_cols'] as $c) if(preg_match('/^(diena|data|date|d)$/',$c)) $dc=$c; $sc=null; foreach($o['r_cols'] as $c) if(preg_match('/islaid|spend|cost|kaina/i',$c)&&!$sc) $sc=$c; $cc=null; foreach($o['r_cols'] as $c) if(preg_match('/konv|conv/i',$c)&&!$cc) $cc=$c;
  if($dc&&$sc) $o['reklama_men']=$wpdb->get_results("SELECT DATE_FORMAT($dc,'%Y-%m') m, COUNT(*) n, ROUND(SUM($sc),0) spend".($cc?", ROUND(SUM($cc),1) konv":"")." FROM $R GROUP BY m ORDER BY m",ARRAY_A);
  $o['reklama_kampanijos']=$wpdb->get_results("SELECT ".(in_array('kampanija',$o['r_cols'])?'kampanija':'1')." k, COUNT(*) n".($sc?", ROUND(SUM($sc)) spend":"")." FROM $R GROUP BY k ORDER BY n DESC LIMIT 10",ARRAY_A);
  // istorinės Ads išlaidos kitur? opcijos
  $o['ads_opcijos']=$wpdb->get_col("SELECT option_name FROM {$p}options WHERE option_name LIKE 'ps_%ads%' OR option_name LIKE 'ps_%reklam%' OR option_name LIKE 'ps_%pmax%' LIMIT 30");
  // istorija: mėnesio užsakymai/nauji 2025-09…2026-08 (baseline)
  $o['ist_men']=$wpdb->get_results("SELECT DATE_FORMAT(apmoketa_at,'%Y-%m') m, COUNT(*) uzs, ROUND(SUM(viso_ct)/100) eur FROM $IU WHERE apmoketa_at>='2025-07-01' AND testinis=0 GROUP BY m ORDER BY m",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
