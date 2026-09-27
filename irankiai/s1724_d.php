<?php
/** Plugin Name: TEMP PS S1724d dropship-sargas pilnas kodas + 3 pazymeti uzsakymai read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724d'])) return;
  $r=['v'=>'S1724d']; global $wpdb; $p=$wpdb->prefix; $tz=new DateTimeZone('Europe/Vilnius');
  try{
    $r['kodas']=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-dropship-sargas.php');
    $ids=$wpdb->get_col("SELECT m.order_id FROM {$p}wc_orders_meta m JOIN {$p}wc_orders o ON o.id=m.order_id WHERE m.meta_key='_ps_sla_velavimas' AND o.status IN ('wc-processing','wc-on-hold')");
    foreach($ids as $id){ $o=wc_get_order($id); if(!$o) continue; $x=['nr'=>$o->get_order_number(),'status'=>$o->get_status(),'sukurta'=>$o->get_date_created()->setTimezone($tz)->format('m-d H:i D')];
      foreach(['_ps_sla_velavimas','_ps_dropship_sent','_ps_dropship_sent_src','_ps_dropship_to','_ps_kelias','_ps_dalys','_ps_dalys_issiusta','_ps_decided_at'] as $k){ $v=$o->get_meta($k); if($v!==''&&$v!==null) $x[$k]=is_scalar($v)?(string)$v:json_encode($v,JSON_UNESCAPED_UNICODE); }
      $items=[]; foreach($o->get_items() as $it){ $items[]=[$it->get_name(),$it->get_quantity(),$it->get_meta('_ps_source')?:'',$it->get_meta('_ps_kelias')?:'']; } $x['eilutes']=$items;
      $notes=wc_get_order_notes(['order_id'=>$id,'limit'=>8]); $x['pastabos']=array_map(function($n) use($tz){ return $n->date_created->setTimezone($tz)->format('m-d H:i').' '.mb_substr(wp_strip_all_tags($n->content),0,140); },$notes);
      $r['pazymeti'][]=$x; }
    // visi _ps_sla_velavimas per 30 d. (ir uzdaryti) – kiek klaidingu del savaitgalio
    $r['visos_zymes_30d']=$wpdb->get_results("SELECT o.id, o.status, m.meta_value v, DATE_FORMAT(CONVERT_TZ(o.date_created_gmt,'+00:00','+03:00'),'%m-%d %a') sukurta FROM {$p}wc_orders_meta m JOIN {$p}wc_orders o ON o.id=m.order_id WHERE m.meta_key='_ps_sla_velavimas' AND o.date_created_gmt>=UTC_DATE()-INTERVAL 30 DAY ORDER BY o.id",ARRAY_A);
    $r['sent_pvz']=$wpdb->get_results("SELECT o.id, m.meta_value sent FROM {$p}wc_orders_meta m JOIN {$p}wc_orders o ON o.id=m.order_id WHERE m.meta_key='_ps_dropship_sent' ORDER BY o.id DESC LIMIT 5",ARRAY_A);
    $r['dl_LT_SVENTES']=class_exists('Petshop_Darbalaukis')&&defined('Petshop_Darbalaukis::LT_SVENTES')?Petshop_Darbalaukis::LT_SVENTES:null;
    $r['laikas']=(new DateTime('now',$tz))->format('Y-m-d H:i D');
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
