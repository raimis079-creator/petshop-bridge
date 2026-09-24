<?php
/** Plugin Name: TEMP PS S1714f 500 URL is access logu read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1714f'])) return;
  @set_time_limit(170); $r=['v'=>'S1714f'];
  try{
    $base=dirname(rtrim(ABSPATH,'/')).'/logs/'; $files=glob($base.'Sep-2026.tar.gz*'); usort($files,function($a,$b){return filemtime($b)-filemtime($a);});
    $r['failai']=array_map(function($f){return basename($f).' '.date('m-d H:i',filemtime($f));},$files);
    $urls=[]; $pvz=[]; $n=0; $dienos=[]; $ua=[];
    foreach(array_slice($files,0,3) as $f){ $gz=@gzopen($f,'r'); if(!$gz) continue; while(($ln=gzgets($gz,8192))!==false){ if(strpos($ln,'" 500 ')===false) continue; if(!preg_match('#\[(\d\d/Sep/2026):([\d:]+)[^\]]*\] "(\w+) ([^ "]+)[^"]*" 500 \d+ "[^"]*" "([^"]{0,60})#',$ln,$m)) continue; $n++; $u=preg_replace('#\?.*#','',$m[4]); $urls[$u]=($urls[$u]??0)+1; $dienos[$m[1]]=($dienos[$m[1]]??0)+1; $k=substr($m[5],0,25); $ua[$k]=($ua[$k]??0)+1; if(count($pvz)<12 && strpos($m[4],'?')!==false) $pvz[]=$m[1].' '.$m[2].' '.$m[4].' | '.substr($m[5],0,40); } gzclose($gz); }
    arsort($urls); $r['n500']=$n; $r['dienos']=$dienos; $r['url_top']=array_slice($urls,0,25,true); arsort($ua); $r['ua']=array_slice($ua,0,10,true); $r['pvz_su_query']=$pvz;
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
