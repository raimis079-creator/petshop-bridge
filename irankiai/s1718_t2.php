<?php
/** Plugin Name: TEMP PS S1718t2 — ps_sources tėvo vs variacijų (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1718t2'])) return; global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1718t2'];
  foreach([14987,15484,15942,19262] as $pid){ $p=wc_get_product($pid); $ids=array_merge([$pid],$p->get_children());
    $rows=$wpdb->get_results("SELECT product_id,source,stock_qty,cost_net,is_active,is_sellable,priority,synced_at FROM {$P}ps_sources WHERE product_id IN (".implode(',',array_map('intval',$ids)).") ORDER BY product_id",ARRAY_A);
    $r[$pid]=['vars'=>$p->get_children(),'sources'=>$rows,'own_var'=>array_map(function($v){ return [$v,get_post_meta($v,'_own_stock_qty',true),get_post_meta($v,'_stock',true),get_post_meta($v,'_manage_stock',true),get_post_meta($v,'_ps_sandelis',true)]; },$p->get_children())]; }
  $r['sync_kaip']=$wpdb->get_row("SELECT COUNT(*) n, SUM(source='av') av, SUM(is_active=1) akt FROM {$P}ps_sources WHERE product_id IN (SELECT ID FROM {$wpdb->posts} WHERE post_type='product_variation')",ARRAY_A);
  // kur naudojama tevo ps_sources: paieska mu-plugins kode
  $hits=[]; foreach(glob(WPMU_PLUGIN_DIR.'/*.php') as $f){ $c=file_get_contents($f); if(preg_match('/is_type\(\s*.variable/',$c)||strpos($c,'get_children')!==false){ if(strpos($c,'ps_sources')!==false||strpos($c,'Petshop_Sources')!==false) $hits[]=basename($f); } }
  $r['mu_variable_ir_sources']=$hits;
  wp_send_json($r);
},1);
