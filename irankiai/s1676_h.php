<?php
/** TEMP PS S1676 run h — cart 'converted' kada; payment_failed laiško laikas; ar po atšaukimo krepšelis grįžta. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676h'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 h');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $s=file_get_contents(WP_PLUGIN_DIR.'/petshop-core/includes/class-cart-abandonment.php'); $L=explode("\n",$s);
  foreach($L as $i=>$l){ if(preg_match("/converted|add_action|const |status.*=.*'(active|abandoned|expired)'|cancelled|order_id/",$l)) $o['cart'][]=($i+1).': '.trim(mb_substr($l,0,200)); }
  $s2=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-payment-failed.php'); $L2=explode("\n",$s2);
  foreach($L2 as $i=>$l){ if(preg_match("/add_action|MINUT|3600|\* 60|HOUR|delay|pending|on-hold|bacs|paysera|cron|schedule|function /i",$l)) $o['pf'][]=($i+1).': '.trim(mb_substr($l,0,200)); }
  $o['pf_head']=mb_substr($s2,0,1500);
  // faktas: paskutiniai payment_failed jobs + ar tas pats email gavo cart_abandoned po to
  $o['pf_jobs']=$wpdb->get_results("SELECT id,flow,status,skip_reason,created_at,sent_at FROM {$p}ps_email_jobs WHERE flow IN ('payment_failed','cart_abandoned','cart_abandoned_2') AND created_at>DATE_SUB(NOW(),INTERVAL 5 DAY) ORDER BY created_at",ARRAY_A);
  $o['carts_conv']=$wpdb->get_results("SELECT id,status,order_id,updated_at FROM {$p}ps_carts WHERE order_id>0 AND updated_at>DATE_SUB(NOW(),INTERVAL 5 DAY) ORDER BY updated_at DESC LIMIT 12",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
