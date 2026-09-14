<?php
/** TEMP PS S1681 ai — #1009/#1010: įrašyti LP barcode meta iš pastabų, pažymėti išsiųsta per Petshop_Darbalaukis::issiusta($o,$u,true,'av','lp'); patikra: statusas, dalys_issiusta, ps_fakt_siuntos, pastabos. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681ai'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 ai');
  $u=get_user_by('login','raimis'); if(!$u){ $us=get_users(array('role'=>'administrator','search'=>'*aim*','search_columns'=>array('user_login','display_name'))); $u=$us?$us[0]:null; } $o['u']=$u?$u->display_name.' #'.$u->ID:null;
  foreach(array(35889=>'CC116591776LT',35890=>'CC116525114LT') as $id=>$bc){
    $w=wc_get_order($id); $r=array('nr'=>$w->get_order_number(),'pries'=>$w->get_status());
    if(!$w->get_meta('_woo_lithuaniapost_barcode')){ $w->update_meta_data('_woo_lithuaniapost_barcode',$bc); $w->add_order_note('S1681: LP sekimo numeris '.$bc.' įrašytas iš vidinės pastabos (Raimis įdėjo į paštomatą 09-14).',false,true); $w->save(); }
    $w=wc_get_order($id); $r['issiusta']=Petshop_Darbalaukis::issiusta($w,$u,true,'av','lp');
    $w=wc_get_order($id); $r['po']=$w->get_status(); $r['dalys']=$w->get_meta('_ps_dalys_issiusta'); $r['bc']=$w->get_meta('_woo_lithuaniapost_barcode');
    $r['fs']=$wpdb->get_results($wpdb->prepare("SELECT vezejas,siuntos_nr,statusas,registruota_at,isvezta_at,saltinis FROM {$p}ps_fakt_siuntos WHERE uzsakymas_id=%d",$id),ARRAY_A);
    $r['pastabos']=array_map(function($n){return $n->date_created->date('H:i').' '.substr($n->content,0,160);},array_slice(wc_get_order_notes(array('order_id'=>$id,'limit'=>4)),0,4));
    $o['uzs'][]=$r; }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
