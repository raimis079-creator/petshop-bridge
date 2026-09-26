<?php
/** Plugin Name: TEMP PS S1721c recon read-only: 301 keliai (botai), petshop-cache kodas, cache busena, WPAI#3, katalogo ir pardavimu eksportas pakuociu seimoms */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721c'])) return;
  $f=$_GET['ps_s1721c']; @set_time_limit(250); @ini_set('memory_limit','768M'); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1721c','faze'=>$f]; $T0=microtime(true);
  $tz=new DateTimeZone('Europe/Vilnius'); $mu=WPMU_PLUGIN_DIR;
  $q=function($sql) use ($wpdb,&$r){ $x=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error){ $r['SQL_ERR'][]=mb_substr($wpdb->last_error,0,200); } return $x; };
  try{
  if($f==='1'){
    $r['dabar']=(new DateTime('now',$tz))->format('H:i:s');
    $scd=WP_CONTENT_DIR.'/cache/supercache/petshop.lt'; $n=0; $old=null; if(is_dir($scd)){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($scd,FilesystemIterator::SKIP_DOTS)); foreach($it as $fi){ $fn=$fi->getFilename(); if(substr($fn,-5)==='.html'||substr($fn,-8)==='.html.gz'){ $n++; $mt=$fi->getMTime(); if($old===null||$mt<$old) $old=$mt; } if($n>40000) break; } }
    $r['supercache']=['psl'=>$n,'seniausias'=>$old?(new DateTime('@'.$old))->setTimezone($tz)->format('m-d H:i:s'):null];
    $cf=$mu.'/petshop-cache.php'; if(is_file($cf)) $r['petshop_cache']=mb_substr(file_get_contents($cf),0,12000);
    $r['wpai3_hist']=$q("SELECT type, time_run t, LEFT(REPLACE(summary,'<br>',' | '),80) s, date FROM {$P}pmxi_history WHERE import_id=3 ORDER BY id DESC LIMIT 8");
    $r['wpai3']=$q("SELECT processing,executing,triggered,queue_chunk_number,last_activity FROM {$P}pmxi_imports WHERE id=3");
    // 301 keliai siandien (tar.gz 00:10-04:05) + 302 keliai + 200 keliai top
    $fx=dirname(ABSPATH).'/logs/Sep-2026.tar.gz'; if(file_exists($fx)){ $gz=file_get_contents($fx); $tar=@gzdecode($gz); unset($gz); $len=strlen($tar); $pos=0; $txt='';
      while($pos+512<=$len){ $h=substr($tar,$pos,512); if(trim($h,"\0")==='') break; $name=rtrim(substr($h,0,100),"\0"); $size=octdec(trim(substr($h,124,12))); $type=substr($h,156,1); $pos+=512; if(($type==='0'||$type==="\0"||$type==='')&&preg_match('/log$|access|petshop/i',$name)&&!preg_match('/error|dev\./i',$name)) $txt.=substr($tar,$pos,$size); $pos+=ceil($size/512)*512; }
      unset($tar); $ls=explode("\n",$txt); unset($txt); $p301=[];$p302=[];$p200=[];$ua301=[];$ref301=[];$pv=[];$n301q=0;
      foreach($ls as $ln){ if(!preg_match('/^(\S+) \S+ \S+ \[[^\]]+\] "(\S+) (\S+)[^"]*" (\d{3}) \S+ "([^"]*)" "([^"]*)"/',$ln,$m)) continue; $u=$m[3]; $pth=preg_replace('/\?.*/','',$u); $pth2=preg_replace('#^/(kategorija|preke|gamintojas|product)/[^/?]+#','/$1/*',$pth); $pth2=preg_replace('#/page/\d+#','/page/N',$pth2);
        if($m[4]==='301'){ $k=$pth2.(strpos($u,'?')!==false?' ?'.substr(preg_replace('/=[^&]*/','=',substr($u,strpos($u,'?')+1)),0,50):''); $p301[$k]=($p301[$k]??0)+1; $uu=substr($m[6],0,50); $ua301[$uu]=($ua301[$uu]??0)+1; $rf=preg_replace('#https?://[^/]+#','',$m[5]); $rf=preg_replace('/\?.*/','?',$rf); $rf=preg_replace('#^/(kategorija|preke|gamintojas|product)/[^/?]+#','/$1/*',$rf); $ref301[$rf]=($ref301[$rf]??0)+1; if(count($pv)<6&&strpos($u,'/page/')===false) $pv[]=substr($u,0,160).' <- '.substr($m[5],0,120); }
        elseif($m[4]==='302'){ $p302[$pth2]=($p302[$pth2]??0)+1; }
        elseif($m[4]==='200'&&$m[2]==='GET'){ $k=$pth2.(strpos($u,'?')!==false?' ?':''); $p200[$k]=($p200[$k]??0)+1; } }
      arsort($p301); arsort($p302); arsort($p200); arsort($ua301); arsort($ref301);
      $r['p301']=array_slice($p301,0,16,true); $r['p301_ref']=array_slice($ref301,0,10,true); $r['p301_ua']=array_slice($ua301,0,5,true); $r['p301_pvz']=$pv; $r['p302']=array_slice($p302,0,10,true); $r['p200']=array_slice($p200,0,20,true); }
    $r['trukme_s']=round(microtime(true)-$T0,1);
  }
  if($f==='2'){
    // katalogo eksportas: publikuotos prekes su meta/terminais
    $ids=$wpdb->get_col("SELECT ID FROM {$P}posts WHERE post_type='product' AND post_status='publish'"); $in=implode(',',array_map('intval',$ids));
    $out=[]; foreach($wpdb->get_results("SELECT ID,post_title,post_name FROM {$P}posts WHERE ID IN ($in)",ARRAY_A) as $x){ $out[(int)$x['ID']]=['t'=>$x['post_title'],'sl'=>$x['post_name']]; }
    $keys="'_sku','_price','_regular_price','_stock_status','_stock','_manage_stock','_ps_sandelis','_weight','_ps_dydzio_seima','_ps_tik_kurjeriu','_cost_price','_own_stock_qty','_ps_pakuociu','_ps_ranka_isimta'";
    foreach($wpdb->get_results("SELECT post_id,meta_key,meta_value FROM {$P}postmeta WHERE post_id IN ($in) AND meta_key IN ($keys)",ARRAY_A) as $m){ $pid=(int)$m['post_id']; if(!isset($out[$pid])) continue; $out[$pid][ltrim($m['meta_key'],'_')]=mb_substr((string)$m['meta_value'],0,80); }
    foreach($wpdb->get_results("SELECT tr.object_id pid, tt.taxonomy tx, t.slug, t.name FROM {$P}term_relationships tr JOIN {$P}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$P}terms t ON t.term_id=tt.term_id WHERE tr.object_id IN ($in) AND tt.taxonomy IN ('product_cat','product_brand','pa_pakuotes_dydis','pa_gyvuno_rusis','product_type')",ARRAY_A) as $m){ $pid=(int)$m['pid']; if(!isset($out[$pid])) continue; $tx=$m['tx']; if($tx==='product_cat') $out[$pid]['cat'][]=$m['slug']; elseif($tx==='product_brand') $out[$pid]['brand']=$m['slug']; elseif($tx==='pa_pakuotes_dydis') $out[$pid]['pak']=$m['name']; elseif($tx==='pa_gyvuno_rusis') $out[$pid]['gyv'][]=$m['slug']; elseif($tx==='product_type') $out[$pid]['tipas']=$m['slug']; }
    foreach($wpdb->get_results("SELECT product_id pid, source, stock_qty, cost_net FROM {$P}ps_sources WHERE product_id IN ($in)",ARRAY_A) as $m){ $pid=(int)$m['pid']; if(!isset($out[$pid])) continue; $out[$pid]['src'][]=$m['source'].':'.$m['stock_qty'].':'.$m['cost_net']; }
    if($wpdb->last_error) $r['SQL_ERR'][]=$wpdb->last_error;
    $r['n']=count($out); $r['prekes']=$out;
  }
  if($f==='3'){
    $r['ist365']=$q("SELECT preke_id pid, SUM(kiekis) q, ROUND(SUM(kaina_ct)/100) s, COUNT(DISTINCT uzsakymas_id) o FROM {$P}ps_ist_fakt_eilutes WHERE COALESCE(testinis,0)=0 AND diena>='2025-09-26' AND preke_id>0 GROUP BY preke_id");
    $r['ist90']=$q("SELECT preke_id pid, SUM(kiekis) q, ROUND(SUM(kaina_ct)/100) s, COUNT(DISTINCT uzsakymas_id) o FROM {$P}ps_ist_fakt_eilutes WHERE COALESCE(testinis,0)=0 AND diena>='2026-06-08' AND preke_id>0 GROUP BY preke_id");
    $r['wc']=$q("SELECT preke_id pid, SUM(kiekis) q, ROUND(SUM(kaina_ct)/100) s, COUNT(DISTINCT uzsakymas_id) o, ROUND(SUM(kaina_ct-pvm_ct-savikaina_ct)/100) marza FROM {$P}ps_fakt_eilutes WHERE COALESCE(testinis,0)=0 AND preke_id>0 GROUP BY preke_id");
    $r['ist_ribos']=$q("SELECT MIN(diena) nuo, MAX(diena) iki, COUNT(*) n FROM {$P}ps_ist_fakt_eilutes");
    $r['wc_ribos']=$q("SELECT MIN(diena) nuo, MAX(diena) iki, COUNT(*) n FROM {$P}ps_fakt_eilutes");
    // paieskos ir perziuros: kiek karto prekes puslapiai perziureti (ps_web_ivykiai, 14 d.) — populiarumas be pirkimo
    $r['perziuros']=$q("SELECT raktas pid, COUNT(*) n FROM {$P}ps_web_ivykiai WHERE tipas='puslapis' AND pusl_tipas='preke' AND laikas>=NOW()-INTERVAL 14 DAY AND COALESCE(testinis,0)=0 GROUP BY raktas ORDER BY n DESC LIMIT 300");
    if(!empty($r['SQL_ERR'])){ $r['web_tipai']=$q("SELECT tipas, pusl_tipas, COUNT(*) n FROM {$P}ps_web_ivykiai WHERE laikas>=NOW()-INTERVAL 2 DAY GROUP BY 1,2 ORDER BY n DESC LIMIT 15"); $r['web_pvz']=$q("SELECT tipas,pusl_tipas,url_kelias,raktas,raktas2 FROM {$P}ps_web_ivykiai WHERE pusl_tipas LIKE '%prek%' OR url_kelias LIKE '/product/%' ORDER BY id DESC LIMIT 3"); }
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $r['trukme_s']=round(microtime(true)-$T0,1); $r['mem_mb']=round(memory_get_peak_usage(true)/1048576);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
