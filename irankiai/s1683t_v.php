<?php
/** TEMP PS S1683t v — read-only: 18 EAN-nesutampančių Josera prekių VF SKU pavadinimai (vf_observer) — ar susieta ta pati prekė. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tv'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'v');
  $ids=array(17947,17950,17962,17969,17978,18000,18018,18022,18026,18032,18046,18054,18062,18084,18088,18149,18154,18159);
  foreach($ids as $id){ $sku=get_post_meta($id,'_vf_supplier_sku',true); $t=$wpdb->get_var($wpdb->prepare("SELECT title FROM {$p}vf_observer WHERE sku=%s ORDER BY id DESC LIMIT 1",$sku)); $o['r'][]=$id.' | '.mb_substr(html_entity_decode(get_the_title($id)),0,55).' | '.$sku.' → '.($t?:'(observer nerado)').' | '.get_post_meta($id,'_price',true).' vs xml '.get_post_meta($id,'_vf_cost_xml',true); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
