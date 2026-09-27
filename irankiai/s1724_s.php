<?php
/** Plugin Name: TEMP PS S1724s recon: robots.txt, YITH filtru nuorodu HTML, botu sargas v1.0 struktura, rytas lempuciu sablonas read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724s'])) return; $r=['v'=>'S1724s']; @set_time_limit(150); $tz=new DateTimeZone('Europe/Vilnius');
  try{
    $x=wp_remote_get(home_url('/robots.txt'),['timeout'=>20,'sslverify'=>false]); $r['robots']=is_wp_error($x)?$x->get_error_message():wp_remote_retrieve_body($x);
    $r['robots_failas']=is_file(ABSPATH.'robots.txt')?'fizinis':'virtualus'; $r['rank_math_robots']=get_option('rank-math-options-general')['robots_txt_content']??null;
    // YITH: kategorijos HTML — filtru nuorodos (be keso: ps_ raktas)
    $x=wp_remote_get(home_url('/kategorija/sunims/maistas-sunims/?ps_s=1'),['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1724s']); $h=wp_remote_retrieve_body($x); $r['kat_len']=strlen($h);
    preg_match_all('#<a[^>]+href="[^"]*(filter_|yith_wcan)[^"]*"[^>]*>#',$h,$m); $r['filtru_a_n']=count($m[0]); $r['filtru_a_pvz']=array_slice($m[0],0,4); $r['filtru_a_rel']=count(array_filter($m[0],function($a){return stripos($a,'nofollow')!==false;}));
    preg_match_all('#<a[^>]+href="[^"]*(orderby=|/page/\d+)[^"]*"[^>]*>#',$h,$m2); $r['orderby_page_a_n']=count($m2[0]); $r['orderby_page_pvz']=array_slice($m2[0],0,3);
    preg_match_all('#<link[^>]+rel="(canonical|next|prev)"[^>]*>#',$h,$m3); $r['link_rel']=$m3[0];
    $r['yith_ver']=defined('YITH_WCAN_VERSION')?YITH_WCAN_VERSION:null; $r['yith_opts']=array_intersect_key((array)get_option('yith_wcan_options',[]),array_flip(['filters_seo','ajax_filters','url_type','seo_noindex','instant_filters'])); $r['yith_opt_keys']=array_slice(array_keys((array)get_option('yith_wcan_options',[])),0,40);
    // botu sargas v1.0 — kablių sarasas ir zurnalo formatas
    $bs=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-botu-sargas.php'); $L=explode("\n",$bs); $r['bs_ver']=preg_match('#Version:\s*([\d.]+)#',$bs,$mm)?$mm[1]:null; $r['bs_eil']=count($L); foreach($L as $i=>$l){ if(preg_match('/add_action|add_filter|function |suvestine|wp_head|script|ps_js/',$l)) $r['bs_kodas'][]=($i+1).': '.mb_substr(trim($l),0,160); } $r['bs_kodas']=array_slice($r['bs_kodas'],0,60);
    // rytas: kaip pridedama lempute (dp_kainos pavyzdys) + patikros() pradzia
    $ry=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-rytas.php'); $R=explode("\n",$ry); foreach($R as $i=>$l){ if(preg_match('/dp_kainos|\$add\s*=|function patikros|Version:/',$l)) $r['rytas_eil'][]=($i+1).': '.mb_substr(trim($l),0,200); }
    $r['rytas_md5']=md5($ry);
    // log archyvai
    $dom=dirname(ABSPATH); foreach(glob($dom.'/logs/*.tar.gz*') as $fx){ $r['logs'][]=[basename($fx),round(filesize($fx)/1048576,1),(new DateTime('@'.filemtime($fx)))->setTimezone($tz)->format('m-d H:i')]; }
    $r['gzopen']=function_exists('gzopen');
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
