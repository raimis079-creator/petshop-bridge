<?php
/** TEMP PS S1686 mr v2 — RELAUNCH 2 etapas (calc() kaip svetainė; svoriai adaptuojami pagal lentelės ribą): (&alter) nauji stulpeliai; (&prekes) kandidatinių prekių skaičiavimas 3 svoriams → opcija ps_relaunch_prekes; (&klientai&n0&k1500) auditorijos segmentavimas → ps_relaunch_kontaktai; (be parametrų) struktūra. Auditorija: WP vartotojai su _ps_ist_n arba ps_marketing_consent; be suppression/transactional_only. Taisyklė: exact = paskutinis maisto pirkimas ≤12 mėn. ARBA tas pats SKU ≥3 užs. ir ≤18 mėn. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mr'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1686 mr'); $t=Petshop_Relaunch::t(); $faze='suvestine'; foreach(array('alter','prekes','klientai') as $fz) if(isset($_GET[$fz])) $faze=$fz; $nuo=0; $kiek=1500; foreach(array_keys($_GET) as $gk){ if(preg_match('/^n(\d+)$/',$gk,$m)) $nuo=(int)$m[1]; if(preg_match('/^k(\d+)$/',$gk,$m)) $kiek=(int)$m[1]; }
  $T0='2026-09-15'; $m12=date('Y-m-d',strtotime("$T0 -12 months")); $m18=date('Y-m-d',strtotime("$T0 -18 months")); $m24=date('Y-m-d',strtotime("$T0 -24 months"));
  $SV=array('suo'=>array(10,20,30),'kate'=>array(3,5,7));
  $rusis=function($kelias,$g){ if($g==='suo'||$g==='kate') return $g; if(stripos($kelias,'ŠUN')===0||stripos($kelias,'SUN')===0) return 'suo'; if(mb_stripos($kelias,'KAT')===0) return 'kate'; return ''; };
  $eiles=function($hash) use($wpdb,$p){ return $wpdb->get_results($wpdb->prepare("SELECT preke_id pid, MAX(pask) pask, SUM(n) n, MAX(kelias) kelias, MAX(g) g FROM (
      SELECT e.preke_id, MAX(e.apmoketa_at) pask, COUNT(DISTINCT e.uzsakymas_id) n, e.kategoriju_kelias kelias, e.gyvunas g FROM {$p}ps_ist_fakt_eilutes e JOIN {$p}ps_ist_fakt_uzsakymai u ON u.uzsakymas_id=e.uzsakymas_id WHERE u.klientas_email_hash=%s AND u.apmoketa_at IS NOT NULL AND e.kategoriju_kelias LIKE '%%maist%%' AND e.kategoriju_kelias NOT LIKE 'ŽUV%%' GROUP BY e.preke_id
      UNION ALL
      SELECT e.preke_id, MAX(e.apmoketa_at), COUNT(DISTINCT e.uzsakymas_id), e.kategoriju_kelias, e.gyvunas FROM {$p}ps_fakt_eilutes e JOIN {$p}ps_fakt_uzsakymai u ON u.uzsakymas_id=e.uzsakymas_id WHERE u.klientas_email_hash=%s AND u.apmoketa_at IS NOT NULL AND u.testinis=0 AND e.kategoriju_kelias LIKE '%%maist%%' AND e.kategoriju_kelias NOT LIKE 'ŽUV%%' GROUP BY e.preke_id
    ) x GROUP BY preke_id ORDER BY pask DESC",$hash,$hash),ARRAY_A); };
  $kandidatas=function($rows) use($m12,$m18){ if(!$rows) return array(null,'no_food'); $r0=$rows[0]; if(substr($r0['pask'],0,10)>=$m12) return array($r0,'recent_exact'); foreach($rows as $r){ if((int)$r['n']>=3 && substr($r['pask'],0,10)>=$m18) return array($r,'repeat_exact'); } return array($r0,'old_purchase'); };
  $auditorija="SELECT DISTINCT u.ID, u.user_email FROM {$p}users u JOIN {$p}usermeta m ON m.user_id=u.ID AND m.meta_key IN('_ps_ist_n','ps_marketing_consent') WHERE NOT EXISTS (SELECT 1 FROM {$p}usermeta x WHERE x.user_id=u.ID AND x.meta_key='ps_transactional_only' AND x.meta_value='yes') AND NOT EXISTS (SELECT 1 FROM {$p}ps_email_suppression s WHERE s.email=u.user_email) ORDER BY u.ID";
  if($faze==='alter'){
    foreach(array('hero_reason VARCHAR(24) NULL','last_food_product_id BIGINT UNSIGNED NULL','last_food_date DATE NULL','same_sku_orders INT UNSIGNED NULL','ist_n INT UNSIGNED NULL','ist_paskutinis DATE NULL','consent TINYINT(1) NOT NULL DEFAULT 0') as $c){ $k=strtok($c,' '); if(!$wpdb->get_var("SHOW COLUMNS FROM $t LIKE '$k'")) $wpdb->query("ALTER TABLE $t ADD COLUMN $c"); }
    $o['cols']=$wpdb->get_col("SHOW COLUMNS FROM $t");
  } elseif($faze==='prekes'){
    $users=$wpdb->get_results($auditorija,ARRAY_A); $pids=array(); $o['auditorija']=count($users);
    foreach($users as $u){ $h=hash('sha256',strtolower(trim($u['user_email']))); list($k,$why)=$kandidatas($eiles($h)); if($k && $why!=='old_purchase') $pids[(int)$k['pid']]=$rusis($k['kelias'],$k['g']); }
    $o['prekes_n']=count($pids); $cache=array(); $stat=array();
    foreach($pids as $pid=>$ru){ $pr=wc_get_product($pid); $d=array('pid'=>$pid,'rusis'=>$ru,'busena'=>'gone');
      if($pr){ $d['pav']=$pr->get_name(); $d['kaina']=(float)wc_get_price_to_display($pr); $d['url']=$pr->get_permalink(); $iid=$pr->get_image_id(); $d['img']=$iid?wp_get_attachment_image_url($iid,'medium'):'';
        if('publish'!==$pr->get_status()||!$pr->is_purchasable()) $d['busena']='unavailable'; elseif(!$pr->is_in_stock()) $d['busena']='out_of_stock'; else { $d['busena']='product'; if(isset($SV[$ru])){ $sp=$ru==='suo'?'dog':'cat'; $svor=$SV[$ru]; $eil=array(); $ok=true;
            for($band=0;$band<2 && $ok;$band++){ $eil=array(); foreach($svor as $kg){ $r=Petshop_Feeding_Service::calc(array('product_id'=>$pid,'weight_kg'=>$kg,'species_code'=>$sp));
                if(($r['status']??'')!=='ok'||$r['cost_day_min']===null||$r['days_min']===null){ $ok=false; $d['calc_issue']=($r['status']??'?').':'.implode(',',$r['reason_codes']??array());
                  if($band===0 && in_array('WEIGHT_OUT_OF_RANGE',$r['reason_codes']??array()) && isset($r['weight_range_from_kg'],$r['weight_range_to_kg'])){ $a=(float)$r['weight_range_from_kg']; $b=(float)$r['weight_range_to_kg']; $svor=array_values(array_unique(array(max(1,round($a+($b-$a)*0.25)),max(1,round($a+($b-$a)*0.5)),max(1,round($a+($b-$a)*0.8))))); if(count($svor)===3){ $ok=true; continue 2; } }
                  break; }
                $eil[]=array('kg'=>$kg,'g'=>array('min'=>$r['norm_min_g'],'max'=>$r['norm_max_g']),'eur'=>array('min'=>$r['cost_day_min'],'max'=>$r['cost_day_max']),'d'=>array('min'=>$r['days_min'],'max'=>$r['days_max']),'kaina'=>$r['price_used']); }
              break; }
            if($ok && count($eil)===3){ $d['busena']='calc'; $d['eilutes']=$eil; $d['svoriai']=$svor; if(!empty($eil[0]['kaina'])) $d['kaina']=(float)$eil[0]['kaina']; } } }
      }
      $cache[$pid]=$d; $stat[$d['busena']]=($stat[$d['busena']]??0)+1; }
    update_option('ps_relaunch_prekes',$cache,false); $o['prekiu_busenos']=$stat; $o['pvz']=array_slice(array_filter($cache,function($x){return $x['busena']==='calc';}),0,2);
  } elseif($faze==='klientai'){
    $cache=get_option('ps_relaunch_prekes',array()); $users=$wpdb->get_results($auditorija." LIMIT $kiek OFFSET $nuo",ARRAY_A); $o['apdorota']=count($users); $stat=array(); $dabar=current_time('mysql',true);
    foreach($users as $u){ $uid=(int)$u['ID']; $email=strtolower(trim($u['user_email'])); $h=hash('sha256',$email); $rows=$eiles($h); list($k,$why)=$kandidatas($rows);
      $seg='generic'; $pid=$k?(int)$k['pid']:null; $ru=$k?$rusis($k['kelias'],$k['g']):''; $duom=null;
      if($k && $why!=='old_purchase'){ $d=$cache[$pid]??null; if(!$d||$d['busena']==='gone') $why='product_gone'; elseif($d['busena']==='unavailable'||$d['busena']==='out_of_stock') $why='product_'.$d['busena']; elseif($d['busena']==='product'){ $seg='product'; $why=$ru?'no_feeding_table':'no_species'; } elseif($d['busena']==='calc'){ $seg='calc'; } }
      elseif($k && $why==='old_purchase' && substr($k['pask'],0,10)<$m24) $why='old_purchase_24';
      if(get_user_meta($uid,'ps_similar_optout',true)==='1'){ $seg='generic'; $why='similar_optout'; }
      $cid=$wpdb->get_var($wpdb->prepare("SELECT cid FROM $t WHERE email=%s",$email)); if(!$cid) $cid=Petshop_Relaunch::cid();
      if($seg!=='generic'){ $d=$cache[$pid]; $utm=array('utm_source'=>'sender','utm_medium'=>'email','utm_campaign'=>'relaunch','utm_content'=>$seg,'cid'=>$cid); $duom=array('pav'=>$d['pav'],'kaina'=>$d['kaina'],'img'=>$d['img'],'url'=>add_query_arg($utm,$d['url']));
        if($seg==='calc'){ $duom['eilutes']=array(); foreach($d['eilutes'] as $e){ $duom['eilutes'][]=array('kg'=>$e['kg'],'g'=>$e['g']['min'].'–'.$e['g']['max'],'eur_nuo'=>number_format($e['eur']['min'],2,',',''),'d'=>$e['d']['min'].'–'.$e['d']['max'],'url'=>add_query_arg($utm+array('utm_term'=>$e['kg'].'kg','svoris'=>$e['kg']),$d['url'])); } } }
      $row=array('cid'=>$cid,'email'=>$email,'user_id'=>$uid,'segmentas'=>$seg,'product_id'=>$seg!=='generic'?$pid:null,'rusis'=>$ru?:null,'svoriai'=>$seg==='calc'?implode(',',$cache[$pid]['svoriai']):null,'duomenys'=>$duom?wp_json_encode($duom,JSON_UNESCAPED_UNICODE):null,'sukurta_at'=>$dabar,'hero_reason'=>$why,'last_food_product_id'=>$pid,'last_food_date'=>$k?substr($k['pask'],0,10):null,'same_sku_orders'=>$k?(int)$k['n']:null,'ist_n'=>(int)get_user_meta($uid,'_ps_ist_n',true),'ist_paskutinis'=>substr((string)get_user_meta($uid,'_ps_ist_paskutinis',true),0,10)?:null,'consent'=>in_array(get_user_meta($uid,'ps_marketing_consent',true),array('1','true','yes'),true)?1:0);
      if($wpdb->get_var($wpdb->prepare("SELECT id FROM $t WHERE email=%s",$email))){ unset($row['sukurta_at']); $wpdb->update($t,$row,array('email'=>$email)); } else $wpdb->insert($t,$row);
      $stat[$seg.'/'.$why]=($stat[$seg.'/'.$why]??0)+1; }
    $o['stat']=$stat; $o['db_err']=$wpdb->last_error;
  } else {
    $o['segmentai']=$wpdb->get_results("SELECT segmentas, hero_reason, COUNT(*) n, SUM(consent) su_consent FROM $t GROUP BY segmentas, hero_reason ORDER BY n DESC",ARRAY_A);
    $o['rusis']=$wpdb->get_results("SELECT segmentas, rusis, COUNT(*) n FROM $t WHERE segmentas<>'generic' GROUP BY segmentas, rusis",ARRAY_A);
    $o['viso']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $t"); $o['pvz_calc']=$wpdb->get_row("SELECT email,duomenys FROM $t WHERE segmentas='calc' AND rusis='kate' LIMIT 1",ARRAY_A);
  }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
