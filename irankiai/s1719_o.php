<?php
/** Plugin Name: TEMP PS S1719o — Super Cache išvalymas po botų sargo (kad kešuoti puslapiai turėtų ps_js JS) + patikra */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719o'])) return; $r=['v'=>'S1719o'];
  try{ if(function_exists('wp_cache_clear_cache')){ wp_cache_clear_cache(); $r['cache']='išvalytas'; } else $r['cache']='fn nėra';
    foreach(['/','/kategorija/sunims/','/parduotuve/'] as $u){ $rs=wp_remote_get('https://petshop.lt'.$u,['timeout'=>25,'sslverify'=>false,'headers'=>['user-agent'=>'Mozilla/5.0 ps-check'],'limit_response_size'=>200000]); $b=(string)wp_remote_retrieve_body($rs); $r['js'][$u]=wp_remote_retrieve_response_code($rs).(strpos($b,"ps_js=")!==false?' js✓':' js NĖRA'); }
    $cf=WP_CONTENT_DIR.'/cache/supercache/petshop.lt'; $n=0; if(is_dir($cf)){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($cf,FilesystemIterator::SKIP_DOTS)); foreach($it as $fi){ if($fi->isFile()) $n++; } } $r['cache_failai']=$n;
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
},1);
