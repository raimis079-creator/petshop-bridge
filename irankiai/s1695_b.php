<?php
/** TEMP PS S1695 b — #1120 kontekstas: paskyros 3412 užsakymai, šiandienos užsakymai iš to paties IP/el. pašto, kiti šiandienos užs. su 18587, Paysera žurnalas, likučio istorija. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1695b'])) return; global $wpdb; $o=array(); $p=$wpdb->prefix;
  $o['paskyra_3412']=$wpdb->get_results("SELECT id,status,total_amount,date_created_gmt,billing_email,payment_method FROM {$p}wc_orders WHERE customer_id=3412 ORDER BY id DESC LIMIT 8",ARRAY_A);
  $o['user_3412']=$wpdb->get_row("SELECT ID,user_email,user_registered,display_name FROM {$p}users WHERE ID=3412",ARRAY_A);
  $o['siandien']=$wpdb->get_results("SELECT o.id,o.status,o.total_amount,o.date_created_gmt,o.billing_email,o.ip_address,o.payment_method,(SELECT meta_value FROM {$p}wc_orders_meta m WHERE m.order_id=o.id AND m.meta_key='_ps_order_number') nr FROM {$p}wc_orders o WHERE o.date_created_gmt>='2026-09-19 21:00:00' ORDER BY id DESC LIMIT 15",ARRAY_A);
  $o['su_18587_savaite']=$wpdb->get_results("SELECT oi.order_id,o.status,o.date_created_gmt FROM {$p}woocommerce_order_items oi JOIN {$p}woocommerce_order_itemmeta oim ON oim.order_item_id=oi.order_item_id AND oim.meta_key='_product_id' AND oim.meta_value='18587' JOIN {$p}wc_orders o ON o.id=oi.order_id WHERE o.date_created_gmt>='2026-09-13' ORDER BY oi.order_id DESC",ARRAY_A);
  $o['preke_18587']=array('stock'=>get_post_meta(18587,'_stock',true),'vf_qty'=>get_post_meta(18587,'_vf_qty',true),'own'=>get_post_meta(18587,'_own_stock_qty',true),'manage'=>get_post_meta(18587,'_manage_stock',true),'status'=>get_post_meta(18587,'_stock_status',true));
  $o['paysera_log']=$wpdb->get_results("SELECT * FROM {$p}ps_sargas_klaidos WHERE laikas>='2026-09-20' ORDER BY id DESC LIMIT 5",ARRAY_A);
  $o['pastabos_36094_visos']=count(wc_get_order_notes(array('order_id'=>36094,'limit'=>50)));
  $o['darbalaukio_meta']=$wpdb->get_results("SELECT meta_key,LEFT(meta_value,120) v FROM {$p}wc_orders_meta WHERE order_id=36094 AND meta_key LIKE '_ps_%' ORDER BY meta_key",ARRAY_A);
  $o['db_err']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
