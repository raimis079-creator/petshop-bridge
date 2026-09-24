<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1711c'])) return;
  global $wpdb; $r=[];
  foreach(['snip','serykl','purv','kiaul%snip'] as $w) $r['p'][$w]=$wpdb->get_results($wpdb->prepare("SELECT ID,post_name,post_status FROM {$wpdb->posts} WHERE post_type='product' AND post_name LIKE %s ORDER BY post_status='publish' DESC LIMIT 8",'%'.$w.'%'),ARRAY_A);
  $r['cat']=$wpdb->get_results("SELECT t.slug,t.term_id,x.parent FROM {$wpdb->terms} t JOIN {$wpdb->term_taxonomy} x ON x.term_id=t.term_id WHERE x.taxonomy='product_cat' AND (t.slug LIKE '%seryk%' OR t.slug LIKE '%dubenel%' OR t.slug LIKE '%kilim%' OR t.slug LIKE '%maistas-katems%' OR t.slug LIKE '%skanest%')",ARRAY_A);
  $r['blogmap']=$wpdb->get_results("SELECT p.ID,p.post_name,p.post_type,p.post_status, REGEXP_SUBSTR(m.meta_value,'blogid=[0-9]+') b FROM {$wpdb->postmeta} m JOIN {$wpdb->posts} p ON p.ID=m.post_id WHERE m.meta_key='_petshop_pre_force_content' AND m.meta_value LIKE '%route=blog/article/prints%'",ARRAY_A);
  $r['blog_other']=$wpdb->get_results("SELECT p.ID,p.post_name,p.post_type, REGEXP_SUBSTR(p.post_content,'blogid=[0-9]+') b FROM {$wpdb->posts} p WHERE p.post_type IN('post','page') AND p.post_content LIKE '%blogid=%'",ARRAY_A);
  // who serves robots
  global $wp_filter; $r['robots_hooks']=[]; if(isset($wp_filter['robots_txt'])) foreach($wp_filter['robots_txt']->callbacks as $pr=>$cbs) foreach($cbs as $cb){ $fn=$cb['function']; $r['robots_hooks'][]=$pr.' '.(is_array($fn)?(is_object($fn[0])?get_class($fn[0]):$fn[0]).'::'.$fn[1]:(is_string($fn)?$fn:'closure')); }
  $r['mu_exists']=['robots'=>file_exists(WPMU_PLUGIN_DIR.'/petshop-gsc-tvarka.php')];
  wp_send_json($r);
}, 1);
