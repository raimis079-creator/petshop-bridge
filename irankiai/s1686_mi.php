<?php
/** TEMP PS S1686 mi — READ-ONLY: prekės puslapio šėrimo skaičiuoklė — kur renderinama, kaip gauna svorį (GET/JS/profilis), ar yra €/d ir dienų skaičius; magic login URL generavimas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mi'])) return; $o=array('v'=>'S1686 mi'); $core=WP_PLUGIN_DIR.'/petshop-core';
  $dirs=array($core.'/includes',$core.'/templates',$core.'/assets',WPMU_PLUGIN_DIR,get_stylesheet_directory());
  foreach($dirs as $d){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($d,FilesystemIterator::SKIP_DOTS)); foreach($it as $f){ $fn=(string)$f; if(!preg_match('/\.(php|js)$/',$fn)||strpos($fn,'.bak')!==false) continue; $L=file($fn); foreach($L as $i=>$l){ if(preg_match('/ps_svoris|svoris_kg|\$_GET\[.(svoris|weight|w)|weight_kg.*(GET|localStorage|sessionStorage)|dienu_uztenka|days_supply|eur_per_day|kaina_dienai|per_day|feeding-calc|feeding_calc|ps-skaiciuokle|skaiciuokle/i',$l)) $o['grep'][]=str_replace(array($core,WPMU_PLUGIN_DIR,get_stylesheet_directory()),array('core','mu','theme'),$fn).':'.($i+1).': '.trim(mb_substr($l,0,170)); } } }
  if(isset($o['grep'])) $o['grep']=array_slice($o['grep'],0,80);
  foreach(array('class-magic-login.php') as $f){ $L=file("$core/includes/$f"); foreach($L as $i=>$l) if(preg_match('/public static function|redirect|add_query_arg|home_url/',$l)) $o['magic'][]=($i+1).': '.trim(mb_substr($l,0,160)); }
  $pid=18054; $o['pvz_18054']=array('url'=>get_permalink($pid),'status'=>get_post_status($pid),'img'=>wp_get_attachment_image_url(get_post_thumbnail_id($pid),'medium'));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
