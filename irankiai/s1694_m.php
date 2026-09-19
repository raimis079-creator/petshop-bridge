<?php
/** TEMP PS S1694 m — Prins 19 poz.: fiktyvus AV likutis iš T-0 (Raimis 09-19: „Prins — dropshipping, AV šių prekių dabar nėra"). Fazė 1: patikra (atviri užs., partijos, sources, matomumas). Fazė 2: _own_stock_qty=0, T-0 partijos atšauktos, pastaba, bak opcija ps_s1694_prins_bak. Fazė 3: po-patikra. */
add_action('init', function(){
  if (!isset($_GET['ps_s1694m'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1694 m'); $f=$_GET['ps_s1694m'];
  $ids=array(16751,16745,16772,16854,16886,16881,16862,16868,16871,16876,16889,16785,16782,16776,16824,16865,16791,16779,16788); $in=implode(',',$ids);
  $bukle=function() use($wpdb,$p,$in,$ids){ $r=array();
    $r['own']=$wpdb->get_results("SELECT post_id,meta_value FROM {$p}postmeta WHERE meta_key='_own_stock_qty' AND post_id IN ($in)",ARRAY_A);
    $r['partijos']=$wpdb->get_results("SELECT product_id,id,kiekis_gautas,kiekis_liko,tiekejas,atsaukta FROM {$p}ps_partijos WHERE product_id IN ($in)",ARRAY_A);
    $r['sources']=$wpdb->get_results("SELECT product_id,source,stock_qty,is_active,priority FROM {$p}ps_sources WHERE product_id IN ($in) ORDER BY product_id,priority",ARRAY_A);
    $r['stock_status']=$wpdb->get_results("SELECT post_id,meta_value FROM {$p}postmeta WHERE meta_key='_stock_status' AND post_id IN ($in)",ARRAY_A);
    return $r; };
  if ($f==='1'){
    $o['pries']=$bukle();
    $o['atviri_uzs']=$wpdb->get_results("SELECT oi.order_id,o.status,oim.meta_value pid FROM {$p}woocommerce_order_items oi JOIN {$p}woocommerce_order_itemmeta oim ON oim.order_item_id=oi.order_item_id AND oim.meta_key='_product_id' JOIN {$p}wc_orders o ON o.id=oi.order_id WHERE oim.meta_value IN ($in) AND o.status IN ('wc-processing','wc-on-hold','wc-pending') LIMIT 20",ARRAY_A);
    $o['uzs_po_t0']=$wpdb->get_results("SELECT oi.order_id,o.status,o.date_created_gmt,oim.meta_value pid FROM {$p}woocommerce_order_items oi JOIN {$p}woocommerce_order_itemmeta oim ON oim.order_item_id=oi.order_item_id AND oim.meta_key='_product_id' JOIN {$p}wc_orders o ON o.id=oi.order_id WHERE oim.meta_value IN ($in) AND o.date_created_gmt>='2026-09-07' LIMIT 20",ARRAY_A);
    // kaip katalogas mato vieną (pvz. 16751): Petshop_Sources::saltiniai
    if (class_exists('Petshop_Sources') && method_exists('Petshop_Sources','saltiniai')){ try { $o['saltiniai_16751']=Petshop_Sources::saltiniai(16751); } catch (Throwable $e){ $o['saltiniai_err']=$e->getMessage(); } }
    $o['sync_fn']=function_exists('ps_sources_sync_saugiai');
    $o['err']=$wpdb->last_error;
  }
  if ($f==='2'){
    if (get_option('ps_s1694_prins_bak')){ $o['STOP']='bak opcija jau yra — fazė 2 jau vykdyta'; goto out; }
    $bak=$bukle(); add_option('ps_s1694_prins_bak',$bak,'',false);
    foreach ($ids as $id){
      $pa=$wpdb->get_results($wpdb->prepare("SELECT id FROM {$p}ps_partijos WHERE product_id=%d AND atsaukta=0",$id),ARRAY_A);
      foreach ($pa as $x) $wpdb->update($p.'ps_partijos',array('atsaukta'=>1,'pastaba'=>'Pradinis likutis T-0 — ATŠAUKTA S1694: Prins dropship, AV nėra (Raimis 09-19)'),array('id'=>$x['id']));
      update_post_meta($id,'_own_stock_qty',0);
      if (function_exists('ps_sources_sync_saugiai')) ps_sources_sync_saugiai($id);
      wp_insert_comment(array('comment_post_ID'=>$id,'comment_type'=>'note','comment_content'=>'S1694: fiktyvus AV likutis iš T-0 importo ('.(int)get_post_meta($id,'_stock',true).'/'.($bak['own'] ? implode(',',array_map(function($r)use($id){return $r['post_id']==$id?$r['meta_value']:'';},$bak['own'])) : '?').' vnt.) panaikintas, T-0 partija atšaukta. Sandėlis lieka prins (dropship). Raimio sprendimas 09-19.','user_id'=>0,'comment_author'=>'Claude','comment_approved'=>1));
      $o['atsaukta'][$id]=count($pa);
    }
    if (function_exists('wc_delete_product_transients')) foreach ($ids as $id) wc_delete_product_transients($id);
    $o['po']=$bukle(); $o['err']=$wpdb->last_error;
  }
  if ($f==='3'){
    $o['dabar']=$bukle(); if (class_exists('Petshop_Sources')&&method_exists('Petshop_Sources','saltiniai')) $o['saltiniai_16751']=Petshop_Sources::saltiniai(16751);
    $r=wp_remote_get(get_permalink(16751),array('timeout'=>20)); $b=is_wp_error($r)?'':wp_remote_retrieve_body($r); $o['puslapis_16751']=array('kodas'=>is_wp_error($r)?0:wp_remote_retrieve_response_code($r),'i_krepseli'=>strpos($b,'single_add_to_cart_button')!==false,'ps_bis'=>strpos($b,'ps-bis')!==false,'nera'=>stripos($b,'nėra sandėlyje')!==false||stripos($b,'out-of-stock')!==false);
  }
  out:
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
