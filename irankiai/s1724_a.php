<?php
/** Plugin Name: TEMP PS S1724a rytine ataskaita 09-27 (Ads/WC, botu bukle is access log, sargai, feed, DP, refill) read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724a'])) return;
  $f=$_GET['ps_s1724a']; @set_time_limit(280); @ini_set('memory_limit','512M'); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1724a','faze'=>$f]; $T0=microtime(true);
  $tz=new DateTimeZone('Europe/Vilnius');
  $trim=function($a,$n=160){ foreach($a as $k=>$v){ if(is_string($v)&&mb_strlen($v)>$n) $a[$k]=mb_substr($v,0,$n).'…'; } return $a; };
  $q=function($sql) use ($wpdb,&$r){ $x=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error){ $r['SQL_ERR'][]=mb_substr($wpdb->last_error,0,200); } return $x; };
  try{
  if($f==='1'){
    $r['ads']=$q("SELECT diena d, LEFT(kampanija,30) k, parodymai par, paspaudimai pasp, ROUND(islaidos_ct/100,2) eur, konversijos konv FROM {$P}ps_fakt_reklama WHERE kanalas='google_ads' AND diena>='2026-09-24' ORDER BY diena, kampanija");
    $r['ads_pask_irasas']=$wpdb->get_var("SELECT MAX(irasyta_at) FROM {$P}ps_fakt_reklama WHERE kanalas='google_ads'");
    $g="(u.gclid<>'' OR u.utm_campaign REGEXP '^[0-9]+$' OR u.utm_source='google')"; $k="(u.utm_source IN('kaina24','kainos'))";
    $sub="(SELECT COALESCE(SUM(s.kaina_vezejo_ct),0) FROM {$P}ps_fakt_siuntos s WHERE s.uzsakymas_id=u.uzsakymas_id AND COALESCE(s.statusas,'')<>'atsaukta')";
    $t="FROM {$P}ps_fakt_uzsakymai u WHERE u.testinis=0 AND u.statusas_galutinis NOT IN('cancelled','failed','refunded','pending') AND u.sukurta_at>='2026-09-20'";
    $r['wc_d']=$q("SELECT DATE(u.sukurta_at) d, COUNT(*) n, ROUND(SUM(u.viso_ct)/100) eur, ROUND(SUM(u.kontribucija_ct)/100) kontr, ROUND(SUM($sub)/100) siunta, SUM(u.klientas_naujas) nauji, SUM($g) g_n, ROUND(SUM(IF($g,u.viso_ct,0))/100) g_eur, ROUND(SUM(IF($g,u.kontribucija_ct,0))/100) g_kontr, SUM(IF($g,u.klientas_naujas,0)) g_nauji, SUM($k) k_n, SUM(u.kanalas_paskutinis='direct') dir_n, SUM(u.kanalas_paskutinis='organika') org_n $t GROUP BY 1 ORDER BY 1");
    $r['wc_kamp']=$q("SELECT DATE(u.sukurta_at) d, COALESCE(NULLIF(u.utm_campaign,''),IF(u.gclid<>'','gclid_be_utm','?')) k, COUNT(*) n, ROUND(SUM(u.viso_ct)/100) eur, SUM(u.klientas_naujas) nauji $t AND u.sukurta_at>='2026-09-25' AND $g GROUP BY 1,2 ORDER BY 1,2");
    $r['ads_7d']=$q("SELECT ROUND(SUM(islaidos_ct)/100,2) eur, SUM(paspaudimai) pasp, SUM(konversijos) konv FROM {$P}ps_fakt_reklama WHERE kanalas='google_ads' AND diena BETWEEN '2026-09-20' AND '2026-09-26'");
    $r['g_7d']=$q("SELECT COUNT(*) n, ROUND(SUM(u.viso_ct)/100) eur, ROUND(SUM(u.kontribucija_ct)/100,1) kontr, ROUND(SUM($sub)/100,1) siunta, SUM(u.klientas_naujas) nauji $t AND u.sukurta_at<'2026-09-27' AND $g");
    $nuo=(new DateTime('2026-09-26 00:00:00',$tz))->getTimestamp();
    $ords=wc_get_orders(['limit'=>-1,'type'=>'shop_order','date_created'=>'>='.$nuo,'orderby'=>'date','order'=>'ASC']);
    $ids=[]; foreach($ords as $o) $ids[]=(int)$o->get_id();
    $fk=[]; if($ids){ foreach($wpdb->get_results("SELECT uzsakymas_id, kanalas_paskutinis kan, utm_source us, utm_campaign uc, (gclid<>'') gc, klientas_naujas nj, ROUND(kontribucija_ct/100,1) kontr FROM {$P}ps_fakt_uzsakymai WHERE uzsakymas_id IN (".implode(',',$ids).")",ARRAY_A) as $x) $fk[$x['uzsakymas_id']]=$x; }
    $r['uzs']=[];
    foreach($ords as $o){ $sm=[]; foreach($o->get_shipping_methods() as $s) $sm[]=$s->get_method_id().'='.round((float)$s->get_total()+(float)$s->get_total_tax(),2);
      $d=$o->get_date_created(); $d=$d?$d->setTimezone($tz)->format('m-d H:i'):''; $x=$fk[$o->get_id()]??[];
      $r['uzs'][]=[$o->get_order_number(),$d,$o->get_status(),round((float)$o->get_total(),2),$o->get_payment_method(),implode(',',$sm),$o->get_item_count(),($x['kan']??'-').'|'.($x['us']??'').'|'.($x['uc']??'').'|gc'.($x['gc']??'').'|n'.($x['nj']??'').'|k'.($x['kontr']??''),$o->get_meta('_ps_kelias')?:'']; }
    $atv=wc_get_orders(['limit'=>60,'type'=>'shop_order','status'=>['processing','on-hold'],'orderby'=>'date','order'=>'ASC']);
    $r['atviri']=[]; foreach($atv as $o){ $d=$o->get_date_created(); $r['atviri'][]=[$o->get_order_number(),$d?$d->setTimezone($tz)->format('m-d H:i'):'',$o->get_status(),$o->get_payment_method(),round((float)$o->get_total(),2),$o->get_meta('_ps_kelias')?:'']; }
    $r['laikas']=(new DateTime('now',$tz))->format('Y-m-d H:i:s');
  }
  if($f==='2'){
    $ht=ABSPATH.'.htaccess'; $s=is_file($ht)?file_get_contents($ht):''; $r['htaccess']=['dydis'=>strlen($s),'uztvara'=>strpos($s,'PS Botu uztvara')!==false,'mtime'=>is_file($ht)?(new DateTime('@'.filemtime($ht)))->setTimezone($tz)->format('m-d H:i'):null,'bak'=>is_file(ABSPATH.'.htaccess.bak_s1723')];
    if(preg_match('/# BEGIN PS Botu uztvara.*?# END PS Botu uztvara[^\n]*/s',$s,$m)) $r['htaccess']['blokas']=$m[0];
    $dom=dirname(ABSPATH); $r['logs_dir']=[]; foreach(glob($dom.'/logs/*') as $fx){ $r['logs_dir'][]=[basename($fx),round(filesize($fx)/1048576,1).'MB',(new DateTime('@'.filemtime($fx)))->setTimezone($tz)->format('m-d H:i')]; }
    $plain=null; $gz=null; $gzm=0; foreach(glob($dom.'/logs/*') as $fx){ $b=basename($fx); if(preg_match('/error/i',$b)) continue; if(preg_match('/\.tar\.gz/',$b)){ if(filemtime($fx)>$gzm){ $gzm=filemtime($fx); $gz=$fx; } continue; } if(preg_match('/\.(gz|zip|\d+)$/',$b)) continue; if(filesize($fx)>200000) $plain=$fx; }
    if(isset($_GET['src'])){ $cand=$dom.'/logs/'.basename($_GET['src']); if(is_file($cand)){ if(preg_match('/\.tar\.gz/',$cand)){ $gz=$cand; $plain=null; } else { $plain=$cand; } } }
    $src=$plain?:$gz; $r['access_src']=$src?basename($src):null; $r['access_src_mtime']=$src?(new DateTime('@'.filemtime($src)))->setTimezone($tz)->format('m-d H:i'):null;
    $isgz=$src&&!$plain; $tail=isset($_GET['tail'])?(int)$_GET['tail']:0;
    if($src){ if($isgz){ $h=gzopen($src,'rb'); gzread($h,512); $rd=function() use ($h){ return gzgets($h,8192); }; } else { $h=fopen($src,'r'); $sz=filesize($src); if($tail&&$sz>$tail*1048576){ fseek($h,$sz-$tail*1048576); fgets($h); $r['access_tail_mb']=$tail; } $rd=function() use ($h){ return fgets($h); }; }
      $hh=[]; $n=0; $tipai=['filtrai'=>0,'atc'=>0,'s'=>0,'orderby'=>0,'page'=>0,'preke'=>0,'kat'=>0,'gam'=>0,'wcajax'=>0,'adminajax'=>0,'wpjson'=>0,'cron'=>0,'kita'=>0]; $k403=[]; $k500=[]; $k200bot=[]; $ipbot=[]; $uabot=[]; $pask=''; $pirm='';
      while(($ln=$rd())!==false){ if(!preg_match('/^(\S+) \S+ \S+ \[(\d\d)\/(\w{3})\/\d{4}:(\d\d):(\d\d)[^\]]*\] "(\S+) (\S+)[^"]*" (\d{3}) (\S+)(?: "[^"]*" "([^"]*)")?/',$ln,$m)) continue; $n++;
        $key=$m[2].' '.$m[4]; if($pirm==='') $pirm=$m[2].' '.$m[4].':'.$m[5]; $pask=$m[2].' '.$m[4].':'.$m[5];
        if(!isset($hh[$key])) $hh[$key]=['n'=>0,'200'=>0,'301'=>0,'302'=>0,'403'=>0,'404'=>0,'500'=>0,'kt'=>0,'filtr'=>0,'ip'=>[]];
        $x=&$hh[$key]; $x['n']++; $st=$m[8]; if(isset($x[$st])) $x[$st]++; else $x['kt']++; $u=$m[7]; $ua=$m[10]??'';
        $isf=(strpos($u,'filter_')!==false||strpos($u,'yith_wcan')!==false||strpos($u,'query_type_')!==false); if($isf) $x['filtr']++;
        $x['ip'][$m[1]]=1; unset($x);
        if($isf) $tipai['filtrai']++; elseif(strpos($u,'add-to-cart=')!==false) $tipai['atc']++; elseif(preg_match('#[?&]s=#',$u)) $tipai['s']++; elseif(strpos($u,'orderby=')!==false) $tipai['orderby']++; elseif(strpos($u,'/page/')!==false) $tipai['page']++; elseif(strpos($u,'/preke/')===0) $tipai['preke']++; elseif(strpos($u,'/kategorija/')===0) $tipai['kat']++; elseif(strpos($u,'/gamintojas/')===0) $tipai['gam']++; elseif(strpos($u,'wc-ajax=')!==false) $tipai['wcajax']++; elseif(strpos($u,'admin-ajax')!==false) $tipai['adminajax']++; elseif(strpos($u,'/wp-json/')!==false) $tipai['wpjson']++; elseif(strpos($u,'wp-cron')!==false) $tipai['cron']++; else $tipai['kita']++;
        if($st==='403'){ $kk=preg_replace('#^(/[^/?]+/[^/?]+)[^?]*(\?.{0,25}).*#','$1…$2',$u); $k403[$kk]=($k403[$kk]??0)+1; }
        if($st==='500'){ $kk=substr($u,0,70); $k500[$kk]=($k500[$kk]??0)+1; }
        if(preg_match('/Macintosh; Intel Mac OS X 10_15_7/',$ua)){ $ipbot[$m[1]]=1; $ub=substr($ua,0,90); $uabot[$ub]=($uabot[$ub]??0)+1; if($st==='200'||$st==='301'||$st==='302'){ $kk=preg_replace('#^(/[^/?]+/[^/?]+)[^?]*(\?.{0,30}).*#','$1…$2',$u); $k200bot[$kk]=($k200bot[$kk]??0)+1; } }
        if(microtime(true)-$T0>230){ $r['access_nutraukta']=$n; break; } }
      if($isgz) gzclose($h); else fclose($h);
      foreach($hh as $k=>&$x){ $x['ip']=count($x['ip']); } unset($x); ksort($hh);
      arsort($k403); arsort($k500); arsort($k200bot); arsort($uabot);
      $r['access']=['eil'=>$n,'nuo'=>$pirm,'iki'=>$pask,'val'=>$hh,'tipai'=>$tipai,'k403_top'=>array_slice($k403,0,12,true),'k500_top'=>array_slice($k500,0,10,true),'macbot_ip_unik'=>count($ipbot),'macbot_ua_top'=>array_slice($uabot,0,4,true),'macbot_praeina_top'=>array_slice($k200bot,0,15,true)];
    }
    $el=null; foreach(glob($dom.'/logs/*') as $fx){ if(preg_match('/error/i',basename($fx))&&!preg_match('/\.(gz|tar)/',basename($fx))) $el=$fx; }
    if($el){ $sz=filesize($el); $h=fopen($el,'r'); fseek($h,max(0,$sz-300000)); $tx=stream_get_contents($h); fclose($h); $cnt=[]; $pask=''; foreach(explode("\n",$tx) as $ln){ if(!preg_match('/^\[(\w{3} \w{3} \d\d \d\d:\d\d:\d\d[^\]]*)\]/',$ln,$m)) continue; $pask=$m[1]; $key=mb_substr(preg_replace('#\d+#','N',preg_replace('#^\[[^\]]*\] \[[^\]]*\] \[[^\]]*\] ?#','',$ln)),0,120); if(!isset($cnt[$key])) $cnt[$key]=[0,'']; $cnt[$key][0]++; $cnt[$key][1]=$m[1]; } uasort($cnt,function($a,$b){return $b[0]-$a[0];}); $r['error_log']=['failas'=>basename($el),'kb'=>round($sz/1024),'pask'=>$pask,'tipai'=>array_slice($cnt,0,10,true)]; preg_match_all('/^\[(\w{3} \w{3} \d\d) (\d\d):\d\d:\d\d[^\]]*\].*(incomplete headers|failed to connect)/m',$tx,$mm); $fc=[]; foreach($mm[1] as $i=>$d){ $kk=$d.' '.$mm[2][$i]; $fc[$kk]=($fc[$kk]??0)+1; } $r['error_log']['fastcgi_val']=$fc; }
    if(class_exists('Petshop_Botu_Sargas')&&method_exists('Petshop_Botu_Sargas','suvestine')) $r['sargas_suvestine']=Petshop_Botu_Sargas::suvestine(2);
    $r['sesijos']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}woocommerce_sessions");
    $r['ps_carts_d']=$q("SELECT DATE(created_at) d, COUNT(*) n, SUM(converted_order_id IS NOT NULL) konv FROM {$P}ps_carts WHERE created_at>=CURDATE()-INTERVAL 3 DAY GROUP BY 1 ORDER BY 1");
    $r['load']=is_file('/proc/loadavg')?trim(file_get_contents('/proc/loadavg')):null;
  }
  if($f==='3'){
    $rp=get_option('ps_rytas_sargas_pask'); if(is_array($rp)){ $js=json_encode($rp,JSON_UNESCAPED_UNICODE); $r['rytas_pask']=strlen($js)>6000?mb_substr($js,0,6000).'…':$rp; } else $r['rytas_pask']=$rp;
    if($wpdb->get_var("SHOW TABLES LIKE '{$P}ps_sargas_klaidos'")){ $rows=$wpdb->get_results("SELECT * FROM {$P}ps_sargas_klaidos WHERE laikas>=DATE_SUB(NOW(),INTERVAL 36 HOUR) ORDER BY laikas DESC LIMIT 20",ARRAY_A); $r['sargo_klaidos']=array_map($trim,$rows); }
    $r['avpn_dubl']=$q("SELECT meta_value nr, COUNT(*) n FROM {$P}wc_orders_meta WHERE meta_key='_petshop_avpn_number' GROUP BY meta_value HAVING n>1");
    $r['disable_wp_cron']=defined('DISABLE_WP_CRON')?DISABLE_WP_CRON:null; $now=time(); $velu=0; $velu_pvz=[]; $viso=0; foreach(_get_cron_array() as $ts=>$hooks){ foreach($hooks as $h=>$x){ $viso++; if($ts<$now-900){ $velu++; if(count($velu_pvz)<8) $velu_pvz[]=[$h,(new DateTime('@'.$ts))->setTimezone($tz)->format('m-d H:i')]; } } } $r['cron']=['viso'=>$viso,'veluoja_15min'=>$velu,'pvz'=>$velu_pvz];
    $r['as_pending_velu']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$P}actionscheduler_actions WHERE status='pending' AND scheduled_date_gmt<UTC_TIMESTAMP()-INTERVAL 15 MINUTE");
    $up=wp_upload_dir()['basedir']; $r['feed_failai']=[]; foreach(array_unique(array_merge(glob($up.'/*.xml')?:[],glob($up.'/*feed*')?:[],glob($up.'/ps-feeds/*')?:[])) as $fx){ if(is_file($fx)) $r['feed_failai'][basename($fx)]=[round(filesize($fx)/1024).'KB',(new DateTime('@'.filemtime($fx)))->setTimezone($tz)->format('m-d H:i'),substr_count(file_get_contents($fx,false,null,0,min(filesize($fx),30000000)),'<item>')]; }
    foreach(['ps_feeds_pask','ps_feed_pask','ps_feeds_zurnalas'] as $on){ $v=get_option($on); if($v!==false) $r['opc'][$on]=is_array($v)?json_encode(array_slice($v,-3),JSON_UNESCAPED_UNICODE):$v; }
    $r['feed_ids_n']=function_exists('ps_feeds_ids')?count(ps_feeds_ids()):'nera f-jos';
    $r['dp_pask']=get_option('ps_dp_kainos_pask'); $z=get_option('ps_dp_kainos_zurnalas'); $r['dp_zurnalas']=is_array($z)?array_slice($z,-6):$z; $r['dp_nuolaidos']=get_option('ps_dp_nuolaidos');
    $r['dp_pakai_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key='_dp_base_product_id'");
    $cv=get_option('ps_cache_valymai'); $r['cache_valymai']=is_array($cv)?array_slice($cv,-12):$cv;
    $scd=WP_CONTENT_DIR.'/cache/supercache/petshop.lt'; $n=0; $old=null; if(is_dir($scd)){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($scd,FilesystemIterator::SKIP_DOTS)); foreach($it as $fi){ if(substr($fi->getFilename(),-5)==='.html'){ $n++; $mt=$fi->getMTime(); if($old===null||$mt<$old) $old=$mt; } if($n>40000) break; } } $r['supercache']=['psl'=>$n,'seniausias'=>$old?(new DateTime('@'.$old))->setTimezone($tz)->format('m-d H:i'):null];
    $cf=WP_CONTENT_DIR.'/wp-cache-config.php'; if(is_file($cf)){ $s=file_get_contents($cf); foreach(['cache_enabled','super_cache_enabled','wp_cache_mod_rewrite','wp_cache_not_logged_in','cache_max_time','wp_cache_mobile_enabled','wp_cache_mutex_disabled','cache_rebuild_files','wp_super_cache_late_init','wp_cache_no_cache_for_get','cache_compression'] as $kk){ if(preg_match('#^\$'.$kk.'\s*=\s*([^;]*);#m',$s,$mm)) $r['cache_cfg'][$kk]=trim($mm[1]); } }
    $r['wpai_imports']=$q("SELECT id,name,processing,executing,triggered,last_activity,imported,skipped,updated,count FROM {$P}pmxi_imports");
    $r['wpai_hist']=$q("SELECT import_id i,time_run,summary,date FROM {$P}pmxi_history WHERE date>=UTC_DATE()-INTERVAL 1 DAY ORDER BY id DESC LIMIT 14");
    $r['refill_status']=$q("SELECT status, COUNT(*) n, MIN(predicted_empty_date) mn, MAX(predicted_empty_date) mx FROM {$P}ps_refill_tracking GROUP BY 1");
    $r['refill_artimiausi']=$q("SELECT predicted_empty_date d, COUNT(*) n FROM {$P}ps_refill_tracking WHERE status='active' AND predicted_empty_date<='2026-10-10' GROUP BY 1 ORDER BY 1");
    $cols=$wpdb->get_col("SHOW COLUMNS FROM {$P}ps_email_jobs"); $dc=null; foreach($cols as $c){ if(preg_match('#^(created|created_at|sukurta|sukurta_at|scheduled_at|laikas)$#',$c)){ $dc=$c; break; } }
    if($dc){ $r['email_48h']=$q("SELECT flow, status, COALESCE(skip_reason,'') sr, COUNT(*) n FROM {$P}ps_email_jobs WHERE $dc>=DATE_SUB(NOW(),INTERVAL 48 HOUR) GROUP BY 1,2,3 ORDER BY 1,2"); $r['refill_jobs']=$q("SELECT flow,status,COALESCE(skip_reason,'') sr,COUNT(*) n, MAX($dc) pask FROM {$P}ps_email_jobs WHERE flow IN('refill_due','win_back') GROUP BY 1,2,3"); }
    foreach(['ps_lenteliu_valymas_pask','ps_sugrazinimas_pask','ps_gavimo_perrus_pask','ps_botu_sargas_isjungtas','ps_dydziai_katalogas_isjungta','ps_dp_kainos_isjungta'] as $on){ $v=get_option($on); $r['opcijos'][$on]=is_array($v)?json_encode($v,JSON_UNESCAPED_UNICODE):$v; }
    $lf=ini_get('error_log'); $r['php_log']=['kelias'=>$lf];
    if($lf && is_file($lf)){ $sz=filesize($lf); $r['php_log']['kb']=round($sz/1024); $h=fopen($lf,'r'); fseek($h,max(0,$sz-400000)); $tx=stream_get_contents($h); fclose($h); $cnt=[]; $d26=0; $d27=0; $fatal=0;
      foreach(explode("\n",$tx) as $ln){ if(!preg_match('#^\[(\d\d-\w{3}-\d{4} \d\d:\d\d:\d\d) ([^\]]+)\] (.*)$#',$ln,$m)) continue; $dt=DateTime::createFromFormat('d-M-Y H:i:s',$m[1],new DateTimeZone($m[2]=='UTC'?'UTC':'Europe/Vilnius')); if(!$dt) continue; $dt->setTimezone($tz); $dd=$dt->format('Y-m-d'); if($dd<'2026-09-26') continue; if($dd==='2026-09-27') $d27++; else $d26++; if(stripos($m[3],'Fatal')!==false) $fatal++;
        $key=mb_substr(preg_replace('#\d+#','N',$m[3]),0,150); if(!isset($cnt[$key])) $cnt[$key]=[0,'']; $cnt[$key][0]++; $cnt[$key][1]=$dt->format('m-d H:i'); }
      uasort($cnt,function($a,$b){return $b[0]-$a[0];}); $r['php_log']['tipai']=array_slice($cnt,0,12,true); $r['php_log']['d26']=$d26; $r['php_log']['d27']=$d27; $r['php_log']['fatal']=$fatal; }
    $r['mu_md5']=[]; foreach(['petshop-botu-sargas.php','petshop-dp-kainos.php','petshop-dydziai-katalogas.php','petshop-feeds.php','petshop-rytas.php','petshop-cache.php'] as $fn){ $p=WPMU_PLUGIN_DIR.'/'.$fn; $r['mu_md5'][$fn]=is_file($p)?substr(md5_file($p),0,8).' '.(new DateTime('@'.filemtime($p)))->setTimezone($tz)->format('m-d H:i'):'NERA'; }
    $r['heartbeat']=wp_remote_retrieve_response_code(wp_remote_get(home_url('/?ps_hb='.time()),['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1724']));
    $r['laikas']=(new DateTime('now',$tz))->format('Y-m-d H:i:s');
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $r['trukme_s']=round(microtime(true)-$T0,1);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
