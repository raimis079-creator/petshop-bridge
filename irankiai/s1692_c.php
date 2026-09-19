<?php
/** TEMP PS S1692 c — zb-import.log šiandien: ZB-BLOCK-CREATE pagal reason, „Array" likučiai; batch/v1 užklausų šaltinis (access log nėra — tik laikas). Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1692c'])) return; $o=array();
  $f=WP_CONTENT_DIR.'/uploads/petshop-private-logs/zb-import.log'; $o['dydis']=file_exists($f)?filesize($f):null; $o['pask']=file_exists($f)?date('m-d H:i',filemtime($f)):null;
  if (file_exists($f)){ $sz=filesize($f); $fh=fopen($f,'r'); fseek($fh,max(0,$sz-1500000)); $t=fread($fh,1500000); fclose($fh); $lines=explode("\n",$t);
    $today=array(); foreach ($lines as $l){ if (strpos($l,'2026-09-19')!==false || strpos($l,'19-Sep-2026')!==false) $today[]=$l; }
    $o['siandien_eil']=count($today); $reasons=array(); $arr=0; $brands=array();
    foreach ($today as $l){ if (preg_match('/reason=([a-z_]+)/',$l,$m)) $reasons[$m[1]]=($reasons[$m[1]]??0)+1; if (strpos($l,'brand=Array')!==false||strpos($l,'category=Array')!==false) $arr++; if (preg_match('/reason=excluded_brand.*?brand=([^|]+)/',$l,$m)) $brands[trim($m[1])]=($brands[trim($m[1])]??0)+1; }
    $o['reasons']=$reasons; $o['Array_siandien']=$arr; $o['excluded_brands']=$brands; $o['pvz']=array_slice(array_values(array_filter($today,function($l){return strpos($l,'ZB-BLOCK-CREATE')!==false;})),0,3);
    $o['pask3']=array_slice($today,-3);
    $vakar=array_filter($lines,function($l){return strpos($l,'2026-09-18')!==false && strpos($l,'brand=Array')!==false;}); $o['Array_vakar']=count($vakar); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
