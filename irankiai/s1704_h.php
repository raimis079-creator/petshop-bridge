<?php
/** Plugin Name: TEMP PS S1704h paysera kontekstas */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704h'])?$_GET['ps_s1704h']:''); if($f!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704h');
  try{
    $pth=WP_PLUGIN_DIR.'/woo-payment-gateway-paysera/src/Entity/class-paysera-payment-gateway.php';
    $c=file_get_contents($pth); $l=explode("\n",$c);
    $o['eilutes_80_120']=implode("\n",array_slice($l,79,45));
    // kiek Paysera uzsakymu su grynai AV prekemis nuo T-0
    global $wpdb; $p=$wpdb->prefix;
    $o['paysera_uzs']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}wc_orders WHERE payment_method='paysera' AND date_created_gmt>='2026-09-07'");
    $o['kiti_uzs']=$wpdb->get_results("SELECT payment_method, COUNT(*) n FROM {$p}wc_orders WHERE date_created_gmt>='2026-09-07' GROUP BY payment_method",ARRAY_A);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
