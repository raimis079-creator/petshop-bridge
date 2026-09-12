<?php
/** TEMP PS S1676 run w — registro testas prekei be AV eilutės (17689): _own 1 → eilutė atsiranda? Po testo grąžinama kaip buvo. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676w'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 w'); $t=$p.'ps_sources'; $pid=17689;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $o['pries']=array('own'=>get_post_meta($pid,'_own_stock_qty',true),'av_eil'=>$wpdb->get_row($wpdb->prepare("SELECT id,is_active FROM $t WHERE product_id=%d AND source='av'",$pid),ARRAY_A));
  if($o['pries']['own']!=='' || $o['pries']['av_eil']){ $o['STOP']='ne švarus testas'; }
  else {
    update_post_meta($pid,'_own_stock_qty',1);
    $o['po']=array('own'=>get_post_meta($pid,'_own_stock_qty',true),'av_eil'=>$wpdb->get_row($wpdb->prepare("SELECT id,is_active,stock_qty FROM $t WHERE product_id=%d AND source='av'",$pid),ARRAY_A),'saltiniai_av'=>null);
    if(class_exists('Petshop_Sources')){ foreach(Petshop_Sources::saltiniai($pid)['saltiniai'] as $s){ if($s['source']==='av') $o['po']['saltiniai_av']=$s['stock_qty']; } }
    // atstatymas
    delete_post_meta($pid,'_own_stock_qty'); if($o['po']['av_eil']){ $wpdb->delete($t,array('id'=>(int)$o['po']['av_eil']['id'])); }
    $o['atstatyta']=array('own'=>get_post_meta($pid,'_own_stock_qty',true),'av_eil'=>$wpdb->get_row($wpdb->prepare("SELECT id FROM $t WHERE product_id=%d AND source='av'",$pid),ARRAY_A));
  }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
