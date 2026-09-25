<?php
/** Plugin Name: TEMP PS S1718p6 — kas valo term description HTML (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1718p6'])) return; $r=['v'=>'S1718p6']; global $wp_filter;
  $lst=function($h) use($wp_filter){ $o=[]; if(!isset($wp_filter[$h])) return $o; foreach($wp_filter[$h]->callbacks as $p=>$cbs) foreach($cbs as $cb){ $f=$cb['function']; $o[]=$p.':'.(is_string($f)?$f:(is_array($f)?(is_object($f[0])?get_class($f[0]):$f[0]).'::'.$f[1]:'closure')); } return $o; };
  foreach(['pre_term_description','pre_product_brand_description','pre_product_cat_description','term_description','edit_term_description','wp_update_term_data','wp_insert_term_data','edited_term','edit_terms'] as $h) $r[$h]=$lst($h);
  $x='<h2>Apie X</h2>'."\n".'<p>Pirma <strong>b</strong>.</p>'."\n".'<h3>Kaip</h3>'."\n".'<p>Antra.</p>';
  $r['db_su_kses']=sanitize_term_field('description',$x,0,'product_brand','db');
  kses_remove_filters(); $r['db_be_kses']=sanitize_term_field('description',$x,0,'product_brand','db'); kses_init_filters();
  $r['wp_kses_post']=wp_kses_post($x);
  $r['user']=get_current_user_id(); $r['unfiltered']=current_user_can('unfiltered_html');
  wp_send_json($r);
},1);
