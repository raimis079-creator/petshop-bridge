<?php
/** TEMP PS S1685 mv — RECON read-only: užsakymo 35948 MnM eilučių meta (_mnm_config struktūra, _mnm_container reikšmė). */
add_action('init', function(){
  if (!isset($_GET['ps_s1685mv'])) return; $o=array('v'=>'S1685 mv'); $ord=wc_get_order(35948);
  foreach($ord->get_items() as $it){ $o['it'][]=array('id'=>$it->get_id(),'n'=>substr($it->get_name(),0,30),'pid'=>$it->get_product_id(),'cont'=>$it->get_meta('_mnm_container'),'cfg'=>$it->get_meta('_mnm_config')?json_encode($it->get_meta('_mnm_config')):null,'metakeys'=>array_keys($it->get_meta_data()?array_column(array_map(function($m){return $m->get_data();},$it->get_meta_data()),'value','key'):array())); if(count($o['it'])>4) break; }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
