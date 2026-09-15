<?php
/** TEMP PS S1683t m — read-only: #1057 eilutės 2049 meta, prekės 18245 likutis/AV, sprendimas(), ir kiti processing užsakymai su AV eilutėmis be _reduced_stock. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tm'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1683t m');
  $w=wc_get_order(35955); foreach($w->get_items() as $iid=>$it){ $mm=array(); foreach($it->get_meta_data() as $m) $mm[$m->key]=substr(json_encode($m->value,JSON_UNESCAPED_UNICODE),0,80); $o['item'][$iid]=$mm; }
  $pr=wc_get_product(18245); $o['preke']=array('stock'=>$pr->get_stock_quantity(),'mng'=>$pr->get_manage_stock(),'status'=>$pr->get_stock_status(),'own'=>$pr->get_meta('_own_stock_qty'),'tiek'=>$pr->get_meta('_ps_tiekejas'));
  $r=new ReflectionMethod('Petshop_Desk','sprendimas'); $r->setAccessible(true); $o['sprend']=$r->invoke(null,18245,1);
  $o['stock_log']=$wpdb->get_results("SELECT * FROM {$p}ps_stock_log WHERE product_id=18245 ORDER BY 1 DESC LIMIT 6",ARRAY_A);
  if($wpdb->last_error){ $o['e1']=$wpdb->last_error; $o['stock_log']=$wpdb->get_results("SELECT * FROM {$p}ps_av_stock_log WHERE product_id=18245 ORDER BY 1 DESC LIMIT 6",ARRAY_A); }
  foreach($wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND status='wc-processing'") as $id){ $oo=wc_get_order($id); foreach($oo->get_items() as $iid=>$it){ if('av'!==$it->get_meta('_ps_source')) continue; if(!$it->get_meta('_reduced_stock')&&!$it->get_meta('_ps_av_reduced')) $o['be_reduced'][]=$oo->get_order_number().' iid'.$iid.' av_red_qty='.$it->get_meta('_ps_av_reduced_qty'); } }
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
