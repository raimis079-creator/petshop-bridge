<?php
/** Plugin Name: TEMP PS S1697 klaidingi atitikmenys (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1697'])||$_GET['ps_s1697']!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1697 me'); global $wpdb; $p=$wpdb->prefix;
  try{
    foreach(array('Miniwell','Exigent','Mini Chicken','Josera Mini ') as $q){
      $o[$q]=$wpdb->get_results($wpdb->prepare("SELECT po.ID, po.post_title, po.post_status,
        (SELECT meta_value FROM {$p}postmeta WHERE post_id=po.ID AND meta_key='_price') kaina,
        (SELECT meta_value FROM {$p}postmeta WHERE post_id=po.ID AND meta_key='_sku') sku,
        (SELECT meta_value FROM {$p}postmeta WHERE post_id=po.ID AND meta_key='_global_unique_id') gtin,
        (SELECT meta_value FROM {$p}postmeta WHERE post_id=po.ID AND meta_key='_weight') svoris,
        (SELECT meta_value FROM {$p}postmeta WHERE post_id=po.ID AND meta_key='_stock_status') st,
        (SELECT meta_value FROM {$p}postmeta WHERE post_id=po.ID AND meta_key='_vf_supplier_sku') vf,
        (SELECT meta_value FROM {$p}postmeta WHERE post_id=po.ID AND meta_key='_vf_match_type') vfm
        FROM {$p}posts po WHERE po.post_type='product' AND po.post_title LIKE %s ORDER BY po.ID",'%'.$wpdb->esc_like($q).'%'),ARRAY_A);
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
