<?php
/** Plugin Name: TEMP PS S1736p šiandienos laiškai tiekėjams (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1736p'])) return;
  $f=$_GET['ps_s1736p']; @set_time_limit(200); $r=['v'=>'S1736p','faze'=>$f];
  try{
  if($f==='1'){ $a=(array)get_option('ps_laisku_archyvas',[]);
    foreach(array_slice($a,0,6) as $l){ $h=(string)$l['html']; $t=preg_replace(['~</t[dh]>~','~</tr>~','~</p>~'],[' | ',"\n","\n"],$h); $r['l'][]=['laikas'=>$l['laikas'],'kam'=>$l['kam'],'tema'=>$l['tema'],'kont'=>$l['kont'],'priedai'=>$l['priedai'],'tekstas'=>mb_substr(trim(wp_strip_all_tags($t)),0,1500)]; } }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
