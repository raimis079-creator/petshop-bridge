<?php
/** TEMP PS S1683 a — read-only: #1053 — statusas, siuntimas, meta (_ps_*, venipak/lp klaidos), pastabos, fakt_siuntos, darbalaukio siuntos_klaida. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683a'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1683 a');
  $id=$wpdb->get_var("SELECT order_id FROM {$p}wc_orders_meta WHERE meta_key='_ps_order_number' AND meta_value='1053'"); $w=wc_get_order($id);
  $o['id']=$id; $o['status']=$w->get_status(); $o['sukurta']=$w->get_date_created()->date('m-d H:i'); $o['apmok']=$w->get_payment_method(); $o['sm']=implode('|',array_map(function($s){return $s->get_method_id().'#'.$s->get_instance_id().' '.$s->get_name();},$w->get_shipping_methods()));
  $o['salis']=$w->get_billing_country().' '.$w->get_shipping_country().' tel '.$w->get_billing_phone(); $o['suma']=$w->get_total();
  $m=array(); foreach($w->get_meta_data() as $md) if(preg_match('/^_ps_|venipak|lithuania|error|klaid/i',$md->key) && !preg_match('/_ps_ga|_ps_kanalai|_ps_groups/',$md->key)) $m[$md->key]=is_scalar($md->value)?substr((string)$md->value,0,200):json_encode($md->value,JSON_UNESCAPED_UNICODE);
  $o['meta']=$m; $o['items']=array_map(function($it){return $it->get_name().' ×'.$it->get_quantity().' ['.$it->get_meta('_ps_kelias').'/'.$it->get_meta('_ps_eilutes_saltinis').']';},array_values($w->get_items()));
  $o['pastabos']=array_map(function($n){return $n->date_created->date('m-d H:i').' ['.$n->added_by.'] '.substr(wp_strip_all_tags($n->content),0,260);},wc_get_order_notes(array('order_id'=>$id,'limit'=>20)));
  $o['fs']=$wpdb->get_results($wpdb->prepare("SELECT vezejas,siuntos_nr,statusas,problema_kodas,registruota_at FROM {$p}ps_fakt_siuntos WHERE uzsakymas_id=%d",$id),ARRAY_A);
  if(class_exists('Petshop_Darbalaukis')){ $r=new ReflectionMethod('Petshop_Darbalaukis','siuntos_klaida'); $r->setAccessible(true); foreach(array('venipak','lp') as $v) $o['klaida_'.$v]=$r->invoke(null,$w,$v); }
  $o['sargas']=$wpdb->get_results("SELECT laikas,lygis,LEFT(zinute,220) z FROM {$p}ps_sargas_klaidos WHERE laikas>=DATE_SUB(NOW(),INTERVAL 14 HOUR) ORDER BY id DESC LIMIT 8",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
