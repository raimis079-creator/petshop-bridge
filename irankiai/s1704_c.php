<?php
/** Plugin Name: TEMP PS S1704c dvigubo nurasymo mastas */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704c'])?$_GET['ps_s1704c']:''); if($f!=='1'&&$f!=='2') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704c','faze'=>$f);
  try{
    global $wpdb; $p=$wpdb->prefix;
    if($f==='1'){
      // visos eilutes su abiem zymem
      $rows=$wpdb->get_results("SELECT oi.order_id, oi.order_item_id,
          MAX(CASE WHEN m.meta_key='_product_id' THEN m.meta_value END) pid,
          MAX(CASE WHEN m.meta_key='_qty' THEN m.meta_value END) qty,
          MAX(CASE WHEN m.meta_key='_reduced_stock' THEN m.meta_value END) wc_red,
          MAX(CASE WHEN m.meta_key='_ps_av_reduced_qty' THEN m.meta_value END) av_red
        FROM {$p}woocommerce_order_items oi
        JOIN {$p}woocommerce_order_itemmeta m ON m.order_item_id=oi.order_item_id
        WHERE oi.order_item_type='line_item'
        GROUP BY oi.order_item_id
        HAVING wc_red IS NOT NULL AND av_red IS NOT NULL AND av_red>0
        ORDER BY oi.order_id DESC LIMIT 200",ARRAY_A);
      $o['dvigubos_eilutes_n']=count($rows);
      $o['dvigubos_eilutes']=$rows;
      // tik WC nurasyta
      $o['tik_wc_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM (SELECT oi.order_item_id,
          MAX(CASE WHEN m.meta_key='_reduced_stock' THEN 1 END) a,
          MAX(CASE WHEN m.meta_key='_ps_av_reduced_qty' THEN 1 END) b
        FROM {$p}woocommerce_order_items oi JOIN {$p}woocommerce_order_itemmeta m ON m.order_item_id=oi.order_item_id
        WHERE oi.order_item_type='line_item' GROUP BY oi.order_item_id HAVING a=1 AND b IS NULL) x");
      $o['tik_av_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM (SELECT oi.order_item_id,
          MAX(CASE WHEN m.meta_key='_reduced_stock' THEN 1 END) a,
          MAX(CASE WHEN m.meta_key='_ps_av_reduced_qty' THEN 1 END) b
        FROM {$p}woocommerce_order_items oi JOIN {$p}woocommerce_order_itemmeta m ON m.order_item_id=oi.order_item_id
        WHERE oi.order_item_type='line_item' GROUP BY oi.order_item_id HAVING b=1 AND a IS NULL) x");
    } else {
      // av-reduce kodas + can_reduce filtrai
      $c=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-av-reduce.php');
      $o['av_reduce_dydis']=strlen($c); $o['av_reduce_md5']=md5($c);
      $o['av_reduce']=$c;
      // kas kabinasi ant can_reduce
      $dir=WPMU_PLUGIN_DIR; $rad=array();
      foreach(scandir($dir) as $fn){ if(substr($fn,-4)!=='.php') continue; $cc=@file_get_contents($dir.'/'.$fn); if($cc===false) continue;
        if(strpos($cc,'woocommerce_can_reduce_order_stock')!==false) $rad[]=$fn; }
      $o['can_reduce_failai']=$rad;
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
