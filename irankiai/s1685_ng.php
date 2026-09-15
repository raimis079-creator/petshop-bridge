<?php
/** TEMP PS S1685 ng — BACKFILL (atskira užklausa): visos ps_refill_tracking eilutės purchase_count>=2 per Petshop_Lifecycle_Vartai::pataisyti_eilute — per trumpi intervalai → mediana. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685ng'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1685 ng','ver'=>Petshop_Lifecycle_Vartai::VER); $t=$p.'ps_refill_tracking';
  $rows=$wpdb->get_results("SELECT rt.id, rt.user_id, rt.product_id, rt.last_order_id, rt.avg_interval_days sen, rt.predicted_empty_date sen_d FROM $t rt WHERE rt.purchase_count>=2 AND rt.status='active'",ARRAY_A); $o['n']=count($rows); $o['keista']=array();
  foreach($rows as $r){ $e=$wpdb->get_row($wpdb->prepare("SELECT brendas_slug, svoris_g, kiekis FROM {$p}ps_fakt_eilutes WHERE uzsakymas_id=%d AND preke_id=%d LIMIT 1",$r['last_order_id'],$r['product_id']),ARRAY_A); if(!$e) $e=array('brendas_slug'=>'','svoris_g'=>0,'kiekis'=>1);
    $res=Petshop_Lifecycle_Vartai::pataisyti_eilute($t,(int)$r['user_id'],(int)$r['product_id'],$e['brendas_slug'],(int)$e['svoris_g'],max(1,(int)$e['kiekis'])); if($res){ $n=$wpdb->get_var($wpdb->prepare("SELECT predicted_empty_date FROM $t WHERE id=%d",$r['id'])); $o['keista'][]=$r['product_id'].' '.$e['brendas_slug'].' '.$e['svoris_g'].'g: '.$r['sen'].'d ('.$r['sen_d'].') → '.$res[1].'d ('.$n.')'; } }
  $o['po']=$wpdb->get_results("SELECT status, COUNT(*) n, MIN(predicted_empty_date) mn FROM $t GROUP BY status",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
