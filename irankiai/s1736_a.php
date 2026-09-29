<?php
/** Plugin Name: TEMP PS S1736a VF užsakymų laiškas — kodo paieška (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1736a'])) return;
  $f=$_GET['ps_s1736a']; @set_time_limit(200); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1736a','faze'=>$f];
  try{
  $pat=['Liucioni','Ačiū :)','Aciu :)','vetfarm','VetFarm','Vetfarm','atsisiuntimas','Atsisiuntimas'];
  if($f==='1'){
    $dirs=[WP_CONTENT_DIR.'/mu-plugins', WP_CONTENT_DIR.'/themes/flatsome-child'];
    foreach(glob(WP_CONTENT_DIR.'/plugins/petshop*',GLOB_ONLYDIR) as $d) $dirs[]=$d;
    $files=[];
    foreach($dirs as $d){ if(!is_dir($d)) continue; $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($d,FilesystemIterator::SKIP_DOTS)); foreach($it as $fi){ if(preg_match('/\.php$/',$fi->getFilename())) $files[]=$fi->getPathname(); } }
    $r['n_files']=count($files);
    foreach($files as $fp){ $L=@file($fp); if(!$L) continue; foreach($L as $i=>$ln){ foreach($pat as $p){ if(stripos($ln,$p)!==false){ $r['hits'][]=str_replace(WP_CONTENT_DIR,'',$fp).':'.($i+1).' ['.$p.'] '.mb_substr(trim($ln),0,220); break; } } } }
    $t=$P.'snippets';
    if($wpdb->get_var("SHOW TABLES LIKE '$t'")===$t){ foreach($wpdb->get_results("SELECT id,name,active,code FROM $t",ARRAY_A) as $s){ foreach(explode("\n",$s['code']) as $i=>$ln){ foreach($pat as $p){ if(stripos($ln,$p)!==false){ $r['snip_hits'][]='#'.$s['id'].' '.$s['name'].' (a='.$s['active'].') :'.($i+1).' ['.$p.'] '.mb_substr(trim($ln),0,220); break; } } } } }
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
