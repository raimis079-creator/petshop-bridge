<?php
/** Plugin Name: TEMP PS S1715i variable tevai su manage_stock=yes — mastas read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1715i'])) return;
  global $wpdb; $r=['v'=>'S1715i'];
  $rows=$wpdb->get_results("SELECT p.ID, LEFT(p.post_title,45) t, ss.meta_value st, st.meta_value stock, sa.meta_value sand, (SELECT COUNT(*) FROM {$wpdb->posts} v WHERE v.post_parent=p.ID AND v.post_type='product_variation' AND v.post_status='publish') var_n, (SELECT COUNT(*) FROM {$wpdb->posts} v JOIN {$wpdb->postmeta} vs ON vs.post_id=v.ID AND vs.meta_key='_stock_status' AND vs.meta_value='instock' WHERE v.post_parent=p.ID AND v.post_type='product_variation' AND v.post_status='publish') var_in, (SELECT COUNT(*) FROM {$wpdb->posts} v JOIN {$wpdb->postmeta} vm ON vm.post_id=v.ID AND vm.meta_key='_manage_stock' AND vm.meta_value='yes' WHERE v.post_parent=p.ID AND v.post_type='product_variation' AND v.post_status='publish') var_manage FROM {$wpdb->posts} p JOIN {$wpdb->term_relationships} tr ON tr.object_id=p.ID JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_type' JOIN {$wpdb->terms} tm ON tm.term_id=tt.term_id AND tm.slug='variable' JOIN {$wpdb->postmeta} ms ON ms.post_id=p.ID AND ms.meta_key='_manage_stock' AND ms.meta_value='yes' LEFT JOIN {$wpdb->postmeta} ss ON ss.post_id=p.ID AND ss.meta_key='_stock_status' LEFT JOIN {$wpdb->postmeta} st ON st.post_id=p.ID AND st.meta_key='_stock' LEFT JOIN {$wpdb->postmeta} sa ON sa.post_id=p.ID AND sa.meta_key='_ps_sandelis' WHERE p.post_type='product' AND p.post_status='publish'",ARRAY_A);
  $r['n_tevai_manage_yes']=count($rows);
  $r['tevas_out_var_in']=array_values(array_filter($rows,function($x){return $x['st']==='outofstock'&&(int)$x['var_in']>0;}));
  $r['tevas_stock_gt0']=array_values(array_filter($rows,function($x){return (float)$x['stock']>0;}));
  $r['var_be_manage']=array_values(array_filter($rows,function($x){return (int)$x['var_manage']<(int)$x['var_n'];}));
  $r['visi_variable']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} p JOIN {$wpdb->term_relationships} tr ON tr.object_id=p.ID JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_type' JOIN {$wpdb->terms} tm ON tm.term_id=tt.term_id AND tm.slug='variable' WHERE p.post_type='product' AND p.post_status='publish'");
  $r['sandeliai']=array_count_values(array_map(function($x){return $x['sand']?:'(nera)';},$rows));
  wp_send_json($r);
}, 1);
