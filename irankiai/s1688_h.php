<?php
/** TEMP PS S1688 h — read-only: užsakymai su 4 Exclusion Intestinal/Hepatic prekėmis (visi statusai, 30 d.) — nr, būsena, kiekis, kelias, klientas. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688h'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1688 h');
  $rows=$wpdb->get_results("SELECT oi.order_id,oi.order_item_id,oim.meta_value pid FROM {$p}woocommerce_order_items oi JOIN {$p}woocommerce_order_itemmeta oim ON oim.order_item_id=oi.order_item_id AND oim.meta_key='_product_id' AND oim.meta_value IN(18545,18548,18551,18623) JOIN {$p}wc_orders w ON w.id=oi.order_id WHERE w.date_created_gmt>=DATE_SUB(NOW(),INTERVAL 30 DAY)",ARRAY_A);
  foreach($rows as $r){ $w=wc_get_order($r['order_id']); $it=$w->get_item($r['order_item_id']); $o['uzs'][]=array('nr'=>$w->get_order_number(),'st'=>$w->get_status(),'sukurta'=>$w->get_date_created()->date('m-d H:i'),'kl'=>$w->get_billing_first_name().' '.$w->get_billing_last_name(),'preke'=>$it->get_name(),'q'=>$it->get_quantity(),'suma'=>$it->get_total(),'kelias'=>$it->get_meta('_ps_kelias').'/'.$it->get_meta('_ps_source'),'issiusta'=>$w->get_meta('_ps_dalys_issiusta'),'pastabos'=>array_map(function($n){return substr($n->content,0,90);},array_slice(wc_get_order_notes(array('order_id'=>$r['order_id'],'limit'=>4)),0,4))); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
