<?php
/** Plugin Name: TEMP PS S1719e — access logų analizė (tar.gz, read-only) (j) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719e'])) return; $r=['v'=>'S1719e','t'=>date('Y-m-d H:i:s')]; @set_time_limit(250); @ini_set('memory_limit','768M');
  $dom=dirname(ABSPATH); $T0=microtime(true);
  try{
    $files=[$dom.'/logs/Sep-2026.tar.gz',$dom.'/logs/Sep-2026.tar.gz.1'];
    foreach($files as $fx){ if(!file_exists($fx)) continue; $k=basename($fx); $gz=file_get_contents($fx); $tar=@gzdecode($gz); unset($gz); if($tar===false){ $r[$k]='gzdecode klaida'; continue; }
      $len=strlen($tar); $pos=0; $members=[]; $txt='';
      while($pos+512<=$len){ $h=substr($tar,$pos,512); if(trim($h,"\0")==='') break; $name=rtrim(substr($h,0,100),"\0"); $size=octdec(trim(substr($h,124,12))); $type=substr($h,156,1); $members[]=[$name,$size,$type]; $pos+=512; if($type==='0'||$type==="\0"||$type===''){ if(preg_match('/log$|access|petshop/i',$name)&&!preg_match('/error|dev\./i',$name)) $txt.=substr($tar,$pos,$size); } $pos+=ceil($size/512)*512; }
      unset($tar); $r[$k]=['tar_mb'=>round($len/1048576,1),'nariai'=>array_slice($members,0,8),'txt_mb'=>round(strlen($txt)/1048576,1)];
      if($txt===''){ continue; }
      $ls=explode("\n",$txt); unset($txt); $n=0;$st=[];$ua=[];$ip=[];$atc=0;$atc_ip=[];$atc_ua=[];$first=null;$last=null;$bots=0;$paths=[];$cron=0;$ajax=0;$wcajax=0;$store=0;$cat_q=0;$admin=0;$login=0;$hours=[];
      foreach($ls as $ln){ if(!preg_match('/^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+)[^"]*" (\d{3}) (\S+)(?: "([^"]*)" "([^"]*)")?/',$ln,$m)) continue; $n++; if(!$first) $first=$m[2]; $last=$m[2]; $st[$m[5]]=($st[$m[5]]??0)+1; $u=preg_replace('/^Mozilla\/5\.0 /','',substr($m[8]??'-',0,70)); $ua[$u]=($ua[$u]??0)+1; $ip[$m[1]]=($ip[$m[1]]??0)+1; $hr=substr($m[2],12,2); $hours[$hr]=($hours[$hr]??0)+1;
        if(preg_match('/bot|crawl|spider|GPT|Claude|Bing|Yandex|Semrush|Ahrefs|python|curl|Go-http|Scrapy|facebook|Amazonbot|Bytespider|PetalBot|DataForSeo|MJ12/i',$m[8]??'')) $bots++;
        if(strpos($m[4],'add-to-cart=')!==false){ $atc++; $atc_ip[$m[1]]=($atc_ip[$m[1]]??0)+1; $atc_ua[$u]=($atc_ua[$u]??0)+1; }
        if(strpos($m[4],'wp-cron.php')!==false) $cron++; if(strpos($m[4],'admin-ajax.php')!==false) $ajax++; if(strpos($m[4],'wc-ajax=')!==false) $wcajax++; if(strpos($m[4],'wc/store')!==false) $store++; if(strpos($m[4],'yith_wcan=')!==false||strpos($m[4],'filter_')!==false) $cat_q++; if(strpos($m[4],'/wp-admin/')===0) $admin++; if(strpos($m[4],'wp-login.php')!==false&&$m[3]==='POST') $login++;
        $pth=preg_replace('/\?.*/','',$m[4]); $pth=preg_replace('/\/page\/\d+/','/page/N',$pth); $pth=preg_replace('#^/(kategorija|preke|gamintojas)/[^/]+#','/$1/*',$pth); $paths[$pth]=($paths[$pth]??0)+1; }
      arsort($ua); arsort($ip); arsort($atc_ip); arsort($atc_ua); arsort($paths); ksort($hours);
      $r[$k]+=['n'=>$n,'nuo'=>$first,'iki'=>$last,'statusai'=>$st,'botai_pct'=>$n?round(100*$bots/$n):null,'add_to_cart'=>$atc,'atc_ip_top'=>array_slice($atc_ip,0,8,true),'atc_ua_top'=>array_slice($atc_ua,0,6,true),'wp_cron'=>$cron,'admin_ajax'=>$ajax,'wc_ajax'=>$wcajax,'wc_store'=>$store,'filtrai'=>$cat_q,'wp_admin'=>$admin,'login_post'=>$login,'ua_top'=>array_slice($ua,0,14,true),'ip_top'=>array_slice($ip,0,10,true),'keliai_top'=>array_slice($paths,0,14,true),'valandos'=>$hours];
      if(microtime(true)-$T0>150) break; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $r['trukme_s']=round(microtime(true)-$T0,1); $r['mem_mb']=round(memory_get_peak_usage(true)/1048576);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},1);
