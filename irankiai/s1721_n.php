<?php
/** Plugin Name: TEMP PS S1721n read-only: petshop-rytas patikros() struktura (avpn blokas), lempuciu formatas; product_brand/gamintojas terminai; publish hookai */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1721n'])) return; $r=['v'=>'S1721n']; $mu=WPMU_PLUGIN_DIR;
  try{
    $s=file_get_contents($mu.'/petshop-rytas.php'); $r['rytas_kb']=round(strlen($s)/1024,1); $r['rytas_md5']=md5($s);
    if(($i=strpos($s,"'avpn'"))!==false) $r['avpn_blokas']=mb_substr($s,max(0,$i-1500),3200);
    if(($i=strpos($s,'function patikros'))!==false) $r['patikros_pradzia']=mb_substr($s,$i,1500);
    preg_match_all('#\$out\[\s*[\'"](\w+)[\'"]\s*\]\s*=#',$s,$m); $r['lemputes']=array_unique($m[1]);
    preg_match_all('#[^\n]{0,120}(function lempute|function prideti|spalva|\'raudona\'|\'geltona\'|\'zalia\')[^\n]{0,160}#',$s,$m2); $r['spalvos']=array_slice(array_map('trim',array_unique($m2[0])),0,12);
    $r['brand_tax']=taxonomy_exists('product_brand'); $r['brand_pvz']=wp_get_object_terms(18590,'product_brand',['fields'=>'slugs']);
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
