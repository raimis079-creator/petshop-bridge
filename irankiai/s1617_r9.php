<?php
/** TEMP PS S1617 run r9 (recon, tik skaitymas): temos base.php pilnas (b64 + md5) kreditinės keitimui (K1), WC get_remaining_refund_amount / get_total_refunded filtrai, refund kūrimo pastabos/laiškų kabliai, `wc_order_fully_refunded` statusas, Faktai hookai (kada rašo), Fakt_Grazinimai reason. */
add_action('init', function(){
  if (!isset($_GET['ps_r9'])) return;
  $o=array('v'=>'S1617 r9'); global $wpdb; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $grep=function($file,$pats,$ctx=1,$max=30,$w=420){ $r=array(); if(!file_exists($file)) return 'NĖRA '.$file; $l=file($file); foreach($l as $i=>$ln){ foreach((array)$pats as $pt){ if(preg_match($pt,$ln)){ $r[]=($i+1).': '.mb_substr(trim(implode(' ⏎ ',array_map('trim',array_slice($l,max(0,$i-$ctx),$ctx*2+1)))),0,$w); break; } } if(count($r)>=$max) break; } return $r; };
  $th=get_stylesheet_directory(); $bf=$th.'/woocommerce-delivery-notes/base.php'; $c=file_get_contents($bf); $o['base']=array('bytes'=>strlen($c),'md5'=>md5($c),'b64'=>base64_encode($c),'lines'=>count(file($bf)));
  $wc=WP_PLUGIN_DIR.'/woocommerce/includes/';
  $o['remaining']=$grep($wc.'class-wc-order.php',array('/function get_remaining_refund_amount/','/function get_total_refunded/','/woocommerce_order_get_total_refunded|apply_filters.*refund/'),3,12,500);
  $o['fully_refunded']=$grep($wc.'wc-order-functions.php',array('/function wc_order_fully_refunded/','/woocommerce_order_fully_refunded_status/','/add_order_note/'),2,12,400);
  $o['refund_emails']=$grep($wc.'class-wc-emails.php',array('/refunded/i'),0,10,300);
  $o['faktai_hooks']=$grep(WPMU_PLUGIN_DIR.'/petshop-faktai.php',array('/add_action\(/'),0,20,300);
  $o['fakt_graz_hooks']=$grep(WPMU_PLUGIN_DIR.'/petshop-fakt-grazinimai.php',array('/add_action\(/','/reason|priezastis/i'),1,14,360);
  $o['avpn_fn']=$grep($th.'/functions.php',array('/function petshop_get_avpn_number/'),14,1,1400);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
