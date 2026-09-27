<?php
/** Plugin Name: TEMP PS S1725c read-only: petshop-rinkiniai.php (langas Rinkiniai) struktura — meniu, puslapio render, skirtukai, DP pakai */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1725c'])) return; $r=['v'=>'S1725c']; @set_time_limit(120);
  $grep=function($s,$pat,$ctx=150,$max=40){ preg_match_all('#[^\n]{0,'.$ctx.'}('.$pat.')[^\n]{0,'.$ctx.'}#u',$s,$m); return array_slice(array_map('trim',$m[0]),0,$max); };
  try{
    $f=WPMU_PLUGIN_DIR.'/petshop-rinkiniai.php'; $s=file_get_contents($f); $L=explode("\n",$s); $r['eiluciu']=count($L);
    // funkcijos su eilutes numeriu
    foreach($L as $i=>$ln){ if(preg_match('#^\s*(public|private|protected)?\s*(static\s+)?function\s+(\w+)#',$ln,$m)) $r['funkcijos'][]=($i+1).' '.$m[3]; }
    foreach($L as $i=>$ln){ if(preg_match('#add_submenu_page|add_action\(\s*.admin|wp_ajax_|tab=|\$_GET\[.tab|_dp_base_product_id|_dp_pack_qty|Daugiau|DP pak|<h2|nav-tab#u',$ln)) $r['raktines'][]=($i+1).': '.mb_substr(trim($ln),0,220); }
    $r['raktines']=array_slice($r['raktines'],0,120);
    // laukai.php submeniu 22 ir jo antraste
    $s2=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-laukai.php'); $r['laukai']=$grep($s2,"add_submenu_page|Rinkiniai|ps-laukai",200,12);
    // katalogas meniu
    $s3=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-katalogas.php'); $r['katalogas_menu']=$grep($s3,"add_menu_page|add_submenu_page",250,10);
    // snippet 539/550/572 kur kabinasi
    global $wpdb; foreach([539,550,572] as $id){ $c=$wpdb->get_var("SELECT code FROM {$wpdb->prefix}snippets WHERE id=$id"); $r['snip'][$id]=$grep($c,"add_submenu_page\([^;]{0,300}",10,3); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
