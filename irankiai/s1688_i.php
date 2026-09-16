<?php
/** TEMP PS S1688 i — 4 Exclusion Intestinal/Hepatic → draft (Raimio nurodymu); #1081 vidinė pastaba (klientei NErašyti — Raimis pats). */
add_action('init', function(){
  if (!isset($_GET['ps_s1688i'])) return; $o=array('v'=>'S1688 i');
  foreach(array(18545,18548,18551,18623) as $id){ $r=wp_update_post(array('ID'=>$id,'post_status'=>'draft'),true); $o['draft'][$id]=is_wp_error($r)?$r->get_error_message():get_post_status($id); }
  $w=wc_get_order(35979); if($w&&$w->get_order_number()=='1081'){ $w->add_order_note('S1688: prekė INPS06 (Exclusion Intestinal 7 kg) NĖRA nei AV, nei VF — AV likutis buvo fiktyvus iš T-0 importo. Klientei rašo Raimis pats. NESIŲSTI.',false,true); $o['note']='ok'; }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
