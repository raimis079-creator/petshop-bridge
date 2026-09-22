<?php
/** Plugin Name: TEMP PS S1704b istorijos saltinis */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704b'])?$_GET['ps_s1704b']:''); if($f!=='1'&&$f!=='2') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704b','faze'=>$f);
  try{
    global $wpdb; $p=$wpdb->prefix; $pid=19366;
    if($f==='1'){
      $c=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-katalogas.php');
      $o['dydis']=strlen($c);
      // istorijos funkcijos
      preg_match_all('/function\s+([a-z0-9_]*istorij[a-z0-9_]*)\s*\(/i',$c,$m); $o['funkcijos']=$m[1];
      $i=strpos($c,'VISKAS, KAS VYKO'); $o['poz']=$i;
      if($i!==false){ $o['gabalas']=substr($c,max(0,$i-9000),12000); }
    } else {
      // uzsakymai su sia preke
      $rows=$wpdb->get_results($wpdb->prepare("SELECT oi.order_id, oim.meta_value qty, oi.order_item_id FROM {$p}woocommerce_order_items oi
        JOIN {$p}woocommerce_order_itemmeta im ON im.order_item_id=oi.order_item_id AND im.meta_key='_product_id' AND im.meta_value=%d
        LEFT JOIN {$p}woocommerce_order_itemmeta oim ON oim.order_item_id=oi.order_item_id AND oim.meta_key='_qty'
        ORDER BY oi.order_id DESC LIMIT 30",$pid),ARRAY_A);
      $o['uzsakymai']=array();
      foreach($rows as $r){ $ord=wc_get_order($r['order_id']);
        $o['uzsakymai'][]=array('id'=>$r['order_id'],'qty'=>$r['qty'],'status'=>$ord?$ord->get_status():'?','data'=>$ord?$ord->get_date_created()->date('Y-m-d H:i'):'?',
          '_reduced_stock'=>wc_get_order_item_meta($r['order_item_id'],'_reduced_stock',true),
          '_ps_av_reduced_qty'=>wc_get_order_item_meta($r['order_item_id'],'_ps_av_reduced_qty',true),
          '_ps_source'=>wc_get_order_item_meta($r['order_item_id'],'_ps_source',true),
          'nr'=>$ord?$ord->get_meta('_ps_nr'):'');
      }
      // uzsakymu ivykiai
      $o['ivykiai']=$wpdb->get_results("SELECT * FROM {$p}ps_uzsakymu_ivykiai WHERE laikas BETWEEN '2026-09-19 20:00:00' AND '2026-09-19 23:00:00' ORDER BY id DESC LIMIT 40",ARRAY_A);
      // partiju nurasymai (jei yra zurnalas)
      $o['partiju_stulp']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_partijos");
      $o['partiju_nurasymai_lentele']=$wpdb->get_col("SHOW TABLES LIKE '{$p}ps_partij%'");
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
