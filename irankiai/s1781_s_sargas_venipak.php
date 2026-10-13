<?php
/** Plugin Name: TEMP PS S1781s sargas: Venipak numeris be registracijos (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1781s'])) return; global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1781s'];
  try{
    $rows=$wpdb->get_results("SELECT m.order_id, n.meta_value nr, o.status, o.date_created_gmt d, m.meta_value vd FROM {$P}wc_orders_meta m JOIN {$P}wc_orders o ON o.id=m.order_id LEFT JOIN {$P}wc_orders_meta n ON n.order_id=m.order_id AND n.meta_key='_ps_order_number' WHERE m.meta_key='venipak_shipping_order_data' AND o.date_created_gmt>=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 45 DAY) ORDER BY m.order_id DESC",ARRAY_A); $out=[]; $n=0; $st=[];
    foreach($rows as $x){ $d=json_decode($x['vd'],true); if(!is_array($d)) continue; $n++; $s=(string)($d['status']??''); $st[$s]=($st[$s]??0)+1; if(!empty($d['pack_numbers']) && 'sent'!==$s) $out[]='#'.$x['nr'].' '.$x['status'].' '.substr($x['d'],0,10).' nr '.implode(',',(array)$d['pack_numbers']).' status="'.$s.'" '.mb_substr((string)($d['error_message']??''),0,70); }
    $r['tikrinta_45d']=$n; $r['statusai']=$st; $r['numeris_be_sent']=$out;
    $r['desk_md5']=md5_file(WPMU_PLUGIN_DIR.'/petshop-desk.php');
  }catch(Throwable $e){ $r['err']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
