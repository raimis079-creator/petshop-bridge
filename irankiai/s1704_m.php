<?php
/** Plugin Name: TEMP PS S1704m 16178 patikra */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704m'])?$_GET['ps_s1704m']:''); if($f!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704m');
  try{ global $wpdb; $p=$wpdb->prefix; $pid=16178; $pr=wc_get_product($pid);
    $o['tipas']=$pr?$pr->get_type():null; $o['manage']=$pr?$pr->managing_stock():null; $o['stock']=$pr?$pr->get_stock_quantity():null; $o['status']=get_post_status($pid);
    $o['meta']=$wpdb->get_results($wpdb->prepare("SELECT meta_key,meta_value FROM {$wpdb->postmeta} WHERE post_id=%d AND (meta_key LIKE '%%stock%%' OR meta_key LIKE '%%sandel%%' OR meta_key LIKE '%%dp_%%' OR meta_key LIKE '%%mnm%%')",$pid),ARRAY_A);
    $o['sources']=$wpdb->get_results($wpdb->prepare("SELECT source,stock_qty,is_active FROM {$p}ps_sources WHERE product_id=%d",$pid),ARRAY_A);
    $o['partijos']=$wpdb->get_results($wpdb->prepare("SELECT id,gauta,kiekis_gautas,kiekis_liko,tiekejas,pastaba FROM {$p}ps_partijos WHERE product_id=%d AND atsaukta=0",$pid),ARRAY_A);
    $o['vaikai']=$wpdb->get_col($wpdb->prepare("SELECT ID FROM {$wpdb->posts} WHERE post_parent=%d",$pid));
    $o['wc_lookup']=$wpdb->get_row($wpdb->prepare("SELECT stock_quantity,stock_status FROM {$p}wc_product_meta_lookup WHERE product_id=%d",$pid),ARRAY_A);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
