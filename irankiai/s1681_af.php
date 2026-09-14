<?php
/** TEMP PS S1681 af — read-only: #1009/#1010 pastabos, meta (_ps_*, LP), ps_fakt_siuntos; darbalaukio išsiuntimo/LP metodai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681af'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 af');
  foreach(array(1009,1010) as $nr){ $id=$wpdb->get_var($wpdb->prepare("SELECT order_id FROM {$p}wc_orders_meta WHERE meta_key='_ps_uzsakymo_nr' AND meta_value=%s",$nr)); if(!$id) $id=$wpdb->get_var($wpdb->prepare("SELECT order_id FROM {$p}wc_orders_meta WHERE meta_key='_order_number' AND meta_value=%s",$nr)); if(!$id){ foreach($wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND status='wc-processing'") as $i){ if(wc_get_order($i)->get_order_number()==$nr){ $id=$i; break; } } }
    $w=wc_get_order($id); $m=array(); foreach($w->get_meta_data() as $md) if(preg_match('/^_ps_|lp|lithuania|track|sekim/i',$md->key)) $m[$md->key]=is_scalar($md->value)?substr((string)$md->value,0,120):json_encode($md->value);
    $o['uzs'][$nr]=array('id'=>$id,'status'=>$w->get_status(),'sm'=>implode('|',array_map(function($s){return $s->get_method_id().'#'.$s->get_instance_id().' '.$s->get_name();},$w->get_shipping_methods())),'meta'=>$m,
      'pastabos'=>array_map(function($n){return $n->date_created->date('m-d H:i').' ['.$n->added_by.'] '.substr($n->content,0,200);},wc_get_order_notes(array('order_id'=>$id,'limit'=>15))),
      'fakt_siuntos'=>$wpdb->get_results($wpdb->prepare("SELECT * FROM {$p}ps_fakt_siuntos WHERE order_id=%d",$id),ARRAY_A)); }
  $o['fs_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_fakt_siuntos");
  $s=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); preg_match('/Version:\s*([\d.]+)/i',$s,$mv); $o['dl_ver']=$mv[1]??''; preg_match_all('/function\s+(\w*(issiust|lp_|lipduk|paem|siunt|fakt)\w*)\s*\(([^)]*)\)/i',$s,$mm); $o['dl_fn']=array_map(function($a,$b){return $a.'('.substr($b,0,60).')';},$mm[1],$mm[3]);
  preg_match_all("/case '([a-z_]+)'/",$s,$mc); $o['dl_cases']=array_values(array_unique($mc[1]));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
