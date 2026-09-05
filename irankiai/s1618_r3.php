<?php
/** TEMP PS S1618 run r3 — RECON: temos IAPV/AVPN laiškų kabliai (kada siunčiama išankstinė bacs klientui; kodėl AVPN priskiriamas processing/on-hold), WC laiškų įjungimas, kasos bacs užsakymų meta. */
add_action('init', function(){
  if (!isset($_GET['ps_r3'])) return;
  $o=array('v'=>'S1618 r3'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  $tf=get_stylesheet_directory().'/functions.php'; $lines=file($tf);
  foreach($lines as $i=>$l){ if(preg_match('/add_action|add_filter/',$l) && preg_match('/email|thankyou|order_status|new_order|attachments|invoice|pdf|mail/i',$l)){ $o['kabliai'][]=($i+1).': '.mb_substr(trim($l),0,170); } if(preg_match('/wp_mail\(|->send\(|petshop_get_avpn_number|avpn_counter/',$l)){ $o['siuntimai'][]=($i+1).': '.mb_substr(trim($l),0,170); } }
  // funkcija, kuri priskiria AVPN
  foreach($lines as $i=>$l){ if(preg_match('/function petshop_get_avpn_number|function petshop_generate_invoice_pdf|function petshop_invoice_type|function petshop_.*attach/',$l)){ $o['funkcijos'][]=($i+1).': '.trim($l); } }
  if(preg_match_all('/function (petshop_[a-z_]+)/',implode('',$lines),$fm)){ $o['visos_f']=array_slice($fm[1],0,80); }
  // 260–300 eilutės (tipo nustatymas)
  $o['tipas_src']=implode('',array_slice($lines,259,45));
  foreach(array('woocommerce_customer_on_hold_order_settings','woocommerce_customer_processing_order_settings','woocommerce_new_order_settings','woocommerce_customer_invoice_settings') as $k){ $s=get_option($k); $o['wc_email'][$k]=is_array($s)?array('enabled'=>$s['enabled']??null,'subject'=>$s['subject']??''):$s; }
  foreach(array(35442,35436,35777,35801,35802) as $id){ $x=wc_get_order($id); if(!$x) continue; $o['meta'][$id]=array('st'=>$x->get_status(),'pm'=>$x->get_payment_method(),'avpn'=>$x->get_meta('_petshop_avpn_number'),'iapv'=>$x->get_meta('_petshop_iapv_number'),'pdf'=>basename((string)$x->get_meta('_petshop_completed_pdf')),'iapv_pdf'=>basename((string)$x->get_meta('_petshop_proforma_pdf')),'keys'=>array_values(array_filter(array_map(function($m){return $m->key;},$x->get_meta_data()),function($k){return stripos($k,'petshop')!==false||stripos($k,'pdf')!==false||stripos($k,'iapv')!==false||stripos($k,'avpn')!==false;}))); }
  $o['avpn_counter']=get_option('petshop_avpn_counter'); $o['iapv_counter']=get_option('petshop_iapv_counter');
  $notes=wc_get_order_notes(array('order_id'=>35801,'limit'=>10)); $o['notes_35801']=array_map(function($nn){return mb_substr($nn->content,0,160);},$notes);
  $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'");
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
