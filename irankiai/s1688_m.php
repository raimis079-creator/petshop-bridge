<?php
/** TEMP PS S1688 m — #1058: rasti id, LP numerį iš pastabų (CC…LT), įrašyti _woo_lithuaniapost_barcode jei tuščia, issiusta($o,$u,true,'av','lp'); patikra. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688m'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1688 m');
  $id=$wpdb->get_var("SELECT order_id FROM {$p}wc_orders_meta WHERE meta_key='_ps_order_number' AND meta_value='1058'"); if(!$id){ foreach($wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND status IN('wc-processing','wc-on-hold')") as $i) if(wc_get_order($i)->get_order_number()=='1058'){ $id=$i; break; } }
  if(!$id){ $o['STOP']='nerastas'; echo json_encode($o); exit; } $w=wc_get_order($id); $o['id']=$id; $o['pries']=$w->get_status(); $o['sm']=implode('|',array_map(function($s){return $s->get_name();},$w->get_shipping_methods()));
  $notes=wc_get_order_notes(array('order_id'=>$id,'limit'=>30)); $bc=''; foreach($notes as $n){ if(preg_match('/\b([A-Z]{2}\d{9}LT)\b/',wp_strip_all_tags($n->content),$m)){ $bc=$m[1]; break; } }
  $o['pastabos']=array_map(function($n){return $n->date_created->date('m-d H:i').' '.substr(wp_strip_all_tags($n->content),0,110);},array_slice($notes,0,6));
  if(!$bc){ $o['STOP']='LP numeris pastabose nerastas'; echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; } $o['bc']=$bc;
  if(!$w->get_meta('_woo_lithuaniapost_barcode')){ $w->update_meta_data('_woo_lithuaniapost_barcode',$bc); $w->add_order_note('S1688: LP sekimo numeris '.$bc.' įrašytas iš vidinės pastabos (Raimis įdėjo į LP paštomatą 09-16).',false,true); $w->save(); }
  $u=get_user_by('login','raimis'); if(!$u){ $us=get_users(array('role'=>'administrator','search'=>'*aim*','search_columns'=>array('user_login','display_name'))); $u=$us?$us[0]:null; }
  $w=wc_get_order($id); $o['issiusta']=Petshop_Darbalaukis::issiusta($w,$u,true,'av','lp');
  $w=wc_get_order($id); $o['po']=$w->get_status(); $o['dalys']=$w->get_meta('_ps_dalys_issiusta');
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
