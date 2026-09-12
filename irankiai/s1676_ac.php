<?php
/** TEMP PS S1676 run ac — #17397 Monge Solo: partija 4014 (T-0 papildymas = ZB kopija) atšaukiama, AV → 24 (Raimio sprendimas). */
add_action('init', function(){
  if (!isset($_GET['ps_s1676ac'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 ac'); $pid=17397;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['pries']=array('own'=>get_post_meta($pid,'_own_stock_qty',true),'p4014'=>$wpdb->get_row("SELECT kiekis_gautas,kiekis_liko,atsaukta FROM {$p}ps_partijos WHERE id=4014 AND product_id=$pid",ARRAY_A));
  if(!$o['pries']['p4014']||$o['pries']['own']!=='1379'){ $o['STOP']='būklė kitokia'; }
  else {
    update_option('ps_s1676_17397_bak',array('own'=>1379,'partija'=>4014,'laikas'=>current_time('mysql')),false);
    $wpdb->update("{$p}ps_partijos",array('atsaukta'=>1,'kiekis_liko'=>0,'pastaba'=>'Pradinis likutis T-0 (papildymas, S1682) — ATŠAUKTA S1676: tai ZB feed kopija (1 340), ne AV; Raimis: realus AV 24'),array('id'=>4014));
    update_post_meta($pid,'_own_stock_qty',24);
    if(class_exists('Petshop_Ivykiai')) Petshop_Ivykiai::irasyti($pid,'likutis',array('laukas'=>'_own_stock_qty','sena'=>'1379','nauja'=>'24','op_nr'=>'S1676','pastaba'=>'Partija 4014 (T-0 papildymas = ZB kopija) atšaukta; realus AV 24 (Raimis)'));
    wc_delete_product_transients($pid);
    $o['po']=array('own'=>get_post_meta($pid,'_own_stock_qty',true),'p4014'=>$wpdb->get_row("SELECT kiekis_liko,atsaukta FROM {$p}ps_partijos WHERE id=4014",ARRAY_A),'partiju_liko'=>$wpdb->get_var("SELECT SUM(kiekis_liko) FROM {$p}ps_partijos WHERE product_id=$pid AND atsaukta=0"),'src_av'=>$wpdb->get_row("SELECT stock_qty,is_active,updated_at FROM {$p}ps_sources WHERE product_id=$pid AND source='av'",ARRAY_A),'wc_stock'=>wc_get_product($pid)->get_stock_quantity());
  }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
