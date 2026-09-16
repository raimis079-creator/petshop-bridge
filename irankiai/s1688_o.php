<?php
/** TEMP PS S1688 o — #1058 (35956): LP barcode CC117086595LT iš vidinės pastabos → meta, issiusta($o,$u,true,'av','lp'); patikra. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688o'])) return; $o=array('v'=>'S1688 o'); $w=wc_get_order(35956); $bc='CC117086595LT';
  if(!$w->get_meta('_woo_lithuaniapost_barcode')){ $w->update_meta_data('_woo_lithuaniapost_barcode',$bc); $w->add_order_note('S1688: LP sekimo numeris '.$bc.' įrašytas iš vidinės pastabos (Raimis įdėjo į LP paštomatą 09-16).',false,true); $w->save(); }
  $u=get_user_by('login','raimis'); if(!$u){ $us=get_users(array('role'=>'administrator','search'=>'*aim*','search_columns'=>array('user_login','display_name'))); $u=$us?$us[0]:null; }
  $w=wc_get_order(35956); $o['issiusta']=Petshop_Darbalaukis::issiusta($w,$u,true,'av','lp'); $w=wc_get_order(35956); $o['po']=$w->get_status(); $o['dalys']=$w->get_meta('_ps_dalys_issiusta');
  $o['pask']=array_map(function($n){return $n->date_created->date('H:i').' '.substr(wp_strip_all_tags($n->content),0,120);},array_slice(wc_get_order_notes(array('order_id'=>35956,'limit'=>3)),0,3));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
