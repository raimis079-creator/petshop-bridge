<?php
/** Plugin Name: TEMP PS S1698 slug recon (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1698'])||$_GET['ps_s1698']!=='1') return;
  header('Content-Type: application/json; charset=utf-8'); global $wpdb; $o=array();
  foreach(array('%tofu%belocat%','%belocat%levand%','%trixie%kilimel%','%automatin%seryk%','%miniwell%','%marinesse%','%odos-lazdel%','%super-ben%','%ambrosia%kalakut%','%dygliuot%','%quattro%antien%','%triusio-aus%','%grieziniai%') as $l){ $o[$l]=$wpdb->get_results($wpdb->prepare("SELECT ID, post_status s, post_name FROM {$wpdb->posts} WHERE post_type='product' AND post_name LIKE %s LIMIT 8",$l),ARRAY_A); }
  $o['old_slug']=$wpdb->get_results("SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE meta_key='_petshop_legacy_slug' LIMIT 8",ARRAY_A);
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
