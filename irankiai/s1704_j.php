<?php
/** Plugin Name: TEMP PS S1704j order_type naudojimas */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704j'])?$_GET['ps_s1704j']:''); if($f!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704j');
  try{
    global $wpdb; $p=$wpdb->prefix;
    $rad=array();
    foreach(scandir(WPMU_PLUGIN_DIR) as $fn){ if(substr($fn,-4)!=='.php') continue; $c=@file_get_contents(WPMU_PLUGIN_DIR.'/'.$fn); if($c===false) continue;
      foreach(explode("\n",$c) as $i=>$ln){
        if(strpos($ln,'_ps_order_type')!==false||strpos($ln,'nuspresta(')!==false||strpos($ln,'_ps_decided_at')!==false) $rad[]=$fn.':'.($i+1).' '.trim(substr($ln,0,170)); } }
    $o['order_type_naudojimas']=$rad;
    // ar bacs/on-hold uzsakymai (kelias fiksuotas pries apmokejima) darbalaukyje kelia problemu — kiek tokiu buvo
    $o['onhold_su_keliu']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders o JOIN {$p}wc_orders_meta m ON m.order_id=o.id AND m.meta_key='_ps_order_type' WHERE o.payment_method='bacs' AND o.date_created_gmt>='2026-09-07'");
    // uzsakymo eiga: ar Paysera pending uzsakymai kada nors pereina i on-hold
    $o['statusai']=$wpdb->get_results("SELECT status, payment_method, COUNT(*) n FROM {$p}wc_orders WHERE date_created_gmt>='2026-09-07' GROUP BY status,payment_method",ARRAY_A);
    // patikra vienos NE prekes 19396 partijos
    $o['p19396']=$wpdb->get_results("SELECT id,gauta,kiekis_gautas,kiekis_liko,tiekejas,atsaukta,pastaba FROM {$p}ps_partijos WHERE product_id=19396",ARRAY_A);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
