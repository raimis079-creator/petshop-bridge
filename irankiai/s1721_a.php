<?php
/** Plugin Name: TEMP PS S1721a rytine ataskaita 09-26 (Ads is WC faktu, Shopping, botu sargas, WPAI #3, Ryto sargas, cache) read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721a'])) return;
  $f=$_GET['ps_s1721a']; @set_time_limit(280); @ini_set('memory_limit','512M'); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1721a','faze'=>$f]; $T0=microtime(true);
  $tz=new DateTimeZone('Europe/Vilnius');
  $trim=function($a,$n=160){ foreach($a as $k=>$v){ if(is_string($v)&&mb_strlen($v)>$n) $a[$k]=mb_substr($v,0,$n).'…'; } return $a; };
  $q=function($sql) use ($wpdb,&$r){ $x=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error){ $r['SQL_ERR'][]=mb_substr($wpdb->last_error,0,200); } return $x; };
  try{
  if($f==='1'){
    // 1. Ads islaidos per kampanija per diena (naktinis traukimas 02:01)
    $r['ads']=$q("SELECT diena d, kampanija_id kid, LEFT(kampanija,30) k, parodymai par, paspaudimai pasp, ROUND(islaidos_ct/100,2) eur, konversijos konv FROM {$P}ps_fakt_reklama WHERE kanalas='google_ads' AND diena>='2026-09-22' ORDER BY diena, kampanija");
    $r['ads_pask_irasas']=$wpdb->get_var("SELECT MAX(irasyta_at) FROM {$P}ps_fakt_reklama WHERE kanalas='google_ads'");
    // 2. WC faktai per diena nuo 09-19: visi / Google / kaina24, kontribucija ir siuntos savikaina
    $g="(u.gclid<>'' OR u.utm_campaign REGEXP '^[0-9]+$' OR u.utm_source='google')"; $k="(u.utm_source IN('kaina24','kainos'))";
    $sc=$wpdb->get_col("SHOW COLUMNS FROM {$P}ps_fakt_siuntos"); $r['siuntos_cols']=$sc;
    $sub=in_array('kaina_vezejo_ct',$sc)?"(SELECT COALESCE(SUM(s.kaina_vezejo_ct),0) FROM {$P}ps_fakt_siuntos s WHERE s.uzsakymas_id=u.uzsakymas_id AND COALESCE(s.statusas,'')<>'atsaukta')":"0";
    $t="FROM {$P}ps_fakt_uzsakymai u WHERE u.testinis=0 AND u.statusas_galutinis NOT IN('cancelled','failed','refunded','pending') AND u.sukurta_at>='2026-09-19'";
    $r['wc_d']=$q("SELECT DATE(u.sukurta_at) d, COUNT(*) n, ROUND(SUM(u.viso_ct)/100) eur, ROUND(SUM(u.kontribucija_ct)/100) kontr, ROUND(SUM($sub)/100) siunta, SUM(u.klientas_naujas) nauji, SUM($g) g_n, ROUND(SUM(IF($g,u.viso_ct,0))/100) g_eur, ROUND(SUM(IF($g,u.kontribucija_ct,0))/100) g_kontr, ROUND(SUM(IF($g,$sub,0))/100) g_siunta, SUM(IF($g,u.klientas_naujas,0)) g_nauji, SUM($k) k_n, SUM(u.kanalas_paskutinis='direct') dir_n, SUM(u.kanalas_paskutinis='organika') org_n $t GROUP BY 1 ORDER BY 1");
    $r['wc_kamp']=$q("SELECT DATE(u.sukurta_at) d, COALESCE(NULLIF(u.utm_campaign,''),IF(u.gclid<>'','gclid_be_utm','?')) k, COUNT(*) n, ROUND(SUM(u.viso_ct)/100) eur, ROUND(SUM(u.kontribucija_ct)/100) kontr, SUM(u.klientas_naujas) nauji $t AND u.sukurta_at>='2026-09-23' AND $g GROUP BY 1,2 ORDER BY 1,2");
    // 7 d. suvestine 09-19..09-25: Ads islaidos vs Google uzs. kontribucija po siuntos
    $r['ads_7d']=$q("SELECT ROUND(SUM(islaidos_ct)/100,2) eur, SUM(paspaudimai) pasp, SUM(konversijos) konv FROM {$P}ps_fakt_reklama WHERE kanalas='google_ads' AND diena BETWEEN '2026-09-19' AND '2026-09-25'");
    $r['g_7d']=$q("SELECT COUNT(*) n, ROUND(SUM(u.viso_ct)/100) eur, ROUND(SUM(u.kontribucija_ct)/100,1) kontr, ROUND(SUM($sub)/100,1) siunta, SUM(u.klientas_naujas) nauji $t AND u.sukurta_at<'2026-09-26' AND $g");
    // 3. Uzsakymai nuo 09-25 00:00 (WC)
    $nuo=(new DateTime('2026-09-25 00:00:00',$tz))->getTimestamp();
    $ords=wc_get_orders(['limit'=>-1,'type'=>'shop_order','date_created'=>'>='.$nuo,'orderby'=>'date','order'=>'ASC']);
    $ids=[]; foreach($ords as $o) $ids[]=(int)$o->get_id();
    $fk=[]; if($ids){ foreach($wpdb->get_results("SELECT uzsakymas_id, kanalas_paskutinis kan, utm_source us, utm_campaign uc, (gclid<>'') gc, klientas_naujas nj, ROUND(kontribucija_ct/100,1) kontr FROM {$P}ps_fakt_uzsakymai WHERE uzsakymas_id IN (".implode(',',$ids).")",ARRAY_A) as $x) $fk[$x['uzsakymas_id']]=$x; }
    $r['uzs']=[];
    foreach($ords as $o){ $sm=[]; foreach($o->get_shipping_methods() as $s) $sm[]=$s->get_method_id().':'.$s->get_instance_id().'='.round((float)$s->get_total()+(float)$s->get_total_tax(),2);
      $d=$o->get_date_created(); $d=$d?$d->setTimezone($tz)->format('m-d H:i'):'';
      $x=$fk[$o->get_id()]??[];
      $r['uzs'][]=[$o->get_order_number(),$o->get_id(),$d,$o->get_status(),round((float)$o->get_total(),2),$o->get_payment_method(),implode(',',$sm),$o->get_item_count(),($x['kan']??'-').'|'.($x['us']??'').'|'.($x['uc']??'').'|gc'.($x['gc']??'').'|n'.($x['nj']??'').'|k'.($x['kontr']??''),$o->get_meta('_ps_kelias')?:''];
    }
    // 4. Atviri: processing/on-hold
    $atv=wc_get_orders(['limit'=>60,'type'=>'shop_order','status'=>['processing','on-hold'],'orderby'=>'date','order'=>'ASC']);
    $r['atviri']=[]; foreach($atv as $o){ $d=$o->get_date_created(); $r['atviri'][]=[$o->get_order_number(),$o->get_id(),$d?$d->setTimezone($tz)->format('m-d H:i'):'',$o->get_status(),$o->get_payment_method(),round((float)$o->get_total(),2),$o->get_meta('_ps_kelias')?:'']; }
    $r['laikas']=(new DateTime('now',$tz))->format('Y-m-d H:i:s');
  }
  if($f==='2'){
    // Botu sargo para
    if(class_exists('Petshop_Botu_Sargas')&&method_exists('Petshop_Botu_Sargas','suvestine')) $r['suvestine']=Petshop_Botu_Sargas::suvestine(2);
    $d=dirname(ABSPATH).'/ps-archyvas/botu-sargas/';
    foreach(glob($d.'*.log') as $fn){ $n=0;$atc=0;$fil=0;$ip=[];$ua=[];$val=[];$keliai=[]; $h=fopen($fn,'r');
      while(($l=fgets($h))!==false){ $n++; $c=preg_split('/\t| {2,}/',trim($l)); $tipas=''; foreach($c as $cc){ if($cc==='atc'||$cc==='filtrai'){ $tipas=$cc; break; } } if($tipas==='atc') $atc++; elseif($tipas==='filtrai') $fil++; elseif(strpos($l,' atc ')!==false) $atc++; elseif(strpos($l,'filtrai')!==false) $fil++;
        if(preg_match('/(\d+\.\d+\.\d+\.\d+)/',$l,$m)) $ip[$m[1]]=($ip[$m[1]]??0)+1; if(preg_match('/^\S*(\d{4}-\d\d-\d\d)[ T](\d\d)/',$l,$m)) $val[$m[2]]=($val[$m[2]]??0)+1; elseif(preg_match('/\b(\d\d):\d\d:\d\d\b/',$l,$m)) $val[$m[1]]=($val[$m[1]]??0)+1;
        if(preg_match('/(Mozilla[^\t]{0,60})/',$l,$m)){ $u=substr($m[1],0,60); $ua[$u]=($ua[$u]??0)+1; } if(preg_match('#\s(/[^\s?]{0,60})#',$l,$m)){ $kl=preg_replace('#^/(kategorija|preke|gamintojas)/[^/]+#','/$1/*',$m[1]); $keliai[$kl]=($keliai[$kl]??0)+1; } }
      fclose($h); arsort($ip); arsort($ua); arsort($keliai); ksort($val);
      $r['log'][basename($fn)]=['eil'=>$n,'atc'=>$atc,'filtrai'=>$fil,'ip_unik'=>count($ip),'ip_top'=>array_slice($ip,0,5,true),'ua_top'=>array_slice($ua,0,4,true),'keliai_top'=>array_slice($keliai,0,8,true),'valandos'=>$val,'kb'=>round(filesize($fn)/1024)];
      if($n&&!isset($r['log_pvz'])){ $h=fopen($fn,'r'); $r['log_pvz']=[trim(fgets($h)),trim(fgets($h))]; fclose($h); } }
    $r['sesijos']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}woocommerce_sessions");
    $r['ps_carts_d']=$q("SELECT DATE(created_at) d, COUNT(*) n, SUM(converted_order_id IS NOT NULL) konv FROM {$P}ps_carts WHERE created_at>=CURDATE()-INTERVAL 5 DAY GROUP BY 1 ORDER BY 1");
    $r['uzs_d']=$q("SELECT DATE(CONVERT_TZ(date_created_gmt,'+00:00','+03:00')) d, status, COUNT(*) n FROM {$P}wc_orders WHERE type='shop_order' AND date_created_gmt>=UTC_DATE()-INTERVAL 3 DAY GROUP BY 1,2 ORDER BY 1,2");
    $r['web_ivykiai_d']=$q("SELECT DATE(sukurta_at) d, COUNT(*) n, COUNT(DISTINCT sesija) ses FROM {$P}ps_web_ivykiai WHERE sukurta_at>=CURDATE()-INTERVAL 4 DAY GROUP BY 1 ORDER BY 1");
    if(!empty($r['SQL_ERR'])) $r['web_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$P}ps_web_ivykiai");
    // access logai: katalogas ir dabartinis failas per diena
    $dom=dirname(ABSPATH); $r['logs_dir']=[]; foreach(glob($dom.'/logs/*') as $fx){ $r['logs_dir'][]=[basename($fx),round(filesize($fx)/1048576,1).'MB',(new DateTime('@'.filemtime($fx)))->setTimezone($tz)->format('m-d H:i')]; }
    $cand=[]; foreach(glob($dom.'/logs/*') as $fx){ if(preg_match('/\.(gz|tar|zip|\d+)$/',$fx)) continue; if(preg_match('/error/i',basename($fx))) continue; if(filesize($fx)>1000000) $cand[]=$fx; }
    $r['access_failas']=$cand?array_map('basename',$cand):null;
    if($cand){ $fx=$cand[0]; $sz=filesize($fx); $h=fopen($fx,'r'); $skip=0; if($sz>700*1048576){ fseek($h,$sz-700*1048576); fgets($h); $skip=1; } $r['access_skip_mb']=$skip?round(($sz-700*1048576)/1048576):0;
      $dd=[]; $n=0;
      while(($ln=fgets($h))!==false){ if(!preg_match('/^(\S+) \S+ \S+ \[(\d\d)\/(\w{3})\/\d{4}:(\d\d)[^\]]*\] "(\S+) (\S+)[^"]*" (\d{3})/',$ln,$m)) continue; $n++; $day=$m[3].'-'.$m[2]; if(!isset($dd[$day])) $dd[$day]=['n'=>0,'atc'=>0,'filtrai'=>0,'302'=>0,'ip'=>[],'cron'=>0,'bot_ua'=>0,'wcajax'=>0,'404'=>0];
        $x=&$dd[$day]; $x['n']++; if($m[7]==='302') $x['302']++; if($m[7]==='404') $x['404']++; if(strpos($m[6],'add-to-cart=')!==false) $x['atc']++; if(strpos($m[6],'yith_wcan=')!==false||strpos($m[6],'filter_')!==false) $x['filtrai']++; if(strpos($m[6],'wp-cron.php')!==false) $x['cron']++; if(strpos($m[6],'wc-ajax=')!==false) $x['wcajax']++; if(preg_match('/bot|crawl|spider|GPT|Claude|Bing|Yandex|python|curl/i',$ln)) $x['bot_ua']++; $x['ip'][$m[1]]=1; unset($x);
        if(microtime(true)-$T0>200){ $r['access_nutraukta']=$n; break; } }
      fclose($h); foreach($dd as $day=>&$x){ $x['ip']=count($x['ip']); } unset($x); $r['access_d']=$dd; $r['access_eil']=$n; }
    $r['trukme_s']=round(microtime(true)-$T0,1);
  }
  if($f==='3'){
    // WPAI #3
    $r['wpai3_hist']=$q("SELECT id,type,time_run,summary,date FROM {$P}pmxi_history WHERE import_id=3 ORDER BY id DESC LIMIT 12");
    $r['wpai_imports']=$q("SELECT id,name,processing,executing,last_activity,imported,skipped,updated,count FROM {$P}pmxi_imports");
    $opt=$wpdb->get_var("SELECT options FROM {$P}pmxi_imports WHERE id=3"); $o=@unserialize($opt); $r['wpai3_selective']=is_array($o)?($o['is_selective_hashing']??'nera'):'?'; $r['wpai3_hash_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}pmxi_hash");
    $r['wpai_cron']=[]; foreach(_get_cron_array() as $ts=>$hooks){ foreach($hooks as $h=>$x){ if(preg_match('#pmxi|wpai|wp_all_import#i',$h)) $r['wpai_cron'][]=[$h,(new DateTime('@'.$ts))->setTimezone($tz)->format('m-d H:i')]; } }
    // Ryto sargas
    $rp=get_option('ps_rytas_sargas_pask'); if(is_array($rp)){ $js=json_encode($rp,JSON_UNESCAPED_UNICODE); $r['rytas_pask']=strlen($js)>6000?mb_substr($js,0,6000).'…':$rp; } else $r['rytas_pask']=$rp;
    if($wpdb->get_var("SHOW TABLES LIKE '{$P}ps_sargas_klaidos'")){ $rows=$wpdb->get_results("SELECT * FROM {$P}ps_sargas_klaidos WHERE laikas>=DATE_SUB(NOW(),INTERVAL 36 HOUR) ORDER BY laikas DESC LIMIT 25",ARRAY_A); $r['sargo_klaidos']=array_map($trim,$rows); }
    $r['sargas_cron_zinios']=get_option('ps_sargas_cron_zinios'); if(is_array($r['sargas_cron_zinios'])) $r['sargas_cron_zinios']=array_slice($r['sargas_cron_zinios'],-5);
    // AVPN
    $r['avpn_dubl']=$q("SELECT meta_value nr, COUNT(*) n, GROUP_CONCAT(order_id) o FROM {$P}wc_orders_meta WHERE meta_key='_petshop_avpn_number' GROUP BY meta_value HAVING n>1");
    if(!empty($r['SQL_ERR'])||$r['avpn_dubl']===null){ $r['avpn_keys']=$q("SELECT meta_key, COUNT(*) n FROM {$P}wc_orders_meta WHERE meta_key LIKE '%avpn%' GROUP BY 1"); }
    $r['avpn_skaitiklis']=get_option('petshop_avpn_counter')?:['opts'=>$q("SELECT option_name,option_value FROM {$P}options WHERE option_name LIKE '%avpn%' OR option_name LIKE '%iapv%'")];
    // cron sveikata + DISABLE_WP_CRON
    $r['disable_wp_cron']=defined('DISABLE_WP_CRON')?DISABLE_WP_CRON:null; $now=time(); $velu=0; $velu_pvz=[]; $viso=0; foreach(_get_cron_array() as $ts=>$hooks){ foreach($hooks as $h=>$x){ $viso++; if($ts<$now-900){ $velu++; if(count($velu_pvz)<8) $velu_pvz[]=[$h,(new DateTime('@'.$ts))->setTimezone($tz)->format('m-d H:i')]; } } } $r['cron']=['viso'=>$viso,'veluoja_15min'=>$velu,'pvz'=>$velu_pvz];
    $r['as_pending_velu']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}actionscheduler_actions WHERE status='pending' AND scheduled_date_gmt<UTC_TIMESTAMP()-INTERVAL 15 MINUTE");
    // Super Cache
    $cf=WP_CONTENT_DIR.'/wp-cache-config.php'; if(is_file($cf)){ $s=file_get_contents($cf); foreach(['wp_cache_clear_on_post_edit','cache_max_time','wp_cache_preload_on','cache_enabled','super_cache_enabled','wp_cache_mod_rewrite','wp_cache_not_logged_in','cache_compression'] as $kk){ if(preg_match('#^\$'.$kk.'\s*=\s*([^;]*);#m',$s,$mm)) $r['cache_cfg'][$kk]=trim($mm[1]); } }
    $scd=WP_CONTENT_DIR.'/cache/supercache/petshop.lt'; $n=0; $old=null; $new=null; if(is_dir($scd)){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($scd,FilesystemIterator::SKIP_DOTS)); foreach($it as $fi){ if(substr($fi->getFilename(),-5)==='.html'||substr($fi->getFilename(),-8)==='.html.gz'){ $n++; $mt=$fi->getMTime(); if($old===null||$mt<$old) $old=$mt; if($new===null||$mt>$new) $new=$mt; } if($n>40000) break; } }
    $r['supercache']=['psl'=>$n,'seniausias'=>$old?(new DateTime('@'.$old))->setTimezone($tz)->format('m-d H:i'):null,'naujausias'=>$new?(new DateTime('@'.$new))->setTimezone($tz)->format('m-d H:i'):null];
    // php_error.log nuo 09-25
    $lf=ini_get('error_log'); $r['log']=['kelias'=>$lf];
    if($lf && is_file($lf)){ $sz=filesize($lf); $r['log']['kb']=round($sz/1024); $h=fopen($lf,'r'); fseek($h,max(0,$sz-400000)); $tx=stream_get_contents($h); fclose($h);
      $cnt=[]; $siandien=0; $vakar=0; $fatal=0;
      foreach(explode("\n",$tx) as $ln){ if(!preg_match('#^\[(\d\d-\w{3}-\d{4} \d\d:\d\d:\d\d) ([^\]]+)\] (.*)$#',$ln,$m)) continue; $dt=DateTime::createFromFormat('d-M-Y H:i:s',$m[1],new DateTimeZone($m[2]=='UTC'?'UTC':'Europe/Vilnius')); if(!$dt) continue; $dt->setTimezone($tz); if($dt->format('Y-m-d')<'2026-09-25') continue;
        if($dt->format('Y-m-d')==='2026-09-26') $siandien++; else $vakar++; if(stripos($m[3],'Fatal')!==false) $fatal++;
        $key=mb_substr(preg_replace('#\d+#','N',$m[3]),0,150); if(!isset($cnt[$key])) $cnt[$key]=[0,$dt->format('m-d H:i')]; $cnt[$key][0]++; $cnt[$key][1]=$dt->format('m-d H:i'); }
      uasort($cnt,function($a,$b){return $b[0]-$a[0];}); $r['log']['tipai']=array_slice($cnt,0,12,true); $r['log']['siandien']=$siandien; $r['log']['vakar']=$vakar; $r['log']['fatal']=$fatal; }
    // laiskai 48 val.
    $cols=$wpdb->get_col("SHOW COLUMNS FROM {$P}ps_email_jobs"); $dc=null; foreach($cols as $c){ if(preg_match('#^(created|created_at|sukurta|sukurta_at|scheduled_at|laikas)$#',$c)){ $dc=$c; break; } }
    if($dc){ $r['email_48h']=$q("SELECT flow, status, COALESCE(skip_reason,'') sr, COUNT(*) n FROM {$P}ps_email_jobs WHERE $dc>=DATE_SUB(NOW(),INTERVAL 48 HOUR) GROUP BY 1,2,3 ORDER BY 1,2"); }
    $dbg=get_option('wp_mail_smtp_debug'); $r['smtp_debug_n']=is_array($dbg)?count($dbg):0;
    // ZB matmenys po importo, botu sargo/pazado opcijos
    $r['zb_su_matmenimis']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT pm.post_id) FROM {$wpdb->postmeta} pm JOIN {$wpdb->postmeta} z ON z.post_id=pm.post_id AND ((z.meta_key='_zb_enabled' AND z.meta_value='yes') OR (z.meta_key='_ps_sandelis' AND z.meta_value='zb')) WHERE pm.meta_key IN('_length','_width','_height') AND pm.meta_value NOT IN('','0')");
    foreach(['ps_botu_sargas_isjungtas','ps_pristatymo_pazadas_isjungtas','ps_prekes_tvarka_isjungta','ps_paieska_isjungta','ps_lenteliu_valymas_pask','ps_gavimo_perrus_pask','ps_sugrazinimas_pask'] as $on){ $v=get_option($on); $r['opcijos'][$on]=is_array($v)?json_encode($v,JSON_UNESCAPED_UNICODE):$v; }
    $r['mu_mtime']=[]; foreach(['petshop-botu-sargas.php','petshop-pristatymo-pazadas.php','petshop-prekes-tvarka.php','petshop-paieska.php','petshop-lenteliu-valymas.php','petshop-rytas.php'] as $fn){ $p=WPMU_PLUGIN_DIR.'/'.$fn; $r['mu_mtime'][$fn]=is_file($p)?md5_file($p).' '.(new DateTime('@'.filemtime($p)))->setTimezone($tz)->format('m-d H:i'):'NERA'; }
    $r['heartbeat']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/'),['timeout'=>20,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1721']));
    $r['laikas']=(new DateTime('now',$tz))->format('Y-m-d H:i:s');
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $r['trukme_s']=round(microtime(true)-$T0,1);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
