<?php
/** Plugin Name: TEMP PS S1721d recon read-only: WPAI trigger/processing hit'ai access loge (00:10-04:05), pmxi busena, kas iskviete pilna cache valyma (php_error rmdir laikai) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721d'])) return;
  $f=$_GET['ps_s1721d']; @set_time_limit(250); @ini_set('memory_limit','768M'); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1721d','faze'=>$f]; $T0=microtime(true);
  $tz=new DateTimeZone('Europe/Vilnius');
  $q=function($sql) use ($wpdb,&$r){ $x=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error){ $r['SQL_ERR'][]=mb_substr($wpdb->last_error,0,200); } return $x; };
  try{
  if($f==='1'){
    $r['dabar']=(new DateTime('now',$tz))->format('H:i:s');
    $r['wpai_hist_dabar']=$q("SELECT import_id i, type, time_run t, date FROM {$P}pmxi_history ORDER BY id DESC LIMIT 8");
    $r['wpai_imports']=$q("SELECT id,processing,executing,triggered,queue_chunk_number,last_activity FROM {$P}pmxi_imports WHERE id IN(2,3,5,7)");
    // WPAI hit'ai access loge (tar.gz 00:10-04:05 ir vakar .1 04:23-00:10)
    foreach(['Sep-2026.tar.gz','Sep-2026.tar.gz.1'] as $k){ $fx=dirname(ABSPATH).'/logs/'.$k; if(!file_exists($fx)) continue; $gz=file_get_contents($fx); $tar=@gzdecode($gz); unset($gz); $len=strlen($tar); $pos=0; $txt='';
      while($pos+512<=$len){ $h=substr($tar,$pos,512); if(trim($h,"\0")==='') break; $name=rtrim(substr($h,0,100),"\0"); $size=octdec(trim(substr($h,124,12))); $type=substr($h,156,1); $pos+=512; if(($type==='0'||$type==="\0"||$type==='')&&preg_match('/log$|access|petshop/i',$name)&&!preg_match('/error|dev\./i',$name)) $txt.=substr($tar,$pos,$size); $pos+=ceil($size/512)*512; }
      unset($tar); $hits=[]; $cnt=[];
      foreach(explode("\n",$txt) as $ln){ if(strpos($ln,'import_key=')===false) continue; if(!preg_match('/\[(\d\d)\/\w{3}\/\d{4}:(\d\d):(\d\d)[^\]]*\] "(\S+) (\S+)[^"]*" (\d{3})/',$ln,$m)) continue; parse_str(substr($m[5],strpos($m[5],'?')+1),$g); $key=($g['import_id']??'?').' '.($g['action']??'?'); $cnt[$key]=($cnt[$key]??0)+1; if(($g['action']??'')==='trigger'){ $hits[]=$m[1].' '.$m[2].':'.$m[3].' '.$key.' '.$m[6]; } }
      unset($txt); $r[$k]=['kiek'=>$cnt,'trigger_hitai'=>array_slice($hits,0,60)]; }
    // php_error.log: kada buvo masiniai rmdir (pilnas valymas) — grupuoti pagal minute
    $lf=ini_get('error_log'); if($lf&&is_file($lf)){ $sz=filesize($lf); $h=fopen($lf,'r'); fseek($h,max(0,$sz-800000)); $tx=stream_get_contents($h); fclose($h); $min=[]; foreach(explode("\n",$tx) as $ln){ if(strpos($ln,'rmdir(')===false) continue; if(!preg_match('#^\[(\d\d-\w{3}-\d{4} \d\d:\d\d):\d\d ([^\]]+)\]#',$ln,$m)) continue; $dt=DateTime::createFromFormat('d-M-Y H:i',$m[1],new DateTimeZone($m[2]=='UTC'?'UTC':'Europe/Vilnius')); if(!$dt) continue; $dt->setTimezone($tz); $k=$dt->format('m-d H:i'); $min[$k]=($min[$k]??0)+1; } ksort($min); $r['rmdir_minutes']=array_slice($min,-40,40,true); }
    // sargo klaidos: rmdir irasai su URL per paskutines 30 val. (kas kviete)
    $r['rmdir_url']=$q("SELECT DATE_FORMAT(laikas,'%m-%d %H:%i') l, LEFT(url,70) u, SUM(kiek) k, COUNT(*) n FROM {$P}ps_sargas_klaidos WHERE zinute LIKE 'rmdir%' AND laikas>=NOW()-INTERVAL 30 HOUR GROUP BY 1,2 ORDER BY laikas DESC LIMIT 40");
    $r['trukme_s']=round(microtime(true)-$T0,1);
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $r['trukme_s']=round(microtime(true)-$T0,1); $r['mem_mb']=round(memory_get_peak_usage(true)/1048576);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
