<?php
/** Plugin Name: TEMP PS S1720b — 2.15 recon 2, read-only (d: nulinės frazės per raktas; e: dropship-matomumas kodas; f: search sample events) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720b'])) return; $f=$_GET['ps_s1720b']; $r=['v'=>'S1720b','faze'=>$f,'t'=>date('Y-m-d H:i:s')];
  global $wpdb; $p=$wpdb->prefix; @set_time_limit(280);
  $q=function($sql) use($wpdb){ $wpdb->last_error=''; $x=$wpdb->get_results($sql,ARRAY_A); if($wpdb->last_error) return ['SQL_ERR'=>substr($wpdb->last_error,0,160)]; return $x; };
  try{
  if($f==='d'){
    $r['sample']=$q("SELECT raktas,raktas2,reiksme,url_kelias,pusl_tipas FROM {$p}ps_web_ivykiai WHERE tipas='search' ORDER BY id DESC LIMIT 5");
    $r['nulines_po_0920']=$q("SELECT LOWER(TRIM(raktas)) fraze,COUNT(*) n,COUNT(DISTINCT sesija) ses FROM {$p}ps_web_ivykiai WHERE tipas='search' AND laikas>='2026-09-20 20:00:00' AND reiksme='0' AND COALESCE(testinis,0)=0 GROUP BY 1 ORDER BY n DESC LIMIT 120");
    $r['nulines_iki_0920']=$q("SELECT LOWER(TRIM(raktas)) fraze,COUNT(*) n FROM {$p}ps_web_ivykiai WHERE tipas='search' AND laikas>='2026-09-07' AND laikas<'2026-09-20 20:00:00' AND reiksme='0' GROUP BY 1 ORDER BY n DESC LIMIT 80");
    $r['top_po_0920']=$q("SELECT LOWER(TRIM(raktas)) fraze,COUNT(*) n,MIN(reiksme+0) rez FROM {$p}ps_web_ivykiai WHERE tipas='search' AND laikas>='2026-09-20 20:00:00' AND reiksme<>'0' AND COALESCE(testinis,0)=0 GROUP BY 1 ORDER BY n DESC LIMIT 40");
    $r['dienomis']=$q("SELECT diena,COUNT(*) n,SUM(reiksme='0') nul FROM {$p}ps_web_ivykiai WHERE tipas='search' AND laikas>='2026-09-14' AND COALESCE(testinis,0)=0 GROUP BY diena ORDER BY diena");
    $r['irenginys']=$q("SELECT irenginys,COUNT(*) n FROM {$p}ps_web_ivykiai WHERE tipas='search' AND laikas>='2026-09-20 20:00:00' GROUP BY 1");
    $r['po_nulines']=$q("SELECT e2.tipas,COUNT(*) n FROM {$p}ps_web_ivykiai e1 JOIN {$p}ps_web_ivykiai e2 ON e2.sesija=e1.sesija AND e2.id>e1.id AND e2.id<=e1.id+3 WHERE e1.tipas='search' AND e1.reiksme='0' AND e1.laikas>='2026-09-20 20:00:00' GROUP BY 1 ORDER BY n DESC LIMIT 10");
  }
  if($f==='e'){
    foreach(['petshop-dropship-matomumas.php','petshop-code-search.php'] as $x){ $fp=WPMU_PLUGIN_DIR.'/'.$x; $r[$x]=['md5'=>md5_file($fp),'bytes'=>filesize($fp),'kodas'=>substr(file_get_contents($fp),0,9000)]; }
    $r['kategorijos']=$q("SELECT t.term_id,t.name,t.slug,tt.parent,tt.count FROM {$p}terms t JOIN {$p}term_taxonomy tt ON tt.term_id=t.term_id WHERE tt.taxonomy='product_cat' AND tt.count>0 ORDER BY tt.parent,tt.count DESC");
    $r['brandai_top']=$q("SELECT t.name,t.slug,tt.count FROM {$p}terms t JOIN {$p}term_taxonomy tt ON tt.term_id=t.term_id WHERE tt.taxonomy='product_brand' AND tt.count>0 ORDER BY tt.count DESC LIMIT 60");
    $r['analitika_search_hook']=preg_match('/search/',file_get_contents(WPMU_PLUGIN_DIR.'/petshop-analitika.php'))?'yra':'nera';
    $c=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-analitika.php'); if(preg_match_all('/.{0,200}search.{0,300}/s',$c,$m)) $r['analitika_search_ctx']=array_slice($m[0],0,4);
  }
  if($f==='f'){
    // kiek publikuotų prekių titulai/turinys turi EN sudėties žodžius
    foreach(['pork','peas','duck','lamb','chicken','salmon','rice','potato','kitten','sterilised','sterilized','puppy','senior','adult','beef','turkey','fish','tuna','rabbit','venison','grain free','grainfree','hypoallergenic','light','urinary','renal','dental','hairball','indoor'] as $w){ $r['en'][$w]=(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$p}posts WHERE post_type='product' AND post_status='publish' AND (post_title LIKE %s)", '%'.$wpdb->esc_like($w).'%')); }
    foreach(['kiaulien','žirn','antien','ėrien','vištien','lašiš','ryž','bulv','kačiuk','sterilizuot','šuniuk','senjor','suaug','jautien','kalakut','žuv','tun','triuš','elnien','be grūd','begrūd','hipoalerg','urinary','inkst','dant','plaukų gumul','indoor'] as $w){ $r['lt'][$w]=(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$p}posts WHERE post_type='product' AND post_status='publish' AND (post_title LIKE %s)", '%'.$wpdb->esc_like($w).'%')); }
    $r['exclusion_pork']=$q("SELECT ID,post_title FROM {$p}posts WHERE post_type='product' AND post_status='publish' AND post_title LIKE '%exclusion%' AND (post_title LIKE '%kiaul%' OR post_title LIKE '%pork%') LIMIT 10");
    $r['exclusion_visi']=$q("SELECT ID,post_title FROM {$p}posts WHERE post_type='product' AND post_status='publish' AND post_title LIKE '%exclusion%' ORDER BY post_title LIMIT 100");
  }
  }catch(Throwable $e){ $r['ERR']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
