<?php
/** Plugin Name: TEMP PS S1718p2 — hook'ai aprasymu vietai (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1718p2'])) return; $r=['v'=>'S1718p2']; global $wp_filter;
  $lst=function($h) use($wp_filter){ $o=[]; if(!isset($wp_filter[$h])) return $o; foreach($wp_filter[$h]->callbacks as $p=>$cbs) foreach($cbs as $cb){ $f=$cb['function']; $o[]=$p.':'.(is_string($f)?$f:(is_array($f)?(is_object($f[0])?get_class($f[0]):$f[0]).'::'.$f[1]:'closure')); } return $o; };
  foreach(['woocommerce_archive_description','woocommerce_taxonomy_archive_description','woocommerce_after_shop_loop','woocommerce_after_main_content','woocommerce_before_shop_loop','flatsome_after_shop_loop','flatsome_category_title'] as $h) $r[$h]=$lst($h);
  $r['cat_desc_pos']=get_theme_mod('category_description_position','?');
  foreach(glob(get_template_directory().'/inc/woocommerce/*.php') as $f){ $c=file_get_contents($f); if(strpos($c,'category_description')!==false){ preg_match_all('#.{0,90}category_description.{0,120}#',$c,$m); $r['flatsome'][basename($f)]=array_slice($m[0],0,8); } }
  $rc=new ReflectionClass('WC_Brands'); $r['wc_brands_file']=$rc->getFileName(); $c=file_get_contents($rc->getFileName()); preg_match_all('#.{0,80}brand_description.{0,80}#',$c,$m); $r['brands_src']=$m[0];
  wp_send_json($r);
},1);
