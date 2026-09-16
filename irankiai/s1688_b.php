<?php
/** TEMP PS S1688 b — read-only: #18551 partijos įrašai (kada/kaip sukurta), ps_fakt_atsargos_d pirmas AV įrašas, likučio istorija; kiek Exclusion prekių AV su likučiu ir be VF meta. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688b'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1688 b'); $id=18551;
  foreach($wpdb->get_results("SHOW TABLES LIKE '{$p}ps_partij%'",ARRAY_N) as $x) $o['lent'][]=$x[0];
  foreach($o['lent'] as $tb){ $c=$wpdb->get_col("SHOW COLUMNS FROM $tb"); $pc=in_array('product_id',$c)?'product_id':(in_array('preke_id',$c)?'preke_id':null); if($pc) $o[$tb]=$wpdb->get_results("SELECT * FROM $tb WHERE $pc=$id ORDER BY 1 DESC LIMIT 5",ARRAY_A); }
  $o['first_av']=$wpdb->get_row("SELECT data,likutis_av,savikainos_saltinis FROM {$p}ps_fakt_atsargos_d WHERE preke_id=$id AND sandelis='av' ORDER BY data ASC LIMIT 1",ARRAY_A);
  $o['dienos']=$wpdb->get_results("SELECT data,likutis_av FROM {$p}ps_fakt_atsargos_d WHERE preke_id=$id ORDER BY data DESC LIMIT 12",ARRAY_A);
  $o['legacy']=array('legacy_id'=>get_post_meta($id,'_legacy_id',true),'legacy_qty'=>get_post_meta($id,'_legacy_qty',true),'old'=>array_filter(array_map(function($k){return preg_match('/legacy|senos|import|eshop/i',$k)?$k.'='.substr(get_post_meta(18551,$k,true),0,40):null;},array_keys(get_post_meta($id)))));
  $o['excl_av_be_vf']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts po JOIN {$p}postmeta s ON s.post_id=po.ID AND s.meta_key='_ps_sandelis' AND s.meta_value='av' JOIN {$p}postmeta st ON st.post_id=po.ID AND st.meta_key='_stock' AND st.meta_value+0>0 WHERE po.post_type='product' AND po.post_title LIKE 'Exclusion%' AND NOT EXISTS (SELECT 1 FROM {$p}postmeta v WHERE v.post_id=po.ID AND v.meta_key='_vf_supplier_sku')");
  $o['excl_viso']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts WHERE post_type='product' AND post_title LIKE 'Exclusion%' AND post_status='publish'");
  $o['excl_vf']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts po JOIN {$p}postmeta v ON v.post_id=po.ID AND v.meta_key='_vf_supplier_sku' WHERE po.post_type='product' AND po.post_title LIKE 'Exclusion%'");
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
