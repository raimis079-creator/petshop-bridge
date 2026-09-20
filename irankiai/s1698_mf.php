<?php
/** Plugin Name: TEMP PS S1698 404 debug (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1698'])||$_GET['ps_s1698']!=='1') return;
  header('Content-Type: application/json; charset=utf-8'); global $wpdb; $o=array();
  foreach(array('zaislas-suniui-guminis-kvepiantis-dygliuotas-kamuoliukas-4-5-cm','quattro-sb-su-antiena-sausas-suaugusiu-mazu-veisliu-sunu-pasaras-1-5kg') as $slug){
    $r=array('sanitize'=>sanitize_title($slug));
    $r['draft']=$wpdb->get_results($wpdb->prepare("SELECT ID, post_status FROM {$wpdb->posts} WHERE post_type='product' AND post_name=%s",$slug),ARRAY_A);
    list($zo,$sk)=ps404_zodziai($slug); $r['zo']=$zo; $r['sk']=$sk;
    $like=array(); $params=array(); foreach(array_slice($zo,0,2) as $w){ $like[]="post_name LIKE %s"; $params[]='%'.$wpdb->esc_like($w).'%'; }
    $r['kand']=$wpdb->get_col($wpdb->prepare("SELECT post_name FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND ".implode(' AND ',$like)." LIMIT 60",$params));
    $o[$slug]=$r;
  }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
