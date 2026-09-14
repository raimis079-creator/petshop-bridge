<?php
/** TEMP PS S1684 mx — re-backfill ps_refill_tracking (purchase_count=1) per Petshop_Lifecycle_Vartai::pataisyti_eilute (anketa → ciklai); atskira užklausa po deploy. */
add_action('init', function(){
  if (!isset($_GET['ps_s1684mx'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1684 mx','ver'=>Petshop_Lifecycle_Vartai::VER); $t=$p.'ps_refill_tracking';
  $rows=$wpdb->get_results("SELECT rt.id, rt.user_id, rt.product_id, rt.last_order_id FROM $t rt WHERE rt.purchase_count=1",ARRAY_A); $o['n']=count($rows); $o['saltiniai']=array(); $o['pvz']=array();
  foreach($rows as $r){ $e=$wpdb->get_row($wpdb->prepare("SELECT brendas_slug, svoris_g, kiekis FROM {$p}ps_fakt_eilutes WHERE uzsakymas_id=%d AND preke_id=%d LIMIT 1",$r['last_order_id'],$r['product_id']),ARRAY_A); if(!$e) continue; $x=Petshop_Lifecycle_Vartai::pataisyti_eilute($t,(int)$r['user_id'],(int)$r['product_id'],$e['brendas_slug'],(int)$e['svoris_g'],max(1,(int)$e['kiekis'])); if(!$x) continue; $o['saltiniai'][$x[0]]=($o['saltiniai'][$x[0]]??0)+1; if($x[0]==='anketa'&&count($o['pvz'])<6) $o['pvz'][]=$e['brendas_slug'].' '.$e['svoris_g'].'g ×'.$e['kiekis'].' → '.$x[1].' d.'; }
  $o['pets_su_svoriu']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_pets"); 
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
