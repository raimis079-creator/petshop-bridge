<?php
/** Plugin Name: TEMP PS S1725n read-only: kaip buvo nukreipti ir nurašyti užsakymai su DP pakais; ps_sources stulpeliai */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1725n'])) return; $r=['v'=>'S1725n']; global $wpdb; $P=$wpdb->prefix;
  try{
    $r['ps_sources_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$P}ps_sources");
    $items=$wpdb->get_results("SELECT i.order_item_id, i.order_id, i.order_item_name nm, pm.meta_value pid FROM {$P}woocommerce_order_items i JOIN {$P}woocommerce_order_itemmeta pm ON pm.order_item_id=i.order_item_id AND pm.meta_key='_product_id' JOIN {$P}postmeta b ON b.post_id=pm.meta_value AND b.meta_key='_dp_base_product_id' ORDER BY i.order_id DESC LIMIT 30",ARRAY_A);
    foreach($items as $it){ $m=$wpdb->get_results($wpdb->prepare("SELECT meta_key,LEFT(meta_value,80) v FROM {$P}woocommerce_order_itemmeta WHERE order_item_id=%d AND (meta_key LIKE '\\_ps%%' OR meta_key IN ('_qty','_reduced_stock','_line_total'))",$it['order_item_id']),ARRAY_A);
      $o=wc_get_order($it['order_id']); $b=(int)get_post_meta($it['pid'],'_dp_base_product_id',true);
      $r['eil'][]=['uzs'=>$it['order_id'],'nr'=>$o?$o->get_order_number():null,'bus'=>$o?$o->get_status():null,'data'=>$o&&$o->get_date_created()?$o->get_date_created()->date('Y-m-d'):null,'preke'=>mb_substr($it['nm'],0,50),'baze'=>$b,'bazes_src'=>$wpdb->get_col($wpdb->prepare("SELECT source FROM {$P}ps_sources WHERE product_id=%d",$b)),'meta'=>array_column($m,'v','meta_key')]; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
}, 1);
