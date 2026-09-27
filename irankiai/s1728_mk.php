<?php
/** Plugin Name: TEMP PS S1728mk read-only: kur kabinama skaičiuoklė / kiti blokai po forma */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1728mk'])) return; $r=['v'=>'S1728mk'];
  try{
    foreach(['Petshop_Product_Calc','Petshop_Atsargu_Laukimas','Petshop_Pristatymo_Pazadas','Petshop_Prekes_Tvarka'] as $c){ if(!class_exists($c)){ $r[$c]='nėra'; continue; } $rc=new ReflectionClass($c); $f=$rc->getFileName(); $t=file($f); $o=[]; foreach($t as $i=>$l){ if(preg_match('/add_action|add_filter|remove_action|woocommerce_after_add_to_cart|after_add_to_cart|petshop-fbt|Petshop_FBT|render_widget/',$l)) $o[]=($i+1).': '.trim($l); } $r[$c]=['failas'=>str_replace(ABSPATH,'',$f),'eil'=>array_slice($o,0,40)]; }
    // kas dar mini Petshop_FBT / render_widget
    $hits=[]; foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/*.php')?:[],glob(WP_PLUGIN_DIR.'/petshop-*/*.php')?:[],glob(WP_PLUGIN_DIR.'/petshop-*/includes/*.php')?:[],glob(get_stylesheet_directory().'/*.php')?:[]) as $f){ $t=file_get_contents($f); if(preg_match_all('/.{0,100}(render_widget|Petshop_FBT|petshop-fbt|ps-calc).{0,100}/',$t,$m)) $hits[str_replace(ABSPATH,'',$f)]=array_slice($m[0],0,6); }
    global $wpdb; foreach($wpdb->get_results("SELECT id,name,code FROM {$wpdb->prefix}snippets WHERE active=1",ARRAY_A) as $s){ if(preg_match_all('/.{0,100}(render_widget|Petshop_FBT|petshop-fbt|after_add_to_cart_form).{0,100}/',$s['code'],$m)) $hits['snip'.$s['id'].' '.$s['name']]=array_slice($m[0],0,6); }
    $r['mini']=$hits;
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
