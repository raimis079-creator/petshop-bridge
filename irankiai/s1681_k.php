<?php
/** TEMP PS S1681 k — read-only: kanalų pasiskirstymas nuo T-0 (ps_fakt_uzsakymai) + atšaukti užsakymai (kodėl). */
add_action('init', function(){
  if (!isset($_GET['ps_s1681k'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 k');
  $o['kan']=$wpdb->get_results("SELECT kanalas_paskutinis k,utm_source s,COUNT(*) n,ROUND(SUM(viso_ct)/100) eur FROM {$p}ps_fakt_uzsakymai WHERE saltinis_aplinka='prod' AND testinis=0 GROUP BY k,s ORDER BY n DESC",ARRAY_A);
  $o['mok']=$wpdb->get_results("SELECT mokejimo_budas m,irenginys i,COUNT(*) n FROM {$p}ps_fakt_uzsakymai WHERE saltinis_aplinka='prod' AND testinis=0 GROUP BY m,i",ARRAY_A);
  $ids=$wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND status IN('wc-cancelled','wc-pending','wc-failed','wc-on-hold') AND date_created_gmt>='2026-09-08' ORDER BY id");
  foreach($ids as $id){ $w=wc_get_order($id); $o['ats'][]=array('nr'=>$w->get_order_number(),'st'=>$w->get_status(),'sukurta'=>$w->get_date_created()->date('m-d H:i'),'mok'=>$w->get_payment_method(),'suma'=>$w->get_total(),'src'=>$w->get_meta('_wc_order_attribution_utm_source').'/'.$w->get_meta('_wc_order_attribution_source_type'),'past'=>array_map(function($n){return substr($n->date_created->date('H:i').' '.$n->content,0,110);},array_slice(wc_get_order_notes(array('order_id'=>$id,'limit'=>4)),0,4))); }
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
