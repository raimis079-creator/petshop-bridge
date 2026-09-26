<?php
/** Plugin Name: TEMP PS S1722e read-only: php_error.log uodega + rinkiniai/572 meniu struktura (statiskai) + heartbeat */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1722e'])) return; $r=['v'=>'S1722e']; global $wpdb; $P=$wpdb->prefix; $mu=WPMU_PLUGIN_DIR;
  try{
    $x=wp_remote_get(home_url('/'),['timeout'=>25,'sslverify'=>false]); $r['heartbeat']=is_wp_error($x)?$x->get_error_message():wp_remote_retrieve_response_code($x);
    $lg=dirname(untrailingslashit(ABSPATH)).'/logs/php_error.log'; if(is_file($lg)){ $s=file_get_contents($lg); $r['log_uodega']=array_slice(explode("\n",$s),-6); }
    $r['dp_kainos_ver']=preg_match('#Version:\s*([\d.]+)#',file_get_contents($mu.'/petshop-dp-kainos.php'),$m)?$m[1]:null;
    $rk=file_get_contents($mu.'/petshop-rinkiniai.php'); $r['rinkiniai_ver']=preg_match('#Version:\s*([\d.]+)#',$rk,$mv)?$mv[1]:null; $r['rinkiniai_md5']=md5($rk);
    preg_match_all("#add_(sub)?menu_page\(([^;]{0,260})#s",$rk,$m); $r['rinkiniai_menu']=array_map(function($x){return preg_replace('/\s+/',' ',$x);},$m[0]);
    $i=strpos($rk,'function meniu'); $r['rinkiniai_meniu_fn']=$i!==false?substr($rk,$i,1500):null;
    preg_match_all("#[^\n]{0,100}(nav-tab|skirtuk|\?tab=|\['tab'\]|Daugiau|petshop_dp_|_dp_base)[^\n]{0,100}#",$rk,$m2); $r['rinkiniai_grep']=array_slice(array_values(array_unique(array_map('trim',$m2[0]))),0,30);
    $sn=$wpdb->get_results("SELECT id,name FROM {$P}snippets WHERE active=1 AND (code LIKE '%add_submenu_page%' OR code LIKE '%add_menu_page%')",ARRAY_A);
    foreach($sn as $x){ $c=$wpdb->get_var($wpdb->prepare("SELECT code FROM {$P}snippets WHERE id=%d",$x['id'])); preg_match_all("#add_(sub)?menu_page\(\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'#s",$c,$mm,PREG_SET_ORDER); foreach($mm as $q) $r['snip_menus'][]=$x['id'].' '.$x['name'].' → parent '.$q[2].' | '.$q[4].' | slug '.$q[6]; }
    foreach(glob($mu.'/*.php') as $f){ $s=file_get_contents($f); preg_match_all("#add_(sub)?menu_page\(\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'#s",$s,$mm,PREG_SET_ORDER); foreach($mm as $q) $r['mu_menus'][]=basename($f).' → parent '.$q[2].' | '.$q[4].' | slug '.$q[6]; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
