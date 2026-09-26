<?php
/** Plugin Name: TEMP PS S1721b recon read-only: Super Cache kas valo, fakt_reklama GAQL, WPAI istorija/#2, Fatal eilutes, dydziai modelis, lenteliu stulpeliai */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721b'])) return;
  $f=$_GET['ps_s1721b']; @set_time_limit(250); @ini_set('memory_limit','512M'); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1721b','faze'=>$f]; $T0=microtime(true);
  $tz=new DateTimeZone('Europe/Vilnius'); $mu=WPMU_PLUGIN_DIR;
  $q=function($sql) use ($wpdb,&$r){ $x=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error){ $r['SQL_ERR'][]=mb_substr($wpdb->last_error,0,200); } return $x; };
  try{
  if($f==='1'){
    // A. Super Cache busena DABAR (pirmas veiksmas) — ar snippet'o kurimas isvale kesa
    $r['dabar']=(new DateTime('now',$tz))->format('H:i:s');
    $scd=WP_CONTENT_DIR.'/cache/supercache/petshop.lt'; $n=0; $old=null; $new=null; $hist=[]; if(is_dir($scd)){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($scd,FilesystemIterator::SKIP_DOTS)); foreach($it as $fi){ $fn=$fi->getFilename(); if(substr($fn,-5)==='.html'||substr($fn,-8)==='.html.gz'){ $n++; $mt=$fi->getMTime(); if($old===null||$mt<$old) $old=$mt; if($new===null||$mt>$new) $new=$mt; $hk=(new DateTime('@'.$mt))->setTimezone($tz)->format('H:i'); $hist[$hk]=($hist[$hk]??0)+1; } if($n>40000) break; } }
    ksort($hist); $r['supercache']=['psl'=>$n,'seniausias'=>$old?(new DateTime('@'.$old))->setTimezone($tz)->format('m-d H:i:s'):null,'naujausias'=>$new?(new DateTime('@'.$new))->setTimezone($tz)->format('m-d H:i:s'):null,'pagal_min'=>$hist];
    $cf=WP_CONTENT_DIR.'/wp-cache-config.php'; if(is_file($cf)){ $s=file_get_contents($cf); foreach(['cache_max_time','cache_time_interval','cache_schedule_type','cache_scheduled_time','cache_schedule_interval','wp_cache_shutdown_gc','wp_cache_preload_on','wp_cache_clear_on_post_edit','wp_cache_refresh_single_only','wpsc_save_headers','cache_rebuild_files','wp_cache_mutex_disabled','wp_cache_object_cache','wp_super_cache_late_init','wp_cache_no_cache_for_get','wp_cache_pages','wpsc_ignore_tracking_parameters'] as $kk){ if(preg_match('#^\$'.$kk.'\s*=\s*([^;]*);#m',$s,$mm)) $r['cache_cfg'][$kk]=mb_substr(trim($mm[1]),0,300); } }
    $r['cache_cron']=[]; foreach(_get_cron_array() as $ts=>$hooks){ foreach($hooks as $h=>$x){ if(preg_match('#wp_cache|wpsc|supercache#i',$h)) $r['cache_cron'][]=[$h,(new DateTime('@'.$ts))->setTimezone($tz)->format('m-d H:i')]; } }
    $r['wpsc_last_gc']=get_option('wpsupercache_gc_time');
    // kas kviecia wp_cache_clear_cache / prune / wpsc_delete_files musu kode ir Code Snippets
    $r['cache_kvieteju']=[];
    $dirs=array_merge(glob($mu.'/*.php'),glob($mu.'/petshop-core/*.php'),glob($mu.'/petshop-core/includes/*.php'),glob(get_stylesheet_directory().'/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/*.php'),glob(WP_PLUGIN_DIR.'/code-snippets/php/*.php'),glob(WP_PLUGIN_DIR.'/code-snippets/php/*/*.php'),glob(WP_PLUGIN_DIR.'/code-snippets/php/*/*/*.php'));
    foreach($dirs as $g){ $s=@file_get_contents($g); if($s===false) continue; if(preg_match_all('#[^\n]{0,140}(wp_cache_clear_cache|prune_super_cache|wpsc_delete_files|wp_cache_post_change|wp_cache_clean_cache|clear_post_supercache|wpsc_rebuild|wp_cache_flush\(\)|clean_snippets_cache)[^\n]{0,160}#',$s,$mm)) $r['cache_kvieteju'][str_replace(ABSPATH,'',$g)]=array_slice(array_map(function($x){return mb_substr(trim($x),0,300);},$mm[0]),0,6); }
    $sn=$q("SELECT id,name FROM {$P}snippets WHERE active=1 AND (code LIKE '%wp_cache_clear_cache%' OR code LIKE '%prune_super_cache%' OR code LIKE '%wpsc_delete_files%')"); $r['cache_snippetai']=$sn;
    // Super Cache hook'ai: kas kabinasi prie wp_cache_clear_cache_on_menu / savo hookai ant save_post
    global $wp_filter; foreach(['save_post','edit_post','woocommerce_product_set_stock','woocommerce_variation_set_stock','woocommerce_product_object_updated_props','updated_option','edit_terms','transition_post_status','wp_insert_post','code_snippets/create_snippet','code_snippets/update_snippet','code_snippets/activate_snippet','code_snippets/activate_snippets'] as $hk){ if(!isset($wp_filter[$hk])) continue; foreach($wp_filter[$hk]->callbacks as $pr=>$cbs){ foreach($cbs as $cb){ $fn=$cb['function']; $nm=is_string($fn)?$fn:(is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:'closure'); if(preg_match('#cache|wpsc|snippet|petshop_cache|Petshop_Cache#i',$nm)) $r['hookai'][$hk][]=$pr.' '.$nm; } } }
    // B. ps_fakt_reklama traukimo kodas (GAQL) — ar SHOPPING kampanijos itraukiamos
    $r['reklama_kodas']=[];
    foreach(array_merge(glob($mu.'/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/*.php'),glob(WP_PLUGIN_DIR.'/petshop-*/includes/*.php')) as $g){ $s=file_get_contents($g); if(strpos($s,'ps_fakt_reklama')!==false){ preg_match_all('#[^\n]{0,200}(advertising_channel_type|FROM campaign|campaign\.status|metrics\.impressions|WHERE segments\.date|googleads\.googleapis|searchStream|search\?|customers/)[^\n]{0,260}#',$s,$mm); $r['reklama_kodas'][str_replace(ABSPATH,'',$g)]=array_slice(array_map(function($x){return mb_substr(trim($x),0,460);},$mm[0]),0,10); } }
    $r['reklama_24289581247']=$q("SELECT diena, parodymai, paspaudimai, islaidos_ct FROM {$P}ps_fakt_reklama WHERE kampanija_id IN('24289581247','24274413499') ORDER BY diena DESC LIMIT 6");
    $r['reklama_zurnalas']=get_option('ps_fakt_reklama_pask')?:get_option('ps_fakt_reklama_log'); if(is_array($r['reklama_zurnalas'])) $r['reklama_zurnalas']=json_decode(mb_substr(json_encode($r['reklama_zurnalas'],JSON_UNESCAPED_UNICODE),0,1500));
    $r['reklama_opcijos']=$q("SELECT option_name, LEFT(option_value,300) v FROM {$P}options WHERE option_name LIKE 'ps_fakt_reklama%' OR option_name LIKE 'ps_ads_%' OR option_name LIKE 'ps_reklama%'");
    // C. WPAI istorija 24 h visiems importams + #2 busena
    $r['wpai_hist_24h']=$q("SELECT import_id i, type, time_run t, LEFT(REPLACE(summary,'<br>',' | '),90) s, date FROM {$P}pmxi_history WHERE date>=NOW()-INTERVAL 30 HOUR ORDER BY id DESC LIMIT 60");
    $r['wpai_hist_n']=$q("SELECT import_id, COUNT(*) n, MIN(date) nuo, MAX(date) iki FROM {$P}pmxi_history GROUP BY import_id");
    $r['wpai2']=$q("SELECT id,name,processing,executing,triggered,queue_chunk_number,imported,skipped,count,last_activity,registered_on FROM {$P}pmxi_imports WHERE id IN(2,3)");
    $r['wpai_cron_da']=$q("SELECT option_name, LEFT(option_value,200) v FROM {$P}options WHERE option_name LIKE '%pmxi%' AND option_name NOT LIKE '%_transient_%' LIMIT 15");
    // D. Fatal eilutes pilnai + login sargas 'ivyko'
    $lf=ini_get('error_log'); if($lf&&is_file($lf)){ $sz=filesize($lf); $h=fopen($lf,'r'); fseek($h,max(0,$sz-500000)); $tx=stream_get_contents($h); fclose($h); $ls=explode("\n",$tx); $fat=[]; $stack=[]; for($i=0;$i<count($ls);$i++){ if(stripos($ls[$i],'Fatal')!==false){ $fat[]=mb_substr($ls[$i],0,700); for($j=1;$j<=6&&$i+$j<count($ls);$j++){ if(preg_match('/^(#\d|Stack|\[)/',trim($ls[$i+$j]))) $fat[]='   '.mb_substr($ls[$i+$j],0,260); else break; } } } $r['fatal']=array_slice($fat,-24); }
    // E. dydziai modelis
    $df=$mu.'/petshop-dydziai.php'; if(is_file($df)){ $s=file_get_contents($df); $r['dydziai_kb']=round(strlen($s)/1024,1); $r['dydziai']=mb_substr($s,0,14000); }
    $r['seima_reiksmes']=$q("SELECT meta_value v, COUNT(*) n, GROUP_CONCAT(post_id ORDER BY post_id) ids FROM {$P}postmeta WHERE meta_key='_ps_dydzio_seima' AND meta_value<>'' GROUP BY meta_value ORDER BY n DESC LIMIT 40");
    $r['seima_kiti_meta']=$q("SELECT meta_key, COUNT(*) n FROM {$P}postmeta WHERE meta_key LIKE '_ps_dyd%' OR meta_key LIKE '_ps_seim%' OR meta_key LIKE '_ps_pak%' GROUP BY 1");
    $r['pak_dydis_terms']=$q("SELECT t.name, t.slug, tt.count FROM {$P}terms t JOIN {$P}term_taxonomy tt ON tt.term_id=t.term_id WHERE tt.taxonomy='pa_pakuotes_dydis' ORDER BY tt.count DESC LIMIT 60");
    // F. lenteliu stulpeliai eksportui
    foreach(['ps_fakt_eilutes','ps_fakt_uzsakymai','ps_ist_eilutes','ps_ist_uzsakymai','ps_ist_fakt_eilutes'] as $t){ $r['cols'][$t]=$wpdb->get_col("SHOW COLUMNS FROM {$P}$t"); }
    $r['ist_pvz']=$q("SELECT * FROM {$P}ps_ist_eilutes ORDER BY id DESC LIMIT 2"); $r['ist_uzs_pvz']=$q("SELECT * FROM {$P}ps_ist_uzsakymai ORDER BY id DESC LIMIT 1"); $r['fakt_eil_pvz']=$q("SELECT * FROM {$P}ps_fakt_eilutes ORDER BY id DESC LIMIT 1");
    $r['laikas']=(new DateTime('now',$tz))->format('Y-m-d H:i:s');
  }
  if($f==='2'){
    // access logai 09-24 (.3) ir 09-25 (.1) ir dabartinis (.gz) — per valanda, statusai, atc/filtrai
    $dom=dirname(ABSPATH); @ini_set('memory_limit','768M');
    foreach(['Sep-2026.tar.gz.3','Sep-2026.tar.gz.1','Sep-2026.tar.gz'] as $k){ $fx=$dom.'/logs/'.$k; if(!file_exists($fx)) continue; $gz=file_get_contents($fx); $tar=@gzdecode($gz); unset($gz); if($tar===false){ $r[$k]='gzdecode klaida'; continue; }
      $len=strlen($tar); $pos=0; $members=[]; $txt='';
      while($pos+512<=$len){ $h=substr($tar,$pos,512); if(trim($h,"\0")==='') break; $name=rtrim(substr($h,0,100),"\0"); $size=octdec(trim(substr($h,124,12))); $type=substr($h,156,1); $members[]=[$name,$size]; $pos+=512; if($type==='0'||$type==="\0"||$type===''){ if(preg_match('/log$|access|petshop/i',$name)&&!preg_match('/error|dev\./i',$name)) $txt.=substr($tar,$pos,$size); } $pos+=ceil($size/512)*512; }
      unset($tar); $x=['nariai'=>array_slice($members,0,6),'txt_mb'=>round(strlen($txt)/1048576,1),'n'=>0,'st'=>[],'atc'=>0,'atc_302'=>0,'filtrai'=>0,'filtrai_302'=>0,'cron'=>0,'wcajax'=>0,'yith_ajax'=>0,'val'=>[],'ip'=>[],'bot_ua'=>0,'html_200_be_bot'=>0,'nuo'=>null,'iki'=>null];
      $ls=explode("\n",$txt); unset($txt);
      foreach($ls as $ln){ if(!preg_match('/^(\S+) \S+ \S+ \[(\d\d)\/\w{3}\/\d{4}:(\d\d)[^\]]*\] "(\S+) (\S+)[^"]*" (\d{3})/',$ln,$m)) continue; $x['n']++; if(!$x['nuo']) $x['nuo']=substr($ln,strpos($ln,'[')+1,20); $x['iki']=substr($ln,strpos($ln,'[')+1,20); $x['st'][$m[6]]=($x['st'][$m[6]]??0)+1; $hk=$m[2].' '.$m[3]; $x['val'][$hk]=($x['val'][$hk]??0)+1; $x['ip'][$m[1]]=1;
        $u=$m[5]; if(strpos($u,'add-to-cart=')!==false){ $x['atc']++; if($m[6]==='302') $x['atc_302']++; } if(strpos($u,'yith_wcan=')!==false||strpos($u,'filter_')!==false){ $x['filtrai']++; if($m[6]==='302') $x['filtrai_302']++; } if(strpos($u,'wp-cron.php')!==false) $x['cron']++; if(strpos($u,'wc-ajax=')!==false) $x['wcajax']++; if(strpos($u,'yith_wcan_shortcode')!==false||strpos($u,'admin-ajax')!==false) $x['yith_ajax']++; if(preg_match('/bot|crawl|spider|GPT|Claude|Bing|Yandex|python|curl|Go-http/i',$ln)) $x['bot_ua']++; }
      unset($ls); $x['ip']=count($x['ip']); ksort($x['val']); $r[$k]=$x; if(microtime(true)-$T0>170){ $r['nutraukta_po']=$k; break; } }
    $r['trukme_s']=round(microtime(true)-$T0,1); $r['mem_mb']=round(memory_get_peak_usage(true)/1048576);
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $r['trukme_s']=round(microtime(true)-$T0,1);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
