<?php
/** Plugin Name: TEMP PS S1704 likuciu recon */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704'])?$_GET['ps_s1704']:''); if($f!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704','faze'=>$f);
  try{
    global $wpdb; $p=$wpdb->prefix;
    $EAN='4017721829731';
    // 1. rasti preke
    $ids=$wpdb->get_col($wpdb->prepare("SELECT DISTINCT post_id FROM {$wpdb->postmeta} WHERE meta_value=%s AND meta_key IN ('_ean','_vf_barcode','_sku','_zb_barcode','_barcode','_gtin')",$EAN));
    $o['rasta_ids']=$ids;
    $pid=$ids?(int)$ids[0]:0; $o['pid']=$pid;
    if($pid){
      $pst=get_post($pid);
      $o['preke']=array('id'=>$pid,'pav'=>$pst->post_title,'status'=>$pst->post_status,'sku'=>get_post_meta($pid,'_sku',true));
      $mk=array('_ps_sandelis','_stock','_own_stock_qty','_manage_stock','_stock_status','_cost_price','_vf_cost','_zb_cost','_vf_supplier_sku','_zb_sku','_vf_barcode','_ean','_price','_regular_price','_ps_dropship_paslepta','_own_stock_qty_log_prev','_zb_qty_log_prev','_ps_ranka_isimta');
      $o['meta']=array(); foreach($mk as $k){ $v=get_post_meta($pid,$k,true); $o['meta'][$k]=($v===''?null:$v); }
      $o['visos_meta_stock']=$wpdb->get_results($wpdb->prepare("SELECT meta_key,meta_value FROM {$wpdb->postmeta} WHERE post_id=%d AND (meta_key LIKE '%%stock%%' OR meta_key LIKE '%%qty%%' OR meta_key LIKE '%%likut%%' OR meta_key LIKE '%%cost%%' OR meta_key LIKE '%%sandel%%')",$pid),ARRAY_A);
      // 2. registras
      $o['ps_sources']=$wpdb->get_results($wpdb->prepare("SELECT * FROM {$p}ps_sources WHERE product_id=%d",$pid),ARRAY_A);
      // 3. partijos
      $o['ps_partijos']=$wpdb->get_results($wpdb->prepare("SELECT * FROM {$p}ps_partijos WHERE product_id=%d ORDER BY id DESC LIMIT 20",$pid),ARRAY_A);
    }
    // 4. kokios lenteles galetu buti istorijos
    $o['lenteles']=$wpdb->get_col("SHOW TABLES LIKE '{$p}ps_%'");
    // 5. kur generuojama Istorijos kortele
    $dir=WPMU_PLUGIN_DIR; $rad=array();
    foreach(scandir($dir) as $fn){ if(substr($fn,-4)!=='.php') continue; $c=@file_get_contents($dir.'/'.$fn); if($c===false) continue;
      if(strpos($c,'VISKAS, KAS VYKO')!==false || strpos($c,'Pagal sritį')!==false || strpos($c,'Pagal srit')!==false) $rad[]=$fn; }
    $o['istorijos_failai']=$rad;
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
