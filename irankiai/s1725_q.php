<?php
/** Plugin Name: TEMP PS S1725q read-only: užsakymai po NS keitimo (13:11) — mokėjimas, būsena, kliento IP, Paysera pastabos */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1725q'])) return; $r=['v'=>'S1725q']; global $wpdb; $P=$wpdb->prefix;
  try{
    $ids=$wpdb->get_col("SELECT id FROM {$P}wc_orders WHERE type='shop_order' AND date_created_gmt>='2026-09-27 10:11:00' ORDER BY id");
    foreach($ids as $id){ $o=wc_get_order($id); if(!$o) continue; $notes=wc_get_order_notes(['order_id'=>$id,'limit'=>6]);
      $r['uzs'][]=['id'=>$id,'nr'=>$o->get_order_number(),'laikas'=>$o->get_date_created()->date_i18n('H:i'),'bus'=>$o->get_status(),'mok'=>$o->get_payment_method(),'apmoketa'=>$o->get_date_paid()?$o->get_date_paid()->date_i18n('H:i'):null,'suma'=>$o->get_total(),'ip'=>$o->get_customer_ip_address(),'pastabos'=>array_map(function($n){return mb_substr(wp_strip_all_tags($n->content),0,90);},$notes)]; }
    $r['cf_diapazonas_ip']=[]; foreach(($r['uzs']??[]) as $u){ if(preg_match('/^(172\.(6[4-9]|7[01])|104\.(1[6-9]|2[0-9]|3[01])|162\.15[89]|141\.101|108\.162|190\.93|188\.114|197\.234|198\.41|173\.245|103\.(21|22|31)|131\.0\.72)\./',$u['ip'])) $r['cf_diapazonas_ip'][]=$u['nr']; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
}, 1);
