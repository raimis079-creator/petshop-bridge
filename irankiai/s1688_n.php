<?php
/** TEMP PS S1688 n — read-only: #1058 (id 35956) visos pastabos pilnai + kliento pastaba + LP meta. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688n'])) return; $w=wc_get_order(35956); $o=array('v'=>'n');
  $o['pastabos']=array_map(function($n){return $n->date_created->date('m-d H:i').' ['.$n->added_by.'] '.wp_strip_all_tags($n->content);},wc_get_order_notes(array('order_id'=>35956,'limit'=>40)));
  $o['customer_note']=$w->get_customer_note(); foreach($w->get_meta_data() as $m) if(preg_match('/lithuania|lp_|barcode|track|sekim|pastab/i',$m->key)) $o['meta'][$m->key]=substr(json_encode($m->value,JSON_UNESCAPED_UNICODE),0,120);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
