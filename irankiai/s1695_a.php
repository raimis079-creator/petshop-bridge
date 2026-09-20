<?php
/** TEMP PS S1695 a — užsakymas #1120: eilutės, būsena, mokėjimas, pristatymas, pastabos, ps meta, kelias (AV/dropship), siuntos. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1695a'])) return; global $wpdb; $o=array(); $p=$wpdb->prefix;
  $ids=$wpdb->get_col("SELECT order_id FROM {$p}wc_orders_meta WHERE meta_key IN ('_order_number','_alg_wc_custom_order_number','_ps_numeris') AND meta_value='1120'");
  if (!$ids) $ids=$wpdb->get_col("SELECT id FROM {$p}wc_orders WHERE id=1120 OR id IN (SELECT order_id FROM {$p}wc_orders_meta WHERE meta_value='1120')");
  $o['ids']=$ids; if (!$ids){ $o['err']='nerastas'; goto out; }
  $w=wc_get_order((int)$ids[0]); if(!$w){ $o['err']='wc_get_order null'; goto out; }
  $o['nr']=$w->get_order_number(); $o['id']=$w->get_id(); $o['status']=$w->get_status(); $o['sukurta']=$w->get_date_created()?$w->get_date_created()->date('Y-m-d H:i'):null; $o['apmoketa']=$w->get_date_paid()?$w->get_date_paid()->date('Y-m-d H:i'):null;
  $o['mokejimas']=$w->get_payment_method().' / '.$w->get_payment_method_title().' | txn='.$w->get_transaction_id(); $o['suma']=$w->get_total().' (prekės '.$w->get_subtotal().', siunta '.$w->get_shipping_total().', nuolaida '.$w->get_discount_total().')';
  $o['klientas']=array('uid'=>$w->get_customer_id(),'email'=>substr($w->get_billing_email(),0,3).'***','vardas'=>$w->get_billing_first_name(),'miestas'=>$w->get_shipping_city()?:$w->get_billing_city(),'tel'=>substr($w->get_billing_phone(),0,4).'***','created_via'=>$w->get_created_via(),'ip'=>$w->get_customer_ip_address(),'ua'=>substr((string)$w->get_customer_user_agent(),0,80));
  foreach ($w->get_shipping_methods() as $s) $o['pristatymas'][]=$s->get_method_id().':'.$s->get_instance_id().' '.$s->get_name().' '.$s->get_total().' meta='.json_encode(array_map('strval',$s->get_meta_data()?array_column(array_map(function($m){return $m->get_data();},$s->get_meta_data()),'value','key'):array()),JSON_UNESCAPED_UNICODE);
  foreach ($w->get_items() as $it){ $pr=$it->get_product(); $pid=$it->get_product_id(); $row=array('pid'=>$pid,'vid'=>$it->get_variation_id(),'sku'=>$pr?$pr->get_sku():null,'pav'=>mb_substr($it->get_name(),0,70),'kiek'=>$it->get_quantity(),'suma'=>$it->get_total(),'tipas'=>$pr?$pr->get_type():null,'stock'=>$pr?$pr->get_stock_quantity():null,'own'=>get_post_meta($pid,'_own_stock_qty',true),'sandelis'=>get_post_meta($pid,'_ps_sandelis',true),'status'=>get_post_status($pid),'kaina_dabar'=>$pr?$pr->get_price():null,'reg'=>$pr?$pr->get_regular_price():null);
    $md=array(); foreach ($it->get_meta_data() as $m){ $d=$m->get_data(); $md[$d['key']]=is_scalar($d['value'])?mb_substr((string)$d['value'],0,80):json_encode($d['value'],JSON_UNESCAPED_UNICODE); } $row['meta']=$md; $o['eilutes'][]=$row; }
  foreach ($w->get_items('coupon') as $c) $o['kuponai'][]=$c->get_code().' '.$c->get_discount();
  foreach ($w->get_items('fee') as $c) $o['mokesciai'][]=$c->get_name().' '.$c->get_total();
  $meta=array(); foreach ($w->get_meta_data() as $m){ $d=$m->get_data(); if (preg_match('/^_ps_|gclid|paysera|_dp_|_reduced|_av|venipak|lp_|kelias|_alg|rinkin|mnm|_billing_|shipping_method|_created|_order_number|_cart_hash|is_vat_exempt|_customer/i',$d['key'])) $meta[$d['key']]=is_scalar($d['value'])?mb_substr((string)$d['value'],0,160):mb_substr(json_encode($d['value'],JSON_UNESCAPED_UNICODE),0,300); } $o['meta']=$meta;
  $o['pastabos']=array_map(function($n){return $n->date_created->date('m-d H:i').' ['.($n->customer_note?'klientui':'vidinė').'] '.$n->added_by.': '.mb_substr(wp_strip_all_tags($n->content),0,220);},wc_get_order_notes(array('order_id'=>$w->get_id(),'limit'=>25)));
  $o['kliento_pastaba']=$w->get_customer_note();
  $o['fakt']=$wpdb->get_row($wpdb->prepare("SELECT * FROM {$p}ps_fakt_uzsakymai WHERE uzsakymas_id=%d",$w->get_id()),ARRAY_A);
  $o['siuntos']=$wpdb->get_results($wpdb->prepare("SELECT * FROM {$p}ps_fakt_siuntos WHERE uzsakymas_id=%d",$w->get_id()),ARRAY_A);
  $o['tiekimas']=$wpdb->get_results($wpdb->prepare("SELECT * FROM {$p}ps_tiekimas WHERE uzsakymas_id=%d",$w->get_id()),ARRAY_A);
  $o['db_err']=$wpdb->last_error;
  // kiti to paties kliento užsakymai
  $o['kliento_kiti']=$wpdb->get_results($wpdb->prepare("SELECT id,status,total_amount,date_created_gmt FROM {$p}wc_orders WHERE billing_email=%s AND id<>%d ORDER BY id DESC LIMIT 6",$w->get_billing_email(),$w->get_id()),ARRAY_A);
  out:
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
