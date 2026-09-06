<?php
/** TEMP PS S1622 r2 — RECON: #35821 (telefoninis pavedimu) AVPN/IAPV metos ir pastabos — ar AVPN išrašyta dar on-hold. */
add_action('init', function(){
  if (!isset($_GET['ps_r2'])) return;
  $o=array('v'=>'S1622 r2'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  foreach(array(35821,35820) as $id){ $x=wc_get_order($id); $m=array(); foreach($x->get_meta_data() as $md){ if(preg_match('/petshop_(avpn|iapv|order_pdf|completed_pdf)|_ps_telefonu|_date_paid/i',$md->key)) $m[$md->key]=mb_substr(is_scalar($md->value)?(string)$md->value:json_encode($md->value),0,80); }
    $o[$id]=array('st'=>$x->get_status(),'paid'=>$x->get_date_paid()?$x->get_date_paid()->date('H:i:s'):null,'meta'=>$m,'pastabos'=>array_map(function($n){return mb_substr($n->date_created->date('H:i:s').' '.$n->content,0,140);},array_reverse(wc_get_order_notes(array('order_id'=>$id,'limit'=>12))))); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
