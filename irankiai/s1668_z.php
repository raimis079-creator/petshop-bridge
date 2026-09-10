<?php
/** TEMP PS S1668 z — Quattro registro cost_net = _cost_price (likusioms be likučio). DRY/A. */
add_action('init', function(){
  if (!isset($_GET['ps_s1668z'])) return;
  $f=$_GET['ps_s1668z']; global $wpdb; $p=$wpdb->prefix; $S=$p.'ps_sources'; $o=array('v'=>'S1668 z','faze'=>$f);
  $rows=$wpdb->get_results("SELECT s.id,s.product_id,s.cost_net,pm.meta_value cp FROM $S s JOIN {$p}postmeta pm ON pm.post_id=s.product_id AND pm.meta_key='_cost_price' JOIN {$p}postmeta sd ON sd.post_id=s.product_id AND sd.meta_key='_ps_sandelis' AND sd.meta_value='quattro' WHERE s.source='quattro' AND ABS(s.cost_net-pm.meta_value)>0.0001",ARRAY_A);
  $o['skirtingu']=count($rows); $o['pvz']=array_slice($rows,0,5);
  if($f==='A') foreach($rows as $r) $wpdb->update($S,array('cost_net'=>$r['cp'],'updated_at'=>current_time('mysql')),array('id'=>$r['id']));
  if($f==='A') $o['po']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $S s JOIN {$p}postmeta pm ON pm.post_id=s.product_id AND pm.meta_key='_cost_price' WHERE s.source='quattro' AND ABS(s.cost_net-pm.meta_value)>0.0001");
  wp_send_json($o);
});
