<?php
/** Plugin Name: TEMP PS S1698 404 debug 2 (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1698'])||$_GET['ps_s1698']!=='1') return;
  header('Content-Type: application/json; charset=utf-8'); global $wpdb; $o=array();
  $slug='quattro-sb-su-antiena-sausas-suaugusiu-mazu-veisliu-sunu-pasaras-1-5kg';
  $o['draft']=$wpdb->get_results($wpdb->prepare("SELECT ID, post_status FROM {$wpdb->posts} WHERE post_type='product' AND post_name=%s",$slug),ARRAY_A);
  list($zo,$sk)=ps404_zodziai($slug); $o['zo']=$zo; $o['sk']=$sk;
  $ilg=$zo; usort($ilg,function($a,$b){return strlen($b)-strlen($a);}); $like=array(); $params=array();
  foreach(array_slice($ilg,0,2) as $w){ $like[]="post_name LIKE %s"; $params[]='%'.$wpdb->esc_like(strlen($w)>=6?substr($w,0,5):$w).'%'; }
  $o['params']=$params; $o['kand']=$wpdb->get_col($wpdb->prepare("SELECT post_name FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND ".implode(' AND ',$like)." LIMIT 300",$params));
  $o['n']=count($o['kand']); $o['kand']=array_values(array_filter($o['kand'],function($x){return strpos($x,'quattro')!==false;}));
  $o['lm']=$wpdb->get_var("SELECT COUNT(DISTINCT meta_value) FROM {$wpdb->postmeta} WHERE meta_key='_legacy_manufacturer'");
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
