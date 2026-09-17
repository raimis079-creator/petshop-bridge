<?php
/** TEMP PS S1690 b — šiandienos nesėkmingi užsakymai: pastabos, klientas, Paysera. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1690b'])) return; global $wpdb; $p=$wpdb->prefix; $o=array(); $wpdb->suppress_errors(true);
  $ids=$wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND date_created_gmt>=UTC_DATE()-INTERVAL 3 HOUR ORDER BY id");
  foreach($ids as $id){ $ord=wc_get_order($id); if(!$ord) continue;
    $n=array(); foreach(wc_get_order_notes(array('order_id'=>$id,'limit'=>8)) as $nt) $n[]=substr($nt->date_created->date('H:i'),0,5).' '.mb_substr(preg_replace('/\s+/',' ',$nt->content),0,110);
    $it=array(); foreach($ord->get_items() as $i) $it[]=$i->get_name().' x'.$i->get_quantity();
    $o['uzs'][]=array('id'=>$id,'st'=>$ord->get_status(),'t'=>$ord->get_total(),'pm'=>$ord->get_payment_method(),'uid'=>$ord->get_customer_id(),'reg'=>$ord->get_customer_id()?get_userdata($ord->get_customer_id())->user_registered:'','email'=>substr($ord->get_billing_email(),0,3).'…','sukurtas'=>$ord->get_date_created()->date('H:i'),'via'=>$ord->get_created_via(),'prekes'=>$it,'pastabos'=>$n);
  }
  // WC log failai place-order-debug: šiandien pagal baigtį
  $dir=WC_LOG_DIR; $f=glob($dir.'place-order-debug-'.date('Y-m-d').'*.log'); $o['log_failai']=array_map('basename',glob($dir.'place-order-debug-*.log'));
  $c=array(); foreach($f as $ff){ foreach(file($ff) as $l){ if(preg_match('/(Validation error|Start|totals calculated|already registered|jau yra|not enough|nepakankam|error)/iu',$l,$m)){ $k=strtolower($m[1]); $c[$k]=($c[$k]??0)+1; } } }
  $o['log_siandien']=$c;
  $o['paskutinis_log']=array(); foreach($f as $ff){ $ls=file($ff); $o['paskutinis_log']=array_map(function($x){return mb_substr($x,0,220);},array_slice($ls,-25)); }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
