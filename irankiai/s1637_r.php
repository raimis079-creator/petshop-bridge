<?php
/** TEMP PS S1637 run r — Apollo klaidos recon (READ-ONLY): AP2020* būklė + visos ne-T-0 partijos + s1637_bak įrašai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1637r'])) return;
  $o=array('v'=>'S1637 r'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $ids=$wpdb->get_results("SELECT post_id,meta_value sku FROM {$p}postmeta WHERE meta_key='_sku' AND meta_value LIKE 'AP2020%'");
  $b37=get_option('ps_s1637_bak',array());
  foreach($ids as $r){ $pid=(int)$r->post_id;
    $o['apollo'][$r->sku]=array('pid'=>$pid,'stock'=>get_post_meta($pid,'_stock',true),'own'=>get_post_meta($pid,'_own_stock_qty',true),
      'vf'=>get_post_meta($pid,'_vf_qty',true),'zb'=>get_post_meta($pid,'_zb_qty',true),'sand'=>get_post_meta($pid,'_ps_sandelis',true),
      'bak37'=>$b37[$pid]??null,
      'partijos'=>$wpdb->get_results($wpdb->prepare("SELECT id,kiekis,kiekis_liko,savikaina,tiekejas,gauta,pastaba FROM {$p}ps_partijos WHERE product_id=%d ORDER BY id",$pid),ARRAY_A));
  }
  $o['ne_t0_partijos']=$wpdb->get_results("SELECT pt.id,pt.product_id,pm.meta_value sku,pt.kiekis,pt.kiekis_liko,pt.savikaina,pt.tiekejas,pt.gauta,pt.pastaba,pt.sukurta FROM {$p}ps_partijos pt LEFT JOIN {$p}postmeta pm ON pm.post_id=pt.product_id AND pm.meta_key='_sku' WHERE pt.pastaba NOT LIKE 'Pradinis likutis T-0%' AND pt.pastaba NOT LIKE 'Fizinis likutis%' ORDER BY pt.id",ARRAY_A);
  $o['partiju_viso']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_partijos");
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
