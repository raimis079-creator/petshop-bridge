<?php
/** Plugin Name: TEMP PS S1724v sargas v1.2 etiketes data (archyvo mtime - 6 val. = aprasoma para) + opcijos keso valymas. Fazes: 1 patch, 2 patikra */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724v'])) return; $f=(string)$_GET['ps_s1724v']; $r=['v'=>'S1724v','faze'=>$f]; $sg=WPMU_PLUGIN_DIR.'/petshop-botu-sargas.php';
  $tok=function($code){ try{ token_get_all($code,TOKEN_PARSE); return 'ok'; }catch(Throwable $e){ return 'KLAIDA '.$e->getMessage(); } };
  try{
    if($f==='1'){ $s=file_get_contents($sg); $n=substr_count($s,"wp_date( 'm-d', \$fm )"); $r['kiek']=$n; if($n!==1) throw new Exception('ne 1x'); $p=str_replace("wp_date( 'm-d', \$fm )","wp_date( 'm-d', \$fm - 6 * 3600 )",$s); if($tok($p)!=='ok') throw new Exception('lint'); file_put_contents($sg,$p); delete_option('ps_uztvara_suvestine'); $r['md5']=md5_file($sg); $x=wp_remote_get(home_url('/?ps_hb='.time()),['timeout'=>25,'sslverify'=>false]); $r['heartbeat']=wp_remote_retrieve_response_code($x); }
    if($f==='2'){ $r['uztvara']=Petshop_Botu_Sargas::uztvara_suvestine(); $r['md5']=md5_file($sg); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
}, 1);
