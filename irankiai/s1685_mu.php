<?php
/** TEMP PS S1685 mu — TESTAS serverio pusėje: endpoint'o logika (krepšelis iš užsakymo 35948 su MnM) — kiek prekių sudedama, klaidos; krepšelis tik šios užklausos sesijoje. */
add_action('wp_loaded', function(){
  if (!isset($_GET['ps_s1685mu'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 mu'); $uid=2530; $oid=35948; $ord=wc_get_order($oid);
  $pid=(int)$wpdb->get_var($wpdb->prepare("SELECT product_id FROM {$p}ps_refill_tracking WHERE user_id=%d AND last_order_id=%d LIMIT 1",$uid,$oid)); $g=Petshop_Pakartoti::grupe($uid,$pid);
  $o['prekes']=array_map(function($x){return ($x['rinkinys']?'[R] ':'').$x['pav'].' ×'.$x['kiekis'].' '.round($x['kaina'],2);},$g['prekes']);
  wc_load_cart(); WC()->cart->empty_cart(); $items=$ord->get_items(); $res=array();
  foreach($g['prekes'] as $pr){ $it=$items[$pr['item_id']]; $data=apply_filters('woocommerce_order_again_cart_item_data',array(),$it,$ord); $o['data_keys'][]=array_keys($data);
    try{ $k=WC()->cart->add_to_cart($pr['pid'],$pr['kiekis'],0,array(),$data); $res[]=$k?'ok':'FAIL'; }catch(Exception $e){ $res[]='EXC '.$e->getMessage(); } }
  $o['add']=$res; $o['notices']=wc_get_notices(); WC()->cart->calculate_totals(); $o['cart']=array(); foreach(WC()->cart->get_cart() as $ci){ $o['cart'][]=$ci['data']->get_name().' ×'.$ci['quantity'].' '.round($ci['line_total']+$ci['line_tax'],2); } $o['total']=WC()->cart->get_total('edit');
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
